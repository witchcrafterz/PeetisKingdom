(function() {
    'use strict';

    /**
     * A generic AI class that is to be inherited by different types of AI's
     * @param {Phaser.Game}     game       The Phaser Game instance
     * @param {Game.Character}  controlled The character this AI will control
     * @param {Object}          Properties Custom properties this AI can use
     */
    Game.Controller.AI = function(game, controlled, player, properties) {
        Game.Controller.call(this, game);

        /**
         * The character this AI controls
         * @type {Game.Character}
         */
        this.controlled = controlled;

        /**
         * A reference to currently playing player
         * @type {Game.Player}
         */
        this.player = player;

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

        /**
         * A dialogue that pops up
         * @type {String}
         */
        this.dialogue = this.game.dialogues[this.properties['dialogue']];

        /**
         * Whether or not the player is close to the AI
         * @type {Boolean}
         */
        this.isPlayerClose = false;

        /**
         * If the player was close the previous tick
         * @type {Boolean}
         */
        this.wasPlayerClose = false;

        /**
         * The vision of the character in pixels. This is used by isPlayerClose/wasPlayerClose
         * @type {Number}
         */
        this.vision = parseInt(this.properties.vision, 10) || 200;

        /**
         * Whether or not to automatically turn to the player if it is within the characters vision
         * @type {Boolean}
         */
        this.watchPlayer = true;

        this._dependenciesMonitor();
        this._criteriasMonitor();

        return this;
    };

    Game.Controller.AI.prototype = Object.create(Game.Controller.prototype);
    Game.Controller.AI.prototype.constructor = Game.Controller.AI;

    Game.Controller.AI.prototype.update = function() {
        // Reasoning behind custom code instead of built in function is that built in only has distance and not distanceSquared. 
        // This saves performance as sqrt is an expensive operation. Also saves the need to open up a new scope in the called function.
        var deltaX = this.controlled.position.x - this.player.position.x;
        var deltaY = this.controlled.position.y - this.player.position.y;
        var distanceSq = deltaX * deltaX + deltaY * deltaY;
        if (distanceSq < this.vision * this.vision) {
            this.isPlayerClose = true;
            this._onCloseHandler();
        } else {
            this.isPlayerClose = false;
            this._onNotCloseHandler();
        }

        if (this.isPlayerClose && this.watchPlayer && this.controlled.autoFlip) {
            var dir = this.controlled.position.x > this.player.position.x ? -1 : 1;
            this.controlled.scale.x = dir;
        }

        this.wasPlayerClose = this.isPlayerClose;
    };

    Game.Controller.AI.prototype._onCloseHandler = function() {
        if (!this.wasPlayerClose && this.dialogue) {
            this.game.dialogueManager.setDialogue(this.dialogue);
        }
    };

    Game.Controller.AI.prototype._onNotCloseHandler = function() {
        if (this.wasPlayerClose && this.dialogue && this.dialogue.isOpen) {
            this.game.dialogueManager.hidden = true;
            this.dialogue.isOpen = false;
        }
    };

    /**
     * Monitors depencencies and checks if all is completed. If they are, Game.Controller.AI.prototype._dependenciesCompleteHandler is called
     * @return {undefined}
     */
    Game.Controller.AI.prototype._dependenciesMonitor = function() {
        if (this.friendlyDependencies) {
            this.game.objectiveManager.onObjectiveComplete.add(function() {
                this.dependenciesComplete = this.game.objectiveManager.isCompleted(this.friendlyDependencies);
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
