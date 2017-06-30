let map, geocoder, marker;

//-- google map display ----------------------------------------
function initMap() {
  const uluru = { lat: -25.363, lng: 131.044 };
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: uluru
  });
  marker = new google.maps.Marker({
    position: uluru,
    map: map
  });
  geocoder = new google.maps.Geocoder();  
}

//-- app state ----------------------------------------
const appState = {
  geoLocation: [],
  zipcode: null,
  searchResults: [],
};

// -- google maps & places requests ----------------------------------------

// convets zip code to latitutde and longitude 
const geocoding = (state, zipcode, callback) => {
  const key = 'AIzaSyCNb2Rq_psL37TOUxYPnAEt-eFzBrJZe2s';

  const baseURL = 'https://maps.googleapis.com/maps/api';

  // Interpolation in a template literal.
  const geocodeURL = `${ baseURL }/geocode/json?address=${zipcode}&key=${key}`

  //make geocode request
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
      zoom: 15
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
      callback(appState)
    });
  }); 
}

// -- state mods ----------------------------------------
function setZipcode(state, zipcode) {
  state.zipcode = zipcode;
}

//-- Render functions ----------------------------------------
function render(state) {
  //HTML template
  const renderbob = state.searchResults.map(function(items) {
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
  $('.results').html(renderbob);
  $('h2').removeClass('hidden');
}



//-- Event handlers ----------------------------------------
function eventHandling() {
  //stores zipcode on submit
  $('.search-bar').submit(function (event) {
    event.preventDefault();
    const zipcode = $(event.currentTarget).find('input').val();
    setZipcode(appState, zipcode);
    geocoding(appState, zipcode, render);
  });


  $('.results').on('click', 'li', event => {
    const selectedResult = $(event.target).find('span');
    setSelecedResult(appState, selectedResult);
  });
}


$(function() {
  eventHandling();
});