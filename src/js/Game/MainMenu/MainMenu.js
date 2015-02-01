(function() {
    'use strict';

    Game.MainMenu = function(game) {

    };

    Game.MainMenu.prototype.constructor = Game.MainMenu;

    Game.MainMenu.prototype.preload = function() {
        this.game.load.image('knapp', 'assets/knapp.png');
        this.game.load.bitmapFont('font', 'assets/bmfont_0.png', 'assets/bmfont.fnt');
        this.game.load.image('splash', 'assets/ui/splash.png');
    };

    Game.MainMenu.prototype.create = function() {
        if (location.hostname === 'localhost') {
            this.startLevel();
            return;
        }

        var bmd = this.game.make.bitmapData(this.game.width, this.game.height);
        bmd.processPixelRGB(this.noise, this);
        bmd.dirty = true;

        this.bg = this.game.add.image(0, 0, bmd);
        this.bg.bmd = bmd;

        this.splash = this.game.add.image(0, 0, 'splash');
        this.splash.tint = 0x888888;

        this.btnPlay = new Game.GUI.Button(this.game, this.game.width * 0.5, this.game.height * 0.5, 'knapp', 'Play', 'font', this.startLevel, this);
        this.game.world.add(this.btnPlay);
        this.btnPlay.anchor.setTo(0.5);
    };

    Game.MainMenu.prototype.startLevel = function() {
        this.state.start('Game.Level');
    };

    Game.MainMenu.prototype.noise = function(pixel) {
        var val = ((50 * Math.random())|0);

        pixel.r = val;
        pixel.g = val;
        pixel.b = val;
        pixel.a = 50 + val;

        return pixel;
    };

})();
