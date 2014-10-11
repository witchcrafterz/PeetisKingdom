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
            this.physics.startSystem(Phaser.Physics.ARCADE);
            this.physics.arcade.gravity = Game.gravity;

            var player1 = Game.level.player1 = this.add.sprite(32, 32, 'player1');
            this.physics.enable(player1, Phaser.Physics.ARCADE);

            player1.body.bounce.y = 0.1;
            player1.body.collideWorldBounds = true;

            player1.animations.add('left', [7, 8, 9, 10], 10, true);
            player1.animations.add('turn', [14], 20, true);
            player1.animations.add('right', [7, 8, 9, 10], 10, true);


            Game.level.cursors = this.input.keyboard.createCursorKeys();
            Game.level.jumpButton = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        },

        update: function() {
            if (Game.level.cursors.right.isDown) {
                Game.level.player1.body.velocity.x = 150;

                Game.level.player1.animations.play('right');
            }
        }

    };

})();