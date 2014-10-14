(function() {
    'use strict';

    /**
     * Reference file: https://github.com/photonstorm/phaser-examples/blob/master/projects/rox/src/Player.js
     */

    var textureKey = 'player1';
    var jumpKey = Phaser.Keyboard.SPACEBAR;
    var maxSpeed = 500;
    var jumpAcc = -1000;
    var fullJumpMeter = 15000;
    var acc = 2000;

    Game.player = function(game, x, y) {

        Phaser.Sprite.call(this, game, x, y, textureKey);

        this.anchor.set(0.5);
        this.game.physics.enable(this, Phaser.Physics.ARCADE);

        this.body.collideWorldBounds = true;
        // this.body.bounce.y = 0.1;

        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.jumpButton = this.game.input.keyboard.addKey(jumpKey);

        this.animations.add('running', [5, 6, 7, 8, 9, 10, 11, 12], 10, true);
        this.animations.add('jump', [3], 20, true);
        this.animations.add('falling', [2], 20, true);
        this.animations.add('still', [1], 20, true);

        this.currAnim = '';

        // console.log(this.animations.sprite);

        var point = new Phaser.Point();
        point.x = 500;
        point.y = 1000;
        this.body.maxVelocity = point;
        this.jumpMeter = fullJumpMeter;

        return this;
    };

    // Clone the Phaser.Sprite prototype, and use it as our own. 
    // This is how inheritance works in JavaScript btw
    Game.player.prototype = Object.create(Phaser.Sprite.prototype);
    Game.player.prototype.constructor = Game.player;

    Game.player.prototype.update = function() {

        if (this.cursors.right.isDown) {
            this.body.acceleration.x = acc;

            this.animations.play('running');

            this.scale.x = 1;
        } else if (this.cursors.left.isDown) {
            this.body.acceleration.x = -acc;

            this.animations.play('running');

            this.scale.x = -1;
        } else {
            this.body.acceleration.x = this.body.velocity.x * -5;
        }

        if (this.cursors.up.isDown && this.jumpMeter > 0) {
            this.jumpMeter += jumpAcc;
            this.body.velocity.y = jumpAcc;

            this.animations.play('jump');
        } else if (this.cursors.up.isUp && !this.body.onFloor()) {
            this.jumpMeter = 0;
        }
        
        if (this.body.velocity.y > 0) {
            this.animations.play('falling');
        }

        if (this.body.onFloor() && Math.abs(this.body.velocity.x) < 40) {
            this.animations.play('still');
        }

        if (this.body.onFloor()) {
            this.jumpMeter = fullJumpMeter;
        }
    };

})();
