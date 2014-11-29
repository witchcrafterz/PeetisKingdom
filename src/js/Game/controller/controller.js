(function() {
    'use strict';

    Game.controller = function(game) {
        this.game = game;

        this.touchControlsGroup = this.game.add.group();
        var rightArrow = this.game.add.button(0, 0, 'arrow', null, null, null, null, null, null, this.touchControlsGroup);
        var leftArrow = this.game.add.button(0, 0, 'arrow', null, null, null, null, null, null, this.touchControlsGroup);
        var jump = this.game.add.button(0, 0, 'circle', null, null, null, null, null, null, this.touchControlsGroup);

        jump.x = this.game.width - jump.width;
        rightArrow.x = rightArrow.width;
        leftArrow.x = leftArrow.width;
        leftArrow.scale.x = -1;

        this.touchControlsGroup.setAll('y', this.game.height - leftArrow.height);
        this.touchControlsGroup.setAll('fixedToCamera', true);

        this.cursors = this.game.input.keyboard.createCursorKeys();

        this.cursors.right.onDown.add(this.right.setDown, this);
        this.cursors.right.onUp.add(this.right.setUp, this);
        rightArrow.onInputDown.add(this.right.setDown, this);
        rightArrow.onInputUp.add(this.right.setUp, this);

        this.cursors.left.onDown.add(this.left.setDown, this);
        this.cursors.left.onUp.add(this.left.setUp, this);
        leftArrow.onInputDown.add(this.left.setDown, this);
        leftArrow.onInputUp.add(this.left.setUp, this);

        this.cursors.up.onDown.add(this.jump.setDown, this);
        this.cursors.up.onUp.add(this.jump.setUp, this);
        jump.onInputDown.add(this.jump.setDown, this);
        jump.onInputUp.add(this.jump.setUp, this);

        return this;
    };

    Game.controller.prototype.constructor = Game.controller;

    Game.controller.prototype.left = {
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

    Game.controller.prototype.right = {
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

    Game.controller.prototype.jump = {
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

})();
