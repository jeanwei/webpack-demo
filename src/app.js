import HeatMap from './components/HeatMap';
import ui from './ui/UiControls';
import callbacks from './ui/UiCallbacks';
import MapControls from './components/MapControls';
import SubwayLines from './components/SubwayLines';
import './assets/scss/app.scss';

let map, mapControls;

function init() {
  console.log('init');
  // const startDate = '2015-09-28 00:00:00 GMT-04:00'
  // const startDate = '2015-10-04 23:59:59 GMT-04:00'

  // must set size of map before initialization
  // .fitBounds() does not like % or vh sizes
  ui.setMapSize();
  window.onresize = ui.setMapSize;

  map = new HeatMap();
  mapControls = new MapControls(map);

  const sl = new SubwayLines();
  const subwayLines = sl.getAllIcons();
  const subwayListElem = document.querySelector('#subway-lines');
  console.log(subwayListElem);

  // init subway line controls
  for(let lines in subwayLines) {
    const icons = subwayLines[lines];
    console.log('icons');
    const fieldset = callbacks.setSubwayLineControl(mapControls, icons, lines);
    subwayListElem.appendChild(fieldset);
  }

  callbacks.setResponsiveCallbacks();
}

init()
