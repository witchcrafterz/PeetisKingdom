(function() {

    function bind(context, func) {
        return function() {
            func.apply(context, arguments);
        };
    }

    Game.MPClient = function(game, url) {
        /**
         * The phaser game instance
         * @type {Phaser.Game}
         */
        this.game = game;

        /**
         * The servers URL
         * @type {String}
         */
        this.url = url;

        /**
         * This clients ID
         * @type {String}
         */
        this.id = undefined;

        /**
         * [socket description]
         * @type {IO.Socket}
         */
        this.socket = undefined;

        /**
         * A collection containing all characters created by the server
         * @type {Object}
         */
        this.characters = {};

        this.state = this.game.state.getCurrentState();
        this.p1 = this.state.p1;

        this.connect();
        this.setEvents();
    };

    Game.MPClient.prototype.constructor = Game.MPClient;

    Game.MPClient.prototype.connect = function() {
        this.socket = new io(this.url, {'force new connection': true});
    };

    Game.MPClient.prototype.sendPosition = function() {
        var pos = {
            x: this.p1.position.x,
            y: this.p1.position.y
        };

        this.socket.emit('action', { position: pos });

        setTimeout(bind(this, this.sendPosition), 500);
    };

    Game.MPClient.prototype.setEvents = function() {
        this.socket.on('id', bind(this, this.onID));
        this.socket.on('new', bind(this, this.onNew));
        this.socket.on('delete', bind(this, this.onDelete));
        this.socket.on('position', bind(this, this.onPosition));
        this.socket.on('action', bind(this, this.onAction));

        this.bindController();
    };
    
    Game.MPClient.prototype.bindController = function() {
        this.p1.controller.down.onDown.add(this.sendController, this);
        this.p1.controller.down.onUp.add(this.sendController, this);

        this.p1.controller.left.onDown.add(this.sendController, this);
        this.p1.controller.left.onUp.add(this.sendController, this);

        this.p1.controller.right.onDown.add(this.sendController, this);
        this.p1.controller.right.onUp.add(this.sendController, this);

        this.p1.controller.jump.onDown.add(this.sendController, this);
        this.p1.controller.jump.onUp.add(this.sendController, this);
    };

    Game.MPClient.prototype.unbindController = function() {
        this.p1.controller.down.onDown.remove(this.sendController, this);
        this.p1.controller.down.onUp.remove(this.sendController, this);

        this.p1.controller.left.onDown.remove(this.sendController, this);
        this.p1.controller.left.onUp.remove(this.sendController, this);

        this.p1.controller.right.onDown.remove(this.sendController, this);
        this.p1.controller.right.onUp.remove(this.sendController, this);

        this.p1.controller.jump.onDown.remove(this.sendController, this);
        this.p1.controller.jump.onUp.remove(this.sendController, this);
    };

    Game.MPClient.prototype.sendController = function(key, state) {
        var action = {};
        action[key] = state;
        this.socket.emit('action', action);
    };

    Game.MPClient.prototype.onID = function(data) {
        this.id = data.id;

        var pos = {
            x: this.p1.position.x,
            y: this.p1.position.y
        };
        var key = this.p1.key;

        this.socket.emit('new', { position: pos, texture: key });
        this.sendPosition();
    };

    Game.MPClient.prototype.onNew = function(data) {
        if (data.id === this.id) return;

        var controller = new Game.Controller(this.game);

        var character = new Game.Character(this.game, data.position.x, data.position.y, data.texture || 'grasshopper', controller);
        this.game.entitiesGroup.add(character);

        this.characters[data.id] = character;
    };

    Game.MPClient.prototype.onDelete = function(data) {
        if (data.id === this.id) return;

        var character = this.characters[data.id];
        this.game.entitiesGroup.remove(character, true);

        this.characters[data.id] = null;
    };

    Game.MPClient.prototype.onPosition = function(data) {
        if (data.id === this.id) return;

        var character = this.characters[data.id];

        if (!character) return;

        character.position.setTo(data.position.x, data.position.y);
    };

    Game.MPClient.prototype.onAction = function(data) {

        _.forEach(data, function(actions, id) {
            if (id === this.id) return;
            var character = this.characters[id];

            _.forEach(actions, function(action) {
                var type = _.keys(action)[0];
                var value = action[type];
                switch (type) {
                    case 'left':
                    case 'up':
                    case 'down':
                    case 'right':
                    case 'jump':
                        if (value) {
                            character.controller[type].setDown();
                        } else {
                            character.controller[type].setUp();
                        }
                        break;
                    case 'position':
                        if (character.position.distance(value) > 100) {
                            this.game.add.tween(character.position).to(value, 100).start();
                        }
                }
            }, this);
        }, this);

    };

    Game.MPClient.prototype.disconnect = function() {
        _.forEach(this.characters, function(character) {
            this.game.entitiesGroup.remove(character, true);
        }, this);

        this.unbindController();
        this.characters = null;

        this.socket.disconnect();
        this.socket = null;
    };

})();