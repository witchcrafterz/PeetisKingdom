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

            //Fullscreen mode = maintain aspect radio
            console.log(this.game.scale);
            this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;

            var x = this.game.width * 0.35;
            var y = this.game.height * 0.3;
            var width = this.game.width * 0.65 - x;
            var height = this.game.height * 0.7 - y;
            var deadzone = new Phaser.Rectangle(x, y, width, height);
            window.Game.cameraDeadzone = deadzone;

            window.Game.debugMode = this.game.net.getQueryString('debug') === 'true';

            this.state.start('Game.level');
        }

    };

})();
