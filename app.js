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
  results: [],
};


// -- controllers ----------------------------------------

// convets zip code to latitutde and longitude 
//let geocoding = (state, zipcode, lat, lng, results, callback) => {
let geocoding = (state, zipcode, lat, lng, results) => {
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
      radius: '5000',//may change later
      types: [ 'hospital' ]//may change later
    };

    //where the actual API request for Google Places is initialized
    googlePlaces.nearbySearch(request, function(results, status) {
      console.log('Nearby:', results, status)
    })
  }); 
}

// -- state mods ----------------------------------------

function setZipcode(state, zipcode) {
  state.zipcode = zipcode;
  //console.log(zipcode);  

}



var myFunctions = {
  iHaveThisLocation: (data) => {
    appState.geoLocation = data.results[0].geometry.location;
    console.log(data.results[0].geometry.location)
    getData(data, myFunctions.storeResults);
  },

  storeResults: (state, geocoding) => {
    appState.results = results.name;
    console.log("hospital name:" + results.name);
    render(appState);
  },

};

//-- Render functions ----------------------------------------
function renderMap(state) {
  if (state.zipcode) {
    geocoder.geocode({ 'address': state.zipcode }, (res, status) => {
      map.setCenter(res[0].geometry.location)
      map.setZoom(8);
    });
  }
}

//-- Event handlers ----------------------------------------

$('.search-bar').submit(function (event) {
  // 1. Receive input from user
  // 2. Modify state based on user input
  // 3. Run rendering function
  event.preventDefault();
  const zipcode = $(event.currentTarget).find('input').val();
  
  setZipcode(appState, zipcode);
  geocoding(appState, zipcode);
  // setGeocode(appState, query)

  // getData();
  // getData(appState);
  renderMap(appState);

//  geocoding(appState, userInput, myFunctions.iHaveThisLocation);
})

/**
 * state = {
 *   results: [],
 *   selectedResult: null,
 * }
 */

$('.results').on('click', 'li', event => {
  const selectedResult = $(event.target).find('span');
  setSelecedResult(appState, selectedResult);
  render(appState);
});

$(function () {
  // console.log( "ready?" );
})

///to do list
// 1 lat and longitude is being returned as empty object. our URL for converting zip works. 








//-- test URLS ----------------------------------------

  //https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=38.75578400000001,-77.263606&radius=5000&type=hospital&keyword=emergency&key=AIzaSyCNb2Rq_psL37TOUxYPnAEt-eFzBrJZe2s

  // https://maps.googleapis.com/maps/api/geocode/json?address=22152&key=AIzaSyCNb2Rq_psL37TOUxYPnAEt-eFzBrJZe2s