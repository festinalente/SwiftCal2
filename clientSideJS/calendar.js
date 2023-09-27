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
          // console.log('PRELOADING DATES...');
          // console.log(calendar);
          // console.log(dates);
          dates = ['2023-09-09'];
          endUser = 1; //attach(dateNode);
          _context.next = 4;
          return convertDates(dates);
        case 4:
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
        case 5:
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
var css = ".calendar {\n  display: flex;\n  flex-wrap: wrap;\n  flex-direction: row;\n  background-color: rgba(240, 248, 255, 0);\n  width: 100%;\n  height: 28.8em;\n  overflow-y: auto;\n  position: relative;\n}\n.calendar .blocked {\n  background-color: #333;\n}\n.calendar .filler {\n  pointer-events: none;\n  opacity: 0.3;\n}\n.calendar .timeSelect {\n  padding: 0;\n  width: auto;\n  margin: 0;\n  background-color: #fff;\n  float: right;\n  font-weight: 700;\n  font-family: Arial, Helvetica, sans-serif;\n  border-style: solid;\n  border-radius: 1em;\n  text-align: center;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  border-width: 3px;\n  border-color: #f15925;\n  color: #000;\n  font-size: 0.9em;\n}\n.calendar .timeCont {\n  margin-left: auto;\n  width: 10em;\n  background-color: aliceblue;\n  border-style: solid;\n  border-color: #f15925;\n  margin-right: auto;\n  margin-top: 10em;\n}\n.calendar .dayblockrow {\n  display: flex;\n  flex-direction: row;\n  min-width: 100%;\n  background-color: aliceblue;\n}\n.calendar .calendarTimeParent {\n  margin: 0.1em;\n}\n.calendar .calendarTimeParent .calendarTime {\n  font-size: 0.9em;\n  margin-top: 0em;\n  line-height: 1;\n  background-color: aliceblue;\n  color: black;\n  text-align: center;\n  margin: 0px;\n}\n.calendar .widthShapeDays {\n  width: 14.2857142857%;\n  margin-left: auto;\n  margin-right: auto;\n  text-align: center;\n}\n.calendar .widthShape {\n  width: 14.2857142857%;\n  margin-left: auto;\n  margin-right: auto;\n  text-align: center;\n  min-height: 3.6em;\n  margin-bottom: 0.2em;\n}\n.calendar .monthName {\n  margin: auto;\n  text-align: center;\n  font-family: Ubuntu;\n  font-size: 1.61em;\n  background-color: #337ab7;\n  color: #ffcc33;\n  flex-basis: 100%;\n  border-bottom-style: solid;\n}\n.calendar .weekrow {\n  display: flex;\n  flex-wrap: nowrap;\n  flex-direction: row;\n  background-color: #fff;\n  font-family: \"roboto\", \"arial\";\n}\n.calendar .dayName {\n  color: black;\n  font-family: \"roboto\", \"arial\";\n  font-weight: 600;\n  background-color: #ccc;\n}\n.calendar .month > * {\n  margin-left: 2px;\n  margin-right: 2px;\n}\n.calendar .month {\n  width: 50%;\n  min-width: 300px;\n  margin: auto;\n}\n.calendar .timeChooser {\n  width: 10em;\n  position: static;\n  background-color: aliceblue;\n  margin-left: auto;\n  margin-right: auto;\n}\n.calendar .timeContainer {\n  display: flex;\n}\n.calendar .timeChooserModal {\n  z-index: 1;\n  width: 100%;\n  height: 100%;\n  background-color: rgba(0, 0, 0, 0.4);\n  position: absolute;\n  margin: 0;\n  padding: 0;\n  border: 0;\n  overflow-x: scroll;\n}\n.calendar .calendarLabel {\n  min-width: 3em;\n  padding: 0em 1em 0em 1em;\n  color: black;\n  font-family: \"roboto\", \"arial\";\n  font-weight: 600;\n  background-color: #ccc;\n  margin: 1em 0 1em 0;\n}\n.calendar .deleteDiv {\n  font-family: Ubuntu;\n  font-size: 1.61em;\n  background-color: #337ab7;\n  color: #ffcc33;\n  border-bottom-style: solid;\n  height: 2em;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.calendar .deleteButton {\n  background-color: white;\n  color: #f15925;\n  float: right;\n  font-weight: 700;\n  font-family: Arial, Helvetica, sans-serif;\n  border-style: solid;\n  border-radius: 1em;\n  text-align: center;\n  height: 30px;\n  width: 30px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.calendar .innerSpanDeleteBtn {\n  text-align: center;\n}\n.calendar .deleteButton:hover,\n.calendar .deleteButton:focus,\n.calendar .timeSelect:hover,\n.calendar .timeSelect:focus {\n  color: #000;\n  text-decoration: none;\n  cursor: pointer;\n}\n.calendar .hour {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 10em;\n}\n.calendar .timeSelectP {\n  display: inline;\n  width: 5em;\n  color: #000;\n}\n.calendar .timeChooser > input[type=checkbox] {\n  outline: #f15925;\n  outline-style: solid;\n}\n.calendar .timeSelect > option {\n  color: #000;\n}\n.calendar .calendar > p,\n.calendar h4,\n.calendar h3,\n.calendar h2,\n.calendar h1,\n.calendar select,\n.calendar option {\n  color: #000;\n}\n.calendar .arrow-up {\n  width: 0;\n  height: 0;\n  border-left: 10px solid transparent;\n  border-right: 10px solid transparent;\n  border-bottom: 10px solid black;\n}\n.calendar .arrow-down {\n  width: 0;\n  height: 0;\n  border-left: 10px solid transparent;\n  border-right: 10px solid transparent;\n  border-top: 10px solid #000;\n}\n.calendar .arrows {\n  float: right;\n  clear: right;\n  position: relative;\n  cursor: pointer;\n  flex-direction: column;\n}\n.calendar .arrow-right {\n  width: 0;\n  height: 0;\n  border-top: 60px solid transparent;\n  border-bottom: 60px solid transparent;\n  border-left: 60px solid green;\n}\n.calendar .arrow-left {\n  width: 0;\n  height: 0;\n  border-top: 10px solid transparent;\n  border-bottom: 10px solid transparent;\n  border-right: 10px solid blue;\n}\n.calendar .dayTime {\n  cursor: pointer;\n}\n.calendar .dayTime > * {\n  pointer-events: none;\n}\n"; (require("browserify-css").createStyle(css, { "href": "preBundlingJS/calendarApp.css" }, { "insertAt": "bottom" })); module.exports = css;
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
      selectMultiple: _this.dataset.selectMultiple
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
    config.preloadedDates = configObj.preloadedDates || [];
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
        (0, _basicFunctions.preloadDates)(calendar, preloadedDates);
        (0, _basicFunctions.blockDaysNotOpen)(calendar, datesOpen);
      }
    };
    for (var i = 0; i < numberOfMonthsToDisplay; i++) {
      _loop();
    }
    if (displayTimeChooserModal) {
      timeChooser = new _displayTimeChooserModal.GenerateTimeChooserModal(config, dynamicData, calendar);
      timeChooser.generateModal();
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
      bookDay(dateDiv);
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
 * Creates dialog for selecting specific times
 * @function createTimeElements
 * @param {HTMLElement} calendar - The calendar element
 * @returns {promise} - Empty promise. The actual div is in this code on "timeChooserModal"
*/

function GenerateTimeChooserModal(config, dynamicData, calendar) {
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
  function generateModal() {
    var promise = new Promise(function (resolve, reject) {
      timeChooserModal = createModal('timeChooserModal');
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

          /*
          if (dayInPoint.classList.contains('filler') === false) {
            dayInPoint.style.backgroundColor = '#fc3';
            if (i % 2 === 1) {
              time.style.borderBottomStyle = 'solid';
              dayInPoint.appendChild(time);
              textinternal = '';
            } else {
              dayInPoint.appendChild(time);
              textinternal = '';
            }
          }*/
        });
      }; //generateTimeValuesOnDate(timeValues);
      dynamicData.datesSelectedArray.forEach(function (childArray) {
        childArray.forEach(function (daySelected) {
          write(daySelected);
        });
      });

      // contains a time duration choice
      var calendarTimeParent;
    }
  }
  function createModal(className) {
    var modal = document.createElement('dialog');
    modal.classList.add(className);
    return modal;
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

    // The storage object
    // selection.push([]);

    // timeObj =  [[]]
    // const timesObj = selection[selection.length - 1];

    var timeForContext = _defineProperty({}, contextText, {});

    // timesObj.push(timeForContext);
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
function displayTimeChooserModal(cal, conf, data) {
  calendar = cal;
  config = conf;
  dynamicData = data;
  if (timeChooserModal) {
    timeChooserModal.show();
  } else {
    generateTimeChooserModal().then(function (newModal) {
      timeChooserModal = newModal;
      timeChooserModal.show();
    });
  }
}

//, displayTimeChooserModal, getSelectedTimes, writeTimesToAll

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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS1jc3MvYnJvd3Nlci5qcyIsInByZUJ1bmRsaW5nSlMvYmFzaWNGdW5jdGlvbnMuanMiLCJwcmVCdW5kbGluZ0pTL2NhbGVuZGFyQXBwLmNzcyIsInByZUJ1bmRsaW5nSlMvY2FsZW5kYXJHZW5lcmF0b3IuanMiLCJwcmVCdW5kbGluZ0pTL2Rpc3BsYXlUaW1lQ2hvb3Nlck1vZGFsLmpzIiwicHJlQnVuZGxpbmdKUy9sYW5ndWFnZXMuanMiLCJwcmVCdW5kbGluZ0pTL3N0eWxlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDM0VBLElBQUEsT0FBQSxHQUFBLE9BQUE7QUFDQSxJQUFBLGtCQUFBLEdBQUEsT0FBQTtBQUNBLElBQUEsd0JBQUEsR0FBQSxPQUFBO0FBQXlGLFNBQUEsb0JBQUEsa0JBRHpGLHFKQUFBLG1CQUFBLFlBQUEsb0JBQUEsV0FBQSxDQUFBLFNBQUEsQ0FBQSxFQUFBLENBQUEsT0FBQSxDQUFBLEdBQUEsTUFBQSxDQUFBLFNBQUEsRUFBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLGNBQUEsRUFBQSxDQUFBLEdBQUEsTUFBQSxDQUFBLGNBQUEsY0FBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsSUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsQ0FBQSxLQUFBLEtBQUEsQ0FBQSx3QkFBQSxNQUFBLEdBQUEsTUFBQSxPQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsUUFBQSxrQkFBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLGFBQUEsdUJBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxXQUFBLDhCQUFBLE9BQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBLFdBQUEsTUFBQSxDQUFBLGNBQUEsQ0FBQSxDQUFBLEVBQUEsQ0FBQSxJQUFBLEtBQUEsRUFBQSxDQUFBLEVBQUEsVUFBQSxNQUFBLFlBQUEsTUFBQSxRQUFBLFNBQUEsQ0FBQSxDQUFBLENBQUEsV0FBQSxNQUFBLG1CQUFBLENBQUEsSUFBQSxNQUFBLFlBQUEsT0FBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsV0FBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsZ0JBQUEsS0FBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBLFFBQUEsQ0FBQSxHQUFBLENBQUEsSUFBQSxDQUFBLENBQUEsU0FBQSxZQUFBLFNBQUEsR0FBQSxDQUFBLEdBQUEsU0FBQSxFQUFBLENBQUEsR0FBQSxNQUFBLENBQUEsTUFBQSxDQUFBLENBQUEsQ0FBQSxTQUFBLEdBQUEsQ0FBQSxPQUFBLE9BQUEsQ0FBQSxDQUFBLGdCQUFBLENBQUEsQ0FBQSxDQUFBLGVBQUEsS0FBQSxFQUFBLGdCQUFBLENBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBLE1BQUEsQ0FBQSxhQUFBLFNBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBLG1CQUFBLElBQUEsWUFBQSxHQUFBLEVBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxDQUFBLEVBQUEsQ0FBQSxjQUFBLENBQUEsYUFBQSxJQUFBLFdBQUEsR0FBQSxFQUFBLENBQUEsUUFBQSxDQUFBLENBQUEsSUFBQSxHQUFBLElBQUEsTUFBQSxDQUFBLHFCQUFBLENBQUEscUJBQUEsQ0FBQSxnQkFBQSxDQUFBLGdCQUFBLENBQUEsZ0JBQUEsVUFBQSxjQUFBLGtCQUFBLGNBQUEsMkJBQUEsU0FBQSxDQUFBLE9BQUEsTUFBQSxDQUFBLENBQUEsRUFBQSxDQUFBLHFDQUFBLENBQUEsR0FBQSxNQUFBLENBQUEsY0FBQSxFQUFBLENBQUEsR0FBQSxDQUFBLElBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxNQUFBLFFBQUEsQ0FBQSxJQUFBLENBQUEsS0FBQSxDQUFBLElBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxDQUFBLEVBQUEsQ0FBQSxNQUFBLENBQUEsR0FBQSxDQUFBLE9BQUEsQ0FBQSxHQUFBLDBCQUFBLENBQUEsU0FBQSxHQUFBLFNBQUEsQ0FBQSxTQUFBLEdBQUEsTUFBQSxDQUFBLE1BQUEsQ0FBQSxDQUFBLFlBQUEsc0JBQUEsQ0FBQSxnQ0FBQSxPQUFBLFdBQUEsQ0FBQSxJQUFBLE1BQUEsQ0FBQSxDQUFBLEVBQUEsQ0FBQSxZQUFBLENBQUEsZ0JBQUEsT0FBQSxDQUFBLENBQUEsRUFBQSxDQUFBLHNCQUFBLGNBQUEsQ0FBQSxFQUFBLENBQUEsYUFBQSxPQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsUUFBQSxDQUFBLEdBQUEsUUFBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLEdBQUEsQ0FBQSxFQUFBLENBQUEsbUJBQUEsQ0FBQSxDQUFBLElBQUEsUUFBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLEdBQUEsRUFBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLEtBQUEsU0FBQSxDQUFBLGdCQUFBLE9BQUEsQ0FBQSxDQUFBLEtBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxDQUFBLGVBQUEsQ0FBQSxDQUFBLE9BQUEsQ0FBQSxDQUFBLENBQUEsT0FBQSxFQUFBLElBQUEsV0FBQSxDQUFBLElBQUEsTUFBQSxTQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxnQkFBQSxDQUFBLElBQUEsTUFBQSxVQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxRQUFBLENBQUEsQ0FBQSxPQUFBLENBQUEsQ0FBQSxFQUFBLElBQUEsV0FBQSxDQUFBLElBQUEsQ0FBQSxDQUFBLEtBQUEsR0FBQSxDQUFBLEVBQUEsQ0FBQSxDQUFBLENBQUEsZ0JBQUEsQ0FBQSxXQUFBLE1BQUEsVUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsU0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLEdBQUEsU0FBQSxDQUFBLEVBQUEsQ0FBQSxvQkFBQSxLQUFBLFdBQUEsTUFBQSxDQUFBLEVBQUEsQ0FBQSxhQUFBLDJCQUFBLGVBQUEsQ0FBQSxXQUFBLENBQUEsRUFBQSxDQUFBLElBQUEsTUFBQSxDQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsZ0JBQUEsQ0FBQSxHQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsSUFBQSxDQUFBLDBCQUFBLEVBQUEsMEJBQUEsSUFBQSwwQkFBQSxxQkFBQSxpQkFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsUUFBQSxDQUFBLEdBQUEsQ0FBQSxtQkFBQSxDQUFBLEVBQUEsQ0FBQSxRQUFBLENBQUEsS0FBQSxDQUFBLFlBQUEsS0FBQSxzQ0FBQSxDQUFBLEtBQUEsQ0FBQSxvQkFBQSxDQUFBLFFBQUEsQ0FBQSxXQUFBLEtBQUEsRUFBQSxDQUFBLEVBQUEsSUFBQSxlQUFBLENBQUEsQ0FBQSxNQUFBLEdBQUEsQ0FBQSxFQUFBLENBQUEsQ0FBQSxHQUFBLEdBQUEsQ0FBQSxVQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsUUFBQSxNQUFBLENBQUEsUUFBQSxDQUFBLEdBQUEsbUJBQUEsQ0FBQSxDQUFBLEVBQUEsQ0FBQSxPQUFBLENBQUEsUUFBQSxDQUFBLEtBQUEsQ0FBQSxtQkFBQSxDQUFBLHFCQUFBLENBQUEsQ0FBQSxNQUFBLEVBQUEsQ0FBQSxDQUFBLElBQUEsR0FBQSxDQUFBLENBQUEsS0FBQSxHQUFBLENBQUEsQ0FBQSxHQUFBLHNCQUFBLENBQUEsQ0FBQSxNQUFBLFFBQUEsQ0FBQSxLQUFBLENBQUEsUUFBQSxDQUFBLEdBQUEsQ0FBQSxFQUFBLENBQUEsQ0FBQSxHQUFBLEVBQUEsQ0FBQSxDQUFBLGlCQUFBLENBQUEsQ0FBQSxDQUFBLEdBQUEsdUJBQUEsQ0FBQSxDQUFBLE1BQUEsSUFBQSxDQUFBLENBQUEsTUFBQSxXQUFBLENBQUEsQ0FBQSxHQUFBLEdBQUEsQ0FBQSxHQUFBLENBQUEsTUFBQSxDQUFBLEdBQUEsUUFBQSxDQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxvQkFBQSxDQUFBLENBQUEsSUFBQSxRQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsSUFBQSxHQUFBLENBQUEsR0FBQSxDQUFBLEVBQUEsQ0FBQSxDQUFBLEdBQUEsS0FBQSxDQUFBLHFCQUFBLEtBQUEsRUFBQSxDQUFBLENBQUEsR0FBQSxFQUFBLElBQUEsRUFBQSxDQUFBLENBQUEsSUFBQSxrQkFBQSxDQUFBLENBQUEsSUFBQSxLQUFBLENBQUEsR0FBQSxDQUFBLEVBQUEsQ0FBQSxDQUFBLE1BQUEsWUFBQSxDQUFBLENBQUEsR0FBQSxHQUFBLENBQUEsQ0FBQSxHQUFBLG1CQUFBLG9CQUFBLENBQUEsRUFBQSxDQUFBLFFBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxNQUFBLEVBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxRQUFBLENBQUEsQ0FBQSxPQUFBLENBQUEsS0FBQSxDQUFBLFNBQUEsQ0FBQSxDQUFBLFFBQUEscUJBQUEsQ0FBQSxJQUFBLENBQUEsQ0FBQSxRQUFBLGVBQUEsQ0FBQSxDQUFBLE1BQUEsYUFBQSxDQUFBLENBQUEsR0FBQSxHQUFBLENBQUEsRUFBQSxtQkFBQSxDQUFBLENBQUEsRUFBQSxDQUFBLGVBQUEsQ0FBQSxDQUFBLE1BQUEsa0JBQUEsQ0FBQSxLQUFBLENBQUEsQ0FBQSxNQUFBLFlBQUEsQ0FBQSxDQUFBLEdBQUEsT0FBQSxTQUFBLHVDQUFBLENBQUEsaUJBQUEsQ0FBQSxNQUFBLENBQUEsR0FBQSxRQUFBLENBQUEsQ0FBQSxFQUFBLENBQUEsQ0FBQSxRQUFBLEVBQUEsQ0FBQSxDQUFBLEdBQUEsbUJBQUEsQ0FBQSxDQUFBLElBQUEsU0FBQSxDQUFBLENBQUEsTUFBQSxZQUFBLENBQUEsQ0FBQSxHQUFBLEdBQUEsQ0FBQSxDQUFBLEdBQUEsRUFBQSxDQUFBLENBQUEsUUFBQSxTQUFBLENBQUEsTUFBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLEdBQUEsU0FBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLElBQUEsSUFBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLFVBQUEsSUFBQSxDQUFBLENBQUEsS0FBQSxFQUFBLENBQUEsQ0FBQSxJQUFBLEdBQUEsQ0FBQSxDQUFBLE9BQUEsZUFBQSxDQUFBLENBQUEsTUFBQSxLQUFBLENBQUEsQ0FBQSxNQUFBLFdBQUEsQ0FBQSxDQUFBLEdBQUEsR0FBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLFFBQUEsU0FBQSxDQUFBLElBQUEsQ0FBQSxJQUFBLENBQUEsQ0FBQSxNQUFBLFlBQUEsQ0FBQSxDQUFBLEdBQUEsT0FBQSxTQUFBLHNDQUFBLENBQUEsQ0FBQSxRQUFBLFNBQUEsQ0FBQSxjQUFBLGFBQUEsQ0FBQSxRQUFBLENBQUEsS0FBQSxNQUFBLEVBQUEsQ0FBQSxZQUFBLENBQUEsS0FBQSxDQUFBLENBQUEsUUFBQSxHQUFBLENBQUEsV0FBQSxDQUFBLEtBQUEsQ0FBQSxDQUFBLFVBQUEsR0FBQSxDQUFBLEtBQUEsQ0FBQSxDQUFBLFFBQUEsR0FBQSxDQUFBLFdBQUEsVUFBQSxDQUFBLElBQUEsQ0FBQSxDQUFBLGNBQUEsY0FBQSxDQUFBLFFBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxVQUFBLFFBQUEsQ0FBQSxDQUFBLElBQUEsb0JBQUEsQ0FBQSxDQUFBLEdBQUEsRUFBQSxDQUFBLENBQUEsVUFBQSxHQUFBLENBQUEsYUFBQSxRQUFBLENBQUEsU0FBQSxVQUFBLE1BQUEsTUFBQSxhQUFBLENBQUEsQ0FBQSxPQUFBLENBQUEsWUFBQSxjQUFBLEtBQUEsaUJBQUEsT0FBQSxDQUFBLFFBQUEsQ0FBQSxXQUFBLENBQUEsUUFBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLENBQUEsT0FBQSxDQUFBLFNBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxDQUFBLDRCQUFBLENBQUEsQ0FBQSxJQUFBLFNBQUEsQ0FBQSxPQUFBLEtBQUEsQ0FBQSxDQUFBLENBQUEsTUFBQSxTQUFBLENBQUEsT0FBQSxDQUFBLFlBQUEsS0FBQSxhQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsTUFBQSxPQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsQ0FBQSxFQUFBLENBQUEsVUFBQSxJQUFBLENBQUEsS0FBQSxHQUFBLENBQUEsQ0FBQSxDQUFBLEdBQUEsSUFBQSxDQUFBLElBQUEsT0FBQSxJQUFBLFNBQUEsSUFBQSxDQUFBLEtBQUEsR0FBQSxDQUFBLEVBQUEsSUFBQSxDQUFBLElBQUEsT0FBQSxJQUFBLFlBQUEsQ0FBQSxDQUFBLElBQUEsR0FBQSxDQUFBLGdCQUFBLFNBQUEsQ0FBQSxPQUFBLENBQUEsQ0FBQSxrQ0FBQSxpQkFBQSxDQUFBLFNBQUEsR0FBQSwwQkFBQSxFQUFBLENBQUEsQ0FBQSxDQUFBLG1CQUFBLEtBQUEsRUFBQSwwQkFBQSxFQUFBLFlBQUEsU0FBQSxDQUFBLENBQUEsMEJBQUEsbUJBQUEsS0FBQSxFQUFBLGlCQUFBLEVBQUEsWUFBQSxTQUFBLGlCQUFBLENBQUEsV0FBQSxHQUFBLE1BQUEsQ0FBQSwwQkFBQSxFQUFBLENBQUEsd0JBQUEsQ0FBQSxDQUFBLG1CQUFBLGFBQUEsQ0FBQSxRQUFBLENBQUEsd0JBQUEsQ0FBQSxJQUFBLENBQUEsQ0FBQSxXQUFBLFdBQUEsQ0FBQSxLQUFBLENBQUEsS0FBQSxpQkFBQSw2QkFBQSxDQUFBLENBQUEsV0FBQSxJQUFBLENBQUEsQ0FBQSxJQUFBLE9BQUEsQ0FBQSxDQUFBLElBQUEsYUFBQSxDQUFBLFdBQUEsTUFBQSxDQUFBLGNBQUEsR0FBQSxNQUFBLENBQUEsY0FBQSxDQUFBLENBQUEsRUFBQSwwQkFBQSxLQUFBLENBQUEsQ0FBQSxTQUFBLEdBQUEsMEJBQUEsRUFBQSxNQUFBLENBQUEsQ0FBQSxFQUFBLENBQUEseUJBQUEsQ0FBQSxDQUFBLFNBQUEsR0FBQSxNQUFBLENBQUEsTUFBQSxDQUFBLENBQUEsR0FBQSxDQUFBLEtBQUEsQ0FBQSxDQUFBLEtBQUEsYUFBQSxDQUFBLGFBQUEsT0FBQSxFQUFBLENBQUEsT0FBQSxxQkFBQSxDQUFBLGFBQUEsQ0FBQSxTQUFBLEdBQUEsTUFBQSxDQUFBLGFBQUEsQ0FBQSxTQUFBLEVBQUEsQ0FBQSxpQ0FBQSxDQUFBLENBQUEsYUFBQSxHQUFBLGFBQUEsRUFBQSxDQUFBLENBQUEsS0FBQSxhQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBLGVBQUEsQ0FBQSxLQUFBLENBQUEsR0FBQSxPQUFBLE9BQUEsQ0FBQSxPQUFBLGFBQUEsQ0FBQSxJQUFBLENBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxHQUFBLENBQUEsVUFBQSxDQUFBLENBQUEsbUJBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxJQUFBLEdBQUEsSUFBQSxXQUFBLENBQUEsV0FBQSxDQUFBLENBQUEsSUFBQSxHQUFBLENBQUEsQ0FBQSxLQUFBLEdBQUEsQ0FBQSxDQUFBLElBQUEsV0FBQSxxQkFBQSxDQUFBLENBQUEsR0FBQSxNQUFBLENBQUEsQ0FBQSxFQUFBLENBQUEsZ0JBQUEsTUFBQSxDQUFBLENBQUEsRUFBQSxDQUFBLGlDQUFBLE1BQUEsQ0FBQSxDQUFBLDZEQUFBLENBQUEsQ0FBQSxJQUFBLGFBQUEsQ0FBQSxRQUFBLENBQUEsR0FBQSxNQUFBLENBQUEsQ0FBQSxHQUFBLENBQUEsZ0JBQUEsQ0FBQSxJQUFBLENBQUEsRUFBQSxDQUFBLENBQUEsSUFBQSxDQUFBLENBQUEsVUFBQSxDQUFBLENBQUEsT0FBQSxhQUFBLEtBQUEsV0FBQSxDQUFBLENBQUEsTUFBQSxTQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsR0FBQSxRQUFBLENBQUEsSUFBQSxDQUFBLFNBQUEsSUFBQSxDQUFBLEtBQUEsR0FBQSxDQUFBLEVBQUEsSUFBQSxDQUFBLElBQUEsT0FBQSxJQUFBLFdBQUEsSUFBQSxDQUFBLElBQUEsT0FBQSxJQUFBLFFBQUEsQ0FBQSxDQUFBLE1BQUEsR0FBQSxNQUFBLEVBQUEsT0FBQSxDQUFBLFNBQUEsS0FBQSxXQUFBLEVBQUEsT0FBQSxFQUFBLEtBQUEsV0FBQSxNQUFBLENBQUEsYUFBQSxJQUFBLFdBQUEsSUFBQSxXQUFBLElBQUEsUUFBQSxLQUFBLEdBQUEsQ0FBQSxPQUFBLElBQUEsWUFBQSxRQUFBLGNBQUEsTUFBQSxnQkFBQSxHQUFBLEdBQUEsQ0FBQSxPQUFBLFVBQUEsQ0FBQSxPQUFBLENBQUEsYUFBQSxJQUFBLENBQUEsV0FBQSxDQUFBLGtCQUFBLENBQUEsQ0FBQSxNQUFBLE9BQUEsQ0FBQSxDQUFBLElBQUEsT0FBQSxDQUFBLE1BQUEsS0FBQSxFQUFBLENBQUEsQ0FBQSxLQUFBLGNBQUEsQ0FBQSxJQUFBLENBQUEsTUFBQSxJQUFBLFdBQUEsS0FBQSxTQUFBLElBQUEsV0FBQSxDQUFBLFFBQUEsVUFBQSxJQUFBLFVBQUEsa0JBQUEsQ0FBQSxDQUFBLElBQUEsUUFBQSxDQUFBLENBQUEsR0FBQSxjQUFBLElBQUEsS0FBQSxpQkFBQSxXQUFBLGtCQUFBLENBQUEsYUFBQSxJQUFBLFFBQUEsQ0FBQSxNQUFBLENBQUEsa0JBQUEsT0FBQSxDQUFBLEVBQUEsQ0FBQSxXQUFBLENBQUEsQ0FBQSxJQUFBLFlBQUEsQ0FBQSxDQUFBLEdBQUEsR0FBQSxDQUFBLEVBQUEsQ0FBQSxDQUFBLElBQUEsR0FBQSxDQUFBLEVBQUEsQ0FBQSxLQUFBLENBQUEsQ0FBQSxNQUFBLFdBQUEsQ0FBQSxDQUFBLEdBQUEsR0FBQSxDQUFBLEtBQUEsQ0FBQSxhQUFBLENBQUEsUUFBQSxVQUFBLENBQUEsTUFBQSxNQUFBLENBQUEsU0FBQSxDQUFBLFFBQUEsQ0FBQSxRQUFBLFVBQUEsQ0FBQSxDQUFBLEdBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxVQUFBLGlCQUFBLENBQUEsQ0FBQSxNQUFBLFNBQUEsTUFBQSxhQUFBLENBQUEsQ0FBQSxNQUFBLFNBQUEsSUFBQSxRQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsSUFBQSxDQUFBLENBQUEsZUFBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxDQUFBLHFCQUFBLENBQUEsSUFBQSxDQUFBLGFBQUEsSUFBQSxHQUFBLENBQUEsQ0FBQSxRQUFBLFNBQUEsTUFBQSxDQUFBLENBQUEsQ0FBQSxRQUFBLGdCQUFBLElBQUEsR0FBQSxDQUFBLENBQUEsVUFBQSxTQUFBLE1BQUEsQ0FBQSxDQUFBLENBQUEsVUFBQSxjQUFBLENBQUEsYUFBQSxJQUFBLEdBQUEsQ0FBQSxDQUFBLFFBQUEsU0FBQSxNQUFBLENBQUEsQ0FBQSxDQUFBLFFBQUEscUJBQUEsQ0FBQSxZQUFBLEtBQUEscURBQUEsSUFBQSxHQUFBLENBQUEsQ0FBQSxVQUFBLFNBQUEsTUFBQSxDQUFBLENBQUEsQ0FBQSxVQUFBLFlBQUEsTUFBQSxXQUFBLE9BQUEsQ0FBQSxFQUFBLENBQUEsYUFBQSxDQUFBLFFBQUEsVUFBQSxDQUFBLE1BQUEsTUFBQSxDQUFBLFNBQUEsQ0FBQSxRQUFBLENBQUEsUUFBQSxVQUFBLENBQUEsQ0FBQSxPQUFBLENBQUEsQ0FBQSxNQUFBLFNBQUEsSUFBQSxJQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsQ0FBQSx3QkFBQSxJQUFBLEdBQUEsQ0FBQSxDQUFBLFVBQUEsUUFBQSxDQUFBLEdBQUEsQ0FBQSxhQUFBLENBQUEsaUJBQUEsQ0FBQSxtQkFBQSxDQUFBLEtBQUEsQ0FBQSxDQUFBLE1BQUEsSUFBQSxDQUFBLElBQUEsQ0FBQSxJQUFBLENBQUEsQ0FBQSxVQUFBLEtBQUEsQ0FBQSxjQUFBLENBQUEsR0FBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLFVBQUEsY0FBQSxDQUFBLENBQUEsSUFBQSxHQUFBLENBQUEsRUFBQSxDQUFBLENBQUEsR0FBQSxHQUFBLENBQUEsRUFBQSxDQUFBLFNBQUEsTUFBQSxnQkFBQSxJQUFBLEdBQUEsQ0FBQSxDQUFBLFVBQUEsRUFBQSxDQUFBLFNBQUEsUUFBQSxDQUFBLENBQUEsTUFBQSxRQUFBLFdBQUEsU0FBQSxDQUFBLEVBQUEsQ0FBQSxvQkFBQSxDQUFBLENBQUEsSUFBQSxRQUFBLENBQUEsQ0FBQSxHQUFBLHFCQUFBLENBQUEsQ0FBQSxJQUFBLG1CQUFBLENBQUEsQ0FBQSxJQUFBLFFBQUEsSUFBQSxHQUFBLENBQUEsQ0FBQSxHQUFBLGdCQUFBLENBQUEsQ0FBQSxJQUFBLFNBQUEsSUFBQSxRQUFBLEdBQUEsR0FBQSxDQUFBLENBQUEsR0FBQSxPQUFBLE1BQUEsa0JBQUEsSUFBQSx5QkFBQSxDQUFBLENBQUEsSUFBQSxJQUFBLENBQUEsVUFBQSxJQUFBLEdBQUEsQ0FBQSxHQUFBLENBQUEsS0FBQSxNQUFBLFdBQUEsT0FBQSxDQUFBLGFBQUEsQ0FBQSxRQUFBLFVBQUEsQ0FBQSxNQUFBLE1BQUEsQ0FBQSxTQUFBLENBQUEsUUFBQSxDQUFBLFFBQUEsVUFBQSxDQUFBLENBQUEsT0FBQSxDQUFBLENBQUEsVUFBQSxLQUFBLENBQUEsY0FBQSxRQUFBLENBQUEsQ0FBQSxDQUFBLFVBQUEsRUFBQSxDQUFBLENBQUEsUUFBQSxHQUFBLGFBQUEsQ0FBQSxDQUFBLEdBQUEsQ0FBQSx5QkFBQSxPQUFBLENBQUEsYUFBQSxDQUFBLFFBQUEsVUFBQSxDQUFBLE1BQUEsTUFBQSxDQUFBLFNBQUEsQ0FBQSxRQUFBLENBQUEsUUFBQSxVQUFBLENBQUEsQ0FBQSxPQUFBLENBQUEsQ0FBQSxNQUFBLEtBQUEsQ0FBQSxRQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsVUFBQSxrQkFBQSxDQUFBLENBQUEsSUFBQSxRQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsR0FBQSxFQUFBLGFBQUEsQ0FBQSxDQUFBLFlBQUEsQ0FBQSxnQkFBQSxLQUFBLDhCQUFBLGFBQUEsV0FBQSxjQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxnQkFBQSxRQUFBLEtBQUEsUUFBQSxFQUFBLE1BQUEsQ0FBQSxDQUFBLEdBQUEsVUFBQSxFQUFBLENBQUEsRUFBQSxPQUFBLEVBQUEsQ0FBQSxvQkFBQSxNQUFBLFVBQUEsR0FBQSxHQUFBLENBQUEsR0FBQSxDQUFBLE9BQUEsQ0FBQTtBQUFBLFNBQUEsbUJBQUEsR0FBQSxFQUFBLE9BQUEsRUFBQSxNQUFBLEVBQUEsS0FBQSxFQUFBLE1BQUEsRUFBQSxHQUFBLEVBQUEsR0FBQSxjQUFBLElBQUEsR0FBQSxHQUFBLENBQUEsR0FBQSxFQUFBLEdBQUEsT0FBQSxLQUFBLEdBQUEsSUFBQSxDQUFBLEtBQUEsV0FBQSxLQUFBLElBQUEsTUFBQSxDQUFBLEtBQUEsaUJBQUEsSUFBQSxDQUFBLElBQUEsSUFBQSxPQUFBLENBQUEsS0FBQSxZQUFBLE9BQUEsQ0FBQSxPQUFBLENBQUEsS0FBQSxFQUFBLElBQUEsQ0FBQSxLQUFBLEVBQUEsTUFBQTtBQUFBLFNBQUEsa0JBQUEsRUFBQSw2QkFBQSxJQUFBLFNBQUEsSUFBQSxHQUFBLFNBQUEsYUFBQSxPQUFBLFdBQUEsT0FBQSxFQUFBLE1BQUEsUUFBQSxHQUFBLEdBQUEsRUFBQSxDQUFBLEtBQUEsQ0FBQSxJQUFBLEVBQUEsSUFBQSxZQUFBLE1BQUEsS0FBQSxJQUFBLGtCQUFBLENBQUEsR0FBQSxFQUFBLE9BQUEsRUFBQSxNQUFBLEVBQUEsS0FBQSxFQUFBLE1BQUEsVUFBQSxLQUFBLGNBQUEsT0FBQSxHQUFBLElBQUEsa0JBQUEsQ0FBQSxHQUFBLEVBQUEsT0FBQSxFQUFBLE1BQUEsRUFBQSxLQUFBLEVBQUEsTUFBQSxXQUFBLEdBQUEsS0FBQSxLQUFBLENBQUEsU0FBQTtBQUFBLFNBQUEsZUFBQSxHQUFBLEVBQUEsQ0FBQSxXQUFBLGVBQUEsQ0FBQSxHQUFBLEtBQUEscUJBQUEsQ0FBQSxHQUFBLEVBQUEsQ0FBQSxLQUFBLDJCQUFBLENBQUEsR0FBQSxFQUFBLENBQUEsS0FBQSxnQkFBQTtBQUFBLFNBQUEsaUJBQUEsY0FBQSxTQUFBO0FBQUEsU0FBQSw0QkFBQSxDQUFBLEVBQUEsTUFBQSxTQUFBLENBQUEscUJBQUEsQ0FBQSxzQkFBQSxpQkFBQSxDQUFBLENBQUEsRUFBQSxNQUFBLE9BQUEsQ0FBQSxHQUFBLE1BQUEsQ0FBQSxTQUFBLENBQUEsUUFBQSxDQUFBLElBQUEsQ0FBQSxDQUFBLEVBQUEsS0FBQSxhQUFBLENBQUEsaUJBQUEsQ0FBQSxDQUFBLFdBQUEsRUFBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLFdBQUEsQ0FBQSxJQUFBLE1BQUEsQ0FBQSxjQUFBLENBQUEsbUJBQUEsS0FBQSxDQUFBLElBQUEsQ0FBQSxDQUFBLE9BQUEsQ0FBQSwrREFBQSxJQUFBLENBQUEsQ0FBQSxVQUFBLGlCQUFBLENBQUEsQ0FBQSxFQUFBLE1BQUE7QUFBQSxTQUFBLGtCQUFBLEdBQUEsRUFBQSxHQUFBLFFBQUEsR0FBQSxZQUFBLEdBQUEsR0FBQSxHQUFBLENBQUEsTUFBQSxFQUFBLEdBQUEsR0FBQSxHQUFBLENBQUEsTUFBQSxXQUFBLENBQUEsTUFBQSxJQUFBLE9BQUEsS0FBQSxDQUFBLEdBQUEsR0FBQSxDQUFBLEdBQUEsR0FBQSxFQUFBLENBQUEsSUFBQSxJQUFBLENBQUEsQ0FBQSxJQUFBLEdBQUEsQ0FBQSxDQUFBLFVBQUEsSUFBQTtBQUFBLFNBQUEsc0JBQUEsQ0FBQSxFQUFBLENBQUEsUUFBQSxDQUFBLFdBQUEsQ0FBQSxnQ0FBQSxNQUFBLElBQUEsQ0FBQSxDQUFBLE1BQUEsQ0FBQSxRQUFBLEtBQUEsQ0FBQSw0QkFBQSxDQUFBLFFBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsT0FBQSxDQUFBLE9BQUEsQ0FBQSxpQkFBQSxDQUFBLElBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsQ0FBQSxHQUFBLElBQUEsUUFBQSxDQUFBLFFBQUEsTUFBQSxDQUFBLENBQUEsTUFBQSxDQUFBLFVBQUEsQ0FBQSx1QkFBQSxDQUFBLElBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsQ0FBQSxHQUFBLElBQUEsTUFBQSxDQUFBLENBQUEsSUFBQSxDQUFBLENBQUEsQ0FBQSxLQUFBLEdBQUEsQ0FBQSxDQUFBLE1BQUEsS0FBQSxDQUFBLEdBQUEsQ0FBQSxp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LEtBQUEsMkJBQUEsQ0FBQSxHQUFBLEVBQUEsQ0FBQSxLQUFBLGdCQUFBO0FBQUEsU0FBQSxpQkFBQSxjQUFBLFNBQUE7QUFBQSxTQUFBLDRCQUFBLENBQUEsRUFBQSxNQUFBLFNBQUEsQ0FBQSxxQkFBQSxDQUFBLHNCQUFBLGlCQUFBLENBQUEsQ0FBQSxFQUFBLE1BQUEsT0FBQSxDQUFBLEdBQUEsTUFBQSxDQUFBLFNBQUEsQ0FBQSxRQUFBLENBQUEsSUFBQSxDQUFBLENBQUEsRUFBQSxLQUFBLGFBQUEsQ0FBQSxpQkFBQSxDQUFBLENBQUEsV0FBQSxFQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsV0FBQSxDQUFBLElBQUEsTUFBQSxDQUFBLGNBQUEsQ0FBQSxtQkFBQSxLQUFBLENBQUEsSUFBQSxDQUFBLENBQUEsT0FBQSxDQUFBLCtEQUFBLElBQUEsQ0FBQSxDQUFBLFVBQUEsaUJBQUEsQ0FBQSxDQUFBLEVBQUEsTUFBQTtBQUFBLFNBQUEsa0JBQUEsR0FBQSxFQUFBLEdBQUEsUUFBQSxHQUFBLFlBQUEsR0FBQSxHQUFBLEdBQUEsQ0FBQSxNQUFBLEVBQUEsR0FBQSxHQUFBLEdBQUEsQ0FBQSxNQUFBLFdBQUEsQ0FBQSxNQUFBLElBQUEsT0FBQSxLQUFBLENBQUEsR0FBQSxHQUFBLENBQUEsR0FBQSxHQUFBLEVBQUEsQ0FBQSxJQUFBLElBQUEsQ0FBQSxDQUFBLElBQUEsR0FBQSxDQUFBLENBQUEsVUFBQSxJQUFBO0FBQUEsU0FBQSxzQkFBQSxDQUFBLEVBQUEsQ0FBQSxRQUFBLENBQUEsV0FBQSxDQUFBLGdDQUFBLE1BQUEsSUFBQSxDQUFBLENBQUEsTUFBQSxDQUFBLFFBQUEsS0FBQSxDQUFBLDRCQUFBLENBQUEsUUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxPQUFBLENBQUEsT0FBQSxDQUFBLGlCQUFBLENBQUEsSUFBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxDQUFBLEdBQUEsSUFBQSxRQUFBLENBQUEsUUFBQSxNQUFBLENBQUEsQ0FBQSxNQUFBLENBQUEsVUFBQSxDQUFBLHVCQUFBLENBQUEsSUFBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxDQUFBLEdBQUEsSUFBQSxNQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsQ0FBQSxDQUFBLEtBQUEsR0FBQSxDQUFBLENBQUEsTUFBQSxLQUFBLENBQUEsR0FBQSxDQUFBLGlCQUFBLENBQUEsSUFBQSxDQUFBLE9BQUEsQ0FBQSxHQUFBLENBQUEseUJBQUEsQ0FBQSxZQUFBLENBQUEsZUFBQSxDQUFBLEdBQUEsQ0FBQSxjQUFBLE1BQUEsQ0FBQSxDQUFBLE1BQUEsQ0FBQSwyQkFBQSxDQUFBLFFBQUEsQ0FBQSxhQUFBLENBQUE7QUFBQSxTQUFBLGdCQUFBLEdBQUEsUUFBQSxLQUFBLENBQUEsT0FBQSxDQUFBLEdBQUEsVUFBQSxHQUFBO0FBQUEsU0FBQSxRQUFBLENBQUEsc0NBQUEsT0FBQSx3QkFBQSxNQUFBLHVCQUFBLE1BQUEsQ0FBQSxRQUFBLGFBQUEsQ0FBQSxrQkFBQSxDQUFBLGdCQUFBLENBQUEsV0FBQSxDQUFBLHlCQUFBLE1BQUEsSUFBQSxDQUFBLENBQUEsV0FBQSxLQUFBLE1BQUEsSUFBQSxDQUFBLEtBQUEsTUFBQSxDQUFBLFNBQUEscUJBQUEsQ0FBQSxLQUFBLE9BQUEsQ0FBQSxDQUFBO0FBQUEsU0FBQSxrQkFBQSxNQUFBLEVBQUEsS0FBQSxhQUFBLENBQUEsTUFBQSxDQUFBLEdBQUEsS0FBQSxDQUFBLE1BQUEsRUFBQSxDQUFBLFVBQUEsVUFBQSxHQUFBLEtBQUEsQ0FBQSxDQUFBLEdBQUEsVUFBQSxDQUFBLFVBQUEsR0FBQSxVQUFBLENBQUEsVUFBQSxXQUFBLFVBQUEsQ0FBQSxZQUFBLHdCQUFBLFVBQUEsRUFBQSxVQUFBLENBQUEsUUFBQSxTQUFBLE1BQUEsQ0FBQSxjQUFBLENBQUEsTUFBQSxFQUFBLGNBQUEsQ0FBQSxVQUFBLENBQUEsR0FBQSxHQUFBLFVBQUE7QUFBQSxTQUFBLGFBQUEsV0FBQSxFQUFBLFVBQUEsRUFBQSxXQUFBLFFBQUEsVUFBQSxFQUFB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QkFBQSxNQUFBLFVBQUEsR0FBQSxPQUFBLENBQUEsU0FBQSxDQUFBLElBQUEsYUFBQSxVQUFBLFlBQUEsV0FBQSxNQUFBLEVBQUEsSUFBQSxFQUFBLEtBQUEsUUFBQSxDQUFBLFdBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxLQUFBLENBQUEsQ0FBQSxFQUFBLElBQUEsT0FBQSxXQUFBLEdBQUEsUUFBQSxDQUFBLElBQUEsQ0FBQSxLQUFBLENBQUEsTUFBQSxFQUFBLENBQUEsT0FBQSxRQUFBLE9BQUEsV0FBQSxRQUFBLEtBQUEsRUFBQSxlQUFBLENBQUEsUUFBQSxFQUFBLEtBQUEsQ0FBQSxTQUFBLFVBQUEsUUFBQSxjQUFBLFVBQUEsQ0FBQSxLQUFBLE9BQUEsU0FBQTtBQUFBLFNBQUEsMEJBQUEsZUFBQSxPQUFBLHFCQUFBLE9BQUEsQ0FBQSxTQUFBLG9CQUFBLE9BQUEsQ0FBQSxTQUFBLENBQUEsSUFBQSwyQkFBQSxLQUFBLG9DQUFBLE9BQUEsQ0FBQSxTQUFBLENBQUEsT0FBQSxDQUFBLElBQUEsQ0FBQSxPQUFBLENBQUEsU0FBQSxDQUFBLE9BQUEsOENBQUEsQ0FBQTtBQUFBLFNBQUEsa0JBQUEsRUFBQSxXQUFBLFFBQUEsQ0FBQSxRQUFBLENBQUEsSUFBQSxDQUFBLEVBQUEsRUFBQSxPQUFBO0FBQUEsU0FBQSxnQkFBQSxDQUFBLEVBQUEsQ0FBQSxJQUFBLGVBQUEsR0FBQSxNQUFBLENBQUEsY0FBQSxHQUFBLE1BQUEsQ0FBQSxjQUFBLENBQUEsSUFBQSxjQUFBLGdCQUFBLENBQUEsRUFBQSxDQUFBLElBQUEsQ0FBQSxDQUFBLFNBQUEsR0FBQSxDQUFBLFNBQUEsQ0FBQSxZQUFBLGVBQUEsQ0FBQSxDQUFBLEVBQUEsQ0FBQTtBQUFBLFNBQUEsZ0JBQUEsQ0FBQSxJQUFBLGVBQUEsR0FBQSxNQUFBLENBQUEsY0FBQSxHQUFBLE1BQUEsQ0FBQSxjQUFBLENBQUEsSUFBQSxjQUFBLGdCQUFBLENBQUEsV0FBQSxDQUFBLENBQUEsU0FBQSxJQUFBLE1BQUEsQ0FBQSxjQUFBLENBQUEsQ0FBQSxhQUFB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LE1BQU07RUFDcEIsc0JBQXNCLEVBQUUsTUFBTTtFQUM5QixRQUFRLEVBQUUsTUFBTTtFQUNoQixrQkFBa0IsRUFBRSxNQUFNO0VBQzFCLGdCQUFnQixFQUFFO0FBQ3BCLENBQUM7QUFFRCxJQUFNLGFBQWEsR0FBQSxPQUFBLENBQUEsYUFBQSxHQUFHLFNBQWhCLGFBQWEsQ0FBSSxHQUFHLEVBQUs7RUFDN0IsR0FBRyxDQUFDLEtBQUssQ0FBQyxlQUFlLEdBQUcsT0FBTyxDQUFDLFVBQVU7QUFDaEQsQ0FBQztBQUVELElBQU0sZUFBZSxHQUFBLE9BQUEsQ0FBQSxlQUFBLEdBQUcsU0FBbEIsZUFBZSxDQUFJLEdBQUcsRUFBSztFQUMvQixHQUFHLENBQUMsS0FBSyxDQUFDLGVBQWUsR0FBRyxPQUFPLENBQUMsa0JBQWtCO0FBQ3hELENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIndXNlIHN0cmljdCc7XG4vLyBGb3IgbW9yZSBpbmZvcm1hdGlvbiBhYm91dCBicm93c2VyIGZpZWxkLCBjaGVjayBvdXQgdGhlIGJyb3dzZXIgZmllbGQgYXQgaHR0cHM6Ly9naXRodWIuY29tL3N1YnN0YWNrL2Jyb3dzZXJpZnktaGFuZGJvb2sjYnJvd3Nlci1maWVsZC5cblxudmFyIHN0eWxlRWxlbWVudHNJbnNlcnRlZEF0VG9wID0gW107XG5cbnZhciBpbnNlcnRTdHlsZUVsZW1lbnQgPSBmdW5jdGlvbihzdHlsZUVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICB2YXIgaGVhZCA9IGRvY3VtZW50LmhlYWQgfHwgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXTtcbiAgICB2YXIgbGFzdFN0eWxlRWxlbWVudEluc2VydGVkQXRUb3AgPSBzdHlsZUVsZW1lbnRzSW5zZXJ0ZWRBdFRvcFtzdHlsZUVsZW1lbnRzSW5zZXJ0ZWRBdFRvcC5sZW5ndGggLSAxXTtcblxuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgIG9wdGlvbnMuaW5zZXJ0QXQgPSBvcHRpb25zLmluc2VydEF0IHx8ICdib3R0b20nO1xuXG4gICAgaWYgKG9wdGlvbnMuaW5zZXJ0QXQgPT09ICd0b3AnKSB7XG4gICAgICAgIGlmICghbGFzdFN0eWxlRWxlbWVudEluc2VydGVkQXRUb3ApIHtcbiAgICAgICAgICAgIGhlYWQuaW5zZXJ0QmVmb3JlKHN0eWxlRWxlbWVudCwgaGVhZC5maXJzdENoaWxkKTtcbiAgICAgICAgfSBlbHNlIGlmIChsYXN0U3R5bGVFbGVtZW50SW5zZXJ0ZWRBdFRvcC5uZXh0U2libGluZykge1xuICAgICAgICAgICAgaGVhZC5pbnNlcnRCZWZvcmUoc3R5bGVFbGVtZW50LCBsYXN0U3R5bGVFbGVtZW50SW5zZXJ0ZWRBdFRvcC5uZXh0U2libGluZyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBoZWFkLmFwcGVuZENoaWxkKHN0eWxlRWxlbWVudCk7XG4gICAgICAgIH1cbiAgICAgICAgc3R5bGVFbGVtZW50c0luc2VydGVkQXRUb3AucHVzaChzdHlsZUVsZW1lbnQpO1xuICAgIH0gZWxzZSBpZiAob3B0aW9ucy5pbnNlcnRBdCA9PT0gJ2JvdHRvbScpIHtcbiAgICAgICAgaGVhZC5hcHBlbmRDaGlsZChzdHlsZUVsZW1lbnQpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCB2YWx1ZSBmb3IgcGFyYW1ldGVyIFxcJ2luc2VydEF0XFwnLiBNdXN0IGJlIFxcJ3RvcFxcJyBvciBcXCdib3R0b21cXCcuJyk7XG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgLy8gQ3JlYXRlIGEgPGxpbms+IHRhZyB3aXRoIG9wdGlvbmFsIGRhdGEgYXR0cmlidXRlc1xuICAgIGNyZWF0ZUxpbms6IGZ1bmN0aW9uKGhyZWYsIGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgdmFyIGhlYWQgPSBkb2N1bWVudC5oZWFkIHx8IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF07XG4gICAgICAgIHZhciBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGluaycpO1xuXG4gICAgICAgIGxpbmsuaHJlZiA9IGhyZWY7XG4gICAgICAgIGxpbmsucmVsID0gJ3N0eWxlc2hlZXQnO1xuXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBhdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgICBpZiAoICEgYXR0cmlidXRlcy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgdmFsdWUgPSBhdHRyaWJ1dGVzW2tleV07XG4gICAgICAgICAgICBsaW5rLnNldEF0dHJpYnV0ZSgnZGF0YS0nICsga2V5LCB2YWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBoZWFkLmFwcGVuZENoaWxkKGxpbmspO1xuICAgIH0sXG4gICAgLy8gQ3JlYXRlIGEgPHN0eWxlPiB0YWcgd2l0aCBvcHRpb25hbCBkYXRhIGF0dHJpYnV0ZXNcbiAgICBjcmVhdGVTdHlsZTogZnVuY3Rpb24oY3NzVGV4dCwgYXR0cmlidXRlcywgZXh0cmFPcHRpb25zKSB7XG4gICAgICAgIGV4dHJhT3B0aW9ucyA9IGV4dHJhT3B0aW9ucyB8fCB7fTtcblxuICAgICAgICB2YXIgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgICAgICBzdHlsZS50eXBlID0gJ3RleHQvY3NzJztcblxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gYXR0cmlidXRlcykge1xuICAgICAgICAgICAgaWYgKCAhIGF0dHJpYnV0ZXMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHZhbHVlID0gYXR0cmlidXRlc1trZXldO1xuICAgICAgICAgICAgc3R5bGUuc2V0QXR0cmlidXRlKCdkYXRhLScgKyBrZXksIHZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzdHlsZS5zaGVldCkgeyAvLyBmb3IganNkb20gYW5kIElFOStcbiAgICAgICAgICAgIHN0eWxlLmlubmVySFRNTCA9IGNzc1RleHQ7XG4gICAgICAgICAgICBzdHlsZS5zaGVldC5jc3NUZXh0ID0gY3NzVGV4dDtcbiAgICAgICAgICAgIGluc2VydFN0eWxlRWxlbWVudChzdHlsZSwgeyBpbnNlcnRBdDogZXh0cmFPcHRpb25zLmluc2VydEF0IH0pO1xuICAgICAgICB9IGVsc2UgaWYgKHN0eWxlLnN0eWxlU2hlZXQpIHsgLy8gZm9yIElFOCBhbmQgYmVsb3dcbiAgICAgICAgICAgIGluc2VydFN0eWxlRWxlbWVudChzdHlsZSwgeyBpbnNlcnRBdDogZXh0cmFPcHRpb25zLmluc2VydEF0IH0pO1xuICAgICAgICAgICAgc3R5bGUuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzVGV4dDtcbiAgICAgICAgfSBlbHNlIHsgLy8gZm9yIENocm9tZSwgRmlyZWZveCwgYW5kIFNhZmFyaVxuICAgICAgICAgICAgc3R5bGUuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzVGV4dCkpO1xuICAgICAgICAgICAgaW5zZXJ0U3R5bGVFbGVtZW50KHN0eWxlLCB7IGluc2VydEF0OiBleHRyYU9wdGlvbnMuaW5zZXJ0QXQgfSk7XG4gICAgICAgIH1cbiAgICB9XG59O1xuIiwiaW1wb3J0IHsgc2VsZWN0ZWRTdHlsZSwgdW5zZWxlY3RlZFN0eWxlIH0gZnJvbSAnLi9zdHlsZXMuanMnO1xuaW1wb3J0IHsgY29uZmlnLCBjYWxlbmRhciwgbGFzdERhdGVDbGlja2VkIH0gZnJvbSAnLi9jYWxlbmRhckdlbmVyYXRvci5qcyc7XG5pbXBvcnQgeyBkaXNwbGF5VGltZUNob29zZXJNb2RhbCwgZ2V0U2VsZWN0ZWRUaW1lcyB9IGZyb20gJy4vZGlzcGxheVRpbWVDaG9vc2VyTW9kYWwuanMnO1xuXG4vKipcbiAqIENhbGN1bGF0ZXMgdGhlIHRpbWUgdmFsdWUgaW4gbWlsbGlzZWNvbmRzIGJhc2VkIG9uIHRoZSBnaXZlbiB0aW1lLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB0aW1lIC0gVGhlIHRpbWUgaW4gdGhlIGZvcm1hdCBcIkhIOk1NXCIuXG4gKiBAcmV0dXJuIHtudW1iZXJ9IFRoZSB0aW1lIHZhbHVlIGluIG1pbGxpc2Vjb25kcy5cbiAqXG4gKiBAaGFzVGVzdHNcbiAqXG4gKiBAZXhhbXBsZVxuICogLy8gRXhhbXBsZSB1c2FnZTpcbiAqIGNvbnN0IHRpbWVWYWx1ZSA9IHRpbWVWYWx1ZUluTWlsbCgnMTI6MzAnKTtcbiAqL1xuXG5mdW5jdGlvbiB0aW1lVmFsdWVJbk1pbGwgKHRpbWUpIHtcbiAgaWYgKCF0aW1lLmluY2x1ZGVzKCc6JykpIHtcbiAgICBjb25zdCBlID0gbmV3IEVycm9yKCdFeHBlY3RzIGEgdGltZSBzdHJpbmcgSEg6TU0nKTtcbiAgICB0aHJvdyBlO1xuICB9XG4gIGNvbnN0IFtob3VycywgbWludXRlc10gPSB0aW1lLnNwbGl0KCc6Jyk7XG4gIHJldHVybiAocGFyc2VJbnQoaG91cnMpICogNjAgKiA2MCAqIDEwMDApICsgKHBhcnNlSW50KG1pbnV0ZXMpICogNjAgKiAxMDAwKTtcbn1cblxuLyoqXG4gKiB2YXIgZ2V0RGF5c0luTW9udGggLSBHZXQgbnVtYmVyIG9mIGRheXMgaW4gbW9udGhcbiAqXG4gKiBAcGFyYW0gIHshbnVtYmVyfSBtb250aCBUaGUgbnVtYmVyIG9mIHRoZSBjb3JyZXNwb25kaW5nIG1vbnRoLlxuICogQHBhcmFtICB7IW51bWJlcn0geWVhciAgVGhlIGNvcnJlc3BvbmRpbmcgeWVhci5cbiAqIEByZXR1cm4ge251bWJlcn0gUmV0dXJucyBhIG51bWJlciBjb3JyZXNwb25kaW5nIHRvIHRoZSBudW1iZXIgb2YgZGF5cyBmb3IgdGhlIGRhdGUgaW4gcG9pbnQuXG4gKi9cbmZ1bmN0aW9uIGdldERheXNJbk1vbnRoIChtb250aCwgeWVhcikge1xuICByZXR1cm4gbmV3IERhdGUoeWVhciwgbW9udGgsIDApLmdldERhdGUoKTtcbn1cblxuLyoqXG4gKiBDaGVja3MgZm9yIG92ZXJsYXAgaW4gYW4gYXJyYXkgb2YgdmFsdWVzLlxuICpcbiAqIEBwYXJhbSB7QXJyYXl9IHZhbHVlcyAtIFRoZSBhcnJheSBvZiB2YWx1ZXMgdG8gY2hlY2sgZm9yIG92ZXJsYXAuXG4gKiBAcmV0dXJuIHtib29sZWFufSAtIFJldHVybnMgdHJ1ZSBpZiBvdmVybGFwIGlzIGZvdW5kLCBmYWxzZSBvdGhlcndpc2UuXG4gKi9cbmZ1bmN0aW9uIGNoZWNrT3ZlcmxhcCAodmFsdWVzKSB7XG4gIGNvbnN0IG51bWVyaWNhbEVxdWl2YWxlbnQgPSB2YWx1ZXMubWFwKHRpbWVWYWx1ZUluTWlsbCk7XG5cbiAgZm9yIChsZXQgY3VycmVudEluZGV4ID0gMjsgY3VycmVudEluZGV4IDwgbnVtZXJpY2FsRXF1aXZhbGVudC5sZW5ndGg7IGN1cnJlbnRJbmRleCArPSAyKSB7XG4gICAgY29uc3QgY3VycmVudFN0YXJ0ID0gbnVtZXJpY2FsRXF1aXZhbGVudFtjdXJyZW50SW5kZXhdO1xuICAgIGNvbnN0IGN1cnJlbnRFbmQgPSBudW1lcmljYWxFcXVpdmFsZW50W2N1cnJlbnRJbmRleCArIDFdO1xuXG4gICAgZm9yIChsZXQgY29tcGFyaXNvbkluZGV4ID0gMDsgY29tcGFyaXNvbkluZGV4IDwgbnVtZXJpY2FsRXF1aXZhbGVudC5sZW5ndGg7IGNvbXBhcmlzb25JbmRleCArPSAyKSB7XG4gICAgICBpZiAoY3VycmVudEluZGV4ICE9PSBjb21wYXJpc29uSW5kZXgpIHtcbiAgICAgICAgY29uc3QgY29tcGFyaXNvblN0YXJ0ID0gbnVtZXJpY2FsRXF1aXZhbGVudFtjb21wYXJpc29uSW5kZXhdO1xuICAgICAgICBjb25zdCBjb21wYXJpc29uRW5kID0gbnVtZXJpY2FsRXF1aXZhbGVudFtjb21wYXJpc29uSW5kZXggKyAxXTtcblxuICAgICAgICBpZiAoY29tcGFyaXNvbkVuZCA+PSBjdXJyZW50U3RhcnQgJiYgY29tcGFyaXNvbkVuZCA8PSBjdXJyZW50RW5kKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gZWxzZSBpZiAoY3VycmVudFN0YXJ0ID49IGNvbXBhcmlzb25TdGFydCAmJiBjdXJyZW50RW5kIDw9IGNvbXBhcmlzb25FbmQpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIGlmIChjdXJyZW50U3RhcnQgPT09IGNvbXBhcmlzb25TdGFydCAmJiBjdXJyZW50RW5kID09PSBjb21wYXJpc29uRW5kKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gZWxzZSBpZiAoY3VycmVudEVuZCA+PSBjb21wYXJpc29uU3RhcnQgJiYgY3VycmVudEVuZCA8PSBjb21wYXJpc29uRW5kKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBDbGVhcnMgdGhlIHNlbGVjdGlvbiBvZiBkYXRlcyBpbiB0aGUgY2FsZW5kYXIuXG4gKlxuICogQHBhcmFtIHt1bmRlZmluZWR9XG4gKiBAcmV0dXJuIHt1bmRlZmluZWR9XG4gKi9cbmZ1bmN0aW9uIGNsZWFyU2VsZWN0aW9uIChjYWxlbmRhciwgZHluYW1pY0RhdGEpIHtcbiAgY29uc3QgZGF0ZXNPYmpTdG9yZSA9IGR5bmFtaWNEYXRhLmRhdGVzU2VsZWN0ZWRBcnJheU9iamVjdHM7XG4gIGNvbnN0IGRhdGVzSW5kZXggPSBkeW5hbWljRGF0YS5kYXRlc1NlbGVjdGVkQXJyYXk7XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRlc09ialN0b3JlLmxlbmd0aDsgaSsrKSB7XG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBkYXRlc0luZGV4Lmxlbmd0aDsgaisrKSB7XG4gICAgICBkYXRlc0luZGV4W2pdLmZvckVhY2goKGRhdGUpID0+IHtcbiAgICAgICAgdW5zZWxlY3RlZFN0eWxlKGNhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLWh1bWFuZGF0ZT0nJHtkYXRlfSddYCkpO1xuICAgICAgICBpZiAoaSA9PT0gZGF0ZXNPYmpTdG9yZS5sZW5ndGggLSAxICYmIGogPT09IGRhdGVzSW5kZXgubGVuZ3RoIC0gMSkge1xuICAgICAgICAgIGRhdGVzT2JqU3RvcmUubGVuZ3RoID0gMDtcbiAgICAgICAgICBkYXRlc0luZGV4Lmxlbmd0aCA9IDA7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufVxuXG4vKlxuXG4qL1xuXG4vKipcbiAqIEBwYXJhbSB7bnVtYmVyfSBbbGVuZ3RoPTEwXSAtbGVuZ3RoIHRoZSBkZXNpcmVkIGxlbmd0aCBvZiB0aGUgc3RyaW5nIG9mIG51bWJlcnMuXG4gKiBAcmV0dXJucyBhIHN0cmluZyBvZiByYW5kb20gZGlnaXRzIG9mIGEgc3BlY2lmaWVkIGxlbmd0aC5cbiAqL1xuXG5mdW5jdGlvbiByYW5kb21CeXRlcyAobGVuZ3RoKSB7XG4gIGlmIChsZW5ndGggPiA4MCkge1xuICAgIGNvbnN0IGUgPSBuZXcgRXJyb3IoJ3JhbmRvbUJ5dGVzIGxlbmd0aCBjYW4gYmUgbW9yZSB0aGFuIDgwMCBkaWdpdHMnKTtcbiAgICB0aHJvdyBlO1xuICB9XG4gIGNvbnN0IGFycmF5ID0gbmV3IFVpbnQzMkFycmF5KDEwMCk7XG4gIHdpbmRvdy5jcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKGFycmF5KTtcbiAgbGV0IHN0ID0gJyc7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICBzdCArPSBhcnJheVtpXTtcbiAgICBpZiAoaSA9PT0gYXJyYXkubGVuZ3RoIC0gMSkge1xuICAgICAgcmV0dXJuIHN0LnNsaWNlKHN0Lmxlbmd0aCAtIChsZW5ndGggfHwgMTApKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2VuZXJhdGVSYW5kb21TdHJpbmcoKSB7XG4gIGNvbnN0IHJhbmRvbVN0cmluZyA9IHJhbmRvbUJ5dGVzKDEwKTtcbiAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjYWxlbmRhci0nICsgcmFuZG9tU3RyaW5nKSkge1xuICAgIHJldHVybiBnZW5lcmF0ZVJhbmRvbVN0cmluZygpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiByYW5kb21TdHJpbmc7XG4gIH1cbn1cblxuLy9XRSBXRVJFIFNFVFRJTkcgVVAgVEhFIENBTEVOREFSIFRPIFJFTkRFUiBEQVRFUyBJTiBUSEUgUEFTVDpcbi8qIFdhcm5pbmc6IENvbnRlbXBsYXRlcyBkYXlsaWdodCBzYXZpbmcgdGltZSovXG5cbmZ1bmN0aW9uIGdldEVhcmxpZXN0RGF0ZSAocHJlbG9hZGVkRGF0ZXMpIHtcbiAgY29uc3Qgb3JkZXIgPSBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBwcmVsb2FkZWREYXRlcy5sZW5ndGg7IGkrKykge1xuICAgIGlmIChpID09PSAwKSB7XG4gICAgICBvcmRlci5wdXNoKG5ldyBEYXRlKCkuZ2V0VGltZSgpKTtcbiAgICB9XG4gICAgb3JkZXIucHVzaChuZXcgRGF0ZShwcmVsb2FkZWREYXRlc1tpXSkuZ2V0VGltZSgpKTtcbiAgICBpZiAoaSA9PT0gcHJlbG9hZGVkRGF0ZXMubGVuZ3RoIC0gMSkge1xuICAgICAgb3JkZXIuc29ydCgpO1xuICAgICAgY29uc3QgZCA9IG5ldyBEYXRlKG9yZGVyWzBdKTtcbiAgICAgIHJldHVybiBkO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIENvbnZlcnRzIGFuIGFycmF5IG9mIGRhdGVzIGludG8gYSBuZXcgYXJyYXkgb2Ygb2JqZWN0cyB3aXRoIGZvcm1hdHRlZCBkYXRlcy5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBkYXRlcyAtIFRoZSBhcnJheSBvZiBkYXRlcy5cbiAqIEByZXR1cm4ge1Byb21pc2V9IEEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIHRoZSBuZXcgYXJyYXkgb2Ygb2JqZWN0cy5cbiAqL1xuZnVuY3Rpb24gY29udmVydERhdGVzIChkYXRlcykge1xuICBjb25zdCBwcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChkYXRlc1tpXS5kYXkpIHtcbiAgICAgICAgZHluYW1pY0RhdGEuZGF0ZXNTZWxlY3RlZEFycmF5T2JqZWN0cy5wdXNoKGRhdGVzW2ldKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICAvLyBkeW5hbWljRGF0YS5kYXRlc1NlbGVjdGVkQXJyYXlPYmplY3RzLnB1c2goeyBkYXk6IHN0YW5kYXJkRGF0ZU9iamVjdChkYXRlc1tpXSkgfSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHByb21pc2U7XG59XG5cbi8qKlxuICogQXN5bmNocm9ub3VzbHkgcHJlbG9hZHMgZGF0ZXMgZm9yIHRoZSBjYWxlbmRhci5cbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gY2FsZW5kYXIgLSB0aGUgY2FsZW5kYXIgb2JqZWN0XG4gKiBAcGFyYW0ge2FycmF5fSBkYXRlcyAtIGFuIGFycmF5IG9mIGRhdGVzIHRvIHByZWxvYWRcbiAqIEByZXR1cm4ge3ZvaWR9IFxuICovXG5hc3luYyBmdW5jdGlvbiBwcmVsb2FkRGF0ZXMgKGNhbGVuZGFyLCBkYXRlcykge1xuICAvLyBjb25zb2xlLmxvZygnUFJFTE9BRElORyBEQVRFUy4uLicpO1xuICAvLyBjb25zb2xlLmxvZyhjYWxlbmRhcik7XG4gIC8vIGNvbnNvbGUubG9nKGRhdGVzKTtcbiAgZGF0ZXMgPSBbJzIwMjMtMDktMDknXVxuICBsZXQgZW5kVXNlciA9IDE7XG4gIC8vYXR0YWNoKGRhdGVOb2RlKTtcbiAgYXdhaXQgY29udmVydERhdGVzKGRhdGVzKTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGVzU2VsZWN0ZWRBcnJheU9iamVjdHMubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBkYXRlT2JqZWN0ID0gZGF0ZXNTZWxlY3RlZEFycmF5T2JqZWN0c1tpXTtcbiAgICBjb25zdCBkYXRlTm9kZSA9IGNhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoYCMke2RhdGVPYmplY3QuZGF5fWApO1xuXG4gICAgaWYgKGRhdGVOb2RlKSB7XG4gICAgICBkYXRlc1NlbGVjdGVkQXJyYXkucHVzaChkYXRlc1tpXS5kYXkpO1xuICAgICAgZGF0ZU5vZGUuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJyNmYzMnO1xuICAgICAgZGF0ZU5vZGUuY2xhc3NMaXN0LmFkZCgnYXZhaWxhYmxlJyk7XG4gICAgfVxuXG4gICAgaWYgKGVuZFVzZXIpIHtcbiAgICAgIGF0dGFjaChkYXRlTm9kZSk7XG4gICAgICAvL3RpbWVDaG9vc2VyKCk7XG4gICAgfVxuXG4gICAgaWYgKGRpc3BsYXlUaW1lQ2hvb3Nlck1vZGFsKSB7XG4gICAgICAvLyBjcmVhdGVUaW1lRWxlbWVudHMgKCk7XG4gICAgICAvL2dlbmVyYXRlVGltZXNPbmx5KGRhdGVPYmplY3QudGltZXMsIGRhdGVOb2RlKTtcbiAgICB9XG5cbiAgICBpZiAoc2VsZWN0UmFuZ2UgJiYgZGF0ZU5vZGUgJiYgIWRhdGVOb2RlLmNsYXNzTGlzdC5jb250YWlucygnZmlsbGVyJykpIHtcbiAgICAgIGRhdGVOb2RlLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICcjMzMzJztcbiAgICAgIGRhdGVOb2RlLmNsYXNzTGlzdC5hZGQoJ2Jsb2NrZWQnKTtcbiAgICAgIGRhdGVOb2RlLnRpdGxlID0gJ05vIGF2YWlsYWJpbGl0eSBvbiB0aGlzIGRheSc7XG5cbiAgICAgIGNvbnN0IHNvbGRPdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgICBzb2xkT3V0LmNsYXNzTGlzdC5hZGQoJ2NhbGVuZGFyVGltZScpO1xuICAgICAgc29sZE91dC50ZXh0Q29udGVudCA9ICdTb2xkIG91dCc7XG4gICAgICBkYXRlTm9kZS5hcHBlbmRDaGlsZChzb2xkT3V0KTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gYmxvY2tEYXlzTm90T3BlbiAoY2FsZW5kYXIsIGRhdGVzT3Blbikge1xuICBpZiAoY2FsZW5kYXIgJiYgZGF0ZXNPcGVuKSB7XG4gICAgY29uc3QgYWxsRGF5cyA9IEFycmF5LmZyb20oY2FsZW5kYXIucXVlcnlTZWxlY3RvckFsbCgnLmRheVRpbWUnKSkubWFwKChlbCkgPT4geyByZXR1cm4gZWwuZGF0YXNldC5odW1hbmRhdGU7IH0pO1xuICAgIGNvbnN0IG9wZW5EYXlzID0gZGF0ZXNPcGVuLm1hcCgoZWwpID0+IHsgcmV0dXJuIGVsLmRheTsgfSk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFsbERheXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChvcGVuRGF5cy5pbmRleE9mKGFsbERheXNbaV0pID09PSAtMSkge1xuICAgICAgICBjb25zdCBkYXkgPSBjYWxlbmRhci5xdWVyeVNlbGVjdG9yKGBbaWQ9XCIke2FsbERheXNbaV19XCJdYCk7XG4gICAgICAgIGRheS5jbGFzc0xpc3QuYWRkKCd3aWR0aFNoYXBlJywgJ2ZpbGxlcicpO1xuICAgICAgICBkYXkuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJ3doaXRlJztcbiAgICAgICAgZGF5LnRpdGxlID0gJ0Nsb3NlZCBvbiB0aGlzIGRheSc7XG5cbiAgICAgICAgY29uc3QgY2xvc2VkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgICAgICBjbG9zZWQuY2xhc3NMaXN0LmFkZCgnY2FsZW5kYXJUaW1lJyk7XG4gICAgICAgIGNsb3NlZC50ZXh0Q29udGVudCA9ICdjbG9zZWQnO1xuXG4gICAgICAgIGRheS5hcHBlbmRDaGlsZChjbG9zZWQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFJlbGVhc2UgYm9va2VkIGRheVxuICogQGRlc2NyaXB0aW9uIFJlbW92ZXMgYSBkYXkgdGhhdCBoYXMgYmVlbiBwcmV2aW91c2x5IGJvb2tlZC5cbiAqIEBmdW5jdGlvbiByZWxlYXNlQm9va2VkRGF5XG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBkYXkgLSBIVE1MIGRpdiBlbGVtZW50IHJlcHJlc2VudGluZyB0aGUgZGF5LlxuICogQHBhcmFtIHtzdHJpbmd9IGRhdGUgLSBEYXRlIHN0cmluZyBpbiB0aGUgZm9ybWF0ICdZWVlZLU1NLUREJy5cbiAqL1xuZnVuY3Rpb24gcmVsZWFzZUJvb2tlZERheSAoZGF5LCBkYXRlKSB7XG4gIGNvbnN0IGluZGV4ID0gZGF0ZXNTZWxlY3RlZEFycmF5LmluZGV4T2YoZGF0ZSk7XG4gIHVuc2VsZWN0ZWRTdHlsZShkYXkpO1xuICBkYXRlc1NlbGVjdGVkQXJyYXkuc3BsaWNlKGluZGV4LCAxKTtcbiAgZGF0ZXNTZWxlY3RlZEFycmF5T2JqZWN0cy5zcGxpY2UoaW5kZXgsIDEpO1xuXG4gIHdoaWxlIChkYXkuZmlyc3RDaGlsZCkge1xuICAgIGRheS5maXJzdENoaWxkLnJlbW92ZSgpO1xuICB9XG59XG5cbi8qKlxuICogQWRkcyAxIHRvIHRoZSBtb250aCBpbiBhIGdpdmVuIGRhdGUgdG8gbWFrZSBpdCBtb3JlIGh1bWFuLXJlYWRhYmxlLlxuICogQHBhcmFtIHtzdHJpbmd9IGRhdGUgLSBUaGUgZGF0ZSBpbiB0aGUgZm9ybWF0ICdZWVlZLU1NLUREJyBvciAnWVlZWS1NLUQnLlxuICogQHJldHVybnMge3N0cmluZ30gLSBUaGUgbW9kaWZpZWQgZGF0ZSBpbiB0aGUgZm9ybWF0ICdZWVlZLU1NLUREJy5cbiAqIEB0aHJvd3Mge0Vycm9yfSAtIElmIHRoZSBkYXRlIHBhcmFtZXRlciBpcyBub3QgaW4gdGhlIGZvcm1hdCAnWVlZWS1NTS1ERCcgb3IgJ1lZWVktTS1EJy5cbiAqL1xuZnVuY3Rpb24gaHVtYW5EYXRlIChkYXRlKSB7XG4gIGNvbnN0IGRhdGVQYXJ0cyA9IGRhdGUuc3BsaXQoJy0nKTtcbiAgY29uc3QgbW9udGggPSBwYXJzZUludChkYXRlUGFydHNbMV0pICsgMTtcbiAgY29uc3QgZGF5ID0gcGFyc2VJbnQoZGF0ZVBhcnRzWzJdKTtcbiAgY29uc3QgbW9kaWZpZWRNb250aCA9IG1vbnRoIDwgMTAgPyBgMCR7bW9udGh9YCA6IG1vbnRoO1xuICBjb25zdCBtb2RpZmllZERheSA9IGRheSA8IDEwID8gYDAke2RheX1gIDogZGF5O1xuICBjb25zdCBtb2RpZmllZERhdGUgPSBgJHtkYXRlUGFydHNbMF19LSR7bW9kaWZpZWRNb250aH0tJHttb2RpZmllZERheX1gO1xuICByZXR1cm4gbW9kaWZpZWREYXRlO1xufVxuXG5cbmZ1bmN0aW9uIHNvcnRUaW1lcyAodmFsKSB7XG4gIHZhciBzb3J0ZWQgPSBbXTtcbiAgcmV0dXJuIGVudW1lcmF0ZSh2YWwpO1xuXG4gIGZ1bmN0aW9uIHNvcnROdW1iZXIoYSwgYikge1xuICAgIHJldHVybiBhIC0gYjtcbiAgfVxuXG4gIGZ1bmN0aW9uIGVudW1lcmF0ZSh2YWx1ZXMpIHtcbiAgICB2YXIgbnVtZXJpY2FsRXF1aXZhbGVudCA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmFsdWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBudW1lcmljYWxFcXVpdmFsZW50LnB1c2godGltZVZhbHVlSW5NaWxsKHZhbHVlc1tpXSkpO1xuICAgICAgaWYgKGkgPT09IHZhbHVlcy5sZW5ndGggLSAxKSB7XG4gICAgICAgIHJldHVybiBzb3J0KHZhbHVlcywgbnVtZXJpY2FsRXF1aXZhbGVudCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gc29ydCh2YWx1ZXMsIG51bWVyaWNhbEVxdWl2YWxlbnQpIHtcbiAgICB2YXIgbnVtZXJpY2FsRXF1aXZhbGVudENsb25lID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShudW1lcmljYWxFcXVpdmFsZW50KSk7XG4gICAgdmFyIHNvcnRlZEludCA9IG51bWVyaWNhbEVxdWl2YWxlbnQuc29ydChzb3J0TnVtYmVyKTtcbiAgICBmb3IgKHZhciBwID0gMDsgcCA8IG51bWVyaWNhbEVxdWl2YWxlbnRDbG9uZS5sZW5ndGg7IHArKykge1xuICAgICAgdmFyIG5ld0luZGV4ID0gc29ydGVkSW50LmluZGV4T2YobnVtZXJpY2FsRXF1aXZhbGVudENsb25lW3BdKTtcbiAgICAgIHNvcnRlZC5zcGxpY2UocCwgMSwgdmFsdWVzW25ld0luZGV4XSk7XG4gICAgICBpZiAocCA9PT0gbnVtZXJpY2FsRXF1aXZhbGVudC5sZW5ndGggLSAxKSB7XG4gICAgICAgIHJldHVybiBzb3J0ZWQ7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogUmVsZWFzZSBkYXkgb2Ygd2Vla1xuICogQGZ1bmN0aW9uIHJlbGVhc2VEYXlPZldlZWtHXG4gKiBAcGFyYW0gZGF5SUQgaWQgb2YgdGhlIGRheSB0byBiZSByZWxlYXNlZC4gTi5iLiBkYXkgb2Ygd2VlayBpcyBzdG9yZWQgYXMgYSBkYXRhIGF0dHJpYnV0ZVxuICogQHRvZG8gbWFrZSBpdCB1c2UgbGFzdERhdGVDbGlja2VkICh3aGljaCBpcyB0aGUgZGF5IGluIGNvbnRleHQpXG4gKi9cbmZ1bmN0aW9uIHJlbGVhc2VEYXlPZldlZWtHKGRheUlkKSB7XG4gIGNvbnN0IHdlZWtkYXkgPSBsYXN0RGF0ZUNsaWNrZWQuZGF0YXNldC5kYXlvZndlZWs7XG4gIGNvbnN0IGJsb2NrVGhlc2VEYXlzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIltkYXRhLWRheW9md2Vlaz0nXCIgKyB3ZWVrZGF5ICsgXCInXVwiKTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBibG9ja1RoZXNlRGF5cy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBibG9ja0RheSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGJsb2NrVGhlc2VEYXlzW2ldLmlkKTtcbiAgICBpZiAoYmxvY2tEYXkgIT09IGxhc3REYXRlQ2xpY2tlZCkge1xuICAgICAgcmVsZWFzZUJvb2tlZERheShibG9ja0RheSwgYmxvY2tUaGVzZURheXNbaV0uaWQpO1xuICAgICAgcmVtb3ZlVGltZURpc3BsYXkoYmxvY2tUaGVzZURheXNbaV0uaWQpO1xuICAgIH1cbiAgICBpZiAoYmxvY2tEYXkgPT09IGxhc3REYXRlQ2xpY2tlZCkge1xuICAgICAgLy8gcmVtb3ZlIG9ubHkgdGhlIGRpc3BsYXk6XG4gICAgICAvL3JlbW92ZVRpbWVEaXNwbGF5KGJsb2NrVGhlc2VEYXlzW2ldLmlkKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IHsgdGltZVZhbHVlSW5NaWxsLCBjaGVja092ZXJsYXAsIGNsZWFyU2VsZWN0aW9uLCBnZXREYXlzSW5Nb250aCwgZ2VuZXJhdGVSYW5kb21TdHJpbmcsIGdldEVhcmxpZXN0RGF0ZSxcbiAgcHJlbG9hZERhdGVzLCBibG9ja0RheXNOb3RPcGVuLCByZWxlYXNlQm9va2VkRGF5LCBodW1hbkRhdGUsIHNvcnRUaW1lcyB9O1xuXG4vL2Jvb2tEYXkgc2luZ2xlRGF0ZUNob2ljZVxuLy9yZWxlYXNlQm9va2VkRGF5IGRhdGVzU2VsZWN0ZWRBcnJheU9iamVjdHMgZGF0ZXNTZWxlY3RlZEFycmF5IiwidmFyIGNzcyA9IFwiLmNhbGVuZGFyIHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBmbGV4LXdyYXA6IHdyYXA7XFxuICBmbGV4LWRpcmVjdGlvbjogcm93O1xcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNDAsIDI0OCwgMjU1LCAwKTtcXG4gIHdpZHRoOiAxMDAlO1xcbiAgaGVpZ2h0OiAyOC44ZW07XFxuICBvdmVyZmxvdy15OiBhdXRvO1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbn1cXG4uY2FsZW5kYXIgLmJsb2NrZWQge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogIzMzMztcXG59XFxuLmNhbGVuZGFyIC5maWxsZXIge1xcbiAgcG9pbnRlci1ldmVudHM6IG5vbmU7XFxuICBvcGFjaXR5OiAwLjM7XFxufVxcbi5jYWxlbmRhciAudGltZVNlbGVjdCB7XFxuICBwYWRkaW5nOiAwO1xcbiAgd2lkdGg6IGF1dG87XFxuICBtYXJnaW46IDA7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmO1xcbiAgZmxvYXQ6IHJpZ2h0O1xcbiAgZm9udC13ZWlnaHQ6IDcwMDtcXG4gIGZvbnQtZmFtaWx5OiBBcmlhbCwgSGVsdmV0aWNhLCBzYW5zLXNlcmlmO1xcbiAgYm9yZGVyLXN0eWxlOiBzb2xpZDtcXG4gIGJvcmRlci1yYWRpdXM6IDFlbTtcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuICBib3JkZXItd2lkdGg6IDNweDtcXG4gIGJvcmRlci1jb2xvcjogI2YxNTkyNTtcXG4gIGNvbG9yOiAjMDAwO1xcbiAgZm9udC1zaXplOiAwLjllbTtcXG59XFxuLmNhbGVuZGFyIC50aW1lQ29udCB7XFxuICBtYXJnaW4tbGVmdDogYXV0bztcXG4gIHdpZHRoOiAxMGVtO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogYWxpY2VibHVlO1xcbiAgYm9yZGVyLXN0eWxlOiBzb2xpZDtcXG4gIGJvcmRlci1jb2xvcjogI2YxNTkyNTtcXG4gIG1hcmdpbi1yaWdodDogYXV0bztcXG4gIG1hcmdpbi10b3A6IDEwZW07XFxufVxcbi5jYWxlbmRhciAuZGF5YmxvY2tyb3cge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGZsZXgtZGlyZWN0aW9uOiByb3c7XFxuICBtaW4td2lkdGg6IDEwMCU7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiBhbGljZWJsdWU7XFxufVxcbi5jYWxlbmRhciAuY2FsZW5kYXJUaW1lUGFyZW50IHtcXG4gIG1hcmdpbjogMC4xZW07XFxufVxcbi5jYWxlbmRhciAuY2FsZW5kYXJUaW1lUGFyZW50IC5jYWxlbmRhclRpbWUge1xcbiAgZm9udC1zaXplOiAwLjllbTtcXG4gIG1hcmdpbi10b3A6IDBlbTtcXG4gIGxpbmUtaGVpZ2h0OiAxO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogYWxpY2VibHVlO1xcbiAgY29sb3I6IGJsYWNrO1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgbWFyZ2luOiAwcHg7XFxufVxcbi5jYWxlbmRhciAud2lkdGhTaGFwZURheXMge1xcbiAgd2lkdGg6IDE0LjI4NTcxNDI4NTclO1xcbiAgbWFyZ2luLWxlZnQ6IGF1dG87XFxuICBtYXJnaW4tcmlnaHQ6IGF1dG87XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxufVxcbi5jYWxlbmRhciAud2lkdGhTaGFwZSB7XFxuICB3aWR0aDogMTQuMjg1NzE0Mjg1NyU7XFxuICBtYXJnaW4tbGVmdDogYXV0bztcXG4gIG1hcmdpbi1yaWdodDogYXV0bztcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gIG1pbi1oZWlnaHQ6IDMuNmVtO1xcbiAgbWFyZ2luLWJvdHRvbTogMC4yZW07XFxufVxcbi5jYWxlbmRhciAubW9udGhOYW1lIHtcXG4gIG1hcmdpbjogYXV0bztcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gIGZvbnQtZmFtaWx5OiBVYnVudHU7XFxuICBmb250LXNpemU6IDEuNjFlbTtcXG4gIGJhY2tncm91bmQtY29sb3I6ICMzMzdhYjc7XFxuICBjb2xvcjogI2ZmY2MzMztcXG4gIGZsZXgtYmFzaXM6IDEwMCU7XFxuICBib3JkZXItYm90dG9tLXN0eWxlOiBzb2xpZDtcXG59XFxuLmNhbGVuZGFyIC53ZWVrcm93IHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBmbGV4LXdyYXA6IG5vd3JhcDtcXG4gIGZsZXgtZGlyZWN0aW9uOiByb3c7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmO1xcbiAgZm9udC1mYW1pbHk6IFxcXCJyb2JvdG9cXFwiLCBcXFwiYXJpYWxcXFwiO1xcbn1cXG4uY2FsZW5kYXIgLmRheU5hbWUge1xcbiAgY29sb3I6IGJsYWNrO1xcbiAgZm9udC1mYW1pbHk6IFxcXCJyb2JvdG9cXFwiLCBcXFwiYXJpYWxcXFwiO1xcbiAgZm9udC13ZWlnaHQ6IDYwMDtcXG4gIGJhY2tncm91bmQtY29sb3I6ICNjY2M7XFxufVxcbi5jYWxlbmRhciAubW9udGggPiAqIHtcXG4gIG1hcmdpbi1sZWZ0OiAycHg7XFxuICBtYXJnaW4tcmlnaHQ6IDJweDtcXG59XFxuLmNhbGVuZGFyIC5tb250aCB7XFxuICB3aWR0aDogNTAlO1xcbiAgbWluLXdpZHRoOiAzMDBweDtcXG4gIG1hcmdpbjogYXV0bztcXG59XFxuLmNhbGVuZGFyIC50aW1lQ2hvb3NlciB7XFxuICB3aWR0aDogMTBlbTtcXG4gIHBvc2l0aW9uOiBzdGF0aWM7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiBhbGljZWJsdWU7XFxuICBtYXJnaW4tbGVmdDogYXV0bztcXG4gIG1hcmdpbi1yaWdodDogYXV0bztcXG59XFxuLmNhbGVuZGFyIC50aW1lQ29udGFpbmVyIHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxufVxcbi5jYWxlbmRhciAudGltZUNob29zZXJNb2RhbCB7XFxuICB6LWluZGV4OiAxO1xcbiAgd2lkdGg6IDEwMCU7XFxuICBoZWlnaHQ6IDEwMCU7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuNCk7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICBtYXJnaW46IDA7XFxuICBwYWRkaW5nOiAwO1xcbiAgYm9yZGVyOiAwO1xcbiAgb3ZlcmZsb3cteDogc2Nyb2xsO1xcbn1cXG4uY2FsZW5kYXIgLmNhbGVuZGFyTGFiZWwge1xcbiAgbWluLXdpZHRoOiAzZW07XFxuICBwYWRkaW5nOiAwZW0gMWVtIDBlbSAxZW07XFxuICBjb2xvcjogYmxhY2s7XFxuICBmb250LWZhbWlseTogXFxcInJvYm90b1xcXCIsIFxcXCJhcmlhbFxcXCI7XFxuICBmb250LXdlaWdodDogNjAwO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogI2NjYztcXG4gIG1hcmdpbjogMWVtIDAgMWVtIDA7XFxufVxcbi5jYWxlbmRhciAuZGVsZXRlRGl2IHtcXG4gIGZvbnQtZmFtaWx5OiBVYnVudHU7XFxuICBmb250LXNpemU6IDEuNjFlbTtcXG4gIGJhY2tncm91bmQtY29sb3I6ICMzMzdhYjc7XFxuICBjb2xvcjogI2ZmY2MzMztcXG4gIGJvcmRlci1ib3R0b20tc3R5bGU6IHNvbGlkO1xcbiAgaGVpZ2h0OiAyZW07XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbn1cXG4uY2FsZW5kYXIgLmRlbGV0ZUJ1dHRvbiB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTtcXG4gIGNvbG9yOiAjZjE1OTI1O1xcbiAgZmxvYXQ6IHJpZ2h0O1xcbiAgZm9udC13ZWlnaHQ6IDcwMDtcXG4gIGZvbnQtZmFtaWx5OiBBcmlhbCwgSGVsdmV0aWNhLCBzYW5zLXNlcmlmO1xcbiAgYm9yZGVyLXN0eWxlOiBzb2xpZDtcXG4gIGJvcmRlci1yYWRpdXM6IDFlbTtcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gIGhlaWdodDogMzBweDtcXG4gIHdpZHRoOiAzMHB4O1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG59XFxuLmNhbGVuZGFyIC5pbm5lclNwYW5EZWxldGVCdG4ge1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbn1cXG4uY2FsZW5kYXIgLmRlbGV0ZUJ1dHRvbjpob3ZlcixcXG4uY2FsZW5kYXIgLmRlbGV0ZUJ1dHRvbjpmb2N1cyxcXG4uY2FsZW5kYXIgLnRpbWVTZWxlY3Q6aG92ZXIsXFxuLmNhbGVuZGFyIC50aW1lU2VsZWN0OmZvY3VzIHtcXG4gIGNvbG9yOiAjMDAwO1xcbiAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xcbiAgY3Vyc29yOiBwb2ludGVyO1xcbn1cXG4uY2FsZW5kYXIgLmhvdXIge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gIHdpZHRoOiAxMGVtO1xcbn1cXG4uY2FsZW5kYXIgLnRpbWVTZWxlY3RQIHtcXG4gIGRpc3BsYXk6IGlubGluZTtcXG4gIHdpZHRoOiA1ZW07XFxuICBjb2xvcjogIzAwMDtcXG59XFxuLmNhbGVuZGFyIC50aW1lQ2hvb3NlciA+IGlucHV0W3R5cGU9Y2hlY2tib3hdIHtcXG4gIG91dGxpbmU6ICNmMTU5MjU7XFxuICBvdXRsaW5lLXN0eWxlOiBzb2xpZDtcXG59XFxuLmNhbGVuZGFyIC50aW1lU2VsZWN0ID4gb3B0aW9uIHtcXG4gIGNvbG9yOiAjMDAwO1xcbn1cXG4uY2FsZW5kYXIgLmNhbGVuZGFyID4gcCxcXG4uY2FsZW5kYXIgaDQsXFxuLmNhbGVuZGFyIGgzLFxcbi5jYWxlbmRhciBoMixcXG4uY2FsZW5kYXIgaDEsXFxuLmNhbGVuZGFyIHNlbGVjdCxcXG4uY2FsZW5kYXIgb3B0aW9uIHtcXG4gIGNvbG9yOiAjMDAwO1xcbn1cXG4uY2FsZW5kYXIgLmFycm93LXVwIHtcXG4gIHdpZHRoOiAwO1xcbiAgaGVpZ2h0OiAwO1xcbiAgYm9yZGVyLWxlZnQ6IDEwcHggc29saWQgdHJhbnNwYXJlbnQ7XFxuICBib3JkZXItcmlnaHQ6IDEwcHggc29saWQgdHJhbnNwYXJlbnQ7XFxuICBib3JkZXItYm90dG9tOiAxMHB4IHNvbGlkIGJsYWNrO1xcbn1cXG4uY2FsZW5kYXIgLmFycm93LWRvd24ge1xcbiAgd2lkdGg6IDA7XFxuICBoZWlnaHQ6IDA7XFxuICBib3JkZXItbGVmdDogMTBweCBzb2xpZCB0cmFuc3BhcmVudDtcXG4gIGJvcmRlci1yaWdodDogMTBweCBzb2xpZCB0cmFuc3BhcmVudDtcXG4gIGJvcmRlci10b3A6IDEwcHggc29saWQgIzAwMDtcXG59XFxuLmNhbGVuZGFyIC5hcnJvd3Mge1xcbiAgZmxvYXQ6IHJpZ2h0O1xcbiAgY2xlYXI6IHJpZ2h0O1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgY3Vyc29yOiBwb2ludGVyO1xcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG59XFxuLmNhbGVuZGFyIC5hcnJvdy1yaWdodCB7XFxuICB3aWR0aDogMDtcXG4gIGhlaWdodDogMDtcXG4gIGJvcmRlci10b3A6IDYwcHggc29saWQgdHJhbnNwYXJlbnQ7XFxuICBib3JkZXItYm90dG9tOiA2MHB4IHNvbGlkIHRyYW5zcGFyZW50O1xcbiAgYm9yZGVyLWxlZnQ6IDYwcHggc29saWQgZ3JlZW47XFxufVxcbi5jYWxlbmRhciAuYXJyb3ctbGVmdCB7XFxuICB3aWR0aDogMDtcXG4gIGhlaWdodDogMDtcXG4gIGJvcmRlci10b3A6IDEwcHggc29saWQgdHJhbnNwYXJlbnQ7XFxuICBib3JkZXItYm90dG9tOiAxMHB4IHNvbGlkIHRyYW5zcGFyZW50O1xcbiAgYm9yZGVyLXJpZ2h0OiAxMHB4IHNvbGlkIGJsdWU7XFxufVxcbi5jYWxlbmRhciAuZGF5VGltZSB7XFxuICBjdXJzb3I6IHBvaW50ZXI7XFxufVxcbi5jYWxlbmRhciAuZGF5VGltZSA+ICoge1xcbiAgcG9pbnRlci1ldmVudHM6IG5vbmU7XFxufVxcblwiOyAocmVxdWlyZShcImJyb3dzZXJpZnktY3NzXCIpLmNyZWF0ZVN0eWxlKGNzcywgeyBcImhyZWZcIjogXCJwcmVCdW5kbGluZ0pTL2NhbGVuZGFyQXBwLmNzc1wiIH0sIHsgXCJpbnNlcnRBdFwiOiBcImJvdHRvbVwiIH0pKTsgbW9kdWxlLmV4cG9ydHMgPSBjc3M7IiwiLyoqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBIYXNUZXN0c1RhZ1xuICogQHByb3BlcnR5IHtib29sZWFufSBoYXNUZXN0cyAtIEluZGljYXRlcyB3aGV0aGVyIHRoZSBmdW5jdGlvbiBoYXMgdGVzdHMuXG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBoYXNUaGVzZVN0eWxlc1xuICogQHByb3BlcnR5IHtzdHJpbmd9IGhhc1RoZXNlU3R5bGVzIC0gTGlzdHMgc3R5bGVzIHJlZmVyZW5jZXMgaW4gYSBmdW50aW9uXG4gKi9cblxuaW1wb3J0IHtcbiAgZ2V0RGF5c0luTW9udGgsIGdlbmVyYXRlUmFuZG9tU3RyaW5nLCBnZXRFYXJsaWVzdERhdGUsXG4gIHByZWxvYWREYXRlcywgYmxvY2tEYXlzTm90T3BlbiwgaHVtYW5EYXRlLCBjbGVhclNlbGVjdGlvblxufSBmcm9tICcuL2Jhc2ljRnVuY3Rpb25zLmpzJztcbmltcG9ydCB7IEdlbmVyYXRlVGltZUNob29zZXJNb2RhbCB9IGZyb20gJy4vZGlzcGxheVRpbWVDaG9vc2VyTW9kYWwuanMnO1xuaW1wb3J0IHsgY29sb3Vycywgc2VsZWN0ZWRTdHlsZSwgdW5zZWxlY3RlZFN0eWxlIH0gZnJvbSAnLi9zdHlsZXMuanMnO1xuaW1wb3J0IHsgbGFuZ3VhZ2VzIH0gZnJvbSAnLi9sYW5ndWFnZXMuanMnO1xuaW1wb3J0IHN0eWxlIGZyb20gJy4vY2FsZW5kYXJBcHAuY3NzJztcblxuLyoqXG4gKiBBZGRzIHRoZSBzcGVjaWZpZWQgbnVtYmVyIG9mIG1vbnRocyB0byBhIGRhdGUuXG4gKiBAcGFyYW0ge251bWJlcn0gbW9udGhzIC0gVGhlIG51bWJlciBvZiBtb250aHMgdG8gYWRkLlxuICogQHJldHVybnMge0RhdGV9IC0gVGhlIHVwZGF0ZWQgZGF0ZS5cbiAqL1xuRGF0ZS5wcm90b3R5cGUuYWRkTW9udGhzID0gZnVuY3Rpb24obW9udGhzKSB7XG4gIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZSh0aGlzKTtcbiAgY29uc3QgeWVhcnMgPSBNYXRoLmZsb29yKG1vbnRocyAvIDEyKTtcbiAgY29uc3QgcmVtYWluaW5nTW9udGhzID0gbW9udGhzICUgMTI7XG4gIGlmICh5ZWFycykge1xuICAgIGRhdGUuc2V0RnVsbFllYXIoZGF0ZS5nZXRGdWxsWWVhcigpICsgeWVhcnMpO1xuICB9XG4gIGlmIChyZW1haW5pbmdNb250aHMpIHtcbiAgICBkYXRlLnNldE1vbnRoKGRhdGUuZ2V0TW9udGgoKSArIHJlbWFpbmluZ01vbnRocyk7XG4gIH1cbiAgcmV0dXJuIGRhdGU7XG59O1xuXG5jdXN0b21FbGVtZW50cy5kZWZpbmUoJ3N3aWZ0LWNhbCcsIGNsYXNzIGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgc3VwZXIoKTtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBmdW5jdGlvbiBzdFRvQm9vbGVhbiAoc3QpIHtcbiAgICAgIGlmKHN0ID09PSAndHJ1ZScpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIFxuICAgIGNvbnN0IGNhbGVuZGFyID0gbmV3IFN3aWZ0Q2FsKCk7XG4gICAgY2FsZW5kYXIuZ2VuZXJhdGVDYWxlbmRhcihcbiAgICAgIHtcbiAgICAgICAgdGFyZ2V0OiBzZWxmLFxuICAgICAgICAvLyBkYXRhLW51bWJlci1vZi1tb250aHMtdG8tZGlzcGxheSBodG1sIGNvbnZlcnRzIHRvIG51bWJlck9mTW9udGhzVG9EaXNwbGF5IEpTXG4gICAgICAgIG51bWJlck9mTW9udGhzVG9EaXNwbGF5OiB0aGlzLmRhdGFzZXQubnVtYmVyT2ZNb250aHNUb0Rpc3BsYXksXG4gICAgICAgIC8vIGRhdGEtZGlzcGxheS10aW1lLWNob29zZXItbW9kYWxcbiAgICAgICAgZGlzcGxheVRpbWVDaG9vc2VyTW9kYWw6IHN0VG9Cb29sZWFuKHRoaXMuZGF0YXNldC5kaXNwbGF5VGltZUNob29zZXJNb2RhbCksXG4gICAgICAgIC8vIGRhdGEtc2luZ2xlLWRhdGUtY2hvaWNlXG4gICAgICAgIHNpbmdsZURhdGVDaG9pY2U6IHN0VG9Cb29sZWFuKHRoaXMuZGF0YXNldC5zaW5nbGVEYXRlQ2hvaWNlKSxcblxuICAgICAgICBsYW5ndWFnZTogdGhpcy5kYXRhc2V0Lmxhbmd1YWdlLFxuICAgICAgICAvL2RhdGEtc2VsZWN0LW11bHRpcGxlXG4gICAgICAgIHNlbGVjdE11bHRpcGxlOiB0aGlzLmRhdGFzZXQuc2VsZWN0TXVsdGlwbGVcblxuICAgICAgfSk7XG4gICAgdGhpcy5keW5hbWljRGF0YSA9IGNhbGVuZGFyLnJldHVybkR5bmFtaWNEYXRhKCk7XG4gIH1cbn0pO1xuXG5mdW5jdGlvbiBTd2lmdENhbCAoKSB7XG4gIGxldCB0aW1lQ2hvb3NlcjtcbiAgLy8gZm9yIG5lc3RlZCBmdW5jdGlvbnMgdG8gYWNjZXNzIHRoZSBvdXRlciBvYmplY3RcbiAgY29uc3QgaW5uZXJUaGlzID0gdGhpczsgXG4gIGNvbnN0IGNvbmZpZyA9IHt9O1xuXG4gIGNvbnN0IGhhbmRsZXIgPSB7XG4gICAgZ2V0OiAodGFyZ2V0LCBrZXkpID0+IHtcbiAgICAgIGlmKHR5cGVvZiB0YXJnZXRba2V5XSA9PT0gJ29iamVjdCcgJiYgdGFyZ2V0W2tleV0gIT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm94eSh0YXJnZXRba2V5XSwgaGFuZGxlcik7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0YXJnZXRba2V5XTtcbiAgICB9LFxuICAgIHNldDogKHRhcmdldCwgcHJvcCwgdmFsdWUpID0+IHtcbiAgICAgIHRhcmdldFtwcm9wXSA9IHZhbHVlO1xuICAgICAgZW1pdERhdGVTZWxlY3RlZEV2ZW50KCk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cbiAgXG4gIGNvbnN0IGRhdGFUZW1wbGF0ZSA9IHtcbiAgICBkYXRlc1NlbGVjdGVkQXJyYXk6IFtdLFxuICAgIGRhdGVzU2VsZWN0ZWRBcnJheU9iamVjdHM6IFtdLFxuICAgIGRpc2FibGVkOiBmYWxzZVxuICB9O1xuXG4gIGNvbnN0IGR5bmFtaWNEYXRhID0gbmV3IFByb3h5KGRhdGFUZW1wbGF0ZSwgaGFuZGxlcik7XG5cbiAgZnVuY3Rpb24gZW1pdERhdGVTZWxlY3RlZEV2ZW50ICgpIHtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGNvbnN0IGV2dCA9IG5ldyBDdXN0b21FdmVudCgnZGF0ZVNlbGVjdCcsIHsgZGF0YTogZHluYW1pY0RhdGEgfSk7XG4gICAgICBjb25maWcuY2FsZW5kYXJDb250YWluZXIuZGlzcGF0Y2hFdmVudChldnQpO1xuICAgIH0sIDI1MClcbiAgfVxuICBcbiAgY29uc3QgY2FsZW5kYXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblxuICB0aGlzLnJldHVybkNhbGVuZGFyID0gKCkgPT4ge1xuICAgIHJldHVybiBjYWxlbmRhcjtcbiAgfTtcblxuICB0aGlzLnJldHVybkR5bmFtaWNEYXRhID0gKCkgPT4ge1xuICAgIHJldHVybiBkeW5hbWljRGF0YTtcbiAgfTtcblxuICB0aGlzLnJldHVybkNvbmZpZyA9ICgpID0+IHtcbiAgICByZXR1cm4gY29uZmlnO1xuICB9O1xuXG4gIHRoaXMuc2V0Q29uZmlnID0gKGNvbmZpZ09iaikgPT4ge1xuICAgIC8vIElmIGNhbGxlZCB2aWEgSFRNTFxuICAgIGNvbmZpZy5jYWxlbmRhckNvbnRhaW5lciA9IGNvbmZpZ09iai50YXJnZXQgfHwgZmFsc2U7XG4gICAgLy8gSWYgY2FsbGVkIHZpYSBKYXZhc2NyaXB0XG4gICAgY29uZmlnLnBhcmVudERpdiA9ICh0eXBlb2YgY29uZmlnT2JqLnBhcmVudERpdiA9PT0gJ3N0cmluZycpID8gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihjb25maWdPYmoucGFyZW50RGl2KSA6IGNvbmZpZ09iai5wYXJlbnREaXY7XG4gICAgLy8gZG9uZVxuICAgIGNvbmZpZy5udW1iZXJPZk1vbnRoc1RvRGlzcGxheSA9IGNvbmZpZ09iai5udW1iZXJPZk1vbnRoc1RvRGlzcGxheSB8fCAxMjtcbiAgICAvLyBkb25lXG4gICAgY29uZmlnLmRpc3BsYXlUaW1lQ2hvb3Nlck1vZGFsID0gY29uZmlnT2JqLmRpc3BsYXlUaW1lQ2hvb3Nlck1vZGFsICYmIHRydWU7XG4gICAgLy8gZG9uZVxuICAgIGNvbmZpZy5zaW5nbGVEYXRlQ2hvaWNlID0gY29uZmlnT2JqLnNpbmdsZURhdGVDaG9pY2UgJiYgdHJ1ZTtcbiAgICAvLyBkb25lXG4gICAgY29uZmlnLnNlbGVjdFJhbmdlID0gIWNvbmZpZ09iai5zaW5nbGVEYXRlQ2hvaWNlO1xuICAgIC8vIGRvbmVcbiAgICBjb25maWcubGFuZ3VhZ2UgPSBjb25maWdPYmoubGFuZ3VhZ2UgfHwgJ2VuR2InO1xuICAgIC8vIGRvbmVcbiAgICBjb25maWcuc2VsZWN0TXVsdGlwbGUgPSBjb25maWcuc2VsZWN0TXVsdGlwbGUgfHwgZmFsc2U7XG4gICAgLy8gZG9uZVxuICAgIGNvbmZpZy5kaXNwbGF5VGltZVNlbGVjdGlvbk9uRGF0ZSA9IGNvbmZpZ09iai5kaXNwbGF5VGltZVNlbGVjdGlvbk9uRGF0ZSB8fCB0cnVlO1xuXG4gICAgY29uZmlnLnByZWxvYWRlZERhdGVzID0gY29uZmlnT2JqLnByZWxvYWRlZERhdGVzIHx8IFtdO1xuICAgIGNvbmZpZy5lbmRVc2VyID0gY29uZmlnT2JqLmVuZFVzZXIgfHwgZmFsc2U7XG4gICAgY29uZmlnLmVuZFVzZXJEdXJhdGlvbkNob2ljZSA9IGNvbmZpZ09iai5lbmRVc2VyRHVyYXRpb25DaG9pY2UgfHwgZmFsc2U7XG4gICAgY29uZmlnLmJhY2tlbmQgPSBjb25maWdPYmouYmFja2VuZCB8fCBmYWxzZTtcbiAgICBjb25maWcuZGlzcGxheUJsb2NrZWQgPSBjb25maWdPYmouZGlzcGxheUJsb2NrZWQgfHwgZmFsc2U7XG4gICAgY29uZmlnLmRhdGVzT3BlbiA9IGNvbmZpZ09iai5kYXRlc09wZW4gfHwgZmFsc2U7XG4gIH07XG5cbiAgdGhpcy5nZW5lcmF0ZUNhbGVuZGFyID0gKGNvbmZpZ09iaikgPT4ge1xuICAgIGlmIChjb25maWdPYmopIHtcbiAgICAgIHRoaXMuc2V0Q29uZmlnKGNvbmZpZ09iaik7XG4gICAgfVxuICAgIC8vIElmIGNhbGxlZCB2aWEgamF2YXNjcmlwdCBhIHBhcmVudEVsZW1lbnQgbmVlZHMgdG8gYmUgcHJvdmlkZWRcbiAgICBjb25zdCBwYXJlbnREaXYgPSBjb25maWcucGFyZW50RGl2O1xuICAgIC8qXG4gICAgICBJZiBjYWxsZWQgZnJvbSBodG1sIGFzIGEgY3VzdG9tIGNvbXBvbmVudCB0aGUgY29tcG9uZW50IGl0c2VsZiBpcyBwYXNzZWQgKGNhbGVuZGFyQ29udGFpbmVyKVxuICAgICAgSWYgY2FsbGVkIHZpYSBKUyB3aGlsZSB0aGUgY29tcG9uZW50IGlzbid0IGEgd2ViY29tcG9uZW50IGluIHRoZSBzdHJpY3Rlc3Qgc2Vuc2UsIGl0IHN0aWxsXG4gICAgICBiZWhhdmVzIGxpa2Ugb25lIGFuZCBpcyBlbmNhcHN1bGF0ZWQgaW4gYSBzaGFkb3cuXG4gICAgKi9cbiAgICBpZiAoY29uZmlnLmNhbGVuZGFyQ29udGFpbmVyKSB7XG4gICAgICBzaGFkb3dBdHRhY2goY29uZmlnLmNhbGVuZGFyQ29udGFpbmVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbmV3Q29udGFpbmVyKCkudGhlbigoY29udGFpbmVyKSA9PiB7XG4gICAgICAgIHNoYWRvd0F0dGFjaChjb250YWluZXIpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbmV3Q29udGFpbmVyICgpIHtcbiAgICAgIGNvbnN0IHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGNvbnN0IG5ld0NhbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBuZXdDYWwuY2xhc3NMaXN0LmFkZCgnc3dpZnQtY2FsJyk7XG4gICAgICAgIHBhcmVudERpdi5hcHBlbmRDaGlsZChuZXdDYWwpO1xuICAgICAgICByZXNvbHZlKG5ld0NhbCk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBwcm9taXNlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNoYWRvd0F0dGFjaCAoY29udGFpbmVyKSB7XG4gICAgICBjb25zdCBzaGFkb3dSb290ID0gY29udGFpbmVyLmF0dGFjaFNoYWRvdyh7IG1vZGU6ICdvcGVuJyB9KTtcbiAgICAgIGNvbnN0IGNzcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgICBjc3MudGV4dENvbnRlbnQgPSBzdHlsZTtcbiAgICAgIHNoYWRvd1Jvb3QuYXBwZW5kQ2hpbGQoY3NzKTtcbiAgICAgIHNoYWRvd1Jvb3QuYXBwZW5kQ2hpbGQoY2FsZW5kYXIpO1xuICAgIH1cblxuICAgIGNvbnN0IHByZWxvYWRlZERhdGVzID0gY29uZmlnLnByZWxvYWRlZERhdGVzO1xuICAgIGNvbnN0IG51bWJlck9mTW9udGhzVG9EaXNwbGF5ID0gY29uZmlnLm51bWJlck9mTW9udGhzVG9EaXNwbGF5O1xuICAgIGNvbnN0IGRhdGVzT3BlbiA9IGNvbmZpZy5kYXRlc09wZW47XG4gICAgY29uc3QgbGFuZ3VhZ2UgPSBjb25maWcubGFuZ3VhZ2U7XG4gICAgY29uc3QgZGlzcGxheVRpbWVDaG9vc2VyTW9kYWwgPSBjb25maWcuZGlzcGxheVRpbWVDaG9vc2VyTW9kYWw7XG4gICAgXG4gICAgLy8gVE9ETzpcbiAgICBjb25zdCBlbmRVc2VyID0gY29uZmlnLmVuZFVzZXI7XG4gICAgY29uc3QgZW5kVXNlckR1cmF0aW9uQ2hvaWNlID0gY29uZmlnLmVuZFVzZXJEdXJhdGlvbkNob2ljZTtcbiAgICBjb25zdCBiYWNrZW5kID0gY29uZmlnLmJhY2tlbmQ7XG4gICAgY29uc3QgZGlzcGxheUJsb2NrZWQgPSBjb25maWcuZGlzcGxheUJsb2NrZWQ7XG5cbiAgICBsZXQgdW5pcXVlRGF5SW5kZXggPSAwO1xuICAgIC8vIENhbGVuZGFyIGlzIGRlZmluZWQgZ2xvYmFsbHkgd2l0aGluIHRoZSBjb25zdHJ1Y3RvclxuICAgIGNvbnN0IGNhbGVuZGFyVW5pcXVlSWQgPSBnZW5lcmF0ZVJhbmRvbVN0cmluZygpO1xuICAgIGNhbGVuZGFyLmlkID0gYGNhbGVuZGFyLSR7Y2FsZW5kYXJVbmlxdWVJZH1gO1xuICAgIGNhbGVuZGFyLmNsYXNzTGlzdC5hZGQoJ2NhbGVuZGFyJyk7XG5cbiAgICBjb25zdCBtb250aHMgPSBbXTtcbiAgICBjb25zdCBkYXRlTm93ID0gbmV3IERhdGUoKTtcbiAgICBjb25zdCBlYXJsaWVzdERhdGUgPSAocHJlbG9hZGVkRGF0ZXMgJiYgcHJlbG9hZGVkRGF0ZXMuYm9va2VkKSA/IGdldEVhcmxpZXN0RGF0ZShwcmVsb2FkZWREYXRlcykgOiBkYXRlTm93O1xuICAgIGNvbnN0IHN0YXJ0TW9udGggPSBlYXJsaWVzdERhdGUuZ2V0TW9udGgoKTtcbiAgICBjb25zdCBtb250aE5hbWVzID0gbGFuZ3VhZ2VzW2xhbmd1YWdlXS5nZW5lcmFsVGltZS5tb250aHM7XG4gICAgLyogQ3JlYXRlIG1vbnRoIHZpZXcgKi9cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bWJlck9mTW9udGhzVG9EaXNwbGF5OyBpKyspIHtcbiAgICAgIC8qIE1vbnRoIHNwZWNpZmljIHZhcmlhYmxlcyBhbmQgdHJhY2tlcnMgKi9cbiAgICAgIGNvbnN0IHllYXJDYWxjID0gZWFybGllc3REYXRlLmFkZE1vbnRocyhpKS5nZXRGdWxsWWVhcigpO1xuICAgICAgY29uc3QgbW9udGhDYWxjID0gKHN0YXJ0TW9udGggKyBpKSAlIDEyO1xuICAgICAgY29uc3Qgc3RhcnREYXlPZk1vbnRoID0gbmV3IERhdGUoeWVhckNhbGMsIG1vbnRoQ2FsYykuZ2V0RGF5KCk7XG4gICAgICBjb25zdCBkYXlzSW5Nb250aCA9IGdldERheXNJbk1vbnRoKChzdGFydE1vbnRoICsgaSArIDEpICUgMTIsIGVhcmxpZXN0RGF0ZS5hZGRNb250aHMoaSkuZ2V0RnVsbFllYXIoKSk7XG4gICAgICBsZXQgY291bnQgPSAxO1xuICAgICAgbGV0IGRheW9md2VlayA9IDA7XG5cbiAgICAgIC8qIENyZWF0ZSBtb250aCBkaXYgKi9cbiAgICAgIGNvbnN0IG1vbnRoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBtb250aHMucHVzaChtb250aCk7XG4gICAgICBtb250aC5zdHlsZS53aWR0aCA9ICcxNWVtJztcbiAgICAgIG1vbnRoLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGNvbG91cnMubW9udGhCb3JkZXJDb2xvcjtcbiAgICAgIG1vbnRoLmNsYXNzTGlzdC5hZGQoJ21vbnRoJyk7XG4gICAgICBjYWxlbmRhci5hcHBlbmRDaGlsZChtb250aCk7XG5cbiAgICAgIC8qIENyZWF0ZSBtb250aCBuYW1lIGRpdiAobW9udGggWVlZWSkgYXQgdGhlIHRvcCBvZiBtb250aCBkaXNwbGF5ICovXG4gICAgICBjb25zdCBtb250aE5hbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIG1vbnRoTmFtZS5jbGFzc0xpc3QuYWRkKCdtb250aE5hbWUnKTtcbiAgICAgIG1vbnRoTmFtZS50ZXh0Q29udGVudCA9IGAke21vbnRoTmFtZXNbKHN0YXJ0TW9udGggKyBpKSAlIDEyXX0gJHtlYXJsaWVzdERhdGUuZ2V0RnVsbFllYXIoKX1gO1xuICAgICAgbW9udGguYXBwZW5kQ2hpbGQobW9udGhOYW1lKTtcblxuICAgICAgLyogQ3JlYXRlIGRpdiB3aXRoIG5hbWVkIGRheXMgb2YgdGhlIHdlZWsgKi9cbiAgICAgIGNvbnN0IGRheU5hbWVzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBtb250aC5hcHBlbmRDaGlsZChkYXlOYW1lcyk7XG4gICAgICBkYXlOYW1lcy5jbGFzc0xpc3QuYWRkKCd3ZWVrcm93Jyk7XG4gICAgICBsYW5ndWFnZXNbbGFuZ3VhZ2VdLmdlbmVyYWxUaW1lLmRheXNUcnVuY2F0ZWQuZm9yRWFjaCgoZGF5TmFtZSkgPT4ge1xuICAgICAgICBjb25zdCBkYXkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgZGF5LnRleHRDb250ZW50ID0gZGF5TmFtZTtcbiAgICAgICAgZGF5LmNsYXNzTGlzdC5hZGQoJ2RheU5hbWUnLCAnd2lkdGhTaGFwZURheXMnKTtcbiAgICAgICAgZGF5TmFtZXMuYXBwZW5kQ2hpbGQoZGF5KTtcbiAgICAgIH0pO1xuXG4gICAgICAvKiBDcmVhdGUgd2VlayByb3dzIGZpcnN0IHdlZWssIGl0J3MgcmVhc2lnbmVkIGYgKi9cbiAgICAgIGxldCB3ZWVrUm93O1xuICAgICAgZnVuY3Rpb24gbWFrZU5ld1dlZWtSb3cgKCkge1xuICAgICAgICB3ZWVrUm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIG1vbnRoLmFwcGVuZENoaWxkKHdlZWtSb3cpO1xuICAgICAgICB3ZWVrUm93LmNsYXNzTGlzdC5hZGQoJ3dlZWtyb3cnKTtcbiAgICAgICAgZGF5b2Z3ZWVrID0gMDtcbiAgICAgIH1cblxuICAgICAgLy8gNDIgZGF5cywgaS5lLiA2IHJvd3Mgb2YgN1xuICAgICAgZm9yIChsZXQgcCA9IDA7IHAgPCA0MjsgcCsrKSB7XG4gICAgICAgIGlmIChwID09PSAwKSB7XG4gICAgICAgICAgbWFrZU5ld1dlZWtSb3coKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocCA8IHN0YXJ0RGF5T2ZNb250aCkge1xuICAgICAgICAgIGNvbnN0IHBlZ2hvbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICBwZWdob2xlLmNsYXNzTGlzdC5hZGQoJ3dpZHRoU2hhcGUnLCAnZmlsbGVyJyk7XG4gICAgICAgICAgdW5zZWxlY3RlZFN0eWxlKHBlZ2hvbGUpO1xuICAgICAgICAgIHdlZWtSb3cuYXBwZW5kQ2hpbGQocGVnaG9sZSk7XG4gICAgICAgICAgZGF5b2Z3ZWVrKys7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocCA+PSBzdGFydERheU9mTW9udGggJiYgcCA8PSAoc3RhcnREYXlPZk1vbnRoICsgZGF5c0luTW9udGggLSAxKSkge1xuICAgICAgICAgIGNvbnN0IHBlZ2hvbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICBwZWdob2xlLnRleHRDb250ZW50ID0gY291bnQ7XG4gICAgICAgICAgcGVnaG9sZS5kYXRhc2V0LmRheSA9IGNvdW50O1xuICAgICAgICAgIHBlZ2hvbGUuZGF0YXNldC5kYXlvZndlZWsgPSBkYXlvZndlZWs7XG4gICAgICAgICAgcGVnaG9sZS5kYXRhc2V0LmRheWluZGV4ID0gdW5pcXVlRGF5SW5kZXg7XG4gICAgICAgICAgcGVnaG9sZS5jbGFzc0xpc3QuYWRkKCd3aWR0aFNoYXBlJywgJ2RheVRpbWUnKTtcbiAgICAgICAgICBwZWdob2xlLmRhdGFzZXQuaHVtYW5kYXRlID0gaHVtYW5EYXRlKGAke3llYXJDYWxjfS0ke21vbnRoQ2FsY30tJHtjb3VudH1gKTtcbiAgICAgICAgICAvLyBwZWdob2xlLmlkID0gYCR7eWVhckNhbGN9LSR7bW9udGhDYWxjfS0ke2NvdW50fWA7XG4gICAgICAgICAgcGVnaG9sZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICAgICAgICBkYXRlT25DbGlja0V2ZW50cyhlKTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHdlZWtSb3cuYXBwZW5kQ2hpbGQocGVnaG9sZSk7XG5cbiAgICAgICAgICBpZiAoaSA9PT0gMCAmJiBwID49IHN0YXJ0RGF5T2ZNb250aCAmJiBwIDwgKG5ldyBEYXRlKCkuZ2V0RGF0ZSgpICsgc3RhcnREYXlPZk1vbnRoKSkge1xuICAgICAgICAgICAgcGVnaG9sZS5jbGFzc0xpc3QuYWRkKCdmaWxsZXInKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb3VudCsrO1xuICAgICAgICAgIGRheW9md2VlaysrO1xuICAgICAgICAgIHVuaXF1ZURheUluZGV4Kys7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocCA+PSBkYXlzSW5Nb250aCArIHN0YXJ0RGF5T2ZNb250aCkge1xuICAgICAgICAgIGNvbnN0IHBlZ2hvbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICBwZWdob2xlLmNsYXNzTGlzdC5hZGQoJ3dpZHRoU2hhcGUnLCAnZmlsbGVyJyk7XG4gICAgICAgICAgd2Vla1Jvdy5hcHBlbmRDaGlsZChwZWdob2xlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgocCArIDEpICUgNyA9PT0gMCkge1xuICAgICAgICAgIG1ha2VOZXdXZWVrUm93KCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChpID09PSBudW1iZXJPZk1vbnRoc1RvRGlzcGxheSAtIDEpIHtcbiAgICAgICAgcHJlbG9hZERhdGVzKGNhbGVuZGFyLCBwcmVsb2FkZWREYXRlcyk7XG4gICAgICAgIGJsb2NrRGF5c05vdE9wZW4oY2FsZW5kYXIsIGRhdGVzT3Blbik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYoZGlzcGxheVRpbWVDaG9vc2VyTW9kYWwpIHtcbiAgICAgIHRpbWVDaG9vc2VyID0gbmV3IEdlbmVyYXRlVGltZUNob29zZXJNb2RhbChjb25maWcsIGR5bmFtaWNEYXRhLCBjYWxlbmRhcik7XG4gICAgICB0aW1lQ2hvb3Nlci5nZW5lcmF0ZU1vZGFsKCk7XG4gICAgfVxuICB9O1xuXG4gIGxldCBjbGlja0NvdW50ID0gMTtcblxuICBmdW5jdGlvbiBkYXRlT25DbGlja0V2ZW50cyAoZSkge1xuICBcbiAgICBjb25zdCBkYXRlRGl2ID0gZS50YXJnZXQ7XG4gICAgY2xpY2tDb3VudCsrO1xuXG4gICAgaWYgKGR5bmFtaWNEYXRhLmRpc2FibGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGRhdGVEaXYuY2xhc3NMaXN0LmNvbnRhaW5zKCdibG9ja2VkJykpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoY2FsZW5kYXIucXVlcnlTZWxlY3RvcignLm1ha2VUaW1lUnVsZUdsb2JhbCcpKSB7XG4gICAgICBjYWxlbmRhci5xdWVyeVNlbGVjdG9yKCcubWFrZVRpbWVSdWxlR2xvYmFsQ2xhc3MnKS50ZXh0Q29udGVudCA9IGZvcm1hdERheVRleHQoKTtcbiAgICB9XG5cbiAgICBpZiAoY29uZmlnLnNlbGVjdFJhbmdlKSB7XG4gICAgICBpZiAoY2xpY2tDb3VudCAlIDIgPT09IDApIHtcbiAgICAgICAgaWYgKGNvbmZpZy5zZWxlY3RNdWx0aXBsZSkge1xuICAgICAgICAgIGNsZWFyU2VsZWN0aW9uKGNhbGVuZGFyLCBkeW5hbWljRGF0YSk7XG4gICAgICAgIH1cbiAgICAgICAgYm9va0RhdGVzKFtkYXRlRGl2XSk7XG4gICAgICB9XG4gICAgICBpZiAoY2xpY2tDb3VudCAlIDIgPT09IDEpIHtcbiAgICAgICAgYm9va0RhdGVzKFtkYXRlRGl2XSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGNvbmZpZy5zaW5nbGVEYXRlQ2hvaWNlKSB7XG4gICAgICBjbGVhclNlbGVjdGlvbihjYWxlbmRhciwgZHluYW1pY0RhdGEpO1xuICAgICAgYm9va0RhdGVzKFtkYXRlRGl2XSk7XG4gICAgfVxuICAgIC8qXG4gICAgaWYgKCFkYXRlc0luZGV4LmluY2x1ZGVzKGRhdGVEaXYuZGF0YXNldC5odW1hbmRhdGUpKSB7XG4gICAgICBjb25zdCBtYWtlVGltZVJ1bGVHbG9iYWwgPSBjYWxlbmRhci5xdWVyeVNlbGVjdG9yKCcudGltZUNob29zZXInKT8ucXVlcnlTZWxlY3RvcignLm1ha2VUaW1lUnVsZUdsb2JhbCcpO1xuICAgICAgaWYgKG1ha2VUaW1lUnVsZUdsb2JhbD8uY2hlY2tlZCA9PT0gdHJ1ZSkge1xuICAgICAgICBib29rRGF5T2ZXZWVrRyhkYXRlLCBudWxsKTtcbiAgICAgIH1cbiAgICB9XG4gICAgKi9cbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IHNlbGVjdGlvbiBpbiB0aGUgZHluYW1pY0RhdGEgb2JqZWN0LlxuICAgKlxuICAgKiBAcmV0dXJuIHtvYmplY3R9IEFuIG9iamVjdCBjb250YWluaW5nIHRoZSB0cmFja2luZyBhcnJheSBcIm5ld0FycmF5XCIgYW5kIG9iamVjdHMgYXJyYXkuXG4gICAqL1xuICBmdW5jdGlvbiBjcmVhdGVOZXdTZWxlY3Rpb24gKCkge1xuICAgIGNvbnN0IHBhcmVudEFyID0gZHluYW1pY0RhdGEuZGF0ZXNTZWxlY3RlZEFycmF5O1xuICAgIGNvbnN0IHBhcmVudEFyT2JqID0gZHluYW1pY0RhdGEuZGF0ZXNTZWxlY3RlZEFycmF5T2JqZWN0cztcbiAgICBsZXQgbmV3QXJyYXksIG5ld09iamVjdHNBcnJheTtcblxuICAgIG5ld0FycmF5ID0gcGFyZW50QXJbcGFyZW50QXIubGVuZ3RoIC0gMV07XG4gICAgaWYgKGNvbmZpZy5zZWxlY3RSYW5nZSAmJiBuZXdBcnJheSAmJiBuZXdBcnJheS5sZW5ndGggPT09IDEpIHtcbiAgICAgIG5ld09iamVjdHNBcnJheSA9IHBhcmVudEFyT2JqW3BhcmVudEFyT2JqLmxlbmd0aCAtIDFdO1xuICAgICAgcmV0dXJuIHsgbmV3QXJyYXksIG5ld09iamVjdHNBcnJheSB9O1xuICAgIH1cblxuICAgIG5ld0FycmF5ID0gW107XG4gICAgbmV3T2JqZWN0c0FycmF5ID0gW107XG4gICAgcGFyZW50QXIucHVzaChuZXdBcnJheSk7XG4gICAgcGFyZW50QXJPYmoucHVzaChuZXdPYmplY3RzQXJyYXkpO1xuICAgIHJldHVybiB7IG5ld0FycmF5LCBuZXdPYmplY3RzQXJyYXkgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSYW5nZSBzZWxlY3RcbiAgICogQGRlc2NyaXB0aW9uIEFsbG93cyBhIHJhbmdlIG9mIGRhdGVzIHRvIGJlIHNlbGVjdGVkXG4gICAqIEBmdW5jdGlvbiBib29rRGF0ZXNcbiAgICogQHBhcmFtIGRhdGVzIGFycmF5XG4gICAqIEB0b2RvIGFsbG93IHJhbmdlIHNlbGVjdCB0byB3b3JrIHdpdGggdGltZSB2YWx1ZXMuXG4gICAqIEBmaXJlcyBib29rRGF5IGZvciBlYWNoIGRheSBpbiBhIHJhbmdlXG4gICAqL1xuICBmdW5jdGlvbiBib29rRGF0ZXMgKGFycmF5T2ZEYXRlRGl2cykge1xuICAgIGNvbnN0IHsgbmV3QXJyYXksIG5ld09iamVjdHNBcnJheSB9ID0gY3JlYXRlTmV3U2VsZWN0aW9uKCk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnJheU9mRGF0ZURpdnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGRhdGVEaXYgPSBhcnJheU9mRGF0ZURpdnNbaV07XG4gICAgICBib29rRGF5KGRhdGVEaXYpO1xuICAgIH1cblxuICAgIGNvbnN0IHN0YXJ0RGF0ZSA9IG5ld09iamVjdHNBcnJheVswXTtcbiAgICBjb25zdCBzdGFydEluZGV4ID0gc3RhcnREYXRlLmluZGV4O1xuICAgIC8vIGlmIGEgc2luZ2xlIGRhdGUgaXMgc2VsZWN0ZWQ6XG4gICAgY29uc3QgZW5kRGF0ZSA9IG5ld09iamVjdHNBcnJheVsxXSB8fCBzdGFydERhdGU7XG4gICAgY29uc3QgZW5kSW5kZXggPSBlbmREYXRlLmluZGV4O1xuXG4gICAgaWYgKGNvbmZpZy5zZWxlY3RSYW5nZSkge1xuICAgICAgY29uc3QgW2xvdywgaGlnaF0gPSBbcGFyc2VJbnQoc3RhcnRJbmRleCksIHBhcnNlSW50KGVuZEluZGV4KV0uc29ydCgoYSwgYikgPT4gYSAtIGIpO1xuICAgICAgZm9yIChsZXQgaSA9IGxvdzsgaSA8PSBoaWdoOyBpKyspIHtcbiAgICAgICAgY29uc3QgZGF0ZURpdiA9IGNhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLWRheWluZGV4PScke2l9J11gKTtcbiAgICAgICAgaWYgKGRhdGVEaXYuY2xhc3NMaXN0LmNvbnRhaW5zKCdibG9ja2VkJykpIHtcbiAgICAgICAgICB1bnNlbGVjdGVkU3R5bGUoY2FsZW5kYXIucXVlcnlTZWxlY3RvcihgW2lkPScke2VuZERhdGV9J11gKSk7XG4gICAgICAgICAgbmV3QXJyYXkuc3BsaWNlKDEsIDEpO1xuICAgICAgICAgIG5ld09iamVjdHNBcnJheS5zcGxpY2UoMSwgMSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgYm9va0RheShkYXRlRGl2KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBib29rRGF5IChkYXRlRGl2KSB7XG4gICAgICBpZiAoY29uZmlnLnNpbmdsZURhdGVDaG9pY2UgJiYgbmV3QXJyYXkubGVuZ3RoID4gMCkge1xuICAgICAgICBjbGVhclNlbGVjdGlvbihjYWxlbmRhciwgZHluYW1pY0RhdGEpO1xuICAgICAgfVxuICAgICAgaWYgKG5ld0FycmF5LmluY2x1ZGVzKGRhdGVEaXYuZGF0YXNldC5odW1hbmRhdGUpID09PSBmYWxzZSkge1xuICAgICAgICBzZWxlY3RlZFN0eWxlKGRhdGVEaXYpO1xuICAgICAgICBuZXdBcnJheS5wdXNoKGRhdGVEaXYuZGF0YXNldC5odW1hbmRhdGUpO1xuICAgICAgICBuZXdPYmplY3RzQXJyYXlbbmV3QXJyYXkubGVuZ3RoIC0gMV0gPSBzdGFuZGFyZERhdGVPYmplY3QoZGF0ZURpdik7XG4gICAgICB9XG4gICAgICBpZiAoY29uZmlnLnNpbmdsZURhdGVDaG9pY2UgJiYgY29uZmlnLmRpc3BsYXlUaW1lQ2hvb3Nlck1vZGFsKSB7XG4gICAgICAgIHRpbWVDaG9vc2VyLnNob3coKTtcbiAgICAgIH1cbiAgICAgIC8vIHRpbWUgcGlja2VyIGZvciBtdWx0aXBsZSBjb25zZWN1dGl2ZSBkYXRlcy5cbiAgICAgIGlmIChjb25maWcuZGlzcGxheVRpbWVDaG9vc2VyTW9kYWwgJiYgc3RhcnREYXRlICE9PSBlbmREYXRlKSB7XG4gICAgICAgIHRpbWVDaG9vc2VyLnNob3coKTtcbiAgICAgIH1cbiAgICAgIC8vIHRpbWUgcGlja2VyIGZvIHNpbmdsZSBkYXRlOlxuICAgICAgaWYgKGNvbmZpZy5kaXNwbGF5VGltZUNob29zZXJNb2RhbCAmJiBjb25maWcuc2luZ2xlRGF0ZUNob2ljZSkge1xuICAgICAgICB0aW1lQ2hvb3Nlci5zaG93KCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBzdGFuZGFyZCBkYXRlIG9iamVjdCB3aXRoIHRoZSBnaXZlbiBkYXRlLlxuICAgKlxuICAgKiBAcGFyYW0ge2FueX0gZGF0ZSAtIElzIGEgc3RyaW5nIFlZWVktTU0tREQgbW9udGhzIGFyZSBjb3VudGVkIGZyb20gMC5cbiAgICogQHJldHVybiB7b2JqZWN0fSBUaGUgc3RhbmRhcmQgZGF0ZSBvYmplY3Qgd2l0aCB0aGUgZ2l2ZW4gZGF0ZS5cbiAgICovXG4gIGZ1bmN0aW9uIHN0YW5kYXJkRGF0ZU9iamVjdCAoZGF0ZSkge1xuICAgIGNvbnN0IHRpbWVzID0gKHRpbWVDaG9vc2VyKSA/IHRpbWVDaG9vc2VyLmdldFNlbGVjdGVkVGltZXMoKSA6IFtdXG4gICAgY29uc3Qgb2JqID0ge1xuICAgICAgZGF5OiBkYXRlLmRhdGFzZXQuZGF5LFxuICAgICAgaHVtYW5kYXRlOiBkYXRlLmRhdGFzZXQuaHVtYW5kYXRlLFxuICAgICAgaW5kZXg6IGRhdGUuZGF0YXNldC5kYXlpbmRleCxcbiAgICAgIHRpbWVzOiB0aW1lc1xuICAgIH07IFxuICAgIHJldHVybiBvYmo7XG4gIH1cbn1cblxuZXhwb3J0IHsgU3dpZnRDYWwgfTtcbiIsImltcG9ydCB7IGxhbmd1YWdlcyB9IGZyb20gJy4vbGFuZ3VhZ2VzLmpzJztcblxuLyoqXG4gKiBDcmVhdGVzIGRpYWxvZyBmb3Igc2VsZWN0aW5nIHNwZWNpZmljIHRpbWVzXG4gKiBAZnVuY3Rpb24gY3JlYXRlVGltZUVsZW1lbnRzXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBjYWxlbmRhciAtIFRoZSBjYWxlbmRhciBlbGVtZW50XG4gKiBAcmV0dXJucyB7cHJvbWlzZX0gLSBFbXB0eSBwcm9taXNlLiBUaGUgYWN0dWFsIGRpdiBpcyBpbiB0aGlzIGNvZGUgb24gXCJ0aW1lQ2hvb3Nlck1vZGFsXCJcbiovXG5cbmZ1bmN0aW9uIEdlbmVyYXRlVGltZUNob29zZXJNb2RhbCAoY29uZmlnLCBkeW5hbWljRGF0YSwgY2FsZW5kYXIpIHtcblxuICBmdW5jdGlvbiBlbWl0VGltZVNlbGVjdGVkRXZlbnQgKCkge1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgY29uc3QgZXZ0ID0gbmV3IEN1c3RvbUV2ZW50KCd0aW1lU2VsZWN0JywgeyBkYXRhOiBkeW5hbWljRGF0YSB9KTtcbiAgICAgIGNvbmZpZy5jYWxlbmRhckNvbnRhaW5lci5kaXNwYXRjaEV2ZW50KGV2dCk7XG4gICAgfSwgMjUwKVxuICB9XG5cbiAgbGV0IHRpbWVDaG9vc2VyTW9kYWw7XG5cbiAgbGV0IHNlbGVjdGlvbiA9IFtdO1xuXG4gIHRoaXMuZ2V0U2VsZWN0ZWRUaW1lcyA9ICgpID0+IHtcbiAgICByZXR1cm4gc2VsZWN0aW9uO1xuICB9XG4gIFxuICB0aGlzLmdlbmVyYXRlTW9kYWwgPSAoKSA9PiB7XG4gICAgcmV0dXJuIGdlbmVyYXRlTW9kYWwoKTtcbiAgfVxuXG4gIHRoaXMuc2hvdyA9ICgpID0+IHtcbiAgICBjYWxlbmRhci5zdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nO1xuICAgIHJldHVybiB0aW1lQ2hvb3Nlck1vZGFsLnNob3coKTtcbiAgfVxuXG4gIHRoaXMud3JpdGVUb0RhdGVEaXYgPSAgKCkgPT4ge1xuICAgIHdyaXRlVG9EYXRlRGl2KCk7XG4gIH1cblxuICBmdW5jdGlvbiBnZW5lcmF0ZU1vZGFsKCkge1xuICAgIGNvbnN0IHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cbiAgICAgIHRpbWVDaG9vc2VyTW9kYWwgPSBjcmVhdGVNb2RhbCgndGltZUNob29zZXJNb2RhbCcpO1xuICAgICAgY2FsZW5kYXIuYXBwZW5kQ2hpbGQodGltZUNob29zZXJNb2RhbCk7XG4gIFxuICAgICAgY29uc3QgdGltZUNvbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIHRpbWVDb250LmNsYXNzTGlzdC5hZGQoJ3RpbWVDb250Jyk7XG4gICAgICB0aW1lQ2hvb3Nlck1vZGFsLmFwcGVuZENoaWxkKHRpbWVDb250KTtcbiAgXG4gICAgICBjb25zdCB0aW1lQ2hvb3NlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgdGltZUNob29zZXIuY2xhc3NMaXN0LmFkZCgndGltZUNob29zZXInKTtcbiAgICAgIHRpbWVDb250LmFwcGVuZENoaWxkKHRpbWVDaG9vc2VyKTtcbiAgXG4gICAgICBjb25zdCBjb250cm9sc0RpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgY29udHJvbHNEaXYuY2xhc3NMaXN0LmFkZCgnZGVsZXRlRGl2Jyk7XG4gICAgICB0aW1lQ2hvb3Nlci5hcHBlbmRDaGlsZChjb250cm9sc0Rpdik7XG4gIFxuICAgICAgZnVuY3Rpb24gY2xvc2VGbiAoKSB7XG4gICAgICAgIGNhbGVuZGFyLnN0eWxlLm92ZXJmbG93ID0gJ3Njcm9sbCc7XG4gICAgICAgIHRpbWVDaG9vc2VyTW9kYWwuY2xvc2UoKTtcbiAgICAgIH1cbiAgICAgIG1ha2VCdXR0b24oY29udHJvbHNEaXYsICdkZWxldGVCdXR0b24nLCAneCcsICdjbG9zZScsICdjbGljaycsIGNsb3NlRm4pO1xuICBcbiAgICAgIGZ1bmN0aW9uIGlubmVyQ29tcG9uZW50cyAoKSB7XG4gICAgICAgIGNvbnN0IHRpbWVQaWNrZXJDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgdGltZVBpY2tlckNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCd0aW1lUGlja2VyQ29udGFpbmVyJyk7XG4gICAgICAgIHRpbWVDaG9vc2VyLmFwcGVuZENoaWxkKHRpbWVQaWNrZXJDb250YWluZXIpO1xuICAgICAgICBjb25zdCB0aXRsZURpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICB0aXRsZURpdi50ZXh0Q29udGVudCA9IGxhbmd1YWdlc1tjb25maWcubGFuZ3VhZ2VdLnRpbWVXaWRnZXQuYWRkVGltZTtcbiAgICAgICAgdGl0bGVEaXYuY2xhc3NMaXN0LmFkZCgnZGVsZXRlRGl2Jyk7XG4gICAgICAgIHRpbWVQaWNrZXJDb250YWluZXIuYXBwZW5kQ2hpbGQodGl0bGVEaXYpO1xuICAgICAgICBtYWtlRHJvcERvd25zKGxhbmd1YWdlc1tjb25maWcubGFuZ3VhZ2VdLnRpbWVXaWRnZXQuc3RhcnQsIHRpbWVQaWNrZXJDb250YWluZXIpO1xuICAgICAgICBtYWtlRHJvcERvd25zKGxhbmd1YWdlc1tjb25maWcubGFuZ3VhZ2VdLnRpbWVXaWRnZXQuZW5kLCB0aW1lUGlja2VyQ29udGFpbmVyKTtcbiAgICAgIH1cbiAgICAgIG1ha2VCdXR0b24oY29udHJvbHNEaXYsICdkZWxldGVCdXR0b24nLCAnKycsICdhZGQgdGltZScsICdjbGljaycsIGlubmVyQ29tcG9uZW50cyk7XG4gICAgICBtYWtlQnV0dG9uKGNvbnRyb2xzRGl2LCAnZGVsZXRlQnV0dG9uJywgJy0nLCAncmVtb3ZlIHRpbWUnLCAnY2xpY2snLCByZW1vdmVUaW1lVmFsdWVzT25EYXRlKTtcbiAgICAgIHJlc29sdmUodGltZUNob29zZXJNb2RhbCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cblxuICBmdW5jdGlvbiB3cml0ZVRvRGF0ZURpdiAoKSB7XG4gICAgaWYgKGNvbmZpZy5kaXNwbGF5VGltZVNlbGVjdGlvbk9uRGF0ZSkge1xuICAgICAgZHluYW1pY0RhdGEuZGF0ZXNTZWxlY3RlZEFycmF5LmZvckVhY2goKGNoaWxkQXJyYXkpID0+IHtcbiAgICAgICAgY2hpbGRBcnJheS5mb3JFYWNoKChkYXlTZWxlY3RlZCkgPT4ge1xuICAgICAgICAgIHdyaXRlKGRheVNlbGVjdGVkKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgXG4gICAgICAvLyBjb250YWlucyBhIHRpbWUgZHVyYXRpb24gY2hvaWNlXG4gICAgICBsZXQgY2FsZW5kYXJUaW1lUGFyZW50O1xuICBcbiAgICAgIGZ1bmN0aW9uIHdyaXRlIChkYXRlKSB7XG4gICAgICAgIGNvbnN0IGRheURpdiA9IGNhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLWh1bWFuZGF0ZT0nJHtkYXRlfSddYCk7XG4gICAgICAgIHdoaWxlIChkYXlEaXYuY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGRheURpdi5yZW1vdmVDaGlsZChkYXlEaXYubGFzdENoaWxkKTtcbiAgICAgICAgfVxuICBcbiAgICAgICAgZnVuY3Rpb24gY3JlYXRlTmV3UGFyYSAodGV4dCkge1xuICAgICAgICAgIGNvbnN0IHRpbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgICAgICAgY2FsZW5kYXJUaW1lUGFyZW50LmFwcGVuZENoaWxkKHRpbWUpO1xuICAgICAgICAgIHRpbWUuY2xhc3NMaXN0LmFkZCgnY2FsZW5kYXJUaW1lJyk7XG4gICAgICAgICAgdGltZS50ZXh0Q29udGVudCA9IHRleHQ7XG4gICAgICAgIH1cbiAgXG4gICAgICAgIHNlbGVjdGlvbi5mb3JFYWNoKCh0aW1lVmFsdWUsIGkpID0+IHtcbiAgICAgICAgICBpZiAoaSA9PT0gMCB8fCBpICUgMiA9PT0gMCkge1xuICAgICAgICAgICAgY2FsZW5kYXJUaW1lUGFyZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBjYWxlbmRhclRpbWVQYXJlbnQuY2xhc3NMaXN0LmFkZCgnY2FsZW5kYXJUaW1lUGFyZW50Jyk7XG4gICAgICAgICAgICBkYXlEaXYuYXBwZW5kQ2hpbGQoY2FsZW5kYXJUaW1lUGFyZW50KTtcbiAgICAgICAgICB9XG4gIFxuICAgICAgICAgIGNvbnN0IGZpZWxkTmFtZSA9IE9iamVjdC5rZXlzKHRpbWVWYWx1ZSlbMF07XG4gICAgICAgICAgY3JlYXRlTmV3UGFyYShgJHtmaWVsZE5hbWV9OmApO1xuICAgICAgICAgIGNyZWF0ZU5ld1BhcmEoYCR7dGltZVZhbHVlW2ZpZWxkTmFtZV0uaGh9OiR7dGltZVZhbHVlW2ZpZWxkTmFtZV0ubW19YCk7XG4gICAgICAgICAgXG4gICAgICAgICAgLypcbiAgICAgICAgICBpZiAoZGF5SW5Qb2ludC5jbGFzc0xpc3QuY29udGFpbnMoJ2ZpbGxlcicpID09PSBmYWxzZSkge1xuICAgICAgICAgICAgZGF5SW5Qb2ludC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAnI2ZjMyc7XG4gICAgICAgICAgICBpZiAoaSAlIDIgPT09IDEpIHtcbiAgICAgICAgICAgICAgdGltZS5zdHlsZS5ib3JkZXJCb3R0b21TdHlsZSA9ICdzb2xpZCc7XG4gICAgICAgICAgICAgIGRheUluUG9pbnQuYXBwZW5kQ2hpbGQodGltZSk7XG4gICAgICAgICAgICAgIHRleHRpbnRlcm5hbCA9ICcnO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZGF5SW5Qb2ludC5hcHBlbmRDaGlsZCh0aW1lKTtcbiAgICAgICAgICAgICAgdGV4dGludGVybmFsID0gJyc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSovXG4gICAgICAgIH0pO1xuICAgICAgfVxuICBcbiAgICAgIC8vZ2VuZXJhdGVUaW1lVmFsdWVzT25EYXRlKHRpbWVWYWx1ZXMpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZU1vZGFsIChjbGFzc05hbWUpIHtcbiAgICBjb25zdCBtb2RhbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpYWxvZycpO1xuICAgIG1vZGFsLmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcbiAgICByZXR1cm4gbW9kYWw7XG4gIH1cbiAgXG4gIGZ1bmN0aW9uIG1ha2VCdXR0b24gKHBhcmVudCwgY2xhc3NOYW1lLCB0ZXh0Q29udGVudCwgaG92ZXJUZXh0LCBhY3Rpb24sIGZuKSB7XG4gICAgY29uc3QgYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcbiAgICBidXR0b24udGV4dENvbnRlbnQgPSB0ZXh0Q29udGVudDtcbiAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcihhY3Rpb24sIChlKSA9PiB7XG4gICAgICBmbigpO1xuICAgIH0pO1xuICAgIHBhcmVudC5hcHBlbmRDaGlsZChidXR0b24pO1xuICB9XG4gIFxuICBmdW5jdGlvbiBtYWtlRHJvcERvd25zIChjb250ZXh0VGV4dCwgdGltZVBpY2tlckNvbnRhaW5lcikge1xuICAgIC8vIFRoZSB0aW1lIGNvbnRhaW5lclxuICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCd0aW1lQ29udGFpbmVyJyk7XG4gICAgY29udGFpbmVyLmRhdGFzZXQuY29udGV4dCA9IGNvbnRleHRUZXh0O1xuICAgIHRpbWVQaWNrZXJDb250YWluZXIuYXBwZW5kQ2hpbGQoY29udGFpbmVyKTtcbiAgXG4gICAgLy8gVGhlIHN0b3JhZ2Ugb2JqZWN0XG4gICAgLy8gc2VsZWN0aW9uLnB1c2goW10pO1xuICBcbiAgICAvLyB0aW1lT2JqID0gIFtbXV1cbiAgICAvLyBjb25zdCB0aW1lc09iaiA9IHNlbGVjdGlvbltzZWxlY3Rpb24ubGVuZ3RoIC0gMV07XG4gIFxuICAgIGNvbnN0IHRpbWVGb3JDb250ZXh0ID0geyBbY29udGV4dFRleHRdOiB7fSB9O1xuICBcbiAgICAvLyB0aW1lc09iai5wdXNoKHRpbWVGb3JDb250ZXh0KTtcbiAgICBzZWxlY3Rpb24ucHVzaCh0aW1lRm9yQ29udGV4dCk7XG4gIFxuICAgIC8vIE1ha2UgbGFiZWxcbiAgICBjb25zdCBsYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICBsYWJlbC5jbGFzc0xpc3QuYWRkKCd0aW1lU2VsZWN0UCcpO1xuICAgIGxhYmVsLnRleHRDb250ZW50ID0gYCR7Y29udGV4dFRleHR9OmA7XG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGxhYmVsKTtcbiAgXG4gICAgLy8gTWFrZSBob3VyIHNlbGVjdG9yXG4gICAgY29uc3QgdGltZVNlbGVjdG9yRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdGltZVNlbGVjdG9yRGl2LmRhdGFzZXQuY29udGV4dCA9IGNvbnRleHRUZXh0O1xuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aW1lU2VsZWN0b3JEaXYpO1xuICBcbiAgICBtYWtlU2VsZWN0b3IoJ2hoJywgMjMsIHRpbWVTZWxlY3RvckRpdiwgY29udGV4dFRleHQsIHRpbWVQaWNrZXJDb250YWluZXIsIHRpbWVGb3JDb250ZXh0KTtcbiAgICBtYWtlU2VsZWN0b3IoJ21tJywgNTksIHRpbWVTZWxlY3RvckRpdiwgY29udGV4dFRleHQsIHRpbWVQaWNrZXJDb250YWluZXIsIHRpbWVGb3JDb250ZXh0KTtcbiAgfVxuICBcbiAgZnVuY3Rpb24gbWFrZVNlbGVjdG9yICh0eXBlLCBsaW1pdCwgdGltZVNlbGVjdG9yRGl2LCBjb250ZXh0VGV4dCwgdGltZVBpY2tlckNvbnRhaW5lciwgdGltZUZvckNvbnRleHQpIHtcbiAgICBjb25zdCBkcm9wRG93biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NlbGVjdCcpO1xuICAgIGRyb3BEb3duLmNsYXNzTGlzdC5hZGQodHlwZSwgJ3RpbWVTZWxlY3QnKTtcbiAgICB0aW1lU2VsZWN0b3JEaXYuYXBwZW5kQ2hpbGQoZHJvcERvd24pO1xuICBcbiAgICBkcm9wRG93bi5kYXRhc2V0LnR5cGUgPSB0eXBlO1xuICAgIGRyb3BEb3duLmRhdGFzZXQuY29udGV4dCA9IGNvbnRleHRUZXh0O1xuICBcbiAgICBjb25zdCBwbGFjZWhvbGRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuICAgIHBsYWNlaG9sZGVyLnRleHRDb250ZW50ID0gdHlwZTtcbiAgICBwbGFjZWhvbGRlci52YWx1ZSA9ICcwMCc7XG4gIFxuICAgIC8vIHtcIlN0YXJ0XCI6e1wiaGhcIjpcIjAwXCJ9fSx7XCJTdGFydFwiOntcIm1tXCI6XCIwMFwifX1cbiAgICB0aW1lRm9yQ29udGV4dFtjb250ZXh0VGV4dF1bdHlwZV0gPSBwbGFjZWhvbGRlci52YWx1ZTtcbiAgICAvLyB7W3R5cGVdOiBwbGFjZWhvbGRlci52YWx1ZX1cbiAgICBkcm9wRG93bi5hcHBlbmRDaGlsZChwbGFjZWhvbGRlcik7XG4gIFxuICAgIGxldCBpID0gMDtcbiAgICB3aGlsZSAoaSA8PSBsaW1pdCkge1xuICAgICAgY29uc3QgaG91ciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuICAgICAgbGV0IHRleHQgPSBpLnRvU3RyaW5nKCk7XG4gICAgICBpZiAodGV4dC5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgdGV4dCA9IGAwJHtpfWA7XG4gICAgICB9XG4gICAgICBob3VyLnZhbHVlID0gdGV4dDtcbiAgICAgIGhvdXIudGV4dENvbnRlbnQgPSB0ZXh0O1xuICAgICAgZHJvcERvd24uYXBwZW5kQ2hpbGQoaG91cik7XG4gICAgICBpKys7XG4gICAgfVxuICBcbiAgICBkcm9wRG93bi5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoc2VsZWN0ZWQpID0+IHtcbiAgICAgIHRpbWVGb3JDb250ZXh0W2NvbnRleHRUZXh0XVt0eXBlXSA9IGRyb3BEb3duLnZhbHVlO1xuICAgICAgd3JpdGVUb0RhdGVEaXYoKTtcbiAgICAgIGVtaXRUaW1lU2VsZWN0ZWRFdmVudCgpO1xuICAgIH0pO1xuICB9XG4gIFxuICBmdW5jdGlvbiByZW1vdmVUaW1lVmFsdWVzT25EYXRlICgpIHtcbiAgICBjb25zdCBkID0gZHluYW1pY0RhdGEuZGF0ZXNTZWxlY3RlZEFycmF5T2JqZWN0cztcbiAgICBjb25zdCBsYXN0Q2hvaWNlID0gZFtkLmxlbmd0aCAtIDFdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGFzdENob2ljZS5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgZGF0ZU9iaiA9IGxhc3RDaG9pY2VbaV07XG4gICAgICBjb25zdCBkYXlEaXYgPSBjYWxlbmRhci5xdWVyeVNlbGVjdG9yKGBbZGF0YS1odW1hbmRhdGU9JyR7ZGF0ZU9iai5odW1hbmRhdGV9J11gKTtcbiAgICAgIGRheURpdi5yZW1vdmVDaGlsZChkYXlEaXYubGFzdENoaWxkKTtcbiAgICAgIGRhdGVPYmoudGltZXMgPSBkYXRlT2JqLnRpbWVzLnNsaWNlKDAsIC0yKTtcbiAgICB9XG4gICAgc2VsZWN0aW9uID0gc2VsZWN0aW9uLnNsaWNlKDAsIC0yKTtcbiAgICBjb25zdCB0aW1lQ2hvb3NlciA9IGNhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoJy50aW1lQ2hvb3NlcicpO1xuICAgIHRpbWVDaG9vc2VyLnJlbW92ZUNoaWxkKHRpbWVDaG9vc2VyLmxhc3RDaGlsZCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZGlzcGxheVRpbWVDaG9vc2VyTW9kYWwgKGNhbCwgY29uZiwgZGF0YSkge1xuICBjYWxlbmRhciA9IGNhbDtcbiAgY29uZmlnID0gY29uZjtcbiAgZHluYW1pY0RhdGEgPSBkYXRhO1xuICBpZiAodGltZUNob29zZXJNb2RhbCkge1xuICAgIHRpbWVDaG9vc2VyTW9kYWwuc2hvdygpO1xuICB9IGVsc2Uge1xuICAgIGdlbmVyYXRlVGltZUNob29zZXJNb2RhbCgpLnRoZW4oKG5ld01vZGFsKSA9PiB7XG4gICAgICB0aW1lQ2hvb3Nlck1vZGFsID0gbmV3TW9kYWw7XG4gICAgICB0aW1lQ2hvb3Nlck1vZGFsLnNob3coKTtcbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgeyBHZW5lcmF0ZVRpbWVDaG9vc2VyTW9kYWwgfTtcblxuLy8sIGRpc3BsYXlUaW1lQ2hvb3Nlck1vZGFsLCBnZXRTZWxlY3RlZFRpbWVzLCB3cml0ZVRpbWVzVG9BbGwgXG4iLCIvKiBMYW5ndWFnZSBkZWZhdWx0cyAqL1xuY29uc3QgZW5HYiA9IHtcbiAgZ2VuZXJhbFRpbWU6IHtcbiAgICBtb250aHM6IFsnSmFudWFyeScsICdGZWJydWFyeScsICdNYXJjaCcsICdBcHJpbCcsICdNYXknLCAnSnVuZScsICdKdWx5JywgJ0F1Z3VzdCcsICdTZXB0ZW1iZXInLCAnT2N0b2JlcicsICdOb3ZlbWJlcicsICdEZWNlbWJlciddLFxuICAgIGRheXNJbkZ1bGw6IFsnU3VuZGF5JywgJ01vbmRheScsICdUdWVzZGF5JywgJ1dlZG5lc2RheScsICdUaHVyc2RheScsICdGcmlkYXknLCAnU2F0dXJkYXknXSxcbiAgICBkYXlzVHJ1bmNhdGVkOiBbJ1N1bicsICdNb24nLCAnVHVlJywgJ1dlZCcsICdUaHUnLCAnRnJpJywgJ1NhdCddXG4gIH0sXG4gIGZvcm1hdERheVRleHQ6IHtcbiAgICB0ZXh0QmVmb3JlOiAnU2V0IHRoZXNlIHRpbWVzIGZvciBhbGwnLFxuICAgIHRleHRBZnRlcjogJydcbiAgfSxcbiAgdGltZVdpZGdldDoge1xuICAgIGFkZFRpbWU6ICdBZGQgdGltZTonLFxuICAgIHN0YXJ0OiAnU3RhcnQnLFxuICAgIGVuZDogJ0VuZCdcbiAgfVxufTtcblxuLyogTGFuZ3VhZ2UgZGVmYXVsdHMgKi9cbmNvbnN0IHB0UHQgPSB7XG4gIGdlbmVyYWxUaW1lOiB7XG4gICAgbW9udGhzOiBbJ0phbmVpcm8nLCAnRmV2ZXJlaXJvJywgJ01hcsOnbycsICdBYnJpbCcsICdNYWlvJywgJ0p1bmhvJywgJ0p1bGhvJywgJ0Fnb3N0bycsICdTZXRlbWJybycsICdPdXR1YnJvJywgJ05vdmVtYnJvJywgJ0RlemVtYnJvJ10sXG4gICAgZGF5c0luRnVsbDogWydEb21pbmdvJywgJ1NlZ3VuZGEtRmVpcmEnLCAnVGVyw6dhLUZlaXJhJywgJ1F1YXJ0YS1GZWlyYScsICdRdWludGEtRmVpcmEnLCAnU2V4dGEtRmVpcmEnLCAnU8OhYmFkbyddLFxuICAgIGRheXNUcnVuY2F0ZWQ6IFsnRG9tJywgJ1NlZycsICdUZXInLCAnUXVhJywgJ1F1aScsICdTZXgnLCAnU2FiJ11cbiAgfSxcbiAgZm9ybWF0RGF5VGV4dDoge1xuICAgIHRleHRCZWZvcmU6ICdBcHBsaXF1ZSBlc3RhcyBob3JhcyBhIHRvZG9zJyxcbiAgICB0ZXh0QWZ0ZXI6ICcnXG4gIH0sXG4gIHRpbWVXaWRnZXQ6IHtcbiAgICBhZGRUaW1lOiAnQWRpY2lvbmUgZHVyYcOnw6NvOicsXG4gICAgc3RhcnQ6ICdJbsOtY2lvJyxcbiAgICBlbmQ6ICdGaW0nXG4gIH1cblxufTtcblxuY29uc3QgbGFuZ3VhZ2VzID0geyBlbkdiLCBwdFB0IH07XG5cbmV4cG9ydCB7IGxhbmd1YWdlcyB9O1xuIiwiY29uc3QgY29sb3VycyA9IHtcbiAgbW9udGhDb2xvcjogJyNmYzMnLFxuICBtb250aEJhY2tnb3VuZEJvbG9yOiAnIzY3OTljYicsXG4gIGRheU5hbWVDb2xvcjogJyMwMDAnLFxuICBkYXlOYW1lQmFja2dyb3VuZENvbG9yOiAnI2NjYycsXG4gIGRheUNvbG9yOiAnIzAwMCcsXG4gIGRheUJhY2tncm91bmRDb2xvcjogJyNmZmYnLFxuICBtb250aEJvcmRlckNvbG9yOiAnI2YxNTkyNSdcbn07XG5cbmNvbnN0IHNlbGVjdGVkU3R5bGUgPSAoZGl2KSA9PiB7XG4gIGRpdi5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBjb2xvdXJzLm1vbnRoQ29sb3I7XG59O1xuXG5jb25zdCB1bnNlbGVjdGVkU3R5bGUgPSAoZGl2KSA9PiB7XG4gIGRpdi5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBjb2xvdXJzLmRheUJhY2tncm91bmRDb2xvcjtcbn07XG5cbmV4cG9ydCB7IHNlbGVjdGVkU3R5bGUsIHVuc2VsZWN0ZWRTdHlsZSwgY29sb3VycyB9O1xuIl19
