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

        this.width = 975;

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
        this.dialoguePanel.y = this.game.height;

        /**
         * The background of the dialogue panel
         * @type {Phaser.Sprite}
         */
        this._background = new Phaser.Sprite(this.game, this.game.width * 0.5 - this.dialoguePanel.x, 0, '');
        this._background.anchor.setTo(0.5, 0);
        this.dialoguePanel.add(this._background);

        /**
         * The text object of the title
         * @type {Phaser.Text}
         */
        this.titleText = new Phaser.BitmapText(this.game, 0, 0, 'font', 'title', 50);
        this.titleText.tint = 0x010101;
        this.titleText.y = this.padding;

        /**
         * The default font size of the text body
         * @type {Number}
         */
        this.defaultTextFontSize = this.titleText.fontSize * 0.8;

        /**
         * The text object of the text
         * @type {Phaser.Text}
         */
        this.textText = new Phaser.BitmapText(this.game, 0, 0, 'font', 'text', this.defaultTextFontSize);
        this.textText.tint = 0x010101;

        /**
         * The text object that shows page number
         * @type {Phaser.Text}
         */
        this.pageText = new Phaser.BitmapText(this.game, 0, 0, 'font', '0/0', this.titleText.fontSize * 0.6);
        this.pageText.tint = 0x010101;

        /**
         * The current dialogue
         * @type {Game.Dialogue}
         */
        this.currentDialogue = null;

        /**
         * The default title style
         * @type {Object}
         */
        this.defaultTitleStyle = {font: 'bold 24pt serif'};

        /**
         * The default text style
         * @type {Object}
         */
        this.defaultTextStyle = {font: '20pt serif'};

        /**
         * The default background for the dialogue panel
         * @type {String}
         */
        this.defaultBackground = 'dialoguePanel';

        this.dialoguePanel.add(this.titleText);
        this.dialoguePanel.add(this.textText);
        this.dialoguePanel.add(this.pageText);

        return this;
    };

    Game.DialogueManager.prototype.constructor = Game.DialogueManager;

    Game.DialogueManager.prototype.setDialogue = function(dialogue, autoShow, reset) {
        if (this.currentDialogue) {
            this.currentDialogue.isOpen = false;
        }

        this.currentDialogue = dialogue;

        autoShow = typeof autoShow !== 'undefined' ? autoShow : true;
        reset = typeof reset !== 'undefined' ? reset : true;


        if (reset === true) {
            this.currentDialogue.currentSlide = -1;
        }

        if (autoShow) {
            this.hidden = false;
        }

        this.nextSlide();
    };

    Game.DialogueManager.prototype.nextSlide = function() {
        if (!this.currentDialogue) return;

        this.currentDialogue.currentSlide++;

        if (this.currentDialogue.currentSlide === this.currentDialogue.conversation.length) {
            this.hidden = true;
            this.currentDialogue.currentSlide = -1;
        } else {
            this.refreshDialogue();
        }

        this.currentDialogue.isOpen = !this.hidden;
    };

    Game.DialogueManager.prototype.refreshDialogue = function() {
        var currentSlide = this.currentDialogue.conversation[this.currentDialogue.currentSlide];

        this.titleText.text = currentSlide.title || this.currentDialogue.defaultTitle || '';

        this.textText.text = currentSlide.text || this.currentDialogue.defaultText || '';
        this.textText.fontSize = currentSlide.fontSize || currentSlide.fontScale * this.defaultTextFontSize || this.defaultTextFontSize;
        this.textText.y = this.height * 0.5;

        var newBG = currentSlide.background || this.currentDialogue.defaultBackground || this.defaultBackground;
        if (this._background.key !== newBG) {
            this._background.loadTexture(newBG);

            if (!this.hidden) {
                this.hidden = false;
            }
        }

        this.pageText.text = 'Page {0}/{1}'.format(this.currentDialogue.currentSlide + 1, this.currentDialogue.conversation.length);
        this.pageText.updateTransform();
        this.pageText.y = this.height;
        this.pageText.x = this.width - this.pageText.width;
    };

    Object.defineProperty(Game.DialogueManager.prototype, 'hidden', {

        get: function() {
            return this._hidden;
        },

        set: function(value) {
            this._hidden = value;

            if (this._hidden) {
                var add = this.padding;

                this.game.add.tween(this.dialoguePanel.position)
                    .to({ y: this.game.height + add }, 1000, this.easing)
                    .start()
                    .onComplete.add(function() {

                        if (this._hidden) {
                            this.dialoguePanel.visible = false;
                        }
                    }, this);
            } else {
                this.dialoguePanel.visible = true;
                this.game.add.tween(this.dialoguePanel.position).to({ y: this.game.height - this.dialoguePanel.height - this.padding }, 1000, this.easing).start();
            }
        }

    });
})();
