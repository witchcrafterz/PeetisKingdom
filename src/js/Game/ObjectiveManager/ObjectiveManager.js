(function() {
    'use strict';

    Game.ObjectiveManager = function(game, x, y) {
        Phaser.Group.call(this, game, null, 'ObjectiveManager');

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

        /**
         * The title of the objective manager
         * @type {Phaser.Text}
         */
        this.titleText = this.game.add.text(0, 0, 'Objectives');
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
         * An array containing all objectives that exists in the tilemap, but have as of yet not been added to ObjectiveManager.objectives
         * Each entry have three properties: objective -- the objective object, player -- the player who ought to perform the objective, rectangle -- the rectangle in which the objective becomes activated
         * @type {Array#Object}
         */
        this.inactiveObjectives = [];


        this.fixedToCamera = true;

        this.cameraOffset.setTo(x, y);

        this._updatePositioning();

        this.alpha = 0;
    };

    Game.ObjectiveManager.prototype = Object.create(Phaser.Group.prototype);
    Game.ObjectiveManager.prototype.constructor = Game.ObjectiveManager;

    Game.ObjectiveManager.prototype.update = function() {
        Phaser.Group.prototype.update.call(this);

        for (var i = 0; i < this.inactiveObjectives.length; i++) {
            var obj = this.inactiveObjectives[i];
            if (obj.rectangle.contains(obj.player.x, obj.player.y)) {
                this.addObjective(obj.objective);
                this.inactiveObjectives.splice(i, 1);
                i--;
            }
        }
    };

    Game.ObjectiveManager.prototype.createObjectives = function(map, objectivesLayer, player) {
        _.forEach(objectivesLayer, function(objective) {
            switch (objective.type) {
                case 'collect':
                    this.createCollectObjective(map, objective, player);
                    break;
                default:
                    console.log('Objective of type ' + objective.type + ' not yet implemented');
                    break;
            }            
        }, this);
    };

    Game.ObjectiveManager.prototype.createCollectObjective = function(map, objective, player) {
        var activeRect = new Phaser.Rectangle(objective.x, objective.y, objective.width, objective.height);
        var objectLayer = map.objects[objective.properties.itemLayer];
        var itemsGroup = this.game.add.group(undefined, objective.name);
        itemsGroup.enableBody = true;

        _.forEach(objectLayer, function(object) {
            var key = object.properties.spritesheet || objective.properties.spritesheet;
            var frame = object.properties.frame || objective.properties.frame;

            var sprite = itemsGroup.create(object.x, object.y, key, parseInt(frame));

            sprite.body.allowGravity = object.properties.allowGravity || false;
        }, this);

        var collectObjective = new Game.ObjectiveManager.CollectObjective(this.game, this, map, objective, player, itemsGroup);
        this.inactiveObjectives.push({
            rectangle: activeRect,
            objective: collectObjective,
            player: player
        });

        return collectObjective;
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

    Game.ObjectiveManager.prototype._removeObjective = function(objective) {
        objective.game.add.tween(objective)
            .to({alpha: 0}, this.animationSpeed, this.easing, true);

        var index = this.objectives.indexOf(objective);
        this.objectives.splice(index, 1);

        this._updatePositioning();
    };

    Game.ObjectiveManager.prototype._updatePositioning = function() {
        if (this.objectives.length === 0) {
            this.game.add.tween(this).to({alpha: 0}, this.animationSpeed, this.easing, true);
            return;
        } else {
            this.game.add.tween(this).to({alpha: 1}, this.animationSpeed, this.easing, true);
        }

        this.pivot.x = this.width;

        this.game.add.tween(this.pivot).to({y: this._calculateHeightTo(this.objectives.length) * 0.5 }, this.animationSpeed, this.easing, true);

        this.game.add.tween(this.titleText.position).to({x: this.width * 0.5 - this.titleText.width * 0.5 }, this.animationSpeed, this.easing, true);

        _.forEach(this.objectives, function(objective, index) {
            this.game.add.tween(objective).to({y: this._calculateHeightTo(index - 1) }, this.animationSpeed, this.easing, true);
        }, this);
    };

    Game.ObjectiveManager.prototype._calculateHeightTo = function(index) {
        var _height = this.titleText.height + this.padding;

        index = Math.min(this.objectives.length - 1, index);

        for (var i = 0; i <= index; i++) {
            _height += this.objectives[i].height + this.padding;
        }

        return _height;

    };

})();
