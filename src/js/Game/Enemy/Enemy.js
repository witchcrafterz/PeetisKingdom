(function() {
    'use strict';

    /**
     * Reference file: https://github.com/photonstorm/phaser-examples/blob/master/projects/rox/src/Player.js
     */

    var _textureKey = 'alienYellow';
    var maxSpeed = 500;
    var acc = 2000;
    var controller = Game.Controller.AI;
    var maxVelocity = new Phaser.Point(3000, 2000);
    var maxWalkingVelocity = new Phaser.Point(500, 0);

    Game.Enemy = function(game, x, y, textureKey, controller) {

        Phaser.Sprite.call(this, game, x, y, _textureKey || textureKey);

        this.anchor.set(0.5);
        this.game.physics.enable(this, Phaser.Physics.ARCADE);

        this.body.collideWorldBounds = true;
        this.body.drag.setTo(1000, 0);
        this.body.maxVelocity = maxVelocity;

        this.controller = controller;
        this.controller.controlled = this;

        this.animations.add('running', [9, 10], 10, true);
        this.animations.add('jump', [5], 20, true);
        this.animations.add('falling', [4], 20, true);
        this.animations.add('still', [0], 20, true);

        this.currAnim = '';

        var point = new Phaser.Point();
        point.x = 500;
        point.y = 1000;
        this.body.maxVelocity = point;

        return this;
    };

    // Clone the Phaser.Sprite prototype, and use it as our own. 
    // This is how inheritance works in JavaScript btw
    Game.Enemy.prototype = Object.create(Phaser.Sprite.prototype);
    Game.Enemy.prototype.constructor = Game.Enemy;

    Game.Enemy.prototype.animate = function() {
    };

    Game.Enemy.prototype.update = function() {
        if (this.controller.right.isDown) {
            this.body.acceleration.x = acc;
            this.body.velocity.x = Math.clamp(this.body.velocity.x, -maxWalkingVelocity.x, maxWalkingVelocity.x);

            this.animations.play('running');

            this.scale.x = 1;
        } else if (this.controller.left.isDown) {
            this.body.acceleration.x = -acc;
            this.body.velocity.x = Math.clamp(this.body.velocity.x, -maxWalkingVelocity.x, maxWalkingVelocity.x);

            this.animations.play('running');

            this.scale.x = -1;
        } else {
            this.body.acceleration.setTo(0);
        }


        if (this.body.onFloor() && this.controller.jump.isDown) {
            this.body.velocity.y -= 2000;
        }

        // this.animate();
    };

})();
