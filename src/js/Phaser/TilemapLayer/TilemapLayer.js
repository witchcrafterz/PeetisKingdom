// (function() {
//     'use strict';

    Phaser.TilemapLayer.prototype.resizeWorld = function () {
        this.game.world.setBounds(0, 0, this.layer.widthInPixels * this.scale.x, this.layer.heightInPixels * this.scale.y);
    };

    Phaser.TilemapLayer.prototype.postUpdate = function (x, y, width, height, collides, interestingFace) {
        Phaser.Image.prototype.postUpdate.call(this);

        //  Stops you being able to auto-scroll the camera if it's not following a sprite
        var camera = this.game.camera;
        this.scrollX = camera.x * this.scrollFactorX / this.scale.x;
        this.scrollY = camera.y * this.scrollFactorY / this.scale.y;

        this.render();

        //  Fixed to Camera?
        if (this._cache[7] === 1)
        {
            this.position.x = (camera.view.x + this.cameraOffset.x) / camera.scale.x;
            this.position.y = (camera.view.y + this.cameraOffset.y) / camera.scale.y;
        }

    };

    Phaser.TilemapLayer.prototype.getTiles = function (x, y, width, height, collides, interestingFace) {

        //  Should we only get tiles that have at least one of their collision flags set? (true = yes, false = no just get them all)
        if (typeof collides === 'undefined') { collides = false; }
        if (typeof interestingFace === 'undefined') { interestingFace = false; }

        var fetchAll = !(collides || interestingFace);

        //  Adjust the x,y coordinates for scrollFactor
        x = this._fixX(x);
        y = this._fixY(y);

        //  Convert the pixel values into tile coordinates
        var tx = Math.floor(x / (this.scale.x * this._mc.cw));
        var ty = Math.floor(y / (this.scale.y * this._mc.ch));
        //  Don't just use ceil(width/cw) to allow account for x/y diff within cell
        var tw = Math.ceil((x + width) / (this.scale.x * this._mc.cw)) - tx;
        var th = Math.ceil((y + height) / (this.scale.x * this._mc.ch)) - ty;


        while (this._results.length)
        {
            this._results.pop();
        }

        for (var wy = ty; wy < ty + th; wy++)
        {
            for (var wx = tx; wx < tx + tw; wx++)
            {
                var row = this.layer.data[wy];
                if (row && row[wx])
                {
                    if (fetchAll || row[wx].isInteresting(collides, interestingFace))
                    {
                        this._results.push(row[wx]);
                    }
                }
            }
        }

        return this._results;
    };

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

    /**
     * This method will set the scale of the tilemap as well as update the underlying block data of this layer
     * 
     * @method Phaser.TilemapLayer#setScale
     * @param {number} [xScale=1] - The scale factor along the X-plane 
     * @param {number} [yScale] - The scale factor along the Y-plane
     */
    Phaser.TilemapLayer.prototype.setScale = function(xScale, yScale) {
        xScale = xScale || 1;
        yScale = yScale || xScale;

        for (var y = 0; y < this.layer.data.length; y++)
        {
            var row = this.layer.data[y];

            for (var x = 0; x < row.length; x++)
            {
                var tile = row[x];

                tile.width = this.map.tileWidth * xScale;
                tile.height = this.map.tileHeight * yScale;

                tile.worldX = tile.x * tile.width;
                tile.worldY = tile.y * tile.height;
            }
        }

        this.scale.setTo(xScale, yScale);
    };

//     var cache = {};

//     Phaser.TilemapLayer.prototype.generateRegion = function (x, y, width, height, overlay) {
//         var bmd = new Phaser.BitmapData(this.game, 'generatedRegion', width, height);
//         bmd.context.fillStyle = overlay;

//         var tiles = this.getTiles(x, y, width, height);

//         var cacheKey = generateCacheKey(tiles, overlay);

//         if (isEmpty(tiles)) {
//             return;
//         }

//         if (cache[cacheKey]) {
//             return cache[cacheKey];
//         }

//         var tile, set;
//         for (var i = 0; i < tiles.length; i++) {
//             tile = tiles[i];

//             set = this._mc.tilesets[tile.index];
//             if (!set)
//             {
//                 set = this.resolveTileset(tile.index);
//                 if (!set) continue;
//             }

//             set.draw(bmd.context, tile.worldX - x, tile.worldY - y, tile.index);

//             if (overlay) {
//                 bmd.context.fillRect(tile.worldX - x, tile.worldY - y, tile.width, tile.height);
//             }
//         }

//         cache[cacheKey] = bmd;

//         return bmd;
//     };

//     function isEmpty(tiles) {
//         for (var i = 0; i < tiles.length; i++) {
//             if (tiles[i].index !== -1) return false;
//         }
//         return true;
//     }

//     function generateCacheKey(tiles, overlay) {
//         var str = String(overlay);
//         for (var i = 0; i < tiles.length; i++) {
//             str += tiles[i].index;
//         }
//         return str;
//     }

// })();
