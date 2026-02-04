(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.calendar = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.blockDaysNotOpen = blockDaysNotOpen;
exports.checkOverlap = checkOverlap;
exports.clearSelection = clearSelection;
exports.debounce = debounce;
exports.generateRandomString = generateRandomString;
exports.getDaysInMonth = getDaysInMonth;
exports.getEarliestDate = getEarliestDate;
exports.humanDate = humanDate;
exports.humandateToUTC = humandateToUTC;
exports.proxyToPlainObjectHelper = proxyToPlainObjectHelper;
exports.sortTimes = sortTimes;
exports.standardDateObject = standardDateObject;
exports.timeValueInMill = timeValueInMill;
var _styles = require("./styles.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
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
function proxyToPlainObjectHelper(proxy) {
  if (Array.isArray(proxy)) {
    // If it's an array, map over the array and convert each element recursively
    return proxy.map(proxyToPlainObjectHelper);
  } else if (proxy !== null && _typeof(proxy) === 'object') {
    // If it's an object (and not null), recursively convert each property
    var plainObject = {};
    for (var key in proxy) {
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
function generateRandomString() {
  var randomString = randomBytes(10);
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
        // day.classList.add('widthShape', 'filler');
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
function debounce(fn, delay) {
  var timer;
  return function () {
    var _this = this;
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    clearTimeout(timer);
    timer = setTimeout(function () {
      return fn.apply(_this, args);
    }, delay);
  };
}

},{"./styles.js":6}],2:[function(require,module,exports){
module.exports = ".calendar {\n  display: flex;\n  flex-wrap: wrap;\n  flex-direction: row;\n  background-color: rgba(240, 248, 255, 0);\n  width: 100%;\n  height: 28.8em;\n  overflow-y: auto;\n  position: relative;\n  color: #333;\n  font-family: Ubuntu, Arial, Helvetica, sans-serif;\n  font-size: 1.2em;\n  font-weight: 700;\n  line-height: 1.5;\n}\n.calendar .blocked {\n  background-color: #333;\n}\n.calendar .filler {\n  pointer-events: none;\n  opacity: 0.3;\n}\n.calendar .preloaded {\n  border-color: #ffcc33;\n  border-style: solid;\n  border-width: 3px;\n  border-radius: 1em;\n  background-color: #337ab7;\n}\n.calendar .timeSelect {\n  padding: 0;\n  width: auto;\n  margin: 0;\n  background-color: #fff;\n  float: right;\n  font-weight: 700;\n  font-family: Arial, Helvetica, sans-serif;\n  border-style: solid;\n  border-radius: 1em;\n  text-align: center;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  border-width: 3px;\n  border-color: #f15925;\n  color: #000;\n  font-size: 0.9em;\n}\n.calendar .timeCont {\n  margin-left: auto;\n  max-width: 20em;\n  background-color: aliceblue;\n  border-style: solid;\n  border-color: #f15925;\n  margin-right: auto;\n  margin-top: 10em;\n}\n.calendar .dayblockrow {\n  display: flex;\n  flex-direction: row;\n  min-width: 100%;\n  background-color: aliceblue;\n}\n.calendar .calendarTimeParent {\n  margin: 0.1em;\n}\n.calendar .calendarTimeParent .calendarTime {\n  font-size: 0.9em;\n  margin-top: 0em;\n  line-height: 1;\n  background-color: aliceblue;\n  color: black;\n  text-align: center;\n  margin: 0px;\n  font-size: 0.8em;\n}\n.calendar .widthShapeDays {\n  width: 14.2857142857%;\n  margin-left: auto;\n  margin-right: auto;\n  text-align: center;\n}\n.calendar .widthShape {\n  width: 14.2857142857%;\n  margin-left: auto;\n  margin-right: auto;\n  text-align: center;\n  min-height: 3.6em;\n  margin-bottom: 0.2em;\n}\n.calendar .monthName {\n  margin: auto;\n  text-align: center;\n  font-family: Ubuntu;\n  font-size: 1.61em;\n  background-color: #337ab7;\n  color: #ffcc33;\n  flex-basis: 100%;\n  border-bottom-style: solid;\n}\n.calendar .weekrow {\n  display: flex;\n  flex-wrap: nowrap;\n  flex-direction: row;\n  background-color: #fff;\n  font-family: \"roboto\", \"arial\";\n}\n.calendar .dayName {\n  color: black;\n  font-family: \"roboto\", \"arial\";\n  font-weight: 600;\n  background-color: #ccc;\n}\n.calendar .month > * {\n  margin-left: 2px;\n  margin-right: 2px;\n}\n.calendar .month {\n  width: 50%;\n  min-width: 300px;\n  margin: auto;\n}\n.calendar .timeChooser {\n  position: static;\n  background-color: aliceblue;\n  margin-left: auto;\n  margin-right: auto;\n}\n.calendar .timeContainer {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.calendar .timeContainer div {\n  display: flex;\n}\n.calendar .timeChooserModal {\n  z-index: 1;\n  width: 100%;\n  height: 100%;\n  background-color: rgba(0, 0, 0, 0.4);\n  position: absolute;\n  margin: 0;\n  padding: 0;\n  border: 0;\n  overflow-x: scroll;\n}\n.calendar .calendarLabel {\n  min-width: 3em;\n  padding: 0em 1em 0em 1em;\n  color: black;\n  font-family: \"roboto\", \"arial\";\n  font-weight: 600;\n  background-color: #ccc;\n  margin: 1em 0 1em 0;\n}\n.calendar .deleteDiv {\n  font-family: Ubuntu;\n  background-color: #337ab7;\n  color: #ffcc33;\n  border-bottom-style: solid;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.calendar .deleteButton {\n  background-color: white;\n  color: #f15925;\n  float: right;\n  font-weight: 700;\n  font-family: Arial, Helvetica, sans-serif;\n  border-style: solid;\n  border-radius: 2em;\n  text-align: center;\n  height: 2em;\n  width: 2em;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  margin: 0 0.5em;\n  font-size: 1.5em;\n}\n.calendar .innerSpanDeleteBtn {\n  text-align: center;\n}\n.calendar .deleteButton:hover,\n.calendar .deleteButton:focus,\n.calendar .timeSelect:hover,\n.calendar .timeSelect:focus {\n  color: #000;\n  text-decoration: none;\n  cursor: pointer;\n}\n.calendar .hour {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 10em;\n}\n.calendar .timeSelectP {\n  display: inline;\n  width: 5em;\n  color: #000;\n}\n.calendar .timeChooser > input[type=checkbox] {\n  outline: #f15925;\n  outline-style: solid;\n}\n.calendar .timeSelect > option {\n  color: #000;\n}\n.calendar .calendar > p,\n.calendar h4,\n.calendar h3,\n.calendar h2,\n.calendar h1,\n.calendar select,\n.calendar option {\n  color: #000;\n}\n.calendar .arrow-up {\n  width: 0;\n  height: 0;\n  border-left: 10px solid transparent;\n  border-right: 10px solid transparent;\n  border-bottom: 10px solid black;\n}\n.calendar .arrow-down {\n  width: 0;\n  height: 0;\n  border-left: 10px solid transparent;\n  border-right: 10px solid transparent;\n  border-top: 10px solid #000;\n}\n.calendar .arrows {\n  float: right;\n  clear: right;\n  position: relative;\n  cursor: pointer;\n  flex-direction: column;\n}\n.calendar .arrow-right {\n  width: 0;\n  height: 0;\n  border-top: 60px solid transparent;\n  border-bottom: 60px solid transparent;\n  border-left: 60px solid green;\n}\n.calendar .arrow-left {\n  width: 0;\n  height: 0;\n  border-top: 10px solid transparent;\n  border-bottom: 10px solid transparent;\n  border-right: 10px solid blue;\n}\n.calendar .dayTime {\n  cursor: pointer;\n}\n.calendar .dayTime > * {\n  pointer-events: none;\n}\n";
},{}],3:[function(require,module,exports){
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
                                                                                                                                                                                                                          * @property {string} hasTheseStyles - Lists styles references in a function
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
      // data-select-multiple
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
      if (target[prop] === value) return true;
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
  var emitDateSelectedEvent = (0, _basicFunctions.debounce)(function () {
    var evt = new CustomEvent('dateSelect', {
      detail: {
        date: (0, _basicFunctions.proxyToPlainObjectHelper)(dynamicData)
      },
      bubbles: true,
      composed: true
    });
    config.calendarContainer.dispatchEvent(evt);
  }, 250);
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
      If called via JS while the component isn't a web component in the strictest sense, it still
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

      /* Create week rows first week, it's reassigned f */
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
  this.preloadedDates = function (dates) {
    calendar.preloadDates(dates);
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
        // timeChooserToggle();
        // rule to check if range is a longer than 1:
        if (dateClickedThrice.date !== lastDate) {
          timeChooserToggle();
        }
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
    priorWasSingle = !!singleDate;

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
    if (typeof preloadedDates[0] !== 'string') {
      throw Error("Dates should be provided as strings in the format YYYY-MM-DD, Preloaded dates is ".concat(preloadedDates, "\n         and the first date is ").concat(preloadedDates[0]));
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
    function getDivs(dates) {
      return dates.map(function (date) {
        return calendar.querySelector("[data-humandate='".concat(date, "']"));
      }).filter(Boolean); // removes nulls
    }

    function blockNotPreloadedDates(dateDivs) {
      var nonOptions = calendar.querySelectorAll('.dayTime');
      for (var i = 0; i < nonOptions.length; i++) {
        var day = nonOptions[i];
        if (!dateDivs.includes(day)) {
          day.classList.add('filler');
        } else {
          day.classList.add('preloaded');
          day.title = config.preloadedTooltip;
        }
      }
    }
    var dateDivs = getDivs(preloadedDates);
    blockNotPreloadedDates(dateDivs);
  }
}

},{"./basicFunctions.js":1,"./calendarApp.css":2,"./displayTimeChooserModal.js":4,"./languages.js":5,"./styles.js":6}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GenerateTimeChooserModal = GenerateTimeChooserModal;
var _languages = require("./languages.js");
var _basicFunctions = require("./basicFunctions.js");
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

  var emitTimeSelectedEvent = (0, _basicFunctions.debounce)(function () {
    var evt = new CustomEvent('timeSelect', {
      detail: {
        date: (0, _basicFunctions.proxyToPlainObjectHelper)(dynamicData)
      },
      bubbles: true,
      composed: true
    });
    config.calendarContainer.dispatchEvent(evt);
  }, 250);
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

},{"./basicFunctions.js":1,"./languages.js":5}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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

},{}]},{},[3])(3)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwcmVCdW5kbGluZ0pTL2Jhc2ljRnVuY3Rpb25zLmpzIiwicHJlQnVuZGxpbmdKUy9jYWxlbmRhckFwcC5jc3MiLCJwcmVCdW5kbGluZ0pTL2NhbGVuZGFyR2VuZXJhdG9yLmpzIiwicHJlQnVuZGxpbmdKUy9kaXNwbGF5VGltZUNob29zZXJNb2RhbC5qcyIsInByZUJ1bmRsaW5nSlMvbGFuZ3VhZ2VzLmpzIiwicHJlQnVuZGxpbmdKUy9zdHlsZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNBQSxJQUFBLE9BQUEsR0FBQSxPQUFBO0FBQThDLFNBQUEsUUFBQSxDQUFBLHNDQUFBLE9BQUEsd0JBQUEsTUFBQSx1QkFBQSxNQUFBLENBQUEsUUFBQSxhQUFBLENBQUEsa0JBQUEsQ0FBQSxnQkFBQSxDQUFBLFdBQUEsQ0FBQSx5QkFBQSxNQUFBLElBQUEsQ0FBQSxDQUFBLFdBQUEsS0FBQSxNQUFBLElBQUEsQ0FBQSxLQUFBLE1BQUEsQ0FBQSxTQUFBLHFCQUFBLENBQUEsS0FBQSxPQUFBLENBQUEsQ0FBQTtBQUFBLFNBQUEsZUFBQSxHQUFBLEVBQUEsQ0FBQSxXQUFBLGVBQUEsQ0FBQSxHQUFBLEtBQUEscUJBQUEsQ0FBQSxHQUFBLEVBQUEsQ0FBQSxLQUFBLDJCQUFBLENBQUEsR0FBQSxFQUFBLENBQUEsS0FBQSxnQkFBQTtBQUFBLFNBQUEsaUJBQUEsY0FBQSxTQUFBO0FBQUEsU0FBQSw0QkFBQSxDQUFBLEVBQUEsTUFBQSxTQUFBLENBQUEscUJBQUEsQ0FBQSxzQkFBQSxpQkFBQSxDQUFBLENBQUEsRUFBQSxNQUFBLE9BQUEsQ0FBQSxHQUFBLE1BQUEsQ0FBQSxTQUFBLENBQUEsUUFBQSxDQUFBLElBQUEsQ0FBQSxDQUFBLEVBQUEsS0FBQSxhQUFBLENBQUEsaUJBQUEsQ0FBQSxDQUFBLFdBQUEsRUFBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLFdBQUEsQ0FBQSxJQUFBLE1BQUEsQ0FBQSxjQUFBLENBQUEsbUJBQUEsS0FBQSxDQUFBLElBQUEsQ0FBQSxDQUFBLE9BQUEsQ0FBQSwrREFBQSxJQUFBLENBQUEsQ0FBQSxVQUFBLGlCQUFBLENBQUEsQ0FBQSxFQUFBLE1BQUE7QUFBQSxTQUFBLGtCQUFBLEdBQUEsRUFBQSxHQUFBLFFBQUEsR0FBQSxZQUFBLEdBQUEsR0FBQSxHQUFBLENBQUEsTUFBQSxFQUFBLEdBQUEsR0FBQSxHQUFBLENBQUEsTUFBQSxXQUFBLENBQUEsTUFBQSxJQUFBLE9BQUEsS0FBQSxDQUFBLEdBQUEsR0FBQSxDQUFBLEdBQUEsR0FBQSxFQUFBLENBQUEsSUFBQSxJQUFBLENBQUEsQ0FBQSxJQUFBLEdBQUEsQ0FBQSxDQUFBLFVBQUEsSUFBQTtBQUFBLFNBQUEsc0JBQUEsQ0FBQSxFQUFBLENBQUEsUUFBQSxDQUFBLFdBQUEsQ0FBQSxnQ0FBQSxNQUFBLElBQUEsQ0FBQSxDQUFBLE1BQUEsQ0FBQSxRQUFBLEtBQUEsQ0FBQSw0QkFBQSxDQUFBLFFBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsT0FBQSxDQUFBLE9BQUEsQ0FBQSxpQkFBQSxDQUFBLElBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsQ0FBQSxHQUFBLElBQUEsUUFBQSxDQUFBLFFBQUEsTUFBQSxDQUFBLENBQUEsTUFBQSxDQUFBLFVBQUEsQ0FBQSx1QkFBQSxDQUFBLElBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsQ0FBQSxHQUFBLElBQUEsTUFBQSxDQUFBLENBQUEsSUFBQSxDQUFBLENBQUEsQ0FBQSxLQUFBLEdBQUEsQ0FBQSxDQUFBLE1BQUEsS0FBQSxDQUFBLEdBQUEsQ0FBQSxpQkFBQSxDQUFBLElBQUEsQ0FBQSxPQUFBLENBQUEsR0FBQSxDQUFBLHlCQUFBLENBQUEsWUFBQSxDQUFBLGVBQUEsQ0FBQSxHQUFBLENBQUEsY0FBQSxNQUFBLENBQUEsQ0FBQSxNQUFBLENBQUEs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QUEsQ0FBQSxJQUFBLENBQUEsQ0FBQSxHQUFBLElBQUEsTUFBQSxDQUFBLENBQUEsSUFBQSxDQUFBLENBQUEsQ0FBQSxLQUFBLEdBQUEsQ0FBQSxDQUFBLE1BQUEsS0FBQSxDQUFBLEdBQUEsQ0FBQSxpQkFBQSxDQUFBLElBQUEsQ0FBQSxPQUFBLENBQUEsR0FBQSxDQUFBLHlCQUFBLENBQUEsWUFBQSxDQUFBLGVBQUEsQ0FBQSxHQUFBLENBQUEsY0FBQSxNQUFBLENBQUEsQ0FBQSxNQUFBLENBQUEsMkJBQUEsQ0FBQSxRQUFBLENBQUEsYUFBQSxDQUFBO0FBQUEsU0FBQSxnQkFBQSxHQUFBLFFBQUEsS0FBQSxDQUFBLE9BQUEsQ0FBQSxHQUFBLFVBQUEsR0FBQTtBQUFBLFNBQUEsUUFBQSxDQUFBLHNDQUFBLE9BQUEsd0JBQUEsTUFBQSx1QkFBQSxNQUFBLENBQUEsUUFBQSxhQUFBLENBQUEsa0JBQUEsQ0FBQSxnQkFBQSxDQUFBLFdBQUEsQ0FBQSx5QkFBQSxNQUFBLElBQUEsQ0FBQSxDQUFBLFdBQUEsS0FBQSxNQUFBLElBQUEsQ0FBQSxLQUFBLE1BQUEsQ0FBQSxTQUFBLHFCQUFBLENBQUEsS0FBQSxPQUFBLENBQUEsQ0FBQTtBQUFBLFNBQUEsa0JBQUEsTUFBQSxFQUFBLEtBQUEsYUFBQSxDQUFBLE1BQUEsQ0FBQSxHQUFBLEtBQUEsQ0FBQSxNQUFBLEVBQUEsQ0FBQSxVQUFBLFVBQUEsR0FBQSxLQUFBLENBQUEsQ0FBQSxHQUFBLFVBQUEsQ0FBQSxVQUFBLEdBQUEsVUFBQSxDQUFBLFVBQUEsV0FBQSxVQUFBLENBQUEsWUFBQSx3QkFBQSxVQUFBLEVBQUEsVUFBQSxDQUFBLFFBQUEsU0FBQSxNQUFBLENBQUEsY0FBQSxDQUFBLE1BQUEsRUFBQSxjQUFBLENBQUEsVUFBQSxDQUFBLEdBQUEsR0FBQSxVQUFBO0FBQUEsU0FBQSxhQUFBLFdBQUEsRUFBQSxVQUFBLEVBQUEsV0FBQSxRQUFBLFVBQUEsRUFBQSxpQkFBQSxDQUFBLFdBQUEsQ0FBQSxTQUFBLEVBQUEsVUFBQSxPQUFBLFdBQUEsRUFB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VUFBQSxZQUFBLFdBQUEsTUFBQSxFQUFBLElBQUEsRUFBQSxLQUFBLFFBQUEsQ0FBQSxXQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsS0FBQSxDQUFBLENBQUEsRUFBQSxJQUFBLE9BQUEsV0FBQSxHQUFBLFFBQUEsQ0FBQSxJQUFBLENBQUEsS0FBQSxDQUFBLE1BQUEsRUFBQSxDQUFBLE9BQUEsUUFBQSxPQUFBLFdBQUEsUUFBQSxLQUFBLEVBQUEsZUFBQSxDQUFBLFFBQUEsRUFBQSxLQUFBLENBQUEsU0FBQSxVQUFBLFFBQUEsY0FBQSxVQUFBLENBQUEsS0FBQSxPQUFBLFNBQUE7QUFBQSxTQUFBLDBCQUFBLGVBQUEsT0FBQSxxQkFBQSxPQUFBLENBQUEsU0FBQSxvQkFBQSxPQUFBLENBQUEsU0FBQSxDQUFBLElBQUEsMkJBQUEsS0FBQSxvQ0FBQSxPQUFBLENBQUEsU0FBQSxDQUFBLE9BQUEsQ0FBQSxJQUFBLENBQUEsT0FBQSxDQUFBLFNBQUEsQ0FBQSxPQUFBLDhDQUFBLENBQUE7QUFBQSxTQUFBLGtCQUFBLEVBQUEsV0FBQSxRQUFBLENBQUEsUUFBQSxDQUFBLElBQUEsQ0FBQSxFQUFBLEVBQUEsT0FBQTtBQUFBLFNBQUEsZ0JBQUEsQ0FBQSxFQUFBLENBQUEsSUFBQSxlQUFBLEdBQUEsTUFBQSxDQUFBLGNBQUEsR0FBQSxNQUFBLENBQUEsY0FBQSxDQUFBLElBQUEsY0FBQSxnQkFBQSxDQUFBLEVBQUEsQ0FBQSxJQUFBLENBQUEsQ0FBQSxTQUFBLEdBQUEsQ0FBQSxTQUFBLENBQUEsWUFBQSxlQUFBLENBQUEsQ0FBQSxFQUFBLENBQUE7QUFBQSxTQUFBLGdCQUFBLENBQUEsSUFBQSxlQUFBLEdBQUEsTUFBQSxDQUFBLGNBQUEsR0FBQSxNQUFBLENBQUEsY0FBQSxDQUFBLElBQUEsY0FBQSxnQkFBQSxDQUFBLFdBQUEsQ0FBQSxDQUFBLFNBQUEsSUFBQSxNQUFBLENBQUEsY0FBQSxDQUFBLENBQUEsYUFBQSxlQUFBLENBQUEsQ0FBQSxLQWxCdEM7QUFDQTtBQUNBO0FBQ0Esd05BSEEsQ0FLQTtB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LENBQUM7QUFFRCxJQUFNLGFBQWEsR0FBQSxPQUFBLENBQUEsYUFBQSxHQUFHLFNBQWhCLGFBQWEsQ0FBSSxHQUFHLEVBQUs7RUFDN0IsR0FBRyxDQUFDLEtBQUssQ0FBQyxlQUFlLEdBQUcsT0FBTyxDQUFDLFVBQVU7QUFDaEQsQ0FBQztBQUVELElBQU0sZUFBZSxHQUFBLE9BQUEsQ0FBQSxlQUFBLEdBQUcsU0FBbEIsZUFBZSxDQUFJLEdBQUcsRUFBSztFQUMvQixHQUFHLENBQUMsS0FBSyxDQUFDLGVBQWUsR0FBRyxPQUFPLENBQUMsa0JBQWtCO0FBQ3hELENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJpbXBvcnQgeyB1bnNlbGVjdGVkU3R5bGUgfSBmcm9tICcuL3N0eWxlcy5qcyc7XG5cbi8qKlxuICogQWRkcyAxIHRvIHRoZSBtb250aCBpbiBhIGdpdmVuIGRhdGUgdG8gbWFrZSBpdCBtb3JlIGh1bWFuLXJlYWRhYmxlLlxuICogQHBhcmFtIHtzdHJpbmd9IGRhdGUgLSBUaGUgZGF0ZSBpbiB0aGUgZm9ybWF0ICdZWVlZLU1NLUREJyBvciAnWVlZWS1NLUQnLlxuICogQHJldHVybnMge3N0cmluZ30gLSBUaGUgbW9kaWZpZWQgZGF0ZSBpbiB0aGUgZm9ybWF0ICdZWVlZLU1NLUREJy5cbiAqIEB0aHJvd3Mge0Vycm9yfSAtIElmIHRoZSBkYXRlIHBhcmFtZXRlciBpcyBub3QgaW4gdGhlIGZvcm1hdCAnWVlZWS1NTS1ERCcgb3IgJ1lZWVktTS1EJy5cbiAqL1xuZnVuY3Rpb24gaHVtYW5EYXRlIChkYXRlKSB7XG4gIGNvbnN0IGRhdGVQYXJ0cyA9IGRhdGUuc3BsaXQoJy0nKTtcbiAgY29uc3QgbW9udGggPSBwYXJzZUludChkYXRlUGFydHNbMV0pICsgMTtcbiAgY29uc3QgZGF5ID0gcGFyc2VJbnQoZGF0ZVBhcnRzWzJdKTtcbiAgY29uc3QgbW9kaWZpZWRNb250aCA9IG1vbnRoIDwgMTAgPyBgMCR7bW9udGh9YCA6IG1vbnRoO1xuICBjb25zdCBtb2RpZmllZERheSA9IGRheSA8IDEwID8gYDAke2RheX1gIDogZGF5O1xuICBjb25zdCBtb2RpZmllZERhdGUgPSBgJHtkYXRlUGFydHNbMF19LSR7bW9kaWZpZWRNb250aH0tJHttb2RpZmllZERheX1gO1xuICByZXR1cm4gbW9kaWZpZWREYXRlO1xufVxuXG4vKipcbiAqIENvbnZlcnRzIGEgaHVtYW4gZGF0ZSBzdHJpbmcgdG8gVVRDIHRpbWVzdGFtcC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gaHVtYW5kYXRlIC0gVGhlIGh1bWFuLXJlYWRhYmxlIGRhdGUgc3RyaW5nIGluIHRoZSBmb3JtYXQgXCJZWVlZLU1NLUREXCIuXG4gKiBAcmV0dXJuIHtudW1iZXJ9IC0gVGhlIFVUQyB0aW1lc3RhbXAgaW4gbWlsbGlzZWNvbmRzLlxuICovXG5mdW5jdGlvbiBodW1hbmRhdGVUb1VUQyAoaHVtYW5kYXRlKSB7XG4gIGxldCBpbnRzID0gaHVtYW5kYXRlLnNwbGl0KCctJyk7XG4gIGludHMgPSBpbnRzLm1hcCgoaW50KSA9PiBwYXJzZUludChpbnQpKTtcbiAgaW50c1sxXSA9IGludHNbMV0gLSAxO1xuICByZXR1cm4gRGF0ZS5VVEMoaW50c1swXSwgaW50c1sxXSwgaW50c1syXSk7XG59XG5cbi8vIG1vZGVsIG9iamVjdFxuY29uc3QgZGF0ZU9iamVjdFRlbXBsYXRlID0geyBkYXk6ICdkYXknLCBodW1hbmRhdGU6ICdZWVlZLU1NLUREJywgaW5kZXg6ICcwJywgVVRDOiAxNjk4Mjc4NDAwMDAwIH07XG4vKipcbiAqIENyZWF0ZXMgYSBzdGFuZGFyZCBkYXRlIG9iamVjdCB3aXRoIHRoZSBnaXZlbiBkYXRlLlxuICpcbiAqIEBwYXJhbSB7YW55fSBkYXRlIC0gSXMgYSBzdHJpbmcgWVlZWS1NTS1ERCBtb250aHMgYXJlIGNvdW50ZWQgZnJvbSAwLlxuICogQHJldHVybiB7b2JqZWN0fSBUaGUgc3RhbmRhcmQgZGF0ZSBvYmplY3Qgd2l0aCB0aGUgZ2l2ZW4gZGF0ZS5cbiAqL1xuZnVuY3Rpb24gc3RhbmRhcmREYXRlT2JqZWN0IChkYXRlKSB7XG4gIGNvbnN0IG9iaiA9IE9iamVjdC5jcmVhdGUoZGF0ZU9iamVjdFRlbXBsYXRlKTtcbiAgb2JqLmRheSA9IGRhdGUuZGF0YXNldC5kYXk7XG4gIG9iai5odW1hbmRhdGUgPSBkYXRlLmRhdGFzZXQuaHVtYW5kYXRlO1xuICBvYmouaW5kZXggPSBkYXRlLmRhdGFzZXQuZGF5aW5kZXg7XG4gIG9iai5VVEMgPSBodW1hbmRhdGVUb1VUQyhkYXRlLmRhdGFzZXQuaHVtYW5kYXRlKTtcbiAgcmV0dXJuIG9iajtcbn1cblxuLyoqXG4gKiBDYWxjdWxhdGVzIHRoZSB0aW1lIHZhbHVlIGluIG1pbGxpc2Vjb25kcyBiYXNlZCBvbiB0aGUgZ2l2ZW4gdGltZS5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdGltZSAtIFRoZSB0aW1lIGluIHRoZSBmb3JtYXQgXCJISDpNTVwiLlxuICogQHJldHVybiB7bnVtYmVyfSBUaGUgdGltZSB2YWx1ZSBpbiBtaWxsaXNlY29uZHMuXG4gKlxuICogQGhhc1Rlc3RzXG4gKlxuICogQGV4YW1wbGVcbiAqIC8vIEV4YW1wbGUgdXNhZ2U6XG4gKiBjb25zdCB0aW1lVmFsdWUgPSB0aW1lVmFsdWVJbk1pbGwoJzEyOjMwJyk7XG4gKi9cblxuZnVuY3Rpb24gdGltZVZhbHVlSW5NaWxsICh0aW1lKSB7XG4gIGlmICghdGltZS5pbmNsdWRlcygnOicpKSB7XG4gICAgY29uc3QgZSA9IG5ldyBFcnJvcignRXhwZWN0cyBhIHRpbWUgc3RyaW5nIEhIOk1NJyk7XG4gICAgdGhyb3cgZTtcbiAgfVxuICBjb25zdCBbaG91cnMsIG1pbnV0ZXNdID0gdGltZS5zcGxpdCgnOicpO1xuICByZXR1cm4gKHBhcnNlSW50KGhvdXJzKSAqIDYwICogNjAgKiAxMDAwKSArIChwYXJzZUludChtaW51dGVzKSAqIDYwICogMTAwMCk7XG59XG5cbi8qKlxuICogZXREYXlzSW5Nb250aCAtIEdldCBudW1iZXIgb2YgZGF5cyBpbiBtb250aFxuICpcbiAqIEBwYXJhbSAgeyFudW1iZXJ9IG1vbnRoIFRoZSBudW1iZXIgb2YgdGhlIGNvcnJlc3BvbmRpbmcgbW9udGguXG4gKiBAcGFyYW0gIHshbnVtYmVyfSB5ZWFyICBUaGUgY29ycmVzcG9uZGluZyB5ZWFyLlxuICogQHJldHVybiB7bnVtYmVyfSBSZXR1cm5zIGEgbnVtYmVyIGNvcnJlc3BvbmRpbmcgdG8gdGhlIG51bWJlciBvZiBkYXlzIGZvciB0aGUgZGF0ZSBpbiBwb2ludC5cbiAqL1xuZnVuY3Rpb24gZ2V0RGF5c0luTW9udGggKG1vbnRoLCB5ZWFyKSB7XG4gIHJldHVybiBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMCkuZ2V0RGF0ZSgpO1xufVxuXG4vKipcbiAqIENsZWFycyB0aGUgc2VsZWN0aW9uIGluIHRoZSBjYWxlbmRhciBieSByZW1vdmluZyB0aGUgc2VsZWN0ZWQgZGF0ZXMgYW5kXG4gKiByZXNldHRpbmcgdGhlIGR5bmFtaWMgZGF0YS5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gY2FsZW5kYXIgLSBUaGUgY2FsZW5kYXIgY29tcG9uZW50LlxuICogQHBhcmFtIHtPYmplY3R9IGR5bmFtaWNEYXRhIC0gVGhlIGR5bmFtaWMgZGF0YSBvYmplY3QuXG4gKiBAcmV0dXJuIHt1bmRlZmluZWR9IFRoaXMgZnVuY3Rpb24gZG9lcyBub3QgcmV0dXJuIGEgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIGNsZWFyU2VsZWN0aW9uIChjYWxlbmRhciwgZHluYW1pY0RhdGEpIHtcbiAgY29uc3QgZGF0ZXNPYmpTdG9yZSA9IGR5bmFtaWNEYXRhLmRhdGVzU2VsZWN0ZWRBcnJheU9iamVjdHM7XG4gIGNvbnN0IGRhdGVzSW5kZXggPSBkeW5hbWljRGF0YS5kYXRlc1NlbGVjdGVkQXJyYXk7XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRlc09ialN0b3JlLmxlbmd0aDsgaSsrKSB7XG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBkYXRlc0luZGV4Lmxlbmd0aDsgaisrKSB7XG4gICAgICBkYXRlc0luZGV4W2pdLmZvckVhY2goKGRhdGUpID0+IHtcbiAgICAgICAgY29uc3QgZGF0ZURpdiA9IGNhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLWh1bWFuZGF0ZT0nJHtkYXRlfSddYCk7XG4gICAgICAgIHVuc2VsZWN0ZWRTdHlsZShkYXRlRGl2KTtcbiAgICAgICAgd2hpbGUgKGRhdGVEaXYuY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGRhdGVEaXYucmVtb3ZlQ2hpbGQoZGF0ZURpdi5sYXN0Q2hpbGQpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpID09PSBkYXRlc09ialN0b3JlLmxlbmd0aCAtIDEgJiYgaiA9PT0gZGF0ZXNJbmRleC5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgZGF0ZXNPYmpTdG9yZS5sZW5ndGggPSAwO1xuICAgICAgICAgIGRhdGVzSW5kZXgubGVuZ3RoID0gMDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogQHBhcmFtIHtudW1iZXJ9IFtsZW5ndGg9MTBdIC1sZW5ndGggdGhlIGRlc2lyZWQgbGVuZ3RoIG9mIHRoZSBzdHJpbmcgb2YgbnVtYmVycy5cbiAqIEByZXR1cm5zIGEgc3RyaW5nIG9mIHJhbmRvbSBkaWdpdHMgb2YgYSBzcGVjaWZpZWQgbGVuZ3RoLlxuICovXG5cbmZ1bmN0aW9uIHJhbmRvbUJ5dGVzIChsZW5ndGgpIHtcbiAgaWYgKGxlbmd0aCA+IDgwKSB7XG4gICAgY29uc3QgZSA9IG5ldyBFcnJvcigncmFuZG9tQnl0ZXMgbGVuZ3RoIGNhbiBiZSBtb3JlIHRoYW4gODAwIGRpZ2l0cycpO1xuICAgIHRocm93IGU7XG4gIH1cbiAgY29uc3QgYXJyYXkgPSBuZXcgVWludDMyQXJyYXkoMTAwKTtcbiAgd2luZG93LmNyeXB0by5nZXRSYW5kb21WYWx1ZXMoYXJyYXkpO1xuICBsZXQgc3QgPSAnJztcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7IGkrKykge1xuICAgIHN0ICs9IGFycmF5W2ldO1xuICAgIGlmIChpID09PSBhcnJheS5sZW5ndGggLSAxKSB7XG4gICAgICByZXR1cm4gc3Quc2xpY2Uoc3QubGVuZ3RoIC0gKGxlbmd0aCB8fCAxMCkpO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBwcm94eVRvUGxhaW5PYmplY3RIZWxwZXIgKHByb3h5KSB7XG4gIGlmIChBcnJheS5pc0FycmF5KHByb3h5KSkge1xuICAgIC8vIElmIGl0J3MgYW4gYXJyYXksIG1hcCBvdmVyIHRoZSBhcnJheSBhbmQgY29udmVydCBlYWNoIGVsZW1lbnQgcmVjdXJzaXZlbHlcbiAgICByZXR1cm4gcHJveHkubWFwKHByb3h5VG9QbGFpbk9iamVjdEhlbHBlcik7XG4gIH0gZWxzZSBpZiAocHJveHkgIT09IG51bGwgJiYgdHlwZW9mIHByb3h5ID09PSAnb2JqZWN0Jykge1xuICAgIC8vIElmIGl0J3MgYW4gb2JqZWN0IChhbmQgbm90IG51bGwpLCByZWN1cnNpdmVseSBjb252ZXJ0IGVhY2ggcHJvcGVydHlcbiAgICBjb25zdCBwbGFpbk9iamVjdCA9IHt9O1xuICAgIGZvciAoY29uc3Qga2V5IGluIHByb3h5KSB7XG4gICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHByb3h5LCBrZXkpKSB7XG4gICAgICAgIHBsYWluT2JqZWN0W2tleV0gPSBwcm94eVRvUGxhaW5PYmplY3RIZWxwZXIocHJveHlba2V5XSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBwbGFpbk9iamVjdDtcbiAgfSBlbHNlIHtcbiAgICAvLyBGb3IgcHJpbWl0aXZlIHZhbHVlcyAobnVtYmVycywgc3RyaW5ncywgZXRjLiksIGp1c3QgcmV0dXJuIHRoZSB2YWx1ZVxuICAgIHJldHVybiBwcm94eTtcbiAgfVxufVxuXG5mdW5jdGlvbiBnZW5lcmF0ZVJhbmRvbVN0cmluZyAoKSB7XG4gIGNvbnN0IHJhbmRvbVN0cmluZyA9IHJhbmRvbUJ5dGVzKDEwKTtcbiAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjYWxlbmRhci0nICsgcmFuZG9tU3RyaW5nKSkge1xuICAgIHJldHVybiBnZW5lcmF0ZVJhbmRvbVN0cmluZygpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiByYW5kb21TdHJpbmc7XG4gIH1cbn1cblxuLy8gV0UgV0VSRSBTRVRUSU5HIFVQIFRIRSBDQUxFTkRBUiBUTyBSRU5ERVIgREFURVMgSU4gVEhFIFBBU1Q6XG4vKiBXYXJuaW5nOiBDb250ZW1wbGF0ZXMgZGF5bGlnaHQgc2F2aW5nIHRpbWUgKi9cblxuLyoqXG4gKiBDYWxjdWxhdGVzIGFuZCByZXR1cm5zIHRoZSBlYXJsaWVzdCBkYXRlIGZyb20gYSBnaXZlbiBhcnJheSBvZiBwcmVsb2FkZWQgZGF0ZXMuXG4gKlxuICogQHBhcmFtIHtBcnJheX0gcHJlbG9hZGVkRGF0ZXMgLSBBbiBhcnJheSBvZiBwcmVsb2FkZWQgZGF0ZXMuXG4gKiBAcmV0dXJuIHtEYXRlfSBUaGUgZWFybGllc3QgZGF0ZSBmcm9tIHRoZSBwcmVsb2FkZWQgZGF0ZXMuXG4gKi9cbmZ1bmN0aW9uIGdldEVhcmxpZXN0RGF0ZSAocHJlbG9hZGVkRGF0ZXMpIHtcbiAgY29uc3Qgb3JkZXIgPSBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBwcmVsb2FkZWREYXRlcy5sZW5ndGg7IGkrKykge1xuICAgIGlmIChpID09PSAwKSB7XG4gICAgICBvcmRlci5wdXNoKG5ldyBEYXRlKCkuZ2V0VGltZSgpKTtcbiAgICB9XG4gICAgb3JkZXIucHVzaChuZXcgRGF0ZShwcmVsb2FkZWREYXRlc1tpXSkuZ2V0VGltZSgpKTtcbiAgICBpZiAoaSA9PT0gcHJlbG9hZGVkRGF0ZXMubGVuZ3RoIC0gMSkge1xuICAgICAgb3JkZXIuc29ydCgpO1xuICAgICAgY29uc3QgZCA9IG5ldyBEYXRlKG9yZGVyWzBdKTtcbiAgICAgIHJldHVybiBkO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEdlbmVyYXRlcyBhIGZ1bmN0aW9uIGNvbW1lbnQgZm9yIHRoZSBnaXZlbiBmdW5jdGlvbiBib2R5IGluIGEgbWFya2Rvd25cbiAqIGNvZGUgYmxvY2sgd2l0aCB0aGUgY29ycmVjdCBsYW5ndWFnZSBzeW50YXguXG4gKlxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gY2FsZW5kYXIgLSBUaGUgY2FsZW5kYXIgY29tcG9uZW50LlxuICogQHBhcmFtIHtBcnJheX0gZGF0ZXNPcGVuIC0gQW4gYXJyYXkgb2Ygb3BlbiBkYXRlcy5cbiAqL1xuZnVuY3Rpb24gYmxvY2tEYXlzTm90T3BlbiAoY2FsZW5kYXIsIGRhdGVzT3Blbikge1xuICBpZiAoY2FsZW5kYXIgJiYgZGF0ZXNPcGVuKSB7XG4gICAgY29uc3QgYWxsRGF5cyA9IEFycmF5LmZyb20oY2FsZW5kYXIucXVlcnlTZWxlY3RvckFsbCgnLmRheVRpbWUnKSkubWFwKChlbCkgPT4geyByZXR1cm4gZWwuZGF0YXNldC5odW1hbmRhdGU7IH0pO1xuICAgIGNvbnN0IG9wZW5EYXlzID0gZGF0ZXNPcGVuLm1hcCgoZWwpID0+IHsgcmV0dXJuIGVsLmRheTsgfSk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFsbERheXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChvcGVuRGF5cy5pbmRleE9mKGFsbERheXNbaV0pID09PSAtMSkge1xuICAgICAgICBjb25zdCBkYXkgPSBjYWxlbmRhci5xdWVyeVNlbGVjdG9yKGBbaWQ9XCIke2FsbERheXNbaV19XCJdYCk7XG4gICAgICAgIC8vIGRheS5jbGFzc0xpc3QuYWRkKCd3aWR0aFNoYXBlJywgJ2ZpbGxlcicpO1xuICAgICAgICBkYXkuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJ3doaXRlJztcbiAgICAgICAgZGF5LnRpdGxlID0gJ0Nsb3NlZCBvbiB0aGlzIGRheSc7XG5cbiAgICAgICAgY29uc3QgY2xvc2VkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgICAgICBjbG9zZWQuY2xhc3NMaXN0LmFkZCgnY2FsZW5kYXJUaW1lJyk7XG4gICAgICAgIGNsb3NlZC50ZXh0Q29udGVudCA9ICdjbG9zZWQnO1xuXG4gICAgICAgIGRheS5hcHBlbmRDaGlsZChjbG9zZWQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBzb3J0VGltZXMgKHZhbCkge1xuICBjb25zdCBzb3J0ZWQgPSBbXTtcbiAgcmV0dXJuIGVudW1lcmF0ZSh2YWwpO1xuXG4gIGZ1bmN0aW9uIHNvcnROdW1iZXIgKGEsIGIpIHtcbiAgICByZXR1cm4gYSAtIGI7XG4gIH1cblxuICBmdW5jdGlvbiBlbnVtZXJhdGUgKHZhbHVlcykge1xuICAgIGNvbnN0IG51bWVyaWNhbEVxdWl2YWxlbnQgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHZhbHVlcy5sZW5ndGg7IGkrKykge1xuICAgICAgbnVtZXJpY2FsRXF1aXZhbGVudC5wdXNoKHRpbWVWYWx1ZUluTWlsbCh2YWx1ZXNbaV0pKTtcbiAgICAgIGlmIChpID09PSB2YWx1ZXMubGVuZ3RoIC0gMSkge1xuICAgICAgICByZXR1cm4gc29ydCh2YWx1ZXMsIG51bWVyaWNhbEVxdWl2YWxlbnQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHNvcnQgKHZhbHVlcywgbnVtZXJpY2FsRXF1aXZhbGVudCkge1xuICAgIGNvbnN0IG51bWVyaWNhbEVxdWl2YWxlbnRDbG9uZSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkobnVtZXJpY2FsRXF1aXZhbGVudCkpO1xuICAgIGNvbnN0IHNvcnRlZEludCA9IG51bWVyaWNhbEVxdWl2YWxlbnQuc29ydChzb3J0TnVtYmVyKTtcbiAgICBmb3IgKGxldCBwID0gMDsgcCA8IG51bWVyaWNhbEVxdWl2YWxlbnRDbG9uZS5sZW5ndGg7IHArKykge1xuICAgICAgY29uc3QgbmV3SW5kZXggPSBzb3J0ZWRJbnQuaW5kZXhPZihudW1lcmljYWxFcXVpdmFsZW50Q2xvbmVbcF0pO1xuICAgICAgc29ydGVkLnNwbGljZShwLCAxLCB2YWx1ZXNbbmV3SW5kZXhdKTtcbiAgICAgIGlmIChwID09PSBudW1lcmljYWxFcXVpdmFsZW50Lmxlbmd0aCAtIDEpIHtcbiAgICAgICAgcmV0dXJuIHNvcnRlZDtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBDaGVja3MgZm9yIG92ZXJsYXAgaW4gYW4gYXJyYXkgb2YgdmFsdWVzLlxuICpcbiAqIEBwYXJhbSB7QXJyYXl9IHZhbHVlcyAtIFRoZSBhcnJheSBvZiB2YWx1ZXMgdG8gY2hlY2sgZm9yIG92ZXJsYXAuXG4gKiBAcmV0dXJuIHtib29sZWFufSAtIFJldHVybnMgdHJ1ZSBpZiBvdmVybGFwIGlzIGZvdW5kLCBmYWxzZSBvdGhlcndpc2UuXG4gKiBAQGRlc2NyaXB0aW9uIG5vdCBjYWxsZWQgYW55d2hlcmUgKHlldClcbiAqL1xuZnVuY3Rpb24gY2hlY2tPdmVybGFwICh2YWx1ZXMpIHtcbiAgY29uc3QgbnVtZXJpY2FsRXF1aXZhbGVudCA9IHZhbHVlcy5tYXAodGltZVZhbHVlSW5NaWxsKTtcblxuICBmb3IgKGxldCBjdXJyZW50SW5kZXggPSAyOyBjdXJyZW50SW5kZXggPCBudW1lcmljYWxFcXVpdmFsZW50Lmxlbmd0aDsgY3VycmVudEluZGV4ICs9IDIpIHtcbiAgICBjb25zdCBjdXJyZW50U3RhcnQgPSBudW1lcmljYWxFcXVpdmFsZW50W2N1cnJlbnRJbmRleF07XG4gICAgY29uc3QgY3VycmVudEVuZCA9IG51bWVyaWNhbEVxdWl2YWxlbnRbY3VycmVudEluZGV4ICsgMV07XG5cbiAgICBmb3IgKGxldCBjb21wYXJpc29uSW5kZXggPSAwOyBjb21wYXJpc29uSW5kZXggPCBudW1lcmljYWxFcXVpdmFsZW50Lmxlbmd0aDsgY29tcGFyaXNvbkluZGV4ICs9IDIpIHtcbiAgICAgIGlmIChjdXJyZW50SW5kZXggIT09IGNvbXBhcmlzb25JbmRleCkge1xuICAgICAgICBjb25zdCBjb21wYXJpc29uU3RhcnQgPSBudW1lcmljYWxFcXVpdmFsZW50W2NvbXBhcmlzb25JbmRleF07XG4gICAgICAgIGNvbnN0IGNvbXBhcmlzb25FbmQgPSBudW1lcmljYWxFcXVpdmFsZW50W2NvbXBhcmlzb25JbmRleCArIDFdO1xuXG4gICAgICAgIGlmIChjb21wYXJpc29uRW5kID49IGN1cnJlbnRTdGFydCAmJiBjb21wYXJpc29uRW5kIDw9IGN1cnJlbnRFbmQpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIGlmIChjdXJyZW50U3RhcnQgPj0gY29tcGFyaXNvblN0YXJ0ICYmIGN1cnJlbnRFbmQgPD0gY29tcGFyaXNvbkVuZCkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGVsc2UgaWYgKGN1cnJlbnRTdGFydCA9PT0gY29tcGFyaXNvblN0YXJ0ICYmIGN1cnJlbnRFbmQgPT09IGNvbXBhcmlzb25FbmQpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIGlmIChjdXJyZW50RW5kID49IGNvbXBhcmlzb25TdGFydCAmJiBjdXJyZW50RW5kIDw9IGNvbXBhcmlzb25FbmQpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBkZWJvdW5jZSAoZm4sIGRlbGF5KSB7XG4gIGxldCB0aW1lcjtcbiAgcmV0dXJuIGZ1bmN0aW9uICguLi5hcmdzKSB7XG4gICAgY2xlYXJUaW1lb3V0KHRpbWVyKTtcbiAgICB0aW1lciA9IHNldFRpbWVvdXQoKCkgPT4gZm4uYXBwbHkodGhpcywgYXJncyksIGRlbGF5KTtcbiAgfTtcbn1cblxuZXhwb3J0IHtcbiAgdGltZVZhbHVlSW5NaWxsLCBjaGVja092ZXJsYXAsIGNsZWFyU2VsZWN0aW9uLCBnZXREYXlzSW5Nb250aCxcbiAgZ2VuZXJhdGVSYW5kb21TdHJpbmcsIGdldEVhcmxpZXN0RGF0ZSwgYmxvY2tEYXlzTm90T3BlbixcbiAgc29ydFRpbWVzLCBodW1hbkRhdGUsIGh1bWFuZGF0ZVRvVVRDLCBzdGFuZGFyZERhdGVPYmplY3QsXG4gIHByb3h5VG9QbGFpbk9iamVjdEhlbHBlciwgZGVib3VuY2Vcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IFwiLmNhbGVuZGFyIHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBmbGV4LXdyYXA6IHdyYXA7XFxuICBmbGV4LWRpcmVjdGlvbjogcm93O1xcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNDAsIDI0OCwgMjU1LCAwKTtcXG4gIHdpZHRoOiAxMDAlO1xcbiAgaGVpZ2h0OiAyOC44ZW07XFxuICBvdmVyZmxvdy15OiBhdXRvO1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgY29sb3I6ICMzMzM7XFxuICBmb250LWZhbWlseTogVWJ1bnR1LCBBcmlhbCwgSGVsdmV0aWNhLCBzYW5zLXNlcmlmO1xcbiAgZm9udC1zaXplOiAxLjJlbTtcXG4gIGZvbnQtd2VpZ2h0OiA3MDA7XFxuICBsaW5lLWhlaWdodDogMS41O1xcbn1cXG4uY2FsZW5kYXIgLmJsb2NrZWQge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogIzMzMztcXG59XFxuLmNhbGVuZGFyIC5maWxsZXIge1xcbiAgcG9pbnRlci1ldmVudHM6IG5vbmU7XFxuICBvcGFjaXR5OiAwLjM7XFxufVxcbi5jYWxlbmRhciAucHJlbG9hZGVkIHtcXG4gIGJvcmRlci1jb2xvcjogI2ZmY2MzMztcXG4gIGJvcmRlci1zdHlsZTogc29saWQ7XFxuICBib3JkZXItd2lkdGg6IDNweDtcXG4gIGJvcmRlci1yYWRpdXM6IDFlbTtcXG4gIGJhY2tncm91bmQtY29sb3I6ICMzMzdhYjc7XFxufVxcbi5jYWxlbmRhciAudGltZVNlbGVjdCB7XFxuICBwYWRkaW5nOiAwO1xcbiAgd2lkdGg6IGF1dG87XFxuICBtYXJnaW46IDA7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmO1xcbiAgZmxvYXQ6IHJpZ2h0O1xcbiAgZm9udC13ZWlnaHQ6IDcwMDtcXG4gIGZvbnQtZmFtaWx5OiBBcmlhbCwgSGVsdmV0aWNhLCBzYW5zLXNlcmlmO1xcbiAgYm9yZGVyLXN0eWxlOiBzb2xpZDtcXG4gIGJvcmRlci1yYWRpdXM6IDFlbTtcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuICBib3JkZXItd2lkdGg6IDNweDtcXG4gIGJvcmRlci1jb2xvcjogI2YxNTkyNTtcXG4gIGNvbG9yOiAjMDAwO1xcbiAgZm9udC1zaXplOiAwLjllbTtcXG59XFxuLmNhbGVuZGFyIC50aW1lQ29udCB7XFxuICBtYXJnaW4tbGVmdDogYXV0bztcXG4gIG1heC13aWR0aDogMjBlbTtcXG4gIGJhY2tncm91bmQtY29sb3I6IGFsaWNlYmx1ZTtcXG4gIGJvcmRlci1zdHlsZTogc29saWQ7XFxuICBib3JkZXItY29sb3I6ICNmMTU5MjU7XFxuICBtYXJnaW4tcmlnaHQ6IGF1dG87XFxuICBtYXJnaW4tdG9wOiAxMGVtO1xcbn1cXG4uY2FsZW5kYXIgLmRheWJsb2Nrcm93IHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBmbGV4LWRpcmVjdGlvbjogcm93O1xcbiAgbWluLXdpZHRoOiAxMDAlO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogYWxpY2VibHVlO1xcbn1cXG4uY2FsZW5kYXIgLmNhbGVuZGFyVGltZVBhcmVudCB7XFxuICBtYXJnaW46IDAuMWVtO1xcbn1cXG4uY2FsZW5kYXIgLmNhbGVuZGFyVGltZVBhcmVudCAuY2FsZW5kYXJUaW1lIHtcXG4gIGZvbnQtc2l6ZTogMC45ZW07XFxuICBtYXJnaW4tdG9wOiAwZW07XFxuICBsaW5lLWhlaWdodDogMTtcXG4gIGJhY2tncm91bmQtY29sb3I6IGFsaWNlYmx1ZTtcXG4gIGNvbG9yOiBibGFjaztcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gIG1hcmdpbjogMHB4O1xcbiAgZm9udC1zaXplOiAwLjhlbTtcXG59XFxuLmNhbGVuZGFyIC53aWR0aFNoYXBlRGF5cyB7XFxuICB3aWR0aDogMTQuMjg1NzE0Mjg1NyU7XFxuICBtYXJnaW4tbGVmdDogYXV0bztcXG4gIG1hcmdpbi1yaWdodDogYXV0bztcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG59XFxuLmNhbGVuZGFyIC53aWR0aFNoYXBlIHtcXG4gIHdpZHRoOiAxNC4yODU3MTQyODU3JTtcXG4gIG1hcmdpbi1sZWZ0OiBhdXRvO1xcbiAgbWFyZ2luLXJpZ2h0OiBhdXRvO1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgbWluLWhlaWdodDogMy42ZW07XFxuICBtYXJnaW4tYm90dG9tOiAwLjJlbTtcXG59XFxuLmNhbGVuZGFyIC5tb250aE5hbWUge1xcbiAgbWFyZ2luOiBhdXRvO1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgZm9udC1mYW1pbHk6IFVidW50dTtcXG4gIGZvbnQtc2l6ZTogMS42MWVtO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogIzMzN2FiNztcXG4gIGNvbG9yOiAjZmZjYzMzO1xcbiAgZmxleC1iYXNpczogMTAwJTtcXG4gIGJvcmRlci1ib3R0b20tc3R5bGU6IHNvbGlkO1xcbn1cXG4uY2FsZW5kYXIgLndlZWtyb3cge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGZsZXgtd3JhcDogbm93cmFwO1xcbiAgZmxleC1kaXJlY3Rpb246IHJvdztcXG4gIGJhY2tncm91bmQtY29sb3I6ICNmZmY7XFxuICBmb250LWZhbWlseTogXFxcInJvYm90b1xcXCIsIFxcXCJhcmlhbFxcXCI7XFxufVxcbi5jYWxlbmRhciAuZGF5TmFtZSB7XFxuICBjb2xvcjogYmxhY2s7XFxuICBmb250LWZhbWlseTogXFxcInJvYm90b1xcXCIsIFxcXCJhcmlhbFxcXCI7XFxuICBmb250LXdlaWdodDogNjAwO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogI2NjYztcXG59XFxuLmNhbGVuZGFyIC5tb250aCA+ICoge1xcbiAgbWFyZ2luLWxlZnQ6IDJweDtcXG4gIG1hcmdpbi1yaWdodDogMnB4O1xcbn1cXG4uY2FsZW5kYXIgLm1vbnRoIHtcXG4gIHdpZHRoOiA1MCU7XFxuICBtaW4td2lkdGg6IDMwMHB4O1xcbiAgbWFyZ2luOiBhdXRvO1xcbn1cXG4uY2FsZW5kYXIgLnRpbWVDaG9vc2VyIHtcXG4gIHBvc2l0aW9uOiBzdGF0aWM7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiBhbGljZWJsdWU7XFxuICBtYXJnaW4tbGVmdDogYXV0bztcXG4gIG1hcmdpbi1yaWdodDogYXV0bztcXG59XFxuLmNhbGVuZGFyIC50aW1lQ29udGFpbmVyIHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxufVxcbi5jYWxlbmRhciAudGltZUNvbnRhaW5lciBkaXYge1xcbiAgZGlzcGxheTogZmxleDtcXG59XFxuLmNhbGVuZGFyIC50aW1lQ2hvb3Nlck1vZGFsIHtcXG4gIHotaW5kZXg6IDE7XFxuICB3aWR0aDogMTAwJTtcXG4gIGhlaWdodDogMTAwJTtcXG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMCwgMCwgMC40KTtcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIG1hcmdpbjogMDtcXG4gIHBhZGRpbmc6IDA7XFxuICBib3JkZXI6IDA7XFxuICBvdmVyZmxvdy14OiBzY3JvbGw7XFxufVxcbi5jYWxlbmRhciAuY2FsZW5kYXJMYWJlbCB7XFxuICBtaW4td2lkdGg6IDNlbTtcXG4gIHBhZGRpbmc6IDBlbSAxZW0gMGVtIDFlbTtcXG4gIGNvbG9yOiBibGFjaztcXG4gIGZvbnQtZmFtaWx5OiBcXFwicm9ib3RvXFxcIiwgXFxcImFyaWFsXFxcIjtcXG4gIGZvbnQtd2VpZ2h0OiA2MDA7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjY2NjO1xcbiAgbWFyZ2luOiAxZW0gMCAxZW0gMDtcXG59XFxuLmNhbGVuZGFyIC5kZWxldGVEaXYge1xcbiAgZm9udC1mYW1pbHk6IFVidW50dTtcXG4gIGJhY2tncm91bmQtY29sb3I6ICMzMzdhYjc7XFxuICBjb2xvcjogI2ZmY2MzMztcXG4gIGJvcmRlci1ib3R0b20tc3R5bGU6IHNvbGlkO1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG59XFxuLmNhbGVuZGFyIC5kZWxldGVCdXR0b24ge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogd2hpdGU7XFxuICBjb2xvcjogI2YxNTkyNTtcXG4gIGZsb2F0OiByaWdodDtcXG4gIGZvbnQtd2VpZ2h0OiA3MDA7XFxuICBmb250LWZhbWlseTogQXJpYWwsIEhlbHZldGljYSwgc2Fucy1zZXJpZjtcXG4gIGJvcmRlci1zdHlsZTogc29saWQ7XFxuICBib3JkZXItcmFkaXVzOiAyZW07XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICBoZWlnaHQ6IDJlbTtcXG4gIHdpZHRoOiAyZW07XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgbWFyZ2luOiAwIDAuNWVtO1xcbiAgZm9udC1zaXplOiAxLjVlbTtcXG59XFxuLmNhbGVuZGFyIC5pbm5lclNwYW5EZWxldGVCdG4ge1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbn1cXG4uY2FsZW5kYXIgLmRlbGV0ZUJ1dHRvbjpob3ZlcixcXG4uY2FsZW5kYXIgLmRlbGV0ZUJ1dHRvbjpmb2N1cyxcXG4uY2FsZW5kYXIgLnRpbWVTZWxlY3Q6aG92ZXIsXFxuLmNhbGVuZGFyIC50aW1lU2VsZWN0OmZvY3VzIHtcXG4gIGNvbG9yOiAjMDAwO1xcbiAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xcbiAgY3Vyc29yOiBwb2ludGVyO1xcbn1cXG4uY2FsZW5kYXIgLmhvdXIge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gIHdpZHRoOiAxMGVtO1xcbn1cXG4uY2FsZW5kYXIgLnRpbWVTZWxlY3RQIHtcXG4gIGRpc3BsYXk6IGlubGluZTtcXG4gIHdpZHRoOiA1ZW07XFxuICBjb2xvcjogIzAwMDtcXG59XFxuLmNhbGVuZGFyIC50aW1lQ2hvb3NlciA+IGlucHV0W3R5cGU9Y2hlY2tib3hdIHtcXG4gIG91dGxpbmU6ICNmMTU5MjU7XFxuICBvdXRsaW5lLXN0eWxlOiBzb2xpZDtcXG59XFxuLmNhbGVuZGFyIC50aW1lU2VsZWN0ID4gb3B0aW9uIHtcXG4gIGNvbG9yOiAjMDAwO1xcbn1cXG4uY2FsZW5kYXIgLmNhbGVuZGFyID4gcCxcXG4uY2FsZW5kYXIgaDQsXFxuLmNhbGVuZGFyIGgzLFxcbi5jYWxlbmRhciBoMixcXG4uY2FsZW5kYXIgaDEsXFxuLmNhbGVuZGFyIHNlbGVjdCxcXG4uY2FsZW5kYXIgb3B0aW9uIHtcXG4gIGNvbG9yOiAjMDAwO1xcbn1cXG4uY2FsZW5kYXIgLmFycm93LXVwIHtcXG4gIHdpZHRoOiAwO1xcbiAgaGVpZ2h0OiAwO1xcbiAgYm9yZGVyLWxlZnQ6IDEwcHggc29saWQgdHJhbnNwYXJlbnQ7XFxuICBib3JkZXItcmlnaHQ6IDEwcHggc29saWQgdHJhbnNwYXJlbnQ7XFxuICBib3JkZXItYm90dG9tOiAxMHB4IHNvbGlkIGJsYWNrO1xcbn1cXG4uY2FsZW5kYXIgLmFycm93LWRvd24ge1xcbiAgd2lkdGg6IDA7XFxuICBoZWlnaHQ6IDA7XFxuICBib3JkZXItbGVmdDogMTBweCBzb2xpZCB0cmFuc3BhcmVudDtcXG4gIGJvcmRlci1yaWdodDogMTBweCBzb2xpZCB0cmFuc3BhcmVudDtcXG4gIGJvcmRlci10b3A6IDEwcHggc29saWQgIzAwMDtcXG59XFxuLmNhbGVuZGFyIC5hcnJvd3Mge1xcbiAgZmxvYXQ6IHJpZ2h0O1xcbiAgY2xlYXI6IHJpZ2h0O1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgY3Vyc29yOiBwb2ludGVyO1xcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG59XFxuLmNhbGVuZGFyIC5hcnJvdy1yaWdodCB7XFxuICB3aWR0aDogMDtcXG4gIGhlaWdodDogMDtcXG4gIGJvcmRlci10b3A6IDYwcHggc29saWQgdHJhbnNwYXJlbnQ7XFxuICBib3JkZXItYm90dG9tOiA2MHB4IHNvbGlkIHRyYW5zcGFyZW50O1xcbiAgYm9yZGVyLWxlZnQ6IDYwcHggc29saWQgZ3JlZW47XFxufVxcbi5jYWxlbmRhciAuYXJyb3ctbGVmdCB7XFxuICB3aWR0aDogMDtcXG4gIGhlaWdodDogMDtcXG4gIGJvcmRlci10b3A6IDEwcHggc29saWQgdHJhbnNwYXJlbnQ7XFxuICBib3JkZXItYm90dG9tOiAxMHB4IHNvbGlkIHRyYW5zcGFyZW50O1xcbiAgYm9yZGVyLXJpZ2h0OiAxMHB4IHNvbGlkIGJsdWU7XFxufVxcbi5jYWxlbmRhciAuZGF5VGltZSB7XFxuICBjdXJzb3I6IHBvaW50ZXI7XFxufVxcbi5jYWxlbmRhciAuZGF5VGltZSA+ICoge1xcbiAgcG9pbnRlci1ldmVudHM6IG5vbmU7XFxufVxcblwiOyIsIi8qKlxuICogQHR5cGVkZWYge09iamVjdH0gSGFzVGVzdHNUYWdcbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gaGFzVGVzdHMgLSBJbmRpY2F0ZXMgd2hldGhlciB0aGUgZnVuY3Rpb24gaGFzIHRlc3RzLlxuICovXG5cbi8qKlxuICogQHR5cGVkZWYge09iamVjdH0gaGFzVGhlc2VTdHlsZXNcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBoYXNUaGVzZVN0eWxlcyAtIExpc3RzIHN0eWxlcyByZWZlcmVuY2VzIGluIGEgZnVuY3Rpb25cbiAqL1xuXG5pbXBvcnQge1xuICBnZXREYXlzSW5Nb250aCwgZ2VuZXJhdGVSYW5kb21TdHJpbmcsIGdldEVhcmxpZXN0RGF0ZSxcbiAgYmxvY2tEYXlzTm90T3BlbiwgY2xlYXJTZWxlY3Rpb24sXG4gIGh1bWFuRGF0ZSwgc3RhbmRhcmREYXRlT2JqZWN0LCBwcm94eVRvUGxhaW5PYmplY3RIZWxwZXIsIGRlYm91bmNlXG59IGZyb20gJy4vYmFzaWNGdW5jdGlvbnMuanMnO1xuaW1wb3J0IHsgR2VuZXJhdGVUaW1lQ2hvb3Nlck1vZGFsIH0gZnJvbSAnLi9kaXNwbGF5VGltZUNob29zZXJNb2RhbC5qcyc7XG5pbXBvcnQgeyBjb2xvdXJzLCBzZWxlY3RlZFN0eWxlLCB1bnNlbGVjdGVkU3R5bGUgfSBmcm9tICcuL3N0eWxlcy5qcyc7XG5pbXBvcnQgeyBsYW5ndWFnZXMgfSBmcm9tICcuL2xhbmd1YWdlcy5qcyc7XG5pbXBvcnQgc3R5bGUgZnJvbSAnLi9jYWxlbmRhckFwcC5jc3MnO1xuXG4vKipcbiAqIEFkZHMgdGhlIHNwZWNpZmllZCBudW1iZXIgb2YgbW9udGhzIHRvIGEgZGF0ZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBtb250aHMgLSBUaGUgbnVtYmVyIG9mIG1vbnRocyB0byBhZGQuXG4gKiBAcmV0dXJucyB7RGF0ZX0gLSBUaGUgdXBkYXRlZCBkYXRlLlxuICovXG5EYXRlLnByb3RvdHlwZS5hZGRNb250aHMgPSBmdW5jdGlvbiAobW9udGhzKSB7XG4gIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZSh0aGlzKTtcbiAgY29uc3QgeWVhcnMgPSBNYXRoLmZsb29yKG1vbnRocyAvIDEyKTtcbiAgY29uc3QgcmVtYWluaW5nTW9udGhzID0gbW9udGhzICUgMTI7XG4gIGlmICh5ZWFycykge1xuICAgIGRhdGUuc2V0RnVsbFllYXIoZGF0ZS5nZXRGdWxsWWVhcigpICsgeWVhcnMpO1xuICB9XG4gIGlmIChyZW1haW5pbmdNb250aHMpIHtcbiAgICBkYXRlLnNldE1vbnRoKGRhdGUuZ2V0TW9udGgoKSArIHJlbWFpbmluZ01vbnRocyk7XG4gIH1cbiAgcmV0dXJuIGRhdGU7XG59O1xuXG5jdXN0b21FbGVtZW50cy5kZWZpbmUoJ3N3aWZ0LWNhbCcsIGNsYXNzIGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgc3VwZXIoKTtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBmdW5jdGlvbiBzdFRvQm9vbGVhbiAoc3QpIHtcbiAgICAgIGlmIChzdCA9PT0gJ3RydWUnKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnN0IGNhbGVuZGFyID0gbmV3IFN3aWZ0Q2FsKCk7XG4gICAgY2FsZW5kYXIuZ2VuZXJhdGVDYWxlbmRhcihcbiAgICAgIHtcbiAgICAgICAgdGFyZ2V0OiBzZWxmLFxuICAgICAgICAvLyBkYXRhLW51bWJlci1vZi1tb250aHMtdG8tZGlzcGxheSBodG1sIGNvbnZlcnRzIHRvIG51bWJlck9mTW9udGhzVG9EaXNwbGF5IEpTXG4gICAgICAgIG51bWJlck9mTW9udGhzVG9EaXNwbGF5OiB0aGlzLmRhdGFzZXQubnVtYmVyT2ZNb250aHNUb0Rpc3BsYXksXG4gICAgICAgIC8vIGRhdGEtZGlzcGxheS10aW1lLWNob29zZXItbW9kYWxcbiAgICAgICAgZGlzcGxheVRpbWVDaG9vc2VyTW9kYWw6IHN0VG9Cb29sZWFuKHRoaXMuZGF0YXNldC5kaXNwbGF5VGltZUNob29zZXJNb2RhbCksXG4gICAgICAgIC8vIGRhdGEtc2luZ2xlLWRhdGUtY2hvaWNlXG4gICAgICAgIHNpbmdsZURhdGVDaG9pY2U6IHN0VG9Cb29sZWFuKHRoaXMuZGF0YXNldC5zaW5nbGVEYXRlQ2hvaWNlKSxcblxuICAgICAgICBsYW5ndWFnZTogdGhpcy5kYXRhc2V0Lmxhbmd1YWdlLFxuICAgICAgICAvLyBkYXRhLXNlbGVjdC1tdWx0aXBsZVxuICAgICAgICBzZWxlY3RNdWx0aXBsZTogdGhpcy5kYXRhc2V0LnNlbGVjdE11bHRpcGxlLFxuXG4gICAgICAgIHByZWxvYWRlZERhdGVzOiAodGhpcy5kYXRhc2V0LnByZWxvYWRlZERhdGVzKSA/IEpTT04ucGFyc2UodGhpcy5kYXRhc2V0LnByZWxvYWRlZERhdGVzKSA6IGZhbHNlLFxuXG4gICAgICAgIHByZWxvYWRlZFRvb2x0aXA6IHRoaXMuZGF0YXNldC5wcmVsb2FkZWRUb29sdGlwLFxuXG4gICAgICAgIGJsb2NrRGF5c09mV2VlazogKHRoaXMuZGF0YXNldC5ibG9ja0RheXNPZldlZWspID8gSlNPTi5wYXJzZSh0aGlzLmRhdGFzZXQuYmxvY2tEYXlzT2ZXZWVrKSA6IGZhbHNlLFxuICAgICAgICAvLyBkYXRhLXN0YXJ0LWRhdGU9XCIyMDE5LTAxLTAxXCJcbiAgICAgICAgc3RhcnREYXRlOiB0aGlzLmRhdGFzZXQuc3RhcnREYXRlXG5cbiAgICAgIH0pO1xuXG4gICAgdGhpcy5keW5hbWljRGF0YSA9IGNhbGVuZGFyLnJldHVybkR5bmFtaWNEYXRhKCk7XG4gIH1cbn0pO1xuXG5mdW5jdGlvbiBTd2lmdENhbCAoKSB7XG4gIGxldCB0aW1lQ2hvb3NlcjtcbiAgY29uc3QgY29uZmlnID0ge307XG5cbiAgY29uc3QgaGFuZGxlciA9IHtcbiAgICBnZXQ6ICh0YXJnZXQsIGtleSkgPT4ge1xuICAgICAgaWYgKHR5cGVvZiB0YXJnZXRba2V5XSA9PT0gJ29iamVjdCcgJiYgdGFyZ2V0W2tleV0gIT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm94eSh0YXJnZXRba2V5XSwgaGFuZGxlcik7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0YXJnZXRba2V5XTtcbiAgICB9LFxuICAgIHNldDogKHRhcmdldCwgcHJvcCwgdmFsdWUpID0+IHtcbiAgICAgIGlmICh0YXJnZXRbcHJvcF0gPT09IHZhbHVlKSByZXR1cm4gdHJ1ZTtcbiAgICAgIHRhcmdldFtwcm9wXSA9IHZhbHVlO1xuICAgICAgZW1pdERhdGVTZWxlY3RlZEV2ZW50KCk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgZGF0YVRlbXBsYXRlID0ge1xuICAgIGRhdGVzU2VsZWN0ZWRBcnJheTogW10sXG4gICAgZGF0ZXNTZWxlY3RlZEFycmF5T2JqZWN0czogW10sXG4gICAgZGlzYWJsZWQ6IGZhbHNlXG4gIH07XG5cbiAgY29uc3QgZHluYW1pY0RhdGEgPSBuZXcgUHJveHkoZGF0YVRlbXBsYXRlLCBoYW5kbGVyKTtcblxuICBjb25zdCBlbWl0RGF0ZVNlbGVjdGVkRXZlbnQgPSBkZWJvdW5jZSgoKSA9PiB7XG4gICAgY29uc3QgZXZ0ID0gbmV3IEN1c3RvbUV2ZW50KCdkYXRlU2VsZWN0Jywge1xuICAgICAgZGV0YWlsOiB7IGRhdGU6IHByb3h5VG9QbGFpbk9iamVjdEhlbHBlcihkeW5hbWljRGF0YSkgfSxcbiAgICAgIGJ1YmJsZXM6IHRydWUsXG4gICAgICBjb21wb3NlZDogdHJ1ZVxuICAgIH0pO1xuICAgIGNvbmZpZy5jYWxlbmRhckNvbnRhaW5lci5kaXNwYXRjaEV2ZW50KGV2dCk7XG4gIH0sIDI1MCk7XG5cbiAgY29uc3QgY2FsZW5kYXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblxuICB0aGlzLnJldHVybkNhbGVuZGFyID0gKCkgPT4ge1xuICAgIHJldHVybiBjYWxlbmRhcjtcbiAgfTtcblxuICB0aGlzLnJldHVybkR5bmFtaWNEYXRhID0gKCkgPT4ge1xuICAgIHJldHVybiBkeW5hbWljRGF0YTtcbiAgfTtcblxuICB0aGlzLnJldHVybkNvbmZpZyA9ICgpID0+IHtcbiAgICByZXR1cm4gY29uZmlnO1xuICB9O1xuXG4gIHRoaXMuc2V0Q29uZmlnID0gKGNvbmZpZ09iaikgPT4ge1xuICAgIC8vIElmIGNhbGxlZCB2aWEgSFRNTFxuICAgIGNvbmZpZy5jYWxlbmRhckNvbnRhaW5lciA9IGNvbmZpZ09iai50YXJnZXQgfHwgZmFsc2U7XG4gICAgLy8gSWYgY2FsbGVkIHZpYSBKYXZhc2NyaXB0XG4gICAgY29uZmlnLnBhcmVudERpdiA9ICh0eXBlb2YgY29uZmlnT2JqLnBhcmVudERpdiA9PT0gJ3N0cmluZycpID8gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihjb25maWdPYmoucGFyZW50RGl2KSA6IGNvbmZpZ09iai5wYXJlbnREaXY7XG4gICAgLy8gZG9uZVxuICAgIGNvbmZpZy5udW1iZXJPZk1vbnRoc1RvRGlzcGxheSA9IGNvbmZpZ09iai5udW1iZXJPZk1vbnRoc1RvRGlzcGxheSB8fCAxMjtcbiAgICAvLyBkb25lXG4gICAgY29uZmlnLmRpc3BsYXlUaW1lQ2hvb3Nlck1vZGFsID0gY29uZmlnT2JqLmRpc3BsYXlUaW1lQ2hvb3Nlck1vZGFsICYmIHRydWU7XG4gICAgLy8gZG9uZVxuICAgIGNvbmZpZy5zaW5nbGVEYXRlQ2hvaWNlID0gY29uZmlnT2JqLnNpbmdsZURhdGVDaG9pY2UgJiYgdHJ1ZTtcbiAgICAvLyBkb25lXG4gICAgY29uZmlnLnNlbGVjdFJhbmdlID0gIWNvbmZpZ09iai5zaW5nbGVEYXRlQ2hvaWNlO1xuICAgIC8vIGRvbmVcbiAgICBjb25maWcubGFuZ3VhZ2UgPSBjb25maWdPYmoubGFuZ3VhZ2UgfHwgJ2VuR2InO1xuICAgIC8vIGRvbmVcbiAgICBjb25maWcuc2VsZWN0TXVsdGlwbGUgPSBjb25maWcuc2VsZWN0TXVsdGlwbGUgfHwgZmFsc2U7XG4gICAgLy8gZG9uZVxuICAgIGNvbmZpZy5kaXNwbGF5VGltZVNlbGVjdGlvbk9uRGF0ZSA9IGNvbmZpZ09iai5kaXNwbGF5VGltZVNlbGVjdGlvbk9uRGF0ZSB8fCB0cnVlO1xuICAgIC8vIGRvbmVcbiAgICBjb25maWcucHJlbG9hZGVkRGF0ZXMgPSBjb25maWdPYmoucHJlbG9hZGVkRGF0ZXMgfHwgZmFsc2U7XG5cbiAgICBjb25maWcucHJlbG9hZGVkVG9vbHRpcCA9IGNvbmZpZ09iai5wcmVsb2FkZWRUb29sdGlwIHx8IGZhbHNlO1xuXG4gICAgY29uZmlnLmJsb2NrRGF5c09mV2VlayA9IGNvbmZpZ09iai5ibG9ja0RheXNPZldlZWsgfHwgZmFsc2U7XG5cbiAgICBjb25maWcuYm9va0RheXNPZldlZWsgPSBjb25maWdPYmouYm9va0RheXNPZldlZWsgfHwgZmFsc2U7XG5cbiAgICBjb25maWcuc3RhcnREYXRlID0gY29uZmlnT2JqLnN0YXJ0RGF0ZSB8fCBmYWxzZTtcblxuICAgIGNvbmZpZy5lbmRVc2VyID0gY29uZmlnT2JqLmVuZFVzZXIgfHwgZmFsc2U7XG4gICAgY29uZmlnLmVuZFVzZXJEdXJhdGlvbkNob2ljZSA9IGNvbmZpZ09iai5lbmRVc2VyRHVyYXRpb25DaG9pY2UgfHwgZmFsc2U7XG4gICAgY29uZmlnLmJhY2tlbmQgPSBjb25maWdPYmouYmFja2VuZCB8fCBmYWxzZTtcbiAgICBjb25maWcuZGlzcGxheUJsb2NrZWQgPSBjb25maWdPYmouZGlzcGxheUJsb2NrZWQgfHwgZmFsc2U7XG4gICAgY29uZmlnLmRhdGVzT3BlbiA9IGNvbmZpZ09iai5kYXRlc09wZW4gfHwgZmFsc2U7XG4gIH07XG5cbiAgdGhpcy5nZW5lcmF0ZUNhbGVuZGFyID0gKGNvbmZpZ09iaikgPT4ge1xuICAgIGlmIChjb25maWdPYmopIHtcbiAgICAgIHRoaXMuc2V0Q29uZmlnKGNvbmZpZ09iaik7XG4gICAgfVxuICAgIC8vIElmIGNhbGxlZCB2aWEgamF2YXNjcmlwdCBhIHBhcmVudEVsZW1lbnQgbmVlZHMgdG8gYmUgcHJvdmlkZWRcbiAgICBjb25zdCBwYXJlbnREaXYgPSBjb25maWcucGFyZW50RGl2O1xuICAgIC8qXG4gICAgICBJZiBjYWxsZWQgZnJvbSBodG1sIGFzIGEgY3VzdG9tIGNvbXBvbmVudCB0aGUgY29tcG9uZW50IGl0c2VsZiBpcyBwYXNzZWQgKGNhbGVuZGFyQ29udGFpbmVyKVxuICAgICAgSWYgY2FsbGVkIHZpYSBKUyB3aGlsZSB0aGUgY29tcG9uZW50IGlzbid0IGEgd2ViIGNvbXBvbmVudCBpbiB0aGUgc3RyaWN0ZXN0IHNlbnNlLCBpdCBzdGlsbFxuICAgICAgYmVoYXZlcyBsaWtlIG9uZSBhbmQgaXMgZW5jYXBzdWxhdGVkIGluIGEgc2hhZG93LlxuICAgICovXG4gICAgaWYgKGNvbmZpZy5jYWxlbmRhckNvbnRhaW5lcikge1xuICAgICAgc2hhZG93QXR0YWNoKGNvbmZpZy5jYWxlbmRhckNvbnRhaW5lcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5ld0NvbnRhaW5lcigpLnRoZW4oKGNvbnRhaW5lcikgPT4ge1xuICAgICAgICBzaGFkb3dBdHRhY2goY29udGFpbmVyKTtcbiAgICAgICAgY29uZmlnLmNhbGVuZGFyQ29udGFpbmVyID0gY29udGFpbmVyO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbmV3Q29udGFpbmVyICgpIHtcbiAgICAgIGNvbnN0IHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICBjb25zdCBuZXdDYWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgbmV3Q2FsLmNsYXNzTGlzdC5hZGQoJ3N3aWZ0LWNhbCcpO1xuICAgICAgICBwYXJlbnREaXYuYXBwZW5kQ2hpbGQobmV3Q2FsKTtcbiAgICAgICAgcmVzb2x2ZShuZXdDYWwpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzaGFkb3dBdHRhY2ggKGNvbnRhaW5lcikge1xuICAgICAgY29uc3Qgc2hhZG93Um9vdCA9IGNvbnRhaW5lci5hdHRhY2hTaGFkb3coeyBtb2RlOiAnb3BlbicgfSk7XG4gICAgICBjb25zdCBjc3MgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgICAgY3NzLnRleHRDb250ZW50ID0gc3R5bGU7XG4gICAgICBzaGFkb3dSb290LmFwcGVuZENoaWxkKGNzcyk7XG4gICAgICBzaGFkb3dSb290LmFwcGVuZENoaWxkKGNhbGVuZGFyKTtcbiAgICB9XG5cbiAgICBjb25zdCBwcmVsb2FkZWREYXRlcyA9IGNvbmZpZy5wcmVsb2FkZWREYXRlcztcbiAgICBjb25zdCBudW1iZXJPZk1vbnRoc1RvRGlzcGxheSA9IGNvbmZpZy5udW1iZXJPZk1vbnRoc1RvRGlzcGxheTtcbiAgICBjb25zdCBkYXRlc09wZW4gPSBjb25maWcuZGF0ZXNPcGVuO1xuICAgIGNvbnN0IGxhbmd1YWdlID0gY29uZmlnLmxhbmd1YWdlO1xuICAgIGNvbnN0IGRpc3BsYXlUaW1lQ2hvb3Nlck1vZGFsID0gY29uZmlnLmRpc3BsYXlUaW1lQ2hvb3Nlck1vZGFsO1xuICAgIGNvbnN0IGJsb2NrV2Vla0RheXMgPSBjb25maWcuYmxvY2tEYXlzT2ZXZWVrO1xuICAgIGNvbnN0IGJvb2tXZWVrRGF5cyA9IGNvbmZpZy5ib29rRGF5c09mV2VlaztcbiAgICBjb25zdCBzdGFydERhdGUgPSBjb25maWcuc3RhcnREYXRlO1xuICAgIGxldCB1bmlxdWVEYXlJbmRleCA9IDA7XG4gICAgLy8gQ2FsZW5kYXIgaXMgZGVmaW5lZCBnbG9iYWxseSB3aXRoaW4gdGhlIGNvbnN0cnVjdG9yXG4gICAgY29uc3QgY2FsZW5kYXJVbmlxdWVJZCA9IGdlbmVyYXRlUmFuZG9tU3RyaW5nKCk7XG4gICAgY2FsZW5kYXIuaWQgPSBgY2FsZW5kYXItJHtjYWxlbmRhclVuaXF1ZUlkfWA7XG4gICAgY2FsZW5kYXIuY2xhc3NMaXN0LmFkZCgnY2FsZW5kYXInKTtcblxuICAgIGNvbnN0IG1vbnRocyA9IFtdO1xuICAgIGNvbnN0IGRhdGVOb3cgPSBuZXcgRGF0ZSgpO1xuICAgIC8vIFJlcHVycG9zaW5nIGdldEVhcmxpZXN0RGF0ZSB0byBmb3JtYXQgYSBkYXRlLlxuICAgIGNvbnN0IGVhcmxpZXN0RGF0ZSA9IChzdGFydERhdGUpID8gZ2V0RWFybGllc3REYXRlKFtzdGFydERhdGVdKSA6IGRhdGVOb3c7XG4gICAgY29uc3Qgc3RhcnRNb250aCA9IGVhcmxpZXN0RGF0ZS5nZXRNb250aCgpO1xuICAgIGNvbnN0IG1vbnRoTmFtZXMgPSBsYW5ndWFnZXNbbGFuZ3VhZ2VdLmdlbmVyYWxUaW1lLm1vbnRocztcbiAgICAvKiBDcmVhdGUgbW9udGggdmlldyAqL1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtYmVyT2ZNb250aHNUb0Rpc3BsYXk7IGkrKykge1xuICAgICAgLyogTW9udGggc3BlY2lmaWMgdmFyaWFibGVzIGFuZCB0cmFja2VycyAqL1xuICAgICAgY29uc3QgeWVhckNhbGMgPSBlYXJsaWVzdERhdGUuYWRkTW9udGhzKGkpLmdldEZ1bGxZZWFyKCk7XG4gICAgICBjb25zdCBtb250aENhbGMgPSAoc3RhcnRNb250aCArIGkpICUgMTI7XG4gICAgICBjb25zdCBzdGFydERheU9mTW9udGggPSBuZXcgRGF0ZSh5ZWFyQ2FsYywgbW9udGhDYWxjKS5nZXREYXkoKTtcbiAgICAgIGNvbnN0IGRheXNJbk1vbnRoID0gZ2V0RGF5c0luTW9udGgoKHN0YXJ0TW9udGggKyBpICsgMSkgJSAxMiwgZWFybGllc3REYXRlLmFkZE1vbnRocyhpKS5nZXRGdWxsWWVhcigpKTtcbiAgICAgIGxldCBjb3VudCA9IDE7XG4gICAgICBsZXQgZGF5b2Z3ZWVrID0gMDtcblxuICAgICAgLyogQ3JlYXRlIG1vbnRoIGRpdiAqL1xuICAgICAgY29uc3QgbW9udGggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIG1vbnRocy5wdXNoKG1vbnRoKTtcbiAgICAgIG1vbnRoLnN0eWxlLndpZHRoID0gJzE1ZW0nO1xuICAgICAgbW9udGguc3R5bGUuYmFja2dyb3VuZENvbG9yID0gY29sb3Vycy5tb250aEJvcmRlckNvbG9yO1xuICAgICAgbW9udGguY2xhc3NMaXN0LmFkZCgnbW9udGgnKTtcbiAgICAgIGNhbGVuZGFyLmFwcGVuZENoaWxkKG1vbnRoKTtcblxuICAgICAgLyogQ3JlYXRlIG1vbnRoIG5hbWUgZGl2IChtb250aCBZWVlZKSBhdCB0aGUgdG9wIG9mIG1vbnRoIGRpc3BsYXkgKi9cbiAgICAgIGNvbnN0IG1vbnRoTmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgbW9udGhOYW1lLmNsYXNzTGlzdC5hZGQoJ21vbnRoTmFtZScpO1xuICAgICAgbW9udGhOYW1lLnRleHRDb250ZW50ID0gYCR7bW9udGhOYW1lc1soc3RhcnRNb250aCArIGkpICUgMTJdfSAke2VhcmxpZXN0RGF0ZS5nZXRGdWxsWWVhcigpfWA7XG4gICAgICBtb250aC5hcHBlbmRDaGlsZChtb250aE5hbWUpO1xuXG4gICAgICAvKiBDcmVhdGUgZGl2IHdpdGggbmFtZWQgZGF5cyBvZiB0aGUgd2VlayAqL1xuICAgICAgY29uc3QgZGF5TmFtZXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIG1vbnRoLmFwcGVuZENoaWxkKGRheU5hbWVzKTtcbiAgICAgIGRheU5hbWVzLmNsYXNzTGlzdC5hZGQoJ3dlZWtyb3cnKTtcbiAgICAgIGxhbmd1YWdlc1tsYW5ndWFnZV0uZ2VuZXJhbFRpbWUuZGF5c1RydW5jYXRlZC5mb3JFYWNoKChkYXlOYW1lKSA9PiB7XG4gICAgICAgIGNvbnN0IGRheSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBkYXkudGV4dENvbnRlbnQgPSBkYXlOYW1lO1xuICAgICAgICBkYXkuY2xhc3NMaXN0LmFkZCgnZGF5TmFtZScsICd3aWR0aFNoYXBlRGF5cycpO1xuICAgICAgICBkYXlOYW1lcy5hcHBlbmRDaGlsZChkYXkpO1xuICAgICAgfSk7XG5cbiAgICAgIC8qIENyZWF0ZSB3ZWVrIHJvd3MgZmlyc3Qgd2VlaywgaXQncyByZWFzc2lnbmVkIGYgKi9cbiAgICAgIGxldCB3ZWVrUm93O1xuICAgICAgLy8gNDIgZGF5cywgaS5lLiA2IHJvd3Mgb2YgN1xuICAgICAgZm9yIChsZXQgcCA9IDA7IHAgPCA0MjsgcCsrKSB7XG4gICAgICAgIGlmIChwID09PSAwKSB7XG4gICAgICAgICAgLy8gbWFkZSBuZXcgd2VlayByb3dcbiAgICAgICAgICB3ZWVrUm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgbW9udGguYXBwZW5kQ2hpbGQod2Vla1Jvdyk7XG4gICAgICAgICAgd2Vla1Jvdy5jbGFzc0xpc3QuYWRkKCd3ZWVrcm93Jyk7XG4gICAgICAgICAgZGF5b2Z3ZWVrID0gMDtcbiAgICAgICAgfVxuICAgICAgICBpZiAocCA8IHN0YXJ0RGF5T2ZNb250aCkge1xuICAgICAgICAgIGNvbnN0IHBlZ2hvbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICBwZWdob2xlLmNsYXNzTGlzdC5hZGQoJ3dpZHRoU2hhcGUnLCAnZmlsbGVyJyk7XG4gICAgICAgICAgdW5zZWxlY3RlZFN0eWxlKHBlZ2hvbGUpO1xuICAgICAgICAgIHdlZWtSb3cuYXBwZW5kQ2hpbGQocGVnaG9sZSk7XG4gICAgICAgICAgZGF5b2Z3ZWVrKys7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocCA+PSBzdGFydERheU9mTW9udGggJiYgcCA8PSAoc3RhcnREYXlPZk1vbnRoICsgZGF5c0luTW9udGggLSAxKSkge1xuICAgICAgICAgIGNvbnN0IHBlZ2hvbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICBwZWdob2xlLnRleHRDb250ZW50ID0gY291bnQ7XG4gICAgICAgICAgcGVnaG9sZS5kYXRhc2V0LmRheSA9IGNvdW50O1xuICAgICAgICAgIHBlZ2hvbGUuZGF0YXNldC5kYXlvZndlZWsgPSBkYXlvZndlZWs7XG4gICAgICAgICAgcGVnaG9sZS5kYXRhc2V0LmRheWluZGV4ID0gdW5pcXVlRGF5SW5kZXg7XG4gICAgICAgICAgcGVnaG9sZS5jbGFzc0xpc3QuYWRkKCd3aWR0aFNoYXBlJywgJ2RheVRpbWUnKTtcbiAgICAgICAgICBwZWdob2xlLmRhdGFzZXQuaHVtYW5kYXRlID0gaHVtYW5EYXRlKGAke3llYXJDYWxjfS0ke21vbnRoQ2FsY30tJHtjb3VudH1gKTtcbiAgICAgICAgICAvLyBwZWdob2xlLmlkID0gYCR7eWVhckNhbGN9LSR7bW9udGhDYWxjfS0ke2NvdW50fWA7XG4gICAgICAgICAgcGVnaG9sZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICAgICAgICBkYXRlT25DbGlja0V2ZW50cyhlKTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHdlZWtSb3cuYXBwZW5kQ2hpbGQocGVnaG9sZSk7XG5cbiAgICAgICAgICBpZiAoaSA9PT0gMCAmJiBwID49IHN0YXJ0RGF5T2ZNb250aCAmJiBwIDwgKGVhcmxpZXN0RGF0ZS5nZXREYXRlKCkgKyBzdGFydERheU9mTW9udGgpKSB7XG4gICAgICAgICAgICBwZWdob2xlLmNsYXNzTGlzdC5hZGQoJ2ZpbGxlcicpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvdW50Kys7XG4gICAgICAgICAgZGF5b2Z3ZWVrKys7XG4gICAgICAgICAgdW5pcXVlRGF5SW5kZXgrKztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwID49IGRheXNJbk1vbnRoICsgc3RhcnREYXlPZk1vbnRoKSB7XG4gICAgICAgICAgY29uc3QgcGVnaG9sZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgIHBlZ2hvbGUuY2xhc3NMaXN0LmFkZCgnd2lkdGhTaGFwZScsICdmaWxsZXInKTtcbiAgICAgICAgICB3ZWVrUm93LmFwcGVuZENoaWxkKHBlZ2hvbGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKChwICsgMSkgJSA3ID09PSAwKSB7XG4gICAgICAgICAgLy8gbWFrZSBuZXcgd2VlayByb3c6XG4gICAgICAgICAgd2Vla1JvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgIG1vbnRoLmFwcGVuZENoaWxkKHdlZWtSb3cpO1xuICAgICAgICAgIHdlZWtSb3cuY2xhc3NMaXN0LmFkZCgnd2Vla3JvdycpO1xuICAgICAgICAgIGRheW9md2VlayA9IDA7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChpID09PSBudW1iZXJPZk1vbnRoc1RvRGlzcGxheSAtIDEpIHtcbiAgICAgICAgYmxvY2tEYXlzTm90T3BlbihjYWxlbmRhciwgZGF0ZXNPcGVuKTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gT3B0aW9uczpcbiAgICBpZiAoZGlzcGxheVRpbWVDaG9vc2VyTW9kYWwpIHtcbiAgICAgIHRpbWVDaG9vc2VyID0gbmV3IEdlbmVyYXRlVGltZUNob29zZXJNb2RhbChjb25maWcsIGR5bmFtaWNEYXRhLCBjYWxlbmRhcik7XG4gICAgICB0aW1lQ2hvb3Nlci5nZW5lcmF0ZU1vZGFsKCk7XG4gICAgfVxuICAgIGlmIChwcmVsb2FkZWREYXRlcykge1xuICAgICAgcHJlbG9hZERhdGVzKHByZWxvYWRlZERhdGVzKTtcbiAgICB9XG4gICAgaWYgKGJsb2NrV2Vla0RheXMpIHtcbiAgICAgIGJsb2NrRGF5c09mV2VlayhibG9ja1dlZWtEYXlzKTtcbiAgICB9XG4gICAgaWYgKGJvb2tXZWVrRGF5cykge1xuICAgICAgYm9va0RheXNPZldlZWsoYm9va1dlZWtEYXlzKTtcbiAgICB9XG4gIH07XG5cbiAgdGhpcy5wcmVsb2FkZWREYXRlcyA9IChkYXRlcykgPT4ge1xuICAgIGNhbGVuZGFyLnByZWxvYWREYXRlcyhkYXRlcyk7XG4gIH07XG5cbiAgbGV0IGNsaWNrQ291bnQgPSAxO1xuICBjb25zdCBkYXRlQ2xpY2tlZFRocmljZSA9IHtcbiAgICBkYXRlOiBudWxsLFxuICAgIGNvdW50OiAxXG4gIH07XG5cbiAgZnVuY3Rpb24gY2xpa2VkVGhyaWNlIChkYXRlKSB7XG4gICAgaWYgKGRhdGVDbGlja2VkVGhyaWNlLmRhdGUgPT09IGRhdGUpIHtcbiAgICAgIGRhdGVDbGlja2VkVGhyaWNlLmNvdW50Kys7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHJlc2V0IGZvciBuZXcgZGF0ZVxuICAgICAgZGF0ZUNsaWNrZWRUaHJpY2UuZGF0ZSA9IGRhdGU7XG4gICAgICBkYXRlQ2xpY2tlZFRocmljZS5jb3VudCA9IDE7XG4gICAgfVxuXG4gICAgaWYgKGRhdGVDbGlja2VkVGhyaWNlLmNvdW50ID09PSAzKSB7XG4gICAgICBkYXRlQ2xpY2tlZFRocmljZS5jb3VudCA9IDA7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgZnVuY3Rpb24gZGF0ZU9uQ2xpY2tFdmVudHMgKGUpIHtcbiAgICBjb25zdCBkYXRlRGl2ID0gZS50YXJnZXQ7XG4gICAgY2xpY2tDb3VudCsrO1xuXG4gICAgaWYgKGR5bmFtaWNEYXRhLmRpc2FibGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGNvbmZpZy5zZWxlY3RSYW5nZSkge1xuICAgICAgcmFuZ2UoZGF0ZURpdik7XG4gICAgfVxuXG4gICAgaWYgKGNvbmZpZy5zaW5nbGVEYXRlQ2hvaWNlKSB7XG4gICAgICBjbGVhclNlbGVjdGlvbihjYWxlbmRhciwgZHluYW1pY0RhdGEpO1xuICAgICAgYm9va0RhdGVzKFtkYXRlRGl2XSk7XG4gICAgICB0aW1lQ2hvb3NlclRvZ2dsZSgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRpbWVDaG9vc2VyVG9nZ2xlICgpIHtcbiAgICAgIGlmIChjb25maWcuZGlzcGxheVRpbWVDaG9vc2VyTW9kYWwpIHtcbiAgICAgICAgdGltZUNob29zZXIuc2hvdygpO1xuICAgICAgICB0aW1lQ2hvb3Nlci53cml0ZVRvRGF0ZURpdigpO1xuICAgICAgICB0aW1lQ2hvb3Nlci53cml0ZVRvRHluYW1pY0RhdGEoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiByYW5nZSAoZGF0ZURpdikge1xuICAgICAgY29uc3QgbGFzdERhdGUgPSBkYXRlQ2xpY2tlZFRocmljZS5kYXRlO1xuICAgICAgY29uc3QgdGhyaWNlID0gY2xpa2VkVGhyaWNlKGRhdGVEaXYuZGF0YXNldC5odW1hbmRhdGUpO1xuICAgICAgaWYgKHRocmljZSkge1xuICAgICAgICB3aW5kb3cuZ2V0U2VsZWN0aW9uKCkucmVtb3ZlQWxsUmFuZ2VzKCk7XG4gICAgICAgIC8vIHBhc3MgXCJ0cnVlXCIgdG8gaW5kaWNhdGUgYSBzaW5nbGUgZGF0ZSByYW5nZSwgc2VsZWN0ZWQgYnkgdHJpcGxlIGNsaWNrOlxuICAgICAgICBib29rRGF0ZXMoW2RhdGVEaXZdLCB0cnVlKTtcbiAgICAgICAgdGltZUNob29zZXJUb2dnbGUoKTtcbiAgICAgICAgY2xpY2tDb3VudCsrO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoY2xpY2tDb3VudCAlIDIgPT09IDApIHtcbiAgICAgICAgaWYgKGNvbmZpZy5zZWxlY3RNdWx0aXBsZSkge1xuICAgICAgICAgIGNsZWFyU2VsZWN0aW9uKGNhbGVuZGFyLCBkeW5hbWljRGF0YSk7XG4gICAgICAgIH1cbiAgICAgICAgYm9va0RhdGVzKFtkYXRlRGl2XSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChwcmlvcldhc1NpbmdsZSA9PT0gZmFsc2UgJiYgY2xpY2tDb3VudCAlIDIgPT09IDEpIHtcbiAgICAgICAgYm9va0RhdGVzKFtkYXRlRGl2XSk7XG4gICAgICAgIC8vIHRpbWVDaG9vc2VyVG9nZ2xlKCk7XG4gICAgICAgIC8vIHJ1bGUgdG8gY2hlY2sgaWYgcmFuZ2UgaXMgYSBsb25nZXIgdGhhbiAxOlxuICAgICAgICBpZiAoZGF0ZUNsaWNrZWRUaHJpY2UuZGF0ZSAhPT0gbGFzdERhdGUpIHsgdGltZUNob29zZXJUb2dnbGUoKTsgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSYW5nZSBzZWxlY3RcbiAgICogQGRlc2NyaXB0aW9uIEFsbG93cyBhIHJhbmdlIG9mIGRhdGVzIHRvIGJlIHNlbGVjdGVkXG4gICAqIEBmdW5jdGlvbiBib29rRGF0ZXNcbiAgICogQHBhcmFtIGRhdGVzIE5vZGVsaXN0XG4gICAqIEB0b2RvIGFsbG93IGEgcmFuZ2Ugb2YgbGVuZ3RoIG9uZSB0byBiZSBzZWxlY3RlZFxuICAgKiBAZmlyZXMgYm9va0RheSBmb3IgZWFjaCBkYXkgaW4gYSByYW5nZVxuICAgKi9cblxuICBsZXQgcHJpb3JXYXNTaW5nbGUgPSBmYWxzZTtcbiAgZnVuY3Rpb24gYm9va0RhdGVzIChhcnJheU9mRGF0ZURpdnMsIHNpbmdsZURhdGUpIHtcbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgbmV3IHNlbGVjdGlvbiBpbiB0aGUgZHluYW1pY0RhdGEgb2JqZWN0LlxuICAgICAqIEByZXR1cm4ge29iamVjdH0gQW4gb2JqZWN0IGNvbnRhaW5pbmcgdGhlIHRyYWNraW5nIGFycmF5IFwibmV3QXJyYXlcIiBhbmQgb2JqZWN0cyBhcnJheS5cbiAgICAgKi9cblxuICAgIGZ1bmN0aW9uIGNyZWF0ZU5ld1NlbGVjdGlvbiAocHJpb3JXYXNTaW5nbGUpIHtcbiAgICAgIGNvbnN0IHBhcmVudEFyID0gZHluYW1pY0RhdGEuZGF0ZXNTZWxlY3RlZEFycmF5O1xuICAgICAgY29uc3QgcGFyZW50QXJPYmogPSBkeW5hbWljRGF0YS5kYXRlc1NlbGVjdGVkQXJyYXlPYmplY3RzO1xuICAgICAgbGV0IG5ld0FycmF5LCBuZXdPYmplY3RzQXJyYXk7XG5cbiAgICAgIG5ld0FycmF5ID0gcGFyZW50QXJbcGFyZW50QXIubGVuZ3RoIC0gMV07XG5cbiAgICAgIGlmICghcHJpb3JXYXNTaW5nbGUgJiYgY29uZmlnLnNlbGVjdFJhbmdlICYmIG5ld0FycmF5ICYmIG5ld0FycmF5Lmxlbmd0aCA9PT0gMSkge1xuICAgICAgICBuZXdPYmplY3RzQXJyYXkgPSBwYXJlbnRBck9ialtwYXJlbnRBck9iai5sZW5ndGggLSAxXTtcbiAgICAgICAgcmV0dXJuIHsgbmV3QXJyYXksIG5ld09iamVjdHNBcnJheSB9O1xuICAgICAgfVxuXG4gICAgICBuZXdBcnJheSA9IFtdO1xuICAgICAgbmV3T2JqZWN0c0FycmF5ID0gW107XG4gICAgICBwYXJlbnRBci5wdXNoKG5ld0FycmF5KTtcbiAgICAgIHBhcmVudEFyT2JqLnB1c2gobmV3T2JqZWN0c0FycmF5KTtcbiAgICAgIHJldHVybiB7IG5ld0FycmF5LCBuZXdPYmplY3RzQXJyYXkgfTtcbiAgICB9XG5cbiAgICAvLyBjcmVhdGUgbmV3IHNlbGVjdGlvbnMgb3IgcmV0cmlldmUgdGhlIGxhc3Qgc2VsZWN0aW9uOlxuICAgIGNvbnN0IHsgbmV3QXJyYXksIG5ld09iamVjdHNBcnJheSB9ID0gY3JlYXRlTmV3U2VsZWN0aW9uKHByaW9yV2FzU2luZ2xlKTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXJyYXlPZkRhdGVEaXZzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBkYXRlRGl2ID0gYXJyYXlPZkRhdGVEaXZzW2ldO1xuICAgICAgZmluZERhdGVTZWxlY3Rpb24oZGF0ZURpdik7XG4gICAgICBib29rRGF5KGRhdGVEaXYpO1xuICAgIH1cbiAgICAvLyBzdG9yZSB3aW4gdGhlIHByZXZpb3VzIHNlbGVjdGlvbiB3YXMgYSByYW5nZSBvZiBsZW5ndGggMSwgcmVhZCBieSBcImNyZWF0ZU5ld1NlbGVjdGlvblwiXG4gICAgcHJpb3JXYXNTaW5nbGUgPSAhIShzaW5nbGVEYXRlKTtcblxuICAgIC8vIGlmIHRoZSBkYXRlIGlzIGluIGEgcHJldmlvdXMgc2VsZWN0aW9uLCB0aGF0IHNlbGVjdGlvbiBpcyBzcGxpY2VkXG4gICAgZnVuY3Rpb24gZmluZERhdGVTZWxlY3Rpb24gKGRhdGUpIHtcbiAgICAgIC8vIGNvbnNvbGUubG9nKGRhdGUpO1xuICAgICAgY29uc3Qgc3RvcmUgPSBkeW5hbWljRGF0YS5kYXRlc1NlbGVjdGVkQXJyYXlPYmplY3RzO1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBzdG9yZS5sZW5ndGg7IGorKykge1xuICAgICAgICAvLyB0aGUgYXJyYXkgaW4gcXVlc3Rpb25cbiAgICAgICAgY29uc3Qgc2luZ2xlU2VsZWN0aW9uID0gc3RvcmVbal07XG4gICAgICAgIC8vIGRhdGEgYXR0ciBvZiBodG1sIGVsZW1lbnRcbiAgICAgICAgY29uc3QgZGF0ZVZhbHVlID0gZGF0ZS5kYXRhc2V0Lmh1bWFuZGF0ZTtcbiAgICAgICAgY29uc3Qgc2VhcmNoID0gKCkgPT4gc2luZ2xlU2VsZWN0aW9uLmZpbmQoKGRhdGVTdG9yZWQpID0+IGRhdGVTdG9yZWQuaHVtYW5kYXRlID09PSBkYXRlVmFsdWUpO1xuICAgICAgICBpZiAoc2VhcmNoKCkpIHtcbiAgICAgICAgICBzaW5nbGVTZWxlY3Rpb24uZm9yRWFjaCgoZGF0ZSkgPT4ge1xuICAgICAgICAgICAgLy8gcmVtb3ZlIHNlbGVjdGlvbiBjb2xvdXJcbiAgICAgICAgICAgIGNvbnN0IGRheURpdiA9IGNhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLWh1bWFuZGF0ZT0nJHtkYXRlLmh1bWFuZGF0ZX0nXWApO1xuICAgICAgICAgICAgdW5zZWxlY3RlZFN0eWxlKGRheURpdik7XG4gICAgICAgICAgICAvLyByZW1vdmUgdGltZXMsIGlmIGFueTpcbiAgICAgICAgICAgIHdoaWxlIChkYXlEaXYuY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICBkYXlEaXYucmVtb3ZlQ2hpbGQoZGF5RGl2Lmxhc3RDaGlsZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgLy8gcmVtb3ZlIGZyb20gc3RvcmFnZVxuICAgICAgICAgIGR5bmFtaWNEYXRhLmRhdGVzU2VsZWN0ZWRBcnJheU9iamVjdHMuc3BsaWNlKGosIDEpO1xuICAgICAgICAgIGR5bmFtaWNEYXRhLmRhdGVzU2VsZWN0ZWRBcnJheS5zcGxpY2UoaiwgMSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoY29uZmlnLnNlbGVjdFJhbmdlKSB7XG4gICAgICBjb25zdCBzdGFydERhdGUgPSBuZXdPYmplY3RzQXJyYXlbMF07XG4gICAgICBjb25zdCBzdGFydEluZGV4ID0gc3RhcnREYXRlLmluZGV4O1xuICAgICAgLy8gaWYgYSBzaW5nbGUgZGF0ZSBpcyBzZWxlY3RlZDpcbiAgICAgIGNvbnN0IGVuZERhdGUgPSBuZXdPYmplY3RzQXJyYXlbMV0gfHwgc3RhcnREYXRlO1xuICAgICAgY29uc3QgZW5kSW5kZXggPSAoZW5kRGF0ZSkgPyBlbmREYXRlLmluZGV4IDogZmFsc2U7XG5cbiAgICAgIGNvbnN0IFtsb3csIGhpZ2hdID0gW3BhcnNlSW50KHN0YXJ0SW5kZXgpLCBwYXJzZUludChlbmRJbmRleCldLnNvcnQoKGEsIGIpID0+IGEgLSBiKTtcblxuICAgICAgZm9yIChsZXQgaSA9IGxvdzsgaSA8PSBoaWdoOyBpKyspIHtcbiAgICAgICAgY29uc3QgZGF0ZURpdiA9IGNhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLWRheWluZGV4PScke2l9J11gKTtcbiAgICAgICAgaWYgKGRhdGVEaXYuY2xhc3NMaXN0LmNvbnRhaW5zKCdibG9ja2VkJykpIHtcbiAgICAgICAgICB1bnNlbGVjdGVkU3R5bGUoY2FsZW5kYXIucXVlcnlTZWxlY3RvcihgW2lkPScke2VuZERhdGV9J11gKSk7XG4gICAgICAgICAgbmV3QXJyYXkuc3BsaWNlKDEsIDEpO1xuICAgICAgICAgIG5ld09iamVjdHNBcnJheS5zcGxpY2UoMSwgMSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgYm9va0RheShkYXRlRGl2KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBib29rRGF5IChkYXRlRGl2KSB7XG4gICAgICBpZiAoY29uZmlnLnNpbmdsZURhdGVDaG9pY2UgJiYgbmV3QXJyYXkubGVuZ3RoID4gMCkge1xuICAgICAgICBjbGVhclNlbGVjdGlvbihjYWxlbmRhciwgZHluYW1pY0RhdGEpO1xuICAgICAgfVxuICAgICAgaWYgKG5ld0FycmF5LmluY2x1ZGVzKGRhdGVEaXYuZGF0YXNldC5odW1hbmRhdGUpID09PSBmYWxzZSkge1xuICAgICAgICBzZWxlY3RlZFN0eWxlKGRhdGVEaXYpO1xuICAgICAgICBuZXdBcnJheS5wdXNoKGRhdGVEaXYuZGF0YXNldC5odW1hbmRhdGUpO1xuICAgICAgICBuZXdPYmplY3RzQXJyYXlbbmV3QXJyYXkubGVuZ3RoIC0gMV0gPSBzdGFuZGFyZERhdGVPYmplY3QoZGF0ZURpdik7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gYm9va0RheXNPZldlZWsgKGRheUluZGV4KSB7XG4gICAgY29uc3QgZGF5cyA9IGNhbGVuZGFyLnF1ZXJ5U2VsZWN0b3JBbGwoYFtkYXRhLWRheW9md2Vlaz1cIiR7ZGF5SW5kZXh9XCJdYCk7XG4gICAgZGF5cy5mb3JFYWNoKChkYXkpID0+IHtcbiAgICAgIGJvb2tEYXRlcyhbZGF5XSwgdHJ1ZSk7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBibG9ja0RheXNPZldlZWsgKGRheUluZGV4QXJyYXkpIHtcbiAgICBkYXlJbmRleEFycmF5LmZvckVhY2goKGRheUluZGV4KSA9PiB7XG4gICAgICBjb25zdCBkYXlzID0gY2FsZW5kYXIucXVlcnlTZWxlY3RvckFsbChgW2RhdGEtZGF5b2Z3ZWVrPVwiJHtkYXlJbmRleH1cIl1gKTtcbiAgICAgIGRheXMuZm9yRWFjaCgoZGF5KSA9PiB7XG4gICAgICAgIGRheS5jbGFzc0xpc3QuYWRkKCdmaWxsZXInKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gcHJlbG9hZERhdGVzIChwcmVsb2FkZWREYXRlcykge1xuICAgIGlmICh0eXBlb2YgcHJlbG9hZGVkRGF0ZXNbMF0gIT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBFcnJvcihgRGF0ZXMgc2hvdWxkIGJlIHByb3ZpZGVkIGFzIHN0cmluZ3MgaW4gdGhlIGZvcm1hdCBZWVlZLU1NLURELCBQcmVsb2FkZWQgZGF0ZXMgaXMgJHtwcmVsb2FkZWREYXRlc31cbiAgICAgICAgIGFuZCB0aGUgZmlyc3QgZGF0ZSBpcyAke3ByZWxvYWRlZERhdGVzWzBdfWApO1xuICAgIH1cbiAgICBpZiAocHJlbG9hZGVkRGF0ZXNbMF0uc3BsaXQoJy0nKVswXS5sZW5ndGggIT09IDQpIHtcbiAgICAgIHRocm93IEVycm9yKCdZZWFyIHJlcXVpcmVzIDQgZGlnaXRzLCBlLmcuIDIwMjYnKTtcbiAgICB9XG4gICAgaWYgKHByZWxvYWRlZERhdGVzWzBdLnNwbGl0KCctJylbMV0ubGVuZ3RoICE9PSAyKSB7XG4gICAgICB0aHJvdyBFcnJvcignTW9udGggcmVxdWlyZXMgMiBkaWdpdHMsIDAxIGZvciBKYW51YXJ5Jyk7XG4gICAgfVxuICAgIGlmIChwcmVsb2FkZWREYXRlc1swXS5zcGxpdCgnLScpWzJdLmxlbmd0aCAhPT0gMikge1xuICAgICAgdGhyb3cgRXJyb3IoJ0RheSByZXF1aXJlcyAyIGRpZ2l0cywgMDEgZm9yIHRoZSBmaXJzdCBkYXkgb2YgdGhlIG1vbnRoJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0RGl2cyAoZGF0ZXMpIHtcbiAgICAgIHJldHVybiBkYXRlc1xuICAgICAgICAubWFwKGRhdGUgPT4gY2FsZW5kYXIucXVlcnlTZWxlY3RvcihgW2RhdGEtaHVtYW5kYXRlPScke2RhdGV9J11gKSlcbiAgICAgICAgLmZpbHRlcihCb29sZWFuKTsgLy8gcmVtb3ZlcyBudWxsc1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGJsb2NrTm90UHJlbG9hZGVkRGF0ZXMgKGRhdGVEaXZzKSB7XG4gICAgICBjb25zdCBub25PcHRpb25zID0gY2FsZW5kYXIucXVlcnlTZWxlY3RvckFsbCgnLmRheVRpbWUnKTtcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBub25PcHRpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGRheSA9IG5vbk9wdGlvbnNbaV07XG5cbiAgICAgICAgaWYgKCFkYXRlRGl2cy5pbmNsdWRlcyhkYXkpKSB7XG4gICAgICAgICAgZGF5LmNsYXNzTGlzdC5hZGQoJ2ZpbGxlcicpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRheS5jbGFzc0xpc3QuYWRkKCdwcmVsb2FkZWQnKTtcbiAgICAgICAgICBkYXkudGl0bGUgPSBjb25maWcucHJlbG9hZGVkVG9vbHRpcDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGRhdGVEaXZzID0gZ2V0RGl2cyhwcmVsb2FkZWREYXRlcyk7XG4gICAgYmxvY2tOb3RQcmVsb2FkZWREYXRlcyhkYXRlRGl2cyk7XG4gIH1cbn1cblxuZXhwb3J0IHsgU3dpZnRDYWwgfTtcbiIsImltcG9ydCB7IGxhbmd1YWdlcyB9IGZyb20gJy4vbGFuZ3VhZ2VzLmpzJztcbmltcG9ydCB7IHByb3h5VG9QbGFpbk9iamVjdEhlbHBlciwgZGVib3VuY2UgfSBmcm9tICcuL2Jhc2ljRnVuY3Rpb25zLmpzJztcblxuLyoqXG4gKiBHZW5lcmF0ZXMgYSB0aW1lIGNob29zZXIgbW9kYWwgZm9yIHNlbGVjdGluZyB0aW1lLiBDYWxsZWQgaW4gY2FsZW5kYXJHZW5lcmF0b3IuanNcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gY29uZmlnIC0gVGhlIGNvbmZpZ3VyYXRpb24gb2JqZWN0LlxuICogQHBhcmFtIHtPYmplY3R9IGR5bmFtaWNEYXRhIC0gVGhlIGR5bmFtaWMgZGF0YSBvYmplY3QuXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBjYWxlbmRhciAtIFRoZSBjYWxlbmRhciBlbGVtZW50LlxuICogQHJldHVybiB7RnVuY3Rpb259IFRoZSBnZW5lcmF0ZWQgdGltZSBjaG9vc2VyIG1vZGFsLlxuICovXG5mdW5jdGlvbiBHZW5lcmF0ZVRpbWVDaG9vc2VyTW9kYWwgKGNvbmZpZywgZHluYW1pY0RhdGEsIGNhbGVuZGFyKSB7XG4gIC8qKlxuICAgKiBBIGN1c3RvbSBldmVudCBlbWl0dGVkIHdoZW4gYSB0aW1lIGlzIGFkZGVkIG9yIHNlbGVjdGVkXG4gICAqXG4gICAqIEByZXR1cm4ge3ZvaWR9IFRoaXMgZnVuY3Rpb24gZG9lcyBub3QgcmV0dXJuIGFueSB2YWx1ZS5cbiAgICovXG5cbiAgY29uc3QgZW1pdFRpbWVTZWxlY3RlZEV2ZW50ID0gZGVib3VuY2UoKCkgPT4ge1xuICAgIGNvbnN0IGV2dCA9IG5ldyBDdXN0b21FdmVudCgndGltZVNlbGVjdCcsIHtcbiAgICAgIGRldGFpbDogeyBkYXRlOiBwcm94eVRvUGxhaW5PYmplY3RIZWxwZXIoZHluYW1pY0RhdGEpIH0sXG4gICAgICBidWJibGVzOiB0cnVlLFxuICAgICAgY29tcG9zZWQ6IHRydWVcbiAgICB9KTtcbiAgICBjb25maWcuY2FsZW5kYXJDb250YWluZXIuZGlzcGF0Y2hFdmVudChldnQpO1xuICB9LCAyNTApO1xuXG4gIGxldCB0aW1lQ2hvb3Nlck1vZGFsO1xuXG4gIGxldCBzZWxlY3Rpb24gPSBbXTtcblxuICB0aGlzLmdldFNlbGVjdGVkVGltZXMgPSAoKSA9PiB7XG4gICAgcmV0dXJuIHNlbGVjdGlvbjtcbiAgfTtcblxuICB0aGlzLmdlbmVyYXRlTW9kYWwgPSAoKSA9PiB7XG4gICAgcmV0dXJuIGdlbmVyYXRlTW9kYWwoKTtcbiAgfTtcblxuICB0aGlzLnNob3cgPSAoKSA9PiB7XG4gICAgY2FsZW5kYXIuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJztcbiAgICByZXR1cm4gdGltZUNob29zZXJNb2RhbC5zaG93KCk7XG4gIH07XG5cbiAgdGhpcy53cml0ZVRvRGF0ZURpdiA9ICgpID0+IHtcbiAgICB3cml0ZVRvRGF0ZURpdigpO1xuICB9O1xuXG4gIHRoaXMud3JpdGVUb0R5bmFtaWNEYXRhID0gKCkgPT4ge1xuICAgIHdyaXRlVG9EeW5hbWljRGF0YSgpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBHZW5lcmF0ZXMgYSBkaWFsb2cgZm9yIGNob29zaW5nIHRpbWUuXG4gICAqXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IEEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIHRoZSBnZW5lcmF0ZWQgdGltZSBjaG9vc2VyIG1vZGFsLlxuICAgKi9cbiAgZnVuY3Rpb24gZ2VuZXJhdGVNb2RhbCAoKSB7XG4gICAgY29uc3QgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICB0aW1lQ2hvb3Nlck1vZGFsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGlhbG9nJyk7XG4gICAgICB0aW1lQ2hvb3Nlck1vZGFsLmNsYXNzTGlzdC5hZGQoJ3RpbWVDaG9vc2VyTW9kYWwnKTtcbiAgICAgIGNhbGVuZGFyLmFwcGVuZENoaWxkKHRpbWVDaG9vc2VyTW9kYWwpO1xuXG4gICAgICBjb25zdCB0aW1lQ29udCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgdGltZUNvbnQuY2xhc3NMaXN0LmFkZCgndGltZUNvbnQnKTtcbiAgICAgIHRpbWVDaG9vc2VyTW9kYWwuYXBwZW5kQ2hpbGQodGltZUNvbnQpO1xuXG4gICAgICBjb25zdCB0aW1lQ2hvb3NlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgdGltZUNob29zZXIuY2xhc3NMaXN0LmFkZCgndGltZUNob29zZXInKTtcbiAgICAgIHRpbWVDb250LmFwcGVuZENoaWxkKHRpbWVDaG9vc2VyKTtcblxuICAgICAgY29uc3QgY29udHJvbHNEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGNvbnRyb2xzRGl2LmNsYXNzTGlzdC5hZGQoJ2RlbGV0ZURpdicpO1xuICAgICAgdGltZUNob29zZXIuYXBwZW5kQ2hpbGQoY29udHJvbHNEaXYpO1xuXG4gICAgICBmdW5jdGlvbiBjbG9zZUZuICgpIHtcbiAgICAgICAgY2FsZW5kYXIuc3R5bGUub3ZlcmZsb3cgPSAnc2Nyb2xsJztcbiAgICAgICAgdGltZUNob29zZXJNb2RhbC5jbG9zZSgpO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBpbm5lckNvbXBvbmVudHMgKCkge1xuICAgICAgICBjb25zdCB0aW1lUGlja2VyQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIHRpbWVQaWNrZXJDb250YWluZXIuY2xhc3NMaXN0LmFkZCgndGltZVBpY2tlckNvbnRhaW5lcicpO1xuICAgICAgICB0aW1lQ2hvb3Nlci5hcHBlbmRDaGlsZCh0aW1lUGlja2VyQ29udGFpbmVyKTtcbiAgICAgICAgY29uc3QgdGl0bGVEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgdGl0bGVEaXYudGV4dENvbnRlbnQgPSBsYW5ndWFnZXNbY29uZmlnLmxhbmd1YWdlXS50aW1lV2lkZ2V0LmFkZFRpbWU7XG4gICAgICAgIHRpdGxlRGl2LmNsYXNzTGlzdC5hZGQoJ2RlbGV0ZURpdicpO1xuICAgICAgICB0aW1lUGlja2VyQ29udGFpbmVyLmFwcGVuZENoaWxkKHRpdGxlRGl2KTtcbiAgICAgICAgbWFrZURyb3BEb3ducyhsYW5ndWFnZXNbY29uZmlnLmxhbmd1YWdlXS50aW1lV2lkZ2V0LnN0YXJ0LCB0aW1lUGlja2VyQ29udGFpbmVyKTtcbiAgICAgICAgbWFrZURyb3BEb3ducyhsYW5ndWFnZXNbY29uZmlnLmxhbmd1YWdlXS50aW1lV2lkZ2V0LmVuZCwgdGltZVBpY2tlckNvbnRhaW5lcik7XG5cbiAgICAgICAgLy8gc2V0VGltZUZvckFsbFRpY2tCb3godGltZVBpY2tlckNvbnRhaW5lcik7XG4gICAgICB9XG5cbiAgICAgIG1ha2VCdXR0b24oY29udHJvbHNEaXYsICdkZWxldGVCdXR0b24nLCAnKycsICdhZGQgdGltZScsICdjbGljaycsIGlubmVyQ29tcG9uZW50cyk7XG4gICAgICBtYWtlQnV0dG9uKGNvbnRyb2xzRGl2LCAnZGVsZXRlQnV0dG9uJywgJy0nLCAncmVtb3ZlIHRpbWUnLCAnY2xpY2snLCByZW1vdmVUaW1lVmFsdWVzT25EYXRlKTtcbiAgICAgIG1ha2VCdXR0b24oY29udHJvbHNEaXYsICdkZWxldGVCdXR0b24nLCAneCcsICdjbG9zZScsICdjbGljaycsIGNsb3NlRm4pO1xuXG4gICAgICByZXNvbHZlKHRpbWVDaG9vc2VyTW9kYWwpO1xuICAgIH0pO1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG5cbiAgZnVuY3Rpb24gd3JpdGVUb0RhdGVEaXYgKCkge1xuICAgIGlmIChjb25maWcuZGlzcGxheVRpbWVTZWxlY3Rpb25PbkRhdGUpIHtcbiAgICAgIGR5bmFtaWNEYXRhLmRhdGVzU2VsZWN0ZWRBcnJheVtkeW5hbWljRGF0YS5kYXRlc1NlbGVjdGVkQXJyYXkubGVuZ3RoIC0gMV0uZm9yRWFjaCgoZGF5U2VsZWN0ZWQpID0+IHtcbiAgICAgICAgd3JpdGUoZGF5U2VsZWN0ZWQpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gd3JpdGUgKGRhdGUpIHtcbiAgICAvLyBjb250YWlucyBhIHRpbWUgZHVyYXRpb24gY2hvaWNlXG4gICAgbGV0IGNhbGVuZGFyVGltZVBhcmVudDtcblxuICAgIGNvbnN0IGRheURpdiA9IGNhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLWh1bWFuZGF0ZT0nJHtkYXRlfSddYCk7XG4gICAgd2hpbGUgKGRheURpdi5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XG4gICAgICBkYXlEaXYucmVtb3ZlQ2hpbGQoZGF5RGl2Lmxhc3RDaGlsZCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY3JlYXRlTmV3UGFyYSAodGV4dCkge1xuICAgICAgY29uc3QgdGltZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICAgIGNhbGVuZGFyVGltZVBhcmVudC5hcHBlbmRDaGlsZCh0aW1lKTtcbiAgICAgIHRpbWUuY2xhc3NMaXN0LmFkZCgnY2FsZW5kYXJUaW1lJyk7XG4gICAgICB0aW1lLnRleHRDb250ZW50ID0gdGV4dDtcbiAgICB9XG5cbiAgICBzZWxlY3Rpb24uZm9yRWFjaCgodGltZVZhbHVlLCBpKSA9PiB7XG4gICAgICBpZiAoaSA9PT0gMCB8fCBpICUgMiA9PT0gMCkge1xuICAgICAgICBjYWxlbmRhclRpbWVQYXJlbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgY2FsZW5kYXJUaW1lUGFyZW50LmNsYXNzTGlzdC5hZGQoJ2NhbGVuZGFyVGltZVBhcmVudCcpO1xuICAgICAgICBkYXlEaXYuYXBwZW5kQ2hpbGQoY2FsZW5kYXJUaW1lUGFyZW50KTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZmllbGROYW1lID0gT2JqZWN0LmtleXModGltZVZhbHVlKVswXTtcbiAgICAgIGNyZWF0ZU5ld1BhcmEoYCR7ZmllbGROYW1lfTpgKTtcbiAgICAgIGNyZWF0ZU5ld1BhcmEoYCR7dGltZVZhbHVlW2ZpZWxkTmFtZV0uaGh9OiR7dGltZVZhbHVlW2ZpZWxkTmFtZV0ubW19YCk7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBtYWtlQnV0dG9uIChwYXJlbnQsIGNsYXNzTmFtZSwgdGV4dENvbnRlbnQsIGhvdmVyVGV4dCwgYWN0aW9uLCBmbikge1xuICAgIGNvbnN0IGJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSk7XG4gICAgYnV0dG9uLnRleHRDb250ZW50ID0gdGV4dENvbnRlbnQ7XG4gICAgYnV0dG9uLnRpdGxlID0gaG92ZXJUZXh0O1xuICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKGFjdGlvbiwgKCkgPT4ge1xuICAgICAgZm4oKTtcbiAgICB9KTtcbiAgICBwYXJlbnQuYXBwZW5kQ2hpbGQoYnV0dG9uKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG1ha2VEcm9wRG93bnMgKGNvbnRleHRUZXh0LCB0aW1lUGlja2VyQ29udGFpbmVyKSB7XG4gICAgLy8gVGhlIHRpbWUgY29udGFpbmVyXG4gICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ3RpbWVDb250YWluZXInKTtcbiAgICBjb250YWluZXIuZGF0YXNldC5jb250ZXh0ID0gY29udGV4dFRleHQ7XG4gICAgdGltZVBpY2tlckNvbnRhaW5lci5hcHBlbmRDaGlsZChjb250YWluZXIpO1xuXG4gICAgY29uc3QgdGltZUZvckNvbnRleHQgPSB7IFtjb250ZXh0VGV4dF06IHt9IH07XG5cbiAgICBzZWxlY3Rpb24ucHVzaCh0aW1lRm9yQ29udGV4dCk7XG5cbiAgICAvLyBNYWtlIGxhYmVsXG4gICAgY29uc3QgbGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgbGFiZWwuY2xhc3NMaXN0LmFkZCgndGltZVNlbGVjdFAnKTtcbiAgICBsYWJlbC50ZXh0Q29udGVudCA9IGAke2NvbnRleHRUZXh0fTpgO1xuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChsYWJlbCk7XG5cbiAgICAvLyBNYWtlIGhvdXIgc2VsZWN0b3JcbiAgICBjb25zdCB0aW1lU2VsZWN0b3JEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB0aW1lU2VsZWN0b3JEaXYuZGF0YXNldC5jb250ZXh0ID0gY29udGV4dFRleHQ7XG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHRpbWVTZWxlY3RvckRpdik7XG5cbiAgICBtYWtlU2VsZWN0b3IoJ2hoJywgMjMsIHRpbWVTZWxlY3RvckRpdiwgY29udGV4dFRleHQsIHRpbWVQaWNrZXJDb250YWluZXIsIHRpbWVGb3JDb250ZXh0KTtcbiAgICBtYWtlU2VsZWN0b3IoJ21tJywgNTksIHRpbWVTZWxlY3RvckRpdiwgY29udGV4dFRleHQsIHRpbWVQaWNrZXJDb250YWluZXIsIHRpbWVGb3JDb250ZXh0KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG1ha2VTZWxlY3RvciAodHlwZSwgbGltaXQsIHRpbWVTZWxlY3RvckRpdiwgY29udGV4dFRleHQsIHRpbWVQaWNrZXJDb250YWluZXIsIHRpbWVGb3JDb250ZXh0KSB7XG4gICAgY29uc3QgZHJvcERvd24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzZWxlY3QnKTtcbiAgICBkcm9wRG93bi5jbGFzc0xpc3QuYWRkKHR5cGUsICd0aW1lU2VsZWN0Jyk7XG4gICAgdGltZVNlbGVjdG9yRGl2LmFwcGVuZENoaWxkKGRyb3BEb3duKTtcblxuICAgIGRyb3BEb3duLmRhdGFzZXQudHlwZSA9IHR5cGU7XG4gICAgZHJvcERvd24uZGF0YXNldC5jb250ZXh0ID0gY29udGV4dFRleHQ7XG5cbiAgICBjb25zdCBwbGFjZWhvbGRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuICAgIHBsYWNlaG9sZGVyLnRleHRDb250ZW50ID0gdHlwZTtcbiAgICBwbGFjZWhvbGRlci52YWx1ZSA9ICcwMCc7XG5cbiAgICAvLyB7XCJTdGFydFwiOntcImhoXCI6XCIwMFwifX0se1wiU3RhcnRcIjp7XCJtbVwiOlwiMDBcIn19XG4gICAgdGltZUZvckNvbnRleHRbY29udGV4dFRleHRdW3R5cGVdID0gcGxhY2Vob2xkZXIudmFsdWU7XG4gICAgZHJvcERvd24uYXBwZW5kQ2hpbGQocGxhY2Vob2xkZXIpO1xuXG4gICAgbGV0IGkgPSAwO1xuICAgIHdoaWxlIChpIDw9IGxpbWl0KSB7XG4gICAgICBjb25zdCBob3VyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XG4gICAgICBsZXQgdGV4dCA9IGkudG9TdHJpbmcoKTtcbiAgICAgIGlmICh0ZXh0Lmxlbmd0aCA9PT0gMSkge1xuICAgICAgICB0ZXh0ID0gYDAke2l9YDtcbiAgICAgIH1cbiAgICAgIGhvdXIudmFsdWUgPSB0ZXh0O1xuICAgICAgaG91ci50ZXh0Q29udGVudCA9IHRleHQ7XG4gICAgICBkcm9wRG93bi5hcHBlbmRDaGlsZChob3VyKTtcbiAgICAgIGkrKztcbiAgICB9XG5cbiAgICBkcm9wRG93bi5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoKSA9PiB7XG4gICAgICB0aW1lRm9yQ29udGV4dFtjb250ZXh0VGV4dF1bdHlwZV0gPSBkcm9wRG93bi52YWx1ZTtcbiAgICAgIHdyaXRlVG9EeW5hbWljRGF0YSgpO1xuICAgICAgd3JpdGVUb0RhdGVEaXYoKTtcbiAgICAgIGVtaXRUaW1lU2VsZWN0ZWRFdmVudCgpO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gd3JpdGVUb0R5bmFtaWNEYXRhICgpIHtcbiAgICBkeW5hbWljRGF0YS5kYXRlc1NlbGVjdGVkQXJyYXlPYmplY3RzW2R5bmFtaWNEYXRhLmRhdGVzU2VsZWN0ZWRBcnJheU9iamVjdHMubGVuZ3RoIC0gMV0uZm9yRWFjaCgoZGF5U2VsZWN0ZWQpID0+IHtcbiAgICAgIGNvbnN0IHRpbWVzID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShzZWxlY3Rpb24pKTtcbiAgICAgIGRheVNlbGVjdGVkLnRpbWVzID0gdGltZXM7XG4gICAgICBjb25zdCBuYW1lcyA9IE9iamVjdC5rZXlzKHRpbWVzKTtcbiAgICAgIE9iamVjdC52YWx1ZXModGltZXMpLmZvckVhY2goKHRpbWUsIGkpID0+IHtcbiAgICAgICAgY29uc3QgdmFsID0gT2JqZWN0LnZhbHVlcyh0aW1lKTtcbiAgICAgICAgY29uc3QgaGhtbXNzID0gT2JqZWN0LnZhbHVlcyh2YWxbMF0pO1xuICAgICAgICBkYXlTZWxlY3RlZC50aW1lc1tuYW1lc1tpXV0uVVRDID0gaHVtYW5kYXRlVG9VVEMoZGF5U2VsZWN0ZWQuaHVtYW5kYXRlLCBoaG1tc3MpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBodW1hbmRhdGVUb1VUQyAoaHVtYW5kYXRlLCB0aW1lKSB7XG4gICAgY29uc3QgaGggPSAodGltZVswXSkgPyB0aW1lWzBdIDogMDtcbiAgICBjb25zdCBtbSA9ICh0aW1lWzFdKSA/IHRpbWVbMV0gOiAwO1xuICAgIGNvbnN0IHNzID0gKHRpbWVbMl0pID8gdGltZVsyXSA6IDA7XG5cbiAgICBsZXQgaW50cyA9IGh1bWFuZGF0ZS5zcGxpdCgnLScpO1xuICAgIGludHMgPSBpbnRzLm1hcCgoaW50KSA9PiBwYXJzZUludChpbnQpKTtcbiAgICBpbnRzWzFdID0gaW50c1sxXSAtIDE7XG4gICAgcmV0dXJuIERhdGUuVVRDKGludHNbMF0sIGludHNbMV0sIGludHNbMl0sIGhoLCBtbSwgc3MpO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVtb3ZlVGltZVZhbHVlc09uRGF0ZSAoKSB7XG4gICAgY29uc3QgZCA9IGR5bmFtaWNEYXRhLmRhdGVzU2VsZWN0ZWRBcnJheU9iamVjdHM7XG4gICAgY29uc3QgbGFzdENob2ljZSA9IGRbZC5sZW5ndGggLSAxXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxhc3RDaG9pY2UubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGRhdGVPYmogPSBsYXN0Q2hvaWNlW2ldO1xuICAgICAgY29uc3QgZGF5RGl2ID0gY2FsZW5kYXIucXVlcnlTZWxlY3RvcihgW2RhdGEtaHVtYW5kYXRlPScke2RhdGVPYmouaHVtYW5kYXRlfSddYCk7XG4gICAgICBkYXlEaXYucmVtb3ZlQ2hpbGQoZGF5RGl2Lmxhc3RDaGlsZCk7XG4gICAgICBkYXRlT2JqLnRpbWVzID0gZGF0ZU9iai50aW1lcy5zbGljZSgwLCAtMik7XG4gICAgfVxuICAgIHNlbGVjdGlvbiA9IHNlbGVjdGlvbi5zbGljZSgwLCAtMik7XG4gICAgY29uc3QgdGltZUNob29zZXIgPSBjYWxlbmRhci5xdWVyeVNlbGVjdG9yKCcudGltZUNob29zZXInKTtcbiAgICB0aW1lQ2hvb3Nlci5yZW1vdmVDaGlsZCh0aW1lQ2hvb3Nlci5sYXN0Q2hpbGQpO1xuICB9XG5cbiAgLyoqXG4gICAqIHRpY2tCb3hlcyAtIGRlc2NyaXB0aW9uXG4gICAqXG4gICAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSB0aW1lUGlja2VyRWxlbWVudHNDb250YWluZXIgVGhpcyBpcyB0aGUgSFRNTCBlbGVtZW50IHRvIHdoaWNoIHRoZSBjaGVja2JveCB3aWxsIGJlIGFwcGVuZGVkLlxuICAgKiBAcmV0dXJuIHtIVE1MRWxlbWVudH0gUmV0dXJucyBhIEhUTUwgY2hlY2tib3ggdG8gc2VsZWN0IGFsbCBkYXlzIG9mIGEgcGFydGljdWxhciB0eXBlIChlLmcuIGFsbCBNb25kYXlzKS5cbiAgICogQGRlc2NyaXB0aW9uIE5PVCBJTVBMRU1FTlRFRFxuICAgKi9cblxuICBmdW5jdGlvbiBzZXRUaW1lRm9yQWxsVGlja0JveCAodGFyZ2V0RGl2KSB7XG4gICAgY29uc3QgZGF5ID0gZHluYW1pY0RhdGEuZGF0ZXNTZWxlY3RlZEFycmF5W2R5bmFtaWNEYXRhLmRhdGVzU2VsZWN0ZWRBcnJheS5sZW5ndGggLSAxXTtcbiAgICBjb25zdCBkYXlDb2RlID0gY2FsZW5kYXIucXVlcnlTZWxlY3RvcihgW2RhdGEtaHVtYW5kYXRlPScke2RheX0nXWApLmRhdGFzZXQuZGF5b2Z3ZWVrO1xuICAgIGNvbnN0IHRleHQgPSBmb3JtYXREYXlUZXh0KGRheUNvZGUpO1xuXG4gICAgY29uc3QgbGFiZWxmb3IgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgbGFiZWxmb3IudGV4dENvbnRlbnQgPSB0ZXh0O1xuICAgIGxhYmVsZm9yLmh0bWxGb3IgPSAnc2V0VGltZUZvckFsbCc7XG4gICAgdGFyZ2V0RGl2LmFwcGVuZENoaWxkKGxhYmVsZm9yKTtcblxuICAgIGNvbnN0IHNldFRpbWVGb3JBbGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgIHNldFRpbWVGb3JBbGwuc2V0QXR0cmlidXRlKCd0eXBlJywgJ2NoZWNrYm94Jyk7XG4gICAgc2V0VGltZUZvckFsbC5uYW1lID0gJ3NldFRpbWVGb3JBbGwnO1xuICAgIHRhcmdldERpdi5hcHBlbmRDaGlsZChzZXRUaW1lRm9yQWxsKTtcblxuICAgIHNldFRpbWVGb3JBbGwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAvLyBCb29rIGRhdGVzIG1ldGhvZCBuZWVkcyB0byBiZSBleHBvc2VkIGluIGEgbWFubmVyIGl0IGNhbiBiZSBjYWxsZWQgZnJvbSBoZXJlXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAqIEZvcm1hdHMgdGhlIGRheSBvZiB0aGUgd2VlayBhbmQgcmV0dXJucyBpdCBhcyBhIHN0cmluZy5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdGV4dEJlZm9yZSAtIFRoZSB0ZXh0IHRvIGJlIGFkZGVkIGJlZm9yZSB0aGUgZm9ybWF0dGVkIGRheS5cbiAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0QWZ0ZXIgLSBUaGUgdGV4dCB0byBiZSBhZGRlZCBhZnRlciB0aGUgZm9ybWF0dGVkIGRheS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBkYXlPZldlZWsgLSBUaGUgaW5kZXggb2YgdGhlIGRheSBvZiB0aGUgd2VlayAoMCBmb3IgU3VuZGF5LCAxIGZvciBNb25kYXksIGV0Yy4pLlxuICogQHJldHVybiB7c3RyaW5nfSBUaGUgZm9ybWF0dGVkIGRheSBvZiB0aGUgd2VlayBhcyBhIHN0cmluZy5cbiAqL1xuICBmdW5jdGlvbiBmb3JtYXREYXlUZXh0IChkYXlPZldlZWspIHtcbiAgICBjb25zdCBkYXlzSW5GdWxsID0gbGFuZ3VhZ2VzW2NvbmZpZy5sYW5ndWFnZV0uZ2VuZXJhbFRpbWUuZGF5c0luRnVsbDtcbiAgICBjb25zdCBiZWZvcmVUZXh0ID0gbGFuZ3VhZ2VzW2NvbmZpZy5sYW5ndWFnZV0uZm9ybWF0RGF5VGV4dC50ZXh0QmVmb3JlO1xuICAgIGNvbnN0IGZvcm1hdHRlZERheSA9IGRheXNJbkZ1bGxbZGF5T2ZXZWVrXTtcbiAgICBjb25zdCBwbHVyYWxpc20gPSBsYW5ndWFnZXNbY29uZmlnLmxhbmd1YWdlXS5wbHVyYWxpc207XG4gICAgY29uc3QgYWZ0ZXJUZXh0ID0gbGFuZ3VhZ2VzW2NvbmZpZy5sYW5ndWFnZV0uZm9ybWF0RGF5VGV4dC50ZXh0QWZ0ZXI7XG4gICAgcmV0dXJuIGAke2JlZm9yZVRleHR9ICR7Zm9ybWF0dGVkRGF5fSR7cGx1cmFsaXNtfSAke2FmdGVyVGV4dH1gO1xuICB9XG59XG5cbmV4cG9ydCB7IEdlbmVyYXRlVGltZUNob29zZXJNb2RhbCB9O1xuIiwiLyplc2xpbnQgcXVvdGVzOiBbXCJlcnJvclwiLCBcImJhY2t0aWNrXCJdKi9cbi8vIEJhY3RpY2tzIGFyZSBlbmZvcmNlZGYgaW4gdGhpcyBmaWxlIHNvIHRoYXQgc3BlY2lhbCBjaGFyYWN0ZXJzIGFyZSBjb3JyZWN0bHkgcmVuZGVyZWQuXG4vKiBMYW5ndWFnZSBkZWZhdWx0cyAqL1xuY29uc3QgZW5HYiA9IHtcbiAgZ2VuZXJhbFRpbWU6IHtcbiAgICBtb250aHM6IFtgSmFudWFyeWAsIGBGZWJydWFyeWAsIGBNYXJjaGAsIGBBcHJpbGAsIGBNYXlgLCBgSnVuZWAsIGBKdWx5YCwgYEF1Z3VzdGAsIGBTZXB0ZW1iZXJgLCBgT2N0b2JlcmAsIGBOb3ZlbWJlcmAsIGBEZWNlbWJlcmBdLFxuICAgIGRheXNJbkZ1bGw6IFtgU3VuZGF5YCwgYE1vbmRheWAsIGBUdWVzZGF5YCwgYFdlZG5lc2RheWAsIGBUaHVyc2RheWAsIGBGcmlkYXlgLCBgU2F0dXJkYXlgXSxcbiAgICBkYXlzVHJ1bmNhdGVkOiBbYFN1bmAsIGBNb25gLCBgVHVlYCwgYFdlZGAsIGBUaHVgLCBgRnJpYCwgYFNhdGBdXG4gIH0sXG4gIHBsdXJhbGlzbTogYHNgLFxuICBmb3JtYXREYXlUZXh0OiB7XG4gICAgdGV4dEJlZm9yZTogYFNldCB0aGVzZSB0aW1lcyBmb3IgYWxsYCxcbiAgICB0ZXh0QWZ0ZXI6IGBgXG4gIH0sXG4gIHRpbWVXaWRnZXQ6IHtcbiAgICBhZGRUaW1lOiBgQWRkIHRpbWU6YCxcbiAgICBzdGFydDogYFN0YXJ0YCxcbiAgICBlbmQ6IGBFbmRgXG4gIH1cbn07XG5cbi8qIExhbmd1YWdlIGRlZmF1bHRzICovXG5jb25zdCBwdFB0ID0ge1xuICBnZW5lcmFsVGltZToge1xuICAgIG1vbnRoczogW2BKYW5laXJvYCwgYEZldmVyZWlyb2AsIGBNYXLDp29gLCBgQWJyaWxgLCBgTWFpb2AsIGBKdW5ob2AsIGBKdWxob2AsIGBBZ29zdG9gLCBgU2V0ZW1icm9gLCBgT3V0dWJyb2AsIGBOb3ZlbWJyb2AsIGBEZXplbWJyb2BdLFxuICAgIGRheXNJbkZ1bGw6IFtgRG9taW5nb2AsIGBTZWd1bmRhLUZlaXJhYCwgYFRlcsOnYS1GZWlyYWAsIGBRdWFydGEtRmVpcmFgLCBgUXVpbnRhLUZlaXJhYCwgYFNleHRhLUZlaXJhYCwgYFPDoWJhZG9gXSxcbiAgICBkYXlzVHJ1bmNhdGVkOiBbYERvbWAsIGBTZWdgLCBgVGVyYCwgYFF1YWAsIGBRdWlgLCBgU2V4YCwgYFNhYmBdXG4gIH0sXG4gIHBsdXJhbGlzbTogYHNgLFxuICBmb3JtYXREYXlUZXh0OiB7XG4gICAgdGV4dEJlZm9yZTogYEFwcGxpcXVlIGVzdGFzIGhvcmFzIGFgLFxuICAgIHRleHRBZnRlcjogYGBcbiAgfSxcbiAgdGltZVdpZGdldDoge1xuICAgIGFkZFRpbWU6IGBBZGljaW9uZSBkdXJhw6fDo286YCxcbiAgICBzdGFydDpgSW7DrWNpb2AsXG4gICAgZW5kOiBgRmltYFxuICB9XG5cbn07XG5cbmNvbnN0IGxhbmd1YWdlcyA9IHsgZW5HYiwgcHRQdCB9O1xuXG5leHBvcnQgeyBsYW5ndWFnZXMgfTtcbiIsImNvbnN0IGNvbG91cnMgPSB7XG4gIG1vbnRoQ29sb3I6ICcjZmMzJyxcbiAgbW9udGhCYWNrZ291bmRCb2xvcjogJyM2Nzk5Y2InLFxuICBkYXlOYW1lQ29sb3I6ICcjMDAwJyxcbiAgZGF5TmFtZUJhY2tncm91bmRDb2xvcjogJyNjY2MnLFxuICBkYXlDb2xvcjogJyMwMDAnLFxuICBkYXlCYWNrZ3JvdW5kQ29sb3I6ICcjZmZmJyxcbiAgbW9udGhCb3JkZXJDb2xvcjogJyNmMTU5MjUnXG59O1xuXG5jb25zdCBzZWxlY3RlZFN0eWxlID0gKGRpdikgPT4ge1xuICBkaXYuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gY29sb3Vycy5tb250aENvbG9yO1xufTtcblxuY29uc3QgdW5zZWxlY3RlZFN0eWxlID0gKGRpdikgPT4ge1xuICBkaXYuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gY29sb3Vycy5kYXlCYWNrZ3JvdW5kQ29sb3I7XG59O1xuXG5leHBvcnQgeyBzZWxlY3RlZFN0eWxlLCB1bnNlbGVjdGVkU3R5bGUsIGNvbG91cnMgfTtcbiJdfQ==
