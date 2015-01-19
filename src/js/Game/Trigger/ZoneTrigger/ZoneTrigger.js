(function() {
    'use strict';

    /**
     * An object that triggers an event upon entering/leaving a zone
     * @param {Phaser.Game}                                 game    The phaser game istance
     * @param {Boolean}                                     enabled [description]
     * @param {Array#Phaser.Rectangle | Phaser.Rectangle}   zone    [description]
     * @param {Array#Phaser.Sprite | Phaser.Sprite}         toTrack    [description]
     */
    Game.Trigger.ZoneTrigger = function(game, enabled, zone, toTrack, criteriaActive, criteriaInactive, thisArg) {
        Game.Trigger.call(this, game, enabled);

        /**
         * The zone or zones that will dispatch this trigger as active
         * @type {Array#Phaser.Rectangle | Phaser.Rectangle}
         */
        this.zones = zone;

        /**
         * The sprite of sprites that will dispatch this trigger as active when entering a zone
         * @type {Array#Phaser.Sprite | Phaser.Sprite}
         */
        this.toTrack = toTrack;

        /**
         * Internal cache
         * @type {Array}
         */
        this._wasInZone = [];

        if (this.zones && this.zones.constructor !== Array) {
            this.zones = [this.zones];
        }

        if (this.toTrack && this.toTrack.constructor !== Array) {
            this.toTrack = [this.toTrack];
        }

        /**
         * Criteria to fulfill to make the trigger active
         * @type {function}
         */
        this.criteriaActive = criteriaActive;

        /**
         * Criteria to fulfill to make the trigger inactive
         * @type {function}
         */
        this.criteriaInactive = criteriaInactive;

        /**
         * The context that the criteria functions will be called with
         * @type {[type]}
         */
        this.thisArg = thisArg;

        /**
         * A broadphase trigger that is generated if there are more than one rectangles to track. This is to save performance
         * @type {Game.Trigger.ZoneTrigger}
         */
        this._broadTrigger = undefined;

        if (this.zones.length > 1) {
            var padding = 20;
            var top = Number.MAX_VALUE, left = Number.MAX_VALUE, right = Number.MIN_VALUE, bottom = Number.MIN_VALUE;
            _.forEach(this.zones, function(zone) {
                top = Math.min(top, zone.top);
                left = Math.min(left, zone.left);
                right = Math.max(right, zone.right);
                bottom = Math.max(bottom, zone.bottom);
            });
            // Padding is to make sure the narrow phase register that the player has exited before broadphase make it not able to check
            var rect = new Phaser.Rectangle(left - padding, top - padding, right - left + padding, bottom - top + padding);
            this._broadTrigger = new Game.Trigger.ZoneTrigger(this.game, true, rect, this.toTrack);
            this.game.triggerManager.addTrigger(this._broadTrigger);
        }

        this._refreshInZone();

        return this;
    };

    Game.Trigger.ZoneTrigger.prototype = Object.create(Game.Trigger.prototype);
    Game.Trigger.ZoneTrigger.prototype.constructor = Game.Trigger.ZoneTrigger;

    Game.Trigger.ZoneTrigger.prototype._refreshInZone = function() {
        this._wasInZone = [];
        for (var i = 0; i < this.toTrack.length; i++) {
            this._wasInZone.push([]);
            for (var x = 0; x < this.zones.length; x++) {
                this._wasInZone[i].push(false);
            }
        }
    };

    Game.Trigger.ZoneTrigger.prototype.update = function() {
        if (!this.enabled) return;

        if (this._broadTrigger && !this._broadTrigger.isActive) return;

        var iToTrack, iZone, insideAny;

        for (iToTrack = 0; iToTrack < this.toTrack.length; iToTrack++) {
            for (iZone = 0; iZone < this.zones.length; iZone++) {
                this._wasInZone[iToTrack][iZone] = this.zones[iZone].contains(this.toTrack[iToTrack].position.x, this.toTrack[iToTrack].position.y);

                if (this._wasInZone[iToTrack][iZone]) {
                    insideAny = true;
                    break;
                }
            }
            if (insideAny) break;
        }

        if (!this.isActive && insideAny) {
            // Entered one of the zones
            if (!this.criteriaActive) {
                this.onActive.dispatch(this, this.toTrack[iToTrack]);
            } else if (this.criteriaActive.call(this.thisArg)) {
                this.onActive.dispatch(this, this.toTrack[iToTrack]);
            }
        } else if (this.isActive && !insideAny) {
            // Left all zones
            if (!this.criteriaInactive) {
                this.onInactive.dispatch(this, this.toTrack[iToTrack]);
            } else if (this.criteriaInactive.call(this.thisArg)) {
                this.onInactive.dispatch(this, this.toTrack[iToTrack]);
            }
        }

    };

    Game.Trigger.ZoneTrigger.prototype.debug = function() {
        _.forEach(this.zones, function(zone, izones) {
            this.game.debug.geom(zone);
        }, this);
            
    };

})();
