(function() {
    'use strict';

    /**
     * A generic AI class that is to be inherited by different types of AI's
     * @param {Phaser.Game}     game       The Phaser Game instance
     * @param {Game.Character}  controlled The character this AI will control
     * @param {Object}          Properties Custom properties this AI can use
     */
    Game.Controller.AI = function(game, controlled, properties) {
        Game.Controller.call(this, game);

        /**
         * The character this AI controls
         * @type {Game.Character}
         */
        this.controlled = controlled;

        /**
         * Custom properties this AI can use
         * @type {Object}
         */
        this.properties = properties;

        /**
         * An array of dependencies to fulfill for this AI to do something
         * @type {Array#String}
         */
        this.friendlyDependencies = this.properties['dependencies'] ? this.properties['dependencies'].split(',') : undefined;

        /**
         * Whether or not all dependencies are complete. If there are no dependencies it's value is set to true
         * @type {Boolean}
         */
        this.dependenciesComplete = typeof this.friendlyDependencies === 'undefined';

        /**
         * An array of criterias to fulfill for this AI to do something
         * @type {Array#String}
         */
        this.friendlyCriterias = this.properties['criterias'] ? this.properties['criterias'].split(',') : undefined;
        
        /**
         * Whether or not all criterias are complete. If there are no criterias, it's value is set to true
         * @type {Boolean}
         */
        this.criteriasComplete = typeof this.friendlyCriterias === 'undefined';

        this._dependenciesMonitor();
        this._criteriasMonitor();

        return this;
    };

    Game.Controller.AI.prototype = Object.create(Game.Controller.prototype);
    Game.Controller.AI.prototype.constructor = Game.Controller.AI;

    /**
     * Monitors depencencies and checks if all is completed. If they are, Game.Controller.AI.prototype._dependenciesCompleteHandler is called
     * @return {undefined}
     */
    Game.Controller.AI.prototype._dependenciesMonitor = function() {
        if (this.friendlyDependencies) {
            this.game.objectiveManager.onObjectiveComplete.add(function() {
                this.dependenciesComplete = !this.game.objectiveManager.isCompleted(this.friendlyDependencies);
                this._dependenciesCompleteHandler();
            }, this);
        }
    };

    /**
     * Gets called once all dependencies are complete
     * @return {undefined}
     */
    Game.Controller.AI.prototype._dependenciesCompleteHandler = function() {
    };

    /**
     * Monitors criterias and checks if all is completed. If they are, Game.Controller.AI.prototype._criteriasCompleteHandler is called
     * @return {undefined}
     */
    Game.Controller.AI.prototype._criteriasMonitor = function() {
        if (this.friendlyCriterias) {
            this.game.onCriteriaAdd.add(function() {
                // length===0 implies all completed
                this.criteriasComplete = _.difference(this.friendlyCriterias, this.game.criterias).length !== 0;
                this._criteriasCompleteHandler();
            }, this);
        }
    };

    /**
     * Gets called once all criterias are complete
     * @return {undefined}
     */
    Game.Controller.AI.prototype._criteriasCompleteHandler = function() {
    };

})();
