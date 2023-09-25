import { languages } from './languages.js';

let timeChooserModal, calendar, config, dynamicData;
let selection = [];

/**
 * Creates dialog for selecting specific times
 * @function createTimeElements
 * @param {HTMLElement} calendar - The calendar element
 * @returns {promise} - Empty promise. The actual div is in this code on "timeChooserModal"
 */

function generateTimeChooserModal () {
  const promise = new Promise((resolve, reject) => {
    if (timeChooserModal) {
      resolve(timeChooserModal);
    }

    timeChooserModal = createModal('timeChooserModal');
    calendar.appendChild(timeChooserModal);

    const timeCont = document.createElement('div');
    timeCont.classList.add('timeCont');
    timeChooserModal.appendChild(timeCont);

    const timeChooser = document.createElement('div');
    timeChooser.classList.add('timeChooser');
    timeCont.appendChild(timeChooser);

    // makeButton(deleteDiv, 'removeTime', '-', 'remove last time', removeTime);
    // makeButton(deleteDiv, 'addTime', '+', 'add a time', 'click', timePickerElements);
    // makeButton(deleteDiv, 'removeTime', '-', 'remove last time', 'click');
    const controlsDiv = document.createElement('div');
    controlsDiv.classList.add('deleteDiv');
    timeChooser.appendChild(controlsDiv);

    function closeFn () {
      timeChooserModal.close();
    }
    makeButton(controlsDiv, 'deleteButton', 'x', 'close', 'click', closeFn);

    function innerComponents () {
      // If the current elements aren't filled:
      /*
      if (calendar.querySelectorAll('.timePickerContainer').length * 2 !== times.values.length) {
        if (swiftmoAlert) {
          swiftmoAlert.setContent('Fill in the current time values before adding another.').toggle();
        } else {
          alert('Fill in the current time values before adding another.');
        }
        return;
      }
      */
      const timePickerContainer = document.createElement('div');
      timePickerContainer.classList.add('timePickerContainer');
      timeChooser.appendChild(timePickerContainer);
      const titleDiv = document.createElement('div');
      titleDiv.textContent = languages[config.language].timeWidget.addTime;
      titleDiv.classList.add('deleteDiv');
      timePickerContainer.appendChild(titleDiv);
      makeDropDowns(languages[config.language].timeWidget.start, timePickerContainer);
      makeDropDowns(languages[config.language].timeWidget.end, timePickerContainer);
      // tickboxes(timePickerContainer);
    }
    makeButton(controlsDiv, 'deleteButton', '+', 'add time', 'click', innerComponents);
    makeButton(controlsDiv, 'deleteButton', '-', 'remove time', 'click', removeTimeValuesOnDate);
    resolve(timeChooserModal);
  });
  return promise;
}

function createModal (className) {
  const modal = document.createElement('dialog');
  modal.classList.add(className);
  return modal;
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

  // The storage object
  // selection.push([]);

  // timeObj =  [[]]
  // const timesObj = selection[selection.length - 1];

  const timeForContext = { [contextText]: {} };

  // timesObj.push(timeForContext);
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
  // {[type]: placeholder.value}
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
    writeToDateDiv();
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

function writeToDateDiv () {
  if (config.displayTimeSelectionOnDate) {
    dynamicData.datesSelectedArray.forEach((childArray) => {
      childArray.forEach((daySelected) => {
        write(daySelected);
      });
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
        
        /*
        if (dayInPoint.classList.contains('filler') === false) {
          dayInPoint.style.backgroundColor = '#fc3';
          if (i % 2 === 1) {
            time.style.borderBottomStyle = 'solid';
            dayInPoint.appendChild(time);
            textinternal = '';
          } else {
            dayInPoint.appendChild(time);
            textinternal = '';
          }
        }*/
      });
    }

    //generateTimeValuesOnDate(timeValues);
  }
}
function displayTimeChooserModal (cal, conf, data) {
  calendar = cal;
  config = conf;
  dynamicData = data;
  if (timeChooserModal) {
    timeChooserModal.show();
  } else {
    generateTimeChooserModal().then((newModal) => {
      timeChooserModal = newModal;
      timeChooserModal.show();
    });
  }
}

function getSelectedTimes () {
  return selection;
}

export { displayTimeChooserModal, getSelectedTimes };
