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

        _.forEach(this.toTrack, function(toTrack, iToTrack) {

            var insideAny = false;
            var zones = [];

            _.forEach(this.zones, function(zone, iZone) {

                var intersects = zone.contains(toTrack.position.x, toTrack.position.y);

                if (intersects) {
                    zones.push(zone);
                    insideAny = true;
                }

                this._wasInZone[iToTrack][iZone] = intersects;

            }, this);

            if (!this.isActive && insideAny) {
                // Entered one of the zones
                this.onActive.dispatch(this, toTrack, zones);
            } else if (this.isActive && !insideAny) {
                // Left all zones
                this.onInactive.dispatch(this, toTrack, zones);
            }
        }, this);


    };

    Game.Trigger.ZoneTrigger.prototype.debug = function() {
        _.forEach(this.zones, function(zone, izones) {
            this.game.debug.geom(zone);
        }, this);
            
    };

})();
