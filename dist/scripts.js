(function() {
    'use strict';

    function prepareRegex(index) {
        return new RegExp('\\{' + index.toString() + '}', 'g');
    }

    function format(str, args) {
        _.forEach(args, function(arg, index) {
            str = str.replace(prepareRegex(index), arg);
        });
        return str;
    }

    String.prototype.format = function(args) {
        if (args.constructor === Array) {
            return format(this, args);
        } else {
            return format(this, arguments);
        }
    };

})();
(function() {
    'use strict';

    Math.clamp = function(value, lower, upper) {
        return Math.max(Math.min(value, upper), lower);
    };

    /**
     * The main game namespace
     * @namespace
     */
    var Game = function() {
        /**
         * Global game variables here
         */
        
        this.gravity = {
            x: 0,
            y: 3000
        };
    };

    Game.prototype.Utils = function() {

    };

    Game.prototype.GUI = function() {

    };

    window.Game = new Game();

})();

(function() {
    'use strict';

    Game.Utils.BaseState = function(game) {
    };

    Game.Utils.BaseState.prototype = {
        getCameraDeadzone: function() {
            var yFactor = 0.4;
            var xFactor = 0.35;

            var x = this.game.width * xFactor;
            var y = this.game.height * yFactor;
            var width = this.game.width * (1 - xFactor) - x;
            var height = this.game.height * (1 - yFactor) - y;
            return new Phaser.Rectangle(x, y, width, height);
        }
    };

})();

(function() {
    'use strict';

    Game.Utils.FpsMeter = function(game, x, y) {

        Phaser.Text.call(this, game, x, y);

        this.game.time.advancedTiming = true;
        this.fixedToCamera = true;

        return this;
    };

    // Clone the Phaser.Sprite prototype, and use it as our own. 
    // This is how inheritance works in JavaScript btw
    Game.Utils.FpsMeter.prototype = Object.create(Phaser.Text.prototype);
    Game.Utils.FpsMeter.prototype.constructor = Game.Utils.FpsMeter;

    Game.Utils.FpsMeter.prototype.update = function() {

        this.text = 'FPS: ' + this.game.time.fps;

    };

})();

(function() {
    'use strict';

    /**
     * A controller that is supposed to be inherited by many other classes, such as keyboard controller/AIs
     * @param {Phaser.Game} game The phaser game instance
     */
    Game.Controller = function(game) {
        this.game = game;

        /**
         * A virtual key that represents the controller to go left
         * @type {Object}
         */
        var left = this.left = {
            onDown: new Phaser.Signal(),
            onUp: new Phaser.Signal(),
            isDown: false,
            setDown: function() {
                left.isDown = true;
                left.onDown.dispatch('left', true);
            },
            setUp: function() {
                left.isDown = false;
                left.onUp.dispatch('left', false);
            }
        };

        /**
         * A virtual key that represents the controller to go right
         * @type {Object}
         */
        var right = this.right = {
            onDown: new Phaser.Signal(),
            onUp: new Phaser.Signal(),
            isDown: false,
            setDown: function() {
                right.isDown = true;
                right.onDown.dispatch('right', true);
            },
            setUp: function() {
                right.isDown = false;
                right.onUp.dispatch('right', false);
            }
        };

        /**
         * A virtual key that represents the controller to jump
         * @type {Object}
         */
        var jump = this.jump = {
            onDown: new Phaser.Signal(),
            onUp: new Phaser.Signal(),
            isDown: false,
            setDown: function() {
                jump.isDown = true;
                jump.onDown.dispatch('jump', true);
            },
            setUp: function() {
                jump.isDown = false;
                jump.onUp.dispatch('jump', false);
            }
        };

        /**
         * A virtual key that represents the controller to duck
         * @type {Object}
         */
        var down = this.down = {
            onDown: new Phaser.Signal(),
            onUp: new Phaser.Signal(),
            isDown: false,
            setDown: function() {
                down.isDown = true;
                down.onDown.dispatch('down', true);
            },
            setUp: function() {
                down.isDown = false;
                down.onUp.dispatch('down', false);
            }
        };

        /**
         * A virtual key that represents the controller to interact with things
         * @type {Object}
         */
        var up = this.up = {
            onDown: new Phaser.Signal(),
            onUp: new Phaser.Signal(),
            isDown: false,
            setDown: function() {
                up.isDown = true;
                up.onDown.dispatch('up', true);
            },
            setUp: function() {
                up.isDown = false;
                up.onUp.dispatch('up', false);
            }
        };

        return this;
    };

    Game.Controller.prototype.constructor = Game.Controller;

    Game.Controller.prototype.generateTouchControls = function() {
        this.touchControlsGroup = this.game.add.group();

        var dPad = this.game.add.button(0, 0, 'UI', null, null, 6, 6, 6, 6, this.touchControlsGroup);
        var jump = this.game.add.button(0, 0, 'UI', null, null, 44, 44, 44, 44, this.touchControlsGroup);

        dPad.scale.setTo(2);
        jump.scale.setTo(3);

        jump.x = this.game.width - jump.width;
        jump.y = this.game.height - jump.height;
        dPad.y = this.game.height - dPad.height;

        this.touchControlsGroup.fixedToCamera = true;
        this.touchControlsGroup.setAll('alpha', 0.85);

        console.log(this.game.input);

        var onDownHandler = function(sender, pointer) {
            var relativeX = pointer.x - sender.x;
            var deltaX = relativeX - sender.width / 2;

            if (deltaX < 0) {
                this.left.setDown.call(this);
            } else {
                this.left.setUp.call(this);
            }

            if (deltaX >= 0) {
                this.right.setDown.call(this);
            } else {
                this.right.setUp.call(this);
            }
        };

        var onDownLoop = function(sender, pointer) {
            setTimeout(function(thisArg) {
                if (pointer.isDown) {
                    onDownHandler.call(thisArg, sender, pointer);
                    onDownLoop.call(thisArg, sender, pointer);
                } else {
                    this.left.setUp.call(this);
                    this.right.setUp.call(this);
                }
            }, 20, this);
        };

        dPad.onInputDown.add(onDownLoop, this);

        dPad.onInputUp.add(function(sender, pointer) {
            this.left.setUp.call(this);
            this.right.setUp.call(this);
        }, this);

        jump.onInputDown.add(this.jump.setDown, this);
        jump.onInputUp.add(this.jump.setUp, this);
    };

})();
(function() {
    'use strict';

    Game.ObjectiveManager = function(game, parent, x, y) {
        Phaser.Group.call(this, game, parent, 'ObjectiveManager');

        this.position.setTo(x, y);

        /**
         * The vertical padding in pixel of every objective
         * @type {Number}
         */
        this.padding = 10;

        /**
         * The speed of the animations made in ObjectiveManager
         * @type {Number}
         */
        this.animationSpeed = 300;

        /**
         * The easing function to use for animations
         * @type {Phaser.Easing}
         */
        this.easing = Phaser.Easing.Quadratic.Out;

        var bmd = this.game.make.bitmapData(1, 1);
        /**
         * The objective managers background
         * @type {Phaser.Image}
         */
        this.bg = new Phaser.Image(this.game, 0, 0, bmd);
        this.bg.bmd = bmd;
        this.bg.position.x = -this.padding * 0.5;
        this.bg.position.y = -this.padding * 0.5;
        this.add(this.bg);

        /**
         * The title of the objective manager
         * @type {Phaser.Text}
         */
        this.titleText = this.game.add.bitmapText(0, 0, 'font', 'Objectives');
        this.titleText.tint = 0x010101;
        this.add(this.titleText);

        this.countText = this.game.add.bitmapText(0, 0, 'font', '-1');
        this.countText.tint = 0x010101;
        this.countText.visible = false;
        this.add(this.countText);

        /**
         * An array of all current objectives
         * @type {Array#Game.ObjectiveManager.Objective}
         */
        this.objectives = [];

        /**
         * An array containing all objectives that have ever been added to ObjectiveManager.objectives
         * @type {Array#Game.ObjectiveManager.Objective}
         */
        this.objectiveLog = [];

        /**
         * An array containing all objectives that exists in the tilemap
         * @type {Array#Objective}
         */
        this.allObjectives = [];

        /**
         * The sound effect that is played on objective completion
         * @type {[type]}
         */
        this.objectiveCompleteSFX = this.game.add.audio('objectComplete');

        /**
         * Triggers when any objective has been completed
         * @type {Phaser.Signal}
         */
        this.onObjectiveComplete = new Phaser.Signal();

        this._expandButton = new Game.GUI.Button(this.game, 0, 10, undefined, 'Hide', 'font');
        this._expandButton.anchor.setTo(0, 0);
        this._expandButton.fontSize = 26;
        this._expandButton.onInputDown.add(this.toggleExpand, this);
        this.add(this._expandButton);

        this._isExpanded = true;

        this._updatePositioning();
        this.onObjectiveComplete.add(this.onObjectiveCompleteHandler, this);

        this.alpha = 0;
    };

    Game.ObjectiveManager.prototype = Object.create(Phaser.Group.prototype);
    Game.ObjectiveManager.prototype.constructor = Game.ObjectiveManager;

    Game.ObjectiveManager.prototype.onObjectiveCompleteHandler = function() {
        this.objectiveCompleteSFX.play();
    };
    
    Game.ObjectiveManager.prototype.toggleExpand = function() {
        this._isExpanded = !this._isExpanded;

        if (!this._isExpanded) {
            _.forEach(this.objectives, function(objective, index) {
                objective.alpha = 0;
            }, this);

            this._expandButton.text = 'Show';
            this.countText.visible = true;
        } else {
            _.forEach(this.objectives, function(objective, index) {
                objective.alpha = 1;
            }, this);
         
            this._expandButton.text = 'Hide';
            this.countText.visible = false;
        }

        this._updatePositioning();
    };
    
    Game.ObjectiveManager.prototype.createObjectives = function(map, objectivesLayer, player) {
        _.forEach(objectivesLayer, function(objective) {
            switch (objective.type) {
                case 'collect':
                    this.allObjectives.push(this.createCollectObjective(map, objective, player));
                    break;
                case 'a2b':
                    this.allObjectives.push(this.createA2BObjective(map, objective, player));
                    break;
                case 'criteria':
                    this.allObjectives.push(this.createCriteriaObjective(map, objective, player));
                    break;
                default:
                    console.log('Objective of type ' + objective.type + ' not yet implemented');
                    break;
            }            
        }, this);
    };

    Game.ObjectiveManager.prototype.createCollectObjective = function(map, objective, player) {
        var activeRect = new Phaser.Rectangle(objective.x, objective.y, objective.width, objective.height);
        var trigger = new Game.Trigger.ZoneTrigger(this.game, true, activeRect, player);

        var objectLayer = map.objects[objective.properties.itemLayer];
        var itemsGroup = this.game.add.group(undefined, objective.name);
        itemsGroup.enableBody = true;

        var endTrigger;

        _.forEach(objectLayer, function(object) {
            if (object.type && object.type === 'end') {
                endTrigger = new Game.Trigger.ZoneTrigger(this.game, true, new Phaser.Rectangle(object.x, object.y, object.width, object.height), player);
            } else {
                var key = object.properties.spritesheet || objective.properties.spritesheet;
                var frame = object.properties.frame || objective.properties.frame;
                var glow = object.properties.glow || objective.properties.glow;

                var sprite = itemsGroup.create(object.x + object.width * 0.5, object.y + object.height * 0.5, key, parseInt(frame));
                if (glow === 'true') {
                    var torchLight = new Game.Torch(this.game, sprite.width * 0.5, sprite.height * 0.5, 100);
                    this.game.add.existing(torchLight);
                    sprite.addChild(torchLight);
                }

                if (object.properties['activate']) {
                    sprite.activate = true;
                }

                sprite.body.allowGravity = object.properties.allowGravity === 'true' || false;
            }
        }, this);

        var dependencies = objective.properties.dependencies ? objective.properties.dependencies.split(',') : undefined;

        var collectObjective = new Game.ObjectiveManager.CollectObjective(this.game, this, trigger, map, objective, player, dependencies, itemsGroup, endTrigger);
        this.game.triggerManager.addTrigger(trigger);
        if (endTrigger) this.game.triggerManager.addTrigger(endTrigger);

        return collectObjective;
    };

    Game.ObjectiveManager.prototype.createA2BObjective = function(map, objective, player) {
        var activeRect = new Phaser.Rectangle(objective.x, objective.y, objective.width, objective.height);
        var trigger = new Game.Trigger.ZoneTrigger(this.game, true, activeRect, player);

        var endLayer = map.objects[objective.properties.endLayer];

        var rectangles = [];

        _.forEach(endLayer, function(object) {
            rectangles.push(new Phaser.Rectangle(object.x, object.y, object.width, object.height));
        });

        var endTrigger = new Game.Trigger.ZoneTrigger(this.game, false, rectangles, player);

        var dependencies = objective.properties.dependencies ? objective.properties.dependencies.split(',') : undefined;

        var a2bObjective = new Game.ObjectiveManager.A2BObjective(this.game, this, trigger, map, objective, player, dependencies, endTrigger);
        this.game.triggerManager.addTrigger(trigger);
        this.game.triggerManager.addTrigger(endTrigger);

        return a2bObjective;
    };

    Game.ObjectiveManager.prototype.createCriteriaObjective = function(map, objective, player) {
        var activeRect = new Phaser.Rectangle(objective.x, objective.y, objective.width, objective.height);
        var trigger = new Game.Trigger.ZoneTrigger(this.game, true, activeRect, player);

        var dependencies = objective.properties.dependencies ? objective.properties.dependencies.split(',') : undefined;
        var criterias = objective.properties.criterias ? objective.properties.criterias.split(',') : [];

        var criteriaObjective = new Game.ObjectiveManager.CriteriaObjective(this.game, this, trigger, map, objective, player, dependencies, criterias);
        this.game.triggerManager.addTrigger(trigger);

        return criteriaObjective;
    };

    Game.ObjectiveManager.prototype.addObjective = function(objective) {
        objective.y = this._calculateHeightTo(this.objectives.length - 1);
        this.objectives.push(objective);
        this.objectiveLog.push(objective);

        if (this._isExpanded) {
            objective.game.add.tween(objective).to({alpha: 1}, this.animationSpeed, this.easing, true);
        }

        objective.onCompletion.add(this._removeObjective, this);
        objective.onFailure.add(this._removeObjective, this);

        this.countText.text = String(this.objectives.length);

        this._updatePositioning();
    };

    Game.ObjectiveManager.prototype.isActive = function(objective) {
        return _.contains(this.objectives, objective);
    };

    Game.ObjectiveManager.prototype.isCompleted = function(objectives) {
        if (!objectives) return true;

        if (objectives.constructor === String) objectives = objectives.split(',');

        var toCheck = _.filter(this.allObjectives, function(objective) {
                return _.contains(objectives, objective.properties.id);
            });

        if (toCheck.length < objectives.length) {
            console.log('Could not find all dependencies. Did you spell all correctly?');
            return false;
        }

        return _.every(toCheck, 'completed');
    };

    Game.ObjectiveManager.prototype._removeObjective = function(objective) {
        if (!objective.isActive) return;

        objective.game.add.tween(objective)
            .to({alpha: 0}, this.animationSpeed, this.easing, true);

        var index = this.objectives.indexOf(objective);
        this.objectives.splice(index, 1);

        this._updatePositioning();
        this.countText.text = String(this.objectives.length);
    };

    Game.ObjectiveManager.prototype._updatePositioning = function() {
        // this.width = this._getVisibleWidth();

        if (this.objectives.length === 0) {
            this.game.add.tween(this).to({alpha: 0}, this.animationSpeed, this.easing, true);
            return;
        } else {
            this.game.add.tween(this).to({alpha: 1}, this.animationSpeed, this.easing, true);
        }

        this.pivot.x = this._getVisibleWidth() * 0.5;

        this.game.add.tween(this.titleText.position).to({x: this._getVisibleWidth() * 0.5 - this.titleText.width * 0.5 }, this.animationSpeed, this.easing, true);
        this._expandButton.position.x = this._getVisibleWidth() - this._expandButton.width;

        _.forEach(this.objectives, function(objective, index) {
            this.game.add.tween(objective).to({y: this._calculateHeightTo(index - 1) }, this.animationSpeed, this.easing, true);
        }, this);

        this.bg.width = this._getVisibleWidth() + this.padding;
        this.bg.height = this._calculateHeightTo(this._isExpanded ? this.objectives.length - 1 : -1) + this.padding;
        this.bg.bmd.clear();
        this.bg.bmd.fill(255, 255, 255, 0.75);
    };

    Game.ObjectiveManager.prototype._calculateHeightTo = function(index) {
        var _height = this.titleText.height + this.padding;

        index = Math.min(this.objectives.length - 1, index);

        for (var i = 0; i <= index; i++) {
            _height += this.objectives[i].height + this.padding;
        }

        return _height;

    };

    Game.ObjectiveManager.prototype._getVisibleWidth = function() {
        var width = 0;

        for (var i = 0; i < this.objectives.length; i++) {
            width = Math.max(width, this.objectives[i].width);
        }

        return width;
    };

})();

(function() {
    'use strict';

    Game.ObjectiveManager.Objective = function(game, objectiveManager, trigger, tilemap, object, player, dependencies) {
        Phaser.Group.call(this, game, objectiveManager, object.name);
        this.alpha = 0;

        /**
         * Game instance
         * @type {Phaser.Game}
         */
        this.game = game;

        /**
         * The player who are to complete the objective
         * @type {Phaser.Sprite}
         */
        this.player = player;

        /**
         * Instance of objectiveManager
         * @type {Game.ObjectiveManager.Objective}
         */
        this.objectiveManager = objectiveManager;

        /**
         * The object that this objective belongs to in the tilemap
         * @type {Object}
         */
        this.object = object;

        /**
         * The objects properties from the tilemap
         * @type {Object}
         */
        this.properties = this.object.properties;

        /**
         * The tilemap of which this objectives objective layer belongs to
         * @type {Phaser.Tilemap}
         */
        this.tilemap = tilemap;

        /**
         * Name of the objective
         * @type {String}
         */
        this.name = this.object.name;

        /**
         * Is the objective completed or not
         * @type {Boolean}
         */
        this.completed = false;

        /**
         * List of objective name in strings that has to be completed before this objective can be activated
         * @type {Array#String}
         */
        this.dependencies = dependencies;

        /**
         * The trigger that will trigger this objective
         * @type {Game.Trigger}
         */
        this.trigger = trigger;
        this.trigger.onActive.add(this.activate, this);
        this.trigger.onInactive.add(this.inactivate, this);

        /**
         * Whether or not to remove objective on inactive
         * @type {Boolean}
         */
        this.removeOnInactive = false;

        /**
         * Signal that fires upon completion of objective
         * @type {Phaser.Signal}
         */
        this.onCompletion = new Phaser.Signal();
        this.onCompletion.add(this._onCompletionHandler, this);

        /**
         * An array containing arguments to call onComplete functions with
         * @type {[type]}
         */
        this.onCompleteArgs = this.properties['onCompleteArgs'] ? this.properties['onCompleteArgs'].split(',') : [];
        // Trigger functions expect the object to be argument number one
        this.onCompleteArgs.splice(0, 0, this.object);

        /**
         * Signal that fires upon failure of objective
         * @type {Phaser.Signal}
         */
        this.onFailure = new Phaser.Signal();
        this.onFailure.add(this._onFailureHandler, this);

        /**
         * An object containing style information for _titleText
         * @type {Object}
         */
        this._titleTextStyle = {
            font: '17pt serif'
        };

        /**
         * The Phaser.Text instance of the title
         * @type {Phaser.Text}
         */
        // this._titleText = this.game.add.text(0, 0, this.name, this._titleTextStyle);
        this._titleText = this.game.add.bitmapText(0, 0, 'font', this.name, 28);
        this._titleText.tint = 0x010101;
        this.add(this._titleText);

        this._statusTextStyle = { 
            font: '14pt serif' 
        };

        /**
         * An internal list of trigger functions to call on completion
         * @type {Array#String}
         */
        this._onComplete = (this.properties['onComplete'] || '').split(',');

        /**
         * The status template to be used for this objective. Formatting is to be implemented by children inheriting the Game.ObjectiveManager.Objective class
         * @type {String}
         */
        this._statusTemplate = (this.object.properties.status || this.name).replace('\\n', '\n');

        /**
         * The Phaser.Text instance of the status
         * @type {Phaser.Text}
         */
        // this._statusText = this.game.add.text(0, 0, this._statusTemplate, this._statusTextStyle);
        this._statusText = this.game.add.bitmapText(20, 0, 'font', this._statusTemplate, 23);
        this._statusText.tint = 0x010101;
        this._statusText.y = this._titleText.height;
        this.add(this._statusText);
    };

    Game.ObjectiveManager.Objective.prototype = Object.create(Phaser.Group.prototype);
    Game.ObjectiveManager.Objective.prototype.constructor = Game.ObjectiveManager.Objective;

    Game.ObjectiveManager.Objective.prototype.update = function() {
        Phaser.Group.prototype.update.call(this);
    };
    
    Game.ObjectiveManager.Objective.prototype.updateStatusText = function() {
    };

    Game.ObjectiveManager.Objective.prototype.activate = function() {
        if (!this.isActive && !this.completed && this.objectiveManager.isCompleted(this.dependencies)) {
            this.objectiveManager.addObjective(this);
        }
    };

    Game.ObjectiveManager.Objective.prototype.inactivate = function() {
        if (this.removeOnInactive && this.isActive) {
            this.objectiveManager._removeObjective(this);
        }
    };

    Object.defineProperty(Game.ObjectiveManager.Objective.prototype, 'statusTemplate', {

        get: function() {
            return this._statusTemplate;
        },

        set: function(value) {
            this._statusTemplate = value;
            this.updateStatusText();
        }

    });

    Game.ObjectiveManager.Objective.prototype._onCompletionHandler = function() {
        this.completed = true;
        this._statusTextStyle.fill = '#01C611';
        this._statusText.setStyle(this._statusTextStyle);
        this.objectiveManager.onObjectiveComplete.dispatch(this);
        this._callOnCompletionTriggers();
    };

    Game.ObjectiveManager.Objective.prototype._callOnCompletionTriggers = function() {
        var state = this.game.state.getCurrentState();
        var triggerFunctions = state.triggerFunctions;
        var key;

        for (var i = 0; i < this._onComplete.length; i++) {
            key = this._onComplete[i];
            if (triggerFunctions[key]) {
                console.log(triggerFunctions[key]);
                triggerFunctions[key].apply(state, this.onCompleteArgs);
            }
        }

    };

    Game.ObjectiveManager.Objective.prototype._onFailureHandler = function() {
        this._statusTextStyle.fill = '#ff0000';
        this._statusText.setStyle(this._statusTextStyle);
    };

    Game.ObjectiveManager.Objective.prototype.toString = function() {
        return this.name;
    };

    Object.defineProperty(Game.ObjectiveManager.Objective.prototype, 'statusText', {

        get: function() {
            if (this._statusText) {
                return this._statusText.text;
            }
            return this.name + ' status';
        },

        set: function(value) {
            this._statusText.text = value.replace('\\n', '\n');
        }

    });  

    Object.defineProperty(Game.ObjectiveManager.Objective.prototype, 'isActive', {

        get: function() {
            return this.objectiveManager.isActive(this);
        }

    });

})();

(function() {
    'use strict';

     /**
      * A generic character
      * @param {Phaser.Game} game   The phaser game instance
      * @param {Number} x           The X-coordinate on which to spawn this character
      * @param {Number} y           The Y-coordinate on which to spawn this character
      * @param {String} texture     The texture key to use on this character
      */
    Game.Character = function(game, x, y, texture, controller) {
        Phaser.Sprite.call(this, game, x, y, texture);

        this.anchor.set(0.5);
        this.game.physics.enable(this, Phaser.Physics.ARCADE);

        this.body.drag = new Phaser.Point(1500, 0);
        // this.body.collideWorldBounds = true;
        this.body.maxVelocity = new Phaser.Point(3000, 2000);

        /**
         * The desired drag for the character while walking on the ground
         * @type {Phaser.Point}
         */
        this.desiredDrag = this.body.drag.clone();

        /**
         * The desired drag for the character while in the air
         * @type {Phaser.Point}
         */
        this.desiredAirDrag = new Phaser.Point(300, 0);

        /**
         * The texture key used in the making of this character
         * @type {String}
         */
        this.textureKey = texture;

        /**
         * The maximum amount of jumps to jump
         * @type {Number}
         */
        this.maxJumps = 1;

        /**
         * The velocity in which the character can walk
         * @type {Number}
         */
        this.walkingVelocity = 500;

        /**
         * The controller that handles this sprite
         * @type {Game.Controller}
         */
        this.controller = controller;

        /**
         * The acceleration when walking
         * @type {Number}
         */
        this.walkingAcc = 2000;

        /**
         * The amount to refill this.jumpMeter with
         * @type {Number}
         */
        this.fullJumpMeter = 20000;

        /**
         * The amount that reduces the jumpmeter every tick that jump key is being held down
         * @type {Number}
         */
        this.jumpFactor = 0.7;

        /**
         * The jump meter, that is how much jump-energy there is left
         * @type {Number}
         */
        this.jumpMeter = this.fullJumpMeter;


        /**
         * The current amount of jumps jumped since reset
         * @type {Number}
         */
        this.currentJumps = 0;

        /**
         * Calculated states the character can exist in
         * @type {Object} states
         * @type {Object} states.airborn    If the character is in the air
         * @type {Object} states.walking    If the character is walking
         * @type {Object} states.tryWalking If the character is trying to walk, i.e. pressing right or left on controller
         * @type {Object} states.falling    If the character is airborn with positive Y-velocity
         * @type {Object} states.rising     If the character is airborn with negative Y-velocity
         * @type {Object} states.still      If the character is completely still
         * @type {Object} states.ducking    If the character is ducking, that is, pressing the duck key
         */
        this.states = {
            'airborn': false,
            'walking': false,
            'tryWalking': false,
            'falling': false,
            'rising': false,
            'still': false,
            'ducking': false
        };

        /**
         * Whether or not to automatically flip the character horizontally when walking to the left
         * @type {Boolean}
         */
        this.autoFlip = true;

        /**
         * The jump sound effect
         * @type {Phaser.Audio}
         */
        this.jumpSFX = this.game.add.audio('jump');

        /**
         * The thud or landing jump effect
         * @type {Phaser.Audio}
         */
        this.thudSFX = this.game.add.audio('thud');

        /**
         * The footstep sound effect
         * @type {Phaser.Audio}
         */
        this.footstepSFX = this.game.add.audio('footstep');

        /**
         * How many steps the player takes every second
         * @type {Number}
         */
        this.stepsPerSecond = 3;

        /**
         * If the character is in god mode or not. God mode allows for flying
         * @type {Boolean}
         */
        this.godMode = false;

        /**
         * Internal cache
         * @type {Object}
         */
        this._data = {
            prevY: -1,
            lastStep: -1
        };

        /**
         * An emitter that emits particles when submerged
         * @type {Phaser.Particles.Arcade}
         */
        // this.bubbleEmitter = this.game.add.emitter(0, 0);
        // this.bubbleEmitter.makeParticles('bubbles', [0,1,2,3,4,5,6], 20);
        // this.bubbleEmitter.gravity = -3750;
        // this.bubbleEmitter.maxRotation = 0;
        // this.bubbleEmitter.minRotation = 0;
        // this.bubbleEmitter.start(false, 5000);
        // this.bubbleEmitter.on = false;

        /**
         * An emitter that emits particles when hitting and/or running ont he ground
         * @type {Phaser.Particles.Arcade}
         */
        this.groundEmitter = this.game.add.emitter(this.width * 0.5, this.height);
        this.groundEmitter.makeParticles('dirtParticle', 0, 100);
        this.groundEmitter.setXSpeed(-500, 500);
        this.groundEmitter.setYSpeed(-1000, -500);

        return this;
    };

    Game.Character.prototype = Object.create(Phaser.Sprite.prototype);
    Game.Character.prototype.constructor = Game.Character;

    /**
     * Resets the jump
     * @return {Undefined}
     */
    Game.Character.prototype.resetJump = function() {
        var deltaVel = this._data.prevY - this.body.velocity.y;
        if (deltaVel > 1200) {
            // Max deltaVel is 2000. A single full jump results in a bit more than 1200
            var particles = (deltaVel - 1200) * 0.05;
            this.groundEmitter.explode(1000, particles);
            this.thudSFX.playFrom(this.position);
        }

        this.currentJumps = 0;
        this.jumpMeter = this.fullJumpMeter;
        this.flicked = false;
    };

    /**
     * Internal method used to handle the jump key
     * @return {undefined}
     */
    Game.Character.prototype._jump = function() {
        if (this.submerged || this.climbing) {
            if (this.controller.jump.isDown) {
                this.body.velocity.y = -400;
            }
            return;
        }

        if (this.controller.jump.isDown) {
            if (!this.jumpWasDown) {
                this.currentJumps += 1;

                if (this.currentJumps < this.maxJumps) {
                    this.body.velocity.y = 0;
                }
            }

            if (Math.floor(this.jumpMeter) > 0 && this.currentJumps < this.maxJumps) {
                if (this.body.onFloor() || !this.jumpWasDown) {
                    this.jumpSFX.playFrom(this.position);
                }

                this.body.acceleration.y -= this.jumpMeter;
                this.jumpMeter *= this.jumpFactor;
            }
        } else {
            if (this.jumpWasDown) {
                if (this.maxJumps >= this.currentJumps) {
                    this.jumpMeter = this.fullJumpMeter;
                } else {
                    this.jumpMeter = 0;
                }
            }
        }

        this.jumpWasDown = this.controller.jump.isDown;
    };

    /**
     * Internal method to calculate the this.states object
     * @return {Undefined}
     */
    Game.Character.prototype._calculateStates = function() {
        this.states.airborn = !this.body.onFloor();
        this.states.falling = this.states.airborn && this.body.velocity.y > 0;
        this.states.rising = this.states.airborn && this.body.velocity.y < 0;

        if (this.controller) {
            this.states.tryWalking = (this.controller.right.isDown || this.controller.left.isDown);
            this.states.walking = this.states.tryWalking && !this.states.airborn;
            this.states.still = (this.body.touching.down || this.body.onFloor()) && Math.abs(this.body.velocity.x) < 40;
            this.states.ducking = this.controller.down.isDown;
        } else {
            this.states.walking = undefined;
            this.states.still = undefined;
            this.states.ducking = undefined;
        }
    };

    Game.Character.prototype._controllerHandler = function() {
        if (this.controller.update) {
            this.controller.update();
        }

        // Walking Action
        if (this.controller.right.isDown) {
            this.body.acceleration.x = this.walkingAcc;

            if (this.autoFlip) {
                this.scale.x = 1;
            }
        } else if (this.controller.left.isDown) {
            this.body.acceleration.x = -this.walkingAcc;

            if (this.autoFlip) {
                this.scale.x = -1;
            }
        } else {
            this.body.acceleration.setTo(0);
        }

        // Jumping action
        if (!this.godMode) {
            this._jump();
        } else {
            if (this.controller.jump.isDown) {
                this.body.acceleration.y = -2000;
            } else if (this.controller.down.isDown) {
                this.body.acceleration.y = 2000;
            } else {
                this.body.velocity.y *= 0.95;
            }
        }
    };

    Game.Character.prototype._setData = function() {
        this._data.prevY = this.body.velocity.y;
    };

    Game.Character.prototype.updateEmitters = function() {
        // this.bubbleEmitter.emitX = this.position.x;
        // this.bubbleEmitter.emitY = this.position.y;
        this.groundEmitter.emitX = this.position.x;
        this.groundEmitter.emitY = this.position.y + this.body.height;
    };

    Game.Character.prototype.update = function() {
        // Calculate states
        this._calculateStates();

        // Zero accleration every tick, for easier adding of acceleration and so that body.drag have an affect
        this.body.acceleration.setTo(0);

        // Update all emitters to follow player position
        this.updateEmitters();

        // If there is a controller, handle it
        if (this.controller) {
            this._controllerHandler();
        }

        if (this.states.airborn) {
            if (!this.body.drag.equals(this.desiredAirDrag)) {
                this.body.drag.setTo(this.desiredAirDrag.x, this.desiredAirDrag.y);
            }
        } else {
            if (!this.body.drag.equals(this.desiredDrag)) {
                this.body.drag.setTo(this.desiredDrag.x, this.desiredDrag.y);
            }
        }

        if (this.states.walking && this.game.time.now - this._data.lastStep > 1000 / this.stepsPerSecond) {
            this.footstepSFX.playFrom(this.position);
            this._data.lastStep = this.game.time.now;
        }

        //If submerged, reduce speed        
        if (this.submerged || this.climbing) {
            this.body.velocity.y *= 0.85;
            this.body.velocity.x *= 0.95;
        }

        // If on floor reset jump
        if (this.body.onFloor() || this.body.touching.down) {
            this.resetJump();
        }

        // Other restrictions etc.

        // Restrict walking speed
        if (this.states.tryWalking && !this.godMode && !this.flicked) {
            this.body.velocity.x = Math.clamp(this.body.velocity.x, -this.walkingVelocity, this.walkingVelocity);
        }

        // Set state on bubble emitter. Bubble emitter is disbaled for future use
        // this.bubbleEmitter.on = this.submerged;

        this._setData();
    };

})();

(function() {
    'use strict';

    /**
     * A generic AI class that is to be inherited by different types of AI's
     * @param {Phaser.Game}     game       The Phaser Game instance
     * @param {Game.Character}  controlled The character this AI will control
     * @param {Object}          Properties Custom properties this AI can use
     */
    Game.Controller.AI = function(game, controlled, player, properties) {
        Game.Controller.call(this, game);

        /**
         * The character this AI controls
         * @type {Game.Character}
         */
        this.controlled = controlled;

        /**
         * A reference to currently playing player
         * @type {Game.Player}
         */
        this.player = player;

        /**
         * Custom properties this AI can use
         * @type {Object}
         */
        this.properties = properties;

        /**
         * An array of dependencies to fulfill for this AI to do something
         * @type {Array#String}
         */
        this.friendlyDependencies = this.properties['dependencies'] ? this.properties['dependencies'].split(',') : undefined;

        /**
         * Whether or not all dependencies are complete. If there are no dependencies it's value is set to true
         * @type {Boolean}
         */
        this.dependenciesComplete = typeof this.friendlyDependencies === 'undefined';

        /**
         * An array of criterias to fulfill for this AI to do something
         * @type {Array#String}
         */
        this.friendlyCriterias = this.properties['criterias'] ? this.properties['criterias'].split(',') : undefined;
        
        /**
         * Whether or not all criterias are complete. If there are no criterias, it's value is set to true
         * @type {Boolean}
         */
        this.criteriasComplete = typeof this.friendlyCriterias === 'undefined';

        /**
         * A dialogue that pops up
         * @type {String}
         */
        this.dialogue = this.game.dialogues[this.properties['dialogue']];

        /**
         * Whether or not the player is close to the AI
         * @type {Boolean}
         */
        this.isPlayerClose = false;

        /**
         * If the player was close the previous tick
         * @type {Boolean}
         */
        this.wasPlayerClose = false;

        /**
         * The vision of the character in pixels. This is used by isPlayerClose/wasPlayerClose
         * @type {Number}
         */
        this.vision = parseInt(this.properties.vision, 10) || 200;

        /**
         * Whether or not to automatically turn to the player if it is within the characters vision
         * @type {Boolean}
         */
        this.watchPlayer = true;

        this._dependenciesMonitor();
        this._criteriasMonitor();

        return this;
    };

    Game.Controller.AI.prototype = Object.create(Game.Controller.prototype);
    Game.Controller.AI.prototype.constructor = Game.Controller.AI;

    Game.Controller.AI.prototype.update = function() {
        // Reasoning behind custom code instead of built in function is that built in only has distance and not distanceSquared. 
        // This saves performance as sqrt is an expensive operation. Also saves the need to open up a new scope in the called function.
        var deltaX = this.controlled.position.x - this.player.position.x;
        var deltaY = this.controlled.position.y - this.player.position.y;
        var distanceSq = deltaX * deltaX + deltaY * deltaY;
        if (distanceSq < this.vision * this.vision) {
            this.isPlayerClose = true;
            this._onCloseHandler();
        } else {
            this.isPlayerClose = false;
            this._onNotCloseHandler();
        }

        if (this.isPlayerClose && this.watchPlayer && this.controlled.autoFlip) {
            var dir = this.controlled.position.x > this.player.position.x ? -1 : 1;
            this.controlled.scale.x = dir;
        }

        this.wasPlayerClose = this.isPlayerClose;
    };

    Game.Controller.AI.prototype._onCloseHandler = function() {
        if (!this.wasPlayerClose && this.dialogue) {
            this.game.dialogueManager.setDialogue(this.dialogue);
        }
    };

    Game.Controller.AI.prototype._onNotCloseHandler = function() {
        if (this.wasPlayerClose && this.dialogue && this.dialogue.isOpen) {
            this.game.dialogueManager.hidden = true;
            this.dialogue.isOpen = false;
        }
    };

    /**
     * Monitors depencencies and checks if all is completed. If they are, Game.Controller.AI.prototype._dependenciesCompleteHandler is called
     * @return {undefined}
     */
    Game.Controller.AI.prototype._dependenciesMonitor = function() {
        if (this.friendlyDependencies) {
            this.game.objectiveManager.onObjectiveComplete.add(function() {
                this.dependenciesComplete = this.game.objectiveManager.isCompleted(this.friendlyDependencies);
                this._dependenciesCompleteHandler();
            }, this);
        }
    };

    /**
     * Gets called once all dependencies are complete
     * @return {undefined}
     */
    Game.Controller.AI.prototype._dependenciesCompleteHandler = function() {
    };

    /**
     * Monitors criterias and checks if all is completed. If they are, Game.Controller.AI.prototype._criteriasCompleteHandler is called
     * @return {undefined}
     */
    Game.Controller.AI.prototype._criteriasMonitor = function() {
        if (this.friendlyCriterias) {
            this.game.onCriteriaAdd.add(function() {
                // length===0 implies all completed
                this.criteriasComplete = _.difference(this.friendlyCriterias, this.game.criterias).length === 0;
                this._criteriasCompleteHandler();
            }, this);
        }
    };

    /**
     * Gets called once all criterias are complete
     * @return {undefined}
     */
    Game.Controller.AI.prototype._criteriasCompleteHandler = function() {
    };

})();

(function() {
    'use strict';

    /**
     * An AI that guards a position or entrance
     * @param {Phaser.Game}     game                    The game instance
     * @param {Phaser.Sprite}   controlled              The sprite which the AI controls
     * @param {Object}          Properties              Custom properties this AI can use
     * @param {Phaser.Sprite}   toTrack                 The sprite which the AI tracks
     */
    Game.Controller.AI.Guard = function(game, controlled, player, properties) {
        Game.Controller.AI.call(this, game, controlled, player, properties);

        /**
         * Whether or not this AI is hostile
         * @type {Boolean}
         */
        this.hostile = true;

        var angle = parseFloat(this.properties['angle'], 10) || Math.PI / 4;
        // Magnitude of push (hypotenuse)
        var magnitude = parseInt(this.properties['magnitude'], 10) || 1500;
        // -Math.sin(angle) because game world up/down is inverted
        /**
         * In what direction this AI will flick a trespassing character
         * @type {Phaser.Point}
         */
        this.flickVector = new Phaser.Point(Math.cos(angle) * magnitude, -Math.sin(angle) * magnitude);

        return this;
    };

    Game.Controller.AI.Guard.prototype = Object.create(Game.Controller.AI.prototype);
    Game.Controller.AI.Guard.prototype.constructor = Game.Controller.AI.Guard;

    Game.Controller.AI.Guard.prototype.update = function() {
        Game.Controller.AI.prototype.update.call(this);

        if (!this.hostile || (this.criteriasComplete && this.dependenciesComplete) && (this.friendlyCriterias || this.friendlyDependencies)) {
            this.right.setUp();
            this.left.setUp();
            this.jump.setUp();
            return;
        }

        if (this.game.physics.arcade.intersects(this.player.body, this.controlled.body)) {
            // Have to manually lift the guy up some pixel bc of bug where he stays on ground
            this.player.body.position.y -= 10;
            this.player.body.velocity.setTo(this.flickVector.x, this.flickVector.y);
            this.player.flicked = true;
        }
    };

})();

(function() {
    'use strict';

    /**
     * An AI that guards an area
     * @param {Phaser.Game}     game                    The game instance
     * @param {Phaser.Sprite}   controlled              The sprite which the AI controls
     * @param {Object}          Properties              Custom properties this AI can use
     * @param {Phaser.Sprite}   toTrack                 The sprite which the AI tracks
     */
    Game.Controller.AI.Ornithologist = function(game, controlled, player, properties) {
        Game.Controller.AI.Guard.apply(this, arguments);

        /**
         * The amounts of pixels this character will run to get the tracked character
         * @type {Number}
         */
        this.range = parseInt(properties.range, 10) || 100;

        /**
         * The default position of this character. The character will walk around this point and defaults to the position the character haves when this AI is created.
         * @type {Phaser.Point}
         */
        this.defaultPosition = controlled.position.clone();

        // The ornithologists are known for their high speed!
        this.controlled.walkingVelocity = 750;
        this.controlled.walkingAcc = 3000;

        return this;
    };

    Game.Controller.AI.Ornithologist.prototype = Object.create(Game.Controller.AI.Guard.prototype);
    Game.Controller.AI.Ornithologist.prototype.constructor = Game.Controller.AI.Ornithologist;

    Game.Controller.AI.Ornithologist.prototype.update = function() {
        Game.Controller.AI.Guard.prototype.update.call(this);

        if (!this.hostile) return;

        var left, right, jump;    
        if (this.range && Math.abs(this.defaultPosition.x - this.player.body.position.x) < this.range && Math.abs(this.defaultPosition.y - this.player.body.position.y) < this.range) {
            left = this.controlled.body.position.x - this.player.body.position.x > 0;
            right = this.controlled.body.position.x - this.player.body.position.x < 0;
        } else {
            left = this.controlled.body.position.x - this.defaultPosition.x > 100;
            right = this.controlled.body.position.x - this.defaultPosition.x < -100;
        }

        jump = (left || right) && (this.controlled.position.y - this.player.position.y > 100);

        if (left) {
            this.left.setDown();
            this.right.setUp();
        } else if (right) {
            this.left.setUp();
            this.right.setDown();
        } else {
            this.right.setUp();
            this.left.setUp();
        }

        if (this.controlled.body.blocked.left || this.controlled.body.blocked.right || jump) {
            this.jump.setDown();
        } else {
            this.jump.setUp();

        }
    };

})();

(function() {
    'use strict';

    /**
     * An AI that guards a position or entrance
     * @param {Phaser.Game}     game        The game instance
     * @param {Phaser.Sprite}   controlled  The sprite which the AI controls
     * @param {Object}          Properties  Custom properties this AI can use
     */
    Game.Controller.AI.Pacing = function(game, controlled, player, properties) {
        Game.Controller.AI.call(this, game, controlled, player, properties);

        /**
         * The max amounts of pixels this character will walk back and forth.
         * @type {Number}
         */
        this.range = parseInt(properties.range, 10) || 100;

        /**
         * The default position of this character. The character will walk around this point and defaults to the position the character haves when this AI is created.
         * @type {Phaser.Point}
         */
        this.defaultPosition = controlled.position.clone();

        /**
         * A pointer to the states RNG
         * @type {Phaser.RandomDataGenerator}
         */
        this.rnd = this.game.state.getCurrentState().rnd;

        /**
         * The current threshold for moving
         * @type {Number}
         */
        this.threshold = 0;

        /**
         * The amount to increase the threshold with on each unsuccessfull move
         * @type {Number}
         */
        this.thresholdInc = 0.00005;

        return this;
    };

    Game.Controller.AI.Pacing.prototype = Object.create(Game.Controller.AI.prototype);
    Game.Controller.AI.Pacing.prototype.constructor = Game.Controller.AI.Pacing;

    Game.Controller.AI.Pacing.prototype.update = function() {
        Game.Controller.AI.prototype.update.call(this);

        // Stay still if player is close
        if (this.isPlayerClose) return;

        // 0 < rnd.frac() < 1
        if (this.rnd.frac() < this.threshold) {

            // -1 < rnd.normal() < 1
            var dirValue = this.rnd.normal();
            var dirThreshold = (this.controlled.position.x - this.defaultPosition.x) / this.range;

            // true = left, false = right
            var dir  = dirValue < dirThreshold;

            if (dir) {
                this.right.setUp();
                this.left.setDown();
            } else {
                this.left.setUp();
                this.right.setDown();
            }

            setTimeout(this.stopWalk.bind(this), 150);

            this.threshold = 0;

        } else {
            this.threshold += this.thresholdInc;
        }

        if (this.controlled.body.blocked.left || this.controlled.body.blocked.right) {
            this.jump.setDown();
        } else {
            this.jump.setUp();
        }  
    };

    Game.Controller.AI.Pacing.prototype.stopWalk = function() {
        this.right.setUp();
        this.left.setUp();
    };

})();

(function() {
    'use strict';

    /**
     * An AI that guards a position or entrance
     * @param {Phaser.Game}     game                    The game instance
     * @param {Phaser.Sprite}   controlled              The sprite which the AI controls
     */
    Game.Controller.KeyboardController = function(game, controlled) {
        Game.Controller.call(this, game);

        /**
         * The character this controller is controlling
         * @type {Game.Character}
         */
        this.controlled = controlled;
        
        /**
         * A cursor object
         * @type {Object}
         * @type {Phaser.Key}   up
         * @type {Phaser.Key}   down
         * @type {Phaser.Key}   left
         * @type {Phaser.Key}   right
         */
        this.cursors = this.game.input.keyboard.createCursorKeys();

        /**
         * Spacebar key
         * @type {Phaser.Key}
         */
        this.spaceBar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);


        // Generate touch controls if touch is enabled on device
        if (Modernizr.touchevents) {
            this.generateTouchControls();
        }

        // Bind the controller keys
        this.bindKeys();

        return this;
    };

    Game.Controller.KeyboardController.prototype = Object.create(Game.Controller.prototype);
    Game.Controller.KeyboardController.prototype.constructor = Game.Controller.KeyboardController;

    Game.Controller.KeyboardController.prototype.bindKeys = function() {
        this.cursors.right.onDown.add(this.right.setDown);
        this.cursors.right.onUp.add(this.right.setUp);

        this.cursors.left.onDown.add(this.left.setDown);
        this.cursors.left.onUp.add(this.left.setUp);

        this.spaceBar.onDown.add(this.jump.setDown);
        this.spaceBar.onUp.add(this.jump.setUp);

        this.cursors.down.onDown.add(this.down.setDown);
        this.cursors.down.onUp.add(this.down.setUp);

        this.cursors.up.onDown.add(this.up.setDown);
        this.cursors.up.onUp.add(this.up.setUp);
    };

})();

(function() {
    'use strict';

    /**
     * An object representing a dialogue
     * @param {Phaser.Game}             game                    The game instance
     * @param {Array#Object | Object}   conversation            An array containing the conversation info for each slide in the dialogue
     * @param {String}                  conversation.title      The title of this slide
     * @param {String}                  conversation.text       The actual text of this slide in the dialogue
     * @param {Phaser.Sprite}           conversation.sprite     The sprite for this slide in the dialogue
     * @param {Phaser.Sprite|String}    conversation.background The background for this silde in the dialogue
     * @param {String}                  conversation.textStyle  The font style of this font in the conversation for the text
     * @param {String}                  conversation.titleStyle The font style of this font in the conversation for the title
     * @param {String}                  title                   Default title if a slide in the conversation does not have one
     * @param {Object}                  textStyle               Default font style if a slide in the conversation does not have one
     * @param {Object}                  titleStyle              Default font style for the title if a slide in the conversation does not have one
     * @param {Phaser.Sprite}           sprite                  Default sprite if a slide in the conversation does not have one
     * @param {Phaser.Sprite|String}    background              Default background if a slide in the conversation does not have one
     */
    Game.Dialogue = function(game, conversation, title, textStyle, titleStyle, sprite, background) {
        this.game = game;

        /**
         * An array containing the conversation info for each slide in the dialogue
         * @type {Array#Object}
         */
        this.conversation = conversation;
        if (conversation.constructor !== Array) {
            this.conversation = [this.conversation];
        }

        /**
         * Amount of slides in the dialogue
         * @type {Number}
         */
        this.nSlides = this.conversation.length;

        /**
         * The current slide in the dialogue. If -1, it has not yet started
         * @type {Number}
         */
        this.currentSlide = -1;

        /**
         * Default title if a slide in the conversation does not have one
         * @type {String}
         */
        this.defaultTitle = title;

        /**
         * Default sprite if a slide in the conversation does not have one
         * @type {String}
         */
        this.defaultSprite = sprite;

        /**
         * Default font style if a slide in the conversation does not have one
         * @type {Object}
         */
        this.defaultTextStyle = textStyle;

        /**
         * Default font style for the title if a slide in the conversation does not have one
         * @type {Object}
         */
        this.defaulTitleStyle = titleStyle;

        /**
         * Default background if a slide in the conversation does not have one
         * @type {Phaser.Sprite|String}
         */
        this.defaultBackground = background;

        /**
         * Whether or not this dialogue is currently displayed in the dialogue manager
         * @type {Boolean}
         */
        this.isOpen = false;

        return this;
    };

    Game.Dialogue.prototype.constructor = Game.Dialogue;

    

})();

(function() {
    'use strict';

    Game.DialogueManager = function(game, parent) {
        /**
         * The game instance
         * @type {Phaser.Game}
         */
        this.game = game;

        /**
         * The parent group of the dialogue panel
         * @type {Phaser.Group}
         */
        this.parent = parent;

        /**
         * The easing function to animate the dialogue panel
         * @type {[type]}
         */
        this.easing = Phaser.Easing.Power2;

        /**
         * Height in pixels of dialogue panel
         * @type {Number}
         */
        this.height = 200;

        this.width = 975;

        /**
         * The padding between the title and text
         * @type {Number}
         */
        this.padding = 20;

        /**
         * Whether or not the dialogue panel is hidden
         * @type {Boolean}
         */
        this._hidden = true;

        /**
         * The dialogue panel group, in where the title and text objects are placed
         * @type {Phaser.Group}
         */
        this.dialoguePanel = this.game.add.group(this.parent, 'Dialogue Panel');
        this.dialoguePanel.x = this.game.width * 0.2;
        this.dialoguePanel.y = this.game.height;

        /**
         * The background of the dialogue panel
         * @type {Phaser.Sprite}
         */
        this._background = new Phaser.Sprite(this.game, this.game.width * 0.5 - this.dialoguePanel.x, 0, '');
        this._background.anchor.setTo(0.5, 0);
        this.dialoguePanel.add(this._background);

        /**
         * The text object of the title
         * @type {Phaser.Text}
         */
        this.titleText = new Phaser.BitmapText(this.game, 0, 0, 'font', 'title', 50);
        this.titleText.tint = 0x010101;
        this.titleText.y = this.padding;

        /**
         * The default font size of the text body
         * @type {Number}
         */
        this.defaultTextFontSize = this.titleText.fontSize * 0.8;

        /**
         * The text object of the text
         * @type {Phaser.Text}
         */
        this.textText = new Phaser.BitmapText(this.game, 0, 0, 'font', 'text', this.defaultTextFontSize);
        this.textText.tint = 0x010101;
        this.textText.maxWidth = 1000;

        /**
         * The text object that shows page number
         * @type {Phaser.Text}
         */
        this.pageText = new Phaser.BitmapText(this.game, 0, 0, 'font', '0/0', this.titleText.fontSize * 0.6);
        this.pageText.tint = 0x010101;

        /**
         * The current dialogue
         * @type {Game.Dialogue}
         */
        this.currentDialogue = null;

        /**
         * The default title style
         * @type {Object}
         */
        this.defaultTitleStyle = {font: 'bold 24pt serif'};

        /**
         * The default text style
         * @type {Object}
         */
        this.defaultTextStyle = {font: '20pt serif'};

        /**
         * The default background for the dialogue panel
         * @type {String}
         */
        this.defaultBackground = 'dialoguePanel';

        this.dialoguePanel.add(this.titleText);
        this.dialoguePanel.add(this.textText);
        this.dialoguePanel.add(this.pageText);

        return this;
    };

    Game.DialogueManager.prototype.constructor = Game.DialogueManager;

    Game.DialogueManager.prototype.setDialogue = function(dialogue, autoShow, reset) {
        if (this.currentDialogue) {
            this.currentDialogue.isOpen = false;
        }

        this.currentDialogue = dialogue;

        autoShow = typeof autoShow !== 'undefined' ? autoShow : true;
        reset = typeof reset !== 'undefined' ? reset : true;


        if (reset === true) {
            this.currentDialogue.currentSlide = -1;
        }

        if (autoShow) {
            this.hidden = false;
        }

        this.nextSlide();
    };

    Game.DialogueManager.prototype.nextSlide = function() {
        if (!this.currentDialogue) return;

        this.currentDialogue.currentSlide++;

        if (this.currentDialogue.currentSlide === this.currentDialogue.conversation.length) {
            this.hidden = true;
            this.currentDialogue.currentSlide = -1;
        } else {
            this.refreshDialogue();
        }

        this.currentDialogue.isOpen = !this.hidden;
    };

    Game.DialogueManager.prototype.refreshDialogue = function() {
        var currentSlide = this.currentDialogue.conversation[this.currentDialogue.currentSlide];

        this.titleText.text = currentSlide.title || this.currentDialogue.defaultTitle || '';

        this.textText.text = currentSlide.text || this.currentDialogue.defaultText || '';
        this.textText.fontSize = currentSlide.fontSize || currentSlide.fontScale * this.defaultTextFontSize || this.defaultTextFontSize;
        this.textText.y = this.height * 0.5;

        var newBG = currentSlide.background || this.currentDialogue.defaultBackground || this.defaultBackground;
        if (this._background.key !== newBG) {
            this._background.loadTexture(newBG);

            if (!this.hidden) {
                this.hidden = false;
            }
        }

        this.pageText.text = 'Page {0}/{1}'.format(this.currentDialogue.currentSlide + 1, this.currentDialogue.conversation.length);
        this.pageText.updateTransform();
        this.pageText.y = this.height;
        this.pageText.x = this.width - this.pageText.width;
    };

    Object.defineProperty(Game.DialogueManager.prototype, 'hidden', {

        get: function() {
            return this._hidden;
        },

        set: function(value) {
            this._hidden = value;

            if (this._hidden) {
                var add = this.padding;

                this.game.add.tween(this.dialoguePanel.position)
                    .to({ y: this.game.height + add }, 1000, this.easing)
                    .start()
                    .onComplete.add(function() {

                        if (this._hidden) {
                            this.dialoguePanel.visible = false;
                        }
                    }, this);
            } else {
                this.dialoguePanel.visible = true;
                this.game.add.tween(this.dialoguePanel.position).to({ y: this.game.height - this.dialoguePanel.height - this.padding }, 1000, this.easing).start();
            }
        }

    });
})();

(function() {
    'use strict';

    /**
     * Reference file: https://github.com/photonstorm/phaser-examples/blob/master/projects/rox/src/Player.js
     */

    var _textureKey = 'alienYellow';
    var maxSpeed = 500;
    var acc = 2000;
    var controller = Game.Controller.AI;
    var maxVelocity = new Phaser.Point(3000, 2000);
    var maxWalkingVelocity = new Phaser.Point(500, 0);

    Game.Enemy = function(game, x, y, textureKey, controller) {

        Phaser.Sprite.call(this, game, x, y, _textureKey || textureKey);

        this.anchor.set(0.5);
        this.game.physics.enable(this, Phaser.Physics.ARCADE);

        this.body.collideWorldBounds = true;
        this.body.drag.setTo(1000, 0);
        this.body.maxVelocity = maxVelocity;

        this.controller = controller;
        this.controller.controlled = this;

        this.animations.add('running', [9, 10], 10, true);
        this.animations.add('jump', [5], 20, true);
        this.animations.add('falling', [4], 20, true);
        this.animations.add('still', [0], 20, true);

        this.currAnim = '';

        var point = new Phaser.Point();
        point.x = 500;
        point.y = 1000;
        this.body.maxVelocity = point;

        return this;
    };

    // Clone the Phaser.Sprite prototype, and use it as our own. 
    // This is how inheritance works in JavaScript btw
    Game.Enemy.prototype = Object.create(Phaser.Sprite.prototype);
    Game.Enemy.prototype.constructor = Game.Enemy;

    Game.Enemy.prototype.animate = function() {
    };

    Game.Enemy.prototype.update = function() {
        if (this.controller.right.isDown) {
            this.body.acceleration.x = acc;
            this.body.velocity.x = Math.clamp(this.body.velocity.x, -maxWalkingVelocity.x, maxWalkingVelocity.x);

            this.animations.play('running');

            this.scale.x = 1;
        } else if (this.controller.left.isDown) {
            this.body.acceleration.x = -acc;
            this.body.velocity.x = Math.clamp(this.body.velocity.x, -maxWalkingVelocity.x, maxWalkingVelocity.x);

            this.animations.play('running');

            this.scale.x = -1;
        } else {
            this.body.acceleration.setTo(0);
        }


        if (this.body.onFloor() && this.controller.jump.isDown) {
            this.body.velocity.y -= 2000;
        }

        // this.animate();
    };

})();

(function() {
    'use strict';

    Game.GUI.Button = function(game, x, y, key, text, fontKey, callback, callbackContext, overFrame, outFrame, downFrame, upFrame) {
        Phaser.Button.call(this, game, x, y, key, callback, callbackContext, overFrame, outFrame, downFrame, upFrame);

        this._text = text;

        this._bmpText = new Phaser.BitmapText(this.game, 0, 0, fontKey, this._text, 60);
        this._bmpText.align = 'center';
        this.addChild(this._bmpText);

        this.anchor.setTo(0.5);

        this.fontTint = 0x010101;
        this._refresh();
    };

    Game.GUI.Button.prototype = Object.create(Phaser.Button.prototype);
    Game.GUI.Button.prototype.constructor = Game.GUI.Button;

    Game.GUI.Button.prototype._refresh = function() {
        this._bmpText.x = this._bmpText.width * -0.5;
        this._bmpText.y = this._bmpText.height * -0.5;
    };

    Object.defineProperty(Game.GUI.Button.prototype, 'text', {
        get: function() {
            return this._bmpText.text;
        },

        set: function(value) {
            this._bmpText.text = value;
            this._bmpText.updateTransform();
            this._refresh();
        }
    });

    Object.defineProperty(Game.GUI.Button.prototype, 'fontTint', {
        get: function() {
            return this._bmpText.tint;
        },

        set: function(value) {
            this._bmpText.tint = value;
        }
    });

    Object.defineProperty(Game.GUI.Button.prototype, 'fontSize', {
        get: function() {
            return this._bmpText.fontSize;
        },

        set: function(value) {
            this._bmpText.fontSize = value;
            this._bmpText.updateTransform();
            this._refresh();
        }
    });

})();
(function() {
    'use strict';

    Game.GUI.HelpScreen = function(game, parent) {
        Phaser.Group.call(this, game, parent, 'HelpScreen');

        /**
         * The padding in pixels between buttons
         * @type {Number}
         */
        this.padding = 20;

        var bmd = this.game.make.bitmapData(this.game.width, this.game.height);
        bmd.fill(0, 0, 0, 0.75);
        /**
         * The pause screen background
         * @type {Phaser}
         */
        this.bg = new Phaser.Image(this.game, 0, 0, bmd);
        this.bg.bmd = bmd;
        this.add(this.bg);

        /**
         * The resume button
         * @type {Game.GUI.Button}
         */
        this.closeHelpBtn = new Game.GUI.Button(this.game, this.game.width, this.padding, 'knapp', 'Close', 'font', this.closeHelp, this);
        this.closeHelpBtn.scale.setTo(0.4);
        this.closeHelpBtn.position.x -= (this.closeHelpBtn.width * 0.5 + 20);
        this.closeHelpBtn.position.y += 40;
        this.add(this.closeHelpBtn);

        this.helpText = 
            'Controls: \n\n' + 
            '      Walk: Left/Right arrow key\n' +
            'Jump/Climb: Spacebar\n' + 
            ' Next Page: Up arrow key';

        this.helpBitmapText = this.game.add.bitmapText(0, this.closeHelpBtn.y + this.closeHelpBtn.height + this.padding, 'font', this.helpText, 32, this);

        this.helpBitmapText.position.x = this.game.width * 0.5 - this.helpBitmapText.width * 0.5;

        this.alpha = 0;
        this.game.add.tween(this).to({alpha: 1}, 300).start();
    };

    Game.GUI.HelpScreen.prototype = Object.create(Phaser.Group.prototype);
    Game.GUI.HelpScreen.prototype.constructor = Game.GUI.HelpScreen;

    Game.GUI.HelpScreen.prototype.closeHelp = function() {
        this.game.add.tween(this).to({alpha: 0}, 300).start().onComplete.add(function() {
            // if (this.game) as the reference to this.game could have been destroyed during the tween
            if (this.game) this.game.state.getCurrentState().closeHelp();
        }, this);
    };

})();

(function() {
    'use strict';

    Game.GUI.PauseScreen = function(game, parent) {
        Phaser.Group.call(this, game, parent, 'PauseScreen');

        /**
         * The padding in pixels between buttons
         * @type {Number}
         */
        this.padding = 20;

        var bmd = this.game.make.bitmapData(this.game.width, this.game.height);
        bmd.fill(0, 0, 0, 0.75);
        /**
         * The pause screen background
         * @type {Phaser}
         */
        this.bg = new Phaser.Image(this.game, 0, 0, bmd);
        this.bg.bmd = bmd;
        this.add(this.bg);

        /**
         * The resume button
         * @type {Game.GUI.Button}
         */
        this.resumeBtn = new Game.GUI.Button(this.game, this.game.width * 0.5, this.game.height * 0.4, 'knapp', 'Resume', 'font', this.resume, this);
        this.resumeBtn.scale.setTo(0.8);
        this.add(this.resumeBtn);

        /**
         * The toggle multiplayer button
         * @type {Game.GUI.Button}
         */
        this.multiplayerBtn = new Game.GUI.Button(this.game, this.game.width * 0.5, this.resumeBtn.position.y + this.resumeBtn.height + this.padding, 'knapp', 'Multiplayer:\noff', 'font', this.toggleMultiplayer, this);
        this.multiplayerBtn.scale.setTo(0.8);
        this.multiplayerBtn.position.x -= (this.multiplayerBtn.width + this.padding) * 0.5;
        this.add(this.multiplayerBtn);

        /**
         * The toggle music button
         * @type {Game.GUI.Button}
         */
        this.musicBtn = new Game.GUI.Button(this.game, this.game.width * 0.5, this.multiplayerBtn.position.y + this.multiplayerBtn.height + this.padding, 'knapp', 'music_btn', 'font', this.toggleMusic, this);
        this.musicBtn.scale.setTo(0.8);
        this.musicBtn.position.x -= (this.musicBtn.width + this.padding) * 0.5;
        this._refreshMusicBtn();
        this.add(this.musicBtn);

        /**
         * The toggle mute button
         * @type {Game}
         */
        this.toggleMuteBtn = new Game.GUI.Button(this.game, this.game.width * 0.5, this.musicBtn.position.y, 'knapp', 'mute_btn', 'font', this.toggleMute, this);
        this.toggleMuteBtn.scale.setTo(0.8);
        this.toggleMuteBtn.position.x += (this.toggleMuteBtn.width + this.padding) * 0.5;
        this._refreshMuteBtn();
        this.add(this.toggleMuteBtn);

        /**
         * The toggle fullscreen button
         * @type {Game.GUI.Button}
         */
        this.fullscreen = new Game.GUI.Button(this.game, this.game.width * 0.5, this.resumeBtn.position.y + this.resumeBtn.height + this.padding, 'knapp', 'Toggle\nFullscreen', 'font', this.toggleFullscreen, this);
        this.fullscreen.scale.setTo(0.8);
        this.fullscreen.position.x += (this.musicBtn.width + this.padding) * 0.5;
        this.add(this.fullscreen);




        this.alpha = 0;
        this.game.add.tween(this).to({alpha: 1}, 300).start();
    };

    Game.GUI.PauseScreen.prototype = Object.create(Phaser.Group.prototype);
    Game.GUI.PauseScreen.prototype.constructor = Game.GUI.PauseScreen;

    Game.GUI.PauseScreen.prototype.resume = function() {
        this.game.add.tween(this).to({alpha: 0}, 300).start().onComplete.add(function() {
            if (this.game) this.game.state.getCurrentState().resume();
        }, this);
    };

    Game.GUI.PauseScreen.prototype.pause = function() {
        this.game.state.getCurrentState().resume();
    };

    Game.GUI.PauseScreen.prototype.toggleMusic = function() {
        this.game.state.getCurrentState().toggleMusic();
        this._refreshMusicBtn();
    };

    Game.GUI.PauseScreen.prototype.toggleMute = function() {
        this.game.sound.mute = !this.game.sound.mute;
        this._refreshMuteBtn();
    };


    Game.GUI.PauseScreen.prototype._refreshMusicBtn = function() {
        this.musicBtn.text = !this.game.musicMuted ? 'Music: on' : 'Music: off';
    };

    Game.GUI.PauseScreen.prototype._refreshMuteBtn = function() {
        this.toggleMuteBtn.text = this.game.sound.mute ? 'Sound: off' : 'Sound: on';
    };

    Game.GUI.PauseScreen.prototype.toggleFullscreen = function() {
        this.game.state.getCurrentState().toggleFullScreen();
    };

    Game.GUI.PauseScreen.prototype.toggleMultiplayer = function() {
        if (this.game.mpClient) {
            this.game.mpClient.disconnect();
            this.game.mpClient = null;
            this.multiplayerBtn.text = 'Multiplayer:\noff';
        } else {
            if (io) {
                var serverUrl = 'http://{0}:{1}'.format(window.location.hostname, 3001);
                this._createMPClient(serverUrl);
                this.multiplayerBtn.text = 'Multiplayer:\non';
            }
        }
    };

    Game.GUI.PauseScreen.prototype._createMPClient = function(url) {
        this.game.mpClient = new Game.MPClient(this.game, url);
    };

})();

(function() {
    'use strict';

    Game.HUD = function(game) {
        Phaser.Group.call(this, game);

        this.fixedToCamera = true;

        this.createMenu();

        this.createHelpBtn();

        return this;
    };

    Game.HUD.prototype = Object.create(Phaser.Group.prototype);
    Game.HUD.prototype.constructor = Game.HUD;

    Game.HUD.prototype.createMenu = function() {
        var menuButton = this.menuButton = new Game.GUI.Button(this.game, 0, 60, 'knapp', 'Menu (P)', 'font');
        menuButton.scale.setTo(0.4);
        menuButton.position.x = menuButton.width * 0.5 + 20;

        menuButton.onInputDown.add(function() {
            this.game.state.getCurrentState().togglePause();
        }, this);

        this.add(menuButton);
    };

    Game.HUD.prototype.createHelpBtn = function() {
        var helpBtn = this.helpBtn = new Game.GUI.Button(this.game, this.game.width, 60, 'knapp', 'Help (H)', 'font');
        helpBtn.scale.setTo(0.4);
        helpBtn.position.x -= (helpBtn.width * 0.5 + 20);

        helpBtn.onInputDown.add(function() {
            this.game.state.getCurrentState().openHelp();
        }, this);

        this.add(helpBtn);
    };


})();

(function() {
    'use strict';

    Game.Init = function(game) {
        this.maxWidth = 1280;
        this.maxHeight = 720;
    };

    Game.Init.prototype = {

        /**
         * Load content here, e.g. this.load.image('myDude', '/assets/images/myDude.png')
         */
        preload: function() {
            this.game.load.image('preloadBar', 'assets/loadingbar.png');
            this.game.load.image('preloadBarFrame', 'assets/loadingbar_frame.png');
        },

        /**
         * Initialization logic here
         */
        create: function() {
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

            this.scale.minWidth = 256;
            this.scale.minHeight = 196;
            this.scale.maxWidth = this.maxWidth;
            this.scale.maxHeight = this.maxHeight;

            // Refreshes viewport on start to make it correct size
            this.scale.refresh();

            // Disabled auto-pause on game focus lost
            this.stage.disableVisibilityChange = true;

            //Fullscreen mode = maintain aspect radio
            this.game.scale.fullScreenTarget = document.getElementById('game');
            this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.game.scale.enterFullScreen.add(function() {
                delete this.scale.maxWidth;
                delete this.scale.maxHeight;
            }, this);
            this.game.scale.leaveFullScreen.add(function() {
                this.scale.maxWidth = this.maxWidth;
                this.scale.maxHeight = this.maxHeight;
            }, this);

            if (self.localStorage && self.localStorage.hasOwnProperty('music')) {
                if (self.localStorage.music === 'true') {
                    // this.game.sound.mute = true;
                    this.game.musicMuted = true;
                } else {
                    // this.game.sound.mute = false;
                    this.game.musicMuted = false;
                }
            }

            this.state.start('Game.MainMenu');
        }
    };
})();

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

        // A collection of sprites
        this.sprites = {};

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
                this.p1.body.checkCollision.up = true;
                this.p1.body.checkCollision.down = true;
                this.p1.body.checkCollision.left = true;
                this.p1.body.checkCollision.right = true;
                this.p1.body.allowGravity = true;
            } else {
                this.game.add.existing(this.fpsMeter);
                this.level.debug = true;
                // this.p1.body.checkCollision.up = false;
                // this.p1.body.checkCollision.down = false;
                // this.p1.body.checkCollision.left = false;
                // this.p1.body.checkCollision.right = false;
                this.p1.body.allowGravity = false;
            }
            if (this.p1) {
                this.p1.godMode = !this.p1.godMode;

                if (this.p1.godMode) {
                } else {
                }
            }

            this.level.dirty = true;
            this.debugMode = !this.debugMode;
        };

        this.startTime;

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
            if (key === 'map') {
                assetLoadingText.text = 'Generating world, this can take a while! :D';
            } else {
                assetLoadingText.text = 'Loading file "{0}" from "{1}"'.format(key, url);
            }
            assetLoadingText.updateTransform();
            assetLoadingText.x = this.game.width * 0.5 - assetLoadingText.width * 0.5;
        }, this);

        this.helpText = 
            '      Walk: Left/Right arrow key\n' +
            'Jump/Climb: Spacebar\n' + 
            ' Next Page: Up arrow key';

        this.helpBitmapText = this.game.add.bitmapText(0, assetLoadingText.position.y + 100, 'font', this.helpText, 32);
        this.helpBitmapText.position.x = this.game.width * 0.5 - this.helpBitmapText.width * 0.5;


        this.game.load.spritesheet('player1', 'assets/characters/player.png', 40, 76);
        this.game.load.spritesheet('spritesheet', 'assets/spritesheet.png', 64, 64);

        this.game.load.audio('jump', ['assets/sfx/jump.ogg', 'assets/sfx/jump.mp3']);
        this.game.load.audio('objectComplete', ['assets/sfx/object_complete.ogg', 'assets/sfx/object_complete.mp3']);
        this.game.load.audio('pickupCoin', ['assets/sfx/pickup_coin.ogg', 'assets/sfx/pickup_coin.mp3']);
        this.game.load.audio('thud', ['assets/sfx/thud.ogg', 'assets/sfx/thud.mp3']);
        this.game.load.audio('footstep', ['assets/sfx/footstep.ogg', 'assets/sfx/footstep.mp3']);

        // Credits of boss music due to 13NHarri @ http://freesound.org/people/13NHarri/sounds/251334/
        this.game.load.audio('boss', ['assets/music/boss.mp3', 'assets/music/boss.ogg']);
        this.game.load.audio('truddelutt', ['assets/music/truddelutt.mp3', 'assets/music/truddelutt.ogg']);
        this.game.load.audio('truddelutt_orgel', ['assets/music/truddelutt_orgel.mp3', 'assets/music/truddelutt_orgel.ogg']);
        this.game.load.audio('lugnofin', ['assets/music/Lugn_och_Fin_Symaskin.mp3', 'assets/music/Lugn_och_Fin_Symaskin.ogg']);
        this.game.load.audio('byggarebob', ['assets/music/byggarebob.mp3', 'assets/music/byggarebob.ogg']);

        this.game.load.image('dialoguePanel', 'assets/dialoguePanel.png');
        this.game.load.image('grasshopper', 'assets/characters/grasshopper256.png');
        this.game.load.image('octopus', 'assets/characters/octopus.png');
        this.game.load.image('bob', 'assets/characters/bob.png');
        this.game.load.image('ornithologist', 'assets/characters/ornithologist.png');
        this.game.load.image('ladydog', 'assets/characters/ladydog.png');
        this.game.load.image('sidecut', 'assets/characters/sidecut.png');
        this.game.load.image('florence', 'assets/characters/florence.png');
        this.game.load.image('mamabirdie', 'assets/characters/mamabirdie.png');
        this.game.load.image('peeti', 'assets/characters/peeti.png');
        this.game.load.image('guard', 'assets/characters/guard.png');
        this.game.load.image('gris', 'assets/characters/gris.png');
        this.game.load.image('apan', 'assets/characters/apan.png');
        this.game.load.image('delilah', 'assets/characters/delilah.png');

        this.game.load.spritesheet('torch', 'assets/items/torch.png', 16, 52);
        this.game.load.spritesheet('portal', 'assets/items/portal.png', 200, 256);
        this.game.load.image('batteria', 'assets/items/batteria.png');
        this.game.load.image('pearl', 'assets/items/pearl.png');
        this.game.load.image('manick', 'assets/items/manick.png');
        this.game.load.image('egg', 'assets/items/egg.png');
        this.game.load.image('bone', 'assets/items/bone.png');

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

        var width = this.game.width * 0.25;
        var height = this.game.height * 0.25;

        // The layer that the player does not interact with
        this.behind = this.map.createLayer('behind', width, height);
        this.behind.overlay = 'rgba(0,0,0,0.4)';
        this.behind.scale.setTo(4);
        this.behind.smoothed = false;

        this.level = this.map.createLayer('collision', width, height);
        this.level.scale.setTo(4);
        this.level.smoothed = false;
        // The layer containing platforms
        var firstID = this.map.tilesets[this.map.getTilesetIndex('spritesheet')].firstgid;
        var collisionTiles = [];
        _.forEach(this.map.objects, function(objects) {
            _.forEach(objects, function(obj) {
                obj.x *= 4;
                obj.y *= 4;
                obj.width *= 4;
                obj.height *= 4;
            });
        });
        _.forEach(this.behind.layer.data, function(e) {
            _.forEach(e, function(t) {
                t.worldX *= 4;
                t.worldY *= 4;
                t.width *= 4;
                t.height *= 4;
            });
        });
        _.forEach(this.level.layer.data, function(e) {
            _.forEach(e, function(t) {
                t.worldX *= 4;
                t.worldY *= 4;
                t.width *= 4;
                t.height *= 4;

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
        this.front = this.map.createLayer('front', width, height);
        this.front.scale.setTo(4);
        this.front.smoothed = false;
        _.forEach(this.front.layer.data, function(e) {
            _.forEach(e, function(t) {
                t.worldX *= 4;
                t.worldY *= 4;
                t.width *= 4;
                t.height *= 4;
            });
        });

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

            'playMusic': function(obj, key, duration, interrupt, loop, volume) {
                if (!key) return;

                duration = duration || 1000;
                interrupt = interrupt ? interrupt === 'true' : false;
                loop = loop ? loop === 'true' : false;
                volume = volume ? parseFloat(volume, 10) : 0.3;
                // add music only if there is no music playing, or if interrupt is set to true
                var addMusic = interrupt || !(this.music && this.music.isPlaying);

                if (addMusic) {
                    this.triggerFunctions.stopMusic.call(this, obj, duration);
                    this.music = this.game.sound.add(key);
                    // Start only if music isnt muted
                    if (!this.game.musicMuted) {
                        this.music.onDecoded.add(function() {
                            this.music.play('', 0, 0, loop);
                            this.music.fadeTo(duration, volume);
                        }, this);
                    }
                }

            },

            'stopMusic': function(obj, duration) {
                if (this.music && this.music.isPlaying) {
                    duration = duration || 1000;
                    this.music.fadeOut(duration);
                }
            },

            'setSpriteFrame': function(obj, id, frame) {
                if (this.sprites[id]) {
                    this.sprites[id].frame = parseInt(frame, 10);
                }
            },

            'startEnding': function(obj) {
                this.triggerFunctions.playMusic.call(this, obj, 'truddelutt_orgel', undefined, 'true');

                this.p1.body.enable = false;

                this.game.add.tween(this.p1).to({rotation: Math.PI * 2}, 1000, undefined, false, 500, -1, false).start();
                var scaleTween = this.game.add.tween(this.p1.scale)
                    .to({x: 3, y: 3}, undefined, undefined, false, 500)
                    .start();

                scaleTween.onComplete.add(function() {
                    scaleTween.to({x: 6, y: 6}, 1000, undefined, false, undefined, -1, true).start();
                });

                var deltaTime = new Date(Date.now() - this.startTime);
                this.game.add.tween(this.p1)
                    .to({alpha: 0}, 5000, Phaser.Easing.Bounce.In, false, 500)
                    .start()
                    .onComplete.add(function() {
                        var bg = this.game.add.bitmapData(this.game.width, this.game.height);
                        var bgImg = this.game.add.image(0, 0, bg);
                        bgImg.fixedToCamera = true;
                        bg.fill(0, 0, 0);

                        var text = 
                        'The End!\n' + 
                        'You Completed the game in {0} minutes and {1} seconds\n'.format(deltaTime.getMinutes(), deltaTime.getSeconds()) + 
                        '\nIt would be highly appreciated if you could spend 5-10 minutes \nfilling out our survey, which can be found below, \nor at "http://goo.gl/forms/T5vUQISE5I"';
                        var endText = this.game.add.bitmapText(this.game.width * 0.5, this.game.height * 0.5 - 100, 'font', text, 26);
                        endText.align = 'center';
                        endText.x -= endText.width * 0.5;

                        var surveyBtn = new Game.GUI.Button(this.game, this.game.width * 0.5, this.padding, 'knapp', 'Open Survey', 'font', function() {
                            window.open('https://docs.google.com/forms/d/1eMY-jhFSJwzuuoRPk0Sid8m1CYdxSNRBtQsuUatC1vo/viewform?usp=send_form');
                        });
                        surveyBtn.scale.setTo(0.8);
                        surveyBtn.position.y = endText.y + endText.height + surveyBtn.height * 0.5 + 20;

                        var creditText = this.game.add.bitmapText(20, this.game.height - 20, 'font', 'The music heard when facing the ornithologist was created by 13NHarri @ Freesound.org', 20);

                        bgImg.addChild(surveyBtn);
                        bgImg.addChild(endText);
                        bgImg.addChild(creditText);

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
                    var frame = parseInt(obj.properties['frame'], 10);
                    var sprite = this.game.add.sprite(obj.x + obj.width * 0.5, obj.y + obj.height * 0.5, key, frame, this.entitiesGroup);

                    var id = obj.properties['id'];
                    if (id) {
                        this.sprites[id] = sprite;
                    }
                    console.log(id, sprite);

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

                    var id = obj.properties['id'];
                    if (id) {
                        this.sprites[id] = sprite;
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
    };

    /**
     * Initialization logic here
     */
    Game.Level.prototype.create = function() {

        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.gravity = Game.gravity;
        this.game.physics.arcade.TILE_BIAS = 64;

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
        // this.game.world.bringToTop(this.frontGroup);

        this.objectiveManager.createObjectives(this.map, this.map.objects['objectives'], this.p1);

        this.activateKey.onDown.add(function() {
            this.dialogueManager.nextSlide();
        }, this);

        this.game.input.keyboard.addKey(Phaser.Keyboard.P).onUp.add(this.togglePause, this);
        this.game.input.keyboard.addKey(Phaser.Keyboard.H).onUp.add(this.toggleHelp, this);

        this.game.world.bringToTop(this.HUD);

        this.paintBG();
        this.startTime = Date.now();
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

(function() {

    function bind(context, func) {
        return function() {
            func.apply(context, arguments);
        };
    }

    Game.MPClient = function(game, url) {
        /**
         * The phaser game instance
         * @type {Phaser.Game}
         */
        this.game = game;

        /**
         * The servers URL
         * @type {String}
         */
        this.url = url;

        /**
         * This clients ID
         * @type {String}
         */
        this.id = undefined;

        /**
         * [socket description]
         * @type {IO.Socket}
         */
        this.socket = undefined;

        /**
         * A collection containing all characters created by the server
         * @type {Object}
         */
        this.characters = {};

        this.state = this.game.state.getCurrentState();
        this.p1 = this.state.p1;

        this.connect();
        this.setEvents();
    };

    Game.MPClient.prototype.constructor = Game.MPClient;

    Game.MPClient.prototype.connect = function() {
        this.socket = new io(this.url, {'force new connection': true});
    };

    Game.MPClient.prototype.sendPosition = function() {
        var pos = {
            x: this.p1.position.x,
            y: this.p1.position.y
        };

        this.socket.emit('action', { position: pos });

        setTimeout(bind(this, this.sendPosition), 500);
    };

    Game.MPClient.prototype.setEvents = function() {
        this.socket.on('id', bind(this, this.onID));
        this.socket.on('new', bind(this, this.onNew));
        this.socket.on('delete', bind(this, this.onDelete));
        this.socket.on('position', bind(this, this.onPosition));
        this.socket.on('action', bind(this, this.onAction));

        this.bindController();
    };
    
    Game.MPClient.prototype.bindController = function() {
        this.p1.controller.down.onDown.add(this.sendController, this);
        this.p1.controller.down.onUp.add(this.sendController, this);

        this.p1.controller.left.onDown.add(this.sendController, this);
        this.p1.controller.left.onUp.add(this.sendController, this);

        this.p1.controller.right.onDown.add(this.sendController, this);
        this.p1.controller.right.onUp.add(this.sendController, this);

        this.p1.controller.jump.onDown.add(this.sendController, this);
        this.p1.controller.jump.onUp.add(this.sendController, this);
    };

    Game.MPClient.prototype.unbindController = function() {
        this.p1.controller.down.onDown.remove(this.sendController, this);
        this.p1.controller.down.onUp.remove(this.sendController, this);

        this.p1.controller.left.onDown.remove(this.sendController, this);
        this.p1.controller.left.onUp.remove(this.sendController, this);

        this.p1.controller.right.onDown.remove(this.sendController, this);
        this.p1.controller.right.onUp.remove(this.sendController, this);

        this.p1.controller.jump.onDown.remove(this.sendController, this);
        this.p1.controller.jump.onUp.remove(this.sendController, this);
    };

    Game.MPClient.prototype.sendController = function(key, state) {
        var action = {};
        action[key] = state;
        this.socket.emit('action', action);
    };

    Game.MPClient.prototype.onID = function(data) {
        this.id = data.id;

        var pos = {
            x: this.p1.position.x,
            y: this.p1.position.y
        };
        var key = this.p1.key;

        this.socket.emit('new', { position: pos, texture: key });
        this.sendPosition();
    };

    Game.MPClient.prototype.onNew = function(data) {
        if (data.id === this.id) return;

        var controller = new Game.Controller(this.game);

        var character = new Game.Character(this.game, data.position.x, data.position.y, data.texture || 'grasshopper', controller);
        this.game.entitiesGroup.add(character);

        this.characters[data.id] = character;
    };

    Game.MPClient.prototype.onDelete = function(data) {
        if (data.id === this.id) return;

        var character = this.characters[data.id];
        this.game.entitiesGroup.remove(character, true);

        this.characters[data.id] = null;
    };

    Game.MPClient.prototype.onPosition = function(data) {
        if (data.id === this.id) return;

        var character = this.characters[data.id];

        if (!character) return;

        character.position.setTo(data.position.x, data.position.y);
    };

    Game.MPClient.prototype.onAction = function(data) {

        _.forEach(data, function(actions, id) {
            if (id === this.id) return;
            var character = this.characters[id];

            _.forEach(actions, function(action) {
                var type = _.keys(action)[0];
                var value = action[type];
                switch (type) {
                    case 'left':
                    case 'up':
                    case 'down':
                    case 'right':
                    case 'jump':
                        if (value) {
                            character.controller[type].setDown();
                        } else {
                            character.controller[type].setUp();
                        }
                        break;
                    case 'position':
                        if (character.position.distance(value) > 100) {
                            this.game.add.tween(character.position).to(value, 100).start();
                        }
                }
            }, this);
        }, this);

    };

    Game.MPClient.prototype.disconnect = function() {
        _.forEach(this.characters, function(character) {
            this.game.entitiesGroup.remove(character, true);
        }, this);

        this.unbindController();
        this.characters = null;

        this.socket.disconnect();
        this.socket = null;
    };

})();
(function() {
    'use strict';

    Game.MainMenu = function(game) {

    };

    Game.MainMenu.prototype.constructor = Game.MainMenu;

    Game.MainMenu.prototype.preload = function() {
        this.game.load.image('knapp', 'assets/knapp.png');
        this.game.load.bitmapFont('font', 'assets/bmfont_0.png', 'assets/bmfont.fnt');
        this.game.load.image('splash', 'assets/ui/splash.png');
    };

    Game.MainMenu.prototype.create = function() {
        if (location.hostname === 'localhost') {
            this.startLevel();
            return;
        }

        var bmd = this.game.make.bitmapData(this.game.width, this.game.height);
        bmd.processPixelRGB(this.noise, this);
        bmd.dirty = true;

        this.bg = this.game.add.image(0, 0, bmd);
        this.bg.bmd = bmd;

        this.splash = this.game.add.image(0, 0, 'splash');
        this.splash.tint = 0x888888;

        this.btnPlay = new Game.GUI.Button(this.game, this.game.width * 0.5, this.game.height * 0.5, 'knapp', 'Play', 'font', this.startLevel, this);
        this.game.world.add(this.btnPlay);
        this.btnPlay.anchor.setTo(0.5);
    };

    Game.MainMenu.prototype.startLevel = function() {
        this.state.start('Game.Level');
    };

    Game.MainMenu.prototype.noise = function(pixel) {
        var val = ((50 * Math.random())|0);

        pixel.r = val;
        pixel.g = val;
        pixel.b = val;
        pixel.a = 50 + val;

        return pixel;
    };

})();

(function() {
    'use strict';

    Game.ObjectiveManager.A2BObjective = function(game, objectiveManager, trigger, tilemap, object, player, dependencies, endTrigger) {
        Game.ObjectiveManager.Objective.call(this, game, objectiveManager, trigger, tilemap, object, player, dependencies);

        this.endTrigger = endTrigger;
        this.endTrigger.onActive.add(function() {
            if (this.objectiveManager.isActive(this)) {
                this.onCompletion.dispatch(this);
            }
        }, this);

        this.trigger.onActive.add(this.enableEndTrigger, this);
        this.removeOnInactive = false;
    };

    Game.ObjectiveManager.A2BObjective.prototype = Object.create(Game.ObjectiveManager.Objective.prototype);
    Game.ObjectiveManager.A2BObjective.prototype.constructor = Game.ObjectiveManager.A2BObjective;

    Game.ObjectiveManager.A2BObjective.prototype.enableEndTrigger = function() {
        this.endTrigger.enabled = true;
    };

})();

(function() {
    'use strict';

    Game.ObjectiveManager.CollectObjective = function(game, objectiveManager, trigger, tilemap, object, player, dependencies, toCollectGroup, endTrigger) {
        Game.ObjectiveManager.Objective.call(this, game, objectiveManager, trigger, tilemap, object, player, dependencies);

        /**
         * The group containing the items to collect
         * @type {Phaser.Group}
         */
        this.toCollectGroup = toCollectGroup;

        /**
         * Whether or not one should return to objective giver position after completion
         * @type {Boolean}
         */
        this.isReturn = this.object.properties['return'] ? this.object.properties['return'] === 'true' : false;

        /**
         * If is return, this will be where the objective is handed in
         * @type {Game.Trigger.ZoneTrigger}
         */
        this.endTrigger = endTrigger;
        if (this.endTrigger) {
            this.isReturn = true;
        }

        this.collectSFX = this.game.add.audio('pickupCoin');

        this.removeOnInactive = false;
        this.updateStatusText();
    };

    Game.ObjectiveManager.CollectObjective.prototype = Object.create(Game.ObjectiveManager.Objective.prototype);
    Game.ObjectiveManager.CollectObjective.prototype.constructor = Game.ObjectiveManager.CollectObjective;

    Game.ObjectiveManager.CollectObjective.prototype.update = function() {
        Game.ObjectiveManager.Objective.prototype.update.call(this);

        this.toCollectGroup.forEachAlive(function(toCollectItem) {
            if (this.game.physics.arcade.intersects(this.player.body, toCollectItem.body)) {
                this.collectSFX.play();
                toCollectItem.collected = true;
                toCollectItem.kill();
                this.updateStatusText();
                this.checkWin();

                if (toCollectItem.activate) {
                    this.activate();
                }
            }
        }, this);

        if (this.isReturn) {
            this.checkWin();
        }
    };

    Game.ObjectiveManager.CollectObjective.prototype.updateStatusText = function() {
        if (this.isReturn && this.collected >= this.toCollect) {
            this.statusText = this.object.properties.statusReturn || this.statusTemplate.format(this.collected, this.toCollect);
        } else {
            this.statusText = this.statusTemplate.format(this.collected, this.toCollect);
        }
    };

    Game.ObjectiveManager.CollectObjective.prototype.checkWin = function() {
        if (this.collected >= this.toCollect && !this.completed) {
            if (!this.isReturn) {
                this.onCompletion.dispatch(this);
            } else if (this.endTrigger) {
                if (this.endTrigger.isActive) {
                    this.onCompletion.dispatch(this);
                }
            } else if (this.trigger.isActive) {
                this.onCompletion.dispatch(this);
            }
        }
    };

    Object.defineProperty(Game.ObjectiveManager.CollectObjective.prototype, 'toCollect', {
        get: function() {
            return this.toCollectGroup.length;
        }
    });

    Object.defineProperty(Game.ObjectiveManager.CollectObjective.prototype, 'collected', {
        get: function() {
            var collected = 0;
            for (var i = 0; i < this.toCollectGroup.children.length; i++) {
                if (this.toCollectGroup.children[i].collected) {
                    collected++;
                }
            }
            return collected;
        }
    });

})();

(function() {
    'use strict';

    Game.ObjectiveManager.CriteriaObjective = function(game, objectiveManager, trigger, tilemap, object, player, dependencies, criterias) {
        Game.ObjectiveManager.Objective.call(this, game, objectiveManager, trigger, tilemap, object, player, dependencies);

        /**
         * An array of criterias to be fulfilled for this objective to complete
         * @type {Array#String}
         */
        this.criterias = criterias;

        /**
         * Whether or not it also has to return to start area
         * @type {Boolean}
         */
        this.isReturn = this.properties['return'] === 'true';

        this.game.onCriteriaAdd.add(this.checkWin, this);
        this.trigger.onActive.add(this.checkWin, this);
    };

    Game.ObjectiveManager.CriteriaObjective.prototype = Object.create(Game.ObjectiveManager.Objective.prototype);
    Game.ObjectiveManager.CriteriaObjective.prototype.constructor = Game.ObjectiveManager.CriteriaObjective;

    Game.ObjectiveManager.CriteriaObjective.prototype.checkWin = function() {
        var contained = 0;

        for (var i = 0; i < this.game.criterias.length; i++) {
            for (var u = 0; u < this.criterias.length; u++) {
                if (this.criterias[u] === this.criterias[i]) {
                    contained++;
                }
            }
        }

        if (contained === this.criterias.length && (!this.isReturn || this.trigger.isActive)) {
            this.onCompletion.dispatch(this);

            this.game.onCriteriaAdd.remove(this.checkWin, this);
            this.trigger.onActive.remove(this.checkWin, this);
        } else if (contained === this.criterias.length && this.isReturn) {
            this.statusText = this.object.properties.statusReturn;
        }
    };

})();

(function() {
    'use strict';

    var textureKey = 'player1';

    Game.Player = function(game, x, y) {
        Game.Character.call(this, game, x, y, textureKey);

        this.controller = new Game.Controller.KeyboardController(this.game, this);

        this.animations.add('run', [1, 2, 3, 4], 10);
        this.animations.add('still', [0]);

        return this;
    };

    Game.Player.prototype = Object.create(Game.Character.prototype);
    Game.Player.prototype.constructor = Game.Player;

    Game.Player.prototype.update = function() {
        Game.Character.prototype.update.call(this);

        if (this.states.tryWalking) {
            this.animations.play('run');
        } else if (this.states.still) {
            this.animations.play('still');
        }
    };

})();

(function() {
    'use strict';

    var torchCache = {};

    Game.Shadow = function(game) {
        this.shadowTexture = game.add.bitmapData(game.width, game.height);
        Phaser.Image.call(this, game, 0, 0, this.shadowTexture);
        this.fixedToCamera = true;

        this.blendMode = Phaser.blendModes.LUMINOSITY;

        this.shadowTexture.fill(0, 0, 0, 0.1);
    };

    Game.Shadow.prototype = Object.create(Phaser.Image.prototype);
    Game.Shadow.prototype.constructor = Game.Shadow;


    Game.Torch = function(game, x, y, radius, fade, value, r, g, b) {
        this.torchTexture = 
            torchCache[getCacheString(radius, fade, r, g, b, value)] ? 
            torchCache[getCacheString(radius, fade, r, g, b, value)] : 
            Game.Torch.createRadial(game, radius, fade, value, r, g, b);

        Phaser.Image.call(this, game, x, y, this.torchTexture);

        this.anchor.setTo(0.5);

        this.blendMode = Phaser.blendModes.ADD;
        this.alpha = 0.5;
    };

    Game.Torch.prototype = Object.create(Phaser.Image.prototype);
    Game.Torch.prototype.constructor = Game.Torch;

    Game.Torch.createRadial = function(game, radius, fade, value, r, g, b) {
        radius = radius || 200;
        fade = fade || 0.1;
        r = r || 255;
        g = g || 150;
        b = b || 100;

        value = value || 20;

        var bitmapData = new Phaser.BitmapData(game, 'radial' + radius, radius * 2, radius * 2);

        var gradient = bitmapData.context.createRadialGradient(
            radius, radius, radius * fade,
            radius, radius, radius);
        gradient.addColorStop(0, 'rgba({0}, {1}, {2}, 1.0)'.format(r, g, b));
        gradient.addColorStop(1, 'rgba({0}, {1}, {2}, 0.0)'.format(r, g, b));

        bitmapData.circle(radius, radius, radius, gradient);

        /// turn off image aliasing
        bitmapData.context.mozImageSmoothingEnabled = false;
        bitmapData.context.webkitImageSmoothingEnabled = false;
        bitmapData.context.imageSmoothingEnabled = false; 

        var bmd = new Phaser.BitmapData(game, 'radialSmall' + radius, radius * 2 / value, radius * 2 / value);
        bmd.context.drawImage(bitmapData.canvas, 0, 0, bmd.width, bmd.height);

        bitmapData.context.drawImage(bmd.canvas, 0, 0, bitmapData.width, bitmapData.height);

        torchCache[getCacheString(radius, fade, r, g, b, value)] = bitmapData;

        return bitmapData;
    };

    function getCacheString(radius, fade, r, g, b, value) {
        return String(radius) + String(fade) + String(r) + String(g) + String(b) + String(value);
    }


})();
(function() {
    'use strict';

    Game.Trigger = function(game, enabled) {
        this.game = game;

        /**
         * Dispatches when the trigger becomes active
         * @type {Phaser.Signal}
         */
        this.onActive = new Phaser.Signal();
        this.onActive.add(this._onActiveHandler, this);

        /**
         * Dispatches when the trigger becomes in
         * @type {Phaser.Signal}
         */
        this.onInactive = new Phaser.Signal();
        this.onInactive.add(this._onInactiveHandler, this);

        /**
         * Whether or not this trigger should dispatch events
         * @type {Boolean}
         */
        this.enabled = typeof enabled !== 'undefined' ? enabled : true;

        /**
         * Whether or not this trigger is active
         * @type {Boolean}
         */
        this.isActive = false;

        /**
         * Whether or not this trigger is inactive
         * @type {Boolean}
         */
        this.isInactive = true;
    };

    Game.Trigger.prototype.constructor = Game.Trigger;

    Game.Trigger.prototype._onActiveHandler = function() {
        this.isActive = true;
        this.isInactive = false;
    };

    Game.Trigger.prototype._onInactiveHandler = function() {
        this.isActive = false;
        this.isInactive = true;
    };

})();

(function() {
    'use strict';

    Game.Trigger.TriggerManager = function(game) {
        Phaser.Group.call(this, game, undefined, 'TriggerManager');

        this.triggers = [];
    };

    Game.Trigger.TriggerManager.prototype = Object.create(Phaser.Group.prototype);
    Game.Trigger.TriggerManager.prototype.constructor = Game.Trigger.TriggerManager;

    Game.Trigger.TriggerManager.prototype.addTrigger = function(trigger) {
        this.triggers.push(trigger);
    };

    Game.Trigger.TriggerManager.prototype.update = function() {
        Phaser.Group.prototype.update.call(this);

        for (var i = 0; i < this.triggers.length; i++) {
            this.triggers[i].update();
        }
    };

})();

(function() {
    'use strict';

    /**
     * An object that triggers an event upon entering/leaving a zone
     * @param {Phaser.Game}                                 game    The phaser game istance
     * @param {Boolean}                                     enabled [description]
     * @param {Array#Phaser.Rectangle | Phaser.Rectangle}   zone    [description]
     * @param {Array#Phaser.Sprite | Phaser.Sprite}         toTrack    [description]
     */
    Game.Trigger.ZoneTrigger = function(game, enabled, zone, toTrack, criteriaActive, criteriaInactive, thisArg) {
        Game.Trigger.call(this, game, enabled);

        /**
         * The zone or zones that will dispatch this trigger as active
         * @type {Array#Phaser.Rectangle | Phaser.Rectangle}
         */
        this.zones = zone;

        /**
         * The sprite of sprites that will dispatch this trigger as active when entering a zone
         * @type {Array#Phaser.Sprite | Phaser.Sprite}
         */
        this.toTrack = toTrack;

        /**
         * Internal cache
         * @type {Array}
         */
        this._wasInZone = [];

        if (this.zones && this.zones.constructor !== Array) {
            this.zones = [this.zones];
        }

        if (this.toTrack && this.toTrack.constructor !== Array) {
            this.toTrack = [this.toTrack];
        }

        /**
         * Criteria to fulfill to make the trigger active
         * @type {function}
         */
        this.criteriaActive = criteriaActive;

        /**
         * Criteria to fulfill to make the trigger inactive
         * @type {function}
         */
        this.criteriaInactive = criteriaInactive;

        /**
         * The context that the criteria functions will be called with
         * @type {[type]}
         */
        this.thisArg = thisArg;

        /**
         * A broadphase trigger that is generated if there are more than one rectangles to track. This is to save performance
         * @type {Game.Trigger.ZoneTrigger}
         */
        this._broadTrigger = undefined;

        if (this.zones.length > 1) {
            var padding = 20;
            var top = Number.MAX_VALUE, left = Number.MAX_VALUE, right = Number.MIN_VALUE, bottom = Number.MIN_VALUE;
            _.forEach(this.zones, function(zone) {
                top = Math.min(top, zone.top);
                left = Math.min(left, zone.left);
                right = Math.max(right, zone.right);
                bottom = Math.max(bottom, zone.bottom);
            });
            // Padding is to make sure the narrow phase register that the player has exited before broadphase make it not able to check
            var rect = new Phaser.Rectangle(left - padding, top - padding, right - left + padding * 2, bottom - top + padding * 2);
            this._broadTrigger = new Game.Trigger.ZoneTrigger(this.game, true, rect, this.toTrack);
            this.game.triggerManager.addTrigger(this._broadTrigger);
        }

        this._refreshInZone();

        return this;
    };

    Game.Trigger.ZoneTrigger.prototype = Object.create(Game.Trigger.prototype);
    Game.Trigger.ZoneTrigger.prototype.constructor = Game.Trigger.ZoneTrigger;

    Game.Trigger.ZoneTrigger.prototype._refreshInZone = function() {
        this._wasInZone = [];
        for (var i = 0; i < this.toTrack.length; i++) {
            this._wasInZone.push([]);
            for (var x = 0; x < this.zones.length; x++) {
                this._wasInZone[i].push(false);
            }
        }
    };

    Game.Trigger.ZoneTrigger.prototype.update = function() {
        if (!this.enabled) return;

        if (this._broadTrigger && !this._broadTrigger.isActive) return;

        var iToTrack, iZone, insideAny;

        for (iToTrack = 0; iToTrack < this.toTrack.length; iToTrack++) {
            for (iZone = 0; iZone < this.zones.length; iZone++) {
                this._wasInZone[iToTrack][iZone] = this.zones[iZone].contains(this.toTrack[iToTrack].position.x, this.toTrack[iToTrack].position.y);

                if (this._wasInZone[iToTrack][iZone]) {
                    insideAny = true;
                    break;
                }
            }
            if (insideAny) break;
        }

        if (!this.isActive && insideAny) {
            // Entered one of the zones
            if (!this.criteriaActive) {
                this.onActive.dispatch(this, this.toTrack[iToTrack]);
            } else if (this.criteriaActive.call(this.thisArg)) {
                this.onActive.dispatch(this, this.toTrack[iToTrack]);
            }
        } else if (this.isActive && !insideAny) {
            // Left all zones
            if (!this.criteriaInactive) {
                this.onInactive.dispatch(this, this.toTrack[iToTrack]);
            } else if (this.criteriaInactive.call(this.thisArg)) {
                this.onInactive.dispatch(this, this.toTrack[iToTrack]);
            }
        }

    };

    Game.Trigger.ZoneTrigger.prototype.debug = function() {
        _.forEach(this.zones, function(zone, izones) {
            this.game.debug.geom(zone);
        }, this);
            
    };

})();

(function() {
    'use strict';

    PIXI.BitmapText.prototype.maxWidth = 0;

    /**
     * Renders text and updates it when needed
     *
     * @method updateText
     * @private
     */
    PIXI.BitmapText.prototype.updateText = function()
    {
        var data = PIXI.BitmapText.fonts[this.fontName];
        var pos = new PIXI.Point();
        var prevCharCode = null;
        var chars = [];
        var maxLineWidth = 0;
        var lineWidths = [];
        var line = 0;
        var scale = this.fontSize / data.size;
        var lastSpace = -1;

        for(var i = 0; i < this.text.length; i++)
        {
            var charCode = this.text.charCodeAt(i);

            lastSpace = /(\s)/.test(this.text.charAt(i)) ? i : lastSpace;

            if(/(?:\r\n|\r|\n)/.test(this.text.charAt(i)))
            {
                lineWidths.push(pos.x);
                maxLineWidth = Math.max(maxLineWidth, pos.x);
                line++;

                pos.x = 0;
                pos.y += data.lineHeight;
                prevCharCode = null;
                continue;
            }

            if (lastSpace !== -1 && this.maxWidth && pos.x * scale > this.maxWidth) {
                chars.splice(lastSpace, i - lastSpace);
                i = lastSpace;
                lastSpace = -1;

                lineWidths.push(pos.x);
                maxLineWidth = Math.max(maxLineWidth, pos.x);
                line++;

                pos.x = 0;
                pos.y += data.lineHeight;
                prevCharCode = null;
                continue;         
            }

            var charData = data.chars[charCode];

            if(!charData) continue;

            if(prevCharCode && charData.kerning[prevCharCode])
            {
                pos.x += charData.kerning[prevCharCode];
            }

            chars.push({texture:charData.texture, line: line, charCode: charCode, position: new PIXI.Point(pos.x + charData.xOffset, pos.y + charData.yOffset)});
            pos.x += charData.xAdvance;

            prevCharCode = charCode;
        }

        lineWidths.push(pos.x);
        maxLineWidth = Math.max(maxLineWidth, pos.x);

        var lineAlignOffsets = [];

        for(i = 0; i <= line; i++)
        {
            var alignOffset = 0;
            if(this.style.align === 'right')
            {
                alignOffset = maxLineWidth - lineWidths[i];
            }
            else if(this.style.align === 'center')
            {
                alignOffset = (maxLineWidth - lineWidths[i]) / 2;
            }
            lineAlignOffsets.push(alignOffset);
        }

        var lenChildren = this.children.length;
        var lenChars = chars.length;
        var tint = this.tint || 0xFFFFFF;

        for(i = 0; i < lenChars; i++)
        {
            var c = i < lenChildren ? this.children[i] : this._pool.pop(); // get old child if have. if not - take from pool.

            if (c) c.setTexture(chars[i].texture); // check if got one before.
            else c = new PIXI.Sprite(chars[i].texture); // if no create new one.

            c.position.x = (chars[i].position.x + lineAlignOffsets[chars[i].line]) * scale;
            c.position.y = chars[i].position.y * scale;
            c.scale.x = c.scale.y = scale;
            c.tint = tint;
            if (!c.parent) this.addChild(c);
        }

        // remove unnecessary children.
        // and put their into the pool.
        while(this.children.length > lenChars)
        {
            var child = this.getChildAt(this.children.length - 1);
            this._pool.push(child);
            this.removeChild(child);
        }

        this.textWidth = maxLineWidth * scale;
        this.textHeight = (pos.y + data.lineHeight) * scale;
    };

})();

/**
 * Needs only to be uncommented if special collision is needed
 */
// // SOURCE: https://github.com/eugenioclrc/super-mean-boy
// /* global Phaser */
// (function() {
//     'use strict';
//     Phaser.Physics.Arcade.Body.prototype.velocityPunish = new Phaser.Point(0, 0);

//     Phaser.Physics.Arcade.prototype.collideSpriteVsTilemapLayer = function(sprite, tilemapLayer, collideCallback, processCallback, callbackContext) {
//         if (!sprite.body) {
//             return;
//         }

//         this._mapData = tilemapLayer.getTiles(
//             sprite.body.position.x - sprite.body.tilePadding.x,
//             sprite.body.position.y - sprite.body.tilePadding.y,
//             sprite.body.width + sprite.body.tilePadding.x,
//             sprite.body.height + sprite.body.tilePadding.y,
//             false, false);

//         if (this._mapData.length === 0) {
//             return;
//         }

//         for (var i = 0, tile, _slope, slopeFunction; i < this._mapData.length; i += 1) {
//             tile = this._mapData[i];

//             if (tile.hasOwnProperty('slopeFunction')) {
//                 slopeFunction = tile.slopeFunction;
//             } else {
//                 _slope = tile.hasOwnProperty('slope') ? tile.slope : Phaser.Physics.Arcade.FULL_SQUARE;
//                 if (!Phaser.Physics.Arcade.SLOPEMAP.hasOwnProperty(_slope)) {
//                     _slope = 'FULL_SQUARE';
//                 }
//                 slopeFunction = Phaser.Physics.Arcade.SLOPEMAP[_slope];
//             }

//             if (slopeFunction.call(this, i, sprite.body, tile)) {
//                 if (processCallback) {
//                     if (processCallback.call(callbackContext, sprite, this._mapData[i])) {
//                         this._total += 1;

//                         if (collideCallback) {
//                             collideCallback.call(callbackContext, sprite, this._mapData[i]);
//                         }
//                     }
//                 } else {
//                     this._total += 1;

//                     if (collideCallback) {
//                         collideCallback.call(callbackContext, sprite, this._mapData[i]);
//                     }
//                 }
//             }
//         }
//     };


//     // Slope tile functions

//     Phaser.Physics.Arcade._collisionFullSquare = function(i, body, tile) {
//         return this.separateTile(i, body, tile);
//     };


//     Phaser.Physics.Arcade.halfRectangleTop = function(i, body, tile) {
//         // check intersection
//         /*var intersects = (body.bottom.right <= tile.worldX);
//         intersects = intersects || (body.bottom <= tile.worldY + (tile.height / 2));
//         intersects = intersects || (body.position.x >= tile.worldX + tile.width);
//         intersects = intersects || (body.position.y >= tile.worldY + (tile.height / 2)); */
//         var intersects = (body.bottom.right <= tile.worldX);
//         intersects = intersects || (body.bottom <= tile.worldY + (tile.height / 2));
//         intersects = intersects || (body.position.x >= tile.worldX + tile.width);
//         intersects = intersects || (body.position.y >= tile.worldY);
//         console.log(intersects);
//         if (!intersects) {
//             return intersects;
//         }


//         this.tileCheckX(body, tile);
//         /*
//         var ox=0;
//         if (!body.blocked.right && body.deltaAbsX() > 0) {
//             ox = body.right - tile.left;
//         } else if (!body.blocked.left && body.deltaAbsX() < 0) {
//             ox = body.x - tile.right;
//         }

//         if (this.TILE_BIAS < Math.abs(ox)) {
//             ox=0;
//         }
        
//         if(ox !== 0){
//             this.processTileSeparationX(body, ox);
//         }
//     */
//         var oy = 0;

//         if (body.deltaY() < 0 && !body.blocked.up) {
//             //  Body is moving UP
//             if (tile.faceBottom && body.y < tile.bottom) {
//                 oy = body.y - tile.bottom + (tile.height / 2);

//                 if (oy < -this.TILE_BIAS) {
//                     oy = 0;
//                 }
//             }
//         } else if (body.deltaY() > 0 && !body.blocked.down && tile.collideUp && body.checkCollision.down) {
//             //  Body is moving DOWN

//             if (tile.faceTop && body.bottom > tile.top) {
//                 oy = body.bottom - tile.top;

//                 if (oy > this.TILE_BIAS) {
//                     oy = 0;
//                 }
//             }
//         }

//         if (oy !== 0) {
//             this.processTileSeparationY(body, oy);
//         }

//     };


//     Phaser.Physics.Arcade._collisionHalfTriangleBottomLeft = function(i, body, tile) {
//         var deltaXY = (tile.worldY + tile.height - body.position.y - body.height) - (tile.worldX + tile.width - body.position.x);

//         if (body.velocity.y > 0 && (tile.worldY + tile.height - body.position.y - body.height) - (tile.worldX + tile.width - body.position.x) <= 0 && (body.position.x) >= tile.left && (body.position.x) <= tile.right) {
//             body.position.y += deltaXY;
//             // body.y = (body.position.x - tile.right) - (body.height - tile.bottom);
//             body.blocked.down = true;
            
//             if (tile.hasOwnProperty('slipperyness')) {
//                 var gravityY = body.game.physics.arcade.gravity.y;
//                 body.velocity.x -= (body.gravity.y || gravityY) * Math.cos(45) * tile.slipperyness;
//             } else if (body.bounce.y === 0) {
//                 // Limit y speed, to prevent falling through
//                 body.velocity.y *= 0.95;
//             } else {
//                 body.velocity.y = Math.sin(45) * -body.velocity.y * body.bounce.y;
//                 body.velocity.x = -Math.cos(45) * body.velocity.y * body.bounce.x;
//             }
//             return false;
//         }
//         return true;
//     };

//     Phaser.Physics.Arcade._collisionHalfTriangleBottomRight = function(i, body, tile) {
//         var deltaXY = (tile.worldY + tile.height - body.position.y - body.height) - (body.position.x + body.width - tile.left);

//         if (body.velocity.y > 0 && deltaXY <= 0 && (body.position.x + body.width) >= tile.left && (body.position.x + body.width) <= tile.right) {
//             body.position.y += deltaXY;
//             body.blocked.down = true;

//             if (tile.hasOwnProperty('slipperyness')) {
//                 var gravityY = body.game.physics.arcade.gravity.y;
//                 body.velocity.x -= (body.gravity.y || gravityY) * Math.cos(45) * tile.slipperyness;
//             }

//             if (body.bounce.y === 0) {
//                 // Limit y speed, to prevent falling through
//                 body.velocity.y *= 0.95;
//             } else {
//                 body.velocity.y = Math.sin(45) * -body.velocity.y * body.bounce.y;
//                 body.velocity.x = Math.cos(45) * body.velocity.y * body.bounce.x;
//             }
//             return false;
//         }

//         return true;
//     };

//     Phaser.Physics.Arcade._collisionRectangleBottom = function(i, body, tile) {
//         var intersects = (body.position.x >= tile.worldX && body.position.x <= tile.worldX + tile.width);

//         if (intersects) {
//             // falling
//             if (body.velocity.y > 0 && (body.bottom >= tile.worldY + tile.height / 2)) {
//                 body.position.y = tile.worldY - tile.height / 2;
//                 body.blocked.down = true;
//             } else {
//                 body.position.y = tile.worldY + tile.height;
//                 body.velocity.y = 0;
//             }
//         }
//     };


//     Phaser.Physics.Arcade._collisionSquareBottomLeft = function(i, body, tile) {
//         var intersects = (body.position.x + body.halfWidth >= tile.worldX && body.position.x <= tile.worldX + tile.width);

//         if (intersects) {
//             // falling
//             if (body.velocity.y > 0 && (body.bottom >= tile.worldY + tile.height / 2)) {
//                 body.position.y = tile.worldY - tile.height / 2;
//                 body.blocked.down = true;
//             } else {
//                 body.position.y = tile.worldY + tile.height;
//                 body.velocity.y = 0;
//             }
//         }
//     };


//     Phaser.Physics.Arcade.SLOPEMAP = {
//         // id: 1
//         'FULL_SQUARE': Phaser.Physics.Arcade._collisionFullSquare,
//         // id: 15
//         'HALF_TRIANGLE_BOTTOM_LEFT': Phaser.Physics.Arcade._collisionHalfTriangleBottomLeft,
//         // id: 17
//         'HALF_TRIANGLE_BOTTOM_RIGHT': Phaser.Physics.Arcade._collisionHalfTriangleBottomRight,
//         // id: 8
//         'RECTANGLE_BOTTOM': Phaser.Physics.Arcade._collisionRectangleBottom,
//     };


// })();
(function() {
    'use strict';

    Phaser.Sound.prototype.playFrom = function(point, marker, position, volume, loop, forceRestart) {
        var distance = point.distance(this.game.state.getCurrentState().p1.position);
        var realVolume = Math.max(0, this.game.width * 0.5 - distance) / (this.game.width * 0.5);
        volume = (volume || 1) * realVolume;

        if (volume === 0) return;

        this.play(marker, position, volume, loop, forceRestart);
    };

    Phaser.SoundManager.prototype.playFrom = function(point, key, volume, loop) {
        var sound = this.add(key, volume, loop);

        sound.playFrom(point);

        return sound;
    };

})();
Phaser.SoundManager.prototype.toggleMute = function() {
    this.mute = !this.mute;
    
    return this.mute;
};
(function() {
    'use strict';

    Phaser.TilemapLayer.prototype.resizeWorld = function () {
        this.game.world.setBounds(0, 0, this.layer.widthInPixels * this.scale.x, this.layer.heightInPixels * this.scale.y);
    };

    Phaser.TilemapLayer.prototype.postUpdate = function (x, y, width, height, collides, interestingFace) {
        Phaser.Image.prototype.postUpdate.call(this);

        //  Stops you being able to auto-scroll the camera if it's not following a sprite
        var camera = this.game.camera;
        this.scrollX = camera.x * this.scrollFactorX * (1 / this.scale.x);
        this.scrollY = camera.y * this.scrollFactorY * (1 / this.scale.y);

        this.render();

        //  Fixed to Camera?
        if (this._cache[7] === 1)
        {
            this.position.x = (camera.view.x + this.cameraOffset.x) / camera.scale.x;
            this.position.y = (camera.view.y + this.cameraOffset.y) / camera.scale.y;
        }

    };

    Phaser.TilemapLayer.prototype.getTiles = function (x, y, width, height, collides, interestingFace) {

        //  Should we only get tiles that have at least one of their collision flags set? (true = yes, false = no just get them all)
        if (typeof collides === 'undefined') { collides = false; }
        if (typeof interestingFace === 'undefined') { interestingFace = false; }

        var fetchAll = !(collides || interestingFace);

        //  Adjust the x,y coordinates for scrollFactor
        x = this._fixX(x);
        y = this._fixY(y);

        //  Convert the pixel values into tile coordinates
        var tx = Math.floor(x / (this.scale.x * this._mc.cw));
        var ty = Math.floor(y / (this.scale.y * this._mc.ch));
        //  Don't just use ceil(width/cw) to allow account for x/y diff within cell
        var tw = Math.ceil((x + width) / (this.scale.x * this._mc.cw)) - tx;
        var th = Math.ceil((y + height) / (this.scale.x * this._mc.ch)) - ty;


        while (this._results.length)
        {
            this._results.pop();
        }

        for (var wy = ty; wy < ty + th; wy++)
        {
            for (var wx = tx; wx < tx + tw; wx++)
            {
                var row = this.layer.data[wy];
                if (row && row[wx])
                {
                    if (fetchAll || row[wx].isInteresting(collides, interestingFace))
                    {
                        this._results.push(row[wx]);
                    }
                }
            }
        }

        return this._results;
    };

    Phaser.TilemapLayer.prototype.renderRegion = function (scrollX, scrollY, left, top, right, bottom) {

        var context = this.context;

        var width = this.layer.width;
        var height = this.layer.height;
        var tw = this._mc.tileWidth;
        var th = this._mc.tileHeight;

        var tilesets = this._mc.tilesets;
        var lastAlpha = NaN;

        if (!this._wrap)
        {
            if (left <= right) // Only adjust if going to render
            {
                left = Math.max(0, left);
                right = Math.min(width - 1, right);
            }
            if (top <= bottom)
            {
                top = Math.max(0, top);
                bottom = Math.min(height - 1, bottom);
            }
        }
       
        // top-left pixel of top-left cell
        var baseX = (left * tw) - scrollX;
        var baseY = (top * th) - scrollY;

        // Fix normStartX/normStartY such it is normalized [0..width/height). This allows a simple conditional and decrement to always keep in range [0..width/height) during the loop. The major offset bias is to take care of negative values.
        var normStartX = (left + ((1 << 20) * width)) % width;
        var normStartY = (top + ((1 << 20) * height)) % height;

        // tx/ty - are pixel coordinates where tile is drawn
        // x/y - is cell location, normalized [0..width/height) in loop
        // xmax/ymax - remaining cells to render on column/row
        var tx, ty, x, y, xmax, ymax;

        context.fillStyle = this.tileColor;

        for (y = normStartY, ymax = bottom - top, ty = baseY;
            ymax >= 0;
            y++, ymax--, ty += th)
        {

            if (y >= height) { y -= height; }

            var row = this.layer.data[y];

            for (x = normStartX, xmax = right - left, tx = baseX;
                xmax >= 0;
                x++, xmax--, tx += tw)
            {

                if (x >= width) { x -= width; }

                var tile = row[x];
                if (!tile || tile.index < 0)
                {
                    continue;
                }

                var index = tile.index;

                var set = tilesets[index];
                if (set === undefined)
                {
                    set = this.resolveTileset(index);
                }

                //  Setting the globalAlpha is "surprisingly expensive" in Chrome (38)
                if (tile.alpha !== lastAlpha && !this.debug)
                {
                    context.globalAlpha = tile.alpha;
                    lastAlpha = tile.alpha;
                }

                if (set)
                {
                    set.draw(context, tx, ty, index);
                    if (this.overlay) {
                        this.context.fillStyle = this.overlay;
                        context.fillRect(tx, ty, tw, th);
                        this.context.fillStyle = this.tileColor;
                    }
                }
                else if (this.debugSettings.missingImageFill)
                {
                    context.fillStyle = this.debugSettings.missingImageFill;
                    context.fillRect(tx, ty, tw, th);
                }

                if (tile.debug && this.debugSettings.debuggedTileOverfill)
                {
                    context.fillStyle = this.debugSettings.debuggedTileOverfill;
                    context.fillRect(tx, ty, tw, th);
                }
               
            }

        }

    };

    var cache = {};

    Phaser.TilemapLayer.prototype.generateRegion = function (x, y, width, height, overlay) {
        var bmd = new Phaser.BitmapData(this.game, 'generatedRegion', width, height);
        bmd.context.fillStyle = overlay;

        var tiles = this.getTiles(x, y, width, height);

        var cacheKey = generateCacheKey(tiles, overlay);

        if (isEmpty(tiles)) {
            return;
        }

        if (cache[cacheKey]) {
            return cache[cacheKey];
        }

        var tile, set;
        for (var i = 0; i < tiles.length; i++) {
            tile = tiles[i];

            set = this._mc.tilesets[tile.index];
            if (!set)
            {
                set = this.resolveTileset(tile.index);
                if (!set) continue;
            }

            set.draw(bmd.context, tile.worldX - x, tile.worldY - y, tile.index);

            if (overlay) {
                bmd.context.fillRect(tile.worldX - x, tile.worldY - y, tile.width, tile.height);
            }
        }

        cache[cacheKey] = bmd;

        return bmd;
    };

    function isEmpty(tiles) {
        for (var i = 0; i < tiles.length; i++) {
            if (tiles[i].index !== -1) return false;
        }
        return true;
    }

    function generateCacheKey(tiles, overlay) {
        var str = String(overlay);
        for (var i = 0; i < tiles.length; i++) {
            str += tiles[i].index;
        }
        return str;
    }

})();

(function() {
    'use strict';

    var update = Phaser.World.prototype.update;
    Phaser.World.prototype.update = function() {
        var state = this.game.state.getCurrentState();

        if (state.paused) return;

        update.call(this);
    };

    var postUpdate = Phaser.World.prototype.postUpdate;
    Phaser.World.prototype.postUpdate = function() {
        var state = this.game.state.getCurrentState();

        if (state.paused) return;

        postUpdate.call(this);
    };

    var preUpdate = Phaser.World.prototype.preUpdate;
    Phaser.World.prototype.preUpdate = function() {
        var state = this.game.state.getCurrentState();

        if (state.paused) return;

        preUpdate.call(this);
    };

})();