'use strict';

//-- INITIAL STATE 
const appState = {
  apiKey : 'AIzaSyCNb2Rq_psL37TOUxYPnAEt-eFzBrJZe2s',
  geoLocation: [],
  resultMarkers: [],
  searchResults: [],
  zipcode: null
};

// GOOGLE MAPS DISPLAY AND DEFAULT VALUES
function initMap() {
  let map, geocoder, marker; 
  const centerOfUsa = { lat: 39.8097, lng: -98.5556 };
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 3,
    center: centerOfUsa
  });
  marker = new google.maps.Marker({
    position: centerOfUsa,
    map: map,
    title:"Lebanon, KS"
  });
  geocoder = new google.maps.Geocoder();  
}

function addPlaceMarkers(state) {
  const markers = state.searchResults.map(function(items) {
    return {
      lat: items.geometry.location.lat(),
      lng: items.geometry.location.lng()
    };
  });
  console.log('markers', markers);
  appState.resultMarkers = markers;
  console.log('state', appState);
  const map = new google.maps.Map(document.getElementById('map'), {
    center:  {lat: 38.7735269, lng:-77.22901929999999},
    zoom: 10
  });


  var marker = new google.maps.Marker({
          position: {lat: 38.7735269, lng:-77.22901929999999},
          map: map,
          title: 'Hello World!'
        });

      var markertest = new google.maps.Marker({
          position: {lat: 38.9117752, lng:-77.07586679999997},
          map: map,
          title: 'Hello World!'
        });    

}

const requestSearchResults = (state, zipcode, callback) => {
  // zip code must be converted to geocode for API request and map display
  const baseURL = 'https://maps.googleapis.com/maps/api';
  const geocodeURL = `${ baseURL }/geocode/json?address=${zipcode}&key=${state.apiKey}`;

  // geocode API request
  $.getJSON(geocodeURL, data => {
    //adds geocode to state
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

    // sets where to make Google Places request
    const googlePlaces = new google.maps.places.PlacesService(map);
    const request = { 
      location: focus,
      radius: '40000',
      types: [ 'hospital' ]
    };

    //Google Places API request
    googlePlaces.nearbySearch(request, (results, status) => {
      appState.searchResults = results;
      console.log('place results', results);
      callback(appState);
      addPlaceMarkers(appState);
    });

  }); 
};



// STATE MODS
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
    requestSearchResults(appState, userZipcode, renderHtml);
  });
}

// DOCUMENT READY FUNCTIONS
$(function() {
  eventHandling();
});