(function() {
    'use strict';

    Game.MainMenu = function(game) {

    };

    Game.MainMenu.prototype.constructor = Game.MainMenu;

    Game.MainMenu.prototype.preload = function() {
        this.game.load.image('btnPlay', 'assets/knapp_play.png');
        this.game.load.bitmapFont('font', 'assets/bmfont_0.png', 'assets/bmfont.fnt');
    };

    Game.MainMenu.prototype.create = function() {
        if (location.hostname === 'localhost') {
            this.startLevel();
            return;
        }

        this.welcomeText = this.game.add.bitmapText(this.game.width * 0.5, this.game.height * 0.25, 'font', 'Welcome to the spel!', 72);
        this.welcomeText.position.x -= this.welcomeText.width * 0.5;
        this.welcomeText.position.y -= this.welcomeText.height * 0.5;

        this.btnPlay = this.game.add.button(this.game.width * 0.5, this.game.height * 0.5, 'btnPlay', this.startLevel, this);
        this.btnPlay.anchor.setTo(0.5);
    };

    Game.MainMenu.prototype.startLevel = function() {
        this.state.start('Game.Level');
    };

})();
