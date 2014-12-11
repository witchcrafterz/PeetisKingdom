(function() {
    'use strict';

    Game.Controller.AI = function(game, controlled) {
        this.game = game;

        this.initialize();

        this.controlled = controlled;

        return this;
    };

    Game.Controller.AI.prototype = Object.create(Game.Controller.prototype);
    Game.Controller.AI.prototype.constructor = Game.Controller.AI;

    Game.Controller.AI.prototype.update = function(toTrack) {
        if (this.game.physics.arcade.intersects(toTrack.body, this.controlled.body)) {

            var dir = toTrack.position.x > this.controlled.position.x ? 1 : -1;

            toTrack.body.position.y -= 5;
            toTrack.body.velocity.setTo(1250 * dir, -3500);
        } else {

        }

        if (toTrack.position.x > this.controlled.position.x) {
            this.right.setDown.call(this);
        } else {
            this.right.setUp.call(this);
        }

        if (toTrack.position.x < this.controlled.position.x) {
            this.left.setDown.call(this);
        } else {
            this.left.setUp.call(this);
        }

        if (toTrack.position.y - this.controlled.position.y < -300) {
            this.jump.setDown.call(this);
        } else {
            this.jump.setUp.call(this);
        }
    };

})();
