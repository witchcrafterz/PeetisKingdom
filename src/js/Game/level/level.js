(function() {
    'use strict';

    Game.level = function(game) {
        this.levelSize = {
            width: 3000,
            height: 720
        };
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

            var bg = this.game.add.tileSprite(0, 0, this.levelSize.width, this.levelSize.height, 'bg');

            var p1 = this.p1 = new Game.player(this.game, this.game.world.centerX, this.game.world.centerY);
            this.game.add.existing(p1);

            this.tileGroup = this.game.add.group();
            var xBound = this.levelSize.width / 70;
            var yBound = this.levelSize.height / 70;
            var rndInt = function(lower, upper) {
                return Math.floor(lower + Math.random() * (upper - lower) - 1);
            };
            for (var i = 0; i < 10; i++) {
                var xStart = rndInt(0, xBound)*70;
                var y = rndInt(yBound * 0.2, yBound)*70;

                for (var x = 0; x < 4; x++) {
                    this.tileGroup.create(xStart + x * 70, y, 'tile', 3);
                }


            }
            this.game.physics.enable(this.tileGroup, Phaser.Physics.ARCADE);
            this.tileGroup.setAll('body.allowGravity', false);
            this.tileGroup.setAll('body.immovable', true);

            this.game.world.setBounds(0, 0, 3000, 720);
            this.game.camera.follow(p1);
            this.game.camera.deadzone = window.Game.cameraDeadzone;

            this.f11 = this.game.input.keyboard.addKey(122);
            this.f11.onUp.add(function() {
                if (this.game.scale.isFullScreen) {
                    this.game.scale.stopFullScreen();
                } else {
                    this.game.scale.startFullScreen(false);
                }                
            }, this);

            music = this.game.add.audio('jorm');
            // music.fadeIn(1000, true);
        },

        update: function() {
            this.game.physics.arcade.collide(this.p1, this.tileGroup);

        }

    };

})();