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
