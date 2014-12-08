(function() {
    'use strict';

    Game.Utils.HUD = function(game) {
        Phaser.Group.call(this, game);

        this.fixedToCamera = true;

        this.createMuteButton();

        return this;
    };

    Game.Utils.HUD.prototype = Object.create(Phaser.Group.prototype);
    Game.Utils.HUD.prototype.constructor = Game.Utils.HUD;

    Game.Utils.HUD.prototype.createMuteButton = function() {
        var muteButton = this.muteButton = new Phaser.Button(this.game, 0, 0, 'UI');
        
        muteButton.animations.add('mute', [12]);
        muteButton.animations.add('unMute', [14]);
        muteButton.animations.play('mute');
        muteButton.x = this.game.width - muteButton.width;

        muteButton.onInputDown.add(function() {
            if (this.game.sound.toggleMute()) {
                muteButton.animations.play('unMute');
            } else {
                muteButton.animations.play('mute');
            }
        }, this);

        this.add(muteButton);
    };
})();
