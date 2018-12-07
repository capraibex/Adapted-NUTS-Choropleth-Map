var NUTS0, NUTS2_adpt, Metro_regions;

L.TopoJSON = L.GeoJSON.extend({
    addData: function(jsonData) {
      if (jsonData.type === 'Topology') {
        for (key in jsonData.objects) {
          geojson = topojson.feature(jsonData, jsonData.objects[key]);
          L.GeoJSON.prototype.addData.call(this, geojson);
        }
      }
      else {
        L.GeoJSON.prototype.addData.call(this, jsonData);
      }
    }
});

var mymap = L.map('map').setView([55, 10], 3.5);
var positron = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {}).addTo(mymap);

d3.json("static/data/regions_adapted.topojson", function(d){
    NUTS0 = new L.TopoJSON(d, {
        filter: function(feature, layer) {
            return feature.properties.NUTS_ID.length == 2;
        },
        style: style
    })
    .bindTooltip(function(layer) {
        return layer.feature.properties.NUTS_NAME;
    }, { sticky: true }).addTo(mymap);

    NUTS2_adpt = new L.TopoJSON(d, {
        filter: function(feature, layer) {
            return feature.properties.NUTS_ID.length != 2;
        },
        style: style
    })
    .bindTooltip(function(layer) {
        return layer.feature.properties.NUTS_NAME;
    }, { sticky: true });

    Metro_regions = new L.TopoJSON(d, {
        filter: function(feature, layer) {
            return feature.properties.NUTS_ID.startsWith("METRO");
        },
        style: style
    })
    .bindTooltip(function(layer) {
        return layer.feature.properties.NUTS_NAME;
    }, { sticky: true });
})

function changeNUTS(d){
    mymap.removeLayer(NUTS0)
    mymap.removeLayer(NUTS2_adpt)
    mymap.removeLayer(Metro_regions)

    switch(d) {
        case "NUTS0":
            mymap.addLayer(NUTS0);
            break;
        case "NUTS2_adpt":
            mymap.addLayer(NUTS2_adpt);
            break;
        case "Metro":
            mymap.addLayer(Metro_regions);
            break;
    }
}

function style(feature) {
    return {
        className: feature.properties.NUTS_ID.startsWith("METRO") ? 'metroStyle' : 'defaultStyle'
    };
}
