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
module.exports = ".calendar {\n  display: flex;\n  flex-wrap: wrap;\n  flex-direction: row;\n  background-color: rgba(240, 248, 255, 0);\n  width: 100%;\n  height: 28.8em;\n  overflow-y: auto;\n  position: relative;\n  color: #333;\n  font-family: Ubuntu, Arial, Helvetica, sans-serif;\n  font-size: 1.2em;\n  font-weight: 700;\n  line-height: 1.5;\n}\n.calendar .blocked {\n  background-color: #333;\n}\n.calendar .filler {\n  pointer-events: none;\n  opacity: 0.3;\n}\n.calendar .preloaded {\n  border-color: blue;\n  border-style: solid;\n  border-width: 3px;\n}\n.calendar .timeSelect {\n  padding: 0;\n  width: auto;\n  margin: 0;\n  background-color: #fff;\n  float: right;\n  font-weight: 700;\n  font-family: Arial, Helvetica, sans-serif;\n  border-style: solid;\n  border-radius: 1em;\n  text-align: center;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  border-width: 3px;\n  border-color: #f15925;\n  color: #000;\n  font-size: 0.9em;\n}\n.calendar .timeCont {\n  margin-left: auto;\n  max-width: 20em;\n  background-color: aliceblue;\n  border-style: solid;\n  border-color: #f15925;\n  margin-right: auto;\n  margin-top: 10em;\n}\n.calendar .dayblockrow {\n  display: flex;\n  flex-direction: row;\n  min-width: 100%;\n  background-color: aliceblue;\n}\n.calendar .calendarTimeParent {\n  margin: 0.1em;\n}\n.calendar .calendarTimeParent .calendarTime {\n  font-size: 0.9em;\n  margin-top: 0em;\n  line-height: 1;\n  background-color: aliceblue;\n  color: black;\n  text-align: center;\n  margin: 0px;\n  font-size: 0.8em;\n}\n.calendar .widthShapeDays {\n  width: 14.2857142857%;\n  margin-left: auto;\n  margin-right: auto;\n  text-align: center;\n}\n.calendar .widthShape {\n  width: 14.2857142857%;\n  margin-left: auto;\n  margin-right: auto;\n  text-align: center;\n  min-height: 3.6em;\n  margin-bottom: 0.2em;\n}\n.calendar .monthName {\n  margin: auto;\n  text-align: center;\n  font-family: Ubuntu;\n  font-size: 1.61em;\n  background-color: #337ab7;\n  color: #ffcc33;\n  flex-basis: 100%;\n  border-bottom-style: solid;\n}\n.calendar .weekrow {\n  display: flex;\n  flex-wrap: nowrap;\n  flex-direction: row;\n  background-color: #fff;\n  font-family: \"roboto\", \"arial\";\n}\n.calendar .dayName {\n  color: black;\n  font-family: \"roboto\", \"arial\";\n  font-weight: 600;\n  background-color: #ccc;\n}\n.calendar .month > * {\n  margin-left: 2px;\n  margin-right: 2px;\n}\n.calendar .month {\n  width: 50%;\n  min-width: 300px;\n  margin: auto;\n}\n.calendar .timeChooser {\n  position: static;\n  background-color: aliceblue;\n  margin-left: auto;\n  margin-right: auto;\n}\n.calendar .timeContainer {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.calendar .timeContainer div {\n  display: flex;\n}\n.calendar .timeChooserModal {\n  z-index: 1;\n  width: 100%;\n  height: 100%;\n  background-color: rgba(0, 0, 0, 0.4);\n  position: absolute;\n  margin: 0;\n  padding: 0;\n  border: 0;\n  overflow-x: scroll;\n}\n.calendar .calendarLabel {\n  min-width: 3em;\n  padding: 0em 1em 0em 1em;\n  color: black;\n  font-family: \"roboto\", \"arial\";\n  font-weight: 600;\n  background-color: #ccc;\n  margin: 1em 0 1em 0;\n}\n.calendar .deleteDiv {\n  font-family: Ubuntu;\n  background-color: #337ab7;\n  color: #ffcc33;\n  border-bottom-style: solid;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.calendar .deleteButton {\n  background-color: white;\n  color: #f15925;\n  float: right;\n  font-weight: 700;\n  font-family: Arial, Helvetica, sans-serif;\n  border-style: solid;\n  border-radius: 2em;\n  text-align: center;\n  height: 2em;\n  width: 2em;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  margin: 0 0.5em;\n  font-size: 1.5em;\n}\n.calendar .innerSpanDeleteBtn {\n  text-align: center;\n}\n.calendar .deleteButton:hover,\n.calendar .deleteButton:focus,\n.calendar .timeSelect:hover,\n.calendar .timeSelect:focus {\n  color: #000;\n  text-decoration: none;\n  cursor: pointer;\n}\n.calendar .hour {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 10em;\n}\n.calendar .timeSelectP {\n  display: inline;\n  width: 5em;\n  color: #000;\n}\n.calendar .timeChooser > input[type=checkbox] {\n  outline: #f15925;\n  outline-style: solid;\n}\n.calendar .timeSelect > option {\n  color: #000;\n}\n.calendar .calendar > p,\n.calendar h4,\n.calendar h3,\n.calendar h2,\n.calendar h1,\n.calendar select,\n.calendar option {\n  color: #000;\n}\n.calendar .arrow-up {\n  width: 0;\n  height: 0;\n  border-left: 10px solid transparent;\n  border-right: 10px solid transparent;\n  border-bottom: 10px solid black;\n}\n.calendar .arrow-down {\n  width: 0;\n  height: 0;\n  border-left: 10px solid transparent;\n  border-right: 10px solid transparent;\n  border-top: 10px solid #000;\n}\n.calendar .arrows {\n  float: right;\n  clear: right;\n  position: relative;\n  cursor: pointer;\n  flex-direction: column;\n}\n.calendar .arrow-right {\n  width: 0;\n  height: 0;\n  border-top: 60px solid transparent;\n  border-bottom: 60px solid transparent;\n  border-left: 60px solid green;\n}\n.calendar .arrow-left {\n  width: 0;\n  height: 0;\n  border-top: 10px solid transparent;\n  border-bottom: 10px solid transparent;\n  border-right: 10px solid blue;\n}\n.calendar .dayTime {\n  cursor: pointer;\n}\n.calendar .dayTime > * {\n  pointer-events: none;\n}\n";
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
    config.customClickEvent = configObj.customClickEvent || false;
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwcmVCdW5kbGluZ0pTL2Jhc2ljRnVuY3Rpb25zLmpzIiwicHJlQnVuZGxpbmdKUy9jYWxlbmRhckFwcC5jc3MiLCJwcmVCdW5kbGluZ0pTL2NhbGVuZGFyR2VuZXJhdG9yLmpzIiwicHJlQnVuZGxpbmdKUy9kaXNwbGF5VGltZUNob29zZXJNb2RhbC5qcyIsInByZUJ1bmRsaW5nSlMvbGFuZ3VhZ2VzLmpzIiwicHJlQnVuZGxpbmdKUy9zdHlsZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNBQSxJQUFBLE9BQUEsR0FBQSxPQUFBO0FBQThDLFNBQUEsUUFBQSxDQUFBLHNDQUFBLE9BQUEsd0JBQUEsTUFBQSx1QkFBQSxNQUFBLENBQUEsUUFBQSxhQUFBLENBQUEsa0JBQUEsQ0FBQSxnQkFBQSxDQUFBLFdBQUEsQ0FBQSx5QkFBQSxNQUFBLElBQUEsQ0FBQSxDQUFBLFdBQUEsS0FBQSxNQUFBLElBQUEsQ0FBQSxLQUFBLE1BQUEsQ0FBQSxTQUFBLHFCQUFBLENBQUEsS0FBQSxPQUFBLENBQUEsQ0FBQTtBQUFBLFNBQUEsZUFBQSxHQUFBLEVBQUEsQ0FBQSxXQUFBLGVBQUEsQ0FBQSxHQUFBLEtBQUEscUJBQUEsQ0FBQSxHQUFBLEVBQUEsQ0FBQSxLQUFBLDJCQUFBLENBQUEsR0FBQSxFQUFBLENBQUEsS0FBQSxnQkFBQTtBQUFBLFNBQUEsaUJBQUEsY0FBQSxTQUFBO0FBQUEsU0FBQSw0QkFBQSxDQUFBLEVBQUEsTUFBQSxTQUFBLENBQUEscUJBQUEsQ0FBQSxzQkFBQSxpQkFBQSxDQUFBLENBQUEsRUFBQSxNQUFBLE9BQUEsQ0FBQSxHQUFBLE1BQUEsQ0FBQSxTQUFBLENBQUEsUUFBQSxDQUFBLElBQUEsQ0FBQSxDQUFBLEVBQUEsS0FBQSxhQUFBLENBQUEsaUJBQUEsQ0FBQSxDQUFBLFdBQUEsRUFBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLFdBQUEsQ0FBQSxJQUFBLE1BQUEsQ0FBQSxjQUFBLENBQUEsbUJBQUEsS0FBQSxDQUFBLElBQUEsQ0FBQSxDQUFBLE9BQUEsQ0FBQSwrREFBQSxJQUFBLENBQUEsQ0FBQSxVQUFBLGlCQUFBLENBQUEsQ0FBQSxFQUFBLE1BQUE7QUFBQSxTQUFBLGtCQUFBLEdBQUEsRUFBQSxHQUFBLFFBQUEsR0FBQSxZQUFBLEdBQUEsR0FBQSxHQUFBLENBQUEsTUFBQSxFQUFBLEdBQUEsR0FBQSxHQUFBLENBQUEsTUFBQSxXQUFBLENBQUEsTUFBQSxJQUFBLE9BQUEsS0FBQSxDQUFBLEdBQUEsR0FBQSxDQUFBLEdBQUEsR0FBQSxFQUFBLENBQUEsSUFBQSxJQUFBLENBQUEsQ0FBQSxJQUFBLEdBQUEsQ0FBQSxDQUFBLFVBQUEsSUFBQTtBQUFBLFNBQUEsc0JBQUEsQ0FBQSxFQUFBLENBQUEsUUFBQSxDQUFBLFdBQUEsQ0FBQSxnQ0FBQSxNQUFBLElBQUEsQ0FBQSxDQUFBLE1BQUEsQ0FBQSxRQUFBLEtBQUEsQ0FBQSw0QkFBQSxDQUFBLFFBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsT0FBQSxDQUFBLE9BQUEsQ0FBQSxpQkFBQSxDQUFBLElBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsQ0FBQSxHQUFBLElBQUEsUUFBQSxDQUFBLFFBQUEsTUFBQSxDQUFBLENBQUEsTUFBQSxDQUFBLFVBQUEsQ0FBQSx1QkFBQSxDQUFBLElBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsQ0FBQSxHQUFBLElBQUEsTUFBQSxDQUFBLENBQUEsSUFBQSxDQUFBLENBQUEsQ0FBQSxLQUFBLEdBQUEsQ0FBQSxDQUFBLE1BQUEsS0FBQSxDQUFBLEdBQUEsQ0FBQSxpQkFBQSxDQUFBLElBQUEsQ0FBQSxPQUFBLENBQUEsR0FBQSxDQUFBLHlCQUFBLENBQUEsWUFBQSxDQUFBLGVBQUEsQ0FBQSxHQUFBLENBQUEsY0FBQSxNQUFBLENBQUEsQ0FBQSxNQUFBLENBQUEs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QUEsQ0FBQSxJQUFBLENBQUEsQ0FBQSxHQUFBLElBQUEsTUFBQSxDQUFBLENBQUEsSUFBQSxDQUFBLENBQUEsQ0FBQSxLQUFBLEdBQUEsQ0FBQSxDQUFBLE1BQUEsS0FBQSxDQUFBLEdBQUEsQ0FBQSxpQkFBQSxDQUFBLElBQUEsQ0FBQSxPQUFBLENBQUEsR0FBQSxDQUFBLHlCQUFBLENBQUEsWUFBQSxDQUFBLGVBQUEsQ0FBQSxHQUFBLENBQUEsY0FBQSxNQUFBLENBQUEsQ0FBQSxNQUFBLENBQUEsMkJBQUEsQ0FBQSxRQUFBLENBQUEsYUFBQSxDQUFBO0FBQUEsU0FBQSxnQkFBQSxHQUFBLFFBQUEsS0FBQSxDQUFBLE9BQUEsQ0FBQSxHQUFBLFVBQUEsR0FBQTtBQUFBLFNBQUEsUUFBQSxDQUFBLHNDQUFBLE9BQUEsd0JBQUEsTUFBQSx1QkFBQSxNQUFBLENBQUEsUUFBQSxhQUFBLENBQUEsa0JBQUEsQ0FBQSxnQkFBQSxDQUFBLFdBQUEsQ0FBQSx5QkFBQSxNQUFBLElBQUEsQ0FBQSxDQUFBLFdBQUEsS0FBQSxNQUFBLElBQUEsQ0FBQSxLQUFBLE1BQUEsQ0FBQSxTQUFBLHFCQUFBLENBQUEsS0FBQSxPQUFBLENBQUEsQ0FBQTtBQUFBLFNBQUEsa0JBQUEsTUFBQSxFQUFBLEtBQUEsYUFBQSxDQUFBLE1BQUEsQ0FBQSxHQUFBLEtBQUEsQ0FBQSxNQUFBLEVBQUEsQ0FBQSxVQUFBLFVBQUEsR0FBQSxLQUFBLENBQUEsQ0FBQSxHQUFBLFVBQUEsQ0FBQSxVQUFBLEdBQUEsVUFBQSxDQUFBLFVBQUEsV0FBQSxVQUFBLENBQUEsWUFBQSx3QkFBQSxVQUFBLEVBQUEsVUFBQSxDQUFBLFFBQUEsU0FBQSxNQUFBLENBQUEsY0FBQSxDQUFBLE1BQUEsRUFBQSxjQUFBLENBQUEsVUFBQSxDQUFBLEdBQUEsR0FBQSxVQUFBO0FBQUEsU0FBQSxhQUFBLFdBQUEsRUFBQSxVQUFBLEVBQUEsV0FBQSxRQUFBLFVBQUEsRUFBQSxpQkFBQSxDQUFBLFdBQUEsQ0FBQSxTQUFBLEVBQUEsVUFBQSxPQUFBLFdBQUEsRUFB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VUFBQSxZQUFBLFdBQUEsTUFBQSxFQUFBLElBQUEsRUFBQSxLQUFBLFFBQUEsQ0FBQSxXQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsS0FBQSxDQUFBLENBQUEsRUFBQSxJQUFBLE9BQUEsV0FBQSxHQUFBLFFBQUEsQ0FBQSxJQUFBLENBQUEsS0FBQSxDQUFBLE1BQUEsRUFBQSxDQUFBLE9BQUEsUUFBQSxPQUFBLFdBQUEsUUFBQSxLQUFBLEVBQUEsZUFBQSxDQUFBLFFBQUEsRUFBQSxLQUFBLENBQUEsU0FBQSxVQUFBLFFBQUEsY0FBQSxVQUFBLENBQUEsS0FBQSxPQUFBLFNBQUE7QUFBQSxTQUFBLDBCQUFBLGVBQUEsT0FBQSxxQkFBQSxPQUFBLENBQUEsU0FBQSxvQkFBQSxPQUFBLENBQUEsU0FBQSxDQUFBLElBQUEsMkJBQUEsS0FBQSxvQ0FBQSxPQUFBLENBQUEsU0FBQSxDQUFBLE9BQUEsQ0FBQSxJQUFBLENBQUEsT0FBQSxDQUFBLFNBQUEsQ0FBQSxPQUFBLDhDQUFBLENBQUE7QUFBQSxTQUFBLGtCQUFBLEVBQUEsV0FBQSxRQUFBLENBQUEsUUFBQSxDQUFBLElBQUEsQ0FBQSxFQUFBLEVBQUEsT0FBQTtBQUFBLFNBQUEsZ0JBQUEsQ0FBQSxFQUFBLENBQUEsSUFBQSxlQUFBLEdBQUEsTUFBQSxDQUFBLGNBQUEsR0FBQSxNQUFBLENBQUEsY0FBQSxDQUFBLElBQUEsY0FBQSxnQkFBQSxDQUFBLEVBQUEsQ0FBQSxJQUFBLENBQUEsQ0FBQSxTQUFBLEdBQUEsQ0FBQSxTQUFBLENBQUEsWUFBQSxlQUFBLENBQUEsQ0FBQSxFQUFBLENBQUE7QUFBQSxTQUFBLGdCQUFBLENBQUEsSUFBQSxlQUFBLEdBQUEsTUFBQSxDQUFBLGNBQUEsR0FBQSxNQUFBLENBQUEsY0FBQSxDQUFBLElBQUEsY0FBQSxnQkFBQSxDQUFBLFdBQUEsQ0FBQSxDQUFBLFNBQUEsSUFBQSxNQUFBLENBQUEsY0FBQSxDQUFBLENBQUEsYUFBQSxlQUFBLENBQUEsQ0FBQSxLQWxCdEM7QUFDQTtBQUNBO0FBQ0Esd05BSEEsQ0FLQTtB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TTtFQUNsQixtQkFBbUIsRUFBRSxTQUFTO0VBQzlCLFlBQVksRUFBRSxNQUFNO0VBQ3BCLHNCQUFzQixFQUFFLE1BQU07RUFDOUIsUUFBUSxFQUFFLE1BQU07RUFDaEIsa0JBQWtCLEVBQUUsTUFBTTtFQUMxQixnQkFBZ0IsRUFBRTtBQUNwQixDQUFDO0FBRUQsSUFBTSxhQUFhLEdBQUEsT0FBQSxDQUFBLGFBQUEsR0FBRyxTQUFoQixhQUFhLENBQUksR0FBRyxFQUFLO0VBQzdCLEdBQUcsQ0FBQyxLQUFLLENBQUMsZUFBZSxHQUFHLE9BQU8sQ0FBQyxVQUFVO0FBQ2hELENBQUM7QUFFRCxJQUFNLGVBQWUsR0FBQSxPQUFBLENBQUEsZUFBQSxHQUFHLFNBQWxCLGVBQWUsQ0FBSSxHQUFHLEVBQUs7RUFDL0IsR0FBRyxDQUFDLEtBQUssQ0FBQyxlQUFlLEdBQUcsT0FBTyxDQUFDLGtCQUFrQjtBQUN4RCxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiaW1wb3J0IHsgdW5zZWxlY3RlZFN0eWxlIH0gZnJvbSAnLi9zdHlsZXMuanMnO1xuXG4vKipcbiAqIEFkZHMgMSB0byB0aGUgbW9udGggaW4gYSBnaXZlbiBkYXRlIHRvIG1ha2UgaXQgbW9yZSBodW1hbi1yZWFkYWJsZS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBkYXRlIC0gVGhlIGRhdGUgaW4gdGhlIGZvcm1hdCAnWVlZWS1NTS1ERCcgb3IgJ1lZWVktTS1EJy5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IC0gVGhlIG1vZGlmaWVkIGRhdGUgaW4gdGhlIGZvcm1hdCAnWVlZWS1NTS1ERCcuXG4gKiBAdGhyb3dzIHtFcnJvcn0gLSBJZiB0aGUgZGF0ZSBwYXJhbWV0ZXIgaXMgbm90IGluIHRoZSBmb3JtYXQgJ1lZWVktTU0tREQnIG9yICdZWVlZLU0tRCcuXG4gKi9cbmZ1bmN0aW9uIGh1bWFuRGF0ZSAoZGF0ZSkge1xuICBjb25zdCBkYXRlUGFydHMgPSBkYXRlLnNwbGl0KCctJyk7XG4gIGNvbnN0IG1vbnRoID0gcGFyc2VJbnQoZGF0ZVBhcnRzWzFdKSArIDE7XG4gIGNvbnN0IGRheSA9IHBhcnNlSW50KGRhdGVQYXJ0c1syXSk7XG4gIGNvbnN0IG1vZGlmaWVkTW9udGggPSBtb250aCA8IDEwID8gYDAke21vbnRofWAgOiBtb250aDtcbiAgY29uc3QgbW9kaWZpZWREYXkgPSBkYXkgPCAxMCA/IGAwJHtkYXl9YCA6IGRheTtcbiAgY29uc3QgbW9kaWZpZWREYXRlID0gYCR7ZGF0ZVBhcnRzWzBdfS0ke21vZGlmaWVkTW9udGh9LSR7bW9kaWZpZWREYXl9YDtcbiAgcmV0dXJuIG1vZGlmaWVkRGF0ZTtcbn1cblxuLyoqXG4gKiBDb252ZXJ0cyBhIGh1bWFuIGRhdGUgc3RyaW5nIHRvIFVUQyB0aW1lc3RhbXAuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGh1bWFuZGF0ZSAtIFRoZSBodW1hbi1yZWFkYWJsZSBkYXRlIHN0cmluZyBpbiB0aGUgZm9ybWF0IFwiWVlZWS1NTS1ERFwiLlxuICogQHJldHVybiB7bnVtYmVyfSAtIFRoZSBVVEMgdGltZXN0YW1wIGluIG1pbGxpc2Vjb25kcy5cbiAqL1xuZnVuY3Rpb24gaHVtYW5kYXRlVG9VVEMgKGh1bWFuZGF0ZSkge1xuICBsZXQgaW50cyA9IGh1bWFuZGF0ZS5zcGxpdCgnLScpO1xuICBpbnRzID0gaW50cy5tYXAoKGludCkgPT4gcGFyc2VJbnQoaW50KSk7XG4gIGludHNbMV0gPSBpbnRzWzFdIC0gMTtcbiAgcmV0dXJuIERhdGUuVVRDKGludHNbMF0sIGludHNbMV0sIGludHNbMl0pO1xufVxuXG4vLyBtb2RlbCBvYmplY3RcbmNvbnN0IGRhdGVPYmplY3RUZW1wbGF0ZSA9IHsgZGF5OiAnZGF5JywgaHVtYW5kYXRlOiAnWVlZWS1NTS1ERCcsIGluZGV4OiAnMCcsIFVUQzogMTY5ODI3ODQwMDAwMCB9O1xuLyoqXG4gKiBDcmVhdGVzIGEgc3RhbmRhcmQgZGF0ZSBvYmplY3Qgd2l0aCB0aGUgZ2l2ZW4gZGF0ZS5cbiAqXG4gKiBAcGFyYW0ge2FueX0gZGF0ZSAtIElzIGEgc3RyaW5nIFlZWVktTU0tREQgbW9udGhzIGFyZSBjb3VudGVkIGZyb20gMC5cbiAqIEByZXR1cm4ge29iamVjdH0gVGhlIHN0YW5kYXJkIGRhdGUgb2JqZWN0IHdpdGggdGhlIGdpdmVuIGRhdGUuXG4gKi9cbmZ1bmN0aW9uIHN0YW5kYXJkRGF0ZU9iamVjdCAoZGF0ZSkge1xuICBjb25zdCBvYmogPSBPYmplY3QuY3JlYXRlKGRhdGVPYmplY3RUZW1wbGF0ZSk7XG4gIG9iai5kYXkgPSBkYXRlLmRhdGFzZXQuZGF5O1xuICBvYmouaHVtYW5kYXRlID0gZGF0ZS5kYXRhc2V0Lmh1bWFuZGF0ZTtcbiAgb2JqLmluZGV4ID0gZGF0ZS5kYXRhc2V0LmRheWluZGV4O1xuICBvYmouVVRDID0gaHVtYW5kYXRlVG9VVEMoZGF0ZS5kYXRhc2V0Lmh1bWFuZGF0ZSk7XG4gIHJldHVybiBvYmo7XG59XG5cbi8qKlxuICogQ2FsY3VsYXRlcyB0aGUgdGltZSB2YWx1ZSBpbiBtaWxsaXNlY29uZHMgYmFzZWQgb24gdGhlIGdpdmVuIHRpbWUuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHRpbWUgLSBUaGUgdGltZSBpbiB0aGUgZm9ybWF0IFwiSEg6TU1cIi5cbiAqIEByZXR1cm4ge251bWJlcn0gVGhlIHRpbWUgdmFsdWUgaW4gbWlsbGlzZWNvbmRzLlxuICpcbiAqIEBoYXNUZXN0c1xuICpcbiAqIEBleGFtcGxlXG4gKiAvLyBFeGFtcGxlIHVzYWdlOlxuICogY29uc3QgdGltZVZhbHVlID0gdGltZVZhbHVlSW5NaWxsKCcxMjozMCcpO1xuICovXG5cbmZ1bmN0aW9uIHRpbWVWYWx1ZUluTWlsbCAodGltZSkge1xuICBpZiAoIXRpbWUuaW5jbHVkZXMoJzonKSkge1xuICAgIGNvbnN0IGUgPSBuZXcgRXJyb3IoJ0V4cGVjdHMgYSB0aW1lIHN0cmluZyBISDpNTScpO1xuICAgIHRocm93IGU7XG4gIH1cbiAgY29uc3QgW2hvdXJzLCBtaW51dGVzXSA9IHRpbWUuc3BsaXQoJzonKTtcbiAgcmV0dXJuIChwYXJzZUludChob3VycykgKiA2MCAqIDYwICogMTAwMCkgKyAocGFyc2VJbnQobWludXRlcykgKiA2MCAqIDEwMDApO1xufVxuXG4vKipcbiAqIGV0RGF5c0luTW9udGggLSBHZXQgbnVtYmVyIG9mIGRheXMgaW4gbW9udGhcbiAqXG4gKiBAcGFyYW0gIHshbnVtYmVyfSBtb250aCBUaGUgbnVtYmVyIG9mIHRoZSBjb3JyZXNwb25kaW5nIG1vbnRoLlxuICogQHBhcmFtICB7IW51bWJlcn0geWVhciAgVGhlIGNvcnJlc3BvbmRpbmcgeWVhci5cbiAqIEByZXR1cm4ge251bWJlcn0gUmV0dXJucyBhIG51bWJlciBjb3JyZXNwb25kaW5nIHRvIHRoZSBudW1iZXIgb2YgZGF5cyBmb3IgdGhlIGRhdGUgaW4gcG9pbnQuXG4gKi9cbmZ1bmN0aW9uIGdldERheXNJbk1vbnRoIChtb250aCwgeWVhcikge1xuICByZXR1cm4gbmV3IERhdGUoeWVhciwgbW9udGgsIDApLmdldERhdGUoKTtcbn1cblxuLyoqXG4gKiBDbGVhcnMgdGhlIHNlbGVjdGlvbiBpbiB0aGUgY2FsZW5kYXIgYnkgcmVtb3ZpbmcgdGhlIHNlbGVjdGVkIGRhdGVzIGFuZFxuICogcmVzZXR0aW5nIHRoZSBkeW5hbWljIGRhdGEuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGNhbGVuZGFyIC0gVGhlIGNhbGVuZGFyIGNvbXBvbmVudC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBkeW5hbWljRGF0YSAtIFRoZSBkeW5hbWljIGRhdGEgb2JqZWN0LlxuICogQHJldHVybiB7dW5kZWZpbmVkfSBUaGlzIGZ1bmN0aW9uIGRvZXMgbm90IHJldHVybiBhIHZhbHVlLlxuICovXG5mdW5jdGlvbiBjbGVhclNlbGVjdGlvbiAoY2FsZW5kYXIsIGR5bmFtaWNEYXRhKSB7XG4gIGNvbnN0IGRhdGVzT2JqU3RvcmUgPSBkeW5hbWljRGF0YS5kYXRlc1NlbGVjdGVkQXJyYXlPYmplY3RzO1xuICBjb25zdCBkYXRlc0luZGV4ID0gZHluYW1pY0RhdGEuZGF0ZXNTZWxlY3RlZEFycmF5O1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0ZXNPYmpTdG9yZS5sZW5ndGg7IGkrKykge1xuICAgIGZvciAobGV0IGogPSAwOyBqIDwgZGF0ZXNJbmRleC5sZW5ndGg7IGorKykge1xuICAgICAgZGF0ZXNJbmRleFtqXS5mb3JFYWNoKChkYXRlKSA9PiB7XG4gICAgICAgIGNvbnN0IGRhdGVEaXYgPSBjYWxlbmRhci5xdWVyeVNlbGVjdG9yKGBbZGF0YS1odW1hbmRhdGU9JyR7ZGF0ZX0nXWApO1xuICAgICAgICB1bnNlbGVjdGVkU3R5bGUoZGF0ZURpdik7XG4gICAgICAgIHdoaWxlIChkYXRlRGl2LmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBkYXRlRGl2LnJlbW92ZUNoaWxkKGRhdGVEaXYubGFzdENoaWxkKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaSA9PT0gZGF0ZXNPYmpTdG9yZS5sZW5ndGggLSAxICYmIGogPT09IGRhdGVzSW5kZXgubGVuZ3RoIC0gMSkge1xuICAgICAgICAgIGRhdGVzT2JqU3RvcmUubGVuZ3RoID0gMDtcbiAgICAgICAgICBkYXRlc0luZGV4Lmxlbmd0aCA9IDA7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEBwYXJhbSB7bnVtYmVyfSBbbGVuZ3RoPTEwXSAtbGVuZ3RoIHRoZSBkZXNpcmVkIGxlbmd0aCBvZiB0aGUgc3RyaW5nIG9mIG51bWJlcnMuXG4gKiBAcmV0dXJucyBhIHN0cmluZyBvZiByYW5kb20gZGlnaXRzIG9mIGEgc3BlY2lmaWVkIGxlbmd0aC5cbiAqL1xuXG5mdW5jdGlvbiByYW5kb21CeXRlcyAobGVuZ3RoKSB7XG4gIGlmIChsZW5ndGggPiA4MCkge1xuICAgIGNvbnN0IGUgPSBuZXcgRXJyb3IoJ3JhbmRvbUJ5dGVzIGxlbmd0aCBjYW4gYmUgbW9yZSB0aGFuIDgwMCBkaWdpdHMnKTtcbiAgICB0aHJvdyBlO1xuICB9XG4gIGNvbnN0IGFycmF5ID0gbmV3IFVpbnQzMkFycmF5KDEwMCk7XG4gIHdpbmRvdy5jcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKGFycmF5KTtcbiAgbGV0IHN0ID0gJyc7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICBzdCArPSBhcnJheVtpXTtcbiAgICBpZiAoaSA9PT0gYXJyYXkubGVuZ3RoIC0gMSkge1xuICAgICAgcmV0dXJuIHN0LnNsaWNlKHN0Lmxlbmd0aCAtIChsZW5ndGggfHwgMTApKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gcHJveHlUb1BsYWluT2JqZWN0SGVscGVyIChwcm94eSkge1xuICBpZiAoQXJyYXkuaXNBcnJheShwcm94eSkpIHtcbiAgICAvLyBJZiBpdCdzIGFuIGFycmF5LCBtYXAgb3ZlciB0aGUgYXJyYXkgYW5kIGNvbnZlcnQgZWFjaCBlbGVtZW50IHJlY3Vyc2l2ZWx5XG4gICAgcmV0dXJuIHByb3h5Lm1hcChwcm94eVRvUGxhaW5PYmplY3RIZWxwZXIpO1xuICB9IGVsc2UgaWYgKHByb3h5ICE9PSBudWxsICYmIHR5cGVvZiBwcm94eSA9PT0gJ29iamVjdCcpIHtcbiAgICAvLyBJZiBpdCdzIGFuIG9iamVjdCAoYW5kIG5vdCBudWxsKSwgcmVjdXJzaXZlbHkgY29udmVydCBlYWNoIHByb3BlcnR5XG4gICAgY29uc3QgcGxhaW5PYmplY3QgPSB7fTtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBwcm94eSkge1xuICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChwcm94eSwga2V5KSkge1xuICAgICAgICBwbGFpbk9iamVjdFtrZXldID0gcHJveHlUb1BsYWluT2JqZWN0SGVscGVyKHByb3h5W2tleV0pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcGxhaW5PYmplY3Q7XG4gIH0gZWxzZSB7XG4gICAgLy8gRm9yIHByaW1pdGl2ZSB2YWx1ZXMgKG51bWJlcnMsIHN0cmluZ3MsIGV0Yy4pLCBqdXN0IHJldHVybiB0aGUgdmFsdWVcbiAgICByZXR1cm4gcHJveHk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2VuZXJhdGVSYW5kb21TdHJpbmcgKCkge1xuICBjb25zdCByYW5kb21TdHJpbmcgPSByYW5kb21CeXRlcygxMCk7XG4gIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjY2FsZW5kYXItJyArIHJhbmRvbVN0cmluZykpIHtcbiAgICByZXR1cm4gZ2VuZXJhdGVSYW5kb21TdHJpbmcoKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gcmFuZG9tU3RyaW5nO1xuICB9XG59XG5cbi8vIFdFIFdFUkUgU0VUVElORyBVUCBUSEUgQ0FMRU5EQVIgVE8gUkVOREVSIERBVEVTIElOIFRIRSBQQVNUOlxuLyogV2FybmluZzogQ29udGVtcGxhdGVzIGRheWxpZ2h0IHNhdmluZyB0aW1lICovXG5cbi8qKlxuICogQ2FsY3VsYXRlcyBhbmQgcmV0dXJucyB0aGUgZWFybGllc3QgZGF0ZSBmcm9tIGEgZ2l2ZW4gYXJyYXkgb2YgcHJlbG9hZGVkIGRhdGVzLlxuICpcbiAqIEBwYXJhbSB7QXJyYXl9IHByZWxvYWRlZERhdGVzIC0gQW4gYXJyYXkgb2YgcHJlbG9hZGVkIGRhdGVzLlxuICogQHJldHVybiB7RGF0ZX0gVGhlIGVhcmxpZXN0IGRhdGUgZnJvbSB0aGUgcHJlbG9hZGVkIGRhdGVzLlxuICovXG5mdW5jdGlvbiBnZXRFYXJsaWVzdERhdGUgKHByZWxvYWRlZERhdGVzKSB7XG4gIGNvbnN0IG9yZGVyID0gW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcHJlbG9hZGVkRGF0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoaSA9PT0gMCkge1xuICAgICAgb3JkZXIucHVzaChuZXcgRGF0ZSgpLmdldFRpbWUoKSk7XG4gICAgfVxuICAgIG9yZGVyLnB1c2gobmV3IERhdGUocHJlbG9hZGVkRGF0ZXNbaV0pLmdldFRpbWUoKSk7XG4gICAgaWYgKGkgPT09IHByZWxvYWRlZERhdGVzLmxlbmd0aCAtIDEpIHtcbiAgICAgIG9yZGVyLnNvcnQoKTtcbiAgICAgIGNvbnN0IGQgPSBuZXcgRGF0ZShvcmRlclswXSk7XG4gICAgICByZXR1cm4gZDtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBHZW5lcmF0ZXMgYSBmdW5jdGlvbiBjb21tZW50IGZvciB0aGUgZ2l2ZW4gZnVuY3Rpb24gYm9keSBpbiBhIG1hcmtkb3duXG4gKiBjb2RlIGJsb2NrIHdpdGggdGhlIGNvcnJlY3QgbGFuZ3VhZ2Ugc3ludGF4LlxuICpcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGNhbGVuZGFyIC0gVGhlIGNhbGVuZGFyIGNvbXBvbmVudC5cbiAqIEBwYXJhbSB7QXJyYXl9IGRhdGVzT3BlbiAtIEFuIGFycmF5IG9mIG9wZW4gZGF0ZXMuXG4gKi9cbmZ1bmN0aW9uIGJsb2NrRGF5c05vdE9wZW4gKGNhbGVuZGFyLCBkYXRlc09wZW4pIHtcbiAgaWYgKGNhbGVuZGFyICYmIGRhdGVzT3Blbikge1xuICAgIGNvbnN0IGFsbERheXMgPSBBcnJheS5mcm9tKGNhbGVuZGFyLnF1ZXJ5U2VsZWN0b3JBbGwoJy5kYXlUaW1lJykpLm1hcCgoZWwpID0+IHsgcmV0dXJuIGVsLmRhdGFzZXQuaHVtYW5kYXRlOyB9KTtcbiAgICBjb25zdCBvcGVuRGF5cyA9IGRhdGVzT3Blbi5tYXAoKGVsKSA9PiB7IHJldHVybiBlbC5kYXk7IH0pO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhbGxEYXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAob3BlbkRheXMuaW5kZXhPZihhbGxEYXlzW2ldKSA9PT0gLTEpIHtcbiAgICAgICAgY29uc3QgZGF5ID0gY2FsZW5kYXIucXVlcnlTZWxlY3RvcihgW2lkPVwiJHthbGxEYXlzW2ldfVwiXWApO1xuICAgICAgICAvLyBkYXkuY2xhc3NMaXN0LmFkZCgnd2lkdGhTaGFwZScsICdmaWxsZXInKTtcbiAgICAgICAgZGF5LnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICd3aGl0ZSc7XG4gICAgICAgIGRheS50aXRsZSA9ICdDbG9zZWQgb24gdGhpcyBkYXknO1xuXG4gICAgICAgIGNvbnN0IGNsb3NlZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICAgICAgY2xvc2VkLmNsYXNzTGlzdC5hZGQoJ2NhbGVuZGFyVGltZScpO1xuICAgICAgICBjbG9zZWQudGV4dENvbnRlbnQgPSAnY2xvc2VkJztcblxuICAgICAgICBkYXkuYXBwZW5kQ2hpbGQoY2xvc2VkKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gc29ydFRpbWVzICh2YWwpIHtcbiAgY29uc3Qgc29ydGVkID0gW107XG4gIHJldHVybiBlbnVtZXJhdGUodmFsKTtcblxuICBmdW5jdGlvbiBzb3J0TnVtYmVyIChhLCBiKSB7XG4gICAgcmV0dXJuIGEgLSBiO1xuICB9XG5cbiAgZnVuY3Rpb24gZW51bWVyYXRlICh2YWx1ZXMpIHtcbiAgICBjb25zdCBudW1lcmljYWxFcXVpdmFsZW50ID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB2YWx1ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIG51bWVyaWNhbEVxdWl2YWxlbnQucHVzaCh0aW1lVmFsdWVJbk1pbGwodmFsdWVzW2ldKSk7XG4gICAgICBpZiAoaSA9PT0gdmFsdWVzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgcmV0dXJuIHNvcnQodmFsdWVzLCBudW1lcmljYWxFcXVpdmFsZW50KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBzb3J0ICh2YWx1ZXMsIG51bWVyaWNhbEVxdWl2YWxlbnQpIHtcbiAgICBjb25zdCBudW1lcmljYWxFcXVpdmFsZW50Q2xvbmUgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KG51bWVyaWNhbEVxdWl2YWxlbnQpKTtcbiAgICBjb25zdCBzb3J0ZWRJbnQgPSBudW1lcmljYWxFcXVpdmFsZW50LnNvcnQoc29ydE51bWJlcik7XG4gICAgZm9yIChsZXQgcCA9IDA7IHAgPCBudW1lcmljYWxFcXVpdmFsZW50Q2xvbmUubGVuZ3RoOyBwKyspIHtcbiAgICAgIGNvbnN0IG5ld0luZGV4ID0gc29ydGVkSW50LmluZGV4T2YobnVtZXJpY2FsRXF1aXZhbGVudENsb25lW3BdKTtcbiAgICAgIHNvcnRlZC5zcGxpY2UocCwgMSwgdmFsdWVzW25ld0luZGV4XSk7XG4gICAgICBpZiAocCA9PT0gbnVtZXJpY2FsRXF1aXZhbGVudC5sZW5ndGggLSAxKSB7XG4gICAgICAgIHJldHVybiBzb3J0ZWQ7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogQ2hlY2tzIGZvciBvdmVybGFwIGluIGFuIGFycmF5IG9mIHZhbHVlcy5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSB2YWx1ZXMgLSBUaGUgYXJyYXkgb2YgdmFsdWVzIHRvIGNoZWNrIGZvciBvdmVybGFwLlxuICogQHJldHVybiB7Ym9vbGVhbn0gLSBSZXR1cm5zIHRydWUgaWYgb3ZlcmxhcCBpcyBmb3VuZCwgZmFsc2Ugb3RoZXJ3aXNlLlxuICogQEBkZXNjcmlwdGlvbiBub3QgY2FsbGVkIGFueXdoZXJlICh5ZXQpXG4gKi9cbmZ1bmN0aW9uIGNoZWNrT3ZlcmxhcCAodmFsdWVzKSB7XG4gIGNvbnN0IG51bWVyaWNhbEVxdWl2YWxlbnQgPSB2YWx1ZXMubWFwKHRpbWVWYWx1ZUluTWlsbCk7XG5cbiAgZm9yIChsZXQgY3VycmVudEluZGV4ID0gMjsgY3VycmVudEluZGV4IDwgbnVtZXJpY2FsRXF1aXZhbGVudC5sZW5ndGg7IGN1cnJlbnRJbmRleCArPSAyKSB7XG4gICAgY29uc3QgY3VycmVudFN0YXJ0ID0gbnVtZXJpY2FsRXF1aXZhbGVudFtjdXJyZW50SW5kZXhdO1xuICAgIGNvbnN0IGN1cnJlbnRFbmQgPSBudW1lcmljYWxFcXVpdmFsZW50W2N1cnJlbnRJbmRleCArIDFdO1xuXG4gICAgZm9yIChsZXQgY29tcGFyaXNvbkluZGV4ID0gMDsgY29tcGFyaXNvbkluZGV4IDwgbnVtZXJpY2FsRXF1aXZhbGVudC5sZW5ndGg7IGNvbXBhcmlzb25JbmRleCArPSAyKSB7XG4gICAgICBpZiAoY3VycmVudEluZGV4ICE9PSBjb21wYXJpc29uSW5kZXgpIHtcbiAgICAgICAgY29uc3QgY29tcGFyaXNvblN0YXJ0ID0gbnVtZXJpY2FsRXF1aXZhbGVudFtjb21wYXJpc29uSW5kZXhdO1xuICAgICAgICBjb25zdCBjb21wYXJpc29uRW5kID0gbnVtZXJpY2FsRXF1aXZhbGVudFtjb21wYXJpc29uSW5kZXggKyAxXTtcblxuICAgICAgICBpZiAoY29tcGFyaXNvbkVuZCA+PSBjdXJyZW50U3RhcnQgJiYgY29tcGFyaXNvbkVuZCA8PSBjdXJyZW50RW5kKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gZWxzZSBpZiAoY3VycmVudFN0YXJ0ID49IGNvbXBhcmlzb25TdGFydCAmJiBjdXJyZW50RW5kIDw9IGNvbXBhcmlzb25FbmQpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIGlmIChjdXJyZW50U3RhcnQgPT09IGNvbXBhcmlzb25TdGFydCAmJiBjdXJyZW50RW5kID09PSBjb21wYXJpc29uRW5kKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gZWxzZSBpZiAoY3VycmVudEVuZCA+PSBjb21wYXJpc29uU3RhcnQgJiYgY3VycmVudEVuZCA8PSBjb21wYXJpc29uRW5kKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gZGVib3VuY2UgKGZuLCBkZWxheSkge1xuICBsZXQgdGltZXI7XG4gIHJldHVybiBmdW5jdGlvbiAoLi4uYXJncykge1xuICAgIGNsZWFyVGltZW91dCh0aW1lcik7XG4gICAgdGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IGZuLmFwcGx5KHRoaXMsIGFyZ3MpLCBkZWxheSk7XG4gIH07XG59XG5cbmV4cG9ydCB7XG4gIHRpbWVWYWx1ZUluTWlsbCwgY2hlY2tPdmVybGFwLCBjbGVhclNlbGVjdGlvbiwgZ2V0RGF5c0luTW9udGgsXG4gIGdlbmVyYXRlUmFuZG9tU3RyaW5nLCBnZXRFYXJsaWVzdERhdGUsIGJsb2NrRGF5c05vdE9wZW4sXG4gIHNvcnRUaW1lcywgaHVtYW5EYXRlLCBodW1hbmRhdGVUb1VUQywgc3RhbmRhcmREYXRlT2JqZWN0LFxuICBwcm94eVRvUGxhaW5PYmplY3RIZWxwZXIsIGRlYm91bmNlXG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBcIi5jYWxlbmRhciB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZmxleC13cmFwOiB3cmFwO1xcbiAgZmxleC1kaXJlY3Rpb246IHJvdztcXG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjQwLCAyNDgsIDI1NSwgMCk7XFxuICB3aWR0aDogMTAwJTtcXG4gIGhlaWdodDogMjguOGVtO1xcbiAgb3ZlcmZsb3cteTogYXV0bztcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gIGNvbG9yOiAjMzMzO1xcbiAgZm9udC1mYW1pbHk6IFVidW50dSwgQXJpYWwsIEhlbHZldGljYSwgc2Fucy1zZXJpZjtcXG4gIGZvbnQtc2l6ZTogMS4yZW07XFxuICBmb250LXdlaWdodDogNzAwO1xcbiAgbGluZS1oZWlnaHQ6IDEuNTtcXG59XFxuLmNhbGVuZGFyIC5ibG9ja2VkIHtcXG4gIGJhY2tncm91bmQtY29sb3I6ICMzMzM7XFxufVxcbi5jYWxlbmRhciAuZmlsbGVyIHtcXG4gIHBvaW50ZXItZXZlbnRzOiBub25lO1xcbiAgb3BhY2l0eTogMC4zO1xcbn1cXG4uY2FsZW5kYXIgLnByZWxvYWRlZCB7XFxuICBib3JkZXItY29sb3I6IGJsdWU7XFxuICBib3JkZXItc3R5bGU6IHNvbGlkO1xcbiAgYm9yZGVyLXdpZHRoOiAzcHg7XFxufVxcbi5jYWxlbmRhciAudGltZVNlbGVjdCB7XFxuICBwYWRkaW5nOiAwO1xcbiAgd2lkdGg6IGF1dG87XFxuICBtYXJnaW46IDA7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmO1xcbiAgZmxvYXQ6IHJpZ2h0O1xcbiAgZm9udC13ZWlnaHQ6IDcwMDtcXG4gIGZvbnQtZmFtaWx5OiBBcmlhbCwgSGVsdmV0aWNhLCBzYW5zLXNlcmlmO1xcbiAgYm9yZGVyLXN0eWxlOiBzb2xpZDtcXG4gIGJvcmRlci1yYWRpdXM6IDFlbTtcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuICBib3JkZXItd2lkdGg6IDNweDtcXG4gIGJvcmRlci1jb2xvcjogI2YxNTkyNTtcXG4gIGNvbG9yOiAjMDAwO1xcbiAgZm9udC1zaXplOiAwLjllbTtcXG59XFxuLmNhbGVuZGFyIC50aW1lQ29udCB7XFxuICBtYXJnaW4tbGVmdDogYXV0bztcXG4gIG1heC13aWR0aDogMjBlbTtcXG4gIGJhY2tncm91bmQtY29sb3I6IGFsaWNlYmx1ZTtcXG4gIGJvcmRlci1zdHlsZTogc29saWQ7XFxuICBib3JkZXItY29sb3I6ICNmMTU5MjU7XFxuICBtYXJnaW4tcmlnaHQ6IGF1dG87XFxuICBtYXJnaW4tdG9wOiAxMGVtO1xcbn1cXG4uY2FsZW5kYXIgLmRheWJsb2Nrcm93IHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBmbGV4LWRpcmVjdGlvbjogcm93O1xcbiAgbWluLXdpZHRoOiAxMDAlO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogYWxpY2VibHVlO1xcbn1cXG4uY2FsZW5kYXIgLmNhbGVuZGFyVGltZVBhcmVudCB7XFxuICBtYXJnaW46IDAuMWVtO1xcbn1cXG4uY2FsZW5kYXIgLmNhbGVuZGFyVGltZVBhcmVudCAuY2FsZW5kYXJUaW1lIHtcXG4gIGZvbnQtc2l6ZTogMC45ZW07XFxuICBtYXJnaW4tdG9wOiAwZW07XFxuICBsaW5lLWhlaWdodDogMTtcXG4gIGJhY2tncm91bmQtY29sb3I6IGFsaWNlYmx1ZTtcXG4gIGNvbG9yOiBibGFjaztcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gIG1hcmdpbjogMHB4O1xcbiAgZm9udC1zaXplOiAwLjhlbTtcXG59XFxuLmNhbGVuZGFyIC53aWR0aFNoYXBlRGF5cyB7XFxuICB3aWR0aDogMTQuMjg1NzE0Mjg1NyU7XFxuICBtYXJnaW4tbGVmdDogYXV0bztcXG4gIG1hcmdpbi1yaWdodDogYXV0bztcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG59XFxuLmNhbGVuZGFyIC53aWR0aFNoYXBlIHtcXG4gIHdpZHRoOiAxNC4yODU3MTQyODU3JTtcXG4gIG1hcmdpbi1sZWZ0OiBhdXRvO1xcbiAgbWFyZ2luLXJpZ2h0OiBhdXRvO1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgbWluLWhlaWdodDogMy42ZW07XFxuICBtYXJnaW4tYm90dG9tOiAwLjJlbTtcXG59XFxuLmNhbGVuZGFyIC5tb250aE5hbWUge1xcbiAgbWFyZ2luOiBhdXRvO1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgZm9udC1mYW1pbHk6IFVidW50dTtcXG4gIGZvbnQtc2l6ZTogMS42MWVtO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogIzMzN2FiNztcXG4gIGNvbG9yOiAjZmZjYzMzO1xcbiAgZmxleC1iYXNpczogMTAwJTtcXG4gIGJvcmRlci1ib3R0b20tc3R5bGU6IHNvbGlkO1xcbn1cXG4uY2FsZW5kYXIgLndlZWtyb3cge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGZsZXgtd3JhcDogbm93cmFwO1xcbiAgZmxleC1kaXJlY3Rpb246IHJvdztcXG4gIGJhY2tncm91bmQtY29sb3I6ICNmZmY7XFxuICBmb250LWZhbWlseTogXFxcInJvYm90b1xcXCIsIFxcXCJhcmlhbFxcXCI7XFxufVxcbi5jYWxlbmRhciAuZGF5TmFtZSB7XFxuICBjb2xvcjogYmxhY2s7XFxuICBmb250LWZhbWlseTogXFxcInJvYm90b1xcXCIsIFxcXCJhcmlhbFxcXCI7XFxuICBmb250LXdlaWdodDogNjAwO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogI2NjYztcXG59XFxuLmNhbGVuZGFyIC5tb250aCA+ICoge1xcbiAgbWFyZ2luLWxlZnQ6IDJweDtcXG4gIG1hcmdpbi1yaWdodDogMnB4O1xcbn1cXG4uY2FsZW5kYXIgLm1vbnRoIHtcXG4gIHdpZHRoOiA1MCU7XFxuICBtaW4td2lkdGg6IDMwMHB4O1xcbiAgbWFyZ2luOiBhdXRvO1xcbn1cXG4uY2FsZW5kYXIgLnRpbWVDaG9vc2VyIHtcXG4gIHBvc2l0aW9uOiBzdGF0aWM7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiBhbGljZWJsdWU7XFxuICBtYXJnaW4tbGVmdDogYXV0bztcXG4gIG1hcmdpbi1yaWdodDogYXV0bztcXG59XFxuLmNhbGVuZGFyIC50aW1lQ29udGFpbmVyIHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxufVxcbi5jYWxlbmRhciAudGltZUNvbnRhaW5lciBkaXYge1xcbiAgZGlzcGxheTogZmxleDtcXG59XFxuLmNhbGVuZGFyIC50aW1lQ2hvb3Nlck1vZGFsIHtcXG4gIHotaW5kZXg6IDE7XFxuICB3aWR0aDogMTAwJTtcXG4gIGhlaWdodDogMTAwJTtcXG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMCwgMCwgMC40KTtcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIG1hcmdpbjogMDtcXG4gIHBhZGRpbmc6IDA7XFxuICBib3JkZXI6IDA7XFxuICBvdmVyZmxvdy14OiBzY3JvbGw7XFxufVxcbi5jYWxlbmRhciAuY2FsZW5kYXJMYWJlbCB7XFxuICBtaW4td2lkdGg6IDNlbTtcXG4gIHBhZGRpbmc6IDBlbSAxZW0gMGVtIDFlbTtcXG4gIGNvbG9yOiBibGFjaztcXG4gIGZvbnQtZmFtaWx5OiBcXFwicm9ib3RvXFxcIiwgXFxcImFyaWFsXFxcIjtcXG4gIGZvbnQtd2VpZ2h0OiA2MDA7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjY2NjO1xcbiAgbWFyZ2luOiAxZW0gMCAxZW0gMDtcXG59XFxuLmNhbGVuZGFyIC5kZWxldGVEaXYge1xcbiAgZm9udC1mYW1pbHk6IFVidW50dTtcXG4gIGJhY2tncm91bmQtY29sb3I6ICMzMzdhYjc7XFxuICBjb2xvcjogI2ZmY2MzMztcXG4gIGJvcmRlci1ib3R0b20tc3R5bGU6IHNvbGlkO1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG59XFxuLmNhbGVuZGFyIC5kZWxldGVCdXR0b24ge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogd2hpdGU7XFxuICBjb2xvcjogI2YxNTkyNTtcXG4gIGZsb2F0OiByaWdodDtcXG4gIGZvbnQtd2VpZ2h0OiA3MDA7XFxuICBmb250LWZhbWlseTogQXJpYWwsIEhlbHZldGljYSwgc2Fucy1zZXJpZjtcXG4gIGJvcmRlci1zdHlsZTogc29saWQ7XFxuICBib3JkZXItcmFkaXVzOiAyZW07XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICBoZWlnaHQ6IDJlbTtcXG4gIHdpZHRoOiAyZW07XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgbWFyZ2luOiAwIDAuNWVtO1xcbiAgZm9udC1zaXplOiAxLjVlbTtcXG59XFxuLmNhbGVuZGFyIC5pbm5lclNwYW5EZWxldGVCdG4ge1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbn1cXG4uY2FsZW5kYXIgLmRlbGV0ZUJ1dHRvbjpob3ZlcixcXG4uY2FsZW5kYXIgLmRlbGV0ZUJ1dHRvbjpmb2N1cyxcXG4uY2FsZW5kYXIgLnRpbWVTZWxlY3Q6aG92ZXIsXFxuLmNhbGVuZGFyIC50aW1lU2VsZWN0OmZvY3VzIHtcXG4gIGNvbG9yOiAjMDAwO1xcbiAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xcbiAgY3Vyc29yOiBwb2ludGVyO1xcbn1cXG4uY2FsZW5kYXIgLmhvdXIge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gIHdpZHRoOiAxMGVtO1xcbn1cXG4uY2FsZW5kYXIgLnRpbWVTZWxlY3RQIHtcXG4gIGRpc3BsYXk6IGlubGluZTtcXG4gIHdpZHRoOiA1ZW07XFxuICBjb2xvcjogIzAwMDtcXG59XFxuLmNhbGVuZGFyIC50aW1lQ2hvb3NlciA+IGlucHV0W3R5cGU9Y2hlY2tib3hdIHtcXG4gIG91dGxpbmU6ICNmMTU5MjU7XFxuICBvdXRsaW5lLXN0eWxlOiBzb2xpZDtcXG59XFxuLmNhbGVuZGFyIC50aW1lU2VsZWN0ID4gb3B0aW9uIHtcXG4gIGNvbG9yOiAjMDAwO1xcbn1cXG4uY2FsZW5kYXIgLmNhbGVuZGFyID4gcCxcXG4uY2FsZW5kYXIgaDQsXFxuLmNhbGVuZGFyIGgzLFxcbi5jYWxlbmRhciBoMixcXG4uY2FsZW5kYXIgaDEsXFxuLmNhbGVuZGFyIHNlbGVjdCxcXG4uY2FsZW5kYXIgb3B0aW9uIHtcXG4gIGNvbG9yOiAjMDAwO1xcbn1cXG4uY2FsZW5kYXIgLmFycm93LXVwIHtcXG4gIHdpZHRoOiAwO1xcbiAgaGVpZ2h0OiAwO1xcbiAgYm9yZGVyLWxlZnQ6IDEwcHggc29saWQgdHJhbnNwYXJlbnQ7XFxuICBib3JkZXItcmlnaHQ6IDEwcHggc29saWQgdHJhbnNwYXJlbnQ7XFxuICBib3JkZXItYm90dG9tOiAxMHB4IHNvbGlkIGJsYWNrO1xcbn1cXG4uY2FsZW5kYXIgLmFycm93LWRvd24ge1xcbiAgd2lkdGg6IDA7XFxuICBoZWlnaHQ6IDA7XFxuICBib3JkZXItbGVmdDogMTBweCBzb2xpZCB0cmFuc3BhcmVudDtcXG4gIGJvcmRlci1yaWdodDogMTBweCBzb2xpZCB0cmFuc3BhcmVudDtcXG4gIGJvcmRlci10b3A6IDEwcHggc29saWQgIzAwMDtcXG59XFxuLmNhbGVuZGFyIC5hcnJvd3Mge1xcbiAgZmxvYXQ6IHJpZ2h0O1xcbiAgY2xlYXI6IHJpZ2h0O1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgY3Vyc29yOiBwb2ludGVyO1xcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG59XFxuLmNhbGVuZGFyIC5hcnJvdy1yaWdodCB7XFxuICB3aWR0aDogMDtcXG4gIGhlaWdodDogMDtcXG4gIGJvcmRlci10b3A6IDYwcHggc29saWQgdHJhbnNwYXJlbnQ7XFxuICBib3JkZXItYm90dG9tOiA2MHB4IHNvbGlkIHRyYW5zcGFyZW50O1xcbiAgYm9yZGVyLWxlZnQ6IDYwcHggc29saWQgZ3JlZW47XFxufVxcbi5jYWxlbmRhciAuYXJyb3ctbGVmdCB7XFxuICB3aWR0aDogMDtcXG4gIGhlaWdodDogMDtcXG4gIGJvcmRlci10b3A6IDEwcHggc29saWQgdHJhbnNwYXJlbnQ7XFxuICBib3JkZXItYm90dG9tOiAxMHB4IHNvbGlkIHRyYW5zcGFyZW50O1xcbiAgYm9yZGVyLXJpZ2h0OiAxMHB4IHNvbGlkIGJsdWU7XFxufVxcbi5jYWxlbmRhciAuZGF5VGltZSB7XFxuICBjdXJzb3I6IHBvaW50ZXI7XFxufVxcbi5jYWxlbmRhciAuZGF5VGltZSA+ICoge1xcbiAgcG9pbnRlci1ldmVudHM6IG5vbmU7XFxufVxcblwiOyIsIi8qKlxuICogQHR5cGVkZWYge09iamVjdH0gSGFzVGVzdHNUYWdcbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gaGFzVGVzdHMgLSBJbmRpY2F0ZXMgd2hldGhlciB0aGUgZnVuY3Rpb24gaGFzIHRlc3RzLlxuICovXG5cbi8qKlxuICogQHR5cGVkZWYge09iamVjdH0gaGFzVGhlc2VTdHlsZXNcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBoYXNUaGVzZVN0eWxlcyAtIExpc3RzIHN0eWxlcyByZWZlcmVuY2VzIGluIGEgZnVuY3Rpb25cbiAqL1xuXG5pbXBvcnQge1xuICBnZXREYXlzSW5Nb250aCwgZ2VuZXJhdGVSYW5kb21TdHJpbmcsIGdldEVhcmxpZXN0RGF0ZSxcbiAgYmxvY2tEYXlzTm90T3BlbiwgY2xlYXJTZWxlY3Rpb24sXG4gIGh1bWFuRGF0ZSwgc3RhbmRhcmREYXRlT2JqZWN0LCBwcm94eVRvUGxhaW5PYmplY3RIZWxwZXIsIGRlYm91bmNlXG59IGZyb20gJy4vYmFzaWNGdW5jdGlvbnMuanMnO1xuaW1wb3J0IHsgR2VuZXJhdGVUaW1lQ2hvb3Nlck1vZGFsIH0gZnJvbSAnLi9kaXNwbGF5VGltZUNob29zZXJNb2RhbC5qcyc7XG5pbXBvcnQgeyBjb2xvdXJzLCBzZWxlY3RlZFN0eWxlLCB1bnNlbGVjdGVkU3R5bGUgfSBmcm9tICcuL3N0eWxlcy5qcyc7XG5pbXBvcnQgeyBsYW5ndWFnZXMgfSBmcm9tICcuL2xhbmd1YWdlcy5qcyc7XG5pbXBvcnQgc3R5bGUgZnJvbSAnLi9jYWxlbmRhckFwcC5jc3MnO1xuXG4vKipcbiAqIEFkZHMgdGhlIHNwZWNpZmllZCBudW1iZXIgb2YgbW9udGhzIHRvIGEgZGF0ZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBtb250aHMgLSBUaGUgbnVtYmVyIG9mIG1vbnRocyB0byBhZGQuXG4gKiBAcmV0dXJucyB7RGF0ZX0gLSBUaGUgdXBkYXRlZCBkYXRlLlxuICovXG5EYXRlLnByb3RvdHlwZS5hZGRNb250aHMgPSBmdW5jdGlvbiAobW9udGhzKSB7XG4gIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZSh0aGlzKTtcbiAgY29uc3QgeWVhcnMgPSBNYXRoLmZsb29yKG1vbnRocyAvIDEyKTtcbiAgY29uc3QgcmVtYWluaW5nTW9udGhzID0gbW9udGhzICUgMTI7XG4gIGlmICh5ZWFycykge1xuICAgIGRhdGUuc2V0RnVsbFllYXIoZGF0ZS5nZXRGdWxsWWVhcigpICsgeWVhcnMpO1xuICB9XG4gIGlmIChyZW1haW5pbmdNb250aHMpIHtcbiAgICBkYXRlLnNldE1vbnRoKGRhdGUuZ2V0TW9udGgoKSArIHJlbWFpbmluZ01vbnRocyk7XG4gIH1cbiAgcmV0dXJuIGRhdGU7XG59O1xuXG5jdXN0b21FbGVtZW50cy5kZWZpbmUoJ3N3aWZ0LWNhbCcsIGNsYXNzIGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgc3VwZXIoKTtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBmdW5jdGlvbiBzdFRvQm9vbGVhbiAoc3QpIHtcbiAgICAgIGlmIChzdCA9PT0gJ3RydWUnKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnN0IGNhbGVuZGFyID0gbmV3IFN3aWZ0Q2FsKCk7XG4gICAgY2FsZW5kYXIuZ2VuZXJhdGVDYWxlbmRhcihcbiAgICAgIHtcbiAgICAgICAgdGFyZ2V0OiBzZWxmLFxuICAgICAgICAvLyBkYXRhLW51bWJlci1vZi1tb250aHMtdG8tZGlzcGxheSBodG1sIGNvbnZlcnRzIHRvIG51bWJlck9mTW9udGhzVG9EaXNwbGF5IEpTXG4gICAgICAgIG51bWJlck9mTW9udGhzVG9EaXNwbGF5OiB0aGlzLmRhdGFzZXQubnVtYmVyT2ZNb250aHNUb0Rpc3BsYXksXG4gICAgICAgIC8vIGRhdGEtZGlzcGxheS10aW1lLWNob29zZXItbW9kYWxcbiAgICAgICAgZGlzcGxheVRpbWVDaG9vc2VyTW9kYWw6IHN0VG9Cb29sZWFuKHRoaXMuZGF0YXNldC5kaXNwbGF5VGltZUNob29zZXJNb2RhbCksXG4gICAgICAgIC8vIGRhdGEtc2luZ2xlLWRhdGUtY2hvaWNlXG4gICAgICAgIHNpbmdsZURhdGVDaG9pY2U6IHN0VG9Cb29sZWFuKHRoaXMuZGF0YXNldC5zaW5nbGVEYXRlQ2hvaWNlKSxcblxuICAgICAgICBsYW5ndWFnZTogdGhpcy5kYXRhc2V0Lmxhbmd1YWdlLFxuICAgICAgICAvLyBkYXRhLXNlbGVjdC1tdWx0aXBsZVxuICAgICAgICBzZWxlY3RNdWx0aXBsZTogdGhpcy5kYXRhc2V0LnNlbGVjdE11bHRpcGxlLFxuXG4gICAgICAgIHByZWxvYWRlZERhdGVzOiAodGhpcy5kYXRhc2V0LnByZWxvYWRlZERhdGVzKSA/IEpTT04ucGFyc2UodGhpcy5kYXRhc2V0LnByZWxvYWRlZERhdGVzKSA6IGZhbHNlLFxuXG4gICAgICAgIHByZWxvYWRlZFRvb2x0aXA6IHRoaXMuZGF0YXNldC5wcmVsb2FkZWRUb29sdGlwLFxuXG4gICAgICAgIGJsb2NrRGF5c09mV2VlazogKHRoaXMuZGF0YXNldC5ibG9ja0RheXNPZldlZWspID8gSlNPTi5wYXJzZSh0aGlzLmRhdGFzZXQuYmxvY2tEYXlzT2ZXZWVrKSA6IGZhbHNlLFxuICAgICAgICAvLyBkYXRhLXN0YXJ0LWRhdGU9XCIyMDE5LTAxLTAxXCJcbiAgICAgICAgc3RhcnREYXRlOiB0aGlzLmRhdGFzZXQuc3RhcnREYXRlXG5cbiAgICAgIH0pO1xuXG4gICAgdGhpcy5keW5hbWljRGF0YSA9IGNhbGVuZGFyLnJldHVybkR5bmFtaWNEYXRhKCk7XG4gIH1cbn0pO1xuXG5mdW5jdGlvbiBTd2lmdENhbCAoKSB7XG4gIGxldCB0aW1lQ2hvb3NlcjtcbiAgY29uc3QgY29uZmlnID0ge307XG5cbiAgY29uc3QgaGFuZGxlciA9IHtcbiAgICBnZXQ6ICh0YXJnZXQsIGtleSkgPT4ge1xuICAgICAgaWYgKHR5cGVvZiB0YXJnZXRba2V5XSA9PT0gJ29iamVjdCcgJiYgdGFyZ2V0W2tleV0gIT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm94eSh0YXJnZXRba2V5XSwgaGFuZGxlcik7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0YXJnZXRba2V5XTtcbiAgICB9LFxuICAgIHNldDogKHRhcmdldCwgcHJvcCwgdmFsdWUpID0+IHtcbiAgICAgIGlmICh0YXJnZXRbcHJvcF0gPT09IHZhbHVlKSByZXR1cm4gdHJ1ZTtcbiAgICAgIHRhcmdldFtwcm9wXSA9IHZhbHVlO1xuICAgICAgZW1pdERhdGVTZWxlY3RlZEV2ZW50KCk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgZGF0YVRlbXBsYXRlID0ge1xuICAgIGRhdGVzU2VsZWN0ZWRBcnJheTogW10sXG4gICAgZGF0ZXNTZWxlY3RlZEFycmF5T2JqZWN0czogW10sXG4gICAgZGlzYWJsZWQ6IGZhbHNlXG4gIH07XG5cbiAgY29uc3QgZHluYW1pY0RhdGEgPSBuZXcgUHJveHkoZGF0YVRlbXBsYXRlLCBoYW5kbGVyKTtcblxuICBjb25zdCBlbWl0RGF0ZVNlbGVjdGVkRXZlbnQgPSBkZWJvdW5jZSgoKSA9PiB7XG4gICAgY29uc3QgZXZ0ID0gbmV3IEN1c3RvbUV2ZW50KCdkYXRlU2VsZWN0Jywge1xuICAgICAgZGV0YWlsOiB7IGRhdGU6IHByb3h5VG9QbGFpbk9iamVjdEhlbHBlcihkeW5hbWljRGF0YSkgfSxcbiAgICAgIGJ1YmJsZXM6IHRydWUsXG4gICAgICBjb21wb3NlZDogdHJ1ZVxuICAgIH0pO1xuICAgIGNvbmZpZy5jYWxlbmRhckNvbnRhaW5lci5kaXNwYXRjaEV2ZW50KGV2dCk7XG4gIH0sIDI1MCk7XG5cbiAgY29uc3QgY2FsZW5kYXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblxuICB0aGlzLnJldHVybkNhbGVuZGFyID0gKCkgPT4ge1xuICAgIHJldHVybiBjYWxlbmRhcjtcbiAgfTtcblxuICB0aGlzLnJldHVybkR5bmFtaWNEYXRhID0gKCkgPT4ge1xuICAgIHJldHVybiBkeW5hbWljRGF0YTtcbiAgfTtcblxuICB0aGlzLnJldHVybkNvbmZpZyA9ICgpID0+IHtcbiAgICByZXR1cm4gY29uZmlnO1xuICB9O1xuXG4gIHRoaXMuc2V0Q29uZmlnID0gKGNvbmZpZ09iaikgPT4ge1xuICAgIC8vIElmIGNhbGxlZCB2aWEgSFRNTFxuICAgIGNvbmZpZy5jYWxlbmRhckNvbnRhaW5lciA9IGNvbmZpZ09iai50YXJnZXQgfHwgZmFsc2U7XG4gICAgLy8gSWYgY2FsbGVkIHZpYSBKYXZhc2NyaXB0XG4gICAgY29uZmlnLnBhcmVudERpdiA9ICh0eXBlb2YgY29uZmlnT2JqLnBhcmVudERpdiA9PT0gJ3N0cmluZycpID8gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihjb25maWdPYmoucGFyZW50RGl2KSA6IGNvbmZpZ09iai5wYXJlbnREaXY7XG4gICAgLy8gZG9uZVxuICAgIGNvbmZpZy5udW1iZXJPZk1vbnRoc1RvRGlzcGxheSA9IGNvbmZpZ09iai5udW1iZXJPZk1vbnRoc1RvRGlzcGxheSB8fCAxMjtcbiAgICAvLyBkb25lXG4gICAgY29uZmlnLmRpc3BsYXlUaW1lQ2hvb3Nlck1vZGFsID0gY29uZmlnT2JqLmRpc3BsYXlUaW1lQ2hvb3Nlck1vZGFsICYmIHRydWU7XG4gICAgLy8gZG9uZVxuICAgIGNvbmZpZy5zaW5nbGVEYXRlQ2hvaWNlID0gY29uZmlnT2JqLnNpbmdsZURhdGVDaG9pY2UgJiYgdHJ1ZTtcbiAgICAvLyBkb25lXG4gICAgY29uZmlnLnNlbGVjdFJhbmdlID0gIWNvbmZpZ09iai5zaW5nbGVEYXRlQ2hvaWNlO1xuICAgIC8vIGRvbmVcbiAgICBjb25maWcubGFuZ3VhZ2UgPSBjb25maWdPYmoubGFuZ3VhZ2UgfHwgJ2VuR2InO1xuICAgIC8vIGRvbmVcbiAgICBjb25maWcuc2VsZWN0TXVsdGlwbGUgPSBjb25maWcuc2VsZWN0TXVsdGlwbGUgfHwgZmFsc2U7XG4gICAgLy8gZG9uZVxuICAgIGNvbmZpZy5kaXNwbGF5VGltZVNlbGVjdGlvbk9uRGF0ZSA9IGNvbmZpZ09iai5kaXNwbGF5VGltZVNlbGVjdGlvbk9uRGF0ZSB8fCB0cnVlO1xuICAgIC8vIGRvbmVcbiAgICBjb25maWcucHJlbG9hZGVkRGF0ZXMgPSBjb25maWdPYmoucHJlbG9hZGVkRGF0ZXMgfHwgZmFsc2U7XG5cbiAgICBjb25maWcucHJlbG9hZGVkVG9vbHRpcCA9IGNvbmZpZ09iai5wcmVsb2FkZWRUb29sdGlwIHx8IGZhbHNlO1xuXG4gICAgY29uZmlnLmJsb2NrRGF5c09mV2VlayA9IGNvbmZpZ09iai5ibG9ja0RheXNPZldlZWsgfHwgZmFsc2U7XG5cbiAgICBjb25maWcuYm9va0RheXNPZldlZWsgPSBjb25maWdPYmouYm9va0RheXNPZldlZWsgfHwgZmFsc2U7XG5cbiAgICBjb25maWcuc3RhcnREYXRlID0gY29uZmlnT2JqLnN0YXJ0RGF0ZSB8fCBmYWxzZTtcblxuICAgIGNvbmZpZy5lbmRVc2VyID0gY29uZmlnT2JqLmVuZFVzZXIgfHwgZmFsc2U7XG4gICAgY29uZmlnLmVuZFVzZXJEdXJhdGlvbkNob2ljZSA9IGNvbmZpZ09iai5lbmRVc2VyRHVyYXRpb25DaG9pY2UgfHwgZmFsc2U7XG4gICAgY29uZmlnLmJhY2tlbmQgPSBjb25maWdPYmouYmFja2VuZCB8fCBmYWxzZTtcbiAgICBjb25maWcuZGlzcGxheUJsb2NrZWQgPSBjb25maWdPYmouZGlzcGxheUJsb2NrZWQgfHwgZmFsc2U7XG4gICAgY29uZmlnLmRhdGVzT3BlbiA9IGNvbmZpZ09iai5kYXRlc09wZW4gfHwgZmFsc2U7XG5cbiAgICBjb25maWcuY3VzdG9tQ2xpY2tFdmVudCA9IGNvbmZpZ09iai5jdXN0b21DbGlja0V2ZW50IHx8IGZhbHNlO1xuICB9O1xuXG4gIHRoaXMuZ2VuZXJhdGVDYWxlbmRhciA9IChjb25maWdPYmopID0+IHtcbiAgICBpZiAoY29uZmlnT2JqKSB7XG4gICAgICB0aGlzLnNldENvbmZpZyhjb25maWdPYmopO1xuICAgIH1cbiAgICAvLyBJZiBjYWxsZWQgdmlhIGphdmFzY3JpcHQgYSBwYXJlbnRFbGVtZW50IG5lZWRzIHRvIGJlIHByb3ZpZGVkXG4gICAgY29uc3QgcGFyZW50RGl2ID0gY29uZmlnLnBhcmVudERpdjtcbiAgICAvKlxuICAgICAgSWYgY2FsbGVkIGZyb20gaHRtbCBhcyBhIGN1c3RvbSBjb21wb25lbnQgdGhlIGNvbXBvbmVudCBpdHNlbGYgaXMgcGFzc2VkIChjYWxlbmRhckNvbnRhaW5lcilcbiAgICAgIElmIGNhbGxlZCB2aWEgSlMgd2hpbGUgdGhlIGNvbXBvbmVudCBpc24ndCBhIHdlYiBjb21wb25lbnQgaW4gdGhlIHN0cmljdGVzdCBzZW5zZSwgaXQgc3RpbGxcbiAgICAgIGJlaGF2ZXMgbGlrZSBvbmUgYW5kIGlzIGVuY2Fwc3VsYXRlZCBpbiBhIHNoYWRvdy5cbiAgICAqL1xuICAgIGlmIChjb25maWcuY2FsZW5kYXJDb250YWluZXIpIHtcbiAgICAgIHNoYWRvd0F0dGFjaChjb25maWcuY2FsZW5kYXJDb250YWluZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBuZXdDb250YWluZXIoKS50aGVuKChjb250YWluZXIpID0+IHtcbiAgICAgICAgc2hhZG93QXR0YWNoKGNvbnRhaW5lcik7XG4gICAgICAgIGNvbmZpZy5jYWxlbmRhckNvbnRhaW5lciA9IGNvbnRhaW5lcjtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG5ld0NvbnRhaW5lciAoKSB7XG4gICAgICBjb25zdCBwcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgY29uc3QgbmV3Q2FsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIG5ld0NhbC5jbGFzc0xpc3QuYWRkKCdzd2lmdC1jYWwnKTtcbiAgICAgICAgcGFyZW50RGl2LmFwcGVuZENoaWxkKG5ld0NhbCk7XG4gICAgICAgIHJlc29sdmUobmV3Q2FsKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2hhZG93QXR0YWNoIChjb250YWluZXIpIHtcbiAgICAgIGNvbnN0IHNoYWRvd1Jvb3QgPSBjb250YWluZXIuYXR0YWNoU2hhZG93KHsgbW9kZTogJ29wZW4nIH0pO1xuICAgICAgY29uc3QgY3NzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgICAgIGNzcy50ZXh0Q29udGVudCA9IHN0eWxlO1xuICAgICAgc2hhZG93Um9vdC5hcHBlbmRDaGlsZChjc3MpO1xuICAgICAgc2hhZG93Um9vdC5hcHBlbmRDaGlsZChjYWxlbmRhcik7XG4gICAgfVxuXG4gICAgY29uc3QgcHJlbG9hZGVkRGF0ZXMgPSBjb25maWcucHJlbG9hZGVkRGF0ZXM7XG4gICAgY29uc3QgbnVtYmVyT2ZNb250aHNUb0Rpc3BsYXkgPSBjb25maWcubnVtYmVyT2ZNb250aHNUb0Rpc3BsYXk7XG4gICAgY29uc3QgZGF0ZXNPcGVuID0gY29uZmlnLmRhdGVzT3BlbjtcbiAgICBjb25zdCBsYW5ndWFnZSA9IGNvbmZpZy5sYW5ndWFnZTtcbiAgICBjb25zdCBkaXNwbGF5VGltZUNob29zZXJNb2RhbCA9IGNvbmZpZy5kaXNwbGF5VGltZUNob29zZXJNb2RhbDtcbiAgICBjb25zdCBibG9ja1dlZWtEYXlzID0gY29uZmlnLmJsb2NrRGF5c09mV2VlaztcbiAgICBjb25zdCBib29rV2Vla0RheXMgPSBjb25maWcuYm9va0RheXNPZldlZWs7XG4gICAgY29uc3Qgc3RhcnREYXRlID0gY29uZmlnLnN0YXJ0RGF0ZTtcbiAgICBsZXQgdW5pcXVlRGF5SW5kZXggPSAwO1xuICAgIC8vIENhbGVuZGFyIGlzIGRlZmluZWQgZ2xvYmFsbHkgd2l0aGluIHRoZSBjb25zdHJ1Y3RvclxuICAgIGNvbnN0IGNhbGVuZGFyVW5pcXVlSWQgPSBnZW5lcmF0ZVJhbmRvbVN0cmluZygpO1xuICAgIGNhbGVuZGFyLmlkID0gYGNhbGVuZGFyLSR7Y2FsZW5kYXJVbmlxdWVJZH1gO1xuICAgIGNhbGVuZGFyLmNsYXNzTGlzdC5hZGQoJ2NhbGVuZGFyJyk7XG5cbiAgICBjb25zdCBtb250aHMgPSBbXTtcbiAgICBjb25zdCBkYXRlTm93ID0gbmV3IERhdGUoKTtcbiAgICAvLyBSZXB1cnBvc2luZyBnZXRFYXJsaWVzdERhdGUgdG8gZm9ybWF0IGEgZGF0ZS5cbiAgICBjb25zdCBlYXJsaWVzdERhdGUgPSAoc3RhcnREYXRlKSA/IGdldEVhcmxpZXN0RGF0ZShbc3RhcnREYXRlXSkgOiBkYXRlTm93O1xuICAgIGNvbnN0IHN0YXJ0TW9udGggPSBlYXJsaWVzdERhdGUuZ2V0TW9udGgoKTtcbiAgICBjb25zdCBtb250aE5hbWVzID0gbGFuZ3VhZ2VzW2xhbmd1YWdlXS5nZW5lcmFsVGltZS5tb250aHM7XG4gICAgLyogQ3JlYXRlIG1vbnRoIHZpZXcgKi9cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bWJlck9mTW9udGhzVG9EaXNwbGF5OyBpKyspIHtcbiAgICAgIC8qIE1vbnRoIHNwZWNpZmljIHZhcmlhYmxlcyBhbmQgdHJhY2tlcnMgKi9cbiAgICAgIGNvbnN0IHllYXJDYWxjID0gZWFybGllc3REYXRlLmFkZE1vbnRocyhpKS5nZXRGdWxsWWVhcigpO1xuICAgICAgY29uc3QgbW9udGhDYWxjID0gKHN0YXJ0TW9udGggKyBpKSAlIDEyO1xuICAgICAgY29uc3Qgc3RhcnREYXlPZk1vbnRoID0gbmV3IERhdGUoeWVhckNhbGMsIG1vbnRoQ2FsYykuZ2V0RGF5KCk7XG4gICAgICBjb25zdCBkYXlzSW5Nb250aCA9IGdldERheXNJbk1vbnRoKChzdGFydE1vbnRoICsgaSArIDEpICUgMTIsIGVhcmxpZXN0RGF0ZS5hZGRNb250aHMoaSkuZ2V0RnVsbFllYXIoKSk7XG4gICAgICBsZXQgY291bnQgPSAxO1xuICAgICAgbGV0IGRheW9md2VlayA9IDA7XG5cbiAgICAgIC8qIENyZWF0ZSBtb250aCBkaXYgKi9cbiAgICAgIGNvbnN0IG1vbnRoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBtb250aHMucHVzaChtb250aCk7XG4gICAgICBtb250aC5zdHlsZS53aWR0aCA9ICcxNWVtJztcbiAgICAgIG1vbnRoLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGNvbG91cnMubW9udGhCb3JkZXJDb2xvcjtcbiAgICAgIG1vbnRoLmNsYXNzTGlzdC5hZGQoJ21vbnRoJyk7XG4gICAgICBjYWxlbmRhci5hcHBlbmRDaGlsZChtb250aCk7XG5cbiAgICAgIC8qIENyZWF0ZSBtb250aCBuYW1lIGRpdiAobW9udGggWVlZWSkgYXQgdGhlIHRvcCBvZiBtb250aCBkaXNwbGF5ICovXG4gICAgICBjb25zdCBtb250aE5hbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIG1vbnRoTmFtZS5jbGFzc0xpc3QuYWRkKCdtb250aE5hbWUnKTtcbiAgICAgIG1vbnRoTmFtZS50ZXh0Q29udGVudCA9IGAke21vbnRoTmFtZXNbKHN0YXJ0TW9udGggKyBpKSAlIDEyXX0gJHtlYXJsaWVzdERhdGUuZ2V0RnVsbFllYXIoKX1gO1xuICAgICAgbW9udGguYXBwZW5kQ2hpbGQobW9udGhOYW1lKTtcblxuICAgICAgLyogQ3JlYXRlIGRpdiB3aXRoIG5hbWVkIGRheXMgb2YgdGhlIHdlZWsgKi9cbiAgICAgIGNvbnN0IGRheU5hbWVzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBtb250aC5hcHBlbmRDaGlsZChkYXlOYW1lcyk7XG4gICAgICBkYXlOYW1lcy5jbGFzc0xpc3QuYWRkKCd3ZWVrcm93Jyk7XG4gICAgICBsYW5ndWFnZXNbbGFuZ3VhZ2VdLmdlbmVyYWxUaW1lLmRheXNUcnVuY2F0ZWQuZm9yRWFjaCgoZGF5TmFtZSkgPT4ge1xuICAgICAgICBjb25zdCBkYXkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgZGF5LnRleHRDb250ZW50ID0gZGF5TmFtZTtcbiAgICAgICAgZGF5LmNsYXNzTGlzdC5hZGQoJ2RheU5hbWUnLCAnd2lkdGhTaGFwZURheXMnKTtcbiAgICAgICAgZGF5TmFtZXMuYXBwZW5kQ2hpbGQoZGF5KTtcbiAgICAgIH0pO1xuXG4gICAgICAvKiBDcmVhdGUgd2VlayByb3dzIGZpcnN0IHdlZWssIGl0J3MgcmVhc3NpZ25lZCBmICovXG4gICAgICBsZXQgd2Vla1JvdztcbiAgICAgIC8vIDQyIGRheXMsIGkuZS4gNiByb3dzIG9mIDdcbiAgICAgIGZvciAobGV0IHAgPSAwOyBwIDwgNDI7IHArKykge1xuICAgICAgICBpZiAocCA9PT0gMCkge1xuICAgICAgICAgIC8vIG1hZGUgbmV3IHdlZWsgcm93XG4gICAgICAgICAgd2Vla1JvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgIG1vbnRoLmFwcGVuZENoaWxkKHdlZWtSb3cpO1xuICAgICAgICAgIHdlZWtSb3cuY2xhc3NMaXN0LmFkZCgnd2Vla3JvdycpO1xuICAgICAgICAgIGRheW9md2VlayA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHAgPCBzdGFydERheU9mTW9udGgpIHtcbiAgICAgICAgICBjb25zdCBwZWdob2xlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgcGVnaG9sZS5jbGFzc0xpc3QuYWRkKCd3aWR0aFNoYXBlJywgJ2ZpbGxlcicpO1xuICAgICAgICAgIHVuc2VsZWN0ZWRTdHlsZShwZWdob2xlKTtcbiAgICAgICAgICB3ZWVrUm93LmFwcGVuZENoaWxkKHBlZ2hvbGUpO1xuICAgICAgICAgIGRheW9md2VlaysrO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHAgPj0gc3RhcnREYXlPZk1vbnRoICYmIHAgPD0gKHN0YXJ0RGF5T2ZNb250aCArIGRheXNJbk1vbnRoIC0gMSkpIHtcbiAgICAgICAgICBjb25zdCBwZWdob2xlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgcGVnaG9sZS50ZXh0Q29udGVudCA9IGNvdW50O1xuICAgICAgICAgIHBlZ2hvbGUuZGF0YXNldC5kYXkgPSBjb3VudDtcbiAgICAgICAgICBwZWdob2xlLmRhdGFzZXQuZGF5b2Z3ZWVrID0gZGF5b2Z3ZWVrO1xuICAgICAgICAgIHBlZ2hvbGUuZGF0YXNldC5kYXlpbmRleCA9IHVuaXF1ZURheUluZGV4O1xuICAgICAgICAgIHBlZ2hvbGUuY2xhc3NMaXN0LmFkZCgnd2lkdGhTaGFwZScsICdkYXlUaW1lJyk7XG4gICAgICAgICAgcGVnaG9sZS5kYXRhc2V0Lmh1bWFuZGF0ZSA9IGh1bWFuRGF0ZShgJHt5ZWFyQ2FsY30tJHttb250aENhbGN9LSR7Y291bnR9YCk7XG4gICAgICAgICAgLy8gcGVnaG9sZS5pZCA9IGAke3llYXJDYWxjfS0ke21vbnRoQ2FsY30tJHtjb3VudH1gO1xuICAgICAgICAgIHBlZ2hvbGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgICAgICAgZGF0ZU9uQ2xpY2tFdmVudHMoZSk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICB3ZWVrUm93LmFwcGVuZENoaWxkKHBlZ2hvbGUpO1xuXG4gICAgICAgICAgaWYgKGkgPT09IDAgJiYgcCA+PSBzdGFydERheU9mTW9udGggJiYgcCA8IChlYXJsaWVzdERhdGUuZ2V0RGF0ZSgpICsgc3RhcnREYXlPZk1vbnRoKSkge1xuICAgICAgICAgICAgcGVnaG9sZS5jbGFzc0xpc3QuYWRkKCdmaWxsZXInKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb3VudCsrO1xuICAgICAgICAgIGRheW9md2VlaysrO1xuICAgICAgICAgIHVuaXF1ZURheUluZGV4Kys7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocCA+PSBkYXlzSW5Nb250aCArIHN0YXJ0RGF5T2ZNb250aCkge1xuICAgICAgICAgIGNvbnN0IHBlZ2hvbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICBwZWdob2xlLmNsYXNzTGlzdC5hZGQoJ3dpZHRoU2hhcGUnLCAnZmlsbGVyJyk7XG4gICAgICAgICAgd2Vla1Jvdy5hcHBlbmRDaGlsZChwZWdob2xlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgocCArIDEpICUgNyA9PT0gMCkge1xuICAgICAgICAgIC8vIG1ha2UgbmV3IHdlZWsgcm93OlxuICAgICAgICAgIHdlZWtSb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICBtb250aC5hcHBlbmRDaGlsZCh3ZWVrUm93KTtcbiAgICAgICAgICB3ZWVrUm93LmNsYXNzTGlzdC5hZGQoJ3dlZWtyb3cnKTtcbiAgICAgICAgICBkYXlvZndlZWsgPSAwO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoaSA9PT0gbnVtYmVyT2ZNb250aHNUb0Rpc3BsYXkgLSAxKSB7XG4gICAgICAgIGJsb2NrRGF5c05vdE9wZW4oY2FsZW5kYXIsIGRhdGVzT3Blbik7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIE9wdGlvbnM6XG4gICAgaWYgKGRpc3BsYXlUaW1lQ2hvb3Nlck1vZGFsKSB7XG4gICAgICB0aW1lQ2hvb3NlciA9IG5ldyBHZW5lcmF0ZVRpbWVDaG9vc2VyTW9kYWwoY29uZmlnLCBkeW5hbWljRGF0YSwgY2FsZW5kYXIpO1xuICAgICAgdGltZUNob29zZXIuZ2VuZXJhdGVNb2RhbCgpO1xuICAgIH1cbiAgICBpZiAocHJlbG9hZGVkRGF0ZXMpIHtcbiAgICAgIHByZWxvYWREYXRlcyhwcmVsb2FkZWREYXRlcyk7XG4gICAgfVxuICAgIGlmIChibG9ja1dlZWtEYXlzKSB7XG4gICAgICBibG9ja0RheXNPZldlZWsoYmxvY2tXZWVrRGF5cyk7XG4gICAgfVxuICAgIGlmIChib29rV2Vla0RheXMpIHtcbiAgICAgIGJvb2tEYXlzT2ZXZWVrKGJvb2tXZWVrRGF5cyk7XG4gICAgfVxuICB9O1xuXG4gIHRoaXMucHJlbG9hZGVkRGF0ZXMgPSAoZGF0ZXMpID0+IHtcbiAgICBjYWxlbmRhci5wcmVsb2FkRGF0ZXMoZGF0ZXMpO1xuICB9O1xuXG4gIGxldCBjbGlja0NvdW50ID0gMTtcbiAgY29uc3QgZGF0ZUNsaWNrZWRUaHJpY2UgPSB7XG4gICAgZGF0ZTogbnVsbCxcbiAgICBjb3VudDogMVxuICB9O1xuXG4gIGZ1bmN0aW9uIGNsaWtlZFRocmljZSAoZGF0ZSkge1xuICAgIGlmIChkYXRlQ2xpY2tlZFRocmljZS5kYXRlID09PSBkYXRlKSB7XG4gICAgICBkYXRlQ2xpY2tlZFRocmljZS5jb3VudCsrO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyByZXNldCBmb3IgbmV3IGRhdGVcbiAgICAgIGRhdGVDbGlja2VkVGhyaWNlLmRhdGUgPSBkYXRlO1xuICAgICAgZGF0ZUNsaWNrZWRUaHJpY2UuY291bnQgPSAxO1xuICAgIH1cblxuICAgIGlmIChkYXRlQ2xpY2tlZFRocmljZS5jb3VudCA9PT0gMykge1xuICAgICAgZGF0ZUNsaWNrZWRUaHJpY2UuY291bnQgPSAwO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGRhdGVPbkNsaWNrRXZlbnRzIChlKSB7XG4gICAgY29uc3QgZGF0ZURpdiA9IGUudGFyZ2V0O1xuICAgIGNsaWNrQ291bnQrKztcblxuICAgIGlmIChjb25maWcuY3VzdG9tQ2xpY2tFdmVudCkge1xuICAgICAgcmV0dXJuIGNvbmZpZy5jdXN0b21DbGlja0V2ZW50KGUpO1xuICAgIH1cblxuICAgIGlmIChkeW5hbWljRGF0YS5kaXNhYmxlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChjb25maWcuc2VsZWN0UmFuZ2UpIHtcbiAgICAgIHJhbmdlKGRhdGVEaXYpO1xuICAgIH1cblxuICAgIGlmIChjb25maWcuc2luZ2xlRGF0ZUNob2ljZSkge1xuICAgICAgY2xlYXJTZWxlY3Rpb24oY2FsZW5kYXIsIGR5bmFtaWNEYXRhKTtcbiAgICAgIGJvb2tEYXRlcyhbZGF0ZURpdl0pO1xuICAgICAgdGltZUNob29zZXJUb2dnbGUoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0aW1lQ2hvb3NlclRvZ2dsZSAoKSB7XG4gICAgICBpZiAoY29uZmlnLmRpc3BsYXlUaW1lQ2hvb3Nlck1vZGFsKSB7XG4gICAgICAgIHRpbWVDaG9vc2VyLnNob3coKTtcbiAgICAgICAgdGltZUNob29zZXIud3JpdGVUb0RhdGVEaXYoKTtcbiAgICAgICAgdGltZUNob29zZXIud3JpdGVUb0R5bmFtaWNEYXRhKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmFuZ2UgKGRhdGVEaXYpIHtcbiAgICAgIGNvbnN0IGxhc3REYXRlID0gZGF0ZUNsaWNrZWRUaHJpY2UuZGF0ZTtcbiAgICAgIGNvbnN0IHRocmljZSA9IGNsaWtlZFRocmljZShkYXRlRGl2LmRhdGFzZXQuaHVtYW5kYXRlKTtcbiAgICAgIGlmICh0aHJpY2UpIHtcbiAgICAgICAgd2luZG93LmdldFNlbGVjdGlvbigpLnJlbW92ZUFsbFJhbmdlcygpO1xuICAgICAgICAvLyBwYXNzIFwidHJ1ZVwiIHRvIGluZGljYXRlIGEgc2luZ2xlIGRhdGUgcmFuZ2UsIHNlbGVjdGVkIGJ5IHRyaXBsZSBjbGljazpcbiAgICAgICAgYm9va0RhdGVzKFtkYXRlRGl2XSwgdHJ1ZSk7XG4gICAgICAgIHRpbWVDaG9vc2VyVG9nZ2xlKCk7XG4gICAgICAgIGNsaWNrQ291bnQrKztcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKGNsaWNrQ291bnQgJSAyID09PSAwKSB7XG4gICAgICAgIGlmIChjb25maWcuc2VsZWN0TXVsdGlwbGUpIHtcbiAgICAgICAgICBjbGVhclNlbGVjdGlvbihjYWxlbmRhciwgZHluYW1pY0RhdGEpO1xuICAgICAgICB9XG4gICAgICAgIGJvb2tEYXRlcyhbZGF0ZURpdl0pO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAocHJpb3JXYXNTaW5nbGUgPT09IGZhbHNlICYmIGNsaWNrQ291bnQgJSAyID09PSAxKSB7XG4gICAgICAgIGJvb2tEYXRlcyhbZGF0ZURpdl0pO1xuICAgICAgICAvLyB0aW1lQ2hvb3NlclRvZ2dsZSgpO1xuICAgICAgICAvLyBydWxlIHRvIGNoZWNrIGlmIHJhbmdlIGlzIGEgbG9uZ2VyIHRoYW4gMTpcbiAgICAgICAgaWYgKGRhdGVDbGlja2VkVGhyaWNlLmRhdGUgIT09IGxhc3REYXRlKSB7IHRpbWVDaG9vc2VyVG9nZ2xlKCk7IH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmFuZ2Ugc2VsZWN0XG4gICAqIEBkZXNjcmlwdGlvbiBBbGxvd3MgYSByYW5nZSBvZiBkYXRlcyB0byBiZSBzZWxlY3RlZFxuICAgKiBAZnVuY3Rpb24gYm9va0RhdGVzXG4gICAqIEBwYXJhbSBkYXRlcyBOb2RlbGlzdFxuICAgKiBAdG9kbyBhbGxvdyBhIHJhbmdlIG9mIGxlbmd0aCBvbmUgdG8gYmUgc2VsZWN0ZWRcbiAgICogQGZpcmVzIGJvb2tEYXkgZm9yIGVhY2ggZGF5IGluIGEgcmFuZ2VcbiAgICovXG5cbiAgbGV0IHByaW9yV2FzU2luZ2xlID0gZmFsc2U7XG4gIGZ1bmN0aW9uIGJvb2tEYXRlcyAoYXJyYXlPZkRhdGVEaXZzLCBzaW5nbGVEYXRlKSB7XG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIG5ldyBzZWxlY3Rpb24gaW4gdGhlIGR5bmFtaWNEYXRhIG9iamVjdC5cbiAgICAgKiBAcmV0dXJuIHtvYmplY3R9IEFuIG9iamVjdCBjb250YWluaW5nIHRoZSB0cmFja2luZyBhcnJheSBcIm5ld0FycmF5XCIgYW5kIG9iamVjdHMgYXJyYXkuXG4gICAgICovXG5cbiAgICBmdW5jdGlvbiBjcmVhdGVOZXdTZWxlY3Rpb24gKHByaW9yV2FzU2luZ2xlKSB7XG4gICAgICBjb25zdCBwYXJlbnRBciA9IGR5bmFtaWNEYXRhLmRhdGVzU2VsZWN0ZWRBcnJheTtcbiAgICAgIGNvbnN0IHBhcmVudEFyT2JqID0gZHluYW1pY0RhdGEuZGF0ZXNTZWxlY3RlZEFycmF5T2JqZWN0cztcbiAgICAgIGxldCBuZXdBcnJheSwgbmV3T2JqZWN0c0FycmF5O1xuXG4gICAgICBuZXdBcnJheSA9IHBhcmVudEFyW3BhcmVudEFyLmxlbmd0aCAtIDFdO1xuXG4gICAgICBpZiAoIXByaW9yV2FzU2luZ2xlICYmIGNvbmZpZy5zZWxlY3RSYW5nZSAmJiBuZXdBcnJheSAmJiBuZXdBcnJheS5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgbmV3T2JqZWN0c0FycmF5ID0gcGFyZW50QXJPYmpbcGFyZW50QXJPYmoubGVuZ3RoIC0gMV07XG4gICAgICAgIHJldHVybiB7IG5ld0FycmF5LCBuZXdPYmplY3RzQXJyYXkgfTtcbiAgICAgIH1cblxuICAgICAgbmV3QXJyYXkgPSBbXTtcbiAgICAgIG5ld09iamVjdHNBcnJheSA9IFtdO1xuICAgICAgcGFyZW50QXIucHVzaChuZXdBcnJheSk7XG4gICAgICBwYXJlbnRBck9iai5wdXNoKG5ld09iamVjdHNBcnJheSk7XG4gICAgICByZXR1cm4geyBuZXdBcnJheSwgbmV3T2JqZWN0c0FycmF5IH07XG4gICAgfVxuXG4gICAgLy8gY3JlYXRlIG5ldyBzZWxlY3Rpb25zIG9yIHJldHJpZXZlIHRoZSBsYXN0IHNlbGVjdGlvbjpcbiAgICBjb25zdCB7IG5ld0FycmF5LCBuZXdPYmplY3RzQXJyYXkgfSA9IGNyZWF0ZU5ld1NlbGVjdGlvbihwcmlvcldhc1NpbmdsZSk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFycmF5T2ZEYXRlRGl2cy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgZGF0ZURpdiA9IGFycmF5T2ZEYXRlRGl2c1tpXTtcbiAgICAgIGZpbmREYXRlU2VsZWN0aW9uKGRhdGVEaXYpO1xuICAgICAgYm9va0RheShkYXRlRGl2KTtcbiAgICB9XG4gICAgLy8gc3RvcmUgd2luIHRoZSBwcmV2aW91cyBzZWxlY3Rpb24gd2FzIGEgcmFuZ2Ugb2YgbGVuZ3RoIDEsIHJlYWQgYnkgXCJjcmVhdGVOZXdTZWxlY3Rpb25cIlxuICAgIHByaW9yV2FzU2luZ2xlID0gISEoc2luZ2xlRGF0ZSk7XG5cbiAgICAvLyBpZiB0aGUgZGF0ZSBpcyBpbiBhIHByZXZpb3VzIHNlbGVjdGlvbiwgdGhhdCBzZWxlY3Rpb24gaXMgc3BsaWNlZFxuICAgIGZ1bmN0aW9uIGZpbmREYXRlU2VsZWN0aW9uIChkYXRlKSB7XG4gICAgICAvLyBjb25zb2xlLmxvZyhkYXRlKTtcbiAgICAgIGNvbnN0IHN0b3JlID0gZHluYW1pY0RhdGEuZGF0ZXNTZWxlY3RlZEFycmF5T2JqZWN0cztcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgc3RvcmUubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgLy8gdGhlIGFycmF5IGluIHF1ZXN0aW9uXG4gICAgICAgIGNvbnN0IHNpbmdsZVNlbGVjdGlvbiA9IHN0b3JlW2pdO1xuICAgICAgICAvLyBkYXRhIGF0dHIgb2YgaHRtbCBlbGVtZW50XG4gICAgICAgIGNvbnN0IGRhdGVWYWx1ZSA9IGRhdGUuZGF0YXNldC5odW1hbmRhdGU7XG4gICAgICAgIGNvbnN0IHNlYXJjaCA9ICgpID0+IHNpbmdsZVNlbGVjdGlvbi5maW5kKChkYXRlU3RvcmVkKSA9PiBkYXRlU3RvcmVkLmh1bWFuZGF0ZSA9PT0gZGF0ZVZhbHVlKTtcbiAgICAgICAgaWYgKHNlYXJjaCgpKSB7XG4gICAgICAgICAgc2luZ2xlU2VsZWN0aW9uLmZvckVhY2goKGRhdGUpID0+IHtcbiAgICAgICAgICAgIC8vIHJlbW92ZSBzZWxlY3Rpb24gY29sb3VyXG4gICAgICAgICAgICBjb25zdCBkYXlEaXYgPSBjYWxlbmRhci5xdWVyeVNlbGVjdG9yKGBbZGF0YS1odW1hbmRhdGU9JyR7ZGF0ZS5odW1hbmRhdGV9J11gKTtcbiAgICAgICAgICAgIHVuc2VsZWN0ZWRTdHlsZShkYXlEaXYpO1xuICAgICAgICAgICAgLy8gcmVtb3ZlIHRpbWVzLCBpZiBhbnk6XG4gICAgICAgICAgICB3aGlsZSAoZGF5RGl2LmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgZGF5RGl2LnJlbW92ZUNoaWxkKGRheURpdi5sYXN0Q2hpbGQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIC8vIHJlbW92ZSBmcm9tIHN0b3JhZ2VcbiAgICAgICAgICBkeW5hbWljRGF0YS5kYXRlc1NlbGVjdGVkQXJyYXlPYmplY3RzLnNwbGljZShqLCAxKTtcbiAgICAgICAgICBkeW5hbWljRGF0YS5kYXRlc1NlbGVjdGVkQXJyYXkuc3BsaWNlKGosIDEpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGNvbmZpZy5zZWxlY3RSYW5nZSkge1xuICAgICAgY29uc3Qgc3RhcnREYXRlID0gbmV3T2JqZWN0c0FycmF5WzBdO1xuICAgICAgY29uc3Qgc3RhcnRJbmRleCA9IHN0YXJ0RGF0ZS5pbmRleDtcbiAgICAgIC8vIGlmIGEgc2luZ2xlIGRhdGUgaXMgc2VsZWN0ZWQ6XG4gICAgICBjb25zdCBlbmREYXRlID0gbmV3T2JqZWN0c0FycmF5WzFdIHx8IHN0YXJ0RGF0ZTtcbiAgICAgIGNvbnN0IGVuZEluZGV4ID0gKGVuZERhdGUpID8gZW5kRGF0ZS5pbmRleCA6IGZhbHNlO1xuXG4gICAgICBjb25zdCBbbG93LCBoaWdoXSA9IFtwYXJzZUludChzdGFydEluZGV4KSwgcGFyc2VJbnQoZW5kSW5kZXgpXS5zb3J0KChhLCBiKSA9PiBhIC0gYik7XG5cbiAgICAgIGZvciAobGV0IGkgPSBsb3c7IGkgPD0gaGlnaDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGRhdGVEaXYgPSBjYWxlbmRhci5xdWVyeVNlbGVjdG9yKGBbZGF0YS1kYXlpbmRleD0nJHtpfSddYCk7XG4gICAgICAgIGlmIChkYXRlRGl2LmNsYXNzTGlzdC5jb250YWlucygnYmxvY2tlZCcpKSB7XG4gICAgICAgICAgdW5zZWxlY3RlZFN0eWxlKGNhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoYFtpZD0nJHtlbmREYXRlfSddYCkpO1xuICAgICAgICAgIG5ld0FycmF5LnNwbGljZSgxLCAxKTtcbiAgICAgICAgICBuZXdPYmplY3RzQXJyYXkuc3BsaWNlKDEsIDEpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGJvb2tEYXkoZGF0ZURpdik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYm9va0RheSAoZGF0ZURpdikge1xuICAgICAgaWYgKGNvbmZpZy5zaW5nbGVEYXRlQ2hvaWNlICYmIG5ld0FycmF5Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgY2xlYXJTZWxlY3Rpb24oY2FsZW5kYXIsIGR5bmFtaWNEYXRhKTtcbiAgICAgIH1cbiAgICAgIGlmIChuZXdBcnJheS5pbmNsdWRlcyhkYXRlRGl2LmRhdGFzZXQuaHVtYW5kYXRlKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgc2VsZWN0ZWRTdHlsZShkYXRlRGl2KTtcbiAgICAgICAgbmV3QXJyYXkucHVzaChkYXRlRGl2LmRhdGFzZXQuaHVtYW5kYXRlKTtcbiAgICAgICAgbmV3T2JqZWN0c0FycmF5W25ld0FycmF5Lmxlbmd0aCAtIDFdID0gc3RhbmRhcmREYXRlT2JqZWN0KGRhdGVEaXYpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGJvb2tEYXlzT2ZXZWVrIChkYXlJbmRleCkge1xuICAgIGNvbnN0IGRheXMgPSBjYWxlbmRhci5xdWVyeVNlbGVjdG9yQWxsKGBbZGF0YS1kYXlvZndlZWs9XCIke2RheUluZGV4fVwiXWApO1xuICAgIGRheXMuZm9yRWFjaCgoZGF5KSA9PiB7XG4gICAgICBib29rRGF0ZXMoW2RheV0sIHRydWUpO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gYmxvY2tEYXlzT2ZXZWVrIChkYXlJbmRleEFycmF5KSB7XG4gICAgZGF5SW5kZXhBcnJheS5mb3JFYWNoKChkYXlJbmRleCkgPT4ge1xuICAgICAgY29uc3QgZGF5cyA9IGNhbGVuZGFyLnF1ZXJ5U2VsZWN0b3JBbGwoYFtkYXRhLWRheW9md2Vlaz1cIiR7ZGF5SW5kZXh9XCJdYCk7XG4gICAgICBkYXlzLmZvckVhY2goKGRheSkgPT4ge1xuICAgICAgICBkYXkuY2xhc3NMaXN0LmFkZCgnZmlsbGVyJyk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHByZWxvYWREYXRlcyAocHJlbG9hZGVkRGF0ZXMpIHtcbiAgICBpZiAodHlwZW9mIHByZWxvYWRlZERhdGVzWzBdICE9PSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgRXJyb3IoYERhdGVzIHNob3VsZCBiZSBwcm92aWRlZCBhcyBzdHJpbmdzIGluIHRoZSBmb3JtYXQgWVlZWS1NTS1ERCwgUHJlbG9hZGVkIGRhdGVzIGlzICR7cHJlbG9hZGVkRGF0ZXN9XG4gICAgICAgICBhbmQgdGhlIGZpcnN0IGRhdGUgaXMgJHtwcmVsb2FkZWREYXRlc1swXX1gKTtcbiAgICB9XG4gICAgaWYgKHByZWxvYWRlZERhdGVzWzBdLnNwbGl0KCctJylbMF0ubGVuZ3RoICE9PSA0KSB7XG4gICAgICB0aHJvdyBFcnJvcignWWVhciByZXF1aXJlcyA0IGRpZ2l0cywgZS5nLiAyMDI2Jyk7XG4gICAgfVxuICAgIGlmIChwcmVsb2FkZWREYXRlc1swXS5zcGxpdCgnLScpWzFdLmxlbmd0aCAhPT0gMikge1xuICAgICAgdGhyb3cgRXJyb3IoJ01vbnRoIHJlcXVpcmVzIDIgZGlnaXRzLCAwMSBmb3IgSmFudWFyeScpO1xuICAgIH1cbiAgICBpZiAocHJlbG9hZGVkRGF0ZXNbMF0uc3BsaXQoJy0nKVsyXS5sZW5ndGggIT09IDIpIHtcbiAgICAgIHRocm93IEVycm9yKCdEYXkgcmVxdWlyZXMgMiBkaWdpdHMsIDAxIGZvciB0aGUgZmlyc3QgZGF5IG9mIHRoZSBtb250aCcpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldERpdnMgKGRhdGVzKSB7XG4gICAgICByZXR1cm4gZGF0ZXNcbiAgICAgICAgLm1hcChkYXRlID0+IGNhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLWh1bWFuZGF0ZT0nJHtkYXRlfSddYCkpXG4gICAgICAgIC5maWx0ZXIoQm9vbGVhbik7IC8vIHJlbW92ZXMgbnVsbHNcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBibG9ja05vdFByZWxvYWRlZERhdGVzIChkYXRlRGl2cykge1xuICAgICAgY29uc3Qgbm9uT3B0aW9ucyA9IGNhbGVuZGFyLnF1ZXJ5U2VsZWN0b3JBbGwoJy5kYXlUaW1lJyk7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbm9uT3B0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBkYXkgPSBub25PcHRpb25zW2ldO1xuXG4gICAgICAgIGlmICghZGF0ZURpdnMuaW5jbHVkZXMoZGF5KSkge1xuICAgICAgICAgIGRheS5jbGFzc0xpc3QuYWRkKCdmaWxsZXInKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkYXkuY2xhc3NMaXN0LmFkZCgncHJlbG9hZGVkJyk7XG4gICAgICAgICAgZGF5LnRpdGxlID0gY29uZmlnLnByZWxvYWRlZFRvb2x0aXA7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBkYXRlRGl2cyA9IGdldERpdnMocHJlbG9hZGVkRGF0ZXMpO1xuICAgIGJsb2NrTm90UHJlbG9hZGVkRGF0ZXMoZGF0ZURpdnMpO1xuICB9XG59XG5cbmV4cG9ydCB7IFN3aWZ0Q2FsIH07XG4iLCJpbXBvcnQgeyBsYW5ndWFnZXMgfSBmcm9tICcuL2xhbmd1YWdlcy5qcyc7XG5pbXBvcnQgeyBwcm94eVRvUGxhaW5PYmplY3RIZWxwZXIsIGRlYm91bmNlIH0gZnJvbSAnLi9iYXNpY0Z1bmN0aW9ucy5qcyc7XG5cbi8qKlxuICogR2VuZXJhdGVzIGEgdGltZSBjaG9vc2VyIG1vZGFsIGZvciBzZWxlY3RpbmcgdGltZS4gQ2FsbGVkIGluIGNhbGVuZGFyR2VuZXJhdG9yLmpzXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZyAtIFRoZSBjb25maWd1cmF0aW9uIG9iamVjdC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBkeW5hbWljRGF0YSAtIFRoZSBkeW5hbWljIGRhdGEgb2JqZWN0LlxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gY2FsZW5kYXIgLSBUaGUgY2FsZW5kYXIgZWxlbWVudC5cbiAqIEByZXR1cm4ge0Z1bmN0aW9ufSBUaGUgZ2VuZXJhdGVkIHRpbWUgY2hvb3NlciBtb2RhbC5cbiAqL1xuZnVuY3Rpb24gR2VuZXJhdGVUaW1lQ2hvb3Nlck1vZGFsIChjb25maWcsIGR5bmFtaWNEYXRhLCBjYWxlbmRhcikge1xuICAvKipcbiAgICogQSBjdXN0b20gZXZlbnQgZW1pdHRlZCB3aGVuIGEgdGltZSBpcyBhZGRlZCBvciBzZWxlY3RlZFxuICAgKlxuICAgKiBAcmV0dXJuIHt2b2lkfSBUaGlzIGZ1bmN0aW9uIGRvZXMgbm90IHJldHVybiBhbnkgdmFsdWUuXG4gICAqL1xuXG4gIGNvbnN0IGVtaXRUaW1lU2VsZWN0ZWRFdmVudCA9IGRlYm91bmNlKCgpID0+IHtcbiAgICBjb25zdCBldnQgPSBuZXcgQ3VzdG9tRXZlbnQoJ3RpbWVTZWxlY3QnLCB7XG4gICAgICBkZXRhaWw6IHsgZGF0ZTogcHJveHlUb1BsYWluT2JqZWN0SGVscGVyKGR5bmFtaWNEYXRhKSB9LFxuICAgICAgYnViYmxlczogdHJ1ZSxcbiAgICAgIGNvbXBvc2VkOiB0cnVlXG4gICAgfSk7XG4gICAgY29uZmlnLmNhbGVuZGFyQ29udGFpbmVyLmRpc3BhdGNoRXZlbnQoZXZ0KTtcbiAgfSwgMjUwKTtcblxuICBsZXQgdGltZUNob29zZXJNb2RhbDtcblxuICBsZXQgc2VsZWN0aW9uID0gW107XG5cbiAgdGhpcy5nZXRTZWxlY3RlZFRpbWVzID0gKCkgPT4ge1xuICAgIHJldHVybiBzZWxlY3Rpb247XG4gIH07XG5cbiAgdGhpcy5nZW5lcmF0ZU1vZGFsID0gKCkgPT4ge1xuICAgIHJldHVybiBnZW5lcmF0ZU1vZGFsKCk7XG4gIH07XG5cbiAgdGhpcy5zaG93ID0gKCkgPT4ge1xuICAgIGNhbGVuZGFyLnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbic7XG4gICAgcmV0dXJuIHRpbWVDaG9vc2VyTW9kYWwuc2hvdygpO1xuICB9O1xuXG4gIHRoaXMud3JpdGVUb0RhdGVEaXYgPSAoKSA9PiB7XG4gICAgd3JpdGVUb0RhdGVEaXYoKTtcbiAgfTtcblxuICB0aGlzLndyaXRlVG9EeW5hbWljRGF0YSA9ICgpID0+IHtcbiAgICB3cml0ZVRvRHluYW1pY0RhdGEoKTtcbiAgfTtcblxuICAvKipcbiAgICogR2VuZXJhdGVzIGEgZGlhbG9nIGZvciBjaG9vc2luZyB0aW1lLlxuICAgKlxuICAgKiBAcmV0dXJuIHtQcm9taXNlfSBBIHByb21pc2UgdGhhdCByZXNvbHZlcyB0byB0aGUgZ2VuZXJhdGVkIHRpbWUgY2hvb3NlciBtb2RhbC5cbiAgICovXG4gIGZ1bmN0aW9uIGdlbmVyYXRlTW9kYWwgKCkge1xuICAgIGNvbnN0IHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgdGltZUNob29zZXJNb2RhbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpYWxvZycpO1xuICAgICAgdGltZUNob29zZXJNb2RhbC5jbGFzc0xpc3QuYWRkKCd0aW1lQ2hvb3Nlck1vZGFsJyk7XG4gICAgICBjYWxlbmRhci5hcHBlbmRDaGlsZCh0aW1lQ2hvb3Nlck1vZGFsKTtcblxuICAgICAgY29uc3QgdGltZUNvbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIHRpbWVDb250LmNsYXNzTGlzdC5hZGQoJ3RpbWVDb250Jyk7XG4gICAgICB0aW1lQ2hvb3Nlck1vZGFsLmFwcGVuZENoaWxkKHRpbWVDb250KTtcblxuICAgICAgY29uc3QgdGltZUNob29zZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIHRpbWVDaG9vc2VyLmNsYXNzTGlzdC5hZGQoJ3RpbWVDaG9vc2VyJyk7XG4gICAgICB0aW1lQ29udC5hcHBlbmRDaGlsZCh0aW1lQ2hvb3Nlcik7XG5cbiAgICAgIGNvbnN0IGNvbnRyb2xzRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBjb250cm9sc0Rpdi5jbGFzc0xpc3QuYWRkKCdkZWxldGVEaXYnKTtcbiAgICAgIHRpbWVDaG9vc2VyLmFwcGVuZENoaWxkKGNvbnRyb2xzRGl2KTtcblxuICAgICAgZnVuY3Rpb24gY2xvc2VGbiAoKSB7XG4gICAgICAgIGNhbGVuZGFyLnN0eWxlLm92ZXJmbG93ID0gJ3Njcm9sbCc7XG4gICAgICAgIHRpbWVDaG9vc2VyTW9kYWwuY2xvc2UoKTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gaW5uZXJDb21wb25lbnRzICgpIHtcbiAgICAgICAgY29uc3QgdGltZVBpY2tlckNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICB0aW1lUGlja2VyQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ3RpbWVQaWNrZXJDb250YWluZXInKTtcbiAgICAgICAgdGltZUNob29zZXIuYXBwZW5kQ2hpbGQodGltZVBpY2tlckNvbnRhaW5lcik7XG4gICAgICAgIGNvbnN0IHRpdGxlRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIHRpdGxlRGl2LnRleHRDb250ZW50ID0gbGFuZ3VhZ2VzW2NvbmZpZy5sYW5ndWFnZV0udGltZVdpZGdldC5hZGRUaW1lO1xuICAgICAgICB0aXRsZURpdi5jbGFzc0xpc3QuYWRkKCdkZWxldGVEaXYnKTtcbiAgICAgICAgdGltZVBpY2tlckNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aXRsZURpdik7XG4gICAgICAgIG1ha2VEcm9wRG93bnMobGFuZ3VhZ2VzW2NvbmZpZy5sYW5ndWFnZV0udGltZVdpZGdldC5zdGFydCwgdGltZVBpY2tlckNvbnRhaW5lcik7XG4gICAgICAgIG1ha2VEcm9wRG93bnMobGFuZ3VhZ2VzW2NvbmZpZy5sYW5ndWFnZV0udGltZVdpZGdldC5lbmQsIHRpbWVQaWNrZXJDb250YWluZXIpO1xuXG4gICAgICAgIC8vIHNldFRpbWVGb3JBbGxUaWNrQm94KHRpbWVQaWNrZXJDb250YWluZXIpO1xuICAgICAgfVxuXG4gICAgICBtYWtlQnV0dG9uKGNvbnRyb2xzRGl2LCAnZGVsZXRlQnV0dG9uJywgJysnLCAnYWRkIHRpbWUnLCAnY2xpY2snLCBpbm5lckNvbXBvbmVudHMpO1xuICAgICAgbWFrZUJ1dHRvbihjb250cm9sc0RpdiwgJ2RlbGV0ZUJ1dHRvbicsICctJywgJ3JlbW92ZSB0aW1lJywgJ2NsaWNrJywgcmVtb3ZlVGltZVZhbHVlc09uRGF0ZSk7XG4gICAgICBtYWtlQnV0dG9uKGNvbnRyb2xzRGl2LCAnZGVsZXRlQnV0dG9uJywgJ3gnLCAnY2xvc2UnLCAnY2xpY2snLCBjbG9zZUZuKTtcblxuICAgICAgcmVzb2x2ZSh0aW1lQ2hvb3Nlck1vZGFsKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHdyaXRlVG9EYXRlRGl2ICgpIHtcbiAgICBpZiAoY29uZmlnLmRpc3BsYXlUaW1lU2VsZWN0aW9uT25EYXRlKSB7XG4gICAgICBkeW5hbWljRGF0YS5kYXRlc1NlbGVjdGVkQXJyYXlbZHluYW1pY0RhdGEuZGF0ZXNTZWxlY3RlZEFycmF5Lmxlbmd0aCAtIDFdLmZvckVhY2goKGRheVNlbGVjdGVkKSA9PiB7XG4gICAgICAgIHdyaXRlKGRheVNlbGVjdGVkKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHdyaXRlIChkYXRlKSB7XG4gICAgLy8gY29udGFpbnMgYSB0aW1lIGR1cmF0aW9uIGNob2ljZVxuICAgIGxldCBjYWxlbmRhclRpbWVQYXJlbnQ7XG5cbiAgICBjb25zdCBkYXlEaXYgPSBjYWxlbmRhci5xdWVyeVNlbGVjdG9yKGBbZGF0YS1odW1hbmRhdGU9JyR7ZGF0ZX0nXWApO1xuICAgIHdoaWxlIChkYXlEaXYuY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuICAgICAgZGF5RGl2LnJlbW92ZUNoaWxkKGRheURpdi5sYXN0Q2hpbGQpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNyZWF0ZU5ld1BhcmEgKHRleHQpIHtcbiAgICAgIGNvbnN0IHRpbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgICBjYWxlbmRhclRpbWVQYXJlbnQuYXBwZW5kQ2hpbGQodGltZSk7XG4gICAgICB0aW1lLmNsYXNzTGlzdC5hZGQoJ2NhbGVuZGFyVGltZScpO1xuICAgICAgdGltZS50ZXh0Q29udGVudCA9IHRleHQ7XG4gICAgfVxuXG4gICAgc2VsZWN0aW9uLmZvckVhY2goKHRpbWVWYWx1ZSwgaSkgPT4ge1xuICAgICAgaWYgKGkgPT09IDAgfHwgaSAlIDIgPT09IDApIHtcbiAgICAgICAgY2FsZW5kYXJUaW1lUGFyZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGNhbGVuZGFyVGltZVBhcmVudC5jbGFzc0xpc3QuYWRkKCdjYWxlbmRhclRpbWVQYXJlbnQnKTtcbiAgICAgICAgZGF5RGl2LmFwcGVuZENoaWxkKGNhbGVuZGFyVGltZVBhcmVudCk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGZpZWxkTmFtZSA9IE9iamVjdC5rZXlzKHRpbWVWYWx1ZSlbMF07XG4gICAgICBjcmVhdGVOZXdQYXJhKGAke2ZpZWxkTmFtZX06YCk7XG4gICAgICBjcmVhdGVOZXdQYXJhKGAke3RpbWVWYWx1ZVtmaWVsZE5hbWVdLmhofToke3RpbWVWYWx1ZVtmaWVsZE5hbWVdLm1tfWApO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gbWFrZUJ1dHRvbiAocGFyZW50LCBjbGFzc05hbWUsIHRleHRDb250ZW50LCBob3ZlclRleHQsIGFjdGlvbiwgZm4pIHtcbiAgICBjb25zdCBidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBidXR0b24uY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpO1xuICAgIGJ1dHRvbi50ZXh0Q29udGVudCA9IHRleHRDb250ZW50O1xuICAgIGJ1dHRvbi50aXRsZSA9IGhvdmVyVGV4dDtcbiAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcihhY3Rpb24sICgpID0+IHtcbiAgICAgIGZuKCk7XG4gICAgfSk7XG4gICAgcGFyZW50LmFwcGVuZENoaWxkKGJ1dHRvbik7XG4gIH1cblxuICBmdW5jdGlvbiBtYWtlRHJvcERvd25zIChjb250ZXh0VGV4dCwgdGltZVBpY2tlckNvbnRhaW5lcikge1xuICAgIC8vIFRoZSB0aW1lIGNvbnRhaW5lclxuICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCd0aW1lQ29udGFpbmVyJyk7XG4gICAgY29udGFpbmVyLmRhdGFzZXQuY29udGV4dCA9IGNvbnRleHRUZXh0O1xuICAgIHRpbWVQaWNrZXJDb250YWluZXIuYXBwZW5kQ2hpbGQoY29udGFpbmVyKTtcblxuICAgIGNvbnN0IHRpbWVGb3JDb250ZXh0ID0geyBbY29udGV4dFRleHRdOiB7fSB9O1xuXG4gICAgc2VsZWN0aW9uLnB1c2godGltZUZvckNvbnRleHQpO1xuXG4gICAgLy8gTWFrZSBsYWJlbFxuICAgIGNvbnN0IGxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgIGxhYmVsLmNsYXNzTGlzdC5hZGQoJ3RpbWVTZWxlY3RQJyk7XG4gICAgbGFiZWwudGV4dENvbnRlbnQgPSBgJHtjb250ZXh0VGV4dH06YDtcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQobGFiZWwpO1xuXG4gICAgLy8gTWFrZSBob3VyIHNlbGVjdG9yXG4gICAgY29uc3QgdGltZVNlbGVjdG9yRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdGltZVNlbGVjdG9yRGl2LmRhdGFzZXQuY29udGV4dCA9IGNvbnRleHRUZXh0O1xuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aW1lU2VsZWN0b3JEaXYpO1xuXG4gICAgbWFrZVNlbGVjdG9yKCdoaCcsIDIzLCB0aW1lU2VsZWN0b3JEaXYsIGNvbnRleHRUZXh0LCB0aW1lUGlja2VyQ29udGFpbmVyLCB0aW1lRm9yQ29udGV4dCk7XG4gICAgbWFrZVNlbGVjdG9yKCdtbScsIDU5LCB0aW1lU2VsZWN0b3JEaXYsIGNvbnRleHRUZXh0LCB0aW1lUGlja2VyQ29udGFpbmVyLCB0aW1lRm9yQ29udGV4dCk7XG4gIH1cblxuICBmdW5jdGlvbiBtYWtlU2VsZWN0b3IgKHR5cGUsIGxpbWl0LCB0aW1lU2VsZWN0b3JEaXYsIGNvbnRleHRUZXh0LCB0aW1lUGlja2VyQ29udGFpbmVyLCB0aW1lRm9yQ29udGV4dCkge1xuICAgIGNvbnN0IGRyb3BEb3duID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2VsZWN0Jyk7XG4gICAgZHJvcERvd24uY2xhc3NMaXN0LmFkZCh0eXBlLCAndGltZVNlbGVjdCcpO1xuICAgIHRpbWVTZWxlY3RvckRpdi5hcHBlbmRDaGlsZChkcm9wRG93bik7XG5cbiAgICBkcm9wRG93bi5kYXRhc2V0LnR5cGUgPSB0eXBlO1xuICAgIGRyb3BEb3duLmRhdGFzZXQuY29udGV4dCA9IGNvbnRleHRUZXh0O1xuXG4gICAgY29uc3QgcGxhY2Vob2xkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcbiAgICBwbGFjZWhvbGRlci50ZXh0Q29udGVudCA9IHR5cGU7XG4gICAgcGxhY2Vob2xkZXIudmFsdWUgPSAnMDAnO1xuXG4gICAgLy8ge1wiU3RhcnRcIjp7XCJoaFwiOlwiMDBcIn19LHtcIlN0YXJ0XCI6e1wibW1cIjpcIjAwXCJ9fVxuICAgIHRpbWVGb3JDb250ZXh0W2NvbnRleHRUZXh0XVt0eXBlXSA9IHBsYWNlaG9sZGVyLnZhbHVlO1xuICAgIGRyb3BEb3duLmFwcGVuZENoaWxkKHBsYWNlaG9sZGVyKTtcblxuICAgIGxldCBpID0gMDtcbiAgICB3aGlsZSAoaSA8PSBsaW1pdCkge1xuICAgICAgY29uc3QgaG91ciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuICAgICAgbGV0IHRleHQgPSBpLnRvU3RyaW5nKCk7XG4gICAgICBpZiAodGV4dC5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgdGV4dCA9IGAwJHtpfWA7XG4gICAgICB9XG4gICAgICBob3VyLnZhbHVlID0gdGV4dDtcbiAgICAgIGhvdXIudGV4dENvbnRlbnQgPSB0ZXh0O1xuICAgICAgZHJvcERvd24uYXBwZW5kQ2hpbGQoaG91cik7XG4gICAgICBpKys7XG4gICAgfVxuXG4gICAgZHJvcERvd24uYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKCkgPT4ge1xuICAgICAgdGltZUZvckNvbnRleHRbY29udGV4dFRleHRdW3R5cGVdID0gZHJvcERvd24udmFsdWU7XG4gICAgICB3cml0ZVRvRHluYW1pY0RhdGEoKTtcbiAgICAgIHdyaXRlVG9EYXRlRGl2KCk7XG4gICAgICBlbWl0VGltZVNlbGVjdGVkRXZlbnQoKTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHdyaXRlVG9EeW5hbWljRGF0YSAoKSB7XG4gICAgZHluYW1pY0RhdGEuZGF0ZXNTZWxlY3RlZEFycmF5T2JqZWN0c1tkeW5hbWljRGF0YS5kYXRlc1NlbGVjdGVkQXJyYXlPYmplY3RzLmxlbmd0aCAtIDFdLmZvckVhY2goKGRheVNlbGVjdGVkKSA9PiB7XG4gICAgICBjb25zdCB0aW1lcyA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoc2VsZWN0aW9uKSk7XG4gICAgICBkYXlTZWxlY3RlZC50aW1lcyA9IHRpbWVzO1xuICAgICAgY29uc3QgbmFtZXMgPSBPYmplY3Qua2V5cyh0aW1lcyk7XG4gICAgICBPYmplY3QudmFsdWVzKHRpbWVzKS5mb3JFYWNoKCh0aW1lLCBpKSA9PiB7XG4gICAgICAgIGNvbnN0IHZhbCA9IE9iamVjdC52YWx1ZXModGltZSk7XG4gICAgICAgIGNvbnN0IGhobW1zcyA9IE9iamVjdC52YWx1ZXModmFsWzBdKTtcbiAgICAgICAgZGF5U2VsZWN0ZWQudGltZXNbbmFtZXNbaV1dLlVUQyA9IGh1bWFuZGF0ZVRvVVRDKGRheVNlbGVjdGVkLmh1bWFuZGF0ZSwgaGhtbXNzKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gaHVtYW5kYXRlVG9VVEMgKGh1bWFuZGF0ZSwgdGltZSkge1xuICAgIGNvbnN0IGhoID0gKHRpbWVbMF0pID8gdGltZVswXSA6IDA7XG4gICAgY29uc3QgbW0gPSAodGltZVsxXSkgPyB0aW1lWzFdIDogMDtcbiAgICBjb25zdCBzcyA9ICh0aW1lWzJdKSA/IHRpbWVbMl0gOiAwO1xuXG4gICAgbGV0IGludHMgPSBodW1hbmRhdGUuc3BsaXQoJy0nKTtcbiAgICBpbnRzID0gaW50cy5tYXAoKGludCkgPT4gcGFyc2VJbnQoaW50KSk7XG4gICAgaW50c1sxXSA9IGludHNbMV0gLSAxO1xuICAgIHJldHVybiBEYXRlLlVUQyhpbnRzWzBdLCBpbnRzWzFdLCBpbnRzWzJdLCBoaCwgbW0sIHNzKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbW92ZVRpbWVWYWx1ZXNPbkRhdGUgKCkge1xuICAgIGNvbnN0IGQgPSBkeW5hbWljRGF0YS5kYXRlc1NlbGVjdGVkQXJyYXlPYmplY3RzO1xuICAgIGNvbnN0IGxhc3RDaG9pY2UgPSBkW2QubGVuZ3RoIC0gMV07XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsYXN0Q2hvaWNlLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBkYXRlT2JqID0gbGFzdENob2ljZVtpXTtcbiAgICAgIGNvbnN0IGRheURpdiA9IGNhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLWh1bWFuZGF0ZT0nJHtkYXRlT2JqLmh1bWFuZGF0ZX0nXWApO1xuICAgICAgZGF5RGl2LnJlbW92ZUNoaWxkKGRheURpdi5sYXN0Q2hpbGQpO1xuICAgICAgZGF0ZU9iai50aW1lcyA9IGRhdGVPYmoudGltZXMuc2xpY2UoMCwgLTIpO1xuICAgIH1cbiAgICBzZWxlY3Rpb24gPSBzZWxlY3Rpb24uc2xpY2UoMCwgLTIpO1xuICAgIGNvbnN0IHRpbWVDaG9vc2VyID0gY2FsZW5kYXIucXVlcnlTZWxlY3RvcignLnRpbWVDaG9vc2VyJyk7XG4gICAgdGltZUNob29zZXIucmVtb3ZlQ2hpbGQodGltZUNob29zZXIubGFzdENoaWxkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiB0aWNrQm94ZXMgLSBkZXNjcmlwdGlvblxuICAgKlxuICAgKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gdGltZVBpY2tlckVsZW1lbnRzQ29udGFpbmVyIFRoaXMgaXMgdGhlIEhUTUwgZWxlbWVudCB0byB3aGljaCB0aGUgY2hlY2tib3ggd2lsbCBiZSBhcHBlbmRlZC5cbiAgICogQHJldHVybiB7SFRNTEVsZW1lbnR9IFJldHVybnMgYSBIVE1MIGNoZWNrYm94IHRvIHNlbGVjdCBhbGwgZGF5cyBvZiBhIHBhcnRpY3VsYXIgdHlwZSAoZS5nLiBhbGwgTW9uZGF5cykuXG4gICAqIEBkZXNjcmlwdGlvbiBOT1QgSU1QTEVNRU5URURcbiAgICovXG5cbiAgZnVuY3Rpb24gc2V0VGltZUZvckFsbFRpY2tCb3ggKHRhcmdldERpdikge1xuICAgIGNvbnN0IGRheSA9IGR5bmFtaWNEYXRhLmRhdGVzU2VsZWN0ZWRBcnJheVtkeW5hbWljRGF0YS5kYXRlc1NlbGVjdGVkQXJyYXkubGVuZ3RoIC0gMV07XG4gICAgY29uc3QgZGF5Q29kZSA9IGNhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLWh1bWFuZGF0ZT0nJHtkYXl9J11gKS5kYXRhc2V0LmRheW9md2VlaztcbiAgICBjb25zdCB0ZXh0ID0gZm9ybWF0RGF5VGV4dChkYXlDb2RlKTtcblxuICAgIGNvbnN0IGxhYmVsZm9yID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgIGxhYmVsZm9yLnRleHRDb250ZW50ID0gdGV4dDtcbiAgICBsYWJlbGZvci5odG1sRm9yID0gJ3NldFRpbWVGb3JBbGwnO1xuICAgIHRhcmdldERpdi5hcHBlbmRDaGlsZChsYWJlbGZvcik7XG5cbiAgICBjb25zdCBzZXRUaW1lRm9yQWxsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICBzZXRUaW1lRm9yQWxsLnNldEF0dHJpYnV0ZSgndHlwZScsICdjaGVja2JveCcpO1xuICAgIHNldFRpbWVGb3JBbGwubmFtZSA9ICdzZXRUaW1lRm9yQWxsJztcbiAgICB0YXJnZXREaXYuYXBwZW5kQ2hpbGQoc2V0VGltZUZvckFsbCk7XG5cbiAgICBzZXRUaW1lRm9yQWxsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgLy8gQm9vayBkYXRlcyBtZXRob2QgbmVlZHMgdG8gYmUgZXhwb3NlZCBpbiBhIG1hbm5lciBpdCBjYW4gYmUgY2FsbGVkIGZyb20gaGVyZVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gKiBGb3JtYXRzIHRoZSBkYXkgb2YgdGhlIHdlZWsgYW5kIHJldHVybnMgaXQgYXMgYSBzdHJpbmcuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHRleHRCZWZvcmUgLSBUaGUgdGV4dCB0byBiZSBhZGRlZCBiZWZvcmUgdGhlIGZvcm1hdHRlZCBkYXkuXG4gKiBAcGFyYW0ge3N0cmluZ30gdGV4dEFmdGVyIC0gVGhlIHRleHQgdG8gYmUgYWRkZWQgYWZ0ZXIgdGhlIGZvcm1hdHRlZCBkYXkuXG4gKiBAcGFyYW0ge251bWJlcn0gZGF5T2ZXZWVrIC0gVGhlIGluZGV4IG9mIHRoZSBkYXkgb2YgdGhlIHdlZWsgKDAgZm9yIFN1bmRheSwgMSBmb3IgTW9uZGF5LCBldGMuKS5cbiAqIEByZXR1cm4ge3N0cmluZ30gVGhlIGZvcm1hdHRlZCBkYXkgb2YgdGhlIHdlZWsgYXMgYSBzdHJpbmcuXG4gKi9cbiAgZnVuY3Rpb24gZm9ybWF0RGF5VGV4dCAoZGF5T2ZXZWVrKSB7XG4gICAgY29uc3QgZGF5c0luRnVsbCA9IGxhbmd1YWdlc1tjb25maWcubGFuZ3VhZ2VdLmdlbmVyYWxUaW1lLmRheXNJbkZ1bGw7XG4gICAgY29uc3QgYmVmb3JlVGV4dCA9IGxhbmd1YWdlc1tjb25maWcubGFuZ3VhZ2VdLmZvcm1hdERheVRleHQudGV4dEJlZm9yZTtcbiAgICBjb25zdCBmb3JtYXR0ZWREYXkgPSBkYXlzSW5GdWxsW2RheU9mV2Vla107XG4gICAgY29uc3QgcGx1cmFsaXNtID0gbGFuZ3VhZ2VzW2NvbmZpZy5sYW5ndWFnZV0ucGx1cmFsaXNtO1xuICAgIGNvbnN0IGFmdGVyVGV4dCA9IGxhbmd1YWdlc1tjb25maWcubGFuZ3VhZ2VdLmZvcm1hdERheVRleHQudGV4dEFmdGVyO1xuICAgIHJldHVybiBgJHtiZWZvcmVUZXh0fSAke2Zvcm1hdHRlZERheX0ke3BsdXJhbGlzbX0gJHthZnRlclRleHR9YDtcbiAgfVxufVxuXG5leHBvcnQgeyBHZW5lcmF0ZVRpbWVDaG9vc2VyTW9kYWwgfTtcbiIsIi8qZXNsaW50IHF1b3RlczogW1wiZXJyb3JcIiwgXCJiYWNrdGlja1wiXSovXG4vLyBCYWN0aWNrcyBhcmUgZW5mb3JjZWRmIGluIHRoaXMgZmlsZSBzbyB0aGF0IHNwZWNpYWwgY2hhcmFjdGVycyBhcmUgY29ycmVjdGx5IHJlbmRlcmVkLlxuLyogTGFuZ3VhZ2UgZGVmYXVsdHMgKi9cbmNvbnN0IGVuR2IgPSB7XG4gIGdlbmVyYWxUaW1lOiB7XG4gICAgbW9udGhzOiBbYEphbnVhcnlgLCBgRmVicnVhcnlgLCBgTWFyY2hgLCBgQXByaWxgLCBgTWF5YCwgYEp1bmVgLCBgSnVseWAsIGBBdWd1c3RgLCBgU2VwdGVtYmVyYCwgYE9jdG9iZXJgLCBgTm92ZW1iZXJgLCBgRGVjZW1iZXJgXSxcbiAgICBkYXlzSW5GdWxsOiBbYFN1bmRheWAsIGBNb25kYXlgLCBgVHVlc2RheWAsIGBXZWRuZXNkYXlgLCBgVGh1cnNkYXlgLCBgRnJpZGF5YCwgYFNhdHVyZGF5YF0sXG4gICAgZGF5c1RydW5jYXRlZDogW2BTdW5gLCBgTW9uYCwgYFR1ZWAsIGBXZWRgLCBgVGh1YCwgYEZyaWAsIGBTYXRgXVxuICB9LFxuICBwbHVyYWxpc206IGBzYCxcbiAgZm9ybWF0RGF5VGV4dDoge1xuICAgIHRleHRCZWZvcmU6IGBTZXQgdGhlc2UgdGltZXMgZm9yIGFsbGAsXG4gICAgdGV4dEFmdGVyOiBgYFxuICB9LFxuICB0aW1lV2lkZ2V0OiB7XG4gICAgYWRkVGltZTogYEFkZCB0aW1lOmAsXG4gICAgc3RhcnQ6IGBTdGFydGAsXG4gICAgZW5kOiBgRW5kYFxuICB9XG59O1xuXG4vKiBMYW5ndWFnZSBkZWZhdWx0cyAqL1xuY29uc3QgcHRQdCA9IHtcbiAgZ2VuZXJhbFRpbWU6IHtcbiAgICBtb250aHM6IFtgSmFuZWlyb2AsIGBGZXZlcmVpcm9gLCBgTWFyw6dvYCwgYEFicmlsYCwgYE1haW9gLCBgSnVuaG9gLCBgSnVsaG9gLCBgQWdvc3RvYCwgYFNldGVtYnJvYCwgYE91dHVicm9gLCBgTm92ZW1icm9gLCBgRGV6ZW1icm9gXSxcbiAgICBkYXlzSW5GdWxsOiBbYERvbWluZ29gLCBgU2VndW5kYS1GZWlyYWAsIGBUZXLDp2EtRmVpcmFgLCBgUXVhcnRhLUZlaXJhYCwgYFF1aW50YS1GZWlyYWAsIGBTZXh0YS1GZWlyYWAsIGBTw6FiYWRvYF0sXG4gICAgZGF5c1RydW5jYXRlZDogW2BEb21gLCBgU2VnYCwgYFRlcmAsIGBRdWFgLCBgUXVpYCwgYFNleGAsIGBTYWJgXVxuICB9LFxuICBwbHVyYWxpc206IGBzYCxcbiAgZm9ybWF0RGF5VGV4dDoge1xuICAgIHRleHRCZWZvcmU6IGBBcHBsaXF1ZSBlc3RhcyBob3JhcyBhYCxcbiAgICB0ZXh0QWZ0ZXI6IGBgXG4gIH0sXG4gIHRpbWVXaWRnZXQ6IHtcbiAgICBhZGRUaW1lOiBgQWRpY2lvbmUgZHVyYcOnw6NvOmAsXG4gICAgc3RhcnQ6YEluw61jaW9gLFxuICAgIGVuZDogYEZpbWBcbiAgfVxuXG59O1xuXG5jb25zdCBsYW5ndWFnZXMgPSB7IGVuR2IsIHB0UHQgfTtcblxuZXhwb3J0IHsgbGFuZ3VhZ2VzIH07XG4iLCJjb25zdCBjb2xvdXJzID0ge1xuICBtb250aENvbG9yOiAnI2ZjMycsXG4gIG1vbnRoQmFja2dvdW5kQm9sb3I6ICcjNjc5OWNiJyxcbiAgZGF5TmFtZUNvbG9yOiAnIzAwMCcsXG4gIGRheU5hbWVCYWNrZ3JvdW5kQ29sb3I6ICcjY2NjJyxcbiAgZGF5Q29sb3I6ICcjMDAwJyxcbiAgZGF5QmFja2dyb3VuZENvbG9yOiAnI2ZmZicsXG4gIG1vbnRoQm9yZGVyQ29sb3I6ICcjZjE1OTI1J1xufTtcblxuY29uc3Qgc2VsZWN0ZWRTdHlsZSA9IChkaXYpID0+IHtcbiAgZGl2LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGNvbG91cnMubW9udGhDb2xvcjtcbn07XG5cbmNvbnN0IHVuc2VsZWN0ZWRTdHlsZSA9IChkaXYpID0+IHtcbiAgZGl2LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGNvbG91cnMuZGF5QmFja2dyb3VuZENvbG9yO1xufTtcblxuZXhwb3J0IHsgc2VsZWN0ZWRTdHlsZSwgdW5zZWxlY3RlZFN0eWxlLCBjb2xvdXJzIH07XG4iXX0=
