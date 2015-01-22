/**
 * Needs only to be uncommented if special collision is needed
 */
// // SOURCE: https://github.com/eugenioclrc/super-mean-boy
// /* global Phaser */
// (function() {
//     'use strict';
//     Phaser.Physics.Arcade.Body.prototype.velocityPunish = new Phaser.Point(0, 0);

//     Phaser.Physics.Arcade.prototype.collideSpriteVsTilemapLayer = function(sprite, tilemapLayer, collideCallback, processCallback, callbackContext) {
//         if (!sprite.body) {
//             return;
//         }

//         this._mapData = tilemapLayer.getTiles(
//             sprite.body.position.x - sprite.body.tilePadding.x,
//             sprite.body.position.y - sprite.body.tilePadding.y,
//             sprite.body.width + sprite.body.tilePadding.x,
//             sprite.body.height + sprite.body.tilePadding.y,
//             false, false);

//         if (this._mapData.length === 0) {
//             return;
//         }

//         for (var i = 0, tile, _slope, slopeFunction; i < this._mapData.length; i += 1) {
//             tile = this._mapData[i];

//             if (tile.hasOwnProperty('slopeFunction')) {
//                 slopeFunction = tile.slopeFunction;
//             } else {
//                 _slope = tile.hasOwnProperty('slope') ? tile.slope : Phaser.Physics.Arcade.FULL_SQUARE;
//                 if (!Phaser.Physics.Arcade.SLOPEMAP.hasOwnProperty(_slope)) {
//                     _slope = 'FULL_SQUARE';
//                 }
//                 slopeFunction = Phaser.Physics.Arcade.SLOPEMAP[_slope];
//             }

//             if (slopeFunction.call(this, i, sprite.body, tile)) {
//                 if (processCallback) {
//                     if (processCallback.call(callbackContext, sprite, this._mapData[i])) {
//                         this._total += 1;

//                         if (collideCallback) {
//                             collideCallback.call(callbackContext, sprite, this._mapData[i]);
//                         }
//                     }
//                 } else {
//                     this._total += 1;

//                     if (collideCallback) {
//                         collideCallback.call(callbackContext, sprite, this._mapData[i]);
//                     }
//                 }
//             }
//         }
//     };


//     // Slope tile functions

//     Phaser.Physics.Arcade._collisionFullSquare = function(i, body, tile) {
//         return this.separateTile(i, body, tile);
//     };


//     Phaser.Physics.Arcade.halfRectangleTop = function(i, body, tile) {
//         // check intersection
//         /*var intersects = (body.bottom.right <= tile.worldX);
//         intersects = intersects || (body.bottom <= tile.worldY + (tile.height / 2));
//         intersects = intersects || (body.position.x >= tile.worldX + tile.width);
//         intersects = intersects || (body.position.y >= tile.worldY + (tile.height / 2)); */
//         var intersects = (body.bottom.right <= tile.worldX);
//         intersects = intersects || (body.bottom <= tile.worldY + (tile.height / 2));
//         intersects = intersects || (body.position.x >= tile.worldX + tile.width);
//         intersects = intersects || (body.position.y >= tile.worldY);
//         console.log(intersects);
//         if (!intersects) {
//             return intersects;
//         }


//         this.tileCheckX(body, tile);
//         /*
//         var ox=0;
//         if (!body.blocked.right && body.deltaAbsX() > 0) {
//             ox = body.right - tile.left;
//         } else if (!body.blocked.left && body.deltaAbsX() < 0) {
//             ox = body.x - tile.right;
//         }

//         if (this.TILE_BIAS < Math.abs(ox)) {
//             ox=0;
//         }
        
//         if(ox !== 0){
//             this.processTileSeparationX(body, ox);
//         }
//     */
//         var oy = 0;

//         if (body.deltaY() < 0 && !body.blocked.up) {
//             //  Body is moving UP
//             if (tile.faceBottom && body.y < tile.bottom) {
//                 oy = body.y - tile.bottom + (tile.height / 2);

//                 if (oy < -this.TILE_BIAS) {
//                     oy = 0;
//                 }
//             }
//         } else if (body.deltaY() > 0 && !body.blocked.down && tile.collideUp && body.checkCollision.down) {
//             //  Body is moving DOWN

//             if (tile.faceTop && body.bottom > tile.top) {
//                 oy = body.bottom - tile.top;

//                 if (oy > this.TILE_BIAS) {
//                     oy = 0;
//                 }
//             }
//         }

//         if (oy !== 0) {
//             this.processTileSeparationY(body, oy);
//         }

//     };


//     Phaser.Physics.Arcade._collisionHalfTriangleBottomLeft = function(i, body, tile) {
//         var deltaXY = (tile.worldY + tile.height - body.position.y - body.height) - (tile.worldX + tile.width - body.position.x);

//         if (body.velocity.y > 0 && (tile.worldY + tile.height - body.position.y - body.height) - (tile.worldX + tile.width - body.position.x) <= 0 && (body.position.x) >= tile.left && (body.position.x) <= tile.right) {
//             body.position.y += deltaXY;
//             // body.y = (body.position.x - tile.right) - (body.height - tile.bottom);
//             body.blocked.down = true;
            
//             if (tile.hasOwnProperty('slipperyness')) {
//                 var gravityY = body.game.physics.arcade.gravity.y;
//                 body.velocity.x -= (body.gravity.y || gravityY) * Math.cos(45) * tile.slipperyness;
//             } else if (body.bounce.y === 0) {
//                 // Limit y speed, to prevent falling through
//                 body.velocity.y *= 0.95;
//             } else {
//                 body.velocity.y = Math.sin(45) * -body.velocity.y * body.bounce.y;
//                 body.velocity.x = -Math.cos(45) * body.velocity.y * body.bounce.x;
//             }
//             return false;
//         }
//         return true;
//     };

//     Phaser.Physics.Arcade._collisionHalfTriangleBottomRight = function(i, body, tile) {
//         var deltaXY = (tile.worldY + tile.height - body.position.y - body.height) - (body.position.x + body.width - tile.left);

//         if (body.velocity.y > 0 && deltaXY <= 0 && (body.position.x + body.width) >= tile.left && (body.position.x + body.width) <= tile.right) {
//             body.position.y += deltaXY;
//             body.blocked.down = true;

//             if (tile.hasOwnProperty('slipperyness')) {
//                 var gravityY = body.game.physics.arcade.gravity.y;
//                 body.velocity.x -= (body.gravity.y || gravityY) * Math.cos(45) * tile.slipperyness;
//             }

//             if (body.bounce.y === 0) {
//                 // Limit y speed, to prevent falling through
//                 body.velocity.y *= 0.95;
//             } else {
//                 body.velocity.y = Math.sin(45) * -body.velocity.y * body.bounce.y;
//                 body.velocity.x = Math.cos(45) * body.velocity.y * body.bounce.x;
//             }
//             return false;
//         }

//         return true;
//     };

//     Phaser.Physics.Arcade._collisionRectangleBottom = function(i, body, tile) {
//         var intersects = (body.position.x >= tile.worldX && body.position.x <= tile.worldX + tile.width);

//         if (intersects) {
//             // falling
//             if (body.velocity.y > 0 && (body.bottom >= tile.worldY + tile.height / 2)) {
//                 body.position.y = tile.worldY - tile.height / 2;
//                 body.blocked.down = true;
//             } else {
//                 body.position.y = tile.worldY + tile.height;
//                 body.velocity.y = 0;
//             }
//         }
//     };


//     Phaser.Physics.Arcade._collisionSquareBottomLeft = function(i, body, tile) {
//         var intersects = (body.position.x + body.halfWidth >= tile.worldX && body.position.x <= tile.worldX + tile.width);

//         if (intersects) {
//             // falling
//             if (body.velocity.y > 0 && (body.bottom >= tile.worldY + tile.height / 2)) {
//                 body.position.y = tile.worldY - tile.height / 2;
//                 body.blocked.down = true;
//             } else {
//                 body.position.y = tile.worldY + tile.height;
//                 body.velocity.y = 0;
//             }
//         }
//     };


//     Phaser.Physics.Arcade.SLOPEMAP = {
//         // id: 1
//         'FULL_SQUARE': Phaser.Physics.Arcade._collisionFullSquare,
//         // id: 15
//         'HALF_TRIANGLE_BOTTOM_LEFT': Phaser.Physics.Arcade._collisionHalfTriangleBottomLeft,
//         // id: 17
//         'HALF_TRIANGLE_BOTTOM_RIGHT': Phaser.Physics.Arcade._collisionHalfTriangleBottomRight,
//         // id: 8
//         'RECTANGLE_BOTTOM': Phaser.Physics.Arcade._collisionRectangleBottom,
//     };


// })();