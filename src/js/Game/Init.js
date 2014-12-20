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
        preload: function() {
            this.game.load.image('preloadBar', 'assets/loadingbar.png');
        },

        /**
         * Initialization logic here
         */
        create: function() {            
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

            this.scale.minWidth = 256;
            this.scale.minHeight = 196;
            this.scale.maxWidth = this.maxWidth;
            this.scale.maxHeight = this.maxHeight;

            this.scale.refresh();

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
                Phaser.Canvas.setSmoothingEnabled(this.game.context, false);
            }, this);

            if (self.localStorage && self.localStorage.hasOwnProperty('muted')) {
                if (self.localStorage.muted === 'true') {
                    this.game.sound.mute = true;
                } else {
                    this.game.sound.mute = false;
                }
            }

            this.state.start('Game.Level');
        }
    };
})();
