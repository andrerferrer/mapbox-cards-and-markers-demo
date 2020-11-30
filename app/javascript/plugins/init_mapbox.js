import mapboxgl from 'mapbox-gl';

// add this function
const zoomMapToMarker = (map, markers) => {
  const bounds = new mapboxgl.LngLatBounds();
  markers.forEach((marker) => {
    bounds.extend([ marker.lng, marker.lat ])
  });
  map.fitBounds(bounds, { padding: 70, maxZoom: 15, duration: 0 });
};

const addMarkersToMap = (map) => {
  const mapElement = document.getElementById('map');

  // Take the marker from the view in `app/views/restaurants/show.html.erb`
  const markers = JSON.parse(mapElement.dataset.markers);
  markers.forEach((marker) => {
    const popup = new mapboxgl.Popup().setHTML(marker.popUp);

    new mapboxgl.Marker()
      .setLngLat([ marker.lng, marker.lat ])
      .setPopup(popup)
      .addTo(map);
  });
  
  zoomMapToMarker(map, markers)
}


const initMapbox = () => {
  const mapElement = document.getElementById('map');

  // This if here is to ensure that we will only run the code
  // IF we find this map element (which will be only in the Restaurants#Show)
  if (mapElement) {
    // This is setting the access token as the one coming from app/views/restaurants/show.html.erb (line 11)
    mapboxgl.accessToken = mapElement.dataset.mapboxApiKey;
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v10'
    });

    addMarkersToMap(map)
  }
};

export { initMapbox };
