import { selectedStyle, unselectedStyle } from './styles.js';
import { config, calendar, lastDateClicked } from './calendarGenerator.js';
import { displayTimeChooserModal, getSelectedTimes } from './displayTimeChooserModal.js';


	// utility to return date in correct format
	function formatDate (d) {
		const date = (d) ? new Date(d) : new Date();
		const day = date.getDate();
		const month = (date.getMonth() + 1);
		const year = date.getFullYear();
		const formated = `${year}-${month}-${day}`;
		return formated;
	};


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
 * var getDaysInMonth - Get number of days in month
 *
 * @param  {!number} month The number of the corresponding month.
 * @param  {!number} year  The corresponding year.
 * @return {number} Returns a number corresponding to the number of days for the date in point.
 */
function getDaysInMonth (month, year) {
  return new Date(year, month, 0).getDate();
}

/**
 * Checks for overlap in an array of values.
 *
 * @param {Array} values - The array of values to check for overlap.
 * @return {boolean} - Returns true if overlap is found, false otherwise.
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

/**
 * Clears the selection of dates in the calendar.
 *
 * @param {undefined}
 * @return {undefined}
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

/*

*/

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

function generateRandomString() {
  const randomString = randomBytes(10);
  if (document.querySelector('#calendar-' + randomString)) {
    return generateRandomString();
  } else {
    return randomString;
  }
}

//WE WERE SETTING UP THE CALENDAR TO RENDER DATES IN THE PAST:
/* Warning: Contemplates daylight saving time*/

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
 * Converts an array of dates into a new array of objects with formatted dates.
 *
 * @param {Array} dates - The array of dates.
 * @return {Promise} A promise that resolves to the new array of objects.
 */
function convertDates (dates) {
  const promise = new Promise((resolve, reject) => {
    for (let i = 0; i < dates.length; i++) {
      if (dates[i].day) {
        dynamicData.datesSelectedArrayObjects.push(dates[i]);
        continue;
      }
      // dynamicData.datesSelectedArrayObjects.push({ day: standardDateObject(dates[i]) });
    }
  });
  return promise;
}


/**
 * Asynchronously preloads dates for the calendar.
 *
 * @param {object} calendar - the calendar object
 * @param {array} dates - an array of dates to preload
 * @return {void} 
 */
async function preloadDates (calendar, dates) {
  console.log('PRELOADING DATES...');
  // console.log(calendar);
  // console.log(dates);
  dates = ['2023-10-10']
  let endUser = 1;
  //attach(dateNode);
  await convertDates(dates);

  for (let i = 0; i < datesSelectedArrayObjects.length; i++) {
    const dateObject = datesSelectedArrayObjects[i];
    const dateNode = calendar.querySelector(`#${dateObject.day}`);

    if (dateNode) {
      datesSelectedArray.push(dates[i].day);
      dateNode.style.backgroundColor = '#fc3';
      dateNode.classList.add('available');
    }

    if (endUser) {
      attach(dateNode);
      //timeChooser();
    }

    if (displayTimeChooserModal) {
      // createTimeElements ();
      //generateTimesOnly(dateObject.times, dateNode);
    }

    if (selectRange && dateNode && !dateNode.classList.contains('filler')) {
      dateNode.style.backgroundColor = '#333';
      dateNode.classList.add('blocked');
      dateNode.title = 'No availability on this day';

      const soldOut = document.createElement('p');
      soldOut.classList.add('calendarTime');
      soldOut.textContent = 'Sold out';
      dateNode.appendChild(soldOut);
    }
  }
}

function blockDaysNotOpen (calendar, datesOpen) {
  if (calendar && datesOpen) {
    const allDays = Array.from(calendar.querySelectorAll('.dayTime')).map((el) => { return el.dataset.humandate; });
    const openDays = datesOpen.map((el) => { return el.day; });

    for (let i = 0; i < allDays.length; i++) {
      if (openDays.indexOf(allDays[i]) === -1) {
        const day = calendar.querySelector(`[id="${allDays[i]}"]`);
        day.classList.add('widthShape', 'filler');
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

/**
 * Release booked day
 * @description Removes a day that has been previously booked.
 * @function releaseBookedDay
 * @param {HTMLElement} day - HTML div element representing the day.
 * @param {string} date - Date string in the format 'YYYY-MM-DD'.
 */
function releaseBookedDay (day, date) {
  const index = datesSelectedArray.indexOf(date);
  unselectedStyle(day);
  datesSelectedArray.splice(index, 1);
  datesSelectedArrayObjects.splice(index, 1);

  while (day.firstChild) {
    day.firstChild.remove();
  }
}

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


function sortTimes (val) {
  var sorted = [];
  return enumerate(val);

  function sortNumber(a, b) {
    return a - b;
  }

  function enumerate(values) {
    var numericalEquivalent = [];
    for (var i = 0; i < values.length; i++) {
      numericalEquivalent.push(timeValueInMill(values[i]));
      if (i === values.length - 1) {
        return sort(values, numericalEquivalent);
      }
    }
  }

  function sort(values, numericalEquivalent) {
    var numericalEquivalentClone = JSON.parse(JSON.stringify(numericalEquivalent));
    var sortedInt = numericalEquivalent.sort(sortNumber);
    for (var p = 0; p < numericalEquivalentClone.length; p++) {
      var newIndex = sortedInt.indexOf(numericalEquivalentClone[p]);
      sorted.splice(p, 1, values[newIndex]);
      if (p === numericalEquivalent.length - 1) {
        return sorted;
      }
    }
  }
}

/**
 * Release day of week
 * @function releaseDayOfWeekG
 * @param dayID id of the day to be released. N.b. day of week is stored as a data attribute
 * @todo make it use lastDateClicked (which is the day in context)
 */
function releaseDayOfWeekG(dayId) {
  const weekday = lastDateClicked.dataset.dayofweek;
  const blockTheseDays = document.querySelectorAll("[data-dayofweek='" + weekday + "']");
  for (var i = 0; i < blockTheseDays.length; i++) {
    var blockDay = document.getElementById(blockTheseDays[i].id);
    if (blockDay !== lastDateClicked) {
      releaseBookedDay(blockDay, blockTheseDays[i].id);
      removeTimeDisplay(blockTheseDays[i].id);
    }
    if (blockDay === lastDateClicked) {
      // remove only the display:
      //removeTimeDisplay(blockTheseDays[i].id);
    }
  }
}

export { timeValueInMill, checkOverlap, clearSelection, getDaysInMonth, generateRandomString, getEarliestDate,
  preloadDates, blockDaysNotOpen, releaseBookedDay, humanDate, sortTimes, formatDate };

//bookDay singleDateChoice
//releaseBookedDay datesSelectedArrayObjects datesSelectedArray