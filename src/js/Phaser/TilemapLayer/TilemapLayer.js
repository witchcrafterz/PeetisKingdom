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

    var cache = {};

    Phaser.TilemapLayer.prototype.generateRegion = function (x, y, width, height, overlay) {
        var bmd = new Phaser.BitmapData(this.game, 'generatedRegion', width, height);
        bmd.context.fillStyle = overlay;

        var tiles = this.getTiles(x, y, width, height);

        var cacheKey = generateCacheKey(tiles);

        if (isEmpty(tiles)) {
            return;
        }

        if (cache[cacheKey]) {
            return cache[cacheKey];
        }

        var tile, set;
        for (var i = 0; i < tiles.length; i++) {
            tile = tiles[i];

            set = this._mc.tilesets[tile.index];
            if (!set)
            {
                set = this.resolveTileset(tile.index);
                if (!set) continue;
            }

            set.draw(bmd.context, tile.worldX - x, tile.worldY - y, tile.index);

            if (overlay) {
                bmd.context.fillRect(tile.worldX - x, tile.worldY - y, tile.width, tile.height);
            }
        }

        cache[cacheKey] = bmd;

        return bmd;
    };

    function isEmpty(tiles) {
        for (var i = 0; i < tiles.length; i++) {
            if (tiles[i].index !== -1) return false;
        }
        return true;
    }

    function generateCacheKey(tiles) {
        var str = '';
        for (var i = 0; i < tiles.length; i++) {
            str += tiles[i].index;
        }
        return str;
    }

})();
