(function() {
    'use strict';

    /**
     * Reference file: https://github.com/photonstorm/phaser-examples/blob/master/projects/rox/src/Player.js
     */

    var textureKey = 'p1';
    var maxSpeed = 500;
    var fullJumpMeter = 20000;
    var jumpFactor = 0.7;
    var acc = 2000;
    var maxJumps = 2;
    var maxVelocity = new Phaser.Point(3000, 2000);
    var maxWalkingVelocity = new Phaser.Point(500, 0);
    var drag = {x: 1000, y: 0};

    Game.Player = function(game, x, y) {

        Phaser.Sprite.call(this, game, x, y, textureKey);

        this.inventory = [];

        this.anchor.set(0.5);
        this.game.physics.enable(this, Phaser.Physics.ARCADE);

        this.body.collideWorldBounds = true;
        this.body.maxVelocity = maxVelocity;

        this.controller = new Game.Controller(this.game);

        this.animations.add('running', [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], 10, true);
        this.animations.add('jump', [3], 20, true);
        this.animations.add('falling', [2], 20, true);
        this.animations.add('still', [1], 20, true);
        this.animations.add('duck', [0], 20, true);

        this.currAnim = '';

        this.jumpMeter = fullJumpMeter;
        this.currentJumps = 0;

        this.ctrlKey = this.game.input.keyboard.addKey(17);

        this.godMode = false;

        return this;
    };

    // Clone the Phaser.Sprite prototype, and use it as our own. 
    // This is how inheritance works in JavaScript btw
    Game.Player.prototype = Object.create(Phaser.Sprite.prototype);
    Game.Player.prototype.constructor = Game.Player;

    Game.Player.prototype.updateBodySize = function() {
        var currentFrame = this.animations.currentAnim.currentFrame;
        if (!currentFrame) return;

        if (this.body.height !== currentFrame.height) {
            this.body.height = currentFrame.height;
        }
        if (this.body.width !== currentFrame.width) {
            this.body.width = currentFrame.width;
        }
    };

    Game.Player.prototype.resetJump = function() {
        this.currentJumps = 0;
        this.jumpMeter = fullJumpMeter;
    };

    Game.Player.prototype.jump = function() {
        if (this.controller.jump.isDown) {
            if (!this.jumpWasDown) {
                this.currentJumps += 1;

                if (this.currentJumps < maxJumps) {
                    this.body.velocity.y = 0;
                }
            }

            if (Math.floor(this.jumpMeter) > 0 && this.currentJumps < maxJumps) {
                this.body.acceleration.y -= this.jumpMeter;
                this.jumpMeter *= jumpFactor;

            }
        } else {
            if (this.jumpWasDown) {
                if (maxJumps >= this.currentJumps) {
                    this.jumpMeter = fullJumpMeter;
                } else {
                    this.jumpMeter = 0;
                }
            }
        }

        this.jumpWasDown = this.controller.jump.isDown;
    };

    Game.Player.prototype.animate = function() {
        var airborn = !this.body.onFloor();
        var walking = (this.controller.right.isDown || this.controller.left.isDown) && !airborn;
        var falling = airborn && this.body.velocity.y > 0;
        var rising = airborn && this.body.velocity.y < 0;
        var still = (this.body.touching.down || this.body.onFloor()) && Math.abs(this.body.velocity.x) < 40;
        var ducking = this.controller.down.isDown;

        if (ducking) {
            this.animations.play('duck');
            return;
        }

        if (walking) {
            this.animations.play('running');
            return;
        }

        if (falling) {
            this.animations.play('falling');
            return;
        }

        if (rising) {
            this.animations.play('jump');
            return;
        }

        if (still) {
            this.animations.play('still');
            return;
        }
    };

    Game.Player.prototype.update = function() {
        this.updateBodySize();
        this.body.acceleration.y = 0;

        if (this.controller.right.isDown) {
            this.body.acceleration.x = acc;

            if (!this.ctrlKey.isDown && !this.godMode) {
                this.body.velocity.x = Math.clamp(this.body.velocity.x, -maxWalkingVelocity.x, maxWalkingVelocity.x);
            }

            this.animations.play('running');

            this.scale.x = 1;
        } else if (this.controller.left.isDown) {
            this.body.acceleration.x = -acc;

            if (!this.ctrlKey.isDown && !this.godMode) {
                this.body.velocity.x = Math.clamp(this.body.velocity.x, -maxWalkingVelocity.x, maxWalkingVelocity.x);
            }

            this.animations.play('running');

            this.scale.x = -1;
        } else {
            this.body.acceleration.setTo(0);
            if (this.godMode) {
                this.body.velocity.x *= 0.95;
            }
        }

        if (!this.godMode) {
            this.jump();
        } else {
            if (this.controller.jump.isDown) {
                this.body.acceleration.y = -2000;
            } else if (this.controller.down.isDown) {
                this.body.acceleration.y = 2000;
            } else {
                this.body.velocity.y *= 0.95;
            }
        }

        if (this.body.onFloor() || this.body.touching.down) {
            this.resetJump();
            this.body.drag.setTo(drag.x, drag.y);
        } else {
            this.body.drag.setTo(0);
        }

        this.animate();
    };

})();
