(function() {
    'use strict';

    /**
     * An AI that guards a position or entrance
     * @param {Phaser.Game}     game                    The game instance
     * @param {Phaser.Sprite}   controlled              The sprite which the AI controls
     * @param {Phaser.Sprite}   toTrack                 The sprite which the AI tracks
     * @param {Phaser.Point}    direction               The direction to flick the tracked if trespassing
     * @param {String}          friendlyCriterias       A string of criterias separated by commas, which will have to be fulfilled for AI to turn friendly
     * @param {String}          friendlyDependencies    A string of dependencies separated by commas, which will have to be fulfilled for AI to turn friendly
     */
    Game.Controller.AI.Guard = function(game, controlled, toTrack, direction, friendlyCriterias, friendlyDependencies) {
        this.game = game;

        this.initialize();

        this.controlled = controlled;

        this.toTrack = toTrack;

        this.hostile = true;

        this.flickVector = direction;

        this.friendlyDependencies = friendlyDependencies ? friendlyDependencies.split(',') : undefined;

        this.friendlyCriterias = friendlyCriterias ? friendlyCriterias.split(',') : undefined;

        if (this.friendlyDependencies) {
            this.game.objectiveManager.onObjectiveComplete.add(function() {
                this.hostile = !this.game.objectiveManager.isCompleted(this.friendlyDependencies);
            }, this);
        }

        if (this.friendlyCriterias) {
            this.game.onCriteriaAdd.add(function() {
                // length===0 implies all completed
                this.hostile = _.difference(this.friendlyCriterias, this.game.criterias).length !== 0;
            }, this);
        }

        this.f1 = this.game.input.keyboard.addKey(112);
        this.f1.onUp.add(function() {
            this.hostile = !this.hostile;
        }, this);

        return this;
    };

    Game.Controller.AI.Guard.prototype = Object.create(Game.Controller.prototype);
    Game.Controller.AI.Guard.prototype.constructor = Game.Controller.AI.Guard;

    Game.Controller.AI.Guard.prototype.update = function() {
        if (!this.hostile) {
            this.right.setUp.call(this);
            this.left.setUp.call(this);
            this.jump.setUp.call(this);
            return;
        }

        if (this.game.physics.arcade.intersects(this.toTrack.body, this.controlled.body)) {
            // Have to manually lift the guy up some pixel bc of bug where he stays on ground
            this.toTrack.body.position.y -= 10;
            this.toTrack.body.velocity.setTo(this.flickVector.x, this.flickVector.y);
            this.toTrack.flicked = true;
        }
    };

})();
