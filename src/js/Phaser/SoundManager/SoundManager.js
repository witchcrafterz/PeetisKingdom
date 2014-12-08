Phaser.SoundManager.prototype.toggleMute = function() {
    if (this.mute) {
        this.mute = false;
    } else {
        this.mute = true;
    }
    return this.mute;
};