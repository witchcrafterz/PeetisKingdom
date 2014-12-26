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

        this.removeOnInactive = false;
        this.updateStatusText();
    };

    Game.ObjectiveManager.CollectObjective.prototype = Object.create(Game.ObjectiveManager.Objective.prototype);
    Game.ObjectiveManager.CollectObjective.prototype.constructor = Game.ObjectiveManager.CollectObjective;

    Game.ObjectiveManager.CollectObjective.prototype.update = function() {
        Game.ObjectiveManager.Objective.prototype.update.call(this);

        this.toCollectGroup.forEachAlive(function(toCollectItem) {
            if (this.game.physics.arcade.intersects(this.player.body, toCollectItem.body)) {
                toCollectItem.collected = true;
                toCollectItem.kill();
                this.updateStatusText();
                this.checkWin();
                this.activate();
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
