(function() {
    'use strict';

    /**
     * An AI that guards a position or entrance
     * @param {Phaser.Game}     game                    The game instance
     * @param {Phaser.Sprite}   controlled              The sprite which the AI controls
     * @param {Phaser.Sprite}   toTrack                 The sprite which the AI tracks
     * @param {Phaser.Point}    direction               The direction to flick the tracked if trespassing
     * @param {String}          friendlyCriterias       A string of criterias separated by commas, which will have to be fulfilled for AI to turn friendly
     * @param {String}          friendlyDependencies    A string of dependencies separated by commas, which will have to be fulfilled for AI to turn friendly
     * @param {Number}          range                   The range in pixels that the AI will run to catch the Guard.toTrack
     * @param {Phaser.Point}    defaultPosition         The preferred position for the AI to be in
     */
    Game.Controller.AI.Ornithologist = function(game, controlled, toTrack, direction, friendlyCriterias, friendlyDependencies, range, defaultPosition) {
        Game.Controller.AI.Guard.apply(this, arguments);

        this.range = range;

        this.defaultPosition = defaultPosition;

        return this;
    };

    Game.Controller.AI.Ornithologist.prototype = Object.create(Game.Controller.AI.Guard.prototype);
    Game.Controller.AI.Ornithologist.prototype.constructor = Game.Controller.AI.Ornithologist;

    Game.Controller.AI.Ornithologist.prototype.update = function() {
        Game.Controller.AI.Guard.prototype.update.call(this);

        if (!this.hostile) return;

        var left, right, jump;    
        if (this.range && Math.abs(this.defaultPosition.x - this.toTrack.body.position.x) < this.range && Math.abs(this.defaultPosition.y - this.toTrack.body.position.y) < this.range) {
            left = this.controlled.body.position.x - this.toTrack.body.position.x > 0;
            right = this.controlled.body.position.x - this.toTrack.body.position.x < 0;
        } else {
            left = this.controlled.body.position.x - this.defaultPosition.x > 100;
            right = this.controlled.body.position.x - this.defaultPosition.x < -100;
        }

        jump = (left || right) && (this.controlled.position.y - this.toTrack.position.y > 200);

        if (left) {
            this.left.setDown.call(this);
            this.right.setUp.call(this);
        } else if (right) {
            this.left.setUp.call(this);
            this.right.setDown.call(this);
        } else {
            this.right.setUp.call(this);
            this.left.setUp.call(this);
        }

        if (this.controlled.body.blocked.left || this.controlled.body.blocked.right || jump) {
            this.jump.setDown.call(this);
        } else {
            this.jump.setUp.call(this);

        }
    };

})();
