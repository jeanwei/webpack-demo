import SubwayMap from './SubwayMap';
import TurnstileData from '../resources/files/turnstiles.json';

// {
//   "date_range": {
//     "end": "2015-10-09",
//     "start": "2015-09-26"
//   },
//   "max": {
//     "entries": 4637,
//     "exits": 6717
//   },
//   "stations": {
//     "R001": {
//       "dates": {
//         "2015-09-26": {
//           "times": [
//             {
//               "entries": null,
//               "exits": null,
//               "time": "01:00:00"
//             },
//             {
//               "entries": 10878,
//               "exits": 7042,
//               "time": "21:00:00"
//             }
//           ]
//         }
//       },
//       "station_name": "SOUTH FERRY",
//       "total_entries": 363533,
//       "total_exits": 344949,
//       "turnstiles": 30
//     }
//   }
// }

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

    this.timeIntervals = [
      '00:00:00',
      '04:00:00',
      '08:00:00',
      '12:00:00',
      '16:00:00',
      '20:00:00',
      '23:59:59' ]

    this.timeFrame = 2000;

    this.dayFrame = this.timeFrame*(this.timeIntervals.length-1);
  }

  // for each layer in this
  // which = entries | exits
  eachHeatLayer(which, f) {
    const lines = this.layers[which];
    for (let linename in lines) {
      const layer = lines[linename];
      f(linename, layer);
    }
  }
}
