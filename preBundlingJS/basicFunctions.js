import { unselectedStyle } from './styles.js';

/**
 * Adds 1 to the month in a given date to make it more human-readable.
 * @param {string} date - The date in the format 'YYYY-MM-DD' or 'YYYY-M-D'.
 * @returns {string} - The modified date in the format 'YYYY-MM-DD'.
 * @throws {Error} - If the date parameter is not in the format 'YYYY-MM-DD' or 'YYYY-M-D'.
 */
function humanDate (date) {
  const dateParts = date.split('-');
  const month = parseInt(dateParts[1]) + 1;
  const day = parseInt(dateParts[2]);
  const modifiedMonth = month < 10 ? `0${month}` : month;
  const modifiedDay = day < 10 ? `0${day}` : day;
  const modifiedDate = `${dateParts[0]}-${modifiedMonth}-${modifiedDay}`;
  return modifiedDate;
}

/**
 * Converts a human date string to UTC timestamp.
 *
 * @param {string} humandate - The human-readable date string in the format "YYYY-MM-DD".
 * @return {number} - The UTC timestamp in milliseconds.
 */
function humandateToUTC (humandate) {
  let ints = humandate.split('-');
  ints = ints.map((int) => parseInt(int));
  ints[1] = ints[1] - 1;
  return Date.UTC(ints[0], ints[1], ints[2]);
}

// model object
const dateObjectTemplate = { day: 'day', humandate: 'YYYY-MM-DD', index: '0', UTC: 1698278400000 };
/**
 * Creates a standard date object with the given date.
 *
 * @param {any} date - Is a string YYYY-MM-DD months are counted from 0.
 * @return {object} The standard date object with the given date.
 */
function standardDateObject (date) {
  const obj = Object.create(dateObjectTemplate);
  obj.day = date.dataset.day;
  obj.humandate = date.dataset.humandate;
  obj.index = date.dataset.dayindex;
  obj.UTC = humandateToUTC(date.dataset.humandate);
  return obj;
}

/**
 * Calculates the time value in milliseconds based on the given time.
 *
 * @param {string} time - The time in the format "HH:MM".
 * @return {number} The time value in milliseconds.
 *
 * @hasTests
 *
 * @example
 * // Example usage:
 * const timeValue = timeValueInMill('12:30');
 */

function timeValueInMill (time) {
  if (!time.includes(':')) {
    const e = new Error('Expects a time string HH:MM');
    throw e;
  }
  const [hours, minutes] = time.split(':');
  return (parseInt(hours) * 60 * 60 * 1000) + (parseInt(minutes) * 60 * 1000);
}

/**
 * etDaysInMonth - Get number of days in month
 *
 * @param  {!number} month The number of the corresponding month.
 * @param  {!number} year  The corresponding year.
 * @return {number} Returns a number corresponding to the number of days for the date in point.
 */
function getDaysInMonth (month, year) {
  return new Date(year, month, 0).getDate();
}

/**
 * Clears the selection in the calendar by removing the selected dates and
 * resetting the dynamic data.
 *
 * @param {Object} calendar - The calendar component.
 * @param {Object} dynamicData - The dynamic data object.
 * @return {undefined} This function does not return a value.
 */
function clearSelection (calendar, dynamicData) {
  const datesObjStore = dynamicData.datesSelectedArrayObjects;
  const datesIndex = dynamicData.datesSelectedArray;

  for (let i = 0; i < datesObjStore.length; i++) {
    for (let j = 0; j < datesIndex.length; j++) {
      datesIndex[j].forEach((date) => {
        const dateDiv = calendar.querySelector(`[data-humandate='${date}']`);
        unselectedStyle(dateDiv);
        while (dateDiv.children.length > 0) {
          dateDiv.removeChild(dateDiv.lastChild);
        }
        if (i === datesObjStore.length - 1 && j === datesIndex.length - 1) {
          datesObjStore.length = 0;
          datesIndex.length = 0;
        }
      });
    }
  }
}

/**
 * @param {number} [length=10] -length the desired length of the string of numbers.
 * @returns a string of random digits of a specified length.
 */

function randomBytes (length) {
  if (length > 80) {
    const e = new Error('randomBytes length can be more than 800 digits');
    throw e;
  }
  const array = new Uint32Array(100);
  window.crypto.getRandomValues(array);
  let st = '';
  for (let i = 0; i < array.length; i++) {
    st += array[i];
    if (i === array.length - 1) {
      return st.slice(st.length - (length || 10));
    }
  }
}

function proxyToPlainObjectHelper (proxy) {
  if (Array.isArray(proxy)) {
    // If it's an array, map over the array and convert each element recursively
    return proxy.map(proxyToPlainObjectHelper);
  } else if (proxy !== null && typeof proxy === 'object') {
    // If it's an object (and not null), recursively convert each property
    const plainObject = {};
    for (const key in proxy) {
      if (Object.prototype.hasOwnProperty.call(proxy, key)) {
        plainObject[key] = proxyToPlainObjectHelper(proxy[key]);
      }
    }
    return plainObject;
  } else {
    // For primitive values (numbers, strings, etc.), just return the value
    return proxy;
  }
}

function generateRandomString () {
  const randomString = randomBytes(10);
  if (document.querySelector('#calendar-' + randomString)) {
    return generateRandomString();
  } else {
    return randomString;
  }
}

// WE WERE SETTING UP THE CALENDAR TO RENDER DATES IN THE PAST:
/* Warning: Contemplates daylight saving time */

/**
 * Calculates and returns the earliest date from a given array of preloaded dates.
 *
 * @param {Array} preloadedDates - An array of preloaded dates.
 * @return {Date} The earliest date from the preloaded dates.
 */
function getEarliestDate (preloadedDates) {
  const order = [];
  for (let i = 0; i < preloadedDates.length; i++) {
    if (i === 0) {
      order.push(new Date().getTime());
    }
    order.push(new Date(preloadedDates[i]).getTime());
    if (i === preloadedDates.length - 1) {
      order.sort();
      const d = new Date(order[0]);
      return d;
    }
  }
}

/**
 * Generates a function comment for the given function body in a markdown
 * code block with the correct language syntax.
 *
 * @param {HTMLElement} calendar - The calendar component.
 * @param {Array} datesOpen - An array of open dates.
 */
function blockDaysNotOpen (calendar, datesOpen) {
  if (calendar && datesOpen) {
    const allDays = Array.from(calendar.querySelectorAll('.dayTime')).map((el) => { return el.dataset.humandate; });
    const openDays = datesOpen.map((el) => { return el.day; });

    for (let i = 0; i < allDays.length; i++) {
      if (openDays.indexOf(allDays[i]) === -1) {
        const day = calendar.querySelector(`[id="${allDays[i]}"]`);
        // day.classList.add('widthShape', 'filler');
        day.style.backgroundColor = 'white';
        day.title = 'Closed on this day';

        const closed = document.createElement('p');
        closed.classList.add('calendarTime');
        closed.textContent = 'closed';

        day.appendChild(closed);
      }
    }
  }
}

function sortTimes (val) {
  const sorted = [];
  return enumerate(val);

  function sortNumber (a, b) {
    return a - b;
  }

  function enumerate (values) {
    const numericalEquivalent = [];
    for (let i = 0; i < values.length; i++) {
      numericalEquivalent.push(timeValueInMill(values[i]));
      if (i === values.length - 1) {
        return sort(values, numericalEquivalent);
      }
    }
  }

  function sort (values, numericalEquivalent) {
    const numericalEquivalentClone = JSON.parse(JSON.stringify(numericalEquivalent));
    const sortedInt = numericalEquivalent.sort(sortNumber);
    for (let p = 0; p < numericalEquivalentClone.length; p++) {
      const newIndex = sortedInt.indexOf(numericalEquivalentClone[p]);
      sorted.splice(p, 1, values[newIndex]);
      if (p === numericalEquivalent.length - 1) {
        return sorted;
      }
    }
  }
}

/**
 * Checks for overlap in an array of values.
 *
 * @param {Array} values - The array of values to check for overlap.
 * @return {boolean} - Returns true if overlap is found, false otherwise.
 * @@description not called anywhere (yet)
 */
function checkOverlap (values) {
  const numericalEquivalent = values.map(timeValueInMill);

  for (let currentIndex = 2; currentIndex < numericalEquivalent.length; currentIndex += 2) {
    const currentStart = numericalEquivalent[currentIndex];
    const currentEnd = numericalEquivalent[currentIndex + 1];

    for (let comparisonIndex = 0; comparisonIndex < numericalEquivalent.length; comparisonIndex += 2) {
      if (currentIndex !== comparisonIndex) {
        const comparisonStart = numericalEquivalent[comparisonIndex];
        const comparisonEnd = numericalEquivalent[comparisonIndex + 1];

        if (comparisonEnd >= currentStart && comparisonEnd <= currentEnd) {
          return true;
        } else if (currentStart >= comparisonStart && currentEnd <= comparisonEnd) {
          return true;
        } else if (currentStart === comparisonStart && currentEnd === comparisonEnd) {
          return true;
        } else if (currentEnd >= comparisonStart && currentEnd <= comparisonEnd) {
          return true;
        } else {
          return false;
        }
      }
    }
  }
  return false;
}

function debounce (fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

export {
  timeValueInMill, checkOverlap, clearSelection, getDaysInMonth,
  generateRandomString, getEarliestDate, blockDaysNotOpen,
  sortTimes, humanDate, humandateToUTC, standardDateObject,
  proxyToPlainObjectHelper, debounce
};
