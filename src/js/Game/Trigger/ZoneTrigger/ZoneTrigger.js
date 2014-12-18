(function() {
    'use strict';

    /**
     * An object that triggers an event upon entering/leaving a zone
     * @param {Phaser.Game}                                 game    The phaser game istance
     * @param {Boolean}                                     enabled [description]
     * @param {Array#Phaser.Rectangle | Phaser.Rectangle}   zone    [description]
     * @param {Array#Phaser.Sprite | Phaser.Sprite}         toTrack    [description]
     */
    Game.Trigger.ZoneTrigger = function(game, enabled, zone, toTrack) {
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


        this._wasInZone = [];

        if (this.zones && this.zones.constructor !== Array) {
            this.zones = [this.zones];
        }

        if (this.toTrack && this.toTrack.constructor !== Array) {
            this.toTrack = [this.toTrack];
        }

        console.log(this.zones);
        console.log(this.toTrack);

        this._refreshInZone();

        return this;
    };

    Game.Trigger.ZoneTrigger.prototype = Object.create(Game.Trigger.prototype);
    Game.Trigger.ZoneTrigger.prototype.constructor = Game.Trigger.ZoneTrigger;

    Game.Trigger.ZoneTrigger.prototype._refreshInZone = function() {
        this._wasInZone = [];
        for (var i = 0; i < this.toTrack.length; i++) {
            this._wasInZone.push(false);
        }
    };

    Game.Trigger.ZoneTrigger.prototype.update = function() {
        if (!this.enabled) return;

        _.forEach(this.toTrack, function(toTrack, iToTrack) {
            _.forEach(this.zones, function(zone, iZone) {

                var intersects = zone.contains(toTrack.position.x, toTrack.position.y);

                if (intersects && !this._wasInZone[iToTrack]) {
                    this.onActive.dispatch(this, toTrack, zone);
                } else if(!intersects && this._wasInZone[iToTrack]) {
                    this.onInactive.dispatch(this, toTrack, zone);
                }

                this._wasInZone[iToTrack] = intersects;
            }, this);
        }, this);
    };

    Game.Trigger.ZoneTrigger.prototype.debug = function() {
        _.forEach(this.zones, function(zone, izones) {
            this.game.debug.geom(zone);
        }, this);
            
    };

})();
