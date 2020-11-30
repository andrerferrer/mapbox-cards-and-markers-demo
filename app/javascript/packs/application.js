require("@rails/ujs").start()
require("turbolinks").start()
require("@rails/activestorage").start()

// External imports (code other people wrote)
import "bootstrap";

// Internal imports (code you wrote):
import { initMapbox } from '../plugins/init_mapbox';

document.addEventListener('turbolinks:load', () => {
  // Call your functions here after turbolinks is done loading
  initMapbox();
});
