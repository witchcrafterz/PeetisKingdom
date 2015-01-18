(function() {
    'use strict';

    /**
     * A controller that is supposed to be inherited by many other classes, such as keyboard controller/AIs
     * @param {Phaser.Game} game The phaser game instance
     */
    Game.Controller = function(game) {
        this.game = game;

        /**
         * A virtual key that represents the controller to go left
         * @type {Object}
         */
        var left = this.left = {
            onDown: new Phaser.Signal(),
            onUp: new Phaser.Signal(),
            isDown: false,
            setDown: function() {
                left.isDown = true;
                left.onDown.dispatch('left', true);
            },
            setUp: function() {
                left.isDown = false;
                left.onUp.dispatch('left', false);
            }
        };

        /**
         * A virtual key that represents the controller to go right
         * @type {Object}
         */
        var right = this.right = {
            onDown: new Phaser.Signal(),
            onUp: new Phaser.Signal(),
            isDown: false,
            setDown: function() {
                right.isDown = true;
                right.onDown.dispatch('right', true);
            },
            setUp: function() {
                right.isDown = false;
                right.onUp.dispatch('right', false);
            }
        };

        /**
         * A virtual key that represents the controller to jump
         * @type {Object}
         */
        var jump = this.jump = {
            onDown: new Phaser.Signal(),
            onUp: new Phaser.Signal(),
            isDown: false,
            setDown: function() {
                jump.isDown = true;
                jump.onDown.dispatch('jump', true);
            },
            setUp: function() {
                jump.isDown = false;
                jump.onUp.dispatch('jump', false);
            }
        };

        /**
         * A virtual key that represents the controller to duck
         * @type {Object}
         */
        var down = this.down = {
            onDown: new Phaser.Signal(),
            onUp: new Phaser.Signal(),
            isDown: false,
            setDown: function() {
                down.isDown = true;
                down.onDown.dispatch('down', true);
            },
            setUp: function() {
                down.isDown = false;
                down.onUp.dispatch('down', false);
            }
        };

        /**
         * A virtual key that represents the controller to interact with things
         * @type {Object}
         */
        var up = this.up = {
            onDown: new Phaser.Signal(),
            onUp: new Phaser.Signal(),
            isDown: false,
            setDown: function() {
                up.isDown = true;
                up.onDown.dispatch('up', true);
            },
            setUp: function() {
                up.isDown = false;
                up.onUp.dispatch('up', false);
            }
        };

        return this;
    };

    Game.Controller.prototype.constructor = Game.Controller;

    Game.Controller.prototype.generateTouchControls = function() {
        this.touchControlsGroup = this.game.add.group();

        var dPad = this.game.add.button(0, 0, 'UI', null, null, 6, 6, 6, 6, this.touchControlsGroup);
        var jump = this.game.add.button(0, 0, 'UI', null, null, 44, 44, 44, 44, this.touchControlsGroup);

        dPad.scale.setTo(2);
        jump.scale.setTo(3);

        jump.x = this.game.width - jump.width;
        jump.y = this.game.height - jump.height;
        dPad.y = this.game.height - dPad.height;

        this.touchControlsGroup.fixedToCamera = true;
        this.touchControlsGroup.setAll('alpha', 0.85);

        console.log(this.game.input);

        var onDownHandler = function(sender, pointer) {
            var relativeX = pointer.x - sender.x;
            var deltaX = relativeX - sender.width / 2;

            if (deltaX < 0) {
                this.left.setDown.call(this);
            } else {
                this.left.setUp.call(this);
            }

            if (deltaX >= 0) {
                this.right.setDown.call(this);
            } else {
                this.right.setUp.call(this);
            }
        };

        var onDownLoop = function(sender, pointer) {
            setTimeout(function(thisArg) {
                if (pointer.isDown) {
                    onDownHandler.call(thisArg, sender, pointer);
                    onDownLoop.call(thisArg, sender, pointer);
                } else {
                    this.left.setUp.call(this);
                    this.right.setUp.call(this);
                }
            }, 20, this);
        };

        dPad.onInputDown.add(onDownLoop, this);

        dPad.onInputUp.add(function(sender, pointer) {
            this.left.setUp.call(this);
            this.right.setUp.call(this);
        }, this);

        jump.onInputDown.add(this.jump.setDown, this);
        jump.onInputUp.add(this.jump.setUp, this);
    };

})();