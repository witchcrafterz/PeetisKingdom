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
        } else {
            _.forEach(this.objectives, function(objective, index) {
                objective.alpha = 1;
            }, this);
         
            this._expandButton.text = 'Hide';
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

                var sprite = itemsGroup.create(object.x, object.y, key, parseInt(frame));

                if (object.properties['activate']) {
                    sprite.activate = true;
                }

                sprite.body.allowGravity = object.properties.allowGravity || false;
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

        objective.game.add.tween(objective).to({alpha: 1}, this.animationSpeed, this.easing, true);

        objective.onCompletion.add(this._removeObjective, this);
        objective.onFailure.add(this._removeObjective, this);

        this._updatePositioning();
    };

    Game.ObjectiveManager.prototype.isActive = function(objective) {
        return _.contains(this.objectives, objective);
    };

    Game.ObjectiveManager.prototype.isCompleted = function(objectives) {
        if (!objectives) return true;

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
