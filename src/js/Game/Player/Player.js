(function() {
    'use strict';

    var textureKey = 'player1';

    Game.Player = function(game, x, y) {
        Game.Character.call(this, game, x, y, textureKey);

        this.controller = new Game.Controller.KeyboardController(this.game, this);

        this.animations.add('run', [1, 2, 3, 4], 10);
        this.animations.add('still', [0]);

        return this;
    };

    Game.Player.prototype = Object.create(Game.Character.prototype);
    Game.Player.prototype.constructor = Game.Player;

    Game.Player.prototype.update = function() {
        Game.Character.prototype.update.call(this);

        if (this.states.tryWalking) {
            this.animations.play('run');
        } else if (this.states.still) {
            this.animations.play('still');
        }
    };

})();
