(function() {
    'use strict';

    Game.utils.BaseState = function(game) {
    };

    Game.utils.BaseState.prototype = {
        getCameraDeadzone: function() {
            var x = this.game.width * 0.35;
            var y = this.game.height * 0.3;
            var width = this.game.width * 0.65 - x;
            var height = this.game.height * 0.7 - y;
            return new Phaser.Rectangle(x, y, width, height);
        }
    };

})();
