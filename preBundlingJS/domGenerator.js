import { sortTimes } from './basicFunctions.js';
import { dynamicData, calendar } from './calendarGenerator.js';
import { formatDayText, closeModal } from './domFunctions.js';

let durationChooserModal;
let timeChooserModal;

/**
 * durationChooser - creates a dialog in a modal to select a duration in hh:mm
 */
function durationChooser () {
  durationChooserModal = createModal('durationChooserModal');
  calendar.appendChild(durationChooserModal);

  const durationChooser = createDiv('durationChooser', 'durationChooser');
  durationChooserModal.appendChild(durationChooser);

  calendar.appendChild(durationChooserModal);

  const deleteDiv = createDiv('deleteDiv', null, 'Duration:');
  makeButton(deleteDiv, 'deleteButton', 'x', 'close', durationChooser.close());
  durationChooser.appendChild(deleteDiv);

  const Container = createDiv('timeContainer');
  durationChooser.appendChild(Container);

  const Label = createLabel('calendarLabel', 'hourSelect', 'hours:');
  Container.appendChild(Label);

  const hourSelect = createInput('durationInput', 'number', 'hour');
  Container.appendChild(hourSelect);
}

/**
 * tickBoxes - description
 *
 * @param  {HTMLElement} timePickerElementsContainer This is the HTML element to which the checkbox will be appended.
 * @return {HTMLElement} Returns a HTML checkbox to select all days of a particular type (e.g. all Mondays).
 */
function tickBoxes (timePickerElementsContainer) {
  const timeCont = timePickerElementsContainer;
  const labelfor = document.createElement('p');
  const text = formatDayText('Set these times for all ', 'days');
  labelfor.textContent = text;
  labelfor.classList.add('timeSelectP', 'makeTimeRuleGlobalClass');
  labelfor.htmlFor = 'makeTimeRuleGlobal';
  timeCont.appendChild(labelfor);
  const makeTimeRuleGlobal = document.createElement('input');
  makeTimeRuleGlobal.setAttribute('type', 'checkbox');
  makeTimeRuleGlobal.name = 'makeTimeRuleGlobal';
  makeTimeRuleGlobal.classList.add('makeTimeRuleGlobal');
  timeCont.appendChild(makeTimeRuleGlobal);
  makeTimeRuleGlobal.addEventListener('click', (e) => {
    if (makeTimeRuleGlobal.checked) {
      bookDayOfWeekG(lastDateClicked.id);
      scrollToTimePicker();
      return;
    }
    releaseDayOfWeekG(lastDateClicked.id);
    scrollToTimePicker();
  });
}



/*
function makeTimePicker (startEnd, appendTo) {
  const startContainer = document.createElement('div');
  startContainer.classList.add('timeContainer');
  const startLabel = document.createElement('p');
  startLabel.classList.add('timeSelectP');
  startLabel.textContent = startEnd + ':';
  startContainer.appendChild(startLabel);
  const hourSelect = document.createElement('div');
  hourSelect.id = `${startEnd}`;
  hourSelect.classList.add('hour', 'times', startEnd);
  startContainer.appendChild(hourSelect);
  makeSelector('hh', 24, hourSelect.id, hourSelect, startEnd);
  makeSelector('mm', 59, hourSelect.id, hourSelect, startEnd);
  appendTo.appendChild(startContainer);
}

const time = { hh: '00', mm: '00' };
function makeSelector (type, limit, id, parent, startEnd, instInternal) {
  time[type] = '00';
  var h = document.createElement('select');
  h.classList.add(type, id + '-' + type, 'timeSelect');
  var i = 0;
  var placeholder = document.createElement('option');
  placeholder.textContent = type;
  placeholder.value = '00';
  h.appendChild(placeholder);
  while (i <= limit) {
    var hour = document.createElement('option');
    //leading zero on single digit numbers:
    var text = i.toString();
    if (text.length === 1) {
      text = '0' + i;
    }
    hour.value = text;
    hour.textContent = text;
    h.appendChild(hour);
    i++;
  }
  h.addEventListener('click', function() {
    time[type] = h.value;
    if (type === 'hh') {
      time.mm = '00';
      h.nextSibling.selectedIndex = '1';
    }
    if (!times.indexes.includes(startEnd + '-' + instInternal)) {
      times.indexes.push(startEnd + '-' + instInternal);
      times.values.push(time.hh + ':' + time.mm);
    } else {
      var index = times.indexes.indexOf(startEnd + '-' + instInternal);
      times.values[index] = time.hh + ':' + time.mm;
    }
    addTimeDisplay(null);
  });
  parent.appendChild(h);
}
*/

function createModal (className) {
  const modal = document.createElement('dialog');
  modal.classList.add(className);
  return modal;
}

function createDiv (className, textContent) {
  const div = document.createElement('div');
  if (className) {
    div.classList.add(className);
  }
  if (textContent) {
    div.textContent = textContent;
  }
  return div;
}

function createLabel (id, htmlFor, textContent) {
  const label = document.createElement('label');
  label.setAttribute('id', id);
  label.setAttribute('for', htmlFor);
  label.textContent = textContent;
  return label;
}

function createInput (id, type, className) {
  const input = document.createElement('input');
  input.setAttribute('type', type);
  input.id = id;
  if (className) {
    input.classList.add(className);
  }
  return input;
}

function generateTimesOnly (timeValues, dateDiv) {
  const datesObjStore = dynamicData.datesSelectedArrayObjects;
  const datesIndex = dynamicData.datesSelectedArray;
  let timeText = '';

  if (dateDiv.children) {
    for (let i = dateDiv.children.length - 1; i >= 0; i--) {
      dateDiv.children[i].remove();
    }
  }

  if (timeValues && timeValues.length > 0) {
    const orderedTimes = sortTimes(timeValues);
    const index = datesIndex.indexOf(dateDiv.dataset.dayindex);
    // datesObjStore[index].times = [...timeValues];

    orderedTimes.forEach((time, index) => {
      timeText += time + ' ';

      const timeElement = document.createElement('p');
      timeElement.classList.add('calendarTime');
      timeElement.style.marginBottom = '0px';
      timeElement.textContent = timeText;

      if (!dateDiv.classList.contains('filler')) {
        dateDiv.style.backgroundColor = '#fc3';

        if (index % 2 === 1) {
          timeElement.style.borderBottomStyle = 'solid';
        }

        dateDiv.appendChild(timeElement);
        timeText = '';
      }
    });
  }
}

function timePickerElements () {
  alert('hello')
  // If the current elements aren't filled
  /*
  if (calendar.querySelectorAll('.timePickerElementsContainer').length * 2 !== times.values.length) {
    if (swiftmoAlert) {
      swiftmoAlert.setContent('Fill in the current time values before adding another.').toggle();
    } else {
      alert('Fill in the current time values before adding another.');
    }
    return;
  }
  */
  const timePickerElementsContainer = document.createElement('div');
  timePickerElementsContainer.classList.add('timePickerElementsContainer');
  timeChooserModal.appendChild(timePickerElementsContainer);
  const deleteDiv = document.createElement('div');
  deleteDiv.textContent = 'Add time:';
  deleteDiv.classList.add('deleteDiv');
  timePickerElementsContainer.appendChild(deleteDiv);
  makeTimePicker('Start', timePickerElementsContainer);
  makeTimePicker('End', timePickerElementsContainer);
  tickBoxes(timePickerElementsContainer);
}

export { generateTimesOnly, durationChooser, durationChooserModal, createModal };
