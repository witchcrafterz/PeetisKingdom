(function() {
    'use strict';

    Game.HUD = function(game) {
        Phaser.Group.call(this, game);

        this.fixedToCamera = true;

        this.createMenu();

        return this;
    };

    Game.HUD.prototype = Object.create(Phaser.Group.prototype);
    Game.HUD.prototype.constructor = Game.HUD;

    Game.HUD.prototype.createMenu = function() {
        var menuButton = this.menuButton = new Phaser.Button(this.game, 10, 10, 'UI');

        menuButton.onInputDown.add(function() {
            this.game.state.getCurrentState().togglePause();
        }, this);

        menuButton.frame = 32;

        this.add(menuButton);
    };

})();
