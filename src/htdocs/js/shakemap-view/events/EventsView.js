'use strict';
const View = require('hazdev-webutils/src/mvc/View'),
        Xhr = require('util/Xhr');

var EventView = function (options) {
    var _this,
            _initialize;

    _this = View(options);

    _initialize = function (/*options*/ ) {
        _this.el.innerHTML = 
                '' +
                '<div class="loadButton">Refresh List</div>';
        _this.el.eventList = [];

        _this.model.on('change:events', _this.renderEvents);
        _this.loadButton = _this.el.querySelector('.loadButton');
        _this.loadButton.addEventListener('click', _this.getEvents);

        _this.getEvents();
    };

    _this.renderEvents = function () {
        var eventHtml = '';
        for (let event of _this.model.get('events')) {
            eventHtml += '<div class="event">' + event.id + '</div>';
        }

        _this.el.innerHTML = 
                '<div class="event-list">' + eventHtml + '</div>' +
                '<div class="loadButton">Refresh List</div>';
        
        _this.loadButton = _this.el.querySelector('.loadButton');
        _this.loadButton.addEventListener('click', _this.getEvents);

        _this.events = _this.el.querySelectorAll('.event');
        if (_this.events) {
            for (let event of _this.events) {
                event.addEventListener('click', _this.loadEvent);
            }
        }
    };

    _this.getEvents = function () {
        _this.model.set({
            loading: true
        });

        Xhr.ajax({
            url: _this.model.get('productsUrl'),
            success: function (json) {
                _this.model.set({
                    events: json
                });
            },
            error: function () {
                _this.model.set({
                    events: []
                });
            },
            done: function () {
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
        for (let eventJson of _this.model.get('events')) {
            if (eventJson['id'] === eventId) {
                eventData = eventJson;
                break;
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