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


// app state

const appState = {
  // store results here
};

// ref url https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522,151.1957362&radius=500&type=hospital&keyword=emergency&key=AIzaSyCNb2Rq_psL37TOUxYPnAEt-eFzBrJZe2s




// userInput is the location that the user set

// https://maps.googleapis.com/maps/api/service/output?

// https://www.googleapis.com/maps/v3/search/
// Controller
function getData(userInput, callback) {
  const mapsKey = 'AIzaSyCNb2Rq_psL37TOUxYPnAEt-eFzBrJZe2s';
  let location = '';
  let searchURL = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=500&type=hospital&keyword=emergency&key=${mapsKey}`;
  console.log(searchURL);
  $.getJSON(userInput, callback);
}

// // State manipulation functions


// // Render functions


// // Event handlers

$('.search-bar').submit(function (event) {
  event.preventDefault();
  const userInput = $(event.currentTarget).find('input').val();
  console.log('user entered:' + userInput);
  getData(userInput, function(){console.log('hi')})
})

$(function() {
  // console.log( "ready?" );
}) 


// grab the value -> take the value and add it to the search url -> return we dump in the html