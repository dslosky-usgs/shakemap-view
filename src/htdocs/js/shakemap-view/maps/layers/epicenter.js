/* global L */
'use strict';
const events = require('shakemap-view/maps/layers/events'),
        Xhr = require('util/Xhr');

var layer = {productId: 'download/grid.xml'};
layer.generateLayer = function (event) {
    var product = null;
    var contents = event.shakemap[0].contents;

    for (let p in contents) {
        if (p === layer.productId) {
            product = contents[p];
            break;
        }
    }

    if (product) {
        Xhr.ajax({
            url: product.url,
            success: function (xml) {
                var parser = new DOMParser();
                var xmlDoc = parser.parseFromString(xml,'text/xml');
                var lat,
                        lon,
                        popupHtml;

                for (let node of xmlDoc.getElementsByTagName('shakemap_grid')[0].childNodes) {
                    if (node.nodeName === 'event') {
                        lat = node.getAttribute('lat');
                        lon = node.getAttribute('lon');

                        popupHtml = 
                            '<table>' +
                            '<tr><th>' + node.getAttribute('event_id') + '</th></tr>' +
                            '<tr><table><th>Magnitude:</th><td>' + node.getAttribute('magnitude') + '</td></table></tr>' +
                            '<tr><table><th>Depth:</th><td>' + node.getAttribute('depth') + '</td></table></tr>' +
                            '<tr><table><th>Location:</th><td>' + node.getAttribute('lat') + ', ' + node.getAttribute('lon') + '</td></table></tr>' +
                            '</table>';
                        break;
                    }
                }

                layer['layer'] = L.marker([lat, lon])
                                    .bindPopup(popupHtml)
                                    .openPopup();
                events.layerFinishedEvent(layer);
            },
            error: function () {
                events.layerFinishedEvent(layer);
            },
            done: function () {
            }
        });
    }
};

layer.name = 'Epicenter';

module.exports = layer;