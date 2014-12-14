(function() {
    'use strict';

    function prepareRegex(index) {
        return new RegExp('\\{' + index.toString() + '}', 'g');
    }

    function format(str, args) {
        _.forEach(args, function(arg, index) {
            str = str.replace(prepareRegex(index), arg);
        });
        return str;
    }

    String.prototype.format = function(args) {
        if (args.constructor === Array) {
            return format(this, args);
        } else {
            return format(this, arguments);
        }
    };

})();