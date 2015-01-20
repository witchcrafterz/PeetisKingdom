(function() {
    'use strict';

    var torchCache = {};

    Game.Shadow = function(game) {
        this.shadowTexture = game.add.bitmapData(game.width, game.height);
        Phaser.Image.call(this, game, 0, 0, this.shadowTexture);
        this.fixedToCamera = true;

        this.blendMode = Phaser.blendModes.LUMINOSITY;

        this.shadowTexture.fill(0, 0, 0, 0.1);
    };

    Game.Shadow.prototype = Object.create(Phaser.Image.prototype);
    Game.Shadow.prototype.constructor = Game.Shadow;


    Game.Torch = function(game, x, y, radius, fade, value, r, g, b) {
        this.torchTexture = torchCache[radius + '' + fade] ? torchCache[radius] : Game.Torch.createRadial(game, radius, fade, value, r, g, b);
        Phaser.Image.call(this, game, x, y, this.torchTexture);

        this.anchor.setTo(0.5);

        this.blendMode = Phaser.blendModes.ADD;
        this.alpha = 0.5;
    };

    Game.Torch.prototype = Object.create(Phaser.Image.prototype);
    Game.Torch.prototype.constructor = Game.Torch;

    Game.Torch.createRadial = function(game, radius, fade, value, r, g, b) {
        radius = radius || 200;
        fade = fade || 0.1;
        r = r || 255;
        g = g || 150;
        b = b || 100;

        value = value || 20;

        var bitmapData = new Phaser.BitmapData(game, 'radial' + radius, radius * 2, radius * 2);

        var gradient = bitmapData.context.createRadialGradient(
            radius, radius, radius * fade,
            radius, radius, radius);
        gradient.addColorStop(0, 'rgba({0}, {1}, {2}, 1.0)'.format(r, g, b));
        gradient.addColorStop(1, 'rgba({0}, {1}, {2}, 0.0)'.format(r, g, b));

        bitmapData.circle(radius, radius, radius, gradient);

        /// turn off image aliasing
        bitmapData.context.mozImageSmoothingEnabled = false;
        bitmapData.context.webkitImageSmoothingEnabled = false;
        bitmapData.context.imageSmoothingEnabled = false; 

        var bmd = new Phaser.BitmapData(game, 'radialSmall' + radius, radius * 2 / value, radius * 2 / value);
        bmd.context.drawImage(bitmapData.canvas, 0, 0, bmd.width, bmd.height);

        bitmapData.context.drawImage(bmd.canvas, 0, 0, bitmapData.width, bitmapData.height);

        torchCache[radius.toString() + fade.toString() + r.toString() + g.toString() + b.toString() + value.toString()] = bitmapData;

        return bitmapData;
    };

})();