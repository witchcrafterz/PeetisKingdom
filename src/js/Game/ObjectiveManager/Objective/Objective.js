(function() {
    'use strict';

    Game.ObjectiveManager.Objective = function(game, objectiveManager, trigger, tilemap, objectiveLayer, player, dependencies) {
        Phaser.Group.call(this, game, objectiveManager, objectiveLayer.name);
        this.alpha = 0;

        /**
         * Game instance
         * @type {Phaser.Game}
         */
        this.game = game;

        /**
         * The player who are to complete the objective
         * @type {Phaser.Sprite}
         */
        this.player = player;

        /**
         * Instance of objectiveManager
         * @type {Game.ObjectiveManager.Objective}
         */
        this.objectiveManager = objectiveManager;

        /**
         * The objective layer that this objective belongs to
         * @type {Phaser.TilemapLayer}
         */
        this.objectiveLayer = objectiveLayer;

        /**
         * The objects properties from the tilemap
         * @type {Object}
         */
        this.properties = this.objectiveLayer.properties;

        /**
         * The tilemap of which this objectives objective layer belongs to
         * @type {Phaser.Tilemap}
         */
        this.tilemap = tilemap;

        /**
         * Name of the objective
         * @type {String}
         */
        this.name = this.objectiveLayer.name;

        /**
         * Is the objective completed or not
         * @type {Boolean}
         */
        this.completed = false;

        /**
         * List of objective name in strings that has to be completed before this objective can be activated
         * @type {Array#String}
         */
        this.dependencies = dependencies;

        /**
         * The trigger that will trigger this objective
         * @type {Game.Trigger}
         */
        this.trigger = trigger;
        this.trigger.onActive.add(this.activate, this);
        this.trigger.onInactive.add(this.inactivate, this);

        /**
         * Whether or not to remove objective on inactive
         * @type {Boolean}
         */
        this.removeOnInactive = true;

        /**
         * Signal that fires upon completion of objective
         * @type {Phaser.Signal}
         */
        this.onCompletion = new Phaser.Signal();
        this.onCompletion.add(this._onCompletionHandler, this);

        /**
         * Signal that fires upon failure of objective
         * @type {Phaser.Signal}
         */
        this.onFailure = new Phaser.Signal();
        this.onFailure.add(this._onFailureHandler, this);

        /**
         * An object containing style information for _titleText
         * @type {Object}
         */
        this._titleTextStyle = {
            font: '17pt serif'
        };

        /**
         * The Phaser.Text instance of the title
         * @type {Phaser.Text}
         */
        this._titleText = this.game.add.text(0, 0, this.name, this._titleTextStyle);
        this.add(this._titleText);

        this._statusTextStyle = { 
            font: '14pt serif' 
        };

        /**
         * The status template to be used for this objective. Formatting is to be implemented by children inheriting the Game.ObjectiveManager.Objective class
         * @type {String}
         */
        this._statusTemplate = this.objectiveLayer.properties.status || this.name;

        /**
         * The Phaser.Text instance of the status
         * @type {Phaser.Text}
         */
        this._statusText = this.game.add.text(0, 0, this._statusTemplate, this._statusTextStyle);
        this._statusText.y = this._titleText.height;
        this.add(this._statusText);

    };

    Game.ObjectiveManager.Objective.prototype = Object.create(Phaser.Group.prototype);
    Game.ObjectiveManager.Objective.prototype.constructor = Game.ObjectiveManager.Objective;

    Game.ObjectiveManager.Objective.prototype.update = function() {
        Phaser.Group.prototype.update.call(this);
    };
    
    Game.ObjectiveManager.Objective.prototype.updateStatusText = function() {
    };

    Game.ObjectiveManager.Objective.prototype.activate = function() {
        if (!this.isActive && !this.completed && this.objectiveManager.isCompleted(this.dependencies)) {
            this.objectiveManager.addObjective(this);
        }
    };

    Game.ObjectiveManager.Objective.prototype.inactivate = function() {
        if (this.removeOnInactive && this.isActive) {
            this.objectiveManager._removeObjective(this);
        }
    };

    Object.defineProperty(Game.ObjectiveManager.Objective.prototype, 'statusTemplate', {

        get: function() {
            return this._statusTemplate;
        },

        set: function(value) {
            this._statusTemplate = value;
            this.updateStatusText();
        }

    });

    Game.ObjectiveManager.Objective.prototype._onCompletionHandler = function() {
        this.completed = true;
        this._statusTextStyle.fill = '#01C611';
        this._statusText.setStyle(this._statusTextStyle);
    };

    Game.ObjectiveManager.Objective.prototype._onFailureHandler = function() {
        this._statusTextStyle.fill = '#ff0000';
        this._statusText.setStyle(this._statusTextStyle);
    };

    Game.ObjectiveManager.Objective.prototype.toString = function() {
        return this.name;
    };

    Object.defineProperty(Game.ObjectiveManager.Objective.prototype, 'statusText', {

        get: function() {
            if (this._statusText) {
                return this._statusText.text;
            }
            return this.name + ' status';
        },

        set: function(value) {
            this._statusText.text = value;
        }

    });  

    Object.defineProperty(Game.ObjectiveManager.Objective.prototype, 'isActive', {

        get: function() {
            return this.objectiveManager.isActive(this);
        }

    });

})();
