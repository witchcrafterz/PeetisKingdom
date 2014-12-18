(function() {
    'use strict';

    /**
     * An object representing a dialogue
     * @param {Phaser.Game}             game                    The game instance
     * @param {Array#Object | Object}   conversation            An array containing the conversation info for each slide in the dialogue
     * @param {String}                  conversation.title      The title of this slide
     * @param {String}                  conversation.text       The actual text of this slide in the dialogue
     * @param {Phaser.Sprite}           conversation.sprite     The sprite for this slide in the dialogue
     * @param {Phaser.Sprite|String}    conversation.background The background for this silde in the dialogue
     * @param {String}                  conversation.textStyle  The font style of this font in the conversation for the text
     * @param {String}                  conversation.titleStyle The font style of this font in the conversation for the title
     * @param {String}                  title                   Default title if a slide in the conversation does not have one
     * @param {Object}                  textStyle               Default font style if a slide in the conversation does not have one
     * @param {Object}                  titleStyle              Default font style for the title if a slide in the conversation does not have one
     * @param {Phaser.Sprite}           sprite                  Default sprite if a slide in the conversation does not have one
     * @param {Phaser.Sprite|String}    background              Default background if a slide in the conversation does not have one
     */
    Game.Dialogue = function(game, conversation, title, textStyle, titleStyle, sprite, background) {
        this.game = game;

        /**
         * An array containing the conversation info for each slide in the dialogue
         * @type {Array#Object}
         */
        this.conversation = conversation;
        if (conversation.constructor !== Array) {
            this.conversation = [this.conversation];
        }

        /**
         * Amount of slides in the dialogue
         * @type {Number}
         */
        this.nSlides = this.conversation.length;

        /**
         * The current slide in the dialogue. If -1, it has not yet started
         * @type {Number}
         */
        this.currentSlide = -1;

        /**
         * Default title if a slide in the conversation does not have one
         * @type {String}
         */
        this.defaultTitle = title;

        /**
         * Default sprite if a slide in the conversation does not have one
         * @type {String}
         */
        this.defaultSprite = sprite;

        /**
         * Default font style if a slide in the conversation does not have one
         * @type {Object}
         */
        this.defaultTextStyle = textStyle;

        /**
         * Default font style for the title if a slide in the conversation does not have one
         * @type {Object}
         */
        this.defaulTitleStyle = titleStyle;

        /**
         * Default background if a slide in the conversation does not have one
         * @type {Phaser.Sprite|String}
         */
        this.defaultBackground = background;

        return this;
    };

    Game.Dialogue.prototype.constructor = Game.Dialogue;

    

})();
