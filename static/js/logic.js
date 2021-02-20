// Create map object centered around SF Area
var myMap = L.map("map", {
    center: [37.75, -122.48],
    zoom: 8
  });

//USGS GJSON URL
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

  //Specified Tile Layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);


//Ingest data vai D3
d3.json(url, function(data) {
  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.properties.mag),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }
  // Colour ramp 
  function getColor(magnitude) {
    switch (true) {
    case magnitude > 5:
      return "#ea2c2c";
    case magnitude > 4:
      return "#b81c1c"; // Dark Red
    case magnitude > 3:
      return "#cf811b"; // Dark orange
    case magnitude > 2:
      return "#d9ca29"; // orange-yellow
    case magnitude > 1:
      return "#1cabb8"; //dark green
    default:
      return "#98ee00";
    }
  }

    // set radius from magnitude
    function getRadius(magnitude) {
      if (magnitude === 0) {
        return 0;
      }   
    return Math.sqrt((magnitude+1)**3 * 2.718);
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
      
