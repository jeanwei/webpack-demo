export default class MapControls {
  constructor(map) {
    this.map = map;
    console.log('map controls', this);
    this.stationVisible = true;
    this.removeLayer = (linename, layer) => {
      this.map.removeLayer(layer);
    }
  }

  showLines(stations) {
    this.showStations(stations);
    this.showHeats(stations);
  }

  showHeats(stations) {
    const showL = (linename, layer) => {
      stations.forEach(station => {
        if (linename.indexOf(station) > -1) {
          layer.addTo(this.map);
        }
      })
    }
    console.log('map controls showHeats', this);
    console.log('map controls showHeats', this.map);
    this.map.eachHeatLayer('entries', this.removeLayer);
    this.map.eachHeatLayer('exits', this.removeLayer);
    this.map.eachHeatLayer('entries', showL);
    this.map.eachHeatLayer('exits', showL);
  }

  showStations(stations) {
    if (this.stationVisible) {
      this.map.eachLineLayer(this.removeLayer);
      this.map.eachLineLayer((linename, layer) => {
        stations.forEach(station => {
          layer.addTo(this.map);
          // layer.addTo(this.map).bringToFront();
        })
      })
    }
  }

  showStations(stations) {
    if (this.stationVisible) {
      this.map.eachLineLayer(this.removeLayer);
      this.map.eachLineLayer((linename, layer) => {
        stations.forEach(station => {
          if (linename.indexOf(station) > -1) {
            // layer.addTo(this.map).bringToFront();
            layer.addTo(this.map);
          }
        })
      })
    }
  }
}
