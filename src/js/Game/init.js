(function() {
    'use strict';

    Game.init = function(game) {};

    Game.init.prototype = {

        /**
         * Load content here, e.g. this.load.image('myDude', '/assets/images/myDude.png')
         */
        preload: function() {},

        /**
         * Initialization logic here
         */
        create: function() {
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

            this.scale.minWidth = 256;
            this.scale.minHeight = 196;
            this.scale.maxWidth = 1280;
            this.scale.maxHeight = 720;

            this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = true;
            this.scale.setScreenSize(true);
        }

    };

})();
