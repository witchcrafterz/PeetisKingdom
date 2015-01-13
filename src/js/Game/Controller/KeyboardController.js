(function() {
    'use strict';

    /**
     * An AI that guards a position or entrance
     * @param {Phaser.Game}     game                    The game instance
     * @param {Phaser.Sprite}   controlled              The sprite which the AI controls
     */
    Game.Controller.KeyboardController = function(game, controlled) {
        this.game = game;

        this.initialize();

        this.controlled = controlled;
        
        this.cursors = this.game.input.keyboard.createCursorKeys();

        this.cursors.right.onDown.add(this.right.setDown, this);
        this.cursors.right.onUp.add(this.right.setUp, this);

        this.cursors.left.onDown.add(this.left.setDown, this);
        this.cursors.left.onUp.add(this.left.setUp, this);

        this.spaceBar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.spaceBar.onDown.add(this.jump.setDown, this);
        this.spaceBar.onUp.add(this.jump.setUp, this);

        this.cursors.down.onDown.add(this.down.setDown, this);
        this.cursors.down.onUp.add(this.down.setUp, this);

        this.cursors.up.onDown.add(this.up.setDown, this);
        this.cursors.up.onUp.add(this.up.setUp, this);

        if (Modernizr.touchevents) {
            this.generateTouchControls();
        }

        return this;
    };

    Game.Controller.KeyboardController.prototype = Object.create(Game.Controller.prototype);
    Game.Controller.KeyboardController.prototype.constructor = Game.Controller.KeyboardController;

})();
