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
  let geocodeURL = `https://maps.googleapis.com/maps/api/geocode/json?address=${zipcode}&key=${state.key}`
  console.log(geocodeURL);
  

  let query = {
    'location': '%s,%s' % (lat, lng),
    'results': results,
  }

  $.getJSON(geocodeURL, query); //maybe some parameter issues

}

// creates query with longitude and latitude vales for geocoding function and makes API request
let getData = (state, ) => {

  console.log(appState.geoLocation);

  // let searchURL = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${state.geoLocation.lat},${state.geoLocation.lng}&radius=5000&type=hospital&keyword=emergency&key=${appState.key}`;

// console.log(searchURL)
  
  // const results = {
  //   key: value
  // }

  // $.getJSON(searchURL, myFunctions.storeResults);
};


// -- state mods ----------------------------------------

function setZipcode(state, zipcode) {
  state.zipcode = zipcode;
  //console.log(zipcode);  
}

function setGeocode(state, query) {//these parameters might not be working
  // grab zipcode and convert to geocode here
  console.log('we are in setGeocode...');
  state.geoLocation = query.results[0].geometry.location;
  console.log(state.geoLocation);
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

  removeChars: (string) => {
  var regex = /[latng:""{}?\n|\r]/g;
  return string.replace(regex, '').split(' ');
  }
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
  setGeocode(appState, query)
  getData();
  //getData(appState );
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