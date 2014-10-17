(function() {
    'use strict';

    Game.level = function(game) {
    };
        var music;

    Game.level.prototype = {

        /**
         * Load content here, e.g. this.load.image('myDude', '/assets/images/myDude.png')
         */
        preload: function() {
            this.game.load.spritesheet('player1', 'assets/player1.png', 80, 97);
            this.game.load.image('bg', 'assets/bg_water.jpg');
            this.game.load.spritesheet('tile', 'assets/spritesheet.png', 70, 70);

            this.game.load.audio('jorm', 'assets/jatten_jorm.wav');
        },


        /**
         * Initialization logic here
         */
        create: function() {
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            this.game.physics.arcade.gravity = Game.gravity;

            console.log(this.game);

            var bg = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'bg');

            var p1 = this.p1 = new Game.player(this.game, this.game.world.centerX, this.game.world.centerY);
            this.game.add.existing(p1);

            for (var x = 0; x < 10; x++) {
                var tile = this.game.add.sprite(70 * x, 70 * 7, 'tile');
                this.game.physics.enable(tile, Phaser.Physics.ARCADE);
                tile.body.allowGravity = false;

            }


            music = this.game.add.audio('jorm');
            music.fadeIn(1000, true);
        },

        update: function() {
        }

    };

})();