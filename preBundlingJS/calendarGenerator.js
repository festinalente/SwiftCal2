/**
 * @typedef {Object} HasTestsTag
 * @property {boolean} hasTests - Indicates whether the function has tests.
 */

/**
 * @typedef {Object} hasTheseStyles
 * @property {string} hasTheseStyles - Lists styles references in a function
 */

import {
  getDaysInMonth, generateRandomString, getEarliestDate,
  blockDaysNotOpen, clearSelection,
  humanDate, standardDateObject, proxyToPlainObjectHelper, debounce
} from './basicFunctions.js';
import { GenerateTimeChooserModal } from './displayTimeChooserModal.js';
import { colours, selectedStyle, unselectedStyle } from './styles.js';
import { languages } from './languages.js';
import style from './calendarApp.css';

/**
 * Adds the specified number of months to a date.
 * @param {number} months - The number of months to add.
 * @returns {Date} - The updated date.
 */
Date.prototype.addMonths = function (months) {
  const date = new Date(this);
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  if (years) {
    date.setFullYear(date.getFullYear() + years);
  }
  if (remainingMonths) {
    date.setMonth(date.getMonth() + remainingMonths);
  }
  return date;
};

customElements.define('swift-cal', class extends HTMLElement {
  constructor () {
    super();
    const self = this;
    function stToBoolean (st) {
      if (st === 'true') {
        return true;
      }
      return false;
    }

    const calendar = new SwiftCal();
    calendar.generateCalendar(
      {
        target: self,
        // data-number-of-months-to-display html converts to numberOfMonthsToDisplay JS
        numberOfMonthsToDisplay: this.dataset.numberOfMonthsToDisplay,
        // data-display-time-chooser-modal
        displayTimeChooserModal: stToBoolean(this.dataset.displayTimeChooserModal),
        // data-single-date-choice
        singleDateChoice: stToBoolean(this.dataset.singleDateChoice),

        language: this.dataset.language,
        // data-select-multiple
        selectMultiple: this.dataset.selectMultiple,

        preloadedDates: (this.dataset.preloadedDates) ? JSON.parse(this.dataset.preloadedDates) : false,

        preloadedTooltip: this.dataset.preloadedTooltip,

        blockDaysOfWeek: (this.dataset.blockDaysOfWeek) ? JSON.parse(this.dataset.blockDaysOfWeek) : false,
        // data-start-date="2019-01-01"
        startDate: this.dataset.startDate

      });

    this.dynamicData = calendar.returnDynamicData();
  }
});

function SwiftCal () {
  let timeChooser;
  const config = {};

  const handler = {
    get: (target, key) => {
      if (typeof target[key] === 'object' && target[key] !== null) {
        return new Proxy(target[key], handler);
      }

      return target[key];
    },
    set: (target, prop, value) => {
      if (target[prop] === value) return true;
      target[prop] = value;
      emitDateSelectedEvent();
      return true;
    }
  };

  const dataTemplate = {
    datesSelectedArray: [],
    datesSelectedArrayObjects: [],
    disabled: false
  };

  const dynamicData = new Proxy(dataTemplate, handler);

  const emitDateSelectedEvent = debounce(() => {
    const evt = new CustomEvent('dateSelect', {
      detail: { date: proxyToPlainObjectHelper(dynamicData) }
    });
    config.calendarContainer.dispatchEvent(evt);
  }, 250);

  const calendar = document.createElement('div');

  this.returnCalendar = () => {
    return calendar;
  };

  this.returnDynamicData = () => {
    return dynamicData;
  };

  this.returnConfig = () => {
    return config;
  };

  this.setConfig = (configObj) => {
    // If called via HTML
    config.calendarContainer = configObj.target || false;
    // If called via Javascript
    config.parentDiv = (typeof configObj.parentDiv === 'string') ? document.querySelector(configObj.parentDiv) : configObj.parentDiv;
    // done
    config.numberOfMonthsToDisplay = configObj.numberOfMonthsToDisplay || 12;
    // done
    config.displayTimeChooserModal = configObj.displayTimeChooserModal && true;
    // done
    config.singleDateChoice = configObj.singleDateChoice && true;
    // done
    config.selectRange = !configObj.singleDateChoice;
    // done
    config.language = configObj.language || 'enGb';
    // done
    config.selectMultiple = config.selectMultiple || false;
    // done
    config.displayTimeSelectionOnDate = configObj.displayTimeSelectionOnDate || true;
    // done
    config.preloadedDates = configObj.preloadedDates || false;

    config.preloadedTooltip = configObj.preloadedTooltip || false;

    config.blockDaysOfWeek = configObj.blockDaysOfWeek || false;

    config.bookDaysOfWeek = configObj.bookDaysOfWeek || false;

    config.startDate = configObj.startDate || false;

    config.endUser = configObj.endUser || false;
    config.endUserDurationChoice = configObj.endUserDurationChoice || false;
    config.backend = configObj.backend || false;
    config.displayBlocked = configObj.displayBlocked || false;
    config.datesOpen = configObj.datesOpen || false;

    config.customClickEvent = configObj.customClickEvent || false;
  };

  this.generateCalendar = (configObj) => {
    if (configObj) {
      this.setConfig(configObj);
    }
    // If called via javascript a parentElement needs to be provided
    const parentDiv = config.parentDiv;
    /*
      If called from html as a custom component the component itself is passed (calendarContainer)
      If called via JS while the component isn't a web component in the strictest sense, it still
      behaves like one and is encapsulated in a shadow.
    */
    if (config.calendarContainer) {
      shadowAttach(config.calendarContainer);
    } else {
      newContainer().then((container) => {
        shadowAttach(container);
        config.calendarContainer = container;
      });
    }

    function newContainer () {
      const promise = new Promise((resolve) => {
        const newCal = document.createElement('div');
        newCal.classList.add('swift-cal');
        parentDiv.appendChild(newCal);
        resolve(newCal);
      });
      return promise;
    }

    function shadowAttach (container) {
      const shadowRoot = container.attachShadow({ mode: 'open' });
      const css = document.createElement('style');
      css.textContent = style;
      shadowRoot.appendChild(css);
      shadowRoot.appendChild(calendar);
    }

    const preloadedDates = config.preloadedDates;
    const numberOfMonthsToDisplay = config.numberOfMonthsToDisplay;
    const datesOpen = config.datesOpen;
    const language = config.language;
    const displayTimeChooserModal = config.displayTimeChooserModal;
    const blockWeekDays = config.blockDaysOfWeek;
    const bookWeekDays = config.bookDaysOfWeek;
    const startDate = config.startDate;
    let uniqueDayIndex = 0;
    // Calendar is defined globally within the constructor
    const calendarUniqueId = generateRandomString();
    calendar.id = `calendar-${calendarUniqueId}`;
    calendar.classList.add('calendar');

    const months = [];
    const dateNow = new Date();
    // Repurposing getEarliestDate to format a date.
    const earliestDate = (startDate) ? getEarliestDate([startDate]) : dateNow;
    const startMonth = earliestDate.getMonth();
    const monthNames = languages[language].generalTime.months;
    /* Create month view */
    for (let i = 0; i < numberOfMonthsToDisplay; i++) {
      /* Month specific variables and trackers */
      const yearCalc = earliestDate.addMonths(i).getFullYear();
      const monthCalc = (startMonth + i) % 12;
      const startDayOfMonth = new Date(yearCalc, monthCalc).getDay();
      const daysInMonth = getDaysInMonth((startMonth + i + 1) % 12, earliestDate.addMonths(i).getFullYear());
      let count = 1;
      let dayofweek = 0;

      /* Create month div */
      const month = document.createElement('div');
      months.push(month);
      month.style.width = '15em';
      month.style.backgroundColor = colours.monthBorderColor;
      month.classList.add('month');
      calendar.appendChild(month);

      /* Create month name div (month YYYY) at the top of month display */
      const monthName = document.createElement('div');
      monthName.classList.add('monthName');
      monthName.textContent = `${monthNames[(startMonth + i) % 12]} ${earliestDate.getFullYear()}`;
      month.appendChild(monthName);

      /* Create div with named days of the week */
      const dayNames = document.createElement('div');
      month.appendChild(dayNames);
      dayNames.classList.add('weekrow');
      languages[language].generalTime.daysTruncated.forEach((dayName) => {
        const day = document.createElement('div');
        day.textContent = dayName;
        day.classList.add('dayName', 'widthShapeDays');
        dayNames.appendChild(day);
      });

      /* Create week rows first week, it's reassigned f */
      let weekRow;
      // 42 days, i.e. 6 rows of 7
      for (let p = 0; p < 42; p++) {
        if (p === 0) {
          // made new week row
          weekRow = document.createElement('div');
          month.appendChild(weekRow);
          weekRow.classList.add('weekrow');
          dayofweek = 0;
        }
        if (p < startDayOfMonth) {
          const peghole = document.createElement('div');
          peghole.classList.add('widthShape', 'filler');
          unselectedStyle(peghole);
          weekRow.appendChild(peghole);
          dayofweek++;
        }

        if (p >= startDayOfMonth && p <= (startDayOfMonth + daysInMonth - 1)) {
          const peghole = document.createElement('div');
          peghole.textContent = count;
          peghole.dataset.day = count;
          peghole.dataset.dayofweek = dayofweek;
          peghole.dataset.dayindex = uniqueDayIndex;
          peghole.classList.add('widthShape', 'dayTime');
          peghole.dataset.humandate = humanDate(`${yearCalc}-${monthCalc}-${count}`);
          // peghole.id = `${yearCalc}-${monthCalc}-${count}`;
          peghole.addEventListener('click', (e) => {
            dateOnClickEvents(e);
          });

          weekRow.appendChild(peghole);

          if (i === 0 && p >= startDayOfMonth && p < (earliestDate.getDate() + startDayOfMonth)) {
            peghole.classList.add('filler');
          }

          count++;
          dayofweek++;
          uniqueDayIndex++;
        }

        if (p >= daysInMonth + startDayOfMonth) {
          const peghole = document.createElement('div');
          peghole.classList.add('widthShape', 'filler');
          weekRow.appendChild(peghole);
        }

        if ((p + 1) % 7 === 0) {
          // make new week row:
          weekRow = document.createElement('div');
          month.appendChild(weekRow);
          weekRow.classList.add('weekrow');
          dayofweek = 0;
        }
      }
      if (i === numberOfMonthsToDisplay - 1) {
        blockDaysNotOpen(calendar, datesOpen);
      }
    }
    // Options:
    if (displayTimeChooserModal) {
      timeChooser = new GenerateTimeChooserModal(config, dynamicData, calendar);
      timeChooser.generateModal();
    }
    if (preloadedDates) {
      preloadDates(preloadedDates);
    }
    if (blockWeekDays) {
      blockDaysOfWeek(blockWeekDays);
    }
    if (bookWeekDays) {
      bookDaysOfWeek(bookWeekDays);
    }
  };

  this.preloadedDates = (dates) => {
    calendar.preloadDates(dates);
  };

  let clickCount = 1;
  const dateClickedThrice = {
    date: null,
    count: 1
  };

  function clikedThrice (date) {
    if (dateClickedThrice.date === date) {
      dateClickedThrice.count++;
    } else {
      // reset for new date
      dateClickedThrice.date = date;
      dateClickedThrice.count = 1;
    }

    if (dateClickedThrice.count === 3) {
      dateClickedThrice.count = 0;
      return true;
    }
    return false;
  }

  function dateOnClickEvents (e) {
    const dateDiv = e.target;
    clickCount++;

    if (config.customClickEvent) {
      return config.customClickEvent(e);
    }

    if (dynamicData.disabled) {
      return;
    }

    if (config.selectRange) {
      range(dateDiv);
    }

    if (config.singleDateChoice) {
      clearSelection(calendar, dynamicData);
      bookDates([dateDiv]);
      timeChooserToggle();
    }

    function timeChooserToggle () {
      if (config.displayTimeChooserModal) {
        timeChooser.show();
        timeChooser.writeToDateDiv();
        timeChooser.writeToDynamicData();
      }
    }

    function range (dateDiv) {
      const lastDate = dateClickedThrice.date;
      const thrice = clikedThrice(dateDiv.dataset.humandate);
      if (thrice) {
        window.getSelection().removeAllRanges();
        // pass "true" to indicate a single date range, selected by triple click:
        bookDates([dateDiv], true);
        timeChooserToggle();
        clickCount++;
        return;
      }
      if (clickCount % 2 === 0) {
        if (config.selectMultiple) {
          clearSelection(calendar, dynamicData);
        }
        bookDates([dateDiv]);
        return;
      }
      if (priorWasSingle === false && clickCount % 2 === 1) {
        bookDates([dateDiv]);
        // timeChooserToggle();
        // rule to check if range is a longer than 1:
        if (dateClickedThrice.date !== lastDate) { timeChooserToggle(); }
      }
    }
  }

  /**
   * Range select
   * @description Allows a range of dates to be selected
   * @function bookDates
   * @param dates Nodelist
   * @todo allow a range of length one to be selected
   * @fires bookDay for each day in a range
   */

  let priorWasSingle = false;
  function bookDates (arrayOfDateDivs, singleDate) {
    /**
     * Creates a new selection in the dynamicData object.
     * @return {object} An object containing the tracking array "newArray" and objects array.
     */

    function createNewSelection (priorWasSingle) {
      const parentAr = dynamicData.datesSelectedArray;
      const parentArObj = dynamicData.datesSelectedArrayObjects;
      let newArray, newObjectsArray;

      newArray = parentAr[parentAr.length - 1];

      if (!priorWasSingle && config.selectRange && newArray && newArray.length === 1) {
        newObjectsArray = parentArObj[parentArObj.length - 1];
        return { newArray, newObjectsArray };
      }

      newArray = [];
      newObjectsArray = [];
      parentAr.push(newArray);
      parentArObj.push(newObjectsArray);
      return { newArray, newObjectsArray };
    }

    // create new selections or retrieve the last selection:
    const { newArray, newObjectsArray } = createNewSelection(priorWasSingle);

    for (let i = 0; i < arrayOfDateDivs.length; i++) {
      const dateDiv = arrayOfDateDivs[i];
      findDateSelection(dateDiv);
      bookDay(dateDiv);
    }
    // store win the previous selection was a range of length 1, read by "createNewSelection"
    priorWasSingle = !!(singleDate);

    // if the date is in a previous selection, that selection is spliced
    function findDateSelection (date) {
      // console.log(date);
      const store = dynamicData.datesSelectedArrayObjects;
      for (let j = 0; j < store.length; j++) {
        // the array in question
        const singleSelection = store[j];
        // data attr of html element
        const dateValue = date.dataset.humandate;
        const search = () => singleSelection.find((dateStored) => dateStored.humandate === dateValue);
        if (search()) {
          singleSelection.forEach((date) => {
            // remove selection colour
            const dayDiv = calendar.querySelector(`[data-humandate='${date.humandate}']`);
            unselectedStyle(dayDiv);
            // remove times, if any:
            while (dayDiv.children.length > 0) {
              dayDiv.removeChild(dayDiv.lastChild);
            }
          });
          // remove from storage
          dynamicData.datesSelectedArrayObjects.splice(j, 1);
          dynamicData.datesSelectedArray.splice(j, 1);
        }
      }
    }

    if (config.selectRange) {
      const startDate = newObjectsArray[0];
      const startIndex = startDate.index;
      // if a single date is selected:
      const endDate = newObjectsArray[1] || startDate;
      const endIndex = (endDate) ? endDate.index : false;

      const [low, high] = [parseInt(startIndex), parseInt(endIndex)].sort((a, b) => a - b);

      for (let i = low; i <= high; i++) {
        const dateDiv = calendar.querySelector(`[data-dayindex='${i}']`);
        if (dateDiv.classList.contains('blocked')) {
          unselectedStyle(calendar.querySelector(`[id='${endDate}']`));
          newArray.splice(1, 1);
          newObjectsArray.splice(1, 1);
          break;
        }
        bookDay(dateDiv);
      }
    }

    function bookDay (dateDiv) {
      if (config.singleDateChoice && newArray.length > 0) {
        clearSelection(calendar, dynamicData);
      }
      if (newArray.includes(dateDiv.dataset.humandate) === false) {
        selectedStyle(dateDiv);
        newArray.push(dateDiv.dataset.humandate);
        newObjectsArray[newArray.length - 1] = standardDateObject(dateDiv);
      }
    }
  }

  function bookDaysOfWeek (dayIndex) {
    const days = calendar.querySelectorAll(`[data-dayofweek="${dayIndex}"]`);
    days.forEach((day) => {
      bookDates([day], true);
    });
  }

  function blockDaysOfWeek (dayIndexArray) {
    dayIndexArray.forEach((dayIndex) => {
      const days = calendar.querySelectorAll(`[data-dayofweek="${dayIndex}"]`);
      days.forEach((day) => {
        day.classList.add('filler');
      });
    });
  }

  function preloadDates (preloadedDates) {
    if (typeof preloadedDates[0] !== 'string') {
      throw Error(`Dates should be provided as strings in the format YYYY-MM-DD, Preloaded dates is ${preloadedDates}
         and the first date is ${preloadedDates[0]}`);
    }
    if (preloadedDates[0].split('-')[0].length !== 4) {
      throw Error('Year requires 4 digits, e.g. 2026');
    }
    if (preloadedDates[0].split('-')[1].length !== 2) {
      throw Error('Month requires 2 digits, 01 for January');
    }
    if (preloadedDates[0].split('-')[2].length !== 2) {
      throw Error('Day requires 2 digits, 01 for the first day of the month');
    }

    function getDivs (dates) {
      return dates
        .map(date => calendar.querySelector(`[data-humandate='${date}']`))
        .filter(Boolean); // removes nulls
    }

    function blockNotPreloadedDates (dateDivs) {
      const nonOptions = calendar.querySelectorAll('.dayTime');

      for (let i = 0; i < nonOptions.length; i++) {
        const day = nonOptions[i];

        if (!dateDivs.includes(day)) {
          day.classList.add('filler');
        } else {
          day.classList.add('preloaded');
          day.title = config.preloadedTooltip;
        }
      }
    }

    const dateDivs = getDivs(preloadedDates);
    blockNotPreloadedDates(dateDivs);
  }
}

export { SwiftCal };
