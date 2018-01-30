import SubwayMap from './SubwayMap';
import TurnstileData from '../resources/files/turnstiles.json';
/*****************************************
TurnstileData = {
  "date_range": {"end": "2015-10-09", "start": "2015-09-26"},
  "max": {"entries": 4637, "exits": 6717},
  "stations": {
    "R001": {
      "dates": {
        "2015-09-26": {
          "times": [
            {"entries": null, "exits": null, "time": "01:00:00"},
            {"entries": 10878, "exits": 7042, "time": "21:00:00"}]
        }
      },
      "station_name": "SOUTH FERRY",
      "total_entries": 363533,
      "total_exits": 344949,
      "turnstiles": 30
    }
  }
}
*****************************************/
import heatCircleSvg from '../resources/images/heat-circle.svg';
import heatCirclePng from '../resources/images/heat-circle.png';

export default class HeatMap extends SubwayMap {
  constructor(...args){
    super(...args);
    this.data = TurnstileData;

    this.heatLayerRefs = {};

    const max = this.data.max.entries > this.data.max.exits ?
      this.data.max.entries :
      this.data.max.exits;
    this.radiusRatio = 15/max;

    this.minRadius = 2;

    this.timeIntervals = ['00:00:00', '04:00:00','08:00:00','12:00:00',
                          '16:00:00','20:00:00', '23:59:59']

    this.timeFrame = 2000;

    this.dayFrame = this.timeFrame*(this.timeIntervals.length-1);
  }

  heat(options, onDoneInterval) {
    const start = new Date(Date.parse(options.start));
    const end = new Date(Date.parse(options.end));
    const current = new Date(start);
    let timeout = 0;
    let timeFrame = this.dayFrame;
    let promises = [];

    while (current <= end) {
      const year = `${current.getFullYear()}`;
      let month = `${current.getMonth()+1}`;
      let day = `${current.getDate()}`;

      month = month.length == 1 ? `0${month}` : month;
      day = day.length == 1 ? `0${day}` : day;

      const formattedDate = `${year}-${month}-${day}`;
      const pEntries = this.createHeatLayer(formattedDate, 'exits', timeout);
      const pExits = this.createHeatLayer(formattedDate, 'entries', timeout);

      Array.prototype.push.apply(promises, pEntries);
      Array.prototype.push.apply(promises, pExits);

      timeout += timeFrame;
      current.setDate(current.getDate()+1);
    }
    return promises;
  }

  // for each interval = for each day, for each time
  // make feature layers
  /*************************
    date = '2017-10-10'; accessType = 'exits'; timeout = 0;
  ************************/
  createHeatLayer(date, accessType, timeout) {
    const sizes = this.generateHeatSizes(date, accessType);
    console.log('sizes', sizes);
    let frameLen = this.timeFrame;
    let counter = frameLen + timeout;
    let promises = [];

    for (let time in sizes) {
      if(Object.keys(this.layers[accessType]).length < 1) {
        this.createHeatLayerInit(sizes[time], accessType);
      } else {
        var p = new Promise((resolve, reject) => {
          setTimeout(() => {
            this.updateHeatLayer(sizes[time], counter, frameLen);
            const d = new Date(Date.parse(`${date} ${time}`));
            resolve({datetime: d, interval: this.timeFrame, whole: this.dayFrame})
          }, counter);
        })

        promises.push(p);
        counter += frameLen;
      }
    }
    return promises;
  }

  /**********************************************
    date = '2017-10-10'; accessType = 'exits';
    return heats = { ''}
  ***********************************************/
  generateHeatSizes(date, accessType) {
    const turnstiles = this.data.stations;

    // predefined time slots
    const heats = {};
    for (let time of this.timeIntervals) {
      heats[time] = [];
    }

    // this.timeIntervals.forEach((interval) => { return heats[interval] = []});

    const intervals = Object.keys(heats).sort();

    for (let unit in turnstiles) {
      if (!(unit in this.stations)) { continue; }

      const latLng = this.stations[unit].coords;
      if (!(latLng && 'lat' in latLng && 'lng' in latLng)) { continue; }

      const unitTurnstile = turnstiles[unit];
      if (date in unitTurnstile['dates']) {
        unitTurnstile['dates'][date]['times'].forEach(t => {
          if (t.entries && t.exits) {
            const h = {
              latlng: latLng,
              radius: this.getRadius(t[accessType]),
              unit: unit,
              entries: t.entries,
              exits: t.exits,
              lineName: this.stations[unit].line_name,
              stationName: this.stations[unit].station_name
            }

            const i = this.findTimeInterval(intervals, t.time);
            if (i > -1) { heats[intervals[i]].push(h); }
          }
        })
      }
    }
    return heats;
  }

  getRadius(vol) { return this.radiusRatio * vol + this.minRadius }

  // find index of lower/upper bound time interval, whichever is closest
  // uses bisection/binary search
  /********************************************
    list = ['00:00', '04:00', ... '20:00'] (sorted)
    time = '03:55' returns 1, '01:00' returns 0
  ***********************************************/
  findTimeInterval(list, time) {
    if (list.length < 1 || time.length < 1) {
      return -1;
    }
    let low = 0;
    let high = list.length;
    let mid;
    while (low < high) {
      mid = Math.floor(low + (high-low)/2);
      if (list[mid] < time) {
        low = mid + 1;
      } else {
        high = mid;
      }
    }

    if (low > 0) {
      let actual = new Date('2015-09-09 ' + time);
      let upper = new Date('2015-09-09 ' + list[low]);
      let lower = new Date('2015-09-09 ' + list[low-1]);

      if (actual - lower < upper - actual) { return low - 1; }
    }
    return low;
  }

  /**************************
    sizes = {
      00:00:00: [{station},{},{}],
      04:00:00: [{},{}],
      08:00:00: [{},{},{}],
      12:00:00: [{},...{}],
      16:00:00: [{},...{}],
      20:00:00: [{},...{}],
      23:59:59: [{}]
    }
  **************************/
  createHeatLayerInit(sizes, accessType) {
    sizes.forEach(s => {this.initHeatLayer(s, accessType)});
    this.eachHeatLayer(accessType, (line, layer) => {
      console.log('[createHeatLayerInit] ln', line);
      console.log('[createHeatLayerInit] l', layer);
      layer.addTo(this);
    })
  }

  /***********************
    station = {
      entries:611
      exits:980
      latlng:{lat: 40.703082, lng: -74.012983}
      lineName:"R1"
      radius:4.188476998660116
      stationName:"SOUTH FERRY"
      unit:"R001" }
    accessType = "entries"
  ***************************/
  initHeatLayer(station, accessType) {
    const heatMarker = this.createHeatMarker(
                          station.unit,
                          station.latlng,
                          station.radius,
                          station.stationName,
                          accessType);
    heatMarker.unit = station.unit;
    this.heatLayerRefs[station.unit] = heatMarker;

    const lines = station.lineName.split("");

    lines.forEach(line => {
      const layers = this.layers[accessType];
      if (line in layers) {
        layers[line].addLayer(heatMarker);
      } else {
        layers[line] = this.L.featureGroup([heatMarker]);
      }
    });
  }

  createHeatMarker(id, latLng, radius, stationName, accessType) {
    const accessTypeClass = accessType == 'entries' ?
      'heat-icon-entries' : 'heat-icons-exits';
    radius = Math.floor(radius);

    const icon = new this.L.icon({
      iconUrl: heatCirclePng,
      iconRetinaUrl: heatCirclePng,
      iconSize: [0, 0],
      iconAnchor: [10, 10],
      popupAnchor: [10, 0],
      shadowSize: [0, 0],
      className: `heat-icon ${accessTypeClass}`,
    });
    icon.options.className += ` heat-icon-${accessType}-${id}`;
    icon.options.iconSize = [radius, radius];
    icon.options.iconAnchor = [radius/2, radius/2];

    return this.L.marker(latLng, {title: stationName, icon});
  }



  updateHeatLayer(sizes, offset, timeout) {
    const delay = 10;
    const frames = timeout/delay;

    sizes.forEach(s => {
      // s ={latlng: {lat:40.751849, lng:-73.976945}, radius: 9.715497990174185, unit: "R048", entries: 3455, exits: 1062, …}

      // console.log('[updateHeatLayer] s', s);
      if (s.unit in this.heatLayerRefs) {
        const heatMarker = this.heatLayerRefs[s.unit];
        const entrySelector = document.querySelector(`.heat-icon-entries-${s.unit}`);
        const exitSelector = document.querySelector(`.heat-icon-exits-${s.unit}`);
        this.updateMarker(entrySelector, s, 'entries');
        this.updateMarker(exitSelector, s, 'exits');
      } else {
        this.initHeatLayer(s, 'entries');
        this.initHeatLayer(s, 'exits');
      }
    })
  }

  updateMarker(selector, s, accessType) {
    if (selector) {
      const originalSizePx = selector.style.width;
      const originalSize = parseInt(originalSizePx.slice(0, originalSizePx.length-2));
      const radius = this.getRadius(s[accessType]);
      const scale = radius/originalSize;
      const rpx = Math.floor(radius) + 'px';
      const glowpx = Math.floor(radius)/2 + 'px';
      const marginpx = -1*Math.floor(radius)/2 + 'px';

      selector.style.width = rpx;
      selector.style.height = rpx;
      selector.style.marginLeft = marginpx;
      selector.style.marginTop = marginpx;

      let color = 'white';
      if (accessType == 'exits') color = 'red';

    }
  }

  // accessType = entries | exits
  eachHeatLayer(accessType, func) {
    const lines = this.layers[accessType];
    for (let linename in lines) {
      const layer = lines[linename];
      func(linename, layer);
    }
  }
}
