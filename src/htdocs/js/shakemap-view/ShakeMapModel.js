const Model = require('hazdev-webutils/src/mvc/Model'),
        Util = require('hazdev-webutils/src/util/Util');

var ShakeMapModel = function(options) {
    var _this;

    _this = Model(Util.extend({},
        {eventUrl: 'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2014-01-01&endtime=2014-01-06&producttype=shakemap',
            productUrl: '/products/{productId}/{productName}',
            events: [],
            loading: false},
			options));

    return _this;
};

module.exports = ShakeMapModel;