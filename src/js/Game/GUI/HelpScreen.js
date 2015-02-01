(function() {
    'use strict';

    Game.GUI.HelpScreen = function(game, parent) {
        Phaser.Group.call(this, game, parent, 'HelpScreen');

        /**
         * The padding in pixels between buttons
         * @type {Number}
         */
        this.padding = 20;

        var bmd = this.game.make.bitmapData(this.game.width, this.game.height);
        bmd.fill(0, 0, 0, 0.75);
        /**
         * The pause screen background
         * @type {Phaser}
         */
        this.bg = new Phaser.Image(this.game, 0, 0, bmd);
        this.bg.bmd = bmd;
        this.add(this.bg);

        /**
         * The resume button
         * @type {Game.GUI.Button}
         */
        this.closeHelpBtn = new Game.GUI.Button(this.game, this.game.width, this.padding, 'knapp', 'Close', 'font', this.closeHelp, this);
        this.closeHelpBtn.scale.setTo(0.4);
        this.closeHelpBtn.position.x -= (this.closeHelpBtn.width * 0.5 + 20);
        this.closeHelpBtn.position.y += 40;
        this.add(this.closeHelpBtn);

        this.helpText = 
            'Controls: \n\n' + 
            '      Walk: Left/Right arrow key\n' +
            'Jump/Climb: Spacebar\n' + 
            ' Next Page: Up arrow key';

        this.helpBitmapText = this.game.add.bitmapText(0, this.closeHelpBtn.y + this.closeHelpBtn.height + this.padding, 'font', this.helpText, 32, this);

        this.helpBitmapText.position.x = this.game.width * 0.5 - this.helpBitmapText.width * 0.5;

        this.alpha = 0;
        this.game.add.tween(this).to({alpha: 1}, 300).start();
    };

    Game.GUI.HelpScreen.prototype = Object.create(Phaser.Group.prototype);
    Game.GUI.HelpScreen.prototype.constructor = Game.GUI.HelpScreen;

    Game.GUI.HelpScreen.prototype.closeHelp = function() {
        this.game.add.tween(this).to({alpha: 0}, 300).start().onComplete.add(function() {
            // if (this.game) as the reference to this.game could have been destroyed during the tween
            if (this.game) this.game.state.getCurrentState().closeHelp();
        }, this);
    };

})();
