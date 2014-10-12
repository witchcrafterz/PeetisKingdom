(function() {
    'use strict';

    Game.level = function(game) {
    };

    Game.level.prototype = {

        /**
         * Load content here, e.g. this.load.image('myDude', '/assets/images/myDude.png')
         */
        preload: function() {
            this.load.spritesheet('player1', '/assets/p1_spritesheet.png', 72, 96);

        },

        /**
         * Initialization logic here
         */
        create: function() {
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            this.game.physics.arcade.gravity = Game.gravity;

            var p1 = this.p1 = new Game.player(this.game, this.game.world.centerX, this.game.world.centerY);
            this.game.add.existing(p1);
        },

        update: function() {
        }

    };

})();