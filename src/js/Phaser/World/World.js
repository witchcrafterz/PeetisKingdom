(function() {
    'use strict';

    var update = Phaser.World.prototype.update;
    Phaser.World.prototype.update = function() {
        var state = this.game.state.getCurrentState();

        if (state.paused) return;

        update.call(this);
    };

    var postUpdate = Phaser.World.prototype.postUpdate;
    Phaser.World.prototype.postUpdate = function() {
        var state = this.game.state.getCurrentState();

        if (state.paused) return;

        postUpdate.call(this);
    };

    var preUpdate = Phaser.World.prototype.preUpdate;
    Phaser.World.prototype.preUpdate = function() {
        var state = this.game.state.getCurrentState();

        if (state.paused) return;

        preUpdate.call(this);
    };

})();