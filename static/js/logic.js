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

//USGS Data
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

// Ingest and filter data
d3.json(url, function(data) {

  data.features = data.features.filter(feature => feature.properties.mag > 0)

  function styleInfo(feature) {
    console.log("TEST: " + feature.properties.mag)
    return {
      opacity: 1,
      fillOpacity: 0.5,
      fillColor: getColor(feature.properties.mag),
      color: "#000000",
      radius: (Math.sqrt((feature.properties.mag)**3 * 2.718)),
      stroke: true,
      weight: 0.75,
      //strokeopacity="0.5",
    };
  }
  
  // Set Magnitude colours
    function getColor(magnitude) {
    switch (true) {
    case magnitude > 5:
      return "#b81c1c";
    case magnitude > 4:
      return "#ea822c";
    case magnitude > 3:
      return "#f0ec18";
    case magnitude > 2:
      return "#79bf4b";
    case magnitude > 1:
      return "#2f7003";
    default:  // Less than one
      return "#1cabb8";
    }
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
        "#1cabb8",
        "#2f7003",
        "#79bf4b",
        "#f0ec18",
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
