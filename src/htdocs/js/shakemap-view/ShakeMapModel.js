const Model = require('hazdev-webutils/src/mvc/Model'),
        Util = require('hazdev-webutils/src/util/Util');

var ShakeMapModel = function(options) {
    var _this;

    _this = Model(Util.extend({},
			{},
			options));

    return _this;
};

module.exports = ShakeMapModel;