(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.calendar = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';
// For more information about browser field, check out the browser field at https://github.com/substack/browserify-handbook#browser-field.

var styleElementsInsertedAtTop = [];

var insertStyleElement = function(styleElement, options) {
    var head = document.head || document.getElementsByTagName('head')[0];
    var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];

    options = options || {};
    options.insertAt = options.insertAt || 'bottom';

    if (options.insertAt === 'top') {
        if (!lastStyleElementInsertedAtTop) {
            head.insertBefore(styleElement, head.firstChild);
        } else if (lastStyleElementInsertedAtTop.nextSibling) {
            head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
        } else {
            head.appendChild(styleElement);
        }
        styleElementsInsertedAtTop.push(styleElement);
    } else if (options.insertAt === 'bottom') {
        head.appendChild(styleElement);
    } else {
        throw new Error('Invalid value for parameter \'insertAt\'. Must be \'top\' or \'bottom\'.');
    }
};

module.exports = {
    // Create a <link> tag with optional data attributes
    createLink: function(href, attributes) {
        var head = document.head || document.getElementsByTagName('head')[0];
        var link = document.createElement('link');

        link.href = href;
        link.rel = 'stylesheet';

        for (var key in attributes) {
            if ( ! attributes.hasOwnProperty(key)) {
                continue;
            }
            var value = attributes[key];
            link.setAttribute('data-' + key, value);
        }

        head.appendChild(link);
    },
    // Create a <style> tag with optional data attributes
    createStyle: function(cssText, attributes, extraOptions) {
        extraOptions = extraOptions || {};

        var style = document.createElement('style');
        style.type = 'text/css';

        for (var key in attributes) {
            if ( ! attributes.hasOwnProperty(key)) {
                continue;
            }
            var value = attributes[key];
            style.setAttribute('data-' + key, value);
        }

        if (style.sheet) { // for jsdom and IE9+
            style.innerHTML = cssText;
            style.sheet.cssText = cssText;
            insertStyleElement(style, { insertAt: extraOptions.insertAt });
        } else if (style.styleSheet) { // for IE8 and below
            insertStyleElement(style, { insertAt: extraOptions.insertAt });
            style.styleSheet.cssText = cssText;
        } else { // for Chrome, Firefox, and Safari
            style.appendChild(document.createTextNode(cssText));
            insertStyleElement(style, { insertAt: extraOptions.insertAt });
        }
    }
};

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.blockDaysNotOpen = blockDaysNotOpen;
exports.checkOverlap = checkOverlap;
exports.clearSelection = clearSelection;
exports.generateRandomString = generateRandomString;
exports.getDaysInMonth = getDaysInMonth;
exports.getEarliestDate = getEarliestDate;
exports.humanDate = humanDate;
exports.humandateToUTC = humandateToUTC;
exports.sortTimes = sortTimes;
exports.standardDateObject = standardDateObject;
exports.timeValueInMill = timeValueInMill;
var _styles = require("./styles.js");
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
/**
 * Adds 1 to the month in a given date to make it more human-readable.
 * @param {string} date - The date in the format 'YYYY-MM-DD' or 'YYYY-M-D'.
 * @returns {string} - The modified date in the format 'YYYY-MM-DD'.
 * @throws {Error} - If the date parameter is not in the format 'YYYY-MM-DD' or 'YYYY-M-D'.
 */
function humanDate(date) {
  var dateParts = date.split('-');
  var month = parseInt(dateParts[1]) + 1;
  var day = parseInt(dateParts[2]);
  var modifiedMonth = month < 10 ? "0".concat(month) : month;
  var modifiedDay = day < 10 ? "0".concat(day) : day;
  var modifiedDate = "".concat(dateParts[0], "-").concat(modifiedMonth, "-").concat(modifiedDay);
  return modifiedDate;
}

/**
 * Converts a human date string to UTC timestamp.
 *
 * @param {string} humandate - The human-readable date string in the format "YYYY-MM-DD".
 * @return {number} - The UTC timestamp in milliseconds.
 */
function humandateToUTC(humandate) {
  var ints = humandate.split('-');
  ints = ints.map(function (_int) {
    return parseInt(_int);
  });
  ints[1] = ints[1] - 1;
  return Date.UTC(ints[0], ints[1], ints[2]);
}

// model object
var dateObjectTemplate = {
  day: 'day',
  humandate: 'YYYY-MM-DD',
  index: '0',
  UTC: 1698278400000
};
/**
 * Creates a standard date object with the given date.
 *
 * @param {any} date - Is a string YYYY-MM-DD months are counted from 0.
 * @return {object} The standard date object with the given date.
 */
function standardDateObject(date) {
  var obj = Object.create(dateObjectTemplate);
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

function timeValueInMill(time) {
  if (!time.includes(':')) {
    var e = new Error('Expects a time string HH:MM');
    throw e;
  }
  var _time$split = time.split(':'),
    _time$split2 = _slicedToArray(_time$split, 2),
    hours = _time$split2[0],
    minutes = _time$split2[1];
  return parseInt(hours) * 60 * 60 * 1000 + parseInt(minutes) * 60 * 1000;
}

/**
 * etDaysInMonth - Get number of days in month
 *
 * @param  {!number} month The number of the corresponding month.
 * @param  {!number} year  The corresponding year.
 * @return {number} Returns a number corresponding to the number of days for the date in point.
 */
function getDaysInMonth(month, year) {
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
function clearSelection(calendar, dynamicData) {
  var datesObjStore = dynamicData.datesSelectedArrayObjects;
  var datesIndex = dynamicData.datesSelectedArray;
  var _loop = function _loop(i) {
    var _loop2 = function _loop2(j) {
      datesIndex[j].forEach(function (date) {
        var dateDiv = calendar.querySelector("[data-humandate='".concat(date, "']"));
        (0, _styles.unselectedStyle)(dateDiv);
        while (dateDiv.children.length > 0) {
          dateDiv.removeChild(dateDiv.lastChild);
        }
        if (i === datesObjStore.length - 1 && j === datesIndex.length - 1) {
          datesObjStore.length = 0;
          datesIndex.length = 0;
        }
      });
    };
    for (var j = 0; j < datesIndex.length; j++) {
      _loop2(j);
    }
  };
  for (var i = 0; i < datesObjStore.length; i++) {
    _loop(i);
  }
}

/**
 * @param {number} [length=10] -length the desired length of the string of numbers.
 * @returns a string of random digits of a specified length.
 */

function randomBytes(length) {
  if (length > 80) {
    var e = new Error('randomBytes length can be more than 800 digits');
    throw e;
  }
  var array = new Uint32Array(100);
  window.crypto.getRandomValues(array);
  var st = '';
  for (var i = 0; i < array.length; i++) {
    st += array[i];
    if (i === array.length - 1) {
      return st.slice(st.length - (length || 10));
    }
  }
}
function generateRandomString() {
  var randomString = randomBytes(10);
  if (document.querySelector('#calendar-' + randomString)) {
    return generateRandomString();
  } else {
    return randomString;
  }
}

//WE WERE SETTING UP THE CALENDAR TO RENDER DATES IN THE PAST:
/* Warning: Contemplates daylight saving time*/

/**
 * Calculates and returns the earliest date from a given array of preloaded dates.
 *
 * @param {Array} preloadedDates - An array of preloaded dates.
 * @return {Date} The earliest date from the preloaded dates.
 */
function getEarliestDate(preloadedDates) {
  var order = [];
  for (var i = 0; i < preloadedDates.length; i++) {
    if (i === 0) {
      order.push(new Date().getTime());
    }
    order.push(new Date(preloadedDates[i]).getTime());
    if (i === preloadedDates.length - 1) {
      order.sort();
      var d = new Date(order[0]);
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
function blockDaysNotOpen(calendar, datesOpen) {
  if (calendar && datesOpen) {
    var allDays = Array.from(calendar.querySelectorAll('.dayTime')).map(function (el) {
      return el.dataset.humandate;
    });
    var openDays = datesOpen.map(function (el) {
      return el.day;
    });
    for (var i = 0; i < allDays.length; i++) {
      if (openDays.indexOf(allDays[i]) === -1) {
        var day = calendar.querySelector("[id=\"".concat(allDays[i], "\"]"));
        //  day.classList.add('widthShape', 'filler');
        day.style.backgroundColor = 'white';
        day.title = 'Closed on this day';
        var closed = document.createElement('p');
        closed.classList.add('calendarTime');
        closed.textContent = 'closed';
        day.appendChild(closed);
      }
    }
  }
}
function sortTimes(val) {
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
 * Checks for overlap in an array of values.
 *
 * @param {Array} values - The array of values to check for overlap.
 * @return {boolean} - Returns true if overlap is found, false otherwise.
 * @@description not called anywhere (yet)
 */
function checkOverlap(values) {
  var numericalEquivalent = values.map(timeValueInMill);
  for (var currentIndex = 2; currentIndex < numericalEquivalent.length; currentIndex += 2) {
    var currentStart = numericalEquivalent[currentIndex];
    var currentEnd = numericalEquivalent[currentIndex + 1];
    for (var comparisonIndex = 0; comparisonIndex < numericalEquivalent.length; comparisonIndex += 2) {
      if (currentIndex !== comparisonIndex) {
        var comparisonStart = numericalEquivalent[comparisonIndex];
        var comparisonEnd = numericalEquivalent[comparisonIndex + 1];
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

},{"./styles.js":7}],3:[function(require,module,exports){
var css = ".calendar {\n  display: flex;\n  flex-wrap: wrap;\n  flex-direction: row;\n  background-color: rgba(240, 248, 255, 0);\n  width: 100%;\n  height: 28.8em;\n  overflow-y: auto;\n  position: relative;\n  color: #333;\n  font-family: Ubuntu, Arial, Helvetica, sans-serif;\n  font-size: 1.2em;\n  font-weight: 700;\n  line-height: 1.5;\n}\n.calendar .blocked {\n  background-color: #333;\n}\n.calendar .filler {\n  pointer-events: none;\n  opacity: 0.3;\n}\n.calendar .preloaded {\n  border-color: blue;\n  border-style: solid;\n  border-width: 3px;\n}\n.calendar .timeSelect {\n  padding: 0;\n  width: auto;\n  margin: 0;\n  background-color: #fff;\n  float: right;\n  font-weight: 700;\n  font-family: Arial, Helvetica, sans-serif;\n  border-style: solid;\n  border-radius: 1em;\n  text-align: center;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  border-width: 3px;\n  border-color: #f15925;\n  color: #000;\n  font-size: 0.9em;\n}\n.calendar .timeCont {\n  margin-left: auto;\n  max-width: 20em;\n  background-color: aliceblue;\n  border-style: solid;\n  border-color: #f15925;\n  margin-right: auto;\n  margin-top: 10em;\n}\n.calendar .dayblockrow {\n  display: flex;\n  flex-direction: row;\n  min-width: 100%;\n  background-color: aliceblue;\n}\n.calendar .calendarTimeParent {\n  margin: 0.1em;\n}\n.calendar .calendarTimeParent .calendarTime {\n  font-size: 0.9em;\n  margin-top: 0em;\n  line-height: 1;\n  background-color: aliceblue;\n  color: black;\n  text-align: center;\n  margin: 0px;\n  font-size: 0.8em;\n}\n.calendar .widthShapeDays {\n  width: 14.2857142857%;\n  margin-left: auto;\n  margin-right: auto;\n  text-align: center;\n}\n.calendar .widthShape {\n  width: 14.2857142857%;\n  margin-left: auto;\n  margin-right: auto;\n  text-align: center;\n  min-height: 3.6em;\n  margin-bottom: 0.2em;\n}\n.calendar .monthName {\n  margin: auto;\n  text-align: center;\n  font-family: Ubuntu;\n  font-size: 1.61em;\n  background-color: #337ab7;\n  color: #ffcc33;\n  flex-basis: 100%;\n  border-bottom-style: solid;\n}\n.calendar .weekrow {\n  display: flex;\n  flex-wrap: nowrap;\n  flex-direction: row;\n  background-color: #fff;\n  font-family: \"roboto\", \"arial\";\n}\n.calendar .dayName {\n  color: black;\n  font-family: \"roboto\", \"arial\";\n  font-weight: 600;\n  background-color: #ccc;\n}\n.calendar .month > * {\n  margin-left: 2px;\n  margin-right: 2px;\n}\n.calendar .month {\n  width: 50%;\n  min-width: 300px;\n  margin: auto;\n}\n.calendar .timeChooser {\n  position: static;\n  background-color: aliceblue;\n  margin-left: auto;\n  margin-right: auto;\n}\n.calendar .timeContainer {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.calendar .timeContainer div {\n  display: flex;\n}\n.calendar .timeChooserModal {\n  z-index: 1;\n  width: 100%;\n  height: 100%;\n  background-color: rgba(0, 0, 0, 0.4);\n  position: absolute;\n  margin: 0;\n  padding: 0;\n  border: 0;\n  overflow-x: scroll;\n}\n.calendar .calendarLabel {\n  min-width: 3em;\n  padding: 0em 1em 0em 1em;\n  color: black;\n  font-family: \"roboto\", \"arial\";\n  font-weight: 600;\n  background-color: #ccc;\n  margin: 1em 0 1em 0;\n}\n.calendar .deleteDiv {\n  font-family: Ubuntu;\n  background-color: #337ab7;\n  color: #ffcc33;\n  border-bottom-style: solid;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.calendar .deleteButton {\n  background-color: white;\n  color: #f15925;\n  float: right;\n  font-weight: 700;\n  font-family: Arial, Helvetica, sans-serif;\n  border-style: solid;\n  border-radius: 2em;\n  text-align: center;\n  height: 2em;\n  width: 2em;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  margin: 0 0.5em;\n  font-size: 1.5em;\n}\n.calendar .innerSpanDeleteBtn {\n  text-align: center;\n}\n.calendar .deleteButton:hover,\n.calendar .deleteButton:focus,\n.calendar .timeSelect:hover,\n.calendar .timeSelect:focus {\n  color: #000;\n  text-decoration: none;\n  cursor: pointer;\n}\n.calendar .hour {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 10em;\n}\n.calendar .timeSelectP {\n  display: inline;\n  width: 5em;\n  color: #000;\n}\n.calendar .timeChooser > input[type=checkbox] {\n  outline: #f15925;\n  outline-style: solid;\n}\n.calendar .timeSelect > option {\n  color: #000;\n}\n.calendar .calendar > p,\n.calendar h4,\n.calendar h3,\n.calendar h2,\n.calendar h1,\n.calendar select,\n.calendar option {\n  color: #000;\n}\n.calendar .arrow-up {\n  width: 0;\n  height: 0;\n  border-left: 10px solid transparent;\n  border-right: 10px solid transparent;\n  border-bottom: 10px solid black;\n}\n.calendar .arrow-down {\n  width: 0;\n  height: 0;\n  border-left: 10px solid transparent;\n  border-right: 10px solid transparent;\n  border-top: 10px solid #000;\n}\n.calendar .arrows {\n  float: right;\n  clear: right;\n  position: relative;\n  cursor: pointer;\n  flex-direction: column;\n}\n.calendar .arrow-right {\n  width: 0;\n  height: 0;\n  border-top: 60px solid transparent;\n  border-bottom: 60px solid transparent;\n  border-left: 60px solid green;\n}\n.calendar .arrow-left {\n  width: 0;\n  height: 0;\n  border-top: 10px solid transparent;\n  border-bottom: 10px solid transparent;\n  border-right: 10px solid blue;\n}\n.calendar .dayTime {\n  cursor: pointer;\n}\n.calendar .dayTime > * {\n  pointer-events: none;\n}\n"; (require("browserify-css").createStyle(css, { "href": "preBundlingJS/calendarApp.css" }, { "insertAt": "bottom" })); module.exports = css;
},{"browserify-css":1}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SwiftCal = SwiftCal;
var _basicFunctions = require("./basicFunctions.js");
var _displayTimeChooserModal = require("./displayTimeChooserModal.js");
var _styles = require("./styles.js");
var _languages = require("./languages.js");
var _calendarApp = _interopRequireDefault(require("./calendarApp.css"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }
function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct.bind(); } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); } /**
                                                                                                                                                                                                                      * @typedef {Object} HasTestsTag
                                                                                                                                                                                                                      * @property {boolean} hasTests - Indicates whether the function has tests.
                                                                                                                                                                                                                      */ /**
                                                                                                                                                                                                                          * @typedef {Object} hasTheseStyles
                                                                                                                                                                                                                          * @property {string} hasTheseStyles - Lists styles references in a funtion
                                                                                                                                                                                                                          */
/**
 * Adds the specified number of months to a date.
 * @param {number} months - The number of months to add.
 * @returns {Date} - The updated date.
 */
Date.prototype.addMonths = function (months) {
  var date = new Date(this);
  var years = Math.floor(months / 12);
  var remainingMonths = months % 12;
  if (years) {
    date.setFullYear(date.getFullYear() + years);
  }
  if (remainingMonths) {
    date.setMonth(date.getMonth() + remainingMonths);
  }
  return date;
};
customElements.define('swift-cal', /*#__PURE__*/function (_HTMLElement) {
  _inherits(_class, _HTMLElement);
  var _super = _createSuper(_class);
  function _class() {
    var _this;
    _classCallCheck(this, _class);
    _this = _super.call(this);
    var self = _assertThisInitialized(_this);
    function stToBoolean(st) {
      if (st === 'true') {
        return true;
      }
      return false;
    }
    var calendar = new SwiftCal();
    calendar.generateCalendar({
      target: self,
      // data-number-of-months-to-display html converts to numberOfMonthsToDisplay JS
      numberOfMonthsToDisplay: _this.dataset.numberOfMonthsToDisplay,
      // data-display-time-chooser-modal
      displayTimeChooserModal: stToBoolean(_this.dataset.displayTimeChooserModal),
      // data-single-date-choice
      singleDateChoice: stToBoolean(_this.dataset.singleDateChoice),
      language: _this.dataset.language,
      //data-select-multiple
      selectMultiple: _this.dataset.selectMultiple,
      preloadedDates: _this.dataset.preloadedDates ? JSON.parse(_this.dataset.preloadedDates) : false,
      preloadedTooltip: _this.dataset.preloadedTooltip,
      blockDaysOfWeek: _this.dataset.blockDaysOfWeek ? JSON.parse(_this.dataset.blockDaysOfWeek) : false,
      // data-start-date="2019-01-01"
      startDate: _this.dataset.startDate
    });
    _this.dynamicData = calendar.returnDynamicData();
    return _this;
  }
  return _createClass(_class);
}( /*#__PURE__*/_wrapNativeSuper(HTMLElement)));
function SwiftCal() {
  var _this2 = this;
  var timeChooser;
  var config = {};
  var handler = {
    get: function get(target, key) {
      if (_typeof(target[key]) === 'object' && target[key] !== null) {
        return new Proxy(target[key], handler);
      }
      return target[key];
    },
    set: function set(target, prop, value) {
      target[prop] = value;
      emitDateSelectedEvent();
      return true;
    }
  };
  var dataTemplate = {
    datesSelectedArray: [],
    datesSelectedArrayObjects: [],
    disabled: false
  };
  var dynamicData = new Proxy(dataTemplate, handler);
  function emitDateSelectedEvent() {
    setTimeout(function () {
      var evt = new CustomEvent('dateSelect', {
        data: dynamicData
      });
      config.calendarContainer.dispatchEvent(evt);
    }, 250);
  }
  var calendar = document.createElement('div');
  this.returnCalendar = function () {
    return calendar;
  };
  this.returnDynamicData = function () {
    return dynamicData;
  };
  this.returnConfig = function () {
    return config;
  };
  this.setConfig = function (configObj) {
    // If called via HTML
    config.calendarContainer = configObj.target || false;
    // If called via Javascript
    config.parentDiv = typeof configObj.parentDiv === 'string' ? document.querySelector(configObj.parentDiv) : configObj.parentDiv;
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
  };
  this.generateCalendar = function (configObj) {
    if (configObj) {
      _this2.setConfig(configObj);
    }
    // If called via javascript a parentElement needs to be provided
    var parentDiv = config.parentDiv;
    /*
      If called from html as a custom component the component itself is passed (calendarContainer)
      If called via JS while the component isn't a webcomponent in the strictest sense, it still
      behaves like one and is encapsulated in a shadow.
    */
    if (config.calendarContainer) {
      shadowAttach(config.calendarContainer);
    } else {
      newContainer().then(function (container) {
        shadowAttach(container);
        config.calendarContainer = container;
      });
    }
    function newContainer() {
      var promise = new Promise(function (resolve) {
        var newCal = document.createElement('div');
        newCal.classList.add('swift-cal');
        parentDiv.appendChild(newCal);
        resolve(newCal);
      });
      return promise;
    }
    function shadowAttach(container) {
      var shadowRoot = container.attachShadow({
        mode: 'open'
      });
      var css = document.createElement('style');
      css.textContent = _calendarApp["default"];
      shadowRoot.appendChild(css);
      shadowRoot.appendChild(calendar);
    }
    var preloadedDates = config.preloadedDates;
    var numberOfMonthsToDisplay = config.numberOfMonthsToDisplay;
    var datesOpen = config.datesOpen;
    var language = config.language;
    var displayTimeChooserModal = config.displayTimeChooserModal;
    var blockWeekDays = config.blockDaysOfWeek;
    var bookWeekDays = config.bookDaysOfWeek;
    var startDate = config.startDate;
    var uniqueDayIndex = 0;
    // Calendar is defined globally within the constructor
    var calendarUniqueId = (0, _basicFunctions.generateRandomString)();
    calendar.id = "calendar-".concat(calendarUniqueId);
    calendar.classList.add('calendar');
    var months = [];
    var dateNow = new Date();
    // Repurposing getEarliestDate to format a date.
    var earliestDate = startDate ? (0, _basicFunctions.getEarliestDate)([startDate]) : dateNow;
    var startMonth = earliestDate.getMonth();
    var monthNames = _languages.languages[language].generalTime.months;
    /* Create month view */
    var _loop = function _loop() {
      /* Month specific variables and trackers */
      var yearCalc = earliestDate.addMonths(i).getFullYear();
      var monthCalc = (startMonth + i) % 12;
      var startDayOfMonth = new Date(yearCalc, monthCalc).getDay();
      var daysInMonth = (0, _basicFunctions.getDaysInMonth)((startMonth + i + 1) % 12, earliestDate.addMonths(i).getFullYear());
      var count = 1;
      var dayofweek = 0;

      /* Create month div */
      var month = document.createElement('div');
      months.push(month);
      month.style.width = '15em';
      month.style.backgroundColor = _styles.colours.monthBorderColor;
      month.classList.add('month');
      calendar.appendChild(month);

      /* Create month name div (month YYYY) at the top of month display */
      var monthName = document.createElement('div');
      monthName.classList.add('monthName');
      monthName.textContent = "".concat(monthNames[(startMonth + i) % 12], " ").concat(earliestDate.getFullYear());
      month.appendChild(monthName);

      /* Create div with named days of the week */
      var dayNames = document.createElement('div');
      month.appendChild(dayNames);
      dayNames.classList.add('weekrow');
      _languages.languages[language].generalTime.daysTruncated.forEach(function (dayName) {
        var day = document.createElement('div');
        day.textContent = dayName;
        day.classList.add('dayName', 'widthShapeDays');
        dayNames.appendChild(day);
      });

      /* Create week rows first week, it's reasigned f */
      var weekRow;
      // 42 days, i.e. 6 rows of 7
      for (var p = 0; p < 42; p++) {
        if (p === 0) {
          // made new week row
          weekRow = document.createElement('div');
          month.appendChild(weekRow);
          weekRow.classList.add('weekrow');
          dayofweek = 0;
        }
        if (p < startDayOfMonth) {
          var peghole = document.createElement('div');
          peghole.classList.add('widthShape', 'filler');
          (0, _styles.unselectedStyle)(peghole);
          weekRow.appendChild(peghole);
          dayofweek++;
        }
        if (p >= startDayOfMonth && p <= startDayOfMonth + daysInMonth - 1) {
          var _peghole = document.createElement('div');
          _peghole.textContent = count;
          _peghole.dataset.day = count;
          _peghole.dataset.dayofweek = dayofweek;
          _peghole.dataset.dayindex = uniqueDayIndex;
          _peghole.classList.add('widthShape', 'dayTime');
          _peghole.dataset.humandate = (0, _basicFunctions.humanDate)("".concat(yearCalc, "-").concat(monthCalc, "-").concat(count));
          // peghole.id = `${yearCalc}-${monthCalc}-${count}`;
          _peghole.addEventListener('click', function (e) {
            dateOnClickEvents(e);
          });
          weekRow.appendChild(_peghole);
          if (i === 0 && p >= startDayOfMonth && p < earliestDate.getDate() + startDayOfMonth) {
            _peghole.classList.add('filler');
          }
          count++;
          dayofweek++;
          uniqueDayIndex++;
        }
        if (p >= daysInMonth + startDayOfMonth) {
          var _peghole2 = document.createElement('div');
          _peghole2.classList.add('widthShape', 'filler');
          weekRow.appendChild(_peghole2);
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
        (0, _basicFunctions.blockDaysNotOpen)(calendar, datesOpen);
      }
    };
    for (var i = 0; i < numberOfMonthsToDisplay; i++) {
      _loop();
    }
    // Options:
    if (displayTimeChooserModal) {
      timeChooser = new _displayTimeChooserModal.GenerateTimeChooserModal(config, dynamicData, calendar);
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
  var clickCount = 1;
  var dateClickedThrice = {
    date: null,
    count: 1
  };
  function clikedThrice(date) {
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
  function dateOnClickEvents(e) {
    var dateDiv = e.target;
    clickCount++;
    if (dynamicData.disabled) {
      return;
    }
    if (config.selectRange) {
      range(dateDiv);
    }
    if (config.singleDateChoice) {
      (0, _basicFunctions.clearSelection)(calendar, dynamicData);
      bookDates([dateDiv]);
      timeChooserToggle();
    }
    function timeChooserToggle() {
      if (config.displayTimeChooserModal) {
        timeChooser.show();
        timeChooser.writeToDateDiv();
        timeChooser.writeToDynamicData();
      }
    }
    function range(dateDiv) {
      var lastDate = dateClickedThrice.date;
      var thrice = clikedThrice(dateDiv.dataset.humandate);
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
          (0, _basicFunctions.clearSelection)(calendar, dynamicData);
        }
        bookDates([dateDiv]);
        return;
      }
      if (priorWasSingle === false && clickCount % 2 === 1) {
        bookDates([dateDiv]);
        //timeChooserToggle();
        // rule to check if range is a longer than 1: 
        if (dateClickedThrice.date !== lastDate) {
          timeChooserToggle();
        }
        return;
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

  var priorWasSingle = false;
  function bookDates(arrayOfDateDivs, singleDate) {
    /**
     * Creates a new selection in the dynamicData object.
     * @return {object} An object containing the tracking array "newArray" and objects array.
     */

    function createNewSelection(priorWasSingle) {
      var parentAr = dynamicData.datesSelectedArray;
      var parentArObj = dynamicData.datesSelectedArrayObjects;
      var newArray, newObjectsArray;
      newArray = parentAr[parentAr.length - 1];
      if (!priorWasSingle && config.selectRange && newArray && newArray.length === 1) {
        newObjectsArray = parentArObj[parentArObj.length - 1];
        return {
          newArray: newArray,
          newObjectsArray: newObjectsArray
        };
      }
      newArray = [];
      newObjectsArray = [];
      parentAr.push(newArray);
      parentArObj.push(newObjectsArray);
      return {
        newArray: newArray,
        newObjectsArray: newObjectsArray
      };
    }

    // create new selections or retrieve the last selection: 
    var _createNewSelection = createNewSelection(priorWasSingle),
      newArray = _createNewSelection.newArray,
      newObjectsArray = _createNewSelection.newObjectsArray;
    for (var i = 0; i < arrayOfDateDivs.length; i++) {
      var dateDiv = arrayOfDateDivs[i];
      findDateSelection(dateDiv);
      bookDay(dateDiv);
    }
    // store win the previous selection was a range of length 1, read by "createNewSelection"
    priorWasSingle = singleDate ? true : false;

    // if the date is in a previous selection, that selection is spliced
    function findDateSelection(date) {
      // console.log(date);
      var store = dynamicData.datesSelectedArrayObjects;
      var _loop2 = function _loop2() {
        // the array in question
        var singleSelection = store[j];
        // data attr of html element
        var dateValue = date.dataset.humandate;
        var search = function search() {
          return singleSelection.find(function (dateStored) {
            return dateStored.humandate === dateValue;
          });
        };
        if (search()) {
          singleSelection.forEach(function (date) {
            // remove selection colour
            var dayDiv = calendar.querySelector("[data-humandate='".concat(date.humandate, "']"));
            (0, _styles.unselectedStyle)(dayDiv);
            // remove times, if any: 
            while (dayDiv.children.length > 0) {
              dayDiv.removeChild(dayDiv.lastChild);
            }
          });
          // remove from storage
          dynamicData.datesSelectedArrayObjects.splice(j, 1);
          dynamicData.datesSelectedArray.splice(j, 1);
        }
      };
      for (var j = 0; j < store.length; j++) {
        _loop2();
      }
    }
    if (config.selectRange) {
      var startDate = newObjectsArray[0];
      var startIndex = startDate.index;
      // if a single date is selected:
      var endDate = newObjectsArray[1] || startDate;
      var endIndex = endDate ? endDate.index : false;
      var _sort = [parseInt(startIndex), parseInt(endIndex)].sort(function (a, b) {
          return a - b;
        }),
        _sort2 = _slicedToArray(_sort, 2),
        low = _sort2[0],
        high = _sort2[1];
      for (var _i = low; _i <= high; _i++) {
        var _dateDiv = calendar.querySelector("[data-dayindex='".concat(_i, "']"));
        if (_dateDiv.classList.contains('blocked')) {
          (0, _styles.unselectedStyle)(calendar.querySelector("[id='".concat(endDate, "']")));
          newArray.splice(1, 1);
          newObjectsArray.splice(1, 1);
          break;
        }
        bookDay(_dateDiv);
      }
    }
    function bookDay(dateDiv) {
      if (config.singleDateChoice && newArray.length > 0) {
        (0, _basicFunctions.clearSelection)(calendar, dynamicData);
      }
      if (newArray.includes(dateDiv.dataset.humandate) === false) {
        (0, _styles.selectedStyle)(dateDiv);
        newArray.push(dateDiv.dataset.humandate);
        newObjectsArray[newArray.length - 1] = (0, _basicFunctions.standardDateObject)(dateDiv);
      }
    }
  }
  function bookDaysOfWeek(dayIndex) {
    var days = calendar.querySelectorAll("[data-dayofweek=\"".concat(dayIndex, "\"]"));
    days.forEach(function (day) {
      bookDates([day], true);
    });
  }
  function blockDaysOfWeek(dayIndexArray) {
    dayIndexArray.forEach(function (dayIndex) {
      var days = calendar.querySelectorAll("[data-dayofweek=\"".concat(dayIndex, "\"]"));
      days.forEach(function (day) {
        day.classList.add('filler');
      });
    });
  }
  function preloadDates(preloadedDates) {
    function getDivs(dates) {
      var dateDivs = [];
      var promise = new Promise(function (resolve) {
        dates.forEach(function (date, i) {
          var dateDiv = calendar.querySelector("[data-humandate='".concat(date, "']"));
          dateDivs.push(dateDiv);
          if (i === preloadedDates.length - 1) {
            blockNotPreloadedDates(dateDivs);
            resolve(dateDivs);
          }
        });
      });
      return promise;
    }
    function blockNotPreloadedDates(dateDivs) {
      var nonOptions = calendar.querySelectorAll('.dayTime');
      for (var index = 0; index < nonOptions.length; index++) {
        var day = nonOptions[index];
        if (!dateDivs.includes(day)) {
          day.classList.add('filler');
        } else {
          day.classList.add('preloaded');
          day.title = config.preloadedTooltip;
        }
      }
    }
    getDivs(preloadedDates);
    /*
      .then((dateDivs) => {
        // bookDates(dateDivs);
      });
    */
  }
}

},{"./basicFunctions.js":2,"./calendarApp.css":3,"./displayTimeChooserModal.js":5,"./languages.js":6,"./styles.js":7}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GenerateTimeChooserModal = GenerateTimeChooserModal;
var _languages = require("./languages.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
/**
 * Generates a time chooser modal for selecting time. Called in calendarGenerator.js
 *
 * @param {Object} config - The configuration object. 
 * @param {Object} dynamicData - The dynamic data object.
 * @param {HTMLElement} calendar - The calendar element.
 * @return {Function} The generated time chooser modal.
 */
function GenerateTimeChooserModal(config, dynamicData, calendar) {
  /**
   * A custom event emitted when a time is added or selected
   *
   * @return {void} This function does not return any value.
   */
  function emitTimeSelectedEvent() {
    setTimeout(function () {
      var evt = new CustomEvent('timeSelect', {
        data: dynamicData
      });
      config.calendarContainer.dispatchEvent(evt);
    }, 250);
  }
  var timeChooserModal;
  var selection = [];
  this.getSelectedTimes = function () {
    return selection;
  };
  this.generateModal = function () {
    return generateModal();
  };
  this.show = function () {
    calendar.style.overflow = 'hidden';
    return timeChooserModal.show();
  };
  this.writeToDateDiv = function () {
    writeToDateDiv();
  };
  this.writeToDynamicData = function () {
    writeToDynamicData();
  };

  /**
   * Generates a dialog for choosing time.
   *
   * @return {Promise} A promise that resolves to the generated time chooser modal.
   */
  function generateModal() {
    var promise = new Promise(function (resolve) {
      timeChooserModal = document.createElement('dialog');
      timeChooserModal.classList.add('timeChooserModal');
      calendar.appendChild(timeChooserModal);
      var timeCont = document.createElement('div');
      timeCont.classList.add('timeCont');
      timeChooserModal.appendChild(timeCont);
      var timeChooser = document.createElement('div');
      timeChooser.classList.add('timeChooser');
      timeCont.appendChild(timeChooser);
      var controlsDiv = document.createElement('div');
      controlsDiv.classList.add('deleteDiv');
      timeChooser.appendChild(controlsDiv);
      function closeFn() {
        calendar.style.overflow = 'scroll';
        timeChooserModal.close();
      }
      function innerComponents() {
        var timePickerContainer = document.createElement('div');
        timePickerContainer.classList.add('timePickerContainer');
        timeChooser.appendChild(timePickerContainer);
        var titleDiv = document.createElement('div');
        titleDiv.textContent = _languages.languages[config.language].timeWidget.addTime;
        titleDiv.classList.add('deleteDiv');
        timePickerContainer.appendChild(titleDiv);
        makeDropDowns(_languages.languages[config.language].timeWidget.start, timePickerContainer);
        makeDropDowns(_languages.languages[config.language].timeWidget.end, timePickerContainer);

        // setTimeForAllTickBox(timePickerContainer); 
      }

      makeButton(controlsDiv, 'deleteButton', '+', 'add time', 'click', innerComponents);
      makeButton(controlsDiv, 'deleteButton', '-', 'remove time', 'click', removeTimeValuesOnDate);
      makeButton(controlsDiv, 'deleteButton', 'x', 'close', 'click', closeFn);
      resolve(timeChooserModal);
    });
    return promise;
  }
  function writeToDateDiv() {
    if (config.displayTimeSelectionOnDate) {
      dynamicData.datesSelectedArray[dynamicData.datesSelectedArray.length - 1].forEach(function (daySelected) {
        write(daySelected);
      });
    }
  }
  function write(date) {
    // contains a time duration choice
    var calendarTimeParent;
    var dayDiv = calendar.querySelector("[data-humandate='".concat(date, "']"));
    while (dayDiv.children.length > 0) {
      dayDiv.removeChild(dayDiv.lastChild);
    }
    function createNewPara(text) {
      var time = document.createElement('p');
      calendarTimeParent.appendChild(time);
      time.classList.add('calendarTime');
      time.textContent = text;
    }
    selection.forEach(function (timeValue, i) {
      if (i === 0 || i % 2 === 0) {
        calendarTimeParent = document.createElement('div');
        calendarTimeParent.classList.add('calendarTimeParent');
        dayDiv.appendChild(calendarTimeParent);
      }
      var fieldName = Object.keys(timeValue)[0];
      createNewPara("".concat(fieldName, ":"));
      createNewPara("".concat(timeValue[fieldName].hh, ":").concat(timeValue[fieldName].mm));
    });
  }
  function makeButton(parent, className, textContent, hoverText, action, fn) {
    var button = document.createElement('div');
    button.classList.add(className);
    button.textContent = textContent;
    button.title = hoverText;
    button.addEventListener(action, function () {
      fn();
    });
    parent.appendChild(button);
  }
  function makeDropDowns(contextText, timePickerContainer) {
    // The time container
    var container = document.createElement('div');
    container.classList.add('timeContainer');
    container.dataset.context = contextText;
    timePickerContainer.appendChild(container);
    var timeForContext = _defineProperty({}, contextText, {});
    selection.push(timeForContext);

    // Make label
    var label = document.createElement('p');
    label.classList.add('timeSelectP');
    label.textContent = "".concat(contextText, ":");
    container.appendChild(label);

    // Make hour selector
    var timeSelectorDiv = document.createElement('div');
    timeSelectorDiv.dataset.context = contextText;
    container.appendChild(timeSelectorDiv);
    makeSelector('hh', 23, timeSelectorDiv, contextText, timePickerContainer, timeForContext);
    makeSelector('mm', 59, timeSelectorDiv, contextText, timePickerContainer, timeForContext);
  }
  function makeSelector(type, limit, timeSelectorDiv, contextText, timePickerContainer, timeForContext) {
    var dropDown = document.createElement('select');
    dropDown.classList.add(type, 'timeSelect');
    timeSelectorDiv.appendChild(dropDown);
    dropDown.dataset.type = type;
    dropDown.dataset.context = contextText;
    var placeholder = document.createElement('option');
    placeholder.textContent = type;
    placeholder.value = '00';

    // {"Start":{"hh":"00"}},{"Start":{"mm":"00"}}
    timeForContext[contextText][type] = placeholder.value;
    dropDown.appendChild(placeholder);
    var i = 0;
    while (i <= limit) {
      var hour = document.createElement('option');
      var text = i.toString();
      if (text.length === 1) {
        text = "0".concat(i);
      }
      hour.value = text;
      hour.textContent = text;
      dropDown.appendChild(hour);
      i++;
    }
    dropDown.addEventListener('change', function () {
      timeForContext[contextText][type] = dropDown.value;
      writeToDynamicData();
      writeToDateDiv();
      emitTimeSelectedEvent();
    });
  }
  function writeToDynamicData() {
    dynamicData.datesSelectedArrayObjects[dynamicData.datesSelectedArrayObjects.length - 1].forEach(function (daySelected) {
      var times = JSON.parse(JSON.stringify(selection));
      daySelected.times = times;
      var names = Object.keys(times);
      Object.values(times).forEach(function (time, i) {
        var val = Object.values(time);
        var hhmmss = Object.values(val[0]);
        daySelected.times[names[i]].UTC = humandateToUTC(daySelected.humandate, hhmmss);
      });
    });
  }
  function humandateToUTC(humandate, time) {
    var hh = time[0] ? time[0] : 0;
    var mm = time[1] ? time[1] : 0;
    var ss = time[2] ? time[2] : 0;
    var ints = humandate.split('-');
    ints = ints.map(function (_int) {
      return parseInt(_int);
    });
    ints[1] = ints[1] - 1;
    return Date.UTC(ints[0], ints[1], ints[2], hh, mm, ss);
  }
  function removeTimeValuesOnDate() {
    var d = dynamicData.datesSelectedArrayObjects;
    var lastChoice = d[d.length - 1];
    for (var i = 0; i < lastChoice.length; i++) {
      var dateObj = lastChoice[i];
      var dayDiv = calendar.querySelector("[data-humandate='".concat(dateObj.humandate, "']"));
      dayDiv.removeChild(dayDiv.lastChild);
      dateObj.times = dateObj.times.slice(0, -2);
    }
    selection = selection.slice(0, -2);
    var timeChooser = calendar.querySelector('.timeChooser');
    timeChooser.removeChild(timeChooser.lastChild);
  }

  /**
   * tickBoxes - description
   *
   * @param  {HTMLElement} timePickerElementsContainer This is the HTML element to which the checkbox will be appended.
   * @return {HTMLElement} Returns a HTML checkbox to select all days of a particular type (e.g. all Mondays).
   * @description NOT IMPLEMENTED
   */

  function setTimeForAllTickBox(targetDiv) {
    var day = dynamicData.datesSelectedArray[dynamicData.datesSelectedArray.length - 1];
    var dayCode = calendar.querySelector("[data-humandate='".concat(day, "']")).dataset.dayofweek;
    var text = formatDayText(dayCode);
    var labelfor = document.createElement('p');
    labelfor.textContent = text;
    labelfor.htmlFor = 'setTimeForAll';
    targetDiv.appendChild(labelfor);
    var setTimeForAll = document.createElement('input');
    setTimeForAll.setAttribute('type', 'checkbox');
    setTimeForAll.name = 'setTimeForAll';
    targetDiv.appendChild(setTimeForAll);
    setTimeForAll.addEventListener('click', function () {
      // Book dates method needs to be exposed in a manner it can be called from here
    });
  }

  /**
  * Formats the day of the week and returns it as a string.
  *
  * @param {string} textBefore - The text to be added before the formatted day.
  * @param {string} textAfter - The text to be added after the formatted day.
  * @param {number} dayOfWeek - The index of the day of the week (0 for Sunday, 1 for Monday, etc.).
  * @return {string} The formatted day of the week as a string.
  */
  function formatDayText(dayOfWeek) {
    var daysInFull = _languages.languages[config.language].generalTime.daysInFull;
    var beforeText = _languages.languages[config.language].formatDayText.textBefore;
    var formattedDay = daysInFull[dayOfWeek];
    var pluralism = _languages.languages[config.language].pluralism;
    var afterText = _languages.languages[config.language].formatDayText.textAfter;
    return "".concat(beforeText, " ").concat(formattedDay).concat(pluralism, " ").concat(afterText);
  }
}

},{"./languages.js":6}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.languages = void 0;
/*eslint quotes: ["error", "backtick"]*/
// Bacticks are enforcedf in this file so that special characters are correctly rendered.
/* Language defaults */
var enGb = {
  generalTime: {
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    daysInFull: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    daysTruncated: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  },
  pluralism: "s",
  formatDayText: {
    textBefore: "Set these times for all",
    textAfter: ""
  },
  timeWidget: {
    addTime: "Add time:",
    start: "Start",
    end: "End"
  }
};

/* Language defaults */
var ptPt = {
  generalTime: {
    months: ["Janeiro", "Fevereiro", "Mar\xE7o", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
    daysInFull: ["Domingo", "Segunda-Feira", "Ter\xE7a-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "S\xE1bado"],
    daysTruncated: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"]
  },
  pluralism: "s",
  formatDayText: {
    textBefore: "Applique estas horas a",
    textAfter: ""
  },
  timeWidget: {
    addTime: "Adicione dura\xE7\xE3o:",
    start: "In\xEDcio",
    end: "Fim"
  }
};
var languages = exports.languages = {
  enGb: enGb,
  ptPt: ptPt
};

},{}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unselectedStyle = exports.selectedStyle = exports.colours = void 0;
var colours = exports.colours = {
  monthColor: '#fc3',
  monthBackgoundBolor: '#6799cb',
  dayNameColor: '#000',
  dayNameBackgroundColor: '#ccc',
  dayColor: '#000',
  dayBackgroundColor: '#fff',
  monthBorderColor: '#f15925'
};
var selectedStyle = exports.selectedStyle = function selectedStyle(div) {
  div.style.backgroundColor = colours.monthColor;
};
var unselectedStyle = exports.unselectedStyle = function unselectedStyle(div) {
  div.style.backgroundColor = colours.dayBackgroundColor;
};

},{}]},{},[4])(4)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS1jc3MvYnJvd3Nlci5qcyIsInByZUJ1bmRsaW5nSlMvYmFzaWNGdW5jdGlvbnMuanMiLCJwcmVCdW5kbGluZ0pTL2NhbGVuZGFyQXBwLmNzcyIsInByZUJ1bmRsaW5nSlMvY2FsZW5kYXJHZW5lcmF0b3IuanMiLCJwcmVCdW5kbGluZ0pTL2Rpc3BsYXlUaW1lQ2hvb3Nlck1vZGFsLmpzIiwicHJlQnVuZGxpbmdKUy9sYW5ndWFnZXMuanMiLCJwcmVCdW5kbGluZ0pTL3N0eWxlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMzRUEsSUFBQSxPQUFBLEdBQUEsT0FBQTtBQUE4QyxTQUFBLGVBQUEsR0FBQSxFQUFBLENBQUEsV0FBQSxlQUFBLENBQUEsR0FBQSxLQUFBLHFCQUFBLENBQUEsR0FBQSxFQUFBLENBQUEsS0FBQSwyQkFBQSxDQUFBLEdBQUEsRUFBQSxDQUFBLEtBQUEsZ0JBQUE7QUFBQSxTQUFBLGlCQUFBLGNBQUEsU0FBQTtBQUFBLFNBQUEsNEJBQUEsQ0FBQSxFQUFBLE1BQUEsU0FBQSxDQUFBLHFCQUFBLENBQUEsc0JBQUEsaUJBQUEsQ0FBQSxDQUFBLEVBQUEsTUFBQSxPQUFBLENBQUEsR0FBQSxNQUFBLENBQUEsU0FBQSxDQUFBLFFBQUEsQ0FBQSxJQUFBLENBQUEsQ0FBQSxFQUFBLEtBQUEsYUFBQSxDQUFBLGlCQUFBLENBQUEsQ0FBQSxXQUFBLEVBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxXQUFBLENBQUEsSUFBQSxNQUFBLENBQUEsY0FBQSxDQUFBLG1CQUFBLEtBQUEsQ0FBQSxJQUFBLENBQUEsQ0FBQSxPQUFBLENBQUEsK0RBQUEsSUFBQSxDQUFBLENBQUEsVUFBQSxpQkFBQSxDQUFBLENBQUEsRUFBQSxNQUFBO0FBQUEsU0FBQSxrQkFBQSxHQUFBLEVBQUEsR0FBQSxRQUFBLEdBQUEsWUFBQSxHQUFBLEdBQUEsR0FBQSxDQUFBLE1BQUEsRUFBQSxHQUFBLEdBQUEsR0FBQSxDQUFBLE1BQUEsV0FBQSxDQUFBLE1BQUEsSUFBQSxPQUFBLEtBQUEsQ0FBQSxHQUFBLEdBQUEsQ0FBQSxHQUFBLEdBQUEsRUFBQSxDQUFBLElBQUEsSUFBQSxDQUFBLENBQUEsSUFBQSxHQUFBLENBQUEsQ0FBQSxVQUFBLElBQUE7QUFBQSxTQUFBLHNCQUFBLENBQUEsRUFBQSxDQUFBLFFBQUEsQ0FBQSxXQUFBLENBQUEsZ0NBQUEsTUFBQSxJQUFBLENBQUEsQ0FBQSxNQUFBLENBQUEsUUFBQSxLQUFBLENBQUEsNEJBQUEsQ0FBQSxRQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBLE9BQUEsQ0FBQSxPQUFBLENBQUEsaUJBQUEsQ0FBQSxJQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsSUFBQSxDQUFBLENBQUEsR0FBQSxJQUFBLFFBQUEsQ0FBQSxRQUFBLE1BQUEsQ0FBQSxDQUFBLE1BQUEsQ0FBQSxVQUFBLENBQUEsdUJBQUEsQ0FBQSxJQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsSUFBQSxDQUFBLENBQUEsR0FBQSxJQUFBLE1BQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxDQUFBLENBQUEsS0FBQSxHQUFBLENBQUEsQ0FBQSxNQUFBLEtBQUEsQ0FBQSxHQUFBLENBQUEsaUJBQUEsQ0FBQSxJQUFBLENBQUEsT0FBQSxDQUFBLEdBQUEsQ0FBQSx5QkFBQSxDQUFBLFlBQUEsQ0FBQSxlQUFBLENBQUEsR0FBQSxDQUFBLGNBQUEsTUFBQSxDQUFBLENBQUEsTUFBQSxDQUFBLDJCQUFBLENBQUEsUUFBQSxDQUFBLGFBQUEsQ0FBQTtBQUFBLFNBQUEsZ0JBQUEsR0FBQSxRQUFBLEtBQUEsQ0FBQSxPQUFBLENBQUEsR0FBQSxVQUFBLEdBQUE7QUFFOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyxTQUFTLENBQUUsSUFBSSxFQUFFO0VBQ3hCLElBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDO0VBQ2pDLElBQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO0VBQ3hDLElBQU0sR0FBRyxHQUFHLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDbEMsSUFBTSxhQUFhLEdBQUcsS0FBSyxHQUFHLEVBQUUsT0FBQSxNQUFBLENBQU8sS0FBSyxJQUFLLEtBQUs7RUFDdEQsSUFBTSxXQUFXLEdBQUcsR0FBRyxHQUFHLEVBQUUsT0FBQSxNQUFBLENBQU8sR0FBRyxJQUFLLEdBQUc7RUFDOUMsSUFBTSxZQUFZLE1BQUEsTUFBQSxDQUFNLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBQSxNQUFBLENBQUksYUFBYSxPQUFBLE1BQUEsQ0FBSSxXQUFXLENBQUU7RUFDdEUsT0FBTyxZQUFZO0FBQ3JCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVMsY0FBYyxDQUFFLFNBQVMsRUFBRTtFQUNsQyxJQUFJLElBQUksR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQztFQUMvQixJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFDLElBQUc7SUFBQSxPQUFLLFFBQVEsQ0FBQyxJQUFHLENBQUM7RUFBQSxFQUFDO0VBQ3ZDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztFQUNyQixPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDNUM7O0FBRUE7QUFDQSxJQUFNLGtCQUFrQixHQUFHO0VBQUUsR0FBRyxFQUFFLEtBQUs7RUFBRSxTQUFTLEVBQUUsWUFBWTtFQUFFLEtBQUssRUFBRSxHQUFHO0VBQUUsR0FBRyxFQUFFO0FBQWEsQ0FBQztBQUNqRztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLGtCQUFrQixDQUFFLElBQUksRUFBRTtFQUNqQyxJQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLGtCQUFrQixDQUFDO0VBQzdDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHO0VBQzFCLEdBQUcsQ0FBQyxTQUFTLEdBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTO0VBQ3ZDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRO0VBQ2pDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsY0FBYyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDO0VBQ2hELE9BQU8sR0FBRztBQUNaOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxTQUFTLGVBQWUsQ0FBRSxJQUFJLEVBQUU7RUFDOUIsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUU7SUFDdkIsSUFBTSxDQUFDLEdBQUcsSUFBSSxLQUFLLENBQUMsNkJBQTZCLENBQUM7SUFDbEQsTUFBTSxDQUFDO0VBQ1Q7RUFDQSxJQUFBLFdBQUEsR0FBeUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUM7SUFBQSxZQUFBLEdBQUEsY0FBQSxDQUFBLFdBQUE7SUFBakMsS0FBSyxHQUFBLFlBQUE7SUFBRSxPQUFPLEdBQUEsWUFBQTtFQUNyQixPQUFRLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLElBQUksR0FBSyxRQUFRLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxHQUFHLElBQUs7QUFDN0U7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLGNBQWMsQ0FBRSxLQUFLLEVBQUUsSUFBSSxFQUFFO0VBQ3BDLE9BQU8sSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUMzQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyxjQUFjLENBQUUsUUFBUSxFQUFFLFdBQVcsRUFBRTtFQUM5QyxJQUFNLGFBQWEsR0FBRyxXQUFXLENBQUMseUJBQXlCO0VBQzNELElBQU0sVUFBVSxHQUFHLFdBQVcsQ0FBQyxrQkFBa0I7RUFBQyxJQUFBLEtBQUEsWUFBQSxNQUFBLENBQUEsRUFFSDtJQUFBLElBQUEsTUFBQSxZQUFBLE9BQUEsQ0FBQSxFQUNEO01BQzFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFJLEVBQUs7UUFDOUIsSUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLGFBQWEscUJBQUEsTUFBQSxDQUFxQixJQUFJLE9BQUksQ0FBQztRQUNwRSxJQUFBLHVCQUFlLEVBQUMsT0FBTyxDQUFDO1FBQ3hCLE9BQU8sT0FBTyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1VBQ2xDLE9BQU8sQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQztRQUN4QztRQUNBLElBQUksQ0FBQyxLQUFLLGFBQWEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxVQUFVLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtVQUNqRSxhQUFhLENBQUMsTUFBTSxHQUFHLENBQUM7VUFDeEIsVUFBVSxDQUFDLE1BQU0sR0FBRyxDQUFDO1FBQ3ZCO01BQ0YsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQVpELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxVQUFVLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRTtNQUFBLE1BQUEsQ0FBQSxDQUFBO0lBQUE7RUFhNUMsQ0FBQztFQWRELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxhQUFhLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRTtJQUFBLEtBQUEsQ0FBQSxDQUFBO0VBQUE7QUFlL0M7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsU0FBUyxXQUFXLENBQUUsTUFBTSxFQUFFO0VBQzVCLElBQUksTUFBTSxHQUFHLEVBQUUsRUFBRTtJQUNmLElBQU0sQ0FBQyxHQUFHLElBQUksS0FBSyxDQUFDLGdEQUFnRCxDQUFDO0lBQ3JFLE1BQU0sQ0FBQztFQUNUO0VBQ0EsSUFBTSxLQUFLLEdBQUcsSUFBSSxXQUFXLENBQUMsR0FBRyxDQUFDO0VBQ2xDLE1BQU0sQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQztFQUNwQyxJQUFJLEVBQUUsR0FBRyxFQUFFO0VBQ1gsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDckMsRUFBRSxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDZCxJQUFJLENBQUMsS0FBSyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtNQUMxQixPQUFPLEVBQUUsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLE1BQU0sSUFBSSxNQUFNLElBQUksRUFBRSxDQUFDLENBQUM7SUFDN0M7RUFDRjtBQUNGO0FBRUEsU0FBUyxvQkFBb0IsQ0FBQSxFQUFHO0VBQzlCLElBQU0sWUFBWSxHQUFHLFdBQVcsQ0FBQyxFQUFFLENBQUM7RUFDcEMsSUFBSSxRQUFRLENBQUMsYUFBYSxDQUFDLFlBQVksR0FBRyxZQUFZLENBQUMsRUFBRTtJQUN2RCxPQUFPLG9CQUFvQixDQUFDLENBQUM7RUFDL0IsQ0FBQyxNQUFNO0lBQ0wsT0FBTyxZQUFZO0VBQ3JCO0FBQ0Y7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLGVBQWUsQ0FBRSxjQUFjLEVBQUU7RUFDeEMsSUFBTSxLQUFLLEdBQUcsRUFBRTtFQUNoQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsY0FBYyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtJQUM5QyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUU7TUFDWCxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBQ2xDO0lBQ0EsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBQ2pELElBQUksQ0FBQyxLQUFLLGNBQWMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO01BQ25DLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztNQUNaLElBQU0sQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztNQUM1QixPQUFPLENBQUM7SUFDVjtFQUNGO0FBQ0Y7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLGdCQUFnQixDQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUU7RUFDOUMsSUFBSSxRQUFRLElBQUksU0FBUyxFQUFFO0lBQ3pCLElBQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQUMsRUFBRSxFQUFLO01BQUUsT0FBTyxFQUFFLENBQUMsT0FBTyxDQUFDLFNBQVM7SUFBRSxDQUFDLENBQUM7SUFDL0csSUFBTSxRQUFRLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxVQUFDLEVBQUUsRUFBSztNQUFFLE9BQU8sRUFBRSxDQUFDLEdBQUc7SUFBRSxDQUFDLENBQUM7SUFFMUQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7TUFDdkMsSUFBSSxRQUFRLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFO1FBQ3ZDLElBQU0sR0FBRyxHQUFHLFFBQVEsQ0FBQyxhQUFhLFVBQUEsTUFBQSxDQUFTLE9BQU8sQ0FBQyxDQUFDLENBQUMsUUFBSSxDQUFDO1FBQzVEO1FBQ0UsR0FBRyxDQUFDLEtBQUssQ0FBQyxlQUFlLEdBQUcsT0FBTztRQUNuQyxHQUFHLENBQUMsS0FBSyxHQUFHLG9CQUFvQjtRQUVoQyxJQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQztRQUMxQyxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUM7UUFDcEMsTUFBTSxDQUFDLFdBQVcsR0FBRyxRQUFRO1FBRTdCLEdBQUcsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDO01BQ3pCO0lBQ0Y7RUFDRjtBQUNGO0FBR0EsU0FBUyxTQUFTLENBQUUsR0FBRyxFQUFFO0VBQ3ZCLElBQUksTUFBTSxHQUFHLEVBQUU7RUFDZixPQUFPLFNBQVMsQ0FBQyxHQUFHLENBQUM7RUFFckIsU0FBUyxVQUFVLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRTtJQUN4QixPQUFPLENBQUMsR0FBRyxDQUFDO0VBQ2Q7RUFFQSxTQUFTLFNBQVMsQ0FBQyxNQUFNLEVBQUU7SUFDekIsSUFBSSxtQkFBbUIsR0FBRyxFQUFFO0lBQzVCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO01BQ3RDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7TUFDcEQsSUFBSSxDQUFDLEtBQUssTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7UUFDM0IsT0FBTyxJQUFJLENBQUMsTUFBTSxFQUFFLG1CQUFtQixDQUFDO01BQzFDO0lBQ0Y7RUFDRjtFQUVBLFNBQVMsSUFBSSxDQUFDLE1BQU0sRUFBRSxtQkFBbUIsRUFBRTtJQUN6QyxJQUFJLHdCQUF3QixHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0lBQzlFLElBQUksU0FBUyxHQUFHLG1CQUFtQixDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7SUFDcEQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLHdCQUF3QixDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtNQUN4RCxJQUFJLFFBQVEsR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLHdCQUF3QixDQUFDLENBQUMsQ0FBQyxDQUFDO01BQzdELE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7TUFDckMsSUFBSSxDQUFDLEtBQUssbUJBQW1CLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtRQUN4QyxPQUFPLE1BQU07TUFDZjtJQUNGO0VBQ0Y7QUFDRjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVMsWUFBWSxDQUFFLE1BQU0sRUFBRTtFQUM3QixJQUFNLG1CQUFtQixHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDO0VBRXZELEtBQUssSUFBSSxZQUFZLEdBQUcsQ0FBQyxFQUFFLFlBQVksR0FBRyxtQkFBbUIsQ0FBQyxNQUFNLEVBQUUsWUFBWSxJQUFJLENBQUMsRUFBRTtJQUN2RixJQUFNLFlBQVksR0FBRyxtQkFBbUIsQ0FBQyxZQUFZLENBQUM7SUFDdEQsSUFBTSxVQUFVLEdBQUcsbUJBQW1CLENBQUMsWUFBWSxHQUFHLENBQUMsQ0FBQztJQUV4RCxLQUFLLElBQUksZUFBZSxHQUFHLENBQUMsRUFBRSxlQUFlLEdBQUcsbUJBQW1CLENBQUMsTUFBTSxFQUFFLGVBQWUsSUFBSSxDQUFDLEVBQUU7TUFDaEcsSUFBSSxZQUFZLEtBQUssZUFBZSxFQUFFO1FBQ3BDLElBQU0sZUFBZSxHQUFHLG1CQUFtQixDQUFDLGVBQWUsQ0FBQztRQUM1RCxJQUFNLGFBQWEsR0FBRyxtQkFBbUIsQ0FBQyxlQUFlLEdBQUcsQ0FBQyxDQUFDO1FBRTlELElBQUksYUFBYSxJQUFJLFlBQVksSUFBSSxhQUFhLElBQUksVUFBVSxFQUFFO1VBQ2hFLE9BQU8sSUFBSTtRQUNiLENBQUMsTUFBTSxJQUFJLFlBQVksSUFBSSxlQUFlLElBQUksVUFBVSxJQUFJLGFBQWEsRUFBRTtVQUN6RSxPQUFPLElBQUk7UUFDYixDQUFDLE1BQU0sSUFBSSxZQUFZLEtBQUssZUFBZSxJQUFJLFVBQVUsS0FBSyxhQUFhLEVBQUU7VUFDM0UsT0FBTyxJQUFJO1FBQ2IsQ0FBQyxNQUFNLElBQUksVUFBVSxJQUFJLGVBQWUsSUFBSSxVQUFVLElBQUksYUFBYSxFQUFFO1VBQ3ZFLE9BQU8sSUFBSTtRQUNiLENBQUMsTUFBTTtVQUNMLE9BQU8sS0FBSztRQUNkO01BQ0Y7SUFDRjtFQUNGO0VBQ0EsT0FBTyxLQUFLO0FBQ2Q7OztBQ25RQTs7Ozs7Ozs7QUNVQSxJQUFBLGVBQUEsR0FBQSxPQUFBO0FBS0EsSUFBQSx3QkFBQSxHQUFBLE9BQUE7QUFDQSxJQUFBLE9BQUEsR0FBQSxPQUFBO0FBQ0EsSUFBQSxVQUFBLEdBQUEsT0FBQTtBQUNBLElBQUEsWUFBQSxHQUFBLHNCQUFBLENBQUEsT0FBQTtBQUFzQyxTQUFBLHVCQUFBLEdBQUEsV0FBQSxHQUFBLElBQUEsR0FBQSxDQUFBLFVBQUEsR0FBQSxHQUFBLGdCQUFBLEdBQUE7QUFBQSxTQUFBLGVBQUEsR0FBQSxFQUFBLENBQUEsV0FBQSxlQUFBLENBQUEsR0FBQSxLQUFBLHFCQUFBLENBQUEsR0FBQSxFQUFBLENBQUEsS0FBQSwyQkFBQSxDQUFBLEdBQUEsRUFBQSxDQUFBLEtBQUEsZ0JBQUE7QUFBQSxTQUFBLGlCQUFBLGNBQUEsU0FBQTtBQUFBLFNBQUEsNEJBQUEsQ0FBQSxFQUFBLE1BQUEsU0FBQSxDQUFBLHFCQUFBLENBQUEsc0JBQUEsaUJBQUEsQ0FBQSxDQUFBLEVBQUEsTUFBQSxPQUFBLENBQUEsR0FBQSxNQUFBLENBQUEsU0FBQSxDQUFBLFFBQUEsQ0FBQSxJQUFBLENBQUEsQ0FBQSxFQUFBLEtBQUEsYUFBQSxDQUFBLGlCQUFBLENBQUEsQ0FBQSxXQUFBLEVBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxXQUFBLENBQUEsSUFBQSxNQUFBLENBQUEsY0FBQSxDQUFBLG1CQUFBLEtBQUEsQ0FBQSxJQUFBLENBQUEsQ0FBQSxPQUFBLENBQUEsK0RBQUEsSUFBQSxDQUFBLENBQUEsVUFBQSxpQkFBQSxDQUFBLENBQUEsRUFBQSxNQUFBO0FBQUEsU0FBQSxrQkFBQSxHQUFBLEVBQUEsR0FBQSxRQUFBLEdBQUEsWUFBQSxHQUFBLEdBQUEsR0FBQSxDQUFBLE1BQUEsRUFBQSxHQUFBLEdBQUEsR0FBQSxDQUFBLE1BQUEsV0FBQSxDQUFBLE1BQUEsSUFBQSxPQUFBLEtBQUEsQ0FBQSxHQUFBLEdBQUEsQ0FBQSxHQUFBLEdBQUEsRUFBQSxDQUFBLElBQUEsSUFBQSxDQUFBLENBQUEsSUFBQSxHQUFBLENBQUEsQ0FBQSxVQUFBLElBQUE7QUFBQSxTQUFBLHNCQUFBLENBQUEsRUFBQSxDQUFBLFFBQUEsQ0FBQSxXQUFBLENBQUEsZ0NBQUEsTUFBQSxJQUFBLENBQUEsQ0FBQSxNQUFBLENBQUEsUUFBQSxLQUFBLENBQUEsNEJBQUEsQ0FBQSxRQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBLE9BQUEsQ0FBQSxPQUFBLENBQUEsaUJBQUEsQ0FBQSxJQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsSUFBQSxDQUFBLENBQUEsR0FBQSxJQUFBLFFBQUEsQ0FBQSxRQUFBLE1BQUEsQ0FBQSxDQUFBLE1BQUEsQ0FBQSxVQUFBLENBQUEsdUJBQUEsQ0FBQSxJQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsSUFBQSxDQUFBLENBQUEsR0FBQSxJQUFBLE1BQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxDQUFBLENBQUEsS0FBQSxHQUFBLENBQUEsQ0FBQSxNQUFBLEtBQUEsQ0FBQSxHQUFBLENBQUEsaUJBQUEsQ0FBQSxJQUFBLENBQUEsT0FBQSxDQUFBLEdBQUEsQ0FBQSx5QkFBQSxDQUFBLFlBQUEsQ0FBQSxlQUFBLENBQUEsR0FBQSxDQUFBLGNBQUEsTUFBQSxDQUFBLENBQUEsTUFBQSxDQUFBLDJCQUFBLENBQUEsUUFBQSxDQUFBLGFBQUEsQ0FBQTtBQUFBLFNBQUEsZ0JBQUEsR0FBQSxRQUFBLEtBQUEsQ0FBQSxPQUFBLENBQUEsR0FBQSxVQUFBLEdBQUE7QUFBQSxTQUFBLFFBQUEsQ0FBQSxzQ0FBQSxPQUFBLHdCQUFBLE1BQUEsdUJBQUEsTUFBQSxDQUFBLFFBQUEsYUFBQSxDQUFBLGtCQUFBLENBQUEsZ0JBQUEsQ0FBQSxXQUFBLENBQUEseUJBQUEsTUFBQSxJQUFBLENBQUEsQ0FBQSxXQUFBLEtBQUEsTUFBQSxJQUFBLENBQUEsS0FBQSxNQUFBLENBQUEsU0FBQSxxQkFBQSxDQUFBLEtBQUEsT0FBQSxDQUFBLENBQUE7QUFBQSxTQUFBLGtCQUFBLE1BQUEsRUFBQSxLQUFBLGFBQUEsQ0FBQSxNQUFBLENBQUEsR0FBQSxLQUFBLENBQUEsTUFBQSxFQUFBLENBQUEsVUFBQSxVQUFBLEdBQUEsS0FBQSxDQUFBLENBQUEsR0FBQSxVQUFBLENBQUEsVUFBQSxHQUFBLFVBQUEsQ0FBQSxVQUFBLFdBQUEsVUFBQSxDQUFBLFlBQUEsd0JBQUEsVUFBQSxFQUFBLFVBQUEsQ0FBQSxRQUFBLFNBQUEsTUFBQSxDQUFBLGNBQUEsQ0FBQSxNQUFBLEVBQUEsY0FBQSxDQUFBLFVBQUEsQ0FBQSxHQUFBLEdBQUEsVUFBQTtBQUFBLFNBQUEsYUFBQSxXQUFBLEVBQUEsVUFBQSxFQUFBLFdBQUEsUUFBQSxVQUFBLEVBQUEsaUJBQUEsQ0FBQSxXQUFBLENBQUEsU0FBQSxFQUFBLFVBQUEsT0FBQSxXQUFBLEVBQUEsaUJBQUEsQ0FBQSxXQUFBLEVBQUEsV0FBQSxHQUFBLE1BQUEsQ0FBQSxjQUFBLENBQUEsV0FBQSxpQkFBQSxRQUFBLG1CQUFBLFdBQUE7QUFBQSxTQUFBLGVBQUEsR0FBQSxRQUFBLEdBQUEsR0FBQSxZQUFBLENBQUEsR0FBQSxvQkFBQSxPQUFBLENBQUEsR0FBQSxpQkFBQSxHQUFBLEdBQUEsTUFBQSxDQUFBLEdBQUE7QUFBQSxTQUFBLGFBQUEsS0FBQSxFQUFBLElBQUEsUUFBQSxPQUFBLENBQUEsS0FBQSxrQkFBQSxLQUFBLGtCQUFBLEtBQUEsTUFBQSxJQUFBLEdBQUEsS0FBQSxDQUFBLE1BQUEsQ0FBQSxXQUFBLE9BQUEsSUFBQSxLQUFBLFNBQUEsUUFBQSxHQUFBLEdBQUEsSUFBQSxDQUFBLElBQUEsQ0FBQSxLQUFBLEVBQUEsSUFBQSxvQkFBQSxPQUFBLENBQUEsR0FBQSx1QkFBQSxHQUFBLFlBQUEsU0FBQSw0REFBQSxJQUFBLGdCQUFBLE1BQUEsR0FBQSxNQUFBLEVBQUEsS0FBQTtBQUFBLFNBQUEsZ0JBQUEsUUFBQSxFQUFBLFdBQUEsVUFBQSxRQUFBLFlBQUEsV0FBQSxlQUFBLFNBQUE7QUFBQSxTQUFBLFVBQUEsUUFBQSxFQUFBLFVBQUEsZUFBQSxVQUFBLG1CQUFBLFVBQUEsdUJBQUEsU0FBQSwwREFBQSxRQUFBLENBQUEsU0FBQSxHQUFBLE1BQUEsQ0FBQSxNQUFBLENBQUEsVUFBQSxJQUFBLFVBQUEsQ0FBQSxTQUFBLElBQUEsV0FBQSxJQUFBLEtBQUEsRUFBQSxRQUFBLEVBQUEsUUFBQSxRQUFBLFlBQUEsYUFBQSxNQUFBLENBQUEsY0FBQSxDQUFBLFFBQUEsaUJBQUEsUUFBQSxnQkFBQSxVQUFBLEVBQUEsZUFBQSxDQUFBLFFBQUEsRUFBQSxVQUFBO0FBQUEsU0FBQSxhQUFBLE9BQUEsUUFBQSx5QkFBQSxHQUFBLHlCQUFBLG9CQUFBLHFCQUFBLFFBQUEsS0FBQSxHQUFBLGVBQUEsQ0FBQSxPQUFBLEdBQUEsTUFBQSxNQUFBLHlCQUFBLFFBQUEsU0FBQSxHQUFBLGVBQUEsT0FBQSxXQUFBLEVBQUEsTUFBQSxHQUFBLE9BQUEsQ0FBQSxTQUFBLENBQUEsS0FBQSxFQUFBLFNBQUEsRUFBQSxTQUFBLFlBQUEsTUFBQSxHQUFBLEtBQUEsQ0FBQSxLQUFBLE9BQUEsU0FBQSxZQUFBLDBCQUFBLE9BQUEsTUFBQTtBQUFBLFNBQUEsMkJBQUEsSUFBQSxFQUFBLElBQUEsUUFBQSxJQUFBLEtBQUEsT0FBQSxDQUFBLElBQUEseUJBQUEsSUFBQSwyQkFBQSxJQUFBLGFBQUEsSUFBQSx5QkFBQSxTQUFBLHVFQUFBLHNCQUFBLENBQUEsSUFBQTtBQUFBLFNBQUEsdUJBQUEsSUFBQSxRQUFBLElBQUEseUJBQUEsY0FBQSx3RUFBQSxJQUFBO0FBQUEsU0FBQSxpQkFBQSxLQUFBLFFBQUEsTUFBQSxVQUFBLEdBQUEsc0JBQUEsR0FBQSxLQUFBLFNBQUEsRUFBQSxnQkFBQSxZQUFBLGlCQUFBLEtBQUEsUUFBQSxLQUFBLGNBQUEsaUJBQUEsQ0FBQSxLQUFBLFVBQUEsS0FBQSxhQUFBLEtBQUEsNkJBQUEsU0FBQSxxRUFBQSxNQUFBLHdCQUFBLE1BQUEsQ0FBQSxHQUFBLENBQUEsS0FBQSxVQUFBLE1BQUEsQ0FBQSxHQUFBLENBQUEsS0FBQSxHQUFBLE1BQUEsQ0FBQSxHQUFBLENBQUEsS0FBQSxFQUFBLE9BQUEsY0FBQSxRQUFBLFdBQUEsVUFBQSxDQUFBLEtBQUEsRUFBQSxTQUFBLEVBQUEsZUFBQSxPQUFBLFdBQUEsS0FBQSxPQUFBLENBQUEsU0FBQSxHQUFBLE1BQUEsQ0FBQSxNQUFBLENBQUEsS0FBQSxDQUFBLFNBQUEsSUFBQSxXQUFBLElBQUEsS0FBQSxFQUFBLE9BQUEsRUFBQSxVQUFBLFNBQUEsUUFBQSxRQUFBLFlBQUEsb0JBQUEsZUFBQSxDQUFBLE9BQUEsRUFBQSxLQUFBLGFBQUEsZ0JBQUEsQ0FBQSxLQUFBO0FBQUEsU0FBQSxXQUFBLE1BQUEsRUFBQSxJQUFBLEVBQUEsS0FBQSxRQUFBLHlCQUFBLE1BQUEsVUFBQSxHQUFBLE9BQUEsQ0FBQSxTQUFBLENBQUEsSUFBQSxhQUFBLFVBQUEsWUFBQSxXQUFBLE1BQUEsRUFBQSxJQUFBLEVBQUEsS0FBQSxRQUFBLENBQUEsV0FBQSxDQUFBLENBQUEsSUFBQSxDQUFBLEtBQUEsQ0FBQSxDQUFBLEVBQUEsSUFBQSxPQUFBLFdBQUEsR0FBQSxRQUFBLENBQUEsSUFBQSxDQUFBLEtBQUEsQ0FBQSxNQUFBLEVBQUEsQ0FBQSxPQUFBLFFBQUEsT0FBQSxXQUFBLFFBQUEsS0FBQSxFQUFBLGVBQUEsQ0FBQSxRQUFBLEVBQUEsS0FBQSxDQUFBLFNBQUEsVUFBQSxRQUFBLGNBQUEsVUFBQSxDQUFBLEtBQUEsT0FBQSxTQUFBO0FBQUEsU0FBQSwwQkFBQSxlQUFBLE9BQUEscUJBQUEsT0FBQSxDQUFBLFNBQUEsb0JBQUEsT0FBQSxDQUFBLFNBQUEsQ0FBQSxJQUFBLDJCQUFBLEtBQUEsb0NBQUEsT0FBQSxDQUFBLFNBQUEsQ0FBQSxPQUFBLENBQUEsSUFBQSxDQUFBLE9BQUEsQ0FBQSxTQUFBLENBQUEsT0FBQSw4Q0FBQSxDQUFBO0FBQUEsU0FBQSxrQkFBQSxFQUFBLFdBQUEsUUFBQSxDQUFBLFFBQUEsQ0FBQSxJQUFBLENBQUEsRUFBQSxFQUFBLE9BQUE7QUFBQSxTQUFBLGdCQUFBLENBQUEsRUFBQSxDQUFBLElBQUEsZUFBQSxHQUFBLE1BQUEsQ0FBQSxjQUFBLEdBQUEsTUFBQSxDQUFBLGNBQUEsQ0FBQSxJQUFBLGNBQUEsZ0JBQUEsQ0FBQSxFQUFBLENBQUEsSUFBQSxDQUFBLENBQUEsU0FB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QUFNLElBQUksR0FBRztFQUNYLFdBQVcsRUFBRTtJQUNYLE1BQU0sRUFBRSxnSUFBNkg7SUFDckksVUFBVSxFQUFFLDBHQUFvRztJQUNoSCxhQUFhLEVBQUU7RUFDakIsQ0FBQztFQUNELFNBQVMsS0FBSztFQUNkLGFBQWEsRUFBRTtJQUNiLFVBQVUsMEJBQTBCO0lBQ3BDLFNBQVM7RUFDWCxDQUFDO0VBQ0QsVUFBVSxFQUFFO0lBQ1YsT0FBTywyQkFBcUI7SUFDNUIsS0FBSyxhQUFTO0lBQ2QsR0FBRztFQUNMO0FBRUYsQ0FBQztBQUVELElBQU0sU0FBUyxHQUFBLE9BQUEsQ0FBQSxTQUFBLEdBQUc7RUFBRSxJQUFJLEVBQUosSUFBSTtFQUFFLElBQUksRUFBSjtBQUFLLENBQUM7Ozs7Ozs7OztBQ3pDaEMsSUFBTSxPQUFPLEdBQUEsT0FBQSxDQUFBLE9BQUEsR0FBRztFQUNkLFVBQVUsRUFBRSxNQUFNO0VBQ2xCLG1CQUFtQixFQUFFLFNBQVM7RUFDOUIsWUFBWSxFQUFFLE1BQU07RUFDcEIsc0JBQXNCLEVBQUUsTUFBTTtFQUM5QixRQUFRLEVBQUUsTUFBTTtFQUNoQixrQkFBa0IsRUFBRSxNQUFNO0VBQzFCLGdCQUFnQixFQUFFO0FBQ3BCLENBQUM7QUFFRCxJQUFNLGFBQWEsR0FBQSxPQUFBLENBQUEsYUFBQSxHQUFHLFNBQWhCLGFBQWEsQ0FBSSxHQUFHLEVBQUs7RUFDN0IsR0FBRyxDQUFDLEtBQUssQ0FBQyxlQUFlLEdBQUcsT0FBTyxDQUFDLFVBQVU7QUFDaEQsQ0FBQztBQUVELElBQU0sZUFBZSxHQUFBLE9BQUEsQ0FBQSxlQUFBLEdBQUcsU0FBbEIsZUFBZSxDQUFJLEdBQUcsRUFBSztFQUMvQixHQUFHLENBQUMsS0FBSyxDQUFDLGVBQWUsR0FBRyxPQUFPLENBQUMsa0JBQWtCO0FBQ3hELENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIndXNlIHN0cmljdCc7XG4vLyBGb3IgbW9yZSBpbmZvcm1hdGlvbiBhYm91dCBicm93c2VyIGZpZWxkLCBjaGVjayBvdXQgdGhlIGJyb3dzZXIgZmllbGQgYXQgaHR0cHM6Ly9naXRodWIuY29tL3N1YnN0YWNrL2Jyb3dzZXJpZnktaGFuZGJvb2sjYnJvd3Nlci1maWVsZC5cblxudmFyIHN0eWxlRWxlbWVudHNJbnNlcnRlZEF0VG9wID0gW107XG5cbnZhciBpbnNlcnRTdHlsZUVsZW1lbnQgPSBmdW5jdGlvbihzdHlsZUVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICB2YXIgaGVhZCA9IGRvY3VtZW50LmhlYWQgfHwgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXTtcbiAgICB2YXIgbGFzdFN0eWxlRWxlbWVudEluc2VydGVkQXRUb3AgPSBzdHlsZUVsZW1lbnRzSW5zZXJ0ZWRBdFRvcFtzdHlsZUVsZW1lbnRzSW5zZXJ0ZWRBdFRvcC5sZW5ndGggLSAxXTtcblxuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgIG9wdGlvbnMuaW5zZXJ0QXQgPSBvcHRpb25zLmluc2VydEF0IHx8ICdib3R0b20nO1xuXG4gICAgaWYgKG9wdGlvbnMuaW5zZXJ0QXQgPT09ICd0b3AnKSB7XG4gICAgICAgIGlmICghbGFzdFN0eWxlRWxlbWVudEluc2VydGVkQXRUb3ApIHtcbiAgICAgICAgICAgIGhlYWQuaW5zZXJ0QmVmb3JlKHN0eWxlRWxlbWVudCwgaGVhZC5maXJzdENoaWxkKTtcbiAgICAgICAgfSBlbHNlIGlmIChsYXN0U3R5bGVFbGVtZW50SW5zZXJ0ZWRBdFRvcC5uZXh0U2libGluZykge1xuICAgICAgICAgICAgaGVhZC5pbnNlcnRCZWZvcmUoc3R5bGVFbGVtZW50LCBsYXN0U3R5bGVFbGVtZW50SW5zZXJ0ZWRBdFRvcC5uZXh0U2libGluZyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBoZWFkLmFwcGVuZENoaWxkKHN0eWxlRWxlbWVudCk7XG4gICAgICAgIH1cbiAgICAgICAgc3R5bGVFbGVtZW50c0luc2VydGVkQXRUb3AucHVzaChzdHlsZUVsZW1lbnQpO1xuICAgIH0gZWxzZSBpZiAob3B0aW9ucy5pbnNlcnRBdCA9PT0gJ2JvdHRvbScpIHtcbiAgICAgICAgaGVhZC5hcHBlbmRDaGlsZChzdHlsZUVsZW1lbnQpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCB2YWx1ZSBmb3IgcGFyYW1ldGVyIFxcJ2luc2VydEF0XFwnLiBNdXN0IGJlIFxcJ3RvcFxcJyBvciBcXCdib3R0b21cXCcuJyk7XG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgLy8gQ3JlYXRlIGEgPGxpbms+IHRhZyB3aXRoIG9wdGlvbmFsIGRhdGEgYXR0cmlidXRlc1xuICAgIGNyZWF0ZUxpbms6IGZ1bmN0aW9uKGhyZWYsIGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgdmFyIGhlYWQgPSBkb2N1bWVudC5oZWFkIHx8IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF07XG4gICAgICAgIHZhciBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGluaycpO1xuXG4gICAgICAgIGxpbmsuaHJlZiA9IGhyZWY7XG4gICAgICAgIGxpbmsucmVsID0gJ3N0eWxlc2hlZXQnO1xuXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBhdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgICBpZiAoICEgYXR0cmlidXRlcy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgdmFsdWUgPSBhdHRyaWJ1dGVzW2tleV07XG4gICAgICAgICAgICBsaW5rLnNldEF0dHJpYnV0ZSgnZGF0YS0nICsga2V5LCB2YWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBoZWFkLmFwcGVuZENoaWxkKGxpbmspO1xuICAgIH0sXG4gICAgLy8gQ3JlYXRlIGEgPHN0eWxlPiB0YWcgd2l0aCBvcHRpb25hbCBkYXRhIGF0dHJpYnV0ZXNcbiAgICBjcmVhdGVTdHlsZTogZnVuY3Rpb24oY3NzVGV4dCwgYXR0cmlidXRlcywgZXh0cmFPcHRpb25zKSB7XG4gICAgICAgIGV4dHJhT3B0aW9ucyA9IGV4dHJhT3B0aW9ucyB8fCB7fTtcblxuICAgICAgICB2YXIgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgICAgICBzdHlsZS50eXBlID0gJ3RleHQvY3NzJztcblxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gYXR0cmlidXRlcykge1xuICAgICAgICAgICAgaWYgKCAhIGF0dHJpYnV0ZXMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHZhbHVlID0gYXR0cmlidXRlc1trZXldO1xuICAgICAgICAgICAgc3R5bGUuc2V0QXR0cmlidXRlKCdkYXRhLScgKyBrZXksIHZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzdHlsZS5zaGVldCkgeyAvLyBmb3IganNkb20gYW5kIElFOStcbiAgICAgICAgICAgIHN0eWxlLmlubmVySFRNTCA9IGNzc1RleHQ7XG4gICAgICAgICAgICBzdHlsZS5zaGVldC5jc3NUZXh0ID0gY3NzVGV4dDtcbiAgICAgICAgICAgIGluc2VydFN0eWxlRWxlbWVudChzdHlsZSwgeyBpbnNlcnRBdDogZXh0cmFPcHRpb25zLmluc2VydEF0IH0pO1xuICAgICAgICB9IGVsc2UgaWYgKHN0eWxlLnN0eWxlU2hlZXQpIHsgLy8gZm9yIElFOCBhbmQgYmVsb3dcbiAgICAgICAgICAgIGluc2VydFN0eWxlRWxlbWVudChzdHlsZSwgeyBpbnNlcnRBdDogZXh0cmFPcHRpb25zLmluc2VydEF0IH0pO1xuICAgICAgICAgICAgc3R5bGUuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzVGV4dDtcbiAgICAgICAgfSBlbHNlIHsgLy8gZm9yIENocm9tZSwgRmlyZWZveCwgYW5kIFNhZmFyaVxuICAgICAgICAgICAgc3R5bGUuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzVGV4dCkpO1xuICAgICAgICAgICAgaW5zZXJ0U3R5bGVFbGVtZW50KHN0eWxlLCB7IGluc2VydEF0OiBleHRyYU9wdGlvbnMuaW5zZXJ0QXQgfSk7XG4gICAgICAgIH1cbiAgICB9XG59O1xuIiwiaW1wb3J0IHsgdW5zZWxlY3RlZFN0eWxlIH0gZnJvbSAnLi9zdHlsZXMuanMnO1xuXG4vKipcbiAqIEFkZHMgMSB0byB0aGUgbW9udGggaW4gYSBnaXZlbiBkYXRlIHRvIG1ha2UgaXQgbW9yZSBodW1hbi1yZWFkYWJsZS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBkYXRlIC0gVGhlIGRhdGUgaW4gdGhlIGZvcm1hdCAnWVlZWS1NTS1ERCcgb3IgJ1lZWVktTS1EJy5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IC0gVGhlIG1vZGlmaWVkIGRhdGUgaW4gdGhlIGZvcm1hdCAnWVlZWS1NTS1ERCcuXG4gKiBAdGhyb3dzIHtFcnJvcn0gLSBJZiB0aGUgZGF0ZSBwYXJhbWV0ZXIgaXMgbm90IGluIHRoZSBmb3JtYXQgJ1lZWVktTU0tREQnIG9yICdZWVlZLU0tRCcuXG4gKi9cbmZ1bmN0aW9uIGh1bWFuRGF0ZSAoZGF0ZSkge1xuICBjb25zdCBkYXRlUGFydHMgPSBkYXRlLnNwbGl0KCctJyk7XG4gIGNvbnN0IG1vbnRoID0gcGFyc2VJbnQoZGF0ZVBhcnRzWzFdKSArIDE7XG4gIGNvbnN0IGRheSA9IHBhcnNlSW50KGRhdGVQYXJ0c1syXSk7XG4gIGNvbnN0IG1vZGlmaWVkTW9udGggPSBtb250aCA8IDEwID8gYDAke21vbnRofWAgOiBtb250aDtcbiAgY29uc3QgbW9kaWZpZWREYXkgPSBkYXkgPCAxMCA/IGAwJHtkYXl9YCA6IGRheTtcbiAgY29uc3QgbW9kaWZpZWREYXRlID0gYCR7ZGF0ZVBhcnRzWzBdfS0ke21vZGlmaWVkTW9udGh9LSR7bW9kaWZpZWREYXl9YDtcbiAgcmV0dXJuIG1vZGlmaWVkRGF0ZTtcbn1cblxuLyoqXG4gKiBDb252ZXJ0cyBhIGh1bWFuIGRhdGUgc3RyaW5nIHRvIFVUQyB0aW1lc3RhbXAuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGh1bWFuZGF0ZSAtIFRoZSBodW1hbi1yZWFkYWJsZSBkYXRlIHN0cmluZyBpbiB0aGUgZm9ybWF0IFwiWVlZWS1NTS1ERFwiLlxuICogQHJldHVybiB7bnVtYmVyfSAtIFRoZSBVVEMgdGltZXN0YW1wIGluIG1pbGxpc2Vjb25kcy5cbiAqL1xuZnVuY3Rpb24gaHVtYW5kYXRlVG9VVEMgKGh1bWFuZGF0ZSkge1xuICBsZXQgaW50cyA9IGh1bWFuZGF0ZS5zcGxpdCgnLScpO1xuICBpbnRzID0gaW50cy5tYXAoKGludCkgPT4gcGFyc2VJbnQoaW50KSk7XG4gIGludHNbMV0gPSBpbnRzWzFdIC0gMTtcbiAgcmV0dXJuIERhdGUuVVRDKGludHNbMF0sIGludHNbMV0sIGludHNbMl0pO1xufVxuXG4vLyBtb2RlbCBvYmplY3RcbmNvbnN0IGRhdGVPYmplY3RUZW1wbGF0ZSA9IHsgZGF5OiAnZGF5JywgaHVtYW5kYXRlOiAnWVlZWS1NTS1ERCcsIGluZGV4OiAnMCcsIFVUQzogMTY5ODI3ODQwMDAwMH07XG4vKipcbiAqIENyZWF0ZXMgYSBzdGFuZGFyZCBkYXRlIG9iamVjdCB3aXRoIHRoZSBnaXZlbiBkYXRlLlxuICpcbiAqIEBwYXJhbSB7YW55fSBkYXRlIC0gSXMgYSBzdHJpbmcgWVlZWS1NTS1ERCBtb250aHMgYXJlIGNvdW50ZWQgZnJvbSAwLlxuICogQHJldHVybiB7b2JqZWN0fSBUaGUgc3RhbmRhcmQgZGF0ZSBvYmplY3Qgd2l0aCB0aGUgZ2l2ZW4gZGF0ZS5cbiAqL1xuZnVuY3Rpb24gc3RhbmRhcmREYXRlT2JqZWN0IChkYXRlKSB7XG4gIGNvbnN0IG9iaiA9IE9iamVjdC5jcmVhdGUoZGF0ZU9iamVjdFRlbXBsYXRlKTtcbiAgb2JqLmRheSA9IGRhdGUuZGF0YXNldC5kYXk7XG4gIG9iai5odW1hbmRhdGUgPSAgZGF0ZS5kYXRhc2V0Lmh1bWFuZGF0ZTtcbiAgb2JqLmluZGV4ID0gZGF0ZS5kYXRhc2V0LmRheWluZGV4O1xuICBvYmouVVRDID0gaHVtYW5kYXRlVG9VVEMoZGF0ZS5kYXRhc2V0Lmh1bWFuZGF0ZSk7XG4gIHJldHVybiBvYmo7XG59XG5cbi8qKlxuICogQ2FsY3VsYXRlcyB0aGUgdGltZSB2YWx1ZSBpbiBtaWxsaXNlY29uZHMgYmFzZWQgb24gdGhlIGdpdmVuIHRpbWUuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHRpbWUgLSBUaGUgdGltZSBpbiB0aGUgZm9ybWF0IFwiSEg6TU1cIi5cbiAqIEByZXR1cm4ge251bWJlcn0gVGhlIHRpbWUgdmFsdWUgaW4gbWlsbGlzZWNvbmRzLlxuICpcbiAqIEBoYXNUZXN0c1xuICpcbiAqIEBleGFtcGxlXG4gKiAvLyBFeGFtcGxlIHVzYWdlOlxuICogY29uc3QgdGltZVZhbHVlID0gdGltZVZhbHVlSW5NaWxsKCcxMjozMCcpO1xuICovXG5cbmZ1bmN0aW9uIHRpbWVWYWx1ZUluTWlsbCAodGltZSkge1xuICBpZiAoIXRpbWUuaW5jbHVkZXMoJzonKSkge1xuICAgIGNvbnN0IGUgPSBuZXcgRXJyb3IoJ0V4cGVjdHMgYSB0aW1lIHN0cmluZyBISDpNTScpO1xuICAgIHRocm93IGU7XG4gIH1cbiAgY29uc3QgW2hvdXJzLCBtaW51dGVzXSA9IHRpbWUuc3BsaXQoJzonKTtcbiAgcmV0dXJuIChwYXJzZUludChob3VycykgKiA2MCAqIDYwICogMTAwMCkgKyAocGFyc2VJbnQobWludXRlcykgKiA2MCAqIDEwMDApO1xufVxuXG4vKipcbiAqIGV0RGF5c0luTW9udGggLSBHZXQgbnVtYmVyIG9mIGRheXMgaW4gbW9udGhcbiAqXG4gKiBAcGFyYW0gIHshbnVtYmVyfSBtb250aCBUaGUgbnVtYmVyIG9mIHRoZSBjb3JyZXNwb25kaW5nIG1vbnRoLlxuICogQHBhcmFtICB7IW51bWJlcn0geWVhciAgVGhlIGNvcnJlc3BvbmRpbmcgeWVhci5cbiAqIEByZXR1cm4ge251bWJlcn0gUmV0dXJucyBhIG51bWJlciBjb3JyZXNwb25kaW5nIHRvIHRoZSBudW1iZXIgb2YgZGF5cyBmb3IgdGhlIGRhdGUgaW4gcG9pbnQuXG4gKi9cbmZ1bmN0aW9uIGdldERheXNJbk1vbnRoIChtb250aCwgeWVhcikge1xuICByZXR1cm4gbmV3IERhdGUoeWVhciwgbW9udGgsIDApLmdldERhdGUoKTtcbn1cblxuLyoqXG4gKiBDbGVhcnMgdGhlIHNlbGVjdGlvbiBpbiB0aGUgY2FsZW5kYXIgYnkgcmVtb3ZpbmcgdGhlIHNlbGVjdGVkIGRhdGVzIGFuZCBcbiAqIHJlc2V0dGluZyB0aGUgZHluYW1pYyBkYXRhLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBjYWxlbmRhciAtIFRoZSBjYWxlbmRhciBjb21wb25lbnQuXG4gKiBAcGFyYW0ge09iamVjdH0gZHluYW1pY0RhdGEgLSBUaGUgZHluYW1pYyBkYXRhIG9iamVjdC5cbiAqIEByZXR1cm4ge3VuZGVmaW5lZH0gVGhpcyBmdW5jdGlvbiBkb2VzIG5vdCByZXR1cm4gYSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gY2xlYXJTZWxlY3Rpb24gKGNhbGVuZGFyLCBkeW5hbWljRGF0YSkge1xuICBjb25zdCBkYXRlc09ialN0b3JlID0gZHluYW1pY0RhdGEuZGF0ZXNTZWxlY3RlZEFycmF5T2JqZWN0cztcbiAgY29uc3QgZGF0ZXNJbmRleCA9IGR5bmFtaWNEYXRhLmRhdGVzU2VsZWN0ZWRBcnJheTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGVzT2JqU3RvcmUubGVuZ3RoOyBpKyspIHtcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IGRhdGVzSW5kZXgubGVuZ3RoOyBqKyspIHtcbiAgICAgIGRhdGVzSW5kZXhbal0uZm9yRWFjaCgoZGF0ZSkgPT4ge1xuICAgICAgICBjb25zdCBkYXRlRGl2ID0gY2FsZW5kYXIucXVlcnlTZWxlY3RvcihgW2RhdGEtaHVtYW5kYXRlPScke2RhdGV9J11gKTtcbiAgICAgICAgdW5zZWxlY3RlZFN0eWxlKGRhdGVEaXYpO1xuICAgICAgICB3aGlsZSAoZGF0ZURpdi5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgZGF0ZURpdi5yZW1vdmVDaGlsZChkYXRlRGl2Lmxhc3RDaGlsZCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGkgPT09IGRhdGVzT2JqU3RvcmUubGVuZ3RoIC0gMSAmJiBqID09PSBkYXRlc0luZGV4Lmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICBkYXRlc09ialN0b3JlLmxlbmd0aCA9IDA7XG4gICAgICAgICAgZGF0ZXNJbmRleC5sZW5ndGggPSAwO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBAcGFyYW0ge251bWJlcn0gW2xlbmd0aD0xMF0gLWxlbmd0aCB0aGUgZGVzaXJlZCBsZW5ndGggb2YgdGhlIHN0cmluZyBvZiBudW1iZXJzLlxuICogQHJldHVybnMgYSBzdHJpbmcgb2YgcmFuZG9tIGRpZ2l0cyBvZiBhIHNwZWNpZmllZCBsZW5ndGguXG4gKi9cblxuZnVuY3Rpb24gcmFuZG9tQnl0ZXMgKGxlbmd0aCkge1xuICBpZiAobGVuZ3RoID4gODApIHtcbiAgICBjb25zdCBlID0gbmV3IEVycm9yKCdyYW5kb21CeXRlcyBsZW5ndGggY2FuIGJlIG1vcmUgdGhhbiA4MDAgZGlnaXRzJyk7XG4gICAgdGhyb3cgZTtcbiAgfVxuICBjb25zdCBhcnJheSA9IG5ldyBVaW50MzJBcnJheSgxMDApO1xuICB3aW5kb3cuY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhhcnJheSk7XG4gIGxldCBzdCA9ICcnO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgc3QgKz0gYXJyYXlbaV07XG4gICAgaWYgKGkgPT09IGFycmF5Lmxlbmd0aCAtIDEpIHtcbiAgICAgIHJldHVybiBzdC5zbGljZShzdC5sZW5ndGggLSAobGVuZ3RoIHx8IDEwKSk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGdlbmVyYXRlUmFuZG9tU3RyaW5nKCkge1xuICBjb25zdCByYW5kb21TdHJpbmcgPSByYW5kb21CeXRlcygxMCk7XG4gIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjY2FsZW5kYXItJyArIHJhbmRvbVN0cmluZykpIHtcbiAgICByZXR1cm4gZ2VuZXJhdGVSYW5kb21TdHJpbmcoKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gcmFuZG9tU3RyaW5nO1xuICB9XG59XG5cbi8vV0UgV0VSRSBTRVRUSU5HIFVQIFRIRSBDQUxFTkRBUiBUTyBSRU5ERVIgREFURVMgSU4gVEhFIFBBU1Q6XG4vKiBXYXJuaW5nOiBDb250ZW1wbGF0ZXMgZGF5bGlnaHQgc2F2aW5nIHRpbWUqL1xuXG4vKipcbiAqIENhbGN1bGF0ZXMgYW5kIHJldHVybnMgdGhlIGVhcmxpZXN0IGRhdGUgZnJvbSBhIGdpdmVuIGFycmF5IG9mIHByZWxvYWRlZCBkYXRlcy5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBwcmVsb2FkZWREYXRlcyAtIEFuIGFycmF5IG9mIHByZWxvYWRlZCBkYXRlcy5cbiAqIEByZXR1cm4ge0RhdGV9IFRoZSBlYXJsaWVzdCBkYXRlIGZyb20gdGhlIHByZWxvYWRlZCBkYXRlcy5cbiAqL1xuZnVuY3Rpb24gZ2V0RWFybGllc3REYXRlIChwcmVsb2FkZWREYXRlcykge1xuICBjb25zdCBvcmRlciA9IFtdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHByZWxvYWRlZERhdGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKGkgPT09IDApIHtcbiAgICAgIG9yZGVyLnB1c2gobmV3IERhdGUoKS5nZXRUaW1lKCkpO1xuICAgIH1cbiAgICBvcmRlci5wdXNoKG5ldyBEYXRlKHByZWxvYWRlZERhdGVzW2ldKS5nZXRUaW1lKCkpO1xuICAgIGlmIChpID09PSBwcmVsb2FkZWREYXRlcy5sZW5ndGggLSAxKSB7XG4gICAgICBvcmRlci5zb3J0KCk7XG4gICAgICBjb25zdCBkID0gbmV3IERhdGUob3JkZXJbMF0pO1xuICAgICAgcmV0dXJuIGQ7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogR2VuZXJhdGVzIGEgZnVuY3Rpb24gY29tbWVudCBmb3IgdGhlIGdpdmVuIGZ1bmN0aW9uIGJvZHkgaW4gYSBtYXJrZG93blxuICogY29kZSBibG9jayB3aXRoIHRoZSBjb3JyZWN0IGxhbmd1YWdlIHN5bnRheC5cbiAqXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBjYWxlbmRhciAtIFRoZSBjYWxlbmRhciBjb21wb25lbnQuXG4gKiBAcGFyYW0ge0FycmF5fSBkYXRlc09wZW4gLSBBbiBhcnJheSBvZiBvcGVuIGRhdGVzLlxuICovXG5mdW5jdGlvbiBibG9ja0RheXNOb3RPcGVuIChjYWxlbmRhciwgZGF0ZXNPcGVuKSB7XG4gIGlmIChjYWxlbmRhciAmJiBkYXRlc09wZW4pIHtcbiAgICBjb25zdCBhbGxEYXlzID0gQXJyYXkuZnJvbShjYWxlbmRhci5xdWVyeVNlbGVjdG9yQWxsKCcuZGF5VGltZScpKS5tYXAoKGVsKSA9PiB7IHJldHVybiBlbC5kYXRhc2V0Lmh1bWFuZGF0ZTsgfSk7XG4gICAgY29uc3Qgb3BlbkRheXMgPSBkYXRlc09wZW4ubWFwKChlbCkgPT4geyByZXR1cm4gZWwuZGF5OyB9KTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYWxsRGF5cy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKG9wZW5EYXlzLmluZGV4T2YoYWxsRGF5c1tpXSkgPT09IC0xKSB7XG4gICAgICAgIGNvbnN0IGRheSA9IGNhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoYFtpZD1cIiR7YWxsRGF5c1tpXX1cIl1gKTtcbiAgICAgIC8vICBkYXkuY2xhc3NMaXN0LmFkZCgnd2lkdGhTaGFwZScsICdmaWxsZXInKTtcbiAgICAgICAgZGF5LnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICd3aGl0ZSc7XG4gICAgICAgIGRheS50aXRsZSA9ICdDbG9zZWQgb24gdGhpcyBkYXknO1xuXG4gICAgICAgIGNvbnN0IGNsb3NlZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICAgICAgY2xvc2VkLmNsYXNzTGlzdC5hZGQoJ2NhbGVuZGFyVGltZScpO1xuICAgICAgICBjbG9zZWQudGV4dENvbnRlbnQgPSAnY2xvc2VkJztcblxuICAgICAgICBkYXkuYXBwZW5kQ2hpbGQoY2xvc2VkKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuXG5mdW5jdGlvbiBzb3J0VGltZXMgKHZhbCkge1xuICB2YXIgc29ydGVkID0gW107XG4gIHJldHVybiBlbnVtZXJhdGUodmFsKTtcblxuICBmdW5jdGlvbiBzb3J0TnVtYmVyKGEsIGIpIHtcbiAgICByZXR1cm4gYSAtIGI7XG4gIH1cblxuICBmdW5jdGlvbiBlbnVtZXJhdGUodmFsdWVzKSB7XG4gICAgdmFyIG51bWVyaWNhbEVxdWl2YWxlbnQgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZhbHVlcy5sZW5ndGg7IGkrKykge1xuICAgICAgbnVtZXJpY2FsRXF1aXZhbGVudC5wdXNoKHRpbWVWYWx1ZUluTWlsbCh2YWx1ZXNbaV0pKTtcbiAgICAgIGlmIChpID09PSB2YWx1ZXMubGVuZ3RoIC0gMSkge1xuICAgICAgICByZXR1cm4gc29ydCh2YWx1ZXMsIG51bWVyaWNhbEVxdWl2YWxlbnQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHNvcnQodmFsdWVzLCBudW1lcmljYWxFcXVpdmFsZW50KSB7XG4gICAgdmFyIG51bWVyaWNhbEVxdWl2YWxlbnRDbG9uZSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkobnVtZXJpY2FsRXF1aXZhbGVudCkpO1xuICAgIHZhciBzb3J0ZWRJbnQgPSBudW1lcmljYWxFcXVpdmFsZW50LnNvcnQoc29ydE51bWJlcik7XG4gICAgZm9yICh2YXIgcCA9IDA7IHAgPCBudW1lcmljYWxFcXVpdmFsZW50Q2xvbmUubGVuZ3RoOyBwKyspIHtcbiAgICAgIHZhciBuZXdJbmRleCA9IHNvcnRlZEludC5pbmRleE9mKG51bWVyaWNhbEVxdWl2YWxlbnRDbG9uZVtwXSk7XG4gICAgICBzb3J0ZWQuc3BsaWNlKHAsIDEsIHZhbHVlc1tuZXdJbmRleF0pO1xuICAgICAgaWYgKHAgPT09IG51bWVyaWNhbEVxdWl2YWxlbnQubGVuZ3RoIC0gMSkge1xuICAgICAgICByZXR1cm4gc29ydGVkO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIENoZWNrcyBmb3Igb3ZlcmxhcCBpbiBhbiBhcnJheSBvZiB2YWx1ZXMuXG4gKlxuICogQHBhcmFtIHtBcnJheX0gdmFsdWVzIC0gVGhlIGFycmF5IG9mIHZhbHVlcyB0byBjaGVjayBmb3Igb3ZlcmxhcC5cbiAqIEByZXR1cm4ge2Jvb2xlYW59IC0gUmV0dXJucyB0cnVlIGlmIG92ZXJsYXAgaXMgZm91bmQsIGZhbHNlIG90aGVyd2lzZS5cbiAqIEBAZGVzY3JpcHRpb24gbm90IGNhbGxlZCBhbnl3aGVyZSAoeWV0KVxuICovXG5mdW5jdGlvbiBjaGVja092ZXJsYXAgKHZhbHVlcykge1xuICBjb25zdCBudW1lcmljYWxFcXVpdmFsZW50ID0gdmFsdWVzLm1hcCh0aW1lVmFsdWVJbk1pbGwpO1xuXG4gIGZvciAobGV0IGN1cnJlbnRJbmRleCA9IDI7IGN1cnJlbnRJbmRleCA8IG51bWVyaWNhbEVxdWl2YWxlbnQubGVuZ3RoOyBjdXJyZW50SW5kZXggKz0gMikge1xuICAgIGNvbnN0IGN1cnJlbnRTdGFydCA9IG51bWVyaWNhbEVxdWl2YWxlbnRbY3VycmVudEluZGV4XTtcbiAgICBjb25zdCBjdXJyZW50RW5kID0gbnVtZXJpY2FsRXF1aXZhbGVudFtjdXJyZW50SW5kZXggKyAxXTtcblxuICAgIGZvciAobGV0IGNvbXBhcmlzb25JbmRleCA9IDA7IGNvbXBhcmlzb25JbmRleCA8IG51bWVyaWNhbEVxdWl2YWxlbnQubGVuZ3RoOyBjb21wYXJpc29uSW5kZXggKz0gMikge1xuICAgICAgaWYgKGN1cnJlbnRJbmRleCAhPT0gY29tcGFyaXNvbkluZGV4KSB7XG4gICAgICAgIGNvbnN0IGNvbXBhcmlzb25TdGFydCA9IG51bWVyaWNhbEVxdWl2YWxlbnRbY29tcGFyaXNvbkluZGV4XTtcbiAgICAgICAgY29uc3QgY29tcGFyaXNvbkVuZCA9IG51bWVyaWNhbEVxdWl2YWxlbnRbY29tcGFyaXNvbkluZGV4ICsgMV07XG5cbiAgICAgICAgaWYgKGNvbXBhcmlzb25FbmQgPj0gY3VycmVudFN0YXJ0ICYmIGNvbXBhcmlzb25FbmQgPD0gY3VycmVudEVuZCkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGVsc2UgaWYgKGN1cnJlbnRTdGFydCA+PSBjb21wYXJpc29uU3RhcnQgJiYgY3VycmVudEVuZCA8PSBjb21wYXJpc29uRW5kKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gZWxzZSBpZiAoY3VycmVudFN0YXJ0ID09PSBjb21wYXJpc29uU3RhcnQgJiYgY3VycmVudEVuZCA9PT0gY29tcGFyaXNvbkVuZCkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGVsc2UgaWYgKGN1cnJlbnRFbmQgPj0gY29tcGFyaXNvblN0YXJ0ICYmIGN1cnJlbnRFbmQgPD0gY29tcGFyaXNvbkVuZCkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbmV4cG9ydCB7IHRpbWVWYWx1ZUluTWlsbCwgY2hlY2tPdmVybGFwLCBjbGVhclNlbGVjdGlvbiwgZ2V0RGF5c0luTW9udGgsIFxuICBnZW5lcmF0ZVJhbmRvbVN0cmluZywgZ2V0RWFybGllc3REYXRlLCBibG9ja0RheXNOb3RPcGVuLCBcbiAgc29ydFRpbWVzLCBodW1hbkRhdGUsIGh1bWFuZGF0ZVRvVVRDLCBzdGFuZGFyZERhdGVPYmplY3QgfTtcbiIsInZhciBjc3MgPSBcIi5jYWxlbmRhciB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZmxleC13cmFwOiB3cmFwO1xcbiAgZmxleC1kaXJlY3Rpb246IHJvdztcXG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjQwLCAyNDgsIDI1NSwgMCk7XFxuICB3aWR0aDogMTAwJTtcXG4gIGhlaWdodDogMjguOGVtO1xcbiAgb3ZlcmZsb3cteTogYXV0bztcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gIGNvbG9yOiAjMzMzO1xcbiAgZm9udC1mYW1pbHk6IFVidW50dSwgQXJpYWwsIEhlbHZldGljYSwgc2Fucy1zZXJpZjtcXG4gIGZvbnQtc2l6ZTogMS4yZW07XFxuICBmb250LXdlaWdodDogNzAwO1xcbiAgbGluZS1oZWlnaHQ6IDEuNTtcXG59XFxuLmNhbGVuZGFyIC5ibG9ja2VkIHtcXG4gIGJhY2tncm91bmQtY29sb3I6ICMzMzM7XFxufVxcbi5jYWxlbmRhciAuZmlsbGVyIHtcXG4gIHBvaW50ZXItZXZlbnRzOiBub25lO1xcbiAgb3BhY2l0eTogMC4zO1xcbn1cXG4uY2FsZW5kYXIgLnByZWxvYWRlZCB7XFxuICBib3JkZXItY29sb3I6IGJsdWU7XFxuICBib3JkZXItc3R5bGU6IHNvbGlkO1xcbiAgYm9yZGVyLXdpZHRoOiAzcHg7XFxufVxcbi5jYWxlbmRhciAudGltZVNlbGVjdCB7XFxuICBwYWRkaW5nOiAwO1xcbiAgd2lkdGg6IGF1dG87XFxuICBtYXJnaW46IDA7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmO1xcbiAgZmxvYXQ6IHJpZ2h0O1xcbiAgZm9udC13ZWlnaHQ6IDcwMDtcXG4gIGZvbnQtZmFtaWx5OiBBcmlhbCwgSGVsdmV0aWNhLCBzYW5zLXNlcmlmO1xcbiAgYm9yZGVyLXN0eWxlOiBzb2xpZDtcXG4gIGJvcmRlci1yYWRpdXM6IDFlbTtcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuICBib3JkZXItd2lkdGg6IDNweDtcXG4gIGJvcmRlci1jb2xvcjogI2YxNTkyNTtcXG4gIGNvbG9yOiAjMDAwO1xcbiAgZm9udC1zaXplOiAwLjllbTtcXG59XFxuLmNhbGVuZGFyIC50aW1lQ29udCB7XFxuICBtYXJnaW4tbGVmdDogYXV0bztcXG4gIG1heC13aWR0aDogMjBlbTtcXG4gIGJhY2tncm91bmQtY29sb3I6IGFsaWNlYmx1ZTtcXG4gIGJvcmRlci1zdHlsZTogc29saWQ7XFxuICBib3JkZXItY29sb3I6ICNmMTU5MjU7XFxuICBtYXJnaW4tcmlnaHQ6IGF1dG87XFxuICBtYXJnaW4tdG9wOiAxMGVtO1xcbn1cXG4uY2FsZW5kYXIgLmRheWJsb2Nrcm93IHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBmbGV4LWRpcmVjdGlvbjogcm93O1xcbiAgbWluLXdpZHRoOiAxMDAlO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogYWxpY2VibHVlO1xcbn1cXG4uY2FsZW5kYXIgLmNhbGVuZGFyVGltZVBhcmVudCB7XFxuICBtYXJnaW46IDAuMWVtO1xcbn1cXG4uY2FsZW5kYXIgLmNhbGVuZGFyVGltZVBhcmVudCAuY2FsZW5kYXJUaW1lIHtcXG4gIGZvbnQtc2l6ZTogMC45ZW07XFxuICBtYXJnaW4tdG9wOiAwZW07XFxuICBsaW5lLWhlaWdodDogMTtcXG4gIGJhY2tncm91bmQtY29sb3I6IGFsaWNlYmx1ZTtcXG4gIGNvbG9yOiBibGFjaztcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gIG1hcmdpbjogMHB4O1xcbiAgZm9udC1zaXplOiAwLjhlbTtcXG59XFxuLmNhbGVuZGFyIC53aWR0aFNoYXBlRGF5cyB7XFxuICB3aWR0aDogMTQuMjg1NzE0Mjg1NyU7XFxuICBtYXJnaW4tbGVmdDogYXV0bztcXG4gIG1hcmdpbi1yaWdodDogYXV0bztcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG59XFxuLmNhbGVuZGFyIC53aWR0aFNoYXBlIHtcXG4gIHdpZHRoOiAxNC4yODU3MTQyODU3JTtcXG4gIG1hcmdpbi1sZWZ0OiBhdXRvO1xcbiAgbWFyZ2luLXJpZ2h0OiBhdXRvO1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgbWluLWhlaWdodDogMy42ZW07XFxuICBtYXJnaW4tYm90dG9tOiAwLjJlbTtcXG59XFxuLmNhbGVuZGFyIC5tb250aE5hbWUge1xcbiAgbWFyZ2luOiBhdXRvO1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgZm9udC1mYW1pbHk6IFVidW50dTtcXG4gIGZvbnQtc2l6ZTogMS42MWVtO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogIzMzN2FiNztcXG4gIGNvbG9yOiAjZmZjYzMzO1xcbiAgZmxleC1iYXNpczogMTAwJTtcXG4gIGJvcmRlci1ib3R0b20tc3R5bGU6IHNvbGlkO1xcbn1cXG4uY2FsZW5kYXIgLndlZWtyb3cge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGZsZXgtd3JhcDogbm93cmFwO1xcbiAgZmxleC1kaXJlY3Rpb246IHJvdztcXG4gIGJhY2tncm91bmQtY29sb3I6ICNmZmY7XFxuICBmb250LWZhbWlseTogXFxcInJvYm90b1xcXCIsIFxcXCJhcmlhbFxcXCI7XFxufVxcbi5jYWxlbmRhciAuZGF5TmFtZSB7XFxuICBjb2xvcjogYmxhY2s7XFxuICBmb250LWZhbWlseTogXFxcInJvYm90b1xcXCIsIFxcXCJhcmlhbFxcXCI7XFxuICBmb250LXdlaWdodDogNjAwO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogI2NjYztcXG59XFxuLmNhbGVuZGFyIC5tb250aCA+ICoge1xcbiAgbWFyZ2luLWxlZnQ6IDJweDtcXG4gIG1hcmdpbi1yaWdodDogMnB4O1xcbn1cXG4uY2FsZW5kYXIgLm1vbnRoIHtcXG4gIHdpZHRoOiA1MCU7XFxuICBtaW4td2lkdGg6IDMwMHB4O1xcbiAgbWFyZ2luOiBhdXRvO1xcbn1cXG4uY2FsZW5kYXIgLnRpbWVDaG9vc2VyIHtcXG4gIHBvc2l0aW9uOiBzdGF0aWM7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiBhbGljZWJsdWU7XFxuICBtYXJnaW4tbGVmdDogYXV0bztcXG4gIG1hcmdpbi1yaWdodDogYXV0bztcXG59XFxuLmNhbGVuZGFyIC50aW1lQ29udGFpbmVyIHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxufVxcbi5jYWxlbmRhciAudGltZUNvbnRhaW5lciBkaXYge1xcbiAgZGlzcGxheTogZmxleDtcXG59XFxuLmNhbGVuZGFyIC50aW1lQ2hvb3Nlck1vZGFsIHtcXG4gIHotaW5kZXg6IDE7XFxuICB3aWR0aDogMTAwJTtcXG4gIGhlaWdodDogMTAwJTtcXG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMCwgMCwgMC40KTtcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIG1hcmdpbjogMDtcXG4gIHBhZGRpbmc6IDA7XFxuICBib3JkZXI6IDA7XFxuICBvdmVyZmxvdy14OiBzY3JvbGw7XFxufVxcbi5jYWxlbmRhciAuY2FsZW5kYXJMYWJlbCB7XFxuICBtaW4td2lkdGg6IDNlbTtcXG4gIHBhZGRpbmc6IDBlbSAxZW0gMGVtIDFlbTtcXG4gIGNvbG9yOiBibGFjaztcXG4gIGZvbnQtZmFtaWx5OiBcXFwicm9ib3RvXFxcIiwgXFxcImFyaWFsXFxcIjtcXG4gIGZvbnQtd2VpZ2h0OiA2MDA7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjY2NjO1xcbiAgbWFyZ2luOiAxZW0gMCAxZW0gMDtcXG59XFxuLmNhbGVuZGFyIC5kZWxldGVEaXYge1xcbiAgZm9udC1mYW1pbHk6IFVidW50dTtcXG4gIGJhY2tncm91bmQtY29sb3I6ICMzMzdhYjc7XFxuICBjb2xvcjogI2ZmY2MzMztcXG4gIGJvcmRlci1ib3R0b20tc3R5bGU6IHNvbGlkO1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG59XFxuLmNhbGVuZGFyIC5kZWxldGVCdXR0b24ge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogd2hpdGU7XFxuICBjb2xvcjogI2YxNTkyNTtcXG4gIGZsb2F0OiByaWdodDtcXG4gIGZvbnQtd2VpZ2h0OiA3MDA7XFxuICBmb250LWZhbWlseTogQXJpYWwsIEhlbHZldGljYSwgc2Fucy1zZXJpZjtcXG4gIGJvcmRlci1zdHlsZTogc29saWQ7XFxuICBib3JkZXItcmFkaXVzOiAyZW07XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICBoZWlnaHQ6IDJlbTtcXG4gIHdpZHRoOiAyZW07XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgbWFyZ2luOiAwIDAuNWVtO1xcbiAgZm9udC1zaXplOiAxLjVlbTtcXG59XFxuLmNhbGVuZGFyIC5pbm5lclNwYW5EZWxldGVCdG4ge1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbn1cXG4uY2FsZW5kYXIgLmRlbGV0ZUJ1dHRvbjpob3ZlcixcXG4uY2FsZW5kYXIgLmRlbGV0ZUJ1dHRvbjpmb2N1cyxcXG4uY2FsZW5kYXIgLnRpbWVTZWxlY3Q6aG92ZXIsXFxuLmNhbGVuZGFyIC50aW1lU2VsZWN0OmZvY3VzIHtcXG4gIGNvbG9yOiAjMDAwO1xcbiAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xcbiAgY3Vyc29yOiBwb2ludGVyO1xcbn1cXG4uY2FsZW5kYXIgLmhvdXIge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gIHdpZHRoOiAxMGVtO1xcbn1cXG4uY2FsZW5kYXIgLnRpbWVTZWxlY3RQIHtcXG4gIGRpc3BsYXk6IGlubGluZTtcXG4gIHdpZHRoOiA1ZW07XFxuICBjb2xvcjogIzAwMDtcXG59XFxuLmNhbGVuZGFyIC50aW1lQ2hvb3NlciA+IGlucHV0W3R5cGU9Y2hlY2tib3hdIHtcXG4gIG91dGxpbmU6ICNmMTU5MjU7XFxuICBvdXRsaW5lLXN0eWxlOiBzb2xpZDtcXG59XFxuLmNhbGVuZGFyIC50aW1lU2VsZWN0ID4gb3B0aW9uIHtcXG4gIGNvbG9yOiAjMDAwO1xcbn1cXG4uY2FsZW5kYXIgLmNhbGVuZGFyID4gcCxcXG4uY2FsZW5kYXIgaDQsXFxuLmNhbGVuZGFyIGgzLFxcbi5jYWxlbmRhciBoMixcXG4uY2FsZW5kYXIgaDEsXFxuLmNhbGVuZGFyIHNlbGVjdCxcXG4uY2FsZW5kYXIgb3B0aW9uIHtcXG4gIGNvbG9yOiAjMDAwO1xcbn1cXG4uY2FsZW5kYXIgLmFycm93LXVwIHtcXG4gIHdpZHRoOiAwO1xcbiAgaGVpZ2h0OiAwO1xcbiAgYm9yZGVyLWxlZnQ6IDEwcHggc29saWQgdHJhbnNwYXJlbnQ7XFxuICBib3JkZXItcmlnaHQ6IDEwcHggc29saWQgdHJhbnNwYXJlbnQ7XFxuICBib3JkZXItYm90dG9tOiAxMHB4IHNvbGlkIGJsYWNrO1xcbn1cXG4uY2FsZW5kYXIgLmFycm93LWRvd24ge1xcbiAgd2lkdGg6IDA7XFxuICBoZWlnaHQ6IDA7XFxuICBib3JkZXItbGVmdDogMTBweCBzb2xpZCB0cmFuc3BhcmVudDtcXG4gIGJvcmRlci1yaWdodDogMTBweCBzb2xpZCB0cmFuc3BhcmVudDtcXG4gIGJvcmRlci10b3A6IDEwcHggc29saWQgIzAwMDtcXG59XFxuLmNhbGVuZGFyIC5hcnJvd3Mge1xcbiAgZmxvYXQ6IHJpZ2h0O1xcbiAgY2xlYXI6IHJpZ2h0O1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgY3Vyc29yOiBwb2ludGVyO1xcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG59XFxuLmNhbGVuZGFyIC5hcnJvdy1yaWdodCB7XFxuICB3aWR0aDogMDtcXG4gIGhlaWdodDogMDtcXG4gIGJvcmRlci10b3A6IDYwcHggc29saWQgdHJhbnNwYXJlbnQ7XFxuICBib3JkZXItYm90dG9tOiA2MHB4IHNvbGlkIHRyYW5zcGFyZW50O1xcbiAgYm9yZGVyLWxlZnQ6IDYwcHggc29saWQgZ3JlZW47XFxufVxcbi5jYWxlbmRhciAuYXJyb3ctbGVmdCB7XFxuICB3aWR0aDogMDtcXG4gIGhlaWdodDogMDtcXG4gIGJvcmRlci10b3A6IDEwcHggc29saWQgdHJhbnNwYXJlbnQ7XFxuICBib3JkZXItYm90dG9tOiAxMHB4IHNvbGlkIHRyYW5zcGFyZW50O1xcbiAgYm9yZGVyLXJpZ2h0OiAxMHB4IHNvbGlkIGJsdWU7XFxufVxcbi5jYWxlbmRhciAuZGF5VGltZSB7XFxuICBjdXJzb3I6IHBvaW50ZXI7XFxufVxcbi5jYWxlbmRhciAuZGF5VGltZSA+ICoge1xcbiAgcG9pbnRlci1ldmVudHM6IG5vbmU7XFxufVxcblwiOyAocmVxdWlyZShcImJyb3dzZXJpZnktY3NzXCIpLmNyZWF0ZVN0eWxlKGNzcywgeyBcImhyZWZcIjogXCJwcmVCdW5kbGluZ0pTL2NhbGVuZGFyQXBwLmNzc1wiIH0sIHsgXCJpbnNlcnRBdFwiOiBcImJvdHRvbVwiIH0pKTsgbW9kdWxlLmV4cG9ydHMgPSBjc3M7IiwiLyoqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBIYXNUZXN0c1RhZ1xuICogQHByb3BlcnR5IHtib29sZWFufSBoYXNUZXN0cyAtIEluZGljYXRlcyB3aGV0aGVyIHRoZSBmdW5jdGlvbiBoYXMgdGVzdHMuXG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBoYXNUaGVzZVN0eWxlc1xuICogQHByb3BlcnR5IHtzdHJpbmd9IGhhc1RoZXNlU3R5bGVzIC0gTGlzdHMgc3R5bGVzIHJlZmVyZW5jZXMgaW4gYSBmdW50aW9uXG4gKi9cblxuaW1wb3J0IHtcbiAgZ2V0RGF5c0luTW9udGgsIGdlbmVyYXRlUmFuZG9tU3RyaW5nLCBnZXRFYXJsaWVzdERhdGUsXG4gIGJsb2NrRGF5c05vdE9wZW4sIGNsZWFyU2VsZWN0aW9uLFxuICBodW1hbkRhdGUsIHN0YW5kYXJkRGF0ZU9iamVjdFxufSBmcm9tICcuL2Jhc2ljRnVuY3Rpb25zLmpzJztcbmltcG9ydCB7IEdlbmVyYXRlVGltZUNob29zZXJNb2RhbCB9IGZyb20gJy4vZGlzcGxheVRpbWVDaG9vc2VyTW9kYWwuanMnO1xuaW1wb3J0IHsgY29sb3Vycywgc2VsZWN0ZWRTdHlsZSwgdW5zZWxlY3RlZFN0eWxlIH0gZnJvbSAnLi9zdHlsZXMuanMnO1xuaW1wb3J0IHsgbGFuZ3VhZ2VzIH0gZnJvbSAnLi9sYW5ndWFnZXMuanMnO1xuaW1wb3J0IHN0eWxlIGZyb20gJy4vY2FsZW5kYXJBcHAuY3NzJztcblxuLyoqXG4gKiBBZGRzIHRoZSBzcGVjaWZpZWQgbnVtYmVyIG9mIG1vbnRocyB0byBhIGRhdGUuXG4gKiBAcGFyYW0ge251bWJlcn0gbW9udGhzIC0gVGhlIG51bWJlciBvZiBtb250aHMgdG8gYWRkLlxuICogQHJldHVybnMge0RhdGV9IC0gVGhlIHVwZGF0ZWQgZGF0ZS5cbiAqL1xuRGF0ZS5wcm90b3R5cGUuYWRkTW9udGhzID0gZnVuY3Rpb24obW9udGhzKSB7XG4gIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZSh0aGlzKTtcbiAgY29uc3QgeWVhcnMgPSBNYXRoLmZsb29yKG1vbnRocyAvIDEyKTtcbiAgY29uc3QgcmVtYWluaW5nTW9udGhzID0gbW9udGhzICUgMTI7XG4gIGlmICh5ZWFycykge1xuICAgIGRhdGUuc2V0RnVsbFllYXIoZGF0ZS5nZXRGdWxsWWVhcigpICsgeWVhcnMpO1xuICB9XG4gIGlmIChyZW1haW5pbmdNb250aHMpIHtcbiAgICBkYXRlLnNldE1vbnRoKGRhdGUuZ2V0TW9udGgoKSArIHJlbWFpbmluZ01vbnRocyk7XG4gIH1cbiAgcmV0dXJuIGRhdGU7XG59O1xuXG5jdXN0b21FbGVtZW50cy5kZWZpbmUoJ3N3aWZ0LWNhbCcsIGNsYXNzIGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgc3VwZXIoKTtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBmdW5jdGlvbiBzdFRvQm9vbGVhbiAoc3QpIHtcbiAgICAgIGlmKHN0ID09PSAndHJ1ZScpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIFxuICAgIGNvbnN0IGNhbGVuZGFyID0gbmV3IFN3aWZ0Q2FsKCk7XG4gICAgY2FsZW5kYXIuZ2VuZXJhdGVDYWxlbmRhcihcbiAgICAgIHtcbiAgICAgICAgdGFyZ2V0OiBzZWxmLFxuICAgICAgICAvLyBkYXRhLW51bWJlci1vZi1tb250aHMtdG8tZGlzcGxheSBodG1sIGNvbnZlcnRzIHRvIG51bWJlck9mTW9udGhzVG9EaXNwbGF5IEpTXG4gICAgICAgIG51bWJlck9mTW9udGhzVG9EaXNwbGF5OiB0aGlzLmRhdGFzZXQubnVtYmVyT2ZNb250aHNUb0Rpc3BsYXksXG4gICAgICAgIC8vIGRhdGEtZGlzcGxheS10aW1lLWNob29zZXItbW9kYWxcbiAgICAgICAgZGlzcGxheVRpbWVDaG9vc2VyTW9kYWw6IHN0VG9Cb29sZWFuKHRoaXMuZGF0YXNldC5kaXNwbGF5VGltZUNob29zZXJNb2RhbCksXG4gICAgICAgIC8vIGRhdGEtc2luZ2xlLWRhdGUtY2hvaWNlXG4gICAgICAgIHNpbmdsZURhdGVDaG9pY2U6IHN0VG9Cb29sZWFuKHRoaXMuZGF0YXNldC5zaW5nbGVEYXRlQ2hvaWNlKSxcblxuICAgICAgICBsYW5ndWFnZTogdGhpcy5kYXRhc2V0Lmxhbmd1YWdlLFxuICAgICAgICAvL2RhdGEtc2VsZWN0LW11bHRpcGxlXG4gICAgICAgIHNlbGVjdE11bHRpcGxlOiB0aGlzLmRhdGFzZXQuc2VsZWN0TXVsdGlwbGUsXG5cbiAgICAgICAgcHJlbG9hZGVkRGF0ZXM6ICh0aGlzLmRhdGFzZXQucHJlbG9hZGVkRGF0ZXMpID8gSlNPTi5wYXJzZSh0aGlzLmRhdGFzZXQucHJlbG9hZGVkRGF0ZXMpIDogZmFsc2UsXG5cbiAgICAgICAgcHJlbG9hZGVkVG9vbHRpcDogdGhpcy5kYXRhc2V0LnByZWxvYWRlZFRvb2x0aXAsXG5cbiAgICAgICAgYmxvY2tEYXlzT2ZXZWVrOiAodGhpcy5kYXRhc2V0LmJsb2NrRGF5c09mV2VlaykgPyBKU09OLnBhcnNlKHRoaXMuZGF0YXNldC5ibG9ja0RheXNPZldlZWspIDogZmFsc2UsXG4gICAgICAgIC8vIGRhdGEtc3RhcnQtZGF0ZT1cIjIwMTktMDEtMDFcIlxuICAgICAgICBzdGFydERhdGU6IHRoaXMuZGF0YXNldC5zdGFydERhdGUsXG5cbiAgICAgIH0pO1xuXG4gICAgdGhpcy5keW5hbWljRGF0YSA9IGNhbGVuZGFyLnJldHVybkR5bmFtaWNEYXRhKCk7XG4gIH1cbn0pO1xuXG5mdW5jdGlvbiBTd2lmdENhbCAoKSB7XG4gIGxldCB0aW1lQ2hvb3NlcjtcbiAgY29uc3QgY29uZmlnID0ge307XG5cbiAgY29uc3QgaGFuZGxlciA9IHtcbiAgICBnZXQ6ICh0YXJnZXQsIGtleSkgPT4ge1xuICAgICAgaWYodHlwZW9mIHRhcmdldFtrZXldID09PSAnb2JqZWN0JyAmJiB0YXJnZXRba2V5XSAhPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gbmV3IFByb3h5KHRhcmdldFtrZXldLCBoYW5kbGVyKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRhcmdldFtrZXldO1xuICAgIH0sXG4gICAgc2V0OiAodGFyZ2V0LCBwcm9wLCB2YWx1ZSkgPT4ge1xuICAgICAgdGFyZ2V0W3Byb3BdID0gdmFsdWU7XG4gICAgICBlbWl0RGF0ZVNlbGVjdGVkRXZlbnQoKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfTtcbiAgXG4gIGNvbnN0IGRhdGFUZW1wbGF0ZSA9IHtcbiAgICBkYXRlc1NlbGVjdGVkQXJyYXk6IFtdLFxuICAgIGRhdGVzU2VsZWN0ZWRBcnJheU9iamVjdHM6IFtdLFxuICAgIGRpc2FibGVkOiBmYWxzZVxuICB9O1xuXG4gIGNvbnN0IGR5bmFtaWNEYXRhID0gbmV3IFByb3h5KGRhdGFUZW1wbGF0ZSwgaGFuZGxlcik7XG5cbiAgZnVuY3Rpb24gZW1pdERhdGVTZWxlY3RlZEV2ZW50ICgpIHtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGNvbnN0IGV2dCA9IG5ldyBDdXN0b21FdmVudCgnZGF0ZVNlbGVjdCcsIHsgZGF0YTogZHluYW1pY0RhdGEgfSk7XG4gICAgICBjb25maWcuY2FsZW5kYXJDb250YWluZXIuZGlzcGF0Y2hFdmVudChldnQpO1xuICAgIH0sIDI1MCk7XG4gIH1cbiAgXG4gIGNvbnN0IGNhbGVuZGFyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cbiAgdGhpcy5yZXR1cm5DYWxlbmRhciA9ICgpID0+IHtcbiAgICByZXR1cm4gY2FsZW5kYXI7XG4gIH07XG5cbiAgdGhpcy5yZXR1cm5EeW5hbWljRGF0YSA9ICgpID0+IHtcbiAgICByZXR1cm4gZHluYW1pY0RhdGE7XG4gIH07XG5cbiAgdGhpcy5yZXR1cm5Db25maWcgPSAoKSA9PiB7XG4gICAgcmV0dXJuIGNvbmZpZztcbiAgfTtcblxuICB0aGlzLnNldENvbmZpZyA9IChjb25maWdPYmopID0+IHtcbiAgICAvLyBJZiBjYWxsZWQgdmlhIEhUTUxcbiAgICBjb25maWcuY2FsZW5kYXJDb250YWluZXIgPSBjb25maWdPYmoudGFyZ2V0IHx8IGZhbHNlO1xuICAgIC8vIElmIGNhbGxlZCB2aWEgSmF2YXNjcmlwdFxuICAgIGNvbmZpZy5wYXJlbnREaXYgPSAodHlwZW9mIGNvbmZpZ09iai5wYXJlbnREaXYgPT09ICdzdHJpbmcnKSA/IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoY29uZmlnT2JqLnBhcmVudERpdikgOiBjb25maWdPYmoucGFyZW50RGl2O1xuICAgIC8vIGRvbmVcbiAgICBjb25maWcubnVtYmVyT2ZNb250aHNUb0Rpc3BsYXkgPSBjb25maWdPYmoubnVtYmVyT2ZNb250aHNUb0Rpc3BsYXkgfHwgMTI7XG4gICAgLy8gZG9uZVxuICAgIGNvbmZpZy5kaXNwbGF5VGltZUNob29zZXJNb2RhbCA9IGNvbmZpZ09iai5kaXNwbGF5VGltZUNob29zZXJNb2RhbCAmJiB0cnVlO1xuICAgIC8vIGRvbmVcbiAgICBjb25maWcuc2luZ2xlRGF0ZUNob2ljZSA9IGNvbmZpZ09iai5zaW5nbGVEYXRlQ2hvaWNlICYmIHRydWU7XG4gICAgLy8gZG9uZVxuICAgIGNvbmZpZy5zZWxlY3RSYW5nZSA9ICFjb25maWdPYmouc2luZ2xlRGF0ZUNob2ljZTtcbiAgICAvLyBkb25lXG4gICAgY29uZmlnLmxhbmd1YWdlID0gY29uZmlnT2JqLmxhbmd1YWdlIHx8ICdlbkdiJztcbiAgICAvLyBkb25lXG4gICAgY29uZmlnLnNlbGVjdE11bHRpcGxlID0gY29uZmlnLnNlbGVjdE11bHRpcGxlIHx8IGZhbHNlO1xuICAgIC8vIGRvbmVcbiAgICBjb25maWcuZGlzcGxheVRpbWVTZWxlY3Rpb25PbkRhdGUgPSBjb25maWdPYmouZGlzcGxheVRpbWVTZWxlY3Rpb25PbkRhdGUgfHwgdHJ1ZTtcbiAgICAvLyBkb25lXG4gICAgY29uZmlnLnByZWxvYWRlZERhdGVzID0gY29uZmlnT2JqLnByZWxvYWRlZERhdGVzIHx8IGZhbHNlO1xuXG4gICAgY29uZmlnLnByZWxvYWRlZFRvb2x0aXAgPSBjb25maWdPYmoucHJlbG9hZGVkVG9vbHRpcCB8fCBmYWxzZTtcblxuICAgIGNvbmZpZy5ibG9ja0RheXNPZldlZWsgPSBjb25maWdPYmouYmxvY2tEYXlzT2ZXZWVrIHx8IGZhbHNlO1xuXG4gICAgY29uZmlnLmJvb2tEYXlzT2ZXZWVrID0gY29uZmlnT2JqLmJvb2tEYXlzT2ZXZWVrIHx8IGZhbHNlO1xuXG4gICAgY29uZmlnLnN0YXJ0RGF0ZSA9IGNvbmZpZ09iai5zdGFydERhdGUgfHwgZmFsc2U7XG5cbiAgICBjb25maWcuZW5kVXNlciA9IGNvbmZpZ09iai5lbmRVc2VyIHx8IGZhbHNlO1xuICAgIGNvbmZpZy5lbmRVc2VyRHVyYXRpb25DaG9pY2UgPSBjb25maWdPYmouZW5kVXNlckR1cmF0aW9uQ2hvaWNlIHx8IGZhbHNlO1xuICAgIGNvbmZpZy5iYWNrZW5kID0gY29uZmlnT2JqLmJhY2tlbmQgfHwgZmFsc2U7XG4gICAgY29uZmlnLmRpc3BsYXlCbG9ja2VkID0gY29uZmlnT2JqLmRpc3BsYXlCbG9ja2VkIHx8IGZhbHNlO1xuICAgIGNvbmZpZy5kYXRlc09wZW4gPSBjb25maWdPYmouZGF0ZXNPcGVuIHx8IGZhbHNlO1xuICB9O1xuXG4gIHRoaXMuZ2VuZXJhdGVDYWxlbmRhciA9IChjb25maWdPYmopID0+IHtcbiAgICBpZiAoY29uZmlnT2JqKSB7XG4gICAgICB0aGlzLnNldENvbmZpZyhjb25maWdPYmopO1xuICAgIH1cbiAgICAvLyBJZiBjYWxsZWQgdmlhIGphdmFzY3JpcHQgYSBwYXJlbnRFbGVtZW50IG5lZWRzIHRvIGJlIHByb3ZpZGVkXG4gICAgY29uc3QgcGFyZW50RGl2ID0gY29uZmlnLnBhcmVudERpdjtcbiAgICAvKlxuICAgICAgSWYgY2FsbGVkIGZyb20gaHRtbCBhcyBhIGN1c3RvbSBjb21wb25lbnQgdGhlIGNvbXBvbmVudCBpdHNlbGYgaXMgcGFzc2VkIChjYWxlbmRhckNvbnRhaW5lcilcbiAgICAgIElmIGNhbGxlZCB2aWEgSlMgd2hpbGUgdGhlIGNvbXBvbmVudCBpc24ndCBhIHdlYmNvbXBvbmVudCBpbiB0aGUgc3RyaWN0ZXN0IHNlbnNlLCBpdCBzdGlsbFxuICAgICAgYmVoYXZlcyBsaWtlIG9uZSBhbmQgaXMgZW5jYXBzdWxhdGVkIGluIGEgc2hhZG93LlxuICAgICovXG4gICAgaWYgKGNvbmZpZy5jYWxlbmRhckNvbnRhaW5lcikge1xuICAgICAgc2hhZG93QXR0YWNoKGNvbmZpZy5jYWxlbmRhckNvbnRhaW5lcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5ld0NvbnRhaW5lcigpLnRoZW4oKGNvbnRhaW5lcikgPT4ge1xuICAgICAgICBzaGFkb3dBdHRhY2goY29udGFpbmVyKTtcbiAgICAgICAgY29uZmlnLmNhbGVuZGFyQ29udGFpbmVyID0gY29udGFpbmVyO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbmV3Q29udGFpbmVyICgpIHtcbiAgICAgIGNvbnN0IHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICBjb25zdCBuZXdDYWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgbmV3Q2FsLmNsYXNzTGlzdC5hZGQoJ3N3aWZ0LWNhbCcpO1xuICAgICAgICBwYXJlbnREaXYuYXBwZW5kQ2hpbGQobmV3Q2FsKTtcbiAgICAgICAgcmVzb2x2ZShuZXdDYWwpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzaGFkb3dBdHRhY2ggKGNvbnRhaW5lcikge1xuICAgICAgY29uc3Qgc2hhZG93Um9vdCA9IGNvbnRhaW5lci5hdHRhY2hTaGFkb3coeyBtb2RlOiAnb3BlbicgfSk7XG4gICAgICBjb25zdCBjc3MgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgICAgY3NzLnRleHRDb250ZW50ID0gc3R5bGU7XG4gICAgICBzaGFkb3dSb290LmFwcGVuZENoaWxkKGNzcyk7XG4gICAgICBzaGFkb3dSb290LmFwcGVuZENoaWxkKGNhbGVuZGFyKTtcbiAgICB9XG5cbiAgICBjb25zdCBwcmVsb2FkZWREYXRlcyA9IGNvbmZpZy5wcmVsb2FkZWREYXRlcztcbiAgICBjb25zdCBudW1iZXJPZk1vbnRoc1RvRGlzcGxheSA9IGNvbmZpZy5udW1iZXJPZk1vbnRoc1RvRGlzcGxheTtcbiAgICBjb25zdCBkYXRlc09wZW4gPSBjb25maWcuZGF0ZXNPcGVuO1xuICAgIGNvbnN0IGxhbmd1YWdlID0gY29uZmlnLmxhbmd1YWdlO1xuICAgIGNvbnN0IGRpc3BsYXlUaW1lQ2hvb3Nlck1vZGFsID0gY29uZmlnLmRpc3BsYXlUaW1lQ2hvb3Nlck1vZGFsO1xuICAgIGNvbnN0IGJsb2NrV2Vla0RheXMgPSBjb25maWcuYmxvY2tEYXlzT2ZXZWVrO1xuICAgIGNvbnN0IGJvb2tXZWVrRGF5cyA9IGNvbmZpZy5ib29rRGF5c09mV2VlaztcbiAgICBjb25zdCBzdGFydERhdGUgPSBjb25maWcuc3RhcnREYXRlO1xuICAgIGxldCB1bmlxdWVEYXlJbmRleCA9IDA7XG4gICAgLy8gQ2FsZW5kYXIgaXMgZGVmaW5lZCBnbG9iYWxseSB3aXRoaW4gdGhlIGNvbnN0cnVjdG9yXG4gICAgY29uc3QgY2FsZW5kYXJVbmlxdWVJZCA9IGdlbmVyYXRlUmFuZG9tU3RyaW5nKCk7XG4gICAgY2FsZW5kYXIuaWQgPSBgY2FsZW5kYXItJHtjYWxlbmRhclVuaXF1ZUlkfWA7XG4gICAgY2FsZW5kYXIuY2xhc3NMaXN0LmFkZCgnY2FsZW5kYXInKTtcbiAgICBcbiAgICBjb25zdCBtb250aHMgPSBbXTtcbiAgICBjb25zdCBkYXRlTm93ID0gbmV3IERhdGUoKTtcbiAgICAvLyBSZXB1cnBvc2luZyBnZXRFYXJsaWVzdERhdGUgdG8gZm9ybWF0IGEgZGF0ZS5cbiAgICBjb25zdCBlYXJsaWVzdERhdGUgPSAoc3RhcnREYXRlKSA/IGdldEVhcmxpZXN0RGF0ZShbc3RhcnREYXRlXSkgOiBkYXRlTm93O1xuICAgIGNvbnN0IHN0YXJ0TW9udGggPSBlYXJsaWVzdERhdGUuZ2V0TW9udGgoKTtcbiAgICBjb25zdCBtb250aE5hbWVzID0gbGFuZ3VhZ2VzW2xhbmd1YWdlXS5nZW5lcmFsVGltZS5tb250aHM7XG4gICAgLyogQ3JlYXRlIG1vbnRoIHZpZXcgKi9cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bWJlck9mTW9udGhzVG9EaXNwbGF5OyBpKyspIHtcbiAgICAgIC8qIE1vbnRoIHNwZWNpZmljIHZhcmlhYmxlcyBhbmQgdHJhY2tlcnMgKi9cbiAgICAgIGNvbnN0IHllYXJDYWxjID0gZWFybGllc3REYXRlLmFkZE1vbnRocyhpKS5nZXRGdWxsWWVhcigpO1xuICAgICAgY29uc3QgbW9udGhDYWxjID0gKHN0YXJ0TW9udGggKyBpKSAlIDEyO1xuICAgICAgY29uc3Qgc3RhcnREYXlPZk1vbnRoID0gbmV3IERhdGUoeWVhckNhbGMsIG1vbnRoQ2FsYykuZ2V0RGF5KCk7XG4gICAgICBjb25zdCBkYXlzSW5Nb250aCA9IGdldERheXNJbk1vbnRoKChzdGFydE1vbnRoICsgaSArIDEpICUgMTIsIGVhcmxpZXN0RGF0ZS5hZGRNb250aHMoaSkuZ2V0RnVsbFllYXIoKSk7XG4gICAgICBsZXQgY291bnQgPSAxO1xuICAgICAgbGV0IGRheW9md2VlayA9IDA7XG5cbiAgICAgIC8qIENyZWF0ZSBtb250aCBkaXYgKi9cbiAgICAgIGNvbnN0IG1vbnRoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBtb250aHMucHVzaChtb250aCk7XG4gICAgICBtb250aC5zdHlsZS53aWR0aCA9ICcxNWVtJztcbiAgICAgIG1vbnRoLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGNvbG91cnMubW9udGhCb3JkZXJDb2xvcjtcbiAgICAgIG1vbnRoLmNsYXNzTGlzdC5hZGQoJ21vbnRoJyk7XG4gICAgICBjYWxlbmRhci5hcHBlbmRDaGlsZChtb250aCk7XG5cbiAgICAgIC8qIENyZWF0ZSBtb250aCBuYW1lIGRpdiAobW9udGggWVlZWSkgYXQgdGhlIHRvcCBvZiBtb250aCBkaXNwbGF5ICovXG4gICAgICBjb25zdCBtb250aE5hbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIG1vbnRoTmFtZS5jbGFzc0xpc3QuYWRkKCdtb250aE5hbWUnKTtcbiAgICAgIG1vbnRoTmFtZS50ZXh0Q29udGVudCA9IGAke21vbnRoTmFtZXNbKHN0YXJ0TW9udGggKyBpKSAlIDEyXX0gJHtlYXJsaWVzdERhdGUuZ2V0RnVsbFllYXIoKX1gO1xuICAgICAgbW9udGguYXBwZW5kQ2hpbGQobW9udGhOYW1lKTtcblxuICAgICAgLyogQ3JlYXRlIGRpdiB3aXRoIG5hbWVkIGRheXMgb2YgdGhlIHdlZWsgKi9cbiAgICAgIGNvbnN0IGRheU5hbWVzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBtb250aC5hcHBlbmRDaGlsZChkYXlOYW1lcyk7XG4gICAgICBkYXlOYW1lcy5jbGFzc0xpc3QuYWRkKCd3ZWVrcm93Jyk7XG4gICAgICBsYW5ndWFnZXNbbGFuZ3VhZ2VdLmdlbmVyYWxUaW1lLmRheXNUcnVuY2F0ZWQuZm9yRWFjaCgoZGF5TmFtZSkgPT4ge1xuICAgICAgICBjb25zdCBkYXkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgZGF5LnRleHRDb250ZW50ID0gZGF5TmFtZTtcbiAgICAgICAgZGF5LmNsYXNzTGlzdC5hZGQoJ2RheU5hbWUnLCAnd2lkdGhTaGFwZURheXMnKTtcbiAgICAgICAgZGF5TmFtZXMuYXBwZW5kQ2hpbGQoZGF5KTtcbiAgICAgIH0pO1xuXG4gICAgICAvKiBDcmVhdGUgd2VlayByb3dzIGZpcnN0IHdlZWssIGl0J3MgcmVhc2lnbmVkIGYgKi9cbiAgICAgIGxldCB3ZWVrUm93O1xuICAgICAgLy8gNDIgZGF5cywgaS5lLiA2IHJvd3Mgb2YgN1xuICAgICAgZm9yIChsZXQgcCA9IDA7IHAgPCA0MjsgcCsrKSB7XG4gICAgICAgIGlmIChwID09PSAwKSB7XG4gICAgICAgICAgLy8gbWFkZSBuZXcgd2VlayByb3dcbiAgICAgICAgICB3ZWVrUm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgbW9udGguYXBwZW5kQ2hpbGQod2Vla1Jvdyk7XG4gICAgICAgICAgd2Vla1Jvdy5jbGFzc0xpc3QuYWRkKCd3ZWVrcm93Jyk7XG4gICAgICAgICAgZGF5b2Z3ZWVrID0gMDtcbiAgICAgICAgfVxuICAgICAgICBpZiAocCA8IHN0YXJ0RGF5T2ZNb250aCkge1xuICAgICAgICAgIGNvbnN0IHBlZ2hvbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICBwZWdob2xlLmNsYXNzTGlzdC5hZGQoJ3dpZHRoU2hhcGUnLCAnZmlsbGVyJyk7XG4gICAgICAgICAgdW5zZWxlY3RlZFN0eWxlKHBlZ2hvbGUpO1xuICAgICAgICAgIHdlZWtSb3cuYXBwZW5kQ2hpbGQocGVnaG9sZSk7XG4gICAgICAgICAgZGF5b2Z3ZWVrKys7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocCA+PSBzdGFydERheU9mTW9udGggJiYgcCA8PSAoc3RhcnREYXlPZk1vbnRoICsgZGF5c0luTW9udGggLSAxKSkge1xuICAgICAgICAgIGNvbnN0IHBlZ2hvbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICBwZWdob2xlLnRleHRDb250ZW50ID0gY291bnQ7XG4gICAgICAgICAgcGVnaG9sZS5kYXRhc2V0LmRheSA9IGNvdW50O1xuICAgICAgICAgIHBlZ2hvbGUuZGF0YXNldC5kYXlvZndlZWsgPSBkYXlvZndlZWs7XG4gICAgICAgICAgcGVnaG9sZS5kYXRhc2V0LmRheWluZGV4ID0gdW5pcXVlRGF5SW5kZXg7XG4gICAgICAgICAgcGVnaG9sZS5jbGFzc0xpc3QuYWRkKCd3aWR0aFNoYXBlJywgJ2RheVRpbWUnKTtcbiAgICAgICAgICBwZWdob2xlLmRhdGFzZXQuaHVtYW5kYXRlID0gaHVtYW5EYXRlKGAke3llYXJDYWxjfS0ke21vbnRoQ2FsY30tJHtjb3VudH1gKTtcbiAgICAgICAgICAvLyBwZWdob2xlLmlkID0gYCR7eWVhckNhbGN9LSR7bW9udGhDYWxjfS0ke2NvdW50fWA7XG4gICAgICAgICAgcGVnaG9sZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICAgICAgICBkYXRlT25DbGlja0V2ZW50cyhlKTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHdlZWtSb3cuYXBwZW5kQ2hpbGQocGVnaG9sZSk7XG5cbiAgICAgICAgICBpZiAoaSA9PT0gMCAmJiBwID49IHN0YXJ0RGF5T2ZNb250aCAmJiBwIDwgKGVhcmxpZXN0RGF0ZS5nZXREYXRlKCkgKyBzdGFydERheU9mTW9udGgpKSB7XG4gICAgICAgICAgICBwZWdob2xlLmNsYXNzTGlzdC5hZGQoJ2ZpbGxlcicpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvdW50Kys7XG4gICAgICAgICAgZGF5b2Z3ZWVrKys7XG4gICAgICAgICAgdW5pcXVlRGF5SW5kZXgrKztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwID49IGRheXNJbk1vbnRoICsgc3RhcnREYXlPZk1vbnRoKSB7XG4gICAgICAgICAgY29uc3QgcGVnaG9sZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgIHBlZ2hvbGUuY2xhc3NMaXN0LmFkZCgnd2lkdGhTaGFwZScsICdmaWxsZXInKTtcbiAgICAgICAgICB3ZWVrUm93LmFwcGVuZENoaWxkKHBlZ2hvbGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKChwICsgMSkgJSA3ID09PSAwKSB7XG4gICAgICAgICAgLy8gbWFrZSBuZXcgd2VlayByb3c6XG4gICAgICAgICAgd2Vla1JvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgIG1vbnRoLmFwcGVuZENoaWxkKHdlZWtSb3cpO1xuICAgICAgICAgIHdlZWtSb3cuY2xhc3NMaXN0LmFkZCgnd2Vla3JvdycpO1xuICAgICAgICAgIGRheW9md2VlayA9IDA7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChpID09PSBudW1iZXJPZk1vbnRoc1RvRGlzcGxheSAtIDEpIHtcbiAgICAgICAgYmxvY2tEYXlzTm90T3BlbihjYWxlbmRhciwgZGF0ZXNPcGVuKTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gT3B0aW9uczpcbiAgICBpZihkaXNwbGF5VGltZUNob29zZXJNb2RhbCkge1xuICAgICAgdGltZUNob29zZXIgPSBuZXcgR2VuZXJhdGVUaW1lQ2hvb3Nlck1vZGFsKGNvbmZpZywgZHluYW1pY0RhdGEsIGNhbGVuZGFyKTtcbiAgICAgIHRpbWVDaG9vc2VyLmdlbmVyYXRlTW9kYWwoKTtcbiAgICB9XG4gICAgaWYocHJlbG9hZGVkRGF0ZXMpIHtcbiAgICAgIHByZWxvYWREYXRlcyhwcmVsb2FkZWREYXRlcyk7XG4gICAgfVxuICAgIGlmKGJsb2NrV2Vla0RheXMpIHtcbiAgICAgIGJsb2NrRGF5c09mV2VlayhibG9ja1dlZWtEYXlzKTtcbiAgICB9XG4gICAgaWYoYm9va1dlZWtEYXlzKSB7XG4gICAgICBib29rRGF5c09mV2Vlayhib29rV2Vla0RheXMpO1xuICAgIH1cbiAgfTtcblxuICBsZXQgY2xpY2tDb3VudCA9IDE7XG4gIGxldCBkYXRlQ2xpY2tlZFRocmljZSA9IHtcbiAgICBkYXRlOiBudWxsLFxuICAgIGNvdW50OiAxXG4gIH07XG5cbiAgZnVuY3Rpb24gY2xpa2VkVGhyaWNlIChkYXRlKSB7XG5cbiAgICBpZiAoZGF0ZUNsaWNrZWRUaHJpY2UuZGF0ZSA9PT0gZGF0ZSkge1xuICAgICAgZGF0ZUNsaWNrZWRUaHJpY2UuY291bnQrKztcbiAgICB9IFxuICAgIGVsc2Uge1xuICAgICAgLy8gcmVzZXQgZm9yIG5ldyBkYXRlXG4gICAgICBkYXRlQ2xpY2tlZFRocmljZS5kYXRlID0gZGF0ZTtcbiAgICAgIGRhdGVDbGlja2VkVGhyaWNlLmNvdW50ID0gMTtcbiAgICB9XG5cbiAgICBpZiAoZGF0ZUNsaWNrZWRUaHJpY2UuY291bnQgPT09IDMpIHtcbiAgICAgIGRhdGVDbGlja2VkVGhyaWNlLmNvdW50ID0gMDtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBmdW5jdGlvbiBkYXRlT25DbGlja0V2ZW50cyAoZSkgeyAgICBcblxuICAgIGNvbnN0IGRhdGVEaXYgPSBlLnRhcmdldDtcbiAgICBjbGlja0NvdW50Kys7XG5cbiAgICBpZiAoZHluYW1pY0RhdGEuZGlzYWJsZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoY29uZmlnLnNlbGVjdFJhbmdlKSB7XG4gICAgICByYW5nZShkYXRlRGl2KTtcbiAgICB9XG5cbiAgICBpZiAoY29uZmlnLnNpbmdsZURhdGVDaG9pY2UpIHtcbiAgICAgIGNsZWFyU2VsZWN0aW9uKGNhbGVuZGFyLCBkeW5hbWljRGF0YSk7XG4gICAgICBib29rRGF0ZXMoW2RhdGVEaXZdKTtcbiAgICAgIHRpbWVDaG9vc2VyVG9nZ2xlKCk7XG4gICAgfVxuXG5cbiAgICBmdW5jdGlvbiB0aW1lQ2hvb3NlclRvZ2dsZSAoKSB7XG4gICAgICBpZiAoY29uZmlnLmRpc3BsYXlUaW1lQ2hvb3Nlck1vZGFsKSB7IFxuICAgICAgICB0aW1lQ2hvb3Nlci5zaG93KCk7XG4gICAgICAgIHRpbWVDaG9vc2VyLndyaXRlVG9EYXRlRGl2KCk7XG4gICAgICAgIHRpbWVDaG9vc2VyLndyaXRlVG9EeW5hbWljRGF0YSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJhbmdlKGRhdGVEaXYpIHtcbiAgICAgIGNvbnN0IGxhc3REYXRlID0gZGF0ZUNsaWNrZWRUaHJpY2UuZGF0ZTtcbiAgICAgIGNvbnN0IHRocmljZSA9IGNsaWtlZFRocmljZShkYXRlRGl2LmRhdGFzZXQuaHVtYW5kYXRlKTtcbiAgICAgIGlmICh0aHJpY2UpIHtcbiAgICAgICAgd2luZG93LmdldFNlbGVjdGlvbigpLnJlbW92ZUFsbFJhbmdlcygpO1xuICAgICAgICAvLyBwYXNzIFwidHJ1ZVwiIHRvIGluZGljYXRlIGEgc2luZ2xlIGRhdGUgcmFuZ2UsIHNlbGVjdGVkIGJ5IHRyaXBsZSBjbGljazpcbiAgICAgICAgYm9va0RhdGVzKFtkYXRlRGl2XSwgdHJ1ZSk7XG4gICAgICAgIHRpbWVDaG9vc2VyVG9nZ2xlKCk7XG4gICAgICAgIGNsaWNrQ291bnQrKztcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKGNsaWNrQ291bnQgJSAyID09PSAwKSB7XG4gICAgICAgIGlmIChjb25maWcuc2VsZWN0TXVsdGlwbGUpIHtcbiAgICAgICAgICBjbGVhclNlbGVjdGlvbihjYWxlbmRhciwgZHluYW1pY0RhdGEpO1xuICAgICAgICB9XG4gICAgICAgIGJvb2tEYXRlcyhbZGF0ZURpdl0pO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAocHJpb3JXYXNTaW5nbGUgPT09IGZhbHNlICYmIGNsaWNrQ291bnQgJSAyID09PSAxKSB7XG4gICAgICAgIGJvb2tEYXRlcyhbZGF0ZURpdl0pO1xuICAgICAgICAvL3RpbWVDaG9vc2VyVG9nZ2xlKCk7XG4gICAgICAgIC8vIHJ1bGUgdG8gY2hlY2sgaWYgcmFuZ2UgaXMgYSBsb25nZXIgdGhhbiAxOiBcbiAgICAgICAgaWYoZGF0ZUNsaWNrZWRUaHJpY2UuZGF0ZSAhPT0gbGFzdERhdGUpIHsgdGltZUNob29zZXJUb2dnbGUoKTsgfVxuICAgICAgICByZXR1cm47XG4gICAgICB9ICAgICBcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmFuZ2Ugc2VsZWN0XG4gICAqIEBkZXNjcmlwdGlvbiBBbGxvd3MgYSByYW5nZSBvZiBkYXRlcyB0byBiZSBzZWxlY3RlZFxuICAgKiBAZnVuY3Rpb24gYm9va0RhdGVzXG4gICAqIEBwYXJhbSBkYXRlcyBOb2RlbGlzdFxuICAgKiBAdG9kbyBhbGxvdyBhIHJhbmdlIG9mIGxlbmd0aCBvbmUgdG8gYmUgc2VsZWN0ZWRcbiAgICogQGZpcmVzIGJvb2tEYXkgZm9yIGVhY2ggZGF5IGluIGEgcmFuZ2VcbiAgICovXG5cbiAgbGV0IHByaW9yV2FzU2luZ2xlID0gZmFsc2U7IFxuICBmdW5jdGlvbiBib29rRGF0ZXMgKGFycmF5T2ZEYXRlRGl2cywgc2luZ2xlRGF0ZSkge1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIG5ldyBzZWxlY3Rpb24gaW4gdGhlIGR5bmFtaWNEYXRhIG9iamVjdC5cbiAgICAgKiBAcmV0dXJuIHtvYmplY3R9IEFuIG9iamVjdCBjb250YWluaW5nIHRoZSB0cmFja2luZyBhcnJheSBcIm5ld0FycmF5XCIgYW5kIG9iamVjdHMgYXJyYXkuXG4gICAgICovXG5cbiAgICBmdW5jdGlvbiBjcmVhdGVOZXdTZWxlY3Rpb24gKHByaW9yV2FzU2luZ2xlKSB7XG5cbiAgICAgIGNvbnN0IHBhcmVudEFyID0gZHluYW1pY0RhdGEuZGF0ZXNTZWxlY3RlZEFycmF5O1xuICAgICAgY29uc3QgcGFyZW50QXJPYmogPSBkeW5hbWljRGF0YS5kYXRlc1NlbGVjdGVkQXJyYXlPYmplY3RzO1xuICAgICAgbGV0IG5ld0FycmF5LCBuZXdPYmplY3RzQXJyYXk7XG5cbiAgICAgIG5ld0FycmF5ID0gcGFyZW50QXJbcGFyZW50QXIubGVuZ3RoIC0gMV07XG5cbiAgICAgIGlmICghcHJpb3JXYXNTaW5nbGUgJiYgY29uZmlnLnNlbGVjdFJhbmdlICYmIG5ld0FycmF5ICYmIG5ld0FycmF5Lmxlbmd0aCA9PT0gMSkge1xuICAgICAgICBuZXdPYmplY3RzQXJyYXkgPSBwYXJlbnRBck9ialtwYXJlbnRBck9iai5sZW5ndGggLSAxXTtcbiAgICAgICAgcmV0dXJuIHsgbmV3QXJyYXksIG5ld09iamVjdHNBcnJheSB9OyBcbiAgICAgIH1cblxuICAgICAgbmV3QXJyYXkgPSBbXTtcbiAgICAgIG5ld09iamVjdHNBcnJheSA9IFtdO1xuICAgICAgcGFyZW50QXIucHVzaChuZXdBcnJheSk7XG4gICAgICBwYXJlbnRBck9iai5wdXNoKG5ld09iamVjdHNBcnJheSk7XG4gICAgICByZXR1cm4geyBuZXdBcnJheSwgbmV3T2JqZWN0c0FycmF5IH07XG5cbiAgICB9XG5cbiAgICAvLyBjcmVhdGUgbmV3IHNlbGVjdGlvbnMgb3IgcmV0cmlldmUgdGhlIGxhc3Qgc2VsZWN0aW9uOiBcbiAgICBjb25zdCB7IG5ld0FycmF5LCBuZXdPYmplY3RzQXJyYXkgfSA9IGNyZWF0ZU5ld1NlbGVjdGlvbihwcmlvcldhc1NpbmdsZSk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFycmF5T2ZEYXRlRGl2cy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgZGF0ZURpdiA9IGFycmF5T2ZEYXRlRGl2c1tpXTtcbiAgICAgIGZpbmREYXRlU2VsZWN0aW9uKGRhdGVEaXYpO1xuICAgICAgYm9va0RheShkYXRlRGl2KTtcbiAgICB9XG4gICAgLy8gc3RvcmUgd2luIHRoZSBwcmV2aW91cyBzZWxlY3Rpb24gd2FzIGEgcmFuZ2Ugb2YgbGVuZ3RoIDEsIHJlYWQgYnkgXCJjcmVhdGVOZXdTZWxlY3Rpb25cIlxuICAgIHByaW9yV2FzU2luZ2xlID0gKHNpbmdsZURhdGUpID8gdHJ1ZSA6IGZhbHNlO1xuXG4gICAgLy8gaWYgdGhlIGRhdGUgaXMgaW4gYSBwcmV2aW91cyBzZWxlY3Rpb24sIHRoYXQgc2VsZWN0aW9uIGlzIHNwbGljZWRcbiAgICBmdW5jdGlvbiBmaW5kRGF0ZVNlbGVjdGlvbiAoZGF0ZSkge1xuICAgICAgLy8gY29uc29sZS5sb2coZGF0ZSk7XG4gICAgICBjb25zdCBzdG9yZSA9IGR5bmFtaWNEYXRhLmRhdGVzU2VsZWN0ZWRBcnJheU9iamVjdHM7XG4gICAgICBmb3IobGV0IGogPSAwOyBqIDwgc3RvcmUubGVuZ3RoOyBqKyspe1xuICAgICAgICAvLyB0aGUgYXJyYXkgaW4gcXVlc3Rpb25cbiAgICAgICAgY29uc3Qgc2luZ2xlU2VsZWN0aW9uID0gc3RvcmVbal07XG4gICAgICAgIC8vIGRhdGEgYXR0ciBvZiBodG1sIGVsZW1lbnRcbiAgICAgICAgY29uc3QgZGF0ZVZhbHVlID0gZGF0ZS5kYXRhc2V0Lmh1bWFuZGF0ZTtcbiAgICAgICAgY29uc3Qgc2VhcmNoID0gKCkgPT4gc2luZ2xlU2VsZWN0aW9uLmZpbmQoIChkYXRlU3RvcmVkKSA9PiBkYXRlU3RvcmVkLmh1bWFuZGF0ZSA9PT0gZGF0ZVZhbHVlKTtcbiAgICAgICAgaWYoc2VhcmNoKCkpIHtcbiAgICAgICAgICBzaW5nbGVTZWxlY3Rpb24uZm9yRWFjaCgoZGF0ZSkgPT4ge1xuICAgICAgICAgICAgLy8gcmVtb3ZlIHNlbGVjdGlvbiBjb2xvdXJcbiAgICAgICAgICAgIGNvbnN0IGRheURpdiA9IGNhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLWh1bWFuZGF0ZT0nJHtkYXRlLmh1bWFuZGF0ZX0nXWApO1xuICAgICAgICAgICAgdW5zZWxlY3RlZFN0eWxlKGRheURpdik7XG4gICAgICAgICAgICAvLyByZW1vdmUgdGltZXMsIGlmIGFueTogXG4gICAgICAgICAgICB3aGlsZSAoZGF5RGl2LmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgZGF5RGl2LnJlbW92ZUNoaWxkKGRheURpdi5sYXN0Q2hpbGQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIC8vIHJlbW92ZSBmcm9tIHN0b3JhZ2VcbiAgICAgICAgICBkeW5hbWljRGF0YS5kYXRlc1NlbGVjdGVkQXJyYXlPYmplY3RzLnNwbGljZShqLCAxKTtcbiAgICAgICAgICBkeW5hbWljRGF0YS5kYXRlc1NlbGVjdGVkQXJyYXkuc3BsaWNlKGosIDEpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuIFxuICAgIGlmIChjb25maWcuc2VsZWN0UmFuZ2UpIHtcbiAgICAgIGNvbnN0IHN0YXJ0RGF0ZSA9IG5ld09iamVjdHNBcnJheVswXTtcbiAgICAgIGNvbnN0IHN0YXJ0SW5kZXggPSBzdGFydERhdGUuaW5kZXg7XG4gICAgICAvLyBpZiBhIHNpbmdsZSBkYXRlIGlzIHNlbGVjdGVkOlxuICAgICAgY29uc3QgZW5kRGF0ZSA9IG5ld09iamVjdHNBcnJheVsxXSB8fCBzdGFydERhdGU7XG4gICAgICBjb25zdCBlbmRJbmRleCA9IChlbmREYXRlKSA/IGVuZERhdGUuaW5kZXggOiBmYWxzZTtcblxuICAgICAgbGV0IFtsb3csIGhpZ2hdID0gW3BhcnNlSW50KHN0YXJ0SW5kZXgpLCBwYXJzZUludChlbmRJbmRleCldLnNvcnQoKGEsIGIpID0+IGEgLSBiKTtcblxuICAgICAgZm9yIChsZXQgaSA9IGxvdzsgaSA8PSBoaWdoOyBpKyspIHtcbiAgICAgICAgY29uc3QgZGF0ZURpdiA9IGNhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLWRheWluZGV4PScke2l9J11gKTtcbiAgICAgICAgaWYgKGRhdGVEaXYuY2xhc3NMaXN0LmNvbnRhaW5zKCdibG9ja2VkJykpIHtcbiAgICAgICAgICB1bnNlbGVjdGVkU3R5bGUoY2FsZW5kYXIucXVlcnlTZWxlY3RvcihgW2lkPScke2VuZERhdGV9J11gKSk7XG4gICAgICAgICAgbmV3QXJyYXkuc3BsaWNlKDEsIDEpO1xuICAgICAgICAgIG5ld09iamVjdHNBcnJheS5zcGxpY2UoMSwgMSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgYm9va0RheShkYXRlRGl2KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBib29rRGF5IChkYXRlRGl2KSB7XG4gICAgICBpZiAoY29uZmlnLnNpbmdsZURhdGVDaG9pY2UgJiYgbmV3QXJyYXkubGVuZ3RoID4gMCkge1xuICAgICAgICBjbGVhclNlbGVjdGlvbihjYWxlbmRhciwgZHluYW1pY0RhdGEpO1xuICAgICAgfVxuICAgICAgaWYgKG5ld0FycmF5LmluY2x1ZGVzKGRhdGVEaXYuZGF0YXNldC5odW1hbmRhdGUpID09PSBmYWxzZSkge1xuICAgICAgICBzZWxlY3RlZFN0eWxlKGRhdGVEaXYpO1xuICAgICAgICBuZXdBcnJheS5wdXNoKGRhdGVEaXYuZGF0YXNldC5odW1hbmRhdGUpO1xuICAgICAgICBuZXdPYmplY3RzQXJyYXlbbmV3QXJyYXkubGVuZ3RoIC0gMV0gPSBzdGFuZGFyZERhdGVPYmplY3QoZGF0ZURpdik7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gYm9va0RheXNPZldlZWsgKGRheUluZGV4KSB7XG4gICAgY29uc3QgZGF5cyA9IGNhbGVuZGFyLnF1ZXJ5U2VsZWN0b3JBbGwoYFtkYXRhLWRheW9md2Vlaz1cIiR7ZGF5SW5kZXh9XCJdYCk7XG4gICAgZGF5cy5mb3JFYWNoKChkYXkpID0+IHtcbiAgICAgIGJvb2tEYXRlcyhbZGF5XSwgdHJ1ZSk7ICAgXG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBibG9ja0RheXNPZldlZWsgKGRheUluZGV4QXJyYXkpIHtcbiAgICBkYXlJbmRleEFycmF5LmZvckVhY2goKGRheUluZGV4KSA9PiB7XG4gICAgICBjb25zdCBkYXlzID0gY2FsZW5kYXIucXVlcnlTZWxlY3RvckFsbChgW2RhdGEtZGF5b2Z3ZWVrPVwiJHtkYXlJbmRleH1cIl1gKTtcbiAgICAgIGRheXMuZm9yRWFjaCgoZGF5KSA9PiB7XG4gICAgICAgIGRheS5jbGFzc0xpc3QuYWRkKCdmaWxsZXInKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gcHJlbG9hZERhdGVzIChwcmVsb2FkZWREYXRlcykge1xuICAgIFxuICAgIGZ1bmN0aW9uIGdldERpdnMgKGRhdGVzKSB7XG4gICAgICBjb25zdCBkYXRlRGl2cyA9IFtdO1xuICAgICAgY29uc3QgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgIGRhdGVzLmZvckVhY2goKGRhdGUsIGkpID0+IHtcbiAgICAgICAgICBjb25zdCBkYXRlRGl2ID0gY2FsZW5kYXIucXVlcnlTZWxlY3RvcihgW2RhdGEtaHVtYW5kYXRlPScke2RhdGV9J11gKTtcbiAgICAgICAgICBkYXRlRGl2cy5wdXNoKGRhdGVEaXYpO1xuICAgICAgICAgIGlmIChpID09PSBwcmVsb2FkZWREYXRlcy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICBibG9ja05vdFByZWxvYWRlZERhdGVzIChkYXRlRGl2cyk7XG4gICAgICAgICAgICByZXNvbHZlKGRhdGVEaXZzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBibG9ja05vdFByZWxvYWRlZERhdGVzIChkYXRlRGl2cykge1xuICAgICAgY29uc3Qgbm9uT3B0aW9ucyA9IGNhbGVuZGFyLnF1ZXJ5U2VsZWN0b3JBbGwoJy5kYXlUaW1lJyk7XG4gICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgbm9uT3B0aW9ucy5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgY29uc3QgZGF5ID0gbm9uT3B0aW9uc1tpbmRleF07XG4gICAgICAgIGlmKCFkYXRlRGl2cy5pbmNsdWRlcyhkYXkpKXtcbiAgICAgICAgICBkYXkuY2xhc3NMaXN0LmFkZCgnZmlsbGVyJyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgZGF5LmNsYXNzTGlzdC5hZGQoJ3ByZWxvYWRlZCcpO1xuICAgICAgICAgIGRheS50aXRsZSA9IGNvbmZpZy5wcmVsb2FkZWRUb29sdGlwO1xuICAgICAgICB9IFxuICAgICAgfVxuICAgIH1cblxuICAgIGdldERpdnMocHJlbG9hZGVkRGF0ZXMpO1xuICAgIC8qXG4gICAgICAudGhlbigoZGF0ZURpdnMpID0+IHtcbiAgICAgICAgLy8gYm9va0RhdGVzKGRhdGVEaXZzKTtcbiAgICAgIH0pO1xuICAgICovXG4gIH0gICBcbn1cblxuZXhwb3J0IHsgU3dpZnRDYWwgfTtcbiIsImltcG9ydCB7IGxhbmd1YWdlcyB9IGZyb20gJy4vbGFuZ3VhZ2VzLmpzJztcblxuLyoqXG4gKiBHZW5lcmF0ZXMgYSB0aW1lIGNob29zZXIgbW9kYWwgZm9yIHNlbGVjdGluZyB0aW1lLiBDYWxsZWQgaW4gY2FsZW5kYXJHZW5lcmF0b3IuanNcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gY29uZmlnIC0gVGhlIGNvbmZpZ3VyYXRpb24gb2JqZWN0LiBcbiAqIEBwYXJhbSB7T2JqZWN0fSBkeW5hbWljRGF0YSAtIFRoZSBkeW5hbWljIGRhdGEgb2JqZWN0LlxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gY2FsZW5kYXIgLSBUaGUgY2FsZW5kYXIgZWxlbWVudC5cbiAqIEByZXR1cm4ge0Z1bmN0aW9ufSBUaGUgZ2VuZXJhdGVkIHRpbWUgY2hvb3NlciBtb2RhbC5cbiAqL1xuZnVuY3Rpb24gR2VuZXJhdGVUaW1lQ2hvb3Nlck1vZGFsIChjb25maWcsIGR5bmFtaWNEYXRhLCBjYWxlbmRhcikge1xuXG4gIC8qKlxuICAgKiBBIGN1c3RvbSBldmVudCBlbWl0dGVkIHdoZW4gYSB0aW1lIGlzIGFkZGVkIG9yIHNlbGVjdGVkXG4gICAqXG4gICAqIEByZXR1cm4ge3ZvaWR9IFRoaXMgZnVuY3Rpb24gZG9lcyBub3QgcmV0dXJuIGFueSB2YWx1ZS5cbiAgICovXG4gIGZ1bmN0aW9uIGVtaXRUaW1lU2VsZWN0ZWRFdmVudCAoKSB7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBjb25zdCBldnQgPSBuZXcgQ3VzdG9tRXZlbnQoJ3RpbWVTZWxlY3QnLCB7IGRhdGE6IGR5bmFtaWNEYXRhIH0pO1xuICAgICAgY29uZmlnLmNhbGVuZGFyQ29udGFpbmVyLmRpc3BhdGNoRXZlbnQoZXZ0KTtcbiAgICB9LCAyNTApO1xuICB9XG5cbiAgbGV0IHRpbWVDaG9vc2VyTW9kYWw7XG5cbiAgbGV0IHNlbGVjdGlvbiA9IFtdO1xuXG4gIHRoaXMuZ2V0U2VsZWN0ZWRUaW1lcyA9ICgpID0+IHtcbiAgICByZXR1cm4gc2VsZWN0aW9uO1xuICB9O1xuICBcbiAgdGhpcy5nZW5lcmF0ZU1vZGFsID0gKCkgPT4ge1xuICAgIHJldHVybiBnZW5lcmF0ZU1vZGFsKCk7XG4gIH07XG5cbiAgdGhpcy5zaG93ID0gKCkgPT4ge1xuICAgIGNhbGVuZGFyLnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbic7XG4gICAgcmV0dXJuIHRpbWVDaG9vc2VyTW9kYWwuc2hvdygpO1xuICB9O1xuXG4gIHRoaXMud3JpdGVUb0RhdGVEaXYgPSAgKCkgPT4ge1xuICAgIHdyaXRlVG9EYXRlRGl2KCk7XG4gIH07XG5cbiAgdGhpcy53cml0ZVRvRHluYW1pY0RhdGEgPSAoKSA9PiB7XG4gICAgd3JpdGVUb0R5bmFtaWNEYXRhKCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEdlbmVyYXRlcyBhIGRpYWxvZyBmb3IgY2hvb3NpbmcgdGltZS5cbiAgICpcbiAgICogQHJldHVybiB7UHJvbWlzZX0gQSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgdG8gdGhlIGdlbmVyYXRlZCB0aW1lIGNob29zZXIgbW9kYWwuXG4gICAqL1xuICBmdW5jdGlvbiBnZW5lcmF0ZU1vZGFsKCkge1xuICAgIGNvbnN0IHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuXG4gICAgICB0aW1lQ2hvb3Nlck1vZGFsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGlhbG9nJyk7XG4gICAgICB0aW1lQ2hvb3Nlck1vZGFsLmNsYXNzTGlzdC5hZGQoJ3RpbWVDaG9vc2VyTW9kYWwnKTtcbiAgICAgIGNhbGVuZGFyLmFwcGVuZENoaWxkKHRpbWVDaG9vc2VyTW9kYWwpO1xuICBcbiAgICAgIGNvbnN0IHRpbWVDb250ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICB0aW1lQ29udC5jbGFzc0xpc3QuYWRkKCd0aW1lQ29udCcpO1xuICAgICAgdGltZUNob29zZXJNb2RhbC5hcHBlbmRDaGlsZCh0aW1lQ29udCk7XG4gIFxuICAgICAgY29uc3QgdGltZUNob29zZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIHRpbWVDaG9vc2VyLmNsYXNzTGlzdC5hZGQoJ3RpbWVDaG9vc2VyJyk7XG4gICAgICB0aW1lQ29udC5hcHBlbmRDaGlsZCh0aW1lQ2hvb3Nlcik7XG4gIFxuICAgICAgY29uc3QgY29udHJvbHNEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGNvbnRyb2xzRGl2LmNsYXNzTGlzdC5hZGQoJ2RlbGV0ZURpdicpO1xuICAgICAgdGltZUNob29zZXIuYXBwZW5kQ2hpbGQoY29udHJvbHNEaXYpO1xuICBcbiAgICAgIGZ1bmN0aW9uIGNsb3NlRm4gKCkge1xuICAgICAgICBjYWxlbmRhci5zdHlsZS5vdmVyZmxvdyA9ICdzY3JvbGwnO1xuICAgICAgICB0aW1lQ2hvb3Nlck1vZGFsLmNsb3NlKCk7XG4gICAgICB9XG4gICAgXG4gICAgICBmdW5jdGlvbiBpbm5lckNvbXBvbmVudHMgKCkge1xuICAgICAgICBjb25zdCB0aW1lUGlja2VyQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIHRpbWVQaWNrZXJDb250YWluZXIuY2xhc3NMaXN0LmFkZCgndGltZVBpY2tlckNvbnRhaW5lcicpO1xuICAgICAgICB0aW1lQ2hvb3Nlci5hcHBlbmRDaGlsZCh0aW1lUGlja2VyQ29udGFpbmVyKTtcbiAgICAgICAgY29uc3QgdGl0bGVEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgdGl0bGVEaXYudGV4dENvbnRlbnQgPSBsYW5ndWFnZXNbY29uZmlnLmxhbmd1YWdlXS50aW1lV2lkZ2V0LmFkZFRpbWU7XG4gICAgICAgIHRpdGxlRGl2LmNsYXNzTGlzdC5hZGQoJ2RlbGV0ZURpdicpO1xuICAgICAgICB0aW1lUGlja2VyQ29udGFpbmVyLmFwcGVuZENoaWxkKHRpdGxlRGl2KTtcbiAgICAgICAgbWFrZURyb3BEb3ducyhsYW5ndWFnZXNbY29uZmlnLmxhbmd1YWdlXS50aW1lV2lkZ2V0LnN0YXJ0LCB0aW1lUGlja2VyQ29udGFpbmVyKTtcbiAgICAgICAgbWFrZURyb3BEb3ducyhsYW5ndWFnZXNbY29uZmlnLmxhbmd1YWdlXS50aW1lV2lkZ2V0LmVuZCwgdGltZVBpY2tlckNvbnRhaW5lcik7XG4gICAgICAgIFxuICAgICAgICAvLyBzZXRUaW1lRm9yQWxsVGlja0JveCh0aW1lUGlja2VyQ29udGFpbmVyKTsgXG4gICAgICAgIFxuICAgICAgfVxuXG4gICAgICBtYWtlQnV0dG9uKGNvbnRyb2xzRGl2LCAnZGVsZXRlQnV0dG9uJywgJysnLCAnYWRkIHRpbWUnLCAnY2xpY2snLCBpbm5lckNvbXBvbmVudHMpO1xuICAgICAgbWFrZUJ1dHRvbihjb250cm9sc0RpdiwgJ2RlbGV0ZUJ1dHRvbicsICctJywgJ3JlbW92ZSB0aW1lJywgJ2NsaWNrJywgcmVtb3ZlVGltZVZhbHVlc09uRGF0ZSk7XG4gICAgICBtYWtlQnV0dG9uKGNvbnRyb2xzRGl2LCAnZGVsZXRlQnV0dG9uJywgJ3gnLCAnY2xvc2UnLCAnY2xpY2snLCBjbG9zZUZuKTtcbiAgICAgIFxuICAgICAgcmVzb2x2ZSh0aW1lQ2hvb3Nlck1vZGFsKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHdyaXRlVG9EYXRlRGl2ICgpIHtcbiAgICBpZiAoY29uZmlnLmRpc3BsYXlUaW1lU2VsZWN0aW9uT25EYXRlKSB7XG4gICAgICBkeW5hbWljRGF0YS5kYXRlc1NlbGVjdGVkQXJyYXlbZHluYW1pY0RhdGEuZGF0ZXNTZWxlY3RlZEFycmF5Lmxlbmd0aC0xXS5mb3JFYWNoKChkYXlTZWxlY3RlZCkgPT4ge1xuICAgICAgICB3cml0ZShkYXlTZWxlY3RlZCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiB3cml0ZSAoZGF0ZSkge1xuICAgIC8vIGNvbnRhaW5zIGEgdGltZSBkdXJhdGlvbiBjaG9pY2VcbiAgICBsZXQgY2FsZW5kYXJUaW1lUGFyZW50O1xuXG4gICAgY29uc3QgZGF5RGl2ID0gY2FsZW5kYXIucXVlcnlTZWxlY3RvcihgW2RhdGEtaHVtYW5kYXRlPScke2RhdGV9J11gKTtcbiAgICB3aGlsZSAoZGF5RGl2LmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICAgIGRheURpdi5yZW1vdmVDaGlsZChkYXlEaXYubGFzdENoaWxkKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjcmVhdGVOZXdQYXJhICh0ZXh0KSB7XG4gICAgICBjb25zdCB0aW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgICAgY2FsZW5kYXJUaW1lUGFyZW50LmFwcGVuZENoaWxkKHRpbWUpO1xuICAgICAgdGltZS5jbGFzc0xpc3QuYWRkKCdjYWxlbmRhclRpbWUnKTtcbiAgICAgIHRpbWUudGV4dENvbnRlbnQgPSB0ZXh0O1xuICAgIH1cblxuICAgIHNlbGVjdGlvbi5mb3JFYWNoKCh0aW1lVmFsdWUsIGkpID0+IHtcbiAgICAgIGlmIChpID09PSAwIHx8IGkgJSAyID09PSAwKSB7XG4gICAgICAgIGNhbGVuZGFyVGltZVBhcmVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBjYWxlbmRhclRpbWVQYXJlbnQuY2xhc3NMaXN0LmFkZCgnY2FsZW5kYXJUaW1lUGFyZW50Jyk7XG4gICAgICAgIGRheURpdi5hcHBlbmRDaGlsZChjYWxlbmRhclRpbWVQYXJlbnQpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBmaWVsZE5hbWUgPSBPYmplY3Qua2V5cyh0aW1lVmFsdWUpWzBdO1xuICAgICAgY3JlYXRlTmV3UGFyYShgJHtmaWVsZE5hbWV9OmApO1xuICAgICAgY3JlYXRlTmV3UGFyYShgJHt0aW1lVmFsdWVbZmllbGROYW1lXS5oaH06JHt0aW1lVmFsdWVbZmllbGROYW1lXS5tbX1gKTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG1ha2VCdXR0b24gKHBhcmVudCwgY2xhc3NOYW1lLCB0ZXh0Q29udGVudCwgaG92ZXJUZXh0LCBhY3Rpb24sIGZuKSB7XG4gICAgY29uc3QgYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcbiAgICBidXR0b24udGV4dENvbnRlbnQgPSB0ZXh0Q29udGVudDtcbiAgICBidXR0b24udGl0bGUgPSBob3ZlclRleHQ7XG4gICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoYWN0aW9uLCAoKSA9PiB7XG4gICAgICBmbigpO1xuICAgIH0pO1xuICAgIHBhcmVudC5hcHBlbmRDaGlsZChidXR0b24pO1xuICB9XG4gIFxuICBmdW5jdGlvbiBtYWtlRHJvcERvd25zIChjb250ZXh0VGV4dCwgdGltZVBpY2tlckNvbnRhaW5lcikge1xuICAgIC8vIFRoZSB0aW1lIGNvbnRhaW5lclxuICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCd0aW1lQ29udGFpbmVyJyk7XG4gICAgY29udGFpbmVyLmRhdGFzZXQuY29udGV4dCA9IGNvbnRleHRUZXh0O1xuICAgIHRpbWVQaWNrZXJDb250YWluZXIuYXBwZW5kQ2hpbGQoY29udGFpbmVyKTtcbiAgXG4gICAgY29uc3QgdGltZUZvckNvbnRleHQgPSB7IFtjb250ZXh0VGV4dF06IHt9IH07XG5cbiAgICBzZWxlY3Rpb24ucHVzaCh0aW1lRm9yQ29udGV4dCk7XG4gIFxuICAgIC8vIE1ha2UgbGFiZWxcbiAgICBjb25zdCBsYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICBsYWJlbC5jbGFzc0xpc3QuYWRkKCd0aW1lU2VsZWN0UCcpO1xuICAgIGxhYmVsLnRleHRDb250ZW50ID0gYCR7Y29udGV4dFRleHR9OmA7XG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGxhYmVsKTtcbiAgXG4gICAgLy8gTWFrZSBob3VyIHNlbGVjdG9yXG4gICAgY29uc3QgdGltZVNlbGVjdG9yRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdGltZVNlbGVjdG9yRGl2LmRhdGFzZXQuY29udGV4dCA9IGNvbnRleHRUZXh0O1xuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aW1lU2VsZWN0b3JEaXYpO1xuICBcbiAgICBtYWtlU2VsZWN0b3IoJ2hoJywgMjMsIHRpbWVTZWxlY3RvckRpdiwgY29udGV4dFRleHQsIHRpbWVQaWNrZXJDb250YWluZXIsIHRpbWVGb3JDb250ZXh0KTtcbiAgICBtYWtlU2VsZWN0b3IoJ21tJywgNTksIHRpbWVTZWxlY3RvckRpdiwgY29udGV4dFRleHQsIHRpbWVQaWNrZXJDb250YWluZXIsIHRpbWVGb3JDb250ZXh0KTtcbiAgfVxuICBcbiAgZnVuY3Rpb24gbWFrZVNlbGVjdG9yICh0eXBlLCBsaW1pdCwgdGltZVNlbGVjdG9yRGl2LCBjb250ZXh0VGV4dCwgdGltZVBpY2tlckNvbnRhaW5lciwgdGltZUZvckNvbnRleHQpIHtcbiAgICBjb25zdCBkcm9wRG93biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NlbGVjdCcpO1xuICAgIGRyb3BEb3duLmNsYXNzTGlzdC5hZGQodHlwZSwgJ3RpbWVTZWxlY3QnKTtcbiAgICB0aW1lU2VsZWN0b3JEaXYuYXBwZW5kQ2hpbGQoZHJvcERvd24pO1xuICBcbiAgICBkcm9wRG93bi5kYXRhc2V0LnR5cGUgPSB0eXBlO1xuICAgIGRyb3BEb3duLmRhdGFzZXQuY29udGV4dCA9IGNvbnRleHRUZXh0O1xuICBcbiAgICBjb25zdCBwbGFjZWhvbGRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuICAgIHBsYWNlaG9sZGVyLnRleHRDb250ZW50ID0gdHlwZTtcbiAgICBwbGFjZWhvbGRlci52YWx1ZSA9ICcwMCc7XG4gIFxuICAgIC8vIHtcIlN0YXJ0XCI6e1wiaGhcIjpcIjAwXCJ9fSx7XCJTdGFydFwiOntcIm1tXCI6XCIwMFwifX1cbiAgICB0aW1lRm9yQ29udGV4dFtjb250ZXh0VGV4dF1bdHlwZV0gPSBwbGFjZWhvbGRlci52YWx1ZTtcbiAgICBkcm9wRG93bi5hcHBlbmRDaGlsZChwbGFjZWhvbGRlcik7XG4gIFxuICAgIGxldCBpID0gMDtcbiAgICB3aGlsZSAoaSA8PSBsaW1pdCkge1xuICAgICAgY29uc3QgaG91ciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuICAgICAgbGV0IHRleHQgPSBpLnRvU3RyaW5nKCk7XG4gICAgICBpZiAodGV4dC5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgdGV4dCA9IGAwJHtpfWA7XG4gICAgICB9XG4gICAgICBob3VyLnZhbHVlID0gdGV4dDtcbiAgICAgIGhvdXIudGV4dENvbnRlbnQgPSB0ZXh0O1xuICAgICAgZHJvcERvd24uYXBwZW5kQ2hpbGQoaG91cik7XG4gICAgICBpKys7XG4gICAgfVxuICBcbiAgICBkcm9wRG93bi5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoKSA9PiB7XG4gICAgICB0aW1lRm9yQ29udGV4dFtjb250ZXh0VGV4dF1bdHlwZV0gPSBkcm9wRG93bi52YWx1ZTtcbiAgICAgIHdyaXRlVG9EeW5hbWljRGF0YSgpO1xuICAgICAgd3JpdGVUb0RhdGVEaXYoKTtcbiAgICAgIGVtaXRUaW1lU2VsZWN0ZWRFdmVudCgpO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gd3JpdGVUb0R5bmFtaWNEYXRhICgpIHtcbiAgICBkeW5hbWljRGF0YS5kYXRlc1NlbGVjdGVkQXJyYXlPYmplY3RzW2R5bmFtaWNEYXRhLmRhdGVzU2VsZWN0ZWRBcnJheU9iamVjdHMubGVuZ3RoLTFdLmZvckVhY2goKGRheVNlbGVjdGVkKSA9PiB7XG4gICAgICBjb25zdCB0aW1lcyA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoc2VsZWN0aW9uKSk7XG4gICAgICBkYXlTZWxlY3RlZC50aW1lcyA9IHRpbWVzO1xuICAgICAgY29uc3QgbmFtZXMgPSBPYmplY3Qua2V5cyh0aW1lcyk7XG4gICAgICBPYmplY3QudmFsdWVzKHRpbWVzKS5mb3JFYWNoKCh0aW1lLCBpKSA9PiB7XG4gICAgICAgIGxldCB2YWwgPSBPYmplY3QudmFsdWVzKHRpbWUpO1xuICAgICAgICBsZXQgaGhtbXNzID0gT2JqZWN0LnZhbHVlcyh2YWxbMF0pO1xuICAgICAgICBkYXlTZWxlY3RlZC50aW1lc1tuYW1lc1tpXV0uVVRDID0gaHVtYW5kYXRlVG9VVEMoZGF5U2VsZWN0ZWQuaHVtYW5kYXRlLCBoaG1tc3MpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBodW1hbmRhdGVUb1VUQyAoaHVtYW5kYXRlLCB0aW1lKSB7XG4gICAgY29uc3QgaGggPSAodGltZVswXSkgPyB0aW1lWzBdIDogMDtcbiAgICBjb25zdCBtbSA9ICh0aW1lWzFdKSA/IHRpbWVbMV0gOiAwO1xuICAgIGNvbnN0IHNzID0gKHRpbWVbMl0pID8gdGltZVsyXSA6IDA7XG5cbiAgICBsZXQgaW50cyA9IGh1bWFuZGF0ZS5zcGxpdCgnLScpO1xuICAgIGludHMgPSBpbnRzLm1hcCgoaW50KSA9PiBwYXJzZUludChpbnQpKTtcbiAgICBpbnRzWzFdID0gaW50c1sxXSAtIDE7XG4gICAgcmV0dXJuIERhdGUuVVRDKGludHNbMF0sIGludHNbMV0sIGludHNbMl0sIGhoLCBtbSwgc3MpO1xuICB9XG4gIFxuICBmdW5jdGlvbiByZW1vdmVUaW1lVmFsdWVzT25EYXRlICgpIHtcbiAgICBjb25zdCBkID0gZHluYW1pY0RhdGEuZGF0ZXNTZWxlY3RlZEFycmF5T2JqZWN0cztcbiAgICBjb25zdCBsYXN0Q2hvaWNlID0gZFtkLmxlbmd0aCAtIDFdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGFzdENob2ljZS5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgZGF0ZU9iaiA9IGxhc3RDaG9pY2VbaV07XG4gICAgICBjb25zdCBkYXlEaXYgPSBjYWxlbmRhci5xdWVyeVNlbGVjdG9yKGBbZGF0YS1odW1hbmRhdGU9JyR7ZGF0ZU9iai5odW1hbmRhdGV9J11gKTtcbiAgICAgIGRheURpdi5yZW1vdmVDaGlsZChkYXlEaXYubGFzdENoaWxkKTtcbiAgICAgIGRhdGVPYmoudGltZXMgPSBkYXRlT2JqLnRpbWVzLnNsaWNlKDAsIC0yKTtcbiAgICB9XG4gICAgc2VsZWN0aW9uID0gc2VsZWN0aW9uLnNsaWNlKDAsIC0yKTtcbiAgICBjb25zdCB0aW1lQ2hvb3NlciA9IGNhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoJy50aW1lQ2hvb3NlcicpO1xuICAgIHRpbWVDaG9vc2VyLnJlbW92ZUNoaWxkKHRpbWVDaG9vc2VyLmxhc3RDaGlsZCk7XG4gIH1cblxuICAvKipcbiAgICogdGlja0JveGVzIC0gZGVzY3JpcHRpb25cbiAgICpcbiAgICogQHBhcmFtICB7SFRNTEVsZW1lbnR9IHRpbWVQaWNrZXJFbGVtZW50c0NvbnRhaW5lciBUaGlzIGlzIHRoZSBIVE1MIGVsZW1lbnQgdG8gd2hpY2ggdGhlIGNoZWNrYm94IHdpbGwgYmUgYXBwZW5kZWQuXG4gICAqIEByZXR1cm4ge0hUTUxFbGVtZW50fSBSZXR1cm5zIGEgSFRNTCBjaGVja2JveCB0byBzZWxlY3QgYWxsIGRheXMgb2YgYSBwYXJ0aWN1bGFyIHR5cGUgKGUuZy4gYWxsIE1vbmRheXMpLlxuICAgKiBAZGVzY3JpcHRpb24gTk9UIElNUExFTUVOVEVEXG4gICAqL1xuICBcbiAgZnVuY3Rpb24gc2V0VGltZUZvckFsbFRpY2tCb3ggKHRhcmdldERpdikge1xuICAgIGNvbnN0IGRheSA9IGR5bmFtaWNEYXRhLmRhdGVzU2VsZWN0ZWRBcnJheVtkeW5hbWljRGF0YS5kYXRlc1NlbGVjdGVkQXJyYXkubGVuZ3RoLTFdO1xuICAgIGNvbnN0IGRheUNvZGUgPSBjYWxlbmRhci5xdWVyeVNlbGVjdG9yKGBbZGF0YS1odW1hbmRhdGU9JyR7ZGF5fSddYCkuZGF0YXNldC5kYXlvZndlZWs7XG4gICAgY29uc3QgdGV4dCA9IGZvcm1hdERheVRleHQoZGF5Q29kZSk7XG4gICAgXG4gICAgY29uc3QgbGFiZWxmb3IgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgbGFiZWxmb3IudGV4dENvbnRlbnQgPSB0ZXh0O1xuICAgIGxhYmVsZm9yLmh0bWxGb3IgPSAnc2V0VGltZUZvckFsbCc7XG4gICAgdGFyZ2V0RGl2LmFwcGVuZENoaWxkKGxhYmVsZm9yKTtcblxuICAgIGNvbnN0IHNldFRpbWVGb3JBbGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgIHNldFRpbWVGb3JBbGwuc2V0QXR0cmlidXRlKCd0eXBlJywgJ2NoZWNrYm94Jyk7XG4gICAgc2V0VGltZUZvckFsbC5uYW1lID0gJ3NldFRpbWVGb3JBbGwnO1xuICAgIHRhcmdldERpdi5hcHBlbmRDaGlsZChzZXRUaW1lRm9yQWxsKTtcblxuICAgIHNldFRpbWVGb3JBbGwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAvLyBCb29rIGRhdGVzIG1ldGhvZCBuZWVkcyB0byBiZSBleHBvc2VkIGluIGEgbWFubmVyIGl0IGNhbiBiZSBjYWxsZWQgZnJvbSBoZXJlXG4gICAgfSk7XG4gIH1cbiAgXG5cbiAgLyoqXG4gKiBGb3JtYXRzIHRoZSBkYXkgb2YgdGhlIHdlZWsgYW5kIHJldHVybnMgaXQgYXMgYSBzdHJpbmcuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHRleHRCZWZvcmUgLSBUaGUgdGV4dCB0byBiZSBhZGRlZCBiZWZvcmUgdGhlIGZvcm1hdHRlZCBkYXkuXG4gKiBAcGFyYW0ge3N0cmluZ30gdGV4dEFmdGVyIC0gVGhlIHRleHQgdG8gYmUgYWRkZWQgYWZ0ZXIgdGhlIGZvcm1hdHRlZCBkYXkuXG4gKiBAcGFyYW0ge251bWJlcn0gZGF5T2ZXZWVrIC0gVGhlIGluZGV4IG9mIHRoZSBkYXkgb2YgdGhlIHdlZWsgKDAgZm9yIFN1bmRheSwgMSBmb3IgTW9uZGF5LCBldGMuKS5cbiAqIEByZXR1cm4ge3N0cmluZ30gVGhlIGZvcm1hdHRlZCBkYXkgb2YgdGhlIHdlZWsgYXMgYSBzdHJpbmcuXG4gKi9cbiAgZnVuY3Rpb24gZm9ybWF0RGF5VGV4dCAoZGF5T2ZXZWVrKSB7XG4gICAgY29uc3QgZGF5c0luRnVsbCA9IGxhbmd1YWdlc1tjb25maWcubGFuZ3VhZ2VdLmdlbmVyYWxUaW1lLmRheXNJbkZ1bGw7XG4gICAgY29uc3QgYmVmb3JlVGV4dCA9IGxhbmd1YWdlc1tjb25maWcubGFuZ3VhZ2VdLmZvcm1hdERheVRleHQudGV4dEJlZm9yZTtcbiAgICBjb25zdCBmb3JtYXR0ZWREYXkgPSBkYXlzSW5GdWxsW2RheU9mV2Vla107XG4gICAgY29uc3QgcGx1cmFsaXNtID0gbGFuZ3VhZ2VzW2NvbmZpZy5sYW5ndWFnZV0ucGx1cmFsaXNtO1xuICAgIGNvbnN0IGFmdGVyVGV4dCA9IGxhbmd1YWdlc1tjb25maWcubGFuZ3VhZ2VdLmZvcm1hdERheVRleHQudGV4dEFmdGVyO1xuICAgIHJldHVybiBgJHtiZWZvcmVUZXh0fSAke2Zvcm1hdHRlZERheX0ke3BsdXJhbGlzbX0gJHthZnRlclRleHR9YDtcbiAgfVxuXG59XG5cbmV4cG9ydCB7IEdlbmVyYXRlVGltZUNob29zZXJNb2RhbCB9O1xuIiwiLyplc2xpbnQgcXVvdGVzOiBbXCJlcnJvclwiLCBcImJhY2t0aWNrXCJdKi9cbi8vIEJhY3RpY2tzIGFyZSBlbmZvcmNlZGYgaW4gdGhpcyBmaWxlIHNvIHRoYXQgc3BlY2lhbCBjaGFyYWN0ZXJzIGFyZSBjb3JyZWN0bHkgcmVuZGVyZWQuXG4vKiBMYW5ndWFnZSBkZWZhdWx0cyAqL1xuY29uc3QgZW5HYiA9IHtcbiAgZ2VuZXJhbFRpbWU6IHtcbiAgICBtb250aHM6IFtgSmFudWFyeWAsIGBGZWJydWFyeWAsIGBNYXJjaGAsIGBBcHJpbGAsIGBNYXlgLCBgSnVuZWAsIGBKdWx5YCwgYEF1Z3VzdGAsIGBTZXB0ZW1iZXJgLCBgT2N0b2JlcmAsIGBOb3ZlbWJlcmAsIGBEZWNlbWJlcmBdLFxuICAgIGRheXNJbkZ1bGw6IFtgU3VuZGF5YCwgYE1vbmRheWAsIGBUdWVzZGF5YCwgYFdlZG5lc2RheWAsIGBUaHVyc2RheWAsIGBGcmlkYXlgLCBgU2F0dXJkYXlgXSxcbiAgICBkYXlzVHJ1bmNhdGVkOiBbYFN1bmAsIGBNb25gLCBgVHVlYCwgYFdlZGAsIGBUaHVgLCBgRnJpYCwgYFNhdGBdXG4gIH0sXG4gIHBsdXJhbGlzbTogYHNgLFxuICBmb3JtYXREYXlUZXh0OiB7XG4gICAgdGV4dEJlZm9yZTogYFNldCB0aGVzZSB0aW1lcyBmb3IgYWxsYCxcbiAgICB0ZXh0QWZ0ZXI6IGBgXG4gIH0sXG4gIHRpbWVXaWRnZXQ6IHtcbiAgICBhZGRUaW1lOiBgQWRkIHRpbWU6YCxcbiAgICBzdGFydDogYFN0YXJ0YCxcbiAgICBlbmQ6IGBFbmRgXG4gIH1cbn07XG5cbi8qIExhbmd1YWdlIGRlZmF1bHRzICovXG5jb25zdCBwdFB0ID0ge1xuICBnZW5lcmFsVGltZToge1xuICAgIG1vbnRoczogW2BKYW5laXJvYCwgYEZldmVyZWlyb2AsIGBNYXLDp29gLCBgQWJyaWxgLCBgTWFpb2AsIGBKdW5ob2AsIGBKdWxob2AsIGBBZ29zdG9gLCBgU2V0ZW1icm9gLCBgT3V0dWJyb2AsIGBOb3ZlbWJyb2AsIGBEZXplbWJyb2BdLFxuICAgIGRheXNJbkZ1bGw6IFtgRG9taW5nb2AsIGBTZWd1bmRhLUZlaXJhYCwgYFRlcsOnYS1GZWlyYWAsIGBRdWFydGEtRmVpcmFgLCBgUXVpbnRhLUZlaXJhYCwgYFNleHRhLUZlaXJhYCwgYFPDoWJhZG9gXSxcbiAgICBkYXlzVHJ1bmNhdGVkOiBbYERvbWAsIGBTZWdgLCBgVGVyYCwgYFF1YWAsIGBRdWlgLCBgU2V4YCwgYFNhYmBdXG4gIH0sXG4gIHBsdXJhbGlzbTogYHNgLFxuICBmb3JtYXREYXlUZXh0OiB7XG4gICAgdGV4dEJlZm9yZTogYEFwcGxpcXVlIGVzdGFzIGhvcmFzIGFgLFxuICAgIHRleHRBZnRlcjogYGBcbiAgfSxcbiAgdGltZVdpZGdldDoge1xuICAgIGFkZFRpbWU6IGBBZGljaW9uZSBkdXJhw6fDo286YCxcbiAgICBzdGFydDpgSW7DrWNpb2AsXG4gICAgZW5kOiBgRmltYFxuICB9XG5cbn07XG5cbmNvbnN0IGxhbmd1YWdlcyA9IHsgZW5HYiwgcHRQdCB9O1xuXG5leHBvcnQgeyBsYW5ndWFnZXMgfTtcbiIsImNvbnN0IGNvbG91cnMgPSB7XG4gIG1vbnRoQ29sb3I6ICcjZmMzJyxcbiAgbW9udGhCYWNrZ291bmRCb2xvcjogJyM2Nzk5Y2InLFxuICBkYXlOYW1lQ29sb3I6ICcjMDAwJyxcbiAgZGF5TmFtZUJhY2tncm91bmRDb2xvcjogJyNjY2MnLFxuICBkYXlDb2xvcjogJyMwMDAnLFxuICBkYXlCYWNrZ3JvdW5kQ29sb3I6ICcjZmZmJyxcbiAgbW9udGhCb3JkZXJDb2xvcjogJyNmMTU5MjUnXG59O1xuXG5jb25zdCBzZWxlY3RlZFN0eWxlID0gKGRpdikgPT4ge1xuICBkaXYuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gY29sb3Vycy5tb250aENvbG9yO1xufTtcblxuY29uc3QgdW5zZWxlY3RlZFN0eWxlID0gKGRpdikgPT4ge1xuICBkaXYuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gY29sb3Vycy5kYXlCYWNrZ3JvdW5kQ29sb3I7XG59O1xuXG5leHBvcnQgeyBzZWxlY3RlZFN0eWxlLCB1bnNlbGVjdGVkU3R5bGUsIGNvbG91cnMgfTtcbiJdfQ==
