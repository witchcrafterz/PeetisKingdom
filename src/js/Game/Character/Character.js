(function() {
    'use strict';

     /**
      * A generic character
      * @param {Phaser.Game} game   The phaser game instance
      * @param {Number} x           The X-coordinate on which to spawn this character
      * @param {Number} y           The Y-coordinate on which to spawn this character
      * @param {String} texture     The texture key to use on this character
      */
    Game.Character = function(game, x, y, texture, controller) {
        Phaser.Sprite.call(this, game, x, y, texture);

        this.anchor.set(0.5);
        this.game.physics.enable(this, Phaser.Physics.ARCADE);

        this.body.drag = new Phaser.Point(1500, 0);
        // this.body.collideWorldBounds = true;
        this.body.maxVelocity = new Phaser.Point(3000, 2000);

        /**
         * The desired drag for the character while walking on the ground
         * @type {Phaser.Point}
         */
        this.desiredDrag = this.body.drag.clone();

        /**
         * The desired drag for the character while in the air
         * @type {Phaser.Point}
         */
        this.desiredAirDrag = new Phaser.Point(300, 0);

        /**
         * The texture key used in the making of this character
         * @type {String}
         */
        this.textureKey = texture;

        /**
         * The maximum amount of jumps to jump
         * @type {Number}
         */
        this.maxJumps = 1;

        /**
         * The velocity in which the character can walk
         * @type {Number}
         */
        this.walkingVelocity = 500;

        /**
         * The controller that handles this sprite
         * @type {Game.Controller}
         */
        this.controller = controller;

        /**
         * The acceleration when walking
         * @type {Number}
         */
        this.walkingAcc = 2000;

        /**
         * The amount to refill this.jumpMeter with
         * @type {Number}
         */
        this.fullJumpMeter = 20000;

        /**
         * The amount that reduces the jumpmeter every tick that jump key is being held down
         * @type {Number}
         */
        this.jumpFactor = 0.7;

        /**
         * The jump meter, that is how much jump-energy there is left
         * @type {Number}
         */
        this.jumpMeter = this.fullJumpMeter;


        /**
         * The current amount of jumps jumped since reset
         * @type {Number}
         */
        this.currentJumps = 0;

        /**
         * Calculated states the character can exist in
         * @type {Object} states
         * @type {Object} states.airborn    If the character is in the air
         * @type {Object} states.walking    If the character is walking
         * @type {Object} states.tryWalking If the character is trying to walk, i.e. pressing right or left on controller
         * @type {Object} states.falling    If the character is airborn with positive Y-velocity
         * @type {Object} states.rising     If the character is airborn with negative Y-velocity
         * @type {Object} states.still      If the character is completely still
         * @type {Object} states.ducking    If the character is ducking, that is, pressing the duck key
         */
        this.states = {
            'airborn': false,
            'walking': false,
            'tryWalking': false,
            'falling': false,
            'rising': false,
            'still': false,
            'ducking': false
        };

        /**
         * Whether or not to automatically flip the character horizontally when walking to the left
         * @type {Boolean}
         */
        this.autoFlip = true;

        /**
         * The jump sound effect
         * @type {Phaser.Audio}
         */
        this.jumpSFX = this.game.add.audio('jump');

        /**
         * If the character is in god mode or not. God mode allows for flying
         * @type {Boolean}
         */
        this.godMode = false;

        return this;
    };

    Game.Character.prototype = Object.create(Phaser.Sprite.prototype);
    Game.Character.prototype.constructor = Game.Character;

    /**
     * Resets the jump
     * @return {Undefined}
     */
    Game.Character.prototype.resetJump = function() {
        this.currentJumps = 0;
        this.jumpMeter = this.fullJumpMeter;
        this.flicked = false;
    };

    /**
     * Internal method used to handle the jump key
     * @return {undefined}
     */
    Game.Character.prototype._jump = function() {
        if (this.submerged) {
            if (this.controller.jump.isDown) {
                this.body.velocity.y = -400;
            }
            return;
        }

        if (this.controller.jump.isDown) {
            if (!this.jumpWasDown) {
                this.currentJumps += 1;

                if (this.currentJumps < this.maxJumps) {
                    this.body.velocity.y = 0;
                }
            }

            if (Math.floor(this.jumpMeter) > 0 && this.currentJumps < this.maxJumps) {
                if (this.body.onFloor() || !this.jumpWasDown) {
                    this.jumpSFX.playFrom(this.position);
                }

                this.body.acceleration.y -= this.jumpMeter;
                this.jumpMeter *= this.jumpFactor;
            }
        } else {
            if (this.jumpWasDown) {
                if (this.maxJumps >= this.currentJumps) {
                    this.jumpMeter = this.fullJumpMeter;
                } else {
                    this.jumpMeter = 0;
                }
            }
        }

        this.jumpWasDown = this.controller.jump.isDown;
    };

    /**
     * Internal method to calculate the this.states object
     * @return {Undefined}
     */
    Game.Character.prototype._calculateStates = function() {
        this.states.airborn = !this.body.onFloor();
        this.states.falling = this.states.airborn && this.body.velocity.y > 0;
        this.states.rising = this.states.airborn && this.body.velocity.y < 0;

        if (this.controller) {
            this.states.tryWalking = (this.controller.right.isDown || this.controller.left.isDown);
            this.states.walking = this.states.tryWalking && !this.states.airborn;
            this.states.still = (this.body.touching.down || this.body.onFloor()) && Math.abs(this.body.velocity.x) < 40;
            this.states.ducking = this.controller.down.isDown;
        } else {
            this.states.walking = undefined;
            this.states.still = undefined;
            this.states.ducking = undefined;
        }
    };

    Game.Character.prototype._controllerHandler = function() {
        if (this.controller.update) {
            this.controller.update();
        }

        // Walking Action
        if (this.controller.right.isDown) {
            this.body.acceleration.x = this.walkingAcc;

            if (this.autoFlip) {
                this.scale.x = 1;
            }
        } else if (this.controller.left.isDown) {
            this.body.acceleration.x = -this.walkingAcc;

            if (this.autoFlip) {
                this.scale.x = -1;
            }
        } else {
            this.body.acceleration.setTo(0);
        }

        // Jumping action
        if (!this.godMode) {
            this._jump();
        } else {
            if (this.controller.jump.isDown) {
                this.body.acceleration.y = -2000;
            } else if (this.controller.down.isDown) {
                this.body.acceleration.y = 2000;
            } else {
                this.body.velocity.y *= 0.95;
            }
        }
    };

    Game.Character.prototype.update = function() {
        // Calculate states
        this._calculateStates();

        // Zero accleration every tick, for easier adding of acceleration and so that body.drag have an affect
        this.body.acceleration.setTo(0);

        // If there is a controller, handle it
        if (this.controller) {
            this._controllerHandler();
        }

        if (this.states.airborn) {
            if (!this.body.drag.equals(this.desiredAirDrag)) {
                this.body.drag.setTo(this.desiredAirDrag.x, this.desiredAirDrag.y);
            }
        } else {
            if (!this.body.drag.equals(this.desiredDrag)) {
                this.body.drag.setTo(this.desiredDrag.x, this.desiredDrag.y);
            }
        }

        //If submerged, reduce speed        
        if (this.submerged) {
            this.body.velocity.y *= 0.85;
            this.body.velocity.x *= 0.95;
        }

        // If on floor reset jump
        if (this.body.onFloor() || this.body.touching.down) {
            this.resetJump();
        }

        // Other restrictions etc.

        // Restrict walking speed
        if (this.states.tryWalking && !this.godMode && !this.flicked) {
            this.body.velocity.x = Math.clamp(this.body.velocity.x, -this.walkingVelocity, this.walkingVelocity);
        }
    };

})();
