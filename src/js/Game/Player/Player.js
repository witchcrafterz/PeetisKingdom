(function() {
    'use strict';

    var textureKey = 'player1';

    Game.Player = function(game, x, y) {
        Game.Character.call(this, game, x, y, textureKey);

        this.controller = new Game.Controller.KeyboardController(this.game, this);

        return this;
    };

    Game.Player.prototype = Object.create(Game.Character.prototype);
    Game.Player.prototype.constructor = Game.Player;

})();
