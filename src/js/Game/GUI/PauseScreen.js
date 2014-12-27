(function() {
    'use strict';

    Game.GUI.PauseScreen = function(game, parent) {
        Phaser.Group.call(this, game, parent, 'PauseScreen');

        this.padding = 20;

        this.resume = new Game.GUI.Button(this.game, this.game.width * 0.5, this.game.height * 0.5, 'knapp', 'Resume', 'font', this.resume, this);
        this.resume.scale.setTo(0.8);
        this.add(this.resume);

        this.mute = new Game.GUI.Button(this.game, this.game.width * 0.5, this.game.height * 0.5 + this.resume.height + this.padding, 'knapp', 'mute_btn', 'font', this.toggleMute, this);
        this.mute.scale.setTo(0.8);
        this.mute.position.x -= (this.mute.width + this.padding) * 0.5;
        this._refreshMute();
        this.add(this.mute);

        this.fullscreen = new Game.GUI.Button(this.game, this.game.width * 0.5, this.game.height * 0.5 + this.resume.height + this.padding, 'knapp', 'Toggle\nFullscreen', 'font', this.toggleFullscreen, this);
        this.fullscreen.scale.setTo(0.8);
        this.fullscreen.position.x += (this.mute.width + this.padding) * 0.5;
        this.add(this.fullscreen);
    };

    Game.GUI.PauseScreen.prototype = Object.create(Phaser.Group.prototype);
    Game.GUI.PauseScreen.prototype.constructor = Game.GUI.PauseScreen;

    Game.GUI.PauseScreen.prototype.resume = function() {
        this.game.state.getCurrentState().resume();
    };

    Game.GUI.PauseScreen.prototype.pause = function() {
        this.game.state.getCurrentState().resume();
    };

    Game.GUI.PauseScreen.prototype.toggleMute = function() {
        this.game.sound.toggleMute();

        if (self.localStorage) {
            self.localStorage.muted = this.game.sound.mute.toString();
        }

        this._refreshMute();
    };

    Game.GUI.PauseScreen.prototype._refreshMute = function() {
        this.mute.text = this.game.sound.mute ? 'Unmute' : 'Mute';
    };

    Game.GUI.PauseScreen.prototype.toggleFullscreen = function() {
        this.game.state.getCurrentState().toggleFullScreen();
    };

})();
