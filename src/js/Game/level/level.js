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

            this.game.load.image('arrow', 'assets/arrow.png');
            this.game.load.image('circle', 'assets/circle.png');

            this.game.load.script('plasma', 'assets/filters/Plasma.js');
            this.game.load.script('fire', 'assets/filters/Fire.js');

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
            this.behind = this.map.createLayer('behind', this.levelSize.width, this.levelSize.height);
            this.behind.fixedToCamera = false;

            // The layer containing platforms
            this.level = this.map.createLayer('Tile Layer 1', this.levelSize.width, this.levelSize.height);
            this.level.resizeWorld();
            this.level.fixedToCamera = false;

            // Sets collision on block IDs between 0 to 150. Check spritesheet for block index
            this.map.setCollision(1);
            this.map.setCollision(4);
            this.map.setCollision(36);
            this.map.setCollision(87);
            this.map.setCollision(102);
            this.map.setCollision(112);
            this.map.setCollision(113);
            this.map.setCollision(128);
        },

        setUtils: function() {
            this.fpsMeter = new Game.utils.FpsMeter(this.game, 32, 32);
            
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

            this.f5 = this.game.input.keyboard.addKey(116);
            this.f5.onUp.add(function() {
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
                        this.p1 = new Game.player(this.game, obj.x + obj.width / 2, obj.y + obj.height / 2);
                        this.game.add.existing(this.p1);
                        this.game.camera.follow(this.p1);
                        this.game.camera.deadzone = this.getCameraDeadzone();
                        break;
                }
            }, this);
        },

        /**
         * Initialization logic here
         */
        create: function() {
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            this.game.physics.arcade.gravity = Game.gravity;

            this.setUtils();
            this.generateLevel();

            setTimeout(function(self) {
                self.generateObjects();
            }, 100, this);


            this.plasmaFilter = this.game.add.filter('Plasma', this.game.width, this.game.height);
            this.fireFilter = this.game.add.filter('Fire', this.game.width, this.game.height);
            this.f1 = this.game.input.keyboard.addKey(112);
            this.f1.onUp.add(function() {
                if (this.bg.filters) {
                    switch (this.bg.filters[0]) {
                        case this.plasmaFilter:
                            this.bg.filters = undefined;
                            break;
                        case this.fireFilter:
                            this.bg.filters = [this.plasmaFilter];
                            break;
                    }
                } else {
                    this.bg.filters = [this.fireFilter];
                }
            }, this);
        },

        update: function() {
            this.game.physics.arcade.collide(this.p1, this.level);
            if (this.bg.filters) {
                this.bg.filters[0].update();
            }
        }
    });
})();
