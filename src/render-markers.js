function renderOpenNow(item) {
    if (item.opening_hours !== undefined) {
      return (`
        <p class="available">Open now!</p>
     `)
    } else {
      return (`
        <p class="unavailable">Closed</p>
      `)
    }
  }

function addPlaceMarkers(state) {
    const markers = state.searchResults.map(function (items) {
        return {
            id: items.id,
            lat: items.geometry.location.lat(),
            lng: items.geometry.location.lng(),
            name: items.name,
            vicinity: items.vicinity
        };
    });
    //console.log('markers', markers);
    appState.resultMarkers = markers;
    //console.log('state', appState);

    // centers map on geolocation from state
    const map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: state.geoLocation[0], lng: state.geoLocation[1] },
        zoom: 10
    });


    for (let i = 0; i < markers.length; i++) {
        const position = new google.maps.LatLng(markers[i].lat, markers[i].lng);

        const contentString = `<div class="info-window">
      <a href="#${markers[i].id}">${markers[i].name}</a>
      <p>${markers[i].vicinity}</p>
      </div>`;

        // console.log('markers i', markers[i]);
        const renderPlaceMarker = new google.maps.Marker({
            content: contentString,
            position: position,
            map: map,
            title: markers[i][0]
        });
        // console.log('place markers content', contentString);

        //makes all markers display on map without scrolling
        const latlngbounds = new google.maps.LatLngBounds();
        for (let x = 0; x < markers.length; x++) {
            latlngbounds.extend(markers[x]);
        }
        map.fitBounds(latlngbounds);

        const infowindow = new google.maps.InfoWindow({
            content: contentString
        });

        renderPlaceMarker.addListener('click', function () {
            infowindow.open(map, renderPlaceMarker);
        });
    }
}