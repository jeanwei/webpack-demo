export default class MapControls {
  constructor(map) {
    this.map = map;
    console.log('map controls', this);
    this.stationVisible = true;
    this.removeLayer = (linename, layer) => {
      this.map.removeLayer(layer);
    }
  }
}
