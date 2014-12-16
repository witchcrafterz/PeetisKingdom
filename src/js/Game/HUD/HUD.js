(function() {
    'use strict';

    Game.HUD = function(game) {
        Phaser.Group.call(this, game);

        this.fixedToCamera = true;

        this.createMuteButton();
        this.createFullscreenButton();

        return this;
    };

    Game.HUD.prototype = Object.create(Phaser.Group.prototype);
    Game.HUD.prototype.constructor = Game.HUD;

    Game.HUD.prototype.createMuteButton = function() {
        var muteButton = this.muteButton = new Phaser.Button(this.game, 0, 0, 'UI');
        
        muteButton.animations.add('mute', [12]);
        muteButton.animations.add('unMute', [14]);

        if (this.game.sound.mute) {
            muteButton.animations.play('unMute');
        } else {
            muteButton.animations.play('mute');
        }

        muteButton.x = this.game.width - muteButton.width;

        muteButton.onInputDown.add(function() {
            if (this.game.sound.toggleMute()) {
                muteButton.animations.play('unMute');
            } else {
                muteButton.animations.play('mute');
            }

            if (self.localStorage) {
                self.localStorage.muted = this.game.sound.mute.toString();
            }

        }, this);

        this.add(muteButton);
    };

    Game.HUD.prototype.createFullscreenButton = function() {
        var fullscreenButton = this.fullscreenButton = new Phaser.Button(this.game, 0, 0, 'UI');

        fullscreenButton.onInputDown.add(function() {
            this.game.state.states[this.game.state.current].toggleFullScreen();
        }, this);

        fullscreenButton.frame = 29;

        this.add(fullscreenButton);
    };

})();
