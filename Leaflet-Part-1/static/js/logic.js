// url for data: https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson
const queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl).then(function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

// Define a function we want to run once for each feature in the features array
// Give each feature a popup describing the place and magnitude and depth of the earthquake
function createFeatures(earthquakeData) {

  function popUpMsg(feature, layer) {
    layer.bindPopup("<h3>Location:</h3>" + feature.properties.place +
      "</h3><hr><p>" + "<h3>Magnitude:</h3>" + feature.properties.mag + "</h3><hr><p>"+ "<h3>Depth:</h3>"+ feature.geometry.coordinates[2]+"</p>");
  };

  let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: popUpMsg,
    pointToLayer: CircleMark
  });

  newMap(earthquakes);

}

//Create a function for CircleMarker
function CircleMark(feature, latlng) {
  return new L.CircleMarker(latlng, {
    radius: markerSize(feature.properties.mag),
    fillColor: markerColor(feature.geometry.coordinates[2]),
    color: "#000",
    weight: 0.5,
    opacity: 0.5,
    fillOpacity: 1
  });
}

function newMap(earthquakes){

   // Define streetmap and darkmap layers
  let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1
  });

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  let myMap = L.map("map", {
    center: [37.8, -96],
    zoom: 5,
    layers: [streetmap, earthquakes]     //default selected layer
    });

  // Add legend refer:https://leafletjs.com/examples/choropleth/
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (myMap) {
  
      var div = L.DomUtil.create('div', 'info legend'),
          grades = [-10, 10, 30, 50, 70, 90],
          labels = ['<h5>Magnitude</h5>'];
  
      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
          labels.push(
              '<i style="background:' + markerColor(grades[i] + 1) + '"></i> ' +
              grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+'));
      }
      div.innerHTML = labels.join('<br>')
      return div;
  };
  
  legend.addTo(myMap);

}


function markerSize(magnitudeSize) {
  return magnitudeSize * 5;
}

function markerColor(D){
  return D > 90 ? '#800026':
        D > 70 ? '#BD0026':
        D > 50 ? '#E31A1C':
        D > 30 ? '#FC4E2A':
        D > 10 ? '#FD8D3C':
                '#FFEDA0';
}
