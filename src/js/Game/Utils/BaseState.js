(function() {
    'use strict';

    Game.Utils.BaseState = function(game) {
    };

    Game.Utils.BaseState.prototype = {
        getCameraDeadzone: function() {
            var yFactor = 0.4;
            var xFactor = 0.35;

            var x = this.game.width * xFactor;
            var y = this.game.height * yFactor;
            var width = this.game.width * (1 - xFactor) - x;
            var height = this.game.height * (1 - yFactor) - y;
            return new Phaser.Rectangle(x, y, width, height);
        }
    };

})();
