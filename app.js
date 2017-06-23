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

  // https://maps.googleapis.com/maps/api/geocode/json?address=22152&key=AIzaSyCNb2Rq_psL37TOUxYPnAEt-eFzBrJZe2s


// -------------------------------------------------------------controllers

// convets zip code to latitutde and longitude
let geocoding = (state, userInput, callback) => {
  let geocodeURL = `https://maps.googleapis.com/maps/api/geocode/json?address=${userInput}&key=${state.key}`
  const query = {
    'location': "%s,%s" % (lat, lng),
  }
  console.log("query is: " + query);
  console.log(query.location)
  $.getJSON(geocodeURL, query, myFunctions.iHaveThisLocation); 
}

// creates query with longitude and latitude vales for geocoding function and makes API request
let getData = (state, callback) => {
  console.log('i am here')
  let searchURL = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${appState.geoLocation}&radius=5000&type=hospital&keyword=emergency&key=${state.key}`;
  function wait(seconds, callback) {
    setTimeout(function() {
      $.getJSON(state, myFunctions.iHaveResults);
    }, seconds * 1000);
  }
  console.log('waiting')
  // $.getJSON(state, myFunctions.iHaveResults);
}
// -------------------------------------------------------------state mods

var myFunctions = {
  iHaveThisLocation: (state, getData, callback) => {
    state.geoLocation = state.results[0].geometry.location;
    console.log("longitude and latitude results:" + state.geoLocation);
    getData(state, callback);
  },

  storeResults: (state, geocoding) => {
    appState.results = results.name;
    console.log("hospital name:" + results.name);
    render(appState);
  }

};


//-------------------------------------------------------------------------Render functions



//------------------------------------------------------------------------- Event handlers


$('.search-bar').submit(function (event) {
  event.preventDefault();
  const userInput = $(event.currentTarget).find('input').val();
  console.log('user entered:' + userInput);
  geocoding(appState, userInput, myFunctions.iHaveThisLocation);
  
})

$(function () {
  // console.log( "ready?" );
})



// grab the value -> take the value and add it to the search url -> return we dump in the html