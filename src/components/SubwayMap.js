import Mapbox from './Mapbox';
import LMap from 'mapbox.js/src/map.js';
import StationData from '../resources/files/stations.json';

const L = Mapbox();

export default class SubwayMap extends LMap.Map {
  constructor() {
    console.log('SubwayMap');
    super('map', 'mapbox.streets');
    // get leaflet L object
    this.L = Mapbox();
    this.stations = StationData.stations;


    this.setCustomView();
    console.log(this);
  }

  setCustomView() {
    const manhattanLatLng = [40.759123, -73.953266];
    const zoomLevel = 12;
    // this.fitBounds(this.markerBounds);
    this.setView(manhattanLatLng, zoomLevel);
  }
}
