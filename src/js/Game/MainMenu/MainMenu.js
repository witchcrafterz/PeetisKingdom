(function() {
    'use strict';

    Game.MainMenu = function(game) {

    };

    Game.MainMenu.prototype.constructor = Game.MainMenu;

    Game.MainMenu.prototype.preload = function() {
        this.game.load.image('btnPlay', 'assets/knapp_play.png');
    };

    Game.MainMenu.prototype.create = function() {
        if (location.hostname === 'localhost') {
            this.startLevel();
            return;
        }

        this.welcomeText = this.game.add.text(this.game.width * 0.5, this.game.height * 0.25, 'Welcome to the spel!', {
            font: '60pt monospace',
            fill: 'white'
        });
        this.welcomeText.anchor.setTo(0.5);

        this.btnPlay = this.game.add.button(this.game.width * 0.5, this.game.height * 0.5, 'btnPlay', this.startLevel, this);
        this.btnPlay.anchor.setTo(0.5);
    };

    Game.MainMenu.prototype.startLevel = function() {
        this.state.start('Game.Level');
    };

})();
