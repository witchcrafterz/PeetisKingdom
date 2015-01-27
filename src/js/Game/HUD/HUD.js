(function() {
    'use strict';

    Game.HUD = function(game) {
        Phaser.Group.call(this, game);

        this.fixedToCamera = true;

        this.createMenu();

        this.createHelpBtn();

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

    Game.HUD.prototype.createHelpBtn = function() {
        var helpBtn = this.helpBtn = new Game.GUI.Button(this.game, this.game.width, 20, 'knapp', 'Help', 'font');
        helpBtn.scale.setTo(0.4);
        helpBtn.position.x -= (helpBtn.width * 0.5 + 20);
        // Weird Y-origin on Game.GUI.Button. TODO: fix this
        helpBtn.position.y += 40;

        helpBtn.onInputDown.add(function() {
            this.game.state.getCurrentState().openHelp();
        }, this);

        this.add(helpBtn);
    };


})();
