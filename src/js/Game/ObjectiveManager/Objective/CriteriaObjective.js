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
