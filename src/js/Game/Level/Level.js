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
        this.debugMode = false;

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
            if (this.debugMode) {
                this.fpsMeter.parent.remove(this.fpsMeter);
                this.level.debug = false;
            } else {
                this.game.add.existing(this.fpsMeter);
                this.level.debug = true;
            }

            this.level.dirty = true;
            this.debugMode = !this.debugMode;
        };
    };

    Game.Level.prototype = Object.create(self.Game.Utils.BaseState.prototype);
    Game.Level.prototype.constructor = Game.Level;
    /**
     * Load content here, e.g. this.load.image('myDude', '/assets/images/myDude.png')
     */
    Game.Level.prototype.preload = function() {
        var preloadBar = this.game.add.sprite(this.game.width / 2, this.game.height / 2, 'preloadBar');
        preloadBar.fixedToCamera = true;
        preloadBar.anchor.set(0.5);
        this.game.load.setPreloadSprite(preloadBar);

        this.game.load.spritesheet('player1', 'assets/player1.png', 80, 97);
        this.game.load.image('bg', 'assets/background.png');
        this.game.load.spritesheet('tile', 'assets/spritesheet.png', 70, 70);

        this.game.load.atlasXML('alienYellow', 'assets/alienYellow.png', 'assets/alienYellow.xml');
        this.game.load.atlasXML('UI', 'assets/UI.png', 'assets/UI.xml');
        this.game.load.atlasXML('p1', 'assets/p1_spritesheet.png', 'assets/p1_spritesheet.xml');

        this.game.load.audio('solskenspromenad', 'assets/Solskenspromenad.mp3');

        this.game.load.tilemap('map', 'assets/spel.json', null, Phaser.Tilemap.TILED_JSON);
    };

    /**
     * Generates any level related objects
     * @return {[type]} [description]
     */
    Game.Level.prototype.generateLevel = function() {
        this.map = this.game.add.tilemap('map');
        this.map.addTilesetImage('tile');

        this.levelSize.width = this.map.width * this.map.tileWidth;
        this.levelSize.height = this.map.height * this.map.tileHeight;

        this.bg = this.game.add.sprite(0, 0, 'bg');
        this.bg.fixedToCamera = true;

        // The layer that the player does not interact with
        this.behind = this.map.createLayer('behind');

        this.level = this.map.createLayer('collision');
        // The layer containing platforms
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

        this.front = this.map.createLayer('front');

        this.level.resizeWorld();

        this.map.setLayer(this.level);
        this.map.setCollision(collisionTiles);
    };

    Game.Level.prototype.setUtils = function() {
        this.fpsMeter = new Game.Utils.FpsMeter(this.game, 32, 32);

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
            if (this.p1) {
                this.p1.godMode = !this.p1.godMode;

                if (this.p1.godMode) {
                    this.p1.body.allowGravity = false;
                } else {
                    this.p1.body.allowGravity = true;
                }
            }
        }, this);
    };

    Game.Level.prototype.generateObjects = function() {
        _.forEach(this.map.objects['objects'], function(obj) {
            switch (obj.type) {
                case 'spawn':
                    if (this.p1) {
                        var x = obj.x + obj.width / 2;
                        var y = obj.y + obj.height / 2;

                        this.p1.reset(x, y);
                        this.p1._cache[4] = 0;
                    }
                    break;
            }
        }, this);
    };

    Game.Level.prototype.spawnPlayer = function(x, y) {
        this.p1 = new Game.Player(this.game, x || 0, y || 0);
        this.game.add.existing(this.p1);
        this.entitiesGroup.add(this.p1);
        this.game.camera.follow(this.p1);
        this.game.camera.deadzone = this.getCameraDeadzone();
        this.game.camera.roundPx = false;
    };

    /**
     * Initialization logic here
     */
    Game.Level.prototype.create = function() {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.gravity = Game.gravity;
        this.game.physics.arcade.TILE_BIAS = 70;

        this.setUtils();
        this.generateLevel();

        this.entitiesGroup = this.game.add.group();

        this.spawnPlayer();

        this.objectiveManager = new Game.ObjectiveManager(this.game, this.game.width - 50, this.game.height * 0.5);
        this.game.add.existing(this.objectiveManager);

        this.generateObjects();

        this.objectiveManager.createObjectives(this.map, this.map.objects['objectives'], this.p1);

        this.alienYellow = new Game.Enemy(this.game, this.p1.position.x - this.game.width, this.p1.position.y);
        this.alienYellow.controller.hostile = false;
        this.game.add.existing(this.alienYellow);
        this.entitiesGroup.add(this.alienYellow);

        var solskenspromenad = this.game.add.audio('solskenspromenad', 0.6, true, true);
        solskenspromenad.play();

        this.HUD = new Game.Utils.HUD(this.game);

        this.game.world.bringToTop(this.objectiveManager);
    };

    Game.Level.prototype.update = function() {
        this.alienYellow.controller.update(this.p1);
        this.game.physics.arcade.collide(this.entitiesGroup, this.level);
    };

    Game.Level.prototype.render = function() {
        if (this.debugMode) {
            this.entitiesGroup.forEach(function(entity) {
                this.game.debug.body(entity);
            }, this);
        }
    };
})();