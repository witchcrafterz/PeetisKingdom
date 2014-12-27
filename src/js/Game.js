(function() {
    'use strict';

    Math.clamp = function(value, lower, upper) {
        return Math.max(Math.min(value, upper), lower);
    };

    /**
     * The main game namespace
     * @namespace
     */
    var Game = function() {
        /**
         * Global game variables here
         */
        
        this.gravity = {
            x: 0,
            y: 3000
        };
    };

    Game.prototype.Utils = function() {

    };

    Game.prototype.GUI = function() {

    };

    window.Game = new Game();

})();
