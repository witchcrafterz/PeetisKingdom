(function() {
    'use strict';

    Phaser.Sound.prototype.playFrom = function(point, marker, position, volume, loop, forceRestart) {
        var distance = point.distance(this.game.camera.position);
        var realVolume = Math.max(0, this.game.camera.width - distance) / this.game.camera.width;
        volume = (volume || 1) * realVolume;

        this.play(marker, position, volume, loop, forceRestart);
    };

    Phaser.SoundManager.prototype.playFrom = function(point, key, volume, loop) {
        var sound = this.add(key, volume, loop);

        sound.playFrom(point);

        return sound;
    };

})();