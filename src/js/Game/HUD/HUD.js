(function() {
    'use strict';

    Game.HUD = function(game) {
        Phaser.Group.call(this, game);

        this.fixedToCamera = true;

        return this;
    };

    Game.HUD.prototype = Object.create(Phaser.Group.prototype);
    Game.HUD.prototype.constructor = Game.HUD;

})();
