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
        var menuButton = this.menuButton = new Game.GUI.Button(this.game, 0, 60, 'knapp', 'Menu', 'font');
        menuButton.scale.setTo(0.4);
        menuButton.position.x = menuButton.width * 0.5 + 20;

        menuButton.onInputDown.add(function() {
            this.game.state.getCurrentState().togglePause();
        }, this);

        this.add(menuButton);
    };

    Game.HUD.prototype.createHelpBtn = function() {
        var helpBtn = this.helpBtn = new Game.GUI.Button(this.game, this.game.width, 60, 'knapp', 'Help', 'font');
        helpBtn.scale.setTo(0.4);
        helpBtn.position.x -= (helpBtn.width * 0.5 + 20);

        helpBtn.onInputDown.add(function() {
            this.game.state.getCurrentState().openHelp();
        }, this);

        this.add(helpBtn);
    };


})();
