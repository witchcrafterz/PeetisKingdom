(function() {
    'use strict';

    Game.ObjectiveManager = function(game, x, y) {
        Phaser.Group.call(this, game, null, 'ObjectiveManager');

        this.fixedToCamera = true;

        this.cameraOffset.setTo(x, y);

        this.padding = 10;

        this.animationSpeed = 300;
        this.easing = Phaser.Easing.Quadratic.Out;

        this.titleText = this.game.add.text(0, 0, 'Objectives');
        this.add(this.titleText);

        this.objectives = [];
        this.objectiveLog = [];

        this._updatePositioning();
    };

    Game.ObjectiveManager.prototype = Object.create(Phaser.Group.prototype);
    Game.ObjectiveManager.prototype.constructor = Game.ObjectiveManager;

    Game.ObjectiveManager.prototype.addObjective = function(objective) {
        objective.y = this._calculateHeightTo(this.objectives.length - 1);
        this.objectives.push(objective);
        this.objectiveLog.push(objective);

        objective.alpha = 0;
        objective.game.add.tween(objective).to({alpha: 1}, this.animationSpeed, this.easing, true);

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
            this.alpha = 0;
            return;
        } else {
            this.alpha = 1;
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
