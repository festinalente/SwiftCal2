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
  console.log(dynamicData);
  var datesObjStore = dynamicData.datesSelectedArrayObjects;
  var datesIndex = dynamicData.datesSelectedArray;
  var _loop = function _loop(i) {
    var _loop2 = function _loop2(j) {
      console.log(datesIndex[j]);
      datesIndex[j].forEach(function (date) {
        console.log(date);
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
var css = ".calendar {\n  display: flex;\n  flex-wrap: wrap;\n  flex-direction: row;\n  background-color: rgba(240, 248, 255, 0);\n  width: 100%;\n  height: 28.8em;\n  overflow-y: auto;\n  position: relative;\n}\n.calendar .blocked {\n  background-color: #333;\n}\n.calendar .filler {\n  pointer-events: none;\n  opacity: 0.3;\n}\n.calendar .timeSelect {\n  padding: 0;\n  width: auto;\n  margin: 0;\n  background-color: #fff;\n  float: right;\n  font-weight: 700;\n  font-family: Arial, Helvetica, sans-serif;\n  border-style: solid;\n  border-radius: 1em;\n  text-align: center;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  border-width: 3px;\n  border-color: #f15925;\n  color: #000;\n  font-size: 0.9em;\n}\n.calendar .timeCont {\n  margin-left: auto;\n  width: 10em;\n  background-color: aliceblue;\n  border-style: solid;\n  border-color: #f15925;\n  margin-right: auto;\n  margin-top: 10em;\n}\n.calendar .dayblockrow {\n  display: flex;\n  flex-direction: row;\n  min-width: 100%;\n  background-color: aliceblue;\n}\n.calendar .calendarTimeParent {\n  margin: 0.1em;\n}\n.calendar .calendarTimeParent .calendarTime {\n  font-size: 0.9em;\n  margin-top: 0em;\n  line-height: 1;\n  background-color: aliceblue;\n  color: black;\n  text-align: center;\n  margin: 0px;\n}\n.calendar .widthShapeDays {\n  width: 14.2857142857%;\n  margin-left: auto;\n  margin-right: auto;\n  text-align: center;\n}\n.calendar .widthShape {\n  width: 14.2857142857%;\n  margin-left: auto;\n  margin-right: auto;\n  text-align: center;\n  min-height: 3.6em;\n  margin-bottom: 0.2em;\n}\n.calendar .monthName {\n  margin: auto;\n  text-align: center;\n  font-family: Ubuntu;\n  font-size: 1.61em;\n  background-color: #337ab7;\n  color: #ffcc33;\n  flex-basis: 100%;\n  border-bottom-style: solid;\n}\n.calendar .weekrow {\n  display: flex;\n  flex-wrap: nowrap;\n  flex-direction: row;\n  background-color: #fff;\n  font-family: \"roboto\", \"arial\";\n}\n.calendar .dayName {\n  color: black;\n  font-family: \"roboto\", \"arial\";\n  font-weight: 600;\n  background-color: #ccc;\n}\n.calendar .month > * {\n  margin-left: 2px;\n  margin-right: 2px;\n}\n.calendar .month {\n  width: 50%;\n  min-width: 300px;\n  margin: auto;\n}\n.calendar .timeChooser {\n  width: 10em;\n  position: static;\n  background-color: aliceblue;\n  margin-left: auto;\n  margin-right: auto;\n}\n.calendar .timeContainer {\n  display: flex;\n}\n.calendar .timeChooserModal {\n  z-index: 1;\n  width: 100%;\n  height: 100%;\n  background-color: rgba(0, 0, 0, 0.4);\n  position: absolute;\n  margin: 0;\n  padding: 0;\n  border: 0;\n}\n.calendar .calendarLabel {\n  min-width: 3em;\n  padding: 0em 1em 0em 1em;\n  color: black;\n  font-family: \"roboto\", \"arial\";\n  font-weight: 600;\n  background-color: #ccc;\n  margin: 1em 0 1em 0;\n}\n.calendar .deleteDiv {\n  font-family: Ubuntu;\n  font-size: 1.61em;\n  background-color: #337ab7;\n  color: #ffcc33;\n  border-bottom-style: solid;\n  height: 2em;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.calendar .deleteButton {\n  background-color: white;\n  color: #f15925;\n  float: right;\n  font-weight: 700;\n  font-family: Arial, Helvetica, sans-serif;\n  border-style: solid;\n  border-radius: 1em;\n  text-align: center;\n  height: 30px;\n  width: 30px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.calendar .innerSpanDeleteBtn {\n  text-align: center;\n}\n.calendar .deleteButton:hover,\n.calendar .deleteButton:focus,\n.calendar .timeSelect:hover,\n.calendar .timeSelect:focus {\n  color: #000;\n  text-decoration: none;\n  cursor: pointer;\n}\n.calendar .hour {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 10em;\n}\n.calendar .timeSelectP {\n  display: inline;\n  width: 5em;\n  color: #000;\n}\n.calendar .timeChooser > input[type=checkbox] {\n  outline: #f15925;\n  outline-style: solid;\n}\n.calendar .timeSelect > option {\n  color: #000;\n}\n.calendar .calendar > p,\n.calendar h4,\n.calendar h3,\n.calendar h2,\n.calendar h1,\n.calendar select,\n.calendar option {\n  color: #000;\n}\n.calendar .arrow-up {\n  width: 0;\n  height: 0;\n  border-left: 10px solid transparent;\n  border-right: 10px solid transparent;\n  border-bottom: 10px solid black;\n}\n.calendar .arrow-down {\n  width: 0;\n  height: 0;\n  border-left: 10px solid transparent;\n  border-right: 10px solid transparent;\n  border-top: 10px solid #000;\n}\n.calendar .arrows {\n  float: right;\n  clear: right;\n  position: relative;\n  cursor: pointer;\n  flex-direction: column;\n}\n.calendar .arrow-right {\n  width: 0;\n  height: 0;\n  border-top: 60px solid transparent;\n  border-bottom: 60px solid transparent;\n  border-left: 60px solid green;\n}\n.calendar .arrow-left {\n  width: 0;\n  height: 0;\n  border-top: 10px solid transparent;\n  border-bottom: 10px solid transparent;\n  border-right: 10px solid blue;\n}\n.calendar .dayTime {\n  cursor: pointer;\n}\n.calendar .dayTime > * {\n  pointer-events: none;\n}\n"; (require("browserify-css").createStyle(css, { "href": "preBundlingJS/calendarApp.css" }, { "insertAt": "bottom" })); module.exports = css;
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
      console.log(st);
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
  var config = {};
  var handler = {
    get: function get(target, key) {
      if (_typeof(target[key]) === 'object' && target[key] !== null) {
        return new Proxy(target[key], handler);
      }
      if (Array.isArray(target) && _typeof(target[0]) === 'object' && Object.keys(target[0]).includes('times')) {
        emitDateSelectedEvent();
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
      console.log(configObj);
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
    // TODO:
    var displayTimeChooserModal = config.displayTimeChooserModal;
    var endUser = config.endUser;
    var endUserDurationChoice = config.endUserDurationChoice;
    var backend = config.backend;
    var displayBlocked = config.displayBlocked;
    var singleDateChoice = config.singleDateChoice;
    var selectRange = config.selectRange;
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
        (0, _displayTimeChooserModal.displayTimeChooserModal)(calendar, config, dynamicData);
      }
      // time picker for multiple consecutive dates.
      if (config.displayTimeChooserModal && startDate !== endDate) {
        (0, _displayTimeChooserModal.displayTimeChooserModal)(calendar, config, dynamicData);
        (0, _displayTimeChooserModal.writeTimesToAll)();
      }
      // time picker fo single date:
      if (config.displayTimeChooserModal && config.singleDateChoice) {
        (0, _displayTimeChooserModal.displayTimeChooserModal)(calendar, config, dynamicData);
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
    return {
      day: date.dataset.day,
      humandate: date.dataset.humandate,
      index: date.dataset.dayindex,
      times: (0, _displayTimeChooserModal.getSelectedTimes)()
    };
  }
}

},{"./basicFunctions.js":2,"./calendarApp.css":3,"./displayTimeChooserModal.js":5,"./languages.js":6,"./styles.js":7}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.displayTimeChooserModal = displayTimeChooserModal;
exports.getSelectedTimes = getSelectedTimes;
exports.writeTimesToAll = writeTimesToAll;
var _languages = require("./languages.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var timeChooserModal, calendar, config, dynamicData;
var selection = [];

/**
 * Creates dialog for selecting specific times
 * @function createTimeElements
 * @param {HTMLElement} calendar - The calendar element
 * @returns {promise} - Empty promise. The actual div is in this code on "timeChooserModal"
 */

function generateTimeChooserModal() {
  var promise = new Promise(function (resolve, reject) {
    if (timeChooserModal) {
      resolve(timeChooserModal);
    }
    timeChooserModal = createModal('timeChooserModal');
    calendar.appendChild(timeChooserModal);
    var timeCont = document.createElement('div');
    timeCont.classList.add('timeCont');
    timeChooserModal.appendChild(timeCont);
    var timeChooser = document.createElement('div');
    timeChooser.classList.add('timeChooser');
    timeCont.appendChild(timeChooser);

    // makeButton(deleteDiv, 'removeTime', '-', 'remove last time', removeTime);
    // makeButton(deleteDiv, 'addTime', '+', 'add a time', 'click', timePickerElements);
    // makeButton(deleteDiv, 'removeTime', '-', 'remove last time', 'click');
    var controlsDiv = document.createElement('div');
    controlsDiv.classList.add('deleteDiv');
    timeChooser.appendChild(controlsDiv);
    function closeFn() {
      timeChooserModal.close();
    }
    makeButton(controlsDiv, 'deleteButton', 'x', 'close', 'click', closeFn);
    function innerComponents() {
      // If the current elements aren't filled:
      /*
      if (calendar.querySelectorAll('.timePickerContainer').length * 2 !== times.values.length) {
        if (swiftmoAlert) {
          swiftmoAlert.setContent('Fill in the current time values before adding another.').toggle();
        } else {
          alert('Fill in the current time values before adding another.');
        }
        return;
      }
      */
      var timePickerContainer = document.createElement('div');
      timePickerContainer.classList.add('timePickerContainer');
      timeChooser.appendChild(timePickerContainer);
      var titleDiv = document.createElement('div');
      titleDiv.textContent = _languages.languages[config.language].timeWidget.addTime;
      titleDiv.classList.add('deleteDiv');
      timePickerContainer.appendChild(titleDiv);
      makeDropDowns(_languages.languages[config.language].timeWidget.start, timePickerContainer);
      makeDropDowns(_languages.languages[config.language].timeWidget.end, timePickerContainer);
      // tickboxes(timePickerContainer);
    }

    makeButton(controlsDiv, 'deleteButton', '+', 'add time', 'click', innerComponents);
    makeButton(controlsDiv, 'deleteButton', '-', 'remove time', 'click', removeTimeValuesOnDate);
    resolve(timeChooserModal);
  });
  return promise;
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
function writeTimesToAll() {
  writeToDateDiv();
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
function getSelectedTimes() {
  return selection;
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS1jc3MvYnJvd3Nlci5qcyIsInByZUJ1bmRsaW5nSlMvYmFzaWNGdW5jdGlvbnMuanMiLCJwcmVCdW5kbGluZ0pTL2NhbGVuZGFyQXBwLmNzcyIsInByZUJ1bmRsaW5nSlMvY2FsZW5kYXJHZW5lcmF0b3IuanMiLCJwcmVCdW5kbGluZ0pTL2Rpc3BsYXlUaW1lQ2hvb3Nlck1vZGFsLmpzIiwicHJlQnVuZGxpbmdKUy9sYW5ndWFnZXMuanMiLCJwcmVCdW5kbGluZ0pTL3N0eWxlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDM0VBLElBQUEsT0FBQSxHQUFBLE9BQUE7QUFDQSxJQUFBLGtCQUFBLEdBQUEsT0FBQTtBQUNBLElBQUEsd0JBQUEsR0FBQSxPQUFBO0FBQXlGLFNBQUEsb0JBQUEsa0JBRHpGLHFKQUFBLG1CQUFBLFlBQUEsb0JBQUEsV0FBQSxDQUFBLFNBQUEsQ0FBQSxFQUFBLENBQUEsT0FBQSxDQUFBLEdBQUEsTUFBQSxDQUFBLFNBQUEsRUFBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLGNBQUEsRUFBQSxDQUFBLEdBQUEsTUFBQSxDQUFBLGNBQUEsY0FBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsSUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsQ0FBQSxLQUFBLEtBQUEsQ0FBQSx3QkFBQSxNQUFBLEdBQUEsTUFBQSxPQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsUUFBQSxrQkFBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLGFBQUEsdUJBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxXQUFBLDhCQUFBLE9BQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBLFdBQUEsTUFBQSxDQUFBLGNBQUEsQ0FBQSxDQUFBLEVBQUEsQ0FBQSxJQUFBLEtBQUEsRUFBQSxDQUFBLEVBQUEsVUFBQSxNQUFBLFlBQUEsTUFBQSxRQUFBLFNBQUEsQ0FBQSxDQUFBLENBQUEsV0FBQSxNQUFBLG1CQUFBLENBQUEsSUFBQSxNQUFBLFlBQUEsT0FBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsV0FBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsZ0JBQUEsS0FBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBLFFBQUEsQ0FBQSxHQUFBLENBQUEsSUFBQSxDQUFBLENBQUEsU0FBQSxZQUFBLFNBQUEsR0FBQSxDQUFBLEdBQUEsU0FBQSxFQUFBLENBQUEsR0FBQSxNQUFBLENBQUEsTUFBQSxDQUFBLENBQUEsQ0FBQSxTQUFBLEdBQUEsQ0FBQSxPQUFBLE9BQUEsQ0FBQSxDQUFBLGdCQUFBLENBQUEsQ0FBQSxDQUFBLGVBQUEsS0FBQSxFQUFBLGdCQUFBLENBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBLE1BQUEsQ0FBQSxhQUFBLFNBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBLG1CQUFBLElBQUEsWUFBQSxHQUFBLEVBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxDQUFBLEVBQUEsQ0FBQSxjQUFBLENBQUEsYUFBQSxJQUFBLFdBQUEsR0FBQSxFQUFBLENBQUEsUUFBQSxDQUFBLENBQUEsSUFBQSxHQUFBLElBQUEsTUFBQSxDQUFBLHFCQUFBLENBQUEscUJBQUEsQ0FBQSxnQkFBQSxDQUFBLGdCQUFBLENBQUEsZ0JBQUEsVUFBQSxjQUFBLGtCQUFBLGNBQUEsMkJBQUEsU0FBQSxDQUFBLE9BQUEsTUFBQSxDQUFBLENBQUEsRUFBQSxDQUFBLHFDQUFBLENBQUEsR0FBQSxNQUFBLENBQUEsY0FBQSxFQUFBLENBQUEsR0FBQSxDQUFBLElBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxNQUFBLFFBQUEsQ0FBQSxJQUFBLENBQUEsS0FBQSxDQUFBLElBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxDQUFBLEVBQUEsQ0FBQSxNQUFBLENBQUEsR0FBQSxDQUFBLE9BQUEsQ0FBQSxHQUFBLDBCQUFBLENBQUEsU0FBQSxHQUFBLFNBQUEsQ0FBQSxTQUFBLEdBQUEsTUFBQSxDQUFBLE1BQUEsQ0FBQSxDQUFBLFlBQUEsc0JBQUEsQ0FBQSxnQ0FBQSxPQUFBLFdBQUEsQ0FBQSxJQUFBLE1BQUEsQ0FBQSxDQUFBLEVBQUEsQ0FBQSxZQUFBLENBQUEsZ0JBQUEsT0FBQSxDQUFBLENBQUEsRUFBQSxDQUFBLHNCQUFBLGNBQUEsQ0FBQSxFQUFBLENBQUEsYUFBQSxPQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsUUFBQSxDQUFBLEdBQUEsUUFBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLEdBQUEsQ0FBQSxFQUFBLENBQUEsbUJBQUEsQ0FBQSxDQUFBLElBQUEsUUFBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLEdBQUEsRUFBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLEtBQUEsU0FBQSxDQUFBLGdCQUFBLE9BQUEsQ0FBQSxDQUFBLEtBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxDQUFBLGVBQUEsQ0FBQSxDQUFBLE9BQUEsQ0FBQSxDQUFBLENBQUEsT0FBQSxFQUFBLElBQUEsV0FBQSxDQUFBLElBQUEsTUFBQSxTQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxnQkFBQSxDQUFBLElBQUEsTUFBQSxVQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxRQUFBLENBQUEsQ0FBQSxPQUFBLENBQUEsQ0FBQSxFQUFBLElBQUEsV0FBQSxDQUFBLElBQUEsQ0FBQSxDQUFBLEtBQUEsR0FBQSxDQUFBLEVBQUEsQ0FBQSxDQUFBLENBQUEsZ0JBQUEsQ0FBQSxXQUFBLE1BQUEsVUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsU0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLEdBQUEsU0FBQSxDQUFBLEVBQUEsQ0FBQSxvQkFBQSxLQUFBLFdBQUEsTUFBQSxDQUFBLEVBQUEsQ0FBQSxhQUFBLDJCQUFBLGVBQUEsQ0FBQSxXQUFBLENBQUEsRUFBQSxDQUFBLElBQUEsTUFBQSxDQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsZ0JBQUEsQ0FBQSxHQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsSUFBQSxDQUFBLDBCQUFBLEVBQUEsMEJBQUEsSUFBQSwwQkFBQSxxQkFBQSxpQkFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsUUFBQSxDQUFBLEdBQUEsQ0FBQSxtQkFBQSxDQUFBLEVBQUEsQ0FBQSxRQUFBLENBQUEsS0FBQSxDQUFBLFlBQUEsS0FBQSxzQ0FBQSxDQUFBLEtBQUEsQ0FBQSxvQkFBQSxDQUFBLFFBQUEsQ0FBQSxXQUFBLEtBQUEsRUFBQSxDQUFBLEVBQUEsSUFBQSxlQUFBLENBQUEsQ0FBQSxNQUFBLEdBQUEsQ0FBQSxFQUFBLENBQUEsQ0FBQSxHQUFBLEdBQUEsQ0FBQSxVQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsUUFBQSxNQUFBLENBQUEsUUFBQSxDQUFBLEdBQUEsbUJBQUEsQ0FBQSxDQUFBLEVBQUEsQ0FBQSxPQUFBLENBQUEsUUFBQSxDQUFBLEtBQUEsQ0FBQSxtQkFBQSxDQUFBLHFCQUFBLENBQUEsQ0FBQSxNQUFBLEVBQUEsQ0FBQSxDQUFBLElBQUEsR0FBQSxDQUFBLENBQUEsS0FBQSxHQUFBLENBQUEsQ0FBQSxHQUFBLHNCQUFBLENBQUEsQ0FBQSxNQUFBLFFBQUEsQ0FBQSxLQUFBLENBQUEsUUFBQSxDQUFBLEdBQUEsQ0FBQSxFQUFBLENBQUEsQ0FBQSxHQUFBLEVBQUEsQ0FBQSxDQUFBLGlCQUFBLENBQUEsQ0FBQSxDQUFBLEdBQUEsdUJBQUEsQ0FBQSxDQUFBLE1BQUEsSUFBQSxDQUFBLENBQUEsTUFBQSxXQUFBLENBQUEsQ0FBQSxHQUFBLEdBQUEsQ0FBQSxHQUFBLENBQUEsTUFBQSxDQUFBLEdBQUEsUUFBQSxDQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxvQkFBQSxDQUFBLENBQUEsSUFBQSxRQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsSUFBQSxHQUFBLENBQUEsR0FBQSxDQUFBLEVBQUEsQ0FBQSxDQUFBLEdBQUEsS0FBQSxDQUFBLHFCQUFBLEtBQUEsRUFBQSxDQUFBLENBQUEsR0FBQSxFQUFBLElBQUEsRUFBQSxDQUFBLENBQUEsSUFBQSxrQkFBQSxDQUFBLENBQUEsSUFBQSxLQUFBLENBQUEsR0FBQSxDQUFBLEVBQUEsQ0FBQSxDQUFBLE1BQUEsWUFBQSxDQUFBLENBQUEsR0FBQSxHQUFBLENBQUEsQ0FBQSxHQUFBLG1CQUFBLG9CQUFBLENBQUEsRUFBQSxDQUFBLFFBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxNQUFBLEVBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxRQUFBLENBQUEsQ0FBQSxPQUFBLENBQUEsS0FBQSxDQUFBLFNBQUEsQ0FBQSxDQUFBLFFBQUEscUJBQUEsQ0FBQSxJQUFBLENBQUEsQ0FBQSxRQUFBLGVBQUEsQ0FBQSxDQUFBLE1BQUEsYUFBQSxDQUFBLENBQUEsR0FBQSxHQUFBLENBQUEsRUFBQSxtQkFBQSxDQUFBLENBQUEsRUFBQSxDQUFBLGVBQUEsQ0FBQSxDQUFBLE1BQUEsa0JBQUEsQ0FBQSxLQUFBLENBQUEsQ0FBQSxNQUFBLFlBQUEsQ0FBQSxDQUFBLEdBQUEsT0FBQSxTQUFBLHVDQUFBLENBQUEsaUJBQUEsQ0FBQSxNQUFBLENBQUEsR0FBQSxRQUFBLENBQUEsQ0FBQSxFQUFBLENBQUEsQ0FBQSxRQUFBLEVBQUEsQ0FBQSxDQUFBLEdBQUEsbUJBQUEsQ0FBQSxDQUFBLElBQUEsU0FBQSxDQUFBLENBQUEsTUFBQSxZQUFBLENBQUEsQ0FBQSxHQUFBLEdBQUEsQ0FBQSxDQUFBLEdBQUEsRUFBQSxDQUFBLENBQUEsUUFBQSxTQUFBLENBQUEsTUFBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLEdBQUEsU0FBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLElBQUEsSUFBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLFVBQUEsSUFBQSxDQUFBLENBQUEsS0FBQSxFQUFBLENBQUEsQ0FBQSxJQUFBLEdBQUEsQ0FBQSxDQUFBLE9BQUEsZUFBQSxDQUFBLENBQUEsTUFBQSxLQUFBLENBQUEsQ0FBQSxNQUFBLFdBQUEsQ0FBQSxDQUFBLEdBQUEsR0FBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLFFBQUEsU0FBQSxDQUFBLElBQUEsQ0FBQSxJQUFBLENBQUEsQ0FBQSxNQUFBLFlBQUEsQ0FBQSxDQUFBLEdBQUEsT0FBQSxTQUFBLHNDQUFBLENBQUEsQ0FBQSxRQUFBLFNBQUEsQ0FBQSxjQUFBLGFBQUEsQ0FBQSxRQUFBLENBQUEsS0FBQSxNQUFBLEVBQUEsQ0FBQSxZQUFBLENBQUEsS0FBQSxDQUFBLENBQUEsUUFBQSxHQUFBLENBQUEsV0FBQSxDQUFBLEtBQUEsQ0FBQSxDQUFBLFVBQUEsR0FBQSxDQUFBLEtBQUEsQ0FBQSxDQUFBLFFBQUEsR0FBQSxDQUFBLFdBQUEsVUFBQSxDQUFBLElBQUEsQ0FBQSxDQUFBLGNBQUEsY0FBQSxDQUFBLFFBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxVQUFBLFFBQUEsQ0FBQSxDQUFBLElBQUEsb0JBQUEsQ0FBQSxDQUFBLEdBQUEsRUFBQSxDQUFBLENBQUEsVUFBQSxHQUFBLENBQUEsYUFBQSxRQUFBLENBQUEsU0FBQSxVQUFBLE1BQUEsTUFBQSxhQUFBLENBQUEsQ0FBQSxPQUFBLENBQUEsWUFBQSxjQUFBLEtBQUEsaUJBQUEsT0FBQSxDQUFBLFFBQUEsQ0FBQSxXQUFBLENBQUEsUUFBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLENBQUEsT0FBQSxDQUFBLFNBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxDQUFBLDRCQUFBLENBQUEsQ0FBQSxJQUFBLFNBQUEsQ0FBQSxPQUFBLEtBQUEsQ0FBQSxDQUFBLENBQUEsTUFBQSxTQUFBLENBQUEsT0FBQSxDQUFBLFlBQUEsS0FBQSxhQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsTUFBQSxPQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsQ0FBQSxFQUFBLENBQUEsVUFBQSxJQUFBLENBQUEsS0FBQSxHQUFBLENBQUEsQ0FBQSxDQUFBLEdBQUEsSUFBQSxDQUFBLElBQUEsT0FBQSxJQUFBLFNBQUEsSUFBQSxDQUFBLEtBQUEsR0FBQSxDQUFBLEVBQUEsSUFBQSxDQUFBLElBQUEsT0FBQSxJQUFBLFlBQUEsQ0FBQSxDQUFBLElBQUEsR0FBQSxDQUFBLGdCQUFBLFNBQUEsQ0FBQSxPQUFBLENBQUEsQ0FBQSxrQ0FBQSxpQkFBQSxDQUFBLFNBQUEsR0FBQSwwQkFBQSxFQUFBLENBQUEsQ0FBQSxDQUFBLG1CQUFBLEtBQUEsRUFBQSwwQkFBQSxFQUFBLFlBQUEsU0FBQSxDQUFBLENBQUEsMEJBQUEsbUJBQUEsS0FBQSxFQUFBLGlCQUFBLEVBQUEsWUFBQSxTQUFBLGlCQUFBLENBQUEsV0FBQSxHQUFBLE1BQUEsQ0FBQSwwQkFBQSxFQUFBLENBQUEsd0JBQUEsQ0FBQSxDQUFBLG1CQUFBLGFBQUEsQ0FBQSxRQUFBLENBQUEsd0JBQUEsQ0FBQSxJQUFBLENBQUEsQ0FBQSxXQUFBLFdBQUEsQ0FBQSxLQUFBLENBQUEsS0FBQSxpQkFBQSw2QkFBQSxDQUFBLENBQUEsV0FBQSxJQUFBLENBQUEsQ0FBQSxJQUFBLE9BQUEsQ0FBQSxDQUFBLElBQUEsYUFBQSxDQUFBLFdBQUEsTUFBQSxDQUFBLGNBQUEsR0FBQSxNQUFBLENBQUEsY0FBQSxDQUFBLENBQUEsRUFBQSwwQkFBQSxLQUFBLENBQUEsQ0FBQSxTQUFBLEdBQUEsMEJBQUEsRUFBQSxNQUFBLENBQUEsQ0FBQSxFQUFBLENBQUEseUJBQUEsQ0FBQSxDQUFBLFNBQUEsR0FBQSxNQUFBLENBQUEsTUFBQSxDQUFBLENBQUEsR0FBQSxDQUFBLEtBQUEsQ0FBQSxDQUFBLEtBQUEsYUFBQSxDQUFBLGFBQUEsT0FBQSxFQUFBLENBQUEsT0FBQSxxQkFBQSxDQUFBLGFBQUEsQ0FBQSxTQUFBLEdBQUEsTUFBQSxDQUFBLGFBQUEsQ0FBQSxTQUFBLEVBQUEsQ0FBQSxpQ0FBQSxDQUFBLENBQUEsYUFBQSxHQUFBLGFBQUEsRUFBQSxDQUFBLENBQUEsS0FBQSxhQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBLGVBQUEsQ0FBQSxLQUFBLENBQUEsR0FBQSxPQUFBLE9BQUEsQ0FBQSxPQUFBLGFBQUEsQ0FBQSxJQUFBLENBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxHQUFBLENBQUEsVUFBQSxDQUFBLENBQUEsbUJBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxJQUFBLEdBQUEsSUFBQSxXQUFBLENBQUEsV0FBQSxDQUFBLENBQUEsSUFBQSxHQUFBLENBQUEsQ0FBQSxLQUFBLEdBQUEsQ0FBQSxDQUFBLElBQUEsV0FBQSxxQkFBQSxDQUFBLENBQUEsR0FBQSxNQUFBLENBQUEsQ0FBQSxFQUFBLENBQUEsZ0JBQUEsTUFBQSxDQUFBLENBQUEsRUFBQSxDQUFBLGlDQUFBLE1BQUEsQ0FBQSxDQUFBLDZEQUFBLENBQUEsQ0FBQSxJQUFBLGFBQUEsQ0FBQSxRQUFBLENBQUEsR0FBQSxNQUFBLENBQUEsQ0FBQSxHQUFBLENBQUEsZ0JBQUEsQ0FBQSxJQUFBLENBQUEsRUFBQSxDQUFBLENBQUEsSUFBQSxDQUFBLENBQUEsVUFBQSxDQUFBLENBQUEsT0FBQSxhQUFBLEtBQUEsV0FBQSxDQUFBLENBQUEsTUFBQSxTQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsR0FBQSxRQUFBLENBQUEsSUFBQSxDQUFBLFNBQUEsSUFBQSxDQUFBLEtBQUEsR0FBQSxDQUFBLEVBQUEsSUFBQSxDQUFBLElBQUEsT0FBQSxJQUFBLFdBQUEsSUFBQSxDQUFBLElBQUEsT0FBQSxJQUFBLFFBQUEsQ0FBQSxDQUFBLE1BQUEsR0FBQSxNQUFBLEVBQUEsT0FBQSxDQUFBLFNBQUEsS0FBQSxXQUFBLEVBQUEsT0FBQSxFQUFBLEtBQUEsV0FBQSxNQUFBLENBQUEsYUFBQSxJQUFBLFdBQUEsSUFBQSxXQUFBLElBQUEsUUFBQSxLQUFBLEdBQUEsQ0FBQSxPQUFBLElBQUEsWUFBQSxRQUFBLGNBQUEsTUFBQSxnQkFBQSxHQUFBLEdBQUEsQ0FBQSxPQUFBLFVBQUEsQ0FBQSxPQUFBLENBQUEsYUFBQSxJQUFBLENBQUEsV0FBQSxDQUFBLGtCQUFBLENBQUEsQ0FBQSxNQUFBLE9BQUEsQ0FBQSxDQUFBLElBQUEsT0FBQSxDQUFBLE1BQUEsS0FBQSxFQUFBLENBQUEsQ0FBQSxLQUFBLGNBQUEsQ0FBQSxJQUFBLENBQUEsTUFBQSxJQUFBLFdBQUEsS0FBQSxTQUFBLElBQUEsV0FBQSxDQUFBLFFBQUEsVUFBQSxJQUFBLFVBQUEsa0JBQUEsQ0FBQSxDQUFBLElBQUEsUUFBQSxDQUFBLENBQUEsR0FBQSxjQUFBLElBQUEsS0FBQSxpQkFBQSxXQUFBLGtCQUFBLENBQUEsYUFBQSxJQUFBLFFBQUEsQ0FBQSxNQUFBLENBQUEsa0JBQUEsT0FBQSxDQUFBLEVBQUEsQ0FBQSxXQUFBLENBQUEsQ0FBQSxJQUFBLFlBQUEsQ0FBQSxDQUFBLEdBQUEsR0FBQSxDQUFBLEVBQUEsQ0FBQSxDQUFBLElBQUEsR0FBQSxDQUFBLEVBQUEsQ0FBQSxLQUFBLENBQUEsQ0FBQSxNQUFBLFdBQUEsQ0FBQSxDQUFBLEdBQUEsR0FBQSxDQUFBLEtBQUEsQ0FBQSxhQUFBLENBQUEsUUFBQSxVQUFBLENBQUEsTUFBQSxNQUFBLENBQUEsU0FBQSxDQUFBLFFBQUEsQ0FBQSxRQUFBLFVBQUEsQ0FBQSxDQUFBLEdBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxVQUFBLGlCQUFBLENBQUEsQ0FBQSxNQUFBLFNBQUEsTUFBQSxhQUFBLENBQUEsQ0FBQSxNQUFBLFNBQUEsSUFBQSxRQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsSUFBQSxDQUFBLENBQUEsZUFBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxDQUFBLHFCQUFBLENBQUEsSUFBQSxDQUFBLGFBQUEsSUFBQSxHQUFBLENBQUEsQ0FBQSxRQUFBLFNBQUEsTUFBQSxDQUFBLENBQUEsQ0FBQSxRQUFBLGdCQUFBLElBQUEsR0FBQSxDQUFBLENBQUEsVUFBQSxTQUFBLE1BQUEsQ0FBQSxDQUFBLENBQUEsVUFBQSxjQUFBLENBQUEsYUFBQSxJQUFBLEdBQUEsQ0FBQSxDQUFBLFFBQUEsU0FBQSxNQUFBLENBQUEsQ0FBQSxDQUFBLFFBQUEscUJBQUEsQ0FBQSxZQUFBLEtBQUEscURBQUEsSUFBQSxHQUFBLENBQUEsQ0FBQSxVQUFBLFNBQUEsTUFBQSxDQUFBLENBQUEsQ0FBQSxVQUFBLFlBQUEsTUFBQSxXQUFBLE9BQUEsQ0FBQSxFQUFBLENBQUEsYUFBQSxDQUFBLFFBQUEsVUFBQSxDQUFBLE1BQUEsTUFBQSxDQUFBLFNBQUEsQ0FBQSxRQUFBLENBQUEsUUFBQSxVQUFBLENBQUEsQ0FBQSxPQUFBLENBQUEsQ0FBQSxNQUFBLFNBQUEsSUFBQSxJQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsQ0FBQSx3QkFBQSxJQUFBLEdBQUEsQ0FBQSxDQUFBLFVBQUEsUUFBQSxDQUFBLEdBQUEsQ0FBQSxhQUFBLENBQUEsaUJBQUEsQ0FBQSxtQkFBQSxDQUFBLEtBQUEsQ0FBQSxDQUFBLE1BQUEsSUFBQSxDQUFBLElBQUEsQ0FBQSxJQUFBLENBQUEsQ0FBQSxVQUFBLEtBQUEsQ0FBQSxjQUFBLENBQUEsR0FBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLFVBQUEsY0FBQSxDQUFBLENBQUEsSUFBQSxHQUFBLENBQUEsRUFBQSxDQUFBLENBQUEsR0FBQSxHQUFBLENBQUEsRUFBQSxDQUFBLFNBQUEsTUFBQSxnQkFBQSxJQUFBLEdBQUEsQ0FBQSxDQUFBLFVBQUEsRUFBQSxDQUFBLFNBQUEsUUFBQSxDQUFBLENBQUEsTUFBQSxRQUFBLFdBQUEsU0FBQSxDQUFBLEVBQUEsQ0FBQSxvQkFBQSxDQUFBLENBQUEsSUFBQSxRQUFBLENBQUEsQ0FBQSxHQUFBLHFCQUFBLENBQUEsQ0FBQSxJQUFBLG1CQUFBLENBQUEsQ0FBQSxJQUFBLFFBQUEsSUFBQSxHQUFBLENBQUEsQ0FBQSxHQUFBLGdCQUFBLENBQUEsQ0FBQSxJQUFBLFNBQUEsSUFBQSxRQUFBLEdBQUEsR0FBQSxDQUFBLENBQUEsR0FBQSxPQUFBLE1BQUEsa0JBQUEsSUFBQSx5QkFBQSxDQUFBLENBQUEsSUFBQSxJQUFBLENBQUEsVUFBQSxJQUFBLEdBQUEsQ0FBQSxHQUFBLENBQUEsS0FBQSxNQUFBLFdBQUEsT0FBQSxDQUFBLGFBQUEsQ0FBQSxRQUFBLFVBQUEsQ0FBQSxNQUFBLE1BQUEsQ0FBQSxTQUFBLENBQUEsUUFBQSxDQUFBLFFBQUEsVUFBQSxDQUFBLENBQUEsT0FBQSxDQUFBLENBQUEsVUFBQSxLQUFBLENBQUEsY0FBQSxRQUFBLENBQUEsQ0FBQSxDQUFBLFVBQUEsRUFBQSxDQUFBLENBQUEsUUFBQSxHQUFBLGFBQUEsQ0FBQSxDQUFBLEdBQUEsQ0FBQSx5QkFBQSxPQUFBLENBQUEsYUFBQSxDQUFBLFFBQUEsVUFBQSxDQUFBLE1BQUEsTUFBQSxDQUFBLFNBQUEsQ0FBQSxRQUFBLENBQUEsUUFBQSxVQUFBLENBQUEsQ0FBQSxPQUFBLENBQUEsQ0FBQSxNQUFBLEtBQUEsQ0FBQSxRQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsVUFBQSxrQkFBQSxDQUFBLENBQUEsSUFBQSxRQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsR0FBQSxFQUFBLGFBQUEsQ0FBQSxDQUFBLFlBQUEsQ0FBQSxnQkFBQSxLQUFBLDhCQUFBLGFBQUEsV0FBQSxjQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxnQkFBQSxRQUFBLEtBQUEsUUFBQSxFQUFBLE1BQUEsQ0FBQSxDQUFBLEdBQUEsVUFBQSxFQUFBLENBQUEsRUFBQSxPQUFBLEVBQUEsQ0FBQSxvQkFBQSxNQUFBLFVBQUEsR0FBQSxHQUFBLENBQUEsR0FBQSxDQUFBLE9BQUEsQ0FBQTtBQUFBLFNBQUEsbUJBQUEsR0FBQSxFQUFBLE9BQUEsRUFBQSxNQUFBLEVBQUEsS0FBQSxFQUFBLE1BQUEsRUFBQSxHQUFBLEVBQUEsR0FBQSxjQUFBLElBQUEsR0FBQSxHQUFBLENBQUEsR0FBQSxFQUFBLEdBQUEsT0FBQSxLQUFBLEdBQUEsSUFBQSxDQUFBLEtBQUEsV0FBQSxLQUFBLElBQUEsTUFBQSxDQUFBLEtBQUEsaUJBQUEsSUFBQSxDQUFBLElBQUEsSUFBQSxPQUFBLENBQUEsS0FBQSxZQUFBLE9BQUEsQ0FBQSxPQUFBLENBQUEsS0FBQSxFQUFBLElBQUEsQ0FBQSxLQUFBLEVBQUEsTUFBQTtBQUFBLFNBQUEsa0JBQUEsRUFBQSw2QkFBQSxJQUFBLFNBQUEsSUFBQSxHQUFBLFNBQUEsYUFBQSxPQUFBLFdBQUEsT0FBQSxFQUFBLE1BQUEsUUFBQSxHQUFBLEdBQUEsRUFBQSxDQUFBLEtBQUEsQ0FBQSxJQUFBLEVBQUEsSUFBQSxZQUFBLE1BQUEsS0FBQSxJQUFBLGtCQUFBLENBQUEsR0FBQSxFQUFBLE9BQUEsRUFBQSxNQUFBLEVBQUEsS0FBQSxFQUFBLE1BQUEsVUFBQSxLQUFBLGNBQUEsT0FBQSxHQUFBLElBQUEsa0JBQUEsQ0FBQSxHQUFBLEVBQUEsT0FBQSxFQUFBLE1BQUEsRUFBQSxLQUFBLEVBQUEsTUFBQSxXQUFBLEdBQUEsS0FBQSxLQUFBLENBQUEsU0FBQTtBQUFBLFNBQUEsZUFBQSxHQUFBLEVBQUEsQ0FBQSxXQUFBLGVBQUEsQ0FBQSxHQUFBLEtBQUEscUJBQUEsQ0FBQSxHQUFBLEVBQUEsQ0FBQSxLQUFBLDJCQUFBLENBQUEsR0FBQSxFQUFBLENBQUEsS0FBQSxnQkFBQTtBQUFBLFNBQUEsaUJBQUEsY0FBQSxTQUFBO0FBQUEsU0FBQSw0QkFBQSxDQUFBLEVBQUEsTUFBQSxTQUFBLENBQUEscUJBQUEsQ0FBQSxzQkFBQSxpQkFBQSxDQUFBLENBQUEsRUFBQSxNQUFBLE9BQUEsQ0FBQSxHQUFBLE1BQUEsQ0FBQSxTQUFBLENBQUEsUUFBQSxDQUFBLElBQUEsQ0FBQSxDQUFBLEVBQUEsS0FBQSxhQUFBLENBQUEsaUJBQUEsQ0FBQSxDQUFBLFdBQUEsRUFBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLFdBQUEsQ0FBQSxJQUFBLE1BQUEsQ0FBQSxjQUFBLENBQUEsbUJBQUEsS0FBQSxDQUFBLElBQUEsQ0FBQSxDQUFBLE9BQUEsQ0FBQSwrREFBQSxJQUFBLENBQUEsQ0FBQSxVQUFBLGlCQUFBLENBQUEsQ0FBQSxFQUFBLE1BQUE7QUFBQSxTQUFBLGtCQUFBLEdBQUEsRUFBQSxHQUFBLFFBQUEsR0FBQSxZQUFBLEdBQUEsR0FBQSxHQUFBLENBQUEsTUFBQSxFQUFBLEdBQUEsR0FBQSxHQUFBLENBQUEsTUFBQSxXQUFBLENBQUEsTUFBQSxJQUFBLE9BQUEsS0FBQSxDQUFBLEdBQUEsR0FBQSxDQUFBLEdBQUEsR0FBQSxFQUFBLENBQUEsSUFBQSxJQUFBLENBQUEsQ0FBQSxJQUFBLEdBQUEsQ0FBQSxDQUFBLFVBQUEsSUFBQTtBQUFBLFNBQUEsc0JBQUEsQ0FBQSxFQUFBLENBQUEsUUFBQSxDQUFBLFdBQUEsQ0FBQSxnQ0FBQSxNQUFBLElBQUEsQ0FBQSxDQUFBLE1BQUEsQ0FBQSxRQUFBLEtBQUEsQ0FBQSw0QkFBQSxDQUFBLFFBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsT0FBQSxDQUFBLE9BQUEsQ0FBQSxpQkFBQSxDQUFBLElBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsQ0FBQSxHQUFBLElBQUEsUUFBQSxDQUFBLFFBQUEsTUFBQSxDQUFBLENBQUEsTUFBQSxDQUFBLFVBQUEsQ0FBQSx1QkFBQSxDQUFBLElBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsQ0FBQSxHQUFBLElBQUEsTUFBQSxDQUFBLENBQUEsSUFBQSxDQUFBLENBQUEsQ0FBQSxLQUFBLEdBQUEsQ0FBQSxDQUFBLE1BQUEsS0FBQSxDQUFBLEdBQUEsQ0FBQSxp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QSxJQUFBLEdBQUEsQ0FBQSxVQUFBLEdBQUEsR0FBQSxnQkFBQSxHQUFBO0FBQUEsU0FBQSxlQUFBLEdBQUEsRUFBQSxDQUFBLFdBQUEsZUFBQSxDQUFBLEdBQUEsS0FBQSxxQkFBQSxDQUFBLEdBQUEsRUFBQSxDQUFBLEtBQUEsMkJBQUEsQ0FBQSxHQUFBLEVBQUEsQ0FBQSxLQUFBLGdCQUFBO0FBQUEsU0FBQSxpQkFBQSxjQUFBLFNBQUE7QUFBQSxTQUFBLDRCQUFBLENBQUEsRUFBQSxNQUFBLFNBQUEsQ0FBQSxxQkFBQSxDQUFBLHNCQUFBLGlCQUFBLENBQUEsQ0FBQSxFQUFBLE1BQUEsT0FBQSxDQUFBLEdBQUEsTUFBQSxDQUFBLFNBQUEsQ0FBQSxRQUFBLENBQUEsSUFBQSxDQUFBLENBQUEsRUFBQSxLQUFBLGFBQUEsQ0FBQSxpQkFBQSxDQUFBLENBQUEsV0FBQSxFQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsV0FBQSxDQUFBLElBQUEsTUFBQSxDQUFBLGNBQUEsQ0FBQSxtQkFBQSxLQUFBLENBQUEsSUFBQSxDQUFBLENBQUEsT0FBQSxDQUFBLCtEQUFBLElBQUEsQ0FBQSxDQUFBLFVBQUEsaUJBQUEsQ0FBQSxDQUFBLEVBQUEsTUFBQTtBQUFBLFNBQUEsa0JBQUEsR0FBQSxFQUFBLEdBQUEsUUFBQSxHQUFBLFlBQUEsR0FBQSxHQUFBLEdBQUEsQ0FBQSxNQUFBLEVBQUEsR0FBQSxHQUFBLEdBQUEsQ0FBQSxNQUFBLFdBQUEsQ0FBQSxNQUFBLElBQUEsT0FBQSxLQUFBLENBQUEsR0FBQSxHQUFBLENBQUEsR0FBQSxHQUFBLEVBQUEsQ0FBQSxJQUFBLElBQUEsQ0FBQSxDQUFBLElBQUEsR0FBQSxDQUFBLENBQUEsVUFBQSxJQUFBO0FBQUEsU0FBQSxzQkFBQSxDQUFBLEVBQUEsQ0FBQSxRQUFBLENBQUEsV0FBQSxDQUFBLGdDQUFBLE1BQUEsSUFBQSxDQUFBLENBQUEsTUFBQSxDQUFBLFFBQUEsS0FBQSxDQUFBLDRCQUFBLENBQUEsUUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxPQUFBLENBQUEsT0FBQSxDQUFBLGlCQUFBLENBQUEsSUFBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxDQUFBLEdBQUEsSUFBQSxRQUFBLENBQUEsUUFBQSxNQUFBLENBQUEsQ0FBQSxNQUFBLENBQUEsVUFBQSxDQUFBLHVCQUFBLENBQUEsSUFBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxDQUFBLEdBQUEsSUFBQSxNQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsQ0FBQSxDQUFBLEtBQUEsR0FBQSxDQUFBLENBQUEsTUFBQSxLQUFBLENBQUEsR0FBQSxDQUFBLGlCQUFBLENBQUEsSUFBQSxDQUFBLE9BQUEsQ0FBQSxHQUFBLENBQUEseUJBQUEsQ0FBQSxZQUFBLENBQUEsZUFBQSxDQUFBLEdBQUEsQ0FBQSxjQUFBLE1BQUEsQ0FBQSxDQUFBLE1BQUEsQ0FBQSwyQkFBQSxDQUFBLFFBQUEsQ0FBQSxhQUFBLENBQUE7QUFBQSxTQUFBLGdCQUFBLEdBQUEsUUFBQSxLQUFBLENBQUEsT0FBQSxDQUFBLEdBQUEsVUFBQSxHQUFBO0FBQUEsU0FBQSxRQUFBLENBQUEsc0NBQUEsT0FBQSx3QkFBQSxNQUFBLHVCQUFBLE1BQUEsQ0FBQSxRQUFBLGFBQUEsQ0FBQSxrQkFBQSxDQUFBLGdCQUFBLENBQUEsV0FBQSxDQUFBLHlCQUFBLE1BQUEsSUFBQSxDQUFBLENBQUEsV0FBQSxLQUFBLE1BQUEsSUFBQSxDQUFBLEtBQUEsTUFBQSxDQUFBLFNBQUEscUJBQUEsQ0FBQSxLQUFBLE9BQUEsQ0FBQSxDQUFBO0FBQUEsU0FBQSxrQkFBQSxNQUFBLEVBQUEsS0FBQSxhQUFBLENBQUEsTUFBQSxDQUFBLEdBQUEsS0FBQSxDQUFBLE1BQUEsRUFBQSxDQUFBLFVBQUEsVUFBQSxHQUFBLEtBQUEsQ0FBQSxDQUFBLEdBQUEsVUFBQSxDQUFBLFVBQUEsR0FBQSxVQUFBLENBQUEsVUFBQSxXQUFBLFVBQUEsQ0FBQSxZQUFBLHdCQUFBLFVBQUEsRUFBQSxVQUFBLENBQUEsUUFBQSxTQUFBLE1BQUEsQ0FBQSxjQUFBLENBQUEsTUFBQSxFQUFBLGNBQUEsQ0FBQSxVQUFBLENBQUEsR0FBQSxHQUFBLFVBQUE7QUFBQSxTQUFBLGFBQUEsV0FBQSxFQUFBLFVBQUEsRUFBQSxXQUFBLFFBQUEsVUFBQSxFQUFBLGlCQUFBLENBQUEsV0FBQSxDQUFBLFNBQUEsRUFBQSxVQUFBLE9BQUEsV0FBQSxFQUFBLGlCQUFBLENBQUEsV0FBQSxFQUFBLFdBQUEsR0FBQSxNQUFBLENBQUEsY0FBQSxDQUFBLFdBQUEsaUJBQUEsUUFBQSxtQkFBQSxXQUFBO0FBQUEsU0FBQSxlQUFBLEdBQUEsUUFBQSxHQUFBLEdBQUEsWUFBQSxDQUFBLEdBQUEsb0JBQUEsT0FBQSxDQUFBLEdBQUEsaUJBQUEsR0FBQSxHQUFBLE1BQUEsQ0FBQSxHQUFBO0FBQUEsU0FBQSxhQUFBLEtBQUEsRUFBQSxJQUFBLFFBQUEsT0FBQSxDQUFBLEtBQUEsa0JBQUEsS0FBQSxrQkFBQSxLQUFBLE1BQUEsSUFBQSxHQUFBLEtBQUEsQ0FBQSxNQUFBLENBQUEsV0FBQSxPQUFBLElBQUEsS0FBQSxTQUFBLFFBQUEsR0FBQSxHQUFBLElBQUEsQ0FBQSxJQUFBLENBQUEsS0FBQSxFQUFBLElBQUEsb0JBQUEsT0FBQSxDQUFBLEdBQUEsdUJBQUEsR0FBQSxZQUFBLFNBQUEsNERBQUEsSUFBQSxnQkFBQSxNQUFBLEdBQUEsTUFBQSxFQUFBLEtBQUE7QUFBQSxTQUFBLGdCQUFBLFFBQUEsRUFBQSxXQUFBLFVBQUEsUUFBQSxZQUFBLFdBQUEsZUFBQSxTQUFBO0FBQUEsU0FBQSxVQUFBLFFBQUEsRUFBQSxVQUFBLGVBQUEsVUFBQSxtQkFBQSxVQUFBLHVCQUFBLFNBQUEsMERBQUEsUUFBQSxDQUFBLFNBQUEsR0FBQSxNQUFBLENBQUEsTUFBQSxDQUFBLFVBQUEsSUFBQSxVQUFBLENBQUEsU0FBQSxJQUFBLFdBQUEsSUFBQSxLQUFBLEVBQUEsUUFBQSxFQUFBLFFBQUEsUUFBQSxZQUFBLGFBQUEsTUFBQSxDQUFBLGNBQUEsQ0FBQSxRQUFBLGlCQUFBLFFBQUEsZ0JBQUEsVUFBQSxFQUFBLGVBQUEsQ0FBQSxRQUFBLEVBQUEsVUFBQTtBQUFBLFNBQUEsYUFBQSxPQUFBLFFBQUEseUJBQUEsR0FBQSx5QkFBQSxvQkFBQSxxQkFBQSxRQUFBLEtBQUEsR0FBQSxlQUFBLENBQUEsT0FBQSxHQUFBLE1BQUEsTUFBQSx5QkFBQSxRQUFBLFNBQUEsR0FBQSxlQUFBLE9BQUEsV0FBQSxFQUFBLE1BQUEsR0FBQSxPQUFBLENBQUEsU0FBQSxDQUFBLEtBQUEsRUFBQSxTQUFBLEVBQUEsU0FBQSxZQUFBLE1BQUEsR0FBQSxLQUFBLENBQUEsS0FBQSxPQUFBLFNBQUEsWUFBQSwwQkFBQSxPQUFBLE1BQUE7QUFBQSxTQUFBLDJCQUFBLElBQUEsRUFBQSxJQUFBLFFBQUEsSUFBQSxLQUFBLE9BQUEsQ0FBQSxJQUFBLHlCQUFBLElBQUEsMkJBQUEsSUFBQSxhQUFBLElBQUEseUJBQUEsU0FBQSx1RUFBQSxzQkFBQSxDQUFBLElBQUE7QUFBQSxTQUFBLHVCQUFBLElBQUEsUUFBQSxJQUFBLHlCQUFBLGNBQUEsd0VBQUEsSUFBQTtBQUFBLFNBQUEsaUJBQUEsS0FBQSxRQUFBLE1BQUEsVUFBQSxHQUFBLHNCQUFBLEdBQUEsS0FBQSxTQUFBLEVBQUEsZ0JBQUEsWUFBQSxpQkFBQSxLQUFBLFFBQUEsS0FBQSxjQUFBLGlCQUFBLENBQUEsS0FBQSxVQUFBLEtBQUEsYUFBQSxLQUFBLDZCQUFBLFNBQUEscUVBQUEsTUFBQSx3QkFBQSxNQUFBLENBQUEsR0FBQSxDQUFBLEtBQUEsVUFBQSxNQUFBLENBQUEsR0FBQSxDQUFBLEtBQUEsR0FBQSxNQUFBLENBQUEsR0FBQSxDQUFBLEtBQUEsRUFBQSxPQUFBLGNBQUEsUUFBQSxXQUFBLFVBQUEsQ0FBQSxLQUFBLEVBQUEsU0FBQSxFQUFBLGVBQUEsT0FBQSxXQUFBLEtBQUEsT0FBQSxDQUFBLFNBQUEsR0FBQSxNQUFBLENBQUEsTUFBQSxDQUFBLEtBQUEsQ0FBQSxTQUFBLElBQUEsV0FBQSxJQUFBLEtBQUEsRUFBQSxPQUFBLEVBQUEsVUFBQSxTQUFBLFFBQUEsUUFBQSxZQUFBLG9CQUFBLGVBQUEsQ0FBQSxPQUFBLEVBQUEsS0FBQSxhQUFBLGdCQUFBLENBQUEsS0FBQTtBQUFBLFNBQUEsV0FBQSxNQUFBLEVBQUEsSUFBQSxFQUFBLEtBQUEsUUFBQSx5QkFBQSxNQUFBLFVBQUEsR0FBQSxPQUFBLENBQUEsU0FBQSxDQUFBLElBQUEsYUFBQSxVQUFBLFlBQUEsV0FBQSxNQUFBLEVBQUEsSUFBQSxFQUFBLEtBQUEsUUFBQSxDQUFBLFdBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxLQUFBLENBQUEsQ0FBQSxFQUFBLElBQUEsT0FBQSxXQUFBLEdBQUEsUUFBQSxDQUFBLElBQUEsQ0FBQSxLQUFBLENBQUEsTUFBQSxFQUFBLENBQUEsT0FBQSxRQUFBLE9BQUEsV0FBQSxRQUFBLEtBQUEsRUFBQSxlQUFBLENBQUEsUUFBQSxFQUFBLEtBQUEsQ0FBQSxTQUFBLFVBQUEsUUFBQSxjQUFBLFVBQUEsQ0FBQSxLQUFBLE9BQUEsU0FBQTtBQUFBLFNBQUEsMEJBQUEsZUFBQSxPQUFBLHFCQUFBLE9BQUEsQ0FBQSxTQUFBLG9CQUFBLE9BQUEsQ0FBQSxTQUFBLENBQUEsSUFBQSwyQkFBQSxLQUFBLG9DQUFBLE9BQUEsQ0FBQSxTQUFBLENBQUEsT0FBQSxDQUFBLElBQUEsQ0FBQSxPQUFBLENBQUEsU0FBQSxDQUFBLE9BQUEsOENBQUEsQ0FBQTtBQUFBLFNBQUEsa0JBQUEsRUFBQSxXQUFBLFFBQUEsQ0FBQSxRQUFBLENBQUEsSUFBQSxDQUFBLEVBQUEsRUFBQSxPQUFBO0FBQUEsU0FBQSxnQkFBQSxDQUFBLEVBQUEsQ0FBQSxJQUFBLGVBQUEsR0FBQSxNQUFBLENBQUEsY0FBQSxHQUFBLE1BQUEsQ0FBQSxjQUFBLENBQUEsSUFBQSxjQUFBLGdCQUFBLENBQUEsRUFBQSxDQUFBLElBQUEsQ0FBQSxDQUFBLFNBQUEsR0FBQSxDQUFBLFNBQUEsQ0FBQSxZQUFBLGVBQUEsQ0FBQSxDQUFBLEVBQUEsQ0FBQTtBQUFBLFNBQUEsZ0JBQUEsQ0FBQSxJQUFBLGVB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LGtCQUFrQixFQUFFLE1BQU07RUFDMUIsZ0JBQWdCLEVBQUU7QUFDcEIsQ0FBQztBQUVELElBQU0sYUFBYSxHQUFBLE9BQUEsQ0FBQSxhQUFBLEdBQUcsU0FBaEIsYUFBYSxDQUFJLEdBQUcsRUFBSztFQUM3QixHQUFHLENBQUMsS0FBSyxDQUFDLGVBQWUsR0FBRyxPQUFPLENBQUMsVUFBVTtBQUNoRCxDQUFDO0FBRUQsSUFBTSxlQUFlLEdBQUEsT0FBQSxDQUFBLGVBQUEsR0FBRyxTQUFsQixlQUFlLENBQUksR0FBRyxFQUFLO0VBQy9CLEdBQUcsQ0FBQyxLQUFLLENBQUMsZUFBZSxHQUFHLE9BQU8sQ0FBQyxrQkFBa0I7QUFDeEQsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIid1c2Ugc3RyaWN0Jztcbi8vIEZvciBtb3JlIGluZm9ybWF0aW9uIGFib3V0IGJyb3dzZXIgZmllbGQsIGNoZWNrIG91dCB0aGUgYnJvd3NlciBmaWVsZCBhdCBodHRwczovL2dpdGh1Yi5jb20vc3Vic3RhY2svYnJvd3NlcmlmeS1oYW5kYm9vayNicm93c2VyLWZpZWxkLlxuXG52YXIgc3R5bGVFbGVtZW50c0luc2VydGVkQXRUb3AgPSBbXTtcblxudmFyIGluc2VydFN0eWxlRWxlbWVudCA9IGZ1bmN0aW9uKHN0eWxlRWxlbWVudCwgb3B0aW9ucykge1xuICAgIHZhciBoZWFkID0gZG9jdW1lbnQuaGVhZCB8fCBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdO1xuICAgIHZhciBsYXN0U3R5bGVFbGVtZW50SW5zZXJ0ZWRBdFRvcCA9IHN0eWxlRWxlbWVudHNJbnNlcnRlZEF0VG9wW3N0eWxlRWxlbWVudHNJbnNlcnRlZEF0VG9wLmxlbmd0aCAtIDFdO1xuXG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgb3B0aW9ucy5pbnNlcnRBdCA9IG9wdGlvbnMuaW5zZXJ0QXQgfHwgJ2JvdHRvbSc7XG5cbiAgICBpZiAob3B0aW9ucy5pbnNlcnRBdCA9PT0gJ3RvcCcpIHtcbiAgICAgICAgaWYgKCFsYXN0U3R5bGVFbGVtZW50SW5zZXJ0ZWRBdFRvcCkge1xuICAgICAgICAgICAgaGVhZC5pbnNlcnRCZWZvcmUoc3R5bGVFbGVtZW50LCBoZWFkLmZpcnN0Q2hpbGQpO1xuICAgICAgICB9IGVsc2UgaWYgKGxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wLm5leHRTaWJsaW5nKSB7XG4gICAgICAgICAgICBoZWFkLmluc2VydEJlZm9yZShzdHlsZUVsZW1lbnQsIGxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wLm5leHRTaWJsaW5nKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGhlYWQuYXBwZW5kQ2hpbGQoc3R5bGVFbGVtZW50KTtcbiAgICAgICAgfVxuICAgICAgICBzdHlsZUVsZW1lbnRzSW5zZXJ0ZWRBdFRvcC5wdXNoKHN0eWxlRWxlbWVudCk7XG4gICAgfSBlbHNlIGlmIChvcHRpb25zLmluc2VydEF0ID09PSAnYm90dG9tJykge1xuICAgICAgICBoZWFkLmFwcGVuZENoaWxkKHN0eWxlRWxlbWVudCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHZhbHVlIGZvciBwYXJhbWV0ZXIgXFwnaW5zZXJ0QXRcXCcuIE11c3QgYmUgXFwndG9wXFwnIG9yIFxcJ2JvdHRvbVxcJy4nKTtcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICAvLyBDcmVhdGUgYSA8bGluaz4gdGFnIHdpdGggb3B0aW9uYWwgZGF0YSBhdHRyaWJ1dGVzXG4gICAgY3JlYXRlTGluazogZnVuY3Rpb24oaHJlZiwgYXR0cmlidXRlcykge1xuICAgICAgICB2YXIgaGVhZCA9IGRvY3VtZW50LmhlYWQgfHwgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXTtcbiAgICAgICAgdmFyIGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaW5rJyk7XG5cbiAgICAgICAgbGluay5ocmVmID0gaHJlZjtcbiAgICAgICAgbGluay5yZWwgPSAnc3R5bGVzaGVldCc7XG5cbiAgICAgICAgZm9yICh2YXIga2V5IGluIGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICAgIGlmICggISBhdHRyaWJ1dGVzLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IGF0dHJpYnV0ZXNba2V5XTtcbiAgICAgICAgICAgIGxpbmsuc2V0QXR0cmlidXRlKCdkYXRhLScgKyBrZXksIHZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGhlYWQuYXBwZW5kQ2hpbGQobGluayk7XG4gICAgfSxcbiAgICAvLyBDcmVhdGUgYSA8c3R5bGU+IHRhZyB3aXRoIG9wdGlvbmFsIGRhdGEgYXR0cmlidXRlc1xuICAgIGNyZWF0ZVN0eWxlOiBmdW5jdGlvbihjc3NUZXh0LCBhdHRyaWJ1dGVzLCBleHRyYU9wdGlvbnMpIHtcbiAgICAgICAgZXh0cmFPcHRpb25zID0gZXh0cmFPcHRpb25zIHx8IHt9O1xuXG4gICAgICAgIHZhciBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgICAgIHN0eWxlLnR5cGUgPSAndGV4dC9jc3MnO1xuXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBhdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgICBpZiAoICEgYXR0cmlidXRlcy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgdmFsdWUgPSBhdHRyaWJ1dGVzW2tleV07XG4gICAgICAgICAgICBzdHlsZS5zZXRBdHRyaWJ1dGUoJ2RhdGEtJyArIGtleSwgdmFsdWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHN0eWxlLnNoZWV0KSB7IC8vIGZvciBqc2RvbSBhbmQgSUU5K1xuICAgICAgICAgICAgc3R5bGUuaW5uZXJIVE1MID0gY3NzVGV4dDtcbiAgICAgICAgICAgIHN0eWxlLnNoZWV0LmNzc1RleHQgPSBjc3NUZXh0O1xuICAgICAgICAgICAgaW5zZXJ0U3R5bGVFbGVtZW50KHN0eWxlLCB7IGluc2VydEF0OiBleHRyYU9wdGlvbnMuaW5zZXJ0QXQgfSk7XG4gICAgICAgIH0gZWxzZSBpZiAoc3R5bGUuc3R5bGVTaGVldCkgeyAvLyBmb3IgSUU4IGFuZCBiZWxvd1xuICAgICAgICAgICAgaW5zZXJ0U3R5bGVFbGVtZW50KHN0eWxlLCB7IGluc2VydEF0OiBleHRyYU9wdGlvbnMuaW5zZXJ0QXQgfSk7XG4gICAgICAgICAgICBzdHlsZS5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3NUZXh0O1xuICAgICAgICB9IGVsc2UgeyAvLyBmb3IgQ2hyb21lLCBGaXJlZm94LCBhbmQgU2FmYXJpXG4gICAgICAgICAgICBzdHlsZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3NUZXh0KSk7XG4gICAgICAgICAgICBpbnNlcnRTdHlsZUVsZW1lbnQoc3R5bGUsIHsgaW5zZXJ0QXQ6IGV4dHJhT3B0aW9ucy5pbnNlcnRBdCB9KTtcbiAgICAgICAgfVxuICAgIH1cbn07XG4iLCJpbXBvcnQgeyBzZWxlY3RlZFN0eWxlLCB1bnNlbGVjdGVkU3R5bGUgfSBmcm9tICcuL3N0eWxlcy5qcyc7XG5pbXBvcnQgeyBjb25maWcsIGNhbGVuZGFyLCBsYXN0RGF0ZUNsaWNrZWQgfSBmcm9tICcuL2NhbGVuZGFyR2VuZXJhdG9yLmpzJztcbmltcG9ydCB7IGRpc3BsYXlUaW1lQ2hvb3Nlck1vZGFsLCBnZXRTZWxlY3RlZFRpbWVzIH0gZnJvbSAnLi9kaXNwbGF5VGltZUNob29zZXJNb2RhbC5qcyc7XG5cbi8qKlxuICogQ2FsY3VsYXRlcyB0aGUgdGltZSB2YWx1ZSBpbiBtaWxsaXNlY29uZHMgYmFzZWQgb24gdGhlIGdpdmVuIHRpbWUuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHRpbWUgLSBUaGUgdGltZSBpbiB0aGUgZm9ybWF0IFwiSEg6TU1cIi5cbiAqIEByZXR1cm4ge251bWJlcn0gVGhlIHRpbWUgdmFsdWUgaW4gbWlsbGlzZWNvbmRzLlxuICpcbiAqIEBoYXNUZXN0c1xuICpcbiAqIEBleGFtcGxlXG4gKiAvLyBFeGFtcGxlIHVzYWdlOlxuICogY29uc3QgdGltZVZhbHVlID0gdGltZVZhbHVlSW5NaWxsKCcxMjozMCcpO1xuICovXG5cbmZ1bmN0aW9uIHRpbWVWYWx1ZUluTWlsbCAodGltZSkge1xuICBpZiAoIXRpbWUuaW5jbHVkZXMoJzonKSkge1xuICAgIGNvbnN0IGUgPSBuZXcgRXJyb3IoJ0V4cGVjdHMgYSB0aW1lIHN0cmluZyBISDpNTScpO1xuICAgIHRocm93IGU7XG4gIH1cbiAgY29uc3QgW2hvdXJzLCBtaW51dGVzXSA9IHRpbWUuc3BsaXQoJzonKTtcbiAgcmV0dXJuIChwYXJzZUludChob3VycykgKiA2MCAqIDYwICogMTAwMCkgKyAocGFyc2VJbnQobWludXRlcykgKiA2MCAqIDEwMDApO1xufVxuXG4vKipcbiAqIHZhciBnZXREYXlzSW5Nb250aCAtIEdldCBudW1iZXIgb2YgZGF5cyBpbiBtb250aFxuICpcbiAqIEBwYXJhbSAgeyFudW1iZXJ9IG1vbnRoIFRoZSBudW1iZXIgb2YgdGhlIGNvcnJlc3BvbmRpbmcgbW9udGguXG4gKiBAcGFyYW0gIHshbnVtYmVyfSB5ZWFyICBUaGUgY29ycmVzcG9uZGluZyB5ZWFyLlxuICogQHJldHVybiB7bnVtYmVyfSBSZXR1cm5zIGEgbnVtYmVyIGNvcnJlc3BvbmRpbmcgdG8gdGhlIG51bWJlciBvZiBkYXlzIGZvciB0aGUgZGF0ZSBpbiBwb2ludC5cbiAqL1xuZnVuY3Rpb24gZ2V0RGF5c0luTW9udGggKG1vbnRoLCB5ZWFyKSB7XG4gIHJldHVybiBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMCkuZ2V0RGF0ZSgpO1xufVxuXG4vKipcbiAqIENoZWNrcyBmb3Igb3ZlcmxhcCBpbiBhbiBhcnJheSBvZiB2YWx1ZXMuXG4gKlxuICogQHBhcmFtIHtBcnJheX0gdmFsdWVzIC0gVGhlIGFycmF5IG9mIHZhbHVlcyB0byBjaGVjayBmb3Igb3ZlcmxhcC5cbiAqIEByZXR1cm4ge2Jvb2xlYW59IC0gUmV0dXJucyB0cnVlIGlmIG92ZXJsYXAgaXMgZm91bmQsIGZhbHNlIG90aGVyd2lzZS5cbiAqL1xuZnVuY3Rpb24gY2hlY2tPdmVybGFwICh2YWx1ZXMpIHtcbiAgY29uc3QgbnVtZXJpY2FsRXF1aXZhbGVudCA9IHZhbHVlcy5tYXAodGltZVZhbHVlSW5NaWxsKTtcblxuICBmb3IgKGxldCBjdXJyZW50SW5kZXggPSAyOyBjdXJyZW50SW5kZXggPCBudW1lcmljYWxFcXVpdmFsZW50Lmxlbmd0aDsgY3VycmVudEluZGV4ICs9IDIpIHtcbiAgICBjb25zdCBjdXJyZW50U3RhcnQgPSBudW1lcmljYWxFcXVpdmFsZW50W2N1cnJlbnRJbmRleF07XG4gICAgY29uc3QgY3VycmVudEVuZCA9IG51bWVyaWNhbEVxdWl2YWxlbnRbY3VycmVudEluZGV4ICsgMV07XG5cbiAgICBmb3IgKGxldCBjb21wYXJpc29uSW5kZXggPSAwOyBjb21wYXJpc29uSW5kZXggPCBudW1lcmljYWxFcXVpdmFsZW50Lmxlbmd0aDsgY29tcGFyaXNvbkluZGV4ICs9IDIpIHtcbiAgICAgIGlmIChjdXJyZW50SW5kZXggIT09IGNvbXBhcmlzb25JbmRleCkge1xuICAgICAgICBjb25zdCBjb21wYXJpc29uU3RhcnQgPSBudW1lcmljYWxFcXVpdmFsZW50W2NvbXBhcmlzb25JbmRleF07XG4gICAgICAgIGNvbnN0IGNvbXBhcmlzb25FbmQgPSBudW1lcmljYWxFcXVpdmFsZW50W2NvbXBhcmlzb25JbmRleCArIDFdO1xuXG4gICAgICAgIGlmIChjb21wYXJpc29uRW5kID49IGN1cnJlbnRTdGFydCAmJiBjb21wYXJpc29uRW5kIDw9IGN1cnJlbnRFbmQpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIGlmIChjdXJyZW50U3RhcnQgPj0gY29tcGFyaXNvblN0YXJ0ICYmIGN1cnJlbnRFbmQgPD0gY29tcGFyaXNvbkVuZCkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGVsc2UgaWYgKGN1cnJlbnRTdGFydCA9PT0gY29tcGFyaXNvblN0YXJ0ICYmIGN1cnJlbnRFbmQgPT09IGNvbXBhcmlzb25FbmQpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIGlmIChjdXJyZW50RW5kID49IGNvbXBhcmlzb25TdGFydCAmJiBjdXJyZW50RW5kIDw9IGNvbXBhcmlzb25FbmQpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIENsZWFycyB0aGUgc2VsZWN0aW9uIG9mIGRhdGVzIGluIHRoZSBjYWxlbmRhci5cbiAqXG4gKiBAcGFyYW0ge3VuZGVmaW5lZH1cbiAqIEByZXR1cm4ge3VuZGVmaW5lZH1cbiAqL1xuZnVuY3Rpb24gY2xlYXJTZWxlY3Rpb24gKGNhbGVuZGFyLCBkeW5hbWljRGF0YSkge1xuICBjb25zb2xlLmxvZyhkeW5hbWljRGF0YSk7XG4gIGNvbnN0IGRhdGVzT2JqU3RvcmUgPSBkeW5hbWljRGF0YS5kYXRlc1NlbGVjdGVkQXJyYXlPYmplY3RzO1xuICBjb25zdCBkYXRlc0luZGV4ID0gZHluYW1pY0RhdGEuZGF0ZXNTZWxlY3RlZEFycmF5O1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0ZXNPYmpTdG9yZS5sZW5ndGg7IGkrKykge1xuICAgIGZvciAobGV0IGogPSAwOyBqIDwgZGF0ZXNJbmRleC5sZW5ndGg7IGorKykge1xuICAgICAgY29uc29sZS5sb2coZGF0ZXNJbmRleFtqXSk7XG4gICAgICBkYXRlc0luZGV4W2pdLmZvckVhY2goKGRhdGUpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coZGF0ZSk7XG4gICAgICAgIHVuc2VsZWN0ZWRTdHlsZShjYWxlbmRhci5xdWVyeVNlbGVjdG9yKGBbZGF0YS1odW1hbmRhdGU9JyR7ZGF0ZX0nXWApKTtcbiAgICAgICAgaWYgKGkgPT09IGRhdGVzT2JqU3RvcmUubGVuZ3RoIC0gMSAmJiBqID09PSBkYXRlc0luZGV4Lmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICBkYXRlc09ialN0b3JlLmxlbmd0aCA9IDA7XG4gICAgICAgICAgZGF0ZXNJbmRleC5sZW5ndGggPSAwO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn1cblxuLypcblxuKi9cblxuLyoqXG4gKiBAcGFyYW0ge251bWJlcn0gW2xlbmd0aD0xMF0gLWxlbmd0aCB0aGUgZGVzaXJlZCBsZW5ndGggb2YgdGhlIHN0cmluZyBvZiBudW1iZXJzLlxuICogQHJldHVybnMgYSBzdHJpbmcgb2YgcmFuZG9tIGRpZ2l0cyBvZiBhIHNwZWNpZmllZCBsZW5ndGguXG4gKi9cblxuZnVuY3Rpb24gcmFuZG9tQnl0ZXMgKGxlbmd0aCkge1xuICBpZiAobGVuZ3RoID4gODApIHtcbiAgICBjb25zdCBlID0gbmV3IEVycm9yKCdyYW5kb21CeXRlcyBsZW5ndGggY2FuIGJlIG1vcmUgdGhhbiA4MDAgZGlnaXRzJyk7XG4gICAgdGhyb3cgZTtcbiAgfVxuICBjb25zdCBhcnJheSA9IG5ldyBVaW50MzJBcnJheSgxMDApO1xuICB3aW5kb3cuY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhhcnJheSk7XG4gIGxldCBzdCA9ICcnO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgc3QgKz0gYXJyYXlbaV07XG4gICAgaWYgKGkgPT09IGFycmF5Lmxlbmd0aCAtIDEpIHtcbiAgICAgIHJldHVybiBzdC5zbGljZShzdC5sZW5ndGggLSAobGVuZ3RoIHx8IDEwKSk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGdlbmVyYXRlUmFuZG9tU3RyaW5nKCkge1xuICBjb25zdCByYW5kb21TdHJpbmcgPSByYW5kb21CeXRlcygxMCk7XG4gIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjY2FsZW5kYXItJyArIHJhbmRvbVN0cmluZykpIHtcbiAgICByZXR1cm4gZ2VuZXJhdGVSYW5kb21TdHJpbmcoKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gcmFuZG9tU3RyaW5nO1xuICB9XG59XG5cbi8vV0UgV0VSRSBTRVRUSU5HIFVQIFRIRSBDQUxFTkRBUiBUTyBSRU5ERVIgREFURVMgSU4gVEhFIFBBU1Q6XG4vKiBXYXJuaW5nOiBDb250ZW1wbGF0ZXMgZGF5bGlnaHQgc2F2aW5nIHRpbWUqL1xuXG5mdW5jdGlvbiBnZXRFYXJsaWVzdERhdGUgKHByZWxvYWRlZERhdGVzKSB7XG4gIGNvbnN0IG9yZGVyID0gW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcHJlbG9hZGVkRGF0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoaSA9PT0gMCkge1xuICAgICAgb3JkZXIucHVzaChuZXcgRGF0ZSgpLmdldFRpbWUoKSk7XG4gICAgfVxuICAgIG9yZGVyLnB1c2gobmV3IERhdGUocHJlbG9hZGVkRGF0ZXNbaV0pLmdldFRpbWUoKSk7XG4gICAgaWYgKGkgPT09IHByZWxvYWRlZERhdGVzLmxlbmd0aCAtIDEpIHtcbiAgICAgIG9yZGVyLnNvcnQoKTtcbiAgICAgIGNvbnN0IGQgPSBuZXcgRGF0ZShvcmRlclswXSk7XG4gICAgICByZXR1cm4gZDtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBDb252ZXJ0cyBhbiBhcnJheSBvZiBkYXRlcyBpbnRvIGEgbmV3IGFycmF5IG9mIG9iamVjdHMgd2l0aCBmb3JtYXR0ZWQgZGF0ZXMuXG4gKlxuICogQHBhcmFtIHtBcnJheX0gZGF0ZXMgLSBUaGUgYXJyYXkgb2YgZGF0ZXMuXG4gKiBAcmV0dXJuIHtQcm9taXNlfSBBIHByb21pc2UgdGhhdCByZXNvbHZlcyB0byB0aGUgbmV3IGFycmF5IG9mIG9iamVjdHMuXG4gKi9cbmZ1bmN0aW9uIGNvbnZlcnREYXRlcyAoZGF0ZXMpIHtcbiAgY29uc3QgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoZGF0ZXNbaV0uZGF5KSB7XG4gICAgICAgIGR5bmFtaWNEYXRhLmRhdGVzU2VsZWN0ZWRBcnJheU9iamVjdHMucHVzaChkYXRlc1tpXSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgLy8gZHluYW1pY0RhdGEuZGF0ZXNTZWxlY3RlZEFycmF5T2JqZWN0cy5wdXNoKHsgZGF5OiBzdGFuZGFyZERhdGVPYmplY3QoZGF0ZXNbaV0pIH0pO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBwcm9taXNlO1xufVxuXG4vKipcbiAqIEFzeW5jaHJvbm91c2x5IHByZWxvYWRzIGRhdGVzIGZvciB0aGUgY2FsZW5kYXIuXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IGNhbGVuZGFyIC0gdGhlIGNhbGVuZGFyIG9iamVjdFxuICogQHBhcmFtIHthcnJheX0gZGF0ZXMgLSBhbiBhcnJheSBvZiBkYXRlcyB0byBwcmVsb2FkXG4gKiBAcmV0dXJuIHt2b2lkfSBcbiAqL1xuYXN5bmMgZnVuY3Rpb24gcHJlbG9hZERhdGVzIChjYWxlbmRhciwgZGF0ZXMpIHtcbiAgLy8gY29uc29sZS5sb2coJ1BSRUxPQURJTkcgREFURVMuLi4nKTtcbiAgLy8gY29uc29sZS5sb2coY2FsZW5kYXIpO1xuICAvLyBjb25zb2xlLmxvZyhkYXRlcyk7XG4gIGRhdGVzID0gWycyMDIzLTA5LTA5J11cbiAgbGV0IGVuZFVzZXIgPSAxO1xuICAvL2F0dGFjaChkYXRlTm9kZSk7XG4gIGF3YWl0IGNvbnZlcnREYXRlcyhkYXRlcyk7XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRlc1NlbGVjdGVkQXJyYXlPYmplY3RzLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgZGF0ZU9iamVjdCA9IGRhdGVzU2VsZWN0ZWRBcnJheU9iamVjdHNbaV07XG4gICAgY29uc3QgZGF0ZU5vZGUgPSBjYWxlbmRhci5xdWVyeVNlbGVjdG9yKGAjJHtkYXRlT2JqZWN0LmRheX1gKTtcblxuICAgIGlmIChkYXRlTm9kZSkge1xuICAgICAgZGF0ZXNTZWxlY3RlZEFycmF5LnB1c2goZGF0ZXNbaV0uZGF5KTtcbiAgICAgIGRhdGVOb2RlLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICcjZmMzJztcbiAgICAgIGRhdGVOb2RlLmNsYXNzTGlzdC5hZGQoJ2F2YWlsYWJsZScpO1xuICAgIH1cblxuICAgIGlmIChlbmRVc2VyKSB7XG4gICAgICBhdHRhY2goZGF0ZU5vZGUpO1xuICAgICAgLy90aW1lQ2hvb3NlcigpO1xuICAgIH1cblxuICAgIGlmIChkaXNwbGF5VGltZUNob29zZXJNb2RhbCkge1xuICAgICAgLy8gY3JlYXRlVGltZUVsZW1lbnRzICgpO1xuICAgICAgLy9nZW5lcmF0ZVRpbWVzT25seShkYXRlT2JqZWN0LnRpbWVzLCBkYXRlTm9kZSk7XG4gICAgfVxuXG4gICAgaWYgKHNlbGVjdFJhbmdlICYmIGRhdGVOb2RlICYmICFkYXRlTm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ2ZpbGxlcicpKSB7XG4gICAgICBkYXRlTm9kZS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAnIzMzMyc7XG4gICAgICBkYXRlTm9kZS5jbGFzc0xpc3QuYWRkKCdibG9ja2VkJyk7XG4gICAgICBkYXRlTm9kZS50aXRsZSA9ICdObyBhdmFpbGFiaWxpdHkgb24gdGhpcyBkYXknO1xuXG4gICAgICBjb25zdCBzb2xkT3V0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgICAgc29sZE91dC5jbGFzc0xpc3QuYWRkKCdjYWxlbmRhclRpbWUnKTtcbiAgICAgIHNvbGRPdXQudGV4dENvbnRlbnQgPSAnU29sZCBvdXQnO1xuICAgICAgZGF0ZU5vZGUuYXBwZW5kQ2hpbGQoc29sZE91dCk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGJsb2NrRGF5c05vdE9wZW4gKGNhbGVuZGFyLCBkYXRlc09wZW4pIHtcbiAgaWYgKGNhbGVuZGFyICYmIGRhdGVzT3Blbikge1xuICAgIGNvbnN0IGFsbERheXMgPSBBcnJheS5mcm9tKGNhbGVuZGFyLnF1ZXJ5U2VsZWN0b3JBbGwoJy5kYXlUaW1lJykpLm1hcCgoZWwpID0+IHsgcmV0dXJuIGVsLmRhdGFzZXQuaHVtYW5kYXRlOyB9KTtcbiAgICBjb25zdCBvcGVuRGF5cyA9IGRhdGVzT3Blbi5tYXAoKGVsKSA9PiB7IHJldHVybiBlbC5kYXk7IH0pO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhbGxEYXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAob3BlbkRheXMuaW5kZXhPZihhbGxEYXlzW2ldKSA9PT0gLTEpIHtcbiAgICAgICAgY29uc3QgZGF5ID0gY2FsZW5kYXIucXVlcnlTZWxlY3RvcihgW2lkPVwiJHthbGxEYXlzW2ldfVwiXWApO1xuICAgICAgICBkYXkuY2xhc3NMaXN0LmFkZCgnd2lkdGhTaGFwZScsICdmaWxsZXInKTtcbiAgICAgICAgZGF5LnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICd3aGl0ZSc7XG4gICAgICAgIGRheS50aXRsZSA9ICdDbG9zZWQgb24gdGhpcyBkYXknO1xuXG4gICAgICAgIGNvbnN0IGNsb3NlZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICAgICAgY2xvc2VkLmNsYXNzTGlzdC5hZGQoJ2NhbGVuZGFyVGltZScpO1xuICAgICAgICBjbG9zZWQudGV4dENvbnRlbnQgPSAnY2xvc2VkJztcblxuICAgICAgICBkYXkuYXBwZW5kQ2hpbGQoY2xvc2VkKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBSZWxlYXNlIGJvb2tlZCBkYXlcbiAqIEBkZXNjcmlwdGlvbiBSZW1vdmVzIGEgZGF5IHRoYXQgaGFzIGJlZW4gcHJldmlvdXNseSBib29rZWQuXG4gKiBAZnVuY3Rpb24gcmVsZWFzZUJvb2tlZERheVxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZGF5IC0gSFRNTCBkaXYgZWxlbWVudCByZXByZXNlbnRpbmcgdGhlIGRheS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBkYXRlIC0gRGF0ZSBzdHJpbmcgaW4gdGhlIGZvcm1hdCAnWVlZWS1NTS1ERCcuXG4gKi9cbmZ1bmN0aW9uIHJlbGVhc2VCb29rZWREYXkgKGRheSwgZGF0ZSkge1xuICBjb25zdCBpbmRleCA9IGRhdGVzU2VsZWN0ZWRBcnJheS5pbmRleE9mKGRhdGUpO1xuICB1bnNlbGVjdGVkU3R5bGUoZGF5KTtcbiAgZGF0ZXNTZWxlY3RlZEFycmF5LnNwbGljZShpbmRleCwgMSk7XG4gIGRhdGVzU2VsZWN0ZWRBcnJheU9iamVjdHMuc3BsaWNlKGluZGV4LCAxKTtcblxuICB3aGlsZSAoZGF5LmZpcnN0Q2hpbGQpIHtcbiAgICBkYXkuZmlyc3RDaGlsZC5yZW1vdmUoKTtcbiAgfVxufVxuXG4vKipcbiAqIEFkZHMgMSB0byB0aGUgbW9udGggaW4gYSBnaXZlbiBkYXRlIHRvIG1ha2UgaXQgbW9yZSBodW1hbi1yZWFkYWJsZS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBkYXRlIC0gVGhlIGRhdGUgaW4gdGhlIGZvcm1hdCAnWVlZWS1NTS1ERCcgb3IgJ1lZWVktTS1EJy5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IC0gVGhlIG1vZGlmaWVkIGRhdGUgaW4gdGhlIGZvcm1hdCAnWVlZWS1NTS1ERCcuXG4gKiBAdGhyb3dzIHtFcnJvcn0gLSBJZiB0aGUgZGF0ZSBwYXJhbWV0ZXIgaXMgbm90IGluIHRoZSBmb3JtYXQgJ1lZWVktTU0tREQnIG9yICdZWVlZLU0tRCcuXG4gKi9cbmZ1bmN0aW9uIGh1bWFuRGF0ZSAoZGF0ZSkge1xuICBjb25zdCBkYXRlUGFydHMgPSBkYXRlLnNwbGl0KCctJyk7XG4gIGNvbnN0IG1vbnRoID0gcGFyc2VJbnQoZGF0ZVBhcnRzWzFdKSArIDE7XG4gIGNvbnN0IGRheSA9IHBhcnNlSW50KGRhdGVQYXJ0c1syXSk7XG4gIGNvbnN0IG1vZGlmaWVkTW9udGggPSBtb250aCA8IDEwID8gYDAke21vbnRofWAgOiBtb250aDtcbiAgY29uc3QgbW9kaWZpZWREYXkgPSBkYXkgPCAxMCA/IGAwJHtkYXl9YCA6IGRheTtcbiAgY29uc3QgbW9kaWZpZWREYXRlID0gYCR7ZGF0ZVBhcnRzWzBdfS0ke21vZGlmaWVkTW9udGh9LSR7bW9kaWZpZWREYXl9YDtcbiAgcmV0dXJuIG1vZGlmaWVkRGF0ZTtcbn1cblxuXG5mdW5jdGlvbiBzb3J0VGltZXMgKHZhbCkge1xuICB2YXIgc29ydGVkID0gW107XG4gIHJldHVybiBlbnVtZXJhdGUodmFsKTtcblxuICBmdW5jdGlvbiBzb3J0TnVtYmVyKGEsIGIpIHtcbiAgICByZXR1cm4gYSAtIGI7XG4gIH1cblxuICBmdW5jdGlvbiBlbnVtZXJhdGUodmFsdWVzKSB7XG4gICAgdmFyIG51bWVyaWNhbEVxdWl2YWxlbnQgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZhbHVlcy5sZW5ndGg7IGkrKykge1xuICAgICAgbnVtZXJpY2FsRXF1aXZhbGVudC5wdXNoKHRpbWVWYWx1ZUluTWlsbCh2YWx1ZXNbaV0pKTtcbiAgICAgIGlmIChpID09PSB2YWx1ZXMubGVuZ3RoIC0gMSkge1xuICAgICAgICByZXR1cm4gc29ydCh2YWx1ZXMsIG51bWVyaWNhbEVxdWl2YWxlbnQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHNvcnQodmFsdWVzLCBudW1lcmljYWxFcXVpdmFsZW50KSB7XG4gICAgdmFyIG51bWVyaWNhbEVxdWl2YWxlbnRDbG9uZSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkobnVtZXJpY2FsRXF1aXZhbGVudCkpO1xuICAgIHZhciBzb3J0ZWRJbnQgPSBudW1lcmljYWxFcXVpdmFsZW50LnNvcnQoc29ydE51bWJlcik7XG4gICAgZm9yICh2YXIgcCA9IDA7IHAgPCBudW1lcmljYWxFcXVpdmFsZW50Q2xvbmUubGVuZ3RoOyBwKyspIHtcbiAgICAgIHZhciBuZXdJbmRleCA9IHNvcnRlZEludC5pbmRleE9mKG51bWVyaWNhbEVxdWl2YWxlbnRDbG9uZVtwXSk7XG4gICAgICBzb3J0ZWQuc3BsaWNlKHAsIDEsIHZhbHVlc1tuZXdJbmRleF0pO1xuICAgICAgaWYgKHAgPT09IG51bWVyaWNhbEVxdWl2YWxlbnQubGVuZ3RoIC0gMSkge1xuICAgICAgICByZXR1cm4gc29ydGVkO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFJlbGVhc2UgZGF5IG9mIHdlZWtcbiAqIEBmdW5jdGlvbiByZWxlYXNlRGF5T2ZXZWVrR1xuICogQHBhcmFtIGRheUlEIGlkIG9mIHRoZSBkYXkgdG8gYmUgcmVsZWFzZWQuIE4uYi4gZGF5IG9mIHdlZWsgaXMgc3RvcmVkIGFzIGEgZGF0YSBhdHRyaWJ1dGVcbiAqIEB0b2RvIG1ha2UgaXQgdXNlIGxhc3REYXRlQ2xpY2tlZCAod2hpY2ggaXMgdGhlIGRheSBpbiBjb250ZXh0KVxuICovXG5mdW5jdGlvbiByZWxlYXNlRGF5T2ZXZWVrRyhkYXlJZCkge1xuICBjb25zdCB3ZWVrZGF5ID0gbGFzdERhdGVDbGlja2VkLmRhdGFzZXQuZGF5b2Z3ZWVrO1xuICBjb25zdCBibG9ja1RoZXNlRGF5cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJbZGF0YS1kYXlvZndlZWs9J1wiICsgd2Vla2RheSArIFwiJ11cIik7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYmxvY2tUaGVzZURheXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgYmxvY2tEYXkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChibG9ja1RoZXNlRGF5c1tpXS5pZCk7XG4gICAgaWYgKGJsb2NrRGF5ICE9PSBsYXN0RGF0ZUNsaWNrZWQpIHtcbiAgICAgIHJlbGVhc2VCb29rZWREYXkoYmxvY2tEYXksIGJsb2NrVGhlc2VEYXlzW2ldLmlkKTtcbiAgICAgIHJlbW92ZVRpbWVEaXNwbGF5KGJsb2NrVGhlc2VEYXlzW2ldLmlkKTtcbiAgICB9XG4gICAgaWYgKGJsb2NrRGF5ID09PSBsYXN0RGF0ZUNsaWNrZWQpIHtcbiAgICAgIC8vIHJlbW92ZSBvbmx5IHRoZSBkaXNwbGF5OlxuICAgICAgLy9yZW1vdmVUaW1lRGlzcGxheShibG9ja1RoZXNlRGF5c1tpXS5pZCk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCB7IHRpbWVWYWx1ZUluTWlsbCwgY2hlY2tPdmVybGFwLCBjbGVhclNlbGVjdGlvbiwgZ2V0RGF5c0luTW9udGgsIGdlbmVyYXRlUmFuZG9tU3RyaW5nLCBnZXRFYXJsaWVzdERhdGUsXG4gIHByZWxvYWREYXRlcywgYmxvY2tEYXlzTm90T3BlbiwgcmVsZWFzZUJvb2tlZERheSwgaHVtYW5EYXRlLCBzb3J0VGltZXMgfTtcblxuLy9ib29rRGF5IHNpbmdsZURhdGVDaG9pY2Vcbi8vcmVsZWFzZUJvb2tlZERheSBkYXRlc1NlbGVjdGVkQXJyYXlPYmplY3RzIGRhdGVzU2VsZWN0ZWRBcnJheSIsInZhciBjc3MgPSBcIi5jYWxlbmRhciB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZmxleC13cmFwOiB3cmFwO1xcbiAgZmxleC1kaXJlY3Rpb246IHJvdztcXG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjQwLCAyNDgsIDI1NSwgMCk7XFxuICB3aWR0aDogMTAwJTtcXG4gIGhlaWdodDogMjguOGVtO1xcbiAgb3ZlcmZsb3cteTogYXV0bztcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG59XFxuLmNhbGVuZGFyIC5ibG9ja2VkIHtcXG4gIGJhY2tncm91bmQtY29sb3I6ICMzMzM7XFxufVxcbi5jYWxlbmRhciAuZmlsbGVyIHtcXG4gIHBvaW50ZXItZXZlbnRzOiBub25lO1xcbiAgb3BhY2l0eTogMC4zO1xcbn1cXG4uY2FsZW5kYXIgLnRpbWVTZWxlY3Qge1xcbiAgcGFkZGluZzogMDtcXG4gIHdpZHRoOiBhdXRvO1xcbiAgbWFyZ2luOiAwO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZjtcXG4gIGZsb2F0OiByaWdodDtcXG4gIGZvbnQtd2VpZ2h0OiA3MDA7XFxuICBmb250LWZhbWlseTogQXJpYWwsIEhlbHZldGljYSwgc2Fucy1zZXJpZjtcXG4gIGJvcmRlci1zdHlsZTogc29saWQ7XFxuICBib3JkZXItcmFkaXVzOiAxZW07XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgYm9yZGVyLXdpZHRoOiAzcHg7XFxuICBib3JkZXItY29sb3I6ICNmMTU5MjU7XFxuICBjb2xvcjogIzAwMDtcXG4gIGZvbnQtc2l6ZTogMC45ZW07XFxufVxcbi5jYWxlbmRhciAudGltZUNvbnQge1xcbiAgbWFyZ2luLWxlZnQ6IGF1dG87XFxuICB3aWR0aDogMTBlbTtcXG4gIGJhY2tncm91bmQtY29sb3I6IGFsaWNlYmx1ZTtcXG4gIGJvcmRlci1zdHlsZTogc29saWQ7XFxuICBib3JkZXItY29sb3I6ICNmMTU5MjU7XFxuICBtYXJnaW4tcmlnaHQ6IGF1dG87XFxuICBtYXJnaW4tdG9wOiAxMGVtO1xcbn1cXG4uY2FsZW5kYXIgLmRheWJsb2Nrcm93IHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBmbGV4LWRpcmVjdGlvbjogcm93O1xcbiAgbWluLXdpZHRoOiAxMDAlO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogYWxpY2VibHVlO1xcbn1cXG4uY2FsZW5kYXIgLmNhbGVuZGFyVGltZVBhcmVudCB7XFxuICBtYXJnaW46IDAuMWVtO1xcbn1cXG4uY2FsZW5kYXIgLmNhbGVuZGFyVGltZVBhcmVudCAuY2FsZW5kYXJUaW1lIHtcXG4gIGZvbnQtc2l6ZTogMC45ZW07XFxuICBtYXJnaW4tdG9wOiAwZW07XFxuICBsaW5lLWhlaWdodDogMTtcXG4gIGJhY2tncm91bmQtY29sb3I6IGFsaWNlYmx1ZTtcXG4gIGNvbG9yOiBibGFjaztcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gIG1hcmdpbjogMHB4O1xcbn1cXG4uY2FsZW5kYXIgLndpZHRoU2hhcGVEYXlzIHtcXG4gIHdpZHRoOiAxNC4yODU3MTQyODU3JTtcXG4gIG1hcmdpbi1sZWZ0OiBhdXRvO1xcbiAgbWFyZ2luLXJpZ2h0OiBhdXRvO1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbn1cXG4uY2FsZW5kYXIgLndpZHRoU2hhcGUge1xcbiAgd2lkdGg6IDE0LjI4NTcxNDI4NTclO1xcbiAgbWFyZ2luLWxlZnQ6IGF1dG87XFxuICBtYXJnaW4tcmlnaHQ6IGF1dG87XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICBtaW4taGVpZ2h0OiAzLjZlbTtcXG4gIG1hcmdpbi1ib3R0b206IDAuMmVtO1xcbn1cXG4uY2FsZW5kYXIgLm1vbnRoTmFtZSB7XFxuICBtYXJnaW46IGF1dG87XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICBmb250LWZhbWlseTogVWJ1bnR1O1xcbiAgZm9udC1zaXplOiAxLjYxZW07XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMzM3YWI3O1xcbiAgY29sb3I6ICNmZmNjMzM7XFxuICBmbGV4LWJhc2lzOiAxMDAlO1xcbiAgYm9yZGVyLWJvdHRvbS1zdHlsZTogc29saWQ7XFxufVxcbi5jYWxlbmRhciAud2Vla3JvdyB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZmxleC13cmFwOiBub3dyYXA7XFxuICBmbGV4LWRpcmVjdGlvbjogcm93O1xcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZjtcXG4gIGZvbnQtZmFtaWx5OiBcXFwicm9ib3RvXFxcIiwgXFxcImFyaWFsXFxcIjtcXG59XFxuLmNhbGVuZGFyIC5kYXlOYW1lIHtcXG4gIGNvbG9yOiBibGFjaztcXG4gIGZvbnQtZmFtaWx5OiBcXFwicm9ib3RvXFxcIiwgXFxcImFyaWFsXFxcIjtcXG4gIGZvbnQtd2VpZ2h0OiA2MDA7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjY2NjO1xcbn1cXG4uY2FsZW5kYXIgLm1vbnRoID4gKiB7XFxuICBtYXJnaW4tbGVmdDogMnB4O1xcbiAgbWFyZ2luLXJpZ2h0OiAycHg7XFxufVxcbi5jYWxlbmRhciAubW9udGgge1xcbiAgd2lkdGg6IDUwJTtcXG4gIG1pbi13aWR0aDogMzAwcHg7XFxuICBtYXJnaW46IGF1dG87XFxufVxcbi5jYWxlbmRhciAudGltZUNob29zZXIge1xcbiAgd2lkdGg6IDEwZW07XFxuICBwb3NpdGlvbjogc3RhdGljO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogYWxpY2VibHVlO1xcbiAgbWFyZ2luLWxlZnQ6IGF1dG87XFxuICBtYXJnaW4tcmlnaHQ6IGF1dG87XFxufVxcbi5jYWxlbmRhciAudGltZUNvbnRhaW5lciB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbn1cXG4uY2FsZW5kYXIgLnRpbWVDaG9vc2VyTW9kYWwge1xcbiAgei1pbmRleDogMTtcXG4gIHdpZHRoOiAxMDAlO1xcbiAgaGVpZ2h0OiAxMDAlO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAwLCAwLCAwLjQpO1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgbWFyZ2luOiAwO1xcbiAgcGFkZGluZzogMDtcXG4gIGJvcmRlcjogMDtcXG59XFxuLmNhbGVuZGFyIC5jYWxlbmRhckxhYmVsIHtcXG4gIG1pbi13aWR0aDogM2VtO1xcbiAgcGFkZGluZzogMGVtIDFlbSAwZW0gMWVtO1xcbiAgY29sb3I6IGJsYWNrO1xcbiAgZm9udC1mYW1pbHk6IFxcXCJyb2JvdG9cXFwiLCBcXFwiYXJpYWxcXFwiO1xcbiAgZm9udC13ZWlnaHQ6IDYwMDtcXG4gIGJhY2tncm91bmQtY29sb3I6ICNjY2M7XFxuICBtYXJnaW46IDFlbSAwIDFlbSAwO1xcbn1cXG4uY2FsZW5kYXIgLmRlbGV0ZURpdiB7XFxuICBmb250LWZhbWlseTogVWJ1bnR1O1xcbiAgZm9udC1zaXplOiAxLjYxZW07XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMzM3YWI3O1xcbiAgY29sb3I6ICNmZmNjMzM7XFxuICBib3JkZXItYm90dG9tLXN0eWxlOiBzb2xpZDtcXG4gIGhlaWdodDogMmVtO1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG59XFxuLmNhbGVuZGFyIC5kZWxldGVCdXR0b24ge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogd2hpdGU7XFxuICBjb2xvcjogI2YxNTkyNTtcXG4gIGZsb2F0OiByaWdodDtcXG4gIGZvbnQtd2VpZ2h0OiA3MDA7XFxuICBmb250LWZhbWlseTogQXJpYWwsIEhlbHZldGljYSwgc2Fucy1zZXJpZjtcXG4gIGJvcmRlci1zdHlsZTogc29saWQ7XFxuICBib3JkZXItcmFkaXVzOiAxZW07XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICBoZWlnaHQ6IDMwcHg7XFxuICB3aWR0aDogMzBweDtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxufVxcbi5jYWxlbmRhciAuaW5uZXJTcGFuRGVsZXRlQnRuIHtcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG59XFxuLmNhbGVuZGFyIC5kZWxldGVCdXR0b246aG92ZXIsXFxuLmNhbGVuZGFyIC5kZWxldGVCdXR0b246Zm9jdXMsXFxuLmNhbGVuZGFyIC50aW1lU2VsZWN0OmhvdmVyLFxcbi5jYWxlbmRhciAudGltZVNlbGVjdDpmb2N1cyB7XFxuICBjb2xvcjogIzAwMDtcXG4gIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcXG4gIGN1cnNvcjogcG9pbnRlcjtcXG59XFxuLmNhbGVuZGFyIC5ob3VyIHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuICB3aWR0aDogMTBlbTtcXG59XFxuLmNhbGVuZGFyIC50aW1lU2VsZWN0UCB7XFxuICBkaXNwbGF5OiBpbmxpbmU7XFxuICB3aWR0aDogNWVtO1xcbiAgY29sb3I6ICMwMDA7XFxufVxcbi5jYWxlbmRhciAudGltZUNob29zZXIgPiBpbnB1dFt0eXBlPWNoZWNrYm94XSB7XFxuICBvdXRsaW5lOiAjZjE1OTI1O1xcbiAgb3V0bGluZS1zdHlsZTogc29saWQ7XFxufVxcbi5jYWxlbmRhciAudGltZVNlbGVjdCA+IG9wdGlvbiB7XFxuICBjb2xvcjogIzAwMDtcXG59XFxuLmNhbGVuZGFyIC5jYWxlbmRhciA+IHAsXFxuLmNhbGVuZGFyIGg0LFxcbi5jYWxlbmRhciBoMyxcXG4uY2FsZW5kYXIgaDIsXFxuLmNhbGVuZGFyIGgxLFxcbi5jYWxlbmRhciBzZWxlY3QsXFxuLmNhbGVuZGFyIG9wdGlvbiB7XFxuICBjb2xvcjogIzAwMDtcXG59XFxuLmNhbGVuZGFyIC5hcnJvdy11cCB7XFxuICB3aWR0aDogMDtcXG4gIGhlaWdodDogMDtcXG4gIGJvcmRlci1sZWZ0OiAxMHB4IHNvbGlkIHRyYW5zcGFyZW50O1xcbiAgYm9yZGVyLXJpZ2h0OiAxMHB4IHNvbGlkIHRyYW5zcGFyZW50O1xcbiAgYm9yZGVyLWJvdHRvbTogMTBweCBzb2xpZCBibGFjaztcXG59XFxuLmNhbGVuZGFyIC5hcnJvdy1kb3duIHtcXG4gIHdpZHRoOiAwO1xcbiAgaGVpZ2h0OiAwO1xcbiAgYm9yZGVyLWxlZnQ6IDEwcHggc29saWQgdHJhbnNwYXJlbnQ7XFxuICBib3JkZXItcmlnaHQ6IDEwcHggc29saWQgdHJhbnNwYXJlbnQ7XFxuICBib3JkZXItdG9wOiAxMHB4IHNvbGlkICMwMDA7XFxufVxcbi5jYWxlbmRhciAuYXJyb3dzIHtcXG4gIGZsb2F0OiByaWdodDtcXG4gIGNsZWFyOiByaWdodDtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gIGN1cnNvcjogcG9pbnRlcjtcXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxufVxcbi5jYWxlbmRhciAuYXJyb3ctcmlnaHQge1xcbiAgd2lkdGg6IDA7XFxuICBoZWlnaHQ6IDA7XFxuICBib3JkZXItdG9wOiA2MHB4IHNvbGlkIHRyYW5zcGFyZW50O1xcbiAgYm9yZGVyLWJvdHRvbTogNjBweCBzb2xpZCB0cmFuc3BhcmVudDtcXG4gIGJvcmRlci1sZWZ0OiA2MHB4IHNvbGlkIGdyZWVuO1xcbn1cXG4uY2FsZW5kYXIgLmFycm93LWxlZnQge1xcbiAgd2lkdGg6IDA7XFxuICBoZWlnaHQ6IDA7XFxuICBib3JkZXItdG9wOiAxMHB4IHNvbGlkIHRyYW5zcGFyZW50O1xcbiAgYm9yZGVyLWJvdHRvbTogMTBweCBzb2xpZCB0cmFuc3BhcmVudDtcXG4gIGJvcmRlci1yaWdodDogMTBweCBzb2xpZCBibHVlO1xcbn1cXG4uY2FsZW5kYXIgLmRheVRpbWUge1xcbiAgY3Vyc29yOiBwb2ludGVyO1xcbn1cXG4uY2FsZW5kYXIgLmRheVRpbWUgPiAqIHtcXG4gIHBvaW50ZXItZXZlbnRzOiBub25lO1xcbn1cXG5cIjsgKHJlcXVpcmUoXCJicm93c2VyaWZ5LWNzc1wiKS5jcmVhdGVTdHlsZShjc3MsIHsgXCJocmVmXCI6IFwicHJlQnVuZGxpbmdKUy9jYWxlbmRhckFwcC5jc3NcIiB9LCB7IFwiaW5zZXJ0QXRcIjogXCJib3R0b21cIiB9KSk7IG1vZHVsZS5leHBvcnRzID0gY3NzOyIsIi8qKlxuICogQHR5cGVkZWYge09iamVjdH0gSGFzVGVzdHNUYWdcbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gaGFzVGVzdHMgLSBJbmRpY2F0ZXMgd2hldGhlciB0aGUgZnVuY3Rpb24gaGFzIHRlc3RzLlxuICovXG5cbi8qKlxuICogQHR5cGVkZWYge09iamVjdH0gaGFzVGhlc2VTdHlsZXNcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBoYXNUaGVzZVN0eWxlcyAtIExpc3RzIHN0eWxlcyByZWZlcmVuY2VzIGluIGEgZnVudGlvblxuICovXG5cbmltcG9ydCB7XG4gIGdldERheXNJbk1vbnRoLCBnZW5lcmF0ZVJhbmRvbVN0cmluZywgZ2V0RWFybGllc3REYXRlLFxuICBwcmVsb2FkRGF0ZXMsIGJsb2NrRGF5c05vdE9wZW4sIGh1bWFuRGF0ZSwgY2xlYXJTZWxlY3Rpb25cbn0gZnJvbSAnLi9iYXNpY0Z1bmN0aW9ucy5qcyc7XG5pbXBvcnQgeyBkaXNwbGF5VGltZUNob29zZXJNb2RhbCwgZ2V0U2VsZWN0ZWRUaW1lcywgd3JpdGVUaW1lc1RvQWxsIH0gZnJvbSAnLi9kaXNwbGF5VGltZUNob29zZXJNb2RhbC5qcyc7XG5pbXBvcnQgeyBjb2xvdXJzLCBzZWxlY3RlZFN0eWxlLCB1bnNlbGVjdGVkU3R5bGUgfSBmcm9tICcuL3N0eWxlcy5qcyc7XG5pbXBvcnQgeyBsYW5ndWFnZXMgfSBmcm9tICcuL2xhbmd1YWdlcy5qcyc7XG5pbXBvcnQgc3R5bGUgZnJvbSAnLi9jYWxlbmRhckFwcC5jc3MnO1xuXG4vKipcbiAqIEFkZHMgdGhlIHNwZWNpZmllZCBudW1iZXIgb2YgbW9udGhzIHRvIGEgZGF0ZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBtb250aHMgLSBUaGUgbnVtYmVyIG9mIG1vbnRocyB0byBhZGQuXG4gKiBAcmV0dXJucyB7RGF0ZX0gLSBUaGUgdXBkYXRlZCBkYXRlLlxuICovXG5EYXRlLnByb3RvdHlwZS5hZGRNb250aHMgPSBmdW5jdGlvbihtb250aHMpIHtcbiAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKHRoaXMpO1xuICBjb25zdCB5ZWFycyA9IE1hdGguZmxvb3IobW9udGhzIC8gMTIpO1xuICBjb25zdCByZW1haW5pbmdNb250aHMgPSBtb250aHMgJSAxMjtcbiAgaWYgKHllYXJzKSB7XG4gICAgZGF0ZS5zZXRGdWxsWWVhcihkYXRlLmdldEZ1bGxZZWFyKCkgKyB5ZWFycyk7XG4gIH1cbiAgaWYgKHJlbWFpbmluZ01vbnRocykge1xuICAgIGRhdGUuc2V0TW9udGgoZGF0ZS5nZXRNb250aCgpICsgcmVtYWluaW5nTW9udGhzKTtcbiAgfVxuICByZXR1cm4gZGF0ZTtcbn07XG5cbmN1c3RvbUVsZW1lbnRzLmRlZmluZSgnc3dpZnQtY2FsJywgY2xhc3MgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG4gIGNvbnN0cnVjdG9yICgpIHtcbiAgICBzdXBlcigpO1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIGZ1bmN0aW9uIHN0VG9Cb29sZWFuIChzdCkge1xuICAgICAgY29uc29sZS5sb2coc3QpXG4gICAgICBpZihzdCA9PT0gJ3RydWUnKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBcbiAgICBjb25zdCBjYWxlbmRhciA9IG5ldyBTd2lmdENhbCgpO1xuICAgIGNhbGVuZGFyLmdlbmVyYXRlQ2FsZW5kYXIoXG4gICAgICB7XG4gICAgICAgIHRhcmdldDogc2VsZixcbiAgICAgICAgLy8gZGF0YS1udW1iZXItb2YtbW9udGhzLXRvLWRpc3BsYXkgaHRtbCBjb252ZXJ0cyB0byBudW1iZXJPZk1vbnRoc1RvRGlzcGxheSBKU1xuICAgICAgICBudW1iZXJPZk1vbnRoc1RvRGlzcGxheTogdGhpcy5kYXRhc2V0Lm51bWJlck9mTW9udGhzVG9EaXNwbGF5LFxuICAgICAgICAvLyBkYXRhLWRpc3BsYXktdGltZS1jaG9vc2VyLW1vZGFsXG4gICAgICAgIGRpc3BsYXlUaW1lQ2hvb3Nlck1vZGFsOiBzdFRvQm9vbGVhbih0aGlzLmRhdGFzZXQuZGlzcGxheVRpbWVDaG9vc2VyTW9kYWwpLFxuICAgICAgICAvLyBkYXRhLXNpbmdsZS1kYXRlLWNob2ljZVxuICAgICAgICBzaW5nbGVEYXRlQ2hvaWNlOiBzdFRvQm9vbGVhbih0aGlzLmRhdGFzZXQuc2luZ2xlRGF0ZUNob2ljZSksXG5cbiAgICAgICAgbGFuZ3VhZ2U6IHRoaXMuZGF0YXNldC5sYW5ndWFnZSxcbiAgICAgICAgLy9kYXRhLXNlbGVjdC1tdWx0aXBsZVxuICAgICAgICBzZWxlY3RNdWx0aXBsZTogdGhpcy5kYXRhc2V0LnNlbGVjdE11bHRpcGxlXG5cbiAgICAgIH0pO1xuICAgIHRoaXMuZHluYW1pY0RhdGEgPSBjYWxlbmRhci5yZXR1cm5EeW5hbWljRGF0YSgpO1xuICB9XG59KTtcblxuZnVuY3Rpb24gU3dpZnRDYWwgKCkge1xuICBjb25zdCBjb25maWcgPSB7fTtcblxuICBjb25zdCBoYW5kbGVyID0ge1xuICAgIGdldDogKHRhcmdldCwga2V5KSA9PiB7XG4gICAgICBpZih0eXBlb2YgdGFyZ2V0W2tleV0gPT09ICdvYmplY3QnICYmIHRhcmdldFtrZXldICE9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJveHkodGFyZ2V0W2tleV0sIGhhbmRsZXIpO1xuICAgICAgfVxuXG4gICAgICBpZihBcnJheS5pc0FycmF5KHRhcmdldCkgJiYgdHlwZW9mIHRhcmdldFswXSA9PT0gJ29iamVjdCcgJiYgT2JqZWN0LmtleXModGFyZ2V0WzBdKS5pbmNsdWRlcygndGltZXMnKSl7XG4gICAgICAgIGVtaXREYXRlU2VsZWN0ZWRFdmVudCgpO1xuICAgICAgfVxuICAgICAgXG4gICAgICByZXR1cm4gdGFyZ2V0W2tleV07XG4gICAgfSxcbiAgICBzZXQ6ICh0YXJnZXQsIHByb3AsIHZhbHVlKSA9PiB7XG4gICAgICB0YXJnZXRbcHJvcF0gPSB2YWx1ZTtcbiAgICAgIGVtaXREYXRlU2VsZWN0ZWRFdmVudCgpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG4gIFxuICBjb25zdCBkYXRhVGVtcGxhdGUgPSB7XG4gICAgZGF0ZXNTZWxlY3RlZEFycmF5OiBbXSxcbiAgICBkYXRlc1NlbGVjdGVkQXJyYXlPYmplY3RzOiBbXSxcbiAgICBkaXNhYmxlZDogZmFsc2VcbiAgfTtcblxuICBjb25zdCBkeW5hbWljRGF0YSA9IG5ldyBQcm94eShkYXRhVGVtcGxhdGUsIGhhbmRsZXIpO1xuXG4gIGZ1bmN0aW9uIGVtaXREYXRlU2VsZWN0ZWRFdmVudCAoKSB7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBjb25zdCBldnQgPSBuZXcgQ3VzdG9tRXZlbnQoJ2RhdGVTZWxlY3QnLCB7IGRhdGE6IGR5bmFtaWNEYXRhIH0pO1xuICAgICAgY29uZmlnLmNhbGVuZGFyQ29udGFpbmVyLmRpc3BhdGNoRXZlbnQoZXZ0KTtcbiAgICB9LCAyNTApXG4gIH1cbiAgXG4gIGNvbnN0IGNhbGVuZGFyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cbiAgdGhpcy5yZXR1cm5DYWxlbmRhciA9ICgpID0+IHtcbiAgICByZXR1cm4gY2FsZW5kYXI7XG4gIH07XG5cbiAgdGhpcy5yZXR1cm5EeW5hbWljRGF0YSA9ICgpID0+IHtcbiAgICByZXR1cm4gZHluYW1pY0RhdGE7XG4gIH07XG5cbiAgdGhpcy5yZXR1cm5Db25maWcgPSAoKSA9PiB7XG4gICAgcmV0dXJuIGNvbmZpZztcbiAgfTtcblxuICB0aGlzLnNldENvbmZpZyA9IChjb25maWdPYmopID0+IHtcbiAgICAvLyBJZiBjYWxsZWQgdmlhIEhUTUxcbiAgICBjb25maWcuY2FsZW5kYXJDb250YWluZXIgPSBjb25maWdPYmoudGFyZ2V0IHx8IGZhbHNlO1xuICAgIC8vIElmIGNhbGxlZCB2aWEgSmF2YXNjcmlwdFxuICAgIGNvbmZpZy5wYXJlbnREaXYgPSAodHlwZW9mIGNvbmZpZ09iai5wYXJlbnREaXYgPT09ICdzdHJpbmcnKSA/IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoY29uZmlnT2JqLnBhcmVudERpdikgOiBjb25maWdPYmoucGFyZW50RGl2O1xuICAgIC8vIGRvbmVcbiAgICBjb25maWcubnVtYmVyT2ZNb250aHNUb0Rpc3BsYXkgPSBjb25maWdPYmoubnVtYmVyT2ZNb250aHNUb0Rpc3BsYXkgfHwgMTI7XG4gICAgLy8gZG9uZVxuICAgIGNvbmZpZy5kaXNwbGF5VGltZUNob29zZXJNb2RhbCA9IGNvbmZpZ09iai5kaXNwbGF5VGltZUNob29zZXJNb2RhbCAmJiB0cnVlO1xuICAgIC8vIGRvbmVcbiAgICBjb25maWcuc2luZ2xlRGF0ZUNob2ljZSA9IGNvbmZpZ09iai5zaW5nbGVEYXRlQ2hvaWNlICYmIHRydWU7XG4gICAgLy8gZG9uZVxuICAgIGNvbmZpZy5zZWxlY3RSYW5nZSA9ICFjb25maWdPYmouc2luZ2xlRGF0ZUNob2ljZTtcbiAgICAvLyBkb25lXG4gICAgY29uZmlnLmxhbmd1YWdlID0gY29uZmlnT2JqLmxhbmd1YWdlIHx8ICdlbkdiJztcbiAgICAvLyBkb25lXG4gICAgY29uZmlnLnNlbGVjdE11bHRpcGxlID0gY29uZmlnLnNlbGVjdE11bHRpcGxlIHx8IGZhbHNlO1xuICAgIC8vIGRvbmVcbiAgICBjb25maWcuZGlzcGxheVRpbWVTZWxlY3Rpb25PbkRhdGUgPSBjb25maWdPYmouZGlzcGxheVRpbWVTZWxlY3Rpb25PbkRhdGUgfHwgdHJ1ZTtcblxuICAgIGNvbmZpZy5wcmVsb2FkZWREYXRlcyA9IGNvbmZpZ09iai5wcmVsb2FkZWREYXRlcyB8fCBbXTtcbiAgICBjb25maWcuZW5kVXNlciA9IGNvbmZpZ09iai5lbmRVc2VyIHx8IGZhbHNlO1xuICAgIGNvbmZpZy5lbmRVc2VyRHVyYXRpb25DaG9pY2UgPSBjb25maWdPYmouZW5kVXNlckR1cmF0aW9uQ2hvaWNlIHx8IGZhbHNlO1xuICAgIGNvbmZpZy5iYWNrZW5kID0gY29uZmlnT2JqLmJhY2tlbmQgfHwgZmFsc2U7XG4gICAgY29uZmlnLmRpc3BsYXlCbG9ja2VkID0gY29uZmlnT2JqLmRpc3BsYXlCbG9ja2VkIHx8IGZhbHNlO1xuICAgIGNvbmZpZy5kYXRlc09wZW4gPSBjb25maWdPYmouZGF0ZXNPcGVuIHx8IGZhbHNlO1xuICB9O1xuXG4gIHRoaXMuZ2VuZXJhdGVDYWxlbmRhciA9IChjb25maWdPYmopID0+IHtcbiAgICBpZiAoY29uZmlnT2JqKSB7XG4gICAgICBjb25zb2xlLmxvZyhjb25maWdPYmopO1xuICAgICAgdGhpcy5zZXRDb25maWcoY29uZmlnT2JqKTtcbiAgICB9XG4gICAgLy8gSWYgY2FsbGVkIHZpYSBqYXZhc2NyaXB0IGEgcGFyZW50RWxlbWVudCBuZWVkcyB0byBiZSBwcm92aWRlZFxuICAgIGNvbnN0IHBhcmVudERpdiA9IGNvbmZpZy5wYXJlbnREaXY7XG4gICAgLypcbiAgICAgIElmIGNhbGxlZCBmcm9tIGh0bWwgYXMgYSBjdXN0b20gY29tcG9uZW50IHRoZSBjb21wb25lbnQgaXRzZWxmIGlzIHBhc3NlZCAoY2FsZW5kYXJDb250YWluZXIpXG4gICAgICBJZiBjYWxsZWQgdmlhIEpTIHdoaWxlIHRoZSBjb21wb25lbnQgaXNuJ3QgYSB3ZWJjb21wb25lbnQgaW4gdGhlIHN0cmljdGVzdCBzZW5zZSwgaXQgc3RpbGxcbiAgICAgIGJlaGF2ZXMgbGlrZSBvbmUgYW5kIGlzIGVuY2Fwc3VsYXRlZCBpbiBhIHNoYWRvdy5cbiAgICAqL1xuXG4gICAgaWYgKGNvbmZpZy5jYWxlbmRhckNvbnRhaW5lcikge1xuICAgICAgc2hhZG93QXR0YWNoKGNvbmZpZy5jYWxlbmRhckNvbnRhaW5lcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5ld0NvbnRhaW5lcigpLnRoZW4oKGNvbnRhaW5lcikgPT4ge1xuICAgICAgICBzaGFkb3dBdHRhY2goY29udGFpbmVyKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG5ld0NvbnRhaW5lciAoKSB7XG4gICAgICBjb25zdCBwcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBjb25zdCBuZXdDYWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgbmV3Q2FsLmNsYXNzTGlzdC5hZGQoJ3N3aWZ0LWNhbCcpO1xuICAgICAgICBwYXJlbnREaXYuYXBwZW5kQ2hpbGQobmV3Q2FsKTtcbiAgICAgICAgcmVzb2x2ZShuZXdDYWwpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzaGFkb3dBdHRhY2ggKGNvbnRhaW5lcikge1xuICAgICAgY29uc3Qgc2hhZG93Um9vdCA9IGNvbnRhaW5lci5hdHRhY2hTaGFkb3coeyBtb2RlOiAnb3BlbicgfSk7XG4gICAgICBjb25zdCBjc3MgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgICAgY3NzLnRleHRDb250ZW50ID0gc3R5bGU7XG4gICAgICBzaGFkb3dSb290LmFwcGVuZENoaWxkKGNzcyk7XG4gICAgICBzaGFkb3dSb290LmFwcGVuZENoaWxkKGNhbGVuZGFyKTtcbiAgICB9XG5cbiAgICBjb25zdCBwcmVsb2FkZWREYXRlcyA9IGNvbmZpZy5wcmVsb2FkZWREYXRlcztcbiAgICBjb25zdCBudW1iZXJPZk1vbnRoc1RvRGlzcGxheSA9IGNvbmZpZy5udW1iZXJPZk1vbnRoc1RvRGlzcGxheTtcbiAgICBjb25zdCBkYXRlc09wZW4gPSBjb25maWcuZGF0ZXNPcGVuO1xuICAgIGNvbnN0IGxhbmd1YWdlID0gY29uZmlnLmxhbmd1YWdlO1xuICAgIC8vIFRPRE86XG4gICAgY29uc3QgZGlzcGxheVRpbWVDaG9vc2VyTW9kYWwgPSBjb25maWcuZGlzcGxheVRpbWVDaG9vc2VyTW9kYWw7XG4gICAgY29uc3QgZW5kVXNlciA9IGNvbmZpZy5lbmRVc2VyO1xuICAgIGNvbnN0IGVuZFVzZXJEdXJhdGlvbkNob2ljZSA9IGNvbmZpZy5lbmRVc2VyRHVyYXRpb25DaG9pY2U7XG4gICAgY29uc3QgYmFja2VuZCA9IGNvbmZpZy5iYWNrZW5kO1xuICAgIGNvbnN0IGRpc3BsYXlCbG9ja2VkID0gY29uZmlnLmRpc3BsYXlCbG9ja2VkO1xuICAgIGNvbnN0IHNpbmdsZURhdGVDaG9pY2UgPSBjb25maWcuc2luZ2xlRGF0ZUNob2ljZTtcbiAgICBjb25zdCBzZWxlY3RSYW5nZSA9IGNvbmZpZy5zZWxlY3RSYW5nZTtcblxuICAgIGxldCB1bmlxdWVEYXlJbmRleCA9IDA7XG4gICAgLy8gQ2FsZW5kYXIgaXMgZGVmaW5lZCBnbG9iYWxseSB3aXRoaW4gdGhlIGNvbnN0cnVjdG9yXG4gICAgY29uc3QgY2FsZW5kYXJVbmlxdWVJZCA9IGdlbmVyYXRlUmFuZG9tU3RyaW5nKCk7XG4gICAgY2FsZW5kYXIuaWQgPSBgY2FsZW5kYXItJHtjYWxlbmRhclVuaXF1ZUlkfWA7XG4gICAgY2FsZW5kYXIuY2xhc3NMaXN0LmFkZCgnY2FsZW5kYXInKTtcblxuICAgIGNvbnN0IG1vbnRocyA9IFtdO1xuICAgIGNvbnN0IGRhdGVOb3cgPSBuZXcgRGF0ZSgpO1xuICAgIGNvbnN0IGVhcmxpZXN0RGF0ZSA9IChwcmVsb2FkZWREYXRlcyAmJiBwcmVsb2FkZWREYXRlcy5ib29rZWQpID8gZ2V0RWFybGllc3REYXRlKHByZWxvYWRlZERhdGVzKSA6IGRhdGVOb3c7XG4gICAgY29uc3Qgc3RhcnRNb250aCA9IGVhcmxpZXN0RGF0ZS5nZXRNb250aCgpO1xuICAgIGNvbnN0IG1vbnRoTmFtZXMgPSBsYW5ndWFnZXNbbGFuZ3VhZ2VdLmdlbmVyYWxUaW1lLm1vbnRocztcbiAgICAvKiBDcmVhdGUgbW9udGggdmlldyAqL1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtYmVyT2ZNb250aHNUb0Rpc3BsYXk7IGkrKykge1xuICAgICAgLyogTW9udGggc3BlY2lmaWMgdmFyaWFibGVzIGFuZCB0cmFja2VycyAqL1xuICAgICAgY29uc3QgeWVhckNhbGMgPSBlYXJsaWVzdERhdGUuYWRkTW9udGhzKGkpLmdldEZ1bGxZZWFyKCk7XG4gICAgICBjb25zdCBtb250aENhbGMgPSAoc3RhcnRNb250aCArIGkpICUgMTI7XG4gICAgICBjb25zdCBzdGFydERheU9mTW9udGggPSBuZXcgRGF0ZSh5ZWFyQ2FsYywgbW9udGhDYWxjKS5nZXREYXkoKTtcbiAgICAgIGNvbnN0IGRheXNJbk1vbnRoID0gZ2V0RGF5c0luTW9udGgoKHN0YXJ0TW9udGggKyBpICsgMSkgJSAxMiwgZWFybGllc3REYXRlLmFkZE1vbnRocyhpKS5nZXRGdWxsWWVhcigpKTtcbiAgICAgIGxldCBjb3VudCA9IDE7XG4gICAgICBsZXQgZGF5b2Z3ZWVrID0gMDtcblxuICAgICAgLyogQ3JlYXRlIG1vbnRoIGRpdiAqL1xuICAgICAgY29uc3QgbW9udGggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIG1vbnRocy5wdXNoKG1vbnRoKTtcbiAgICAgIG1vbnRoLnN0eWxlLndpZHRoID0gJzE1ZW0nO1xuICAgICAgbW9udGguc3R5bGUuYmFja2dyb3VuZENvbG9yID0gY29sb3Vycy5tb250aEJvcmRlckNvbG9yO1xuICAgICAgbW9udGguY2xhc3NMaXN0LmFkZCgnbW9udGgnKTtcbiAgICAgIGNhbGVuZGFyLmFwcGVuZENoaWxkKG1vbnRoKTtcblxuICAgICAgLyogQ3JlYXRlIG1vbnRoIG5hbWUgZGl2IChtb250aCBZWVlZKSBhdCB0aGUgdG9wIG9mIG1vbnRoIGRpc3BsYXkgKi9cbiAgICAgIGNvbnN0IG1vbnRoTmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgbW9udGhOYW1lLmNsYXNzTGlzdC5hZGQoJ21vbnRoTmFtZScpO1xuICAgICAgbW9udGhOYW1lLnRleHRDb250ZW50ID0gYCR7bW9udGhOYW1lc1soc3RhcnRNb250aCArIGkpICUgMTJdfSAke2VhcmxpZXN0RGF0ZS5nZXRGdWxsWWVhcigpfWA7XG4gICAgICBtb250aC5hcHBlbmRDaGlsZChtb250aE5hbWUpO1xuXG4gICAgICAvKiBDcmVhdGUgZGl2IHdpdGggbmFtZWQgZGF5cyBvZiB0aGUgd2VlayAqL1xuICAgICAgY29uc3QgZGF5TmFtZXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIG1vbnRoLmFwcGVuZENoaWxkKGRheU5hbWVzKTtcbiAgICAgIGRheU5hbWVzLmNsYXNzTGlzdC5hZGQoJ3dlZWtyb3cnKTtcbiAgICAgIGxhbmd1YWdlc1tsYW5ndWFnZV0uZ2VuZXJhbFRpbWUuZGF5c1RydW5jYXRlZC5mb3JFYWNoKChkYXlOYW1lKSA9PiB7XG4gICAgICAgIGNvbnN0IGRheSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBkYXkudGV4dENvbnRlbnQgPSBkYXlOYW1lO1xuICAgICAgICBkYXkuY2xhc3NMaXN0LmFkZCgnZGF5TmFtZScsICd3aWR0aFNoYXBlRGF5cycpO1xuICAgICAgICBkYXlOYW1lcy5hcHBlbmRDaGlsZChkYXkpO1xuICAgICAgfSk7XG5cbiAgICAgIC8qIENyZWF0ZSB3ZWVrIHJvd3MgZmlyc3Qgd2VlaywgaXQncyByZWFzaWduZWQgZiAqL1xuICAgICAgbGV0IHdlZWtSb3c7XG4gICAgICBmdW5jdGlvbiBtYWtlTmV3V2Vla1JvdyAoKSB7XG4gICAgICAgIHdlZWtSb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgbW9udGguYXBwZW5kQ2hpbGQod2Vla1Jvdyk7XG4gICAgICAgIHdlZWtSb3cuY2xhc3NMaXN0LmFkZCgnd2Vla3JvdycpO1xuICAgICAgICBkYXlvZndlZWsgPSAwO1xuICAgICAgfVxuXG4gICAgICAvLyA0MiBkYXlzLCBpLmUuIDYgcm93cyBvZiA3XG4gICAgICBmb3IgKGxldCBwID0gMDsgcCA8IDQyOyBwKyspIHtcbiAgICAgICAgaWYgKHAgPT09IDApIHtcbiAgICAgICAgICBtYWtlTmV3V2Vla1JvdygpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwIDwgc3RhcnREYXlPZk1vbnRoKSB7XG4gICAgICAgICAgY29uc3QgcGVnaG9sZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgIHBlZ2hvbGUuY2xhc3NMaXN0LmFkZCgnd2lkdGhTaGFwZScsICdmaWxsZXInKTtcbiAgICAgICAgICB1bnNlbGVjdGVkU3R5bGUocGVnaG9sZSk7XG4gICAgICAgICAgd2Vla1Jvdy5hcHBlbmRDaGlsZChwZWdob2xlKTtcbiAgICAgICAgICBkYXlvZndlZWsrKztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwID49IHN0YXJ0RGF5T2ZNb250aCAmJiBwIDw9IChzdGFydERheU9mTW9udGggKyBkYXlzSW5Nb250aCAtIDEpKSB7XG4gICAgICAgICAgY29uc3QgcGVnaG9sZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgIHBlZ2hvbGUudGV4dENvbnRlbnQgPSBjb3VudDtcbiAgICAgICAgICBwZWdob2xlLmRhdGFzZXQuZGF5ID0gY291bnQ7XG4gICAgICAgICAgcGVnaG9sZS5kYXRhc2V0LmRheW9md2VlayA9IGRheW9md2VlaztcbiAgICAgICAgICBwZWdob2xlLmRhdGFzZXQuZGF5aW5kZXggPSB1bmlxdWVEYXlJbmRleDtcbiAgICAgICAgICBwZWdob2xlLmNsYXNzTGlzdC5hZGQoJ3dpZHRoU2hhcGUnLCAnZGF5VGltZScpO1xuICAgICAgICAgIHBlZ2hvbGUuZGF0YXNldC5odW1hbmRhdGUgPSBodW1hbkRhdGUoYCR7eWVhckNhbGN9LSR7bW9udGhDYWxjfS0ke2NvdW50fWApO1xuICAgICAgICAgIC8vIHBlZ2hvbGUuaWQgPSBgJHt5ZWFyQ2FsY30tJHttb250aENhbGN9LSR7Y291bnR9YDtcbiAgICAgICAgICBwZWdob2xlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgICAgICAgIGRhdGVPbkNsaWNrRXZlbnRzKGUpO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgd2Vla1Jvdy5hcHBlbmRDaGlsZChwZWdob2xlKTtcblxuICAgICAgICAgIGlmIChpID09PSAwICYmIHAgPj0gc3RhcnREYXlPZk1vbnRoICYmIHAgPCAobmV3IERhdGUoKS5nZXREYXRlKCkgKyBzdGFydERheU9mTW9udGgpKSB7XG4gICAgICAgICAgICBwZWdob2xlLmNsYXNzTGlzdC5hZGQoJ2ZpbGxlcicpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvdW50Kys7XG4gICAgICAgICAgZGF5b2Z3ZWVrKys7XG4gICAgICAgICAgdW5pcXVlRGF5SW5kZXgrKztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwID49IGRheXNJbk1vbnRoICsgc3RhcnREYXlPZk1vbnRoKSB7XG4gICAgICAgICAgY29uc3QgcGVnaG9sZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgIHBlZ2hvbGUuY2xhc3NMaXN0LmFkZCgnd2lkdGhTaGFwZScsICdmaWxsZXInKTtcbiAgICAgICAgICB3ZWVrUm93LmFwcGVuZENoaWxkKHBlZ2hvbGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKChwICsgMSkgJSA3ID09PSAwKSB7XG4gICAgICAgICAgbWFrZU5ld1dlZWtSb3coKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGkgPT09IG51bWJlck9mTW9udGhzVG9EaXNwbGF5IC0gMSkge1xuICAgICAgICBwcmVsb2FkRGF0ZXMoY2FsZW5kYXIsIHByZWxvYWRlZERhdGVzKTtcbiAgICAgICAgYmxvY2tEYXlzTm90T3BlbihjYWxlbmRhciwgZGF0ZXNPcGVuKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgbGV0IGNsaWNrQ291bnQgPSAxO1xuXG4gIGZ1bmN0aW9uIGRhdGVPbkNsaWNrRXZlbnRzIChlKSB7XG4gIFxuICAgIGNvbnN0IGRhdGVEaXYgPSBlLnRhcmdldDtcbiAgICBjbGlja0NvdW50Kys7XG5cbiAgICBpZiAoZHluYW1pY0RhdGEuZGlzYWJsZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoZGF0ZURpdi5jbGFzc0xpc3QuY29udGFpbnMoJ2Jsb2NrZWQnKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChjYWxlbmRhci5xdWVyeVNlbGVjdG9yKCcubWFrZVRpbWVSdWxlR2xvYmFsJykpIHtcbiAgICAgIGNhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoJy5tYWtlVGltZVJ1bGVHbG9iYWxDbGFzcycpLnRleHRDb250ZW50ID0gZm9ybWF0RGF5VGV4dCgpO1xuICAgIH1cblxuICAgIGlmIChjb25maWcuc2VsZWN0UmFuZ2UpIHtcbiAgICAgIGlmIChjbGlja0NvdW50ICUgMiA9PT0gMCkge1xuICAgICAgICBpZiAoY29uZmlnLnNlbGVjdE11bHRpcGxlKSB7XG4gICAgICAgICAgY2xlYXJTZWxlY3Rpb24oY2FsZW5kYXIsIGR5bmFtaWNEYXRhKTtcbiAgICAgICAgfVxuICAgICAgICBib29rRGF0ZXMoW2RhdGVEaXZdKTtcbiAgICAgIH1cbiAgICAgIGlmIChjbGlja0NvdW50ICUgMiA9PT0gMSkge1xuICAgICAgICBib29rRGF0ZXMoW2RhdGVEaXZdKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoY29uZmlnLnNpbmdsZURhdGVDaG9pY2UpIHtcbiAgICAgIGNsZWFyU2VsZWN0aW9uKGNhbGVuZGFyLCBkeW5hbWljRGF0YSk7XG4gICAgICBib29rRGF0ZXMoW2RhdGVEaXZdKTtcbiAgICB9XG4gICAgLypcbiAgICBpZiAoIWRhdGVzSW5kZXguaW5jbHVkZXMoZGF0ZURpdi5kYXRhc2V0Lmh1bWFuZGF0ZSkpIHtcbiAgICAgIGNvbnN0IG1ha2VUaW1lUnVsZUdsb2JhbCA9IGNhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoJy50aW1lQ2hvb3NlcicpPy5xdWVyeVNlbGVjdG9yKCcubWFrZVRpbWVSdWxlR2xvYmFsJyk7XG4gICAgICBpZiAobWFrZVRpbWVSdWxlR2xvYmFsPy5jaGVja2VkID09PSB0cnVlKSB7XG4gICAgICAgIGJvb2tEYXlPZldlZWtHKGRhdGUsIG51bGwpO1xuICAgICAgfVxuICAgIH1cbiAgICAqL1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgc2VsZWN0aW9uIGluIHRoZSBkeW5hbWljRGF0YSBvYmplY3QuXG4gICAqXG4gICAqIEByZXR1cm4ge29iamVjdH0gQW4gb2JqZWN0IGNvbnRhaW5pbmcgdGhlIHRyYWNraW5nIGFycmF5IFwibmV3QXJyYXlcIiBhbmQgb2JqZWN0cyBhcnJheS5cbiAgICovXG4gIGZ1bmN0aW9uIGNyZWF0ZU5ld1NlbGVjdGlvbiAoKSB7XG4gICAgY29uc3QgcGFyZW50QXIgPSBkeW5hbWljRGF0YS5kYXRlc1NlbGVjdGVkQXJyYXk7XG4gICAgY29uc3QgcGFyZW50QXJPYmogPSBkeW5hbWljRGF0YS5kYXRlc1NlbGVjdGVkQXJyYXlPYmplY3RzO1xuICAgIGxldCBuZXdBcnJheSwgbmV3T2JqZWN0c0FycmF5O1xuXG4gICAgbmV3QXJyYXkgPSBwYXJlbnRBcltwYXJlbnRBci5sZW5ndGggLSAxXTtcbiAgICBpZiAoY29uZmlnLnNlbGVjdFJhbmdlICYmIG5ld0FycmF5ICYmIG5ld0FycmF5Lmxlbmd0aCA9PT0gMSkge1xuICAgICAgbmV3T2JqZWN0c0FycmF5ID0gcGFyZW50QXJPYmpbcGFyZW50QXJPYmoubGVuZ3RoIC0gMV07XG4gICAgICByZXR1cm4geyBuZXdBcnJheSwgbmV3T2JqZWN0c0FycmF5IH07XG4gICAgfVxuXG4gICAgbmV3QXJyYXkgPSBbXTtcbiAgICBuZXdPYmplY3RzQXJyYXkgPSBbXTtcbiAgICBwYXJlbnRBci5wdXNoKG5ld0FycmF5KTtcbiAgICBwYXJlbnRBck9iai5wdXNoKG5ld09iamVjdHNBcnJheSk7XG4gICAgcmV0dXJuIHsgbmV3QXJyYXksIG5ld09iamVjdHNBcnJheSB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFJhbmdlIHNlbGVjdFxuICAgKiBAZGVzY3JpcHRpb24gQWxsb3dzIGEgcmFuZ2Ugb2YgZGF0ZXMgdG8gYmUgc2VsZWN0ZWRcbiAgICogQGZ1bmN0aW9uIGJvb2tEYXRlc1xuICAgKiBAcGFyYW0gZGF0ZXMgYXJyYXlcbiAgICogQHRvZG8gYWxsb3cgcmFuZ2Ugc2VsZWN0IHRvIHdvcmsgd2l0aCB0aW1lIHZhbHVlcy5cbiAgICogQGZpcmVzIGJvb2tEYXkgZm9yIGVhY2ggZGF5IGluIGEgcmFuZ2VcbiAgICovXG4gIGZ1bmN0aW9uIGJvb2tEYXRlcyAoYXJyYXlPZkRhdGVEaXZzKSB7XG4gICAgY29uc3QgeyBuZXdBcnJheSwgbmV3T2JqZWN0c0FycmF5IH0gPSBjcmVhdGVOZXdTZWxlY3Rpb24oKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFycmF5T2ZEYXRlRGl2cy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgZGF0ZURpdiA9IGFycmF5T2ZEYXRlRGl2c1tpXTtcbiAgICAgIGJvb2tEYXkoZGF0ZURpdik7XG4gICAgfVxuXG4gICAgY29uc3Qgc3RhcnREYXRlID0gbmV3T2JqZWN0c0FycmF5WzBdO1xuICAgIGNvbnN0IHN0YXJ0SW5kZXggPSBzdGFydERhdGUuaW5kZXg7XG4gICAgLy8gaWYgYSBzaW5nbGUgZGF0ZSBpcyBzZWxlY3RlZDpcbiAgICBjb25zdCBlbmREYXRlID0gbmV3T2JqZWN0c0FycmF5WzFdIHx8IHN0YXJ0RGF0ZTtcbiAgICBjb25zdCBlbmRJbmRleCA9IGVuZERhdGUuaW5kZXg7XG5cbiAgICBpZiAoY29uZmlnLnNlbGVjdFJhbmdlKSB7XG4gICAgICBjb25zdCBbbG93LCBoaWdoXSA9IFtwYXJzZUludChzdGFydEluZGV4KSwgcGFyc2VJbnQoZW5kSW5kZXgpXS5zb3J0KChhLCBiKSA9PiBhIC0gYik7XG4gICAgICBmb3IgKGxldCBpID0gbG93OyBpIDw9IGhpZ2g7IGkrKykge1xuICAgICAgICBjb25zdCBkYXRlRGl2ID0gY2FsZW5kYXIucXVlcnlTZWxlY3RvcihgW2RhdGEtZGF5aW5kZXg9JyR7aX0nXWApO1xuICAgICAgICBpZiAoZGF0ZURpdi5jbGFzc0xpc3QuY29udGFpbnMoJ2Jsb2NrZWQnKSkge1xuICAgICAgICAgIHVuc2VsZWN0ZWRTdHlsZShjYWxlbmRhci5xdWVyeVNlbGVjdG9yKGBbaWQ9JyR7ZW5kRGF0ZX0nXWApKTtcbiAgICAgICAgICBuZXdBcnJheS5zcGxpY2UoMSwgMSk7XG4gICAgICAgICAgbmV3T2JqZWN0c0FycmF5LnNwbGljZSgxLCAxKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBib29rRGF5KGRhdGVEaXYpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGJvb2tEYXkgKGRhdGVEaXYpIHtcbiAgICAgIGlmIChjb25maWcuc2luZ2xlRGF0ZUNob2ljZSAmJiBuZXdBcnJheS5sZW5ndGggPiAwKSB7XG4gICAgICAgIGNsZWFyU2VsZWN0aW9uKGNhbGVuZGFyLCBkeW5hbWljRGF0YSk7XG4gICAgICB9XG4gICAgICBpZiAobmV3QXJyYXkuaW5jbHVkZXMoZGF0ZURpdi5kYXRhc2V0Lmh1bWFuZGF0ZSkgPT09IGZhbHNlKSB7XG4gICAgICAgIHNlbGVjdGVkU3R5bGUoZGF0ZURpdik7XG4gICAgICAgIG5ld0FycmF5LnB1c2goZGF0ZURpdi5kYXRhc2V0Lmh1bWFuZGF0ZSk7XG4gICAgICAgIG5ld09iamVjdHNBcnJheVtuZXdBcnJheS5sZW5ndGggLSAxXSA9IHN0YW5kYXJkRGF0ZU9iamVjdChkYXRlRGl2KTtcbiAgICAgIH1cbiAgICAgIGlmIChjb25maWcuc2luZ2xlRGF0ZUNob2ljZSAmJiBjb25maWcuZGlzcGxheVRpbWVDaG9vc2VyTW9kYWwpIHtcbiAgICAgICAgZGlzcGxheVRpbWVDaG9vc2VyTW9kYWwoY2FsZW5kYXIsIGNvbmZpZywgZHluYW1pY0RhdGEpO1xuICAgICAgfVxuICAgICAgLy8gdGltZSBwaWNrZXIgZm9yIG11bHRpcGxlIGNvbnNlY3V0aXZlIGRhdGVzLlxuICAgICAgaWYgKGNvbmZpZy5kaXNwbGF5VGltZUNob29zZXJNb2RhbCAmJiBzdGFydERhdGUgIT09IGVuZERhdGUpIHtcbiAgICAgICAgZGlzcGxheVRpbWVDaG9vc2VyTW9kYWwoY2FsZW5kYXIsIGNvbmZpZywgZHluYW1pY0RhdGEpO1xuICAgICAgICB3cml0ZVRpbWVzVG9BbGwoKTtcbiAgICAgIH1cbiAgICAgIC8vIHRpbWUgcGlja2VyIGZvIHNpbmdsZSBkYXRlOlxuICAgICAgaWYgKGNvbmZpZy5kaXNwbGF5VGltZUNob29zZXJNb2RhbCAmJiBjb25maWcuc2luZ2xlRGF0ZUNob2ljZSkge1xuICAgICAgICBkaXNwbGF5VGltZUNob29zZXJNb2RhbChjYWxlbmRhciwgY29uZmlnLCBkeW5hbWljRGF0YSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBzdGFuZGFyZCBkYXRlIG9iamVjdCB3aXRoIHRoZSBnaXZlbiBkYXRlLlxuICAgKlxuICAgKiBAcGFyYW0ge2FueX0gZGF0ZSAtIElzIGEgc3RyaW5nIFlZWVktTU0tREQgbW9udGhzIGFyZSBjb3VudGVkIGZyb20gMC5cbiAgICogQHJldHVybiB7b2JqZWN0fSBUaGUgc3RhbmRhcmQgZGF0ZSBvYmplY3Qgd2l0aCB0aGUgZ2l2ZW4gZGF0ZS5cbiAgICovXG4gIGZ1bmN0aW9uIHN0YW5kYXJkRGF0ZU9iamVjdCAoZGF0ZSkge1xuICAgIHJldHVybiB7XG4gICAgICBkYXk6IGRhdGUuZGF0YXNldC5kYXksXG4gICAgICBodW1hbmRhdGU6IGRhdGUuZGF0YXNldC5odW1hbmRhdGUsXG4gICAgICBpbmRleDogZGF0ZS5kYXRhc2V0LmRheWluZGV4LFxuICAgICAgdGltZXM6IGdldFNlbGVjdGVkVGltZXMoKVxuICAgIH07XG4gIH1cbn1cblxuZXhwb3J0IHsgU3dpZnRDYWwgfTtcbiIsImltcG9ydCB7IGxhbmd1YWdlcyB9IGZyb20gJy4vbGFuZ3VhZ2VzLmpzJztcblxubGV0IHRpbWVDaG9vc2VyTW9kYWwsIGNhbGVuZGFyLCBjb25maWcsIGR5bmFtaWNEYXRhO1xubGV0IHNlbGVjdGlvbiA9IFtdO1xuXG4vKipcbiAqIENyZWF0ZXMgZGlhbG9nIGZvciBzZWxlY3Rpbmcgc3BlY2lmaWMgdGltZXNcbiAqIEBmdW5jdGlvbiBjcmVhdGVUaW1lRWxlbWVudHNcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGNhbGVuZGFyIC0gVGhlIGNhbGVuZGFyIGVsZW1lbnRcbiAqIEByZXR1cm5zIHtwcm9taXNlfSAtIEVtcHR5IHByb21pc2UuIFRoZSBhY3R1YWwgZGl2IGlzIGluIHRoaXMgY29kZSBvbiBcInRpbWVDaG9vc2VyTW9kYWxcIlxuICovXG5cbmZ1bmN0aW9uIGdlbmVyYXRlVGltZUNob29zZXJNb2RhbCAoKSB7XG4gIGNvbnN0IHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgaWYgKHRpbWVDaG9vc2VyTW9kYWwpIHtcbiAgICAgIHJlc29sdmUodGltZUNob29zZXJNb2RhbCk7XG4gICAgfVxuXG4gICAgdGltZUNob29zZXJNb2RhbCA9IGNyZWF0ZU1vZGFsKCd0aW1lQ2hvb3Nlck1vZGFsJyk7XG4gICAgY2FsZW5kYXIuYXBwZW5kQ2hpbGQodGltZUNob29zZXJNb2RhbCk7XG5cbiAgICBjb25zdCB0aW1lQ29udCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRpbWVDb250LmNsYXNzTGlzdC5hZGQoJ3RpbWVDb250Jyk7XG4gICAgdGltZUNob29zZXJNb2RhbC5hcHBlbmRDaGlsZCh0aW1lQ29udCk7XG5cbiAgICBjb25zdCB0aW1lQ2hvb3NlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRpbWVDaG9vc2VyLmNsYXNzTGlzdC5hZGQoJ3RpbWVDaG9vc2VyJyk7XG4gICAgdGltZUNvbnQuYXBwZW5kQ2hpbGQodGltZUNob29zZXIpO1xuXG4gICAgLy8gbWFrZUJ1dHRvbihkZWxldGVEaXYsICdyZW1vdmVUaW1lJywgJy0nLCAncmVtb3ZlIGxhc3QgdGltZScsIHJlbW92ZVRpbWUpO1xuICAgIC8vIG1ha2VCdXR0b24oZGVsZXRlRGl2LCAnYWRkVGltZScsICcrJywgJ2FkZCBhIHRpbWUnLCAnY2xpY2snLCB0aW1lUGlja2VyRWxlbWVudHMpO1xuICAgIC8vIG1ha2VCdXR0b24oZGVsZXRlRGl2LCAncmVtb3ZlVGltZScsICctJywgJ3JlbW92ZSBsYXN0IHRpbWUnLCAnY2xpY2snKTtcbiAgICBjb25zdCBjb250cm9sc0RpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGNvbnRyb2xzRGl2LmNsYXNzTGlzdC5hZGQoJ2RlbGV0ZURpdicpO1xuICAgIHRpbWVDaG9vc2VyLmFwcGVuZENoaWxkKGNvbnRyb2xzRGl2KTtcblxuICAgIGZ1bmN0aW9uIGNsb3NlRm4gKCkge1xuICAgICAgdGltZUNob29zZXJNb2RhbC5jbG9zZSgpO1xuICAgIH1cbiAgICBtYWtlQnV0dG9uKGNvbnRyb2xzRGl2LCAnZGVsZXRlQnV0dG9uJywgJ3gnLCAnY2xvc2UnLCAnY2xpY2snLCBjbG9zZUZuKTtcblxuICAgIGZ1bmN0aW9uIGlubmVyQ29tcG9uZW50cyAoKSB7XG4gICAgICAvLyBJZiB0aGUgY3VycmVudCBlbGVtZW50cyBhcmVuJ3QgZmlsbGVkOlxuICAgICAgLypcbiAgICAgIGlmIChjYWxlbmRhci5xdWVyeVNlbGVjdG9yQWxsKCcudGltZVBpY2tlckNvbnRhaW5lcicpLmxlbmd0aCAqIDIgIT09IHRpbWVzLnZhbHVlcy5sZW5ndGgpIHtcbiAgICAgICAgaWYgKHN3aWZ0bW9BbGVydCkge1xuICAgICAgICAgIHN3aWZ0bW9BbGVydC5zZXRDb250ZW50KCdGaWxsIGluIHRoZSBjdXJyZW50IHRpbWUgdmFsdWVzIGJlZm9yZSBhZGRpbmcgYW5vdGhlci4nKS50b2dnbGUoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBhbGVydCgnRmlsbCBpbiB0aGUgY3VycmVudCB0aW1lIHZhbHVlcyBiZWZvcmUgYWRkaW5nIGFub3RoZXIuJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgKi9cbiAgICAgIGNvbnN0IHRpbWVQaWNrZXJDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIHRpbWVQaWNrZXJDb250YWluZXIuY2xhc3NMaXN0LmFkZCgndGltZVBpY2tlckNvbnRhaW5lcicpO1xuICAgICAgdGltZUNob29zZXIuYXBwZW5kQ2hpbGQodGltZVBpY2tlckNvbnRhaW5lcik7XG4gICAgICBjb25zdCB0aXRsZURpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgdGl0bGVEaXYudGV4dENvbnRlbnQgPSBsYW5ndWFnZXNbY29uZmlnLmxhbmd1YWdlXS50aW1lV2lkZ2V0LmFkZFRpbWU7XG4gICAgICB0aXRsZURpdi5jbGFzc0xpc3QuYWRkKCdkZWxldGVEaXYnKTtcbiAgICAgIHRpbWVQaWNrZXJDb250YWluZXIuYXBwZW5kQ2hpbGQodGl0bGVEaXYpO1xuICAgICAgbWFrZURyb3BEb3ducyhsYW5ndWFnZXNbY29uZmlnLmxhbmd1YWdlXS50aW1lV2lkZ2V0LnN0YXJ0LCB0aW1lUGlja2VyQ29udGFpbmVyKTtcbiAgICAgIG1ha2VEcm9wRG93bnMobGFuZ3VhZ2VzW2NvbmZpZy5sYW5ndWFnZV0udGltZVdpZGdldC5lbmQsIHRpbWVQaWNrZXJDb250YWluZXIpO1xuICAgICAgLy8gdGlja2JveGVzKHRpbWVQaWNrZXJDb250YWluZXIpO1xuICAgIH1cbiAgICBtYWtlQnV0dG9uKGNvbnRyb2xzRGl2LCAnZGVsZXRlQnV0dG9uJywgJysnLCAnYWRkIHRpbWUnLCAnY2xpY2snLCBpbm5lckNvbXBvbmVudHMpO1xuICAgIG1ha2VCdXR0b24oY29udHJvbHNEaXYsICdkZWxldGVCdXR0b24nLCAnLScsICdyZW1vdmUgdGltZScsICdjbGljaycsIHJlbW92ZVRpbWVWYWx1ZXNPbkRhdGUpO1xuICAgIHJlc29sdmUodGltZUNob29zZXJNb2RhbCk7XG4gIH0pO1xuICByZXR1cm4gcHJvbWlzZTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlTW9kYWwgKGNsYXNzTmFtZSkge1xuICBjb25zdCBtb2RhbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpYWxvZycpO1xuICBtb2RhbC5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSk7XG4gIHJldHVybiBtb2RhbDtcbn1cblxuZnVuY3Rpb24gbWFrZUJ1dHRvbiAocGFyZW50LCBjbGFzc05hbWUsIHRleHRDb250ZW50LCBob3ZlclRleHQsIGFjdGlvbiwgZm4pIHtcbiAgY29uc3QgYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSk7XG4gIGJ1dHRvbi50ZXh0Q29udGVudCA9IHRleHRDb250ZW50O1xuICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcihhY3Rpb24sIChlKSA9PiB7XG4gICAgZm4oKTtcbiAgfSk7XG4gIHBhcmVudC5hcHBlbmRDaGlsZChidXR0b24pO1xufVxuXG5mdW5jdGlvbiBtYWtlRHJvcERvd25zIChjb250ZXh0VGV4dCwgdGltZVBpY2tlckNvbnRhaW5lcikge1xuICAvLyBUaGUgdGltZSBjb250YWluZXJcbiAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCd0aW1lQ29udGFpbmVyJyk7XG4gIGNvbnRhaW5lci5kYXRhc2V0LmNvbnRleHQgPSBjb250ZXh0VGV4dDtcbiAgdGltZVBpY2tlckNvbnRhaW5lci5hcHBlbmRDaGlsZChjb250YWluZXIpO1xuXG4gIC8vIFRoZSBzdG9yYWdlIG9iamVjdFxuICAvLyBzZWxlY3Rpb24ucHVzaChbXSk7XG5cbiAgLy8gdGltZU9iaiA9ICBbW11dXG4gIC8vIGNvbnN0IHRpbWVzT2JqID0gc2VsZWN0aW9uW3NlbGVjdGlvbi5sZW5ndGggLSAxXTtcblxuICBjb25zdCB0aW1lRm9yQ29udGV4dCA9IHsgW2NvbnRleHRUZXh0XToge30gfTtcblxuICAvLyB0aW1lc09iai5wdXNoKHRpbWVGb3JDb250ZXh0KTtcbiAgc2VsZWN0aW9uLnB1c2godGltZUZvckNvbnRleHQpO1xuXG4gIC8vIE1ha2UgbGFiZWxcbiAgY29uc3QgbGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gIGxhYmVsLmNsYXNzTGlzdC5hZGQoJ3RpbWVTZWxlY3RQJyk7XG4gIGxhYmVsLnRleHRDb250ZW50ID0gYCR7Y29udGV4dFRleHR9OmA7XG4gIGNvbnRhaW5lci5hcHBlbmRDaGlsZChsYWJlbCk7XG5cbiAgLy8gTWFrZSBob3VyIHNlbGVjdG9yXG4gIGNvbnN0IHRpbWVTZWxlY3RvckRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICB0aW1lU2VsZWN0b3JEaXYuZGF0YXNldC5jb250ZXh0ID0gY29udGV4dFRleHQ7XG4gIGNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aW1lU2VsZWN0b3JEaXYpO1xuXG4gIG1ha2VTZWxlY3RvcignaGgnLCAyMywgdGltZVNlbGVjdG9yRGl2LCBjb250ZXh0VGV4dCwgdGltZVBpY2tlckNvbnRhaW5lciwgdGltZUZvckNvbnRleHQpO1xuICBtYWtlU2VsZWN0b3IoJ21tJywgNTksIHRpbWVTZWxlY3RvckRpdiwgY29udGV4dFRleHQsIHRpbWVQaWNrZXJDb250YWluZXIsIHRpbWVGb3JDb250ZXh0KTtcbn1cblxuZnVuY3Rpb24gbWFrZVNlbGVjdG9yICh0eXBlLCBsaW1pdCwgdGltZVNlbGVjdG9yRGl2LCBjb250ZXh0VGV4dCwgdGltZVBpY2tlckNvbnRhaW5lciwgdGltZUZvckNvbnRleHQpIHtcbiAgY29uc3QgZHJvcERvd24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzZWxlY3QnKTtcbiAgZHJvcERvd24uY2xhc3NMaXN0LmFkZCh0eXBlLCAndGltZVNlbGVjdCcpO1xuICB0aW1lU2VsZWN0b3JEaXYuYXBwZW5kQ2hpbGQoZHJvcERvd24pO1xuXG4gIGRyb3BEb3duLmRhdGFzZXQudHlwZSA9IHR5cGU7XG4gIGRyb3BEb3duLmRhdGFzZXQuY29udGV4dCA9IGNvbnRleHRUZXh0O1xuXG4gIGNvbnN0IHBsYWNlaG9sZGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XG4gIHBsYWNlaG9sZGVyLnRleHRDb250ZW50ID0gdHlwZTtcbiAgcGxhY2Vob2xkZXIudmFsdWUgPSAnMDAnO1xuXG4gIC8vIHtcIlN0YXJ0XCI6e1wiaGhcIjpcIjAwXCJ9fSx7XCJTdGFydFwiOntcIm1tXCI6XCIwMFwifX1cbiAgdGltZUZvckNvbnRleHRbY29udGV4dFRleHRdW3R5cGVdID0gcGxhY2Vob2xkZXIudmFsdWU7XG4gIC8vIHtbdHlwZV06IHBsYWNlaG9sZGVyLnZhbHVlfVxuICBkcm9wRG93bi5hcHBlbmRDaGlsZChwbGFjZWhvbGRlcik7XG5cbiAgbGV0IGkgPSAwO1xuICB3aGlsZSAoaSA8PSBsaW1pdCkge1xuICAgIGNvbnN0IGhvdXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcbiAgICBsZXQgdGV4dCA9IGkudG9TdHJpbmcoKTtcbiAgICBpZiAodGV4dC5sZW5ndGggPT09IDEpIHtcbiAgICAgIHRleHQgPSBgMCR7aX1gO1xuICAgIH1cbiAgICBob3VyLnZhbHVlID0gdGV4dDtcbiAgICBob3VyLnRleHRDb250ZW50ID0gdGV4dDtcbiAgICBkcm9wRG93bi5hcHBlbmRDaGlsZChob3VyKTtcbiAgICBpKys7XG4gIH1cblxuICBkcm9wRG93bi5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoc2VsZWN0ZWQpID0+IHtcbiAgICB0aW1lRm9yQ29udGV4dFtjb250ZXh0VGV4dF1bdHlwZV0gPSBkcm9wRG93bi52YWx1ZTtcbiAgICB3cml0ZVRvRGF0ZURpdigpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlVGltZVZhbHVlc09uRGF0ZSAoKSB7XG4gIGNvbnN0IGQgPSBkeW5hbWljRGF0YS5kYXRlc1NlbGVjdGVkQXJyYXlPYmplY3RzO1xuICBjb25zdCBsYXN0Q2hvaWNlID0gZFtkLmxlbmd0aCAtIDFdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGxhc3RDaG9pY2UubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBkYXRlT2JqID0gbGFzdENob2ljZVtpXTtcbiAgICBjb25zdCBkYXlEaXYgPSBjYWxlbmRhci5xdWVyeVNlbGVjdG9yKGBbZGF0YS1odW1hbmRhdGU9JyR7ZGF0ZU9iai5odW1hbmRhdGV9J11gKTtcbiAgICBkYXlEaXYucmVtb3ZlQ2hpbGQoZGF5RGl2Lmxhc3RDaGlsZCk7XG4gICAgZGF0ZU9iai50aW1lcyA9IGRhdGVPYmoudGltZXMuc2xpY2UoMCwgLTIpO1xuICB9XG4gIHNlbGVjdGlvbiA9IHNlbGVjdGlvbi5zbGljZSgwLCAtMik7XG4gIGNvbnN0IHRpbWVDaG9vc2VyID0gY2FsZW5kYXIucXVlcnlTZWxlY3RvcignLnRpbWVDaG9vc2VyJyk7XG4gIHRpbWVDaG9vc2VyLnJlbW92ZUNoaWxkKHRpbWVDaG9vc2VyLmxhc3RDaGlsZCk7XG59XG5cbmZ1bmN0aW9uIHdyaXRlVG9EYXRlRGl2ICgpIHtcbiAgaWYgKGNvbmZpZy5kaXNwbGF5VGltZVNlbGVjdGlvbk9uRGF0ZSkge1xuICAgIGR5bmFtaWNEYXRhLmRhdGVzU2VsZWN0ZWRBcnJheS5mb3JFYWNoKChjaGlsZEFycmF5KSA9PiB7XG4gICAgICBjaGlsZEFycmF5LmZvckVhY2goKGRheVNlbGVjdGVkKSA9PiB7XG4gICAgICAgIHdyaXRlKGRheVNlbGVjdGVkKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgLy8gY29udGFpbnMgYSB0aW1lIGR1cmF0aW9uIGNob2ljZVxuICAgIGxldCBjYWxlbmRhclRpbWVQYXJlbnQ7XG5cbiAgICBmdW5jdGlvbiB3cml0ZSAoZGF0ZSkge1xuICAgICAgY29uc3QgZGF5RGl2ID0gY2FsZW5kYXIucXVlcnlTZWxlY3RvcihgW2RhdGEtaHVtYW5kYXRlPScke2RhdGV9J11gKTtcbiAgICAgIHdoaWxlIChkYXlEaXYuY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuICAgICAgICBkYXlEaXYucmVtb3ZlQ2hpbGQoZGF5RGl2Lmxhc3RDaGlsZCk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGNyZWF0ZU5ld1BhcmEgKHRleHQpIHtcbiAgICAgICAgY29uc3QgdGltZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICAgICAgY2FsZW5kYXJUaW1lUGFyZW50LmFwcGVuZENoaWxkKHRpbWUpO1xuICAgICAgICB0aW1lLmNsYXNzTGlzdC5hZGQoJ2NhbGVuZGFyVGltZScpO1xuICAgICAgICB0aW1lLnRleHRDb250ZW50ID0gdGV4dDtcbiAgICAgIH1cblxuICAgICAgc2VsZWN0aW9uLmZvckVhY2goKHRpbWVWYWx1ZSwgaSkgPT4ge1xuICAgICAgICBpZiAoaSA9PT0gMCB8fCBpICUgMiA9PT0gMCkge1xuICAgICAgICAgIGNhbGVuZGFyVGltZVBhcmVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgIGNhbGVuZGFyVGltZVBhcmVudC5jbGFzc0xpc3QuYWRkKCdjYWxlbmRhclRpbWVQYXJlbnQnKTtcbiAgICAgICAgICBkYXlEaXYuYXBwZW5kQ2hpbGQoY2FsZW5kYXJUaW1lUGFyZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGZpZWxkTmFtZSA9IE9iamVjdC5rZXlzKHRpbWVWYWx1ZSlbMF07XG4gICAgICAgIGNyZWF0ZU5ld1BhcmEoYCR7ZmllbGROYW1lfTpgKTtcbiAgICAgICAgY3JlYXRlTmV3UGFyYShgJHt0aW1lVmFsdWVbZmllbGROYW1lXS5oaH06JHt0aW1lVmFsdWVbZmllbGROYW1lXS5tbX1gKTtcbiAgICAgICAgXG4gICAgICAgIC8qXG4gICAgICAgIGlmIChkYXlJblBvaW50LmNsYXNzTGlzdC5jb250YWlucygnZmlsbGVyJykgPT09IGZhbHNlKSB7XG4gICAgICAgICAgZGF5SW5Qb2ludC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAnI2ZjMyc7XG4gICAgICAgICAgaWYgKGkgJSAyID09PSAxKSB7XG4gICAgICAgICAgICB0aW1lLnN0eWxlLmJvcmRlckJvdHRvbVN0eWxlID0gJ3NvbGlkJztcbiAgICAgICAgICAgIGRheUluUG9pbnQuYXBwZW5kQ2hpbGQodGltZSk7XG4gICAgICAgICAgICB0ZXh0aW50ZXJuYWwgPSAnJztcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZGF5SW5Qb2ludC5hcHBlbmRDaGlsZCh0aW1lKTtcbiAgICAgICAgICAgIHRleHRpbnRlcm5hbCA9ICcnO1xuICAgICAgICAgIH1cbiAgICAgICAgfSovXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvL2dlbmVyYXRlVGltZVZhbHVlc09uRGF0ZSh0aW1lVmFsdWVzKTtcbiAgfVxufVxuXG5mdW5jdGlvbiB3cml0ZVRpbWVzVG9BbGwgKCkge1xuICB3cml0ZVRvRGF0ZURpdigpO1xufVxuXG5mdW5jdGlvbiBkaXNwbGF5VGltZUNob29zZXJNb2RhbCAoY2FsLCBjb25mLCBkYXRhKSB7XG4gIGNhbGVuZGFyID0gY2FsO1xuICBjb25maWcgPSBjb25mO1xuICBkeW5hbWljRGF0YSA9IGRhdGE7XG4gIGlmICh0aW1lQ2hvb3Nlck1vZGFsKSB7XG4gICAgdGltZUNob29zZXJNb2RhbC5zaG93KCk7XG4gIH0gZWxzZSB7XG4gICAgZ2VuZXJhdGVUaW1lQ2hvb3Nlck1vZGFsKCkudGhlbigobmV3TW9kYWwpID0+IHtcbiAgICAgIHRpbWVDaG9vc2VyTW9kYWwgPSBuZXdNb2RhbDtcbiAgICAgIHRpbWVDaG9vc2VyTW9kYWwuc2hvdygpO1xuICAgIH0pO1xuICB9XG59XG5cbmZ1bmN0aW9uIGdldFNlbGVjdGVkVGltZXMgKCkge1xuICByZXR1cm4gc2VsZWN0aW9uO1xufVxuXG5leHBvcnQgeyBkaXNwbGF5VGltZUNob29zZXJNb2RhbCwgZ2V0U2VsZWN0ZWRUaW1lcywgd3JpdGVUaW1lc1RvQWxsIH07XG4iLCIvKiBMYW5ndWFnZSBkZWZhdWx0cyAqL1xuY29uc3QgZW5HYiA9IHtcbiAgZ2VuZXJhbFRpbWU6IHtcbiAgICBtb250aHM6IFsnSmFudWFyeScsICdGZWJydWFyeScsICdNYXJjaCcsICdBcHJpbCcsICdNYXknLCAnSnVuZScsICdKdWx5JywgJ0F1Z3VzdCcsICdTZXB0ZW1iZXInLCAnT2N0b2JlcicsICdOb3ZlbWJlcicsICdEZWNlbWJlciddLFxuICAgIGRheXNJbkZ1bGw6IFsnU3VuZGF5JywgJ01vbmRheScsICdUdWVzZGF5JywgJ1dlZG5lc2RheScsICdUaHVyc2RheScsICdGcmlkYXknLCAnU2F0dXJkYXknXSxcbiAgICBkYXlzVHJ1bmNhdGVkOiBbJ1N1bicsICdNb24nLCAnVHVlJywgJ1dlZCcsICdUaHUnLCAnRnJpJywgJ1NhdCddXG4gIH0sXG4gIGZvcm1hdERheVRleHQ6IHtcbiAgICB0ZXh0QmVmb3JlOiAnU2V0IHRoZXNlIHRpbWVzIGZvciBhbGwnLFxuICAgIHRleHRBZnRlcjogJydcbiAgfSxcbiAgdGltZVdpZGdldDoge1xuICAgIGFkZFRpbWU6ICdBZGQgdGltZTonLFxuICAgIHN0YXJ0OiAnU3RhcnQnLFxuICAgIGVuZDogJ0VuZCdcbiAgfVxufTtcblxuLyogTGFuZ3VhZ2UgZGVmYXVsdHMgKi9cbmNvbnN0IHB0UHQgPSB7XG4gIGdlbmVyYWxUaW1lOiB7XG4gICAgbW9udGhzOiBbJ0phbmVpcm8nLCAnRmV2ZXJlaXJvJywgJ01hcsOnbycsICdBYnJpbCcsICdNYWlvJywgJ0p1bmhvJywgJ0p1bGhvJywgJ0Fnb3N0bycsICdTZXRlbWJybycsICdPdXR1YnJvJywgJ05vdmVtYnJvJywgJ0RlemVtYnJvJ10sXG4gICAgZGF5c0luRnVsbDogWydEb21pbmdvJywgJ1NlZ3VuZGEtRmVpcmEnLCAnVGVyw6dhLUZlaXJhJywgJ1F1YXJ0YS1GZWlyYScsICdRdWludGEtRmVpcmEnLCAnU2V4dGEtRmVpcmEnLCAnU8OhYmFkbyddLFxuICAgIGRheXNUcnVuY2F0ZWQ6IFsnRG9tJywgJ1NlZycsICdUZXInLCAnUXVhJywgJ1F1aScsICdTZXgnLCAnU2FiJ11cbiAgfSxcbiAgZm9ybWF0RGF5VGV4dDoge1xuICAgIHRleHRCZWZvcmU6ICdBcHBsaXF1ZSBlc3RhcyBob3JhcyBhIHRvZG9zJyxcbiAgICB0ZXh0QWZ0ZXI6ICcnXG4gIH0sXG4gIHRpbWVXaWRnZXQ6IHtcbiAgICBhZGRUaW1lOiAnQWRpY2lvbmUgZHVyYcOnw6NvOicsXG4gICAgc3RhcnQ6ICdJbsOtY2lvJyxcbiAgICBlbmQ6ICdGaW0nXG4gIH1cblxufTtcblxuY29uc3QgbGFuZ3VhZ2VzID0geyBlbkdiLCBwdFB0IH07XG5cbmV4cG9ydCB7IGxhbmd1YWdlcyB9O1xuIiwiY29uc3QgY29sb3VycyA9IHtcbiAgbW9udGhDb2xvcjogJyNmYzMnLFxuICBtb250aEJhY2tnb3VuZEJvbG9yOiAnIzY3OTljYicsXG4gIGRheU5hbWVDb2xvcjogJyMwMDAnLFxuICBkYXlOYW1lQmFja2dyb3VuZENvbG9yOiAnI2NjYycsXG4gIGRheUNvbG9yOiAnIzAwMCcsXG4gIGRheUJhY2tncm91bmRDb2xvcjogJyNmZmYnLFxuICBtb250aEJvcmRlckNvbG9yOiAnI2YxNTkyNSdcbn07XG5cbmNvbnN0IHNlbGVjdGVkU3R5bGUgPSAoZGl2KSA9PiB7XG4gIGRpdi5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBjb2xvdXJzLm1vbnRoQ29sb3I7XG59O1xuXG5jb25zdCB1bnNlbGVjdGVkU3R5bGUgPSAoZGl2KSA9PiB7XG4gIGRpdi5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBjb2xvdXJzLmRheUJhY2tncm91bmRDb2xvcjtcbn07XG5cbmV4cG9ydCB7IHNlbGVjdGVkU3R5bGUsIHVuc2VsZWN0ZWRTdHlsZSwgY29sb3VycyB9O1xuIl19
