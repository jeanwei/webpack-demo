import 'mapbox.js';
import 'mapbox.js/theme/style.css';

export default function Mapbox() {
  L.mapbox.accessToken = 'pk.eyJ1IjoiamVhbndlaSIsImEiOiJjamNldDB3ZncyNGN2MzNsbDB0b3V5enAyIn0.3uKdS1ZoOcrSLg94zCqpqQ';
  return L;
}
