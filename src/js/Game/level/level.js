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
            this.game.load.image('bg', 'assets/bg_castle.png');
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

            this.tileGroup = this.game.add.group();
            for (var x = 0; x < 10; x++) {
                this.tileGroup.create(70 * x, 70 * 7, 'tile', 3);
                // this.game.physics.enable(tile, Phaser.Physics.ARCADE);
                // tile.body.allowGravity = false;

            }
            this.game.physics.enable(this.tileGroup, Phaser.Physics.ARCADE);
            this.tileGroup.setAll('body.allowGravity', false);
            this.tileGroup.setAll('body.immovable', true);

            music = this.game.add.audio('jorm');
            music.fadeIn(1000, true);
        },

        update: function() {
            this.game.physics.arcade.collide(this.p1, this.tileGroup);
        }

    };

})();