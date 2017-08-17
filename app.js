'use strict';

//-- INITIAL STATE 
const appState = {
  apiKey : 'AIzaSyCNb2Rq_psL37TOUxYPnAEt-eFzBrJZe2s',
  geoLocation: [],
  searchResults: [],
  zipcode: null
};

// GOOGLE MAPS DISPLAY AND DEFAULT VALUES
function initialMap() {
  let map, geocoder, marker; 
  const centerOfUsa = { lat: 39.8097, lng: -98.5556 };
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 3,
    center: centerOfUsa
  });
  marker = new google.maps.Marker({
    position: centerOfUsa,
    map: map
  });
  geocoder = new google.maps.Geocoder();  
}

const convertZipToGeocode = (state, zipcode, callback) => {
  // sets URL for request with zipcode
  const baseURL = 'https://maps.googleapis.com/maps/api';
  const geocodeURL = `${ baseURL }/geocode/json?address=${zipcode}&key=${state.apiKey}`;
// test URL: https://maps.googleapis.com/maps/api/geocode/json?address=22152&key=AIzaSyCNb2Rq_psL37TOUxYPnAEt-eFzBrJZe2s

  //makes geocode api request
  $.getJSON(geocodeURL, data => {
    //shorthand for adding geocode to state
    const location = data.results[0].geometry.location;
    //creates new location object using place libary and assign it to a variable
    const focus = new google.maps.LatLng(location.lat, location.lng);
    //pushes lat/long into state
    state.geoLocation = [ location.lat, location.lng ];
    //required for PlacesService function
    const map = new google.maps.Map(document.getElementById('map'), {
      center: focus,
      zoom: 12
    });

    const googlePlaces = new google.maps.places.PlacesService(map);

    const request = {
      location: focus,
      radius: '40000',
      types: [ 'hospital' ]
    };

    //where the actual API request for Google Places is initialized
    googlePlaces.nearbySearch(request, (results, status) => {
      appState.searchResults = results;
      // All the work is done!
      callback(appState);
    });
  }); 
};

// -- state mods ----------------------------------------
function setZipcode(state, zipcode) {
  state.zipcode = zipcode;
}

// RENDERING
function renderHtml(state) {
  const resultTemplate = state.searchResults.map(function(items) {
    return (`
      <div class = "listen">  
        <div class='individual-result'>
          <img src ='${items.icon}'>
          <p class = "hospital-name">${items.name}</p>
          <p>${items.vicinity}</p>
          <p class = 'rating'>${items.rating} star rating</p>
        </div>
      </div>
    `)
  })
  $('.results').html(resultTemplate);
  $('h2').removeClass('hidden');
}

// EVENTS
function eventHandling() {
  $('.search-bar').submit(function (event) {
    event.preventDefault();
    const userZipcode = $(event.currentTarget).find('input').val();
    setZipcode(appState, userZipcode);
    convertZipToGeocode(appState, userZipcode, renderHtml);
  });
}

// functions load on document ready
$(function() {
  eventHandling();
});