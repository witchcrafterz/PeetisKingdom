(function() {
    'use strict';

    /**
     * An AI that guards a position or entrance
     * @param {Phaser.Game}     game                    The game instance
     * @param {Phaser.Sprite}   controlled              The sprite which the AI controls
     * @param {Object}          Properties              Custom properties this AI can use
     * @param {Phaser.Sprite}   toTrack                 The sprite which the AI tracks
     */
    Game.Controller.AI.Guard = function(game, controlled, player, properties) {
        Game.Controller.AI.call(this, game, controlled, player, properties);

        /**
         * Whether or not this AI is hostile
         * @type {Boolean}
         */
        this.hostile = true;

        var angle = parseFloat(this.properties['angle'], 10) || Math.PI / 4;
        // Magnitude of push (hypotenuse)
        var magnitude = parseInt(this.properties['magnitude'], 10) || 1500;
        // -Math.sin(angle) because game world up/down is inverted
        /**
         * In what direction this AI will flick a trespassing character
         * @type {Phaser.Point}
         */
        this.flickVector = new Phaser.Point(Math.cos(angle) * magnitude, -Math.sin(angle) * magnitude);

        return this;
    };

    Game.Controller.AI.Guard.prototype = Object.create(Game.Controller.AI.prototype);
    Game.Controller.AI.Guard.prototype.constructor = Game.Controller.AI.Guard;

    Game.Controller.AI.Guard.prototype.update = function() {
        Game.Controller.AI.prototype.update.call(this);

        if ((this.criteriasComplete && this.friendlyCriterias) && (this.dependenciesComplete && this.friendlyDependencies)) {
            this.right.setUp();
            this.left.setUp();
            this.jump.setUp();
            return;
        }

        if (this.game.physics.arcade.intersects(this.player.body, this.controlled.body)) {
            // Have to manually lift the guy up some pixel bc of bug where he stays on ground
            this.player.body.position.y -= 10;
            this.player.body.velocity.setTo(this.flickVector.x, this.flickVector.y);
            this.player.flicked = true;
        }
    };

})();
