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
      }
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
      }
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwcmVCdW5kbGluZ0pTL2Jhc2ljRnVuY3Rpb25zLmpzIiwicHJlQnVuZGxpbmdKUy9jYWxlbmRhckFwcC5jc3MiLCJwcmVCdW5kbGluZ0pTL2NhbGVuZGFyR2VuZXJhdG9yLmpzIiwicHJlQnVuZGxpbmdKUy9kaXNwbGF5VGltZUNob29zZXJNb2RhbC5qcyIsInByZUJ1bmRsaW5nSlMvbGFuZ3VhZ2VzLmpzIiwicHJlQnVuZGxpbmdKUy9zdHlsZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNBQSxJQUFBLE9BQUEsR0FBQSxPQUFBO0FBQThDLFNBQUEsUUFBQSxDQUFBLHNDQUFBLE9BQUEsd0JBQUEsTUFBQSx1QkFBQSxNQUFBLENBQUEsUUFBQSxhQUFBLENBQUEsa0JBQUEsQ0FBQSxnQkFBQSxDQUFBLFdBQUEsQ0FBQSx5QkFBQSxNQUFBLElBQUEsQ0FBQSxDQUFBLFdBQUEsS0FBQSxNQUFBLElBQUEsQ0FBQSxLQUFBLE1BQUEsQ0FBQSxTQUFBLHFCQUFBLENBQUEsS0FBQSxPQUFBLENBQUEsQ0FBQTtBQUFBLFNBQUEsZUFBQSxHQUFBLEVBQUEsQ0FBQSxXQUFBLGVBQUEsQ0FBQSxHQUFBLEtBQUEscUJBQUEsQ0FBQSxHQUFBLEVBQUEsQ0FBQSxLQUFBLDJCQUFBLENBQUEsR0FBQSxFQUFBLENBQUEsS0FBQSxnQkFBQTtBQUFBLFNBQUEsaUJBQUEsY0FBQSxTQUFBO0FBQUEsU0FBQSw0QkFBQSxDQUFBLEVBQUEsTUFBQSxTQUFBLENBQUEscUJBQUEsQ0FBQSxzQkFBQSxpQkFBQSxDQUFBLENBQUEsRUFBQSxNQUFBLE9BQUEsQ0FBQSxHQUFBLE1BQUEsQ0FBQSxTQUFBLENBQUEsUUFBQSxDQUFBLElBQUEsQ0FBQSxDQUFBLEVBQUEsS0FBQSxhQUFBLENBQUEsaUJBQUEsQ0FBQSxDQUFBLFdBQUEsRUFBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLFdBQUEsQ0FBQSxJQUFBLE1BQUEsQ0FBQSxjQUFBLENBQUEsbUJBQUEsS0FBQSxDQUFBLElBQUEsQ0FBQSxDQUFBLE9BQUEsQ0FBQSwrREFBQSxJQUFBLENBQUEsQ0FBQSxVQUFBLGlCQUFBLENBQUEsQ0FBQSxFQUFBLE1BQUE7QUFBQSxTQUFBLGtCQUFBLEdBQUEsRUFBQSxHQUFBLFFBQUEsR0FBQSxZQUFBLEdBQUEsR0FBQSxHQUFBLENBQUEsTUFBQSxFQUFBLEdBQUEsR0FBQSxHQUFBLENBQUEsTUFBQSxXQUFBLENBQUEsTUFBQSxJQUFBLE9BQUEsS0FBQSxDQUFBLEdBQUEsR0FBQSxDQUFBLEdBQUEsR0FBQSxFQUFBLENBQUEsSUFBQSxJQUFBLENBQUEsQ0FBQSxJQUFBLEdBQUEsQ0FBQSxDQUFBLFVBQUEsSUFBQTtBQUFBLFNBQUEsc0JBQUEsQ0FBQSxFQUFBLENBQUEsUUFBQSxDQUFBLFdBQUEsQ0FBQSxnQ0FBQSxNQUFBLElBQUEsQ0FBQSxDQUFBLE1BQUEsQ0FBQSxRQUFBLEtBQUEsQ0FBQSw0QkFBQSxDQUFBLFFBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsT0FBQSxDQUFBLE9BQUEsQ0FBQSxpQkFBQSxDQUFBLElBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsQ0FBQSxHQUFBLElBQUEsUUFBQSxDQUFBLFFBQUEsTUFBQSxDQUFBLENBQUEsTUFBQSxDQUFBLFVBQUEsQ0FBQSx1QkFBQSxDQUFBLElBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsQ0FBQSxHQUFBLElBQUEsTUFBQSxDQUFBLENBQUEsSUFBQSxDQUFBLENBQUEsQ0FBQSxLQUFBLEdBQUEsQ0FBQSxDQUFBLE1BQUEsS0FBQSxDQUFBLEdBQUEsQ0FBQSxpQkFBQSxDQUFBLElBQUEsQ0FBQSxPQUFBLENBQUEsR0FBQSxDQUFBLHlCQUFBLENBQUEsWUFBQSxDQUFBLGVBQUEsQ0FBQSxHQUFBLENBQUEsY0FBQSxNQUFBLENBQUEsQ0FBQSxNQUFBLENBQUEsMkJBQUEsQ0FBQSxRQUFBLENBQUEsYUFBQSxDQUFBO0FBQUEsU0FBQSxnQkFBQSxHQUFBLFFBQUEsS0FBQSxDQUFBLE9BQUEsQ0FBQSxHQUFBLFVBQUEsR0FBQTtBQUU5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLFNBQVMsQ0FBRSxJQUFJLEVBQUU7RUFDeEIsSUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUM7RUFDakMsSUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7RUFDeEMsSUFBTSxHQUFHLEdBQUcsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNsQyxJQUFNLGFBQWEsR0FBRyxLQUFLLEdBQUcsRUFBRSxPQUFBLE1BQUEsQ0FBTyxLQUFLLElBQUssS0FBSztFQUN0RCxJQUFNLFdBQVcsR0FBRyxHQUFHLEdBQUcsRUFBRSxPQUFBLE1BQUEsQ0FBTyxHQUFHLElBQUssR0FBRztFQUM5QyxJQUFNLFlBQVksTUFBQSxNQUFBLENBQU0sU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFBLE1BQUEsQ0FBSSxhQUFhLE9BQUEsTUFBQSxDQUFJLFdBQVcsQ0FBRTtFQUN0RSxPQUFPLFlBQVk7QUFDckI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyxjQUFjLENBQUUsU0FBUyxFQUFFO0VBQ2xDLElBQUksSUFBSSxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDO0VBQy9CLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQUMsSUFBRztJQUFBLE9BQUssUUFBUSxDQUFDLElBQUcsQ0FBQztFQUFBLEVBQUM7RUFDdkMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO0VBQ3JCLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM1Qzs7QUFFQTtBQUNBLElBQU0sa0JBQWtCLEdBQUc7RUFBRSxHQUFHLEVBQUUsS0FBSztFQUFFLFNBQVMsRUFBRSxZQUFZO0VBQUUsS0FBSyxFQUFFLEdBQUc7RUFBRSxHQUFHLEVBQUU7QUFBYyxDQUFDO0FBQ2xHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVMsa0JBQWtCLENBQUUsSUFBSSxFQUFFO0VBQ2pDLElBQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsa0JBQWtCLENBQUM7RUFDN0MsR0FBRyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUc7RUFDMUIsR0FBRyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVM7RUFDdEMsR0FBRyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVE7RUFDakMsR0FBRyxDQUFDLEdBQUcsR0FBRyxjQUFjLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUM7RUFDaEQsT0FBTyxHQUFHO0FBQ1o7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFNBQVMsZUFBZSxDQUFFLElBQUksRUFBRTtFQUM5QixJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRTtJQUN2QixJQUFNLENBQUMsR0FBRyxJQUFJLEtBQUssQ0FBQyw2QkFBNkIsQ0FBQztJQUNsRCxNQUFNLENBQUM7RUFDVDtFQUNBLElBQUEsV0FBQSxHQUF5QixJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQztJQUFBLFlBQUEsR0FBQSxjQUFBLENBQUEsV0FBQTtJQUFqQyxLQUFLLEdBQUEsWUFBQTtJQUFFLE9BQU8sR0FBQSxZQUFBO0VBQ3JCLE9BQVEsUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsSUFBSSxHQUFLLFFBQVEsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEdBQUcsSUFBSztBQUM3RTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVMsY0FBYyxDQUFFLEtBQUssRUFBRSxJQUFJLEVBQUU7RUFDcEMsT0FBTyxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzNDOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLGNBQWMsQ0FBRSxRQUFRLEVBQUUsV0FBVyxFQUFFO0VBQzlDLElBQU0sYUFBYSxHQUFHLFdBQVcsQ0FBQyx5QkFBeUI7RUFDM0QsSUFBTSxVQUFVLEdBQUcsV0FBVyxDQUFDLGtCQUFrQjtFQUFDLElBQUEsS0FBQSxZQUFBLE1BQUEsQ0FBQSxFQUVIO0lBQUEsSUFBQSxNQUFBLFlBQUEsT0FBQSxDQUFBLEVBQ0Q7TUFDMUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQUksRUFBSztRQUM5QixJQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsYUFBYSxxQkFBQSxNQUFBLENBQXFCLElBQUksT0FBSSxDQUFDO1FBQ3BFLElBQUEsdUJBQWUsRUFBQyxPQUFPLENBQUM7UUFDeEIsT0FBTyxPQUFPLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7VUFDbEMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDO1FBQ3hDO1FBQ0EsSUFBSSxDQUFDLEtBQUssYUFBYSxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLFVBQVUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1VBQ2pFLGFBQWEsQ0FBQyxNQUFNLEdBQUcsQ0FBQztVQUN4QixVQUFVLENBQUMsTUFBTSxHQUFHLENBQUM7UUFDdkI7TUFDRixDQUFDLENBQUM7SUFDSixDQUFDO0lBWkQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFO01BQUEsTUFBQSxDQUFBLENBQUE7SUFBQTtFQWE1QyxDQUFDO0VBZEQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFO0lBQUEsS0FBQSxDQUFBLENBQUE7RUFBQTtBQWUvQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxTQUFTLFdBQVcsQ0FBRSxNQUFNLEVBQUU7RUFDNUIsSUFBSSxNQUFNLEdBQUcsRUFBRSxFQUFFO0lBQ2YsSUFBTSxDQUFDLEdBQUcsSUFBSSxLQUFLLENBQUMsZ0RBQWdELENBQUM7SUFDckUsTUFBTSxDQUFDO0VBQ1Q7RUFDQSxJQUFNLEtBQUssR0FBRyxJQUFJLFdBQVcsQ0FBQyxHQUFHLENBQUM7RUFDbEMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDO0VBQ3BDLElBQUksRUFBRSxHQUFHLEVBQUU7RUFDWCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtJQUNyQyxFQUFFLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQztJQUNkLElBQUksQ0FBQyxLQUFLLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO01BQzFCLE9BQU8sRUFBRSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsTUFBTSxJQUFJLE1BQU0sSUFBSSxFQUFFLENBQUMsQ0FBQztJQUM3QztFQUNGO0FBQ0Y7QUFFQSxTQUFTLHdCQUF3QixDQUFFLEtBQUssRUFBRTtFQUN4QyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7SUFDeEI7SUFDQSxPQUFPLEtBQUssQ0FBQyxHQUFHLENBQUMsd0JBQXdCLENBQUM7RUFDNUMsQ0FBQyxNQUFNLElBQUksS0FBSyxLQUFLLElBQUksSUFBSSxPQUFBLENBQU8sS0FBSyxNQUFLLFFBQVEsRUFBRTtJQUN0RDtJQUNBLElBQU0sV0FBVyxHQUFHLENBQUMsQ0FBQztJQUN0QixLQUFLLElBQU0sR0FBRyxJQUFJLEtBQUssRUFBRTtNQUN2QixJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLEVBQUU7UUFDcEQsV0FBVyxDQUFDLEdBQUcsQ0FBQyxHQUFHLHdCQUF3QixDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztNQUN6RDtJQUNGO0lBQ0EsT0FBTyxXQUFXO0VBQ3BCLENBQUMsTUFBTTtJQUNMO0lBQ0EsT0FBTyxLQUFLO0VBQ2Q7QUFDRjtBQUVBLFNBQVMsb0JBQW9CLENBQUEsRUFBSTtFQUMvQixJQUFNLFlBQVksR0FBRyxXQUFXLENBQUMsRUFBRSxDQUFDO0VBQ3BDLElBQUksUUFBUSxDQUFDLGFBQWEsQ0FBQyxZQUFZLEdBQUcsWUFBWSxDQUFDLEVBQUU7SUFDdkQsT0FBTyxvQkFBb0IsQ0FBQyxDQUFDO0VBQy9CLENBQUMsTUFBTTtJQUNMLE9BQU8sWUFBWTtFQUNyQjtBQUNGOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyxlQUFlLENBQUUsY0FBYyxFQUFFO0VBQ3hDLElBQU0sS0FBSyxHQUFHLEVBQUU7RUFDaEIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLGNBQWMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDOUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFO01BQ1gsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUNsQztJQUNBLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUNqRCxJQUFJLENBQUMsS0FBSyxjQUFjLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtNQUNuQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7TUFDWixJQUFNLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7TUFDNUIsT0FBTyxDQUFDO0lBQ1Y7RUFDRjtBQUNGOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyxnQkFBZ0IsQ0FBRSxRQUFRLEVBQUUsU0FBUyxFQUFFO0VBQzlDLElBQUksUUFBUSxJQUFJLFNBQVMsRUFBRTtJQUN6QixJQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFDLEVBQUUsRUFBSztNQUFFLE9BQU8sRUFBRSxDQUFDLE9BQU8sQ0FBQyxTQUFTO0lBQUUsQ0FBQyxDQUFDO0lBQy9HLElBQU0sUUFBUSxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBQyxFQUFFLEVBQUs7TUFBRSxPQUFPLEVBQUUsQ0FBQyxHQUFHO0lBQUUsQ0FBQyxDQUFDO0lBRTFELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO01BQ3ZDLElBQUksUUFBUSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtRQUN2QyxJQUFNLEdBQUcsR0FBRyxRQUFRLENBQUMsYUFBYSxVQUFBLE1BQUEsQ0FBUyxPQUFPLENBQUMsQ0FBQyxDQUFDLFFBQUksQ0FBQztRQUMxRDtRQUNBLEdBQUcsQ0FBQyxLQUFLLENBQUMsZUFBZSxHQUFHLE9BQU87UUFDbkMsR0FBRyxDQUFDLEtBQUssR0FBRyxvQkFBb0I7UUFFaEMsSUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUM7UUFDMUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDO1FBQ3BDLE1BQU0sQ0FBQyxXQUFXLEdBQUcsUUFBUTtRQUU3QixHQUFHLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQztNQUN6QjtJQUNGO0VBQ0Y7QUFDRjtBQUVBLFNBQVMsU0FBUyxDQUFFLEdBQUcsRUFBRTtFQUN2QixJQUFNLE1BQU0sR0FBRyxFQUFFO0VBQ2pCLE9BQU8sU0FBUyxDQUFDLEdBQUcsQ0FBQztFQUVyQixTQUFTLFVBQVUsQ0FBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0lBQ3pCLE9BQU8sQ0FBQyxHQUFHLENBQUM7RUFDZDtFQUVBLFNBQVMsU0FBUyxDQUFFLE1BQU0sRUFBRTtJQUMxQixJQUFNLG1CQUFtQixHQUFHLEVBQUU7SUFDOUIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7TUFDdEMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztNQUNwRCxJQUFJLENBQUMsS0FBSyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtRQUMzQixPQUFPLElBQUksQ0FBQyxNQUFNLEVBQUUsbUJBQW1CLENBQUM7TUFDMUM7SUFDRjtFQUNGO0VBRUEsU0FBUyxJQUFJLENBQUUsTUFBTSxFQUFFLG1CQUFtQixFQUFFO0lBQzFDLElBQU0sd0JBQXdCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFtQixDQUFDLENBQUM7SUFDaEYsSUFBTSxTQUFTLEdBQUcsbUJBQW1CLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztJQUN0RCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsd0JBQXdCLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO01BQ3hELElBQU0sUUFBUSxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxDQUFDLENBQUM7TUFDL0QsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztNQUNyQyxJQUFJLENBQUMsS0FBSyxtQkFBbUIsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1FBQ3hDLE9BQU8sTUFBTTtNQUNmO0lBQ0Y7RUFDRjtBQUNGOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyxZQUFZLENBQUUsTUFBTSxFQUFFO0VBQzdCLElBQU0sbUJBQW1CLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUM7RUFFdkQsS0FBSyxJQUFJLFlBQVksR0FBRyxDQUFDLEVBQUUsWUFBWSxHQUFHLG1CQUFtQixDQUFDLE1BQU0sRUFBRSxZQUFZLElBQUksQ0FBQyxFQUFFO0lBQ3ZGLElBQU0sWUFBWSxHQUFHLG1CQUFtQixDQUFDLFlBQVksQ0FBQztJQUN0RCxJQUFNLFVBQVUsR0FBRyxtQkFBbUIsQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFDO0lBRXhELEtBQUssSUFBSSxlQUFlLEdBQUcsQ0FBQyxFQUFFLGVBQWUsR0FBRyxtQkFBbUIsQ0FBQyxNQUFNLEVBQUUsZUFBZSxJQUFJLENBQUMsRUFBRTtNQUNoRyxJQUFJLFlBQVksS0FBSyxlQUFlLEVBQUU7UUFDcEMsSUFBTSxlQUFlLEdBQUcsbUJBQW1CLENBQUMsZUFBZSxDQUFDO1FBQzVELElBQU0sYUFBYSxHQUFHLG1CQUFtQixDQUFDLGVBQWUsR0FBRyxDQUFDLENBQUM7UUFFOUQsSUFBSSxhQUFhLElBQUksWUFBWSxJQUFJLGFBQWEsSUFBSSxVQUFVLEVBQUU7VUFDaEUsT0FBTyxJQUFJO1FBQ2IsQ0FBQyxNQUFNLElBQUksWUFBWSxJQUFJLGVBQWUsSUFBSSxVQUFVLElBQUksYUFBYSxFQUFFO1VBQ3pFLE9BQU8sSUFBSTtRQUNiLENBQUMsTUFBTSxJQUFJLFlBQVksS0FBSyxlQUFlLElBQUksVUFBVSxLQUFLLGFBQWEsRUFBRTtVQUMzRSxPQUFPLElBQUk7UUFDYixDQUFDLE1BQU0sSUFBSSxVQUFVLElBQUksZUFBZSxJQUFJLFVBQVUsSUFBSSxhQUFhLEVBQUU7VUFDdkUsT0FBTyxJQUFJO1FBQ2IsQ0FBQyxNQUFNO1VBQ0wsT0FBTyxLQUFLO1FBQ2Q7TUFDRjtJQUNGO0VBQ0Y7RUFDQSxPQUFPLEtBQUs7QUFDZDtBQUVBLFNBQVMsUUFBUSxDQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUU7RUFDNUIsSUFBSSxLQUFLO0VBQ1QsT0FBTyxZQUFtQjtJQUFBLElBQUEsS0FBQTtJQUFBLFNBQUEsSUFBQSxHQUFBLFNBQUEsQ0FBQSxNQUFBLEVBQU4sSUFBSSxPQUFBLEtBQUEsQ0FBQSxJQUFBLEdBQUEsSUFBQSxNQUFBLElBQUEsR0FBQSxJQUFBLEVBQUEsSUFBQTtNQUFKLElBQUksQ0FBQSxJQUFBLElBQUEsU0FBQSxDQUFBLElBQUE7SUFBQTtJQUN0QixZQUFZLENBQUMsS0FBSyxDQUFDO0lBQ25CLEtBQUssR0FBRyxVQUFVLENBQUM7TUFBQSxPQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsS0FBSSxFQUFFLElBQUksQ0FBQztJQUFBLEdBQUUsS0FBSyxDQUFDO0VBQ3ZELENBQUM7QUFDSDs7O0FDN1JBOzs7Ozs7OztBQ1VBLElBQUEsZUFBQSxHQUFBLE9BQUE7QUFLQSxJQUFBLHdCQUFBLEdBQUEsT0FBQTtBQUNBLElBQUEsT0FBQSxHQUFBLE9BQUE7QUFDQSxJQUFBLFVBQUEsR0FBQSxPQUFBO0FBQ0EsSUFBQSxZQUFBLEdBQUEsc0JBQUEsQ0FBQSxPQUFBO0FBQXNDLFNBQUEsdUJBQUEsR0FBQSxXQUFBLEdBQUEsSUFBQSxHQUFBLENBQUEsVUFBQSxHQUFBLEdBQUEsZ0JBQUEsR0FBQTtBQUFBLFNBQUEsZUFBQSxHQUFBLEVBQUEsQ0FBQSxXQUFBLGVBQUEsQ0FBQSxHQUFBLEtBQUEscUJBQUEsQ0FBQSxHQUFBLEVBQUEsQ0FBQSxLQUFBLDJCQUFBLENBQUEsR0FBQSxFQUFBLENBQUEsS0FBQSxnQkFBQTtBQUFBLFNBQUEsaUJBQUEsY0FBQSxTQUFBO0FBQUEsU0FBQSw0QkFBQSxDQUFBLEVBQUEsTUFBQSxTQUFBLENBQUEscUJBQUEsQ0FBQSxzQkFBQSxpQkFBQSxDQUFBLENBQUEsRUFBQSxNQUFBLE9BQUEsQ0FBQSxHQUFBLE1BQUEsQ0FBQSxTQUFBLENBQUEsUUFBQSxDQUFBLElBQUEsQ0FBQSxDQUFBLEVBQUEsS0FBQSxhQUFBLENBQUEsaUJBQUEsQ0FBQSxDQUFBLFdBQUEsRUFBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLFdBQUEsQ0FBQSxJQUFBLE1BQUEsQ0FBQSxjQUFBLENBQUEsbUJBQUEsS0FBQSxDQUFBLElBQUEsQ0FBQSxDQUFBLE9BQUEsQ0FBQSwrREFBQSxJQUFBLENBQUEsQ0FBQSxVQUFBLGlCQUFBLENBQUEsQ0FBQSxFQUFBLE1BQUE7QUFBQSxTQUFBLGtCQUFBLEdBQUEsRUFBQSxHQUFBLFFBQUEsR0FBQSxZQUFBLEdBQUEsR0FBQSxHQUFBLENBQUEsTUFBQSxFQUFBLEdBQUEsR0FBQSxHQUFBLENBQUEsTUFBQSxXQUFBLENBQUEsTUFBQSxJQUFBLE9BQUEsS0FBQSxDQUFBLEdBQUEsR0FBQSxDQUFBLEdBQUEsR0FBQSxFQUFBLENBQUEsSUFBQSxJQUFBLENBQUEsQ0FBQSxJQUFBLEdBQUEsQ0FBQSxDQUFBLFVBQUEsSUFBQTtBQUFBLFNBQUEsc0JBQUEsQ0FBQSxFQUFBLENBQUEsUUFBQSxDQUFBLFdBQUEsQ0FBQSxnQ0FBQSxNQUFBLElBQUEsQ0FBQSxDQUFBLE1BQUEsQ0FBQSxRQUFBLEtBQUEsQ0FBQSw0QkFBQSxDQUFBLFFBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsT0FBQSxDQUFBLE9BQUEsQ0FBQSxpQkFBQSxDQUFBLElBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsQ0FBQSxHQUFBLElBQUEsUUFBQSxDQUFBLFFBQUEsTUFBQSxDQUFBLENBQUEsTUFBQSxDQUFBLFVBQUEsQ0FBQSx1QkFBQSxDQUFBLElBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsQ0FBQSxHQUFBLElBQUEsTUFBQSxDQUFBLENBQUEsSUFBQSxDQUFBLENBQUEsQ0FBQSxLQUFBLEdBQUEsQ0FBQSxDQUFBLE1BQUEsS0FBQSxDQUFBLEdBQUEsQ0FBQSxpQkFBQSxDQUFBLElBQUEsQ0FBQSxPQUFBLENBQUEsR0FBQSxDQUFBLHlCQUFBLENBQUEsWUFBQSxDQUFBLGVBQUEsQ0FBQSxHQUFBLENBQUEsY0FBQSxNQUFBLENBQUEsQ0FBQSxNQUFBLENBQUEsMkJBQUEsQ0FBQSxRQUFBLENBQUEsYUFBQSxDQUFBO0FBQUEsU0FBQSxnQkFBQSxHQUFBLFFBQUEsS0FBQSxDQUFBLE9BQUEsQ0FBQSxHQUFBLFVBQUEsR0FBQTtBQUFBLFNBQUEsUUFBQSxDQUFBLHNDQUFBLE9BQUEsd0JBQUEsTUFBQSx1QkFBQSxNQUFBLENBQUEsUUFBQSxhQUFBLENBQUEsa0JBQUEsQ0FBQSxnQkFBQSxDQUFBLFdBQUEsQ0FBQSx5QkFBQSxNQUFBLElBQUEsQ0FBQSxDQUFBLFdBQUEsS0FBQSxNQUFBLElBQUEsQ0FBQSxLQUFBLE1BQUEsQ0FBQSxTQUFBLHFCQUFBLENBQUEsS0FBQSxPQUFBLENBQUEsQ0FBQTtBQUFBLFNBQUEsa0JBQUEsTUFBQSxFQUFBLEtBQUEsYUFBQSxDQUFBLE1BQUEsQ0FBQSxHQUFBLEtBQUEsQ0FBQSxNQUFBLEVBQUEsQ0FBQSxVQUFBLFVBQUEsR0FBQSxLQUFBLENBQUEsQ0FBQSxHQUFBLFVBQUEsQ0FBQSxVQUFBLEdBQUEsVUFBQSxDQUFBLFVBQUEsV0FBQSxVQUFBLENBQUEsWUFBQSx3QkFBQSxVQUFBLEVBQUEsVUFBQSxDQUFBLFFBQUEsU0FBQSxNQUFBLENBQUEsY0FBQSxDQUFBLE1BQUEsRUFBQSxjQUFBLENBQUEsVUFBQSxDQUFBLEdBQUEsR0FBQSxVQUFBO0FBQUEsU0FBQSxhQUFBLFdBQUEsRUFBQSxVQUFBLEVBQUEsV0FBQSxRQUFBLFVBQUEsRUFBQSxpQkFBQSxDQUFBLFdBQUEsQ0FBQSxTQUFBLEVBQUEsVUFBQSxPQUFBLFdBQUEsRUFB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VUFBQSxZQUFBLFdBQUEsTUFBQSxFQUFBLElBQUEsRUFBQSxLQUFBLFFBQUEsQ0FBQSxXQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsS0FBQSxDQUFBLENBQUEsRUFBQSxJQUFBLE9BQUEsV0FBQSxHQUFBLFFBQUEsQ0FBQSxJQUFBLENBQUEsS0FBQSxDQUFBLE1BQUEsRUFBQSxDQUFBLE9BQUEsUUFBQSxPQUFBLFdBQUEsUUFBQSxLQUFBLEVBQUEsZUFBQSxDQUFBLFFBQUEsRUFBQSxLQUFBLENBQUEsU0FBQSxVQUFBLFFBQUEsY0FBQSxVQUFBLENBQUEsS0FBQSxPQUFBLFNBQUE7QUFBQSxTQUFBLDBCQUFBLGVBQUEsT0FBQSxxQkFBQSxPQUFBLENBQUEsU0FBQSxvQkFBQSxPQUFBLENBQUEsU0FBQSxDQUFBLElBQUEsMkJBQUEsS0FBQSxvQ0FBQSxPQUFBLENBQUEsU0FBQSxDQUFBLE9BQUEsQ0FBQSxJQUFBLENBQUEsT0FBQSxDQUFBLFNBQUEsQ0FBQSxPQUFBLDhDQUFBLENBQUE7QUFBQSxTQUFBLGtCQUFBLEVBQUEsV0FBQSxRQUFBLENBQUEsUUFBQSxDQUFBLElBQUEsQ0FBQSxFQUFBLEVBQUEsT0FBQTtBQUFBLFNBQUEsZ0JBQUEsQ0FBQSxFQUFBLENBQUEsSUFBQSxlQUFBLEdBQUEsTUFBQSxDQUFBLGNBQUEsR0FBQSxNQUFBLENBQUEsY0FBQSxDQUFBLElBQUEsY0FBQSxnQkFBQSxDQUFBLEVBQUEsQ0FBQSxJQUFBLENBQUEsQ0FBQSxTQUFBLEdBQUEsQ0FBQSxTQUFBLENBQUEsWUFBQSxlQUFBLENBQUEsQ0FBQSxFQUFBLENBQUE7QUFBQSxTQUFBLGdCQUFBLENBQUEsSUFBQSxlQUFBLEdBQUEsTUFBQSxDQUFBLGNBQUEsR0FBQSxNQUFBLENBQUEsY0FBQSxDQUFBLElBQUEsY0FBQSxnQkFBQSxDQUFBLFdBQUEsQ0FBQSxDQUFBLFNBQUEsSUFBQSxNQUFBLENBQUEsY0FBQSxDQUFBLENBQUEsYUFBQSxlQUFBLENBQUEsQ0FBQSxLQWxCdEM7QUFDQTtBQUNBO0FBQ0Esd05BSEEsQ0FLQTtB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RUFBRSxNQUFNO0VBQ2hCLGtCQUFrQixFQUFFLE1BQU07RUFDMUIsZ0JBQWdCLEVBQUU7QUFDcEIsQ0FBQztBQUVELElBQU0sYUFBYSxHQUFBLE9BQUEsQ0FBQSxhQUFBLEdBQUcsU0FBaEIsYUFBYSxDQUFJLEdBQUcsRUFBSztFQUM3QixHQUFHLENBQUMsS0FBSyxDQUFDLGVBQWUsR0FBRyxPQUFPLENBQUMsVUFBVTtBQUNoRCxDQUFDO0FBRUQsSUFBTSxlQUFlLEdBQUEsT0FBQSxDQUFBLGVBQUEsR0FBRyxTQUFsQixlQUFlLENBQUksR0FBRyxFQUFLO0VBQy9CLEdBQUcsQ0FBQyxLQUFLLENBQUMsZUFBZSxHQUFHLE9BQU8sQ0FBQyxrQkFBa0I7QUFDeEQsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImltcG9ydCB7IHVuc2VsZWN0ZWRTdHlsZSB9IGZyb20gJy4vc3R5bGVzLmpzJztcblxuLyoqXG4gKiBBZGRzIDEgdG8gdGhlIG1vbnRoIGluIGEgZ2l2ZW4gZGF0ZSB0byBtYWtlIGl0IG1vcmUgaHVtYW4tcmVhZGFibGUuXG4gKiBAcGFyYW0ge3N0cmluZ30gZGF0ZSAtIFRoZSBkYXRlIGluIHRoZSBmb3JtYXQgJ1lZWVktTU0tREQnIG9yICdZWVlZLU0tRCcuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSAtIFRoZSBtb2RpZmllZCBkYXRlIGluIHRoZSBmb3JtYXQgJ1lZWVktTU0tREQnLlxuICogQHRocm93cyB7RXJyb3J9IC0gSWYgdGhlIGRhdGUgcGFyYW1ldGVyIGlzIG5vdCBpbiB0aGUgZm9ybWF0ICdZWVlZLU1NLUREJyBvciAnWVlZWS1NLUQnLlxuICovXG5mdW5jdGlvbiBodW1hbkRhdGUgKGRhdGUpIHtcbiAgY29uc3QgZGF0ZVBhcnRzID0gZGF0ZS5zcGxpdCgnLScpO1xuICBjb25zdCBtb250aCA9IHBhcnNlSW50KGRhdGVQYXJ0c1sxXSkgKyAxO1xuICBjb25zdCBkYXkgPSBwYXJzZUludChkYXRlUGFydHNbMl0pO1xuICBjb25zdCBtb2RpZmllZE1vbnRoID0gbW9udGggPCAxMCA/IGAwJHttb250aH1gIDogbW9udGg7XG4gIGNvbnN0IG1vZGlmaWVkRGF5ID0gZGF5IDwgMTAgPyBgMCR7ZGF5fWAgOiBkYXk7XG4gIGNvbnN0IG1vZGlmaWVkRGF0ZSA9IGAke2RhdGVQYXJ0c1swXX0tJHttb2RpZmllZE1vbnRofS0ke21vZGlmaWVkRGF5fWA7XG4gIHJldHVybiBtb2RpZmllZERhdGU7XG59XG5cbi8qKlxuICogQ29udmVydHMgYSBodW1hbiBkYXRlIHN0cmluZyB0byBVVEMgdGltZXN0YW1wLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBodW1hbmRhdGUgLSBUaGUgaHVtYW4tcmVhZGFibGUgZGF0ZSBzdHJpbmcgaW4gdGhlIGZvcm1hdCBcIllZWVktTU0tRERcIi5cbiAqIEByZXR1cm4ge251bWJlcn0gLSBUaGUgVVRDIHRpbWVzdGFtcCBpbiBtaWxsaXNlY29uZHMuXG4gKi9cbmZ1bmN0aW9uIGh1bWFuZGF0ZVRvVVRDIChodW1hbmRhdGUpIHtcbiAgbGV0IGludHMgPSBodW1hbmRhdGUuc3BsaXQoJy0nKTtcbiAgaW50cyA9IGludHMubWFwKChpbnQpID0+IHBhcnNlSW50KGludCkpO1xuICBpbnRzWzFdID0gaW50c1sxXSAtIDE7XG4gIHJldHVybiBEYXRlLlVUQyhpbnRzWzBdLCBpbnRzWzFdLCBpbnRzWzJdKTtcbn1cblxuLy8gbW9kZWwgb2JqZWN0XG5jb25zdCBkYXRlT2JqZWN0VGVtcGxhdGUgPSB7IGRheTogJ2RheScsIGh1bWFuZGF0ZTogJ1lZWVktTU0tREQnLCBpbmRleDogJzAnLCBVVEM6IDE2OTgyNzg0MDAwMDAgfTtcbi8qKlxuICogQ3JlYXRlcyBhIHN0YW5kYXJkIGRhdGUgb2JqZWN0IHdpdGggdGhlIGdpdmVuIGRhdGUuXG4gKlxuICogQHBhcmFtIHthbnl9IGRhdGUgLSBJcyBhIHN0cmluZyBZWVlZLU1NLUREIG1vbnRocyBhcmUgY291bnRlZCBmcm9tIDAuXG4gKiBAcmV0dXJuIHtvYmplY3R9IFRoZSBzdGFuZGFyZCBkYXRlIG9iamVjdCB3aXRoIHRoZSBnaXZlbiBkYXRlLlxuICovXG5mdW5jdGlvbiBzdGFuZGFyZERhdGVPYmplY3QgKGRhdGUpIHtcbiAgY29uc3Qgb2JqID0gT2JqZWN0LmNyZWF0ZShkYXRlT2JqZWN0VGVtcGxhdGUpO1xuICBvYmouZGF5ID0gZGF0ZS5kYXRhc2V0LmRheTtcbiAgb2JqLmh1bWFuZGF0ZSA9IGRhdGUuZGF0YXNldC5odW1hbmRhdGU7XG4gIG9iai5pbmRleCA9IGRhdGUuZGF0YXNldC5kYXlpbmRleDtcbiAgb2JqLlVUQyA9IGh1bWFuZGF0ZVRvVVRDKGRhdGUuZGF0YXNldC5odW1hbmRhdGUpO1xuICByZXR1cm4gb2JqO1xufVxuXG4vKipcbiAqIENhbGN1bGF0ZXMgdGhlIHRpbWUgdmFsdWUgaW4gbWlsbGlzZWNvbmRzIGJhc2VkIG9uIHRoZSBnaXZlbiB0aW1lLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB0aW1lIC0gVGhlIHRpbWUgaW4gdGhlIGZvcm1hdCBcIkhIOk1NXCIuXG4gKiBAcmV0dXJuIHtudW1iZXJ9IFRoZSB0aW1lIHZhbHVlIGluIG1pbGxpc2Vjb25kcy5cbiAqXG4gKiBAaGFzVGVzdHNcbiAqXG4gKiBAZXhhbXBsZVxuICogLy8gRXhhbXBsZSB1c2FnZTpcbiAqIGNvbnN0IHRpbWVWYWx1ZSA9IHRpbWVWYWx1ZUluTWlsbCgnMTI6MzAnKTtcbiAqL1xuXG5mdW5jdGlvbiB0aW1lVmFsdWVJbk1pbGwgKHRpbWUpIHtcbiAgaWYgKCF0aW1lLmluY2x1ZGVzKCc6JykpIHtcbiAgICBjb25zdCBlID0gbmV3IEVycm9yKCdFeHBlY3RzIGEgdGltZSBzdHJpbmcgSEg6TU0nKTtcbiAgICB0aHJvdyBlO1xuICB9XG4gIGNvbnN0IFtob3VycywgbWludXRlc10gPSB0aW1lLnNwbGl0KCc6Jyk7XG4gIHJldHVybiAocGFyc2VJbnQoaG91cnMpICogNjAgKiA2MCAqIDEwMDApICsgKHBhcnNlSW50KG1pbnV0ZXMpICogNjAgKiAxMDAwKTtcbn1cblxuLyoqXG4gKiBldERheXNJbk1vbnRoIC0gR2V0IG51bWJlciBvZiBkYXlzIGluIG1vbnRoXG4gKlxuICogQHBhcmFtICB7IW51bWJlcn0gbW9udGggVGhlIG51bWJlciBvZiB0aGUgY29ycmVzcG9uZGluZyBtb250aC5cbiAqIEBwYXJhbSAgeyFudW1iZXJ9IHllYXIgIFRoZSBjb3JyZXNwb25kaW5nIHllYXIuXG4gKiBAcmV0dXJuIHtudW1iZXJ9IFJldHVybnMgYSBudW1iZXIgY29ycmVzcG9uZGluZyB0byB0aGUgbnVtYmVyIG9mIGRheXMgZm9yIHRoZSBkYXRlIGluIHBvaW50LlxuICovXG5mdW5jdGlvbiBnZXREYXlzSW5Nb250aCAobW9udGgsIHllYXIpIHtcbiAgcmV0dXJuIG5ldyBEYXRlKHllYXIsIG1vbnRoLCAwKS5nZXREYXRlKCk7XG59XG5cbi8qKlxuICogQ2xlYXJzIHRoZSBzZWxlY3Rpb24gaW4gdGhlIGNhbGVuZGFyIGJ5IHJlbW92aW5nIHRoZSBzZWxlY3RlZCBkYXRlcyBhbmRcbiAqIHJlc2V0dGluZyB0aGUgZHluYW1pYyBkYXRhLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBjYWxlbmRhciAtIFRoZSBjYWxlbmRhciBjb21wb25lbnQuXG4gKiBAcGFyYW0ge09iamVjdH0gZHluYW1pY0RhdGEgLSBUaGUgZHluYW1pYyBkYXRhIG9iamVjdC5cbiAqIEByZXR1cm4ge3VuZGVmaW5lZH0gVGhpcyBmdW5jdGlvbiBkb2VzIG5vdCByZXR1cm4gYSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gY2xlYXJTZWxlY3Rpb24gKGNhbGVuZGFyLCBkeW5hbWljRGF0YSkge1xuICBjb25zdCBkYXRlc09ialN0b3JlID0gZHluYW1pY0RhdGEuZGF0ZXNTZWxlY3RlZEFycmF5T2JqZWN0cztcbiAgY29uc3QgZGF0ZXNJbmRleCA9IGR5bmFtaWNEYXRhLmRhdGVzU2VsZWN0ZWRBcnJheTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGVzT2JqU3RvcmUubGVuZ3RoOyBpKyspIHtcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IGRhdGVzSW5kZXgubGVuZ3RoOyBqKyspIHtcbiAgICAgIGRhdGVzSW5kZXhbal0uZm9yRWFjaCgoZGF0ZSkgPT4ge1xuICAgICAgICBjb25zdCBkYXRlRGl2ID0gY2FsZW5kYXIucXVlcnlTZWxlY3RvcihgW2RhdGEtaHVtYW5kYXRlPScke2RhdGV9J11gKTtcbiAgICAgICAgdW5zZWxlY3RlZFN0eWxlKGRhdGVEaXYpO1xuICAgICAgICB3aGlsZSAoZGF0ZURpdi5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgZGF0ZURpdi5yZW1vdmVDaGlsZChkYXRlRGl2Lmxhc3RDaGlsZCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGkgPT09IGRhdGVzT2JqU3RvcmUubGVuZ3RoIC0gMSAmJiBqID09PSBkYXRlc0luZGV4Lmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICBkYXRlc09ialN0b3JlLmxlbmd0aCA9IDA7XG4gICAgICAgICAgZGF0ZXNJbmRleC5sZW5ndGggPSAwO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBAcGFyYW0ge251bWJlcn0gW2xlbmd0aD0xMF0gLWxlbmd0aCB0aGUgZGVzaXJlZCBsZW5ndGggb2YgdGhlIHN0cmluZyBvZiBudW1iZXJzLlxuICogQHJldHVybnMgYSBzdHJpbmcgb2YgcmFuZG9tIGRpZ2l0cyBvZiBhIHNwZWNpZmllZCBsZW5ndGguXG4gKi9cblxuZnVuY3Rpb24gcmFuZG9tQnl0ZXMgKGxlbmd0aCkge1xuICBpZiAobGVuZ3RoID4gODApIHtcbiAgICBjb25zdCBlID0gbmV3IEVycm9yKCdyYW5kb21CeXRlcyBsZW5ndGggY2FuIGJlIG1vcmUgdGhhbiA4MDAgZGlnaXRzJyk7XG4gICAgdGhyb3cgZTtcbiAgfVxuICBjb25zdCBhcnJheSA9IG5ldyBVaW50MzJBcnJheSgxMDApO1xuICB3aW5kb3cuY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhhcnJheSk7XG4gIGxldCBzdCA9ICcnO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgc3QgKz0gYXJyYXlbaV07XG4gICAgaWYgKGkgPT09IGFycmF5Lmxlbmd0aCAtIDEpIHtcbiAgICAgIHJldHVybiBzdC5zbGljZShzdC5sZW5ndGggLSAobGVuZ3RoIHx8IDEwKSk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHByb3h5VG9QbGFpbk9iamVjdEhlbHBlciAocHJveHkpIHtcbiAgaWYgKEFycmF5LmlzQXJyYXkocHJveHkpKSB7XG4gICAgLy8gSWYgaXQncyBhbiBhcnJheSwgbWFwIG92ZXIgdGhlIGFycmF5IGFuZCBjb252ZXJ0IGVhY2ggZWxlbWVudCByZWN1cnNpdmVseVxuICAgIHJldHVybiBwcm94eS5tYXAocHJveHlUb1BsYWluT2JqZWN0SGVscGVyKTtcbiAgfSBlbHNlIGlmIChwcm94eSAhPT0gbnVsbCAmJiB0eXBlb2YgcHJveHkgPT09ICdvYmplY3QnKSB7XG4gICAgLy8gSWYgaXQncyBhbiBvYmplY3QgKGFuZCBub3QgbnVsbCksIHJlY3Vyc2l2ZWx5IGNvbnZlcnQgZWFjaCBwcm9wZXJ0eVxuICAgIGNvbnN0IHBsYWluT2JqZWN0ID0ge307XG4gICAgZm9yIChjb25zdCBrZXkgaW4gcHJveHkpIHtcbiAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocHJveHksIGtleSkpIHtcbiAgICAgICAgcGxhaW5PYmplY3Rba2V5XSA9IHByb3h5VG9QbGFpbk9iamVjdEhlbHBlcihwcm94eVtrZXldKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHBsYWluT2JqZWN0O1xuICB9IGVsc2Uge1xuICAgIC8vIEZvciBwcmltaXRpdmUgdmFsdWVzIChudW1iZXJzLCBzdHJpbmdzLCBldGMuKSwganVzdCByZXR1cm4gdGhlIHZhbHVlXG4gICAgcmV0dXJuIHByb3h5O1xuICB9XG59XG5cbmZ1bmN0aW9uIGdlbmVyYXRlUmFuZG9tU3RyaW5nICgpIHtcbiAgY29uc3QgcmFuZG9tU3RyaW5nID0gcmFuZG9tQnl0ZXMoMTApO1xuICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2NhbGVuZGFyLScgKyByYW5kb21TdHJpbmcpKSB7XG4gICAgcmV0dXJuIGdlbmVyYXRlUmFuZG9tU3RyaW5nKCk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHJhbmRvbVN0cmluZztcbiAgfVxufVxuXG4vLyBXRSBXRVJFIFNFVFRJTkcgVVAgVEhFIENBTEVOREFSIFRPIFJFTkRFUiBEQVRFUyBJTiBUSEUgUEFTVDpcbi8qIFdhcm5pbmc6IENvbnRlbXBsYXRlcyBkYXlsaWdodCBzYXZpbmcgdGltZSAqL1xuXG4vKipcbiAqIENhbGN1bGF0ZXMgYW5kIHJldHVybnMgdGhlIGVhcmxpZXN0IGRhdGUgZnJvbSBhIGdpdmVuIGFycmF5IG9mIHByZWxvYWRlZCBkYXRlcy5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBwcmVsb2FkZWREYXRlcyAtIEFuIGFycmF5IG9mIHByZWxvYWRlZCBkYXRlcy5cbiAqIEByZXR1cm4ge0RhdGV9IFRoZSBlYXJsaWVzdCBkYXRlIGZyb20gdGhlIHByZWxvYWRlZCBkYXRlcy5cbiAqL1xuZnVuY3Rpb24gZ2V0RWFybGllc3REYXRlIChwcmVsb2FkZWREYXRlcykge1xuICBjb25zdCBvcmRlciA9IFtdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHByZWxvYWRlZERhdGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKGkgPT09IDApIHtcbiAgICAgIG9yZGVyLnB1c2gobmV3IERhdGUoKS5nZXRUaW1lKCkpO1xuICAgIH1cbiAgICBvcmRlci5wdXNoKG5ldyBEYXRlKHByZWxvYWRlZERhdGVzW2ldKS5nZXRUaW1lKCkpO1xuICAgIGlmIChpID09PSBwcmVsb2FkZWREYXRlcy5sZW5ndGggLSAxKSB7XG4gICAgICBvcmRlci5zb3J0KCk7XG4gICAgICBjb25zdCBkID0gbmV3IERhdGUob3JkZXJbMF0pO1xuICAgICAgcmV0dXJuIGQ7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogR2VuZXJhdGVzIGEgZnVuY3Rpb24gY29tbWVudCBmb3IgdGhlIGdpdmVuIGZ1bmN0aW9uIGJvZHkgaW4gYSBtYXJrZG93blxuICogY29kZSBibG9jayB3aXRoIHRoZSBjb3JyZWN0IGxhbmd1YWdlIHN5bnRheC5cbiAqXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBjYWxlbmRhciAtIFRoZSBjYWxlbmRhciBjb21wb25lbnQuXG4gKiBAcGFyYW0ge0FycmF5fSBkYXRlc09wZW4gLSBBbiBhcnJheSBvZiBvcGVuIGRhdGVzLlxuICovXG5mdW5jdGlvbiBibG9ja0RheXNOb3RPcGVuIChjYWxlbmRhciwgZGF0ZXNPcGVuKSB7XG4gIGlmIChjYWxlbmRhciAmJiBkYXRlc09wZW4pIHtcbiAgICBjb25zdCBhbGxEYXlzID0gQXJyYXkuZnJvbShjYWxlbmRhci5xdWVyeVNlbGVjdG9yQWxsKCcuZGF5VGltZScpKS5tYXAoKGVsKSA9PiB7IHJldHVybiBlbC5kYXRhc2V0Lmh1bWFuZGF0ZTsgfSk7XG4gICAgY29uc3Qgb3BlbkRheXMgPSBkYXRlc09wZW4ubWFwKChlbCkgPT4geyByZXR1cm4gZWwuZGF5OyB9KTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYWxsRGF5cy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKG9wZW5EYXlzLmluZGV4T2YoYWxsRGF5c1tpXSkgPT09IC0xKSB7XG4gICAgICAgIGNvbnN0IGRheSA9IGNhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoYFtpZD1cIiR7YWxsRGF5c1tpXX1cIl1gKTtcbiAgICAgICAgLy8gZGF5LmNsYXNzTGlzdC5hZGQoJ3dpZHRoU2hhcGUnLCAnZmlsbGVyJyk7XG4gICAgICAgIGRheS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAnd2hpdGUnO1xuICAgICAgICBkYXkudGl0bGUgPSAnQ2xvc2VkIG9uIHRoaXMgZGF5JztcblxuICAgICAgICBjb25zdCBjbG9zZWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgICAgIGNsb3NlZC5jbGFzc0xpc3QuYWRkKCdjYWxlbmRhclRpbWUnKTtcbiAgICAgICAgY2xvc2VkLnRleHRDb250ZW50ID0gJ2Nsb3NlZCc7XG5cbiAgICAgICAgZGF5LmFwcGVuZENoaWxkKGNsb3NlZCk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHNvcnRUaW1lcyAodmFsKSB7XG4gIGNvbnN0IHNvcnRlZCA9IFtdO1xuICByZXR1cm4gZW51bWVyYXRlKHZhbCk7XG5cbiAgZnVuY3Rpb24gc29ydE51bWJlciAoYSwgYikge1xuICAgIHJldHVybiBhIC0gYjtcbiAgfVxuXG4gIGZ1bmN0aW9uIGVudW1lcmF0ZSAodmFsdWVzKSB7XG4gICAgY29uc3QgbnVtZXJpY2FsRXF1aXZhbGVudCA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdmFsdWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBudW1lcmljYWxFcXVpdmFsZW50LnB1c2godGltZVZhbHVlSW5NaWxsKHZhbHVlc1tpXSkpO1xuICAgICAgaWYgKGkgPT09IHZhbHVlcy5sZW5ndGggLSAxKSB7XG4gICAgICAgIHJldHVybiBzb3J0KHZhbHVlcywgbnVtZXJpY2FsRXF1aXZhbGVudCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gc29ydCAodmFsdWVzLCBudW1lcmljYWxFcXVpdmFsZW50KSB7XG4gICAgY29uc3QgbnVtZXJpY2FsRXF1aXZhbGVudENsb25lID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShudW1lcmljYWxFcXVpdmFsZW50KSk7XG4gICAgY29uc3Qgc29ydGVkSW50ID0gbnVtZXJpY2FsRXF1aXZhbGVudC5zb3J0KHNvcnROdW1iZXIpO1xuICAgIGZvciAobGV0IHAgPSAwOyBwIDwgbnVtZXJpY2FsRXF1aXZhbGVudENsb25lLmxlbmd0aDsgcCsrKSB7XG4gICAgICBjb25zdCBuZXdJbmRleCA9IHNvcnRlZEludC5pbmRleE9mKG51bWVyaWNhbEVxdWl2YWxlbnRDbG9uZVtwXSk7XG4gICAgICBzb3J0ZWQuc3BsaWNlKHAsIDEsIHZhbHVlc1tuZXdJbmRleF0pO1xuICAgICAgaWYgKHAgPT09IG51bWVyaWNhbEVxdWl2YWxlbnQubGVuZ3RoIC0gMSkge1xuICAgICAgICByZXR1cm4gc29ydGVkO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIENoZWNrcyBmb3Igb3ZlcmxhcCBpbiBhbiBhcnJheSBvZiB2YWx1ZXMuXG4gKlxuICogQHBhcmFtIHtBcnJheX0gdmFsdWVzIC0gVGhlIGFycmF5IG9mIHZhbHVlcyB0byBjaGVjayBmb3Igb3ZlcmxhcC5cbiAqIEByZXR1cm4ge2Jvb2xlYW59IC0gUmV0dXJucyB0cnVlIGlmIG92ZXJsYXAgaXMgZm91bmQsIGZhbHNlIG90aGVyd2lzZS5cbiAqIEBAZGVzY3JpcHRpb24gbm90IGNhbGxlZCBhbnl3aGVyZSAoeWV0KVxuICovXG5mdW5jdGlvbiBjaGVja092ZXJsYXAgKHZhbHVlcykge1xuICBjb25zdCBudW1lcmljYWxFcXVpdmFsZW50ID0gdmFsdWVzLm1hcCh0aW1lVmFsdWVJbk1pbGwpO1xuXG4gIGZvciAobGV0IGN1cnJlbnRJbmRleCA9IDI7IGN1cnJlbnRJbmRleCA8IG51bWVyaWNhbEVxdWl2YWxlbnQubGVuZ3RoOyBjdXJyZW50SW5kZXggKz0gMikge1xuICAgIGNvbnN0IGN1cnJlbnRTdGFydCA9IG51bWVyaWNhbEVxdWl2YWxlbnRbY3VycmVudEluZGV4XTtcbiAgICBjb25zdCBjdXJyZW50RW5kID0gbnVtZXJpY2FsRXF1aXZhbGVudFtjdXJyZW50SW5kZXggKyAxXTtcblxuICAgIGZvciAobGV0IGNvbXBhcmlzb25JbmRleCA9IDA7IGNvbXBhcmlzb25JbmRleCA8IG51bWVyaWNhbEVxdWl2YWxlbnQubGVuZ3RoOyBjb21wYXJpc29uSW5kZXggKz0gMikge1xuICAgICAgaWYgKGN1cnJlbnRJbmRleCAhPT0gY29tcGFyaXNvbkluZGV4KSB7XG4gICAgICAgIGNvbnN0IGNvbXBhcmlzb25TdGFydCA9IG51bWVyaWNhbEVxdWl2YWxlbnRbY29tcGFyaXNvbkluZGV4XTtcbiAgICAgICAgY29uc3QgY29tcGFyaXNvbkVuZCA9IG51bWVyaWNhbEVxdWl2YWxlbnRbY29tcGFyaXNvbkluZGV4ICsgMV07XG5cbiAgICAgICAgaWYgKGNvbXBhcmlzb25FbmQgPj0gY3VycmVudFN0YXJ0ICYmIGNvbXBhcmlzb25FbmQgPD0gY3VycmVudEVuZCkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGVsc2UgaWYgKGN1cnJlbnRTdGFydCA+PSBjb21wYXJpc29uU3RhcnQgJiYgY3VycmVudEVuZCA8PSBjb21wYXJpc29uRW5kKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gZWxzZSBpZiAoY3VycmVudFN0YXJ0ID09PSBjb21wYXJpc29uU3RhcnQgJiYgY3VycmVudEVuZCA9PT0gY29tcGFyaXNvbkVuZCkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGVsc2UgaWYgKGN1cnJlbnRFbmQgPj0gY29tcGFyaXNvblN0YXJ0ICYmIGN1cnJlbnRFbmQgPD0gY29tcGFyaXNvbkVuZCkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIGRlYm91bmNlIChmbiwgZGVsYXkpIHtcbiAgbGV0IHRpbWVyO1xuICByZXR1cm4gZnVuY3Rpb24gKC4uLmFyZ3MpIHtcbiAgICBjbGVhclRpbWVvdXQodGltZXIpO1xuICAgIHRpbWVyID0gc2V0VGltZW91dCgoKSA9PiBmbi5hcHBseSh0aGlzLCBhcmdzKSwgZGVsYXkpO1xuICB9O1xufVxuXG5leHBvcnQge1xuICB0aW1lVmFsdWVJbk1pbGwsIGNoZWNrT3ZlcmxhcCwgY2xlYXJTZWxlY3Rpb24sIGdldERheXNJbk1vbnRoLFxuICBnZW5lcmF0ZVJhbmRvbVN0cmluZywgZ2V0RWFybGllc3REYXRlLCBibG9ja0RheXNOb3RPcGVuLFxuICBzb3J0VGltZXMsIGh1bWFuRGF0ZSwgaHVtYW5kYXRlVG9VVEMsIHN0YW5kYXJkRGF0ZU9iamVjdCxcbiAgcHJveHlUb1BsYWluT2JqZWN0SGVscGVyLCBkZWJvdW5jZVxufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gXCIuY2FsZW5kYXIge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGZsZXgtd3JhcDogd3JhcDtcXG4gIGZsZXgtZGlyZWN0aW9uOiByb3c7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDI0MCwgMjQ4LCAyNTUsIDApO1xcbiAgd2lkdGg6IDEwMCU7XFxuICBoZWlnaHQ6IDI4LjhlbTtcXG4gIG92ZXJmbG93LXk6IGF1dG87XFxuICBwb3NpdGlvbjogcmVsYXRpdmU7XFxuICBjb2xvcjogIzMzMztcXG4gIGZvbnQtZmFtaWx5OiBVYnVudHUsIEFyaWFsLCBIZWx2ZXRpY2EsIHNhbnMtc2VyaWY7XFxuICBmb250LXNpemU6IDEuMmVtO1xcbiAgZm9udC13ZWlnaHQ6IDcwMDtcXG4gIGxpbmUtaGVpZ2h0OiAxLjU7XFxufVxcbi5jYWxlbmRhciAuYmxvY2tlZCB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMzMzO1xcbn1cXG4uY2FsZW5kYXIgLmZpbGxlciB7XFxuICBwb2ludGVyLWV2ZW50czogbm9uZTtcXG4gIG9wYWNpdHk6IDAuMztcXG59XFxuLmNhbGVuZGFyIC5wcmVsb2FkZWQge1xcbiAgYm9yZGVyLWNvbG9yOiBibHVlO1xcbiAgYm9yZGVyLXN0eWxlOiBzb2xpZDtcXG4gIGJvcmRlci13aWR0aDogM3B4O1xcbn1cXG4uY2FsZW5kYXIgLnRpbWVTZWxlY3Qge1xcbiAgcGFkZGluZzogMDtcXG4gIHdpZHRoOiBhdXRvO1xcbiAgbWFyZ2luOiAwO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZjtcXG4gIGZsb2F0OiByaWdodDtcXG4gIGZvbnQtd2VpZ2h0OiA3MDA7XFxuICBmb250LWZhbWlseTogQXJpYWwsIEhlbHZldGljYSwgc2Fucy1zZXJpZjtcXG4gIGJvcmRlci1zdHlsZTogc29saWQ7XFxuICBib3JkZXItcmFkaXVzOiAxZW07XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgYm9yZGVyLXdpZHRoOiAzcHg7XFxuICBib3JkZXItY29sb3I6ICNmMTU5MjU7XFxuICBjb2xvcjogIzAwMDtcXG4gIGZvbnQtc2l6ZTogMC45ZW07XFxufVxcbi5jYWxlbmRhciAudGltZUNvbnQge1xcbiAgbWFyZ2luLWxlZnQ6IGF1dG87XFxuICBtYXgtd2lkdGg6IDIwZW07XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiBhbGljZWJsdWU7XFxuICBib3JkZXItc3R5bGU6IHNvbGlkO1xcbiAgYm9yZGVyLWNvbG9yOiAjZjE1OTI1O1xcbiAgbWFyZ2luLXJpZ2h0OiBhdXRvO1xcbiAgbWFyZ2luLXRvcDogMTBlbTtcXG59XFxuLmNhbGVuZGFyIC5kYXlibG9ja3JvdyB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZmxleC1kaXJlY3Rpb246IHJvdztcXG4gIG1pbi13aWR0aDogMTAwJTtcXG4gIGJhY2tncm91bmQtY29sb3I6IGFsaWNlYmx1ZTtcXG59XFxuLmNhbGVuZGFyIC5jYWxlbmRhclRpbWVQYXJlbnQge1xcbiAgbWFyZ2luOiAwLjFlbTtcXG59XFxuLmNhbGVuZGFyIC5jYWxlbmRhclRpbWVQYXJlbnQgLmNhbGVuZGFyVGltZSB7XFxuICBmb250LXNpemU6IDAuOWVtO1xcbiAgbWFyZ2luLXRvcDogMGVtO1xcbiAgbGluZS1oZWlnaHQ6IDE7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiBhbGljZWJsdWU7XFxuICBjb2xvcjogYmxhY2s7XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICBtYXJnaW46IDBweDtcXG4gIGZvbnQtc2l6ZTogMC44ZW07XFxufVxcbi5jYWxlbmRhciAud2lkdGhTaGFwZURheXMge1xcbiAgd2lkdGg6IDE0LjI4NTcxNDI4NTclO1xcbiAgbWFyZ2luLWxlZnQ6IGF1dG87XFxuICBtYXJnaW4tcmlnaHQ6IGF1dG87XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxufVxcbi5jYWxlbmRhciAud2lkdGhTaGFwZSB7XFxuICB3aWR0aDogMTQuMjg1NzE0Mjg1NyU7XFxuICBtYXJnaW4tbGVmdDogYXV0bztcXG4gIG1hcmdpbi1yaWdodDogYXV0bztcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gIG1pbi1oZWlnaHQ6IDMuNmVtO1xcbiAgbWFyZ2luLWJvdHRvbTogMC4yZW07XFxufVxcbi5jYWxlbmRhciAubW9udGhOYW1lIHtcXG4gIG1hcmdpbjogYXV0bztcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gIGZvbnQtZmFtaWx5OiBVYnVudHU7XFxuICBmb250LXNpemU6IDEuNjFlbTtcXG4gIGJhY2tncm91bmQtY29sb3I6ICMzMzdhYjc7XFxuICBjb2xvcjogI2ZmY2MzMztcXG4gIGZsZXgtYmFzaXM6IDEwMCU7XFxuICBib3JkZXItYm90dG9tLXN0eWxlOiBzb2xpZDtcXG59XFxuLmNhbGVuZGFyIC53ZWVrcm93IHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBmbGV4LXdyYXA6IG5vd3JhcDtcXG4gIGZsZXgtZGlyZWN0aW9uOiByb3c7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmO1xcbiAgZm9udC1mYW1pbHk6IFxcXCJyb2JvdG9cXFwiLCBcXFwiYXJpYWxcXFwiO1xcbn1cXG4uY2FsZW5kYXIgLmRheU5hbWUge1xcbiAgY29sb3I6IGJsYWNrO1xcbiAgZm9udC1mYW1pbHk6IFxcXCJyb2JvdG9cXFwiLCBcXFwiYXJpYWxcXFwiO1xcbiAgZm9udC13ZWlnaHQ6IDYwMDtcXG4gIGJhY2tncm91bmQtY29sb3I6ICNjY2M7XFxufVxcbi5jYWxlbmRhciAubW9udGggPiAqIHtcXG4gIG1hcmdpbi1sZWZ0OiAycHg7XFxuICBtYXJnaW4tcmlnaHQ6IDJweDtcXG59XFxuLmNhbGVuZGFyIC5tb250aCB7XFxuICB3aWR0aDogNTAlO1xcbiAgbWluLXdpZHRoOiAzMDBweDtcXG4gIG1hcmdpbjogYXV0bztcXG59XFxuLmNhbGVuZGFyIC50aW1lQ2hvb3NlciB7XFxuICBwb3NpdGlvbjogc3RhdGljO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogYWxpY2VibHVlO1xcbiAgbWFyZ2luLWxlZnQ6IGF1dG87XFxuICBtYXJnaW4tcmlnaHQ6IGF1dG87XFxufVxcbi5jYWxlbmRhciAudGltZUNvbnRhaW5lciB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbn1cXG4uY2FsZW5kYXIgLnRpbWVDb250YWluZXIgZGl2IHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxufVxcbi5jYWxlbmRhciAudGltZUNob29zZXJNb2RhbCB7XFxuICB6LWluZGV4OiAxO1xcbiAgd2lkdGg6IDEwMCU7XFxuICBoZWlnaHQ6IDEwMCU7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuNCk7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICBtYXJnaW46IDA7XFxuICBwYWRkaW5nOiAwO1xcbiAgYm9yZGVyOiAwO1xcbiAgb3ZlcmZsb3cteDogc2Nyb2xsO1xcbn1cXG4uY2FsZW5kYXIgLmNhbGVuZGFyTGFiZWwge1xcbiAgbWluLXdpZHRoOiAzZW07XFxuICBwYWRkaW5nOiAwZW0gMWVtIDBlbSAxZW07XFxuICBjb2xvcjogYmxhY2s7XFxuICBmb250LWZhbWlseTogXFxcInJvYm90b1xcXCIsIFxcXCJhcmlhbFxcXCI7XFxuICBmb250LXdlaWdodDogNjAwO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogI2NjYztcXG4gIG1hcmdpbjogMWVtIDAgMWVtIDA7XFxufVxcbi5jYWxlbmRhciAuZGVsZXRlRGl2IHtcXG4gIGZvbnQtZmFtaWx5OiBVYnVudHU7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMzM3YWI3O1xcbiAgY29sb3I6ICNmZmNjMzM7XFxuICBib3JkZXItYm90dG9tLXN0eWxlOiBzb2xpZDtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxufVxcbi5jYWxlbmRhciAuZGVsZXRlQnV0dG9uIHtcXG4gIGJhY2tncm91bmQtY29sb3I6IHdoaXRlO1xcbiAgY29sb3I6ICNmMTU5MjU7XFxuICBmbG9hdDogcmlnaHQ7XFxuICBmb250LXdlaWdodDogNzAwO1xcbiAgZm9udC1mYW1pbHk6IEFyaWFsLCBIZWx2ZXRpY2EsIHNhbnMtc2VyaWY7XFxuICBib3JkZXItc3R5bGU6IHNvbGlkO1xcbiAgYm9yZGVyLXJhZGl1czogMmVtO1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgaGVpZ2h0OiAyZW07XFxuICB3aWR0aDogMmVtO1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gIG1hcmdpbjogMCAwLjVlbTtcXG4gIGZvbnQtc2l6ZTogMS41ZW07XFxufVxcbi5jYWxlbmRhciAuaW5uZXJTcGFuRGVsZXRlQnRuIHtcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG59XFxuLmNhbGVuZGFyIC5kZWxldGVCdXR0b246aG92ZXIsXFxuLmNhbGVuZGFyIC5kZWxldGVCdXR0b246Zm9jdXMsXFxuLmNhbGVuZGFyIC50aW1lU2VsZWN0OmhvdmVyLFxcbi5jYWxlbmRhciAudGltZVNlbGVjdDpmb2N1cyB7XFxuICBjb2xvcjogIzAwMDtcXG4gIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcXG4gIGN1cnNvcjogcG9pbnRlcjtcXG59XFxuLmNhbGVuZGFyIC5ob3VyIHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuICB3aWR0aDogMTBlbTtcXG59XFxuLmNhbGVuZGFyIC50aW1lU2VsZWN0UCB7XFxuICBkaXNwbGF5OiBpbmxpbmU7XFxuICB3aWR0aDogNWVtO1xcbiAgY29sb3I6ICMwMDA7XFxufVxcbi5jYWxlbmRhciAudGltZUNob29zZXIgPiBpbnB1dFt0eXBlPWNoZWNrYm94XSB7XFxuICBvdXRsaW5lOiAjZjE1OTI1O1xcbiAgb3V0bGluZS1zdHlsZTogc29saWQ7XFxufVxcbi5jYWxlbmRhciAudGltZVNlbGVjdCA+IG9wdGlvbiB7XFxuICBjb2xvcjogIzAwMDtcXG59XFxuLmNhbGVuZGFyIC5jYWxlbmRhciA+IHAsXFxuLmNhbGVuZGFyIGg0LFxcbi5jYWxlbmRhciBoMyxcXG4uY2FsZW5kYXIgaDIsXFxuLmNhbGVuZGFyIGgxLFxcbi5jYWxlbmRhciBzZWxlY3QsXFxuLmNhbGVuZGFyIG9wdGlvbiB7XFxuICBjb2xvcjogIzAwMDtcXG59XFxuLmNhbGVuZGFyIC5hcnJvdy11cCB7XFxuICB3aWR0aDogMDtcXG4gIGhlaWdodDogMDtcXG4gIGJvcmRlci1sZWZ0OiAxMHB4IHNvbGlkIHRyYW5zcGFyZW50O1xcbiAgYm9yZGVyLXJpZ2h0OiAxMHB4IHNvbGlkIHRyYW5zcGFyZW50O1xcbiAgYm9yZGVyLWJvdHRvbTogMTBweCBzb2xpZCBibGFjaztcXG59XFxuLmNhbGVuZGFyIC5hcnJvdy1kb3duIHtcXG4gIHdpZHRoOiAwO1xcbiAgaGVpZ2h0OiAwO1xcbiAgYm9yZGVyLWxlZnQ6IDEwcHggc29saWQgdHJhbnNwYXJlbnQ7XFxuICBib3JkZXItcmlnaHQ6IDEwcHggc29saWQgdHJhbnNwYXJlbnQ7XFxuICBib3JkZXItdG9wOiAxMHB4IHNvbGlkICMwMDA7XFxufVxcbi5jYWxlbmRhciAuYXJyb3dzIHtcXG4gIGZsb2F0OiByaWdodDtcXG4gIGNsZWFyOiByaWdodDtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gIGN1cnNvcjogcG9pbnRlcjtcXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxufVxcbi5jYWxlbmRhciAuYXJyb3ctcmlnaHQge1xcbiAgd2lkdGg6IDA7XFxuICBoZWlnaHQ6IDA7XFxuICBib3JkZXItdG9wOiA2MHB4IHNvbGlkIHRyYW5zcGFyZW50O1xcbiAgYm9yZGVyLWJvdHRvbTogNjBweCBzb2xpZCB0cmFuc3BhcmVudDtcXG4gIGJvcmRlci1sZWZ0OiA2MHB4IHNvbGlkIGdyZWVuO1xcbn1cXG4uY2FsZW5kYXIgLmFycm93LWxlZnQge1xcbiAgd2lkdGg6IDA7XFxuICBoZWlnaHQ6IDA7XFxuICBib3JkZXItdG9wOiAxMHB4IHNvbGlkIHRyYW5zcGFyZW50O1xcbiAgYm9yZGVyLWJvdHRvbTogMTBweCBzb2xpZCB0cmFuc3BhcmVudDtcXG4gIGJvcmRlci1yaWdodDogMTBweCBzb2xpZCBibHVlO1xcbn1cXG4uY2FsZW5kYXIgLmRheVRpbWUge1xcbiAgY3Vyc29yOiBwb2ludGVyO1xcbn1cXG4uY2FsZW5kYXIgLmRheVRpbWUgPiAqIHtcXG4gIHBvaW50ZXItZXZlbnRzOiBub25lO1xcbn1cXG5cIjsiLCIvKipcbiAqIEB0eXBlZGVmIHtPYmplY3R9IEhhc1Rlc3RzVGFnXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IGhhc1Rlc3RzIC0gSW5kaWNhdGVzIHdoZXRoZXIgdGhlIGZ1bmN0aW9uIGhhcyB0ZXN0cy5cbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHtPYmplY3R9IGhhc1RoZXNlU3R5bGVzXG4gKiBAcHJvcGVydHkge3N0cmluZ30gaGFzVGhlc2VTdHlsZXMgLSBMaXN0cyBzdHlsZXMgcmVmZXJlbmNlcyBpbiBhIGZ1bmN0aW9uXG4gKi9cblxuaW1wb3J0IHtcbiAgZ2V0RGF5c0luTW9udGgsIGdlbmVyYXRlUmFuZG9tU3RyaW5nLCBnZXRFYXJsaWVzdERhdGUsXG4gIGJsb2NrRGF5c05vdE9wZW4sIGNsZWFyU2VsZWN0aW9uLFxuICBodW1hbkRhdGUsIHN0YW5kYXJkRGF0ZU9iamVjdCwgcHJveHlUb1BsYWluT2JqZWN0SGVscGVyLCBkZWJvdW5jZVxufSBmcm9tICcuL2Jhc2ljRnVuY3Rpb25zLmpzJztcbmltcG9ydCB7IEdlbmVyYXRlVGltZUNob29zZXJNb2RhbCB9IGZyb20gJy4vZGlzcGxheVRpbWVDaG9vc2VyTW9kYWwuanMnO1xuaW1wb3J0IHsgY29sb3Vycywgc2VsZWN0ZWRTdHlsZSwgdW5zZWxlY3RlZFN0eWxlIH0gZnJvbSAnLi9zdHlsZXMuanMnO1xuaW1wb3J0IHsgbGFuZ3VhZ2VzIH0gZnJvbSAnLi9sYW5ndWFnZXMuanMnO1xuaW1wb3J0IHN0eWxlIGZyb20gJy4vY2FsZW5kYXJBcHAuY3NzJztcblxuLyoqXG4gKiBBZGRzIHRoZSBzcGVjaWZpZWQgbnVtYmVyIG9mIG1vbnRocyB0byBhIGRhdGUuXG4gKiBAcGFyYW0ge251bWJlcn0gbW9udGhzIC0gVGhlIG51bWJlciBvZiBtb250aHMgdG8gYWRkLlxuICogQHJldHVybnMge0RhdGV9IC0gVGhlIHVwZGF0ZWQgZGF0ZS5cbiAqL1xuRGF0ZS5wcm90b3R5cGUuYWRkTW9udGhzID0gZnVuY3Rpb24gKG1vbnRocykge1xuICBjb25zdCBkYXRlID0gbmV3IERhdGUodGhpcyk7XG4gIGNvbnN0IHllYXJzID0gTWF0aC5mbG9vcihtb250aHMgLyAxMik7XG4gIGNvbnN0IHJlbWFpbmluZ01vbnRocyA9IG1vbnRocyAlIDEyO1xuICBpZiAoeWVhcnMpIHtcbiAgICBkYXRlLnNldEZ1bGxZZWFyKGRhdGUuZ2V0RnVsbFllYXIoKSArIHllYXJzKTtcbiAgfVxuICBpZiAocmVtYWluaW5nTW9udGhzKSB7XG4gICAgZGF0ZS5zZXRNb250aChkYXRlLmdldE1vbnRoKCkgKyByZW1haW5pbmdNb250aHMpO1xuICB9XG4gIHJldHVybiBkYXRlO1xufTtcblxuY3VzdG9tRWxlbWVudHMuZGVmaW5lKCdzd2lmdC1jYWwnLCBjbGFzcyBleHRlbmRzIEhUTUxFbGVtZW50IHtcbiAgY29uc3RydWN0b3IgKCkge1xuICAgIHN1cGVyKCk7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgZnVuY3Rpb24gc3RUb0Jvb2xlYW4gKHN0KSB7XG4gICAgICBpZiAoc3QgPT09ICd0cnVlJykge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdCBjYWxlbmRhciA9IG5ldyBTd2lmdENhbCgpO1xuICAgIGNhbGVuZGFyLmdlbmVyYXRlQ2FsZW5kYXIoXG4gICAgICB7XG4gICAgICAgIHRhcmdldDogc2VsZixcbiAgICAgICAgLy8gZGF0YS1udW1iZXItb2YtbW9udGhzLXRvLWRpc3BsYXkgaHRtbCBjb252ZXJ0cyB0byBudW1iZXJPZk1vbnRoc1RvRGlzcGxheSBKU1xuICAgICAgICBudW1iZXJPZk1vbnRoc1RvRGlzcGxheTogdGhpcy5kYXRhc2V0Lm51bWJlck9mTW9udGhzVG9EaXNwbGF5LFxuICAgICAgICAvLyBkYXRhLWRpc3BsYXktdGltZS1jaG9vc2VyLW1vZGFsXG4gICAgICAgIGRpc3BsYXlUaW1lQ2hvb3Nlck1vZGFsOiBzdFRvQm9vbGVhbih0aGlzLmRhdGFzZXQuZGlzcGxheVRpbWVDaG9vc2VyTW9kYWwpLFxuICAgICAgICAvLyBkYXRhLXNpbmdsZS1kYXRlLWNob2ljZVxuICAgICAgICBzaW5nbGVEYXRlQ2hvaWNlOiBzdFRvQm9vbGVhbih0aGlzLmRhdGFzZXQuc2luZ2xlRGF0ZUNob2ljZSksXG5cbiAgICAgICAgbGFuZ3VhZ2U6IHRoaXMuZGF0YXNldC5sYW5ndWFnZSxcbiAgICAgICAgLy8gZGF0YS1zZWxlY3QtbXVsdGlwbGVcbiAgICAgICAgc2VsZWN0TXVsdGlwbGU6IHRoaXMuZGF0YXNldC5zZWxlY3RNdWx0aXBsZSxcblxuICAgICAgICBwcmVsb2FkZWREYXRlczogKHRoaXMuZGF0YXNldC5wcmVsb2FkZWREYXRlcykgPyBKU09OLnBhcnNlKHRoaXMuZGF0YXNldC5wcmVsb2FkZWREYXRlcykgOiBmYWxzZSxcblxuICAgICAgICBwcmVsb2FkZWRUb29sdGlwOiB0aGlzLmRhdGFzZXQucHJlbG9hZGVkVG9vbHRpcCxcblxuICAgICAgICBibG9ja0RheXNPZldlZWs6ICh0aGlzLmRhdGFzZXQuYmxvY2tEYXlzT2ZXZWVrKSA/IEpTT04ucGFyc2UodGhpcy5kYXRhc2V0LmJsb2NrRGF5c09mV2VlaykgOiBmYWxzZSxcbiAgICAgICAgLy8gZGF0YS1zdGFydC1kYXRlPVwiMjAxOS0wMS0wMVwiXG4gICAgICAgIHN0YXJ0RGF0ZTogdGhpcy5kYXRhc2V0LnN0YXJ0RGF0ZVxuXG4gICAgICB9KTtcblxuICAgIHRoaXMuZHluYW1pY0RhdGEgPSBjYWxlbmRhci5yZXR1cm5EeW5hbWljRGF0YSgpO1xuICB9XG59KTtcblxuZnVuY3Rpb24gU3dpZnRDYWwgKCkge1xuICBsZXQgdGltZUNob29zZXI7XG4gIGNvbnN0IGNvbmZpZyA9IHt9O1xuXG4gIGNvbnN0IGhhbmRsZXIgPSB7XG4gICAgZ2V0OiAodGFyZ2V0LCBrZXkpID0+IHtcbiAgICAgIGlmICh0eXBlb2YgdGFyZ2V0W2tleV0gPT09ICdvYmplY3QnICYmIHRhcmdldFtrZXldICE9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJveHkodGFyZ2V0W2tleV0sIGhhbmRsZXIpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGFyZ2V0W2tleV07XG4gICAgfSxcbiAgICBzZXQ6ICh0YXJnZXQsIHByb3AsIHZhbHVlKSA9PiB7XG4gICAgICBpZiAodGFyZ2V0W3Byb3BdID09PSB2YWx1ZSkgcmV0dXJuIHRydWU7XG4gICAgICB0YXJnZXRbcHJvcF0gPSB2YWx1ZTtcbiAgICAgIGVtaXREYXRlU2VsZWN0ZWRFdmVudCgpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IGRhdGFUZW1wbGF0ZSA9IHtcbiAgICBkYXRlc1NlbGVjdGVkQXJyYXk6IFtdLFxuICAgIGRhdGVzU2VsZWN0ZWRBcnJheU9iamVjdHM6IFtdLFxuICAgIGRpc2FibGVkOiBmYWxzZVxuICB9O1xuXG4gIGNvbnN0IGR5bmFtaWNEYXRhID0gbmV3IFByb3h5KGRhdGFUZW1wbGF0ZSwgaGFuZGxlcik7XG5cbiAgY29uc3QgZW1pdERhdGVTZWxlY3RlZEV2ZW50ID0gZGVib3VuY2UoKCkgPT4ge1xuICAgIGNvbnN0IGV2dCA9IG5ldyBDdXN0b21FdmVudCgnZGF0ZVNlbGVjdCcsIHtcbiAgICAgIGRldGFpbDogeyBkYXRlOiBwcm94eVRvUGxhaW5PYmplY3RIZWxwZXIoZHluYW1pY0RhdGEpIH1cbiAgICB9KTtcbiAgICBjb25maWcuY2FsZW5kYXJDb250YWluZXIuZGlzcGF0Y2hFdmVudChldnQpO1xuICB9LCAyNTApO1xuXG4gIGNvbnN0IGNhbGVuZGFyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cbiAgdGhpcy5yZXR1cm5DYWxlbmRhciA9ICgpID0+IHtcbiAgICByZXR1cm4gY2FsZW5kYXI7XG4gIH07XG5cbiAgdGhpcy5yZXR1cm5EeW5hbWljRGF0YSA9ICgpID0+IHtcbiAgICByZXR1cm4gZHluYW1pY0RhdGE7XG4gIH07XG5cbiAgdGhpcy5yZXR1cm5Db25maWcgPSAoKSA9PiB7XG4gICAgcmV0dXJuIGNvbmZpZztcbiAgfTtcblxuICB0aGlzLnNldENvbmZpZyA9IChjb25maWdPYmopID0+IHtcbiAgICAvLyBJZiBjYWxsZWQgdmlhIEhUTUxcbiAgICBjb25maWcuY2FsZW5kYXJDb250YWluZXIgPSBjb25maWdPYmoudGFyZ2V0IHx8IGZhbHNlO1xuICAgIC8vIElmIGNhbGxlZCB2aWEgSmF2YXNjcmlwdFxuICAgIGNvbmZpZy5wYXJlbnREaXYgPSAodHlwZW9mIGNvbmZpZ09iai5wYXJlbnREaXYgPT09ICdzdHJpbmcnKSA/IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoY29uZmlnT2JqLnBhcmVudERpdikgOiBjb25maWdPYmoucGFyZW50RGl2O1xuICAgIC8vIGRvbmVcbiAgICBjb25maWcubnVtYmVyT2ZNb250aHNUb0Rpc3BsYXkgPSBjb25maWdPYmoubnVtYmVyT2ZNb250aHNUb0Rpc3BsYXkgfHwgMTI7XG4gICAgLy8gZG9uZVxuICAgIGNvbmZpZy5kaXNwbGF5VGltZUNob29zZXJNb2RhbCA9IGNvbmZpZ09iai5kaXNwbGF5VGltZUNob29zZXJNb2RhbCAmJiB0cnVlO1xuICAgIC8vIGRvbmVcbiAgICBjb25maWcuc2luZ2xlRGF0ZUNob2ljZSA9IGNvbmZpZ09iai5zaW5nbGVEYXRlQ2hvaWNlICYmIHRydWU7XG4gICAgLy8gZG9uZVxuICAgIGNvbmZpZy5zZWxlY3RSYW5nZSA9ICFjb25maWdPYmouc2luZ2xlRGF0ZUNob2ljZTtcbiAgICAvLyBkb25lXG4gICAgY29uZmlnLmxhbmd1YWdlID0gY29uZmlnT2JqLmxhbmd1YWdlIHx8ICdlbkdiJztcbiAgICAvLyBkb25lXG4gICAgY29uZmlnLnNlbGVjdE11bHRpcGxlID0gY29uZmlnLnNlbGVjdE11bHRpcGxlIHx8IGZhbHNlO1xuICAgIC8vIGRvbmVcbiAgICBjb25maWcuZGlzcGxheVRpbWVTZWxlY3Rpb25PbkRhdGUgPSBjb25maWdPYmouZGlzcGxheVRpbWVTZWxlY3Rpb25PbkRhdGUgfHwgdHJ1ZTtcbiAgICAvLyBkb25lXG4gICAgY29uZmlnLnByZWxvYWRlZERhdGVzID0gY29uZmlnT2JqLnByZWxvYWRlZERhdGVzIHx8IGZhbHNlO1xuXG4gICAgY29uZmlnLnByZWxvYWRlZFRvb2x0aXAgPSBjb25maWdPYmoucHJlbG9hZGVkVG9vbHRpcCB8fCBmYWxzZTtcblxuICAgIGNvbmZpZy5ibG9ja0RheXNPZldlZWsgPSBjb25maWdPYmouYmxvY2tEYXlzT2ZXZWVrIHx8IGZhbHNlO1xuXG4gICAgY29uZmlnLmJvb2tEYXlzT2ZXZWVrID0gY29uZmlnT2JqLmJvb2tEYXlzT2ZXZWVrIHx8IGZhbHNlO1xuXG4gICAgY29uZmlnLnN0YXJ0RGF0ZSA9IGNvbmZpZ09iai5zdGFydERhdGUgfHwgZmFsc2U7XG5cbiAgICBjb25maWcuZW5kVXNlciA9IGNvbmZpZ09iai5lbmRVc2VyIHx8IGZhbHNlO1xuICAgIGNvbmZpZy5lbmRVc2VyRHVyYXRpb25DaG9pY2UgPSBjb25maWdPYmouZW5kVXNlckR1cmF0aW9uQ2hvaWNlIHx8IGZhbHNlO1xuICAgIGNvbmZpZy5iYWNrZW5kID0gY29uZmlnT2JqLmJhY2tlbmQgfHwgZmFsc2U7XG4gICAgY29uZmlnLmRpc3BsYXlCbG9ja2VkID0gY29uZmlnT2JqLmRpc3BsYXlCbG9ja2VkIHx8IGZhbHNlO1xuICAgIGNvbmZpZy5kYXRlc09wZW4gPSBjb25maWdPYmouZGF0ZXNPcGVuIHx8IGZhbHNlO1xuXG4gICAgY29uZmlnLmN1c3RvbUNsaWNrRXZlbnQgPSBjb25maWdPYmouY3VzdG9tQ2xpY2tFdmVudCB8fCBmYWxzZTtcbiAgfTtcblxuICB0aGlzLmdlbmVyYXRlQ2FsZW5kYXIgPSAoY29uZmlnT2JqKSA9PiB7XG4gICAgaWYgKGNvbmZpZ09iaikge1xuICAgICAgdGhpcy5zZXRDb25maWcoY29uZmlnT2JqKTtcbiAgICB9XG4gICAgLy8gSWYgY2FsbGVkIHZpYSBqYXZhc2NyaXB0IGEgcGFyZW50RWxlbWVudCBuZWVkcyB0byBiZSBwcm92aWRlZFxuICAgIGNvbnN0IHBhcmVudERpdiA9IGNvbmZpZy5wYXJlbnREaXY7XG4gICAgLypcbiAgICAgIElmIGNhbGxlZCBmcm9tIGh0bWwgYXMgYSBjdXN0b20gY29tcG9uZW50IHRoZSBjb21wb25lbnQgaXRzZWxmIGlzIHBhc3NlZCAoY2FsZW5kYXJDb250YWluZXIpXG4gICAgICBJZiBjYWxsZWQgdmlhIEpTIHdoaWxlIHRoZSBjb21wb25lbnQgaXNuJ3QgYSB3ZWIgY29tcG9uZW50IGluIHRoZSBzdHJpY3Rlc3Qgc2Vuc2UsIGl0IHN0aWxsXG4gICAgICBiZWhhdmVzIGxpa2Ugb25lIGFuZCBpcyBlbmNhcHN1bGF0ZWQgaW4gYSBzaGFkb3cuXG4gICAgKi9cbiAgICBpZiAoY29uZmlnLmNhbGVuZGFyQ29udGFpbmVyKSB7XG4gICAgICBzaGFkb3dBdHRhY2goY29uZmlnLmNhbGVuZGFyQ29udGFpbmVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbmV3Q29udGFpbmVyKCkudGhlbigoY29udGFpbmVyKSA9PiB7XG4gICAgICAgIHNoYWRvd0F0dGFjaChjb250YWluZXIpO1xuICAgICAgICBjb25maWcuY2FsZW5kYXJDb250YWluZXIgPSBjb250YWluZXI7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBuZXdDb250YWluZXIgKCkge1xuICAgICAgY29uc3QgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgIGNvbnN0IG5ld0NhbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBuZXdDYWwuY2xhc3NMaXN0LmFkZCgnc3dpZnQtY2FsJyk7XG4gICAgICAgIHBhcmVudERpdi5hcHBlbmRDaGlsZChuZXdDYWwpO1xuICAgICAgICByZXNvbHZlKG5ld0NhbCk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBwcm9taXNlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNoYWRvd0F0dGFjaCAoY29udGFpbmVyKSB7XG4gICAgICBjb25zdCBzaGFkb3dSb290ID0gY29udGFpbmVyLmF0dGFjaFNoYWRvdyh7IG1vZGU6ICdvcGVuJyB9KTtcbiAgICAgIGNvbnN0IGNzcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgICBjc3MudGV4dENvbnRlbnQgPSBzdHlsZTtcbiAgICAgIHNoYWRvd1Jvb3QuYXBwZW5kQ2hpbGQoY3NzKTtcbiAgICAgIHNoYWRvd1Jvb3QuYXBwZW5kQ2hpbGQoY2FsZW5kYXIpO1xuICAgIH1cblxuICAgIGNvbnN0IHByZWxvYWRlZERhdGVzID0gY29uZmlnLnByZWxvYWRlZERhdGVzO1xuICAgIGNvbnN0IG51bWJlck9mTW9udGhzVG9EaXNwbGF5ID0gY29uZmlnLm51bWJlck9mTW9udGhzVG9EaXNwbGF5O1xuICAgIGNvbnN0IGRhdGVzT3BlbiA9IGNvbmZpZy5kYXRlc09wZW47XG4gICAgY29uc3QgbGFuZ3VhZ2UgPSBjb25maWcubGFuZ3VhZ2U7XG4gICAgY29uc3QgZGlzcGxheVRpbWVDaG9vc2VyTW9kYWwgPSBjb25maWcuZGlzcGxheVRpbWVDaG9vc2VyTW9kYWw7XG4gICAgY29uc3QgYmxvY2tXZWVrRGF5cyA9IGNvbmZpZy5ibG9ja0RheXNPZldlZWs7XG4gICAgY29uc3QgYm9va1dlZWtEYXlzID0gY29uZmlnLmJvb2tEYXlzT2ZXZWVrO1xuICAgIGNvbnN0IHN0YXJ0RGF0ZSA9IGNvbmZpZy5zdGFydERhdGU7XG4gICAgbGV0IHVuaXF1ZURheUluZGV4ID0gMDtcbiAgICAvLyBDYWxlbmRhciBpcyBkZWZpbmVkIGdsb2JhbGx5IHdpdGhpbiB0aGUgY29uc3RydWN0b3JcbiAgICBjb25zdCBjYWxlbmRhclVuaXF1ZUlkID0gZ2VuZXJhdGVSYW5kb21TdHJpbmcoKTtcbiAgICBjYWxlbmRhci5pZCA9IGBjYWxlbmRhci0ke2NhbGVuZGFyVW5pcXVlSWR9YDtcbiAgICBjYWxlbmRhci5jbGFzc0xpc3QuYWRkKCdjYWxlbmRhcicpO1xuXG4gICAgY29uc3QgbW9udGhzID0gW107XG4gICAgY29uc3QgZGF0ZU5vdyA9IG5ldyBEYXRlKCk7XG4gICAgLy8gUmVwdXJwb3NpbmcgZ2V0RWFybGllc3REYXRlIHRvIGZvcm1hdCBhIGRhdGUuXG4gICAgY29uc3QgZWFybGllc3REYXRlID0gKHN0YXJ0RGF0ZSkgPyBnZXRFYXJsaWVzdERhdGUoW3N0YXJ0RGF0ZV0pIDogZGF0ZU5vdztcbiAgICBjb25zdCBzdGFydE1vbnRoID0gZWFybGllc3REYXRlLmdldE1vbnRoKCk7XG4gICAgY29uc3QgbW9udGhOYW1lcyA9IGxhbmd1YWdlc1tsYW5ndWFnZV0uZ2VuZXJhbFRpbWUubW9udGhzO1xuICAgIC8qIENyZWF0ZSBtb250aCB2aWV3ICovXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1iZXJPZk1vbnRoc1RvRGlzcGxheTsgaSsrKSB7XG4gICAgICAvKiBNb250aCBzcGVjaWZpYyB2YXJpYWJsZXMgYW5kIHRyYWNrZXJzICovXG4gICAgICBjb25zdCB5ZWFyQ2FsYyA9IGVhcmxpZXN0RGF0ZS5hZGRNb250aHMoaSkuZ2V0RnVsbFllYXIoKTtcbiAgICAgIGNvbnN0IG1vbnRoQ2FsYyA9IChzdGFydE1vbnRoICsgaSkgJSAxMjtcbiAgICAgIGNvbnN0IHN0YXJ0RGF5T2ZNb250aCA9IG5ldyBEYXRlKHllYXJDYWxjLCBtb250aENhbGMpLmdldERheSgpO1xuICAgICAgY29uc3QgZGF5c0luTW9udGggPSBnZXREYXlzSW5Nb250aCgoc3RhcnRNb250aCArIGkgKyAxKSAlIDEyLCBlYXJsaWVzdERhdGUuYWRkTW9udGhzKGkpLmdldEZ1bGxZZWFyKCkpO1xuICAgICAgbGV0IGNvdW50ID0gMTtcbiAgICAgIGxldCBkYXlvZndlZWsgPSAwO1xuXG4gICAgICAvKiBDcmVhdGUgbW9udGggZGl2ICovXG4gICAgICBjb25zdCBtb250aCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgbW9udGhzLnB1c2gobW9udGgpO1xuICAgICAgbW9udGguc3R5bGUud2lkdGggPSAnMTVlbSc7XG4gICAgICBtb250aC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBjb2xvdXJzLm1vbnRoQm9yZGVyQ29sb3I7XG4gICAgICBtb250aC5jbGFzc0xpc3QuYWRkKCdtb250aCcpO1xuICAgICAgY2FsZW5kYXIuYXBwZW5kQ2hpbGQobW9udGgpO1xuXG4gICAgICAvKiBDcmVhdGUgbW9udGggbmFtZSBkaXYgKG1vbnRoIFlZWVkpIGF0IHRoZSB0b3Agb2YgbW9udGggZGlzcGxheSAqL1xuICAgICAgY29uc3QgbW9udGhOYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBtb250aE5hbWUuY2xhc3NMaXN0LmFkZCgnbW9udGhOYW1lJyk7XG4gICAgICBtb250aE5hbWUudGV4dENvbnRlbnQgPSBgJHttb250aE5hbWVzWyhzdGFydE1vbnRoICsgaSkgJSAxMl19ICR7ZWFybGllc3REYXRlLmdldEZ1bGxZZWFyKCl9YDtcbiAgICAgIG1vbnRoLmFwcGVuZENoaWxkKG1vbnRoTmFtZSk7XG5cbiAgICAgIC8qIENyZWF0ZSBkaXYgd2l0aCBuYW1lZCBkYXlzIG9mIHRoZSB3ZWVrICovXG4gICAgICBjb25zdCBkYXlOYW1lcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgbW9udGguYXBwZW5kQ2hpbGQoZGF5TmFtZXMpO1xuICAgICAgZGF5TmFtZXMuY2xhc3NMaXN0LmFkZCgnd2Vla3JvdycpO1xuICAgICAgbGFuZ3VhZ2VzW2xhbmd1YWdlXS5nZW5lcmFsVGltZS5kYXlzVHJ1bmNhdGVkLmZvckVhY2goKGRheU5hbWUpID0+IHtcbiAgICAgICAgY29uc3QgZGF5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGRheS50ZXh0Q29udGVudCA9IGRheU5hbWU7XG4gICAgICAgIGRheS5jbGFzc0xpc3QuYWRkKCdkYXlOYW1lJywgJ3dpZHRoU2hhcGVEYXlzJyk7XG4gICAgICAgIGRheU5hbWVzLmFwcGVuZENoaWxkKGRheSk7XG4gICAgICB9KTtcblxuICAgICAgLyogQ3JlYXRlIHdlZWsgcm93cyBmaXJzdCB3ZWVrLCBpdCdzIHJlYXNzaWduZWQgZiAqL1xuICAgICAgbGV0IHdlZWtSb3c7XG4gICAgICAvLyA0MiBkYXlzLCBpLmUuIDYgcm93cyBvZiA3XG4gICAgICBmb3IgKGxldCBwID0gMDsgcCA8IDQyOyBwKyspIHtcbiAgICAgICAgaWYgKHAgPT09IDApIHtcbiAgICAgICAgICAvLyBtYWRlIG5ldyB3ZWVrIHJvd1xuICAgICAgICAgIHdlZWtSb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICBtb250aC5hcHBlbmRDaGlsZCh3ZWVrUm93KTtcbiAgICAgICAgICB3ZWVrUm93LmNsYXNzTGlzdC5hZGQoJ3dlZWtyb3cnKTtcbiAgICAgICAgICBkYXlvZndlZWsgPSAwO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwIDwgc3RhcnREYXlPZk1vbnRoKSB7XG4gICAgICAgICAgY29uc3QgcGVnaG9sZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgIHBlZ2hvbGUuY2xhc3NMaXN0LmFkZCgnd2lkdGhTaGFwZScsICdmaWxsZXInKTtcbiAgICAgICAgICB1bnNlbGVjdGVkU3R5bGUocGVnaG9sZSk7XG4gICAgICAgICAgd2Vla1Jvdy5hcHBlbmRDaGlsZChwZWdob2xlKTtcbiAgICAgICAgICBkYXlvZndlZWsrKztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwID49IHN0YXJ0RGF5T2ZNb250aCAmJiBwIDw9IChzdGFydERheU9mTW9udGggKyBkYXlzSW5Nb250aCAtIDEpKSB7XG4gICAgICAgICAgY29uc3QgcGVnaG9sZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgIHBlZ2hvbGUudGV4dENvbnRlbnQgPSBjb3VudDtcbiAgICAgICAgICBwZWdob2xlLmRhdGFzZXQuZGF5ID0gY291bnQ7XG4gICAgICAgICAgcGVnaG9sZS5kYXRhc2V0LmRheW9md2VlayA9IGRheW9md2VlaztcbiAgICAgICAgICBwZWdob2xlLmRhdGFzZXQuZGF5aW5kZXggPSB1bmlxdWVEYXlJbmRleDtcbiAgICAgICAgICBwZWdob2xlLmNsYXNzTGlzdC5hZGQoJ3dpZHRoU2hhcGUnLCAnZGF5VGltZScpO1xuICAgICAgICAgIHBlZ2hvbGUuZGF0YXNldC5odW1hbmRhdGUgPSBodW1hbkRhdGUoYCR7eWVhckNhbGN9LSR7bW9udGhDYWxjfS0ke2NvdW50fWApO1xuICAgICAgICAgIC8vIHBlZ2hvbGUuaWQgPSBgJHt5ZWFyQ2FsY30tJHttb250aENhbGN9LSR7Y291bnR9YDtcbiAgICAgICAgICBwZWdob2xlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgICAgICAgIGRhdGVPbkNsaWNrRXZlbnRzKGUpO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgd2Vla1Jvdy5hcHBlbmRDaGlsZChwZWdob2xlKTtcblxuICAgICAgICAgIGlmIChpID09PSAwICYmIHAgPj0gc3RhcnREYXlPZk1vbnRoICYmIHAgPCAoZWFybGllc3REYXRlLmdldERhdGUoKSArIHN0YXJ0RGF5T2ZNb250aCkpIHtcbiAgICAgICAgICAgIHBlZ2hvbGUuY2xhc3NMaXN0LmFkZCgnZmlsbGVyJyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY291bnQrKztcbiAgICAgICAgICBkYXlvZndlZWsrKztcbiAgICAgICAgICB1bmlxdWVEYXlJbmRleCsrO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHAgPj0gZGF5c0luTW9udGggKyBzdGFydERheU9mTW9udGgpIHtcbiAgICAgICAgICBjb25zdCBwZWdob2xlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgcGVnaG9sZS5jbGFzc0xpc3QuYWRkKCd3aWR0aFNoYXBlJywgJ2ZpbGxlcicpO1xuICAgICAgICAgIHdlZWtSb3cuYXBwZW5kQ2hpbGQocGVnaG9sZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoKHAgKyAxKSAlIDcgPT09IDApIHtcbiAgICAgICAgICAvLyBtYWtlIG5ldyB3ZWVrIHJvdzpcbiAgICAgICAgICB3ZWVrUm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgbW9udGguYXBwZW5kQ2hpbGQod2Vla1Jvdyk7XG4gICAgICAgICAgd2Vla1Jvdy5jbGFzc0xpc3QuYWRkKCd3ZWVrcm93Jyk7XG4gICAgICAgICAgZGF5b2Z3ZWVrID0gMDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGkgPT09IG51bWJlck9mTW9udGhzVG9EaXNwbGF5IC0gMSkge1xuICAgICAgICBibG9ja0RheXNOb3RPcGVuKGNhbGVuZGFyLCBkYXRlc09wZW4pO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBPcHRpb25zOlxuICAgIGlmIChkaXNwbGF5VGltZUNob29zZXJNb2RhbCkge1xuICAgICAgdGltZUNob29zZXIgPSBuZXcgR2VuZXJhdGVUaW1lQ2hvb3Nlck1vZGFsKGNvbmZpZywgZHluYW1pY0RhdGEsIGNhbGVuZGFyKTtcbiAgICAgIHRpbWVDaG9vc2VyLmdlbmVyYXRlTW9kYWwoKTtcbiAgICB9XG4gICAgaWYgKHByZWxvYWRlZERhdGVzKSB7XG4gICAgICBwcmVsb2FkRGF0ZXMocHJlbG9hZGVkRGF0ZXMpO1xuICAgIH1cbiAgICBpZiAoYmxvY2tXZWVrRGF5cykge1xuICAgICAgYmxvY2tEYXlzT2ZXZWVrKGJsb2NrV2Vla0RheXMpO1xuICAgIH1cbiAgICBpZiAoYm9va1dlZWtEYXlzKSB7XG4gICAgICBib29rRGF5c09mV2Vlayhib29rV2Vla0RheXMpO1xuICAgIH1cbiAgfTtcblxuICB0aGlzLnByZWxvYWRlZERhdGVzID0gKGRhdGVzKSA9PiB7XG4gICAgY2FsZW5kYXIucHJlbG9hZERhdGVzKGRhdGVzKTtcbiAgfTtcblxuICBsZXQgY2xpY2tDb3VudCA9IDE7XG4gIGNvbnN0IGRhdGVDbGlja2VkVGhyaWNlID0ge1xuICAgIGRhdGU6IG51bGwsXG4gICAgY291bnQ6IDFcbiAgfTtcblxuICBmdW5jdGlvbiBjbGlrZWRUaHJpY2UgKGRhdGUpIHtcbiAgICBpZiAoZGF0ZUNsaWNrZWRUaHJpY2UuZGF0ZSA9PT0gZGF0ZSkge1xuICAgICAgZGF0ZUNsaWNrZWRUaHJpY2UuY291bnQrKztcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gcmVzZXQgZm9yIG5ldyBkYXRlXG4gICAgICBkYXRlQ2xpY2tlZFRocmljZS5kYXRlID0gZGF0ZTtcbiAgICAgIGRhdGVDbGlja2VkVGhyaWNlLmNvdW50ID0gMTtcbiAgICB9XG5cbiAgICBpZiAoZGF0ZUNsaWNrZWRUaHJpY2UuY291bnQgPT09IDMpIHtcbiAgICAgIGRhdGVDbGlja2VkVGhyaWNlLmNvdW50ID0gMDtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBmdW5jdGlvbiBkYXRlT25DbGlja0V2ZW50cyAoZSkge1xuICAgIGNvbnN0IGRhdGVEaXYgPSBlLnRhcmdldDtcbiAgICBjbGlja0NvdW50Kys7XG5cbiAgICBpZiAoY29uZmlnLmN1c3RvbUNsaWNrRXZlbnQpIHtcbiAgICAgIHJldHVybiBjb25maWcuY3VzdG9tQ2xpY2tFdmVudChlKTtcbiAgICB9XG5cbiAgICBpZiAoZHluYW1pY0RhdGEuZGlzYWJsZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoY29uZmlnLnNlbGVjdFJhbmdlKSB7XG4gICAgICByYW5nZShkYXRlRGl2KTtcbiAgICB9XG5cbiAgICBpZiAoY29uZmlnLnNpbmdsZURhdGVDaG9pY2UpIHtcbiAgICAgIGNsZWFyU2VsZWN0aW9uKGNhbGVuZGFyLCBkeW5hbWljRGF0YSk7XG4gICAgICBib29rRGF0ZXMoW2RhdGVEaXZdKTtcbiAgICAgIHRpbWVDaG9vc2VyVG9nZ2xlKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdGltZUNob29zZXJUb2dnbGUgKCkge1xuICAgICAgaWYgKGNvbmZpZy5kaXNwbGF5VGltZUNob29zZXJNb2RhbCkge1xuICAgICAgICB0aW1lQ2hvb3Nlci5zaG93KCk7XG4gICAgICAgIHRpbWVDaG9vc2VyLndyaXRlVG9EYXRlRGl2KCk7XG4gICAgICAgIHRpbWVDaG9vc2VyLndyaXRlVG9EeW5hbWljRGF0YSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJhbmdlIChkYXRlRGl2KSB7XG4gICAgICBjb25zdCBsYXN0RGF0ZSA9IGRhdGVDbGlja2VkVGhyaWNlLmRhdGU7XG4gICAgICBjb25zdCB0aHJpY2UgPSBjbGlrZWRUaHJpY2UoZGF0ZURpdi5kYXRhc2V0Lmh1bWFuZGF0ZSk7XG4gICAgICBpZiAodGhyaWNlKSB7XG4gICAgICAgIHdpbmRvdy5nZXRTZWxlY3Rpb24oKS5yZW1vdmVBbGxSYW5nZXMoKTtcbiAgICAgICAgLy8gcGFzcyBcInRydWVcIiB0byBpbmRpY2F0ZSBhIHNpbmdsZSBkYXRlIHJhbmdlLCBzZWxlY3RlZCBieSB0cmlwbGUgY2xpY2s6XG4gICAgICAgIGJvb2tEYXRlcyhbZGF0ZURpdl0sIHRydWUpO1xuICAgICAgICB0aW1lQ2hvb3NlclRvZ2dsZSgpO1xuICAgICAgICBjbGlja0NvdW50Kys7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChjbGlja0NvdW50ICUgMiA9PT0gMCkge1xuICAgICAgICBpZiAoY29uZmlnLnNlbGVjdE11bHRpcGxlKSB7XG4gICAgICAgICAgY2xlYXJTZWxlY3Rpb24oY2FsZW5kYXIsIGR5bmFtaWNEYXRhKTtcbiAgICAgICAgfVxuICAgICAgICBib29rRGF0ZXMoW2RhdGVEaXZdKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKHByaW9yV2FzU2luZ2xlID09PSBmYWxzZSAmJiBjbGlja0NvdW50ICUgMiA9PT0gMSkge1xuICAgICAgICBib29rRGF0ZXMoW2RhdGVEaXZdKTtcbiAgICAgICAgLy8gdGltZUNob29zZXJUb2dnbGUoKTtcbiAgICAgICAgLy8gcnVsZSB0byBjaGVjayBpZiByYW5nZSBpcyBhIGxvbmdlciB0aGFuIDE6XG4gICAgICAgIGlmIChkYXRlQ2xpY2tlZFRocmljZS5kYXRlICE9PSBsYXN0RGF0ZSkgeyB0aW1lQ2hvb3NlclRvZ2dsZSgpOyB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJhbmdlIHNlbGVjdFxuICAgKiBAZGVzY3JpcHRpb24gQWxsb3dzIGEgcmFuZ2Ugb2YgZGF0ZXMgdG8gYmUgc2VsZWN0ZWRcbiAgICogQGZ1bmN0aW9uIGJvb2tEYXRlc1xuICAgKiBAcGFyYW0gZGF0ZXMgTm9kZWxpc3RcbiAgICogQHRvZG8gYWxsb3cgYSByYW5nZSBvZiBsZW5ndGggb25lIHRvIGJlIHNlbGVjdGVkXG4gICAqIEBmaXJlcyBib29rRGF5IGZvciBlYWNoIGRheSBpbiBhIHJhbmdlXG4gICAqL1xuXG4gIGxldCBwcmlvcldhc1NpbmdsZSA9IGZhbHNlO1xuICBmdW5jdGlvbiBib29rRGF0ZXMgKGFycmF5T2ZEYXRlRGl2cywgc2luZ2xlRGF0ZSkge1xuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBuZXcgc2VsZWN0aW9uIGluIHRoZSBkeW5hbWljRGF0YSBvYmplY3QuXG4gICAgICogQHJldHVybiB7b2JqZWN0fSBBbiBvYmplY3QgY29udGFpbmluZyB0aGUgdHJhY2tpbmcgYXJyYXkgXCJuZXdBcnJheVwiIGFuZCBvYmplY3RzIGFycmF5LlxuICAgICAqL1xuXG4gICAgZnVuY3Rpb24gY3JlYXRlTmV3U2VsZWN0aW9uIChwcmlvcldhc1NpbmdsZSkge1xuICAgICAgY29uc3QgcGFyZW50QXIgPSBkeW5hbWljRGF0YS5kYXRlc1NlbGVjdGVkQXJyYXk7XG4gICAgICBjb25zdCBwYXJlbnRBck9iaiA9IGR5bmFtaWNEYXRhLmRhdGVzU2VsZWN0ZWRBcnJheU9iamVjdHM7XG4gICAgICBsZXQgbmV3QXJyYXksIG5ld09iamVjdHNBcnJheTtcblxuICAgICAgbmV3QXJyYXkgPSBwYXJlbnRBcltwYXJlbnRBci5sZW5ndGggLSAxXTtcblxuICAgICAgaWYgKCFwcmlvcldhc1NpbmdsZSAmJiBjb25maWcuc2VsZWN0UmFuZ2UgJiYgbmV3QXJyYXkgJiYgbmV3QXJyYXkubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIG5ld09iamVjdHNBcnJheSA9IHBhcmVudEFyT2JqW3BhcmVudEFyT2JqLmxlbmd0aCAtIDFdO1xuICAgICAgICByZXR1cm4geyBuZXdBcnJheSwgbmV3T2JqZWN0c0FycmF5IH07XG4gICAgICB9XG5cbiAgICAgIG5ld0FycmF5ID0gW107XG4gICAgICBuZXdPYmplY3RzQXJyYXkgPSBbXTtcbiAgICAgIHBhcmVudEFyLnB1c2gobmV3QXJyYXkpO1xuICAgICAgcGFyZW50QXJPYmoucHVzaChuZXdPYmplY3RzQXJyYXkpO1xuICAgICAgcmV0dXJuIHsgbmV3QXJyYXksIG5ld09iamVjdHNBcnJheSB9O1xuICAgIH1cblxuICAgIC8vIGNyZWF0ZSBuZXcgc2VsZWN0aW9ucyBvciByZXRyaWV2ZSB0aGUgbGFzdCBzZWxlY3Rpb246XG4gICAgY29uc3QgeyBuZXdBcnJheSwgbmV3T2JqZWN0c0FycmF5IH0gPSBjcmVhdGVOZXdTZWxlY3Rpb24ocHJpb3JXYXNTaW5nbGUpO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnJheU9mRGF0ZURpdnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGRhdGVEaXYgPSBhcnJheU9mRGF0ZURpdnNbaV07XG4gICAgICBmaW5kRGF0ZVNlbGVjdGlvbihkYXRlRGl2KTtcbiAgICAgIGJvb2tEYXkoZGF0ZURpdik7XG4gICAgfVxuICAgIC8vIHN0b3JlIHdpbiB0aGUgcHJldmlvdXMgc2VsZWN0aW9uIHdhcyBhIHJhbmdlIG9mIGxlbmd0aCAxLCByZWFkIGJ5IFwiY3JlYXRlTmV3U2VsZWN0aW9uXCJcbiAgICBwcmlvcldhc1NpbmdsZSA9ICEhKHNpbmdsZURhdGUpO1xuXG4gICAgLy8gaWYgdGhlIGRhdGUgaXMgaW4gYSBwcmV2aW91cyBzZWxlY3Rpb24sIHRoYXQgc2VsZWN0aW9uIGlzIHNwbGljZWRcbiAgICBmdW5jdGlvbiBmaW5kRGF0ZVNlbGVjdGlvbiAoZGF0ZSkge1xuICAgICAgLy8gY29uc29sZS5sb2coZGF0ZSk7XG4gICAgICBjb25zdCBzdG9yZSA9IGR5bmFtaWNEYXRhLmRhdGVzU2VsZWN0ZWRBcnJheU9iamVjdHM7XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHN0b3JlLmxlbmd0aDsgaisrKSB7XG4gICAgICAgIC8vIHRoZSBhcnJheSBpbiBxdWVzdGlvblxuICAgICAgICBjb25zdCBzaW5nbGVTZWxlY3Rpb24gPSBzdG9yZVtqXTtcbiAgICAgICAgLy8gZGF0YSBhdHRyIG9mIGh0bWwgZWxlbWVudFxuICAgICAgICBjb25zdCBkYXRlVmFsdWUgPSBkYXRlLmRhdGFzZXQuaHVtYW5kYXRlO1xuICAgICAgICBjb25zdCBzZWFyY2ggPSAoKSA9PiBzaW5nbGVTZWxlY3Rpb24uZmluZCgoZGF0ZVN0b3JlZCkgPT4gZGF0ZVN0b3JlZC5odW1hbmRhdGUgPT09IGRhdGVWYWx1ZSk7XG4gICAgICAgIGlmIChzZWFyY2goKSkge1xuICAgICAgICAgIHNpbmdsZVNlbGVjdGlvbi5mb3JFYWNoKChkYXRlKSA9PiB7XG4gICAgICAgICAgICAvLyByZW1vdmUgc2VsZWN0aW9uIGNvbG91clxuICAgICAgICAgICAgY29uc3QgZGF5RGl2ID0gY2FsZW5kYXIucXVlcnlTZWxlY3RvcihgW2RhdGEtaHVtYW5kYXRlPScke2RhdGUuaHVtYW5kYXRlfSddYCk7XG4gICAgICAgICAgICB1bnNlbGVjdGVkU3R5bGUoZGF5RGl2KTtcbiAgICAgICAgICAgIC8vIHJlbW92ZSB0aW1lcywgaWYgYW55OlxuICAgICAgICAgICAgd2hpbGUgKGRheURpdi5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgIGRheURpdi5yZW1vdmVDaGlsZChkYXlEaXYubGFzdENoaWxkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICAvLyByZW1vdmUgZnJvbSBzdG9yYWdlXG4gICAgICAgICAgZHluYW1pY0RhdGEuZGF0ZXNTZWxlY3RlZEFycmF5T2JqZWN0cy5zcGxpY2UoaiwgMSk7XG4gICAgICAgICAgZHluYW1pY0RhdGEuZGF0ZXNTZWxlY3RlZEFycmF5LnNwbGljZShqLCAxKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChjb25maWcuc2VsZWN0UmFuZ2UpIHtcbiAgICAgIGNvbnN0IHN0YXJ0RGF0ZSA9IG5ld09iamVjdHNBcnJheVswXTtcbiAgICAgIGNvbnN0IHN0YXJ0SW5kZXggPSBzdGFydERhdGUuaW5kZXg7XG4gICAgICAvLyBpZiBhIHNpbmdsZSBkYXRlIGlzIHNlbGVjdGVkOlxuICAgICAgY29uc3QgZW5kRGF0ZSA9IG5ld09iamVjdHNBcnJheVsxXSB8fCBzdGFydERhdGU7XG4gICAgICBjb25zdCBlbmRJbmRleCA9IChlbmREYXRlKSA/IGVuZERhdGUuaW5kZXggOiBmYWxzZTtcblxuICAgICAgY29uc3QgW2xvdywgaGlnaF0gPSBbcGFyc2VJbnQoc3RhcnRJbmRleCksIHBhcnNlSW50KGVuZEluZGV4KV0uc29ydCgoYSwgYikgPT4gYSAtIGIpO1xuXG4gICAgICBmb3IgKGxldCBpID0gbG93OyBpIDw9IGhpZ2g7IGkrKykge1xuICAgICAgICBjb25zdCBkYXRlRGl2ID0gY2FsZW5kYXIucXVlcnlTZWxlY3RvcihgW2RhdGEtZGF5aW5kZXg9JyR7aX0nXWApO1xuICAgICAgICBpZiAoZGF0ZURpdi5jbGFzc0xpc3QuY29udGFpbnMoJ2Jsb2NrZWQnKSkge1xuICAgICAgICAgIHVuc2VsZWN0ZWRTdHlsZShjYWxlbmRhci5xdWVyeVNlbGVjdG9yKGBbaWQ9JyR7ZW5kRGF0ZX0nXWApKTtcbiAgICAgICAgICBuZXdBcnJheS5zcGxpY2UoMSwgMSk7XG4gICAgICAgICAgbmV3T2JqZWN0c0FycmF5LnNwbGljZSgxLCAxKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBib29rRGF5KGRhdGVEaXYpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGJvb2tEYXkgKGRhdGVEaXYpIHtcbiAgICAgIGlmIChjb25maWcuc2luZ2xlRGF0ZUNob2ljZSAmJiBuZXdBcnJheS5sZW5ndGggPiAwKSB7XG4gICAgICAgIGNsZWFyU2VsZWN0aW9uKGNhbGVuZGFyLCBkeW5hbWljRGF0YSk7XG4gICAgICB9XG4gICAgICBpZiAobmV3QXJyYXkuaW5jbHVkZXMoZGF0ZURpdi5kYXRhc2V0Lmh1bWFuZGF0ZSkgPT09IGZhbHNlKSB7XG4gICAgICAgIHNlbGVjdGVkU3R5bGUoZGF0ZURpdik7XG4gICAgICAgIG5ld0FycmF5LnB1c2goZGF0ZURpdi5kYXRhc2V0Lmh1bWFuZGF0ZSk7XG4gICAgICAgIG5ld09iamVjdHNBcnJheVtuZXdBcnJheS5sZW5ndGggLSAxXSA9IHN0YW5kYXJkRGF0ZU9iamVjdChkYXRlRGl2KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBib29rRGF5c09mV2VlayAoZGF5SW5kZXgpIHtcbiAgICBjb25zdCBkYXlzID0gY2FsZW5kYXIucXVlcnlTZWxlY3RvckFsbChgW2RhdGEtZGF5b2Z3ZWVrPVwiJHtkYXlJbmRleH1cIl1gKTtcbiAgICBkYXlzLmZvckVhY2goKGRheSkgPT4ge1xuICAgICAgYm9va0RhdGVzKFtkYXldLCB0cnVlKTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGJsb2NrRGF5c09mV2VlayAoZGF5SW5kZXhBcnJheSkge1xuICAgIGRheUluZGV4QXJyYXkuZm9yRWFjaCgoZGF5SW5kZXgpID0+IHtcbiAgICAgIGNvbnN0IGRheXMgPSBjYWxlbmRhci5xdWVyeVNlbGVjdG9yQWxsKGBbZGF0YS1kYXlvZndlZWs9XCIke2RheUluZGV4fVwiXWApO1xuICAgICAgZGF5cy5mb3JFYWNoKChkYXkpID0+IHtcbiAgICAgICAgZGF5LmNsYXNzTGlzdC5hZGQoJ2ZpbGxlcicpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBwcmVsb2FkRGF0ZXMgKHByZWxvYWRlZERhdGVzKSB7XG4gICAgaWYgKHR5cGVvZiBwcmVsb2FkZWREYXRlc1swXSAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IEVycm9yKGBEYXRlcyBzaG91bGQgYmUgcHJvdmlkZWQgYXMgc3RyaW5ncyBpbiB0aGUgZm9ybWF0IFlZWVktTU0tREQsIFByZWxvYWRlZCBkYXRlcyBpcyAke3ByZWxvYWRlZERhdGVzfVxuICAgICAgICAgYW5kIHRoZSBmaXJzdCBkYXRlIGlzICR7cHJlbG9hZGVkRGF0ZXNbMF19YCk7XG4gICAgfVxuICAgIGlmIChwcmVsb2FkZWREYXRlc1swXS5zcGxpdCgnLScpWzBdLmxlbmd0aCAhPT0gNCkge1xuICAgICAgdGhyb3cgRXJyb3IoJ1llYXIgcmVxdWlyZXMgNCBkaWdpdHMsIGUuZy4gMjAyNicpO1xuICAgIH1cbiAgICBpZiAocHJlbG9hZGVkRGF0ZXNbMF0uc3BsaXQoJy0nKVsxXS5sZW5ndGggIT09IDIpIHtcbiAgICAgIHRocm93IEVycm9yKCdNb250aCByZXF1aXJlcyAyIGRpZ2l0cywgMDEgZm9yIEphbnVhcnknKTtcbiAgICB9XG4gICAgaWYgKHByZWxvYWRlZERhdGVzWzBdLnNwbGl0KCctJylbMl0ubGVuZ3RoICE9PSAyKSB7XG4gICAgICB0aHJvdyBFcnJvcignRGF5IHJlcXVpcmVzIDIgZGlnaXRzLCAwMSBmb3IgdGhlIGZpcnN0IGRheSBvZiB0aGUgbW9udGgnKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXREaXZzIChkYXRlcykge1xuICAgICAgcmV0dXJuIGRhdGVzXG4gICAgICAgIC5tYXAoZGF0ZSA9PiBjYWxlbmRhci5xdWVyeVNlbGVjdG9yKGBbZGF0YS1odW1hbmRhdGU9JyR7ZGF0ZX0nXWApKVxuICAgICAgICAuZmlsdGVyKEJvb2xlYW4pOyAvLyByZW1vdmVzIG51bGxzXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYmxvY2tOb3RQcmVsb2FkZWREYXRlcyAoZGF0ZURpdnMpIHtcbiAgICAgIGNvbnN0IG5vbk9wdGlvbnMgPSBjYWxlbmRhci5xdWVyeVNlbGVjdG9yQWxsKCcuZGF5VGltZScpO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5vbk9wdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgZGF5ID0gbm9uT3B0aW9uc1tpXTtcblxuICAgICAgICBpZiAoIWRhdGVEaXZzLmluY2x1ZGVzKGRheSkpIHtcbiAgICAgICAgICBkYXkuY2xhc3NMaXN0LmFkZCgnZmlsbGVyJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZGF5LmNsYXNzTGlzdC5hZGQoJ3ByZWxvYWRlZCcpO1xuICAgICAgICAgIGRheS50aXRsZSA9IGNvbmZpZy5wcmVsb2FkZWRUb29sdGlwO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgZGF0ZURpdnMgPSBnZXREaXZzKHByZWxvYWRlZERhdGVzKTtcbiAgICBibG9ja05vdFByZWxvYWRlZERhdGVzKGRhdGVEaXZzKTtcbiAgfVxufVxuXG5leHBvcnQgeyBTd2lmdENhbCB9O1xuIiwiaW1wb3J0IHsgbGFuZ3VhZ2VzIH0gZnJvbSAnLi9sYW5ndWFnZXMuanMnO1xuaW1wb3J0IHsgcHJveHlUb1BsYWluT2JqZWN0SGVscGVyLCBkZWJvdW5jZSB9IGZyb20gJy4vYmFzaWNGdW5jdGlvbnMuanMnO1xuXG4vKipcbiAqIEdlbmVyYXRlcyBhIHRpbWUgY2hvb3NlciBtb2RhbCBmb3Igc2VsZWN0aW5nIHRpbWUuIENhbGxlZCBpbiBjYWxlbmRhckdlbmVyYXRvci5qc1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcgLSBUaGUgY29uZmlndXJhdGlvbiBvYmplY3QuXG4gKiBAcGFyYW0ge09iamVjdH0gZHluYW1pY0RhdGEgLSBUaGUgZHluYW1pYyBkYXRhIG9iamVjdC5cbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGNhbGVuZGFyIC0gVGhlIGNhbGVuZGFyIGVsZW1lbnQuXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn0gVGhlIGdlbmVyYXRlZCB0aW1lIGNob29zZXIgbW9kYWwuXG4gKi9cbmZ1bmN0aW9uIEdlbmVyYXRlVGltZUNob29zZXJNb2RhbCAoY29uZmlnLCBkeW5hbWljRGF0YSwgY2FsZW5kYXIpIHtcbiAgLyoqXG4gICAqIEEgY3VzdG9tIGV2ZW50IGVtaXR0ZWQgd2hlbiBhIHRpbWUgaXMgYWRkZWQgb3Igc2VsZWN0ZWRcbiAgICpcbiAgICogQHJldHVybiB7dm9pZH0gVGhpcyBmdW5jdGlvbiBkb2VzIG5vdCByZXR1cm4gYW55IHZhbHVlLlxuICAgKi9cblxuICBjb25zdCBlbWl0VGltZVNlbGVjdGVkRXZlbnQgPSBkZWJvdW5jZSgoKSA9PiB7XG4gICAgY29uc3QgZXZ0ID0gbmV3IEN1c3RvbUV2ZW50KCd0aW1lU2VsZWN0Jywge1xuICAgICAgZGV0YWlsOiB7IGRhdGU6IHByb3h5VG9QbGFpbk9iamVjdEhlbHBlcihkeW5hbWljRGF0YSkgfVxuICAgIH0pO1xuICAgIGNvbmZpZy5jYWxlbmRhckNvbnRhaW5lci5kaXNwYXRjaEV2ZW50KGV2dCk7XG4gIH0sIDI1MCk7XG5cbiAgbGV0IHRpbWVDaG9vc2VyTW9kYWw7XG5cbiAgbGV0IHNlbGVjdGlvbiA9IFtdO1xuXG4gIHRoaXMuZ2V0U2VsZWN0ZWRUaW1lcyA9ICgpID0+IHtcbiAgICByZXR1cm4gc2VsZWN0aW9uO1xuICB9O1xuXG4gIHRoaXMuZ2VuZXJhdGVNb2RhbCA9ICgpID0+IHtcbiAgICByZXR1cm4gZ2VuZXJhdGVNb2RhbCgpO1xuICB9O1xuXG4gIHRoaXMuc2hvdyA9ICgpID0+IHtcbiAgICBjYWxlbmRhci5zdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nO1xuICAgIHJldHVybiB0aW1lQ2hvb3Nlck1vZGFsLnNob3coKTtcbiAgfTtcblxuICB0aGlzLndyaXRlVG9EYXRlRGl2ID0gKCkgPT4ge1xuICAgIHdyaXRlVG9EYXRlRGl2KCk7XG4gIH07XG5cbiAgdGhpcy53cml0ZVRvRHluYW1pY0RhdGEgPSAoKSA9PiB7XG4gICAgd3JpdGVUb0R5bmFtaWNEYXRhKCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEdlbmVyYXRlcyBhIGRpYWxvZyBmb3IgY2hvb3NpbmcgdGltZS5cbiAgICpcbiAgICogQHJldHVybiB7UHJvbWlzZX0gQSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgdG8gdGhlIGdlbmVyYXRlZCB0aW1lIGNob29zZXIgbW9kYWwuXG4gICAqL1xuICBmdW5jdGlvbiBnZW5lcmF0ZU1vZGFsICgpIHtcbiAgICBjb25zdCBwcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgIHRpbWVDaG9vc2VyTW9kYWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaWFsb2cnKTtcbiAgICAgIHRpbWVDaG9vc2VyTW9kYWwuY2xhc3NMaXN0LmFkZCgndGltZUNob29zZXJNb2RhbCcpO1xuICAgICAgY2FsZW5kYXIuYXBwZW5kQ2hpbGQodGltZUNob29zZXJNb2RhbCk7XG5cbiAgICAgIGNvbnN0IHRpbWVDb250ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICB0aW1lQ29udC5jbGFzc0xpc3QuYWRkKCd0aW1lQ29udCcpO1xuICAgICAgdGltZUNob29zZXJNb2RhbC5hcHBlbmRDaGlsZCh0aW1lQ29udCk7XG5cbiAgICAgIGNvbnN0IHRpbWVDaG9vc2VyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICB0aW1lQ2hvb3Nlci5jbGFzc0xpc3QuYWRkKCd0aW1lQ2hvb3NlcicpO1xuICAgICAgdGltZUNvbnQuYXBwZW5kQ2hpbGQodGltZUNob29zZXIpO1xuXG4gICAgICBjb25zdCBjb250cm9sc0RpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgY29udHJvbHNEaXYuY2xhc3NMaXN0LmFkZCgnZGVsZXRlRGl2Jyk7XG4gICAgICB0aW1lQ2hvb3Nlci5hcHBlbmRDaGlsZChjb250cm9sc0Rpdik7XG5cbiAgICAgIGZ1bmN0aW9uIGNsb3NlRm4gKCkge1xuICAgICAgICBjYWxlbmRhci5zdHlsZS5vdmVyZmxvdyA9ICdzY3JvbGwnO1xuICAgICAgICB0aW1lQ2hvb3Nlck1vZGFsLmNsb3NlKCk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGlubmVyQ29tcG9uZW50cyAoKSB7XG4gICAgICAgIGNvbnN0IHRpbWVQaWNrZXJDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgdGltZVBpY2tlckNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCd0aW1lUGlja2VyQ29udGFpbmVyJyk7XG4gICAgICAgIHRpbWVDaG9vc2VyLmFwcGVuZENoaWxkKHRpbWVQaWNrZXJDb250YWluZXIpO1xuICAgICAgICBjb25zdCB0aXRsZURpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICB0aXRsZURpdi50ZXh0Q29udGVudCA9IGxhbmd1YWdlc1tjb25maWcubGFuZ3VhZ2VdLnRpbWVXaWRnZXQuYWRkVGltZTtcbiAgICAgICAgdGl0bGVEaXYuY2xhc3NMaXN0LmFkZCgnZGVsZXRlRGl2Jyk7XG4gICAgICAgIHRpbWVQaWNrZXJDb250YWluZXIuYXBwZW5kQ2hpbGQodGl0bGVEaXYpO1xuICAgICAgICBtYWtlRHJvcERvd25zKGxhbmd1YWdlc1tjb25maWcubGFuZ3VhZ2VdLnRpbWVXaWRnZXQuc3RhcnQsIHRpbWVQaWNrZXJDb250YWluZXIpO1xuICAgICAgICBtYWtlRHJvcERvd25zKGxhbmd1YWdlc1tjb25maWcubGFuZ3VhZ2VdLnRpbWVXaWRnZXQuZW5kLCB0aW1lUGlja2VyQ29udGFpbmVyKTtcblxuICAgICAgICAvLyBzZXRUaW1lRm9yQWxsVGlja0JveCh0aW1lUGlja2VyQ29udGFpbmVyKTtcbiAgICAgIH1cblxuICAgICAgbWFrZUJ1dHRvbihjb250cm9sc0RpdiwgJ2RlbGV0ZUJ1dHRvbicsICcrJywgJ2FkZCB0aW1lJywgJ2NsaWNrJywgaW5uZXJDb21wb25lbnRzKTtcbiAgICAgIG1ha2VCdXR0b24oY29udHJvbHNEaXYsICdkZWxldGVCdXR0b24nLCAnLScsICdyZW1vdmUgdGltZScsICdjbGljaycsIHJlbW92ZVRpbWVWYWx1ZXNPbkRhdGUpO1xuICAgICAgbWFrZUJ1dHRvbihjb250cm9sc0RpdiwgJ2RlbGV0ZUJ1dHRvbicsICd4JywgJ2Nsb3NlJywgJ2NsaWNrJywgY2xvc2VGbik7XG5cbiAgICAgIHJlc29sdmUodGltZUNob29zZXJNb2RhbCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cblxuICBmdW5jdGlvbiB3cml0ZVRvRGF0ZURpdiAoKSB7XG4gICAgaWYgKGNvbmZpZy5kaXNwbGF5VGltZVNlbGVjdGlvbk9uRGF0ZSkge1xuICAgICAgZHluYW1pY0RhdGEuZGF0ZXNTZWxlY3RlZEFycmF5W2R5bmFtaWNEYXRhLmRhdGVzU2VsZWN0ZWRBcnJheS5sZW5ndGggLSAxXS5mb3JFYWNoKChkYXlTZWxlY3RlZCkgPT4ge1xuICAgICAgICB3cml0ZShkYXlTZWxlY3RlZCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiB3cml0ZSAoZGF0ZSkge1xuICAgIC8vIGNvbnRhaW5zIGEgdGltZSBkdXJhdGlvbiBjaG9pY2VcbiAgICBsZXQgY2FsZW5kYXJUaW1lUGFyZW50O1xuXG4gICAgY29uc3QgZGF5RGl2ID0gY2FsZW5kYXIucXVlcnlTZWxlY3RvcihgW2RhdGEtaHVtYW5kYXRlPScke2RhdGV9J11gKTtcbiAgICB3aGlsZSAoZGF5RGl2LmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICAgIGRheURpdi5yZW1vdmVDaGlsZChkYXlEaXYubGFzdENoaWxkKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjcmVhdGVOZXdQYXJhICh0ZXh0KSB7XG4gICAgICBjb25zdCB0aW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgICAgY2FsZW5kYXJUaW1lUGFyZW50LmFwcGVuZENoaWxkKHRpbWUpO1xuICAgICAgdGltZS5jbGFzc0xpc3QuYWRkKCdjYWxlbmRhclRpbWUnKTtcbiAgICAgIHRpbWUudGV4dENvbnRlbnQgPSB0ZXh0O1xuICAgIH1cblxuICAgIHNlbGVjdGlvbi5mb3JFYWNoKCh0aW1lVmFsdWUsIGkpID0+IHtcbiAgICAgIGlmIChpID09PSAwIHx8IGkgJSAyID09PSAwKSB7XG4gICAgICAgIGNhbGVuZGFyVGltZVBhcmVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBjYWxlbmRhclRpbWVQYXJlbnQuY2xhc3NMaXN0LmFkZCgnY2FsZW5kYXJUaW1lUGFyZW50Jyk7XG4gICAgICAgIGRheURpdi5hcHBlbmRDaGlsZChjYWxlbmRhclRpbWVQYXJlbnQpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBmaWVsZE5hbWUgPSBPYmplY3Qua2V5cyh0aW1lVmFsdWUpWzBdO1xuICAgICAgY3JlYXRlTmV3UGFyYShgJHtmaWVsZE5hbWV9OmApO1xuICAgICAgY3JlYXRlTmV3UGFyYShgJHt0aW1lVmFsdWVbZmllbGROYW1lXS5oaH06JHt0aW1lVmFsdWVbZmllbGROYW1lXS5tbX1gKTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG1ha2VCdXR0b24gKHBhcmVudCwgY2xhc3NOYW1lLCB0ZXh0Q29udGVudCwgaG92ZXJUZXh0LCBhY3Rpb24sIGZuKSB7XG4gICAgY29uc3QgYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcbiAgICBidXR0b24udGV4dENvbnRlbnQgPSB0ZXh0Q29udGVudDtcbiAgICBidXR0b24udGl0bGUgPSBob3ZlclRleHQ7XG4gICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoYWN0aW9uLCAoKSA9PiB7XG4gICAgICBmbigpO1xuICAgIH0pO1xuICAgIHBhcmVudC5hcHBlbmRDaGlsZChidXR0b24pO1xuICB9XG5cbiAgZnVuY3Rpb24gbWFrZURyb3BEb3ducyAoY29udGV4dFRleHQsIHRpbWVQaWNrZXJDb250YWluZXIpIHtcbiAgICAvLyBUaGUgdGltZSBjb250YWluZXJcbiAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBjb250YWluZXIuY2xhc3NMaXN0LmFkZCgndGltZUNvbnRhaW5lcicpO1xuICAgIGNvbnRhaW5lci5kYXRhc2V0LmNvbnRleHQgPSBjb250ZXh0VGV4dDtcbiAgICB0aW1lUGlja2VyQ29udGFpbmVyLmFwcGVuZENoaWxkKGNvbnRhaW5lcik7XG5cbiAgICBjb25zdCB0aW1lRm9yQ29udGV4dCA9IHsgW2NvbnRleHRUZXh0XToge30gfTtcblxuICAgIHNlbGVjdGlvbi5wdXNoKHRpbWVGb3JDb250ZXh0KTtcblxuICAgIC8vIE1ha2UgbGFiZWxcbiAgICBjb25zdCBsYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICBsYWJlbC5jbGFzc0xpc3QuYWRkKCd0aW1lU2VsZWN0UCcpO1xuICAgIGxhYmVsLnRleHRDb250ZW50ID0gYCR7Y29udGV4dFRleHR9OmA7XG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGxhYmVsKTtcblxuICAgIC8vIE1ha2UgaG91ciBzZWxlY3RvclxuICAgIGNvbnN0IHRpbWVTZWxlY3RvckRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRpbWVTZWxlY3RvckRpdi5kYXRhc2V0LmNvbnRleHQgPSBjb250ZXh0VGV4dDtcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQodGltZVNlbGVjdG9yRGl2KTtcblxuICAgIG1ha2VTZWxlY3RvcignaGgnLCAyMywgdGltZVNlbGVjdG9yRGl2LCBjb250ZXh0VGV4dCwgdGltZVBpY2tlckNvbnRhaW5lciwgdGltZUZvckNvbnRleHQpO1xuICAgIG1ha2VTZWxlY3RvcignbW0nLCA1OSwgdGltZVNlbGVjdG9yRGl2LCBjb250ZXh0VGV4dCwgdGltZVBpY2tlckNvbnRhaW5lciwgdGltZUZvckNvbnRleHQpO1xuICB9XG5cbiAgZnVuY3Rpb24gbWFrZVNlbGVjdG9yICh0eXBlLCBsaW1pdCwgdGltZVNlbGVjdG9yRGl2LCBjb250ZXh0VGV4dCwgdGltZVBpY2tlckNvbnRhaW5lciwgdGltZUZvckNvbnRleHQpIHtcbiAgICBjb25zdCBkcm9wRG93biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NlbGVjdCcpO1xuICAgIGRyb3BEb3duLmNsYXNzTGlzdC5hZGQodHlwZSwgJ3RpbWVTZWxlY3QnKTtcbiAgICB0aW1lU2VsZWN0b3JEaXYuYXBwZW5kQ2hpbGQoZHJvcERvd24pO1xuXG4gICAgZHJvcERvd24uZGF0YXNldC50eXBlID0gdHlwZTtcbiAgICBkcm9wRG93bi5kYXRhc2V0LmNvbnRleHQgPSBjb250ZXh0VGV4dDtcblxuICAgIGNvbnN0IHBsYWNlaG9sZGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XG4gICAgcGxhY2Vob2xkZXIudGV4dENvbnRlbnQgPSB0eXBlO1xuICAgIHBsYWNlaG9sZGVyLnZhbHVlID0gJzAwJztcblxuICAgIC8vIHtcIlN0YXJ0XCI6e1wiaGhcIjpcIjAwXCJ9fSx7XCJTdGFydFwiOntcIm1tXCI6XCIwMFwifX1cbiAgICB0aW1lRm9yQ29udGV4dFtjb250ZXh0VGV4dF1bdHlwZV0gPSBwbGFjZWhvbGRlci52YWx1ZTtcbiAgICBkcm9wRG93bi5hcHBlbmRDaGlsZChwbGFjZWhvbGRlcik7XG5cbiAgICBsZXQgaSA9IDA7XG4gICAgd2hpbGUgKGkgPD0gbGltaXQpIHtcbiAgICAgIGNvbnN0IGhvdXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcbiAgICAgIGxldCB0ZXh0ID0gaS50b1N0cmluZygpO1xuICAgICAgaWYgKHRleHQubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIHRleHQgPSBgMCR7aX1gO1xuICAgICAgfVxuICAgICAgaG91ci52YWx1ZSA9IHRleHQ7XG4gICAgICBob3VyLnRleHRDb250ZW50ID0gdGV4dDtcbiAgICAgIGRyb3BEb3duLmFwcGVuZENoaWxkKGhvdXIpO1xuICAgICAgaSsrO1xuICAgIH1cblxuICAgIGRyb3BEb3duLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsICgpID0+IHtcbiAgICAgIHRpbWVGb3JDb250ZXh0W2NvbnRleHRUZXh0XVt0eXBlXSA9IGRyb3BEb3duLnZhbHVlO1xuICAgICAgd3JpdGVUb0R5bmFtaWNEYXRhKCk7XG4gICAgICB3cml0ZVRvRGF0ZURpdigpO1xuICAgICAgZW1pdFRpbWVTZWxlY3RlZEV2ZW50KCk7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiB3cml0ZVRvRHluYW1pY0RhdGEgKCkge1xuICAgIGR5bmFtaWNEYXRhLmRhdGVzU2VsZWN0ZWRBcnJheU9iamVjdHNbZHluYW1pY0RhdGEuZGF0ZXNTZWxlY3RlZEFycmF5T2JqZWN0cy5sZW5ndGggLSAxXS5mb3JFYWNoKChkYXlTZWxlY3RlZCkgPT4ge1xuICAgICAgY29uc3QgdGltZXMgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHNlbGVjdGlvbikpO1xuICAgICAgZGF5U2VsZWN0ZWQudGltZXMgPSB0aW1lcztcbiAgICAgIGNvbnN0IG5hbWVzID0gT2JqZWN0LmtleXModGltZXMpO1xuICAgICAgT2JqZWN0LnZhbHVlcyh0aW1lcykuZm9yRWFjaCgodGltZSwgaSkgPT4ge1xuICAgICAgICBjb25zdCB2YWwgPSBPYmplY3QudmFsdWVzKHRpbWUpO1xuICAgICAgICBjb25zdCBoaG1tc3MgPSBPYmplY3QudmFsdWVzKHZhbFswXSk7XG4gICAgICAgIGRheVNlbGVjdGVkLnRpbWVzW25hbWVzW2ldXS5VVEMgPSBodW1hbmRhdGVUb1VUQyhkYXlTZWxlY3RlZC5odW1hbmRhdGUsIGhobW1zcyk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGh1bWFuZGF0ZVRvVVRDIChodW1hbmRhdGUsIHRpbWUpIHtcbiAgICBjb25zdCBoaCA9ICh0aW1lWzBdKSA/IHRpbWVbMF0gOiAwO1xuICAgIGNvbnN0IG1tID0gKHRpbWVbMV0pID8gdGltZVsxXSA6IDA7XG4gICAgY29uc3Qgc3MgPSAodGltZVsyXSkgPyB0aW1lWzJdIDogMDtcblxuICAgIGxldCBpbnRzID0gaHVtYW5kYXRlLnNwbGl0KCctJyk7XG4gICAgaW50cyA9IGludHMubWFwKChpbnQpID0+IHBhcnNlSW50KGludCkpO1xuICAgIGludHNbMV0gPSBpbnRzWzFdIC0gMTtcbiAgICByZXR1cm4gRGF0ZS5VVEMoaW50c1swXSwgaW50c1sxXSwgaW50c1syXSwgaGgsIG1tLCBzcyk7XG4gIH1cblxuICBmdW5jdGlvbiByZW1vdmVUaW1lVmFsdWVzT25EYXRlICgpIHtcbiAgICBjb25zdCBkID0gZHluYW1pY0RhdGEuZGF0ZXNTZWxlY3RlZEFycmF5T2JqZWN0cztcbiAgICBjb25zdCBsYXN0Q2hvaWNlID0gZFtkLmxlbmd0aCAtIDFdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGFzdENob2ljZS5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgZGF0ZU9iaiA9IGxhc3RDaG9pY2VbaV07XG4gICAgICBjb25zdCBkYXlEaXYgPSBjYWxlbmRhci5xdWVyeVNlbGVjdG9yKGBbZGF0YS1odW1hbmRhdGU9JyR7ZGF0ZU9iai5odW1hbmRhdGV9J11gKTtcbiAgICAgIGRheURpdi5yZW1vdmVDaGlsZChkYXlEaXYubGFzdENoaWxkKTtcbiAgICAgIGRhdGVPYmoudGltZXMgPSBkYXRlT2JqLnRpbWVzLnNsaWNlKDAsIC0yKTtcbiAgICB9XG4gICAgc2VsZWN0aW9uID0gc2VsZWN0aW9uLnNsaWNlKDAsIC0yKTtcbiAgICBjb25zdCB0aW1lQ2hvb3NlciA9IGNhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoJy50aW1lQ2hvb3NlcicpO1xuICAgIHRpbWVDaG9vc2VyLnJlbW92ZUNoaWxkKHRpbWVDaG9vc2VyLmxhc3RDaGlsZCk7XG4gIH1cblxuICAvKipcbiAgICogdGlja0JveGVzIC0gZGVzY3JpcHRpb25cbiAgICpcbiAgICogQHBhcmFtICB7SFRNTEVsZW1lbnR9IHRpbWVQaWNrZXJFbGVtZW50c0NvbnRhaW5lciBUaGlzIGlzIHRoZSBIVE1MIGVsZW1lbnQgdG8gd2hpY2ggdGhlIGNoZWNrYm94IHdpbGwgYmUgYXBwZW5kZWQuXG4gICAqIEByZXR1cm4ge0hUTUxFbGVtZW50fSBSZXR1cm5zIGEgSFRNTCBjaGVja2JveCB0byBzZWxlY3QgYWxsIGRheXMgb2YgYSBwYXJ0aWN1bGFyIHR5cGUgKGUuZy4gYWxsIE1vbmRheXMpLlxuICAgKiBAZGVzY3JpcHRpb24gTk9UIElNUExFTUVOVEVEXG4gICAqL1xuXG4gIGZ1bmN0aW9uIHNldFRpbWVGb3JBbGxUaWNrQm94ICh0YXJnZXREaXYpIHtcbiAgICBjb25zdCBkYXkgPSBkeW5hbWljRGF0YS5kYXRlc1NlbGVjdGVkQXJyYXlbZHluYW1pY0RhdGEuZGF0ZXNTZWxlY3RlZEFycmF5Lmxlbmd0aCAtIDFdO1xuICAgIGNvbnN0IGRheUNvZGUgPSBjYWxlbmRhci5xdWVyeVNlbGVjdG9yKGBbZGF0YS1odW1hbmRhdGU9JyR7ZGF5fSddYCkuZGF0YXNldC5kYXlvZndlZWs7XG4gICAgY29uc3QgdGV4dCA9IGZvcm1hdERheVRleHQoZGF5Q29kZSk7XG5cbiAgICBjb25zdCBsYWJlbGZvciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICBsYWJlbGZvci50ZXh0Q29udGVudCA9IHRleHQ7XG4gICAgbGFiZWxmb3IuaHRtbEZvciA9ICdzZXRUaW1lRm9yQWxsJztcbiAgICB0YXJnZXREaXYuYXBwZW5kQ2hpbGQobGFiZWxmb3IpO1xuXG4gICAgY29uc3Qgc2V0VGltZUZvckFsbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgc2V0VGltZUZvckFsbC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAnY2hlY2tib3gnKTtcbiAgICBzZXRUaW1lRm9yQWxsLm5hbWUgPSAnc2V0VGltZUZvckFsbCc7XG4gICAgdGFyZ2V0RGl2LmFwcGVuZENoaWxkKHNldFRpbWVGb3JBbGwpO1xuXG4gICAgc2V0VGltZUZvckFsbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIC8vIEJvb2sgZGF0ZXMgbWV0aG9kIG5lZWRzIHRvIGJlIGV4cG9zZWQgaW4gYSBtYW5uZXIgaXQgY2FuIGJlIGNhbGxlZCBmcm9tIGhlcmVcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICogRm9ybWF0cyB0aGUgZGF5IG9mIHRoZSB3ZWVrIGFuZCByZXR1cm5zIGl0IGFzIGEgc3RyaW5nLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0QmVmb3JlIC0gVGhlIHRleHQgdG8gYmUgYWRkZWQgYmVmb3JlIHRoZSBmb3JtYXR0ZWQgZGF5LlxuICogQHBhcmFtIHtzdHJpbmd9IHRleHRBZnRlciAtIFRoZSB0ZXh0IHRvIGJlIGFkZGVkIGFmdGVyIHRoZSBmb3JtYXR0ZWQgZGF5LlxuICogQHBhcmFtIHtudW1iZXJ9IGRheU9mV2VlayAtIFRoZSBpbmRleCBvZiB0aGUgZGF5IG9mIHRoZSB3ZWVrICgwIGZvciBTdW5kYXksIDEgZm9yIE1vbmRheSwgZXRjLikuXG4gKiBAcmV0dXJuIHtzdHJpbmd9IFRoZSBmb3JtYXR0ZWQgZGF5IG9mIHRoZSB3ZWVrIGFzIGEgc3RyaW5nLlxuICovXG4gIGZ1bmN0aW9uIGZvcm1hdERheVRleHQgKGRheU9mV2Vlaykge1xuICAgIGNvbnN0IGRheXNJbkZ1bGwgPSBsYW5ndWFnZXNbY29uZmlnLmxhbmd1YWdlXS5nZW5lcmFsVGltZS5kYXlzSW5GdWxsO1xuICAgIGNvbnN0IGJlZm9yZVRleHQgPSBsYW5ndWFnZXNbY29uZmlnLmxhbmd1YWdlXS5mb3JtYXREYXlUZXh0LnRleHRCZWZvcmU7XG4gICAgY29uc3QgZm9ybWF0dGVkRGF5ID0gZGF5c0luRnVsbFtkYXlPZldlZWtdO1xuICAgIGNvbnN0IHBsdXJhbGlzbSA9IGxhbmd1YWdlc1tjb25maWcubGFuZ3VhZ2VdLnBsdXJhbGlzbTtcbiAgICBjb25zdCBhZnRlclRleHQgPSBsYW5ndWFnZXNbY29uZmlnLmxhbmd1YWdlXS5mb3JtYXREYXlUZXh0LnRleHRBZnRlcjtcbiAgICByZXR1cm4gYCR7YmVmb3JlVGV4dH0gJHtmb3JtYXR0ZWREYXl9JHtwbHVyYWxpc219ICR7YWZ0ZXJUZXh0fWA7XG4gIH1cbn1cblxuZXhwb3J0IHsgR2VuZXJhdGVUaW1lQ2hvb3Nlck1vZGFsIH07XG4iLCIvKmVzbGludCBxdW90ZXM6IFtcImVycm9yXCIsIFwiYmFja3RpY2tcIl0qL1xuLy8gQmFjdGlja3MgYXJlIGVuZm9yY2VkZiBpbiB0aGlzIGZpbGUgc28gdGhhdCBzcGVjaWFsIGNoYXJhY3RlcnMgYXJlIGNvcnJlY3RseSByZW5kZXJlZC5cbi8qIExhbmd1YWdlIGRlZmF1bHRzICovXG5jb25zdCBlbkdiID0ge1xuICBnZW5lcmFsVGltZToge1xuICAgIG1vbnRoczogW2BKYW51YXJ5YCwgYEZlYnJ1YXJ5YCwgYE1hcmNoYCwgYEFwcmlsYCwgYE1heWAsIGBKdW5lYCwgYEp1bHlgLCBgQXVndXN0YCwgYFNlcHRlbWJlcmAsIGBPY3RvYmVyYCwgYE5vdmVtYmVyYCwgYERlY2VtYmVyYF0sXG4gICAgZGF5c0luRnVsbDogW2BTdW5kYXlgLCBgTW9uZGF5YCwgYFR1ZXNkYXlgLCBgV2VkbmVzZGF5YCwgYFRodXJzZGF5YCwgYEZyaWRheWAsIGBTYXR1cmRheWBdLFxuICAgIGRheXNUcnVuY2F0ZWQ6IFtgU3VuYCwgYE1vbmAsIGBUdWVgLCBgV2VkYCwgYFRodWAsIGBGcmlgLCBgU2F0YF1cbiAgfSxcbiAgcGx1cmFsaXNtOiBgc2AsXG4gIGZvcm1hdERheVRleHQ6IHtcbiAgICB0ZXh0QmVmb3JlOiBgU2V0IHRoZXNlIHRpbWVzIGZvciBhbGxgLFxuICAgIHRleHRBZnRlcjogYGBcbiAgfSxcbiAgdGltZVdpZGdldDoge1xuICAgIGFkZFRpbWU6IGBBZGQgdGltZTpgLFxuICAgIHN0YXJ0OiBgU3RhcnRgLFxuICAgIGVuZDogYEVuZGBcbiAgfVxufTtcblxuLyogTGFuZ3VhZ2UgZGVmYXVsdHMgKi9cbmNvbnN0IHB0UHQgPSB7XG4gIGdlbmVyYWxUaW1lOiB7XG4gICAgbW9udGhzOiBbYEphbmVpcm9gLCBgRmV2ZXJlaXJvYCwgYE1hcsOnb2AsIGBBYnJpbGAsIGBNYWlvYCwgYEp1bmhvYCwgYEp1bGhvYCwgYEFnb3N0b2AsIGBTZXRlbWJyb2AsIGBPdXR1YnJvYCwgYE5vdmVtYnJvYCwgYERlemVtYnJvYF0sXG4gICAgZGF5c0luRnVsbDogW2BEb21pbmdvYCwgYFNlZ3VuZGEtRmVpcmFgLCBgVGVyw6dhLUZlaXJhYCwgYFF1YXJ0YS1GZWlyYWAsIGBRdWludGEtRmVpcmFgLCBgU2V4dGEtRmVpcmFgLCBgU8OhYmFkb2BdLFxuICAgIGRheXNUcnVuY2F0ZWQ6IFtgRG9tYCwgYFNlZ2AsIGBUZXJgLCBgUXVhYCwgYFF1aWAsIGBTZXhgLCBgU2FiYF1cbiAgfSxcbiAgcGx1cmFsaXNtOiBgc2AsXG4gIGZvcm1hdERheVRleHQ6IHtcbiAgICB0ZXh0QmVmb3JlOiBgQXBwbGlxdWUgZXN0YXMgaG9yYXMgYWAsXG4gICAgdGV4dEFmdGVyOiBgYFxuICB9LFxuICB0aW1lV2lkZ2V0OiB7XG4gICAgYWRkVGltZTogYEFkaWNpb25lIGR1cmHDp8OjbzpgLFxuICAgIHN0YXJ0OmBJbsOtY2lvYCxcbiAgICBlbmQ6IGBGaW1gXG4gIH1cblxufTtcblxuY29uc3QgbGFuZ3VhZ2VzID0geyBlbkdiLCBwdFB0IH07XG5cbmV4cG9ydCB7IGxhbmd1YWdlcyB9O1xuIiwiY29uc3QgY29sb3VycyA9IHtcbiAgbW9udGhDb2xvcjogJyNmYzMnLFxuICBtb250aEJhY2tnb3VuZEJvbG9yOiAnIzY3OTljYicsXG4gIGRheU5hbWVDb2xvcjogJyMwMDAnLFxuICBkYXlOYW1lQmFja2dyb3VuZENvbG9yOiAnI2NjYycsXG4gIGRheUNvbG9yOiAnIzAwMCcsXG4gIGRheUJhY2tncm91bmRDb2xvcjogJyNmZmYnLFxuICBtb250aEJvcmRlckNvbG9yOiAnI2YxNTkyNSdcbn07XG5cbmNvbnN0IHNlbGVjdGVkU3R5bGUgPSAoZGl2KSA9PiB7XG4gIGRpdi5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBjb2xvdXJzLm1vbnRoQ29sb3I7XG59O1xuXG5jb25zdCB1bnNlbGVjdGVkU3R5bGUgPSAoZGl2KSA9PiB7XG4gIGRpdi5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBjb2xvdXJzLmRheUJhY2tncm91bmRDb2xvcjtcbn07XG5cbmV4cG9ydCB7IHNlbGVjdGVkU3R5bGUsIHVuc2VsZWN0ZWRTdHlsZSwgY29sb3VycyB9O1xuIl19
