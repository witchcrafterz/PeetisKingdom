(function() {
    'use strict';

    /**
     * An AI that guards a position or entrance
     * @param {Phaser.Game}     game                    The game instance
     * @param {Phaser.Sprite}   controlled              The sprite which the AI controls
     */
    Game.Controller.KeyboardController = function(game, controlled) {
        Game.Controller.call(this, game);

        /**
         * The character this controller is controlling
         * @type {Game.Character}
         */
        this.controlled = controlled;
        
        /**
         * A cursor object
         * @type {Object}
         * @type {Phaser.Key}   up
         * @type {Phaser.Key}   down
         * @type {Phaser.Key}   left
         * @type {Phaser.Key}   right
         */
        this.cursors = this.game.input.keyboard.createCursorKeys();

        /**
         * Spacebar key
         * @type {Phaser.Key}
         */
        this.spaceBar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        // Generate touch controls if touch is enabled on device
        if (Modernizr.touchevents) {
            this.generateTouchControls();
        }

        return this;
    };

    Game.Controller.KeyboardController.prototype = Object.create(Game.Controller.prototype);
    Game.Controller.KeyboardController.prototype.constructor = Game.Controller.KeyboardController;

    Game.Controller.KeyboardController.prototype.bindKeys = function() {
        this.cursors.right.onDown.add(this.right.setDown);
        this.cursors.right.onUp.add(this.right.setUp);

        this.cursors.left.onDown.add(this.left.setDown);
        this.cursors.left.onUp.add(this.left.setUp);

        this.spaceBar.onDown.add(this.jump.setDown);
        this.spaceBar.onUp.add(this.jump.setUp);

        this.cursors.down.onDown.add(this.down.setDown);
        this.cursors.down.onUp.add(this.down.setUp);

        this.cursors.up.onDown.add(this.up.setDown);
        this.cursors.up.onUp.add(this.up.setUp);
    };

})();
