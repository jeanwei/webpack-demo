import dom from '../utils/DomUtils';

export default {
  // create line checkboxes
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
  },


  setResponsiveCallbacks() {
    const toggleLines = document.querySelector('#toggle-lines');
    const collapseElem = document.querySelector('.collapse-md');
    dom.initToggle(toggleLines, {
      state: () => {
        const targetClasses = collapseElem.className.split(' ');
        // true: on, false: off
        return (targetClasses.indexOf('d-none') > -1) && (targetClasses.indexOf('d-lg-block') > -1)
      },
      on: {
        text: 'Hide Lines',
        callback: (e) => {
          e.preventDefault();
          collapseElem.className = collapseElem.className.replace(' d-none d-lg-block', '');
        }
      },
      off: {
        text: 'Select Lines',
        callback: (e) => {
          e.preventDefault();
          collapseElem.className += ' d-none d-lg-block';
        }
      }
    });
  },
}
