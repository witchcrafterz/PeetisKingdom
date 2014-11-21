(function() {
    'use strict';

    Game.level = function(game) {
        this.levelSize = {
            x: 0,
            y: 0,
            width: 3000,
            height: 3720
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

            this.game.load.tilemap('map', 'assets/spel.json', null, Phaser.Tilemap.TILED_JSON);

            this.game.load.audio('jorm', 'assets/jatten_jorm.wav');
        },


        /**
         * Initialization logic here
         */
        create: function() {
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            this.game.physics.arcade.gravity = Game.gravity;

            var bg = this.game.add.tileSprite(this.levelSize.x, this.levelSize.y, this.levelSize.width, this.levelSize.height, 'bg');

            var p1 = this.p1 = new Game.player(this.game, 100, this.game.world.centerY);
            this.game.add.existing(p1);

            var map = this.game.add.tilemap('map');
            console.log(map);
            map.addTilesetImage('tile');
            
            var behind = map.createLayer('behind', this.levelSize.width, this.levelSize.height);
            behind.fixedToCamera = false;

            var level = this.level = map.createLayer('Tile Layer 1', this.levelSize.width, this.levelSize.height);
            level.resizeWorld();
            level.fixedToCamera = false;

            map.setCollisionBetween(0, 150);

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

            if (window.Game.debugMode) {
                this.game.add.existing(new Game.utils.FpsMeter(this.game, 32, 32));
            }

            music = this.game.add.audio('jorm');
            // music.fadeIn(1000, true);
        },

        update: function() {
            this.game.physics.arcade.collide(this.p1, this.level);
        },

        render: function() {
            // this.game.debug.spriteInfo(this.level, 32, 32);
        }
    };
})();
