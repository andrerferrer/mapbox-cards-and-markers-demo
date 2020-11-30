# GOAL

This is a demo to show-case how to implement a map with `MapBox` and the [`geocoder` gem](https://github.com/alexreisner/geocoder#geocoding-objects).

This demo was created from [this boilerplate](https://github.com/andrerferrer/geocoder-gem#goal).

[You can also check my other demos](https://github.com/andrerferrer/dedemos/blob/master/README.md#ded%C3%A9mos).

## What needs to be done?

### 1. [Have geocoder ready](https://github.com/andrerferrer/geocoder-gem#goal)

### 2. Grab a MapBox API key

Go to the [MapBox page](https://account.mapbox.com/) and grab your token.

It's something like this: `pk.eyJ1IjoiZXBlbXMiLCJhIjoiY2tmZ3F0MjN3MHJnNTMzbG0zOGRkYThidCJ9.Jnqn12r0ZMWSV5YujMpJPQ`

Put your API-key in the `.env` file as the `MAPBOX_API_KEY`. Like this:
```
MAPBOX_API_KEY=pk.eyJ1IjoiZXBlbXMiLCJhIjoiY2tmZ3F0MjN3MHJnNTMzbG0zOGRkYThidCJ9.Jnqn12r0ZMWSV5YujMpJPQ
```

> For this to work, you need to have the gem `dotenv-rails` in your `Gemfile`

> If you don't, just add it and run `bundle install`

### 3. Add [`mapbox-gl`](https://www.npmjs.com/package/mapbox-gl) to your app

In the terminal: `yarn add mapbox-gl`.

We'll create the plugins folder (if it's not there yet - `mkdir app/javascript/plugin`), and we'll create the `init_mapbox.js` file.

In `app/javascript/plugin/init_mapbox.js`:
```js
import mapboxgl from 'mapbox-gl';

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
  }
};

export { initMapbox };
```

AAAaand, if we are exporting, the `app/javascript/packs/application.js` must be importing. Let's fix that:
```js
// Internal imports (code you wrote):
import { initMapbox } from '../plugins/init_mapbox';

document.addEventListener('turbolinks:load', () => {
  // Call your functions here after turbolinks is done loading
  initMapbox();
});
```

Finally, we have to apply the CSS that is coming from MapBox.

In `app/assets/stylesheets/application.scss`:
```css
@import 'mapbox-gl/dist/mapbox-gl';
```

Now, we can have a map. Let's add it to the view.

### 4. Add a map to your app

For example, let's add a map on `Restaurants#Show` to see the location of a given map.

In `app/views/restaurants/show.html.erb`:
```erb
<div id="map"
     style="width: 100%; height: 25vh;"
     <%# this is setting the dataset as the mapbox api key from .env %>
     data-mapbox-api-key="<%= ENV['MAPBOX_API_KEY'] %>"></div>
```

Now, we have a map. Not looking good, but it's a map! Time to add a marker (to show our restaurant).


### 5. Add a marker to show in your map
In `app/controllers/restaurants_controller.rb`:

```ruby
  def show
    set_restaurant
    @review = Review.new
    @marker = {
      lat: @restaurant.latitude,
      lng: @restaurant.longitude
    }
  end
```

Now, let's add this marker data to the map `<div>` in `app/views/restaurants/show.html.erb`:
```erb
<div id="map"
     style="width: 100%; height: 25vh;"
     data-marker="<%= @marker.to_json %>" <%# add this line %>
     data-mapbox-api-key="<%= ENV['MAPBOX_API_KEY'] %>"></div>
```

With this data in the view, we can use javascript to create the marker in the map:

In `app/javascript/plugins/init_mapbox.js`:
```js
import mapboxgl from 'mapbox-gl';

const addMarkerToMap = (map) => {
  const mapElement = document.getElementById('map');

  // Take the marker from the view in `app/views/restaurants/show.html.erb`
  const marker = JSON.parse(mapElement.dataset.marker);

  new mapboxgl.Marker()
    .setLngLat([ marker.lng, marker.lat ])
    .addTo(map);

}


const initMapbox = () => {
  const mapElement = document.getElementById('map');

  if (mapElement) {
    mapboxgl.accessToken = mapElement.dataset.mapboxApiKey;
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v10'
    });

    addMarkerToMap(map) // Add this line to run the new function!
  }
};

export { initMapbox };
```

Now we have a map and a marker, but it sucks 😅. Time to make the map zoom into the marker.

### 6. Adjust the map to the marker

To make it zoom, we need to use `mapbox-gl` once again.

In `app/javascript/plugins/init_mapbox.js` we will add this function and call it:
```js
const zoomMapToMarker = (map, marker) => {
  const bounds = new mapboxgl.LngLatBounds();
  bounds.extend([ marker.lng, marker.lat ])
  map.fitBounds(bounds, { padding: 70, maxZoom: 15, duration: 0 });
};
```

Check the end result in `app/javascript/plugins/init_mapbox.js`.




And we're good to go 🤓

Good Luck and Have Fun
