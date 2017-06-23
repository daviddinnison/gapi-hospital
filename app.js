let map;
let geocoder;
let marker;

//-- google map display ----------------------------------------
function initMap() {
  var uluru = { lat: -25.363, lng: 131.044 };
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
  key: 'AIzaSyCNb2Rq_psL37TOUxYPnAEt-eFzBrJZe2s',
  geoLocation: [],
  zipcode: null,
  searchResults: [],
};


// -- google maps & places requests ----------------------------------------

// convets zip code to latitutde and longitude 
//let geocoding = (state, zipcode, lat, lng, results, callback) => {
let geocoding = (state, zipcode, callback) => {
  let baseURL = 'https://maps.googleapis.com/maps/api';

  // Interpolation in a template literal.
  let geocodeURL = `${ baseURL }/geocode/json?address=${zipcode}&key=${state.key}`

  //make geocode request
  $.getJSON(geocodeURL, function(data) {
    console.log('Geo Data:', data);

    //shorthand for adding geocode to state
    const location = data.results[0].geometry.location;
    
    //creates new location object using place libary and assign it to a variable
    const focus = new google.maps.LatLng(location.lat, location.lng)

    //pushes lat/long into state
    state.geoLocation = [ location.lat, location.lng ]

    //required for PlacesService function
    const map = new google.maps.Map(document.getElementById('map'), {
      center: focus,
      zoom: 15//may change later
    });

    //
    const googlePlaces = new google.maps.places.PlacesService(map);

    const request = {
      location: focus,
      radius: '40000',//may change later
      types: [ 'hospital' ]//may change later
    };

    //where the actual API request for Google Places is initialized
    googlePlaces.nearbySearch(request, function(results, status) {
      // console.log('Nearby:', results, status)
      appState.searchResults = results;
      console.log('what is inside the state? ', appState.searchResults)

      // All the work is done!
      callback(appState)
    })
  }); 
}

// -- state mods ----------------------------------------

function setZipcode(state, zipcode) {
  state.zipcode = zipcode;
  //console.log(zipcode);  
}

//-- Render functions ----------------------------------------

function render(state) {
  
  console.log(state.searchResults);
  let renderbob = '';
  state.searchResults.forEach(function(items) {
    renderbob += (`
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
  $('.results').html(renderbob)
  $('h2').removeClass('hidden');
}



//-- Event handlers ----------------------------------------

$('.search-bar').submit(function (event) {
  // 1. Receive input from user
  // 2. Modify state based on user input
  // 3. Run rendering function
  event.preventDefault();
  const zipcode = $(event.currentTarget).find('input').val();
  
  setZipcode(appState, zipcode);
  geocoding(appState, zipcode, render);
})

$('.results').on('click', 'li', event => {
  const selectedResult = $(event.target).find('span');
  setSelecedResult(appState, selectedResult);
  // render(appState);
});

$(function () {
  // console.log( "ready?" );
})

// libaries
  // places: https://developers.google.com/maps/documentation/javascript/places#place_search_requests
  // geocode: https://developers.google.com/maps/documentation/geocoding/intro#GeocodingResponses
  //web service: https://developers.google.com/maps/documentation/geocoding/web-service-best-practices#ParsingJSON


//-- test URLS ----------------------------------------

  //https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=38.75578400000001,-77.263606&radius=5000&type=hospital&keyword=emergency&key=AIzaSyCNb2Rq_psL37TOUxYPnAEt-eFzBrJZe2s

  // https://maps.googleapis.com/maps/api/geocode/json?address=22152&key=AIzaSyCNb2Rq_psL37TOUxYPnAEt-eFzBrJZe2s