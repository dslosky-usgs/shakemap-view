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
                    events: JSON.parse(json)
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvaHRkb2NzL2pzL3NoYWtlbWFwLXZpZXcvZXZlbnRzL0V2ZW50c1ZpZXcuanMiLCJzcmMvaHRkb2NzL2pzL3NoYWtlbWFwLXZpZXcvbG9hZGluZy9Mb2FkaW5nVmlldy5qcyIsInNyYy9odGRvY3MvanMvc2hha2VtYXAtdmlldy9tYXBzL01hcFZpZXcuanMiLCJzcmMvaHRkb2NzL2pzL3NoYWtlbWFwLXZpZXcvbWFwcy9sYXllcnMvR2VuZXJhdG9yLmpzIiwic3JjL2h0ZG9jcy9qcy9zaGFrZW1hcC12aWV3L21hcHMvbGF5ZXJzL2NvbnRfcGdhLmpzIiwic3JjL2h0ZG9jcy9qcy9zaGFrZW1hcC12aWV3L21hcHMvbGF5ZXJzL2VwaWNlbnRlci5qcyIsInNyYy9odGRvY3MvanMvc2hha2VtYXAtdmlldy9tYXBzL2xheWVycy9ldmVudHMuanMiLCJub2RlX21vZHVsZXMvaGF6ZGV2LXdlYnV0aWxzL3NyYy9tYXRoL0NhbWVyYS5qcyIsIm5vZGVfbW9kdWxlcy9oYXpkZXYtd2VidXRpbHMvc3JjL21hdGgvTWF0cml4LmpzIiwibm9kZV9tb2R1bGVzL2hhemRldi13ZWJ1dGlscy9zcmMvbWF0aC9WZWN0b3IuanMiLCJub2RlX21vZHVsZXMvaGF6ZGV2LXdlYnV0aWxzL3NyYy9tdmMvQ29sbGVjdGlvblNlbGVjdEJveC5qcyIsIm5vZGVfbW9kdWxlcy9oYXpkZXYtd2VidXRpbHMvc3JjL212Yy9Db2xsZWN0aW9uVGFibGUuanMiLCJub2RlX21vZHVsZXMvaGF6ZGV2LXdlYnV0aWxzL3NyYy9tdmMvQ29sbGVjdGlvblZpZXcuanMiLCJub2RlX21vZHVsZXMvaGF6ZGV2LXdlYnV0aWxzL3NyYy9tdmMvQ29sbGVjdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy9oYXpkZXYtd2VidXRpbHMvc3JjL212Yy9EYXRhVGFibGUuanMiLCJub2RlX21vZHVsZXMvaGF6ZGV2LXdlYnV0aWxzL3NyYy9tdmMvRG93bmxvYWRWaWV3LmpzIiwibm9kZV9tb2R1bGVzL2hhemRldi13ZWJ1dGlscy9zcmMvbXZjL0ZpbGVJbnB1dFZpZXcuanMiLCJub2RlX21vZHVsZXMvaGF6ZGV2LXdlYnV0aWxzL3NyYy9tdmMvTW9kYWxWaWV3LmpzIiwibm9kZV9tb2R1bGVzL2hhemRldi13ZWJ1dGlscy9zcmMvbXZjL01vZGVsLmpzIiwibm9kZV9tb2R1bGVzL2hhemRldi13ZWJ1dGlscy9zcmMvbXZjL1NlbGVjdFZpZXcuanMiLCJub2RlX21vZHVsZXMvaGF6ZGV2LXdlYnV0aWxzL3NyYy9tdmMvU2VsZWN0ZWRDb2xsZWN0aW9uVmlldy5qcyIsIm5vZGVfbW9kdWxlcy9oYXpkZXYtd2VidXRpbHMvc3JjL212Yy9Tb3J0Vmlldy5qcyIsIm5vZGVfbW9kdWxlcy9oYXpkZXYtd2VidXRpbHMvc3JjL212Yy9WaWV3LmpzIiwic3JjL2h0ZG9jcy9qcy9zaGFrZW1hcC12aWV3L0FwcC5qcyIsInNyYy9odGRvY3MvanMvc2hha2VtYXAtdmlldy9TaGFrZU1hcE1vZGVsLmpzIiwibm9kZV9tb2R1bGVzL2hhemRldi13ZWJ1dGlscy9zcmMvdXRpbC9FdmVudHMuanMiLCJub2RlX21vZHVsZXMvaGF6ZGV2LXdlYnV0aWxzL3NyYy91dGlsL0ZpbGVJTy5qcyIsIm5vZGVfbW9kdWxlcy9oYXpkZXYtd2VidXRpbHMvc3JjL3V0aWwvTWVzc2FnZS5qcyIsIm5vZGVfbW9kdWxlcy9oYXpkZXYtd2VidXRpbHMvc3JjL3V0aWwvVXRpbC5qcyIsIm5vZGVfbW9kdWxlcy9oYXpkZXYtd2VidXRpbHMvc3JjL3V0aWwvWGhyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7O0FBQ0EsSUFBTSxPQUFPLFFBQVEsOEJBQVIsQ0FBYjtBQUFBLElBQ1EsTUFBTSxRQUFRLFVBQVIsQ0FEZDs7QUFHQSxJQUFJLFlBQVksU0FBWixTQUFZLENBQVUsT0FBVixFQUFtQjtBQUMvQixRQUFJLEtBQUosRUFDUSxXQURSOztBQUdBLFlBQVEsS0FBSyxPQUFMLENBQVI7O0FBRUEsa0JBQWMsdUJBQVUsV0FBYztBQUNsQyxjQUFNLEVBQU4sQ0FBUyxTQUFULEdBQ1EsS0FDQSw0Q0FGUjtBQUdBLGNBQU0sRUFBTixDQUFTLFNBQVQsR0FBcUIsRUFBckI7O0FBRUEsY0FBTSxLQUFOLENBQVksRUFBWixDQUFlLGVBQWYsRUFBZ0MsTUFBTSxZQUF0QztBQUNBLGNBQU0sVUFBTixHQUFtQixNQUFNLEVBQU4sQ0FBUyxhQUFULENBQXVCLGFBQXZCLENBQW5CO0FBQ0EsY0FBTSxVQUFOLENBQWlCLGdCQUFqQixDQUFrQyxPQUFsQyxFQUEyQyxNQUFNLFNBQWpEOztBQUVBLGNBQU0sU0FBTjtBQUNILEtBWEQ7O0FBYUEsVUFBTSxZQUFOLEdBQXFCLFlBQVk7QUFDN0IsWUFBSSxZQUFZLEVBQWhCO0FBRDZCO0FBQUE7QUFBQTs7QUFBQTtBQUU3QixpQ0FBa0IsTUFBTSxLQUFOLENBQVksR0FBWixDQUFnQixRQUFoQixDQUFsQiw4SEFBNkM7QUFBQSxvQkFBcEMsTUFBb0M7O0FBQ3pDLDZCQUFhLHdCQUF3QixPQUFNLEVBQTlCLEdBQW1DLFFBQWhEO0FBQ0g7QUFKNEI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFNN0IsY0FBTSxFQUFOLENBQVMsU0FBVCxHQUNRLDZCQUE2QixTQUE3QixHQUF5QyxRQUF6QyxHQUNBLDRDQUZSOztBQUlBLGNBQU0sVUFBTixHQUFtQixNQUFNLEVBQU4sQ0FBUyxhQUFULENBQXVCLGFBQXZCLENBQW5CO0FBQ0EsY0FBTSxVQUFOLENBQWlCLGdCQUFqQixDQUFrQyxPQUFsQyxFQUEyQyxNQUFNLFNBQWpEOztBQUVBLGNBQU0sTUFBTixHQUFlLE1BQU0sRUFBTixDQUFTLGdCQUFULENBQTBCLFFBQTFCLENBQWY7QUFDQSxZQUFJLE1BQU0sTUFBVixFQUFrQjtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUNkLHNDQUFrQixNQUFNLE1BQXhCLG1JQUFnQztBQUFBLHdCQUF2QixLQUF1Qjs7QUFDNUIsMEJBQU0sZ0JBQU4sQ0FBdUIsT0FBdkIsRUFBZ0MsTUFBTSxTQUF0QztBQUNIO0FBSGE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUlqQjtBQUNKLEtBbkJEOztBQXFCQSxVQUFNLFNBQU4sR0FBa0IsWUFBWTtBQUMxQixjQUFNLEtBQU4sQ0FBWSxHQUFaLENBQWdCO0FBQ1oscUJBQVM7QUFERyxTQUFoQjs7QUFJQSxZQUFJLElBQUosQ0FBUztBQUNMLGlCQUFLLE1BQU0sS0FBTixDQUFZLEdBQVosQ0FBZ0IsYUFBaEIsQ0FEQTtBQUVMLHFCQUFTLGlCQUFVLElBQVYsRUFBZ0I7QUFDckIsc0JBQU0sS0FBTixDQUFZLEdBQVosQ0FBZ0I7QUFDWiw0QkFBUSxLQUFLLEtBQUwsQ0FBVyxJQUFYO0FBREksaUJBQWhCO0FBR0gsYUFOSTtBQU9MLG1CQUFPLGlCQUFZO0FBQ2Ysc0JBQU0sS0FBTixDQUFZLEdBQVosQ0FBZ0I7QUFDWiw0QkFBUTtBQURJLGlCQUFoQjtBQUdILGFBWEk7QUFZTCxrQkFBTSxnQkFBWTtBQUNkLHNCQUFNLEtBQU4sQ0FBWSxHQUFaLENBQWdCO0FBQ1osNkJBQVM7QUFERyxpQkFBaEI7QUFHSDtBQWhCSSxTQUFUO0FBa0JILEtBdkJEOztBQXlCQSxVQUFNLFNBQU4sR0FBa0IsVUFBVSxDQUFWLEVBQWE7QUFDM0IsWUFBSSxXQUFXLEVBQUUsU0FBakI7QUFDQSxZQUFJLFVBQVUsU0FBUyxTQUF2Qjs7QUFFQSxZQUFJLFlBQVksSUFBaEI7QUFKMkI7QUFBQTtBQUFBOztBQUFBO0FBSzNCLGtDQUFzQixNQUFNLEtBQU4sQ0FBWSxHQUFaLENBQWdCLFFBQWhCLENBQXRCLG1JQUFpRDtBQUFBLG9CQUF4QyxTQUF3Qzs7QUFDN0Msb0JBQUksVUFBVSxJQUFWLE1BQW9CLE9BQXhCLEVBQWlDO0FBQzdCLGdDQUFZLFNBQVo7QUFDQTtBQUNIO0FBQ0o7QUFWMEI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFZM0IsWUFBSSxTQUFKLEVBQWU7QUFDWCxrQkFBTSxLQUFOLENBQVksR0FBWixDQUFnQjtBQUNaLHlCQUFTO0FBREcsYUFBaEI7QUFHSDtBQUNKLEtBakJEOztBQW1CQSxnQkFBWSxPQUFaO0FBQ0EsY0FBVSxJQUFWO0FBQ0EsV0FBTyxLQUFQO0FBQ0gsQ0F2RkQ7O0FBMEZBLE9BQU8sT0FBUCxHQUFpQixTQUFqQjs7O0FDOUZBOztBQUVBLElBQU0sT0FBTyxRQUFRLDhCQUFSLENBQWI7O0FBRUEsSUFBSSxjQUFjLFNBQWQsV0FBYyxDQUFVLE9BQVYsRUFBbUI7QUFDakMsUUFBSSxLQUFKLEVBQ1EsV0FEUjs7QUFHQSxZQUFRLEtBQUssT0FBTCxDQUFSOztBQUVBLGtCQUFjLHVCQUFVLFdBQWM7QUFDbEMsY0FBTSxZQUFOLEdBQXFCLENBQXJCO0FBQ0EsY0FBTSxFQUFOLENBQVMsU0FBVCxHQUFxQix1Q0FBckI7QUFDQSxjQUFNLEtBQU4sQ0FBWSxFQUFaLENBQWUsZ0JBQWYsRUFBaUMsTUFBTSxhQUF2QztBQUNILEtBSkQ7O0FBTUEsVUFBTSxhQUFOLEdBQXNCLFlBQVk7QUFDOUIsWUFBSSxNQUFNLEtBQU4sQ0FBWSxHQUFaLENBQWdCLFNBQWhCLE1BQStCLElBQW5DLEVBQXlDOztBQUVyQztBQUNBLGdCQUFJLE1BQU0sWUFBTixLQUF1QixDQUEzQixFQUE4QjtBQUMxQixzQkFBTSxFQUFOLENBQVMsU0FBVCxDQUFtQixHQUFuQixDQUF1QixpQkFBdkI7QUFDSDtBQUNELGtCQUFNLFlBQU4sSUFBc0IsQ0FBdEI7QUFFSCxTQVJELE1BUU87QUFDSCxrQkFBTSxZQUFOLElBQXNCLENBQXRCOztBQUVBO0FBQ0EsZ0JBQUksTUFBTSxZQUFOLEtBQXVCLENBQTNCLEVBQThCO0FBQzFCLHNCQUFNLEVBQU4sQ0FBUyxTQUFULENBQW1CLE1BQW5CLENBQTBCLGlCQUExQjtBQUNIOztBQUVEO0FBQ0EsZ0JBQUksTUFBTSxZQUFOLEdBQXFCLENBQXpCLEVBQTRCO0FBQ3hCLHNCQUFNLFlBQU4sR0FBcUIsQ0FBckI7QUFDSDtBQUNKO0FBQ0osS0F0QkQ7O0FBMEJBLGdCQUFZLE9BQVo7QUFDQSxjQUFVLElBQVY7QUFDQSxXQUFPLEtBQVA7QUFDSCxDQXpDRDs7QUEyQ0EsT0FBTyxPQUFQLEdBQWlCLFdBQWpCOzs7QUMvQ0E7QUFDQTs7QUFFQSxJQUFNLE9BQU8sUUFBUSw4QkFBUixDQUFiO0FBQ0EsSUFBSyxZQUFZLFFBQVEscUNBQVIsQ0FBakI7O0FBR0EsSUFBSSxVQUFVLFNBQVYsT0FBVSxDQUFVLE9BQVYsRUFBbUI7QUFDN0IsUUFBSSxLQUFKLEVBQ1EsV0FEUjs7QUFHQSxZQUFRLEtBQUssT0FBTCxDQUFSOztBQUVBLGtCQUFjLHVCQUFVLFdBQWM7QUFDbEMsY0FBTSxFQUFOLENBQVMsU0FBVCxHQUFxQix3REFBckI7QUFDQSxjQUFNLGFBQU4sR0FBc0IsTUFBTSxLQUFOLENBQVksR0FBWixDQUFnQixlQUFoQixDQUF0QjtBQUNBLFlBQUksUUFBUSxNQUFNLEVBQU4sQ0FBUyxhQUFULENBQXVCLE1BQXZCLENBQVo7O0FBRUEsY0FBTSxHQUFOLEdBQVksRUFBRSxHQUFGLENBQU0sS0FBTixFQUFhO0FBQ3JCLDZCQUFpQjtBQURJLFNBQWIsRUFFVCxPQUZTLENBRUQsQ0FBQyxNQUFELEVBQVMsQ0FBQyxJQUFWLENBRkMsRUFFZ0IsRUFGaEIsQ0FBWjs7QUFJQSxjQUFNLGNBQU4sR0FBdUIsVUFBVSxPQUFWLENBQXZCO0FBQ0EsY0FBTSxTQUFOLEdBQWtCLE1BQU0sWUFBTixFQUFsQjtBQUNBLGNBQU0sYUFBTixHQUFzQixFQUFFLE9BQUYsQ0FBVSxNQUFWLENBQWlCLEVBQUMsV0FBVyxNQUFNLFNBQWxCLEVBQWpCLEVBQStDLEtBQS9DLENBQXFELE1BQU0sR0FBM0QsQ0FBdEI7O0FBRUEsY0FBTSxLQUFOLENBQVksRUFBWixDQUFlLGNBQWYsRUFBK0IsTUFBTSxpQkFBckM7QUFDQSxjQUFNLEtBQU4sQ0FBWSxFQUFaLENBQWUsZUFBZixFQUFnQyxNQUFNLFlBQXRDO0FBQ0EsZUFBTyxnQkFBUCxDQUF3QixnQkFBeEIsRUFBMEMsTUFBTSxZQUFoRDtBQUNILEtBaEJEOztBQWtCQSxVQUFNLFlBQU4sR0FBcUIsWUFBWTtBQUM3QixZQUFJLFlBQVksRUFBRSxTQUFGLENBQVksdUVBQXVFLDJGQUFuRixFQUFnTDtBQUM1TCxxQkFBUyxFQURtTDtBQUU1TCx5QkFBYSx3RkFDVCx5RUFEUyxHQUVULGtEQUp3TDtBQUs1TCxnQkFBSTtBQUx3TCxTQUFoTCxFQU1iLEtBTmEsQ0FNUCxNQUFNLEdBTkMsQ0FBaEI7O0FBUUEsZUFBTyxTQUFQO0FBQ0gsS0FWRDs7QUFZQSxVQUFNLGlCQUFOLEdBQTBCLFlBQVk7QUFDbEM7QUFDQSxjQUFNLGNBQU47O0FBRUE7QUFDQSxjQUFNLFNBQU4sR0FBa0IsTUFBTSxZQUFOLEVBQWxCO0FBQ0EsWUFBSSxRQUFRLE1BQU0sS0FBTixDQUFZLEdBQVosQ0FBZ0IsT0FBaEIsQ0FBWjs7QUFFQSxjQUFNLGNBQU4sQ0FBcUIsY0FBckIsQ0FBb0MsS0FBcEM7QUFDQSxjQUFNLGFBQU4sR0FBc0IsRUFBRSxPQUFGLENBQVUsTUFBVixDQUFpQixFQUFDLFdBQVcsTUFBTSxTQUFsQixFQUFqQixFQUErQyxLQUEvQyxDQUFxRCxNQUFNLEdBQTNELENBQXRCO0FBQ0gsS0FWRDs7QUFZQSxVQUFNLFlBQU4sR0FBcUIsVUFBVSxDQUFWLEVBQWE7QUFDOUI7QUFDQSxjQUFNLGNBQU47O0FBRUE7QUFDQSxjQUFNLFNBQU4sR0FBa0IsTUFBTSxZQUFOLEVBQWxCO0FBQ0EsWUFBSSxTQUFTLEVBQUUsTUFBZjs7QUFFQSxjQUFNLGFBQU4sR0FBc0IsRUFBRSxPQUFGLENBQVUsTUFBVixDQUFpQixFQUFDLFdBQVcsTUFBTSxTQUFsQixFQUFqQixFQUErQyxNQUEvQyxFQUF1RCxLQUF2RCxDQUE2RCxNQUFNLEdBQW5FLENBQXRCOztBQUVBLFlBQUksV0FBVyxFQUFmO0FBQ0EsYUFBSyxJQUFJLEtBQVQsSUFBa0IsTUFBbEIsRUFBMEI7QUFDdEIsZ0JBQUksTUFBTSxhQUFOLENBQW9CLE9BQXBCLENBQTRCLEtBQTVCLElBQXFDLENBQUMsQ0FBMUMsRUFBNkM7QUFDekMsdUJBQU8sS0FBUCxFQUFjLEtBQWQsQ0FBb0IsTUFBTSxHQUExQjtBQUNIO0FBQ0QscUJBQVMsSUFBVCxDQUFjLE9BQU8sS0FBUCxDQUFkO0FBQ0g7O0FBRUQsWUFBSSxRQUFRLEVBQUUsWUFBRixDQUFlLFFBQWYsQ0FBWjtBQUNBLGNBQU0sR0FBTixDQUFVLFNBQVYsQ0FBb0IsTUFBTSxTQUFOLEdBQWtCLEdBQWxCLENBQXNCLEdBQXRCLENBQXBCO0FBRUgsS0FyQkQ7O0FBdUJBLFVBQU0sY0FBTixHQUF1QixZQUFZO0FBQy9CLGNBQU0sR0FBTixDQUFVLFNBQVYsQ0FBb0IsVUFBVSxLQUFWLEVBQWlCO0FBQ2pDLGtCQUFNLEdBQU4sQ0FBVSxXQUFWLENBQXNCLEtBQXRCO0FBQ0gsU0FGRDs7QUFJQSxjQUFNLGFBQU4sQ0FBb0IsVUFBcEIsQ0FBK0IsTUFBTSxHQUFyQztBQUNILEtBTkQ7O0FBUUEsZ0JBQVksT0FBWjtBQUNBLGNBQVUsSUFBVjtBQUNBLFdBQU8sS0FBUDtBQUNILENBbEZEOztBQXFGQSxPQUFPLE9BQVAsR0FBaUIsT0FBakI7OztBQzVGQTs7QUFDQSxJQUFNLFNBQVMsUUFBUSxrQ0FBUixDQUFmO0FBQUEsSUFDUSxPQUFPLFFBQVEsOEJBQVIsQ0FEZjs7QUFHQSxJQUFJLFdBQVcsQ0FBQyxRQUFRLHFDQUFSLENBQUQsRUFDWCxRQUFRLG9DQUFSLENBRFcsQ0FBZjs7QUFHQSxJQUFJLFlBQVksU0FBWixTQUFZLENBQVUsT0FBVixFQUFtQjtBQUMvQixRQUFJLEtBQUosRUFDUSxXQURSOztBQUdBLFlBQVEsS0FBSyxPQUFMLENBQVI7O0FBRUEsa0JBQWMsdUJBQVUsV0FBYTtBQUNqQyxjQUFNLFVBQU4sR0FBbUIsQ0FBbkI7QUFDQSxjQUFNLE1BQU4sR0FBZSxFQUFmO0FBQ0EsY0FBTSxRQUFOLEdBQWlCLFFBQWpCO0FBQ0EsZUFBTyxnQkFBUCxDQUF3QixlQUF4QixFQUF5QyxNQUFNLFFBQS9DO0FBQ0gsS0FMRDs7QUFRQSxVQUFNLGNBQU4sR0FBdUIsVUFBVSxLQUFWLEVBQWlCO0FBQ3BDLGNBQU0sVUFBTixHQUFtQixDQUFuQjtBQUNBLGNBQU0sTUFBTixHQUFlLEVBQWY7QUFDQSxZQUFJLEtBQUosRUFBVztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUNQLHFDQUFxQixNQUFNLFFBQTNCLDhIQUFxQztBQUFBLHdCQUE1QixRQUE0Qjs7QUFDakMsNkJBQVMsYUFBVCxDQUF1QixLQUF2QjtBQUNIO0FBSE07QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUlWO0FBQ0osS0FSRDs7QUFVQSxVQUFNLFFBQU4sR0FBaUIsVUFBVSxDQUFWLEVBQWE7QUFDMUIsWUFBSSxRQUFRLEVBQUUsTUFBZDs7QUFFQTtBQUNBLFlBQUksTUFBTSxLQUFWLEVBQWlCO0FBQ2Isa0JBQU0sTUFBTixDQUFhLE1BQU0sSUFBbkIsSUFBMkIsTUFBTSxLQUFqQztBQUNIOztBQUVEO0FBQ0EsY0FBTSxVQUFOLElBQW9CLENBQXBCOztBQUVBO0FBQ0EsWUFBSSxNQUFNLFVBQU4sS0FBcUIsTUFBTSxRQUFOLENBQWUsTUFBeEMsRUFBZ0Q7QUFDNUMsbUJBQU8sbUJBQVAsQ0FBMkIsTUFBTSxNQUFqQztBQUNIO0FBQ0osS0FmRDs7QUFpQkEsZ0JBQVksT0FBWjtBQUNBLGNBQVUsSUFBVjtBQUNBLFdBQU8sS0FBUDtBQUNILENBNUNEOztBQStDQSxPQUFPLE9BQVAsR0FBaUIsU0FBakI7OztBQ3REQTtBQUNBOztBQUNBLElBQU0sTUFBTSxRQUFRLFVBQVIsQ0FBWjtBQUNBLElBQU0sU0FBUyxRQUFRLGtDQUFSLENBQWY7O0FBRUEsSUFBSSxRQUFRLEVBQUMsSUFBSSx3QkFBTCxFQUFaO0FBQ0EsTUFBTSxJQUFOLEdBQWEsY0FBYjtBQUNBLE1BQU0sYUFBTixHQUFzQixVQUFVLEtBQVYsRUFBaUI7QUFDbkMsVUFBTSxLQUFOLEdBQWMsSUFBZDtBQUNBLFFBQUksVUFBVSxJQUFkO0FBQ0EsUUFBSSxXQUFXLE1BQU0sUUFBTixDQUFlLENBQWYsRUFBa0IsUUFBakM7O0FBRUEsU0FBSyxJQUFJLENBQVQsSUFBYyxRQUFkLEVBQXdCO0FBQ3BCLFlBQUksTUFBTSxNQUFNLEVBQWhCLEVBQW9CO0FBQ2hCLHNCQUFVLFNBQVMsQ0FBVCxDQUFWO0FBQ0E7QUFDSDtBQUNKOztBQUVELFFBQUksT0FBSixFQUFhO0FBQ1QsWUFBSSxJQUFKLENBQVM7QUFDTCxpQkFBSyxRQUFRLEdBRFI7QUFFTCxxQkFBUyxpQkFBVSxJQUFWLEVBQWdCO0FBQ3JCLHNCQUFNLE9BQU4sSUFBaUIsRUFBRSxPQUFGLENBQVUsSUFBVixDQUFqQjtBQUNBLHVCQUFPLGtCQUFQLENBQTBCLEtBQTFCO0FBQ0gsYUFMSTtBQU1MLG1CQUFPLGlCQUFZO0FBQ2YsdUJBQU8sa0JBQVAsQ0FBMEIsS0FBMUI7QUFDSCxhQVJJO0FBU0wsa0JBQU0sZ0JBQVksQ0FDakI7QUFWSSxTQUFUO0FBWUgsS0FiRCxNQWFPO0FBQ0gsZUFBTyxrQkFBUCxDQUEwQixLQUExQjtBQUNIO0FBQ0osQ0E1QkQ7O0FBZ0NBLE9BQU8sT0FBUCxHQUFpQixLQUFqQjs7O0FDdkNBO0FBQ0E7O0FBQ0EsSUFBTSxTQUFTLFFBQVEsa0NBQVIsQ0FBZjtBQUFBLElBQ1EsTUFBTSxRQUFRLFVBQVIsQ0FEZDs7QUFHQSxJQUFJLFFBQVEsRUFBQyxXQUFXLG1CQUFaLEVBQVo7QUFDQSxNQUFNLGFBQU4sR0FBc0IsVUFBVSxLQUFWLEVBQWlCO0FBQ25DLFFBQUksVUFBVSxJQUFkO0FBQ0EsUUFBSSxXQUFXLE1BQU0sUUFBTixDQUFlLENBQWYsRUFBa0IsUUFBakM7O0FBRUEsU0FBSyxJQUFJLENBQVQsSUFBYyxRQUFkLEVBQXdCO0FBQ3BCLFlBQUksTUFBTSxNQUFNLFNBQWhCLEVBQTJCO0FBQ3ZCLHNCQUFVLFNBQVMsQ0FBVCxDQUFWO0FBQ0E7QUFDSDtBQUNKOztBQUVELFFBQUksT0FBSixFQUFhO0FBQ1QsWUFBSSxJQUFKLENBQVM7QUFDTCxpQkFBSyxRQUFRLEdBRFI7QUFFTCxxQkFBUyxpQkFBVSxHQUFWLEVBQWU7QUFDcEIsb0JBQUksU0FBUyxJQUFJLFNBQUosRUFBYjtBQUNBLG9CQUFJLFNBQVMsT0FBTyxlQUFQLENBQXVCLEdBQXZCLEVBQTJCLFVBQTNCLENBQWI7QUFDQSxvQkFBSSxHQUFKLEVBQ1EsR0FEUixFQUVRLFNBRlI7O0FBSG9CO0FBQUE7QUFBQTs7QUFBQTtBQU9wQix5Q0FBaUIsT0FBTyxvQkFBUCxDQUE0QixlQUE1QixFQUE2QyxDQUE3QyxFQUFnRCxVQUFqRSw4SEFBNkU7QUFBQSw0QkFBcEUsSUFBb0U7O0FBQ3pFLDRCQUFJLEtBQUssUUFBTCxLQUFrQixPQUF0QixFQUErQjtBQUMzQixrQ0FBTSxLQUFLLFlBQUwsQ0FBa0IsS0FBbEIsQ0FBTjtBQUNBLGtDQUFNLEtBQUssWUFBTCxDQUFrQixLQUFsQixDQUFOOztBQUVBLHdDQUNJLFlBQ0EsVUFEQSxHQUNhLEtBQUssWUFBTCxDQUFrQixVQUFsQixDQURiLEdBQzZDLFlBRDdDLEdBRUEsb0NBRkEsR0FFdUMsS0FBSyxZQUFMLENBQWtCLFdBQWxCLENBRnZDLEdBRXdFLG9CQUZ4RSxHQUdBLGdDQUhBLEdBR21DLEtBQUssWUFBTCxDQUFrQixPQUFsQixDQUhuQyxHQUdnRSxvQkFIaEUsR0FJQSxtQ0FKQSxHQUlzQyxLQUFLLFlBQUwsQ0FBa0IsS0FBbEIsQ0FKdEMsR0FJaUUsSUFKakUsR0FJd0UsS0FBSyxZQUFMLENBQWtCLEtBQWxCLENBSnhFLEdBSW1HLG9CQUpuRyxHQUtBLFVBTko7QUFPQTtBQUNIO0FBQ0o7QUFyQm1CO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBdUJwQixzQkFBTSxPQUFOLElBQWlCLEVBQUUsTUFBRixDQUFTLENBQUMsR0FBRCxFQUFNLEdBQU4sQ0FBVCxFQUNJLFNBREosQ0FDYyxTQURkLEVBRUksU0FGSixFQUFqQjtBQUdBLHVCQUFPLGtCQUFQLENBQTBCLEtBQTFCO0FBQ0gsYUE3Qkk7QUE4QkwsbUJBQU8saUJBQVk7QUFDZix1QkFBTyxrQkFBUCxDQUEwQixLQUExQjtBQUNILGFBaENJO0FBaUNMLGtCQUFNLGdCQUFZLENBQ2pCO0FBbENJLFNBQVQ7QUFvQ0g7QUFDSixDQWpERDs7QUFtREEsTUFBTSxJQUFOLEdBQWEsV0FBYjs7QUFFQSxPQUFPLE9BQVAsR0FBaUIsS0FBakI7Ozs7O0FDM0RBLElBQUkscUJBQXFCLFNBQXJCLGtCQUFxQixDQUFVLEtBQVYsRUFBaUI7QUFDdEMsUUFBSSxNQUFNLElBQUksV0FBSixDQUFnQixlQUFoQixFQUFpQyxFQUFDLFFBQVEsS0FBVCxFQUFqQyxDQUFWO0FBQ0EsV0FBTyxhQUFQLENBQXFCLEdBQXJCO0FBQ0gsQ0FIRDs7QUFLQSxJQUFJLHNCQUFzQixTQUF0QixtQkFBc0IsQ0FBVSxNQUFWLEVBQWtCO0FBQ3hDLFFBQUksTUFBTSxJQUFJLFdBQUosQ0FBZ0IsZ0JBQWhCLEVBQWtDLEVBQUMsUUFBUSxNQUFULEVBQWxDLENBQVY7QUFDQSxXQUFPLGFBQVAsQ0FBcUIsR0FBckI7QUFDSCxDQUhEOztBQUtBLElBQUksU0FBUyxFQUFDLHFCQUFxQixtQkFBdEI7QUFDVCx3QkFBb0Isa0JBRFgsRUFBYjs7QUFHQSxPQUFPLE9BQVAsR0FBaUIsTUFBakI7OztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdHBCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5b0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0TUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0TkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25YQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdktBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaGVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDak5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDN0ZBLElBQU0sYUFBYSxRQUFRLGlDQUFSLENBQW5CO0FBQUEsSUFDUSxjQUFjLFFBQVEsbUNBQVIsQ0FEdEI7QUFBQSxJQUVRLFVBQVUsUUFBUSw0QkFBUixDQUZsQjtBQUFBLElBR1EsT0FBTyxRQUFRLDhCQUFSLENBSGY7QUFBQSxJQUlRLE9BQU8sUUFBUSwrQkFBUixDQUpmOztBQU1BLElBQUksTUFBTSxTQUFOLEdBQU0sQ0FBVSxPQUFWLEVBQW1CO0FBQ3pCLFFBQUksS0FBSixFQUNRLFdBRFI7O0FBR0EsY0FBVSxLQUFLLE1BQUwsQ0FBWSxFQUFaLEVBQWdCLEVBQWhCLEVBQW9CLE9BQXBCLENBQVY7QUFDQSxZQUFRLEtBQUssT0FBTCxDQUFSOztBQUVBLGtCQUFjLHVCQUFVLFdBQWE7QUFDakMsY0FBTSxFQUFOLENBQVMsU0FBVCxDQUFtQixHQUFuQixDQUF1QixhQUF2Qjs7QUFFQSxjQUFNLEVBQU4sQ0FBUyxTQUFULEdBQ1EscUNBQ0EsNEJBREEsR0FFQSxnRkFIUjs7QUFLQSxjQUFNLE9BQU4sR0FBZ0IsUUFBUTtBQUNwQixnQkFBSSxNQUFNLEVBQU4sQ0FBUyxhQUFULENBQXVCLFdBQXZCLENBRGdCO0FBRXBCLG1CQUFPLE1BQU07QUFGTyxTQUFSLENBQWhCOztBQUtBLGNBQU0sVUFBTixHQUFtQixXQUFXO0FBQzFCLGdCQUFJLE1BQU0sRUFBTixDQUFTLGFBQVQsQ0FBdUIsU0FBdkIsQ0FEc0I7QUFFMUIsbUJBQU8sTUFBTTtBQUZhLFNBQVgsQ0FBbkI7O0FBS0EsY0FBTSxXQUFOLEdBQW9CLFlBQVk7QUFDNUIsZ0JBQUksTUFBTSxFQUFOLENBQVMsYUFBVCxDQUF1QixlQUF2QixDQUR3QjtBQUU1QixtQkFBTyxNQUFNO0FBRmUsU0FBWixDQUFwQjtBQUlILEtBdEJEOztBQXdCQSxnQkFBWSxPQUFaO0FBQ0EsY0FBVSxJQUFWO0FBQ0EsV0FBTyxLQUFQO0FBQ0gsQ0FsQ0Q7O0FBb0NBLE9BQU8sT0FBUCxHQUFpQixHQUFqQjs7Ozs7QUMxQ0EsSUFBTSxRQUFRLFFBQVEsK0JBQVIsQ0FBZDtBQUFBLElBQ1EsT0FBTyxRQUFRLCtCQUFSLENBRGY7O0FBR0EsSUFBSSxnQkFBZ0IsU0FBaEIsYUFBZ0IsQ0FBUyxPQUFULEVBQWtCO0FBQ2xDLFFBQUksS0FBSjs7QUFFQSxZQUFRLE1BQU0sS0FBSyxNQUFMLENBQVksRUFBWixFQUNWLEVBQUMsYUFBYSxnQkFBZDtBQUNJLGdCQUFRLEVBRFo7QUFFSSxlQUFPLElBRlg7QUFHSSxnQkFBUSxFQUhaO0FBSUksdUJBQWUsQ0FBQyxXQUFELEVBQWMsY0FBZCxDQUpuQjtBQUtJLGlCQUFTLEtBTGIsRUFEVSxFQU9mLE9BUGUsQ0FBTixDQUFSOztBQVNBLFdBQU8sS0FBUDtBQUNILENBYkQ7O0FBZUEsT0FBTyxPQUFQLEdBQWlCLGFBQWpCOzs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0lBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaFdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcbmNvbnN0IFZpZXcgPSByZXF1aXJlKCdoYXpkZXYtd2VidXRpbHMvc3JjL212Yy9WaWV3JyksXG4gICAgICAgIFhociA9IHJlcXVpcmUoJ3V0aWwvWGhyJyk7XG5cbnZhciBFdmVudFZpZXcgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgIHZhciBfdGhpcyxcbiAgICAgICAgICAgIF9pbml0aWFsaXplO1xuXG4gICAgX3RoaXMgPSBWaWV3KG9wdGlvbnMpO1xuXG4gICAgX2luaXRpYWxpemUgPSBmdW5jdGlvbiAoLypvcHRpb25zKi8gKSB7XG4gICAgICAgIF90aGlzLmVsLmlubmVySFRNTCA9IFxuICAgICAgICAgICAgICAgICcnICtcbiAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cImxvYWRCdXR0b25cIj5SZWZyZXNoIExpc3Q8L2Rpdj4nO1xuICAgICAgICBfdGhpcy5lbC5ldmVudExpc3QgPSBbXTtcblxuICAgICAgICBfdGhpcy5tb2RlbC5vbignY2hhbmdlOmV2ZW50cycsIF90aGlzLnJlbmRlckV2ZW50cyk7XG4gICAgICAgIF90aGlzLmxvYWRCdXR0b24gPSBfdGhpcy5lbC5xdWVyeVNlbGVjdG9yKCcubG9hZEJ1dHRvbicpO1xuICAgICAgICBfdGhpcy5sb2FkQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgX3RoaXMuZ2V0RXZlbnRzKTtcblxuICAgICAgICBfdGhpcy5nZXRFdmVudHMoKTtcbiAgICB9O1xuXG4gICAgX3RoaXMucmVuZGVyRXZlbnRzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZXZlbnRIdG1sID0gJyc7XG4gICAgICAgIGZvciAobGV0IGV2ZW50IG9mIF90aGlzLm1vZGVsLmdldCgnZXZlbnRzJykpIHtcbiAgICAgICAgICAgIGV2ZW50SHRtbCArPSAnPGRpdiBjbGFzcz1cImV2ZW50XCI+JyArIGV2ZW50LmlkICsgJzwvZGl2Pic7XG4gICAgICAgIH1cblxuICAgICAgICBfdGhpcy5lbC5pbm5lckhUTUwgPSBcbiAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cImV2ZW50LWxpc3RcIj4nICsgZXZlbnRIdG1sICsgJzwvZGl2PicgK1xuICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwibG9hZEJ1dHRvblwiPlJlZnJlc2ggTGlzdDwvZGl2Pic7XG4gICAgICAgIFxuICAgICAgICBfdGhpcy5sb2FkQnV0dG9uID0gX3RoaXMuZWwucXVlcnlTZWxlY3RvcignLmxvYWRCdXR0b24nKTtcbiAgICAgICAgX3RoaXMubG9hZEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIF90aGlzLmdldEV2ZW50cyk7XG5cbiAgICAgICAgX3RoaXMuZXZlbnRzID0gX3RoaXMuZWwucXVlcnlTZWxlY3RvckFsbCgnLmV2ZW50Jyk7XG4gICAgICAgIGlmIChfdGhpcy5ldmVudHMpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGV2ZW50IG9mIF90aGlzLmV2ZW50cykge1xuICAgICAgICAgICAgICAgIGV2ZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgX3RoaXMubG9hZEV2ZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBfdGhpcy5nZXRFdmVudHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIF90aGlzLm1vZGVsLnNldCh7XG4gICAgICAgICAgICBsb2FkaW5nOiB0cnVlXG4gICAgICAgIH0pO1xuXG4gICAgICAgIFhoci5hamF4KHtcbiAgICAgICAgICAgIHVybDogX3RoaXMubW9kZWwuZ2V0KCdwcm9kdWN0c1VybCcpLFxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGpzb24pIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5tb2RlbC5zZXQoe1xuICAgICAgICAgICAgICAgICAgICBldmVudHM6IEpTT04ucGFyc2UoanNvbilcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIF90aGlzLm1vZGVsLnNldCh7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50czogW11cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkb25lOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMubW9kZWwuc2V0KHtcbiAgICAgICAgICAgICAgICAgICAgbG9hZGluZzogZmFsc2VcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBcbiAgICBfdGhpcy5sb2FkRXZlbnQgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICB2YXIgZXZlbnREaXYgPSBlLnRvRWxlbWVudDtcbiAgICAgICAgdmFyIGV2ZW50SWQgPSBldmVudERpdi5pbm5lclRleHQ7XG5cbiAgICAgICAgdmFyIGV2ZW50RGF0YSA9IG51bGw7XG4gICAgICAgIGZvciAobGV0IGV2ZW50SnNvbiBvZiBfdGhpcy5tb2RlbC5nZXQoJ2V2ZW50cycpKSB7XG4gICAgICAgICAgICBpZiAoZXZlbnRKc29uWydpZCddID09PSBldmVudElkKSB7XG4gICAgICAgICAgICAgICAgZXZlbnREYXRhID0gZXZlbnRKc29uO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGV2ZW50RGF0YSkge1xuICAgICAgICAgICAgX3RoaXMubW9kZWwuc2V0KHtcbiAgICAgICAgICAgICAgICAnZXZlbnQnOiBldmVudERhdGFcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIF9pbml0aWFsaXplKG9wdGlvbnMpO1xuICAgIG9wdGlvbnMgPSBudWxsO1xuICAgIHJldHVybiBfdGhpcztcbn07XG5cblxubW9kdWxlLmV4cG9ydHMgPSBFdmVudFZpZXc7IiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBWaWV3ID0gcmVxdWlyZSgnaGF6ZGV2LXdlYnV0aWxzL3NyYy9tdmMvVmlldycpO1xuXG52YXIgTG9hZGluZ1ZpZXcgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgIHZhciBfdGhpcyxcbiAgICAgICAgICAgIF9pbml0aWFsaXplO1xuXG4gICAgX3RoaXMgPSBWaWV3KG9wdGlvbnMpO1xuXG4gICAgX2luaXRpYWxpemUgPSBmdW5jdGlvbiAoLypvcHRpb25zKi8gKSB7XG4gICAgICAgIF90aGlzLmxvYWRpbmdDb3VudCA9IDA7XG4gICAgICAgIF90aGlzLmVsLmlubmVySFRNTCA9ICc8ZGl2IGNsYXNzPVwibG9hZGluZ1wiPkxvYWRpbmcuLi48L2Rpdj4nO1xuICAgICAgICBfdGhpcy5tb2RlbC5vbignY2hhbmdlOmxvYWRpbmcnLCBfdGhpcy5jaGFuZ2VMb2FkaW5nKTtcbiAgICB9O1xuXG4gICAgX3RoaXMuY2hhbmdlTG9hZGluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKF90aGlzLm1vZGVsLmdldCgnbG9hZGluZycpID09PSB0cnVlKSB7XG5cbiAgICAgICAgICAgIC8vIGFkZCBsb2FkaW5nIGNsYXNzIHRvIG1ha2UgbG9hZGluZyBkaXYgdmlzaWJsZVxuICAgICAgICAgICAgaWYgKF90aGlzLmxvYWRpbmdDb3VudCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIF90aGlzLmVsLmNsYXNzTGlzdC5hZGQoJ2xvYWRpbmctY29udGVudCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgX3RoaXMubG9hZGluZ0NvdW50ICs9IDE7XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIF90aGlzLmxvYWRpbmdDb3VudCAtPSAxO1xuXG4gICAgICAgICAgICAvLyBpZiBub3RoaW5nIGlzIGxvYWRpbmcsIGhpZGUgdGhlIGRpdlxuICAgICAgICAgICAgaWYgKF90aGlzLmxvYWRpbmdDb3VudCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIF90aGlzLmVsLmNsYXNzTGlzdC5yZW1vdmUoJ2xvYWRpbmctY29udGVudCcpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyByZXNldCBsb2FkaW5nIGNvdW50IGlmIGl0IGRyb3BzIGJlbG93IHplcm9cbiAgICAgICAgICAgIGlmIChfdGhpcy5sb2FkaW5nQ291bnQgPCAwKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMubG9hZGluZ0NvdW50ID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cblxuXG4gICAgX2luaXRpYWxpemUob3B0aW9ucyk7XG4gICAgb3B0aW9ucyA9IG51bGw7XG4gICAgcmV0dXJuIF90aGlzO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBMb2FkaW5nVmlldzsiLCIvKiBnbG9iYWwgTCAqL1xuJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBWaWV3ID0gcmVxdWlyZSgnaGF6ZGV2LXdlYnV0aWxzL3NyYy9tdmMvVmlldycpO1xudmFyICBHZW5lcmF0b3IgPSByZXF1aXJlKCdzaGFrZW1hcC12aWV3L21hcHMvbGF5ZXJzL0dlbmVyYXRvcicpO1xuXG5cbnZhciBNYXBWaWV3ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICB2YXIgX3RoaXMsXG4gICAgICAgICAgICBfaW5pdGlhbGl6ZTtcblxuICAgIF90aGlzID0gVmlldyhvcHRpb25zKTtcblxuICAgIF9pbml0aWFsaXplID0gZnVuY3Rpb24gKC8qb3B0aW9ucyovICkge1xuICAgICAgICBfdGhpcy5lbC5pbm5lckhUTUwgPSAnPGRpdiBjbGFzcz1cIm1hcFwiIHN0eWxlPVwiaGVpZ2h0OjEwMCU7d2lkdGg6MTAwJVwiPjwvZGl2Pic7XG4gICAgICAgIF90aGlzLmRlZmF1bHRMYXllcnMgPSBfdGhpcy5tb2RlbC5nZXQoJ2RlZmF1bHRMYXllcnMnKTtcbiAgICAgICAgbGV0IG1hcEVsID0gX3RoaXMuZWwucXVlcnlTZWxlY3RvcignLm1hcCcpO1xuXG4gICAgICAgIF90aGlzLm1hcCA9IEwubWFwKG1hcEVsLCB7XG4gICAgICAgICAgICBzY3JvbGxXaGVlbFpvb206IGZhbHNlXG4gICAgICAgIH0pLnNldFZpZXcoWzUxLjUwNSwgLTAuMDldLCAxMyk7XG5cbiAgICAgICAgX3RoaXMubGF5ZXJHZW5lcmF0b3IgPSBHZW5lcmF0b3Iob3B0aW9ucyk7XG4gICAgICAgIF90aGlzLmJhc2VMYXllciA9IF90aGlzLmdlbkJhc2VMYXllcigpO1xuICAgICAgICBfdGhpcy5sYXllcnNDb250cm9sID0gTC5jb250cm9sLmxheWVycyh7J0Jhc2VtYXAnOiBfdGhpcy5iYXNlTGF5ZXJ9KS5hZGRUbyhfdGhpcy5tYXApO1xuXG4gICAgICAgIF90aGlzLm1vZGVsLm9uKCdjaGFuZ2U6ZXZlbnQnLCBfdGhpcy5yZW5kZXJFdmVudExheWVycyk7XG4gICAgICAgIF90aGlzLm1vZGVsLm9uKCdjaGFuZ2U6bGF5ZXJzJywgX3RoaXMuYWRkTWFwTGF5ZXJzKTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xheWVyc0ZpbmlzaGVkJywgX3RoaXMuYWRkTWFwTGF5ZXJzKTtcbiAgICB9O1xuXG4gICAgX3RoaXMuZ2VuQmFzZUxheWVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYmFzZWxheWVyID0gTC50aWxlTGF5ZXIoJ2h0dHBzOi8vYXBpLnRpbGVzLm1hcGJveC5jb20vdjQve2lkfS97en0ve3h9L3t5fS5wbmc/YWNjZXNzX3Rva2VuPScgKyAncGsuZXlKMUlqb2laSE5zYjNOcmVTSXNJbUVpT2lKamFYUjFhSEpuWTNFd01ERm9NblJ4WldWdGNtOWxhV0ptSW4wLjFDM0dFMGtIUEdPcGJWVjlrVHhCbFEnLCB7XG4gICAgICAgICAgICBtYXhab29tOiAxOCxcbiAgICAgICAgICAgIGF0dHJpYnV0aW9uOiAnTWFwIGRhdGEgJmNvcHk7IDxhIGhyZWY9XCJodHRwOi8vb3BlbnN0cmVldG1hcC5vcmdcIj5PcGVuU3RyZWV0TWFwPC9hPiBjb250cmlidXRvcnMsICcgK1xuICAgICAgICAgICAgICAgICc8YSBocmVmPVwiaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbGljZW5zZXMvYnktc2EvMi4wL1wiPkNDLUJZLVNBPC9hPiwgJyArXG4gICAgICAgICAgICAgICAgJ0ltYWdlcnkg77+9IDxhIGhyZWY9XCJodHRwOi8vbWFwYm94LmNvbVwiPk1hcGJveDwvYT4nLFxuICAgICAgICAgICAgaWQ6ICdtYXBib3guc3RyZWV0cydcbiAgICAgICAgfSkuYWRkVG8oX3RoaXMubWFwKTtcblxuICAgICAgICByZXR1cm4gYmFzZWxheWVyO1xuICAgIH07XG5cbiAgICBfdGhpcy5yZW5kZXJFdmVudExheWVycyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gY2xlYXIgbWFwXG4gICAgICAgIF90aGlzLmNsZWFyTWFwTGF5ZXJzKCk7XG4gICAgICAgIFxuICAgICAgICAvLyBnZW5lcmF0ZSBuZXcgbGF5ZXJzXG4gICAgICAgIF90aGlzLmJhc2VMYXllciA9IF90aGlzLmdlbkJhc2VMYXllcigpO1xuICAgICAgICB2YXIgZXZlbnQgPSBfdGhpcy5tb2RlbC5nZXQoJ2V2ZW50Jyk7XG4gICAgICAgIFxuICAgICAgICBfdGhpcy5sYXllckdlbmVyYXRvci5nZW5lcmF0ZUxheWVycyhldmVudCk7XG4gICAgICAgIF90aGlzLmxheWVyc0NvbnRyb2wgPSBMLmNvbnRyb2wubGF5ZXJzKHsnQmFzZW1hcCc6IF90aGlzLmJhc2VMYXllcn0pLmFkZFRvKF90aGlzLm1hcCk7XG4gICAgfTtcblxuICAgIF90aGlzLmFkZE1hcExheWVycyA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIC8vIGNsZWFyIG1hcFxuICAgICAgICBfdGhpcy5jbGVhck1hcExheWVycygpO1xuXG4gICAgICAgIC8vIGNvbGxlY3QgbGF5ZXJzXG4gICAgICAgIF90aGlzLmJhc2VMYXllciA9IF90aGlzLmdlbkJhc2VMYXllcigpO1xuICAgICAgICB2YXIgbGF5ZXJzID0gZS5kZXRhaWw7XG5cbiAgICAgICAgX3RoaXMubGF5ZXJzQ29udHJvbCA9IEwuY29udHJvbC5sYXllcnMoeydCYXNlbWFwJzogX3RoaXMuYmFzZUxheWVyfSwgbGF5ZXJzKS5hZGRUbyhfdGhpcy5tYXApO1xuXG4gICAgICAgIHZhciBsYXllckFyciA9IFtdO1xuICAgICAgICBmb3IgKHZhciBsYXllciBpbiBsYXllcnMpIHtcbiAgICAgICAgICAgIGlmIChfdGhpcy5kZWZhdWx0TGF5ZXJzLmluZGV4T2YobGF5ZXIpID4gLTEpIHtcbiAgICAgICAgICAgICAgICBsYXllcnNbbGF5ZXJdLmFkZFRvKF90aGlzLm1hcCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsYXllckFyci5wdXNoKGxheWVyc1tsYXllcl0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGdyb3VwID0gTC5mZWF0dXJlR3JvdXAobGF5ZXJBcnIpO1xuICAgICAgICBfdGhpcy5tYXAuZml0Qm91bmRzKGdyb3VwLmdldEJvdW5kcygpLnBhZCgwLjUpKTtcblxuICAgIH07XG5cbiAgICBfdGhpcy5jbGVhck1hcExheWVycyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgX3RoaXMubWFwLmVhY2hMYXllcihmdW5jdGlvbiAobGF5ZXIpIHtcbiAgICAgICAgICAgIF90aGlzLm1hcC5yZW1vdmVMYXllcihsYXllcik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIF90aGlzLmxheWVyc0NvbnRyb2wucmVtb3ZlRnJvbShfdGhpcy5tYXApO1xuICAgIH07XG5cbiAgICBfaW5pdGlhbGl6ZShvcHRpb25zKTtcbiAgICBvcHRpb25zID0gbnVsbDtcbiAgICByZXR1cm4gX3RoaXM7XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gTWFwVmlldzsiLCIndXNlIHN0cmljdCc7XG5jb25zdCBldmVudHMgPSByZXF1aXJlKCdzaGFrZW1hcC12aWV3L21hcHMvbGF5ZXJzL2V2ZW50cycpLFxuICAgICAgICBWaWV3ID0gcmVxdWlyZSgnaGF6ZGV2LXdlYnV0aWxzL3NyYy9tdmMvVmlldycpO1xuXG52YXIgbGF5ZXJzSW4gPSBbcmVxdWlyZSgnc2hha2VtYXAtdmlldy9tYXBzL2xheWVycy9lcGljZW50ZXInKSxcbiAgICByZXF1aXJlKCdzaGFrZW1hcC12aWV3L21hcHMvbGF5ZXJzL2NvbnRfcGdhJyldO1xuXG52YXIgR2VuZXJhdG9yID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICB2YXIgX3RoaXMsXG4gICAgICAgICAgICBfaW5pdGlhbGl6ZTtcblxuICAgIF90aGlzID0gVmlldyhvcHRpb25zKTtcblxuICAgIF9pbml0aWFsaXplID0gZnVuY3Rpb24gKC8qb3B0aW9ucyovKSB7XG4gICAgICAgIF90aGlzLmxheWVyQ291bnQgPSAwO1xuICAgICAgICBfdGhpcy5sYXllcnMgPSB7fTtcbiAgICAgICAgX3RoaXMubGF5ZXJzSW4gPSBsYXllcnNJbjtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xheWVyRmluaXNoZWQnLCBfdGhpcy5hZGRMYXllcik7XG4gICAgfTtcblxuXG4gICAgX3RoaXMuZ2VuZXJhdGVMYXllcnMgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgX3RoaXMubGF5ZXJDb3VudCA9IDA7XG4gICAgICAgIF90aGlzLmxheWVycyA9IHt9O1xuICAgICAgICBpZiAoZXZlbnQpIHtcbiAgICAgICAgICAgIGZvciAodmFyIHJhd0xheWVyIG9mIF90aGlzLmxheWVyc0luKSB7XG4gICAgICAgICAgICAgICAgcmF3TGF5ZXIuZ2VuZXJhdGVMYXllcihldmVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgX3RoaXMuYWRkTGF5ZXIgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICB2YXIgbGF5ZXIgPSBlLmRldGFpbDtcblxuICAgICAgICAvLyBjb2xsZWN0IGxheWVycyB0aGF0IHJlbmRlcmVkIHN1Y2Nlc3NmdWxseVxuICAgICAgICBpZiAobGF5ZXIubGF5ZXIpIHtcbiAgICAgICAgICAgIF90aGlzLmxheWVyc1tsYXllci5uYW1lXSA9IGxheWVyLmxheWVyO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gS2VlcCB0cmFjayBvZiBhbGwgbGF5ZXJzIHRoYXQgaGF2ZSByZXR1cm5lZFxuICAgICAgICBfdGhpcy5sYXllckNvdW50ICs9IDE7XG5cbiAgICAgICAgLy8gc2V0IHRoZSBtb2RlbCBpZiBhbGwgdGhlIGxheWVycyBhcmUgcmVhZHlcbiAgICAgICAgaWYgKF90aGlzLmxheWVyQ291bnQgPT09IF90aGlzLmxheWVyc0luLmxlbmd0aCkge1xuICAgICAgICAgICAgZXZlbnRzLmxheWVyc0ZpbmlzaGVkRXZlbnQoX3RoaXMubGF5ZXJzKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBfaW5pdGlhbGl6ZShvcHRpb25zKTtcbiAgICBvcHRpb25zID0gbnVsbDtcbiAgICByZXR1cm4gX3RoaXM7XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gR2VuZXJhdG9yOyIsIi8qIGdsb2JhbCBMICovXG4ndXNlIHN0cmljdCc7XG5jb25zdCBYaHIgPSByZXF1aXJlKCd1dGlsL1hocicpO1xuY29uc3QgZXZlbnRzID0gcmVxdWlyZSgnc2hha2VtYXAtdmlldy9tYXBzL2xheWVycy9ldmVudHMnKTtcblxudmFyIGxheWVyID0ge2lkOiAnZG93bmxvYWQvY29udF9wZ2EuanNvbid9O1xubGF5ZXIubmFtZSA9ICdQR0EgQ29udG91cnMnO1xubGF5ZXIuZ2VuZXJhdGVMYXllciA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgIGxheWVyLmxheWVyID0gbnVsbDtcbiAgICB2YXIgcHJvZHVjdCA9IG51bGw7XG4gICAgdmFyIGNvbnRlbnRzID0gZXZlbnQuc2hha2VtYXBbMF0uY29udGVudHM7XG5cbiAgICBmb3IgKGxldCBwIGluIGNvbnRlbnRzKSB7XG4gICAgICAgIGlmIChwID09PSBsYXllci5pZCkge1xuICAgICAgICAgICAgcHJvZHVjdCA9IGNvbnRlbnRzW3BdO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocHJvZHVjdCkge1xuICAgICAgICBYaHIuYWpheCh7XG4gICAgICAgICAgICB1cmw6IHByb2R1Y3QudXJsLFxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGpzb24pIHtcbiAgICAgICAgICAgICAgICBsYXllclsnbGF5ZXInXSA9IEwuZ2VvSnNvbihqc29uKTtcbiAgICAgICAgICAgICAgICBldmVudHMubGF5ZXJGaW5pc2hlZEV2ZW50KGxheWVyKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGV2ZW50cy5sYXllckZpbmlzaGVkRXZlbnQobGF5ZXIpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRvbmU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZXZlbnRzLmxheWVyRmluaXNoZWRFdmVudChsYXllcik7XG4gICAgfVxufTtcblxuXG5cbm1vZHVsZS5leHBvcnRzID0gbGF5ZXI7IiwiLyogZ2xvYmFsIEwgKi9cbid1c2Ugc3RyaWN0JztcbmNvbnN0IGV2ZW50cyA9IHJlcXVpcmUoJ3NoYWtlbWFwLXZpZXcvbWFwcy9sYXllcnMvZXZlbnRzJyksXG4gICAgICAgIFhociA9IHJlcXVpcmUoJ3V0aWwvWGhyJyk7XG5cbnZhciBsYXllciA9IHtwcm9kdWN0SWQ6ICdkb3dubG9hZC9ncmlkLnhtbCd9O1xubGF5ZXIuZ2VuZXJhdGVMYXllciA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgIHZhciBwcm9kdWN0ID0gbnVsbDtcbiAgICB2YXIgY29udGVudHMgPSBldmVudC5zaGFrZW1hcFswXS5jb250ZW50cztcblxuICAgIGZvciAobGV0IHAgaW4gY29udGVudHMpIHtcbiAgICAgICAgaWYgKHAgPT09IGxheWVyLnByb2R1Y3RJZCkge1xuICAgICAgICAgICAgcHJvZHVjdCA9IGNvbnRlbnRzW3BdO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocHJvZHVjdCkge1xuICAgICAgICBYaHIuYWpheCh7XG4gICAgICAgICAgICB1cmw6IHByb2R1Y3QudXJsLFxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKHhtbCkge1xuICAgICAgICAgICAgICAgIHZhciBwYXJzZXIgPSBuZXcgRE9NUGFyc2VyKCk7XG4gICAgICAgICAgICAgICAgdmFyIHhtbERvYyA9IHBhcnNlci5wYXJzZUZyb21TdHJpbmcoeG1sLCd0ZXh0L3htbCcpO1xuICAgICAgICAgICAgICAgIHZhciBsYXQsXG4gICAgICAgICAgICAgICAgICAgICAgICBsb24sXG4gICAgICAgICAgICAgICAgICAgICAgICBwb3B1cEh0bWw7XG5cbiAgICAgICAgICAgICAgICBmb3IgKGxldCBub2RlIG9mIHhtbERvYy5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc2hha2VtYXBfZ3JpZCcpWzBdLmNoaWxkTm9kZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5vZGUubm9kZU5hbWUgPT09ICdldmVudCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhdCA9IG5vZGUuZ2V0QXR0cmlidXRlKCdsYXQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvbiA9IG5vZGUuZ2V0QXR0cmlidXRlKCdsb24nKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcG9wdXBIdG1sID0gXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzx0YWJsZT4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPHRyPjx0aD4nICsgbm9kZS5nZXRBdHRyaWJ1dGUoJ2V2ZW50X2lkJykgKyAnPC90aD48L3RyPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8dHI+PHRhYmxlPjx0aD5NYWduaXR1ZGU6PC90aD48dGQ+JyArIG5vZGUuZ2V0QXR0cmlidXRlKCdtYWduaXR1ZGUnKSArICc8L3RkPjwvdGFibGU+PC90cj4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPHRyPjx0YWJsZT48dGg+RGVwdGg6PC90aD48dGQ+JyArIG5vZGUuZ2V0QXR0cmlidXRlKCdkZXB0aCcpICsgJzwvdGQ+PC90YWJsZT48L3RyPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8dHI+PHRhYmxlPjx0aD5Mb2NhdGlvbjo8L3RoPjx0ZD4nICsgbm9kZS5nZXRBdHRyaWJ1dGUoJ2xhdCcpICsgJywgJyArIG5vZGUuZ2V0QXR0cmlidXRlKCdsb24nKSArICc8L3RkPjwvdGFibGU+PC90cj4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPC90YWJsZT4nO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBsYXllclsnbGF5ZXInXSA9IEwubWFya2VyKFtsYXQsIGxvbl0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYmluZFBvcHVwKHBvcHVwSHRtbClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5vcGVuUG9wdXAoKTtcbiAgICAgICAgICAgICAgICBldmVudHMubGF5ZXJGaW5pc2hlZEV2ZW50KGxheWVyKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGV2ZW50cy5sYXllckZpbmlzaGVkRXZlbnQobGF5ZXIpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRvbmU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufTtcblxubGF5ZXIubmFtZSA9ICdFcGljZW50ZXInO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGxheWVyOyIsInZhciBsYXllckZpbmlzaGVkRXZlbnQgPSBmdW5jdGlvbiAobGF5ZXIpIHtcbiAgICB2YXIgZXZ0ID0gbmV3IEN1c3RvbUV2ZW50KCdsYXllckZpbmlzaGVkJywge2RldGFpbDogbGF5ZXJ9KTtcbiAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChldnQpO1xufTtcblxudmFyIGxheWVyc0ZpbmlzaGVkRXZlbnQgPSBmdW5jdGlvbiAobGF5ZXJzKSB7XG4gICAgdmFyIGV2dCA9IG5ldyBDdXN0b21FdmVudCgnbGF5ZXJzRmluaXNoZWQnLCB7ZGV0YWlsOiBsYXllcnN9KTtcbiAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChldnQpO1xufTtcblxudmFyIGV2ZW50cyA9IHtsYXllcnNGaW5pc2hlZEV2ZW50OiBsYXllcnNGaW5pc2hlZEV2ZW50LFxuICAgIGxheWVyRmluaXNoZWRFdmVudDogbGF5ZXJGaW5pc2hlZEV2ZW50fTtcblxubW9kdWxlLmV4cG9ydHMgPSBldmVudHM7IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgTWF0cml4ID0gcmVxdWlyZSgnLi9NYXRyaXgnKSxcbiAgICBWZWN0b3IgPSByZXF1aXJlKCcuL1ZlY3RvcicpLFxuICAgIFV0aWwgPSByZXF1aXJlKCd1dGlsL1V0aWwnKTtcblxuXG52YXIgX0RFRkFVTFRTID0ge1xuICBsb29rQXQ6IFswLCAwLCAwXSxcbiAgb3JpZ2luOiBbMTAwLCAxMDAsIDEwMF0sXG4gIHVwOiBbMCwgMCwgMV1cbn07XG5cblxuLyoqXG4gKiBDYW1lcmEgZGVmaW5lcyBhIGNvb3JkaW5hdGUgdHJhbnNsYXRpb24gZnJvbSBXb3JsZCBjb29yZGluYXRlcyAoWCwgWSwgWilcbiAqIHRvIENhbWVyYSBjb29yZGluYXRlcyAoeCwgeSwgeikuXG4gKlxuICogQWZ0ZXIgcHJvamVjdGlvbjpcbiAqICAgICAreiBpcyB0byBsb29rQXQgZnJvbSBjYW1lcmFcbiAqICAgICAreCBpcyByaWdodCBmcm9tIGNhbWVyYVxuICogICAgICt5IGlzIHVwIGZyb20gY2FtZXJhXG4gKlxuICogQHBhcmFtIG9wdGlvbnMge09iamVjdH1cbiAqIEBwYXJhbSBvcHRpb25zLm9yaWdpbiB7QXJyYXk8TnVtYmVyPn1cbiAqICAgICAgICBkZWZhdWx0IFsxMDAsIDEwMCwgMTAwXS5cbiAqICAgICAgICBwb3NpdGlvbiBvZiBjYW1lcmEgaW4gd29ybGQgY29vcmRpbmF0ZXMuXG4gKiBAcGFyYW0gb3B0aW9ucy5sb29rQXQge0FycmF5PE51bWJlcj59XG4gKiAgICAgICAgZGVmYXVsdCBbMCwgMCwgMF0uXG4gKiAgICAgICAgcG9zaXRpb24gZm9yIGNhbWVyYSB0byBsb29rIGF0IGluIHdvcmxkIGNvb3JkaW5hdGVzLlxuICogQHBhcmFtIG9wdGlvbnMudXAge0FycmF5PE51bWJlcj59XG4gKiAgICAgICAgZGVmYXVsdCBbMCwgMCwgMV0uXG4gKiAgICAgICAgdmVjdG9yIHBvaW50aW5nIHVwIGluIHdvcmxkIGNvb3JkaW5hdGVzLlxuICovXG52YXIgQ2FtZXJhID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgdmFyIF90aGlzLFxuICAgICAgX2luaXRpYWxpemUsXG4gICAgICAvLyB2YXJpYWJsZXNcbiAgICAgIF9sb29rQXQsXG4gICAgICBfb3JpZ2luLFxuICAgICAgX3VwLFxuICAgICAgX3dvcmxkVG9DYW1lcmE7XG5cblxuICBfdGhpcyA9IHt9O1xuXG4gIF9pbml0aWFsaXplID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICB2YXIgcm90YXRlLFxuICAgICAgICB0cmFuc2xhdGUsXG4gICAgICAgIHgsXG4gICAgICAgIHksXG4gICAgICAgIHo7XG5cbiAgICBvcHRpb25zID0gVXRpbC5leHRlbmQoe30sIF9ERUZBVUxUUywgb3B0aW9ucyk7XG5cbiAgICBfbG9va0F0ID0gVmVjdG9yKG9wdGlvbnMubG9va0F0KTtcbiAgICBfb3JpZ2luID0gVmVjdG9yKG9wdGlvbnMub3JpZ2luKTtcbiAgICBfdXAgPSBWZWN0b3Iob3B0aW9ucy51cCk7XG5cbiAgICAvLyBjYW1lcmEgYXhlcyB1c2luZyB3b3JsZCBjb29yZGluYXRlc1xuICAgIC8vICt6IGlzIGZyb20gb3JpZ2luIHRocm91Z2ggbG9vayBhdFxuICAgIHogPSBfbG9va0F0LnN1YnRyYWN0KF9vcmlnaW4pLnVuaXQoKTtcbiAgICAvLyAreCBpcyByaWdodFxuICAgIHggPSB6LmNyb3NzKF91cCkudW5pdCgpO1xuICAgIC8vICt5IGlzIHVwXG4gICAgeSA9IHguY3Jvc3MoeikudW5pdCgpO1xuXG4gICAgcm90YXRlID0gTWF0cml4KFtcbiAgICAgIHgueCgpLCB4LnkoKSwgeC56KCksIDAsXG4gICAgICB5LngoKSwgeS55KCksIHkueigpLCAwLFxuICAgICAgei54KCksIHoueSgpLCB6LnooKSwgMCxcbiAgICAgIDAsIDAsIDAsIDFcbiAgICBdLCA0LCA0KTtcblxuICAgIHRyYW5zbGF0ZSA9IE1hdHJpeChbXG4gICAgICAxLCAwLCAwLCAtX29yaWdpbi54KCksXG4gICAgICAwLCAxLCAwLCAtX29yaWdpbi55KCksXG4gICAgICAwLCAwLCAxLCAtX29yaWdpbi56KCksXG4gICAgICAwLCAwLCAwLCAxXG4gICAgXSwgNCwgNCk7XG5cbiAgICBfd29ybGRUb0NhbWVyYSA9IHJvdGF0ZS5tdWx0aXBseSh0cmFuc2xhdGUpLmRhdGEoKTtcbiAgfTtcblxuICAvKipcbiAgICogUHJvamVjdCBhIHBvaW50IGZyb20gd29ybGQgY29vcmRpbmF0ZXMgdG8gY2FtZXJhIGNvb3JkaW5hdGVzLlxuICAgKlxuICAgKiBAcGFyYW0gd29ybGQge0FycmF5PE51bWJlcj59XG4gICAqICAgICAgICB4LCB5LCB6IHdvcmxkIGNvb3JkaW5hdGVzLlxuICAgKiBAcmV0dXJuIHtBcnJheTxOdW1iZXI+fVxuICAgKiAgICAgICAgeCwgeSwgeiwgY2FtZXJhIGNvb3JkaW5hdGVzLlxuICAgKi9cbiAgX3RoaXMucHJvamVjdCA9IGZ1bmN0aW9uICh3b3JsZCkge1xuICAgIHZhciBwcm9qZWN0ZWQsXG4gICAgICAgIHgsXG4gICAgICAgIHhwLFxuICAgICAgICB5LFxuICAgICAgICB5cCxcbiAgICAgICAgeixcbiAgICAgICAgenA7XG5cbiAgICB4ID0gd29ybGRbMF07XG4gICAgeSA9IHdvcmxkWzFdO1xuICAgIHogPSB3b3JsZFsyXTtcbiAgICBwcm9qZWN0ZWQgPSBNYXRyaXgubXVsdGlwbHkoX3dvcmxkVG9DYW1lcmEsIDQsIDQsIFt4LCB5LCB6LCAxXSwgNCwgMSk7XG5cbiAgICB4cCA9IHByb2plY3RlZFswXTtcbiAgICB5cCA9IHByb2plY3RlZFsxXTtcbiAgICB6cCA9IHByb2plY3RlZFsyXTtcbiAgICByZXR1cm4gW3hwLCB5cCwgenBdO1xuICB9O1xuXG5cbiAgX2luaXRpYWxpemUob3B0aW9ucyk7XG4gIG9wdGlvbnMgPSBudWxsO1xuICByZXR1cm4gX3RoaXM7XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gQ2FtZXJhO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgVmVjdG9yID0gcmVxdWlyZSgnLi9WZWN0b3InKTtcblxuXG4vLyBzdGF0aWMgbWV0aG9kcyB0aGF0IG9wZXJhdGUgb24gYXJyYXlzXG52YXIgX19jb2wsXG4gICAgX19kaWFnb25hbCxcbiAgICBfX2dldCxcbiAgICBfX2lkZW50aXR5LFxuICAgIF9faW5kZXgsXG4gICAgX19qYWNvYmksXG4gICAgX19tdWx0aXBseSxcbiAgICBfX3JvdyxcbiAgICBfX3NldCxcbiAgICBfX3N0cmluZ2lmeSxcbiAgICBfX3RyYW5zcG9zZTtcblxuXG4vKipcbiAqIEV4dHJhY3QgYSBjb2x1bW4gZnJvbSB0aGlzIG1hdHJpeC5cbiAqXG4gKiBAcGFyYW0gZGF0YSB7QXJyYXk8TnVtYmVyPn1cbiAqICAgICAgICBtYXRyaXggZGF0YS5cbiAqIEBwYXJhbSBtIHtOdW1iZXJ9XG4gKiAgICAgICAgbnVtYmVyIG9mIHJvd3MuXG4gKiBAcGFyYW0gbiB7TnVtYmVyfVxuICogICAgICAgIG51bWJlciBvZiBjb2x1bW5zLlxuICogQHBhcmFtIGNvbCB7TnVtYmVyfVxuICogICAgICAgIGluZGV4IG9mIGNvbHVtbiwgaW4gcmFuZ2UgWzAsbilcbiAqIEB0aHJvd3MgRXJyb3IgaWYgY29sdW1uIG91dCBvZiByYW5nZS5cbiAqIEByZXR1cm4ge0FycmF5PE51bWJlcj59IGNvbHVtbiBlbGVtZW50cy5cbiAqL1xuX19jb2wgPSBmdW5jdGlvbiAoZGF0YSwgbSwgbiwgY29sKSB7XG4gIHZhciByb3csXG4gICAgICB2YWx1ZXMgPSBbXTtcbiAgaWYgKGNvbCA8IDAgfHwgY29sID49IG4pIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2NvbHVtbiAnICsgY29sICsgJyBvdXQgb2YgcmFuZ2UgWzAsJyArIG4gKyAnKScpO1xuICB9XG4gIGlmIChuID09PSAxKSB7XG4gICAgLy8gb25seSBvbmUgY29sdW1uIGluIG1hdHJpeFxuICAgIHJldHVybiBkYXRhO1xuICB9XG4gIHZhbHVlcyA9IFtdO1xuICBmb3IgKHJvdyA9IDA7IHJvdyA8IG07IHJvdysrKSB7XG4gICAgdmFsdWVzLnB1c2goZGF0YVtfX2luZGV4KG0sIG4sIHJvdywgY29sKV0pO1xuICB9XG4gIHJldHVybiB2YWx1ZXM7XG59O1xuXG4vKipcbiAqIEdldCBhcnJheSBvZiBlbGVtZW50cyBvbiB0aGUgZGlhZ29uYWwuXG4gKlxuICogQHBhcmFtIGRhdGEge0FycmF5PE51bWJlcj59XG4gKiAgICAgICAgbWF0cml4IGRhdGEuXG4gKiBAcGFyYW0gbSB7TnVtYmVyfVxuICogICAgICAgIG51bWJlciBvZiByb3dzLlxuICogQHBhcmFtIG4ge051bWJlcn1cbiAqICAgICAgICBudW1iZXIgb2YgY29sdW1ucy5cbiAqIEByZXR1cm4ge0FycmF5PE51bWJlcj59IGVsZW1lbnRzIG9uIHRoZSBkaWFnb25hbC5cbiAqL1xuX19kaWFnb25hbCA9IGZ1bmN0aW9uIChkYXRhLCBtLCBuKSB7XG4gIHZhciBsZW4gPSBNYXRoLm1pbihtLCBuKSxcbiAgICAgIGRpYWcgPSBbXSxcbiAgICAgIGk7XG4gIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgIGRpYWcucHVzaChkYXRhW19faW5kZXgobSwgbiwgaSwgaSldKTtcbiAgfVxuICByZXR1cm4gZGlhZztcbn07XG5cbi8qKlxuICogR2V0IHRoZSB2YWx1ZSBvZiBhbiBlbGVtZW50IG9mIHRoaXMgbWF0cml4LlxuICpcbiAqIEBwYXJhbSBkYXRhIHtBcnJheTxOdW1iZXI+fVxuICogICAgICAgIG1hdHJpeCBkYXRhLlxuICogQHBhcmFtIG0ge051bWJlcn1cbiAqICAgICAgICBudW1iZXIgb2Ygcm93cy5cbiAqIEBwYXJhbSBuIHtOdW1iZXJ9XG4gKiAgICAgICAgbnVtYmVyIG9mIGNvbHVtbnMuXG4gKiBAcGFyYW0gcm93IHtOdW1iZXJ9XG4gKiAgICAgICAgcm93IG9mIGVsZW1lbnQsIGluIHJhbmdlIFswLG0pXG4gKiBAcGFyYW0gY29sIHtOdW1iZXJ9XG4gKiAgICAgICAgY29sdW1uIG9mIGVsZW1lbnQsIGluIHJhbmdlIFswLG4pXG4gKiBAdGhyb3dzIEVycm9yIGlmIHJvdyBvciBjb2wgYXJlIG91dCBvZiByYW5nZS5cbiAqIEByZXR1cm4ge051bWJlcn0gdmFsdWUuXG4gKi9cbl9fZ2V0ID0gZnVuY3Rpb24gKGRhdGEsIG0sIG4sIHJvdywgY29sKSB7XG4gIHJldHVybiBkYXRhW19faW5kZXgobSwgbiwgcm93LCBjb2wpXTtcbn07XG5cbi8qKlxuICogQ3JlYXRlIGFuIGlkZW50aXR5IE1hdHJpeC5cbiAqXG4gKiBAcGFyYW0gbiB7TnVtYmVyfVxuICogICAgICAgIG51bWJlciBvZiByb3dzIGFuZCBjb2x1bW5zLlxuICogQHJldHVybiBpZGVudGl0eSBtYXRyaXggb2Ygc2l6ZSBuLlxuICovXG5fX2lkZW50aXR5ID0gZnVuY3Rpb24gKG4pIHtcbiAgdmFyIHZhbHVlcyA9IFtdLFxuICAgICAgcm93LFxuICAgICAgY29sO1xuICBmb3IgKHJvdyA9IDA7IHJvdyA8IG47IHJvdysrKSB7XG4gICAgZm9yIChjb2wgPSAwOyBjb2wgPCBuOyBjb2wrKykge1xuICAgICAgdmFsdWVzLnB1c2goKHJvdyA9PT0gY29sKSA/IDEgOiAwKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHZhbHVlcztcbn07XG5cbi8qKlxuICogR2V0IHRoZSBpbmRleCBvZiBhbiBlbGVtZW50IG9mIHRoaXMgbWF0cml4LlxuICpcbiAqIEBwYXJhbSBkYXRhIHtBcnJheTxOdW1iZXI+fVxuICogICAgICAgIG1hdHJpeCBkYXRhLlxuICogQHBhcmFtIG0ge051bWJlcn1cbiAqICAgICAgICBudW1iZXIgb2Ygcm93cy5cbiAqIEBwYXJhbSBuIHtOdW1iZXJ9XG4gKiAgICAgICAgbnVtYmVyIG9mIGNvbHVtbnMuXG4gKiBAcGFyYW0gcm93IHtOdW1iZXJ9XG4gKiAgICAgICAgcm93IG9mIGVsZW1lbnQsIGluIHJhbmdlIFswLG0pXG4gKiBAcGFyYW0gY29sIHtOdW1iZXJ9XG4gKiAgICAgICAgY29sdW1uIG9mIGVsZW1lbnQsIGluIHJhbmdlIFswLG4pXG4gKiBAcmV0dXJuIHtOdW1iZXJ9IGluZGV4LlxuICovXG5fX2luZGV4ID0gZnVuY3Rpb24gKG0sIG4sIHJvdywgY29sKSB7XG4gIHJldHVybiBuICogcm93ICsgY29sO1xufTtcblxuLyoqXG4gKiBKYWNvYmkgZWlnZW52YWx1ZSBhbGdvcml0aG0uXG4gKlxuICogUG9ydGVkIGZyb206XG4gKiAgICAgaHR0cDovL3VzZXJzLXBoeXMuYXUuZGsvZmVkb3Jvdi9udWNsdGhlby9OdW1lcmljL25vdy9laWdlbi5wZGZcbiAqXG4gKiBBbiBpdGVyYXRpdmUgbWV0aG9kIGZvciBlaWdlbnZhbHVlcyBhbmQgZWlnZW52ZWN0b3JzLFxuICogb25seSB3b3JrcyBvbiBzeW1tZXRyaWMgbWF0cmljZXMuXG4gKlxuICogQHBhcmFtIGRhdGEge0FycmF5PE51bWJlcj59XG4gKiAgICAgICAgbWF0cml4IGRhdGEuXG4gKiBAcGFyYW0gbSB7TnVtYmVyfVxuICogICAgICAgIG51bWJlciBvZiByb3dzLlxuICogQHBhcmFtIG4ge051bWJlcn1cbiAqICAgICAgICBudW1iZXIgb2YgY29sdW1ucy5cbiAqIEBwYXJhbSBtYXhSb3RhdGlvbnMge051bWJlcn1cbiAqICAgICAgICBtYXhpbXVtIG51bWJlciBvZiByb3RhdGlvbnMuXG4gKiAgICAgICAgT3B0aW9uYWwsIGRlZmF1bHQgMTAwLlxuICogQHJldHVybiB7QXJyYXk8VmVjdG9yPn0gYXJyYXkgb2YgZWlnZW52ZWN0b3JzLCBtYWduaXR1ZGUgaXMgZWlnZW52YWx1ZS5cbiAqL1xuX19qYWNvYmkgPSBmdW5jdGlvbiAoZGF0YSwgbSwgbiwgbWF4Um90YXRpb25zKSB7XG4gIHZhciBhLFxuICAgICAgYWlwLFxuICAgICAgYWlxLFxuICAgICAgYXBpLFxuICAgICAgYXBwLFxuICAgICAgYXBwMSxcbiAgICAgIGFwcSxcbiAgICAgIGFxaSxcbiAgICAgIGFxcSxcbiAgICAgIGFxcTEsXG4gICAgICBjLFxuICAgICAgY2hhbmdlZCxcbiAgICAgIGUsXG4gICAgICBpLFxuICAgICAgaXAsXG4gICAgICBpcSxcbiAgICAgIHAsXG4gICAgICBwaGksXG4gICAgICBwaSxcbiAgICAgIHEsXG4gICAgICBxaSxcbiAgICAgIHJvdGF0aW9ucyxcbiAgICAgIHMsXG4gICAgICB2LFxuICAgICAgdmVjdG9yLFxuICAgICAgdmVjdG9ycyxcbiAgICAgIHZpcCxcbiAgICAgIHZpcTtcblxuICBpZiAobSAhPT0gbikge1xuICAgIHRocm93IG5ldyBFcnJvcignSmFjb2JpIG9ubHkgd29ya3Mgb24gc3ltbWV0cmljLCBzcXVhcmUgbWF0cmljZXMnKTtcbiAgfVxuXG4gIC8vIHNldCBhIGRlZmF1bHQgbWF4XG4gIG1heFJvdGF0aW9ucyA9IG1heFJvdGF0aW9ucyB8fCAxMDA7XG4gIGEgPSBkYXRhLnNsaWNlKDApO1xuICBlID0gX19kaWFnb25hbChkYXRhLCBtLCBuKTtcbiAgdiA9IF9faWRlbnRpdHkobik7XG4gIHJvdGF0aW9ucyA9IDA7XG5cbiAgZG8ge1xuICAgIGNoYW5nZWQgPSBmYWxzZTtcblxuICAgIGZvciAocD0wOyBwPG47IHArKykge1xuICAgICAgZm9yIChxPXArMTsgcTxuOyBxKyspIHtcbiAgICAgICAgYXBwID0gZVtwXTtcbiAgICAgICAgYXFxID0gZVtxXTtcbiAgICAgICAgYXBxID0gYVtuICogcCArIHFdO1xuICAgICAgICBwaGkgPSAwLjUgKiBNYXRoLmF0YW4yKDIgKiBhcHEsIGFxcSAtIGFwcCk7XG4gICAgICAgIGMgPSBNYXRoLmNvcyhwaGkpO1xuICAgICAgICBzID0gTWF0aC5zaW4ocGhpKTtcbiAgICAgICAgYXBwMSA9IGMgKiBjICogYXBwIC0gMiAqIHMgKiBjICogYXBxICsgcyAqIHMgKiBhcXE7XG4gICAgICAgIGFxcTEgPSBzICogcyAqIGFwcCArIDIgKiBzICogYyAqIGFwcSArIGMgKiBjICogYXFxO1xuXG4gICAgICAgIGlmIChhcHAxICE9PSBhcHAgfHwgYXFxMSAhPT0gYXFxKSB7XG4gICAgICAgICAgY2hhbmdlZCA9IHRydWU7XG4gICAgICAgICAgcm90YXRpb25zKys7XG5cbiAgICAgICAgICBlW3BdID0gYXBwMTtcbiAgICAgICAgICBlW3FdID0gYXFxMTtcbiAgICAgICAgICBhW24gKiBwICsgcV0gPSAwO1xuXG4gICAgICAgICAgZm9yIChpID0gMDsgaSA8IHA7IGkrKykge1xuICAgICAgICAgICAgaXAgPSBuICogaSArIHA7XG4gICAgICAgICAgICBpcSA9IG4gKiBpICsgcTtcbiAgICAgICAgICAgIGFpcCA9IGFbaXBdO1xuICAgICAgICAgICAgYWlxID0gYVtpcV07XG4gICAgICAgICAgICBhW2lwXSA9IGMgKiBhaXAgLSBzICogYWlxO1xuICAgICAgICAgICAgYVtpcV0gPSBjICogYWlxICsgcyAqIGFpcDtcbiAgICAgICAgICB9XG4gICAgICAgICAgZm9yIChpID0gcCArIDE7IGkgPCBxOyBpKyspIHtcbiAgICAgICAgICAgIHBpID0gbiAqIHAgKyBpO1xuICAgICAgICAgICAgaXEgPSBuICogaSArIHE7XG4gICAgICAgICAgICBhcGkgPSBhW3BpXTtcbiAgICAgICAgICAgIGFpcSA9IGFbaXFdO1xuICAgICAgICAgICAgYVtwaV0gPSBjICogYXBpIC0gcyAqIGFpcTtcbiAgICAgICAgICAgIGFbaXFdID0gYyAqIGFpcSArIHMgKiBhcGk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGZvciAoaSA9IHEgKyAxOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgICAgICBwaSA9IG4gKiBwICsgaTtcbiAgICAgICAgICAgIHFpID0gbiAqIHEgKyBpO1xuICAgICAgICAgICAgYXBpID0gYVtwaV07XG4gICAgICAgICAgICBhcWkgPSBhW3FpXTtcbiAgICAgICAgICAgIGFbcGldID0gYyAqIGFwaSAtIHMgKiBhcWk7XG4gICAgICAgICAgICBhW3FpXSA9IGMgKiBhcWkgKyBzICogYXBpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgICAgICBpcCA9IG4gKiBpICsgcDtcbiAgICAgICAgICAgIGlxID0gbiAqIGkgKyBxO1xuICAgICAgICAgICAgdmlwID0gdltpcF07XG4gICAgICAgICAgICB2aXEgPSB2W2lxXTtcbiAgICAgICAgICAgIHZbaXBdID0gYyAqIHZpcCAtIHMgKiB2aXE7XG4gICAgICAgICAgICB2W2lxXSA9IGMgKiB2aXEgKyBzICogdmlwO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSB3aGlsZSAoY2hhbmdlZCAmJiAocm90YXRpb25zIDwgbWF4Um90YXRpb25zKSk7XG5cbiAgaWYgKGNoYW5nZWQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2ZhaWxlZCB0byBjb252ZXJnZScpO1xuICB9XG5cbiAgdmVjdG9ycyA9IFtdO1xuICBmb3IgKGkgPSAwOyBpIDwgbjsgaSsrKSB7XG4gICAgLy8gaS10aCB2ZWN0b3IgaXMgaS10aCBjb2x1bW5cbiAgICB2ZWN0b3IgPSBWZWN0b3IoX19jb2wodiwgbSwgbiwgaSkpO1xuICAgIHZlY3Rvci5laWdlbnZhbHVlID0gZVtpXTtcbiAgICB2ZWN0b3JzLnB1c2godmVjdG9yKTtcbiAgfVxuXG4gIHJldHVybiB2ZWN0b3JzO1xufTtcblxuLyoqXG4gKiBNdWx0aXBseSB0aGlzIG1hdHJpeCBieSBhbm90aGVyIG1hdHJpeC5cbiAqXG4gKiBAcGFyYW0gZGF0YTEge0FycmF5PE51bWJlcj59XG4gKiAgICAgICAgZmlyc3QgbWF0cml4IGRhdGEuXG4gKiBAcGFyYW0gbTEge051bWJlcn1cbiAqICAgICAgICBudW1iZXIgb2Ygcm93cyBpbiBmaXJzdCBtYXRyaXguXG4gKiBAcGFyYW0gbjEge051bWJlcn1cbiAqICAgICAgICBudW1iZXIgb2YgY29sdW1ucyBpbiBmaXJzdCBtYXRyaXguXG4gKiBAcGFyYW0gZGF0YTIge0FycmF5PE51bWJlcj59XG4gKiAgICAgICAgc2Vjb25kIG1hdHJpeCBkYXRhLlxuICogQHBhcmFtIG0yIHtOdW1iZXJ9XG4gKiAgICAgICAgbnVtYmVyIG9mIHJvd3MgaW4gc2Vjb25kIG1hdHJpeC5cbiAqIEBwYXJhbSBuMiB7TnVtYmVyfVxuICogICAgICAgIG51bWJlciBvZiBjb2x1bW5zIGluIHNlY29uZCBtYXRyaXguXG4gKiBAdGhyb3dzIEVycm9yIGlmIG4xICE9PSBtMlxuICogQHJldHVybiByZXN1bHQgb2YgbXVsdGlwbGljYXRpb24gKG9yaWdpbmFsIG1hdHJpeCBpcyB1bmNoYW5nZWQpLlxuICovXG5fX211bHRpcGx5ID0gZnVuY3Rpb24gKGRhdGExLCBtMSwgbjEsIGRhdGEyLCBtMiwgbjIpIHtcbiAgdmFyIGNvbCxcbiAgICAgIGNvbDIsXG4gICAgICByb3csXG4gICAgICByb3cxLFxuICAgICAgdmFsdWVzO1xuXG4gIGlmIChuMSAhPT0gbTIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3dyb25nIGNvbWJpbmF0aW9uIG9mIHJvd3MgYW5kIGNvbHMnKTtcbiAgfVxuICB2YWx1ZXMgPSBbXTtcbiAgZm9yIChyb3cgPSAwOyByb3cgPCBtMTsgcm93KyspIHtcbiAgICByb3cxID0gX19yb3coZGF0YTEsIG0xLCBuMSwgcm93KTtcbiAgICBmb3IgKGNvbCA9IDA7IGNvbCA8IG4yOyBjb2wrKykge1xuICAgICAgY29sMiA9IF9fY29sKGRhdGEyLCBtMiwgbjIsIGNvbCk7XG4gICAgICAvLyByZXN1bHQgaXMgZG90IHByb2R1Y3RcbiAgICAgIHZhbHVlcy5wdXNoKFZlY3Rvci5kb3Qocm93MSwgY29sMikpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdmFsdWVzO1xufTtcblxuLyoqXG4gKiBFeHRyYWN0IGEgcm93IGZyb20gdGhpcyBtYXRyaXguXG4gKlxuICogQHBhcmFtIGRhdGEge0FycmF5PE51bWJlcj59XG4gKiAgICAgICAgbWF0cml4IGRhdGEuXG4gKiBAcGFyYW0gbSB7TnVtYmVyfVxuICogICAgICAgIG51bWJlciBvZiByb3dzLlxuICogQHBhcmFtIG4ge051bWJlcn1cbiAqICAgICAgICBudW1iZXIgb2YgY29sdW1ucy5cbiAqIEBwYXJhbSByb3cge051bWJlcn1cbiAqICAgICAgICBpbmRleCBvZiByb3csIGluIHJhbmdlIFswLG0pXG4gKiBAdGhyb3dzIEVycm9yIGlmIHJvdyBvdXQgb2YgcmFuZ2UuXG4gKiBAcmV0dXJuIHtBcnJheTxOdW1iZXI+fSByb3cgZWxlbWVudHMuXG4gKi9cbl9fcm93ID0gZnVuY3Rpb24gKGRhdGEsIG0sIG4sIHJvdykge1xuICB2YXIgY29sLFxuICAgICAgdmFsdWVzO1xuICBpZiAocm93IDwgMCB8fCByb3cgPj0gbSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncm93ICcgKyByb3cgKyAnIG91dCBvZiByYW5nZSBbMCwnICsgbSArICcpJyk7XG4gIH1cbiAgdmFsdWVzID0gW107XG4gIGZvciAoY29sID0gMDsgY29sIDwgbjsgY29sKyspIHtcbiAgICB2YWx1ZXMucHVzaChkYXRhW19faW5kZXgobSwgbiwgcm93LCBjb2wpXSk7XG4gIH1cbiAgcmV0dXJuIHZhbHVlcztcbn07XG5cbi8qKlxuICogU2V0IHRoZSB2YWx1ZSBvZiBhbiBlbGVtZW50IG9mIHRoaXMgbWF0cml4LlxuICpcbiAqIE5PVEU6IHRoaXMgbWV0aG9kIG1vZGlmaWVzIHRoZSBjb250ZW50cyBvZiB0aGlzIG1hdHJpeC5cbiAqXG4gKiBAcGFyYW0gZGF0YSB7QXJyYXk8TnVtYmVyPn1cbiAqICAgICAgICBtYXRyaXggZGF0YS5cbiAqIEBwYXJhbSBtIHtOdW1iZXJ9XG4gKiAgICAgICAgbnVtYmVyIG9mIHJvd3MuXG4gKiBAcGFyYW0gbiB7TnVtYmVyfVxuICogICAgICAgIG51bWJlciBvZiBjb2x1bW5zLlxuICogQHBhcmFtIHJvdyB7TnVtYmVyfVxuICogICAgICAgIHJvdyBvZiBlbGVtZW50LCBpbiByYW5nZSBbMCxtKVxuICogQHBhcmFtIGNvbCB7TnVtYmVyfVxuICogICAgICAgIGNvbHVtbiBvZiBlbGVtZW50LCBpbiByYW5nZSBbMCxuKVxuICogQHBhcmFtIHZhbHVlIHtOdW1iZXJ9XG4gKiAgICAgICAgdmFsdWUgdG8gc2V0LlxuICogQHRocm93cyBFcnJvciBpZiByb3cgb3IgY29sIGFyZSBvdXQgb2YgcmFuZ2UuXG4gKi9cbl9fc2V0ID0gZnVuY3Rpb24gKGRhdGEsIG0sIG4sIHJvdywgY29sLCB2YWx1ZSkge1xuICBkYXRhW19faW5kZXgobSwgbiwgcm93LCBjb2wpXSA9IHZhbHVlO1xufTtcblxuLyoqXG4gKiBEaXNwbGF5IG1hdHJpeCBhcyBhIHN0cmluZy5cbiAqXG4gKiBAcGFyYW0gZGF0YSB7QXJyYXk8TnVtYmVyPn1cbiAqICAgICAgICBtYXRyaXggZGF0YS5cbiAqIEBwYXJhbSBtIHtOdW1iZXJ9XG4gKiAgICAgICAgbnVtYmVyIG9mIHJvd3MuXG4gKiBAcGFyYW0gbiB7TnVtYmVyfVxuICogICAgICAgIG51bWJlciBvZiBjb2x1bW5zLlxuICogQHJldHVybiB7U3RyaW5nfSBmb3JtYXR0ZWQgbWF0cml4LlxuICovXG5fX3N0cmluZ2lmeSA9IGZ1bmN0aW9uIChkYXRhLCBtLCBuKSB7XG4gIHZhciBsYXN0Um93ID0gbSAtIDEsXG4gICAgICBsYXN0Q29sID0gbiAtIDEsXG4gICAgICBidWYgPSBbXSxcbiAgICAgIHJvdyxcbiAgICAgIGNvbDtcblxuICBidWYucHVzaCgnWycpO1xuICBmb3IgKHJvdyA9IDA7IHJvdyA8IG07IHJvdysrKSB7XG4gICAgZm9yIChjb2wgPSAwOyBjb2wgPCBuOyBjb2wrKykge1xuICAgICAgYnVmLnB1c2goXG4gICAgICAgICAgZGF0YVtuICogcm93ICsgY29sXSxcbiAgICAgICAgICAoY29sICE9PSBsYXN0Q29sIHx8IHJvdyAhPT0gbGFzdFJvdykgPyAnLCAnIDogJycpO1xuICAgIH1cbiAgICBpZiAocm93ICE9PSBsYXN0Um93KSB7XG4gICAgICBidWYucHVzaCgnXFxuICcpO1xuICAgIH1cbiAgfVxuICBidWYucHVzaCgnXScpO1xuICByZXR1cm4gYnVmLmpvaW4oJycpO1xufTtcblxuLyoqXG4gKiBUcmFuc3Bvc2UgdGhpcyBtYXRyaXguXG4gKlxuICogQHBhcmFtIGRhdGEge0FycmF5PE51bWJlcj59XG4gKiAgICAgICAgbWF0cml4IGRhdGEuXG4gKiBAcGFyYW0gbSB7TnVtYmVyfVxuICogICAgICAgIG51bWJlciBvZiByb3dzLlxuICogQHBhcmFtIG4ge051bWJlcn1cbiAqICAgICAgICBudW1iZXIgb2YgY29sdW1ucy5cbiAqIEByZXR1cm4gdHJhbnNwb3NlZCBtYXRyaXggKG9yaWdpbmFsIG1hdHJpeCBpcyB1bmNoYW5nZWQpLlxuICovXG5fX3RyYW5zcG9zZSA9IGZ1bmN0aW9uIChkYXRhLCBtLCBuKSB7XG4gIHZhciB2YWx1ZXMgPSBbXSxcbiAgICAgIHJvdyxcbiAgICAgIGNvbDtcbiAgZm9yIChjb2wgPSAwOyBjb2wgPCBuOyBjb2wrKykge1xuICAgIGZvciAocm93ID0gMDsgcm93IDwgbTsgcm93KyspIHtcbiAgICAgIHZhbHVlcy5wdXNoKGRhdGFbX19pbmRleChtLCBuLCByb3csIGNvbCldKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHZhbHVlcztcbn07XG5cblxuLyoqXG4gKiBDb25zdHJ1Y3QgYSBuZXcgTWF0cml4IG9iamVjdC5cbiAqXG4gKiBJZiBtIGFuZCBuIGFyZSBvbWl0dGVkLCBNYXRyaXggaXMgYXNzdW1lZCB0byBiZSBzcXVhcmUgYW5kXG4gKiBkYXRhIGxlbmd0aCBpcyB1c2VkIHRvIGNvbXB1dGUgc2l6ZS5cbiAqXG4gKiBJZiBtIG9yIG4gYXJlIG9taXR0ZWQsIGRhdGEgbGVuZ3RoIGlzIHVzZWQgdG8gY29tcHV0ZSBvbWl0dGVkIHZhbHVlLlxuICpcbiAqIEBwYXJhbSBkYXRhIHtBcnJheX1cbiAqICAgICAgICBtYXRyaXggZGF0YS5cbiAqIEBwYXJhbSBtIHtOdW1iZXJ9XG4gKiAgICAgICAgbnVtYmVyIG9mIHJvd3MuXG4gKiBAcGFyYW0gbiB7TnVtYmVyfVxuICogICAgICAgIG51bWJlciBvZiBjb2x1bW5zLlxuICovXG52YXIgTWF0cml4ID0gZnVuY3Rpb24gKGRhdGEsIG0sIG4pIHtcbiAgdmFyIF90aGlzLFxuICAgICAgX2luaXRpYWxpemUsXG4gICAgICAvLyB2YXJpYWJsZXNcbiAgICAgIF9kYXRhLFxuICAgICAgX20sXG4gICAgICBfbjtcblxuXG4gIF90aGlzID0ge307XG5cbiAgX2luaXRpYWxpemUgPSBmdW5jdGlvbiAoZGF0YSwgbSwgbikge1xuICAgIF9kYXRhID0gZGF0YTtcbiAgICBfbSA9IG07XG4gICAgX24gPSBuO1xuXG4gICAgaWYgKG0gJiYgbikge1xuICAgICAgLy8gZG9uZVxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIHRyeSB0byBjb21wdXRlIHNpemUgYmFzZWQgb24gZGF0YVxuICAgIGlmICghbSAmJiAhbikge1xuICAgICAgdmFyIHNpZGUgPSBNYXRoLnNxcnQoZGF0YS5sZW5ndGgpO1xuICAgICAgaWYgKHNpZGUgIT09IHBhcnNlSW50KHNpZGUsIDEwKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ21hdHJpeCBtLG4gdW5zcGVjaWZpZWQsIGFuZCBtYXRyaXggbm90IHNxdWFyZScpO1xuICAgICAgfVxuICAgICAgX20gPSBzaWRlO1xuICAgICAgX24gPSBzaWRlO1xuICAgIH0gZWxzZSBpZiAoIW0pIHtcbiAgICAgIF9tID0gZGF0YS5sZW5ndGggLyBuO1xuICAgICAgaWYgKF9tICE9PSBwYXJzZUludChfbSwgMTApKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignd3JvbmcgbnVtYmVyIG9mIGRhdGEgZWxlbWVudHMnKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKCFuKSB7XG4gICAgICBfbiA9IGRhdGEubGVuZ3RoIC8gbTtcbiAgICAgIGlmIChfbiAhPT0gcGFyc2VJbnQoX24sIDEwKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3dyb25nIG51bWJlciBvZiBkYXRhIGVsZW1lbnRzJyk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBBZGQgbWF0cmljZXMuXG4gICAqXG4gICAqIEBwYXJhbSB0aGF0IHtNYXRyaXh9XG4gICAqICAgICAgICBtYXRyaXggdG8gYWRkLlxuICAgKiBAdGhyb3dzIEVycm9yIGlmIGRpbWVuc2lvbnMgZG8gbm90IG1hdGNoLlxuICAgKiBAcmV0dXJuIHJlc3VsdCBvZiBhZGRpdGlvbiAob3JpZ2luYWwgbWF0cml4IGlzIHVuY2hhbmdlZCkuXG4gICAqL1xuICBfdGhpcy5hZGQgPSBmdW5jdGlvbiAodGhhdCkge1xuICAgIGlmIChfbSAhPT0gdGhhdC5tKCkgfHwgbiAhPT0gdGhhdC5uKCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignbWF0cmljZXMgbXVzdCBiZSBzYW1lIHNpemUnKTtcbiAgICB9XG4gICAgcmV0dXJuIE1hdHJpeChWZWN0b3IuYWRkKF9kYXRhLCB0aGF0LmRhdGEoKSksIF9tLCBfbik7XG4gIH07XG5cbiAgLyoqXG4gICAqIEdldCBhIGNvbHVtbiBmcm9tIHRoaXMgbWF0cml4LlxuICAgKlxuICAgKiBAcGFyYW0gY29sIHtOdW1iZXJ9XG4gICAqICAgICAgICB6ZXJvLWJhc2VkIGNvbHVtbiBpbmRleC5cbiAgICogQHJldHVybiB7QXJyYXk8TnVtYmVyPn0gYXJyYXkgY29udGFpbmluZyBlbGVtZW50cyBmcm9tIGNvbHVtbi5cbiAgICovXG4gIF90aGlzLmNvbCA9IGZ1bmN0aW9uIChjb2wpIHtcbiAgICByZXR1cm4gX19jb2woX2RhdGEsIF9tLCBfbiwgY29sKTtcbiAgfTtcblxuICAvKipcbiAgICogQWNjZXNzIHRoZSB3cmFwcGVkIGFycmF5LlxuICAgKi9cbiAgX3RoaXMuZGF0YSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gX2RhdGE7XG4gIH07XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgZGlhZ29uYWwgZnJvbSB0aGlzIG1hdHJpeC5cbiAgICpcbiAgICogQHJldHVybiB7QXJyYXk8TnVtYmVyPn0gYXJyYXkgY29udGFpbmluZyBlbGVtZW50cyBmcm9tIGRpYWdvbmFsLlxuICAgKi9cbiAgX3RoaXMuZGlhZ29uYWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIF9fZGlhZ29uYWwoX2RhdGEsIF9tLCBfbik7XG4gIH07XG5cbiAgLyoqXG4gICAqIEdldCBhIHZhbHVlIGZyb20gdGhpcyBtYXRyaXguXG4gICAqXG4gICAqIEBwYXJhbSByb3cge051bWJlcn1cbiAgICogICAgICAgIHplcm8tYmFzZWQgaW5kZXggb2Ygcm93LlxuICAgKiBAcGFyYW0gY29sIHtOdW1iZXJ9XG4gICAqICAgICAgICB6ZXJvLWJhc2VkIGluZGV4IG9mIGNvbHVtbi5cbiAgICogQHJldHVybiB7TnVtYmVyfSB2YWx1ZSBhdCAocm93LCBjb2wpLlxuICAgKi9cbiAgX3RoaXMuZ2V0ID0gZnVuY3Rpb24gKHJvdywgY29sKSB7XG4gICAgcmV0dXJuIF9fZ2V0KF9kYXRhLCBfbSwgX24sIHJvdywgY29sKTtcbiAgfTtcblxuICAvKipcbiAgICogQ29tcHV0ZSB0aGUgZWlnZW52ZWN0b3JzIG9mIHRoaXMgbWF0cml4LlxuICAgKlxuICAgKiBOT1RFOiBNYXRyaXggc2hvdWxkIGJlIDN4MyBhbmQgc3ltbWV0cmljLlxuICAgKlxuICAgKiBAcGFyYW0gbWF4Um90YXRpb25zIHtOdW1iZXJ9XG4gICAqICAgICAgICBkZWZhdWx0IDEwMC5cbiAgICogICAgICAgIG1heGltdW0gbnVtYmVyIG9mIGl0ZXJhdGlvbnMuXG4gICAqIEByZXR1cm4ge0FycmF5PFZlY3Rvcj59IGVpZ2VudmVjdG9ycy5cbiAgICogICAgICAgICBNYWduaXR1ZGUgb2YgZWFjaCB2ZWN0b3IgaXMgZWlnZW52YWx1ZS5cbiAgICovXG4gIF90aGlzLmphY29iaSA9IGZ1bmN0aW9uIChtYXhSb3RhdGlvbnMpIHtcbiAgICByZXR1cm4gX19qYWNvYmkoX2RhdGEsIF9tLCBfbiwgbWF4Um90YXRpb25zKTtcbiAgfTtcblxuICAvKipcbiAgICogR2V0IHRoZSBudW1iZXIgb2Ygcm93cyBpbiBtYXRyaXguXG4gICAqXG4gICAqIEByZXR1cm4ge051bWJlcn1cbiAgICogICAgICAgICBudW1iZXIgb2Ygcm93cy5cbiAgICovXG4gIF90aGlzLm0gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIF9tO1xuICB9O1xuXG4gIC8qKlxuICAgKiBNdWx0aXBseSBtYXRyaWNlcy5cbiAgICpcbiAgICogQHBhcmFtIHRoYXQge01hdHJpeH1cbiAgICogICAgICAgIG1hdHJpeCB0byBtdWx0aXBseS5cbiAgICogQHJldHVybiB7TWF0cml4fSByZXN1bHQgb2YgbXVsdGlwbGljYXRpb24uXG4gICAqL1xuICBfdGhpcy5tdWx0aXBseSA9IGZ1bmN0aW9uICh0aGF0KSB7XG4gICAgcmV0dXJuIE1hdHJpeChfX211bHRpcGx5KF9kYXRhLCBfbSwgX24sIHRoYXQuZGF0YSgpLCB0aGF0Lm0oKSwgdGhhdC5uKCkpLFxuICAgICAgICAvLyB1c2UgdGhhdC5OXG4gICAgICAgIF9tLCB0aGF0Lm4oKSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEdldCBudW1iZXIgb2YgY29sdW1ucyBpbiBtYXRyaXguXG4gICAqXG4gICAqIEByZXR1cm4ge051bWJlcn0gbnVtYmVyIG9mIGNvbHVtbnMuXG4gICAqL1xuICBfdGhpcy5uID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBfbjtcbiAgfTtcblxuICAvKipcbiAgICogTXVsdGlwbHkgZWFjaCBlbGVtZW50IGJ5IC0xLlxuICAgKlxuICAgKiBAcmV0dXJuIHtNYXRyaXh9IHJlc3VsdCBvZiBuZWdhdGlvbi5cbiAgICovXG4gIF90aGlzLm5lZ2F0aXZlID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBNYXRyaXgoVmVjdG9yLm11bHRpcGx5KF9kYXRhLCAtMSksIF9tLCBfbik7XG4gIH07XG5cbiAgLyoqXG4gICAqIEdldCBhIHJvdyBmcm9tIHRoaXMgbWF0cml4LlxuICAgKlxuICAgKiBAcGFyYW0gcm93IHtOdW1iZXJ9XG4gICAqICAgICAgICB6ZXJvLWJhc2VkIGluZGV4IG9mIHJvdy5cbiAgICogQHJldHVybiB7QXJyYXk8TnVtYmVyPn0gZWxlbWVudHMgZnJvbSByb3cuXG4gICAqL1xuICBfdGhpcy5yb3cgPSBmdW5jdGlvbiAocm93KSB7XG4gICAgcmV0dXJuIF9fcm93KF9kYXRhLCBfbSwgX24sIHJvdyk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFNldCBhIHZhbHVlIGluIHRoaXMgbWF0cml4LlxuICAgKlxuICAgKiBAcGFyYW0gcm93IHtOdW1iZXJ9XG4gICAqICAgICAgICB6ZXJvLWJhc2VkIHJvdyBpbmRleC5cbiAgICogQHBhcmFtIGNvbCB7TnVtYmVyfVxuICAgKiAgICAgICAgemVyby1iYXNlZCBjb2x1bW4gaW5kZXguXG4gICAqIEBwYXJhbSB2YWx1ZSB7TnVtYmVyfVxuICAgKiAgICAgICAgdmFsdWUgdG8gc2V0LlxuICAgKi9cbiAgX3RoaXMuc2V0ID0gZnVuY3Rpb24gKHJvdywgY29sLCB2YWx1ZSkge1xuICAgIF9fc2V0KF9kYXRhLCBfbSwgX24sIHJvdywgY29sLCB2YWx1ZSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFN1YnRyYWN0IGFub3RoZXIgbWF0cml4IGZyb20gdGhpcyBtYXRyaXguXG4gICAqXG4gICAqIEBwYXJhbSB0aGF0IHtNYXRyaXh9XG4gICAqICAgICAgICBtYXRyaXggdG8gc3VidHJhY3QuXG4gICAqIEB0aHJvd3MgRXJyb3IgaWYgZGltZW5zaW9ucyBkbyBub3QgbWF0Y2guXG4gICAqIEByZXR1cm4gcmVzdWx0IG9mIHN1YnRyYWN0aW9uIChvcmlnaW5hbCBtYXRyaXggaXMgdW5jaGFuZ2VkKS5cbiAgICovXG4gIF90aGlzLnN1YnRyYWN0ID0gZnVuY3Rpb24gKHRoYXQpIHtcbiAgICBpZiAoX20gIT09IHRoYXQubSgpIHx8IG4gIT09IHRoYXQubigpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ21hdHJpY2VzIG11c3QgYmUgc2FtZSBzaXplJyk7XG4gICAgfVxuICAgIHJldHVybiBNYXRyaXgoVmVjdG9yLnN1YnRyYWN0KF9kYXRhLCB0aGF0LmRhdGEoKSksIF9tLCBfbik7XG4gIH07XG5cbiAgLyoqXG4gICAqIERpc3BsYXkgbWF0cml4IGFzIGEgc3RyaW5nLlxuICAgKlxuICAgKiBAcmV0dXJuIHtTdHJpbmd9IGZvcm1hdHRlZCBtYXRyaXguXG4gICAqL1xuICBfdGhpcy50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gX19zdHJpbmdpZnkoX2RhdGEsIF9tLCBfbik7XG4gIH07XG5cbiAgLyoqXG4gICAqIFRyYW5zcG9zZSBtYXRyaXguXG4gICAqXG4gICAqIENvbHVtbnMgYmVjb21lIHJvd3MsIGFuZCByb3dzIGJlY29tZSBjb2x1bW5zLlxuICAgKlxuICAgKiBAcmV0dXJuIHtNYXRyaXh9IHJlc3VsdCBvZiB0cmFuc3Bvc2UuXG4gICAqL1xuICBfdGhpcy50cmFuc3Bvc2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIE1hdHJpeChfX3RyYW5zcG9zZShfZGF0YSwgX20sIF9uKSxcbiAgICAgICAgLy8gc3dhcCBNIGFuZCBOXG4gICAgICAgIF9uLCBfbSk7XG4gIH07XG5cbiAgX2luaXRpYWxpemUoZGF0YSwgbSwgbik7XG4gIGRhdGEgPSBudWxsO1xuICByZXR1cm4gX3RoaXM7XG59O1xuXG5cbi8vIGV4cG9zZSBzdGF0aWMgbWV0aG9kcy5cbk1hdHJpeC5jb2wgPSBfX2NvbDtcbk1hdHJpeC5kaWFnb25hbCA9IF9fZGlhZ29uYWw7XG5NYXRyaXguZ2V0ID0gX19nZXQ7XG5NYXRyaXguaWRlbnRpdHkgPSBfX2lkZW50aXR5O1xuTWF0cml4LmluZGV4ID0gX19pbmRleDtcbk1hdHJpeC5qYWNvYmkgPSBfX2phY29iaTtcbk1hdHJpeC5tdWx0aXBseSA9IF9fbXVsdGlwbHk7XG5NYXRyaXgucm93ID0gX19yb3c7XG5NYXRyaXguc2V0ID0gX19zZXQ7XG5NYXRyaXguc3RyaW5naWZ5ID0gX19zdHJpbmdpZnk7XG5NYXRyaXgudHJhbnNwb3NlID0gX190cmFuc3Bvc2U7XG5cblxubW9kdWxlLmV4cG9ydHMgPSBNYXRyaXg7XG4iLCIndXNlIHN0cmljdCc7XG5cblxuLy8gc3RhdGljIG1ldGhvZHMgdGhhdCBvcGVyYXRlIG9uIGFycmF5c1xudmFyIF9fYWRkLFxuICAgIF9fYW5nbGUsXG4gICAgX19hemltdXRoLFxuICAgIF9fY3Jvc3MsXG4gICAgX19kb3QsXG4gICAgX19lcXVhbHMsXG4gICAgX19tYWduaXR1ZGUsXG4gICAgX19tdWx0aXBseSxcbiAgICBfX3BsdW5nZSxcbiAgICBfX3VuaXQsXG4gICAgX19yb3RhdGUsXG4gICAgX19zdWJ0cmFjdCxcbiAgICBfX3gsXG4gICAgX195LFxuICAgIF9fejtcblxuXG4vKipcbiAqIEFkZCB0d28gdmVjdG9ycy5cbiAqXG4gKiBAcGFyYW0gdjEge0FycmF5PE51bWJlcj59XG4gKiAgICAgICAgdGhlIGZpcnN0IHZlY3Rvci5cbiAqIEBwYXJhbSB2MiB7QXJyYXk8TnVtYmVyPn1cbiAqICAgICAgICB0aGUgc2Vjb25kIHZlY3Rvci5cbiAqIEByZXR1cm4ge0FycmF5PE51bWJlcj59XG4gKiAgICAgICAgIHJlc3VsdCBvZiBhZGRpdGlvbi5cbiAqIEB0aHJvd3Mge0Vycm9yfSB3aGVuIHZlY3RvcnMgYXJlIGRpZmZlcmVudCBsZW5ndGhzLlxuICovXG5fX2FkZCA9IGZ1bmN0aW9uICh2MSwgdjIpIHtcbiAgdmFyIGksXG4gICAgICB2O1xuICBpZiAodjEubGVuZ3RoICE9PSB2Mi5sZW5ndGgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3ZlY3RvcnMgbXVzdCBiZSBzYW1lIGxlbmd0aCcpO1xuICB9XG4gIHYgPSBbXTtcbiAgZm9yIChpID0gMDsgaSA8IHYxLmxlbmd0aDsgaSsrKSB7XG4gICAgdi5wdXNoKHYxW2ldICsgdjJbaV0pO1xuICB9XG4gIHJldHVybiB2O1xufTtcblxuXG4vKipcbiAqIENvbXB1dGUgdGhlIGFuZ2xlIGJldHdlZW4gdHdvIHZlY3RvcnMuXG4gKlxuICogQHBhcmFtIHYxIHtBcnJheTxOdW1iZXI+fVxuICogICAgICAgIHRoZSBmaXJzdCB2ZWN0b3IuXG4gKiBAcGFyYW0gdjIge0FycmF5PE51bWJlcj59XG4gKiAgICAgICAgdGhlIHNlY29uZCB2ZWN0b3IuXG4gKiBAcmV0dXJuIHtOdW1iZXJ9XG4gKiAgICAgICAgIGFuZ2xlIGJldHdlZW4gdmVjdG9ycyBpbiByYWRpYW5zLlxuICovXG5fX2FuZ2xlID0gZnVuY3Rpb24gKHYxLCB2Mikge1xuICByZXR1cm4gTWF0aC5hY29zKF9fZG90KHYxLCB2MikgLyAoX19tYWduaXR1ZGUodjEpICogX19tYWduaXR1ZGUodjIpKSk7XG59O1xuXG4vKipcbiAqIENvbXB1dGUgdGhlIGF6aW11dGggb2YgYSB2ZWN0b3IuXG4gKlxuICogQHBhcmFtIHYxIHtBcnJheTxOdW1iZXI+fVxuICogICAgICAgIHRoZSBmaXJzdCB2ZWN0b3IuXG4gKiBAcGFyYW0gdjIge0FycmF5PE51bWJlcj59XG4gKiAgICAgICAgdGhlIHNlY29uZCB2ZWN0b3IuXG4gKiBAcmV0dXJuIHtOdW1iZXJ9XG4gKiAgICAgICAgIGFuZ2xlIGJldHdlZW4gdmVjdG9ycyBpbiByYWRpYW5zLlxuICovXG5fX2F6aW11dGggPSBmdW5jdGlvbiAodjEpIHtcbiAgaWYgKHYxLmxlbmd0aCA8IDIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2F6aW11dGggcmVxdWlyZXMgYXQgbGVhc3QgMiBkaW1lbnNpb25zJyk7XG4gIH1cbiAgaWYgKHYxWzBdID09PSAwICYmIHYxWzFdID09PSAwKSB7XG4gICAgLy8gaWYgdmVjdG9yIGlzIHplcm8sIG9yIHZlcnRpY2FsLCBhemltdXRoIGlzIHplcm8uXG4gICAgcmV0dXJuIDA7XG4gIH1cbiAgcmV0dXJuIChNYXRoLlBJIC8gMikgLSBNYXRoLmF0YW4yKHYxWzFdLCB2MVswXSk7XG59O1xuXG4vKipcbiAqIENvbXB1dGUgdmVjdG9yIGNyb3NzIHByb2R1Y3QuXG4gKlxuICogTm90ZTogb25seSBjb21wdXRlcyBjcm9zcyBwcm9kdWN0IGluIDMgZGltZW5zaW9ucy5cbiAqXG4gKiBAcGFyYW0gdjEge0FycmF5PE51bWJlcj59XG4gKiAgICAgICAgdGhlIGZpcnN0IHZlY3Rvci5cbiAqIEBwYXJhbSB2MiB7QXJyYXk8TnVtYmVyPn1cbiAqICAgICAgICB0aGUgc2Vjb25kIHZlY3Rvci5cbiAqIEByZXR1cm4ge0FycmF5PE51bWJlcj59XG4gKiAgICAgICAgIHRoZSAzIGRpbWVuc2lvbmFsIGNyb3NzIHByb2R1Y3QuXG4gKiAgICAgICAgIHRoZSByZXN1bHRpbmcgdmVjdG9yIGZvbGxvd3MgdGhlIHJpZ2h0LWhhbmQgcnVsZTogaWYgdGhlIGZpbmdlcnMgb25cbiAqICAgICAgICAgeW91ciByaWdodCBoYW5kIHBvaW50IHRvIHYxLCBhbmQgeW91IGNsb3NlIHlvdXIgaGFuZCB0byBnZXQgdG8gdjIsXG4gKiAgICAgICAgIHRoZSByZXN1bHRpbmcgdmVjdG9yIHBvaW50cyBpbiB0aGUgZGlyZWN0aW9uIG9mIHlvdXIgdGh1bWIuXG4gKi9cbl9fY3Jvc3MgPSBmdW5jdGlvbiAodjEsIHYyKSB7XG4gIGlmICh2MS5sZW5ndGggIT09IHYyLmxlbmd0aCB8fCB2MS5sZW5ndGggPCAzKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdjcm9zcyBwcm9kdWN0IHJlcXVpcmVzIGF0IGxlYXN0IDMgZGltZW5zaW9ucycpO1xuICB9XG4gIHJldHVybiBbXG4gICAgdjFbMV0gKiB2MlsyXSAtIHYyWzFdICogdjFbMl0sXG4gICAgdjFbMl0gKiB2MlswXSAtIHYyWzJdICogdjFbMF0sXG4gICAgdjFbMF0gKiB2MlsxXSAtIHYyWzBdICogdjFbMV1cbiAgXTtcbn07XG5cbi8qKlxuICogQ29tcHV0ZSB2ZWN0b3IgZG90IHByb2R1Y3QuXG4gKlxuICogQHBhcmFtIHYxIHtBcnJheTxOdW1iZXJ9XG4gKiAgICAgICAgdGhlIGZpcnN0IHZlY3Rvci5cbiAqIEBwYXJhbSB2MiB7QXJyYXk8TnVtYmVyPn1cbiAqICAgICAgICB0aGUgc2Vjb25kIHZlY3Rvci5cbiAqIEByZXR1cm4ge051bWJlcn1cbiAqICAgICAgICAgdGhlIGRvdCBwcm9kdWN0LlxuICovXG5fX2RvdCA9IGZ1bmN0aW9uICh2MSwgdjIpIHtcbiAgdmFyIGksXG4gICAgICBzdW07XG4gIHN1bSA9IDA7XG4gIGZvciAoaSA9IDA7IGkgPCB2MS5sZW5ndGg7IGkrKykge1xuICAgIHN1bSArPSB2MVtpXSAqIHYyW2ldO1xuICB9XG4gIHJldHVybiBzdW07XG59O1xuXG4vKipcbiAqIENoZWNrIGlmIHR3byB2ZWN0b3JzIGFyZSBlcXVhbC5cbiAqXG4gKiBAcGFyYW0gdjEge0FycmF5PE51bWJlcj59XG4gKiAgICAgICAgdGhlIGZpcnN0IHZlY3Rvci5cbiAqIEBwYXJhbSB2MiB7QXJyYXk8TnVtYmVyPn1cbiAqICAgICAgICB0aGUgc2Vjb25kIHZlY3Rvci5cbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKiAgICAgICAgIHRydWUgaWYgdmVjdG9ycyBhcmUgc2FtZSBsZW5ndGggYW5kIGFsbCBlbGVtZW50cyBhcmUgZXF1YWwuXG4gKi9cbl9fZXF1YWxzID0gZnVuY3Rpb24gKHYxLCB2Mikge1xuICB2YXIgaTtcbiAgaWYgKHYxLmxlbmd0aCAhPT0gdjIubGVuZ3RoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGZvciAoaSA9IDA7IGkgPCB2MS5sZW5ndGg7IGkrKykge1xuICAgIGlmICh2MVtpXSAhPT0gdjJbaV0pIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59O1xuXG4vKipcbiAqIENvbXB1dGUgbGVuZ3RoIG9mIHZlY3Rvci5cbiAqXG4gKiBAcGFyYW0gdjEge0FycmF5PE51bWJlcj59XG4gKiAgICAgICAgdmVjdG9yLlxuICogQHJldHVybiB7TnVtYmVyfVxuICogICAgICAgICBtYWduaXR1ZGUgb2YgdmVjdG9yLlxuICovXG5fX21hZ25pdHVkZSA9IGZ1bmN0aW9uICh2MSkge1xuICB2YXIgaSxcbiAgICAgIHN1bTtcbiAgc3VtID0gMDtcbiAgZm9yIChpID0gMDsgaSA8IHYxLmxlbmd0aDsgaSsrKSB7XG4gICAgc3VtICs9IHYxW2ldICogdjFbaV07XG4gIH1cbiAgcmV0dXJuIE1hdGguc3FydChzdW0pO1xufTtcblxuLyoqXG4gKiBNdWx0aXBseSB2ZWN0b3IgYnkgYSBjb25zdGFudC5cbiAqXG4gKiBAcGFyYW0gdjEge0FycmF5PE51bWJlcj59XG4gKiAgICAgICAgdmVjdG9yIHRvIG11bHRpcGx5LlxuICogQHBhcmFtIG4ge051bWJlcn1cbiAqICAgICAgICBudW1iZXIgdG8gbXVsdGlwbHkgYnkuXG4gKiBAcmV0dXJuIHtBcnJheTxOdW1iZXJ9XG4gKiAgICAgICAgIHJlc3VsdCBvZiBtdWx0aXBsaWNhdGlvbi5cbiAqL1xuX19tdWx0aXBseSA9IGZ1bmN0aW9uICh2MSwgbikge1xuICB2YXIgaSxcbiAgICAgIHY7XG5cbiAgdiA9IFtdO1xuICBmb3IgKGkgPSAwOyBpIDwgdjEubGVuZ3RoOyBpKyspIHtcbiAgICB2LnB1c2godjFbaV0gKiBuKTtcbiAgfVxuICByZXR1cm4gdjtcbn07XG5cbi8qKlxuICogQ29tcHV0ZSBhbmdsZSBmcm9tIHBsYW5lIHo9MCB0byB2ZWN0b3IuXG4gKlxuICogQHBhcmFtIHYge0FycmF5PE51bWJlcj59XG4gKiAgICAgICAgdGhlIHZlY3Rvci5cbiAqIEByZXR1cm4ge051bWJlcn1cbiAqICAgICAgICAgYW5nbGUgZnJvbSBwbGFuZSB6PTAgdG8gdmVjdG9yLlxuICogICAgICAgICBhbmdsZSBpcyBwb3NpdGl2ZSB3aGVuIHogPiAwLCBuZWdhdGl2ZSB3aGVuIHogPCAwLlxuICovXG5fX3BsdW5nZSA9IGZ1bmN0aW9uICh2KSB7XG4gIGlmICh2Lmxlbmd0aCA8IDMpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ19fYXppbXV0aDogdmVjdG9yIG11c3QgaGF2ZSBhdCBsZWFzdCAzIGRpbWVuc2lvbnMnKTtcbiAgfVxuICByZXR1cm4gTWF0aC5hc2luKHZbMl0gLyBfX21hZ25pdHVkZSh2KSk7XG59O1xuXG4vKipcbiAqIFJvdGF0ZSBhIHZlY3RvciBhcm91bmQgYW4gYXhpcy5cbiAqXG4gKiBGcm9tIFwiNi4yIFRoZSBub3JtYWxpemVkIG1hdHJpeCBmb3Igcm90YXRpb24gYWJvdXQgYW4gYXJiaXRyYXJ5IGxpbmVcIixcbiAqICAgICAgaHR0cDovL2luc2lkZS5taW5lcy5lZHUvfmdtdXJyYXkvQXJiaXRyYXJ5QXhpc1JvdGF0aW9uL1xuICpcbiAqIEBwYXJhbSB2MSB7QXJyYXk8TnVtYmVyPn1cbiAqICAgICAgICB0aGUgXCJwb2ludFwiIHRvIHJvdGF0ZS5cbiAqIEBwYXJhbSBheGlzIHtBcnJheTxOdW1iZXI+fVxuICogICAgICAgIGRpcmVjdGlvbiB2ZWN0b3Igb2Ygcm90YXRpb24gYXhpcy5cbiAqIEBwYXJhbSB0aGV0YSB7TnVtYmVyfVxuICogICAgICAgIGFuZ2xlIG9mIHJvdGF0aW9uIGluIHJhZGlhbnMuXG4gKiBAcGFyYW0gb3JpZ2luIHtBcnJheTxOdW1iZXI+fVxuICogICAgICAgIGRlZmF1bHQgWzAsIDAsIDBdLlxuICogICAgICAgIG9yaWdpbiBvZiBheGlzIG9mIHJvdGF0aW9uLlxuICovXG5fX3JvdGF0ZSA9IGZ1bmN0aW9uICh2MSwgYXhpcywgdGhldGEsIG9yaWdpbikge1xuICB2YXIgYSxcbiAgICAgIGF1LFxuICAgICAgYXYsXG4gICAgICBhdyxcbiAgICAgIGIsXG4gICAgICBidSxcbiAgICAgIGJ2LFxuICAgICAgYncsXG4gICAgICBjLFxuICAgICAgY3UsXG4gICAgICBjdixcbiAgICAgIGN3LFxuICAgICAgY29zVCxcbiAgICAgIHNpblQsXG4gICAgICB1LFxuICAgICAgdXUsXG4gICAgICB1eCxcbiAgICAgIHV5LFxuICAgICAgdXosXG4gICAgICB2LFxuICAgICAgdnYsXG4gICAgICB2eCxcbiAgICAgIHZ5LFxuICAgICAgdnosXG4gICAgICB3LFxuICAgICAgd3csXG4gICAgICB3eCxcbiAgICAgIHd5LFxuICAgICAgd3osXG4gICAgICB4LFxuICAgICAgeSxcbiAgICAgIHo7XG5cbiAgb3JpZ2luID0gb3JpZ2luIHx8IFswLCAwLCAwXTtcbiAgYSA9IG9yaWdpblswXTtcbiAgYiA9IG9yaWdpblsxXTtcbiAgYyA9IG9yaWdpblsyXTtcbiAgdSA9IGF4aXNbMF07XG4gIHYgPSBheGlzWzFdO1xuICB3ID0gYXhpc1syXTtcbiAgeCA9IHYxWzBdO1xuICB5ID0gdjFbMV07XG4gIHogPSB2MVsyXTtcblxuICBjb3NUID0gTWF0aC5jb3ModGhldGEpO1xuICBzaW5UID0gTWF0aC5zaW4odGhldGEpO1xuICBhdSA9IGEgKiB1O1xuICBhdiA9IGEgKiB2O1xuICBhdyA9IGEgKiB3O1xuICBidSA9IGIgKiB1O1xuICBidiA9IGIgKiB2O1xuICBidyA9IGIgKiB3O1xuICBjdSA9IGMgKiB1O1xuICBjdiA9IGMgKiB2O1xuICBjdyA9IGMgKiB3O1xuICB1dSA9IHUgKiB1O1xuICB1eCA9IHUgKiB4O1xuICB1eSA9IHUgKiB5O1xuICB1eiA9IHUgKiB6O1xuICB2diA9IHYgKiB2O1xuICB2eCA9IHYgKiB4O1xuICB2eSA9IHYgKiB5O1xuICB2eiA9IHYgKiB6O1xuICB3dyA9IHcgKiB3O1xuICB3eCA9IHcgKiB4O1xuICB3eSA9IHcgKiB5O1xuICB3eiA9IHcgKiB6O1xuXG4gIHJldHVybiBbXG4gICAgKGEgKiAodnYgKyB3dykgLSB1ICogKGJ2ICsgY3cgLSB1eCAtIHZ5IC0gd3opKSAqICgxIC0gY29zVCkgK1xuICAgICAgICB4ICogY29zVCArICgtY3YgKyBidyAtIHd5ICsgdnopICogc2luVCxcbiAgICAoYiAqICh1dSArIHd3KSAtIHYgKiAoYXUgKyBjdyAtIHV4IC0gdnkgLSB3eikpICogKDEgLSBjb3NUKSArXG4gICAgICAgIHkgKiBjb3NUICsgKGN1IC0gYXcgKyB3eCAtIHV6KSAqIHNpblQsXG4gICAgKGMgKiAodXUgKyB2dikgLSB3ICogKGF1ICsgYnYgLSB1eCAtIHZ5IC0gd3opKSAqICgxIC0gY29zVCkgK1xuICAgICAgICB6ICogY29zVCArICgtYnUgKyBhdiAtIHZ4ICsgdXkpICogc2luVFxuICBdO1xufTtcblxuLyoqXG4gKiBTdWJ0cmFjdCB0d28gdmVjdG9ycy5cbiAqXG4gKiBAcGFyYW0gdjEge0FycmF5PE51bWJlcj59XG4gKiAgICAgICAgdGhlIGZpcnN0IHZlY3Rvci5cbiAqIEBwYXJhbSB2MiB7QXJyYXk8TnVtYmVyPn1cbiAqICAgICAgICB0aGUgdmVjdG9yIHRvIHN1YnRyYWN0LlxuICogQHJldHVybiB7QXJyYXk8TnVtYmVyPn1cbiAqICAgICAgICAgcmVzdWx0IG9mIHN1YnRyYWN0aW9uLlxuICogQHRocm93cyB7RXJyb3J9IHdoZW4gdmVjdG9ycyBhcmUgZGlmZmVyZW50IGxlbmd0aHMuXG4gKi9cbl9fc3VidHJhY3QgPSBmdW5jdGlvbiAodjEsIHYyKSB7XG4gIHZhciBpLFxuICAgICAgdjtcblxuICBpZiAodjEubGVuZ3RoICE9PSB2Mi5sZW5ndGgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ19fc3VidHJhY3Q6IHZlY3RvcnMgbXVzdCBiZSBzYW1lIGxlbmd0aCcpO1xuICB9XG4gIHYgPSBbXTtcbiAgZm9yIChpID0gMDsgaSA8IHYxLmxlbmd0aDsgaSsrKSB7XG4gICAgdi5wdXNoKHYxW2ldIC0gdjJbaV0pO1xuICB9XG4gIHJldHVybiB2O1xufTtcblxuLyoqXG4gKiBDb252ZXJ0IHZlY3RvciB0byBsZW5ndGggMS5cbiAqXG4gKiBTYW1lIGFzIF9fbXVsdGlwbHkodjEsIDEgLyBfX21hZ25pdHVkZSh2MSkpXG4gKlxuICogQHBhcmFtIHYxIHtBcnJheTxOdW1iZXI+fVxuICogICAgICAgIHRoZSB2ZWN0b3IuXG4gKiBAcmV0dXJuIHtBcnJheTxOdW1iZXI+fVxuICogICAgICAgICB2ZWN0b3IgY29udmVydGVkIHRvIGxlbmd0aCAxLlxuICogQHRocm93cyB7RXJyb3J9IGlmIHZlY3RvciBtYWduaXR1ZGUgaXMgMC5cbiAqL1xuX191bml0ID0gZnVuY3Rpb24gKHYxKSB7XG4gIHZhciBtYWcgPSBfX21hZ25pdHVkZSh2MSk7XG4gIGlmIChtYWcgPT09IDApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ19fdW5pdDogY2Fubm90IGNvbnZlcnQgemVybyB2ZWN0b3IgdG8gdW5pdCB2ZWN0b3InKTtcbiAgfVxuICByZXR1cm4gX19tdWx0aXBseSh2MSwgMSAvIG1hZyk7XG59O1xuXG4vKipcbiAqIEdldCwgYW5kIG9wdGlvbmFsbHkgc2V0LCB0aGUgeCBjb21wb25lbnQgb2YgYSB2ZWN0b3IuXG4gKlxuICogQHBhcmFtIHYge0FycmF5PE51bWJlcj59XG4gKiAgICAgICAgdGhlIHZlY3Rvci5cbiAqIEBwYXJhbSB2YWx1ZSB7TnVtYmVyfVxuICogICAgICAgIGRlZmF1bHQgdW5kZWZpbmVkLlxuICogICAgICAgIHdoZW4gZGVmaW5lZCwgc2V0IHggY29tcG9uZW50LlxuICogQHJldHVybiB7TnVtYmVyfVxuICogICAgICAgICB0aGUgeCBjb21wb25lbnQuXG4gKi9cbl9feCA9IGZ1bmN0aW9uICh2LCB2YWx1ZSkge1xuICBpZiAodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJykge1xuICAgIHZbMF0gPSB2YWx1ZTtcbiAgfVxuICByZXR1cm4gdlswXTtcbn07XG5cbi8qKlxuICogR2V0LCBhbmQgb3B0aW9uYWxseSBzZXQsIHRoZSB5IGNvbXBvbmVudCBvZiBhIHZlY3Rvci5cbiAqXG4gKiBAcGFyYW0gdiB7QXJyYXk8TnVtYmVyPn1cbiAqICAgICAgICB0aGUgdmVjdG9yLlxuICogQHBhcmFtIHZhbHVlIHtOdW1iZXJ9XG4gKiAgICAgICAgZGVmYXVsdCB1bmRlZmluZWQuXG4gKiAgICAgICAgd2hlbiBkZWZpbmVkLCBzZXQgeSBjb21wb25lbnQuXG4gKiBAcmV0dXJuIHtOdW1iZXJ9XG4gKiAgICAgICAgIHRoZSB5IGNvbXBvbmVudC5cbiAqL1xuX195ID0gZnVuY3Rpb24gKHYsIHZhbHVlKSB7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInKSB7XG4gICAgdlsxXSA9IHZhbHVlO1xuICB9XG4gIHJldHVybiB2WzFdO1xufTtcblxuLyoqXG4gKiBHZXQsIGFuZCBvcHRpb25hbGx5IHNldCwgdGhlIHogY29tcG9uZW50IG9mIGEgdmVjdG9yLlxuICpcbiAqIEBwYXJhbSB2IHtBcnJheTxOdW1iZXI+fVxuICogICAgICAgIHRoZSB2ZWN0b3IuXG4gKiBAcGFyYW0gdmFsdWUge051bWJlcn1cbiAqICAgICAgICBkZWZhdWx0IHVuZGVmaW5lZC5cbiAqICAgICAgICB3aGVuIGRlZmluZWQsIHNldCB6IGNvbXBvbmVudC5cbiAqIEByZXR1cm4ge051bWJlcn1cbiAqICAgICAgICAgdGhlIHogY29tcG9uZW50LlxuICovXG5fX3ogPSBmdW5jdGlvbiAodiwgdmFsdWUpIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicpIHtcbiAgICB2WzJdID0gdmFsdWU7XG4gIH1cbiAgcmV0dXJuIHZbMl07XG59O1xuXG5cbi8qKlxuICogQSB2ZWN0b3Igb2JqZWN0IHRoYXQgd3JhcHMgYW4gYXJyYXkuXG4gKlxuICogVGhpcyBpcyBhIGNvbnZlbmllbmNlIG9iamVjdCB0byBjYWxsIHRoZSBzdGF0aWMgbWV0aG9kcyBvbiB0aGUgd3JhcHBlZCBhcnJheS5cbiAqIE9ubHkgdGhlIG1ldGhvZHMgeCgpLCB5KCksIGFuZCB6KCkgbW9kaWZ5IGRhdGE7IG90aGVyIG1ldGhvZHMgcmV0dXJuIG5ld1xuICogVmVjdG9yIG9iamVjdHMgd2l0aG91dCBtb2RpZnlpbmcgdGhlIGV4aXN0aW5nIG9iamVjdC5cbiAqXG4gKiBAcGFyYW0gZGF0YSB7QXJyYXk8TnVtYmVyPn1cbiAqICAgICAgICBhcnJheSB0byB3cmFwLlxuICovXG52YXIgVmVjdG9yID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgdmFyIF90aGlzLFxuICAgICAgX2luaXRpYWxpemUsXG4gICAgICAvLyB2YXJpYWJsZXNcbiAgICAgIF9kYXRhO1xuXG4gIGlmIChkYXRhICYmIHR5cGVvZiBkYXRhLmRhdGEgPT09ICdmdW5jdGlvbicpIHtcbiAgICAvLyBjb3B5IGV4aXN0aW5nIG9iamVjdFxuICAgIGRhdGEgPSBkYXRhLmRhdGEoKS5zbGljZSgwKTtcbiAgfVxuXG5cbiAgX3RoaXMgPSB7XG4gICAgX2lzYV92ZWN0b3I6IHRydWVcbiAgfTtcblxuICBfaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgX2RhdGEgPSBkYXRhO1xuICB9O1xuXG4gIC8qKlxuICAgKiBBZGQgdHdvIHZlY3RvcnMuXG4gICAqXG4gICAqIEBwYXJhbSB0aGF0IHtWZWN0b3J8QXJyYXk8TnVtYmVyPn1cbiAgICogICAgICAgIHZlY3RvciB0byBhZGQuXG4gICAqIEByZXR1cm4ge1ZlY3Rvcn1cbiAgICogICAgICAgICByZXN1bHQgb2YgYWRkaXRpb24uXG4gICAqL1xuICBfdGhpcy5hZGQgPSBmdW5jdGlvbiAodGhhdCkge1xuICAgIHRoYXQgPSAodGhhdC5faXNhX3ZlY3RvciA/IHRoYXQuZGF0YSgpIDogdGhhdCk7XG4gICAgcmV0dXJuIFZlY3RvcihfX2FkZChfZGF0YSwgdGhhdCkpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBDb21wdXRlIGFuZ2xlIGJldHdlZW4gdmVjdG9ycy5cbiAgICpcbiAgICogQHBhcmFtIHRoYXQge1ZlY3RvcnxBcnJheTxOdW1iZXI+fVxuICAgKiAgICAgICAgdmVjdG9yIHRvIGNvbXB1dGUgYW5nbGUgYmV0d2Vlbi5cbiAgICogQHJldHVybiB7TnVtYmVyfSBhbmdsZSBiZXR3ZWVuIHZlY3RvcnMgaW4gcmFkaWFucy5cbiAgICovXG4gIF90aGlzLmFuZ2xlID0gZnVuY3Rpb24gKHRoYXQpIHtcbiAgICB0aGF0ID0gKHRoYXQuX2lzYV92ZWN0b3IgPyB0aGF0LmRhdGEoKSA6IHRoYXQpO1xuICAgIHJldHVybiBfX2FuZ2xlKF9kYXRhLCB0aGF0KTtcbiAgfTtcblxuICAvKipcbiAgICogQ29tcHV0ZSBhemltdXRoIG9mIHRoaXMgdmVjdG9yLlxuICAgKlxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9IGF6aW11dGggb2YgdGhpcyB2ZWN0b3IgaW4gcmFkaWFucy5cbiAgICovXG4gIF90aGlzLmF6aW11dGggPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIF9fYXppbXV0aChfZGF0YSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIENvbXB1dGUgdGhlIGNyb3NzIHByb2R1Y3QgYmV0d2VlbiB2ZWN0b3JzLlxuICAgKlxuICAgKiBAcGFyYW0gdGhhdCB7VmVjdG9yfEFycmF5PE51bWJlcj59XG4gICAqICAgICAgICB0aGUgdmVjdG9yIHRvIGNyb3NzLlxuICAgKiBAcmV0dXJuIHtWZWN0b3J9IHJlc3VsdCBvZiB0aGUgY3Jvc3MgcHJvZHVjdC5cbiAgICovXG4gIF90aGlzLmNyb3NzID0gZnVuY3Rpb24gKHRoYXQpIHtcbiAgICB0aGF0ID0gKHRoYXQuX2lzYV92ZWN0b3IgPyB0aGF0LmRhdGEoKSA6IHRoYXQpO1xuICAgIHJldHVybiBWZWN0b3IoX19jcm9zcyhfZGF0YSwgdGhhdCkpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBBY2Nlc3MgdGhlIHdyYXBwZWQgYXJyYXkuXG4gICAqXG4gICAqIEByZXR1cm4ge0FycmF5PE51bWJlcj59XG4gICAqICAgICAgICAgdGhlIHdyYXBwZWQgYXJyYXkuXG4gICAqL1xuICBfdGhpcy5kYXRhID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBfZGF0YTtcbiAgfTtcblxuICAvKipcbiAgICogQ29tcHV0ZSBkb3QgcHJvZHVjdCBiZXR3ZWVuIHZlY3RvcnMuXG4gICAqXG4gICAqIEBwYXJhbSB0aGF0IHtWZWN0b3J8QXJyYXk8TnVtYmVyPn1cbiAgICogICAgICAgIHZlY3RvciB0byBkb3QuXG4gICAqIEByZXR1cm4ge051bWJlcn0gcmVzdWx0IG9mIGRvdCBwcm9kdWN0LlxuICAgKi9cbiAgX3RoaXMuZG90ID0gZnVuY3Rpb24gKHRoYXQpIHtcbiAgICB0aGF0ID0gKHRoYXQuX2lzYV92ZWN0b3IgPyB0aGF0LmRhdGEoKSA6IHRoYXQpO1xuICAgIHJldHVybiBfX2RvdChfZGF0YSwgdGhhdCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIHR3byB2ZWN0b3JzIGFyZSBlcXVhbC5cbiAgICpcbiAgICogQHBhcmFtIHRoYXQge1ZlY3RvcnxBcnJheTxOdW1iZXI+fVxuICAgKiAgICAgICAgdmVjdG9yIHRvIGNvbXBhcmUuXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59IHRydWUgaWYgZXF1YWwsIGZhbHNlIG90aGVyd2lzZS5cbiAgICovXG4gIF90aGlzLmVxdWFscyA9IGZ1bmN0aW9uICh0aGF0KSB7XG4gICAgdGhhdCA9ICh0aGF0Ll9pc2FfdmVjdG9yID8gdGhhdC5kYXRhKCkgOiB0aGF0KTtcbiAgICByZXR1cm4gX19lcXVhbHMoX2RhdGEsIHRoYXQpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBDb21wdXRlIGxlbmd0aCBvZiB0aGlzIHZlY3Rvci5cbiAgICpcbiAgICogQHJldHVybiB7TnVtYmVyfSBsZW5ndGggb2YgdmVjdG9yLlxuICAgKiAgICAgICAgIFNxdWFyZSByb290IG9mIHRoZSBzdW0gb2Ygc3F1YXJlcyBvZiBhbGwgY29tcG9uZW50cy5cbiAgICovXG4gIF90aGlzLm1hZ25pdHVkZSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gX19tYWduaXR1ZGUoX2RhdGEpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBNdWx0aXBseSB0aGlzIHZlY3RvciBieSBhIG51bWJlci5cbiAgICpcbiAgICogQHBhcmFtIG4ge051bWJlcn1cbiAgICogICAgICAgIG51bWJlciB0byBtdWx0aXBseS5cbiAgICogQHJldHVybiB7VmVjdG9yfSByZXN1bHQgb2YgbXVsdGlwbGljYXRpb24uXG4gICAqL1xuICBfdGhpcy5tdWx0aXBseSA9IGZ1bmN0aW9uIChuKSB7XG4gICAgcmV0dXJuIFZlY3RvcihfX211bHRpcGx5KF9kYXRhLCBuKSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFNhbWUgYXMgbXVsdGlwbHkoLTEpLlxuICAgKi9cbiAgX3RoaXMubmVnYXRpdmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIF90aGlzLm11bHRpcGx5KC0xKTtcbiAgfTtcblxuICAvKipcbiAgICogQ29tcHV0ZSBwbHVuZ2Ugb2YgdGhpcyB2ZWN0b3IuXG4gICAqXG4gICAqIFBsdW5nZSBpcyB0aGUgYW5nbGUgYmV0d2VlbiB0aGlzIHZlY3RvciBhbmQgdGhlIHBsYW5lIHo9MC5cbiAgICpcbiAgICogQHJldHVybiB7TnVtYmVyfSBwbHVuZ2UgaW4gcmFkaWFucy5cbiAgICogICAgICAgICBwb3NpdGl2ZSB3aGVuIHo+MCwgbmVnYXRpdmUgd2hlbiB6PDAuXG4gICAqL1xuICBfdGhpcy5wbHVuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIF9fcGx1bmdlKF9kYXRhKTtcbiAgfTtcblxuICAvKipcbiAgICogUm90YXRlIHRoaXMgdmVjdG9yIGFyb3VuZCBhbiBhcmJpdHJhcnkgYXhpcy5cbiAgICpcbiAgICogQHBhcmFtIGF4aXMge1ZlY3RvcnxBcnJheTxOdW1iZXI+fVxuICAgKiAgICAgICAgZGlyZWN0aW9uIG9mIGF4aXMgb2Ygcm90YXRpb24uXG4gICAqIEBwYXJhbSB0aGV0YSB7TnVtYmVyfVxuICAgKiAgICAgICAgYW5nbGUgb2Ygcm90YXRpb24gaW4gcmFkaWFucy5cbiAgICogQHBhcmFtIG9yaWdpbiB7VmVjdG9yfEFycmF5PE51bWJlcj59XG4gICAqICAgICAgICBvcmlnaW4gb2YgYXhpcyBvZiByb3RhdGlvbi5cbiAgICogQHJldHVybiB7VmVjdG9yfSByZXN1bHQgb2Ygcm90YXRpb24uXG4gICAqL1xuICBfdGhpcy5yb3RhdGUgPSBmdW5jdGlvbiAoYXhpcywgdGhldGEsIG9yaWdpbikge1xuICAgIGF4aXMgPSAoYXhpcy5faXNhX3ZlY3RvciA/IGF4aXMuZGF0YSgpIDogYXhpcyk7XG4gICAgb3JpZ2luID0gKG9yaWdpbiAmJiBvcmlnaW4uX2lzYV92ZWN0b3IgPyBvcmlnaW4uZGF0YSgpIDogb3JpZ2luKTtcbiAgICByZXR1cm4gVmVjdG9yKF9fcm90YXRlKF9kYXRhLCBheGlzLCB0aGV0YSwgb3JpZ2luKSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFN1YnRyYWN0IGFub3RoZXIgdmVjdG9yLlxuICAgKlxuICAgKiBAcGFyYW0gdGhhdCB7VmVjdG9yfEFycmF5PE51bWJlcj59XG4gICAqICAgICAgICB2ZWN0b3IgdG8gc3VidHJhY3QuXG4gICAqIEByZXR1cm4ge1ZlY3Rvcn0gcmVzdWx0IG9mIHN1YnRyYWN0aW9uLlxuICAgKi9cbiAgX3RoaXMuc3VidHJhY3QgPSBmdW5jdGlvbiAodGhhdCkge1xuICAgIHRoYXQgPSAodGhhdC5faXNhX3ZlY3RvciA/IHRoYXQuZGF0YSgpIDogdGhhdCk7XG4gICAgcmV0dXJuIFZlY3RvcihfX3N1YnRyYWN0KF9kYXRhLCB0aGF0KSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIENvbnZlcnQgdmVjdG9yIHRvIHN0cmluZy5cbiAgICpcbiAgICogQHJldHVybiB7U3RyaW5nfSB3cmFwcGVkIGFycmF5IGNvbnZlcnRlZCB0byBzdHJpbmcuXG4gICAqL1xuICBfdGhpcy50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gJycgKyBfZGF0YTtcbiAgfTtcblxuICAvKipcbiAgICogQ29udmVydCB0aGlzIHZlY3RvciB0byBsZW5ndGggMS5cbiAgICpcbiAgICogQHJldHVybiB7VmVjdG9yfSB2ZWN0b3IgLyB8dmVjdG9yfC5cbiAgICovXG4gIF90aGlzLnVuaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIFZlY3RvcihfX3VuaXQoX2RhdGEpKTtcbiAgfTtcblxuICAvKipcbiAgICogR2V0IG9yIHNldCB4IGNvbXBvbmVudC5cbiAgICpcbiAgICogQHBhcmFtIHZhbHVlIHtOdW1iZXJ9XG4gICAqICAgICAgICB3aGVuIGRlZmluZWQsIHNldCB4IGNvbXBvbmVudCB0byB2YWx1ZS5cbiAgICogQHJldHVybiB7TnVtYmVyfSB4IGNvbXBvbmVudCB2YWx1ZS5cbiAgICovXG4gIF90aGlzLnggPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICByZXR1cm4gX194KF9kYXRhLCB2YWx1ZSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEdldCBvciBzZXQgeSBjb21wb25lbnQuXG4gICAqXG4gICAqIEBwYXJhbSB2YWx1ZSB7TnVtYmVyfVxuICAgKiAgICAgICAgd2hlbiBkZWZpbmVkLCBzZXQgeSBjb21wb25lbnQgdG8gdmFsdWUuXG4gICAqIEByZXR1cm4ge051bWJlcn0geSBjb21wb25lbnQgdmFsdWUuXG4gICAqL1xuICBfdGhpcy55ID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgcmV0dXJuIF9feShfZGF0YSwgdmFsdWUpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBHZXQgb3Igc2V0IHogY29tcG9uZW50LlxuICAgKlxuICAgKiBAcGFyYW0gdmFsdWUge051bWJlcn1cbiAgICogICAgICAgIHdoZW4gZGVmaW5lZCwgc2V0IHogY29tcG9uZW50IHRvIHZhbHVlLlxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9IHogY29tcG9uZW50IHZhbHVlLlxuICAgKi9cbiAgX3RoaXMueiA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHJldHVybiBfX3ooX2RhdGEsIHZhbHVlKTtcbiAgfTtcblxuXG4gIF9pbml0aWFsaXplKGRhdGEpO1xuICBkYXRhID0gbnVsbDtcbiAgcmV0dXJuIF90aGlzO1xufTtcblxuXG4vLyBleHBvc2Ugc3RhdGljIG1ldGhvZHNcblZlY3Rvci5hZGQgPSBfX2FkZDtcblZlY3Rvci5hbmdsZSA9IF9fYW5nbGU7XG5WZWN0b3IuYXppbXV0aCA9IF9fYXppbXV0aDtcblZlY3Rvci5jcm9zcyA9IF9fY3Jvc3M7XG5WZWN0b3IuZG90ID0gX19kb3Q7XG5WZWN0b3IubWFnbml0dWRlID0gX19tYWduaXR1ZGU7XG5WZWN0b3IubXVsdGlwbHkgPSBfX211bHRpcGx5O1xuVmVjdG9yLnBsdW5nZSA9IF9fcGx1bmdlO1xuVmVjdG9yLnJvdGF0ZSA9IF9fcm90YXRlO1xuVmVjdG9yLnN1YnRyYWN0ID0gX19zdWJ0cmFjdDtcblZlY3Rvci51bml0ID0gX191bml0O1xuVmVjdG9yLnggPSBfX3g7XG5WZWN0b3IueSA9IF9feTtcblZlY3Rvci56ID0gX196O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gVmVjdG9yO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgVXRpbCA9IHJlcXVpcmUoJy4uL3V0aWwvVXRpbCcpLFxuICAgIFZpZXcgPSByZXF1aXJlKCcuL1ZpZXcnKTtcblxuXG52YXIgX0RFRkFVTFRTID0ge1xuICAvLyBjbGFzc25hbWUgYWRkZWQgdG8gc2VsZWN0IGJveFxuICBjbGFzc05hbWU6ICdjb2xsZWN0aW9uLXNlbGVjdGJveCcsXG4gIGluY2x1ZGVCbGFua09wdGlvbjogZmFsc2UsXG4gIGJsYW5rT3B0aW9uOiB7XG4gICAgdGV4dDogJ1BsZWFzZSBzZWxlY3QmaGVsbGlwOycsXG4gICAgdmFsdWU6ICctMSdcbiAgfSxcblxuICAvLyBjYWxsYmFjayB0byBmb3JtYXQgZWFjaCBjb2xsZWN0aW9uIGl0ZW1cbiAgZm9ybWF0OiBmdW5jdGlvbiAoaXRlbSkge1xuICAgIHJldHVybiBpdGVtLmlkO1xuICB9LFxuXG4gIC8vIHdoZXRoZXIgdG8gcmVuZGVyIGR1cmluZyBpbml0aWFsaXplXG4gIHJlbmRlck5vdzogdHJ1ZVxufTtcblxuLyoqXG4gKiBDcmVhdGUgYSBuZXcgQ29sbGVjdGlvblNlbGVjdEJveCB0byBzZWxlY3QgYSBjb2xsZWN0aW9uIGl0ZW0uXG4gKlxuICogQHBhcmFtIHBhcmFtcyB7T2JqZWN0fVxuICogQHBhcmFtIHBhcmFtcy5mb3JtYXQge0Z1bmN0aW9uKE9iamVjdCl9XG4gKiAgICAgICAgY2FsbGJhY2sgZnVuY3Rpb24gdG8gZm9ybWF0IHNlbGVjdCBib3ggaXRlbXMuXG4gKiBAcGFyYW0gcGFyYW1zLmNsYXNzTmFtZSB7U3RyaW5nfVxuICogICAgICAgIERlZmF1bHQgJ2NvbGxlY3Rpb24tc2VsZWN0Ym94Jy5cbiAqICAgICAgICBDbGFzcyBuYW1lIGZvciBzZWxlY3QgYm94LlxuICogQHBhcmFtIHBhcmFtcy5jb2xsZWN0aW9uIHtDb2xsZWN0aW9ufVxuICogICAgICAgIHRoZSBjb2xsZWN0aW9uIHRvIGRpc3BsYXkuXG4gKiAgICAgICAgTk9URTogdGhlIGNvbGxlY3Rpb24gc2hvdWxkIGhhdmUgYW4gZXhpc3Rpbmcgc2VsZWN0aW9uO1xuICogICAgICAgIG90aGVyd2lzZSwgdGhlIGZpcnN0IGl0ZW0gaW4gdGhlIHNlbGVjdCBib3ggd2lsbCBiZSBzZWxlY3RlZFxuICogICAgICAgIGluIHRoZSBVSSBhbmQgbm90IGluIHRoZSBjb2xsZWN0aW9uLlxuICogQHNlZSBtdmMvVmlld1xuICovXG52YXIgQ29sbGVjdGlvblNlbGVjdEJveCA9IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgdmFyIF90aGlzLFxuICAgICAgX2luaXRpYWxpemUsXG5cbiAgICAgIF9ibGFua09wdGlvbixcbiAgICAgIF9jb2xsZWN0aW9uLFxuICAgICAgX2Zvcm1hdCxcbiAgICAgIF9nZXRWYWxpZE9wdGlvbnMsXG4gICAgICBfaW5jbHVkZUJsYW5rT3B0aW9uLFxuICAgICAgX3NlbGVjdEJveCxcblxuICAgICAgX2NyZWF0ZUJsYW5rT3B0aW9uLFxuICAgICAgX2RlZmF1bHRHZXRWYWxpZE9wdGlvbnMsXG4gICAgICBfb25DaGFuZ2UsXG4gICAgICBfb25TZWxlY3Q7XG5cblxuICBwYXJhbXMgPSBVdGlsLmV4dGVuZCh7fSwgX0RFRkFVTFRTLCBwYXJhbXMpO1xuICBfdGhpcyA9IFZpZXcocGFyYW1zKTtcblxuICAvKipcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqXG4gICAqL1xuICBfaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICB2YXIgZWw7XG5cbiAgICBlbCA9IF90aGlzLmVsO1xuXG4gICAgX2JsYW5rT3B0aW9uID0gcGFyYW1zLmJsYW5rT3B0aW9uO1xuICAgIF9jb2xsZWN0aW9uID0gcGFyYW1zLmNvbGxlY3Rpb247XG4gICAgX2Zvcm1hdCA9IHBhcmFtcy5mb3JtYXQ7XG4gICAgX2dldFZhbGlkT3B0aW9ucyA9IHBhcmFtcy5nZXRWYWxpZE9wdGlvbnMgfHwgX2RlZmF1bHRHZXRWYWxpZE9wdGlvbnM7XG4gICAgX2luY2x1ZGVCbGFua09wdGlvbiA9IHBhcmFtcy5pbmNsdWRlQmxhbmtPcHRpb247XG5cbiAgICAvLyByZXVzZSBvciBjcmVhdGUgc2VsZWN0IGJveFxuICAgIGlmIChlbC5ub2RlTmFtZSA9PT0gJ1NFTEVDVCcpIHtcbiAgICAgIF9zZWxlY3RCb3ggPSBlbDtcbiAgICB9IGVsc2Uge1xuICAgICAgX3NlbGVjdEJveCA9IGVsLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NlbGVjdCcpKTtcbiAgICB9XG4gICAgX3NlbGVjdEJveC5jbGFzc0xpc3QuYWRkKHBhcmFtcy5jbGFzc05hbWUpO1xuXG4gICAgLy8gYmluZCB0byBldmVudHMgb24gdGhlIGNvbGxlY3Rpb25cbiAgICBfY29sbGVjdGlvbi5vbignYWRkJywgX3RoaXMucmVuZGVyKTtcbiAgICBfY29sbGVjdGlvbi5vbigncmVtb3ZlJywgX3RoaXMucmVuZGVyKTtcbiAgICBfY29sbGVjdGlvbi5vbigncmVzZXQnLCBfdGhpcy5yZW5kZXIpO1xuICAgIF9jb2xsZWN0aW9uLm9uKCdzZWxlY3QnLCBfb25TZWxlY3QpO1xuICAgIF9jb2xsZWN0aW9uLm9uKCdkZXNlbGVjdCcsIF9vblNlbGVjdCk7XG5cbiAgICAvLyBiaW5kIHRvIGV2ZW50cyBvbiB0aGlzLl9zZWxlY3RCb3hcbiAgICBfc2VsZWN0Qm94LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIF9vbkNoYW5nZSk7XG5cbiAgICAvLyBwb3B1bGF0ZSBzZWxlY3QgYm94XG4gICAgaWYgKHBhcmFtcy5yZW5kZXJOb3cpIHtcbiAgICAgIF90aGlzLnJlbmRlcigpO1xuICAgIH1cbiAgfTtcblxuICBfY3JlYXRlQmxhbmtPcHRpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIFtcbiAgICAnPG9wdGlvbiAnLFxuICAgICAgICAndmFsdWU9XCInLCBfYmxhbmtPcHRpb24udmFsdWUsICdcIj4nLFxuICAgICAgX2JsYW5rT3B0aW9uLnRleHQsXG4gICAgJzwvb3B0aW9uPidcbiAgICBdLmpvaW4oJycpO1xuICB9O1xuXG4gIF9kZWZhdWx0R2V0VmFsaWRPcHRpb25zID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBfY29sbGVjdGlvbi5kYXRhKCkubWFwKGZ1bmN0aW9uIChvKSB7IHJldHVybiBvLmlkOyB9KTtcbiAgfTtcblxuICAvKipcbiAgICogSGFuZGxlIHNlbGVjdGJveCBjaGFuZ2UgZXZlbnRzLlxuICAgKi9cbiAgX29uQ2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciB2YWx1ZTtcblxuICAgIHZhbHVlID0gX3NlbGVjdEJveC52YWx1ZTtcblxuICAgIGlmIChfaW5jbHVkZUJsYW5rT3B0aW9uICYmIHZhbHVlID09PSBfYmxhbmtPcHRpb24udmFsdWUpIHtcbiAgICAgIF9jb2xsZWN0aW9uLmRlc2VsZWN0KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIF9jb2xsZWN0aW9uLnNlbGVjdEJ5SWQodmFsdWUpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogSGFuZGxlIGNvbGxlY3Rpb24gc2VsZWN0IGV2ZW50cy5cbiAgICovXG4gIF9vblNlbGVjdCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZWN0ZWQsXG4gICAgICAgIHZhbGlkT3B0aW9ucztcblxuICAgIHNlbGVjdGVkID0gX2NvbGxlY3Rpb24uZ2V0U2VsZWN0ZWQoKTtcbiAgICB2YWxpZE9wdGlvbnMgPSBfZ2V0VmFsaWRPcHRpb25zKCk7XG5cbiAgICBpZiAoc2VsZWN0ZWQpIHtcbiAgICAgIGlmICh2YWxpZE9wdGlvbnMuaW5kZXhPZihzZWxlY3RlZC5pZCkgPT09IC0xKSB7XG4gICAgICAgIF9jb2xsZWN0aW9uLmRlc2VsZWN0KCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBfc2VsZWN0Qm94LnZhbHVlID0gc2VsZWN0ZWQuaWQ7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChfaW5jbHVkZUJsYW5rT3B0aW9uKSB7XG4gICAgICBfc2VsZWN0Qm94LnZhbHVlID0gX2JsYW5rT3B0aW9uLnZhbHVlO1xuICAgIH1cbiAgfTtcblxuXG4gIC8qKlxuICAgKiBEZXN0cm95IENvbGxlY3Rpb25TZWxlY3RCb3guXG4gICAqL1xuICBfdGhpcy5kZXN0cm95ID0gVXRpbC5jb21wb3NlKGZ1bmN0aW9uICgpIHtcbiAgICBfY29sbGVjdGlvbi5vZmYoJ2FkZCcsIF90aGlzLnJlbmRlcik7XG4gICAgX2NvbGxlY3Rpb24ub2ZmKCdyZW1vdmUnLCBfdGhpcy5yZW5kZXIpO1xuICAgIF9jb2xsZWN0aW9uLm9mZigncmVzZXQnLCBfdGhpcy5yZW5kZXIpO1xuICAgIF9jb2xsZWN0aW9uLm9mZignc2VsZWN0JywgX29uU2VsZWN0KTtcbiAgICBfY29sbGVjdGlvbi5vZmYoJ2Rlc2VsZWN0JywgX29uU2VsZWN0KTtcblxuICAgIF9zZWxlY3RCb3gucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgX29uQ2hhbmdlKTtcblxuICAgIF9ibGFua09wdGlvbiA9IG51bGw7XG4gICAgX2NvbGxlY3Rpb24gPSBudWxsO1xuICAgIF9mb3JtYXQgPSBudWxsO1xuICAgIF9nZXRWYWxpZE9wdGlvbnMgPSBudWxsO1xuICAgIF9pbmNsdWRlQmxhbmtPcHRpb24gPSBudWxsO1xuICAgIF9zZWxlY3RCb3ggPSBudWxsO1xuXG4gICAgX2NyZWF0ZUJsYW5rT3B0aW9uID0gbnVsbDtcbiAgICBfZGVmYXVsdEdldFZhbGlkT3B0aW9ucyA9IG51bGw7XG4gICAgX29uQ2hhbmdlID0gbnVsbDtcbiAgICBfb25TZWxlY3QgPSBudWxsO1xuXG4gICAgX2luaXRpYWxpemUgPSBudWxsO1xuICAgIF90aGlzID0gbnVsbDtcbiAgfSwgX3RoaXMuZGVzdHJveSk7XG5cbiAgLyoqXG4gICAqIFVwZGF0ZSBzZWxlY3QgYm94IGl0ZW1zLlxuICAgKi9cbiAgX3RoaXMucmVuZGVyID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBkYXRhLFxuICAgICAgICBpLFxuICAgICAgICBpZCxcbiAgICAgICAgbGVuLFxuICAgICAgICBtYXJrdXAsXG4gICAgICAgIHNlbGVjdGVkLFxuICAgICAgICB2YWxpZE9wdGlvbnM7XG5cbiAgICBkYXRhID0gX2NvbGxlY3Rpb24uZGF0YSgpO1xuICAgIG1hcmt1cCA9IFtdO1xuICAgIHNlbGVjdGVkID0gX2NvbGxlY3Rpb24uZ2V0U2VsZWN0ZWQoKTtcblxuICAgIGlmIChfaW5jbHVkZUJsYW5rT3B0aW9uID09PSB0cnVlKSB7XG4gICAgICBtYXJrdXAucHVzaChfY3JlYXRlQmxhbmtPcHRpb24oKSk7XG4gICAgfVxuXG4gICAgdmFsaWRPcHRpb25zID0gX2dldFZhbGlkT3B0aW9ucygpO1xuXG4gICAgZm9yIChpID0gMCwgbGVuID0gZGF0YS5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgaWQgPSBkYXRhW2ldLmlkO1xuXG4gICAgICBtYXJrdXAucHVzaCgnPG9wdGlvbiB2YWx1ZT1cIicgKyBpZCArICdcIicgK1xuICAgICAgICAgIChzZWxlY3RlZCA9PT0gZGF0YVtpXSA/ICcgc2VsZWN0ZWQ9XCJzZWxlY3RlZFwiJyA6ICcnKSArXG4gICAgICAgICAgKHZhbGlkT3B0aW9ucy5pbmRleE9mKGlkKSA9PT0gLTEgPyAnIGRpc2FibGVkPVwiZGlzYWJsZWRcIicgOiAnJykgK1xuICAgICAgICAgICc+JyArIF9mb3JtYXQoZGF0YVtpXSkgKyAnPC9vcHRpb24+Jyk7XG4gICAgfVxuXG4gICAgX3NlbGVjdEJveC5pbm5lckhUTUwgPSBtYXJrdXAuam9pbignJyk7XG4gICAgX29uU2VsZWN0KCk7XG4gIH07XG5cblxuICBfaW5pdGlhbGl6ZShwYXJhbXMpO1xuICBwYXJhbXMgPSBudWxsO1xuICByZXR1cm4gX3RoaXM7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IENvbGxlY3Rpb25TZWxlY3RCb3g7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBVdGlsID0gcmVxdWlyZSgnLi4vdXRpbC9VdGlsJyksXG4gICAgVmlldyA9IHJlcXVpcmUoJy4vVmlldycpO1xuXG5cbnZhciBfREVGQVVMVFMgPSB7XG4gIC8vIGNsYXNzIG5hbWUgZm9yIHRhYmxlXG4gIGNsYXNzTmFtZTogJ2NvbGxlY3Rpb24tdGFibGUnLFxuICAvLyBjbGljayBvbiB0YWJsZSByb3dzIHRvIHRyaWdnZXIgc2VsZWN0IGluIGNvbGxlY3Rpb25cbiAgY2xpY2tUb1NlbGVjdDogZmFsc2UsXG4gIC8vIGNvbHVtbnMgb2YgZGF0YSB0byBkaXNwbGF5XG4gIGNvbHVtbnM6IFtcbiAgICAvL3tcbiAgICAgIC8vIGNsYXNzIG5hbWUgZm9yIGhlYWRlciBhbmQgZGF0YSBjZWxsc1xuICAgICAgLy8gICBjbGFzc05hbWU6ICcnLFxuICAgICAgLy8gaGVhZGVyIGNvbnRlbnQgZm9yIGNvbHVtblxuICAgICAgLy8gICB0aXRsZTogJycsXG4gICAgICAvLyBmb3JtYXQgZnVuY3Rpb24gZm9yIGRhdGEgY2VsbHNcbiAgICAgIC8vICAgZm9ybWF0OiBmdW5jdGlvbiAoaXRlbSkgeyByZXR1cm4gJyc7IH1cbiAgICAgIC8vIHdoZXRoZXIgY29sdW1uIGlzIGhlYWRlciBmb3IgaXRzIHJvd1xuICAgICAgLy8gICBoZWFkZXI6IGZhbHNlXG4gICAgLy99XG4gIF0sXG4gIGVtcHR5TWFya3VwOiAnTm8gZGF0YSB0byBkaXNwbGF5JyxcbiAgLy8gd2hldGhlciB0byByZW5kZXIgYWZ0ZXIgaW5pdGlhbGl6YXRpb25cbiAgcmVuZGVyTm93OiB0cnVlXG59O1xuXG5cbi8qKlxuICogQ3JlYXRlIGEgQ29sbGVjdGlvblRhYmxlIHRvIGRpc3BsYXkgYSBjb2xsZWN0aW9uLlxuICpcbiAqIEBwYXJhbSBwYXJhbXMge09iamVjdH1cbiAqIEBwYXJhbSBwYXJhbXMuY29sbGVjdGlvbiB7Q29sbGVjdGlvbn1cbiAqICAgICAgICBDb2xsZWN0aW9uIHRvIGRpc3BsYXkuXG4gKiBAcGFyYW0gcGFyYW1zLmNvbHVtbnMge0FycmF5PE9iamVjdD59XG4gKiAgICAgICAgQXJyYXkgb2YgY29sdW1uIG9iamVjdHMgZGVmaW5pbmcgZGlzcGxheS5cbiAqICAgICAgICBFYWNoIG9iamVjdCBzaG91bGQgaGF2ZSB0aGVzZSBwcm9wZXJ0aWVzOlxuICogICAgICAgIC0gY2xhc3NOYW1lIHtTdHJpbmd9IGNsYXNzIG5hbWUgZm9yIGhlYWRlciBhbmQgZGF0YSBjZWxscy5cbiAqICAgICAgICAtIHRpdGxlIHtTdHJpbmd9IG1hcmt1cCBmb3IgaGVhZGVyIGNlbGwuXG4gKiAgICAgICAgLSBmb3JtYXQge0Z1bmN0aW9uKGl0ZW0pfSBmdW5jdGlvbiB0byBmb3JtYXQgZGF0YSBjZWxsLlxuICogICAgICAgIC0gaGVhZGVyIHtCb29sZWFufSBkZWZhdWx0IGZhbHNlLlxuICogICAgICAgICAgd2hldGhlciBjb2x1bW4gaXMgcm93IGhlYWRlciBhbmQgc2hvdWxkIHVzZSB0aCBzY29wZT1yb3cgKHRydWUpLFxuICogICAgICAgICAgb3IgYSByZWd1bGFyIGRhdGEgY2VsbCBhbmQgc2hvdWxkIHVzZSB0ZCAoZmFsc2UpLlxuICogQHBhcmFtIHBhcmFtcy5jbGlja1RvU2VsZWN0IHtCb29sZWFufVxuICogICAgICAgIERlZmF1bHQgZmFsc2UuICBXaGV0aGVyIGNsaWNraW5nIG9uIHRhYmxlIHJvd3Mgc2hvdWxkIHNlbGVjdFxuICogICAgICAgIHRoZSBjb3JyZXNwb25kaW5nIGNvbGxlY3Rpb24gaXRlbS5cbiAqIEBzZWUgbXZjL1ZpZXdcbiAqL1xudmFyIENvbGxlY3Rpb25UYWJsZSA9IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgdmFyIF90aGlzLFxuICAgICAgX2luaXRpYWxpemUsXG5cbiAgICAgIF9jbGFzc05hbWUsXG4gICAgICBfY2xpY2tUb1NlbGVjdCxcbiAgICAgIF9jb2xsZWN0aW9uLFxuICAgICAgX2NvbHVtbnMsXG4gICAgICBfZW1wdHlNYXJrdXAsXG5cbiAgICAgIF9vbkNsaWNrLFxuICAgICAgX29uU2VsZWN0O1xuXG5cbiAgcGFyYW1zID0gVXRpbC5leHRlbmQoe30sIF9ERUZBVUxUUywgcGFyYW1zKTtcbiAgX3RoaXMgPSBWaWV3KHBhcmFtcyk7XG5cbiAgX2luaXRpYWxpemUgPSBmdW5jdGlvbiAoKSB7XG4gICAgX2NsYXNzTmFtZSA9IHBhcmFtcy5jbGFzc05hbWU7XG4gICAgX2NsaWNrVG9TZWxlY3QgPSBwYXJhbXMuY2xpY2tUb1NlbGVjdDtcbiAgICBfY29sbGVjdGlvbiA9IHBhcmFtcy5jb2xsZWN0aW9uO1xuICAgIF9jb2x1bW5zID0gcGFyYW1zLmNvbHVtbnM7XG4gICAgX2VtcHR5TWFya3VwID0gcGFyYW1zLmVtcHR5TWFya3VwO1xuXG4gICAgLy8gcmVzcG9uZCB0byBjb2xsZWN0aW9uIGV2ZW50c1xuICAgIF9jb2xsZWN0aW9uLm9uKCdhZGQnLCBfdGhpcy5yZW5kZXIpO1xuICAgIF9jb2xsZWN0aW9uLm9uKCdyZW1vdmUnLCBfdGhpcy5yZW5kZXIpO1xuICAgIF9jb2xsZWN0aW9uLm9uKCdyZXNldCcsIF90aGlzLnJlbmRlcik7XG4gICAgX2NvbGxlY3Rpb24ub24oJ3NlbGVjdCcsIF9vblNlbGVjdCk7XG4gICAgX2NvbGxlY3Rpb24ub24oJ2Rlc2VsZWN0JywgX29uU2VsZWN0KTtcblxuICAgIC8vIGFkZCBjbGljayBoYW5kbGVyXG4gICAgaWYgKF9jbGlja1RvU2VsZWN0KSB7XG4gICAgICBfdGhpcy5lbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIF9vbkNsaWNrKTtcbiAgICB9XG5cbiAgICBpZiAocGFyYW1zLnJlbmRlck5vdykge1xuICAgICAgX3RoaXMucmVuZGVyKCk7XG4gICAgfVxuICB9O1xuXG5cbiAgLyoqXG4gICAqIEhhbmRsZSB0YWJsZSBjbGljayBldmVudHMuXG4gICAqIExpc3RlbmVyIGlzIG9ubHkgYWRkZWQgd2hlbiBvcHRpb25zLmNsaWNrVG9TZWxlY3QgaXMgdHJ1ZS5cbiAgICovXG4gIF9vbkNsaWNrID0gZnVuY3Rpb24gKGUpIHtcbiAgICB2YXIgdGFyZ2V0ID0gZS50YXJnZXQsXG4gICAgICAgIHJvdyA9IFV0aWwuZ2V0UGFyZW50Tm9kZSh0YXJnZXQsICdUUicsIF90aGlzLmVsKTtcblxuICAgIGlmIChyb3cgIT09IG51bGwpIHtcbiAgICAgIGlmIChyb3cucGFyZW50Tm9kZS5ub2RlTmFtZS50b1VwcGVyQ2FzZSgpID09PSAnVEJPRFknKSB7XG4gICAgICAgIF9jb2xsZWN0aW9uLnNlbGVjdEJ5SWQocm93LmdldEF0dHJpYnV0ZSgnZGF0YS1pZCcpKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIEhhbmRsZSBjb2xsZWN0aW9uIHNlbGVjdCBhbmQgZGVzZWxlY3QgZXZlbnRzLlxuICAgKi9cbiAgX29uU2VsZWN0ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBlbCA9IF90aGlzLmVsLFxuICAgICAgICBzZWxlY3RlZDtcblxuICAgIC8vIHJlbW92ZSBwcmV2aW91cyBzZWxlY3Rpb25cbiAgICBzZWxlY3RlZCA9IGVsLnF1ZXJ5U2VsZWN0b3IoJy5zZWxlY3RlZCcpO1xuICAgIGlmIChzZWxlY3RlZCkge1xuICAgICAgc2VsZWN0ZWQuY2xhc3NMaXN0LnJlbW92ZSgnc2VsZWN0ZWQnKTtcbiAgICB9XG5cbiAgICAvLyBzZXQgbmV3IHNlbGVjdGlvblxuICAgIHNlbGVjdGVkID0gX2NvbGxlY3Rpb24uZ2V0U2VsZWN0ZWQoKTtcbiAgICBpZiAoc2VsZWN0ZWQpIHtcbiAgICAgIHNlbGVjdGVkID0gZWwucXVlcnlTZWxlY3RvcignW2RhdGEtaWQ9XCInICsgc2VsZWN0ZWQuaWQgKyAnXCJdJyk7XG4gICAgICBzZWxlY3RlZC5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZCcpO1xuICAgIH1cbiAgfTtcblxuXG4gIC8qKlxuICAgKiBVbmRvIGluaXRpYWxpemF0aW9uIGFuZCBmcmVlIHJlZmVyZW5jZXMuXG4gICAqL1xuICBfdGhpcy5kZXN0cm95ID0gVXRpbC5jb21wb3NlKGZ1bmN0aW9uICgpIHtcblxuICAgIF9jb2xsZWN0aW9uLm9mZignYWRkJywgX3RoaXMucmVuZGVyKTtcbiAgICBfY29sbGVjdGlvbi5vZmYoJ3JlbW92ZScsIF90aGlzLnJlbmRlcik7XG4gICAgX2NvbGxlY3Rpb24ub2ZmKCdyZXNldCcsIF90aGlzLnJlbmRlcik7XG4gICAgX2NvbGxlY3Rpb24ub2ZmKCdzZWxlY3QnLCBfb25TZWxlY3QpO1xuICAgIF9jb2xsZWN0aW9uLm9mZignZGVzZWxlY3QnLCBfb25TZWxlY3QpO1xuICAgIF9jb2xsZWN0aW9uID0gbnVsbDtcblxuICAgIGlmIChfY2xpY2tUb1NlbGVjdCkge1xuICAgICAgX3RoaXMuZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBfb25DbGljayk7XG4gICAgfVxuICAgIF9jbGlja1RvU2VsZWN0ID0gbnVsbDtcbiAgfSwgX3RoaXMuZGVzdHJveSk7XG5cbiAgLyoqXG4gICAqIFJlbmRlciB0aGUgdmlldy5cbiAgICovXG4gIF90aGlzLnJlbmRlciA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgYyxcbiAgICAgICAgY0xlbixcbiAgICAgICAgY29sdW1uLFxuICAgICAgICBkYXRhLFxuICAgICAgICBpLFxuICAgICAgICBpZCxcbiAgICAgICAgaUxlbixcbiAgICAgICAgaXRlbSxcbiAgICAgICAgbWFya3VwO1xuXG4gICAgZGF0YSA9IF9jb2xsZWN0aW9uLmRhdGEoKTtcbiAgICBtYXJrdXAgPSBbXTtcblxuICAgIGlmIChkYXRhLmxlbmd0aCA9PT0gMCkge1xuICAgICAgX3RoaXMuZWwuaW5uZXJIVE1MID0gX2VtcHR5TWFya3VwO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIG1hcmt1cC5wdXNoKCc8dGFibGUgY2xhc3M9XCInLCBfY2xhc3NOYW1lLCAnXCI+PHRoZWFkPicpO1xuICAgIGZvciAoYyA9IDAsIGNMZW4gPSBfY29sdW1ucy5sZW5ndGg7IGMgPCBjTGVuOyBjKyspIHtcbiAgICAgIGNvbHVtbiA9IF9jb2x1bW5zW2NdO1xuICAgICAgbWFya3VwLnB1c2goJzx0aCBjbGFzcz1cIicgKyBjb2x1bW4uY2xhc3NOYW1lICsgJ1wiPicgK1xuICAgICAgICAgIGNvbHVtbi50aXRsZSArICc8L3RoPicpO1xuICAgIH1cbiAgICBtYXJrdXAucHVzaCgnPC90aGVhZD48dGJvZHk+Jyk7XG4gICAgZm9yIChpID0gMCwgaUxlbiA9IGRhdGEubGVuZ3RoOyBpIDwgaUxlbjsgaSsrKSB7XG4gICAgICBpdGVtID0gZGF0YVtpXTtcbiAgICAgIGlkID0gKCcnICsgaXRlbS5pZCkucmVwbGFjZSgvXCIvZywgJyZxdW90OycpO1xuICAgICAgbWFya3VwLnB1c2goJzx0ciBkYXRhLWlkPVwiJyArIGlkICsgJ1wiPicpO1xuICAgICAgZm9yIChjID0gMCwgY0xlbiA9IF9jb2x1bW5zLmxlbmd0aDsgYyA8IGNMZW47IGMrKykge1xuICAgICAgICBjb2x1bW4gPSBfY29sdW1uc1tjXTtcbiAgICAgICAgbWFya3VwLnB1c2goJzwnICsgKGNvbHVtbi5oZWFkZXIgPyAndGggc2NvcGU9XCJyb3dcIicgOiAndGQnKSArXG4gICAgICAgICAgICAnIGNsYXNzPVwiJyArIGNvbHVtbi5jbGFzc05hbWUgKyAnXCI+JyArXG4gICAgICAgICAgICBjb2x1bW4uZm9ybWF0KGl0ZW0pICsgJzwvdGQ+Jyk7XG4gICAgICB9XG4gICAgICBtYXJrdXAucHVzaCgnPC90cj4nKTtcbiAgICB9XG4gICAgbWFya3VwLnB1c2goJzwvdGJvZHk+PC90YWJsZT4nKTtcblxuICAgIF90aGlzLmVsLmlubmVySFRNTCA9IG1hcmt1cC5qb2luKCcnKTtcbiAgfTtcblxuXG4gIF9pbml0aWFsaXplKCk7XG4gIHJldHVybiBfdGhpcztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQ29sbGVjdGlvblRhYmxlOyIsIid1c2Ugc3RyaWN0JztcblxudmFyIENvbGxlY3Rpb24gPSByZXF1aXJlKCcuL0NvbGxlY3Rpb24nKSxcbiAgICBWaWV3ID0gcmVxdWlyZSgnLi9WaWV3JyksXG5cbiAgICBVdGlsID0gcmVxdWlyZSgnLi4vdXRpbC9VdGlsJyk7XG5cbnZhciBDb2xsZWN0aW9uVmlldyA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gIHZhciBfdGhpcyxcbiAgICAgIF9pbml0aWFsaXplLFxuXG4gICAgICBfY29sbGVjdGlvbixcbiAgICAgIF9kZXN0cm95Q29sbGVjdGlvbixcbiAgICAgIF9mYWN0b3J5LFxuICAgICAgX2xpc3QsXG4gICAgICBfdmlld3MsXG5cbiAgICAgIF9jcmVhdGVWaWV3cyxcbiAgICAgIF9vbkNvbGxlY3Rpb25BZGQsXG4gICAgICBfb25Db2xsZWN0aW9uRGVzZWxlY3QsXG4gICAgICBfb25Db2xsZWN0aW9uUmVtb3ZlLFxuICAgICAgX29uQ29sbGVjdGlvblJlc2V0LFxuICAgICAgX29uQ29sbGVjdGlvblNlbGVjdDtcblxuXG4gIF90aGlzID0gVmlldyhvcHRpb25zKTtcblxuICBfaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgdmFyIHNlbGVjdGVkO1xuXG4gICAgX2NvbGxlY3Rpb24gPSBvcHRpb25zLmNvbGxlY3Rpb247XG4gICAgX2ZhY3RvcnkgPSBvcHRpb25zLmZhY3RvcnkgfHwgVmlldztcblxuICAgIGlmICghX2NvbGxlY3Rpb24pIHtcbiAgICAgIF9jb2xsZWN0aW9uID0gQ29sbGVjdGlvbihbXSk7XG4gICAgICBfZGVzdHJveUNvbGxlY3Rpb24gPSB0cnVlO1xuICAgIH1cblxuICAgIGlmIChfdGhpcy5lbC5ub2RlTmFtZSA9PT0gJ1VMJyB8fCBfdGhpcy5lbC5ub2RlTmFtZSA9PT0gJ09MJykge1xuICAgICAgX2xpc3QgPSBfdGhpcy5lbDtcbiAgICB9IGVsc2Uge1xuICAgICAgX2xpc3QgPSBfdGhpcy5lbC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd1bCcpKTtcbiAgICB9XG5cbiAgICBfdmlld3MgPSBDb2xsZWN0aW9uKFtdKTtcblxuICAgIF9jb2xsZWN0aW9uLm9uKCdyZW5kZXInLCBfdGhpcy5yZW5kZXIpO1xuXG4gICAgX2NvbGxlY3Rpb24ub24oJ2FkZCcsIF9vbkNvbGxlY3Rpb25BZGQpO1xuICAgIF9jb2xsZWN0aW9uLm9uKCdyZW1vdmUnLCBfb25Db2xsZWN0aW9uUmVtb3ZlKTtcbiAgICBfY29sbGVjdGlvbi5vbigncmVzZXQnLCBfb25Db2xsZWN0aW9uUmVzZXQpO1xuXG4gICAgX2NvbGxlY3Rpb24ub24oJ3NlbGVjdCcsIF9vbkNvbGxlY3Rpb25TZWxlY3QpO1xuICAgIF9jb2xsZWN0aW9uLm9uKCdkZXNlbGVjdCcsIF9vbkNvbGxlY3Rpb25EZXNlbGVjdCk7XG5cbiAgICBfb25Db2xsZWN0aW9uUmVzZXQoKTtcblxuICAgIC8vIE1ha2Ugc3VyZSBhbnkgc2VsZWN0ZWQgbW9kZWwgaXMgcmVuZGVyZWQgcHJvcGVybHkgaW4gdGhlIHZpZXdcbiAgICBzZWxlY3RlZCA9IF9jb2xsZWN0aW9uLmdldFNlbGVjdGVkKCk7XG4gICAgaWYgKHNlbGVjdGVkKSB7XG4gICAgICBfb25Db2xsZWN0aW9uU2VsZWN0KHNlbGVjdGVkKTtcbiAgICB9XG4gIH07XG5cblxuICBfY3JlYXRlVmlld3MgPSBmdW5jdGlvbiAobW9kZWxzLCBwYXJlbnQpIHtcbiAgICB2YXIgdmlld3M7XG5cbiAgICBwYXJlbnQgPSBwYXJlbnQgfHwgZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuXG4gICAgdmlld3MgPSBtb2RlbHMubWFwKGZ1bmN0aW9uIChtb2RlbCkge1xuICAgICAgdmFyIHZpZXcgPSBfZmFjdG9yeSh7XG4gICAgICAgIGNvbGxlY3Rpb246IF9jb2xsZWN0aW9uLFxuICAgICAgICBlbDogcGFyZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJykpLFxuICAgICAgICBtb2RlbDogbW9kZWxcbiAgICAgIH0pO1xuXG4gICAgICBpZiAodHlwZW9mIHZpZXcuaWQgPT09ICd1bmRlZmluZWQnIHx8IHZpZXcuaWQgPT09IG51bGwpIHtcbiAgICAgICAgdmlldy5pZCA9IG1vZGVsLmlkO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdmlldztcbiAgICB9KTtcblxuICAgIHJldHVybiB2aWV3cztcbiAgfTtcblxuICBfb25Db2xsZWN0aW9uQWRkID0gZnVuY3Rpb24gKG1vZGVscykge1xuICAgIHZhciBmcmFnbWVudCxcbiAgICAgICAgdmlld3M7XG5cbiAgICBmcmFnbWVudCA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgICB2aWV3cyA9IF9jcmVhdGVWaWV3cyhtb2RlbHMsIGZyYWdtZW50KTtcblxuICAgIC8vIEFkZCB0aGUgbmV3bHkgY3JlYXRlZCB2aWV3cyB0byBvdXIgdmlldyBjb2xsZWN0aW9uXG4gICAgX3ZpZXdzLmFkZC5hcHBseShfdmlld3MsIHZpZXdzKTtcblxuICAgIC8vIEFwcGVuZCBvdXIgbmV3IHZpZXdzIHRvIHRoZSBlbmRcbiAgICBfbGlzdC5hcHBlbmRDaGlsZChmcmFnbWVudCk7XG4gIH07XG5cbiAgX29uQ29sbGVjdGlvbkRlc2VsZWN0ID0gZnVuY3Rpb24gKG1vZGVsKSB7XG4gICAgdmFyIHZpZXc7XG5cbiAgICB2aWV3ID0gX3ZpZXdzLmdldChtb2RlbC5pZCk7XG5cbiAgICBpZiAodmlldykge1xuICAgICAgdmlldy5lbC5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3RlZCcpO1xuICAgIH1cbiAgfTtcblxuICBfb25Db2xsZWN0aW9uUmVtb3ZlID0gZnVuY3Rpb24gKG1vZGVscykge1xuICAgIG1vZGVscy5mb3JFYWNoKGZ1bmN0aW9uIChtb2RlbCkge1xuICAgICAgdmFyIHZpZXcgPSBfdmlld3MuZ2V0KG1vZGVsLmlkKTtcblxuICAgICAgaWYgKHZpZXcpIHtcbiAgICAgICAgX3ZpZXdzLnJlbW92ZSh2aWV3KTtcblxuICAgICAgICBpZiAodmlldy5lbC5wYXJlbnROb2RlID09PSBfbGlzdCkge1xuICAgICAgICAgIF9saXN0LnJlbW92ZUNoaWxkKHZpZXcuZWwpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgX29uQ29sbGVjdGlvblJlc2V0ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciB2aWV3cztcblxuICAgIC8vIERlc3Ryb3kgZWFjaCBwcmV2aW91cyB2aWV3XG4gICAgX3ZpZXdzLmRhdGEoKS5mb3JFYWNoKGZ1bmN0aW9uICh2aWV3KSB7XG4gICAgICB2aWV3LmRlc3Ryb3koKTtcbiAgICB9KTtcblxuICAgIC8vIENyZWF0ZSB0aGUgdmlld3MgZm9yIHRoZSBjdXJyZW50IGRhdGEgc2V0XG4gICAgdmlld3MgPSBfY3JlYXRlVmlld3MoX2NvbGxlY3Rpb24uZGF0YSgpLCBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCkpO1xuXG5cblxuICAgIC8vIFJlc2V0IG91ciBjb2xsZWN0aW9uIHdpdGggdGhlIG5ldyB2aWV3c1xuICAgIF92aWV3cy5yZXNldCh2aWV3cyk7XG5cbiAgICAvLyBOb3cgcmVuZGVyIHRoZW0gYWxsXG4gICAgX3RoaXMucmVuZGVyKCk7XG4gIH07XG5cbiAgX29uQ29sbGVjdGlvblNlbGVjdCA9IGZ1bmN0aW9uIChtb2RlbCkge1xuICAgIHZhciB2aWV3O1xuXG4gICAgdmlldyA9IF92aWV3cy5nZXQobW9kZWwuaWQpO1xuXG4gICAgaWYgKHZpZXcpIHtcbiAgICAgIHZpZXcuZWwuY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQnKTtcbiAgICB9XG4gIH07XG5cblxuICBfdGhpcy5kZXN0cm95ID0gVXRpbC5jb21wb3NlKF90aGlzLmRlc3Ryb3ksIGZ1bmN0aW9uICgpIHtcbiAgICBfY29sbGVjdGlvbi5vZmYoJ3JlbmRlcicsIF90aGlzLnJlbmRlcik7XG5cbiAgICBfY29sbGVjdGlvbi5vZmYoJ2FkZCcsIF9vbkNvbGxlY3Rpb25BZGQpO1xuICAgIF9jb2xsZWN0aW9uLm9mZigncmVtb3ZlJywgX29uQ29sbGVjdGlvblJlbW92ZSk7XG4gICAgX2NvbGxlY3Rpb24ub2ZmKCdyZXNldCcsIF9vbkNvbGxlY3Rpb25SZXNldCk7XG5cbiAgICBfY29sbGVjdGlvbi5vZmYoJ3NlbGVjdCcsIF9vbkNvbGxlY3Rpb25TZWxlY3QpO1xuICAgIF9jb2xsZWN0aW9uLm9mZignZGVzZWxlY3QnLCBfb25Db2xsZWN0aW9uRGVzZWxlY3QpO1xuXG4gICAgaWYgKF9kZXN0cm95Q29sbGVjdGlvbikge1xuICAgICAgX2NvbGxlY3Rpb24uZGVzdHJveSgpO1xuICAgIH1cblxuICAgIF92aWV3cy5kYXRhKCkuZm9yRWFjaChmdW5jdGlvbiAodmlldykge1xuICAgICAgdmlldy5kZXN0cm95KCk7XG4gICAgfSk7XG4gICAgX3ZpZXdzLmRlc3Ryb3koKTtcblxuXG4gICAgX2NvbGxlY3Rpb24gPSBudWxsO1xuICAgIF9kZXN0cm95Q29sbGVjdGlvbiA9IG51bGw7XG4gICAgX2ZhY3RvcnkgPSBudWxsO1xuICAgIF92aWV3cyA9IG51bGw7XG5cbiAgICBfY3JlYXRlVmlld3MgPSBudWxsO1xuICAgIF9vbkNvbGxlY3Rpb25BZGQgPSBudWxsO1xuICAgIF9vbkNvbGxlY3Rpb25EZXNlbGVjdCA9IG51bGw7XG4gICAgX29uQ29sbGVjdGlvblJlbW92ZSA9IG51bGw7XG4gICAgX29uQ29sbGVjdGlvblJlc2V0ID0gbnVsbDtcbiAgICBfb25Db2xsZWN0aW9uU2VsZWN0ID0gbnVsbDtcblxuICAgIF9pbml0aWFsaXplID0gbnVsbDtcbiAgICBfdGhpcyA9IG51bGw7XG4gIH0pO1xuXG4gIF90aGlzLmdldFZpZXcgPSBmdW5jdGlvbiAobW9kZWwpIHtcbiAgICByZXR1cm4gX3ZpZXdzLmdldChtb2RlbC5pZCk7XG4gIH07XG5cbiAgX3RoaXMucmVuZGVyID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBmcmFnbWVudCA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcblxuICAgIF92aWV3cy5kYXRhKCkuZm9yRWFjaChmdW5jdGlvbiAodmlldykge1xuICAgICAgZnJhZ21lbnQuYXBwZW5kQ2hpbGQodmlldy5lbCk7XG4gICAgfSk7XG5cbiAgICBVdGlsLmVtcHR5KF9saXN0KTtcbiAgICBfbGlzdC5hcHBlbmRDaGlsZChmcmFnbWVudCk7XG4gIH07XG5cblxuICBfaW5pdGlhbGl6ZShvcHRpb25zfHx7fSk7XG4gIG9wdGlvbnMgPSBudWxsO1xuICByZXR1cm4gX3RoaXM7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IENvbGxlY3Rpb25WaWV3O1xuIiwiJ3VzZSBzdHJpY3QnO1xuLyoqXG4gKiBBIExpZ2h0d2VpZ2h0IGNvbGxlY3Rpb24sIGluc3BpcmVkIGJ5IGJhY2tib25lLlxuICpcbiAqIExhemlseSBidWlsZHMgaW5kZXhlcyB0byBhdm9pZCBvdmVyaGVhZCB1bnRpbCBuZWVkZWQuXG4gKi9cblxudmFyIEV2ZW50cyA9IHJlcXVpcmUoJy4uL3V0aWwvRXZlbnRzJyksXG4gICAgVXRpbCA9IHJlcXVpcmUoJy4uL3V0aWwvVXRpbCcpO1xuXG5cbi8qKlxuICogQ3JlYXRlIGEgbmV3IENvbGxlY3Rpb24uXG4gKlxuICogQHBhcmFtIGRhdGEge0FycmF5fVxuICogICAgICBXaGVuIG9taXR0ZWQgYSBuZXcgYXJyYXkgaXMgY3JlYXRlZC5cbiAqL1xudmFyIENvbGxlY3Rpb24gPSBmdW5jdGlvbiAoZGF0YSkge1xuXG4gIHZhciBfdGhpcyxcbiAgICAgIF9pbml0aWFsaXplLFxuXG4gICAgICBfZGF0YSxcbiAgICAgIF9pZHMsXG4gICAgICBfc2VsZWN0ZWQsXG5cbiAgICAgIF9pc1NpbGVudDtcblxuXG4gIF90aGlzID0gRXZlbnRzKCk7XG5cbiAgX2luaXRpYWxpemUgPSBmdW5jdGlvbiAoKSB7XG4gICAgX2RhdGEgPSBkYXRhIHx8IFtdO1xuICAgIF9pZHMgPSBudWxsO1xuICAgIF9zZWxlY3RlZCA9IG51bGw7XG5cbiAgICBkYXRhID0gbnVsbDtcbiAgfTtcblxuICAvKipcbiAgICogV2hldGhlciBcInNpbGVudFwiIG9wdGlvbiBpcyB0cnVlLlxuICAgKlxuICAgKiBAcGFyYW0gb3B0aW9ucyB7T2JqZWN0fVxuICAgKiBAcGFyYW0gb3B0aW9ucy5zaWxlbnQge0Jvb2xlYW59XG4gICAqICAgICAgICBkZWZhdWx0IGZhbHNlLlxuICAgKiBAcmV0dXJuIHtCb29sZWFufSB0cnVlIGlmIG9wdGlvbnMuc2lsZW50IGlzIHRydWUuXG4gICAqL1xuICBfaXNTaWxlbnQgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgIHJldHVybiBvcHRpb25zICYmIG9wdGlvbnMuc2lsZW50ID09PSB0cnVlO1xuICB9O1xuXG4gIC8qKlxuICAgKiBBZGQgb2JqZWN0cyB0byB0aGUgY29sbGVjdGlvbi5cbiAgICpcbiAgICogQ2FsbHMgd3JhcHBlZCBhcnJheS5wdXNoLCBhbmQgY2xlYXJzIHRoZSBpZCBjYWNoZS5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3TigKZ9XG4gICAqICAgICAgYSB2YXJpYWJsZSBudW1iZXIgb2Ygb2JqZWN0cyB0byBhcHBlbmQgdG8gdGhlIGNvbGxlY3Rpb24uXG4gICAqIEBkZXByZWNhdGVkIHNlZSAjYWRkQWxsKClcbiAgICovXG4gIF90aGlzLmFkZCA9IGZ1bmN0aW9uICgpIHtcbiAgICBfdGhpcy5hZGRBbGwoQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEFkZCBvYmplY3RzIHRvIHRoZSBjb2xsZWN0aW9uLlxuICAgKlxuICAgKiBDYWxscyB3cmFwcGVkIGFycmF5LnB1c2gsIGFuZCBjbGVhcnMgdGhlIGlkIGNhY2hlLlxuICAgKlxuICAgKiBAcGFyYW0gdG9hZGQge0FycmF5PE9iamVjdD59XG4gICAqICAgICAgICBvYmplY3RzIHRvIGJlIGFkZGVkIHRvIHRoZSBjb2xsZWN0aW9uLlxuICAgKi9cbiAgIF90aGlzLmFkZEFsbCA9IGZ1bmN0aW9uICh0b2FkZCwgb3B0aW9ucykge1xuICAgICBfZGF0YS5wdXNoLmFwcGx5KF9kYXRhLCB0b2FkZCk7XG4gICAgIF9pZHMgPSBudWxsO1xuICAgICBpZiAoIV9pc1NpbGVudChvcHRpb25zKSkge1xuICAgICAgIF90aGlzLnRyaWdnZXIoJ2FkZCcsIHRvYWRkKTtcbiAgICAgfVxuICAgfTtcblxuICAvKipcbiAgICogR2V0IHRoZSB3cmFwcGVkIGFycmF5LlxuICAgKlxuICAgKiBAcmV0dXJuXG4gICAqICAgICAgdGhlIHdyYXBwZWQgYXJyYXkuXG4gICAqL1xuICBfdGhpcy5kYXRhID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBfZGF0YTtcbiAgfTtcblxuICAvKipcbiAgICogRGVzZWxlY3QgY3VycmVudCBzZWxlY3Rpb24uXG4gICAqL1xuICBfdGhpcy5kZXNlbGVjdCA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgaWYgKF9zZWxlY3RlZCAhPT0gbnVsbCkge1xuICAgICAgdmFyIG9sZFNlbGVjdGVkID0gX3NlbGVjdGVkO1xuICAgICAgX3NlbGVjdGVkID0gbnVsbDtcbiAgICAgIGlmICghX2lzU2lsZW50KG9wdGlvbnMpKSB7XG4gICAgICAgIF90aGlzLnRyaWdnZXIoJ2Rlc2VsZWN0Jywgb2xkU2VsZWN0ZWQpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogRnJlZSB0aGUgYXJyYXkgYW5kIGlkIGNhY2hlLlxuICAgKlxuICAgKiBAcGFyYW0gb3B0aW9ucyB7T2JqZWN0fVxuICAgKiAgICAgICAgcGFzc2VkIHRvICNkZXNlbGVjdCgpLlxuICAgKi9cbiAgX3RoaXMuZGVzdHJveSA9IFV0aWwuY29tcG9zZShmdW5jdGlvbiAob3B0aW9ucykge1xuICAgIF9kYXRhID0gbnVsbDtcbiAgICBfaWRzID0gbnVsbDtcbiAgICBfc2VsZWN0ZWQgPSBudWxsO1xuICAgIGlmICghX2lzU2lsZW50KG9wdGlvbnMpKSB7XG4gICAgICBfdGhpcy50cmlnZ2VyKCdkZXN0cm95Jyk7XG4gICAgfVxuICAgIHJldHVybiBvcHRpb25zO1xuICB9LCBfdGhpcy5kZXN0cm95KTtcblxuICAvKipcbiAgICogR2V0IGFuIG9iamVjdCBpbiB0aGUgY29sbGVjdGlvbiBieSBJRC5cbiAgICpcbiAgICogVXNlcyBnZXRJZHMoKSwgc28gYnVpbGRzIG1hcCBvZiBJRCB0byBJTkRFWCBvbiBmaXJzdCBhY2Nlc3MgTyhOKS5cbiAgICogU3Vic2VxdWVudCBhY2Nlc3Mgc2hvdWxkIGJlIE8oMSkuXG4gICAqXG4gICAqIEBwYXJhbSBpZCB7QW55fVxuICAgKiAgICAgIGlmIHRoZSBjb2xsZWN0aW9uIGNvbnRhaW5zIG1vcmUgdGhhbiBvbmUgb2JqZWN0IHdpdGggdGhlIHNhbWUgaWQsXG4gICAqICAgICAgdGhlIGxhc3QgZWxlbWVudCB3aXRoIHRoYXQgaWQgaXMgcmV0dXJuZWQuXG4gICAqL1xuICBfdGhpcy5nZXQgPSBmdW5jdGlvbiAoaWQpIHtcbiAgICB2YXIgaWRzID0gX3RoaXMuZ2V0SWRzKCk7XG5cbiAgICBpZiAoaWRzLmhhc093blByb3BlcnR5KGlkKSkge1xuICAgICAgLy8gdXNlIGNhY2hlZCBpbmRleFxuICAgICAgcmV0dXJuIF9kYXRhW2lkc1tpZF1dO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIEdldCBhIG1hcCBmcm9tIElEIHRvIElOREVYLlxuICAgKlxuICAgKiBAcGFyYW0gZm9yY2Uge0Jvb2xlYW59XG4gICAqICAgICAgcmVidWlsZCB0aGUgbWFwIGV2ZW4gaWYgaXQgZXhpc3RzLlxuICAgKi9cbiAgX3RoaXMuZ2V0SWRzID0gZnVuY3Rpb24gKGZvcmNlKSB7XG4gICAgdmFyIGkgPSAwLFxuICAgICAgICBsZW4gPSBfZGF0YS5sZW5ndGgsXG4gICAgICAgIGlkO1xuXG4gICAgaWYgKGZvcmNlIHx8IF9pZHMgPT09IG51bGwpIHtcbiAgICAgIC8vIGJ1aWxkIHVwIGlkcyBmaXJzdCB0aW1lIHRocm91Z2hcbiAgICAgIF9pZHMgPSB7fTtcblxuICAgICAgZm9yICg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBpZCA9IF9kYXRhW2ldLmlkO1xuXG4gICAgICAgIGlmIChfaWRzLmhhc093blByb3BlcnR5KGlkKSkge1xuICAgICAgICAgIHRocm93ICdtb2RlbCB3aXRoIGR1cGxpY2F0ZSBpZCBcIicgKyBpZCArICdcIiBmb3VuZCBpbiBjb2xsZWN0aW9uJztcbiAgICAgICAgfVxuXG4gICAgICAgIF9pZHNbaWRdID0gaTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gX2lkcztcbiAgfTtcblxuICAvKipcbiAgICogR2V0IHRoZSBjdXJyZW50bHkgc2VsZWN0ZWQgb2JqZWN0LlxuICAgKi9cbiAgX3RoaXMuZ2V0U2VsZWN0ZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIF9zZWxlY3RlZDtcbiAgfTtcblxuICAvKipcbiAgICogUmVtb3ZlIG9iamVjdHMgZnJvbSB0aGUgY29sbGVjdGlvbi5cbiAgICpcbiAgICogVGhpcyBtZXRob2QgY2FsbHMgYXJyYXkuc3BsaWNlIHRvIHJlbW92ZSBpdGVtIGZyb20gYXJyYXkuXG4gICAqIFJlc2V0IHdvdWxkIGJlIGZhc3RlciBpZiBtb2RpZnlpbmcgbGFyZ2UgY2h1bmtzIG9mIHRoZSBhcnJheS5cbiAgICpcbiAgICogQHBhcmFtIG8ge09iamVjdH1cbiAgICogICAgICBvYmplY3QgdG8gcmVtb3ZlLlxuICAgKiBAZGVwcmVjYXRlZCBzZWUgI3JlbW92ZUFsbCgpXG4gICAqL1xuICBfdGhpcy5yZW1vdmUgPSBmdW5jdGlvbiAoLyogbyAqLykge1xuICAgIC8vIHRyaWdnZXIgcmVtb3ZlIGV2ZW50XG4gICAgX3RoaXMucmVtb3ZlQWxsKEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCkpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBSZW1vdmUgb2JqZWN0cyBmcm9tIHRoZSBjb2xsZWN0aW9uLlxuICAgKlxuICAgKiBSZXNldCBpcyBmYXN0ZXIgaWYgbW9kaWZ5aW5nIGxhcmdlIGNodW5rcyBvZiB0aGUgYXJyYXkuXG4gICAqXG4gICAqIEBwYXJhbSB0b3JlbW92ZSB7QXJyYXk8T2JqZWN0Pn1cbiAgICogICAgICAgIG9iamVjdHMgdG8gcmVtb3ZlLlxuICAgKiBAcGFyYW0gb3B0aW9ucyB7T2JqZWN0fVxuICAgKiBAcGFyYW0gb3B0aW9ucy5zaWxlbnQge0Jvb2xlYW59XG4gICAqICAgICAgICBkZWZhdWx0IGZhbHNlLlxuICAgKiAgICAgICAgd2hldGhlciB0byB0cmlnZ2VyIGV2ZW50cyAoZmFsc2UpLCBvciBub3QgKHRydWUpLlxuICAgKi9cbiAgX3RoaXMucmVtb3ZlQWxsID0gZnVuY3Rpb24gKHRvcmVtb3ZlLCBvcHRpb25zKSB7XG4gICAgdmFyIGksXG4gICAgICAgIGxlbiA9IHRvcmVtb3ZlLmxlbmd0aCxcbiAgICAgICAgaW5kZXhlcyA9IFtdLFxuICAgICAgICBpZHMgPSBfdGhpcy5nZXRJZHMoKSxcbiAgICAgICAgbztcblxuICAgIC8vIHNlbGVjdCBpbmRleGVzIHRvIGJlIHJlbW92ZWRcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIG8gPSB0b3JlbW92ZVtpXTtcblxuICAgICAgLy8gY2xlYXIgY3VycmVudCBzZWxlY3Rpb24gaWYgYmVpbmcgcmVtb3ZlZFxuICAgICAgaWYgKG8gPT09IF9zZWxlY3RlZCkge1xuICAgICAgICBfdGhpcy5kZXNlbGVjdCgpO1xuICAgICAgfVxuXG4gICAgICAvLyBhZGQgdG8gbGlzdCB0byBiZSByZW1vdmVkXG4gICAgICBpZiAoaWRzLmhhc093blByb3BlcnR5KG8uaWQpKSB7XG4gICAgICAgIGluZGV4ZXMucHVzaChpZHNbby5pZF0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgJ3JlbW92aW5nIG9iamVjdCBub3QgaW4gY29sbGVjdGlvbic7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gcmVtb3ZlIGluIGRlc2NlbmRpbmcgaW5kZXggb3JkZXJcbiAgICBpbmRleGVzLnNvcnQoZnVuY3Rpb24oYSxiKSB7IHJldHVybiBhLWI7IH0pO1xuXG4gICAgZm9yIChpID0gaW5kZXhlcy5sZW5ndGgtMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIF9kYXRhLnNwbGljZShpbmRleGVzW2ldLCAxKTtcbiAgICB9XG5cbiAgICAvLyByZXNldCBpZCBjYWNoZVxuICAgIF9pZHMgPSBudWxsO1xuXG4gICAgaWYgKCFfaXNTaWxlbnQob3B0aW9ucykpIHtcbiAgICAgIC8vIHRyaWdnZXIgcmVtb3ZlIGV2ZW50XG4gICAgICBfdGhpcy50cmlnZ2VyKCdyZW1vdmUnLCB0b3JlbW92ZSk7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBSZXBsYWNlIHRoZSB3cmFwcGVkIGFycmF5IHdpdGggYSBuZXcgb25lLlxuICAgKi9cbiAgX3RoaXMucmVzZXQgPSBmdW5jdGlvbiAoZGF0YSwgb3B0aW9ucykge1xuICAgIC8vIGNoZWNrIGZvciBleGlzdGluZyBzZWxlY3Rpb25cbiAgICB2YXIgc2VsZWN0ZWRJZCA9IG51bGw7XG4gICAgaWYgKF9zZWxlY3RlZCAhPT0gbnVsbCkge1xuICAgICAgc2VsZWN0ZWRJZCA9IF9zZWxlY3RlZC5pZDtcbiAgICB9XG5cbiAgICAvLyBmcmVlIGFycmF5IGFuZCBpZCBjYWNoZVxuICAgIF9kYXRhID0gbnVsbDtcbiAgICBfaWRzID0gbnVsbDtcbiAgICBfc2VsZWN0ZWQgPSBudWxsO1xuXG4gICAgLy8gc2V0IG5ldyBhcnJheVxuICAgIF9kYXRhID0gZGF0YSB8fCBbXTtcblxuICAgIC8vIG5vdGlmeSBsaXN0ZW5lcnNcbiAgICBpZiAoIW9wdGlvbnMgfHwgb3B0aW9ucy5zaWxlbnQgIT09IHRydWUpIHtcbiAgICAgIF90aGlzLnRyaWdnZXIoJ3Jlc2V0JywgZGF0YSk7XG4gICAgfVxuXG4gICAgLy8gcmVzZWxlY3QgaWYgdGhlcmUgd2FzIGEgcHJldmlvdXMgc2VsZWN0aW9uXG4gICAgaWYgKHNlbGVjdGVkSWQgIT09IG51bGwpIHtcbiAgICAgIHZhciBzZWxlY3RlZCA9IF90aGlzLmdldChzZWxlY3RlZElkKTtcbiAgICAgIGlmIChzZWxlY3RlZCAhPT0gbnVsbCkge1xuICAgICAgICBvcHRpb25zID0gVXRpbC5leHRlbmQoe30sIG9wdGlvbnMsIHsncmVzZXQnOiB0cnVlfSk7XG4gICAgICAgIF90aGlzLnNlbGVjdChzZWxlY3RlZCwgb3B0aW9ucyk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBTZWxlY3QgYW4gb2JqZWN0IGluIHRoZSBjb2xsZWN0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0gb2JqIHtPYmplY3R9XG4gICAqICAgICAgb2JqZWN0IGluIHRoZSBjb2xsZWN0aW9uIHRvIHNlbGVjdC5cbiAgICogQHRocm93cyBleGNlcHRpb25cbiAgICogICAgICBpZiBvYmogbm90IGluIGNvbGxlY3Rpb24uXG4gICAqL1xuICBfdGhpcy5zZWxlY3QgPSBmdW5jdGlvbiAob2JqLCBvcHRpb25zKSB7XG4gICAgLy8gbm8gc2VsZWN0aW9uXG4gICAgaWYgKG9iaiA9PT0gbnVsbCkge1xuICAgICAgX3RoaXMuZGVzZWxlY3QoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gYWxyZWFkeSBzZWxlY3RlZFxuICAgIGlmIChvYmogPT09IF9zZWxlY3RlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvLyBkZXNlbGVjdCBwcmV2aW91cyBzZWxlY3Rpb25cbiAgICBpZiAoX3NlbGVjdGVkICE9PSBudWxsKSB7XG4gICAgICBfdGhpcy5kZXNlbGVjdChvcHRpb25zKTtcbiAgICB9XG5cbiAgICBpZiAob2JqID09PSBfdGhpcy5nZXQob2JqLmlkKSkge1xuICAgICAgLy8gbWFrZSBzdXJlIGl0J3MgcGFydCBvZiB0aGlzIGNvbGxlY3Rpb27igKZcbiAgICAgIF9zZWxlY3RlZCA9IG9iajtcbiAgICAgIGlmICghb3B0aW9ucyB8fCBvcHRpb25zLnNpbGVudCAhPT0gdHJ1ZSkge1xuICAgICAgICBfdGhpcy50cmlnZ2VyKCdzZWxlY3QnLCBfc2VsZWN0ZWQsIG9wdGlvbnMpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyAnc2VsZWN0aW5nIG9iamVjdCBub3QgaW4gY29sbGVjdGlvbic7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBVdGlsaXR5IG1ldGhvZCB0byBzZWxlY3QgY29sbGVjdGlvbiBpdGVtIHVzaW5nIGl0cyBpZC5cbiAgICpcbiAgICogU2VsZWN0cyBtYXRjaGluZyBpdGVtIGlmIGl0IGV4aXN0cywgb3RoZXJ3aXNlIGNsZWFycyBhbnkgc2VsZWN0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0gaWQgez99XG4gICAqICAgICAgICBpZCBvZiBpdGVtIHRvIHNlbGVjdC5cbiAgICogQHBhcmFtIG9wdGlvbnMge09iamVjdH1cbiAgICogICAgICAgIG9wdGlvbnMgcGFzc2VkIHRvICNzZWxlY3QoKSBvciAjZGVzZWxlY3QoKS5cbiAgICovXG4gIF90aGlzLnNlbGVjdEJ5SWQgPSBmdW5jdGlvbiAoaWQsIG9wdGlvbnMpIHtcbiAgICB2YXIgb2JqID0gX3RoaXMuZ2V0KGlkKTtcbiAgICBpZiAob2JqICE9PSBudWxsKSB7XG4gICAgICBfdGhpcy5zZWxlY3Qob2JqLCBvcHRpb25zKTtcbiAgICB9IGVsc2Uge1xuICAgICAgX3RoaXMuZGVzZWxlY3Qob3B0aW9ucyk7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBTb3J0cyB0aGUgZGF0YS5cbiAgICpcbiAgICogQHBhcmFtIG1ldGhvZCB7RnVuY3Rpb259XG4gICAqICAgICAgICBqYXZhc2NyaXB0IHNvcnQgbWV0aG9kLlxuICAgKiBAcGFyYW0gb3B0aW9ucyB7T2JqZWN0fVxuICAgKiAgICAgICAgcGFzc2VkIHRvICNyZXNldCgpXG4gICAqL1xuICBfdGhpcy5zb3J0ID0gZnVuY3Rpb24gKG1ldGhvZCwgb3B0aW9ucykge1xuICAgIF9kYXRhLnNvcnQobWV0aG9kKTtcblxuICAgIC8vIFwicmVzZXRcIiB0byBuZXcgc29ydCBvcmRlclxuICAgIF90aGlzLnJlc2V0KF9kYXRhLCBvcHRpb25zKTtcbiAgfTtcblxuICAvKipcbiAgICogT3ZlcnJpZGUgdG9KU09OIG1ldGhvZCB0byBzZXJpYWxpemUgb25seSBjb2xsZWN0aW9uIGRhdGEuXG4gICAqL1xuICBfdGhpcy50b0pTT04gPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGpzb24gPSBfZGF0YS5zbGljZSgwKSxcbiAgICAgICAgaXRlbSxcbiAgICAgICAgaSxcbiAgICAgICAgbGVuO1xuXG4gICAgZm9yIChpID0gMCwgbGVuID0ganNvbi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgaXRlbSA9IGpzb25baV07XG4gICAgICBpZiAodHlwZW9mIGl0ZW0gPT09ICdvYmplY3QnICYmXG4gICAgICAgICAgaXRlbSAhPT0gbnVsbCAmJlxuICAgICAgICAgIHR5cGVvZiBpdGVtLnRvSlNPTiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBqc29uW2ldID0gaXRlbS50b0pTT04oKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4ganNvbjtcbiAgfTtcblxuXG4gIF9pbml0aWFsaXplKCk7XG4gIHJldHVybiBfdGhpcztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQ29sbGVjdGlvbjtcbiIsIid1c2Ugc3RyaWN0JztcblxuXG52YXIgQ29sbGVjdGlvblRhYmxlID0gcmVxdWlyZSgnLi9Db2xsZWN0aW9uVGFibGUnKSxcbiAgICBEb3dubG9hZFZpZXcgPSByZXF1aXJlKCcuL0Rvd25sb2FkVmlldycpLFxuICAgIFNvcnRWaWV3ID0gcmVxdWlyZSgnLi9Tb3J0VmlldycpLFxuICAgIFV0aWwgPSByZXF1aXJlKCcuLi91dGlsL1V0aWwnKSxcbiAgICBWaWV3ID0gcmVxdWlyZSgnLi9WaWV3Jyk7XG5cblxuLyoqXG4gKiBDcmVhdGUgYSBuZXcgRGF0YVRhYmxlIHRvIGRpc3BsYXkgYSBjb2xsZWN0aW9uLlxuICpcbiAqIEBwYXJhbSBwYXJhbXMge09iamVjdH1cbiAqICAgICAgICBhbGwgcGFyYW1zIGV4Y2VwdCBcImVsXCIgYXJlIHBhc3NlZCB0byBDb2xsZWN0aW9uVGFibGUuXG4gKiBAcGFyYW0gcGFyYW1zLnNvcnRzIHtBcnJheTxPYmplY3Q+fVxuICogICAgICAgIHNvcnQgb2JqZWN0cyB1c2VkIGJ5IFNvcnRWaWV3LlxuICogQHBhcmFtIHBhcmFtcy5mb3JtYXREb3dubG9hZCB7RnVuY3Rpb24oQ29sbGVjdGlvbil9XG4gKiAgICAgICAgT3B0aW9uYWwsIGRlZmF1bHQgaXMgVGFiIFNlcGFyYXRlZCBWYWx1ZXMuXG4gKiBAcGFyYW0gcGFyYW1zLmNvbHVtbnMge0FycmF5PE9iamVjdD59XG4gKiAgICAgICAgY29sdW1uIG9iamVjdHMgdXNlZCBieSBDb2xsZWN0aW9uVGFibGUuXG4gKiBAcGFyYW0gcGFyYW1zLmNvbHVtbnNbWF0uZG93bmxvYWRGb3JtYXQge0Z1bmN0aW9uKE9iamVjdCl9XG4gKiAgICAgICAgT3B0aW9uYWwsIGRlZmF1bHQgaXMgY29sdW1uLmZvcm1hdC5cbiAqICAgICAgICBGdW5jdGlvbiB1c2VkIHRvIGZvcm1hdCBhIGNvbHVtbiB2YWx1ZSBmb3IgZG93bmxvYWQuXG4gKiAgICAgICAgVXNlZCBieSBEYXRhVGFibGUuX2Zvcm1hdERvd25sb2FkLlxuICogQHBhcmFtIHBhcmFtcy5jb2x1bW5zW1hdLmRvd25sb2FkVGl0bGUge3N0cmluZ31cbiAqICAgICAgICBPcHRpb25hbCwgZGVmYXVsdCBpcyBjb2x1bW4udGl0bGUuXG4gKiAgICAgICAgY29sdW1uIHRpdGxlIHZhbHVlIGZvciBkb3dubG9hZC5cbiAqICAgICAgICBVc2VkIGJ5IERhdGFUYWJsZS5fZm9ybWF0RG93bmxvYWQuXG4gKiBAc2VlIENvbGxlY3Rpb25UYWJsZVxuICogQHNlZSBTb3J0Vmlld1xuICogQHNlZSBEb3dubG9hZFZpZXdcbiAqL1xudmFyIERhdGFUYWJsZSA9IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgdmFyIF90aGlzLFxuICAgICAgX2luaXRpYWxpemUsXG5cbiAgICAgIF9jb2xsZWN0aW9uLFxuICAgICAgX2NvbGxlY3Rpb25UYWJsZSxcbiAgICAgIF9jb2x1bW5zLFxuICAgICAgX2Rvd25sb2FkQnV0dG9uLFxuICAgICAgX2Rvd25sb2FkVmlldyxcbiAgICAgIF9zb3J0cyxcbiAgICAgIF9zb3J0VmlldyxcblxuICAgICAgX2Zvcm1hdERvd25sb2FkO1xuXG5cbiAgX3RoaXMgPSBWaWV3KHBhcmFtcyk7XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgdGhlIERhdGFUYWJsZS5cbiAgICovXG4gIF9pbml0aWFsaXplID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBlbCxcbiAgICAgICAgdG9vbHM7XG5cbiAgICBlbCA9IF90aGlzLmVsO1xuICAgIGVsLmlubmVySFRNTCA9ICc8ZGl2IGNsYXNzPVwiZGF0YXRhYmxlLXRvb2xzXCI+PC9kaXY+JyArXG4gICAgICAgICc8ZGl2IGNsYXNzPVwiZGF0YXRhYmxlLWRhdGFcIj48L2Rpdj4nO1xuICAgIGVsLmNsYXNzTGlzdC5hZGQoJ2RhdGF0YWJsZScpO1xuICAgIHRvb2xzID0gZWwucXVlcnlTZWxlY3RvcignLmRhdGF0YWJsZS10b29scycpO1xuXG4gICAgX2NvbGxlY3Rpb24gPSBwYXJhbXMuY29sbGVjdGlvbjtcbiAgICBfY29sdW1ucyA9IHBhcmFtcy5jb2x1bW5zO1xuXG4gICAgLy8gc29ydFxuICAgIF9zb3J0cyA9IHBhcmFtcy5zb3J0cztcbiAgICBpZiAoX3NvcnRzKSB7XG4gICAgICBfc29ydFZpZXcgPSBuZXcgU29ydFZpZXcoe1xuICAgICAgICBjb2xsZWN0aW9uOiBfY29sbGVjdGlvbixcbiAgICAgICAgc29ydHM6IF9zb3J0cyxcbiAgICAgICAgZGVmYXVsdFNvcnQ6IHBhcmFtcy5kZWZhdWx0U29ydFxuICAgICAgfSk7XG4gICAgICB0b29scy5hcHBlbmRDaGlsZChfc29ydFZpZXcuZWwpO1xuICAgIH1cblxuICAgIC8vIGRhdGFcbiAgICBfY29sbGVjdGlvblRhYmxlID0gbmV3IENvbGxlY3Rpb25UYWJsZShcbiAgICAgICAgVXRpbC5leHRlbmQoe30sIHBhcmFtcywge1xuICAgICAgICAgIGVsOiBlbC5xdWVyeVNlbGVjdG9yKCcuZGF0YXRhYmxlLWRhdGEnKVxuICAgICAgICB9KSk7XG5cbiAgICAvLyBkb3dubG9hZFxuICAgIF9kb3dubG9hZFZpZXcgPSBuZXcgRG93bmxvYWRWaWV3KHtcbiAgICAgIGNvbGxlY3Rpb246IF9jb2xsZWN0aW9uLFxuICAgICAgaGVscDogcGFyYW1zLmhlbHAgfHwgJ0NvcHkgdGhlbiBwYXN0ZSBpbnRvIGEgc3ByZWFkc2hlZXQgYXBwbGljYXRpb24nLFxuICAgICAgZm9ybWF0OiBwYXJhbXMuZm9ybWF0RG93bmxvYWQgfHwgX2Zvcm1hdERvd25sb2FkXG4gICAgfSk7XG5cbiAgICBfZG93bmxvYWRCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBfZG93bmxvYWRCdXR0b24uaW5uZXJIVE1MID0gJ0Rvd25sb2FkJztcbiAgICBfZG93bmxvYWRCdXR0b24uY2xhc3NOYW1lID0gJ2Rvd25sb2FkJztcbiAgICBfZG93bmxvYWRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBfZG93bmxvYWRWaWV3LnNob3cpO1xuICAgIHRvb2xzLmFwcGVuZENoaWxkKF9kb3dubG9hZEJ1dHRvbik7XG5cblxuICAgIHBhcmFtcyA9IG51bGw7XG4gIH07XG5cblxuICAvKipcbiAgICogQ2FsbGJhY2sgdXNlZCB0byBmb3JtYXQgZG93bmxvYWRzLlxuICAgKiBUaGlzIGltcGxlbWVudGF0aW9uIG91dHB1dHMgVGFiIFNlcGFyYXRlZCBWYWx1ZXMuXG4gICAqL1xuICBfZm9ybWF0RG93bmxvYWQgPSBmdW5jdGlvbiAoY29sbGVjdGlvbikge1xuICAgIHZhciBjLFxuICAgICAgICBjTGVuLFxuICAgICAgICBjb250ZW50LFxuICAgICAgICBjb2x1bW4sXG4gICAgICAgIGRhdGEsXG4gICAgICAgIGZvcm1hdCxcbiAgICAgICAgaSxcbiAgICAgICAgaUxlbixcbiAgICAgICAgaXRlbSxcbiAgICAgICAgcm93O1xuXG4gICAgY29udGVudCA9IFtdO1xuICAgIGRhdGEgPSBjb2xsZWN0aW9uLmRhdGEoKTtcbiAgICByb3cgPSBbXTtcblxuICAgIGZvciAoYyA9IDAsIGNMZW4gPSBfY29sdW1ucy5sZW5ndGg7IGMgPCBjTGVuOyBjKyspIHtcbiAgICAgIGNvbHVtbiA9IF9jb2x1bW5zW2NdO1xuICAgICAgcm93LnB1c2goY29sdW1uLmRvd25sb2FkVGl0bGUgfHwgY29sdW1uLnRpdGxlKTtcbiAgICB9XG4gICAgY29udGVudC5wdXNoKHJvdy5qb2luKCdcXHQnKSk7XG5cbiAgICBmb3IgKGkgPSAwLCBpTGVuID0gZGF0YS5sZW5ndGg7IGkgPCBpTGVuOyBpKyspIHtcbiAgICAgIGl0ZW0gPSBkYXRhW2ldO1xuICAgICAgcm93ID0gW107XG4gICAgICBmb3IgKGMgPSAwLCBjTGVuID0gX2NvbHVtbnMubGVuZ3RoOyBjIDwgY0xlbjsgYysrKSB7XG4gICAgICAgIGNvbHVtbiA9IF9jb2x1bW5zW2NdO1xuICAgICAgICBmb3JtYXQgPSBjb2x1bW4uZG93bmxvYWRGb3JtYXQgfHwgY29sdW1uLmZvcm1hdDtcbiAgICAgICAgcm93LnB1c2goZm9ybWF0KGl0ZW0pKTtcbiAgICAgIH1cbiAgICAgIGNvbnRlbnQucHVzaChyb3cuam9pbignXFx0JykpO1xuICAgIH1cblxuICAgIHJldHVybiBjb250ZW50LmpvaW4oJ1xcbicpO1xuICB9O1xuXG5cbiAgLyoqXG4gICAqIERlc3Ryb3kgdGhlIERhdGFUYWJsZS5cbiAgICovXG4gIF90aGlzLmRlc3Ryb3kgPSBVdGlsLmNvbXBvc2UoZnVuY3Rpb24gKCkge1xuICAgIGlmIChfc29ydFZpZXcpIHtcbiAgICAgIF9zb3J0Vmlldy5kZXN0cm95KCk7XG4gICAgICBfc29ydFZpZXcgPSBudWxsO1xuICAgIH1cblxuICAgIF9kb3dubG9hZEJ1dHRvbi5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIF9kb3dubG9hZFZpZXcuc2hvdyk7XG4gICAgX2Rvd25sb2FkQnV0dG9uID0gbnVsbDtcblxuICAgIF9kb3dubG9hZFZpZXcuZGVzdHJveSgpO1xuICAgIF9kb3dubG9hZFZpZXcgPSBudWxsO1xuXG4gICAgX2NvbGxlY3Rpb25UYWJsZS5kZXN0cm95KCk7XG4gICAgX2NvbGxlY3Rpb25UYWJsZSA9IG51bGw7XG4gIH0sIF90aGlzLmRlc3Ryb3kpO1xuXG5cbiAgX2luaXRpYWxpemUoKTtcbiAgcmV0dXJuIF90aGlzO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBEYXRhVGFibGU7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBNb2RhbFZpZXcgPSByZXF1aXJlKCcuL01vZGFsVmlldycpLFxuICAgIFV0aWwgPSByZXF1aXJlKCcuLi91dGlsL1V0aWwnKSxcbiAgICBWaWV3ID0gcmVxdWlyZSgnLi9WaWV3Jyk7XG5cblxudmFyIF9ERUZBVUxUUyA9IHtcbiAgLy8gdGl0bGUgb2YgbW9kYWwgZGlhbG9nLlxuICB0aXRsZTogJ0Rvd25sb2FkJyxcbiAgLy8gbWFya3VwIHRvIGRlc2NyaWJlIGRvd25sb2FkIGNvbnRlbnQuXG4gIGhlbHA6ICcnLFxuICAvLyBjYWxsYmFjayBmdW5jdGlvbiB0byBmb3JtYXQgY29sbGVjdGlvbiBmb3IgZG93bmxvYWQuXG4gIGZvcm1hdDogZnVuY3Rpb24gKGNvbGxlY3Rpb24pIHtcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoY29sbGVjdGlvbik7XG4gIH1cbn07XG5cblxuLyoqXG4gKiBDcmVhdGUgYSBEb3dubG9hZFZpZXcuXG4gKlxuICogQHBhcmFtIG9wdGlvbnMge09iamVjdH1cbiAqIEBwYXJhbSBvcHRpb25zLnRpdGxlIHtTdHJpbmd9XG4gKiAgICAgICAgRGVmYXVsdCAnRG93bmxvYWQnLlxuICogICAgICAgIE1vZGFsIGRpYWxvZyB0aXRsZS5cbiAqIEBwYXJhbSBvcHRpb25zLmZvcm1hdCB7RnVuY3Rpb24oQ29sbGVjdGlvbil9XG4gKiAgICAgICAgRGVmYXVsdCBKU09OLnN0cmluZ2lmeS5cbiAqICAgICAgICBmdW5jdGlvbiB0byBmb3JtYXQgY29sbGVjdGlvbiBmb3IgZG93bmxvYWQuXG4gKiBAc2VlIG12Yy9WaWV3XG4gKi9cbnZhciBEb3dubG9hZFZpZXcgPSBmdW5jdGlvbiAocGFyYW1zKSB7XG4gIHZhciBfdGhpcyxcbiAgICAgIF9pbml0aWFsaXplLFxuXG4gICAgICBfY29sbGVjdGlvbixcbiAgICAgIF9mb3JtYXQsXG4gICAgICBfbW9kYWwsXG4gICAgICBfdGV4dGFyZWEsXG4gICAgICBfdGl0bGU7XG5cblxuICBwYXJhbXMgPSBVdGlsLmV4dGVuZCh7fSwgX0RFRkFVTFRTLCBwYXJhbXMpO1xuICBfdGhpcyA9IFZpZXcocGFyYW1zKTtcblxuICAvKipcbiAgICogSW5pdGlhbGl6ZSB0aGUgZG93bmxvYWQgdmlldy5cbiAgICovXG4gIF9pbml0aWFsaXplID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBlbCA9IF90aGlzLmVsO1xuXG4gICAgX2NvbGxlY3Rpb24gPSBwYXJhbXMuY29sbGVjdGlvbjtcbiAgICBfZm9ybWF0ID0gcGFyYW1zLmZvcm1hdDtcbiAgICBfdGl0bGUgPSBwYXJhbXMudGl0bGU7XG5cbiAgICBlbC5jbGFzc05hbWUgPSAnZG93bmxvYWQtdmlldyc7XG4gICAgZWwuaW5uZXJIVE1MID0gJzxkaXYgY2xhc3M9XCJoZWxwXCI+JyArIHBhcmFtcy5oZWxwICsgJzwvZGl2PicgK1xuICAgICAgICAnPHRleHRhcmVhIGNsYXNzPVwiZG93bmxvYWRcIiByZWFkb25seT1cInJlYWRvbmx5XCI+PC90ZXh0YXJlYT4nO1xuICAgIF90ZXh0YXJlYSA9IGVsLnF1ZXJ5U2VsZWN0b3IoJy5kb3dubG9hZCcpO1xuXG4gICAgcGFyYW1zID0gbnVsbDtcbiAgfTtcblxuICAvKipcbiAgICogRGVzdHJveSB0aGUgZG93bmxvYWQgdmlldy5cbiAgICovXG4gIF90aGlzLmRlc3Ryb3kgPSBVdGlsLmNvbXBvc2UoZnVuY3Rpb24gKCkge1xuICAgIGlmIChfbW9kYWwpIHtcbiAgICAgIC8vIFRPRE86IGhpZGUgZmlyc3Q/XG4gICAgICBfbW9kYWwuZGVzdHJveSgpO1xuICAgICAgX21vZGFsID0gbnVsbDtcbiAgICB9XG5cbiAgICBfY29sbGVjdGlvbiA9IG51bGw7XG4gICAgX2Zvcm1hdCA9IG51bGw7XG4gICAgX3RleHRhcmVhID0gbnVsbDtcbiAgfSwgX3RoaXMuZGVzdHJveSk7XG5cbiAgLyoqXG4gICAqIEZvcm1hdCBjb2xsZWN0aW9uIGZvciBkb3dubG9hZC5cbiAgICovXG4gIF90aGlzLnJlbmRlciA9IGZ1bmN0aW9uICgpIHtcbiAgICBfdGV4dGFyZWEudmFsdWUgPSBfZm9ybWF0KF9jb2xsZWN0aW9uKTtcbiAgfTtcblxuICAvKipcbiAgICogU2hvdyB0aGUgZG93bmxvYWQgdmlldywgY2FsbHMgcmVuZGVyIGJlZm9yZSBzaG93aW5nIG1vZGFsLlxuICAgKi9cbiAgX3RoaXMuc2hvdyA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIV9tb2RhbCkge1xuICAgICAgX21vZGFsID0gbmV3IE1vZGFsVmlldyhfdGhpcy5lbCwge1xuICAgICAgICB0aXRsZTogX3RpdGxlXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBfdGhpcy5yZW5kZXIoKTtcbiAgICBfbW9kYWwuc2hvdygpO1xuICAgIF90ZXh0YXJlYS5zZWxlY3QoKTtcbiAgfTtcblxuICBfaW5pdGlhbGl6ZSgpO1xuICByZXR1cm4gX3RoaXM7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IERvd25sb2FkVmlldzsiLCIndXNlIHN0cmljdCc7XG5cblxudmFyIENvbGxlY3Rpb24gPSByZXF1aXJlKCdtdmMvQ29sbGVjdGlvbicpLFxuICAgIENvbGxlY3Rpb25WaWV3ID0gcmVxdWlyZSgnbXZjL0NvbGxlY3Rpb25WaWV3JyksXG4gICAgTW9kYWxWaWV3ID0gcmVxdWlyZSgnbXZjL01vZGFsVmlldycpLFxuICAgIE1vZGVsID0gcmVxdWlyZSgnbXZjL01vZGVsJyksXG4gICAgVmlldyA9IHJlcXVpcmUoJ212Yy9WaWV3JyksXG5cbiAgICBGaWxlSU8gPSByZXF1aXJlKCd1dGlsL0ZpbGVJTycpLFxuICAgIE1lc3NhZ2UgPSByZXF1aXJlKCd1dGlsL01lc3NhZ2UnKSxcbiAgICBVdGlsID0gcmVxdWlyZSgndXRpbC9VdGlsJyk7XG5cblxudmFyIF9GSUxFX1NJWkVfU1VGRklYRVMgPSBbJ0InLCAnS0InLCAnTUInLCAnR0InXTtcblxudmFyIF9ERUZBVUxUX0lOVFJPX1RFWFQgPSBbXG4gICdZb3UgbWF5ICZsZHF1bztCcm93c2UmcmRxdW87IGZvciBmaWxlcywgb3IgZHJhZy1hbmQtZHJvcCBmaWxlcyB1c2luZyB0aGUgJyxcbiAgJ2FyZWEgYmVsb3cuIE9uY2UgeW91IGhhdmUgYWRkZWQgZmlsZXMsIHlvdSBtYXkgcHJldmlldyB0aGVtIGJ5IGNsaWNraW5nICcsXG4gICd0aGUgYmx1ZSBmaWxlIG5hbWUuIFByZXZpZXcgYmVoYXZpb3IgaXMgYnJvd3Nlci1kZXBlbmRlbnQuIElmIHlvdSBzZWxlY3QgJyxcbiAgJ2EgZmlsZSB3aXRoIHRoZSBzYW1lIG5hbWUgbW9yZSB0aGFuIG9uY2UsIHRoZW4gb25seSB0aGUgbW9zdCByZWNlbnQgJyxcbiAgJ3NlbGVjdGlvbiB3aWxsIGJlIHVzZWQuIERpcmVjdG9yaWVzIGFyZSBub3Qgc3VwcG9ydGVkLidcbl0uam9pbignJyk7XG5cbi8vIERlZmF1bHQgdmFsdWVzIHRvIGJlIHVzZWQgYnkgY29uc3RydWN0b3JcbnZhciBfREVGQVVMVFMgPSB7XG4gIGJyb3dzZVRleHQ6ICdCcm93c2UnLFxuXG4gIGNhbmNlbENhbGxiYWNrOiBmdW5jdGlvbiAoKSB7fSxcbiAgY2FuY2VsVGV4dDogJ0NhbmNlbCcsXG4gIGNhbmNlbFRvb2x0aXA6ICdDYW5jZWwnLFxuXG4gIGRyb3B6b25lVGV4dDogJ0RyYWcgJmFtcDsgZHJvcCBmaWxlKHMpIGhlcmUmaGVsbGlwOycsXG5cbiAgaW50cm86IHtcbiAgICB0ZXh0OiBfREVGQVVMVF9JTlRST19URVhULFxuICAgIGNsYXNzZXM6ICdhbGVydCBpbmZvJ1xuICB9LFxuXG4gIHRpdGxlOiAnRmlsZSBJbnB1dCcsXG5cbiAgdXBsb2FkQ2FsbGJhY2s6IGZ1bmN0aW9uICgpIHt9LFxuICB1cGxvYWRUZXh0OiAnVXBsb2FkJyxcbiAgdXBsb2FkVG9vbHRpcDogJ1VwbG9hZCBmaWxlKHMpJ1xufTtcblxuXG4vKipcbiAqIFByaXZhdGUgaW5uZXIgY2xhc3MuIFRoaXMgaXMgYSB2aWV3IGZvciByZW5kZXJpbmcgaW5kaXZpZHVhbCBmaWxlcyBpblxuICogYSBsaXN0LXR5cGUgZm9ybWF0LiBJdCBpcyBwcm92aWRlZCB0byB0aGUgQ29sbGVjdGlvblZpZXcgYXMgdGhlIGZhY3RvcnkuXG4gKlxuICovXG52YXIgRmlsZVZpZXcgPSBmdW5jdGlvbiAocGFyYW1zKSB7XG4gIHZhciBfdGhpcyxcbiAgICAgIF9pbml0aWFsaXplLFxuXG4gICAgICBfY29sbGVjdGlvbixcbiAgICAgIF9kZWxldGUsXG4gICAgICBfZmlsZU5hbWUsXG4gICAgICBfZmlsZVNpemUsXG5cbiAgICAgIF9iaW5kRXZlbnRMaXN0ZW5lcnMsXG4gICAgICBfY3JlYXRlVmlld1NrZWxldG9uLFxuICAgICAgX2Zvcm1hdEZpbGVTaXplLFxuICAgICAgX29uRGVsZXRlQ2xpY2ssXG4gICAgICBfdW5iaW5kRXZlbnRMaXN0ZW5lcnM7XG5cblxuICBfdGhpcyA9IFZpZXcocGFyYW1zKTtcblxuICBfaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uICgvKnBhcmFtcyovKSB7XG4gICAgX2NvbGxlY3Rpb24gPSBwYXJhbXMuY29sbGVjdGlvbjtcbiAgICBfY3JlYXRlVmlld1NrZWxldG9uKCk7XG4gICAgX2JpbmRFdmVudExpc3RlbmVycygpO1xuXG4gICAgX3RoaXMucmVuZGVyKCk7XG4gIH07XG5cblxuICBfYmluZEV2ZW50TGlzdGVuZXJzID0gZnVuY3Rpb24gKCkge1xuICAgIF9kZWxldGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBfb25EZWxldGVDbGljayk7XG4gIH07XG5cbiAgX2NyZWF0ZVZpZXdTa2VsZXRvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICBfdGhpcy5lbC5jbGFzc0xpc3QuYWRkKCdmaWxlLXZpZXcnKTtcblxuICAgIF90aGlzLmVsLmlubmVySFRNTCA9IFtcbiAgICAgICc8c3BhbiBjbGFzcz1cImZpbGUtdmlldy1sYWJlbFwiPicsXG4gICAgICAgICc8YSBocmVmPVwiamF2YXNjcmlwdDp2b2lkKG51bGwpO1wiIHRhcmdldD1cIl9ibGFua1wiICcsXG4gICAgICAgICAgICAnY2xhc3M9XCJmaWxlLXZpZXctbmFtZVwiPjwvYT4nLFxuICAgICAgICAnPHNwYW4gY2xhc3M9XCJmaWxlLXZpZXctc2l6ZVwiPjwvc3Bhbj4nLFxuICAgICAgJzwvc3Bhbj4nLFxuICAgICAgJzxhIGhyZWY9XCJqYXZhc2NyaXB0OnZvaWQobnVsbCk7XCIgY2xhc3M9XCJmaWxlLXZpZXctZGVsZXRlXCIgJyxcbiAgICAgICAgICAndGl0bGU9XCJEZWxldGUgRmlsZVwiPiZ0aW1lczs8L2E+J1xuICAgIF0uam9pbignJyk7XG5cbiAgICBfZmlsZU5hbWUgPSBfdGhpcy5lbC5xdWVyeVNlbGVjdG9yKCcuZmlsZS12aWV3LW5hbWUnKTtcbiAgICBfZmlsZVNpemUgPSBfdGhpcy5lbC5xdWVyeVNlbGVjdG9yKCcuZmlsZS12aWV3LXNpemUnKTtcbiAgICBfZGVsZXRlID0gX3RoaXMuZWwucXVlcnlTZWxlY3RvcignLmZpbGUtdmlldy1kZWxldGUnKTtcbiAgfTtcblxuICBfZm9ybWF0RmlsZVNpemUgPSBmdW5jdGlvbiAoc2l6ZSkge1xuICAgIHZhciBudW1EZWNpbWFscyxcbiAgICAgICAgc3VmZml4SW5kZXg7XG5cbiAgICBudW1EZWNpbWFscyA9IDA7XG4gICAgc3VmZml4SW5kZXggPSAwO1xuXG4gICAgd2hpbGUgKHNpemUgPiAxMDI0ICYmIHN1ZmZpeEluZGV4IDwgX0ZJTEVfU0laRV9TVUZGSVhFUy5sZW5ndGgpIHtcbiAgICAgIHNpemUgLz0gMTAyNDtcbiAgICAgIHN1ZmZpeEluZGV4Kys7XG4gICAgfVxuXG4gICAgaWYgKHNpemUgLSBwYXJzZUludChzaXplLCAxMCkgIT09IDApIHtcbiAgICAgIG51bURlY2ltYWxzID0gMTtcbiAgICB9XG5cbiAgICByZXR1cm4gc2l6ZS50b0ZpeGVkKG51bURlY2ltYWxzKSArIF9GSUxFX1NJWkVfU1VGRklYRVNbc3VmZml4SW5kZXhdO1xuICB9O1xuXG4gIF9vbkRlbGV0ZUNsaWNrID0gZnVuY3Rpb24gKCkge1xuICAgIGlmIChfY29sbGVjdGlvbikge1xuICAgICAgX2NvbGxlY3Rpb24ucmVtb3ZlKF90aGlzLm1vZGVsKTtcbiAgICB9XG5cbiAgICBfdGhpcy5kZXN0cm95KCk7XG4gIH07XG5cbiAgX3VuYmluZEV2ZW50TGlzdGVuZXJzID0gZnVuY3Rpb24gKCkge1xuICAgIF9kZWxldGUucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBfb25EZWxldGVDbGljayk7XG4gIH07XG5cblxuICBfdGhpcy5kZXN0cm95ID0gVXRpbC5jb21wb3NlKGZ1bmN0aW9uICgpIHtcbiAgICBfdW5iaW5kRXZlbnRMaXN0ZW5lcnMoKTtcblxuICAgIF9jb2xsZWN0aW9uID0gbnVsbDtcbiAgICBfZGVsZXRlID0gbnVsbDtcbiAgICBfZmlsZU5hbWUgPSBudWxsO1xuICAgIF9maWxlU2l6ZSA9IG51bGw7XG5cbiAgICBfYmluZEV2ZW50TGlzdGVuZXJzID0gbnVsbDtcbiAgICBfY3JlYXRlVmlld1NrZWxldG9uID0gbnVsbDtcbiAgICBfZm9ybWF0RmlsZVNpemUgPSBudWxsO1xuICAgIF9vbkRlbGV0ZUNsaWNrID0gbnVsbDtcbiAgICBfdW5iaW5kRXZlbnRMaXN0ZW5lcnMgPSBudWxsO1xuXG4gICAgX2luaXRpYWxpemUgPSBudWxsO1xuICAgIF90aGlzID0gbnVsbDtcbiAgfSwgX3RoaXMuZGVzdHJveSk7XG5cbiAgX3RoaXMucmVuZGVyID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBmaWxlO1xuXG4gICAgZmlsZSA9IF90aGlzLm1vZGVsLmdldCgnZmlsZScpO1xuXG4gICAgX2ZpbGVOYW1lLmlubmVySFRNTCA9IGZpbGUubmFtZTtcbiAgICBfZmlsZU5hbWUuc2V0QXR0cmlidXRlKCd0aXRsZScsIGZpbGUubmFtZSk7XG4gICAgX2ZpbGVOYW1lLnNldEF0dHJpYnV0ZSgnaHJlZicsIF90aGlzLm1vZGVsLmdldCgndXJsJykpO1xuICAgIF9maWxlTmFtZS5zZXRBdHRyaWJ1dGUoJ2Rvd25sb2FkJywgZmlsZS5uYW1lKTtcblxuICAgIF9maWxlU2l6ZS5pbm5lckhUTUwgPSAnKCcgKyBfZm9ybWF0RmlsZVNpemUoZmlsZS5zaXplKSArICcpJztcbiAgfTtcblxuICBfaW5pdGlhbGl6ZShwYXJhbXMpO1xuICBwYXJhbXMgPSBudWxsO1xuICByZXR1cm4gX3RoaXM7XG59O1xuXG5cbi8qKlxuICogQ2xhc3M6IEZpbGVJbnB1dFZpZXdcbiAqXG4gKiBAcGFyYW0gcGFyYW1zIHtPYmplY3R9XG4gKiAgICAgIENvbmZpZ3VyYXRpb24gb3B0aW9ucy4gU2VlIF9ERUZBVUxUUyBmb3IgbW9yZSBkZXRhaWxzLlxuICovXG52YXIgRmlsZUlucHV0VmlldyA9IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgdmFyIF90aGlzLFxuICAgICAgX2luaXRpYWxpemUsXG5cbiAgICAgIF9icm93c2VCdXR0b24sXG4gICAgICBfY2FuY2VsQ2FsbGJhY2ssXG4gICAgICBfY29sbGVjdGlvbixcbiAgICAgIF9jb2xsZWN0aW9uVmlldyxcbiAgICAgIF9kcm9wem9uZSxcbiAgICAgIF9maWxlSW5wdXQsXG4gICAgICBfZmlsZXNDb250YWluZXIsXG4gICAgICBfaW8sXG4gICAgICBfbWVzc2FnZUNvbnRhaW5lcixcbiAgICAgIF9tb2RhbCxcbiAgICAgIF91cGxvYWRDYWxsYmFjayxcblxuICAgICAgX2JpbmRFdmVudExpc3RlbmVycyxcbiAgICAgIF9jcmVhdGVWaWV3U2tlbGV0b24sXG4gICAgICBfaGFuZGxlRmlsZSxcbiAgICAgIF9vbkJyb3dzZUNsaWNrLFxuICAgICAgX29uQ2FuY2VsQ2xpY2ssXG4gICAgICBfb25EcmFnTGVhdmUsXG4gICAgICBfb25EcmFnT3ZlcixcbiAgICAgIF9vbkRyb3AsXG4gICAgICBfb25SZWFkRXJyb3IsXG4gICAgICBfb25SZWFkU3VjY2VzcyxcbiAgICAgIF9vblVwbG9hZENsaWNrLFxuICAgICAgX3Nob3dFcnJvcixcbiAgICAgIF91bmJpbmRFdmVudExpc3RlbmVycztcblxuXG4gIC8vIEluaGVyaXQgZnJvbSBwYXJlbnQgY2xhc3NcbiAgX3RoaXMgPSBWaWV3KHBhcmFtcyk7XG5cbiAgLyoqXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKlxuICAgKi9cbiAgX2luaXRpYWxpemUgPSBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgLy8gRW51bWVyYXRlIGVhY2ggcHJvcGVydHkgZXhwZWN0ZWQgdG8gYmUgZ2l2ZW4gaW4gcGFyYW1zIG1ldGhvZFxuICAgIHBhcmFtcyA9IFV0aWwuZXh0ZW5kKHt9LCBfREVGQVVMVFMsIHBhcmFtcyk7XG5cbiAgICBfY29sbGVjdGlvbiA9IENvbGxlY3Rpb24oW10pO1xuICAgIF9pbyA9IEZpbGVJTygpO1xuXG4gICAgX3VwbG9hZENhbGxiYWNrID0gcGFyYW1zLnVwbG9hZENhbGxiYWNrO1xuICAgIF9jYW5jZWxDYWxsYmFjayA9IHBhcmFtcy5jYW5jZWxDYWxsYmFjaztcblxuICAgIF9jcmVhdGVWaWV3U2tlbGV0b24ocGFyYW1zKTtcbiAgICBfYmluZEV2ZW50TGlzdGVuZXJzKCk7XG5cbiAgICBfbW9kYWwgPSBNb2RhbFZpZXcoX3RoaXMuZWwsIHtcbiAgICAgIHRpdGxlOiBwYXJhbXMudGl0bGUsXG4gICAgICBidXR0b25zOiBbXG4gICAgICAgIHtcbiAgICAgICAgICB0ZXh0OiBwYXJhbXMudXBsb2FkVGV4dCxcbiAgICAgICAgICB0aXRsZTogcGFyYW1zLnVwbG9hZFRvb2x0aXAsXG4gICAgICAgICAgY2FsbGJhY2s6IF9vblVwbG9hZENsaWNrXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICB0ZXh0OiBwYXJhbXMuY2FuY2VsVGV4dCxcbiAgICAgICAgICB0aXRsZTogcGFyYW1zLmNhbmNlbFRvb2x0aXAsXG4gICAgICAgICAgY2FsbGJhY2s6IF9vbkNhbmNlbENsaWNrXG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBjbGFzc2VzOiBbJ2ZpbGUtaW5wdXQnXVxuICAgIH0pO1xuICB9O1xuXG5cbiAgX2JpbmRFdmVudExpc3RlbmVycyA9IGZ1bmN0aW9uICgpIHtcbiAgICBfZHJvcHpvbmUuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ2xlYXZlJywgX29uRHJhZ0xlYXZlKTtcbiAgICBfZHJvcHpvbmUuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ292ZXInLCBfb25EcmFnT3Zlcik7XG4gICAgX2Ryb3B6b25lLmFkZEV2ZW50TGlzdGVuZXIoJ2Ryb3AnLCBfb25Ecm9wKTtcblxuICAgIF9icm93c2VCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBfb25Ccm93c2VDbGljayk7XG4gICAgX2ZpbGVJbnB1dC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBfb25Ecm9wKTtcbiAgfTtcblxuICBfY3JlYXRlVmlld1NrZWxldG9uID0gZnVuY3Rpb24gKHBhcmFtcykge1xuICAgIHZhciBpbnRybztcblxuICAgIF90aGlzLmVsLmlubmVySFRNTCA9IFtcbiAgICAgICc8aW5wdXQgdHlwZT1cImZpbGVcIiBjbGFzcz1cImZpbGUtaW5wdXQtaW5wdXRcIiBtdWx0aXBsZS8+JyxcbiAgICAgICc8ZGl2IGNsYXNzPVwiZmlsZS1pbnB1dC1kcm9wem9uZVwiPicsXG4gICAgICAgICc8c3BhbiBjbGFzcz1cImZpbGUtaW5wdXQtZHJvcHpvbmUtdGV4dFwiPicsXG4gICAgICAgICAgcGFyYW1zLmRyb3B6b25lVGV4dCxcbiAgICAgICAgJzwvc3Bhbj4nLFxuICAgICAgICAnPGJ1dHRvbiBjbGFzcz1cImZpbGUtaW5wdXQtYnJvd3NlLWJ1dHRvblwiPicsXG4gICAgICAgICAgcGFyYW1zLmJyb3dzZVRleHQsXG4gICAgICAgICc8L2J1dHRvbj4nLFxuICAgICAgJzwvZGl2PicsXG4gICAgICAnPGRpdiBjbGFzcz1cImZpbGUtaW5wdXQtbWVzc2FnZXNcIj48L2Rpdj4nLFxuICAgICAgJzx1bCBjbGFzcz1cImZpbGUtaW5wdXQtZmlsZXMgbm8tc3R5bGVcIj48L3VsPidcbiAgICBdLmpvaW4oJycpO1xuXG4gICAgaWYgKHBhcmFtcy5pbnRybykge1xuICAgICAgaWYgKHBhcmFtcy5pbnRybyBpbnN0YW5jZW9mIE5vZGUpIHtcbiAgICAgICAgaW50cm8gPSBwYXJhbXMuaW50cm87XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiBwYXJhbXMuaW50cm8gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGludHJvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGludHJvLmlubmVySFRNTCA9IHBhcmFtcy5pbnRybztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGludHJvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGludHJvLmlubmVySFRNTCA9IHBhcmFtcy5pbnRyby50ZXh0IHx8ICcnO1xuICAgICAgICBpZiAocGFyYW1zLmludHJvLmNsYXNzZXMpIHtcbiAgICAgICAgICBpbnRyby5jbGFzc05hbWUgPSBwYXJhbXMuaW50cm8uY2xhc3NlcztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpbnRyby5jbGFzc0xpc3QuYWRkKCdmaWxlLWlucHV0LWludHJvJyk7XG5cbiAgICAgIF90aGlzLmVsLmluc2VydEJlZm9yZShpbnRybywgX3RoaXMuZWwuZmlyc3RDaGlsZCk7XG4gICAgfVxuXG5cbiAgICBfZHJvcHpvbmUgPSBfdGhpcy5lbC5xdWVyeVNlbGVjdG9yKCcuZmlsZS1pbnB1dC1kcm9wem9uZScpO1xuICAgIF9icm93c2VCdXR0b24gPSBfdGhpcy5lbC5xdWVyeVNlbGVjdG9yKCcuZmlsZS1pbnB1dC1icm93c2UtYnV0dG9uJyk7XG4gICAgX2ZpbGVJbnB1dCA9IF90aGlzLmVsLnF1ZXJ5U2VsZWN0b3IoJy5maWxlLWlucHV0LWlucHV0Jyk7XG4gICAgX2ZpbGVzQ29udGFpbmVyID0gX3RoaXMuZWwucXVlcnlTZWxlY3RvcignLmZpbGUtaW5wdXQtZmlsZXMnKTtcbiAgICBfbWVzc2FnZUNvbnRhaW5lciA9IF90aGlzLmVsLnF1ZXJ5U2VsZWN0b3IoJy5maWxlLWlucHV0LW1lc3NhZ2VzJyk7XG5cbiAgICBfY29sbGVjdGlvblZpZXcgPSBDb2xsZWN0aW9uVmlldyh7XG4gICAgICBjb2xsZWN0aW9uOiBfY29sbGVjdGlvbixcbiAgICAgIGVsOiBfZmlsZXNDb250YWluZXIsXG4gICAgICBmYWN0b3J5OiBGaWxlVmlld1xuICAgIH0pO1xuICB9O1xuXG4gIF9oYW5kbGVGaWxlID0gZnVuY3Rpb24gKGZpbGUpIHtcbiAgICB0cnkge1xuICAgICAgLy8gR2V0IHRoZSBkYXRhIFVSTFxuICAgICAgX2lvLnJlYWQoe1xuICAgICAgICBmaWxlOiBmaWxlLFxuICAgICAgICBzdWNjZXNzOiBfb25SZWFkU3VjY2VzcyxcbiAgICAgICAgZXJyb3I6IF9vblJlYWRFcnJvclxuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgX3Nob3dFcnJvcihlLm1lc3NhZ2UpO1xuICAgIH1cbiAgfTtcblxuICBfb25Ccm93c2VDbGljayA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZXZ0O1xuXG4gICAgaWYgKF9maWxlSW5wdXQuY2xpY2spIHtcbiAgICAgIF9maWxlSW5wdXQuY2xpY2soKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZXZ0ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0hUTUxFdmVudHMnKTtcbiAgICAgIGV2dC5pbml0RXZlbnQoJ2NsaWNrJywgdHJ1ZSwgdHJ1ZSk7XG4gICAgICBfZmlsZUlucHV0LmRpc3BhdGNoRXZlbnQoZXZ0KTtcbiAgICB9XG4gIH07XG5cbiAgX29uQ2FuY2VsQ2xpY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgX2NhbmNlbENhbGxiYWNrKCk7XG4gICAgX3RoaXMuaGlkZSgpO1xuICB9O1xuXG4gIF9vbkRyYWdMZWF2ZSA9IGZ1bmN0aW9uIChlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIF9kcm9wem9uZS5jbGFzc0xpc3QucmVtb3ZlKCdkcmFnLW92ZXInKTtcbiAgfTtcblxuICBfb25EcmFnT3ZlciA9IGZ1bmN0aW9uIChlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGUuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSAnY29weSc7XG4gICAgX2Ryb3B6b25lLmNsYXNzTGlzdC5hZGQoJ2RyYWctb3ZlcicpO1xuICB9O1xuXG4gIF9vbkRyb3AgPSBmdW5jdGlvbiAoZSkge1xuICAgIHZhciBmaWxlcyxcbiAgICAgICAgaTtcblxuICAgIF9vbkRyYWdMZWF2ZShlKTtcblxuICAgIGZpbGVzID0gZS50YXJnZXQuZmlsZXMgfHwgZS5kYXRhVHJhbnNmZXIuZmlsZXM7XG4gICAgZm9yIChpID0gMDsgaSA8IGZpbGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBfaGFuZGxlRmlsZShmaWxlc1tpXSk7XG4gICAgfVxuXG4gICAgX2ZpbGVJbnB1dC52YWx1ZSA9ICcnO1xuICB9O1xuXG4gIF9vblJlYWRFcnJvciA9IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICB2YXIgZXJyb3I7XG5cbiAgICBlcnJvciA9IFtcbiAgICAgICdBbiBlcnJvciBvY2N1cnJlZCByZWFkaW5nICZsZHF1bzsnLCBwYXJhbXMuZmlsZS5uYW1lLCAnJnJkcXVvOy4nLFxuICAgICAgJzxici8+JyxcbiAgICAgICc8c21hbGw+JywgcGFyYW1zLmVycm9yLm1lc3NhZ2UsICc8L3NtYWxsPidcbiAgICBdLmpvaW4oJycpO1xuXG4gICAgX3Nob3dFcnJvcihlcnJvcik7XG4gIH07XG5cbiAgX29uUmVhZFN1Y2Nlc3MgPSBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgdmFyIG9sZEZpbGU7XG5cbiAgICBwYXJhbXMuaWQgPSBwYXJhbXMuZmlsZS5uYW1lO1xuXG4gICAgdHJ5IHtcbiAgICAgIG9sZEZpbGUgPSBfY29sbGVjdGlvbi5nZXQocGFyYW1zLmlkKTtcblxuICAgICAgaWYgKG9sZEZpbGUpIHtcbiAgICAgICAgb2xkRmlsZS5zZXQocGFyYW1zKTtcbiAgICAgICAgX3Nob3dFcnJvcihcbiAgICAgICAgICAnQSBmaWxlIG5hbWUgJmxkcXVvOycgKyBwYXJhbXMuZmlsZS5uYW1lICsgJyZyZHF1bzsgd2FzIGFscmVhZHkgJyArXG4gICAgICAgICAgJ3NlbGVjdGVkLiBUaGF0IGZpbGUgaGFzIGJlZW4gcmVwbGFjZWQgYnkgdGhpcyBmaWxlLiBUbyBsb2FkIGJvdGggJyArXG4gICAgICAgICAgJ2ZpbGVzLCBwbGVhc2UgcmVuYW1lIG9uZSBvZiB0aGUgZmlsZXMuJywgJ2luZm8nXG4gICAgICAgICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBfY29sbGVjdGlvbi5hZGQoTW9kZWwocGFyYW1zKSk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgX3Nob3dFcnJvcihlLm1lc3NhZ2UpO1xuICAgIH1cbiAgfTtcblxuICBfb25VcGxvYWRDbGljayA9IGZ1bmN0aW9uICgpIHtcbiAgICBfdXBsb2FkQ2FsbGJhY2soX2NvbGxlY3Rpb24uZGF0YSgpLnNsaWNlKDApKTtcbiAgICBfdGhpcy5oaWRlKCk7XG4gIH07XG5cbiAgX3Nob3dFcnJvciA9IGZ1bmN0aW9uIChlcnJvciwgdHlwZSkge1xuICAgIE1lc3NhZ2Uoe1xuICAgICAgY29udGFpbmVyOiBfbWVzc2FnZUNvbnRhaW5lcixcbiAgICAgIGNvbnRlbnQ6IGVycm9yLFxuXG4gICAgICBhdXRvY2xvc2U6IGZhbHNlLFxuICAgICAgY2xhc3NlczogW3R5cGUgfHwgJ2Vycm9yJ11cbiAgICB9KTtcbiAgfTtcblxuICBfdW5iaW5kRXZlbnRMaXN0ZW5lcnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgX2Ryb3B6b25lLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2RyYWdsZWF2ZScsIF9vbkRyYWdMZWF2ZSk7XG4gICAgX2Ryb3B6b25lLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2RyYWdvdmVyJywgX29uRHJhZ092ZXIpO1xuICAgIF9kcm9wem9uZS5yZW1vdmVFdmVudExpc3RlbmVyKCdkcm9wJywgX29uRHJvcCk7XG5cbiAgICBfYnJvd3NlQnV0dG9uLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgX29uQnJvd3NlQ2xpY2spO1xuICAgIF9maWxlSW5wdXQucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgX29uRHJvcCk7XG4gIH07XG5cblxuICBfdGhpcy5kZXN0cm95ID0gVXRpbC5jb21wb3NlKGZ1bmN0aW9uICgpIHtcbiAgICBfdW5iaW5kRXZlbnRMaXN0ZW5lcnMoKTtcblxuICAgIF9jb2xsZWN0aW9uVmlldy5kZXN0cm95KCk7XG4gICAgX2NvbGxlY3Rpb24uZGVzdHJveSgpO1xuICAgIF9pby5kZXN0cm95KCk7XG4gICAgX21vZGFsLmRlc3Ryb3koKTtcblxuICAgIF9icm93c2VCdXR0b24gPSBudWxsO1xuICAgIF9jYW5jZWxDYWxsYmFjayA9IG51bGw7XG4gICAgX2NvbGxlY3Rpb24gPSBudWxsO1xuICAgIF9jb2xsZWN0aW9uVmlldyA9IG51bGw7XG4gICAgX2Ryb3B6b25lID0gbnVsbDtcbiAgICBfZmlsZUlucHV0ID0gbnVsbDtcbiAgICBfZmlsZXNDb250YWluZXIgPSBudWxsO1xuICAgIF9pbyA9IG51bGw7XG4gICAgX21lc3NhZ2VDb250YWluZXIgPSBudWxsO1xuICAgIF9tb2RhbCA9IG51bGw7XG4gICAgX3VwbG9hZENhbGxiYWNrID0gbnVsbDtcblxuICAgIF9iaW5kRXZlbnRMaXN0ZW5lcnMgPSBudWxsO1xuICAgIF9jcmVhdGVWaWV3U2tlbGV0b24gPSBudWxsO1xuICAgIF9oYW5kbGVGaWxlID0gbnVsbDtcbiAgICBfb25Ccm93c2VDbGljayA9IG51bGw7XG4gICAgX29uQ2FuY2VsQ2xpY2sgPSBudWxsO1xuICAgIF9vbkRyYWdMZWF2ZSA9IG51bGw7XG4gICAgX29uRHJhZ092ZXIgPSBudWxsO1xuICAgIF9vbkRyb3AgPSBudWxsO1xuICAgIF9vblJlYWRFcnJvciA9IG51bGw7XG4gICAgX29uUmVhZFN1Y2Nlc3MgPSBudWxsO1xuICAgIF9vblVwbG9hZENsaWNrID0gbnVsbDtcbiAgICBfc2hvd0Vycm9yID0gbnVsbDtcbiAgICBfdW5iaW5kRXZlbnRMaXN0ZW5lcnMgPSBudWxsO1xuXG4gICAgX2luaXRpYWxpemUgPSBudWxsO1xuICAgIF90aGlzID0gbnVsbDtcbiAgfSwgX3RoaXMuZGVzdHJveSk7XG5cbiAgX3RoaXMuaGlkZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBfbW9kYWwuaGlkZSgpO1xuICB9O1xuXG4gIF90aGlzLnNob3cgPSBmdW5jdGlvbiAoY2xlYW4pIHtcbiAgICBpZiAoY2xlYW4pIHtcbiAgICAgIF9jb2xsZWN0aW9uLnJlc2V0KFtdKTtcbiAgICAgIF9tZXNzYWdlQ29udGFpbmVyLmlubmVySFRNTCA9ICcnO1xuICAgIH1cblxuICAgIF9tb2RhbC5zaG93KCk7XG4gIH07XG5cblxuICAvLyBBbHdheXMgY2FsbCB0aGUgY29uc3RydWN0b3JcbiAgX2luaXRpYWxpemUocGFyYW1zKTtcbiAgcGFyYW1zID0gbnVsbDtcbiAgcmV0dXJuIF90aGlzO1xufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IEZpbGVJbnB1dFZpZXc7XG4iLCIndXNlIHN0cmljdCc7XG4vKipcbiAqIEdlbmVyaWMgY2xhc3MgZm9yIG1vZGFsIGRpYWxvZyB2aWV3cy4gTW9kYWwgZGlhbG9ncyBwcmVzZW50IGEgYmxvY2tpbmdcbiAqIGludGVyZmFjZSB0byB0aGUgdXNlciBhbmQgcmVxdWlyZSB1c2VyLWludGVyYWN0aW9uIGluIG9yZGVyIHRvIGJlIGNsb3NlZFxuICogKGkuZS4gY2xpY2tpbmcgYSBidXR0b24gZXRjLi4uKS5cbiAqXG4gKiBJdCBpcyBpbXBvcnRhbnQgdG8gbm90ZSB0aGF0IHdoaWxlIHRoZSBpbnRlcmZhY2UgYXBwZWFycyBibG9ja2VkIHdoaWxlIGFcbiAqIG1vZGFsIGRpYWxvZyBpcyBvcGVuLCBKYXZhc2NyaXB0IGNvbnRpbnVlcyB0byBleGVjdXRlIGluIHRoZSBiYWNrZ3JvdW5kLlxuICpcbiAqIE9ubHkgb25lIG1vZGFsIGRpYWxvZyBjYW4gYmUgdmlzaWJsZSBhdCBhbnkgZ2l2ZW4gdGltZS5cbiAqXG4gKiBJZiBhIHNlY29uZCBtb2RhbCBkaWFsb2cgaXMgb3BlbmVkIHdoaWxlIHRoZSBmaXJzdCBtb2RhbCBkaWFsb2cgaXMgc3RpbGxcbiAqIHZpc2libGUsIHRoZSBmaXJzdCBtb2RhbCBkaWFsb2cgaXMgaGlkZGVuIGFuZCB0aGUgc2Vjb25kIGlzIHNob3duLiBVcG9uXG4gKiBjbG9zaW5nIHRoZSBzZWNvbmQgbW9kYWwgZGlhbG9nLCB0aGUgZmlyc3QgbW9kYWwgZGlhbG9nIGlzIHJlLXNob3duICh1bmxlc3NcbiAqIHRoZSBcImNsZWFyXCIgbWV0aG9kIGlzIHBhc3NlZCB0byB0aGUgaGlkZSBtZXRob2QpLiBUaGlzIHByb2Nlc3MgY29udGludWVzIGluIGFcbiAqIGxhc3QtaW4sIGZpcnN0LW91dCAoc3RhY2spIG9yZGVyaW5nIHVudGlsIGFsbCBtb2RhbCBkaWFsb2dzIGFyZSBjbG9zZWQuXG4gKlxuICovXG5cbnZhciBVdGlsID0gcmVxdWlyZSgnLi4vdXRpbC9VdGlsJyksXG4gICAgVmlldyA9IHJlcXVpcmUoJy4vVmlldycpO1xuXG5cbnZhciBfX0lOSVRJQUxJWkVEX18gPSBmYWxzZSxcbiAgICBfRElBTE9HX1NUQUNLID0gbnVsbCxcbiAgICBfRk9DVVNfU1RBQ0sgPSBudWxsLFxuICAgIF9NQVNLID0gbnVsbCxcbiAgICBfREVGQVVMVFMgPSB7XG4gICAgICBjbG9zYWJsZTogdHJ1ZSwgLy8gU2hvdWxkIG1vZGFsIGJveCBpbmNsdWRlIGxpdHRsZSBcIlgnIGluIGNvcm5lclxuICAgICAgZGVzdHJveU9uSGlkZTogZmFsc2UsXG4gICAgICB0aXRsZTogZG9jdW1lbnQudGl0bGUgKyAnIFNheXMuLi4nXG4gICAgfTtcblxudmFyIF9zdGF0aWNfaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgLy8gQ3JlYXRlIHRoZSBkaWFsb2cgc3RhY2tcbiAgX0RJQUxPR19TVEFDSyA9IFtdO1xuXG4gIC8vIENyZWF0ZSB0aGUgZm9jdXMgc3RhY2tcbiAgX0ZPQ1VTX1NUQUNLID0gW107XG5cbiAgLy8gQ3JlYXRlIHRoZSBtb2RhbCBtYXNrXG4gIF9NQVNLID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIF9NQVNLLmNsYXNzTGlzdC5hZGQoJ21vZGFsJyk7XG5cbiAgX19JTklUSUFMSVpFRF9fID0gdHJ1ZTtcbn07XG5cbi8vIE5vdGU6IFwidGhpc1wiIGlzIGEgcmVmZXJlbmNlIHRvIHRoZSBidXR0b20gRE9NIGVsZW1lbnQgYW5kIGhhcyBhbGwgdGhlXG4vLyAgICAgICBwcm9wZXIgYXR0cmlidXRlcyBzZXQgb24gaXQgc3VjaCB0aGF0IHRoZSBpbXBsZW1lbnRhdGlvbiBiZWxvdyBpc1xuLy8gICAgICAgY29ycmVjdC4gSXQgZG9lcyAqbm90KiBuZWVkIHRvIHVzZSBfdGhpcyAoYWxzbyBpdCdzIGEgc3RhdGljIG1ldGhvZCkuXG52YXIgX2J1dHRvbkNhbGxiYWNrID0gZnVuY3Rpb24gKGV2dCkge1xuICBpZiAodGhpcy5pbmZvICYmIHRoaXMuaW5mby5jYWxsYmFjayAmJlxuICAgICAgdHlwZW9mIHRoaXMuaW5mby5jYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHRoaXMuaW5mby5jYWxsYmFjayhldnQsIHRoaXMubW9kYWx8fHt9KTtcbiAgfVxufTtcblxuLyoqXG4gKiBQdWxscyB0aGUgbmV4dCBlbGVtZW50IG9mZiB0aGUgZm9jdXMgc3RhY2sgYW5kIGF0dGVtcHRzIHRvIHNldCB0aGVcbiAqIGZvY3VzIHRvIGl0LlxuICpcbiAqL1xudmFyIF9mb2N1c05leHQgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBub2RlO1xuXG4gIG5vZGUgPSBfRk9DVVNfU1RBQ0sucG9wKCk7XG5cbiAgaWYgKG5vZGUgJiYgbm9kZSBpbnN0YW5jZW9mIE5vZGUgJiYgbm9kZS5mb2N1cykge1xuICAgIG5vZGUuZm9jdXMoKTtcbiAgfVxufTtcblxudmFyIE1vZGFsVmlldyA9IGZ1bmN0aW9uIChtZXNzYWdlLCBwYXJhbXMpIHtcbiAgdmFyIF90aGlzLFxuICAgICAgX2luaXRpYWxpemUsXG5cbiAgICAgIF9idXR0b25zLFxuICAgICAgX2NsYXNzZXMsXG4gICAgICBfY2xvc2FibGUsXG4gICAgICBfY2xvc2VCdXR0b24sXG4gICAgICBfY29udGVudCxcbiAgICAgIF9kZXN0cm95T25IaWRlLFxuICAgICAgX2Zvb3RlcixcbiAgICAgIF9tZXNzYWdlLFxuICAgICAgX3RpdGxlLFxuICAgICAgX3RpdGxlRWwsXG5cbiAgICAgIF9jcmVhdGVCdXR0b24sXG4gICAgICBfY3JlYXRlVmlld1NrZWxldG9uLFxuICAgICAgX29uS2V5RG93bixcbiAgICAgIF9vbk1vZGFsQ2xpY2s7XG5cblxuICBwYXJhbXMgPSBVdGlsLmV4dGVuZCh7fSwgX0RFRkFVTFRTLCBwYXJhbXMpO1xuICBfdGhpcyA9IFZpZXcocGFyYW1zKTtcblxuICBfaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uICgpIHtcblxuICAgIF9idXR0b25zID0gcGFyYW1zLmJ1dHRvbnM7XG4gICAgX2NsYXNzZXMgPSBwYXJhbXMuY2xhc3NlcztcbiAgICBfY2xvc2FibGUgPSBwYXJhbXMuY2xvc2FibGU7XG4gICAgX2Rlc3Ryb3lPbkhpZGUgPSBwYXJhbXMuZGVzdHJveU9uSGlkZTtcbiAgICBfbWVzc2FnZSA9IG1lc3NhZ2U7XG4gICAgX3RpdGxlID0gcGFyYW1zLnRpdGxlO1xuXG4gICAgX3RoaXMuZWwubW9kYWwgPSBfdGhpcztcblxuICAgIF9jcmVhdGVWaWV3U2tlbGV0b24oKTtcbiAgICBfdGhpcy5yZW5kZXIoKTtcblxuICAgIGlmICghX19JTklUSUFMSVpFRF9fKSB7XG4gICAgICBfc3RhdGljX2luaXRpYWxpemUoKTtcbiAgICB9XG5cbiAgICBwYXJhbXMgPSBudWxsO1xuICB9O1xuXG5cbiAgX2NyZWF0ZUJ1dHRvbiA9IGZ1bmN0aW9uIChpbmZvKSB7XG4gICAgdmFyIGksXG4gICAgICAgIGxlbixcbiAgICAgICAgYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyksXG4gICAgICAgIGJ1dHRvbkluZm87XG5cbiAgICBidXR0b25JbmZvID0gVXRpbC5leHRlbmQoe30sIHtcbiAgICAgIGNsYXNzZXM6IFtdLFxuICAgICAgdGV4dDogJ0NsaWNrIE1lJyxcbiAgICAgIHRpdGxlOiAnJyxcbiAgICAgIGNhbGxiYWNrOiBmdW5jdGlvbiAoKSB7fVxuICAgIH0sIGluZm8pO1xuXG4gICAgZm9yIChpID0gMCwgbGVuID0gYnV0dG9uSW5mby5jbGFzc2VzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBidXR0b24uY2xhc3NMaXN0LmFkZChidXR0b25JbmZvLmNsYXNzZXNbaV0pO1xuICAgIH1cblxuICAgIGJ1dHRvbi5pbm5lckhUTUwgPSBidXR0b25JbmZvLnRleHQ7XG5cbiAgICBpZiAoYnV0dG9uSW5mby50aXRsZSAhPT0gJycpIHtcbiAgICAgIGJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ3RpdGxlJywgYnV0dG9uSW5mby50aXRsZSk7XG4gICAgfVxuXG4gICAgYnV0dG9uLm1vZGFsID0gX3RoaXM7XG4gICAgYnV0dG9uLmluZm8gPSBidXR0b25JbmZvO1xuXG4gICAgaWYgKGJ1dHRvbkluZm8uY2FsbGJhY2spIHtcbiAgICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIF9idXR0b25DYWxsYmFjayk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGJ1dHRvbjtcbiAgfTtcblxuICBfY3JlYXRlVmlld1NrZWxldG9uID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBoZWFkZXIsIGksIGxlbjtcblxuICAgIFV0aWwuZW1wdHkoX3RoaXMuZWwpO1xuICAgIF90aGlzLmVsLmNsYXNzTGlzdC5hZGQoJ21vZGFsLWRpYWxvZycpO1xuXG4gICAgLy8gQWRkIGN1c3RvbSBjbGFzc2VzIHRvIHRoZSB2aWV3XG4gICAgaWYgKF9jbGFzc2VzICYmIF9jbGFzc2VzLmxlbmd0aCA+IDApIHtcbiAgICAgIGZvciAoaSA9IDAsIGxlbiA9IF9jbGFzc2VzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIF90aGlzLmVsLmNsYXNzTGlzdC5hZGQoX2NsYXNzZXNbaV0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChfdGl0bGUpIHtcbiAgICAgIGhlYWRlciA9IF90aGlzLmVsLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2hlYWRlcicpKTtcbiAgICAgIGhlYWRlci5jbGFzc0xpc3QuYWRkKCdtb2RhbC1oZWFkZXInKTtcblxuICAgICAgX3RpdGxlRWwgPSBoZWFkZXIuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaDMnKSk7XG4gICAgICBfdGl0bGVFbC5zZXRBdHRyaWJ1dGUoJ3RhYkluZGV4JywgJy0xJyk7XG4gICAgICBfdGl0bGVFbC5jbGFzc0xpc3QuYWRkKCdtb2RhbC10aXRsZScpO1xuXG5cbiAgICAgIGlmIChfY2xvc2FibGUpIHtcbiAgICAgICAgX2Nsb3NlQnV0dG9uID0gaGVhZGVyLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKSk7XG4gICAgICAgIF9jbG9zZUJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdtb2RhbC1jbG9zZS1saW5rJyk7XG4gICAgICAgIF9jbG9zZUJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdtYXRlcmlhbC1pY29ucycpO1xuICAgICAgICBfY2xvc2VCdXR0b24uc2V0QXR0cmlidXRlKCd0aXRsZScsICdDbG9zZScpO1xuICAgICAgICBfY2xvc2VCdXR0b24uaW5uZXJIVE1MID0gJ2Nsb3NlJztcbiAgICAgICAgX2Nsb3NlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgX3RoaXMuaGlkZSk7XG4gICAgICB9XG4gICAgfSAgZWxzZSB7XG4gICAgICBfdGhpcy5lbC5jbGFzc0xpc3QuYWRkKCduby1oZWFkZXInKTtcbiAgICB9XG5cbiAgICBfY29udGVudCA9IF90aGlzLmVsLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NlY3Rpb24nKSk7XG4gICAgX2NvbnRlbnQuc2V0QXR0cmlidXRlKCd0YWJJbmRleCcsICctMScpO1xuICAgIF9jb250ZW50LmNsYXNzTGlzdC5hZGQoJ21vZGFsLWNvbnRlbnQnKTtcblxuICAgIGlmIChfYnV0dG9ucyAmJiBfYnV0dG9ucy5sZW5ndGgpIHtcbiAgICAgIF9mb290ZXIgPSBfdGhpcy5lbC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdmb290ZXInKSk7XG4gICAgICBfZm9vdGVyLmNsYXNzTGlzdC5hZGQoJ21vZGFsLWZvb3RlcicpO1xuICAgIH0gZWxzZSB7XG4gICAgICBfdGhpcy5lbC5jbGFzc0xpc3QuYWRkKCduby1mb290ZXInKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIFRoaXMgbWV0aG9kIGlzIGJvdW5kIHRvIHRoZSBNb2RhbFZpZXcgaW5zdGFuY2UgdXNpbmcgdGhlXG4gICAqIEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kIG1ldGhvZCwgdGh1cyB0aGUgcmVmZXJlbmNlIHRvIFwidGhpc1wiIGlzIGNvcnJlY3RcbiAgICogZXZlbiB0aG91Z2ggdGhpcyBpcyBhIGtleWRvd24gZXZlbnQgaGFuZGxlci5cbiAgICpcbiAgICogQHBhcmFtIGV2ZW50IHtLZXlFdmVudH1cbiAgICogICAgICBUaGUgZXZlbnQgdGhhdCB0cmlnZ2VyZWQgdGhpcyBjYWxsLlxuICAgKi9cbiAgX29uS2V5RG93biA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgIGlmIChldmVudC5rZXlDb2RlID09PSAyNykge1xuICAgICAgX3RoaXMuaGlkZSgpO1xuICAgIH1cbiAgfTtcblxuXG4gIF9vbk1vZGFsQ2xpY2sgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICBpZiAoZXZlbnQudGFyZ2V0LmNsYXNzTmFtZSA9PT0gJ21vZGFsJykge1xuICAgICAgX3RoaXMuaGlkZSgpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogUmVtb3ZlIGV2ZW50IGxpc3RlbmVycyBhbmQgZnJlZSByZWZlcmVuY2VzLlxuICAgKlxuICAgKiBZb3Ugc2hvdWxkIGNhbGwgaGlkZSBmaXJzdC5cbiAgICovXG4gIF90aGlzLmRlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGJ1dHRvbjtcblxuICAgIF9NQVNLLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgX3RoaXMuaGlkZSk7XG5cbiAgICBpZiAoX2J1dHRvbnMgJiYgX2J1dHRvbnMubGVuZ3RoKSB7XG4gICAgICB3aGlsZSAoX2Zvb3Rlci5jaGlsZE5vZGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgYnV0dG9uID0gX2Zvb3Rlci5maXJzdENoaWxkO1xuICAgICAgICBidXR0b24ucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBfYnV0dG9uQ2FsbGJhY2spO1xuICAgICAgICBfZm9vdGVyLnJlbW92ZUNoaWxkKGJ1dHRvbik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKF9jbG9zZUJ1dHRvbikge1xuICAgICAgX2Nsb3NlQnV0dG9uLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgX3RoaXMuaGlkZSk7XG4gICAgICBfY2xvc2VCdXR0b24gPSBudWxsO1xuICAgIH1cblxuICAgIGRlbGV0ZSBfdGhpcy5lbC5tb2RhbDtcblxuICAgIF9mb290ZXIgPSBudWxsO1xuICAgIF90aXRsZUVsID0gbnVsbDtcbiAgICBfY29udGVudCA9IG51bGw7XG4gICAgX2Rlc3Ryb3lPbkhpZGUgPSBudWxsO1xuICAgIF90aGlzLmVsID0gbnVsbDtcbiAgICBfb25Nb2RhbENsaWNrID0gbnVsbDtcbiAgfTtcblxuICBfdGhpcy5oaWRlID0gZnVuY3Rpb24gKGNsZWFyQWxsKSB7XG4gICAgdmFyIGlzVmlzaWJsZTtcblxuICAgIGlzVmlzaWJsZSA9IChfdGhpcy5lbC5wYXJlbnROb2RlID09PSBfTUFTSyk7XG5cbiAgICBpZiAoY2xlYXJBbGwgPT09IHRydWUpIHtcbiAgICAgIC8vIFJlbW92ZSBhbnkvYWxsIGRpYWxvZ3MgYXR0YWNoZWQgdG8gX01BU0tcbiAgICAgIFV0aWwuZW1wdHkoX01BU0spO1xuXG4gICAgICAvLyBDbGVhciBzdGFjayBvZiBwcmV2aW91cyBkaWFsb2dzIHRvIHJldHVybiB1c2VyIHRvIG5vcm1hbCBhcHBsaWNhdGlvbi5cbiAgICAgIF9ESUFMT0dfU1RBQ0suc3BsaWNlKDAsIF9ESUFMT0dfU1RBQ0subGVuZ3RoKTtcblxuICAgICAgLy8gQ2xlYXIgYWxsIGJ1dCBsYXN0IGZvY3VzIGVsZW1lbnRcbiAgICAgIF9GT0NVU19TVEFDSy5zcGxpY2UoMSwgX0ZPQ1VTX1NUQUNLLmxlbmd0aCk7XG5cbiAgICAgIF9mb2N1c05leHQoKTtcblxuICAgICAgaWYgKGlzVmlzaWJsZSkgeyAvLyBPciByYXRoZXIsIHdhcyB2aXNpYmxlXG4gICAgICAgIF90aGlzLnRyaWdnZXIoJ2hpZGUnLCBfdGhpcyk7XG5cbiAgICAgICAgaWYgKF9kZXN0cm95T25IaWRlKSB7XG4gICAgICAgICAgX3RoaXMuZGVzdHJveSgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChpc1Zpc2libGUpIHtcbiAgICAgIC8vIFRoaXMgbW9kYWwgaXMgY3VycmVudGx5IHZpc2libGVcbiAgICAgIF90aGlzLmVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoX3RoaXMuZWwpO1xuXG4gICAgICAvLyBDaGVjayBpZiBhbnkgb3RoZXIgZGlhbG9ncyBleGlzdCBpbiBzdGFjaywgaWYgc28sIHNob3cgaXRcbiAgICAgIGlmIChfRElBTE9HX1NUQUNLLmxlbmd0aCA+IDApIHtcbiAgICAgICAgX0RJQUxPR19TVEFDSy5wb3AoKS5zaG93KCk7XG4gICAgICB9XG5cbiAgICAgIF9mb2N1c05leHQoKTtcbiAgICAgIF90aGlzLnRyaWdnZXIoJ2hpZGUnLCBfdGhpcyk7XG5cbiAgICAgIGlmIChfZGVzdHJveU9uSGlkZSkge1xuICAgICAgICBfdGhpcy5kZXN0cm95KCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCFfTUFTSy5maXJzdENoaWxkICYmIF9NQVNLLnBhcmVudE5vZGUpIHtcbiAgICAgIC8vIE5vIG1vcmUgZGlhbG9ncywgcmVtb3ZlIHRoZSBfTUFTS1xuICAgICAgX01BU0sucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChfTUFTSyk7XG4gICAgICBfTUFTSy5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIF9vbk1vZGFsQ2xpY2spO1xuXG4gICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ2JhY2tncm91bmRTY3JvbGxEaXNhYmxlJyk7XG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIF9vbktleURvd24pO1xuICAgIH1cblxuICAgIHJldHVybiBfdGhpcztcbiAgfTtcblxuICBfdGhpcy5yZW5kZXIgPSBmdW5jdGlvbiAobWVzc2FnZSkge1xuICAgIHZhciBtID0gbWVzc2FnZSB8fCBfbWVzc2FnZSxcbiAgICAgICAgYnV0dG9uID0gbnVsbCxcbiAgICAgICAgYnV0dG9ucyA9IF9idXR0b25zIHx8IFtdLFxuICAgICAgICBpLCBsZW4gPSBidXR0b25zLmxlbmd0aDtcblxuICAgIC8vIFNldCB0aGUgbW9kYWwgZGlhbG9nIGNvbnRlbnRcbiAgICBVdGlsLmVtcHR5KF9jb250ZW50KTtcblxuICAgIGlmICh0eXBlb2YgbSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIF9jb250ZW50LmlubmVySFRNTCA9IG07XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgbSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIF90aGlzLnJlbmRlcihtKF90aGlzKSk7XG4gICAgfSBlbHNlIGlmIChtIGluc3RhbmNlb2YgTm9kZSkge1xuICAgICAgX2NvbnRlbnQuYXBwZW5kQ2hpbGQobSk7XG4gICAgfVxuXG4gICAgLy8gU2V0IHRoZSBtb2RhbCBkaWFsb2cgdGl0bGVcbiAgICBpZiAoX3RpdGxlKSB7XG4gICAgICBfdGl0bGVFbC5pbm5lckhUTUwgPSBfdGl0bGU7XG4gICAgfVxuXG4gICAgLy8gQ2xlYXIgYW55IG9sZCBmb290ZXIgY29udGVudFxuICAgIGlmIChfYnV0dG9ucyAmJiBfYnV0dG9ucy5sZW5ndGgpIHtcbiAgICAgIHdoaWxlIChfZm9vdGVyLmNoaWxkTm9kZXMubGVuZ3RoID4gMCkge1xuICAgICAgICBidXR0b24gPSBfZm9vdGVyLmZpcnN0Q2hpbGQ7XG4gICAgICAgIFV0aWwucmVtb3ZlRXZlbnQoYnV0dG9uLCAnY2xpY2snLCBfYnV0dG9uQ2FsbGJhY2spO1xuICAgICAgICBfZm9vdGVyLnJlbW92ZUNoaWxkKGJ1dHRvbik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gU2V0IG5ldyBmb290ZXIgY29udGVudFxuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgX2Zvb3Rlci5hcHBlbmRDaGlsZChfY3JlYXRlQnV0dG9uKGJ1dHRvbnNbaV0pKTtcbiAgICB9XG5cbiAgICBfdGhpcy50cmlnZ2VyKCdyZW5kZXInLCBfdGhpcyk7XG4gICAgcmV0dXJuIF90aGlzO1xuICB9O1xuXG4gIF90aGlzLnNldE1lc3NhZ2UgPSBmdW5jdGlvbiAobWVzc2FnZSkge1xuICAgIF9tZXNzYWdlID0gbWVzc2FnZTtcblxuICAgIF90aGlzLnRyaWdnZXIoJ21lc3NhZ2UnLCBfdGhpcyk7XG4gICAgcmV0dXJuIF90aGlzO1xuICB9O1xuXG4gIF90aGlzLnNldE9wdGlvbnMgPSBmdW5jdGlvbiAocGFyYW1zLCBleHRlbmQpIHtcbiAgICBpZiAoZXh0ZW5kKSB7XG4gICAgICBwYXJhbXMgPSBVdGlsLmV4dGVuZCh7fSwge1xuICAgICAgICBidXR0b25zOiBfYnV0dG9ucyxcbiAgICAgICAgY2xhc3NlczogX2NsYXNzZXMsXG4gICAgICAgIGNsb3NhYmxlOiBfY2xvc2FibGUsXG4gICAgICAgIG1lc3NhZ2U6IF9tZXNzYWdlLFxuICAgICAgICB0aXRsZTogX3RpdGxlXG4gICAgICB9LCBwYXJhbXMpO1xuICAgIH1cblxuICAgIF9idXR0b25zID0gcGFyYW1zLmJ1dHRvbnM7XG4gICAgX2NsYXNzZXMgPSBwYXJhbXMuY2xhc3NlcztcbiAgICBfY2xvc2FibGUgPSBwYXJhbXMuY2xvc2FibGU7XG4gICAgX21lc3NhZ2UgPSBtZXNzYWdlO1xuICAgIF90aXRsZSA9IHBhcmFtcy50aXRsZTtcblxuICAgIF90aGlzLnRyaWdnZXIoJ29wdGlvbnMnLCBfdGhpcyk7XG4gICAgcmV0dXJuIF90aGlzO1xuICB9O1xuXG4gIF90aGlzLnNob3cgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG9sZENoaWxkID0gbnVsbDtcblxuICAgIC8vIEZvciBhY2Nlc3NpYmlsaXR5LCBmb2N1cyB0aGUgdG9wIG9mIHRoaXMgbmV3IGRpYWxvZ1xuICAgIF9GT0NVU19TVEFDSy5wdXNoKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgfHwgZmFsc2UpO1xuXG4gICAgLy8gTWFzayBhbHJlYWR5IGhhcyBhIGRpYWxvZyBpbiBpdCwgYWRkIHRvIGRpYWxvZyBzdGFjayBhbmQgY29udGludWVcbiAgICB3aGlsZSAoX01BU0suZmlyc3RDaGlsZCkge1xuICAgICAgb2xkQ2hpbGQgPSBfTUFTSy5maXJzdENoaWxkO1xuICAgICAgaWYgKG9sZENoaWxkLm1vZGFsKSB7XG4gICAgICAgIF9ESUFMT0dfU1RBQ0sucHVzaChvbGRDaGlsZC5tb2RhbCk7XG4gICAgICB9XG4gICAgICBfTUFTSy5yZW1vdmVDaGlsZChvbGRDaGlsZCk7XG4gICAgfVxuXG4gICAgLy8gQWRkIHRoaXMgZGlhbG9nIHRvIHRoZSBtYXNrXG4gICAgX01BU0suYXBwZW5kQ2hpbGQoX3RoaXMuZWwpO1xuICAgIF9NQVNLLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgX29uTW9kYWxDbGljayk7XG5cbiAgICAvLyBTaG93IHRoZSBtYXNrIGlmIG5vdCB5ZXQgdmlzaWJsZVxuICAgIGlmICghX01BU0sucGFyZW50Tm9kZSkge1xuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChfTUFTSyk7XG4gICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoJ2JhY2tncm91bmRTY3JvbGxEaXNhYmxlJyk7XG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIF9vbktleURvd24pO1xuICAgIH1cblxuXG4gICAgaWYgKF90aXRsZSkge1xuICAgICAgX3RpdGxlRWwuZm9jdXMoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgX2NvbnRlbnQuZm9jdXMoKTtcbiAgICB9XG5cbiAgICBfdGhpcy50cmlnZ2VyKCdzaG93JywgX3RoaXMpO1xuICAgIHJldHVybiBfdGhpcztcbiAgfTtcblxuICBfaW5pdGlhbGl6ZSgpO1xuICByZXR1cm4gX3RoaXM7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1vZGFsVmlldztcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIEV2ZW50cyA9IHJlcXVpcmUoJy4uL3V0aWwvRXZlbnRzJyksXG4gICAgVXRpbCA9IHJlcXVpcmUoJy4uL3V0aWwvVXRpbCcpO1xuXG4vKipcbiAqIENvbnN0cnVjdG9yXG4gKlxuICogQHBhcmFtIGRhdGEge09iamVjdH1cbiAqICAgICAga2V5L3ZhbHVlIGF0dHJpYnV0ZXMgb2YgdGhpcyBtb2RlbC5cbiAqL1xudmFyIE1vZGVsID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgdmFyIF90aGlzLFxuICAgICAgX2luaXRpYWxpemUsXG5cbiAgICAgIF9tb2RlbDtcblxuXG4gIF90aGlzID0gRXZlbnRzKCk7XG5cbiAgX2luaXRpYWxpemUgPSBmdW5jdGlvbiAoKSB7XG4gICAgX21vZGVsID0gVXRpbC5leHRlbmQoe30sIGRhdGEpO1xuXG4gICAgLy8gdHJhY2sgaWQgYXQgdG9wIGxldmVsXG4gICAgaWYgKGRhdGEgJiYgZGF0YS5oYXNPd25Qcm9wZXJ0eSgnaWQnKSkge1xuICAgICAgX3RoaXMuaWQgPSBkYXRhLmlkO1xuICAgIH1cblxuICAgIGRhdGEgPSBudWxsO1xuICB9O1xuXG4gIC8qKlxuICAgKiBHZXQgb25lIG9yIG1vcmUgdmFsdWVzLlxuICAgKlxuICAgKiBAcGFyYW0ga2V5IHtTdHJpbmd9XG4gICAqICAgICAgdGhlIHZhbHVlIHRvIGdldDsgd2hlbiBrZXkgaXMgdW5kZWZpbmVkLCByZXR1cm5zIHRoZSBvYmplY3Qgd2l0aCBhbGxcbiAgICogICAgICB2YWx1ZXMuXG4gICAqIEByZXR1cm5cbiAgICogICAgICAtIGlmIGtleSBpcyBzcGVjaWZpZWQsIHRoZSB2YWx1ZSBvciBudWxsIGlmIG5vIHZhbHVlIGV4aXN0cy5cbiAgICogICAgICAtIHdoZW4ga2V5IGlzIG5vdCBzcGVjaWZpZWQsIHRoZSB1bmRlcmx5aW5nIG9iamVjdCBpcyByZXR1cm5lZC5cbiAgICogICAgICAgIChBbnkgY2hhbmdlcyB0byB0aGlzIHVuZGVybHlpbmcgb2JqZWN0IHdpbGwgbm90IHRyaWdnZXIgZXZlbnRzISEhKVxuICAgKi9cbiAgX3RoaXMuZ2V0ID0gZnVuY3Rpb24gKGtleSkge1xuICAgIGlmICh0eXBlb2Yoa2V5KSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHJldHVybiBfbW9kZWw7XG4gICAgfVxuXG4gICAgaWYgKF9tb2RlbC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICByZXR1cm4gX21vZGVsW2tleV07XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH07XG5cbiAgLyoqXG4gICAqIFVwZGF0ZSBvbmUgb3IgbW9yZSB2YWx1ZXMuXG4gICAqXG4gICAqIEBwYXJhbSBkYXRhIHtPYmplY3R9XG4gICAqICAgICAgdGhlIGtleXMgYW5kIHZhbHVlcyB0byB1cGRhdGUuXG4gICAqIEBwYXJhbSBvcHRpb25zIHtPYmplY3R9XG4gICAqICAgICAgb3B0aW9ucyBmb3IgdGhpcyBtZXRob2QuXG4gICAqIEBwYXJhbSBvcHRpb25zLnNpbGVudCB7Qm9vbGVhbn1cbiAgICogICAgICBkZWZhdWx0IGZhbHNlLiB0cnVlIHRvIHN1cHByZXNzIGFueSBldmVudHMgdGhhdCB3b3VsZCBvdGhlcndpc2UgYmVcbiAgICogICAgICB0cmlnZ2VyZWQuXG4gICAqL1xuICBfdGhpcy5zZXQgPSBmdW5jdGlvbiAoZGF0YSwgb3B0aW9ucykge1xuICAgIC8vIGRldGVjdCBjaGFuZ2VzXG4gICAgdmFyIGNoYW5nZWQgPSB7fSxcbiAgICAgIGFueUNoYW5nZWQgPSBmYWxzZSxcbiAgICAgIGM7XG5cbiAgICBmb3IgKGMgaW4gZGF0YSkge1xuICAgICAgaWYgKCFfbW9kZWwuaGFzT3duUHJvcGVydHkoYykgfHwgX21vZGVsW2NdICE9PSBkYXRhW2NdKSB7XG4gICAgICAgIGNoYW5nZWRbY10gPSBkYXRhW2NdO1xuICAgICAgICBhbnlDaGFuZ2VkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBwZXJzaXN0IGNoYW5nZXNcbiAgICBfbW9kZWwgPSBVdGlsLmV4dGVuZChfbW9kZWwsIGRhdGEpO1xuXG4gICAgLy8gaWYgaWQgaXMgY2hhbmdpbmcsIHVwZGF0ZSB0aGUgbW9kZWwgaWRcbiAgICBpZiAoZGF0YSAmJiBkYXRhLmhhc093blByb3BlcnR5KCdpZCcpKSB7XG4gICAgICBfdGhpcy5pZCA9IGRhdGEuaWQ7XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5oYXNPd25Qcm9wZXJ0eSgnc2lsZW50JykgJiYgb3B0aW9ucy5zaWxlbnQpIHtcbiAgICAgIC8vIGRvbid0IHRyaWdnZXIgYW55IGV2ZW50c1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIHRyaWdnZXIgZXZlbnRzIGJhc2VkIG9uIGNoYW5nZXNcbiAgICBpZiAoYW55Q2hhbmdlZCB8fFxuICAgICAgICAob3B0aW9ucyAmJiBvcHRpb25zLmhhc093blByb3BlcnR5KCdmb3JjZScpICYmIG9wdGlvbnMuZm9yY2UpKSB7XG4gICAgICBmb3IgKGMgaW4gY2hhbmdlZCkge1xuICAgICAgICAvLyBldmVudHMgc3BlY2lmaWMgdG8gYSBwcm9wZXJ0eVxuICAgICAgICBfdGhpcy50cmlnZ2VyKCdjaGFuZ2U6JyArIGMsIGNoYW5nZWRbY10pO1xuICAgICAgfVxuICAgICAgLy8gZ2VuZXJpYyBldmVudCBmb3IgYW55IGNoYW5nZVxuICAgICAgX3RoaXMudHJpZ2dlcignY2hhbmdlJywgY2hhbmdlZCk7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBPdmVycmlkZSB0b0pTT04gbWV0aG9kIHRvIHNlcmlhbGl6ZSBvbmx5IG1vZGVsIGRhdGEuXG4gICAqL1xuICBfdGhpcy50b0pTT04gPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGpzb24gPSBVdGlsLmV4dGVuZCh7fSwgX21vZGVsKSxcbiAgICAgICAga2V5LFxuICAgICAgICB2YWx1ZTtcblxuICAgIGZvciAoa2V5IGluIGpzb24pIHtcbiAgICAgIHZhbHVlID0ganNvbltrZXldO1xuXG4gICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJlxuICAgICAgICAgIHZhbHVlICE9PSBudWxsICYmXG4gICAgICAgICAgdHlwZW9mIHZhbHVlLnRvSlNPTiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBqc29uW2tleV0gPSB2YWx1ZS50b0pTT04oKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4ganNvbjtcbiAgfTtcblxuXG4gIF9pbml0aWFsaXplKCk7XG4gIHJldHVybiBfdGhpcztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTW9kZWw7XG4iLCIndXNlIHN0cmljdCc7XG4vKipcbiAqIFRoaXMgY2xhc3MgcHJvdmlkZXMgYSBzaW1wbGUgc2VsZWN0IGJveCB3aWRnZXQgZm9yIHNlbGVjdGluZyBhbiBpdGVtXG4gKiBvdXQgb2YgYSBjb2xsZWN0aW9uLiBCZXN0IHVzZWQgb24gc2hvcnQtaXNoIGNvbGxlY3Rpb25zLlxuICpcbiAqL1xuXG52YXIgVXRpbCA9IHJlcXVpcmUoJy4uL3V0aWwvVXRpbCcpLFxuICAgIFZpZXcgPSByZXF1aXJlKCcuL1ZpZXcnKTtcblxuXG52YXIgX1NFTEVDVF9WSUVXX0NPVU5URVIgPSAwO1xudmFyIF9ERUZBVUxUUyA9IHtcbiAgaW5jbHVkZUJsYW5rT3B0aW9uOiBmYWxzZSxcbiAgYmxhbmtPcHRpb246IHtcbiAgICB2YWx1ZTogJy0xJyxcbiAgICB0ZXh0OiAnUGxlYXNlIHNlbGVjdCZoZWxsaXA7J1xuICB9XG59O1xuXG5cbnZhciBTZWxlY3RWaWV3ID0gZnVuY3Rpb24gKHBhcmFtcykge1xuICB2YXIgX3RoaXMsXG4gICAgICBfaW5pdGlhbGl6ZSxcblxuICAgICAgX2JsYW5rT3B0aW9uLFxuICAgICAgX2NvbGxlY3Rpb24sXG4gICAgICBfaWRzdHViLFxuICAgICAgX2luY2x1ZGVCbGFua09wdGlvbixcbiAgICAgIF9zZWxlY3RCb3gsXG5cbiAgICAgIF9jcmVhdGVCbGFua09wdGlvbixcbiAgICAgIF9jcmVhdGVJdGVtTWFya3VwLFxuICAgICAgX2dldERPTUlkRm9ySXRlbSxcbiAgICAgIF9nZXRNb2RlbElkRm9yT3B0aW9uLFxuICAgICAgX29uQ29sbGVjdGlvbkFkZCxcbiAgICAgIF9vbkNvbGxlY3Rpb25EZXNlbGVjdCxcbiAgICAgIF9vbkNvbGxlY3Rpb25SZW1vdmUsXG4gICAgICBfb25Db2xsZWN0aW9uUmVzZXQsXG4gICAgICBfb25Db2xsZWN0aW9uU2VsZWN0LFxuICAgICAgX29uU2VsZWN0Qm94Q2hhbmdlO1xuXG5cbiAgcGFyYW1zID0gVXRpbC5leHRlbmQoe30sIF9ERUZBVUxUUywgcGFyYW1zKTtcbiAgX3RoaXMgPSBWaWV3KHBhcmFtcyk7XG5cblxuICBfaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uICgpIHtcblxuICAgIF9jb2xsZWN0aW9uID0gcGFyYW1zLmNvbGxlY3Rpb24gfHwgbnVsbDtcbiAgICBfYmxhbmtPcHRpb24gPSBwYXJhbXMuYmxhbmtPcHRpb247XG4gICAgX2luY2x1ZGVCbGFua09wdGlvbiA9IHBhcmFtcy5pbmNsdWRlQmxhbmtPcHRpb247XG4gICAgX3RoaXMuZWwgPSBwYXJhbXMuZWwgfHwgZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2VsZWN0Jyk7XG5cbiAgICBfaWRzdHViID0gJ3NlbGVjdHZpZXctJyArIF9TRUxFQ1RfVklFV19DT1VOVEVSICsgJy0nO1xuICAgIF9TRUxFQ1RfVklFV19DT1VOVEVSICs9IDE7XG5cblxuICAgIC8vIE1ha2UgYSBwcml2YXRlIERPTSBlbGVtZW50LiBJZiBfdGhpcy5lbCBpcyBhbHJlYWR5IGEgc2VsZWN0IERPTSBlbGVtZW50LFxuICAgIC8vIHRoZW4ganVzdCB1c2UgdGhhdCwgb3RoZXJ3aXNlLCBjcmVhdGUgYSBuZXcgZWxlbWVudCBhbmQgYXBwZW5kIGl0IHRvXG4gICAgLy8gX3RoaXMuZWxcbiAgICBpZiAoX3RoaXMuZWwubm9kZU5hbWUgPT09ICdTRUxFQ1QnKSB7XG4gICAgICBfc2VsZWN0Qm94ID0gX3RoaXMuZWw7XG4gICAgfSBlbHNlIHtcbiAgICAgIF9zZWxlY3RCb3ggPSBfdGhpcy5lbC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzZWxlY3QnKSk7XG4gICAgfVxuICAgIF9zZWxlY3RCb3guY2xhc3NMaXN0LmFkZCgndmlldy1zZWxlY3R2aWV3Jyk7XG5cbiAgICAvLyBCaW5kIHRvIGV2ZW50cyBvbiB0aGUgY29sbGVjdGlvblxuICAgIGlmIChfY29sbGVjdGlvbikge1xuICAgICAgX2NvbGxlY3Rpb24ub24oJ2FkZCcsIF9vbkNvbGxlY3Rpb25BZGQsIF90aGlzKTtcbiAgICAgIF9jb2xsZWN0aW9uLm9uKCdyZW1vdmUnLCBfb25Db2xsZWN0aW9uUmVtb3ZlLCBfdGhpcyk7XG4gICAgICBfY29sbGVjdGlvbi5vbigncmVzZXQnLCBfb25Db2xsZWN0aW9uUmVzZXQsIF90aGlzKTtcbiAgICAgIF9jb2xsZWN0aW9uLm9uKCdzZWxlY3QnLCBfb25Db2xsZWN0aW9uU2VsZWN0LCBfdGhpcyk7XG4gICAgICBfY29sbGVjdGlvbi5vbignZGVzZWxlY3QnLCBfb25Db2xsZWN0aW9uRGVzZWxlY3QsIF90aGlzKTtcbiAgICB9XG5cbiAgICAvLyBCaW5kIHRvIGV2ZW50cyBvbiBfc2VsZWN0Qm94XG4gICAgX3NlbGVjdEJveC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBfb25TZWxlY3RCb3hDaGFuZ2UpO1xuXG4gICAgX3RoaXMucmVuZGVyKCk7XG4gICAgcGFyYW1zID0gbnVsbDtcbiAgfTtcblxuXG4gIF9jcmVhdGVJdGVtTWFya3VwID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICByZXR1cm4gW1xuICAgICc8b3B0aW9uICcsXG4gICAgICAgICdpZD1cIicsIF9nZXRET01JZEZvckl0ZW0oaXRlbSksICdcIiAnLFxuICAgICAgICAndmFsdWU9XCInLCBpdGVtLmdldCgndmFsdWUnKSwgJ1wiPicsXG4gICAgICBpdGVtLmdldCgnZGlzcGxheScpLFxuICAgICc8L29wdGlvbj4nXG4gICAgXS5qb2luKCcnKTtcbiAgfTtcblxuICBfY3JlYXRlQmxhbmtPcHRpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIFtcbiAgICAnPG9wdGlvbiAnLFxuICAgICAgICAndmFsdWU9XCInLCBfYmxhbmtPcHRpb24udmFsdWUsICdcIj4nLFxuICAgICAgX2JsYW5rT3B0aW9uLnRleHQsXG4gICAgJzwvb3B0aW9uPidcbiAgICBdLmpvaW4oJycpO1xuICB9O1xuXG4gIF9nZXRET01JZEZvckl0ZW0gPSBmdW5jdGlvbiAoaXRlbSkge1xuICAgIHJldHVybiBfaWRzdHViICsgaXRlbS5nZXQoJ2lkJyk7XG4gIH07XG5cbiAgX2dldE1vZGVsSWRGb3JPcHRpb24gPSBmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgIHJldHVybiBlbGVtZW50LmlkLnJlcGxhY2UoX2lkc3R1YiwgJycpO1xuICB9O1xuXG4gIF9vbkNvbGxlY3Rpb25BZGQgPSBmdW5jdGlvbiAoKSB7XG4gICAgX3RoaXMucmVuZGVyKCk7XG4gIH07XG5cbiAgX29uQ29sbGVjdGlvbkRlc2VsZWN0ID0gZnVuY3Rpb24gKG9sZFNlbGVjdGVkKSB7XG4gICAgdmFyIHNlbGVjdGVkRE9NID0gX3NlbGVjdEJveC5xdWVyeVNlbGVjdG9yKFxuICAgICAgICAnIycgKyBfZ2V0RE9NSWRGb3JJdGVtKG9sZFNlbGVjdGVkKSk7XG5cbiAgICBpZiAoc2VsZWN0ZWRET00pIHtcbiAgICAgIHNlbGVjdGVkRE9NLnJlbW92ZUF0dHJpYnV0ZSgnc2VsZWN0ZWQnKTtcbiAgICB9XG5cbiAgICBpZiAoX2luY2x1ZGVCbGFua09wdGlvbikge1xuICAgICAgc2VsZWN0ZWRET00gPSBfc2VsZWN0Qm94LnF1ZXJ5U2VsZWN0b3IoJ1t2YWx1ZT1cIicgKyBfYmxhbmtPcHRpb24udmFsdWUgKyAnXCJdJyk7XG4gICAgICBpZiAoc2VsZWN0ZWRET00pIHtcbiAgICAgICAgc2VsZWN0ZWRET00uc2V0QXR0cmlidXRlKCdzZWxlY3RlZCcsICdzZWxlY3RlZCcpO1xuICAgICAgfVxuICAgIH1cblxuICB9O1xuXG4gIF9vbkNvbGxlY3Rpb25SZW1vdmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgX3RoaXMucmVuZGVyKCk7XG4gIH07XG5cbiAgX29uQ29sbGVjdGlvblJlc2V0ID0gZnVuY3Rpb24gKCkge1xuICAgIF90aGlzLnJlbmRlcigpO1xuICB9O1xuXG4gIF9vbkNvbGxlY3Rpb25TZWxlY3QgPSBmdW5jdGlvbiAoc2VsZWN0ZWRJdGVtKSB7XG4gICAgdmFyIHNlbGVjdGVkRE9NID0gX3NlbGVjdEJveC5xdWVyeVNlbGVjdG9yKFxuICAgICAgICAnIycgKyBfZ2V0RE9NSWRGb3JJdGVtKHNlbGVjdGVkSXRlbSkpO1xuXG4gICAgaWYgKHNlbGVjdGVkRE9NKSB7XG4gICAgICBzZWxlY3RlZERPTS5zZXRBdHRyaWJ1dGUoJ3NlbGVjdGVkJywgJ3NlbGVjdGVkJyk7XG4gICAgfVxuICB9O1xuXG4gIF9vblNlbGVjdEJveENoYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZWN0ZWRJbmRleCA9IF9zZWxlY3RCb3guc2VsZWN0ZWRJbmRleCxcbiAgICAgICAgc2VsZWN0ZWRET00gPSBfc2VsZWN0Qm94LmNoaWxkTm9kZXNbc2VsZWN0ZWRJbmRleF0sXG4gICAgICAgIHNlbGVjdGVkSWQgPSBfZ2V0TW9kZWxJZEZvck9wdGlvbihzZWxlY3RlZERPTSk7XG4gICAgaWYgKF9pbmNsdWRlQmxhbmtPcHRpb24gJiYgX3NlbGVjdEJveC52YWx1ZSA9PT0gX2JsYW5rT3B0aW9uLnZhbHVlKSB7XG4gICAgICBfY29sbGVjdGlvbi5kZXNlbGVjdCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBfY29sbGVjdGlvbi5zZWxlY3QoX2NvbGxlY3Rpb24uZ2V0KHNlbGVjdGVkSWQpKTtcbiAgICB9XG4gIH07XG5cblxuICBfdGhpcy5yZW5kZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGkgPSBudWxsLFxuICAgICAgICBpdGVtcyA9IG51bGwsXG4gICAgICAgIG51bUl0ZW1zID0gbnVsbCxcbiAgICAgICAgc2VsZWN0ZWQgPSBudWxsLFxuICAgICAgICBtYXJrdXAgPSBbXTtcblxuICAgIC8vIElmIG5vIGNvbGxlY3Rpb24gYXZhaWxhYmxlLCBqdXN0IGNsZWFyIHRoZSBvcHRpb25zIGFuZCByZXR1cm5cbiAgICBpZiAoIV9jb2xsZWN0aW9uKSB7XG4gICAgICBfc2VsZWN0Qm94LmlubmVySFRNTCA9ICcnO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFNldCB0aGUgc2VsZWN0IGJveCBvcHRpb24gaXRlbXNcbiAgICBpdGVtcyA9IF9jb2xsZWN0aW9uLmRhdGEoKTtcblxuICAgIGlmICghaXRlbXMpIHtcbiAgICAgIF9zZWxlY3RCb3guaW5uZXJIVE1MID0gJyc7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaXRlbXMgPSBpdGVtcy5zbGljZSgwKTtcbiAgICBudW1JdGVtcyA9IGl0ZW1zLmxlbmd0aDtcblxuICAgIGlmIChfaW5jbHVkZUJsYW5rT3B0aW9uID09PSB0cnVlKSB7XG4gICAgICBtYXJrdXAucHVzaChfY3JlYXRlQmxhbmtPcHRpb24oKSk7XG4gICAgfVxuXG4gICAgZm9yIChpID0gMDsgaSA8IG51bUl0ZW1zOyBpKyspIHtcbiAgICAgIG1hcmt1cC5wdXNoKF9jcmVhdGVJdGVtTWFya3VwKGl0ZW1zW2ldKSk7XG4gICAgfVxuXG4gICAgX3NlbGVjdEJveC5pbm5lckhUTUwgPSBtYXJrdXAuam9pbignJyk7XG5cbiAgICAvLyBOb3cgc2VsZWN0IHRoZSBjdXJyZW50bHkgc2VsZWN0ZWQgaXRlbSAoaWYgb25lIGlzIHNlbGVjdGVkKVxuICAgIHNlbGVjdGVkID0gX2NvbGxlY3Rpb24uZ2V0U2VsZWN0ZWQoKTtcbiAgICBpZiAoc2VsZWN0ZWQpIHtcbiAgICAgIF9vbkNvbGxlY3Rpb25TZWxlY3Qoc2VsZWN0ZWQpO1xuICAgIH1cbiAgfTtcblxuXG4gIF9pbml0aWFsaXplKCk7XG4gIHJldHVybiBfdGhpcztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gU2VsZWN0VmlldztcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIENvbGxlY3Rpb24gPSByZXF1aXJlKCcuL0NvbGxlY3Rpb24nKSxcblxuICAgIEV2ZW50cyA9IHJlcXVpcmUoJy4uL3V0aWwvRXZlbnRzJyk7XG5cblxuLyoqIGNyZWF0ZSBhIG5ldyB2aWV3IGJhc2VkIG9uIGEgY29sbGVjdGlvbiBvZiBtb2RlbHMuICovXG52YXIgU2VsZWN0ZWRDb2xsZWN0aW9uVmlldyA9IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgdmFyIF90aGlzLFxuICAgICAgX2luaXRpYWxpemUsXG5cbiAgICAgIF9kZXN0cm95Q29sbGVjdGlvbjtcblxuICBfdGhpcyA9IEV2ZW50cygpO1xuXG4gIC8qKlxuICAgKiBAY29uc3RydWN0b3JcbiAgICpcbiAgICovXG4gIF9pbml0aWFsaXplID0gZnVuY3Rpb24gKHBhcmFtcykge1xuICAgIHBhcmFtcyA9IHBhcmFtcyB8fCB7fTtcblxuICAgIC8vIEVsZW1lbnQgd2hlcmUgdGhpcyB2aWV3IGlzIHJlbmRlcmVkXG4gICAgX3RoaXMuZWwgPSAocGFyYW1zLmhhc093blByb3BlcnR5KCdlbCcpKSA/XG4gICAgICAgIHBhcmFtcy5lbCA6IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXG4gICAgX3RoaXMuY29sbGVjdGlvbiA9IHBhcmFtcy5jb2xsZWN0aW9uO1xuXG4gICAgaWYgKCFfdGhpcy5jb2xsZWN0aW9uKSB7XG4gICAgICBfdGhpcy5jb2xsZWN0aW9uID0gQ29sbGVjdGlvbigpO1xuICAgICAgX2Rlc3Ryb3lDb2xsZWN0aW9uID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoX3RoaXMuY29sbGVjdGlvbi5nZXRTZWxlY3RlZCgpKSB7XG4gICAgICBfdGhpcy5vbkNvbGxlY3Rpb25TZWxlY3QoKTtcbiAgICB9XG5cbiAgICBfdGhpcy5jb2xsZWN0aW9uLm9uKCdkZXNlbGVjdCcsICdvbkNvbGxlY3Rpb25EZXNlbGVjdCcsIF90aGlzKTtcbiAgICBfdGhpcy5jb2xsZWN0aW9uLm9uKCdyZXNldCcsICdvbkNvbGxlY3Rpb25SZXNldCcsIF90aGlzKTtcbiAgICBfdGhpcy5jb2xsZWN0aW9uLm9uKCdzZWxlY3QnLCAnb25Db2xsZWN0aW9uU2VsZWN0JywgX3RoaXMpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBjbGVhbiB1cCB0aGUgdmlld1xuICAgKi9cbiAgX3RoaXMuZGVzdHJveSA9IGZ1bmN0aW9uICgpIHtcbiAgICAvLyB1bmRvIGV2ZW50IGJpbmRpbmdzXG4gICAgaWYgKF90aGlzLm1vZGVsKSB7XG4gICAgICBfdGhpcy5vbkNvbGxlY3Rpb25EZXNlbGVjdCgpO1xuICAgIH1cbiAgICBfdGhpcy5jb2xsZWN0aW9uLm9mZignZGVzZWxlY3QnLCAnb25Db2xsZWN0aW9uRGVzZWxlY3QnLCBfdGhpcyk7XG4gICAgX3RoaXMuY29sbGVjdGlvbi5vZmYoJ3Jlc2V0JywgJ29uQ29sbGVjdGlvblJlc2V0JywgX3RoaXMpO1xuICAgIF90aGlzLmNvbGxlY3Rpb24ub2ZmKCdzZWxlY3QnLCAnb25Db2xsZWN0aW9uU2VsZWN0JywgX3RoaXMpO1xuXG4gICAgaWYgKF9kZXN0cm95Q29sbGVjdGlvbikge1xuICAgICAgX3RoaXMuY29sbGVjdGlvbi5kZXN0cm95KCk7XG4gICAgfVxuXG4gICAgX2Rlc3Ryb3lDb2xsZWN0aW9uID0gbnVsbDtcblxuICAgIF90aGlzID0gbnVsbDtcbiAgICBfaW5pdGlhbGl6ZSA9IG51bGw7XG4gIH07XG5cbiAgLyoqXG4gICAqIHVuc2V0IHRoZSBldmVudCBiaW5kaW5ncyBmb3IgdGhlIGNvbGxlY3Rpb25cbiAgICovXG4gIF90aGlzLm9uQ29sbGVjdGlvbkRlc2VsZWN0ID0gZnVuY3Rpb24gKCkge1xuICAgIGlmIChfdGhpcy5tb2RlbCkge1xuICAgICAgX3RoaXMubW9kZWwub2ZmKCdjaGFuZ2UnLCAncmVuZGVyJywgX3RoaXMpO1xuICAgICAgX3RoaXMubW9kZWwgPSBudWxsO1xuICAgIH1cbiAgICBfdGhpcy5yZW5kZXIoe21vZGVsOiBfdGhpcy5tb2RlbH0pO1xuICB9O1xuXG4gIC8qKlxuICAgKiB1bnNldCBldmVudCBiaW5kaW5ncyBmb3IgdGhlIGNvbGxlY3Rpb24sIGlmIHNldC5cbiAgICovXG4gIF90aGlzLm9uQ29sbGVjdGlvblJlc2V0ID0gZnVuY3Rpb24gKCkge1xuICAgIGlmIChfdGhpcy5tb2RlbCkge1xuICAgICAgX3RoaXMubW9kZWwub2ZmKCdjaGFuZ2UnLCAncmVuZGVyJywgX3RoaXMpO1xuICAgICAgX3RoaXMubW9kZWwgPSBudWxsO1xuICAgIH1cbiAgICBfdGhpcy5yZW5kZXIoe21vZGVsOiBfdGhpcy5tb2RlbH0pO1xuICB9O1xuXG4gIC8qKlxuICAgKiBzZXQgZXZlbnQgYmluZGluZ3MgZm9yIHRoZSBjb2xsZWN0aW9uXG4gICAqL1xuICBfdGhpcy5vbkNvbGxlY3Rpb25TZWxlY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgX3RoaXMubW9kZWwgPSBfdGhpcy5jb2xsZWN0aW9uLmdldFNlbGVjdGVkKCk7XG4gICAgX3RoaXMubW9kZWwub24oJ2NoYW5nZScsICdyZW5kZXInLCBfdGhpcyk7XG4gICAgX3RoaXMucmVuZGVyKHttb2RlbDogX3RoaXMubW9kZWx9KTtcbiAgfTtcblxuICAvKipcbiAgICogcmVuZGVyIHRoZSBzZWxlY3RlZCBtb2RlbCBpbiB0aGUgdmlld1xuICAgKi9cbiAgX3RoaXMucmVuZGVyID0gZnVuY3Rpb24gKCkge307XG5cbiAgX2luaXRpYWxpemUocGFyYW1zKTtcbiAgcGFyYW1zID0gbnVsbDtcbiAgcmV0dXJuIF90aGlzO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBTZWxlY3RlZENvbGxlY3Rpb25WaWV3O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgQ29sbGVjdGlvbiA9IHJlcXVpcmUoJy4vQ29sbGVjdGlvbicpLFxuICAgIENvbGxlY3Rpb25TZWxlY3RCb3ggPSByZXF1aXJlKCcuL0NvbGxlY3Rpb25TZWxlY3RCb3gnKSxcbiAgICBVdGlsID0gcmVxdWlyZSgnLi4vdXRpbC9VdGlsJyksXG4gICAgVmlldyA9IHJlcXVpcmUoJy4vVmlldycpO1xuXG4vKipcbiAqIENvbnN0cnVjdCBhIFNvcnRWaWV3LlxuICpcbiAqIFNvcnQgb2JqZWN0cyBjYW4gc3BlY2lmeSBhIGN1c3RvbSBzb3J0IGZ1bmN0aW9uIChzb3J0KSxcbiAqIG9yIGEgdmFsdWUgdG8gYmUgc29ydGVkIChzb3J0QnkpIGFuZCBzb3J0IG9yZGVyIChkZXNjZW5kaW5nKS5cbiAqXG4gKiBAcGFyYW0gb3B0aW9ucyB7T2JqZWN0fVxuICogQHBhcmFtIG9wdGlvbnMuc29ydHMge0FycmF5PE9iamVjdD59XG4gKiAgICAgICAgYXJyYXkgb2Ygc29ydCBvYmplY3RzLCB3aXRoIHByb3BlcnRpZXM6XG4gKiAgICAgICAgLSBpZCB7U3RyaW5nfE51bWJlcn0gdW5pcXVlIGlkZW50aWZpZXIgZm9yIHNvcnRcbiAqICAgICAgICAtIHRpdGxlIHtTdHJpbmd9IGRpc3BsYXkgbmFtZSBmb3Igc29ydFxuICogICAgICAgIEFuZDpcbiAqICAgICAgICAtIHNvcnQge0Z1bmN0aW9uKGEsIGIpfSBzb3J0aW5nIGZ1bmN0aW9uLlxuICogICAgICAgIE9yOlxuICogICAgICAgIC0gc29ydEJ5IHtGdW5jdGlvbihPYmplY3QpfSByZXR1cm4gdmFsdWUgZm9yIHNvcnRpbmcuXG4gKiAgICAgICAgLSBkZXNjZW5kaW5nIHtCb29sZWFufSBkZWZhdWx0IGZhbHNlLCB3aGV0aGVyIHRvXG4gKiAgICAgICAgICBzb3J0IGFzY2VuZGluZyAodHJ1ZSkgb3IgZGVzY2VuZGluZyAoZmFsc2UpLlxuICogQHBhcmFtIG9wdGlvbnMuZGVmYXVsdFNvcnQge0lEfVxuICogICAgICAgIE9wdGlvbmFsLlxuICogICAgICAgIElmIHNwZWNpZmllZCwgc2hvdWxkIG1hdGNoIFwiaWRcIiBvZiBhIHNvcnQgb2JqZWN0LlxuICogQHNlZSBtdmMvVmlld1xuICovXG52YXIgU29ydFZpZXcgPSBmdW5jdGlvbiAocGFyYW1zKSB7XG4gIHZhciBfdGhpcyxcbiAgICAgIF9pbml0aWFsaXplLFxuXG4gICAgICBfY29sbGVjdGlvbixcbiAgICAgIF9zZWxlY3RWaWV3LFxuICAgICAgX3NvcnRDb2xsZWN0aW9uLFxuXG4gICAgICBfZ2V0U29ydEZ1bmN0aW9uLFxuICAgICAgX29uU2VsZWN0O1xuXG5cbiAgX3RoaXMgPSBWaWV3KHBhcmFtcyk7XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgdGhlIFNvcnRWaWV3LlxuICAgKi9cbiAgX2luaXRpYWxpemUgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGVsID0gX3RoaXMuZWw7XG5cbiAgICBfY29sbGVjdGlvbiA9IHBhcmFtcy5jb2xsZWN0aW9uO1xuXG4gICAgZWwuaW5uZXJIVE1MID0gJzxsYWJlbD5Tb3J0IGJ5IDxzZWxlY3Q+PC9zZWxlY3Q+PC9sYWJlbD4nO1xuICAgIGVsLmNsYXNzTGlzdC5hZGQoJ3NvcnR2aWV3Jyk7XG5cbiAgICBfc29ydENvbGxlY3Rpb24gPSBuZXcgQ29sbGVjdGlvbihwYXJhbXMuc29ydHMpO1xuICAgIF9zb3J0Q29sbGVjdGlvbi5vbignc2VsZWN0JywgX29uU2VsZWN0LCB0aGlzKTtcblxuICAgIC8vIGluaXRpYWwgc29ydCBvcmRlclxuICAgIGlmIChwYXJhbXMuZGVmYXVsdFNvcnQpIHtcbiAgICAgIF9zb3J0Q29sbGVjdGlvbi5zZWxlY3QoX3NvcnRDb2xsZWN0aW9uLmdldChwYXJhbXMuZGVmYXVsdFNvcnQpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgX3NvcnRDb2xsZWN0aW9uLnNlbGVjdChfc29ydENvbGxlY3Rpb24uZGF0YSgpWzBdKTtcbiAgICB9XG5cbiAgICBfc2VsZWN0VmlldyA9IG5ldyBDb2xsZWN0aW9uU2VsZWN0Qm94KHtcbiAgICAgIGVsOiBlbC5xdWVyeVNlbGVjdG9yKCdzZWxlY3QnKSxcbiAgICAgIGNvbGxlY3Rpb246IF9zb3J0Q29sbGVjdGlvbixcbiAgICAgIGZvcm1hdDogZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgcmV0dXJuIGl0ZW0udGl0bGU7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBwYXJhbXMgPSBudWxsO1xuICB9O1xuXG5cbiAgLyoqXG4gICAqIENvbnZlcnQgYSBzb3J0QnkgZnVuY3Rpb24gdG8gYSBzb3J0IGZ1bmN0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0gc29ydEJ5IHtGdW5jdGlvbihPYmplY3QpfVxuICAgKiAgICAgICAgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHNvcnQga2V5LlxuICAgKiBAcGFyYW0gZGVzY2VuZGluZyB7Qm9vbGVhbn1cbiAgICogICAgICAgIERlZmF1bHQgZmFsc2UuXG4gICAqICAgICAgICBXaGV0aGVyIHRvIHNvcnQgYXNjZW5kaW5nIChmYWxzZSkgb3IgZGVzY2VuZGluZyAodHJ1ZSkuXG4gICAqIEByZXR1cm4ge0Z1bmN0aW9uKGEsIGIpfSBzb3J0IGZ1bmN0aW9uLlxuICAgKi9cbiAgX2dldFNvcnRGdW5jdGlvbiA9IGZ1bmN0aW9uIChzb3J0QnksIGRlc2NlbmRpbmcpIHtcbiAgICB2YXIgY2FjaGUgPSB7fTtcblxuICAgIHJldHVybiBmdW5jdGlvbiAoYSwgYikge1xuICAgICAgdmFyIGF2YWwgPSBjYWNoZVthLmlkXSxcbiAgICAgICAgICBidmFsID0gY2FjaGVbYi5pZF0sXG4gICAgICAgICAgdG1wO1xuXG4gICAgICBpZiAoIWF2YWwpIHtcbiAgICAgICAgYXZhbCA9IGNhY2hlW2EuaWRdID0gc29ydEJ5KGEpO1xuICAgICAgfVxuICAgICAgaWYgKCFidmFsKSB7XG4gICAgICAgIGJ2YWwgPSBjYWNoZVtiLmlkXSA9IHNvcnRCeShiKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGRlc2NlbmRpbmcpIHtcbiAgICAgICAgLy8gc3dhcCBjb21wYXJpc29uIG9yZGVyXG4gICAgICAgIHRtcCA9IGJ2YWw7XG4gICAgICAgIGJ2YWwgPSBhdmFsO1xuICAgICAgICBhdmFsID0gdG1wO1xuICAgICAgfVxuXG4gICAgICBpZiAoYXZhbCA8IGJ2YWwpIHtcbiAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgfSBlbHNlIGlmIChhdmFsID4gYnZhbCkge1xuICAgICAgICByZXR1cm4gMTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiAwO1xuICAgICAgfVxuICAgIH07XG4gIH07XG5cbiAgLyoqXG4gICAqIEhhbmRsZSBzb3J0IGNvbGxlY3Rpb24gc2VsZWN0IGV2ZW50LlxuICAgKi9cbiAgX29uU2VsZWN0ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxlY3RlZCA9IF9zb3J0Q29sbGVjdGlvbi5nZXRTZWxlY3RlZCgpLFxuICAgICAgICBzb3J0O1xuXG4gICAgaWYgKHNlbGVjdGVkKSB7XG4gICAgICBzb3J0ID0gc2VsZWN0ZWQuc29ydDtcbiAgICAgIGlmICghc29ydCkge1xuICAgICAgICBzb3J0ID0gX2dldFNvcnRGdW5jdGlvbihzZWxlY3RlZC5zb3J0QnksIHNlbGVjdGVkLmRlc2NlbmRpbmcpO1xuICAgICAgfVxuICAgICAgX2NvbGxlY3Rpb24uc29ydChzb3J0KTtcbiAgICB9XG4gIH07XG5cblxuICAvKipcbiAgICogRGVzdHJveSB0aGUgU29ydFZpZXcuXG4gICAqL1xuICBfdGhpcy5kZXN0cm95ID0gVXRpbC5jb21wb3NlKGZ1bmN0aW9uICgpIHtcbiAgICBfc29ydENvbGxlY3Rpb24ub2ZmKCdzZWxlY3QnLCBfb25TZWxlY3QsIHRoaXMpO1xuICAgIF9zb3J0Q29sbGVjdGlvbiA9IG51bGw7XG4gICAgX2NvbGxlY3Rpb24gPSBudWxsO1xuICAgIF9zZWxlY3RWaWV3LmRlc3Ryb3koKTtcbiAgfSwgX3RoaXMuZGVzdHJveSk7XG5cblxuICBfaW5pdGlhbGl6ZSgpO1xuICByZXR1cm4gX3RoaXM7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNvcnRWaWV3OyIsIid1c2Ugc3RyaWN0Jztcbi8qKlxuICogQSBsaWdodHdlaWdodCB2aWV3IGNsYXNzLlxuICpcbiAqIFByaW1hcmlseSBtYW5hZ2VzIGFuIGVsZW1lbnQgd2hlcmUgYSB2aWV3IGNhbiByZW5kZXIgaXRzIGRhdGEuXG4gKi9cblxuXG52YXIgTW9kZWwgPSByZXF1aXJlKCcuL01vZGVsJyksXG5cbiAgICBFdmVudHMgPSByZXF1aXJlKCcuLi91dGlsL0V2ZW50cycpLFxuICAgIFV0aWwgPSByZXF1aXJlKCcuLi91dGlsL1V0aWwnKTtcblxuXG52YXIgX0RFRkFVTFRTID0ge1xufTtcblxuXG4vKiogY3JlYXRlIGEgbmV3IHZpZXcuICovXG52YXIgVmlldyA9IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgdmFyIF90aGlzLFxuICAgICAgX2luaXRpYWxpemUsXG5cbiAgICAgIF9kZXN0cm95TW9kZWw7XG5cblxuICBfdGhpcyA9IEV2ZW50cygpO1xuXG4gIC8qKlxuICAgKiBAY29uc3RydWN0b3JcbiAgICpcbiAgICovXG4gIF9pbml0aWFsaXplID0gZnVuY3Rpb24gKHBhcmFtcykge1xuICAgIHBhcmFtcyA9IFV0aWwuZXh0ZW5kKHt9LCBfREVGQVVMVFMsIHBhcmFtcyk7XG5cbiAgICAvLyBFbGVtZW50IHdoZXJlIHRoaXMgdmlldyBpcyByZW5kZXJlZFxuICAgIF90aGlzLmVsID0gKHBhcmFtcyAmJiBwYXJhbXMuaGFzT3duUHJvcGVydHkoJ2VsJykpID9cbiAgICAgICAgcGFyYW1zLmVsIDogZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cbiAgICBfdGhpcy5tb2RlbCA9IHBhcmFtcy5tb2RlbDtcblxuICAgIGlmICghX3RoaXMubW9kZWwpIHtcbiAgICAgIF90aGlzLm1vZGVsID0gTW9kZWwoe30pO1xuICAgICAgX2Rlc3Ryb3lNb2RlbCA9IHRydWU7XG4gICAgfVxuXG4gICAgX3RoaXMubW9kZWwub24oJ2NoYW5nZScsICdyZW5kZXInLCBfdGhpcyk7XG4gIH07XG5cblxuICAvKipcbiAgICogQVBJIE1ldGhvZFxuICAgKlxuICAgKiBSZW5kZXJzIHRoZSB2aWV3XG4gICAqL1xuICBfdGhpcy5yZW5kZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgLy8gSW1wZWxlbWVudGF0aW9ucyBzaG91bGQgdXBkYXRlIHRoZSB2aWV3IGJhc2VkIG9uIHRoZSBjdXJyZW50XG4gICAgLy8gbW9kZWwgcHJvcGVydGllcy5cbiAgfTtcblxuICAvKipcbiAgICogQVBJIE1ldGhvZFxuICAgKlxuICAgKiBDbGVhbnMgdXAgcmVzb3VyY2VzIGFsbG9jYXRlZCBieSB0aGUgdmlldy4gU2hvdWxkIGJlIGNhbGxlZCBiZWZvcmVcbiAgICogZGlzY2FyZGluZyBhIHZpZXcuXG4gICAqL1xuICBfdGhpcy5kZXN0cm95ID0gVXRpbC5jb21wb3NlKGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoX3RoaXMgPT09ICBudWxsKSB7XG4gICAgICByZXR1cm47IC8vIGFscmVhZHkgZGVzdHJveWVkXG4gICAgfVxuXG4gICAgX3RoaXMubW9kZWwub2ZmKCdjaGFuZ2UnLCAncmVuZGVyJywgX3RoaXMpO1xuXG4gICAgaWYgKF9kZXN0cm95TW9kZWwpIHtcbiAgICAgIF90aGlzLm1vZGVsLmRlc3Ryb3koKTtcbiAgICB9XG5cbiAgICBfZGVzdHJveU1vZGVsID0gbnVsbDtcblxuICAgIF90aGlzLm1vZGVsID0gbnVsbDtcbiAgICBfdGhpcy5lbCA9IG51bGw7XG5cbiAgICBfaW5pdGlhbGl6ZSA9IG51bGw7XG4gICAgX3RoaXMgPSBudWxsO1xuICB9LCBfdGhpcy5kZXN0cm95KTtcblxuXG4gIF9pbml0aWFsaXplKHBhcmFtcyk7XG4gIHBhcmFtcyA9IG51bGw7XG4gIHJldHVybiBfdGhpcztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gVmlldztcbiIsImNvbnN0IEV2ZW50c1ZpZXcgPSByZXF1aXJlKCdzaGFrZW1hcC12aWV3L2V2ZW50cy9FdmVudHNWaWV3JyksXG4gICAgICAgIExvYWRpbmdWaWV3ID0gcmVxdWlyZSgnc2hha2VtYXAtdmlldy9sb2FkaW5nL0xvYWRpbmdWaWV3JyksXG4gICAgICAgIE1hcFZpZXcgPSByZXF1aXJlKCdzaGFrZW1hcC12aWV3L21hcHMvTWFwVmlldycpLFxuICAgICAgICBWaWV3ID0gcmVxdWlyZSgnaGF6ZGV2LXdlYnV0aWxzL3NyYy9tdmMvVmlldycpLFxuICAgICAgICBVdGlsID0gcmVxdWlyZSgnaGF6ZGV2LXdlYnV0aWxzL3NyYy91dGlsL1V0aWwnKTtcblxudmFyIEFwcCA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgdmFyIF90aGlzLFxuICAgICAgICAgICAgX2luaXRpYWxpemU7XG5cbiAgICBvcHRpb25zID0gVXRpbC5leHRlbmQoe30sIHt9LCBvcHRpb25zKTtcbiAgICBfdGhpcyA9IFZpZXcob3B0aW9ucyk7XG5cbiAgICBfaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uICgvKm9wdGlvbnMqLykge1xuICAgICAgICBfdGhpcy5lbC5jbGFzc0xpc3QuYWRkKCdzbS12aWV3LWFwcCcpO1xuXG4gICAgICAgIF90aGlzLmVsLmlubmVySFRNTCA9XG4gICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJsb2FkaW5nLXZpZXdcIj48L2Rpdj4nICtcbiAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cImV2ZW50c1wiPjwvZGl2PicgK1xuICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwibWFwLXZpZXdcIiBzdHlsZT1cImhlaWdodDoxMDAlO3dpZHRoOjEwMCU7cG9zaXRpb246cmVsYXRpdmU7XCI+PC9kaXY+JztcblxuICAgICAgICBfdGhpcy5tYXBWaWV3ID0gTWFwVmlldyh7XG4gICAgICAgICAgICBlbDogX3RoaXMuZWwucXVlcnlTZWxlY3RvcignLm1hcC12aWV3JyksXG4gICAgICAgICAgICBtb2RlbDogX3RoaXMubW9kZWxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgX3RoaXMuZXZlbnRzVmlldyA9IEV2ZW50c1ZpZXcoe1xuICAgICAgICAgICAgZWw6IF90aGlzLmVsLnF1ZXJ5U2VsZWN0b3IoJy5ldmVudHMnKSxcbiAgICAgICAgICAgIG1vZGVsOiBfdGhpcy5tb2RlbFxuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgIF90aGlzLmxvYWRpbmdWaWV3ID0gTG9hZGluZ1ZpZXcoe1xuICAgICAgICAgICAgZWw6IF90aGlzLmVsLnF1ZXJ5U2VsZWN0b3IoJy5sb2FkaW5nLXZpZXcnKSxcbiAgICAgICAgICAgIG1vZGVsOiBfdGhpcy5tb2RlbFxuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgX2luaXRpYWxpemUob3B0aW9ucyk7XG4gICAgb3B0aW9ucyA9IG51bGw7XG4gICAgcmV0dXJuIF90aGlzO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBBcHA7IiwiY29uc3QgTW9kZWwgPSByZXF1aXJlKCdoYXpkZXYtd2VidXRpbHMvc3JjL212Yy9Nb2RlbCcpLFxuICAgICAgICBVdGlsID0gcmVxdWlyZSgnaGF6ZGV2LXdlYnV0aWxzL3NyYy91dGlsL1V0aWwnKTtcblxudmFyIFNoYWtlTWFwTW9kZWwgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgdmFyIF90aGlzO1xuXG4gICAgX3RoaXMgPSBNb2RlbChVdGlsLmV4dGVuZCh7fSxcbiAgICAgICAge3Byb2R1Y3RzVXJsOiAnL3Byb2R1Y3RzLmpzb24nLFxuICAgICAgICAgICAgZXZlbnRzOiBbXSxcbiAgICAgICAgICAgIGV2ZW50OiBudWxsLFxuICAgICAgICAgICAgbGF5ZXJzOiBbXSxcbiAgICAgICAgICAgIGRlZmF1bHRMYXllcnM6IFsnRXBpY2VudGVyJywgJ1BHQSBDb250b3VycyddLFxuICAgICAgICAgICAgbG9hZGluZzogZmFsc2V9LFxuXHRcdFx0b3B0aW9ucykpO1xuXG4gICAgcmV0dXJuIF90aGlzO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBTaGFrZU1hcE1vZGVsOyIsIid1c2Ugc3RyaWN0JztcblxudmFyIF9fSU5TVEFOQ0VfXyA9IG51bGw7XG5cblxudmFyIF9faXNfc3RyaW5nID0gZnVuY3Rpb24gKG9iaikge1xuICByZXR1cm4gKHR5cGVvZiBvYmogPT09ICdzdHJpbmcnIHx8IG9iaiBpbnN0YW5jZW9mIFN0cmluZyk7XG59O1xuXG5cbnZhciBFdmVudHMgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBfdGhpcyxcbiAgICAgIF9pbml0aWFsaXplLFxuXG4gICAgICBfbGlzdGVuZXJzO1xuXG5cbiAgX3RoaXMgPSB7fTtcblxuICBfaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAvLyBtYXAgb2YgbGlzdGVuZXJzIGJ5IGV2ZW50IHR5cGVcbiAgICBfbGlzdGVuZXJzID0ge307XG4gIH07XG5cblxuICAvKipcbiAgICogRnJlZSBhbGwgcmVmZXJlbmNlcy5cbiAgICovXG4gIF90aGlzLmRlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7XG4gICAgX2luaXRpYWxpemUgPSBudWxsO1xuICAgIF9saXN0ZW5lcnMgPSBudWxsO1xuICAgIF90aGlzID0gbnVsbDtcbiAgfTtcblxuICAvKipcbiAgICogUmVtb3ZlIGFuIGV2ZW50IGxpc3RlbmVyXG4gICAqXG4gICAqIE9taXR0aW5nIGNhbGxiYWNrIGNsZWFycyBhbGwgbGlzdGVuZXJzIGZvciBnaXZlbiBldmVudC5cbiAgICogT21pdHRpbmcgZXZlbnQgY2xlYXJzIGFsbCBsaXN0ZW5lcnMgZm9yIGFsbCBldmVudHMuXG4gICAqXG4gICAqIEBwYXJhbSBldmVudCB7U3RyaW5nfVxuICAgKiAgICAgIGV2ZW50IG5hbWUgdG8gdW5iaW5kLlxuICAgKiBAcGFyYW0gY2FsbGJhY2sge0Z1bmN0aW9ufVxuICAgKiAgICAgIGNhbGxiYWNrIHRvIHVuYmluZC5cbiAgICogQHBhcmFtIGNvbnRleHQge09iamVjdH1cbiAgICogICAgICBjb250ZXh0IGZvciBcInRoaXNcIiB3aGVuIGNhbGxiYWNrIGlzIGNhbGxlZFxuICAgKi9cbiAgX3RoaXMub2ZmID0gZnVuY3Rpb24gKGV2dCwgY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICB2YXIgaTtcblxuICAgIGlmICh0eXBlb2YgZXZ0ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgLy8gcmVtb3ZpbmcgYWxsIGxpc3RlbmVycyBvbiB0aGlzIG9iamVjdFxuICAgICAgX2xpc3RlbmVycyA9IG51bGw7XG4gICAgICBfbGlzdGVuZXJzID0ge307XG4gICAgfSBlbHNlIGlmICghX2xpc3RlbmVycy5oYXNPd25Qcm9wZXJ0eShldnQpKSB7XG4gICAgICAvLyBubyBsaXN0ZW5lcnMsIG5vdGhpbmcgdG8gZG9cbiAgICAgIHJldHVybjtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIC8vIHJlbW92aW5nIGFsbCBsaXN0ZW5lcnMgZm9yIHRoaXMgZXZlbnRcbiAgICAgIGRlbGV0ZSBfbGlzdGVuZXJzW2V2dF07XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBsaXN0ZW5lciA9IG51bGw7XG5cbiAgICAgIC8vIHNlYXJjaCBmb3IgY2FsbGJhY2sgdG8gcmVtb3ZlXG4gICAgICBmb3IgKGkgPSBfbGlzdGVuZXJzW2V2dF0ubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgbGlzdGVuZXIgPSBfbGlzdGVuZXJzW2V2dF1baV07XG5cbiAgICAgICAgaWYgKGxpc3RlbmVyLmNhbGxiYWNrID09PSBjYWxsYmFjayAmJlxuICAgICAgICAgICAgKCFjb250ZXh0IHx8IGxpc3RlbmVyLmNvbnRleHQgPT09IGNvbnRleHQpKSB7XG5cbiAgICAgICAgICAvLyBmb3VuZCBjYWxsYmFjaywgcmVtb3ZlXG4gICAgICAgICAgX2xpc3RlbmVyc1tldnRdLnNwbGljZShpLDEpO1xuXG4gICAgICAgICAgaWYgKGNvbnRleHQpIHtcbiAgICAgICAgICAgIC8vIGZvdW5kIGNhbGxiYWNrIHdpdGggY29udGV4dCwgc3RvcCBzZWFyY2hpbmdcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBjbGVhbnVwIGlmIGxhc3QgY2FsbGJhY2sgb2YgdGhpcyB0eXBlXG4gICAgICBpZiAoX2xpc3RlbmVyc1tldnRdLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBkZWxldGUgX2xpc3RlbmVyc1tldnRdO1xuICAgICAgfVxuXG4gICAgICBsaXN0ZW5lciA9IG51bGw7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBBZGQgYW4gZXZlbnQgbGlzdGVuZXJcbiAgICpcbiAgICogQHBhcmFtIGV2ZW50IHtTdHJpbmd9XG4gICAqICAgICAgZXZlbnQgbmFtZSAoc2luZ3VsYXIpLiAgRS5nLiAncmVzZXQnXG4gICAqIEBwYXJhbSBjYWxsYmFjayB7RnVuY3Rpb259XG4gICAqICAgICAgZnVuY3Rpb24gdG8gY2FsbCB3aGVuIGV2ZW50IGlzIHRyaWdnZXJlZC5cbiAgICogQHBhcmFtIGNvbnRleHQge09iamVjdH1cbiAgICogICAgICBjb250ZXh0IGZvciBcInRoaXNcIiB3aGVuIGNhbGxiYWNrIGlzIGNhbGxlZFxuICAgKi9cbiAgX3RoaXMub24gPSBmdW5jdGlvbiAoZXZlbnQsIGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgaWYgKCEoKGNhbGxiYWNrIHx8ICFjYWxsYmFjay5hcHBseSkgfHxcbiAgICAgICAgKGNvbnRleHQgJiYgX19pc19zdHJpbmcoY2FsbGJhY2spICYmIGNvbnRleHRbY2FsbGJhY2tdLmFwcGx5KSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2FsbGJhY2sgcGFyYW1ldGVyIGlzIG5vdCBjYWxsYWJsZS4nKTtcbiAgICB9XG5cbiAgICBpZiAoIV9saXN0ZW5lcnMuaGFzT3duUHJvcGVydHkoZXZlbnQpKSB7XG4gICAgICAvLyBmaXJzdCBsaXN0ZW5lciBmb3IgZXZlbnQgdHlwZVxuICAgICAgX2xpc3RlbmVyc1tldmVudF0gPSBbXTtcbiAgICB9XG5cbiAgICAvLyBhZGQgbGlzdGVuZXJcbiAgICBfbGlzdGVuZXJzW2V2ZW50XS5wdXNoKHtcbiAgICAgIGNhbGxiYWNrOiBjYWxsYmFjayxcbiAgICAgIGNvbnRleHQ6IGNvbnRleHRcbiAgICB9KTtcbiAgfTtcblxuICAvKipcbiAgICogVHJpZ2dlciBhbiBldmVudFxuICAgKlxuICAgKiBAcGFyYW0gZXZlbnQge1N0cmluZ31cbiAgICogICAgICBldmVudCBuYW1lLlxuICAgKiBAcGFyYW0gYXJncyB74oCmfVxuICAgKiAgICAgIHZhcmlhYmxlIGxlbmd0aCBhcmd1bWVudHMgYWZ0ZXIgZXZlbnQgYXJlIHBhc3NlZCB0byBsaXN0ZW5lcnMuXG4gICAqL1xuICBfdGhpcy50cmlnZ2VyID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgdmFyIGFyZ3MsXG4gICAgICAgIGksXG4gICAgICAgIGxlbixcbiAgICAgICAgbGlzdGVuZXIsXG4gICAgICAgIGxpc3RlbmVycztcblxuICAgIGlmIChfbGlzdGVuZXJzLmhhc093blByb3BlcnR5KGV2ZW50KSkge1xuXG4gICAgICBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICAgIGxpc3RlbmVycyA9IF9saXN0ZW5lcnNbZXZlbnRdLnNsaWNlKDApO1xuXG4gICAgICBmb3IgKGkgPSAwLCBsZW4gPSBsaXN0ZW5lcnMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgbGlzdGVuZXIgPSBsaXN0ZW5lcnNbaV07XG5cbiAgICAgICAgLy8gTk9URTogaWYgbGlzdGVuZXIgdGhyb3dzIGV4Y2VwdGlvbiwgdGhpcyB3aWxsIHN0b3AuLi5cbiAgICAgICAgaWYgKF9faXNfc3RyaW5nKGxpc3RlbmVyLmNhbGxiYWNrKSkge1xuICAgICAgICAgIGxpc3RlbmVyLmNvbnRleHRbbGlzdGVuZXIuY2FsbGJhY2tdLmFwcGx5KGxpc3RlbmVyLmNvbnRleHQsIGFyZ3MpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxpc3RlbmVyLmNhbGxiYWNrLmFwcGx5KGxpc3RlbmVyLmNvbnRleHQsIGFyZ3MpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIF9pbml0aWFsaXplKCk7XG4gIHJldHVybiBfdGhpcztcbn07XG5cbi8vIG1ha2UgRXZlbnRzIGEgZ2xvYmFsIGV2ZW50IHNvdXJjZVxuX19JTlNUQU5DRV9fID0gRXZlbnRzKCk7XG5FdmVudHMub24gPSBmdW5jdGlvbiBfZXZlbnRzX29uICgpIHtcbiAgcmV0dXJuIF9fSU5TVEFOQ0VfXy5vbi5hcHBseShfX0lOU1RBTkNFX18sIGFyZ3VtZW50cyk7XG59O1xuRXZlbnRzLm9mZiA9IGZ1bmN0aW9uIF9ldmVudHNfb2ZmICgpIHtcbiAgcmV0dXJuIF9fSU5TVEFOQ0VfXy5vZmYuYXBwbHkoX19JTlNUQU5DRV9fLCBhcmd1bWVudHMpO1xufTtcbkV2ZW50cy50cmlnZ2VyID0gZnVuY3Rpb24gX2V2ZW50c190cmlnZ2VyICgpIHtcbiAgcmV0dXJuIF9fSU5TVEFOQ0VfXy50cmlnZ2VyLmFwcGx5KF9fSU5TVEFOQ0VfXywgYXJndW1lbnRzKTtcbn07XG5cbi8vIGludGVyY2VwdCB3aW5kb3cub25oYXNoY2hhbmdlIGV2ZW50cywgb3Igc2ltdWxhdGUgaWYgYnJvd3NlciBkb2Vzbid0XG4vLyBzdXBwb3J0LCBhbmQgc2VuZCB0byBnbG9iYWwgRXZlbnRzIG9iamVjdFxudmFyIF9vbkhhc2hDaGFuZ2UgPSBmdW5jdGlvbiAoZSkge1xuICBFdmVudHMudHJpZ2dlcignaGFzaGNoYW5nZScsIGUpO1xufTtcblxuLy8gY291cnRlc3kgb2Y6XG4vLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzkzMzk4NjUvZ2V0LXRoZS1oYXNoY2hhbmdlLWV2ZW50LXRvLXdvcmstaW4tYWxsLWJyb3dzZXJzLWluY2x1ZGluZy1pZTdcbmlmICghKCdvbmhhc2hjaGFuZ2UnIGluIHdpbmRvdykpIHtcbiAgdmFyIG9sZEhyZWYgPSBkb2N1bWVudC5sb2NhdGlvbi5oYXNoO1xuXG4gIHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICBpZiAob2xkSHJlZiAhPT0gZG9jdW1lbnQubG9jYXRpb24uaGFzaCkge1xuICAgICAgb2xkSHJlZiA9IGRvY3VtZW50LmxvY2F0aW9uLmhhc2g7XG4gICAgICBfb25IYXNoQ2hhbmdlKHtcbiAgICAgICAgJ3R5cGUnOiAnaGFzaGNoYW5nZScsXG4gICAgICAgICduZXdVUkwnOiBkb2N1bWVudC5sb2NhdGlvbi5oYXNoLFxuICAgICAgICAnb2xkVVJMJzogb2xkSHJlZlxuICAgICAgfSk7XG4gICAgfVxuICB9LCAzMDApO1xuXG59IGVsc2UgaWYgKHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKSB7XG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdoYXNoY2hhbmdlJywgX29uSGFzaENoYW5nZSwgZmFsc2UpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50cztcbiIsIid1c2Ugc3RyaWN0JztcblxuXG52YXIgVXRpbCA9IHJlcXVpcmUoJ3V0aWwvVXRpbCcpO1xuXG5cbi8vIERlZmF1bHQgdmFsdWVzIHRvIGJlIHVzZWQgYnkgY29uc3RydWN0b3JcbnZhciBfREVGQVVMVFMgPSB7XG4gICBtYXhGaWxlU2l6ZTogMjA5NzE1MjAwIC8vIDIwME1CXG59O1xuXG5cbi8qKlxuICogQ2xhc3M6IEZpbGVJT1xuICpcbiAqIEBwYXJhbSBwYXJhbXMge09iamVjdH1cbiAqICAgICAgQ29uZmlndXJhdGlvbiBvcHRpb25zLiBTZWUgX0RFRkFVTFRTIGZvciBtb3JlIGRldGFpbHMuXG4gKi9cbnZhciBGaWxlSU8gPSBmdW5jdGlvbiAocGFyYW1zKSB7XG4gIHZhciBfdGhpcyxcbiAgICAgIF9pbml0aWFsaXplLFxuXG4gICAgICBfbWF4RmlsZVNpemUsXG5cbiAgICAgIF9nZXRSZWFkTWV0aG9kO1xuXG5cbiAgLy8gSW5oZXJpdCBmcm9tIHBhcmVudCBjbGFzc1xuICBfdGhpcyA9IHtcbiAgICByZWFkOiBudWxsLFxuICAgIHdyaXRlOiBudWxsXG4gIH07XG5cbiAgLyoqXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKlxuICAgKi9cbiAgX2luaXRpYWxpemUgPSBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgLy8gRW51bWVyYXRlIGVhY2ggcHJvcGVydHkgZXhwZWN0ZWQgdG8gYmUgZ2l2ZW4gaW4gcGFyYW1zIG1ldGhvZFxuICAgIHBhcmFtcyA9IFV0aWwuZXh0ZW5kKHt9LCBfREVGQVVMVFMsIHBhcmFtcyk7XG5cbiAgICBfbWF4RmlsZVNpemUgPSBwYXJhbXMubWF4RmlsZVNpemU7XG4gIH07XG5cbiAgX2dldFJlYWRNZXRob2QgPSBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgdmFyIHJlYWRlcixcbiAgICAgICAgdHlwZTtcblxuICAgIHJlYWRlciA9IHBhcmFtcy5yZWFkZXI7XG5cbiAgICBpZiAoIXBhcmFtcy5oYXNPd25Qcm9wZXJ0eSgndXJsJykpIHtcbiAgICAgIHJldHVybiByZWFkZXIucmVhZEFzRGF0YVVSTDtcbiAgICB9IGVsc2UgaWYgKHBhcmFtcy5tZXRob2QgJiYgdHlwZW9mIHJlYWRlcltwYXJhbXMubWV0aG9kXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgLy8gSWYgc3BlY2lmaWMgbWV0aG9kIGlzIHJlcXVlc3RlZCB0aGVuIHVzZSBpdFxuICAgICAgcmV0dXJuIHJlYWRlcltwYXJhbXMubWV0aG9kXTtcbiAgICB9XG5cbiAgICAvLyBUcnkgdG8gY2hvb3NlIGEgZGVjZW50IG1ldGhvZCBiYXNlZCBvbiBmaWxlIHR5cGVcbiAgICB0eXBlID0gcGFyYW1zLmZpbGUudHlwZTtcblxuICAgIGlmICh0eXBlLmluZGV4T2YoJ3RleHQnKSAhPT0gLTEgfHwgdHlwZS5pbmRleE9mKCd0eHQnKSAhPT0gLTEgfHxcbiAgICAgICAgdHlwZSA9PT0gJ2FwcGxpY2F0aW9uL3htbCcgfHwgdHlwZSA9PT0gJ2FwcGxpY2F0aW9uL2pzb24nKSB7XG4gICAgICByZXR1cm4gcmVhZGVyLnJlYWRBc1RleHQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiByZWFkZXIucmVhZEFzQmluYXJ5U3RyaW5nO1xuICAgIH1cbiAgfTtcblxuXG4gIF90aGlzLmRlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7XG4gICAgX21heEZpbGVTaXplID0gbnVsbDtcblxuICAgIF9nZXRSZWFkTWV0aG9kID0gbnVsbDtcblxuICAgIF9pbml0aWFsaXplID0gbnVsbDtcbiAgICBfdGhpcyA9IG51bGw7XG4gIH07XG5cbiAgLyoqXG4gICAqIEFzeW5jaHJvbm91c2x5IHJlYWQgZmlsZSBjb250ZW50cy4gVGhpcyBtZXRob2QgaGFzIG5vIHJldHVybiB2YWx1ZS5cbiAgICpcbiAgICogQHBhcmFtIHBhcmFtcyB7T2JqZWN0fVxuICAgKiAgICAgIFBhcmFtZXRlcnMgZ2l2ZW4gdG8gdGhlIG1ldGhvZCBpbmNsdWRpbmc6XG4gICAqICAgICAgJ2ZpbGUnOiB7RmlsZX0gVGhlIGZpbGUgb2JqZWN0IHRvIHJlYWRcbiAgICogICAgICAnc3VjY2Vzcyc6IHtGdW5jdGlvbn0gQ2FsbGJhY2sgbWV0aG9kIHRvIGV4ZWN1dGUgb24gc3VjY2Vzcy5cbiAgICogICAgICAnZXJyb3InOiB7RnVuY3Rpb259IENhbGxiYWNrIG1ldGhvZCB0byBleGVjdXRlIG9uIGVycm9yLlxuICAgKiAgICAgICdyZWFkZXInOiB7RmlsZVJlYWRlcn0gVGhlIHJlYWRlciB0byB1c2UgZm9yIHJlYWRpbmcuIE9wdGlvbmFsLlxuICAgKiAgICAgICdtZXRob2QnOiB7U3RyaW5nfSBUaGUgbmFtZSBvZiB0aGUgcmVhZGVyIG1ldGhvZC4gT3B0aW9uYWwuXG4gICAqXG4gICAqIEB0aHJvd3Mge0Vycm9yfVxuICAgKiAgICAgIElmIHBhcmFtcy5maWxlIGlzIG5vdCBwcm92aWRlZC5cbiAgICovXG4gIF90aGlzLnJlYWQgPSBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgdmFyIG1ldGhvZCxcbiAgICAgICAgb25SZWFkRXJyb3IsXG4gICAgICAgIG9uUmVhZFN1Y2Nlc3MsXG4gICAgICAgIG9uUmVhZENvbXBsZXRlLFxuICAgICAgICByZWFkZXI7XG5cbiAgICBpZiAoIXBhcmFtcyB8fCAhcGFyYW1zLmZpbGUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignUGFyYW1ldGVycyBhcmUgcmVxdWlyZWQgZm9yIHJlYWRpbmcuJyk7XG4gICAgfVxuXG4gICAgaWYgKHBhcmFtcy5maWxlLnNpemUgPiBfbWF4RmlsZVNpemUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignRmlsZSBzaXplIGlzIHRvbyBsYXJnZS4nKTtcbiAgICB9XG5cbiAgICByZWFkZXIgPSBwYXJhbXMucmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcbiAgICBtZXRob2QgPSBfZ2V0UmVhZE1ldGhvZChwYXJhbXMpO1xuXG4gICAgb25SZWFkQ29tcGxldGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAocGFyYW1zLnN1Y2Nlc3MpIHtcbiAgICAgICAgcmVhZGVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBvblJlYWRTdWNjZXNzKTtcbiAgICAgICAgb25SZWFkU3VjY2VzcyA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIGlmIChwYXJhbXMuZXJyb3IpIHtcbiAgICAgICAgcmVhZGVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgb25SZWFkRXJyb3IpO1xuICAgICAgICBvblJlYWRFcnJvciA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIHJlYWRlci5yZW1vdmVFdmVudExpc3RlbmVyKCdsb2FkZW5kJywgb25SZWFkQ29tcGxldGUpO1xuICAgICAgb25SZWFkQ29tcGxldGUgPSBudWxsO1xuXG4gICAgICByZWFkZXIgPSBudWxsO1xuICAgIH07XG4gICAgcmVhZGVyLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWRlbmQnLCBvblJlYWRDb21wbGV0ZSk7XG5cblxuICAgIG9uUmVhZFN1Y2Nlc3MgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICAgIGlmICghcGFyYW1zLnVybCkge1xuICAgICAgICBwYXJhbXMudXJsID0gcmVhZGVyLnJlc3VsdDtcbiAgICAgICAgX3RoaXMucmVhZChwYXJhbXMpO1xuICAgICAgfSBlbHNlIGlmIChwYXJhbXMuc3VjY2Vzcykge1xuICAgICAgICBwYXJhbXMuc3VjY2Vzcyh7XG4gICAgICAgICAgZmlsZTogcGFyYW1zLmZpbGUsXG4gICAgICAgICAgY29udGVudDogcmVhZGVyLnJlc3VsdCxcbiAgICAgICAgICBtZXRob2Q6IG1ldGhvZC5uYW1lLFxuICAgICAgICAgIHVybDogcGFyYW1zLnVybFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHJlYWRlci5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgb25SZWFkU3VjY2Vzcyk7XG5cbiAgICBpZiAocGFyYW1zLmVycm9yKSB7XG4gICAgICBvblJlYWRFcnJvciA9IGZ1bmN0aW9uICgvKmV2ZW50Ki8pIHtcbiAgICAgICAgcGFyYW1zLmVycm9yKHtcbiAgICAgICAgICBlcnJvcjogcmVhZGVyLmVycm9yLFxuICAgICAgICAgIGZpbGU6IHBhcmFtcy5maWxlLFxuICAgICAgICAgIHJlc3VsdDogcmVhZGVyLnJlc3VsdFxuICAgICAgICB9KTtcbiAgICAgIH07XG5cbiAgICAgIHJlYWRlci5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsIG9uUmVhZEVycm9yKTtcbiAgICB9XG5cbiAgICBtZXRob2QuY2FsbChyZWFkZXIsIHBhcmFtcy5maWxlKTtcbiAgfTtcblxuICBfdGhpcy53cml0ZSA9IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICB2YXIgYmxvYixcbiAgICAgICAgdXJsO1xuXG4gICAgaWYgKCFwYXJhbXMgfHwgIXBhcmFtcy5jb250ZW50KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1BhcmFtZXRlcnMgYXJlIHJlcXVpcmVkIGZvciB3cml0aW5nLicpO1xuICAgIH1cblxuICAgIGJsb2IgPSBuZXcgQmxvYihbcGFyYW1zLmNvbnRlbnRdLCB7dHlwZTogcGFyYW1zLnR5cGUgfHwgJ3RleHQvcGxhaW4nfSk7XG5cbiAgICBpZiAod2luZG93Lm5hdmlnYXRvciAmJiB3aW5kb3cubmF2aWdhdG9yLm1zU2F2ZU9yT3BlbkJsb2IpIHtcbiAgICAgIHdpbmRvdy5uYXZpZ2F0b3IubXNTYXZlT3JPcGVuQmxvYihibG9iLCBwYXJhbXMubmFtZSB8fCAnZG93bmxvYWQnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdXJsID0gd2luZG93LlVSTC5jcmVhdGVPYmplY3RVUkwoYmxvYik7XG4gICAgICB3aW5kb3cub3Blbih1cmwsIHBhcmFtcy5uYW1lIHx8ICdkb3dubG9hZCcpO1xuICAgICAgd2luZG93LlVSTC5yZXZva2VPYmplY3RVUkwodXJsKTtcbiAgICB9XG4gIH07XG5cblxuICAvLyBBbHdheXMgY2FsbCB0aGUgY29uc3RydWN0b3JcbiAgX2luaXRpYWxpemUocGFyYW1zKTtcbiAgcGFyYW1zID0gbnVsbDtcbiAgcmV0dXJuIF90aGlzO1xufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IEZpbGVJTztcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIEV2ZW50cyA9IHJlcXVpcmUoJy4vRXZlbnRzJyk7XG5cblxudmFyIF9JRF9TRVFVRU5DRSA9IDA7XG5cbnZhciBfX2dldF9pZCA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuICdoYXpkZXYtd2VidXRpbHMtbWVzc2FnZS0nICsgKF9JRF9TRVFVRU5DRSsrKTtcbn07XG5cblxudmFyIE1lc3NhZ2UgPSBmdW5jdGlvbiAocGFyYW1zKSB7XG4gIHZhciBfdGhpcyxcbiAgICAgIF9pbml0aWFsaXplLFxuXG4gICAgICBfYXV0b2Nsb3NlLFxuICAgICAgX2NsYXNzZXMsXG4gICAgICBfY2xvc2VhYmxlLFxuICAgICAgX2Nsb3NlQnV0dG9uLFxuICAgICAgX2NvbnRhaW5lcixcbiAgICAgIF9jb250ZW50LFxuICAgICAgX2lkLFxuICAgICAgX2luc2VydEJlZm9yZSxcbiAgICAgIF9tZXNzYWdlLFxuXG4gICAgICBfY3JlYXRlQ2xvc2VCdXR0b24sXG4gICAgICBfb25BbGVydENsb3NlLFxuICAgICAgX3Nob3c7XG5cblxuICBfdGhpcyA9IEV2ZW50cygpO1xuXG4gIF9pbml0aWFsaXplID0gZnVuY3Rpb24gKHBhcmFtcykge1xuICAgIF9pZCA9IF9fZ2V0X2lkKCk7XG5cbiAgICBfY29udGFpbmVyID0gcGFyYW1zLmNvbnRhaW5lciB8fCBkb2N1bWVudC5ib2R5O1xuICAgIF9jb250ZW50ID0gcGFyYW1zLmNvbnRlbnQgfHwgJ1NvbWV0aGluZyBqdXN0IGhhcHBlbmVkLi4uJztcblxuICAgIF9hdXRvY2xvc2UgPSBwYXJzZUludChwYXJhbXMuYXV0b2Nsb3NlLCAxMCkgfHwgMDtcbiAgICBfY2xhc3NlcyA9IFsnYWxlcnQnLCAnd2VidXRpbHMtbWVzc2FnZSddLmNvbmNhdChwYXJhbXMuY2xhc3NlcyB8fCBbXSk7XG4gICAgX2Nsb3NlYWJsZSA9IHBhcmFtcy5jbG9zZWFibGUgfHwgdHJ1ZTtcbiAgICBfaW5zZXJ0QmVmb3JlID0gcGFyYW1zLmluc2VydEJlZm9yZSB8fCBmYWxzZTtcblxuICAgIF9zaG93KCk7XG4gIH07XG5cblxuICBfY3JlYXRlQ2xvc2VCdXR0b24gPSBmdW5jdGlvbiAoKSB7XG4gICAgX2Nsb3NlQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgX2Nsb3NlQnV0dG9uLnNldEF0dHJpYnV0ZSgnaHJlZicsICcjJyk7XG4gICAgX2Nsb3NlQnV0dG9uLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAnMCcpO1xuICAgIF9jbG9zZUJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCAnQ2xvc2UgQWxlcnQnKTtcbiAgICBfY2xvc2VCdXR0b24uc2V0QXR0cmlidXRlKCdhcmlhLWNvbnRyb2xzJywgX2lkKTtcbiAgICBfY2xvc2VCdXR0b24uY2xhc3NMaXN0LmFkZCgnd2VidXRpbHMtbWVzc2FnZS1jbG9zZScpO1xuICAgIF9jbG9zZUJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdtYXRlcmlhbC1pY29ucycpO1xuICAgIF9jbG9zZUJ1dHRvbi5pbm5lckhUTUwgPSAnY2xvc2UnO1xuXG4gICAgX2Nsb3NlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgX29uQWxlcnRDbG9zZSk7XG5cbiAgICByZXR1cm4gX2Nsb3NlQnV0dG9uO1xuICB9O1xuXG4gIF9vbkFsZXJ0Q2xvc2UgPSBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgX3RoaXMuaGlkZSh0cnVlKTtcbiAgICByZXR1cm4gZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gIH07XG5cbiAgX3Nob3cgPSBmdW5jdGlvbiAoKSB7XG4gICAgX21lc3NhZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBfbWVzc2FnZS5zZXRBdHRyaWJ1dGUoJ2lkJywgX2lkKTtcbiAgICBfbWVzc2FnZS5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAnYWxlcnQnKTtcbiAgICBfbWVzc2FnZS5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGl2ZScsICdwb2xpdGUnKTtcblxuICAgIF9tZXNzYWdlLmlubmVySFRNTCA9IF9jb250ZW50O1xuXG5cbiAgICBfY2xhc3Nlcy5mb3JFYWNoKGZ1bmN0aW9uIChjbGFzc05hbWUpIHtcbiAgICAgIF9tZXNzYWdlLmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcbiAgICB9KTtcblxuICAgIGlmIChfY2xvc2VhYmxlKSB7XG4gICAgICBfbWVzc2FnZS5jbGFzc0xpc3QuYWRkKCd3ZWJ1dGlscy1tZXNzYWdlLWNsb3NlYWJsZScpO1xuICAgICAgX21lc3NhZ2UuYXBwZW5kQ2hpbGQoX2NyZWF0ZUNsb3NlQnV0dG9uKCkpO1xuICAgIH1cblxuICAgIGlmIChfYXV0b2Nsb3NlKSB7XG4gICAgICB3aW5kb3cuc2V0VGltZW91dChfdGhpcy5oaWRlLCBfYXV0b2Nsb3NlKTtcbiAgICB9XG5cbiAgICBpZiAoX2NvbnRhaW5lcikge1xuICAgICAgaWYgKF9pbnNlcnRCZWZvcmUgJiYgX2NvbnRhaW5lci5maXJzdENoaWxkKSB7XG4gICAgICAgIF9jb250YWluZXIuaW5zZXJ0QmVmb3JlKF9tZXNzYWdlLCBfY29udGFpbmVyLmZpcnN0Q2hpbGQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgX2NvbnRhaW5lci5hcHBlbmRDaGlsZChfbWVzc2FnZSk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG5cbiAgX3RoaXMuaGlkZSA9IGZ1bmN0aW9uICh1c2VyVHJpZ2dlcmVkKSB7XG4gICAgICBfbWVzc2FnZS5jbGFzc0xpc3QuYWRkKCdpbnZpc2libGUnKTtcblxuICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKF9tZXNzYWdlLnBhcmVudE5vZGUpIHtcbiAgICAgICAgICBfbWVzc2FnZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKF9tZXNzYWdlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIF90aGlzLnRyaWdnZXIoJ2hpZGUnLCB7dXNlclRyaWdnZXJlZDogdXNlclRyaWdnZXJlZH0pO1xuICAgICAgICBfdGhpcy5kZXN0cm95KCk7XG4gICAgfSwgMjYyKTtcbiAgfTtcblxuICBfdGhpcy5kZXN0cm95ID0gZnVuY3Rpb24gKCkge1xuICAgIGlmIChfY2xvc2VCdXR0b24pIHtcbiAgICAgIF9jbG9zZUJ1dHRvbi5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIF9vbkFsZXJ0Q2xvc2UpO1xuICAgIH1cblxuICAgIF9hdXRvY2xvc2UgPSBudWxsO1xuICAgIF9jbGFzc2VzID0gbnVsbDtcbiAgICBfY2xvc2VhYmxlID0gbnVsbDtcbiAgICBfY2xvc2VCdXR0b24gPSBudWxsO1xuICAgIF9jb250YWluZXIgPSBudWxsO1xuICAgIF9jb250ZW50ID0gbnVsbDtcbiAgICBfaWQgPSBudWxsO1xuICAgIF9pbnNlcnRCZWZvcmUgPSBudWxsO1xuICAgIF9tZXNzYWdlID0gbnVsbDtcblxuICAgIF9jcmVhdGVDbG9zZUJ1dHRvbiA9IG51bGw7XG4gICAgX29uQWxlcnRDbG9zZSA9IG51bGw7XG4gICAgX3Nob3cgPSBudWxsO1xuXG4gICAgX2luaXRpYWxpemUgPSBudWxsO1xuICAgIF90aGlzID0gbnVsbDtcbiAgfTtcblxuXG4gIF9pbml0aWFsaXplKHBhcmFtcyk7XG4gIHBhcmFtcyA9IG51bGw7XG4gIHJldHVybiBfdGhpcztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTWVzc2FnZTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gZG8gdGhlc2UgY2hlY2tzIG9uY2UsIGluc3RlYWQgb2Ygb25jZSBwZXIgY2FsbFxudmFyIGlzTW9iaWxlID0gZmFsc2UsXG4gICAgc3VwcG9ydHNEYXRlSW5wdXQgPSBmYWxzZTtcblxuXG4vLyBzdGF0aWMgb2JqZWN0IHdpdGggdXRpbGl0eSBtZXRob2RzXG52YXIgVXRpbCA9IGZ1bmN0aW9uICgpIHtcbn07XG5cblxuVXRpbC5pc01vYmlsZSA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIGlzTW9iaWxlO1xufTtcblxuVXRpbC5zdXBwb3J0c0RhdGVJbnB1dCA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHN1cHBvcnRzRGF0ZUlucHV0O1xufTtcblxuLyoqXG4gKiBNZXJnZSBwcm9wZXJ0aWVzIGZyb20gYSBzZXJpZXMgb2Ygb2JqZWN0cy5cbiAqXG4gKiBAcGFyYW0gZHN0IHtPYmplY3R9XG4gKiAgICAgIHRhcmdldCB3aGVyZSBtZXJnZWQgcHJvcGVydGllcyBhcmUgY29waWVkIHRvLlxuICogQHBhcmFtIDx2YXJpYWJsZT4ge09iamVjdH1cbiAqICAgICAgc291cmNlIG9iamVjdHMgZm9yIHByb3BlcnRpZXMuIFdoZW4gYSBzb3VyY2UgaXMgbm9uIG51bGwsIGl0J3NcbiAqICAgICAgcHJvcGVydGllcyBhcmUgY29waWVkIHRvIHRoZSBkc3Qgb2JqZWN0LiBQcm9wZXJ0aWVzIGFyZSBjb3BpZWQgaW5cbiAqICAgICAgdGhlIG9yZGVyIG9mIGFyZ3VtZW50czogYSBwcm9wZXJ0eSBvbiBhIGxhdGVyIGFyZ3VtZW50IG92ZXJyaWRlcyBhXG4gKiAgICAgIHByb3BlcnR5IG9uIGFuIGVhcmxpZXIgYXJndW1lbnQuXG4gKi9cblV0aWwuZXh0ZW5kID0gZnVuY3Rpb24gKGRzdCkge1xuICB2YXIgaSwgbGVuLCBzcmMsIHByb3A7XG5cbiAgLy8gaXRlcmF0ZSBvdmVyIHNvdXJjZXMgd2hlcmUgcHJvcGVydGllcyBhcmUgcmVhZFxuICBmb3IgKGkgPSAxLCBsZW4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICBzcmMgPSBhcmd1bWVudHNbaV07XG4gICAgaWYgKHNyYykge1xuICAgICAgZm9yIChwcm9wIGluIHNyYykge1xuICAgICAgICBkc3RbcHJvcF0gPSBzcmNbcHJvcF07XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gcmV0dXJuIHVwZGF0ZWQgb2JqZWN0XG4gIHJldHVybiBkc3Q7XG59O1xuXG4vKipcbiAqIENoZWNrcyBpZiBvYmplY3RzIGFyZSBlcXVhbC5cbiAqXG4gKiBAcGFyYW0gYSB7T2JqZWN0fVxuICogICAgICBPYmplY3QgYS5cbiAqIEBwYXJhbSBiIHtPYmplY3R9XG4gKiAgICAgIE9iamVjdCBiLlxuICovXG5VdGlsLmVxdWFscyA9IGZ1bmN0aW9uIChvYmpBLCBvYmpCKSB7XG4gIHZhciBrZXlhLCBrZXliO1xuXG4gIGlmIChvYmpBID09PSBvYmpCKSB7XG4gICAgLy8gaWYgPT09IHRoZW4gPT09LCBubyBxdWVzdGlvbiBhYm91dCB0aGF0Li4uXG4gICAgcmV0dXJuIHRydWU7XG4gIH0gZWxzZSBpZiAob2JqQSA9PT0gbnVsbCB8fCBvYmpCID09PSBudWxsKSB7XG4gICAgLy8gZnVubnksIHR5cGVvZiBudWxsID09PSAnb2JqZWN0Jywgc28gLi4uIGhtcGghXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBvYmpBID09PSAnb2JqZWN0JyAmJiB0eXBlb2Ygb2JqQiA9PT0gJ29iamVjdCcpIHtcbiAgICAvLyByZWN1cnNpdmVseSBjaGVjayBvYmplY3RzXG4gICAgZm9yIChrZXlhIGluIG9iakEpIHtcbiAgICAgIGlmIChvYmpBLmhhc093blByb3BlcnR5KGtleWEpKSB7XG4gICAgICAgIGlmICghb2JqQi5oYXNPd25Qcm9wZXJ0eShrZXlhKSkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTsgLy8gb2JqQiBpcyBtaXNzaW5nIGEga2V5IGZyb20gb2JqQVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChrZXliIGluIG9iakIpIHtcbiAgICAgIGlmIChvYmpCLmhhc093blByb3BlcnR5KGtleWIpKSB7XG4gICAgICAgIGlmICghb2JqQS5oYXNPd25Qcm9wZXJ0eShrZXliKSkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTsgLy8gb2JqQSBpcyBtaXNzaW5nIGEga2V5IGZyb20gb2JqQlxuICAgICAgICB9IGVsc2UgaWYgKCFVdGlsLmVxdWFscyhvYmpBW2tleWJdLCBvYmpCW2tleWJdKSkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTsgLy8gb2JqQVtrZXldICE9PSBvYmpCW2tleV1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0cnVlOyAvLyBSZWN1cnNpdmVseSBlcXVhbCwgc28gZXF1YWxcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gb2JqQSA9PT0gb2JqQjsgLy8gVXNlIGJha2VkIGluID09PSBmb3IgcHJpbWl0aXZlc1xuICB9XG59O1xuXG4vKipcbiAqIEdldCBhbiBldmVudCBvYmplY3QgZm9yIGFuIGV2ZW50IGhhbmRsZXIuXG4gKlxuICogQHBhcmFtIGUgdGhlIGV2ZW50IHRoYXQgd2FzIHJlY2VpdmVkIGJ5IHRoZSBldmVudCBoYW5kbGVyLlxuICogQHJldHVybiB7T2JqZWN0fVxuICogICAgICB3aXRoIHR3byBwcm9wZXJ0aWVzOlxuICogICAgICB0YXJnZXRcbiAqICAgICAgICAgICB0aGUgZWxlbWVudCB3aGVyZSB0aGUgZXZlbnQgb2NjdXJyZWQuXG4gKiAgICAgIG9yaWdpbmFsRXZlbnRcbiAqICAgICAgICAgICB0aGUgZXZlbnQgb2JqZWN0LCBlaXRoZXIgcGFyYW1ldGVyIGUgb3Igd2luZG93LmV2ZW50IChpbiBJRSkuXG4gKi9cblV0aWwuZ2V0RXZlbnQgPSBmdW5jdGlvbiAoZSkge1xuICB2YXIgdGFyZztcblxuICBpZiAoIWUpIHtcbiAgICAvLyBpZSBwdXRzIGV2ZW50IGluIGdsb2JhbFxuICAgIGUgPSB3aW5kb3cuZXZlbnQ7XG4gIH1cblxuICAvLyBmaW5kIHRhcmdldFxuICBpZiAoZS50YXJnZXQpIHtcbiAgICB0YXJnID0gZS50YXJnZXQ7XG4gIH0gZWxzZSBpZiAoZS5zcmNFbGVtZW50KSB7XG4gICAgdGFyZyA9IGUuc3JjRWxlbWVudDtcbiAgfVxuXG4gIC8vIGhhbmRsZSBzYWZhcmkgYnVnXG4gIGlmICh0YXJnLm5vZGVUeXBlID09PSAzKSB7XG4gICAgdGFyZyA9IHRhcmcucGFyZW50Tm9kZTtcbiAgfVxuXG4gIC8vIHJldHVybiB0YXJnZXQgYW5kIGV2ZW50XG4gIHJldHVybiB7XG4gICAgdGFyZ2V0OiB0YXJnLFxuICAgIG9yaWdpbmFsRXZlbnQ6IGVcbiAgfTtcbn07XG5cbi8qKlxuICogR2V0IGEgcGFyZW50IG5vZGUgYmFzZWQgb24gaXQncyBub2RlIG5hbWUuXG4gKlxuICogQHBhcmFtIGVsIHtET01FbGVtZW50fVxuICogICAgICBlbGVtZW50IHRvIHNlYXJjaCBmcm9tLlxuICogQHBhcmFtIG5vZGVOYW1lIHtTdHJpbmd9XG4gKiAgICAgIG5vZGUgbmFtZSB0byBzZWFyY2ggZm9yLlxuICogQHBhcmFtIG1heFBhcmVudCB7RE9NRWxlbWVudH1cbiAqICAgICAgZWxlbWVudCB0byBzdG9wIHNlYXJjaGluZy5cbiAqIEByZXR1cm4ge0RPTUVsZW1lbnR9XG4gKiAgICAgIG1hdGNoaW5nIGVsZW1lbnQsIG9yIG51bGwgaWYgbm90IGZvdW5kLlxuICovXG5VdGlsLmdldFBhcmVudE5vZGUgPSBmdW5jdGlvbiAoZWwsIG5vZGVOYW1lLCBtYXhQYXJlbnQpIHtcbiAgdmFyIGN1clBhcmVudCA9IGVsO1xuXG4gIHdoaWxlIChjdXJQYXJlbnQgJiYgY3VyUGFyZW50ICE9PSBtYXhQYXJlbnQgJiZcbiAgICAgIGN1clBhcmVudC5ub2RlTmFtZS50b1VwcGVyQ2FzZSgpICE9PSBub2RlTmFtZS50b1VwcGVyQ2FzZSgpKSB7XG4gICAgY3VyUGFyZW50ID0gY3VyUGFyZW50LnBhcmVudE5vZGU7XG4gIH1cbiAgaWYgKGN1clBhcmVudCAmJiAnbm9kZU5hbWUnIGluIGN1clBhcmVudCAmJlxuICAgICAgY3VyUGFyZW50Lm5vZGVOYW1lLnRvVXBwZXJDYXNlKCkgPT09IG5vZGVOYW1lLnRvVXBwZXJDYXNlKCkpIHtcbiAgICAvLyBmb3VuZCB0aGUgZGVzaXJlZCBub2RlXG4gICAgcmV0dXJuIGN1clBhcmVudDtcbiAgfVxuXG4gIC8vIGRpZG4ndCBmaW5kIHRoZSBkZXNpcmVkIG5vZGVcbiAgcmV0dXJuIG51bGw7XG59O1xuXG4vLyByZW1vdmUgYW4gZWxlbWVudHMgY2hpbGQgbm9kZXNcblV0aWwuZW1wdHkgPSBmdW5jdGlvbiAoZWwpIHtcbiAgd2hpbGUgKGVsLmZpcnN0Q2hpbGQpIHtcbiAgICBlbC5yZW1vdmVDaGlsZChlbC5maXJzdENoaWxkKTtcbiAgfVxufTtcblxuLy8gZGV0YWNoIGFuIGVsZW1lbnQgZnJvbSBpdHMgcGFyZW50XG5VdGlsLmRldGFjaCA9IGZ1bmN0aW9uIChlbCkge1xuICBpZiAoZWwucGFyZW50Tm9kZSkge1xuICAgIGVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWwpO1xuICB9XG59O1xuXG5VdGlsLmdldFdpbmRvd1NpemUgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBkaW1lbnNpb25zID0ge3dpZHRoOm51bGwsaGVpZ2h0Om51bGx9O1xuXG4gIGlmICgnaW5uZXJXaWR0aCcgaW4gd2luZG93ICYmICdpbm5lckhlaWdodCcgaW4gd2luZG93KSB7XG4gICAgZGltZW5zaW9ucyA9IHtcbiAgICAgIHdpZHRoOiB3aW5kb3cuaW5uZXJXaWR0aCxcbiAgICAgIGhlaWdodDogd2luZG93LmlubmVySGVpZ2h0XG4gICAgfTtcbiAgfSBlbHNlIHtcbiAgICAvLyBwcm9iYWJseSBJRTw9OFxuICAgIHZhciBlbGVtID0gJ2RvY3VtZW50RWxlbWVudCcgaW4gZG9jdW1lbnQgP1xuICAgICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQgOiBkb2N1bWVudC5ib2R5O1xuXG4gICAgZGltZW5zaW9ucyA9IHtcbiAgICAgIHdpZHRoOiBlbGVtLm9mZnNldFdpZHRoLFxuICAgICAgaGVpZ2h0OiBlbGVtLm9mZnNldEhlaWdodFxuICAgIH07XG4gIH1cblxuICByZXR1cm4gZGltZW5zaW9ucztcbn07XG5cbi8qKlxuICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgaXMgYSBjb21wb3NpdGlvbiBvZiBvdGhlciBmdW5jdGlvbnMuXG4gKlxuICogRm9yIGV4YW1wbGU6XG4gKiAgICAgIGEoYihjKHgpKSkgPT09IGNvbXBvc2UoYywgYiwgYSkoeCk7XG4gKlxuICogRWFjaCBmdW5jdGlvbiBzaG91bGQgYWNjZXB0IGFzIGFuIGFyZ3VtZW50LCB0aGUgcmVzdWx0IG9mIHRoZSBwcmV2aW91c1xuICogZnVuY3Rpb24gY2FsbCBpbiB0aGUgY2hhaW4uIEl0IGlzIGFsbG93YWJsZSBmb3IgYWxsIGZ1bmN0aW9ucyB0byBoYXZlIG5vXG4gKiByZXR1cm4gdmFsdWUgYXMgd2VsbC5cbiAqXG4gKiBAcGFyYW0gLi4uIHtGdW5jdGlvbn0gQSB2YXJpYWJsZSBzZXQgb2YgZnVuY3Rpb25zIHRvIGNhbGwsIGluIG9yZGVyLlxuICpcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufSBUaGUgY29tcG9zaXRpb24gb2YgdGhlIGZ1bmN0aW9ucyBwcm92aWRlZCBhcyBhcmd1bWVudHMuXG4gKi9cblV0aWwuY29tcG9zZSA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGZucyA9IGFyZ3VtZW50cztcblxuICByZXR1cm4gZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgIHZhciBpLFxuICAgICAgICBmbixcbiAgICAgICAgbGVuO1xuXG4gICAgZm9yIChpID0gMCwgbGVuID0gZm5zLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBmbiA9IGZuc1tpXTtcblxuICAgICAgaWYgKGZuICYmIGZuLmNhbGwpIHtcbiAgICAgICAgcmVzdWx0ID0gZm4uY2FsbCh0aGlzLCByZXN1bHQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG59O1xuXG4vKipcbiAqIENoZWNrcyB0aGUgZWxlbWVudHMgb2YgYSBsb29raW5nIGZvciBiLiBiIGlzIGFzc3VtZWQgdG8gYmUgZm91bmQgaWYgZm9yXG4gKiBzb21lIG9iamVjdCBpbiBhIChhW2ldKSwgYVtpXSA9PT0gYi4gTm90ZSBzdHJpY3QgZXF1YWxpdHkuXG4gKlxuICogQHBhcmFtIGEge0FycmF5fVxuICogICAgICBBbiBhcnJheSB0byBzZWFyY2hcbiAqIEBwYXJhbSBiIHtNaXhlZH1cbiAqICAgICAgQSB2YWx1ZSB0byBzZWFyY2ggZm9yXG4gKlxuICogQHJldHVyblxuICogICAgICB0cnVlIGlmIGFycmF5IGEgY29udGFpbnMgYlxuICovXG5VdGlsLmNvbnRhaW5zID0gZnVuY3Rpb24gKGEsIGIpIHtcbiAgdmFyIGksIGxlbjtcblxuICBmb3IgKGkgPSAwLCBsZW4gPSBhLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgaWYgKGIgPT09IGFbaV0pIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn07XG5cbi8qKlxuICogQHJldHVyblxuICogICAgICB0cnVlIGlmIG9iamVjdCBpcyBhbiBhcnJheVxuICovXG5VdGlsLmlzQXJyYXkgPSBmdW5jdGlvbiAoYSkge1xuXG4gIGlmICh0eXBlb2YgQXJyYXkuaXNBcnJheSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBBcnJheS5pc0FycmF5KGEpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYSkgPT09ICdbb2JqZWN0IEFycmF5XSc7XG4gIH1cblxufTtcblxuXG4vKipcbiAqIExvYWQgYSBzY3JpcHQgYXN5bmNocm9ub3VzbHkuXG4gKlxuICogQHBhcmFtIHVybCB7U3RyaW5nfVxuICogICAgICAgIHNjcmlwdCB0byBsb2FkLlxuICogQHBhcmFtIG9wdGlvbnMge09iamVjdH1cbiAqICAgICAgICBhZGRpdGlvbmFsIG9wdGlvbnMuXG4gKiBAcGFyYW0gb3B0aW9ucy5zdWNjZXNzIHtGdW5jdGlvbn0gb3B0aW9uYWwuXG4gKiAgICAgICAgY2FsbGVkIGFmdGVyIHNjcmlwdCBsb2FkcyBzdWNjZXNzZnVsbHkuXG4gKiBAcGFyYW0gb3B0aW9ucy5lcnJvciB7RnVuY3Rpb259IG9wdGlvbmFsLlxuICogICAgICAgIGNhbGxlZCBhZnRlciBzY3JpcHQgZmFpbHMgdG8gbG9hZC5cbiAqIEBwYXJhbSBvcHRpb25zLmRvbmUge0Z1bmN0aW9ufSBvcHRpb25hbFxuICogICAgICAgIGNhbGxlZCBhZnRlciBsb2FkU2NyaXB0IGlzIGNvbXBsZXRlLFxuICogICAgICAgIGFmdGVyIGNhbGxpbmcgc3VjY2VzcyBvciBlcnJvci5cbiAqL1xuVXRpbC5sb2FkU2NyaXB0ID0gZnVuY3Rpb24gKHVybCwgb3B0aW9ucykge1xuICAvLyBsb2FkIHNlY29uZGFyeSBzY3JpcHRcbiAgdmFyIGNsZWFudXAsXG4gICAgICBkb25lLFxuICAgICAgb25FcnJvcixcbiAgICAgIG9uTG9hZCxcbiAgICAgIHNjcmlwdDtcblxuICBvcHRpb25zID0gVXRpbC5leHRlbmQoe30sIHtcbiAgICBzdWNjZXNzOiBudWxsLFxuICAgIGVycm9yOiBudWxsLFxuICAgIGRvbmU6IG51bGxcbiAgfSwgb3B0aW9ucyk7XG5cbiAgY2xlYW51cCA9IGZ1bmN0aW9uICgpIHtcbiAgICBzY3JpcHQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbG9hZCcsIG9uTG9hZCk7XG4gICAgc2NyaXB0LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgb25FcnJvcik7XG4gICAgc2NyaXB0LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc2NyaXB0KTtcbiAgICBjbGVhbnVwID0gbnVsbDtcbiAgICBvbkxvYWQgPSBudWxsO1xuICAgIG9uRXJyb3IgPSBudWxsO1xuICAgIHNjcmlwdCA9IG51bGw7XG4gIH07XG5cbiAgZG9uZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAob3B0aW9ucy5kb25lICE9PSBudWxsKSB7XG4gICAgICBvcHRpb25zLmRvbmUoKTtcbiAgICB9XG4gICAgb3B0aW9ucyA9IG51bGw7XG4gIH07XG5cbiAgb25FcnJvciA9IGZ1bmN0aW9uICgpIHtcbiAgICBjbGVhbnVwKCk7XG4gICAgaWYgKG9wdGlvbnMuZXJyb3IgIT09IG51bGwpIHtcbiAgICAgIG9wdGlvbnMuZXJyb3IuYXBwbHkobnVsbCwgYXJndW1lbnRzKTtcbiAgICB9XG4gICAgZG9uZSgpO1xuICB9O1xuXG4gIG9uTG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICBjbGVhbnVwKCk7XG4gICAgaWYgKG9wdGlvbnMuc3VjY2VzcyAhPT0gbnVsbCkge1xuICAgICAgb3B0aW9ucy5zdWNjZXNzLmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7XG4gICAgfVxuICAgIGRvbmUoKTtcbiAgfTtcblxuICBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcbiAgc2NyaXB0LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBvbkxvYWQpO1xuICBzY3JpcHQuYWRkRXZlbnRMaXN0ZW5lcignZXJyb3InLCBvbkVycm9yKTtcbiAgc2NyaXB0LnNyYyA9IHVybDtcbiAgc2NyaXB0LmFzeW5jID0gdHJ1ZTtcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3Rvcignc2NyaXB0JykucGFyZW50Tm9kZS5hcHBlbmRDaGlsZChzY3JpcHQpO1xufTtcblxuXG4vLyBEbyB0aGVzZSBjaGVja3Mgb25jZSBhbmQgY2FjaGUgdGhlIHJlc3VsdHNcbihmdW5jdGlvbigpIHtcbiAgdmFyIHRlc3RFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICB2YXIgdGVzdElucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgdmFyIHN0ciA9IG5hdmlnYXRvci51c2VyQWdlbnR8fG5hdmlnYXRvci52ZW5kb3J8fHdpbmRvdy5vcGVyYTtcblxuICBpc01vYmlsZSA9IHN0ci5tYXRjaCgvKEFuZHJvaWR8d2ViT1N8aVBob25lfGlQYWR8aVBvZHxCbGFja0JlcnJ5fFdpbmRvd3MgUGhvbmUpL2kpO1xuICB0ZXN0SW5wdXQuc2V0QXR0cmlidXRlKCd0eXBlJywgJ2RhdGUnKTtcbiAgc3VwcG9ydHNEYXRlSW5wdXQgPSAodGVzdElucHV0LnR5cGUgIT09ICd0ZXh0Jyk7XG5cbiAgLy8gY2xlYW4gdXAgdGVzdGluZyBlbGVtZW50XG4gIHRlc3RFbCA9IG51bGw7XG59KSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFV0aWw7IiwiJ3VzZSBzdHJpY3QnO1xuXG5cbnZhciBVdGlsID0gcmVxdWlyZSgnLi9VdGlsJyk7XG5cblxudmFyIF9DQUxMQkFDS19TRVFVRU5DRSA9IDA7XG5cbi8vIGRlZmF1bHRzIGZvciBqc29ucCBtZXRob2RcbnZhciBfREVGQVVMVF9KU09OUF9PUFRJT05TID0ge1xuICB1cmw6IG51bGwsXG4gIHN1Y2Nlc3M6IG51bGwsXG4gIGVycm9yOiBudWxsLFxuICBkb25lOiBudWxsLFxuICBkYXRhOiBudWxsLFxuICBjYWxsYmFja05hbWU6IG51bGwsXG4gIGNhbGxiYWNrUGFyYW1ldGVyOiAnY2FsbGJhY2snXG59O1xuXG4vLyBkZWZhdWx0cyBmb3IgYWpheCBtZXRob2RcbnZhciBfREVGQVVMVF9BSkFYX09QVElPTlMgPSB7XG4gIHVybDogbnVsbCxcbiAgc3VjY2VzczogbnVsbCxcbiAgZXJyb3I6IG51bGwsXG4gIGRvbmU6IG51bGwsXG4gIG1ldGhvZDogJ0dFVCcsXG4gIGhlYWRlcnM6IG51bGwsXG4gIGRhdGE6IG51bGwsXG4gIHJhd2RhdGE6IG51bGxcbn07XG5cbi8vIEFQSSBNZXRob2QgRGVjbGFyYXRpb25zXG5cbnZhciBhamF4LFxuICAgIGdldENhbGxiYWNrTmFtZSxcbiAgICBqc29ucCxcbiAgICByZXN0cmljdE9yaWdpbixcbiAgICB1cmxFbmNvZGU7XG5cblxuLy8gQVBJIE1ldGhvZCBEZWZpbml0aW9uc1xuXG4vKipcbiAqIE1ha2UgYW4gQUpBWCByZXF1ZXN0LlxuICpcbiAqIEBwYXJhbSBvcHRpb25zLnVybCB7U3RyaW5nfVxuICogICAgICB0aGUgdXJsIHRvIHJlcXVlc3QuXG4gKiBAcGFyYW0gb3B0aW9ucy5zdWNjZXNzIHtGdW5jdGlvbn1cbiAqICAgICAgY2FsbGVkIHdpdGggZGF0YSBsb2FkZWQgYnkgc2NyaXB0XG4gKiBAcGFyYW0gb3B0aW9ucy5lcnJvciB7RnVuY3Rpb259IG9wdGlvbmFsXG4gKiAgICAgIGNhbGxlZCB3aGVuIHNjcmlwdCBmYWlscyB0byBsb2FkXG4gKiBAcGFyYW0gb3B0aW9ucy5kb25lIHtGdW5jdGlvbn1cbiAqICAgICAgICBjYWxsZWQgd2hlbiBhamF4IGlzIGNvbXBsZXRlLCBhZnRlciBzdWNjZXNzIG9yIGVycm9yLlxuICogQHBhcmFtIG9wdGlvbnMubWV0aG9kIHtTdHJpbmd9XG4gKiAgICAgIHJlcXVlc3QgbWV0aG9kLCBkZWZhdWx0IGlzICdHRVQnXG4gKiBAcGFyYW0gb3B0aW9ucy5oZWFkZXJzIHtPYmplY3R9XG4gKiAgICAgIHJlcXVlc3QgaGVhZGVyIG5hbWUgYXMga2V5LCB2YWx1ZSBhcyB2YWx1ZS5cbiAqIEBwYXJhbSBvcHRpb25zLmRhdGEge09iamVjdH1cbiAqICAgICAgcmVxdWVzdCBkYXRhLCBzZW50IHVzaW5nIGNvbnRlbnQgdHlwZVxuICogICAgICAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJy5cbiAqIEBwYXJhbSBvcHRpb25zLnJhd2RhdGEgez99XG4gKiAgICAgIHBhc3NlZCBkaXJlY3RseSB0byBzZW5kIG1ldGhvZCwgd2hlbiBvcHRpb25zLmRhdGEgaXMgbnVsbC5cbiAqICAgICAgQ29udGVudC10eXBlIGhlYWRlciBtdXN0IGFsc28gYmUgc3BlY2lmaWVkLiBEZWZhdWx0IGlzIG51bGwuXG4gKi9cbmFqYXggPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICB2YXIgaCxcbiAgICAgIHBvc3RkYXRhLFxuICAgICAgcXVlcnlTdHJpbmcsXG4gICAgICB1cmwsXG4gICAgICB4aHI7XG5cbiAgb3B0aW9ucyA9IFV0aWwuZXh0ZW5kKHt9LCBfREVGQVVMVF9BSkFYX09QVElPTlMsIG9wdGlvbnMpO1xuICB1cmwgPSBvcHRpb25zLnVybDtcblxuICBpZiAob3B0aW9ucy5yZXN0cmljdE9yaWdpbikge1xuICAgIHVybCA9IHJlc3RyaWN0T3JpZ2luKHVybCk7XG4gIH1cbiAgcG9zdGRhdGEgPSBvcHRpb25zLnJhd2RhdGE7XG5cbiAgaWYgKG9wdGlvbnMuZGF0YSAhPT0gbnVsbCkge1xuICAgIHF1ZXJ5U3RyaW5nID0gdXJsRW5jb2RlKG9wdGlvbnMuZGF0YSk7XG4gICAgaWYgKG9wdGlvbnMubWV0aG9kID09PSAnR0VUJykge1xuICAgICAgLy8gYXBwZW5kIHRvIHVybFxuICAgICAgdXJsID0gdXJsICsgJz8nICsgcXVlcnlTdHJpbmc7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIG90aGVyd2lzZSBzZW5kIGFzIHJlcXVlc3QgYm9keVxuICAgICAgcG9zdGRhdGEgPSBxdWVyeVN0cmluZztcbiAgICAgIGlmIChvcHRpb25zLmhlYWRlcnMgPT09IG51bGwpIHtcbiAgICAgICAgb3B0aW9ucy5oZWFkZXJzID0ge307XG4gICAgICB9XG4gICAgICAvLyBzZXQgcmVxdWVzdCBjb250ZW50IHR5cGVcbiAgICAgIG9wdGlvbnMuaGVhZGVyc1snQ29udGVudC1UeXBlJ10gPSAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJztcbiAgICB9XG4gIH1cblxuICB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblxuICAvLyBzZXR1cCBjYWxsYmFja1xuICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBkYXRhLCBjb250ZW50VHlwZTtcblxuICAgIGlmICh4aHIucmVhZHlTdGF0ZSA9PT0gNCkge1xuICAgICAgaWYgKHhoci5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICBpZiAob3B0aW9ucy5zdWNjZXNzICE9PSBudWxsKSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGRhdGEgPSB4aHIucmVzcG9uc2U7XG4gICAgICAgICAgICBjb250ZW50VHlwZSA9IHhoci5nZXRSZXNwb25zZUhlYWRlcignQ29udGVudC1UeXBlJyk7XG4gICAgICAgICAgICBpZiAoY29udGVudFR5cGUgJiYgY29udGVudFR5cGUuaW5kZXhPZignanNvbicpICE9PSAtMSkge1xuICAgICAgICAgICAgICBkYXRhID0gSlNPTi5wYXJzZShkYXRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG9wdGlvbnMuc3VjY2VzcyhkYXRhLCB4aHIpO1xuICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGlmIChvcHRpb25zLmVycm9yICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgIG9wdGlvbnMuZXJyb3IoZSwgeGhyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChvcHRpb25zLmVycm9yKSB7XG4gICAgICAgICAgb3B0aW9ucy5lcnJvcih4aHIuc3RhdHVzLCB4aHIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAob3B0aW9ucy5kb25lICE9PSBudWxsKSB7XG4gICAgICAgIG9wdGlvbnMuZG9uZSh4aHIpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICAvLyBvcGVuIHJlcXVlc3RcbiAgeGhyLm9wZW4ob3B0aW9ucy5tZXRob2QsIHVybCwgdHJ1ZSk7XG5cbiAgLy8gc2VuZCBoZWFkZXJzXG4gIGlmIChvcHRpb25zLmhlYWRlcnMgIT09IG51bGwpIHtcbiAgICBmb3IgKGggaW4gb3B0aW9ucy5oZWFkZXJzKSB7XG4gICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihoLCBvcHRpb25zLmhlYWRlcnNbaF0pO1xuICAgIH1cbiAgfVxuXG4gIC8vIHNlbmQgZGF0YVxuICB4aHIuc2VuZChwb3N0ZGF0YSk7XG5cbiAgcmV0dXJuIHhocjtcbn07XG5cbi8qKlxuICogR2VuZXJhdGUgYSB1bmlxdWUgY2FsbGJhY2sgbmFtZS5cbiAqXG4gKiBAcmV0dXJuIGEgdW5pcXVlIGNhbGxiYWNrIG5hbWUuXG4gKi9cbmdldENhbGxiYWNrTmFtZSA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuICdfeGhyX2NhbGxiYWNrXycgKyBuZXcgRGF0ZSgpLmdldFRpbWUoKSArXG4gICAgICAnXycgKyAoKytfQ0FMTEJBQ0tfU0VRVUVOQ0UpO1xufTtcblxuLyoqXG4gKiBNYWtlIGEgSlNPTlAgcmVxdWVzdC5cbiAqXG4gKiBAcGFyYW0gb3B0aW9ucy51cmwge1N0cmluZ31cbiAqICAgICAgdXJsIHRvIGxvYWRcbiAqIEBwYXJhbSBvcHRpb25zLnN1Y2Nlc3Mge0Z1bmN0aW9ufVxuICogICAgICBjYWxsZWQgd2l0aCBkYXRhIGxvYWRlZCBieSBzY3JpcHRcbiAqIEBwYXJhbSBvcHRpb25zLmVycm9yIHtGdW5jdGlvbn0gb3B0aW9uYWxcbiAqICAgICAgY2FsbGVkIHdoZW4gc2NyaXB0IGZhaWxzIHRvIGxvYWRcbiAqIEBwYXJhbSBvcHRpb25zLmRvbmUge0Z1bmN0aW9ufSBvcHRpb25hbFxuICogICAgICAgIGNhbGxlZCB3aGVuIGpzb25wIGlzIGNvbXBsZXRlLCBhZnRlciBzdWNjZXNzIG9yIGVycm9yLlxuICogQHBhcmFtIG9wdGlvbnMuZGF0YSB7T2JqZWN0fSBvcHRpb25hbFxuICogICAgICByZXF1ZXN0IHBhcmFtZXRlcnMgdG8gYWRkIHRvIHVybFxuICpcbiAqIEBwYXJhbSBvcHRpb25zLmNhbGxiYWNrTmFtZSB7U3RyaW5nfSBvcHRpb25hbFxuICogQHBhcmFtIG9wdGlvbnMuY2FsbGJhY2tQYXJhbWV0ZXIge1N0cmluZ30gb3B0aW9uYWxcbiAqICAgICAgZGVmYXVsdCBpcyAnY2FsbGJhY2snXG4gKi9cbmpzb25wID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgdmFyIGRhdGEsXG4gICAgICBjYWxsYmFjayxcbiAgICAgIHVybDtcblxuICBvcHRpb25zID0gVXRpbC5leHRlbmQoe30sIF9ERUZBVUxUX0pTT05QX09QVElPTlMsIG9wdGlvbnMpO1xuICB1cmwgPSBvcHRpb25zLnVybDtcbiAgZGF0YSA9IFV0aWwuZXh0ZW5kKHt9LCBvcHRpb25zLmRhdGEpO1xuICBjYWxsYmFjayA9IG9wdGlvbnMuY2FsbGJhY2tOYW1lIHx8IGdldENhbGxiYWNrTmFtZSgpO1xuXG4gIC8vIGFkZCBkYXRhIGFuZCBjYWxsYmFjayB0byB1cmxcbiAgZGF0YVtvcHRpb25zLmNhbGxiYWNrUGFyYW1ldGVyXSA9IGNhbGxiYWNrO1xuICB1cmwgKz0gKHVybC5pbmRleE9mKCc/JykgPT09IC0xID8gJz8nIDogJyYnKSArIHVybEVuY29kZShkYXRhKTtcblxuICAvLyBzZXR1cCBnbG9iYWwgY2FsbGJhY2sgY2FsbGVkIGJ5IHNjcmlwdFxuICB3aW5kb3dbY2FsbGJhY2tdID0gZnVuY3Rpb24gKCkge1xuICAgIG9wdGlvbnMuc3VjY2Vzcy5hcHBseShudWxsLCBhcmd1bWVudHMpO1xuICB9O1xuXG4gIFV0aWwubG9hZFNjcmlwdCh1cmwsIHtcbiAgICBlcnJvcjogb3B0aW9ucy5lcnJvcixcbiAgICBkb25lOiBmdW5jdGlvbiAoKSB7XG4gICAgICB3aW5kb3dbY2FsbGJhY2tdID0gbnVsbDtcbiAgICAgIGRlbGV0ZSB3aW5kb3dbY2FsbGJhY2tdO1xuXG4gICAgICBpZiAob3B0aW9ucy5kb25lICE9PSBudWxsKSB7XG4gICAgICAgIG9wdGlvbnMuZG9uZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG59O1xuXG5yZXN0cmljdE9yaWdpbiA9IGZ1bmN0aW9uICh1cmwpIHtcbiAgdmFyIGEsXG4gICAgICByZXN0cmljdGVkVXJsO1xuXG4gIGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7IC8vIEhhY2sgdG8gcGFyc2Ugb25seSB0aGUgcGF0aG5hbWVcbiAgYS5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCB1cmwpO1xuICByZXN0cmljdGVkVXJsID0gYS5wYXRobmFtZTtcblxuICAvLyBOZWVkZWQgZm9yIElFLCB3aGljaCBvbWl0cyBsZWFkaW5nIHNsYXNoLlxuICBpZiAoKHVybC5pbmRleE9mKCdodHRwJykgPT09IDAgfHwgdXJsLmluZGV4T2YoJy8nKSA9PT0gMCkgJiZcbiAgICAgIHJlc3RyaWN0ZWRVcmwuaW5kZXhPZignLycpICE9PSAwKSB7XG4gICAgcmVzdHJpY3RlZFVybCA9ICcvJyArIHJlc3RyaWN0ZWRVcmw7XG4gIH1cblxuICByZXR1cm4gcmVzdHJpY3RlZFVybDtcbn07XG5cbi8qKlxuICogVVJMIGVuY29kZSBhbiBvYmplY3QuXG4gKlxuICogQHBhcmFtIG9iaiB7T2JqZWN0fVxuICogICAgICBvYmplY3QgdG8gZW5jb2RlXG4gKlxuICogQHJldHVybiB7U3RyaW5nfVxuICogICAgICB1cmwgZW5jb2RlZCBvYmplY3RcbiAqL1xudXJsRW5jb2RlID0gZnVuY3Rpb24gKG9iaikge1xuICB2YXIgZGF0YSwga2V5LCBlbmNvZGVkS2V5LCB2YWx1ZSwgaSwgbGVuO1xuXG4gIGRhdGEgPSBbXTtcbiAgZm9yIChrZXkgaW4gb2JqKSB7XG4gICAgZW5jb2RlZEtleSA9IGVuY29kZVVSSUNvbXBvbmVudChrZXkpO1xuICAgIHZhbHVlID0gb2JqW2tleV07XG5cbiAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgLy8gQWRkIGVhY2ggdmFsdWUgaW4gYXJyYXkgc2VwZXJhdGVseVxuICAgICAgZm9yIChpID0gMCwgbGVuID0gdmFsdWUubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgZGF0YS5wdXNoKGVuY29kZWRLZXkgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQodmFsdWVbaV0pKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZGF0YS5wdXNoKGVuY29kZWRLZXkgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQodmFsdWUpKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGRhdGEuam9pbignJicpO1xufTtcblxuXG4vLyBleHBvc2UgdGhlIEFQSVxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGFqYXg6IGFqYXgsXG4gIGdldENhbGxiYWNrTmFtZTogZ2V0Q2FsbGJhY2tOYW1lLFxuICBqc29ucDoganNvbnAsXG4gIHJlc3RyaWN0T3JpZ2luOiByZXN0cmljdE9yaWdpbixcbiAgdXJsRW5jb2RlOiB1cmxFbmNvZGUsXG59OyJdfQ==
