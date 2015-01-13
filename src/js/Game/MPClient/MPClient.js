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

        this.connect();
        this.setEvents();
    };

    Game.MPClient.prototype.constructor = Game.MPClient;

    Game.MPClient.prototype.connect = function() {
        this.socket = io(this.url);
    };

    Game.MPClient.prototype.sendPosition = function() {
        var p1 = this.game.state.getCurrentState().p1;

        var pos = {
            x: p1.position.x,
            y: p1.position.y
        };

        this.socket.emit('position', { position: pos });

        setTimeout(bind(this, this.sendPosition), 50);
    };

    Game.MPClient.prototype.setEvents = function() {
        this.socket.on('id', bind(this, this.onID));
        this.socket.on('new', bind(this, this.onNew));
        this.socket.on('delete', bind(this, this.onDelete));
        this.socket.on('position', bind(this, this.onPosition));
    };

    Game.MPClient.prototype.onID = function(data) {
        this.id = data.id;

        var state = this.game.state.getCurrentState();
        var p1 = state.p1;
        var pos = {
            x: p1.position.x,
            y: p1.position.y
        };
        var key = p1.key;

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

})();