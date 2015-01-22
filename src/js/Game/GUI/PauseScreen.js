(function() {
    'use strict';

    Game.GUI.PauseScreen = function(game, parent) {
        Phaser.Group.call(this, game, parent, 'PauseScreen');

        /**
         * The padding in pixels between buttons
         * @type {Number}
         */
        this.padding = 20;

        var bmd = this.game.make.bitmapData(this.game.width, this.game.height);
        bmd.fill(0, 0, 0, 0.75);
        /**
         * The pause screen background
         * @type {Phaser}
         */
        this.bg = new Phaser.Image(this.game, 0, 0, bmd);
        this.bg.bmd = bmd;
        this.add(this.bg);

        /**
         * The resume button
         * @type {Game.GUI.Button}
         */
        this.resumeBtn = new Game.GUI.Button(this.game, this.game.width * 0.5, this.game.height * 0.4, 'knapp', 'Resume', 'font', this.resume, this);
        this.resumeBtn.scale.setTo(0.8);
        this.add(this.resumeBtn);

        /**
         * The toggle multiplayer button
         * @type {Game.GUI.Button}
         */
        this.multiplayerBtn = new Game.GUI.Button(this.game, this.game.width * 0.5, this.resumeBtn.position.y + this.resumeBtn.height + this.padding, 'knapp', 'Multiplayer:\noff', 'font', this.toggleMultiplayer, this);
        this.multiplayerBtn.scale.setTo(0.8);
        this.multiplayerBtn.position.x -= (this.multiplayerBtn.width + this.padding) * 0.5;
        this.add(this.multiplayerBtn);

        /**
         * The toggle music button
         * @type {Game.GUI.Button}
         */
        this.musicBtn = new Game.GUI.Button(this.game, this.game.width * 0.5, this.multiplayerBtn.position.y + this.multiplayerBtn.height + this.padding, 'knapp', 'music_btn', 'font', this.toggleMusic, this);
        this.musicBtn.scale.setTo(0.8);
        this.musicBtn.position.x -= (this.musicBtn.width + this.padding) * 0.5;
        this._refreshMusicBtn();
        this.add(this.musicBtn);

        /**
         * The toggle mute button
         * @type {Game}
         */
        this.toggleMuteBtn = new Game.GUI.Button(this.game, this.game.width * 0.5, this.musicBtn.position.y, 'knapp', 'mute_btn', 'font', this.toggleMute, this);
        this.toggleMuteBtn.scale.setTo(0.8);
        this.toggleMuteBtn.position.x += (this.toggleMuteBtn.width + this.padding) * 0.5;
        this._refreshMuteBtn();
        this.add(this.toggleMuteBtn);

        /**
         * The toggle fullscreen button
         * @type {Game.GUI.Button}
         */
        this.fullscreen = new Game.GUI.Button(this.game, this.game.width * 0.5, this.resumeBtn.position.y + this.resumeBtn.height + this.padding, 'knapp', 'Toggle\nFullscreen', 'font', this.toggleFullscreen, this);
        this.fullscreen.scale.setTo(0.8);
        this.fullscreen.position.x += (this.musicBtn.width + this.padding) * 0.5;
        this.add(this.fullscreen);




        this.alpha = 0;
        this.game.add.tween(this).to({alpha: 1}, 300).start();
    };

    Game.GUI.PauseScreen.prototype = Object.create(Phaser.Group.prototype);
    Game.GUI.PauseScreen.prototype.constructor = Game.GUI.PauseScreen;

    Game.GUI.PauseScreen.prototype.resume = function() {
        this.game.add.tween(this).to({alpha: 0}, 300).start().onComplete.add(function() {
            this.game.state.getCurrentState().resume();
        }, this);
    };

    Game.GUI.PauseScreen.prototype.pause = function() {
        this.game.state.getCurrentState().resume();
    };

    Game.GUI.PauseScreen.prototype.toggleMusic = function() {
        this.game.state.getCurrentState().toggleMusic();
        this._refreshMusicBtn();
    };

    Game.GUI.PauseScreen.prototype.toggleMute = function() {
        this.game.sound.mute = !this.game.sound.mute;
        this._refreshMuteBtn();
    };


    Game.GUI.PauseScreen.prototype._refreshMusicBtn = function() {
        this.musicBtn.text = !this.game.musicMuted ? 'Music: on' : 'Music: off';
    };

    Game.GUI.PauseScreen.prototype._refreshMuteBtn = function() {
        this.toggleMuteBtn.text = this.game.sound.mute ? 'Sound: off' : 'Sound: on';
    };

    Game.GUI.PauseScreen.prototype.toggleFullscreen = function() {
        this.game.state.getCurrentState().toggleFullScreen();
    };

    Game.GUI.PauseScreen.prototype.toggleMultiplayer = function() {
        if (this.game.mpClient) {
            this.game.mpClient.disconnect();
            this.game.mpClient = null;
            this.multiplayerBtn.text = 'Multiplayer:\noff';
        } else {
            if (io) {
                var serverUrl = 'http://{0}:{1}'.format(window.location.hostname, 3001);
                this._createMPClient(serverUrl);
                this.multiplayerBtn.text = 'Multiplayer:\non';
            }
        }
    };

    Game.GUI.PauseScreen.prototype._createMPClient = function(url) {
        this.game.mpClient = new Game.MPClient(this.game, url);
    };

})();
