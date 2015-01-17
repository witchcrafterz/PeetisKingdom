(function() {
    'use strict';

    /**
     * An AI that guards a position or entrance
     * @param {Phaser.Game}     game        The game instance
     * @param {Phaser.Sprite}   controlled  The sprite which the AI controls
     * @param {Number}          range       How long from default position the pacing AI will walk as furthest
     */
    Game.Controller.AI.Pacing = function(game, controlled, range) {
        this.game = game;

        this.initialize();

        this.controlled = controlled;

        this.range = range || 100;

        this.defaultPosition = controlled.position.clone();

        this.rnd = this.game.state.getCurrentState().rnd;

        this.threshold = 0;
        this.thresholdInc = 0.00005;

        return this;
    };

    Game.Controller.AI.Pacing.prototype = Object.create(Game.Controller.prototype);
    Game.Controller.AI.Pacing.prototype.constructor = Game.Controller.AI.Pacing;

    Game.Controller.AI.Pacing.prototype.update = function() {
        // 0 < rnd.frac() < 1
        if (this.rnd.frac() < this.threshold) {

            // -1 < rnd.normal() < 1
            var dirValue = this.rnd.normal();
            var dirThreshold = (this.controlled.position.x - this.defaultPosition.x) / this.range;

            // true = left, false = right
            var dir  = dirValue < dirThreshold;

            if (dir) {
                this.right.setUp.call(this);
                this.left.setDown.call(this);
            } else {
                this.left.setUp.call(this);
                this.right.setDown.call(this);
            }

            setTimeout(this.stopWalk.bind(this), 150);

            this.threshold = 0;

        } else {
            this.threshold += this.thresholdInc;
        }

        if (this.controlled.body.blocked.left || this.controlled.body.blocked.right) {
            this.jump.setDown.call(this);
        } else {
            this.jump.setUp.call(this);
        }  
    };

    Game.Controller.AI.Pacing.prototype.stopWalk = function() {
        this.right.setUp.call(this);
        this.left.setUp.call(this);
    };

})();
