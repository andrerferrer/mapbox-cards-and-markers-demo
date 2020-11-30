import mapboxgl from 'mapbox-gl';

// add this function
const zoomMapToMarker = (map, marker) => {
  const bounds = new mapboxgl.LngLatBounds();
  bounds.extend([ marker.lng, marker.lat ])
  map.fitBounds(bounds, { padding: 70, maxZoom: 15, duration: 0 });
};

const addMarkerToMap = (map) => {
  const mapElement = document.getElementById('map');

  // Take the marker from the view in `app/views/restaurants/show.html.erb`
  const marker = JSON.parse(mapElement.dataset.marker);

  new mapboxgl.Marker()
    .setLngLat([ marker.lng, marker.lat ])
    .addTo(map);
  
  zoomMapToMarker(map, marker) // add this line
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

    addMarkerToMap(map)
  }
};

export { initMapbox };
