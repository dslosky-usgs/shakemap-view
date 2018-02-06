require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var View = require('hazdev-webutils/src/mvc/View'),
    Xhr = require('util/Xhr');

var EventView = function EventView(options) {
    var _this, _initialize;

    _this = View(options);

    _initialize = function _initialize() /*options*/{
        _this.el.innerHTML = '' + '<div class="loadButton">Refresh List</div>';
        _this.el.eventList = [];

        _this.model.on('change:events', _this.renderEvents);
        _this.loadButton = _this.el.querySelector('.loadButton');
        _this.loadButton.addEventListener('click', _this.getEvents);

        _this.getEvents();
    };

    _this.renderEvents = function () {
        var eventHtml = '';
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = _this.model.get('events')[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var _event = _step.value;

                eventHtml += '<div class="event">' + _event.id + '</div>';
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        _this.el.innerHTML = '<div class="event-list">' + eventHtml + '</div>' + '<div class="loadButton">Refresh List</div>';

        _this.loadButton = _this.el.querySelector('.loadButton');
        _this.loadButton.addEventListener('click', _this.getEvents);

        _this.events = _this.el.querySelectorAll('.event');
        if (_this.events) {
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = _this.events[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var event = _step2.value;

                    event.addEventListener('click', _this.loadEvent);
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }
        }
    };

    _this.getEvents = function () {
        _this.model.set({
            loading: true
        });

        Xhr.ajax({
            url: _this.model.get('productsUrl'),
            success: function success(json) {
                _this.model.set({
                    events: json
                });
            },
            error: function error() {
                _this.model.set({
                    events: []
                });
            },
            done: function done() {
                _this.model.set({
                    loading: false
                });
            }
        });
    };

    _this.loadEvent = function (e) {
        var eventDiv = e.toElement;
        var eventId = eventDiv.innerText;

        var eventData = null;
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
            for (var _iterator3 = _this.model.get('events')[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var eventJson = _step3.value;

                if (eventJson['id'] === eventId) {
                    eventData = eventJson;
                    break;
                }
            }
        } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                    _iterator3.return();
                }
            } finally {
                if (_didIteratorError3) {
                    throw _iteratorError3;
                }
            }
        }

        if (eventData) {
            _this.model.set({
                'event': eventData
            });
        }
    };

    _initialize(options);
    options = null;
    return _this;
};

module.exports = EventView;

},{"hazdev-webutils/src/mvc/View":"mvc/View","util/Xhr":"util/Xhr"}],2:[function(require,module,exports){
'use strict';

var View = require('hazdev-webutils/src/mvc/View');

var LoadingView = function LoadingView(options) {
    var _this, _initialize;

    _this = View(options);

    _initialize = function _initialize() /*options*/{
        _this.loadingCount = 0;
        _this.el.innerHTML = '<div class="loading">Loading...</div>';
        _this.model.on('change:loading', _this.changeLoading);
    };

    _this.changeLoading = function () {
        if (_this.model.get('loading') === true) {

            // add loading class to make loading div visible
            if (_this.loadingCount === 0) {
                _this.el.classList.add('loading-content');
            }
            _this.loadingCount += 1;
        } else {
            _this.loadingCount -= 1;

            // if nothing is loading, hide the div
            if (_this.loadingCount === 0) {
                _this.el.classList.remove('loading-content');
            }

            // reset loading count if it drops below zero
            if (_this.loadingCount < 0) {
                _this.loadingCount = 0;
            }
        }
    };

    _initialize(options);
    options = null;
    return _this;
};

module.exports = LoadingView;

},{"hazdev-webutils/src/mvc/View":"mvc/View"}],3:[function(require,module,exports){
/* global L */
'use strict';

var View = require('hazdev-webutils/src/mvc/View');
var Generator = require('shakemap-view/maps/layers/Generator');

var MapView = function MapView(options) {
    var _this, _initialize;

    _this = View(options);

    _initialize = function _initialize() /*options*/{
        _this.el.innerHTML = '<div class="map" style="height:100%;width:100%"></div>';
        _this.defaultLayers = _this.model.get('defaultLayers');
        var mapEl = _this.el.querySelector('.map');

        _this.map = L.map(mapEl, {
            scrollWheelZoom: false
        }).setView([51.505, -0.09], 13);

        _this.layerGenerator = Generator(options);
        _this.baseLayer = _this.genBaseLayer();
        _this.layersControl = L.control.layers({ 'Basemap': _this.baseLayer }).addTo(_this.map);

        _this.model.on('change:event', _this.renderEventLayers);
        _this.model.on('change:layers', _this.addMapLayers);
        window.addEventListener('layersFinished', _this.addMapLayers);
    };

    _this.genBaseLayer = function () {
        var baselayer = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + 'pk.eyJ1IjoiZHNsb3NreSIsImEiOiJjaXR1aHJnY3EwMDFoMnRxZWVtcm9laWJmIn0.1C3GE0kHPGOpbVV9kTxBlQ', {
            maxZoom: 18,
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' + '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' + 'Imagery � <a href="http://mapbox.com">Mapbox</a>',
            id: 'mapbox.streets'
        }).addTo(_this.map);

        return baselayer;
    };

    _this.renderEventLayers = function () {
        // clear map
        _this.clearMapLayers();

        // generate new layers
        _this.baseLayer = _this.genBaseLayer();
        var event = _this.model.get('event');

        _this.layerGenerator.generateLayers(event);
        _this.layersControl = L.control.layers({ 'Basemap': _this.baseLayer }).addTo(_this.map);
    };

    _this.addMapLayers = function (e) {
        // clear map
        _this.clearMapLayers();

        // collect layers
        _this.baseLayer = _this.genBaseLayer();
        var layers = e.detail;

        _this.layersControl = L.control.layers({ 'Basemap': _this.baseLayer }, layers).addTo(_this.map);

        var layerArr = [];
        for (var layer in layers) {
            if (_this.defaultLayers.indexOf(layer) > -1) {
                layers[layer].addTo(_this.map);
            }
            layerArr.push(layers[layer]);
        }

        var group = L.featureGroup(layerArr);
        _this.map.fitBounds(group.getBounds().pad(0.5));
    };

    _this.clearMapLayers = function () {
        _this.map.eachLayer(function (layer) {
            _this.map.removeLayer(layer);
        });

        _this.layersControl.removeFrom(_this.map);
    };

    _initialize(options);
    options = null;
    return _this;
};

module.exports = MapView;

},{"hazdev-webutils/src/mvc/View":"mvc/View","shakemap-view/maps/layers/Generator":4}],4:[function(require,module,exports){
'use strict';

var events = require('shakemap-view/maps/layers/events'),
    View = require('hazdev-webutils/src/mvc/View');

var layersIn = [require('shakemap-view/maps/layers/epicenter'), require('shakemap-view/maps/layers/cont_pga')];

var Generator = function Generator(options) {
    var _this, _initialize;

    _this = View(options);

    _initialize = function _initialize() /*options*/{
        _this.layerCount = 0;
        _this.layers = {};
        _this.layersIn = layersIn;
        window.addEventListener('layerFinished', _this.addLayer);
    };

    _this.generateLayers = function (event) {
        _this.layerCount = 0;
        _this.layers = {};
        if (event) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = _this.layersIn[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var rawLayer = _step.value;

                    rawLayer.generateLayer(event);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }
    };

    _this.addLayer = function (e) {
        var layer = e.detail;

        // collect layers that rendered successfully
        if (layer.layer) {
            _this.layers[layer.name] = layer.layer;
        }

        // Keep track of all layers that have returned
        _this.layerCount += 1;

        // set the model if all the layers are ready
        if (_this.layerCount === _this.layersIn.length) {
            events.layersFinishedEvent(_this.layers);
        }
    };

    _initialize(options);
    options = null;
    return _this;
};

module.exports = Generator;

},{"hazdev-webutils/src/mvc/View":"mvc/View","shakemap-view/maps/layers/cont_pga":5,"shakemap-view/maps/layers/epicenter":6,"shakemap-view/maps/layers/events":7}],5:[function(require,module,exports){
/* global L */
'use strict';

var Xhr = require('util/Xhr');
var events = require('shakemap-view/maps/layers/events');

var layer = { id: 'download/cont_pga.json' };
layer.name = 'PGA Contours';
layer.generateLayer = function (event) {
    layer.layer = null;
    var product = null;
    var contents = event.shakemap[0].contents;

    for (var p in contents) {
        if (p === layer.id) {
            product = contents[p];
            break;
        }
    }

    if (product) {
        Xhr.ajax({
            url: product.url,
            success: function success(json) {
                layer['layer'] = L.geoJson(json);
                events.layerFinishedEvent(layer);
            },
            error: function error() {
                events.layerFinishedEvent(layer);
            },
            done: function done() {}
        });
    } else {
        events.layerFinishedEvent(layer);
    }
};

module.exports = layer;

},{"shakemap-view/maps/layers/events":7,"util/Xhr":"util/Xhr"}],6:[function(require,module,exports){
/* global L */
'use strict';

var events = require('shakemap-view/maps/layers/events'),
    Xhr = require('util/Xhr');

var layer = { productId: 'download/grid.xml' };
layer.generateLayer = function (event) {
    var product = null;
    var contents = event.shakemap[0].contents;

    for (var p in contents) {
        if (p === layer.productId) {
            product = contents[p];
            break;
        }
    }

    if (product) {
        Xhr.ajax({
            url: product.url,
            success: function success(xml) {
                var parser = new DOMParser();
                var xmlDoc = parser.parseFromString(xml, 'text/xml');
                var lat, lon, popupHtml;

                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = xmlDoc.getElementsByTagName('shakemap_grid')[0].childNodes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var node = _step.value;

                        if (node.nodeName === 'event') {
                            lat = node.getAttribute('lat');
                            lon = node.getAttribute('lon');

                            popupHtml = '<table>' + '<tr><th>' + node.getAttribute('event_id') + '</th></tr>' + '<tr><table><th>Magnitude:</th><td>' + node.getAttribute('magnitude') + '</td></table></tr>' + '<tr><table><th>Depth:</th><td>' + node.getAttribute('depth') + '</td></table></tr>' + '<tr><table><th>Location:</th><td>' + node.getAttribute('lat') + ', ' + node.getAttribute('lon') + '</td></table></tr>' + '</table>';
                            break;
                        }
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }

                layer['layer'] = L.marker([lat, lon]).bindPopup(popupHtml).openPopup();
                events.layerFinishedEvent(layer);
            },
            error: function error() {
                events.layerFinishedEvent(layer);
            },
            done: function done() {}
        });
    }
};

layer.name = 'Epicenter';

module.exports = layer;

},{"shakemap-view/maps/layers/events":7,"util/Xhr":"util/Xhr"}],7:[function(require,module,exports){
'use strict';

var layerFinishedEvent = function layerFinishedEvent(layer) {
    var evt = new CustomEvent('layerFinished', { detail: layer });
    window.dispatchEvent(evt);
};

var layersFinishedEvent = function layersFinishedEvent(layers) {
    var evt = new CustomEvent('layersFinished', { detail: layers });
    window.dispatchEvent(evt);
};

var events = { layersFinishedEvent: layersFinishedEvent,
    layerFinishedEvent: layerFinishedEvent };

module.exports = events;

},{}],"math/Camera":[function(require,module,exports){
'use strict';

var Matrix = require('./Matrix'),
    Vector = require('./Vector'),
    Util = require('util/Util');


var _DEFAULTS = {
  lookAt: [0, 0, 0],
  origin: [100, 100, 100],
  up: [0, 0, 1]
};


/**
 * Camera defines a coordinate translation from World coordinates (X, Y, Z)
 * to Camera coordinates (x, y, z).
 *
 * After projection:
 *     +z is to lookAt from camera
 *     +x is right from camera
 *     +y is up from camera
 *
 * @param options {Object}
 * @param options.origin {Array<Number>}
 *        default [100, 100, 100].
 *        position of camera in world coordinates.
 * @param options.lookAt {Array<Number>}
 *        default [0, 0, 0].
 *        position for camera to look at in world coordinates.
 * @param options.up {Array<Number>}
 *        default [0, 0, 1].
 *        vector pointing up in world coordinates.
 */
var Camera = function (options) {
  var _this,
      _initialize,
      // variables
      _lookAt,
      _origin,
      _up,
      _worldToCamera;


  _this = {};

  _initialize = function (options) {
    var rotate,
        translate,
        x,
        y,
        z;

    options = Util.extend({}, _DEFAULTS, options);

    _lookAt = Vector(options.lookAt);
    _origin = Vector(options.origin);
    _up = Vector(options.up);

    // camera axes using world coordinates
    // +z is from origin through look at
    z = _lookAt.subtract(_origin).unit();
    // +x is right
    x = z.cross(_up).unit();
    // +y is up
    y = x.cross(z).unit();

    rotate = Matrix([
      x.x(), x.y(), x.z(), 0,
      y.x(), y.y(), y.z(), 0,
      z.x(), z.y(), z.z(), 0,
      0, 0, 0, 1
    ], 4, 4);

    translate = Matrix([
      1, 0, 0, -_origin.x(),
      0, 1, 0, -_origin.y(),
      0, 0, 1, -_origin.z(),
      0, 0, 0, 1
    ], 4, 4);

    _worldToCamera = rotate.multiply(translate).data();
  };

  /**
   * Project a point from world coordinates to camera coordinates.
   *
   * @param world {Array<Number>}
   *        x, y, z world coordinates.
   * @return {Array<Number>}
   *        x, y, z, camera coordinates.
   */
  _this.project = function (world) {
    var projected,
        x,
        xp,
        y,
        yp,
        z,
        zp;

    x = world[0];
    y = world[1];
    z = world[2];
    projected = Matrix.multiply(_worldToCamera, 4, 4, [x, y, z, 1], 4, 1);

    xp = projected[0];
    yp = projected[1];
    zp = projected[2];
    return [xp, yp, zp];
  };


  _initialize(options);
  options = null;
  return _this;
};


module.exports = Camera;

},{"./Matrix":"math/Matrix","./Vector":"math/Vector","util/Util":"util/Util"}],"math/Matrix":[function(require,module,exports){
'use strict';

var Vector = require('./Vector');


// static methods that operate on arrays
var __col,
    __diagonal,
    __get,
    __identity,
    __index,
    __jacobi,
    __multiply,
    __row,
    __set,
    __stringify,
    __transpose;


/**
 * Extract a column from this matrix.
 *
 * @param data {Array<Number>}
 *        matrix data.
 * @param m {Number}
 *        number of rows.
 * @param n {Number}
 *        number of columns.
 * @param col {Number}
 *        index of column, in range [0,n)
 * @throws Error if column out of range.
 * @return {Array<Number>} column elements.
 */
__col = function (data, m, n, col) {
  var row,
      values = [];
  if (col < 0 || col >= n) {
    throw new Error('column ' + col + ' out of range [0,' + n + ')');
  }
  if (n === 1) {
    // only one column in matrix
    return data;
  }
  values = [];
  for (row = 0; row < m; row++) {
    values.push(data[__index(m, n, row, col)]);
  }
  return values;
};

/**
 * Get array of elements on the diagonal.
 *
 * @param data {Array<Number>}
 *        matrix data.
 * @param m {Number}
 *        number of rows.
 * @param n {Number}
 *        number of columns.
 * @return {Array<Number>} elements on the diagonal.
 */
__diagonal = function (data, m, n) {
  var len = Math.min(m, n),
      diag = [],
      i;
  for (i = 0; i < len; i++) {
    diag.push(data[__index(m, n, i, i)]);
  }
  return diag;
};

/**
 * Get the value of an element of this matrix.
 *
 * @param data {Array<Number>}
 *        matrix data.
 * @param m {Number}
 *        number of rows.
 * @param n {Number}
 *        number of columns.
 * @param row {Number}
 *        row of element, in range [0,m)
 * @param col {Number}
 *        column of element, in range [0,n)
 * @throws Error if row or col are out of range.
 * @return {Number} value.
 */
__get = function (data, m, n, row, col) {
  return data[__index(m, n, row, col)];
};

/**
 * Create an identity Matrix.
 *
 * @param n {Number}
 *        number of rows and columns.
 * @return identity matrix of size n.
 */
__identity = function (n) {
  var values = [],
      row,
      col;
  for (row = 0; row < n; row++) {
    for (col = 0; col < n; col++) {
      values.push((row === col) ? 1 : 0);
    }
  }
  return values;
};

/**
 * Get the index of an element of this matrix.
 *
 * @param data {Array<Number>}
 *        matrix data.
 * @param m {Number}
 *        number of rows.
 * @param n {Number}
 *        number of columns.
 * @param row {Number}
 *        row of element, in range [0,m)
 * @param col {Number}
 *        column of element, in range [0,n)
 * @return {Number} index.
 */
__index = function (m, n, row, col) {
  return n * row + col;
};

/**
 * Jacobi eigenvalue algorithm.
 *
 * Ported from:
 *     http://users-phys.au.dk/fedorov/nucltheo/Numeric/now/eigen.pdf
 *
 * An iterative method for eigenvalues and eigenvectors,
 * only works on symmetric matrices.
 *
 * @param data {Array<Number>}
 *        matrix data.
 * @param m {Number}
 *        number of rows.
 * @param n {Number}
 *        number of columns.
 * @param maxRotations {Number}
 *        maximum number of rotations.
 *        Optional, default 100.
 * @return {Array<Vector>} array of eigenvectors, magnitude is eigenvalue.
 */
__jacobi = function (data, m, n, maxRotations) {
  var a,
      aip,
      aiq,
      api,
      app,
      app1,
      apq,
      aqi,
      aqq,
      aqq1,
      c,
      changed,
      e,
      i,
      ip,
      iq,
      p,
      phi,
      pi,
      q,
      qi,
      rotations,
      s,
      v,
      vector,
      vectors,
      vip,
      viq;

  if (m !== n) {
    throw new Error('Jacobi only works on symmetric, square matrices');
  }

  // set a default max
  maxRotations = maxRotations || 100;
  a = data.slice(0);
  e = __diagonal(data, m, n);
  v = __identity(n);
  rotations = 0;

  do {
    changed = false;

    for (p=0; p<n; p++) {
      for (q=p+1; q<n; q++) {
        app = e[p];
        aqq = e[q];
        apq = a[n * p + q];
        phi = 0.5 * Math.atan2(2 * apq, aqq - app);
        c = Math.cos(phi);
        s = Math.sin(phi);
        app1 = c * c * app - 2 * s * c * apq + s * s * aqq;
        aqq1 = s * s * app + 2 * s * c * apq + c * c * aqq;

        if (app1 !== app || aqq1 !== aqq) {
          changed = true;
          rotations++;

          e[p] = app1;
          e[q] = aqq1;
          a[n * p + q] = 0;

          for (i = 0; i < p; i++) {
            ip = n * i + p;
            iq = n * i + q;
            aip = a[ip];
            aiq = a[iq];
            a[ip] = c * aip - s * aiq;
            a[iq] = c * aiq + s * aip;
          }
          for (i = p + 1; i < q; i++) {
            pi = n * p + i;
            iq = n * i + q;
            api = a[pi];
            aiq = a[iq];
            a[pi] = c * api - s * aiq;
            a[iq] = c * aiq + s * api;
          }
          for (i = q + 1; i < n; i++) {
            pi = n * p + i;
            qi = n * q + i;
            api = a[pi];
            aqi = a[qi];
            a[pi] = c * api - s * aqi;
            a[qi] = c * aqi + s * api;
          }
          for (i = 0; i < n; i++) {
            ip = n * i + p;
            iq = n * i + q;
            vip = v[ip];
            viq = v[iq];
            v[ip] = c * vip - s * viq;
            v[iq] = c * viq + s * vip;
          }
        }
      }
    }
  } while (changed && (rotations < maxRotations));

  if (changed) {
    throw new Error('failed to converge');
  }

  vectors = [];
  for (i = 0; i < n; i++) {
    // i-th vector is i-th column
    vector = Vector(__col(v, m, n, i));
    vector.eigenvalue = e[i];
    vectors.push(vector);
  }

  return vectors;
};

/**
 * Multiply this matrix by another matrix.
 *
 * @param data1 {Array<Number>}
 *        first matrix data.
 * @param m1 {Number}
 *        number of rows in first matrix.
 * @param n1 {Number}
 *        number of columns in first matrix.
 * @param data2 {Array<Number>}
 *        second matrix data.
 * @param m2 {Number}
 *        number of rows in second matrix.
 * @param n2 {Number}
 *        number of columns in second matrix.
 * @throws Error if n1 !== m2
 * @return result of multiplication (original matrix is unchanged).
 */
__multiply = function (data1, m1, n1, data2, m2, n2) {
  var col,
      col2,
      row,
      row1,
      values;

  if (n1 !== m2) {
    throw new Error('wrong combination of rows and cols');
  }
  values = [];
  for (row = 0; row < m1; row++) {
    row1 = __row(data1, m1, n1, row);
    for (col = 0; col < n2; col++) {
      col2 = __col(data2, m2, n2, col);
      // result is dot product
      values.push(Vector.dot(row1, col2));
    }
  }
  return values;
};

/**
 * Extract a row from this matrix.
 *
 * @param data {Array<Number>}
 *        matrix data.
 * @param m {Number}
 *        number of rows.
 * @param n {Number}
 *        number of columns.
 * @param row {Number}
 *        index of row, in range [0,m)
 * @throws Error if row out of range.
 * @return {Array<Number>} row elements.
 */
__row = function (data, m, n, row) {
  var col,
      values;
  if (row < 0 || row >= m) {
    throw new Error('row ' + row + ' out of range [0,' + m + ')');
  }
  values = [];
  for (col = 0; col < n; col++) {
    values.push(data[__index(m, n, row, col)]);
  }
  return values;
};

/**
 * Set the value of an element of this matrix.
 *
 * NOTE: this method modifies the contents of this matrix.
 *
 * @param data {Array<Number>}
 *        matrix data.
 * @param m {Number}
 *        number of rows.
 * @param n {Number}
 *        number of columns.
 * @param row {Number}
 *        row of element, in range [0,m)
 * @param col {Number}
 *        column of element, in range [0,n)
 * @param value {Number}
 *        value to set.
 * @throws Error if row or col are out of range.
 */
__set = function (data, m, n, row, col, value) {
  data[__index(m, n, row, col)] = value;
};

/**
 * Display matrix as a string.
 *
 * @param data {Array<Number>}
 *        matrix data.
 * @param m {Number}
 *        number of rows.
 * @param n {Number}
 *        number of columns.
 * @return {String} formatted matrix.
 */
__stringify = function (data, m, n) {
  var lastRow = m - 1,
      lastCol = n - 1,
      buf = [],
      row,
      col;

  buf.push('[');
  for (row = 0; row < m; row++) {
    for (col = 0; col < n; col++) {
      buf.push(
          data[n * row + col],
          (col !== lastCol || row !== lastRow) ? ', ' : '');
    }
    if (row !== lastRow) {
      buf.push('\n ');
    }
  }
  buf.push(']');
  return buf.join('');
};

/**
 * Transpose this matrix.
 *
 * @param data {Array<Number>}
 *        matrix data.
 * @param m {Number}
 *        number of rows.
 * @param n {Number}
 *        number of columns.
 * @return transposed matrix (original matrix is unchanged).
 */
__transpose = function (data, m, n) {
  var values = [],
      row,
      col;
  for (col = 0; col < n; col++) {
    for (row = 0; row < m; row++) {
      values.push(data[__index(m, n, row, col)]);
    }
  }
  return values;
};


/**
 * Construct a new Matrix object.
 *
 * If m and n are omitted, Matrix is assumed to be square and
 * data length is used to compute size.
 *
 * If m or n are omitted, data length is used to compute omitted value.
 *
 * @param data {Array}
 *        matrix data.
 * @param m {Number}
 *        number of rows.
 * @param n {Number}
 *        number of columns.
 */
var Matrix = function (data, m, n) {
  var _this,
      _initialize,
      // variables
      _data,
      _m,
      _n;


  _this = {};

  _initialize = function (data, m, n) {
    _data = data;
    _m = m;
    _n = n;

    if (m && n) {
      // done
      return;
    }

    // try to compute size based on data
    if (!m && !n) {
      var side = Math.sqrt(data.length);
      if (side !== parseInt(side, 10)) {
        throw new Error('matrix m,n unspecified, and matrix not square');
      }
      _m = side;
      _n = side;
    } else if (!m) {
      _m = data.length / n;
      if (_m !== parseInt(_m, 10)) {
        throw new Error('wrong number of data elements');
      }
    } else if (!n) {
      _n = data.length / m;
      if (_n !== parseInt(_n, 10)) {
        throw new Error('wrong number of data elements');
      }
    }
  };

  /**
   * Add matrices.
   *
   * @param that {Matrix}
   *        matrix to add.
   * @throws Error if dimensions do not match.
   * @return result of addition (original matrix is unchanged).
   */
  _this.add = function (that) {
    if (_m !== that.m() || n !== that.n()) {
      throw new Error('matrices must be same size');
    }
    return Matrix(Vector.add(_data, that.data()), _m, _n);
  };

  /**
   * Get a column from this matrix.
   *
   * @param col {Number}
   *        zero-based column index.
   * @return {Array<Number>} array containing elements from column.
   */
  _this.col = function (col) {
    return __col(_data, _m, _n, col);
  };

  /**
   * Access the wrapped array.
   */
  _this.data = function () {
    return _data;
  };

  /**
   * Get the diagonal from this matrix.
   *
   * @return {Array<Number>} array containing elements from diagonal.
   */
  _this.diagonal = function () {
    return __diagonal(_data, _m, _n);
  };

  /**
   * Get a value from this matrix.
   *
   * @param row {Number}
   *        zero-based index of row.
   * @param col {Number}
   *        zero-based index of column.
   * @return {Number} value at (row, col).
   */
  _this.get = function (row, col) {
    return __get(_data, _m, _n, row, col);
  };

  /**
   * Compute the eigenvectors of this matrix.
   *
   * NOTE: Matrix should be 3x3 and symmetric.
   *
   * @param maxRotations {Number}
   *        default 100.
   *        maximum number of iterations.
   * @return {Array<Vector>} eigenvectors.
   *         Magnitude of each vector is eigenvalue.
   */
  _this.jacobi = function (maxRotations) {
    return __jacobi(_data, _m, _n, maxRotations);
  };

  /**
   * Get the number of rows in matrix.
   *
   * @return {Number}
   *         number of rows.
   */
  _this.m = function () {
    return _m;
  };

  /**
   * Multiply matrices.
   *
   * @param that {Matrix}
   *        matrix to multiply.
   * @return {Matrix} result of multiplication.
   */
  _this.multiply = function (that) {
    return Matrix(__multiply(_data, _m, _n, that.data(), that.m(), that.n()),
        // use that.N
        _m, that.n());
  };

  /**
   * Get number of columns in matrix.
   *
   * @return {Number} number of columns.
   */
  _this.n = function () {
    return _n;
  };

  /**
   * Multiply each element by -1.
   *
   * @return {Matrix} result of negation.
   */
  _this.negative = function () {
    return Matrix(Vector.multiply(_data, -1), _m, _n);
  };

  /**
   * Get a row from this matrix.
   *
   * @param row {Number}
   *        zero-based index of row.
   * @return {Array<Number>} elements from row.
   */
  _this.row = function (row) {
    return __row(_data, _m, _n, row);
  };

  /**
   * Set a value in this matrix.
   *
   * @param row {Number}
   *        zero-based row index.
   * @param col {Number}
   *        zero-based column index.
   * @param value {Number}
   *        value to set.
   */
  _this.set = function (row, col, value) {
    __set(_data, _m, _n, row, col, value);
  };

  /**
   * Subtract another matrix from this matrix.
   *
   * @param that {Matrix}
   *        matrix to subtract.
   * @throws Error if dimensions do not match.
   * @return result of subtraction (original matrix is unchanged).
   */
  _this.subtract = function (that) {
    if (_m !== that.m() || n !== that.n()) {
      throw new Error('matrices must be same size');
    }
    return Matrix(Vector.subtract(_data, that.data()), _m, _n);
  };

  /**
   * Display matrix as a string.
   *
   * @return {String} formatted matrix.
   */
  _this.toString = function () {
    return __stringify(_data, _m, _n);
  };

  /**
   * Transpose matrix.
   *
   * Columns become rows, and rows become columns.
   *
   * @return {Matrix} result of transpose.
   */
  _this.transpose = function () {
    return Matrix(__transpose(_data, _m, _n),
        // swap M and N
        _n, _m);
  };

  _initialize(data, m, n);
  data = null;
  return _this;
};


// expose static methods.
Matrix.col = __col;
Matrix.diagonal = __diagonal;
Matrix.get = __get;
Matrix.identity = __identity;
Matrix.index = __index;
Matrix.jacobi = __jacobi;
Matrix.multiply = __multiply;
Matrix.row = __row;
Matrix.set = __set;
Matrix.stringify = __stringify;
Matrix.transpose = __transpose;


module.exports = Matrix;

},{"./Vector":"math/Vector"}],"math/Vector":[function(require,module,exports){
'use strict';


// static methods that operate on arrays
var __add,
    __angle,
    __azimuth,
    __cross,
    __dot,
    __equals,
    __magnitude,
    __multiply,
    __plunge,
    __unit,
    __rotate,
    __subtract,
    __x,
    __y,
    __z;


/**
 * Add two vectors.
 *
 * @param v1 {Array<Number>}
 *        the first vector.
 * @param v2 {Array<Number>}
 *        the second vector.
 * @return {Array<Number>}
 *         result of addition.
 * @throws {Error} when vectors are different lengths.
 */
__add = function (v1, v2) {
  var i,
      v;
  if (v1.length !== v2.length) {
    throw new Error('vectors must be same length');
  }
  v = [];
  for (i = 0; i < v1.length; i++) {
    v.push(v1[i] + v2[i]);
  }
  return v;
};


/**
 * Compute the angle between two vectors.
 *
 * @param v1 {Array<Number>}
 *        the first vector.
 * @param v2 {Array<Number>}
 *        the second vector.
 * @return {Number}
 *         angle between vectors in radians.
 */
__angle = function (v1, v2) {
  return Math.acos(__dot(v1, v2) / (__magnitude(v1) * __magnitude(v2)));
};

/**
 * Compute the azimuth of a vector.
 *
 * @param v1 {Array<Number>}
 *        the first vector.
 * @param v2 {Array<Number>}
 *        the second vector.
 * @return {Number}
 *         angle between vectors in radians.
 */
__azimuth = function (v1) {
  if (v1.length < 2) {
    throw new Error('azimuth requires at least 2 dimensions');
  }
  if (v1[0] === 0 && v1[1] === 0) {
    // if vector is zero, or vertical, azimuth is zero.
    return 0;
  }
  return (Math.PI / 2) - Math.atan2(v1[1], v1[0]);
};

/**
 * Compute vector cross product.
 *
 * Note: only computes cross product in 3 dimensions.
 *
 * @param v1 {Array<Number>}
 *        the first vector.
 * @param v2 {Array<Number>}
 *        the second vector.
 * @return {Array<Number>}
 *         the 3 dimensional cross product.
 *         the resulting vector follows the right-hand rule: if the fingers on
 *         your right hand point to v1, and you close your hand to get to v2,
 *         the resulting vector points in the direction of your thumb.
 */
__cross = function (v1, v2) {
  if (v1.length !== v2.length || v1.length < 3) {
    throw new Error('cross product requires at least 3 dimensions');
  }
  return [
    v1[1] * v2[2] - v2[1] * v1[2],
    v1[2] * v2[0] - v2[2] * v1[0],
    v1[0] * v2[1] - v2[0] * v1[1]
  ];
};

/**
 * Compute vector dot product.
 *
 * @param v1 {Array<Number}
 *        the first vector.
 * @param v2 {Array<Number>}
 *        the second vector.
 * @return {Number}
 *         the dot product.
 */
__dot = function (v1, v2) {
  var i,
      sum;
  sum = 0;
  for (i = 0; i < v1.length; i++) {
    sum += v1[i] * v2[i];
  }
  return sum;
};

/**
 * Check if two vectors are equal.
 *
 * @param v1 {Array<Number>}
 *        the first vector.
 * @param v2 {Array<Number>}
 *        the second vector.
 * @return {Boolean}
 *         true if vectors are same length and all elements are equal.
 */
__equals = function (v1, v2) {
  var i;
  if (v1.length !== v2.length) {
    return false;
  }
  for (i = 0; i < v1.length; i++) {
    if (v1[i] !== v2[i]) {
      return false;
    }
  }
  return true;
};

/**
 * Compute length of vector.
 *
 * @param v1 {Array<Number>}
 *        vector.
 * @return {Number}
 *         magnitude of vector.
 */
__magnitude = function (v1) {
  var i,
      sum;
  sum = 0;
  for (i = 0; i < v1.length; i++) {
    sum += v1[i] * v1[i];
  }
  return Math.sqrt(sum);
};

/**
 * Multiply vector by a constant.
 *
 * @param v1 {Array<Number>}
 *        vector to multiply.
 * @param n {Number}
 *        number to multiply by.
 * @return {Array<Number}
 *         result of multiplication.
 */
__multiply = function (v1, n) {
  var i,
      v;

  v = [];
  for (i = 0; i < v1.length; i++) {
    v.push(v1[i] * n);
  }
  return v;
};

/**
 * Compute angle from plane z=0 to vector.
 *
 * @param v {Array<Number>}
 *        the vector.
 * @return {Number}
 *         angle from plane z=0 to vector.
 *         angle is positive when z > 0, negative when z < 0.
 */
__plunge = function (v) {
  if (v.length < 3) {
    throw new Error('__azimuth: vector must have at least 3 dimensions');
  }
  return Math.asin(v[2] / __magnitude(v));
};

/**
 * Rotate a vector around an axis.
 *
 * From "6.2 The normalized matrix for rotation about an arbitrary line",
 *      http://inside.mines.edu/~gmurray/ArbitraryAxisRotation/
 *
 * @param v1 {Array<Number>}
 *        the "point" to rotate.
 * @param axis {Array<Number>}
 *        direction vector of rotation axis.
 * @param theta {Number}
 *        angle of rotation in radians.
 * @param origin {Array<Number>}
 *        default [0, 0, 0].
 *        origin of axis of rotation.
 */
__rotate = function (v1, axis, theta, origin) {
  var a,
      au,
      av,
      aw,
      b,
      bu,
      bv,
      bw,
      c,
      cu,
      cv,
      cw,
      cosT,
      sinT,
      u,
      uu,
      ux,
      uy,
      uz,
      v,
      vv,
      vx,
      vy,
      vz,
      w,
      ww,
      wx,
      wy,
      wz,
      x,
      y,
      z;

  origin = origin || [0, 0, 0];
  a = origin[0];
  b = origin[1];
  c = origin[2];
  u = axis[0];
  v = axis[1];
  w = axis[2];
  x = v1[0];
  y = v1[1];
  z = v1[2];

  cosT = Math.cos(theta);
  sinT = Math.sin(theta);
  au = a * u;
  av = a * v;
  aw = a * w;
  bu = b * u;
  bv = b * v;
  bw = b * w;
  cu = c * u;
  cv = c * v;
  cw = c * w;
  uu = u * u;
  ux = u * x;
  uy = u * y;
  uz = u * z;
  vv = v * v;
  vx = v * x;
  vy = v * y;
  vz = v * z;
  ww = w * w;
  wx = w * x;
  wy = w * y;
  wz = w * z;

  return [
    (a * (vv + ww) - u * (bv + cw - ux - vy - wz)) * (1 - cosT) +
        x * cosT + (-cv + bw - wy + vz) * sinT,
    (b * (uu + ww) - v * (au + cw - ux - vy - wz)) * (1 - cosT) +
        y * cosT + (cu - aw + wx - uz) * sinT,
    (c * (uu + vv) - w * (au + bv - ux - vy - wz)) * (1 - cosT) +
        z * cosT + (-bu + av - vx + uy) * sinT
  ];
};

/**
 * Subtract two vectors.
 *
 * @param v1 {Array<Number>}
 *        the first vector.
 * @param v2 {Array<Number>}
 *        the vector to subtract.
 * @return {Array<Number>}
 *         result of subtraction.
 * @throws {Error} when vectors are different lengths.
 */
__subtract = function (v1, v2) {
  var i,
      v;

  if (v1.length !== v2.length) {
    throw new Error('__subtract: vectors must be same length');
  }
  v = [];
  for (i = 0; i < v1.length; i++) {
    v.push(v1[i] - v2[i]);
  }
  return v;
};

/**
 * Convert vector to length 1.
 *
 * Same as __multiply(v1, 1 / __magnitude(v1))
 *
 * @param v1 {Array<Number>}
 *        the vector.
 * @return {Array<Number>}
 *         vector converted to length 1.
 * @throws {Error} if vector magnitude is 0.
 */
__unit = function (v1) {
  var mag = __magnitude(v1);
  if (mag === 0) {
    throw new Error('__unit: cannot convert zero vector to unit vector');
  }
  return __multiply(v1, 1 / mag);
};

/**
 * Get, and optionally set, the x component of a vector.
 *
 * @param v {Array<Number>}
 *        the vector.
 * @param value {Number}
 *        default undefined.
 *        when defined, set x component.
 * @return {Number}
 *         the x component.
 */
__x = function (v, value) {
  if (typeof value === 'number') {
    v[0] = value;
  }
  return v[0];
};

/**
 * Get, and optionally set, the y component of a vector.
 *
 * @param v {Array<Number>}
 *        the vector.
 * @param value {Number}
 *        default undefined.
 *        when defined, set y component.
 * @return {Number}
 *         the y component.
 */
__y = function (v, value) {
  if (typeof value === 'number') {
    v[1] = value;
  }
  return v[1];
};

/**
 * Get, and optionally set, the z component of a vector.
 *
 * @param v {Array<Number>}
 *        the vector.
 * @param value {Number}
 *        default undefined.
 *        when defined, set z component.
 * @return {Number}
 *         the z component.
 */
__z = function (v, value) {
  if (typeof value === 'number') {
    v[2] = value;
  }
  return v[2];
};


/**
 * A vector object that wraps an array.
 *
 * This is a convenience object to call the static methods on the wrapped array.
 * Only the methods x(), y(), and z() modify data; other methods return new
 * Vector objects without modifying the existing object.
 *
 * @param data {Array<Number>}
 *        array to wrap.
 */
var Vector = function (data) {
  var _this,
      _initialize,
      // variables
      _data;

  if (data && typeof data.data === 'function') {
    // copy existing object
    data = data.data().slice(0);
  }


  _this = {
    _isa_vector: true
  };

  _initialize = function (data) {
    _data = data;
  };

  /**
   * Add two vectors.
   *
   * @param that {Vector|Array<Number>}
   *        vector to add.
   * @return {Vector}
   *         result of addition.
   */
  _this.add = function (that) {
    that = (that._isa_vector ? that.data() : that);
    return Vector(__add(_data, that));
  };

  /**
   * Compute angle between vectors.
   *
   * @param that {Vector|Array<Number>}
   *        vector to compute angle between.
   * @return {Number} angle between vectors in radians.
   */
  _this.angle = function (that) {
    that = (that._isa_vector ? that.data() : that);
    return __angle(_data, that);
  };

  /**
   * Compute azimuth of this vector.
   *
   * @return {Number} azimuth of this vector in radians.
   */
  _this.azimuth = function () {
    return __azimuth(_data);
  };

  /**
   * Compute the cross product between vectors.
   *
   * @param that {Vector|Array<Number>}
   *        the vector to cross.
   * @return {Vector} result of the cross product.
   */
  _this.cross = function (that) {
    that = (that._isa_vector ? that.data() : that);
    return Vector(__cross(_data, that));
  };

  /**
   * Access the wrapped array.
   *
   * @return {Array<Number>}
   *         the wrapped array.
   */
  _this.data = function () {
    return _data;
  };

  /**
   * Compute dot product between vectors.
   *
   * @param that {Vector|Array<Number>}
   *        vector to dot.
   * @return {Number} result of dot product.
   */
  _this.dot = function (that) {
    that = (that._isa_vector ? that.data() : that);
    return __dot(_data, that);
  };

  /**
   * Check if two vectors are equal.
   *
   * @param that {Vector|Array<Number>}
   *        vector to compare.
   * @return {Boolean} true if equal, false otherwise.
   */
  _this.equals = function (that) {
    that = (that._isa_vector ? that.data() : that);
    return __equals(_data, that);
  };

  /**
   * Compute length of this vector.
   *
   * @return {Number} length of vector.
   *         Square root of the sum of squares of all components.
   */
  _this.magnitude = function () {
    return __magnitude(_data);
  };

  /**
   * Multiply this vector by a number.
   *
   * @param n {Number}
   *        number to multiply.
   * @return {Vector} result of multiplication.
   */
  _this.multiply = function (n) {
    return Vector(__multiply(_data, n));
  };

  /**
   * Same as multiply(-1).
   */
  _this.negative = function () {
    return _this.multiply(-1);
  };

  /**
   * Compute plunge of this vector.
   *
   * Plunge is the angle between this vector and the plane z=0.
   *
   * @return {Number} plunge in radians.
   *         positive when z>0, negative when z<0.
   */
  _this.plunge = function () {
    return __plunge(_data);
  };

  /**
   * Rotate this vector around an arbitrary axis.
   *
   * @param axis {Vector|Array<Number>}
   *        direction of axis of rotation.
   * @param theta {Number}
   *        angle of rotation in radians.
   * @param origin {Vector|Array<Number>}
   *        origin of axis of rotation.
   * @return {Vector} result of rotation.
   */
  _this.rotate = function (axis, theta, origin) {
    axis = (axis._isa_vector ? axis.data() : axis);
    origin = (origin && origin._isa_vector ? origin.data() : origin);
    return Vector(__rotate(_data, axis, theta, origin));
  };

  /**
   * Subtract another vector.
   *
   * @param that {Vector|Array<Number>}
   *        vector to subtract.
   * @return {Vector} result of subtraction.
   */
  _this.subtract = function (that) {
    that = (that._isa_vector ? that.data() : that);
    return Vector(__subtract(_data, that));
  };

  /**
   * Convert vector to string.
   *
   * @return {String} wrapped array converted to string.
   */
  _this.toString = function () {
    return '' + _data;
  };

  /**
   * Convert this vector to length 1.
   *
   * @return {Vector} vector / |vector|.
   */
  _this.unit = function () {
    return Vector(__unit(_data));
  };

  /**
   * Get or set x component.
   *
   * @param value {Number}
   *        when defined, set x component to value.
   * @return {Number} x component value.
   */
  _this.x = function (value) {
    return __x(_data, value);
  };

  /**
   * Get or set y component.
   *
   * @param value {Number}
   *        when defined, set y component to value.
   * @return {Number} y component value.
   */
  _this.y = function (value) {
    return __y(_data, value);
  };

  /**
   * Get or set z component.
   *
   * @param value {Number}
   *        when defined, set z component to value.
   * @return {Number} z component value.
   */
  _this.z = function (value) {
    return __z(_data, value);
  };


  _initialize(data);
  data = null;
  return _this;
};


// expose static methods
Vector.add = __add;
Vector.angle = __angle;
Vector.azimuth = __azimuth;
Vector.cross = __cross;
Vector.dot = __dot;
Vector.magnitude = __magnitude;
Vector.multiply = __multiply;
Vector.plunge = __plunge;
Vector.rotate = __rotate;
Vector.subtract = __subtract;
Vector.unit = __unit;
Vector.x = __x;
Vector.y = __y;
Vector.z = __z;


module.exports = Vector;

},{}],"mvc/CollectionSelectBox":[function(require,module,exports){
'use strict';

var Util = require('../util/Util'),
    View = require('./View');


var _DEFAULTS = {
  // classname added to select box
  className: 'collection-selectbox',
  includeBlankOption: false,
  blankOption: {
    text: 'Please select&hellip;',
    value: '-1'
  },

  // callback to format each collection item
  format: function (item) {
    return item.id;
  },

  // whether to render during initialize
  renderNow: true
};

/**
 * Create a new CollectionSelectBox to select a collection item.
 *
 * @param params {Object}
 * @param params.format {Function(Object)}
 *        callback function to format select box items.
 * @param params.className {String}
 *        Default 'collection-selectbox'.
 *        Class name for select box.
 * @param params.collection {Collection}
 *        the collection to display.
 *        NOTE: the collection should have an existing selection;
 *        otherwise, the first item in the select box will be selected
 *        in the UI and not in the collection.
 * @see mvc/View
 */
var CollectionSelectBox = function (params) {
  var _this,
      _initialize,

      _blankOption,
      _collection,
      _format,
      _getValidOptions,
      _includeBlankOption,
      _selectBox,

      _createBlankOption,
      _defaultGetValidOptions,
      _onChange,
      _onSelect;


  params = Util.extend({}, _DEFAULTS, params);
  _this = View(params);

  /**
   * @constructor
   *
   */
  _initialize = function (params) {
    var el;

    el = _this.el;

    _blankOption = params.blankOption;
    _collection = params.collection;
    _format = params.format;
    _getValidOptions = params.getValidOptions || _defaultGetValidOptions;
    _includeBlankOption = params.includeBlankOption;

    // reuse or create select box
    if (el.nodeName === 'SELECT') {
      _selectBox = el;
    } else {
      _selectBox = el.appendChild(document.createElement('select'));
    }
    _selectBox.classList.add(params.className);

    // bind to events on the collection
    _collection.on('add', _this.render);
    _collection.on('remove', _this.render);
    _collection.on('reset', _this.render);
    _collection.on('select', _onSelect);
    _collection.on('deselect', _onSelect);

    // bind to events on this._selectBox
    _selectBox.addEventListener('change', _onChange);

    // populate select box
    if (params.renderNow) {
      _this.render();
    }
  };

  _createBlankOption = function () {
    return [
    '<option ',
        'value="', _blankOption.value, '">',
      _blankOption.text,
    '</option>'
    ].join('');
  };

  _defaultGetValidOptions = function () {
    return _collection.data().map(function (o) { return o.id; });
  };

  /**
   * Handle selectbox change events.
   */
  _onChange = function () {
    var value;

    value = _selectBox.value;

    if (_includeBlankOption && value === _blankOption.value) {
      _collection.deselect();
    } else {
      _collection.selectById(value);
    }
  };

  /**
   * Handle collection select events.
   */
  _onSelect = function () {
    var selected,
        validOptions;

    selected = _collection.getSelected();
    validOptions = _getValidOptions();

    if (selected) {
      if (validOptions.indexOf(selected.id) === -1) {
        _collection.deselect();
      } else {
        _selectBox.value = selected.id;
      }
    } else if (_includeBlankOption) {
      _selectBox.value = _blankOption.value;
    }
  };


  /**
   * Destroy CollectionSelectBox.
   */
  _this.destroy = Util.compose(function () {
    _collection.off('add', _this.render);
    _collection.off('remove', _this.render);
    _collection.off('reset', _this.render);
    _collection.off('select', _onSelect);
    _collection.off('deselect', _onSelect);

    _selectBox.removeEventListener('change', _onChange);

    _blankOption = null;
    _collection = null;
    _format = null;
    _getValidOptions = null;
    _includeBlankOption = null;
    _selectBox = null;

    _createBlankOption = null;
    _defaultGetValidOptions = null;
    _onChange = null;
    _onSelect = null;

    _initialize = null;
    _this = null;
  }, _this.destroy);

  /**
   * Update select box items.
   */
  _this.render = function () {
    var data,
        i,
        id,
        len,
        markup,
        selected,
        validOptions;

    data = _collection.data();
    markup = [];
    selected = _collection.getSelected();

    if (_includeBlankOption === true) {
      markup.push(_createBlankOption());
    }

    validOptions = _getValidOptions();

    for (i = 0, len = data.length; i < len; i++) {
      id = data[i].id;

      markup.push('<option value="' + id + '"' +
          (selected === data[i] ? ' selected="selected"' : '') +
          (validOptions.indexOf(id) === -1 ? ' disabled="disabled"' : '') +
          '>' + _format(data[i]) + '</option>');
    }

    _selectBox.innerHTML = markup.join('');
    _onSelect();
  };


  _initialize(params);
  params = null;
  return _this;
};

module.exports = CollectionSelectBox;

},{"../util/Util":"util/Util","./View":"mvc/View"}],"mvc/CollectionTable":[function(require,module,exports){
'use strict';

var Util = require('../util/Util'),
    View = require('./View');


var _DEFAULTS = {
  // class name for table
  className: 'collection-table',
  // click on table rows to trigger select in collection
  clickToSelect: false,
  // columns of data to display
  columns: [
    //{
      // class name for header and data cells
      //   className: '',
      // header content for column
      //   title: '',
      // format function for data cells
      //   format: function (item) { return ''; }
      // whether column is header for its row
      //   header: false
    //}
  ],
  emptyMarkup: 'No data to display',
  // whether to render after initialization
  renderNow: true
};


/**
 * Create a CollectionTable to display a collection.
 *
 * @param params {Object}
 * @param params.collection {Collection}
 *        Collection to display.
 * @param params.columns {Array<Object>}
 *        Array of column objects defining display.
 *        Each object should have these properties:
 *        - className {String} class name for header and data cells.
 *        - title {String} markup for header cell.
 *        - format {Function(item)} function to format data cell.
 *        - header {Boolean} default false.
 *          whether column is row header and should use th scope=row (true),
 *          or a regular data cell and should use td (false).
 * @param params.clickToSelect {Boolean}
 *        Default false.  Whether clicking on table rows should select
 *        the corresponding collection item.
 * @see mvc/View
 */
var CollectionTable = function (params) {
  var _this,
      _initialize,

      _className,
      _clickToSelect,
      _collection,
      _columns,
      _emptyMarkup,

      _onClick,
      _onSelect;


  params = Util.extend({}, _DEFAULTS, params);
  _this = View(params);

  _initialize = function () {
    _className = params.className;
    _clickToSelect = params.clickToSelect;
    _collection = params.collection;
    _columns = params.columns;
    _emptyMarkup = params.emptyMarkup;

    // respond to collection events
    _collection.on('add', _this.render);
    _collection.on('remove', _this.render);
    _collection.on('reset', _this.render);
    _collection.on('select', _onSelect);
    _collection.on('deselect', _onSelect);

    // add click handler
    if (_clickToSelect) {
      _this.el.addEventListener('click', _onClick);
    }

    if (params.renderNow) {
      _this.render();
    }
  };


  /**
   * Handle table click events.
   * Listener is only added when options.clickToSelect is true.
   */
  _onClick = function (e) {
    var target = e.target,
        row = Util.getParentNode(target, 'TR', _this.el);

    if (row !== null) {
      if (row.parentNode.nodeName.toUpperCase() === 'TBODY') {
        _collection.selectById(row.getAttribute('data-id'));
      }
    }
  };

  /**
   * Handle collection select and deselect events.
   */
  _onSelect = function () {
    var el = _this.el,
        selected;

    // remove previous selection
    selected = el.querySelector('.selected');
    if (selected) {
      selected.classList.remove('selected');
    }

    // set new selection
    selected = _collection.getSelected();
    if (selected) {
      selected = el.querySelector('[data-id="' + selected.id + '"]');
      selected.classList.add('selected');
    }
  };


  /**
   * Undo initialization and free references.
   */
  _this.destroy = Util.compose(function () {

    _collection.off('add', _this.render);
    _collection.off('remove', _this.render);
    _collection.off('reset', _this.render);
    _collection.off('select', _onSelect);
    _collection.off('deselect', _onSelect);
    _collection = null;

    if (_clickToSelect) {
      _this.el.removeEventListener('click', _onClick);
    }
    _clickToSelect = null;
  }, _this.destroy);

  /**
   * Render the view.
   */
  _this.render = function () {
    var c,
        cLen,
        column,
        data,
        i,
        id,
        iLen,
        item,
        markup;

    data = _collection.data();
    markup = [];

    if (data.length === 0) {
      _this.el.innerHTML = _emptyMarkup;
      return;
    }

    markup.push('<table class="', _className, '"><thead>');
    for (c = 0, cLen = _columns.length; c < cLen; c++) {
      column = _columns[c];
      markup.push('<th class="' + column.className + '">' +
          column.title + '</th>');
    }
    markup.push('</thead><tbody>');
    for (i = 0, iLen = data.length; i < iLen; i++) {
      item = data[i];
      id = ('' + item.id).replace(/"/g, '&quot;');
      markup.push('<tr data-id="' + id + '">');
      for (c = 0, cLen = _columns.length; c < cLen; c++) {
        column = _columns[c];
        markup.push('<' + (column.header ? 'th scope="row"' : 'td') +
            ' class="' + column.className + '">' +
            column.format(item) + '</td>');
      }
      markup.push('</tr>');
    }
    markup.push('</tbody></table>');

    _this.el.innerHTML = markup.join('');
  };


  _initialize();
  return _this;
};

module.exports = CollectionTable;
},{"../util/Util":"util/Util","./View":"mvc/View"}],"mvc/CollectionView":[function(require,module,exports){
'use strict';

var Collection = require('./Collection'),
    View = require('./View'),

    Util = require('../util/Util');

var CollectionView = function (options) {
  var _this,
      _initialize,

      _collection,
      _destroyCollection,
      _factory,
      _list,
      _views,

      _createViews,
      _onCollectionAdd,
      _onCollectionDeselect,
      _onCollectionRemove,
      _onCollectionReset,
      _onCollectionSelect;


  _this = View(options);

  _initialize = function (options) {
    var selected;

    _collection = options.collection;
    _factory = options.factory || View;

    if (!_collection) {
      _collection = Collection([]);
      _destroyCollection = true;
    }

    if (_this.el.nodeName === 'UL' || _this.el.nodeName === 'OL') {
      _list = _this.el;
    } else {
      _list = _this.el.appendChild(document.createElement('ul'));
    }

    _views = Collection([]);

    _collection.on('render', _this.render);

    _collection.on('add', _onCollectionAdd);
    _collection.on('remove', _onCollectionRemove);
    _collection.on('reset', _onCollectionReset);

    _collection.on('select', _onCollectionSelect);
    _collection.on('deselect', _onCollectionDeselect);

    _onCollectionReset();

    // Make sure any selected model is rendered properly in the view
    selected = _collection.getSelected();
    if (selected) {
      _onCollectionSelect(selected);
    }
  };


  _createViews = function (models, parent) {
    var views;

    parent = parent || document.createDocumentFragment();

    views = models.map(function (model) {
      var view = _factory({
        collection: _collection,
        el: parent.appendChild(document.createElement('li')),
        model: model
      });

      if (typeof view.id === 'undefined' || view.id === null) {
        view.id = model.id;
      }

      return view;
    });

    return views;
  };

  _onCollectionAdd = function (models) {
    var fragment,
        views;

    fragment = document.createDocumentFragment();
    views = _createViews(models, fragment);

    // Add the newly created views to our view collection
    _views.add.apply(_views, views);

    // Append our new views to the end
    _list.appendChild(fragment);
  };

  _onCollectionDeselect = function (model) {
    var view;

    view = _views.get(model.id);

    if (view) {
      view.el.classList.remove('selected');
    }
  };

  _onCollectionRemove = function (models) {
    models.forEach(function (model) {
      var view = _views.get(model.id);

      if (view) {
        _views.remove(view);

        if (view.el.parentNode === _list) {
          _list.removeChild(view.el);
        }
      }
    });
  };

  _onCollectionReset = function () {
    var views;

    // Destroy each previous view
    _views.data().forEach(function (view) {
      view.destroy();
    });

    // Create the views for the current data set
    views = _createViews(_collection.data(), document.createDocumentFragment());



    // Reset our collection with the new views
    _views.reset(views);

    // Now render them all
    _this.render();
  };

  _onCollectionSelect = function (model) {
    var view;

    view = _views.get(model.id);

    if (view) {
      view.el.classList.add('selected');
    }
  };


  _this.destroy = Util.compose(_this.destroy, function () {
    _collection.off('render', _this.render);

    _collection.off('add', _onCollectionAdd);
    _collection.off('remove', _onCollectionRemove);
    _collection.off('reset', _onCollectionReset);

    _collection.off('select', _onCollectionSelect);
    _collection.off('deselect', _onCollectionDeselect);

    if (_destroyCollection) {
      _collection.destroy();
    }

    _views.data().forEach(function (view) {
      view.destroy();
    });
    _views.destroy();


    _collection = null;
    _destroyCollection = null;
    _factory = null;
    _views = null;

    _createViews = null;
    _onCollectionAdd = null;
    _onCollectionDeselect = null;
    _onCollectionRemove = null;
    _onCollectionReset = null;
    _onCollectionSelect = null;

    _initialize = null;
    _this = null;
  });

  _this.getView = function (model) {
    return _views.get(model.id);
  };

  _this.render = function () {
    var fragment = document.createDocumentFragment();

    _views.data().forEach(function (view) {
      fragment.appendChild(view.el);
    });

    Util.empty(_list);
    _list.appendChild(fragment);
  };


  _initialize(options||{});
  options = null;
  return _this;
};

module.exports = CollectionView;

},{"../util/Util":"util/Util","./Collection":"mvc/Collection","./View":"mvc/View"}],"mvc/Collection":[function(require,module,exports){
'use strict';
/**
 * A Lightweight collection, inspired by backbone.
 *
 * Lazily builds indexes to avoid overhead until needed.
 */

var Events = require('../util/Events'),
    Util = require('../util/Util');


/**
 * Create a new Collection.
 *
 * @param data {Array}
 *      When omitted a new array is created.
 */
var Collection = function (data) {

  var _this,
      _initialize,

      _data,
      _ids,
      _selected,

      _isSilent;


  _this = Events();

  _initialize = function () {
    _data = data || [];
    _ids = null;
    _selected = null;

    data = null;
  };

  /**
   * Whether "silent" option is true.
   *
   * @param options {Object}
   * @param options.silent {Boolean}
   *        default false.
   * @return {Boolean} true if options.silent is true.
   */
  _isSilent = function (options) {
    return options && options.silent === true;
  };

  /**
   * Add objects to the collection.
   *
   * Calls wrapped array.push, and clears the id cache.
   *
   * @param {Object…}
   *      a variable number of objects to append to the collection.
   * @deprecated see #addAll()
   */
  _this.add = function () {
    _this.addAll(Array.prototype.slice.call(arguments, 0));
  };

  /**
   * Add objects to the collection.
   *
   * Calls wrapped array.push, and clears the id cache.
   *
   * @param toadd {Array<Object>}
   *        objects to be added to the collection.
   */
   _this.addAll = function (toadd, options) {
     _data.push.apply(_data, toadd);
     _ids = null;
     if (!_isSilent(options)) {
       _this.trigger('add', toadd);
     }
   };

  /**
   * Get the wrapped array.
   *
   * @return
   *      the wrapped array.
   */
  _this.data = function () {
    return _data;
  };

  /**
   * Deselect current selection.
   */
  _this.deselect = function (options) {
    if (_selected !== null) {
      var oldSelected = _selected;
      _selected = null;
      if (!_isSilent(options)) {
        _this.trigger('deselect', oldSelected);
      }
    }
  };

  /**
   * Free the array and id cache.
   *
   * @param options {Object}
   *        passed to #deselect().
   */
  _this.destroy = Util.compose(function (options) {
    _data = null;
    _ids = null;
    _selected = null;
    if (!_isSilent(options)) {
      _this.trigger('destroy');
    }
    return options;
  }, _this.destroy);

  /**
   * Get an object in the collection by ID.
   *
   * Uses getIds(), so builds map of ID to INDEX on first access O(N).
   * Subsequent access should be O(1).
   *
   * @param id {Any}
   *      if the collection contains more than one object with the same id,
   *      the last element with that id is returned.
   */
  _this.get = function (id) {
    var ids = _this.getIds();

    if (ids.hasOwnProperty(id)) {
      // use cached index
      return _data[ids[id]];
    } else {
      return null;
    }
  };

  /**
   * Get a map from ID to INDEX.
   *
   * @param force {Boolean}
   *      rebuild the map even if it exists.
   */
  _this.getIds = function (force) {
    var i = 0,
        len = _data.length,
        id;

    if (force || _ids === null) {
      // build up ids first time through
      _ids = {};

      for (; i < len; i++) {
        id = _data[i].id;

        if (_ids.hasOwnProperty(id)) {
          throw 'model with duplicate id "' + id + '" found in collection';
        }

        _ids[id] = i;
      }
    }

    return _ids;
  };

  /**
   * Get the currently selected object.
   */
  _this.getSelected = function () {
    return _selected;
  };

  /**
   * Remove objects from the collection.
   *
   * This method calls array.splice to remove item from array.
   * Reset would be faster if modifying large chunks of the array.
   *
   * @param o {Object}
   *      object to remove.
   * @deprecated see #removeAll()
   */
  _this.remove = function (/* o */) {
    // trigger remove event
    _this.removeAll(Array.prototype.slice.call(arguments, 0));
  };

  /**
   * Remove objects from the collection.
   *
   * Reset is faster if modifying large chunks of the array.
   *
   * @param toremove {Array<Object>}
   *        objects to remove.
   * @param options {Object}
   * @param options.silent {Boolean}
   *        default false.
   *        whether to trigger events (false), or not (true).
   */
  _this.removeAll = function (toremove, options) {
    var i,
        len = toremove.length,
        indexes = [],
        ids = _this.getIds(),
        o;

    // select indexes to be removed
    for (i = 0; i < len; i++) {
      o = toremove[i];

      // clear current selection if being removed
      if (o === _selected) {
        _this.deselect();
      }

      // add to list to be removed
      if (ids.hasOwnProperty(o.id)) {
        indexes.push(ids[o.id]);
      } else {
        throw 'removing object not in collection';
      }
    }

    // remove in descending index order
    indexes.sort(function(a,b) { return a-b; });

    for (i = indexes.length-1; i >= 0; i--) {
      _data.splice(indexes[i], 1);
    }

    // reset id cache
    _ids = null;

    if (!_isSilent(options)) {
      // trigger remove event
      _this.trigger('remove', toremove);
    }
  };

  /**
   * Replace the wrapped array with a new one.
   */
  _this.reset = function (data, options) {
    // check for existing selection
    var selectedId = null;
    if (_selected !== null) {
      selectedId = _selected.id;
    }

    // free array and id cache
    _data = null;
    _ids = null;
    _selected = null;

    // set new array
    _data = data || [];

    // notify listeners
    if (!options || options.silent !== true) {
      _this.trigger('reset', data);
    }

    // reselect if there was a previous selection
    if (selectedId !== null) {
      var selected = _this.get(selectedId);
      if (selected !== null) {
        options = Util.extend({}, options, {'reset': true});
        _this.select(selected, options);
      }
    }
  };

  /**
   * Select an object in the collection.
   *
   * @param obj {Object}
   *      object in the collection to select.
   * @throws exception
   *      if obj not in collection.
   */
  _this.select = function (obj, options) {
    // no selection
    if (obj === null) {
      _this.deselect();
      return;
    }
    // already selected
    if (obj === _selected) {
      return;
    }
    // deselect previous selection
    if (_selected !== null) {
      _this.deselect(options);
    }

    if (obj === _this.get(obj.id)) {
      // make sure it's part of this collection…
      _selected = obj;
      if (!options || options.silent !== true) {
        _this.trigger('select', _selected, options);
      }
    } else {
      throw 'selecting object not in collection';
    }
  };

  /**
   * Utility method to select collection item using its id.
   *
   * Selects matching item if it exists, otherwise clears any selection.
   *
   * @param id {?}
   *        id of item to select.
   * @param options {Object}
   *        options passed to #select() or #deselect().
   */
  _this.selectById = function (id, options) {
    var obj = _this.get(id);
    if (obj !== null) {
      _this.select(obj, options);
    } else {
      _this.deselect(options);
    }
  };

  /**
   * Sorts the data.
   *
   * @param method {Function}
   *        javascript sort method.
   * @param options {Object}
   *        passed to #reset()
   */
  _this.sort = function (method, options) {
    _data.sort(method);

    // "reset" to new sort order
    _this.reset(_data, options);
  };

  /**
   * Override toJSON method to serialize only collection data.
   */
  _this.toJSON = function () {
    var json = _data.slice(0),
        item,
        i,
        len;

    for (i = 0, len = json.length; i < len; i++) {
      item = json[i];
      if (typeof item === 'object' &&
          item !== null &&
          typeof item.toJSON === 'function') {
        json[i] = item.toJSON();
      }
    }

    return json;
  };


  _initialize();
  return _this;
};

module.exports = Collection;

},{"../util/Events":"util/Events","../util/Util":"util/Util"}],"mvc/DataTable":[function(require,module,exports){
'use strict';


var CollectionTable = require('./CollectionTable'),
    DownloadView = require('./DownloadView'),
    SortView = require('./SortView'),
    Util = require('../util/Util'),
    View = require('./View');


/**
 * Create a new DataTable to display a collection.
 *
 * @param params {Object}
 *        all params except "el" are passed to CollectionTable.
 * @param params.sorts {Array<Object>}
 *        sort objects used by SortView.
 * @param params.formatDownload {Function(Collection)}
 *        Optional, default is Tab Separated Values.
 * @param params.columns {Array<Object>}
 *        column objects used by CollectionTable.
 * @param params.columns[X].downloadFormat {Function(Object)}
 *        Optional, default is column.format.
 *        Function used to format a column value for download.
 *        Used by DataTable._formatDownload.
 * @param params.columns[X].downloadTitle {string}
 *        Optional, default is column.title.
 *        column title value for download.
 *        Used by DataTable._formatDownload.
 * @see CollectionTable
 * @see SortView
 * @see DownloadView
 */
var DataTable = function (params) {
  var _this,
      _initialize,

      _collection,
      _collectionTable,
      _columns,
      _downloadButton,
      _downloadView,
      _sorts,
      _sortView,

      _formatDownload;


  _this = View(params);

  /**
   * Initialize the DataTable.
   */
  _initialize = function () {
    var el,
        tools;

    el = _this.el;
    el.innerHTML = '<div class="datatable-tools"></div>' +
        '<div class="datatable-data"></div>';
    el.classList.add('datatable');
    tools = el.querySelector('.datatable-tools');

    _collection = params.collection;
    _columns = params.columns;

    // sort
    _sorts = params.sorts;
    if (_sorts) {
      _sortView = new SortView({
        collection: _collection,
        sorts: _sorts,
        defaultSort: params.defaultSort
      });
      tools.appendChild(_sortView.el);
    }

    // data
    _collectionTable = new CollectionTable(
        Util.extend({}, params, {
          el: el.querySelector('.datatable-data')
        }));

    // download
    _downloadView = new DownloadView({
      collection: _collection,
      help: params.help || 'Copy then paste into a spreadsheet application',
      format: params.formatDownload || _formatDownload
    });

    _downloadButton = document.createElement('button');
    _downloadButton.innerHTML = 'Download';
    _downloadButton.className = 'download';
    _downloadButton.addEventListener('click', _downloadView.show);
    tools.appendChild(_downloadButton);


    params = null;
  };


  /**
   * Callback used to format downloads.
   * This implementation outputs Tab Separated Values.
   */
  _formatDownload = function (collection) {
    var c,
        cLen,
        content,
        column,
        data,
        format,
        i,
        iLen,
        item,
        row;

    content = [];
    data = collection.data();
    row = [];

    for (c = 0, cLen = _columns.length; c < cLen; c++) {
      column = _columns[c];
      row.push(column.downloadTitle || column.title);
    }
    content.push(row.join('\t'));

    for (i = 0, iLen = data.length; i < iLen; i++) {
      item = data[i];
      row = [];
      for (c = 0, cLen = _columns.length; c < cLen; c++) {
        column = _columns[c];
        format = column.downloadFormat || column.format;
        row.push(format(item));
      }
      content.push(row.join('\t'));
    }

    return content.join('\n');
  };


  /**
   * Destroy the DataTable.
   */
  _this.destroy = Util.compose(function () {
    if (_sortView) {
      _sortView.destroy();
      _sortView = null;
    }

    _downloadButton.removeEventListener('click', _downloadView.show);
    _downloadButton = null;

    _downloadView.destroy();
    _downloadView = null;

    _collectionTable.destroy();
    _collectionTable = null;
  }, _this.destroy);


  _initialize();
  return _this;
};

module.exports = DataTable;

},{"../util/Util":"util/Util","./CollectionTable":"mvc/CollectionTable","./DownloadView":"mvc/DownloadView","./SortView":"mvc/SortView","./View":"mvc/View"}],"mvc/DownloadView":[function(require,module,exports){
'use strict';

var ModalView = require('./ModalView'),
    Util = require('../util/Util'),
    View = require('./View');


var _DEFAULTS = {
  // title of modal dialog.
  title: 'Download',
  // markup to describe download content.
  help: '',
  // callback function to format collection for download.
  format: function (collection) {
    return JSON.stringify(collection);
  }
};


/**
 * Create a DownloadView.
 *
 * @param options {Object}
 * @param options.title {String}
 *        Default 'Download'.
 *        Modal dialog title.
 * @param options.format {Function(Collection)}
 *        Default JSON.stringify.
 *        function to format collection for download.
 * @see mvc/View
 */
var DownloadView = function (params) {
  var _this,
      _initialize,

      _collection,
      _format,
      _modal,
      _textarea,
      _title;


  params = Util.extend({}, _DEFAULTS, params);
  _this = View(params);

  /**
   * Initialize the download view.
   */
  _initialize = function () {
    var el = _this.el;

    _collection = params.collection;
    _format = params.format;
    _title = params.title;

    el.className = 'download-view';
    el.innerHTML = '<div class="help">' + params.help + '</div>' +
        '<textarea class="download" readonly="readonly"></textarea>';
    _textarea = el.querySelector('.download');

    params = null;
  };

  /**
   * Destroy the download view.
   */
  _this.destroy = Util.compose(function () {
    if (_modal) {
      // TODO: hide first?
      _modal.destroy();
      _modal = null;
    }

    _collection = null;
    _format = null;
    _textarea = null;
  }, _this.destroy);

  /**
   * Format collection for download.
   */
  _this.render = function () {
    _textarea.value = _format(_collection);
  };

  /**
   * Show the download view, calls render before showing modal.
   */
  _this.show = function () {
    if (!_modal) {
      _modal = new ModalView(_this.el, {
        title: _title
      });
    }

    _this.render();
    _modal.show();
    _textarea.select();
  };

  _initialize();
  return _this;
};

module.exports = DownloadView;
},{"../util/Util":"util/Util","./ModalView":"mvc/ModalView","./View":"mvc/View"}],"mvc/FileInputView":[function(require,module,exports){
'use strict';


var Collection = require('mvc/Collection'),
    CollectionView = require('mvc/CollectionView'),
    ModalView = require('mvc/ModalView'),
    Model = require('mvc/Model'),
    View = require('mvc/View'),

    FileIO = require('util/FileIO'),
    Message = require('util/Message'),
    Util = require('util/Util');


var _FILE_SIZE_SUFFIXES = ['B', 'KB', 'MB', 'GB'];

var _DEFAULT_INTRO_TEXT = [
  'You may &ldquo;Browse&rdquo; for files, or drag-and-drop files using the ',
  'area below. Once you have added files, you may preview them by clicking ',
  'the blue file name. Preview behavior is browser-dependent. If you select ',
  'a file with the same name more than once, then only the most recent ',
  'selection will be used. Directories are not supported.'
].join('');

// Default values to be used by constructor
var _DEFAULTS = {
  browseText: 'Browse',

  cancelCallback: function () {},
  cancelText: 'Cancel',
  cancelTooltip: 'Cancel',

  dropzoneText: 'Drag &amp; drop file(s) here&hellip;',

  intro: {
    text: _DEFAULT_INTRO_TEXT,
    classes: 'alert info'
  },

  title: 'File Input',

  uploadCallback: function () {},
  uploadText: 'Upload',
  uploadTooltip: 'Upload file(s)'
};


/**
 * Private inner class. This is a view for rendering individual files in
 * a list-type format. It is provided to the CollectionView as the factory.
 *
 */
var FileView = function (params) {
  var _this,
      _initialize,

      _collection,
      _delete,
      _fileName,
      _fileSize,

      _bindEventListeners,
      _createViewSkeleton,
      _formatFileSize,
      _onDeleteClick,
      _unbindEventListeners;


  _this = View(params);

  _initialize = function (/*params*/) {
    _collection = params.collection;
    _createViewSkeleton();
    _bindEventListeners();

    _this.render();
  };


  _bindEventListeners = function () {
    _delete.addEventListener('click', _onDeleteClick);
  };

  _createViewSkeleton = function () {
    _this.el.classList.add('file-view');

    _this.el.innerHTML = [
      '<span class="file-view-label">',
        '<a href="javascript:void(null);" target="_blank" ',
            'class="file-view-name"></a>',
        '<span class="file-view-size"></span>',
      '</span>',
      '<a href="javascript:void(null);" class="file-view-delete" ',
          'title="Delete File">&times;</a>'
    ].join('');

    _fileName = _this.el.querySelector('.file-view-name');
    _fileSize = _this.el.querySelector('.file-view-size');
    _delete = _this.el.querySelector('.file-view-delete');
  };

  _formatFileSize = function (size) {
    var numDecimals,
        suffixIndex;

    numDecimals = 0;
    suffixIndex = 0;

    while (size > 1024 && suffixIndex < _FILE_SIZE_SUFFIXES.length) {
      size /= 1024;
      suffixIndex++;
    }

    if (size - parseInt(size, 10) !== 0) {
      numDecimals = 1;
    }

    return size.toFixed(numDecimals) + _FILE_SIZE_SUFFIXES[suffixIndex];
  };

  _onDeleteClick = function () {
    if (_collection) {
      _collection.remove(_this.model);
    }

    _this.destroy();
  };

  _unbindEventListeners = function () {
    _delete.removeEventListener('click', _onDeleteClick);
  };


  _this.destroy = Util.compose(function () {
    _unbindEventListeners();

    _collection = null;
    _delete = null;
    _fileName = null;
    _fileSize = null;

    _bindEventListeners = null;
    _createViewSkeleton = null;
    _formatFileSize = null;
    _onDeleteClick = null;
    _unbindEventListeners = null;

    _initialize = null;
    _this = null;
  }, _this.destroy);

  _this.render = function () {
    var file;

    file = _this.model.get('file');

    _fileName.innerHTML = file.name;
    _fileName.setAttribute('title', file.name);
    _fileName.setAttribute('href', _this.model.get('url'));
    _fileName.setAttribute('download', file.name);

    _fileSize.innerHTML = '(' + _formatFileSize(file.size) + ')';
  };

  _initialize(params);
  params = null;
  return _this;
};


/**
 * Class: FileInputView
 *
 * @param params {Object}
 *      Configuration options. See _DEFAULTS for more details.
 */
var FileInputView = function (params) {
  var _this,
      _initialize,

      _browseButton,
      _cancelCallback,
      _collection,
      _collectionView,
      _dropzone,
      _fileInput,
      _filesContainer,
      _io,
      _messageContainer,
      _modal,
      _uploadCallback,

      _bindEventListeners,
      _createViewSkeleton,
      _handleFile,
      _onBrowseClick,
      _onCancelClick,
      _onDragLeave,
      _onDragOver,
      _onDrop,
      _onReadError,
      _onReadSuccess,
      _onUploadClick,
      _showError,
      _unbindEventListeners;


  // Inherit from parent class
  _this = View(params);

  /**
   * @constructor
   *
   */
  _initialize = function (params) {
    // Enumerate each property expected to be given in params method
    params = Util.extend({}, _DEFAULTS, params);

    _collection = Collection([]);
    _io = FileIO();

    _uploadCallback = params.uploadCallback;
    _cancelCallback = params.cancelCallback;

    _createViewSkeleton(params);
    _bindEventListeners();

    _modal = ModalView(_this.el, {
      title: params.title,
      buttons: [
        {
          text: params.uploadText,
          title: params.uploadTooltip,
          callback: _onUploadClick
        },
        {
          text: params.cancelText,
          title: params.cancelTooltip,
          callback: _onCancelClick
        }
      ],
      classes: ['file-input']
    });
  };


  _bindEventListeners = function () {
    _dropzone.addEventListener('dragleave', _onDragLeave);
    _dropzone.addEventListener('dragover', _onDragOver);
    _dropzone.addEventListener('drop', _onDrop);

    _browseButton.addEventListener('click', _onBrowseClick);
    _fileInput.addEventListener('change', _onDrop);
  };

  _createViewSkeleton = function (params) {
    var intro;

    _this.el.innerHTML = [
      '<input type="file" class="file-input-input" multiple/>',
      '<div class="file-input-dropzone">',
        '<span class="file-input-dropzone-text">',
          params.dropzoneText,
        '</span>',
        '<button class="file-input-browse-button">',
          params.browseText,
        '</button>',
      '</div>',
      '<div class="file-input-messages"></div>',
      '<ul class="file-input-files no-style"></ul>'
    ].join('');

    if (params.intro) {
      if (params.intro instanceof Node) {
        intro = params.intro;
      } else if (typeof params.intro === 'string') {
        intro = document.createElement('div');
        intro.innerHTML = params.intro;
      } else {
        intro = document.createElement('div');
        intro.innerHTML = params.intro.text || '';
        if (params.intro.classes) {
          intro.className = params.intro.classes;
        }
      }

      intro.classList.add('file-input-intro');

      _this.el.insertBefore(intro, _this.el.firstChild);
    }


    _dropzone = _this.el.querySelector('.file-input-dropzone');
    _browseButton = _this.el.querySelector('.file-input-browse-button');
    _fileInput = _this.el.querySelector('.file-input-input');
    _filesContainer = _this.el.querySelector('.file-input-files');
    _messageContainer = _this.el.querySelector('.file-input-messages');

    _collectionView = CollectionView({
      collection: _collection,
      el: _filesContainer,
      factory: FileView
    });
  };

  _handleFile = function (file) {
    try {
      // Get the data URL
      _io.read({
        file: file,
        success: _onReadSuccess,
        error: _onReadError
      });
    } catch (e) {
      _showError(e.message);
    }
  };

  _onBrowseClick = function () {
    var evt;

    if (_fileInput.click) {
      _fileInput.click();
    } else {
      evt = document.createEvent('HTMLEvents');
      evt.initEvent('click', true, true);
      _fileInput.dispatchEvent(evt);
    }
  };

  _onCancelClick = function () {
    _cancelCallback();
    _this.hide();
  };

  _onDragLeave = function (e) {
    e.preventDefault();
    _dropzone.classList.remove('drag-over');
  };

  _onDragOver = function (e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    _dropzone.classList.add('drag-over');
  };

  _onDrop = function (e) {
    var files,
        i;

    _onDragLeave(e);

    files = e.target.files || e.dataTransfer.files;
    for (i = 0; i < files.length; i++) {
      _handleFile(files[i]);
    }

    _fileInput.value = '';
  };

  _onReadError = function (params) {
    var error;

    error = [
      'An error occurred reading &ldquo;', params.file.name, '&rdquo;.',
      '<br/>',
      '<small>', params.error.message, '</small>'
    ].join('');

    _showError(error);
  };

  _onReadSuccess = function (params) {
    var oldFile;

    params.id = params.file.name;

    try {
      oldFile = _collection.get(params.id);

      if (oldFile) {
        oldFile.set(params);
        _showError(
          'A file name &ldquo;' + params.file.name + '&rdquo; was already ' +
          'selected. That file has been replaced by this file. To load both ' +
          'files, please rename one of the files.', 'info'
        );
      } else {
        _collection.add(Model(params));
      }
    } catch (e) {
      _showError(e.message);
    }
  };

  _onUploadClick = function () {
    _uploadCallback(_collection.data().slice(0));
    _this.hide();
  };

  _showError = function (error, type) {
    Message({
      container: _messageContainer,
      content: error,

      autoclose: false,
      classes: [type || 'error']
    });
  };

  _unbindEventListeners = function () {
    _dropzone.removeEventListener('dragleave', _onDragLeave);
    _dropzone.removeEventListener('dragover', _onDragOver);
    _dropzone.removeEventListener('drop', _onDrop);

    _browseButton.removeEventListener('click', _onBrowseClick);
    _fileInput.removeEventListener('change', _onDrop);
  };


  _this.destroy = Util.compose(function () {
    _unbindEventListeners();

    _collectionView.destroy();
    _collection.destroy();
    _io.destroy();
    _modal.destroy();

    _browseButton = null;
    _cancelCallback = null;
    _collection = null;
    _collectionView = null;
    _dropzone = null;
    _fileInput = null;
    _filesContainer = null;
    _io = null;
    _messageContainer = null;
    _modal = null;
    _uploadCallback = null;

    _bindEventListeners = null;
    _createViewSkeleton = null;
    _handleFile = null;
    _onBrowseClick = null;
    _onCancelClick = null;
    _onDragLeave = null;
    _onDragOver = null;
    _onDrop = null;
    _onReadError = null;
    _onReadSuccess = null;
    _onUploadClick = null;
    _showError = null;
    _unbindEventListeners = null;

    _initialize = null;
    _this = null;
  }, _this.destroy);

  _this.hide = function () {
    _modal.hide();
  };

  _this.show = function (clean) {
    if (clean) {
      _collection.reset([]);
      _messageContainer.innerHTML = '';
    }

    _modal.show();
  };


  // Always call the constructor
  _initialize(params);
  params = null;
  return _this;
};


module.exports = FileInputView;

},{"mvc/Collection":"mvc/Collection","mvc/CollectionView":"mvc/CollectionView","mvc/ModalView":"mvc/ModalView","mvc/Model":"mvc/Model","mvc/View":"mvc/View","util/FileIO":"util/FileIO","util/Message":"util/Message","util/Util":"util/Util"}],"mvc/ModalView":[function(require,module,exports){
'use strict';
/**
 * Generic class for modal dialog views. Modal dialogs present a blocking
 * interface to the user and require user-interaction in order to be closed
 * (i.e. clicking a button etc...).
 *
 * It is important to note that while the interface appears blocked while a
 * modal dialog is open, Javascript continues to execute in the background.
 *
 * Only one modal dialog can be visible at any given time.
 *
 * If a second modal dialog is opened while the first modal dialog is still
 * visible, the first modal dialog is hidden and the second is shown. Upon
 * closing the second modal dialog, the first modal dialog is re-shown (unless
 * the "clear" method is passed to the hide method). This process continues in a
 * last-in, first-out (stack) ordering until all modal dialogs are closed.
 *
 */

var Util = require('../util/Util'),
    View = require('./View');


var __INITIALIZED__ = false,
    _DIALOG_STACK = null,
    _FOCUS_STACK = null,
    _MASK = null,
    _DEFAULTS = {
      closable: true, // Should modal box include little "X' in corner
      destroyOnHide: false,
      title: document.title + ' Says...'
    };

var _static_initialize = function () {
  // Create the dialog stack
  _DIALOG_STACK = [];

  // Create the focus stack
  _FOCUS_STACK = [];

  // Create the modal mask
  _MASK = document.createElement('div');
  _MASK.classList.add('modal');

  __INITIALIZED__ = true;
};

// Note: "this" is a reference to the buttom DOM element and has all the
//       proper attributes set on it such that the implementation below is
//       correct. It does *not* need to use _this (also it's a static method).
var _buttonCallback = function (evt) {
  if (this.info && this.info.callback &&
      typeof this.info.callback === 'function') {
    this.info.callback(evt, this.modal||{});
  }
};

/**
 * Pulls the next element off the focus stack and attempts to set the
 * focus to it.
 *
 */
var _focusNext = function () {
  var node;

  node = _FOCUS_STACK.pop();

  if (node && node instanceof Node && node.focus) {
    node.focus();
  }
};

var ModalView = function (message, params) {
  var _this,
      _initialize,

      _buttons,
      _classes,
      _closable,
      _closeButton,
      _content,
      _destroyOnHide,
      _footer,
      _message,
      _title,
      _titleEl,

      _createButton,
      _createViewSkeleton,
      _onKeyDown,
      _onModalClick;


  params = Util.extend({}, _DEFAULTS, params);
  _this = View(params);

  _initialize = function () {

    _buttons = params.buttons;
    _classes = params.classes;
    _closable = params.closable;
    _destroyOnHide = params.destroyOnHide;
    _message = message;
    _title = params.title;

    _this.el.modal = _this;

    _createViewSkeleton();
    _this.render();

    if (!__INITIALIZED__) {
      _static_initialize();
    }

    params = null;
  };


  _createButton = function (info) {
    var i,
        len,
        button = document.createElement('button'),
        buttonInfo;

    buttonInfo = Util.extend({}, {
      classes: [],
      text: 'Click Me',
      title: '',
      callback: function () {}
    }, info);

    for (i = 0, len = buttonInfo.classes.length; i < len; i++) {
      button.classList.add(buttonInfo.classes[i]);
    }

    button.innerHTML = buttonInfo.text;

    if (buttonInfo.title !== '') {
      button.setAttribute('title', buttonInfo.title);
    }

    button.modal = _this;
    button.info = buttonInfo;

    if (buttonInfo.callback) {
      button.addEventListener('click', _buttonCallback);
    }

    return button;
  };

  _createViewSkeleton = function () {
    var header, i, len;

    Util.empty(_this.el);
    _this.el.classList.add('modal-dialog');

    // Add custom classes to the view
    if (_classes && _classes.length > 0) {
      for (i = 0, len = _classes.length; i < len; i++) {
        _this.el.classList.add(_classes[i]);
      }
    }

    if (_title) {
      header = _this.el.appendChild(document.createElement('header'));
      header.classList.add('modal-header');

      _titleEl = header.appendChild(document.createElement('h3'));
      _titleEl.setAttribute('tabIndex', '-1');
      _titleEl.classList.add('modal-title');


      if (_closable) {
        _closeButton = header.appendChild(document.createElement('span'));
        _closeButton.classList.add('modal-close-link');
        _closeButton.classList.add('material-icons');
        _closeButton.setAttribute('title', 'Close');
        _closeButton.innerHTML = 'close';
        _closeButton.addEventListener('click', _this.hide);
      }
    }  else {
      _this.el.classList.add('no-header');
    }

    _content = _this.el.appendChild(document.createElement('section'));
    _content.setAttribute('tabIndex', '-1');
    _content.classList.add('modal-content');

    if (_buttons && _buttons.length) {
      _footer = _this.el.appendChild(document.createElement('footer'));
      _footer.classList.add('modal-footer');
    } else {
      _this.el.classList.add('no-footer');
    }
  };

  /**
   * This method is bound to the ModalView instance using the
   * Function.prototype.bind method, thus the reference to "this" is correct
   * even though this is a keydown event handler.
   *
   * @param event {KeyEvent}
   *      The event that triggered this call.
   */
  _onKeyDown = function (event) {
    if (event.keyCode === 27) {
      _this.hide();
    }
  };


  _onModalClick = function (event) {
    if (event.target.className === 'modal') {
      _this.hide();
    }
  };

  /**
   * Remove event listeners and free references.
   *
   * You should call hide first.
   */
  _this.destroy = function () {
    var button;

    _MASK.removeEventListener('click', _this.hide);

    if (_buttons && _buttons.length) {
      while (_footer.childNodes.length > 0) {
        button = _footer.firstChild;
        button.removeEventListener('click', _buttonCallback);
        _footer.removeChild(button);
      }
    }

    if (_closeButton) {
      _closeButton.removeEventListener('click', _this.hide);
      _closeButton = null;
    }

    delete _this.el.modal;

    _footer = null;
    _titleEl = null;
    _content = null;
    _destroyOnHide = null;
    _this.el = null;
    _onModalClick = null;
  };

  _this.hide = function (clearAll) {
    var isVisible;

    isVisible = (_this.el.parentNode === _MASK);

    if (clearAll === true) {
      // Remove any/all dialogs attached to _MASK
      Util.empty(_MASK);

      // Clear stack of previous dialogs to return user to normal application.
      _DIALOG_STACK.splice(0, _DIALOG_STACK.length);

      // Clear all but last focus element
      _FOCUS_STACK.splice(1, _FOCUS_STACK.length);

      _focusNext();

      if (isVisible) { // Or rather, was visible
        _this.trigger('hide', _this);

        if (_destroyOnHide) {
          _this.destroy();
        }
      }
    } else if (isVisible) {
      // This modal is currently visible
      _this.el.parentNode.removeChild(_this.el);

      // Check if any other dialogs exist in stack, if so, show it
      if (_DIALOG_STACK.length > 0) {
        _DIALOG_STACK.pop().show();
      }

      _focusNext();
      _this.trigger('hide', _this);

      if (_destroyOnHide) {
        _this.destroy();
      }
    }

    if (!_MASK.firstChild && _MASK.parentNode) {
      // No more dialogs, remove the _MASK
      _MASK.parentNode.removeChild(_MASK);
      _MASK.removeEventListener('click', _onModalClick);

      document.body.classList.remove('backgroundScrollDisable');
      window.removeEventListener('keydown', _onKeyDown);
    }

    return _this;
  };

  _this.render = function (message) {
    var m = message || _message,
        button = null,
        buttons = _buttons || [],
        i, len = buttons.length;

    // Set the modal dialog content
    Util.empty(_content);

    if (typeof m === 'string') {
      _content.innerHTML = m;
    } else if (typeof m === 'function') {
      return _this.render(m(_this));
    } else if (m instanceof Node) {
      _content.appendChild(m);
    }

    // Set the modal dialog title
    if (_title) {
      _titleEl.innerHTML = _title;
    }

    // Clear any old footer content
    if (_buttons && _buttons.length) {
      while (_footer.childNodes.length > 0) {
        button = _footer.firstChild;
        Util.removeEvent(button, 'click', _buttonCallback);
        _footer.removeChild(button);
      }
    }

    // Set new footer content
    for (i = 0; i < len; i++) {
      _footer.appendChild(_createButton(buttons[i]));
    }

    _this.trigger('render', _this);
    return _this;
  };

  _this.setMessage = function (message) {
    _message = message;

    _this.trigger('message', _this);
    return _this;
  };

  _this.setOptions = function (params, extend) {
    if (extend) {
      params = Util.extend({}, {
        buttons: _buttons,
        classes: _classes,
        closable: _closable,
        message: _message,
        title: _title
      }, params);
    }

    _buttons = params.buttons;
    _classes = params.classes;
    _closable = params.closable;
    _message = message;
    _title = params.title;

    _this.trigger('options', _this);
    return _this;
  };

  _this.show = function () {
    var oldChild = null;

    // For accessibility, focus the top of this new dialog
    _FOCUS_STACK.push(document.activeElement || false);

    // Mask already has a dialog in it, add to dialog stack and continue
    while (_MASK.firstChild) {
      oldChild = _MASK.firstChild;
      if (oldChild.modal) {
        _DIALOG_STACK.push(oldChild.modal);
      }
      _MASK.removeChild(oldChild);
    }

    // Add this dialog to the mask
    _MASK.appendChild(_this.el);
    _MASK.addEventListener('click', _onModalClick);

    // Show the mask if not yet visible
    if (!_MASK.parentNode) {
      document.body.appendChild(_MASK);
      document.body.classList.add('backgroundScrollDisable');
      window.addEventListener('keydown', _onKeyDown);
    }


    if (_title) {
      _titleEl.focus();
    } else {
      _content.focus();
    }

    _this.trigger('show', _this);
    return _this;
  };

  _initialize();
  return _this;
};

module.exports = ModalView;

},{"../util/Util":"util/Util","./View":"mvc/View"}],"mvc/Model":[function(require,module,exports){
'use strict';

var Events = require('../util/Events'),
    Util = require('../util/Util');

/**
 * Constructor
 *
 * @param data {Object}
 *      key/value attributes of this model.
 */
var Model = function (data) {
  var _this,
      _initialize,

      _model;


  _this = Events();

  _initialize = function () {
    _model = Util.extend({}, data);

    // track id at top level
    if (data && data.hasOwnProperty('id')) {
      _this.id = data.id;
    }

    data = null;
  };

  /**
   * Get one or more values.
   *
   * @param key {String}
   *      the value to get; when key is undefined, returns the object with all
   *      values.
   * @return
   *      - if key is specified, the value or null if no value exists.
   *      - when key is not specified, the underlying object is returned.
   *        (Any changes to this underlying object will not trigger events!!!)
   */
  _this.get = function (key) {
    if (typeof(key) === 'undefined') {
      return _model;
    }

    if (_model.hasOwnProperty(key)) {
      return _model[key];
    }

    return null;
  };

  /**
   * Update one or more values.
   *
   * @param data {Object}
   *      the keys and values to update.
   * @param options {Object}
   *      options for this method.
   * @param options.silent {Boolean}
   *      default false. true to suppress any events that would otherwise be
   *      triggered.
   */
  _this.set = function (data, options) {
    // detect changes
    var changed = {},
      anyChanged = false,
      c;

    for (c in data) {
      if (!_model.hasOwnProperty(c) || _model[c] !== data[c]) {
        changed[c] = data[c];
        anyChanged = true;
      }
    }

    // persist changes
    _model = Util.extend(_model, data);

    // if id is changing, update the model id
    if (data && data.hasOwnProperty('id')) {
      _this.id = data.id;
    }

    if (options && options.hasOwnProperty('silent') && options.silent) {
      // don't trigger any events
      return;
    }

    // trigger events based on changes
    if (anyChanged ||
        (options && options.hasOwnProperty('force') && options.force)) {
      for (c in changed) {
        // events specific to a property
        _this.trigger('change:' + c, changed[c]);
      }
      // generic event for any change
      _this.trigger('change', changed);
    }
  };

  /**
   * Override toJSON method to serialize only model data.
   */
  _this.toJSON = function () {
    var json = Util.extend({}, _model),
        key,
        value;

    for (key in json) {
      value = json[key];

      if (typeof value === 'object' &&
          value !== null &&
          typeof value.toJSON === 'function') {
        json[key] = value.toJSON();
      }
    }

    return json;
  };


  _initialize();
  return _this;
};

module.exports = Model;

},{"../util/Events":"util/Events","../util/Util":"util/Util"}],"mvc/SelectView":[function(require,module,exports){
'use strict';
/**
 * This class provides a simple select box widget for selecting an item
 * out of a collection. Best used on short-ish collections.
 *
 */

var Util = require('../util/Util'),
    View = require('./View');


var _SELECT_VIEW_COUNTER = 0;
var _DEFAULTS = {
  includeBlankOption: false,
  blankOption: {
    value: '-1',
    text: 'Please select&hellip;'
  }
};


var SelectView = function (params) {
  var _this,
      _initialize,

      _blankOption,
      _collection,
      _idstub,
      _includeBlankOption,
      _selectBox,

      _createBlankOption,
      _createItemMarkup,
      _getDOMIdForItem,
      _getModelIdForOption,
      _onCollectionAdd,
      _onCollectionDeselect,
      _onCollectionRemove,
      _onCollectionReset,
      _onCollectionSelect,
      _onSelectBoxChange;


  params = Util.extend({}, _DEFAULTS, params);
  _this = View(params);


  _initialize = function () {

    _collection = params.collection || null;
    _blankOption = params.blankOption;
    _includeBlankOption = params.includeBlankOption;
    _this.el = params.el || document.createElement('select');

    _idstub = 'selectview-' + _SELECT_VIEW_COUNTER + '-';
    _SELECT_VIEW_COUNTER += 1;


    // Make a private DOM element. If _this.el is already a select DOM element,
    // then just use that, otherwise, create a new element and append it to
    // _this.el
    if (_this.el.nodeName === 'SELECT') {
      _selectBox = _this.el;
    } else {
      _selectBox = _this.el.appendChild(document.createElement('select'));
    }
    _selectBox.classList.add('view-selectview');

    // Bind to events on the collection
    if (_collection) {
      _collection.on('add', _onCollectionAdd, _this);
      _collection.on('remove', _onCollectionRemove, _this);
      _collection.on('reset', _onCollectionReset, _this);
      _collection.on('select', _onCollectionSelect, _this);
      _collection.on('deselect', _onCollectionDeselect, _this);
    }

    // Bind to events on _selectBox
    _selectBox.addEventListener('change', _onSelectBoxChange);

    _this.render();
    params = null;
  };


  _createItemMarkup = function (item) {
    return [
    '<option ',
        'id="', _getDOMIdForItem(item), '" ',
        'value="', item.get('value'), '">',
      item.get('display'),
    '</option>'
    ].join('');
  };

  _createBlankOption = function () {
    return [
    '<option ',
        'value="', _blankOption.value, '">',
      _blankOption.text,
    '</option>'
    ].join('');
  };

  _getDOMIdForItem = function (item) {
    return _idstub + item.get('id');
  };

  _getModelIdForOption = function (element) {
    return element.id.replace(_idstub, '');
  };

  _onCollectionAdd = function () {
    _this.render();
  };

  _onCollectionDeselect = function (oldSelected) {
    var selectedDOM = _selectBox.querySelector(
        '#' + _getDOMIdForItem(oldSelected));

    if (selectedDOM) {
      selectedDOM.removeAttribute('selected');
    }

    if (_includeBlankOption) {
      selectedDOM = _selectBox.querySelector('[value="' + _blankOption.value + '"]');
      if (selectedDOM) {
        selectedDOM.setAttribute('selected', 'selected');
      }
    }

  };

  _onCollectionRemove = function () {
    _this.render();
  };

  _onCollectionReset = function () {
    _this.render();
  };

  _onCollectionSelect = function (selectedItem) {
    var selectedDOM = _selectBox.querySelector(
        '#' + _getDOMIdForItem(selectedItem));

    if (selectedDOM) {
      selectedDOM.setAttribute('selected', 'selected');
    }
  };

  _onSelectBoxChange = function () {
    var selectedIndex = _selectBox.selectedIndex,
        selectedDOM = _selectBox.childNodes[selectedIndex],
        selectedId = _getModelIdForOption(selectedDOM);
    if (_includeBlankOption && _selectBox.value === _blankOption.value) {
      _collection.deselect();
    } else {
      _collection.select(_collection.get(selectedId));
    }
  };


  _this.render = function () {
    var i = null,
        items = null,
        numItems = null,
        selected = null,
        markup = [];

    // If no collection available, just clear the options and return
    if (!_collection) {
      _selectBox.innerHTML = '';
      return;
    }

    // Set the select box option items
    items = _collection.data();

    if (!items) {
      _selectBox.innerHTML = '';
      return;
    }

    items = items.slice(0);
    numItems = items.length;

    if (_includeBlankOption === true) {
      markup.push(_createBlankOption());
    }

    for (i = 0; i < numItems; i++) {
      markup.push(_createItemMarkup(items[i]));
    }

    _selectBox.innerHTML = markup.join('');

    // Now select the currently selected item (if one is selected)
    selected = _collection.getSelected();
    if (selected) {
      _onCollectionSelect(selected);
    }
  };


  _initialize();
  return _this;
};

module.exports = SelectView;

},{"../util/Util":"util/Util","./View":"mvc/View"}],"mvc/SelectedCollectionView":[function(require,module,exports){
'use strict';

var Collection = require('./Collection'),

    Events = require('../util/Events');


/** create a new view based on a collection of models. */
var SelectedCollectionView = function (params) {
  var _this,
      _initialize,

      _destroyCollection;

  _this = Events();

  /**
   * @constructor
   *
   */
  _initialize = function (params) {
    params = params || {};

    // Element where this view is rendered
    _this.el = (params.hasOwnProperty('el')) ?
        params.el : document.createElement('div');

    _this.collection = params.collection;

    if (!_this.collection) {
      _this.collection = Collection();
      _destroyCollection = true;
    }

    if (_this.collection.getSelected()) {
      _this.onCollectionSelect();
    }

    _this.collection.on('deselect', 'onCollectionDeselect', _this);
    _this.collection.on('reset', 'onCollectionReset', _this);
    _this.collection.on('select', 'onCollectionSelect', _this);
  };

  /**
   * clean up the view
   */
  _this.destroy = function () {
    // undo event bindings
    if (_this.model) {
      _this.onCollectionDeselect();
    }
    _this.collection.off('deselect', 'onCollectionDeselect', _this);
    _this.collection.off('reset', 'onCollectionReset', _this);
    _this.collection.off('select', 'onCollectionSelect', _this);

    if (_destroyCollection) {
      _this.collection.destroy();
    }

    _destroyCollection = null;

    _this = null;
    _initialize = null;
  };

  /**
   * unset the event bindings for the collection
   */
  _this.onCollectionDeselect = function () {
    if (_this.model) {
      _this.model.off('change', 'render', _this);
      _this.model = null;
    }
    _this.render({model: _this.model});
  };

  /**
   * unset event bindings for the collection, if set.
   */
  _this.onCollectionReset = function () {
    if (_this.model) {
      _this.model.off('change', 'render', _this);
      _this.model = null;
    }
    _this.render({model: _this.model});
  };

  /**
   * set event bindings for the collection
   */
  _this.onCollectionSelect = function () {
    _this.model = _this.collection.getSelected();
    _this.model.on('change', 'render', _this);
    _this.render({model: _this.model});
  };

  /**
   * render the selected model in the view
   */
  _this.render = function () {};

  _initialize(params);
  params = null;
  return _this;
};

module.exports = SelectedCollectionView;

},{"../util/Events":"util/Events","./Collection":"mvc/Collection"}],"mvc/SortView":[function(require,module,exports){
'use strict';

var Collection = require('./Collection'),
    CollectionSelectBox = require('./CollectionSelectBox'),
    Util = require('../util/Util'),
    View = require('./View');

/**
 * Construct a SortView.
 *
 * Sort objects can specify a custom sort function (sort),
 * or a value to be sorted (sortBy) and sort order (descending).
 *
 * @param options {Object}
 * @param options.sorts {Array<Object>}
 *        array of sort objects, with properties:
 *        - id {String|Number} unique identifier for sort
 *        - title {String} display name for sort
 *        And:
 *        - sort {Function(a, b)} sorting function.
 *        Or:
 *        - sortBy {Function(Object)} return value for sorting.
 *        - descending {Boolean} default false, whether to
 *          sort ascending (true) or descending (false).
 * @param options.defaultSort {ID}
 *        Optional.
 *        If specified, should match "id" of a sort object.
 * @see mvc/View
 */
var SortView = function (params) {
  var _this,
      _initialize,

      _collection,
      _selectView,
      _sortCollection,

      _getSortFunction,
      _onSelect;


  _this = View(params);

  /**
   * Initialize the SortView.
   */
  _initialize = function () {
    var el = _this.el;

    _collection = params.collection;

    el.innerHTML = '<label>Sort by <select></select></label>';
    el.classList.add('sortview');

    _sortCollection = new Collection(params.sorts);
    _sortCollection.on('select', _onSelect, this);

    // initial sort order
    if (params.defaultSort) {
      _sortCollection.select(_sortCollection.get(params.defaultSort));
    } else {
      _sortCollection.select(_sortCollection.data()[0]);
    }

    _selectView = new CollectionSelectBox({
      el: el.querySelector('select'),
      collection: _sortCollection,
      format: function (item) {
        return item.title;
      }
    });

    params = null;
  };


  /**
   * Convert a sortBy function to a sort function.
   *
   * @param sortBy {Function(Object)}
   *        function that returns sort key.
   * @param descending {Boolean}
   *        Default false.
   *        Whether to sort ascending (false) or descending (true).
   * @return {Function(a, b)} sort function.
   */
  _getSortFunction = function (sortBy, descending) {
    var cache = {};

    return function (a, b) {
      var aval = cache[a.id],
          bval = cache[b.id],
          tmp;

      if (!aval) {
        aval = cache[a.id] = sortBy(a);
      }
      if (!bval) {
        bval = cache[b.id] = sortBy(b);
      }

      if (descending) {
        // swap comparison order
        tmp = bval;
        bval = aval;
        aval = tmp;
      }

      if (aval < bval) {
        return -1;
      } else if (aval > bval) {
        return 1;
      } else {
        return 0;
      }
    };
  };

  /**
   * Handle sort collection select event.
   */
  _onSelect = function () {
    var selected = _sortCollection.getSelected(),
        sort;

    if (selected) {
      sort = selected.sort;
      if (!sort) {
        sort = _getSortFunction(selected.sortBy, selected.descending);
      }
      _collection.sort(sort);
    }
  };


  /**
   * Destroy the SortView.
   */
  _this.destroy = Util.compose(function () {
    _sortCollection.off('select', _onSelect, this);
    _sortCollection = null;
    _collection = null;
    _selectView.destroy();
  }, _this.destroy);


  _initialize();
  return _this;
};

module.exports = SortView;
},{"../util/Util":"util/Util","./Collection":"mvc/Collection","./CollectionSelectBox":"mvc/CollectionSelectBox","./View":"mvc/View"}],"mvc/View":[function(require,module,exports){
'use strict';
/**
 * A lightweight view class.
 *
 * Primarily manages an element where a view can render its data.
 */


var Model = require('./Model'),

    Events = require('../util/Events'),
    Util = require('../util/Util');


var _DEFAULTS = {
};


/** create a new view. */
var View = function (params) {
  var _this,
      _initialize,

      _destroyModel;


  _this = Events();

  /**
   * @constructor
   *
   */
  _initialize = function (params) {
    params = Util.extend({}, _DEFAULTS, params);

    // Element where this view is rendered
    _this.el = (params && params.hasOwnProperty('el')) ?
        params.el : document.createElement('div');

    _this.model = params.model;

    if (!_this.model) {
      _this.model = Model({});
      _destroyModel = true;
    }

    _this.model.on('change', 'render', _this);
  };


  /**
   * API Method
   *
   * Renders the view
   */
  _this.render = function () {
    // Impelementations should update the view based on the current
    // model properties.
  };

  /**
   * API Method
   *
   * Cleans up resources allocated by the view. Should be called before
   * discarding a view.
   */
  _this.destroy = Util.compose(function () {
    if (_this ===  null) {
      return; // already destroyed
    }

    _this.model.off('change', 'render', _this);

    if (_destroyModel) {
      _this.model.destroy();
    }

    _destroyModel = null;

    _this.model = null;
    _this.el = null;

    _initialize = null;
    _this = null;
  }, _this.destroy);


  _initialize(params);
  params = null;
  return _this;
};

module.exports = View;

},{"../util/Events":"util/Events","../util/Util":"util/Util","./Model":"mvc/Model"}],"shakemap-view/App":[function(require,module,exports){
'use strict';

var EventsView = require('shakemap-view/events/EventsView'),
    LoadingView = require('shakemap-view/loading/LoadingView'),
    MapView = require('shakemap-view/maps/MapView'),
    View = require('hazdev-webutils/src/mvc/View'),
    Util = require('hazdev-webutils/src/util/Util');

var App = function App(options) {
    var _this, _initialize;

    options = Util.extend({}, {}, options);
    _this = View(options);

    _initialize = function _initialize() /*options*/{
        _this.el.classList.add('sm-view-app');

        _this.el.innerHTML = '<div class="loading-view"></div>' + '<div class="events"></div>' + '<div class="map-view" style="height:100%;width:100%;position:relative;"></div>';

        _this.mapView = MapView({
            el: _this.el.querySelector('.map-view'),
            model: _this.model
        });

        _this.eventsView = EventsView({
            el: _this.el.querySelector('.events'),
            model: _this.model
        });

        _this.loadingView = LoadingView({
            el: _this.el.querySelector('.loading-view'),
            model: _this.model
        });
    };

    _initialize(options);
    options = null;
    return _this;
};

module.exports = App;

},{"hazdev-webutils/src/mvc/View":"mvc/View","hazdev-webutils/src/util/Util":"util/Util","shakemap-view/events/EventsView":1,"shakemap-view/loading/LoadingView":2,"shakemap-view/maps/MapView":3}],"shakemap-view/ShakeMapModel":[function(require,module,exports){
'use strict';

var Model = require('hazdev-webutils/src/mvc/Model'),
    Util = require('hazdev-webutils/src/util/Util');

var ShakeMapModel = function ShakeMapModel(options) {
    var _this;

    _this = Model(Util.extend({}, { productsUrl: '/products.json',
        events: [],
        event: null,
        layers: [],
        defaultLayers: ['Epicenter', 'PGA Contours'],
        loading: false }, options));

    return _this;
};

module.exports = ShakeMapModel;

},{"hazdev-webutils/src/mvc/Model":"mvc/Model","hazdev-webutils/src/util/Util":"util/Util"}],"util/Events":[function(require,module,exports){
'use strict';

var __INSTANCE__ = null;


var __is_string = function (obj) {
  return (typeof obj === 'string' || obj instanceof String);
};


var Events = function () {
  var _this,
      _initialize,

      _listeners;


  _this = {};

  _initialize = function () {
    // map of listeners by event type
    _listeners = {};
  };


  /**
   * Free all references.
   */
  _this.destroy = function () {
    _initialize = null;
    _listeners = null;
    _this = null;
  };

  /**
   * Remove an event listener
   *
   * Omitting callback clears all listeners for given event.
   * Omitting event clears all listeners for all events.
   *
   * @param event {String}
   *      event name to unbind.
   * @param callback {Function}
   *      callback to unbind.
   * @param context {Object}
   *      context for "this" when callback is called
   */
  _this.off = function (evt, callback, context) {
    var i;

    if (typeof evt === 'undefined') {
      // removing all listeners on this object
      _listeners = null;
      _listeners = {};
    } else if (!_listeners.hasOwnProperty(evt)) {
      // no listeners, nothing to do
      return;
    } else if (typeof callback === 'undefined') {
      // removing all listeners for this event
      delete _listeners[evt];
    } else {
      var listener = null;

      // search for callback to remove
      for (i = _listeners[evt].length - 1; i >= 0; i--) {
        listener = _listeners[evt][i];

        if (listener.callback === callback &&
            (!context || listener.context === context)) {

          // found callback, remove
          _listeners[evt].splice(i,1);

          if (context) {
            // found callback with context, stop searching
            break;
          }
        }
      }

      // cleanup if last callback of this type
      if (_listeners[evt].length === 0) {
        delete _listeners[evt];
      }

      listener = null;
    }
  };

  /**
   * Add an event listener
   *
   * @param event {String}
   *      event name (singular).  E.g. 'reset'
   * @param callback {Function}
   *      function to call when event is triggered.
   * @param context {Object}
   *      context for "this" when callback is called
   */
  _this.on = function (event, callback, context) {
    if (!((callback || !callback.apply) ||
        (context && __is_string(callback) && context[callback].apply))) {
      throw new Error('Callback parameter is not callable.');
    }

    if (!_listeners.hasOwnProperty(event)) {
      // first listener for event type
      _listeners[event] = [];
    }

    // add listener
    _listeners[event].push({
      callback: callback,
      context: context
    });
  };

  /**
   * Trigger an event
   *
   * @param event {String}
   *      event name.
   * @param args {…}
   *      variable length arguments after event are passed to listeners.
   */
  _this.trigger = function (event) {
    var args,
        i,
        len,
        listener,
        listeners;

    if (_listeners.hasOwnProperty(event)) {

      args = Array.prototype.slice.call(arguments, 1);
      listeners = _listeners[event].slice(0);

      for (i = 0, len = listeners.length; i < len; i++) {
        listener = listeners[i];

        // NOTE: if listener throws exception, this will stop...
        if (__is_string(listener.callback)) {
          listener.context[listener.callback].apply(listener.context, args);
        } else {
          listener.callback.apply(listener.context, args);
        }
      }
    }
  };

  _initialize();
  return _this;
};

// make Events a global event source
__INSTANCE__ = Events();
Events.on = function _events_on () {
  return __INSTANCE__.on.apply(__INSTANCE__, arguments);
};
Events.off = function _events_off () {
  return __INSTANCE__.off.apply(__INSTANCE__, arguments);
};
Events.trigger = function _events_trigger () {
  return __INSTANCE__.trigger.apply(__INSTANCE__, arguments);
};

// intercept window.onhashchange events, or simulate if browser doesn't
// support, and send to global Events object
var _onHashChange = function (e) {
  Events.trigger('hashchange', e);
};

// courtesy of:
// http://stackoverflow.com/questions/9339865/get-the-hashchange-event-to-work-in-all-browsers-including-ie7
if (!('onhashchange' in window)) {
  var oldHref = document.location.hash;

  setInterval(function () {
    if (oldHref !== document.location.hash) {
      oldHref = document.location.hash;
      _onHashChange({
        'type': 'hashchange',
        'newURL': document.location.hash,
        'oldURL': oldHref
      });
    }
  }, 300);

} else if (window.addEventListener) {
  window.addEventListener('hashchange', _onHashChange, false);
}

module.exports = Events;

},{}],"util/FileIO":[function(require,module,exports){
'use strict';


var Util = require('util/Util');


// Default values to be used by constructor
var _DEFAULTS = {
   maxFileSize: 209715200 // 200MB
};


/**
 * Class: FileIO
 *
 * @param params {Object}
 *      Configuration options. See _DEFAULTS for more details.
 */
var FileIO = function (params) {
  var _this,
      _initialize,

      _maxFileSize,

      _getReadMethod;


  // Inherit from parent class
  _this = {
    read: null,
    write: null
  };

  /**
   * @constructor
   *
   */
  _initialize = function (params) {
    // Enumerate each property expected to be given in params method
    params = Util.extend({}, _DEFAULTS, params);

    _maxFileSize = params.maxFileSize;
  };

  _getReadMethod = function (params) {
    var reader,
        type;

    reader = params.reader;

    if (!params.hasOwnProperty('url')) {
      return reader.readAsDataURL;
    } else if (params.method && typeof reader[params.method] === 'function') {
      // If specific method is requested then use it
      return reader[params.method];
    }

    // Try to choose a decent method based on file type
    type = params.file.type;

    if (type.indexOf('text') !== -1 || type.indexOf('txt') !== -1 ||
        type === 'application/xml' || type === 'application/json') {
      return reader.readAsText;
    } else {
      return reader.readAsBinaryString;
    }
  };


  _this.destroy = function () {
    _maxFileSize = null;

    _getReadMethod = null;

    _initialize = null;
    _this = null;
  };

  /**
   * Asynchronously read file contents. This method has no return value.
   *
   * @param params {Object}
   *      Parameters given to the method including:
   *      'file': {File} The file object to read
   *      'success': {Function} Callback method to execute on success.
   *      'error': {Function} Callback method to execute on error.
   *      'reader': {FileReader} The reader to use for reading. Optional.
   *      'method': {String} The name of the reader method. Optional.
   *
   * @throws {Error}
   *      If params.file is not provided.
   */
  _this.read = function (params) {
    var method,
        onReadError,
        onReadSuccess,
        onReadComplete,
        reader;

    if (!params || !params.file) {
      throw new Error('Parameters are required for reading.');
    }

    if (params.file.size > _maxFileSize) {
      throw new Error('File size is too large.');
    }

    reader = params.reader = new FileReader();
    method = _getReadMethod(params);

    onReadComplete = function () {
      if (params.success) {
        reader.removeEventListener('load', onReadSuccess);
        onReadSuccess = null;
      }

      if (params.error) {
        reader.removeEventListener('error', onReadError);
        onReadError = null;
      }

      reader.removeEventListener('loadend', onReadComplete);
      onReadComplete = null;

      reader = null;
    };
    reader.addEventListener('loadend', onReadComplete);


    onReadSuccess = function () {

      if (!params.url) {
        params.url = reader.result;
        _this.read(params);
      } else if (params.success) {
        params.success({
          file: params.file,
          content: reader.result,
          method: method.name,
          url: params.url
        });
      }
    };
    reader.addEventListener('load', onReadSuccess);

    if (params.error) {
      onReadError = function (/*event*/) {
        params.error({
          error: reader.error,
          file: params.file,
          result: reader.result
        });
      };

      reader.addEventListener('error', onReadError);
    }

    method.call(reader, params.file);
  };

  _this.write = function (params) {
    var blob,
        url;

    if (!params || !params.content) {
      throw new Error('Parameters are required for writing.');
    }

    blob = new Blob([params.content], {type: params.type || 'text/plain'});

    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, params.name || 'download');
    } else {
      url = window.URL.createObjectURL(blob);
      window.open(url, params.name || 'download');
      window.URL.revokeObjectURL(url);
    }
  };


  // Always call the constructor
  _initialize(params);
  params = null;
  return _this;
};


module.exports = FileIO;

},{"util/Util":"util/Util"}],"util/Message":[function(require,module,exports){
'use strict';

var Events = require('./Events');


var _ID_SEQUENCE = 0;

var __get_id = function () {
  return 'hazdev-webutils-message-' + (_ID_SEQUENCE++);
};


var Message = function (params) {
  var _this,
      _initialize,

      _autoclose,
      _classes,
      _closeable,
      _closeButton,
      _container,
      _content,
      _id,
      _insertBefore,
      _message,

      _createCloseButton,
      _onAlertClose,
      _show;


  _this = Events();

  _initialize = function (params) {
    _id = __get_id();

    _container = params.container || document.body;
    _content = params.content || 'Something just happened...';

    _autoclose = parseInt(params.autoclose, 10) || 0;
    _classes = ['alert', 'webutils-message'].concat(params.classes || []);
    _closeable = params.closeable || true;
    _insertBefore = params.insertBefore || false;

    _show();
  };


  _createCloseButton = function () {
    _closeButton = document.createElement('button');
    _closeButton.setAttribute('href', '#');
    _closeButton.setAttribute('tabindex', '0');
    _closeButton.setAttribute('aria-label', 'Close Alert');
    _closeButton.setAttribute('aria-controls', _id);
    _closeButton.classList.add('webutils-message-close');
    _closeButton.classList.add('material-icons');
    _closeButton.innerHTML = 'close';

    _closeButton.addEventListener('click', _onAlertClose);

    return _closeButton;
  };

  _onAlertClose = function (evt) {
    _this.hide(true);
    return evt.preventDefault();
  };

  _show = function () {
    _message = document.createElement('div');
    _message.setAttribute('id', _id);
    _message.setAttribute('role', 'alert');
    _message.setAttribute('aria-live', 'polite');

    _message.innerHTML = _content;


    _classes.forEach(function (className) {
      _message.classList.add(className);
    });

    if (_closeable) {
      _message.classList.add('webutils-message-closeable');
      _message.appendChild(_createCloseButton());
    }

    if (_autoclose) {
      window.setTimeout(_this.hide, _autoclose);
    }

    if (_container) {
      if (_insertBefore && _container.firstChild) {
        _container.insertBefore(_message, _container.firstChild);
      } else {
        _container.appendChild(_message);
      }
    }
  };


  _this.hide = function (userTriggered) {
      _message.classList.add('invisible');

    window.setTimeout(function () {
        if (_message.parentNode) {
          _message.parentNode.removeChild(_message);
        }

        _this.trigger('hide', {userTriggered: userTriggered});
        _this.destroy();
    }, 262);
  };

  _this.destroy = function () {
    if (_closeButton) {
      _closeButton.removeEventListener('click', _onAlertClose);
    }

    _autoclose = null;
    _classes = null;
    _closeable = null;
    _closeButton = null;
    _container = null;
    _content = null;
    _id = null;
    _insertBefore = null;
    _message = null;

    _createCloseButton = null;
    _onAlertClose = null;
    _show = null;

    _initialize = null;
    _this = null;
  };


  _initialize(params);
  params = null;
  return _this;
};

module.exports = Message;

},{"./Events":"util/Events"}],"util/Util":[function(require,module,exports){
'use strict';

// do these checks once, instead of once per call
var isMobile = false,
    supportsDateInput = false;


// static object with utility methods
var Util = function () {
};


Util.isMobile = function () {
  return isMobile;
};

Util.supportsDateInput = function () {
  return supportsDateInput;
};

/**
 * Merge properties from a series of objects.
 *
 * @param dst {Object}
 *      target where merged properties are copied to.
 * @param <variable> {Object}
 *      source objects for properties. When a source is non null, it's
 *      properties are copied to the dst object. Properties are copied in
 *      the order of arguments: a property on a later argument overrides a
 *      property on an earlier argument.
 */
Util.extend = function (dst) {
  var i, len, src, prop;

  // iterate over sources where properties are read
  for (i = 1, len = arguments.length; i < len; i++) {
    src = arguments[i];
    if (src) {
      for (prop in src) {
        dst[prop] = src[prop];
      }
    }
  }

  // return updated object
  return dst;
};

/**
 * Checks if objects are equal.
 *
 * @param a {Object}
 *      Object a.
 * @param b {Object}
 *      Object b.
 */
Util.equals = function (objA, objB) {
  var keya, keyb;

  if (objA === objB) {
    // if === then ===, no question about that...
    return true;
  } else if (objA === null || objB === null) {
    // funny, typeof null === 'object', so ... hmph!
    return false;
  } else if (typeof objA === 'object' && typeof objB === 'object') {
    // recursively check objects
    for (keya in objA) {
      if (objA.hasOwnProperty(keya)) {
        if (!objB.hasOwnProperty(keya)) {
          return false; // objB is missing a key from objA
        }
      }
    }

    for (keyb in objB) {
      if (objB.hasOwnProperty(keyb)) {
        if (!objA.hasOwnProperty(keyb)) {
          return false; // objA is missing a key from objB
        } else if (!Util.equals(objA[keyb], objB[keyb])) {
          return false; // objA[key] !== objB[key]
        }
      }
    }

    return true; // Recursively equal, so equal
  } else {
    return objA === objB; // Use baked in === for primitives
  }
};

/**
 * Get an event object for an event handler.
 *
 * @param e the event that was received by the event handler.
 * @return {Object}
 *      with two properties:
 *      target
 *           the element where the event occurred.
 *      originalEvent
 *           the event object, either parameter e or window.event (in IE).
 */
Util.getEvent = function (e) {
  var targ;

  if (!e) {
    // ie puts event in global
    e = window.event;
  }

  // find target
  if (e.target) {
    targ = e.target;
  } else if (e.srcElement) {
    targ = e.srcElement;
  }

  // handle safari bug
  if (targ.nodeType === 3) {
    targ = targ.parentNode;
  }

  // return target and event
  return {
    target: targ,
    originalEvent: e
  };
};

/**
 * Get a parent node based on it's node name.
 *
 * @param el {DOMElement}
 *      element to search from.
 * @param nodeName {String}
 *      node name to search for.
 * @param maxParent {DOMElement}
 *      element to stop searching.
 * @return {DOMElement}
 *      matching element, or null if not found.
 */
Util.getParentNode = function (el, nodeName, maxParent) {
  var curParent = el;

  while (curParent && curParent !== maxParent &&
      curParent.nodeName.toUpperCase() !== nodeName.toUpperCase()) {
    curParent = curParent.parentNode;
  }
  if (curParent && 'nodeName' in curParent &&
      curParent.nodeName.toUpperCase() === nodeName.toUpperCase()) {
    // found the desired node
    return curParent;
  }

  // didn't find the desired node
  return null;
};

// remove an elements child nodes
Util.empty = function (el) {
  while (el.firstChild) {
    el.removeChild(el.firstChild);
  }
};

// detach an element from its parent
Util.detach = function (el) {
  if (el.parentNode) {
    el.parentNode.removeChild(el);
  }
};

Util.getWindowSize = function () {
  var dimensions = {width:null,height:null};

  if ('innerWidth' in window && 'innerHeight' in window) {
    dimensions = {
      width: window.innerWidth,
      height: window.innerHeight
    };
  } else {
    // probably IE<=8
    var elem = 'documentElement' in document ?
        document.documentElement : document.body;

    dimensions = {
      width: elem.offsetWidth,
      height: elem.offsetHeight
    };
  }

  return dimensions;
};

/**
 * Creates a function that is a composition of other functions.
 *
 * For example:
 *      a(b(c(x))) === compose(c, b, a)(x);
 *
 * Each function should accept as an argument, the result of the previous
 * function call in the chain. It is allowable for all functions to have no
 * return value as well.
 *
 * @param ... {Function} A variable set of functions to call, in order.
 *
 * @return {Function} The composition of the functions provided as arguments.
 */
Util.compose = function () {
  var fns = arguments;

  return function (result) {
    var i,
        fn,
        len;

    for (i = 0, len = fns.length; i < len; i++) {
      fn = fns[i];

      if (fn && fn.call) {
        result = fn.call(this, result);
      }
    }

    return result;
  };
};

/**
 * Checks the elements of a looking for b. b is assumed to be found if for
 * some object in a (a[i]), a[i] === b. Note strict equality.
 *
 * @param a {Array}
 *      An array to search
 * @param b {Mixed}
 *      A value to search for
 *
 * @return
 *      true if array a contains b
 */
Util.contains = function (a, b) {
  var i, len;

  for (i = 0, len = a.length; i < len; i++) {
    if (b === a[i]) {
      return true;
    }
  }

  return false;
};

/**
 * @return
 *      true if object is an array
 */
Util.isArray = function (a) {

  if (typeof Array.isArray === 'function') {
    return Array.isArray(a);
  } else {
    return Object.prototype.toString.call(a) === '[object Array]';
  }

};


/**
 * Load a script asynchronously.
 *
 * @param url {String}
 *        script to load.
 * @param options {Object}
 *        additional options.
 * @param options.success {Function} optional.
 *        called after script loads successfully.
 * @param options.error {Function} optional.
 *        called after script fails to load.
 * @param options.done {Function} optional
 *        called after loadScript is complete,
 *        after calling success or error.
 */
Util.loadScript = function (url, options) {
  // load secondary script
  var cleanup,
      done,
      onError,
      onLoad,
      script;

  options = Util.extend({}, {
    success: null,
    error: null,
    done: null
  }, options);

  cleanup = function () {
    script.removeEventListener('load', onLoad);
    script.removeEventListener('error', onError);
    script.parentNode.removeChild(script);
    cleanup = null;
    onLoad = null;
    onError = null;
    script = null;
  };

  done = function () {
    if (options.done !== null) {
      options.done();
    }
    options = null;
  };

  onError = function () {
    cleanup();
    if (options.error !== null) {
      options.error.apply(null, arguments);
    }
    done();
  };

  onLoad = function () {
    cleanup();
    if (options.success !== null) {
      options.success.apply(null, arguments);
    }
    done();
  };

  script = document.createElement('script');
  script.addEventListener('load', onLoad);
  script.addEventListener('error', onError);
  script.src = url;
  script.async = true;
  document.querySelector('script').parentNode.appendChild(script);
};


// Do these checks once and cache the results
(function() {
  var testEl = document.createElement('div');
  var testInput = document.createElement('input');
  var str = navigator.userAgent||navigator.vendor||window.opera;

  isMobile = str.match(/(Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone)/i);
  testInput.setAttribute('type', 'date');
  supportsDateInput = (testInput.type !== 'text');

  // clean up testing element
  testEl = null;
})();

module.exports = Util;
},{}],"util/Xhr":[function(require,module,exports){
'use strict';


var Util = require('./Util');


var _CALLBACK_SEQUENCE = 0;

// defaults for jsonp method
var _DEFAULT_JSONP_OPTIONS = {
  url: null,
  success: null,
  error: null,
  done: null,
  data: null,
  callbackName: null,
  callbackParameter: 'callback'
};

// defaults for ajax method
var _DEFAULT_AJAX_OPTIONS = {
  url: null,
  success: null,
  error: null,
  done: null,
  method: 'GET',
  headers: null,
  data: null,
  rawdata: null
};

// API Method Declarations

var ajax,
    getCallbackName,
    jsonp,
    restrictOrigin,
    urlEncode;


// API Method Definitions

/**
 * Make an AJAX request.
 *
 * @param options.url {String}
 *      the url to request.
 * @param options.success {Function}
 *      called with data loaded by script
 * @param options.error {Function} optional
 *      called when script fails to load
 * @param options.done {Function}
 *        called when ajax is complete, after success or error.
 * @param options.method {String}
 *      request method, default is 'GET'
 * @param options.headers {Object}
 *      request header name as key, value as value.
 * @param options.data {Object}
 *      request data, sent using content type
 *      'application/x-www-form-urlencoded'.
 * @param options.rawdata {?}
 *      passed directly to send method, when options.data is null.
 *      Content-type header must also be specified. Default is null.
 */
ajax = function (options) {
  var h,
      postdata,
      queryString,
      url,
      xhr;

  options = Util.extend({}, _DEFAULT_AJAX_OPTIONS, options);
  url = options.url;

  if (options.restrictOrigin) {
    url = restrictOrigin(url);
  }
  postdata = options.rawdata;

  if (options.data !== null) {
    queryString = urlEncode(options.data);
    if (options.method === 'GET') {
      // append to url
      url = url + '?' + queryString;
    } else {
      // otherwise send as request body
      postdata = queryString;
      if (options.headers === null) {
        options.headers = {};
      }
      // set request content type
      options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    }
  }

  xhr = new XMLHttpRequest();

  // setup callback
  xhr.onreadystatechange = function () {
    var data, contentType;

    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        if (options.success !== null) {
          try {
            data = xhr.response;
            contentType = xhr.getResponseHeader('Content-Type');
            if (contentType && contentType.indexOf('json') !== -1) {
              data = JSON.parse(data);
            }
            options.success(data, xhr);
          } catch (e) {
            if (options.error !== null) {
              options.error(e, xhr);
            }
          }
        }
      } else {
        if (options.error) {
          options.error(xhr.status, xhr);
        }
      }
      if (options.done !== null) {
        options.done(xhr);
      }
    }
  };

  // open request
  xhr.open(options.method, url, true);

  // send headers
  if (options.headers !== null) {
    for (h in options.headers) {
      xhr.setRequestHeader(h, options.headers[h]);
    }
  }

  // send data
  xhr.send(postdata);

  return xhr;
};

/**
 * Generate a unique callback name.
 *
 * @return a unique callback name.
 */
getCallbackName = function () {
  return '_xhr_callback_' + new Date().getTime() +
      '_' + (++_CALLBACK_SEQUENCE);
};

/**
 * Make a JSONP request.
 *
 * @param options.url {String}
 *      url to load
 * @param options.success {Function}
 *      called with data loaded by script
 * @param options.error {Function} optional
 *      called when script fails to load
 * @param options.done {Function} optional
 *        called when jsonp is complete, after success or error.
 * @param options.data {Object} optional
 *      request parameters to add to url
 *
 * @param options.callbackName {String} optional
 * @param options.callbackParameter {String} optional
 *      default is 'callback'
 */
jsonp = function (options) {
  var data,
      callback,
      url;

  options = Util.extend({}, _DEFAULT_JSONP_OPTIONS, options);
  url = options.url;
  data = Util.extend({}, options.data);
  callback = options.callbackName || getCallbackName();

  // add data and callback to url
  data[options.callbackParameter] = callback;
  url += (url.indexOf('?') === -1 ? '?' : '&') + urlEncode(data);

  // setup global callback called by script
  window[callback] = function () {
    options.success.apply(null, arguments);
  };

  Util.loadScript(url, {
    error: options.error,
    done: function () {
      window[callback] = null;
      delete window[callback];

      if (options.done !== null) {
        options.done();
      }
    }
  });
};

restrictOrigin = function (url) {
  var a,
      restrictedUrl;

  a = document.createElement('a'); // Hack to parse only the pathname
  a.setAttribute('href', url);
  restrictedUrl = a.pathname;

  // Needed for IE, which omits leading slash.
  if ((url.indexOf('http') === 0 || url.indexOf('/') === 0) &&
      restrictedUrl.indexOf('/') !== 0) {
    restrictedUrl = '/' + restrictedUrl;
  }

  return restrictedUrl;
};

/**
 * URL encode an object.
 *
 * @param obj {Object}
 *      object to encode
 *
 * @return {String}
 *      url encoded object
 */
urlEncode = function (obj) {
  var data, key, encodedKey, value, i, len;

  data = [];
  for (key in obj) {
    encodedKey = encodeURIComponent(key);
    value = obj[key];

    if (value instanceof Array) {
      // Add each value in array seperately
      for (i = 0, len = value.length; i < len; i++) {
        data.push(encodedKey + '=' + encodeURIComponent(value[i]));
      }
    } else {
      data.push(encodedKey + '=' + encodeURIComponent(value));
    }
  }
  return data.join('&');
};


// expose the API
module.exports = {
  ajax: ajax,
  getCallbackName: getCallbackName,
  jsonp: jsonp,
  restrictOrigin: restrictOrigin,
  urlEncode: urlEncode,
};
},{"./Util":"util/Util"}]},{},[])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvaHRkb2NzL2pzL3NoYWtlbWFwLXZpZXcvZXZlbnRzL0V2ZW50c1ZpZXcuanMiLCJzcmMvaHRkb2NzL2pzL3NoYWtlbWFwLXZpZXcvbG9hZGluZy9Mb2FkaW5nVmlldy5qcyIsInNyYy9odGRvY3MvanMvc2hha2VtYXAtdmlldy9tYXBzL01hcFZpZXcuanMiLCJzcmMvaHRkb2NzL2pzL3NoYWtlbWFwLXZpZXcvbWFwcy9sYXllcnMvR2VuZXJhdG9yLmpzIiwic3JjL2h0ZG9jcy9qcy9zaGFrZW1hcC12aWV3L21hcHMvbGF5ZXJzL2NvbnRfcGdhLmpzIiwic3JjL2h0ZG9jcy9qcy9zaGFrZW1hcC12aWV3L21hcHMvbGF5ZXJzL2VwaWNlbnRlci5qcyIsInNyYy9odGRvY3MvanMvc2hha2VtYXAtdmlldy9tYXBzL2xheWVycy9ldmVudHMuanMiLCJub2RlX21vZHVsZXMvaGF6ZGV2LXdlYnV0aWxzL3NyYy9tYXRoL0NhbWVyYS5qcyIsIm5vZGVfbW9kdWxlcy9oYXpkZXYtd2VidXRpbHMvc3JjL21hdGgvTWF0cml4LmpzIiwibm9kZV9tb2R1bGVzL2hhemRldi13ZWJ1dGlscy9zcmMvbWF0aC9WZWN0b3IuanMiLCJub2RlX21vZHVsZXMvaGF6ZGV2LXdlYnV0aWxzL3NyYy9tdmMvQ29sbGVjdGlvblNlbGVjdEJveC5qcyIsIm5vZGVfbW9kdWxlcy9oYXpkZXYtd2VidXRpbHMvc3JjL212Yy9Db2xsZWN0aW9uVGFibGUuanMiLCJub2RlX21vZHVsZXMvaGF6ZGV2LXdlYnV0aWxzL3NyYy9tdmMvQ29sbGVjdGlvblZpZXcuanMiLCJub2RlX21vZHVsZXMvaGF6ZGV2LXdlYnV0aWxzL3NyYy9tdmMvQ29sbGVjdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy9oYXpkZXYtd2VidXRpbHMvc3JjL212Yy9EYXRhVGFibGUuanMiLCJub2RlX21vZHVsZXMvaGF6ZGV2LXdlYnV0aWxzL3NyYy9tdmMvRG93bmxvYWRWaWV3LmpzIiwibm9kZV9tb2R1bGVzL2hhemRldi13ZWJ1dGlscy9zcmMvbXZjL0ZpbGVJbnB1dFZpZXcuanMiLCJub2RlX21vZHVsZXMvaGF6ZGV2LXdlYnV0aWxzL3NyYy9tdmMvTW9kYWxWaWV3LmpzIiwibm9kZV9tb2R1bGVzL2hhemRldi13ZWJ1dGlscy9zcmMvbXZjL01vZGVsLmpzIiwibm9kZV9tb2R1bGVzL2hhemRldi13ZWJ1dGlscy9zcmMvbXZjL1NlbGVjdFZpZXcuanMiLCJub2RlX21vZHVsZXMvaGF6ZGV2LXdlYnV0aWxzL3NyYy9tdmMvU2VsZWN0ZWRDb2xsZWN0aW9uVmlldy5qcyIsIm5vZGVfbW9kdWxlcy9oYXpkZXYtd2VidXRpbHMvc3JjL212Yy9Tb3J0Vmlldy5qcyIsIm5vZGVfbW9kdWxlcy9oYXpkZXYtd2VidXRpbHMvc3JjL212Yy9WaWV3LmpzIiwic3JjL2h0ZG9jcy9qcy9zaGFrZW1hcC12aWV3L0FwcC5qcyIsInNyYy9odGRvY3MvanMvc2hha2VtYXAtdmlldy9TaGFrZU1hcE1vZGVsLmpzIiwibm9kZV9tb2R1bGVzL2hhemRldi13ZWJ1dGlscy9zcmMvdXRpbC9FdmVudHMuanMiLCJub2RlX21vZHVsZXMvaGF6ZGV2LXdlYnV0aWxzL3NyYy91dGlsL0ZpbGVJTy5qcyIsIm5vZGVfbW9kdWxlcy9oYXpkZXYtd2VidXRpbHMvc3JjL3V0aWwvTWVzc2FnZS5qcyIsIm5vZGVfbW9kdWxlcy9oYXpkZXYtd2VidXRpbHMvc3JjL3V0aWwvVXRpbC5qcyIsIm5vZGVfbW9kdWxlcy9oYXpkZXYtd2VidXRpbHMvc3JjL3V0aWwvWGhyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7O0FBQ0EsSUFBTSxPQUFPLFFBQVEsOEJBQVIsQ0FBYjtBQUFBLElBQ1EsTUFBTSxRQUFRLFVBQVIsQ0FEZDs7QUFHQSxJQUFJLFlBQVksU0FBWixTQUFZLENBQVUsT0FBVixFQUFtQjtBQUMvQixRQUFJLEtBQUosRUFDUSxXQURSOztBQUdBLFlBQVEsS0FBSyxPQUFMLENBQVI7O0FBRUEsa0JBQWMsdUJBQVUsV0FBYztBQUNsQyxjQUFNLEVBQU4sQ0FBUyxTQUFULEdBQ1EsS0FDQSw0Q0FGUjtBQUdBLGNBQU0sRUFBTixDQUFTLFNBQVQsR0FBcUIsRUFBckI7O0FBRUEsY0FBTSxLQUFOLENBQVksRUFBWixDQUFlLGVBQWYsRUFBZ0MsTUFBTSxZQUF0QztBQUNBLGNBQU0sVUFBTixHQUFtQixNQUFNLEVBQU4sQ0FBUyxhQUFULENBQXVCLGFBQXZCLENBQW5CO0FBQ0EsY0FBTSxVQUFOLENBQWlCLGdCQUFqQixDQUFrQyxPQUFsQyxFQUEyQyxNQUFNLFNBQWpEOztBQUVBLGNBQU0sU0FBTjtBQUNILEtBWEQ7O0FBYUEsVUFBTSxZQUFOLEdBQXFCLFlBQVk7QUFDN0IsWUFBSSxZQUFZLEVBQWhCO0FBRDZCO0FBQUE7QUFBQTs7QUFBQTtBQUU3QixpQ0FBa0IsTUFBTSxLQUFOLENBQVksR0FBWixDQUFnQixRQUFoQixDQUFsQiw4SEFBNkM7QUFBQSxvQkFBcEMsTUFBb0M7O0FBQ3pDLDZCQUFhLHdCQUF3QixPQUFNLEVBQTlCLEdBQW1DLFFBQWhEO0FBQ0g7QUFKNEI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFNN0IsY0FBTSxFQUFOLENBQVMsU0FBVCxHQUNRLDZCQUE2QixTQUE3QixHQUF5QyxRQUF6QyxHQUNBLDRDQUZSOztBQUlBLGNBQU0sVUFBTixHQUFtQixNQUFNLEVBQU4sQ0FBUyxhQUFULENBQXVCLGFBQXZCLENBQW5CO0FBQ0EsY0FBTSxVQUFOLENBQWlCLGdCQUFqQixDQUFrQyxPQUFsQyxFQUEyQyxNQUFNLFNBQWpEOztBQUVBLGNBQU0sTUFBTixHQUFlLE1BQU0sRUFBTixDQUFTLGdCQUFULENBQTBCLFFBQTFCLENBQWY7QUFDQSxZQUFJLE1BQU0sTUFBVixFQUFrQjtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUNkLHNDQUFrQixNQUFNLE1BQXhCLG1JQUFnQztBQUFBLHdCQUF2QixLQUF1Qjs7QUFDNUIsMEJBQU0sZ0JBQU4sQ0FBdUIsT0FBdkIsRUFBZ0MsTUFBTSxTQUF0QztBQUNIO0FBSGE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUlqQjtBQUNKLEtBbkJEOztBQXFCQSxVQUFNLFNBQU4sR0FBa0IsWUFBWTtBQUMxQixjQUFNLEtBQU4sQ0FBWSxHQUFaLENBQWdCO0FBQ1oscUJBQVM7QUFERyxTQUFoQjs7QUFJQSxZQUFJLElBQUosQ0FBUztBQUNMLGlCQUFLLE1BQU0sS0FBTixDQUFZLEdBQVosQ0FBZ0IsYUFBaEIsQ0FEQTtBQUVMLHFCQUFTLGlCQUFVLElBQVYsRUFBZ0I7QUFDckIsc0JBQU0sS0FBTixDQUFZLEdBQVosQ0FBZ0I7QUFDWiw0QkFBUTtBQURJLGlCQUFoQjtBQUdILGFBTkk7QUFPTCxtQkFBTyxpQkFBWTtBQUNmLHNCQUFNLEtBQU4sQ0FBWSxHQUFaLENBQWdCO0FBQ1osNEJBQVE7QUFESSxpQkFBaEI7QUFHSCxhQVhJO0FBWUwsa0JBQU0sZ0JBQVk7QUFDZCxzQkFBTSxLQUFOLENBQVksR0FBWixDQUFnQjtBQUNaLDZCQUFTO0FBREcsaUJBQWhCO0FBR0g7QUFoQkksU0FBVDtBQWtCSCxLQXZCRDs7QUF5QkEsVUFBTSxTQUFOLEdBQWtCLFVBQVUsQ0FBVixFQUFhO0FBQzNCLFlBQUksV0FBVyxFQUFFLFNBQWpCO0FBQ0EsWUFBSSxVQUFVLFNBQVMsU0FBdkI7O0FBRUEsWUFBSSxZQUFZLElBQWhCO0FBSjJCO0FBQUE7QUFBQTs7QUFBQTtBQUszQixrQ0FBc0IsTUFBTSxLQUFOLENBQVksR0FBWixDQUFnQixRQUFoQixDQUF0QixtSUFBaUQ7QUFBQSxvQkFBeEMsU0FBd0M7O0FBQzdDLG9CQUFJLFVBQVUsSUFBVixNQUFvQixPQUF4QixFQUFpQztBQUM3QixnQ0FBWSxTQUFaO0FBQ0E7QUFDSDtBQUNKO0FBVjBCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBWTNCLFlBQUksU0FBSixFQUFlO0FBQ1gsa0JBQU0sS0FBTixDQUFZLEdBQVosQ0FBZ0I7QUFDWix5QkFBUztBQURHLGFBQWhCO0FBR0g7QUFDSixLQWpCRDs7QUFtQkEsZ0JBQVksT0FBWjtBQUNBLGNBQVUsSUFBVjtBQUNBLFdBQU8sS0FBUDtBQUNILENBdkZEOztBQTBGQSxPQUFPLE9BQVAsR0FBaUIsU0FBakI7OztBQzlGQTs7QUFFQSxJQUFNLE9BQU8sUUFBUSw4QkFBUixDQUFiOztBQUVBLElBQUksY0FBYyxTQUFkLFdBQWMsQ0FBVSxPQUFWLEVBQW1CO0FBQ2pDLFFBQUksS0FBSixFQUNRLFdBRFI7O0FBR0EsWUFBUSxLQUFLLE9BQUwsQ0FBUjs7QUFFQSxrQkFBYyx1QkFBVSxXQUFjO0FBQ2xDLGNBQU0sWUFBTixHQUFxQixDQUFyQjtBQUNBLGNBQU0sRUFBTixDQUFTLFNBQVQsR0FBcUIsdUNBQXJCO0FBQ0EsY0FBTSxLQUFOLENBQVksRUFBWixDQUFlLGdCQUFmLEVBQWlDLE1BQU0sYUFBdkM7QUFDSCxLQUpEOztBQU1BLFVBQU0sYUFBTixHQUFzQixZQUFZO0FBQzlCLFlBQUksTUFBTSxLQUFOLENBQVksR0FBWixDQUFnQixTQUFoQixNQUErQixJQUFuQyxFQUF5Qzs7QUFFckM7QUFDQSxnQkFBSSxNQUFNLFlBQU4sS0FBdUIsQ0FBM0IsRUFBOEI7QUFDMUIsc0JBQU0sRUFBTixDQUFTLFNBQVQsQ0FBbUIsR0FBbkIsQ0FBdUIsaUJBQXZCO0FBQ0g7QUFDRCxrQkFBTSxZQUFOLElBQXNCLENBQXRCO0FBRUgsU0FSRCxNQVFPO0FBQ0gsa0JBQU0sWUFBTixJQUFzQixDQUF0Qjs7QUFFQTtBQUNBLGdCQUFJLE1BQU0sWUFBTixLQUF1QixDQUEzQixFQUE4QjtBQUMxQixzQkFBTSxFQUFOLENBQVMsU0FBVCxDQUFtQixNQUFuQixDQUEwQixpQkFBMUI7QUFDSDs7QUFFRDtBQUNBLGdCQUFJLE1BQU0sWUFBTixHQUFxQixDQUF6QixFQUE0QjtBQUN4QixzQkFBTSxZQUFOLEdBQXFCLENBQXJCO0FBQ0g7QUFDSjtBQUNKLEtBdEJEOztBQTBCQSxnQkFBWSxPQUFaO0FBQ0EsY0FBVSxJQUFWO0FBQ0EsV0FBTyxLQUFQO0FBQ0gsQ0F6Q0Q7O0FBMkNBLE9BQU8sT0FBUCxHQUFpQixXQUFqQjs7O0FDL0NBO0FBQ0E7O0FBRUEsSUFBTSxPQUFPLFFBQVEsOEJBQVIsQ0FBYjtBQUNBLElBQUssWUFBWSxRQUFRLHFDQUFSLENBQWpCOztBQUdBLElBQUksVUFBVSxTQUFWLE9BQVUsQ0FBVSxPQUFWLEVBQW1CO0FBQzdCLFFBQUksS0FBSixFQUNRLFdBRFI7O0FBR0EsWUFBUSxLQUFLLE9BQUwsQ0FBUjs7QUFFQSxrQkFBYyx1QkFBVSxXQUFjO0FBQ2xDLGNBQU0sRUFBTixDQUFTLFNBQVQsR0FBcUIsd0RBQXJCO0FBQ0EsY0FBTSxhQUFOLEdBQXNCLE1BQU0sS0FBTixDQUFZLEdBQVosQ0FBZ0IsZUFBaEIsQ0FBdEI7QUFDQSxZQUFJLFFBQVEsTUFBTSxFQUFOLENBQVMsYUFBVCxDQUF1QixNQUF2QixDQUFaOztBQUVBLGNBQU0sR0FBTixHQUFZLEVBQUUsR0FBRixDQUFNLEtBQU4sRUFBYTtBQUNyQiw2QkFBaUI7QUFESSxTQUFiLEVBRVQsT0FGUyxDQUVELENBQUMsTUFBRCxFQUFTLENBQUMsSUFBVixDQUZDLEVBRWdCLEVBRmhCLENBQVo7O0FBSUEsY0FBTSxjQUFOLEdBQXVCLFVBQVUsT0FBVixDQUF2QjtBQUNBLGNBQU0sU0FBTixHQUFrQixNQUFNLFlBQU4sRUFBbEI7QUFDQSxjQUFNLGFBQU4sR0FBc0IsRUFBRSxPQUFGLENBQVUsTUFBVixDQUFpQixFQUFDLFdBQVcsTUFBTSxTQUFsQixFQUFqQixFQUErQyxLQUEvQyxDQUFxRCxNQUFNLEdBQTNELENBQXRCOztBQUVBLGNBQU0sS0FBTixDQUFZLEVBQVosQ0FBZSxjQUFmLEVBQStCLE1BQU0saUJBQXJDO0FBQ0EsY0FBTSxLQUFOLENBQVksRUFBWixDQUFlLGVBQWYsRUFBZ0MsTUFBTSxZQUF0QztBQUNBLGVBQU8sZ0JBQVAsQ0FBd0IsZ0JBQXhCLEVBQTBDLE1BQU0sWUFBaEQ7QUFDSCxLQWhCRDs7QUFrQkEsVUFBTSxZQUFOLEdBQXFCLFlBQVk7QUFDN0IsWUFBSSxZQUFZLEVBQUUsU0FBRixDQUFZLHVFQUF1RSwyRkFBbkYsRUFBZ0w7QUFDNUwscUJBQVMsRUFEbUw7QUFFNUwseUJBQWEsd0ZBQ1QseUVBRFMsR0FFVCxrREFKd0w7QUFLNUwsZ0JBQUk7QUFMd0wsU0FBaEwsRUFNYixLQU5hLENBTVAsTUFBTSxHQU5DLENBQWhCOztBQVFBLGVBQU8sU0FBUDtBQUNILEtBVkQ7O0FBWUEsVUFBTSxpQkFBTixHQUEwQixZQUFZO0FBQ2xDO0FBQ0EsY0FBTSxjQUFOOztBQUVBO0FBQ0EsY0FBTSxTQUFOLEdBQWtCLE1BQU0sWUFBTixFQUFsQjtBQUNBLFlBQUksUUFBUSxNQUFNLEtBQU4sQ0FBWSxHQUFaLENBQWdCLE9BQWhCLENBQVo7O0FBRUEsY0FBTSxjQUFOLENBQXFCLGNBQXJCLENBQW9DLEtBQXBDO0FBQ0EsY0FBTSxhQUFOLEdBQXNCLEVBQUUsT0FBRixDQUFVLE1BQVYsQ0FBaUIsRUFBQyxXQUFXLE1BQU0sU0FBbEIsRUFBakIsRUFBK0MsS0FBL0MsQ0FBcUQsTUFBTSxHQUEzRCxDQUF0QjtBQUNILEtBVkQ7O0FBWUEsVUFBTSxZQUFOLEdBQXFCLFVBQVUsQ0FBVixFQUFhO0FBQzlCO0FBQ0EsY0FBTSxjQUFOOztBQUVBO0FBQ0EsY0FBTSxTQUFOLEdBQWtCLE1BQU0sWUFBTixFQUFsQjtBQUNBLFlBQUksU0FBUyxFQUFFLE1BQWY7O0FBRUEsY0FBTSxhQUFOLEdBQXNCLEVBQUUsT0FBRixDQUFVLE1BQVYsQ0FBaUIsRUFBQyxXQUFXLE1BQU0sU0FBbEIsRUFBakIsRUFBK0MsTUFBL0MsRUFBdUQsS0FBdkQsQ0FBNkQsTUFBTSxHQUFuRSxDQUF0Qjs7QUFFQSxZQUFJLFdBQVcsRUFBZjtBQUNBLGFBQUssSUFBSSxLQUFULElBQWtCLE1BQWxCLEVBQTBCO0FBQ3RCLGdCQUFJLE1BQU0sYUFBTixDQUFvQixPQUFwQixDQUE0QixLQUE1QixJQUFxQyxDQUFDLENBQTFDLEVBQTZDO0FBQ3pDLHVCQUFPLEtBQVAsRUFBYyxLQUFkLENBQW9CLE1BQU0sR0FBMUI7QUFDSDtBQUNELHFCQUFTLElBQVQsQ0FBYyxPQUFPLEtBQVAsQ0FBZDtBQUNIOztBQUVELFlBQUksUUFBUSxFQUFFLFlBQUYsQ0FBZSxRQUFmLENBQVo7QUFDQSxjQUFNLEdBQU4sQ0FBVSxTQUFWLENBQW9CLE1BQU0sU0FBTixHQUFrQixHQUFsQixDQUFzQixHQUF0QixDQUFwQjtBQUVILEtBckJEOztBQXVCQSxVQUFNLGNBQU4sR0FBdUIsWUFBWTtBQUMvQixjQUFNLEdBQU4sQ0FBVSxTQUFWLENBQW9CLFVBQVUsS0FBVixFQUFpQjtBQUNqQyxrQkFBTSxHQUFOLENBQVUsV0FBVixDQUFzQixLQUF0QjtBQUNILFNBRkQ7O0FBSUEsY0FBTSxhQUFOLENBQW9CLFVBQXBCLENBQStCLE1BQU0sR0FBckM7QUFDSCxLQU5EOztBQVFBLGdCQUFZLE9BQVo7QUFDQSxjQUFVLElBQVY7QUFDQSxXQUFPLEtBQVA7QUFDSCxDQWxGRDs7QUFxRkEsT0FBTyxPQUFQLEdBQWlCLE9BQWpCOzs7QUM1RkE7O0FBQ0EsSUFBTSxTQUFTLFFBQVEsa0NBQVIsQ0FBZjtBQUFBLElBQ1EsT0FBTyxRQUFRLDhCQUFSLENBRGY7O0FBR0EsSUFBSSxXQUFXLENBQUMsUUFBUSxxQ0FBUixDQUFELEVBQ1gsUUFBUSxvQ0FBUixDQURXLENBQWY7O0FBR0EsSUFBSSxZQUFZLFNBQVosU0FBWSxDQUFVLE9BQVYsRUFBbUI7QUFDL0IsUUFBSSxLQUFKLEVBQ1EsV0FEUjs7QUFHQSxZQUFRLEtBQUssT0FBTCxDQUFSOztBQUVBLGtCQUFjLHVCQUFVLFdBQWE7QUFDakMsY0FBTSxVQUFOLEdBQW1CLENBQW5CO0FBQ0EsY0FBTSxNQUFOLEdBQWUsRUFBZjtBQUNBLGNBQU0sUUFBTixHQUFpQixRQUFqQjtBQUNBLGVBQU8sZ0JBQVAsQ0FBd0IsZUFBeEIsRUFBeUMsTUFBTSxRQUEvQztBQUNILEtBTEQ7O0FBUUEsVUFBTSxjQUFOLEdBQXVCLFVBQVUsS0FBVixFQUFpQjtBQUNwQyxjQUFNLFVBQU4sR0FBbUIsQ0FBbkI7QUFDQSxjQUFNLE1BQU4sR0FBZSxFQUFmO0FBQ0EsWUFBSSxLQUFKLEVBQVc7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFDUCxxQ0FBcUIsTUFBTSxRQUEzQiw4SEFBcUM7QUFBQSx3QkFBNUIsUUFBNEI7O0FBQ2pDLDZCQUFTLGFBQVQsQ0FBdUIsS0FBdkI7QUFDSDtBQUhNO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFJVjtBQUNKLEtBUkQ7O0FBVUEsVUFBTSxRQUFOLEdBQWlCLFVBQVUsQ0FBVixFQUFhO0FBQzFCLFlBQUksUUFBUSxFQUFFLE1BQWQ7O0FBRUE7QUFDQSxZQUFJLE1BQU0sS0FBVixFQUFpQjtBQUNiLGtCQUFNLE1BQU4sQ0FBYSxNQUFNLElBQW5CLElBQTJCLE1BQU0sS0FBakM7QUFDSDs7QUFFRDtBQUNBLGNBQU0sVUFBTixJQUFvQixDQUFwQjs7QUFFQTtBQUNBLFlBQUksTUFBTSxVQUFOLEtBQXFCLE1BQU0sUUFBTixDQUFlLE1BQXhDLEVBQWdEO0FBQzVDLG1CQUFPLG1CQUFQLENBQTJCLE1BQU0sTUFBakM7QUFDSDtBQUNKLEtBZkQ7O0FBaUJBLGdCQUFZLE9BQVo7QUFDQSxjQUFVLElBQVY7QUFDQSxXQUFPLEtBQVA7QUFDSCxDQTVDRDs7QUErQ0EsT0FBTyxPQUFQLEdBQWlCLFNBQWpCOzs7QUN0REE7QUFDQTs7QUFDQSxJQUFNLE1BQU0sUUFBUSxVQUFSLENBQVo7QUFDQSxJQUFNLFNBQVMsUUFBUSxrQ0FBUixDQUFmOztBQUVBLElBQUksUUFBUSxFQUFDLElBQUksd0JBQUwsRUFBWjtBQUNBLE1BQU0sSUFBTixHQUFhLGNBQWI7QUFDQSxNQUFNLGFBQU4sR0FBc0IsVUFBVSxLQUFWLEVBQWlCO0FBQ25DLFVBQU0sS0FBTixHQUFjLElBQWQ7QUFDQSxRQUFJLFVBQVUsSUFBZDtBQUNBLFFBQUksV0FBVyxNQUFNLFFBQU4sQ0FBZSxDQUFmLEVBQWtCLFFBQWpDOztBQUVBLFNBQUssSUFBSSxDQUFULElBQWMsUUFBZCxFQUF3QjtBQUNwQixZQUFJLE1BQU0sTUFBTSxFQUFoQixFQUFvQjtBQUNoQixzQkFBVSxTQUFTLENBQVQsQ0FBVjtBQUNBO0FBQ0g7QUFDSjs7QUFFRCxRQUFJLE9BQUosRUFBYTtBQUNULFlBQUksSUFBSixDQUFTO0FBQ0wsaUJBQUssUUFBUSxHQURSO0FBRUwscUJBQVMsaUJBQVUsSUFBVixFQUFnQjtBQUNyQixzQkFBTSxPQUFOLElBQWlCLEVBQUUsT0FBRixDQUFVLElBQVYsQ0FBakI7QUFDQSx1QkFBTyxrQkFBUCxDQUEwQixLQUExQjtBQUNILGFBTEk7QUFNTCxtQkFBTyxpQkFBWTtBQUNmLHVCQUFPLGtCQUFQLENBQTBCLEtBQTFCO0FBQ0gsYUFSSTtBQVNMLGtCQUFNLGdCQUFZLENBQ2pCO0FBVkksU0FBVDtBQVlILEtBYkQsTUFhTztBQUNILGVBQU8sa0JBQVAsQ0FBMEIsS0FBMUI7QUFDSDtBQUNKLENBNUJEOztBQWdDQSxPQUFPLE9BQVAsR0FBaUIsS0FBakI7OztBQ3ZDQTtBQUNBOztBQUNBLElBQU0sU0FBUyxRQUFRLGtDQUFSLENBQWY7QUFBQSxJQUNRLE1BQU0sUUFBUSxVQUFSLENBRGQ7O0FBR0EsSUFBSSxRQUFRLEVBQUMsV0FBVyxtQkFBWixFQUFaO0FBQ0EsTUFBTSxhQUFOLEdBQXNCLFVBQVUsS0FBVixFQUFpQjtBQUNuQyxRQUFJLFVBQVUsSUFBZDtBQUNBLFFBQUksV0FBVyxNQUFNLFFBQU4sQ0FBZSxDQUFmLEVBQWtCLFFBQWpDOztBQUVBLFNBQUssSUFBSSxDQUFULElBQWMsUUFBZCxFQUF3QjtBQUNwQixZQUFJLE1BQU0sTUFBTSxTQUFoQixFQUEyQjtBQUN2QixzQkFBVSxTQUFTLENBQVQsQ0FBVjtBQUNBO0FBQ0g7QUFDSjs7QUFFRCxRQUFJLE9BQUosRUFBYTtBQUNULFlBQUksSUFBSixDQUFTO0FBQ0wsaUJBQUssUUFBUSxHQURSO0FBRUwscUJBQVMsaUJBQVUsR0FBVixFQUFlO0FBQ3BCLG9CQUFJLFNBQVMsSUFBSSxTQUFKLEVBQWI7QUFDQSxvQkFBSSxTQUFTLE9BQU8sZUFBUCxDQUF1QixHQUF2QixFQUEyQixVQUEzQixDQUFiO0FBQ0Esb0JBQUksR0FBSixFQUNRLEdBRFIsRUFFUSxTQUZSOztBQUhvQjtBQUFBO0FBQUE7O0FBQUE7QUFPcEIseUNBQWlCLE9BQU8sb0JBQVAsQ0FBNEIsZUFBNUIsRUFBNkMsQ0FBN0MsRUFBZ0QsVUFBakUsOEhBQTZFO0FBQUEsNEJBQXBFLElBQW9FOztBQUN6RSw0QkFBSSxLQUFLLFFBQUwsS0FBa0IsT0FBdEIsRUFBK0I7QUFDM0Isa0NBQU0sS0FBSyxZQUFMLENBQWtCLEtBQWxCLENBQU47QUFDQSxrQ0FBTSxLQUFLLFlBQUwsQ0FBa0IsS0FBbEIsQ0FBTjs7QUFFQSx3Q0FDSSxZQUNBLFVBREEsR0FDYSxLQUFLLFlBQUwsQ0FBa0IsVUFBbEIsQ0FEYixHQUM2QyxZQUQ3QyxHQUVBLG9DQUZBLEdBRXVDLEtBQUssWUFBTCxDQUFrQixXQUFsQixDQUZ2QyxHQUV3RSxvQkFGeEUsR0FHQSxnQ0FIQSxHQUdtQyxLQUFLLFlBQUwsQ0FBa0IsT0FBbEIsQ0FIbkMsR0FHZ0Usb0JBSGhFLEdBSUEsbUNBSkEsR0FJc0MsS0FBSyxZQUFMLENBQWtCLEtBQWxCLENBSnRDLEdBSWlFLElBSmpFLEdBSXdFLEtBQUssWUFBTCxDQUFrQixLQUFsQixDQUp4RSxHQUltRyxvQkFKbkcsR0FLQSxVQU5KO0FBT0E7QUFDSDtBQUNKO0FBckJtQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQXVCcEIsc0JBQU0sT0FBTixJQUFpQixFQUFFLE1BQUYsQ0FBUyxDQUFDLEdBQUQsRUFBTSxHQUFOLENBQVQsRUFDSSxTQURKLENBQ2MsU0FEZCxFQUVJLFNBRkosRUFBakI7QUFHQSx1QkFBTyxrQkFBUCxDQUEwQixLQUExQjtBQUNILGFBN0JJO0FBOEJMLG1CQUFPLGlCQUFZO0FBQ2YsdUJBQU8sa0JBQVAsQ0FBMEIsS0FBMUI7QUFDSCxhQWhDSTtBQWlDTCxrQkFBTSxnQkFBWSxDQUNqQjtBQWxDSSxTQUFUO0FBb0NIO0FBQ0osQ0FqREQ7O0FBbURBLE1BQU0sSUFBTixHQUFhLFdBQWI7O0FBRUEsT0FBTyxPQUFQLEdBQWlCLEtBQWpCOzs7OztBQzNEQSxJQUFJLHFCQUFxQixTQUFyQixrQkFBcUIsQ0FBVSxLQUFWLEVBQWlCO0FBQ3RDLFFBQUksTUFBTSxJQUFJLFdBQUosQ0FBZ0IsZUFBaEIsRUFBaUMsRUFBQyxRQUFRLEtBQVQsRUFBakMsQ0FBVjtBQUNBLFdBQU8sYUFBUCxDQUFxQixHQUFyQjtBQUNILENBSEQ7O0FBS0EsSUFBSSxzQkFBc0IsU0FBdEIsbUJBQXNCLENBQVUsTUFBVixFQUFrQjtBQUN4QyxRQUFJLE1BQU0sSUFBSSxXQUFKLENBQWdCLGdCQUFoQixFQUFrQyxFQUFDLFFBQVEsTUFBVCxFQUFsQyxDQUFWO0FBQ0EsV0FBTyxhQUFQLENBQXFCLEdBQXJCO0FBQ0gsQ0FIRDs7QUFLQSxJQUFJLFNBQVMsRUFBQyxxQkFBcUIsbUJBQXRCO0FBQ1Qsd0JBQW9CLGtCQURYLEVBQWI7O0FBR0EsT0FBTyxPQUFQLEdBQWlCLE1BQWpCOzs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOW9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdE1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdE5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hlQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5WkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzdGQSxJQUFNLGFBQWEsUUFBUSxpQ0FBUixDQUFuQjtBQUFBLElBQ1EsY0FBYyxRQUFRLG1DQUFSLENBRHRCO0FBQUEsSUFFUSxVQUFVLFFBQVEsNEJBQVIsQ0FGbEI7QUFBQSxJQUdRLE9BQU8sUUFBUSw4QkFBUixDQUhmO0FBQUEsSUFJUSxPQUFPLFFBQVEsK0JBQVIsQ0FKZjs7QUFNQSxJQUFJLE1BQU0sU0FBTixHQUFNLENBQVUsT0FBVixFQUFtQjtBQUN6QixRQUFJLEtBQUosRUFDUSxXQURSOztBQUdBLGNBQVUsS0FBSyxNQUFMLENBQVksRUFBWixFQUFnQixFQUFoQixFQUFvQixPQUFwQixDQUFWO0FBQ0EsWUFBUSxLQUFLLE9BQUwsQ0FBUjs7QUFFQSxrQkFBYyx1QkFBVSxXQUFhO0FBQ2pDLGNBQU0sRUFBTixDQUFTLFNBQVQsQ0FBbUIsR0FBbkIsQ0FBdUIsYUFBdkI7O0FBRUEsY0FBTSxFQUFOLENBQVMsU0FBVCxHQUNRLHFDQUNBLDRCQURBLEdBRUEsZ0ZBSFI7O0FBS0EsY0FBTSxPQUFOLEdBQWdCLFFBQVE7QUFDcEIsZ0JBQUksTUFBTSxFQUFOLENBQVMsYUFBVCxDQUF1QixXQUF2QixDQURnQjtBQUVwQixtQkFBTyxNQUFNO0FBRk8sU0FBUixDQUFoQjs7QUFLQSxjQUFNLFVBQU4sR0FBbUIsV0FBVztBQUMxQixnQkFBSSxNQUFNLEVBQU4sQ0FBUyxhQUFULENBQXVCLFNBQXZCLENBRHNCO0FBRTFCLG1CQUFPLE1BQU07QUFGYSxTQUFYLENBQW5COztBQUtBLGNBQU0sV0FBTixHQUFvQixZQUFZO0FBQzVCLGdCQUFJLE1BQU0sRUFBTixDQUFTLGFBQVQsQ0FBdUIsZUFBdkIsQ0FEd0I7QUFFNUIsbUJBQU8sTUFBTTtBQUZlLFNBQVosQ0FBcEI7QUFJSCxLQXRCRDs7QUF3QkEsZ0JBQVksT0FBWjtBQUNBLGNBQVUsSUFBVjtBQUNBLFdBQU8sS0FBUDtBQUNILENBbENEOztBQW9DQSxPQUFPLE9BQVAsR0FBaUIsR0FBakI7Ozs7O0FDMUNBLElBQU0sUUFBUSxRQUFRLCtCQUFSLENBQWQ7QUFBQSxJQUNRLE9BQU8sUUFBUSwrQkFBUixDQURmOztBQUdBLElBQUksZ0JBQWdCLFNBQWhCLGFBQWdCLENBQVMsT0FBVCxFQUFrQjtBQUNsQyxRQUFJLEtBQUo7O0FBRUEsWUFBUSxNQUFNLEtBQUssTUFBTCxDQUFZLEVBQVosRUFDVixFQUFDLGFBQWEsZ0JBQWQ7QUFDSSxnQkFBUSxFQURaO0FBRUksZUFBTyxJQUZYO0FBR0ksZ0JBQVEsRUFIWjtBQUlJLHVCQUFlLENBQUMsV0FBRCxFQUFjLGNBQWQsQ0FKbkI7QUFLSSxpQkFBUyxLQUxiLEVBRFUsRUFPZixPQVBlLENBQU4sQ0FBUjs7QUFTQSxXQUFPLEtBQVA7QUFDSCxDQWJEOztBQWVBLE9BQU8sT0FBUCxHQUFpQixhQUFqQjs7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDak1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9JQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hXQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG5jb25zdCBWaWV3ID0gcmVxdWlyZSgnaGF6ZGV2LXdlYnV0aWxzL3NyYy9tdmMvVmlldycpLFxuICAgICAgICBYaHIgPSByZXF1aXJlKCd1dGlsL1hocicpO1xuXG52YXIgRXZlbnRWaWV3ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICB2YXIgX3RoaXMsXG4gICAgICAgICAgICBfaW5pdGlhbGl6ZTtcblxuICAgIF90aGlzID0gVmlldyhvcHRpb25zKTtcblxuICAgIF9pbml0aWFsaXplID0gZnVuY3Rpb24gKC8qb3B0aW9ucyovICkge1xuICAgICAgICBfdGhpcy5lbC5pbm5lckhUTUwgPSBcbiAgICAgICAgICAgICAgICAnJyArXG4gICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJsb2FkQnV0dG9uXCI+UmVmcmVzaCBMaXN0PC9kaXY+JztcbiAgICAgICAgX3RoaXMuZWwuZXZlbnRMaXN0ID0gW107XG5cbiAgICAgICAgX3RoaXMubW9kZWwub24oJ2NoYW5nZTpldmVudHMnLCBfdGhpcy5yZW5kZXJFdmVudHMpO1xuICAgICAgICBfdGhpcy5sb2FkQnV0dG9uID0gX3RoaXMuZWwucXVlcnlTZWxlY3RvcignLmxvYWRCdXR0b24nKTtcbiAgICAgICAgX3RoaXMubG9hZEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIF90aGlzLmdldEV2ZW50cyk7XG5cbiAgICAgICAgX3RoaXMuZ2V0RXZlbnRzKCk7XG4gICAgfTtcblxuICAgIF90aGlzLnJlbmRlckV2ZW50cyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGV2ZW50SHRtbCA9ICcnO1xuICAgICAgICBmb3IgKGxldCBldmVudCBvZiBfdGhpcy5tb2RlbC5nZXQoJ2V2ZW50cycpKSB7XG4gICAgICAgICAgICBldmVudEh0bWwgKz0gJzxkaXYgY2xhc3M9XCJldmVudFwiPicgKyBldmVudC5pZCArICc8L2Rpdj4nO1xuICAgICAgICB9XG5cbiAgICAgICAgX3RoaXMuZWwuaW5uZXJIVE1MID0gXG4gICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJldmVudC1saXN0XCI+JyArIGV2ZW50SHRtbCArICc8L2Rpdj4nICtcbiAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cImxvYWRCdXR0b25cIj5SZWZyZXNoIExpc3Q8L2Rpdj4nO1xuICAgICAgICBcbiAgICAgICAgX3RoaXMubG9hZEJ1dHRvbiA9IF90aGlzLmVsLnF1ZXJ5U2VsZWN0b3IoJy5sb2FkQnV0dG9uJyk7XG4gICAgICAgIF90aGlzLmxvYWRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBfdGhpcy5nZXRFdmVudHMpO1xuXG4gICAgICAgIF90aGlzLmV2ZW50cyA9IF90aGlzLmVsLnF1ZXJ5U2VsZWN0b3JBbGwoJy5ldmVudCcpO1xuICAgICAgICBpZiAoX3RoaXMuZXZlbnRzKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBldmVudCBvZiBfdGhpcy5ldmVudHMpIHtcbiAgICAgICAgICAgICAgICBldmVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIF90aGlzLmxvYWRFdmVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgX3RoaXMuZ2V0RXZlbnRzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBfdGhpcy5tb2RlbC5zZXQoe1xuICAgICAgICAgICAgbG9hZGluZzogdHJ1ZVxuICAgICAgICB9KTtcblxuICAgICAgICBYaHIuYWpheCh7XG4gICAgICAgICAgICB1cmw6IF90aGlzLm1vZGVsLmdldCgncHJvZHVjdHNVcmwnKSxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChqc29uKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMubW9kZWwuc2V0KHtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnRzOiBqc29uXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5tb2RlbC5zZXQoe1xuICAgICAgICAgICAgICAgICAgICBldmVudHM6IFtdXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZG9uZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIF90aGlzLm1vZGVsLnNldCh7XG4gICAgICAgICAgICAgICAgICAgIGxvYWRpbmc6IGZhbHNlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgXG4gICAgX3RoaXMubG9hZEV2ZW50ID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgdmFyIGV2ZW50RGl2ID0gZS50b0VsZW1lbnQ7XG4gICAgICAgIHZhciBldmVudElkID0gZXZlbnREaXYuaW5uZXJUZXh0O1xuXG4gICAgICAgIHZhciBldmVudERhdGEgPSBudWxsO1xuICAgICAgICBmb3IgKGxldCBldmVudEpzb24gb2YgX3RoaXMubW9kZWwuZ2V0KCdldmVudHMnKSkge1xuICAgICAgICAgICAgaWYgKGV2ZW50SnNvblsnaWQnXSA9PT0gZXZlbnRJZCkge1xuICAgICAgICAgICAgICAgIGV2ZW50RGF0YSA9IGV2ZW50SnNvbjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChldmVudERhdGEpIHtcbiAgICAgICAgICAgIF90aGlzLm1vZGVsLnNldCh7XG4gICAgICAgICAgICAgICAgJ2V2ZW50JzogZXZlbnREYXRhXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBfaW5pdGlhbGl6ZShvcHRpb25zKTtcbiAgICBvcHRpb25zID0gbnVsbDtcbiAgICByZXR1cm4gX3RoaXM7XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gRXZlbnRWaWV3OyIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgVmlldyA9IHJlcXVpcmUoJ2hhemRldi13ZWJ1dGlscy9zcmMvbXZjL1ZpZXcnKTtcblxudmFyIExvYWRpbmdWaWV3ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICB2YXIgX3RoaXMsXG4gICAgICAgICAgICBfaW5pdGlhbGl6ZTtcblxuICAgIF90aGlzID0gVmlldyhvcHRpb25zKTtcblxuICAgIF9pbml0aWFsaXplID0gZnVuY3Rpb24gKC8qb3B0aW9ucyovICkge1xuICAgICAgICBfdGhpcy5sb2FkaW5nQ291bnQgPSAwO1xuICAgICAgICBfdGhpcy5lbC5pbm5lckhUTUwgPSAnPGRpdiBjbGFzcz1cImxvYWRpbmdcIj5Mb2FkaW5nLi4uPC9kaXY+JztcbiAgICAgICAgX3RoaXMubW9kZWwub24oJ2NoYW5nZTpsb2FkaW5nJywgX3RoaXMuY2hhbmdlTG9hZGluZyk7XG4gICAgfTtcblxuICAgIF90aGlzLmNoYW5nZUxvYWRpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChfdGhpcy5tb2RlbC5nZXQoJ2xvYWRpbmcnKSA9PT0gdHJ1ZSkge1xuXG4gICAgICAgICAgICAvLyBhZGQgbG9hZGluZyBjbGFzcyB0byBtYWtlIGxvYWRpbmcgZGl2IHZpc2libGVcbiAgICAgICAgICAgIGlmIChfdGhpcy5sb2FkaW5nQ291bnQgPT09IDApIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5lbC5jbGFzc0xpc3QuYWRkKCdsb2FkaW5nLWNvbnRlbnQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF90aGlzLmxvYWRpbmdDb3VudCArPSAxO1xuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBfdGhpcy5sb2FkaW5nQ291bnQgLT0gMTtcblxuICAgICAgICAgICAgLy8gaWYgbm90aGluZyBpcyBsb2FkaW5nLCBoaWRlIHRoZSBkaXZcbiAgICAgICAgICAgIGlmIChfdGhpcy5sb2FkaW5nQ291bnQgPT09IDApIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5lbC5jbGFzc0xpc3QucmVtb3ZlKCdsb2FkaW5nLWNvbnRlbnQnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gcmVzZXQgbG9hZGluZyBjb3VudCBpZiBpdCBkcm9wcyBiZWxvdyB6ZXJvXG4gICAgICAgICAgICBpZiAoX3RoaXMubG9hZGluZ0NvdW50IDwgMCkge1xuICAgICAgICAgICAgICAgIF90aGlzLmxvYWRpbmdDb3VudCA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG5cblxuICAgIF9pbml0aWFsaXplKG9wdGlvbnMpO1xuICAgIG9wdGlvbnMgPSBudWxsO1xuICAgIHJldHVybiBfdGhpcztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTG9hZGluZ1ZpZXc7IiwiLyogZ2xvYmFsIEwgKi9cbid1c2Ugc3RyaWN0JztcblxuY29uc3QgVmlldyA9IHJlcXVpcmUoJ2hhemRldi13ZWJ1dGlscy9zcmMvbXZjL1ZpZXcnKTtcbnZhciAgR2VuZXJhdG9yID0gcmVxdWlyZSgnc2hha2VtYXAtdmlldy9tYXBzL2xheWVycy9HZW5lcmF0b3InKTtcblxuXG52YXIgTWFwVmlldyA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgdmFyIF90aGlzLFxuICAgICAgICAgICAgX2luaXRpYWxpemU7XG5cbiAgICBfdGhpcyA9IFZpZXcob3B0aW9ucyk7XG5cbiAgICBfaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uICgvKm9wdGlvbnMqLyApIHtcbiAgICAgICAgX3RoaXMuZWwuaW5uZXJIVE1MID0gJzxkaXYgY2xhc3M9XCJtYXBcIiBzdHlsZT1cImhlaWdodDoxMDAlO3dpZHRoOjEwMCVcIj48L2Rpdj4nO1xuICAgICAgICBfdGhpcy5kZWZhdWx0TGF5ZXJzID0gX3RoaXMubW9kZWwuZ2V0KCdkZWZhdWx0TGF5ZXJzJyk7XG4gICAgICAgIGxldCBtYXBFbCA9IF90aGlzLmVsLnF1ZXJ5U2VsZWN0b3IoJy5tYXAnKTtcblxuICAgICAgICBfdGhpcy5tYXAgPSBMLm1hcChtYXBFbCwge1xuICAgICAgICAgICAgc2Nyb2xsV2hlZWxab29tOiBmYWxzZVxuICAgICAgICB9KS5zZXRWaWV3KFs1MS41MDUsIC0wLjA5XSwgMTMpO1xuXG4gICAgICAgIF90aGlzLmxheWVyR2VuZXJhdG9yID0gR2VuZXJhdG9yKG9wdGlvbnMpO1xuICAgICAgICBfdGhpcy5iYXNlTGF5ZXIgPSBfdGhpcy5nZW5CYXNlTGF5ZXIoKTtcbiAgICAgICAgX3RoaXMubGF5ZXJzQ29udHJvbCA9IEwuY29udHJvbC5sYXllcnMoeydCYXNlbWFwJzogX3RoaXMuYmFzZUxheWVyfSkuYWRkVG8oX3RoaXMubWFwKTtcblxuICAgICAgICBfdGhpcy5tb2RlbC5vbignY2hhbmdlOmV2ZW50JywgX3RoaXMucmVuZGVyRXZlbnRMYXllcnMpO1xuICAgICAgICBfdGhpcy5tb2RlbC5vbignY2hhbmdlOmxheWVycycsIF90aGlzLmFkZE1hcExheWVycyk7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsYXllcnNGaW5pc2hlZCcsIF90aGlzLmFkZE1hcExheWVycyk7XG4gICAgfTtcblxuICAgIF90aGlzLmdlbkJhc2VMYXllciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGJhc2VsYXllciA9IEwudGlsZUxheWVyKCdodHRwczovL2FwaS50aWxlcy5tYXBib3guY29tL3Y0L3tpZH0ve3p9L3t4fS97eX0ucG5nP2FjY2Vzc190b2tlbj0nICsgJ3BrLmV5SjFJam9pWkhOc2IzTnJlU0lzSW1FaU9pSmphWFIxYUhKblkzRXdNREZvTW5SeFpXVnRjbTlsYVdKbUluMC4xQzNHRTBrSFBHT3BiVlY5a1R4QmxRJywge1xuICAgICAgICAgICAgbWF4Wm9vbTogMTgsXG4gICAgICAgICAgICBhdHRyaWJ1dGlvbjogJ01hcCBkYXRhICZjb3B5OyA8YSBocmVmPVwiaHR0cDovL29wZW5zdHJlZXRtYXAub3JnXCI+T3BlblN0cmVldE1hcDwvYT4gY29udHJpYnV0b3JzLCAnICtcbiAgICAgICAgICAgICAgICAnPGEgaHJlZj1cImh0dHA6Ly9jcmVhdGl2ZWNvbW1vbnMub3JnL2xpY2Vuc2VzL2J5LXNhLzIuMC9cIj5DQy1CWS1TQTwvYT4sICcgK1xuICAgICAgICAgICAgICAgICdJbWFnZXJ5IO+/vSA8YSBocmVmPVwiaHR0cDovL21hcGJveC5jb21cIj5NYXBib3g8L2E+JyxcbiAgICAgICAgICAgIGlkOiAnbWFwYm94LnN0cmVldHMnXG4gICAgICAgIH0pLmFkZFRvKF90aGlzLm1hcCk7XG5cbiAgICAgICAgcmV0dXJuIGJhc2VsYXllcjtcbiAgICB9O1xuXG4gICAgX3RoaXMucmVuZGVyRXZlbnRMYXllcnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIGNsZWFyIG1hcFxuICAgICAgICBfdGhpcy5jbGVhck1hcExheWVycygpO1xuICAgICAgICBcbiAgICAgICAgLy8gZ2VuZXJhdGUgbmV3IGxheWVyc1xuICAgICAgICBfdGhpcy5iYXNlTGF5ZXIgPSBfdGhpcy5nZW5CYXNlTGF5ZXIoKTtcbiAgICAgICAgdmFyIGV2ZW50ID0gX3RoaXMubW9kZWwuZ2V0KCdldmVudCcpO1xuICAgICAgICBcbiAgICAgICAgX3RoaXMubGF5ZXJHZW5lcmF0b3IuZ2VuZXJhdGVMYXllcnMoZXZlbnQpO1xuICAgICAgICBfdGhpcy5sYXllcnNDb250cm9sID0gTC5jb250cm9sLmxheWVycyh7J0Jhc2VtYXAnOiBfdGhpcy5iYXNlTGF5ZXJ9KS5hZGRUbyhfdGhpcy5tYXApO1xuICAgIH07XG5cbiAgICBfdGhpcy5hZGRNYXBMYXllcnMgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICAvLyBjbGVhciBtYXBcbiAgICAgICAgX3RoaXMuY2xlYXJNYXBMYXllcnMoKTtcblxuICAgICAgICAvLyBjb2xsZWN0IGxheWVyc1xuICAgICAgICBfdGhpcy5iYXNlTGF5ZXIgPSBfdGhpcy5nZW5CYXNlTGF5ZXIoKTtcbiAgICAgICAgdmFyIGxheWVycyA9IGUuZGV0YWlsO1xuXG4gICAgICAgIF90aGlzLmxheWVyc0NvbnRyb2wgPSBMLmNvbnRyb2wubGF5ZXJzKHsnQmFzZW1hcCc6IF90aGlzLmJhc2VMYXllcn0sIGxheWVycykuYWRkVG8oX3RoaXMubWFwKTtcblxuICAgICAgICB2YXIgbGF5ZXJBcnIgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgbGF5ZXIgaW4gbGF5ZXJzKSB7XG4gICAgICAgICAgICBpZiAoX3RoaXMuZGVmYXVsdExheWVycy5pbmRleE9mKGxheWVyKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgbGF5ZXJzW2xheWVyXS5hZGRUbyhfdGhpcy5tYXApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGF5ZXJBcnIucHVzaChsYXllcnNbbGF5ZXJdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBncm91cCA9IEwuZmVhdHVyZUdyb3VwKGxheWVyQXJyKTtcbiAgICAgICAgX3RoaXMubWFwLmZpdEJvdW5kcyhncm91cC5nZXRCb3VuZHMoKS5wYWQoMC41KSk7XG5cbiAgICB9O1xuXG4gICAgX3RoaXMuY2xlYXJNYXBMYXllcnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIF90aGlzLm1hcC5lYWNoTGF5ZXIoZnVuY3Rpb24gKGxheWVyKSB7XG4gICAgICAgICAgICBfdGhpcy5tYXAucmVtb3ZlTGF5ZXIobGF5ZXIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBfdGhpcy5sYXllcnNDb250cm9sLnJlbW92ZUZyb20oX3RoaXMubWFwKTtcbiAgICB9O1xuXG4gICAgX2luaXRpYWxpemUob3B0aW9ucyk7XG4gICAgb3B0aW9ucyA9IG51bGw7XG4gICAgcmV0dXJuIF90aGlzO1xufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IE1hcFZpZXc7IiwiJ3VzZSBzdHJpY3QnO1xuY29uc3QgZXZlbnRzID0gcmVxdWlyZSgnc2hha2VtYXAtdmlldy9tYXBzL2xheWVycy9ldmVudHMnKSxcbiAgICAgICAgVmlldyA9IHJlcXVpcmUoJ2hhemRldi13ZWJ1dGlscy9zcmMvbXZjL1ZpZXcnKTtcblxudmFyIGxheWVyc0luID0gW3JlcXVpcmUoJ3NoYWtlbWFwLXZpZXcvbWFwcy9sYXllcnMvZXBpY2VudGVyJyksXG4gICAgcmVxdWlyZSgnc2hha2VtYXAtdmlldy9tYXBzL2xheWVycy9jb250X3BnYScpXTtcblxudmFyIEdlbmVyYXRvciA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgdmFyIF90aGlzLFxuICAgICAgICAgICAgX2luaXRpYWxpemU7XG5cbiAgICBfdGhpcyA9IFZpZXcob3B0aW9ucyk7XG5cbiAgICBfaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uICgvKm9wdGlvbnMqLykge1xuICAgICAgICBfdGhpcy5sYXllckNvdW50ID0gMDtcbiAgICAgICAgX3RoaXMubGF5ZXJzID0ge307XG4gICAgICAgIF90aGlzLmxheWVyc0luID0gbGF5ZXJzSW47XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsYXllckZpbmlzaGVkJywgX3RoaXMuYWRkTGF5ZXIpO1xuICAgIH07XG5cblxuICAgIF90aGlzLmdlbmVyYXRlTGF5ZXJzID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIF90aGlzLmxheWVyQ291bnQgPSAwO1xuICAgICAgICBfdGhpcy5sYXllcnMgPSB7fTtcbiAgICAgICAgaWYgKGV2ZW50KSB7XG4gICAgICAgICAgICBmb3IgKHZhciByYXdMYXllciBvZiBfdGhpcy5sYXllcnNJbikge1xuICAgICAgICAgICAgICAgIHJhd0xheWVyLmdlbmVyYXRlTGF5ZXIoZXZlbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcblxuICAgIF90aGlzLmFkZExheWVyID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgdmFyIGxheWVyID0gZS5kZXRhaWw7XG5cbiAgICAgICAgLy8gY29sbGVjdCBsYXllcnMgdGhhdCByZW5kZXJlZCBzdWNjZXNzZnVsbHlcbiAgICAgICAgaWYgKGxheWVyLmxheWVyKSB7XG4gICAgICAgICAgICBfdGhpcy5sYXllcnNbbGF5ZXIubmFtZV0gPSBsYXllci5sYXllcjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEtlZXAgdHJhY2sgb2YgYWxsIGxheWVycyB0aGF0IGhhdmUgcmV0dXJuZWRcbiAgICAgICAgX3RoaXMubGF5ZXJDb3VudCArPSAxO1xuXG4gICAgICAgIC8vIHNldCB0aGUgbW9kZWwgaWYgYWxsIHRoZSBsYXllcnMgYXJlIHJlYWR5XG4gICAgICAgIGlmIChfdGhpcy5sYXllckNvdW50ID09PSBfdGhpcy5sYXllcnNJbi5sZW5ndGgpIHtcbiAgICAgICAgICAgIGV2ZW50cy5sYXllcnNGaW5pc2hlZEV2ZW50KF90aGlzLmxheWVycyk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgX2luaXRpYWxpemUob3B0aW9ucyk7XG4gICAgb3B0aW9ucyA9IG51bGw7XG4gICAgcmV0dXJuIF90aGlzO1xufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IEdlbmVyYXRvcjsiLCIvKiBnbG9iYWwgTCAqL1xuJ3VzZSBzdHJpY3QnO1xuY29uc3QgWGhyID0gcmVxdWlyZSgndXRpbC9YaHInKTtcbmNvbnN0IGV2ZW50cyA9IHJlcXVpcmUoJ3NoYWtlbWFwLXZpZXcvbWFwcy9sYXllcnMvZXZlbnRzJyk7XG5cbnZhciBsYXllciA9IHtpZDogJ2Rvd25sb2FkL2NvbnRfcGdhLmpzb24nfTtcbmxheWVyLm5hbWUgPSAnUEdBIENvbnRvdXJzJztcbmxheWVyLmdlbmVyYXRlTGF5ZXIgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICBsYXllci5sYXllciA9IG51bGw7XG4gICAgdmFyIHByb2R1Y3QgPSBudWxsO1xuICAgIHZhciBjb250ZW50cyA9IGV2ZW50LnNoYWtlbWFwWzBdLmNvbnRlbnRzO1xuXG4gICAgZm9yIChsZXQgcCBpbiBjb250ZW50cykge1xuICAgICAgICBpZiAocCA9PT0gbGF5ZXIuaWQpIHtcbiAgICAgICAgICAgIHByb2R1Y3QgPSBjb250ZW50c1twXTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHByb2R1Y3QpIHtcbiAgICAgICAgWGhyLmFqYXgoe1xuICAgICAgICAgICAgdXJsOiBwcm9kdWN0LnVybCxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChqc29uKSB7XG4gICAgICAgICAgICAgICAgbGF5ZXJbJ2xheWVyJ10gPSBMLmdlb0pzb24oanNvbik7XG4gICAgICAgICAgICAgICAgZXZlbnRzLmxheWVyRmluaXNoZWRFdmVudChsYXllcik7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBldmVudHMubGF5ZXJGaW5pc2hlZEV2ZW50KGxheWVyKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkb25lOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGV2ZW50cy5sYXllckZpbmlzaGVkRXZlbnQobGF5ZXIpO1xuICAgIH1cbn07XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGxheWVyOyIsIi8qIGdsb2JhbCBMICovXG4ndXNlIHN0cmljdCc7XG5jb25zdCBldmVudHMgPSByZXF1aXJlKCdzaGFrZW1hcC12aWV3L21hcHMvbGF5ZXJzL2V2ZW50cycpLFxuICAgICAgICBYaHIgPSByZXF1aXJlKCd1dGlsL1hocicpO1xuXG52YXIgbGF5ZXIgPSB7cHJvZHVjdElkOiAnZG93bmxvYWQvZ3JpZC54bWwnfTtcbmxheWVyLmdlbmVyYXRlTGF5ZXIgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICB2YXIgcHJvZHVjdCA9IG51bGw7XG4gICAgdmFyIGNvbnRlbnRzID0gZXZlbnQuc2hha2VtYXBbMF0uY29udGVudHM7XG5cbiAgICBmb3IgKGxldCBwIGluIGNvbnRlbnRzKSB7XG4gICAgICAgIGlmIChwID09PSBsYXllci5wcm9kdWN0SWQpIHtcbiAgICAgICAgICAgIHByb2R1Y3QgPSBjb250ZW50c1twXTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHByb2R1Y3QpIHtcbiAgICAgICAgWGhyLmFqYXgoe1xuICAgICAgICAgICAgdXJsOiBwcm9kdWN0LnVybCxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uICh4bWwpIHtcbiAgICAgICAgICAgICAgICB2YXIgcGFyc2VyID0gbmV3IERPTVBhcnNlcigpO1xuICAgICAgICAgICAgICAgIHZhciB4bWxEb2MgPSBwYXJzZXIucGFyc2VGcm9tU3RyaW5nKHhtbCwndGV4dC94bWwnKTtcbiAgICAgICAgICAgICAgICB2YXIgbGF0LFxuICAgICAgICAgICAgICAgICAgICAgICAgbG9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgcG9wdXBIdG1sO1xuXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgbm9kZSBvZiB4bWxEb2MuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3NoYWtlbWFwX2dyaWQnKVswXS5jaGlsZE5vZGVzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChub2RlLm5vZGVOYW1lID09PSAnZXZlbnQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsYXQgPSBub2RlLmdldEF0dHJpYnV0ZSgnbGF0Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb24gPSBub2RlLmdldEF0dHJpYnV0ZSgnbG9uJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHBvcHVwSHRtbCA9IFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8dGFibGU+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzx0cj48dGg+JyArIG5vZGUuZ2V0QXR0cmlidXRlKCdldmVudF9pZCcpICsgJzwvdGg+PC90cj4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPHRyPjx0YWJsZT48dGg+TWFnbml0dWRlOjwvdGg+PHRkPicgKyBub2RlLmdldEF0dHJpYnV0ZSgnbWFnbml0dWRlJykgKyAnPC90ZD48L3RhYmxlPjwvdHI+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzx0cj48dGFibGU+PHRoPkRlcHRoOjwvdGg+PHRkPicgKyBub2RlLmdldEF0dHJpYnV0ZSgnZGVwdGgnKSArICc8L3RkPjwvdGFibGU+PC90cj4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPHRyPjx0YWJsZT48dGg+TG9jYXRpb246PC90aD48dGQ+JyArIG5vZGUuZ2V0QXR0cmlidXRlKCdsYXQnKSArICcsICcgKyBub2RlLmdldEF0dHJpYnV0ZSgnbG9uJykgKyAnPC90ZD48L3RhYmxlPjwvdHI+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzwvdGFibGU+JztcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgbGF5ZXJbJ2xheWVyJ10gPSBMLm1hcmtlcihbbGF0LCBsb25dKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmJpbmRQb3B1cChwb3B1cEh0bWwpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAub3BlblBvcHVwKCk7XG4gICAgICAgICAgICAgICAgZXZlbnRzLmxheWVyRmluaXNoZWRFdmVudChsYXllcik7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBldmVudHMubGF5ZXJGaW5pc2hlZEV2ZW50KGxheWVyKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkb25lOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG5cbmxheWVyLm5hbWUgPSAnRXBpY2VudGVyJztcblxubW9kdWxlLmV4cG9ydHMgPSBsYXllcjsiLCJ2YXIgbGF5ZXJGaW5pc2hlZEV2ZW50ID0gZnVuY3Rpb24gKGxheWVyKSB7XG4gICAgdmFyIGV2dCA9IG5ldyBDdXN0b21FdmVudCgnbGF5ZXJGaW5pc2hlZCcsIHtkZXRhaWw6IGxheWVyfSk7XG4gICAgd2luZG93LmRpc3BhdGNoRXZlbnQoZXZ0KTtcbn07XG5cbnZhciBsYXllcnNGaW5pc2hlZEV2ZW50ID0gZnVuY3Rpb24gKGxheWVycykge1xuICAgIHZhciBldnQgPSBuZXcgQ3VzdG9tRXZlbnQoJ2xheWVyc0ZpbmlzaGVkJywge2RldGFpbDogbGF5ZXJzfSk7XG4gICAgd2luZG93LmRpc3BhdGNoRXZlbnQoZXZ0KTtcbn07XG5cbnZhciBldmVudHMgPSB7bGF5ZXJzRmluaXNoZWRFdmVudDogbGF5ZXJzRmluaXNoZWRFdmVudCxcbiAgICBsYXllckZpbmlzaGVkRXZlbnQ6IGxheWVyRmluaXNoZWRFdmVudH07XG5cbm1vZHVsZS5leHBvcnRzID0gZXZlbnRzOyIsIid1c2Ugc3RyaWN0JztcblxudmFyIE1hdHJpeCA9IHJlcXVpcmUoJy4vTWF0cml4JyksXG4gICAgVmVjdG9yID0gcmVxdWlyZSgnLi9WZWN0b3InKSxcbiAgICBVdGlsID0gcmVxdWlyZSgndXRpbC9VdGlsJyk7XG5cblxudmFyIF9ERUZBVUxUUyA9IHtcbiAgbG9va0F0OiBbMCwgMCwgMF0sXG4gIG9yaWdpbjogWzEwMCwgMTAwLCAxMDBdLFxuICB1cDogWzAsIDAsIDFdXG59O1xuXG5cbi8qKlxuICogQ2FtZXJhIGRlZmluZXMgYSBjb29yZGluYXRlIHRyYW5zbGF0aW9uIGZyb20gV29ybGQgY29vcmRpbmF0ZXMgKFgsIFksIFopXG4gKiB0byBDYW1lcmEgY29vcmRpbmF0ZXMgKHgsIHksIHopLlxuICpcbiAqIEFmdGVyIHByb2plY3Rpb246XG4gKiAgICAgK3ogaXMgdG8gbG9va0F0IGZyb20gY2FtZXJhXG4gKiAgICAgK3ggaXMgcmlnaHQgZnJvbSBjYW1lcmFcbiAqICAgICAreSBpcyB1cCBmcm9tIGNhbWVyYVxuICpcbiAqIEBwYXJhbSBvcHRpb25zIHtPYmplY3R9XG4gKiBAcGFyYW0gb3B0aW9ucy5vcmlnaW4ge0FycmF5PE51bWJlcj59XG4gKiAgICAgICAgZGVmYXVsdCBbMTAwLCAxMDAsIDEwMF0uXG4gKiAgICAgICAgcG9zaXRpb24gb2YgY2FtZXJhIGluIHdvcmxkIGNvb3JkaW5hdGVzLlxuICogQHBhcmFtIG9wdGlvbnMubG9va0F0IHtBcnJheTxOdW1iZXI+fVxuICogICAgICAgIGRlZmF1bHQgWzAsIDAsIDBdLlxuICogICAgICAgIHBvc2l0aW9uIGZvciBjYW1lcmEgdG8gbG9vayBhdCBpbiB3b3JsZCBjb29yZGluYXRlcy5cbiAqIEBwYXJhbSBvcHRpb25zLnVwIHtBcnJheTxOdW1iZXI+fVxuICogICAgICAgIGRlZmF1bHQgWzAsIDAsIDFdLlxuICogICAgICAgIHZlY3RvciBwb2ludGluZyB1cCBpbiB3b3JsZCBjb29yZGluYXRlcy5cbiAqL1xudmFyIENhbWVyYSA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gIHZhciBfdGhpcyxcbiAgICAgIF9pbml0aWFsaXplLFxuICAgICAgLy8gdmFyaWFibGVzXG4gICAgICBfbG9va0F0LFxuICAgICAgX29yaWdpbixcbiAgICAgIF91cCxcbiAgICAgIF93b3JsZFRvQ2FtZXJhO1xuXG5cbiAgX3RoaXMgPSB7fTtcblxuICBfaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgdmFyIHJvdGF0ZSxcbiAgICAgICAgdHJhbnNsYXRlLFxuICAgICAgICB4LFxuICAgICAgICB5LFxuICAgICAgICB6O1xuXG4gICAgb3B0aW9ucyA9IFV0aWwuZXh0ZW5kKHt9LCBfREVGQVVMVFMsIG9wdGlvbnMpO1xuXG4gICAgX2xvb2tBdCA9IFZlY3RvcihvcHRpb25zLmxvb2tBdCk7XG4gICAgX29yaWdpbiA9IFZlY3RvcihvcHRpb25zLm9yaWdpbik7XG4gICAgX3VwID0gVmVjdG9yKG9wdGlvbnMudXApO1xuXG4gICAgLy8gY2FtZXJhIGF4ZXMgdXNpbmcgd29ybGQgY29vcmRpbmF0ZXNcbiAgICAvLyAreiBpcyBmcm9tIG9yaWdpbiB0aHJvdWdoIGxvb2sgYXRcbiAgICB6ID0gX2xvb2tBdC5zdWJ0cmFjdChfb3JpZ2luKS51bml0KCk7XG4gICAgLy8gK3ggaXMgcmlnaHRcbiAgICB4ID0gei5jcm9zcyhfdXApLnVuaXQoKTtcbiAgICAvLyAreSBpcyB1cFxuICAgIHkgPSB4LmNyb3NzKHopLnVuaXQoKTtcblxuICAgIHJvdGF0ZSA9IE1hdHJpeChbXG4gICAgICB4LngoKSwgeC55KCksIHgueigpLCAwLFxuICAgICAgeS54KCksIHkueSgpLCB5LnooKSwgMCxcbiAgICAgIHoueCgpLCB6LnkoKSwgei56KCksIDAsXG4gICAgICAwLCAwLCAwLCAxXG4gICAgXSwgNCwgNCk7XG5cbiAgICB0cmFuc2xhdGUgPSBNYXRyaXgoW1xuICAgICAgMSwgMCwgMCwgLV9vcmlnaW4ueCgpLFxuICAgICAgMCwgMSwgMCwgLV9vcmlnaW4ueSgpLFxuICAgICAgMCwgMCwgMSwgLV9vcmlnaW4ueigpLFxuICAgICAgMCwgMCwgMCwgMVxuICAgIF0sIDQsIDQpO1xuXG4gICAgX3dvcmxkVG9DYW1lcmEgPSByb3RhdGUubXVsdGlwbHkodHJhbnNsYXRlKS5kYXRhKCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFByb2plY3QgYSBwb2ludCBmcm9tIHdvcmxkIGNvb3JkaW5hdGVzIHRvIGNhbWVyYSBjb29yZGluYXRlcy5cbiAgICpcbiAgICogQHBhcmFtIHdvcmxkIHtBcnJheTxOdW1iZXI+fVxuICAgKiAgICAgICAgeCwgeSwgeiB3b3JsZCBjb29yZGluYXRlcy5cbiAgICogQHJldHVybiB7QXJyYXk8TnVtYmVyPn1cbiAgICogICAgICAgIHgsIHksIHosIGNhbWVyYSBjb29yZGluYXRlcy5cbiAgICovXG4gIF90aGlzLnByb2plY3QgPSBmdW5jdGlvbiAod29ybGQpIHtcbiAgICB2YXIgcHJvamVjdGVkLFxuICAgICAgICB4LFxuICAgICAgICB4cCxcbiAgICAgICAgeSxcbiAgICAgICAgeXAsXG4gICAgICAgIHosXG4gICAgICAgIHpwO1xuXG4gICAgeCA9IHdvcmxkWzBdO1xuICAgIHkgPSB3b3JsZFsxXTtcbiAgICB6ID0gd29ybGRbMl07XG4gICAgcHJvamVjdGVkID0gTWF0cml4Lm11bHRpcGx5KF93b3JsZFRvQ2FtZXJhLCA0LCA0LCBbeCwgeSwgeiwgMV0sIDQsIDEpO1xuXG4gICAgeHAgPSBwcm9qZWN0ZWRbMF07XG4gICAgeXAgPSBwcm9qZWN0ZWRbMV07XG4gICAgenAgPSBwcm9qZWN0ZWRbMl07XG4gICAgcmV0dXJuIFt4cCwgeXAsIHpwXTtcbiAgfTtcblxuXG4gIF9pbml0aWFsaXplKG9wdGlvbnMpO1xuICBvcHRpb25zID0gbnVsbDtcbiAgcmV0dXJuIF90aGlzO1xufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IENhbWVyYTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIFZlY3RvciA9IHJlcXVpcmUoJy4vVmVjdG9yJyk7XG5cblxuLy8gc3RhdGljIG1ldGhvZHMgdGhhdCBvcGVyYXRlIG9uIGFycmF5c1xudmFyIF9fY29sLFxuICAgIF9fZGlhZ29uYWwsXG4gICAgX19nZXQsXG4gICAgX19pZGVudGl0eSxcbiAgICBfX2luZGV4LFxuICAgIF9famFjb2JpLFxuICAgIF9fbXVsdGlwbHksXG4gICAgX19yb3csXG4gICAgX19zZXQsXG4gICAgX19zdHJpbmdpZnksXG4gICAgX190cmFuc3Bvc2U7XG5cblxuLyoqXG4gKiBFeHRyYWN0IGEgY29sdW1uIGZyb20gdGhpcyBtYXRyaXguXG4gKlxuICogQHBhcmFtIGRhdGEge0FycmF5PE51bWJlcj59XG4gKiAgICAgICAgbWF0cml4IGRhdGEuXG4gKiBAcGFyYW0gbSB7TnVtYmVyfVxuICogICAgICAgIG51bWJlciBvZiByb3dzLlxuICogQHBhcmFtIG4ge051bWJlcn1cbiAqICAgICAgICBudW1iZXIgb2YgY29sdW1ucy5cbiAqIEBwYXJhbSBjb2wge051bWJlcn1cbiAqICAgICAgICBpbmRleCBvZiBjb2x1bW4sIGluIHJhbmdlIFswLG4pXG4gKiBAdGhyb3dzIEVycm9yIGlmIGNvbHVtbiBvdXQgb2YgcmFuZ2UuXG4gKiBAcmV0dXJuIHtBcnJheTxOdW1iZXI+fSBjb2x1bW4gZWxlbWVudHMuXG4gKi9cbl9fY29sID0gZnVuY3Rpb24gKGRhdGEsIG0sIG4sIGNvbCkge1xuICB2YXIgcm93LFxuICAgICAgdmFsdWVzID0gW107XG4gIGlmIChjb2wgPCAwIHx8IGNvbCA+PSBuKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdjb2x1bW4gJyArIGNvbCArICcgb3V0IG9mIHJhbmdlIFswLCcgKyBuICsgJyknKTtcbiAgfVxuICBpZiAobiA9PT0gMSkge1xuICAgIC8vIG9ubHkgb25lIGNvbHVtbiBpbiBtYXRyaXhcbiAgICByZXR1cm4gZGF0YTtcbiAgfVxuICB2YWx1ZXMgPSBbXTtcbiAgZm9yIChyb3cgPSAwOyByb3cgPCBtOyByb3crKykge1xuICAgIHZhbHVlcy5wdXNoKGRhdGFbX19pbmRleChtLCBuLCByb3csIGNvbCldKTtcbiAgfVxuICByZXR1cm4gdmFsdWVzO1xufTtcblxuLyoqXG4gKiBHZXQgYXJyYXkgb2YgZWxlbWVudHMgb24gdGhlIGRpYWdvbmFsLlxuICpcbiAqIEBwYXJhbSBkYXRhIHtBcnJheTxOdW1iZXI+fVxuICogICAgICAgIG1hdHJpeCBkYXRhLlxuICogQHBhcmFtIG0ge051bWJlcn1cbiAqICAgICAgICBudW1iZXIgb2Ygcm93cy5cbiAqIEBwYXJhbSBuIHtOdW1iZXJ9XG4gKiAgICAgICAgbnVtYmVyIG9mIGNvbHVtbnMuXG4gKiBAcmV0dXJuIHtBcnJheTxOdW1iZXI+fSBlbGVtZW50cyBvbiB0aGUgZGlhZ29uYWwuXG4gKi9cbl9fZGlhZ29uYWwgPSBmdW5jdGlvbiAoZGF0YSwgbSwgbikge1xuICB2YXIgbGVuID0gTWF0aC5taW4obSwgbiksXG4gICAgICBkaWFnID0gW10sXG4gICAgICBpO1xuICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICBkaWFnLnB1c2goZGF0YVtfX2luZGV4KG0sIG4sIGksIGkpXSk7XG4gIH1cbiAgcmV0dXJuIGRpYWc7XG59O1xuXG4vKipcbiAqIEdldCB0aGUgdmFsdWUgb2YgYW4gZWxlbWVudCBvZiB0aGlzIG1hdHJpeC5cbiAqXG4gKiBAcGFyYW0gZGF0YSB7QXJyYXk8TnVtYmVyPn1cbiAqICAgICAgICBtYXRyaXggZGF0YS5cbiAqIEBwYXJhbSBtIHtOdW1iZXJ9XG4gKiAgICAgICAgbnVtYmVyIG9mIHJvd3MuXG4gKiBAcGFyYW0gbiB7TnVtYmVyfVxuICogICAgICAgIG51bWJlciBvZiBjb2x1bW5zLlxuICogQHBhcmFtIHJvdyB7TnVtYmVyfVxuICogICAgICAgIHJvdyBvZiBlbGVtZW50LCBpbiByYW5nZSBbMCxtKVxuICogQHBhcmFtIGNvbCB7TnVtYmVyfVxuICogICAgICAgIGNvbHVtbiBvZiBlbGVtZW50LCBpbiByYW5nZSBbMCxuKVxuICogQHRocm93cyBFcnJvciBpZiByb3cgb3IgY29sIGFyZSBvdXQgb2YgcmFuZ2UuXG4gKiBAcmV0dXJuIHtOdW1iZXJ9IHZhbHVlLlxuICovXG5fX2dldCA9IGZ1bmN0aW9uIChkYXRhLCBtLCBuLCByb3csIGNvbCkge1xuICByZXR1cm4gZGF0YVtfX2luZGV4KG0sIG4sIHJvdywgY29sKV07XG59O1xuXG4vKipcbiAqIENyZWF0ZSBhbiBpZGVudGl0eSBNYXRyaXguXG4gKlxuICogQHBhcmFtIG4ge051bWJlcn1cbiAqICAgICAgICBudW1iZXIgb2Ygcm93cyBhbmQgY29sdW1ucy5cbiAqIEByZXR1cm4gaWRlbnRpdHkgbWF0cml4IG9mIHNpemUgbi5cbiAqL1xuX19pZGVudGl0eSA9IGZ1bmN0aW9uIChuKSB7XG4gIHZhciB2YWx1ZXMgPSBbXSxcbiAgICAgIHJvdyxcbiAgICAgIGNvbDtcbiAgZm9yIChyb3cgPSAwOyByb3cgPCBuOyByb3crKykge1xuICAgIGZvciAoY29sID0gMDsgY29sIDwgbjsgY29sKyspIHtcbiAgICAgIHZhbHVlcy5wdXNoKChyb3cgPT09IGNvbCkgPyAxIDogMCk7XG4gICAgfVxuICB9XG4gIHJldHVybiB2YWx1ZXM7XG59O1xuXG4vKipcbiAqIEdldCB0aGUgaW5kZXggb2YgYW4gZWxlbWVudCBvZiB0aGlzIG1hdHJpeC5cbiAqXG4gKiBAcGFyYW0gZGF0YSB7QXJyYXk8TnVtYmVyPn1cbiAqICAgICAgICBtYXRyaXggZGF0YS5cbiAqIEBwYXJhbSBtIHtOdW1iZXJ9XG4gKiAgICAgICAgbnVtYmVyIG9mIHJvd3MuXG4gKiBAcGFyYW0gbiB7TnVtYmVyfVxuICogICAgICAgIG51bWJlciBvZiBjb2x1bW5zLlxuICogQHBhcmFtIHJvdyB7TnVtYmVyfVxuICogICAgICAgIHJvdyBvZiBlbGVtZW50LCBpbiByYW5nZSBbMCxtKVxuICogQHBhcmFtIGNvbCB7TnVtYmVyfVxuICogICAgICAgIGNvbHVtbiBvZiBlbGVtZW50LCBpbiByYW5nZSBbMCxuKVxuICogQHJldHVybiB7TnVtYmVyfSBpbmRleC5cbiAqL1xuX19pbmRleCA9IGZ1bmN0aW9uIChtLCBuLCByb3csIGNvbCkge1xuICByZXR1cm4gbiAqIHJvdyArIGNvbDtcbn07XG5cbi8qKlxuICogSmFjb2JpIGVpZ2VudmFsdWUgYWxnb3JpdGhtLlxuICpcbiAqIFBvcnRlZCBmcm9tOlxuICogICAgIGh0dHA6Ly91c2Vycy1waHlzLmF1LmRrL2ZlZG9yb3YvbnVjbHRoZW8vTnVtZXJpYy9ub3cvZWlnZW4ucGRmXG4gKlxuICogQW4gaXRlcmF0aXZlIG1ldGhvZCBmb3IgZWlnZW52YWx1ZXMgYW5kIGVpZ2VudmVjdG9ycyxcbiAqIG9ubHkgd29ya3Mgb24gc3ltbWV0cmljIG1hdHJpY2VzLlxuICpcbiAqIEBwYXJhbSBkYXRhIHtBcnJheTxOdW1iZXI+fVxuICogICAgICAgIG1hdHJpeCBkYXRhLlxuICogQHBhcmFtIG0ge051bWJlcn1cbiAqICAgICAgICBudW1iZXIgb2Ygcm93cy5cbiAqIEBwYXJhbSBuIHtOdW1iZXJ9XG4gKiAgICAgICAgbnVtYmVyIG9mIGNvbHVtbnMuXG4gKiBAcGFyYW0gbWF4Um90YXRpb25zIHtOdW1iZXJ9XG4gKiAgICAgICAgbWF4aW11bSBudW1iZXIgb2Ygcm90YXRpb25zLlxuICogICAgICAgIE9wdGlvbmFsLCBkZWZhdWx0IDEwMC5cbiAqIEByZXR1cm4ge0FycmF5PFZlY3Rvcj59IGFycmF5IG9mIGVpZ2VudmVjdG9ycywgbWFnbml0dWRlIGlzIGVpZ2VudmFsdWUuXG4gKi9cbl9famFjb2JpID0gZnVuY3Rpb24gKGRhdGEsIG0sIG4sIG1heFJvdGF0aW9ucykge1xuICB2YXIgYSxcbiAgICAgIGFpcCxcbiAgICAgIGFpcSxcbiAgICAgIGFwaSxcbiAgICAgIGFwcCxcbiAgICAgIGFwcDEsXG4gICAgICBhcHEsXG4gICAgICBhcWksXG4gICAgICBhcXEsXG4gICAgICBhcXExLFxuICAgICAgYyxcbiAgICAgIGNoYW5nZWQsXG4gICAgICBlLFxuICAgICAgaSxcbiAgICAgIGlwLFxuICAgICAgaXEsXG4gICAgICBwLFxuICAgICAgcGhpLFxuICAgICAgcGksXG4gICAgICBxLFxuICAgICAgcWksXG4gICAgICByb3RhdGlvbnMsXG4gICAgICBzLFxuICAgICAgdixcbiAgICAgIHZlY3RvcixcbiAgICAgIHZlY3RvcnMsXG4gICAgICB2aXAsXG4gICAgICB2aXE7XG5cbiAgaWYgKG0gIT09IG4pIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0phY29iaSBvbmx5IHdvcmtzIG9uIHN5bW1ldHJpYywgc3F1YXJlIG1hdHJpY2VzJyk7XG4gIH1cblxuICAvLyBzZXQgYSBkZWZhdWx0IG1heFxuICBtYXhSb3RhdGlvbnMgPSBtYXhSb3RhdGlvbnMgfHwgMTAwO1xuICBhID0gZGF0YS5zbGljZSgwKTtcbiAgZSA9IF9fZGlhZ29uYWwoZGF0YSwgbSwgbik7XG4gIHYgPSBfX2lkZW50aXR5KG4pO1xuICByb3RhdGlvbnMgPSAwO1xuXG4gIGRvIHtcbiAgICBjaGFuZ2VkID0gZmFsc2U7XG5cbiAgICBmb3IgKHA9MDsgcDxuOyBwKyspIHtcbiAgICAgIGZvciAocT1wKzE7IHE8bjsgcSsrKSB7XG4gICAgICAgIGFwcCA9IGVbcF07XG4gICAgICAgIGFxcSA9IGVbcV07XG4gICAgICAgIGFwcSA9IGFbbiAqIHAgKyBxXTtcbiAgICAgICAgcGhpID0gMC41ICogTWF0aC5hdGFuMigyICogYXBxLCBhcXEgLSBhcHApO1xuICAgICAgICBjID0gTWF0aC5jb3MocGhpKTtcbiAgICAgICAgcyA9IE1hdGguc2luKHBoaSk7XG4gICAgICAgIGFwcDEgPSBjICogYyAqIGFwcCAtIDIgKiBzICogYyAqIGFwcSArIHMgKiBzICogYXFxO1xuICAgICAgICBhcXExID0gcyAqIHMgKiBhcHAgKyAyICogcyAqIGMgKiBhcHEgKyBjICogYyAqIGFxcTtcblxuICAgICAgICBpZiAoYXBwMSAhPT0gYXBwIHx8IGFxcTEgIT09IGFxcSkge1xuICAgICAgICAgIGNoYW5nZWQgPSB0cnVlO1xuICAgICAgICAgIHJvdGF0aW9ucysrO1xuXG4gICAgICAgICAgZVtwXSA9IGFwcDE7XG4gICAgICAgICAgZVtxXSA9IGFxcTE7XG4gICAgICAgICAgYVtuICogcCArIHFdID0gMDtcblxuICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBwOyBpKyspIHtcbiAgICAgICAgICAgIGlwID0gbiAqIGkgKyBwO1xuICAgICAgICAgICAgaXEgPSBuICogaSArIHE7XG4gICAgICAgICAgICBhaXAgPSBhW2lwXTtcbiAgICAgICAgICAgIGFpcSA9IGFbaXFdO1xuICAgICAgICAgICAgYVtpcF0gPSBjICogYWlwIC0gcyAqIGFpcTtcbiAgICAgICAgICAgIGFbaXFdID0gYyAqIGFpcSArIHMgKiBhaXA7XG4gICAgICAgICAgfVxuICAgICAgICAgIGZvciAoaSA9IHAgKyAxOyBpIDwgcTsgaSsrKSB7XG4gICAgICAgICAgICBwaSA9IG4gKiBwICsgaTtcbiAgICAgICAgICAgIGlxID0gbiAqIGkgKyBxO1xuICAgICAgICAgICAgYXBpID0gYVtwaV07XG4gICAgICAgICAgICBhaXEgPSBhW2lxXTtcbiAgICAgICAgICAgIGFbcGldID0gYyAqIGFwaSAtIHMgKiBhaXE7XG4gICAgICAgICAgICBhW2lxXSA9IGMgKiBhaXEgKyBzICogYXBpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBmb3IgKGkgPSBxICsgMTsgaSA8IG47IGkrKykge1xuICAgICAgICAgICAgcGkgPSBuICogcCArIGk7XG4gICAgICAgICAgICBxaSA9IG4gKiBxICsgaTtcbiAgICAgICAgICAgIGFwaSA9IGFbcGldO1xuICAgICAgICAgICAgYXFpID0gYVtxaV07XG4gICAgICAgICAgICBhW3BpXSA9IGMgKiBhcGkgLSBzICogYXFpO1xuICAgICAgICAgICAgYVtxaV0gPSBjICogYXFpICsgcyAqIGFwaTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZm9yIChpID0gMDsgaSA8IG47IGkrKykge1xuICAgICAgICAgICAgaXAgPSBuICogaSArIHA7XG4gICAgICAgICAgICBpcSA9IG4gKiBpICsgcTtcbiAgICAgICAgICAgIHZpcCA9IHZbaXBdO1xuICAgICAgICAgICAgdmlxID0gdltpcV07XG4gICAgICAgICAgICB2W2lwXSA9IGMgKiB2aXAgLSBzICogdmlxO1xuICAgICAgICAgICAgdltpcV0gPSBjICogdmlxICsgcyAqIHZpcDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0gd2hpbGUgKGNoYW5nZWQgJiYgKHJvdGF0aW9ucyA8IG1heFJvdGF0aW9ucykpO1xuXG4gIGlmIChjaGFuZ2VkKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdmYWlsZWQgdG8gY29udmVyZ2UnKTtcbiAgfVxuXG4gIHZlY3RvcnMgPSBbXTtcbiAgZm9yIChpID0gMDsgaSA8IG47IGkrKykge1xuICAgIC8vIGktdGggdmVjdG9yIGlzIGktdGggY29sdW1uXG4gICAgdmVjdG9yID0gVmVjdG9yKF9fY29sKHYsIG0sIG4sIGkpKTtcbiAgICB2ZWN0b3IuZWlnZW52YWx1ZSA9IGVbaV07XG4gICAgdmVjdG9ycy5wdXNoKHZlY3Rvcik7XG4gIH1cblxuICByZXR1cm4gdmVjdG9ycztcbn07XG5cbi8qKlxuICogTXVsdGlwbHkgdGhpcyBtYXRyaXggYnkgYW5vdGhlciBtYXRyaXguXG4gKlxuICogQHBhcmFtIGRhdGExIHtBcnJheTxOdW1iZXI+fVxuICogICAgICAgIGZpcnN0IG1hdHJpeCBkYXRhLlxuICogQHBhcmFtIG0xIHtOdW1iZXJ9XG4gKiAgICAgICAgbnVtYmVyIG9mIHJvd3MgaW4gZmlyc3QgbWF0cml4LlxuICogQHBhcmFtIG4xIHtOdW1iZXJ9XG4gKiAgICAgICAgbnVtYmVyIG9mIGNvbHVtbnMgaW4gZmlyc3QgbWF0cml4LlxuICogQHBhcmFtIGRhdGEyIHtBcnJheTxOdW1iZXI+fVxuICogICAgICAgIHNlY29uZCBtYXRyaXggZGF0YS5cbiAqIEBwYXJhbSBtMiB7TnVtYmVyfVxuICogICAgICAgIG51bWJlciBvZiByb3dzIGluIHNlY29uZCBtYXRyaXguXG4gKiBAcGFyYW0gbjIge051bWJlcn1cbiAqICAgICAgICBudW1iZXIgb2YgY29sdW1ucyBpbiBzZWNvbmQgbWF0cml4LlxuICogQHRocm93cyBFcnJvciBpZiBuMSAhPT0gbTJcbiAqIEByZXR1cm4gcmVzdWx0IG9mIG11bHRpcGxpY2F0aW9uIChvcmlnaW5hbCBtYXRyaXggaXMgdW5jaGFuZ2VkKS5cbiAqL1xuX19tdWx0aXBseSA9IGZ1bmN0aW9uIChkYXRhMSwgbTEsIG4xLCBkYXRhMiwgbTIsIG4yKSB7XG4gIHZhciBjb2wsXG4gICAgICBjb2wyLFxuICAgICAgcm93LFxuICAgICAgcm93MSxcbiAgICAgIHZhbHVlcztcblxuICBpZiAobjEgIT09IG0yKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCd3cm9uZyBjb21iaW5hdGlvbiBvZiByb3dzIGFuZCBjb2xzJyk7XG4gIH1cbiAgdmFsdWVzID0gW107XG4gIGZvciAocm93ID0gMDsgcm93IDwgbTE7IHJvdysrKSB7XG4gICAgcm93MSA9IF9fcm93KGRhdGExLCBtMSwgbjEsIHJvdyk7XG4gICAgZm9yIChjb2wgPSAwOyBjb2wgPCBuMjsgY29sKyspIHtcbiAgICAgIGNvbDIgPSBfX2NvbChkYXRhMiwgbTIsIG4yLCBjb2wpO1xuICAgICAgLy8gcmVzdWx0IGlzIGRvdCBwcm9kdWN0XG4gICAgICB2YWx1ZXMucHVzaChWZWN0b3IuZG90KHJvdzEsIGNvbDIpKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHZhbHVlcztcbn07XG5cbi8qKlxuICogRXh0cmFjdCBhIHJvdyBmcm9tIHRoaXMgbWF0cml4LlxuICpcbiAqIEBwYXJhbSBkYXRhIHtBcnJheTxOdW1iZXI+fVxuICogICAgICAgIG1hdHJpeCBkYXRhLlxuICogQHBhcmFtIG0ge051bWJlcn1cbiAqICAgICAgICBudW1iZXIgb2Ygcm93cy5cbiAqIEBwYXJhbSBuIHtOdW1iZXJ9XG4gKiAgICAgICAgbnVtYmVyIG9mIGNvbHVtbnMuXG4gKiBAcGFyYW0gcm93IHtOdW1iZXJ9XG4gKiAgICAgICAgaW5kZXggb2Ygcm93LCBpbiByYW5nZSBbMCxtKVxuICogQHRocm93cyBFcnJvciBpZiByb3cgb3V0IG9mIHJhbmdlLlxuICogQHJldHVybiB7QXJyYXk8TnVtYmVyPn0gcm93IGVsZW1lbnRzLlxuICovXG5fX3JvdyA9IGZ1bmN0aW9uIChkYXRhLCBtLCBuLCByb3cpIHtcbiAgdmFyIGNvbCxcbiAgICAgIHZhbHVlcztcbiAgaWYgKHJvdyA8IDAgfHwgcm93ID49IG0pIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3JvdyAnICsgcm93ICsgJyBvdXQgb2YgcmFuZ2UgWzAsJyArIG0gKyAnKScpO1xuICB9XG4gIHZhbHVlcyA9IFtdO1xuICBmb3IgKGNvbCA9IDA7IGNvbCA8IG47IGNvbCsrKSB7XG4gICAgdmFsdWVzLnB1c2goZGF0YVtfX2luZGV4KG0sIG4sIHJvdywgY29sKV0pO1xuICB9XG4gIHJldHVybiB2YWx1ZXM7XG59O1xuXG4vKipcbiAqIFNldCB0aGUgdmFsdWUgb2YgYW4gZWxlbWVudCBvZiB0aGlzIG1hdHJpeC5cbiAqXG4gKiBOT1RFOiB0aGlzIG1ldGhvZCBtb2RpZmllcyB0aGUgY29udGVudHMgb2YgdGhpcyBtYXRyaXguXG4gKlxuICogQHBhcmFtIGRhdGEge0FycmF5PE51bWJlcj59XG4gKiAgICAgICAgbWF0cml4IGRhdGEuXG4gKiBAcGFyYW0gbSB7TnVtYmVyfVxuICogICAgICAgIG51bWJlciBvZiByb3dzLlxuICogQHBhcmFtIG4ge051bWJlcn1cbiAqICAgICAgICBudW1iZXIgb2YgY29sdW1ucy5cbiAqIEBwYXJhbSByb3cge051bWJlcn1cbiAqICAgICAgICByb3cgb2YgZWxlbWVudCwgaW4gcmFuZ2UgWzAsbSlcbiAqIEBwYXJhbSBjb2wge051bWJlcn1cbiAqICAgICAgICBjb2x1bW4gb2YgZWxlbWVudCwgaW4gcmFuZ2UgWzAsbilcbiAqIEBwYXJhbSB2YWx1ZSB7TnVtYmVyfVxuICogICAgICAgIHZhbHVlIHRvIHNldC5cbiAqIEB0aHJvd3MgRXJyb3IgaWYgcm93IG9yIGNvbCBhcmUgb3V0IG9mIHJhbmdlLlxuICovXG5fX3NldCA9IGZ1bmN0aW9uIChkYXRhLCBtLCBuLCByb3csIGNvbCwgdmFsdWUpIHtcbiAgZGF0YVtfX2luZGV4KG0sIG4sIHJvdywgY29sKV0gPSB2YWx1ZTtcbn07XG5cbi8qKlxuICogRGlzcGxheSBtYXRyaXggYXMgYSBzdHJpbmcuXG4gKlxuICogQHBhcmFtIGRhdGEge0FycmF5PE51bWJlcj59XG4gKiAgICAgICAgbWF0cml4IGRhdGEuXG4gKiBAcGFyYW0gbSB7TnVtYmVyfVxuICogICAgICAgIG51bWJlciBvZiByb3dzLlxuICogQHBhcmFtIG4ge051bWJlcn1cbiAqICAgICAgICBudW1iZXIgb2YgY29sdW1ucy5cbiAqIEByZXR1cm4ge1N0cmluZ30gZm9ybWF0dGVkIG1hdHJpeC5cbiAqL1xuX19zdHJpbmdpZnkgPSBmdW5jdGlvbiAoZGF0YSwgbSwgbikge1xuICB2YXIgbGFzdFJvdyA9IG0gLSAxLFxuICAgICAgbGFzdENvbCA9IG4gLSAxLFxuICAgICAgYnVmID0gW10sXG4gICAgICByb3csXG4gICAgICBjb2w7XG5cbiAgYnVmLnB1c2goJ1snKTtcbiAgZm9yIChyb3cgPSAwOyByb3cgPCBtOyByb3crKykge1xuICAgIGZvciAoY29sID0gMDsgY29sIDwgbjsgY29sKyspIHtcbiAgICAgIGJ1Zi5wdXNoKFxuICAgICAgICAgIGRhdGFbbiAqIHJvdyArIGNvbF0sXG4gICAgICAgICAgKGNvbCAhPT0gbGFzdENvbCB8fCByb3cgIT09IGxhc3RSb3cpID8gJywgJyA6ICcnKTtcbiAgICB9XG4gICAgaWYgKHJvdyAhPT0gbGFzdFJvdykge1xuICAgICAgYnVmLnB1c2goJ1xcbiAnKTtcbiAgICB9XG4gIH1cbiAgYnVmLnB1c2goJ10nKTtcbiAgcmV0dXJuIGJ1Zi5qb2luKCcnKTtcbn07XG5cbi8qKlxuICogVHJhbnNwb3NlIHRoaXMgbWF0cml4LlxuICpcbiAqIEBwYXJhbSBkYXRhIHtBcnJheTxOdW1iZXI+fVxuICogICAgICAgIG1hdHJpeCBkYXRhLlxuICogQHBhcmFtIG0ge051bWJlcn1cbiAqICAgICAgICBudW1iZXIgb2Ygcm93cy5cbiAqIEBwYXJhbSBuIHtOdW1iZXJ9XG4gKiAgICAgICAgbnVtYmVyIG9mIGNvbHVtbnMuXG4gKiBAcmV0dXJuIHRyYW5zcG9zZWQgbWF0cml4IChvcmlnaW5hbCBtYXRyaXggaXMgdW5jaGFuZ2VkKS5cbiAqL1xuX190cmFuc3Bvc2UgPSBmdW5jdGlvbiAoZGF0YSwgbSwgbikge1xuICB2YXIgdmFsdWVzID0gW10sXG4gICAgICByb3csXG4gICAgICBjb2w7XG4gIGZvciAoY29sID0gMDsgY29sIDwgbjsgY29sKyspIHtcbiAgICBmb3IgKHJvdyA9IDA7IHJvdyA8IG07IHJvdysrKSB7XG4gICAgICB2YWx1ZXMucHVzaChkYXRhW19faW5kZXgobSwgbiwgcm93LCBjb2wpXSk7XG4gICAgfVxuICB9XG4gIHJldHVybiB2YWx1ZXM7XG59O1xuXG5cbi8qKlxuICogQ29uc3RydWN0IGEgbmV3IE1hdHJpeCBvYmplY3QuXG4gKlxuICogSWYgbSBhbmQgbiBhcmUgb21pdHRlZCwgTWF0cml4IGlzIGFzc3VtZWQgdG8gYmUgc3F1YXJlIGFuZFxuICogZGF0YSBsZW5ndGggaXMgdXNlZCB0byBjb21wdXRlIHNpemUuXG4gKlxuICogSWYgbSBvciBuIGFyZSBvbWl0dGVkLCBkYXRhIGxlbmd0aCBpcyB1c2VkIHRvIGNvbXB1dGUgb21pdHRlZCB2YWx1ZS5cbiAqXG4gKiBAcGFyYW0gZGF0YSB7QXJyYXl9XG4gKiAgICAgICAgbWF0cml4IGRhdGEuXG4gKiBAcGFyYW0gbSB7TnVtYmVyfVxuICogICAgICAgIG51bWJlciBvZiByb3dzLlxuICogQHBhcmFtIG4ge051bWJlcn1cbiAqICAgICAgICBudW1iZXIgb2YgY29sdW1ucy5cbiAqL1xudmFyIE1hdHJpeCA9IGZ1bmN0aW9uIChkYXRhLCBtLCBuKSB7XG4gIHZhciBfdGhpcyxcbiAgICAgIF9pbml0aWFsaXplLFxuICAgICAgLy8gdmFyaWFibGVzXG4gICAgICBfZGF0YSxcbiAgICAgIF9tLFxuICAgICAgX247XG5cblxuICBfdGhpcyA9IHt9O1xuXG4gIF9pbml0aWFsaXplID0gZnVuY3Rpb24gKGRhdGEsIG0sIG4pIHtcbiAgICBfZGF0YSA9IGRhdGE7XG4gICAgX20gPSBtO1xuICAgIF9uID0gbjtcblxuICAgIGlmIChtICYmIG4pIHtcbiAgICAgIC8vIGRvbmVcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyB0cnkgdG8gY29tcHV0ZSBzaXplIGJhc2VkIG9uIGRhdGFcbiAgICBpZiAoIW0gJiYgIW4pIHtcbiAgICAgIHZhciBzaWRlID0gTWF0aC5zcXJ0KGRhdGEubGVuZ3RoKTtcbiAgICAgIGlmIChzaWRlICE9PSBwYXJzZUludChzaWRlLCAxMCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdtYXRyaXggbSxuIHVuc3BlY2lmaWVkLCBhbmQgbWF0cml4IG5vdCBzcXVhcmUnKTtcbiAgICAgIH1cbiAgICAgIF9tID0gc2lkZTtcbiAgICAgIF9uID0gc2lkZTtcbiAgICB9IGVsc2UgaWYgKCFtKSB7XG4gICAgICBfbSA9IGRhdGEubGVuZ3RoIC8gbjtcbiAgICAgIGlmIChfbSAhPT0gcGFyc2VJbnQoX20sIDEwKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3dyb25nIG51bWJlciBvZiBkYXRhIGVsZW1lbnRzJyk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICghbikge1xuICAgICAgX24gPSBkYXRhLmxlbmd0aCAvIG07XG4gICAgICBpZiAoX24gIT09IHBhcnNlSW50KF9uLCAxMCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCd3cm9uZyBudW1iZXIgb2YgZGF0YSBlbGVtZW50cycpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogQWRkIG1hdHJpY2VzLlxuICAgKlxuICAgKiBAcGFyYW0gdGhhdCB7TWF0cml4fVxuICAgKiAgICAgICAgbWF0cml4IHRvIGFkZC5cbiAgICogQHRocm93cyBFcnJvciBpZiBkaW1lbnNpb25zIGRvIG5vdCBtYXRjaC5cbiAgICogQHJldHVybiByZXN1bHQgb2YgYWRkaXRpb24gKG9yaWdpbmFsIG1hdHJpeCBpcyB1bmNoYW5nZWQpLlxuICAgKi9cbiAgX3RoaXMuYWRkID0gZnVuY3Rpb24gKHRoYXQpIHtcbiAgICBpZiAoX20gIT09IHRoYXQubSgpIHx8IG4gIT09IHRoYXQubigpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ21hdHJpY2VzIG11c3QgYmUgc2FtZSBzaXplJyk7XG4gICAgfVxuICAgIHJldHVybiBNYXRyaXgoVmVjdG9yLmFkZChfZGF0YSwgdGhhdC5kYXRhKCkpLCBfbSwgX24pO1xuICB9O1xuXG4gIC8qKlxuICAgKiBHZXQgYSBjb2x1bW4gZnJvbSB0aGlzIG1hdHJpeC5cbiAgICpcbiAgICogQHBhcmFtIGNvbCB7TnVtYmVyfVxuICAgKiAgICAgICAgemVyby1iYXNlZCBjb2x1bW4gaW5kZXguXG4gICAqIEByZXR1cm4ge0FycmF5PE51bWJlcj59IGFycmF5IGNvbnRhaW5pbmcgZWxlbWVudHMgZnJvbSBjb2x1bW4uXG4gICAqL1xuICBfdGhpcy5jb2wgPSBmdW5jdGlvbiAoY29sKSB7XG4gICAgcmV0dXJuIF9fY29sKF9kYXRhLCBfbSwgX24sIGNvbCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEFjY2VzcyB0aGUgd3JhcHBlZCBhcnJheS5cbiAgICovXG4gIF90aGlzLmRhdGEgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIF9kYXRhO1xuICB9O1xuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGRpYWdvbmFsIGZyb20gdGhpcyBtYXRyaXguXG4gICAqXG4gICAqIEByZXR1cm4ge0FycmF5PE51bWJlcj59IGFycmF5IGNvbnRhaW5pbmcgZWxlbWVudHMgZnJvbSBkaWFnb25hbC5cbiAgICovXG4gIF90aGlzLmRpYWdvbmFsID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBfX2RpYWdvbmFsKF9kYXRhLCBfbSwgX24pO1xuICB9O1xuXG4gIC8qKlxuICAgKiBHZXQgYSB2YWx1ZSBmcm9tIHRoaXMgbWF0cml4LlxuICAgKlxuICAgKiBAcGFyYW0gcm93IHtOdW1iZXJ9XG4gICAqICAgICAgICB6ZXJvLWJhc2VkIGluZGV4IG9mIHJvdy5cbiAgICogQHBhcmFtIGNvbCB7TnVtYmVyfVxuICAgKiAgICAgICAgemVyby1iYXNlZCBpbmRleCBvZiBjb2x1bW4uXG4gICAqIEByZXR1cm4ge051bWJlcn0gdmFsdWUgYXQgKHJvdywgY29sKS5cbiAgICovXG4gIF90aGlzLmdldCA9IGZ1bmN0aW9uIChyb3csIGNvbCkge1xuICAgIHJldHVybiBfX2dldChfZGF0YSwgX20sIF9uLCByb3csIGNvbCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIENvbXB1dGUgdGhlIGVpZ2VudmVjdG9ycyBvZiB0aGlzIG1hdHJpeC5cbiAgICpcbiAgICogTk9URTogTWF0cml4IHNob3VsZCBiZSAzeDMgYW5kIHN5bW1ldHJpYy5cbiAgICpcbiAgICogQHBhcmFtIG1heFJvdGF0aW9ucyB7TnVtYmVyfVxuICAgKiAgICAgICAgZGVmYXVsdCAxMDAuXG4gICAqICAgICAgICBtYXhpbXVtIG51bWJlciBvZiBpdGVyYXRpb25zLlxuICAgKiBAcmV0dXJuIHtBcnJheTxWZWN0b3I+fSBlaWdlbnZlY3RvcnMuXG4gICAqICAgICAgICAgTWFnbml0dWRlIG9mIGVhY2ggdmVjdG9yIGlzIGVpZ2VudmFsdWUuXG4gICAqL1xuICBfdGhpcy5qYWNvYmkgPSBmdW5jdGlvbiAobWF4Um90YXRpb25zKSB7XG4gICAgcmV0dXJuIF9famFjb2JpKF9kYXRhLCBfbSwgX24sIG1heFJvdGF0aW9ucyk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgbnVtYmVyIG9mIHJvd3MgaW4gbWF0cml4LlxuICAgKlxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9XG4gICAqICAgICAgICAgbnVtYmVyIG9mIHJvd3MuXG4gICAqL1xuICBfdGhpcy5tID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBfbTtcbiAgfTtcblxuICAvKipcbiAgICogTXVsdGlwbHkgbWF0cmljZXMuXG4gICAqXG4gICAqIEBwYXJhbSB0aGF0IHtNYXRyaXh9XG4gICAqICAgICAgICBtYXRyaXggdG8gbXVsdGlwbHkuXG4gICAqIEByZXR1cm4ge01hdHJpeH0gcmVzdWx0IG9mIG11bHRpcGxpY2F0aW9uLlxuICAgKi9cbiAgX3RoaXMubXVsdGlwbHkgPSBmdW5jdGlvbiAodGhhdCkge1xuICAgIHJldHVybiBNYXRyaXgoX19tdWx0aXBseShfZGF0YSwgX20sIF9uLCB0aGF0LmRhdGEoKSwgdGhhdC5tKCksIHRoYXQubigpKSxcbiAgICAgICAgLy8gdXNlIHRoYXQuTlxuICAgICAgICBfbSwgdGhhdC5uKCkpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBHZXQgbnVtYmVyIG9mIGNvbHVtbnMgaW4gbWF0cml4LlxuICAgKlxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9IG51bWJlciBvZiBjb2x1bW5zLlxuICAgKi9cbiAgX3RoaXMubiA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gX247XG4gIH07XG5cbiAgLyoqXG4gICAqIE11bHRpcGx5IGVhY2ggZWxlbWVudCBieSAtMS5cbiAgICpcbiAgICogQHJldHVybiB7TWF0cml4fSByZXN1bHQgb2YgbmVnYXRpb24uXG4gICAqL1xuICBfdGhpcy5uZWdhdGl2ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gTWF0cml4KFZlY3Rvci5tdWx0aXBseShfZGF0YSwgLTEpLCBfbSwgX24pO1xuICB9O1xuXG4gIC8qKlxuICAgKiBHZXQgYSByb3cgZnJvbSB0aGlzIG1hdHJpeC5cbiAgICpcbiAgICogQHBhcmFtIHJvdyB7TnVtYmVyfVxuICAgKiAgICAgICAgemVyby1iYXNlZCBpbmRleCBvZiByb3cuXG4gICAqIEByZXR1cm4ge0FycmF5PE51bWJlcj59IGVsZW1lbnRzIGZyb20gcm93LlxuICAgKi9cbiAgX3RoaXMucm93ID0gZnVuY3Rpb24gKHJvdykge1xuICAgIHJldHVybiBfX3JvdyhfZGF0YSwgX20sIF9uLCByb3cpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBTZXQgYSB2YWx1ZSBpbiB0aGlzIG1hdHJpeC5cbiAgICpcbiAgICogQHBhcmFtIHJvdyB7TnVtYmVyfVxuICAgKiAgICAgICAgemVyby1iYXNlZCByb3cgaW5kZXguXG4gICAqIEBwYXJhbSBjb2wge051bWJlcn1cbiAgICogICAgICAgIHplcm8tYmFzZWQgY29sdW1uIGluZGV4LlxuICAgKiBAcGFyYW0gdmFsdWUge051bWJlcn1cbiAgICogICAgICAgIHZhbHVlIHRvIHNldC5cbiAgICovXG4gIF90aGlzLnNldCA9IGZ1bmN0aW9uIChyb3csIGNvbCwgdmFsdWUpIHtcbiAgICBfX3NldChfZGF0YSwgX20sIF9uLCByb3csIGNvbCwgdmFsdWUpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBTdWJ0cmFjdCBhbm90aGVyIG1hdHJpeCBmcm9tIHRoaXMgbWF0cml4LlxuICAgKlxuICAgKiBAcGFyYW0gdGhhdCB7TWF0cml4fVxuICAgKiAgICAgICAgbWF0cml4IHRvIHN1YnRyYWN0LlxuICAgKiBAdGhyb3dzIEVycm9yIGlmIGRpbWVuc2lvbnMgZG8gbm90IG1hdGNoLlxuICAgKiBAcmV0dXJuIHJlc3VsdCBvZiBzdWJ0cmFjdGlvbiAob3JpZ2luYWwgbWF0cml4IGlzIHVuY2hhbmdlZCkuXG4gICAqL1xuICBfdGhpcy5zdWJ0cmFjdCA9IGZ1bmN0aW9uICh0aGF0KSB7XG4gICAgaWYgKF9tICE9PSB0aGF0Lm0oKSB8fCBuICE9PSB0aGF0Lm4oKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdtYXRyaWNlcyBtdXN0IGJlIHNhbWUgc2l6ZScpO1xuICAgIH1cbiAgICByZXR1cm4gTWF0cml4KFZlY3Rvci5zdWJ0cmFjdChfZGF0YSwgdGhhdC5kYXRhKCkpLCBfbSwgX24pO1xuICB9O1xuXG4gIC8qKlxuICAgKiBEaXNwbGF5IG1hdHJpeCBhcyBhIHN0cmluZy5cbiAgICpcbiAgICogQHJldHVybiB7U3RyaW5nfSBmb3JtYXR0ZWQgbWF0cml4LlxuICAgKi9cbiAgX3RoaXMudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIF9fc3RyaW5naWZ5KF9kYXRhLCBfbSwgX24pO1xuICB9O1xuXG4gIC8qKlxuICAgKiBUcmFuc3Bvc2UgbWF0cml4LlxuICAgKlxuICAgKiBDb2x1bW5zIGJlY29tZSByb3dzLCBhbmQgcm93cyBiZWNvbWUgY29sdW1ucy5cbiAgICpcbiAgICogQHJldHVybiB7TWF0cml4fSByZXN1bHQgb2YgdHJhbnNwb3NlLlxuICAgKi9cbiAgX3RoaXMudHJhbnNwb3NlID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBNYXRyaXgoX190cmFuc3Bvc2UoX2RhdGEsIF9tLCBfbiksXG4gICAgICAgIC8vIHN3YXAgTSBhbmQgTlxuICAgICAgICBfbiwgX20pO1xuICB9O1xuXG4gIF9pbml0aWFsaXplKGRhdGEsIG0sIG4pO1xuICBkYXRhID0gbnVsbDtcbiAgcmV0dXJuIF90aGlzO1xufTtcblxuXG4vLyBleHBvc2Ugc3RhdGljIG1ldGhvZHMuXG5NYXRyaXguY29sID0gX19jb2w7XG5NYXRyaXguZGlhZ29uYWwgPSBfX2RpYWdvbmFsO1xuTWF0cml4LmdldCA9IF9fZ2V0O1xuTWF0cml4LmlkZW50aXR5ID0gX19pZGVudGl0eTtcbk1hdHJpeC5pbmRleCA9IF9faW5kZXg7XG5NYXRyaXguamFjb2JpID0gX19qYWNvYmk7XG5NYXRyaXgubXVsdGlwbHkgPSBfX211bHRpcGx5O1xuTWF0cml4LnJvdyA9IF9fcm93O1xuTWF0cml4LnNldCA9IF9fc2V0O1xuTWF0cml4LnN0cmluZ2lmeSA9IF9fc3RyaW5naWZ5O1xuTWF0cml4LnRyYW5zcG9zZSA9IF9fdHJhbnNwb3NlO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gTWF0cml4O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbi8vIHN0YXRpYyBtZXRob2RzIHRoYXQgb3BlcmF0ZSBvbiBhcnJheXNcbnZhciBfX2FkZCxcbiAgICBfX2FuZ2xlLFxuICAgIF9fYXppbXV0aCxcbiAgICBfX2Nyb3NzLFxuICAgIF9fZG90LFxuICAgIF9fZXF1YWxzLFxuICAgIF9fbWFnbml0dWRlLFxuICAgIF9fbXVsdGlwbHksXG4gICAgX19wbHVuZ2UsXG4gICAgX191bml0LFxuICAgIF9fcm90YXRlLFxuICAgIF9fc3VidHJhY3QsXG4gICAgX194LFxuICAgIF9feSxcbiAgICBfX3o7XG5cblxuLyoqXG4gKiBBZGQgdHdvIHZlY3RvcnMuXG4gKlxuICogQHBhcmFtIHYxIHtBcnJheTxOdW1iZXI+fVxuICogICAgICAgIHRoZSBmaXJzdCB2ZWN0b3IuXG4gKiBAcGFyYW0gdjIge0FycmF5PE51bWJlcj59XG4gKiAgICAgICAgdGhlIHNlY29uZCB2ZWN0b3IuXG4gKiBAcmV0dXJuIHtBcnJheTxOdW1iZXI+fVxuICogICAgICAgICByZXN1bHQgb2YgYWRkaXRpb24uXG4gKiBAdGhyb3dzIHtFcnJvcn0gd2hlbiB2ZWN0b3JzIGFyZSBkaWZmZXJlbnQgbGVuZ3Rocy5cbiAqL1xuX19hZGQgPSBmdW5jdGlvbiAodjEsIHYyKSB7XG4gIHZhciBpLFxuICAgICAgdjtcbiAgaWYgKHYxLmxlbmd0aCAhPT0gdjIubGVuZ3RoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCd2ZWN0b3JzIG11c3QgYmUgc2FtZSBsZW5ndGgnKTtcbiAgfVxuICB2ID0gW107XG4gIGZvciAoaSA9IDA7IGkgPCB2MS5sZW5ndGg7IGkrKykge1xuICAgIHYucHVzaCh2MVtpXSArIHYyW2ldKTtcbiAgfVxuICByZXR1cm4gdjtcbn07XG5cblxuLyoqXG4gKiBDb21wdXRlIHRoZSBhbmdsZSBiZXR3ZWVuIHR3byB2ZWN0b3JzLlxuICpcbiAqIEBwYXJhbSB2MSB7QXJyYXk8TnVtYmVyPn1cbiAqICAgICAgICB0aGUgZmlyc3QgdmVjdG9yLlxuICogQHBhcmFtIHYyIHtBcnJheTxOdW1iZXI+fVxuICogICAgICAgIHRoZSBzZWNvbmQgdmVjdG9yLlxuICogQHJldHVybiB7TnVtYmVyfVxuICogICAgICAgICBhbmdsZSBiZXR3ZWVuIHZlY3RvcnMgaW4gcmFkaWFucy5cbiAqL1xuX19hbmdsZSA9IGZ1bmN0aW9uICh2MSwgdjIpIHtcbiAgcmV0dXJuIE1hdGguYWNvcyhfX2RvdCh2MSwgdjIpIC8gKF9fbWFnbml0dWRlKHYxKSAqIF9fbWFnbml0dWRlKHYyKSkpO1xufTtcblxuLyoqXG4gKiBDb21wdXRlIHRoZSBhemltdXRoIG9mIGEgdmVjdG9yLlxuICpcbiAqIEBwYXJhbSB2MSB7QXJyYXk8TnVtYmVyPn1cbiAqICAgICAgICB0aGUgZmlyc3QgdmVjdG9yLlxuICogQHBhcmFtIHYyIHtBcnJheTxOdW1iZXI+fVxuICogICAgICAgIHRoZSBzZWNvbmQgdmVjdG9yLlxuICogQHJldHVybiB7TnVtYmVyfVxuICogICAgICAgICBhbmdsZSBiZXR3ZWVuIHZlY3RvcnMgaW4gcmFkaWFucy5cbiAqL1xuX19hemltdXRoID0gZnVuY3Rpb24gKHYxKSB7XG4gIGlmICh2MS5sZW5ndGggPCAyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdhemltdXRoIHJlcXVpcmVzIGF0IGxlYXN0IDIgZGltZW5zaW9ucycpO1xuICB9XG4gIGlmICh2MVswXSA9PT0gMCAmJiB2MVsxXSA9PT0gMCkge1xuICAgIC8vIGlmIHZlY3RvciBpcyB6ZXJvLCBvciB2ZXJ0aWNhbCwgYXppbXV0aCBpcyB6ZXJvLlxuICAgIHJldHVybiAwO1xuICB9XG4gIHJldHVybiAoTWF0aC5QSSAvIDIpIC0gTWF0aC5hdGFuMih2MVsxXSwgdjFbMF0pO1xufTtcblxuLyoqXG4gKiBDb21wdXRlIHZlY3RvciBjcm9zcyBwcm9kdWN0LlxuICpcbiAqIE5vdGU6IG9ubHkgY29tcHV0ZXMgY3Jvc3MgcHJvZHVjdCBpbiAzIGRpbWVuc2lvbnMuXG4gKlxuICogQHBhcmFtIHYxIHtBcnJheTxOdW1iZXI+fVxuICogICAgICAgIHRoZSBmaXJzdCB2ZWN0b3IuXG4gKiBAcGFyYW0gdjIge0FycmF5PE51bWJlcj59XG4gKiAgICAgICAgdGhlIHNlY29uZCB2ZWN0b3IuXG4gKiBAcmV0dXJuIHtBcnJheTxOdW1iZXI+fVxuICogICAgICAgICB0aGUgMyBkaW1lbnNpb25hbCBjcm9zcyBwcm9kdWN0LlxuICogICAgICAgICB0aGUgcmVzdWx0aW5nIHZlY3RvciBmb2xsb3dzIHRoZSByaWdodC1oYW5kIHJ1bGU6IGlmIHRoZSBmaW5nZXJzIG9uXG4gKiAgICAgICAgIHlvdXIgcmlnaHQgaGFuZCBwb2ludCB0byB2MSwgYW5kIHlvdSBjbG9zZSB5b3VyIGhhbmQgdG8gZ2V0IHRvIHYyLFxuICogICAgICAgICB0aGUgcmVzdWx0aW5nIHZlY3RvciBwb2ludHMgaW4gdGhlIGRpcmVjdGlvbiBvZiB5b3VyIHRodW1iLlxuICovXG5fX2Nyb3NzID0gZnVuY3Rpb24gKHYxLCB2Mikge1xuICBpZiAodjEubGVuZ3RoICE9PSB2Mi5sZW5ndGggfHwgdjEubGVuZ3RoIDwgMykge1xuICAgIHRocm93IG5ldyBFcnJvcignY3Jvc3MgcHJvZHVjdCByZXF1aXJlcyBhdCBsZWFzdCAzIGRpbWVuc2lvbnMnKTtcbiAgfVxuICByZXR1cm4gW1xuICAgIHYxWzFdICogdjJbMl0gLSB2MlsxXSAqIHYxWzJdLFxuICAgIHYxWzJdICogdjJbMF0gLSB2MlsyXSAqIHYxWzBdLFxuICAgIHYxWzBdICogdjJbMV0gLSB2MlswXSAqIHYxWzFdXG4gIF07XG59O1xuXG4vKipcbiAqIENvbXB1dGUgdmVjdG9yIGRvdCBwcm9kdWN0LlxuICpcbiAqIEBwYXJhbSB2MSB7QXJyYXk8TnVtYmVyfVxuICogICAgICAgIHRoZSBmaXJzdCB2ZWN0b3IuXG4gKiBAcGFyYW0gdjIge0FycmF5PE51bWJlcj59XG4gKiAgICAgICAgdGhlIHNlY29uZCB2ZWN0b3IuXG4gKiBAcmV0dXJuIHtOdW1iZXJ9XG4gKiAgICAgICAgIHRoZSBkb3QgcHJvZHVjdC5cbiAqL1xuX19kb3QgPSBmdW5jdGlvbiAodjEsIHYyKSB7XG4gIHZhciBpLFxuICAgICAgc3VtO1xuICBzdW0gPSAwO1xuICBmb3IgKGkgPSAwOyBpIDwgdjEubGVuZ3RoOyBpKyspIHtcbiAgICBzdW0gKz0gdjFbaV0gKiB2MltpXTtcbiAgfVxuICByZXR1cm4gc3VtO1xufTtcblxuLyoqXG4gKiBDaGVjayBpZiB0d28gdmVjdG9ycyBhcmUgZXF1YWwuXG4gKlxuICogQHBhcmFtIHYxIHtBcnJheTxOdW1iZXI+fVxuICogICAgICAgIHRoZSBmaXJzdCB2ZWN0b3IuXG4gKiBAcGFyYW0gdjIge0FycmF5PE51bWJlcj59XG4gKiAgICAgICAgdGhlIHNlY29uZCB2ZWN0b3IuXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICogICAgICAgICB0cnVlIGlmIHZlY3RvcnMgYXJlIHNhbWUgbGVuZ3RoIGFuZCBhbGwgZWxlbWVudHMgYXJlIGVxdWFsLlxuICovXG5fX2VxdWFscyA9IGZ1bmN0aW9uICh2MSwgdjIpIHtcbiAgdmFyIGk7XG4gIGlmICh2MS5sZW5ndGggIT09IHYyLmxlbmd0aCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBmb3IgKGkgPSAwOyBpIDwgdjEubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAodjFbaV0gIT09IHYyW2ldKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIHJldHVybiB0cnVlO1xufTtcblxuLyoqXG4gKiBDb21wdXRlIGxlbmd0aCBvZiB2ZWN0b3IuXG4gKlxuICogQHBhcmFtIHYxIHtBcnJheTxOdW1iZXI+fVxuICogICAgICAgIHZlY3Rvci5cbiAqIEByZXR1cm4ge051bWJlcn1cbiAqICAgICAgICAgbWFnbml0dWRlIG9mIHZlY3Rvci5cbiAqL1xuX19tYWduaXR1ZGUgPSBmdW5jdGlvbiAodjEpIHtcbiAgdmFyIGksXG4gICAgICBzdW07XG4gIHN1bSA9IDA7XG4gIGZvciAoaSA9IDA7IGkgPCB2MS5sZW5ndGg7IGkrKykge1xuICAgIHN1bSArPSB2MVtpXSAqIHYxW2ldO1xuICB9XG4gIHJldHVybiBNYXRoLnNxcnQoc3VtKTtcbn07XG5cbi8qKlxuICogTXVsdGlwbHkgdmVjdG9yIGJ5IGEgY29uc3RhbnQuXG4gKlxuICogQHBhcmFtIHYxIHtBcnJheTxOdW1iZXI+fVxuICogICAgICAgIHZlY3RvciB0byBtdWx0aXBseS5cbiAqIEBwYXJhbSBuIHtOdW1iZXJ9XG4gKiAgICAgICAgbnVtYmVyIHRvIG11bHRpcGx5IGJ5LlxuICogQHJldHVybiB7QXJyYXk8TnVtYmVyfVxuICogICAgICAgICByZXN1bHQgb2YgbXVsdGlwbGljYXRpb24uXG4gKi9cbl9fbXVsdGlwbHkgPSBmdW5jdGlvbiAodjEsIG4pIHtcbiAgdmFyIGksXG4gICAgICB2O1xuXG4gIHYgPSBbXTtcbiAgZm9yIChpID0gMDsgaSA8IHYxLmxlbmd0aDsgaSsrKSB7XG4gICAgdi5wdXNoKHYxW2ldICogbik7XG4gIH1cbiAgcmV0dXJuIHY7XG59O1xuXG4vKipcbiAqIENvbXB1dGUgYW5nbGUgZnJvbSBwbGFuZSB6PTAgdG8gdmVjdG9yLlxuICpcbiAqIEBwYXJhbSB2IHtBcnJheTxOdW1iZXI+fVxuICogICAgICAgIHRoZSB2ZWN0b3IuXG4gKiBAcmV0dXJuIHtOdW1iZXJ9XG4gKiAgICAgICAgIGFuZ2xlIGZyb20gcGxhbmUgej0wIHRvIHZlY3Rvci5cbiAqICAgICAgICAgYW5nbGUgaXMgcG9zaXRpdmUgd2hlbiB6ID4gMCwgbmVnYXRpdmUgd2hlbiB6IDwgMC5cbiAqL1xuX19wbHVuZ2UgPSBmdW5jdGlvbiAodikge1xuICBpZiAodi5sZW5ndGggPCAzKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdfX2F6aW11dGg6IHZlY3RvciBtdXN0IGhhdmUgYXQgbGVhc3QgMyBkaW1lbnNpb25zJyk7XG4gIH1cbiAgcmV0dXJuIE1hdGguYXNpbih2WzJdIC8gX19tYWduaXR1ZGUodikpO1xufTtcblxuLyoqXG4gKiBSb3RhdGUgYSB2ZWN0b3IgYXJvdW5kIGFuIGF4aXMuXG4gKlxuICogRnJvbSBcIjYuMiBUaGUgbm9ybWFsaXplZCBtYXRyaXggZm9yIHJvdGF0aW9uIGFib3V0IGFuIGFyYml0cmFyeSBsaW5lXCIsXG4gKiAgICAgIGh0dHA6Ly9pbnNpZGUubWluZXMuZWR1L35nbXVycmF5L0FyYml0cmFyeUF4aXNSb3RhdGlvbi9cbiAqXG4gKiBAcGFyYW0gdjEge0FycmF5PE51bWJlcj59XG4gKiAgICAgICAgdGhlIFwicG9pbnRcIiB0byByb3RhdGUuXG4gKiBAcGFyYW0gYXhpcyB7QXJyYXk8TnVtYmVyPn1cbiAqICAgICAgICBkaXJlY3Rpb24gdmVjdG9yIG9mIHJvdGF0aW9uIGF4aXMuXG4gKiBAcGFyYW0gdGhldGEge051bWJlcn1cbiAqICAgICAgICBhbmdsZSBvZiByb3RhdGlvbiBpbiByYWRpYW5zLlxuICogQHBhcmFtIG9yaWdpbiB7QXJyYXk8TnVtYmVyPn1cbiAqICAgICAgICBkZWZhdWx0IFswLCAwLCAwXS5cbiAqICAgICAgICBvcmlnaW4gb2YgYXhpcyBvZiByb3RhdGlvbi5cbiAqL1xuX19yb3RhdGUgPSBmdW5jdGlvbiAodjEsIGF4aXMsIHRoZXRhLCBvcmlnaW4pIHtcbiAgdmFyIGEsXG4gICAgICBhdSxcbiAgICAgIGF2LFxuICAgICAgYXcsXG4gICAgICBiLFxuICAgICAgYnUsXG4gICAgICBidixcbiAgICAgIGJ3LFxuICAgICAgYyxcbiAgICAgIGN1LFxuICAgICAgY3YsXG4gICAgICBjdyxcbiAgICAgIGNvc1QsXG4gICAgICBzaW5ULFxuICAgICAgdSxcbiAgICAgIHV1LFxuICAgICAgdXgsXG4gICAgICB1eSxcbiAgICAgIHV6LFxuICAgICAgdixcbiAgICAgIHZ2LFxuICAgICAgdngsXG4gICAgICB2eSxcbiAgICAgIHZ6LFxuICAgICAgdyxcbiAgICAgIHd3LFxuICAgICAgd3gsXG4gICAgICB3eSxcbiAgICAgIHd6LFxuICAgICAgeCxcbiAgICAgIHksXG4gICAgICB6O1xuXG4gIG9yaWdpbiA9IG9yaWdpbiB8fCBbMCwgMCwgMF07XG4gIGEgPSBvcmlnaW5bMF07XG4gIGIgPSBvcmlnaW5bMV07XG4gIGMgPSBvcmlnaW5bMl07XG4gIHUgPSBheGlzWzBdO1xuICB2ID0gYXhpc1sxXTtcbiAgdyA9IGF4aXNbMl07XG4gIHggPSB2MVswXTtcbiAgeSA9IHYxWzFdO1xuICB6ID0gdjFbMl07XG5cbiAgY29zVCA9IE1hdGguY29zKHRoZXRhKTtcbiAgc2luVCA9IE1hdGguc2luKHRoZXRhKTtcbiAgYXUgPSBhICogdTtcbiAgYXYgPSBhICogdjtcbiAgYXcgPSBhICogdztcbiAgYnUgPSBiICogdTtcbiAgYnYgPSBiICogdjtcbiAgYncgPSBiICogdztcbiAgY3UgPSBjICogdTtcbiAgY3YgPSBjICogdjtcbiAgY3cgPSBjICogdztcbiAgdXUgPSB1ICogdTtcbiAgdXggPSB1ICogeDtcbiAgdXkgPSB1ICogeTtcbiAgdXogPSB1ICogejtcbiAgdnYgPSB2ICogdjtcbiAgdnggPSB2ICogeDtcbiAgdnkgPSB2ICogeTtcbiAgdnogPSB2ICogejtcbiAgd3cgPSB3ICogdztcbiAgd3ggPSB3ICogeDtcbiAgd3kgPSB3ICogeTtcbiAgd3ogPSB3ICogejtcblxuICByZXR1cm4gW1xuICAgIChhICogKHZ2ICsgd3cpIC0gdSAqIChidiArIGN3IC0gdXggLSB2eSAtIHd6KSkgKiAoMSAtIGNvc1QpICtcbiAgICAgICAgeCAqIGNvc1QgKyAoLWN2ICsgYncgLSB3eSArIHZ6KSAqIHNpblQsXG4gICAgKGIgKiAodXUgKyB3dykgLSB2ICogKGF1ICsgY3cgLSB1eCAtIHZ5IC0gd3opKSAqICgxIC0gY29zVCkgK1xuICAgICAgICB5ICogY29zVCArIChjdSAtIGF3ICsgd3ggLSB1eikgKiBzaW5ULFxuICAgIChjICogKHV1ICsgdnYpIC0gdyAqIChhdSArIGJ2IC0gdXggLSB2eSAtIHd6KSkgKiAoMSAtIGNvc1QpICtcbiAgICAgICAgeiAqIGNvc1QgKyAoLWJ1ICsgYXYgLSB2eCArIHV5KSAqIHNpblRcbiAgXTtcbn07XG5cbi8qKlxuICogU3VidHJhY3QgdHdvIHZlY3RvcnMuXG4gKlxuICogQHBhcmFtIHYxIHtBcnJheTxOdW1iZXI+fVxuICogICAgICAgIHRoZSBmaXJzdCB2ZWN0b3IuXG4gKiBAcGFyYW0gdjIge0FycmF5PE51bWJlcj59XG4gKiAgICAgICAgdGhlIHZlY3RvciB0byBzdWJ0cmFjdC5cbiAqIEByZXR1cm4ge0FycmF5PE51bWJlcj59XG4gKiAgICAgICAgIHJlc3VsdCBvZiBzdWJ0cmFjdGlvbi5cbiAqIEB0aHJvd3Mge0Vycm9yfSB3aGVuIHZlY3RvcnMgYXJlIGRpZmZlcmVudCBsZW5ndGhzLlxuICovXG5fX3N1YnRyYWN0ID0gZnVuY3Rpb24gKHYxLCB2Mikge1xuICB2YXIgaSxcbiAgICAgIHY7XG5cbiAgaWYgKHYxLmxlbmd0aCAhPT0gdjIubGVuZ3RoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdfX3N1YnRyYWN0OiB2ZWN0b3JzIG11c3QgYmUgc2FtZSBsZW5ndGgnKTtcbiAgfVxuICB2ID0gW107XG4gIGZvciAoaSA9IDA7IGkgPCB2MS5sZW5ndGg7IGkrKykge1xuICAgIHYucHVzaCh2MVtpXSAtIHYyW2ldKTtcbiAgfVxuICByZXR1cm4gdjtcbn07XG5cbi8qKlxuICogQ29udmVydCB2ZWN0b3IgdG8gbGVuZ3RoIDEuXG4gKlxuICogU2FtZSBhcyBfX211bHRpcGx5KHYxLCAxIC8gX19tYWduaXR1ZGUodjEpKVxuICpcbiAqIEBwYXJhbSB2MSB7QXJyYXk8TnVtYmVyPn1cbiAqICAgICAgICB0aGUgdmVjdG9yLlxuICogQHJldHVybiB7QXJyYXk8TnVtYmVyPn1cbiAqICAgICAgICAgdmVjdG9yIGNvbnZlcnRlZCB0byBsZW5ndGggMS5cbiAqIEB0aHJvd3Mge0Vycm9yfSBpZiB2ZWN0b3IgbWFnbml0dWRlIGlzIDAuXG4gKi9cbl9fdW5pdCA9IGZ1bmN0aW9uICh2MSkge1xuICB2YXIgbWFnID0gX19tYWduaXR1ZGUodjEpO1xuICBpZiAobWFnID09PSAwKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdfX3VuaXQ6IGNhbm5vdCBjb252ZXJ0IHplcm8gdmVjdG9yIHRvIHVuaXQgdmVjdG9yJyk7XG4gIH1cbiAgcmV0dXJuIF9fbXVsdGlwbHkodjEsIDEgLyBtYWcpO1xufTtcblxuLyoqXG4gKiBHZXQsIGFuZCBvcHRpb25hbGx5IHNldCwgdGhlIHggY29tcG9uZW50IG9mIGEgdmVjdG9yLlxuICpcbiAqIEBwYXJhbSB2IHtBcnJheTxOdW1iZXI+fVxuICogICAgICAgIHRoZSB2ZWN0b3IuXG4gKiBAcGFyYW0gdmFsdWUge051bWJlcn1cbiAqICAgICAgICBkZWZhdWx0IHVuZGVmaW5lZC5cbiAqICAgICAgICB3aGVuIGRlZmluZWQsIHNldCB4IGNvbXBvbmVudC5cbiAqIEByZXR1cm4ge051bWJlcn1cbiAqICAgICAgICAgdGhlIHggY29tcG9uZW50LlxuICovXG5fX3ggPSBmdW5jdGlvbiAodiwgdmFsdWUpIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicpIHtcbiAgICB2WzBdID0gdmFsdWU7XG4gIH1cbiAgcmV0dXJuIHZbMF07XG59O1xuXG4vKipcbiAqIEdldCwgYW5kIG9wdGlvbmFsbHkgc2V0LCB0aGUgeSBjb21wb25lbnQgb2YgYSB2ZWN0b3IuXG4gKlxuICogQHBhcmFtIHYge0FycmF5PE51bWJlcj59XG4gKiAgICAgICAgdGhlIHZlY3Rvci5cbiAqIEBwYXJhbSB2YWx1ZSB7TnVtYmVyfVxuICogICAgICAgIGRlZmF1bHQgdW5kZWZpbmVkLlxuICogICAgICAgIHdoZW4gZGVmaW5lZCwgc2V0IHkgY29tcG9uZW50LlxuICogQHJldHVybiB7TnVtYmVyfVxuICogICAgICAgICB0aGUgeSBjb21wb25lbnQuXG4gKi9cbl9feSA9IGZ1bmN0aW9uICh2LCB2YWx1ZSkge1xuICBpZiAodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJykge1xuICAgIHZbMV0gPSB2YWx1ZTtcbiAgfVxuICByZXR1cm4gdlsxXTtcbn07XG5cbi8qKlxuICogR2V0LCBhbmQgb3B0aW9uYWxseSBzZXQsIHRoZSB6IGNvbXBvbmVudCBvZiBhIHZlY3Rvci5cbiAqXG4gKiBAcGFyYW0gdiB7QXJyYXk8TnVtYmVyPn1cbiAqICAgICAgICB0aGUgdmVjdG9yLlxuICogQHBhcmFtIHZhbHVlIHtOdW1iZXJ9XG4gKiAgICAgICAgZGVmYXVsdCB1bmRlZmluZWQuXG4gKiAgICAgICAgd2hlbiBkZWZpbmVkLCBzZXQgeiBjb21wb25lbnQuXG4gKiBAcmV0dXJuIHtOdW1iZXJ9XG4gKiAgICAgICAgIHRoZSB6IGNvbXBvbmVudC5cbiAqL1xuX196ID0gZnVuY3Rpb24gKHYsIHZhbHVlKSB7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInKSB7XG4gICAgdlsyXSA9IHZhbHVlO1xuICB9XG4gIHJldHVybiB2WzJdO1xufTtcblxuXG4vKipcbiAqIEEgdmVjdG9yIG9iamVjdCB0aGF0IHdyYXBzIGFuIGFycmF5LlxuICpcbiAqIFRoaXMgaXMgYSBjb252ZW5pZW5jZSBvYmplY3QgdG8gY2FsbCB0aGUgc3RhdGljIG1ldGhvZHMgb24gdGhlIHdyYXBwZWQgYXJyYXkuXG4gKiBPbmx5IHRoZSBtZXRob2RzIHgoKSwgeSgpLCBhbmQgeigpIG1vZGlmeSBkYXRhOyBvdGhlciBtZXRob2RzIHJldHVybiBuZXdcbiAqIFZlY3RvciBvYmplY3RzIHdpdGhvdXQgbW9kaWZ5aW5nIHRoZSBleGlzdGluZyBvYmplY3QuXG4gKlxuICogQHBhcmFtIGRhdGEge0FycmF5PE51bWJlcj59XG4gKiAgICAgICAgYXJyYXkgdG8gd3JhcC5cbiAqL1xudmFyIFZlY3RvciA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gIHZhciBfdGhpcyxcbiAgICAgIF9pbml0aWFsaXplLFxuICAgICAgLy8gdmFyaWFibGVzXG4gICAgICBfZGF0YTtcblxuICBpZiAoZGF0YSAmJiB0eXBlb2YgZGF0YS5kYXRhID09PSAnZnVuY3Rpb24nKSB7XG4gICAgLy8gY29weSBleGlzdGluZyBvYmplY3RcbiAgICBkYXRhID0gZGF0YS5kYXRhKCkuc2xpY2UoMCk7XG4gIH1cblxuXG4gIF90aGlzID0ge1xuICAgIF9pc2FfdmVjdG9yOiB0cnVlXG4gIH07XG5cbiAgX2luaXRpYWxpemUgPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgIF9kYXRhID0gZGF0YTtcbiAgfTtcblxuICAvKipcbiAgICogQWRkIHR3byB2ZWN0b3JzLlxuICAgKlxuICAgKiBAcGFyYW0gdGhhdCB7VmVjdG9yfEFycmF5PE51bWJlcj59XG4gICAqICAgICAgICB2ZWN0b3IgdG8gYWRkLlxuICAgKiBAcmV0dXJuIHtWZWN0b3J9XG4gICAqICAgICAgICAgcmVzdWx0IG9mIGFkZGl0aW9uLlxuICAgKi9cbiAgX3RoaXMuYWRkID0gZnVuY3Rpb24gKHRoYXQpIHtcbiAgICB0aGF0ID0gKHRoYXQuX2lzYV92ZWN0b3IgPyB0aGF0LmRhdGEoKSA6IHRoYXQpO1xuICAgIHJldHVybiBWZWN0b3IoX19hZGQoX2RhdGEsIHRoYXQpKTtcbiAgfTtcblxuICAvKipcbiAgICogQ29tcHV0ZSBhbmdsZSBiZXR3ZWVuIHZlY3RvcnMuXG4gICAqXG4gICAqIEBwYXJhbSB0aGF0IHtWZWN0b3J8QXJyYXk8TnVtYmVyPn1cbiAgICogICAgICAgIHZlY3RvciB0byBjb21wdXRlIGFuZ2xlIGJldHdlZW4uXG4gICAqIEByZXR1cm4ge051bWJlcn0gYW5nbGUgYmV0d2VlbiB2ZWN0b3JzIGluIHJhZGlhbnMuXG4gICAqL1xuICBfdGhpcy5hbmdsZSA9IGZ1bmN0aW9uICh0aGF0KSB7XG4gICAgdGhhdCA9ICh0aGF0Ll9pc2FfdmVjdG9yID8gdGhhdC5kYXRhKCkgOiB0aGF0KTtcbiAgICByZXR1cm4gX19hbmdsZShfZGF0YSwgdGhhdCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIENvbXB1dGUgYXppbXV0aCBvZiB0aGlzIHZlY3Rvci5cbiAgICpcbiAgICogQHJldHVybiB7TnVtYmVyfSBhemltdXRoIG9mIHRoaXMgdmVjdG9yIGluIHJhZGlhbnMuXG4gICAqL1xuICBfdGhpcy5hemltdXRoID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBfX2F6aW11dGgoX2RhdGEpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBDb21wdXRlIHRoZSBjcm9zcyBwcm9kdWN0IGJldHdlZW4gdmVjdG9ycy5cbiAgICpcbiAgICogQHBhcmFtIHRoYXQge1ZlY3RvcnxBcnJheTxOdW1iZXI+fVxuICAgKiAgICAgICAgdGhlIHZlY3RvciB0byBjcm9zcy5cbiAgICogQHJldHVybiB7VmVjdG9yfSByZXN1bHQgb2YgdGhlIGNyb3NzIHByb2R1Y3QuXG4gICAqL1xuICBfdGhpcy5jcm9zcyA9IGZ1bmN0aW9uICh0aGF0KSB7XG4gICAgdGhhdCA9ICh0aGF0Ll9pc2FfdmVjdG9yID8gdGhhdC5kYXRhKCkgOiB0aGF0KTtcbiAgICByZXR1cm4gVmVjdG9yKF9fY3Jvc3MoX2RhdGEsIHRoYXQpKTtcbiAgfTtcblxuICAvKipcbiAgICogQWNjZXNzIHRoZSB3cmFwcGVkIGFycmF5LlxuICAgKlxuICAgKiBAcmV0dXJuIHtBcnJheTxOdW1iZXI+fVxuICAgKiAgICAgICAgIHRoZSB3cmFwcGVkIGFycmF5LlxuICAgKi9cbiAgX3RoaXMuZGF0YSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gX2RhdGE7XG4gIH07XG5cbiAgLyoqXG4gICAqIENvbXB1dGUgZG90IHByb2R1Y3QgYmV0d2VlbiB2ZWN0b3JzLlxuICAgKlxuICAgKiBAcGFyYW0gdGhhdCB7VmVjdG9yfEFycmF5PE51bWJlcj59XG4gICAqICAgICAgICB2ZWN0b3IgdG8gZG90LlxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9IHJlc3VsdCBvZiBkb3QgcHJvZHVjdC5cbiAgICovXG4gIF90aGlzLmRvdCA9IGZ1bmN0aW9uICh0aGF0KSB7XG4gICAgdGhhdCA9ICh0aGF0Ll9pc2FfdmVjdG9yID8gdGhhdC5kYXRhKCkgOiB0aGF0KTtcbiAgICByZXR1cm4gX19kb3QoX2RhdGEsIHRoYXQpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBDaGVjayBpZiB0d28gdmVjdG9ycyBhcmUgZXF1YWwuXG4gICAqXG4gICAqIEBwYXJhbSB0aGF0IHtWZWN0b3J8QXJyYXk8TnVtYmVyPn1cbiAgICogICAgICAgIHZlY3RvciB0byBjb21wYXJlLlxuICAgKiBAcmV0dXJuIHtCb29sZWFufSB0cnVlIGlmIGVxdWFsLCBmYWxzZSBvdGhlcndpc2UuXG4gICAqL1xuICBfdGhpcy5lcXVhbHMgPSBmdW5jdGlvbiAodGhhdCkge1xuICAgIHRoYXQgPSAodGhhdC5faXNhX3ZlY3RvciA/IHRoYXQuZGF0YSgpIDogdGhhdCk7XG4gICAgcmV0dXJuIF9fZXF1YWxzKF9kYXRhLCB0aGF0KTtcbiAgfTtcblxuICAvKipcbiAgICogQ29tcHV0ZSBsZW5ndGggb2YgdGhpcyB2ZWN0b3IuXG4gICAqXG4gICAqIEByZXR1cm4ge051bWJlcn0gbGVuZ3RoIG9mIHZlY3Rvci5cbiAgICogICAgICAgICBTcXVhcmUgcm9vdCBvZiB0aGUgc3VtIG9mIHNxdWFyZXMgb2YgYWxsIGNvbXBvbmVudHMuXG4gICAqL1xuICBfdGhpcy5tYWduaXR1ZGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIF9fbWFnbml0dWRlKF9kYXRhKTtcbiAgfTtcblxuICAvKipcbiAgICogTXVsdGlwbHkgdGhpcyB2ZWN0b3IgYnkgYSBudW1iZXIuXG4gICAqXG4gICAqIEBwYXJhbSBuIHtOdW1iZXJ9XG4gICAqICAgICAgICBudW1iZXIgdG8gbXVsdGlwbHkuXG4gICAqIEByZXR1cm4ge1ZlY3Rvcn0gcmVzdWx0IG9mIG11bHRpcGxpY2F0aW9uLlxuICAgKi9cbiAgX3RoaXMubXVsdGlwbHkgPSBmdW5jdGlvbiAobikge1xuICAgIHJldHVybiBWZWN0b3IoX19tdWx0aXBseShfZGF0YSwgbikpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBTYW1lIGFzIG11bHRpcGx5KC0xKS5cbiAgICovXG4gIF90aGlzLm5lZ2F0aXZlID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBfdGhpcy5tdWx0aXBseSgtMSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIENvbXB1dGUgcGx1bmdlIG9mIHRoaXMgdmVjdG9yLlxuICAgKlxuICAgKiBQbHVuZ2UgaXMgdGhlIGFuZ2xlIGJldHdlZW4gdGhpcyB2ZWN0b3IgYW5kIHRoZSBwbGFuZSB6PTAuXG4gICAqXG4gICAqIEByZXR1cm4ge051bWJlcn0gcGx1bmdlIGluIHJhZGlhbnMuXG4gICAqICAgICAgICAgcG9zaXRpdmUgd2hlbiB6PjAsIG5lZ2F0aXZlIHdoZW4gejwwLlxuICAgKi9cbiAgX3RoaXMucGx1bmdlID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBfX3BsdW5nZShfZGF0YSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFJvdGF0ZSB0aGlzIHZlY3RvciBhcm91bmQgYW4gYXJiaXRyYXJ5IGF4aXMuXG4gICAqXG4gICAqIEBwYXJhbSBheGlzIHtWZWN0b3J8QXJyYXk8TnVtYmVyPn1cbiAgICogICAgICAgIGRpcmVjdGlvbiBvZiBheGlzIG9mIHJvdGF0aW9uLlxuICAgKiBAcGFyYW0gdGhldGEge051bWJlcn1cbiAgICogICAgICAgIGFuZ2xlIG9mIHJvdGF0aW9uIGluIHJhZGlhbnMuXG4gICAqIEBwYXJhbSBvcmlnaW4ge1ZlY3RvcnxBcnJheTxOdW1iZXI+fVxuICAgKiAgICAgICAgb3JpZ2luIG9mIGF4aXMgb2Ygcm90YXRpb24uXG4gICAqIEByZXR1cm4ge1ZlY3Rvcn0gcmVzdWx0IG9mIHJvdGF0aW9uLlxuICAgKi9cbiAgX3RoaXMucm90YXRlID0gZnVuY3Rpb24gKGF4aXMsIHRoZXRhLCBvcmlnaW4pIHtcbiAgICBheGlzID0gKGF4aXMuX2lzYV92ZWN0b3IgPyBheGlzLmRhdGEoKSA6IGF4aXMpO1xuICAgIG9yaWdpbiA9IChvcmlnaW4gJiYgb3JpZ2luLl9pc2FfdmVjdG9yID8gb3JpZ2luLmRhdGEoKSA6IG9yaWdpbik7XG4gICAgcmV0dXJuIFZlY3RvcihfX3JvdGF0ZShfZGF0YSwgYXhpcywgdGhldGEsIG9yaWdpbikpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBTdWJ0cmFjdCBhbm90aGVyIHZlY3Rvci5cbiAgICpcbiAgICogQHBhcmFtIHRoYXQge1ZlY3RvcnxBcnJheTxOdW1iZXI+fVxuICAgKiAgICAgICAgdmVjdG9yIHRvIHN1YnRyYWN0LlxuICAgKiBAcmV0dXJuIHtWZWN0b3J9IHJlc3VsdCBvZiBzdWJ0cmFjdGlvbi5cbiAgICovXG4gIF90aGlzLnN1YnRyYWN0ID0gZnVuY3Rpb24gKHRoYXQpIHtcbiAgICB0aGF0ID0gKHRoYXQuX2lzYV92ZWN0b3IgPyB0aGF0LmRhdGEoKSA6IHRoYXQpO1xuICAgIHJldHVybiBWZWN0b3IoX19zdWJ0cmFjdChfZGF0YSwgdGhhdCkpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBDb252ZXJ0IHZlY3RvciB0byBzdHJpbmcuXG4gICAqXG4gICAqIEByZXR1cm4ge1N0cmluZ30gd3JhcHBlZCBhcnJheSBjb252ZXJ0ZWQgdG8gc3RyaW5nLlxuICAgKi9cbiAgX3RoaXMudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuICcnICsgX2RhdGE7XG4gIH07XG5cbiAgLyoqXG4gICAqIENvbnZlcnQgdGhpcyB2ZWN0b3IgdG8gbGVuZ3RoIDEuXG4gICAqXG4gICAqIEByZXR1cm4ge1ZlY3Rvcn0gdmVjdG9yIC8gfHZlY3RvcnwuXG4gICAqL1xuICBfdGhpcy51bml0ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBWZWN0b3IoX191bml0KF9kYXRhKSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEdldCBvciBzZXQgeCBjb21wb25lbnQuXG4gICAqXG4gICAqIEBwYXJhbSB2YWx1ZSB7TnVtYmVyfVxuICAgKiAgICAgICAgd2hlbiBkZWZpbmVkLCBzZXQgeCBjb21wb25lbnQgdG8gdmFsdWUuXG4gICAqIEByZXR1cm4ge051bWJlcn0geCBjb21wb25lbnQgdmFsdWUuXG4gICAqL1xuICBfdGhpcy54ID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgcmV0dXJuIF9feChfZGF0YSwgdmFsdWUpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBHZXQgb3Igc2V0IHkgY29tcG9uZW50LlxuICAgKlxuICAgKiBAcGFyYW0gdmFsdWUge051bWJlcn1cbiAgICogICAgICAgIHdoZW4gZGVmaW5lZCwgc2V0IHkgY29tcG9uZW50IHRvIHZhbHVlLlxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9IHkgY29tcG9uZW50IHZhbHVlLlxuICAgKi9cbiAgX3RoaXMueSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHJldHVybiBfX3koX2RhdGEsIHZhbHVlKTtcbiAgfTtcblxuICAvKipcbiAgICogR2V0IG9yIHNldCB6IGNvbXBvbmVudC5cbiAgICpcbiAgICogQHBhcmFtIHZhbHVlIHtOdW1iZXJ9XG4gICAqICAgICAgICB3aGVuIGRlZmluZWQsIHNldCB6IGNvbXBvbmVudCB0byB2YWx1ZS5cbiAgICogQHJldHVybiB7TnVtYmVyfSB6IGNvbXBvbmVudCB2YWx1ZS5cbiAgICovXG4gIF90aGlzLnogPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICByZXR1cm4gX196KF9kYXRhLCB2YWx1ZSk7XG4gIH07XG5cblxuICBfaW5pdGlhbGl6ZShkYXRhKTtcbiAgZGF0YSA9IG51bGw7XG4gIHJldHVybiBfdGhpcztcbn07XG5cblxuLy8gZXhwb3NlIHN0YXRpYyBtZXRob2RzXG5WZWN0b3IuYWRkID0gX19hZGQ7XG5WZWN0b3IuYW5nbGUgPSBfX2FuZ2xlO1xuVmVjdG9yLmF6aW11dGggPSBfX2F6aW11dGg7XG5WZWN0b3IuY3Jvc3MgPSBfX2Nyb3NzO1xuVmVjdG9yLmRvdCA9IF9fZG90O1xuVmVjdG9yLm1hZ25pdHVkZSA9IF9fbWFnbml0dWRlO1xuVmVjdG9yLm11bHRpcGx5ID0gX19tdWx0aXBseTtcblZlY3Rvci5wbHVuZ2UgPSBfX3BsdW5nZTtcblZlY3Rvci5yb3RhdGUgPSBfX3JvdGF0ZTtcblZlY3Rvci5zdWJ0cmFjdCA9IF9fc3VidHJhY3Q7XG5WZWN0b3IudW5pdCA9IF9fdW5pdDtcblZlY3Rvci54ID0gX194O1xuVmVjdG9yLnkgPSBfX3k7XG5WZWN0b3IueiA9IF9fejtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IFZlY3RvcjtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIFV0aWwgPSByZXF1aXJlKCcuLi91dGlsL1V0aWwnKSxcbiAgICBWaWV3ID0gcmVxdWlyZSgnLi9WaWV3Jyk7XG5cblxudmFyIF9ERUZBVUxUUyA9IHtcbiAgLy8gY2xhc3NuYW1lIGFkZGVkIHRvIHNlbGVjdCBib3hcbiAgY2xhc3NOYW1lOiAnY29sbGVjdGlvbi1zZWxlY3Rib3gnLFxuICBpbmNsdWRlQmxhbmtPcHRpb246IGZhbHNlLFxuICBibGFua09wdGlvbjoge1xuICAgIHRleHQ6ICdQbGVhc2Ugc2VsZWN0JmhlbGxpcDsnLFxuICAgIHZhbHVlOiAnLTEnXG4gIH0sXG5cbiAgLy8gY2FsbGJhY2sgdG8gZm9ybWF0IGVhY2ggY29sbGVjdGlvbiBpdGVtXG4gIGZvcm1hdDogZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICByZXR1cm4gaXRlbS5pZDtcbiAgfSxcblxuICAvLyB3aGV0aGVyIHRvIHJlbmRlciBkdXJpbmcgaW5pdGlhbGl6ZVxuICByZW5kZXJOb3c6IHRydWVcbn07XG5cbi8qKlxuICogQ3JlYXRlIGEgbmV3IENvbGxlY3Rpb25TZWxlY3RCb3ggdG8gc2VsZWN0IGEgY29sbGVjdGlvbiBpdGVtLlxuICpcbiAqIEBwYXJhbSBwYXJhbXMge09iamVjdH1cbiAqIEBwYXJhbSBwYXJhbXMuZm9ybWF0IHtGdW5jdGlvbihPYmplY3QpfVxuICogICAgICAgIGNhbGxiYWNrIGZ1bmN0aW9uIHRvIGZvcm1hdCBzZWxlY3QgYm94IGl0ZW1zLlxuICogQHBhcmFtIHBhcmFtcy5jbGFzc05hbWUge1N0cmluZ31cbiAqICAgICAgICBEZWZhdWx0ICdjb2xsZWN0aW9uLXNlbGVjdGJveCcuXG4gKiAgICAgICAgQ2xhc3MgbmFtZSBmb3Igc2VsZWN0IGJveC5cbiAqIEBwYXJhbSBwYXJhbXMuY29sbGVjdGlvbiB7Q29sbGVjdGlvbn1cbiAqICAgICAgICB0aGUgY29sbGVjdGlvbiB0byBkaXNwbGF5LlxuICogICAgICAgIE5PVEU6IHRoZSBjb2xsZWN0aW9uIHNob3VsZCBoYXZlIGFuIGV4aXN0aW5nIHNlbGVjdGlvbjtcbiAqICAgICAgICBvdGhlcndpc2UsIHRoZSBmaXJzdCBpdGVtIGluIHRoZSBzZWxlY3QgYm94IHdpbGwgYmUgc2VsZWN0ZWRcbiAqICAgICAgICBpbiB0aGUgVUkgYW5kIG5vdCBpbiB0aGUgY29sbGVjdGlvbi5cbiAqIEBzZWUgbXZjL1ZpZXdcbiAqL1xudmFyIENvbGxlY3Rpb25TZWxlY3RCb3ggPSBmdW5jdGlvbiAocGFyYW1zKSB7XG4gIHZhciBfdGhpcyxcbiAgICAgIF9pbml0aWFsaXplLFxuXG4gICAgICBfYmxhbmtPcHRpb24sXG4gICAgICBfY29sbGVjdGlvbixcbiAgICAgIF9mb3JtYXQsXG4gICAgICBfZ2V0VmFsaWRPcHRpb25zLFxuICAgICAgX2luY2x1ZGVCbGFua09wdGlvbixcbiAgICAgIF9zZWxlY3RCb3gsXG5cbiAgICAgIF9jcmVhdGVCbGFua09wdGlvbixcbiAgICAgIF9kZWZhdWx0R2V0VmFsaWRPcHRpb25zLFxuICAgICAgX29uQ2hhbmdlLFxuICAgICAgX29uU2VsZWN0O1xuXG5cbiAgcGFyYW1zID0gVXRpbC5leHRlbmQoe30sIF9ERUZBVUxUUywgcGFyYW1zKTtcbiAgX3RoaXMgPSBWaWV3KHBhcmFtcyk7XG5cbiAgLyoqXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKlxuICAgKi9cbiAgX2luaXRpYWxpemUgPSBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgdmFyIGVsO1xuXG4gICAgZWwgPSBfdGhpcy5lbDtcblxuICAgIF9ibGFua09wdGlvbiA9IHBhcmFtcy5ibGFua09wdGlvbjtcbiAgICBfY29sbGVjdGlvbiA9IHBhcmFtcy5jb2xsZWN0aW9uO1xuICAgIF9mb3JtYXQgPSBwYXJhbXMuZm9ybWF0O1xuICAgIF9nZXRWYWxpZE9wdGlvbnMgPSBwYXJhbXMuZ2V0VmFsaWRPcHRpb25zIHx8IF9kZWZhdWx0R2V0VmFsaWRPcHRpb25zO1xuICAgIF9pbmNsdWRlQmxhbmtPcHRpb24gPSBwYXJhbXMuaW5jbHVkZUJsYW5rT3B0aW9uO1xuXG4gICAgLy8gcmV1c2Ugb3IgY3JlYXRlIHNlbGVjdCBib3hcbiAgICBpZiAoZWwubm9kZU5hbWUgPT09ICdTRUxFQ1QnKSB7XG4gICAgICBfc2VsZWN0Qm94ID0gZWw7XG4gICAgfSBlbHNlIHtcbiAgICAgIF9zZWxlY3RCb3ggPSBlbC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzZWxlY3QnKSk7XG4gICAgfVxuICAgIF9zZWxlY3RCb3guY2xhc3NMaXN0LmFkZChwYXJhbXMuY2xhc3NOYW1lKTtcblxuICAgIC8vIGJpbmQgdG8gZXZlbnRzIG9uIHRoZSBjb2xsZWN0aW9uXG4gICAgX2NvbGxlY3Rpb24ub24oJ2FkZCcsIF90aGlzLnJlbmRlcik7XG4gICAgX2NvbGxlY3Rpb24ub24oJ3JlbW92ZScsIF90aGlzLnJlbmRlcik7XG4gICAgX2NvbGxlY3Rpb24ub24oJ3Jlc2V0JywgX3RoaXMucmVuZGVyKTtcbiAgICBfY29sbGVjdGlvbi5vbignc2VsZWN0JywgX29uU2VsZWN0KTtcbiAgICBfY29sbGVjdGlvbi5vbignZGVzZWxlY3QnLCBfb25TZWxlY3QpO1xuXG4gICAgLy8gYmluZCB0byBldmVudHMgb24gdGhpcy5fc2VsZWN0Qm94XG4gICAgX3NlbGVjdEJveC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBfb25DaGFuZ2UpO1xuXG4gICAgLy8gcG9wdWxhdGUgc2VsZWN0IGJveFxuICAgIGlmIChwYXJhbXMucmVuZGVyTm93KSB7XG4gICAgICBfdGhpcy5yZW5kZXIoKTtcbiAgICB9XG4gIH07XG5cbiAgX2NyZWF0ZUJsYW5rT3B0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBbXG4gICAgJzxvcHRpb24gJyxcbiAgICAgICAgJ3ZhbHVlPVwiJywgX2JsYW5rT3B0aW9uLnZhbHVlLCAnXCI+JyxcbiAgICAgIF9ibGFua09wdGlvbi50ZXh0LFxuICAgICc8L29wdGlvbj4nXG4gICAgXS5qb2luKCcnKTtcbiAgfTtcblxuICBfZGVmYXVsdEdldFZhbGlkT3B0aW9ucyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gX2NvbGxlY3Rpb24uZGF0YSgpLm1hcChmdW5jdGlvbiAobykgeyByZXR1cm4gby5pZDsgfSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEhhbmRsZSBzZWxlY3Rib3ggY2hhbmdlIGV2ZW50cy5cbiAgICovXG4gIF9vbkNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdmFsdWU7XG5cbiAgICB2YWx1ZSA9IF9zZWxlY3RCb3gudmFsdWU7XG5cbiAgICBpZiAoX2luY2x1ZGVCbGFua09wdGlvbiAmJiB2YWx1ZSA9PT0gX2JsYW5rT3B0aW9uLnZhbHVlKSB7XG4gICAgICBfY29sbGVjdGlvbi5kZXNlbGVjdCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBfY29sbGVjdGlvbi5zZWxlY3RCeUlkKHZhbHVlKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIEhhbmRsZSBjb2xsZWN0aW9uIHNlbGVjdCBldmVudHMuXG4gICAqL1xuICBfb25TZWxlY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGVjdGVkLFxuICAgICAgICB2YWxpZE9wdGlvbnM7XG5cbiAgICBzZWxlY3RlZCA9IF9jb2xsZWN0aW9uLmdldFNlbGVjdGVkKCk7XG4gICAgdmFsaWRPcHRpb25zID0gX2dldFZhbGlkT3B0aW9ucygpO1xuXG4gICAgaWYgKHNlbGVjdGVkKSB7XG4gICAgICBpZiAodmFsaWRPcHRpb25zLmluZGV4T2Yoc2VsZWN0ZWQuaWQpID09PSAtMSkge1xuICAgICAgICBfY29sbGVjdGlvbi5kZXNlbGVjdCgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgX3NlbGVjdEJveC52YWx1ZSA9IHNlbGVjdGVkLmlkO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoX2luY2x1ZGVCbGFua09wdGlvbikge1xuICAgICAgX3NlbGVjdEJveC52YWx1ZSA9IF9ibGFua09wdGlvbi52YWx1ZTtcbiAgICB9XG4gIH07XG5cblxuICAvKipcbiAgICogRGVzdHJveSBDb2xsZWN0aW9uU2VsZWN0Qm94LlxuICAgKi9cbiAgX3RoaXMuZGVzdHJveSA9IFV0aWwuY29tcG9zZShmdW5jdGlvbiAoKSB7XG4gICAgX2NvbGxlY3Rpb24ub2ZmKCdhZGQnLCBfdGhpcy5yZW5kZXIpO1xuICAgIF9jb2xsZWN0aW9uLm9mZigncmVtb3ZlJywgX3RoaXMucmVuZGVyKTtcbiAgICBfY29sbGVjdGlvbi5vZmYoJ3Jlc2V0JywgX3RoaXMucmVuZGVyKTtcbiAgICBfY29sbGVjdGlvbi5vZmYoJ3NlbGVjdCcsIF9vblNlbGVjdCk7XG4gICAgX2NvbGxlY3Rpb24ub2ZmKCdkZXNlbGVjdCcsIF9vblNlbGVjdCk7XG5cbiAgICBfc2VsZWN0Qm94LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIF9vbkNoYW5nZSk7XG5cbiAgICBfYmxhbmtPcHRpb24gPSBudWxsO1xuICAgIF9jb2xsZWN0aW9uID0gbnVsbDtcbiAgICBfZm9ybWF0ID0gbnVsbDtcbiAgICBfZ2V0VmFsaWRPcHRpb25zID0gbnVsbDtcbiAgICBfaW5jbHVkZUJsYW5rT3B0aW9uID0gbnVsbDtcbiAgICBfc2VsZWN0Qm94ID0gbnVsbDtcblxuICAgIF9jcmVhdGVCbGFua09wdGlvbiA9IG51bGw7XG4gICAgX2RlZmF1bHRHZXRWYWxpZE9wdGlvbnMgPSBudWxsO1xuICAgIF9vbkNoYW5nZSA9IG51bGw7XG4gICAgX29uU2VsZWN0ID0gbnVsbDtcblxuICAgIF9pbml0aWFsaXplID0gbnVsbDtcbiAgICBfdGhpcyA9IG51bGw7XG4gIH0sIF90aGlzLmRlc3Ryb3kpO1xuXG4gIC8qKlxuICAgKiBVcGRhdGUgc2VsZWN0IGJveCBpdGVtcy5cbiAgICovXG4gIF90aGlzLnJlbmRlciA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZGF0YSxcbiAgICAgICAgaSxcbiAgICAgICAgaWQsXG4gICAgICAgIGxlbixcbiAgICAgICAgbWFya3VwLFxuICAgICAgICBzZWxlY3RlZCxcbiAgICAgICAgdmFsaWRPcHRpb25zO1xuXG4gICAgZGF0YSA9IF9jb2xsZWN0aW9uLmRhdGEoKTtcbiAgICBtYXJrdXAgPSBbXTtcbiAgICBzZWxlY3RlZCA9IF9jb2xsZWN0aW9uLmdldFNlbGVjdGVkKCk7XG5cbiAgICBpZiAoX2luY2x1ZGVCbGFua09wdGlvbiA9PT0gdHJ1ZSkge1xuICAgICAgbWFya3VwLnB1c2goX2NyZWF0ZUJsYW5rT3B0aW9uKCkpO1xuICAgIH1cblxuICAgIHZhbGlkT3B0aW9ucyA9IF9nZXRWYWxpZE9wdGlvbnMoKTtcblxuICAgIGZvciAoaSA9IDAsIGxlbiA9IGRhdGEubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGlkID0gZGF0YVtpXS5pZDtcblxuICAgICAgbWFya3VwLnB1c2goJzxvcHRpb24gdmFsdWU9XCInICsgaWQgKyAnXCInICtcbiAgICAgICAgICAoc2VsZWN0ZWQgPT09IGRhdGFbaV0gPyAnIHNlbGVjdGVkPVwic2VsZWN0ZWRcIicgOiAnJykgK1xuICAgICAgICAgICh2YWxpZE9wdGlvbnMuaW5kZXhPZihpZCkgPT09IC0xID8gJyBkaXNhYmxlZD1cImRpc2FibGVkXCInIDogJycpICtcbiAgICAgICAgICAnPicgKyBfZm9ybWF0KGRhdGFbaV0pICsgJzwvb3B0aW9uPicpO1xuICAgIH1cblxuICAgIF9zZWxlY3RCb3guaW5uZXJIVE1MID0gbWFya3VwLmpvaW4oJycpO1xuICAgIF9vblNlbGVjdCgpO1xuICB9O1xuXG5cbiAgX2luaXRpYWxpemUocGFyYW1zKTtcbiAgcGFyYW1zID0gbnVsbDtcbiAgcmV0dXJuIF90aGlzO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBDb2xsZWN0aW9uU2VsZWN0Qm94O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgVXRpbCA9IHJlcXVpcmUoJy4uL3V0aWwvVXRpbCcpLFxuICAgIFZpZXcgPSByZXF1aXJlKCcuL1ZpZXcnKTtcblxuXG52YXIgX0RFRkFVTFRTID0ge1xuICAvLyBjbGFzcyBuYW1lIGZvciB0YWJsZVxuICBjbGFzc05hbWU6ICdjb2xsZWN0aW9uLXRhYmxlJyxcbiAgLy8gY2xpY2sgb24gdGFibGUgcm93cyB0byB0cmlnZ2VyIHNlbGVjdCBpbiBjb2xsZWN0aW9uXG4gIGNsaWNrVG9TZWxlY3Q6IGZhbHNlLFxuICAvLyBjb2x1bW5zIG9mIGRhdGEgdG8gZGlzcGxheVxuICBjb2x1bW5zOiBbXG4gICAgLy97XG4gICAgICAvLyBjbGFzcyBuYW1lIGZvciBoZWFkZXIgYW5kIGRhdGEgY2VsbHNcbiAgICAgIC8vICAgY2xhc3NOYW1lOiAnJyxcbiAgICAgIC8vIGhlYWRlciBjb250ZW50IGZvciBjb2x1bW5cbiAgICAgIC8vICAgdGl0bGU6ICcnLFxuICAgICAgLy8gZm9ybWF0IGZ1bmN0aW9uIGZvciBkYXRhIGNlbGxzXG4gICAgICAvLyAgIGZvcm1hdDogZnVuY3Rpb24gKGl0ZW0pIHsgcmV0dXJuICcnOyB9XG4gICAgICAvLyB3aGV0aGVyIGNvbHVtbiBpcyBoZWFkZXIgZm9yIGl0cyByb3dcbiAgICAgIC8vICAgaGVhZGVyOiBmYWxzZVxuICAgIC8vfVxuICBdLFxuICBlbXB0eU1hcmt1cDogJ05vIGRhdGEgdG8gZGlzcGxheScsXG4gIC8vIHdoZXRoZXIgdG8gcmVuZGVyIGFmdGVyIGluaXRpYWxpemF0aW9uXG4gIHJlbmRlck5vdzogdHJ1ZVxufTtcblxuXG4vKipcbiAqIENyZWF0ZSBhIENvbGxlY3Rpb25UYWJsZSB0byBkaXNwbGF5IGEgY29sbGVjdGlvbi5cbiAqXG4gKiBAcGFyYW0gcGFyYW1zIHtPYmplY3R9XG4gKiBAcGFyYW0gcGFyYW1zLmNvbGxlY3Rpb24ge0NvbGxlY3Rpb259XG4gKiAgICAgICAgQ29sbGVjdGlvbiB0byBkaXNwbGF5LlxuICogQHBhcmFtIHBhcmFtcy5jb2x1bW5zIHtBcnJheTxPYmplY3Q+fVxuICogICAgICAgIEFycmF5IG9mIGNvbHVtbiBvYmplY3RzIGRlZmluaW5nIGRpc3BsYXkuXG4gKiAgICAgICAgRWFjaCBvYmplY3Qgc2hvdWxkIGhhdmUgdGhlc2UgcHJvcGVydGllczpcbiAqICAgICAgICAtIGNsYXNzTmFtZSB7U3RyaW5nfSBjbGFzcyBuYW1lIGZvciBoZWFkZXIgYW5kIGRhdGEgY2VsbHMuXG4gKiAgICAgICAgLSB0aXRsZSB7U3RyaW5nfSBtYXJrdXAgZm9yIGhlYWRlciBjZWxsLlxuICogICAgICAgIC0gZm9ybWF0IHtGdW5jdGlvbihpdGVtKX0gZnVuY3Rpb24gdG8gZm9ybWF0IGRhdGEgY2VsbC5cbiAqICAgICAgICAtIGhlYWRlciB7Qm9vbGVhbn0gZGVmYXVsdCBmYWxzZS5cbiAqICAgICAgICAgIHdoZXRoZXIgY29sdW1uIGlzIHJvdyBoZWFkZXIgYW5kIHNob3VsZCB1c2UgdGggc2NvcGU9cm93ICh0cnVlKSxcbiAqICAgICAgICAgIG9yIGEgcmVndWxhciBkYXRhIGNlbGwgYW5kIHNob3VsZCB1c2UgdGQgKGZhbHNlKS5cbiAqIEBwYXJhbSBwYXJhbXMuY2xpY2tUb1NlbGVjdCB7Qm9vbGVhbn1cbiAqICAgICAgICBEZWZhdWx0IGZhbHNlLiAgV2hldGhlciBjbGlja2luZyBvbiB0YWJsZSByb3dzIHNob3VsZCBzZWxlY3RcbiAqICAgICAgICB0aGUgY29ycmVzcG9uZGluZyBjb2xsZWN0aW9uIGl0ZW0uXG4gKiBAc2VlIG12Yy9WaWV3XG4gKi9cbnZhciBDb2xsZWN0aW9uVGFibGUgPSBmdW5jdGlvbiAocGFyYW1zKSB7XG4gIHZhciBfdGhpcyxcbiAgICAgIF9pbml0aWFsaXplLFxuXG4gICAgICBfY2xhc3NOYW1lLFxuICAgICAgX2NsaWNrVG9TZWxlY3QsXG4gICAgICBfY29sbGVjdGlvbixcbiAgICAgIF9jb2x1bW5zLFxuICAgICAgX2VtcHR5TWFya3VwLFxuXG4gICAgICBfb25DbGljayxcbiAgICAgIF9vblNlbGVjdDtcblxuXG4gIHBhcmFtcyA9IFV0aWwuZXh0ZW5kKHt9LCBfREVGQVVMVFMsIHBhcmFtcyk7XG4gIF90aGlzID0gVmlldyhwYXJhbXMpO1xuXG4gIF9pbml0aWFsaXplID0gZnVuY3Rpb24gKCkge1xuICAgIF9jbGFzc05hbWUgPSBwYXJhbXMuY2xhc3NOYW1lO1xuICAgIF9jbGlja1RvU2VsZWN0ID0gcGFyYW1zLmNsaWNrVG9TZWxlY3Q7XG4gICAgX2NvbGxlY3Rpb24gPSBwYXJhbXMuY29sbGVjdGlvbjtcbiAgICBfY29sdW1ucyA9IHBhcmFtcy5jb2x1bW5zO1xuICAgIF9lbXB0eU1hcmt1cCA9IHBhcmFtcy5lbXB0eU1hcmt1cDtcblxuICAgIC8vIHJlc3BvbmQgdG8gY29sbGVjdGlvbiBldmVudHNcbiAgICBfY29sbGVjdGlvbi5vbignYWRkJywgX3RoaXMucmVuZGVyKTtcbiAgICBfY29sbGVjdGlvbi5vbigncmVtb3ZlJywgX3RoaXMucmVuZGVyKTtcbiAgICBfY29sbGVjdGlvbi5vbigncmVzZXQnLCBfdGhpcy5yZW5kZXIpO1xuICAgIF9jb2xsZWN0aW9uLm9uKCdzZWxlY3QnLCBfb25TZWxlY3QpO1xuICAgIF9jb2xsZWN0aW9uLm9uKCdkZXNlbGVjdCcsIF9vblNlbGVjdCk7XG5cbiAgICAvLyBhZGQgY2xpY2sgaGFuZGxlclxuICAgIGlmIChfY2xpY2tUb1NlbGVjdCkge1xuICAgICAgX3RoaXMuZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBfb25DbGljayk7XG4gICAgfVxuXG4gICAgaWYgKHBhcmFtcy5yZW5kZXJOb3cpIHtcbiAgICAgIF90aGlzLnJlbmRlcigpO1xuICAgIH1cbiAgfTtcblxuXG4gIC8qKlxuICAgKiBIYW5kbGUgdGFibGUgY2xpY2sgZXZlbnRzLlxuICAgKiBMaXN0ZW5lciBpcyBvbmx5IGFkZGVkIHdoZW4gb3B0aW9ucy5jbGlja1RvU2VsZWN0IGlzIHRydWUuXG4gICAqL1xuICBfb25DbGljayA9IGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyIHRhcmdldCA9IGUudGFyZ2V0LFxuICAgICAgICByb3cgPSBVdGlsLmdldFBhcmVudE5vZGUodGFyZ2V0LCAnVFInLCBfdGhpcy5lbCk7XG5cbiAgICBpZiAocm93ICE9PSBudWxsKSB7XG4gICAgICBpZiAocm93LnBhcmVudE5vZGUubm9kZU5hbWUudG9VcHBlckNhc2UoKSA9PT0gJ1RCT0RZJykge1xuICAgICAgICBfY29sbGVjdGlvbi5zZWxlY3RCeUlkKHJvdy5nZXRBdHRyaWJ1dGUoJ2RhdGEtaWQnKSk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBIYW5kbGUgY29sbGVjdGlvbiBzZWxlY3QgYW5kIGRlc2VsZWN0IGV2ZW50cy5cbiAgICovXG4gIF9vblNlbGVjdCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZWwgPSBfdGhpcy5lbCxcbiAgICAgICAgc2VsZWN0ZWQ7XG5cbiAgICAvLyByZW1vdmUgcHJldmlvdXMgc2VsZWN0aW9uXG4gICAgc2VsZWN0ZWQgPSBlbC5xdWVyeVNlbGVjdG9yKCcuc2VsZWN0ZWQnKTtcbiAgICBpZiAoc2VsZWN0ZWQpIHtcbiAgICAgIHNlbGVjdGVkLmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGVkJyk7XG4gICAgfVxuXG4gICAgLy8gc2V0IG5ldyBzZWxlY3Rpb25cbiAgICBzZWxlY3RlZCA9IF9jb2xsZWN0aW9uLmdldFNlbGVjdGVkKCk7XG4gICAgaWYgKHNlbGVjdGVkKSB7XG4gICAgICBzZWxlY3RlZCA9IGVsLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWlkPVwiJyArIHNlbGVjdGVkLmlkICsgJ1wiXScpO1xuICAgICAgc2VsZWN0ZWQuY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQnKTtcbiAgICB9XG4gIH07XG5cblxuICAvKipcbiAgICogVW5kbyBpbml0aWFsaXphdGlvbiBhbmQgZnJlZSByZWZlcmVuY2VzLlxuICAgKi9cbiAgX3RoaXMuZGVzdHJveSA9IFV0aWwuY29tcG9zZShmdW5jdGlvbiAoKSB7XG5cbiAgICBfY29sbGVjdGlvbi5vZmYoJ2FkZCcsIF90aGlzLnJlbmRlcik7XG4gICAgX2NvbGxlY3Rpb24ub2ZmKCdyZW1vdmUnLCBfdGhpcy5yZW5kZXIpO1xuICAgIF9jb2xsZWN0aW9uLm9mZigncmVzZXQnLCBfdGhpcy5yZW5kZXIpO1xuICAgIF9jb2xsZWN0aW9uLm9mZignc2VsZWN0JywgX29uU2VsZWN0KTtcbiAgICBfY29sbGVjdGlvbi5vZmYoJ2Rlc2VsZWN0JywgX29uU2VsZWN0KTtcbiAgICBfY29sbGVjdGlvbiA9IG51bGw7XG5cbiAgICBpZiAoX2NsaWNrVG9TZWxlY3QpIHtcbiAgICAgIF90aGlzLmVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgX29uQ2xpY2spO1xuICAgIH1cbiAgICBfY2xpY2tUb1NlbGVjdCA9IG51bGw7XG4gIH0sIF90aGlzLmRlc3Ryb3kpO1xuXG4gIC8qKlxuICAgKiBSZW5kZXIgdGhlIHZpZXcuXG4gICAqL1xuICBfdGhpcy5yZW5kZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGMsXG4gICAgICAgIGNMZW4sXG4gICAgICAgIGNvbHVtbixcbiAgICAgICAgZGF0YSxcbiAgICAgICAgaSxcbiAgICAgICAgaWQsXG4gICAgICAgIGlMZW4sXG4gICAgICAgIGl0ZW0sXG4gICAgICAgIG1hcmt1cDtcblxuICAgIGRhdGEgPSBfY29sbGVjdGlvbi5kYXRhKCk7XG4gICAgbWFya3VwID0gW107XG5cbiAgICBpZiAoZGF0YS5sZW5ndGggPT09IDApIHtcbiAgICAgIF90aGlzLmVsLmlubmVySFRNTCA9IF9lbXB0eU1hcmt1cDtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBtYXJrdXAucHVzaCgnPHRhYmxlIGNsYXNzPVwiJywgX2NsYXNzTmFtZSwgJ1wiPjx0aGVhZD4nKTtcbiAgICBmb3IgKGMgPSAwLCBjTGVuID0gX2NvbHVtbnMubGVuZ3RoOyBjIDwgY0xlbjsgYysrKSB7XG4gICAgICBjb2x1bW4gPSBfY29sdW1uc1tjXTtcbiAgICAgIG1hcmt1cC5wdXNoKCc8dGggY2xhc3M9XCInICsgY29sdW1uLmNsYXNzTmFtZSArICdcIj4nICtcbiAgICAgICAgICBjb2x1bW4udGl0bGUgKyAnPC90aD4nKTtcbiAgICB9XG4gICAgbWFya3VwLnB1c2goJzwvdGhlYWQ+PHRib2R5PicpO1xuICAgIGZvciAoaSA9IDAsIGlMZW4gPSBkYXRhLmxlbmd0aDsgaSA8IGlMZW47IGkrKykge1xuICAgICAgaXRlbSA9IGRhdGFbaV07XG4gICAgICBpZCA9ICgnJyArIGl0ZW0uaWQpLnJlcGxhY2UoL1wiL2csICcmcXVvdDsnKTtcbiAgICAgIG1hcmt1cC5wdXNoKCc8dHIgZGF0YS1pZD1cIicgKyBpZCArICdcIj4nKTtcbiAgICAgIGZvciAoYyA9IDAsIGNMZW4gPSBfY29sdW1ucy5sZW5ndGg7IGMgPCBjTGVuOyBjKyspIHtcbiAgICAgICAgY29sdW1uID0gX2NvbHVtbnNbY107XG4gICAgICAgIG1hcmt1cC5wdXNoKCc8JyArIChjb2x1bW4uaGVhZGVyID8gJ3RoIHNjb3BlPVwicm93XCInIDogJ3RkJykgK1xuICAgICAgICAgICAgJyBjbGFzcz1cIicgKyBjb2x1bW4uY2xhc3NOYW1lICsgJ1wiPicgK1xuICAgICAgICAgICAgY29sdW1uLmZvcm1hdChpdGVtKSArICc8L3RkPicpO1xuICAgICAgfVxuICAgICAgbWFya3VwLnB1c2goJzwvdHI+Jyk7XG4gICAgfVxuICAgIG1hcmt1cC5wdXNoKCc8L3Rib2R5PjwvdGFibGU+Jyk7XG5cbiAgICBfdGhpcy5lbC5pbm5lckhUTUwgPSBtYXJrdXAuam9pbignJyk7XG4gIH07XG5cblxuICBfaW5pdGlhbGl6ZSgpO1xuICByZXR1cm4gX3RoaXM7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IENvbGxlY3Rpb25UYWJsZTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBDb2xsZWN0aW9uID0gcmVxdWlyZSgnLi9Db2xsZWN0aW9uJyksXG4gICAgVmlldyA9IHJlcXVpcmUoJy4vVmlldycpLFxuXG4gICAgVXRpbCA9IHJlcXVpcmUoJy4uL3V0aWwvVXRpbCcpO1xuXG52YXIgQ29sbGVjdGlvblZpZXcgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICB2YXIgX3RoaXMsXG4gICAgICBfaW5pdGlhbGl6ZSxcblxuICAgICAgX2NvbGxlY3Rpb24sXG4gICAgICBfZGVzdHJveUNvbGxlY3Rpb24sXG4gICAgICBfZmFjdG9yeSxcbiAgICAgIF9saXN0LFxuICAgICAgX3ZpZXdzLFxuXG4gICAgICBfY3JlYXRlVmlld3MsXG4gICAgICBfb25Db2xsZWN0aW9uQWRkLFxuICAgICAgX29uQ29sbGVjdGlvbkRlc2VsZWN0LFxuICAgICAgX29uQ29sbGVjdGlvblJlbW92ZSxcbiAgICAgIF9vbkNvbGxlY3Rpb25SZXNldCxcbiAgICAgIF9vbkNvbGxlY3Rpb25TZWxlY3Q7XG5cblxuICBfdGhpcyA9IFZpZXcob3B0aW9ucyk7XG5cbiAgX2luaXRpYWxpemUgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgIHZhciBzZWxlY3RlZDtcblxuICAgIF9jb2xsZWN0aW9uID0gb3B0aW9ucy5jb2xsZWN0aW9uO1xuICAgIF9mYWN0b3J5ID0gb3B0aW9ucy5mYWN0b3J5IHx8IFZpZXc7XG5cbiAgICBpZiAoIV9jb2xsZWN0aW9uKSB7XG4gICAgICBfY29sbGVjdGlvbiA9IENvbGxlY3Rpb24oW10pO1xuICAgICAgX2Rlc3Ryb3lDb2xsZWN0aW9uID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoX3RoaXMuZWwubm9kZU5hbWUgPT09ICdVTCcgfHwgX3RoaXMuZWwubm9kZU5hbWUgPT09ICdPTCcpIHtcbiAgICAgIF9saXN0ID0gX3RoaXMuZWw7XG4gICAgfSBlbHNlIHtcbiAgICAgIF9saXN0ID0gX3RoaXMuZWwuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndWwnKSk7XG4gICAgfVxuXG4gICAgX3ZpZXdzID0gQ29sbGVjdGlvbihbXSk7XG5cbiAgICBfY29sbGVjdGlvbi5vbigncmVuZGVyJywgX3RoaXMucmVuZGVyKTtcblxuICAgIF9jb2xsZWN0aW9uLm9uKCdhZGQnLCBfb25Db2xsZWN0aW9uQWRkKTtcbiAgICBfY29sbGVjdGlvbi5vbigncmVtb3ZlJywgX29uQ29sbGVjdGlvblJlbW92ZSk7XG4gICAgX2NvbGxlY3Rpb24ub24oJ3Jlc2V0JywgX29uQ29sbGVjdGlvblJlc2V0KTtcblxuICAgIF9jb2xsZWN0aW9uLm9uKCdzZWxlY3QnLCBfb25Db2xsZWN0aW9uU2VsZWN0KTtcbiAgICBfY29sbGVjdGlvbi5vbignZGVzZWxlY3QnLCBfb25Db2xsZWN0aW9uRGVzZWxlY3QpO1xuXG4gICAgX29uQ29sbGVjdGlvblJlc2V0KCk7XG5cbiAgICAvLyBNYWtlIHN1cmUgYW55IHNlbGVjdGVkIG1vZGVsIGlzIHJlbmRlcmVkIHByb3Blcmx5IGluIHRoZSB2aWV3XG4gICAgc2VsZWN0ZWQgPSBfY29sbGVjdGlvbi5nZXRTZWxlY3RlZCgpO1xuICAgIGlmIChzZWxlY3RlZCkge1xuICAgICAgX29uQ29sbGVjdGlvblNlbGVjdChzZWxlY3RlZCk7XG4gICAgfVxuICB9O1xuXG5cbiAgX2NyZWF0ZVZpZXdzID0gZnVuY3Rpb24gKG1vZGVscywgcGFyZW50KSB7XG4gICAgdmFyIHZpZXdzO1xuXG4gICAgcGFyZW50ID0gcGFyZW50IHx8IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcblxuICAgIHZpZXdzID0gbW9kZWxzLm1hcChmdW5jdGlvbiAobW9kZWwpIHtcbiAgICAgIHZhciB2aWV3ID0gX2ZhY3Rvcnkoe1xuICAgICAgICBjb2xsZWN0aW9uOiBfY29sbGVjdGlvbixcbiAgICAgICAgZWw6IHBhcmVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpKSxcbiAgICAgICAgbW9kZWw6IG1vZGVsXG4gICAgICB9KTtcblxuICAgICAgaWYgKHR5cGVvZiB2aWV3LmlkID09PSAndW5kZWZpbmVkJyB8fCB2aWV3LmlkID09PSBudWxsKSB7XG4gICAgICAgIHZpZXcuaWQgPSBtb2RlbC5pZDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHZpZXc7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdmlld3M7XG4gIH07XG5cbiAgX29uQ29sbGVjdGlvbkFkZCA9IGZ1bmN0aW9uIChtb2RlbHMpIHtcbiAgICB2YXIgZnJhZ21lbnQsXG4gICAgICAgIHZpZXdzO1xuXG4gICAgZnJhZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG4gICAgdmlld3MgPSBfY3JlYXRlVmlld3MobW9kZWxzLCBmcmFnbWVudCk7XG5cbiAgICAvLyBBZGQgdGhlIG5ld2x5IGNyZWF0ZWQgdmlld3MgdG8gb3VyIHZpZXcgY29sbGVjdGlvblxuICAgIF92aWV3cy5hZGQuYXBwbHkoX3ZpZXdzLCB2aWV3cyk7XG5cbiAgICAvLyBBcHBlbmQgb3VyIG5ldyB2aWV3cyB0byB0aGUgZW5kXG4gICAgX2xpc3QuYXBwZW5kQ2hpbGQoZnJhZ21lbnQpO1xuICB9O1xuXG4gIF9vbkNvbGxlY3Rpb25EZXNlbGVjdCA9IGZ1bmN0aW9uIChtb2RlbCkge1xuICAgIHZhciB2aWV3O1xuXG4gICAgdmlldyA9IF92aWV3cy5nZXQobW9kZWwuaWQpO1xuXG4gICAgaWYgKHZpZXcpIHtcbiAgICAgIHZpZXcuZWwuY2xhc3NMaXN0LnJlbW92ZSgnc2VsZWN0ZWQnKTtcbiAgICB9XG4gIH07XG5cbiAgX29uQ29sbGVjdGlvblJlbW92ZSA9IGZ1bmN0aW9uIChtb2RlbHMpIHtcbiAgICBtb2RlbHMuZm9yRWFjaChmdW5jdGlvbiAobW9kZWwpIHtcbiAgICAgIHZhciB2aWV3ID0gX3ZpZXdzLmdldChtb2RlbC5pZCk7XG5cbiAgICAgIGlmICh2aWV3KSB7XG4gICAgICAgIF92aWV3cy5yZW1vdmUodmlldyk7XG5cbiAgICAgICAgaWYgKHZpZXcuZWwucGFyZW50Tm9kZSA9PT0gX2xpc3QpIHtcbiAgICAgICAgICBfbGlzdC5yZW1vdmVDaGlsZCh2aWV3LmVsKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIF9vbkNvbGxlY3Rpb25SZXNldCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdmlld3M7XG5cbiAgICAvLyBEZXN0cm95IGVhY2ggcHJldmlvdXMgdmlld1xuICAgIF92aWV3cy5kYXRhKCkuZm9yRWFjaChmdW5jdGlvbiAodmlldykge1xuICAgICAgdmlldy5kZXN0cm95KCk7XG4gICAgfSk7XG5cbiAgICAvLyBDcmVhdGUgdGhlIHZpZXdzIGZvciB0aGUgY3VycmVudCBkYXRhIHNldFxuICAgIHZpZXdzID0gX2NyZWF0ZVZpZXdzKF9jb2xsZWN0aW9uLmRhdGEoKSwgZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpKTtcblxuXG5cbiAgICAvLyBSZXNldCBvdXIgY29sbGVjdGlvbiB3aXRoIHRoZSBuZXcgdmlld3NcbiAgICBfdmlld3MucmVzZXQodmlld3MpO1xuXG4gICAgLy8gTm93IHJlbmRlciB0aGVtIGFsbFxuICAgIF90aGlzLnJlbmRlcigpO1xuICB9O1xuXG4gIF9vbkNvbGxlY3Rpb25TZWxlY3QgPSBmdW5jdGlvbiAobW9kZWwpIHtcbiAgICB2YXIgdmlldztcblxuICAgIHZpZXcgPSBfdmlld3MuZ2V0KG1vZGVsLmlkKTtcblxuICAgIGlmICh2aWV3KSB7XG4gICAgICB2aWV3LmVsLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkJyk7XG4gICAgfVxuICB9O1xuXG5cbiAgX3RoaXMuZGVzdHJveSA9IFV0aWwuY29tcG9zZShfdGhpcy5kZXN0cm95LCBmdW5jdGlvbiAoKSB7XG4gICAgX2NvbGxlY3Rpb24ub2ZmKCdyZW5kZXInLCBfdGhpcy5yZW5kZXIpO1xuXG4gICAgX2NvbGxlY3Rpb24ub2ZmKCdhZGQnLCBfb25Db2xsZWN0aW9uQWRkKTtcbiAgICBfY29sbGVjdGlvbi5vZmYoJ3JlbW92ZScsIF9vbkNvbGxlY3Rpb25SZW1vdmUpO1xuICAgIF9jb2xsZWN0aW9uLm9mZigncmVzZXQnLCBfb25Db2xsZWN0aW9uUmVzZXQpO1xuXG4gICAgX2NvbGxlY3Rpb24ub2ZmKCdzZWxlY3QnLCBfb25Db2xsZWN0aW9uU2VsZWN0KTtcbiAgICBfY29sbGVjdGlvbi5vZmYoJ2Rlc2VsZWN0JywgX29uQ29sbGVjdGlvbkRlc2VsZWN0KTtcblxuICAgIGlmIChfZGVzdHJveUNvbGxlY3Rpb24pIHtcbiAgICAgIF9jb2xsZWN0aW9uLmRlc3Ryb3koKTtcbiAgICB9XG5cbiAgICBfdmlld3MuZGF0YSgpLmZvckVhY2goZnVuY3Rpb24gKHZpZXcpIHtcbiAgICAgIHZpZXcuZGVzdHJveSgpO1xuICAgIH0pO1xuICAgIF92aWV3cy5kZXN0cm95KCk7XG5cblxuICAgIF9jb2xsZWN0aW9uID0gbnVsbDtcbiAgICBfZGVzdHJveUNvbGxlY3Rpb24gPSBudWxsO1xuICAgIF9mYWN0b3J5ID0gbnVsbDtcbiAgICBfdmlld3MgPSBudWxsO1xuXG4gICAgX2NyZWF0ZVZpZXdzID0gbnVsbDtcbiAgICBfb25Db2xsZWN0aW9uQWRkID0gbnVsbDtcbiAgICBfb25Db2xsZWN0aW9uRGVzZWxlY3QgPSBudWxsO1xuICAgIF9vbkNvbGxlY3Rpb25SZW1vdmUgPSBudWxsO1xuICAgIF9vbkNvbGxlY3Rpb25SZXNldCA9IG51bGw7XG4gICAgX29uQ29sbGVjdGlvblNlbGVjdCA9IG51bGw7XG5cbiAgICBfaW5pdGlhbGl6ZSA9IG51bGw7XG4gICAgX3RoaXMgPSBudWxsO1xuICB9KTtcblxuICBfdGhpcy5nZXRWaWV3ID0gZnVuY3Rpb24gKG1vZGVsKSB7XG4gICAgcmV0dXJuIF92aWV3cy5nZXQobW9kZWwuaWQpO1xuICB9O1xuXG4gIF90aGlzLnJlbmRlciA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZnJhZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG5cbiAgICBfdmlld3MuZGF0YSgpLmZvckVhY2goZnVuY3Rpb24gKHZpZXcpIHtcbiAgICAgIGZyYWdtZW50LmFwcGVuZENoaWxkKHZpZXcuZWwpO1xuICAgIH0pO1xuXG4gICAgVXRpbC5lbXB0eShfbGlzdCk7XG4gICAgX2xpc3QuYXBwZW5kQ2hpbGQoZnJhZ21lbnQpO1xuICB9O1xuXG5cbiAgX2luaXRpYWxpemUob3B0aW9uc3x8e30pO1xuICBvcHRpb25zID0gbnVsbDtcbiAgcmV0dXJuIF90aGlzO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBDb2xsZWN0aW9uVmlldztcbiIsIid1c2Ugc3RyaWN0Jztcbi8qKlxuICogQSBMaWdodHdlaWdodCBjb2xsZWN0aW9uLCBpbnNwaXJlZCBieSBiYWNrYm9uZS5cbiAqXG4gKiBMYXppbHkgYnVpbGRzIGluZGV4ZXMgdG8gYXZvaWQgb3ZlcmhlYWQgdW50aWwgbmVlZGVkLlxuICovXG5cbnZhciBFdmVudHMgPSByZXF1aXJlKCcuLi91dGlsL0V2ZW50cycpLFxuICAgIFV0aWwgPSByZXF1aXJlKCcuLi91dGlsL1V0aWwnKTtcblxuXG4vKipcbiAqIENyZWF0ZSBhIG5ldyBDb2xsZWN0aW9uLlxuICpcbiAqIEBwYXJhbSBkYXRhIHtBcnJheX1cbiAqICAgICAgV2hlbiBvbWl0dGVkIGEgbmV3IGFycmF5IGlzIGNyZWF0ZWQuXG4gKi9cbnZhciBDb2xsZWN0aW9uID0gZnVuY3Rpb24gKGRhdGEpIHtcblxuICB2YXIgX3RoaXMsXG4gICAgICBfaW5pdGlhbGl6ZSxcblxuICAgICAgX2RhdGEsXG4gICAgICBfaWRzLFxuICAgICAgX3NlbGVjdGVkLFxuXG4gICAgICBfaXNTaWxlbnQ7XG5cblxuICBfdGhpcyA9IEV2ZW50cygpO1xuXG4gIF9pbml0aWFsaXplID0gZnVuY3Rpb24gKCkge1xuICAgIF9kYXRhID0gZGF0YSB8fCBbXTtcbiAgICBfaWRzID0gbnVsbDtcbiAgICBfc2VsZWN0ZWQgPSBudWxsO1xuXG4gICAgZGF0YSA9IG51bGw7XG4gIH07XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgXCJzaWxlbnRcIiBvcHRpb24gaXMgdHJ1ZS5cbiAgICpcbiAgICogQHBhcmFtIG9wdGlvbnMge09iamVjdH1cbiAgICogQHBhcmFtIG9wdGlvbnMuc2lsZW50IHtCb29sZWFufVxuICAgKiAgICAgICAgZGVmYXVsdCBmYWxzZS5cbiAgICogQHJldHVybiB7Qm9vbGVhbn0gdHJ1ZSBpZiBvcHRpb25zLnNpbGVudCBpcyB0cnVlLlxuICAgKi9cbiAgX2lzU2lsZW50ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICByZXR1cm4gb3B0aW9ucyAmJiBvcHRpb25zLnNpbGVudCA9PT0gdHJ1ZTtcbiAgfTtcblxuICAvKipcbiAgICogQWRkIG9iamVjdHMgdG8gdGhlIGNvbGxlY3Rpb24uXG4gICAqXG4gICAqIENhbGxzIHdyYXBwZWQgYXJyYXkucHVzaCwgYW5kIGNsZWFycyB0aGUgaWQgY2FjaGUuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN04oCmfVxuICAgKiAgICAgIGEgdmFyaWFibGUgbnVtYmVyIG9mIG9iamVjdHMgdG8gYXBwZW5kIHRvIHRoZSBjb2xsZWN0aW9uLlxuICAgKiBAZGVwcmVjYXRlZCBzZWUgI2FkZEFsbCgpXG4gICAqL1xuICBfdGhpcy5hZGQgPSBmdW5jdGlvbiAoKSB7XG4gICAgX3RoaXMuYWRkQWxsKEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCkpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBBZGQgb2JqZWN0cyB0byB0aGUgY29sbGVjdGlvbi5cbiAgICpcbiAgICogQ2FsbHMgd3JhcHBlZCBhcnJheS5wdXNoLCBhbmQgY2xlYXJzIHRoZSBpZCBjYWNoZS5cbiAgICpcbiAgICogQHBhcmFtIHRvYWRkIHtBcnJheTxPYmplY3Q+fVxuICAgKiAgICAgICAgb2JqZWN0cyB0byBiZSBhZGRlZCB0byB0aGUgY29sbGVjdGlvbi5cbiAgICovXG4gICBfdGhpcy5hZGRBbGwgPSBmdW5jdGlvbiAodG9hZGQsIG9wdGlvbnMpIHtcbiAgICAgX2RhdGEucHVzaC5hcHBseShfZGF0YSwgdG9hZGQpO1xuICAgICBfaWRzID0gbnVsbDtcbiAgICAgaWYgKCFfaXNTaWxlbnQob3B0aW9ucykpIHtcbiAgICAgICBfdGhpcy50cmlnZ2VyKCdhZGQnLCB0b2FkZCk7XG4gICAgIH1cbiAgIH07XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgd3JhcHBlZCBhcnJheS5cbiAgICpcbiAgICogQHJldHVyblxuICAgKiAgICAgIHRoZSB3cmFwcGVkIGFycmF5LlxuICAgKi9cbiAgX3RoaXMuZGF0YSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gX2RhdGE7XG4gIH07XG5cbiAgLyoqXG4gICAqIERlc2VsZWN0IGN1cnJlbnQgc2VsZWN0aW9uLlxuICAgKi9cbiAgX3RoaXMuZGVzZWxlY3QgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgIGlmIChfc2VsZWN0ZWQgIT09IG51bGwpIHtcbiAgICAgIHZhciBvbGRTZWxlY3RlZCA9IF9zZWxlY3RlZDtcbiAgICAgIF9zZWxlY3RlZCA9IG51bGw7XG4gICAgICBpZiAoIV9pc1NpbGVudChvcHRpb25zKSkge1xuICAgICAgICBfdGhpcy50cmlnZ2VyKCdkZXNlbGVjdCcsIG9sZFNlbGVjdGVkKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIEZyZWUgdGhlIGFycmF5IGFuZCBpZCBjYWNoZS5cbiAgICpcbiAgICogQHBhcmFtIG9wdGlvbnMge09iamVjdH1cbiAgICogICAgICAgIHBhc3NlZCB0byAjZGVzZWxlY3QoKS5cbiAgICovXG4gIF90aGlzLmRlc3Ryb3kgPSBVdGlsLmNvbXBvc2UoZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICBfZGF0YSA9IG51bGw7XG4gICAgX2lkcyA9IG51bGw7XG4gICAgX3NlbGVjdGVkID0gbnVsbDtcbiAgICBpZiAoIV9pc1NpbGVudChvcHRpb25zKSkge1xuICAgICAgX3RoaXMudHJpZ2dlcignZGVzdHJveScpO1xuICAgIH1cbiAgICByZXR1cm4gb3B0aW9ucztcbiAgfSwgX3RoaXMuZGVzdHJveSk7XG5cbiAgLyoqXG4gICAqIEdldCBhbiBvYmplY3QgaW4gdGhlIGNvbGxlY3Rpb24gYnkgSUQuXG4gICAqXG4gICAqIFVzZXMgZ2V0SWRzKCksIHNvIGJ1aWxkcyBtYXAgb2YgSUQgdG8gSU5ERVggb24gZmlyc3QgYWNjZXNzIE8oTikuXG4gICAqIFN1YnNlcXVlbnQgYWNjZXNzIHNob3VsZCBiZSBPKDEpLlxuICAgKlxuICAgKiBAcGFyYW0gaWQge0FueX1cbiAgICogICAgICBpZiB0aGUgY29sbGVjdGlvbiBjb250YWlucyBtb3JlIHRoYW4gb25lIG9iamVjdCB3aXRoIHRoZSBzYW1lIGlkLFxuICAgKiAgICAgIHRoZSBsYXN0IGVsZW1lbnQgd2l0aCB0aGF0IGlkIGlzIHJldHVybmVkLlxuICAgKi9cbiAgX3RoaXMuZ2V0ID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgdmFyIGlkcyA9IF90aGlzLmdldElkcygpO1xuXG4gICAgaWYgKGlkcy5oYXNPd25Qcm9wZXJ0eShpZCkpIHtcbiAgICAgIC8vIHVzZSBjYWNoZWQgaW5kZXhcbiAgICAgIHJldHVybiBfZGF0YVtpZHNbaWRdXTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBHZXQgYSBtYXAgZnJvbSBJRCB0byBJTkRFWC5cbiAgICpcbiAgICogQHBhcmFtIGZvcmNlIHtCb29sZWFufVxuICAgKiAgICAgIHJlYnVpbGQgdGhlIG1hcCBldmVuIGlmIGl0IGV4aXN0cy5cbiAgICovXG4gIF90aGlzLmdldElkcyA9IGZ1bmN0aW9uIChmb3JjZSkge1xuICAgIHZhciBpID0gMCxcbiAgICAgICAgbGVuID0gX2RhdGEubGVuZ3RoLFxuICAgICAgICBpZDtcblxuICAgIGlmIChmb3JjZSB8fCBfaWRzID09PSBudWxsKSB7XG4gICAgICAvLyBidWlsZCB1cCBpZHMgZmlyc3QgdGltZSB0aHJvdWdoXG4gICAgICBfaWRzID0ge307XG5cbiAgICAgIGZvciAoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgaWQgPSBfZGF0YVtpXS5pZDtcblxuICAgICAgICBpZiAoX2lkcy5oYXNPd25Qcm9wZXJ0eShpZCkpIHtcbiAgICAgICAgICB0aHJvdyAnbW9kZWwgd2l0aCBkdXBsaWNhdGUgaWQgXCInICsgaWQgKyAnXCIgZm91bmQgaW4gY29sbGVjdGlvbic7XG4gICAgICAgIH1cblxuICAgICAgICBfaWRzW2lkXSA9IGk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIF9pZHM7XG4gIH07XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgY3VycmVudGx5IHNlbGVjdGVkIG9iamVjdC5cbiAgICovXG4gIF90aGlzLmdldFNlbGVjdGVkID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBfc2VsZWN0ZWQ7XG4gIH07XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBvYmplY3RzIGZyb20gdGhlIGNvbGxlY3Rpb24uXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIGNhbGxzIGFycmF5LnNwbGljZSB0byByZW1vdmUgaXRlbSBmcm9tIGFycmF5LlxuICAgKiBSZXNldCB3b3VsZCBiZSBmYXN0ZXIgaWYgbW9kaWZ5aW5nIGxhcmdlIGNodW5rcyBvZiB0aGUgYXJyYXkuXG4gICAqXG4gICAqIEBwYXJhbSBvIHtPYmplY3R9XG4gICAqICAgICAgb2JqZWN0IHRvIHJlbW92ZS5cbiAgICogQGRlcHJlY2F0ZWQgc2VlICNyZW1vdmVBbGwoKVxuICAgKi9cbiAgX3RoaXMucmVtb3ZlID0gZnVuY3Rpb24gKC8qIG8gKi8pIHtcbiAgICAvLyB0cmlnZ2VyIHJlbW92ZSBldmVudFxuICAgIF90aGlzLnJlbW92ZUFsbChBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDApKTtcbiAgfTtcblxuICAvKipcbiAgICogUmVtb3ZlIG9iamVjdHMgZnJvbSB0aGUgY29sbGVjdGlvbi5cbiAgICpcbiAgICogUmVzZXQgaXMgZmFzdGVyIGlmIG1vZGlmeWluZyBsYXJnZSBjaHVua3Mgb2YgdGhlIGFycmF5LlxuICAgKlxuICAgKiBAcGFyYW0gdG9yZW1vdmUge0FycmF5PE9iamVjdD59XG4gICAqICAgICAgICBvYmplY3RzIHRvIHJlbW92ZS5cbiAgICogQHBhcmFtIG9wdGlvbnMge09iamVjdH1cbiAgICogQHBhcmFtIG9wdGlvbnMuc2lsZW50IHtCb29sZWFufVxuICAgKiAgICAgICAgZGVmYXVsdCBmYWxzZS5cbiAgICogICAgICAgIHdoZXRoZXIgdG8gdHJpZ2dlciBldmVudHMgKGZhbHNlKSwgb3Igbm90ICh0cnVlKS5cbiAgICovXG4gIF90aGlzLnJlbW92ZUFsbCA9IGZ1bmN0aW9uICh0b3JlbW92ZSwgb3B0aW9ucykge1xuICAgIHZhciBpLFxuICAgICAgICBsZW4gPSB0b3JlbW92ZS5sZW5ndGgsXG4gICAgICAgIGluZGV4ZXMgPSBbXSxcbiAgICAgICAgaWRzID0gX3RoaXMuZ2V0SWRzKCksXG4gICAgICAgIG87XG5cbiAgICAvLyBzZWxlY3QgaW5kZXhlcyB0byBiZSByZW1vdmVkXG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBvID0gdG9yZW1vdmVbaV07XG5cbiAgICAgIC8vIGNsZWFyIGN1cnJlbnQgc2VsZWN0aW9uIGlmIGJlaW5nIHJlbW92ZWRcbiAgICAgIGlmIChvID09PSBfc2VsZWN0ZWQpIHtcbiAgICAgICAgX3RoaXMuZGVzZWxlY3QoKTtcbiAgICAgIH1cblxuICAgICAgLy8gYWRkIHRvIGxpc3QgdG8gYmUgcmVtb3ZlZFxuICAgICAgaWYgKGlkcy5oYXNPd25Qcm9wZXJ0eShvLmlkKSkge1xuICAgICAgICBpbmRleGVzLnB1c2goaWRzW28uaWRdKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93ICdyZW1vdmluZyBvYmplY3Qgbm90IGluIGNvbGxlY3Rpb24nO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIHJlbW92ZSBpbiBkZXNjZW5kaW5nIGluZGV4IG9yZGVyXG4gICAgaW5kZXhlcy5zb3J0KGZ1bmN0aW9uKGEsYikgeyByZXR1cm4gYS1iOyB9KTtcblxuICAgIGZvciAoaSA9IGluZGV4ZXMubGVuZ3RoLTE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICBfZGF0YS5zcGxpY2UoaW5kZXhlc1tpXSwgMSk7XG4gICAgfVxuXG4gICAgLy8gcmVzZXQgaWQgY2FjaGVcbiAgICBfaWRzID0gbnVsbDtcblxuICAgIGlmICghX2lzU2lsZW50KG9wdGlvbnMpKSB7XG4gICAgICAvLyB0cmlnZ2VyIHJlbW92ZSBldmVudFxuICAgICAgX3RoaXMudHJpZ2dlcigncmVtb3ZlJywgdG9yZW1vdmUpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogUmVwbGFjZSB0aGUgd3JhcHBlZCBhcnJheSB3aXRoIGEgbmV3IG9uZS5cbiAgICovXG4gIF90aGlzLnJlc2V0ID0gZnVuY3Rpb24gKGRhdGEsIG9wdGlvbnMpIHtcbiAgICAvLyBjaGVjayBmb3IgZXhpc3Rpbmcgc2VsZWN0aW9uXG4gICAgdmFyIHNlbGVjdGVkSWQgPSBudWxsO1xuICAgIGlmIChfc2VsZWN0ZWQgIT09IG51bGwpIHtcbiAgICAgIHNlbGVjdGVkSWQgPSBfc2VsZWN0ZWQuaWQ7XG4gICAgfVxuXG4gICAgLy8gZnJlZSBhcnJheSBhbmQgaWQgY2FjaGVcbiAgICBfZGF0YSA9IG51bGw7XG4gICAgX2lkcyA9IG51bGw7XG4gICAgX3NlbGVjdGVkID0gbnVsbDtcblxuICAgIC8vIHNldCBuZXcgYXJyYXlcbiAgICBfZGF0YSA9IGRhdGEgfHwgW107XG5cbiAgICAvLyBub3RpZnkgbGlzdGVuZXJzXG4gICAgaWYgKCFvcHRpb25zIHx8IG9wdGlvbnMuc2lsZW50ICE9PSB0cnVlKSB7XG4gICAgICBfdGhpcy50cmlnZ2VyKCdyZXNldCcsIGRhdGEpO1xuICAgIH1cblxuICAgIC8vIHJlc2VsZWN0IGlmIHRoZXJlIHdhcyBhIHByZXZpb3VzIHNlbGVjdGlvblxuICAgIGlmIChzZWxlY3RlZElkICE9PSBudWxsKSB7XG4gICAgICB2YXIgc2VsZWN0ZWQgPSBfdGhpcy5nZXQoc2VsZWN0ZWRJZCk7XG4gICAgICBpZiAoc2VsZWN0ZWQgIT09IG51bGwpIHtcbiAgICAgICAgb3B0aW9ucyA9IFV0aWwuZXh0ZW5kKHt9LCBvcHRpb25zLCB7J3Jlc2V0JzogdHJ1ZX0pO1xuICAgICAgICBfdGhpcy5zZWxlY3Qoc2VsZWN0ZWQsIG9wdGlvbnMpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogU2VsZWN0IGFuIG9iamVjdCBpbiB0aGUgY29sbGVjdGlvbi5cbiAgICpcbiAgICogQHBhcmFtIG9iaiB7T2JqZWN0fVxuICAgKiAgICAgIG9iamVjdCBpbiB0aGUgY29sbGVjdGlvbiB0byBzZWxlY3QuXG4gICAqIEB0aHJvd3MgZXhjZXB0aW9uXG4gICAqICAgICAgaWYgb2JqIG5vdCBpbiBjb2xsZWN0aW9uLlxuICAgKi9cbiAgX3RoaXMuc2VsZWN0ID0gZnVuY3Rpb24gKG9iaiwgb3B0aW9ucykge1xuICAgIC8vIG5vIHNlbGVjdGlvblxuICAgIGlmIChvYmogPT09IG51bGwpIHtcbiAgICAgIF90aGlzLmRlc2VsZWN0KCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vIGFscmVhZHkgc2VsZWN0ZWRcbiAgICBpZiAob2JqID09PSBfc2VsZWN0ZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gZGVzZWxlY3QgcHJldmlvdXMgc2VsZWN0aW9uXG4gICAgaWYgKF9zZWxlY3RlZCAhPT0gbnVsbCkge1xuICAgICAgX3RoaXMuZGVzZWxlY3Qob3B0aW9ucyk7XG4gICAgfVxuXG4gICAgaWYgKG9iaiA9PT0gX3RoaXMuZ2V0KG9iai5pZCkpIHtcbiAgICAgIC8vIG1ha2Ugc3VyZSBpdCdzIHBhcnQgb2YgdGhpcyBjb2xsZWN0aW9u4oCmXG4gICAgICBfc2VsZWN0ZWQgPSBvYmo7XG4gICAgICBpZiAoIW9wdGlvbnMgfHwgb3B0aW9ucy5zaWxlbnQgIT09IHRydWUpIHtcbiAgICAgICAgX3RoaXMudHJpZ2dlcignc2VsZWN0JywgX3NlbGVjdGVkLCBvcHRpb25zKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgJ3NlbGVjdGluZyBvYmplY3Qgbm90IGluIGNvbGxlY3Rpb24nO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogVXRpbGl0eSBtZXRob2QgdG8gc2VsZWN0IGNvbGxlY3Rpb24gaXRlbSB1c2luZyBpdHMgaWQuXG4gICAqXG4gICAqIFNlbGVjdHMgbWF0Y2hpbmcgaXRlbSBpZiBpdCBleGlzdHMsIG90aGVyd2lzZSBjbGVhcnMgYW55IHNlbGVjdGlvbi5cbiAgICpcbiAgICogQHBhcmFtIGlkIHs/fVxuICAgKiAgICAgICAgaWQgb2YgaXRlbSB0byBzZWxlY3QuXG4gICAqIEBwYXJhbSBvcHRpb25zIHtPYmplY3R9XG4gICAqICAgICAgICBvcHRpb25zIHBhc3NlZCB0byAjc2VsZWN0KCkgb3IgI2Rlc2VsZWN0KCkuXG4gICAqL1xuICBfdGhpcy5zZWxlY3RCeUlkID0gZnVuY3Rpb24gKGlkLCBvcHRpb25zKSB7XG4gICAgdmFyIG9iaiA9IF90aGlzLmdldChpZCk7XG4gICAgaWYgKG9iaiAhPT0gbnVsbCkge1xuICAgICAgX3RoaXMuc2VsZWN0KG9iaiwgb3B0aW9ucyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIF90aGlzLmRlc2VsZWN0KG9wdGlvbnMpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogU29ydHMgdGhlIGRhdGEuXG4gICAqXG4gICAqIEBwYXJhbSBtZXRob2Qge0Z1bmN0aW9ufVxuICAgKiAgICAgICAgamF2YXNjcmlwdCBzb3J0IG1ldGhvZC5cbiAgICogQHBhcmFtIG9wdGlvbnMge09iamVjdH1cbiAgICogICAgICAgIHBhc3NlZCB0byAjcmVzZXQoKVxuICAgKi9cbiAgX3RoaXMuc29ydCA9IGZ1bmN0aW9uIChtZXRob2QsIG9wdGlvbnMpIHtcbiAgICBfZGF0YS5zb3J0KG1ldGhvZCk7XG5cbiAgICAvLyBcInJlc2V0XCIgdG8gbmV3IHNvcnQgb3JkZXJcbiAgICBfdGhpcy5yZXNldChfZGF0YSwgb3B0aW9ucyk7XG4gIH07XG5cbiAgLyoqXG4gICAqIE92ZXJyaWRlIHRvSlNPTiBtZXRob2QgdG8gc2VyaWFsaXplIG9ubHkgY29sbGVjdGlvbiBkYXRhLlxuICAgKi9cbiAgX3RoaXMudG9KU09OID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBqc29uID0gX2RhdGEuc2xpY2UoMCksXG4gICAgICAgIGl0ZW0sXG4gICAgICAgIGksXG4gICAgICAgIGxlbjtcblxuICAgIGZvciAoaSA9IDAsIGxlbiA9IGpzb24ubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGl0ZW0gPSBqc29uW2ldO1xuICAgICAgaWYgKHR5cGVvZiBpdGVtID09PSAnb2JqZWN0JyAmJlxuICAgICAgICAgIGl0ZW0gIT09IG51bGwgJiZcbiAgICAgICAgICB0eXBlb2YgaXRlbS50b0pTT04gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAganNvbltpXSA9IGl0ZW0udG9KU09OKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGpzb247XG4gIH07XG5cblxuICBfaW5pdGlhbGl6ZSgpO1xuICByZXR1cm4gX3RoaXM7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IENvbGxlY3Rpb247XG4iLCIndXNlIHN0cmljdCc7XG5cblxudmFyIENvbGxlY3Rpb25UYWJsZSA9IHJlcXVpcmUoJy4vQ29sbGVjdGlvblRhYmxlJyksXG4gICAgRG93bmxvYWRWaWV3ID0gcmVxdWlyZSgnLi9Eb3dubG9hZFZpZXcnKSxcbiAgICBTb3J0VmlldyA9IHJlcXVpcmUoJy4vU29ydFZpZXcnKSxcbiAgICBVdGlsID0gcmVxdWlyZSgnLi4vdXRpbC9VdGlsJyksXG4gICAgVmlldyA9IHJlcXVpcmUoJy4vVmlldycpO1xuXG5cbi8qKlxuICogQ3JlYXRlIGEgbmV3IERhdGFUYWJsZSB0byBkaXNwbGF5IGEgY29sbGVjdGlvbi5cbiAqXG4gKiBAcGFyYW0gcGFyYW1zIHtPYmplY3R9XG4gKiAgICAgICAgYWxsIHBhcmFtcyBleGNlcHQgXCJlbFwiIGFyZSBwYXNzZWQgdG8gQ29sbGVjdGlvblRhYmxlLlxuICogQHBhcmFtIHBhcmFtcy5zb3J0cyB7QXJyYXk8T2JqZWN0Pn1cbiAqICAgICAgICBzb3J0IG9iamVjdHMgdXNlZCBieSBTb3J0Vmlldy5cbiAqIEBwYXJhbSBwYXJhbXMuZm9ybWF0RG93bmxvYWQge0Z1bmN0aW9uKENvbGxlY3Rpb24pfVxuICogICAgICAgIE9wdGlvbmFsLCBkZWZhdWx0IGlzIFRhYiBTZXBhcmF0ZWQgVmFsdWVzLlxuICogQHBhcmFtIHBhcmFtcy5jb2x1bW5zIHtBcnJheTxPYmplY3Q+fVxuICogICAgICAgIGNvbHVtbiBvYmplY3RzIHVzZWQgYnkgQ29sbGVjdGlvblRhYmxlLlxuICogQHBhcmFtIHBhcmFtcy5jb2x1bW5zW1hdLmRvd25sb2FkRm9ybWF0IHtGdW5jdGlvbihPYmplY3QpfVxuICogICAgICAgIE9wdGlvbmFsLCBkZWZhdWx0IGlzIGNvbHVtbi5mb3JtYXQuXG4gKiAgICAgICAgRnVuY3Rpb24gdXNlZCB0byBmb3JtYXQgYSBjb2x1bW4gdmFsdWUgZm9yIGRvd25sb2FkLlxuICogICAgICAgIFVzZWQgYnkgRGF0YVRhYmxlLl9mb3JtYXREb3dubG9hZC5cbiAqIEBwYXJhbSBwYXJhbXMuY29sdW1uc1tYXS5kb3dubG9hZFRpdGxlIHtzdHJpbmd9XG4gKiAgICAgICAgT3B0aW9uYWwsIGRlZmF1bHQgaXMgY29sdW1uLnRpdGxlLlxuICogICAgICAgIGNvbHVtbiB0aXRsZSB2YWx1ZSBmb3IgZG93bmxvYWQuXG4gKiAgICAgICAgVXNlZCBieSBEYXRhVGFibGUuX2Zvcm1hdERvd25sb2FkLlxuICogQHNlZSBDb2xsZWN0aW9uVGFibGVcbiAqIEBzZWUgU29ydFZpZXdcbiAqIEBzZWUgRG93bmxvYWRWaWV3XG4gKi9cbnZhciBEYXRhVGFibGUgPSBmdW5jdGlvbiAocGFyYW1zKSB7XG4gIHZhciBfdGhpcyxcbiAgICAgIF9pbml0aWFsaXplLFxuXG4gICAgICBfY29sbGVjdGlvbixcbiAgICAgIF9jb2xsZWN0aW9uVGFibGUsXG4gICAgICBfY29sdW1ucyxcbiAgICAgIF9kb3dubG9hZEJ1dHRvbixcbiAgICAgIF9kb3dubG9hZFZpZXcsXG4gICAgICBfc29ydHMsXG4gICAgICBfc29ydFZpZXcsXG5cbiAgICAgIF9mb3JtYXREb3dubG9hZDtcblxuXG4gIF90aGlzID0gVmlldyhwYXJhbXMpO1xuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplIHRoZSBEYXRhVGFibGUuXG4gICAqL1xuICBfaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZWwsXG4gICAgICAgIHRvb2xzO1xuXG4gICAgZWwgPSBfdGhpcy5lbDtcbiAgICBlbC5pbm5lckhUTUwgPSAnPGRpdiBjbGFzcz1cImRhdGF0YWJsZS10b29sc1wiPjwvZGl2PicgK1xuICAgICAgICAnPGRpdiBjbGFzcz1cImRhdGF0YWJsZS1kYXRhXCI+PC9kaXY+JztcbiAgICBlbC5jbGFzc0xpc3QuYWRkKCdkYXRhdGFibGUnKTtcbiAgICB0b29scyA9IGVsLnF1ZXJ5U2VsZWN0b3IoJy5kYXRhdGFibGUtdG9vbHMnKTtcblxuICAgIF9jb2xsZWN0aW9uID0gcGFyYW1zLmNvbGxlY3Rpb247XG4gICAgX2NvbHVtbnMgPSBwYXJhbXMuY29sdW1ucztcblxuICAgIC8vIHNvcnRcbiAgICBfc29ydHMgPSBwYXJhbXMuc29ydHM7XG4gICAgaWYgKF9zb3J0cykge1xuICAgICAgX3NvcnRWaWV3ID0gbmV3IFNvcnRWaWV3KHtcbiAgICAgICAgY29sbGVjdGlvbjogX2NvbGxlY3Rpb24sXG4gICAgICAgIHNvcnRzOiBfc29ydHMsXG4gICAgICAgIGRlZmF1bHRTb3J0OiBwYXJhbXMuZGVmYXVsdFNvcnRcbiAgICAgIH0pO1xuICAgICAgdG9vbHMuYXBwZW5kQ2hpbGQoX3NvcnRWaWV3LmVsKTtcbiAgICB9XG5cbiAgICAvLyBkYXRhXG4gICAgX2NvbGxlY3Rpb25UYWJsZSA9IG5ldyBDb2xsZWN0aW9uVGFibGUoXG4gICAgICAgIFV0aWwuZXh0ZW5kKHt9LCBwYXJhbXMsIHtcbiAgICAgICAgICBlbDogZWwucXVlcnlTZWxlY3RvcignLmRhdGF0YWJsZS1kYXRhJylcbiAgICAgICAgfSkpO1xuXG4gICAgLy8gZG93bmxvYWRcbiAgICBfZG93bmxvYWRWaWV3ID0gbmV3IERvd25sb2FkVmlldyh7XG4gICAgICBjb2xsZWN0aW9uOiBfY29sbGVjdGlvbixcbiAgICAgIGhlbHA6IHBhcmFtcy5oZWxwIHx8ICdDb3B5IHRoZW4gcGFzdGUgaW50byBhIHNwcmVhZHNoZWV0IGFwcGxpY2F0aW9uJyxcbiAgICAgIGZvcm1hdDogcGFyYW1zLmZvcm1hdERvd25sb2FkIHx8IF9mb3JtYXREb3dubG9hZFxuICAgIH0pO1xuXG4gICAgX2Rvd25sb2FkQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgX2Rvd25sb2FkQnV0dG9uLmlubmVySFRNTCA9ICdEb3dubG9hZCc7XG4gICAgX2Rvd25sb2FkQnV0dG9uLmNsYXNzTmFtZSA9ICdkb3dubG9hZCc7XG4gICAgX2Rvd25sb2FkQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgX2Rvd25sb2FkVmlldy5zaG93KTtcbiAgICB0b29scy5hcHBlbmRDaGlsZChfZG93bmxvYWRCdXR0b24pO1xuXG5cbiAgICBwYXJhbXMgPSBudWxsO1xuICB9O1xuXG5cbiAgLyoqXG4gICAqIENhbGxiYWNrIHVzZWQgdG8gZm9ybWF0IGRvd25sb2Fkcy5cbiAgICogVGhpcyBpbXBsZW1lbnRhdGlvbiBvdXRwdXRzIFRhYiBTZXBhcmF0ZWQgVmFsdWVzLlxuICAgKi9cbiAgX2Zvcm1hdERvd25sb2FkID0gZnVuY3Rpb24gKGNvbGxlY3Rpb24pIHtcbiAgICB2YXIgYyxcbiAgICAgICAgY0xlbixcbiAgICAgICAgY29udGVudCxcbiAgICAgICAgY29sdW1uLFxuICAgICAgICBkYXRhLFxuICAgICAgICBmb3JtYXQsXG4gICAgICAgIGksXG4gICAgICAgIGlMZW4sXG4gICAgICAgIGl0ZW0sXG4gICAgICAgIHJvdztcblxuICAgIGNvbnRlbnQgPSBbXTtcbiAgICBkYXRhID0gY29sbGVjdGlvbi5kYXRhKCk7XG4gICAgcm93ID0gW107XG5cbiAgICBmb3IgKGMgPSAwLCBjTGVuID0gX2NvbHVtbnMubGVuZ3RoOyBjIDwgY0xlbjsgYysrKSB7XG4gICAgICBjb2x1bW4gPSBfY29sdW1uc1tjXTtcbiAgICAgIHJvdy5wdXNoKGNvbHVtbi5kb3dubG9hZFRpdGxlIHx8IGNvbHVtbi50aXRsZSk7XG4gICAgfVxuICAgIGNvbnRlbnQucHVzaChyb3cuam9pbignXFx0JykpO1xuXG4gICAgZm9yIChpID0gMCwgaUxlbiA9IGRhdGEubGVuZ3RoOyBpIDwgaUxlbjsgaSsrKSB7XG4gICAgICBpdGVtID0gZGF0YVtpXTtcbiAgICAgIHJvdyA9IFtdO1xuICAgICAgZm9yIChjID0gMCwgY0xlbiA9IF9jb2x1bW5zLmxlbmd0aDsgYyA8IGNMZW47IGMrKykge1xuICAgICAgICBjb2x1bW4gPSBfY29sdW1uc1tjXTtcbiAgICAgICAgZm9ybWF0ID0gY29sdW1uLmRvd25sb2FkRm9ybWF0IHx8IGNvbHVtbi5mb3JtYXQ7XG4gICAgICAgIHJvdy5wdXNoKGZvcm1hdChpdGVtKSk7XG4gICAgICB9XG4gICAgICBjb250ZW50LnB1c2gocm93LmpvaW4oJ1xcdCcpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gY29udGVudC5qb2luKCdcXG4nKTtcbiAgfTtcblxuXG4gIC8qKlxuICAgKiBEZXN0cm95IHRoZSBEYXRhVGFibGUuXG4gICAqL1xuICBfdGhpcy5kZXN0cm95ID0gVXRpbC5jb21wb3NlKGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoX3NvcnRWaWV3KSB7XG4gICAgICBfc29ydFZpZXcuZGVzdHJveSgpO1xuICAgICAgX3NvcnRWaWV3ID0gbnVsbDtcbiAgICB9XG5cbiAgICBfZG93bmxvYWRCdXR0b24ucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBfZG93bmxvYWRWaWV3LnNob3cpO1xuICAgIF9kb3dubG9hZEJ1dHRvbiA9IG51bGw7XG5cbiAgICBfZG93bmxvYWRWaWV3LmRlc3Ryb3koKTtcbiAgICBfZG93bmxvYWRWaWV3ID0gbnVsbDtcblxuICAgIF9jb2xsZWN0aW9uVGFibGUuZGVzdHJveSgpO1xuICAgIF9jb2xsZWN0aW9uVGFibGUgPSBudWxsO1xuICB9LCBfdGhpcy5kZXN0cm95KTtcblxuXG4gIF9pbml0aWFsaXplKCk7XG4gIHJldHVybiBfdGhpcztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRGF0YVRhYmxlO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgTW9kYWxWaWV3ID0gcmVxdWlyZSgnLi9Nb2RhbFZpZXcnKSxcbiAgICBVdGlsID0gcmVxdWlyZSgnLi4vdXRpbC9VdGlsJyksXG4gICAgVmlldyA9IHJlcXVpcmUoJy4vVmlldycpO1xuXG5cbnZhciBfREVGQVVMVFMgPSB7XG4gIC8vIHRpdGxlIG9mIG1vZGFsIGRpYWxvZy5cbiAgdGl0bGU6ICdEb3dubG9hZCcsXG4gIC8vIG1hcmt1cCB0byBkZXNjcmliZSBkb3dubG9hZCBjb250ZW50LlxuICBoZWxwOiAnJyxcbiAgLy8gY2FsbGJhY2sgZnVuY3Rpb24gdG8gZm9ybWF0IGNvbGxlY3Rpb24gZm9yIGRvd25sb2FkLlxuICBmb3JtYXQ6IGZ1bmN0aW9uIChjb2xsZWN0aW9uKSB7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGNvbGxlY3Rpb24pO1xuICB9XG59O1xuXG5cbi8qKlxuICogQ3JlYXRlIGEgRG93bmxvYWRWaWV3LlxuICpcbiAqIEBwYXJhbSBvcHRpb25zIHtPYmplY3R9XG4gKiBAcGFyYW0gb3B0aW9ucy50aXRsZSB7U3RyaW5nfVxuICogICAgICAgIERlZmF1bHQgJ0Rvd25sb2FkJy5cbiAqICAgICAgICBNb2RhbCBkaWFsb2cgdGl0bGUuXG4gKiBAcGFyYW0gb3B0aW9ucy5mb3JtYXQge0Z1bmN0aW9uKENvbGxlY3Rpb24pfVxuICogICAgICAgIERlZmF1bHQgSlNPTi5zdHJpbmdpZnkuXG4gKiAgICAgICAgZnVuY3Rpb24gdG8gZm9ybWF0IGNvbGxlY3Rpb24gZm9yIGRvd25sb2FkLlxuICogQHNlZSBtdmMvVmlld1xuICovXG52YXIgRG93bmxvYWRWaWV3ID0gZnVuY3Rpb24gKHBhcmFtcykge1xuICB2YXIgX3RoaXMsXG4gICAgICBfaW5pdGlhbGl6ZSxcblxuICAgICAgX2NvbGxlY3Rpb24sXG4gICAgICBfZm9ybWF0LFxuICAgICAgX21vZGFsLFxuICAgICAgX3RleHRhcmVhLFxuICAgICAgX3RpdGxlO1xuXG5cbiAgcGFyYW1zID0gVXRpbC5leHRlbmQoe30sIF9ERUZBVUxUUywgcGFyYW1zKTtcbiAgX3RoaXMgPSBWaWV3KHBhcmFtcyk7XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgdGhlIGRvd25sb2FkIHZpZXcuXG4gICAqL1xuICBfaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZWwgPSBfdGhpcy5lbDtcblxuICAgIF9jb2xsZWN0aW9uID0gcGFyYW1zLmNvbGxlY3Rpb247XG4gICAgX2Zvcm1hdCA9IHBhcmFtcy5mb3JtYXQ7XG4gICAgX3RpdGxlID0gcGFyYW1zLnRpdGxlO1xuXG4gICAgZWwuY2xhc3NOYW1lID0gJ2Rvd25sb2FkLXZpZXcnO1xuICAgIGVsLmlubmVySFRNTCA9ICc8ZGl2IGNsYXNzPVwiaGVscFwiPicgKyBwYXJhbXMuaGVscCArICc8L2Rpdj4nICtcbiAgICAgICAgJzx0ZXh0YXJlYSBjbGFzcz1cImRvd25sb2FkXCIgcmVhZG9ubHk9XCJyZWFkb25seVwiPjwvdGV4dGFyZWE+JztcbiAgICBfdGV4dGFyZWEgPSBlbC5xdWVyeVNlbGVjdG9yKCcuZG93bmxvYWQnKTtcblxuICAgIHBhcmFtcyA9IG51bGw7XG4gIH07XG5cbiAgLyoqXG4gICAqIERlc3Ryb3kgdGhlIGRvd25sb2FkIHZpZXcuXG4gICAqL1xuICBfdGhpcy5kZXN0cm95ID0gVXRpbC5jb21wb3NlKGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoX21vZGFsKSB7XG4gICAgICAvLyBUT0RPOiBoaWRlIGZpcnN0P1xuICAgICAgX21vZGFsLmRlc3Ryb3koKTtcbiAgICAgIF9tb2RhbCA9IG51bGw7XG4gICAgfVxuXG4gICAgX2NvbGxlY3Rpb24gPSBudWxsO1xuICAgIF9mb3JtYXQgPSBudWxsO1xuICAgIF90ZXh0YXJlYSA9IG51bGw7XG4gIH0sIF90aGlzLmRlc3Ryb3kpO1xuXG4gIC8qKlxuICAgKiBGb3JtYXQgY29sbGVjdGlvbiBmb3IgZG93bmxvYWQuXG4gICAqL1xuICBfdGhpcy5yZW5kZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgX3RleHRhcmVhLnZhbHVlID0gX2Zvcm1hdChfY29sbGVjdGlvbik7XG4gIH07XG5cbiAgLyoqXG4gICAqIFNob3cgdGhlIGRvd25sb2FkIHZpZXcsIGNhbGxzIHJlbmRlciBiZWZvcmUgc2hvd2luZyBtb2RhbC5cbiAgICovXG4gIF90aGlzLnNob3cgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCFfbW9kYWwpIHtcbiAgICAgIF9tb2RhbCA9IG5ldyBNb2RhbFZpZXcoX3RoaXMuZWwsIHtcbiAgICAgICAgdGl0bGU6IF90aXRsZVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgX3RoaXMucmVuZGVyKCk7XG4gICAgX21vZGFsLnNob3coKTtcbiAgICBfdGV4dGFyZWEuc2VsZWN0KCk7XG4gIH07XG5cbiAgX2luaXRpYWxpemUoKTtcbiAgcmV0dXJuIF90aGlzO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBEb3dubG9hZFZpZXc7IiwiJ3VzZSBzdHJpY3QnO1xuXG5cbnZhciBDb2xsZWN0aW9uID0gcmVxdWlyZSgnbXZjL0NvbGxlY3Rpb24nKSxcbiAgICBDb2xsZWN0aW9uVmlldyA9IHJlcXVpcmUoJ212Yy9Db2xsZWN0aW9uVmlldycpLFxuICAgIE1vZGFsVmlldyA9IHJlcXVpcmUoJ212Yy9Nb2RhbFZpZXcnKSxcbiAgICBNb2RlbCA9IHJlcXVpcmUoJ212Yy9Nb2RlbCcpLFxuICAgIFZpZXcgPSByZXF1aXJlKCdtdmMvVmlldycpLFxuXG4gICAgRmlsZUlPID0gcmVxdWlyZSgndXRpbC9GaWxlSU8nKSxcbiAgICBNZXNzYWdlID0gcmVxdWlyZSgndXRpbC9NZXNzYWdlJyksXG4gICAgVXRpbCA9IHJlcXVpcmUoJ3V0aWwvVXRpbCcpO1xuXG5cbnZhciBfRklMRV9TSVpFX1NVRkZJWEVTID0gWydCJywgJ0tCJywgJ01CJywgJ0dCJ107XG5cbnZhciBfREVGQVVMVF9JTlRST19URVhUID0gW1xuICAnWW91IG1heSAmbGRxdW87QnJvd3NlJnJkcXVvOyBmb3IgZmlsZXMsIG9yIGRyYWctYW5kLWRyb3AgZmlsZXMgdXNpbmcgdGhlICcsXG4gICdhcmVhIGJlbG93LiBPbmNlIHlvdSBoYXZlIGFkZGVkIGZpbGVzLCB5b3UgbWF5IHByZXZpZXcgdGhlbSBieSBjbGlja2luZyAnLFxuICAndGhlIGJsdWUgZmlsZSBuYW1lLiBQcmV2aWV3IGJlaGF2aW9yIGlzIGJyb3dzZXItZGVwZW5kZW50LiBJZiB5b3Ugc2VsZWN0ICcsXG4gICdhIGZpbGUgd2l0aCB0aGUgc2FtZSBuYW1lIG1vcmUgdGhhbiBvbmNlLCB0aGVuIG9ubHkgdGhlIG1vc3QgcmVjZW50ICcsXG4gICdzZWxlY3Rpb24gd2lsbCBiZSB1c2VkLiBEaXJlY3RvcmllcyBhcmUgbm90IHN1cHBvcnRlZC4nXG5dLmpvaW4oJycpO1xuXG4vLyBEZWZhdWx0IHZhbHVlcyB0byBiZSB1c2VkIGJ5IGNvbnN0cnVjdG9yXG52YXIgX0RFRkFVTFRTID0ge1xuICBicm93c2VUZXh0OiAnQnJvd3NlJyxcblxuICBjYW5jZWxDYWxsYmFjazogZnVuY3Rpb24gKCkge30sXG4gIGNhbmNlbFRleHQ6ICdDYW5jZWwnLFxuICBjYW5jZWxUb29sdGlwOiAnQ2FuY2VsJyxcblxuICBkcm9wem9uZVRleHQ6ICdEcmFnICZhbXA7IGRyb3AgZmlsZShzKSBoZXJlJmhlbGxpcDsnLFxuXG4gIGludHJvOiB7XG4gICAgdGV4dDogX0RFRkFVTFRfSU5UUk9fVEVYVCxcbiAgICBjbGFzc2VzOiAnYWxlcnQgaW5mbydcbiAgfSxcblxuICB0aXRsZTogJ0ZpbGUgSW5wdXQnLFxuXG4gIHVwbG9hZENhbGxiYWNrOiBmdW5jdGlvbiAoKSB7fSxcbiAgdXBsb2FkVGV4dDogJ1VwbG9hZCcsXG4gIHVwbG9hZFRvb2x0aXA6ICdVcGxvYWQgZmlsZShzKSdcbn07XG5cblxuLyoqXG4gKiBQcml2YXRlIGlubmVyIGNsYXNzLiBUaGlzIGlzIGEgdmlldyBmb3IgcmVuZGVyaW5nIGluZGl2aWR1YWwgZmlsZXMgaW5cbiAqIGEgbGlzdC10eXBlIGZvcm1hdC4gSXQgaXMgcHJvdmlkZWQgdG8gdGhlIENvbGxlY3Rpb25WaWV3IGFzIHRoZSBmYWN0b3J5LlxuICpcbiAqL1xudmFyIEZpbGVWaWV3ID0gZnVuY3Rpb24gKHBhcmFtcykge1xuICB2YXIgX3RoaXMsXG4gICAgICBfaW5pdGlhbGl6ZSxcblxuICAgICAgX2NvbGxlY3Rpb24sXG4gICAgICBfZGVsZXRlLFxuICAgICAgX2ZpbGVOYW1lLFxuICAgICAgX2ZpbGVTaXplLFxuXG4gICAgICBfYmluZEV2ZW50TGlzdGVuZXJzLFxuICAgICAgX2NyZWF0ZVZpZXdTa2VsZXRvbixcbiAgICAgIF9mb3JtYXRGaWxlU2l6ZSxcbiAgICAgIF9vbkRlbGV0ZUNsaWNrLFxuICAgICAgX3VuYmluZEV2ZW50TGlzdGVuZXJzO1xuXG5cbiAgX3RoaXMgPSBWaWV3KHBhcmFtcyk7XG5cbiAgX2luaXRpYWxpemUgPSBmdW5jdGlvbiAoLypwYXJhbXMqLykge1xuICAgIF9jb2xsZWN0aW9uID0gcGFyYW1zLmNvbGxlY3Rpb247XG4gICAgX2NyZWF0ZVZpZXdTa2VsZXRvbigpO1xuICAgIF9iaW5kRXZlbnRMaXN0ZW5lcnMoKTtcblxuICAgIF90aGlzLnJlbmRlcigpO1xuICB9O1xuXG5cbiAgX2JpbmRFdmVudExpc3RlbmVycyA9IGZ1bmN0aW9uICgpIHtcbiAgICBfZGVsZXRlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgX29uRGVsZXRlQ2xpY2spO1xuICB9O1xuXG4gIF9jcmVhdGVWaWV3U2tlbGV0b24gPSBmdW5jdGlvbiAoKSB7XG4gICAgX3RoaXMuZWwuY2xhc3NMaXN0LmFkZCgnZmlsZS12aWV3Jyk7XG5cbiAgICBfdGhpcy5lbC5pbm5lckhUTUwgPSBbXG4gICAgICAnPHNwYW4gY2xhc3M9XCJmaWxlLXZpZXctbGFiZWxcIj4nLFxuICAgICAgICAnPGEgaHJlZj1cImphdmFzY3JpcHQ6dm9pZChudWxsKTtcIiB0YXJnZXQ9XCJfYmxhbmtcIiAnLFxuICAgICAgICAgICAgJ2NsYXNzPVwiZmlsZS12aWV3LW5hbWVcIj48L2E+JyxcbiAgICAgICAgJzxzcGFuIGNsYXNzPVwiZmlsZS12aWV3LXNpemVcIj48L3NwYW4+JyxcbiAgICAgICc8L3NwYW4+JyxcbiAgICAgICc8YSBocmVmPVwiamF2YXNjcmlwdDp2b2lkKG51bGwpO1wiIGNsYXNzPVwiZmlsZS12aWV3LWRlbGV0ZVwiICcsXG4gICAgICAgICAgJ3RpdGxlPVwiRGVsZXRlIEZpbGVcIj4mdGltZXM7PC9hPidcbiAgICBdLmpvaW4oJycpO1xuXG4gICAgX2ZpbGVOYW1lID0gX3RoaXMuZWwucXVlcnlTZWxlY3RvcignLmZpbGUtdmlldy1uYW1lJyk7XG4gICAgX2ZpbGVTaXplID0gX3RoaXMuZWwucXVlcnlTZWxlY3RvcignLmZpbGUtdmlldy1zaXplJyk7XG4gICAgX2RlbGV0ZSA9IF90aGlzLmVsLnF1ZXJ5U2VsZWN0b3IoJy5maWxlLXZpZXctZGVsZXRlJyk7XG4gIH07XG5cbiAgX2Zvcm1hdEZpbGVTaXplID0gZnVuY3Rpb24gKHNpemUpIHtcbiAgICB2YXIgbnVtRGVjaW1hbHMsXG4gICAgICAgIHN1ZmZpeEluZGV4O1xuXG4gICAgbnVtRGVjaW1hbHMgPSAwO1xuICAgIHN1ZmZpeEluZGV4ID0gMDtcblxuICAgIHdoaWxlIChzaXplID4gMTAyNCAmJiBzdWZmaXhJbmRleCA8IF9GSUxFX1NJWkVfU1VGRklYRVMubGVuZ3RoKSB7XG4gICAgICBzaXplIC89IDEwMjQ7XG4gICAgICBzdWZmaXhJbmRleCsrO1xuICAgIH1cblxuICAgIGlmIChzaXplIC0gcGFyc2VJbnQoc2l6ZSwgMTApICE9PSAwKSB7XG4gICAgICBudW1EZWNpbWFscyA9IDE7XG4gICAgfVxuXG4gICAgcmV0dXJuIHNpemUudG9GaXhlZChudW1EZWNpbWFscykgKyBfRklMRV9TSVpFX1NVRkZJWEVTW3N1ZmZpeEluZGV4XTtcbiAgfTtcblxuICBfb25EZWxldGVDbGljayA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoX2NvbGxlY3Rpb24pIHtcbiAgICAgIF9jb2xsZWN0aW9uLnJlbW92ZShfdGhpcy5tb2RlbCk7XG4gICAgfVxuXG4gICAgX3RoaXMuZGVzdHJveSgpO1xuICB9O1xuXG4gIF91bmJpbmRFdmVudExpc3RlbmVycyA9IGZ1bmN0aW9uICgpIHtcbiAgICBfZGVsZXRlLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgX29uRGVsZXRlQ2xpY2spO1xuICB9O1xuXG5cbiAgX3RoaXMuZGVzdHJveSA9IFV0aWwuY29tcG9zZShmdW5jdGlvbiAoKSB7XG4gICAgX3VuYmluZEV2ZW50TGlzdGVuZXJzKCk7XG5cbiAgICBfY29sbGVjdGlvbiA9IG51bGw7XG4gICAgX2RlbGV0ZSA9IG51bGw7XG4gICAgX2ZpbGVOYW1lID0gbnVsbDtcbiAgICBfZmlsZVNpemUgPSBudWxsO1xuXG4gICAgX2JpbmRFdmVudExpc3RlbmVycyA9IG51bGw7XG4gICAgX2NyZWF0ZVZpZXdTa2VsZXRvbiA9IG51bGw7XG4gICAgX2Zvcm1hdEZpbGVTaXplID0gbnVsbDtcbiAgICBfb25EZWxldGVDbGljayA9IG51bGw7XG4gICAgX3VuYmluZEV2ZW50TGlzdGVuZXJzID0gbnVsbDtcblxuICAgIF9pbml0aWFsaXplID0gbnVsbDtcbiAgICBfdGhpcyA9IG51bGw7XG4gIH0sIF90aGlzLmRlc3Ryb3kpO1xuXG4gIF90aGlzLnJlbmRlciA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZmlsZTtcblxuICAgIGZpbGUgPSBfdGhpcy5tb2RlbC5nZXQoJ2ZpbGUnKTtcblxuICAgIF9maWxlTmFtZS5pbm5lckhUTUwgPSBmaWxlLm5hbWU7XG4gICAgX2ZpbGVOYW1lLnNldEF0dHJpYnV0ZSgndGl0bGUnLCBmaWxlLm5hbWUpO1xuICAgIF9maWxlTmFtZS5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCBfdGhpcy5tb2RlbC5nZXQoJ3VybCcpKTtcbiAgICBfZmlsZU5hbWUuc2V0QXR0cmlidXRlKCdkb3dubG9hZCcsIGZpbGUubmFtZSk7XG5cbiAgICBfZmlsZVNpemUuaW5uZXJIVE1MID0gJygnICsgX2Zvcm1hdEZpbGVTaXplKGZpbGUuc2l6ZSkgKyAnKSc7XG4gIH07XG5cbiAgX2luaXRpYWxpemUocGFyYW1zKTtcbiAgcGFyYW1zID0gbnVsbDtcbiAgcmV0dXJuIF90aGlzO1xufTtcblxuXG4vKipcbiAqIENsYXNzOiBGaWxlSW5wdXRWaWV3XG4gKlxuICogQHBhcmFtIHBhcmFtcyB7T2JqZWN0fVxuICogICAgICBDb25maWd1cmF0aW9uIG9wdGlvbnMuIFNlZSBfREVGQVVMVFMgZm9yIG1vcmUgZGV0YWlscy5cbiAqL1xudmFyIEZpbGVJbnB1dFZpZXcgPSBmdW5jdGlvbiAocGFyYW1zKSB7XG4gIHZhciBfdGhpcyxcbiAgICAgIF9pbml0aWFsaXplLFxuXG4gICAgICBfYnJvd3NlQnV0dG9uLFxuICAgICAgX2NhbmNlbENhbGxiYWNrLFxuICAgICAgX2NvbGxlY3Rpb24sXG4gICAgICBfY29sbGVjdGlvblZpZXcsXG4gICAgICBfZHJvcHpvbmUsXG4gICAgICBfZmlsZUlucHV0LFxuICAgICAgX2ZpbGVzQ29udGFpbmVyLFxuICAgICAgX2lvLFxuICAgICAgX21lc3NhZ2VDb250YWluZXIsXG4gICAgICBfbW9kYWwsXG4gICAgICBfdXBsb2FkQ2FsbGJhY2ssXG5cbiAgICAgIF9iaW5kRXZlbnRMaXN0ZW5lcnMsXG4gICAgICBfY3JlYXRlVmlld1NrZWxldG9uLFxuICAgICAgX2hhbmRsZUZpbGUsXG4gICAgICBfb25Ccm93c2VDbGljayxcbiAgICAgIF9vbkNhbmNlbENsaWNrLFxuICAgICAgX29uRHJhZ0xlYXZlLFxuICAgICAgX29uRHJhZ092ZXIsXG4gICAgICBfb25Ecm9wLFxuICAgICAgX29uUmVhZEVycm9yLFxuICAgICAgX29uUmVhZFN1Y2Nlc3MsXG4gICAgICBfb25VcGxvYWRDbGljayxcbiAgICAgIF9zaG93RXJyb3IsXG4gICAgICBfdW5iaW5kRXZlbnRMaXN0ZW5lcnM7XG5cblxuICAvLyBJbmhlcml0IGZyb20gcGFyZW50IGNsYXNzXG4gIF90aGlzID0gVmlldyhwYXJhbXMpO1xuXG4gIC8qKlxuICAgKiBAY29uc3RydWN0b3JcbiAgICpcbiAgICovXG4gIF9pbml0aWFsaXplID0gZnVuY3Rpb24gKHBhcmFtcykge1xuICAgIC8vIEVudW1lcmF0ZSBlYWNoIHByb3BlcnR5IGV4cGVjdGVkIHRvIGJlIGdpdmVuIGluIHBhcmFtcyBtZXRob2RcbiAgICBwYXJhbXMgPSBVdGlsLmV4dGVuZCh7fSwgX0RFRkFVTFRTLCBwYXJhbXMpO1xuXG4gICAgX2NvbGxlY3Rpb24gPSBDb2xsZWN0aW9uKFtdKTtcbiAgICBfaW8gPSBGaWxlSU8oKTtcblxuICAgIF91cGxvYWRDYWxsYmFjayA9IHBhcmFtcy51cGxvYWRDYWxsYmFjaztcbiAgICBfY2FuY2VsQ2FsbGJhY2sgPSBwYXJhbXMuY2FuY2VsQ2FsbGJhY2s7XG5cbiAgICBfY3JlYXRlVmlld1NrZWxldG9uKHBhcmFtcyk7XG4gICAgX2JpbmRFdmVudExpc3RlbmVycygpO1xuXG4gICAgX21vZGFsID0gTW9kYWxWaWV3KF90aGlzLmVsLCB7XG4gICAgICB0aXRsZTogcGFyYW1zLnRpdGxlLFxuICAgICAgYnV0dG9uczogW1xuICAgICAgICB7XG4gICAgICAgICAgdGV4dDogcGFyYW1zLnVwbG9hZFRleHQsXG4gICAgICAgICAgdGl0bGU6IHBhcmFtcy51cGxvYWRUb29sdGlwLFxuICAgICAgICAgIGNhbGxiYWNrOiBfb25VcGxvYWRDbGlja1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgdGV4dDogcGFyYW1zLmNhbmNlbFRleHQsXG4gICAgICAgICAgdGl0bGU6IHBhcmFtcy5jYW5jZWxUb29sdGlwLFxuICAgICAgICAgIGNhbGxiYWNrOiBfb25DYW5jZWxDbGlja1xuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgY2xhc3NlczogWydmaWxlLWlucHV0J11cbiAgICB9KTtcbiAgfTtcblxuXG4gIF9iaW5kRXZlbnRMaXN0ZW5lcnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgX2Ryb3B6b25lLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdsZWF2ZScsIF9vbkRyYWdMZWF2ZSk7XG4gICAgX2Ryb3B6b25lLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdvdmVyJywgX29uRHJhZ092ZXIpO1xuICAgIF9kcm9wem9uZS5hZGRFdmVudExpc3RlbmVyKCdkcm9wJywgX29uRHJvcCk7XG5cbiAgICBfYnJvd3NlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgX29uQnJvd3NlQ2xpY2spO1xuICAgIF9maWxlSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgX29uRHJvcCk7XG4gIH07XG5cbiAgX2NyZWF0ZVZpZXdTa2VsZXRvbiA9IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICB2YXIgaW50cm87XG5cbiAgICBfdGhpcy5lbC5pbm5lckhUTUwgPSBbXG4gICAgICAnPGlucHV0IHR5cGU9XCJmaWxlXCIgY2xhc3M9XCJmaWxlLWlucHV0LWlucHV0XCIgbXVsdGlwbGUvPicsXG4gICAgICAnPGRpdiBjbGFzcz1cImZpbGUtaW5wdXQtZHJvcHpvbmVcIj4nLFxuICAgICAgICAnPHNwYW4gY2xhc3M9XCJmaWxlLWlucHV0LWRyb3B6b25lLXRleHRcIj4nLFxuICAgICAgICAgIHBhcmFtcy5kcm9wem9uZVRleHQsXG4gICAgICAgICc8L3NwYW4+JyxcbiAgICAgICAgJzxidXR0b24gY2xhc3M9XCJmaWxlLWlucHV0LWJyb3dzZS1idXR0b25cIj4nLFxuICAgICAgICAgIHBhcmFtcy5icm93c2VUZXh0LFxuICAgICAgICAnPC9idXR0b24+JyxcbiAgICAgICc8L2Rpdj4nLFxuICAgICAgJzxkaXYgY2xhc3M9XCJmaWxlLWlucHV0LW1lc3NhZ2VzXCI+PC9kaXY+JyxcbiAgICAgICc8dWwgY2xhc3M9XCJmaWxlLWlucHV0LWZpbGVzIG5vLXN0eWxlXCI+PC91bD4nXG4gICAgXS5qb2luKCcnKTtcblxuICAgIGlmIChwYXJhbXMuaW50cm8pIHtcbiAgICAgIGlmIChwYXJhbXMuaW50cm8gaW5zdGFuY2VvZiBOb2RlKSB7XG4gICAgICAgIGludHJvID0gcGFyYW1zLmludHJvO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgcGFyYW1zLmludHJvID09PSAnc3RyaW5nJykge1xuICAgICAgICBpbnRybyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBpbnRyby5pbm5lckhUTUwgPSBwYXJhbXMuaW50cm87XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbnRybyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBpbnRyby5pbm5lckhUTUwgPSBwYXJhbXMuaW50cm8udGV4dCB8fCAnJztcbiAgICAgICAgaWYgKHBhcmFtcy5pbnRyby5jbGFzc2VzKSB7XG4gICAgICAgICAgaW50cm8uY2xhc3NOYW1lID0gcGFyYW1zLmludHJvLmNsYXNzZXM7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaW50cm8uY2xhc3NMaXN0LmFkZCgnZmlsZS1pbnB1dC1pbnRybycpO1xuXG4gICAgICBfdGhpcy5lbC5pbnNlcnRCZWZvcmUoaW50cm8sIF90aGlzLmVsLmZpcnN0Q2hpbGQpO1xuICAgIH1cblxuXG4gICAgX2Ryb3B6b25lID0gX3RoaXMuZWwucXVlcnlTZWxlY3RvcignLmZpbGUtaW5wdXQtZHJvcHpvbmUnKTtcbiAgICBfYnJvd3NlQnV0dG9uID0gX3RoaXMuZWwucXVlcnlTZWxlY3RvcignLmZpbGUtaW5wdXQtYnJvd3NlLWJ1dHRvbicpO1xuICAgIF9maWxlSW5wdXQgPSBfdGhpcy5lbC5xdWVyeVNlbGVjdG9yKCcuZmlsZS1pbnB1dC1pbnB1dCcpO1xuICAgIF9maWxlc0NvbnRhaW5lciA9IF90aGlzLmVsLnF1ZXJ5U2VsZWN0b3IoJy5maWxlLWlucHV0LWZpbGVzJyk7XG4gICAgX21lc3NhZ2VDb250YWluZXIgPSBfdGhpcy5lbC5xdWVyeVNlbGVjdG9yKCcuZmlsZS1pbnB1dC1tZXNzYWdlcycpO1xuXG4gICAgX2NvbGxlY3Rpb25WaWV3ID0gQ29sbGVjdGlvblZpZXcoe1xuICAgICAgY29sbGVjdGlvbjogX2NvbGxlY3Rpb24sXG4gICAgICBlbDogX2ZpbGVzQ29udGFpbmVyLFxuICAgICAgZmFjdG9yeTogRmlsZVZpZXdcbiAgICB9KTtcbiAgfTtcblxuICBfaGFuZGxlRmlsZSA9IGZ1bmN0aW9uIChmaWxlKSB7XG4gICAgdHJ5IHtcbiAgICAgIC8vIEdldCB0aGUgZGF0YSBVUkxcbiAgICAgIF9pby5yZWFkKHtcbiAgICAgICAgZmlsZTogZmlsZSxcbiAgICAgICAgc3VjY2VzczogX29uUmVhZFN1Y2Nlc3MsXG4gICAgICAgIGVycm9yOiBfb25SZWFkRXJyb3JcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIF9zaG93RXJyb3IoZS5tZXNzYWdlKTtcbiAgICB9XG4gIH07XG5cbiAgX29uQnJvd3NlQ2xpY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGV2dDtcblxuICAgIGlmIChfZmlsZUlucHV0LmNsaWNrKSB7XG4gICAgICBfZmlsZUlucHV0LmNsaWNrKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGV2dCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdIVE1MRXZlbnRzJyk7XG4gICAgICBldnQuaW5pdEV2ZW50KCdjbGljaycsIHRydWUsIHRydWUpO1xuICAgICAgX2ZpbGVJbnB1dC5kaXNwYXRjaEV2ZW50KGV2dCk7XG4gICAgfVxuICB9O1xuXG4gIF9vbkNhbmNlbENsaWNrID0gZnVuY3Rpb24gKCkge1xuICAgIF9jYW5jZWxDYWxsYmFjaygpO1xuICAgIF90aGlzLmhpZGUoKTtcbiAgfTtcblxuICBfb25EcmFnTGVhdmUgPSBmdW5jdGlvbiAoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBfZHJvcHpvbmUuY2xhc3NMaXN0LnJlbW92ZSgnZHJhZy1vdmVyJyk7XG4gIH07XG5cbiAgX29uRHJhZ092ZXIgPSBmdW5jdGlvbiAoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBlLmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0ID0gJ2NvcHknO1xuICAgIF9kcm9wem9uZS5jbGFzc0xpc3QuYWRkKCdkcmFnLW92ZXInKTtcbiAgfTtcblxuICBfb25Ecm9wID0gZnVuY3Rpb24gKGUpIHtcbiAgICB2YXIgZmlsZXMsXG4gICAgICAgIGk7XG5cbiAgICBfb25EcmFnTGVhdmUoZSk7XG5cbiAgICBmaWxlcyA9IGUudGFyZ2V0LmZpbGVzIHx8IGUuZGF0YVRyYW5zZmVyLmZpbGVzO1xuICAgIGZvciAoaSA9IDA7IGkgPCBmaWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgX2hhbmRsZUZpbGUoZmlsZXNbaV0pO1xuICAgIH1cblxuICAgIF9maWxlSW5wdXQudmFsdWUgPSAnJztcbiAgfTtcblxuICBfb25SZWFkRXJyb3IgPSBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgdmFyIGVycm9yO1xuXG4gICAgZXJyb3IgPSBbXG4gICAgICAnQW4gZXJyb3Igb2NjdXJyZWQgcmVhZGluZyAmbGRxdW87JywgcGFyYW1zLmZpbGUubmFtZSwgJyZyZHF1bzsuJyxcbiAgICAgICc8YnIvPicsXG4gICAgICAnPHNtYWxsPicsIHBhcmFtcy5lcnJvci5tZXNzYWdlLCAnPC9zbWFsbD4nXG4gICAgXS5qb2luKCcnKTtcblxuICAgIF9zaG93RXJyb3IoZXJyb3IpO1xuICB9O1xuXG4gIF9vblJlYWRTdWNjZXNzID0gZnVuY3Rpb24gKHBhcmFtcykge1xuICAgIHZhciBvbGRGaWxlO1xuXG4gICAgcGFyYW1zLmlkID0gcGFyYW1zLmZpbGUubmFtZTtcblxuICAgIHRyeSB7XG4gICAgICBvbGRGaWxlID0gX2NvbGxlY3Rpb24uZ2V0KHBhcmFtcy5pZCk7XG5cbiAgICAgIGlmIChvbGRGaWxlKSB7XG4gICAgICAgIG9sZEZpbGUuc2V0KHBhcmFtcyk7XG4gICAgICAgIF9zaG93RXJyb3IoXG4gICAgICAgICAgJ0EgZmlsZSBuYW1lICZsZHF1bzsnICsgcGFyYW1zLmZpbGUubmFtZSArICcmcmRxdW87IHdhcyBhbHJlYWR5ICcgK1xuICAgICAgICAgICdzZWxlY3RlZC4gVGhhdCBmaWxlIGhhcyBiZWVuIHJlcGxhY2VkIGJ5IHRoaXMgZmlsZS4gVG8gbG9hZCBib3RoICcgK1xuICAgICAgICAgICdmaWxlcywgcGxlYXNlIHJlbmFtZSBvbmUgb2YgdGhlIGZpbGVzLicsICdpbmZvJ1xuICAgICAgICApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgX2NvbGxlY3Rpb24uYWRkKE1vZGVsKHBhcmFtcykpO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIF9zaG93RXJyb3IoZS5tZXNzYWdlKTtcbiAgICB9XG4gIH07XG5cbiAgX29uVXBsb2FkQ2xpY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgX3VwbG9hZENhbGxiYWNrKF9jb2xsZWN0aW9uLmRhdGEoKS5zbGljZSgwKSk7XG4gICAgX3RoaXMuaGlkZSgpO1xuICB9O1xuXG4gIF9zaG93RXJyb3IgPSBmdW5jdGlvbiAoZXJyb3IsIHR5cGUpIHtcbiAgICBNZXNzYWdlKHtcbiAgICAgIGNvbnRhaW5lcjogX21lc3NhZ2VDb250YWluZXIsXG4gICAgICBjb250ZW50OiBlcnJvcixcblxuICAgICAgYXV0b2Nsb3NlOiBmYWxzZSxcbiAgICAgIGNsYXNzZXM6IFt0eXBlIHx8ICdlcnJvciddXG4gICAgfSk7XG4gIH07XG5cbiAgX3VuYmluZEV2ZW50TGlzdGVuZXJzID0gZnVuY3Rpb24gKCkge1xuICAgIF9kcm9wem9uZS5yZW1vdmVFdmVudExpc3RlbmVyKCdkcmFnbGVhdmUnLCBfb25EcmFnTGVhdmUpO1xuICAgIF9kcm9wem9uZS5yZW1vdmVFdmVudExpc3RlbmVyKCdkcmFnb3ZlcicsIF9vbkRyYWdPdmVyKTtcbiAgICBfZHJvcHpvbmUucmVtb3ZlRXZlbnRMaXN0ZW5lcignZHJvcCcsIF9vbkRyb3ApO1xuXG4gICAgX2Jyb3dzZUJ1dHRvbi5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIF9vbkJyb3dzZUNsaWNrKTtcbiAgICBfZmlsZUlucHV0LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIF9vbkRyb3ApO1xuICB9O1xuXG5cbiAgX3RoaXMuZGVzdHJveSA9IFV0aWwuY29tcG9zZShmdW5jdGlvbiAoKSB7XG4gICAgX3VuYmluZEV2ZW50TGlzdGVuZXJzKCk7XG5cbiAgICBfY29sbGVjdGlvblZpZXcuZGVzdHJveSgpO1xuICAgIF9jb2xsZWN0aW9uLmRlc3Ryb3koKTtcbiAgICBfaW8uZGVzdHJveSgpO1xuICAgIF9tb2RhbC5kZXN0cm95KCk7XG5cbiAgICBfYnJvd3NlQnV0dG9uID0gbnVsbDtcbiAgICBfY2FuY2VsQ2FsbGJhY2sgPSBudWxsO1xuICAgIF9jb2xsZWN0aW9uID0gbnVsbDtcbiAgICBfY29sbGVjdGlvblZpZXcgPSBudWxsO1xuICAgIF9kcm9wem9uZSA9IG51bGw7XG4gICAgX2ZpbGVJbnB1dCA9IG51bGw7XG4gICAgX2ZpbGVzQ29udGFpbmVyID0gbnVsbDtcbiAgICBfaW8gPSBudWxsO1xuICAgIF9tZXNzYWdlQ29udGFpbmVyID0gbnVsbDtcbiAgICBfbW9kYWwgPSBudWxsO1xuICAgIF91cGxvYWRDYWxsYmFjayA9IG51bGw7XG5cbiAgICBfYmluZEV2ZW50TGlzdGVuZXJzID0gbnVsbDtcbiAgICBfY3JlYXRlVmlld1NrZWxldG9uID0gbnVsbDtcbiAgICBfaGFuZGxlRmlsZSA9IG51bGw7XG4gICAgX29uQnJvd3NlQ2xpY2sgPSBudWxsO1xuICAgIF9vbkNhbmNlbENsaWNrID0gbnVsbDtcbiAgICBfb25EcmFnTGVhdmUgPSBudWxsO1xuICAgIF9vbkRyYWdPdmVyID0gbnVsbDtcbiAgICBfb25Ecm9wID0gbnVsbDtcbiAgICBfb25SZWFkRXJyb3IgPSBudWxsO1xuICAgIF9vblJlYWRTdWNjZXNzID0gbnVsbDtcbiAgICBfb25VcGxvYWRDbGljayA9IG51bGw7XG4gICAgX3Nob3dFcnJvciA9IG51bGw7XG4gICAgX3VuYmluZEV2ZW50TGlzdGVuZXJzID0gbnVsbDtcblxuICAgIF9pbml0aWFsaXplID0gbnVsbDtcbiAgICBfdGhpcyA9IG51bGw7XG4gIH0sIF90aGlzLmRlc3Ryb3kpO1xuXG4gIF90aGlzLmhpZGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgX21vZGFsLmhpZGUoKTtcbiAgfTtcblxuICBfdGhpcy5zaG93ID0gZnVuY3Rpb24gKGNsZWFuKSB7XG4gICAgaWYgKGNsZWFuKSB7XG4gICAgICBfY29sbGVjdGlvbi5yZXNldChbXSk7XG4gICAgICBfbWVzc2FnZUNvbnRhaW5lci5pbm5lckhUTUwgPSAnJztcbiAgICB9XG5cbiAgICBfbW9kYWwuc2hvdygpO1xuICB9O1xuXG5cbiAgLy8gQWx3YXlzIGNhbGwgdGhlIGNvbnN0cnVjdG9yXG4gIF9pbml0aWFsaXplKHBhcmFtcyk7XG4gIHBhcmFtcyA9IG51bGw7XG4gIHJldHVybiBfdGhpcztcbn07XG5cblxubW9kdWxlLmV4cG9ydHMgPSBGaWxlSW5wdXRWaWV3O1xuIiwiJ3VzZSBzdHJpY3QnO1xuLyoqXG4gKiBHZW5lcmljIGNsYXNzIGZvciBtb2RhbCBkaWFsb2cgdmlld3MuIE1vZGFsIGRpYWxvZ3MgcHJlc2VudCBhIGJsb2NraW5nXG4gKiBpbnRlcmZhY2UgdG8gdGhlIHVzZXIgYW5kIHJlcXVpcmUgdXNlci1pbnRlcmFjdGlvbiBpbiBvcmRlciB0byBiZSBjbG9zZWRcbiAqIChpLmUuIGNsaWNraW5nIGEgYnV0dG9uIGV0Yy4uLikuXG4gKlxuICogSXQgaXMgaW1wb3J0YW50IHRvIG5vdGUgdGhhdCB3aGlsZSB0aGUgaW50ZXJmYWNlIGFwcGVhcnMgYmxvY2tlZCB3aGlsZSBhXG4gKiBtb2RhbCBkaWFsb2cgaXMgb3BlbiwgSmF2YXNjcmlwdCBjb250aW51ZXMgdG8gZXhlY3V0ZSBpbiB0aGUgYmFja2dyb3VuZC5cbiAqXG4gKiBPbmx5IG9uZSBtb2RhbCBkaWFsb2cgY2FuIGJlIHZpc2libGUgYXQgYW55IGdpdmVuIHRpbWUuXG4gKlxuICogSWYgYSBzZWNvbmQgbW9kYWwgZGlhbG9nIGlzIG9wZW5lZCB3aGlsZSB0aGUgZmlyc3QgbW9kYWwgZGlhbG9nIGlzIHN0aWxsXG4gKiB2aXNpYmxlLCB0aGUgZmlyc3QgbW9kYWwgZGlhbG9nIGlzIGhpZGRlbiBhbmQgdGhlIHNlY29uZCBpcyBzaG93bi4gVXBvblxuICogY2xvc2luZyB0aGUgc2Vjb25kIG1vZGFsIGRpYWxvZywgdGhlIGZpcnN0IG1vZGFsIGRpYWxvZyBpcyByZS1zaG93biAodW5sZXNzXG4gKiB0aGUgXCJjbGVhclwiIG1ldGhvZCBpcyBwYXNzZWQgdG8gdGhlIGhpZGUgbWV0aG9kKS4gVGhpcyBwcm9jZXNzIGNvbnRpbnVlcyBpbiBhXG4gKiBsYXN0LWluLCBmaXJzdC1vdXQgKHN0YWNrKSBvcmRlcmluZyB1bnRpbCBhbGwgbW9kYWwgZGlhbG9ncyBhcmUgY2xvc2VkLlxuICpcbiAqL1xuXG52YXIgVXRpbCA9IHJlcXVpcmUoJy4uL3V0aWwvVXRpbCcpLFxuICAgIFZpZXcgPSByZXF1aXJlKCcuL1ZpZXcnKTtcblxuXG52YXIgX19JTklUSUFMSVpFRF9fID0gZmFsc2UsXG4gICAgX0RJQUxPR19TVEFDSyA9IG51bGwsXG4gICAgX0ZPQ1VTX1NUQUNLID0gbnVsbCxcbiAgICBfTUFTSyA9IG51bGwsXG4gICAgX0RFRkFVTFRTID0ge1xuICAgICAgY2xvc2FibGU6IHRydWUsIC8vIFNob3VsZCBtb2RhbCBib3ggaW5jbHVkZSBsaXR0bGUgXCJYJyBpbiBjb3JuZXJcbiAgICAgIGRlc3Ryb3lPbkhpZGU6IGZhbHNlLFxuICAgICAgdGl0bGU6IGRvY3VtZW50LnRpdGxlICsgJyBTYXlzLi4uJ1xuICAgIH07XG5cbnZhciBfc3RhdGljX2luaXRpYWxpemUgPSBmdW5jdGlvbiAoKSB7XG4gIC8vIENyZWF0ZSB0aGUgZGlhbG9nIHN0YWNrXG4gIF9ESUFMT0dfU1RBQ0sgPSBbXTtcblxuICAvLyBDcmVhdGUgdGhlIGZvY3VzIHN0YWNrXG4gIF9GT0NVU19TVEFDSyA9IFtdO1xuXG4gIC8vIENyZWF0ZSB0aGUgbW9kYWwgbWFza1xuICBfTUFTSyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBfTUFTSy5jbGFzc0xpc3QuYWRkKCdtb2RhbCcpO1xuXG4gIF9fSU5JVElBTElaRURfXyA9IHRydWU7XG59O1xuXG4vLyBOb3RlOiBcInRoaXNcIiBpcyBhIHJlZmVyZW5jZSB0byB0aGUgYnV0dG9tIERPTSBlbGVtZW50IGFuZCBoYXMgYWxsIHRoZVxuLy8gICAgICAgcHJvcGVyIGF0dHJpYnV0ZXMgc2V0IG9uIGl0IHN1Y2ggdGhhdCB0aGUgaW1wbGVtZW50YXRpb24gYmVsb3cgaXNcbi8vICAgICAgIGNvcnJlY3QuIEl0IGRvZXMgKm5vdCogbmVlZCB0byB1c2UgX3RoaXMgKGFsc28gaXQncyBhIHN0YXRpYyBtZXRob2QpLlxudmFyIF9idXR0b25DYWxsYmFjayA9IGZ1bmN0aW9uIChldnQpIHtcbiAgaWYgKHRoaXMuaW5mbyAmJiB0aGlzLmluZm8uY2FsbGJhY2sgJiZcbiAgICAgIHR5cGVvZiB0aGlzLmluZm8uY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIHtcbiAgICB0aGlzLmluZm8uY2FsbGJhY2soZXZ0LCB0aGlzLm1vZGFsfHx7fSk7XG4gIH1cbn07XG5cbi8qKlxuICogUHVsbHMgdGhlIG5leHQgZWxlbWVudCBvZmYgdGhlIGZvY3VzIHN0YWNrIGFuZCBhdHRlbXB0cyB0byBzZXQgdGhlXG4gKiBmb2N1cyB0byBpdC5cbiAqXG4gKi9cbnZhciBfZm9jdXNOZXh0ID0gZnVuY3Rpb24gKCkge1xuICB2YXIgbm9kZTtcblxuICBub2RlID0gX0ZPQ1VTX1NUQUNLLnBvcCgpO1xuXG4gIGlmIChub2RlICYmIG5vZGUgaW5zdGFuY2VvZiBOb2RlICYmIG5vZGUuZm9jdXMpIHtcbiAgICBub2RlLmZvY3VzKCk7XG4gIH1cbn07XG5cbnZhciBNb2RhbFZpZXcgPSBmdW5jdGlvbiAobWVzc2FnZSwgcGFyYW1zKSB7XG4gIHZhciBfdGhpcyxcbiAgICAgIF9pbml0aWFsaXplLFxuXG4gICAgICBfYnV0dG9ucyxcbiAgICAgIF9jbGFzc2VzLFxuICAgICAgX2Nsb3NhYmxlLFxuICAgICAgX2Nsb3NlQnV0dG9uLFxuICAgICAgX2NvbnRlbnQsXG4gICAgICBfZGVzdHJveU9uSGlkZSxcbiAgICAgIF9mb290ZXIsXG4gICAgICBfbWVzc2FnZSxcbiAgICAgIF90aXRsZSxcbiAgICAgIF90aXRsZUVsLFxuXG4gICAgICBfY3JlYXRlQnV0dG9uLFxuICAgICAgX2NyZWF0ZVZpZXdTa2VsZXRvbixcbiAgICAgIF9vbktleURvd24sXG4gICAgICBfb25Nb2RhbENsaWNrO1xuXG5cbiAgcGFyYW1zID0gVXRpbC5leHRlbmQoe30sIF9ERUZBVUxUUywgcGFyYW1zKTtcbiAgX3RoaXMgPSBWaWV3KHBhcmFtcyk7XG5cbiAgX2luaXRpYWxpemUgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICBfYnV0dG9ucyA9IHBhcmFtcy5idXR0b25zO1xuICAgIF9jbGFzc2VzID0gcGFyYW1zLmNsYXNzZXM7XG4gICAgX2Nsb3NhYmxlID0gcGFyYW1zLmNsb3NhYmxlO1xuICAgIF9kZXN0cm95T25IaWRlID0gcGFyYW1zLmRlc3Ryb3lPbkhpZGU7XG4gICAgX21lc3NhZ2UgPSBtZXNzYWdlO1xuICAgIF90aXRsZSA9IHBhcmFtcy50aXRsZTtcblxuICAgIF90aGlzLmVsLm1vZGFsID0gX3RoaXM7XG5cbiAgICBfY3JlYXRlVmlld1NrZWxldG9uKCk7XG4gICAgX3RoaXMucmVuZGVyKCk7XG5cbiAgICBpZiAoIV9fSU5JVElBTElaRURfXykge1xuICAgICAgX3N0YXRpY19pbml0aWFsaXplKCk7XG4gICAgfVxuXG4gICAgcGFyYW1zID0gbnVsbDtcbiAgfTtcblxuXG4gIF9jcmVhdGVCdXR0b24gPSBmdW5jdGlvbiAoaW5mbykge1xuICAgIHZhciBpLFxuICAgICAgICBsZW4sXG4gICAgICAgIGJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpLFxuICAgICAgICBidXR0b25JbmZvO1xuXG4gICAgYnV0dG9uSW5mbyA9IFV0aWwuZXh0ZW5kKHt9LCB7XG4gICAgICBjbGFzc2VzOiBbXSxcbiAgICAgIHRleHQ6ICdDbGljayBNZScsXG4gICAgICB0aXRsZTogJycsXG4gICAgICBjYWxsYmFjazogZnVuY3Rpb24gKCkge31cbiAgICB9LCBpbmZvKTtcblxuICAgIGZvciAoaSA9IDAsIGxlbiA9IGJ1dHRvbkluZm8uY2xhc3Nlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoYnV0dG9uSW5mby5jbGFzc2VzW2ldKTtcbiAgICB9XG5cbiAgICBidXR0b24uaW5uZXJIVE1MID0gYnV0dG9uSW5mby50ZXh0O1xuXG4gICAgaWYgKGJ1dHRvbkluZm8udGl0bGUgIT09ICcnKSB7XG4gICAgICBidXR0b24uc2V0QXR0cmlidXRlKCd0aXRsZScsIGJ1dHRvbkluZm8udGl0bGUpO1xuICAgIH1cblxuICAgIGJ1dHRvbi5tb2RhbCA9IF90aGlzO1xuICAgIGJ1dHRvbi5pbmZvID0gYnV0dG9uSW5mbztcblxuICAgIGlmIChidXR0b25JbmZvLmNhbGxiYWNrKSB7XG4gICAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBfYnV0dG9uQ2FsbGJhY2spO1xuICAgIH1cblxuICAgIHJldHVybiBidXR0b247XG4gIH07XG5cbiAgX2NyZWF0ZVZpZXdTa2VsZXRvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgaGVhZGVyLCBpLCBsZW47XG5cbiAgICBVdGlsLmVtcHR5KF90aGlzLmVsKTtcbiAgICBfdGhpcy5lbC5jbGFzc0xpc3QuYWRkKCdtb2RhbC1kaWFsb2cnKTtcblxuICAgIC8vIEFkZCBjdXN0b20gY2xhc3NlcyB0byB0aGUgdmlld1xuICAgIGlmIChfY2xhc3NlcyAmJiBfY2xhc3Nlcy5sZW5ndGggPiAwKSB7XG4gICAgICBmb3IgKGkgPSAwLCBsZW4gPSBfY2xhc3Nlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBfdGhpcy5lbC5jbGFzc0xpc3QuYWRkKF9jbGFzc2VzW2ldKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoX3RpdGxlKSB7XG4gICAgICBoZWFkZXIgPSBfdGhpcy5lbC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoZWFkZXInKSk7XG4gICAgICBoZWFkZXIuY2xhc3NMaXN0LmFkZCgnbW9kYWwtaGVhZGVyJyk7XG5cbiAgICAgIF90aXRsZUVsID0gaGVhZGVyLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2gzJykpO1xuICAgICAgX3RpdGxlRWwuc2V0QXR0cmlidXRlKCd0YWJJbmRleCcsICctMScpO1xuICAgICAgX3RpdGxlRWwuY2xhc3NMaXN0LmFkZCgnbW9kYWwtdGl0bGUnKTtcblxuXG4gICAgICBpZiAoX2Nsb3NhYmxlKSB7XG4gICAgICAgIF9jbG9zZUJ1dHRvbiA9IGhlYWRlci5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJykpO1xuICAgICAgICBfY2xvc2VCdXR0b24uY2xhc3NMaXN0LmFkZCgnbW9kYWwtY2xvc2UtbGluaycpO1xuICAgICAgICBfY2xvc2VCdXR0b24uY2xhc3NMaXN0LmFkZCgnbWF0ZXJpYWwtaWNvbnMnKTtcbiAgICAgICAgX2Nsb3NlQnV0dG9uLnNldEF0dHJpYnV0ZSgndGl0bGUnLCAnQ2xvc2UnKTtcbiAgICAgICAgX2Nsb3NlQnV0dG9uLmlubmVySFRNTCA9ICdjbG9zZSc7XG4gICAgICAgIF9jbG9zZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIF90aGlzLmhpZGUpO1xuICAgICAgfVxuICAgIH0gIGVsc2Uge1xuICAgICAgX3RoaXMuZWwuY2xhc3NMaXN0LmFkZCgnbm8taGVhZGVyJyk7XG4gICAgfVxuXG4gICAgX2NvbnRlbnQgPSBfdGhpcy5lbC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzZWN0aW9uJykpO1xuICAgIF9jb250ZW50LnNldEF0dHJpYnV0ZSgndGFiSW5kZXgnLCAnLTEnKTtcbiAgICBfY29udGVudC5jbGFzc0xpc3QuYWRkKCdtb2RhbC1jb250ZW50Jyk7XG5cbiAgICBpZiAoX2J1dHRvbnMgJiYgX2J1dHRvbnMubGVuZ3RoKSB7XG4gICAgICBfZm9vdGVyID0gX3RoaXMuZWwuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZm9vdGVyJykpO1xuICAgICAgX2Zvb3Rlci5jbGFzc0xpc3QuYWRkKCdtb2RhbC1mb290ZXInKTtcbiAgICB9IGVsc2Uge1xuICAgICAgX3RoaXMuZWwuY2xhc3NMaXN0LmFkZCgnbm8tZm9vdGVyJyk7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBUaGlzIG1ldGhvZCBpcyBib3VuZCB0byB0aGUgTW9kYWxWaWV3IGluc3RhbmNlIHVzaW5nIHRoZVxuICAgKiBGdW5jdGlvbi5wcm90b3R5cGUuYmluZCBtZXRob2QsIHRodXMgdGhlIHJlZmVyZW5jZSB0byBcInRoaXNcIiBpcyBjb3JyZWN0XG4gICAqIGV2ZW4gdGhvdWdoIHRoaXMgaXMgYSBrZXlkb3duIGV2ZW50IGhhbmRsZXIuXG4gICAqXG4gICAqIEBwYXJhbSBldmVudCB7S2V5RXZlbnR9XG4gICAqICAgICAgVGhlIGV2ZW50IHRoYXQgdHJpZ2dlcmVkIHRoaXMgY2FsbC5cbiAgICovXG4gIF9vbktleURvd24gPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICBpZiAoZXZlbnQua2V5Q29kZSA9PT0gMjcpIHtcbiAgICAgIF90aGlzLmhpZGUoKTtcbiAgICB9XG4gIH07XG5cblxuICBfb25Nb2RhbENsaWNrID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgaWYgKGV2ZW50LnRhcmdldC5jbGFzc05hbWUgPT09ICdtb2RhbCcpIHtcbiAgICAgIF90aGlzLmhpZGUoKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBldmVudCBsaXN0ZW5lcnMgYW5kIGZyZWUgcmVmZXJlbmNlcy5cbiAgICpcbiAgICogWW91IHNob3VsZCBjYWxsIGhpZGUgZmlyc3QuXG4gICAqL1xuICBfdGhpcy5kZXN0cm95ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBidXR0b247XG5cbiAgICBfTUFTSy5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIF90aGlzLmhpZGUpO1xuXG4gICAgaWYgKF9idXR0b25zICYmIF9idXR0b25zLmxlbmd0aCkge1xuICAgICAgd2hpbGUgKF9mb290ZXIuY2hpbGROb2Rlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGJ1dHRvbiA9IF9mb290ZXIuZmlyc3RDaGlsZDtcbiAgICAgICAgYnV0dG9uLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgX2J1dHRvbkNhbGxiYWNrKTtcbiAgICAgICAgX2Zvb3Rlci5yZW1vdmVDaGlsZChidXR0b24pO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChfY2xvc2VCdXR0b24pIHtcbiAgICAgIF9jbG9zZUJ1dHRvbi5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIF90aGlzLmhpZGUpO1xuICAgICAgX2Nsb3NlQnV0dG9uID0gbnVsbDtcbiAgICB9XG5cbiAgICBkZWxldGUgX3RoaXMuZWwubW9kYWw7XG5cbiAgICBfZm9vdGVyID0gbnVsbDtcbiAgICBfdGl0bGVFbCA9IG51bGw7XG4gICAgX2NvbnRlbnQgPSBudWxsO1xuICAgIF9kZXN0cm95T25IaWRlID0gbnVsbDtcbiAgICBfdGhpcy5lbCA9IG51bGw7XG4gICAgX29uTW9kYWxDbGljayA9IG51bGw7XG4gIH07XG5cbiAgX3RoaXMuaGlkZSA9IGZ1bmN0aW9uIChjbGVhckFsbCkge1xuICAgIHZhciBpc1Zpc2libGU7XG5cbiAgICBpc1Zpc2libGUgPSAoX3RoaXMuZWwucGFyZW50Tm9kZSA9PT0gX01BU0spO1xuXG4gICAgaWYgKGNsZWFyQWxsID09PSB0cnVlKSB7XG4gICAgICAvLyBSZW1vdmUgYW55L2FsbCBkaWFsb2dzIGF0dGFjaGVkIHRvIF9NQVNLXG4gICAgICBVdGlsLmVtcHR5KF9NQVNLKTtcblxuICAgICAgLy8gQ2xlYXIgc3RhY2sgb2YgcHJldmlvdXMgZGlhbG9ncyB0byByZXR1cm4gdXNlciB0byBub3JtYWwgYXBwbGljYXRpb24uXG4gICAgICBfRElBTE9HX1NUQUNLLnNwbGljZSgwLCBfRElBTE9HX1NUQUNLLmxlbmd0aCk7XG5cbiAgICAgIC8vIENsZWFyIGFsbCBidXQgbGFzdCBmb2N1cyBlbGVtZW50XG4gICAgICBfRk9DVVNfU1RBQ0suc3BsaWNlKDEsIF9GT0NVU19TVEFDSy5sZW5ndGgpO1xuXG4gICAgICBfZm9jdXNOZXh0KCk7XG5cbiAgICAgIGlmIChpc1Zpc2libGUpIHsgLy8gT3IgcmF0aGVyLCB3YXMgdmlzaWJsZVxuICAgICAgICBfdGhpcy50cmlnZ2VyKCdoaWRlJywgX3RoaXMpO1xuXG4gICAgICAgIGlmIChfZGVzdHJveU9uSGlkZSkge1xuICAgICAgICAgIF90aGlzLmRlc3Ryb3koKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoaXNWaXNpYmxlKSB7XG4gICAgICAvLyBUaGlzIG1vZGFsIGlzIGN1cnJlbnRseSB2aXNpYmxlXG4gICAgICBfdGhpcy5lbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKF90aGlzLmVsKTtcblxuICAgICAgLy8gQ2hlY2sgaWYgYW55IG90aGVyIGRpYWxvZ3MgZXhpc3QgaW4gc3RhY2ssIGlmIHNvLCBzaG93IGl0XG4gICAgICBpZiAoX0RJQUxPR19TVEFDSy5sZW5ndGggPiAwKSB7XG4gICAgICAgIF9ESUFMT0dfU1RBQ0sucG9wKCkuc2hvdygpO1xuICAgICAgfVxuXG4gICAgICBfZm9jdXNOZXh0KCk7XG4gICAgICBfdGhpcy50cmlnZ2VyKCdoaWRlJywgX3RoaXMpO1xuXG4gICAgICBpZiAoX2Rlc3Ryb3lPbkhpZGUpIHtcbiAgICAgICAgX3RoaXMuZGVzdHJveSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghX01BU0suZmlyc3RDaGlsZCAmJiBfTUFTSy5wYXJlbnROb2RlKSB7XG4gICAgICAvLyBObyBtb3JlIGRpYWxvZ3MsIHJlbW92ZSB0aGUgX01BU0tcbiAgICAgIF9NQVNLLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoX01BU0spO1xuICAgICAgX01BU0sucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBfb25Nb2RhbENsaWNrKTtcblxuICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKCdiYWNrZ3JvdW5kU2Nyb2xsRGlzYWJsZScpO1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBfb25LZXlEb3duKTtcbiAgICB9XG5cbiAgICByZXR1cm4gX3RoaXM7XG4gIH07XG5cbiAgX3RoaXMucmVuZGVyID0gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgICB2YXIgbSA9IG1lc3NhZ2UgfHwgX21lc3NhZ2UsXG4gICAgICAgIGJ1dHRvbiA9IG51bGwsXG4gICAgICAgIGJ1dHRvbnMgPSBfYnV0dG9ucyB8fCBbXSxcbiAgICAgICAgaSwgbGVuID0gYnV0dG9ucy5sZW5ndGg7XG5cbiAgICAvLyBTZXQgdGhlIG1vZGFsIGRpYWxvZyBjb250ZW50XG4gICAgVXRpbC5lbXB0eShfY29udGVudCk7XG5cbiAgICBpZiAodHlwZW9mIG0gPT09ICdzdHJpbmcnKSB7XG4gICAgICBfY29udGVudC5pbm5lckhUTUwgPSBtO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIG0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJldHVybiBfdGhpcy5yZW5kZXIobShfdGhpcykpO1xuICAgIH0gZWxzZSBpZiAobSBpbnN0YW5jZW9mIE5vZGUpIHtcbiAgICAgIF9jb250ZW50LmFwcGVuZENoaWxkKG0pO1xuICAgIH1cblxuICAgIC8vIFNldCB0aGUgbW9kYWwgZGlhbG9nIHRpdGxlXG4gICAgaWYgKF90aXRsZSkge1xuICAgICAgX3RpdGxlRWwuaW5uZXJIVE1MID0gX3RpdGxlO1xuICAgIH1cblxuICAgIC8vIENsZWFyIGFueSBvbGQgZm9vdGVyIGNvbnRlbnRcbiAgICBpZiAoX2J1dHRvbnMgJiYgX2J1dHRvbnMubGVuZ3RoKSB7XG4gICAgICB3aGlsZSAoX2Zvb3Rlci5jaGlsZE5vZGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgYnV0dG9uID0gX2Zvb3Rlci5maXJzdENoaWxkO1xuICAgICAgICBVdGlsLnJlbW92ZUV2ZW50KGJ1dHRvbiwgJ2NsaWNrJywgX2J1dHRvbkNhbGxiYWNrKTtcbiAgICAgICAgX2Zvb3Rlci5yZW1vdmVDaGlsZChidXR0b24pO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFNldCBuZXcgZm9vdGVyIGNvbnRlbnRcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIF9mb290ZXIuYXBwZW5kQ2hpbGQoX2NyZWF0ZUJ1dHRvbihidXR0b25zW2ldKSk7XG4gICAgfVxuXG4gICAgX3RoaXMudHJpZ2dlcigncmVuZGVyJywgX3RoaXMpO1xuICAgIHJldHVybiBfdGhpcztcbiAgfTtcblxuICBfdGhpcy5zZXRNZXNzYWdlID0gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgICBfbWVzc2FnZSA9IG1lc3NhZ2U7XG5cbiAgICBfdGhpcy50cmlnZ2VyKCdtZXNzYWdlJywgX3RoaXMpO1xuICAgIHJldHVybiBfdGhpcztcbiAgfTtcblxuICBfdGhpcy5zZXRPcHRpb25zID0gZnVuY3Rpb24gKHBhcmFtcywgZXh0ZW5kKSB7XG4gICAgaWYgKGV4dGVuZCkge1xuICAgICAgcGFyYW1zID0gVXRpbC5leHRlbmQoe30sIHtcbiAgICAgICAgYnV0dG9uczogX2J1dHRvbnMsXG4gICAgICAgIGNsYXNzZXM6IF9jbGFzc2VzLFxuICAgICAgICBjbG9zYWJsZTogX2Nsb3NhYmxlLFxuICAgICAgICBtZXNzYWdlOiBfbWVzc2FnZSxcbiAgICAgICAgdGl0bGU6IF90aXRsZVxuICAgICAgfSwgcGFyYW1zKTtcbiAgICB9XG5cbiAgICBfYnV0dG9ucyA9IHBhcmFtcy5idXR0b25zO1xuICAgIF9jbGFzc2VzID0gcGFyYW1zLmNsYXNzZXM7XG4gICAgX2Nsb3NhYmxlID0gcGFyYW1zLmNsb3NhYmxlO1xuICAgIF9tZXNzYWdlID0gbWVzc2FnZTtcbiAgICBfdGl0bGUgPSBwYXJhbXMudGl0bGU7XG5cbiAgICBfdGhpcy50cmlnZ2VyKCdvcHRpb25zJywgX3RoaXMpO1xuICAgIHJldHVybiBfdGhpcztcbiAgfTtcblxuICBfdGhpcy5zaG93ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBvbGRDaGlsZCA9IG51bGw7XG5cbiAgICAvLyBGb3IgYWNjZXNzaWJpbGl0eSwgZm9jdXMgdGhlIHRvcCBvZiB0aGlzIG5ldyBkaWFsb2dcbiAgICBfRk9DVVNfU1RBQ0sucHVzaChkb2N1bWVudC5hY3RpdmVFbGVtZW50IHx8IGZhbHNlKTtcblxuICAgIC8vIE1hc2sgYWxyZWFkeSBoYXMgYSBkaWFsb2cgaW4gaXQsIGFkZCB0byBkaWFsb2cgc3RhY2sgYW5kIGNvbnRpbnVlXG4gICAgd2hpbGUgKF9NQVNLLmZpcnN0Q2hpbGQpIHtcbiAgICAgIG9sZENoaWxkID0gX01BU0suZmlyc3RDaGlsZDtcbiAgICAgIGlmIChvbGRDaGlsZC5tb2RhbCkge1xuICAgICAgICBfRElBTE9HX1NUQUNLLnB1c2gob2xkQ2hpbGQubW9kYWwpO1xuICAgICAgfVxuICAgICAgX01BU0sucmVtb3ZlQ2hpbGQob2xkQ2hpbGQpO1xuICAgIH1cblxuICAgIC8vIEFkZCB0aGlzIGRpYWxvZyB0byB0aGUgbWFza1xuICAgIF9NQVNLLmFwcGVuZENoaWxkKF90aGlzLmVsKTtcbiAgICBfTUFTSy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIF9vbk1vZGFsQ2xpY2spO1xuXG4gICAgLy8gU2hvdyB0aGUgbWFzayBpZiBub3QgeWV0IHZpc2libGVcbiAgICBpZiAoIV9NQVNLLnBhcmVudE5vZGUpIHtcbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoX01BU0spO1xuICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCdiYWNrZ3JvdW5kU2Nyb2xsRGlzYWJsZScpO1xuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBfb25LZXlEb3duKTtcbiAgICB9XG5cblxuICAgIGlmIChfdGl0bGUpIHtcbiAgICAgIF90aXRsZUVsLmZvY3VzKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIF9jb250ZW50LmZvY3VzKCk7XG4gICAgfVxuXG4gICAgX3RoaXMudHJpZ2dlcignc2hvdycsIF90aGlzKTtcbiAgICByZXR1cm4gX3RoaXM7XG4gIH07XG5cbiAgX2luaXRpYWxpemUoKTtcbiAgcmV0dXJuIF90aGlzO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBNb2RhbFZpZXc7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBFdmVudHMgPSByZXF1aXJlKCcuLi91dGlsL0V2ZW50cycpLFxuICAgIFV0aWwgPSByZXF1aXJlKCcuLi91dGlsL1V0aWwnKTtcblxuLyoqXG4gKiBDb25zdHJ1Y3RvclxuICpcbiAqIEBwYXJhbSBkYXRhIHtPYmplY3R9XG4gKiAgICAgIGtleS92YWx1ZSBhdHRyaWJ1dGVzIG9mIHRoaXMgbW9kZWwuXG4gKi9cbnZhciBNb2RlbCA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gIHZhciBfdGhpcyxcbiAgICAgIF9pbml0aWFsaXplLFxuXG4gICAgICBfbW9kZWw7XG5cblxuICBfdGhpcyA9IEV2ZW50cygpO1xuXG4gIF9pbml0aWFsaXplID0gZnVuY3Rpb24gKCkge1xuICAgIF9tb2RlbCA9IFV0aWwuZXh0ZW5kKHt9LCBkYXRhKTtcblxuICAgIC8vIHRyYWNrIGlkIGF0IHRvcCBsZXZlbFxuICAgIGlmIChkYXRhICYmIGRhdGEuaGFzT3duUHJvcGVydHkoJ2lkJykpIHtcbiAgICAgIF90aGlzLmlkID0gZGF0YS5pZDtcbiAgICB9XG5cbiAgICBkYXRhID0gbnVsbDtcbiAgfTtcblxuICAvKipcbiAgICogR2V0IG9uZSBvciBtb3JlIHZhbHVlcy5cbiAgICpcbiAgICogQHBhcmFtIGtleSB7U3RyaW5nfVxuICAgKiAgICAgIHRoZSB2YWx1ZSB0byBnZXQ7IHdoZW4ga2V5IGlzIHVuZGVmaW5lZCwgcmV0dXJucyB0aGUgb2JqZWN0IHdpdGggYWxsXG4gICAqICAgICAgdmFsdWVzLlxuICAgKiBAcmV0dXJuXG4gICAqICAgICAgLSBpZiBrZXkgaXMgc3BlY2lmaWVkLCB0aGUgdmFsdWUgb3IgbnVsbCBpZiBubyB2YWx1ZSBleGlzdHMuXG4gICAqICAgICAgLSB3aGVuIGtleSBpcyBub3Qgc3BlY2lmaWVkLCB0aGUgdW5kZXJseWluZyBvYmplY3QgaXMgcmV0dXJuZWQuXG4gICAqICAgICAgICAoQW55IGNoYW5nZXMgdG8gdGhpcyB1bmRlcmx5aW5nIG9iamVjdCB3aWxsIG5vdCB0cmlnZ2VyIGV2ZW50cyEhISlcbiAgICovXG4gIF90aGlzLmdldCA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICBpZiAodHlwZW9mKGtleSkgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICByZXR1cm4gX21vZGVsO1xuICAgIH1cblxuICAgIGlmIChfbW9kZWwuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgcmV0dXJuIF9tb2RlbFtrZXldO1xuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9O1xuXG4gIC8qKlxuICAgKiBVcGRhdGUgb25lIG9yIG1vcmUgdmFsdWVzLlxuICAgKlxuICAgKiBAcGFyYW0gZGF0YSB7T2JqZWN0fVxuICAgKiAgICAgIHRoZSBrZXlzIGFuZCB2YWx1ZXMgdG8gdXBkYXRlLlxuICAgKiBAcGFyYW0gb3B0aW9ucyB7T2JqZWN0fVxuICAgKiAgICAgIG9wdGlvbnMgZm9yIHRoaXMgbWV0aG9kLlxuICAgKiBAcGFyYW0gb3B0aW9ucy5zaWxlbnQge0Jvb2xlYW59XG4gICAqICAgICAgZGVmYXVsdCBmYWxzZS4gdHJ1ZSB0byBzdXBwcmVzcyBhbnkgZXZlbnRzIHRoYXQgd291bGQgb3RoZXJ3aXNlIGJlXG4gICAqICAgICAgdHJpZ2dlcmVkLlxuICAgKi9cbiAgX3RoaXMuc2V0ID0gZnVuY3Rpb24gKGRhdGEsIG9wdGlvbnMpIHtcbiAgICAvLyBkZXRlY3QgY2hhbmdlc1xuICAgIHZhciBjaGFuZ2VkID0ge30sXG4gICAgICBhbnlDaGFuZ2VkID0gZmFsc2UsXG4gICAgICBjO1xuXG4gICAgZm9yIChjIGluIGRhdGEpIHtcbiAgICAgIGlmICghX21vZGVsLmhhc093blByb3BlcnR5KGMpIHx8IF9tb2RlbFtjXSAhPT0gZGF0YVtjXSkge1xuICAgICAgICBjaGFuZ2VkW2NdID0gZGF0YVtjXTtcbiAgICAgICAgYW55Q2hhbmdlZCA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gcGVyc2lzdCBjaGFuZ2VzXG4gICAgX21vZGVsID0gVXRpbC5leHRlbmQoX21vZGVsLCBkYXRhKTtcblxuICAgIC8vIGlmIGlkIGlzIGNoYW5naW5nLCB1cGRhdGUgdGhlIG1vZGVsIGlkXG4gICAgaWYgKGRhdGEgJiYgZGF0YS5oYXNPd25Qcm9wZXJ0eSgnaWQnKSkge1xuICAgICAgX3RoaXMuaWQgPSBkYXRhLmlkO1xuICAgIH1cblxuICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMuaGFzT3duUHJvcGVydHkoJ3NpbGVudCcpICYmIG9wdGlvbnMuc2lsZW50KSB7XG4gICAgICAvLyBkb24ndCB0cmlnZ2VyIGFueSBldmVudHNcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyB0cmlnZ2VyIGV2ZW50cyBiYXNlZCBvbiBjaGFuZ2VzXG4gICAgaWYgKGFueUNoYW5nZWQgfHxcbiAgICAgICAgKG9wdGlvbnMgJiYgb3B0aW9ucy5oYXNPd25Qcm9wZXJ0eSgnZm9yY2UnKSAmJiBvcHRpb25zLmZvcmNlKSkge1xuICAgICAgZm9yIChjIGluIGNoYW5nZWQpIHtcbiAgICAgICAgLy8gZXZlbnRzIHNwZWNpZmljIHRvIGEgcHJvcGVydHlcbiAgICAgICAgX3RoaXMudHJpZ2dlcignY2hhbmdlOicgKyBjLCBjaGFuZ2VkW2NdKTtcbiAgICAgIH1cbiAgICAgIC8vIGdlbmVyaWMgZXZlbnQgZm9yIGFueSBjaGFuZ2VcbiAgICAgIF90aGlzLnRyaWdnZXIoJ2NoYW5nZScsIGNoYW5nZWQpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogT3ZlcnJpZGUgdG9KU09OIG1ldGhvZCB0byBzZXJpYWxpemUgb25seSBtb2RlbCBkYXRhLlxuICAgKi9cbiAgX3RoaXMudG9KU09OID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBqc29uID0gVXRpbC5leHRlbmQoe30sIF9tb2RlbCksXG4gICAgICAgIGtleSxcbiAgICAgICAgdmFsdWU7XG5cbiAgICBmb3IgKGtleSBpbiBqc29uKSB7XG4gICAgICB2YWx1ZSA9IGpzb25ba2V5XTtcblxuICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiZcbiAgICAgICAgICB2YWx1ZSAhPT0gbnVsbCAmJlxuICAgICAgICAgIHR5cGVvZiB2YWx1ZS50b0pTT04gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAganNvbltrZXldID0gdmFsdWUudG9KU09OKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGpzb247XG4gIH07XG5cblxuICBfaW5pdGlhbGl6ZSgpO1xuICByZXR1cm4gX3RoaXM7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1vZGVsO1xuIiwiJ3VzZSBzdHJpY3QnO1xuLyoqXG4gKiBUaGlzIGNsYXNzIHByb3ZpZGVzIGEgc2ltcGxlIHNlbGVjdCBib3ggd2lkZ2V0IGZvciBzZWxlY3RpbmcgYW4gaXRlbVxuICogb3V0IG9mIGEgY29sbGVjdGlvbi4gQmVzdCB1c2VkIG9uIHNob3J0LWlzaCBjb2xsZWN0aW9ucy5cbiAqXG4gKi9cblxudmFyIFV0aWwgPSByZXF1aXJlKCcuLi91dGlsL1V0aWwnKSxcbiAgICBWaWV3ID0gcmVxdWlyZSgnLi9WaWV3Jyk7XG5cblxudmFyIF9TRUxFQ1RfVklFV19DT1VOVEVSID0gMDtcbnZhciBfREVGQVVMVFMgPSB7XG4gIGluY2x1ZGVCbGFua09wdGlvbjogZmFsc2UsXG4gIGJsYW5rT3B0aW9uOiB7XG4gICAgdmFsdWU6ICctMScsXG4gICAgdGV4dDogJ1BsZWFzZSBzZWxlY3QmaGVsbGlwOydcbiAgfVxufTtcblxuXG52YXIgU2VsZWN0VmlldyA9IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgdmFyIF90aGlzLFxuICAgICAgX2luaXRpYWxpemUsXG5cbiAgICAgIF9ibGFua09wdGlvbixcbiAgICAgIF9jb2xsZWN0aW9uLFxuICAgICAgX2lkc3R1YixcbiAgICAgIF9pbmNsdWRlQmxhbmtPcHRpb24sXG4gICAgICBfc2VsZWN0Qm94LFxuXG4gICAgICBfY3JlYXRlQmxhbmtPcHRpb24sXG4gICAgICBfY3JlYXRlSXRlbU1hcmt1cCxcbiAgICAgIF9nZXRET01JZEZvckl0ZW0sXG4gICAgICBfZ2V0TW9kZWxJZEZvck9wdGlvbixcbiAgICAgIF9vbkNvbGxlY3Rpb25BZGQsXG4gICAgICBfb25Db2xsZWN0aW9uRGVzZWxlY3QsXG4gICAgICBfb25Db2xsZWN0aW9uUmVtb3ZlLFxuICAgICAgX29uQ29sbGVjdGlvblJlc2V0LFxuICAgICAgX29uQ29sbGVjdGlvblNlbGVjdCxcbiAgICAgIF9vblNlbGVjdEJveENoYW5nZTtcblxuXG4gIHBhcmFtcyA9IFV0aWwuZXh0ZW5kKHt9LCBfREVGQVVMVFMsIHBhcmFtcyk7XG4gIF90aGlzID0gVmlldyhwYXJhbXMpO1xuXG5cbiAgX2luaXRpYWxpemUgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICBfY29sbGVjdGlvbiA9IHBhcmFtcy5jb2xsZWN0aW9uIHx8IG51bGw7XG4gICAgX2JsYW5rT3B0aW9uID0gcGFyYW1zLmJsYW5rT3B0aW9uO1xuICAgIF9pbmNsdWRlQmxhbmtPcHRpb24gPSBwYXJhbXMuaW5jbHVkZUJsYW5rT3B0aW9uO1xuICAgIF90aGlzLmVsID0gcGFyYW1zLmVsIHx8IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NlbGVjdCcpO1xuXG4gICAgX2lkc3R1YiA9ICdzZWxlY3R2aWV3LScgKyBfU0VMRUNUX1ZJRVdfQ09VTlRFUiArICctJztcbiAgICBfU0VMRUNUX1ZJRVdfQ09VTlRFUiArPSAxO1xuXG5cbiAgICAvLyBNYWtlIGEgcHJpdmF0ZSBET00gZWxlbWVudC4gSWYgX3RoaXMuZWwgaXMgYWxyZWFkeSBhIHNlbGVjdCBET00gZWxlbWVudCxcbiAgICAvLyB0aGVuIGp1c3QgdXNlIHRoYXQsIG90aGVyd2lzZSwgY3JlYXRlIGEgbmV3IGVsZW1lbnQgYW5kIGFwcGVuZCBpdCB0b1xuICAgIC8vIF90aGlzLmVsXG4gICAgaWYgKF90aGlzLmVsLm5vZGVOYW1lID09PSAnU0VMRUNUJykge1xuICAgICAgX3NlbGVjdEJveCA9IF90aGlzLmVsO1xuICAgIH0gZWxzZSB7XG4gICAgICBfc2VsZWN0Qm94ID0gX3RoaXMuZWwuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2VsZWN0JykpO1xuICAgIH1cbiAgICBfc2VsZWN0Qm94LmNsYXNzTGlzdC5hZGQoJ3ZpZXctc2VsZWN0dmlldycpO1xuXG4gICAgLy8gQmluZCB0byBldmVudHMgb24gdGhlIGNvbGxlY3Rpb25cbiAgICBpZiAoX2NvbGxlY3Rpb24pIHtcbiAgICAgIF9jb2xsZWN0aW9uLm9uKCdhZGQnLCBfb25Db2xsZWN0aW9uQWRkLCBfdGhpcyk7XG4gICAgICBfY29sbGVjdGlvbi5vbigncmVtb3ZlJywgX29uQ29sbGVjdGlvblJlbW92ZSwgX3RoaXMpO1xuICAgICAgX2NvbGxlY3Rpb24ub24oJ3Jlc2V0JywgX29uQ29sbGVjdGlvblJlc2V0LCBfdGhpcyk7XG4gICAgICBfY29sbGVjdGlvbi5vbignc2VsZWN0JywgX29uQ29sbGVjdGlvblNlbGVjdCwgX3RoaXMpO1xuICAgICAgX2NvbGxlY3Rpb24ub24oJ2Rlc2VsZWN0JywgX29uQ29sbGVjdGlvbkRlc2VsZWN0LCBfdGhpcyk7XG4gICAgfVxuXG4gICAgLy8gQmluZCB0byBldmVudHMgb24gX3NlbGVjdEJveFxuICAgIF9zZWxlY3RCb3guYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgX29uU2VsZWN0Qm94Q2hhbmdlKTtcblxuICAgIF90aGlzLnJlbmRlcigpO1xuICAgIHBhcmFtcyA9IG51bGw7XG4gIH07XG5cblxuICBfY3JlYXRlSXRlbU1hcmt1cCA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgcmV0dXJuIFtcbiAgICAnPG9wdGlvbiAnLFxuICAgICAgICAnaWQ9XCInLCBfZ2V0RE9NSWRGb3JJdGVtKGl0ZW0pLCAnXCIgJyxcbiAgICAgICAgJ3ZhbHVlPVwiJywgaXRlbS5nZXQoJ3ZhbHVlJyksICdcIj4nLFxuICAgICAgaXRlbS5nZXQoJ2Rpc3BsYXknKSxcbiAgICAnPC9vcHRpb24+J1xuICAgIF0uam9pbignJyk7XG4gIH07XG5cbiAgX2NyZWF0ZUJsYW5rT3B0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBbXG4gICAgJzxvcHRpb24gJyxcbiAgICAgICAgJ3ZhbHVlPVwiJywgX2JsYW5rT3B0aW9uLnZhbHVlLCAnXCI+JyxcbiAgICAgIF9ibGFua09wdGlvbi50ZXh0LFxuICAgICc8L29wdGlvbj4nXG4gICAgXS5qb2luKCcnKTtcbiAgfTtcblxuICBfZ2V0RE9NSWRGb3JJdGVtID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICByZXR1cm4gX2lkc3R1YiArIGl0ZW0uZ2V0KCdpZCcpO1xuICB9O1xuXG4gIF9nZXRNb2RlbElkRm9yT3B0aW9uID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICByZXR1cm4gZWxlbWVudC5pZC5yZXBsYWNlKF9pZHN0dWIsICcnKTtcbiAgfTtcblxuICBfb25Db2xsZWN0aW9uQWRkID0gZnVuY3Rpb24gKCkge1xuICAgIF90aGlzLnJlbmRlcigpO1xuICB9O1xuXG4gIF9vbkNvbGxlY3Rpb25EZXNlbGVjdCA9IGZ1bmN0aW9uIChvbGRTZWxlY3RlZCkge1xuICAgIHZhciBzZWxlY3RlZERPTSA9IF9zZWxlY3RCb3gucXVlcnlTZWxlY3RvcihcbiAgICAgICAgJyMnICsgX2dldERPTUlkRm9ySXRlbShvbGRTZWxlY3RlZCkpO1xuXG4gICAgaWYgKHNlbGVjdGVkRE9NKSB7XG4gICAgICBzZWxlY3RlZERPTS5yZW1vdmVBdHRyaWJ1dGUoJ3NlbGVjdGVkJyk7XG4gICAgfVxuXG4gICAgaWYgKF9pbmNsdWRlQmxhbmtPcHRpb24pIHtcbiAgICAgIHNlbGVjdGVkRE9NID0gX3NlbGVjdEJveC5xdWVyeVNlbGVjdG9yKCdbdmFsdWU9XCInICsgX2JsYW5rT3B0aW9uLnZhbHVlICsgJ1wiXScpO1xuICAgICAgaWYgKHNlbGVjdGVkRE9NKSB7XG4gICAgICAgIHNlbGVjdGVkRE9NLnNldEF0dHJpYnV0ZSgnc2VsZWN0ZWQnLCAnc2VsZWN0ZWQnKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgfTtcblxuICBfb25Db2xsZWN0aW9uUmVtb3ZlID0gZnVuY3Rpb24gKCkge1xuICAgIF90aGlzLnJlbmRlcigpO1xuICB9O1xuXG4gIF9vbkNvbGxlY3Rpb25SZXNldCA9IGZ1bmN0aW9uICgpIHtcbiAgICBfdGhpcy5yZW5kZXIoKTtcbiAgfTtcblxuICBfb25Db2xsZWN0aW9uU2VsZWN0ID0gZnVuY3Rpb24gKHNlbGVjdGVkSXRlbSkge1xuICAgIHZhciBzZWxlY3RlZERPTSA9IF9zZWxlY3RCb3gucXVlcnlTZWxlY3RvcihcbiAgICAgICAgJyMnICsgX2dldERPTUlkRm9ySXRlbShzZWxlY3RlZEl0ZW0pKTtcblxuICAgIGlmIChzZWxlY3RlZERPTSkge1xuICAgICAgc2VsZWN0ZWRET00uc2V0QXR0cmlidXRlKCdzZWxlY3RlZCcsICdzZWxlY3RlZCcpO1xuICAgIH1cbiAgfTtcblxuICBfb25TZWxlY3RCb3hDaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGVjdGVkSW5kZXggPSBfc2VsZWN0Qm94LnNlbGVjdGVkSW5kZXgsXG4gICAgICAgIHNlbGVjdGVkRE9NID0gX3NlbGVjdEJveC5jaGlsZE5vZGVzW3NlbGVjdGVkSW5kZXhdLFxuICAgICAgICBzZWxlY3RlZElkID0gX2dldE1vZGVsSWRGb3JPcHRpb24oc2VsZWN0ZWRET00pO1xuICAgIGlmIChfaW5jbHVkZUJsYW5rT3B0aW9uICYmIF9zZWxlY3RCb3gudmFsdWUgPT09IF9ibGFua09wdGlvbi52YWx1ZSkge1xuICAgICAgX2NvbGxlY3Rpb24uZGVzZWxlY3QoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgX2NvbGxlY3Rpb24uc2VsZWN0KF9jb2xsZWN0aW9uLmdldChzZWxlY3RlZElkKSk7XG4gICAgfVxuICB9O1xuXG5cbiAgX3RoaXMucmVuZGVyID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBpID0gbnVsbCxcbiAgICAgICAgaXRlbXMgPSBudWxsLFxuICAgICAgICBudW1JdGVtcyA9IG51bGwsXG4gICAgICAgIHNlbGVjdGVkID0gbnVsbCxcbiAgICAgICAgbWFya3VwID0gW107XG5cbiAgICAvLyBJZiBubyBjb2xsZWN0aW9uIGF2YWlsYWJsZSwganVzdCBjbGVhciB0aGUgb3B0aW9ucyBhbmQgcmV0dXJuXG4gICAgaWYgKCFfY29sbGVjdGlvbikge1xuICAgICAgX3NlbGVjdEJveC5pbm5lckhUTUwgPSAnJztcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBTZXQgdGhlIHNlbGVjdCBib3ggb3B0aW9uIGl0ZW1zXG4gICAgaXRlbXMgPSBfY29sbGVjdGlvbi5kYXRhKCk7XG5cbiAgICBpZiAoIWl0ZW1zKSB7XG4gICAgICBfc2VsZWN0Qm94LmlubmVySFRNTCA9ICcnO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGl0ZW1zID0gaXRlbXMuc2xpY2UoMCk7XG4gICAgbnVtSXRlbXMgPSBpdGVtcy5sZW5ndGg7XG5cbiAgICBpZiAoX2luY2x1ZGVCbGFua09wdGlvbiA9PT0gdHJ1ZSkge1xuICAgICAgbWFya3VwLnB1c2goX2NyZWF0ZUJsYW5rT3B0aW9uKCkpO1xuICAgIH1cblxuICAgIGZvciAoaSA9IDA7IGkgPCBudW1JdGVtczsgaSsrKSB7XG4gICAgICBtYXJrdXAucHVzaChfY3JlYXRlSXRlbU1hcmt1cChpdGVtc1tpXSkpO1xuICAgIH1cblxuICAgIF9zZWxlY3RCb3guaW5uZXJIVE1MID0gbWFya3VwLmpvaW4oJycpO1xuXG4gICAgLy8gTm93IHNlbGVjdCB0aGUgY3VycmVudGx5IHNlbGVjdGVkIGl0ZW0gKGlmIG9uZSBpcyBzZWxlY3RlZClcbiAgICBzZWxlY3RlZCA9IF9jb2xsZWN0aW9uLmdldFNlbGVjdGVkKCk7XG4gICAgaWYgKHNlbGVjdGVkKSB7XG4gICAgICBfb25Db2xsZWN0aW9uU2VsZWN0KHNlbGVjdGVkKTtcbiAgICB9XG4gIH07XG5cblxuICBfaW5pdGlhbGl6ZSgpO1xuICByZXR1cm4gX3RoaXM7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNlbGVjdFZpZXc7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBDb2xsZWN0aW9uID0gcmVxdWlyZSgnLi9Db2xsZWN0aW9uJyksXG5cbiAgICBFdmVudHMgPSByZXF1aXJlKCcuLi91dGlsL0V2ZW50cycpO1xuXG5cbi8qKiBjcmVhdGUgYSBuZXcgdmlldyBiYXNlZCBvbiBhIGNvbGxlY3Rpb24gb2YgbW9kZWxzLiAqL1xudmFyIFNlbGVjdGVkQ29sbGVjdGlvblZpZXcgPSBmdW5jdGlvbiAocGFyYW1zKSB7XG4gIHZhciBfdGhpcyxcbiAgICAgIF9pbml0aWFsaXplLFxuXG4gICAgICBfZGVzdHJveUNvbGxlY3Rpb247XG5cbiAgX3RoaXMgPSBFdmVudHMoKTtcblxuICAvKipcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqXG4gICAqL1xuICBfaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICBwYXJhbXMgPSBwYXJhbXMgfHwge307XG5cbiAgICAvLyBFbGVtZW50IHdoZXJlIHRoaXMgdmlldyBpcyByZW5kZXJlZFxuICAgIF90aGlzLmVsID0gKHBhcmFtcy5oYXNPd25Qcm9wZXJ0eSgnZWwnKSkgP1xuICAgICAgICBwYXJhbXMuZWwgOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblxuICAgIF90aGlzLmNvbGxlY3Rpb24gPSBwYXJhbXMuY29sbGVjdGlvbjtcblxuICAgIGlmICghX3RoaXMuY29sbGVjdGlvbikge1xuICAgICAgX3RoaXMuY29sbGVjdGlvbiA9IENvbGxlY3Rpb24oKTtcbiAgICAgIF9kZXN0cm95Q29sbGVjdGlvbiA9IHRydWU7XG4gICAgfVxuXG4gICAgaWYgKF90aGlzLmNvbGxlY3Rpb24uZ2V0U2VsZWN0ZWQoKSkge1xuICAgICAgX3RoaXMub25Db2xsZWN0aW9uU2VsZWN0KCk7XG4gICAgfVxuXG4gICAgX3RoaXMuY29sbGVjdGlvbi5vbignZGVzZWxlY3QnLCAnb25Db2xsZWN0aW9uRGVzZWxlY3QnLCBfdGhpcyk7XG4gICAgX3RoaXMuY29sbGVjdGlvbi5vbigncmVzZXQnLCAnb25Db2xsZWN0aW9uUmVzZXQnLCBfdGhpcyk7XG4gICAgX3RoaXMuY29sbGVjdGlvbi5vbignc2VsZWN0JywgJ29uQ29sbGVjdGlvblNlbGVjdCcsIF90aGlzKTtcbiAgfTtcblxuICAvKipcbiAgICogY2xlYW4gdXAgdGhlIHZpZXdcbiAgICovXG4gIF90aGlzLmRlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7XG4gICAgLy8gdW5kbyBldmVudCBiaW5kaW5nc1xuICAgIGlmIChfdGhpcy5tb2RlbCkge1xuICAgICAgX3RoaXMub25Db2xsZWN0aW9uRGVzZWxlY3QoKTtcbiAgICB9XG4gICAgX3RoaXMuY29sbGVjdGlvbi5vZmYoJ2Rlc2VsZWN0JywgJ29uQ29sbGVjdGlvbkRlc2VsZWN0JywgX3RoaXMpO1xuICAgIF90aGlzLmNvbGxlY3Rpb24ub2ZmKCdyZXNldCcsICdvbkNvbGxlY3Rpb25SZXNldCcsIF90aGlzKTtcbiAgICBfdGhpcy5jb2xsZWN0aW9uLm9mZignc2VsZWN0JywgJ29uQ29sbGVjdGlvblNlbGVjdCcsIF90aGlzKTtcblxuICAgIGlmIChfZGVzdHJveUNvbGxlY3Rpb24pIHtcbiAgICAgIF90aGlzLmNvbGxlY3Rpb24uZGVzdHJveSgpO1xuICAgIH1cblxuICAgIF9kZXN0cm95Q29sbGVjdGlvbiA9IG51bGw7XG5cbiAgICBfdGhpcyA9IG51bGw7XG4gICAgX2luaXRpYWxpemUgPSBudWxsO1xuICB9O1xuXG4gIC8qKlxuICAgKiB1bnNldCB0aGUgZXZlbnQgYmluZGluZ3MgZm9yIHRoZSBjb2xsZWN0aW9uXG4gICAqL1xuICBfdGhpcy5vbkNvbGxlY3Rpb25EZXNlbGVjdCA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoX3RoaXMubW9kZWwpIHtcbiAgICAgIF90aGlzLm1vZGVsLm9mZignY2hhbmdlJywgJ3JlbmRlcicsIF90aGlzKTtcbiAgICAgIF90aGlzLm1vZGVsID0gbnVsbDtcbiAgICB9XG4gICAgX3RoaXMucmVuZGVyKHttb2RlbDogX3RoaXMubW9kZWx9KTtcbiAgfTtcblxuICAvKipcbiAgICogdW5zZXQgZXZlbnQgYmluZGluZ3MgZm9yIHRoZSBjb2xsZWN0aW9uLCBpZiBzZXQuXG4gICAqL1xuICBfdGhpcy5vbkNvbGxlY3Rpb25SZXNldCA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoX3RoaXMubW9kZWwpIHtcbiAgICAgIF90aGlzLm1vZGVsLm9mZignY2hhbmdlJywgJ3JlbmRlcicsIF90aGlzKTtcbiAgICAgIF90aGlzLm1vZGVsID0gbnVsbDtcbiAgICB9XG4gICAgX3RoaXMucmVuZGVyKHttb2RlbDogX3RoaXMubW9kZWx9KTtcbiAgfTtcblxuICAvKipcbiAgICogc2V0IGV2ZW50IGJpbmRpbmdzIGZvciB0aGUgY29sbGVjdGlvblxuICAgKi9cbiAgX3RoaXMub25Db2xsZWN0aW9uU2VsZWN0ID0gZnVuY3Rpb24gKCkge1xuICAgIF90aGlzLm1vZGVsID0gX3RoaXMuY29sbGVjdGlvbi5nZXRTZWxlY3RlZCgpO1xuICAgIF90aGlzLm1vZGVsLm9uKCdjaGFuZ2UnLCAncmVuZGVyJywgX3RoaXMpO1xuICAgIF90aGlzLnJlbmRlcih7bW9kZWw6IF90aGlzLm1vZGVsfSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIHJlbmRlciB0aGUgc2VsZWN0ZWQgbW9kZWwgaW4gdGhlIHZpZXdcbiAgICovXG4gIF90aGlzLnJlbmRlciA9IGZ1bmN0aW9uICgpIHt9O1xuXG4gIF9pbml0aWFsaXplKHBhcmFtcyk7XG4gIHBhcmFtcyA9IG51bGw7XG4gIHJldHVybiBfdGhpcztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gU2VsZWN0ZWRDb2xsZWN0aW9uVmlldztcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIENvbGxlY3Rpb24gPSByZXF1aXJlKCcuL0NvbGxlY3Rpb24nKSxcbiAgICBDb2xsZWN0aW9uU2VsZWN0Qm94ID0gcmVxdWlyZSgnLi9Db2xsZWN0aW9uU2VsZWN0Qm94JyksXG4gICAgVXRpbCA9IHJlcXVpcmUoJy4uL3V0aWwvVXRpbCcpLFxuICAgIFZpZXcgPSByZXF1aXJlKCcuL1ZpZXcnKTtcblxuLyoqXG4gKiBDb25zdHJ1Y3QgYSBTb3J0Vmlldy5cbiAqXG4gKiBTb3J0IG9iamVjdHMgY2FuIHNwZWNpZnkgYSBjdXN0b20gc29ydCBmdW5jdGlvbiAoc29ydCksXG4gKiBvciBhIHZhbHVlIHRvIGJlIHNvcnRlZCAoc29ydEJ5KSBhbmQgc29ydCBvcmRlciAoZGVzY2VuZGluZykuXG4gKlxuICogQHBhcmFtIG9wdGlvbnMge09iamVjdH1cbiAqIEBwYXJhbSBvcHRpb25zLnNvcnRzIHtBcnJheTxPYmplY3Q+fVxuICogICAgICAgIGFycmF5IG9mIHNvcnQgb2JqZWN0cywgd2l0aCBwcm9wZXJ0aWVzOlxuICogICAgICAgIC0gaWQge1N0cmluZ3xOdW1iZXJ9IHVuaXF1ZSBpZGVudGlmaWVyIGZvciBzb3J0XG4gKiAgICAgICAgLSB0aXRsZSB7U3RyaW5nfSBkaXNwbGF5IG5hbWUgZm9yIHNvcnRcbiAqICAgICAgICBBbmQ6XG4gKiAgICAgICAgLSBzb3J0IHtGdW5jdGlvbihhLCBiKX0gc29ydGluZyBmdW5jdGlvbi5cbiAqICAgICAgICBPcjpcbiAqICAgICAgICAtIHNvcnRCeSB7RnVuY3Rpb24oT2JqZWN0KX0gcmV0dXJuIHZhbHVlIGZvciBzb3J0aW5nLlxuICogICAgICAgIC0gZGVzY2VuZGluZyB7Qm9vbGVhbn0gZGVmYXVsdCBmYWxzZSwgd2hldGhlciB0b1xuICogICAgICAgICAgc29ydCBhc2NlbmRpbmcgKHRydWUpIG9yIGRlc2NlbmRpbmcgKGZhbHNlKS5cbiAqIEBwYXJhbSBvcHRpb25zLmRlZmF1bHRTb3J0IHtJRH1cbiAqICAgICAgICBPcHRpb25hbC5cbiAqICAgICAgICBJZiBzcGVjaWZpZWQsIHNob3VsZCBtYXRjaCBcImlkXCIgb2YgYSBzb3J0IG9iamVjdC5cbiAqIEBzZWUgbXZjL1ZpZXdcbiAqL1xudmFyIFNvcnRWaWV3ID0gZnVuY3Rpb24gKHBhcmFtcykge1xuICB2YXIgX3RoaXMsXG4gICAgICBfaW5pdGlhbGl6ZSxcblxuICAgICAgX2NvbGxlY3Rpb24sXG4gICAgICBfc2VsZWN0VmlldyxcbiAgICAgIF9zb3J0Q29sbGVjdGlvbixcblxuICAgICAgX2dldFNvcnRGdW5jdGlvbixcbiAgICAgIF9vblNlbGVjdDtcblxuXG4gIF90aGlzID0gVmlldyhwYXJhbXMpO1xuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplIHRoZSBTb3J0Vmlldy5cbiAgICovXG4gIF9pbml0aWFsaXplID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBlbCA9IF90aGlzLmVsO1xuXG4gICAgX2NvbGxlY3Rpb24gPSBwYXJhbXMuY29sbGVjdGlvbjtcblxuICAgIGVsLmlubmVySFRNTCA9ICc8bGFiZWw+U29ydCBieSA8c2VsZWN0Pjwvc2VsZWN0PjwvbGFiZWw+JztcbiAgICBlbC5jbGFzc0xpc3QuYWRkKCdzb3J0dmlldycpO1xuXG4gICAgX3NvcnRDb2xsZWN0aW9uID0gbmV3IENvbGxlY3Rpb24ocGFyYW1zLnNvcnRzKTtcbiAgICBfc29ydENvbGxlY3Rpb24ub24oJ3NlbGVjdCcsIF9vblNlbGVjdCwgdGhpcyk7XG5cbiAgICAvLyBpbml0aWFsIHNvcnQgb3JkZXJcbiAgICBpZiAocGFyYW1zLmRlZmF1bHRTb3J0KSB7XG4gICAgICBfc29ydENvbGxlY3Rpb24uc2VsZWN0KF9zb3J0Q29sbGVjdGlvbi5nZXQocGFyYW1zLmRlZmF1bHRTb3J0KSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIF9zb3J0Q29sbGVjdGlvbi5zZWxlY3QoX3NvcnRDb2xsZWN0aW9uLmRhdGEoKVswXSk7XG4gICAgfVxuXG4gICAgX3NlbGVjdFZpZXcgPSBuZXcgQ29sbGVjdGlvblNlbGVjdEJveCh7XG4gICAgICBlbDogZWwucXVlcnlTZWxlY3Rvcignc2VsZWN0JyksXG4gICAgICBjb2xsZWN0aW9uOiBfc29ydENvbGxlY3Rpb24sXG4gICAgICBmb3JtYXQ6IGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgIHJldHVybiBpdGVtLnRpdGxlO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcGFyYW1zID0gbnVsbDtcbiAgfTtcblxuXG4gIC8qKlxuICAgKiBDb252ZXJ0IGEgc29ydEJ5IGZ1bmN0aW9uIHRvIGEgc29ydCBmdW5jdGlvbi5cbiAgICpcbiAgICogQHBhcmFtIHNvcnRCeSB7RnVuY3Rpb24oT2JqZWN0KX1cbiAgICogICAgICAgIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBzb3J0IGtleS5cbiAgICogQHBhcmFtIGRlc2NlbmRpbmcge0Jvb2xlYW59XG4gICAqICAgICAgICBEZWZhdWx0IGZhbHNlLlxuICAgKiAgICAgICAgV2hldGhlciB0byBzb3J0IGFzY2VuZGluZyAoZmFsc2UpIG9yIGRlc2NlbmRpbmcgKHRydWUpLlxuICAgKiBAcmV0dXJuIHtGdW5jdGlvbihhLCBiKX0gc29ydCBmdW5jdGlvbi5cbiAgICovXG4gIF9nZXRTb3J0RnVuY3Rpb24gPSBmdW5jdGlvbiAoc29ydEJ5LCBkZXNjZW5kaW5nKSB7XG4gICAgdmFyIGNhY2hlID0ge307XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgIHZhciBhdmFsID0gY2FjaGVbYS5pZF0sXG4gICAgICAgICAgYnZhbCA9IGNhY2hlW2IuaWRdLFxuICAgICAgICAgIHRtcDtcblxuICAgICAgaWYgKCFhdmFsKSB7XG4gICAgICAgIGF2YWwgPSBjYWNoZVthLmlkXSA9IHNvcnRCeShhKTtcbiAgICAgIH1cbiAgICAgIGlmICghYnZhbCkge1xuICAgICAgICBidmFsID0gY2FjaGVbYi5pZF0gPSBzb3J0QnkoYik7XG4gICAgICB9XG5cbiAgICAgIGlmIChkZXNjZW5kaW5nKSB7XG4gICAgICAgIC8vIHN3YXAgY29tcGFyaXNvbiBvcmRlclxuICAgICAgICB0bXAgPSBidmFsO1xuICAgICAgICBidmFsID0gYXZhbDtcbiAgICAgICAgYXZhbCA9IHRtcDtcbiAgICAgIH1cblxuICAgICAgaWYgKGF2YWwgPCBidmFsKSB7XG4gICAgICAgIHJldHVybiAtMTtcbiAgICAgIH0gZWxzZSBpZiAoYXZhbCA+IGJ2YWwpIHtcbiAgICAgICAgcmV0dXJuIDE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gMDtcbiAgICAgIH1cbiAgICB9O1xuICB9O1xuXG4gIC8qKlxuICAgKiBIYW5kbGUgc29ydCBjb2xsZWN0aW9uIHNlbGVjdCBldmVudC5cbiAgICovXG4gIF9vblNlbGVjdCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZWN0ZWQgPSBfc29ydENvbGxlY3Rpb24uZ2V0U2VsZWN0ZWQoKSxcbiAgICAgICAgc29ydDtcblxuICAgIGlmIChzZWxlY3RlZCkge1xuICAgICAgc29ydCA9IHNlbGVjdGVkLnNvcnQ7XG4gICAgICBpZiAoIXNvcnQpIHtcbiAgICAgICAgc29ydCA9IF9nZXRTb3J0RnVuY3Rpb24oc2VsZWN0ZWQuc29ydEJ5LCBzZWxlY3RlZC5kZXNjZW5kaW5nKTtcbiAgICAgIH1cbiAgICAgIF9jb2xsZWN0aW9uLnNvcnQoc29ydCk7XG4gICAgfVxuICB9O1xuXG5cbiAgLyoqXG4gICAqIERlc3Ryb3kgdGhlIFNvcnRWaWV3LlxuICAgKi9cbiAgX3RoaXMuZGVzdHJveSA9IFV0aWwuY29tcG9zZShmdW5jdGlvbiAoKSB7XG4gICAgX3NvcnRDb2xsZWN0aW9uLm9mZignc2VsZWN0JywgX29uU2VsZWN0LCB0aGlzKTtcbiAgICBfc29ydENvbGxlY3Rpb24gPSBudWxsO1xuICAgIF9jb2xsZWN0aW9uID0gbnVsbDtcbiAgICBfc2VsZWN0Vmlldy5kZXN0cm95KCk7XG4gIH0sIF90aGlzLmRlc3Ryb3kpO1xuXG5cbiAgX2luaXRpYWxpemUoKTtcbiAgcmV0dXJuIF90aGlzO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBTb3J0VmlldzsiLCIndXNlIHN0cmljdCc7XG4vKipcbiAqIEEgbGlnaHR3ZWlnaHQgdmlldyBjbGFzcy5cbiAqXG4gKiBQcmltYXJpbHkgbWFuYWdlcyBhbiBlbGVtZW50IHdoZXJlIGEgdmlldyBjYW4gcmVuZGVyIGl0cyBkYXRhLlxuICovXG5cblxudmFyIE1vZGVsID0gcmVxdWlyZSgnLi9Nb2RlbCcpLFxuXG4gICAgRXZlbnRzID0gcmVxdWlyZSgnLi4vdXRpbC9FdmVudHMnKSxcbiAgICBVdGlsID0gcmVxdWlyZSgnLi4vdXRpbC9VdGlsJyk7XG5cblxudmFyIF9ERUZBVUxUUyA9IHtcbn07XG5cblxuLyoqIGNyZWF0ZSBhIG5ldyB2aWV3LiAqL1xudmFyIFZpZXcgPSBmdW5jdGlvbiAocGFyYW1zKSB7XG4gIHZhciBfdGhpcyxcbiAgICAgIF9pbml0aWFsaXplLFxuXG4gICAgICBfZGVzdHJveU1vZGVsO1xuXG5cbiAgX3RoaXMgPSBFdmVudHMoKTtcblxuICAvKipcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqXG4gICAqL1xuICBfaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICBwYXJhbXMgPSBVdGlsLmV4dGVuZCh7fSwgX0RFRkFVTFRTLCBwYXJhbXMpO1xuXG4gICAgLy8gRWxlbWVudCB3aGVyZSB0aGlzIHZpZXcgaXMgcmVuZGVyZWRcbiAgICBfdGhpcy5lbCA9IChwYXJhbXMgJiYgcGFyYW1zLmhhc093blByb3BlcnR5KCdlbCcpKSA/XG4gICAgICAgIHBhcmFtcy5lbCA6IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXG4gICAgX3RoaXMubW9kZWwgPSBwYXJhbXMubW9kZWw7XG5cbiAgICBpZiAoIV90aGlzLm1vZGVsKSB7XG4gICAgICBfdGhpcy5tb2RlbCA9IE1vZGVsKHt9KTtcbiAgICAgIF9kZXN0cm95TW9kZWwgPSB0cnVlO1xuICAgIH1cblxuICAgIF90aGlzLm1vZGVsLm9uKCdjaGFuZ2UnLCAncmVuZGVyJywgX3RoaXMpO1xuICB9O1xuXG5cbiAgLyoqXG4gICAqIEFQSSBNZXRob2RcbiAgICpcbiAgICogUmVuZGVycyB0aGUgdmlld1xuICAgKi9cbiAgX3RoaXMucmVuZGVyID0gZnVuY3Rpb24gKCkge1xuICAgIC8vIEltcGVsZW1lbnRhdGlvbnMgc2hvdWxkIHVwZGF0ZSB0aGUgdmlldyBiYXNlZCBvbiB0aGUgY3VycmVudFxuICAgIC8vIG1vZGVsIHByb3BlcnRpZXMuXG4gIH07XG5cbiAgLyoqXG4gICAqIEFQSSBNZXRob2RcbiAgICpcbiAgICogQ2xlYW5zIHVwIHJlc291cmNlcyBhbGxvY2F0ZWQgYnkgdGhlIHZpZXcuIFNob3VsZCBiZSBjYWxsZWQgYmVmb3JlXG4gICAqIGRpc2NhcmRpbmcgYSB2aWV3LlxuICAgKi9cbiAgX3RoaXMuZGVzdHJveSA9IFV0aWwuY29tcG9zZShmdW5jdGlvbiAoKSB7XG4gICAgaWYgKF90aGlzID09PSAgbnVsbCkge1xuICAgICAgcmV0dXJuOyAvLyBhbHJlYWR5IGRlc3Ryb3llZFxuICAgIH1cblxuICAgIF90aGlzLm1vZGVsLm9mZignY2hhbmdlJywgJ3JlbmRlcicsIF90aGlzKTtcblxuICAgIGlmIChfZGVzdHJveU1vZGVsKSB7XG4gICAgICBfdGhpcy5tb2RlbC5kZXN0cm95KCk7XG4gICAgfVxuXG4gICAgX2Rlc3Ryb3lNb2RlbCA9IG51bGw7XG5cbiAgICBfdGhpcy5tb2RlbCA9IG51bGw7XG4gICAgX3RoaXMuZWwgPSBudWxsO1xuXG4gICAgX2luaXRpYWxpemUgPSBudWxsO1xuICAgIF90aGlzID0gbnVsbDtcbiAgfSwgX3RoaXMuZGVzdHJveSk7XG5cblxuICBfaW5pdGlhbGl6ZShwYXJhbXMpO1xuICBwYXJhbXMgPSBudWxsO1xuICByZXR1cm4gX3RoaXM7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXc7XG4iLCJjb25zdCBFdmVudHNWaWV3ID0gcmVxdWlyZSgnc2hha2VtYXAtdmlldy9ldmVudHMvRXZlbnRzVmlldycpLFxuICAgICAgICBMb2FkaW5nVmlldyA9IHJlcXVpcmUoJ3NoYWtlbWFwLXZpZXcvbG9hZGluZy9Mb2FkaW5nVmlldycpLFxuICAgICAgICBNYXBWaWV3ID0gcmVxdWlyZSgnc2hha2VtYXAtdmlldy9tYXBzL01hcFZpZXcnKSxcbiAgICAgICAgVmlldyA9IHJlcXVpcmUoJ2hhemRldi13ZWJ1dGlscy9zcmMvbXZjL1ZpZXcnKSxcbiAgICAgICAgVXRpbCA9IHJlcXVpcmUoJ2hhemRldi13ZWJ1dGlscy9zcmMvdXRpbC9VdGlsJyk7XG5cbnZhciBBcHAgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgIHZhciBfdGhpcyxcbiAgICAgICAgICAgIF9pbml0aWFsaXplO1xuXG4gICAgb3B0aW9ucyA9IFV0aWwuZXh0ZW5kKHt9LCB7fSwgb3B0aW9ucyk7XG4gICAgX3RoaXMgPSBWaWV3KG9wdGlvbnMpO1xuXG4gICAgX2luaXRpYWxpemUgPSBmdW5jdGlvbiAoLypvcHRpb25zKi8pIHtcbiAgICAgICAgX3RoaXMuZWwuY2xhc3NMaXN0LmFkZCgnc20tdmlldy1hcHAnKTtcblxuICAgICAgICBfdGhpcy5lbC5pbm5lckhUTUwgPVxuICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwibG9hZGluZy12aWV3XCI+PC9kaXY+JyArXG4gICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJldmVudHNcIj48L2Rpdj4nICtcbiAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cIm1hcC12aWV3XCIgc3R5bGU9XCJoZWlnaHQ6MTAwJTt3aWR0aDoxMDAlO3Bvc2l0aW9uOnJlbGF0aXZlO1wiPjwvZGl2Pic7XG5cbiAgICAgICAgX3RoaXMubWFwVmlldyA9IE1hcFZpZXcoe1xuICAgICAgICAgICAgZWw6IF90aGlzLmVsLnF1ZXJ5U2VsZWN0b3IoJy5tYXAtdmlldycpLFxuICAgICAgICAgICAgbW9kZWw6IF90aGlzLm1vZGVsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIF90aGlzLmV2ZW50c1ZpZXcgPSBFdmVudHNWaWV3KHtcbiAgICAgICAgICAgIGVsOiBfdGhpcy5lbC5xdWVyeVNlbGVjdG9yKCcuZXZlbnRzJyksXG4gICAgICAgICAgICBtb2RlbDogX3RoaXMubW9kZWxcbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICBfdGhpcy5sb2FkaW5nVmlldyA9IExvYWRpbmdWaWV3KHtcbiAgICAgICAgICAgIGVsOiBfdGhpcy5lbC5xdWVyeVNlbGVjdG9yKCcubG9hZGluZy12aWV3JyksXG4gICAgICAgICAgICBtb2RlbDogX3RoaXMubW9kZWxcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIF9pbml0aWFsaXplKG9wdGlvbnMpO1xuICAgIG9wdGlvbnMgPSBudWxsO1xuICAgIHJldHVybiBfdGhpcztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQXBwOyIsImNvbnN0IE1vZGVsID0gcmVxdWlyZSgnaGF6ZGV2LXdlYnV0aWxzL3NyYy9tdmMvTW9kZWwnKSxcbiAgICAgICAgVXRpbCA9IHJlcXVpcmUoJ2hhemRldi13ZWJ1dGlscy9zcmMvdXRpbC9VdGlsJyk7XG5cbnZhciBTaGFrZU1hcE1vZGVsID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICAgIHZhciBfdGhpcztcblxuICAgIF90aGlzID0gTW9kZWwoVXRpbC5leHRlbmQoe30sXG4gICAgICAgIHtwcm9kdWN0c1VybDogJy9wcm9kdWN0cy5qc29uJyxcbiAgICAgICAgICAgIGV2ZW50czogW10sXG4gICAgICAgICAgICBldmVudDogbnVsbCxcbiAgICAgICAgICAgIGxheWVyczogW10sXG4gICAgICAgICAgICBkZWZhdWx0TGF5ZXJzOiBbJ0VwaWNlbnRlcicsICdQR0EgQ29udG91cnMnXSxcbiAgICAgICAgICAgIGxvYWRpbmc6IGZhbHNlfSxcblx0XHRcdG9wdGlvbnMpKTtcblxuICAgIHJldHVybiBfdGhpcztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gU2hha2VNYXBNb2RlbDsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBfX0lOU1RBTkNFX18gPSBudWxsO1xuXG5cbnZhciBfX2lzX3N0cmluZyA9IGZ1bmN0aW9uIChvYmopIHtcbiAgcmV0dXJuICh0eXBlb2Ygb2JqID09PSAnc3RyaW5nJyB8fCBvYmogaW5zdGFuY2VvZiBTdHJpbmcpO1xufTtcblxuXG52YXIgRXZlbnRzID0gZnVuY3Rpb24gKCkge1xuICB2YXIgX3RoaXMsXG4gICAgICBfaW5pdGlhbGl6ZSxcblxuICAgICAgX2xpc3RlbmVycztcblxuXG4gIF90aGlzID0ge307XG5cbiAgX2luaXRpYWxpemUgPSBmdW5jdGlvbiAoKSB7XG4gICAgLy8gbWFwIG9mIGxpc3RlbmVycyBieSBldmVudCB0eXBlXG4gICAgX2xpc3RlbmVycyA9IHt9O1xuICB9O1xuXG5cbiAgLyoqXG4gICAqIEZyZWUgYWxsIHJlZmVyZW5jZXMuXG4gICAqL1xuICBfdGhpcy5kZXN0cm95ID0gZnVuY3Rpb24gKCkge1xuICAgIF9pbml0aWFsaXplID0gbnVsbDtcbiAgICBfbGlzdGVuZXJzID0gbnVsbDtcbiAgICBfdGhpcyA9IG51bGw7XG4gIH07XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhbiBldmVudCBsaXN0ZW5lclxuICAgKlxuICAgKiBPbWl0dGluZyBjYWxsYmFjayBjbGVhcnMgYWxsIGxpc3RlbmVycyBmb3IgZ2l2ZW4gZXZlbnQuXG4gICAqIE9taXR0aW5nIGV2ZW50IGNsZWFycyBhbGwgbGlzdGVuZXJzIGZvciBhbGwgZXZlbnRzLlxuICAgKlxuICAgKiBAcGFyYW0gZXZlbnQge1N0cmluZ31cbiAgICogICAgICBldmVudCBuYW1lIHRvIHVuYmluZC5cbiAgICogQHBhcmFtIGNhbGxiYWNrIHtGdW5jdGlvbn1cbiAgICogICAgICBjYWxsYmFjayB0byB1bmJpbmQuXG4gICAqIEBwYXJhbSBjb250ZXh0IHtPYmplY3R9XG4gICAqICAgICAgY29udGV4dCBmb3IgXCJ0aGlzXCIgd2hlbiBjYWxsYmFjayBpcyBjYWxsZWRcbiAgICovXG4gIF90aGlzLm9mZiA9IGZ1bmN0aW9uIChldnQsIGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgdmFyIGk7XG5cbiAgICBpZiAodHlwZW9mIGV2dCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIC8vIHJlbW92aW5nIGFsbCBsaXN0ZW5lcnMgb24gdGhpcyBvYmplY3RcbiAgICAgIF9saXN0ZW5lcnMgPSBudWxsO1xuICAgICAgX2xpc3RlbmVycyA9IHt9O1xuICAgIH0gZWxzZSBpZiAoIV9saXN0ZW5lcnMuaGFzT3duUHJvcGVydHkoZXZ0KSkge1xuICAgICAgLy8gbm8gbGlzdGVuZXJzLCBub3RoaW5nIHRvIGRvXG4gICAgICByZXR1cm47XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAvLyByZW1vdmluZyBhbGwgbGlzdGVuZXJzIGZvciB0aGlzIGV2ZW50XG4gICAgICBkZWxldGUgX2xpc3RlbmVyc1tldnRdO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgbGlzdGVuZXIgPSBudWxsO1xuXG4gICAgICAvLyBzZWFyY2ggZm9yIGNhbGxiYWNrIHRvIHJlbW92ZVxuICAgICAgZm9yIChpID0gX2xpc3RlbmVyc1tldnRdLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgIGxpc3RlbmVyID0gX2xpc3RlbmVyc1tldnRdW2ldO1xuXG4gICAgICAgIGlmIChsaXN0ZW5lci5jYWxsYmFjayA9PT0gY2FsbGJhY2sgJiZcbiAgICAgICAgICAgICghY29udGV4dCB8fCBsaXN0ZW5lci5jb250ZXh0ID09PSBjb250ZXh0KSkge1xuXG4gICAgICAgICAgLy8gZm91bmQgY2FsbGJhY2ssIHJlbW92ZVxuICAgICAgICAgIF9saXN0ZW5lcnNbZXZ0XS5zcGxpY2UoaSwxKTtcblxuICAgICAgICAgIGlmIChjb250ZXh0KSB7XG4gICAgICAgICAgICAvLyBmb3VuZCBjYWxsYmFjayB3aXRoIGNvbnRleHQsIHN0b3Agc2VhcmNoaW5nXG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gY2xlYW51cCBpZiBsYXN0IGNhbGxiYWNrIG9mIHRoaXMgdHlwZVxuICAgICAgaWYgKF9saXN0ZW5lcnNbZXZ0XS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgZGVsZXRlIF9saXN0ZW5lcnNbZXZ0XTtcbiAgICAgIH1cblxuICAgICAgbGlzdGVuZXIgPSBudWxsO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogQWRkIGFuIGV2ZW50IGxpc3RlbmVyXG4gICAqXG4gICAqIEBwYXJhbSBldmVudCB7U3RyaW5nfVxuICAgKiAgICAgIGV2ZW50IG5hbWUgKHNpbmd1bGFyKS4gIEUuZy4gJ3Jlc2V0J1xuICAgKiBAcGFyYW0gY2FsbGJhY2sge0Z1bmN0aW9ufVxuICAgKiAgICAgIGZ1bmN0aW9uIHRvIGNhbGwgd2hlbiBldmVudCBpcyB0cmlnZ2VyZWQuXG4gICAqIEBwYXJhbSBjb250ZXh0IHtPYmplY3R9XG4gICAqICAgICAgY29udGV4dCBmb3IgXCJ0aGlzXCIgd2hlbiBjYWxsYmFjayBpcyBjYWxsZWRcbiAgICovXG4gIF90aGlzLm9uID0gZnVuY3Rpb24gKGV2ZW50LCBjYWxsYmFjaywgY29udGV4dCkge1xuICAgIGlmICghKChjYWxsYmFjayB8fCAhY2FsbGJhY2suYXBwbHkpIHx8XG4gICAgICAgIChjb250ZXh0ICYmIF9faXNfc3RyaW5nKGNhbGxiYWNrKSAmJiBjb250ZXh0W2NhbGxiYWNrXS5hcHBseSkpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NhbGxiYWNrIHBhcmFtZXRlciBpcyBub3QgY2FsbGFibGUuJyk7XG4gICAgfVxuXG4gICAgaWYgKCFfbGlzdGVuZXJzLmhhc093blByb3BlcnR5KGV2ZW50KSkge1xuICAgICAgLy8gZmlyc3QgbGlzdGVuZXIgZm9yIGV2ZW50IHR5cGVcbiAgICAgIF9saXN0ZW5lcnNbZXZlbnRdID0gW107XG4gICAgfVxuXG4gICAgLy8gYWRkIGxpc3RlbmVyXG4gICAgX2xpc3RlbmVyc1tldmVudF0ucHVzaCh7XG4gICAgICBjYWxsYmFjazogY2FsbGJhY2ssXG4gICAgICBjb250ZXh0OiBjb250ZXh0XG4gICAgfSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFRyaWdnZXIgYW4gZXZlbnRcbiAgICpcbiAgICogQHBhcmFtIGV2ZW50IHtTdHJpbmd9XG4gICAqICAgICAgZXZlbnQgbmFtZS5cbiAgICogQHBhcmFtIGFyZ3Mge+KApn1cbiAgICogICAgICB2YXJpYWJsZSBsZW5ndGggYXJndW1lbnRzIGFmdGVyIGV2ZW50IGFyZSBwYXNzZWQgdG8gbGlzdGVuZXJzLlxuICAgKi9cbiAgX3RoaXMudHJpZ2dlciA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgIHZhciBhcmdzLFxuICAgICAgICBpLFxuICAgICAgICBsZW4sXG4gICAgICAgIGxpc3RlbmVyLFxuICAgICAgICBsaXN0ZW5lcnM7XG5cbiAgICBpZiAoX2xpc3RlbmVycy5oYXNPd25Qcm9wZXJ0eShldmVudCkpIHtcblxuICAgICAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgICBsaXN0ZW5lcnMgPSBfbGlzdGVuZXJzW2V2ZW50XS5zbGljZSgwKTtcblxuICAgICAgZm9yIChpID0gMCwgbGVuID0gbGlzdGVuZXJzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIGxpc3RlbmVyID0gbGlzdGVuZXJzW2ldO1xuXG4gICAgICAgIC8vIE5PVEU6IGlmIGxpc3RlbmVyIHRocm93cyBleGNlcHRpb24sIHRoaXMgd2lsbCBzdG9wLi4uXG4gICAgICAgIGlmIChfX2lzX3N0cmluZyhsaXN0ZW5lci5jYWxsYmFjaykpIHtcbiAgICAgICAgICBsaXN0ZW5lci5jb250ZXh0W2xpc3RlbmVyLmNhbGxiYWNrXS5hcHBseShsaXN0ZW5lci5jb250ZXh0LCBhcmdzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBsaXN0ZW5lci5jYWxsYmFjay5hcHBseShsaXN0ZW5lci5jb250ZXh0LCBhcmdzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBfaW5pdGlhbGl6ZSgpO1xuICByZXR1cm4gX3RoaXM7XG59O1xuXG4vLyBtYWtlIEV2ZW50cyBhIGdsb2JhbCBldmVudCBzb3VyY2Vcbl9fSU5TVEFOQ0VfXyA9IEV2ZW50cygpO1xuRXZlbnRzLm9uID0gZnVuY3Rpb24gX2V2ZW50c19vbiAoKSB7XG4gIHJldHVybiBfX0lOU1RBTkNFX18ub24uYXBwbHkoX19JTlNUQU5DRV9fLCBhcmd1bWVudHMpO1xufTtcbkV2ZW50cy5vZmYgPSBmdW5jdGlvbiBfZXZlbnRzX29mZiAoKSB7XG4gIHJldHVybiBfX0lOU1RBTkNFX18ub2ZmLmFwcGx5KF9fSU5TVEFOQ0VfXywgYXJndW1lbnRzKTtcbn07XG5FdmVudHMudHJpZ2dlciA9IGZ1bmN0aW9uIF9ldmVudHNfdHJpZ2dlciAoKSB7XG4gIHJldHVybiBfX0lOU1RBTkNFX18udHJpZ2dlci5hcHBseShfX0lOU1RBTkNFX18sIGFyZ3VtZW50cyk7XG59O1xuXG4vLyBpbnRlcmNlcHQgd2luZG93Lm9uaGFzaGNoYW5nZSBldmVudHMsIG9yIHNpbXVsYXRlIGlmIGJyb3dzZXIgZG9lc24ndFxuLy8gc3VwcG9ydCwgYW5kIHNlbmQgdG8gZ2xvYmFsIEV2ZW50cyBvYmplY3RcbnZhciBfb25IYXNoQ2hhbmdlID0gZnVuY3Rpb24gKGUpIHtcbiAgRXZlbnRzLnRyaWdnZXIoJ2hhc2hjaGFuZ2UnLCBlKTtcbn07XG5cbi8vIGNvdXJ0ZXN5IG9mOlxuLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy85MzM5ODY1L2dldC10aGUtaGFzaGNoYW5nZS1ldmVudC10by13b3JrLWluLWFsbC1icm93c2Vycy1pbmNsdWRpbmctaWU3XG5pZiAoISgnb25oYXNoY2hhbmdlJyBpbiB3aW5kb3cpKSB7XG4gIHZhciBvbGRIcmVmID0gZG9jdW1lbnQubG9jYXRpb24uaGFzaDtcblxuICBzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XG4gICAgaWYgKG9sZEhyZWYgIT09IGRvY3VtZW50LmxvY2F0aW9uLmhhc2gpIHtcbiAgICAgIG9sZEhyZWYgPSBkb2N1bWVudC5sb2NhdGlvbi5oYXNoO1xuICAgICAgX29uSGFzaENoYW5nZSh7XG4gICAgICAgICd0eXBlJzogJ2hhc2hjaGFuZ2UnLFxuICAgICAgICAnbmV3VVJMJzogZG9jdW1lbnQubG9jYXRpb24uaGFzaCxcbiAgICAgICAgJ29sZFVSTCc6IG9sZEhyZWZcbiAgICAgIH0pO1xuICAgIH1cbiAgfSwgMzAwKTtcblxufSBlbHNlIGlmICh3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcikge1xuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignaGFzaGNoYW5nZScsIF9vbkhhc2hDaGFuZ2UsIGZhbHNlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBFdmVudHM7XG4iLCIndXNlIHN0cmljdCc7XG5cblxudmFyIFV0aWwgPSByZXF1aXJlKCd1dGlsL1V0aWwnKTtcblxuXG4vLyBEZWZhdWx0IHZhbHVlcyB0byBiZSB1c2VkIGJ5IGNvbnN0cnVjdG9yXG52YXIgX0RFRkFVTFRTID0ge1xuICAgbWF4RmlsZVNpemU6IDIwOTcxNTIwMCAvLyAyMDBNQlxufTtcblxuXG4vKipcbiAqIENsYXNzOiBGaWxlSU9cbiAqXG4gKiBAcGFyYW0gcGFyYW1zIHtPYmplY3R9XG4gKiAgICAgIENvbmZpZ3VyYXRpb24gb3B0aW9ucy4gU2VlIF9ERUZBVUxUUyBmb3IgbW9yZSBkZXRhaWxzLlxuICovXG52YXIgRmlsZUlPID0gZnVuY3Rpb24gKHBhcmFtcykge1xuICB2YXIgX3RoaXMsXG4gICAgICBfaW5pdGlhbGl6ZSxcblxuICAgICAgX21heEZpbGVTaXplLFxuXG4gICAgICBfZ2V0UmVhZE1ldGhvZDtcblxuXG4gIC8vIEluaGVyaXQgZnJvbSBwYXJlbnQgY2xhc3NcbiAgX3RoaXMgPSB7XG4gICAgcmVhZDogbnVsbCxcbiAgICB3cml0ZTogbnVsbFxuICB9O1xuXG4gIC8qKlxuICAgKiBAY29uc3RydWN0b3JcbiAgICpcbiAgICovXG4gIF9pbml0aWFsaXplID0gZnVuY3Rpb24gKHBhcmFtcykge1xuICAgIC8vIEVudW1lcmF0ZSBlYWNoIHByb3BlcnR5IGV4cGVjdGVkIHRvIGJlIGdpdmVuIGluIHBhcmFtcyBtZXRob2RcbiAgICBwYXJhbXMgPSBVdGlsLmV4dGVuZCh7fSwgX0RFRkFVTFRTLCBwYXJhbXMpO1xuXG4gICAgX21heEZpbGVTaXplID0gcGFyYW1zLm1heEZpbGVTaXplO1xuICB9O1xuXG4gIF9nZXRSZWFkTWV0aG9kID0gZnVuY3Rpb24gKHBhcmFtcykge1xuICAgIHZhciByZWFkZXIsXG4gICAgICAgIHR5cGU7XG5cbiAgICByZWFkZXIgPSBwYXJhbXMucmVhZGVyO1xuXG4gICAgaWYgKCFwYXJhbXMuaGFzT3duUHJvcGVydHkoJ3VybCcpKSB7XG4gICAgICByZXR1cm4gcmVhZGVyLnJlYWRBc0RhdGFVUkw7XG4gICAgfSBlbHNlIGlmIChwYXJhbXMubWV0aG9kICYmIHR5cGVvZiByZWFkZXJbcGFyYW1zLm1ldGhvZF0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIC8vIElmIHNwZWNpZmljIG1ldGhvZCBpcyByZXF1ZXN0ZWQgdGhlbiB1c2UgaXRcbiAgICAgIHJldHVybiByZWFkZXJbcGFyYW1zLm1ldGhvZF07XG4gICAgfVxuXG4gICAgLy8gVHJ5IHRvIGNob29zZSBhIGRlY2VudCBtZXRob2QgYmFzZWQgb24gZmlsZSB0eXBlXG4gICAgdHlwZSA9IHBhcmFtcy5maWxlLnR5cGU7XG5cbiAgICBpZiAodHlwZS5pbmRleE9mKCd0ZXh0JykgIT09IC0xIHx8IHR5cGUuaW5kZXhPZigndHh0JykgIT09IC0xIHx8XG4gICAgICAgIHR5cGUgPT09ICdhcHBsaWNhdGlvbi94bWwnIHx8IHR5cGUgPT09ICdhcHBsaWNhdGlvbi9qc29uJykge1xuICAgICAgcmV0dXJuIHJlYWRlci5yZWFkQXNUZXh0O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gcmVhZGVyLnJlYWRBc0JpbmFyeVN0cmluZztcbiAgICB9XG4gIH07XG5cblxuICBfdGhpcy5kZXN0cm95ID0gZnVuY3Rpb24gKCkge1xuICAgIF9tYXhGaWxlU2l6ZSA9IG51bGw7XG5cbiAgICBfZ2V0UmVhZE1ldGhvZCA9IG51bGw7XG5cbiAgICBfaW5pdGlhbGl6ZSA9IG51bGw7XG4gICAgX3RoaXMgPSBudWxsO1xuICB9O1xuXG4gIC8qKlxuICAgKiBBc3luY2hyb25vdXNseSByZWFkIGZpbGUgY29udGVudHMuIFRoaXMgbWV0aG9kIGhhcyBubyByZXR1cm4gdmFsdWUuXG4gICAqXG4gICAqIEBwYXJhbSBwYXJhbXMge09iamVjdH1cbiAgICogICAgICBQYXJhbWV0ZXJzIGdpdmVuIHRvIHRoZSBtZXRob2QgaW5jbHVkaW5nOlxuICAgKiAgICAgICdmaWxlJzoge0ZpbGV9IFRoZSBmaWxlIG9iamVjdCB0byByZWFkXG4gICAqICAgICAgJ3N1Y2Nlc3MnOiB7RnVuY3Rpb259IENhbGxiYWNrIG1ldGhvZCB0byBleGVjdXRlIG9uIHN1Y2Nlc3MuXG4gICAqICAgICAgJ2Vycm9yJzoge0Z1bmN0aW9ufSBDYWxsYmFjayBtZXRob2QgdG8gZXhlY3V0ZSBvbiBlcnJvci5cbiAgICogICAgICAncmVhZGVyJzoge0ZpbGVSZWFkZXJ9IFRoZSByZWFkZXIgdG8gdXNlIGZvciByZWFkaW5nLiBPcHRpb25hbC5cbiAgICogICAgICAnbWV0aG9kJzoge1N0cmluZ30gVGhlIG5hbWUgb2YgdGhlIHJlYWRlciBtZXRob2QuIE9wdGlvbmFsLlxuICAgKlxuICAgKiBAdGhyb3dzIHtFcnJvcn1cbiAgICogICAgICBJZiBwYXJhbXMuZmlsZSBpcyBub3QgcHJvdmlkZWQuXG4gICAqL1xuICBfdGhpcy5yZWFkID0gZnVuY3Rpb24gKHBhcmFtcykge1xuICAgIHZhciBtZXRob2QsXG4gICAgICAgIG9uUmVhZEVycm9yLFxuICAgICAgICBvblJlYWRTdWNjZXNzLFxuICAgICAgICBvblJlYWRDb21wbGV0ZSxcbiAgICAgICAgcmVhZGVyO1xuXG4gICAgaWYgKCFwYXJhbXMgfHwgIXBhcmFtcy5maWxlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1BhcmFtZXRlcnMgYXJlIHJlcXVpcmVkIGZvciByZWFkaW5nLicpO1xuICAgIH1cblxuICAgIGlmIChwYXJhbXMuZmlsZS5zaXplID4gX21heEZpbGVTaXplKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ZpbGUgc2l6ZSBpcyB0b28gbGFyZ2UuJyk7XG4gICAgfVxuXG4gICAgcmVhZGVyID0gcGFyYW1zLnJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG4gICAgbWV0aG9kID0gX2dldFJlYWRNZXRob2QocGFyYW1zKTtcblxuICAgIG9uUmVhZENvbXBsZXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKHBhcmFtcy5zdWNjZXNzKSB7XG4gICAgICAgIHJlYWRlci5yZW1vdmVFdmVudExpc3RlbmVyKCdsb2FkJywgb25SZWFkU3VjY2Vzcyk7XG4gICAgICAgIG9uUmVhZFN1Y2Nlc3MgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICBpZiAocGFyYW1zLmVycm9yKSB7XG4gICAgICAgIHJlYWRlci5yZW1vdmVFdmVudExpc3RlbmVyKCdlcnJvcicsIG9uUmVhZEVycm9yKTtcbiAgICAgICAgb25SZWFkRXJyb3IgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICByZWFkZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcignbG9hZGVuZCcsIG9uUmVhZENvbXBsZXRlKTtcbiAgICAgIG9uUmVhZENvbXBsZXRlID0gbnVsbDtcblxuICAgICAgcmVhZGVyID0gbnVsbDtcbiAgICB9O1xuICAgIHJlYWRlci5hZGRFdmVudExpc3RlbmVyKCdsb2FkZW5kJywgb25SZWFkQ29tcGxldGUpO1xuXG5cbiAgICBvblJlYWRTdWNjZXNzID0gZnVuY3Rpb24gKCkge1xuXG4gICAgICBpZiAoIXBhcmFtcy51cmwpIHtcbiAgICAgICAgcGFyYW1zLnVybCA9IHJlYWRlci5yZXN1bHQ7XG4gICAgICAgIF90aGlzLnJlYWQocGFyYW1zKTtcbiAgICAgIH0gZWxzZSBpZiAocGFyYW1zLnN1Y2Nlc3MpIHtcbiAgICAgICAgcGFyYW1zLnN1Y2Nlc3Moe1xuICAgICAgICAgIGZpbGU6IHBhcmFtcy5maWxlLFxuICAgICAgICAgIGNvbnRlbnQ6IHJlYWRlci5yZXN1bHQsXG4gICAgICAgICAgbWV0aG9kOiBtZXRob2QubmFtZSxcbiAgICAgICAgICB1cmw6IHBhcmFtcy51cmxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfTtcbiAgICByZWFkZXIuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIG9uUmVhZFN1Y2Nlc3MpO1xuXG4gICAgaWYgKHBhcmFtcy5lcnJvcikge1xuICAgICAgb25SZWFkRXJyb3IgPSBmdW5jdGlvbiAoLypldmVudCovKSB7XG4gICAgICAgIHBhcmFtcy5lcnJvcih7XG4gICAgICAgICAgZXJyb3I6IHJlYWRlci5lcnJvcixcbiAgICAgICAgICBmaWxlOiBwYXJhbXMuZmlsZSxcbiAgICAgICAgICByZXN1bHQ6IHJlYWRlci5yZXN1bHRcbiAgICAgICAgfSk7XG4gICAgICB9O1xuXG4gICAgICByZWFkZXIuYWRkRXZlbnRMaXN0ZW5lcignZXJyb3InLCBvblJlYWRFcnJvcik7XG4gICAgfVxuXG4gICAgbWV0aG9kLmNhbGwocmVhZGVyLCBwYXJhbXMuZmlsZSk7XG4gIH07XG5cbiAgX3RoaXMud3JpdGUgPSBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgdmFyIGJsb2IsXG4gICAgICAgIHVybDtcblxuICAgIGlmICghcGFyYW1zIHx8ICFwYXJhbXMuY29udGVudCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdQYXJhbWV0ZXJzIGFyZSByZXF1aXJlZCBmb3Igd3JpdGluZy4nKTtcbiAgICB9XG5cbiAgICBibG9iID0gbmV3IEJsb2IoW3BhcmFtcy5jb250ZW50XSwge3R5cGU6IHBhcmFtcy50eXBlIHx8ICd0ZXh0L3BsYWluJ30pO1xuXG4gICAgaWYgKHdpbmRvdy5uYXZpZ2F0b3IgJiYgd2luZG93Lm5hdmlnYXRvci5tc1NhdmVPck9wZW5CbG9iKSB7XG4gICAgICB3aW5kb3cubmF2aWdhdG9yLm1zU2F2ZU9yT3BlbkJsb2IoYmxvYiwgcGFyYW1zLm5hbWUgfHwgJ2Rvd25sb2FkJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHVybCA9IHdpbmRvdy5VUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpO1xuICAgICAgd2luZG93Lm9wZW4odXJsLCBwYXJhbXMubmFtZSB8fCAnZG93bmxvYWQnKTtcbiAgICAgIHdpbmRvdy5VUkwucmV2b2tlT2JqZWN0VVJMKHVybCk7XG4gICAgfVxuICB9O1xuXG5cbiAgLy8gQWx3YXlzIGNhbGwgdGhlIGNvbnN0cnVjdG9yXG4gIF9pbml0aWFsaXplKHBhcmFtcyk7XG4gIHBhcmFtcyA9IG51bGw7XG4gIHJldHVybiBfdGhpcztcbn07XG5cblxubW9kdWxlLmV4cG9ydHMgPSBGaWxlSU87XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBFdmVudHMgPSByZXF1aXJlKCcuL0V2ZW50cycpO1xuXG5cbnZhciBfSURfU0VRVUVOQ0UgPSAwO1xuXG52YXIgX19nZXRfaWQgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiAnaGF6ZGV2LXdlYnV0aWxzLW1lc3NhZ2UtJyArIChfSURfU0VRVUVOQ0UrKyk7XG59O1xuXG5cbnZhciBNZXNzYWdlID0gZnVuY3Rpb24gKHBhcmFtcykge1xuICB2YXIgX3RoaXMsXG4gICAgICBfaW5pdGlhbGl6ZSxcblxuICAgICAgX2F1dG9jbG9zZSxcbiAgICAgIF9jbGFzc2VzLFxuICAgICAgX2Nsb3NlYWJsZSxcbiAgICAgIF9jbG9zZUJ1dHRvbixcbiAgICAgIF9jb250YWluZXIsXG4gICAgICBfY29udGVudCxcbiAgICAgIF9pZCxcbiAgICAgIF9pbnNlcnRCZWZvcmUsXG4gICAgICBfbWVzc2FnZSxcblxuICAgICAgX2NyZWF0ZUNsb3NlQnV0dG9uLFxuICAgICAgX29uQWxlcnRDbG9zZSxcbiAgICAgIF9zaG93O1xuXG5cbiAgX3RoaXMgPSBFdmVudHMoKTtcblxuICBfaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICBfaWQgPSBfX2dldF9pZCgpO1xuXG4gICAgX2NvbnRhaW5lciA9IHBhcmFtcy5jb250YWluZXIgfHwgZG9jdW1lbnQuYm9keTtcbiAgICBfY29udGVudCA9IHBhcmFtcy5jb250ZW50IHx8ICdTb21ldGhpbmcganVzdCBoYXBwZW5lZC4uLic7XG5cbiAgICBfYXV0b2Nsb3NlID0gcGFyc2VJbnQocGFyYW1zLmF1dG9jbG9zZSwgMTApIHx8IDA7XG4gICAgX2NsYXNzZXMgPSBbJ2FsZXJ0JywgJ3dlYnV0aWxzLW1lc3NhZ2UnXS5jb25jYXQocGFyYW1zLmNsYXNzZXMgfHwgW10pO1xuICAgIF9jbG9zZWFibGUgPSBwYXJhbXMuY2xvc2VhYmxlIHx8IHRydWU7XG4gICAgX2luc2VydEJlZm9yZSA9IHBhcmFtcy5pbnNlcnRCZWZvcmUgfHwgZmFsc2U7XG5cbiAgICBfc2hvdygpO1xuICB9O1xuXG5cbiAgX2NyZWF0ZUNsb3NlQnV0dG9uID0gZnVuY3Rpb24gKCkge1xuICAgIF9jbG9zZUJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIF9jbG9zZUJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCAnIycpO1xuICAgIF9jbG9zZUJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgJzAnKTtcbiAgICBfY2xvc2VCdXR0b24uc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgJ0Nsb3NlIEFsZXJ0Jyk7XG4gICAgX2Nsb3NlQnV0dG9uLnNldEF0dHJpYnV0ZSgnYXJpYS1jb250cm9scycsIF9pZCk7XG4gICAgX2Nsb3NlQnV0dG9uLmNsYXNzTGlzdC5hZGQoJ3dlYnV0aWxzLW1lc3NhZ2UtY2xvc2UnKTtcbiAgICBfY2xvc2VCdXR0b24uY2xhc3NMaXN0LmFkZCgnbWF0ZXJpYWwtaWNvbnMnKTtcbiAgICBfY2xvc2VCdXR0b24uaW5uZXJIVE1MID0gJ2Nsb3NlJztcblxuICAgIF9jbG9zZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIF9vbkFsZXJ0Q2xvc2UpO1xuXG4gICAgcmV0dXJuIF9jbG9zZUJ1dHRvbjtcbiAgfTtcblxuICBfb25BbGVydENsb3NlID0gZnVuY3Rpb24gKGV2dCkge1xuICAgIF90aGlzLmhpZGUodHJ1ZSk7XG4gICAgcmV0dXJuIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICB9O1xuXG4gIF9zaG93ID0gZnVuY3Rpb24gKCkge1xuICAgIF9tZXNzYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgX21lc3NhZ2Uuc2V0QXR0cmlidXRlKCdpZCcsIF9pZCk7XG4gICAgX21lc3NhZ2Uuc2V0QXR0cmlidXRlKCdyb2xlJywgJ2FsZXJ0Jyk7XG4gICAgX21lc3NhZ2Uuc2V0QXR0cmlidXRlKCdhcmlhLWxpdmUnLCAncG9saXRlJyk7XG5cbiAgICBfbWVzc2FnZS5pbm5lckhUTUwgPSBfY29udGVudDtcblxuXG4gICAgX2NsYXNzZXMuZm9yRWFjaChmdW5jdGlvbiAoY2xhc3NOYW1lKSB7XG4gICAgICBfbWVzc2FnZS5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSk7XG4gICAgfSk7XG5cbiAgICBpZiAoX2Nsb3NlYWJsZSkge1xuICAgICAgX21lc3NhZ2UuY2xhc3NMaXN0LmFkZCgnd2VidXRpbHMtbWVzc2FnZS1jbG9zZWFibGUnKTtcbiAgICAgIF9tZXNzYWdlLmFwcGVuZENoaWxkKF9jcmVhdGVDbG9zZUJ1dHRvbigpKTtcbiAgICB9XG5cbiAgICBpZiAoX2F1dG9jbG9zZSkge1xuICAgICAgd2luZG93LnNldFRpbWVvdXQoX3RoaXMuaGlkZSwgX2F1dG9jbG9zZSk7XG4gICAgfVxuXG4gICAgaWYgKF9jb250YWluZXIpIHtcbiAgICAgIGlmIChfaW5zZXJ0QmVmb3JlICYmIF9jb250YWluZXIuZmlyc3RDaGlsZCkge1xuICAgICAgICBfY29udGFpbmVyLmluc2VydEJlZm9yZShfbWVzc2FnZSwgX2NvbnRhaW5lci5maXJzdENoaWxkKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIF9jb250YWluZXIuYXBwZW5kQ2hpbGQoX21lc3NhZ2UpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuXG4gIF90aGlzLmhpZGUgPSBmdW5jdGlvbiAodXNlclRyaWdnZXJlZCkge1xuICAgICAgX21lc3NhZ2UuY2xhc3NMaXN0LmFkZCgnaW52aXNpYmxlJyk7XG5cbiAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChfbWVzc2FnZS5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgX21lc3NhZ2UucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChfbWVzc2FnZSk7XG4gICAgICAgIH1cblxuICAgICAgICBfdGhpcy50cmlnZ2VyKCdoaWRlJywge3VzZXJUcmlnZ2VyZWQ6IHVzZXJUcmlnZ2VyZWR9KTtcbiAgICAgICAgX3RoaXMuZGVzdHJveSgpO1xuICAgIH0sIDI2Mik7XG4gIH07XG5cbiAgX3RoaXMuZGVzdHJveSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoX2Nsb3NlQnV0dG9uKSB7XG4gICAgICBfY2xvc2VCdXR0b24ucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBfb25BbGVydENsb3NlKTtcbiAgICB9XG5cbiAgICBfYXV0b2Nsb3NlID0gbnVsbDtcbiAgICBfY2xhc3NlcyA9IG51bGw7XG4gICAgX2Nsb3NlYWJsZSA9IG51bGw7XG4gICAgX2Nsb3NlQnV0dG9uID0gbnVsbDtcbiAgICBfY29udGFpbmVyID0gbnVsbDtcbiAgICBfY29udGVudCA9IG51bGw7XG4gICAgX2lkID0gbnVsbDtcbiAgICBfaW5zZXJ0QmVmb3JlID0gbnVsbDtcbiAgICBfbWVzc2FnZSA9IG51bGw7XG5cbiAgICBfY3JlYXRlQ2xvc2VCdXR0b24gPSBudWxsO1xuICAgIF9vbkFsZXJ0Q2xvc2UgPSBudWxsO1xuICAgIF9zaG93ID0gbnVsbDtcblxuICAgIF9pbml0aWFsaXplID0gbnVsbDtcbiAgICBfdGhpcyA9IG51bGw7XG4gIH07XG5cblxuICBfaW5pdGlhbGl6ZShwYXJhbXMpO1xuICBwYXJhbXMgPSBudWxsO1xuICByZXR1cm4gX3RoaXM7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1lc3NhZ2U7XG4iLCIndXNlIHN0cmljdCc7XG5cbi8vIGRvIHRoZXNlIGNoZWNrcyBvbmNlLCBpbnN0ZWFkIG9mIG9uY2UgcGVyIGNhbGxcbnZhciBpc01vYmlsZSA9IGZhbHNlLFxuICAgIHN1cHBvcnRzRGF0ZUlucHV0ID0gZmFsc2U7XG5cblxuLy8gc3RhdGljIG9iamVjdCB3aXRoIHV0aWxpdHkgbWV0aG9kc1xudmFyIFV0aWwgPSBmdW5jdGlvbiAoKSB7XG59O1xuXG5cblV0aWwuaXNNb2JpbGUgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBpc01vYmlsZTtcbn07XG5cblV0aWwuc3VwcG9ydHNEYXRlSW5wdXQgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBzdXBwb3J0c0RhdGVJbnB1dDtcbn07XG5cbi8qKlxuICogTWVyZ2UgcHJvcGVydGllcyBmcm9tIGEgc2VyaWVzIG9mIG9iamVjdHMuXG4gKlxuICogQHBhcmFtIGRzdCB7T2JqZWN0fVxuICogICAgICB0YXJnZXQgd2hlcmUgbWVyZ2VkIHByb3BlcnRpZXMgYXJlIGNvcGllZCB0by5cbiAqIEBwYXJhbSA8dmFyaWFibGU+IHtPYmplY3R9XG4gKiAgICAgIHNvdXJjZSBvYmplY3RzIGZvciBwcm9wZXJ0aWVzLiBXaGVuIGEgc291cmNlIGlzIG5vbiBudWxsLCBpdCdzXG4gKiAgICAgIHByb3BlcnRpZXMgYXJlIGNvcGllZCB0byB0aGUgZHN0IG9iamVjdC4gUHJvcGVydGllcyBhcmUgY29waWVkIGluXG4gKiAgICAgIHRoZSBvcmRlciBvZiBhcmd1bWVudHM6IGEgcHJvcGVydHkgb24gYSBsYXRlciBhcmd1bWVudCBvdmVycmlkZXMgYVxuICogICAgICBwcm9wZXJ0eSBvbiBhbiBlYXJsaWVyIGFyZ3VtZW50LlxuICovXG5VdGlsLmV4dGVuZCA9IGZ1bmN0aW9uIChkc3QpIHtcbiAgdmFyIGksIGxlbiwgc3JjLCBwcm9wO1xuXG4gIC8vIGl0ZXJhdGUgb3ZlciBzb3VyY2VzIHdoZXJlIHByb3BlcnRpZXMgYXJlIHJlYWRcbiAgZm9yIChpID0gMSwgbGVuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgc3JjID0gYXJndW1lbnRzW2ldO1xuICAgIGlmIChzcmMpIHtcbiAgICAgIGZvciAocHJvcCBpbiBzcmMpIHtcbiAgICAgICAgZHN0W3Byb3BdID0gc3JjW3Byb3BdO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIHJldHVybiB1cGRhdGVkIG9iamVjdFxuICByZXR1cm4gZHN0O1xufTtcblxuLyoqXG4gKiBDaGVja3MgaWYgb2JqZWN0cyBhcmUgZXF1YWwuXG4gKlxuICogQHBhcmFtIGEge09iamVjdH1cbiAqICAgICAgT2JqZWN0IGEuXG4gKiBAcGFyYW0gYiB7T2JqZWN0fVxuICogICAgICBPYmplY3QgYi5cbiAqL1xuVXRpbC5lcXVhbHMgPSBmdW5jdGlvbiAob2JqQSwgb2JqQikge1xuICB2YXIga2V5YSwga2V5YjtcblxuICBpZiAob2JqQSA9PT0gb2JqQikge1xuICAgIC8vIGlmID09PSB0aGVuID09PSwgbm8gcXVlc3Rpb24gYWJvdXQgdGhhdC4uLlxuICAgIHJldHVybiB0cnVlO1xuICB9IGVsc2UgaWYgKG9iakEgPT09IG51bGwgfHwgb2JqQiA9PT0gbnVsbCkge1xuICAgIC8vIGZ1bm55LCB0eXBlb2YgbnVsbCA9PT0gJ29iamVjdCcsIHNvIC4uLiBobXBoIVxuICAgIHJldHVybiBmYWxzZTtcbiAgfSBlbHNlIGlmICh0eXBlb2Ygb2JqQSA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG9iakIgPT09ICdvYmplY3QnKSB7XG4gICAgLy8gcmVjdXJzaXZlbHkgY2hlY2sgb2JqZWN0c1xuICAgIGZvciAoa2V5YSBpbiBvYmpBKSB7XG4gICAgICBpZiAob2JqQS5oYXNPd25Qcm9wZXJ0eShrZXlhKSkge1xuICAgICAgICBpZiAoIW9iakIuaGFzT3duUHJvcGVydHkoa2V5YSkpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7IC8vIG9iakIgaXMgbWlzc2luZyBhIGtleSBmcm9tIG9iakFcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAoa2V5YiBpbiBvYmpCKSB7XG4gICAgICBpZiAob2JqQi5oYXNPd25Qcm9wZXJ0eShrZXliKSkge1xuICAgICAgICBpZiAoIW9iakEuaGFzT3duUHJvcGVydHkoa2V5YikpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7IC8vIG9iakEgaXMgbWlzc2luZyBhIGtleSBmcm9tIG9iakJcbiAgICAgICAgfSBlbHNlIGlmICghVXRpbC5lcXVhbHMob2JqQVtrZXliXSwgb2JqQltrZXliXSkpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7IC8vIG9iakFba2V5XSAhPT0gb2JqQltrZXldXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTsgLy8gUmVjdXJzaXZlbHkgZXF1YWwsIHNvIGVxdWFsXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG9iakEgPT09IG9iakI7IC8vIFVzZSBiYWtlZCBpbiA9PT0gZm9yIHByaW1pdGl2ZXNcbiAgfVxufTtcblxuLyoqXG4gKiBHZXQgYW4gZXZlbnQgb2JqZWN0IGZvciBhbiBldmVudCBoYW5kbGVyLlxuICpcbiAqIEBwYXJhbSBlIHRoZSBldmVudCB0aGF0IHdhcyByZWNlaXZlZCBieSB0aGUgZXZlbnQgaGFuZGxlci5cbiAqIEByZXR1cm4ge09iamVjdH1cbiAqICAgICAgd2l0aCB0d28gcHJvcGVydGllczpcbiAqICAgICAgdGFyZ2V0XG4gKiAgICAgICAgICAgdGhlIGVsZW1lbnQgd2hlcmUgdGhlIGV2ZW50IG9jY3VycmVkLlxuICogICAgICBvcmlnaW5hbEV2ZW50XG4gKiAgICAgICAgICAgdGhlIGV2ZW50IG9iamVjdCwgZWl0aGVyIHBhcmFtZXRlciBlIG9yIHdpbmRvdy5ldmVudCAoaW4gSUUpLlxuICovXG5VdGlsLmdldEV2ZW50ID0gZnVuY3Rpb24gKGUpIHtcbiAgdmFyIHRhcmc7XG5cbiAgaWYgKCFlKSB7XG4gICAgLy8gaWUgcHV0cyBldmVudCBpbiBnbG9iYWxcbiAgICBlID0gd2luZG93LmV2ZW50O1xuICB9XG5cbiAgLy8gZmluZCB0YXJnZXRcbiAgaWYgKGUudGFyZ2V0KSB7XG4gICAgdGFyZyA9IGUudGFyZ2V0O1xuICB9IGVsc2UgaWYgKGUuc3JjRWxlbWVudCkge1xuICAgIHRhcmcgPSBlLnNyY0VsZW1lbnQ7XG4gIH1cblxuICAvLyBoYW5kbGUgc2FmYXJpIGJ1Z1xuICBpZiAodGFyZy5ub2RlVHlwZSA9PT0gMykge1xuICAgIHRhcmcgPSB0YXJnLnBhcmVudE5vZGU7XG4gIH1cblxuICAvLyByZXR1cm4gdGFyZ2V0IGFuZCBldmVudFxuICByZXR1cm4ge1xuICAgIHRhcmdldDogdGFyZyxcbiAgICBvcmlnaW5hbEV2ZW50OiBlXG4gIH07XG59O1xuXG4vKipcbiAqIEdldCBhIHBhcmVudCBub2RlIGJhc2VkIG9uIGl0J3Mgbm9kZSBuYW1lLlxuICpcbiAqIEBwYXJhbSBlbCB7RE9NRWxlbWVudH1cbiAqICAgICAgZWxlbWVudCB0byBzZWFyY2ggZnJvbS5cbiAqIEBwYXJhbSBub2RlTmFtZSB7U3RyaW5nfVxuICogICAgICBub2RlIG5hbWUgdG8gc2VhcmNoIGZvci5cbiAqIEBwYXJhbSBtYXhQYXJlbnQge0RPTUVsZW1lbnR9XG4gKiAgICAgIGVsZW1lbnQgdG8gc3RvcCBzZWFyY2hpbmcuXG4gKiBAcmV0dXJuIHtET01FbGVtZW50fVxuICogICAgICBtYXRjaGluZyBlbGVtZW50LCBvciBudWxsIGlmIG5vdCBmb3VuZC5cbiAqL1xuVXRpbC5nZXRQYXJlbnROb2RlID0gZnVuY3Rpb24gKGVsLCBub2RlTmFtZSwgbWF4UGFyZW50KSB7XG4gIHZhciBjdXJQYXJlbnQgPSBlbDtcblxuICB3aGlsZSAoY3VyUGFyZW50ICYmIGN1clBhcmVudCAhPT0gbWF4UGFyZW50ICYmXG4gICAgICBjdXJQYXJlbnQubm9kZU5hbWUudG9VcHBlckNhc2UoKSAhPT0gbm9kZU5hbWUudG9VcHBlckNhc2UoKSkge1xuICAgIGN1clBhcmVudCA9IGN1clBhcmVudC5wYXJlbnROb2RlO1xuICB9XG4gIGlmIChjdXJQYXJlbnQgJiYgJ25vZGVOYW1lJyBpbiBjdXJQYXJlbnQgJiZcbiAgICAgIGN1clBhcmVudC5ub2RlTmFtZS50b1VwcGVyQ2FzZSgpID09PSBub2RlTmFtZS50b1VwcGVyQ2FzZSgpKSB7XG4gICAgLy8gZm91bmQgdGhlIGRlc2lyZWQgbm9kZVxuICAgIHJldHVybiBjdXJQYXJlbnQ7XG4gIH1cblxuICAvLyBkaWRuJ3QgZmluZCB0aGUgZGVzaXJlZCBub2RlXG4gIHJldHVybiBudWxsO1xufTtcblxuLy8gcmVtb3ZlIGFuIGVsZW1lbnRzIGNoaWxkIG5vZGVzXG5VdGlsLmVtcHR5ID0gZnVuY3Rpb24gKGVsKSB7XG4gIHdoaWxlIChlbC5maXJzdENoaWxkKSB7XG4gICAgZWwucmVtb3ZlQ2hpbGQoZWwuZmlyc3RDaGlsZCk7XG4gIH1cbn07XG5cbi8vIGRldGFjaCBhbiBlbGVtZW50IGZyb20gaXRzIHBhcmVudFxuVXRpbC5kZXRhY2ggPSBmdW5jdGlvbiAoZWwpIHtcbiAgaWYgKGVsLnBhcmVudE5vZGUpIHtcbiAgICBlbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsKTtcbiAgfVxufTtcblxuVXRpbC5nZXRXaW5kb3dTaXplID0gZnVuY3Rpb24gKCkge1xuICB2YXIgZGltZW5zaW9ucyA9IHt3aWR0aDpudWxsLGhlaWdodDpudWxsfTtcblxuICBpZiAoJ2lubmVyV2lkdGgnIGluIHdpbmRvdyAmJiAnaW5uZXJIZWlnaHQnIGluIHdpbmRvdykge1xuICAgIGRpbWVuc2lvbnMgPSB7XG4gICAgICB3aWR0aDogd2luZG93LmlubmVyV2lkdGgsXG4gICAgICBoZWlnaHQ6IHdpbmRvdy5pbm5lckhlaWdodFxuICAgIH07XG4gIH0gZWxzZSB7XG4gICAgLy8gcHJvYmFibHkgSUU8PThcbiAgICB2YXIgZWxlbSA9ICdkb2N1bWVudEVsZW1lbnQnIGluIGRvY3VtZW50ID9cbiAgICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50IDogZG9jdW1lbnQuYm9keTtcblxuICAgIGRpbWVuc2lvbnMgPSB7XG4gICAgICB3aWR0aDogZWxlbS5vZmZzZXRXaWR0aCxcbiAgICAgIGhlaWdodDogZWxlbS5vZmZzZXRIZWlnaHRcbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIGRpbWVuc2lvbnM7XG59O1xuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IGlzIGEgY29tcG9zaXRpb24gb2Ygb3RoZXIgZnVuY3Rpb25zLlxuICpcbiAqIEZvciBleGFtcGxlOlxuICogICAgICBhKGIoYyh4KSkpID09PSBjb21wb3NlKGMsIGIsIGEpKHgpO1xuICpcbiAqIEVhY2ggZnVuY3Rpb24gc2hvdWxkIGFjY2VwdCBhcyBhbiBhcmd1bWVudCwgdGhlIHJlc3VsdCBvZiB0aGUgcHJldmlvdXNcbiAqIGZ1bmN0aW9uIGNhbGwgaW4gdGhlIGNoYWluLiBJdCBpcyBhbGxvd2FibGUgZm9yIGFsbCBmdW5jdGlvbnMgdG8gaGF2ZSBub1xuICogcmV0dXJuIHZhbHVlIGFzIHdlbGwuXG4gKlxuICogQHBhcmFtIC4uLiB7RnVuY3Rpb259IEEgdmFyaWFibGUgc2V0IG9mIGZ1bmN0aW9ucyB0byBjYWxsLCBpbiBvcmRlci5cbiAqXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn0gVGhlIGNvbXBvc2l0aW9uIG9mIHRoZSBmdW5jdGlvbnMgcHJvdmlkZWQgYXMgYXJndW1lbnRzLlxuICovXG5VdGlsLmNvbXBvc2UgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBmbnMgPSBhcmd1bWVudHM7XG5cbiAgcmV0dXJuIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICB2YXIgaSxcbiAgICAgICAgZm4sXG4gICAgICAgIGxlbjtcblxuICAgIGZvciAoaSA9IDAsIGxlbiA9IGZucy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgZm4gPSBmbnNbaV07XG5cbiAgICAgIGlmIChmbiAmJiBmbi5jYWxsKSB7XG4gICAgICAgIHJlc3VsdCA9IGZuLmNhbGwodGhpcywgcmVzdWx0KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xufTtcblxuLyoqXG4gKiBDaGVja3MgdGhlIGVsZW1lbnRzIG9mIGEgbG9va2luZyBmb3IgYi4gYiBpcyBhc3N1bWVkIHRvIGJlIGZvdW5kIGlmIGZvclxuICogc29tZSBvYmplY3QgaW4gYSAoYVtpXSksIGFbaV0gPT09IGIuIE5vdGUgc3RyaWN0IGVxdWFsaXR5LlxuICpcbiAqIEBwYXJhbSBhIHtBcnJheX1cbiAqICAgICAgQW4gYXJyYXkgdG8gc2VhcmNoXG4gKiBAcGFyYW0gYiB7TWl4ZWR9XG4gKiAgICAgIEEgdmFsdWUgdG8gc2VhcmNoIGZvclxuICpcbiAqIEByZXR1cm5cbiAqICAgICAgdHJ1ZSBpZiBhcnJheSBhIGNvbnRhaW5zIGJcbiAqL1xuVXRpbC5jb250YWlucyA9IGZ1bmN0aW9uIChhLCBiKSB7XG4gIHZhciBpLCBsZW47XG5cbiAgZm9yIChpID0gMCwgbGVuID0gYS5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgIGlmIChiID09PSBhW2ldKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59O1xuXG4vKipcbiAqIEByZXR1cm5cbiAqICAgICAgdHJ1ZSBpZiBvYmplY3QgaXMgYW4gYXJyYXlcbiAqL1xuVXRpbC5pc0FycmF5ID0gZnVuY3Rpb24gKGEpIHtcblxuICBpZiAodHlwZW9mIEFycmF5LmlzQXJyYXkgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gQXJyYXkuaXNBcnJheShhKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGEpID09PSAnW29iamVjdCBBcnJheV0nO1xuICB9XG5cbn07XG5cblxuLyoqXG4gKiBMb2FkIGEgc2NyaXB0IGFzeW5jaHJvbm91c2x5LlxuICpcbiAqIEBwYXJhbSB1cmwge1N0cmluZ31cbiAqICAgICAgICBzY3JpcHQgdG8gbG9hZC5cbiAqIEBwYXJhbSBvcHRpb25zIHtPYmplY3R9XG4gKiAgICAgICAgYWRkaXRpb25hbCBvcHRpb25zLlxuICogQHBhcmFtIG9wdGlvbnMuc3VjY2VzcyB7RnVuY3Rpb259IG9wdGlvbmFsLlxuICogICAgICAgIGNhbGxlZCBhZnRlciBzY3JpcHQgbG9hZHMgc3VjY2Vzc2Z1bGx5LlxuICogQHBhcmFtIG9wdGlvbnMuZXJyb3Ige0Z1bmN0aW9ufSBvcHRpb25hbC5cbiAqICAgICAgICBjYWxsZWQgYWZ0ZXIgc2NyaXB0IGZhaWxzIHRvIGxvYWQuXG4gKiBAcGFyYW0gb3B0aW9ucy5kb25lIHtGdW5jdGlvbn0gb3B0aW9uYWxcbiAqICAgICAgICBjYWxsZWQgYWZ0ZXIgbG9hZFNjcmlwdCBpcyBjb21wbGV0ZSxcbiAqICAgICAgICBhZnRlciBjYWxsaW5nIHN1Y2Nlc3Mgb3IgZXJyb3IuXG4gKi9cblV0aWwubG9hZFNjcmlwdCA9IGZ1bmN0aW9uICh1cmwsIG9wdGlvbnMpIHtcbiAgLy8gbG9hZCBzZWNvbmRhcnkgc2NyaXB0XG4gIHZhciBjbGVhbnVwLFxuICAgICAgZG9uZSxcbiAgICAgIG9uRXJyb3IsXG4gICAgICBvbkxvYWQsXG4gICAgICBzY3JpcHQ7XG5cbiAgb3B0aW9ucyA9IFV0aWwuZXh0ZW5kKHt9LCB7XG4gICAgc3VjY2VzczogbnVsbCxcbiAgICBlcnJvcjogbnVsbCxcbiAgICBkb25lOiBudWxsXG4gIH0sIG9wdGlvbnMpO1xuXG4gIGNsZWFudXAgPSBmdW5jdGlvbiAoKSB7XG4gICAgc2NyaXB0LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBvbkxvYWQpO1xuICAgIHNjcmlwdC5yZW1vdmVFdmVudExpc3RlbmVyKCdlcnJvcicsIG9uRXJyb3IpO1xuICAgIHNjcmlwdC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHNjcmlwdCk7XG4gICAgY2xlYW51cCA9IG51bGw7XG4gICAgb25Mb2FkID0gbnVsbDtcbiAgICBvbkVycm9yID0gbnVsbDtcbiAgICBzY3JpcHQgPSBudWxsO1xuICB9O1xuXG4gIGRvbmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKG9wdGlvbnMuZG9uZSAhPT0gbnVsbCkge1xuICAgICAgb3B0aW9ucy5kb25lKCk7XG4gICAgfVxuICAgIG9wdGlvbnMgPSBudWxsO1xuICB9O1xuXG4gIG9uRXJyb3IgPSBmdW5jdGlvbiAoKSB7XG4gICAgY2xlYW51cCgpO1xuICAgIGlmIChvcHRpb25zLmVycm9yICE9PSBudWxsKSB7XG4gICAgICBvcHRpb25zLmVycm9yLmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7XG4gICAgfVxuICAgIGRvbmUoKTtcbiAgfTtcblxuICBvbkxvYWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgY2xlYW51cCgpO1xuICAgIGlmIChvcHRpb25zLnN1Y2Nlc3MgIT09IG51bGwpIHtcbiAgICAgIG9wdGlvbnMuc3VjY2Vzcy5hcHBseShudWxsLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgICBkb25lKCk7XG4gIH07XG5cbiAgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XG4gIHNjcmlwdC5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgb25Mb2FkKTtcbiAgc2NyaXB0LmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgb25FcnJvcik7XG4gIHNjcmlwdC5zcmMgPSB1cmw7XG4gIHNjcmlwdC5hc3luYyA9IHRydWU7XG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ3NjcmlwdCcpLnBhcmVudE5vZGUuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcbn07XG5cblxuLy8gRG8gdGhlc2UgY2hlY2tzIG9uY2UgYW5kIGNhY2hlIHRoZSByZXN1bHRzXG4oZnVuY3Rpb24oKSB7XG4gIHZhciB0ZXN0RWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgdmFyIHRlc3RJbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gIHZhciBzdHIgPSBuYXZpZ2F0b3IudXNlckFnZW50fHxuYXZpZ2F0b3IudmVuZG9yfHx3aW5kb3cub3BlcmE7XG5cbiAgaXNNb2JpbGUgPSBzdHIubWF0Y2goLyhBbmRyb2lkfHdlYk9TfGlQaG9uZXxpUGFkfGlQb2R8QmxhY2tCZXJyeXxXaW5kb3dzIFBob25lKS9pKTtcbiAgdGVzdElucHV0LnNldEF0dHJpYnV0ZSgndHlwZScsICdkYXRlJyk7XG4gIHN1cHBvcnRzRGF0ZUlucHV0ID0gKHRlc3RJbnB1dC50eXBlICE9PSAndGV4dCcpO1xuXG4gIC8vIGNsZWFuIHVwIHRlc3RpbmcgZWxlbWVudFxuICB0ZXN0RWwgPSBudWxsO1xufSkoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBVdGlsOyIsIid1c2Ugc3RyaWN0JztcblxuXG52YXIgVXRpbCA9IHJlcXVpcmUoJy4vVXRpbCcpO1xuXG5cbnZhciBfQ0FMTEJBQ0tfU0VRVUVOQ0UgPSAwO1xuXG4vLyBkZWZhdWx0cyBmb3IganNvbnAgbWV0aG9kXG52YXIgX0RFRkFVTFRfSlNPTlBfT1BUSU9OUyA9IHtcbiAgdXJsOiBudWxsLFxuICBzdWNjZXNzOiBudWxsLFxuICBlcnJvcjogbnVsbCxcbiAgZG9uZTogbnVsbCxcbiAgZGF0YTogbnVsbCxcbiAgY2FsbGJhY2tOYW1lOiBudWxsLFxuICBjYWxsYmFja1BhcmFtZXRlcjogJ2NhbGxiYWNrJ1xufTtcblxuLy8gZGVmYXVsdHMgZm9yIGFqYXggbWV0aG9kXG52YXIgX0RFRkFVTFRfQUpBWF9PUFRJT05TID0ge1xuICB1cmw6IG51bGwsXG4gIHN1Y2Nlc3M6IG51bGwsXG4gIGVycm9yOiBudWxsLFxuICBkb25lOiBudWxsLFxuICBtZXRob2Q6ICdHRVQnLFxuICBoZWFkZXJzOiBudWxsLFxuICBkYXRhOiBudWxsLFxuICByYXdkYXRhOiBudWxsXG59O1xuXG4vLyBBUEkgTWV0aG9kIERlY2xhcmF0aW9uc1xuXG52YXIgYWpheCxcbiAgICBnZXRDYWxsYmFja05hbWUsXG4gICAganNvbnAsXG4gICAgcmVzdHJpY3RPcmlnaW4sXG4gICAgdXJsRW5jb2RlO1xuXG5cbi8vIEFQSSBNZXRob2QgRGVmaW5pdGlvbnNcblxuLyoqXG4gKiBNYWtlIGFuIEFKQVggcmVxdWVzdC5cbiAqXG4gKiBAcGFyYW0gb3B0aW9ucy51cmwge1N0cmluZ31cbiAqICAgICAgdGhlIHVybCB0byByZXF1ZXN0LlxuICogQHBhcmFtIG9wdGlvbnMuc3VjY2VzcyB7RnVuY3Rpb259XG4gKiAgICAgIGNhbGxlZCB3aXRoIGRhdGEgbG9hZGVkIGJ5IHNjcmlwdFxuICogQHBhcmFtIG9wdGlvbnMuZXJyb3Ige0Z1bmN0aW9ufSBvcHRpb25hbFxuICogICAgICBjYWxsZWQgd2hlbiBzY3JpcHQgZmFpbHMgdG8gbG9hZFxuICogQHBhcmFtIG9wdGlvbnMuZG9uZSB7RnVuY3Rpb259XG4gKiAgICAgICAgY2FsbGVkIHdoZW4gYWpheCBpcyBjb21wbGV0ZSwgYWZ0ZXIgc3VjY2VzcyBvciBlcnJvci5cbiAqIEBwYXJhbSBvcHRpb25zLm1ldGhvZCB7U3RyaW5nfVxuICogICAgICByZXF1ZXN0IG1ldGhvZCwgZGVmYXVsdCBpcyAnR0VUJ1xuICogQHBhcmFtIG9wdGlvbnMuaGVhZGVycyB7T2JqZWN0fVxuICogICAgICByZXF1ZXN0IGhlYWRlciBuYW1lIGFzIGtleSwgdmFsdWUgYXMgdmFsdWUuXG4gKiBAcGFyYW0gb3B0aW9ucy5kYXRhIHtPYmplY3R9XG4gKiAgICAgIHJlcXVlc3QgZGF0YSwgc2VudCB1c2luZyBjb250ZW50IHR5cGVcbiAqICAgICAgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcuXG4gKiBAcGFyYW0gb3B0aW9ucy5yYXdkYXRhIHs/fVxuICogICAgICBwYXNzZWQgZGlyZWN0bHkgdG8gc2VuZCBtZXRob2QsIHdoZW4gb3B0aW9ucy5kYXRhIGlzIG51bGwuXG4gKiAgICAgIENvbnRlbnQtdHlwZSBoZWFkZXIgbXVzdCBhbHNvIGJlIHNwZWNpZmllZC4gRGVmYXVsdCBpcyBudWxsLlxuICovXG5hamF4ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgdmFyIGgsXG4gICAgICBwb3N0ZGF0YSxcbiAgICAgIHF1ZXJ5U3RyaW5nLFxuICAgICAgdXJsLFxuICAgICAgeGhyO1xuXG4gIG9wdGlvbnMgPSBVdGlsLmV4dGVuZCh7fSwgX0RFRkFVTFRfQUpBWF9PUFRJT05TLCBvcHRpb25zKTtcbiAgdXJsID0gb3B0aW9ucy51cmw7XG5cbiAgaWYgKG9wdGlvbnMucmVzdHJpY3RPcmlnaW4pIHtcbiAgICB1cmwgPSByZXN0cmljdE9yaWdpbih1cmwpO1xuICB9XG4gIHBvc3RkYXRhID0gb3B0aW9ucy5yYXdkYXRhO1xuXG4gIGlmIChvcHRpb25zLmRhdGEgIT09IG51bGwpIHtcbiAgICBxdWVyeVN0cmluZyA9IHVybEVuY29kZShvcHRpb25zLmRhdGEpO1xuICAgIGlmIChvcHRpb25zLm1ldGhvZCA9PT0gJ0dFVCcpIHtcbiAgICAgIC8vIGFwcGVuZCB0byB1cmxcbiAgICAgIHVybCA9IHVybCArICc/JyArIHF1ZXJ5U3RyaW5nO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBvdGhlcndpc2Ugc2VuZCBhcyByZXF1ZXN0IGJvZHlcbiAgICAgIHBvc3RkYXRhID0gcXVlcnlTdHJpbmc7XG4gICAgICBpZiAob3B0aW9ucy5oZWFkZXJzID09PSBudWxsKSB7XG4gICAgICAgIG9wdGlvbnMuaGVhZGVycyA9IHt9O1xuICAgICAgfVxuICAgICAgLy8gc2V0IHJlcXVlc3QgY29udGVudCB0eXBlXG4gICAgICBvcHRpb25zLmhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddID0gJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCc7XG4gICAgfVxuICB9XG5cbiAgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cbiAgLy8gc2V0dXAgY2FsbGJhY2tcbiAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZGF0YSwgY29udGVudFR5cGU7XG5cbiAgICBpZiAoeGhyLnJlYWR5U3RhdGUgPT09IDQpIHtcbiAgICAgIGlmICh4aHIuc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgaWYgKG9wdGlvbnMuc3VjY2VzcyAhPT0gbnVsbCkge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBkYXRhID0geGhyLnJlc3BvbnNlO1xuICAgICAgICAgICAgY29udGVudFR5cGUgPSB4aHIuZ2V0UmVzcG9uc2VIZWFkZXIoJ0NvbnRlbnQtVHlwZScpO1xuICAgICAgICAgICAgaWYgKGNvbnRlbnRUeXBlICYmIGNvbnRlbnRUeXBlLmluZGV4T2YoJ2pzb24nKSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgZGF0YSA9IEpTT04ucGFyc2UoZGF0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvcHRpb25zLnN1Y2Nlc3MoZGF0YSwgeGhyKTtcbiAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5lcnJvciAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICBvcHRpb25zLmVycm9yKGUsIHhocik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAob3B0aW9ucy5lcnJvcikge1xuICAgICAgICAgIG9wdGlvbnMuZXJyb3IoeGhyLnN0YXR1cywgeGhyKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKG9wdGlvbnMuZG9uZSAhPT0gbnVsbCkge1xuICAgICAgICBvcHRpb25zLmRvbmUoeGhyKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgLy8gb3BlbiByZXF1ZXN0XG4gIHhoci5vcGVuKG9wdGlvbnMubWV0aG9kLCB1cmwsIHRydWUpO1xuXG4gIC8vIHNlbmQgaGVhZGVyc1xuICBpZiAob3B0aW9ucy5oZWFkZXJzICE9PSBudWxsKSB7XG4gICAgZm9yIChoIGluIG9wdGlvbnMuaGVhZGVycykge1xuICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoaCwgb3B0aW9ucy5oZWFkZXJzW2hdKTtcbiAgICB9XG4gIH1cblxuICAvLyBzZW5kIGRhdGFcbiAgeGhyLnNlbmQocG9zdGRhdGEpO1xuXG4gIHJldHVybiB4aHI7XG59O1xuXG4vKipcbiAqIEdlbmVyYXRlIGEgdW5pcXVlIGNhbGxiYWNrIG5hbWUuXG4gKlxuICogQHJldHVybiBhIHVuaXF1ZSBjYWxsYmFjayBuYW1lLlxuICovXG5nZXRDYWxsYmFja05hbWUgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiAnX3hocl9jYWxsYmFja18nICsgbmV3IERhdGUoKS5nZXRUaW1lKCkgK1xuICAgICAgJ18nICsgKCsrX0NBTExCQUNLX1NFUVVFTkNFKTtcbn07XG5cbi8qKlxuICogTWFrZSBhIEpTT05QIHJlcXVlc3QuXG4gKlxuICogQHBhcmFtIG9wdGlvbnMudXJsIHtTdHJpbmd9XG4gKiAgICAgIHVybCB0byBsb2FkXG4gKiBAcGFyYW0gb3B0aW9ucy5zdWNjZXNzIHtGdW5jdGlvbn1cbiAqICAgICAgY2FsbGVkIHdpdGggZGF0YSBsb2FkZWQgYnkgc2NyaXB0XG4gKiBAcGFyYW0gb3B0aW9ucy5lcnJvciB7RnVuY3Rpb259IG9wdGlvbmFsXG4gKiAgICAgIGNhbGxlZCB3aGVuIHNjcmlwdCBmYWlscyB0byBsb2FkXG4gKiBAcGFyYW0gb3B0aW9ucy5kb25lIHtGdW5jdGlvbn0gb3B0aW9uYWxcbiAqICAgICAgICBjYWxsZWQgd2hlbiBqc29ucCBpcyBjb21wbGV0ZSwgYWZ0ZXIgc3VjY2VzcyBvciBlcnJvci5cbiAqIEBwYXJhbSBvcHRpb25zLmRhdGEge09iamVjdH0gb3B0aW9uYWxcbiAqICAgICAgcmVxdWVzdCBwYXJhbWV0ZXJzIHRvIGFkZCB0byB1cmxcbiAqXG4gKiBAcGFyYW0gb3B0aW9ucy5jYWxsYmFja05hbWUge1N0cmluZ30gb3B0aW9uYWxcbiAqIEBwYXJhbSBvcHRpb25zLmNhbGxiYWNrUGFyYW1ldGVyIHtTdHJpbmd9IG9wdGlvbmFsXG4gKiAgICAgIGRlZmF1bHQgaXMgJ2NhbGxiYWNrJ1xuICovXG5qc29ucCA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gIHZhciBkYXRhLFxuICAgICAgY2FsbGJhY2ssXG4gICAgICB1cmw7XG5cbiAgb3B0aW9ucyA9IFV0aWwuZXh0ZW5kKHt9LCBfREVGQVVMVF9KU09OUF9PUFRJT05TLCBvcHRpb25zKTtcbiAgdXJsID0gb3B0aW9ucy51cmw7XG4gIGRhdGEgPSBVdGlsLmV4dGVuZCh7fSwgb3B0aW9ucy5kYXRhKTtcbiAgY2FsbGJhY2sgPSBvcHRpb25zLmNhbGxiYWNrTmFtZSB8fCBnZXRDYWxsYmFja05hbWUoKTtcblxuICAvLyBhZGQgZGF0YSBhbmQgY2FsbGJhY2sgdG8gdXJsXG4gIGRhdGFbb3B0aW9ucy5jYWxsYmFja1BhcmFtZXRlcl0gPSBjYWxsYmFjaztcbiAgdXJsICs9ICh1cmwuaW5kZXhPZignPycpID09PSAtMSA/ICc/JyA6ICcmJykgKyB1cmxFbmNvZGUoZGF0YSk7XG5cbiAgLy8gc2V0dXAgZ2xvYmFsIGNhbGxiYWNrIGNhbGxlZCBieSBzY3JpcHRcbiAgd2luZG93W2NhbGxiYWNrXSA9IGZ1bmN0aW9uICgpIHtcbiAgICBvcHRpb25zLnN1Y2Nlc3MuYXBwbHkobnVsbCwgYXJndW1lbnRzKTtcbiAgfTtcblxuICBVdGlsLmxvYWRTY3JpcHQodXJsLCB7XG4gICAgZXJyb3I6IG9wdGlvbnMuZXJyb3IsXG4gICAgZG9uZTogZnVuY3Rpb24gKCkge1xuICAgICAgd2luZG93W2NhbGxiYWNrXSA9IG51bGw7XG4gICAgICBkZWxldGUgd2luZG93W2NhbGxiYWNrXTtcblxuICAgICAgaWYgKG9wdGlvbnMuZG9uZSAhPT0gbnVsbCkge1xuICAgICAgICBvcHRpb25zLmRvbmUoKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xufTtcblxucmVzdHJpY3RPcmlnaW4gPSBmdW5jdGlvbiAodXJsKSB7XG4gIHZhciBhLFxuICAgICAgcmVzdHJpY3RlZFVybDtcblxuICBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpOyAvLyBIYWNrIHRvIHBhcnNlIG9ubHkgdGhlIHBhdGhuYW1lXG4gIGEuc2V0QXR0cmlidXRlKCdocmVmJywgdXJsKTtcbiAgcmVzdHJpY3RlZFVybCA9IGEucGF0aG5hbWU7XG5cbiAgLy8gTmVlZGVkIGZvciBJRSwgd2hpY2ggb21pdHMgbGVhZGluZyBzbGFzaC5cbiAgaWYgKCh1cmwuaW5kZXhPZignaHR0cCcpID09PSAwIHx8IHVybC5pbmRleE9mKCcvJykgPT09IDApICYmXG4gICAgICByZXN0cmljdGVkVXJsLmluZGV4T2YoJy8nKSAhPT0gMCkge1xuICAgIHJlc3RyaWN0ZWRVcmwgPSAnLycgKyByZXN0cmljdGVkVXJsO1xuICB9XG5cbiAgcmV0dXJuIHJlc3RyaWN0ZWRVcmw7XG59O1xuXG4vKipcbiAqIFVSTCBlbmNvZGUgYW4gb2JqZWN0LlxuICpcbiAqIEBwYXJhbSBvYmoge09iamVjdH1cbiAqICAgICAgb2JqZWN0IHRvIGVuY29kZVxuICpcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqICAgICAgdXJsIGVuY29kZWQgb2JqZWN0XG4gKi9cbnVybEVuY29kZSA9IGZ1bmN0aW9uIChvYmopIHtcbiAgdmFyIGRhdGEsIGtleSwgZW5jb2RlZEtleSwgdmFsdWUsIGksIGxlbjtcblxuICBkYXRhID0gW107XG4gIGZvciAoa2V5IGluIG9iaikge1xuICAgIGVuY29kZWRLZXkgPSBlbmNvZGVVUklDb21wb25lbnQoa2V5KTtcbiAgICB2YWx1ZSA9IG9ialtrZXldO1xuXG4gICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgIC8vIEFkZCBlYWNoIHZhbHVlIGluIGFycmF5IHNlcGVyYXRlbHlcbiAgICAgIGZvciAoaSA9IDAsIGxlbiA9IHZhbHVlLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIGRhdGEucHVzaChlbmNvZGVkS2V5ICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KHZhbHVlW2ldKSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGRhdGEucHVzaChlbmNvZGVkS2V5ICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KHZhbHVlKSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBkYXRhLmpvaW4oJyYnKTtcbn07XG5cblxuLy8gZXhwb3NlIHRoZSBBUElcbm1vZHVsZS5leHBvcnRzID0ge1xuICBhamF4OiBhamF4LFxuICBnZXRDYWxsYmFja05hbWU6IGdldENhbGxiYWNrTmFtZSxcbiAganNvbnA6IGpzb25wLFxuICByZXN0cmljdE9yaWdpbjogcmVzdHJpY3RPcmlnaW4sXG4gIHVybEVuY29kZTogdXJsRW5jb2RlLFxufTsiXX0=
