export default {
  setMapSize() {
    // set map size to fill map-container
    const mapElem = document.querySelector('#map');
    const mapContainerElem = document.querySelector('#map-container');
    const rect = mapContainerElem.getBoundingClientRect();

    console.log('mapElem', mapElem);
    console.log('mapContainerElem', mapContainerElem);
    console.log('rect', rect);

    mapElem.style.width = `${rect.width}px`;
    mapElem.style.height = `${rect.height}px`;
  },
}
