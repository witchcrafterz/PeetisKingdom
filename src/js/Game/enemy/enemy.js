(function() {
    'use strict';

    /**
     * Reference file: https://github.com/photonstorm/phaser-examples/blob/master/projects/rox/src/Player.js
     */

    var _textureKey = 'alienYellow';
    var maxSpeed = 500;
    var acc = 2000;

    Game.enemy = function(game, x, y, textureKey) {

        Phaser.Sprite.call(this, game, x, y, _textureKey || textureKey);

        this.anchor.set(0.5);
        this.game.physics.enable(this, Phaser.Physics.ARCADE);

        this.body.collideWorldBounds = true;

        this.controller = new Game.controller(this.game);

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
    Game.enemy.prototype = Object.create(Phaser.Sprite.prototype);
    Game.enemy.prototype.constructor = Game.enemy;

    Game.enemy.prototype.jump = function() {
        
    };

    Game.enemy.prototype.animate = function() {
        // if (this.controller.right.isDown || this.controller.left.isDown) {
        //     this.animations.play('running');
        // }

        // if (this.body.velocity.y > 0 && !this.body.onFloor()) {
        //     this.animations.play('falling');
        // }

        // if ((this.body.touching.down || this.body.onFloor()) && Math.abs(this.body.velocity.x) < 40) {
        //     this.animations.play('still');
        // }
    };

    Game.enemy.prototype.update = function() {

        if (this.controller.right.isDown) {
            this.body.acceleration.x = acc;

            this.animations.play('running');

            this.scale.x = 1;
        } else if (this.controller.left.isDown) {
            this.body.acceleration.x = -acc;

            this.animations.play('running');

            this.scale.x = -1;
        } else {
            this.body.acceleration.x = this.body.velocity.x * -5;
        }

        // if (this.game.physics.arcade.gravity === Game.gravity) {
        //     this.jump();
        // } else {
        //     if (this.controller.jump.isDown) {
        //         this.body.velocity.y -= acc * 0.01;
        //     } else if (this.controller.down.isDown) {
        //         this.body.velocity.y += acc * 0.01;
        //     } else {
        //         this.body.velocity.y *= 0.2;
        //     }
        // }

        // if (this.ctrlKey.isDown) {
        //     this.body.maxVelocity.x = 0;
        //     this.body.maxVelocity.y = 0;
        //     this.body.acceleration.y *= 2;
        //     this.body.acceleration.x *= 2;
        // } else {
        //     this.body.maxVelocity.x = 500;
        //     this.body.maxVelocity.y = 1000;
        // }

        // if (this.body.onFloor() || this.body.touching.down) {
        //     this.resetJump();
        // }

        // this.animate();
    };

})();
