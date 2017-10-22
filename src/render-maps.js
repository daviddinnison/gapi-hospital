function initMap() {
    let map, geocoder, marker;
    const centerInitialMap = { lat: 39.8097, lng: -98.5556 };
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 3,
      center: centerInitialMap
    });
    geocoder = new google.maps.Geocoder();
  }