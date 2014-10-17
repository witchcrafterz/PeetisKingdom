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

            var x = this.game.width * 0.2;
            var y = this.game.height * 0.3;
            var width = this.game.width * 0.8 - x;
            var height = this.game.height * 0.7 - y;
            var deadzone = new Phaser.Rectangle(x, y, width, height);
            console.log(x, y, width, height, deadzone);
            window.Game.cameraDeadzone = deadzone;

            this.state.start('Game.level');
        }

    };

})();
