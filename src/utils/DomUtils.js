export default {
  initToggle(elem, options) {
    elem.onclick = e => {
      if (options.state() == true) {
        options.on.callback(e);
        elem.innerHTML = options.on.text;
      }
      else {
        options.off.callback(e);
        elem.innerHTML = options.off.text;
      }
    }
  }
}
