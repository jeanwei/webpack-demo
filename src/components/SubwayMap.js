import Mapbox from './Mapbox';
import LMap from 'mapbox.js/src/map.js';
import StationData from '../resources/files/stations.json';
import SubwayLines from './SubwayLines';

const L = Mapbox();

export default class SubwayMap extends LMap.Map {
  constructor() {
    super('map', 'mapbox.streets');
    // get leaflet L object
    this.L = Mapbox();
    this.subwayLines = new SubwayLines();
    this.stations = StationData.stations;
    // "R001": {
    //     "color": "#FCCC0A",
    //     "control_area": "R101S",
    //     "coords": {
    //         "lat": 40.703082,
    //         "lng": -74.012983
    //     },
    //     "division": "IRT",
    //     "line_name": "R1",
    //     "station_name": "SOUTH FERRY"
    // }


    // layers and markers;
    this.layers = {
      'lines': {},
      'entries': {},
      'exits': {}
    };
    this.markers = [];
    this.stationNames = [];
    this.markerBounds = this.addAllStationMarkers();

    this.setCustomView();
  }

  setCustomView() {
    const manhattanLatLng = [40.759123, -73.953266];
    const zoomLevel = 12;
    // this.fitBounds(this.markerBounds);
    this.setView(manhattanLatLng, zoomLevel);
  }

  lineToIcons(linename) {
    const lines = linename.split("");
    const icons = lines.map(l => this.subwayLines.getIcon(l));
    return icons.join('');
  }

  createPopUp(latlng, content) {
    const popup = L.popup().setLatLng(latlng).setContent(content);
    return popup;
  }

  createCircleMarker(title, latlng, color, popup) {
    if (latlng) {
      const marker = this.L.circleMarker(
        latlng,
        { title: title,
          riseOnHover: true,
          radius: 5,
          stroke: false,
          color: color,
          fillOpacity: 0.6 }
      );

      marker.bindTooltip(
        title,
        { permanent: false,
          interactive: true,
          direction: 'auto',
          className: 'station-name' }
      );
      marker.bindPopup(popup);
      return marker;
    }
  }

  createStationMarker(unit, s) {
    if(s.coords && s.coords.lat && s.coords.lng) {
      const latlng = [s.coords.lat, s.coords.lng];
      const lines = this.lineToIcons(s.line_name);
      const popupContent = `<div class='map-popup'><span class='title'>${s.station_name} <small class='unit'>${unit}</small></span>${lines}</div>`;
      const popup = this.createPopUp(latlng, popupContent);

      const station_name = `${s.station_name}`;
      const marker = this.createCircleMarker(station_name, latlng, s.color, popup);
      marker.lineName = s.line_name;
      marker.unit = unit;
      return marker;
    }
  }

  // for each layer in this
  eachLineLayer(f) {
    const lines = this.layers['lines'];
    for (let linename in lines) {
      const layer = lines[linename];
      f(linename, layer);
    }
  }

  // add stations and returns their bounds
  addAllStationMarkers() {
    const stations = this.stations;
    const markers = [];
    const latLngs = [];
    for (let unit in stations) {
      const data = stations[unit];
      const marker = this.createStationMarker(unit, data);
      if (marker) {
        markers.push(marker);
        latLngs.push(marker.getLatLng());
      }
    }

    // for each marker, add to layer for their line
    markers.forEach(marker => {
      if (marker == null) return;

      const lines = marker.lineName.split("");
      lines.forEach(l => {
        console.log('initial layer lines', this.layers['lines']);
        if (l in this.layers['lines']) {
          this.layers['lines'][l].addLayer(marker);
        } else {
          this.layers['lines'][l] = this.L.featureGroup([marker]);
        }
        console.log('updated layers', this.layers['lines']);
      })
    })

    this.eachLineLayer((linename, layer) => layer.addTo(this));
    return this.L.latLngBounds(latLngs);
  }
}
