import mapboxgl from 'mapbox-gl';

const zoomMapToMarker = (map, markers) => {
  const bounds = new mapboxgl.LngLatBounds();
  markers.forEach((marker) => {
    bounds.extend([ marker.lng, marker.lat ])
  });
  map.fitBounds(bounds, { padding: 70, maxZoom: 15, duration: 0 });
};

const restaurantClickHandler = (map, mapboxMarker) => {
  return (event) => {
    // https://docs.mapbox.com/mapbox-gl-js/api/markers/#marker#togglepopup
    mapboxMarker.togglePopup();
    // this was taken from: https://docs.mapbox.com/mapbox-gl-js/example/flyto/
    map.flyTo({
      // https://docs.mapbox.com/mapbox-gl-js/api/markers/#marker#setlnglat
      center: mapboxMarker.getLngLat(),
      essential: true
    });
  }
}

const makeRestaurantCardClickable = (markerData, mapboxMarker, map) => {
  // We'll add an id to the marker (the same as the restaurant). This is coming from the controller.
  const markerDiv = mapboxMarker.getElement();
  markerDiv.id = `marker-${markerData.id}`;
  // Then, we need to find the card that we will click on
  const restaurantCard = document.getElementById(`restaurant-card-${markerData.id}`);

  // On that card, we will add some behavior if a click happens
  restaurantCard.addEventListener('click', restaurantClickHandler(map, mapboxMarker));
  // WARNING: if the event listener callback is arcane to you, check the alternative code below

  // we can write this event listener here like this
  // restaurantCard.addEventListener('click', (event) => {
  //   // https://docs.mapbox.com/mapbox-gl-js/api/markers/#marker#togglepopup
  //   mapboxMarker.togglePopup();
  //   // this was taken from: https://docs.mapbox.com/mapbox-gl-js/example/flyto/
  //   map.flyTo({
  //     // https://docs.mapbox.com/mapbox-gl-js/api/markers/#marker#setlnglat
  //     center: mapboxMarker.getLngLat(),
  //     essential: true
  //   });
  // })
}

const addMarkersToMap = (map) => {
  const mapElement = document.getElementById('map');

  const markers = JSON.parse(mapElement.dataset.markers);
  
  markers.forEach((markerData) => {
    const popup = new mapboxgl.Popup().setHTML(markerData.popUp);

    const mapboxMarker = new mapboxgl.Marker()
      .setLngLat([ markerData.lng, markerData.lat ])
      .setPopup(popup)
      .addTo(map);

    makeRestaurantCardClickable(markerData, mapboxMarker, map);

  });
  
  zoomMapToMarker(map, markers)
}


const initMapbox = () => {
  const mapElement = document.getElementById('map');

  if (mapElement) {
    mapboxgl.accessToken = mapElement.dataset.mapboxApiKey;
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v10'
    });

    addMarkersToMap(map)
  }
};

export { initMapbox };
