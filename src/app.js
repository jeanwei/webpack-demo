import HeatMap from './components/HeatMap';
import ui from './ui/UiControls';
import callbacks from './ui/UiCallbacks';
import MapControls from './components/MapControls';
import SubwayLines from './components/SubwayLines';
import './assets/scss/app.scss';

let map, mapControls;

function init() {
  map = new HeatMap();
  mapControls = new MapControls(map);

  // set size of map before initialization
  // (.fitBounds() does not like % or vh size)
  ui.setMapSize();
  window.onresize = ui.setMapSize;

  // init subway line controls
  const sl = new SubwayLines();
  const subwayLines = sl.getAllIcons();
  const subwayListElem = document.querySelector('#subway-lines');
  for(let lines in subwayLines) {
    const icons = subwayLines[lines];
    const fieldset = callbacks.setSubwayLineControl(mapControls, icons, lines);
    subwayListElem.appendChild(fieldset);
  }

  callbacks.setResponsiveCallbacks();

  const startDate = '2015-09-28 00:00:00 GMT-04:00';
  // const endDate = '2015-10-04 23:59:59 GMT-04:00';
  const endDate = '2015-09-28 23:59:59 GMT-04:00';
  ui.drawTimeline(startDate, endDate);
  ui.setDates(startDate, endDate);

  initStartAnimationBtnCallbacks(startDate, endDate);
}

function initStartAnimationBtnCallbacks(startDate, endDate) {
  const startAnimationElem = document.querySelector('#start-animation');

  startAnimationElem.onclick = (e) => {
    if (e) e.preventDefault();

    // disable button until animation done
    startAnimationElem.disabled = true;

    let intervalPromises = map.heat({ start: startDate, end: endDate });

    intervalPromises = intervalPromises.map(p => {
      p.then(data => {
        /************************
          data = {
            datetime: Sun Oct 04 2015 23:59:59 GMT+0800 (+08),
            interval: 2000, whole: 12000 }
        *************************/

        console.log('data from interval Promises', data);
        // ui.updateHUDTime(data.datetime);
        // ui.updateTimeLine(data.datetime, data.interval, data.whole);
        if(Date.parse(data.datetime) >= Date.parse(endDate)) {
          console.log('Disable animation button');
          startAnimationElem.disabled = false;
        }
      })
    })
    Promise.all(intervalPromises).catch(e => {
      console.log("Something went wrong!", e);
    })
  }
}

init();
