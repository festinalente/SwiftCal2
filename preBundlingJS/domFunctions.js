import { enGb } from './languages.js';
import { config, dynamicData, calendar } from './calendarGenerator.js';
import { selectedStyle } from './styles.js';
let timeChooserModalLocal;

/**
 * Attaches a click event listener to the specified element and applies
 *
 * @param {Element} elem - The element to attach the event listener to.
 * @return {void} This function does not return a value.
 */
function attach (elem) {
  elem.addEventListener('click', () => {
    if (endUserSelectionTrackingArray.includes(elem.dataset.humandate)) {
      elem.style.borderStyle = 'none';
      const index = endUserSelectionTrackingArray.indexOf(elem.dataset.humandate);
      endUserSelection.splice(index, 1);
      endUserSelectionTrackingArray.splice(index, 1);
    } else {
      elem.style.borderStyle = 'solid';
      elem.style.borderColor = 'blue';
      const timeRange = elem.children[0].textContent.split(' ');
      const min = 1;
      const max = parseInt(timeRange[1]) - parseInt(timeRange[0]);
      const times = elem.firstChild.nextSibling.textContent;
      endUserSelection.push({
        day: elem.dataset.humandate,
        duration: min,
        timeGap: times,
        humandate: elem.dataset.humandate,
      });
      endUserSelectionTrackingArray.push(elem.dataset.humandate);
      if (endUser && endUserDurationChoice) {
        toggleDuration(min, max);
        adjustPosition('timeChooser', calendar);
        document.addEventListener('click', function(event) {
          const isClickInside = document.getElementById(`durationInput${calendarUniqueId}`).contains(event.target);
          if (isClickInside) {
            saveClientDateDuration();
          }
          if (!isClickInside && event.target === document.getElementById(`timeChooserModal${calendarUniqueId}`)) {
            document.getElementById(`timeChooserModal${calendarUniqueId}`).style.display = 'none';
            saveClientDateDuration();
          }
        });
      }
    }
  });
}

/**
 * Block the days that are not open on the calendar.
 *
 * @param {Object} calendar - The calendar element.
 * @param {Array} datesOpen - An array of open dates.
 */
function blockDaysNotOpen (calendar, datesOpen) {
  if (calendar && datesOpen) {
    const allDays = Array.from(calendar.querySelectorAll('.dayTime')).map(el => el.dataset.humandate);
    const openDays = datesOpen.map(el => el.day);

    for (let i = 0; i < allDays.length; i++) {
      if (!openDays.includes(allDays[i])) {
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
 * Toggles duration input fo a specific day
 *
 * @param {type} min - minimum duration in hours
 * @param {type} max - maximum duration in hours
 * @return {type} description of the return value
 */

function toggleDuration (min, max) {
  const durationInput = document.getElementById(`durationInput${calendarUniqueId}`);
  const timeChooserModal = document.getElementById(`timeChooserModal${calendarUniqueId}`);

  durationInput.setAttribute('min', min);
  durationInput.setAttribute('max', max);
  durationInput.value = '1';

  timeChooserModal.style.height = `${calendar.clientHeight}px`;
  timeChooserModal.style.width = `${calendar.clientWidth}px`;
  timeChooserModal.style.display = 'inline';
}

function addTimeDisplay(dayInPoint) {
  if (dayInPoint === null) {
    if (calendar.querySelector('.makeTimeRuleGlobal').checked === true) {
      bookDayOfWeekG(lastDateClicked.id);
    } else {
      generateTimesOnly(times.values, lastDateClicked);
    }
  }
  if (dayInPoint) {
    generateTimesOnly(times.values, calendar.querySelector("[id='" + dayInPoint + "']"));
  }
}
/**
 * Formats the day of the week and returns it as a string.
 *
 * @param {string} textBefore - The text to be added before the formatted day.
 * @param {string} textAfter - The text to be added after the formatted day.
 * @param {number} dayOfWeek - The index of the day of the week (0 for Sunday, 1 for Monday, etc.).
 * @return {string} The formatted day of the week as a string.
 */
function formatDayText (dayOfWeek) {
  const daysInFull = enGb.formatDayText.daysInFull;
  const formattedDay = daysInFull[dayOfWeek];
  return `${enGb.formatDayText.textBefore} ${formattedDay} ${enGb.formatDayText.textAfter}`;
}

/**
 * close modal
 * @funtion closeModal()
 * @desctription Closes the time chooser modal then resets times
 */
function closeModal (e) {
  var all = calendar.querySelectorAll('.dayTime');
  all.forEach(function (e) {
    if (e.style.backgroundColor === 'rgb(255, 204, 51)' && e.children.length === 0) {
      e.click();
    }
  });
  /*
  if (times.values % 2 === 1) {
    if (swiftmoAlert) {
      swiftmoAlert.setContent('Warning, you\'re missing an end time for the last time gap you entered.').toggle();
    }
  } else if (times.values.length === 0) {
    calendar.querySelector('.timeChooserModal').style.display = 'none';
  } else if (timeValueInMill(times.values[times.values.length - 1]) < timeValueInMill(times.values[times.values.length - 2])) {
    if (swiftmoAlert) {
      swiftmoAlert.setContent('Warning, you\'ve entered an end time which is before the start time.').toggle();
    }
  } else if (checkOverlap(times.values) === false) {
    if (swiftmoAlert) {
      swiftmoAlert.setContent('Warning, that time overlaps with other times you\'ve already selected.').toggle();
    }
  } else {
  }*/
  //calendar.querySelector('.timeChooserModal').style.display = 'none';
}

export { attach, blockDaysNotOpen, toggleDuration, formatDayText, closeModal };
