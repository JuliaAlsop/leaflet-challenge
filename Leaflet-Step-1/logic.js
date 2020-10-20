// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
  
});

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function(feature, latlng) {
      return new L.CircleMarker(latlng, {
        radius: 5,
        color: '#FF0000',
        opacity: 1
      });
    },
    
    onEachFeature: onEachFeature
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define streetmap layer & required attribution for copyright
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });
  
  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Previous Day Earthquakes": streetmap,
    //"Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create map, giving it layers to display 
  // Map center on Nebraska and zoomed out for entire U.S. view
  var myMap = L.map("map", {
    center: [
      41.49, -99.90
    ],
    zoom: 3.5,
    layers: [streetmap, earthquakes]
  });

//Create a legend on the bottom left
var legend = L.control({position: 'bottomright'});

legend.onAdd = function(myMap){
  var div = L.DomUtil.create('div', 'info legend'),
    grades = [0, 1, 2, 3, 4, 5],
    labels = [];

// loop through our density intervals and generate a label with a colored square for each interval
for (var i = 0; i < grades.length; i++) {
  div.innerHTML +=
      '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
      grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
}
return div;
};

legend.addTo(myMap);
}

//Create color range for the circle diameter 
function getColor(d){
  return d > 5 ? "#FF0000":
  d  > 4 ? "#ff6f08":
  d > 3 ? "#ff9143":
  d > 2 ? "#ffb37e":
  d > 1 ? "#4daf4a":
           "#4dff]";
}

//Change the maginutde of the earthquake by a factor of 25,000 for the radius of the circle. 
function getRadius(value){
  return value*25000
}

