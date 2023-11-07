(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.calendar = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
        //day.classList.add('widthShape', 'filler');
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

},{"./basicFunctions.js":1,"./calendarApp.css":2,"./displayTimeChooserModal.js":4,"./languages.js":5,"./styles.js":6}],4:[function(require,module,exports){
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

},{"./languages.js":5}],5:[function(require,module,exports){
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwcmVCdW5kbGluZ0pTL2Jhc2ljRnVuY3Rpb25zLmpzIiwicHJlQnVuZGxpbmdKUy9jYWxlbmRhckFwcC5jc3MiLCJwcmVCdW5kbGluZ0pTL2NhbGVuZGFyR2VuZXJhdG9yLmpzIiwicHJlQnVuZGxpbmdKUy9kaXNwbGF5VGltZUNob29zZXJNb2RhbC5qcyIsInByZUJ1bmRsaW5nSlMvbGFuZ3VhZ2VzLmpzIiwicHJlQnVuZGxpbmdKUy9zdHlsZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDQUEsSUFBQSxPQUFBLEdBQUEsT0FBQTtBQUE4QyxTQUFBLGVBQUEsR0FBQSxFQUFBLENBQUEsV0FBQSxlQUFBLENBQUEsR0FBQSxLQUFBLHFCQUFBLENBQUEsR0FBQSxFQUFBLENBQUEsS0FBQSwyQkFBQSxDQUFBLEdBQUEsRUFBQSxDQUFBLEtBQUEsZ0JBQUE7QUFBQSxTQUFBLGlCQUFBLGNBQUEsU0FBQTtBQUFBLFNBQUEsNEJBQUEsQ0FBQSxFQUFBLE1BQUEsU0FBQSxDQUFBLHFCQUFBLENBQUEsc0JBQUEsaUJBQUEsQ0FBQSxDQUFBLEVBQUEsTUFBQSxPQUFBLENBQUEsR0FBQSxNQUFBLENBQUEsU0FBQSxDQUFBLFFBQUEsQ0FBQSxJQUFBLENBQUEsQ0FBQSxFQUFBLEtBQUEsYUFBQSxDQUFBLGlCQUFBLENBQUEsQ0FBQSxXQUFBLEVBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxXQUFBLENBQUEsSUFBQSxNQUFBLENBQUEsY0FBQSxDQUFBLG1CQUFBLEtBQUEsQ0FBQSxJQUFBLENBQUEsQ0FBQSxPQUFBLENBQUEsK0RBQUEsSUFBQSxDQUFBLENBQUEsVUFBQSxpQkFBQSxDQUFBLENBQUEsRUFBQSxNQUFBO0FBQUEsU0FBQSxrQkFBQSxHQUFBLEVBQUEsR0FBQSxRQUFBLEdBQUEsWUFBQSxHQUFBLEdBQUEsR0FBQSxDQUFBLE1BQUEsRUFBQSxHQUFBLEdBQUEsR0FBQSxDQUFBLE1BQUEsV0FBQSxDQUFBLE1BQUEsSUFBQSxPQUFBLEtBQUEsQ0FBQSxHQUFBLEdBQUEsQ0FBQSxHQUFBLEdBQUEsRUFBQSxDQUFBLElBQUEsSUFBQSxDQUFBLENBQUEsSUFBQSxHQUFBLENBQUEsQ0FBQSxVQUFBLElBQUE7QUFBQSxTQUFBLHNCQUFBLENBQUEsRUFBQSxDQUFBLFFBQUEsQ0FBQSxXQUFBLENBQUEsZ0NBQUEsTUFBQSxJQUFBLENBQUEsQ0FBQSxNQUFBLENBQUEsUUFBQSxLQUFBLENBQUEsNEJBQUEsQ0FBQSxRQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBLE9BQUEsQ0FBQSxPQUFBLENBQUEsaUJBQUEsQ0FBQSxJQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsSUFBQSxDQUFBLENBQUEsR0FBQSxJQUFBLFFBQUEsQ0FBQSxRQUFBLE1BQUEsQ0FBQSxDQUFBLE1BQUEsQ0FBQSxVQUFBLENBQUEsdUJBQUEsQ0FBQSxJQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsSUFBQSxDQUFBLENBQUEsR0FBQSxJQUFBLE1BQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxDQUFBLENBQUEsS0FBQSxHQUFBLENBQUEsQ0FBQSxNQUFBLEtBQUEsQ0FBQSxHQUFBLENBQUEsaUJBQUEsQ0FBQSxJQUFBLENBQUEsT0FBQSxDQUFBLEdBQUEsQ0FBQSx5QkFBQSxDQUFBLFlBQUEsQ0FBQSxlQUFBLENBQUEsR0FBQSxDQUFBLGNBQUEsTUFBQSxDQUFBLENBQUEsTUFBQSxDQUFBLDJCQUFBLENBQUEsUUFBQSxDQUFBLGFBQUEsQ0FBQTtBQUFBLFNBQUEsZ0JBQUEsR0FBQSxRQUFBLEtBQUEsQ0FBQSxPQUFBLENBQUEsR0FBQSxVQUFBLEdBQUE7QUFFOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyxTQUFTLENBQUUsSUFBSSxFQUFFO0VBQ3hCLElBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDO0VBQ2pD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QUEsYUFBQSxDQUFBLGlCQUFBLENBQUEsQ0FBQSxXQUFBLEVBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxXQUFBLENBQUEsSUFBQSxNQUFBLENBQUEsY0FBQSxDQUFBLG1CQUFBLEtBQUEsQ0FBQSxJQUFBLENBQUEsQ0FBQSxPQUFBLENBQUEsK0RBQUEsSUFBQSxDQUFBLENBQUEsVUFBQSxpQkFBQSxDQUFBLENBQUEsRUFBQSxNQUFBO0FBQUEsU0FBQSxrQkFBQSxHQUFBLEVBQUEsR0FBQSxRQUFBLEdBQUEsWUFBQSxHQUFBLEdBQUEsR0FBQSxDQUFBLE1BQUEsRUFBQSxHQUFBLEdBQUEsR0FBQSxDQUFBLE1BQUEsV0FBQSxDQUFBLE1BQUEsSUFBQSxPQUFBLEtBQUEsQ0FBQSxHQUFBLEdBQUEsQ0FBQSxHQUFBLEdBQUEsRUFBQSxDQUFBLElBQUEsSUFBQSxDQUFBLENBQUEsSUFBQSxHQUFBLENBQUEsQ0FBQSxVQUFBLElBQUE7QUFBQSxTQUFBLHNCQUFBLENBQUEsRUFBQSxDQUFBLFFBQUEsQ0FBQSxXQUFBLENBQUEsZ0NBQUEsTUFBQSxJQUFBLENBQUEsQ0FBQSxNQUFBLENBQUEsUUFBQSxLQUFBLENBQUEsNEJBQUEsQ0FBQSxRQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBLE9BQUEsQ0FBQSxPQUFBLENBQUEsaUJBQUEsQ0FBQSxJQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsSUFBQSxDQUFBLENBQUEsR0FBQSxJQUFBLFFBQUEsQ0FBQSxRQUFBLE1BQUEsQ0FBQSxDQUFBLE1BQUEsQ0FBQSxVQUFBLENBQUEsdUJBQUEsQ0FBQSxJQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsSUFBQSxDQUFBLENBQUEsR0FBQSxJQUFBLE1BQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxDQUFBLENBQUEsS0FBQSxHQUFBLENBQUEsQ0FBQSxNQUFBLEtBQUEsQ0FBQSxHQUFBLENBQUEsaUJBQUEsQ0FBQSxJQUFBLENBQUEsT0FBQSxDQUFBLEdBQUEsQ0FBQSx5QkFBQSxDQUFBLFlBQUEsQ0FBQSxlQUFBLENBQUEsR0FBQSxDQUFBLGNBQUEsTUFBQSxDQUFBLENBQUEsTUFBQSxDQUFBLDJCQUFBLENBQUEsUUFBQSxDQUFBLGFBQUEsQ0FBQTtBQUFBLFNBQUEsZ0JBQUEsR0FBQSxRQUFBLEtBQUEsQ0FBQSxPQUFBLENBQUEsR0FBQSxVQUFBLEdBQUE7QUFBQSxTQUFBLFFBQUEsQ0FBQSxzQ0FBQSxPQUFBLHdCQUFBLE1BQUEsdUJBQUEsTUFBQSxDQUFBLFFBQUEsYUFBQSxDQUFBLGtCQUFBLENBQUEsZ0JBQUEsQ0FBQSxXQUFBLENBQUEseUJBQUEsTUFBQSxJQUFBLENBQUEsQ0FBQSxXQUFBLEtBQUEsTUFBQSxJQUFBLENBQUEsS0FBQSxNQUFBLENBQUEsU0FBQSxxQkFBQSxDQUFBLEtBQUEsT0FBQSxDQUFBLENBQUE7QUFBQSxTQUFBLGtCQUFBLE1BQUEsRUFBQSxLQUFBLGFBQUEsQ0FBQSxNQUFBLENBQUEsR0FBQSxLQUFBLENBQUEsTUFBQSxFQUFBLENBQUEsVUFBQSxVQUFBLEdBQUEsS0FBQSxDQUFBLENBQUEsR0FBQSxVQUFBLENBQUEsVUFBQSxHQUFBLFVBQUEsQ0FBQSxVQUFBLFdBQUEsVUFBQSxDQUFBLFlBQUEsd0JBQUEsVUFBQSxFQUFBLFVBQUEsQ0FBQSxRQUFBLFNBQUEsTUFBQSxDQUFBLGNBQUEsQ0FBQSxNQUFBLEVBQUEsY0FBQSxDQUFBLFVBQUEsQ0FBQSxHQUFBLEdBQUEsVUFBQTtBQUFBLFNBQUEsYUFBQSxXQUFBLEVBQUEsVUFBQSxFQUFBLFdBQUEsUUFBQSxVQUFBLEVBQUEsaUJBQUEsQ0FBQSxXQUFBLENBQUEsU0FBQSxFQUFBLFVBQUEsT0FBQSxXQUFBLEVBQUEsaUJBQUEsQ0FBQSxXQUFBLEVBQUEsV0FBQSxHQUFBLE1BQUEsQ0FBQSxjQUFBLENBQUEsV0FBQSxpQkFBQSxRQUFBLG1CQUFBLFdBQUE7QUFBQSxTQUFBLGVBQUEsR0FBQSxRQUFBLEdBQUEsR0FBQSxZQUFBLENBQUEsR0FBQSxvQkFBQSxPQUFBLENBQUEsR0FBQSxpQkFBQSxHQUFBLEdBQUEsTUFBQSxDQUFBLEdBQUE7QUFBQSxTQUFBLGFBQUEsS0FBQSxFQUFBLElBQUEsUUFBQSxPQUFBLENBQUEsS0FBQSxrQkFBQSxLQUFBLGtCQUFBLEtBQUEsTUFBQSxJQUFBLEdBQUEsS0FBQSxDQUFBLE1BQUEsQ0FBQSxXQUFBLE9BQUEsSUFBQSxLQUFBLFNBQUEsUUFBQSxHQUFBLEdBQUEsSUFBQSxDQUFBLElBQUEsQ0FBQSxLQUFBLEVBQUEsSUFBQSxvQkFBQSxPQUFBLENBQUEsR0FBQSx1QkFBQSxHQUFBLFlBQUEsU0FBQSw0REFBQSxJQUFBLGdCQUFBLE1BQUEsR0FBQSxNQUFBLEVBQUEsS0FBQTtBQUFBLFNBQUEsZ0JBQUEsUUFBQSxFQUFBLFdBQUEsVUFBQSxRQUFBLFlBQUEsV0FBQSxlQUFBLFNBQUE7QUFBQSxTQUFBLFVBQUEsUUFBQSxFQUFBLFVBQUEsZUFBQSxVQUFBLG1CQUFBLFVBQUEsdUJBQUEsU0FBQSwwREFBQSxRQUFBLENBQUEsU0FBQSxHQUFBLE1BQUEsQ0FBQSxNQUFBLENBQUEsVUFBQSxJQUFBLFVBQUEsQ0FBQSxTQUFBLElBQUEsV0FBQSxJQUFBLEtBQUEsRUFBQSxRQUFBLEVBQUEsUUFBQSxRQUFBLFlBQUEsYUFBQSxNQUFBLENBQUEsY0FBQSxDQUFBLFFBQUEsaUJBQUEsUUFBQSxnQkFBQSxVQUFBLEVBQUEsZUFBQSxDQUFBLFFBQUEsRUFBQSxVQUFBO0FBQUEsU0FBQSxhQUFBLE9BQUEsUUFBQSx5QkFBQSxHQUFBLHlCQUFBLG9CQUFBLHFCQUFBLFFBQUEsS0FBQSxHQUFBLGVBQUEsQ0FBQSxPQUFBLEdBQUEsTUFBQSxNQUFBLHlCQUFBLFFBQUEsU0FBQSxHQUFBLGVBQUEsT0FBQSxXQUFBLEVBQUEsTUFBQSxHQUFBLE9BQUEsQ0FBQSxTQUFBLENBQUEsS0FBQSxFQUFBLFNBQUEsRUFBQSxTQUFBLFlBQUEsTUFBQSxHQUFBLEtBQUEsQ0FBQSxLQUFBLE9BQUEsU0FBQSxZQUFBLDBCQUFBLE9BQUEsTUFBQTtBQUFBLFNBQUEsMkJBQUEsSUFBQSxFQUFBLElBQUEsUUFBQSxJQUFB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OUIsWUFBWSxFQUFFLE1BQU07RUFDcEIsc0JBQXNCLEVBQUUsTUFBTTtFQUM5QixRQUFRLEVBQUUsTUFBTTtFQUNoQixrQkFBa0IsRUFBRSxNQUFNO0VBQzFCLGdCQUFnQixFQUFFO0FBQ3BCLENBQUM7QUFFRCxJQUFNLGFBQWEsR0FBQSxPQUFBLENBQUEsYUFBQSxHQUFHLFNBQWhCLGFBQWEsQ0FBSSxHQUFHLEVBQUs7RUFDN0IsR0FBRyxDQUFDLEtBQUssQ0FBQyxlQUFlLEdBQUcsT0FBTyxDQUFDLFVBQVU7QUFDaEQsQ0FBQztBQUVELElBQU0sZUFBZSxHQUFBLE9BQUEsQ0FBQSxlQUFBLEdBQUcsU0FBbEIsZUFBZSxDQUFJLEdBQUcsRUFBSztFQUMvQixHQUFHLENBQUMsS0FBSyxDQUFDLGVBQWUsR0FBRyxPQUFPLENBQUMsa0JBQWtCO0FBQ3hELENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJpbXBvcnQgeyB1bnNlbGVjdGVkU3R5bGUgfSBmcm9tICcuL3N0eWxlcy5qcyc7XG5cbi8qKlxuICogQWRkcyAxIHRvIHRoZSBtb250aCBpbiBhIGdpdmVuIGRhdGUgdG8gbWFrZSBpdCBtb3JlIGh1bWFuLXJlYWRhYmxlLlxuICogQHBhcmFtIHtzdHJpbmd9IGRhdGUgLSBUaGUgZGF0ZSBpbiB0aGUgZm9ybWF0ICdZWVlZLU1NLUREJyBvciAnWVlZWS1NLUQnLlxuICogQHJldHVybnMge3N0cmluZ30gLSBUaGUgbW9kaWZpZWQgZGF0ZSBpbiB0aGUgZm9ybWF0ICdZWVlZLU1NLUREJy5cbiAqIEB0aHJvd3Mge0Vycm9yfSAtIElmIHRoZSBkYXRlIHBhcmFtZXRlciBpcyBub3QgaW4gdGhlIGZvcm1hdCAnWVlZWS1NTS1ERCcgb3IgJ1lZWVktTS1EJy5cbiAqL1xuZnVuY3Rpb24gaHVtYW5EYXRlIChkYXRlKSB7XG4gIGNvbnN0IGRhdGVQYXJ0cyA9IGRhdGUuc3BsaXQoJy0nKTtcbiAgY29uc3QgbW9udGggPSBwYXJzZUludChkYXRlUGFydHNbMV0pICsgMTtcbiAgY29uc3QgZGF5ID0gcGFyc2VJbnQoZGF0ZVBhcnRzWzJdKTtcbiAgY29uc3QgbW9kaWZpZWRNb250aCA9IG1vbnRoIDwgMTAgPyBgMCR7bW9udGh9YCA6IG1vbnRoO1xuICBjb25zdCBtb2RpZmllZERheSA9IGRheSA8IDEwID8gYDAke2RheX1gIDogZGF5O1xuICBjb25zdCBtb2RpZmllZERhdGUgPSBgJHtkYXRlUGFydHNbMF19LSR7bW9kaWZpZWRNb250aH0tJHttb2RpZmllZERheX1gO1xuICByZXR1cm4gbW9kaWZpZWREYXRlO1xufVxuXG4vKipcbiAqIENvbnZlcnRzIGEgaHVtYW4gZGF0ZSBzdHJpbmcgdG8gVVRDIHRpbWVzdGFtcC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gaHVtYW5kYXRlIC0gVGhlIGh1bWFuLXJlYWRhYmxlIGRhdGUgc3RyaW5nIGluIHRoZSBmb3JtYXQgXCJZWVlZLU1NLUREXCIuXG4gKiBAcmV0dXJuIHtudW1iZXJ9IC0gVGhlIFVUQyB0aW1lc3RhbXAgaW4gbWlsbGlzZWNvbmRzLlxuICovXG5mdW5jdGlvbiBodW1hbmRhdGVUb1VUQyAoaHVtYW5kYXRlKSB7XG4gIGxldCBpbnRzID0gaHVtYW5kYXRlLnNwbGl0KCctJyk7XG4gIGludHMgPSBpbnRzLm1hcCgoaW50KSA9PiBwYXJzZUludChpbnQpKTtcbiAgaW50c1sxXSA9IGludHNbMV0gLSAxO1xuICByZXR1cm4gRGF0ZS5VVEMoaW50c1swXSwgaW50c1sxXSwgaW50c1syXSk7XG59XG5cbi8vIG1vZGVsIG9iamVjdFxuY29uc3QgZGF0ZU9iamVjdFRlbXBsYXRlID0geyBkYXk6ICdkYXknLCBodW1hbmRhdGU6ICdZWVlZLU1NLUREJywgaW5kZXg6ICcwJywgVVRDOiAxNjk4Mjc4NDAwMDAwfTtcbi8qKlxuICogQ3JlYXRlcyBhIHN0YW5kYXJkIGRhdGUgb2JqZWN0IHdpdGggdGhlIGdpdmVuIGRhdGUuXG4gKlxuICogQHBhcmFtIHthbnl9IGRhdGUgLSBJcyBhIHN0cmluZyBZWVlZLU1NLUREIG1vbnRocyBhcmUgY291bnRlZCBmcm9tIDAuXG4gKiBAcmV0dXJuIHtvYmplY3R9IFRoZSBzdGFuZGFyZCBkYXRlIG9iamVjdCB3aXRoIHRoZSBnaXZlbiBkYXRlLlxuICovXG5mdW5jdGlvbiBzdGFuZGFyZERhdGVPYmplY3QgKGRhdGUpIHtcbiAgY29uc3Qgb2JqID0gT2JqZWN0LmNyZWF0ZShkYXRlT2JqZWN0VGVtcGxhdGUpO1xuICBvYmouZGF5ID0gZGF0ZS5kYXRhc2V0LmRheTtcbiAgb2JqLmh1bWFuZGF0ZSA9ICBkYXRlLmRhdGFzZXQuaHVtYW5kYXRlO1xuICBvYmouaW5kZXggPSBkYXRlLmRhdGFzZXQuZGF5aW5kZXg7XG4gIG9iai5VVEMgPSBodW1hbmRhdGVUb1VUQyhkYXRlLmRhdGFzZXQuaHVtYW5kYXRlKTtcbiAgcmV0dXJuIG9iajtcbn1cblxuLyoqXG4gKiBDYWxjdWxhdGVzIHRoZSB0aW1lIHZhbHVlIGluIG1pbGxpc2Vjb25kcyBiYXNlZCBvbiB0aGUgZ2l2ZW4gdGltZS5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdGltZSAtIFRoZSB0aW1lIGluIHRoZSBmb3JtYXQgXCJISDpNTVwiLlxuICogQHJldHVybiB7bnVtYmVyfSBUaGUgdGltZSB2YWx1ZSBpbiBtaWxsaXNlY29uZHMuXG4gKlxuICogQGhhc1Rlc3RzXG4gKlxuICogQGV4YW1wbGVcbiAqIC8vIEV4YW1wbGUgdXNhZ2U6XG4gKiBjb25zdCB0aW1lVmFsdWUgPSB0aW1lVmFsdWVJbk1pbGwoJzEyOjMwJyk7XG4gKi9cblxuZnVuY3Rpb24gdGltZVZhbHVlSW5NaWxsICh0aW1lKSB7XG4gIGlmICghdGltZS5pbmNsdWRlcygnOicpKSB7XG4gICAgY29uc3QgZSA9IG5ldyBFcnJvcignRXhwZWN0cyBhIHRpbWUgc3RyaW5nIEhIOk1NJyk7XG4gICAgdGhyb3cgZTtcbiAgfVxuICBjb25zdCBbaG91cnMsIG1pbnV0ZXNdID0gdGltZS5zcGxpdCgnOicpO1xuICByZXR1cm4gKHBhcnNlSW50KGhvdXJzKSAqIDYwICogNjAgKiAxMDAwKSArIChwYXJzZUludChtaW51dGVzKSAqIDYwICogMTAwMCk7XG59XG5cbi8qKlxuICogZXREYXlzSW5Nb250aCAtIEdldCBudW1iZXIgb2YgZGF5cyBpbiBtb250aFxuICpcbiAqIEBwYXJhbSAgeyFudW1iZXJ9IG1vbnRoIFRoZSBudW1iZXIgb2YgdGhlIGNvcnJlc3BvbmRpbmcgbW9udGguXG4gKiBAcGFyYW0gIHshbnVtYmVyfSB5ZWFyICBUaGUgY29ycmVzcG9uZGluZyB5ZWFyLlxuICogQHJldHVybiB7bnVtYmVyfSBSZXR1cm5zIGEgbnVtYmVyIGNvcnJlc3BvbmRpbmcgdG8gdGhlIG51bWJlciBvZiBkYXlzIGZvciB0aGUgZGF0ZSBpbiBwb2ludC5cbiAqL1xuZnVuY3Rpb24gZ2V0RGF5c0luTW9udGggKG1vbnRoLCB5ZWFyKSB7XG4gIHJldHVybiBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMCkuZ2V0RGF0ZSgpO1xufVxuXG4vKipcbiAqIENsZWFycyB0aGUgc2VsZWN0aW9uIGluIHRoZSBjYWxlbmRhciBieSByZW1vdmluZyB0aGUgc2VsZWN0ZWQgZGF0ZXMgYW5kIFxuICogcmVzZXR0aW5nIHRoZSBkeW5hbWljIGRhdGEuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGNhbGVuZGFyIC0gVGhlIGNhbGVuZGFyIGNvbXBvbmVudC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBkeW5hbWljRGF0YSAtIFRoZSBkeW5hbWljIGRhdGEgb2JqZWN0LlxuICogQHJldHVybiB7dW5kZWZpbmVkfSBUaGlzIGZ1bmN0aW9uIGRvZXMgbm90IHJldHVybiBhIHZhbHVlLlxuICovXG5mdW5jdGlvbiBjbGVhclNlbGVjdGlvbiAoY2FsZW5kYXIsIGR5bmFtaWNEYXRhKSB7XG4gIGNvbnN0IGRhdGVzT2JqU3RvcmUgPSBkeW5hbWljRGF0YS5kYXRlc1NlbGVjdGVkQXJyYXlPYmplY3RzO1xuICBjb25zdCBkYXRlc0luZGV4ID0gZHluYW1pY0RhdGEuZGF0ZXNTZWxlY3RlZEFycmF5O1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0ZXNPYmpTdG9yZS5sZW5ndGg7IGkrKykge1xuICAgIGZvciAobGV0IGogPSAwOyBqIDwgZGF0ZXNJbmRleC5sZW5ndGg7IGorKykge1xuICAgICAgZGF0ZXNJbmRleFtqXS5mb3JFYWNoKChkYXRlKSA9PiB7XG4gICAgICAgIGNvbnN0IGRhdGVEaXYgPSBjYWxlbmRhci5xdWVyeVNlbGVjdG9yKGBbZGF0YS1odW1hbmRhdGU9JyR7ZGF0ZX0nXWApO1xuICAgICAgICB1bnNlbGVjdGVkU3R5bGUoZGF0ZURpdik7XG4gICAgICAgIHdoaWxlIChkYXRlRGl2LmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBkYXRlRGl2LnJlbW92ZUNoaWxkKGRhdGVEaXYubGFzdENoaWxkKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaSA9PT0gZGF0ZXNPYmpTdG9yZS5sZW5ndGggLSAxICYmIGogPT09IGRhdGVzSW5kZXgubGVuZ3RoIC0gMSkge1xuICAgICAgICAgIGRhdGVzT2JqU3RvcmUubGVuZ3RoID0gMDtcbiAgICAgICAgICBkYXRlc0luZGV4Lmxlbmd0aCA9IDA7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEBwYXJhbSB7bnVtYmVyfSBbbGVuZ3RoPTEwXSAtbGVuZ3RoIHRoZSBkZXNpcmVkIGxlbmd0aCBvZiB0aGUgc3RyaW5nIG9mIG51bWJlcnMuXG4gKiBAcmV0dXJucyBhIHN0cmluZyBvZiByYW5kb20gZGlnaXRzIG9mIGEgc3BlY2lmaWVkIGxlbmd0aC5cbiAqL1xuXG5mdW5jdGlvbiByYW5kb21CeXRlcyAobGVuZ3RoKSB7XG4gIGlmIChsZW5ndGggPiA4MCkge1xuICAgIGNvbnN0IGUgPSBuZXcgRXJyb3IoJ3JhbmRvbUJ5dGVzIGxlbmd0aCBjYW4gYmUgbW9yZSB0aGFuIDgwMCBkaWdpdHMnKTtcbiAgICB0aHJvdyBlO1xuICB9XG4gIGNvbnN0IGFycmF5ID0gbmV3IFVpbnQzMkFycmF5KDEwMCk7XG4gIHdpbmRvdy5jcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKGFycmF5KTtcbiAgbGV0IHN0ID0gJyc7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICBzdCArPSBhcnJheVtpXTtcbiAgICBpZiAoaSA9PT0gYXJyYXkubGVuZ3RoIC0gMSkge1xuICAgICAgcmV0dXJuIHN0LnNsaWNlKHN0Lmxlbmd0aCAtIChsZW5ndGggfHwgMTApKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2VuZXJhdGVSYW5kb21TdHJpbmcoKSB7XG4gIGNvbnN0IHJhbmRvbVN0cmluZyA9IHJhbmRvbUJ5dGVzKDEwKTtcbiAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjYWxlbmRhci0nICsgcmFuZG9tU3RyaW5nKSkge1xuICAgIHJldHVybiBnZW5lcmF0ZVJhbmRvbVN0cmluZygpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiByYW5kb21TdHJpbmc7XG4gIH1cbn1cblxuLy9XRSBXRVJFIFNFVFRJTkcgVVAgVEhFIENBTEVOREFSIFRPIFJFTkRFUiBEQVRFUyBJTiBUSEUgUEFTVDpcbi8qIFdhcm5pbmc6IENvbnRlbXBsYXRlcyBkYXlsaWdodCBzYXZpbmcgdGltZSovXG5cbi8qKlxuICogQ2FsY3VsYXRlcyBhbmQgcmV0dXJucyB0aGUgZWFybGllc3QgZGF0ZSBmcm9tIGEgZ2l2ZW4gYXJyYXkgb2YgcHJlbG9hZGVkIGRhdGVzLlxuICpcbiAqIEBwYXJhbSB7QXJyYXl9IHByZWxvYWRlZERhdGVzIC0gQW4gYXJyYXkgb2YgcHJlbG9hZGVkIGRhdGVzLlxuICogQHJldHVybiB7RGF0ZX0gVGhlIGVhcmxpZXN0IGRhdGUgZnJvbSB0aGUgcHJlbG9hZGVkIGRhdGVzLlxuICovXG5mdW5jdGlvbiBnZXRFYXJsaWVzdERhdGUgKHByZWxvYWRlZERhdGVzKSB7XG4gIGNvbnN0IG9yZGVyID0gW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcHJlbG9hZGVkRGF0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoaSA9PT0gMCkge1xuICAgICAgb3JkZXIucHVzaChuZXcgRGF0ZSgpLmdldFRpbWUoKSk7XG4gICAgfVxuICAgIG9yZGVyLnB1c2gobmV3IERhdGUocHJlbG9hZGVkRGF0ZXNbaV0pLmdldFRpbWUoKSk7XG4gICAgaWYgKGkgPT09IHByZWxvYWRlZERhdGVzLmxlbmd0aCAtIDEpIHtcbiAgICAgIG9yZGVyLnNvcnQoKTtcbiAgICAgIGNvbnN0IGQgPSBuZXcgRGF0ZShvcmRlclswXSk7XG4gICAgICByZXR1cm4gZDtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBHZW5lcmF0ZXMgYSBmdW5jdGlvbiBjb21tZW50IGZvciB0aGUgZ2l2ZW4gZnVuY3Rpb24gYm9keSBpbiBhIG1hcmtkb3duXG4gKiBjb2RlIGJsb2NrIHdpdGggdGhlIGNvcnJlY3QgbGFuZ3VhZ2Ugc3ludGF4LlxuICpcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGNhbGVuZGFyIC0gVGhlIGNhbGVuZGFyIGNvbXBvbmVudC5cbiAqIEBwYXJhbSB7QXJyYXl9IGRhdGVzT3BlbiAtIEFuIGFycmF5IG9mIG9wZW4gZGF0ZXMuXG4gKi9cbmZ1bmN0aW9uIGJsb2NrRGF5c05vdE9wZW4gKGNhbGVuZGFyLCBkYXRlc09wZW4pIHtcbiAgaWYgKGNhbGVuZGFyICYmIGRhdGVzT3Blbikge1xuICAgIGNvbnN0IGFsbERheXMgPSBBcnJheS5mcm9tKGNhbGVuZGFyLnF1ZXJ5U2VsZWN0b3JBbGwoJy5kYXlUaW1lJykpLm1hcCgoZWwpID0+IHsgcmV0dXJuIGVsLmRhdGFzZXQuaHVtYW5kYXRlOyB9KTtcbiAgICBjb25zdCBvcGVuRGF5cyA9IGRhdGVzT3Blbi5tYXAoKGVsKSA9PiB7IHJldHVybiBlbC5kYXk7IH0pO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhbGxEYXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAob3BlbkRheXMuaW5kZXhPZihhbGxEYXlzW2ldKSA9PT0gLTEpIHtcbiAgICAgICAgY29uc3QgZGF5ID0gY2FsZW5kYXIucXVlcnlTZWxlY3RvcihgW2lkPVwiJHthbGxEYXlzW2ldfVwiXWApO1xuICAgICAgICAvL2RheS5jbGFzc0xpc3QuYWRkKCd3aWR0aFNoYXBlJywgJ2ZpbGxlcicpO1xuICAgICAgICBkYXkuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJ3doaXRlJztcbiAgICAgICAgZGF5LnRpdGxlID0gJ0Nsb3NlZCBvbiB0aGlzIGRheSc7XG5cbiAgICAgICAgY29uc3QgY2xvc2VkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgICAgICBjbG9zZWQuY2xhc3NMaXN0LmFkZCgnY2FsZW5kYXJUaW1lJyk7XG4gICAgICAgIGNsb3NlZC50ZXh0Q29udGVudCA9ICdjbG9zZWQnO1xuXG4gICAgICAgIGRheS5hcHBlbmRDaGlsZChjbG9zZWQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5cbmZ1bmN0aW9uIHNvcnRUaW1lcyAodmFsKSB7XG4gIHZhciBzb3J0ZWQgPSBbXTtcbiAgcmV0dXJuIGVudW1lcmF0ZSh2YWwpO1xuXG4gIGZ1bmN0aW9uIHNvcnROdW1iZXIoYSwgYikge1xuICAgIHJldHVybiBhIC0gYjtcbiAgfVxuXG4gIGZ1bmN0aW9uIGVudW1lcmF0ZSh2YWx1ZXMpIHtcbiAgICB2YXIgbnVtZXJpY2FsRXF1aXZhbGVudCA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmFsdWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBudW1lcmljYWxFcXVpdmFsZW50LnB1c2godGltZVZhbHVlSW5NaWxsKHZhbHVlc1tpXSkpO1xuICAgICAgaWYgKGkgPT09IHZhbHVlcy5sZW5ndGggLSAxKSB7XG4gICAgICAgIHJldHVybiBzb3J0KHZhbHVlcywgbnVtZXJpY2FsRXF1aXZhbGVudCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gc29ydCh2YWx1ZXMsIG51bWVyaWNhbEVxdWl2YWxlbnQpIHtcbiAgICB2YXIgbnVtZXJpY2FsRXF1aXZhbGVudENsb25lID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShudW1lcmljYWxFcXVpdmFsZW50KSk7XG4gICAgdmFyIHNvcnRlZEludCA9IG51bWVyaWNhbEVxdWl2YWxlbnQuc29ydChzb3J0TnVtYmVyKTtcbiAgICBmb3IgKHZhciBwID0gMDsgcCA8IG51bWVyaWNhbEVxdWl2YWxlbnRDbG9uZS5sZW5ndGg7IHArKykge1xuICAgICAgdmFyIG5ld0luZGV4ID0gc29ydGVkSW50LmluZGV4T2YobnVtZXJpY2FsRXF1aXZhbGVudENsb25lW3BdKTtcbiAgICAgIHNvcnRlZC5zcGxpY2UocCwgMSwgdmFsdWVzW25ld0luZGV4XSk7XG4gICAgICBpZiAocCA9PT0gbnVtZXJpY2FsRXF1aXZhbGVudC5sZW5ndGggLSAxKSB7XG4gICAgICAgIHJldHVybiBzb3J0ZWQ7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogQ2hlY2tzIGZvciBvdmVybGFwIGluIGFuIGFycmF5IG9mIHZhbHVlcy5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSB2YWx1ZXMgLSBUaGUgYXJyYXkgb2YgdmFsdWVzIHRvIGNoZWNrIGZvciBvdmVybGFwLlxuICogQHJldHVybiB7Ym9vbGVhbn0gLSBSZXR1cm5zIHRydWUgaWYgb3ZlcmxhcCBpcyBmb3VuZCwgZmFsc2Ugb3RoZXJ3aXNlLlxuICogQEBkZXNjcmlwdGlvbiBub3QgY2FsbGVkIGFueXdoZXJlICh5ZXQpXG4gKi9cbmZ1bmN0aW9uIGNoZWNrT3ZlcmxhcCAodmFsdWVzKSB7XG4gIGNvbnN0IG51bWVyaWNhbEVxdWl2YWxlbnQgPSB2YWx1ZXMubWFwKHRpbWVWYWx1ZUluTWlsbCk7XG5cbiAgZm9yIChsZXQgY3VycmVudEluZGV4ID0gMjsgY3VycmVudEluZGV4IDwgbnVtZXJpY2FsRXF1aXZhbGVudC5sZW5ndGg7IGN1cnJlbnRJbmRleCArPSAyKSB7XG4gICAgY29uc3QgY3VycmVudFN0YXJ0ID0gbnVtZXJpY2FsRXF1aXZhbGVudFtjdXJyZW50SW5kZXhdO1xuICAgIGNvbnN0IGN1cnJlbnRFbmQgPSBudW1lcmljYWxFcXVpdmFsZW50W2N1cnJlbnRJbmRleCArIDFdO1xuXG4gICAgZm9yIChsZXQgY29tcGFyaXNvbkluZGV4ID0gMDsgY29tcGFyaXNvbkluZGV4IDwgbnVtZXJpY2FsRXF1aXZhbGVudC5sZW5ndGg7IGNvbXBhcmlzb25JbmRleCArPSAyKSB7XG4gICAgICBpZiAoY3VycmVudEluZGV4ICE9PSBjb21wYXJpc29uSW5kZXgpIHtcbiAgICAgICAgY29uc3QgY29tcGFyaXNvblN0YXJ0ID0gbnVtZXJpY2FsRXF1aXZhbGVudFtjb21wYXJpc29uSW5kZXhdO1xuICAgICAgICBjb25zdCBjb21wYXJpc29uRW5kID0gbnVtZXJpY2FsRXF1aXZhbGVudFtjb21wYXJpc29uSW5kZXggKyAxXTtcblxuICAgICAgICBpZiAoY29tcGFyaXNvbkVuZCA+PSBjdXJyZW50U3RhcnQgJiYgY29tcGFyaXNvbkVuZCA8PSBjdXJyZW50RW5kKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gZWxzZSBpZiAoY3VycmVudFN0YXJ0ID49IGNvbXBhcmlzb25TdGFydCAmJiBjdXJyZW50RW5kIDw9IGNvbXBhcmlzb25FbmQpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIGlmIChjdXJyZW50U3RhcnQgPT09IGNvbXBhcmlzb25TdGFydCAmJiBjdXJyZW50RW5kID09PSBjb21wYXJpc29uRW5kKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gZWxzZSBpZiAoY3VycmVudEVuZCA+PSBjb21wYXJpc29uU3RhcnQgJiYgY3VycmVudEVuZCA8PSBjb21wYXJpc29uRW5kKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuZXhwb3J0IHsgdGltZVZhbHVlSW5NaWxsLCBjaGVja092ZXJsYXAsIGNsZWFyU2VsZWN0aW9uLCBnZXREYXlzSW5Nb250aCwgXG4gIGdlbmVyYXRlUmFuZG9tU3RyaW5nLCBnZXRFYXJsaWVzdERhdGUsIGJsb2NrRGF5c05vdE9wZW4sIFxuICBzb3J0VGltZXMsIGh1bWFuRGF0ZSwgaHVtYW5kYXRlVG9VVEMsIHN0YW5kYXJkRGF0ZU9iamVjdCB9O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBcIi5jYWxlbmRhciB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZmxleC13cmFwOiB3cmFwO1xcbiAgZmxleC1kaXJlY3Rpb246IHJvdztcXG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjQwLCAyNDgsIDI1NSwgMCk7XFxuICB3aWR0aDogMTAwJTtcXG4gIGhlaWdodDogMjguOGVtO1xcbiAgb3ZlcmZsb3cteTogYXV0bztcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gIGNvbG9yOiAjMzMzO1xcbiAgZm9udC1mYW1pbHk6IFVidW50dSwgQXJpYWwsIEhlbHZldGljYSwgc2Fucy1zZXJpZjtcXG4gIGZvbnQtc2l6ZTogMS4yZW07XFxuICBmb250LXdlaWdodDogNzAwO1xcbiAgbGluZS1oZWlnaHQ6IDEuNTtcXG59XFxuLmNhbGVuZGFyIC5ibG9ja2VkIHtcXG4gIGJhY2tncm91bmQtY29sb3I6ICMzMzM7XFxufVxcbi5jYWxlbmRhciAuZmlsbGVyIHtcXG4gIHBvaW50ZXItZXZlbnRzOiBub25lO1xcbiAgb3BhY2l0eTogMC4zO1xcbn1cXG4uY2FsZW5kYXIgLnByZWxvYWRlZCB7XFxuICBib3JkZXItY29sb3I6IGJsdWU7XFxuICBib3JkZXItc3R5bGU6IHNvbGlkO1xcbiAgYm9yZGVyLXdpZHRoOiAzcHg7XFxufVxcbi5jYWxlbmRhciAudGltZVNlbGVjdCB7XFxuICBwYWRkaW5nOiAwO1xcbiAgd2lkdGg6IGF1dG87XFxuICBtYXJnaW46IDA7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmO1xcbiAgZmxvYXQ6IHJpZ2h0O1xcbiAgZm9udC13ZWlnaHQ6IDcwMDtcXG4gIGZvbnQtZmFtaWx5OiBBcmlhbCwgSGVsdmV0aWNhLCBzYW5zLXNlcmlmO1xcbiAgYm9yZGVyLXN0eWxlOiBzb2xpZDtcXG4gIGJvcmRlci1yYWRpdXM6IDFlbTtcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuICBib3JkZXItd2lkdGg6IDNweDtcXG4gIGJvcmRlci1jb2xvcjogI2YxNTkyNTtcXG4gIGNvbG9yOiAjMDAwO1xcbiAgZm9udC1zaXplOiAwLjllbTtcXG59XFxuLmNhbGVuZGFyIC50aW1lQ29udCB7XFxuICBtYXJnaW4tbGVmdDogYXV0bztcXG4gIG1heC13aWR0aDogMjBlbTtcXG4gIGJhY2tncm91bmQtY29sb3I6IGFsaWNlYmx1ZTtcXG4gIGJvcmRlci1zdHlsZTogc29saWQ7XFxuICBib3JkZXItY29sb3I6ICNmMTU5MjU7XFxuICBtYXJnaW4tcmlnaHQ6IGF1dG87XFxuICBtYXJnaW4tdG9wOiAxMGVtO1xcbn1cXG4uY2FsZW5kYXIgLmRheWJsb2Nrcm93IHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBmbGV4LWRpcmVjdGlvbjogcm93O1xcbiAgbWluLXdpZHRoOiAxMDAlO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogYWxpY2VibHVlO1xcbn1cXG4uY2FsZW5kYXIgLmNhbGVuZGFyVGltZVBhcmVudCB7XFxuICBtYXJnaW46IDAuMWVtO1xcbn1cXG4uY2FsZW5kYXIgLmNhbGVuZGFyVGltZVBhcmVudCAuY2FsZW5kYXJUaW1lIHtcXG4gIGZvbnQtc2l6ZTogMC45ZW07XFxuICBtYXJnaW4tdG9wOiAwZW07XFxuICBsaW5lLWhlaWdodDogMTtcXG4gIGJhY2tncm91bmQtY29sb3I6IGFsaWNlYmx1ZTtcXG4gIGNvbG9yOiBibGFjaztcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gIG1hcmdpbjogMHB4O1xcbiAgZm9udC1zaXplOiAwLjhlbTtcXG59XFxuLmNhbGVuZGFyIC53aWR0aFNoYXBlRGF5cyB7XFxuICB3aWR0aDogMTQuMjg1NzE0Mjg1NyU7XFxuICBtYXJnaW4tbGVmdDogYXV0bztcXG4gIG1hcmdpbi1yaWdodDogYXV0bztcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG59XFxuLmNhbGVuZGFyIC53aWR0aFNoYXBlIHtcXG4gIHdpZHRoOiAxNC4yODU3MTQyODU3JTtcXG4gIG1hcmdpbi1sZWZ0OiBhdXRvO1xcbiAgbWFyZ2luLXJpZ2h0OiBhdXRvO1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgbWluLWhlaWdodDogMy42ZW07XFxuICBtYXJnaW4tYm90dG9tOiAwLjJlbTtcXG59XFxuLmNhbGVuZGFyIC5tb250aE5hbWUge1xcbiAgbWFyZ2luOiBhdXRvO1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgZm9udC1mYW1pbHk6IFVidW50dTtcXG4gIGZvbnQtc2l6ZTogMS42MWVtO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogIzMzN2FiNztcXG4gIGNvbG9yOiAjZmZjYzMzO1xcbiAgZmxleC1iYXNpczogMTAwJTtcXG4gIGJvcmRlci1ib3R0b20tc3R5bGU6IHNvbGlkO1xcbn1cXG4uY2FsZW5kYXIgLndlZWtyb3cge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGZsZXgtd3JhcDogbm93cmFwO1xcbiAgZmxleC1kaXJlY3Rpb246IHJvdztcXG4gIGJhY2tncm91bmQtY29sb3I6ICNmZmY7XFxuICBmb250LWZhbWlseTogXFxcInJvYm90b1xcXCIsIFxcXCJhcmlhbFxcXCI7XFxufVxcbi5jYWxlbmRhciAuZGF5TmFtZSB7XFxuICBjb2xvcjogYmxhY2s7XFxuICBmb250LWZhbWlseTogXFxcInJvYm90b1xcXCIsIFxcXCJhcmlhbFxcXCI7XFxuICBmb250LXdlaWdodDogNjAwO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogI2NjYztcXG59XFxuLmNhbGVuZGFyIC5tb250aCA+ICoge1xcbiAgbWFyZ2luLWxlZnQ6IDJweDtcXG4gIG1hcmdpbi1yaWdodDogMnB4O1xcbn1cXG4uY2FsZW5kYXIgLm1vbnRoIHtcXG4gIHdpZHRoOiA1MCU7XFxuICBtaW4td2lkdGg6IDMwMHB4O1xcbiAgbWFyZ2luOiBhdXRvO1xcbn1cXG4uY2FsZW5kYXIgLnRpbWVDaG9vc2VyIHtcXG4gIHBvc2l0aW9uOiBzdGF0aWM7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiBhbGljZWJsdWU7XFxuICBtYXJnaW4tbGVmdDogYXV0bztcXG4gIG1hcmdpbi1yaWdodDogYXV0bztcXG59XFxuLmNhbGVuZGFyIC50aW1lQ29udGFpbmVyIHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxufVxcbi5jYWxlbmRhciAudGltZUNvbnRhaW5lciBkaXYge1xcbiAgZGlzcGxheTogZmxleDtcXG59XFxuLmNhbGVuZGFyIC50aW1lQ2hvb3Nlck1vZGFsIHtcXG4gIHotaW5kZXg6IDE7XFxuICB3aWR0aDogMTAwJTtcXG4gIGhlaWdodDogMTAwJTtcXG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMCwgMCwgMC40KTtcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIG1hcmdpbjogMDtcXG4gIHBhZGRpbmc6IDA7XFxuICBib3JkZXI6IDA7XFxuICBvdmVyZmxvdy14OiBzY3JvbGw7XFxufVxcbi5jYWxlbmRhciAuY2FsZW5kYXJMYWJlbCB7XFxuICBtaW4td2lkdGg6IDNlbTtcXG4gIHBhZGRpbmc6IDBlbSAxZW0gMGVtIDFlbTtcXG4gIGNvbG9yOiBibGFjaztcXG4gIGZvbnQtZmFtaWx5OiBcXFwicm9ib3RvXFxcIiwgXFxcImFyaWFsXFxcIjtcXG4gIGZvbnQtd2VpZ2h0OiA2MDA7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjY2NjO1xcbiAgbWFyZ2luOiAxZW0gMCAxZW0gMDtcXG59XFxuLmNhbGVuZGFyIC5kZWxldGVEaXYge1xcbiAgZm9udC1mYW1pbHk6IFVidW50dTtcXG4gIGJhY2tncm91bmQtY29sb3I6ICMzMzdhYjc7XFxuICBjb2xvcjogI2ZmY2MzMztcXG4gIGJvcmRlci1ib3R0b20tc3R5bGU6IHNvbGlkO1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG59XFxuLmNhbGVuZGFyIC5kZWxldGVCdXR0b24ge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogd2hpdGU7XFxuICBjb2xvcjogI2YxNTkyNTtcXG4gIGZsb2F0OiByaWdodDtcXG4gIGZvbnQtd2VpZ2h0OiA3MDA7XFxuICBmb250LWZhbWlseTogQXJpYWwsIEhlbHZldGljYSwgc2Fucy1zZXJpZjtcXG4gIGJvcmRlci1zdHlsZTogc29saWQ7XFxuICBib3JkZXItcmFkaXVzOiAyZW07XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICBoZWlnaHQ6IDJlbTtcXG4gIHdpZHRoOiAyZW07XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgbWFyZ2luOiAwIDAuNWVtO1xcbiAgZm9udC1zaXplOiAxLjVlbTtcXG59XFxuLmNhbGVuZGFyIC5pbm5lclNwYW5EZWxldGVCdG4ge1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbn1cXG4uY2FsZW5kYXIgLmRlbGV0ZUJ1dHRvbjpob3ZlcixcXG4uY2FsZW5kYXIgLmRlbGV0ZUJ1dHRvbjpmb2N1cyxcXG4uY2FsZW5kYXIgLnRpbWVTZWxlY3Q6aG92ZXIsXFxuLmNhbGVuZGFyIC50aW1lU2VsZWN0OmZvY3VzIHtcXG4gIGNvbG9yOiAjMDAwO1xcbiAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xcbiAgY3Vyc29yOiBwb2ludGVyO1xcbn1cXG4uY2FsZW5kYXIgLmhvdXIge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gIHdpZHRoOiAxMGVtO1xcbn1cXG4uY2FsZW5kYXIgLnRpbWVTZWxlY3RQIHtcXG4gIGRpc3BsYXk6IGlubGluZTtcXG4gIHdpZHRoOiA1ZW07XFxuICBjb2xvcjogIzAwMDtcXG59XFxuLmNhbGVuZGFyIC50aW1lQ2hvb3NlciA+IGlucHV0W3R5cGU9Y2hlY2tib3hdIHtcXG4gIG91dGxpbmU6ICNmMTU5MjU7XFxuICBvdXRsaW5lLXN0eWxlOiBzb2xpZDtcXG59XFxuLmNhbGVuZGFyIC50aW1lU2VsZWN0ID4gb3B0aW9uIHtcXG4gIGNvbG9yOiAjMDAwO1xcbn1cXG4uY2FsZW5kYXIgLmNhbGVuZGFyID4gcCxcXG4uY2FsZW5kYXIgaDQsXFxuLmNhbGVuZGFyIGgzLFxcbi5jYWxlbmRhciBoMixcXG4uY2FsZW5kYXIgaDEsXFxuLmNhbGVuZGFyIHNlbGVjdCxcXG4uY2FsZW5kYXIgb3B0aW9uIHtcXG4gIGNvbG9yOiAjMDAwO1xcbn1cXG4uY2FsZW5kYXIgLmFycm93LXVwIHtcXG4gIHdpZHRoOiAwO1xcbiAgaGVpZ2h0OiAwO1xcbiAgYm9yZGVyLWxlZnQ6IDEwcHggc29saWQgdHJhbnNwYXJlbnQ7XFxuICBib3JkZXItcmlnaHQ6IDEwcHggc29saWQgdHJhbnNwYXJlbnQ7XFxuICBib3JkZXItYm90dG9tOiAxMHB4IHNvbGlkIGJsYWNrO1xcbn1cXG4uY2FsZW5kYXIgLmFycm93LWRvd24ge1xcbiAgd2lkdGg6IDA7XFxuICBoZWlnaHQ6IDA7XFxuICBib3JkZXItbGVmdDogMTBweCBzb2xpZCB0cmFuc3BhcmVudDtcXG4gIGJvcmRlci1yaWdodDogMTBweCBzb2xpZCB0cmFuc3BhcmVudDtcXG4gIGJvcmRlci10b3A6IDEwcHggc29saWQgIzAwMDtcXG59XFxuLmNhbGVuZGFyIC5hcnJvd3Mge1xcbiAgZmxvYXQ6IHJpZ2h0O1xcbiAgY2xlYXI6IHJpZ2h0O1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgY3Vyc29yOiBwb2ludGVyO1xcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG59XFxuLmNhbGVuZGFyIC5hcnJvdy1yaWdodCB7XFxuICB3aWR0aDogMDtcXG4gIGhlaWdodDogMDtcXG4gIGJvcmRlci10b3A6IDYwcHggc29saWQgdHJhbnNwYXJlbnQ7XFxuICBib3JkZXItYm90dG9tOiA2MHB4IHNvbGlkIHRyYW5zcGFyZW50O1xcbiAgYm9yZGVyLWxlZnQ6IDYwcHggc29saWQgZ3JlZW47XFxufVxcbi5jYWxlbmRhciAuYXJyb3ctbGVmdCB7XFxuICB3aWR0aDogMDtcXG4gIGhlaWdodDogMDtcXG4gIGJvcmRlci10b3A6IDEwcHggc29saWQgdHJhbnNwYXJlbnQ7XFxuICBib3JkZXItYm90dG9tOiAxMHB4IHNvbGlkIHRyYW5zcGFyZW50O1xcbiAgYm9yZGVyLXJpZ2h0OiAxMHB4IHNvbGlkIGJsdWU7XFxufVxcbi5jYWxlbmRhciAuZGF5VGltZSB7XFxuICBjdXJzb3I6IHBvaW50ZXI7XFxufVxcbi5jYWxlbmRhciAuZGF5VGltZSA+ICoge1xcbiAgcG9pbnRlci1ldmVudHM6IG5vbmU7XFxufVxcblwiOyIsIi8qKlxuICogQHR5cGVkZWYge09iamVjdH0gSGFzVGVzdHNUYWdcbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gaGFzVGVzdHMgLSBJbmRpY2F0ZXMgd2hldGhlciB0aGUgZnVuY3Rpb24gaGFzIHRlc3RzLlxuICovXG5cbi8qKlxuICogQHR5cGVkZWYge09iamVjdH0gaGFzVGhlc2VTdHlsZXNcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBoYXNUaGVzZVN0eWxlcyAtIExpc3RzIHN0eWxlcyByZWZlcmVuY2VzIGluIGEgZnVuY3Rpb25cbiAqL1xuXG5pbXBvcnQge1xuICBnZXREYXlzSW5Nb250aCwgZ2VuZXJhdGVSYW5kb21TdHJpbmcsIGdldEVhcmxpZXN0RGF0ZSxcbiAgYmxvY2tEYXlzTm90T3BlbiwgY2xlYXJTZWxlY3Rpb24sXG4gIGh1bWFuRGF0ZSwgc3RhbmRhcmREYXRlT2JqZWN0XG59IGZyb20gJy4vYmFzaWNGdW5jdGlvbnMuanMnO1xuaW1wb3J0IHsgR2VuZXJhdGVUaW1lQ2hvb3Nlck1vZGFsIH0gZnJvbSAnLi9kaXNwbGF5VGltZUNob29zZXJNb2RhbC5qcyc7XG5pbXBvcnQgeyBjb2xvdXJzLCBzZWxlY3RlZFN0eWxlLCB1bnNlbGVjdGVkU3R5bGUgfSBmcm9tICcuL3N0eWxlcy5qcyc7XG5pbXBvcnQgeyBsYW5ndWFnZXMgfSBmcm9tICcuL2xhbmd1YWdlcy5qcyc7XG5pbXBvcnQgc3R5bGUgZnJvbSAnLi9jYWxlbmRhckFwcC5jc3MnO1xuXG4vKipcbiAqIEFkZHMgdGhlIHNwZWNpZmllZCBudW1iZXIgb2YgbW9udGhzIHRvIGEgZGF0ZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBtb250aHMgLSBUaGUgbnVtYmVyIG9mIG1vbnRocyB0byBhZGQuXG4gKiBAcmV0dXJucyB7RGF0ZX0gLSBUaGUgdXBkYXRlZCBkYXRlLlxuICovXG5EYXRlLnByb3RvdHlwZS5hZGRNb250aHMgPSBmdW5jdGlvbihtb250aHMpIHtcbiAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKHRoaXMpO1xuICBjb25zdCB5ZWFycyA9IE1hdGguZmxvb3IobW9udGhzIC8gMTIpO1xuICBjb25zdCByZW1haW5pbmdNb250aHMgPSBtb250aHMgJSAxMjtcbiAgaWYgKHllYXJzKSB7XG4gICAgZGF0ZS5zZXRGdWxsWWVhcihkYXRlLmdldEZ1bGxZZWFyKCkgKyB5ZWFycyk7XG4gIH1cbiAgaWYgKHJlbWFpbmluZ01vbnRocykge1xuICAgIGRhdGUuc2V0TW9udGgoZGF0ZS5nZXRNb250aCgpICsgcmVtYWluaW5nTW9udGhzKTtcbiAgfVxuICByZXR1cm4gZGF0ZTtcbn07XG5cbmN1c3RvbUVsZW1lbnRzLmRlZmluZSgnc3dpZnQtY2FsJywgY2xhc3MgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG4gIGNvbnN0cnVjdG9yICgpIHtcbiAgICBzdXBlcigpO1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIGZ1bmN0aW9uIHN0VG9Cb29sZWFuIChzdCkge1xuICAgICAgaWYoc3QgPT09ICd0cnVlJykge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgXG4gICAgY29uc3QgY2FsZW5kYXIgPSBuZXcgU3dpZnRDYWwoKTtcbiAgICBjYWxlbmRhci5nZW5lcmF0ZUNhbGVuZGFyKFxuICAgICAge1xuICAgICAgICB0YXJnZXQ6IHNlbGYsXG4gICAgICAgIC8vIGRhdGEtbnVtYmVyLW9mLW1vbnRocy10by1kaXNwbGF5IGh0bWwgY29udmVydHMgdG8gbnVtYmVyT2ZNb250aHNUb0Rpc3BsYXkgSlNcbiAgICAgICAgbnVtYmVyT2ZNb250aHNUb0Rpc3BsYXk6IHRoaXMuZGF0YXNldC5udW1iZXJPZk1vbnRoc1RvRGlzcGxheSxcbiAgICAgICAgLy8gZGF0YS1kaXNwbGF5LXRpbWUtY2hvb3Nlci1tb2RhbFxuICAgICAgICBkaXNwbGF5VGltZUNob29zZXJNb2RhbDogc3RUb0Jvb2xlYW4odGhpcy5kYXRhc2V0LmRpc3BsYXlUaW1lQ2hvb3Nlck1vZGFsKSxcbiAgICAgICAgLy8gZGF0YS1zaW5nbGUtZGF0ZS1jaG9pY2VcbiAgICAgICAgc2luZ2xlRGF0ZUNob2ljZTogc3RUb0Jvb2xlYW4odGhpcy5kYXRhc2V0LnNpbmdsZURhdGVDaG9pY2UpLFxuXG4gICAgICAgIGxhbmd1YWdlOiB0aGlzLmRhdGFzZXQubGFuZ3VhZ2UsXG4gICAgICAgIC8vZGF0YS1zZWxlY3QtbXVsdGlwbGVcbiAgICAgICAgc2VsZWN0TXVsdGlwbGU6IHRoaXMuZGF0YXNldC5zZWxlY3RNdWx0aXBsZSxcblxuICAgICAgICBwcmVsb2FkZWREYXRlczogKHRoaXMuZGF0YXNldC5wcmVsb2FkZWREYXRlcykgPyBKU09OLnBhcnNlKHRoaXMuZGF0YXNldC5wcmVsb2FkZWREYXRlcykgOiBmYWxzZSxcblxuICAgICAgICBwcmVsb2FkZWRUb29sdGlwOiB0aGlzLmRhdGFzZXQucHJlbG9hZGVkVG9vbHRpcCxcblxuICAgICAgICBibG9ja0RheXNPZldlZWs6ICh0aGlzLmRhdGFzZXQuYmxvY2tEYXlzT2ZXZWVrKSA/IEpTT04ucGFyc2UodGhpcy5kYXRhc2V0LmJsb2NrRGF5c09mV2VlaykgOiBmYWxzZSxcbiAgICAgICAgLy8gZGF0YS1zdGFydC1kYXRlPVwiMjAxOS0wMS0wMVwiXG4gICAgICAgIHN0YXJ0RGF0ZTogdGhpcy5kYXRhc2V0LnN0YXJ0RGF0ZSxcblxuICAgICAgfSk7XG5cbiAgICB0aGlzLmR5bmFtaWNEYXRhID0gY2FsZW5kYXIucmV0dXJuRHluYW1pY0RhdGEoKTtcbiAgfVxufSk7XG5cbmZ1bmN0aW9uIFN3aWZ0Q2FsICgpIHtcbiAgbGV0IHRpbWVDaG9vc2VyO1xuICBjb25zdCBjb25maWcgPSB7fTtcblxuICBjb25zdCBoYW5kbGVyID0ge1xuICAgIGdldDogKHRhcmdldCwga2V5KSA9PiB7XG4gICAgICBpZih0eXBlb2YgdGFyZ2V0W2tleV0gPT09ICdvYmplY3QnICYmIHRhcmdldFtrZXldICE9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJveHkodGFyZ2V0W2tleV0sIGhhbmRsZXIpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGFyZ2V0W2tleV07XG4gICAgfSxcbiAgICBzZXQ6ICh0YXJnZXQsIHByb3AsIHZhbHVlKSA9PiB7XG4gICAgICB0YXJnZXRbcHJvcF0gPSB2YWx1ZTtcbiAgICAgIGVtaXREYXRlU2VsZWN0ZWRFdmVudCgpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9O1xuICBcbiAgY29uc3QgZGF0YVRlbXBsYXRlID0ge1xuICAgIGRhdGVzU2VsZWN0ZWRBcnJheTogW10sXG4gICAgZGF0ZXNTZWxlY3RlZEFycmF5T2JqZWN0czogW10sXG4gICAgZGlzYWJsZWQ6IGZhbHNlXG4gIH07XG5cbiAgY29uc3QgZHluYW1pY0RhdGEgPSBuZXcgUHJveHkoZGF0YVRlbXBsYXRlLCBoYW5kbGVyKTtcblxuICBmdW5jdGlvbiBlbWl0RGF0ZVNlbGVjdGVkRXZlbnQgKCkge1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgY29uc3QgZXZ0ID0gbmV3IEN1c3RvbUV2ZW50KCdkYXRlU2VsZWN0JywgeyBkYXRhOiBkeW5hbWljRGF0YSB9KTtcbiAgICAgIGNvbmZpZy5jYWxlbmRhckNvbnRhaW5lci5kaXNwYXRjaEV2ZW50KGV2dCk7XG4gICAgfSwgMjUwKTtcbiAgfVxuICBcbiAgY29uc3QgY2FsZW5kYXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblxuICB0aGlzLnJldHVybkNhbGVuZGFyID0gKCkgPT4ge1xuICAgIHJldHVybiBjYWxlbmRhcjtcbiAgfTtcblxuICB0aGlzLnJldHVybkR5bmFtaWNEYXRhID0gKCkgPT4ge1xuICAgIHJldHVybiBkeW5hbWljRGF0YTtcbiAgfTtcblxuICB0aGlzLnJldHVybkNvbmZpZyA9ICgpID0+IHtcbiAgICByZXR1cm4gY29uZmlnO1xuICB9O1xuXG4gIHRoaXMuc2V0Q29uZmlnID0gKGNvbmZpZ09iaikgPT4ge1xuICAgIC8vIElmIGNhbGxlZCB2aWEgSFRNTFxuICAgIGNvbmZpZy5jYWxlbmRhckNvbnRhaW5lciA9IGNvbmZpZ09iai50YXJnZXQgfHwgZmFsc2U7XG4gICAgLy8gSWYgY2FsbGVkIHZpYSBKYXZhc2NyaXB0XG4gICAgY29uZmlnLnBhcmVudERpdiA9ICh0eXBlb2YgY29uZmlnT2JqLnBhcmVudERpdiA9PT0gJ3N0cmluZycpID8gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihjb25maWdPYmoucGFyZW50RGl2KSA6IGNvbmZpZ09iai5wYXJlbnREaXY7XG4gICAgLy8gZG9uZVxuICAgIGNvbmZpZy5udW1iZXJPZk1vbnRoc1RvRGlzcGxheSA9IGNvbmZpZ09iai5udW1iZXJPZk1vbnRoc1RvRGlzcGxheSB8fCAxMjtcbiAgICAvLyBkb25lXG4gICAgY29uZmlnLmRpc3BsYXlUaW1lQ2hvb3Nlck1vZGFsID0gY29uZmlnT2JqLmRpc3BsYXlUaW1lQ2hvb3Nlck1vZGFsICYmIHRydWU7XG4gICAgLy8gZG9uZVxuICAgIGNvbmZpZy5zaW5nbGVEYXRlQ2hvaWNlID0gY29uZmlnT2JqLnNpbmdsZURhdGVDaG9pY2UgJiYgdHJ1ZTtcbiAgICAvLyBkb25lXG4gICAgY29uZmlnLnNlbGVjdFJhbmdlID0gIWNvbmZpZ09iai5zaW5nbGVEYXRlQ2hvaWNlO1xuICAgIC8vIGRvbmVcbiAgICBjb25maWcubGFuZ3VhZ2UgPSBjb25maWdPYmoubGFuZ3VhZ2UgfHwgJ2VuR2InO1xuICAgIC8vIGRvbmVcbiAgICBjb25maWcuc2VsZWN0TXVsdGlwbGUgPSBjb25maWcuc2VsZWN0TXVsdGlwbGUgfHwgZmFsc2U7XG4gICAgLy8gZG9uZVxuICAgIGNvbmZpZy5kaXNwbGF5VGltZVNlbGVjdGlvbk9uRGF0ZSA9IGNvbmZpZ09iai5kaXNwbGF5VGltZVNlbGVjdGlvbk9uRGF0ZSB8fCB0cnVlO1xuICAgIC8vIGRvbmVcbiAgICBjb25maWcucHJlbG9hZGVkRGF0ZXMgPSBjb25maWdPYmoucHJlbG9hZGVkRGF0ZXMgfHwgZmFsc2U7XG5cbiAgICBjb25maWcucHJlbG9hZGVkVG9vbHRpcCA9IGNvbmZpZ09iai5wcmVsb2FkZWRUb29sdGlwIHx8IGZhbHNlO1xuXG4gICAgY29uZmlnLmJsb2NrRGF5c09mV2VlayA9IGNvbmZpZ09iai5ibG9ja0RheXNPZldlZWsgfHwgZmFsc2U7XG5cbiAgICBjb25maWcuYm9va0RheXNPZldlZWsgPSBjb25maWdPYmouYm9va0RheXNPZldlZWsgfHwgZmFsc2U7XG5cbiAgICBjb25maWcuc3RhcnREYXRlID0gY29uZmlnT2JqLnN0YXJ0RGF0ZSB8fCBmYWxzZTtcblxuICAgIGNvbmZpZy5lbmRVc2VyID0gY29uZmlnT2JqLmVuZFVzZXIgfHwgZmFsc2U7XG4gICAgY29uZmlnLmVuZFVzZXJEdXJhdGlvbkNob2ljZSA9IGNvbmZpZ09iai5lbmRVc2VyRHVyYXRpb25DaG9pY2UgfHwgZmFsc2U7XG4gICAgY29uZmlnLmJhY2tlbmQgPSBjb25maWdPYmouYmFja2VuZCB8fCBmYWxzZTtcbiAgICBjb25maWcuZGlzcGxheUJsb2NrZWQgPSBjb25maWdPYmouZGlzcGxheUJsb2NrZWQgfHwgZmFsc2U7XG4gICAgY29uZmlnLmRhdGVzT3BlbiA9IGNvbmZpZ09iai5kYXRlc09wZW4gfHwgZmFsc2U7XG4gIH07XG5cbiAgdGhpcy5nZW5lcmF0ZUNhbGVuZGFyID0gKGNvbmZpZ09iaikgPT4ge1xuICAgIGlmIChjb25maWdPYmopIHtcbiAgICAgIHRoaXMuc2V0Q29uZmlnKGNvbmZpZ09iaik7XG4gICAgfVxuICAgIC8vIElmIGNhbGxlZCB2aWEgamF2YXNjcmlwdCBhIHBhcmVudEVsZW1lbnQgbmVlZHMgdG8gYmUgcHJvdmlkZWRcbiAgICBjb25zdCBwYXJlbnREaXYgPSBjb25maWcucGFyZW50RGl2O1xuICAgIC8qXG4gICAgICBJZiBjYWxsZWQgZnJvbSBodG1sIGFzIGEgY3VzdG9tIGNvbXBvbmVudCB0aGUgY29tcG9uZW50IGl0c2VsZiBpcyBwYXNzZWQgKGNhbGVuZGFyQ29udGFpbmVyKVxuICAgICAgSWYgY2FsbGVkIHZpYSBKUyB3aGlsZSB0aGUgY29tcG9uZW50IGlzbid0IGEgd2ViIGNvbXBvbmVudCBpbiB0aGUgc3RyaWN0ZXN0IHNlbnNlLCBpdCBzdGlsbFxuICAgICAgYmVoYXZlcyBsaWtlIG9uZSBhbmQgaXMgZW5jYXBzdWxhdGVkIGluIGEgc2hhZG93LlxuICAgICovXG4gICAgaWYgKGNvbmZpZy5jYWxlbmRhckNvbnRhaW5lcikge1xuICAgICAgc2hhZG93QXR0YWNoKGNvbmZpZy5jYWxlbmRhckNvbnRhaW5lcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5ld0NvbnRhaW5lcigpLnRoZW4oKGNvbnRhaW5lcikgPT4ge1xuICAgICAgICBzaGFkb3dBdHRhY2goY29udGFpbmVyKTtcbiAgICAgICAgY29uZmlnLmNhbGVuZGFyQ29udGFpbmVyID0gY29udGFpbmVyO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbmV3Q29udGFpbmVyICgpIHtcbiAgICAgIGNvbnN0IHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICBjb25zdCBuZXdDYWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgbmV3Q2FsLmNsYXNzTGlzdC5hZGQoJ3N3aWZ0LWNhbCcpO1xuICAgICAgICBwYXJlbnREaXYuYXBwZW5kQ2hpbGQobmV3Q2FsKTtcbiAgICAgICAgcmVzb2x2ZShuZXdDYWwpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzaGFkb3dBdHRhY2ggKGNvbnRhaW5lcikge1xuICAgICAgY29uc3Qgc2hhZG93Um9vdCA9IGNvbnRhaW5lci5hdHRhY2hTaGFkb3coeyBtb2RlOiAnb3BlbicgfSk7XG4gICAgICBjb25zdCBjc3MgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgICAgY3NzLnRleHRDb250ZW50ID0gc3R5bGU7XG4gICAgICBzaGFkb3dSb290LmFwcGVuZENoaWxkKGNzcyk7XG4gICAgICBzaGFkb3dSb290LmFwcGVuZENoaWxkKGNhbGVuZGFyKTtcbiAgICB9XG5cbiAgICBjb25zdCBwcmVsb2FkZWREYXRlcyA9IGNvbmZpZy5wcmVsb2FkZWREYXRlcztcbiAgICBjb25zdCBudW1iZXJPZk1vbnRoc1RvRGlzcGxheSA9IGNvbmZpZy5udW1iZXJPZk1vbnRoc1RvRGlzcGxheTtcbiAgICBjb25zdCBkYXRlc09wZW4gPSBjb25maWcuZGF0ZXNPcGVuO1xuICAgIGNvbnN0IGxhbmd1YWdlID0gY29uZmlnLmxhbmd1YWdlO1xuICAgIGNvbnN0IGRpc3BsYXlUaW1lQ2hvb3Nlck1vZGFsID0gY29uZmlnLmRpc3BsYXlUaW1lQ2hvb3Nlck1vZGFsO1xuICAgIGNvbnN0IGJsb2NrV2Vla0RheXMgPSBjb25maWcuYmxvY2tEYXlzT2ZXZWVrO1xuICAgIGNvbnN0IGJvb2tXZWVrRGF5cyA9IGNvbmZpZy5ib29rRGF5c09mV2VlaztcbiAgICBjb25zdCBzdGFydERhdGUgPSBjb25maWcuc3RhcnREYXRlO1xuICAgIGxldCB1bmlxdWVEYXlJbmRleCA9IDA7XG4gICAgLy8gQ2FsZW5kYXIgaXMgZGVmaW5lZCBnbG9iYWxseSB3aXRoaW4gdGhlIGNvbnN0cnVjdG9yXG4gICAgY29uc3QgY2FsZW5kYXJVbmlxdWVJZCA9IGdlbmVyYXRlUmFuZG9tU3RyaW5nKCk7XG4gICAgY2FsZW5kYXIuaWQgPSBgY2FsZW5kYXItJHtjYWxlbmRhclVuaXF1ZUlkfWA7XG4gICAgY2FsZW5kYXIuY2xhc3NMaXN0LmFkZCgnY2FsZW5kYXInKTtcbiAgICBcbiAgICBjb25zdCBtb250aHMgPSBbXTtcbiAgICBjb25zdCBkYXRlTm93ID0gbmV3IERhdGUoKTtcbiAgICAvLyBSZXB1cnBvc2luZyBnZXRFYXJsaWVzdERhdGUgdG8gZm9ybWF0IGEgZGF0ZS5cbiAgICBjb25zdCBlYXJsaWVzdERhdGUgPSAoc3RhcnREYXRlKSA/IGdldEVhcmxpZXN0RGF0ZShbc3RhcnREYXRlXSkgOiBkYXRlTm93O1xuICAgIGNvbnN0IHN0YXJ0TW9udGggPSBlYXJsaWVzdERhdGUuZ2V0TW9udGgoKTtcbiAgICBjb25zdCBtb250aE5hbWVzID0gbGFuZ3VhZ2VzW2xhbmd1YWdlXS5nZW5lcmFsVGltZS5tb250aHM7XG4gICAgLyogQ3JlYXRlIG1vbnRoIHZpZXcgKi9cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bWJlck9mTW9udGhzVG9EaXNwbGF5OyBpKyspIHtcbiAgICAgIC8qIE1vbnRoIHNwZWNpZmljIHZhcmlhYmxlcyBhbmQgdHJhY2tlcnMgKi9cbiAgICAgIGNvbnN0IHllYXJDYWxjID0gZWFybGllc3REYXRlLmFkZE1vbnRocyhpKS5nZXRGdWxsWWVhcigpO1xuICAgICAgY29uc3QgbW9udGhDYWxjID0gKHN0YXJ0TW9udGggKyBpKSAlIDEyO1xuICAgICAgY29uc3Qgc3RhcnREYXlPZk1vbnRoID0gbmV3IERhdGUoeWVhckNhbGMsIG1vbnRoQ2FsYykuZ2V0RGF5KCk7XG4gICAgICBjb25zdCBkYXlzSW5Nb250aCA9IGdldERheXNJbk1vbnRoKChzdGFydE1vbnRoICsgaSArIDEpICUgMTIsIGVhcmxpZXN0RGF0ZS5hZGRNb250aHMoaSkuZ2V0RnVsbFllYXIoKSk7XG4gICAgICBsZXQgY291bnQgPSAxO1xuICAgICAgbGV0IGRheW9md2VlayA9IDA7XG5cbiAgICAgIC8qIENyZWF0ZSBtb250aCBkaXYgKi9cbiAgICAgIGNvbnN0IG1vbnRoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBtb250aHMucHVzaChtb250aCk7XG4gICAgICBtb250aC5zdHlsZS53aWR0aCA9ICcxNWVtJztcbiAgICAgIG1vbnRoLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGNvbG91cnMubW9udGhCb3JkZXJDb2xvcjtcbiAgICAgIG1vbnRoLmNsYXNzTGlzdC5hZGQoJ21vbnRoJyk7XG4gICAgICBjYWxlbmRhci5hcHBlbmRDaGlsZChtb250aCk7XG5cbiAgICAgIC8qIENyZWF0ZSBtb250aCBuYW1lIGRpdiAobW9udGggWVlZWSkgYXQgdGhlIHRvcCBvZiBtb250aCBkaXNwbGF5ICovXG4gICAgICBjb25zdCBtb250aE5hbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIG1vbnRoTmFtZS5jbGFzc0xpc3QuYWRkKCdtb250aE5hbWUnKTtcbiAgICAgIG1vbnRoTmFtZS50ZXh0Q29udGVudCA9IGAke21vbnRoTmFtZXNbKHN0YXJ0TW9udGggKyBpKSAlIDEyXX0gJHtlYXJsaWVzdERhdGUuZ2V0RnVsbFllYXIoKX1gO1xuICAgICAgbW9udGguYXBwZW5kQ2hpbGQobW9udGhOYW1lKTtcblxuICAgICAgLyogQ3JlYXRlIGRpdiB3aXRoIG5hbWVkIGRheXMgb2YgdGhlIHdlZWsgKi9cbiAgICAgIGNvbnN0IGRheU5hbWVzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBtb250aC5hcHBlbmRDaGlsZChkYXlOYW1lcyk7XG4gICAgICBkYXlOYW1lcy5jbGFzc0xpc3QuYWRkKCd3ZWVrcm93Jyk7XG4gICAgICBsYW5ndWFnZXNbbGFuZ3VhZ2VdLmdlbmVyYWxUaW1lLmRheXNUcnVuY2F0ZWQuZm9yRWFjaCgoZGF5TmFtZSkgPT4ge1xuICAgICAgICBjb25zdCBkYXkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgZGF5LnRleHRDb250ZW50ID0gZGF5TmFtZTtcbiAgICAgICAgZGF5LmNsYXNzTGlzdC5hZGQoJ2RheU5hbWUnLCAnd2lkdGhTaGFwZURheXMnKTtcbiAgICAgICAgZGF5TmFtZXMuYXBwZW5kQ2hpbGQoZGF5KTtcbiAgICAgIH0pO1xuXG4gICAgICAvKiBDcmVhdGUgd2VlayByb3dzIGZpcnN0IHdlZWssIGl0J3MgcmVhc3NpZ25lZCBmICovXG4gICAgICBsZXQgd2Vla1JvdztcbiAgICAgIC8vIDQyIGRheXMsIGkuZS4gNiByb3dzIG9mIDdcbiAgICAgIGZvciAobGV0IHAgPSAwOyBwIDwgNDI7IHArKykge1xuICAgICAgICBpZiAocCA9PT0gMCkge1xuICAgICAgICAgIC8vIG1hZGUgbmV3IHdlZWsgcm93XG4gICAgICAgICAgd2Vla1JvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgIG1vbnRoLmFwcGVuZENoaWxkKHdlZWtSb3cpO1xuICAgICAgICAgIHdlZWtSb3cuY2xhc3NMaXN0LmFkZCgnd2Vla3JvdycpO1xuICAgICAgICAgIGRheW9md2VlayA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHAgPCBzdGFydERheU9mTW9udGgpIHtcbiAgICAgICAgICBjb25zdCBwZWdob2xlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgcGVnaG9sZS5jbGFzc0xpc3QuYWRkKCd3aWR0aFNoYXBlJywgJ2ZpbGxlcicpO1xuICAgICAgICAgIHVuc2VsZWN0ZWRTdHlsZShwZWdob2xlKTtcbiAgICAgICAgICB3ZWVrUm93LmFwcGVuZENoaWxkKHBlZ2hvbGUpO1xuICAgICAgICAgIGRheW9md2VlaysrO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHAgPj0gc3RhcnREYXlPZk1vbnRoICYmIHAgPD0gKHN0YXJ0RGF5T2ZNb250aCArIGRheXNJbk1vbnRoIC0gMSkpIHtcbiAgICAgICAgICBjb25zdCBwZWdob2xlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgcGVnaG9sZS50ZXh0Q29udGVudCA9IGNvdW50O1xuICAgICAgICAgIHBlZ2hvbGUuZGF0YXNldC5kYXkgPSBjb3VudDtcbiAgICAgICAgICBwZWdob2xlLmRhdGFzZXQuZGF5b2Z3ZWVrID0gZGF5b2Z3ZWVrO1xuICAgICAgICAgIHBlZ2hvbGUuZGF0YXNldC5kYXlpbmRleCA9IHVuaXF1ZURheUluZGV4O1xuICAgICAgICAgIHBlZ2hvbGUuY2xhc3NMaXN0LmFkZCgnd2lkdGhTaGFwZScsICdkYXlUaW1lJyk7XG4gICAgICAgICAgcGVnaG9sZS5kYXRhc2V0Lmh1bWFuZGF0ZSA9IGh1bWFuRGF0ZShgJHt5ZWFyQ2FsY30tJHttb250aENhbGN9LSR7Y291bnR9YCk7XG4gICAgICAgICAgLy8gcGVnaG9sZS5pZCA9IGAke3llYXJDYWxjfS0ke21vbnRoQ2FsY30tJHtjb3VudH1gO1xuICAgICAgICAgIHBlZ2hvbGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgICAgICAgZGF0ZU9uQ2xpY2tFdmVudHMoZSk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICB3ZWVrUm93LmFwcGVuZENoaWxkKHBlZ2hvbGUpO1xuXG4gICAgICAgICAgaWYgKGkgPT09IDAgJiYgcCA+PSBzdGFydERheU9mTW9udGggJiYgcCA8IChlYXJsaWVzdERhdGUuZ2V0RGF0ZSgpICsgc3RhcnREYXlPZk1vbnRoKSkge1xuICAgICAgICAgICAgcGVnaG9sZS5jbGFzc0xpc3QuYWRkKCdmaWxsZXInKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb3VudCsrO1xuICAgICAgICAgIGRheW9md2VlaysrO1xuICAgICAgICAgIHVuaXF1ZURheUluZGV4Kys7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocCA+PSBkYXlzSW5Nb250aCArIHN0YXJ0RGF5T2ZNb250aCkge1xuICAgICAgICAgIGNvbnN0IHBlZ2hvbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICBwZWdob2xlLmNsYXNzTGlzdC5hZGQoJ3dpZHRoU2hhcGUnLCAnZmlsbGVyJyk7XG4gICAgICAgICAgd2Vla1Jvdy5hcHBlbmRDaGlsZChwZWdob2xlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgocCArIDEpICUgNyA9PT0gMCkge1xuICAgICAgICAgIC8vIG1ha2UgbmV3IHdlZWsgcm93OlxuICAgICAgICAgIHdlZWtSb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICBtb250aC5hcHBlbmRDaGlsZCh3ZWVrUm93KTtcbiAgICAgICAgICB3ZWVrUm93LmNsYXNzTGlzdC5hZGQoJ3dlZWtyb3cnKTtcbiAgICAgICAgICBkYXlvZndlZWsgPSAwO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoaSA9PT0gbnVtYmVyT2ZNb250aHNUb0Rpc3BsYXkgLSAxKSB7XG4gICAgICAgIGJsb2NrRGF5c05vdE9wZW4oY2FsZW5kYXIsIGRhdGVzT3Blbik7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIE9wdGlvbnM6XG4gICAgaWYoZGlzcGxheVRpbWVDaG9vc2VyTW9kYWwpIHtcbiAgICAgIHRpbWVDaG9vc2VyID0gbmV3IEdlbmVyYXRlVGltZUNob29zZXJNb2RhbChjb25maWcsIGR5bmFtaWNEYXRhLCBjYWxlbmRhcik7XG4gICAgICB0aW1lQ2hvb3Nlci5nZW5lcmF0ZU1vZGFsKCk7XG4gICAgfVxuICAgIGlmKHByZWxvYWRlZERhdGVzKSB7XG4gICAgICBwcmVsb2FkRGF0ZXMocHJlbG9hZGVkRGF0ZXMpO1xuICAgIH1cbiAgICBpZihibG9ja1dlZWtEYXlzKSB7XG4gICAgICBibG9ja0RheXNPZldlZWsoYmxvY2tXZWVrRGF5cyk7XG4gICAgfVxuICAgIGlmKGJvb2tXZWVrRGF5cykge1xuICAgICAgYm9va0RheXNPZldlZWsoYm9va1dlZWtEYXlzKTtcbiAgICB9XG4gIH07XG5cbiAgbGV0IGNsaWNrQ291bnQgPSAxO1xuICBsZXQgZGF0ZUNsaWNrZWRUaHJpY2UgPSB7XG4gICAgZGF0ZTogbnVsbCxcbiAgICBjb3VudDogMVxuICB9O1xuXG4gIGZ1bmN0aW9uIGNsaWtlZFRocmljZSAoZGF0ZSkge1xuXG4gICAgaWYgKGRhdGVDbGlja2VkVGhyaWNlLmRhdGUgPT09IGRhdGUpIHtcbiAgICAgIGRhdGVDbGlja2VkVGhyaWNlLmNvdW50Kys7XG4gICAgfSBcbiAgICBlbHNlIHtcbiAgICAgIC8vIHJlc2V0IGZvciBuZXcgZGF0ZVxuICAgICAgZGF0ZUNsaWNrZWRUaHJpY2UuZGF0ZSA9IGRhdGU7XG4gICAgICBkYXRlQ2xpY2tlZFRocmljZS5jb3VudCA9IDE7XG4gICAgfVxuXG4gICAgaWYgKGRhdGVDbGlja2VkVGhyaWNlLmNvdW50ID09PSAzKSB7XG4gICAgICBkYXRlQ2xpY2tlZFRocmljZS5jb3VudCA9IDA7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgZnVuY3Rpb24gZGF0ZU9uQ2xpY2tFdmVudHMgKGUpIHsgICAgXG5cbiAgICBjb25zdCBkYXRlRGl2ID0gZS50YXJnZXQ7XG4gICAgY2xpY2tDb3VudCsrO1xuXG4gICAgaWYgKGR5bmFtaWNEYXRhLmRpc2FibGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGNvbmZpZy5zZWxlY3RSYW5nZSkge1xuICAgICAgcmFuZ2UoZGF0ZURpdik7XG4gICAgfVxuXG4gICAgaWYgKGNvbmZpZy5zaW5nbGVEYXRlQ2hvaWNlKSB7XG4gICAgICBjbGVhclNlbGVjdGlvbihjYWxlbmRhciwgZHluYW1pY0RhdGEpO1xuICAgICAgYm9va0RhdGVzKFtkYXRlRGl2XSk7XG4gICAgICB0aW1lQ2hvb3NlclRvZ2dsZSgpO1xuICAgIH1cblxuXG4gICAgZnVuY3Rpb24gdGltZUNob29zZXJUb2dnbGUgKCkge1xuICAgICAgaWYgKGNvbmZpZy5kaXNwbGF5VGltZUNob29zZXJNb2RhbCkgeyBcbiAgICAgICAgdGltZUNob29zZXIuc2hvdygpO1xuICAgICAgICB0aW1lQ2hvb3Nlci53cml0ZVRvRGF0ZURpdigpO1xuICAgICAgICB0aW1lQ2hvb3Nlci53cml0ZVRvRHluYW1pY0RhdGEoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiByYW5nZShkYXRlRGl2KSB7XG4gICAgICBjb25zdCBsYXN0RGF0ZSA9IGRhdGVDbGlja2VkVGhyaWNlLmRhdGU7XG4gICAgICBjb25zdCB0aHJpY2UgPSBjbGlrZWRUaHJpY2UoZGF0ZURpdi5kYXRhc2V0Lmh1bWFuZGF0ZSk7XG4gICAgICBpZiAodGhyaWNlKSB7XG4gICAgICAgIHdpbmRvdy5nZXRTZWxlY3Rpb24oKS5yZW1vdmVBbGxSYW5nZXMoKTtcbiAgICAgICAgLy8gcGFzcyBcInRydWVcIiB0byBpbmRpY2F0ZSBhIHNpbmdsZSBkYXRlIHJhbmdlLCBzZWxlY3RlZCBieSB0cmlwbGUgY2xpY2s6XG4gICAgICAgIGJvb2tEYXRlcyhbZGF0ZURpdl0sIHRydWUpO1xuICAgICAgICB0aW1lQ2hvb3NlclRvZ2dsZSgpO1xuICAgICAgICBjbGlja0NvdW50Kys7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChjbGlja0NvdW50ICUgMiA9PT0gMCkge1xuICAgICAgICBpZiAoY29uZmlnLnNlbGVjdE11bHRpcGxlKSB7XG4gICAgICAgICAgY2xlYXJTZWxlY3Rpb24oY2FsZW5kYXIsIGR5bmFtaWNEYXRhKTtcbiAgICAgICAgfVxuICAgICAgICBib29rRGF0ZXMoW2RhdGVEaXZdKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKHByaW9yV2FzU2luZ2xlID09PSBmYWxzZSAmJiBjbGlja0NvdW50ICUgMiA9PT0gMSkge1xuICAgICAgICBib29rRGF0ZXMoW2RhdGVEaXZdKTtcbiAgICAgICAgLy90aW1lQ2hvb3NlclRvZ2dsZSgpO1xuICAgICAgICAvLyBydWxlIHRvIGNoZWNrIGlmIHJhbmdlIGlzIGEgbG9uZ2VyIHRoYW4gMTogXG4gICAgICAgIGlmKGRhdGVDbGlja2VkVGhyaWNlLmRhdGUgIT09IGxhc3REYXRlKSB7IHRpbWVDaG9vc2VyVG9nZ2xlKCk7IH1cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfSAgICAgXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJhbmdlIHNlbGVjdFxuICAgKiBAZGVzY3JpcHRpb24gQWxsb3dzIGEgcmFuZ2Ugb2YgZGF0ZXMgdG8gYmUgc2VsZWN0ZWRcbiAgICogQGZ1bmN0aW9uIGJvb2tEYXRlc1xuICAgKiBAcGFyYW0gZGF0ZXMgTm9kZWxpc3RcbiAgICogQHRvZG8gYWxsb3cgYSByYW5nZSBvZiBsZW5ndGggb25lIHRvIGJlIHNlbGVjdGVkXG4gICAqIEBmaXJlcyBib29rRGF5IGZvciBlYWNoIGRheSBpbiBhIHJhbmdlXG4gICAqL1xuXG4gIGxldCBwcmlvcldhc1NpbmdsZSA9IGZhbHNlOyBcbiAgZnVuY3Rpb24gYm9va0RhdGVzIChhcnJheU9mRGF0ZURpdnMsIHNpbmdsZURhdGUpIHtcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBuZXcgc2VsZWN0aW9uIGluIHRoZSBkeW5hbWljRGF0YSBvYmplY3QuXG4gICAgICogQHJldHVybiB7b2JqZWN0fSBBbiBvYmplY3QgY29udGFpbmluZyB0aGUgdHJhY2tpbmcgYXJyYXkgXCJuZXdBcnJheVwiIGFuZCBvYmplY3RzIGFycmF5LlxuICAgICAqL1xuXG4gICAgZnVuY3Rpb24gY3JlYXRlTmV3U2VsZWN0aW9uIChwcmlvcldhc1NpbmdsZSkge1xuXG4gICAgICBjb25zdCBwYXJlbnRBciA9IGR5bmFtaWNEYXRhLmRhdGVzU2VsZWN0ZWRBcnJheTtcbiAgICAgIGNvbnN0IHBhcmVudEFyT2JqID0gZHluYW1pY0RhdGEuZGF0ZXNTZWxlY3RlZEFycmF5T2JqZWN0cztcbiAgICAgIGxldCBuZXdBcnJheSwgbmV3T2JqZWN0c0FycmF5O1xuXG4gICAgICBuZXdBcnJheSA9IHBhcmVudEFyW3BhcmVudEFyLmxlbmd0aCAtIDFdO1xuXG4gICAgICBpZiAoIXByaW9yV2FzU2luZ2xlICYmIGNvbmZpZy5zZWxlY3RSYW5nZSAmJiBuZXdBcnJheSAmJiBuZXdBcnJheS5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgbmV3T2JqZWN0c0FycmF5ID0gcGFyZW50QXJPYmpbcGFyZW50QXJPYmoubGVuZ3RoIC0gMV07XG4gICAgICAgIHJldHVybiB7IG5ld0FycmF5LCBuZXdPYmplY3RzQXJyYXkgfTsgXG4gICAgICB9XG5cbiAgICAgIG5ld0FycmF5ID0gW107XG4gICAgICBuZXdPYmplY3RzQXJyYXkgPSBbXTtcbiAgICAgIHBhcmVudEFyLnB1c2gobmV3QXJyYXkpO1xuICAgICAgcGFyZW50QXJPYmoucHVzaChuZXdPYmplY3RzQXJyYXkpO1xuICAgICAgcmV0dXJuIHsgbmV3QXJyYXksIG5ld09iamVjdHNBcnJheSB9O1xuXG4gICAgfVxuXG4gICAgLy8gY3JlYXRlIG5ldyBzZWxlY3Rpb25zIG9yIHJldHJpZXZlIHRoZSBsYXN0IHNlbGVjdGlvbjogXG4gICAgY29uc3QgeyBuZXdBcnJheSwgbmV3T2JqZWN0c0FycmF5IH0gPSBjcmVhdGVOZXdTZWxlY3Rpb24ocHJpb3JXYXNTaW5nbGUpO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnJheU9mRGF0ZURpdnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGRhdGVEaXYgPSBhcnJheU9mRGF0ZURpdnNbaV07XG4gICAgICBmaW5kRGF0ZVNlbGVjdGlvbihkYXRlRGl2KTtcbiAgICAgIGJvb2tEYXkoZGF0ZURpdik7XG4gICAgfVxuICAgIC8vIHN0b3JlIHdpbiB0aGUgcHJldmlvdXMgc2VsZWN0aW9uIHdhcyBhIHJhbmdlIG9mIGxlbmd0aCAxLCByZWFkIGJ5IFwiY3JlYXRlTmV3U2VsZWN0aW9uXCJcbiAgICBwcmlvcldhc1NpbmdsZSA9IChzaW5nbGVEYXRlKSA/IHRydWUgOiBmYWxzZTtcblxuICAgIC8vIGlmIHRoZSBkYXRlIGlzIGluIGEgcHJldmlvdXMgc2VsZWN0aW9uLCB0aGF0IHNlbGVjdGlvbiBpcyBzcGxpY2VkXG4gICAgZnVuY3Rpb24gZmluZERhdGVTZWxlY3Rpb24gKGRhdGUpIHtcbiAgICAgIC8vIGNvbnNvbGUubG9nKGRhdGUpO1xuICAgICAgY29uc3Qgc3RvcmUgPSBkeW5hbWljRGF0YS5kYXRlc1NlbGVjdGVkQXJyYXlPYmplY3RzO1xuICAgICAgZm9yKGxldCBqID0gMDsgaiA8IHN0b3JlLmxlbmd0aDsgaisrKXtcbiAgICAgICAgLy8gdGhlIGFycmF5IGluIHF1ZXN0aW9uXG4gICAgICAgIGNvbnN0IHNpbmdsZVNlbGVjdGlvbiA9IHN0b3JlW2pdO1xuICAgICAgICAvLyBkYXRhIGF0dHIgb2YgaHRtbCBlbGVtZW50XG4gICAgICAgIGNvbnN0IGRhdGVWYWx1ZSA9IGRhdGUuZGF0YXNldC5odW1hbmRhdGU7XG4gICAgICAgIGNvbnN0IHNlYXJjaCA9ICgpID0+IHNpbmdsZVNlbGVjdGlvbi5maW5kKCAoZGF0ZVN0b3JlZCkgPT4gZGF0ZVN0b3JlZC5odW1hbmRhdGUgPT09IGRhdGVWYWx1ZSk7XG4gICAgICAgIGlmKHNlYXJjaCgpKSB7XG4gICAgICAgICAgc2luZ2xlU2VsZWN0aW9uLmZvckVhY2goKGRhdGUpID0+IHtcbiAgICAgICAgICAgIC8vIHJlbW92ZSBzZWxlY3Rpb24gY29sb3VyXG4gICAgICAgICAgICBjb25zdCBkYXlEaXYgPSBjYWxlbmRhci5xdWVyeVNlbGVjdG9yKGBbZGF0YS1odW1hbmRhdGU9JyR7ZGF0ZS5odW1hbmRhdGV9J11gKTtcbiAgICAgICAgICAgIHVuc2VsZWN0ZWRTdHlsZShkYXlEaXYpO1xuICAgICAgICAgICAgLy8gcmVtb3ZlIHRpbWVzLCBpZiBhbnk6IFxuICAgICAgICAgICAgd2hpbGUgKGRheURpdi5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgIGRheURpdi5yZW1vdmVDaGlsZChkYXlEaXYubGFzdENoaWxkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICAvLyByZW1vdmUgZnJvbSBzdG9yYWdlXG4gICAgICAgICAgZHluYW1pY0RhdGEuZGF0ZXNTZWxlY3RlZEFycmF5T2JqZWN0cy5zcGxpY2UoaiwgMSk7XG4gICAgICAgICAgZHluYW1pY0RhdGEuZGF0ZXNTZWxlY3RlZEFycmF5LnNwbGljZShqLCAxKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiBcbiAgICBpZiAoY29uZmlnLnNlbGVjdFJhbmdlKSB7XG4gICAgICBjb25zdCBzdGFydERhdGUgPSBuZXdPYmplY3RzQXJyYXlbMF07XG4gICAgICBjb25zdCBzdGFydEluZGV4ID0gc3RhcnREYXRlLmluZGV4O1xuICAgICAgLy8gaWYgYSBzaW5nbGUgZGF0ZSBpcyBzZWxlY3RlZDpcbiAgICAgIGNvbnN0IGVuZERhdGUgPSBuZXdPYmplY3RzQXJyYXlbMV0gfHwgc3RhcnREYXRlO1xuICAgICAgY29uc3QgZW5kSW5kZXggPSAoZW5kRGF0ZSkgPyBlbmREYXRlLmluZGV4IDogZmFsc2U7XG5cbiAgICAgIGxldCBbbG93LCBoaWdoXSA9IFtwYXJzZUludChzdGFydEluZGV4KSwgcGFyc2VJbnQoZW5kSW5kZXgpXS5zb3J0KChhLCBiKSA9PiBhIC0gYik7XG5cbiAgICAgIGZvciAobGV0IGkgPSBsb3c7IGkgPD0gaGlnaDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGRhdGVEaXYgPSBjYWxlbmRhci5xdWVyeVNlbGVjdG9yKGBbZGF0YS1kYXlpbmRleD0nJHtpfSddYCk7XG4gICAgICAgIGlmIChkYXRlRGl2LmNsYXNzTGlzdC5jb250YWlucygnYmxvY2tlZCcpKSB7XG4gICAgICAgICAgdW5zZWxlY3RlZFN0eWxlKGNhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoYFtpZD0nJHtlbmREYXRlfSddYCkpO1xuICAgICAgICAgIG5ld0FycmF5LnNwbGljZSgxLCAxKTtcbiAgICAgICAgICBuZXdPYmplY3RzQXJyYXkuc3BsaWNlKDEsIDEpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGJvb2tEYXkoZGF0ZURpdik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYm9va0RheSAoZGF0ZURpdikge1xuICAgICAgaWYgKGNvbmZpZy5zaW5nbGVEYXRlQ2hvaWNlICYmIG5ld0FycmF5Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgY2xlYXJTZWxlY3Rpb24oY2FsZW5kYXIsIGR5bmFtaWNEYXRhKTtcbiAgICAgIH1cbiAgICAgIGlmIChuZXdBcnJheS5pbmNsdWRlcyhkYXRlRGl2LmRhdGFzZXQuaHVtYW5kYXRlKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgc2VsZWN0ZWRTdHlsZShkYXRlRGl2KTtcbiAgICAgICAgbmV3QXJyYXkucHVzaChkYXRlRGl2LmRhdGFzZXQuaHVtYW5kYXRlKTtcbiAgICAgICAgbmV3T2JqZWN0c0FycmF5W25ld0FycmF5Lmxlbmd0aCAtIDFdID0gc3RhbmRhcmREYXRlT2JqZWN0KGRhdGVEaXYpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGJvb2tEYXlzT2ZXZWVrIChkYXlJbmRleCkge1xuICAgIGNvbnN0IGRheXMgPSBjYWxlbmRhci5xdWVyeVNlbGVjdG9yQWxsKGBbZGF0YS1kYXlvZndlZWs9XCIke2RheUluZGV4fVwiXWApO1xuICAgIGRheXMuZm9yRWFjaCgoZGF5KSA9PiB7XG4gICAgICBib29rRGF0ZXMoW2RheV0sIHRydWUpOyAgIFxuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gYmxvY2tEYXlzT2ZXZWVrIChkYXlJbmRleEFycmF5KSB7XG4gICAgZGF5SW5kZXhBcnJheS5mb3JFYWNoKChkYXlJbmRleCkgPT4ge1xuICAgICAgY29uc3QgZGF5cyA9IGNhbGVuZGFyLnF1ZXJ5U2VsZWN0b3JBbGwoYFtkYXRhLWRheW9md2Vlaz1cIiR7ZGF5SW5kZXh9XCJdYCk7XG4gICAgICBkYXlzLmZvckVhY2goKGRheSkgPT4ge1xuICAgICAgICBkYXkuY2xhc3NMaXN0LmFkZCgnZmlsbGVyJyk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHByZWxvYWREYXRlcyAocHJlbG9hZGVkRGF0ZXMpIHtcbiAgICBcbiAgICBmdW5jdGlvbiBnZXREaXZzIChkYXRlcykge1xuICAgICAgY29uc3QgZGF0ZURpdnMgPSBbXTtcbiAgICAgIGNvbnN0IHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICBkYXRlcy5mb3JFYWNoKChkYXRlLCBpKSA9PiB7XG4gICAgICAgICAgY29uc3QgZGF0ZURpdiA9IGNhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLWh1bWFuZGF0ZT0nJHtkYXRlfSddYCk7XG4gICAgICAgICAgZGF0ZURpdnMucHVzaChkYXRlRGl2KTtcbiAgICAgICAgICBpZiAoaSA9PT0gcHJlbG9hZGVkRGF0ZXMubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgYmxvY2tOb3RQcmVsb2FkZWREYXRlcyAoZGF0ZURpdnMpO1xuICAgICAgICAgICAgcmVzb2x2ZShkYXRlRGl2cyk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYmxvY2tOb3RQcmVsb2FkZWREYXRlcyAoZGF0ZURpdnMpIHtcbiAgICAgIGNvbnN0IG5vbk9wdGlvbnMgPSBjYWxlbmRhci5xdWVyeVNlbGVjdG9yQWxsKCcuZGF5VGltZScpO1xuICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IG5vbk9wdGlvbnMubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgIGNvbnN0IGRheSA9IG5vbk9wdGlvbnNbaW5kZXhdO1xuICAgICAgICBpZighZGF0ZURpdnMuaW5jbHVkZXMoZGF5KSl7XG4gICAgICAgICAgZGF5LmNsYXNzTGlzdC5hZGQoJ2ZpbGxlcicpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGRheS5jbGFzc0xpc3QuYWRkKCdwcmVsb2FkZWQnKTtcbiAgICAgICAgICBkYXkudGl0bGUgPSBjb25maWcucHJlbG9hZGVkVG9vbHRpcDtcbiAgICAgICAgfSBcbiAgICAgIH1cbiAgICB9XG5cbiAgICBnZXREaXZzKHByZWxvYWRlZERhdGVzKTtcbiAgICAvKlxuICAgICAgLnRoZW4oKGRhdGVEaXZzKSA9PiB7XG4gICAgICAgIC8vIGJvb2tEYXRlcyhkYXRlRGl2cyk7XG4gICAgICB9KTtcbiAgICAqL1xuICB9ICAgXG59XG5cbmV4cG9ydCB7IFN3aWZ0Q2FsIH07XG4iLCJpbXBvcnQgeyBsYW5ndWFnZXMgfSBmcm9tICcuL2xhbmd1YWdlcy5qcyc7XG5cbi8qKlxuICogR2VuZXJhdGVzIGEgdGltZSBjaG9vc2VyIG1vZGFsIGZvciBzZWxlY3RpbmcgdGltZS4gQ2FsbGVkIGluIGNhbGVuZGFyR2VuZXJhdG9yLmpzXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZyAtIFRoZSBjb25maWd1cmF0aW9uIG9iamVjdC4gXG4gKiBAcGFyYW0ge09iamVjdH0gZHluYW1pY0RhdGEgLSBUaGUgZHluYW1pYyBkYXRhIG9iamVjdC5cbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGNhbGVuZGFyIC0gVGhlIGNhbGVuZGFyIGVsZW1lbnQuXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn0gVGhlIGdlbmVyYXRlZCB0aW1lIGNob29zZXIgbW9kYWwuXG4gKi9cbmZ1bmN0aW9uIEdlbmVyYXRlVGltZUNob29zZXJNb2RhbCAoY29uZmlnLCBkeW5hbWljRGF0YSwgY2FsZW5kYXIpIHtcblxuICAvKipcbiAgICogQSBjdXN0b20gZXZlbnQgZW1pdHRlZCB3aGVuIGEgdGltZSBpcyBhZGRlZCBvciBzZWxlY3RlZFxuICAgKlxuICAgKiBAcmV0dXJuIHt2b2lkfSBUaGlzIGZ1bmN0aW9uIGRvZXMgbm90IHJldHVybiBhbnkgdmFsdWUuXG4gICAqL1xuICBmdW5jdGlvbiBlbWl0VGltZVNlbGVjdGVkRXZlbnQgKCkge1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgY29uc3QgZXZ0ID0gbmV3IEN1c3RvbUV2ZW50KCd0aW1lU2VsZWN0JywgeyBkYXRhOiBkeW5hbWljRGF0YSB9KTtcbiAgICAgIGNvbmZpZy5jYWxlbmRhckNvbnRhaW5lci5kaXNwYXRjaEV2ZW50KGV2dCk7XG4gICAgfSwgMjUwKTtcbiAgfVxuXG4gIGxldCB0aW1lQ2hvb3Nlck1vZGFsO1xuXG4gIGxldCBzZWxlY3Rpb24gPSBbXTtcblxuICB0aGlzLmdldFNlbGVjdGVkVGltZXMgPSAoKSA9PiB7XG4gICAgcmV0dXJuIHNlbGVjdGlvbjtcbiAgfTtcbiAgXG4gIHRoaXMuZ2VuZXJhdGVNb2RhbCA9ICgpID0+IHtcbiAgICByZXR1cm4gZ2VuZXJhdGVNb2RhbCgpO1xuICB9O1xuXG4gIHRoaXMuc2hvdyA9ICgpID0+IHtcbiAgICBjYWxlbmRhci5zdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nO1xuICAgIHJldHVybiB0aW1lQ2hvb3Nlck1vZGFsLnNob3coKTtcbiAgfTtcblxuICB0aGlzLndyaXRlVG9EYXRlRGl2ID0gICgpID0+IHtcbiAgICB3cml0ZVRvRGF0ZURpdigpO1xuICB9O1xuXG4gIHRoaXMud3JpdGVUb0R5bmFtaWNEYXRhID0gKCkgPT4ge1xuICAgIHdyaXRlVG9EeW5hbWljRGF0YSgpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBHZW5lcmF0ZXMgYSBkaWFsb2cgZm9yIGNob29zaW5nIHRpbWUuXG4gICAqXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IEEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIHRoZSBnZW5lcmF0ZWQgdGltZSBjaG9vc2VyIG1vZGFsLlxuICAgKi9cbiAgZnVuY3Rpb24gZ2VuZXJhdGVNb2RhbCgpIHtcbiAgICBjb25zdCBwcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcblxuICAgICAgdGltZUNob29zZXJNb2RhbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpYWxvZycpO1xuICAgICAgdGltZUNob29zZXJNb2RhbC5jbGFzc0xpc3QuYWRkKCd0aW1lQ2hvb3Nlck1vZGFsJyk7XG4gICAgICBjYWxlbmRhci5hcHBlbmRDaGlsZCh0aW1lQ2hvb3Nlck1vZGFsKTtcbiAgXG4gICAgICBjb25zdCB0aW1lQ29udCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgdGltZUNvbnQuY2xhc3NMaXN0LmFkZCgndGltZUNvbnQnKTtcbiAgICAgIHRpbWVDaG9vc2VyTW9kYWwuYXBwZW5kQ2hpbGQodGltZUNvbnQpO1xuICBcbiAgICAgIGNvbnN0IHRpbWVDaG9vc2VyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICB0aW1lQ2hvb3Nlci5jbGFzc0xpc3QuYWRkKCd0aW1lQ2hvb3NlcicpO1xuICAgICAgdGltZUNvbnQuYXBwZW5kQ2hpbGQodGltZUNob29zZXIpO1xuICBcbiAgICAgIGNvbnN0IGNvbnRyb2xzRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBjb250cm9sc0Rpdi5jbGFzc0xpc3QuYWRkKCdkZWxldGVEaXYnKTtcbiAgICAgIHRpbWVDaG9vc2VyLmFwcGVuZENoaWxkKGNvbnRyb2xzRGl2KTtcbiAgXG4gICAgICBmdW5jdGlvbiBjbG9zZUZuICgpIHtcbiAgICAgICAgY2FsZW5kYXIuc3R5bGUub3ZlcmZsb3cgPSAnc2Nyb2xsJztcbiAgICAgICAgdGltZUNob29zZXJNb2RhbC5jbG9zZSgpO1xuICAgICAgfVxuICAgIFxuICAgICAgZnVuY3Rpb24gaW5uZXJDb21wb25lbnRzICgpIHtcbiAgICAgICAgY29uc3QgdGltZVBpY2tlckNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICB0aW1lUGlja2VyQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ3RpbWVQaWNrZXJDb250YWluZXInKTtcbiAgICAgICAgdGltZUNob29zZXIuYXBwZW5kQ2hpbGQodGltZVBpY2tlckNvbnRhaW5lcik7XG4gICAgICAgIGNvbnN0IHRpdGxlRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIHRpdGxlRGl2LnRleHRDb250ZW50ID0gbGFuZ3VhZ2VzW2NvbmZpZy5sYW5ndWFnZV0udGltZVdpZGdldC5hZGRUaW1lO1xuICAgICAgICB0aXRsZURpdi5jbGFzc0xpc3QuYWRkKCdkZWxldGVEaXYnKTtcbiAgICAgICAgdGltZVBpY2tlckNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aXRsZURpdik7XG4gICAgICAgIG1ha2VEcm9wRG93bnMobGFuZ3VhZ2VzW2NvbmZpZy5sYW5ndWFnZV0udGltZVdpZGdldC5zdGFydCwgdGltZVBpY2tlckNvbnRhaW5lcik7XG4gICAgICAgIG1ha2VEcm9wRG93bnMobGFuZ3VhZ2VzW2NvbmZpZy5sYW5ndWFnZV0udGltZVdpZGdldC5lbmQsIHRpbWVQaWNrZXJDb250YWluZXIpO1xuICAgICAgICBcbiAgICAgICAgLy8gc2V0VGltZUZvckFsbFRpY2tCb3godGltZVBpY2tlckNvbnRhaW5lcik7IFxuICAgICAgICBcbiAgICAgIH1cblxuICAgICAgbWFrZUJ1dHRvbihjb250cm9sc0RpdiwgJ2RlbGV0ZUJ1dHRvbicsICcrJywgJ2FkZCB0aW1lJywgJ2NsaWNrJywgaW5uZXJDb21wb25lbnRzKTtcbiAgICAgIG1ha2VCdXR0b24oY29udHJvbHNEaXYsICdkZWxldGVCdXR0b24nLCAnLScsICdyZW1vdmUgdGltZScsICdjbGljaycsIHJlbW92ZVRpbWVWYWx1ZXNPbkRhdGUpO1xuICAgICAgbWFrZUJ1dHRvbihjb250cm9sc0RpdiwgJ2RlbGV0ZUJ1dHRvbicsICd4JywgJ2Nsb3NlJywgJ2NsaWNrJywgY2xvc2VGbik7XG4gICAgICBcbiAgICAgIHJlc29sdmUodGltZUNob29zZXJNb2RhbCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cblxuICBmdW5jdGlvbiB3cml0ZVRvRGF0ZURpdiAoKSB7XG4gICAgaWYgKGNvbmZpZy5kaXNwbGF5VGltZVNlbGVjdGlvbk9uRGF0ZSkge1xuICAgICAgZHluYW1pY0RhdGEuZGF0ZXNTZWxlY3RlZEFycmF5W2R5bmFtaWNEYXRhLmRhdGVzU2VsZWN0ZWRBcnJheS5sZW5ndGgtMV0uZm9yRWFjaCgoZGF5U2VsZWN0ZWQpID0+IHtcbiAgICAgICAgd3JpdGUoZGF5U2VsZWN0ZWQpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gd3JpdGUgKGRhdGUpIHtcbiAgICAvLyBjb250YWlucyBhIHRpbWUgZHVyYXRpb24gY2hvaWNlXG4gICAgbGV0IGNhbGVuZGFyVGltZVBhcmVudDtcblxuICAgIGNvbnN0IGRheURpdiA9IGNhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLWh1bWFuZGF0ZT0nJHtkYXRlfSddYCk7XG4gICAgd2hpbGUgKGRheURpdi5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XG4gICAgICBkYXlEaXYucmVtb3ZlQ2hpbGQoZGF5RGl2Lmxhc3RDaGlsZCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY3JlYXRlTmV3UGFyYSAodGV4dCkge1xuICAgICAgY29uc3QgdGltZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICAgIGNhbGVuZGFyVGltZVBhcmVudC5hcHBlbmRDaGlsZCh0aW1lKTtcbiAgICAgIHRpbWUuY2xhc3NMaXN0LmFkZCgnY2FsZW5kYXJUaW1lJyk7XG4gICAgICB0aW1lLnRleHRDb250ZW50ID0gdGV4dDtcbiAgICB9XG5cbiAgICBzZWxlY3Rpb24uZm9yRWFjaCgodGltZVZhbHVlLCBpKSA9PiB7XG4gICAgICBpZiAoaSA9PT0gMCB8fCBpICUgMiA9PT0gMCkge1xuICAgICAgICBjYWxlbmRhclRpbWVQYXJlbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgY2FsZW5kYXJUaW1lUGFyZW50LmNsYXNzTGlzdC5hZGQoJ2NhbGVuZGFyVGltZVBhcmVudCcpO1xuICAgICAgICBkYXlEaXYuYXBwZW5kQ2hpbGQoY2FsZW5kYXJUaW1lUGFyZW50KTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZmllbGROYW1lID0gT2JqZWN0LmtleXModGltZVZhbHVlKVswXTtcbiAgICAgIGNyZWF0ZU5ld1BhcmEoYCR7ZmllbGROYW1lfTpgKTtcbiAgICAgIGNyZWF0ZU5ld1BhcmEoYCR7dGltZVZhbHVlW2ZpZWxkTmFtZV0uaGh9OiR7dGltZVZhbHVlW2ZpZWxkTmFtZV0ubW19YCk7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBtYWtlQnV0dG9uIChwYXJlbnQsIGNsYXNzTmFtZSwgdGV4dENvbnRlbnQsIGhvdmVyVGV4dCwgYWN0aW9uLCBmbikge1xuICAgIGNvbnN0IGJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSk7XG4gICAgYnV0dG9uLnRleHRDb250ZW50ID0gdGV4dENvbnRlbnQ7XG4gICAgYnV0dG9uLnRpdGxlID0gaG92ZXJUZXh0O1xuICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKGFjdGlvbiwgKCkgPT4ge1xuICAgICAgZm4oKTtcbiAgICB9KTtcbiAgICBwYXJlbnQuYXBwZW5kQ2hpbGQoYnV0dG9uKTtcbiAgfVxuICBcbiAgZnVuY3Rpb24gbWFrZURyb3BEb3ducyAoY29udGV4dFRleHQsIHRpbWVQaWNrZXJDb250YWluZXIpIHtcbiAgICAvLyBUaGUgdGltZSBjb250YWluZXJcbiAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBjb250YWluZXIuY2xhc3NMaXN0LmFkZCgndGltZUNvbnRhaW5lcicpO1xuICAgIGNvbnRhaW5lci5kYXRhc2V0LmNvbnRleHQgPSBjb250ZXh0VGV4dDtcbiAgICB0aW1lUGlja2VyQ29udGFpbmVyLmFwcGVuZENoaWxkKGNvbnRhaW5lcik7XG4gIFxuICAgIGNvbnN0IHRpbWVGb3JDb250ZXh0ID0geyBbY29udGV4dFRleHRdOiB7fSB9O1xuXG4gICAgc2VsZWN0aW9uLnB1c2godGltZUZvckNvbnRleHQpO1xuICBcbiAgICAvLyBNYWtlIGxhYmVsXG4gICAgY29uc3QgbGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgbGFiZWwuY2xhc3NMaXN0LmFkZCgndGltZVNlbGVjdFAnKTtcbiAgICBsYWJlbC50ZXh0Q29udGVudCA9IGAke2NvbnRleHRUZXh0fTpgO1xuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChsYWJlbCk7XG4gIFxuICAgIC8vIE1ha2UgaG91ciBzZWxlY3RvclxuICAgIGNvbnN0IHRpbWVTZWxlY3RvckRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRpbWVTZWxlY3RvckRpdi5kYXRhc2V0LmNvbnRleHQgPSBjb250ZXh0VGV4dDtcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQodGltZVNlbGVjdG9yRGl2KTtcbiAgXG4gICAgbWFrZVNlbGVjdG9yKCdoaCcsIDIzLCB0aW1lU2VsZWN0b3JEaXYsIGNvbnRleHRUZXh0LCB0aW1lUGlja2VyQ29udGFpbmVyLCB0aW1lRm9yQ29udGV4dCk7XG4gICAgbWFrZVNlbGVjdG9yKCdtbScsIDU5LCB0aW1lU2VsZWN0b3JEaXYsIGNvbnRleHRUZXh0LCB0aW1lUGlja2VyQ29udGFpbmVyLCB0aW1lRm9yQ29udGV4dCk7XG4gIH1cbiAgXG4gIGZ1bmN0aW9uIG1ha2VTZWxlY3RvciAodHlwZSwgbGltaXQsIHRpbWVTZWxlY3RvckRpdiwgY29udGV4dFRleHQsIHRpbWVQaWNrZXJDb250YWluZXIsIHRpbWVGb3JDb250ZXh0KSB7XG4gICAgY29uc3QgZHJvcERvd24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzZWxlY3QnKTtcbiAgICBkcm9wRG93bi5jbGFzc0xpc3QuYWRkKHR5cGUsICd0aW1lU2VsZWN0Jyk7XG4gICAgdGltZVNlbGVjdG9yRGl2LmFwcGVuZENoaWxkKGRyb3BEb3duKTtcbiAgXG4gICAgZHJvcERvd24uZGF0YXNldC50eXBlID0gdHlwZTtcbiAgICBkcm9wRG93bi5kYXRhc2V0LmNvbnRleHQgPSBjb250ZXh0VGV4dDtcbiAgXG4gICAgY29uc3QgcGxhY2Vob2xkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcbiAgICBwbGFjZWhvbGRlci50ZXh0Q29udGVudCA9IHR5cGU7XG4gICAgcGxhY2Vob2xkZXIudmFsdWUgPSAnMDAnO1xuICBcbiAgICAvLyB7XCJTdGFydFwiOntcImhoXCI6XCIwMFwifX0se1wiU3RhcnRcIjp7XCJtbVwiOlwiMDBcIn19XG4gICAgdGltZUZvckNvbnRleHRbY29udGV4dFRleHRdW3R5cGVdID0gcGxhY2Vob2xkZXIudmFsdWU7XG4gICAgZHJvcERvd24uYXBwZW5kQ2hpbGQocGxhY2Vob2xkZXIpO1xuICBcbiAgICBsZXQgaSA9IDA7XG4gICAgd2hpbGUgKGkgPD0gbGltaXQpIHtcbiAgICAgIGNvbnN0IGhvdXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcbiAgICAgIGxldCB0ZXh0ID0gaS50b1N0cmluZygpO1xuICAgICAgaWYgKHRleHQubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIHRleHQgPSBgMCR7aX1gO1xuICAgICAgfVxuICAgICAgaG91ci52YWx1ZSA9IHRleHQ7XG4gICAgICBob3VyLnRleHRDb250ZW50ID0gdGV4dDtcbiAgICAgIGRyb3BEb3duLmFwcGVuZENoaWxkKGhvdXIpO1xuICAgICAgaSsrO1xuICAgIH1cbiAgXG4gICAgZHJvcERvd24uYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKCkgPT4ge1xuICAgICAgdGltZUZvckNvbnRleHRbY29udGV4dFRleHRdW3R5cGVdID0gZHJvcERvd24udmFsdWU7XG4gICAgICB3cml0ZVRvRHluYW1pY0RhdGEoKTtcbiAgICAgIHdyaXRlVG9EYXRlRGl2KCk7XG4gICAgICBlbWl0VGltZVNlbGVjdGVkRXZlbnQoKTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHdyaXRlVG9EeW5hbWljRGF0YSAoKSB7XG4gICAgZHluYW1pY0RhdGEuZGF0ZXNTZWxlY3RlZEFycmF5T2JqZWN0c1tkeW5hbWljRGF0YS5kYXRlc1NlbGVjdGVkQXJyYXlPYmplY3RzLmxlbmd0aC0xXS5mb3JFYWNoKChkYXlTZWxlY3RlZCkgPT4ge1xuICAgICAgY29uc3QgdGltZXMgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHNlbGVjdGlvbikpO1xuICAgICAgZGF5U2VsZWN0ZWQudGltZXMgPSB0aW1lcztcbiAgICAgIGNvbnN0IG5hbWVzID0gT2JqZWN0LmtleXModGltZXMpO1xuICAgICAgT2JqZWN0LnZhbHVlcyh0aW1lcykuZm9yRWFjaCgodGltZSwgaSkgPT4ge1xuICAgICAgICBsZXQgdmFsID0gT2JqZWN0LnZhbHVlcyh0aW1lKTtcbiAgICAgICAgbGV0IGhobW1zcyA9IE9iamVjdC52YWx1ZXModmFsWzBdKTtcbiAgICAgICAgZGF5U2VsZWN0ZWQudGltZXNbbmFtZXNbaV1dLlVUQyA9IGh1bWFuZGF0ZVRvVVRDKGRheVNlbGVjdGVkLmh1bWFuZGF0ZSwgaGhtbXNzKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gaHVtYW5kYXRlVG9VVEMgKGh1bWFuZGF0ZSwgdGltZSkge1xuICAgIGNvbnN0IGhoID0gKHRpbWVbMF0pID8gdGltZVswXSA6IDA7XG4gICAgY29uc3QgbW0gPSAodGltZVsxXSkgPyB0aW1lWzFdIDogMDtcbiAgICBjb25zdCBzcyA9ICh0aW1lWzJdKSA/IHRpbWVbMl0gOiAwO1xuXG4gICAgbGV0IGludHMgPSBodW1hbmRhdGUuc3BsaXQoJy0nKTtcbiAgICBpbnRzID0gaW50cy5tYXAoKGludCkgPT4gcGFyc2VJbnQoaW50KSk7XG4gICAgaW50c1sxXSA9IGludHNbMV0gLSAxO1xuICAgIHJldHVybiBEYXRlLlVUQyhpbnRzWzBdLCBpbnRzWzFdLCBpbnRzWzJdLCBoaCwgbW0sIHNzKTtcbiAgfVxuICBcbiAgZnVuY3Rpb24gcmVtb3ZlVGltZVZhbHVlc09uRGF0ZSAoKSB7XG4gICAgY29uc3QgZCA9IGR5bmFtaWNEYXRhLmRhdGVzU2VsZWN0ZWRBcnJheU9iamVjdHM7XG4gICAgY29uc3QgbGFzdENob2ljZSA9IGRbZC5sZW5ndGggLSAxXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxhc3RDaG9pY2UubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGRhdGVPYmogPSBsYXN0Q2hvaWNlW2ldO1xuICAgICAgY29uc3QgZGF5RGl2ID0gY2FsZW5kYXIucXVlcnlTZWxlY3RvcihgW2RhdGEtaHVtYW5kYXRlPScke2RhdGVPYmouaHVtYW5kYXRlfSddYCk7XG4gICAgICBkYXlEaXYucmVtb3ZlQ2hpbGQoZGF5RGl2Lmxhc3RDaGlsZCk7XG4gICAgICBkYXRlT2JqLnRpbWVzID0gZGF0ZU9iai50aW1lcy5zbGljZSgwLCAtMik7XG4gICAgfVxuICAgIHNlbGVjdGlvbiA9IHNlbGVjdGlvbi5zbGljZSgwLCAtMik7XG4gICAgY29uc3QgdGltZUNob29zZXIgPSBjYWxlbmRhci5xdWVyeVNlbGVjdG9yKCcudGltZUNob29zZXInKTtcbiAgICB0aW1lQ2hvb3Nlci5yZW1vdmVDaGlsZCh0aW1lQ2hvb3Nlci5sYXN0Q2hpbGQpO1xuICB9XG5cbiAgLyoqXG4gICAqIHRpY2tCb3hlcyAtIGRlc2NyaXB0aW9uXG4gICAqXG4gICAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSB0aW1lUGlja2VyRWxlbWVudHNDb250YWluZXIgVGhpcyBpcyB0aGUgSFRNTCBlbGVtZW50IHRvIHdoaWNoIHRoZSBjaGVja2JveCB3aWxsIGJlIGFwcGVuZGVkLlxuICAgKiBAcmV0dXJuIHtIVE1MRWxlbWVudH0gUmV0dXJucyBhIEhUTUwgY2hlY2tib3ggdG8gc2VsZWN0IGFsbCBkYXlzIG9mIGEgcGFydGljdWxhciB0eXBlIChlLmcuIGFsbCBNb25kYXlzKS5cbiAgICogQGRlc2NyaXB0aW9uIE5PVCBJTVBMRU1FTlRFRFxuICAgKi9cbiAgXG4gIGZ1bmN0aW9uIHNldFRpbWVGb3JBbGxUaWNrQm94ICh0YXJnZXREaXYpIHtcbiAgICBjb25zdCBkYXkgPSBkeW5hbWljRGF0YS5kYXRlc1NlbGVjdGVkQXJyYXlbZHluYW1pY0RhdGEuZGF0ZXNTZWxlY3RlZEFycmF5Lmxlbmd0aC0xXTtcbiAgICBjb25zdCBkYXlDb2RlID0gY2FsZW5kYXIucXVlcnlTZWxlY3RvcihgW2RhdGEtaHVtYW5kYXRlPScke2RheX0nXWApLmRhdGFzZXQuZGF5b2Z3ZWVrO1xuICAgIGNvbnN0IHRleHQgPSBmb3JtYXREYXlUZXh0KGRheUNvZGUpO1xuICAgIFxuICAgIGNvbnN0IGxhYmVsZm9yID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgIGxhYmVsZm9yLnRleHRDb250ZW50ID0gdGV4dDtcbiAgICBsYWJlbGZvci5odG1sRm9yID0gJ3NldFRpbWVGb3JBbGwnO1xuICAgIHRhcmdldERpdi5hcHBlbmRDaGlsZChsYWJlbGZvcik7XG5cbiAgICBjb25zdCBzZXRUaW1lRm9yQWxsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICBzZXRUaW1lRm9yQWxsLnNldEF0dHJpYnV0ZSgndHlwZScsICdjaGVja2JveCcpO1xuICAgIHNldFRpbWVGb3JBbGwubmFtZSA9ICdzZXRUaW1lRm9yQWxsJztcbiAgICB0YXJnZXREaXYuYXBwZW5kQ2hpbGQoc2V0VGltZUZvckFsbCk7XG5cbiAgICBzZXRUaW1lRm9yQWxsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgLy8gQm9vayBkYXRlcyBtZXRob2QgbmVlZHMgdG8gYmUgZXhwb3NlZCBpbiBhIG1hbm5lciBpdCBjYW4gYmUgY2FsbGVkIGZyb20gaGVyZVxuICAgIH0pO1xuICB9XG4gIFxuXG4gIC8qKlxuICogRm9ybWF0cyB0aGUgZGF5IG9mIHRoZSB3ZWVrIGFuZCByZXR1cm5zIGl0IGFzIGEgc3RyaW5nLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0QmVmb3JlIC0gVGhlIHRleHQgdG8gYmUgYWRkZWQgYmVmb3JlIHRoZSBmb3JtYXR0ZWQgZGF5LlxuICogQHBhcmFtIHtzdHJpbmd9IHRleHRBZnRlciAtIFRoZSB0ZXh0IHRvIGJlIGFkZGVkIGFmdGVyIHRoZSBmb3JtYXR0ZWQgZGF5LlxuICogQHBhcmFtIHtudW1iZXJ9IGRheU9mV2VlayAtIFRoZSBpbmRleCBvZiB0aGUgZGF5IG9mIHRoZSB3ZWVrICgwIGZvciBTdW5kYXksIDEgZm9yIE1vbmRheSwgZXRjLikuXG4gKiBAcmV0dXJuIHtzdHJpbmd9IFRoZSBmb3JtYXR0ZWQgZGF5IG9mIHRoZSB3ZWVrIGFzIGEgc3RyaW5nLlxuICovXG4gIGZ1bmN0aW9uIGZvcm1hdERheVRleHQgKGRheU9mV2Vlaykge1xuICAgIGNvbnN0IGRheXNJbkZ1bGwgPSBsYW5ndWFnZXNbY29uZmlnLmxhbmd1YWdlXS5nZW5lcmFsVGltZS5kYXlzSW5GdWxsO1xuICAgIGNvbnN0IGJlZm9yZVRleHQgPSBsYW5ndWFnZXNbY29uZmlnLmxhbmd1YWdlXS5mb3JtYXREYXlUZXh0LnRleHRCZWZvcmU7XG4gICAgY29uc3QgZm9ybWF0dGVkRGF5ID0gZGF5c0luRnVsbFtkYXlPZldlZWtdO1xuICAgIGNvbnN0IHBsdXJhbGlzbSA9IGxhbmd1YWdlc1tjb25maWcubGFuZ3VhZ2VdLnBsdXJhbGlzbTtcbiAgICBjb25zdCBhZnRlclRleHQgPSBsYW5ndWFnZXNbY29uZmlnLmxhbmd1YWdlXS5mb3JtYXREYXlUZXh0LnRleHRBZnRlcjtcbiAgICByZXR1cm4gYCR7YmVmb3JlVGV4dH0gJHtmb3JtYXR0ZWREYXl9JHtwbHVyYWxpc219ICR7YWZ0ZXJUZXh0fWA7XG4gIH1cblxufVxuXG5leHBvcnQgeyBHZW5lcmF0ZVRpbWVDaG9vc2VyTW9kYWwgfTtcbiIsIi8qZXNsaW50IHF1b3RlczogW1wiZXJyb3JcIiwgXCJiYWNrdGlja1wiXSovXG4vLyBCYWN0aWNrcyBhcmUgZW5mb3JjZWRmIGluIHRoaXMgZmlsZSBzbyB0aGF0IHNwZWNpYWwgY2hhcmFjdGVycyBhcmUgY29ycmVjdGx5IHJlbmRlcmVkLlxuLyogTGFuZ3VhZ2UgZGVmYXVsdHMgKi9cbmNvbnN0IGVuR2IgPSB7XG4gIGdlbmVyYWxUaW1lOiB7XG4gICAgbW9udGhzOiBbYEphbnVhcnlgLCBgRmVicnVhcnlgLCBgTWFyY2hgLCBgQXByaWxgLCBgTWF5YCwgYEp1bmVgLCBgSnVseWAsIGBBdWd1c3RgLCBgU2VwdGVtYmVyYCwgYE9jdG9iZXJgLCBgTm92ZW1iZXJgLCBgRGVjZW1iZXJgXSxcbiAgICBkYXlzSW5GdWxsOiBbYFN1bmRheWAsIGBNb25kYXlgLCBgVHVlc2RheWAsIGBXZWRuZXNkYXlgLCBgVGh1cnNkYXlgLCBgRnJpZGF5YCwgYFNhdHVyZGF5YF0sXG4gICAgZGF5c1RydW5jYXRlZDogW2BTdW5gLCBgTW9uYCwgYFR1ZWAsIGBXZWRgLCBgVGh1YCwgYEZyaWAsIGBTYXRgXVxuICB9LFxuICBwbHVyYWxpc206IGBzYCxcbiAgZm9ybWF0RGF5VGV4dDoge1xuICAgIHRleHRCZWZvcmU6IGBTZXQgdGhlc2UgdGltZXMgZm9yIGFsbGAsXG4gICAgdGV4dEFmdGVyOiBgYFxuICB9LFxuICB0aW1lV2lkZ2V0OiB7XG4gICAgYWRkVGltZTogYEFkZCB0aW1lOmAsXG4gICAgc3RhcnQ6IGBTdGFydGAsXG4gICAgZW5kOiBgRW5kYFxuICB9XG59O1xuXG4vKiBMYW5ndWFnZSBkZWZhdWx0cyAqL1xuY29uc3QgcHRQdCA9IHtcbiAgZ2VuZXJhbFRpbWU6IHtcbiAgICBtb250aHM6IFtgSmFuZWlyb2AsIGBGZXZlcmVpcm9gLCBgTWFyw6dvYCwgYEFicmlsYCwgYE1haW9gLCBgSnVuaG9gLCBgSnVsaG9gLCBgQWdvc3RvYCwgYFNldGVtYnJvYCwgYE91dHVicm9gLCBgTm92ZW1icm9gLCBgRGV6ZW1icm9gXSxcbiAgICBkYXlzSW5GdWxsOiBbYERvbWluZ29gLCBgU2VndW5kYS1GZWlyYWAsIGBUZXLDp2EtRmVpcmFgLCBgUXVhcnRhLUZlaXJhYCwgYFF1aW50YS1GZWlyYWAsIGBTZXh0YS1GZWlyYWAsIGBTw6FiYWRvYF0sXG4gICAgZGF5c1RydW5jYXRlZDogW2BEb21gLCBgU2VnYCwgYFRlcmAsIGBRdWFgLCBgUXVpYCwgYFNleGAsIGBTYWJgXVxuICB9LFxuICBwbHVyYWxpc206IGBzYCxcbiAgZm9ybWF0RGF5VGV4dDoge1xuICAgIHRleHRCZWZvcmU6IGBBcHBsaXF1ZSBlc3RhcyBob3JhcyBhYCxcbiAgICB0ZXh0QWZ0ZXI6IGBgXG4gIH0sXG4gIHRpbWVXaWRnZXQ6IHtcbiAgICBhZGRUaW1lOiBgQWRpY2lvbmUgZHVyYcOnw6NvOmAsXG4gICAgc3RhcnQ6YEluw61jaW9gLFxuICAgIGVuZDogYEZpbWBcbiAgfVxuXG59O1xuXG5jb25zdCBsYW5ndWFnZXMgPSB7IGVuR2IsIHB0UHQgfTtcblxuZXhwb3J0IHsgbGFuZ3VhZ2VzIH07XG4iLCJjb25zdCBjb2xvdXJzID0ge1xuICBtb250aENvbG9yOiAnI2ZjMycsXG4gIG1vbnRoQmFja2dvdW5kQm9sb3I6ICcjNjc5OWNiJyxcbiAgZGF5TmFtZUNvbG9yOiAnIzAwMCcsXG4gIGRheU5hbWVCYWNrZ3JvdW5kQ29sb3I6ICcjY2NjJyxcbiAgZGF5Q29sb3I6ICcjMDAwJyxcbiAgZGF5QmFja2dyb3VuZENvbG9yOiAnI2ZmZicsXG4gIG1vbnRoQm9yZGVyQ29sb3I6ICcjZjE1OTI1J1xufTtcblxuY29uc3Qgc2VsZWN0ZWRTdHlsZSA9IChkaXYpID0+IHtcbiAgZGl2LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGNvbG91cnMubW9udGhDb2xvcjtcbn07XG5cbmNvbnN0IHVuc2VsZWN0ZWRTdHlsZSA9IChkaXYpID0+IHtcbiAgZGl2LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGNvbG91cnMuZGF5QmFja2dyb3VuZENvbG9yO1xufTtcblxuZXhwb3J0IHsgc2VsZWN0ZWRTdHlsZSwgdW5zZWxlY3RlZFN0eWxlLCBjb2xvdXJzIH07XG4iXX0=
