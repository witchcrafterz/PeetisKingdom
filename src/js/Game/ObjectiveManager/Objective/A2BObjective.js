(function() {
    'use strict';

    Game.ObjectiveManager.A2BObjective = function(game, objectiveManager, trigger, tilemap, objectiveLayer, player, endTrigger) {
        Game.ObjectiveManager.Objective.call(this, game, objectiveManager, trigger, tilemap, objectiveLayer, player, endTrigger);

        this.endTrigger = endTrigger;
        this.endTrigger.onActive.add(function() {
            this.onCompletion.dispatch(this);
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
