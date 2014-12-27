(function() {
    'use strict';

    Game.GUI.Button = function(game, x, y, key, text, fontKey, callback, callbackContext, overFrame, outFrame, downFrame, upFrame) {
        Phaser.Button.call(this, game, x, y, key, callback, callbackContext, overFrame, outFrame, downFrame, upFrame);

        this._text = text;

        this._bmpText = new Phaser.BitmapText(this.game, 0, 0, fontKey, this._text, 60);
        this._bmpText.align = 'center';
        this.addChild(this._bmpText);

        this.anchor.setTo(0.5);

        this.fontTint = 0x010101;
        this._refresh();
    };

    Game.GUI.Button.prototype = Object.create(Phaser.Button.prototype);
    Game.GUI.Button.prototype.constructor = Game.GUI.Button;

    Game.GUI.Button.prototype._refresh = function() {
        this._bmpText.x = this._bmpText.width * -0.5;
        this._bmpText.y = this._bmpText.height * -0.5;
    };

    Object.defineProperty(Game.GUI.Button.prototype, 'text', {
        get: function() {
            return this._bmpText.text;
        },

        set: function(value) {
            this._bmpText.text = value;
            this._bmpText.updateTransform();
            this._refresh();
        }
    });

    Object.defineProperty(Game.GUI.Button.prototype, 'fontTint', {
        get: function() {
            return this._bmpText.tint;
        },

        set: function(value) {
            this._bmpText.tint = value;
        }
    });

    Object.defineProperty(Game.GUI.Button.prototype, 'fontSize', {
        get: function() {
            return this._bmpText.fontSize;
        },

        set: function(value) {
            this._bmpText.fontSize = value;
            this._bmpText.updateTransform();
            this._refresh();
        }
    });

})();