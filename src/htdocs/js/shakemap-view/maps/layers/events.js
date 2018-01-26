var layerFinishedEvent = function (layer) {
    var evt = new CustomEvent('layerFinished', {detail: layer});
    window.dispatchEvent(evt);
};

var layersFinishedEvent = function (layers) {
    var evt = new CustomEvent('layersFinished', {detail: layers});
    window.dispatchEvent(evt);
};

var events = {layersFinishedEvent: layersFinishedEvent,
    layerFinishedEvent: layerFinishedEvent};

module.exports = events;