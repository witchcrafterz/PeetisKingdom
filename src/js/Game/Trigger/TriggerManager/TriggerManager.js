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

        _.forEach(this.triggers, function(trigger) {
            trigger.update();
        }, this);
    };

})();
