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
         * The toggle mute button
         * @type {Game.GUI.Button}
         */
        this.mute = new Game.GUI.Button(this.game, this.game.width * 0.5, this.resumeBtn.position.y + this.resumeBtn.height + this.padding, 'knapp', 'mute_btn', 'font', this.toggleMute, this);
        this.mute.scale.setTo(0.8);
        this.mute.position.x -= (this.mute.width + this.padding) * 0.5;
        this._refreshMute();
        this.add(this.mute);

        /**
         * The toggle fullscreen button
         * @type {Game.GUI.Button}
         */
        this.fullscreen = new Game.GUI.Button(this.game, this.game.width * 0.5, this.resumeBtn.position.y + this.resumeBtn.height + this.padding, 'knapp', 'Toggle\nFullscreen', 'font', this.toggleFullscreen, this);
        this.fullscreen.scale.setTo(0.8);
        this.fullscreen.position.x += (this.mute.width + this.padding) * 0.5;
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

    Game.GUI.PauseScreen.prototype.toggleMute = function() {
        var muted = this.game.state.getCurrentState().toggleMusic();

        if (self.localStorage) {
            self.localStorage.music = muted.toString();
        }

        this._refreshMute();
    };

    Game.GUI.PauseScreen.prototype._refreshMute = function(muted) {
        this.mute.text = this.game.state.getCurrentState().music.isPlaying ? 'Mute' : 'Unmute';
    };

    Game.GUI.PauseScreen.prototype.toggleFullscreen = function() {
        this.game.state.getCurrentState().toggleFullScreen();
    };

})();
