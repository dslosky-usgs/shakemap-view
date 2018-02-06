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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvaGF6ZGV2LXdlYnV0aWxzL3NyYy9tdmMvTW9kZWwuanMiLCJub2RlX21vZHVsZXMvaGF6ZGV2LXdlYnV0aWxzL3NyYy9tdmMvVmlldy5qcyIsIm5vZGVfbW9kdWxlcy9oYXpkZXYtd2VidXRpbHMvc3JjL3V0aWwvRXZlbnRzLmpzIiwibm9kZV9tb2R1bGVzL2hhemRldi13ZWJ1dGlscy9zcmMvdXRpbC9VdGlsLmpzIiwibm9kZV9tb2R1bGVzL2hhemRldi13ZWJ1dGlscy9zcmMvdXRpbC9YaHIuanMiLCJzcmMvaHRkb2NzL2pzL2luZGV4LmpzIiwic3JjL2h0ZG9jcy9qcy9zaGFrZW1hcC12aWV3L0FwcC5qcyIsInNyYy9odGRvY3MvanMvc2hha2VtYXAtdmlldy9TaGFrZU1hcE1vZGVsLmpzIiwic3JjL2h0ZG9jcy9qcy9zaGFrZW1hcC12aWV3L2V2ZW50cy9FdmVudHNWaWV3LmpzIiwic3JjL2h0ZG9jcy9qcy9zaGFrZW1hcC12aWV3L2xvYWRpbmcvTG9hZGluZ1ZpZXcuanMiLCJzcmMvaHRkb2NzL2pzL3NoYWtlbWFwLXZpZXcvbWFwcy9NYXBWaWV3LmpzIiwic3JjL2h0ZG9jcy9qcy9zaGFrZW1hcC12aWV3L21hcHMvbGF5ZXJzL0dlbmVyYXRvci5qcyIsInNyYy9odGRvY3MvanMvc2hha2VtYXAtdmlldy9tYXBzL2xheWVycy9jb250X3BnYS5qcyIsInNyYy9odGRvY3MvanMvc2hha2VtYXAtdmlldy9tYXBzL2xheWVycy9lcGljZW50ZXIuanMiLCJzcmMvaHRkb2NzL2pzL3NoYWtlbWFwLXZpZXcvbWFwcy9sYXllcnMvZXZlbnRzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDak1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaFdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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U0FBUyxFQUFDLHFCQUFxQixtQkFBdEI7QUFDVCx3QkFBb0Isa0JBRFgsRUFBYjs7QUFHQSxPQUFPLE9BQVAsR0FBaUIsTUFBakIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgRXZlbnRzID0gcmVxdWlyZSgnLi4vdXRpbC9FdmVudHMnKSxcbiAgICBVdGlsID0gcmVxdWlyZSgnLi4vdXRpbC9VdGlsJyk7XG5cbi8qKlxuICogQ29uc3RydWN0b3JcbiAqXG4gKiBAcGFyYW0gZGF0YSB7T2JqZWN0fVxuICogICAgICBrZXkvdmFsdWUgYXR0cmlidXRlcyBvZiB0aGlzIG1vZGVsLlxuICovXG52YXIgTW9kZWwgPSBmdW5jdGlvbiAoZGF0YSkge1xuICB2YXIgX3RoaXMsXG4gICAgICBfaW5pdGlhbGl6ZSxcblxuICAgICAgX21vZGVsO1xuXG5cbiAgX3RoaXMgPSBFdmVudHMoKTtcblxuICBfaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBfbW9kZWwgPSBVdGlsLmV4dGVuZCh7fSwgZGF0YSk7XG5cbiAgICAvLyB0cmFjayBpZCBhdCB0b3AgbGV2ZWxcbiAgICBpZiAoZGF0YSAmJiBkYXRhLmhhc093blByb3BlcnR5KCdpZCcpKSB7XG4gICAgICBfdGhpcy5pZCA9IGRhdGEuaWQ7XG4gICAgfVxuXG4gICAgZGF0YSA9IG51bGw7XG4gIH07XG5cbiAgLyoqXG4gICAqIEdldCBvbmUgb3IgbW9yZSB2YWx1ZXMuXG4gICAqXG4gICAqIEBwYXJhbSBrZXkge1N0cmluZ31cbiAgICogICAgICB0aGUgdmFsdWUgdG8gZ2V0OyB3aGVuIGtleSBpcyB1bmRlZmluZWQsIHJldHVybnMgdGhlIG9iamVjdCB3aXRoIGFsbFxuICAgKiAgICAgIHZhbHVlcy5cbiAgICogQHJldHVyblxuICAgKiAgICAgIC0gaWYga2V5IGlzIHNwZWNpZmllZCwgdGhlIHZhbHVlIG9yIG51bGwgaWYgbm8gdmFsdWUgZXhpc3RzLlxuICAgKiAgICAgIC0gd2hlbiBrZXkgaXMgbm90IHNwZWNpZmllZCwgdGhlIHVuZGVybHlpbmcgb2JqZWN0IGlzIHJldHVybmVkLlxuICAgKiAgICAgICAgKEFueSBjaGFuZ2VzIHRvIHRoaXMgdW5kZXJseWluZyBvYmplY3Qgd2lsbCBub3QgdHJpZ2dlciBldmVudHMhISEpXG4gICAqL1xuICBfdGhpcy5nZXQgPSBmdW5jdGlvbiAoa2V5KSB7XG4gICAgaWYgKHR5cGVvZihrZXkpID09PSAndW5kZWZpbmVkJykge1xuICAgICAgcmV0dXJuIF9tb2RlbDtcbiAgICB9XG5cbiAgICBpZiAoX21vZGVsLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgIHJldHVybiBfbW9kZWxba2V5XTtcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfTtcblxuICAvKipcbiAgICogVXBkYXRlIG9uZSBvciBtb3JlIHZhbHVlcy5cbiAgICpcbiAgICogQHBhcmFtIGRhdGEge09iamVjdH1cbiAgICogICAgICB0aGUga2V5cyBhbmQgdmFsdWVzIHRvIHVwZGF0ZS5cbiAgICogQHBhcmFtIG9wdGlvbnMge09iamVjdH1cbiAgICogICAgICBvcHRpb25zIGZvciB0aGlzIG1ldGhvZC5cbiAgICogQHBhcmFtIG9wdGlvbnMuc2lsZW50IHtCb29sZWFufVxuICAgKiAgICAgIGRlZmF1bHQgZmFsc2UuIHRydWUgdG8gc3VwcHJlc3MgYW55IGV2ZW50cyB0aGF0IHdvdWxkIG90aGVyd2lzZSBiZVxuICAgKiAgICAgIHRyaWdnZXJlZC5cbiAgICovXG4gIF90aGlzLnNldCA9IGZ1bmN0aW9uIChkYXRhLCBvcHRpb25zKSB7XG4gICAgLy8gZGV0ZWN0IGNoYW5nZXNcbiAgICB2YXIgY2hhbmdlZCA9IHt9LFxuICAgICAgYW55Q2hhbmdlZCA9IGZhbHNlLFxuICAgICAgYztcblxuICAgIGZvciAoYyBpbiBkYXRhKSB7XG4gICAgICBpZiAoIV9tb2RlbC5oYXNPd25Qcm9wZXJ0eShjKSB8fCBfbW9kZWxbY10gIT09IGRhdGFbY10pIHtcbiAgICAgICAgY2hhbmdlZFtjXSA9IGRhdGFbY107XG4gICAgICAgIGFueUNoYW5nZWQgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIHBlcnNpc3QgY2hhbmdlc1xuICAgIF9tb2RlbCA9IFV0aWwuZXh0ZW5kKF9tb2RlbCwgZGF0YSk7XG5cbiAgICAvLyBpZiBpZCBpcyBjaGFuZ2luZywgdXBkYXRlIHRoZSBtb2RlbCBpZFxuICAgIGlmIChkYXRhICYmIGRhdGEuaGFzT3duUHJvcGVydHkoJ2lkJykpIHtcbiAgICAgIF90aGlzLmlkID0gZGF0YS5pZDtcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLmhhc093blByb3BlcnR5KCdzaWxlbnQnKSAmJiBvcHRpb25zLnNpbGVudCkge1xuICAgICAgLy8gZG9uJ3QgdHJpZ2dlciBhbnkgZXZlbnRzXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gdHJpZ2dlciBldmVudHMgYmFzZWQgb24gY2hhbmdlc1xuICAgIGlmIChhbnlDaGFuZ2VkIHx8XG4gICAgICAgIChvcHRpb25zICYmIG9wdGlvbnMuaGFzT3duUHJvcGVydHkoJ2ZvcmNlJykgJiYgb3B0aW9ucy5mb3JjZSkpIHtcbiAgICAgIGZvciAoYyBpbiBjaGFuZ2VkKSB7XG4gICAgICAgIC8vIGV2ZW50cyBzcGVjaWZpYyB0byBhIHByb3BlcnR5XG4gICAgICAgIF90aGlzLnRyaWdnZXIoJ2NoYW5nZTonICsgYywgY2hhbmdlZFtjXSk7XG4gICAgICB9XG4gICAgICAvLyBnZW5lcmljIGV2ZW50IGZvciBhbnkgY2hhbmdlXG4gICAgICBfdGhpcy50cmlnZ2VyKCdjaGFuZ2UnLCBjaGFuZ2VkKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIE92ZXJyaWRlIHRvSlNPTiBtZXRob2QgdG8gc2VyaWFsaXplIG9ubHkgbW9kZWwgZGF0YS5cbiAgICovXG4gIF90aGlzLnRvSlNPTiA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIganNvbiA9IFV0aWwuZXh0ZW5kKHt9LCBfbW9kZWwpLFxuICAgICAgICBrZXksXG4gICAgICAgIHZhbHVlO1xuXG4gICAgZm9yIChrZXkgaW4ganNvbikge1xuICAgICAgdmFsdWUgPSBqc29uW2tleV07XG5cbiAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmXG4gICAgICAgICAgdmFsdWUgIT09IG51bGwgJiZcbiAgICAgICAgICB0eXBlb2YgdmFsdWUudG9KU09OID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGpzb25ba2V5XSA9IHZhbHVlLnRvSlNPTigpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBqc29uO1xuICB9O1xuXG5cbiAgX2luaXRpYWxpemUoKTtcbiAgcmV0dXJuIF90aGlzO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBNb2RlbDtcbiIsIid1c2Ugc3RyaWN0Jztcbi8qKlxuICogQSBsaWdodHdlaWdodCB2aWV3IGNsYXNzLlxuICpcbiAqIFByaW1hcmlseSBtYW5hZ2VzIGFuIGVsZW1lbnQgd2hlcmUgYSB2aWV3IGNhbiByZW5kZXIgaXRzIGRhdGEuXG4gKi9cblxuXG52YXIgTW9kZWwgPSByZXF1aXJlKCcuL01vZGVsJyksXG5cbiAgICBFdmVudHMgPSByZXF1aXJlKCcuLi91dGlsL0V2ZW50cycpLFxuICAgIFV0aWwgPSByZXF1aXJlKCcuLi91dGlsL1V0aWwnKTtcblxuXG52YXIgX0RFRkFVTFRTID0ge1xufTtcblxuXG4vKiogY3JlYXRlIGEgbmV3IHZpZXcuICovXG52YXIgVmlldyA9IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgdmFyIF90aGlzLFxuICAgICAgX2luaXRpYWxpemUsXG5cbiAgICAgIF9kZXN0cm95TW9kZWw7XG5cblxuICBfdGhpcyA9IEV2ZW50cygpO1xuXG4gIC8qKlxuICAgKiBAY29uc3RydWN0b3JcbiAgICpcbiAgICovXG4gIF9pbml0aWFsaXplID0gZnVuY3Rpb24gKHBhcmFtcykge1xuICAgIHBhcmFtcyA9IFV0aWwuZXh0ZW5kKHt9LCBfREVGQVVMVFMsIHBhcmFtcyk7XG5cbiAgICAvLyBFbGVtZW50IHdoZXJlIHRoaXMgdmlldyBpcyByZW5kZXJlZFxuICAgIF90aGlzLmVsID0gKHBhcmFtcyAmJiBwYXJhbXMuaGFzT3duUHJvcGVydHkoJ2VsJykpID9cbiAgICAgICAgcGFyYW1zLmVsIDogZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cbiAgICBfdGhpcy5tb2RlbCA9IHBhcmFtcy5tb2RlbDtcblxuICAgIGlmICghX3RoaXMubW9kZWwpIHtcbiAgICAgIF90aGlzLm1vZGVsID0gTW9kZWwoe30pO1xuICAgICAgX2Rlc3Ryb3lNb2RlbCA9IHRydWU7XG4gICAgfVxuXG4gICAgX3RoaXMubW9kZWwub24oJ2NoYW5nZScsICdyZW5kZXInLCBfdGhpcyk7XG4gIH07XG5cblxuICAvKipcbiAgICogQVBJIE1ldGhvZFxuICAgKlxuICAgKiBSZW5kZXJzIHRoZSB2aWV3XG4gICAqL1xuICBfdGhpcy5yZW5kZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgLy8gSW1wZWxlbWVudGF0aW9ucyBzaG91bGQgdXBkYXRlIHRoZSB2aWV3IGJhc2VkIG9uIHRoZSBjdXJyZW50XG4gICAgLy8gbW9kZWwgcHJvcGVydGllcy5cbiAgfTtcblxuICAvKipcbiAgICogQVBJIE1ldGhvZFxuICAgKlxuICAgKiBDbGVhbnMgdXAgcmVzb3VyY2VzIGFsbG9jYXRlZCBieSB0aGUgdmlldy4gU2hvdWxkIGJlIGNhbGxlZCBiZWZvcmVcbiAgICogZGlzY2FyZGluZyBhIHZpZXcuXG4gICAqL1xuICBfdGhpcy5kZXN0cm95ID0gVXRpbC5jb21wb3NlKGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoX3RoaXMgPT09ICBudWxsKSB7XG4gICAgICByZXR1cm47IC8vIGFscmVhZHkgZGVzdHJveWVkXG4gICAgfVxuXG4gICAgX3RoaXMubW9kZWwub2ZmKCdjaGFuZ2UnLCAncmVuZGVyJywgX3RoaXMpO1xuXG4gICAgaWYgKF9kZXN0cm95TW9kZWwpIHtcbiAgICAgIF90aGlzLm1vZGVsLmRlc3Ryb3koKTtcbiAgICB9XG5cbiAgICBfZGVzdHJveU1vZGVsID0gbnVsbDtcblxuICAgIF90aGlzLm1vZGVsID0gbnVsbDtcbiAgICBfdGhpcy5lbCA9IG51bGw7XG5cbiAgICBfaW5pdGlhbGl6ZSA9IG51bGw7XG4gICAgX3RoaXMgPSBudWxsO1xuICB9LCBfdGhpcy5kZXN0cm95KTtcblxuXG4gIF9pbml0aWFsaXplKHBhcmFtcyk7XG4gIHBhcmFtcyA9IG51bGw7XG4gIHJldHVybiBfdGhpcztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gVmlldztcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIF9fSU5TVEFOQ0VfXyA9IG51bGw7XG5cblxudmFyIF9faXNfc3RyaW5nID0gZnVuY3Rpb24gKG9iaikge1xuICByZXR1cm4gKHR5cGVvZiBvYmogPT09ICdzdHJpbmcnIHx8IG9iaiBpbnN0YW5jZW9mIFN0cmluZyk7XG59O1xuXG5cbnZhciBFdmVudHMgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBfdGhpcyxcbiAgICAgIF9pbml0aWFsaXplLFxuXG4gICAgICBfbGlzdGVuZXJzO1xuXG5cbiAgX3RoaXMgPSB7fTtcblxuICBfaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAvLyBtYXAgb2YgbGlzdGVuZXJzIGJ5IGV2ZW50IHR5cGVcbiAgICBfbGlzdGVuZXJzID0ge307XG4gIH07XG5cblxuICAvKipcbiAgICogRnJlZSBhbGwgcmVmZXJlbmNlcy5cbiAgICovXG4gIF90aGlzLmRlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7XG4gICAgX2luaXRpYWxpemUgPSBudWxsO1xuICAgIF9saXN0ZW5lcnMgPSBudWxsO1xuICAgIF90aGlzID0gbnVsbDtcbiAgfTtcblxuICAvKipcbiAgICogUmVtb3ZlIGFuIGV2ZW50IGxpc3RlbmVyXG4gICAqXG4gICAqIE9taXR0aW5nIGNhbGxiYWNrIGNsZWFycyBhbGwgbGlzdGVuZXJzIGZvciBnaXZlbiBldmVudC5cbiAgICogT21pdHRpbmcgZXZlbnQgY2xlYXJzIGFsbCBsaXN0ZW5lcnMgZm9yIGFsbCBldmVudHMuXG4gICAqXG4gICAqIEBwYXJhbSBldmVudCB7U3RyaW5nfVxuICAgKiAgICAgIGV2ZW50IG5hbWUgdG8gdW5iaW5kLlxuICAgKiBAcGFyYW0gY2FsbGJhY2sge0Z1bmN0aW9ufVxuICAgKiAgICAgIGNhbGxiYWNrIHRvIHVuYmluZC5cbiAgICogQHBhcmFtIGNvbnRleHQge09iamVjdH1cbiAgICogICAgICBjb250ZXh0IGZvciBcInRoaXNcIiB3aGVuIGNhbGxiYWNrIGlzIGNhbGxlZFxuICAgKi9cbiAgX3RoaXMub2ZmID0gZnVuY3Rpb24gKGV2dCwgY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICB2YXIgaTtcblxuICAgIGlmICh0eXBlb2YgZXZ0ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgLy8gcmVtb3ZpbmcgYWxsIGxpc3RlbmVycyBvbiB0aGlzIG9iamVjdFxuICAgICAgX2xpc3RlbmVycyA9IG51bGw7XG4gICAgICBfbGlzdGVuZXJzID0ge307XG4gICAgfSBlbHNlIGlmICghX2xpc3RlbmVycy5oYXNPd25Qcm9wZXJ0eShldnQpKSB7XG4gICAgICAvLyBubyBsaXN0ZW5lcnMsIG5vdGhpbmcgdG8gZG9cbiAgICAgIHJldHVybjtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIC8vIHJlbW92aW5nIGFsbCBsaXN0ZW5lcnMgZm9yIHRoaXMgZXZlbnRcbiAgICAgIGRlbGV0ZSBfbGlzdGVuZXJzW2V2dF07XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBsaXN0ZW5lciA9IG51bGw7XG5cbiAgICAgIC8vIHNlYXJjaCBmb3IgY2FsbGJhY2sgdG8gcmVtb3ZlXG4gICAgICBmb3IgKGkgPSBfbGlzdGVuZXJzW2V2dF0ubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgbGlzdGVuZXIgPSBfbGlzdGVuZXJzW2V2dF1baV07XG5cbiAgICAgICAgaWYgKGxpc3RlbmVyLmNhbGxiYWNrID09PSBjYWxsYmFjayAmJlxuICAgICAgICAgICAgKCFjb250ZXh0IHx8IGxpc3RlbmVyLmNvbnRleHQgPT09IGNvbnRleHQpKSB7XG5cbiAgICAgICAgICAvLyBmb3VuZCBjYWxsYmFjaywgcmVtb3ZlXG4gICAgICAgICAgX2xpc3RlbmVyc1tldnRdLnNwbGljZShpLDEpO1xuXG4gICAgICAgICAgaWYgKGNvbnRleHQpIHtcbiAgICAgICAgICAgIC8vIGZvdW5kIGNhbGxiYWNrIHdpdGggY29udGV4dCwgc3RvcCBzZWFyY2hpbmdcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBjbGVhbnVwIGlmIGxhc3QgY2FsbGJhY2sgb2YgdGhpcyB0eXBlXG4gICAgICBpZiAoX2xpc3RlbmVyc1tldnRdLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBkZWxldGUgX2xpc3RlbmVyc1tldnRdO1xuICAgICAgfVxuXG4gICAgICBsaXN0ZW5lciA9IG51bGw7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBBZGQgYW4gZXZlbnQgbGlzdGVuZXJcbiAgICpcbiAgICogQHBhcmFtIGV2ZW50IHtTdHJpbmd9XG4gICAqICAgICAgZXZlbnQgbmFtZSAoc2luZ3VsYXIpLiAgRS5nLiAncmVzZXQnXG4gICAqIEBwYXJhbSBjYWxsYmFjayB7RnVuY3Rpb259XG4gICAqICAgICAgZnVuY3Rpb24gdG8gY2FsbCB3aGVuIGV2ZW50IGlzIHRyaWdnZXJlZC5cbiAgICogQHBhcmFtIGNvbnRleHQge09iamVjdH1cbiAgICogICAgICBjb250ZXh0IGZvciBcInRoaXNcIiB3aGVuIGNhbGxiYWNrIGlzIGNhbGxlZFxuICAgKi9cbiAgX3RoaXMub24gPSBmdW5jdGlvbiAoZXZlbnQsIGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgaWYgKCEoKGNhbGxiYWNrIHx8ICFjYWxsYmFjay5hcHBseSkgfHxcbiAgICAgICAgKGNvbnRleHQgJiYgX19pc19zdHJpbmcoY2FsbGJhY2spICYmIGNvbnRleHRbY2FsbGJhY2tdLmFwcGx5KSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2FsbGJhY2sgcGFyYW1ldGVyIGlzIG5vdCBjYWxsYWJsZS4nKTtcbiAgICB9XG5cbiAgICBpZiAoIV9saXN0ZW5lcnMuaGFzT3duUHJvcGVydHkoZXZlbnQpKSB7XG4gICAgICAvLyBmaXJzdCBsaXN0ZW5lciBmb3IgZXZlbnQgdHlwZVxuICAgICAgX2xpc3RlbmVyc1tldmVudF0gPSBbXTtcbiAgICB9XG5cbiAgICAvLyBhZGQgbGlzdGVuZXJcbiAgICBfbGlzdGVuZXJzW2V2ZW50XS5wdXNoKHtcbiAgICAgIGNhbGxiYWNrOiBjYWxsYmFjayxcbiAgICAgIGNvbnRleHQ6IGNvbnRleHRcbiAgICB9KTtcbiAgfTtcblxuICAvKipcbiAgICogVHJpZ2dlciBhbiBldmVudFxuICAgKlxuICAgKiBAcGFyYW0gZXZlbnQge1N0cmluZ31cbiAgICogICAgICBldmVudCBuYW1lLlxuICAgKiBAcGFyYW0gYXJncyB74oCmfVxuICAgKiAgICAgIHZhcmlhYmxlIGxlbmd0aCBhcmd1bWVudHMgYWZ0ZXIgZXZlbnQgYXJlIHBhc3NlZCB0byBsaXN0ZW5lcnMuXG4gICAqL1xuICBfdGhpcy50cmlnZ2VyID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgdmFyIGFyZ3MsXG4gICAgICAgIGksXG4gICAgICAgIGxlbixcbiAgICAgICAgbGlzdGVuZXIsXG4gICAgICAgIGxpc3RlbmVycztcblxuICAgIGlmIChfbGlzdGVuZXJzLmhhc093blByb3BlcnR5KGV2ZW50KSkge1xuXG4gICAgICBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICAgIGxpc3RlbmVycyA9IF9saXN0ZW5lcnNbZXZlbnRdLnNsaWNlKDApO1xuXG4gICAgICBmb3IgKGkgPSAwLCBsZW4gPSBsaXN0ZW5lcnMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgbGlzdGVuZXIgPSBsaXN0ZW5lcnNbaV07XG5cbiAgICAgICAgLy8gTk9URTogaWYgbGlzdGVuZXIgdGhyb3dzIGV4Y2VwdGlvbiwgdGhpcyB3aWxsIHN0b3AuLi5cbiAgICAgICAgaWYgKF9faXNfc3RyaW5nKGxpc3RlbmVyLmNhbGxiYWNrKSkge1xuICAgICAgICAgIGxpc3RlbmVyLmNvbnRleHRbbGlzdGVuZXIuY2FsbGJhY2tdLmFwcGx5KGxpc3RlbmVyLmNvbnRleHQsIGFyZ3MpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxpc3RlbmVyLmNhbGxiYWNrLmFwcGx5KGxpc3RlbmVyLmNvbnRleHQsIGFyZ3MpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIF9pbml0aWFsaXplKCk7XG4gIHJldHVybiBfdGhpcztcbn07XG5cbi8vIG1ha2UgRXZlbnRzIGEgZ2xvYmFsIGV2ZW50IHNvdXJjZVxuX19JTlNUQU5DRV9fID0gRXZlbnRzKCk7XG5FdmVudHMub24gPSBmdW5jdGlvbiBfZXZlbnRzX29uICgpIHtcbiAgcmV0dXJuIF9fSU5TVEFOQ0VfXy5vbi5hcHBseShfX0lOU1RBTkNFX18sIGFyZ3VtZW50cyk7XG59O1xuRXZlbnRzLm9mZiA9IGZ1bmN0aW9uIF9ldmVudHNfb2ZmICgpIHtcbiAgcmV0dXJuIF9fSU5TVEFOQ0VfXy5vZmYuYXBwbHkoX19JTlNUQU5DRV9fLCBhcmd1bWVudHMpO1xufTtcbkV2ZW50cy50cmlnZ2VyID0gZnVuY3Rpb24gX2V2ZW50c190cmlnZ2VyICgpIHtcbiAgcmV0dXJuIF9fSU5TVEFOQ0VfXy50cmlnZ2VyLmFwcGx5KF9fSU5TVEFOQ0VfXywgYXJndW1lbnRzKTtcbn07XG5cbi8vIGludGVyY2VwdCB3aW5kb3cub25oYXNoY2hhbmdlIGV2ZW50cywgb3Igc2ltdWxhdGUgaWYgYnJvd3NlciBkb2Vzbid0XG4vLyBzdXBwb3J0LCBhbmQgc2VuZCB0byBnbG9iYWwgRXZlbnRzIG9iamVjdFxudmFyIF9vbkhhc2hDaGFuZ2UgPSBmdW5jdGlvbiAoZSkge1xuICBFdmVudHMudHJpZ2dlcignaGFzaGNoYW5nZScsIGUpO1xufTtcblxuLy8gY291cnRlc3kgb2Y6XG4vLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzkzMzk4NjUvZ2V0LXRoZS1oYXNoY2hhbmdlLWV2ZW50LXRvLXdvcmstaW4tYWxsLWJyb3dzZXJzLWluY2x1ZGluZy1pZTdcbmlmICghKCdvbmhhc2hjaGFuZ2UnIGluIHdpbmRvdykpIHtcbiAgdmFyIG9sZEhyZWYgPSBkb2N1bWVudC5sb2NhdGlvbi5oYXNoO1xuXG4gIHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICBpZiAob2xkSHJlZiAhPT0gZG9jdW1lbnQubG9jYXRpb24uaGFzaCkge1xuICAgICAgb2xkSHJlZiA9IGRvY3VtZW50LmxvY2F0aW9uLmhhc2g7XG4gICAgICBfb25IYXNoQ2hhbmdlKHtcbiAgICAgICAgJ3R5cGUnOiAnaGFzaGNoYW5nZScsXG4gICAgICAgICduZXdVUkwnOiBkb2N1bWVudC5sb2NhdGlvbi5oYXNoLFxuICAgICAgICAnb2xkVVJMJzogb2xkSHJlZlxuICAgICAgfSk7XG4gICAgfVxuICB9LCAzMDApO1xuXG59IGVsc2UgaWYgKHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKSB7XG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdoYXNoY2hhbmdlJywgX29uSGFzaENoYW5nZSwgZmFsc2UpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50cztcbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gZG8gdGhlc2UgY2hlY2tzIG9uY2UsIGluc3RlYWQgb2Ygb25jZSBwZXIgY2FsbFxudmFyIGlzTW9iaWxlID0gZmFsc2UsXG4gICAgc3VwcG9ydHNEYXRlSW5wdXQgPSBmYWxzZTtcblxuXG4vLyBzdGF0aWMgb2JqZWN0IHdpdGggdXRpbGl0eSBtZXRob2RzXG52YXIgVXRpbCA9IGZ1bmN0aW9uICgpIHtcbn07XG5cblxuVXRpbC5pc01vYmlsZSA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIGlzTW9iaWxlO1xufTtcblxuVXRpbC5zdXBwb3J0c0RhdGVJbnB1dCA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHN1cHBvcnRzRGF0ZUlucHV0O1xufTtcblxuLyoqXG4gKiBNZXJnZSBwcm9wZXJ0aWVzIGZyb20gYSBzZXJpZXMgb2Ygb2JqZWN0cy5cbiAqXG4gKiBAcGFyYW0gZHN0IHtPYmplY3R9XG4gKiAgICAgIHRhcmdldCB3aGVyZSBtZXJnZWQgcHJvcGVydGllcyBhcmUgY29waWVkIHRvLlxuICogQHBhcmFtIDx2YXJpYWJsZT4ge09iamVjdH1cbiAqICAgICAgc291cmNlIG9iamVjdHMgZm9yIHByb3BlcnRpZXMuIFdoZW4gYSBzb3VyY2UgaXMgbm9uIG51bGwsIGl0J3NcbiAqICAgICAgcHJvcGVydGllcyBhcmUgY29waWVkIHRvIHRoZSBkc3Qgb2JqZWN0LiBQcm9wZXJ0aWVzIGFyZSBjb3BpZWQgaW5cbiAqICAgICAgdGhlIG9yZGVyIG9mIGFyZ3VtZW50czogYSBwcm9wZXJ0eSBvbiBhIGxhdGVyIGFyZ3VtZW50IG92ZXJyaWRlcyBhXG4gKiAgICAgIHByb3BlcnR5IG9uIGFuIGVhcmxpZXIgYXJndW1lbnQuXG4gKi9cblV0aWwuZXh0ZW5kID0gZnVuY3Rpb24gKGRzdCkge1xuICB2YXIgaSwgbGVuLCBzcmMsIHByb3A7XG5cbiAgLy8gaXRlcmF0ZSBvdmVyIHNvdXJjZXMgd2hlcmUgcHJvcGVydGllcyBhcmUgcmVhZFxuICBmb3IgKGkgPSAxLCBsZW4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICBzcmMgPSBhcmd1bWVudHNbaV07XG4gICAgaWYgKHNyYykge1xuICAgICAgZm9yIChwcm9wIGluIHNyYykge1xuICAgICAgICBkc3RbcHJvcF0gPSBzcmNbcHJvcF07XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gcmV0dXJuIHVwZGF0ZWQgb2JqZWN0XG4gIHJldHVybiBkc3Q7XG59O1xuXG4vKipcbiAqIENoZWNrcyBpZiBvYmplY3RzIGFyZSBlcXVhbC5cbiAqXG4gKiBAcGFyYW0gYSB7T2JqZWN0fVxuICogICAgICBPYmplY3QgYS5cbiAqIEBwYXJhbSBiIHtPYmplY3R9XG4gKiAgICAgIE9iamVjdCBiLlxuICovXG5VdGlsLmVxdWFscyA9IGZ1bmN0aW9uIChvYmpBLCBvYmpCKSB7XG4gIHZhciBrZXlhLCBrZXliO1xuXG4gIGlmIChvYmpBID09PSBvYmpCKSB7XG4gICAgLy8gaWYgPT09IHRoZW4gPT09LCBubyBxdWVzdGlvbiBhYm91dCB0aGF0Li4uXG4gICAgcmV0dXJuIHRydWU7XG4gIH0gZWxzZSBpZiAob2JqQSA9PT0gbnVsbCB8fCBvYmpCID09PSBudWxsKSB7XG4gICAgLy8gZnVubnksIHR5cGVvZiBudWxsID09PSAnb2JqZWN0Jywgc28gLi4uIGhtcGghXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBvYmpBID09PSAnb2JqZWN0JyAmJiB0eXBlb2Ygb2JqQiA9PT0gJ29iamVjdCcpIHtcbiAgICAvLyByZWN1cnNpdmVseSBjaGVjayBvYmplY3RzXG4gICAgZm9yIChrZXlhIGluIG9iakEpIHtcbiAgICAgIGlmIChvYmpBLmhhc093blByb3BlcnR5KGtleWEpKSB7XG4gICAgICAgIGlmICghb2JqQi5oYXNPd25Qcm9wZXJ0eShrZXlhKSkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTsgLy8gb2JqQiBpcyBtaXNzaW5nIGEga2V5IGZyb20gb2JqQVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChrZXliIGluIG9iakIpIHtcbiAgICAgIGlmIChvYmpCLmhhc093blByb3BlcnR5KGtleWIpKSB7XG4gICAgICAgIGlmICghb2JqQS5oYXNPd25Qcm9wZXJ0eShrZXliKSkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTsgLy8gb2JqQSBpcyBtaXNzaW5nIGEga2V5IGZyb20gb2JqQlxuICAgICAgICB9IGVsc2UgaWYgKCFVdGlsLmVxdWFscyhvYmpBW2tleWJdLCBvYmpCW2tleWJdKSkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTsgLy8gb2JqQVtrZXldICE9PSBvYmpCW2tleV1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0cnVlOyAvLyBSZWN1cnNpdmVseSBlcXVhbCwgc28gZXF1YWxcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gb2JqQSA9PT0gb2JqQjsgLy8gVXNlIGJha2VkIGluID09PSBmb3IgcHJpbWl0aXZlc1xuICB9XG59O1xuXG4vKipcbiAqIEdldCBhbiBldmVudCBvYmplY3QgZm9yIGFuIGV2ZW50IGhhbmRsZXIuXG4gKlxuICogQHBhcmFtIGUgdGhlIGV2ZW50IHRoYXQgd2FzIHJlY2VpdmVkIGJ5IHRoZSBldmVudCBoYW5kbGVyLlxuICogQHJldHVybiB7T2JqZWN0fVxuICogICAgICB3aXRoIHR3byBwcm9wZXJ0aWVzOlxuICogICAgICB0YXJnZXRcbiAqICAgICAgICAgICB0aGUgZWxlbWVudCB3aGVyZSB0aGUgZXZlbnQgb2NjdXJyZWQuXG4gKiAgICAgIG9yaWdpbmFsRXZlbnRcbiAqICAgICAgICAgICB0aGUgZXZlbnQgb2JqZWN0LCBlaXRoZXIgcGFyYW1ldGVyIGUgb3Igd2luZG93LmV2ZW50IChpbiBJRSkuXG4gKi9cblV0aWwuZ2V0RXZlbnQgPSBmdW5jdGlvbiAoZSkge1xuICB2YXIgdGFyZztcblxuICBpZiAoIWUpIHtcbiAgICAvLyBpZSBwdXRzIGV2ZW50IGluIGdsb2JhbFxuICAgIGUgPSB3aW5kb3cuZXZlbnQ7XG4gIH1cblxuICAvLyBmaW5kIHRhcmdldFxuICBpZiAoZS50YXJnZXQpIHtcbiAgICB0YXJnID0gZS50YXJnZXQ7XG4gIH0gZWxzZSBpZiAoZS5zcmNFbGVtZW50KSB7XG4gICAgdGFyZyA9IGUuc3JjRWxlbWVudDtcbiAgfVxuXG4gIC8vIGhhbmRsZSBzYWZhcmkgYnVnXG4gIGlmICh0YXJnLm5vZGVUeXBlID09PSAzKSB7XG4gICAgdGFyZyA9IHRhcmcucGFyZW50Tm9kZTtcbiAgfVxuXG4gIC8vIHJldHVybiB0YXJnZXQgYW5kIGV2ZW50XG4gIHJldHVybiB7XG4gICAgdGFyZ2V0OiB0YXJnLFxuICAgIG9yaWdpbmFsRXZlbnQ6IGVcbiAgfTtcbn07XG5cbi8qKlxuICogR2V0IGEgcGFyZW50IG5vZGUgYmFzZWQgb24gaXQncyBub2RlIG5hbWUuXG4gKlxuICogQHBhcmFtIGVsIHtET01FbGVtZW50fVxuICogICAgICBlbGVtZW50IHRvIHNlYXJjaCBmcm9tLlxuICogQHBhcmFtIG5vZGVOYW1lIHtTdHJpbmd9XG4gKiAgICAgIG5vZGUgbmFtZSB0byBzZWFyY2ggZm9yLlxuICogQHBhcmFtIG1heFBhcmVudCB7RE9NRWxlbWVudH1cbiAqICAgICAgZWxlbWVudCB0byBzdG9wIHNlYXJjaGluZy5cbiAqIEByZXR1cm4ge0RPTUVsZW1lbnR9XG4gKiAgICAgIG1hdGNoaW5nIGVsZW1lbnQsIG9yIG51bGwgaWYgbm90IGZvdW5kLlxuICovXG5VdGlsLmdldFBhcmVudE5vZGUgPSBmdW5jdGlvbiAoZWwsIG5vZGVOYW1lLCBtYXhQYXJlbnQpIHtcbiAgdmFyIGN1clBhcmVudCA9IGVsO1xuXG4gIHdoaWxlIChjdXJQYXJlbnQgJiYgY3VyUGFyZW50ICE9PSBtYXhQYXJlbnQgJiZcbiAgICAgIGN1clBhcmVudC5ub2RlTmFtZS50b1VwcGVyQ2FzZSgpICE9PSBub2RlTmFtZS50b1VwcGVyQ2FzZSgpKSB7XG4gICAgY3VyUGFyZW50ID0gY3VyUGFyZW50LnBhcmVudE5vZGU7XG4gIH1cbiAgaWYgKGN1clBhcmVudCAmJiAnbm9kZU5hbWUnIGluIGN1clBhcmVudCAmJlxuICAgICAgY3VyUGFyZW50Lm5vZGVOYW1lLnRvVXBwZXJDYXNlKCkgPT09IG5vZGVOYW1lLnRvVXBwZXJDYXNlKCkpIHtcbiAgICAvLyBmb3VuZCB0aGUgZGVzaXJlZCBub2RlXG4gICAgcmV0dXJuIGN1clBhcmVudDtcbiAgfVxuXG4gIC8vIGRpZG4ndCBmaW5kIHRoZSBkZXNpcmVkIG5vZGVcbiAgcmV0dXJuIG51bGw7XG59O1xuXG4vLyByZW1vdmUgYW4gZWxlbWVudHMgY2hpbGQgbm9kZXNcblV0aWwuZW1wdHkgPSBmdW5jdGlvbiAoZWwpIHtcbiAgd2hpbGUgKGVsLmZpcnN0Q2hpbGQpIHtcbiAgICBlbC5yZW1vdmVDaGlsZChlbC5maXJzdENoaWxkKTtcbiAgfVxufTtcblxuLy8gZGV0YWNoIGFuIGVsZW1lbnQgZnJvbSBpdHMgcGFyZW50XG5VdGlsLmRldGFjaCA9IGZ1bmN0aW9uIChlbCkge1xuICBpZiAoZWwucGFyZW50Tm9kZSkge1xuICAgIGVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWwpO1xuICB9XG59O1xuXG5VdGlsLmdldFdpbmRvd1NpemUgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBkaW1lbnNpb25zID0ge3dpZHRoOm51bGwsaGVpZ2h0Om51bGx9O1xuXG4gIGlmICgnaW5uZXJXaWR0aCcgaW4gd2luZG93ICYmICdpbm5lckhlaWdodCcgaW4gd2luZG93KSB7XG4gICAgZGltZW5zaW9ucyA9IHtcbiAgICAgIHdpZHRoOiB3aW5kb3cuaW5uZXJXaWR0aCxcbiAgICAgIGhlaWdodDogd2luZG93LmlubmVySGVpZ2h0XG4gICAgfTtcbiAgfSBlbHNlIHtcbiAgICAvLyBwcm9iYWJseSBJRTw9OFxuICAgIHZhciBlbGVtID0gJ2RvY3VtZW50RWxlbWVudCcgaW4gZG9jdW1lbnQgP1xuICAgICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQgOiBkb2N1bWVudC5ib2R5O1xuXG4gICAgZGltZW5zaW9ucyA9IHtcbiAgICAgIHdpZHRoOiBlbGVtLm9mZnNldFdpZHRoLFxuICAgICAgaGVpZ2h0OiBlbGVtLm9mZnNldEhlaWdodFxuICAgIH07XG4gIH1cblxuICByZXR1cm4gZGltZW5zaW9ucztcbn07XG5cbi8qKlxuICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgaXMgYSBjb21wb3NpdGlvbiBvZiBvdGhlciBmdW5jdGlvbnMuXG4gKlxuICogRm9yIGV4YW1wbGU6XG4gKiAgICAgIGEoYihjKHgpKSkgPT09IGNvbXBvc2UoYywgYiwgYSkoeCk7XG4gKlxuICogRWFjaCBmdW5jdGlvbiBzaG91bGQgYWNjZXB0IGFzIGFuIGFyZ3VtZW50LCB0aGUgcmVzdWx0IG9mIHRoZSBwcmV2aW91c1xuICogZnVuY3Rpb24gY2FsbCBpbiB0aGUgY2hhaW4uIEl0IGlzIGFsbG93YWJsZSBmb3IgYWxsIGZ1bmN0aW9ucyB0byBoYXZlIG5vXG4gKiByZXR1cm4gdmFsdWUgYXMgd2VsbC5cbiAqXG4gKiBAcGFyYW0gLi4uIHtGdW5jdGlvbn0gQSB2YXJpYWJsZSBzZXQgb2YgZnVuY3Rpb25zIHRvIGNhbGwsIGluIG9yZGVyLlxuICpcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufSBUaGUgY29tcG9zaXRpb24gb2YgdGhlIGZ1bmN0aW9ucyBwcm92aWRlZCBhcyBhcmd1bWVudHMuXG4gKi9cblV0aWwuY29tcG9zZSA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGZucyA9IGFyZ3VtZW50cztcblxuICByZXR1cm4gZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgIHZhciBpLFxuICAgICAgICBmbixcbiAgICAgICAgbGVuO1xuXG4gICAgZm9yIChpID0gMCwgbGVuID0gZm5zLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBmbiA9IGZuc1tpXTtcblxuICAgICAgaWYgKGZuICYmIGZuLmNhbGwpIHtcbiAgICAgICAgcmVzdWx0ID0gZm4uY2FsbCh0aGlzLCByZXN1bHQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG59O1xuXG4vKipcbiAqIENoZWNrcyB0aGUgZWxlbWVudHMgb2YgYSBsb29raW5nIGZvciBiLiBiIGlzIGFzc3VtZWQgdG8gYmUgZm91bmQgaWYgZm9yXG4gKiBzb21lIG9iamVjdCBpbiBhIChhW2ldKSwgYVtpXSA9PT0gYi4gTm90ZSBzdHJpY3QgZXF1YWxpdHkuXG4gKlxuICogQHBhcmFtIGEge0FycmF5fVxuICogICAgICBBbiBhcnJheSB0byBzZWFyY2hcbiAqIEBwYXJhbSBiIHtNaXhlZH1cbiAqICAgICAgQSB2YWx1ZSB0byBzZWFyY2ggZm9yXG4gKlxuICogQHJldHVyblxuICogICAgICB0cnVlIGlmIGFycmF5IGEgY29udGFpbnMgYlxuICovXG5VdGlsLmNvbnRhaW5zID0gZnVuY3Rpb24gKGEsIGIpIHtcbiAgdmFyIGksIGxlbjtcblxuICBmb3IgKGkgPSAwLCBsZW4gPSBhLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgaWYgKGIgPT09IGFbaV0pIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn07XG5cbi8qKlxuICogQHJldHVyblxuICogICAgICB0cnVlIGlmIG9iamVjdCBpcyBhbiBhcnJheVxuICovXG5VdGlsLmlzQXJyYXkgPSBmdW5jdGlvbiAoYSkge1xuXG4gIGlmICh0eXBlb2YgQXJyYXkuaXNBcnJheSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBBcnJheS5pc0FycmF5KGEpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYSkgPT09ICdbb2JqZWN0IEFycmF5XSc7XG4gIH1cblxufTtcblxuXG4vKipcbiAqIExvYWQgYSBzY3JpcHQgYXN5bmNocm9ub3VzbHkuXG4gKlxuICogQHBhcmFtIHVybCB7U3RyaW5nfVxuICogICAgICAgIHNjcmlwdCB0byBsb2FkLlxuICogQHBhcmFtIG9wdGlvbnMge09iamVjdH1cbiAqICAgICAgICBhZGRpdGlvbmFsIG9wdGlvbnMuXG4gKiBAcGFyYW0gb3B0aW9ucy5zdWNjZXNzIHtGdW5jdGlvbn0gb3B0aW9uYWwuXG4gKiAgICAgICAgY2FsbGVkIGFmdGVyIHNjcmlwdCBsb2FkcyBzdWNjZXNzZnVsbHkuXG4gKiBAcGFyYW0gb3B0aW9ucy5lcnJvciB7RnVuY3Rpb259IG9wdGlvbmFsLlxuICogICAgICAgIGNhbGxlZCBhZnRlciBzY3JpcHQgZmFpbHMgdG8gbG9hZC5cbiAqIEBwYXJhbSBvcHRpb25zLmRvbmUge0Z1bmN0aW9ufSBvcHRpb25hbFxuICogICAgICAgIGNhbGxlZCBhZnRlciBsb2FkU2NyaXB0IGlzIGNvbXBsZXRlLFxuICogICAgICAgIGFmdGVyIGNhbGxpbmcgc3VjY2VzcyBvciBlcnJvci5cbiAqL1xuVXRpbC5sb2FkU2NyaXB0ID0gZnVuY3Rpb24gKHVybCwgb3B0aW9ucykge1xuICAvLyBsb2FkIHNlY29uZGFyeSBzY3JpcHRcbiAgdmFyIGNsZWFudXAsXG4gICAgICBkb25lLFxuICAgICAgb25FcnJvcixcbiAgICAgIG9uTG9hZCxcbiAgICAgIHNjcmlwdDtcblxuICBvcHRpb25zID0gVXRpbC5leHRlbmQoe30sIHtcbiAgICBzdWNjZXNzOiBudWxsLFxuICAgIGVycm9yOiBudWxsLFxuICAgIGRvbmU6IG51bGxcbiAgfSwgb3B0aW9ucyk7XG5cbiAgY2xlYW51cCA9IGZ1bmN0aW9uICgpIHtcbiAgICBzY3JpcHQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbG9hZCcsIG9uTG9hZCk7XG4gICAgc2NyaXB0LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgb25FcnJvcik7XG4gICAgc2NyaXB0LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc2NyaXB0KTtcbiAgICBjbGVhbnVwID0gbnVsbDtcbiAgICBvbkxvYWQgPSBudWxsO1xuICAgIG9uRXJyb3IgPSBudWxsO1xuICAgIHNjcmlwdCA9IG51bGw7XG4gIH07XG5cbiAgZG9uZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAob3B0aW9ucy5kb25lICE9PSBudWxsKSB7XG4gICAgICBvcHRpb25zLmRvbmUoKTtcbiAgICB9XG4gICAgb3B0aW9ucyA9IG51bGw7XG4gIH07XG5cbiAgb25FcnJvciA9IGZ1bmN0aW9uICgpIHtcbiAgICBjbGVhbnVwKCk7XG4gICAgaWYgKG9wdGlvbnMuZXJyb3IgIT09IG51bGwpIHtcbiAgICAgIG9wdGlvbnMuZXJyb3IuYXBwbHkobnVsbCwgYXJndW1lbnRzKTtcbiAgICB9XG4gICAgZG9uZSgpO1xuICB9O1xuXG4gIG9uTG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICBjbGVhbnVwKCk7XG4gICAgaWYgKG9wdGlvbnMuc3VjY2VzcyAhPT0gbnVsbCkge1xuICAgICAgb3B0aW9ucy5zdWNjZXNzLmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7XG4gICAgfVxuICAgIGRvbmUoKTtcbiAgfTtcblxuICBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcbiAgc2NyaXB0LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBvbkxvYWQpO1xuICBzY3JpcHQuYWRkRXZlbnRMaXN0ZW5lcignZXJyb3InLCBvbkVycm9yKTtcbiAgc2NyaXB0LnNyYyA9IHVybDtcbiAgc2NyaXB0LmFzeW5jID0gdHJ1ZTtcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3Rvcignc2NyaXB0JykucGFyZW50Tm9kZS5hcHBlbmRDaGlsZChzY3JpcHQpO1xufTtcblxuXG4vLyBEbyB0aGVzZSBjaGVja3Mgb25jZSBhbmQgY2FjaGUgdGhlIHJlc3VsdHNcbihmdW5jdGlvbigpIHtcbiAgdmFyIHRlc3RFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICB2YXIgdGVzdElucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgdmFyIHN0ciA9IG5hdmlnYXRvci51c2VyQWdlbnR8fG5hdmlnYXRvci52ZW5kb3J8fHdpbmRvdy5vcGVyYTtcblxuICBpc01vYmlsZSA9IHN0ci5tYXRjaCgvKEFuZHJvaWR8d2ViT1N8aVBob25lfGlQYWR8aVBvZHxCbGFja0JlcnJ5fFdpbmRvd3MgUGhvbmUpL2kpO1xuICB0ZXN0SW5wdXQuc2V0QXR0cmlidXRlKCd0eXBlJywgJ2RhdGUnKTtcbiAgc3VwcG9ydHNEYXRlSW5wdXQgPSAodGVzdElucHV0LnR5cGUgIT09ICd0ZXh0Jyk7XG5cbiAgLy8gY2xlYW4gdXAgdGVzdGluZyBlbGVtZW50XG4gIHRlc3RFbCA9IG51bGw7XG59KSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFV0aWw7IiwiJ3VzZSBzdHJpY3QnO1xuXG5cbnZhciBVdGlsID0gcmVxdWlyZSgnLi9VdGlsJyk7XG5cblxudmFyIF9DQUxMQkFDS19TRVFVRU5DRSA9IDA7XG5cbi8vIGRlZmF1bHRzIGZvciBqc29ucCBtZXRob2RcbnZhciBfREVGQVVMVF9KU09OUF9PUFRJT05TID0ge1xuICB1cmw6IG51bGwsXG4gIHN1Y2Nlc3M6IG51bGwsXG4gIGVycm9yOiBudWxsLFxuICBkb25lOiBudWxsLFxuICBkYXRhOiBudWxsLFxuICBjYWxsYmFja05hbWU6IG51bGwsXG4gIGNhbGxiYWNrUGFyYW1ldGVyOiAnY2FsbGJhY2snXG59O1xuXG4vLyBkZWZhdWx0cyBmb3IgYWpheCBtZXRob2RcbnZhciBfREVGQVVMVF9BSkFYX09QVElPTlMgPSB7XG4gIHVybDogbnVsbCxcbiAgc3VjY2VzczogbnVsbCxcbiAgZXJyb3I6IG51bGwsXG4gIGRvbmU6IG51bGwsXG4gIG1ldGhvZDogJ0dFVCcsXG4gIGhlYWRlcnM6IG51bGwsXG4gIGRhdGE6IG51bGwsXG4gIHJhd2RhdGE6IG51bGxcbn07XG5cbi8vIEFQSSBNZXRob2QgRGVjbGFyYXRpb25zXG5cbnZhciBhamF4LFxuICAgIGdldENhbGxiYWNrTmFtZSxcbiAgICBqc29ucCxcbiAgICByZXN0cmljdE9yaWdpbixcbiAgICB1cmxFbmNvZGU7XG5cblxuLy8gQVBJIE1ldGhvZCBEZWZpbml0aW9uc1xuXG4vKipcbiAqIE1ha2UgYW4gQUpBWCByZXF1ZXN0LlxuICpcbiAqIEBwYXJhbSBvcHRpb25zLnVybCB7U3RyaW5nfVxuICogICAgICB0aGUgdXJsIHRvIHJlcXVlc3QuXG4gKiBAcGFyYW0gb3B0aW9ucy5zdWNjZXNzIHtGdW5jdGlvbn1cbiAqICAgICAgY2FsbGVkIHdpdGggZGF0YSBsb2FkZWQgYnkgc2NyaXB0XG4gKiBAcGFyYW0gb3B0aW9ucy5lcnJvciB7RnVuY3Rpb259IG9wdGlvbmFsXG4gKiAgICAgIGNhbGxlZCB3aGVuIHNjcmlwdCBmYWlscyB0byBsb2FkXG4gKiBAcGFyYW0gb3B0aW9ucy5kb25lIHtGdW5jdGlvbn1cbiAqICAgICAgICBjYWxsZWQgd2hlbiBhamF4IGlzIGNvbXBsZXRlLCBhZnRlciBzdWNjZXNzIG9yIGVycm9yLlxuICogQHBhcmFtIG9wdGlvbnMubWV0aG9kIHtTdHJpbmd9XG4gKiAgICAgIHJlcXVlc3QgbWV0aG9kLCBkZWZhdWx0IGlzICdHRVQnXG4gKiBAcGFyYW0gb3B0aW9ucy5oZWFkZXJzIHtPYmplY3R9XG4gKiAgICAgIHJlcXVlc3QgaGVhZGVyIG5hbWUgYXMga2V5LCB2YWx1ZSBhcyB2YWx1ZS5cbiAqIEBwYXJhbSBvcHRpb25zLmRhdGEge09iamVjdH1cbiAqICAgICAgcmVxdWVzdCBkYXRhLCBzZW50IHVzaW5nIGNvbnRlbnQgdHlwZVxuICogICAgICAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJy5cbiAqIEBwYXJhbSBvcHRpb25zLnJhd2RhdGEgez99XG4gKiAgICAgIHBhc3NlZCBkaXJlY3RseSB0byBzZW5kIG1ldGhvZCwgd2hlbiBvcHRpb25zLmRhdGEgaXMgbnVsbC5cbiAqICAgICAgQ29udGVudC10eXBlIGhlYWRlciBtdXN0IGFsc28gYmUgc3BlY2lmaWVkLiBEZWZhdWx0IGlzIG51bGwuXG4gKi9cbmFqYXggPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICB2YXIgaCxcbiAgICAgIHBvc3RkYXRhLFxuICAgICAgcXVlcnlTdHJpbmcsXG4gICAgICB1cmwsXG4gICAgICB4aHI7XG5cbiAgb3B0aW9ucyA9IFV0aWwuZXh0ZW5kKHt9LCBfREVGQVVMVF9BSkFYX09QVElPTlMsIG9wdGlvbnMpO1xuICB1cmwgPSBvcHRpb25zLnVybDtcblxuICBpZiAob3B0aW9ucy5yZXN0cmljdE9yaWdpbikge1xuICAgIHVybCA9IHJlc3RyaWN0T3JpZ2luKHVybCk7XG4gIH1cbiAgcG9zdGRhdGEgPSBvcHRpb25zLnJhd2RhdGE7XG5cbiAgaWYgKG9wdGlvbnMuZGF0YSAhPT0gbnVsbCkge1xuICAgIHF1ZXJ5U3RyaW5nID0gdXJsRW5jb2RlKG9wdGlvbnMuZGF0YSk7XG4gICAgaWYgKG9wdGlvbnMubWV0aG9kID09PSAnR0VUJykge1xuICAgICAgLy8gYXBwZW5kIHRvIHVybFxuICAgICAgdXJsID0gdXJsICsgJz8nICsgcXVlcnlTdHJpbmc7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIG90aGVyd2lzZSBzZW5kIGFzIHJlcXVlc3QgYm9keVxuICAgICAgcG9zdGRhdGEgPSBxdWVyeVN0cmluZztcbiAgICAgIGlmIChvcHRpb25zLmhlYWRlcnMgPT09IG51bGwpIHtcbiAgICAgICAgb3B0aW9ucy5oZWFkZXJzID0ge307XG4gICAgICB9XG4gICAgICAvLyBzZXQgcmVxdWVzdCBjb250ZW50IHR5cGVcbiAgICAgIG9wdGlvbnMuaGVhZGVyc1snQ29udGVudC1UeXBlJ10gPSAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJztcbiAgICB9XG4gIH1cblxuICB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblxuICAvLyBzZXR1cCBjYWxsYmFja1xuICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBkYXRhLCBjb250ZW50VHlwZTtcblxuICAgIGlmICh4aHIucmVhZHlTdGF0ZSA9PT0gNCkge1xuICAgICAgaWYgKHhoci5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICBpZiAob3B0aW9ucy5zdWNjZXNzICE9PSBudWxsKSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGRhdGEgPSB4aHIucmVzcG9uc2U7XG4gICAgICAgICAgICBjb250ZW50VHlwZSA9IHhoci5nZXRSZXNwb25zZUhlYWRlcignQ29udGVudC1UeXBlJyk7XG4gICAgICAgICAgICBpZiAoY29udGVudFR5cGUgJiYgY29udGVudFR5cGUuaW5kZXhPZignanNvbicpICE9PSAtMSkge1xuICAgICAgICAgICAgICBkYXRhID0gSlNPTi5wYXJzZShkYXRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG9wdGlvbnMuc3VjY2VzcyhkYXRhLCB4aHIpO1xuICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGlmIChvcHRpb25zLmVycm9yICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgIG9wdGlvbnMuZXJyb3IoZSwgeGhyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChvcHRpb25zLmVycm9yKSB7XG4gICAgICAgICAgb3B0aW9ucy5lcnJvcih4aHIuc3RhdHVzLCB4aHIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAob3B0aW9ucy5kb25lICE9PSBudWxsKSB7XG4gICAgICAgIG9wdGlvbnMuZG9uZSh4aHIpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICAvLyBvcGVuIHJlcXVlc3RcbiAgeGhyLm9wZW4ob3B0aW9ucy5tZXRob2QsIHVybCwgdHJ1ZSk7XG5cbiAgLy8gc2VuZCBoZWFkZXJzXG4gIGlmIChvcHRpb25zLmhlYWRlcnMgIT09IG51bGwpIHtcbiAgICBmb3IgKGggaW4gb3B0aW9ucy5oZWFkZXJzKSB7XG4gICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihoLCBvcHRpb25zLmhlYWRlcnNbaF0pO1xuICAgIH1cbiAgfVxuXG4gIC8vIHNlbmQgZGF0YVxuICB4aHIuc2VuZChwb3N0ZGF0YSk7XG5cbiAgcmV0dXJuIHhocjtcbn07XG5cbi8qKlxuICogR2VuZXJhdGUgYSB1bmlxdWUgY2FsbGJhY2sgbmFtZS5cbiAqXG4gKiBAcmV0dXJuIGEgdW5pcXVlIGNhbGxiYWNrIG5hbWUuXG4gKi9cbmdldENhbGxiYWNrTmFtZSA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuICdfeGhyX2NhbGxiYWNrXycgKyBuZXcgRGF0ZSgpLmdldFRpbWUoKSArXG4gICAgICAnXycgKyAoKytfQ0FMTEJBQ0tfU0VRVUVOQ0UpO1xufTtcblxuLyoqXG4gKiBNYWtlIGEgSlNPTlAgcmVxdWVzdC5cbiAqXG4gKiBAcGFyYW0gb3B0aW9ucy51cmwge1N0cmluZ31cbiAqICAgICAgdXJsIHRvIGxvYWRcbiAqIEBwYXJhbSBvcHRpb25zLnN1Y2Nlc3Mge0Z1bmN0aW9ufVxuICogICAgICBjYWxsZWQgd2l0aCBkYXRhIGxvYWRlZCBieSBzY3JpcHRcbiAqIEBwYXJhbSBvcHRpb25zLmVycm9yIHtGdW5jdGlvbn0gb3B0aW9uYWxcbiAqICAgICAgY2FsbGVkIHdoZW4gc2NyaXB0IGZhaWxzIHRvIGxvYWRcbiAqIEBwYXJhbSBvcHRpb25zLmRvbmUge0Z1bmN0aW9ufSBvcHRpb25hbFxuICogICAgICAgIGNhbGxlZCB3aGVuIGpzb25wIGlzIGNvbXBsZXRlLCBhZnRlciBzdWNjZXNzIG9yIGVycm9yLlxuICogQHBhcmFtIG9wdGlvbnMuZGF0YSB7T2JqZWN0fSBvcHRpb25hbFxuICogICAgICByZXF1ZXN0IHBhcmFtZXRlcnMgdG8gYWRkIHRvIHVybFxuICpcbiAqIEBwYXJhbSBvcHRpb25zLmNhbGxiYWNrTmFtZSB7U3RyaW5nfSBvcHRpb25hbFxuICogQHBhcmFtIG9wdGlvbnMuY2FsbGJhY2tQYXJhbWV0ZXIge1N0cmluZ30gb3B0aW9uYWxcbiAqICAgICAgZGVmYXVsdCBpcyAnY2FsbGJhY2snXG4gKi9cbmpzb25wID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgdmFyIGRhdGEsXG4gICAgICBjYWxsYmFjayxcbiAgICAgIHVybDtcblxuICBvcHRpb25zID0gVXRpbC5leHRlbmQoe30sIF9ERUZBVUxUX0pTT05QX09QVElPTlMsIG9wdGlvbnMpO1xuICB1cmwgPSBvcHRpb25zLnVybDtcbiAgZGF0YSA9IFV0aWwuZXh0ZW5kKHt9LCBvcHRpb25zLmRhdGEpO1xuICBjYWxsYmFjayA9IG9wdGlvbnMuY2FsbGJhY2tOYW1lIHx8IGdldENhbGxiYWNrTmFtZSgpO1xuXG4gIC8vIGFkZCBkYXRhIGFuZCBjYWxsYmFjayB0byB1cmxcbiAgZGF0YVtvcHRpb25zLmNhbGxiYWNrUGFyYW1ldGVyXSA9IGNhbGxiYWNrO1xuICB1cmwgKz0gKHVybC5pbmRleE9mKCc/JykgPT09IC0xID8gJz8nIDogJyYnKSArIHVybEVuY29kZShkYXRhKTtcblxuICAvLyBzZXR1cCBnbG9iYWwgY2FsbGJhY2sgY2FsbGVkIGJ5IHNjcmlwdFxuICB3aW5kb3dbY2FsbGJhY2tdID0gZnVuY3Rpb24gKCkge1xuICAgIG9wdGlvbnMuc3VjY2Vzcy5hcHBseShudWxsLCBhcmd1bWVudHMpO1xuICB9O1xuXG4gIFV0aWwubG9hZFNjcmlwdCh1cmwsIHtcbiAgICBlcnJvcjogb3B0aW9ucy5lcnJvcixcbiAgICBkb25lOiBmdW5jdGlvbiAoKSB7XG4gICAgICB3aW5kb3dbY2FsbGJhY2tdID0gbnVsbDtcbiAgICAgIGRlbGV0ZSB3aW5kb3dbY2FsbGJhY2tdO1xuXG4gICAgICBpZiAob3B0aW9ucy5kb25lICE9PSBudWxsKSB7XG4gICAgICAgIG9wdGlvbnMuZG9uZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG59O1xuXG5yZXN0cmljdE9yaWdpbiA9IGZ1bmN0aW9uICh1cmwpIHtcbiAgdmFyIGEsXG4gICAgICByZXN0cmljdGVkVXJsO1xuXG4gIGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7IC8vIEhhY2sgdG8gcGFyc2Ugb25seSB0aGUgcGF0aG5hbWVcbiAgYS5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCB1cmwpO1xuICByZXN0cmljdGVkVXJsID0gYS5wYXRobmFtZTtcblxuICAvLyBOZWVkZWQgZm9yIElFLCB3aGljaCBvbWl0cyBsZWFkaW5nIHNsYXNoLlxuICBpZiAoKHVybC5pbmRleE9mKCdodHRwJykgPT09IDAgfHwgdXJsLmluZGV4T2YoJy8nKSA9PT0gMCkgJiZcbiAgICAgIHJlc3RyaWN0ZWRVcmwuaW5kZXhPZignLycpICE9PSAwKSB7XG4gICAgcmVzdHJpY3RlZFVybCA9ICcvJyArIHJlc3RyaWN0ZWRVcmw7XG4gIH1cblxuICByZXR1cm4gcmVzdHJpY3RlZFVybDtcbn07XG5cbi8qKlxuICogVVJMIGVuY29kZSBhbiBvYmplY3QuXG4gKlxuICogQHBhcmFtIG9iaiB7T2JqZWN0fVxuICogICAgICBvYmplY3QgdG8gZW5jb2RlXG4gKlxuICogQHJldHVybiB7U3RyaW5nfVxuICogICAgICB1cmwgZW5jb2RlZCBvYmplY3RcbiAqL1xudXJsRW5jb2RlID0gZnVuY3Rpb24gKG9iaikge1xuICB2YXIgZGF0YSwga2V5LCBlbmNvZGVkS2V5LCB2YWx1ZSwgaSwgbGVuO1xuXG4gIGRhdGEgPSBbXTtcbiAgZm9yIChrZXkgaW4gb2JqKSB7XG4gICAgZW5jb2RlZEtleSA9IGVuY29kZVVSSUNvbXBvbmVudChrZXkpO1xuICAgIHZhbHVlID0gb2JqW2tleV07XG5cbiAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgLy8gQWRkIGVhY2ggdmFsdWUgaW4gYXJyYXkgc2VwZXJhdGVseVxuICAgICAgZm9yIChpID0gMCwgbGVuID0gdmFsdWUubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgZGF0YS5wdXNoKGVuY29kZWRLZXkgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQodmFsdWVbaV0pKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZGF0YS5wdXNoKGVuY29kZWRLZXkgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQodmFsdWUpKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGRhdGEuam9pbignJicpO1xufTtcblxuXG4vLyBleHBvc2UgdGhlIEFQSVxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGFqYXg6IGFqYXgsXG4gIGdldENhbGxiYWNrTmFtZTogZ2V0Q2FsbGJhY2tOYW1lLFxuICBqc29ucDoganNvbnAsXG4gIHJlc3RyaWN0T3JpZ2luOiByZXN0cmljdE9yaWdpbixcbiAgdXJsRW5jb2RlOiB1cmxFbmNvZGUsXG59OyIsIi8qIGdsb2JhbCB3aW5kb3cgKi9cbid1c2Ugc3RyaWN0JztcblxuY29uc3QgQXBwID0gcmVxdWlyZSgnc2hha2VtYXAtdmlldy9BcHAnKSxcbiAgICAgICAgU2hha2VNYXBNb2RlbCA9IHJlcXVpcmUoJ3NoYWtlbWFwLXZpZXcvU2hha2VNYXBNb2RlbCcpO1xuXG52YXIgYXBwID0gd2luZG93LkFwcCA9IEFwcCh7XG4gICAgZWw6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzaGFrZW1hcFZpZXcnKSxcbiAgICBtb2RlbDogU2hha2VNYXBNb2RlbCgpXG59KTtcbmFwcC5tb2RlbC50cmlnZ2VyKCdjaGFuZ2UnKTtcblxuIiwiY29uc3QgRXZlbnRzVmlldyA9IHJlcXVpcmUoJ3NoYWtlbWFwLXZpZXcvZXZlbnRzL0V2ZW50c1ZpZXcnKSxcbiAgICAgICAgTG9hZGluZ1ZpZXcgPSByZXF1aXJlKCdzaGFrZW1hcC12aWV3L2xvYWRpbmcvTG9hZGluZ1ZpZXcnKSxcbiAgICAgICAgTWFwVmlldyA9IHJlcXVpcmUoJ3NoYWtlbWFwLXZpZXcvbWFwcy9NYXBWaWV3JyksXG4gICAgICAgIFZpZXcgPSByZXF1aXJlKCdoYXpkZXYtd2VidXRpbHMvc3JjL212Yy9WaWV3JyksXG4gICAgICAgIFV0aWwgPSByZXF1aXJlKCdoYXpkZXYtd2VidXRpbHMvc3JjL3V0aWwvVXRpbCcpO1xuXG52YXIgQXBwID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICB2YXIgX3RoaXMsXG4gICAgICAgICAgICBfaW5pdGlhbGl6ZTtcblxuICAgIG9wdGlvbnMgPSBVdGlsLmV4dGVuZCh7fSwge30sIG9wdGlvbnMpO1xuICAgIF90aGlzID0gVmlldyhvcHRpb25zKTtcblxuICAgIF9pbml0aWFsaXplID0gZnVuY3Rpb24gKC8qb3B0aW9ucyovKSB7XG4gICAgICAgIF90aGlzLmVsLmNsYXNzTGlzdC5hZGQoJ3NtLXZpZXctYXBwJyk7XG5cbiAgICAgICAgX3RoaXMuZWwuaW5uZXJIVE1MID1cbiAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cImxvYWRpbmctdmlld1wiPjwvZGl2PicgK1xuICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiZXZlbnRzXCI+PC9kaXY+JyArXG4gICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJtYXAtdmlld1wiIHN0eWxlPVwiaGVpZ2h0OjEwMCU7d2lkdGg6MTAwJTtwb3NpdGlvbjpyZWxhdGl2ZTtcIj48L2Rpdj4nO1xuXG4gICAgICAgIF90aGlzLm1hcFZpZXcgPSBNYXBWaWV3KHtcbiAgICAgICAgICAgIGVsOiBfdGhpcy5lbC5xdWVyeVNlbGVjdG9yKCcubWFwLXZpZXcnKSxcbiAgICAgICAgICAgIG1vZGVsOiBfdGhpcy5tb2RlbFxuICAgICAgICB9KTtcblxuICAgICAgICBfdGhpcy5ldmVudHNWaWV3ID0gRXZlbnRzVmlldyh7XG4gICAgICAgICAgICBlbDogX3RoaXMuZWwucXVlcnlTZWxlY3RvcignLmV2ZW50cycpLFxuICAgICAgICAgICAgbW9kZWw6IF90aGlzLm1vZGVsXG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgX3RoaXMubG9hZGluZ1ZpZXcgPSBMb2FkaW5nVmlldyh7XG4gICAgICAgICAgICBlbDogX3RoaXMuZWwucXVlcnlTZWxlY3RvcignLmxvYWRpbmctdmlldycpLFxuICAgICAgICAgICAgbW9kZWw6IF90aGlzLm1vZGVsXG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBfaW5pdGlhbGl6ZShvcHRpb25zKTtcbiAgICBvcHRpb25zID0gbnVsbDtcbiAgICByZXR1cm4gX3RoaXM7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFwcDsiLCJjb25zdCBNb2RlbCA9IHJlcXVpcmUoJ2hhemRldi13ZWJ1dGlscy9zcmMvbXZjL01vZGVsJyksXG4gICAgICAgIFV0aWwgPSByZXF1aXJlKCdoYXpkZXYtd2VidXRpbHMvc3JjL3V0aWwvVXRpbCcpO1xuXG52YXIgU2hha2VNYXBNb2RlbCA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICB2YXIgX3RoaXM7XG5cbiAgICBfdGhpcyA9IE1vZGVsKFV0aWwuZXh0ZW5kKHt9LFxuICAgICAgICB7cHJvZHVjdHNVcmw6ICcvcHJvZHVjdHMuanNvbicsXG4gICAgICAgICAgICBldmVudHM6IFtdLFxuICAgICAgICAgICAgZXZlbnQ6IG51bGwsXG4gICAgICAgICAgICBsYXllcnM6IFtdLFxuICAgICAgICAgICAgZGVmYXVsdExheWVyczogWydFcGljZW50ZXInLCAnUEdBIENvbnRvdXJzJ10sXG4gICAgICAgICAgICBsb2FkaW5nOiBmYWxzZX0sXG5cdFx0XHRvcHRpb25zKSk7XG5cbiAgICByZXR1cm4gX3RoaXM7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNoYWtlTWFwTW9kZWw7IiwiJ3VzZSBzdHJpY3QnO1xuY29uc3QgVmlldyA9IHJlcXVpcmUoJ2hhemRldi13ZWJ1dGlscy9zcmMvbXZjL1ZpZXcnKSxcbiAgICAgICAgWGhyID0gcmVxdWlyZSgndXRpbC9YaHInKTtcblxudmFyIEV2ZW50VmlldyA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgdmFyIF90aGlzLFxuICAgICAgICAgICAgX2luaXRpYWxpemU7XG5cbiAgICBfdGhpcyA9IFZpZXcob3B0aW9ucyk7XG5cbiAgICBfaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uICgvKm9wdGlvbnMqLyApIHtcbiAgICAgICAgX3RoaXMuZWwuaW5uZXJIVE1MID0gXG4gICAgICAgICAgICAgICAgJycgK1xuICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwibG9hZEJ1dHRvblwiPlJlZnJlc2ggTGlzdDwvZGl2Pic7XG4gICAgICAgIF90aGlzLmVsLmV2ZW50TGlzdCA9IFtdO1xuXG4gICAgICAgIF90aGlzLm1vZGVsLm9uKCdjaGFuZ2U6ZXZlbnRzJywgX3RoaXMucmVuZGVyRXZlbnRzKTtcbiAgICAgICAgX3RoaXMubG9hZEJ1dHRvbiA9IF90aGlzLmVsLnF1ZXJ5U2VsZWN0b3IoJy5sb2FkQnV0dG9uJyk7XG4gICAgICAgIF90aGlzLmxvYWRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBfdGhpcy5nZXRFdmVudHMpO1xuXG4gICAgICAgIF90aGlzLmdldEV2ZW50cygpO1xuICAgIH07XG5cbiAgICBfdGhpcy5yZW5kZXJFdmVudHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBldmVudEh0bWwgPSAnJztcbiAgICAgICAgZm9yIChsZXQgZXZlbnQgb2YgX3RoaXMubW9kZWwuZ2V0KCdldmVudHMnKSkge1xuICAgICAgICAgICAgZXZlbnRIdG1sICs9ICc8ZGl2IGNsYXNzPVwiZXZlbnRcIj4nICsgZXZlbnQuaWQgKyAnPC9kaXY+JztcbiAgICAgICAgfVxuXG4gICAgICAgIF90aGlzLmVsLmlubmVySFRNTCA9IFxuICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiZXZlbnQtbGlzdFwiPicgKyBldmVudEh0bWwgKyAnPC9kaXY+JyArXG4gICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJsb2FkQnV0dG9uXCI+UmVmcmVzaCBMaXN0PC9kaXY+JztcbiAgICAgICAgXG4gICAgICAgIF90aGlzLmxvYWRCdXR0b24gPSBfdGhpcy5lbC5xdWVyeVNlbGVjdG9yKCcubG9hZEJ1dHRvbicpO1xuICAgICAgICBfdGhpcy5sb2FkQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgX3RoaXMuZ2V0RXZlbnRzKTtcblxuICAgICAgICBfdGhpcy5ldmVudHMgPSBfdGhpcy5lbC5xdWVyeVNlbGVjdG9yQWxsKCcuZXZlbnQnKTtcbiAgICAgICAgaWYgKF90aGlzLmV2ZW50cykge1xuICAgICAgICAgICAgZm9yIChsZXQgZXZlbnQgb2YgX3RoaXMuZXZlbnRzKSB7XG4gICAgICAgICAgICAgICAgZXZlbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBfdGhpcy5sb2FkRXZlbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcblxuICAgIF90aGlzLmdldEV2ZW50cyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgX3RoaXMubW9kZWwuc2V0KHtcbiAgICAgICAgICAgIGxvYWRpbmc6IHRydWVcbiAgICAgICAgfSk7XG5cbiAgICAgICAgWGhyLmFqYXgoe1xuICAgICAgICAgICAgdXJsOiBfdGhpcy5tb2RlbC5nZXQoJ3Byb2R1Y3RzVXJsJyksXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoanNvbikge1xuICAgICAgICAgICAgICAgIF90aGlzLm1vZGVsLnNldCh7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50czoganNvblxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMubW9kZWwuc2V0KHtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnRzOiBbXVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRvbmU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5tb2RlbC5zZXQoe1xuICAgICAgICAgICAgICAgICAgICBsb2FkaW5nOiBmYWxzZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9O1xuICAgIFxuICAgIF90aGlzLmxvYWRFdmVudCA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIHZhciBldmVudERpdiA9IGUudG9FbGVtZW50O1xuICAgICAgICB2YXIgZXZlbnRJZCA9IGV2ZW50RGl2LmlubmVyVGV4dDtcblxuICAgICAgICB2YXIgZXZlbnREYXRhID0gbnVsbDtcbiAgICAgICAgZm9yIChsZXQgZXZlbnRKc29uIG9mIF90aGlzLm1vZGVsLmdldCgnZXZlbnRzJykpIHtcbiAgICAgICAgICAgIGlmIChldmVudEpzb25bJ2lkJ10gPT09IGV2ZW50SWQpIHtcbiAgICAgICAgICAgICAgICBldmVudERhdGEgPSBldmVudEpzb247XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZXZlbnREYXRhKSB7XG4gICAgICAgICAgICBfdGhpcy5tb2RlbC5zZXQoe1xuICAgICAgICAgICAgICAgICdldmVudCc6IGV2ZW50RGF0YVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgX2luaXRpYWxpemUob3B0aW9ucyk7XG4gICAgb3B0aW9ucyA9IG51bGw7XG4gICAgcmV0dXJuIF90aGlzO1xufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50VmlldzsiLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IFZpZXcgPSByZXF1aXJlKCdoYXpkZXYtd2VidXRpbHMvc3JjL212Yy9WaWV3Jyk7XG5cbnZhciBMb2FkaW5nVmlldyA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgdmFyIF90aGlzLFxuICAgICAgICAgICAgX2luaXRpYWxpemU7XG5cbiAgICBfdGhpcyA9IFZpZXcob3B0aW9ucyk7XG5cbiAgICBfaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uICgvKm9wdGlvbnMqLyApIHtcbiAgICAgICAgX3RoaXMubG9hZGluZ0NvdW50ID0gMDtcbiAgICAgICAgX3RoaXMuZWwuaW5uZXJIVE1MID0gJzxkaXYgY2xhc3M9XCJsb2FkaW5nXCI+TG9hZGluZy4uLjwvZGl2Pic7XG4gICAgICAgIF90aGlzLm1vZGVsLm9uKCdjaGFuZ2U6bG9hZGluZycsIF90aGlzLmNoYW5nZUxvYWRpbmcpO1xuICAgIH07XG5cbiAgICBfdGhpcy5jaGFuZ2VMb2FkaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoX3RoaXMubW9kZWwuZ2V0KCdsb2FkaW5nJykgPT09IHRydWUpIHtcblxuICAgICAgICAgICAgLy8gYWRkIGxvYWRpbmcgY2xhc3MgdG8gbWFrZSBsb2FkaW5nIGRpdiB2aXNpYmxlXG4gICAgICAgICAgICBpZiAoX3RoaXMubG9hZGluZ0NvdW50ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMuZWwuY2xhc3NMaXN0LmFkZCgnbG9hZGluZy1jb250ZW50Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBfdGhpcy5sb2FkaW5nQ291bnQgKz0gMTtcblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgX3RoaXMubG9hZGluZ0NvdW50IC09IDE7XG5cbiAgICAgICAgICAgIC8vIGlmIG5vdGhpbmcgaXMgbG9hZGluZywgaGlkZSB0aGUgZGl2XG4gICAgICAgICAgICBpZiAoX3RoaXMubG9hZGluZ0NvdW50ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMuZWwuY2xhc3NMaXN0LnJlbW92ZSgnbG9hZGluZy1jb250ZW50Jyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHJlc2V0IGxvYWRpbmcgY291bnQgaWYgaXQgZHJvcHMgYmVsb3cgemVyb1xuICAgICAgICAgICAgaWYgKF90aGlzLmxvYWRpbmdDb3VudCA8IDApIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5sb2FkaW5nQ291bnQgPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcblxuXG5cbiAgICBfaW5pdGlhbGl6ZShvcHRpb25zKTtcbiAgICBvcHRpb25zID0gbnVsbDtcbiAgICByZXR1cm4gX3RoaXM7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IExvYWRpbmdWaWV3OyIsIi8qIGdsb2JhbCBMICovXG4ndXNlIHN0cmljdCc7XG5cbmNvbnN0IFZpZXcgPSByZXF1aXJlKCdoYXpkZXYtd2VidXRpbHMvc3JjL212Yy9WaWV3Jyk7XG52YXIgIEdlbmVyYXRvciA9IHJlcXVpcmUoJ3NoYWtlbWFwLXZpZXcvbWFwcy9sYXllcnMvR2VuZXJhdG9yJyk7XG5cblxudmFyIE1hcFZpZXcgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgIHZhciBfdGhpcyxcbiAgICAgICAgICAgIF9pbml0aWFsaXplO1xuXG4gICAgX3RoaXMgPSBWaWV3KG9wdGlvbnMpO1xuXG4gICAgX2luaXRpYWxpemUgPSBmdW5jdGlvbiAoLypvcHRpb25zKi8gKSB7XG4gICAgICAgIF90aGlzLmVsLmlubmVySFRNTCA9ICc8ZGl2IGNsYXNzPVwibWFwXCIgc3R5bGU9XCJoZWlnaHQ6MTAwJTt3aWR0aDoxMDAlXCI+PC9kaXY+JztcbiAgICAgICAgX3RoaXMuZGVmYXVsdExheWVycyA9IF90aGlzLm1vZGVsLmdldCgnZGVmYXVsdExheWVycycpO1xuICAgICAgICBsZXQgbWFwRWwgPSBfdGhpcy5lbC5xdWVyeVNlbGVjdG9yKCcubWFwJyk7XG5cbiAgICAgICAgX3RoaXMubWFwID0gTC5tYXAobWFwRWwsIHtcbiAgICAgICAgICAgIHNjcm9sbFdoZWVsWm9vbTogZmFsc2VcbiAgICAgICAgfSkuc2V0VmlldyhbNTEuNTA1LCAtMC4wOV0sIDEzKTtcblxuICAgICAgICBfdGhpcy5sYXllckdlbmVyYXRvciA9IEdlbmVyYXRvcihvcHRpb25zKTtcbiAgICAgICAgX3RoaXMuYmFzZUxheWVyID0gX3RoaXMuZ2VuQmFzZUxheWVyKCk7XG4gICAgICAgIF90aGlzLmxheWVyc0NvbnRyb2wgPSBMLmNvbnRyb2wubGF5ZXJzKHsnQmFzZW1hcCc6IF90aGlzLmJhc2VMYXllcn0pLmFkZFRvKF90aGlzLm1hcCk7XG5cbiAgICAgICAgX3RoaXMubW9kZWwub24oJ2NoYW5nZTpldmVudCcsIF90aGlzLnJlbmRlckV2ZW50TGF5ZXJzKTtcbiAgICAgICAgX3RoaXMubW9kZWwub24oJ2NoYW5nZTpsYXllcnMnLCBfdGhpcy5hZGRNYXBMYXllcnMpO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbGF5ZXJzRmluaXNoZWQnLCBfdGhpcy5hZGRNYXBMYXllcnMpO1xuICAgIH07XG5cbiAgICBfdGhpcy5nZW5CYXNlTGF5ZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBiYXNlbGF5ZXIgPSBMLnRpbGVMYXllcignaHR0cHM6Ly9hcGkudGlsZXMubWFwYm94LmNvbS92NC97aWR9L3t6fS97eH0ve3l9LnBuZz9hY2Nlc3NfdG9rZW49JyArICdway5leUoxSWpvaVpITnNiM05yZVNJc0ltRWlPaUpqYVhSMWFISm5ZM0V3TURGb01uUnhaV1Z0Y205bGFXSm1JbjAuMUMzR0Uwa0hQR09wYlZWOWtUeEJsUScsIHtcbiAgICAgICAgICAgIG1heFpvb206IDE4LFxuICAgICAgICAgICAgYXR0cmlidXRpb246ICdNYXAgZGF0YSAmY29weTsgPGEgaHJlZj1cImh0dHA6Ly9vcGVuc3RyZWV0bWFwLm9yZ1wiPk9wZW5TdHJlZXRNYXA8L2E+IGNvbnRyaWJ1dG9ycywgJyArXG4gICAgICAgICAgICAgICAgJzxhIGhyZWY9XCJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9saWNlbnNlcy9ieS1zYS8yLjAvXCI+Q0MtQlktU0E8L2E+LCAnICtcbiAgICAgICAgICAgICAgICAnSW1hZ2VyeSDvv70gPGEgaHJlZj1cImh0dHA6Ly9tYXBib3guY29tXCI+TWFwYm94PC9hPicsXG4gICAgICAgICAgICBpZDogJ21hcGJveC5zdHJlZXRzJ1xuICAgICAgICB9KS5hZGRUbyhfdGhpcy5tYXApO1xuXG4gICAgICAgIHJldHVybiBiYXNlbGF5ZXI7XG4gICAgfTtcblxuICAgIF90aGlzLnJlbmRlckV2ZW50TGF5ZXJzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBjbGVhciBtYXBcbiAgICAgICAgX3RoaXMuY2xlYXJNYXBMYXllcnMoKTtcbiAgICAgICAgXG4gICAgICAgIC8vIGdlbmVyYXRlIG5ldyBsYXllcnNcbiAgICAgICAgX3RoaXMuYmFzZUxheWVyID0gX3RoaXMuZ2VuQmFzZUxheWVyKCk7XG4gICAgICAgIHZhciBldmVudCA9IF90aGlzLm1vZGVsLmdldCgnZXZlbnQnKTtcbiAgICAgICAgXG4gICAgICAgIF90aGlzLmxheWVyR2VuZXJhdG9yLmdlbmVyYXRlTGF5ZXJzKGV2ZW50KTtcbiAgICAgICAgX3RoaXMubGF5ZXJzQ29udHJvbCA9IEwuY29udHJvbC5sYXllcnMoeydCYXNlbWFwJzogX3RoaXMuYmFzZUxheWVyfSkuYWRkVG8oX3RoaXMubWFwKTtcbiAgICB9O1xuXG4gICAgX3RoaXMuYWRkTWFwTGF5ZXJzID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgLy8gY2xlYXIgbWFwXG4gICAgICAgIF90aGlzLmNsZWFyTWFwTGF5ZXJzKCk7XG5cbiAgICAgICAgLy8gY29sbGVjdCBsYXllcnNcbiAgICAgICAgX3RoaXMuYmFzZUxheWVyID0gX3RoaXMuZ2VuQmFzZUxheWVyKCk7XG4gICAgICAgIHZhciBsYXllcnMgPSBlLmRldGFpbDtcblxuICAgICAgICBfdGhpcy5sYXllcnNDb250cm9sID0gTC5jb250cm9sLmxheWVycyh7J0Jhc2VtYXAnOiBfdGhpcy5iYXNlTGF5ZXJ9LCBsYXllcnMpLmFkZFRvKF90aGlzLm1hcCk7XG5cbiAgICAgICAgdmFyIGxheWVyQXJyID0gW107XG4gICAgICAgIGZvciAodmFyIGxheWVyIGluIGxheWVycykge1xuICAgICAgICAgICAgaWYgKF90aGlzLmRlZmF1bHRMYXllcnMuaW5kZXhPZihsYXllcikgPiAtMSkge1xuICAgICAgICAgICAgICAgIGxheWVyc1tsYXllcl0uYWRkVG8oX3RoaXMubWFwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxheWVyQXJyLnB1c2gobGF5ZXJzW2xheWVyXSk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZ3JvdXAgPSBMLmZlYXR1cmVHcm91cChsYXllckFycik7XG4gICAgICAgIF90aGlzLm1hcC5maXRCb3VuZHMoZ3JvdXAuZ2V0Qm91bmRzKCkucGFkKDAuNSkpO1xuXG4gICAgfTtcblxuICAgIF90aGlzLmNsZWFyTWFwTGF5ZXJzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBfdGhpcy5tYXAuZWFjaExheWVyKGZ1bmN0aW9uIChsYXllcikge1xuICAgICAgICAgICAgX3RoaXMubWFwLnJlbW92ZUxheWVyKGxheWVyKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgX3RoaXMubGF5ZXJzQ29udHJvbC5yZW1vdmVGcm9tKF90aGlzLm1hcCk7XG4gICAgfTtcblxuICAgIF9pbml0aWFsaXplKG9wdGlvbnMpO1xuICAgIG9wdGlvbnMgPSBudWxsO1xuICAgIHJldHVybiBfdGhpcztcbn07XG5cblxubW9kdWxlLmV4cG9ydHMgPSBNYXBWaWV3OyIsIid1c2Ugc3RyaWN0JztcbmNvbnN0IGV2ZW50cyA9IHJlcXVpcmUoJ3NoYWtlbWFwLXZpZXcvbWFwcy9sYXllcnMvZXZlbnRzJyksXG4gICAgICAgIFZpZXcgPSByZXF1aXJlKCdoYXpkZXYtd2VidXRpbHMvc3JjL212Yy9WaWV3Jyk7XG5cbnZhciBsYXllcnNJbiA9IFtyZXF1aXJlKCdzaGFrZW1hcC12aWV3L21hcHMvbGF5ZXJzL2VwaWNlbnRlcicpLFxuICAgIHJlcXVpcmUoJ3NoYWtlbWFwLXZpZXcvbWFwcy9sYXllcnMvY29udF9wZ2EnKV07XG5cbnZhciBHZW5lcmF0b3IgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgIHZhciBfdGhpcyxcbiAgICAgICAgICAgIF9pbml0aWFsaXplO1xuXG4gICAgX3RoaXMgPSBWaWV3KG9wdGlvbnMpO1xuXG4gICAgX2luaXRpYWxpemUgPSBmdW5jdGlvbiAoLypvcHRpb25zKi8pIHtcbiAgICAgICAgX3RoaXMubGF5ZXJDb3VudCA9IDA7XG4gICAgICAgIF90aGlzLmxheWVycyA9IHt9O1xuICAgICAgICBfdGhpcy5sYXllcnNJbiA9IGxheWVyc0luO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbGF5ZXJGaW5pc2hlZCcsIF90aGlzLmFkZExheWVyKTtcbiAgICB9O1xuXG5cbiAgICBfdGhpcy5nZW5lcmF0ZUxheWVycyA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICBfdGhpcy5sYXllckNvdW50ID0gMDtcbiAgICAgICAgX3RoaXMubGF5ZXJzID0ge307XG4gICAgICAgIGlmIChldmVudCkge1xuICAgICAgICAgICAgZm9yICh2YXIgcmF3TGF5ZXIgb2YgX3RoaXMubGF5ZXJzSW4pIHtcbiAgICAgICAgICAgICAgICByYXdMYXllci5nZW5lcmF0ZUxheWVyKGV2ZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBfdGhpcy5hZGRMYXllciA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIHZhciBsYXllciA9IGUuZGV0YWlsO1xuXG4gICAgICAgIC8vIGNvbGxlY3QgbGF5ZXJzIHRoYXQgcmVuZGVyZWQgc3VjY2Vzc2Z1bGx5XG4gICAgICAgIGlmIChsYXllci5sYXllcikge1xuICAgICAgICAgICAgX3RoaXMubGF5ZXJzW2xheWVyLm5hbWVdID0gbGF5ZXIubGF5ZXI7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBLZWVwIHRyYWNrIG9mIGFsbCBsYXllcnMgdGhhdCBoYXZlIHJldHVybmVkXG4gICAgICAgIF90aGlzLmxheWVyQ291bnQgKz0gMTtcblxuICAgICAgICAvLyBzZXQgdGhlIG1vZGVsIGlmIGFsbCB0aGUgbGF5ZXJzIGFyZSByZWFkeVxuICAgICAgICBpZiAoX3RoaXMubGF5ZXJDb3VudCA9PT0gX3RoaXMubGF5ZXJzSW4ubGVuZ3RoKSB7XG4gICAgICAgICAgICBldmVudHMubGF5ZXJzRmluaXNoZWRFdmVudChfdGhpcy5sYXllcnMpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIF9pbml0aWFsaXplKG9wdGlvbnMpO1xuICAgIG9wdGlvbnMgPSBudWxsO1xuICAgIHJldHVybiBfdGhpcztcbn07XG5cblxubW9kdWxlLmV4cG9ydHMgPSBHZW5lcmF0b3I7IiwiLyogZ2xvYmFsIEwgKi9cbid1c2Ugc3RyaWN0JztcbmNvbnN0IFhociA9IHJlcXVpcmUoJ3V0aWwvWGhyJyk7XG5jb25zdCBldmVudHMgPSByZXF1aXJlKCdzaGFrZW1hcC12aWV3L21hcHMvbGF5ZXJzL2V2ZW50cycpO1xuXG52YXIgbGF5ZXIgPSB7aWQ6ICdkb3dubG9hZC9jb250X3BnYS5qc29uJ307XG5sYXllci5uYW1lID0gJ1BHQSBDb250b3Vycyc7XG5sYXllci5nZW5lcmF0ZUxheWVyID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgbGF5ZXIubGF5ZXIgPSBudWxsO1xuICAgIHZhciBwcm9kdWN0ID0gbnVsbDtcbiAgICB2YXIgY29udGVudHMgPSBldmVudC5zaGFrZW1hcFswXS5jb250ZW50cztcblxuICAgIGZvciAobGV0IHAgaW4gY29udGVudHMpIHtcbiAgICAgICAgaWYgKHAgPT09IGxheWVyLmlkKSB7XG4gICAgICAgICAgICBwcm9kdWN0ID0gY29udGVudHNbcF07XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmIChwcm9kdWN0KSB7XG4gICAgICAgIFhoci5hamF4KHtcbiAgICAgICAgICAgIHVybDogcHJvZHVjdC51cmwsXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoanNvbikge1xuICAgICAgICAgICAgICAgIGxheWVyWydsYXllciddID0gTC5nZW9Kc29uKGpzb24pO1xuICAgICAgICAgICAgICAgIGV2ZW50cy5sYXllckZpbmlzaGVkRXZlbnQobGF5ZXIpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgZXZlbnRzLmxheWVyRmluaXNoZWRFdmVudChsYXllcik7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZG9uZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBldmVudHMubGF5ZXJGaW5pc2hlZEV2ZW50KGxheWVyKTtcbiAgICB9XG59O1xuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBsYXllcjsiLCIvKiBnbG9iYWwgTCAqL1xuJ3VzZSBzdHJpY3QnO1xuY29uc3QgZXZlbnRzID0gcmVxdWlyZSgnc2hha2VtYXAtdmlldy9tYXBzL2xheWVycy9ldmVudHMnKSxcbiAgICAgICAgWGhyID0gcmVxdWlyZSgndXRpbC9YaHInKTtcblxudmFyIGxheWVyID0ge3Byb2R1Y3RJZDogJ2Rvd25sb2FkL2dyaWQueG1sJ307XG5sYXllci5nZW5lcmF0ZUxheWVyID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgdmFyIHByb2R1Y3QgPSBudWxsO1xuICAgIHZhciBjb250ZW50cyA9IGV2ZW50LnNoYWtlbWFwWzBdLmNvbnRlbnRzO1xuXG4gICAgZm9yIChsZXQgcCBpbiBjb250ZW50cykge1xuICAgICAgICBpZiAocCA9PT0gbGF5ZXIucHJvZHVjdElkKSB7XG4gICAgICAgICAgICBwcm9kdWN0ID0gY29udGVudHNbcF07XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmIChwcm9kdWN0KSB7XG4gICAgICAgIFhoci5hamF4KHtcbiAgICAgICAgICAgIHVybDogcHJvZHVjdC51cmwsXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoeG1sKSB7XG4gICAgICAgICAgICAgICAgdmFyIHBhcnNlciA9IG5ldyBET01QYXJzZXIoKTtcbiAgICAgICAgICAgICAgICB2YXIgeG1sRG9jID0gcGFyc2VyLnBhcnNlRnJvbVN0cmluZyh4bWwsJ3RleHQveG1sJyk7XG4gICAgICAgICAgICAgICAgdmFyIGxhdCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvbixcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvcHVwSHRtbDtcblxuICAgICAgICAgICAgICAgIGZvciAobGV0IG5vZGUgb2YgeG1sRG9jLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzaGFrZW1hcF9ncmlkJylbMF0uY2hpbGROb2Rlcykge1xuICAgICAgICAgICAgICAgICAgICBpZiAobm9kZS5ub2RlTmFtZSA9PT0gJ2V2ZW50Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGF0ID0gbm9kZS5nZXRBdHRyaWJ1dGUoJ2xhdCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9uID0gbm9kZS5nZXRBdHRyaWJ1dGUoJ2xvbicpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBwb3B1cEh0bWwgPSBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPHRhYmxlPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8dHI+PHRoPicgKyBub2RlLmdldEF0dHJpYnV0ZSgnZXZlbnRfaWQnKSArICc8L3RoPjwvdHI+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzx0cj48dGFibGU+PHRoPk1hZ25pdHVkZTo8L3RoPjx0ZD4nICsgbm9kZS5nZXRBdHRyaWJ1dGUoJ21hZ25pdHVkZScpICsgJzwvdGQ+PC90YWJsZT48L3RyPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8dHI+PHRhYmxlPjx0aD5EZXB0aDo8L3RoPjx0ZD4nICsgbm9kZS5nZXRBdHRyaWJ1dGUoJ2RlcHRoJykgKyAnPC90ZD48L3RhYmxlPjwvdHI+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzx0cj48dGFibGU+PHRoPkxvY2F0aW9uOjwvdGg+PHRkPicgKyBub2RlLmdldEF0dHJpYnV0ZSgnbGF0JykgKyAnLCAnICsgbm9kZS5nZXRBdHRyaWJ1dGUoJ2xvbicpICsgJzwvdGQ+PC90YWJsZT48L3RyPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8L3RhYmxlPic7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGxheWVyWydsYXllciddID0gTC5tYXJrZXIoW2xhdCwgbG9uXSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5iaW5kUG9wdXAocG9wdXBIdG1sKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLm9wZW5Qb3B1cCgpO1xuICAgICAgICAgICAgICAgIGV2ZW50cy5sYXllckZpbmlzaGVkRXZlbnQobGF5ZXIpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgZXZlbnRzLmxheWVyRmluaXNoZWRFdmVudChsYXllcik7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZG9uZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG59O1xuXG5sYXllci5uYW1lID0gJ0VwaWNlbnRlcic7XG5cbm1vZHVsZS5leHBvcnRzID0gbGF5ZXI7IiwidmFyIGxheWVyRmluaXNoZWRFdmVudCA9IGZ1bmN0aW9uIChsYXllcikge1xuICAgIHZhciBldnQgPSBuZXcgQ3VzdG9tRXZlbnQoJ2xheWVyRmluaXNoZWQnLCB7ZGV0YWlsOiBsYXllcn0pO1xuICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KGV2dCk7XG59O1xuXG52YXIgbGF5ZXJzRmluaXNoZWRFdmVudCA9IGZ1bmN0aW9uIChsYXllcnMpIHtcbiAgICB2YXIgZXZ0ID0gbmV3IEN1c3RvbUV2ZW50KCdsYXllcnNGaW5pc2hlZCcsIHtkZXRhaWw6IGxheWVyc30pO1xuICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KGV2dCk7XG59O1xuXG52YXIgZXZlbnRzID0ge2xheWVyc0ZpbmlzaGVkRXZlbnQ6IGxheWVyc0ZpbmlzaGVkRXZlbnQsXG4gICAgbGF5ZXJGaW5pc2hlZEV2ZW50OiBsYXllckZpbmlzaGVkRXZlbnR9O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGV2ZW50czsiXX0=
