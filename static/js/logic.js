// Create a map object
var myMap = L.map("map", {
  center: [37.75, -122.48],
  zoom: 8
});

// Add a tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);

//Store url
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"


// Grab the data with d3
d3.json(url, function(data) {
  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 0.5,
      fillColor: getColor(feature.properties.mag),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }
  // set different color from magnitude
    function getColor(magnitude) {
    switch (true) {
    case magnitude > 5:
      return "#b81c1c";
    case magnitude > 4:
      return "#ea822c";
    case magnitude > 3:
      return "#ee9c00";
    case magnitude > 2:
      return "#79bf4b";
    case magnitude > 1:
      return "#2f7003";
    default:  // Less than one
      return "#1cabb8";
    }
  }
  // set radius from magnitude
    function getRadius(magnitude) {
    if (magnitude <= 0) {
      return 0;
    }

    return Math.sqrt((magnitude+1)**2 * 2.718);
  }
    // GeoJSON layer
    L.geoJson(data, {
      // Make cricles
      pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng);
      },
      // circle style
      style: styleInfo,
      // popup for each marker
      onEachFeature: function(feature, layer) {
        layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
      }
    }).addTo(myMap);
  
    // an object legend
    var legend = L.control({
      position: "topleft"
    });
  
    // details for the legend
    legend.onAdd = function() {
      var div = L.DomUtil.create("div", "info legend");
  
      var colourRamp = [0, 1, 2, 3, 4, 5];
      var colourList = [
        "#98ee00",
        "#d4ee00",
        "#eecc00",
        "#ee9c00",
        "#ea822c",
        "#ea2c2c"
      ];
  
      // Looping through
      for (var i = 0; i < colourRamp.length; i++) {
        div.innerHTML +=
          "<i style='background: " + colourList[i] + "'></i> " +
          colourRamp[i] + (colourRamp[i + 1] ? "&ndash;" + colourRamp[i + 1] + "<br>" : "+");
      }
      return div;
    };
  
    // Finally, we our legend to the map.
    legend.addTo(myMap);
  });