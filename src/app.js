import HeatMap from './components/HeatMap';
import ui from './ui/UiControls';
import './assets/scss/app.scss';

let map;

function init() {
  console.log('init');
  // const startDate = '2015-09-28 00:00:00 GMT-04:00'
  // const startDate = '2015-10-04 23:59:59 GMT-04:00'

  // must set size of map before initialization
  // because .fitBounds() does not like % or vh sizes
  ui.setMapSize();
  window.onresize = ui.setMapSize;

  map = new HeatMap();
}

init()
