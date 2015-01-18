(function() {
    'use strict';

    /**
     * An AI that guards a position or entrance
     * @param {Phaser.Game}     game        The game instance
     * @param {Phaser.Sprite}   controlled  The sprite which the AI controls
     * @param {Object}          Properties  Custom properties this AI can use
     */
    Game.Controller.AI.Pacing = function(game, controlled, player, properties) {
        Game.Controller.AI.call(this, game, controlled, player, properties);

        /**
         * The max amounts of pixels this character will walk back and forth.
         * @type {Number}
         */
        this.range = parseInt(properties.range, 10) || 100;

        /**
         * The default position of this character. The character will walk around this point and defaults to the position the character haves when this AI is created.
         * @type {Phaser.Point}
         */
        this.defaultPosition = controlled.position.clone();

        /**
         * A pointer to the states RNG
         * @type {Phaser.RandomDataGenerator}
         */
        this.rnd = this.game.state.getCurrentState().rnd;

        /**
         * The current threshold for moving
         * @type {Number}
         */
        this.threshold = 0;

        /**
         * The amount to increase the threshold with on each unsuccessfull move
         * @type {Number}
         */
        this.thresholdInc = 0.00005;

        return this;
    };

    Game.Controller.AI.Pacing.prototype = Object.create(Game.Controller.AI.prototype);
    Game.Controller.AI.Pacing.prototype.constructor = Game.Controller.AI.Pacing;

    Game.Controller.AI.Pacing.prototype.update = function() {
        Game.Controller.AI.prototype.update.call(this);

        // 0 < rnd.frac() < 1
        if (this.rnd.frac() < this.threshold) {

            // -1 < rnd.normal() < 1
            var dirValue = this.rnd.normal();
            var dirThreshold = (this.controlled.position.x - this.defaultPosition.x) / this.range;

            // true = left, false = right
            var dir  = dirValue < dirThreshold;

            if (dir) {
                this.right.setUp();
                this.left.setDown();
            } else {
                this.left.setUp();
                this.right.setDown();
            }

            setTimeout(this.stopWalk.bind(this), 150);

            this.threshold = 0;

        } else {
            this.threshold += this.thresholdInc;
        }

        if (this.controlled.body.blocked.left || this.controlled.body.blocked.right) {
            this.jump.setDown();
        } else {
            this.jump.setUp();
        }  
    };

    Game.Controller.AI.Pacing.prototype.stopWalk = function() {
        this.right.setUp();
        this.left.setUp();
    };

})();
