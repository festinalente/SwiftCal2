/**
 * @typedef {Object} HasTestsTag
 * @property {boolean} hasTests - Indicates whether the function has tests.
 */

/**
 * @typedef {Object} hasTheseStyles
 * @property {string} hasTheseStyles - Lists styles references in a funtion
 */

import {
  getDaysInMonth, generateRandomString, getEarliestDate,
  preloadDates, blockDaysNotOpen, humanDate, clearSelection
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
Date.prototype.addMonths = function(months) {
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
      if(st === 'true') {
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
        //data-select-multiple
        selectMultiple: this.dataset.selectMultiple

      });
    this.dynamicData = calendar.returnDynamicData();
  }
});

function SwiftCal () {
  let timeChooser;
  // for nested functions to access the outer object
  const innerThis = this; 
  const config = {};

  const handler = {
    get: (target, key) => {
      if(typeof target[key] === 'object' && target[key] !== null) {
        return new Proxy(target[key], handler);
      }

      return target[key];
    },
    set: (target, prop, value) => {
      target[prop] = value;
      emitDateSelectedEvent();
      return true;
    }
  }
  
  const dataTemplate = {
    datesSelectedArray: [],
    datesSelectedArrayObjects: [],
    disabled: false
  };

  const dynamicData = new Proxy(dataTemplate, handler);

  function emitDateSelectedEvent () {
    setTimeout(() => {
      const evt = new CustomEvent('dateSelect', { data: dynamicData });
      config.calendarContainer.dispatchEvent(evt);
    }, 250)
  }
  
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

    config.preloadedDates = configObj.preloadedDates || [];
    config.endUser = configObj.endUser || false;
    config.endUserDurationChoice = configObj.endUserDurationChoice || false;
    config.backend = configObj.backend || false;
    config.displayBlocked = configObj.displayBlocked || false;
    config.datesOpen = configObj.datesOpen || false;
  };

  this.generateCalendar = (configObj) => {
    if (configObj) {
      this.setConfig(configObj);
    }
    // If called via javascript a parentElement needs to be provided
    const parentDiv = config.parentDiv;
    /*
      If called from html as a custom component the component itself is passed (calendarContainer)
      If called via JS while the component isn't a webcomponent in the strictest sense, it still
      behaves like one and is encapsulated in a shadow.
    */
    if (config.calendarContainer) {
      shadowAttach(config.calendarContainer);
    } else {
      newContainer().then((container) => {
        shadowAttach(container);
      });
    }

    function newContainer () {
      const promise = new Promise((resolve, reject) => {
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
    
    // TODO:
    const endUser = config.endUser;
    const endUserDurationChoice = config.endUserDurationChoice;
    const backend = config.backend;
    const displayBlocked = config.displayBlocked;

    let uniqueDayIndex = 0;
    // Calendar is defined globally within the constructor
    const calendarUniqueId = generateRandomString();
    calendar.id = `calendar-${calendarUniqueId}`;
    calendar.classList.add('calendar');

    const months = [];
    const dateNow = new Date();
    const earliestDate = (preloadedDates && preloadedDates.booked) ? getEarliestDate(preloadedDates) : dateNow;
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

      /* Create week rows first week, it's reasigned f */
      let weekRow;
      function makeNewWeekRow () {
        weekRow = document.createElement('div');
        month.appendChild(weekRow);
        weekRow.classList.add('weekrow');
        dayofweek = 0;
      }

      // 42 days, i.e. 6 rows of 7
      for (let p = 0; p < 42; p++) {
        if (p === 0) {
          makeNewWeekRow();
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

          if (i === 0 && p >= startDayOfMonth && p < (new Date().getDate() + startDayOfMonth)) {
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
          makeNewWeekRow();
        }
      }
      if (i === numberOfMonthsToDisplay - 1) {
        preloadDates(calendar, preloadedDates);
        blockDaysNotOpen(calendar, datesOpen);
      }
    }

    if(displayTimeChooserModal) {
      timeChooser = new GenerateTimeChooserModal(config, dynamicData, calendar);
      timeChooser.generateModal();
    }
  };

  let clickCount = 1;

  function dateOnClickEvents (e) {
  
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
        if (config.selectMultiple) {
          clearSelection(calendar, dynamicData);
        }
        bookDates([dateDiv]);
      }
      if (clickCount % 2 === 1) {
        bookDates([dateDiv]);
      }
    }

    if (config.singleDateChoice) {
      clearSelection(calendar, dynamicData);
      bookDates([dateDiv]);
    }
    /*
    if (!datesIndex.includes(dateDiv.dataset.humandate)) {
      const makeTimeRuleGlobal = calendar.querySelector('.timeChooser')?.querySelector('.makeTimeRuleGlobal');
      if (makeTimeRuleGlobal?.checked === true) {
        bookDayOfWeekG(date, null);
      }
    }
    */
  }

  /**
   * Creates a new selection in the dynamicData object.
   *
   * @return {object} An object containing the tracking array "newArray" and objects array.
   */
  function createNewSelection () {
    const parentAr = dynamicData.datesSelectedArray;
    const parentArObj = dynamicData.datesSelectedArrayObjects;
    let newArray, newObjectsArray;

    newArray = parentAr[parentAr.length - 1];
    if (config.selectRange && newArray && newArray.length === 1) {
      newObjectsArray = parentArObj[parentArObj.length - 1];
      return { newArray, newObjectsArray };
    }

    newArray = [];
    newObjectsArray = [];
    parentAr.push(newArray);
    parentArObj.push(newObjectsArray);
    return { newArray, newObjectsArray };
  }

  /**
   * Range select
   * @description Allows a range of dates to be selected
   * @function bookDates
   * @param dates array
   * @todo allow range select to work with time values.
   * @fires bookDay for each day in a range
   */
  function bookDates (arrayOfDateDivs) {
    const { newArray, newObjectsArray } = createNewSelection();
    for (let i = 0; i < arrayOfDateDivs.length; i++) {
      const dateDiv = arrayOfDateDivs[i];
      bookDay(dateDiv);
    }

    const startDate = newObjectsArray[0];
    const startIndex = startDate.index;
    // if a single date is selected:
    const endDate = newObjectsArray[1] || startDate;
    const endIndex = endDate.index;

    if (config.selectRange) {
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
      if (config.singleDateChoice && config.displayTimeChooserModal) {
        timeChooser.show();
      }
      // time picker for multiple consecutive dates.
      if (config.displayTimeChooserModal && startDate !== endDate) {
        timeChooser.show();
      }
      // time picker fo single date:
      if (config.displayTimeChooserModal && config.singleDateChoice) {
        timeChooser.show();
      }
    }
  }

  /**
   * Creates a standard date object with the given date.
   *
   * @param {any} date - Is a string YYYY-MM-DD months are counted from 0.
   * @return {object} The standard date object with the given date.
   */
  function standardDateObject (date) {
    const times = (timeChooser) ? timeChooser.getSelectedTimes() : []
    const obj = {
      day: date.dataset.day,
      humandate: date.dataset.humandate,
      index: date.dataset.dayindex,
      times: times
    }; 
    return obj;
  }
}

export { SwiftCal };
