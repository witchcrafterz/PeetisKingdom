(function() {
    'use strict';

    PIXI.BitmapText.prototype.maxWidth = 0;

    /**
     * Renders text and updates it when needed
     *
     * @method updateText
     * @private
     */
    PIXI.BitmapText.prototype.updateText = function()
    {
        var data = PIXI.BitmapText.fonts[this.fontName];
        var pos = new PIXI.Point();
        var prevCharCode = null;
        var chars = [];
        var maxLineWidth = 0;
        var lineWidths = [];
        var line = 0;
        var scale = this.fontSize / data.size;
        var lastSpace = -1;

        for(var i = 0; i < this.text.length; i++)
        {
            var charCode = this.text.charCodeAt(i);

            lastSpace = /(\s)/.test(this.text.charAt(i)) ? i : lastSpace;

            if(/(?:\r\n|\r|\n)/.test(this.text.charAt(i)))
            {
                lineWidths.push(pos.x);
                maxLineWidth = Math.max(maxLineWidth, pos.x);
                line++;

                pos.x = 0;
                pos.y += data.lineHeight;
                prevCharCode = null;
                continue;
            }

            if (lastSpace !== -1 && this.maxWidth && pos.x * scale > this.maxWidth) {
                chars.splice(lastSpace, i - lastSpace);
                i = lastSpace;
                lastSpace = -1;

                lineWidths.push(pos.x);
                maxLineWidth = Math.max(maxLineWidth, pos.x);
                line++;

                pos.x = 0;
                pos.y += data.lineHeight;
                prevCharCode = null;
                continue;         
            }

            var charData = data.chars[charCode];

            if(!charData) continue;

            if(prevCharCode && charData.kerning[prevCharCode])
            {
                pos.x += charData.kerning[prevCharCode];
            }

            chars.push({texture:charData.texture, line: line, charCode: charCode, position: new PIXI.Point(pos.x + charData.xOffset, pos.y + charData.yOffset)});
            pos.x += charData.xAdvance;

            prevCharCode = charCode;
        }

        lineWidths.push(pos.x);
        maxLineWidth = Math.max(maxLineWidth, pos.x);

        var lineAlignOffsets = [];

        for(i = 0; i <= line; i++)
        {
            var alignOffset = 0;
            if(this.style.align === 'right')
            {
                alignOffset = maxLineWidth - lineWidths[i];
            }
            else if(this.style.align === 'center')
            {
                alignOffset = (maxLineWidth - lineWidths[i]) / 2;
            }
            lineAlignOffsets.push(alignOffset);
        }

        var lenChildren = this.children.length;
        var lenChars = chars.length;
        var tint = this.tint || 0xFFFFFF;

        for(i = 0; i < lenChars; i++)
        {
            var c = i < lenChildren ? this.children[i] : this._pool.pop(); // get old child if have. if not - take from pool.

            if (c) c.setTexture(chars[i].texture); // check if got one before.
            else c = new PIXI.Sprite(chars[i].texture); // if no create new one.

            c.position.x = (chars[i].position.x + lineAlignOffsets[chars[i].line]) * scale;
            c.position.y = chars[i].position.y * scale;
            c.scale.x = c.scale.y = scale;
            c.tint = tint;
            if (!c.parent) this.addChild(c);
        }

        // remove unnecessary children.
        // and put their into the pool.
        while(this.children.length > lenChars)
        {
            var child = this.getChildAt(this.children.length - 1);
            this._pool.push(child);
            this.removeChild(child);
        }

        this.textWidth = maxLineWidth * scale;
        this.textHeight = (pos.y + data.lineHeight) * scale;
    };

})();
