(function() {
    'use strict';

    Game.ObjectiveManager.CriteriaObjective = function(game, objectiveManager, trigger, tilemap, object, player, dependencies, criterias) {
        Game.ObjectiveManager.Objective.call(this, game, objectiveManager, trigger, tilemap, object, player, dependencies);

        /**
         * An array of criterias to be fulfilled for this objective to complete
         * @type {Array#String}
         */
        this.criterias = criterias;

        this.game.onCriteriaAdd.add(this.checkWin, this);
    };

    Game.ObjectiveManager.CriteriaObjective.prototype = Object.create(Game.ObjectiveManager.Objective.prototype);
    Game.ObjectiveManager.CriteriaObjective.prototype.constructor = Game.ObjectiveManager.CriteriaObjective;

    Game.ObjectiveManager.CriteriaObjective.prototype.checkWin = function() {
        var contained = 0;

        for (var i = 0; i < this.game.criterias; i++) {
            for (var u = 0; u < this.criterias; u++) {
                if (this.criterias[u] === this.criterias[i]) {
                    contained++;
                }
            }
        }

        if (contained === this.criterias.length) {
            this.onCompletion.dispatch(this);
        }
    };

})();
