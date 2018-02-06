(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"../util/Events":3,"../util/Util":4}],2:[function(require,module,exports){
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

},{"../util/Events":3,"../util/Util":4,"./Model":1}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
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
},{}],5:[function(require,module,exports){
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
},{"./Util":4}],6:[function(require,module,exports){
/* global window */
'use strict';

var App = require('shakemap-view/App'),
    ShakeMapModel = require('shakemap-view/ShakeMapModel');

var app = window.App = App({
    el: document.querySelector('#shakemapView'),
    model: ShakeMapModel()
});
app.model.trigger('change');

},{"shakemap-view/App":7,"shakemap-view/ShakeMapModel":8}],7:[function(require,module,exports){
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

},{"hazdev-webutils/src/mvc/View":2,"hazdev-webutils/src/util/Util":4,"shakemap-view/events/EventsView":9,"shakemap-view/loading/LoadingView":10,"shakemap-view/maps/MapView":11}],8:[function(require,module,exports){
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

},{"hazdev-webutils/src/mvc/Model":1,"hazdev-webutils/src/util/Util":4}],9:[function(require,module,exports){
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

},{"hazdev-webutils/src/mvc/View":2,"util/Xhr":5}],10:[function(require,module,exports){
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

},{"hazdev-webutils/src/mvc/View":2}],11:[function(require,module,exports){
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

},{"hazdev-webutils/src/mvc/View":2,"shakemap-view/maps/layers/Generator":12}],12:[function(require,module,exports){
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

},{"hazdev-webutils/src/mvc/View":2,"shakemap-view/maps/layers/cont_pga":13,"shakemap-view/maps/layers/epicenter":14,"shakemap-view/maps/layers/events":15}],13:[function(require,module,exports){
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

},{"shakemap-view/maps/layers/events":15,"util/Xhr":5}],14:[function(require,module,exports){
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

},{"shakemap-view/maps/layers/events":15,"util/Xhr":5}],15:[function(require,module,exports){
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

},{}]},{},[6])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvaGF6ZGV2LXdlYnV0aWxzL3NyYy9tdmMvTW9kZWwuanMiLCJub2RlX21vZHVsZXMvaGF6ZGV2LXdlYnV0aWxzL3NyYy9tdmMvVmlldy5qcyIsIm5vZGVfbW9kdWxlcy9oYXpkZXYtd2VidXRpbHMvc3JjL3V0aWwvRXZlbnRzLmpzIiwibm9kZV9tb2R1bGVzL2hhemRldi13ZWJ1dGlscy9zcmMvdXRpbC9VdGlsLmpzIiwibm9kZV9tb2R1bGVzL2hhemRldi13ZWJ1dGlscy9zcmMvdXRpbC9YaHIuanMiLCJzcmMvaHRkb2NzL2pzL2luZGV4LmpzIiwic3JjL2h0ZG9jcy9qcy9zaGFrZW1hcC12aWV3L0FwcC5qcyIsInNyYy9odGRvY3MvanMvc2hha2VtYXAtdmlldy9TaGFrZU1hcE1vZGVsLmpzIiwic3JjL2h0ZG9jcy9qcy9zaGFrZW1hcC12aWV3L2V2ZW50cy9FdmVudHNWaWV3LmpzIiwic3JjL2h0ZG9jcy9qcy9zaGFrZW1hcC12aWV3L2xvYWRpbmcvTG9hZGluZ1ZpZXcuanMiLCJzcmMvaHRkb2NzL2pzL3NoYWtlbWFwLXZpZXcvbWFwcy9NYXBWaWV3LmpzIiwic3JjL2h0ZG9jcy9qcy9zaGFrZW1hcC12aWV3L21hcHMvbGF5ZXJzL0dlbmVyYXRvci5qcyIsInNyYy9odGRvY3MvanMvc2hha2VtYXAtdmlldy9tYXBzL2xheWVycy9jb250X3BnYS5qcyIsInNyYy9odGRvY3MvanMvc2hha2VtYXAtdmlldy9tYXBzL2xheWVycy9lcGljZW50ZXIuanMiLCJzcmMvaHRkb2NzL2pzL3NoYWtlbWFwLXZpZXcvbWFwcy9sYXllcnMvZXZlbnRzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDak1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaFdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QUNILENBSEQ7O0FBS0EsSUFBSSxTQUFTLEVBQUMscUJBQXFCLG1CQUF0QjtBQUNULHdCQUFvQixrQkFEWCxFQUFiOztBQUdBLE9BQU8sT0FBUCxHQUFpQixNQUFqQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG5cbnZhciBFdmVudHMgPSByZXF1aXJlKCcuLi91dGlsL0V2ZW50cycpLFxuICAgIFV0aWwgPSByZXF1aXJlKCcuLi91dGlsL1V0aWwnKTtcblxuLyoqXG4gKiBDb25zdHJ1Y3RvclxuICpcbiAqIEBwYXJhbSBkYXRhIHtPYmplY3R9XG4gKiAgICAgIGtleS92YWx1ZSBhdHRyaWJ1dGVzIG9mIHRoaXMgbW9kZWwuXG4gKi9cbnZhciBNb2RlbCA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gIHZhciBfdGhpcyxcbiAgICAgIF9pbml0aWFsaXplLFxuXG4gICAgICBfbW9kZWw7XG5cblxuICBfdGhpcyA9IEV2ZW50cygpO1xuXG4gIF9pbml0aWFsaXplID0gZnVuY3Rpb24gKCkge1xuICAgIF9tb2RlbCA9IFV0aWwuZXh0ZW5kKHt9LCBkYXRhKTtcblxuICAgIC8vIHRyYWNrIGlkIGF0IHRvcCBsZXZlbFxuICAgIGlmIChkYXRhICYmIGRhdGEuaGFzT3duUHJvcGVydHkoJ2lkJykpIHtcbiAgICAgIF90aGlzLmlkID0gZGF0YS5pZDtcbiAgICB9XG5cbiAgICBkYXRhID0gbnVsbDtcbiAgfTtcblxuICAvKipcbiAgICogR2V0IG9uZSBvciBtb3JlIHZhbHVlcy5cbiAgICpcbiAgICogQHBhcmFtIGtleSB7U3RyaW5nfVxuICAgKiAgICAgIHRoZSB2YWx1ZSB0byBnZXQ7IHdoZW4ga2V5IGlzIHVuZGVmaW5lZCwgcmV0dXJucyB0aGUgb2JqZWN0IHdpdGggYWxsXG4gICAqICAgICAgdmFsdWVzLlxuICAgKiBAcmV0dXJuXG4gICAqICAgICAgLSBpZiBrZXkgaXMgc3BlY2lmaWVkLCB0aGUgdmFsdWUgb3IgbnVsbCBpZiBubyB2YWx1ZSBleGlzdHMuXG4gICAqICAgICAgLSB3aGVuIGtleSBpcyBub3Qgc3BlY2lmaWVkLCB0aGUgdW5kZXJseWluZyBvYmplY3QgaXMgcmV0dXJuZWQuXG4gICAqICAgICAgICAoQW55IGNoYW5nZXMgdG8gdGhpcyB1bmRlcmx5aW5nIG9iamVjdCB3aWxsIG5vdCB0cmlnZ2VyIGV2ZW50cyEhISlcbiAgICovXG4gIF90aGlzLmdldCA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICBpZiAodHlwZW9mKGtleSkgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICByZXR1cm4gX21vZGVsO1xuICAgIH1cblxuICAgIGlmIChfbW9kZWwuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgcmV0dXJuIF9tb2RlbFtrZXldO1xuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9O1xuXG4gIC8qKlxuICAgKiBVcGRhdGUgb25lIG9yIG1vcmUgdmFsdWVzLlxuICAgKlxuICAgKiBAcGFyYW0gZGF0YSB7T2JqZWN0fVxuICAgKiAgICAgIHRoZSBrZXlzIGFuZCB2YWx1ZXMgdG8gdXBkYXRlLlxuICAgKiBAcGFyYW0gb3B0aW9ucyB7T2JqZWN0fVxuICAgKiAgICAgIG9wdGlvbnMgZm9yIHRoaXMgbWV0aG9kLlxuICAgKiBAcGFyYW0gb3B0aW9ucy5zaWxlbnQge0Jvb2xlYW59XG4gICAqICAgICAgZGVmYXVsdCBmYWxzZS4gdHJ1ZSB0byBzdXBwcmVzcyBhbnkgZXZlbnRzIHRoYXQgd291bGQgb3RoZXJ3aXNlIGJlXG4gICAqICAgICAgdHJpZ2dlcmVkLlxuICAgKi9cbiAgX3RoaXMuc2V0ID0gZnVuY3Rpb24gKGRhdGEsIG9wdGlvbnMpIHtcbiAgICAvLyBkZXRlY3QgY2hhbmdlc1xuICAgIHZhciBjaGFuZ2VkID0ge30sXG4gICAgICBhbnlDaGFuZ2VkID0gZmFsc2UsXG4gICAgICBjO1xuXG4gICAgZm9yIChjIGluIGRhdGEpIHtcbiAgICAgIGlmICghX21vZGVsLmhhc093blByb3BlcnR5KGMpIHx8IF9tb2RlbFtjXSAhPT0gZGF0YVtjXSkge1xuICAgICAgICBjaGFuZ2VkW2NdID0gZGF0YVtjXTtcbiAgICAgICAgYW55Q2hhbmdlZCA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gcGVyc2lzdCBjaGFuZ2VzXG4gICAgX21vZGVsID0gVXRpbC5leHRlbmQoX21vZGVsLCBkYXRhKTtcblxuICAgIC8vIGlmIGlkIGlzIGNoYW5naW5nLCB1cGRhdGUgdGhlIG1vZGVsIGlkXG4gICAgaWYgKGRhdGEgJiYgZGF0YS5oYXNPd25Qcm9wZXJ0eSgnaWQnKSkge1xuICAgICAgX3RoaXMuaWQgPSBkYXRhLmlkO1xuICAgIH1cblxuICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMuaGFzT3duUHJvcGVydHkoJ3NpbGVudCcpICYmIG9wdGlvbnMuc2lsZW50KSB7XG4gICAgICAvLyBkb24ndCB0cmlnZ2VyIGFueSBldmVudHNcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyB0cmlnZ2VyIGV2ZW50cyBiYXNlZCBvbiBjaGFuZ2VzXG4gICAgaWYgKGFueUNoYW5nZWQgfHxcbiAgICAgICAgKG9wdGlvbnMgJiYgb3B0aW9ucy5oYXNPd25Qcm9wZXJ0eSgnZm9yY2UnKSAmJiBvcHRpb25zLmZvcmNlKSkge1xuICAgICAgZm9yIChjIGluIGNoYW5nZWQpIHtcbiAgICAgICAgLy8gZXZlbnRzIHNwZWNpZmljIHRvIGEgcHJvcGVydHlcbiAgICAgICAgX3RoaXMudHJpZ2dlcignY2hhbmdlOicgKyBjLCBjaGFuZ2VkW2NdKTtcbiAgICAgIH1cbiAgICAgIC8vIGdlbmVyaWMgZXZlbnQgZm9yIGFueSBjaGFuZ2VcbiAgICAgIF90aGlzLnRyaWdnZXIoJ2NoYW5nZScsIGNoYW5nZWQpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogT3ZlcnJpZGUgdG9KU09OIG1ldGhvZCB0byBzZXJpYWxpemUgb25seSBtb2RlbCBkYXRhLlxuICAgKi9cbiAgX3RoaXMudG9KU09OID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBqc29uID0gVXRpbC5leHRlbmQoe30sIF9tb2RlbCksXG4gICAgICAgIGtleSxcbiAgICAgICAgdmFsdWU7XG5cbiAgICBmb3IgKGtleSBpbiBqc29uKSB7XG4gICAgICB2YWx1ZSA9IGpzb25ba2V5XTtcblxuICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiZcbiAgICAgICAgICB2YWx1ZSAhPT0gbnVsbCAmJlxuICAgICAgICAgIHR5cGVvZiB2YWx1ZS50b0pTT04gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAganNvbltrZXldID0gdmFsdWUudG9KU09OKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGpzb247XG4gIH07XG5cblxuICBfaW5pdGlhbGl6ZSgpO1xuICByZXR1cm4gX3RoaXM7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1vZGVsO1xuIiwiJ3VzZSBzdHJpY3QnO1xuLyoqXG4gKiBBIGxpZ2h0d2VpZ2h0IHZpZXcgY2xhc3MuXG4gKlxuICogUHJpbWFyaWx5IG1hbmFnZXMgYW4gZWxlbWVudCB3aGVyZSBhIHZpZXcgY2FuIHJlbmRlciBpdHMgZGF0YS5cbiAqL1xuXG5cbnZhciBNb2RlbCA9IHJlcXVpcmUoJy4vTW9kZWwnKSxcblxuICAgIEV2ZW50cyA9IHJlcXVpcmUoJy4uL3V0aWwvRXZlbnRzJyksXG4gICAgVXRpbCA9IHJlcXVpcmUoJy4uL3V0aWwvVXRpbCcpO1xuXG5cbnZhciBfREVGQVVMVFMgPSB7XG59O1xuXG5cbi8qKiBjcmVhdGUgYSBuZXcgdmlldy4gKi9cbnZhciBWaWV3ID0gZnVuY3Rpb24gKHBhcmFtcykge1xuICB2YXIgX3RoaXMsXG4gICAgICBfaW5pdGlhbGl6ZSxcblxuICAgICAgX2Rlc3Ryb3lNb2RlbDtcblxuXG4gIF90aGlzID0gRXZlbnRzKCk7XG5cbiAgLyoqXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKlxuICAgKi9cbiAgX2luaXRpYWxpemUgPSBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgcGFyYW1zID0gVXRpbC5leHRlbmQoe30sIF9ERUZBVUxUUywgcGFyYW1zKTtcblxuICAgIC8vIEVsZW1lbnQgd2hlcmUgdGhpcyB2aWV3IGlzIHJlbmRlcmVkXG4gICAgX3RoaXMuZWwgPSAocGFyYW1zICYmIHBhcmFtcy5oYXNPd25Qcm9wZXJ0eSgnZWwnKSkgP1xuICAgICAgICBwYXJhbXMuZWwgOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblxuICAgIF90aGlzLm1vZGVsID0gcGFyYW1zLm1vZGVsO1xuXG4gICAgaWYgKCFfdGhpcy5tb2RlbCkge1xuICAgICAgX3RoaXMubW9kZWwgPSBNb2RlbCh7fSk7XG4gICAgICBfZGVzdHJveU1vZGVsID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBfdGhpcy5tb2RlbC5vbignY2hhbmdlJywgJ3JlbmRlcicsIF90aGlzKTtcbiAgfTtcblxuXG4gIC8qKlxuICAgKiBBUEkgTWV0aG9kXG4gICAqXG4gICAqIFJlbmRlcnMgdGhlIHZpZXdcbiAgICovXG4gIF90aGlzLnJlbmRlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAvLyBJbXBlbGVtZW50YXRpb25zIHNob3VsZCB1cGRhdGUgdGhlIHZpZXcgYmFzZWQgb24gdGhlIGN1cnJlbnRcbiAgICAvLyBtb2RlbCBwcm9wZXJ0aWVzLlxuICB9O1xuXG4gIC8qKlxuICAgKiBBUEkgTWV0aG9kXG4gICAqXG4gICAqIENsZWFucyB1cCByZXNvdXJjZXMgYWxsb2NhdGVkIGJ5IHRoZSB2aWV3LiBTaG91bGQgYmUgY2FsbGVkIGJlZm9yZVxuICAgKiBkaXNjYXJkaW5nIGEgdmlldy5cbiAgICovXG4gIF90aGlzLmRlc3Ryb3kgPSBVdGlsLmNvbXBvc2UoZnVuY3Rpb24gKCkge1xuICAgIGlmIChfdGhpcyA9PT0gIG51bGwpIHtcbiAgICAgIHJldHVybjsgLy8gYWxyZWFkeSBkZXN0cm95ZWRcbiAgICB9XG5cbiAgICBfdGhpcy5tb2RlbC5vZmYoJ2NoYW5nZScsICdyZW5kZXInLCBfdGhpcyk7XG5cbiAgICBpZiAoX2Rlc3Ryb3lNb2RlbCkge1xuICAgICAgX3RoaXMubW9kZWwuZGVzdHJveSgpO1xuICAgIH1cblxuICAgIF9kZXN0cm95TW9kZWwgPSBudWxsO1xuXG4gICAgX3RoaXMubW9kZWwgPSBudWxsO1xuICAgIF90aGlzLmVsID0gbnVsbDtcblxuICAgIF9pbml0aWFsaXplID0gbnVsbDtcbiAgICBfdGhpcyA9IG51bGw7XG4gIH0sIF90aGlzLmRlc3Ryb3kpO1xuXG5cbiAgX2luaXRpYWxpemUocGFyYW1zKTtcbiAgcGFyYW1zID0gbnVsbDtcbiAgcmV0dXJuIF90aGlzO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgX19JTlNUQU5DRV9fID0gbnVsbDtcblxuXG52YXIgX19pc19zdHJpbmcgPSBmdW5jdGlvbiAob2JqKSB7XG4gIHJldHVybiAodHlwZW9mIG9iaiA9PT0gJ3N0cmluZycgfHwgb2JqIGluc3RhbmNlb2YgU3RyaW5nKTtcbn07XG5cblxudmFyIEV2ZW50cyA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIF90aGlzLFxuICAgICAgX2luaXRpYWxpemUsXG5cbiAgICAgIF9saXN0ZW5lcnM7XG5cblxuICBfdGhpcyA9IHt9O1xuXG4gIF9pbml0aWFsaXplID0gZnVuY3Rpb24gKCkge1xuICAgIC8vIG1hcCBvZiBsaXN0ZW5lcnMgYnkgZXZlbnQgdHlwZVxuICAgIF9saXN0ZW5lcnMgPSB7fTtcbiAgfTtcblxuXG4gIC8qKlxuICAgKiBGcmVlIGFsbCByZWZlcmVuY2VzLlxuICAgKi9cbiAgX3RoaXMuZGVzdHJveSA9IGZ1bmN0aW9uICgpIHtcbiAgICBfaW5pdGlhbGl6ZSA9IG51bGw7XG4gICAgX2xpc3RlbmVycyA9IG51bGw7XG4gICAgX3RoaXMgPSBudWxsO1xuICB9O1xuXG4gIC8qKlxuICAgKiBSZW1vdmUgYW4gZXZlbnQgbGlzdGVuZXJcbiAgICpcbiAgICogT21pdHRpbmcgY2FsbGJhY2sgY2xlYXJzIGFsbCBsaXN0ZW5lcnMgZm9yIGdpdmVuIGV2ZW50LlxuICAgKiBPbWl0dGluZyBldmVudCBjbGVhcnMgYWxsIGxpc3RlbmVycyBmb3IgYWxsIGV2ZW50cy5cbiAgICpcbiAgICogQHBhcmFtIGV2ZW50IHtTdHJpbmd9XG4gICAqICAgICAgZXZlbnQgbmFtZSB0byB1bmJpbmQuXG4gICAqIEBwYXJhbSBjYWxsYmFjayB7RnVuY3Rpb259XG4gICAqICAgICAgY2FsbGJhY2sgdG8gdW5iaW5kLlxuICAgKiBAcGFyYW0gY29udGV4dCB7T2JqZWN0fVxuICAgKiAgICAgIGNvbnRleHQgZm9yIFwidGhpc1wiIHdoZW4gY2FsbGJhY2sgaXMgY2FsbGVkXG4gICAqL1xuICBfdGhpcy5vZmYgPSBmdW5jdGlvbiAoZXZ0LCBjYWxsYmFjaywgY29udGV4dCkge1xuICAgIHZhciBpO1xuXG4gICAgaWYgKHR5cGVvZiBldnQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAvLyByZW1vdmluZyBhbGwgbGlzdGVuZXJzIG9uIHRoaXMgb2JqZWN0XG4gICAgICBfbGlzdGVuZXJzID0gbnVsbDtcbiAgICAgIF9saXN0ZW5lcnMgPSB7fTtcbiAgICB9IGVsc2UgaWYgKCFfbGlzdGVuZXJzLmhhc093blByb3BlcnR5KGV2dCkpIHtcbiAgICAgIC8vIG5vIGxpc3RlbmVycywgbm90aGluZyB0byBkb1xuICAgICAgcmV0dXJuO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGNhbGxiYWNrID09PSAndW5kZWZpbmVkJykge1xuICAgICAgLy8gcmVtb3ZpbmcgYWxsIGxpc3RlbmVycyBmb3IgdGhpcyBldmVudFxuICAgICAgZGVsZXRlIF9saXN0ZW5lcnNbZXZ0XTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGxpc3RlbmVyID0gbnVsbDtcblxuICAgICAgLy8gc2VhcmNoIGZvciBjYWxsYmFjayB0byByZW1vdmVcbiAgICAgIGZvciAoaSA9IF9saXN0ZW5lcnNbZXZ0XS5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICBsaXN0ZW5lciA9IF9saXN0ZW5lcnNbZXZ0XVtpXTtcblxuICAgICAgICBpZiAobGlzdGVuZXIuY2FsbGJhY2sgPT09IGNhbGxiYWNrICYmXG4gICAgICAgICAgICAoIWNvbnRleHQgfHwgbGlzdGVuZXIuY29udGV4dCA9PT0gY29udGV4dCkpIHtcblxuICAgICAgICAgIC8vIGZvdW5kIGNhbGxiYWNrLCByZW1vdmVcbiAgICAgICAgICBfbGlzdGVuZXJzW2V2dF0uc3BsaWNlKGksMSk7XG5cbiAgICAgICAgICBpZiAoY29udGV4dCkge1xuICAgICAgICAgICAgLy8gZm91bmQgY2FsbGJhY2sgd2l0aCBjb250ZXh0LCBzdG9wIHNlYXJjaGluZ1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIGNsZWFudXAgaWYgbGFzdCBjYWxsYmFjayBvZiB0aGlzIHR5cGVcbiAgICAgIGlmIChfbGlzdGVuZXJzW2V2dF0ubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGRlbGV0ZSBfbGlzdGVuZXJzW2V2dF07XG4gICAgICB9XG5cbiAgICAgIGxpc3RlbmVyID0gbnVsbDtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIEFkZCBhbiBldmVudCBsaXN0ZW5lclxuICAgKlxuICAgKiBAcGFyYW0gZXZlbnQge1N0cmluZ31cbiAgICogICAgICBldmVudCBuYW1lIChzaW5ndWxhcikuICBFLmcuICdyZXNldCdcbiAgICogQHBhcmFtIGNhbGxiYWNrIHtGdW5jdGlvbn1cbiAgICogICAgICBmdW5jdGlvbiB0byBjYWxsIHdoZW4gZXZlbnQgaXMgdHJpZ2dlcmVkLlxuICAgKiBAcGFyYW0gY29udGV4dCB7T2JqZWN0fVxuICAgKiAgICAgIGNvbnRleHQgZm9yIFwidGhpc1wiIHdoZW4gY2FsbGJhY2sgaXMgY2FsbGVkXG4gICAqL1xuICBfdGhpcy5vbiA9IGZ1bmN0aW9uIChldmVudCwgY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICBpZiAoISgoY2FsbGJhY2sgfHwgIWNhbGxiYWNrLmFwcGx5KSB8fFxuICAgICAgICAoY29udGV4dCAmJiBfX2lzX3N0cmluZyhjYWxsYmFjaykgJiYgY29udGV4dFtjYWxsYmFja10uYXBwbHkpKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYWxsYmFjayBwYXJhbWV0ZXIgaXMgbm90IGNhbGxhYmxlLicpO1xuICAgIH1cblxuICAgIGlmICghX2xpc3RlbmVycy5oYXNPd25Qcm9wZXJ0eShldmVudCkpIHtcbiAgICAgIC8vIGZpcnN0IGxpc3RlbmVyIGZvciBldmVudCB0eXBlXG4gICAgICBfbGlzdGVuZXJzW2V2ZW50XSA9IFtdO1xuICAgIH1cblxuICAgIC8vIGFkZCBsaXN0ZW5lclxuICAgIF9saXN0ZW5lcnNbZXZlbnRdLnB1c2goe1xuICAgICAgY2FsbGJhY2s6IGNhbGxiYWNrLFxuICAgICAgY29udGV4dDogY29udGV4dFxuICAgIH0pO1xuICB9O1xuXG4gIC8qKlxuICAgKiBUcmlnZ2VyIGFuIGV2ZW50XG4gICAqXG4gICAqIEBwYXJhbSBldmVudCB7U3RyaW5nfVxuICAgKiAgICAgIGV2ZW50IG5hbWUuXG4gICAqIEBwYXJhbSBhcmdzIHvigKZ9XG4gICAqICAgICAgdmFyaWFibGUgbGVuZ3RoIGFyZ3VtZW50cyBhZnRlciBldmVudCBhcmUgcGFzc2VkIHRvIGxpc3RlbmVycy5cbiAgICovXG4gIF90aGlzLnRyaWdnZXIgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICB2YXIgYXJncyxcbiAgICAgICAgaSxcbiAgICAgICAgbGVuLFxuICAgICAgICBsaXN0ZW5lcixcbiAgICAgICAgbGlzdGVuZXJzO1xuXG4gICAgaWYgKF9saXN0ZW5lcnMuaGFzT3duUHJvcGVydHkoZXZlbnQpKSB7XG5cbiAgICAgIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgICAgbGlzdGVuZXJzID0gX2xpc3RlbmVyc1tldmVudF0uc2xpY2UoMCk7XG5cbiAgICAgIGZvciAoaSA9IDAsIGxlbiA9IGxpc3RlbmVycy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBsaXN0ZW5lciA9IGxpc3RlbmVyc1tpXTtcblxuICAgICAgICAvLyBOT1RFOiBpZiBsaXN0ZW5lciB0aHJvd3MgZXhjZXB0aW9uLCB0aGlzIHdpbGwgc3RvcC4uLlxuICAgICAgICBpZiAoX19pc19zdHJpbmcobGlzdGVuZXIuY2FsbGJhY2spKSB7XG4gICAgICAgICAgbGlzdGVuZXIuY29udGV4dFtsaXN0ZW5lci5jYWxsYmFja10uYXBwbHkobGlzdGVuZXIuY29udGV4dCwgYXJncyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbGlzdGVuZXIuY2FsbGJhY2suYXBwbHkobGlzdGVuZXIuY29udGV4dCwgYXJncyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgX2luaXRpYWxpemUoKTtcbiAgcmV0dXJuIF90aGlzO1xufTtcblxuLy8gbWFrZSBFdmVudHMgYSBnbG9iYWwgZXZlbnQgc291cmNlXG5fX0lOU1RBTkNFX18gPSBFdmVudHMoKTtcbkV2ZW50cy5vbiA9IGZ1bmN0aW9uIF9ldmVudHNfb24gKCkge1xuICByZXR1cm4gX19JTlNUQU5DRV9fLm9uLmFwcGx5KF9fSU5TVEFOQ0VfXywgYXJndW1lbnRzKTtcbn07XG5FdmVudHMub2ZmID0gZnVuY3Rpb24gX2V2ZW50c19vZmYgKCkge1xuICByZXR1cm4gX19JTlNUQU5DRV9fLm9mZi5hcHBseShfX0lOU1RBTkNFX18sIGFyZ3VtZW50cyk7XG59O1xuRXZlbnRzLnRyaWdnZXIgPSBmdW5jdGlvbiBfZXZlbnRzX3RyaWdnZXIgKCkge1xuICByZXR1cm4gX19JTlNUQU5DRV9fLnRyaWdnZXIuYXBwbHkoX19JTlNUQU5DRV9fLCBhcmd1bWVudHMpO1xufTtcblxuLy8gaW50ZXJjZXB0IHdpbmRvdy5vbmhhc2hjaGFuZ2UgZXZlbnRzLCBvciBzaW11bGF0ZSBpZiBicm93c2VyIGRvZXNuJ3Rcbi8vIHN1cHBvcnQsIGFuZCBzZW5kIHRvIGdsb2JhbCBFdmVudHMgb2JqZWN0XG52YXIgX29uSGFzaENoYW5nZSA9IGZ1bmN0aW9uIChlKSB7XG4gIEV2ZW50cy50cmlnZ2VyKCdoYXNoY2hhbmdlJywgZSk7XG59O1xuXG4vLyBjb3VydGVzeSBvZjpcbi8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvOTMzOTg2NS9nZXQtdGhlLWhhc2hjaGFuZ2UtZXZlbnQtdG8td29yay1pbi1hbGwtYnJvd3NlcnMtaW5jbHVkaW5nLWllN1xuaWYgKCEoJ29uaGFzaGNoYW5nZScgaW4gd2luZG93KSkge1xuICB2YXIgb2xkSHJlZiA9IGRvY3VtZW50LmxvY2F0aW9uLmhhc2g7XG5cbiAgc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICAgIGlmIChvbGRIcmVmICE9PSBkb2N1bWVudC5sb2NhdGlvbi5oYXNoKSB7XG4gICAgICBvbGRIcmVmID0gZG9jdW1lbnQubG9jYXRpb24uaGFzaDtcbiAgICAgIF9vbkhhc2hDaGFuZ2Uoe1xuICAgICAgICAndHlwZSc6ICdoYXNoY2hhbmdlJyxcbiAgICAgICAgJ25ld1VSTCc6IGRvY3VtZW50LmxvY2F0aW9uLmhhc2gsXG4gICAgICAgICdvbGRVUkwnOiBvbGRIcmVmXG4gICAgICB9KTtcbiAgICB9XG4gIH0sIDMwMCk7XG5cbn0gZWxzZSBpZiAod2luZG93LmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2hhc2hjaGFuZ2UnLCBfb25IYXNoQ2hhbmdlLCBmYWxzZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gRXZlbnRzO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyBkbyB0aGVzZSBjaGVja3Mgb25jZSwgaW5zdGVhZCBvZiBvbmNlIHBlciBjYWxsXG52YXIgaXNNb2JpbGUgPSBmYWxzZSxcbiAgICBzdXBwb3J0c0RhdGVJbnB1dCA9IGZhbHNlO1xuXG5cbi8vIHN0YXRpYyBvYmplY3Qgd2l0aCB1dGlsaXR5IG1ldGhvZHNcbnZhciBVdGlsID0gZnVuY3Rpb24gKCkge1xufTtcblxuXG5VdGlsLmlzTW9iaWxlID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gaXNNb2JpbGU7XG59O1xuXG5VdGlsLnN1cHBvcnRzRGF0ZUlucHV0ID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gc3VwcG9ydHNEYXRlSW5wdXQ7XG59O1xuXG4vKipcbiAqIE1lcmdlIHByb3BlcnRpZXMgZnJvbSBhIHNlcmllcyBvZiBvYmplY3RzLlxuICpcbiAqIEBwYXJhbSBkc3Qge09iamVjdH1cbiAqICAgICAgdGFyZ2V0IHdoZXJlIG1lcmdlZCBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgdG8uXG4gKiBAcGFyYW0gPHZhcmlhYmxlPiB7T2JqZWN0fVxuICogICAgICBzb3VyY2Ugb2JqZWN0cyBmb3IgcHJvcGVydGllcy4gV2hlbiBhIHNvdXJjZSBpcyBub24gbnVsbCwgaXQnc1xuICogICAgICBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgdG8gdGhlIGRzdCBvYmplY3QuIFByb3BlcnRpZXMgYXJlIGNvcGllZCBpblxuICogICAgICB0aGUgb3JkZXIgb2YgYXJndW1lbnRzOiBhIHByb3BlcnR5IG9uIGEgbGF0ZXIgYXJndW1lbnQgb3ZlcnJpZGVzIGFcbiAqICAgICAgcHJvcGVydHkgb24gYW4gZWFybGllciBhcmd1bWVudC5cbiAqL1xuVXRpbC5leHRlbmQgPSBmdW5jdGlvbiAoZHN0KSB7XG4gIHZhciBpLCBsZW4sIHNyYywgcHJvcDtcblxuICAvLyBpdGVyYXRlIG92ZXIgc291cmNlcyB3aGVyZSBwcm9wZXJ0aWVzIGFyZSByZWFkXG4gIGZvciAoaSA9IDEsIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgIHNyYyA9IGFyZ3VtZW50c1tpXTtcbiAgICBpZiAoc3JjKSB7XG4gICAgICBmb3IgKHByb3AgaW4gc3JjKSB7XG4gICAgICAgIGRzdFtwcm9wXSA9IHNyY1twcm9wXTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyByZXR1cm4gdXBkYXRlZCBvYmplY3RcbiAgcmV0dXJuIGRzdDtcbn07XG5cbi8qKlxuICogQ2hlY2tzIGlmIG9iamVjdHMgYXJlIGVxdWFsLlxuICpcbiAqIEBwYXJhbSBhIHtPYmplY3R9XG4gKiAgICAgIE9iamVjdCBhLlxuICogQHBhcmFtIGIge09iamVjdH1cbiAqICAgICAgT2JqZWN0IGIuXG4gKi9cblV0aWwuZXF1YWxzID0gZnVuY3Rpb24gKG9iakEsIG9iakIpIHtcbiAgdmFyIGtleWEsIGtleWI7XG5cbiAgaWYgKG9iakEgPT09IG9iakIpIHtcbiAgICAvLyBpZiA9PT0gdGhlbiA9PT0sIG5vIHF1ZXN0aW9uIGFib3V0IHRoYXQuLi5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBlbHNlIGlmIChvYmpBID09PSBudWxsIHx8IG9iakIgPT09IG51bGwpIHtcbiAgICAvLyBmdW5ueSwgdHlwZW9mIG51bGwgPT09ICdvYmplY3QnLCBzbyAuLi4gaG1waCFcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0gZWxzZSBpZiAodHlwZW9mIG9iakEgPT09ICdvYmplY3QnICYmIHR5cGVvZiBvYmpCID09PSAnb2JqZWN0Jykge1xuICAgIC8vIHJlY3Vyc2l2ZWx5IGNoZWNrIG9iamVjdHNcbiAgICBmb3IgKGtleWEgaW4gb2JqQSkge1xuICAgICAgaWYgKG9iakEuaGFzT3duUHJvcGVydHkoa2V5YSkpIHtcbiAgICAgICAgaWYgKCFvYmpCLmhhc093blByb3BlcnR5KGtleWEpKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlOyAvLyBvYmpCIGlzIG1pc3NpbmcgYSBrZXkgZnJvbSBvYmpBXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGtleWIgaW4gb2JqQikge1xuICAgICAgaWYgKG9iakIuaGFzT3duUHJvcGVydHkoa2V5YikpIHtcbiAgICAgICAgaWYgKCFvYmpBLmhhc093blByb3BlcnR5KGtleWIpKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlOyAvLyBvYmpBIGlzIG1pc3NpbmcgYSBrZXkgZnJvbSBvYmpCXG4gICAgICAgIH0gZWxzZSBpZiAoIVV0aWwuZXF1YWxzKG9iakFba2V5Yl0sIG9iakJba2V5Yl0pKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlOyAvLyBvYmpBW2tleV0gIT09IG9iakJba2V5XVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7IC8vIFJlY3Vyc2l2ZWx5IGVxdWFsLCBzbyBlcXVhbFxuICB9IGVsc2Uge1xuICAgIHJldHVybiBvYmpBID09PSBvYmpCOyAvLyBVc2UgYmFrZWQgaW4gPT09IGZvciBwcmltaXRpdmVzXG4gIH1cbn07XG5cbi8qKlxuICogR2V0IGFuIGV2ZW50IG9iamVjdCBmb3IgYW4gZXZlbnQgaGFuZGxlci5cbiAqXG4gKiBAcGFyYW0gZSB0aGUgZXZlbnQgdGhhdCB3YXMgcmVjZWl2ZWQgYnkgdGhlIGV2ZW50IGhhbmRsZXIuXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKiAgICAgIHdpdGggdHdvIHByb3BlcnRpZXM6XG4gKiAgICAgIHRhcmdldFxuICogICAgICAgICAgIHRoZSBlbGVtZW50IHdoZXJlIHRoZSBldmVudCBvY2N1cnJlZC5cbiAqICAgICAgb3JpZ2luYWxFdmVudFxuICogICAgICAgICAgIHRoZSBldmVudCBvYmplY3QsIGVpdGhlciBwYXJhbWV0ZXIgZSBvciB3aW5kb3cuZXZlbnQgKGluIElFKS5cbiAqL1xuVXRpbC5nZXRFdmVudCA9IGZ1bmN0aW9uIChlKSB7XG4gIHZhciB0YXJnO1xuXG4gIGlmICghZSkge1xuICAgIC8vIGllIHB1dHMgZXZlbnQgaW4gZ2xvYmFsXG4gICAgZSA9IHdpbmRvdy5ldmVudDtcbiAgfVxuXG4gIC8vIGZpbmQgdGFyZ2V0XG4gIGlmIChlLnRhcmdldCkge1xuICAgIHRhcmcgPSBlLnRhcmdldDtcbiAgfSBlbHNlIGlmIChlLnNyY0VsZW1lbnQpIHtcbiAgICB0YXJnID0gZS5zcmNFbGVtZW50O1xuICB9XG5cbiAgLy8gaGFuZGxlIHNhZmFyaSBidWdcbiAgaWYgKHRhcmcubm9kZVR5cGUgPT09IDMpIHtcbiAgICB0YXJnID0gdGFyZy5wYXJlbnROb2RlO1xuICB9XG5cbiAgLy8gcmV0dXJuIHRhcmdldCBhbmQgZXZlbnRcbiAgcmV0dXJuIHtcbiAgICB0YXJnZXQ6IHRhcmcsXG4gICAgb3JpZ2luYWxFdmVudDogZVxuICB9O1xufTtcblxuLyoqXG4gKiBHZXQgYSBwYXJlbnQgbm9kZSBiYXNlZCBvbiBpdCdzIG5vZGUgbmFtZS5cbiAqXG4gKiBAcGFyYW0gZWwge0RPTUVsZW1lbnR9XG4gKiAgICAgIGVsZW1lbnQgdG8gc2VhcmNoIGZyb20uXG4gKiBAcGFyYW0gbm9kZU5hbWUge1N0cmluZ31cbiAqICAgICAgbm9kZSBuYW1lIHRvIHNlYXJjaCBmb3IuXG4gKiBAcGFyYW0gbWF4UGFyZW50IHtET01FbGVtZW50fVxuICogICAgICBlbGVtZW50IHRvIHN0b3Agc2VhcmNoaW5nLlxuICogQHJldHVybiB7RE9NRWxlbWVudH1cbiAqICAgICAgbWF0Y2hpbmcgZWxlbWVudCwgb3IgbnVsbCBpZiBub3QgZm91bmQuXG4gKi9cblV0aWwuZ2V0UGFyZW50Tm9kZSA9IGZ1bmN0aW9uIChlbCwgbm9kZU5hbWUsIG1heFBhcmVudCkge1xuICB2YXIgY3VyUGFyZW50ID0gZWw7XG5cbiAgd2hpbGUgKGN1clBhcmVudCAmJiBjdXJQYXJlbnQgIT09IG1heFBhcmVudCAmJlxuICAgICAgY3VyUGFyZW50Lm5vZGVOYW1lLnRvVXBwZXJDYXNlKCkgIT09IG5vZGVOYW1lLnRvVXBwZXJDYXNlKCkpIHtcbiAgICBjdXJQYXJlbnQgPSBjdXJQYXJlbnQucGFyZW50Tm9kZTtcbiAgfVxuICBpZiAoY3VyUGFyZW50ICYmICdub2RlTmFtZScgaW4gY3VyUGFyZW50ICYmXG4gICAgICBjdXJQYXJlbnQubm9kZU5hbWUudG9VcHBlckNhc2UoKSA9PT0gbm9kZU5hbWUudG9VcHBlckNhc2UoKSkge1xuICAgIC8vIGZvdW5kIHRoZSBkZXNpcmVkIG5vZGVcbiAgICByZXR1cm4gY3VyUGFyZW50O1xuICB9XG5cbiAgLy8gZGlkbid0IGZpbmQgdGhlIGRlc2lyZWQgbm9kZVxuICByZXR1cm4gbnVsbDtcbn07XG5cbi8vIHJlbW92ZSBhbiBlbGVtZW50cyBjaGlsZCBub2Rlc1xuVXRpbC5lbXB0eSA9IGZ1bmN0aW9uIChlbCkge1xuICB3aGlsZSAoZWwuZmlyc3RDaGlsZCkge1xuICAgIGVsLnJlbW92ZUNoaWxkKGVsLmZpcnN0Q2hpbGQpO1xuICB9XG59O1xuXG4vLyBkZXRhY2ggYW4gZWxlbWVudCBmcm9tIGl0cyBwYXJlbnRcblV0aWwuZGV0YWNoID0gZnVuY3Rpb24gKGVsKSB7XG4gIGlmIChlbC5wYXJlbnROb2RlKSB7XG4gICAgZWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlbCk7XG4gIH1cbn07XG5cblV0aWwuZ2V0V2luZG93U2l6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGRpbWVuc2lvbnMgPSB7d2lkdGg6bnVsbCxoZWlnaHQ6bnVsbH07XG5cbiAgaWYgKCdpbm5lcldpZHRoJyBpbiB3aW5kb3cgJiYgJ2lubmVySGVpZ2h0JyBpbiB3aW5kb3cpIHtcbiAgICBkaW1lbnNpb25zID0ge1xuICAgICAgd2lkdGg6IHdpbmRvdy5pbm5lcldpZHRoLFxuICAgICAgaGVpZ2h0OiB3aW5kb3cuaW5uZXJIZWlnaHRcbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIC8vIHByb2JhYmx5IElFPD04XG4gICAgdmFyIGVsZW0gPSAnZG9jdW1lbnRFbGVtZW50JyBpbiBkb2N1bWVudCA/XG4gICAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCA6IGRvY3VtZW50LmJvZHk7XG5cbiAgICBkaW1lbnNpb25zID0ge1xuICAgICAgd2lkdGg6IGVsZW0ub2Zmc2V0V2lkdGgsXG4gICAgICBoZWlnaHQ6IGVsZW0ub2Zmc2V0SGVpZ2h0XG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiBkaW1lbnNpb25zO1xufTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCBpcyBhIGNvbXBvc2l0aW9uIG9mIG90aGVyIGZ1bmN0aW9ucy5cbiAqXG4gKiBGb3IgZXhhbXBsZTpcbiAqICAgICAgYShiKGMoeCkpKSA9PT0gY29tcG9zZShjLCBiLCBhKSh4KTtcbiAqXG4gKiBFYWNoIGZ1bmN0aW9uIHNob3VsZCBhY2NlcHQgYXMgYW4gYXJndW1lbnQsIHRoZSByZXN1bHQgb2YgdGhlIHByZXZpb3VzXG4gKiBmdW5jdGlvbiBjYWxsIGluIHRoZSBjaGFpbi4gSXQgaXMgYWxsb3dhYmxlIGZvciBhbGwgZnVuY3Rpb25zIHRvIGhhdmUgbm9cbiAqIHJldHVybiB2YWx1ZSBhcyB3ZWxsLlxuICpcbiAqIEBwYXJhbSAuLi4ge0Z1bmN0aW9ufSBBIHZhcmlhYmxlIHNldCBvZiBmdW5jdGlvbnMgdG8gY2FsbCwgaW4gb3JkZXIuXG4gKlxuICogQHJldHVybiB7RnVuY3Rpb259IFRoZSBjb21wb3NpdGlvbiBvZiB0aGUgZnVuY3Rpb25zIHByb3ZpZGVkIGFzIGFyZ3VtZW50cy5cbiAqL1xuVXRpbC5jb21wb3NlID0gZnVuY3Rpb24gKCkge1xuICB2YXIgZm5zID0gYXJndW1lbnRzO1xuXG4gIHJldHVybiBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgdmFyIGksXG4gICAgICAgIGZuLFxuICAgICAgICBsZW47XG5cbiAgICBmb3IgKGkgPSAwLCBsZW4gPSBmbnMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGZuID0gZm5zW2ldO1xuXG4gICAgICBpZiAoZm4gJiYgZm4uY2FsbCkge1xuICAgICAgICByZXN1bHQgPSBmbi5jYWxsKHRoaXMsIHJlc3VsdCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbn07XG5cbi8qKlxuICogQ2hlY2tzIHRoZSBlbGVtZW50cyBvZiBhIGxvb2tpbmcgZm9yIGIuIGIgaXMgYXNzdW1lZCB0byBiZSBmb3VuZCBpZiBmb3JcbiAqIHNvbWUgb2JqZWN0IGluIGEgKGFbaV0pLCBhW2ldID09PSBiLiBOb3RlIHN0cmljdCBlcXVhbGl0eS5cbiAqXG4gKiBAcGFyYW0gYSB7QXJyYXl9XG4gKiAgICAgIEFuIGFycmF5IHRvIHNlYXJjaFxuICogQHBhcmFtIGIge01peGVkfVxuICogICAgICBBIHZhbHVlIHRvIHNlYXJjaCBmb3JcbiAqXG4gKiBAcmV0dXJuXG4gKiAgICAgIHRydWUgaWYgYXJyYXkgYSBjb250YWlucyBiXG4gKi9cblV0aWwuY29udGFpbnMgPSBmdW5jdGlvbiAoYSwgYikge1xuICB2YXIgaSwgbGVuO1xuXG4gIGZvciAoaSA9IDAsIGxlbiA9IGEubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICBpZiAoYiA9PT0gYVtpXSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuLyoqXG4gKiBAcmV0dXJuXG4gKiAgICAgIHRydWUgaWYgb2JqZWN0IGlzIGFuIGFycmF5XG4gKi9cblV0aWwuaXNBcnJheSA9IGZ1bmN0aW9uIChhKSB7XG5cbiAgaWYgKHR5cGVvZiBBcnJheS5pc0FycmF5ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIEFycmF5LmlzQXJyYXkoYSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChhKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbiAgfVxuXG59O1xuXG5cbi8qKlxuICogTG9hZCBhIHNjcmlwdCBhc3luY2hyb25vdXNseS5cbiAqXG4gKiBAcGFyYW0gdXJsIHtTdHJpbmd9XG4gKiAgICAgICAgc2NyaXB0IHRvIGxvYWQuXG4gKiBAcGFyYW0gb3B0aW9ucyB7T2JqZWN0fVxuICogICAgICAgIGFkZGl0aW9uYWwgb3B0aW9ucy5cbiAqIEBwYXJhbSBvcHRpb25zLnN1Y2Nlc3Mge0Z1bmN0aW9ufSBvcHRpb25hbC5cbiAqICAgICAgICBjYWxsZWQgYWZ0ZXIgc2NyaXB0IGxvYWRzIHN1Y2Nlc3NmdWxseS5cbiAqIEBwYXJhbSBvcHRpb25zLmVycm9yIHtGdW5jdGlvbn0gb3B0aW9uYWwuXG4gKiAgICAgICAgY2FsbGVkIGFmdGVyIHNjcmlwdCBmYWlscyB0byBsb2FkLlxuICogQHBhcmFtIG9wdGlvbnMuZG9uZSB7RnVuY3Rpb259IG9wdGlvbmFsXG4gKiAgICAgICAgY2FsbGVkIGFmdGVyIGxvYWRTY3JpcHQgaXMgY29tcGxldGUsXG4gKiAgICAgICAgYWZ0ZXIgY2FsbGluZyBzdWNjZXNzIG9yIGVycm9yLlxuICovXG5VdGlsLmxvYWRTY3JpcHQgPSBmdW5jdGlvbiAodXJsLCBvcHRpb25zKSB7XG4gIC8vIGxvYWQgc2Vjb25kYXJ5IHNjcmlwdFxuICB2YXIgY2xlYW51cCxcbiAgICAgIGRvbmUsXG4gICAgICBvbkVycm9yLFxuICAgICAgb25Mb2FkLFxuICAgICAgc2NyaXB0O1xuXG4gIG9wdGlvbnMgPSBVdGlsLmV4dGVuZCh7fSwge1xuICAgIHN1Y2Nlc3M6IG51bGwsXG4gICAgZXJyb3I6IG51bGwsXG4gICAgZG9uZTogbnVsbFxuICB9LCBvcHRpb25zKTtcblxuICBjbGVhbnVwID0gZnVuY3Rpb24gKCkge1xuICAgIHNjcmlwdC5yZW1vdmVFdmVudExpc3RlbmVyKCdsb2FkJywgb25Mb2FkKTtcbiAgICBzY3JpcHQucmVtb3ZlRXZlbnRMaXN0ZW5lcignZXJyb3InLCBvbkVycm9yKTtcbiAgICBzY3JpcHQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzY3JpcHQpO1xuICAgIGNsZWFudXAgPSBudWxsO1xuICAgIG9uTG9hZCA9IG51bGw7XG4gICAgb25FcnJvciA9IG51bGw7XG4gICAgc2NyaXB0ID0gbnVsbDtcbiAgfTtcblxuICBkb25lID0gZnVuY3Rpb24gKCkge1xuICAgIGlmIChvcHRpb25zLmRvbmUgIT09IG51bGwpIHtcbiAgICAgIG9wdGlvbnMuZG9uZSgpO1xuICAgIH1cbiAgICBvcHRpb25zID0gbnVsbDtcbiAgfTtcblxuICBvbkVycm9yID0gZnVuY3Rpb24gKCkge1xuICAgIGNsZWFudXAoKTtcbiAgICBpZiAob3B0aW9ucy5lcnJvciAhPT0gbnVsbCkge1xuICAgICAgb3B0aW9ucy5lcnJvci5hcHBseShudWxsLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgICBkb25lKCk7XG4gIH07XG5cbiAgb25Mb2FkID0gZnVuY3Rpb24gKCkge1xuICAgIGNsZWFudXAoKTtcbiAgICBpZiAob3B0aW9ucy5zdWNjZXNzICE9PSBudWxsKSB7XG4gICAgICBvcHRpb25zLnN1Y2Nlc3MuYXBwbHkobnVsbCwgYXJndW1lbnRzKTtcbiAgICB9XG4gICAgZG9uZSgpO1xuICB9O1xuXG4gIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuICBzY3JpcHQuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIG9uTG9hZCk7XG4gIHNjcmlwdC5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsIG9uRXJyb3IpO1xuICBzY3JpcHQuc3JjID0gdXJsO1xuICBzY3JpcHQuYXN5bmMgPSB0cnVlO1xuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdzY3JpcHQnKS5wYXJlbnROb2RlLmFwcGVuZENoaWxkKHNjcmlwdCk7XG59O1xuXG5cbi8vIERvIHRoZXNlIGNoZWNrcyBvbmNlIGFuZCBjYWNoZSB0aGUgcmVzdWx0c1xuKGZ1bmN0aW9uKCkge1xuICB2YXIgdGVzdEVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIHZhciB0ZXN0SW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICB2YXIgc3RyID0gbmF2aWdhdG9yLnVzZXJBZ2VudHx8bmF2aWdhdG9yLnZlbmRvcnx8d2luZG93Lm9wZXJhO1xuXG4gIGlzTW9iaWxlID0gc3RyLm1hdGNoKC8oQW5kcm9pZHx3ZWJPU3xpUGhvbmV8aVBhZHxpUG9kfEJsYWNrQmVycnl8V2luZG93cyBQaG9uZSkvaSk7XG4gIHRlc3RJbnB1dC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAnZGF0ZScpO1xuICBzdXBwb3J0c0RhdGVJbnB1dCA9ICh0ZXN0SW5wdXQudHlwZSAhPT0gJ3RleHQnKTtcblxuICAvLyBjbGVhbiB1cCB0ZXN0aW5nIGVsZW1lbnRcbiAgdGVzdEVsID0gbnVsbDtcbn0pKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gVXRpbDsiLCIndXNlIHN0cmljdCc7XG5cblxudmFyIFV0aWwgPSByZXF1aXJlKCcuL1V0aWwnKTtcblxuXG52YXIgX0NBTExCQUNLX1NFUVVFTkNFID0gMDtcblxuLy8gZGVmYXVsdHMgZm9yIGpzb25wIG1ldGhvZFxudmFyIF9ERUZBVUxUX0pTT05QX09QVElPTlMgPSB7XG4gIHVybDogbnVsbCxcbiAgc3VjY2VzczogbnVsbCxcbiAgZXJyb3I6IG51bGwsXG4gIGRvbmU6IG51bGwsXG4gIGRhdGE6IG51bGwsXG4gIGNhbGxiYWNrTmFtZTogbnVsbCxcbiAgY2FsbGJhY2tQYXJhbWV0ZXI6ICdjYWxsYmFjaydcbn07XG5cbi8vIGRlZmF1bHRzIGZvciBhamF4IG1ldGhvZFxudmFyIF9ERUZBVUxUX0FKQVhfT1BUSU9OUyA9IHtcbiAgdXJsOiBudWxsLFxuICBzdWNjZXNzOiBudWxsLFxuICBlcnJvcjogbnVsbCxcbiAgZG9uZTogbnVsbCxcbiAgbWV0aG9kOiAnR0VUJyxcbiAgaGVhZGVyczogbnVsbCxcbiAgZGF0YTogbnVsbCxcbiAgcmF3ZGF0YTogbnVsbFxufTtcblxuLy8gQVBJIE1ldGhvZCBEZWNsYXJhdGlvbnNcblxudmFyIGFqYXgsXG4gICAgZ2V0Q2FsbGJhY2tOYW1lLFxuICAgIGpzb25wLFxuICAgIHJlc3RyaWN0T3JpZ2luLFxuICAgIHVybEVuY29kZTtcblxuXG4vLyBBUEkgTWV0aG9kIERlZmluaXRpb25zXG5cbi8qKlxuICogTWFrZSBhbiBBSkFYIHJlcXVlc3QuXG4gKlxuICogQHBhcmFtIG9wdGlvbnMudXJsIHtTdHJpbmd9XG4gKiAgICAgIHRoZSB1cmwgdG8gcmVxdWVzdC5cbiAqIEBwYXJhbSBvcHRpb25zLnN1Y2Nlc3Mge0Z1bmN0aW9ufVxuICogICAgICBjYWxsZWQgd2l0aCBkYXRhIGxvYWRlZCBieSBzY3JpcHRcbiAqIEBwYXJhbSBvcHRpb25zLmVycm9yIHtGdW5jdGlvbn0gb3B0aW9uYWxcbiAqICAgICAgY2FsbGVkIHdoZW4gc2NyaXB0IGZhaWxzIHRvIGxvYWRcbiAqIEBwYXJhbSBvcHRpb25zLmRvbmUge0Z1bmN0aW9ufVxuICogICAgICAgIGNhbGxlZCB3aGVuIGFqYXggaXMgY29tcGxldGUsIGFmdGVyIHN1Y2Nlc3Mgb3IgZXJyb3IuXG4gKiBAcGFyYW0gb3B0aW9ucy5tZXRob2Qge1N0cmluZ31cbiAqICAgICAgcmVxdWVzdCBtZXRob2QsIGRlZmF1bHQgaXMgJ0dFVCdcbiAqIEBwYXJhbSBvcHRpb25zLmhlYWRlcnMge09iamVjdH1cbiAqICAgICAgcmVxdWVzdCBoZWFkZXIgbmFtZSBhcyBrZXksIHZhbHVlIGFzIHZhbHVlLlxuICogQHBhcmFtIG9wdGlvbnMuZGF0YSB7T2JqZWN0fVxuICogICAgICByZXF1ZXN0IGRhdGEsIHNlbnQgdXNpbmcgY29udGVudCB0eXBlXG4gKiAgICAgICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnLlxuICogQHBhcmFtIG9wdGlvbnMucmF3ZGF0YSB7P31cbiAqICAgICAgcGFzc2VkIGRpcmVjdGx5IHRvIHNlbmQgbWV0aG9kLCB3aGVuIG9wdGlvbnMuZGF0YSBpcyBudWxsLlxuICogICAgICBDb250ZW50LXR5cGUgaGVhZGVyIG11c3QgYWxzbyBiZSBzcGVjaWZpZWQuIERlZmF1bHQgaXMgbnVsbC5cbiAqL1xuYWpheCA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gIHZhciBoLFxuICAgICAgcG9zdGRhdGEsXG4gICAgICBxdWVyeVN0cmluZyxcbiAgICAgIHVybCxcbiAgICAgIHhocjtcblxuICBvcHRpb25zID0gVXRpbC5leHRlbmQoe30sIF9ERUZBVUxUX0FKQVhfT1BUSU9OUywgb3B0aW9ucyk7XG4gIHVybCA9IG9wdGlvbnMudXJsO1xuXG4gIGlmIChvcHRpb25zLnJlc3RyaWN0T3JpZ2luKSB7XG4gICAgdXJsID0gcmVzdHJpY3RPcmlnaW4odXJsKTtcbiAgfVxuICBwb3N0ZGF0YSA9IG9wdGlvbnMucmF3ZGF0YTtcblxuICBpZiAob3B0aW9ucy5kYXRhICE9PSBudWxsKSB7XG4gICAgcXVlcnlTdHJpbmcgPSB1cmxFbmNvZGUob3B0aW9ucy5kYXRhKTtcbiAgICBpZiAob3B0aW9ucy5tZXRob2QgPT09ICdHRVQnKSB7XG4gICAgICAvLyBhcHBlbmQgdG8gdXJsXG4gICAgICB1cmwgPSB1cmwgKyAnPycgKyBxdWVyeVN0cmluZztcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gb3RoZXJ3aXNlIHNlbmQgYXMgcmVxdWVzdCBib2R5XG4gICAgICBwb3N0ZGF0YSA9IHF1ZXJ5U3RyaW5nO1xuICAgICAgaWYgKG9wdGlvbnMuaGVhZGVycyA9PT0gbnVsbCkge1xuICAgICAgICBvcHRpb25zLmhlYWRlcnMgPSB7fTtcbiAgICAgIH1cbiAgICAgIC8vIHNldCByZXF1ZXN0IGNvbnRlbnQgdHlwZVxuICAgICAgb3B0aW9ucy5oZWFkZXJzWydDb250ZW50LVR5cGUnXSA9ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnO1xuICAgIH1cbiAgfVxuXG4gIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXG4gIC8vIHNldHVwIGNhbGxiYWNrXG4gIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGRhdGEsIGNvbnRlbnRUeXBlO1xuXG4gICAgaWYgKHhoci5yZWFkeVN0YXRlID09PSA0KSB7XG4gICAgICBpZiAoeGhyLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgIGlmIChvcHRpb25zLnN1Y2Nlc3MgIT09IG51bGwpIHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgZGF0YSA9IHhoci5yZXNwb25zZTtcbiAgICAgICAgICAgIGNvbnRlbnRUeXBlID0geGhyLmdldFJlc3BvbnNlSGVhZGVyKCdDb250ZW50LVR5cGUnKTtcbiAgICAgICAgICAgIGlmIChjb250ZW50VHlwZSAmJiBjb250ZW50VHlwZS5pbmRleE9mKCdqc29uJykgIT09IC0xKSB7XG4gICAgICAgICAgICAgIGRhdGEgPSBKU09OLnBhcnNlKGRhdGEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb3B0aW9ucy5zdWNjZXNzKGRhdGEsIHhocik7XG4gICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMuZXJyb3IgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgb3B0aW9ucy5lcnJvcihlLCB4aHIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKG9wdGlvbnMuZXJyb3IpIHtcbiAgICAgICAgICBvcHRpb25zLmVycm9yKHhoci5zdGF0dXMsIHhocik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChvcHRpb25zLmRvbmUgIT09IG51bGwpIHtcbiAgICAgICAgb3B0aW9ucy5kb25lKHhocik7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIC8vIG9wZW4gcmVxdWVzdFxuICB4aHIub3BlbihvcHRpb25zLm1ldGhvZCwgdXJsLCB0cnVlKTtcblxuICAvLyBzZW5kIGhlYWRlcnNcbiAgaWYgKG9wdGlvbnMuaGVhZGVycyAhPT0gbnVsbCkge1xuICAgIGZvciAoaCBpbiBvcHRpb25zLmhlYWRlcnMpIHtcbiAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKGgsIG9wdGlvbnMuaGVhZGVyc1toXSk7XG4gICAgfVxuICB9XG5cbiAgLy8gc2VuZCBkYXRhXG4gIHhoci5zZW5kKHBvc3RkYXRhKTtcblxuICByZXR1cm4geGhyO1xufTtcblxuLyoqXG4gKiBHZW5lcmF0ZSBhIHVuaXF1ZSBjYWxsYmFjayBuYW1lLlxuICpcbiAqIEByZXR1cm4gYSB1bmlxdWUgY2FsbGJhY2sgbmFtZS5cbiAqL1xuZ2V0Q2FsbGJhY2tOYW1lID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gJ194aHJfY2FsbGJhY2tfJyArIG5ldyBEYXRlKCkuZ2V0VGltZSgpICtcbiAgICAgICdfJyArICgrK19DQUxMQkFDS19TRVFVRU5DRSk7XG59O1xuXG4vKipcbiAqIE1ha2UgYSBKU09OUCByZXF1ZXN0LlxuICpcbiAqIEBwYXJhbSBvcHRpb25zLnVybCB7U3RyaW5nfVxuICogICAgICB1cmwgdG8gbG9hZFxuICogQHBhcmFtIG9wdGlvbnMuc3VjY2VzcyB7RnVuY3Rpb259XG4gKiAgICAgIGNhbGxlZCB3aXRoIGRhdGEgbG9hZGVkIGJ5IHNjcmlwdFxuICogQHBhcmFtIG9wdGlvbnMuZXJyb3Ige0Z1bmN0aW9ufSBvcHRpb25hbFxuICogICAgICBjYWxsZWQgd2hlbiBzY3JpcHQgZmFpbHMgdG8gbG9hZFxuICogQHBhcmFtIG9wdGlvbnMuZG9uZSB7RnVuY3Rpb259IG9wdGlvbmFsXG4gKiAgICAgICAgY2FsbGVkIHdoZW4ganNvbnAgaXMgY29tcGxldGUsIGFmdGVyIHN1Y2Nlc3Mgb3IgZXJyb3IuXG4gKiBAcGFyYW0gb3B0aW9ucy5kYXRhIHtPYmplY3R9IG9wdGlvbmFsXG4gKiAgICAgIHJlcXVlc3QgcGFyYW1ldGVycyB0byBhZGQgdG8gdXJsXG4gKlxuICogQHBhcmFtIG9wdGlvbnMuY2FsbGJhY2tOYW1lIHtTdHJpbmd9IG9wdGlvbmFsXG4gKiBAcGFyYW0gb3B0aW9ucy5jYWxsYmFja1BhcmFtZXRlciB7U3RyaW5nfSBvcHRpb25hbFxuICogICAgICBkZWZhdWx0IGlzICdjYWxsYmFjaydcbiAqL1xuanNvbnAgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICB2YXIgZGF0YSxcbiAgICAgIGNhbGxiYWNrLFxuICAgICAgdXJsO1xuXG4gIG9wdGlvbnMgPSBVdGlsLmV4dGVuZCh7fSwgX0RFRkFVTFRfSlNPTlBfT1BUSU9OUywgb3B0aW9ucyk7XG4gIHVybCA9IG9wdGlvbnMudXJsO1xuICBkYXRhID0gVXRpbC5leHRlbmQoe30sIG9wdGlvbnMuZGF0YSk7XG4gIGNhbGxiYWNrID0gb3B0aW9ucy5jYWxsYmFja05hbWUgfHwgZ2V0Q2FsbGJhY2tOYW1lKCk7XG5cbiAgLy8gYWRkIGRhdGEgYW5kIGNhbGxiYWNrIHRvIHVybFxuICBkYXRhW29wdGlvbnMuY2FsbGJhY2tQYXJhbWV0ZXJdID0gY2FsbGJhY2s7XG4gIHVybCArPSAodXJsLmluZGV4T2YoJz8nKSA9PT0gLTEgPyAnPycgOiAnJicpICsgdXJsRW5jb2RlKGRhdGEpO1xuXG4gIC8vIHNldHVwIGdsb2JhbCBjYWxsYmFjayBjYWxsZWQgYnkgc2NyaXB0XG4gIHdpbmRvd1tjYWxsYmFja10gPSBmdW5jdGlvbiAoKSB7XG4gICAgb3B0aW9ucy5zdWNjZXNzLmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7XG4gIH07XG5cbiAgVXRpbC5sb2FkU2NyaXB0KHVybCwge1xuICAgIGVycm9yOiBvcHRpb25zLmVycm9yLFxuICAgIGRvbmU6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHdpbmRvd1tjYWxsYmFja10gPSBudWxsO1xuICAgICAgZGVsZXRlIHdpbmRvd1tjYWxsYmFja107XG5cbiAgICAgIGlmIChvcHRpb25zLmRvbmUgIT09IG51bGwpIHtcbiAgICAgICAgb3B0aW9ucy5kb25lKCk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbn07XG5cbnJlc3RyaWN0T3JpZ2luID0gZnVuY3Rpb24gKHVybCkge1xuICB2YXIgYSxcbiAgICAgIHJlc3RyaWN0ZWRVcmw7XG5cbiAgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTsgLy8gSGFjayB0byBwYXJzZSBvbmx5IHRoZSBwYXRobmFtZVxuICBhLnNldEF0dHJpYnV0ZSgnaHJlZicsIHVybCk7XG4gIHJlc3RyaWN0ZWRVcmwgPSBhLnBhdGhuYW1lO1xuXG4gIC8vIE5lZWRlZCBmb3IgSUUsIHdoaWNoIG9taXRzIGxlYWRpbmcgc2xhc2guXG4gIGlmICgodXJsLmluZGV4T2YoJ2h0dHAnKSA9PT0gMCB8fCB1cmwuaW5kZXhPZignLycpID09PSAwKSAmJlxuICAgICAgcmVzdHJpY3RlZFVybC5pbmRleE9mKCcvJykgIT09IDApIHtcbiAgICByZXN0cmljdGVkVXJsID0gJy8nICsgcmVzdHJpY3RlZFVybDtcbiAgfVxuXG4gIHJldHVybiByZXN0cmljdGVkVXJsO1xufTtcblxuLyoqXG4gKiBVUkwgZW5jb2RlIGFuIG9iamVjdC5cbiAqXG4gKiBAcGFyYW0gb2JqIHtPYmplY3R9XG4gKiAgICAgIG9iamVjdCB0byBlbmNvZGVcbiAqXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiAgICAgIHVybCBlbmNvZGVkIG9iamVjdFxuICovXG51cmxFbmNvZGUgPSBmdW5jdGlvbiAob2JqKSB7XG4gIHZhciBkYXRhLCBrZXksIGVuY29kZWRLZXksIHZhbHVlLCBpLCBsZW47XG5cbiAgZGF0YSA9IFtdO1xuICBmb3IgKGtleSBpbiBvYmopIHtcbiAgICBlbmNvZGVkS2V5ID0gZW5jb2RlVVJJQ29tcG9uZW50KGtleSk7XG4gICAgdmFsdWUgPSBvYmpba2V5XTtcblxuICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAvLyBBZGQgZWFjaCB2YWx1ZSBpbiBhcnJheSBzZXBlcmF0ZWx5XG4gICAgICBmb3IgKGkgPSAwLCBsZW4gPSB2YWx1ZS5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBkYXRhLnB1c2goZW5jb2RlZEtleSArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudCh2YWx1ZVtpXSkpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBkYXRhLnB1c2goZW5jb2RlZEtleSArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudCh2YWx1ZSkpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZGF0YS5qb2luKCcmJyk7XG59O1xuXG5cbi8vIGV4cG9zZSB0aGUgQVBJXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgYWpheDogYWpheCxcbiAgZ2V0Q2FsbGJhY2tOYW1lOiBnZXRDYWxsYmFja05hbWUsXG4gIGpzb25wOiBqc29ucCxcbiAgcmVzdHJpY3RPcmlnaW46IHJlc3RyaWN0T3JpZ2luLFxuICB1cmxFbmNvZGU6IHVybEVuY29kZSxcbn07IiwiLyogZ2xvYmFsIHdpbmRvdyAqL1xuJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBBcHAgPSByZXF1aXJlKCdzaGFrZW1hcC12aWV3L0FwcCcpLFxuICAgICAgICBTaGFrZU1hcE1vZGVsID0gcmVxdWlyZSgnc2hha2VtYXAtdmlldy9TaGFrZU1hcE1vZGVsJyk7XG5cbnZhciBhcHAgPSB3aW5kb3cuQXBwID0gQXBwKHtcbiAgICBlbDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3NoYWtlbWFwVmlldycpLFxuICAgIG1vZGVsOiBTaGFrZU1hcE1vZGVsKClcbn0pO1xuYXBwLm1vZGVsLnRyaWdnZXIoJ2NoYW5nZScpO1xuXG4iLCJjb25zdCBFdmVudHNWaWV3ID0gcmVxdWlyZSgnc2hha2VtYXAtdmlldy9ldmVudHMvRXZlbnRzVmlldycpLFxuICAgICAgICBMb2FkaW5nVmlldyA9IHJlcXVpcmUoJ3NoYWtlbWFwLXZpZXcvbG9hZGluZy9Mb2FkaW5nVmlldycpLFxuICAgICAgICBNYXBWaWV3ID0gcmVxdWlyZSgnc2hha2VtYXAtdmlldy9tYXBzL01hcFZpZXcnKSxcbiAgICAgICAgVmlldyA9IHJlcXVpcmUoJ2hhemRldi13ZWJ1dGlscy9zcmMvbXZjL1ZpZXcnKSxcbiAgICAgICAgVXRpbCA9IHJlcXVpcmUoJ2hhemRldi13ZWJ1dGlscy9zcmMvdXRpbC9VdGlsJyk7XG5cbnZhciBBcHAgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgIHZhciBfdGhpcyxcbiAgICAgICAgICAgIF9pbml0aWFsaXplO1xuXG4gICAgb3B0aW9ucyA9IFV0aWwuZXh0ZW5kKHt9LCB7fSwgb3B0aW9ucyk7XG4gICAgX3RoaXMgPSBWaWV3KG9wdGlvbnMpO1xuXG4gICAgX2luaXRpYWxpemUgPSBmdW5jdGlvbiAoLypvcHRpb25zKi8pIHtcbiAgICAgICAgX3RoaXMuZWwuY2xhc3NMaXN0LmFkZCgnc20tdmlldy1hcHAnKTtcblxuICAgICAgICBfdGhpcy5lbC5pbm5lckhUTUwgPVxuICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwibG9hZGluZy12aWV3XCI+PC9kaXY+JyArXG4gICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJldmVudHNcIj48L2Rpdj4nICtcbiAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cIm1hcC12aWV3XCIgc3R5bGU9XCJoZWlnaHQ6MTAwJTt3aWR0aDoxMDAlO3Bvc2l0aW9uOnJlbGF0aXZlO1wiPjwvZGl2Pic7XG5cbiAgICAgICAgX3RoaXMubWFwVmlldyA9IE1hcFZpZXcoe1xuICAgICAgICAgICAgZWw6IF90aGlzLmVsLnF1ZXJ5U2VsZWN0b3IoJy5tYXAtdmlldycpLFxuICAgICAgICAgICAgbW9kZWw6IF90aGlzLm1vZGVsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIF90aGlzLmV2ZW50c1ZpZXcgPSBFdmVudHNWaWV3KHtcbiAgICAgICAgICAgIGVsOiBfdGhpcy5lbC5xdWVyeVNlbGVjdG9yKCcuZXZlbnRzJyksXG4gICAgICAgICAgICBtb2RlbDogX3RoaXMubW9kZWxcbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICBfdGhpcy5sb2FkaW5nVmlldyA9IExvYWRpbmdWaWV3KHtcbiAgICAgICAgICAgIGVsOiBfdGhpcy5lbC5xdWVyeVNlbGVjdG9yKCcubG9hZGluZy12aWV3JyksXG4gICAgICAgICAgICBtb2RlbDogX3RoaXMubW9kZWxcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIF9pbml0aWFsaXplKG9wdGlvbnMpO1xuICAgIG9wdGlvbnMgPSBudWxsO1xuICAgIHJldHVybiBfdGhpcztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQXBwOyIsImNvbnN0IE1vZGVsID0gcmVxdWlyZSgnaGF6ZGV2LXdlYnV0aWxzL3NyYy9tdmMvTW9kZWwnKSxcbiAgICAgICAgVXRpbCA9IHJlcXVpcmUoJ2hhemRldi13ZWJ1dGlscy9zcmMvdXRpbC9VdGlsJyk7XG5cbnZhciBTaGFrZU1hcE1vZGVsID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICAgIHZhciBfdGhpcztcblxuICAgIF90aGlzID0gTW9kZWwoVXRpbC5leHRlbmQoe30sXG4gICAgICAgIHtwcm9kdWN0c1VybDogJy9wcm9kdWN0cy5qc29uJyxcbiAgICAgICAgICAgIGV2ZW50czogW10sXG4gICAgICAgICAgICBldmVudDogbnVsbCxcbiAgICAgICAgICAgIGxheWVyczogW10sXG4gICAgICAgICAgICBkZWZhdWx0TGF5ZXJzOiBbJ0VwaWNlbnRlcicsICdQR0EgQ29udG91cnMnXSxcbiAgICAgICAgICAgIGxvYWRpbmc6IGZhbHNlfSxcblx0XHRcdG9wdGlvbnMpKTtcblxuICAgIHJldHVybiBfdGhpcztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gU2hha2VNYXBNb2RlbDsiLCIndXNlIHN0cmljdCc7XG5jb25zdCBWaWV3ID0gcmVxdWlyZSgnaGF6ZGV2LXdlYnV0aWxzL3NyYy9tdmMvVmlldycpLFxuICAgICAgICBYaHIgPSByZXF1aXJlKCd1dGlsL1hocicpO1xuXG52YXIgRXZlbnRWaWV3ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICB2YXIgX3RoaXMsXG4gICAgICAgICAgICBfaW5pdGlhbGl6ZTtcblxuICAgIF90aGlzID0gVmlldyhvcHRpb25zKTtcblxuICAgIF9pbml0aWFsaXplID0gZnVuY3Rpb24gKC8qb3B0aW9ucyovICkge1xuICAgICAgICBfdGhpcy5lbC5pbm5lckhUTUwgPSBcbiAgICAgICAgICAgICAgICAnJyArXG4gICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJsb2FkQnV0dG9uXCI+UmVmcmVzaCBMaXN0PC9kaXY+JztcbiAgICAgICAgX3RoaXMuZWwuZXZlbnRMaXN0ID0gW107XG5cbiAgICAgICAgX3RoaXMubW9kZWwub24oJ2NoYW5nZTpldmVudHMnLCBfdGhpcy5yZW5kZXJFdmVudHMpO1xuICAgICAgICBfdGhpcy5sb2FkQnV0dG9uID0gX3RoaXMuZWwucXVlcnlTZWxlY3RvcignLmxvYWRCdXR0b24nKTtcbiAgICAgICAgX3RoaXMubG9hZEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIF90aGlzLmdldEV2ZW50cyk7XG5cbiAgICAgICAgX3RoaXMuZ2V0RXZlbnRzKCk7XG4gICAgfTtcblxuICAgIF90aGlzLnJlbmRlckV2ZW50cyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGV2ZW50SHRtbCA9ICcnO1xuICAgICAgICBmb3IgKGxldCBldmVudCBvZiBfdGhpcy5tb2RlbC5nZXQoJ2V2ZW50cycpKSB7XG4gICAgICAgICAgICBldmVudEh0bWwgKz0gJzxkaXYgY2xhc3M9XCJldmVudFwiPicgKyBldmVudC5pZCArICc8L2Rpdj4nO1xuICAgICAgICB9XG5cbiAgICAgICAgX3RoaXMuZWwuaW5uZXJIVE1MID0gXG4gICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJldmVudC1saXN0XCI+JyArIGV2ZW50SHRtbCArICc8L2Rpdj4nICtcbiAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cImxvYWRCdXR0b25cIj5SZWZyZXNoIExpc3Q8L2Rpdj4nO1xuICAgICAgICBcbiAgICAgICAgX3RoaXMubG9hZEJ1dHRvbiA9IF90aGlzLmVsLnF1ZXJ5U2VsZWN0b3IoJy5sb2FkQnV0dG9uJyk7XG4gICAgICAgIF90aGlzLmxvYWRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBfdGhpcy5nZXRFdmVudHMpO1xuXG4gICAgICAgIF90aGlzLmV2ZW50cyA9IF90aGlzLmVsLnF1ZXJ5U2VsZWN0b3JBbGwoJy5ldmVudCcpO1xuICAgICAgICBpZiAoX3RoaXMuZXZlbnRzKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBldmVudCBvZiBfdGhpcy5ldmVudHMpIHtcbiAgICAgICAgICAgICAgICBldmVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIF90aGlzLmxvYWRFdmVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgX3RoaXMuZ2V0RXZlbnRzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBfdGhpcy5tb2RlbC5zZXQoe1xuICAgICAgICAgICAgbG9hZGluZzogdHJ1ZVxuICAgICAgICB9KTtcblxuICAgICAgICBYaHIuYWpheCh7XG4gICAgICAgICAgICB1cmw6IF90aGlzLm1vZGVsLmdldCgncHJvZHVjdHNVcmwnKSxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChqc29uKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMubW9kZWwuc2V0KHtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnRzOiBKU09OLnBhcnNlKGpzb24pXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5tb2RlbC5zZXQoe1xuICAgICAgICAgICAgICAgICAgICBldmVudHM6IFtdXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZG9uZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIF90aGlzLm1vZGVsLnNldCh7XG4gICAgICAgICAgICAgICAgICAgIGxvYWRpbmc6IGZhbHNlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgXG4gICAgX3RoaXMubG9hZEV2ZW50ID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgdmFyIGV2ZW50RGl2ID0gZS50b0VsZW1lbnQ7XG4gICAgICAgIHZhciBldmVudElkID0gZXZlbnREaXYuaW5uZXJUZXh0O1xuXG4gICAgICAgIHZhciBldmVudERhdGEgPSBudWxsO1xuICAgICAgICBmb3IgKGxldCBldmVudEpzb24gb2YgX3RoaXMubW9kZWwuZ2V0KCdldmVudHMnKSkge1xuICAgICAgICAgICAgaWYgKGV2ZW50SnNvblsnaWQnXSA9PT0gZXZlbnRJZCkge1xuICAgICAgICAgICAgICAgIGV2ZW50RGF0YSA9IGV2ZW50SnNvbjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChldmVudERhdGEpIHtcbiAgICAgICAgICAgIF90aGlzLm1vZGVsLnNldCh7XG4gICAgICAgICAgICAgICAgJ2V2ZW50JzogZXZlbnREYXRhXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBfaW5pdGlhbGl6ZShvcHRpb25zKTtcbiAgICBvcHRpb25zID0gbnVsbDtcbiAgICByZXR1cm4gX3RoaXM7XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gRXZlbnRWaWV3OyIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgVmlldyA9IHJlcXVpcmUoJ2hhemRldi13ZWJ1dGlscy9zcmMvbXZjL1ZpZXcnKTtcblxudmFyIExvYWRpbmdWaWV3ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICB2YXIgX3RoaXMsXG4gICAgICAgICAgICBfaW5pdGlhbGl6ZTtcblxuICAgIF90aGlzID0gVmlldyhvcHRpb25zKTtcblxuICAgIF9pbml0aWFsaXplID0gZnVuY3Rpb24gKC8qb3B0aW9ucyovICkge1xuICAgICAgICBfdGhpcy5sb2FkaW5nQ291bnQgPSAwO1xuICAgICAgICBfdGhpcy5lbC5pbm5lckhUTUwgPSAnPGRpdiBjbGFzcz1cImxvYWRpbmdcIj5Mb2FkaW5nLi4uPC9kaXY+JztcbiAgICAgICAgX3RoaXMubW9kZWwub24oJ2NoYW5nZTpsb2FkaW5nJywgX3RoaXMuY2hhbmdlTG9hZGluZyk7XG4gICAgfTtcblxuICAgIF90aGlzLmNoYW5nZUxvYWRpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChfdGhpcy5tb2RlbC5nZXQoJ2xvYWRpbmcnKSA9PT0gdHJ1ZSkge1xuXG4gICAgICAgICAgICAvLyBhZGQgbG9hZGluZyBjbGFzcyB0byBtYWtlIGxvYWRpbmcgZGl2IHZpc2libGVcbiAgICAgICAgICAgIGlmIChfdGhpcy5sb2FkaW5nQ291bnQgPT09IDApIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5lbC5jbGFzc0xpc3QuYWRkKCdsb2FkaW5nLWNvbnRlbnQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF90aGlzLmxvYWRpbmdDb3VudCArPSAxO1xuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBfdGhpcy5sb2FkaW5nQ291bnQgLT0gMTtcblxuICAgICAgICAgICAgLy8gaWYgbm90aGluZyBpcyBsb2FkaW5nLCBoaWRlIHRoZSBkaXZcbiAgICAgICAgICAgIGlmIChfdGhpcy5sb2FkaW5nQ291bnQgPT09IDApIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5lbC5jbGFzc0xpc3QucmVtb3ZlKCdsb2FkaW5nLWNvbnRlbnQnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gcmVzZXQgbG9hZGluZyBjb3VudCBpZiBpdCBkcm9wcyBiZWxvdyB6ZXJvXG4gICAgICAgICAgICBpZiAoX3RoaXMubG9hZGluZ0NvdW50IDwgMCkge1xuICAgICAgICAgICAgICAgIF90aGlzLmxvYWRpbmdDb3VudCA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG5cblxuICAgIF9pbml0aWFsaXplKG9wdGlvbnMpO1xuICAgIG9wdGlvbnMgPSBudWxsO1xuICAgIHJldHVybiBfdGhpcztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTG9hZGluZ1ZpZXc7IiwiLyogZ2xvYmFsIEwgKi9cbid1c2Ugc3RyaWN0JztcblxuY29uc3QgVmlldyA9IHJlcXVpcmUoJ2hhemRldi13ZWJ1dGlscy9zcmMvbXZjL1ZpZXcnKTtcbnZhciAgR2VuZXJhdG9yID0gcmVxdWlyZSgnc2hha2VtYXAtdmlldy9tYXBzL2xheWVycy9HZW5lcmF0b3InKTtcblxuXG52YXIgTWFwVmlldyA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgdmFyIF90aGlzLFxuICAgICAgICAgICAgX2luaXRpYWxpemU7XG5cbiAgICBfdGhpcyA9IFZpZXcob3B0aW9ucyk7XG5cbiAgICBfaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uICgvKm9wdGlvbnMqLyApIHtcbiAgICAgICAgX3RoaXMuZWwuaW5uZXJIVE1MID0gJzxkaXYgY2xhc3M9XCJtYXBcIiBzdHlsZT1cImhlaWdodDoxMDAlO3dpZHRoOjEwMCVcIj48L2Rpdj4nO1xuICAgICAgICBfdGhpcy5kZWZhdWx0TGF5ZXJzID0gX3RoaXMubW9kZWwuZ2V0KCdkZWZhdWx0TGF5ZXJzJyk7XG4gICAgICAgIGxldCBtYXBFbCA9IF90aGlzLmVsLnF1ZXJ5U2VsZWN0b3IoJy5tYXAnKTtcblxuICAgICAgICBfdGhpcy5tYXAgPSBMLm1hcChtYXBFbCwge1xuICAgICAgICAgICAgc2Nyb2xsV2hlZWxab29tOiBmYWxzZVxuICAgICAgICB9KS5zZXRWaWV3KFs1MS41MDUsIC0wLjA5XSwgMTMpO1xuXG4gICAgICAgIF90aGlzLmxheWVyR2VuZXJhdG9yID0gR2VuZXJhdG9yKG9wdGlvbnMpO1xuICAgICAgICBfdGhpcy5iYXNlTGF5ZXIgPSBfdGhpcy5nZW5CYXNlTGF5ZXIoKTtcbiAgICAgICAgX3RoaXMubGF5ZXJzQ29udHJvbCA9IEwuY29udHJvbC5sYXllcnMoeydCYXNlbWFwJzogX3RoaXMuYmFzZUxheWVyfSkuYWRkVG8oX3RoaXMubWFwKTtcblxuICAgICAgICBfdGhpcy5tb2RlbC5vbignY2hhbmdlOmV2ZW50JywgX3RoaXMucmVuZGVyRXZlbnRMYXllcnMpO1xuICAgICAgICBfdGhpcy5tb2RlbC5vbignY2hhbmdlOmxheWVycycsIF90aGlzLmFkZE1hcExheWVycyk7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsYXllcnNGaW5pc2hlZCcsIF90aGlzLmFkZE1hcExheWVycyk7XG4gICAgfTtcblxuICAgIF90aGlzLmdlbkJhc2VMYXllciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGJhc2VsYXllciA9IEwudGlsZUxheWVyKCdodHRwczovL2FwaS50aWxlcy5tYXBib3guY29tL3Y0L3tpZH0ve3p9L3t4fS97eX0ucG5nP2FjY2Vzc190b2tlbj0nICsgJ3BrLmV5SjFJam9pWkhOc2IzTnJlU0lzSW1FaU9pSmphWFIxYUhKblkzRXdNREZvTW5SeFpXVnRjbTlsYVdKbUluMC4xQzNHRTBrSFBHT3BiVlY5a1R4QmxRJywge1xuICAgICAgICAgICAgbWF4Wm9vbTogMTgsXG4gICAgICAgICAgICBhdHRyaWJ1dGlvbjogJ01hcCBkYXRhICZjb3B5OyA8YSBocmVmPVwiaHR0cDovL29wZW5zdHJlZXRtYXAub3JnXCI+T3BlblN0cmVldE1hcDwvYT4gY29udHJpYnV0b3JzLCAnICtcbiAgICAgICAgICAgICAgICAnPGEgaHJlZj1cImh0dHA6Ly9jcmVhdGl2ZWNvbW1vbnMub3JnL2xpY2Vuc2VzL2J5LXNhLzIuMC9cIj5DQy1CWS1TQTwvYT4sICcgK1xuICAgICAgICAgICAgICAgICdJbWFnZXJ5IO+/vSA8YSBocmVmPVwiaHR0cDovL21hcGJveC5jb21cIj5NYXBib3g8L2E+JyxcbiAgICAgICAgICAgIGlkOiAnbWFwYm94LnN0cmVldHMnXG4gICAgICAgIH0pLmFkZFRvKF90aGlzLm1hcCk7XG5cbiAgICAgICAgcmV0dXJuIGJhc2VsYXllcjtcbiAgICB9O1xuXG4gICAgX3RoaXMucmVuZGVyRXZlbnRMYXllcnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIGNsZWFyIG1hcFxuICAgICAgICBfdGhpcy5jbGVhck1hcExheWVycygpO1xuICAgICAgICBcbiAgICAgICAgLy8gZ2VuZXJhdGUgbmV3IGxheWVyc1xuICAgICAgICBfdGhpcy5iYXNlTGF5ZXIgPSBfdGhpcy5nZW5CYXNlTGF5ZXIoKTtcbiAgICAgICAgdmFyIGV2ZW50ID0gX3RoaXMubW9kZWwuZ2V0KCdldmVudCcpO1xuICAgICAgICBcbiAgICAgICAgX3RoaXMubGF5ZXJHZW5lcmF0b3IuZ2VuZXJhdGVMYXllcnMoZXZlbnQpO1xuICAgICAgICBfdGhpcy5sYXllcnNDb250cm9sID0gTC5jb250cm9sLmxheWVycyh7J0Jhc2VtYXAnOiBfdGhpcy5iYXNlTGF5ZXJ9KS5hZGRUbyhfdGhpcy5tYXApO1xuICAgIH07XG5cbiAgICBfdGhpcy5hZGRNYXBMYXllcnMgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICAvLyBjbGVhciBtYXBcbiAgICAgICAgX3RoaXMuY2xlYXJNYXBMYXllcnMoKTtcblxuICAgICAgICAvLyBjb2xsZWN0IGxheWVyc1xuICAgICAgICBfdGhpcy5iYXNlTGF5ZXIgPSBfdGhpcy5nZW5CYXNlTGF5ZXIoKTtcbiAgICAgICAgdmFyIGxheWVycyA9IGUuZGV0YWlsO1xuXG4gICAgICAgIF90aGlzLmxheWVyc0NvbnRyb2wgPSBMLmNvbnRyb2wubGF5ZXJzKHsnQmFzZW1hcCc6IF90aGlzLmJhc2VMYXllcn0sIGxheWVycykuYWRkVG8oX3RoaXMubWFwKTtcblxuICAgICAgICB2YXIgbGF5ZXJBcnIgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgbGF5ZXIgaW4gbGF5ZXJzKSB7XG4gICAgICAgICAgICBpZiAoX3RoaXMuZGVmYXVsdExheWVycy5pbmRleE9mKGxheWVyKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgbGF5ZXJzW2xheWVyXS5hZGRUbyhfdGhpcy5tYXApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGF5ZXJBcnIucHVzaChsYXllcnNbbGF5ZXJdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBncm91cCA9IEwuZmVhdHVyZUdyb3VwKGxheWVyQXJyKTtcbiAgICAgICAgX3RoaXMubWFwLmZpdEJvdW5kcyhncm91cC5nZXRCb3VuZHMoKS5wYWQoMC41KSk7XG5cbiAgICB9O1xuXG4gICAgX3RoaXMuY2xlYXJNYXBMYXllcnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIF90aGlzLm1hcC5lYWNoTGF5ZXIoZnVuY3Rpb24gKGxheWVyKSB7XG4gICAgICAgICAgICBfdGhpcy5tYXAucmVtb3ZlTGF5ZXIobGF5ZXIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBfdGhpcy5sYXllcnNDb250cm9sLnJlbW92ZUZyb20oX3RoaXMubWFwKTtcbiAgICB9O1xuXG4gICAgX2luaXRpYWxpemUob3B0aW9ucyk7XG4gICAgb3B0aW9ucyA9IG51bGw7XG4gICAgcmV0dXJuIF90aGlzO1xufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IE1hcFZpZXc7IiwiJ3VzZSBzdHJpY3QnO1xuY29uc3QgZXZlbnRzID0gcmVxdWlyZSgnc2hha2VtYXAtdmlldy9tYXBzL2xheWVycy9ldmVudHMnKSxcbiAgICAgICAgVmlldyA9IHJlcXVpcmUoJ2hhemRldi13ZWJ1dGlscy9zcmMvbXZjL1ZpZXcnKTtcblxudmFyIGxheWVyc0luID0gW3JlcXVpcmUoJ3NoYWtlbWFwLXZpZXcvbWFwcy9sYXllcnMvZXBpY2VudGVyJyksXG4gICAgcmVxdWlyZSgnc2hha2VtYXAtdmlldy9tYXBzL2xheWVycy9jb250X3BnYScpXTtcblxudmFyIEdlbmVyYXRvciA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgdmFyIF90aGlzLFxuICAgICAgICAgICAgX2luaXRpYWxpemU7XG5cbiAgICBfdGhpcyA9IFZpZXcob3B0aW9ucyk7XG5cbiAgICBfaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uICgvKm9wdGlvbnMqLykge1xuICAgICAgICBfdGhpcy5sYXllckNvdW50ID0gMDtcbiAgICAgICAgX3RoaXMubGF5ZXJzID0ge307XG4gICAgICAgIF90aGlzLmxheWVyc0luID0gbGF5ZXJzSW47XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsYXllckZpbmlzaGVkJywgX3RoaXMuYWRkTGF5ZXIpO1xuICAgIH07XG5cblxuICAgIF90aGlzLmdlbmVyYXRlTGF5ZXJzID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIF90aGlzLmxheWVyQ291bnQgPSAwO1xuICAgICAgICBfdGhpcy5sYXllcnMgPSB7fTtcbiAgICAgICAgaWYgKGV2ZW50KSB7XG4gICAgICAgICAgICBmb3IgKHZhciByYXdMYXllciBvZiBfdGhpcy5sYXllcnNJbikge1xuICAgICAgICAgICAgICAgIHJhd0xheWVyLmdlbmVyYXRlTGF5ZXIoZXZlbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcblxuICAgIF90aGlzLmFkZExheWVyID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgdmFyIGxheWVyID0gZS5kZXRhaWw7XG5cbiAgICAgICAgLy8gY29sbGVjdCBsYXllcnMgdGhhdCByZW5kZXJlZCBzdWNjZXNzZnVsbHlcbiAgICAgICAgaWYgKGxheWVyLmxheWVyKSB7XG4gICAgICAgICAgICBfdGhpcy5sYXllcnNbbGF5ZXIubmFtZV0gPSBsYXllci5sYXllcjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEtlZXAgdHJhY2sgb2YgYWxsIGxheWVycyB0aGF0IGhhdmUgcmV0dXJuZWRcbiAgICAgICAgX3RoaXMubGF5ZXJDb3VudCArPSAxO1xuXG4gICAgICAgIC8vIHNldCB0aGUgbW9kZWwgaWYgYWxsIHRoZSBsYXllcnMgYXJlIHJlYWR5XG4gICAgICAgIGlmIChfdGhpcy5sYXllckNvdW50ID09PSBfdGhpcy5sYXllcnNJbi5sZW5ndGgpIHtcbiAgICAgICAgICAgIGV2ZW50cy5sYXllcnNGaW5pc2hlZEV2ZW50KF90aGlzLmxheWVycyk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgX2luaXRpYWxpemUob3B0aW9ucyk7XG4gICAgb3B0aW9ucyA9IG51bGw7XG4gICAgcmV0dXJuIF90aGlzO1xufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IEdlbmVyYXRvcjsiLCIvKiBnbG9iYWwgTCAqL1xuJ3VzZSBzdHJpY3QnO1xuY29uc3QgWGhyID0gcmVxdWlyZSgndXRpbC9YaHInKTtcbmNvbnN0IGV2ZW50cyA9IHJlcXVpcmUoJ3NoYWtlbWFwLXZpZXcvbWFwcy9sYXllcnMvZXZlbnRzJyk7XG5cbnZhciBsYXllciA9IHtpZDogJ2Rvd25sb2FkL2NvbnRfcGdhLmpzb24nfTtcbmxheWVyLm5hbWUgPSAnUEdBIENvbnRvdXJzJztcbmxheWVyLmdlbmVyYXRlTGF5ZXIgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICBsYXllci5sYXllciA9IG51bGw7XG4gICAgdmFyIHByb2R1Y3QgPSBudWxsO1xuICAgIHZhciBjb250ZW50cyA9IGV2ZW50LnNoYWtlbWFwWzBdLmNvbnRlbnRzO1xuXG4gICAgZm9yIChsZXQgcCBpbiBjb250ZW50cykge1xuICAgICAgICBpZiAocCA9PT0gbGF5ZXIuaWQpIHtcbiAgICAgICAgICAgIHByb2R1Y3QgPSBjb250ZW50c1twXTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHByb2R1Y3QpIHtcbiAgICAgICAgWGhyLmFqYXgoe1xuICAgICAgICAgICAgdXJsOiBwcm9kdWN0LnVybCxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChqc29uKSB7XG4gICAgICAgICAgICAgICAgbGF5ZXJbJ2xheWVyJ10gPSBMLmdlb0pzb24oanNvbik7XG4gICAgICAgICAgICAgICAgZXZlbnRzLmxheWVyRmluaXNoZWRFdmVudChsYXllcik7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBldmVudHMubGF5ZXJGaW5pc2hlZEV2ZW50KGxheWVyKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkb25lOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGV2ZW50cy5sYXllckZpbmlzaGVkRXZlbnQobGF5ZXIpO1xuICAgIH1cbn07XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGxheWVyOyIsIi8qIGdsb2JhbCBMICovXG4ndXNlIHN0cmljdCc7XG5jb25zdCBldmVudHMgPSByZXF1aXJlKCdzaGFrZW1hcC12aWV3L21hcHMvbGF5ZXJzL2V2ZW50cycpLFxuICAgICAgICBYaHIgPSByZXF1aXJlKCd1dGlsL1hocicpO1xuXG52YXIgbGF5ZXIgPSB7cHJvZHVjdElkOiAnZG93bmxvYWQvZ3JpZC54bWwnfTtcbmxheWVyLmdlbmVyYXRlTGF5ZXIgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICB2YXIgcHJvZHVjdCA9IG51bGw7XG4gICAgdmFyIGNvbnRlbnRzID0gZXZlbnQuc2hha2VtYXBbMF0uY29udGVudHM7XG5cbiAgICBmb3IgKGxldCBwIGluIGNvbnRlbnRzKSB7XG4gICAgICAgIGlmIChwID09PSBsYXllci5wcm9kdWN0SWQpIHtcbiAgICAgICAgICAgIHByb2R1Y3QgPSBjb250ZW50c1twXTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHByb2R1Y3QpIHtcbiAgICAgICAgWGhyLmFqYXgoe1xuICAgICAgICAgICAgdXJsOiBwcm9kdWN0LnVybCxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uICh4bWwpIHtcbiAgICAgICAgICAgICAgICB2YXIgcGFyc2VyID0gbmV3IERPTVBhcnNlcigpO1xuICAgICAgICAgICAgICAgIHZhciB4bWxEb2MgPSBwYXJzZXIucGFyc2VGcm9tU3RyaW5nKHhtbCwndGV4dC94bWwnKTtcbiAgICAgICAgICAgICAgICB2YXIgbGF0LFxuICAgICAgICAgICAgICAgICAgICAgICAgbG9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgcG9wdXBIdG1sO1xuXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgbm9kZSBvZiB4bWxEb2MuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3NoYWtlbWFwX2dyaWQnKVswXS5jaGlsZE5vZGVzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChub2RlLm5vZGVOYW1lID09PSAnZXZlbnQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsYXQgPSBub2RlLmdldEF0dHJpYnV0ZSgnbGF0Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb24gPSBub2RlLmdldEF0dHJpYnV0ZSgnbG9uJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHBvcHVwSHRtbCA9IFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8dGFibGU+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzx0cj48dGg+JyArIG5vZGUuZ2V0QXR0cmlidXRlKCdldmVudF9pZCcpICsgJzwvdGg+PC90cj4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPHRyPjx0YWJsZT48dGg+TWFnbml0dWRlOjwvdGg+PHRkPicgKyBub2RlLmdldEF0dHJpYnV0ZSgnbWFnbml0dWRlJykgKyAnPC90ZD48L3RhYmxlPjwvdHI+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzx0cj48dGFibGU+PHRoPkRlcHRoOjwvdGg+PHRkPicgKyBub2RlLmdldEF0dHJpYnV0ZSgnZGVwdGgnKSArICc8L3RkPjwvdGFibGU+PC90cj4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPHRyPjx0YWJsZT48dGg+TG9jYXRpb246PC90aD48dGQ+JyArIG5vZGUuZ2V0QXR0cmlidXRlKCdsYXQnKSArICcsICcgKyBub2RlLmdldEF0dHJpYnV0ZSgnbG9uJykgKyAnPC90ZD48L3RhYmxlPjwvdHI+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzwvdGFibGU+JztcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgbGF5ZXJbJ2xheWVyJ10gPSBMLm1hcmtlcihbbGF0LCBsb25dKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmJpbmRQb3B1cChwb3B1cEh0bWwpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAub3BlblBvcHVwKCk7XG4gICAgICAgICAgICAgICAgZXZlbnRzLmxheWVyRmluaXNoZWRFdmVudChsYXllcik7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBldmVudHMubGF5ZXJGaW5pc2hlZEV2ZW50KGxheWVyKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkb25lOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG5cbmxheWVyLm5hbWUgPSAnRXBpY2VudGVyJztcblxubW9kdWxlLmV4cG9ydHMgPSBsYXllcjsiLCJ2YXIgbGF5ZXJGaW5pc2hlZEV2ZW50ID0gZnVuY3Rpb24gKGxheWVyKSB7XG4gICAgdmFyIGV2dCA9IG5ldyBDdXN0b21FdmVudCgnbGF5ZXJGaW5pc2hlZCcsIHtkZXRhaWw6IGxheWVyfSk7XG4gICAgd2luZG93LmRpc3BhdGNoRXZlbnQoZXZ0KTtcbn07XG5cbnZhciBsYXllcnNGaW5pc2hlZEV2ZW50ID0gZnVuY3Rpb24gKGxheWVycykge1xuICAgIHZhciBldnQgPSBuZXcgQ3VzdG9tRXZlbnQoJ2xheWVyc0ZpbmlzaGVkJywge2RldGFpbDogbGF5ZXJzfSk7XG4gICAgd2luZG93LmRpc3BhdGNoRXZlbnQoZXZ0KTtcbn07XG5cbnZhciBldmVudHMgPSB7bGF5ZXJzRmluaXNoZWRFdmVudDogbGF5ZXJzRmluaXNoZWRFdmVudCxcbiAgICBsYXllckZpbmlzaGVkRXZlbnQ6IGxheWVyRmluaXNoZWRFdmVudH07XG5cbm1vZHVsZS5leHBvcnRzID0gZXZlbnRzOyJdfQ==
