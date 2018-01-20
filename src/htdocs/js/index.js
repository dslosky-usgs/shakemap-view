/* global window */
'use strict';

const App = require('shakemap-view/App'),
	ShakeMapModel = require('shakemap-view/ShakeMapModel');

var app = window.App = App({
	el: document.querySelector('#smView'),
	model: ShakeMapModel()
});
app.model.trigger('change');

