import { languages } from './languages.js';

/**
 * Generates a time chooser modal for selecting time. Called in calendarGenerator.js
 *
 * @param {Object} config - The configuration object. 
 * @param {Object} dynamicData - The dynamic data object.
 * @param {HTMLElement} calendar - The calendar element.
 * @return {Function} The generated time chooser modal.
 */
function GenerateTimeChooserModal (config, dynamicData, calendar) {

  /**
   * A custom event emitted when a time is added or selected
   *
   * @return {void} This function does not return any value.
   */
  function emitTimeSelectedEvent () {
    setTimeout(() => {
      const evt = new CustomEvent('timeSelect', { data: dynamicData });
      config.calendarContainer.dispatchEvent(evt);
    }, 250)
  }

  let timeChooserModal;

  let selection = [];

  this.getSelectedTimes = () => {
    return selection;
  }
  
  this.generateModal = () => {
    return generateModal();
  }

  this.show = () => {
    calendar.style.overflow = 'hidden';
    return timeChooserModal.show();
  }

  this.writeToDateDiv =  () => {
    writeToDateDiv();
  }

  this.writeToDynamicData = () => {
    writeToDynamicData();
  };

/**
 * Generates a dialog for choosing time.
 *
 * @return {Promise} A promise that resolves to the generated time chooser modal.
 */
  function generateModal() {
    const promise = new Promise((resolve, reject) => {

      timeChooserModal = document.createElement('dialog');
      timeChooserModal.classList.add('timeChooserModal');
      calendar.appendChild(timeChooserModal);
  
      const timeCont = document.createElement('div');
      timeCont.classList.add('timeCont');
      timeChooserModal.appendChild(timeCont);
  
      const timeChooser = document.createElement('div');
      timeChooser.classList.add('timeChooser');
      timeCont.appendChild(timeChooser);
  
      const controlsDiv = document.createElement('div');
      controlsDiv.classList.add('deleteDiv');
      timeChooser.appendChild(controlsDiv);
  
      function closeFn () {
        calendar.style.overflow = 'scroll';
        timeChooserModal.close();
      }
      makeButton(controlsDiv, 'deleteButton', 'x', 'close', 'click', closeFn);
  
      function innerComponents () {
        const timePickerContainer = document.createElement('div');
        timePickerContainer.classList.add('timePickerContainer');
        timeChooser.appendChild(timePickerContainer);
        const titleDiv = document.createElement('div');
        titleDiv.textContent = languages[config.language].timeWidget.addTime;
        titleDiv.classList.add('deleteDiv');
        timePickerContainer.appendChild(titleDiv);
        makeDropDowns(languages[config.language].timeWidget.start, timePickerContainer);
        makeDropDowns(languages[config.language].timeWidget.end, timePickerContainer);
      }
      makeButton(controlsDiv, 'deleteButton', '+', 'add time', 'click', innerComponents);
      makeButton(controlsDiv, 'deleteButton', '-', 'remove time', 'click', removeTimeValuesOnDate);
      resolve(timeChooserModal);
    });
    return promise;
  }

  function writeToDateDiv () {
    if (config.displayTimeSelectionOnDate) {
      dynamicData.datesSelectedArray[dynamicData.datesSelectedArray.length-1].forEach((daySelected) => {
        write(daySelected);
      });
  
      // contains a time duration choice
      let calendarTimeParent;
  
      function write (date) {
        const dayDiv = calendar.querySelector(`[data-humandate='${date}']`);
        while (dayDiv.children.length > 0) {
          dayDiv.removeChild(dayDiv.lastChild);
        }
  
        function createNewPara (text) {
          const time = document.createElement('p');
          calendarTimeParent.appendChild(time);
          time.classList.add('calendarTime');
          time.textContent = text;
        }
  
        selection.forEach((timeValue, i) => {
          if (i === 0 || i % 2 === 0) {
            calendarTimeParent = document.createElement('div');
            calendarTimeParent.classList.add('calendarTimeParent');
            dayDiv.appendChild(calendarTimeParent);
          }
  
          const fieldName = Object.keys(timeValue)[0];
          createNewPara(`${fieldName}:`);
          createNewPara(`${timeValue[fieldName].hh}:${timeValue[fieldName].mm}`);
        });
      }
    }
  }

  function makeButton (parent, className, textContent, hoverText, action, fn) {
    const button = document.createElement('button');
    button.classList.add(className);
    button.textContent = textContent;
    button.addEventListener(action, (e) => {
      fn();
    });
    parent.appendChild(button);
  }
  
  function makeDropDowns (contextText, timePickerContainer) {
    // The time container
    const container = document.createElement('div');
    container.classList.add('timeContainer');
    container.dataset.context = contextText;
    timePickerContainer.appendChild(container);
  
    const timeForContext = { [contextText]: {} };

    selection.push(timeForContext);
  
    // Make label
    const label = document.createElement('p');
    label.classList.add('timeSelectP');
    label.textContent = `${contextText}:`;
    container.appendChild(label);
  
    // Make hour selector
    const timeSelectorDiv = document.createElement('div');
    timeSelectorDiv.dataset.context = contextText;
    container.appendChild(timeSelectorDiv);
  
    makeSelector('hh', 23, timeSelectorDiv, contextText, timePickerContainer, timeForContext);
    makeSelector('mm', 59, timeSelectorDiv, contextText, timePickerContainer, timeForContext);
  }
  
  function makeSelector (type, limit, timeSelectorDiv, contextText, timePickerContainer, timeForContext) {
    const dropDown = document.createElement('select');
    dropDown.classList.add(type, 'timeSelect');
    timeSelectorDiv.appendChild(dropDown);
  
    dropDown.dataset.type = type;
    dropDown.dataset.context = contextText;
  
    const placeholder = document.createElement('option');
    placeholder.textContent = type;
    placeholder.value = '00';
  
    // {"Start":{"hh":"00"}},{"Start":{"mm":"00"}}
    timeForContext[contextText][type] = placeholder.value;
    dropDown.appendChild(placeholder);
  
    let i = 0;
    while (i <= limit) {
      const hour = document.createElement('option');
      let text = i.toString();
      if (text.length === 1) {
        text = `0${i}`;
      }
      hour.value = text;
      hour.textContent = text;
      dropDown.appendChild(hour);
      i++;
    }
  
    dropDown.addEventListener('change', (selected) => {
      timeForContext[contextText][type] = dropDown.value;
      writeToDynamicData();
      writeToDateDiv();
      emitTimeSelectedEvent();
    });
  }

  function writeToDynamicData () {
    dynamicData.datesSelectedArrayObjects[dynamicData.datesSelectedArrayObjects.length-1].forEach((daySelected) => {
      daySelected.times = JSON.parse(JSON.stringify(selection));
    });
  }
  
  function removeTimeValuesOnDate () {
    const d = dynamicData.datesSelectedArrayObjects;
    const lastChoice = d[d.length - 1];
    for (let i = 0; i < lastChoice.length; i++) {
      const dateObj = lastChoice[i];
      const dayDiv = calendar.querySelector(`[data-humandate='${dateObj.humandate}']`);
      dayDiv.removeChild(dayDiv.lastChild);
      dateObj.times = dateObj.times.slice(0, -2);
    }
    selection = selection.slice(0, -2);
    const timeChooser = calendar.querySelector('.timeChooser');
    timeChooser.removeChild(timeChooser.lastChild);
  }
}

export { GenerateTimeChooserModal };
