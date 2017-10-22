'use strict';

//-- INITIAL STATE 
const appState = {
  apiKey: 'AIzaSyCNb2Rq_psL37TOUxYPnAEt-eFzBrJZe2s',
  geoLocation: [],
  resultMarkers: [],
  searchResults: [],
  userInput: null
};


const requestSearchResults = (state, input, callback) => {
  // zip code must be converted to geocode for API request and map display
  const baseURL = 'https://maps.googleapis.com/maps/api';
  const geocodeURL = `${baseURL}/geocode/json?address=${input}&key=${state.apiKey}`;

  // geocode API request
  $.getJSON(geocodeURL, data => {
    //adds geocode to state
    const location = data.results[0].geometry.location;
    //creates new location object using place libary and assign it to a variable
    const focus = new google.maps.LatLng(location.lat, location.lng);
    //pushes lat/long into state
    state.geoLocation = [location.lat, location.lng];
    //required for PlacesService function

    // sets where to make Google Places request
    const googlePlaces = new google.maps.places.PlacesService(map);
    const request = {
      location: focus,
      radius: '40000',
      types: ['hospital']
    };

    //Google Places API request
    googlePlaces.nearbySearch(request, (results, status) => {
      appState.searchResults = results;
      // console.log('place results', results);
      callback(appState);
      addPlaceMarkers(appState);
    });
    $('.map-container').removeClass('hidden');
  });
};

// STATE MODS
function setUserInput(state, userInput) {
  state.userInput = userInput;
}



// EVENTS
function submitData(event) {
  event.preventDefault();
  $('.loading').removeClass('hidden');
  const userInput = $(event.currentTarget).find('input').val();
  setUserInput(appState, userInput);
  requestSearchResults(appState, userInput, renderHtml);

}

function eventHandling() {
  $('.search-bar').submit(function (event) {
    submitData(event);
  });

  $('#query').keydown(function (event) {
    if (event.keyCode === 13) {
      $('.search-bar').submit();
    }
  });

  //Check to see if the window is top if not then display button
	$(window).scroll(function(){
		if ($(this).scrollTop() > 100) {
			$('.scrollToTop').fadeIn();
		} else {
			$('.scrollToTop').fadeOut();
		}
	});
	
	//Click event to scroll to top
	$('.scrollToTop').click(function(){
		$('html, body').animate({scrollTop : 0},800);
		return false;
	});
  
  //Smooth scroll for nav routing
  $( "#map" ).on( "click", "a[href]", function( event ) {
    const route = $(this).attr("href");
    $('html, body').animate({ scrollTop: $(route).offset().top }, 1000);
});
}

// DOCUMENT READY FUNCTIONS
$(function () {
  eventHandling();
});