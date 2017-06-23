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


//-- app state ----------------------------------------

const appState = {
  key: 'AIzaSyCNb2Rq_psL37TOUxYPnAEt-eFzBrJZe2s',
  geoLocation: [],
  results: [],
};


//-- test URLS ----------------------------------------

  //https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=38.75578400000001,-77.263606&radius=5000&type=hospital&keyword=emergency&key=AIzaSyCNb2Rq_psL37TOUxYPnAEt-eFzBrJZe2s

  // https://maps.googleapis.com/maps/api/geocode/json?address=22152&key=AIzaSyCNb2Rq_psL37TOUxYPnAEt-eFzBrJZe2s


// -- controllers ----------------------------------------

// convets zip code to latitutde and longitude
let geocoding = (state, userInput, lat, lng, results, callback) => {
  let geocodeURL = `https://maps.googleapis.com/maps/api/geocode/json?address=${userInput}&key=${state.key}`
  const query = {
    'location': '%s,%s' % (lat, lng),
    'results': results,
  }
  $.getJSON(geocodeURL, query, myFunctions.iHaveThisLocation); 
}

// creates query with longitude and latitude vales for geocoding function and makes API request
let getData = (state, myFunctions, callback) => {
  
  console.log('i am here in getData')
  console.log("what is this a type of ?: " + typeof(appState.geoLocation))
  var obj = JSON.stringify(appState.geoLocation);
  console.log("what is this a type of NOW?: " + typeof(obj))


  // let clean = myFunctions.removeChars(obj).val();
  console.log('START HERE: need to pass in function removeChars to remove the extra characters in obj string, uncomment line 51 to see error')


  let searchURL = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${obj}&radius=5000&type=hospital&keyword=emergency&key=${appState.key}`;

  console.log("why is geoLocation not being added to URL?" + searchURL) 

  // $.getJSON(state, myFunctions.iHaveResults);
};


// -- state mods ----------------------------------------

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



//-- Event handlers ----------------------------------------

$('.search-bar').submit(function (event) {
  event.preventDefault();
  const userInput = $(event.currentTarget).find('input').val();
  console.log('user entered:' + userInput);
  geocoding(appState, userInput, myFunctions.iHaveThisLocation);
})

$(function () {
  // console.log( "ready?" );
})
