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
      id: items.id,
      lat: items.geometry.location.lat(),
      lng: items.geometry.location.lng()
    };
  });
  console.log('markers', markers);
  appState.resultMarkers = markers;
  console.log('state', appState);
  // centers map on geolocation from state
  const map = new google.maps.Map(document.getElementById('map'), {
    center:  {lat: state.geoLocation[0], lng:state.geoLocation[1]},
    zoom: 10
  });

//this might not work







  //KEEP ME
  for(let i = 0; i < markers.length; i++ ) {
    var position = new google.maps.LatLng(markers[i].lat, markers[i].lng);
    
    var contentString = `<div id="content">
    <p>${markers[i].id}</p>
    </div>`;

    // console.log('markers i', markers[i]);
    var renderPlaceMarkers = new google.maps.Marker({
      content: contentString,
      position: position,
      map: map,
      title: markers[i][0]
    });
    console.log(renderPlaceMarkers);
  }
    // var infowindow = new google.maps.InfoWindow({
    //   content: contentString
    // });
    // infowindow.open(map,markers);

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
  $('.results').removeClass('hidden');
}
//--Will move submit functions out here for onclick and onenterkeypress
// function submitData(event) {
//     $('.search-bar').submit(function (event) {
//       event.preventDefault();
//       const userZipcode = $(event.currentTarget).find('input').val();
//       setZipcode(appState, userZipcode);
//       requestSearchResults(appState, userZipcode, renderHtml);
//     })
// }


// EVENTS
function eventHandling() {
  $('.search-bar').submit(function (event) {
    event.preventDefault();
    const userZipcode = $(event.currentTarget).find('input').val();
    setZipcode(appState, userZipcode);
    requestSearchResults(appState, userZipcode, renderHtml);
  });
  
  //--will make submit on keypress
  // submitData();
  // $('#query').keypress(function(event) {
  //   if(event.keyCode==13) {
  //     submitData(event);
  //   }
  // });
}

// DOCUMENT READY FUNCTIONS
$(function() {
  eventHandling();
});