(function() {
    'use strict';

    Game.level = function(game) {
        this.levelSize = {
            x: 0,
            y: 0,
            width: 3000,
            height: 3720
        };

        this.toggleFullScreen = function() {
            if (this.game.scale.isFullScreen) {
                this.game.scale.stopFullScreen();
            } else {
                this.game.scale.startFullScreen(false);
            }
        };

        this.toggleDebug = function() {
            if (this.fpsMeter.stage) {
                this.fpsMeter.parent.remove(this.fpsMeter);
            } else {
                this.game.add.existing(this.fpsMeter);
            }
        };
    };

    Game.level.prototype = _.merge(Object.create(self.Game.utils.BaseState.prototype), {

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

            this.fpsMeter = new Game.utils.FpsMeter(this.game, 32, 32);

            var bg = this.game.add.tileSprite(this.levelSize.x, this.levelSize.y, this.levelSize.width, this.levelSize.height, 'bg');

            var map = this.map = this.game.add.tilemap('map');
            map.addTilesetImage('tile');

            // The layer that the player does not interact with
            var behind = map.createLayer('behind', this.levelSize.width, this.levelSize.height);
            behind.fixedToCamera = false;

            // The layer containing platforms
            var level = this.level = map.createLayer('Tile Layer 1', this.levelSize.width, this.levelSize.height);
            level.resizeWorld();
            level.fixedToCamera = false;

            // Sets collision on block IDs between 0 to 150. Check spritesheet for block index
            map.setCollisionBetween(0, 150);

            _.forEach(map.objects['objects'], function(obj) {
                switch(obj.type) {
                    case 'spawn':
                        this.p1 = new Game.player(this.game, obj.x + obj.width / 2, obj.y + obj.height / 2);
                        this.game.add.existing(this.p1);
                        break;
                }
            }, this);
            
            this.game.camera.follow(this.p1);
            this.game.camera.deadzone = this.getCameraDeadzone();

            // Binds the f11 key to an event
            this.f2 = this.game.input.keyboard.addKey(113);
            this.f2.onUp.add(function() {
                this.toggleDebug();
            }, this);

            this.f11 = this.game.input.keyboard.addKey(122);
            this.f11.onUp.add(function() {
                this.toggleFullScreen();
            }, this);

            if (window.Game.debugMode) {
                this.toggleDebug();
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
    });
})();
