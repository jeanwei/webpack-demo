export default {
  setSubwayLineControl(mapControls, icon, line) {
    const fieldSet = document.createElement('fieldset');
    const checkBox = document.createElement('input');
    checkBox.setAttribute('type', 'checkbox');
    checkBox.setAttribute('id', `subway-line-${line}`);
    checkBox.setAttribute('class', 'control-subway-line');
    checkBox.value = `${line}`;
    checkBox.onchange = () => { console.log('checked'); };

    const label = document.createElement('label');
    label.innerHTML = `${icon}`;
    label.setAttribute('for', `subway-line-${line}`);
    fieldSet.appendChild(checkBox);
    fieldSet.appendChild(label);
    return fieldSet;
  }
}
