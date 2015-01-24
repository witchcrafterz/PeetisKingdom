(function() {
    'use strict';

    Phaser.Sound.prototype.playFrom = function(point, marker, position, volume, loop, forceRestart) {
        var distance = point.distance(this.game.state.getCurrentState().p1.position);
        var realVolume = Math.max(0, this.game.width * 0.5 - distance) / (this.game.width * 0.5);
        volume = (volume || 1) * realVolume;

        if (volume === 0) return;

        this.play(marker, position, volume, loop, forceRestart);
    };

    Phaser.SoundManager.prototype.playFrom = function(point, key, volume, loop) {
        var sound = this.add(key, volume, loop);

        sound.playFrom(point);

        return sound;
    };

})();