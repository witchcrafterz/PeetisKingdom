(function() {
    'use strict';

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

    window.Game = new Game();

})();