(function() {
    'use strict';

    /**
     * An AI that guards an area
     * @param {Phaser.Game}     game                    The game instance
     * @param {Phaser.Sprite}   controlled              The sprite which the AI controls
     * @param {Object}          Properties              Custom properties this AI can use
     * @param {Phaser.Sprite}   toTrack                 The sprite which the AI tracks
     */
    Game.Controller.AI.Ornithologist = function(game, controlled, player, properties) {
        Game.Controller.AI.Guard.apply(this, arguments);

        /**
         * The amounts of pixels this character will run to get the tracked character
         * @type {Number}
         */
        this.range = parseInt(properties.range, 10) || 100;

        /**
         * The default position of this character. The character will walk around this point and defaults to the position the character haves when this AI is created.
         * @type {Phaser.Point}
         */
        this.defaultPosition = controlled.position.clone();

        // The ornithologists are known for their high speed!
        this.controlled.walkingVelocity = 750;
        this.controlled.walkingAcc = 3000;

        return this;
    };

    Game.Controller.AI.Ornithologist.prototype = Object.create(Game.Controller.AI.Guard.prototype);
    Game.Controller.AI.Ornithologist.prototype.constructor = Game.Controller.AI.Ornithologist;

    Game.Controller.AI.Ornithologist.prototype.update = function() {
        Game.Controller.AI.Guard.prototype.update.call(this);

        if (!this.hostile) return;

        var left, right, jump;    
        if (this.range && Math.abs(this.defaultPosition.x - this.player.body.position.x) < this.range && Math.abs(this.defaultPosition.y - this.player.body.position.y) < this.range) {
            left = this.controlled.body.position.x - this.player.body.position.x > 0;
            right = this.controlled.body.position.x - this.player.body.position.x < 0;
        } else {
            left = this.controlled.body.position.x - this.defaultPosition.x > 100;
            right = this.controlled.body.position.x - this.defaultPosition.x < -100;
        }

        jump = (left || right) && (this.controlled.position.y - this.player.position.y > 100);

        if (left) {
            this.left.setDown();
            this.right.setUp();
        } else if (right) {
            this.left.setUp();
            this.right.setDown();
        } else {
            this.right.setUp();
            this.left.setUp();
        }

        if (this.controlled.body.blocked.left || this.controlled.body.blocked.right || jump) {
            this.jump.setDown();
        } else {
            this.jump.setUp();

        }
    };

})();
