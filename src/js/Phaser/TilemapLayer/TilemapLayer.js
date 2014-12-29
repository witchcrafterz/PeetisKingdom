(function() {
    'use strict';

    Phaser.TilemapLayer.prototype.renderRegion = function (scrollX, scrollY, left, top, right, bottom) {

        var context = this.context;

        var width = this.layer.width;
        var height = this.layer.height;
        var tw = this._mc.tileWidth;
        var th = this._mc.tileHeight;

        var tilesets = this._mc.tilesets;
        var lastAlpha = NaN;

        if (!this._wrap)
        {
            if (left <= right) // Only adjust if going to render
            {
                left = Math.max(0, left);
                right = Math.min(width - 1, right);
            }
            if (top <= bottom)
            {
                top = Math.max(0, top);
                bottom = Math.min(height - 1, bottom);
            }
        }
       
        // top-left pixel of top-left cell
        var baseX = (left * tw) - scrollX;
        var baseY = (top * th) - scrollY;

        // Fix normStartX/normStartY such it is normalized [0..width/height). This allows a simple conditional and decrement to always keep in range [0..width/height) during the loop. The major offset bias is to take care of negative values.
        var normStartX = (left + ((1 << 20) * width)) % width;
        var normStartY = (top + ((1 << 20) * height)) % height;

        // tx/ty - are pixel coordinates where tile is drawn
        // x/y - is cell location, normalized [0..width/height) in loop
        // xmax/ymax - remaining cells to render on column/row
        var tx, ty, x, y, xmax, ymax;

        context.fillStyle = this.tileColor;

        for (y = normStartY, ymax = bottom - top, ty = baseY;
            ymax >= 0;
            y++, ymax--, ty += th)
        {

            if (y >= height) { y -= height; }

            var row = this.layer.data[y];

            for (x = normStartX, xmax = right - left, tx = baseX;
                xmax >= 0;
                x++, xmax--, tx += tw)
            {

                if (x >= width) { x -= width; }

                var tile = row[x];
                if (!tile || tile.index < 0)
                {
                    continue;
                }

                var index = tile.index;

                var set = tilesets[index];
                if (set === undefined)
                {
                    set = this.resolveTileset(index);
                }

                //  Setting the globalAlpha is "surprisingly expensive" in Chrome (38)
                if (tile.alpha !== lastAlpha && !this.debug)
                {
                    context.globalAlpha = tile.alpha;
                    lastAlpha = tile.alpha;
                }

                if (set)
                {
                    set.draw(context, tx, ty, index);
                    if (this.overlay) {
                        this.context.fillStyle = this.overlay;
                        context.fillRect(tx, ty, tw, th);
                        this.context.fillStyle = this.tileColor;
                    }
                }
                else if (this.debugSettings.missingImageFill)
                {
                    context.fillStyle = this.debugSettings.missingImageFill;
                    context.fillRect(tx, ty, tw, th);
                }

                if (tile.debug && this.debugSettings.debuggedTileOverfill)
                {
                    context.fillStyle = this.debugSettings.debuggedTileOverfill;
                    context.fillRect(tx, ty, tw, th);
                }
               
            }

        }

    };
})();
