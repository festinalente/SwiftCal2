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
var css = ".calendar {\n  display: flex;\n  flex-wrap: wrap;\n  flex-direction: row;\n  background-color: rgba(240, 248, 255, 0);\n  width: 100%;\n  height: 28.8em;\n  overflow-y: auto;\n  position: relative;\n  color: #333;\n  font-family: Ubuntu, Arial, Helvetica, sans-serif;\n  font-size: 1.2em;\n  font-weight: 700;\n  line-height: 1.5;\n}\n.calendar .blocked {\n  background-color: #333;\n}\n.calendar .filler {\n  pointer-events: none;\n  opacity: 0.3;\n}\n.calendar .preloaded {\n  border-color: blue;\n  border-style: solid;\n  border-width: 3px;\n}\n.calendar .timeSelect {\n  padding: 0;\n  width: auto;\n  margin: 0;\n  background-color: #fff;\n  float: right;\n  font-weight: 700;\n  font-family: Arial, Helvetica, sans-serif;\n  border-style: solid;\n  border-radius: 1em;\n  text-align: center;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  border-width: 3px;\n  border-color: #f15925;\n  color: #000;\n  font-size: 0.9em;\n}\n.calendar .timeCont {\n  margin-left: auto;\n  width: 20em;\n  background-color: aliceblue;\n  border-style: solid;\n  border-color: #f15925;\n  margin-right: auto;\n  margin-top: 10em;\n}\n.calendar .dayblockrow {\n  display: flex;\n  flex-direction: row;\n  min-width: 100%;\n  background-color: aliceblue;\n}\n.calendar .calendarTimeParent {\n  margin: 0.1em;\n}\n.calendar .calendarTimeParent .calendarTime {\n  font-size: 0.9em;\n  margin-top: 0em;\n  line-height: 1;\n  background-color: aliceblue;\n  color: black;\n  text-align: center;\n  margin: 0px;\n  font-size: 0.8em;\n}\n.calendar .widthShapeDays {\n  width: 14.2857142857%;\n  margin-left: auto;\n  margin-right: auto;\n  text-align: center;\n}\n.calendar .widthShape {\n  width: 14.2857142857%;\n  margin-left: auto;\n  margin-right: auto;\n  text-align: center;\n  min-height: 3.6em;\n  margin-bottom: 0.2em;\n}\n.calendar .monthName {\n  margin: auto;\n  text-align: center;\n  font-family: Ubuntu;\n  font-size: 1.61em;\n  background-color: #337ab7;\n  color: #ffcc33;\n  flex-basis: 100%;\n  border-bottom-style: solid;\n}\n.calendar .weekrow {\n  display: flex;\n  flex-wrap: nowrap;\n  flex-direction: row;\n  background-color: #fff;\n  font-family: \"roboto\", \"arial\";\n}\n.calendar .dayName {\n  color: black;\n  font-family: \"roboto\", \"arial\";\n  font-weight: 600;\n  background-color: #ccc;\n}\n.calendar .month > * {\n  margin-left: 2px;\n  margin-right: 2px;\n}\n.calendar .month {\n  width: 50%;\n  min-width: 300px;\n  margin: auto;\n}\n.calendar .timeChooser {\n  position: static;\n  background-color: aliceblue;\n  margin-left: auto;\n  margin-right: auto;\n}\n.calendar .timeContainer {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.calendar .timeContainer div {\n  display: flex;\n}\n.calendar .timeChooserModal {\n  z-index: 1;\n  width: 100%;\n  height: 100%;\n  background-color: rgba(0, 0, 0, 0.4);\n  position: absolute;\n  margin: 0;\n  padding: 0;\n  border: 0;\n  overflow-x: scroll;\n}\n.calendar .calendarLabel {\n  min-width: 3em;\n  padding: 0em 1em 0em 1em;\n  color: black;\n  font-family: \"roboto\", \"arial\";\n  font-weight: 600;\n  background-color: #ccc;\n  margin: 1em 0 1em 0;\n}\n.calendar .deleteDiv {\n  font-family: Ubuntu;\n  background-color: #337ab7;\n  color: #ffcc33;\n  border-bottom-style: solid;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.calendar .deleteButton {\n  background-color: white;\n  color: #f15925;\n  float: right;\n  font-weight: 700;\n  font-family: Arial, Helvetica, sans-serif;\n  border-style: solid;\n  border-radius: 2em;\n  text-align: center;\n  height: 2em;\n  width: 2em;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  margin: 0 0.5em;\n  font-size: 1.5em;\n}\n.calendar .innerSpanDeleteBtn {\n  text-align: center;\n}\n.calendar .deleteButton:hover,\n.calendar .deleteButton:focus,\n.calendar .timeSelect:hover,\n.calendar .timeSelect:focus {\n  color: #000;\n  text-decoration: none;\n  cursor: pointer;\n}\n.calendar .hour {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 10em;\n}\n.calendar .timeSelectP {\n  display: inline;\n  width: 5em;\n  color: #000;\n}\n.calendar .timeChooser > input[type=checkbox] {\n  outline: #f15925;\n  outline-style: solid;\n}\n.calendar .timeSelect > option {\n  color: #000;\n}\n.calendar .calendar > p,\n.calendar h4,\n.calendar h3,\n.calendar h2,\n.calendar h1,\n.calendar select,\n.calendar option {\n  color: #000;\n}\n.calendar .arrow-up {\n  width: 0;\n  height: 0;\n  border-left: 10px solid transparent;\n  border-right: 10px solid transparent;\n  border-bottom: 10px solid black;\n}\n.calendar .arrow-down {\n  width: 0;\n  height: 0;\n  border-left: 10px solid transparent;\n  border-right: 10px solid transparent;\n  border-top: 10px solid #000;\n}\n.calendar .arrows {\n  float: right;\n  clear: right;\n  position: relative;\n  cursor: pointer;\n  flex-direction: column;\n}\n.calendar .arrow-right {\n  width: 0;\n  height: 0;\n  border-top: 60px solid transparent;\n  border-bottom: 60px solid transparent;\n  border-left: 60px solid green;\n}\n.calendar .arrow-left {\n  width: 0;\n  height: 0;\n  border-top: 10px solid transparent;\n  border-bottom: 10px solid transparent;\n  border-right: 10px solid blue;\n}\n.calendar .dayTime {\n  cursor: pointer;\n}\n.calendar .dayTime > * {\n  pointer-events: none;\n}\n"; (require("browserify-css").createStyle(css, { "href": "preBundlingJS/calendarApp.css" }, { "insertAt": "bottom" })); module.exports = css;
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
   * @param dates array
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
        newObjectsArray[newArray.length - 1] = standardDateObject(dateDiv);
      }
    }
  }
  function preloadDates(preloadedDates) {
    function getDivs(dates) {
      var dateDivs = [];
      var promise = new Promise(function (resolve, reject) {
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
    getDivs(preloadedDates).then(function (dateDivs) {
      // bookDates(dateDivs);
    });
  }
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
  function humandateToUTC(humandate) {
    var ints = humandate.split('-');
    ints = ints.map(function (_int) {
      return parseInt(_int);
    });
    ints[1] = ints[1] - 1;
    return Date.UTC(ints[0], ints[1], ints[2]);
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
      dynamicData.datesSelectedArray[dynamicData.datesSelectedArray.length - 1].forEach(function (daySelected) {
        write(daySelected);
      });

      // contains a time duration choice
      var calendarTimeParent;
    }
  }
  function makeButton(parent, className, textContent, hoverText, action, fn) {
    var button = document.createElement('div');
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
    addTime: "Adicione dura\xE7\xE3o:",
    start: "In\xEDcio",
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS1jc3MvYnJvd3Nlci5qcyIsInByZUJ1bmRsaW5nSlMvYmFzaWNGdW5jdGlvbnMuanMiLCJwcmVCdW5kbGluZ0pTL2NhbGVuZGFyQXBwLmNzcyIsInByZUJ1bmRsaW5nSlMvY2FsZW5kYXJHZW5lcmF0b3IuanMiLCJwcmVCdW5kbGluZ0pTL2Rpc3BsYXlUaW1lQ2hvb3Nlck1vZGFsLmpzIiwicHJlQnVuZGxpbmdKUy9sYW5ndWFnZXMuanMiLCJwcmVCdW5kbGluZ0pTL3N0eWxlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzNFQSxJQUFBLE9BQUEsR0FBQSxPQUFBO0FBQ0EsSUFBQSxrQkFBQSxHQUFBLE9BQUE7QUFDQSxJQUFBLHdCQUFBLEdBQUEsT0FBQTtBQUF5RixTQUFBLG9CQUFBLGtCQUR6RixxSkFBQSxtQkFBQSxZQUFBLG9CQUFBLFdBQUEsQ0FBQSxTQUFBLENBQUEsRUFBQSxDQUFBLE9BQUEsQ0FBQSxHQUFBLE1BQUEsQ0FBQSxTQUFBLEVBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxjQUFBLEVBQUEsQ0FBQSxHQUFBLE1BQUEsQ0FBQSxjQUFBLGNBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBLElBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFBLENBQUEsS0FBQSxLQUFBLENBQUEsd0JBQUEsTUFBQSxHQUFBLE1BQUEsT0FBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLFFBQUEsa0JBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxhQUFBLHVCQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsV0FBQSw4QkFBQSxPQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxXQUFBLE1BQUEsQ0FBQSxjQUFBLENBQUEsQ0FBQSxFQUFBLENBQUEsSUFBQSxLQUFBLEVBQUEsQ0FBQSxFQUFBLFVBQUEsTUFBQSxZQUFBLE1BQUEsUUFBQSxTQUFBLENBQUEsQ0FBQSxDQUFBLFdBQUEsTUFBQSxtQkFBQSxDQUFBLElBQUEsTUFBQSxZQUFBLE9BQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBLFdBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFBLGdCQUFBLEtBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxRQUFBLENBQUEsR0FBQSxDQUFBLElBQUEsQ0FBQSxDQUFBLFNBQUEsWUFBQSxTQUFBLEdBQUEsQ0FBQSxHQUFBLFNBQUEsRUFBQSxDQUFBLEdBQUEsTUFBQSxDQUFBLE1BQUEsQ0FBQSxDQUFBLENBQUEsU0FBQSxHQUFBLENBQUEsT0FBQSxPQUFBLENBQUEsQ0FBQSxnQkFBQSxDQUFBLENBQUEsQ0FBQSxlQUFBLEtBQUEsRUFBQSxnQkFBQSxDQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxNQUFBLENBQUEsYUFBQSxTQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxtQkFBQSxJQUFBLFlBQUEsR0FBQSxFQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsQ0FBQSxFQUFBLENBQUEsY0FBQSxDQUFBLGFBQUEsSUFBQSxXQUFBLEdBQUEsRUFBQSxDQUFBLFFBQUEsQ0FBQSxDQUFBLElBQUEsR0FBQSxJQUFBLE1BQUEsQ0FBQSxxQkFBQSxDQUFBLHFCQUFBLENBQUEsZ0JBQUEsQ0FBQSxnQkFBQSxDQUFBLGdCQUFBLFVBQUEsY0FBQSxrQkFBQSxjQUFBLDJCQUFBLFNBQUEsQ0FBQSxPQUFBLE1BQUEsQ0FBQSxDQUFBLEVBQUEsQ0FBQSxxQ0FBQSxDQUFBLEdBQUEsTUFBQSxDQUFBLGNBQUEsRUFBQSxDQUFBLEdBQUEsQ0FBQSxJQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsTUFBQSxRQUFBLENBQUEsSUFBQSxDQUFBLEtBQUEsQ0FBQSxJQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsQ0FBQSxFQUFBLENBQUEsTUFBQSxDQUFBLEdBQUEsQ0FBQSxPQUFBLENBQUEsR0FBQSwwQkFBQSxDQUFBLFNBQUEsR0FBQSxTQUFBLENBQUEsU0FBQSxHQUFBLE1BQUEsQ0FBQSxNQUFBLENBQUEsQ0FBQSxZQUFBLHNCQUFBLENBQUEsZ0NBQUEsT0FBQSxXQUFBLENBQUEsSUFBQSxNQUFBLENBQUEsQ0FBQSxFQUFBLENBQUEsWUFBQSxDQUFBLGdCQUFBLE9BQUEsQ0FBQSxDQUFBLEVBQUEsQ0FBQSxzQkFBQSxjQUFBLENBQUEsRUFBQSxDQUFBLGFBQUEsT0FBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBLFFBQUEsQ0FBQSxHQUFBLFFBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxHQUFBLENBQUEsRUFBQSxDQUFBLG1CQUFBLENBQUEsQ0FBQSxJQUFBLFFBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxHQUFBLEVBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxLQUFBLFNBQUEsQ0FBQSxnQkFBQSxPQUFBLENBQUEsQ0FBQSxLQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsQ0FBQSxlQUFBLENBQUEsQ0FBQSxPQUFBLENBQUEsQ0FBQSxDQUFBLE9BQUEsRUFBQSxJQUFBLFdBQUEsQ0FBQSxJQUFBLE1BQUEsU0FBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsZ0JBQUEsQ0FBQSxJQUFBLE1BQUEsVUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsUUFBQSxDQUFBLENBQUEsT0FBQSxDQUFBLENBQUEsRUFBQSxJQUFBLFdBQUEsQ0FBQSxJQUFBLENBQUEsQ0FBQSxLQUFBLEdBQUEsQ0FBQSxFQUFBLENBQUEsQ0FBQSxDQUFBLGdCQUFBLENBQUEsV0FBQSxNQUFBLFVBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBLFNBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxHQUFBLFNBQUEsQ0FBQSxFQUFBLENBQUEsb0JBQUEsS0FBQSxXQUFBLE1BQUEsQ0FBQSxFQUFBLENBQUEsYUFBQSwyQkFBQSxlQUFBLENBQUEsV0FBQSxDQUFBLEVBQUEsQ0FBQSxJQUFBLE1BQUEsQ0FBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBLGdCQUFBLENBQUEsR0FBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSwwQkFBQSxFQUFBLDBCQUFBLElBQUEsMEJBQUEscUJBQUEsaUJBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBLFFBQUEsQ0FBQSxHQUFBLENBQUEsbUJBQUEsQ0FBQSxFQUFBLENBQUEsUUFBQSxDQUFBLEtBQUEsQ0FBQSxZQUFBLEtBQUEsc0NBQUEsQ0FBQSxLQUFBLENBQUEsb0JBQUEsQ0FBQSxRQUFBLENBQUEsV0FBQSxLQUFBLEVBQUEsQ0FBQSxFQUFBLElBQUEsZUFBQSxDQUFBLENBQUEsTUFBQSxHQUFBLENBQUEsRUFBQSxDQUFBLENBQUEsR0FBQSxHQUFBLENBQUEsVUFBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLFFBQUEsTUFBQSxDQUFBLFFBQUEsQ0FBQSxHQUFBLG1CQUFBLENBQUEsQ0FBQSxFQUFBLENBQUEsT0FBQSxDQUFBLFFBQUEsQ0FBQSxLQUFBLENBQUEsbUJBQUEsQ0FBQSxxQkFBQSxDQUFBLENBQUEsTUFBQSxFQUFBLENBQUEsQ0FBQSxJQUFBLEdBQUEsQ0FBQSxDQUFBLEtBQUEsR0FBQSxDQUFBLENBQUEsR0FBQSxzQkFBQSxDQUFBLENBQUEsTUFBQSxRQUFBLENBQUEsS0FBQSxDQUFBLFFBQUEsQ0FBQSxHQUFBLENBQUEsRUFBQSxDQUFBLENBQUEsR0FBQSxFQUFBLENBQUEsQ0FBQSxpQkFBQSxDQUFBLENBQUEsQ0FBQSxHQUFBLHVCQUFBLENBQUEsQ0FBQSxNQUFBLElBQUEsQ0FBQSxDQUFBLE1BQUEsV0FBQSxDQUFBLENBQUEsR0FBQSxHQUFBLENBQUEsR0FBQSxDQUFBLE1BQUEsQ0FBQSxHQUFBLFFBQUEsQ0FBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsb0JBQUEsQ0FBQSxDQUFBLElBQUEsUUFBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLElBQUEsR0FBQSxDQUFBLEdBQUEsQ0FBQSxFQUFBLENBQUEsQ0FBQSxHQUFBLEtBQUEsQ0FBQSxxQkFBQSxLQUFBLEVBQUEsQ0FBQSxDQUFBLEdBQUEsRUFBQSxJQUFBLEVBQUEsQ0FBQSxDQUFBLElBQUEsa0JBQUEsQ0FBQSxDQUFBLElBQUEsS0FBQSxDQUFBLEdBQUEsQ0FBQSxFQUFBLENBQUEsQ0FBQSxNQUFBLFlBQUEsQ0FBQSxDQUFBLEdBQUEsR0FBQSxDQUFBLENBQUEsR0FBQSxtQkFBQSxvQkFBQSxDQUFBLEVBQUEsQ0FBQSxRQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsTUFBQSxFQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsUUFBQSxDQUFBLENBQUEsT0FBQSxDQUFBLEtBQUEsQ0FBQSxTQUFBLENBQUEsQ0FBQSxRQUFBLHFCQUFBLENBQUEsSUFBQSxDQUFBLENBQUEsUUFBQSxlQUFBLENBQUEsQ0FBQSxNQUFBLGFBQUEsQ0FBQSxDQUFBLEdBQUEsR0FBQSxDQUFBLEVBQUEsbUJBQUEsQ0FBQSxDQUFBLEVBQUEsQ0FBQSxlQUFBLENBQUEsQ0FBQSxNQUFBLGtCQUFBLENBQUEsS0FBQSxDQUFBLENBQUEsTUFBQSxZQUFBLENBQUEsQ0FBQSxHQUFBLE9BQUEsU0FBQSx1Q0FBQSxDQUFBLGlCQUFBLENBQUEsTUFBQSxDQUFBLEdBQUEsUUFBQSxDQUFBLENBQUEsRUFBQSxDQUFBLENBQUEsUUFBQSxFQUFBLENBQUEsQ0FBQSxHQUFBLG1CQUFBLENBQUEsQ0FBQSxJQUFBLFNBQUEsQ0FBQSxDQUFBLE1BQUEsWUFBQSxDQUFBLENBQUEsR0FBQSxHQUFBLENBQUEsQ0FBQSxHQUFBLEVBQUEsQ0FBQSxDQUFBLFFBQUEsU0FBQSxDQUFBLE1BQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxHQUFBLFNBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxJQUFBLElBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxVQUFBLElBQUEsQ0FBQSxDQUFBLEtBQUEsRUFBQSxDQUFBLENBQUEsSUFBQSxHQUFBLENBQUEsQ0FBQSxPQUFBLGVBQUEsQ0FBQSxDQUFBLE1BQUEsS0FBQSxDQUFBLENBQUEsTUFBQSxXQUFBLENBQUEsQ0FBQSxHQUFBLEdBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxRQUFBLFNBQUEsQ0FBQSxJQUFBLENBQUEsSUFBQSxDQUFBLENBQUEsTUFBQSxZQUFBLENBQUEsQ0FBQSxHQUFBLE9BQUEsU0FBQSxzQ0FBQSxDQUFBLENBQUEsUUFBQSxTQUFBLENBQUEsY0FBQSxhQUFBLENBQUEsUUFBQSxDQUFBLEtBQUEsTUFBQSxFQUFBLENBQUEsWUFBQSxDQUFBLEtBQUEsQ0FBQSxDQUFBLFFBQUEsR0FBQSxDQUFBLFdBQUEsQ0FBQSxLQUFBLENBQUEsQ0FBQSxVQUFBLEdBQUEsQ0FBQSxLQUFBLENBQUEsQ0FBQSxRQUFBLEdBQUEsQ0FBQSxXQUFBLFVBQUEsQ0FBQSxJQUFBLENBQUEsQ0FBQSxjQUFBLGNBQUEsQ0FBQSxRQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsVUFBQSxRQUFBLENBQUEsQ0FBQSxJQUFBLG9CQUFBLENBQUEsQ0FBQSxHQUFBLEVBQUEsQ0FBQSxDQUFBLFVBQUEsR0FBQSxDQUFBLGFBQUEsUUFBQSxDQUFBLFNBQUEsVUFBQSxNQUFBLE1BQUEsYUFBQSxDQUFBLENBQUEsT0FBQSxDQUFBLFlBQUEsY0FBQSxLQUFBLGlCQUFBLE9BQUEsQ0FBQSxRQUFBLENBQUEsV0FBQSxDQUFBLFFBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxDQUFBLE9BQUEsQ0FBQSxTQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsQ0FBQSw0QkFBQSxDQUFBLENBQUEsSUFBQSxTQUFBLENBQUEsT0FBQSxLQUFBLENBQUEsQ0FBQSxDQUFBLE1BQUEsU0FBQSxDQUFBLE9BQUEsQ0FBQSxZQUFBLEtBQUEsYUFBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLE1BQUEsT0FBQSxDQUFBLENBQUEsSUFBQSxDQUFBLENBQUEsRUFBQSxDQUFBLFVBQUEsSUFBQSxDQUFBLEtBQUEsR0FBQSxDQUFBLENBQUEsQ0FBQSxHQUFBLElBQUEsQ0FBQSxJQUFBLE9BQUEsSUFBQSxTQUFBLElBQUEsQ0FBQSxLQUFBLEdBQUEsQ0FBQSxFQUFBLElBQUEsQ0FBQSxJQUFBLE9BQUEsSUFBQSxZQUFBLENBQUEsQ0FBQSxJQUFBLEdBQUEsQ0FBQSxnQkFBQSxTQUFBLENBQUEsT0FBQSxDQUFBLENBQUEsa0NBQUEsaUJBQUEsQ0FBQSxTQUFBLEdBQUEsMEJBQUEsRUFBQSxDQUFBLENBQUEsQ0FBQSxtQkFBQSxLQUFBLEVBQUEsMEJBQUEsRUFBQSxZQUFBLFNBQUEsQ0FBQSxDQUFBLDBCQUFBLG1CQUFBLEtBQUEsRUFBQSxpQkFBQSxFQUFBLFlBQUEsU0FBQSxpQkFBQSxDQUFBLFdBQUEsR0FBQSxNQUFBLENBQUEsMEJBQUEsRUFBQSxDQUFBLHdCQUFBLENBQUEsQ0FBQSxtQkFBQSxhQUFBLENBQUEsUUFBQSxDQUFBLHdCQUFBLENBQUEsSUFBQSxDQUFBLENBQUEsV0FBQSxXQUFBLENBQUEsS0FBQSxDQUFBLEtBQUEsaUJBQUEsNkJBQUEsQ0FBQSxDQUFBLFdBQUEsSUFBQSxDQUFBLENBQUEsSUFBQSxPQUFBLENBQUEsQ0FBQSxJQUFBLGFBQUEsQ0FBQSxXQUFBLE1BQUEsQ0FBQSxjQUFBLEdBQUEsTUFBQSxDQUFBLGNBQUEsQ0FBQSxDQUFBLEVBQUEsMEJBQUEsS0FBQSxDQUFBLENBQUEsU0FBQSxHQUFBLDBCQUFBLEVBQUEsTUFBQSxDQUFBLENBQUEsRUFBQSxDQUFBLHlCQUFBLENBQUEsQ0FBQSxTQUFBLEdBQUEsTUFBQSxDQUFBLE1BQUEsQ0FBQSxDQUFBLEdBQUEsQ0FBQSxLQUFBLENBQUEsQ0FBQSxLQUFBLGFBQUEsQ0FBQSxhQUFBLE9BQUEsRUFBQSxDQUFBLE9BQUEscUJBQUEsQ0FBQSxhQUFBLENBQUEsU0FBQSxHQUFBLE1BQUEsQ0FBQSxhQUFBLENBQUEsU0FBQSxFQUFBLENBQUEsaUNBQUEsQ0FBQSxDQUFBLGFBQUEsR0FBQSxhQUFBLEVBQUEsQ0FBQSxDQUFBLEtBQUEsYUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxlQUFBLENBQUEsS0FBQSxDQUFBLEdBQUEsT0FBQSxPQUFBLENBQUEsT0FBQSxhQUFBLENBQUEsSUFBQSxDQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsR0FBQSxDQUFBLFVBQUEsQ0FBQSxDQUFBLG1CQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsSUFBQSxHQUFBLElBQUEsV0FBQSxDQUFBLFdBQUEsQ0FBQSxDQUFBLElBQUEsR0FBQSxDQUFBLENBQUEsS0FBQSxHQUFBLENBQUEsQ0FBQSxJQUFBLFdBQUEscUJBQUEsQ0FBQSxDQUFBLEdBQUEsTUFBQSxDQUFBLENBQUEsRUFBQSxDQUFBLGdCQUFBLE1BQUEsQ0FBQSxDQUFBLEVBQUEsQ0FBQSxpQ0FBQSxNQUFBLENBQUEsQ0FBQSw2REFBQSxDQUFBLENBQUEsSUFBQSxhQUFBLENBQUEsUUFBQSxDQUFBLEdBQUEsTUFBQSxDQUFBLENBQUEsR0FBQSxDQUFBLGdCQUFBLENBQUEsSUFBQSxDQUFBLEVBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxDQUFBLFVBQUEsQ0FBQSxDQUFBLE9BQUEsYUFBQSxLQUFBLFdBQUEsQ0FBQSxDQUFBLE1BQUEsU0FBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLEdBQUEsUUFBQSxDQUFBLElBQUEsQ0FBQSxTQUFBLElBQUEsQ0FBQSxLQUFBLEdBQUEsQ0FBQSxFQUFBLElBQUEsQ0FBQSxJQUFBLE9BQUEsSUFBQSxXQUFBLElBQUEsQ0FBQSxJQUFBLE9BQUEsSUFBQSxRQUFBLENBQUEsQ0FBQSxNQUFBLEdBQUEsTUFBQSxFQUFBLE9BQUEsQ0FBQSxTQUFBLEtBQUEsV0FBQSxFQUFBLE9BQUEsRUFBQSxLQUFBLFdBQUEsTUFBQSxDQUFBLGFBQUEsSUFBQSxXQUFBLElBQUEsV0FBQSxJQUFBLFFBQUEsS0FBQSxHQUFBLENBQUEsT0FBQSxJQUFBLFlBQUEsUUFBQSxjQUFBLE1BQUEsZ0JBQUEsR0FBQSxHQUFBLENBQUEsT0FBQSxVQUFBLENBQUEsT0FBQSxDQUFBLGFBQUEsSUFBQSxDQUFBLFdBQUEsQ0FBQSxrQkFBQSxDQUFBLENBQUEsTUFBQSxPQUFBLENBQUEsQ0FBQSxJQUFBLE9BQUEsQ0FBQSxNQUFBLEtBQUEsRUFBQSxDQUFBLENBQUEsS0FBQSxjQUFBLENBQUEsSUFBQSxDQUFBLE1BQUEsSUFBQSxXQUFBLEtBQUEsU0FBQSxJQUFBLFdBQUEsQ0FBQSxRQUFBLFVBQUEsSUFBQSxVQUFBLGtCQUFBLENBQUEsQ0FBQSxJQUFBLFFBQUEsQ0FBQSxDQUFBLEdBQUEsY0FBQSxJQUFBLEtBQUEsaUJBQUEsV0FBQSxrQkFBQSxDQUFBLGFBQUEsSUFBQSxRQUFBLENBQUEsTUFBQSxDQUFBLGtCQUFBLE9BQUEsQ0FBQSxFQUFBLENBQUEsV0FBQSxDQUFBLENBQUEsSUFBQSxZQUFBLENBQUEsQ0FBQSxHQUFBLEdBQUEsQ0FBQSxFQUFBLENBQUEsQ0FBQSxJQUFBLEdBQUEsQ0FBQSxFQUFBLENBQUEsS0FBQSxDQUFBLENBQUEsTUFBQSxXQUFBLENBQUEsQ0FBQSxHQUFBLEdBQUEsQ0FBQSxLQUFBLENBQUEsYUFBQSxDQUFBLFFBQUEsVUFBQSxDQUFBLE1BQUEsTUFBQSxDQUFBLFNBQUEsQ0FBQSxRQUFBLENBQUEsUUFBQSxVQUFBLENBQUEsQ0FBQSxHQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsVUFBQSxpQkFBQSxDQUFBLENBQUEsTUFBQSxTQUFBLE1BQUEsYUFBQSxDQUFBLENBQUEsTUFBQSxTQUFBLElBQUEsUUFBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxDQUFBLGVBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsQ0FBQSxxQkFBQSxDQUFBLElBQUEsQ0FBQSxhQUFBLElBQUEsR0FBQSxDQUFBLENBQUEsUUFBQSxTQUFBLE1BQUEsQ0FBQSxDQUFBLENBQUEsUUFBQSxnQkFBQSxJQUFBLEdBQUEsQ0FBQSxDQUFBLFVBQUEsU0FBQSxNQUFBLENBQUEsQ0FBQSxDQUFBLFVBQUEsY0FBQSxDQUFBLGFBQUEsSUFBQSxHQUFBLENBQUEsQ0FBQSxRQUFBLFNBQUEsTUFBQSxDQUFBLENBQUEsQ0FBQSxRQUFBLHFCQUFBLENBQUEsWUFBQSxLQUFBLHFEQUFBLElBQUEsR0FBQSxDQUFBLENBQUEsVUFBQSxTQUFBLE1BQUEsQ0FBQSxDQUFBLENBQUEsVUFBQSxZQUFBLE1BQUEsV0FBQSxPQUFBLENBQUEsRUFBQSxDQUFBLGFBQUEsQ0FBQSxRQUFBLFVBQUEsQ0FBQSxNQUFBLE1BQUEsQ0FBQSxTQUFBLENBQUEsUUFBQSxDQUFBLFFBQUEsVUFBQSxDQUFBLENBQUEsT0FBQSxDQUFBLENBQUEsTUFBQSxTQUFBLElBQUEsSUFBQSxDQUFBLENBQUEsSUFBQSxDQUFBLENBQUEsd0JBQUEsSUFBQSxHQUFBLENBQUEsQ0FBQSxVQUFBLFFBQUEsQ0FBQSxHQUFBLENBQUEsYUFBQSxDQUFBLGlCQUFBLENBQUEsbUJBQUEsQ0FBQSxLQUFBLENBQUEsQ0FBQSxNQUFBLElBQUEsQ0FBQSxJQUFBLENBQUEsSUFBQSxDQUFBLENBQUEsVUFBQSxLQUFBLENBQUEsY0FBQSxDQUFBLEdBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxVQUFBLGNBQUEsQ0FBQSxDQUFBLElBQUEsR0FBQSxDQUFBLEVBQUEsQ0FBQSxDQUFBLEdBQUEsR0FBQSxDQUFBLEVBQUEsQ0FBQSxTQUFBLE1BQUEsZ0JBQUEsSUFBQSxHQUFBLENBQUEsQ0FBQSxVQUFBLEVBQUEsQ0FBQSxTQUFBLFFBQUEsQ0FBQSxDQUFBLE1BQUEsUUFBQSxXQUFBLFNBQUEsQ0FBQSxFQUFBLENBQUEsb0JBQUEsQ0FBQSxDQUFBLElBQUEsUUFBQSxDQUFBLENBQUEsR0FBQSxxQkFBQSxDQUFBLENBQUEsSUFBQSxtQkFBQSxDQUFBLENBQUEsSUFBQSxRQUFBLElBQUEsR0FBQSxDQUFBLENBQUEsR0FBQSxnQkFBQSxDQUFBLENBQUEsSUFBQSxTQUFBLElBQUEsUUFBQSxHQUFBLEdBQUEsQ0FBQSxDQUFBLEdBQUEsT0FBQSxNQUFBLGtCQUFBLElBQUEseUJBQUEsQ0FBQSxDQUFBLElBQUEsSUFBQSxDQUFBLFVBQUEsSUFBQSxHQUFBLENBQUEsR0FBQSxDQUFBLEtBQUEsTUFBQSxXQUFBLE9BQUEsQ0FBQSxhQUFBLENBQUEsUUFBQSxVQUFBLENBQUEsTUFBQSxNQUFBLENBQUEsU0FBQSxDQUFBLFFBQUEsQ0FBQSxRQUFBLFVBQUEsQ0FBQSxDQUFBLE9BQUEsQ0FBQSxDQUFBLFVBQUEsS0FBQSxDQUFBLGNBQUEsUUFBQSxDQUFBLENBQUEsQ0FBQSxVQUFBLEVBQUEsQ0FBQSxDQUFBLFFBQUEsR0FBQSxhQUFBLENBQUEsQ0FBQSxHQUFBLENBQUEseUJBQUEsT0FBQSxDQUFBLGFBQUEsQ0FBQSxRQUFBLFVBQUEsQ0FBQSxNQUFBLE1BQUEsQ0FBQSxTQUFBLENBQUEsUUFBQSxDQUFBLFFBQUEsVUFBQSxDQUFBLENBQUEsT0FBQSxDQUFBLENBQUEsTUFBQSxLQUFBLENBQUEsUUFBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLFVBQUEsa0JBQUEsQ0FBQSxDQUFBLElBQUEsUUFBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLEdBQUEsRUFBQSxhQUFBLENBQUEsQ0FBQSxZQUFBLENBQUEsZ0JBQUEsS0FBQSw4QkFBQSxhQUFBLFdBQUEsY0FBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsZ0JBQUEsUUFBQSxLQUFBLFFBQUEsRUFBQSxNQUFBLENBQUEsQ0FBQSxHQUFBLFVBQUEsRUFBQSxDQUFBLEVBQUEsT0FBQSxFQUFBLENBQUEsb0JBQUEsTUFBQSxVQUFBLEdBQUEsR0FBQSxDQUFBLEdBQUEsQ0FBQSxPQUFBLENBQUE7QUFBQSxTQUFBLG1CQUFBLEdBQUEsRUFBQSxPQUFBLEVBQUEsTUFBQSxFQUFBLEtBQUEsRUFBQSxNQUFBLEVBQUEsR0FBQSxFQUFBLEdBQUEsY0FBQSxJQUFBLEdBQUEsR0FBQSxDQUFBLEdBQUEsRUFBQSxHQUFBLE9BQUEsS0FBQSxHQUFBLElBQUEsQ0FBQSxLQUFBLFdBQUEsS0FBQSxJQUFBLE1BQUEsQ0FBQSxLQUFBLGlCQUFBLElBQUEsQ0FBQSxJQUFBLElBQUEsT0FBQSxDQUFBLEtBQUEsWUFBQSxPQUFBLENBQUEsT0FBQSxDQUFBLEtBQUEsRUFBQSxJQUFBLENBQUEsS0FBQSxFQUFBLE1BQUE7QUFBQSxTQUFBLGtCQUFBLEVBQUEsNkJBQUEsSUFBQSxTQUFBLElBQUEsR0FBQSxTQUFBLGFBQUEsT0FBQSxXQUFBLE9BQUEsRUFBQSxNQUFBLFFBQUEsR0FBQSxHQUFBLEVBQUEsQ0FBQSxLQUFBLENBQUEsSUFBQSxFQUFBLElBQUEsWUFBQSxNQUFBLEtBQUEsSUFBQSxrQkFBQSxDQUFBLEdBQUEsRUFBQSxPQUFBLEVBQUEsTUFBQSxFQUFBLEtBQUEsRUFBQSxNQUFBLFVBQUEsS0FBQSxjQUFBLE9BQUEsR0FBQSxJQUFBLGtCQUFBLENBQUEsR0FBQSxFQUFBLE9BQUEsRUFBQSxNQUFBLEVBQUEsS0FBQSxFQUFBLE1BQUEsV0FBQSxHQUFBLEtBQUEsS0FBQSxDQUFBLFNBQUE7QUFBQSxTQUFBLGVBQUEsR0FBQSxFQUFBLENBQUEsV0FBQSxlQUFBLENBQUEsR0FBQSxLQUFBLHFCQUFBLENBQUEsR0FBQSxFQUFBLENBQUEsS0FBQSwyQkFBQSxDQUFBLEdBQUEsRUFBQSxDQUFBLEtBQUEsZ0JBQUE7QUFBQSxTQUFBLGlCQUFBLGNBQUEsU0FBQTtBQUFBLFNBQUEsNEJBQUEsQ0FBQSxFQUFBLE1BQUEsU0FBQSxDQUFBLHFCQUFBLENBQUEsc0JBQUEsaUJBQUEsQ0FBQSxDQUFBLEVBQUEsTUFBQSxPQUFBLENBQUEsR0FBQSxNQUFBLENBQUEsU0FBQSxDQUFBLFFBQUEsQ0FBQSxJQUFBLENBQUEsQ0FBQSxFQUFBLEtBQUEsYUFBQSxDQUFBLGlCQUFBLENBQUEsQ0FBQSxXQUFBLEVBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxXQUFBLENBQUEsSUFBQSxNQUFBLENBQUEsY0FBQSxDQUFBLG1CQUFBLEtBQUEsQ0FBQSxJQUFBLENBQUEsQ0FBQSxPQUFBLENBQUEsK0RBQUEsSUFBQSxDQUFBLENBQUEsVUFBQSxpQkFBQSxDQUFBLENBQUEsRUFBQSxNQUFBO0FBQUEsU0FBQSxrQkFBQSxHQUFBLEVBQUEsR0FBQSxRQUFBLEdBQUEsWUFBQSxHQUFBLEdBQUEsR0FBQSxDQUFBLE1BQUEsRUFBQSxHQUFBLEdBQUEsR0FBQSxDQUFBLE1BQUEsV0FBQSxDQUFBLE1BQUEsSUFBQSxPQUFBLEtBQUEsQ0FBQSxHQUFBLEdBQUEsQ0FBQSxHQUFBLEdBQUEsRUFBQSxDQUFBLElBQUEsSUFBQSxDQUFBLENBQUEsSUFBQSxHQUFBLENBQUEsQ0FBQSxVQUFBLElBQUE7QUFBQSxTQUFBLHNCQUFBLENBQUEsRUFBQSxDQUFBLFFBQUEsQ0FBQSxXQUFBLENBQUEsZ0NBQUEsTUFBQSxJQUFBLENBQUEsQ0FBQSxNQUFBLENBQUEsUUFBQSxLQUFBLENBQUEsNEJBQUEsQ0FBQSxRQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBLE9BQUEsQ0FBQSxPQUFBLENBQUEsaUJBQUEsQ0FBQSxJQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsSUFBQSxDQUFBLENBQUEsR0FBQSxJQUFBLFFBQUEsQ0FBQSxRQUFBLE1BQUEsQ0FBQSxDQUFBLE1BQUEsQ0FBQSxVQUFBLENBQUEsdUJBQUEsQ0FBQSxJQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsSUFBQSxDQUFBLENBQUEsR0FBQSxJQUFBLE1BQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxDQUFBLENBQUEsS0FBQSxHQUFBLENBQUEsQ0FBQSxNQUFBLEtBQUEsQ0FBQSxHQUFBLENBQUEs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LENBQUEsQ0FBQSxVQUFBLGlCQUFBLENBQUEsQ0FBQSxFQUFBLE1BQUE7QUFBQSxTQUFBLGtCQUFBLEdBQUEsRUFBQSxHQUFBLFFBQUEsR0FBQSxZQUFBLEdBQUEsR0FBQSxHQUFBLENBQUEsTUFBQSxFQUFBLEdBQUEsR0FBQSxHQUFBLENBQUEsTUFBQSxXQUFBLENBQUEsTUFBQSxJQUFBLE9BQUEsS0FBQSxDQUFBLEdBQUEsR0FBQSxDQUFBLEdBQUEsR0FBQSxFQUFBLENBQUEsSUFBQSxJQUFBLENBQUEsQ0FBQSxJQUFBLEdBQUEsQ0FBQSxDQUFBLFVBQUEsSUFBQTtBQUFBLFNBQUEsc0JBQUEsQ0FBQSxFQUFBLENBQUEsUUFBQSxDQUFBLFdBQUEsQ0FBQSxnQ0FBQSxNQUFBLElBQUEsQ0FBQSxDQUFBLE1BQUEsQ0FBQSxRQUFBLEtBQUEsQ0FBQSw0QkFBQSxDQUFBLFFBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsT0FBQSxDQUFBLE9BQUEsQ0FBQSxpQkFBQSxDQUFBLElBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsQ0FBQSxHQUFBLElBQUEsUUFBQSxDQUFBLFFBQUEsTUFBQSxDQUFBLENBQUEsTUFBQSxDQUFBLFVBQUEsQ0FBQSx1QkFBQSxDQUFBLElBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsQ0FBQSxHQUFBLElBQUEsTUFBQSxDQUFBLENBQUEsSUFBQSxDQUFBLENBQUEsQ0FBQSxLQUFBLEdBQUEsQ0FBQSxDQUFBLE1BQUEsS0FBQSxDQUFBLEdBQUEsQ0FBQSxpQkFBQSxDQUFBLElBQUEsQ0FBQSxPQUFBLENBQUEsR0FBQSxDQUFBLHlCQUFBLENBQUEsWUFBQSxDQUFBLGVBQUEsQ0FBQSxHQUFBLENBQUEsY0FBQSxNQUFBLENBQUEsQ0FBQSxNQUFBLENBQUEsMkJBQUEsQ0FBQSxRQUFBLENBQUEsYUFBQSxDQUFBO0FBQUEsU0FBQSxnQkFBQSxHQUFBLFFBQUEsS0FBQSxDQUFBLE9BQUEsQ0FBQSxHQUFBLFVBQUEsR0FBQTtBQUFBLFNBQUEsUUFBQSxDQUFBLHNDQUFBLE9BQUEsd0JBQUEsTUFBQSx1QkFBQSxNQUFBLENBQUEsUUFBQSxhQUFBLENBQUEsa0JBQUEsQ0FBQSxnQkFBQSxDQUFBLFdBQUEsQ0FBQSx5QkFBQSxNQUFBLElBQUEsQ0FBQSxDQUFBLFdBQUEsS0FBQSxNQUFBLElBQUEsQ0FBQSxLQUFBLE1BQUEsQ0FBQSxTQUFBLHFCQUFBLENBQUEsS0FBQSxPQUFBLENBQUEsQ0FBQTtBQUFBLFNBQUEsa0JBQUEsTUFBQSxFQUFBLEtBQUEsYUFBQSxDQUFBLE1BQUEsQ0FBQSxHQUFBLEtBQUEsQ0FBQSxNQUFBLEVBQUEsQ0FBQSxVQUFBLFVBQUEsR0FBQSxLQUFBLENBQUEsQ0FBQSxHQUFBLFVBQUEsQ0FBQSxVQUFBLEdBQUEsVUFBQSxDQUFBLFVBQUEsV0FBQSxVQUFBLENBQUEsWUFBQSx3QkFBQSxVQUFBLEVBQUEsVUFBQSxDQUFBLFFBQUEsU0FBQSxNQUFBLENBQUEsY0FBQSxDQUFBLE1BQUEsRUFBQSxjQUFBLENBQUEsVUFBQSxDQUFBLEdBQUEsR0FBQSxVQUFBO0FBQUEsU0FBQSxhQUFBLFdBQUEsRUFBQSxVQUFBLEVBQUEsV0FBQSxRQUFBLFVBQUEsRUFBQSxpQkFBQSxDQUFBLFdBQUEsQ0FBQSxTQUFBLEVBQUEsVUFBQSxPQUFBLFdBQUEsRUFBQSxpQkFBQSxDQUFBLFdBQUEsRUFBQSxXQUFBLEdBQUEsTUFBQSxDQUFBLGNBQUEsQ0FBQSxXQUFBLGlCQUFBLFFBQUEsbUJBQUEsV0FBQTtBQUFBLFNBQUEsZUFBQSxHQUFBLFFBQUEsR0FBQSxHQUFBLFlBQUEsQ0FBQSxHQUFBLG9CQUFBLE9BQUEsQ0FBQSxHQUFBLGlCQUFBLEdBQUEsR0FBQSxNQUFBLENBQUEsR0FBQTtBQUFBLFNBQUEsYUFBQSxLQUFBLEVBQUEsSUFBQSxRQUFBLE9BQUEsQ0FBQSxLQUFBLGtCQUFBLEtBQUEsa0JBQUEsS0FBQSxNQUFBLElBQUEsR0FBQSxLQUFBLENBQUEsTUFBQSxDQUFBLFdBQUEsT0FBQSxJQUFBLEtBQUEsU0FBQSxR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QUo7QUFBSyxDQUFDOzs7Ozs7Ozs7QUNyQ2hDLElBQU0sT0FBTyxHQUFBLE9BQUEsQ0FBQSxPQUFBLEdBQUc7RUFDZCxVQUFVLEVBQUUsTUFBTTtFQUNsQixtQkFBbUIsRUFBRSxTQUFTO0VBQzlCLFlBQVksRUFBRSxNQUFNO0VBQ3BCLHNCQUFzQixFQUFFLE1BQU07RUFDOUIsUUFBUSxFQUFFLE1BQU07RUFDaEIsa0JBQWtCLEVBQUUsTUFBTTtFQUMxQixnQkFBZ0IsRUFBRTtBQUNwQixDQUFDO0FBRUQsSUFBTSxhQUFhLEdBQUEsT0FBQSxDQUFBLGFBQUEsR0FBRyxTQUFoQixhQUFhLENBQUksR0FBRyxFQUFLO0VBQzdCLEdBQUcsQ0FBQyxLQUFLLENBQUMsZUFBZSxHQUFHLE9BQU8sQ0FBQyxVQUFVO0FBQ2hELENBQUM7QUFFRCxJQUFNLGVBQWUsR0FBQSxPQUFBLENBQUEsZUFBQSxHQUFHLFNBQWxCLGVBQWUsQ0FBSSxHQUFHLEVBQUs7RUFDL0IsR0FBRyxDQUFDLEtBQUssQ0FBQyxlQUFlLEdBQUcsT0FBTyxDQUFDLGtCQUFrQjtBQUN4RCxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiJ3VzZSBzdHJpY3QnO1xuLy8gRm9yIG1vcmUgaW5mb3JtYXRpb24gYWJvdXQgYnJvd3NlciBmaWVsZCwgY2hlY2sgb3V0IHRoZSBicm93c2VyIGZpZWxkIGF0IGh0dHBzOi8vZ2l0aHViLmNvbS9zdWJzdGFjay9icm93c2VyaWZ5LWhhbmRib29rI2Jyb3dzZXItZmllbGQuXG5cbnZhciBzdHlsZUVsZW1lbnRzSW5zZXJ0ZWRBdFRvcCA9IFtdO1xuXG52YXIgaW5zZXJ0U3R5bGVFbGVtZW50ID0gZnVuY3Rpb24oc3R5bGVFbGVtZW50LCBvcHRpb25zKSB7XG4gICAgdmFyIGhlYWQgPSBkb2N1bWVudC5oZWFkIHx8IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF07XG4gICAgdmFyIGxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wID0gc3R5bGVFbGVtZW50c0luc2VydGVkQXRUb3Bbc3R5bGVFbGVtZW50c0luc2VydGVkQXRUb3AubGVuZ3RoIC0gMV07XG5cbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICBvcHRpb25zLmluc2VydEF0ID0gb3B0aW9ucy5pbnNlcnRBdCB8fCAnYm90dG9tJztcblxuICAgIGlmIChvcHRpb25zLmluc2VydEF0ID09PSAndG9wJykge1xuICAgICAgICBpZiAoIWxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wKSB7XG4gICAgICAgICAgICBoZWFkLmluc2VydEJlZm9yZShzdHlsZUVsZW1lbnQsIGhlYWQuZmlyc3RDaGlsZCk7XG4gICAgICAgIH0gZWxzZSBpZiAobGFzdFN0eWxlRWxlbWVudEluc2VydGVkQXRUb3AubmV4dFNpYmxpbmcpIHtcbiAgICAgICAgICAgIGhlYWQuaW5zZXJ0QmVmb3JlKHN0eWxlRWxlbWVudCwgbGFzdFN0eWxlRWxlbWVudEluc2VydGVkQXRUb3AubmV4dFNpYmxpbmcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaGVhZC5hcHBlbmRDaGlsZChzdHlsZUVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgICAgIHN0eWxlRWxlbWVudHNJbnNlcnRlZEF0VG9wLnB1c2goc3R5bGVFbGVtZW50KTtcbiAgICB9IGVsc2UgaWYgKG9wdGlvbnMuaW5zZXJ0QXQgPT09ICdib3R0b20nKSB7XG4gICAgICAgIGhlYWQuYXBwZW5kQ2hpbGQoc3R5bGVFbGVtZW50KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgdmFsdWUgZm9yIHBhcmFtZXRlciBcXCdpbnNlcnRBdFxcJy4gTXVzdCBiZSBcXCd0b3BcXCcgb3IgXFwnYm90dG9tXFwnLicpO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIC8vIENyZWF0ZSBhIDxsaW5rPiB0YWcgd2l0aCBvcHRpb25hbCBkYXRhIGF0dHJpYnV0ZXNcbiAgICBjcmVhdGVMaW5rOiBmdW5jdGlvbihocmVmLCBhdHRyaWJ1dGVzKSB7XG4gICAgICAgIHZhciBoZWFkID0gZG9jdW1lbnQuaGVhZCB8fCBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdO1xuICAgICAgICB2YXIgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpbmsnKTtcblxuICAgICAgICBsaW5rLmhyZWYgPSBocmVmO1xuICAgICAgICBsaW5rLnJlbCA9ICdzdHlsZXNoZWV0JztcblxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gYXR0cmlidXRlcykge1xuICAgICAgICAgICAgaWYgKCAhIGF0dHJpYnV0ZXMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHZhbHVlID0gYXR0cmlidXRlc1trZXldO1xuICAgICAgICAgICAgbGluay5zZXRBdHRyaWJ1dGUoJ2RhdGEtJyArIGtleSwgdmFsdWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaGVhZC5hcHBlbmRDaGlsZChsaW5rKTtcbiAgICB9LFxuICAgIC8vIENyZWF0ZSBhIDxzdHlsZT4gdGFnIHdpdGggb3B0aW9uYWwgZGF0YSBhdHRyaWJ1dGVzXG4gICAgY3JlYXRlU3R5bGU6IGZ1bmN0aW9uKGNzc1RleHQsIGF0dHJpYnV0ZXMsIGV4dHJhT3B0aW9ucykge1xuICAgICAgICBleHRyYU9wdGlvbnMgPSBleHRyYU9wdGlvbnMgfHwge307XG5cbiAgICAgICAgdmFyIHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgICAgICAgc3R5bGUudHlwZSA9ICd0ZXh0L2Nzcyc7XG5cbiAgICAgICAgZm9yICh2YXIga2V5IGluIGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICAgIGlmICggISBhdHRyaWJ1dGVzLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IGF0dHJpYnV0ZXNba2V5XTtcbiAgICAgICAgICAgIHN0eWxlLnNldEF0dHJpYnV0ZSgnZGF0YS0nICsga2V5LCB2YWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc3R5bGUuc2hlZXQpIHsgLy8gZm9yIGpzZG9tIGFuZCBJRTkrXG4gICAgICAgICAgICBzdHlsZS5pbm5lckhUTUwgPSBjc3NUZXh0O1xuICAgICAgICAgICAgc3R5bGUuc2hlZXQuY3NzVGV4dCA9IGNzc1RleHQ7XG4gICAgICAgICAgICBpbnNlcnRTdHlsZUVsZW1lbnQoc3R5bGUsIHsgaW5zZXJ0QXQ6IGV4dHJhT3B0aW9ucy5pbnNlcnRBdCB9KTtcbiAgICAgICAgfSBlbHNlIGlmIChzdHlsZS5zdHlsZVNoZWV0KSB7IC8vIGZvciBJRTggYW5kIGJlbG93XG4gICAgICAgICAgICBpbnNlcnRTdHlsZUVsZW1lbnQoc3R5bGUsIHsgaW5zZXJ0QXQ6IGV4dHJhT3B0aW9ucy5pbnNlcnRBdCB9KTtcbiAgICAgICAgICAgIHN0eWxlLnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzc1RleHQ7XG4gICAgICAgIH0gZWxzZSB7IC8vIGZvciBDaHJvbWUsIEZpcmVmb3gsIGFuZCBTYWZhcmlcbiAgICAgICAgICAgIHN0eWxlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzc1RleHQpKTtcbiAgICAgICAgICAgIGluc2VydFN0eWxlRWxlbWVudChzdHlsZSwgeyBpbnNlcnRBdDogZXh0cmFPcHRpb25zLmluc2VydEF0IH0pO1xuICAgICAgICB9XG4gICAgfVxufTtcbiIsImltcG9ydCB7IHNlbGVjdGVkU3R5bGUsIHVuc2VsZWN0ZWRTdHlsZSB9IGZyb20gJy4vc3R5bGVzLmpzJztcbmltcG9ydCB7IGNvbmZpZywgY2FsZW5kYXIsIGxhc3REYXRlQ2xpY2tlZCB9IGZyb20gJy4vY2FsZW5kYXJHZW5lcmF0b3IuanMnO1xuaW1wb3J0IHsgZGlzcGxheVRpbWVDaG9vc2VyTW9kYWwsIGdldFNlbGVjdGVkVGltZXMgfSBmcm9tICcuL2Rpc3BsYXlUaW1lQ2hvb3Nlck1vZGFsLmpzJztcblxuXG5cdC8vIHV0aWxpdHkgdG8gcmV0dXJuIGRhdGUgaW4gY29ycmVjdCBmb3JtYXRcblx0ZnVuY3Rpb24gZm9ybWF0RGF0ZSAoZCkge1xuXHRcdGNvbnN0IGRhdGUgPSAoZCkgPyBuZXcgRGF0ZShkKSA6IG5ldyBEYXRlKCk7XG5cdFx0Y29uc3QgZGF5ID0gZGF0ZS5nZXREYXRlKCk7XG5cdFx0Y29uc3QgbW9udGggPSAoZGF0ZS5nZXRNb250aCgpICsgMSk7XG5cdFx0Y29uc3QgeWVhciA9IGRhdGUuZ2V0RnVsbFllYXIoKTtcblx0XHRjb25zdCBmb3JtYXRlZCA9IGAke3llYXJ9LSR7bW9udGh9LSR7ZGF5fWA7XG5cdFx0cmV0dXJuIGZvcm1hdGVkO1xuXHR9O1xuXG5cbi8qKlxuICogQ2FsY3VsYXRlcyB0aGUgdGltZSB2YWx1ZSBpbiBtaWxsaXNlY29uZHMgYmFzZWQgb24gdGhlIGdpdmVuIHRpbWUuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHRpbWUgLSBUaGUgdGltZSBpbiB0aGUgZm9ybWF0IFwiSEg6TU1cIi5cbiAqIEByZXR1cm4ge251bWJlcn0gVGhlIHRpbWUgdmFsdWUgaW4gbWlsbGlzZWNvbmRzLlxuICpcbiAqIEBoYXNUZXN0c1xuICpcbiAqIEBleGFtcGxlXG4gKiAvLyBFeGFtcGxlIHVzYWdlOlxuICogY29uc3QgdGltZVZhbHVlID0gdGltZVZhbHVlSW5NaWxsKCcxMjozMCcpO1xuICovXG5cbmZ1bmN0aW9uIHRpbWVWYWx1ZUluTWlsbCAodGltZSkge1xuICBpZiAoIXRpbWUuaW5jbHVkZXMoJzonKSkge1xuICAgIGNvbnN0IGUgPSBuZXcgRXJyb3IoJ0V4cGVjdHMgYSB0aW1lIHN0cmluZyBISDpNTScpO1xuICAgIHRocm93IGU7XG4gIH1cbiAgY29uc3QgW2hvdXJzLCBtaW51dGVzXSA9IHRpbWUuc3BsaXQoJzonKTtcbiAgcmV0dXJuIChwYXJzZUludChob3VycykgKiA2MCAqIDYwICogMTAwMCkgKyAocGFyc2VJbnQobWludXRlcykgKiA2MCAqIDEwMDApO1xufVxuXG4vKipcbiAqIHZhciBnZXREYXlzSW5Nb250aCAtIEdldCBudW1iZXIgb2YgZGF5cyBpbiBtb250aFxuICpcbiAqIEBwYXJhbSAgeyFudW1iZXJ9IG1vbnRoIFRoZSBudW1iZXIgb2YgdGhlIGNvcnJlc3BvbmRpbmcgbW9udGguXG4gKiBAcGFyYW0gIHshbnVtYmVyfSB5ZWFyICBUaGUgY29ycmVzcG9uZGluZyB5ZWFyLlxuICogQHJldHVybiB7bnVtYmVyfSBSZXR1cm5zIGEgbnVtYmVyIGNvcnJlc3BvbmRpbmcgdG8gdGhlIG51bWJlciBvZiBkYXlzIGZvciB0aGUgZGF0ZSBpbiBwb2ludC5cbiAqL1xuZnVuY3Rpb24gZ2V0RGF5c0luTW9udGggKG1vbnRoLCB5ZWFyKSB7XG4gIHJldHVybiBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMCkuZ2V0RGF0ZSgpO1xufVxuXG4vKipcbiAqIENoZWNrcyBmb3Igb3ZlcmxhcCBpbiBhbiBhcnJheSBvZiB2YWx1ZXMuXG4gKlxuICogQHBhcmFtIHtBcnJheX0gdmFsdWVzIC0gVGhlIGFycmF5IG9mIHZhbHVlcyB0byBjaGVjayBmb3Igb3ZlcmxhcC5cbiAqIEByZXR1cm4ge2Jvb2xlYW59IC0gUmV0dXJucyB0cnVlIGlmIG92ZXJsYXAgaXMgZm91bmQsIGZhbHNlIG90aGVyd2lzZS5cbiAqL1xuZnVuY3Rpb24gY2hlY2tPdmVybGFwICh2YWx1ZXMpIHtcbiAgY29uc3QgbnVtZXJpY2FsRXF1aXZhbGVudCA9IHZhbHVlcy5tYXAodGltZVZhbHVlSW5NaWxsKTtcblxuICBmb3IgKGxldCBjdXJyZW50SW5kZXggPSAyOyBjdXJyZW50SW5kZXggPCBudW1lcmljYWxFcXVpdmFsZW50Lmxlbmd0aDsgY3VycmVudEluZGV4ICs9IDIpIHtcbiAgICBjb25zdCBjdXJyZW50U3RhcnQgPSBudW1lcmljYWxFcXVpdmFsZW50W2N1cnJlbnRJbmRleF07XG4gICAgY29uc3QgY3VycmVudEVuZCA9IG51bWVyaWNhbEVxdWl2YWxlbnRbY3VycmVudEluZGV4ICsgMV07XG5cbiAgICBmb3IgKGxldCBjb21wYXJpc29uSW5kZXggPSAwOyBjb21wYXJpc29uSW5kZXggPCBudW1lcmljYWxFcXVpdmFsZW50Lmxlbmd0aDsgY29tcGFyaXNvbkluZGV4ICs9IDIpIHtcbiAgICAgIGlmIChjdXJyZW50SW5kZXggIT09IGNvbXBhcmlzb25JbmRleCkge1xuICAgICAgICBjb25zdCBjb21wYXJpc29uU3RhcnQgPSBudW1lcmljYWxFcXVpdmFsZW50W2NvbXBhcmlzb25JbmRleF07XG4gICAgICAgIGNvbnN0IGNvbXBhcmlzb25FbmQgPSBudW1lcmljYWxFcXVpdmFsZW50W2NvbXBhcmlzb25JbmRleCArIDFdO1xuXG4gICAgICAgIGlmIChjb21wYXJpc29uRW5kID49IGN1cnJlbnRTdGFydCAmJiBjb21wYXJpc29uRW5kIDw9IGN1cnJlbnRFbmQpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIGlmIChjdXJyZW50U3RhcnQgPj0gY29tcGFyaXNvblN0YXJ0ICYmIGN1cnJlbnRFbmQgPD0gY29tcGFyaXNvbkVuZCkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGVsc2UgaWYgKGN1cnJlbnRTdGFydCA9PT0gY29tcGFyaXNvblN0YXJ0ICYmIGN1cnJlbnRFbmQgPT09IGNvbXBhcmlzb25FbmQpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIGlmIChjdXJyZW50RW5kID49IGNvbXBhcmlzb25TdGFydCAmJiBjdXJyZW50RW5kIDw9IGNvbXBhcmlzb25FbmQpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIENsZWFycyB0aGUgc2VsZWN0aW9uIG9mIGRhdGVzIGluIHRoZSBjYWxlbmRhci5cbiAqXG4gKiBAcGFyYW0ge3VuZGVmaW5lZH1cbiAqIEByZXR1cm4ge3VuZGVmaW5lZH1cbiAqL1xuZnVuY3Rpb24gY2xlYXJTZWxlY3Rpb24gKGNhbGVuZGFyLCBkeW5hbWljRGF0YSkge1xuICBjb25zdCBkYXRlc09ialN0b3JlID0gZHluYW1pY0RhdGEuZGF0ZXNTZWxlY3RlZEFycmF5T2JqZWN0cztcbiAgY29uc3QgZGF0ZXNJbmRleCA9IGR5bmFtaWNEYXRhLmRhdGVzU2VsZWN0ZWRBcnJheTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGVzT2JqU3RvcmUubGVuZ3RoOyBpKyspIHtcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IGRhdGVzSW5kZXgubGVuZ3RoOyBqKyspIHtcbiAgICAgIGRhdGVzSW5kZXhbal0uZm9yRWFjaCgoZGF0ZSkgPT4ge1xuICAgICAgICBjb25zdCBkYXRlRGl2ID0gY2FsZW5kYXIucXVlcnlTZWxlY3RvcihgW2RhdGEtaHVtYW5kYXRlPScke2RhdGV9J11gKTtcbiAgICAgICAgdW5zZWxlY3RlZFN0eWxlKGRhdGVEaXYpO1xuICAgICAgICB3aGlsZSAoZGF0ZURpdi5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgZGF0ZURpdi5yZW1vdmVDaGlsZChkYXRlRGl2Lmxhc3RDaGlsZCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGkgPT09IGRhdGVzT2JqU3RvcmUubGVuZ3RoIC0gMSAmJiBqID09PSBkYXRlc0luZGV4Lmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICBkYXRlc09ialN0b3JlLmxlbmd0aCA9IDA7XG4gICAgICAgICAgZGF0ZXNJbmRleC5sZW5ndGggPSAwO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn1cblxuLypcblxuKi9cblxuLyoqXG4gKiBAcGFyYW0ge251bWJlcn0gW2xlbmd0aD0xMF0gLWxlbmd0aCB0aGUgZGVzaXJlZCBsZW5ndGggb2YgdGhlIHN0cmluZyBvZiBudW1iZXJzLlxuICogQHJldHVybnMgYSBzdHJpbmcgb2YgcmFuZG9tIGRpZ2l0cyBvZiBhIHNwZWNpZmllZCBsZW5ndGguXG4gKi9cblxuZnVuY3Rpb24gcmFuZG9tQnl0ZXMgKGxlbmd0aCkge1xuICBpZiAobGVuZ3RoID4gODApIHtcbiAgICBjb25zdCBlID0gbmV3IEVycm9yKCdyYW5kb21CeXRlcyBsZW5ndGggY2FuIGJlIG1vcmUgdGhhbiA4MDAgZGlnaXRzJyk7XG4gICAgdGhyb3cgZTtcbiAgfVxuICBjb25zdCBhcnJheSA9IG5ldyBVaW50MzJBcnJheSgxMDApO1xuICB3aW5kb3cuY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhhcnJheSk7XG4gIGxldCBzdCA9ICcnO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgc3QgKz0gYXJyYXlbaV07XG4gICAgaWYgKGkgPT09IGFycmF5Lmxlbmd0aCAtIDEpIHtcbiAgICAgIHJldHVybiBzdC5zbGljZShzdC5sZW5ndGggLSAobGVuZ3RoIHx8IDEwKSk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGdlbmVyYXRlUmFuZG9tU3RyaW5nKCkge1xuICBjb25zdCByYW5kb21TdHJpbmcgPSByYW5kb21CeXRlcygxMCk7XG4gIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjY2FsZW5kYXItJyArIHJhbmRvbVN0cmluZykpIHtcbiAgICByZXR1cm4gZ2VuZXJhdGVSYW5kb21TdHJpbmcoKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gcmFuZG9tU3RyaW5nO1xuICB9XG59XG5cbi8vV0UgV0VSRSBTRVRUSU5HIFVQIFRIRSBDQUxFTkRBUiBUTyBSRU5ERVIgREFURVMgSU4gVEhFIFBBU1Q6XG4vKiBXYXJuaW5nOiBDb250ZW1wbGF0ZXMgZGF5bGlnaHQgc2F2aW5nIHRpbWUqL1xuXG5mdW5jdGlvbiBnZXRFYXJsaWVzdERhdGUgKHByZWxvYWRlZERhdGVzKSB7XG4gIGNvbnN0IG9yZGVyID0gW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcHJlbG9hZGVkRGF0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoaSA9PT0gMCkge1xuICAgICAgb3JkZXIucHVzaChuZXcgRGF0ZSgpLmdldFRpbWUoKSk7XG4gICAgfVxuICAgIG9yZGVyLnB1c2gobmV3IERhdGUocHJlbG9hZGVkRGF0ZXNbaV0pLmdldFRpbWUoKSk7XG4gICAgaWYgKGkgPT09IHByZWxvYWRlZERhdGVzLmxlbmd0aCAtIDEpIHtcbiAgICAgIG9yZGVyLnNvcnQoKTtcbiAgICAgIGNvbnN0IGQgPSBuZXcgRGF0ZShvcmRlclswXSk7XG4gICAgICByZXR1cm4gZDtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBDb252ZXJ0cyBhbiBhcnJheSBvZiBkYXRlcyBpbnRvIGEgbmV3IGFycmF5IG9mIG9iamVjdHMgd2l0aCBmb3JtYXR0ZWQgZGF0ZXMuXG4gKlxuICogQHBhcmFtIHtBcnJheX0gZGF0ZXMgLSBUaGUgYXJyYXkgb2YgZGF0ZXMuXG4gKiBAcmV0dXJuIHtQcm9taXNlfSBBIHByb21pc2UgdGhhdCByZXNvbHZlcyB0byB0aGUgbmV3IGFycmF5IG9mIG9iamVjdHMuXG4gKi9cbmZ1bmN0aW9uIGNvbnZlcnREYXRlcyAoZGF0ZXMpIHtcbiAgY29uc3QgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoZGF0ZXNbaV0uZGF5KSB7XG4gICAgICAgIGR5bmFtaWNEYXRhLmRhdGVzU2VsZWN0ZWRBcnJheU9iamVjdHMucHVzaChkYXRlc1tpXSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgLy8gZHluYW1pY0RhdGEuZGF0ZXNTZWxlY3RlZEFycmF5T2JqZWN0cy5wdXNoKHsgZGF5OiBzdGFuZGFyZERhdGVPYmplY3QoZGF0ZXNbaV0pIH0pO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBwcm9taXNlO1xufVxuXG5cbi8qKlxuICogQXN5bmNocm9ub3VzbHkgcHJlbG9hZHMgZGF0ZXMgZm9yIHRoZSBjYWxlbmRhci5cbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gY2FsZW5kYXIgLSB0aGUgY2FsZW5kYXIgb2JqZWN0XG4gKiBAcGFyYW0ge2FycmF5fSBkYXRlcyAtIGFuIGFycmF5IG9mIGRhdGVzIHRvIHByZWxvYWRcbiAqIEByZXR1cm4ge3ZvaWR9IFxuICovXG5hc3luYyBmdW5jdGlvbiBwcmVsb2FkRGF0ZXMgKGNhbGVuZGFyLCBkYXRlcykge1xuICBjb25zb2xlLmxvZygnUFJFTE9BRElORyBEQVRFUy4uLicpO1xuICAvLyBjb25zb2xlLmxvZyhjYWxlbmRhcik7XG4gIC8vIGNvbnNvbGUubG9nKGRhdGVzKTtcbiAgZGF0ZXMgPSBbJzIwMjMtMTAtMTAnXVxuICBsZXQgZW5kVXNlciA9IDE7XG4gIC8vYXR0YWNoKGRhdGVOb2RlKTtcbiAgYXdhaXQgY29udmVydERhdGVzKGRhdGVzKTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGVzU2VsZWN0ZWRBcnJheU9iamVjdHMubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBkYXRlT2JqZWN0ID0gZGF0ZXNTZWxlY3RlZEFycmF5T2JqZWN0c1tpXTtcbiAgICBjb25zdCBkYXRlTm9kZSA9IGNhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoYCMke2RhdGVPYmplY3QuZGF5fWApO1xuXG4gICAgaWYgKGRhdGVOb2RlKSB7XG4gICAgICBkYXRlc1NlbGVjdGVkQXJyYXkucHVzaChkYXRlc1tpXS5kYXkpO1xuICAgICAgZGF0ZU5vZGUuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJyNmYzMnO1xuICAgICAgZGF0ZU5vZGUuY2xhc3NMaXN0LmFkZCgnYXZhaWxhYmxlJyk7XG4gICAgfVxuXG4gICAgaWYgKGVuZFVzZXIpIHtcbiAgICAgIGF0dGFjaChkYXRlTm9kZSk7XG4gICAgICAvL3RpbWVDaG9vc2VyKCk7XG4gICAgfVxuXG4gICAgaWYgKGRpc3BsYXlUaW1lQ2hvb3Nlck1vZGFsKSB7XG4gICAgICAvLyBjcmVhdGVUaW1lRWxlbWVudHMgKCk7XG4gICAgICAvL2dlbmVyYXRlVGltZXNPbmx5KGRhdGVPYmplY3QudGltZXMsIGRhdGVOb2RlKTtcbiAgICB9XG5cbiAgICBpZiAoc2VsZWN0UmFuZ2UgJiYgZGF0ZU5vZGUgJiYgIWRhdGVOb2RlLmNsYXNzTGlzdC5jb250YWlucygnZmlsbGVyJykpIHtcbiAgICAgIGRhdGVOb2RlLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICcjMzMzJztcbiAgICAgIGRhdGVOb2RlLmNsYXNzTGlzdC5hZGQoJ2Jsb2NrZWQnKTtcbiAgICAgIGRhdGVOb2RlLnRpdGxlID0gJ05vIGF2YWlsYWJpbGl0eSBvbiB0aGlzIGRheSc7XG5cbiAgICAgIGNvbnN0IHNvbGRPdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgICBzb2xkT3V0LmNsYXNzTGlzdC5hZGQoJ2NhbGVuZGFyVGltZScpO1xuICAgICAgc29sZE91dC50ZXh0Q29udGVudCA9ICdTb2xkIG91dCc7XG4gICAgICBkYXRlTm9kZS5hcHBlbmRDaGlsZChzb2xkT3V0KTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gYmxvY2tEYXlzTm90T3BlbiAoY2FsZW5kYXIsIGRhdGVzT3Blbikge1xuICBpZiAoY2FsZW5kYXIgJiYgZGF0ZXNPcGVuKSB7XG4gICAgY29uc3QgYWxsRGF5cyA9IEFycmF5LmZyb20oY2FsZW5kYXIucXVlcnlTZWxlY3RvckFsbCgnLmRheVRpbWUnKSkubWFwKChlbCkgPT4geyByZXR1cm4gZWwuZGF0YXNldC5odW1hbmRhdGU7IH0pO1xuICAgIGNvbnN0IG9wZW5EYXlzID0gZGF0ZXNPcGVuLm1hcCgoZWwpID0+IHsgcmV0dXJuIGVsLmRheTsgfSk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFsbERheXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChvcGVuRGF5cy5pbmRleE9mKGFsbERheXNbaV0pID09PSAtMSkge1xuICAgICAgICBjb25zdCBkYXkgPSBjYWxlbmRhci5xdWVyeVNlbGVjdG9yKGBbaWQ9XCIke2FsbERheXNbaV19XCJdYCk7XG4gICAgICAgIGRheS5jbGFzc0xpc3QuYWRkKCd3aWR0aFNoYXBlJywgJ2ZpbGxlcicpO1xuICAgICAgICBkYXkuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJ3doaXRlJztcbiAgICAgICAgZGF5LnRpdGxlID0gJ0Nsb3NlZCBvbiB0aGlzIGRheSc7XG5cbiAgICAgICAgY29uc3QgY2xvc2VkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgICAgICBjbG9zZWQuY2xhc3NMaXN0LmFkZCgnY2FsZW5kYXJUaW1lJyk7XG4gICAgICAgIGNsb3NlZC50ZXh0Q29udGVudCA9ICdjbG9zZWQnO1xuXG4gICAgICAgIGRheS5hcHBlbmRDaGlsZChjbG9zZWQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFJlbGVhc2UgYm9va2VkIGRheVxuICogQGRlc2NyaXB0aW9uIFJlbW92ZXMgYSBkYXkgdGhhdCBoYXMgYmVlbiBwcmV2aW91c2x5IGJvb2tlZC5cbiAqIEBmdW5jdGlvbiByZWxlYXNlQm9va2VkRGF5XG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBkYXkgLSBIVE1MIGRpdiBlbGVtZW50IHJlcHJlc2VudGluZyB0aGUgZGF5LlxuICogQHBhcmFtIHtzdHJpbmd9IGRhdGUgLSBEYXRlIHN0cmluZyBpbiB0aGUgZm9ybWF0ICdZWVlZLU1NLUREJy5cbiAqL1xuZnVuY3Rpb24gcmVsZWFzZUJvb2tlZERheSAoZGF5LCBkYXRlKSB7XG4gIGNvbnN0IGluZGV4ID0gZGF0ZXNTZWxlY3RlZEFycmF5LmluZGV4T2YoZGF0ZSk7XG4gIHVuc2VsZWN0ZWRTdHlsZShkYXkpO1xuICBkYXRlc1NlbGVjdGVkQXJyYXkuc3BsaWNlKGluZGV4LCAxKTtcbiAgZGF0ZXNTZWxlY3RlZEFycmF5T2JqZWN0cy5zcGxpY2UoaW5kZXgsIDEpO1xuXG4gIHdoaWxlIChkYXkuZmlyc3RDaGlsZCkge1xuICAgIGRheS5maXJzdENoaWxkLnJlbW92ZSgpO1xuICB9XG59XG5cbi8qKlxuICogQWRkcyAxIHRvIHRoZSBtb250aCBpbiBhIGdpdmVuIGRhdGUgdG8gbWFrZSBpdCBtb3JlIGh1bWFuLXJlYWRhYmxlLlxuICogQHBhcmFtIHtzdHJpbmd9IGRhdGUgLSBUaGUgZGF0ZSBpbiB0aGUgZm9ybWF0ICdZWVlZLU1NLUREJyBvciAnWVlZWS1NLUQnLlxuICogQHJldHVybnMge3N0cmluZ30gLSBUaGUgbW9kaWZpZWQgZGF0ZSBpbiB0aGUgZm9ybWF0ICdZWVlZLU1NLUREJy5cbiAqIEB0aHJvd3Mge0Vycm9yfSAtIElmIHRoZSBkYXRlIHBhcmFtZXRlciBpcyBub3QgaW4gdGhlIGZvcm1hdCAnWVlZWS1NTS1ERCcgb3IgJ1lZWVktTS1EJy5cbiAqL1xuZnVuY3Rpb24gaHVtYW5EYXRlIChkYXRlKSB7XG4gIGNvbnN0IGRhdGVQYXJ0cyA9IGRhdGUuc3BsaXQoJy0nKTtcbiAgY29uc3QgbW9udGggPSBwYXJzZUludChkYXRlUGFydHNbMV0pICsgMTtcbiAgY29uc3QgZGF5ID0gcGFyc2VJbnQoZGF0ZVBhcnRzWzJdKTtcbiAgY29uc3QgbW9kaWZpZWRNb250aCA9IG1vbnRoIDwgMTAgPyBgMCR7bW9udGh9YCA6IG1vbnRoO1xuICBjb25zdCBtb2RpZmllZERheSA9IGRheSA8IDEwID8gYDAke2RheX1gIDogZGF5O1xuICBjb25zdCBtb2RpZmllZERhdGUgPSBgJHtkYXRlUGFydHNbMF19LSR7bW9kaWZpZWRNb250aH0tJHttb2RpZmllZERheX1gO1xuICByZXR1cm4gbW9kaWZpZWREYXRlO1xufVxuXG5cbmZ1bmN0aW9uIHNvcnRUaW1lcyAodmFsKSB7XG4gIHZhciBzb3J0ZWQgPSBbXTtcbiAgcmV0dXJuIGVudW1lcmF0ZSh2YWwpO1xuXG4gIGZ1bmN0aW9uIHNvcnROdW1iZXIoYSwgYikge1xuICAgIHJldHVybiBhIC0gYjtcbiAgfVxuXG4gIGZ1bmN0aW9uIGVudW1lcmF0ZSh2YWx1ZXMpIHtcbiAgICB2YXIgbnVtZXJpY2FsRXF1aXZhbGVudCA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmFsdWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBudW1lcmljYWxFcXVpdmFsZW50LnB1c2godGltZVZhbHVlSW5NaWxsKHZhbHVlc1tpXSkpO1xuICAgICAgaWYgKGkgPT09IHZhbHVlcy5sZW5ndGggLSAxKSB7XG4gICAgICAgIHJldHVybiBzb3J0KHZhbHVlcywgbnVtZXJpY2FsRXF1aXZhbGVudCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gc29ydCh2YWx1ZXMsIG51bWVyaWNhbEVxdWl2YWxlbnQpIHtcbiAgICB2YXIgbnVtZXJpY2FsRXF1aXZhbGVudENsb25lID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShudW1lcmljYWxFcXVpdmFsZW50KSk7XG4gICAgdmFyIHNvcnRlZEludCA9IG51bWVyaWNhbEVxdWl2YWxlbnQuc29ydChzb3J0TnVtYmVyKTtcbiAgICBmb3IgKHZhciBwID0gMDsgcCA8IG51bWVyaWNhbEVxdWl2YWxlbnRDbG9uZS5sZW5ndGg7IHArKykge1xuICAgICAgdmFyIG5ld0luZGV4ID0gc29ydGVkSW50LmluZGV4T2YobnVtZXJpY2FsRXF1aXZhbGVudENsb25lW3BdKTtcbiAgICAgIHNvcnRlZC5zcGxpY2UocCwgMSwgdmFsdWVzW25ld0luZGV4XSk7XG4gICAgICBpZiAocCA9PT0gbnVtZXJpY2FsRXF1aXZhbGVudC5sZW5ndGggLSAxKSB7XG4gICAgICAgIHJldHVybiBzb3J0ZWQ7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogUmVsZWFzZSBkYXkgb2Ygd2Vla1xuICogQGZ1bmN0aW9uIHJlbGVhc2VEYXlPZldlZWtHXG4gKiBAcGFyYW0gZGF5SUQgaWQgb2YgdGhlIGRheSB0byBiZSByZWxlYXNlZC4gTi5iLiBkYXkgb2Ygd2VlayBpcyBzdG9yZWQgYXMgYSBkYXRhIGF0dHJpYnV0ZVxuICogQHRvZG8gbWFrZSBpdCB1c2UgbGFzdERhdGVDbGlja2VkICh3aGljaCBpcyB0aGUgZGF5IGluIGNvbnRleHQpXG4gKi9cbmZ1bmN0aW9uIHJlbGVhc2VEYXlPZldlZWtHKGRheUlkKSB7XG4gIGNvbnN0IHdlZWtkYXkgPSBsYXN0RGF0ZUNsaWNrZWQuZGF0YXNldC5kYXlvZndlZWs7XG4gIGNvbnN0IGJsb2NrVGhlc2VEYXlzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIltkYXRhLWRheW9md2Vlaz0nXCIgKyB3ZWVrZGF5ICsgXCInXVwiKTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBibG9ja1RoZXNlRGF5cy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBibG9ja0RheSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGJsb2NrVGhlc2VEYXlzW2ldLmlkKTtcbiAgICBpZiAoYmxvY2tEYXkgIT09IGxhc3REYXRlQ2xpY2tlZCkge1xuICAgICAgcmVsZWFzZUJvb2tlZERheShibG9ja0RheSwgYmxvY2tUaGVzZURheXNbaV0uaWQpO1xuICAgICAgcmVtb3ZlVGltZURpc3BsYXkoYmxvY2tUaGVzZURheXNbaV0uaWQpO1xuICAgIH1cbiAgICBpZiAoYmxvY2tEYXkgPT09IGxhc3REYXRlQ2xpY2tlZCkge1xuICAgICAgLy8gcmVtb3ZlIG9ubHkgdGhlIGRpc3BsYXk6XG4gICAgICAvL3JlbW92ZVRpbWVEaXNwbGF5KGJsb2NrVGhlc2VEYXlzW2ldLmlkKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IHsgdGltZVZhbHVlSW5NaWxsLCBjaGVja092ZXJsYXAsIGNsZWFyU2VsZWN0aW9uLCBnZXREYXlzSW5Nb250aCwgZ2VuZXJhdGVSYW5kb21TdHJpbmcsIGdldEVhcmxpZXN0RGF0ZSxcbiAgcHJlbG9hZERhdGVzLCBibG9ja0RheXNOb3RPcGVuLCByZWxlYXNlQm9va2VkRGF5LCBodW1hbkRhdGUsIHNvcnRUaW1lcywgZm9ybWF0RGF0ZSB9O1xuXG4vL2Jvb2tEYXkgc2luZ2xlRGF0ZUNob2ljZVxuLy9yZWxlYXNlQm9va2VkRGF5IGRhdGVzU2VsZWN0ZWRBcnJheU9iamVjdHMgZGF0ZXNTZWxlY3RlZEFycmF5IiwidmFyIGNzcyA9IFwiLmNhbGVuZGFyIHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBmbGV4LXdyYXA6IHdyYXA7XFxuICBmbGV4LWRpcmVjdGlvbjogcm93O1xcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNDAsIDI0OCwgMjU1LCAwKTtcXG4gIHdpZHRoOiAxMDAlO1xcbiAgaGVpZ2h0OiAyOC44ZW07XFxuICBvdmVyZmxvdy15OiBhdXRvO1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgY29sb3I6ICMzMzM7XFxuICBmb250LWZhbWlseTogVWJ1bnR1LCBBcmlhbCwgSGVsdmV0aWNhLCBzYW5zLXNlcmlmO1xcbiAgZm9udC1zaXplOiAxLjJlbTtcXG4gIGZvbnQtd2VpZ2h0OiA3MDA7XFxuICBsaW5lLWhlaWdodDogMS41O1xcbn1cXG4uY2FsZW5kYXIgLmJsb2NrZWQge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogIzMzMztcXG59XFxuLmNhbGVuZGFyIC5maWxsZXIge1xcbiAgcG9pbnRlci1ldmVudHM6IG5vbmU7XFxuICBvcGFjaXR5OiAwLjM7XFxufVxcbi5jYWxlbmRhciAucHJlbG9hZGVkIHtcXG4gIGJvcmRlci1jb2xvcjogYmx1ZTtcXG4gIGJvcmRlci1zdHlsZTogc29saWQ7XFxuICBib3JkZXItd2lkdGg6IDNweDtcXG59XFxuLmNhbGVuZGFyIC50aW1lU2VsZWN0IHtcXG4gIHBhZGRpbmc6IDA7XFxuICB3aWR0aDogYXV0bztcXG4gIG1hcmdpbjogMDtcXG4gIGJhY2tncm91bmQtY29sb3I6ICNmZmY7XFxuICBmbG9hdDogcmlnaHQ7XFxuICBmb250LXdlaWdodDogNzAwO1xcbiAgZm9udC1mYW1pbHk6IEFyaWFsLCBIZWx2ZXRpY2EsIHNhbnMtc2VyaWY7XFxuICBib3JkZXItc3R5bGU6IHNvbGlkO1xcbiAgYm9yZGVyLXJhZGl1czogMWVtO1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gIGJvcmRlci13aWR0aDogM3B4O1xcbiAgYm9yZGVyLWNvbG9yOiAjZjE1OTI1O1xcbiAgY29sb3I6ICMwMDA7XFxuICBmb250LXNpemU6IDAuOWVtO1xcbn1cXG4uY2FsZW5kYXIgLnRpbWVDb250IHtcXG4gIG1hcmdpbi1sZWZ0OiBhdXRvO1xcbiAgd2lkdGg6IDIwZW07XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiBhbGljZWJsdWU7XFxuICBib3JkZXItc3R5bGU6IHNvbGlkO1xcbiAgYm9yZGVyLWNvbG9yOiAjZjE1OTI1O1xcbiAgbWFyZ2luLXJpZ2h0OiBhdXRvO1xcbiAgbWFyZ2luLXRvcDogMTBlbTtcXG59XFxuLmNhbGVuZGFyIC5kYXlibG9ja3JvdyB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZmxleC1kaXJlY3Rpb246IHJvdztcXG4gIG1pbi13aWR0aDogMTAwJTtcXG4gIGJhY2tncm91bmQtY29sb3I6IGFsaWNlYmx1ZTtcXG59XFxuLmNhbGVuZGFyIC5jYWxlbmRhclRpbWVQYXJlbnQge1xcbiAgbWFyZ2luOiAwLjFlbTtcXG59XFxuLmNhbGVuZGFyIC5jYWxlbmRhclRpbWVQYXJlbnQgLmNhbGVuZGFyVGltZSB7XFxuICBmb250LXNpemU6IDAuOWVtO1xcbiAgbWFyZ2luLXRvcDogMGVtO1xcbiAgbGluZS1oZWlnaHQ6IDE7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiBhbGljZWJsdWU7XFxuICBjb2xvcjogYmxhY2s7XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICBtYXJnaW46IDBweDtcXG4gIGZvbnQtc2l6ZTogMC44ZW07XFxufVxcbi5jYWxlbmRhciAud2lkdGhTaGFwZURheXMge1xcbiAgd2lkdGg6IDE0LjI4NTcxNDI4NTclO1xcbiAgbWFyZ2luLWxlZnQ6IGF1dG87XFxuICBtYXJnaW4tcmlnaHQ6IGF1dG87XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxufVxcbi5jYWxlbmRhciAud2lkdGhTaGFwZSB7XFxuICB3aWR0aDogMTQuMjg1NzE0Mjg1NyU7XFxuICBtYXJnaW4tbGVmdDogYXV0bztcXG4gIG1hcmdpbi1yaWdodDogYXV0bztcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gIG1pbi1oZWlnaHQ6IDMuNmVtO1xcbiAgbWFyZ2luLWJvdHRvbTogMC4yZW07XFxufVxcbi5jYWxlbmRhciAubW9udGhOYW1lIHtcXG4gIG1hcmdpbjogYXV0bztcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gIGZvbnQtZmFtaWx5OiBVYnVudHU7XFxuICBmb250LXNpemU6IDEuNjFlbTtcXG4gIGJhY2tncm91bmQtY29sb3I6ICMzMzdhYjc7XFxuICBjb2xvcjogI2ZmY2MzMztcXG4gIGZsZXgtYmFzaXM6IDEwMCU7XFxuICBib3JkZXItYm90dG9tLXN0eWxlOiBzb2xpZDtcXG59XFxuLmNhbGVuZGFyIC53ZWVrcm93IHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBmbGV4LXdyYXA6IG5vd3JhcDtcXG4gIGZsZXgtZGlyZWN0aW9uOiByb3c7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmO1xcbiAgZm9udC1mYW1pbHk6IFxcXCJyb2JvdG9cXFwiLCBcXFwiYXJpYWxcXFwiO1xcbn1cXG4uY2FsZW5kYXIgLmRheU5hbWUge1xcbiAgY29sb3I6IGJsYWNrO1xcbiAgZm9udC1mYW1pbHk6IFxcXCJyb2JvdG9cXFwiLCBcXFwiYXJpYWxcXFwiO1xcbiAgZm9udC13ZWlnaHQ6IDYwMDtcXG4gIGJhY2tncm91bmQtY29sb3I6ICNjY2M7XFxufVxcbi5jYWxlbmRhciAubW9udGggPiAqIHtcXG4gIG1hcmdpbi1sZWZ0OiAycHg7XFxuICBtYXJnaW4tcmlnaHQ6IDJweDtcXG59XFxuLmNhbGVuZGFyIC5tb250aCB7XFxuICB3aWR0aDogNTAlO1xcbiAgbWluLXdpZHRoOiAzMDBweDtcXG4gIG1hcmdpbjogYXV0bztcXG59XFxuLmNhbGVuZGFyIC50aW1lQ2hvb3NlciB7XFxuICBwb3NpdGlvbjogc3RhdGljO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogYWxpY2VibHVlO1xcbiAgbWFyZ2luLWxlZnQ6IGF1dG87XFxuICBtYXJnaW4tcmlnaHQ6IGF1dG87XFxufVxcbi5jYWxlbmRhciAudGltZUNvbnRhaW5lciB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbn1cXG4uY2FsZW5kYXIgLnRpbWVDb250YWluZXIgZGl2IHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxufVxcbi5jYWxlbmRhciAudGltZUNob29zZXJNb2RhbCB7XFxuICB6LWluZGV4OiAxO1xcbiAgd2lkdGg6IDEwMCU7XFxuICBoZWlnaHQ6IDEwMCU7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuNCk7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICBtYXJnaW46IDA7XFxuICBwYWRkaW5nOiAwO1xcbiAgYm9yZGVyOiAwO1xcbiAgb3ZlcmZsb3cteDogc2Nyb2xsO1xcbn1cXG4uY2FsZW5kYXIgLmNhbGVuZGFyTGFiZWwge1xcbiAgbWluLXdpZHRoOiAzZW07XFxuICBwYWRkaW5nOiAwZW0gMWVtIDBlbSAxZW07XFxuICBjb2xvcjogYmxhY2s7XFxuICBmb250LWZhbWlseTogXFxcInJvYm90b1xcXCIsIFxcXCJhcmlhbFxcXCI7XFxuICBmb250LXdlaWdodDogNjAwO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogI2NjYztcXG4gIG1hcmdpbjogMWVtIDAgMWVtIDA7XFxufVxcbi5jYWxlbmRhciAuZGVsZXRlRGl2IHtcXG4gIGZvbnQtZmFtaWx5OiBVYnVudHU7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMzM3YWI3O1xcbiAgY29sb3I6ICNmZmNjMzM7XFxuICBib3JkZXItYm90dG9tLXN0eWxlOiBzb2xpZDtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxufVxcbi5jYWxlbmRhciAuZGVsZXRlQnV0dG9uIHtcXG4gIGJhY2tncm91bmQtY29sb3I6IHdoaXRlO1xcbiAgY29sb3I6ICNmMTU5MjU7XFxuICBmbG9hdDogcmlnaHQ7XFxuICBmb250LXdlaWdodDogNzAwO1xcbiAgZm9udC1mYW1pbHk6IEFyaWFsLCBIZWx2ZXRpY2EsIHNhbnMtc2VyaWY7XFxuICBib3JkZXItc3R5bGU6IHNvbGlkO1xcbiAgYm9yZGVyLXJhZGl1czogMmVtO1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgaGVpZ2h0OiAyZW07XFxuICB3aWR0aDogMmVtO1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gIG1hcmdpbjogMCAwLjVlbTtcXG4gIGZvbnQtc2l6ZTogMS41ZW07XFxufVxcbi5jYWxlbmRhciAuaW5uZXJTcGFuRGVsZXRlQnRuIHtcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG59XFxuLmNhbGVuZGFyIC5kZWxldGVCdXR0b246aG92ZXIsXFxuLmNhbGVuZGFyIC5kZWxldGVCdXR0b246Zm9jdXMsXFxuLmNhbGVuZGFyIC50aW1lU2VsZWN0OmhvdmVyLFxcbi5jYWxlbmRhciAudGltZVNlbGVjdDpmb2N1cyB7XFxuICBjb2xvcjogIzAwMDtcXG4gIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcXG4gIGN1cnNvcjogcG9pbnRlcjtcXG59XFxuLmNhbGVuZGFyIC5ob3VyIHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuICB3aWR0aDogMTBlbTtcXG59XFxuLmNhbGVuZGFyIC50aW1lU2VsZWN0UCB7XFxuICBkaXNwbGF5OiBpbmxpbmU7XFxuICB3aWR0aDogNWVtO1xcbiAgY29sb3I6ICMwMDA7XFxufVxcbi5jYWxlbmRhciAudGltZUNob29zZXIgPiBpbnB1dFt0eXBlPWNoZWNrYm94XSB7XFxuICBvdXRsaW5lOiAjZjE1OTI1O1xcbiAgb3V0bGluZS1zdHlsZTogc29saWQ7XFxufVxcbi5jYWxlbmRhciAudGltZVNlbGVjdCA+IG9wdGlvbiB7XFxuICBjb2xvcjogIzAwMDtcXG59XFxuLmNhbGVuZGFyIC5jYWxlbmRhciA+IHAsXFxuLmNhbGVuZGFyIGg0LFxcbi5jYWxlbmRhciBoMyxcXG4uY2FsZW5kYXIgaDIsXFxuLmNhbGVuZGFyIGgxLFxcbi5jYWxlbmRhciBzZWxlY3QsXFxuLmNhbGVuZGFyIG9wdGlvbiB7XFxuICBjb2xvcjogIzAwMDtcXG59XFxuLmNhbGVuZGFyIC5hcnJvdy11cCB7XFxuICB3aWR0aDogMDtcXG4gIGhlaWdodDogMDtcXG4gIGJvcmRlci1sZWZ0OiAxMHB4IHNvbGlkIHRyYW5zcGFyZW50O1xcbiAgYm9yZGVyLXJpZ2h0OiAxMHB4IHNvbGlkIHRyYW5zcGFyZW50O1xcbiAgYm9yZGVyLWJvdHRvbTogMTBweCBzb2xpZCBibGFjaztcXG59XFxuLmNhbGVuZGFyIC5hcnJvdy1kb3duIHtcXG4gIHdpZHRoOiAwO1xcbiAgaGVpZ2h0OiAwO1xcbiAgYm9yZGVyLWxlZnQ6IDEwcHggc29saWQgdHJhbnNwYXJlbnQ7XFxuICBib3JkZXItcmlnaHQ6IDEwcHggc29saWQgdHJhbnNwYXJlbnQ7XFxuICBib3JkZXItdG9wOiAxMHB4IHNvbGlkICMwMDA7XFxufVxcbi5jYWxlbmRhciAuYXJyb3dzIHtcXG4gIGZsb2F0OiByaWdodDtcXG4gIGNsZWFyOiByaWdodDtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gIGN1cnNvcjogcG9pbnRlcjtcXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxufVxcbi5jYWxlbmRhciAuYXJyb3ctcmlnaHQge1xcbiAgd2lkdGg6IDA7XFxuICBoZWlnaHQ6IDA7XFxuICBib3JkZXItdG9wOiA2MHB4IHNvbGlkIHRyYW5zcGFyZW50O1xcbiAgYm9yZGVyLWJvdHRvbTogNjBweCBzb2xpZCB0cmFuc3BhcmVudDtcXG4gIGJvcmRlci1sZWZ0OiA2MHB4IHNvbGlkIGdyZWVuO1xcbn1cXG4uY2FsZW5kYXIgLmFycm93LWxlZnQge1xcbiAgd2lkdGg6IDA7XFxuICBoZWlnaHQ6IDA7XFxuICBib3JkZXItdG9wOiAxMHB4IHNvbGlkIHRyYW5zcGFyZW50O1xcbiAgYm9yZGVyLWJvdHRvbTogMTBweCBzb2xpZCB0cmFuc3BhcmVudDtcXG4gIGJvcmRlci1yaWdodDogMTBweCBzb2xpZCBibHVlO1xcbn1cXG4uY2FsZW5kYXIgLmRheVRpbWUge1xcbiAgY3Vyc29yOiBwb2ludGVyO1xcbn1cXG4uY2FsZW5kYXIgLmRheVRpbWUgPiAqIHtcXG4gIHBvaW50ZXItZXZlbnRzOiBub25lO1xcbn1cXG5cIjsgKHJlcXVpcmUoXCJicm93c2VyaWZ5LWNzc1wiKS5jcmVhdGVTdHlsZShjc3MsIHsgXCJocmVmXCI6IFwicHJlQnVuZGxpbmdKUy9jYWxlbmRhckFwcC5jc3NcIiB9LCB7IFwiaW5zZXJ0QXRcIjogXCJib3R0b21cIiB9KSk7IG1vZHVsZS5leHBvcnRzID0gY3NzOyIsIi8qKlxuICogQHR5cGVkZWYge09iamVjdH0gSGFzVGVzdHNUYWdcbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gaGFzVGVzdHMgLSBJbmRpY2F0ZXMgd2hldGhlciB0aGUgZnVuY3Rpb24gaGFzIHRlc3RzLlxuICovXG5cbi8qKlxuICogQHR5cGVkZWYge09iamVjdH0gaGFzVGhlc2VTdHlsZXNcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBoYXNUaGVzZVN0eWxlcyAtIExpc3RzIHN0eWxlcyByZWZlcmVuY2VzIGluIGEgZnVudGlvblxuICovXG5cbmltcG9ydCB7XG4gIGdldERheXNJbk1vbnRoLCBnZW5lcmF0ZVJhbmRvbVN0cmluZywgZ2V0RWFybGllc3REYXRlLFxuICBibG9ja0RheXNOb3RPcGVuLCBodW1hbkRhdGUsIGNsZWFyU2VsZWN0aW9uXG59IGZyb20gJy4vYmFzaWNGdW5jdGlvbnMuanMnO1xuaW1wb3J0IHsgR2VuZXJhdGVUaW1lQ2hvb3Nlck1vZGFsIH0gZnJvbSAnLi9kaXNwbGF5VGltZUNob29zZXJNb2RhbC5qcyc7XG5pbXBvcnQgeyBjb2xvdXJzLCBzZWxlY3RlZFN0eWxlLCB1bnNlbGVjdGVkU3R5bGUgfSBmcm9tICcuL3N0eWxlcy5qcyc7XG5pbXBvcnQgeyBsYW5ndWFnZXMgfSBmcm9tICcuL2xhbmd1YWdlcy5qcyc7XG5pbXBvcnQgc3R5bGUgZnJvbSAnLi9jYWxlbmRhckFwcC5jc3MnO1xuXG4vKipcbiAqIEFkZHMgdGhlIHNwZWNpZmllZCBudW1iZXIgb2YgbW9udGhzIHRvIGEgZGF0ZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBtb250aHMgLSBUaGUgbnVtYmVyIG9mIG1vbnRocyB0byBhZGQuXG4gKiBAcmV0dXJucyB7RGF0ZX0gLSBUaGUgdXBkYXRlZCBkYXRlLlxuICovXG5EYXRlLnByb3RvdHlwZS5hZGRNb250aHMgPSBmdW5jdGlvbihtb250aHMpIHtcbiAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKHRoaXMpO1xuICBjb25zdCB5ZWFycyA9IE1hdGguZmxvb3IobW9udGhzIC8gMTIpO1xuICBjb25zdCByZW1haW5pbmdNb250aHMgPSBtb250aHMgJSAxMjtcbiAgaWYgKHllYXJzKSB7XG4gICAgZGF0ZS5zZXRGdWxsWWVhcihkYXRlLmdldEZ1bGxZZWFyKCkgKyB5ZWFycyk7XG4gIH1cbiAgaWYgKHJlbWFpbmluZ01vbnRocykge1xuICAgIGRhdGUuc2V0TW9udGgoZGF0ZS5nZXRNb250aCgpICsgcmVtYWluaW5nTW9udGhzKTtcbiAgfVxuICByZXR1cm4gZGF0ZTtcbn07XG5cbmN1c3RvbUVsZW1lbnRzLmRlZmluZSgnc3dpZnQtY2FsJywgY2xhc3MgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG4gIGNvbnN0cnVjdG9yICgpIHtcbiAgICBzdXBlcigpO1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIGZ1bmN0aW9uIHN0VG9Cb29sZWFuIChzdCkge1xuICAgICAgaWYoc3QgPT09ICd0cnVlJykge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgXG4gICAgY29uc3QgY2FsZW5kYXIgPSBuZXcgU3dpZnRDYWwoKTtcbiAgICBjYWxlbmRhci5nZW5lcmF0ZUNhbGVuZGFyKFxuICAgICAge1xuICAgICAgICB0YXJnZXQ6IHNlbGYsXG4gICAgICAgIC8vIGRhdGEtbnVtYmVyLW9mLW1vbnRocy10by1kaXNwbGF5IGh0bWwgY29udmVydHMgdG8gbnVtYmVyT2ZNb250aHNUb0Rpc3BsYXkgSlNcbiAgICAgICAgbnVtYmVyT2ZNb250aHNUb0Rpc3BsYXk6IHRoaXMuZGF0YXNldC5udW1iZXJPZk1vbnRoc1RvRGlzcGxheSxcbiAgICAgICAgLy8gZGF0YS1kaXNwbGF5LXRpbWUtY2hvb3Nlci1tb2RhbFxuICAgICAgICBkaXNwbGF5VGltZUNob29zZXJNb2RhbDogc3RUb0Jvb2xlYW4odGhpcy5kYXRhc2V0LmRpc3BsYXlUaW1lQ2hvb3Nlck1vZGFsKSxcbiAgICAgICAgLy8gZGF0YS1zaW5nbGUtZGF0ZS1jaG9pY2VcbiAgICAgICAgc2luZ2xlRGF0ZUNob2ljZTogc3RUb0Jvb2xlYW4odGhpcy5kYXRhc2V0LnNpbmdsZURhdGVDaG9pY2UpLFxuXG4gICAgICAgIGxhbmd1YWdlOiB0aGlzLmRhdGFzZXQubGFuZ3VhZ2UsXG4gICAgICAgIC8vZGF0YS1zZWxlY3QtbXVsdGlwbGVcbiAgICAgICAgc2VsZWN0TXVsdGlwbGU6IHRoaXMuZGF0YXNldC5zZWxlY3RNdWx0aXBsZSxcblxuICAgICAgICBwcmVsb2FkZWREYXRlczogKHRoaXMuZGF0YXNldC5wcmVsb2FkZWREYXRlcykgPyBKU09OLnBhcnNlKHRoaXMuZGF0YXNldC5wcmVsb2FkZWREYXRlcykgOiBmYWxzZSxcblxuICAgICAgICBwcmVsb2FkZWRUb29sdGlwOiB0aGlzLmRhdGFzZXQucHJlbG9hZGVkVG9vbHRpcFxuXG4gICAgICB9KTtcblxuICAgIHRoaXMuZHluYW1pY0RhdGEgPSBjYWxlbmRhci5yZXR1cm5EeW5hbWljRGF0YSgpO1xuICB9XG59KTtcblxuZnVuY3Rpb24gU3dpZnRDYWwgKCkge1xuICBsZXQgdGltZUNob29zZXI7XG4gIC8vIGZvciBuZXN0ZWQgZnVuY3Rpb25zIHRvIGFjY2VzcyB0aGUgb3V0ZXIgb2JqZWN0XG4gIGNvbnN0IGlubmVyVGhpcyA9IHRoaXM7IFxuICBjb25zdCBjb25maWcgPSB7fTtcblxuICBjb25zdCBoYW5kbGVyID0ge1xuICAgIGdldDogKHRhcmdldCwga2V5KSA9PiB7XG4gICAgICBpZih0eXBlb2YgdGFyZ2V0W2tleV0gPT09ICdvYmplY3QnICYmIHRhcmdldFtrZXldICE9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJveHkodGFyZ2V0W2tleV0sIGhhbmRsZXIpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGFyZ2V0W2tleV07XG4gICAgfSxcbiAgICBzZXQ6ICh0YXJnZXQsIHByb3AsIHZhbHVlKSA9PiB7XG4gICAgICB0YXJnZXRbcHJvcF0gPSB2YWx1ZTtcbiAgICAgIGVtaXREYXRlU2VsZWN0ZWRFdmVudCgpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG4gIFxuICBjb25zdCBkYXRhVGVtcGxhdGUgPSB7XG4gICAgZGF0ZXNTZWxlY3RlZEFycmF5OiBbXSxcbiAgICBkYXRlc1NlbGVjdGVkQXJyYXlPYmplY3RzOiBbXSxcbiAgICBkaXNhYmxlZDogZmFsc2VcbiAgfTtcblxuICBjb25zdCBkeW5hbWljRGF0YSA9IG5ldyBQcm94eShkYXRhVGVtcGxhdGUsIGhhbmRsZXIpO1xuXG4gIGZ1bmN0aW9uIGVtaXREYXRlU2VsZWN0ZWRFdmVudCAoKSB7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBjb25zdCBldnQgPSBuZXcgQ3VzdG9tRXZlbnQoJ2RhdGVTZWxlY3QnLCB7IGRhdGE6IGR5bmFtaWNEYXRhIH0pO1xuICAgICAgY29uZmlnLmNhbGVuZGFyQ29udGFpbmVyLmRpc3BhdGNoRXZlbnQoZXZ0KTtcbiAgICB9LCAyNTApXG4gIH1cbiAgXG4gIGNvbnN0IGNhbGVuZGFyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cbiAgdGhpcy5yZXR1cm5DYWxlbmRhciA9ICgpID0+IHtcbiAgICByZXR1cm4gY2FsZW5kYXI7XG4gIH07XG5cbiAgdGhpcy5yZXR1cm5EeW5hbWljRGF0YSA9ICgpID0+IHtcbiAgICByZXR1cm4gZHluYW1pY0RhdGE7XG4gIH07XG5cbiAgdGhpcy5yZXR1cm5Db25maWcgPSAoKSA9PiB7XG4gICAgcmV0dXJuIGNvbmZpZztcbiAgfTtcblxuICB0aGlzLnNldENvbmZpZyA9IChjb25maWdPYmopID0+IHtcbiAgICAvLyBJZiBjYWxsZWQgdmlhIEhUTUxcbiAgICBjb25maWcuY2FsZW5kYXJDb250YWluZXIgPSBjb25maWdPYmoudGFyZ2V0IHx8IGZhbHNlO1xuICAgIC8vIElmIGNhbGxlZCB2aWEgSmF2YXNjcmlwdFxuICAgIGNvbmZpZy5wYXJlbnREaXYgPSAodHlwZW9mIGNvbmZpZ09iai5wYXJlbnREaXYgPT09ICdzdHJpbmcnKSA/IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoY29uZmlnT2JqLnBhcmVudERpdikgOiBjb25maWdPYmoucGFyZW50RGl2O1xuICAgIC8vIGRvbmVcbiAgICBjb25maWcubnVtYmVyT2ZNb250aHNUb0Rpc3BsYXkgPSBjb25maWdPYmoubnVtYmVyT2ZNb250aHNUb0Rpc3BsYXkgfHwgMTI7XG4gICAgLy8gZG9uZVxuICAgIGNvbmZpZy5kaXNwbGF5VGltZUNob29zZXJNb2RhbCA9IGNvbmZpZ09iai5kaXNwbGF5VGltZUNob29zZXJNb2RhbCAmJiB0cnVlO1xuICAgIC8vIGRvbmVcbiAgICBjb25maWcuc2luZ2xlRGF0ZUNob2ljZSA9IGNvbmZpZ09iai5zaW5nbGVEYXRlQ2hvaWNlICYmIHRydWU7XG4gICAgLy8gZG9uZVxuICAgIGNvbmZpZy5zZWxlY3RSYW5nZSA9ICFjb25maWdPYmouc2luZ2xlRGF0ZUNob2ljZTtcbiAgICAvLyBkb25lXG4gICAgY29uZmlnLmxhbmd1YWdlID0gY29uZmlnT2JqLmxhbmd1YWdlIHx8ICdlbkdiJztcbiAgICAvLyBkb25lXG4gICAgY29uZmlnLnNlbGVjdE11bHRpcGxlID0gY29uZmlnLnNlbGVjdE11bHRpcGxlIHx8IGZhbHNlO1xuICAgIC8vIGRvbmVcbiAgICBjb25maWcuZGlzcGxheVRpbWVTZWxlY3Rpb25PbkRhdGUgPSBjb25maWdPYmouZGlzcGxheVRpbWVTZWxlY3Rpb25PbkRhdGUgfHwgdHJ1ZTtcbiAgICAvLyBkb25lXG4gICAgY29uZmlnLnByZWxvYWRlZERhdGVzID0gY29uZmlnT2JqLnByZWxvYWRlZERhdGVzIHx8IGZhbHNlO1xuXG4gICAgY29uZmlnLnByZWxvYWRlZFRvb2x0aXAgPSBjb25maWdPYmoucHJlbG9hZGVkVG9vbHRpcCB8fCBmYWxzZTtcblxuICAgIGNvbmZpZy5lbmRVc2VyID0gY29uZmlnT2JqLmVuZFVzZXIgfHwgZmFsc2U7XG4gICAgY29uZmlnLmVuZFVzZXJEdXJhdGlvbkNob2ljZSA9IGNvbmZpZ09iai5lbmRVc2VyRHVyYXRpb25DaG9pY2UgfHwgZmFsc2U7XG4gICAgY29uZmlnLmJhY2tlbmQgPSBjb25maWdPYmouYmFja2VuZCB8fCBmYWxzZTtcbiAgICBjb25maWcuZGlzcGxheUJsb2NrZWQgPSBjb25maWdPYmouZGlzcGxheUJsb2NrZWQgfHwgZmFsc2U7XG4gICAgY29uZmlnLmRhdGVzT3BlbiA9IGNvbmZpZ09iai5kYXRlc09wZW4gfHwgZmFsc2U7XG4gIH07XG5cbiAgdGhpcy5nZW5lcmF0ZUNhbGVuZGFyID0gKGNvbmZpZ09iaikgPT4ge1xuICAgIGlmIChjb25maWdPYmopIHtcbiAgICAgIHRoaXMuc2V0Q29uZmlnKGNvbmZpZ09iaik7XG4gICAgfVxuICAgIC8vIElmIGNhbGxlZCB2aWEgamF2YXNjcmlwdCBhIHBhcmVudEVsZW1lbnQgbmVlZHMgdG8gYmUgcHJvdmlkZWRcbiAgICBjb25zdCBwYXJlbnREaXYgPSBjb25maWcucGFyZW50RGl2O1xuICAgIC8qXG4gICAgICBJZiBjYWxsZWQgZnJvbSBodG1sIGFzIGEgY3VzdG9tIGNvbXBvbmVudCB0aGUgY29tcG9uZW50IGl0c2VsZiBpcyBwYXNzZWQgKGNhbGVuZGFyQ29udGFpbmVyKVxuICAgICAgSWYgY2FsbGVkIHZpYSBKUyB3aGlsZSB0aGUgY29tcG9uZW50IGlzbid0IGEgd2ViY29tcG9uZW50IGluIHRoZSBzdHJpY3Rlc3Qgc2Vuc2UsIGl0IHN0aWxsXG4gICAgICBiZWhhdmVzIGxpa2Ugb25lIGFuZCBpcyBlbmNhcHN1bGF0ZWQgaW4gYSBzaGFkb3cuXG4gICAgKi9cbiAgICBpZiAoY29uZmlnLmNhbGVuZGFyQ29udGFpbmVyKSB7XG4gICAgICBzaGFkb3dBdHRhY2goY29uZmlnLmNhbGVuZGFyQ29udGFpbmVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbmV3Q29udGFpbmVyKCkudGhlbigoY29udGFpbmVyKSA9PiB7XG4gICAgICAgIHNoYWRvd0F0dGFjaChjb250YWluZXIpO1xuICAgICAgICBjb25maWcuY2FsZW5kYXJDb250YWluZXIgPSBjb250YWluZXI7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBuZXdDb250YWluZXIgKCkge1xuICAgICAgY29uc3QgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgY29uc3QgbmV3Q2FsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIG5ld0NhbC5jbGFzc0xpc3QuYWRkKCdzd2lmdC1jYWwnKTtcbiAgICAgICAgcGFyZW50RGl2LmFwcGVuZENoaWxkKG5ld0NhbCk7XG4gICAgICAgIHJlc29sdmUobmV3Q2FsKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2hhZG93QXR0YWNoIChjb250YWluZXIpIHtcbiAgICAgIGNvbnN0IHNoYWRvd1Jvb3QgPSBjb250YWluZXIuYXR0YWNoU2hhZG93KHsgbW9kZTogJ29wZW4nIH0pO1xuICAgICAgY29uc3QgY3NzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgICAgIGNzcy50ZXh0Q29udGVudCA9IHN0eWxlO1xuICAgICAgc2hhZG93Um9vdC5hcHBlbmRDaGlsZChjc3MpO1xuICAgICAgc2hhZG93Um9vdC5hcHBlbmRDaGlsZChjYWxlbmRhcik7XG4gICAgfVxuXG4gICAgY29uc3QgcHJlbG9hZGVkRGF0ZXMgPSBjb25maWcucHJlbG9hZGVkRGF0ZXM7XG4gICAgY29uc3QgbnVtYmVyT2ZNb250aHNUb0Rpc3BsYXkgPSBjb25maWcubnVtYmVyT2ZNb250aHNUb0Rpc3BsYXk7XG4gICAgY29uc3QgZGF0ZXNPcGVuID0gY29uZmlnLmRhdGVzT3BlbjtcbiAgICBjb25zdCBsYW5ndWFnZSA9IGNvbmZpZy5sYW5ndWFnZTtcbiAgICBjb25zdCBkaXNwbGF5VGltZUNob29zZXJNb2RhbCA9IGNvbmZpZy5kaXNwbGF5VGltZUNob29zZXJNb2RhbDtcbiAgICBcbiAgICAvLyBUT0RPOlxuICAgIGNvbnN0IGVuZFVzZXIgPSBjb25maWcuZW5kVXNlcjtcbiAgICBjb25zdCBlbmRVc2VyRHVyYXRpb25DaG9pY2UgPSBjb25maWcuZW5kVXNlckR1cmF0aW9uQ2hvaWNlO1xuICAgIGNvbnN0IGJhY2tlbmQgPSBjb25maWcuYmFja2VuZDtcbiAgICBjb25zdCBkaXNwbGF5QmxvY2tlZCA9IGNvbmZpZy5kaXNwbGF5QmxvY2tlZDtcblxuICAgIGxldCB1bmlxdWVEYXlJbmRleCA9IDA7XG4gICAgLy8gQ2FsZW5kYXIgaXMgZGVmaW5lZCBnbG9iYWxseSB3aXRoaW4gdGhlIGNvbnN0cnVjdG9yXG4gICAgY29uc3QgY2FsZW5kYXJVbmlxdWVJZCA9IGdlbmVyYXRlUmFuZG9tU3RyaW5nKCk7XG4gICAgY2FsZW5kYXIuaWQgPSBgY2FsZW5kYXItJHtjYWxlbmRhclVuaXF1ZUlkfWA7XG4gICAgY2FsZW5kYXIuY2xhc3NMaXN0LmFkZCgnY2FsZW5kYXInKTtcblxuICAgIGNvbnN0IG1vbnRocyA9IFtdO1xuICAgIGNvbnN0IGRhdGVOb3cgPSBuZXcgRGF0ZSgpO1xuICAgIGNvbnN0IGVhcmxpZXN0RGF0ZSA9IChwcmVsb2FkZWREYXRlcyAmJiBwcmVsb2FkZWREYXRlcy5ib29rZWQpID8gZ2V0RWFybGllc3REYXRlKHByZWxvYWRlZERhdGVzKSA6IGRhdGVOb3c7XG4gICAgY29uc3Qgc3RhcnRNb250aCA9IGVhcmxpZXN0RGF0ZS5nZXRNb250aCgpO1xuICAgIGNvbnN0IG1vbnRoTmFtZXMgPSBsYW5ndWFnZXNbbGFuZ3VhZ2VdLmdlbmVyYWxUaW1lLm1vbnRocztcbiAgICAvKiBDcmVhdGUgbW9udGggdmlldyAqL1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtYmVyT2ZNb250aHNUb0Rpc3BsYXk7IGkrKykge1xuICAgICAgLyogTW9udGggc3BlY2lmaWMgdmFyaWFibGVzIGFuZCB0cmFja2VycyAqL1xuICAgICAgY29uc3QgeWVhckNhbGMgPSBlYXJsaWVzdERhdGUuYWRkTW9udGhzKGkpLmdldEZ1bGxZZWFyKCk7XG4gICAgICBjb25zdCBtb250aENhbGMgPSAoc3RhcnRNb250aCArIGkpICUgMTI7XG4gICAgICBjb25zdCBzdGFydERheU9mTW9udGggPSBuZXcgRGF0ZSh5ZWFyQ2FsYywgbW9udGhDYWxjKS5nZXREYXkoKTtcbiAgICAgIGNvbnN0IGRheXNJbk1vbnRoID0gZ2V0RGF5c0luTW9udGgoKHN0YXJ0TW9udGggKyBpICsgMSkgJSAxMiwgZWFybGllc3REYXRlLmFkZE1vbnRocyhpKS5nZXRGdWxsWWVhcigpKTtcbiAgICAgIGxldCBjb3VudCA9IDE7XG4gICAgICBsZXQgZGF5b2Z3ZWVrID0gMDtcblxuICAgICAgLyogQ3JlYXRlIG1vbnRoIGRpdiAqL1xuICAgICAgY29uc3QgbW9udGggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIG1vbnRocy5wdXNoKG1vbnRoKTtcbiAgICAgIG1vbnRoLnN0eWxlLndpZHRoID0gJzE1ZW0nO1xuICAgICAgbW9udGguc3R5bGUuYmFja2dyb3VuZENvbG9yID0gY29sb3Vycy5tb250aEJvcmRlckNvbG9yO1xuICAgICAgbW9udGguY2xhc3NMaXN0LmFkZCgnbW9udGgnKTtcbiAgICAgIGNhbGVuZGFyLmFwcGVuZENoaWxkKG1vbnRoKTtcblxuICAgICAgLyogQ3JlYXRlIG1vbnRoIG5hbWUgZGl2IChtb250aCBZWVlZKSBhdCB0aGUgdG9wIG9mIG1vbnRoIGRpc3BsYXkgKi9cbiAgICAgIGNvbnN0IG1vbnRoTmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgbW9udGhOYW1lLmNsYXNzTGlzdC5hZGQoJ21vbnRoTmFtZScpO1xuICAgICAgbW9udGhOYW1lLnRleHRDb250ZW50ID0gYCR7bW9udGhOYW1lc1soc3RhcnRNb250aCArIGkpICUgMTJdfSAke2VhcmxpZXN0RGF0ZS5nZXRGdWxsWWVhcigpfWA7XG4gICAgICBtb250aC5hcHBlbmRDaGlsZChtb250aE5hbWUpO1xuXG4gICAgICAvKiBDcmVhdGUgZGl2IHdpdGggbmFtZWQgZGF5cyBvZiB0aGUgd2VlayAqL1xuICAgICAgY29uc3QgZGF5TmFtZXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIG1vbnRoLmFwcGVuZENoaWxkKGRheU5hbWVzKTtcbiAgICAgIGRheU5hbWVzLmNsYXNzTGlzdC5hZGQoJ3dlZWtyb3cnKTtcbiAgICAgIGxhbmd1YWdlc1tsYW5ndWFnZV0uZ2VuZXJhbFRpbWUuZGF5c1RydW5jYXRlZC5mb3JFYWNoKChkYXlOYW1lKSA9PiB7XG4gICAgICAgIGNvbnN0IGRheSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBkYXkudGV4dENvbnRlbnQgPSBkYXlOYW1lO1xuICAgICAgICBkYXkuY2xhc3NMaXN0LmFkZCgnZGF5TmFtZScsICd3aWR0aFNoYXBlRGF5cycpO1xuICAgICAgICBkYXlOYW1lcy5hcHBlbmRDaGlsZChkYXkpO1xuICAgICAgfSk7XG5cbiAgICAgIC8qIENyZWF0ZSB3ZWVrIHJvd3MgZmlyc3Qgd2VlaywgaXQncyByZWFzaWduZWQgZiAqL1xuICAgICAgbGV0IHdlZWtSb3c7XG4gICAgICBmdW5jdGlvbiBtYWtlTmV3V2Vla1JvdyAoKSB7XG4gICAgICAgIHdlZWtSb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgbW9udGguYXBwZW5kQ2hpbGQod2Vla1Jvdyk7XG4gICAgICAgIHdlZWtSb3cuY2xhc3NMaXN0LmFkZCgnd2Vla3JvdycpO1xuICAgICAgICBkYXlvZndlZWsgPSAwO1xuICAgICAgfVxuXG4gICAgICAvLyA0MiBkYXlzLCBpLmUuIDYgcm93cyBvZiA3XG4gICAgICBmb3IgKGxldCBwID0gMDsgcCA8IDQyOyBwKyspIHtcbiAgICAgICAgaWYgKHAgPT09IDApIHtcbiAgICAgICAgICBtYWtlTmV3V2Vla1JvdygpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwIDwgc3RhcnREYXlPZk1vbnRoKSB7XG4gICAgICAgICAgY29uc3QgcGVnaG9sZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgIHBlZ2hvbGUuY2xhc3NMaXN0LmFkZCgnd2lkdGhTaGFwZScsICdmaWxsZXInKTtcbiAgICAgICAgICB1bnNlbGVjdGVkU3R5bGUocGVnaG9sZSk7XG4gICAgICAgICAgd2Vla1Jvdy5hcHBlbmRDaGlsZChwZWdob2xlKTtcbiAgICAgICAgICBkYXlvZndlZWsrKztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwID49IHN0YXJ0RGF5T2ZNb250aCAmJiBwIDw9IChzdGFydERheU9mTW9udGggKyBkYXlzSW5Nb250aCAtIDEpKSB7XG4gICAgICAgICAgY29uc3QgcGVnaG9sZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgIHBlZ2hvbGUudGV4dENvbnRlbnQgPSBjb3VudDtcbiAgICAgICAgICBwZWdob2xlLmRhdGFzZXQuZGF5ID0gY291bnQ7XG4gICAgICAgICAgcGVnaG9sZS5kYXRhc2V0LmRheW9md2VlayA9IGRheW9md2VlaztcbiAgICAgICAgICBwZWdob2xlLmRhdGFzZXQuZGF5aW5kZXggPSB1bmlxdWVEYXlJbmRleDtcbiAgICAgICAgICBwZWdob2xlLmNsYXNzTGlzdC5hZGQoJ3dpZHRoU2hhcGUnLCAnZGF5VGltZScpO1xuICAgICAgICAgIHBlZ2hvbGUuZGF0YXNldC5odW1hbmRhdGUgPSBodW1hbkRhdGUoYCR7eWVhckNhbGN9LSR7bW9udGhDYWxjfS0ke2NvdW50fWApO1xuICAgICAgICAgIC8vIHBlZ2hvbGUuaWQgPSBgJHt5ZWFyQ2FsY30tJHttb250aENhbGN9LSR7Y291bnR9YDtcbiAgICAgICAgICBwZWdob2xlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgICAgICAgIGRhdGVPbkNsaWNrRXZlbnRzKGUpO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgd2Vla1Jvdy5hcHBlbmRDaGlsZChwZWdob2xlKTtcblxuICAgICAgICAgIGlmIChpID09PSAwICYmIHAgPj0gc3RhcnREYXlPZk1vbnRoICYmIHAgPCAobmV3IERhdGUoKS5nZXREYXRlKCkgKyBzdGFydERheU9mTW9udGgpKSB7XG4gICAgICAgICAgICBwZWdob2xlLmNsYXNzTGlzdC5hZGQoJ2ZpbGxlcicpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvdW50Kys7XG4gICAgICAgICAgZGF5b2Z3ZWVrKys7XG4gICAgICAgICAgdW5pcXVlRGF5SW5kZXgrKztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwID49IGRheXNJbk1vbnRoICsgc3RhcnREYXlPZk1vbnRoKSB7XG4gICAgICAgICAgY29uc3QgcGVnaG9sZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgIHBlZ2hvbGUuY2xhc3NMaXN0LmFkZCgnd2lkdGhTaGFwZScsICdmaWxsZXInKTtcbiAgICAgICAgICB3ZWVrUm93LmFwcGVuZENoaWxkKHBlZ2hvbGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKChwICsgMSkgJSA3ID09PSAwKSB7XG4gICAgICAgICAgbWFrZU5ld1dlZWtSb3coKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGkgPT09IG51bWJlck9mTW9udGhzVG9EaXNwbGF5IC0gMSkge1xuICAgICAgICBibG9ja0RheXNOb3RPcGVuKGNhbGVuZGFyLCBkYXRlc09wZW4pO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBPcHRpb25zOlxuICAgIGlmKGRpc3BsYXlUaW1lQ2hvb3Nlck1vZGFsKSB7XG4gICAgICB0aW1lQ2hvb3NlciA9IG5ldyBHZW5lcmF0ZVRpbWVDaG9vc2VyTW9kYWwoY29uZmlnLCBkeW5hbWljRGF0YSwgY2FsZW5kYXIpO1xuICAgICAgdGltZUNob29zZXIuZ2VuZXJhdGVNb2RhbCgpO1xuICAgIH1cbiAgICBpZihwcmVsb2FkZWREYXRlcykge1xuICAgICAgcHJlbG9hZERhdGVzKHByZWxvYWRlZERhdGVzKTtcbiAgICB9XG4gIH07XG5cbiAgbGV0IGNsaWNrQ291bnQgPSAxO1xuICBsZXQgZGF0ZUNsaWNrZWRUaHJpY2UgPSB7XG4gICAgZGF0ZTogbnVsbCxcbiAgICBjb3VudDogMVxuICB9XG5cbiAgZnVuY3Rpb24gY2xpa2VkVGhyaWNlIChkYXRlKSB7XG5cbiAgICBpZiAoZGF0ZUNsaWNrZWRUaHJpY2UuZGF0ZSA9PT0gZGF0ZSkge1xuICAgICAgZGF0ZUNsaWNrZWRUaHJpY2UuY291bnQrKztcbiAgICB9IFxuICAgIGVsc2Uge1xuICAgICAgLy8gcmVzZXQgZm9yIG5ldyBkYXRlXG4gICAgICBkYXRlQ2xpY2tlZFRocmljZS5kYXRlID0gZGF0ZTtcbiAgICAgIGRhdGVDbGlja2VkVGhyaWNlLmNvdW50ID0gMTtcbiAgICB9XG5cbiAgICBpZiAoZGF0ZUNsaWNrZWRUaHJpY2UuY291bnQgPT09IDMpIHtcbiAgICAgIGRhdGVDbGlja2VkVGhyaWNlLmNvdW50ID0gMDtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBmdW5jdGlvbiBkYXRlT25DbGlja0V2ZW50cyAoZSkgeyAgICBcblxuICAgIGNvbnN0IGRhdGVEaXYgPSBlLnRhcmdldDtcbiAgICBjbGlja0NvdW50Kys7XG5cbiAgICBpZiAoZHluYW1pY0RhdGEuZGlzYWJsZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoY29uZmlnLnNlbGVjdFJhbmdlKSB7XG4gICAgICByYW5nZShkYXRlRGl2KTtcbiAgICB9XG5cbiAgICBpZiAoY29uZmlnLnNpbmdsZURhdGVDaG9pY2UpIHtcbiAgICAgIGNsZWFyU2VsZWN0aW9uKGNhbGVuZGFyLCBkeW5hbWljRGF0YSk7XG4gICAgICBib29rRGF0ZXMoW2RhdGVEaXZdKTtcbiAgICAgIHRpbWVDaG9vc2VyVG9nZ2xlKCk7XG4gICAgfVxuXG5cbiAgICBmdW5jdGlvbiB0aW1lQ2hvb3NlclRvZ2dsZSAoKSB7XG4gICAgICBpZiAoY29uZmlnLmRpc3BsYXlUaW1lQ2hvb3Nlck1vZGFsKSB7IFxuICAgICAgICB0aW1lQ2hvb3Nlci5zaG93KCk7XG4gICAgICAgIHRpbWVDaG9vc2VyLndyaXRlVG9EYXRlRGl2KCk7XG4gICAgICAgIHRpbWVDaG9vc2VyLndyaXRlVG9EeW5hbWljRGF0YSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJhbmdlKGRhdGVEaXYpIHtcbiAgICAgIGNvbnN0IGxhc3REYXRlID0gZGF0ZUNsaWNrZWRUaHJpY2UuZGF0ZTtcbiAgICAgIGNvbnN0IHRocmljZSA9IGNsaWtlZFRocmljZShkYXRlRGl2LmRhdGFzZXQuaHVtYW5kYXRlKTtcbiAgICAgIGlmICh0aHJpY2UpIHtcbiAgICAgICAgd2luZG93LmdldFNlbGVjdGlvbigpLnJlbW92ZUFsbFJhbmdlcygpO1xuICAgICAgICAvLyBwYXNzIFwidHJ1ZVwiIHRvIGluZGljYXRlIGEgc2luZ2xlIGRhdGUgcmFuZ2UsIHNlbGVjdGVkIGJ5IHRyaXBsZSBjbGljazpcbiAgICAgICAgYm9va0RhdGVzKFtkYXRlRGl2XSwgdHJ1ZSk7XG4gICAgICAgIHRpbWVDaG9vc2VyVG9nZ2xlKCk7XG4gICAgICAgIGNsaWNrQ291bnQrKztcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKGNsaWNrQ291bnQgJSAyID09PSAwKSB7XG4gICAgICAgIGlmIChjb25maWcuc2VsZWN0TXVsdGlwbGUpIHtcbiAgICAgICAgICBjbGVhclNlbGVjdGlvbihjYWxlbmRhciwgZHluYW1pY0RhdGEpO1xuICAgICAgICB9XG4gICAgICAgIGJvb2tEYXRlcyhbZGF0ZURpdl0pO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAocHJpb3JXYXNTaW5nbGUgPT09IGZhbHNlICYmIGNsaWNrQ291bnQgJSAyID09PSAxKSB7XG4gICAgICAgIGJvb2tEYXRlcyhbZGF0ZURpdl0pO1xuICAgICAgICAvL3RpbWVDaG9vc2VyVG9nZ2xlKCk7XG4gICAgICAgIC8vIHJ1bGUgdG8gY2hlY2sgaWYgcmFuZ2UgaXMgYSBsb25nZXIgdGhhbiAxOiBcbiAgICAgICAgaWYoZGF0ZUNsaWNrZWRUaHJpY2UuZGF0ZSAhPT0gbGFzdERhdGUpIHsgdGltZUNob29zZXJUb2dnbGUoKTsgfVxuICAgICAgICByZXR1cm47XG4gICAgICB9ICAgICBcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmFuZ2Ugc2VsZWN0XG4gICAqIEBkZXNjcmlwdGlvbiBBbGxvd3MgYSByYW5nZSBvZiBkYXRlcyB0byBiZSBzZWxlY3RlZFxuICAgKiBAZnVuY3Rpb24gYm9va0RhdGVzXG4gICAqIEBwYXJhbSBkYXRlcyBhcnJheVxuICAgKiBAdG9kbyBhbGxvdyBhIHJhbmdlIG9mIGxlbmd0aCBvbmUgdG8gYmUgc2VsZWN0ZWRcbiAgICogQGZpcmVzIGJvb2tEYXkgZm9yIGVhY2ggZGF5IGluIGEgcmFuZ2VcbiAgICovXG5cbiAgbGV0IHByaW9yV2FzU2luZ2xlID0gZmFsc2U7IFxuICBmdW5jdGlvbiBib29rRGF0ZXMgKGFycmF5T2ZEYXRlRGl2cywgc2luZ2xlRGF0ZSkge1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIG5ldyBzZWxlY3Rpb24gaW4gdGhlIGR5bmFtaWNEYXRhIG9iamVjdC5cbiAgICAgKiBAcmV0dXJuIHtvYmplY3R9IEFuIG9iamVjdCBjb250YWluaW5nIHRoZSB0cmFja2luZyBhcnJheSBcIm5ld0FycmF5XCIgYW5kIG9iamVjdHMgYXJyYXkuXG4gICAgICovXG5cbiAgICBmdW5jdGlvbiBjcmVhdGVOZXdTZWxlY3Rpb24gKHByaW9yV2FzU2luZ2xlKSB7XG5cbiAgICAgIGNvbnN0IHBhcmVudEFyID0gZHluYW1pY0RhdGEuZGF0ZXNTZWxlY3RlZEFycmF5O1xuICAgICAgY29uc3QgcGFyZW50QXJPYmogPSBkeW5hbWljRGF0YS5kYXRlc1NlbGVjdGVkQXJyYXlPYmplY3RzO1xuICAgICAgbGV0IG5ld0FycmF5LCBuZXdPYmplY3RzQXJyYXk7XG5cbiAgICAgIG5ld0FycmF5ID0gcGFyZW50QXJbcGFyZW50QXIubGVuZ3RoIC0gMV07XG5cbiAgICAgIGlmICghcHJpb3JXYXNTaW5nbGUgJiYgY29uZmlnLnNlbGVjdFJhbmdlICYmIG5ld0FycmF5ICYmIG5ld0FycmF5Lmxlbmd0aCA9PT0gMSkge1xuICAgICAgICBuZXdPYmplY3RzQXJyYXkgPSBwYXJlbnRBck9ialtwYXJlbnRBck9iai5sZW5ndGggLSAxXTtcbiAgICAgICAgcmV0dXJuIHsgbmV3QXJyYXksIG5ld09iamVjdHNBcnJheSB9OyBcbiAgICAgIH1cblxuICAgICAgbmV3QXJyYXkgPSBbXTtcbiAgICAgIG5ld09iamVjdHNBcnJheSA9IFtdO1xuICAgICAgcGFyZW50QXIucHVzaChuZXdBcnJheSk7XG4gICAgICBwYXJlbnRBck9iai5wdXNoKG5ld09iamVjdHNBcnJheSk7XG4gICAgICByZXR1cm4geyBuZXdBcnJheSwgbmV3T2JqZWN0c0FycmF5IH07XG5cbiAgICB9XG5cbiAgICAvLyBjcmVhdGUgbmV3IHNlbGVjdGlvbnMgb3IgcmV0cmlldmUgdGhlIGxhc3Qgc2VsZWN0aW9uOiBcbiAgICBjb25zdCB7IG5ld0FycmF5LCBuZXdPYmplY3RzQXJyYXkgfSA9IGNyZWF0ZU5ld1NlbGVjdGlvbihwcmlvcldhc1NpbmdsZSk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFycmF5T2ZEYXRlRGl2cy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgZGF0ZURpdiA9IGFycmF5T2ZEYXRlRGl2c1tpXTtcbiAgICAgIGZpbmREYXRlU2VsZWN0aW9uKGRhdGVEaXYpO1xuICAgICAgYm9va0RheShkYXRlRGl2KTtcbiAgICB9XG4gICAgLy8gc3RvcmUgd2luIHRoZSBwcmV2aW91cyBzZWxlY3Rpb24gd2FzIGEgcmFuZ2Ugb2YgbGVuZ3RoIDEsIHJlYWQgYnkgXCJjcmVhdGVOZXdTZWxlY3Rpb25cIlxuICAgIHByaW9yV2FzU2luZ2xlID0gKHNpbmdsZURhdGUpID8gdHJ1ZSA6IGZhbHNlO1xuXG4gICAgLy8gaWYgdGhlIGRhdGUgaXMgaW4gYSBwcmV2aW91cyBzZWxlY3Rpb24sIHRoYXQgc2VsZWN0aW9uIGlzIHNwbGljZWRcbiAgICBmdW5jdGlvbiBmaW5kRGF0ZVNlbGVjdGlvbiAoZGF0ZSkge1xuICAgICAgLy8gY29uc29sZS5sb2coZGF0ZSk7XG4gICAgICBjb25zdCBzdG9yZSA9IGR5bmFtaWNEYXRhLmRhdGVzU2VsZWN0ZWRBcnJheU9iamVjdHM7XG4gICAgICBmb3IobGV0IGogPSAwOyBqIDwgc3RvcmUubGVuZ3RoOyBqKyspe1xuICAgICAgICAvLyB0aGUgYXJyYXkgaW4gcXVlc3Rpb25cbiAgICAgICAgY29uc3Qgc2luZ2xlU2VsZWN0aW9uID0gc3RvcmVbal07XG4gICAgICAgIC8vIGRhdGEgYXR0ciBvZiBodG1sIGVsZW1lbnRcbiAgICAgICAgY29uc3QgZGF0ZVZhbHVlID0gZGF0ZS5kYXRhc2V0Lmh1bWFuZGF0ZTtcbiAgICAgICAgY29uc3Qgc2VhcmNoID0gKCkgPT4gc2luZ2xlU2VsZWN0aW9uLmZpbmQoIChkYXRlU3RvcmVkKSA9PiBkYXRlU3RvcmVkLmh1bWFuZGF0ZSA9PT0gZGF0ZVZhbHVlKTtcbiAgICAgICAgaWYoc2VhcmNoKCkpIHtcbiAgICAgICAgICBzaW5nbGVTZWxlY3Rpb24uZm9yRWFjaCgoZGF0ZSkgPT4ge1xuICAgICAgICAgICAgLy8gcmVtb3ZlIHNlbGVjdGlvbiBjb2xvdXJcbiAgICAgICAgICAgIGNvbnN0IGRheURpdiA9IGNhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLWh1bWFuZGF0ZT0nJHtkYXRlLmh1bWFuZGF0ZX0nXWApO1xuICAgICAgICAgICAgdW5zZWxlY3RlZFN0eWxlKGRheURpdik7XG4gICAgICAgICAgICAvLyByZW1vdmUgdGltZXMsIGlmIGFueTogXG4gICAgICAgICAgICB3aGlsZSAoZGF5RGl2LmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgZGF5RGl2LnJlbW92ZUNoaWxkKGRheURpdi5sYXN0Q2hpbGQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIC8vIHJlbW92ZSBmcm9tIHN0b3JhZ2VcbiAgICAgICAgICBkeW5hbWljRGF0YS5kYXRlc1NlbGVjdGVkQXJyYXlPYmplY3RzLnNwbGljZShqLCAxKTtcbiAgICAgICAgICBkeW5hbWljRGF0YS5kYXRlc1NlbGVjdGVkQXJyYXkuc3BsaWNlKGosIDEpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuIFxuICAgIGlmIChjb25maWcuc2VsZWN0UmFuZ2UpIHtcbiAgICAgIGNvbnN0IHN0YXJ0RGF0ZSA9IG5ld09iamVjdHNBcnJheVswXTtcbiAgICAgIGNvbnN0IHN0YXJ0SW5kZXggPSBzdGFydERhdGUuaW5kZXg7XG4gICAgICAvLyBpZiBhIHNpbmdsZSBkYXRlIGlzIHNlbGVjdGVkOlxuICAgICAgY29uc3QgZW5kRGF0ZSA9IG5ld09iamVjdHNBcnJheVsxXSB8fCBzdGFydERhdGU7XG4gICAgICBjb25zdCBlbmRJbmRleCA9IChlbmREYXRlKSA/IGVuZERhdGUuaW5kZXggOiBmYWxzZTtcblxuICAgICAgbGV0IFtsb3csIGhpZ2hdID0gW3BhcnNlSW50KHN0YXJ0SW5kZXgpLCBwYXJzZUludChlbmRJbmRleCldLnNvcnQoKGEsIGIpID0+IGEgLSBiKTtcblxuICAgICAgZm9yIChsZXQgaSA9IGxvdzsgaSA8PSBoaWdoOyBpKyspIHtcbiAgICAgICAgY29uc3QgZGF0ZURpdiA9IGNhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLWRheWluZGV4PScke2l9J11gKTtcbiAgICAgICAgaWYgKGRhdGVEaXYuY2xhc3NMaXN0LmNvbnRhaW5zKCdibG9ja2VkJykpIHtcbiAgICAgICAgICB1bnNlbGVjdGVkU3R5bGUoY2FsZW5kYXIucXVlcnlTZWxlY3RvcihgW2lkPScke2VuZERhdGV9J11gKSk7XG4gICAgICAgICAgbmV3QXJyYXkuc3BsaWNlKDEsIDEpO1xuICAgICAgICAgIG5ld09iamVjdHNBcnJheS5zcGxpY2UoMSwgMSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgYm9va0RheShkYXRlRGl2KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBib29rRGF5IChkYXRlRGl2KSB7XG4gICAgICBpZiAoY29uZmlnLnNpbmdsZURhdGVDaG9pY2UgJiYgbmV3QXJyYXkubGVuZ3RoID4gMCkge1xuICAgICAgICBjbGVhclNlbGVjdGlvbihjYWxlbmRhciwgZHluYW1pY0RhdGEpO1xuICAgICAgfVxuICAgICAgaWYgKG5ld0FycmF5LmluY2x1ZGVzKGRhdGVEaXYuZGF0YXNldC5odW1hbmRhdGUpID09PSBmYWxzZSkge1xuICAgICAgICBzZWxlY3RlZFN0eWxlKGRhdGVEaXYpO1xuICAgICAgICBuZXdBcnJheS5wdXNoKGRhdGVEaXYuZGF0YXNldC5odW1hbmRhdGUpO1xuICAgICAgICBuZXdPYmplY3RzQXJyYXlbbmV3QXJyYXkubGVuZ3RoIC0gMV0gPSBzdGFuZGFyZERhdGVPYmplY3QoZGF0ZURpdik7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcHJlbG9hZERhdGVzIChwcmVsb2FkZWREYXRlcykge1xuICAgIFxuICAgIGZ1bmN0aW9uIGdldERpdnMgKGRhdGVzKSB7XG4gICAgICBjb25zdCBkYXRlRGl2cyA9IFtdO1xuICAgICAgY29uc3QgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgZGF0ZXMuZm9yRWFjaCgoZGF0ZSwgaSkgPT4ge1xuICAgICAgICAgIGNvbnN0IGRhdGVEaXYgPSBjYWxlbmRhci5xdWVyeVNlbGVjdG9yKGBbZGF0YS1odW1hbmRhdGU9JyR7ZGF0ZX0nXWApO1xuICAgICAgICAgIGRhdGVEaXZzLnB1c2goZGF0ZURpdik7XG4gICAgICAgICAgaWYgKGkgPT09IHByZWxvYWRlZERhdGVzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgIGJsb2NrTm90UHJlbG9hZGVkRGF0ZXMgKGRhdGVEaXZzKTtcbiAgICAgICAgICAgIHJlc29sdmUoZGF0ZURpdnMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYmxvY2tOb3RQcmVsb2FkZWREYXRlcyAoZGF0ZURpdnMpIHtcbiAgICAgIGNvbnN0IG5vbk9wdGlvbnMgPSBjYWxlbmRhci5xdWVyeVNlbGVjdG9yQWxsKCcuZGF5VGltZScpO1xuICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IG5vbk9wdGlvbnMubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgIGNvbnN0IGRheSA9IG5vbk9wdGlvbnNbaW5kZXhdO1xuICAgICAgICBpZighZGF0ZURpdnMuaW5jbHVkZXMoZGF5KSl7XG4gICAgICAgICAgZGF5LmNsYXNzTGlzdC5hZGQoJ2ZpbGxlcicpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGRheS5jbGFzc0xpc3QuYWRkKCdwcmVsb2FkZWQnKTtcbiAgICAgICAgICBkYXkudGl0bGUgPSBjb25maWcucHJlbG9hZGVkVG9vbHRpcDtcbiAgICAgICAgfSBcbiAgICAgIH1cbiAgICB9XG5cbiAgICBnZXREaXZzKHByZWxvYWRlZERhdGVzKS50aGVuKChkYXRlRGl2cykgPT4ge1xuICAgICAgLy8gYm9va0RhdGVzKGRhdGVEaXZzKTtcbiAgICB9KVxuXG4gIH0gICBcblxuXG5cbiAgXG4gIGNvbnN0IGRhdGVPYmplY3RUZW1wbGF0ZSA9IHsgZGF5OiAnZGF5JywgaHVtYW5kYXRlOiAnWVlZWS1NTS1ERCcsIGluZGV4OiAnMCcsIFVUQzogMTY5ODI3ODQwMDAwMH07XG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgc3RhbmRhcmQgZGF0ZSBvYmplY3Qgd2l0aCB0aGUgZ2l2ZW4gZGF0ZS5cbiAgICpcbiAgICogQHBhcmFtIHthbnl9IGRhdGUgLSBJcyBhIHN0cmluZyBZWVlZLU1NLUREIG1vbnRocyBhcmUgY291bnRlZCBmcm9tIDAuXG4gICAqIEByZXR1cm4ge29iamVjdH0gVGhlIHN0YW5kYXJkIGRhdGUgb2JqZWN0IHdpdGggdGhlIGdpdmVuIGRhdGUuXG4gICAqL1xuICBmdW5jdGlvbiBzdGFuZGFyZERhdGVPYmplY3QgKGRhdGUpIHtcbiAgICBjb25zdCBvYmogPSBPYmplY3QuY3JlYXRlKGRhdGVPYmplY3RUZW1wbGF0ZSk7XG4gICAgb2JqLmRheSA9IGRhdGUuZGF0YXNldC5kYXk7XG4gICAgb2JqLmh1bWFuZGF0ZSA9ICBkYXRlLmRhdGFzZXQuaHVtYW5kYXRlO1xuICAgIG9iai5pbmRleCA9IGRhdGUuZGF0YXNldC5kYXlpbmRleDtcbiAgICBvYmouVVRDID0gaHVtYW5kYXRlVG9VVEMoZGF0ZS5kYXRhc2V0Lmh1bWFuZGF0ZSk7XG4gICAgcmV0dXJuIG9iajtcbiAgfVxuICBmdW5jdGlvbiBodW1hbmRhdGVUb1VUQyAoaHVtYW5kYXRlKSB7XG4gICAgbGV0IGludHMgPSBodW1hbmRhdGUuc3BsaXQoJy0nKTtcbiAgICBpbnRzID0gaW50cy5tYXAoKGludCkgPT4gcGFyc2VJbnQoaW50KSk7XG4gICAgaW50c1sxXSA9IGludHNbMV0gLSAxO1xuICAgIHJldHVybiBEYXRlLlVUQyhpbnRzWzBdLCBpbnRzWzFdLCBpbnRzWzJdKTtcbiAgfVxufVxuXG5leHBvcnQgeyBTd2lmdENhbCB9O1xuIiwiaW1wb3J0IHsgbGFuZ3VhZ2VzIH0gZnJvbSAnLi9sYW5ndWFnZXMuanMnO1xuXG4vKipcbiAqIEdlbmVyYXRlcyBhIHRpbWUgY2hvb3NlciBtb2RhbCBmb3Igc2VsZWN0aW5nIHRpbWUuIENhbGxlZCBpbiBjYWxlbmRhckdlbmVyYXRvci5qc1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcgLSBUaGUgY29uZmlndXJhdGlvbiBvYmplY3QuIFxuICogQHBhcmFtIHtPYmplY3R9IGR5bmFtaWNEYXRhIC0gVGhlIGR5bmFtaWMgZGF0YSBvYmplY3QuXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBjYWxlbmRhciAtIFRoZSBjYWxlbmRhciBlbGVtZW50LlxuICogQHJldHVybiB7RnVuY3Rpb259IFRoZSBnZW5lcmF0ZWQgdGltZSBjaG9vc2VyIG1vZGFsLlxuICovXG5mdW5jdGlvbiBHZW5lcmF0ZVRpbWVDaG9vc2VyTW9kYWwgKGNvbmZpZywgZHluYW1pY0RhdGEsIGNhbGVuZGFyKSB7XG5cbiAgLyoqXG4gICAqIEEgY3VzdG9tIGV2ZW50IGVtaXR0ZWQgd2hlbiBhIHRpbWUgaXMgYWRkZWQgb3Igc2VsZWN0ZWRcbiAgICpcbiAgICogQHJldHVybiB7dm9pZH0gVGhpcyBmdW5jdGlvbiBkb2VzIG5vdCByZXR1cm4gYW55IHZhbHVlLlxuICAgKi9cbiAgZnVuY3Rpb24gZW1pdFRpbWVTZWxlY3RlZEV2ZW50ICgpIHtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGNvbnN0IGV2dCA9IG5ldyBDdXN0b21FdmVudCgndGltZVNlbGVjdCcsIHsgZGF0YTogZHluYW1pY0RhdGEgfSk7XG4gICAgICBjb25maWcuY2FsZW5kYXJDb250YWluZXIuZGlzcGF0Y2hFdmVudChldnQpO1xuICAgIH0sIDI1MClcbiAgfVxuXG4gIGxldCB0aW1lQ2hvb3Nlck1vZGFsO1xuXG4gIGxldCBzZWxlY3Rpb24gPSBbXTtcblxuICB0aGlzLmdldFNlbGVjdGVkVGltZXMgPSAoKSA9PiB7XG4gICAgcmV0dXJuIHNlbGVjdGlvbjtcbiAgfVxuICBcbiAgdGhpcy5nZW5lcmF0ZU1vZGFsID0gKCkgPT4ge1xuICAgIHJldHVybiBnZW5lcmF0ZU1vZGFsKCk7XG4gIH1cblxuICB0aGlzLnNob3cgPSAoKSA9PiB7XG4gICAgY2FsZW5kYXIuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJztcbiAgICByZXR1cm4gdGltZUNob29zZXJNb2RhbC5zaG93KCk7XG4gIH1cblxuICB0aGlzLndyaXRlVG9EYXRlRGl2ID0gICgpID0+IHtcbiAgICB3cml0ZVRvRGF0ZURpdigpO1xuICB9XG5cbiAgdGhpcy53cml0ZVRvRHluYW1pY0RhdGEgPSAoKSA9PiB7XG4gICAgd3JpdGVUb0R5bmFtaWNEYXRhKCk7XG4gIH07XG5cbi8qKlxuICogR2VuZXJhdGVzIGEgZGlhbG9nIGZvciBjaG9vc2luZyB0aW1lLlxuICpcbiAqIEByZXR1cm4ge1Byb21pc2V9IEEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIHRoZSBnZW5lcmF0ZWQgdGltZSBjaG9vc2VyIG1vZGFsLlxuICovXG4gIGZ1bmN0aW9uIGdlbmVyYXRlTW9kYWwoKSB7XG4gICAgY29uc3QgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblxuICAgICAgdGltZUNob29zZXJNb2RhbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpYWxvZycpO1xuICAgICAgdGltZUNob29zZXJNb2RhbC5jbGFzc0xpc3QuYWRkKCd0aW1lQ2hvb3Nlck1vZGFsJyk7XG4gICAgICBjYWxlbmRhci5hcHBlbmRDaGlsZCh0aW1lQ2hvb3Nlck1vZGFsKTtcbiAgXG4gICAgICBjb25zdCB0aW1lQ29udCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgdGltZUNvbnQuY2xhc3NMaXN0LmFkZCgndGltZUNvbnQnKTtcbiAgICAgIHRpbWVDaG9vc2VyTW9kYWwuYXBwZW5kQ2hpbGQodGltZUNvbnQpO1xuICBcbiAgICAgIGNvbnN0IHRpbWVDaG9vc2VyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICB0aW1lQ2hvb3Nlci5jbGFzc0xpc3QuYWRkKCd0aW1lQ2hvb3NlcicpO1xuICAgICAgdGltZUNvbnQuYXBwZW5kQ2hpbGQodGltZUNob29zZXIpO1xuICBcbiAgICAgIGNvbnN0IGNvbnRyb2xzRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBjb250cm9sc0Rpdi5jbGFzc0xpc3QuYWRkKCdkZWxldGVEaXYnKTtcbiAgICAgIHRpbWVDaG9vc2VyLmFwcGVuZENoaWxkKGNvbnRyb2xzRGl2KTtcbiAgXG4gICAgICBmdW5jdGlvbiBjbG9zZUZuICgpIHtcbiAgICAgICAgY2FsZW5kYXIuc3R5bGUub3ZlcmZsb3cgPSAnc2Nyb2xsJztcbiAgICAgICAgdGltZUNob29zZXJNb2RhbC5jbG9zZSgpO1xuICAgICAgfVxuICAgICAgbWFrZUJ1dHRvbihjb250cm9sc0RpdiwgJ2RlbGV0ZUJ1dHRvbicsICd4JywgJ2Nsb3NlJywgJ2NsaWNrJywgY2xvc2VGbik7XG4gIFxuICAgICAgZnVuY3Rpb24gaW5uZXJDb21wb25lbnRzICgpIHtcbiAgICAgICAgY29uc3QgdGltZVBpY2tlckNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICB0aW1lUGlja2VyQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ3RpbWVQaWNrZXJDb250YWluZXInKTtcbiAgICAgICAgdGltZUNob29zZXIuYXBwZW5kQ2hpbGQodGltZVBpY2tlckNvbnRhaW5lcik7XG4gICAgICAgIGNvbnN0IHRpdGxlRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIHRpdGxlRGl2LnRleHRDb250ZW50ID0gbGFuZ3VhZ2VzW2NvbmZpZy5sYW5ndWFnZV0udGltZVdpZGdldC5hZGRUaW1lO1xuICAgICAgICB0aXRsZURpdi5jbGFzc0xpc3QuYWRkKCdkZWxldGVEaXYnKTtcbiAgICAgICAgdGltZVBpY2tlckNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aXRsZURpdik7XG4gICAgICAgIG1ha2VEcm9wRG93bnMobGFuZ3VhZ2VzW2NvbmZpZy5sYW5ndWFnZV0udGltZVdpZGdldC5zdGFydCwgdGltZVBpY2tlckNvbnRhaW5lcik7XG4gICAgICAgIG1ha2VEcm9wRG93bnMobGFuZ3VhZ2VzW2NvbmZpZy5sYW5ndWFnZV0udGltZVdpZGdldC5lbmQsIHRpbWVQaWNrZXJDb250YWluZXIpO1xuICAgICAgfVxuICAgICAgbWFrZUJ1dHRvbihjb250cm9sc0RpdiwgJ2RlbGV0ZUJ1dHRvbicsICcrJywgJ2FkZCB0aW1lJywgJ2NsaWNrJywgaW5uZXJDb21wb25lbnRzKTtcbiAgICAgIG1ha2VCdXR0b24oY29udHJvbHNEaXYsICdkZWxldGVCdXR0b24nLCAnLScsICdyZW1vdmUgdGltZScsICdjbGljaycsIHJlbW92ZVRpbWVWYWx1ZXNPbkRhdGUpO1xuICAgICAgcmVzb2x2ZSh0aW1lQ2hvb3Nlck1vZGFsKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHdyaXRlVG9EYXRlRGl2ICgpIHtcbiAgICBpZiAoY29uZmlnLmRpc3BsYXlUaW1lU2VsZWN0aW9uT25EYXRlKSB7XG4gICAgICBkeW5hbWljRGF0YS5kYXRlc1NlbGVjdGVkQXJyYXlbZHluYW1pY0RhdGEuZGF0ZXNTZWxlY3RlZEFycmF5Lmxlbmd0aC0xXS5mb3JFYWNoKChkYXlTZWxlY3RlZCkgPT4ge1xuICAgICAgICB3cml0ZShkYXlTZWxlY3RlZCk7XG4gICAgICB9KTtcbiAgXG4gICAgICAvLyBjb250YWlucyBhIHRpbWUgZHVyYXRpb24gY2hvaWNlXG4gICAgICBsZXQgY2FsZW5kYXJUaW1lUGFyZW50O1xuICBcbiAgICAgIGZ1bmN0aW9uIHdyaXRlIChkYXRlKSB7XG4gICAgICAgIGNvbnN0IGRheURpdiA9IGNhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLWh1bWFuZGF0ZT0nJHtkYXRlfSddYCk7XG4gICAgICAgIHdoaWxlIChkYXlEaXYuY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGRheURpdi5yZW1vdmVDaGlsZChkYXlEaXYubGFzdENoaWxkKTtcbiAgICAgICAgfVxuICBcbiAgICAgICAgZnVuY3Rpb24gY3JlYXRlTmV3UGFyYSAodGV4dCkge1xuICAgICAgICAgIGNvbnN0IHRpbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgICAgICAgY2FsZW5kYXJUaW1lUGFyZW50LmFwcGVuZENoaWxkKHRpbWUpO1xuICAgICAgICAgIHRpbWUuY2xhc3NMaXN0LmFkZCgnY2FsZW5kYXJUaW1lJyk7XG4gICAgICAgICAgdGltZS50ZXh0Q29udGVudCA9IHRleHQ7XG4gICAgICAgIH1cbiAgXG4gICAgICAgIHNlbGVjdGlvbi5mb3JFYWNoKCh0aW1lVmFsdWUsIGkpID0+IHtcbiAgICAgICAgICBpZiAoaSA9PT0gMCB8fCBpICUgMiA9PT0gMCkge1xuICAgICAgICAgICAgY2FsZW5kYXJUaW1lUGFyZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBjYWxlbmRhclRpbWVQYXJlbnQuY2xhc3NMaXN0LmFkZCgnY2FsZW5kYXJUaW1lUGFyZW50Jyk7XG4gICAgICAgICAgICBkYXlEaXYuYXBwZW5kQ2hpbGQoY2FsZW5kYXJUaW1lUGFyZW50KTtcbiAgICAgICAgICB9XG4gIFxuICAgICAgICAgIGNvbnN0IGZpZWxkTmFtZSA9IE9iamVjdC5rZXlzKHRpbWVWYWx1ZSlbMF07XG4gICAgICAgICAgY3JlYXRlTmV3UGFyYShgJHtmaWVsZE5hbWV9OmApO1xuICAgICAgICAgIGNyZWF0ZU5ld1BhcmEoYCR7dGltZVZhbHVlW2ZpZWxkTmFtZV0uaGh9OiR7dGltZVZhbHVlW2ZpZWxkTmFtZV0ubW19YCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIG1ha2VCdXR0b24gKHBhcmVudCwgY2xhc3NOYW1lLCB0ZXh0Q29udGVudCwgaG92ZXJUZXh0LCBhY3Rpb24sIGZuKSB7XG4gICAgY29uc3QgYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcbiAgICBidXR0b24udGV4dENvbnRlbnQgPSB0ZXh0Q29udGVudDtcbiAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcihhY3Rpb24sIChlKSA9PiB7XG4gICAgICBmbigpO1xuICAgIH0pO1xuICAgIHBhcmVudC5hcHBlbmRDaGlsZChidXR0b24pO1xuICB9XG4gIFxuICBmdW5jdGlvbiBtYWtlRHJvcERvd25zIChjb250ZXh0VGV4dCwgdGltZVBpY2tlckNvbnRhaW5lcikge1xuICAgIC8vIFRoZSB0aW1lIGNvbnRhaW5lclxuICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCd0aW1lQ29udGFpbmVyJyk7XG4gICAgY29udGFpbmVyLmRhdGFzZXQuY29udGV4dCA9IGNvbnRleHRUZXh0O1xuICAgIHRpbWVQaWNrZXJDb250YWluZXIuYXBwZW5kQ2hpbGQoY29udGFpbmVyKTtcbiAgXG4gICAgY29uc3QgdGltZUZvckNvbnRleHQgPSB7IFtjb250ZXh0VGV4dF06IHt9IH07XG5cbiAgICBzZWxlY3Rpb24ucHVzaCh0aW1lRm9yQ29udGV4dCk7XG4gIFxuICAgIC8vIE1ha2UgbGFiZWxcbiAgICBjb25zdCBsYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICBsYWJlbC5jbGFzc0xpc3QuYWRkKCd0aW1lU2VsZWN0UCcpO1xuICAgIGxhYmVsLnRleHRDb250ZW50ID0gYCR7Y29udGV4dFRleHR9OmA7XG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGxhYmVsKTtcbiAgXG4gICAgLy8gTWFrZSBob3VyIHNlbGVjdG9yXG4gICAgY29uc3QgdGltZVNlbGVjdG9yRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdGltZVNlbGVjdG9yRGl2LmRhdGFzZXQuY29udGV4dCA9IGNvbnRleHRUZXh0O1xuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aW1lU2VsZWN0b3JEaXYpO1xuICBcbiAgICBtYWtlU2VsZWN0b3IoJ2hoJywgMjMsIHRpbWVTZWxlY3RvckRpdiwgY29udGV4dFRleHQsIHRpbWVQaWNrZXJDb250YWluZXIsIHRpbWVGb3JDb250ZXh0KTtcbiAgICBtYWtlU2VsZWN0b3IoJ21tJywgNTksIHRpbWVTZWxlY3RvckRpdiwgY29udGV4dFRleHQsIHRpbWVQaWNrZXJDb250YWluZXIsIHRpbWVGb3JDb250ZXh0KTtcbiAgfVxuICBcbiAgZnVuY3Rpb24gbWFrZVNlbGVjdG9yICh0eXBlLCBsaW1pdCwgdGltZVNlbGVjdG9yRGl2LCBjb250ZXh0VGV4dCwgdGltZVBpY2tlckNvbnRhaW5lciwgdGltZUZvckNvbnRleHQpIHtcbiAgICBjb25zdCBkcm9wRG93biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NlbGVjdCcpO1xuICAgIGRyb3BEb3duLmNsYXNzTGlzdC5hZGQodHlwZSwgJ3RpbWVTZWxlY3QnKTtcbiAgICB0aW1lU2VsZWN0b3JEaXYuYXBwZW5kQ2hpbGQoZHJvcERvd24pO1xuICBcbiAgICBkcm9wRG93bi5kYXRhc2V0LnR5cGUgPSB0eXBlO1xuICAgIGRyb3BEb3duLmRhdGFzZXQuY29udGV4dCA9IGNvbnRleHRUZXh0O1xuICBcbiAgICBjb25zdCBwbGFjZWhvbGRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuICAgIHBsYWNlaG9sZGVyLnRleHRDb250ZW50ID0gdHlwZTtcbiAgICBwbGFjZWhvbGRlci52YWx1ZSA9ICcwMCc7XG4gIFxuICAgIC8vIHtcIlN0YXJ0XCI6e1wiaGhcIjpcIjAwXCJ9fSx7XCJTdGFydFwiOntcIm1tXCI6XCIwMFwifX1cbiAgICB0aW1lRm9yQ29udGV4dFtjb250ZXh0VGV4dF1bdHlwZV0gPSBwbGFjZWhvbGRlci52YWx1ZTtcbiAgICBkcm9wRG93bi5hcHBlbmRDaGlsZChwbGFjZWhvbGRlcik7XG4gIFxuICAgIGxldCBpID0gMDtcbiAgICB3aGlsZSAoaSA8PSBsaW1pdCkge1xuICAgICAgY29uc3QgaG91ciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuICAgICAgbGV0IHRleHQgPSBpLnRvU3RyaW5nKCk7XG4gICAgICBpZiAodGV4dC5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgdGV4dCA9IGAwJHtpfWA7XG4gICAgICB9XG4gICAgICBob3VyLnZhbHVlID0gdGV4dDtcbiAgICAgIGhvdXIudGV4dENvbnRlbnQgPSB0ZXh0O1xuICAgICAgZHJvcERvd24uYXBwZW5kQ2hpbGQoaG91cik7XG4gICAgICBpKys7XG4gICAgfVxuICBcbiAgICBkcm9wRG93bi5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoc2VsZWN0ZWQpID0+IHtcbiAgICAgIHRpbWVGb3JDb250ZXh0W2NvbnRleHRUZXh0XVt0eXBlXSA9IGRyb3BEb3duLnZhbHVlO1xuICAgICAgd3JpdGVUb0R5bmFtaWNEYXRhKCk7XG4gICAgICB3cml0ZVRvRGF0ZURpdigpO1xuICAgICAgZW1pdFRpbWVTZWxlY3RlZEV2ZW50KCk7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiB3cml0ZVRvRHluYW1pY0RhdGEgKCkge1xuICAgIGR5bmFtaWNEYXRhLmRhdGVzU2VsZWN0ZWRBcnJheU9iamVjdHNbZHluYW1pY0RhdGEuZGF0ZXNTZWxlY3RlZEFycmF5T2JqZWN0cy5sZW5ndGgtMV0uZm9yRWFjaCgoZGF5U2VsZWN0ZWQpID0+IHtcbiAgICAgIGNvbnN0IHRpbWVzID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShzZWxlY3Rpb24pKTtcbiAgICAgIGRheVNlbGVjdGVkLnRpbWVzID0gdGltZXM7XG4gICAgICBjb25zdCBuYW1lcyA9IE9iamVjdC5rZXlzKHRpbWVzKTtcbiAgICAgIE9iamVjdC52YWx1ZXModGltZXMpLmZvckVhY2goKHRpbWUsIGkpID0+IHtcbiAgICAgICAgbGV0IHZhbCA9IE9iamVjdC52YWx1ZXModGltZSk7XG4gICAgICAgIGxldCBoaG1tc3MgPSBPYmplY3QudmFsdWVzKHZhbFswXSk7XG4gICAgICAgIGRheVNlbGVjdGVkLnRpbWVzW25hbWVzW2ldXS5VVEMgPSBodW1hbmRhdGVUb1VUQyhkYXlTZWxlY3RlZC5odW1hbmRhdGUsIGhobW1zcyk7XG4gICAgICB9KVxuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gaHVtYW5kYXRlVG9VVEMgKGh1bWFuZGF0ZSwgdGltZSkge1xuICAgIGNvbnN0IGhoID0gKHRpbWVbMF0pID8gdGltZVswXSA6IDA7XG4gICAgY29uc3QgbW0gPSAodGltZVsxXSkgPyB0aW1lWzFdIDogMDtcbiAgICBjb25zdCBzcyA9ICh0aW1lWzJdKSA/IHRpbWVbMl0gOiAwO1xuXG4gICAgbGV0IGludHMgPSBodW1hbmRhdGUuc3BsaXQoJy0nKTtcbiAgICBpbnRzID0gaW50cy5tYXAoKGludCkgPT4gcGFyc2VJbnQoaW50KSk7XG4gICAgaW50c1sxXSA9IGludHNbMV0gLSAxO1xuICAgIHJldHVybiBEYXRlLlVUQyhpbnRzWzBdLCBpbnRzWzFdLCBpbnRzWzJdLCBoaCwgbW0sIHNzKTtcbiAgfVxuICBcbiAgZnVuY3Rpb24gcmVtb3ZlVGltZVZhbHVlc09uRGF0ZSAoKSB7XG4gICAgY29uc3QgZCA9IGR5bmFtaWNEYXRhLmRhdGVzU2VsZWN0ZWRBcnJheU9iamVjdHM7XG4gICAgY29uc3QgbGFzdENob2ljZSA9IGRbZC5sZW5ndGggLSAxXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxhc3RDaG9pY2UubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGRhdGVPYmogPSBsYXN0Q2hvaWNlW2ldO1xuICAgICAgY29uc3QgZGF5RGl2ID0gY2FsZW5kYXIucXVlcnlTZWxlY3RvcihgW2RhdGEtaHVtYW5kYXRlPScke2RhdGVPYmouaHVtYW5kYXRlfSddYCk7XG4gICAgICBkYXlEaXYucmVtb3ZlQ2hpbGQoZGF5RGl2Lmxhc3RDaGlsZCk7XG4gICAgICBkYXRlT2JqLnRpbWVzID0gZGF0ZU9iai50aW1lcy5zbGljZSgwLCAtMik7XG4gICAgfVxuICAgIHNlbGVjdGlvbiA9IHNlbGVjdGlvbi5zbGljZSgwLCAtMik7XG4gICAgY29uc3QgdGltZUNob29zZXIgPSBjYWxlbmRhci5xdWVyeVNlbGVjdG9yKCcudGltZUNob29zZXInKTtcbiAgICB0aW1lQ2hvb3Nlci5yZW1vdmVDaGlsZCh0aW1lQ2hvb3Nlci5sYXN0Q2hpbGQpO1xuICB9XG59XG5cbmV4cG9ydCB7IEdlbmVyYXRlVGltZUNob29zZXJNb2RhbCB9O1xuIiwiLyogTGFuZ3VhZ2UgZGVmYXVsdHMgKi9cbmNvbnN0IGVuR2IgPSB7XG4gIGdlbmVyYWxUaW1lOiB7XG4gICAgbW9udGhzOiBbJ0phbnVhcnknLCAnRmVicnVhcnknLCAnTWFyY2gnLCAnQXByaWwnLCAnTWF5JywgJ0p1bmUnLCAnSnVseScsICdBdWd1c3QnLCAnU2VwdGVtYmVyJywgJ09jdG9iZXInLCAnTm92ZW1iZXInLCAnRGVjZW1iZXInXSxcbiAgICBkYXlzSW5GdWxsOiBbJ1N1bmRheScsICdNb25kYXknLCAnVHVlc2RheScsICdXZWRuZXNkYXknLCAnVGh1cnNkYXknLCAnRnJpZGF5JywgJ1NhdHVyZGF5J10sXG4gICAgZGF5c1RydW5jYXRlZDogWydTdW4nLCAnTW9uJywgJ1R1ZScsICdXZWQnLCAnVGh1JywgJ0ZyaScsICdTYXQnXVxuICB9LFxuICBmb3JtYXREYXlUZXh0OiB7XG4gICAgdGV4dEJlZm9yZTogJ1NldCB0aGVzZSB0aW1lcyBmb3IgYWxsJyxcbiAgICB0ZXh0QWZ0ZXI6ICcnXG4gIH0sXG4gIHRpbWVXaWRnZXQ6IHtcbiAgICBhZGRUaW1lOiAnQWRkIHRpbWU6JyxcbiAgICBzdGFydDogJ1N0YXJ0JyxcbiAgICBlbmQ6ICdFbmQnXG4gIH1cbn07XG5cbi8qIExhbmd1YWdlIGRlZmF1bHRzICovXG5jb25zdCBwdFB0ID0ge1xuICBnZW5lcmFsVGltZToge1xuICAgIG1vbnRoczogWydKYW5laXJvJywgJ0ZldmVyZWlybycsICdNYXLDp28nLCAnQWJyaWwnLCAnTWFpbycsICdKdW5obycsICdKdWxobycsICdBZ29zdG8nLCAnU2V0ZW1icm8nLCAnT3V0dWJybycsICdOb3ZlbWJybycsICdEZXplbWJybyddLFxuICAgIGRheXNJbkZ1bGw6IFsnRG9taW5nbycsICdTZWd1bmRhLUZlaXJhJywgJ1RlcsOnYS1GZWlyYScsICdRdWFydGEtRmVpcmEnLCAnUXVpbnRhLUZlaXJhJywgJ1NleHRhLUZlaXJhJywgJ1PDoWJhZG8nXSxcbiAgICBkYXlzVHJ1bmNhdGVkOiBbJ0RvbScsICdTZWcnLCAnVGVyJywgJ1F1YScsICdRdWknLCAnU2V4JywgJ1NhYiddXG4gIH0sXG4gIGZvcm1hdERheVRleHQ6IHtcbiAgICB0ZXh0QmVmb3JlOiAnQXBwbGlxdWUgZXN0YXMgaG9yYXMgYSB0b2RvcycsXG4gICAgdGV4dEFmdGVyOiAnJ1xuICB9LFxuICB0aW1lV2lkZ2V0OiB7XG4gICAgYWRkVGltZTogYEFkaWNpb25lIGR1cmHDp8OjbzpgLFxuICAgIHN0YXJ0OmBJbsOtY2lvYCxcbiAgICBlbmQ6ICdGaW0nXG4gIH1cblxufTtcblxuY29uc3QgbGFuZ3VhZ2VzID0geyBlbkdiLCBwdFB0IH07XG5cbmV4cG9ydCB7IGxhbmd1YWdlcyB9O1xuIiwiY29uc3QgY29sb3VycyA9IHtcbiAgbW9udGhDb2xvcjogJyNmYzMnLFxuICBtb250aEJhY2tnb3VuZEJvbG9yOiAnIzY3OTljYicsXG4gIGRheU5hbWVDb2xvcjogJyMwMDAnLFxuICBkYXlOYW1lQmFja2dyb3VuZENvbG9yOiAnI2NjYycsXG4gIGRheUNvbG9yOiAnIzAwMCcsXG4gIGRheUJhY2tncm91bmRDb2xvcjogJyNmZmYnLFxuICBtb250aEJvcmRlckNvbG9yOiAnI2YxNTkyNSdcbn07XG5cbmNvbnN0IHNlbGVjdGVkU3R5bGUgPSAoZGl2KSA9PiB7XG4gIGRpdi5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBjb2xvdXJzLm1vbnRoQ29sb3I7XG59O1xuXG5jb25zdCB1bnNlbGVjdGVkU3R5bGUgPSAoZGl2KSA9PiB7XG4gIGRpdi5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBjb2xvdXJzLmRheUJhY2tncm91bmRDb2xvcjtcbn07XG5cbmV4cG9ydCB7IHNlbGVjdGVkU3R5bGUsIHVuc2VsZWN0ZWRTdHlsZSwgY29sb3VycyB9O1xuIl19
