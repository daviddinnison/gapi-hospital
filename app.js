function initMap() {
  var uluru = { lat: -25.363, lng: 131.044 };
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: uluru
  });
  var marker = new google.maps.Marker({
    position: uluru,
    map: map
  });
}


//----------------------------------------------------- app state

const appState = {
  key: 'AIzaSyCNb2Rq_psL37TOUxYPnAEt-eFzBrJZe2s',
  geoLocation: [],
  results: [],
};



//test URLS
//https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=38.75578400000001,-77.263606&radius=5000&type=hospital&keyword=emergency&key=AIzaSyCNb2Rq_psL37TOUxYPnAEt-eFzBrJZe2s


// userInput is the location that the user set


// -------------------------------------------------------------state mods

// convets zip code to latitutde and longitude
let geocoding = function(state, userInput, callback) {
  console.log(userInput);
  let geocodeURL = `https://maps.googleapis.com/maps/api/geocode/json?address=${userInput}&key=${state.key}`
  console.log(geocodeURL);
  $.getJSON(geocodeURL, iHaveThisLocation);
}

// creates query with longitude and latitude vales for geocoding function and makes API request
function getData(state, userInput, callback) {

  let searchURL = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${appState.geoLocation}&radius=5000&type=hospital&keyword=emergency&key=${state.key}`;
  $.getJSON(userInput, iHaveResults);
}



//results.geometry.location
// https://maps.googleapis.com/maps/api/geocode/json?address=22152&key=AIzaSyCNb2Rq_psL37TOUxYPnAEt-eFzBrJZe2s
// // State manipulation functions

// Callback
function iHaveThisLocation(state, getData, callback) {
  
  console.log(state, getData)

  state.geoLocation = state.results[0].geometry.location;
  console.log("longitude and latitude results:" + state.geoLocation);
  getData(state, callback);
}

function iHaveResults(state, geocoding) {
  appState.results = results.name;
  console.log("hospital name:" + results.name);
}

//-------------------------------------------------------------------------Render functions


//------------------------------------------------------------------------- Event handlers

$('.search-bar').submit(function (event) {
  event.preventDefault();
  const userInput = $(event.currentTarget).find('input').val();
  console.log('user entered:' + userInput);
  geocoding(appState, userInput, iHaveThisLocation);
})

$(function() {
  // console.log( "ready?" );
}) 


// grab the value -> take the value and add it to the search url -> return we dump in the html