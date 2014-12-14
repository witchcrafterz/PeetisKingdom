(function() {
    'use strict';

    Game.ObjectiveManager.CollectObjective = function(game, objectiveManager, name, collector, toCollectGroup) {
        Game.ObjectiveManager.Objective.call(this, game, objectiveManager, name);

        /**
         * The player that should collect
         * @type {Phaser.Sprite}
         */
        this.collector = collector;

        /**
         * The group containing the items to collect
         * @type {Phaser.Group}
         */
        this.toCollectGroup = toCollectGroup;

        this.updateStatusText();
    };

    Game.ObjectiveManager.CollectObjective.prototype = Object.create(Game.ObjectiveManager.Objective.prototype);
    Game.ObjectiveManager.CollectObjective.prototype.constructor = Game.ObjectiveManager.CollectObjective;

    Game.ObjectiveManager.CollectObjective.prototype.update = function() {
        Phaser.Group.prototype.update.call(this);

        this.toCollectGroup.forEachAlive(function(toCollectItem) {
            if (this.game.physics.arcade.intersects(this.collector.body, toCollectItem.body)) {
                toCollectItem.collected = true;
                toCollectItem.kill();
                this.updateStatusText();
                this.checkWin();
            }
        }, this);

    };

    Game.ObjectiveManager.CollectObjective.prototype.updateStatusText = function() {
        this.statusText = this.statusTemplate.format(this.collected, this.toCollect);
    };

    Game.ObjectiveManager.CollectObjective.prototype.checkWin = function() {
        if (this.collected >= this.toCollect) {
            this.onCompletion.dispatch(this);
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
