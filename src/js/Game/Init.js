(function() {
    'use strict';

    Game.Init = function(game) {
        this.maxWidth = 1280;
        this.maxHeight = 720;
    };

    Game.Init.prototype = {

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
            this.scale.maxWidth = this.maxWidth;
            this.scale.maxHeight = this.maxHeight;

            this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = true;
            this.scale.setScreenSize(true);

            //Fullscreen mode = maintain aspect radio
            this.game.scale.fullScreenTarget = document.getElementById('game');
            this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.game.scale.enterFullScreen.add(function() {
                delete this.scale.maxWidth;
                delete this.scale.maxHeight;
            }, this);
            this.game.scale.leaveFullScreen.add(function() {
                this.scale.maxWidth = this.maxWidth;
                this.scale.maxHeight = this.maxHeight;
            }, this);

            window.Game.debugMode = this.game.net.getQueryString('debug') === 'true';

            this.state.start('Game.Level');
        }

    };

})();
