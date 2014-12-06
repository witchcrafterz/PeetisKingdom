(function() {
    'use strict';

    var specialCollision = {
        bottomRight: [
            129,
            136,
            132,
            67,
            45,
            15
        ],
        bottomLeft: [
            30,
            33,
            37,
            40,
            95,
            117
        ]
    };

    Game.Level = function(game) {
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

    Game.Level.prototype = _.merge(Object.create(self.Game.Utils.BaseState.prototype), {

        /**
         * Load content here, e.g. this.load.image('myDude', '/assets/images/myDude.png')
         */
        preload: function() {
            this.game.load.spritesheet('player1', 'assets/player1.png', 80, 97);
            this.game.load.image('bg', 'assets/bg_castle.png');
            this.game.load.spritesheet('tile', 'assets/spritesheet.png', 70, 70);

            this.game.load.image('arrow', 'assets/arrow.png');
            this.game.load.image('circle', 'assets/circle.png');

            this.game.load.script('plasma', 'assets/filters/Plasma.js');
            this.game.load.script('fire', 'assets/filters/Fire.js');

            this.game.load.atlasXML('alienYellow', 'assets/alienYellow.png', 'assets/alienYellow.xml');

            this.game.load.tilemap('map', 'assets/spel.json', null, Phaser.Tilemap.TILED_JSON);
        },

        /**
         * Generates any level related objects
         * @return {[type]} [description]
         */
        generateLevel: function() {
            this.map = this.game.add.tilemap('map');
            this.map.addTilesetImage('tile');

            this.levelSize.width = this.map.width * this.map.tileWidth;
            this.levelSize.height = this.map.height * this.map.tileHeight;

            this.bg = this.game.add.tileSprite(this.levelSize.x, this.levelSize.y, this.levelSize.width, this.levelSize.height, 'bg');

            // The layer that the player does not interact with
            this.behind = this.map.createLayer('behind');

            // The layer containing platforms
            this.level = this.map.createLayer('Tile Layer 1');
            var firstID = this.map.tilesets[this.map.getTilesetIndex('tile')].firstgid;
            var collisionTiles = [];
            _.forEach(this.level.layer.data, function(e) {
                _.forEach(e, function(t) {
                    if (t.index > -1) {
                        collisionTiles.push(t.index);
                    }

                    if (_.contains(specialCollision.bottomRight, t.index - firstID)) {
                        t.slope = 'HALF_TRIANGLE_BOTTOM_RIGHT';
                    }

                    if (_.contains(specialCollision.bottomLeft, t.index - firstID)) {
                        t.slope = 'HALF_TRIANGLE_BOTTOM_LEFT';
                    }
                });
            });

            this.level.resizeWorld();

            this.map.setCollision(collisionTiles);
        },

        setUtils: function() {
            this.fpsMeter = new Game.Utils.FpsMeter(this.game, 32, 32);
            
            if (window.Game.debugMode) {
                this.toggleDebug();
            }

            // Binds the f11 key to an event
            this.f2 = this.game.input.keyboard.addKey(113);
            this.f2.onUp.add(function() {
                this.toggleDebug();
            }, this);

            this.f11 = this.game.input.keyboard.addKey(122);
            this.f11.onUp.add(function() {
                this.toggleFullScreen();
            }, this);

            this.f4 = this.game.input.keyboard.addKey(115);
            this.f4.onUp.add(function() {
                if (this.game.physics.arcade.gravity === Game.gravity) {
                    this.game.physics.arcade.gravity = { x: 0, y: 0 };
                } else {
                    this.game.physics.arcade.gravity = Game.gravity;
                }
            }, this);
        },

        generateObjects: function() {
            _.forEach(this.map.objects['objects'], function(obj) {
                switch(obj.type) {
                    case 'spawn':
                        if (this.p1) {
                            var x = obj.x + obj.width / 2;
                            var y = obj.y + obj.height / 2;
                            
                            // DUCK TAPE. No idea why it doesn't' work without this. Happened after Phaser 2.2.X update
                            setTimeout(function(self) {
                                self.p1.reset(x, y);
                            }, 100, this);
                        }
                        break;
                }
            }, this);
        },

        spawnPlayer: function() {
            this.p1 = new Game.Player(this.game, 0, 0);
            this.game.add.existing(this.p1);
            this.entitiesGroup.add(this.p1);
            this.game.camera.follow(this.p1);
            this.game.camera.deadzone = this.getCameraDeadzone();
        },

        /**
         * Initialization logic here
         */
        create: function() {
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            this.game.physics.arcade.gravity = Game.gravity;
            this.game.physics.arcade.TILE_BIAS = 70;

            this.setUtils();
            this.generateLevel();

            this.entitiesGroup = this.game.add.group();

            this.spawnPlayer();

            this.alienYellow = new Game.Enemy(this.game, 0, 0);
            this.game.add.existing(this.alienYellow);
            this.entitiesGroup.add(this.alienYellow);

            this.generateObjects();
        },

        update: function() {
            this.alienYellow.controller.update(this.p1);
            this.game.physics.arcade.collide(this.entitiesGroup, this.level);
        }
    });
})();
