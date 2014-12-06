(function() {
    'use strict';

    Game.Utils.FpsMeter = function(game, x, y) {

        Phaser.Text.call(this, game, x, y);

        this.game.time.advancedTiming = true;
        this.fixedToCamera = true;

        return this;
    };

    // Clone the Phaser.Sprite prototype, and use it as our own. 
    // This is how inheritance works in JavaScript btw
    Game.Utils.FpsMeter.prototype = Object.create(Phaser.Text.prototype);
    Game.Utils.FpsMeter.prototype.constructor = Game.Utils.FpsMeter;

    Game.Utils.FpsMeter.prototype.update = function() {

        this.text = 'FPS: ' + this.game.time.fps;

    };

})();
