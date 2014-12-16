(function() {
    'use strict';

    Game.DialogueManager = function(game, parent) {
        /**
         * The game instance
         * @type {Phaser.Game}
         */
        this.game = game;

        /**
         * The parent group of the dialogue panel
         * @type {Phaser.Group}
         */
        this.parent = parent;

        /**
         * The easing function to animate the dialogue panel
         * @type {[type]}
         */
        this.easing = Phaser.Easing.Power2;

        /**
         * Height in pixels of dialogue panel
         * @type {Number}
         */
        this.height = 200;

        /**
         * The padding between the title and text
         * @type {Number}
         */
        this.padding = 20;

        /**
         * Whether or not the dialogue panel is hidden
         * @type {Boolean}
         */
        this._hidden = true;

        /**
         * The dialogue panel group, in where the title and text objects are placed
         * @type {Phaser.Group}
         */
        this.dialoguePanel = this.game.add.group(this.parent, 'Dialogue Panel');
        this.dialoguePanel.x = this.game.width * 0.2;
        this.dialoguePanel.width = this.game.width - this.dialoguePanel.x;
        this.dialoguePanel.y = this.game.height;

        /**
         * TODO: Make a general "background" property, ideally in Dialogue object
         * @type {[type]}
         */
        var bg = this.game.add.image(0, 0, 'plank', undefined, this.dialoguePanel);
        bg.anchor.setTo(0.2, 0.4);

        /**
         * The text object of the title
         * @type {Phaser.Text}
         */
        this.titleText = new Phaser.Text(this.game, this.padding, this.padding, 'title');

        /**
         * The text object of the text
         * @type {Phaser.Text}
         */
        this.textText = new Phaser.Text(this.game, this.padding, this.titleText.height + this.padding, 'text');

        /**
         * The current dialogue
         * @type {Game.Dialogue}
         */
        this.currentDialogue = null;

        /**
         * The default title style
         * @type {Object}
         */
        this.defaultTitleStyle = {font: 'bold 24pt Arial'};

        /**
         * The default text style
         * @type {Object}
         */
        this.defaultTextStyle = {font: '20pt Arial'};

        this.dialoguePanel.add(this.titleText);
        this.dialoguePanel.add(this.textText);
        return this;
    };

    Game.DialogueManager.prototype.constructor = Game.DialogueManager;

    Game.DialogueManager.prototype.setDialogue = function(dialogue, autoShow) {
        this.currentDialogue = dialogue;

        autoShow = typeof autoShow === 'undefined' ? true : autoShow;

        if (autoShow) {
            this.hidden = false;
        }

        this.nextSlide();
    };

    Game.DialogueManager.prototype.nextSlide = function() {
        this.currentDialogue.currentSlide++;

        if (this.currentDialogue.currentSlide === this.currentDialogue.conversation.length) {
            this.hidden = true;
        } else {
            this.refreshDialogue();
        }
    };

    Game.DialogueManager.prototype.refreshDialogue = function() {
        this.titleText.text = this.currentDialogue.conversation[this.currentDialogue.currentSlide].title || this.currentDialogue.defaultTitle || '';
        this.titleText.setStyle(this.currentDialogue.conversation[this.currentDialogue.currentSlide].titleStyle || this.currentDialogue.defaultTitleStyle || this.defaultTitleStyle);

        this.textText.text = this.currentDialogue.conversation[this.currentDialogue.currentSlide].text || this.currentDialogue.defaultText || '';
        this.textText.setStyle(this.currentDialogue.conversation[this.currentDialogue.currentSlide].textStyle || this.currentDialogue.defaultTextStyle || this.defaultTextStyle);
        this.textText.y = this.titleText.height + this.padding;
    };

    Object.defineProperty(Game.DialogueManager.prototype, 'hidden', {

        get: function() {
            return this._hidden;
        },

        set: function(value) {
            this._hidden = value;

            if (this._hidden) {
                this.game.add.tween(this.dialoguePanel.position).to({ y: this.game.height }, 1000, this.easing).start();
            } else {
                this.game.add.tween(this.dialoguePanel.position).to({ y: this.game.height - this.height }, 1000, this.easing).start();
            }
        }

    });
})();
