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
            this.game.load.image('preloadBarFrame', 'assets/loadingbar_frame.png');
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

            // Refreshes viewport on start to make it correct size
            this.scale.refresh();

            // Disabled auto-pause on game focus lost
            this.stage.disableVisibilityChange = true;

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

            if (self.localStorage && self.localStorage.hasOwnProperty('music')) {
                if (self.localStorage.music === 'true') {
                    // this.game.sound.mute = true;
                    this.game.musicMuted = true;
                } else {
                    // this.game.sound.mute = false;
                    this.game.musicMuted = false;
                }
            }

            this.state.start('Game.MainMenu');
        }
    };
})();
