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

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.blockDaysNotOpen = blockDaysNotOpen;
exports.checkOverlap = checkOverlap;
exports.clearSelection = clearSelection;
exports.formatDate = formatDate;
exports.generateRandomString = generateRandomString;
exports.getDaysInMonth = getDaysInMonth;
exports.getEarliestDate = getEarliestDate;
exports.humanDate = humanDate;
exports.preloadDates = preloadDates;
exports.releaseBookedDay = releaseBookedDay;
exports.sortTimes = sortTimes;
exports.timeValueInMill = timeValueInMill;
var _styles = require("./styles.js");
var _calendarGenerator = require("./calendarGenerator.js");
var _displayTimeChooserModal = require("./displayTimeChooserModal.js");
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw new Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw new Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
// utility to return date in correct format
function formatDate(d) {
  var date = d ? new Date(d) : new Date();
  var day = date.getDate();
  var month = date.getMonth() + 1;
  var year = date.getFullYear();
  var formated = "".concat(year, "-").concat(month, "-").concat(day);
  return formated;
}
;

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
 * var getDaysInMonth - Get number of days in month
 *
 * @param  {!number} month The number of the corresponding month.
 * @param  {!number} year  The corresponding year.
 * @return {number} Returns a number corresponding to the number of days for the date in point.
 */
function getDaysInMonth(month, year) {
  return new Date(year, month, 0).getDate();
}

/**
 * Checks for overlap in an array of values.
 *
 * @param {Array} values - The array of values to check for overlap.
 * @return {boolean} - Returns true if overlap is found, false otherwise.
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

/**
 * Clears the selection of dates in the calendar.
 *
 * @param {undefined}
 * @return {undefined}
 */
function clearSelection(calendar, dynamicData) {
  var datesObjStore = dynamicData.datesSelectedArrayObjects;
  var datesIndex = dynamicData.datesSelectedArray;
  var _loop = function _loop(i) {
    var _loop2 = function _loop2(j) {
      datesIndex[j].forEach(function (date) {
        (0, _styles.unselectedStyle)(calendar.querySelector("[data-humandate='".concat(date, "']")));
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

/*

*/

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
 * Converts an array of dates into a new array of objects with formatted dates.
 *
 * @param {Array} dates - The array of dates.
 * @return {Promise} A promise that resolves to the new array of objects.
 */
function convertDates(dates) {
  var promise = new Promise(function (resolve, reject) {
    for (var i = 0; i < dates.length; i++) {
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
function preloadDates(_x, _x2) {
  return _preloadDates.apply(this, arguments);
}
function _preloadDates() {
  _preloadDates = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(calendar, dates) {
    var endUser, i, dateObject, dateNode, soldOut;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          console.log('PRELOADING DATES...');
          // console.log(calendar);
          // console.log(dates);
          dates = ['2023-10-10'];
          endUser = 1; //attach(dateNode);
          _context.next = 5;
          return convertDates(dates);
        case 5:
          for (i = 0; i < datesSelectedArrayObjects.length; i++) {
            dateObject = datesSelectedArrayObjects[i];
            dateNode = calendar.querySelector("#".concat(dateObject.day));
            if (dateNode) {
              datesSelectedArray.push(dates[i].day);
              dateNode.style.backgroundColor = '#fc3';
              dateNode.classList.add('available');
            }
            if (endUser) {
              attach(dateNode);
              //timeChooser();
            }

            if (_displayTimeChooserModal.displayTimeChooserModal) {
              // createTimeElements ();
              //generateTimesOnly(dateObject.times, dateNode);
            }
            if (selectRange && dateNode && !dateNode.classList.contains('filler')) {
              dateNode.style.backgroundColor = '#333';
              dateNode.classList.add('blocked');
              dateNode.title = 'No availability on this day';
              soldOut = document.createElement('p');
              soldOut.classList.add('calendarTime');
              soldOut.textContent = 'Sold out';
              dateNode.appendChild(soldOut);
            }
          }
        case 6:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _preloadDates.apply(this, arguments);
}
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
        day.classList.add('widthShape', 'filler');
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

/**
 * Release booked day
 * @description Removes a day that has been previously booked.
 * @function releaseBookedDay
 * @param {HTMLElement} day - HTML div element representing the day.
 * @param {string} date - Date string in the format 'YYYY-MM-DD'.
 */
function releaseBookedDay(day, date) {
  var index = datesSelectedArray.indexOf(date);
  (0, _styles.unselectedStyle)(day);
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
function humanDate(date) {
  var dateParts = date.split('-');
  var month = parseInt(dateParts[1]) + 1;
  var day = parseInt(dateParts[2]);
  var modifiedMonth = month < 10 ? "0".concat(month) : month;
  var modifiedDay = day < 10 ? "0".concat(day) : day;
  var modifiedDate = "".concat(dateParts[0], "-").concat(modifiedMonth, "-").concat(modifiedDay);
  return modifiedDate;
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
 * Release day of week
 * @function releaseDayOfWeekG
 * @param dayID id of the day to be released. N.b. day of week is stored as a data attribute
 * @todo make it use lastDateClicked (which is the day in context)
 */
function releaseDayOfWeekG(dayId) {
  var weekday = _calendarGenerator.lastDateClicked.dataset.dayofweek;
  var blockTheseDays = document.querySelectorAll("[data-dayofweek='" + weekday + "']");
  for (var i = 0; i < blockTheseDays.length; i++) {
    var blockDay = document.getElementById(blockTheseDays[i].id);
    if (blockDay !== _calendarGenerator.lastDateClicked) {
      releaseBookedDay(blockDay, blockTheseDays[i].id);
      removeTimeDisplay(blockTheseDays[i].id);
    }
    if (blockDay === _calendarGenerator.lastDateClicked) {
      // remove only the display:
      //removeTimeDisplay(blockTheseDays[i].id);
    }
  }
}

//bookDay singleDateChoice
//releaseBookedDay datesSelectedArrayObjects datesSelectedArray

},{"./calendarGenerator.js":4,"./displayTimeChooserModal.js":5,"./styles.js":7}],3:[function(require,module,exports){
var css = ".calendar {\n  display: flex;\n  flex-wrap: wrap;\n  flex-direction: row;\n  background-color: rgba(240, 248, 255, 0);\n  width: 100%;\n  height: 28.8em;\n  overflow-y: auto;\n  position: relative;\n  color: #333;\n  font-family: Ubuntu, Arial, Helvetica, sans-serif;\n  font-size: 1.2em;\n  font-weight: 700;\n  line-height: 1.5;\n}\n.calendar .blocked {\n  background-color: #333;\n}\n.calendar .filler {\n  pointer-events: none;\n  opacity: 0.3;\n}\n.calendar .preloaded {\n  border-color: blue;\n  border-style: solid;\n  border-width: 3px;\n}\n.calendar .timeSelect {\n  padding: 0;\n  width: auto;\n  margin: 0;\n  background-color: #fff;\n  float: right;\n  font-weight: 700;\n  font-family: Arial, Helvetica, sans-serif;\n  border-style: solid;\n  border-radius: 1em;\n  text-align: center;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  border-width: 3px;\n  border-color: #f15925;\n  color: #000;\n  font-size: 0.9em;\n}\n.calendar .timeCont {\n  margin-left: auto;\n  width: 10em;\n  background-color: aliceblue;\n  border-style: solid;\n  border-color: #f15925;\n  margin-right: auto;\n  margin-top: 10em;\n}\n.calendar .dayblockrow {\n  display: flex;\n  flex-direction: row;\n  min-width: 100%;\n  background-color: aliceblue;\n}\n.calendar .calendarTimeParent {\n  margin: 0.1em;\n}\n.calendar .calendarTimeParent .calendarTime {\n  font-size: 0.9em;\n  margin-top: 0em;\n  line-height: 1;\n  background-color: aliceblue;\n  color: black;\n  text-align: center;\n  margin: 0px;\n}\n.calendar .widthShapeDays {\n  width: 14.2857142857%;\n  margin-left: auto;\n  margin-right: auto;\n  text-align: center;\n}\n.calendar .widthShape {\n  width: 14.2857142857%;\n  margin-left: auto;\n  margin-right: auto;\n  text-align: center;\n  min-height: 3.6em;\n  margin-bottom: 0.2em;\n}\n.calendar .monthName {\n  margin: auto;\n  text-align: center;\n  font-family: Ubuntu;\n  font-size: 1.61em;\n  background-color: #337ab7;\n  color: #ffcc33;\n  flex-basis: 100%;\n  border-bottom-style: solid;\n}\n.calendar .weekrow {\n  display: flex;\n  flex-wrap: nowrap;\n  flex-direction: row;\n  background-color: #fff;\n  font-family: \"roboto\", \"arial\";\n}\n.calendar .dayName {\n  color: black;\n  font-family: \"roboto\", \"arial\";\n  font-weight: 600;\n  background-color: #ccc;\n}\n.calendar .month > * {\n  margin-left: 2px;\n  margin-right: 2px;\n}\n.calendar .month {\n  width: 50%;\n  min-width: 300px;\n  margin: auto;\n}\n.calendar .timeChooser {\n  width: 10em;\n  position: static;\n  background-color: aliceblue;\n  margin-left: auto;\n  margin-right: auto;\n}\n.calendar .timeContainer {\n  display: flex;\n}\n.calendar .timeChooserModal {\n  z-index: 1;\n  width: 100%;\n  height: 100%;\n  background-color: rgba(0, 0, 0, 0.4);\n  position: absolute;\n  margin: 0;\n  padding: 0;\n  border: 0;\n  overflow-x: scroll;\n}\n.calendar .calendarLabel {\n  min-width: 3em;\n  padding: 0em 1em 0em 1em;\n  color: black;\n  font-family: \"roboto\", \"arial\";\n  font-weight: 600;\n  background-color: #ccc;\n  margin: 1em 0 1em 0;\n}\n.calendar .deleteDiv {\n  font-family: Ubuntu;\n  font-size: 1.61em;\n  background-color: #337ab7;\n  color: #ffcc33;\n  border-bottom-style: solid;\n  height: 2em;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.calendar .deleteButton {\n  background-color: white;\n  color: #f15925;\n  float: right;\n  font-weight: 700;\n  font-family: Arial, Helvetica, sans-serif;\n  border-style: solid;\n  border-radius: 1em;\n  text-align: center;\n  height: 30px;\n  width: 30px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.calendar .innerSpanDeleteBtn {\n  text-align: center;\n}\n.calendar .deleteButton:hover,\n.calendar .deleteButton:focus,\n.calendar .timeSelect:hover,\n.calendar .timeSelect:focus {\n  color: #000;\n  text-decoration: none;\n  cursor: pointer;\n}\n.calendar .hour {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 10em;\n}\n.calendar .timeSelectP {\n  display: inline;\n  width: 5em;\n  color: #000;\n}\n.calendar .timeChooser > input[type=checkbox] {\n  outline: #f15925;\n  outline-style: solid;\n}\n.calendar .timeSelect > option {\n  color: #000;\n}\n.calendar .calendar > p,\n.calendar h4,\n.calendar h3,\n.calendar h2,\n.calendar h1,\n.calendar select,\n.calendar option {\n  color: #000;\n}\n.calendar .arrow-up {\n  width: 0;\n  height: 0;\n  border-left: 10px solid transparent;\n  border-right: 10px solid transparent;\n  border-bottom: 10px solid black;\n}\n.calendar .arrow-down {\n  width: 0;\n  height: 0;\n  border-left: 10px solid transparent;\n  border-right: 10px solid transparent;\n  border-top: 10px solid #000;\n}\n.calendar .arrows {\n  float: right;\n  clear: right;\n  position: relative;\n  cursor: pointer;\n  flex-direction: column;\n}\n.calendar .arrow-right {\n  width: 0;\n  height: 0;\n  border-top: 60px solid transparent;\n  border-bottom: 60px solid transparent;\n  border-left: 60px solid green;\n}\n.calendar .arrow-left {\n  width: 0;\n  height: 0;\n  border-top: 10px solid transparent;\n  border-bottom: 10px solid transparent;\n  border-right: 10px solid blue;\n}\n.calendar .dayTime {\n  cursor: pointer;\n}\n.calendar .dayTime > * {\n  pointer-events: none;\n}\n"; (require("browserify-css").createStyle(css, { "href": "preBundlingJS/calendarApp.css" }, { "insertAt": "bottom" })); module.exports = css;
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
      preloadedTooltip: _this.dataset.preloadedTooltip
    });
    _this.dynamicData = calendar.returnDynamicData();
    return _this;
  }
  return _createClass(_class);
}( /*#__PURE__*/_wrapNativeSuper(HTMLElement)));
function SwiftCal() {
  var _this2 = this;
  var timeChooser;
  // for nested functions to access the outer object
  var innerThis = this;
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
    config.endUser = configObj.endUser || false;
    config.endUserDurationChoice = configObj.endUserDurationChoice || false;
    config.backend = configObj.backend || false;
    config.displayBlocked = configObj.displayBlocked || false;
    config.datesOpen = configObj.datesOpen || false;
  };
  this.generateCalendar = function (configObj) {
    console.log(JSON.parse(JSON.stringify(configObj)));
    if (configObj) {
      _this2.setConfig(configObj);
    }
    console.log(configObj);

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
      var promise = new Promise(function (resolve, reject) {
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

    // TODO:
    var endUser = config.endUser;
    var endUserDurationChoice = config.endUserDurationChoice;
    var backend = config.backend;
    var displayBlocked = config.displayBlocked;
    var uniqueDayIndex = 0;
    // Calendar is defined globally within the constructor
    var calendarUniqueId = (0, _basicFunctions.generateRandomString)();
    calendar.id = "calendar-".concat(calendarUniqueId);
    calendar.classList.add('calendar');
    var months = [];
    var dateNow = new Date();
    var earliestDate = preloadedDates && preloadedDates.booked ? (0, _basicFunctions.getEarliestDate)(preloadedDates) : dateNow;
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
      function makeNewWeekRow() {
        weekRow = document.createElement('div');
        month.appendChild(weekRow);
        weekRow.classList.add('weekrow');
        dayofweek = 0;
      }

      // 42 days, i.e. 6 rows of 7
      for (var p = 0; p < 42; p++) {
        if (p === 0) {
          makeNewWeekRow();
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
          if (i === 0 && p >= startDayOfMonth && p < new Date().getDate() + startDayOfMonth) {
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
          makeNewWeekRow();
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
  };
  var clickCount = 1;
  function dateOnClickEvents(e) {
    var dateDiv = e.target;
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
          (0, _basicFunctions.clearSelection)(calendar, dynamicData);
        }
        bookDates([dateDiv]);
      }
      if (clickCount % 2 === 1) {
        bookDates([dateDiv]);
      }
    }
    if (config.singleDateChoice) {
      (0, _basicFunctions.clearSelection)(calendar, dynamicData);
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
  function createNewSelection() {
    var parentAr = dynamicData.datesSelectedArray;
    var parentArObj = dynamicData.datesSelectedArrayObjects;
    var newArray, newObjectsArray;
    newArray = parentAr[parentAr.length - 1];
    if (config.selectRange && newArray && newArray.length === 1) {
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

  /**
   * Range select
   * @description Allows a range of dates to be selected
   * @function bookDates
   * @param dates array
   * @todo allow range select to work with time values.
   * @fires bookDay for each day in a range
   */
  function bookDates(arrayOfDateDivs) {
    var _createNewSelection = createNewSelection(),
      newArray = _createNewSelection.newArray,
      newObjectsArray = _createNewSelection.newObjectsArray;
    for (var i = 0; i < arrayOfDateDivs.length; i++) {
      var dateDiv = arrayOfDateDivs[i];
      findDateSelection(dateDiv);
      bookDay(dateDiv);
    }

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
            (0, _styles.unselectedStyle)(calendar.querySelector("[data-humandate='".concat(date.humandate, "']")));
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
    var startDate = newObjectsArray[0];
    var startIndex = startDate.index;
    // if a single date is selected:
    var endDate = newObjectsArray[1] || startDate;
    var endIndex = endDate.index;
    if (config.selectRange) {
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
  function preloadDates(preloadedDates) {
    function getDivs(dates) {
      var dateDivs = [];
      var promise = new Promise(function (resolve, reject) {
        dates.forEach(function (date, i) {
          var dateDiv = calendar.querySelector("[data-humandate='".concat(date, "']"));
          console.log(dateDiv);
          console.log("[data-humandate='".concat(date, "']"));
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
    getDivs(preloadedDates).then(function (dateDivs) {
      // bookDates(dateDivs);
    });
  }

  /**
   * Creates a standard date object with the given date.
   *
   * @param {any} date - Is a string YYYY-MM-DD months are counted from 0.
   * @return {object} The standard date object with the given date.
   */
  function standardDateObject(date) {
    var times = timeChooser ? timeChooser.getSelectedTimes() : [];
    var obj = {
      day: date.dataset.day,
      humandate: date.dataset.humandate,
      index: date.dataset.dayindex,
      times: times
    };
    return obj;
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

  /**
   * Generates a dialog for choosing time.
   *
   * @return {Promise} A promise that resolves to the generated time chooser modal.
   */
  function generateModal() {
    var promise = new Promise(function (resolve, reject) {
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
      makeButton(controlsDiv, 'deleteButton', 'x', 'close', 'click', closeFn);
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
      }
      makeButton(controlsDiv, 'deleteButton', '+', 'add time', 'click', innerComponents);
      makeButton(controlsDiv, 'deleteButton', '-', 'remove time', 'click', removeTimeValuesOnDate);
      resolve(timeChooserModal);
    });
    return promise;
  }
  function writeToDateDiv() {
    if (config.displayTimeSelectionOnDate) {
      var write = function write(date) {
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
      };
      dynamicData.datesSelectedArray.forEach(function (childArray) {
        childArray.forEach(function (daySelected) {
          write(daySelected);
        });
      });

      // contains a time duration choice
      var calendarTimeParent;
    }
  }
  function makeButton(parent, className, textContent, hoverText, action, fn) {
    var button = document.createElement('button');
    button.classList.add(className);
    button.textContent = textContent;
    button.addEventListener(action, function (e) {
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
    // {[type]: placeholder.value}
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
    dropDown.addEventListener('change', function (selected) {
      timeForContext[contextText][type] = dropDown.value;
      writeToDateDiv();
      emitTimeSelectedEvent();
    });
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
}

},{"./languages.js":6}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.languages = void 0;
/* Language defaults */
var enGb = {
  generalTime: {
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    daysInFull: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    daysTruncated: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  },
  formatDayText: {
    textBefore: 'Set these times for all',
    textAfter: ''
  },
  timeWidget: {
    addTime: 'Add time:',
    start: 'Start',
    end: 'End'
  }
};

/* Language defaults */
var ptPt = {
  generalTime: {
    months: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
    daysInFull: ['Domingo', 'Segunda-Feira', 'Terça-Feira', 'Quarta-Feira', 'Quinta-Feira', 'Sexta-Feira', 'Sábado'],
    daysTruncated: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']
  },
  formatDayText: {
    textBefore: 'Applique estas horas a todos',
    textAfter: ''
  },
  timeWidget: {
    addTime: 'Adicione duração:',
    start: 'Início',
    end: 'Fim'
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS1jc3MvYnJvd3Nlci5qcyIsInByZUJ1bmRsaW5nSlMvYmFzaWNGdW5jdGlvbnMuanMiLCJwcmVCdW5kbGluZ0pTL2NhbGVuZGFyQXBwLmNzcyIsInByZUJ1bmRsaW5nSlMvY2FsZW5kYXJHZW5lcmF0b3IuanMiLCJwcmVCdW5kbGluZ0pTL2Rpc3BsYXlUaW1lQ2hvb3Nlck1vZGFsLmpzIiwicHJlQnVuZGxpbmdKUy9sYW5ndWFnZXMuanMiLCJwcmVCdW5kbGluZ0pTL3N0eWxlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzNFQSxJQUFBLE9BQUEsR0FBQSxPQUFBO0FBQ0EsSUFBQSxrQkFBQSxHQUFBLE9BQUE7QUFDQSxJQUFBLHdCQUFBLEdBQUEsT0FBQTtBQUF5RixTQUFBLG9CQUFBLGtCQUR6RixxSkFBQSxtQkFBQSxZQUFBLG9CQUFBLFdBQUEsQ0FBQSxTQUFBLENBQUEsRUFBQSxDQUFBLE9BQUEsQ0FBQSxHQUFBLE1BQUEsQ0FBQSxTQUFBLEVBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxjQUFBLEVBQUEsQ0FBQSxHQUFBLE1BQUEsQ0FBQSxjQUFBLGNBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBLElBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFBLENBQUEsS0FBQSxLQUFBLENBQUEsd0JBQUEsTUFBQSxHQUFBLE1BQUEsT0FBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLFFBQUEsa0JBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxhQUFBLHVCQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsV0FBQSw4QkFBQSxPQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxXQUFBLE1BQUEsQ0FBQSxjQUFBLENBQUEsQ0FBQSxFQUFBLENBQUEsSUFBQSxLQUFBLEVBQUEsQ0FBQSxFQUFBLFVBQUEsTUFBQSxZQUFBLE1BQUEsUUFBQSxTQUFBLENBQUEsQ0FBQSxDQUFBLFdBQUEsTUFBQSxtQkFBQSxDQUFBLElBQUEsTUFBQSxZQUFBLE9BQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBLFdBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFBLGdCQUFBLEtBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxRQUFBLENBQUEsR0FBQSxDQUFBLElBQUEsQ0FBQSxDQUFBLFNBQUEsWUFBQSxTQUFBLEdBQUEsQ0FBQSxHQUFBLFNBQUEsRUFBQSxDQUFBLEdBQUEsTUFBQSxDQUFBLE1BQUEsQ0FBQSxDQUFBLENBQUEsU0FBQSxHQUFBLENBQUEsT0FBQSxPQUFBLENBQUEsQ0FBQSxnQkFBQSxDQUFBLENBQUEsQ0FBQSxlQUFBLEtBQUEsRUFBQSxnQkFBQSxDQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxNQUFBLENBQUEsYUFBQSxTQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxtQkFBQSxJQUFBLFlBQUEsR0FBQSxFQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsQ0FBQSxFQUFBLENBQUEsY0FBQSxDQUFBLGFBQUEsSUFBQSxXQUFBLEdBQUEsRUFBQSxDQUFBLFFBQUEsQ0FBQSxDQUFBLElBQUEsR0FBQSxJQUFBLE1BQUEsQ0FBQSxxQkFBQSxDQUFBLHFCQUFBLENBQUEsZ0JBQUEsQ0FBQSxnQkFBQSxDQUFBLGdCQUFBLFVBQUEsY0FBQSxrQkFBQSxjQUFBLDJCQUFBLFNBQUEsQ0FBQSxPQUFBLE1BQUEsQ0FBQSxDQUFBLEVBQUEsQ0FBQSxxQ0FBQSxDQUFBLEdBQUEsTUFBQSxDQUFBLGNBQUEsRUFBQSxDQUFBLEdBQUEsQ0FBQSxJQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsTUFBQSxRQUFBLENBQUEsSUFBQSxDQUFBLEtBQUEsQ0FBQSxJQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsQ0FBQSxFQUFBLENBQUEsTUFBQSxDQUFBLEdBQUEsQ0FBQSxPQUFBLENBQUEsR0FBQSwwQkFBQSxDQUFBLFNBQUEsR0FBQSxTQUFBLENBQUEsU0FBQSxHQUFBLE1BQUEsQ0FBQSxNQUFBLENBQUEsQ0FBQSxZQUFBLHNCQUFBLENBQUEsZ0NBQUEsT0FBQSxXQUFBLENBQUEsSUFBQSxNQUFBLENBQUEsQ0FBQSxFQUFBLENBQUEsWUFBQSxDQUFBLGdCQUFBLE9BQUEsQ0FBQSxDQUFBLEVBQUEsQ0FBQSxzQkFBQSxjQUFBLENBQUEsRUFBQSxDQUFBLGFBQUEsT0FBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBLFFBQUEsQ0FBQSxHQUFBLFFBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxHQUFBLENBQUEsRUFBQSxDQUFBLG1CQUFBLENBQUEsQ0FBQSxJQUFBLFFBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxHQUFBLEVBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxLQUFBLFNBQUEsQ0FBQSxnQkFBQSxPQUFBLENBQUEsQ0FBQSxLQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsQ0FBQSxlQUFBLENBQUEsQ0FBQSxPQUFBLENBQUEsQ0FBQSxDQUFBLE9BQUEsRUFBQSxJQUFBLFdBQUEsQ0FBQSxJQUFBLE1BQUEsU0FBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsZ0JBQUEsQ0FBQSxJQUFBLE1BQUEsVUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsUUFBQSxDQUFBLENBQUEsT0FBQSxDQUFBLENBQUEsRUFBQSxJQUFBLFdBQUEsQ0FBQSxJQUFBLENBQUEsQ0FBQSxLQUFBLEdBQUEsQ0FBQSxFQUFBLENBQUEsQ0FBQSxDQUFBLGdCQUFBLENBQUEsV0FBQSxNQUFBLFVBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBLFNBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxHQUFBLFNBQUEsQ0FBQSxFQUFBLENBQUEsb0JBQUEsS0FBQSxXQUFBLE1BQUEsQ0FBQSxFQUFBLENBQUEsYUFBQSwyQkFBQSxlQUFBLENBQUEsV0FBQSxDQUFBLEVBQUEsQ0FBQSxJQUFBLE1BQUEsQ0FBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBLGdCQUFBLENBQUEsR0FBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSwwQkFBQSxFQUFBLDBCQUFBLElBQUEsMEJBQUEscUJBQUEsaUJBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBLFFBQUEsQ0FBQSxHQUFBLENBQUEsbUJBQUEsQ0FBQSxFQUFBLENBQUEsUUFBQSxDQUFBLEtBQUEsQ0FBQSxZQUFBLEtBQUEsc0NBQUEsQ0FBQSxLQUFBLENBQUEsb0JBQUEsQ0FBQSxRQUFBLENBQUEsV0FBQSxLQUFBLEVBQUEsQ0FBQSxFQUFBLElBQUEsZUFBQSxDQUFBLENBQUEsTUFBQSxHQUFBLENBQUEsRUFBQSxDQUFBLENBQUEsR0FBQSxHQUFBLENBQUEsVUFBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLFFBQUEsTUFBQSxDQUFBLFFBQUEsQ0FBQSxHQUFBLG1CQUFBLENBQUEsQ0FBQSxFQUFBLENBQUEsT0FBQSxDQUFBLFFBQUEsQ0FBQSxLQUFBLENBQUEsbUJBQUEsQ0FBQSxxQkFBQSxDQUFBLENBQUEsTUFBQSxFQUFBLENBQUEsQ0FBQSxJQUFBLEdBQUEsQ0FBQSxDQUFBLEtBQUEsR0FBQSxDQUFBLENBQUEsR0FBQSxzQkFBQSxDQUFBLENBQUEsTUFBQSxRQUFBLENBQUEsS0FBQSxDQUFBLFFBQUEsQ0FBQSxHQUFBLENBQUEsRUFBQSxDQUFBLENBQUEsR0FBQSxFQUFBLENBQUEsQ0FBQSxpQkFBQSxDQUFBLENBQUEsQ0FBQSxHQUFBLHVCQUFBLENBQUEsQ0FBQSxNQUFBLElBQUEsQ0FBQSxDQUFBLE1BQUEsV0FBQSxDQUFBLENBQUEsR0FBQSxHQUFBLENBQUEsR0FBQSxDQUFBLE1BQUEsQ0FBQSxHQUFBLFFBQUEsQ0FBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsb0JBQUEsQ0FBQSxDQUFBLElBQUEsUUFBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLElBQUEsR0FBQSxDQUFBLEdBQUEsQ0FBQSxFQUFBLENBQUEsQ0FBQSxHQUFBLEtBQUEsQ0FBQSxxQkFBQSxLQUFBLEVBQUEsQ0FBQSxDQUFBLEdBQUEsRUFBQSxJQUFBLEVBQUEsQ0FBQSxDQUFBLElBQUEsa0JBQUEsQ0FBQSxDQUFBLElBQUEsS0FBQSxDQUFBLEdBQUEsQ0FBQSxFQUFBLENBQUEsQ0FBQSxNQUFBLFlBQUEsQ0FBQSxDQUFBLEdBQUEsR0FBQSxDQUFBLENBQUEsR0FBQSxtQkFBQSxvQkFBQSxDQUFBLEVBQUEsQ0FBQSxRQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsTUFBQSxFQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsUUFBQSxDQUFBLENBQUEsT0FBQSxDQUFBLEtBQUEsQ0FBQSxTQUFBLENBQUEsQ0FBQSxRQUFBLHFCQUFBLENBQUEsSUFBQSxDQUFBLENBQUEsUUFBQSxlQUFBLENBQUEsQ0FBQSxNQUFBLGFBQUEsQ0FBQSxDQUFBLEdBQUEsR0FBQSxDQUFBLEVBQUEsbUJBQUEsQ0FBQSxDQUFBLEVBQUEsQ0FBQSxlQUFBLENBQUEsQ0FBQSxNQUFBLGtCQUFBLENBQUEsS0FBQSxDQUFBLENBQUEsTUFBQSxZQUFBLENBQUEsQ0FBQSxHQUFBLE9BQUEsU0FBQSx1Q0FBQSxDQUFBLGlCQUFBLENBQUEsTUFBQSxDQUFBLEdBQUEsUUFBQSxDQUFBLENBQUEsRUFBQSxDQUFBLENBQUEsUUFBQSxFQUFBLENBQUEsQ0FBQSxHQUFBLG1CQUFBLENBQUEsQ0FBQSxJQUFBLFNBQUEsQ0FBQSxDQUFBLE1BQUEsWUFBQSxDQUFBLENBQUEsR0FBQSxHQUFBLENBQUEsQ0FBQSxHQUFBLEVBQUEsQ0FBQSxDQUFBLFFBQUEsU0FBQSxDQUFBLE1BQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxHQUFBLFNBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxJQUFBLElBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxVQUFBLElBQUEsQ0FBQSxDQUFBLEtBQUEsRUFBQSxDQUFBLENBQUEsSUFBQSxHQUFBLENBQUEsQ0FBQSxPQUFBLGVBQUEsQ0FBQSxDQUFBLE1BQUEsS0FBQSxDQUFBLENBQUEsTUFBQSxXQUFBLENBQUEsQ0FBQSxHQUFBLEdBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxRQUFBLFNBQUEsQ0FBQSxJQUFBLENBQUEsSUFBQSxDQUFBLENBQUEsTUFBQSxZQUFBLENBQUEsQ0FBQSxHQUFBLE9BQUEsU0FBQSxzQ0FBQSxDQUFBLENBQUEsUUFBQSxTQUFBLENBQUEsY0FBQSxhQUFBLENBQUEsUUFBQSxDQUFBLEtBQUEsTUFBQSxFQUFBLENBQUEsWUFBQSxDQUFBLEtBQUEsQ0FBQSxDQUFBLFFBQUEsR0FBQSxDQUFBLFdBQUEsQ0FBQSxLQUFBLENBQUEsQ0FBQSxVQUFBLEdBQUEsQ0FBQSxLQUFBLENBQUEsQ0FBQSxRQUFBLEdBQUEsQ0FBQSxXQUFBLFVBQUEsQ0FBQSxJQUFBLENBQUEsQ0FBQSxjQUFBLGNBQUEsQ0FBQSxRQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsVUFBQSxRQUFBLENBQUEsQ0FBQSxJQUFBLG9CQUFBLENBQUEsQ0FBQSxHQUFBLEVBQUEsQ0FBQSxDQUFBLFVBQUEsR0FBQSxDQUFBLGFBQUEsUUFBQSxDQUFBLFNBQUEsVUFBQSxNQUFBLE1BQUEsYUFBQSxDQUFBLENBQUEsT0FBQSxDQUFBLFlBQUEsY0FBQSxLQUFBLGlCQUFBLE9BQUEsQ0FBQSxRQUFBLENBQUEsV0FBQSxDQUFBLFFBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxDQUFBLE9BQUEsQ0FBQSxTQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsQ0FBQSw0QkFBQSxDQUFBLENBQUEsSUFBQSxTQUFBLENBQUEsT0FBQSxLQUFBLENBQUEsQ0FBQSxDQUFBLE1BQUEsU0FBQSxDQUFBLE9BQUEsQ0FBQSxZQUFBLEtBQUEsYUFBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLE1BQUEsT0FBQSxDQUFBLENBQUEsSUFBQSxDQUFBLENBQUEsRUFBQSxDQUFBLFVBQUEsSUFBQSxDQUFBLEtBQUEsR0FBQSxDQUFBLENBQUEsQ0FBQSxHQUFBLElBQUEsQ0FBQSxJQUFBLE9BQUEsSUFBQSxTQUFBLElBQUEsQ0FBQSxLQUFBLEdBQUEsQ0FBQSxFQUFBLElBQUEsQ0FBQSxJQUFBLE9BQUEsSUFBQSxZQUFBLENBQUEsQ0FBQSxJQUFBLEdBQUEsQ0FBQSxnQkFBQSxTQUFBLENBQUEsT0FBQSxDQUFBLENBQUEsa0NBQUEsaUJBQUEsQ0FBQSxTQUFBLEdBQUEsMEJBQUEsRUFBQSxDQUFBLENBQUEsQ0FBQSxtQkFBQSxLQUFBLEVBQUEsMEJBQUEsRUFBQSxZQUFBLFNBQUEsQ0FBQSxDQUFBLDBCQUFBLG1CQUFBLEtBQUEsRUFBQSxpQkFBQSxFQUFBLFlBQUEsU0FBQSxpQkFBQSxDQUFBLFdBQUEsR0FBQSxNQUFBLENBQUEsMEJBQUEsRUFBQSxDQUFBLHdCQUFBLENBQUEsQ0FBQSxtQkFBQSxhQUFBLENBQUEsUUFBQSxDQUFBLHdCQUFBLENBQUEsSUFBQSxDQUFBLENBQUEsV0FBQSxXQUFBLENBQUEsS0FBQSxDQUFBLEtBQUEsaUJBQUEsNkJBQUEsQ0FBQSxDQUFBLFdBQUEsSUFBQSxDQUFBLENBQUEsSUFBQSxPQUFBLENBQUEsQ0FBQSxJQUFBLGFBQUEsQ0FBQSxXQUFBLE1BQUEsQ0FBQSxjQUFBLEdBQUEsTUFBQSxDQUFBLGNBQUEsQ0FBQSxDQUFBLEVBQUEsMEJBQUEsS0FBQSxDQUFBLENBQUEsU0FBQSxHQUFBLDBCQUFBLEVBQUEsTUFBQSxDQUFBLENBQUEsRUFBQSxDQUFBLHlCQUFBLENBQUEsQ0FBQSxTQUFBLEdBQUEsTUFBQSxDQUFBLE1BQUEsQ0FBQSxDQUFBLEdBQUEsQ0FBQSxLQUFBLENBQUEsQ0FBQSxLQUFBLGFBQUEsQ0FBQSxhQUFBLE9BQUEsRUFBQSxDQUFBLE9BQUEscUJBQUEsQ0FBQSxhQUFBLENBQUEsU0FBQSxHQUFBLE1BQUEsQ0FBQSxhQUFBLENBQUEsU0FBQSxFQUFBLENBQUEsaUNBQUEsQ0FBQSxDQUFBLGFBQUEsR0FBQSxhQUFBLEVBQUEsQ0FBQSxDQUFBLEtBQUEsYUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxlQUFBLENBQUEsS0FBQSxDQUFBLEdBQUEsT0FBQSxPQUFBLENBQUEsT0FBQSxhQUFBLENBQUEsSUFBQSxDQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsR0FBQSxDQUFBLFVBQUEsQ0FBQSxDQUFBLG1CQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsSUFBQSxHQUFBLElBQUEsV0FBQSxDQUFBLFdBQUEsQ0FBQSxDQUFBLElBQUEsR0FBQSxDQUFBLENBQUEsS0FBQSxHQUFBLENBQUEsQ0FBQSxJQUFBLFdBQUEscUJBQUEsQ0FBQSxDQUFBLEdBQUEsTUFBQSxDQUFBLENBQUEsRUFBQSxDQUFBLGdCQUFBLE1BQUEsQ0FBQSxDQUFBLEVBQUEsQ0FBQSxpQ0FBQSxNQUFBLENBQUEsQ0FBQSw2REFBQSxDQUFBLENBQUEsSUFBQSxhQUFBLENBQUEsUUFBQSxDQUFBLEdBQUEsTUFBQSxDQUFBLENBQUEsR0FBQSxDQUFBLGdCQUFBLENBQUEsSUFBQSxDQUFBLEVBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxDQUFBLFVBQUEsQ0FBQSxDQUFBLE9BQUEsYUFBQSxLQUFBLFdBQUEsQ0FBQSxDQUFBLE1BQUEsU0FBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLEdBQUEsUUFBQSxDQUFBLElBQUEsQ0FBQSxTQUFBLElBQUEsQ0FBQSxLQUFBLEdBQUEsQ0FBQSxFQUFBLElBQUEsQ0FBQSxJQUFBLE9BQUEsSUFBQSxXQUFBLElBQUEsQ0FBQSxJQUFBLE9BQUEsSUFBQSxRQUFBLENBQUEsQ0FBQSxNQUFBLEdBQUEsTUFBQSxFQUFBLE9BQUEsQ0FBQSxTQUFBLEtBQUEsV0FBQSxFQUFBLE9BQUEsRUFBQSxLQUFBLFdBQUEsTUFBQSxDQUFBLGFBQUEsSUFBQSxXQUFBLElBQUEsV0FBQSxJQUFBLFFBQUEsS0FBQSxHQUFBLENBQUEsT0FBQSxJQUFBLFlBQUEsUUFBQSxjQUFBLE1BQUEsZ0JBQUEsR0FBQSxHQUFBLENBQUEsT0FBQSxVQUFBLENBQUEsT0FBQSxDQUFBLGFBQUEsSUFBQSxDQUFBLFdBQUEsQ0FBQSxrQkFBQSxDQUFBLENBQUEsTUFBQSxPQUFBLENBQUEsQ0FBQSxJQUFBLE9BQUEsQ0FBQSxNQUFBLEtBQUEsRUFBQSxDQUFBLENBQUEsS0FBQSxjQUFBLENBQUEsSUFBQSxDQUFBLE1BQUEsSUFBQSxXQUFBLEtBQUEsU0FBQSxJQUFBLFdBQUEsQ0FBQSxRQUFBLFVBQUEsSUFBQSxVQUFBLGtCQUFBLENBQUEsQ0FBQSxJQUFBLFFBQUEsQ0FBQSxDQUFBLEdBQUEsY0FBQSxJQUFBLEtBQUEsaUJBQUEsV0FBQSxrQkFBQSxDQUFBLGFBQUEsSUFBQSxRQUFBLENBQUEsTUFBQSxDQUFBLGtCQUFBLE9BQUEsQ0FBQSxFQUFBLENBQUEsV0FBQSxDQUFBLENBQUEsSUFBQSxZQUFBLENBQUEsQ0FBQSxHQUFBLEdBQUEsQ0FBQSxFQUFBLENBQUEsQ0FBQSxJQUFBLEdBQUEsQ0FBQSxFQUFBLENBQUEsS0FBQSxDQUFBLENBQUEsTUFBQSxXQUFBLENBQUEsQ0FBQSxHQUFBLEdBQUEsQ0FBQSxLQUFBLENBQUEsYUFBQSxDQUFBLFFBQUEsVUFBQSxDQUFBLE1BQUEsTUFBQSxDQUFBLFNBQUEsQ0FBQSxRQUFBLENBQUEsUUFBQSxVQUFBLENBQUEsQ0FBQSxHQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsVUFBQSxpQkFBQSxDQUFBLENBQUEsTUFBQSxTQUFBLE1BQUEsYUFBQSxDQUFBLENBQUEsTUFBQSxTQUFBLElBQUEsUUFBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxDQUFBLGVBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsQ0FBQSxxQkFBQSxDQUFBLElBQUEsQ0FBQSxhQUFBLElBQUEsR0FBQSxDQUFBLENBQUEsUUFBQSxTQUFBLE1BQUEsQ0FBQSxDQUFBLENBQUEsUUFBQSxnQkFBQSxJQUFBLEdBQUEsQ0FBQSxDQUFBLFVBQUEsU0FBQSxNQUFBLENBQUEsQ0FBQSxDQUFBLFVBQUEsY0FBQSxDQUFBLGFBQUEsSUFBQSxHQUFBLENBQUEsQ0FBQSxRQUFBLFNBQUEsTUFBQSxDQUFBLENBQUEsQ0FBQSxRQUFBLHFCQUFBLENBQUEsWUFBQSxLQUFBLHFEQUFBLElBQUEsR0FBQSxDQUFBLENBQUEsVUFBQSxTQUFBLE1BQUEsQ0FBQSxDQUFBLENBQUEsVUFBQSxZQUFBLE1BQUEsV0FBQSxPQUFBLENBQUEsRUFBQSxDQUFBLGFBQUEsQ0FBQSxRQUFBLFVBQUEsQ0FBQSxNQUFBLE1BQUEsQ0FBQSxTQUFBLENBQUEsUUFBQSxDQUFBLFFBQUEsVUFBQSxDQUFBLENBQUEsT0FBQSxDQUFBLENBQUEsTUFBQSxTQUFBLElBQUEsSUFBQSxDQUFBLENBQUEsSUFBQSxDQUFBLENBQUEsd0JBQUEsSUFBQSxHQUFBLENBQUEsQ0FBQSxVQUFBLFFBQUEsQ0FBQSxHQUFBLENBQUEsYUFBQSxDQUFBLGlCQUFBLENBQUEsbUJBQUEsQ0FBQSxLQUFBLENBQUEsQ0FBQSxNQUFBLElBQUEsQ0FBQSxJQUFBLENBQUEsSUFBQSxDQUFBLENBQUEsVUFBQSxLQUFBLENBQUEsY0FBQSxDQUFBLEdBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxVQUFBLGNBQUEsQ0FBQSxDQUFBLElBQUEsR0FBQSxDQUFBLEVBQUEsQ0FBQSxDQUFBLEdBQUEsR0FBQSxDQUFBLEVBQUEsQ0FBQSxTQUFBLE1BQUEsZ0JBQUEsSUFBQSxHQUFBLENBQUEsQ0FBQSxVQUFBLEVBQUEsQ0FBQSxTQUFBLFFBQUEsQ0FBQSxDQUFBLE1BQUEsUUFBQSxXQUFBLFNBQUEsQ0FBQSxFQUFBLENBQUEsb0JBQUEsQ0FBQSxDQUFBLElBQUEsUUFBQSxDQUFBLENBQUEsR0FBQSxxQkFBQSxDQUFBLENBQUEsSUFBQSxtQkFBQSxDQUFBLENBQUEsSUFBQSxRQUFBLElBQUEsR0FBQSxDQUFBLENBQUEsR0FBQSxnQkFBQSxDQUFBLENBQUEsSUFBQSxTQUFBLElBQUEsUUFBQSxHQUFBLEdBQUEsQ0FBQSxDQUFBLEdBQUEsT0FBQSxNQUFBLGtCQUFBLElBQUEseUJBQUEsQ0FBQSxDQUFBLElBQUEsSUFBQSxDQUFBLFVBQUEsSUFBQSxHQUFBLENBQUEsR0FBQSxDQUFBLEtBQUEsTUFBQSxXQUFBLE9BQUEsQ0FBQSxhQUFBLENBQUEsUUFBQSxVQUFBLENBQUEsTUFBQSxNQUFBLENBQUEsU0FBQSxDQUFBLFFBQUEsQ0FBQSxRQUFBLFVBQUEsQ0FBQSxDQUFBLE9BQUEsQ0FBQSxDQUFBLFVBQUEsS0FBQSxDQUFBLGNBQUEsUUFBQSxDQUFBLENBQUEsQ0FBQSxVQUFBLEVBQUEsQ0FBQSxDQUFBLFFBQUEsR0FBQSxhQUFBLENBQUEsQ0FBQSxHQUFBLENBQUEseUJBQUEsT0FBQSxDQUFBLGFBQUEsQ0FBQSxRQUFBLFVBQUEsQ0FBQSxNQUFBLE1BQUEsQ0FBQSxTQUFBLENBQUEsUUFBQSxDQUFBLFFBQUEsVUFBQSxDQUFBLENBQUEsT0FBQSxDQUFBLENBQUEsTUFBQSxLQUFBLENBQUEsUUFBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLFVBQUEsa0JBQUEsQ0FBQSxDQUFBLElBQUEsUUFBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLEdBQUEsRUFBQSxhQUFBLENBQUEsQ0FBQSxZQUFBLENBQUEsZ0JBQUEsS0FBQSw4QkFBQSxhQUFBLFdBQUEsY0FBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsZ0JBQUEsUUFBQSxLQUFBLFFBQUEsRUFBQSxNQUFBLENBQUEsQ0FBQSxHQUFBLFVBQUEsRUFBQSxDQUFBLEVBQUEsT0FBQSxFQUFBLENBQUEsb0JBQUEsTUFBQSxVQUFBLEdBQUEsR0FBQSxDQUFBLEdBQUEsQ0FBQSxPQUFBLENBQUE7QUFBQSxTQUFBLG1CQUFBLEdBQUEsRUFBQSxPQUFBLEVBQUEsTUFBQSxFQUFBLEtBQUEsRUFBQSxNQUFBLEVBQUEsR0FBQSxFQUFBLEdBQUEsY0FBQSxJQUFBLEdBQUEsR0FBQSxDQUFBLEdBQUEsRUFBQSxHQUFBLE9BQUEsS0FBQSxHQUFBLElBQUEsQ0FBQSxLQUFBLFdBQUEsS0FBQSxJQUFBLE1BQUEsQ0FBQSxLQUFBLGlCQUFBLElBQUEsQ0FBQSxJQUFBLElBQUEsT0FBQSxDQUFBLEtBQUEsWUFBQSxPQUFBLENBQUEsT0FBQSxDQUFBLEtBQUEsRUFBQSxJQUFBLENBQUEsS0FBQSxFQUFBLE1BQUE7QUFBQSxTQUFBLGtCQUFBLEVBQUEsNkJBQUEsSUFBQSxTQUFBLElBQUEsR0FBQSxTQUFBLGFBQUEsT0FBQSxXQUFBLE9BQUEsRUFBQSxNQUFBLFFBQUEsR0FBQSxHQUFBLEVBQUEsQ0FBQSxLQUFBLENBQUEsSUFBQSxFQUFBLElBQUEsWUFBQSxNQUFBLEtBQUEsSUFBQSxrQkFBQSxDQUFBLEdBQUEsRUFBQSxPQUFBLEVBQUEsTUFBQSxFQUFBLEtBQUEsRUFBQSxNQUFBLFVBQUEsS0FBQSxjQUFBLE9BQUEsR0FBQSxJQUFBLGtCQUFBLENBQUEsR0FBQSxFQUFBLE9BQUEsRUFBQSxNQUFBLEVBQUEsS0FBQSxFQUFBLE1BQUEsV0FBQSxHQUFBLEtBQUEsS0FBQSxDQUFBLFNBQUE7QUFBQSxTQUFBLGVBQUEsR0FBQSxFQUFBLENBQUEsV0FBQSxlQUFBLENBQUEsR0FBQSxLQUFBLHFCQUFBLENBQUEsR0FBQSxFQUFBLENBQUEsS0FBQSwyQkFBQSxDQUFBLEdBQUEsRUFBQSxDQUFBLEtBQUEsZ0JBQUE7QUFBQSxTQUFBLGlCQUFBLGNBQUEsU0FBQTtBQUFBLFNBQUEsNEJBQUEsQ0FBQSxFQUFBLE1BQUEsU0FBQSxDQUFBLHFCQUFBLENBQUEsc0JBQUEsaUJBQUEsQ0FBQSxDQUFBLEVBQUEsTUFBQSxPQUFBLENBQUEsR0FBQSxNQUFBLENBQUEsU0FBQSxDQUFBLFFBQUEsQ0FBQSxJQUFBLENBQUEsQ0FBQSxFQUFBLEtBQUEsYUFBQSxDQUFBLGlCQUFBLENBQUEsQ0FBQSxXQUFBLEVBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxXQUFBLENBQUEsSUFBQSxNQUFBLENBQUEsY0FBQSxDQUFBLG1CQUFBLEtBQUEsQ0FBQSxJQUFBLENBQUEsQ0FBQSxPQUFBLENBQUEsK0RBQUEsSUFBQSxDQUFBLENBQUEsVUFBQSxpQkFBQSxDQUFBLENBQUEsRUFBQSxNQUFBO0FBQUEsU0FBQSxrQkFBQSxHQUFBLEVBQUEsR0FBQSxRQUFBLEdBQUEsWUFBQSxHQUFBLEdBQUEsR0FBQSxDQUFBLE1BQUEsRUFBQSxHQUFBLEdBQUEsR0FBQSxDQUFBLE1BQUEsV0FBQSxDQUFBLE1BQUEsSUFBQSxPQUFBLEtBQUEsQ0FBQSxHQUFBLEdBQUEsQ0FBQSxHQUFBLEdBQUEsRUFBQSxDQUFBLElBQUEsSUFBQSxDQUFBLENBQUEsSUFBQSxHQUFBLENBQUEsQ0FBQSxVQUFBLElBQUE7QUFBQSxTQUFBLHNCQUFBLENBQUEsRUFBQSxDQUFBLFFBQUEsQ0FBQSxXQUFBLENBQUEsZ0NBQUEsTUFBQSxJQUFBLENBQUEsQ0FBQSxNQUFBLENBQUEsUUFBQSxLQUFBLENBQUEsNEJBQUEsQ0FBQSxRQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBLE9BQUEsQ0FBQSxPQUFBLENBQUEsaUJBQUEsQ0FBQSxJQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsSUFBQSxDQUFBLENBQUEsR0FBQSxJQUFBLFFBQUEsQ0FBQSxRQUFBLE1BQUEsQ0FBQSxDQUFBLE1BQUEsQ0FBQSxVQUFBLENBQUEsdUJBQUEsQ0FBQSxJQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsSUFBQSxDQUFBLENBQUEsR0FBQSxJQUFBLE1BQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxDQUFBLENBQUEsS0FBQSxHQUFBLENBQUEsQ0FBQSxNQUFBLEtBQUEsQ0FBQSxHQUFBLENBQUEs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R0FBQSxDQUFBLE1BQUEsV0FBQSxDQUFBLE1BQUEsSUFBQSxPQUFBLEtBQUEsQ0FBQSxHQUFBLEdBQUEsQ0FBQSxHQUFBLEdBQUEsRUFBQSxDQUFBLElBQUEsSUFBQSxDQUFBLENBQUEsSUFBQSxHQUFBLENBQUEsQ0FBQSxVQUFBLElBQUE7QUFBQSxTQUFBLHNCQUFBLENBQUEsRUFBQSxDQUFBLFFBQUEsQ0FBQSxXQUFBLENBQUEsZ0NBQUEsTUFBQSxJQUFBLENBQUEsQ0FBQSxNQUFBLENBQUEsUUFBQSxLQUFBLENBQUEsNEJBQUEsQ0FBQSxRQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBLE9BQUEsQ0FBQSxPQUFBLENBQUEsaUJBQUEsQ0FBQSxJQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsSUFBQSxDQUFBLENBQUEsR0FBQSxJQUFBLFFBQUEsQ0FBQSxRQUFBLE1BQUEsQ0FBQSxDQUFBLE1BQUEsQ0FBQSxVQUFBLENBQUEsdUJBQUEsQ0FBQSxJQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsSUFBQSxDQUFBLENBQUEsR0FBQSxJQUFBLE1BQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxDQUFBLENBQUEsS0FBQSxHQUFBLENBQUEsQ0FBQSxNQUFBLEtBQUEsQ0FBQSxHQUFBLENBQUEsaUJBQUEsQ0FBQSxJQUFBLENBQUEsT0FBQSxDQUFBLEdBQUEsQ0FBQSx5QkFBQSxDQUFBLFlBQUEsQ0FBQSxlQUFBLENBQUEsR0FBQSxDQUFBLGNBQUEsTUFBQSxDQUFBLENBQUEsTUFBQSxDQUFBLDJCQUFBLENBQUEsUUFBQSxDQUFBLGFBQUEsQ0FBQTtBQUFBLFNBQUEsZ0JBQUEsR0FBQSxRQUFBLEtBQUEsQ0FBQSxPQUFBLENBQUEsR0FBQSxVQUFBLEdBQUE7QUFBQSxTQUFBLFFBQUEsQ0FBQSxzQ0FBQSxPQUFBLHdCQUFBLE1BQUEsdUJBQUEsTUFBQSxDQUFBLFFBQUEsYUFBQSxDQUFBLGtCQUFBLENBQUEsZ0JBQUEsQ0FBQSxXQUFBLENBQUEseUJBQUEsTUFBQSxJQUFBLENBQUEsQ0FBQSxXQUFBLEtBQUEsTUFBQSxJQUFBLENBQUEsS0FBQSxNQUFBLENBQUEsU0FBQSxxQkFBQSxDQUFBLEtBQUEsT0FBQSxDQUFBLENBQUE7QUFBQSxTQUFBLGtCQUFBLE1BQUEsRUFBQSxLQUFBLGFBQUEsQ0FBQSxNQUFBLENBQUEsR0FBQSxLQUFBLENBQUEsTUFBQSxFQUFBLENBQUEsVUFBQSxVQUFBLEdBQUEsS0FBQSxDQUFBLENBQUEsR0FBQSxVQUFBLENBQUEsVUFBQSxHQUFBLFVBQUEsQ0FBQSxVQUFBLFdBQUEsVUFBQSxDQUFBLFlBQUEsd0JBQUEsVUFBQSxFQUFBLFVBQUEsQ0FBQSxRQUFBLFNBQUEsTUFBQSxDQUFBLGNBQUEsQ0FBQSxNQUFBLEVBQUEsY0FBQSxDQUFBLFVBQUEsQ0FBQSxHQUFBLEdBQUEsVUFBQTtBQUFBLFNBQUEsYUFBQSxXQUFBLEVBQUEsVUFBQSxFQUFBLFdBQUEsUUFBQSxVQUFBLEVBQUEsaUJBQUEsQ0FBQSxXQUFBLENBQUEsU0FBQSxFQUFBLFVBQUEsT0FBQSxXQUFBLEVBQUEsaUJBQUEsQ0FBQSxXQUFBLEVBQUEsV0FBQSxHQUFBLE1BQUEsQ0FBQSxjQUFBLENBQUEsV0FBQSxpQkFBQSxRQUFBLG1CQUFBLFdBQUE7QUFBQSxTQUFBLGVBQUEsR0FBQSxRQUFBLEdBQUEsR0FBQSxZQUFBLENBQUEsR0FBQSxvQkFBQSxPQUFBLENBQUEsR0FBQSxpQkFBQSxHQUFBLEdBQUEsTUFBQSxDQUFBLEdBQUE7QUFBQSxTQUFBLGFBQUEsS0FBQSxFQUFBLElBQUEsUUFBQSxPQUFBLENBQUEsS0FBQSxrQkFBQSxLQUFBLGtCQUFBLEtBQUEsTUFBQSxJQUFBLEdBQUEsS0FBQSxDQUFBLE1BQUEsQ0FBQSxXQUFBLE9BQUEsSUFBQSxLQUFBLFNBQUEsUUFBQSxHQUFBLEdBQUEsSUFBQSxDQUFBLElBQUEsQ0FBQSxLQUFBLEVBQUEsSUFBQSxvQkFBQSxPQUFBLENBQUEsR0FBQSx1QkFBQSxHQUFBLFlBQUEsU0FBQSw0REFBQSxJQUFBLGdCQUFBLE1BQUEsR0FBQSxNQUFBLEVBQUEsS0FBQTtBQUFBLFNBQUEsZ0JBQUEsUUFBQSxFQUFBLFdBQUEsVUFBQSxRQUFBLFlBQUEsV0FBQSxlQUFBLFNBQUE7QUFBQSxTQUFBLFVBQUEsUUFBQSxFQUFBLFVBQUEsZUFBQSxVQUFBLG1CQUFBLFVBQUEsdUJBQUEsU0FBQSwwREFBQSxRQUFBLENBQUEsU0FBQSxHQUFBLE1BQUEsQ0FBQSxNQUFBLENBQUEsVUFBQSxJQUFBLFVBQUEsQ0FBQSxTQUFBLElBQUEsV0FBQSxJQUFBLEtBQUEsRUFBQSxRQUFBLEVBQUEsUUFBQSxRQUFBLFlBQUEsYUFBQSxNQUFBLENBQUEsY0FBQSxDQUFBLFFBQUEsaUJBQUEsUUFBQSxnQkFBQSxVQUFBLEVBQUEsZUFBQSxDQUFBLFFBQUEsRUFBQSxVQUFBO0FBQUEsU0FBQSxhQUFBLE9BQUEsUUFBQSx5QkFBQSxHQUFBLHlCQUFBLG9CQUFBLHFCQUFBLFFBQUEsS0FBQSxHQUFBLGVBQUEsQ0FBQSxPQUFBLEdBQUEsTUFBQSxNQUFBLHlCQUFBLFFBQUEsU0FBQSxHQUFBLGVBQUEsT0FBQSxXQUFBLEVBQUEsTUFBQSxHQUFBLE9BQUEsQ0FBQSxTQUFBLENBQUEsS0FBQSxFQUFBLFNBQUEsRUFBQSxTQUFBLFlBQUEsTUFBQSxHQUFBLEtBQUEsQ0FBQSxLQUFBLE9BQUEsU0FBQSxZQUFBLDBCQUFBLE9BQUEsTUFBQTtBQUFBLFNBQUEsMkJBQUEsSUFBQSxFQUFBLElBQUEsUUFBQSxJQUFBLEtBQUEsT0FBQSxDQUFBLElBQUEseUJBQUEsSUFBQSwyQkFBQSxJQUFBLGFBQUEsSUFBQSx5QkFBQSxTQUFBLHVFQUFBLHNCQUFBLENBQUEsSUFBQTtBQUFBLFNBQUEsdUJBQUEsSUFBQSxRQUFBLElBQUEseUJBQUEsY0FBQSx3RUFBQSxJQUFBO0FBQUEsU0FBQSxpQkFBQSxLQUFBLFFBQUEsTUFBQSxVQUFBLEdBQUEsc0JBQUEsR0FBQSxLQUFBLFNBQUEsRUFBQSxnQkFBQSxZQUFBLGlCQUFBLEtBQUEsUUFBQSxLQUFBLGNBQUEsaUJBQUEsQ0FBQSxLQUFBLFVBQUEsS0FBQSxhQUFBLEtBQUEsNkJBQUEsU0FBQSxxRUFBQSxNQUFBLHdCQUFBLE1BQUEsQ0FBQSxHQUFBLENBQUEsS0FBQSxVQUFBLE1BQUEsQ0FBQSxHQUFBLENBQUEsS0FBQSxHQUFBLE1BQUEsQ0FBQSxHQUFBLENBQUEsS0FBQSxFQUFBLE9BQUEsY0FBQSxRQUFBLFdBQUEsVUFBQSxDQUFBLEtBQUEsRUFBQSxTQUFBLEVBQUEsZUFBQSxPQUFBLFdBQUEsS0FBQSxPQUFBLENBQUEsU0FBQSxHQUFBLE1BQUEsQ0FBQSxNQUFBLENBQUEsS0FBQSxDQUFBLFNBQUEsSUFBQSxXQUFBLElBQUEsS0FBQSxFQUFBLE9BQUEsRUFBQSxVQUFBLFNBQUEsUUFBQSxRQUFBLFlBQUEsb0JBQUEsZUFBQSxDQUFBLE9BQUEsRUFBQSxLQUFBLGFBQUEsZ0JBQUEsQ0FBQSxLQUFBO0FBQUEsU0FBQSxXQUFBLE1BQUEsRUFBQSxJQUFBLEVBQUEsS0FBQSxRQUFBLHlCQUFBLE1BQUEsVUFBQSxHQUFBLE9BQUEsQ0FBQSxTQUFBLENBQUEsSUFBQSxhQUFBLFVBQUEsWUFBQSxXQUFBLE1BQUEsRUFBQSxJQUFBLEVBQUEsS0FBQSxRQUFBLENBQUEsV0FBQSxDQUFBLENBQUEsSUFBQSxDQUFBLEtBQUEsQ0FBQSxDQUFBLEVBQUEsSUFBQSxPQUFBLFdBQUEsR0FBQSxRQUFBLENBQUEsSUFBQSxDQUFBLEtBQUEsQ0FBQSxNQUFBLEVBQUEsQ0FBQSxPQUFBLFFBQUEsT0FBQSxXQUFBLFFBQUEsS0FBQSxFQUFBLGVBQUEsQ0FBQSxRQUFBLEVBQUEsS0FBQSxDQUFBLFNBQUEsVUFBQSxRQUFBLGNBQUEsVUFBQSxDQUFBLEtBQUEsT0FBQSxTQUFBO0FBQUEsU0FBQSwwQkFBQSxlQUFBLE9BQUEscUJBQUEsT0FBQSxDQUFBLFNBQUEsb0JBQUEsT0FBQSxDQUFBLFNBQUEsQ0FBQSxJQUFBLDJCQUFBLEtBQUEsb0NBQUEsT0FBQSxDQUFBLFNBQUEsQ0FBQSxPQUFBLENBQUEsSUFBQSxDQUFBLE9BQUEsQ0FBQSxTQUFBLENBQUEsT0FBQSw4Q0FBQSxDQUFBO0FB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QUssRUFBRSxLQUFLO0VBQ2pFLENBQUM7RUFDRCxhQUFhLEVBQUU7SUFDYixVQUFVLEVBQUUsOEJBQThCO0lBQzFDLFNBQVMsRUFBRTtFQUNiLENBQUM7RUFDRCxVQUFVLEVBQUU7SUFDVixPQUFPLEVBQUUsbUJBQW1CO0lBQzVCLEtBQUssRUFBRSxRQUFRO0lBQ2YsR0FBRyxFQUFFO0VBQ1A7QUFFRixDQUFDO0FBRUQsSUFBTSxTQUFTLEdBQUEsT0FBQSxDQUFBLFNBQUEsR0FBRztFQUFFLElBQUksRUFBSixJQUFJO0VBQUUsSUFBSSxFQUFKO0FBQUssQ0FBQzs7Ozs7Ozs7O0FDckNoQyxJQUFNLE9BQU8sR0FBQSxPQUFBLENBQUEsT0FBQSxHQUFHO0VBQ2QsVUFBVSxFQUFFLE1BQU07RUFDbEIsbUJBQW1CLEVBQUUsU0FBUztFQUM5QixZQUFZLEVBQUUsTUFBTTtFQUNwQixzQkFBc0IsRUFBRSxNQUFNO0VBQzlCLFFBQVEsRUFBRSxNQUFNO0VBQ2hCLGtCQUFrQixFQUFFLE1BQU07RUFDMUIsZ0JBQWdCLEVBQUU7QUFDcEIsQ0FBQztBQUVELElBQU0sYUFBYSxHQUFBLE9BQUEsQ0FBQSxhQUFBLEdBQUcsU0FBaEIsYUFBYSxDQUFJLEdBQUcsRUFBSztFQUM3QixHQUFHLENBQUMsS0FBSyxDQUFDLGVBQWUsR0FBRyxPQUFPLENBQUMsVUFBVTtBQUNoRCxDQUFDO0FBRUQsSUFBTSxlQUFlLEdBQUEsT0FBQSxDQUFBLGVBQUEsR0FBRyxTQUFsQixlQUFlLENBQUksR0FBRyxFQUFLO0VBQy9CLEdBQUcsQ0FBQyxLQUFLLENBQUMsZUFBZSxHQUFHLE9BQU8sQ0FBQyxrQkFBa0I7QUFDeEQsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIid1c2Ugc3RyaWN0Jztcbi8vIEZvciBtb3JlIGluZm9ybWF0aW9uIGFib3V0IGJyb3dzZXIgZmllbGQsIGNoZWNrIG91dCB0aGUgYnJvd3NlciBmaWVsZCBhdCBodHRwczovL2dpdGh1Yi5jb20vc3Vic3RhY2svYnJvd3NlcmlmeS1oYW5kYm9vayNicm93c2VyLWZpZWxkLlxuXG52YXIgc3R5bGVFbGVtZW50c0luc2VydGVkQXRUb3AgPSBbXTtcblxudmFyIGluc2VydFN0eWxlRWxlbWVudCA9IGZ1bmN0aW9uKHN0eWxlRWxlbWVudCwgb3B0aW9ucykge1xuICAgIHZhciBoZWFkID0gZG9jdW1lbnQuaGVhZCB8fCBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdO1xuICAgIHZhciBsYXN0U3R5bGVFbGVtZW50SW5zZXJ0ZWRBdFRvcCA9IHN0eWxlRWxlbWVudHNJbnNlcnRlZEF0VG9wW3N0eWxlRWxlbWVudHNJbnNlcnRlZEF0VG9wLmxlbmd0aCAtIDFdO1xuXG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgb3B0aW9ucy5pbnNlcnRBdCA9IG9wdGlvbnMuaW5zZXJ0QXQgfHwgJ2JvdHRvbSc7XG5cbiAgICBpZiAob3B0aW9ucy5pbnNlcnRBdCA9PT0gJ3RvcCcpIHtcbiAgICAgICAgaWYgKCFsYXN0U3R5bGVFbGVtZW50SW5zZXJ0ZWRBdFRvcCkge1xuICAgICAgICAgICAgaGVhZC5pbnNlcnRCZWZvcmUoc3R5bGVFbGVtZW50LCBoZWFkLmZpcnN0Q2hpbGQpO1xuICAgICAgICB9IGVsc2UgaWYgKGxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wLm5leHRTaWJsaW5nKSB7XG4gICAgICAgICAgICBoZWFkLmluc2VydEJlZm9yZShzdHlsZUVsZW1lbnQsIGxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wLm5leHRTaWJsaW5nKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGhlYWQuYXBwZW5kQ2hpbGQoc3R5bGVFbGVtZW50KTtcbiAgICAgICAgfVxuICAgICAgICBzdHlsZUVsZW1lbnRzSW5zZXJ0ZWRBdFRvcC5wdXNoKHN0eWxlRWxlbWVudCk7XG4gICAgfSBlbHNlIGlmIChvcHRpb25zLmluc2VydEF0ID09PSAnYm90dG9tJykge1xuICAgICAgICBoZWFkLmFwcGVuZENoaWxkKHN0eWxlRWxlbWVudCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHZhbHVlIGZvciBwYXJhbWV0ZXIgXFwnaW5zZXJ0QXRcXCcuIE11c3QgYmUgXFwndG9wXFwnIG9yIFxcJ2JvdHRvbVxcJy4nKTtcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICAvLyBDcmVhdGUgYSA8bGluaz4gdGFnIHdpdGggb3B0aW9uYWwgZGF0YSBhdHRyaWJ1dGVzXG4gICAgY3JlYXRlTGluazogZnVuY3Rpb24oaHJlZiwgYXR0cmlidXRlcykge1xuICAgICAgICB2YXIgaGVhZCA9IGRvY3VtZW50LmhlYWQgfHwgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXTtcbiAgICAgICAgdmFyIGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaW5rJyk7XG5cbiAgICAgICAgbGluay5ocmVmID0gaHJlZjtcbiAgICAgICAgbGluay5yZWwgPSAnc3R5bGVzaGVldCc7XG5cbiAgICAgICAgZm9yICh2YXIga2V5IGluIGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICAgIGlmICggISBhdHRyaWJ1dGVzLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IGF0dHJpYnV0ZXNba2V5XTtcbiAgICAgICAgICAgIGxpbmsuc2V0QXR0cmlidXRlKCdkYXRhLScgKyBrZXksIHZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGhlYWQuYXBwZW5kQ2hpbGQobGluayk7XG4gICAgfSxcbiAgICAvLyBDcmVhdGUgYSA8c3R5bGU+IHRhZyB3aXRoIG9wdGlvbmFsIGRhdGEgYXR0cmlidXRlc1xuICAgIGNyZWF0ZVN0eWxlOiBmdW5jdGlvbihjc3NUZXh0LCBhdHRyaWJ1dGVzLCBleHRyYU9wdGlvbnMpIHtcbiAgICAgICAgZXh0cmFPcHRpb25zID0gZXh0cmFPcHRpb25zIHx8IHt9O1xuXG4gICAgICAgIHZhciBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgICAgIHN0eWxlLnR5cGUgPSAndGV4dC9jc3MnO1xuXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBhdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgICBpZiAoICEgYXR0cmlidXRlcy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgdmFsdWUgPSBhdHRyaWJ1dGVzW2tleV07XG4gICAgICAgICAgICBzdHlsZS5zZXRBdHRyaWJ1dGUoJ2RhdGEtJyArIGtleSwgdmFsdWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHN0eWxlLnNoZWV0KSB7IC8vIGZvciBqc2RvbSBhbmQgSUU5K1xuICAgICAgICAgICAgc3R5bGUuaW5uZXJIVE1MID0gY3NzVGV4dDtcbiAgICAgICAgICAgIHN0eWxlLnNoZWV0LmNzc1RleHQgPSBjc3NUZXh0O1xuICAgICAgICAgICAgaW5zZXJ0U3R5bGVFbGVtZW50KHN0eWxlLCB7IGluc2VydEF0OiBleHRyYU9wdGlvbnMuaW5zZXJ0QXQgfSk7XG4gICAgICAgIH0gZWxzZSBpZiAoc3R5bGUuc3R5bGVTaGVldCkgeyAvLyBmb3IgSUU4IGFuZCBiZWxvd1xuICAgICAgICAgICAgaW5zZXJ0U3R5bGVFbGVtZW50KHN0eWxlLCB7IGluc2VydEF0OiBleHRyYU9wdGlvbnMuaW5zZXJ0QXQgfSk7XG4gICAgICAgICAgICBzdHlsZS5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3NUZXh0O1xuICAgICAgICB9IGVsc2UgeyAvLyBmb3IgQ2hyb21lLCBGaXJlZm94LCBhbmQgU2FmYXJpXG4gICAgICAgICAgICBzdHlsZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3NUZXh0KSk7XG4gICAgICAgICAgICBpbnNlcnRTdHlsZUVsZW1lbnQoc3R5bGUsIHsgaW5zZXJ0QXQ6IGV4dHJhT3B0aW9ucy5pbnNlcnRBdCB9KTtcbiAgICAgICAgfVxuICAgIH1cbn07XG4iLCJpbXBvcnQgeyBzZWxlY3RlZFN0eWxlLCB1bnNlbGVjdGVkU3R5bGUgfSBmcm9tICcuL3N0eWxlcy5qcyc7XG5pbXBvcnQgeyBjb25maWcsIGNhbGVuZGFyLCBsYXN0RGF0ZUNsaWNrZWQgfSBmcm9tICcuL2NhbGVuZGFyR2VuZXJhdG9yLmpzJztcbmltcG9ydCB7IGRpc3BsYXlUaW1lQ2hvb3Nlck1vZGFsLCBnZXRTZWxlY3RlZFRpbWVzIH0gZnJvbSAnLi9kaXNwbGF5VGltZUNob29zZXJNb2RhbC5qcyc7XG5cblxuXHQvLyB1dGlsaXR5IHRvIHJldHVybiBkYXRlIGluIGNvcnJlY3QgZm9ybWF0XG5cdGZ1bmN0aW9uIGZvcm1hdERhdGUgKGQpIHtcblx0XHRjb25zdCBkYXRlID0gKGQpID8gbmV3IERhdGUoZCkgOiBuZXcgRGF0ZSgpO1xuXHRcdGNvbnN0IGRheSA9IGRhdGUuZ2V0RGF0ZSgpO1xuXHRcdGNvbnN0IG1vbnRoID0gKGRhdGUuZ2V0TW9udGgoKSArIDEpO1xuXHRcdGNvbnN0IHllYXIgPSBkYXRlLmdldEZ1bGxZZWFyKCk7XG5cdFx0Y29uc3QgZm9ybWF0ZWQgPSBgJHt5ZWFyfS0ke21vbnRofS0ke2RheX1gO1xuXHRcdHJldHVybiBmb3JtYXRlZDtcblx0fTtcblxuXG4vKipcbiAqIENhbGN1bGF0ZXMgdGhlIHRpbWUgdmFsdWUgaW4gbWlsbGlzZWNvbmRzIGJhc2VkIG9uIHRoZSBnaXZlbiB0aW1lLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB0aW1lIC0gVGhlIHRpbWUgaW4gdGhlIGZvcm1hdCBcIkhIOk1NXCIuXG4gKiBAcmV0dXJuIHtudW1iZXJ9IFRoZSB0aW1lIHZhbHVlIGluIG1pbGxpc2Vjb25kcy5cbiAqXG4gKiBAaGFzVGVzdHNcbiAqXG4gKiBAZXhhbXBsZVxuICogLy8gRXhhbXBsZSB1c2FnZTpcbiAqIGNvbnN0IHRpbWVWYWx1ZSA9IHRpbWVWYWx1ZUluTWlsbCgnMTI6MzAnKTtcbiAqL1xuXG5mdW5jdGlvbiB0aW1lVmFsdWVJbk1pbGwgKHRpbWUpIHtcbiAgaWYgKCF0aW1lLmluY2x1ZGVzKCc6JykpIHtcbiAgICBjb25zdCBlID0gbmV3IEVycm9yKCdFeHBlY3RzIGEgdGltZSBzdHJpbmcgSEg6TU0nKTtcbiAgICB0aHJvdyBlO1xuICB9XG4gIGNvbnN0IFtob3VycywgbWludXRlc10gPSB0aW1lLnNwbGl0KCc6Jyk7XG4gIHJldHVybiAocGFyc2VJbnQoaG91cnMpICogNjAgKiA2MCAqIDEwMDApICsgKHBhcnNlSW50KG1pbnV0ZXMpICogNjAgKiAxMDAwKTtcbn1cblxuLyoqXG4gKiB2YXIgZ2V0RGF5c0luTW9udGggLSBHZXQgbnVtYmVyIG9mIGRheXMgaW4gbW9udGhcbiAqXG4gKiBAcGFyYW0gIHshbnVtYmVyfSBtb250aCBUaGUgbnVtYmVyIG9mIHRoZSBjb3JyZXNwb25kaW5nIG1vbnRoLlxuICogQHBhcmFtICB7IW51bWJlcn0geWVhciAgVGhlIGNvcnJlc3BvbmRpbmcgeWVhci5cbiAqIEByZXR1cm4ge251bWJlcn0gUmV0dXJucyBhIG51bWJlciBjb3JyZXNwb25kaW5nIHRvIHRoZSBudW1iZXIgb2YgZGF5cyBmb3IgdGhlIGRhdGUgaW4gcG9pbnQuXG4gKi9cbmZ1bmN0aW9uIGdldERheXNJbk1vbnRoIChtb250aCwgeWVhcikge1xuICByZXR1cm4gbmV3IERhdGUoeWVhciwgbW9udGgsIDApLmdldERhdGUoKTtcbn1cblxuLyoqXG4gKiBDaGVja3MgZm9yIG92ZXJsYXAgaW4gYW4gYXJyYXkgb2YgdmFsdWVzLlxuICpcbiAqIEBwYXJhbSB7QXJyYXl9IHZhbHVlcyAtIFRoZSBhcnJheSBvZiB2YWx1ZXMgdG8gY2hlY2sgZm9yIG92ZXJsYXAuXG4gKiBAcmV0dXJuIHtib29sZWFufSAtIFJldHVybnMgdHJ1ZSBpZiBvdmVybGFwIGlzIGZvdW5kLCBmYWxzZSBvdGhlcndpc2UuXG4gKi9cbmZ1bmN0aW9uIGNoZWNrT3ZlcmxhcCAodmFsdWVzKSB7XG4gIGNvbnN0IG51bWVyaWNhbEVxdWl2YWxlbnQgPSB2YWx1ZXMubWFwKHRpbWVWYWx1ZUluTWlsbCk7XG5cbiAgZm9yIChsZXQgY3VycmVudEluZGV4ID0gMjsgY3VycmVudEluZGV4IDwgbnVtZXJpY2FsRXF1aXZhbGVudC5sZW5ndGg7IGN1cnJlbnRJbmRleCArPSAyKSB7XG4gICAgY29uc3QgY3VycmVudFN0YXJ0ID0gbnVtZXJpY2FsRXF1aXZhbGVudFtjdXJyZW50SW5kZXhdO1xuICAgIGNvbnN0IGN1cnJlbnRFbmQgPSBudW1lcmljYWxFcXVpdmFsZW50W2N1cnJlbnRJbmRleCArIDFdO1xuXG4gICAgZm9yIChsZXQgY29tcGFyaXNvbkluZGV4ID0gMDsgY29tcGFyaXNvbkluZGV4IDwgbnVtZXJpY2FsRXF1aXZhbGVudC5sZW5ndGg7IGNvbXBhcmlzb25JbmRleCArPSAyKSB7XG4gICAgICBpZiAoY3VycmVudEluZGV4ICE9PSBjb21wYXJpc29uSW5kZXgpIHtcbiAgICAgICAgY29uc3QgY29tcGFyaXNvblN0YXJ0ID0gbnVtZXJpY2FsRXF1aXZhbGVudFtjb21wYXJpc29uSW5kZXhdO1xuICAgICAgICBjb25zdCBjb21wYXJpc29uRW5kID0gbnVtZXJpY2FsRXF1aXZhbGVudFtjb21wYXJpc29uSW5kZXggKyAxXTtcblxuICAgICAgICBpZiAoY29tcGFyaXNvbkVuZCA+PSBjdXJyZW50U3RhcnQgJiYgY29tcGFyaXNvbkVuZCA8PSBjdXJyZW50RW5kKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gZWxzZSBpZiAoY3VycmVudFN0YXJ0ID49IGNvbXBhcmlzb25TdGFydCAmJiBjdXJyZW50RW5kIDw9IGNvbXBhcmlzb25FbmQpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIGlmIChjdXJyZW50U3RhcnQgPT09IGNvbXBhcmlzb25TdGFydCAmJiBjdXJyZW50RW5kID09PSBjb21wYXJpc29uRW5kKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gZWxzZSBpZiAoY3VycmVudEVuZCA+PSBjb21wYXJpc29uU3RhcnQgJiYgY3VycmVudEVuZCA8PSBjb21wYXJpc29uRW5kKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBDbGVhcnMgdGhlIHNlbGVjdGlvbiBvZiBkYXRlcyBpbiB0aGUgY2FsZW5kYXIuXG4gKlxuICogQHBhcmFtIHt1bmRlZmluZWR9XG4gKiBAcmV0dXJuIHt1bmRlZmluZWR9XG4gKi9cbmZ1bmN0aW9uIGNsZWFyU2VsZWN0aW9uIChjYWxlbmRhciwgZHluYW1pY0RhdGEpIHtcbiAgY29uc3QgZGF0ZXNPYmpTdG9yZSA9IGR5bmFtaWNEYXRhLmRhdGVzU2VsZWN0ZWRBcnJheU9iamVjdHM7XG4gIGNvbnN0IGRhdGVzSW5kZXggPSBkeW5hbWljRGF0YS5kYXRlc1NlbGVjdGVkQXJyYXk7XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRlc09ialN0b3JlLmxlbmd0aDsgaSsrKSB7XG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBkYXRlc0luZGV4Lmxlbmd0aDsgaisrKSB7XG4gICAgICBkYXRlc0luZGV4W2pdLmZvckVhY2goKGRhdGUpID0+IHtcbiAgICAgICAgdW5zZWxlY3RlZFN0eWxlKGNhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLWh1bWFuZGF0ZT0nJHtkYXRlfSddYCkpO1xuICAgICAgICBpZiAoaSA9PT0gZGF0ZXNPYmpTdG9yZS5sZW5ndGggLSAxICYmIGogPT09IGRhdGVzSW5kZXgubGVuZ3RoIC0gMSkge1xuICAgICAgICAgIGRhdGVzT2JqU3RvcmUubGVuZ3RoID0gMDtcbiAgICAgICAgICBkYXRlc0luZGV4Lmxlbmd0aCA9IDA7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufVxuXG4vKlxuXG4qL1xuXG4vKipcbiAqIEBwYXJhbSB7bnVtYmVyfSBbbGVuZ3RoPTEwXSAtbGVuZ3RoIHRoZSBkZXNpcmVkIGxlbmd0aCBvZiB0aGUgc3RyaW5nIG9mIG51bWJlcnMuXG4gKiBAcmV0dXJucyBhIHN0cmluZyBvZiByYW5kb20gZGlnaXRzIG9mIGEgc3BlY2lmaWVkIGxlbmd0aC5cbiAqL1xuXG5mdW5jdGlvbiByYW5kb21CeXRlcyAobGVuZ3RoKSB7XG4gIGlmIChsZW5ndGggPiA4MCkge1xuICAgIGNvbnN0IGUgPSBuZXcgRXJyb3IoJ3JhbmRvbUJ5dGVzIGxlbmd0aCBjYW4gYmUgbW9yZSB0aGFuIDgwMCBkaWdpdHMnKTtcbiAgICB0aHJvdyBlO1xuICB9XG4gIGNvbnN0IGFycmF5ID0gbmV3IFVpbnQzMkFycmF5KDEwMCk7XG4gIHdpbmRvdy5jcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKGFycmF5KTtcbiAgbGV0IHN0ID0gJyc7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICBzdCArPSBhcnJheVtpXTtcbiAgICBpZiAoaSA9PT0gYXJyYXkubGVuZ3RoIC0gMSkge1xuICAgICAgcmV0dXJuIHN0LnNsaWNlKHN0Lmxlbmd0aCAtIChsZW5ndGggfHwgMTApKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2VuZXJhdGVSYW5kb21TdHJpbmcoKSB7XG4gIGNvbnN0IHJhbmRvbVN0cmluZyA9IHJhbmRvbUJ5dGVzKDEwKTtcbiAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjYWxlbmRhci0nICsgcmFuZG9tU3RyaW5nKSkge1xuICAgIHJldHVybiBnZW5lcmF0ZVJhbmRvbVN0cmluZygpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiByYW5kb21TdHJpbmc7XG4gIH1cbn1cblxuLy9XRSBXRVJFIFNFVFRJTkcgVVAgVEhFIENBTEVOREFSIFRPIFJFTkRFUiBEQVRFUyBJTiBUSEUgUEFTVDpcbi8qIFdhcm5pbmc6IENvbnRlbXBsYXRlcyBkYXlsaWdodCBzYXZpbmcgdGltZSovXG5cbmZ1bmN0aW9uIGdldEVhcmxpZXN0RGF0ZSAocHJlbG9hZGVkRGF0ZXMpIHtcbiAgY29uc3Qgb3JkZXIgPSBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBwcmVsb2FkZWREYXRlcy5sZW5ndGg7IGkrKykge1xuICAgIGlmIChpID09PSAwKSB7XG4gICAgICBvcmRlci5wdXNoKG5ldyBEYXRlKCkuZ2V0VGltZSgpKTtcbiAgICB9XG4gICAgb3JkZXIucHVzaChuZXcgRGF0ZShwcmVsb2FkZWREYXRlc1tpXSkuZ2V0VGltZSgpKTtcbiAgICBpZiAoaSA9PT0gcHJlbG9hZGVkRGF0ZXMubGVuZ3RoIC0gMSkge1xuICAgICAgb3JkZXIuc29ydCgpO1xuICAgICAgY29uc3QgZCA9IG5ldyBEYXRlKG9yZGVyWzBdKTtcbiAgICAgIHJldHVybiBkO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIENvbnZlcnRzIGFuIGFycmF5IG9mIGRhdGVzIGludG8gYSBuZXcgYXJyYXkgb2Ygb2JqZWN0cyB3aXRoIGZvcm1hdHRlZCBkYXRlcy5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBkYXRlcyAtIFRoZSBhcnJheSBvZiBkYXRlcy5cbiAqIEByZXR1cm4ge1Byb21pc2V9IEEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIHRoZSBuZXcgYXJyYXkgb2Ygb2JqZWN0cy5cbiAqL1xuZnVuY3Rpb24gY29udmVydERhdGVzIChkYXRlcykge1xuICBjb25zdCBwcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChkYXRlc1tpXS5kYXkpIHtcbiAgICAgICAgZHluYW1pY0RhdGEuZGF0ZXNTZWxlY3RlZEFycmF5T2JqZWN0cy5wdXNoKGRhdGVzW2ldKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICAvLyBkeW5hbWljRGF0YS5kYXRlc1NlbGVjdGVkQXJyYXlPYmplY3RzLnB1c2goeyBkYXk6IHN0YW5kYXJkRGF0ZU9iamVjdChkYXRlc1tpXSkgfSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHByb21pc2U7XG59XG5cblxuLyoqXG4gKiBBc3luY2hyb25vdXNseSBwcmVsb2FkcyBkYXRlcyBmb3IgdGhlIGNhbGVuZGFyLlxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBjYWxlbmRhciAtIHRoZSBjYWxlbmRhciBvYmplY3RcbiAqIEBwYXJhbSB7YXJyYXl9IGRhdGVzIC0gYW4gYXJyYXkgb2YgZGF0ZXMgdG8gcHJlbG9hZFxuICogQHJldHVybiB7dm9pZH0gXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIHByZWxvYWREYXRlcyAoY2FsZW5kYXIsIGRhdGVzKSB7XG4gIGNvbnNvbGUubG9nKCdQUkVMT0FESU5HIERBVEVTLi4uJyk7XG4gIC8vIGNvbnNvbGUubG9nKGNhbGVuZGFyKTtcbiAgLy8gY29uc29sZS5sb2coZGF0ZXMpO1xuICBkYXRlcyA9IFsnMjAyMy0xMC0xMCddXG4gIGxldCBlbmRVc2VyID0gMTtcbiAgLy9hdHRhY2goZGF0ZU5vZGUpO1xuICBhd2FpdCBjb252ZXJ0RGF0ZXMoZGF0ZXMpO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0ZXNTZWxlY3RlZEFycmF5T2JqZWN0cy5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IGRhdGVPYmplY3QgPSBkYXRlc1NlbGVjdGVkQXJyYXlPYmplY3RzW2ldO1xuICAgIGNvbnN0IGRhdGVOb2RlID0gY2FsZW5kYXIucXVlcnlTZWxlY3RvcihgIyR7ZGF0ZU9iamVjdC5kYXl9YCk7XG5cbiAgICBpZiAoZGF0ZU5vZGUpIHtcbiAgICAgIGRhdGVzU2VsZWN0ZWRBcnJheS5wdXNoKGRhdGVzW2ldLmRheSk7XG4gICAgICBkYXRlTm9kZS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAnI2ZjMyc7XG4gICAgICBkYXRlTm9kZS5jbGFzc0xpc3QuYWRkKCdhdmFpbGFibGUnKTtcbiAgICB9XG5cbiAgICBpZiAoZW5kVXNlcikge1xuICAgICAgYXR0YWNoKGRhdGVOb2RlKTtcbiAgICAgIC8vdGltZUNob29zZXIoKTtcbiAgICB9XG5cbiAgICBpZiAoZGlzcGxheVRpbWVDaG9vc2VyTW9kYWwpIHtcbiAgICAgIC8vIGNyZWF0ZVRpbWVFbGVtZW50cyAoKTtcbiAgICAgIC8vZ2VuZXJhdGVUaW1lc09ubHkoZGF0ZU9iamVjdC50aW1lcywgZGF0ZU5vZGUpO1xuICAgIH1cblxuICAgIGlmIChzZWxlY3RSYW5nZSAmJiBkYXRlTm9kZSAmJiAhZGF0ZU5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdmaWxsZXInKSkge1xuICAgICAgZGF0ZU5vZGUuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJyMzMzMnO1xuICAgICAgZGF0ZU5vZGUuY2xhc3NMaXN0LmFkZCgnYmxvY2tlZCcpO1xuICAgICAgZGF0ZU5vZGUudGl0bGUgPSAnTm8gYXZhaWxhYmlsaXR5IG9uIHRoaXMgZGF5JztcblxuICAgICAgY29uc3Qgc29sZE91dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICAgIHNvbGRPdXQuY2xhc3NMaXN0LmFkZCgnY2FsZW5kYXJUaW1lJyk7XG4gICAgICBzb2xkT3V0LnRleHRDb250ZW50ID0gJ1NvbGQgb3V0JztcbiAgICAgIGRhdGVOb2RlLmFwcGVuZENoaWxkKHNvbGRPdXQpO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBibG9ja0RheXNOb3RPcGVuIChjYWxlbmRhciwgZGF0ZXNPcGVuKSB7XG4gIGlmIChjYWxlbmRhciAmJiBkYXRlc09wZW4pIHtcbiAgICBjb25zdCBhbGxEYXlzID0gQXJyYXkuZnJvbShjYWxlbmRhci5xdWVyeVNlbGVjdG9yQWxsKCcuZGF5VGltZScpKS5tYXAoKGVsKSA9PiB7IHJldHVybiBlbC5kYXRhc2V0Lmh1bWFuZGF0ZTsgfSk7XG4gICAgY29uc3Qgb3BlbkRheXMgPSBkYXRlc09wZW4ubWFwKChlbCkgPT4geyByZXR1cm4gZWwuZGF5OyB9KTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYWxsRGF5cy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKG9wZW5EYXlzLmluZGV4T2YoYWxsRGF5c1tpXSkgPT09IC0xKSB7XG4gICAgICAgIGNvbnN0IGRheSA9IGNhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoYFtpZD1cIiR7YWxsRGF5c1tpXX1cIl1gKTtcbiAgICAgICAgZGF5LmNsYXNzTGlzdC5hZGQoJ3dpZHRoU2hhcGUnLCAnZmlsbGVyJyk7XG4gICAgICAgIGRheS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAnd2hpdGUnO1xuICAgICAgICBkYXkudGl0bGUgPSAnQ2xvc2VkIG9uIHRoaXMgZGF5JztcblxuICAgICAgICBjb25zdCBjbG9zZWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgICAgIGNsb3NlZC5jbGFzc0xpc3QuYWRkKCdjYWxlbmRhclRpbWUnKTtcbiAgICAgICAgY2xvc2VkLnRleHRDb250ZW50ID0gJ2Nsb3NlZCc7XG5cbiAgICAgICAgZGF5LmFwcGVuZENoaWxkKGNsb3NlZCk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogUmVsZWFzZSBib29rZWQgZGF5XG4gKiBAZGVzY3JpcHRpb24gUmVtb3ZlcyBhIGRheSB0aGF0IGhhcyBiZWVuIHByZXZpb3VzbHkgYm9va2VkLlxuICogQGZ1bmN0aW9uIHJlbGVhc2VCb29rZWREYXlcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGRheSAtIEhUTUwgZGl2IGVsZW1lbnQgcmVwcmVzZW50aW5nIHRoZSBkYXkuXG4gKiBAcGFyYW0ge3N0cmluZ30gZGF0ZSAtIERhdGUgc3RyaW5nIGluIHRoZSBmb3JtYXQgJ1lZWVktTU0tREQnLlxuICovXG5mdW5jdGlvbiByZWxlYXNlQm9va2VkRGF5IChkYXksIGRhdGUpIHtcbiAgY29uc3QgaW5kZXggPSBkYXRlc1NlbGVjdGVkQXJyYXkuaW5kZXhPZihkYXRlKTtcbiAgdW5zZWxlY3RlZFN0eWxlKGRheSk7XG4gIGRhdGVzU2VsZWN0ZWRBcnJheS5zcGxpY2UoaW5kZXgsIDEpO1xuICBkYXRlc1NlbGVjdGVkQXJyYXlPYmplY3RzLnNwbGljZShpbmRleCwgMSk7XG5cbiAgd2hpbGUgKGRheS5maXJzdENoaWxkKSB7XG4gICAgZGF5LmZpcnN0Q2hpbGQucmVtb3ZlKCk7XG4gIH1cbn1cblxuLyoqXG4gKiBBZGRzIDEgdG8gdGhlIG1vbnRoIGluIGEgZ2l2ZW4gZGF0ZSB0byBtYWtlIGl0IG1vcmUgaHVtYW4tcmVhZGFibGUuXG4gKiBAcGFyYW0ge3N0cmluZ30gZGF0ZSAtIFRoZSBkYXRlIGluIHRoZSBmb3JtYXQgJ1lZWVktTU0tREQnIG9yICdZWVlZLU0tRCcuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSAtIFRoZSBtb2RpZmllZCBkYXRlIGluIHRoZSBmb3JtYXQgJ1lZWVktTU0tREQnLlxuICogQHRocm93cyB7RXJyb3J9IC0gSWYgdGhlIGRhdGUgcGFyYW1ldGVyIGlzIG5vdCBpbiB0aGUgZm9ybWF0ICdZWVlZLU1NLUREJyBvciAnWVlZWS1NLUQnLlxuICovXG5mdW5jdGlvbiBodW1hbkRhdGUgKGRhdGUpIHtcbiAgY29uc3QgZGF0ZVBhcnRzID0gZGF0ZS5zcGxpdCgnLScpO1xuICBjb25zdCBtb250aCA9IHBhcnNlSW50KGRhdGVQYXJ0c1sxXSkgKyAxO1xuICBjb25zdCBkYXkgPSBwYXJzZUludChkYXRlUGFydHNbMl0pO1xuICBjb25zdCBtb2RpZmllZE1vbnRoID0gbW9udGggPCAxMCA/IGAwJHttb250aH1gIDogbW9udGg7XG4gIGNvbnN0IG1vZGlmaWVkRGF5ID0gZGF5IDwgMTAgPyBgMCR7ZGF5fWAgOiBkYXk7XG4gIGNvbnN0IG1vZGlmaWVkRGF0ZSA9IGAke2RhdGVQYXJ0c1swXX0tJHttb2RpZmllZE1vbnRofS0ke21vZGlmaWVkRGF5fWA7XG4gIHJldHVybiBtb2RpZmllZERhdGU7XG59XG5cblxuZnVuY3Rpb24gc29ydFRpbWVzICh2YWwpIHtcbiAgdmFyIHNvcnRlZCA9IFtdO1xuICByZXR1cm4gZW51bWVyYXRlKHZhbCk7XG5cbiAgZnVuY3Rpb24gc29ydE51bWJlcihhLCBiKSB7XG4gICAgcmV0dXJuIGEgLSBiO1xuICB9XG5cbiAgZnVuY3Rpb24gZW51bWVyYXRlKHZhbHVlcykge1xuICAgIHZhciBudW1lcmljYWxFcXVpdmFsZW50ID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2YWx1ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIG51bWVyaWNhbEVxdWl2YWxlbnQucHVzaCh0aW1lVmFsdWVJbk1pbGwodmFsdWVzW2ldKSk7XG4gICAgICBpZiAoaSA9PT0gdmFsdWVzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgcmV0dXJuIHNvcnQodmFsdWVzLCBudW1lcmljYWxFcXVpdmFsZW50KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBzb3J0KHZhbHVlcywgbnVtZXJpY2FsRXF1aXZhbGVudCkge1xuICAgIHZhciBudW1lcmljYWxFcXVpdmFsZW50Q2xvbmUgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KG51bWVyaWNhbEVxdWl2YWxlbnQpKTtcbiAgICB2YXIgc29ydGVkSW50ID0gbnVtZXJpY2FsRXF1aXZhbGVudC5zb3J0KHNvcnROdW1iZXIpO1xuICAgIGZvciAodmFyIHAgPSAwOyBwIDwgbnVtZXJpY2FsRXF1aXZhbGVudENsb25lLmxlbmd0aDsgcCsrKSB7XG4gICAgICB2YXIgbmV3SW5kZXggPSBzb3J0ZWRJbnQuaW5kZXhPZihudW1lcmljYWxFcXVpdmFsZW50Q2xvbmVbcF0pO1xuICAgICAgc29ydGVkLnNwbGljZShwLCAxLCB2YWx1ZXNbbmV3SW5kZXhdKTtcbiAgICAgIGlmIChwID09PSBudW1lcmljYWxFcXVpdmFsZW50Lmxlbmd0aCAtIDEpIHtcbiAgICAgICAgcmV0dXJuIHNvcnRlZDtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBSZWxlYXNlIGRheSBvZiB3ZWVrXG4gKiBAZnVuY3Rpb24gcmVsZWFzZURheU9mV2Vla0dcbiAqIEBwYXJhbSBkYXlJRCBpZCBvZiB0aGUgZGF5IHRvIGJlIHJlbGVhc2VkLiBOLmIuIGRheSBvZiB3ZWVrIGlzIHN0b3JlZCBhcyBhIGRhdGEgYXR0cmlidXRlXG4gKiBAdG9kbyBtYWtlIGl0IHVzZSBsYXN0RGF0ZUNsaWNrZWQgKHdoaWNoIGlzIHRoZSBkYXkgaW4gY29udGV4dClcbiAqL1xuZnVuY3Rpb24gcmVsZWFzZURheU9mV2Vla0coZGF5SWQpIHtcbiAgY29uc3Qgd2Vla2RheSA9IGxhc3REYXRlQ2xpY2tlZC5kYXRhc2V0LmRheW9md2VlaztcbiAgY29uc3QgYmxvY2tUaGVzZURheXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiW2RhdGEtZGF5b2Z3ZWVrPSdcIiArIHdlZWtkYXkgKyBcIiddXCIpO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGJsb2NrVGhlc2VEYXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGJsb2NrRGF5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYmxvY2tUaGVzZURheXNbaV0uaWQpO1xuICAgIGlmIChibG9ja0RheSAhPT0gbGFzdERhdGVDbGlja2VkKSB7XG4gICAgICByZWxlYXNlQm9va2VkRGF5KGJsb2NrRGF5LCBibG9ja1RoZXNlRGF5c1tpXS5pZCk7XG4gICAgICByZW1vdmVUaW1lRGlzcGxheShibG9ja1RoZXNlRGF5c1tpXS5pZCk7XG4gICAgfVxuICAgIGlmIChibG9ja0RheSA9PT0gbGFzdERhdGVDbGlja2VkKSB7XG4gICAgICAvLyByZW1vdmUgb25seSB0aGUgZGlzcGxheTpcbiAgICAgIC8vcmVtb3ZlVGltZURpc3BsYXkoYmxvY2tUaGVzZURheXNbaV0uaWQpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgeyB0aW1lVmFsdWVJbk1pbGwsIGNoZWNrT3ZlcmxhcCwgY2xlYXJTZWxlY3Rpb24sIGdldERheXNJbk1vbnRoLCBnZW5lcmF0ZVJhbmRvbVN0cmluZywgZ2V0RWFybGllc3REYXRlLFxuICBwcmVsb2FkRGF0ZXMsIGJsb2NrRGF5c05vdE9wZW4sIHJlbGVhc2VCb29rZWREYXksIGh1bWFuRGF0ZSwgc29ydFRpbWVzLCBmb3JtYXREYXRlIH07XG5cbi8vYm9va0RheSBzaW5nbGVEYXRlQ2hvaWNlXG4vL3JlbGVhc2VCb29rZWREYXkgZGF0ZXNTZWxlY3RlZEFycmF5T2JqZWN0cyBkYXRlc1NlbGVjdGVkQXJyYXkiLCJ2YXIgY3NzID0gXCIuY2FsZW5kYXIge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGZsZXgtd3JhcDogd3JhcDtcXG4gIGZsZXgtZGlyZWN0aW9uOiByb3c7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDI0MCwgMjQ4LCAyNTUsIDApO1xcbiAgd2lkdGg6IDEwMCU7XFxuICBoZWlnaHQ6IDI4LjhlbTtcXG4gIG92ZXJmbG93LXk6IGF1dG87XFxuICBwb3NpdGlvbjogcmVsYXRpdmU7XFxuICBjb2xvcjogIzMzMztcXG4gIGZvbnQtZmFtaWx5OiBVYnVudHUsIEFyaWFsLCBIZWx2ZXRpY2EsIHNhbnMtc2VyaWY7XFxuICBmb250LXNpemU6IDEuMmVtO1xcbiAgZm9udC13ZWlnaHQ6IDcwMDtcXG4gIGxpbmUtaGVpZ2h0OiAxLjU7XFxufVxcbi5jYWxlbmRhciAuYmxvY2tlZCB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMzMzO1xcbn1cXG4uY2FsZW5kYXIgLmZpbGxlciB7XFxuICBwb2ludGVyLWV2ZW50czogbm9uZTtcXG4gIG9wYWNpdHk6IDAuMztcXG59XFxuLmNhbGVuZGFyIC5wcmVsb2FkZWQge1xcbiAgYm9yZGVyLWNvbG9yOiBibHVlO1xcbiAgYm9yZGVyLXN0eWxlOiBzb2xpZDtcXG4gIGJvcmRlci13aWR0aDogM3B4O1xcbn1cXG4uY2FsZW5kYXIgLnRpbWVTZWxlY3Qge1xcbiAgcGFkZGluZzogMDtcXG4gIHdpZHRoOiBhdXRvO1xcbiAgbWFyZ2luOiAwO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZjtcXG4gIGZsb2F0OiByaWdodDtcXG4gIGZvbnQtd2VpZ2h0OiA3MDA7XFxuICBmb250LWZhbWlseTogQXJpYWwsIEhlbHZldGljYSwgc2Fucy1zZXJpZjtcXG4gIGJvcmRlci1zdHlsZTogc29saWQ7XFxuICBib3JkZXItcmFkaXVzOiAxZW07XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgYm9yZGVyLXdpZHRoOiAzcHg7XFxuICBib3JkZXItY29sb3I6ICNmMTU5MjU7XFxuICBjb2xvcjogIzAwMDtcXG4gIGZvbnQtc2l6ZTogMC45ZW07XFxufVxcbi5jYWxlbmRhciAudGltZUNvbnQge1xcbiAgbWFyZ2luLWxlZnQ6IGF1dG87XFxuICB3aWR0aDogMTBlbTtcXG4gIGJhY2tncm91bmQtY29sb3I6IGFsaWNlYmx1ZTtcXG4gIGJvcmRlci1zdHlsZTogc29saWQ7XFxuICBib3JkZXItY29sb3I6ICNmMTU5MjU7XFxuICBtYXJnaW4tcmlnaHQ6IGF1dG87XFxuICBtYXJnaW4tdG9wOiAxMGVtO1xcbn1cXG4uY2FsZW5kYXIgLmRheWJsb2Nrcm93IHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBmbGV4LWRpcmVjdGlvbjogcm93O1xcbiAgbWluLXdpZHRoOiAxMDAlO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogYWxpY2VibHVlO1xcbn1cXG4uY2FsZW5kYXIgLmNhbGVuZGFyVGltZVBhcmVudCB7XFxuICBtYXJnaW46IDAuMWVtO1xcbn1cXG4uY2FsZW5kYXIgLmNhbGVuZGFyVGltZVBhcmVudCAuY2FsZW5kYXJUaW1lIHtcXG4gIGZvbnQtc2l6ZTogMC45ZW07XFxuICBtYXJnaW4tdG9wOiAwZW07XFxuICBsaW5lLWhlaWdodDogMTtcXG4gIGJhY2tncm91bmQtY29sb3I6IGFsaWNlYmx1ZTtcXG4gIGNvbG9yOiBibGFjaztcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gIG1hcmdpbjogMHB4O1xcbn1cXG4uY2FsZW5kYXIgLndpZHRoU2hhcGVEYXlzIHtcXG4gIHdpZHRoOiAxNC4yODU3MTQyODU3JTtcXG4gIG1hcmdpbi1sZWZ0OiBhdXRvO1xcbiAgbWFyZ2luLXJpZ2h0OiBhdXRvO1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbn1cXG4uY2FsZW5kYXIgLndpZHRoU2hhcGUge1xcbiAgd2lkdGg6IDE0LjI4NTcxNDI4NTclO1xcbiAgbWFyZ2luLWxlZnQ6IGF1dG87XFxuICBtYXJnaW4tcmlnaHQ6IGF1dG87XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICBtaW4taGVpZ2h0OiAzLjZlbTtcXG4gIG1hcmdpbi1ib3R0b206IDAuMmVtO1xcbn1cXG4uY2FsZW5kYXIgLm1vbnRoTmFtZSB7XFxuICBtYXJnaW46IGF1dG87XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICBmb250LWZhbWlseTogVWJ1bnR1O1xcbiAgZm9udC1zaXplOiAxLjYxZW07XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMzM3YWI3O1xcbiAgY29sb3I6ICNmZmNjMzM7XFxuICBmbGV4LWJhc2lzOiAxMDAlO1xcbiAgYm9yZGVyLWJvdHRvbS1zdHlsZTogc29saWQ7XFxufVxcbi5jYWxlbmRhciAud2Vla3JvdyB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZmxleC13cmFwOiBub3dyYXA7XFxuICBmbGV4LWRpcmVjdGlvbjogcm93O1xcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZjtcXG4gIGZvbnQtZmFtaWx5OiBcXFwicm9ib3RvXFxcIiwgXFxcImFyaWFsXFxcIjtcXG59XFxuLmNhbGVuZGFyIC5kYXlOYW1lIHtcXG4gIGNvbG9yOiBibGFjaztcXG4gIGZvbnQtZmFtaWx5OiBcXFwicm9ib3RvXFxcIiwgXFxcImFyaWFsXFxcIjtcXG4gIGZvbnQtd2VpZ2h0OiA2MDA7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjY2NjO1xcbn1cXG4uY2FsZW5kYXIgLm1vbnRoID4gKiB7XFxuICBtYXJnaW4tbGVmdDogMnB4O1xcbiAgbWFyZ2luLXJpZ2h0OiAycHg7XFxufVxcbi5jYWxlbmRhciAubW9udGgge1xcbiAgd2lkdGg6IDUwJTtcXG4gIG1pbi13aWR0aDogMzAwcHg7XFxuICBtYXJnaW46IGF1dG87XFxufVxcbi5jYWxlbmRhciAudGltZUNob29zZXIge1xcbiAgd2lkdGg6IDEwZW07XFxuICBwb3NpdGlvbjogc3RhdGljO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogYWxpY2VibHVlO1xcbiAgbWFyZ2luLWxlZnQ6IGF1dG87XFxuICBtYXJnaW4tcmlnaHQ6IGF1dG87XFxufVxcbi5jYWxlbmRhciAudGltZUNvbnRhaW5lciB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbn1cXG4uY2FsZW5kYXIgLnRpbWVDaG9vc2VyTW9kYWwge1xcbiAgei1pbmRleDogMTtcXG4gIHdpZHRoOiAxMDAlO1xcbiAgaGVpZ2h0OiAxMDAlO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAwLCAwLCAwLjQpO1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgbWFyZ2luOiAwO1xcbiAgcGFkZGluZzogMDtcXG4gIGJvcmRlcjogMDtcXG4gIG92ZXJmbG93LXg6IHNjcm9sbDtcXG59XFxuLmNhbGVuZGFyIC5jYWxlbmRhckxhYmVsIHtcXG4gIG1pbi13aWR0aDogM2VtO1xcbiAgcGFkZGluZzogMGVtIDFlbSAwZW0gMWVtO1xcbiAgY29sb3I6IGJsYWNrO1xcbiAgZm9udC1mYW1pbHk6IFxcXCJyb2JvdG9cXFwiLCBcXFwiYXJpYWxcXFwiO1xcbiAgZm9udC13ZWlnaHQ6IDYwMDtcXG4gIGJhY2tncm91bmQtY29sb3I6ICNjY2M7XFxuICBtYXJnaW46IDFlbSAwIDFlbSAwO1xcbn1cXG4uY2FsZW5kYXIgLmRlbGV0ZURpdiB7XFxuICBmb250LWZhbWlseTogVWJ1bnR1O1xcbiAgZm9udC1zaXplOiAxLjYxZW07XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMzM3YWI3O1xcbiAgY29sb3I6ICNmZmNjMzM7XFxuICBib3JkZXItYm90dG9tLXN0eWxlOiBzb2xpZDtcXG4gIGhlaWdodDogMmVtO1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG59XFxuLmNhbGVuZGFyIC5kZWxldGVCdXR0b24ge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogd2hpdGU7XFxuICBjb2xvcjogI2YxNTkyNTtcXG4gIGZsb2F0OiByaWdodDtcXG4gIGZvbnQtd2VpZ2h0OiA3MDA7XFxuICBmb250LWZhbWlseTogQXJpYWwsIEhlbHZldGljYSwgc2Fucy1zZXJpZjtcXG4gIGJvcmRlci1zdHlsZTogc29saWQ7XFxuICBib3JkZXItcmFkaXVzOiAxZW07XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICBoZWlnaHQ6IDMwcHg7XFxuICB3aWR0aDogMzBweDtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxufVxcbi5jYWxlbmRhciAuaW5uZXJTcGFuRGVsZXRlQnRuIHtcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG59XFxuLmNhbGVuZGFyIC5kZWxldGVCdXR0b246aG92ZXIsXFxuLmNhbGVuZGFyIC5kZWxldGVCdXR0b246Zm9jdXMsXFxuLmNhbGVuZGFyIC50aW1lU2VsZWN0OmhvdmVyLFxcbi5jYWxlbmRhciAudGltZVNlbGVjdDpmb2N1cyB7XFxuICBjb2xvcjogIzAwMDtcXG4gIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcXG4gIGN1cnNvcjogcG9pbnRlcjtcXG59XFxuLmNhbGVuZGFyIC5ob3VyIHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuICB3aWR0aDogMTBlbTtcXG59XFxuLmNhbGVuZGFyIC50aW1lU2VsZWN0UCB7XFxuICBkaXNwbGF5OiBpbmxpbmU7XFxuICB3aWR0aDogNWVtO1xcbiAgY29sb3I6ICMwMDA7XFxufVxcbi5jYWxlbmRhciAudGltZUNob29zZXIgPiBpbnB1dFt0eXBlPWNoZWNrYm94XSB7XFxuICBvdXRsaW5lOiAjZjE1OTI1O1xcbiAgb3V0bGluZS1zdHlsZTogc29saWQ7XFxufVxcbi5jYWxlbmRhciAudGltZVNlbGVjdCA+IG9wdGlvbiB7XFxuICBjb2xvcjogIzAwMDtcXG59XFxuLmNhbGVuZGFyIC5jYWxlbmRhciA+IHAsXFxuLmNhbGVuZGFyIGg0LFxcbi5jYWxlbmRhciBoMyxcXG4uY2FsZW5kYXIgaDIsXFxuLmNhbGVuZGFyIGgxLFxcbi5jYWxlbmRhciBzZWxlY3QsXFxuLmNhbGVuZGFyIG9wdGlvbiB7XFxuICBjb2xvcjogIzAwMDtcXG59XFxuLmNhbGVuZGFyIC5hcnJvdy11cCB7XFxuICB3aWR0aDogMDtcXG4gIGhlaWdodDogMDtcXG4gIGJvcmRlci1sZWZ0OiAxMHB4IHNvbGlkIHRyYW5zcGFyZW50O1xcbiAgYm9yZGVyLXJpZ2h0OiAxMHB4IHNvbGlkIHRyYW5zcGFyZW50O1xcbiAgYm9yZGVyLWJvdHRvbTogMTBweCBzb2xpZCBibGFjaztcXG59XFxuLmNhbGVuZGFyIC5hcnJvdy1kb3duIHtcXG4gIHdpZHRoOiAwO1xcbiAgaGVpZ2h0OiAwO1xcbiAgYm9yZGVyLWxlZnQ6IDEwcHggc29saWQgdHJhbnNwYXJlbnQ7XFxuICBib3JkZXItcmlnaHQ6IDEwcHggc29saWQgdHJhbnNwYXJlbnQ7XFxuICBib3JkZXItdG9wOiAxMHB4IHNvbGlkICMwMDA7XFxufVxcbi5jYWxlbmRhciAuYXJyb3dzIHtcXG4gIGZsb2F0OiByaWdodDtcXG4gIGNsZWFyOiByaWdodDtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gIGN1cnNvcjogcG9pbnRlcjtcXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxufVxcbi5jYWxlbmRhciAuYXJyb3ctcmlnaHQge1xcbiAgd2lkdGg6IDA7XFxuICBoZWlnaHQ6IDA7XFxuICBib3JkZXItdG9wOiA2MHB4IHNvbGlkIHRyYW5zcGFyZW50O1xcbiAgYm9yZGVyLWJvdHRvbTogNjBweCBzb2xpZCB0cmFuc3BhcmVudDtcXG4gIGJvcmRlci1sZWZ0OiA2MHB4IHNvbGlkIGdyZWVuO1xcbn1cXG4uY2FsZW5kYXIgLmFycm93LWxlZnQge1xcbiAgd2lkdGg6IDA7XFxuICBoZWlnaHQ6IDA7XFxuICBib3JkZXItdG9wOiAxMHB4IHNvbGlkIHRyYW5zcGFyZW50O1xcbiAgYm9yZGVyLWJvdHRvbTogMTBweCBzb2xpZCB0cmFuc3BhcmVudDtcXG4gIGJvcmRlci1yaWdodDogMTBweCBzb2xpZCBibHVlO1xcbn1cXG4uY2FsZW5kYXIgLmRheVRpbWUge1xcbiAgY3Vyc29yOiBwb2ludGVyO1xcbn1cXG4uY2FsZW5kYXIgLmRheVRpbWUgPiAqIHtcXG4gIHBvaW50ZXItZXZlbnRzOiBub25lO1xcbn1cXG5cIjsgKHJlcXVpcmUoXCJicm93c2VyaWZ5LWNzc1wiKS5jcmVhdGVTdHlsZShjc3MsIHsgXCJocmVmXCI6IFwicHJlQnVuZGxpbmdKUy9jYWxlbmRhckFwcC5jc3NcIiB9LCB7IFwiaW5zZXJ0QXRcIjogXCJib3R0b21cIiB9KSk7IG1vZHVsZS5leHBvcnRzID0gY3NzOyIsIi8qKlxuICogQHR5cGVkZWYge09iamVjdH0gSGFzVGVzdHNUYWdcbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gaGFzVGVzdHMgLSBJbmRpY2F0ZXMgd2hldGhlciB0aGUgZnVuY3Rpb24gaGFzIHRlc3RzLlxuICovXG5cbi8qKlxuICogQHR5cGVkZWYge09iamVjdH0gaGFzVGhlc2VTdHlsZXNcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBoYXNUaGVzZVN0eWxlcyAtIExpc3RzIHN0eWxlcyByZWZlcmVuY2VzIGluIGEgZnVudGlvblxuICovXG5cbmltcG9ydCB7XG4gIGdldERheXNJbk1vbnRoLCBnZW5lcmF0ZVJhbmRvbVN0cmluZywgZ2V0RWFybGllc3REYXRlLFxuICBibG9ja0RheXNOb3RPcGVuLCBodW1hbkRhdGUsIGNsZWFyU2VsZWN0aW9uXG59IGZyb20gJy4vYmFzaWNGdW5jdGlvbnMuanMnO1xuaW1wb3J0IHsgR2VuZXJhdGVUaW1lQ2hvb3Nlck1vZGFsIH0gZnJvbSAnLi9kaXNwbGF5VGltZUNob29zZXJNb2RhbC5qcyc7XG5pbXBvcnQgeyBjb2xvdXJzLCBzZWxlY3RlZFN0eWxlLCB1bnNlbGVjdGVkU3R5bGUgfSBmcm9tICcuL3N0eWxlcy5qcyc7XG5pbXBvcnQgeyBsYW5ndWFnZXMgfSBmcm9tICcuL2xhbmd1YWdlcy5qcyc7XG5pbXBvcnQgc3R5bGUgZnJvbSAnLi9jYWxlbmRhckFwcC5jc3MnO1xuXG4vKipcbiAqIEFkZHMgdGhlIHNwZWNpZmllZCBudW1iZXIgb2YgbW9udGhzIHRvIGEgZGF0ZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBtb250aHMgLSBUaGUgbnVtYmVyIG9mIG1vbnRocyB0byBhZGQuXG4gKiBAcmV0dXJucyB7RGF0ZX0gLSBUaGUgdXBkYXRlZCBkYXRlLlxuICovXG5EYXRlLnByb3RvdHlwZS5hZGRNb250aHMgPSBmdW5jdGlvbihtb250aHMpIHtcbiAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKHRoaXMpO1xuICBjb25zdCB5ZWFycyA9IE1hdGguZmxvb3IobW9udGhzIC8gMTIpO1xuICBjb25zdCByZW1haW5pbmdNb250aHMgPSBtb250aHMgJSAxMjtcbiAgaWYgKHllYXJzKSB7XG4gICAgZGF0ZS5zZXRGdWxsWWVhcihkYXRlLmdldEZ1bGxZZWFyKCkgKyB5ZWFycyk7XG4gIH1cbiAgaWYgKHJlbWFpbmluZ01vbnRocykge1xuICAgIGRhdGUuc2V0TW9udGgoZGF0ZS5nZXRNb250aCgpICsgcmVtYWluaW5nTW9udGhzKTtcbiAgfVxuICByZXR1cm4gZGF0ZTtcbn07XG5cbmN1c3RvbUVsZW1lbnRzLmRlZmluZSgnc3dpZnQtY2FsJywgY2xhc3MgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG4gIGNvbnN0cnVjdG9yICgpIHtcbiAgICBzdXBlcigpO1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIGZ1bmN0aW9uIHN0VG9Cb29sZWFuIChzdCkge1xuICAgICAgaWYoc3QgPT09ICd0cnVlJykge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgXG4gICAgY29uc3QgY2FsZW5kYXIgPSBuZXcgU3dpZnRDYWwoKTtcbiAgICBjYWxlbmRhci5nZW5lcmF0ZUNhbGVuZGFyKFxuICAgICAge1xuICAgICAgICB0YXJnZXQ6IHNlbGYsXG4gICAgICAgIC8vIGRhdGEtbnVtYmVyLW9mLW1vbnRocy10by1kaXNwbGF5IGh0bWwgY29udmVydHMgdG8gbnVtYmVyT2ZNb250aHNUb0Rpc3BsYXkgSlNcbiAgICAgICAgbnVtYmVyT2ZNb250aHNUb0Rpc3BsYXk6IHRoaXMuZGF0YXNldC5udW1iZXJPZk1vbnRoc1RvRGlzcGxheSxcbiAgICAgICAgLy8gZGF0YS1kaXNwbGF5LXRpbWUtY2hvb3Nlci1tb2RhbFxuICAgICAgICBkaXNwbGF5VGltZUNob29zZXJNb2RhbDogc3RUb0Jvb2xlYW4odGhpcy5kYXRhc2V0LmRpc3BsYXlUaW1lQ2hvb3Nlck1vZGFsKSxcbiAgICAgICAgLy8gZGF0YS1zaW5nbGUtZGF0ZS1jaG9pY2VcbiAgICAgICAgc2luZ2xlRGF0ZUNob2ljZTogc3RUb0Jvb2xlYW4odGhpcy5kYXRhc2V0LnNpbmdsZURhdGVDaG9pY2UpLFxuXG4gICAgICAgIGxhbmd1YWdlOiB0aGlzLmRhdGFzZXQubGFuZ3VhZ2UsXG4gICAgICAgIC8vZGF0YS1zZWxlY3QtbXVsdGlwbGVcbiAgICAgICAgc2VsZWN0TXVsdGlwbGU6IHRoaXMuZGF0YXNldC5zZWxlY3RNdWx0aXBsZSxcblxuICAgICAgICBwcmVsb2FkZWREYXRlczogKHRoaXMuZGF0YXNldC5wcmVsb2FkZWREYXRlcykgPyBKU09OLnBhcnNlKHRoaXMuZGF0YXNldC5wcmVsb2FkZWREYXRlcykgOiBmYWxzZSxcblxuICAgICAgICBwcmVsb2FkZWRUb29sdGlwOiB0aGlzLmRhdGFzZXQucHJlbG9hZGVkVG9vbHRpcFxuXG4gICAgICB9KTtcblxuICAgIHRoaXMuZHluYW1pY0RhdGEgPSBjYWxlbmRhci5yZXR1cm5EeW5hbWljRGF0YSgpO1xuICB9XG59KTtcblxuZnVuY3Rpb24gU3dpZnRDYWwgKCkge1xuICBsZXQgdGltZUNob29zZXI7XG4gIC8vIGZvciBuZXN0ZWQgZnVuY3Rpb25zIHRvIGFjY2VzcyB0aGUgb3V0ZXIgb2JqZWN0XG4gIGNvbnN0IGlubmVyVGhpcyA9IHRoaXM7IFxuICBjb25zdCBjb25maWcgPSB7fTtcblxuICBjb25zdCBoYW5kbGVyID0ge1xuICAgIGdldDogKHRhcmdldCwga2V5KSA9PiB7XG4gICAgICBpZih0eXBlb2YgdGFyZ2V0W2tleV0gPT09ICdvYmplY3QnICYmIHRhcmdldFtrZXldICE9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJveHkodGFyZ2V0W2tleV0sIGhhbmRsZXIpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGFyZ2V0W2tleV07XG4gICAgfSxcbiAgICBzZXQ6ICh0YXJnZXQsIHByb3AsIHZhbHVlKSA9PiB7XG4gICAgICB0YXJnZXRbcHJvcF0gPSB2YWx1ZTtcbiAgICAgIGVtaXREYXRlU2VsZWN0ZWRFdmVudCgpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG4gIFxuICBjb25zdCBkYXRhVGVtcGxhdGUgPSB7XG4gICAgZGF0ZXNTZWxlY3RlZEFycmF5OiBbXSxcbiAgICBkYXRlc1NlbGVjdGVkQXJyYXlPYmplY3RzOiBbXSxcbiAgICBkaXNhYmxlZDogZmFsc2VcbiAgfTtcblxuICBjb25zdCBkeW5hbWljRGF0YSA9IG5ldyBQcm94eShkYXRhVGVtcGxhdGUsIGhhbmRsZXIpO1xuXG4gIGZ1bmN0aW9uIGVtaXREYXRlU2VsZWN0ZWRFdmVudCAoKSB7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBjb25zdCBldnQgPSBuZXcgQ3VzdG9tRXZlbnQoJ2RhdGVTZWxlY3QnLCB7IGRhdGE6IGR5bmFtaWNEYXRhIH0pO1xuICAgICAgY29uZmlnLmNhbGVuZGFyQ29udGFpbmVyLmRpc3BhdGNoRXZlbnQoZXZ0KTtcbiAgICB9LCAyNTApXG4gIH1cbiAgXG4gIGNvbnN0IGNhbGVuZGFyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cbiAgdGhpcy5yZXR1cm5DYWxlbmRhciA9ICgpID0+IHtcbiAgICByZXR1cm4gY2FsZW5kYXI7XG4gIH07XG5cbiAgdGhpcy5yZXR1cm5EeW5hbWljRGF0YSA9ICgpID0+IHtcbiAgICByZXR1cm4gZHluYW1pY0RhdGE7XG4gIH07XG5cbiAgdGhpcy5yZXR1cm5Db25maWcgPSAoKSA9PiB7XG4gICAgcmV0dXJuIGNvbmZpZztcbiAgfTtcblxuICB0aGlzLnNldENvbmZpZyA9IChjb25maWdPYmopID0+IHtcbiAgICAvLyBJZiBjYWxsZWQgdmlhIEhUTUxcbiAgICBjb25maWcuY2FsZW5kYXJDb250YWluZXIgPSBjb25maWdPYmoudGFyZ2V0IHx8IGZhbHNlO1xuICAgIC8vIElmIGNhbGxlZCB2aWEgSmF2YXNjcmlwdFxuICAgIGNvbmZpZy5wYXJlbnREaXYgPSAodHlwZW9mIGNvbmZpZ09iai5wYXJlbnREaXYgPT09ICdzdHJpbmcnKSA/IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoY29uZmlnT2JqLnBhcmVudERpdikgOiBjb25maWdPYmoucGFyZW50RGl2O1xuICAgIC8vIGRvbmVcbiAgICBjb25maWcubnVtYmVyT2ZNb250aHNUb0Rpc3BsYXkgPSBjb25maWdPYmoubnVtYmVyT2ZNb250aHNUb0Rpc3BsYXkgfHwgMTI7XG4gICAgLy8gZG9uZVxuICAgIGNvbmZpZy5kaXNwbGF5VGltZUNob29zZXJNb2RhbCA9IGNvbmZpZ09iai5kaXNwbGF5VGltZUNob29zZXJNb2RhbCAmJiB0cnVlO1xuICAgIC8vIGRvbmVcbiAgICBjb25maWcuc2luZ2xlRGF0ZUNob2ljZSA9IGNvbmZpZ09iai5zaW5nbGVEYXRlQ2hvaWNlICYmIHRydWU7XG4gICAgLy8gZG9uZVxuICAgIGNvbmZpZy5zZWxlY3RSYW5nZSA9ICFjb25maWdPYmouc2luZ2xlRGF0ZUNob2ljZTtcbiAgICAvLyBkb25lXG4gICAgY29uZmlnLmxhbmd1YWdlID0gY29uZmlnT2JqLmxhbmd1YWdlIHx8ICdlbkdiJztcbiAgICAvLyBkb25lXG4gICAgY29uZmlnLnNlbGVjdE11bHRpcGxlID0gY29uZmlnLnNlbGVjdE11bHRpcGxlIHx8IGZhbHNlO1xuICAgIC8vIGRvbmVcbiAgICBjb25maWcuZGlzcGxheVRpbWVTZWxlY3Rpb25PbkRhdGUgPSBjb25maWdPYmouZGlzcGxheVRpbWVTZWxlY3Rpb25PbkRhdGUgfHwgdHJ1ZTtcbiAgICAvLyBkb25lXG4gICAgY29uZmlnLnByZWxvYWRlZERhdGVzID0gY29uZmlnT2JqLnByZWxvYWRlZERhdGVzIHx8IGZhbHNlO1xuXG4gICAgY29uZmlnLnByZWxvYWRlZFRvb2x0aXAgPSBjb25maWdPYmoucHJlbG9hZGVkVG9vbHRpcCB8fCBmYWxzZTtcblxuICAgIGNvbmZpZy5lbmRVc2VyID0gY29uZmlnT2JqLmVuZFVzZXIgfHwgZmFsc2U7XG4gICAgY29uZmlnLmVuZFVzZXJEdXJhdGlvbkNob2ljZSA9IGNvbmZpZ09iai5lbmRVc2VyRHVyYXRpb25DaG9pY2UgfHwgZmFsc2U7XG4gICAgY29uZmlnLmJhY2tlbmQgPSBjb25maWdPYmouYmFja2VuZCB8fCBmYWxzZTtcbiAgICBjb25maWcuZGlzcGxheUJsb2NrZWQgPSBjb25maWdPYmouZGlzcGxheUJsb2NrZWQgfHwgZmFsc2U7XG4gICAgY29uZmlnLmRhdGVzT3BlbiA9IGNvbmZpZ09iai5kYXRlc09wZW4gfHwgZmFsc2U7XG4gIH07XG5cbiAgdGhpcy5nZW5lcmF0ZUNhbGVuZGFyID0gKGNvbmZpZ09iaikgPT4ge1xuICAgIGNvbnNvbGUubG9nKEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoY29uZmlnT2JqKSkpO1xuICAgIGlmIChjb25maWdPYmopIHtcbiAgICAgIHRoaXMuc2V0Q29uZmlnKGNvbmZpZ09iaik7XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKGNvbmZpZ09iailcbiAgICBcbiAgICAvLyBJZiBjYWxsZWQgdmlhIGphdmFzY3JpcHQgYSBwYXJlbnRFbGVtZW50IG5lZWRzIHRvIGJlIHByb3ZpZGVkXG4gICAgY29uc3QgcGFyZW50RGl2ID0gY29uZmlnLnBhcmVudERpdjtcbiAgICAvKlxuICAgICAgSWYgY2FsbGVkIGZyb20gaHRtbCBhcyBhIGN1c3RvbSBjb21wb25lbnQgdGhlIGNvbXBvbmVudCBpdHNlbGYgaXMgcGFzc2VkIChjYWxlbmRhckNvbnRhaW5lcilcbiAgICAgIElmIGNhbGxlZCB2aWEgSlMgd2hpbGUgdGhlIGNvbXBvbmVudCBpc24ndCBhIHdlYmNvbXBvbmVudCBpbiB0aGUgc3RyaWN0ZXN0IHNlbnNlLCBpdCBzdGlsbFxuICAgICAgYmVoYXZlcyBsaWtlIG9uZSBhbmQgaXMgZW5jYXBzdWxhdGVkIGluIGEgc2hhZG93LlxuICAgICovXG4gICAgaWYgKGNvbmZpZy5jYWxlbmRhckNvbnRhaW5lcikge1xuICAgICAgc2hhZG93QXR0YWNoKGNvbmZpZy5jYWxlbmRhckNvbnRhaW5lcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5ld0NvbnRhaW5lcigpLnRoZW4oKGNvbnRhaW5lcikgPT4ge1xuICAgICAgICBzaGFkb3dBdHRhY2goY29udGFpbmVyKTtcbiAgICAgICAgY29uZmlnLmNhbGVuZGFyQ29udGFpbmVyID0gY29udGFpbmVyO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbmV3Q29udGFpbmVyICgpIHtcbiAgICAgIGNvbnN0IHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGNvbnN0IG5ld0NhbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBuZXdDYWwuY2xhc3NMaXN0LmFkZCgnc3dpZnQtY2FsJyk7XG4gICAgICAgIHBhcmVudERpdi5hcHBlbmRDaGlsZChuZXdDYWwpO1xuICAgICAgICByZXNvbHZlKG5ld0NhbCk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBwcm9taXNlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNoYWRvd0F0dGFjaCAoY29udGFpbmVyKSB7XG4gICAgICBjb25zdCBzaGFkb3dSb290ID0gY29udGFpbmVyLmF0dGFjaFNoYWRvdyh7IG1vZGU6ICdvcGVuJyB9KTtcbiAgICAgIGNvbnN0IGNzcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgICBjc3MudGV4dENvbnRlbnQgPSBzdHlsZTtcbiAgICAgIHNoYWRvd1Jvb3QuYXBwZW5kQ2hpbGQoY3NzKTtcbiAgICAgIHNoYWRvd1Jvb3QuYXBwZW5kQ2hpbGQoY2FsZW5kYXIpO1xuICAgIH1cblxuICAgIGNvbnN0IHByZWxvYWRlZERhdGVzID0gY29uZmlnLnByZWxvYWRlZERhdGVzO1xuICAgIGNvbnN0IG51bWJlck9mTW9udGhzVG9EaXNwbGF5ID0gY29uZmlnLm51bWJlck9mTW9udGhzVG9EaXNwbGF5O1xuICAgIGNvbnN0IGRhdGVzT3BlbiA9IGNvbmZpZy5kYXRlc09wZW47XG4gICAgY29uc3QgbGFuZ3VhZ2UgPSBjb25maWcubGFuZ3VhZ2U7XG4gICAgY29uc3QgZGlzcGxheVRpbWVDaG9vc2VyTW9kYWwgPSBjb25maWcuZGlzcGxheVRpbWVDaG9vc2VyTW9kYWw7XG4gICAgXG4gICAgLy8gVE9ETzpcbiAgICBjb25zdCBlbmRVc2VyID0gY29uZmlnLmVuZFVzZXI7XG4gICAgY29uc3QgZW5kVXNlckR1cmF0aW9uQ2hvaWNlID0gY29uZmlnLmVuZFVzZXJEdXJhdGlvbkNob2ljZTtcbiAgICBjb25zdCBiYWNrZW5kID0gY29uZmlnLmJhY2tlbmQ7XG4gICAgY29uc3QgZGlzcGxheUJsb2NrZWQgPSBjb25maWcuZGlzcGxheUJsb2NrZWQ7XG5cbiAgICBsZXQgdW5pcXVlRGF5SW5kZXggPSAwO1xuICAgIC8vIENhbGVuZGFyIGlzIGRlZmluZWQgZ2xvYmFsbHkgd2l0aGluIHRoZSBjb25zdHJ1Y3RvclxuICAgIGNvbnN0IGNhbGVuZGFyVW5pcXVlSWQgPSBnZW5lcmF0ZVJhbmRvbVN0cmluZygpO1xuICAgIGNhbGVuZGFyLmlkID0gYGNhbGVuZGFyLSR7Y2FsZW5kYXJVbmlxdWVJZH1gO1xuICAgIGNhbGVuZGFyLmNsYXNzTGlzdC5hZGQoJ2NhbGVuZGFyJyk7XG5cbiAgICBjb25zdCBtb250aHMgPSBbXTtcbiAgICBjb25zdCBkYXRlTm93ID0gbmV3IERhdGUoKTtcbiAgICBjb25zdCBlYXJsaWVzdERhdGUgPSAocHJlbG9hZGVkRGF0ZXMgJiYgcHJlbG9hZGVkRGF0ZXMuYm9va2VkKSA/IGdldEVhcmxpZXN0RGF0ZShwcmVsb2FkZWREYXRlcykgOiBkYXRlTm93O1xuICAgIGNvbnN0IHN0YXJ0TW9udGggPSBlYXJsaWVzdERhdGUuZ2V0TW9udGgoKTtcbiAgICBjb25zdCBtb250aE5hbWVzID0gbGFuZ3VhZ2VzW2xhbmd1YWdlXS5nZW5lcmFsVGltZS5tb250aHM7XG4gICAgLyogQ3JlYXRlIG1vbnRoIHZpZXcgKi9cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bWJlck9mTW9udGhzVG9EaXNwbGF5OyBpKyspIHtcbiAgICAgIC8qIE1vbnRoIHNwZWNpZmljIHZhcmlhYmxlcyBhbmQgdHJhY2tlcnMgKi9cbiAgICAgIGNvbnN0IHllYXJDYWxjID0gZWFybGllc3REYXRlLmFkZE1vbnRocyhpKS5nZXRGdWxsWWVhcigpO1xuICAgICAgY29uc3QgbW9udGhDYWxjID0gKHN0YXJ0TW9udGggKyBpKSAlIDEyO1xuICAgICAgY29uc3Qgc3RhcnREYXlPZk1vbnRoID0gbmV3IERhdGUoeWVhckNhbGMsIG1vbnRoQ2FsYykuZ2V0RGF5KCk7XG4gICAgICBjb25zdCBkYXlzSW5Nb250aCA9IGdldERheXNJbk1vbnRoKChzdGFydE1vbnRoICsgaSArIDEpICUgMTIsIGVhcmxpZXN0RGF0ZS5hZGRNb250aHMoaSkuZ2V0RnVsbFllYXIoKSk7XG4gICAgICBsZXQgY291bnQgPSAxO1xuICAgICAgbGV0IGRheW9md2VlayA9IDA7XG5cbiAgICAgIC8qIENyZWF0ZSBtb250aCBkaXYgKi9cbiAgICAgIGNvbnN0IG1vbnRoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBtb250aHMucHVzaChtb250aCk7XG4gICAgICBtb250aC5zdHlsZS53aWR0aCA9ICcxNWVtJztcbiAgICAgIG1vbnRoLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGNvbG91cnMubW9udGhCb3JkZXJDb2xvcjtcbiAgICAgIG1vbnRoLmNsYXNzTGlzdC5hZGQoJ21vbnRoJyk7XG4gICAgICBjYWxlbmRhci5hcHBlbmRDaGlsZChtb250aCk7XG5cbiAgICAgIC8qIENyZWF0ZSBtb250aCBuYW1lIGRpdiAobW9udGggWVlZWSkgYXQgdGhlIHRvcCBvZiBtb250aCBkaXNwbGF5ICovXG4gICAgICBjb25zdCBtb250aE5hbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIG1vbnRoTmFtZS5jbGFzc0xpc3QuYWRkKCdtb250aE5hbWUnKTtcbiAgICAgIG1vbnRoTmFtZS50ZXh0Q29udGVudCA9IGAke21vbnRoTmFtZXNbKHN0YXJ0TW9udGggKyBpKSAlIDEyXX0gJHtlYXJsaWVzdERhdGUuZ2V0RnVsbFllYXIoKX1gO1xuICAgICAgbW9udGguYXBwZW5kQ2hpbGQobW9udGhOYW1lKTtcblxuICAgICAgLyogQ3JlYXRlIGRpdiB3aXRoIG5hbWVkIGRheXMgb2YgdGhlIHdlZWsgKi9cbiAgICAgIGNvbnN0IGRheU5hbWVzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBtb250aC5hcHBlbmRDaGlsZChkYXlOYW1lcyk7XG4gICAgICBkYXlOYW1lcy5jbGFzc0xpc3QuYWRkKCd3ZWVrcm93Jyk7XG4gICAgICBsYW5ndWFnZXNbbGFuZ3VhZ2VdLmdlbmVyYWxUaW1lLmRheXNUcnVuY2F0ZWQuZm9yRWFjaCgoZGF5TmFtZSkgPT4ge1xuICAgICAgICBjb25zdCBkYXkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgZGF5LnRleHRDb250ZW50ID0gZGF5TmFtZTtcbiAgICAgICAgZGF5LmNsYXNzTGlzdC5hZGQoJ2RheU5hbWUnLCAnd2lkdGhTaGFwZURheXMnKTtcbiAgICAgICAgZGF5TmFtZXMuYXBwZW5kQ2hpbGQoZGF5KTtcbiAgICAgIH0pO1xuXG4gICAgICAvKiBDcmVhdGUgd2VlayByb3dzIGZpcnN0IHdlZWssIGl0J3MgcmVhc2lnbmVkIGYgKi9cbiAgICAgIGxldCB3ZWVrUm93O1xuICAgICAgZnVuY3Rpb24gbWFrZU5ld1dlZWtSb3cgKCkge1xuICAgICAgICB3ZWVrUm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIG1vbnRoLmFwcGVuZENoaWxkKHdlZWtSb3cpO1xuICAgICAgICB3ZWVrUm93LmNsYXNzTGlzdC5hZGQoJ3dlZWtyb3cnKTtcbiAgICAgICAgZGF5b2Z3ZWVrID0gMDtcbiAgICAgIH1cblxuICAgICAgLy8gNDIgZGF5cywgaS5lLiA2IHJvd3Mgb2YgN1xuICAgICAgZm9yIChsZXQgcCA9IDA7IHAgPCA0MjsgcCsrKSB7XG4gICAgICAgIGlmIChwID09PSAwKSB7XG4gICAgICAgICAgbWFrZU5ld1dlZWtSb3coKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocCA8IHN0YXJ0RGF5T2ZNb250aCkge1xuICAgICAgICAgIGNvbnN0IHBlZ2hvbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICBwZWdob2xlLmNsYXNzTGlzdC5hZGQoJ3dpZHRoU2hhcGUnLCAnZmlsbGVyJyk7XG4gICAgICAgICAgdW5zZWxlY3RlZFN0eWxlKHBlZ2hvbGUpO1xuICAgICAgICAgIHdlZWtSb3cuYXBwZW5kQ2hpbGQocGVnaG9sZSk7XG4gICAgICAgICAgZGF5b2Z3ZWVrKys7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocCA+PSBzdGFydERheU9mTW9udGggJiYgcCA8PSAoc3RhcnREYXlPZk1vbnRoICsgZGF5c0luTW9udGggLSAxKSkge1xuICAgICAgICAgIGNvbnN0IHBlZ2hvbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICBwZWdob2xlLnRleHRDb250ZW50ID0gY291bnQ7XG4gICAgICAgICAgcGVnaG9sZS5kYXRhc2V0LmRheSA9IGNvdW50O1xuICAgICAgICAgIHBlZ2hvbGUuZGF0YXNldC5kYXlvZndlZWsgPSBkYXlvZndlZWs7XG4gICAgICAgICAgcGVnaG9sZS5kYXRhc2V0LmRheWluZGV4ID0gdW5pcXVlRGF5SW5kZXg7XG4gICAgICAgICAgcGVnaG9sZS5jbGFzc0xpc3QuYWRkKCd3aWR0aFNoYXBlJywgJ2RheVRpbWUnKTtcbiAgICAgICAgICBwZWdob2xlLmRhdGFzZXQuaHVtYW5kYXRlID0gaHVtYW5EYXRlKGAke3llYXJDYWxjfS0ke21vbnRoQ2FsY30tJHtjb3VudH1gKTtcbiAgICAgICAgICAvLyBwZWdob2xlLmlkID0gYCR7eWVhckNhbGN9LSR7bW9udGhDYWxjfS0ke2NvdW50fWA7XG4gICAgICAgICAgcGVnaG9sZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICAgICAgICBkYXRlT25DbGlja0V2ZW50cyhlKTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHdlZWtSb3cuYXBwZW5kQ2hpbGQocGVnaG9sZSk7XG5cbiAgICAgICAgICBpZiAoaSA9PT0gMCAmJiBwID49IHN0YXJ0RGF5T2ZNb250aCAmJiBwIDwgKG5ldyBEYXRlKCkuZ2V0RGF0ZSgpICsgc3RhcnREYXlPZk1vbnRoKSkge1xuICAgICAgICAgICAgcGVnaG9sZS5jbGFzc0xpc3QuYWRkKCdmaWxsZXInKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb3VudCsrO1xuICAgICAgICAgIGRheW9md2VlaysrO1xuICAgICAgICAgIHVuaXF1ZURheUluZGV4Kys7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocCA+PSBkYXlzSW5Nb250aCArIHN0YXJ0RGF5T2ZNb250aCkge1xuICAgICAgICAgIGNvbnN0IHBlZ2hvbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICBwZWdob2xlLmNsYXNzTGlzdC5hZGQoJ3dpZHRoU2hhcGUnLCAnZmlsbGVyJyk7XG4gICAgICAgICAgd2Vla1Jvdy5hcHBlbmRDaGlsZChwZWdob2xlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgocCArIDEpICUgNyA9PT0gMCkge1xuICAgICAgICAgIG1ha2VOZXdXZWVrUm93KCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChpID09PSBudW1iZXJPZk1vbnRoc1RvRGlzcGxheSAtIDEpIHtcbiAgICAgICAgYmxvY2tEYXlzTm90T3BlbihjYWxlbmRhciwgZGF0ZXNPcGVuKTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gT3B0aW9uczpcbiAgICBpZihkaXNwbGF5VGltZUNob29zZXJNb2RhbCkge1xuICAgICAgdGltZUNob29zZXIgPSBuZXcgR2VuZXJhdGVUaW1lQ2hvb3Nlck1vZGFsKGNvbmZpZywgZHluYW1pY0RhdGEsIGNhbGVuZGFyKTtcbiAgICAgIHRpbWVDaG9vc2VyLmdlbmVyYXRlTW9kYWwoKTtcbiAgICB9XG4gICAgaWYocHJlbG9hZGVkRGF0ZXMpIHtcbiAgICAgIHByZWxvYWREYXRlcyhwcmVsb2FkZWREYXRlcyk7XG4gICAgfVxuICB9O1xuXG4gIGxldCBjbGlja0NvdW50ID0gMTtcblxuICBmdW5jdGlvbiBkYXRlT25DbGlja0V2ZW50cyAoZSkge1xuICBcbiAgICBjb25zdCBkYXRlRGl2ID0gZS50YXJnZXQ7XG4gICAgY2xpY2tDb3VudCsrO1xuXG4gICAgaWYgKGR5bmFtaWNEYXRhLmRpc2FibGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGRhdGVEaXYuY2xhc3NMaXN0LmNvbnRhaW5zKCdibG9ja2VkJykpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoY2FsZW5kYXIucXVlcnlTZWxlY3RvcignLm1ha2VUaW1lUnVsZUdsb2JhbCcpKSB7XG4gICAgICBjYWxlbmRhci5xdWVyeVNlbGVjdG9yKCcubWFrZVRpbWVSdWxlR2xvYmFsQ2xhc3MnKS50ZXh0Q29udGVudCA9IGZvcm1hdERheVRleHQoKTtcbiAgICB9XG5cbiAgICBpZiAoY29uZmlnLnNlbGVjdFJhbmdlKSB7XG4gICAgICBpZiAoY2xpY2tDb3VudCAlIDIgPT09IDApIHtcbiAgICAgICAgaWYgKGNvbmZpZy5zZWxlY3RNdWx0aXBsZSkge1xuICAgICAgICAgIGNsZWFyU2VsZWN0aW9uKGNhbGVuZGFyLCBkeW5hbWljRGF0YSk7XG4gICAgICAgIH1cbiAgICAgICAgYm9va0RhdGVzKFtkYXRlRGl2XSk7XG4gICAgICB9XG4gICAgICBpZiAoY2xpY2tDb3VudCAlIDIgPT09IDEpIHtcbiAgICAgICAgYm9va0RhdGVzKFtkYXRlRGl2XSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGNvbmZpZy5zaW5nbGVEYXRlQ2hvaWNlKSB7XG4gICAgICBjbGVhclNlbGVjdGlvbihjYWxlbmRhciwgZHluYW1pY0RhdGEpO1xuICAgICAgYm9va0RhdGVzKFtkYXRlRGl2XSk7XG4gICAgfVxuICAgIC8qXG4gICAgaWYgKCFkYXRlc0luZGV4LmluY2x1ZGVzKGRhdGVEaXYuZGF0YXNldC5odW1hbmRhdGUpKSB7XG4gICAgICBjb25zdCBtYWtlVGltZVJ1bGVHbG9iYWwgPSBjYWxlbmRhci5xdWVyeVNlbGVjdG9yKCcudGltZUNob29zZXInKT8ucXVlcnlTZWxlY3RvcignLm1ha2VUaW1lUnVsZUdsb2JhbCcpO1xuICAgICAgaWYgKG1ha2VUaW1lUnVsZUdsb2JhbD8uY2hlY2tlZCA9PT0gdHJ1ZSkge1xuICAgICAgICBib29rRGF5T2ZXZWVrRyhkYXRlLCBudWxsKTtcbiAgICAgIH1cbiAgICB9XG4gICAgKi9cbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IHNlbGVjdGlvbiBpbiB0aGUgZHluYW1pY0RhdGEgb2JqZWN0LlxuICAgKlxuICAgKiBAcmV0dXJuIHtvYmplY3R9IEFuIG9iamVjdCBjb250YWluaW5nIHRoZSB0cmFja2luZyBhcnJheSBcIm5ld0FycmF5XCIgYW5kIG9iamVjdHMgYXJyYXkuXG4gICAqL1xuICBmdW5jdGlvbiBjcmVhdGVOZXdTZWxlY3Rpb24gKCkge1xuICAgIGNvbnN0IHBhcmVudEFyID0gZHluYW1pY0RhdGEuZGF0ZXNTZWxlY3RlZEFycmF5O1xuICAgIGNvbnN0IHBhcmVudEFyT2JqID0gZHluYW1pY0RhdGEuZGF0ZXNTZWxlY3RlZEFycmF5T2JqZWN0cztcbiAgICBsZXQgbmV3QXJyYXksIG5ld09iamVjdHNBcnJheTtcblxuICAgIG5ld0FycmF5ID0gcGFyZW50QXJbcGFyZW50QXIubGVuZ3RoIC0gMV07XG4gICAgaWYgKGNvbmZpZy5zZWxlY3RSYW5nZSAmJiBuZXdBcnJheSAmJiBuZXdBcnJheS5sZW5ndGggPT09IDEpIHtcbiAgICAgIG5ld09iamVjdHNBcnJheSA9IHBhcmVudEFyT2JqW3BhcmVudEFyT2JqLmxlbmd0aCAtIDFdO1xuICAgICAgcmV0dXJuIHsgbmV3QXJyYXksIG5ld09iamVjdHNBcnJheSB9O1xuICAgIH1cblxuICAgIG5ld0FycmF5ID0gW107XG4gICAgbmV3T2JqZWN0c0FycmF5ID0gW107XG4gICAgcGFyZW50QXIucHVzaChuZXdBcnJheSk7XG4gICAgcGFyZW50QXJPYmoucHVzaChuZXdPYmplY3RzQXJyYXkpO1xuICAgIHJldHVybiB7IG5ld0FycmF5LCBuZXdPYmplY3RzQXJyYXkgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSYW5nZSBzZWxlY3RcbiAgICogQGRlc2NyaXB0aW9uIEFsbG93cyBhIHJhbmdlIG9mIGRhdGVzIHRvIGJlIHNlbGVjdGVkXG4gICAqIEBmdW5jdGlvbiBib29rRGF0ZXNcbiAgICogQHBhcmFtIGRhdGVzIGFycmF5XG4gICAqIEB0b2RvIGFsbG93IHJhbmdlIHNlbGVjdCB0byB3b3JrIHdpdGggdGltZSB2YWx1ZXMuXG4gICAqIEBmaXJlcyBib29rRGF5IGZvciBlYWNoIGRheSBpbiBhIHJhbmdlXG4gICAqL1xuICBmdW5jdGlvbiBib29rRGF0ZXMgKGFycmF5T2ZEYXRlRGl2cykge1xuICAgIGNvbnN0IHsgbmV3QXJyYXksIG5ld09iamVjdHNBcnJheSB9ID0gY3JlYXRlTmV3U2VsZWN0aW9uKCk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnJheU9mRGF0ZURpdnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGRhdGVEaXYgPSBhcnJheU9mRGF0ZURpdnNbaV07XG4gICAgICBmaW5kRGF0ZVNlbGVjdGlvbihkYXRlRGl2KTtcbiAgICAgIGJvb2tEYXkoZGF0ZURpdik7XG4gICAgfVxuXG4gICAgLy8gaWYgdGhlIGRhdGUgaXMgaW4gYSBwcmV2aW91cyBzZWxlY3Rpb24sIHRoYXQgc2VsZWN0aW9uIGlzIHNwbGljZWRcbiAgICBmdW5jdGlvbiBmaW5kRGF0ZVNlbGVjdGlvbiAoZGF0ZSkge1xuICAgICAgLy8gY29uc29sZS5sb2coZGF0ZSk7XG4gICAgICBjb25zdCBzdG9yZSA9IGR5bmFtaWNEYXRhLmRhdGVzU2VsZWN0ZWRBcnJheU9iamVjdHM7XG4gICAgICBmb3IobGV0IGogPSAwOyBqIDwgc3RvcmUubGVuZ3RoOyBqKyspe1xuICAgICAgICAvLyB0aGUgYXJyYXkgaW4gcXVlc3Rpb25cbiAgICAgICAgY29uc3Qgc2luZ2xlU2VsZWN0aW9uID0gc3RvcmVbal07XG4gICAgICAgIC8vIGRhdGEgYXR0ciBvZiBodG1sIGVsZW1lbnRcbiAgICAgICAgY29uc3QgZGF0ZVZhbHVlID0gZGF0ZS5kYXRhc2V0Lmh1bWFuZGF0ZTtcbiAgICAgICAgY29uc3Qgc2VhcmNoID0gKCkgPT4gc2luZ2xlU2VsZWN0aW9uLmZpbmQoIChkYXRlU3RvcmVkKSA9PiBkYXRlU3RvcmVkLmh1bWFuZGF0ZSA9PT0gZGF0ZVZhbHVlKTtcbiAgICAgICAgaWYoc2VhcmNoKCkpIHtcbiAgICAgICAgICBzaW5nbGVTZWxlY3Rpb24uZm9yRWFjaCgoZGF0ZSkgPT4ge1xuICAgICAgICAgICAgLy8gcmVtb3ZlIHNlbGVjdGlvbiBjb2xvdXJcbiAgICAgICAgICAgIHVuc2VsZWN0ZWRTdHlsZShjYWxlbmRhci5xdWVyeVNlbGVjdG9yKGBbZGF0YS1odW1hbmRhdGU9JyR7ZGF0ZS5odW1hbmRhdGV9J11gKSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgLy8gcmVtb3ZlIGZyb20gc3RvcmFnZVxuICAgICAgICAgIGR5bmFtaWNEYXRhLmRhdGVzU2VsZWN0ZWRBcnJheU9iamVjdHMuc3BsaWNlKGosIDEpO1xuICAgICAgICAgIGR5bmFtaWNEYXRhLmRhdGVzU2VsZWN0ZWRBcnJheS5zcGxpY2UoaiwgMSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBzdGFydERhdGUgPSBuZXdPYmplY3RzQXJyYXlbMF07XG4gICAgY29uc3Qgc3RhcnRJbmRleCA9IHN0YXJ0RGF0ZS5pbmRleDtcbiAgICAvLyBpZiBhIHNpbmdsZSBkYXRlIGlzIHNlbGVjdGVkOlxuICAgIGNvbnN0IGVuZERhdGUgPSBuZXdPYmplY3RzQXJyYXlbMV0gfHwgc3RhcnREYXRlO1xuICAgIGNvbnN0IGVuZEluZGV4ID0gZW5kRGF0ZS5pbmRleDtcblxuICAgIGlmIChjb25maWcuc2VsZWN0UmFuZ2UpIHtcbiAgICAgIGNvbnN0IFtsb3csIGhpZ2hdID0gW3BhcnNlSW50KHN0YXJ0SW5kZXgpLCBwYXJzZUludChlbmRJbmRleCldLnNvcnQoKGEsIGIpID0+IGEgLSBiKTtcbiAgICAgIGZvciAobGV0IGkgPSBsb3c7IGkgPD0gaGlnaDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGRhdGVEaXYgPSBjYWxlbmRhci5xdWVyeVNlbGVjdG9yKGBbZGF0YS1kYXlpbmRleD0nJHtpfSddYCk7XG4gICAgICAgIGlmIChkYXRlRGl2LmNsYXNzTGlzdC5jb250YWlucygnYmxvY2tlZCcpKSB7XG4gICAgICAgICAgdW5zZWxlY3RlZFN0eWxlKGNhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoYFtpZD0nJHtlbmREYXRlfSddYCkpO1xuICAgICAgICAgIG5ld0FycmF5LnNwbGljZSgxLCAxKTtcbiAgICAgICAgICBuZXdPYmplY3RzQXJyYXkuc3BsaWNlKDEsIDEpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGJvb2tEYXkoZGF0ZURpdik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYm9va0RheSAoZGF0ZURpdikge1xuICAgICAgaWYgKGNvbmZpZy5zaW5nbGVEYXRlQ2hvaWNlICYmIG5ld0FycmF5Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgY2xlYXJTZWxlY3Rpb24oY2FsZW5kYXIsIGR5bmFtaWNEYXRhKTtcbiAgICAgIH1cbiAgICAgIGlmIChuZXdBcnJheS5pbmNsdWRlcyhkYXRlRGl2LmRhdGFzZXQuaHVtYW5kYXRlKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgc2VsZWN0ZWRTdHlsZShkYXRlRGl2KTtcbiAgICAgICAgbmV3QXJyYXkucHVzaChkYXRlRGl2LmRhdGFzZXQuaHVtYW5kYXRlKTtcbiAgICAgICAgbmV3T2JqZWN0c0FycmF5W25ld0FycmF5Lmxlbmd0aCAtIDFdID0gc3RhbmRhcmREYXRlT2JqZWN0KGRhdGVEaXYpO1xuICAgICAgfVxuICAgICAgaWYgKGNvbmZpZy5zaW5nbGVEYXRlQ2hvaWNlICYmIGNvbmZpZy5kaXNwbGF5VGltZUNob29zZXJNb2RhbCkge1xuICAgICAgICB0aW1lQ2hvb3Nlci5zaG93KCk7XG4gICAgICB9XG4gICAgICAvLyB0aW1lIHBpY2tlciBmb3IgbXVsdGlwbGUgY29uc2VjdXRpdmUgZGF0ZXMuXG4gICAgICBpZiAoY29uZmlnLmRpc3BsYXlUaW1lQ2hvb3Nlck1vZGFsICYmIHN0YXJ0RGF0ZSAhPT0gZW5kRGF0ZSkge1xuICAgICAgICB0aW1lQ2hvb3Nlci5zaG93KCk7XG4gICAgICB9XG4gICAgICAvLyB0aW1lIHBpY2tlciBmbyBzaW5nbGUgZGF0ZTpcbiAgICAgIGlmIChjb25maWcuZGlzcGxheVRpbWVDaG9vc2VyTW9kYWwgJiYgY29uZmlnLnNpbmdsZURhdGVDaG9pY2UpIHtcbiAgICAgICAgdGltZUNob29zZXIuc2hvdygpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHByZWxvYWREYXRlcyAocHJlbG9hZGVkRGF0ZXMpIHtcbiAgICBcbiAgICBmdW5jdGlvbiBnZXREaXZzIChkYXRlcykge1xuICAgICAgY29uc3QgZGF0ZURpdnMgPSBbXTtcbiAgICAgIGNvbnN0IHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGRhdGVzLmZvckVhY2goKGRhdGUsIGkpID0+IHtcbiAgICAgICAgICBjb25zdCBkYXRlRGl2ID0gY2FsZW5kYXIucXVlcnlTZWxlY3RvcihgW2RhdGEtaHVtYW5kYXRlPScke2RhdGV9J11gKTtcbiAgICAgICAgICBjb25zb2xlLmxvZyhkYXRlRGl2KTtcbiAgICAgICAgICBjb25zb2xlLmxvZyhgW2RhdGEtaHVtYW5kYXRlPScke2RhdGV9J11gKTtcbiAgICAgICAgICBkYXRlRGl2cy5wdXNoKGRhdGVEaXYpO1xuICAgICAgICAgIGlmIChpID09PSBwcmVsb2FkZWREYXRlcy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICBibG9ja05vdFByZWxvYWRlZERhdGVzIChkYXRlRGl2cyk7XG4gICAgICAgICAgICByZXNvbHZlKGRhdGVEaXZzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9KTtcbiAgICAgIHJldHVybiBwcm9taXNlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGJsb2NrTm90UHJlbG9hZGVkRGF0ZXMgKGRhdGVEaXZzKSB7XG4gICAgICBjb25zdCBub25PcHRpb25zID0gY2FsZW5kYXIucXVlcnlTZWxlY3RvckFsbCgnLmRheVRpbWUnKTtcbiAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBub25PcHRpb25zLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICBjb25zdCBkYXkgPSBub25PcHRpb25zW2luZGV4XTtcbiAgICAgICAgaWYoIWRhdGVEaXZzLmluY2x1ZGVzKGRheSkpe1xuICAgICAgICAgIGRheS5jbGFzc0xpc3QuYWRkKCdmaWxsZXInKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBkYXkuY2xhc3NMaXN0LmFkZCgncHJlbG9hZGVkJyk7XG4gICAgICAgICAgZGF5LnRpdGxlID0gY29uZmlnLnByZWxvYWRlZFRvb2x0aXA7XG4gICAgICAgIH0gXG4gICAgICB9XG4gICAgfVxuXG4gICAgZ2V0RGl2cyhwcmVsb2FkZWREYXRlcykudGhlbigoZGF0ZURpdnMpID0+IHtcbiAgICAgIC8vIGJvb2tEYXRlcyhkYXRlRGl2cyk7XG4gICAgfSlcblxuICB9ICAgXG5cblxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgc3RhbmRhcmQgZGF0ZSBvYmplY3Qgd2l0aCB0aGUgZ2l2ZW4gZGF0ZS5cbiAgICpcbiAgICogQHBhcmFtIHthbnl9IGRhdGUgLSBJcyBhIHN0cmluZyBZWVlZLU1NLUREIG1vbnRocyBhcmUgY291bnRlZCBmcm9tIDAuXG4gICAqIEByZXR1cm4ge29iamVjdH0gVGhlIHN0YW5kYXJkIGRhdGUgb2JqZWN0IHdpdGggdGhlIGdpdmVuIGRhdGUuXG4gICAqL1xuICBmdW5jdGlvbiBzdGFuZGFyZERhdGVPYmplY3QgKGRhdGUpIHtcbiAgICBjb25zdCB0aW1lcyA9ICh0aW1lQ2hvb3NlcikgPyB0aW1lQ2hvb3Nlci5nZXRTZWxlY3RlZFRpbWVzKCkgOiBbXVxuICAgIGNvbnN0IG9iaiA9IHtcbiAgICAgIGRheTogZGF0ZS5kYXRhc2V0LmRheSxcbiAgICAgIGh1bWFuZGF0ZTogZGF0ZS5kYXRhc2V0Lmh1bWFuZGF0ZSxcbiAgICAgIGluZGV4OiBkYXRlLmRhdGFzZXQuZGF5aW5kZXgsXG4gICAgICB0aW1lczogdGltZXNcbiAgICB9OyBcbiAgICByZXR1cm4gb2JqO1xuICB9XG59XG5cbmV4cG9ydCB7IFN3aWZ0Q2FsIH07XG4iLCJpbXBvcnQgeyBsYW5ndWFnZXMgfSBmcm9tICcuL2xhbmd1YWdlcy5qcyc7XG5cbi8qKlxuICogR2VuZXJhdGVzIGEgdGltZSBjaG9vc2VyIG1vZGFsIGZvciBzZWxlY3RpbmcgdGltZS4gQ2FsbGVkIGluIGNhbGVuZGFyR2VuZXJhdG9yLmpzXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZyAtIFRoZSBjb25maWd1cmF0aW9uIG9iamVjdC4gXG4gKiBAcGFyYW0ge09iamVjdH0gZHluYW1pY0RhdGEgLSBUaGUgZHluYW1pYyBkYXRhIG9iamVjdC5cbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGNhbGVuZGFyIC0gVGhlIGNhbGVuZGFyIGVsZW1lbnQuXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn0gVGhlIGdlbmVyYXRlZCB0aW1lIGNob29zZXIgbW9kYWwuXG4gKi9cbmZ1bmN0aW9uIEdlbmVyYXRlVGltZUNob29zZXJNb2RhbCAoY29uZmlnLCBkeW5hbWljRGF0YSwgY2FsZW5kYXIpIHtcblxuICAvKipcbiAgICogQSBjdXN0b20gZXZlbnQgZW1pdHRlZCB3aGVuIGEgdGltZSBpcyBhZGRlZCBvciBzZWxlY3RlZFxuICAgKlxuICAgKiBAcmV0dXJuIHt2b2lkfSBUaGlzIGZ1bmN0aW9uIGRvZXMgbm90IHJldHVybiBhbnkgdmFsdWUuXG4gICAqL1xuICBmdW5jdGlvbiBlbWl0VGltZVNlbGVjdGVkRXZlbnQgKCkge1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgY29uc3QgZXZ0ID0gbmV3IEN1c3RvbUV2ZW50KCd0aW1lU2VsZWN0JywgeyBkYXRhOiBkeW5hbWljRGF0YSB9KTtcbiAgICAgIGNvbmZpZy5jYWxlbmRhckNvbnRhaW5lci5kaXNwYXRjaEV2ZW50KGV2dCk7XG4gICAgfSwgMjUwKVxuICB9XG5cbiAgbGV0IHRpbWVDaG9vc2VyTW9kYWw7XG5cbiAgbGV0IHNlbGVjdGlvbiA9IFtdO1xuXG4gIHRoaXMuZ2V0U2VsZWN0ZWRUaW1lcyA9ICgpID0+IHtcbiAgICByZXR1cm4gc2VsZWN0aW9uO1xuICB9XG4gIFxuICB0aGlzLmdlbmVyYXRlTW9kYWwgPSAoKSA9PiB7XG4gICAgcmV0dXJuIGdlbmVyYXRlTW9kYWwoKTtcbiAgfVxuXG4gIHRoaXMuc2hvdyA9ICgpID0+IHtcbiAgICBjYWxlbmRhci5zdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nO1xuICAgIHJldHVybiB0aW1lQ2hvb3Nlck1vZGFsLnNob3coKTtcbiAgfVxuXG4gIHRoaXMud3JpdGVUb0RhdGVEaXYgPSAgKCkgPT4ge1xuICAgIHdyaXRlVG9EYXRlRGl2KCk7XG4gIH1cblxuLyoqXG4gKiBHZW5lcmF0ZXMgYSBkaWFsb2cgZm9yIGNob29zaW5nIHRpbWUuXG4gKlxuICogQHJldHVybiB7UHJvbWlzZX0gQSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgdG8gdGhlIGdlbmVyYXRlZCB0aW1lIGNob29zZXIgbW9kYWwuXG4gKi9cbiAgZnVuY3Rpb24gZ2VuZXJhdGVNb2RhbCgpIHtcbiAgICBjb25zdCBwcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXG4gICAgICB0aW1lQ2hvb3Nlck1vZGFsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGlhbG9nJyk7XG4gICAgICB0aW1lQ2hvb3Nlck1vZGFsLmNsYXNzTGlzdC5hZGQoJ3RpbWVDaG9vc2VyTW9kYWwnKTtcbiAgICAgIGNhbGVuZGFyLmFwcGVuZENoaWxkKHRpbWVDaG9vc2VyTW9kYWwpO1xuICBcbiAgICAgIGNvbnN0IHRpbWVDb250ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICB0aW1lQ29udC5jbGFzc0xpc3QuYWRkKCd0aW1lQ29udCcpO1xuICAgICAgdGltZUNob29zZXJNb2RhbC5hcHBlbmRDaGlsZCh0aW1lQ29udCk7XG4gIFxuICAgICAgY29uc3QgdGltZUNob29zZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIHRpbWVDaG9vc2VyLmNsYXNzTGlzdC5hZGQoJ3RpbWVDaG9vc2VyJyk7XG4gICAgICB0aW1lQ29udC5hcHBlbmRDaGlsZCh0aW1lQ2hvb3Nlcik7XG4gIFxuICAgICAgY29uc3QgY29udHJvbHNEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGNvbnRyb2xzRGl2LmNsYXNzTGlzdC5hZGQoJ2RlbGV0ZURpdicpO1xuICAgICAgdGltZUNob29zZXIuYXBwZW5kQ2hpbGQoY29udHJvbHNEaXYpO1xuICBcbiAgICAgIGZ1bmN0aW9uIGNsb3NlRm4gKCkge1xuICAgICAgICBjYWxlbmRhci5zdHlsZS5vdmVyZmxvdyA9ICdzY3JvbGwnO1xuICAgICAgICB0aW1lQ2hvb3Nlck1vZGFsLmNsb3NlKCk7XG4gICAgICB9XG4gICAgICBtYWtlQnV0dG9uKGNvbnRyb2xzRGl2LCAnZGVsZXRlQnV0dG9uJywgJ3gnLCAnY2xvc2UnLCAnY2xpY2snLCBjbG9zZUZuKTtcbiAgXG4gICAgICBmdW5jdGlvbiBpbm5lckNvbXBvbmVudHMgKCkge1xuICAgICAgICBjb25zdCB0aW1lUGlja2VyQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIHRpbWVQaWNrZXJDb250YWluZXIuY2xhc3NMaXN0LmFkZCgndGltZVBpY2tlckNvbnRhaW5lcicpO1xuICAgICAgICB0aW1lQ2hvb3Nlci5hcHBlbmRDaGlsZCh0aW1lUGlja2VyQ29udGFpbmVyKTtcbiAgICAgICAgY29uc3QgdGl0bGVEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgdGl0bGVEaXYudGV4dENvbnRlbnQgPSBsYW5ndWFnZXNbY29uZmlnLmxhbmd1YWdlXS50aW1lV2lkZ2V0LmFkZFRpbWU7XG4gICAgICAgIHRpdGxlRGl2LmNsYXNzTGlzdC5hZGQoJ2RlbGV0ZURpdicpO1xuICAgICAgICB0aW1lUGlja2VyQ29udGFpbmVyLmFwcGVuZENoaWxkKHRpdGxlRGl2KTtcbiAgICAgICAgbWFrZURyb3BEb3ducyhsYW5ndWFnZXNbY29uZmlnLmxhbmd1YWdlXS50aW1lV2lkZ2V0LnN0YXJ0LCB0aW1lUGlja2VyQ29udGFpbmVyKTtcbiAgICAgICAgbWFrZURyb3BEb3ducyhsYW5ndWFnZXNbY29uZmlnLmxhbmd1YWdlXS50aW1lV2lkZ2V0LmVuZCwgdGltZVBpY2tlckNvbnRhaW5lcik7XG4gICAgICB9XG4gICAgICBtYWtlQnV0dG9uKGNvbnRyb2xzRGl2LCAnZGVsZXRlQnV0dG9uJywgJysnLCAnYWRkIHRpbWUnLCAnY2xpY2snLCBpbm5lckNvbXBvbmVudHMpO1xuICAgICAgbWFrZUJ1dHRvbihjb250cm9sc0RpdiwgJ2RlbGV0ZUJ1dHRvbicsICctJywgJ3JlbW92ZSB0aW1lJywgJ2NsaWNrJywgcmVtb3ZlVGltZVZhbHVlc09uRGF0ZSk7XG4gICAgICByZXNvbHZlKHRpbWVDaG9vc2VyTW9kYWwpO1xuICAgIH0pO1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG5cbiAgZnVuY3Rpb24gd3JpdGVUb0RhdGVEaXYgKCkge1xuICAgIGlmIChjb25maWcuZGlzcGxheVRpbWVTZWxlY3Rpb25PbkRhdGUpIHtcbiAgICAgIGR5bmFtaWNEYXRhLmRhdGVzU2VsZWN0ZWRBcnJheS5mb3JFYWNoKChjaGlsZEFycmF5KSA9PiB7XG4gICAgICAgIGNoaWxkQXJyYXkuZm9yRWFjaCgoZGF5U2VsZWN0ZWQpID0+IHtcbiAgICAgICAgICB3cml0ZShkYXlTZWxlY3RlZCk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gIFxuICAgICAgLy8gY29udGFpbnMgYSB0aW1lIGR1cmF0aW9uIGNob2ljZVxuICAgICAgbGV0IGNhbGVuZGFyVGltZVBhcmVudDtcbiAgXG4gICAgICBmdW5jdGlvbiB3cml0ZSAoZGF0ZSkge1xuICAgICAgICBjb25zdCBkYXlEaXYgPSBjYWxlbmRhci5xdWVyeVNlbGVjdG9yKGBbZGF0YS1odW1hbmRhdGU9JyR7ZGF0ZX0nXWApO1xuICAgICAgICB3aGlsZSAoZGF5RGl2LmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBkYXlEaXYucmVtb3ZlQ2hpbGQoZGF5RGl2Lmxhc3RDaGlsZCk7XG4gICAgICAgIH1cbiAgXG4gICAgICAgIGZ1bmN0aW9uIGNyZWF0ZU5ld1BhcmEgKHRleHQpIHtcbiAgICAgICAgICBjb25zdCB0aW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgICAgICAgIGNhbGVuZGFyVGltZVBhcmVudC5hcHBlbmRDaGlsZCh0aW1lKTtcbiAgICAgICAgICB0aW1lLmNsYXNzTGlzdC5hZGQoJ2NhbGVuZGFyVGltZScpO1xuICAgICAgICAgIHRpbWUudGV4dENvbnRlbnQgPSB0ZXh0O1xuICAgICAgICB9XG4gIFxuICAgICAgICBzZWxlY3Rpb24uZm9yRWFjaCgodGltZVZhbHVlLCBpKSA9PiB7XG4gICAgICAgICAgaWYgKGkgPT09IDAgfHwgaSAlIDIgPT09IDApIHtcbiAgICAgICAgICAgIGNhbGVuZGFyVGltZVBhcmVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgY2FsZW5kYXJUaW1lUGFyZW50LmNsYXNzTGlzdC5hZGQoJ2NhbGVuZGFyVGltZVBhcmVudCcpO1xuICAgICAgICAgICAgZGF5RGl2LmFwcGVuZENoaWxkKGNhbGVuZGFyVGltZVBhcmVudCk7XG4gICAgICAgICAgfVxuICBcbiAgICAgICAgICBjb25zdCBmaWVsZE5hbWUgPSBPYmplY3Qua2V5cyh0aW1lVmFsdWUpWzBdO1xuICAgICAgICAgIGNyZWF0ZU5ld1BhcmEoYCR7ZmllbGROYW1lfTpgKTtcbiAgICAgICAgICBjcmVhdGVOZXdQYXJhKGAke3RpbWVWYWx1ZVtmaWVsZE5hbWVdLmhofToke3RpbWVWYWx1ZVtmaWVsZE5hbWVdLm1tfWApO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBtYWtlQnV0dG9uIChwYXJlbnQsIGNsYXNzTmFtZSwgdGV4dENvbnRlbnQsIGhvdmVyVGV4dCwgYWN0aW9uLCBmbikge1xuICAgIGNvbnN0IGJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSk7XG4gICAgYnV0dG9uLnRleHRDb250ZW50ID0gdGV4dENvbnRlbnQ7XG4gICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoYWN0aW9uLCAoZSkgPT4ge1xuICAgICAgZm4oKTtcbiAgICB9KTtcbiAgICBwYXJlbnQuYXBwZW5kQ2hpbGQoYnV0dG9uKTtcbiAgfVxuICBcbiAgZnVuY3Rpb24gbWFrZURyb3BEb3ducyAoY29udGV4dFRleHQsIHRpbWVQaWNrZXJDb250YWluZXIpIHtcbiAgICAvLyBUaGUgdGltZSBjb250YWluZXJcbiAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBjb250YWluZXIuY2xhc3NMaXN0LmFkZCgndGltZUNvbnRhaW5lcicpO1xuICAgIGNvbnRhaW5lci5kYXRhc2V0LmNvbnRleHQgPSBjb250ZXh0VGV4dDtcbiAgICB0aW1lUGlja2VyQ29udGFpbmVyLmFwcGVuZENoaWxkKGNvbnRhaW5lcik7XG4gIFxuICAgIGNvbnN0IHRpbWVGb3JDb250ZXh0ID0geyBbY29udGV4dFRleHRdOiB7fSB9O1xuICBcbiAgICBzZWxlY3Rpb24ucHVzaCh0aW1lRm9yQ29udGV4dCk7XG4gIFxuICAgIC8vIE1ha2UgbGFiZWxcbiAgICBjb25zdCBsYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICBsYWJlbC5jbGFzc0xpc3QuYWRkKCd0aW1lU2VsZWN0UCcpO1xuICAgIGxhYmVsLnRleHRDb250ZW50ID0gYCR7Y29udGV4dFRleHR9OmA7XG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGxhYmVsKTtcbiAgXG4gICAgLy8gTWFrZSBob3VyIHNlbGVjdG9yXG4gICAgY29uc3QgdGltZVNlbGVjdG9yRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdGltZVNlbGVjdG9yRGl2LmRhdGFzZXQuY29udGV4dCA9IGNvbnRleHRUZXh0O1xuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aW1lU2VsZWN0b3JEaXYpO1xuICBcbiAgICBtYWtlU2VsZWN0b3IoJ2hoJywgMjMsIHRpbWVTZWxlY3RvckRpdiwgY29udGV4dFRleHQsIHRpbWVQaWNrZXJDb250YWluZXIsIHRpbWVGb3JDb250ZXh0KTtcbiAgICBtYWtlU2VsZWN0b3IoJ21tJywgNTksIHRpbWVTZWxlY3RvckRpdiwgY29udGV4dFRleHQsIHRpbWVQaWNrZXJDb250YWluZXIsIHRpbWVGb3JDb250ZXh0KTtcbiAgfVxuICBcbiAgZnVuY3Rpb24gbWFrZVNlbGVjdG9yICh0eXBlLCBsaW1pdCwgdGltZVNlbGVjdG9yRGl2LCBjb250ZXh0VGV4dCwgdGltZVBpY2tlckNvbnRhaW5lciwgdGltZUZvckNvbnRleHQpIHtcbiAgICBjb25zdCBkcm9wRG93biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NlbGVjdCcpO1xuICAgIGRyb3BEb3duLmNsYXNzTGlzdC5hZGQodHlwZSwgJ3RpbWVTZWxlY3QnKTtcbiAgICB0aW1lU2VsZWN0b3JEaXYuYXBwZW5kQ2hpbGQoZHJvcERvd24pO1xuICBcbiAgICBkcm9wRG93bi5kYXRhc2V0LnR5cGUgPSB0eXBlO1xuICAgIGRyb3BEb3duLmRhdGFzZXQuY29udGV4dCA9IGNvbnRleHRUZXh0O1xuICBcbiAgICBjb25zdCBwbGFjZWhvbGRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuICAgIHBsYWNlaG9sZGVyLnRleHRDb250ZW50ID0gdHlwZTtcbiAgICBwbGFjZWhvbGRlci52YWx1ZSA9ICcwMCc7XG4gIFxuICAgIC8vIHtcIlN0YXJ0XCI6e1wiaGhcIjpcIjAwXCJ9fSx7XCJTdGFydFwiOntcIm1tXCI6XCIwMFwifX1cbiAgICB0aW1lRm9yQ29udGV4dFtjb250ZXh0VGV4dF1bdHlwZV0gPSBwbGFjZWhvbGRlci52YWx1ZTtcbiAgICAvLyB7W3R5cGVdOiBwbGFjZWhvbGRlci52YWx1ZX1cbiAgICBkcm9wRG93bi5hcHBlbmRDaGlsZChwbGFjZWhvbGRlcik7XG4gIFxuICAgIGxldCBpID0gMDtcbiAgICB3aGlsZSAoaSA8PSBsaW1pdCkge1xuICAgICAgY29uc3QgaG91ciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuICAgICAgbGV0IHRleHQgPSBpLnRvU3RyaW5nKCk7XG4gICAgICBpZiAodGV4dC5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgdGV4dCA9IGAwJHtpfWA7XG4gICAgICB9XG4gICAgICBob3VyLnZhbHVlID0gdGV4dDtcbiAgICAgIGhvdXIudGV4dENvbnRlbnQgPSB0ZXh0O1xuICAgICAgZHJvcERvd24uYXBwZW5kQ2hpbGQoaG91cik7XG4gICAgICBpKys7XG4gICAgfVxuICBcbiAgICBkcm9wRG93bi5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoc2VsZWN0ZWQpID0+IHtcbiAgICAgIHRpbWVGb3JDb250ZXh0W2NvbnRleHRUZXh0XVt0eXBlXSA9IGRyb3BEb3duLnZhbHVlO1xuICAgICAgd3JpdGVUb0RhdGVEaXYoKTtcbiAgICAgIGVtaXRUaW1lU2VsZWN0ZWRFdmVudCgpO1xuICAgIH0pO1xuICB9XG4gIFxuICBmdW5jdGlvbiByZW1vdmVUaW1lVmFsdWVzT25EYXRlICgpIHtcbiAgICBjb25zdCBkID0gZHluYW1pY0RhdGEuZGF0ZXNTZWxlY3RlZEFycmF5T2JqZWN0cztcbiAgICBjb25zdCBsYXN0Q2hvaWNlID0gZFtkLmxlbmd0aCAtIDFdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGFzdENob2ljZS5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgZGF0ZU9iaiA9IGxhc3RDaG9pY2VbaV07XG4gICAgICBjb25zdCBkYXlEaXYgPSBjYWxlbmRhci5xdWVyeVNlbGVjdG9yKGBbZGF0YS1odW1hbmRhdGU9JyR7ZGF0ZU9iai5odW1hbmRhdGV9J11gKTtcbiAgICAgIGRheURpdi5yZW1vdmVDaGlsZChkYXlEaXYubGFzdENoaWxkKTtcbiAgICAgIGRhdGVPYmoudGltZXMgPSBkYXRlT2JqLnRpbWVzLnNsaWNlKDAsIC0yKTtcbiAgICB9XG4gICAgc2VsZWN0aW9uID0gc2VsZWN0aW9uLnNsaWNlKDAsIC0yKTtcbiAgICBjb25zdCB0aW1lQ2hvb3NlciA9IGNhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoJy50aW1lQ2hvb3NlcicpO1xuICAgIHRpbWVDaG9vc2VyLnJlbW92ZUNoaWxkKHRpbWVDaG9vc2VyLmxhc3RDaGlsZCk7XG4gIH1cbn1cblxuZXhwb3J0IHsgR2VuZXJhdGVUaW1lQ2hvb3Nlck1vZGFsIH07XG4iLCIvKiBMYW5ndWFnZSBkZWZhdWx0cyAqL1xuY29uc3QgZW5HYiA9IHtcbiAgZ2VuZXJhbFRpbWU6IHtcbiAgICBtb250aHM6IFsnSmFudWFyeScsICdGZWJydWFyeScsICdNYXJjaCcsICdBcHJpbCcsICdNYXknLCAnSnVuZScsICdKdWx5JywgJ0F1Z3VzdCcsICdTZXB0ZW1iZXInLCAnT2N0b2JlcicsICdOb3ZlbWJlcicsICdEZWNlbWJlciddLFxuICAgIGRheXNJbkZ1bGw6IFsnU3VuZGF5JywgJ01vbmRheScsICdUdWVzZGF5JywgJ1dlZG5lc2RheScsICdUaHVyc2RheScsICdGcmlkYXknLCAnU2F0dXJkYXknXSxcbiAgICBkYXlzVHJ1bmNhdGVkOiBbJ1N1bicsICdNb24nLCAnVHVlJywgJ1dlZCcsICdUaHUnLCAnRnJpJywgJ1NhdCddXG4gIH0sXG4gIGZvcm1hdERheVRleHQ6IHtcbiAgICB0ZXh0QmVmb3JlOiAnU2V0IHRoZXNlIHRpbWVzIGZvciBhbGwnLFxuICAgIHRleHRBZnRlcjogJydcbiAgfSxcbiAgdGltZVdpZGdldDoge1xuICAgIGFkZFRpbWU6ICdBZGQgdGltZTonLFxuICAgIHN0YXJ0OiAnU3RhcnQnLFxuICAgIGVuZDogJ0VuZCdcbiAgfVxufTtcblxuLyogTGFuZ3VhZ2UgZGVmYXVsdHMgKi9cbmNvbnN0IHB0UHQgPSB7XG4gIGdlbmVyYWxUaW1lOiB7XG4gICAgbW9udGhzOiBbJ0phbmVpcm8nLCAnRmV2ZXJlaXJvJywgJ01hcsOnbycsICdBYnJpbCcsICdNYWlvJywgJ0p1bmhvJywgJ0p1bGhvJywgJ0Fnb3N0bycsICdTZXRlbWJybycsICdPdXR1YnJvJywgJ05vdmVtYnJvJywgJ0RlemVtYnJvJ10sXG4gICAgZGF5c0luRnVsbDogWydEb21pbmdvJywgJ1NlZ3VuZGEtRmVpcmEnLCAnVGVyw6dhLUZlaXJhJywgJ1F1YXJ0YS1GZWlyYScsICdRdWludGEtRmVpcmEnLCAnU2V4dGEtRmVpcmEnLCAnU8OhYmFkbyddLFxuICAgIGRheXNUcnVuY2F0ZWQ6IFsnRG9tJywgJ1NlZycsICdUZXInLCAnUXVhJywgJ1F1aScsICdTZXgnLCAnU2FiJ11cbiAgfSxcbiAgZm9ybWF0RGF5VGV4dDoge1xuICAgIHRleHRCZWZvcmU6ICdBcHBsaXF1ZSBlc3RhcyBob3JhcyBhIHRvZG9zJyxcbiAgICB0ZXh0QWZ0ZXI6ICcnXG4gIH0sXG4gIHRpbWVXaWRnZXQ6IHtcbiAgICBhZGRUaW1lOiAnQWRpY2lvbmUgZHVyYcOnw6NvOicsXG4gICAgc3RhcnQ6ICdJbsOtY2lvJyxcbiAgICBlbmQ6ICdGaW0nXG4gIH1cblxufTtcblxuY29uc3QgbGFuZ3VhZ2VzID0geyBlbkdiLCBwdFB0IH07XG5cbmV4cG9ydCB7IGxhbmd1YWdlcyB9O1xuIiwiY29uc3QgY29sb3VycyA9IHtcbiAgbW9udGhDb2xvcjogJyNmYzMnLFxuICBtb250aEJhY2tnb3VuZEJvbG9yOiAnIzY3OTljYicsXG4gIGRheU5hbWVDb2xvcjogJyMwMDAnLFxuICBkYXlOYW1lQmFja2dyb3VuZENvbG9yOiAnI2NjYycsXG4gIGRheUNvbG9yOiAnIzAwMCcsXG4gIGRheUJhY2tncm91bmRDb2xvcjogJyNmZmYnLFxuICBtb250aEJvcmRlckNvbG9yOiAnI2YxNTkyNSdcbn07XG5cbmNvbnN0IHNlbGVjdGVkU3R5bGUgPSAoZGl2KSA9PiB7XG4gIGRpdi5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBjb2xvdXJzLm1vbnRoQ29sb3I7XG59O1xuXG5jb25zdCB1bnNlbGVjdGVkU3R5bGUgPSAoZGl2KSA9PiB7XG4gIGRpdi5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBjb2xvdXJzLmRheUJhY2tncm91bmRDb2xvcjtcbn07XG5cbmV4cG9ydCB7IHNlbGVjdGVkU3R5bGUsIHVuc2VsZWN0ZWRTdHlsZSwgY29sb3VycyB9O1xuIl19
