(function() {
    'use strict';

    var specialCollision = {
        bottomRight: [
        ],
        bottomLeft: [
        ],
        bottomThird: [
        ],
        topThird: [
        ],
        topHalf: [
        ],
        bottomHalf: [
        ],
        exclude: [
            // Water
            68,
            // Ladder
            102,
            // Sign
            103,
            // Rope
            104,
            // Thick rope
            105,
            // Water
            68,
            // Water top
            51
        ]
    };

    Game.Level = function(game) {
        this.game = game;

        /**
         * An array containing criterias fulfilled
         * @type {Array#String}
         */
        this.criterias = this.game.criterias = [];
        this.game.onCriteriaAdd = new Phaser.Signal();
        this.game.onCriteriaRemove = new Phaser.Signal();

        this.debugMode = false;

        this.levelSize = {
            x: 0,
            y: 0,
            width: 3000,
            height: 3720
        };

        this.AIs = {
            'guard': Game.Controller.AI.Guard
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

        this.toggleMusic = function() {
            this.game.musicMuted = !this.game.musicMuted;

            if (this.game.musicMuted) {
                if (this.music && this.music.isPlaying) {
                    this.music.fadeOut();
                }
            } else {
                if (this.music && !this.music.isPlaying) {
                    if (this.music.paused) {
                        this.music.resume();
                    } else {
                        this.music.fadeIn();
                    }    
                }
            }

            if (self.localStorage) {
                self.localStorage.music = this.game.musicMuted.toString();
            }
            return this.game.musicMuted;
        };
    };

    Game.Level.prototype = Object.create(self.Game.Utils.BaseState.prototype);
    Game.Level.prototype.constructor = Game.Level;
    /**
     * Load content here, e.g. this.load.image('myDude', '/assets/images/myDude.png')
     */
    Game.Level.prototype.preload = function() {
        var preloadBarFrame = this.game.add.image(this.game.width * 0.5, this.game.height * 0.5, 'preloadBarFrame');
        preloadBarFrame.anchor.set(0.5);

        var loadingText = this.game.add.bitmapText(this.game.width * 0.5, this.game.height * 0.3, 'font', 'Loading...', 72);
        loadingText.x -= loadingText.width * 0.5;

        var preloadBar = this.game.add.image(this.game.width * 0.5, this.game.height * 0.5, 'preloadBar');
        preloadBar.anchor.set(0.5);
        this.game.load.setPreloadSprite(preloadBar);

        var assetLoadingText = this.game.add.bitmapText(this.game.width * 0.5, this.game.height * 0.6, 'font', 'Loading Asset', 24);

        this.game.load.onFileStart.add(function(progress, key, url) {
            assetLoadingText.text = 'Loading file "{0}" from "{1}"'.format(key, url);
            assetLoadingText.updateTransform();
            assetLoadingText.x = this.game.width * 0.5 - assetLoadingText.width * 0.5;
        }, this);

        this.game.load.spritesheet('player1', 'assets/characters/player.png', 40, 76);
        this.game.load.spritesheet('spritesheet', 'assets/spritesheet.png', 64, 64);

        this.game.load.atlasXML('alienYellow', 'assets/alienYellow.png', 'assets/alienYellow.xml');
        this.game.load.atlasXML('UI', 'assets/UI.png', 'assets/UI.xml');
        this.game.load.atlasXML('p1', 'assets/p1_spritesheet.png', 'assets/p1_spritesheet.xml');

        this.game.load.audio('jump', ['assets/sfx/jump.ogg', 'assets/sfx/jump.mp3']);
        this.game.load.audio('objectComplete', ['assets/sfx/object_complete.ogg', 'assets/sfx/object_complete.mp3']);
        this.game.load.audio('pickupCoin', ['assets/sfx/pickup_coin.ogg', 'assets/sfx/pickup_coin.mp3']);
        this.game.load.audio('thud', ['assets/sfx/thud.ogg', 'assets/sfx/thud.mp3']);
        this.game.load.audio('footstep', ['assets/sfx/footstep.ogg', 'assets/sfx/footstep.mp3']);

        // Credits of boss music due to 13NHarri @ http://freesound.org/people/13NHarri/sounds/251334/
        this.game.load.audio('boss', ['assets/music/boss.mp3', 'assets/music/boss.ogg']);
        this.game.load.audio('truddelutt', ['assets/music/truddelutt.mp3', 'assets/music/truddelutt.ogg']);
        this.game.load.audio('lugnofin', ['assets/music/Lugn_och_Fin_Symaskin.mp3', 'assets/music/Lugn_och_Fin_Symaskin.ogg']);

        this.game.load.audio('solskenspromenad', 'assets/Solskenspromenad.mp3');

        this.game.load.image('dialoguePanel', 'assets/dialoguePanel.png');
        this.game.load.image('grasshopper', 'assets/characters/grasshopper256.png');
        this.game.load.image('octopus', 'assets/characters/octopus.png');
        this.game.load.image('bob', 'assets/characters/bob.png');
        this.game.load.image('ornithologist', 'assets/characters/ornithologist.png');
        this.game.load.image('ladydog', 'assets/characters/ladydog.png');
        this.game.load.image('sidecut', 'assets/characters/sidecut.png');
        this.game.load.image('florence', 'assets/characters/florence.png');
        this.game.load.image('mamabirdie', 'assets/characters/mamabirdie.png');

        this.game.load.spritesheet('torch', 'assets/items/torch.png', 16, 52);
        this.game.load.image('batteria', 'assets/items/batteria.png');
        this.game.load.image('pearl', 'assets/items/pearl.png');
        this.game.load.image('manick', 'assets/items/manick.png');
        this.game.load.image('egg', 'assets/items/egg.png');

        this.game.load.spritesheet('bubbles', 'assets/particles/bubbles.png', 64, 64);
        this.game.load.image('dirtParticle', 'assets/particles/dirt_particle.png');

        this.game.load.json('dialogues', 'assets/data/dialogues.json');

        this.game.load.tilemap('map', 'assets/map.json', null, Phaser.Tilemap.TILED_JSON);
    };

    /**
     * Generates any level related objects
     * @return {[type]} [description]
     */
    Game.Level.prototype.generateLevel = function() {
        this.map = this.game.add.tilemap('map');
        this.map.addTilesetImage('spritesheet');

        this.levelSize.width = this.map.width * this.map.tileWidth;
        this.levelSize.height = this.map.height * this.map.tileHeight;

        var bmd = this.game.make.bitmapData(this.game.width, this.game.height);
        this.bg = this.game.add.image(0, 0, bmd);
        this.bg.bmd = bmd;
        this.paintBG();
        this.bg.fixedToCamera = true;

        // The layer that the player does not interact with
        this.behind = this.map.createLayer('behind');
        this.behind.overlay = 'rgba(0,0,0,0.4)';

        this.level = this.map.createLayer('collision');
        // The layer containing platforms
        var firstID = this.map.tilesets[this.map.getTilesetIndex('spritesheet')].firstgid;
        var collisionTiles = [];
        _.forEach(this.level.layer.data, function(e) {
            _.forEach(e, function(t) {
                if (t.index > -1 && !_.contains(specialCollision.exclude, t.index - firstID) && !_.contains(collisionTiles, t.index)) {
                    collisionTiles.push(t.index);
                }

                if (_.contains(specialCollision.bottomRight, t.index - firstID)) {
                    t.slope = 'HALF_TRIANGLE_BOTTOM_RIGHT';
                }

                if (_.contains(specialCollision.bottomLeft, t.index - firstID)) {
                    t.slope = 'HALF_TRIANGLE_BOTTOM_LEFT';
                }

                if (_.contains(specialCollision.bottomThird, t.index - firstID)) {
                    t.worldY += 2 * t.height / 3;
                    t.height /= 3;
                }

                if (_.contains(specialCollision.topThird, t.index - firstID)) {
                    t.height /= 3;
                }

                if (_.contains(specialCollision.bottomHalf, t.index - firstID)) {
                    t.worldY += t.height * 0.5;
                    t.height *= 0.5;
                }

                if (_.contains(specialCollision.bottomHalf, t.index - firstID)) {
                    t.height *= 0.5;
                }
            });
        });
        this.front = this.map.createLayer('front');

        this.level.resizeWorld();

        this.level.renderSettings.enableScrollDelta = false;
        this.behind.renderSettings.enableScrollDelta = false;
        this.front.renderSettings.enableScrollDelta = false;

        this.secrets = [];
        _.forEach(this.front.layer.data, function(row) {
            _.forEach(row, function(tile) {
                if (tile.index > 0 && !_.contains(specialCollision.exclude, tile.index - firstID)) {
                    this.secrets.push(tile);
                }
            }, this);
        }, this);

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

    Game.Level.prototype.generateDialogues = function() {
        this.dialogues = {};
        var dialogues = this.game.cache.getJSON('dialogues');

        _.forEach(dialogues, function(data, key) {
            this.dialogues[key] = new Game.Dialogue(this.game, data.conversation, data.title);
        }, this);

        this.game.dialogues = this.dialogues;
    };

    Game.Level.prototype.generateCriteriaFunctions = function() {
        this.criteriaFunctions = {
            'activation': function() {
                return this.activateKey.downDuration(this.time.msMax);
            },
            'jump': function() {
                return this.p1.controller.jump.isDown;
            },
            'portalOperational': function() {
                return this.objectiveManager.isCompleted('needPower');
            }
        };
    };

    Game.Level.prototype.generateTriggerFunctions = function() {
        var oldDrag;
        this.triggerFunctions = {
            'enterWater': function() {
                this.p1.submerged = true;
            },

            'enterLadder': function() {
                this.p1.climbing = true;
            },

            'leaveWater': function() {
                this.p1.submerged = false;
                this.p1.resetJump();
            },

            'leaveLadder': function() {
                this.p1.climbing = false;
                this.p1.resetJump();
            },

            'setSlippery': function() {
                oldDrag = this.p1.desiredDrag.x;
                this.p1.desiredDrag.x = 100;
            },

            'resetSlippery': function() {
                this.p1.desiredDrag.x = oldDrag;
            },

            'enableDblJump': function() {
                this.p1.maxJumps = 2;
            },

            'acquireFeather': function() {
                this.game.criterias.push('feather');
                this.game.onCriteriaAdd.dispatch('feather', this.game.criterias);
            },

            'setCheckpoint': function(obj) {
                this.p1.checkpoint = new Phaser.Point(obj.x + obj.width * 0.5, obj.y + obj.height * 0.5);
            },

            'enterSecret': function() {
                for (var i = 0; i < this.secrets.length; i++) {
                    this.secrets[i].alpha = 0.5;
                }
            },

            'leaveSecret': function() {
                for (var i = 0; i < this.secrets.length; i++) {
                    this.secrets[i].alpha = 1;
                }
            },

            'resetPlayer': function() {
                if (this.p1.checkpoint) {
                    this.p1.body.checkCollision.up = false;
                    this.p1.body.checkCollision.down = false;
                    this.p1.body.checkCollision.left = false;
                    this.p1.body.checkCollision.right = false;
                    // this.p1.position.setTo();
                    this.game.add.tween(this.p1.position).to({x: this.p1.checkpoint.x, y: this.p1.checkpoint.y})
                        .start()
                        .onComplete.add(function() {
                            // Reset Y-velocity so ground particles doesnt go craycray
                            this.p1._data.prevY = 0;
                            this.p1.body.velocity.setTo(0);

                            this.p1.body.checkCollision.up = true;
                            this.p1.body.checkCollision.down = true;
                            this.p1.body.checkCollision.left = true;
                            this.p1.body.checkCollision.right = true;

                        }, this);

                }
            },

            'playMusic': function(obj, key, duration) {
                if (!key) return;

                duration = duration || 1000;

                this.triggerFunctions.stopMusic.call(this, obj, duration);
                this.music = this.game.sound.add(key);

                if (!this.game.musicMuted) {
                    this.music.fadeIn(duration);
                }
            },

            'stopMusic': function(obj, duration) {
                if (this.music && this.music.isPlaying) {
                    duration = duration || 1000;
                    this.music.fadeOut(duration);
                }
            },

            'startEnding': function() {
                this.p1.body.enable = false;

                this.game.add.tween(this.p1).to({rotation: Math.PI * 2}, 1000, undefined, false, 500, -1, false).start();
                var scaleTween = this.game.add.tween(this.p1.scale)
                    .to({x: 3, y: 3}, undefined, undefined, false, 500)
                    .start();

                scaleTween.onComplete.add(function() {
                    scaleTween.to({x: 6, y: 6}, 1000, undefined, false, undefined, -1, true).start();
                });

                this.game.add.tween(this.p1)
                    .to({alpha: 0}, 5000, Phaser.Easing.Bounce.In, false, 500)
                    .start()
                    .onComplete.add(function() {
                        var bg = this.game.add.bitmapData(this.game.width, this.game.height);
                        var bgImg = this.game.add.image(0, 0, bg);
                        bgImg.fixedToCamera = true;
                        bg.fill(0, 0, 0);

                        var endText = this.game.add.bitmapText(this.game.width * 0.5, this.game.height * 0.5, 'font', 'The End!');
                        endText.x -= endText.width * 0.5;

                        bgImg.addChild(endText);

                        bgImg.alpha = 0;
                        this.game.add.tween(bgImg).to({alpha: 1}).start();

                    }, this);

            }
        };
    };

    Game.Level.prototype.generateSprites = function() {
        _.forEach(this.map.objects['sprites'], function(obj) {
            /* jshint shadow: true */

            switch (obj.type) {
                case 'torch':

                    var radius = parseInt(obj.properties['radius'], 10);
                    var fade = parseFloat(obj.properties['fade'], 10);
                    var r = parseInt(obj.properties['r'], 10);
                    var g = parseInt(obj.properties['g'], 10);
                    var b = parseInt(obj.properties['b'], 10);
                    var pixelateValue = parseFloat(obj.properties['pixelateValue'], 10);

                    var pulsate = obj.properties['pulsate'] ? obj.properties['pulsate'] !== 'false' : true;

                    if (obj.properties['torch'] !== 'false') {
                        var torch = new Phaser.Sprite(this.game, obj.x, obj.y, 'torch', 0);
                        torch.position.x -= torch.width * 0.5;
                        torch.position.y -= torch.height * 0.5;
                        torch.animations.add('burn', null, 2, true);
                        torch.animations.play('burn');
                        this.game.add.existing(torch);
                    }

                    var torchLight = new Game.Torch(this.game, obj.x, obj.y, radius, fade, pixelateValue, r, g, b);
                    this.game.add.existing(torchLight);

                    if (pulsate) {
                        this.game.add.tween(torchLight.scale).to({x: 1.1, y: 1.1}, 1000, undefined, undefined, undefined, -1, true).start();
                    }

                    break;
                case 'entity':

                    var key = obj.properties['key'];
                    var frame = obj.properties['frame'];
                    var sprite = this.game.add.sprite(obj.x + obj.width * 0.5, obj.y + obj.height * 0.5, key, frame, this.entitiesGroup);

                    break;
                case 'character':

                    var key = obj.properties['key'];
                    var character = new Game.Character(this.game, obj.x + obj.width * 0.5, obj.y + obj.height * 0.5, key);

                    var AI = obj.properties['AI'];
                    switch (AI) {
                        case 'guard':
                            character.controller = new Game.Controller.AI.Guard(this.game, character, this.p1, obj.properties);
                            break;
                        case 'ornithologist':
                            character.controller = new Game.Controller.AI.Ornithologist(this.game, character, this.p1, obj.properties);
                            break;
                        case 'pacing':
                            character.controller = new Game.Controller.AI.Pacing(this.game, character, this.p1, obj.properties);
                            break;
                        default:
                            console.log('AI type', AI, 'is not in use');
                    }

                    if (obj.properties['allowGravity']) {
                        character.body.allowGravity = obj.properties['allowGravity'] === 'true';
                    }

                    if (obj.properties['floaty']) {
                        var floaty = parseInt(obj.properties['floaty'], 10);
                        this.game.add.tween(character.position).from({y:obj.y + floaty * 0.5}).to({y: obj.y - floaty * 0.5}, 1000, undefined, true, undefined, -1, true);
                    }

                    this.entitiesGroup.add(character);

                    break;
                default:
                    console.log('Did not recognize sprite type: ', obj.type);
            }
        }, this);
    };

    Game.Level.prototype.generateObjects = function() {
        _.forEach(this.map.objects['objects'], function(obj) {
            /* jshint shadow: true */
            switch (obj.type) {
                case 'spawn':
                    if (this.p1) {
                        var x = obj.x + obj.width / 2;
                        var y = obj.y + obj.height / 2;

                        this.p1.reset(x, y);
                        this.p1._cache[4] = 0;
                    }
                    break;
                case 'dialogue':
                    var dialogueKey = obj.properties.dialogue;
                    var dialogue = this.dialogues[dialogueKey];
                    var listen = obj.properties['listen'] ? obj.properties['listen'].split(',') : undefined;
                    var onListenDialogue = obj.properties['onListenDialogue'] ? this.dialogues[obj.properties['onListenDialogue']] : undefined;
                    var criteria = obj.properties['criteriaFunction'] || '';
                    criteria = this.criteriaFunctions[criteria];

                    if (dialogue) {
                        var trigger = new Game.Trigger.ZoneTrigger(
                            this.game, 
                            true, 
                            new Phaser.Rectangle(obj.x, obj.y, obj.width, obj.height), 
                            this.p1,
                            criteria, 
                            undefined,
                            this);
                        this.triggerManager.addTrigger(trigger);

                        trigger.onActive.add(function() {
                            this.dialogueManager.setDialogue(dialogue);
                        }, this);

                        trigger.onInactive.add(function() {
                            this.dialogueManager.hidden = true;
                        }, this);

                        if (listen && onListenDialogue) {
                            this.game.objectiveManager.onObjectiveComplete.add(function(objective) {
                                if (objective.properties.id && _.contains(listen, objective.properties.id)) {
                                    var oldDialogue = dialogue;
                                    dialogue = onListenDialogue;

                                    if (oldDialogue.isOpen) {
                                        this.dialogueManager.setDialogue(dialogue);
                                    }
                                }
                            }, this);
                        }

                    }

                    break;
                case 'criteria':

                    var criteriaFunction;
                    if (obj.properties['function'] && this.criteriaFunctions[obj.properties['function']]) {
                        criteriaFunction = this.criteriaFunctions[obj.properties['function']];
                    }
                    var trigger = new Game.Trigger.ZoneTrigger(this.game, true, new Phaser.Rectangle(obj.x, obj.y, obj.width, obj.height), this.p1, criteriaFunction, undefined, this);

                    this.triggerManager.addTrigger(trigger);

                    trigger.onActive.add(function(trigger) {
                        trigger.enabled = false;
                        this.game.criterias.push(obj.name);
                        this.game.onCriteriaAdd.dispatch(obj.name, this.game.criterias);
                    }, this);

                    if (obj.properties.inactivate) {
                        trigger.onInactive.add(function() {
                            trigger.enabled = true;
                            _.remove(this.game.criterias, obj.name);
                            this.game.onCriteriaRemove.dispatch(obj.name, this.game.criterias);
                        }, this);                        
                    }

                    break;

                case 'trigger':

                    var onEnter = obj.properties['enter'] || '';
                    var onLeave = obj.properties['leave'] || '';

                    onEnter = this.triggerFunctions[onEnter];
                    onLeave = this.triggerFunctions[onLeave];

                    if (typeof onEnter === 'undefined' && typeof onLeave === 'undefined') return;

                    var enterCriteria = obj.properties['enterCriteria'] || '';
                    var leaveCriteria = obj.properties['leaveCriteria'] || '';

                    enterCriteria = this.criteriaFunctions[enterCriteria];
                    leaveCriteria = this.criteriaFunctions[leaveCriteria];

                    var rectangles = [new Phaser.Rectangle(obj.x, obj.y, obj.width, obj.height)];


                    if (obj.properties['part']) {
                        var part = obj.properties['part'];

                        var parts = _.filter(this.map.objects['objects'], { type: 'part', name: part });

                        _.forEach(parts, function(partObj) {
                            rectangles.push(new Phaser.Rectangle(partObj.x, partObj.y, partObj.width, partObj.height));
                        });
                    }

                    var trigger = new Game.Trigger.ZoneTrigger(this.game, true, rectangles, this.p1, enterCriteria, leaveCriteria, this);

                    var enterArgs = obj.properties['enterArgs'] ? obj.properties['enterArgs'].split(',') : [];
                    var leaveArgs = obj.properties['leaveArgs'] ? obj.properties['leaveArgs'].split(',') : [];
                    enterArgs.splice(0, 0, obj);
                    leaveArgs.splice(0, 0, obj);

                    // Convert numerical values to numbers
                    for (var i = 0; i < enterArgs.length; i++) {
                        var parsed = parseFloat(enterArgs[i]);
                        enterArgs[i] = isNaN(parsed) ? enterArgs[i] : parsed;
                    }
                    for (var i = 0; i < leaveArgs.length; i++) {
                        var parsed = parseFloat(leaveArgs[i]);
                        leaveArgs[i] = isNaN(parsed) ? leaveArgs[i] : parsed;
                    }

                    this.triggerManager.addTrigger(trigger);

                    trigger.onActive.add(function() {
                        if (onEnter) {
                            onEnter.apply(this, enterArgs);
                        }
                    }, this);

                    trigger.onInactive.add(function() {
                        if (onLeave) {
                            onLeave.apply(this, leaveArgs);
                        }
                    }, this);

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
        this.game.physics.arcade.TILE_BIAS = 32;

        this.activateKey = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);

        this.setUtils();
        this.generateLevel();
        this.generateDialogues();
        this.generateCriteriaFunctions();
        this.generateTriggerFunctions();

        this.entitiesGroup = this.game.entitiesGroup = this.game.add.group();
        this.entitiesGroup.enableBody = true;

        this.spawnPlayer();

        this.HUD = new Game.HUD(this.game);
        this.objectiveManager = this.game.objectiveManager = new Game.ObjectiveManager(this.game, this.HUD, this.game.width * 0.5, 20);
        this.dialogueManager = this.game.dialogueManager = new Game.DialogueManager(this.game, this.HUD);
        this.triggerManager = this.game.triggerManager = new Game.Trigger.TriggerManager(this.game);

        this.generateObjects();
        this.generateSprites();
        this.entitiesGroup.bringToTop(this.p1);
        
        this.game.world.bringToTop(this.entitiesGroup);
        this.game.world.bringToTop(this.front);

        this.objectiveManager.createObjectives(this.map, this.map.objects['objectives'], this.p1);

        this.activateKey.onDown.add(function() {
            this.dialogueManager.nextSlide();
        }, this);

        this.game.input.keyboard.addKey(Phaser.Keyboard.P).onUp.add(this.togglePause, this);
        this.game.input.keyboard.addKey(Phaser.Keyboard.H).onUp.add(this.toggleHelp, this);

        this.game.world.bringToTop(this.HUD);

        this.paintBG();
    };

    Game.Level.prototype.update = function() {
        this.game.physics.arcade.collide(this.entitiesGroup, this.level);
    };

    Game.Level.prototype.render = function() {
        if (this.debugMode) {
            this.entitiesGroup.forEach(function(entity) {
                this.game.debug.body(entity);
            }, this);
        }
    };

    Game.Level.prototype.pause = function() {
        this.paused = true;
        this.pauseScreen = new Game.GUI.PauseScreen(this.game, this.HUD);
    };

    Game.Level.prototype.resume = function() {
        this.paused = false;
        this.pauseScreen.destroy();
    };

    Game.Level.prototype.togglePause = function() {
        if (this.paused) {
            this.pauseScreen.resume();
        } else {
            this.pause();
        }
    };

    Game.Level.prototype.closeHelp = function() {
        if (this.helpScreen.exists) {
            this.helpScreen.destroy();
            this.helpScreen = null;
        }
    };

    Game.Level.prototype.openHelp = function() {
        if (this.helpScreen) return;
        this.helpScreen = new Game.GUI.HelpScreen(this.game, this.HUD);
    };

    Game.Level.prototype.toggleHelp = function() {
        if (this.helpScreen) {
            this.helpScreen.closeHelp();
        } else {
            this.openHelp();
        }
    };

    var offset = {
        value: 50
    };
    Game.Level.prototype.paintBG = function() {

        var steps = 30;
        var pixelPerStep = this.game.height / steps;
        var bluePerStep = 200 / steps;
        var greenPerStep = 100 / steps;
        var redPerStep = 50 / steps;


        var red, green, blue, color, rnd;

        for (var y = 0; y * pixelPerStep <= this.game.height; y++) {
            red = Math.floor(redPerStep * y + offset.value);
            green = Math.floor(greenPerStep * y + offset.value * 1.5);
            blue = Math.floor(bluePerStep * y + offset.value * 2);
            color = 'rgb({0},{1},{2})'.format(red, green, blue);
            this.bg.bmd.rect(0, (steps - y) * pixelPerStep, this.game.width, pixelPerStep, color);
        }
    };
})();
