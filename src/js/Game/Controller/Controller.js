(function() {
    'use strict';

    Game.Controller = function(game) {
        this.game = game;

        this.initialize();

        this.cursors = this.game.input.keyboard.createCursorKeys();

        this.cursors.right.onDown.add(this.right.setDown, this);
        this.cursors.right.onUp.add(this.right.setUp, this);

        this.cursors.left.onDown.add(this.left.setDown, this);
        this.cursors.left.onUp.add(this.left.setUp, this);

        this.cursors.up.onDown.add(this.jump.setDown, this);
        this.cursors.up.onUp.add(this.jump.setUp, this);

        this.cursors.down.onDown.add(this.down.setDown, this);
        this.cursors.down.onUp.add(this.down.setUp, this);

        if (Modernizr.touch) {
            this.generateTouchControls();
        }

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

    Game.Controller.prototype.initialize = function() {
        this.left = {
            onDown: new Phaser.Signal(),
            onUp: new Phaser.Signal(),
            isDown: false,
            setDown: function() {
                this.left.isDown = true;
                this.left.onDown.dispatch();
            },
            setUp: function() {
                this.left.isDown = false;
                this.left.onUp.dispatch();
            }
        };
        this.right = {
            onDown: new Phaser.Signal(),
            onUp: new Phaser.Signal(),
            isDown: false,
            setDown: function() {
                this.right.isDown = true;
                this.right.onDown.dispatch();
            },
            setUp: function() {
                this.right.isDown = false;
                this.right.onUp.dispatch();
            }
        };
        this.jump = {
            onDown: new Phaser.Signal(),
            onUp: new Phaser.Signal(),
            isDown: false,
            setDown: function() {
                this.jump.isDown = true;
                this.jump.onDown.dispatch();
            },
            setUp: function() {
                this.jump.isDown = false;
                this.jump.onUp.dispatch();
            }
        };
        this.down = {
            onDown: new Phaser.Signal(),
            onUp: new Phaser.Signal(),
            isDown: false,
            setDown: function() {
                this.down.isDown = true;
                this.down.onDown.dispatch();
            },
            setUp: function() {
                this.down.isDown = false;
                this.down.onUp.dispatch();
            }
        };
    };

})();