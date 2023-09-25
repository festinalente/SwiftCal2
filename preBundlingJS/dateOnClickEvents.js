import { SwiftCal } from './calendarGenerator.js';
import { displayTimeChooserModal, getSelectedTimes } from './displayTimeChooserModal.js';
import { clearSelection } from './basicFunctions.js';
import { selectedStyle } from './styles.js';

let clickCount = 1;

function dateOnClickEvents (e) {
  const config = SwiftCal().returnConfig();
  const dynamicData = SwiftCal().returnDynamicData();
  const calendar = SwiftCal().returnCalendar();
  

  const datesObjStore = dynamicData.datesSelectedArrayObjects;
  const datesIndex = dynamicData.datesSelectedArray;

  alert(`awake ${datesObjStore}`);
  const dateDiv = e.target;
  clickCount++;

  if (dynamicData.disabled) {
    return;
  }

  if (dateDiv.classList.contains('blocked')) {
    return;
  }

  if (calendar.querySelector('.makeTimeRuleGlobal')) {
    calendar.querySelector('.makeTimeRuleGlobalClass').textContent = formatDayText();
  }

  if (config.selectRange) {
    if (clickCount % 2 === 0) {
      clearSelection();

      // style the date as selected
      selectedStyle(dateDiv);
      bookDates([dateDiv]);
    }
    if (clickCount % 2 === 1) {
      bookDates([dateDiv]);
    }
  }

  if (config.singleDateChoice) {
    clearSelection();
    selectedStyle(dateDiv);
    bookDay(dateDiv);
    /*if (config.displayTimeChooserModal) {
      displayTimeChooserModal();
    }*/
  }

  /*

  if (!datesIndex.includes(dateDiv.dataset.humandate)) {
    const makeTimeRuleGlobal = calendar.querySelector('.timeChooser')?.querySelector('.makeTimeRuleGlobal');

    if (makeTimeRuleGlobal?.checked === true) {
      bookDayOfWeekG(date, null);
    }

    bookDay(el, date);
    addTimeDisplay(date, null);

    if (displayTimeG === true) {
      timeChooserModal.style.height = calendar.clientHeight + "px";
      timeChooserModal.style.width = calendar.clientWidth + "px";
      timeChooserModal.style.display = 'inline';
      adjustPosition(timeChooser, calendar);
    }
  } else {
    el.style.backgroundColor = 'white';
    removeSelectedDate(date);

    if (displayTimeG === true) {
      while (el.children[0]) {
        el.removeChild(el.children[0]);
      }
    }
  }*/
}

/**
   * Range select
   * @description Allows a range of dates to be selected
   * @function bookDates
   * @param dates array
   * @todo allow range select to work with time values.
   * @fires bookDay for each day in a range
   */
async function bookDates (arrayOfDateDivs) {
  for (let i = 0; i < arrayOfDateDivs.length; i++) {
    const dateDiv = arrayOfDateDivs[i];
    bookDay(dateDiv);
  }
  const startDate = dynamicData.datesSelectedArrayObjects[0];
  const startIndex = startDate.index;
  // if a single date is selected:
  const endDate = dynamicData.datesSelectedArrayObjects[1] || startDate;
  const endIndex = endDate.index;

  if (config.displayTimeChooserModal && startDate !== endDate) {
    displayTimeChooserModal();
  }

  const [low, high] = [parseInt(startIndex), parseInt(endIndex)].sort((a, b) => a - b);
  for (let i = low; i <= high; i++) {
    const dateDiv = calendar.querySelector(`[data-dayindex='${i}']`);
    if (dateDiv.classList.contains('blocked')) {
      unselectedStyle(calendar.querySelector(`[id='${endDate}']`));
      dynamicData.datesSelectedArray.splice(1, 1);
      dynamicData.datesSelectedArrayObjects.splice(1, 1);
      break;
    }
    bookDay(dateDiv);
  }

  function bookDay (dateDiv) {
    if (config.singleDateChoice && dynamicData.datesSelectedArray.length > 0) {
      clearSelection();
    }
    if (dynamicData.datesSelectedArray.includes(dateDiv.dataset.humandate) === false) {
      selectedStyle(dateDiv);
      dynamicData.datesSelectedArray.push(dateDiv.dataset.humandate);
      dynamicData.datesSelectedArrayObjects[dynamicData.datesSelectedArray.length - 1] = standardDateObject(dateDiv);
    }
  }
}

/**
 * Book day
 * @description Books a day by adding it to the datesSelectedArray and it's tracking array.
 * @function bookDay
 * @param day is a html div with an id that refers to the date YYYY-MM-DD months are counted from 0.
 * @param date is a string YYYY-MM-DD months are counted from 0.
 */
function bookDay (dateDiv) {
  if (config.singleDateChoice && dynamicData.datesSelectedArray.length > 0) {
    clearSelection();
  }
  if (dynamicData.datesSelectedArray.includes(dateDiv.dataset.humandate) === false) {
    selectedStyle(dateDiv);
    dynamicData.datesSelectedArray.push(dateDiv.dataset.humandate);
    dynamicData.datesSelectedArrayObjects[dynamicData.datesSelectedArray.length - 1] = standardDateObject(dateDiv);
  }
  if (config.displayTimeChooserModal) {
    dynamicData.datesSelectedArrayObjects[dynamicData.datesSelectedArray.length - 1].times = getSelectedTimes();
  }
}

/**
 * Creates a standard date object with the given date.
 *
 * @param {any} date - Is a string YYYY-MM-DD months are counted from 0.
 * @return {object} The standard date object with the given date.
 */
function standardDateObject (date) {
  return {
    day: date.dataset.day,
    humandate: date.dataset.humandate,
    index: date.dataset.dayindex,
    times: getSelectedTimes()
  };
}

export { dateOnClickEvents };
