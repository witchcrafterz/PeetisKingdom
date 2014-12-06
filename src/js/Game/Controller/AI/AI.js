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
        if (toTrack.position.x - this.controlled.position.x > 500) {
            this.right.setDown.call(this);
        } else {
            this.right.setUp.call(this);
        }

        if (toTrack.position.x - this.controlled.position.x < -500) {
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
