import LineColors from '../resources/files/line_colors.json';
import LineColorsGrouped from '../resources/files/line_colors_grouped.json';

// this.colors = {
//   "1": "#EE352E",
//   "3": "#EE352E",
//   "2": "#EE352E",
//   "5": "#00933C",
//   "4": "#00933C",
//   "7": "#B933AD" }
// this.lines = {
//   "123": "#EE352E",
//   "7": "#B933AD",
//   "G": "#6CBE45" }

export default class SubwayLines {
  constructor() {
    this.colors = LineColors.colors;
    this.lines = LineColorsGrouped.colors;
  }

  format(c, l) {
    return `<span class="line-icon" style='background-color:${c}'>${l}</span>`
  }

  getIcon(singleLine) {
    const l = singleLine;
    const c = this.colors[l];
    return this.format(c, l);
  }

  getAllIcons() {
    const lines = [];
    const sortedKeys = Object.keys(this.lines).sort();
    for (let key of sortedKeys) {
      const indivLines = key.split("");
      const color = this.lines[key];
      const icons = indivLines.map(l => this.format(color, l));
      const line = `<div>${icons.join('')}</div>`;
      lines[key] = line;
    }
    console.log('lines', lines);
    return lines;
  }

}
