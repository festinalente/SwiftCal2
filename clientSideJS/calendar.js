(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.calendar = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
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
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
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
function preloadDates(_x2, _x3) {
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

},{"./calendarGenerator.js":3,"./displayTimeChooserModal.js":4,"./styles.js":6}],2:[function(require,module,exports){
var css = ".calendar {\n  display: flex;\n  flex-wrap: wrap;\n  flex-direction: row;\n  background-color: rgba(240, 248, 255, 0);\n  width: 100%;\n  height: 28.8em;\n  overflow-y: auto;\n}\n.calendar .blocked {\n  background-color: #333;\n}\n.calendar .filler {\n  pointer-events: none;\n  opacity: 0.3;\n}\n.calendar .timeSelect {\n  padding: 0;\n  width: auto;\n  margin: 0;\n  background-color: #fff;\n  float: right;\n  font-weight: 700;\n  font-family: Arial, Helvetica, sans-serif;\n  border-style: solid;\n  border-radius: 1em;\n  text-align: center;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  border-width: 3px;\n  border-color: #f15925;\n  color: #000;\n  font-size: 0.9em;\n}\n.calendar .timeCont {\n  margin-left: auto;\n  width: 10em;\n  background-color: aliceblue;\n  border-style: solid;\n  border-color: #f15925;\n  margin-right: auto;\n  margin-top: 10em;\n}\n.calendar .dayblockrow {\n  display: flex;\n  flex-direction: row;\n  min-width: 100%;\n  background-color: aliceblue;\n}\n.calendar .calendarTimeParent {\n  margin: 0.1em;\n}\n.calendar .calendarTimeParent .calendarTime {\n  font-size: 0.9em;\n  margin-top: 0em;\n  line-height: 1;\n  background-color: aliceblue;\n  color: black;\n  text-align: center;\n  margin: 0px;\n}\n.calendar .widthShapeDays {\n  width: 14.2857142857%;\n  margin-left: auto;\n  margin-right: auto;\n  text-align: center;\n}\n.calendar .widthShape {\n  width: 14.2857142857%;\n  margin-left: auto;\n  margin-right: auto;\n  text-align: center;\n  min-height: 3.6em;\n  margin-bottom: 0.2em;\n}\n.calendar .monthName {\n  margin: auto;\n  text-align: center;\n  font-family: Ubuntu;\n  font-size: 1.61em;\n  background-color: #337ab7;\n  color: #ffcc33;\n  flex-basis: 100%;\n  border-bottom-style: solid;\n}\n.calendar .weekrow {\n  display: flex;\n  flex-wrap: nowrap;\n  flex-direction: row;\n  background-color: #fff;\n  font-family: \"roboto\", \"arial\";\n}\n.calendar .dayName {\n  color: black;\n  font-family: \"roboto\", \"arial\";\n  font-weight: 600;\n  background-color: #ccc;\n}\n.calendar .month > * {\n  margin-left: 2px;\n  margin-right: 2px;\n}\n.calendar .month {\n  width: 50%;\n  min-width: 300px;\n  margin: auto;\n}\n.calendar .timeChooser {\n  width: 10em;\n  position: static;\n  background-color: aliceblue;\n  margin-left: auto;\n  margin-right: auto;\n}\n.calendar .timeContainer {\n  display: flex;\n}\n.calendar .timeChooserModal {\n  z-index: 1;\n  width: 100%;\n  height: 100%;\n  background-color: rgba(0, 0, 0, 0.4);\n  position: absolute;\n}\n.calendar .calendarLabel {\n  min-width: 3em;\n  padding: 0em 1em 0em 1em;\n  color: black;\n  font-family: \"roboto\", \"arial\";\n  font-weight: 600;\n  background-color: #ccc;\n  margin: 1em 0 1em 0;\n}\n.calendar .deleteDiv {\n  font-family: Ubuntu;\n  font-size: 1.61em;\n  background-color: #337ab7;\n  color: #ffcc33;\n  border-bottom-style: solid;\n  height: 2em;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.calendar .deleteButton {\n  background-color: white;\n  color: #f15925;\n  float: right;\n  font-weight: 700;\n  font-family: Arial, Helvetica, sans-serif;\n  border-style: solid;\n  border-radius: 1em;\n  text-align: center;\n  height: 30px;\n  width: 30px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.calendar .innerSpanDeleteBtn {\n  text-align: center;\n}\n.calendar .deleteButton:hover,\n.calendar .deleteButton:focus,\n.calendar .timeSelect:hover,\n.calendar .timeSelect:focus {\n  color: #000;\n  text-decoration: none;\n  cursor: pointer;\n}\n.calendar .hour {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 10em;\n}\n.calendar .timeSelectP {\n  display: inline;\n  width: 5em;\n  color: #000;\n}\n.calendar .timeChooser > input[type=checkbox] {\n  outline: #f15925;\n  outline-style: solid;\n}\n.calendar .timeSelect > option {\n  color: #000;\n}\n.calendar .calendar > p,\n.calendar h4,\n.calendar h3,\n.calendar h2,\n.calendar h1,\n.calendar select,\n.calendar option {\n  color: #000;\n}\n.calendar .arrow-up {\n  width: 0;\n  height: 0;\n  border-left: 10px solid transparent;\n  border-right: 10px solid transparent;\n  border-bottom: 10px solid black;\n}\n.calendar .arrow-down {\n  width: 0;\n  height: 0;\n  border-left: 10px solid transparent;\n  border-right: 10px solid transparent;\n  border-top: 10px solid #000;\n}\n.calendar .arrows {\n  float: right;\n  clear: right;\n  position: relative;\n  cursor: pointer;\n  flex-direction: column;\n}\n.calendar .arrow-right {\n  width: 0;\n  height: 0;\n  border-top: 60px solid transparent;\n  border-bottom: 60px solid transparent;\n  border-left: 60px solid green;\n}\n.calendar .arrow-left {\n  width: 0;\n  height: 0;\n  border-top: 10px solid transparent;\n  border-bottom: 10px solid transparent;\n  border-right: 10px solid blue;\n}\n.calendar .dayTime {\n  cursor: pointer;\n}\n.calendar .dayTime > * {\n  pointer-events: none;\n}\n/*# sourceMappingURL=calendarApp.css.map */\n"; (require("browserify-css").createStyle(css, { "href": "commonModules/modules/SwiftCal-B/preBundlingJS/calendarApp.css" }, { "insertAt": "bottom" })); module.exports = css;
},{"browserify-css":7}],3:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
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
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
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
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
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
    // data-number-of-months-to-display html converts to numberOfMonthsToDisplay JS
    var numberOfMonthsToDisplay = _this.dataset.numberOfMonthsToDisplay;
    var calendar = new SwiftCal();
    calendar.generateCalendar({
      target: self,
      numberOfMonthsToDisplay: numberOfMonthsToDisplay
    });
    _this.dynamicData = calendar.returnDynamicData();
    return _this;
  }
  return _createClass(_class);
}( /*#__PURE__*/_wrapNativeSuper(HTMLElement)));
function SwiftCal() {
  var _this2 = this;
  var config = {};
  var calendar = document.createElement('div');
  var dynamicData = {
    datesSelectedArray: [],
    datesSelectedArrayObjects: [],
    disabled: false
  };
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
    config.displayTimeChooserModal = configObj.displayTimeChooserModal || true;
    // done
    config.singleDateChoice = configObj.singleDateChoice || false;
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
    // TODO:
    var displayTimeChooserModal = config.displayTimeChooserModal;
    var endUser = config.endUser;
    var endUserDurationChoice = config.endUserDurationChoice;
    var backend = config.backend;
    var displayBlocked = config.displayBlocked;
    var singleDateChoice = false;
    var selectRange = !config.singleDateChoice;
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
      for (var _i2 = low; _i2 <= high; _i2++) {
        var _dateDiv = calendar.querySelector("[data-dayindex='".concat(_i2, "']"));
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
      // time picker for multiple consecutive dates.
      if (config.displayTimeChooserModal && startDate !== endDate) {
        (0, _displayTimeChooserModal.displayTimeChooserModal)(calendar, config, dynamicData);
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

},{"./basicFunctions.js":1,"./calendarApp.css":2,"./displayTimeChooserModal.js":4,"./languages.js":5,"./styles.js":6}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.displayTimeChooserModal = displayTimeChooserModal;
exports.getSelectedTimes = getSelectedTimes;
var _languages = require("./languages.js");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
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

},{"./languages.js":5}],5:[function(require,module,exports){
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
var languages = {
  enGb: enGb,
  ptPt: ptPt
};
exports.languages = languages;

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unselectedStyle = exports.selectedStyle = exports.colours = void 0;
var colours = {
  monthColor: '#fc3',
  monthBackgoundBolor: '#6799cb',
  dayNameColor: '#000',
  dayNameBackgroundColor: '#ccc',
  dayColor: '#000',
  dayBackgroundColor: '#fff',
  monthBorderColor: '#f15925'
};
exports.colours = colours;
var selectedStyle = function selectedStyle(div) {
  div.style.backgroundColor = colours.monthColor;
};
exports.selectedStyle = selectedStyle;
var unselectedStyle = function unselectedStyle(div) {
  div.style.backgroundColor = colours.dayBackgroundColor;
};
exports.unselectedStyle = unselectedStyle;

},{}],7:[function(require,module,exports){
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

},{}]},{},[3])(3)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjb21tb25Nb2R1bGVzL21vZHVsZXMvU3dpZnRDYWwtQi9wcmVCdW5kbGluZ0pTL2Jhc2ljRnVuY3Rpb25zLmpzIiwiY29tbW9uTW9kdWxlcy9tb2R1bGVzL1N3aWZ0Q2FsLUIvcHJlQnVuZGxpbmdKUy9jYWxlbmRhckFwcC5jc3MiLCJjb21tb25Nb2R1bGVzL21vZHVsZXMvU3dpZnRDYWwtQi9wcmVCdW5kbGluZ0pTL2NhbGVuZGFyR2VuZXJhdG9yLmpzIiwiY29tbW9uTW9kdWxlcy9tb2R1bGVzL1N3aWZ0Q2FsLUIvcHJlQnVuZGxpbmdKUy9kaXNwbGF5VGltZUNob29zZXJNb2RhbC5qcyIsImNvbW1vbk1vZHVsZXMvbW9kdWxlcy9Td2lmdENhbC1CL3ByZUJ1bmRsaW5nSlMvbGFuZ3VhZ2VzLmpzIiwiY29tbW9uTW9kdWxlcy9tb2R1bGVzL1N3aWZ0Q2FsLUIvcHJlQnVuZGxpbmdKUy9zdHlsZXMuanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS1jc3MvYnJvd3Nlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDQUE7QUFDQTtBQUNBO0FBQXlGLCtDQUR6RjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsU0FBUyxlQUFlLENBQUUsSUFBSSxFQUFFO0VBQzlCLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFO0lBQ3ZCLElBQU0sQ0FBQyxHQUFHLElBQUksS0FBSyxDQUFDLDZCQUE2QixDQUFDO0lBQ2xELE1BQU0sQ0FBQztFQUNUO0VBQ0Esa0JBQXlCLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDO0lBQUE7SUFBakMsS0FBSztJQUFFLE9BQU87RUFD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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImltcG9ydCB7IHNlbGVjdGVkU3R5bGUsIHVuc2VsZWN0ZWRTdHlsZSB9IGZyb20gJy4vc3R5bGVzLmpzJztcbmltcG9ydCB7IGNvbmZpZywgY2FsZW5kYXIsIGxhc3REYXRlQ2xpY2tlZCB9IGZyb20gJy4vY2FsZW5kYXJHZW5lcmF0b3IuanMnO1xuaW1wb3J0IHsgZGlzcGxheVRpbWVDaG9vc2VyTW9kYWwsIGdldFNlbGVjdGVkVGltZXMgfSBmcm9tICcuL2Rpc3BsYXlUaW1lQ2hvb3Nlck1vZGFsLmpzJztcblxuLyoqXG4gKiBDYWxjdWxhdGVzIHRoZSB0aW1lIHZhbHVlIGluIG1pbGxpc2Vjb25kcyBiYXNlZCBvbiB0aGUgZ2l2ZW4gdGltZS5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdGltZSAtIFRoZSB0aW1lIGluIHRoZSBmb3JtYXQgXCJISDpNTVwiLlxuICogQHJldHVybiB7bnVtYmVyfSBUaGUgdGltZSB2YWx1ZSBpbiBtaWxsaXNlY29uZHMuXG4gKlxuICogQGhhc1Rlc3RzXG4gKlxuICogQGV4YW1wbGVcbiAqIC8vIEV4YW1wbGUgdXNhZ2U6XG4gKiBjb25zdCB0aW1lVmFsdWUgPSB0aW1lVmFsdWVJbk1pbGwoJzEyOjMwJyk7XG4gKi9cblxuZnVuY3Rpb24gdGltZVZhbHVlSW5NaWxsICh0aW1lKSB7XG4gIGlmICghdGltZS5pbmNsdWRlcygnOicpKSB7XG4gICAgY29uc3QgZSA9IG5ldyBFcnJvcignRXhwZWN0cyBhIHRpbWUgc3RyaW5nIEhIOk1NJyk7XG4gICAgdGhyb3cgZTtcbiAgfVxuICBjb25zdCBbaG91cnMsIG1pbnV0ZXNdID0gdGltZS5zcGxpdCgnOicpO1xuICByZXR1cm4gKHBhcnNlSW50KGhvdXJzKSAqIDYwICogNjAgKiAxMDAwKSArIChwYXJzZUludChtaW51dGVzKSAqIDYwICogMTAwMCk7XG59XG5cbi8qKlxuICogdmFyIGdldERheXNJbk1vbnRoIC0gR2V0IG51bWJlciBvZiBkYXlzIGluIG1vbnRoXG4gKlxuICogQHBhcmFtICB7IW51bWJlcn0gbW9udGggVGhlIG51bWJlciBvZiB0aGUgY29ycmVzcG9uZGluZyBtb250aC5cbiAqIEBwYXJhbSAgeyFudW1iZXJ9IHllYXIgIFRoZSBjb3JyZXNwb25kaW5nIHllYXIuXG4gKiBAcmV0dXJuIHtudW1iZXJ9IFJldHVybnMgYSBudW1iZXIgY29ycmVzcG9uZGluZyB0byB0aGUgbnVtYmVyIG9mIGRheXMgZm9yIHRoZSBkYXRlIGluIHBvaW50LlxuICovXG5mdW5jdGlvbiBnZXREYXlzSW5Nb250aCAobW9udGgsIHllYXIpIHtcbiAgcmV0dXJuIG5ldyBEYXRlKHllYXIsIG1vbnRoLCAwKS5nZXREYXRlKCk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGZvciBvdmVybGFwIGluIGFuIGFycmF5IG9mIHZhbHVlcy5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSB2YWx1ZXMgLSBUaGUgYXJyYXkgb2YgdmFsdWVzIHRvIGNoZWNrIGZvciBvdmVybGFwLlxuICogQHJldHVybiB7Ym9vbGVhbn0gLSBSZXR1cm5zIHRydWUgaWYgb3ZlcmxhcCBpcyBmb3VuZCwgZmFsc2Ugb3RoZXJ3aXNlLlxuICovXG5mdW5jdGlvbiBjaGVja092ZXJsYXAgKHZhbHVlcykge1xuICBjb25zdCBudW1lcmljYWxFcXVpdmFsZW50ID0gdmFsdWVzLm1hcCh0aW1lVmFsdWVJbk1pbGwpO1xuXG4gIGZvciAobGV0IGN1cnJlbnRJbmRleCA9IDI7IGN1cnJlbnRJbmRleCA8IG51bWVyaWNhbEVxdWl2YWxlbnQubGVuZ3RoOyBjdXJyZW50SW5kZXggKz0gMikge1xuICAgIGNvbnN0IGN1cnJlbnRTdGFydCA9IG51bWVyaWNhbEVxdWl2YWxlbnRbY3VycmVudEluZGV4XTtcbiAgICBjb25zdCBjdXJyZW50RW5kID0gbnVtZXJpY2FsRXF1aXZhbGVudFtjdXJyZW50SW5kZXggKyAxXTtcblxuICAgIGZvciAobGV0IGNvbXBhcmlzb25JbmRleCA9IDA7IGNvbXBhcmlzb25JbmRleCA8IG51bWVyaWNhbEVxdWl2YWxlbnQubGVuZ3RoOyBjb21wYXJpc29uSW5kZXggKz0gMikge1xuICAgICAgaWYgKGN1cnJlbnRJbmRleCAhPT0gY29tcGFyaXNvbkluZGV4KSB7XG4gICAgICAgIGNvbnN0IGNvbXBhcmlzb25TdGFydCA9IG51bWVyaWNhbEVxdWl2YWxlbnRbY29tcGFyaXNvbkluZGV4XTtcbiAgICAgICAgY29uc3QgY29tcGFyaXNvbkVuZCA9IG51bWVyaWNhbEVxdWl2YWxlbnRbY29tcGFyaXNvbkluZGV4ICsgMV07XG5cbiAgICAgICAgaWYgKGNvbXBhcmlzb25FbmQgPj0gY3VycmVudFN0YXJ0ICYmIGNvbXBhcmlzb25FbmQgPD0gY3VycmVudEVuZCkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGVsc2UgaWYgKGN1cnJlbnRTdGFydCA+PSBjb21wYXJpc29uU3RhcnQgJiYgY3VycmVudEVuZCA8PSBjb21wYXJpc29uRW5kKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gZWxzZSBpZiAoY3VycmVudFN0YXJ0ID09PSBjb21wYXJpc29uU3RhcnQgJiYgY3VycmVudEVuZCA9PT0gY29tcGFyaXNvbkVuZCkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGVsc2UgaWYgKGN1cnJlbnRFbmQgPj0gY29tcGFyaXNvblN0YXJ0ICYmIGN1cnJlbnRFbmQgPD0gY29tcGFyaXNvbkVuZCkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogQ2xlYXJzIHRoZSBzZWxlY3Rpb24gb2YgZGF0ZXMgaW4gdGhlIGNhbGVuZGFyLlxuICpcbiAqIEBwYXJhbSB7dW5kZWZpbmVkfVxuICogQHJldHVybiB7dW5kZWZpbmVkfVxuICovXG5mdW5jdGlvbiBjbGVhclNlbGVjdGlvbiAoY2FsZW5kYXIsIGR5bmFtaWNEYXRhKSB7XG4gIGNvbnNvbGUubG9nKGR5bmFtaWNEYXRhKTtcbiAgY29uc3QgZGF0ZXNPYmpTdG9yZSA9IGR5bmFtaWNEYXRhLmRhdGVzU2VsZWN0ZWRBcnJheU9iamVjdHM7XG4gIGNvbnN0IGRhdGVzSW5kZXggPSBkeW5hbWljRGF0YS5kYXRlc1NlbGVjdGVkQXJyYXk7XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRlc09ialN0b3JlLmxlbmd0aDsgaSsrKSB7XG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBkYXRlc0luZGV4Lmxlbmd0aDsgaisrKSB7XG4gICAgICBjb25zb2xlLmxvZyhkYXRlc0luZGV4W2pdKTtcbiAgICAgIGRhdGVzSW5kZXhbal0uZm9yRWFjaCgoZGF0ZSkgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhkYXRlKTtcbiAgICAgICAgdW5zZWxlY3RlZFN0eWxlKGNhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLWh1bWFuZGF0ZT0nJHtkYXRlfSddYCkpO1xuICAgICAgICBpZiAoaSA9PT0gZGF0ZXNPYmpTdG9yZS5sZW5ndGggLSAxICYmIGogPT09IGRhdGVzSW5kZXgubGVuZ3RoIC0gMSkge1xuICAgICAgICAgIGRhdGVzT2JqU3RvcmUubGVuZ3RoID0gMDtcbiAgICAgICAgICBkYXRlc0luZGV4Lmxlbmd0aCA9IDA7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufVxuXG4vKlxuXG4qL1xuXG4vKipcbiAqIEBwYXJhbSB7bnVtYmVyfSBbbGVuZ3RoPTEwXSAtbGVuZ3RoIHRoZSBkZXNpcmVkIGxlbmd0aCBvZiB0aGUgc3RyaW5nIG9mIG51bWJlcnMuXG4gKiBAcmV0dXJucyBhIHN0cmluZyBvZiByYW5kb20gZGlnaXRzIG9mIGEgc3BlY2lmaWVkIGxlbmd0aC5cbiAqL1xuXG5mdW5jdGlvbiByYW5kb21CeXRlcyAobGVuZ3RoKSB7XG4gIGlmIChsZW5ndGggPiA4MCkge1xuICAgIGNvbnN0IGUgPSBuZXcgRXJyb3IoJ3JhbmRvbUJ5dGVzIGxlbmd0aCBjYW4gYmUgbW9yZSB0aGFuIDgwMCBkaWdpdHMnKTtcbiAgICB0aHJvdyBlO1xuICB9XG4gIGNvbnN0IGFycmF5ID0gbmV3IFVpbnQzMkFycmF5KDEwMCk7XG4gIHdpbmRvdy5jcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKGFycmF5KTtcbiAgbGV0IHN0ID0gJyc7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICBzdCArPSBhcnJheVtpXTtcbiAgICBpZiAoaSA9PT0gYXJyYXkubGVuZ3RoIC0gMSkge1xuICAgICAgcmV0dXJuIHN0LnNsaWNlKHN0Lmxlbmd0aCAtIChsZW5ndGggfHwgMTApKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2VuZXJhdGVSYW5kb21TdHJpbmcoKSB7XG4gIGNvbnN0IHJhbmRvbVN0cmluZyA9IHJhbmRvbUJ5dGVzKDEwKTtcbiAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjYWxlbmRhci0nICsgcmFuZG9tU3RyaW5nKSkge1xuICAgIHJldHVybiBnZW5lcmF0ZVJhbmRvbVN0cmluZygpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiByYW5kb21TdHJpbmc7XG4gIH1cbn1cblxuLy9XRSBXRVJFIFNFVFRJTkcgVVAgVEhFIENBTEVOREFSIFRPIFJFTkRFUiBEQVRFUyBJTiBUSEUgUEFTVDpcbi8qIFdhcm5pbmc6IENvbnRlbXBsYXRlcyBkYXlsaWdodCBzYXZpbmcgdGltZSovXG5cbmZ1bmN0aW9uIGdldEVhcmxpZXN0RGF0ZSAocHJlbG9hZGVkRGF0ZXMpIHtcbiAgY29uc3Qgb3JkZXIgPSBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBwcmVsb2FkZWREYXRlcy5sZW5ndGg7IGkrKykge1xuICAgIGlmIChpID09PSAwKSB7XG4gICAgICBvcmRlci5wdXNoKG5ldyBEYXRlKCkuZ2V0VGltZSgpKTtcbiAgICB9XG4gICAgb3JkZXIucHVzaChuZXcgRGF0ZShwcmVsb2FkZWREYXRlc1tpXSkuZ2V0VGltZSgpKTtcbiAgICBpZiAoaSA9PT0gcHJlbG9hZGVkRGF0ZXMubGVuZ3RoIC0gMSkge1xuICAgICAgb3JkZXIuc29ydCgpO1xuICAgICAgY29uc3QgZCA9IG5ldyBEYXRlKG9yZGVyWzBdKTtcbiAgICAgIHJldHVybiBkO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIENvbnZlcnRzIGFuIGFycmF5IG9mIGRhdGVzIGludG8gYSBuZXcgYXJyYXkgb2Ygb2JqZWN0cyB3aXRoIGZvcm1hdHRlZCBkYXRlcy5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBkYXRlcyAtIFRoZSBhcnJheSBvZiBkYXRlcy5cbiAqIEByZXR1cm4ge1Byb21pc2V9IEEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIHRoZSBuZXcgYXJyYXkgb2Ygb2JqZWN0cy5cbiAqL1xuZnVuY3Rpb24gY29udmVydERhdGVzIChkYXRlcykge1xuICBjb25zdCBwcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChkYXRlc1tpXS5kYXkpIHtcbiAgICAgICAgZHluYW1pY0RhdGEuZGF0ZXNTZWxlY3RlZEFycmF5T2JqZWN0cy5wdXNoKGRhdGVzW2ldKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICAvLyBkeW5hbWljRGF0YS5kYXRlc1NlbGVjdGVkQXJyYXlPYmplY3RzLnB1c2goeyBkYXk6IHN0YW5kYXJkRGF0ZU9iamVjdChkYXRlc1tpXSkgfSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHByb21pc2U7XG59XG5cbi8qKlxuICogQXN5bmNocm9ub3VzbHkgcHJlbG9hZHMgZGF0ZXMgZm9yIHRoZSBjYWxlbmRhci5cbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gY2FsZW5kYXIgLSB0aGUgY2FsZW5kYXIgb2JqZWN0XG4gKiBAcGFyYW0ge2FycmF5fSBkYXRlcyAtIGFuIGFycmF5IG9mIGRhdGVzIHRvIHByZWxvYWRcbiAqIEByZXR1cm4ge3ZvaWR9IFxuICovXG5hc3luYyBmdW5jdGlvbiBwcmVsb2FkRGF0ZXMgKGNhbGVuZGFyLCBkYXRlcykge1xuICAvLyBjb25zb2xlLmxvZygnUFJFTE9BRElORyBEQVRFUy4uLicpO1xuICAvLyBjb25zb2xlLmxvZyhjYWxlbmRhcik7XG4gIC8vIGNvbnNvbGUubG9nKGRhdGVzKTtcbiAgZGF0ZXMgPSBbJzIwMjMtMDktMDknXVxuICBsZXQgZW5kVXNlciA9IDE7XG4gIC8vYXR0YWNoKGRhdGVOb2RlKTtcbiAgYXdhaXQgY29udmVydERhdGVzKGRhdGVzKTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGVzU2VsZWN0ZWRBcnJheU9iamVjdHMubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBkYXRlT2JqZWN0ID0gZGF0ZXNTZWxlY3RlZEFycmF5T2JqZWN0c1tpXTtcbiAgICBjb25zdCBkYXRlTm9kZSA9IGNhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoYCMke2RhdGVPYmplY3QuZGF5fWApO1xuXG4gICAgaWYgKGRhdGVOb2RlKSB7XG4gICAgICBkYXRlc1NlbGVjdGVkQXJyYXkucHVzaChkYXRlc1tpXS5kYXkpO1xuICAgICAgZGF0ZU5vZGUuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJyNmYzMnO1xuICAgICAgZGF0ZU5vZGUuY2xhc3NMaXN0LmFkZCgnYXZhaWxhYmxlJyk7XG4gICAgfVxuXG4gICAgaWYgKGVuZFVzZXIpIHtcbiAgICAgIGF0dGFjaChkYXRlTm9kZSk7XG4gICAgICAvL3RpbWVDaG9vc2VyKCk7XG4gICAgfVxuXG4gICAgaWYgKGRpc3BsYXlUaW1lQ2hvb3Nlck1vZGFsKSB7XG4gICAgICAvLyBjcmVhdGVUaW1lRWxlbWVudHMgKCk7XG4gICAgICAvL2dlbmVyYXRlVGltZXNPbmx5KGRhdGVPYmplY3QudGltZXMsIGRhdGVOb2RlKTtcbiAgICB9XG5cbiAgICBpZiAoc2VsZWN0UmFuZ2UgJiYgZGF0ZU5vZGUgJiYgIWRhdGVOb2RlLmNsYXNzTGlzdC5jb250YWlucygnZmlsbGVyJykpIHtcbiAgICAgIGRhdGVOb2RlLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICcjMzMzJztcbiAgICAgIGRhdGVOb2RlLmNsYXNzTGlzdC5hZGQoJ2Jsb2NrZWQnKTtcbiAgICAgIGRhdGVOb2RlLnRpdGxlID0gJ05vIGF2YWlsYWJpbGl0eSBvbiB0aGlzIGRheSc7XG5cbiAgICAgIGNvbnN0IHNvbGRPdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgICBzb2xkT3V0LmNsYXNzTGlzdC5hZGQoJ2NhbGVuZGFyVGltZScpO1xuICAgICAgc29sZE91dC50ZXh0Q29udGVudCA9ICdTb2xkIG91dCc7XG4gICAgICBkYXRlTm9kZS5hcHBlbmRDaGlsZChzb2xkT3V0KTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gYmxvY2tEYXlzTm90T3BlbiAoY2FsZW5kYXIsIGRhdGVzT3Blbikge1xuICBpZiAoY2FsZW5kYXIgJiYgZGF0ZXNPcGVuKSB7XG4gICAgY29uc3QgYWxsRGF5cyA9IEFycmF5LmZyb20oY2FsZW5kYXIucXVlcnlTZWxlY3RvckFsbCgnLmRheVRpbWUnKSkubWFwKChlbCkgPT4geyByZXR1cm4gZWwuZGF0YXNldC5odW1hbmRhdGU7IH0pO1xuICAgIGNvbnN0IG9wZW5EYXlzID0gZGF0ZXNPcGVuLm1hcCgoZWwpID0+IHsgcmV0dXJuIGVsLmRheTsgfSk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFsbERheXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChvcGVuRGF5cy5pbmRleE9mKGFsbERheXNbaV0pID09PSAtMSkge1xuICAgICAgICBjb25zdCBkYXkgPSBjYWxlbmRhci5xdWVyeVNlbGVjdG9yKGBbaWQ9XCIke2FsbERheXNbaV19XCJdYCk7XG4gICAgICAgIGRheS5jbGFzc0xpc3QuYWRkKCd3aWR0aFNoYXBlJywgJ2ZpbGxlcicpO1xuICAgICAgICBkYXkuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJ3doaXRlJztcbiAgICAgICAgZGF5LnRpdGxlID0gJ0Nsb3NlZCBvbiB0aGlzIGRheSc7XG5cbiAgICAgICAgY29uc3QgY2xvc2VkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgICAgICBjbG9zZWQuY2xhc3NMaXN0LmFkZCgnY2FsZW5kYXJUaW1lJyk7XG4gICAgICAgIGNsb3NlZC50ZXh0Q29udGVudCA9ICdjbG9zZWQnO1xuXG4gICAgICAgIGRheS5hcHBlbmRDaGlsZChjbG9zZWQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFJlbGVhc2UgYm9va2VkIGRheVxuICogQGRlc2NyaXB0aW9uIFJlbW92ZXMgYSBkYXkgdGhhdCBoYXMgYmVlbiBwcmV2aW91c2x5IGJvb2tlZC5cbiAqIEBmdW5jdGlvbiByZWxlYXNlQm9va2VkRGF5XG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBkYXkgLSBIVE1MIGRpdiBlbGVtZW50IHJlcHJlc2VudGluZyB0aGUgZGF5LlxuICogQHBhcmFtIHtzdHJpbmd9IGRhdGUgLSBEYXRlIHN0cmluZyBpbiB0aGUgZm9ybWF0ICdZWVlZLU1NLUREJy5cbiAqL1xuZnVuY3Rpb24gcmVsZWFzZUJvb2tlZERheSAoZGF5LCBkYXRlKSB7XG4gIGNvbnN0IGluZGV4ID0gZGF0ZXNTZWxlY3RlZEFycmF5LmluZGV4T2YoZGF0ZSk7XG4gIHVuc2VsZWN0ZWRTdHlsZShkYXkpO1xuICBkYXRlc1NlbGVjdGVkQXJyYXkuc3BsaWNlKGluZGV4LCAxKTtcbiAgZGF0ZXNTZWxlY3RlZEFycmF5T2JqZWN0cy5zcGxpY2UoaW5kZXgsIDEpO1xuXG4gIHdoaWxlIChkYXkuZmlyc3RDaGlsZCkge1xuICAgIGRheS5maXJzdENoaWxkLnJlbW92ZSgpO1xuICB9XG59XG5cbi8qKlxuICogQWRkcyAxIHRvIHRoZSBtb250aCBpbiBhIGdpdmVuIGRhdGUgdG8gbWFrZSBpdCBtb3JlIGh1bWFuLXJlYWRhYmxlLlxuICogQHBhcmFtIHtzdHJpbmd9IGRhdGUgLSBUaGUgZGF0ZSBpbiB0aGUgZm9ybWF0ICdZWVlZLU1NLUREJyBvciAnWVlZWS1NLUQnLlxuICogQHJldHVybnMge3N0cmluZ30gLSBUaGUgbW9kaWZpZWQgZGF0ZSBpbiB0aGUgZm9ybWF0ICdZWVlZLU1NLUREJy5cbiAqIEB0aHJvd3Mge0Vycm9yfSAtIElmIHRoZSBkYXRlIHBhcmFtZXRlciBpcyBub3QgaW4gdGhlIGZvcm1hdCAnWVlZWS1NTS1ERCcgb3IgJ1lZWVktTS1EJy5cbiAqL1xuZnVuY3Rpb24gaHVtYW5EYXRlIChkYXRlKSB7XG4gIGNvbnN0IGRhdGVQYXJ0cyA9IGRhdGUuc3BsaXQoJy0nKTtcbiAgY29uc3QgbW9udGggPSBwYXJzZUludChkYXRlUGFydHNbMV0pICsgMTtcbiAgY29uc3QgZGF5ID0gcGFyc2VJbnQoZGF0ZVBhcnRzWzJdKTtcbiAgY29uc3QgbW9kaWZpZWRNb250aCA9IG1vbnRoIDwgMTAgPyBgMCR7bW9udGh9YCA6IG1vbnRoO1xuICBjb25zdCBtb2RpZmllZERheSA9IGRheSA8IDEwID8gYDAke2RheX1gIDogZGF5O1xuICBjb25zdCBtb2RpZmllZERhdGUgPSBgJHtkYXRlUGFydHNbMF19LSR7bW9kaWZpZWRNb250aH0tJHttb2RpZmllZERheX1gO1xuICByZXR1cm4gbW9kaWZpZWREYXRlO1xufVxuXG5cbmZ1bmN0aW9uIHNvcnRUaW1lcyAodmFsKSB7XG4gIHZhciBzb3J0ZWQgPSBbXTtcbiAgcmV0dXJuIGVudW1lcmF0ZSh2YWwpO1xuXG4gIGZ1bmN0aW9uIHNvcnROdW1iZXIoYSwgYikge1xuICAgIHJldHVybiBhIC0gYjtcbiAgfVxuXG4gIGZ1bmN0aW9uIGVudW1lcmF0ZSh2YWx1ZXMpIHtcbiAgICB2YXIgbnVtZXJpY2FsRXF1aXZhbGVudCA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmFsdWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBudW1lcmljYWxFcXVpdmFsZW50LnB1c2godGltZVZhbHVlSW5NaWxsKHZhbHVlc1tpXSkpO1xuICAgICAgaWYgKGkgPT09IHZhbHVlcy5sZW5ndGggLSAxKSB7XG4gICAgICAgIHJldHVybiBzb3J0KHZhbHVlcywgbnVtZXJpY2FsRXF1aXZhbGVudCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gc29ydCh2YWx1ZXMsIG51bWVyaWNhbEVxdWl2YWxlbnQpIHtcbiAgICB2YXIgbnVtZXJpY2FsRXF1aXZhbGVudENsb25lID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShudW1lcmljYWxFcXVpdmFsZW50KSk7XG4gICAgdmFyIHNvcnRlZEludCA9IG51bWVyaWNhbEVxdWl2YWxlbnQuc29ydChzb3J0TnVtYmVyKTtcbiAgICBmb3IgKHZhciBwID0gMDsgcCA8IG51bWVyaWNhbEVxdWl2YWxlbnRDbG9uZS5sZW5ndGg7IHArKykge1xuICAgICAgdmFyIG5ld0luZGV4ID0gc29ydGVkSW50LmluZGV4T2YobnVtZXJpY2FsRXF1aXZhbGVudENsb25lW3BdKTtcbiAgICAgIHNvcnRlZC5zcGxpY2UocCwgMSwgdmFsdWVzW25ld0luZGV4XSk7XG4gICAgICBpZiAocCA9PT0gbnVtZXJpY2FsRXF1aXZhbGVudC5sZW5ndGggLSAxKSB7XG4gICAgICAgIHJldHVybiBzb3J0ZWQ7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogUmVsZWFzZSBkYXkgb2Ygd2Vla1xuICogQGZ1bmN0aW9uIHJlbGVhc2VEYXlPZldlZWtHXG4gKiBAcGFyYW0gZGF5SUQgaWQgb2YgdGhlIGRheSB0byBiZSByZWxlYXNlZC4gTi5iLiBkYXkgb2Ygd2VlayBpcyBzdG9yZWQgYXMgYSBkYXRhIGF0dHJpYnV0ZVxuICogQHRvZG8gbWFrZSBpdCB1c2UgbGFzdERhdGVDbGlja2VkICh3aGljaCBpcyB0aGUgZGF5IGluIGNvbnRleHQpXG4gKi9cbmZ1bmN0aW9uIHJlbGVhc2VEYXlPZldlZWtHKGRheUlkKSB7XG4gIGNvbnN0IHdlZWtkYXkgPSBsYXN0RGF0ZUNsaWNrZWQuZGF0YXNldC5kYXlvZndlZWs7XG4gIGNvbnN0IGJsb2NrVGhlc2VEYXlzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIltkYXRhLWRheW9md2Vlaz0nXCIgKyB3ZWVrZGF5ICsgXCInXVwiKTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBibG9ja1RoZXNlRGF5cy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBibG9ja0RheSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGJsb2NrVGhlc2VEYXlzW2ldLmlkKTtcbiAgICBpZiAoYmxvY2tEYXkgIT09IGxhc3REYXRlQ2xpY2tlZCkge1xuICAgICAgcmVsZWFzZUJvb2tlZERheShibG9ja0RheSwgYmxvY2tUaGVzZURheXNbaV0uaWQpO1xuICAgICAgcmVtb3ZlVGltZURpc3BsYXkoYmxvY2tUaGVzZURheXNbaV0uaWQpO1xuICAgIH1cbiAgICBpZiAoYmxvY2tEYXkgPT09IGxhc3REYXRlQ2xpY2tlZCkge1xuICAgICAgLy8gcmVtb3ZlIG9ubHkgdGhlIGRpc3BsYXk6XG4gICAgICAvL3JlbW92ZVRpbWVEaXNwbGF5KGJsb2NrVGhlc2VEYXlzW2ldLmlkKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IHsgdGltZVZhbHVlSW5NaWxsLCBjaGVja092ZXJsYXAsIGNsZWFyU2VsZWN0aW9uLCBnZXREYXlzSW5Nb250aCwgZ2VuZXJhdGVSYW5kb21TdHJpbmcsIGdldEVhcmxpZXN0RGF0ZSxcbiAgcHJlbG9hZERhdGVzLCBibG9ja0RheXNOb3RPcGVuLCByZWxlYXNlQm9va2VkRGF5LCBodW1hbkRhdGUsIHNvcnRUaW1lcyB9O1xuXG4vL2Jvb2tEYXkgc2luZ2xlRGF0ZUNob2ljZVxuLy9yZWxlYXNlQm9va2VkRGF5IGRhdGVzU2VsZWN0ZWRBcnJheU9iamVjdHMgZGF0ZXNTZWxlY3RlZEFycmF5IiwidmFyIGNzcyA9IFwiLmNhbGVuZGFyIHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBmbGV4LXdyYXA6IHdyYXA7XFxuICBmbGV4LWRpcmVjdGlvbjogcm93O1xcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNDAsIDI0OCwgMjU1LCAwKTtcXG4gIHdpZHRoOiAxMDAlO1xcbiAgaGVpZ2h0OiAyOC44ZW07XFxuICBvdmVyZmxvdy15OiBhdXRvO1xcbn1cXG4uY2FsZW5kYXIgLmJsb2NrZWQge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogIzMzMztcXG59XFxuLmNhbGVuZGFyIC5maWxsZXIge1xcbiAgcG9pbnRlci1ldmVudHM6IG5vbmU7XFxuICBvcGFjaXR5OiAwLjM7XFxufVxcbi5jYWxlbmRhciAudGltZVNlbGVjdCB7XFxuICBwYWRkaW5nOiAwO1xcbiAgd2lkdGg6IGF1dG87XFxuICBtYXJnaW46IDA7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmO1xcbiAgZmxvYXQ6IHJpZ2h0O1xcbiAgZm9udC13ZWlnaHQ6IDcwMDtcXG4gIGZvbnQtZmFtaWx5OiBBcmlhbCwgSGVsdmV0aWNhLCBzYW5zLXNlcmlmO1xcbiAgYm9yZGVyLXN0eWxlOiBzb2xpZDtcXG4gIGJvcmRlci1yYWRpdXM6IDFlbTtcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuICBib3JkZXItd2lkdGg6IDNweDtcXG4gIGJvcmRlci1jb2xvcjogI2YxNTkyNTtcXG4gIGNvbG9yOiAjMDAwO1xcbiAgZm9udC1zaXplOiAwLjllbTtcXG59XFxuLmNhbGVuZGFyIC50aW1lQ29udCB7XFxuICBtYXJnaW4tbGVmdDogYXV0bztcXG4gIHdpZHRoOiAxMGVtO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogYWxpY2VibHVlO1xcbiAgYm9yZGVyLXN0eWxlOiBzb2xpZDtcXG4gIGJvcmRlci1jb2xvcjogI2YxNTkyNTtcXG4gIG1hcmdpbi1yaWdodDogYXV0bztcXG4gIG1hcmdpbi10b3A6IDEwZW07XFxufVxcbi5jYWxlbmRhciAuZGF5YmxvY2tyb3cge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGZsZXgtZGlyZWN0aW9uOiByb3c7XFxuICBtaW4td2lkdGg6IDEwMCU7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiBhbGljZWJsdWU7XFxufVxcbi5jYWxlbmRhciAuY2FsZW5kYXJUaW1lUGFyZW50IHtcXG4gIG1hcmdpbjogMC4xZW07XFxufVxcbi5jYWxlbmRhciAuY2FsZW5kYXJUaW1lUGFyZW50IC5jYWxlbmRhclRpbWUge1xcbiAgZm9udC1zaXplOiAwLjllbTtcXG4gIG1hcmdpbi10b3A6IDBlbTtcXG4gIGxpbmUtaGVpZ2h0OiAxO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogYWxpY2VibHVlO1xcbiAgY29sb3I6IGJsYWNrO1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgbWFyZ2luOiAwcHg7XFxufVxcbi5jYWxlbmRhciAud2lkdGhTaGFwZURheXMge1xcbiAgd2lkdGg6IDE0LjI4NTcxNDI4NTclO1xcbiAgbWFyZ2luLWxlZnQ6IGF1dG87XFxuICBtYXJnaW4tcmlnaHQ6IGF1dG87XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxufVxcbi5jYWxlbmRhciAud2lkdGhTaGFwZSB7XFxuICB3aWR0aDogMTQuMjg1NzE0Mjg1NyU7XFxuICBtYXJnaW4tbGVmdDogYXV0bztcXG4gIG1hcmdpbi1yaWdodDogYXV0bztcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gIG1pbi1oZWlnaHQ6IDMuNmVtO1xcbiAgbWFyZ2luLWJvdHRvbTogMC4yZW07XFxufVxcbi5jYWxlbmRhciAubW9udGhOYW1lIHtcXG4gIG1hcmdpbjogYXV0bztcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gIGZvbnQtZmFtaWx5OiBVYnVudHU7XFxuICBmb250LXNpemU6IDEuNjFlbTtcXG4gIGJhY2tncm91bmQtY29sb3I6ICMzMzdhYjc7XFxuICBjb2xvcjogI2ZmY2MzMztcXG4gIGZsZXgtYmFzaXM6IDEwMCU7XFxuICBib3JkZXItYm90dG9tLXN0eWxlOiBzb2xpZDtcXG59XFxuLmNhbGVuZGFyIC53ZWVrcm93IHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBmbGV4LXdyYXA6IG5vd3JhcDtcXG4gIGZsZXgtZGlyZWN0aW9uOiByb3c7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmO1xcbiAgZm9udC1mYW1pbHk6IFxcXCJyb2JvdG9cXFwiLCBcXFwiYXJpYWxcXFwiO1xcbn1cXG4uY2FsZW5kYXIgLmRheU5hbWUge1xcbiAgY29sb3I6IGJsYWNrO1xcbiAgZm9udC1mYW1pbHk6IFxcXCJyb2JvdG9cXFwiLCBcXFwiYXJpYWxcXFwiO1xcbiAgZm9udC13ZWlnaHQ6IDYwMDtcXG4gIGJhY2tncm91bmQtY29sb3I6ICNjY2M7XFxufVxcbi5jYWxlbmRhciAubW9udGggPiAqIHtcXG4gIG1hcmdpbi1sZWZ0OiAycHg7XFxuICBtYXJnaW4tcmlnaHQ6IDJweDtcXG59XFxuLmNhbGVuZGFyIC5tb250aCB7XFxuICB3aWR0aDogNTAlO1xcbiAgbWluLXdpZHRoOiAzMDBweDtcXG4gIG1hcmdpbjogYXV0bztcXG59XFxuLmNhbGVuZGFyIC50aW1lQ2hvb3NlciB7XFxuICB3aWR0aDogMTBlbTtcXG4gIHBvc2l0aW9uOiBzdGF0aWM7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiBhbGljZWJsdWU7XFxuICBtYXJnaW4tbGVmdDogYXV0bztcXG4gIG1hcmdpbi1yaWdodDogYXV0bztcXG59XFxuLmNhbGVuZGFyIC50aW1lQ29udGFpbmVyIHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxufVxcbi5jYWxlbmRhciAudGltZUNob29zZXJNb2RhbCB7XFxuICB6LWluZGV4OiAxO1xcbiAgd2lkdGg6IDEwMCU7XFxuICBoZWlnaHQ6IDEwMCU7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuNCk7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxufVxcbi5jYWxlbmRhciAuY2FsZW5kYXJMYWJlbCB7XFxuICBtaW4td2lkdGg6IDNlbTtcXG4gIHBhZGRpbmc6IDBlbSAxZW0gMGVtIDFlbTtcXG4gIGNvbG9yOiBibGFjaztcXG4gIGZvbnQtZmFtaWx5OiBcXFwicm9ib3RvXFxcIiwgXFxcImFyaWFsXFxcIjtcXG4gIGZvbnQtd2VpZ2h0OiA2MDA7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjY2NjO1xcbiAgbWFyZ2luOiAxZW0gMCAxZW0gMDtcXG59XFxuLmNhbGVuZGFyIC5kZWxldGVEaXYge1xcbiAgZm9udC1mYW1pbHk6IFVidW50dTtcXG4gIGZvbnQtc2l6ZTogMS42MWVtO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogIzMzN2FiNztcXG4gIGNvbG9yOiAjZmZjYzMzO1xcbiAgYm9yZGVyLWJvdHRvbS1zdHlsZTogc29saWQ7XFxuICBoZWlnaHQ6IDJlbTtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxufVxcbi5jYWxlbmRhciAuZGVsZXRlQnV0dG9uIHtcXG4gIGJhY2tncm91bmQtY29sb3I6IHdoaXRlO1xcbiAgY29sb3I6ICNmMTU5MjU7XFxuICBmbG9hdDogcmlnaHQ7XFxuICBmb250LXdlaWdodDogNzAwO1xcbiAgZm9udC1mYW1pbHk6IEFyaWFsLCBIZWx2ZXRpY2EsIHNhbnMtc2VyaWY7XFxuICBib3JkZXItc3R5bGU6IHNvbGlkO1xcbiAgYm9yZGVyLXJhZGl1czogMWVtO1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgaGVpZ2h0OiAzMHB4O1xcbiAgd2lkdGg6IDMwcHg7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbn1cXG4uY2FsZW5kYXIgLmlubmVyU3BhbkRlbGV0ZUJ0biB7XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxufVxcbi5jYWxlbmRhciAuZGVsZXRlQnV0dG9uOmhvdmVyLFxcbi5jYWxlbmRhciAuZGVsZXRlQnV0dG9uOmZvY3VzLFxcbi5jYWxlbmRhciAudGltZVNlbGVjdDpob3ZlcixcXG4uY2FsZW5kYXIgLnRpbWVTZWxlY3Q6Zm9jdXMge1xcbiAgY29sb3I6ICMwMDA7XFxuICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XFxuICBjdXJzb3I6IHBvaW50ZXI7XFxufVxcbi5jYWxlbmRhciAuaG91ciB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgd2lkdGg6IDEwZW07XFxufVxcbi5jYWxlbmRhciAudGltZVNlbGVjdFAge1xcbiAgZGlzcGxheTogaW5saW5lO1xcbiAgd2lkdGg6IDVlbTtcXG4gIGNvbG9yOiAjMDAwO1xcbn1cXG4uY2FsZW5kYXIgLnRpbWVDaG9vc2VyID4gaW5wdXRbdHlwZT1jaGVja2JveF0ge1xcbiAgb3V0bGluZTogI2YxNTkyNTtcXG4gIG91dGxpbmUtc3R5bGU6IHNvbGlkO1xcbn1cXG4uY2FsZW5kYXIgLnRpbWVTZWxlY3QgPiBvcHRpb24ge1xcbiAgY29sb3I6ICMwMDA7XFxufVxcbi5jYWxlbmRhciAuY2FsZW5kYXIgPiBwLFxcbi5jYWxlbmRhciBoNCxcXG4uY2FsZW5kYXIgaDMsXFxuLmNhbGVuZGFyIGgyLFxcbi5jYWxlbmRhciBoMSxcXG4uY2FsZW5kYXIgc2VsZWN0LFxcbi5jYWxlbmRhciBvcHRpb24ge1xcbiAgY29sb3I6ICMwMDA7XFxufVxcbi5jYWxlbmRhciAuYXJyb3ctdXAge1xcbiAgd2lkdGg6IDA7XFxuICBoZWlnaHQ6IDA7XFxuICBib3JkZXItbGVmdDogMTBweCBzb2xpZCB0cmFuc3BhcmVudDtcXG4gIGJvcmRlci1yaWdodDogMTBweCBzb2xpZCB0cmFuc3BhcmVudDtcXG4gIGJvcmRlci1ib3R0b206IDEwcHggc29saWQgYmxhY2s7XFxufVxcbi5jYWxlbmRhciAuYXJyb3ctZG93biB7XFxuICB3aWR0aDogMDtcXG4gIGhlaWdodDogMDtcXG4gIGJvcmRlci1sZWZ0OiAxMHB4IHNvbGlkIHRyYW5zcGFyZW50O1xcbiAgYm9yZGVyLXJpZ2h0OiAxMHB4IHNvbGlkIHRyYW5zcGFyZW50O1xcbiAgYm9yZGVyLXRvcDogMTBweCBzb2xpZCAjMDAwO1xcbn1cXG4uY2FsZW5kYXIgLmFycm93cyB7XFxuICBmbG9hdDogcmlnaHQ7XFxuICBjbGVhcjogcmlnaHQ7XFxuICBwb3NpdGlvbjogcmVsYXRpdmU7XFxuICBjdXJzb3I6IHBvaW50ZXI7XFxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbn1cXG4uY2FsZW5kYXIgLmFycm93LXJpZ2h0IHtcXG4gIHdpZHRoOiAwO1xcbiAgaGVpZ2h0OiAwO1xcbiAgYm9yZGVyLXRvcDogNjBweCBzb2xpZCB0cmFuc3BhcmVudDtcXG4gIGJvcmRlci1ib3R0b206IDYwcHggc29saWQgdHJhbnNwYXJlbnQ7XFxuICBib3JkZXItbGVmdDogNjBweCBzb2xpZCBncmVlbjtcXG59XFxuLmNhbGVuZGFyIC5hcnJvdy1sZWZ0IHtcXG4gIHdpZHRoOiAwO1xcbiAgaGVpZ2h0OiAwO1xcbiAgYm9yZGVyLXRvcDogMTBweCBzb2xpZCB0cmFuc3BhcmVudDtcXG4gIGJvcmRlci1ib3R0b206IDEwcHggc29saWQgdHJhbnNwYXJlbnQ7XFxuICBib3JkZXItcmlnaHQ6IDEwcHggc29saWQgYmx1ZTtcXG59XFxuLmNhbGVuZGFyIC5kYXlUaW1lIHtcXG4gIGN1cnNvcjogcG9pbnRlcjtcXG59XFxuLmNhbGVuZGFyIC5kYXlUaW1lID4gKiB7XFxuICBwb2ludGVyLWV2ZW50czogbm9uZTtcXG59XFxuLyojIHNvdXJjZU1hcHBpbmdVUkw9Y2FsZW5kYXJBcHAuY3NzLm1hcCAqL1xcblwiOyAocmVxdWlyZShcImJyb3dzZXJpZnktY3NzXCIpLmNyZWF0ZVN0eWxlKGNzcywgeyBcImhyZWZcIjogXCJjb21tb25Nb2R1bGVzL21vZHVsZXMvU3dpZnRDYWwtQi9wcmVCdW5kbGluZ0pTL2NhbGVuZGFyQXBwLmNzc1wiIH0sIHsgXCJpbnNlcnRBdFwiOiBcImJvdHRvbVwiIH0pKTsgbW9kdWxlLmV4cG9ydHMgPSBjc3M7IiwiLyoqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBIYXNUZXN0c1RhZ1xuICogQHByb3BlcnR5IHtib29sZWFufSBoYXNUZXN0cyAtIEluZGljYXRlcyB3aGV0aGVyIHRoZSBmdW5jdGlvbiBoYXMgdGVzdHMuXG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBoYXNUaGVzZVN0eWxlc1xuICogQHByb3BlcnR5IHtzdHJpbmd9IGhhc1RoZXNlU3R5bGVzIC0gTGlzdHMgc3R5bGVzIHJlZmVyZW5jZXMgaW4gYSBmdW50aW9uXG4gKi9cblxuaW1wb3J0IHtcbiAgZ2V0RGF5c0luTW9udGgsIGdlbmVyYXRlUmFuZG9tU3RyaW5nLCBnZXRFYXJsaWVzdERhdGUsXG4gIHByZWxvYWREYXRlcywgYmxvY2tEYXlzTm90T3BlbiwgaHVtYW5EYXRlLCBjbGVhclNlbGVjdGlvblxufSBmcm9tICcuL2Jhc2ljRnVuY3Rpb25zLmpzJztcbmltcG9ydCB7IGRpc3BsYXlUaW1lQ2hvb3Nlck1vZGFsLCBnZXRTZWxlY3RlZFRpbWVzIH0gZnJvbSAnLi9kaXNwbGF5VGltZUNob29zZXJNb2RhbC5qcyc7XG5pbXBvcnQgeyBjb2xvdXJzLCBzZWxlY3RlZFN0eWxlLCB1bnNlbGVjdGVkU3R5bGUgfSBmcm9tICcuL3N0eWxlcy5qcyc7XG5pbXBvcnQgeyBsYW5ndWFnZXMgfSBmcm9tICcuL2xhbmd1YWdlcy5qcyc7XG5pbXBvcnQgc3R5bGUgZnJvbSAnLi9jYWxlbmRhckFwcC5jc3MnO1xuXG4vKipcbiAqIEFkZHMgdGhlIHNwZWNpZmllZCBudW1iZXIgb2YgbW9udGhzIHRvIGEgZGF0ZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBtb250aHMgLSBUaGUgbnVtYmVyIG9mIG1vbnRocyB0byBhZGQuXG4gKiBAcmV0dXJucyB7RGF0ZX0gLSBUaGUgdXBkYXRlZCBkYXRlLlxuICovXG5EYXRlLnByb3RvdHlwZS5hZGRNb250aHMgPSBmdW5jdGlvbihtb250aHMpIHtcbiAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKHRoaXMpO1xuICBjb25zdCB5ZWFycyA9IE1hdGguZmxvb3IobW9udGhzIC8gMTIpO1xuICBjb25zdCByZW1haW5pbmdNb250aHMgPSBtb250aHMgJSAxMjtcbiAgaWYgKHllYXJzKSB7XG4gICAgZGF0ZS5zZXRGdWxsWWVhcihkYXRlLmdldEZ1bGxZZWFyKCkgKyB5ZWFycyk7XG4gIH1cbiAgaWYgKHJlbWFpbmluZ01vbnRocykge1xuICAgIGRhdGUuc2V0TW9udGgoZGF0ZS5nZXRNb250aCgpICsgcmVtYWluaW5nTW9udGhzKTtcbiAgfVxuICByZXR1cm4gZGF0ZTtcbn07XG5cbmN1c3RvbUVsZW1lbnRzLmRlZmluZSgnc3dpZnQtY2FsJywgY2xhc3MgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG4gIGNvbnN0cnVjdG9yICgpIHtcbiAgICBzdXBlcigpO1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIC8vIGRhdGEtbnVtYmVyLW9mLW1vbnRocy10by1kaXNwbGF5IGh0bWwgY29udmVydHMgdG8gbnVtYmVyT2ZNb250aHNUb0Rpc3BsYXkgSlNcbiAgICBjb25zdCBudW1iZXJPZk1vbnRoc1RvRGlzcGxheSA9IHRoaXMuZGF0YXNldC5udW1iZXJPZk1vbnRoc1RvRGlzcGxheTtcbiAgICBjb25zdCBjYWxlbmRhciA9IG5ldyBTd2lmdENhbCgpO1xuICAgIGNhbGVuZGFyLmdlbmVyYXRlQ2FsZW5kYXIoXG4gICAgICB7XG4gICAgICAgIHRhcmdldDogc2VsZixcbiAgICAgICAgbnVtYmVyT2ZNb250aHNUb0Rpc3BsYXk6IG51bWJlck9mTW9udGhzVG9EaXNwbGF5XG4gICAgICB9KTtcbiAgICB0aGlzLmR5bmFtaWNEYXRhID0gY2FsZW5kYXIucmV0dXJuRHluYW1pY0RhdGEoKTtcbiAgfVxufSk7XG5cbmZ1bmN0aW9uIFN3aWZ0Q2FsICgpIHtcbiAgY29uc3QgY29uZmlnID0ge307XG4gIGNvbnN0IGNhbGVuZGFyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cbiAgY29uc3QgZHluYW1pY0RhdGEgPSB7XG4gICAgZGF0ZXNTZWxlY3RlZEFycmF5OiBbXSxcbiAgICBkYXRlc1NlbGVjdGVkQXJyYXlPYmplY3RzOiBbXSxcbiAgICBkaXNhYmxlZDogZmFsc2VcbiAgfTtcblxuICB0aGlzLnJldHVybkNhbGVuZGFyID0gKCkgPT4ge1xuICAgIHJldHVybiBjYWxlbmRhcjtcbiAgfTtcblxuICB0aGlzLnJldHVybkR5bmFtaWNEYXRhID0gKCkgPT4ge1xuICAgIHJldHVybiBkeW5hbWljRGF0YTtcbiAgfTtcblxuICB0aGlzLnJldHVybkNvbmZpZyA9ICgpID0+IHtcbiAgICByZXR1cm4gY29uZmlnO1xuICB9O1xuXG4gIHRoaXMuc2V0Q29uZmlnID0gKGNvbmZpZ09iaikgPT4ge1xuICAgIC8vIElmIGNhbGxlZCB2aWEgSFRNTFxuICAgIGNvbmZpZy5jYWxlbmRhckNvbnRhaW5lciA9IGNvbmZpZ09iai50YXJnZXQgfHwgZmFsc2U7XG4gICAgLy8gSWYgY2FsbGVkIHZpYSBKYXZhc2NyaXB0XG4gICAgY29uZmlnLnBhcmVudERpdiA9ICh0eXBlb2YgY29uZmlnT2JqLnBhcmVudERpdiA9PT0gJ3N0cmluZycpID8gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihjb25maWdPYmoucGFyZW50RGl2KSA6IGNvbmZpZ09iai5wYXJlbnREaXY7XG4gICAgLy8gZG9uZVxuICAgIGNvbmZpZy5udW1iZXJPZk1vbnRoc1RvRGlzcGxheSA9IGNvbmZpZ09iai5udW1iZXJPZk1vbnRoc1RvRGlzcGxheSB8fCAxMjtcbiAgICAvLyBkb25lXG4gICAgY29uZmlnLmRpc3BsYXlUaW1lQ2hvb3Nlck1vZGFsID0gY29uZmlnT2JqLmRpc3BsYXlUaW1lQ2hvb3Nlck1vZGFsIHx8IHRydWU7XG4gICAgLy8gZG9uZVxuICAgIGNvbmZpZy5zaW5nbGVEYXRlQ2hvaWNlID0gY29uZmlnT2JqLnNpbmdsZURhdGVDaG9pY2UgfHwgZmFsc2U7XG4gICAgLy8gZG9uZVxuICAgIGNvbmZpZy5zZWxlY3RSYW5nZSA9ICFjb25maWdPYmouc2luZ2xlRGF0ZUNob2ljZTtcbiAgICAvLyBkb25lXG4gICAgY29uZmlnLmxhbmd1YWdlID0gY29uZmlnT2JqLmxhbmd1YWdlIHx8ICdlbkdiJztcbiAgICAvLyBkb25lXG4gICAgY29uZmlnLnNlbGVjdE11bHRpcGxlID0gY29uZmlnLnNlbGVjdE11bHRpcGxlIHx8IGZhbHNlO1xuICAgIC8vIGRvbmVcbiAgICBjb25maWcuZGlzcGxheVRpbWVTZWxlY3Rpb25PbkRhdGUgPSBjb25maWdPYmouZGlzcGxheVRpbWVTZWxlY3Rpb25PbkRhdGUgfHwgdHJ1ZTtcblxuICAgIGNvbmZpZy5wcmVsb2FkZWREYXRlcyA9IGNvbmZpZ09iai5wcmVsb2FkZWREYXRlcyB8fCBbXTtcbiAgICBjb25maWcuZW5kVXNlciA9IGNvbmZpZ09iai5lbmRVc2VyIHx8IGZhbHNlO1xuICAgIGNvbmZpZy5lbmRVc2VyRHVyYXRpb25DaG9pY2UgPSBjb25maWdPYmouZW5kVXNlckR1cmF0aW9uQ2hvaWNlIHx8IGZhbHNlO1xuICAgIGNvbmZpZy5iYWNrZW5kID0gY29uZmlnT2JqLmJhY2tlbmQgfHwgZmFsc2U7XG4gICAgY29uZmlnLmRpc3BsYXlCbG9ja2VkID0gY29uZmlnT2JqLmRpc3BsYXlCbG9ja2VkIHx8IGZhbHNlO1xuICAgIGNvbmZpZy5kYXRlc09wZW4gPSBjb25maWdPYmouZGF0ZXNPcGVuIHx8IGZhbHNlO1xuICB9O1xuXG4gIHRoaXMuZ2VuZXJhdGVDYWxlbmRhciA9IChjb25maWdPYmopID0+IHtcbiAgICBpZiAoY29uZmlnT2JqKSB7XG4gICAgICB0aGlzLnNldENvbmZpZyhjb25maWdPYmopO1xuICAgIH1cbiAgICAvLyBJZiBjYWxsZWQgdmlhIGphdmFzY3JpcHQgYSBwYXJlbnRFbGVtZW50IG5lZWRzIHRvIGJlIHByb3ZpZGVkXG4gICAgY29uc3QgcGFyZW50RGl2ID0gY29uZmlnLnBhcmVudERpdjtcbiAgICAvKlxuICAgICAgSWYgY2FsbGVkIGZyb20gaHRtbCBhcyBhIGN1c3RvbSBjb21wb25lbnQgdGhlIGNvbXBvbmVudCBpdHNlbGYgaXMgcGFzc2VkIChjYWxlbmRhckNvbnRhaW5lcilcbiAgICAgIElmIGNhbGxlZCB2aWEgSlMgd2hpbGUgdGhlIGNvbXBvbmVudCBpc24ndCBhIHdlYmNvbXBvbmVudCBpbiB0aGUgc3RyaWN0ZXN0IHNlbnNlLCBpdCBzdGlsbFxuICAgICAgYmVoYXZlcyBsaWtlIG9uZSBhbmQgaXMgZW5jYXBzdWxhdGVkIGluIGEgc2hhZG93LlxuICAgICovXG5cbiAgICBpZiAoY29uZmlnLmNhbGVuZGFyQ29udGFpbmVyKSB7XG4gICAgICBzaGFkb3dBdHRhY2goY29uZmlnLmNhbGVuZGFyQ29udGFpbmVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbmV3Q29udGFpbmVyKCkudGhlbigoY29udGFpbmVyKSA9PiB7XG4gICAgICAgIHNoYWRvd0F0dGFjaChjb250YWluZXIpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbmV3Q29udGFpbmVyICgpIHtcbiAgICAgIGNvbnN0IHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGNvbnN0IG5ld0NhbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBuZXdDYWwuY2xhc3NMaXN0LmFkZCgnc3dpZnQtY2FsJyk7XG4gICAgICAgIHBhcmVudERpdi5hcHBlbmRDaGlsZChuZXdDYWwpO1xuICAgICAgICByZXNvbHZlKG5ld0NhbCk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBwcm9taXNlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNoYWRvd0F0dGFjaCAoY29udGFpbmVyKSB7XG4gICAgICBjb25zdCBzaGFkb3dSb290ID0gY29udGFpbmVyLmF0dGFjaFNoYWRvdyh7IG1vZGU6ICdvcGVuJyB9KTtcbiAgICAgIGNvbnN0IGNzcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgICBjc3MudGV4dENvbnRlbnQgPSBzdHlsZTtcbiAgICAgIHNoYWRvd1Jvb3QuYXBwZW5kQ2hpbGQoY3NzKTtcbiAgICAgIHNoYWRvd1Jvb3QuYXBwZW5kQ2hpbGQoY2FsZW5kYXIpO1xuICAgIH1cblxuICAgIGNvbnN0IHByZWxvYWRlZERhdGVzID0gY29uZmlnLnByZWxvYWRlZERhdGVzO1xuICAgIGNvbnN0IG51bWJlck9mTW9udGhzVG9EaXNwbGF5ID0gY29uZmlnLm51bWJlck9mTW9udGhzVG9EaXNwbGF5O1xuICAgIGNvbnN0IGRhdGVzT3BlbiA9IGNvbmZpZy5kYXRlc09wZW47XG4gICAgY29uc3QgbGFuZ3VhZ2UgPSBjb25maWcubGFuZ3VhZ2U7XG4gICAgLy8gVE9ETzpcbiAgICBjb25zdCBkaXNwbGF5VGltZUNob29zZXJNb2RhbCA9IGNvbmZpZy5kaXNwbGF5VGltZUNob29zZXJNb2RhbDtcbiAgICBjb25zdCBlbmRVc2VyID0gY29uZmlnLmVuZFVzZXI7XG4gICAgY29uc3QgZW5kVXNlckR1cmF0aW9uQ2hvaWNlID0gY29uZmlnLmVuZFVzZXJEdXJhdGlvbkNob2ljZTtcbiAgICBjb25zdCBiYWNrZW5kID0gY29uZmlnLmJhY2tlbmQ7XG4gICAgY29uc3QgZGlzcGxheUJsb2NrZWQgPSBjb25maWcuZGlzcGxheUJsb2NrZWQ7XG4gICAgY29uc3Qgc2luZ2xlRGF0ZUNob2ljZSA9IGZhbHNlO1xuICAgIGNvbnN0IHNlbGVjdFJhbmdlID0gIWNvbmZpZy5zaW5nbGVEYXRlQ2hvaWNlO1xuXG4gICAgbGV0IHVuaXF1ZURheUluZGV4ID0gMDtcbiAgICAvLyBDYWxlbmRhciBpcyBkZWZpbmVkIGdsb2JhbGx5IHdpdGhpbiB0aGUgY29uc3RydWN0b3JcbiAgICBjb25zdCBjYWxlbmRhclVuaXF1ZUlkID0gZ2VuZXJhdGVSYW5kb21TdHJpbmcoKTtcbiAgICBjYWxlbmRhci5pZCA9IGBjYWxlbmRhci0ke2NhbGVuZGFyVW5pcXVlSWR9YDtcbiAgICBjYWxlbmRhci5jbGFzc0xpc3QuYWRkKCdjYWxlbmRhcicpO1xuXG4gICAgY29uc3QgbW9udGhzID0gW107XG4gICAgY29uc3QgZGF0ZU5vdyA9IG5ldyBEYXRlKCk7XG4gICAgY29uc3QgZWFybGllc3REYXRlID0gKHByZWxvYWRlZERhdGVzICYmIHByZWxvYWRlZERhdGVzLmJvb2tlZCkgPyBnZXRFYXJsaWVzdERhdGUocHJlbG9hZGVkRGF0ZXMpIDogZGF0ZU5vdztcbiAgICBjb25zdCBzdGFydE1vbnRoID0gZWFybGllc3REYXRlLmdldE1vbnRoKCk7XG4gICAgY29uc3QgbW9udGhOYW1lcyA9IGxhbmd1YWdlc1tsYW5ndWFnZV0uZ2VuZXJhbFRpbWUubW9udGhzO1xuICAgIC8qIENyZWF0ZSBtb250aCB2aWV3ICovXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1iZXJPZk1vbnRoc1RvRGlzcGxheTsgaSsrKSB7XG4gICAgICAvKiBNb250aCBzcGVjaWZpYyB2YXJpYWJsZXMgYW5kIHRyYWNrZXJzICovXG4gICAgICBjb25zdCB5ZWFyQ2FsYyA9IGVhcmxpZXN0RGF0ZS5hZGRNb250aHMoaSkuZ2V0RnVsbFllYXIoKTtcbiAgICAgIGNvbnN0IG1vbnRoQ2FsYyA9IChzdGFydE1vbnRoICsgaSkgJSAxMjtcbiAgICAgIGNvbnN0IHN0YXJ0RGF5T2ZNb250aCA9IG5ldyBEYXRlKHllYXJDYWxjLCBtb250aENhbGMpLmdldERheSgpO1xuICAgICAgY29uc3QgZGF5c0luTW9udGggPSBnZXREYXlzSW5Nb250aCgoc3RhcnRNb250aCArIGkgKyAxKSAlIDEyLCBlYXJsaWVzdERhdGUuYWRkTW9udGhzKGkpLmdldEZ1bGxZZWFyKCkpO1xuICAgICAgbGV0IGNvdW50ID0gMTtcbiAgICAgIGxldCBkYXlvZndlZWsgPSAwO1xuXG4gICAgICAvKiBDcmVhdGUgbW9udGggZGl2ICovXG4gICAgICBjb25zdCBtb250aCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgbW9udGhzLnB1c2gobW9udGgpO1xuICAgICAgbW9udGguc3R5bGUud2lkdGggPSAnMTVlbSc7XG4gICAgICBtb250aC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBjb2xvdXJzLm1vbnRoQm9yZGVyQ29sb3I7XG4gICAgICBtb250aC5jbGFzc0xpc3QuYWRkKCdtb250aCcpO1xuICAgICAgY2FsZW5kYXIuYXBwZW5kQ2hpbGQobW9udGgpO1xuXG4gICAgICAvKiBDcmVhdGUgbW9udGggbmFtZSBkaXYgKG1vbnRoIFlZWVkpIGF0IHRoZSB0b3Agb2YgbW9udGggZGlzcGxheSAqL1xuICAgICAgY29uc3QgbW9udGhOYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBtb250aE5hbWUuY2xhc3NMaXN0LmFkZCgnbW9udGhOYW1lJyk7XG4gICAgICBtb250aE5hbWUudGV4dENvbnRlbnQgPSBgJHttb250aE5hbWVzWyhzdGFydE1vbnRoICsgaSkgJSAxMl19ICR7ZWFybGllc3REYXRlLmdldEZ1bGxZZWFyKCl9YDtcbiAgICAgIG1vbnRoLmFwcGVuZENoaWxkKG1vbnRoTmFtZSk7XG5cbiAgICAgIC8qIENyZWF0ZSBkaXYgd2l0aCBuYW1lZCBkYXlzIG9mIHRoZSB3ZWVrICovXG4gICAgICBjb25zdCBkYXlOYW1lcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgbW9udGguYXBwZW5kQ2hpbGQoZGF5TmFtZXMpO1xuICAgICAgZGF5TmFtZXMuY2xhc3NMaXN0LmFkZCgnd2Vla3JvdycpO1xuICAgICAgbGFuZ3VhZ2VzW2xhbmd1YWdlXS5nZW5lcmFsVGltZS5kYXlzVHJ1bmNhdGVkLmZvckVhY2goKGRheU5hbWUpID0+IHtcbiAgICAgICAgY29uc3QgZGF5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGRheS50ZXh0Q29udGVudCA9IGRheU5hbWU7XG4gICAgICAgIGRheS5jbGFzc0xpc3QuYWRkKCdkYXlOYW1lJywgJ3dpZHRoU2hhcGVEYXlzJyk7XG4gICAgICAgIGRheU5hbWVzLmFwcGVuZENoaWxkKGRheSk7XG4gICAgICB9KTtcblxuICAgICAgLyogQ3JlYXRlIHdlZWsgcm93cyBmaXJzdCB3ZWVrLCBpdCdzIHJlYXNpZ25lZCBmICovXG4gICAgICBsZXQgd2Vla1JvdztcbiAgICAgIGZ1bmN0aW9uIG1ha2VOZXdXZWVrUm93ICgpIHtcbiAgICAgICAgd2Vla1JvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBtb250aC5hcHBlbmRDaGlsZCh3ZWVrUm93KTtcbiAgICAgICAgd2Vla1Jvdy5jbGFzc0xpc3QuYWRkKCd3ZWVrcm93Jyk7XG4gICAgICAgIGRheW9md2VlayA9IDA7XG4gICAgICB9XG5cbiAgICAgIC8vIDQyIGRheXMsIGkuZS4gNiByb3dzIG9mIDdcbiAgICAgIGZvciAobGV0IHAgPSAwOyBwIDwgNDI7IHArKykge1xuICAgICAgICBpZiAocCA9PT0gMCkge1xuICAgICAgICAgIG1ha2VOZXdXZWVrUm93KCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHAgPCBzdGFydERheU9mTW9udGgpIHtcbiAgICAgICAgICBjb25zdCBwZWdob2xlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgcGVnaG9sZS5jbGFzc0xpc3QuYWRkKCd3aWR0aFNoYXBlJywgJ2ZpbGxlcicpO1xuICAgICAgICAgIHVuc2VsZWN0ZWRTdHlsZShwZWdob2xlKTtcbiAgICAgICAgICB3ZWVrUm93LmFwcGVuZENoaWxkKHBlZ2hvbGUpO1xuICAgICAgICAgIGRheW9md2VlaysrO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHAgPj0gc3RhcnREYXlPZk1vbnRoICYmIHAgPD0gKHN0YXJ0RGF5T2ZNb250aCArIGRheXNJbk1vbnRoIC0gMSkpIHtcbiAgICAgICAgICBjb25zdCBwZWdob2xlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgcGVnaG9sZS50ZXh0Q29udGVudCA9IGNvdW50O1xuICAgICAgICAgIHBlZ2hvbGUuZGF0YXNldC5kYXkgPSBjb3VudDtcbiAgICAgICAgICBwZWdob2xlLmRhdGFzZXQuZGF5b2Z3ZWVrID0gZGF5b2Z3ZWVrO1xuICAgICAgICAgIHBlZ2hvbGUuZGF0YXNldC5kYXlpbmRleCA9IHVuaXF1ZURheUluZGV4O1xuICAgICAgICAgIHBlZ2hvbGUuY2xhc3NMaXN0LmFkZCgnd2lkdGhTaGFwZScsICdkYXlUaW1lJyk7XG4gICAgICAgICAgcGVnaG9sZS5kYXRhc2V0Lmh1bWFuZGF0ZSA9IGh1bWFuRGF0ZShgJHt5ZWFyQ2FsY30tJHttb250aENhbGN9LSR7Y291bnR9YCk7XG4gICAgICAgICAgLy8gcGVnaG9sZS5pZCA9IGAke3llYXJDYWxjfS0ke21vbnRoQ2FsY30tJHtjb3VudH1gO1xuICAgICAgICAgIHBlZ2hvbGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgICAgICAgZGF0ZU9uQ2xpY2tFdmVudHMoZSk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICB3ZWVrUm93LmFwcGVuZENoaWxkKHBlZ2hvbGUpO1xuXG4gICAgICAgICAgaWYgKGkgPT09IDAgJiYgcCA+PSBzdGFydERheU9mTW9udGggJiYgcCA8IChuZXcgRGF0ZSgpLmdldERhdGUoKSArIHN0YXJ0RGF5T2ZNb250aCkpIHtcbiAgICAgICAgICAgIHBlZ2hvbGUuY2xhc3NMaXN0LmFkZCgnZmlsbGVyJyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY291bnQrKztcbiAgICAgICAgICBkYXlvZndlZWsrKztcbiAgICAgICAgICB1bmlxdWVEYXlJbmRleCsrO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHAgPj0gZGF5c0luTW9udGggKyBzdGFydERheU9mTW9udGgpIHtcbiAgICAgICAgICBjb25zdCBwZWdob2xlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgcGVnaG9sZS5jbGFzc0xpc3QuYWRkKCd3aWR0aFNoYXBlJywgJ2ZpbGxlcicpO1xuICAgICAgICAgIHdlZWtSb3cuYXBwZW5kQ2hpbGQocGVnaG9sZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoKHAgKyAxKSAlIDcgPT09IDApIHtcbiAgICAgICAgICBtYWtlTmV3V2Vla1JvdygpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoaSA9PT0gbnVtYmVyT2ZNb250aHNUb0Rpc3BsYXkgLSAxKSB7XG4gICAgICAgIHByZWxvYWREYXRlcyhjYWxlbmRhciwgcHJlbG9hZGVkRGF0ZXMpO1xuICAgICAgICBibG9ja0RheXNOb3RPcGVuKGNhbGVuZGFyLCBkYXRlc09wZW4pO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBsZXQgY2xpY2tDb3VudCA9IDE7XG5cbiAgZnVuY3Rpb24gZGF0ZU9uQ2xpY2tFdmVudHMgKGUpIHtcbiAgICBjb25zdCBkYXRlRGl2ID0gZS50YXJnZXQ7XG4gICAgY2xpY2tDb3VudCsrO1xuXG4gICAgaWYgKGR5bmFtaWNEYXRhLmRpc2FibGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGRhdGVEaXYuY2xhc3NMaXN0LmNvbnRhaW5zKCdibG9ja2VkJykpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoY2FsZW5kYXIucXVlcnlTZWxlY3RvcignLm1ha2VUaW1lUnVsZUdsb2JhbCcpKSB7XG4gICAgICBjYWxlbmRhci5xdWVyeVNlbGVjdG9yKCcubWFrZVRpbWVSdWxlR2xvYmFsQ2xhc3MnKS50ZXh0Q29udGVudCA9IGZvcm1hdERheVRleHQoKTtcbiAgICB9XG5cbiAgICBpZiAoY29uZmlnLnNlbGVjdFJhbmdlKSB7XG4gICAgICBpZiAoY2xpY2tDb3VudCAlIDIgPT09IDApIHtcbiAgICAgICAgaWYgKGNvbmZpZy5zZWxlY3RNdWx0aXBsZSkge1xuICAgICAgICAgIGNsZWFyU2VsZWN0aW9uKGNhbGVuZGFyLCBkeW5hbWljRGF0YSk7XG4gICAgICAgIH1cbiAgICAgICAgYm9va0RhdGVzKFtkYXRlRGl2XSk7XG4gICAgICB9XG4gICAgICBpZiAoY2xpY2tDb3VudCAlIDIgPT09IDEpIHtcbiAgICAgICAgYm9va0RhdGVzKFtkYXRlRGl2XSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGNvbmZpZy5zaW5nbGVEYXRlQ2hvaWNlKSB7XG4gICAgICBjbGVhclNlbGVjdGlvbihjYWxlbmRhciwgZHluYW1pY0RhdGEpO1xuICAgICAgYm9va0RhdGVzKFtkYXRlRGl2XSk7XG4gICAgfVxuICAgIC8qXG4gICAgaWYgKCFkYXRlc0luZGV4LmluY2x1ZGVzKGRhdGVEaXYuZGF0YXNldC5odW1hbmRhdGUpKSB7XG4gICAgICBjb25zdCBtYWtlVGltZVJ1bGVHbG9iYWwgPSBjYWxlbmRhci5xdWVyeVNlbGVjdG9yKCcudGltZUNob29zZXInKT8ucXVlcnlTZWxlY3RvcignLm1ha2VUaW1lUnVsZUdsb2JhbCcpO1xuICAgICAgaWYgKG1ha2VUaW1lUnVsZUdsb2JhbD8uY2hlY2tlZCA9PT0gdHJ1ZSkge1xuICAgICAgICBib29rRGF5T2ZXZWVrRyhkYXRlLCBudWxsKTtcbiAgICAgIH1cbiAgICB9XG4gICAgKi9cbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IHNlbGVjdGlvbiBpbiB0aGUgZHluYW1pY0RhdGEgb2JqZWN0LlxuICAgKlxuICAgKiBAcmV0dXJuIHtvYmplY3R9IEFuIG9iamVjdCBjb250YWluaW5nIHRoZSB0cmFja2luZyBhcnJheSBcIm5ld0FycmF5XCIgYW5kIG9iamVjdHMgYXJyYXkuXG4gICAqL1xuICBmdW5jdGlvbiBjcmVhdGVOZXdTZWxlY3Rpb24gKCkge1xuICAgIGNvbnN0IHBhcmVudEFyID0gZHluYW1pY0RhdGEuZGF0ZXNTZWxlY3RlZEFycmF5O1xuICAgIGNvbnN0IHBhcmVudEFyT2JqID0gZHluYW1pY0RhdGEuZGF0ZXNTZWxlY3RlZEFycmF5T2JqZWN0cztcbiAgICBsZXQgbmV3QXJyYXksIG5ld09iamVjdHNBcnJheTtcblxuICAgIG5ld0FycmF5ID0gcGFyZW50QXJbcGFyZW50QXIubGVuZ3RoIC0gMV07XG4gICAgaWYgKGNvbmZpZy5zZWxlY3RSYW5nZSAmJiBuZXdBcnJheSAmJiBuZXdBcnJheS5sZW5ndGggPT09IDEpIHtcbiAgICAgIG5ld09iamVjdHNBcnJheSA9IHBhcmVudEFyT2JqW3BhcmVudEFyT2JqLmxlbmd0aCAtIDFdO1xuICAgICAgcmV0dXJuIHsgbmV3QXJyYXksIG5ld09iamVjdHNBcnJheSB9O1xuICAgIH1cblxuICAgIG5ld0FycmF5ID0gW107XG4gICAgbmV3T2JqZWN0c0FycmF5ID0gW107XG4gICAgcGFyZW50QXIucHVzaChuZXdBcnJheSk7XG4gICAgcGFyZW50QXJPYmoucHVzaChuZXdPYmplY3RzQXJyYXkpO1xuICAgIHJldHVybiB7IG5ld0FycmF5LCBuZXdPYmplY3RzQXJyYXkgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSYW5nZSBzZWxlY3RcbiAgICogQGRlc2NyaXB0aW9uIEFsbG93cyBhIHJhbmdlIG9mIGRhdGVzIHRvIGJlIHNlbGVjdGVkXG4gICAqIEBmdW5jdGlvbiBib29rRGF0ZXNcbiAgICogQHBhcmFtIGRhdGVzIGFycmF5XG4gICAqIEB0b2RvIGFsbG93IHJhbmdlIHNlbGVjdCB0byB3b3JrIHdpdGggdGltZSB2YWx1ZXMuXG4gICAqIEBmaXJlcyBib29rRGF5IGZvciBlYWNoIGRheSBpbiBhIHJhbmdlXG4gICAqL1xuICBmdW5jdGlvbiBib29rRGF0ZXMgKGFycmF5T2ZEYXRlRGl2cykge1xuICAgIGNvbnN0IHsgbmV3QXJyYXksIG5ld09iamVjdHNBcnJheSB9ID0gY3JlYXRlTmV3U2VsZWN0aW9uKCk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnJheU9mRGF0ZURpdnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGRhdGVEaXYgPSBhcnJheU9mRGF0ZURpdnNbaV07XG4gICAgICBib29rRGF5KGRhdGVEaXYpO1xuICAgIH1cblxuICAgIGNvbnN0IHN0YXJ0RGF0ZSA9IG5ld09iamVjdHNBcnJheVswXTtcbiAgICBjb25zdCBzdGFydEluZGV4ID0gc3RhcnREYXRlLmluZGV4O1xuICAgIC8vIGlmIGEgc2luZ2xlIGRhdGUgaXMgc2VsZWN0ZWQ6XG4gICAgY29uc3QgZW5kRGF0ZSA9IG5ld09iamVjdHNBcnJheVsxXSB8fCBzdGFydERhdGU7XG4gICAgY29uc3QgZW5kSW5kZXggPSBlbmREYXRlLmluZGV4O1xuXG4gICAgaWYgKGNvbmZpZy5zZWxlY3RSYW5nZSkge1xuICAgICAgY29uc3QgW2xvdywgaGlnaF0gPSBbcGFyc2VJbnQoc3RhcnRJbmRleCksIHBhcnNlSW50KGVuZEluZGV4KV0uc29ydCgoYSwgYikgPT4gYSAtIGIpO1xuICAgICAgZm9yIChsZXQgaSA9IGxvdzsgaSA8PSBoaWdoOyBpKyspIHtcbiAgICAgICAgY29uc3QgZGF0ZURpdiA9IGNhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLWRheWluZGV4PScke2l9J11gKTtcbiAgICAgICAgaWYgKGRhdGVEaXYuY2xhc3NMaXN0LmNvbnRhaW5zKCdibG9ja2VkJykpIHtcbiAgICAgICAgICB1bnNlbGVjdGVkU3R5bGUoY2FsZW5kYXIucXVlcnlTZWxlY3RvcihgW2lkPScke2VuZERhdGV9J11gKSk7XG4gICAgICAgICAgbmV3QXJyYXkuc3BsaWNlKDEsIDEpO1xuICAgICAgICAgIG5ld09iamVjdHNBcnJheS5zcGxpY2UoMSwgMSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgYm9va0RheShkYXRlRGl2KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBib29rRGF5IChkYXRlRGl2KSB7XG4gICAgICBpZiAoY29uZmlnLnNpbmdsZURhdGVDaG9pY2UgJiYgbmV3QXJyYXkubGVuZ3RoID4gMCkge1xuICAgICAgICBjbGVhclNlbGVjdGlvbihjYWxlbmRhciwgZHluYW1pY0RhdGEpO1xuICAgICAgfVxuICAgICAgaWYgKG5ld0FycmF5LmluY2x1ZGVzKGRhdGVEaXYuZGF0YXNldC5odW1hbmRhdGUpID09PSBmYWxzZSkge1xuICAgICAgICBzZWxlY3RlZFN0eWxlKGRhdGVEaXYpO1xuICAgICAgICBuZXdBcnJheS5wdXNoKGRhdGVEaXYuZGF0YXNldC5odW1hbmRhdGUpO1xuICAgICAgICBuZXdPYmplY3RzQXJyYXlbbmV3QXJyYXkubGVuZ3RoIC0gMV0gPSBzdGFuZGFyZERhdGVPYmplY3QoZGF0ZURpdik7XG4gICAgICB9XG4gICAgICAvLyB0aW1lIHBpY2tlciBmb3IgbXVsdGlwbGUgY29uc2VjdXRpdmUgZGF0ZXMuXG4gICAgICBpZiAoY29uZmlnLmRpc3BsYXlUaW1lQ2hvb3Nlck1vZGFsICYmIHN0YXJ0RGF0ZSAhPT0gZW5kRGF0ZSkge1xuICAgICAgICBkaXNwbGF5VGltZUNob29zZXJNb2RhbChjYWxlbmRhciwgY29uZmlnLCBkeW5hbWljRGF0YSk7XG4gICAgICB9XG4gICAgICAvLyB0aW1lIHBpY2tlciBmbyBzaW5nbGUgZGF0ZTpcbiAgICAgIGlmIChjb25maWcuZGlzcGxheVRpbWVDaG9vc2VyTW9kYWwgJiYgY29uZmlnLnNpbmdsZURhdGVDaG9pY2UpIHtcbiAgICAgICAgZGlzcGxheVRpbWVDaG9vc2VyTW9kYWwoY2FsZW5kYXIsIGNvbmZpZywgZHluYW1pY0RhdGEpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgc3RhbmRhcmQgZGF0ZSBvYmplY3Qgd2l0aCB0aGUgZ2l2ZW4gZGF0ZS5cbiAgICpcbiAgICogQHBhcmFtIHthbnl9IGRhdGUgLSBJcyBhIHN0cmluZyBZWVlZLU1NLUREIG1vbnRocyBhcmUgY291bnRlZCBmcm9tIDAuXG4gICAqIEByZXR1cm4ge29iamVjdH0gVGhlIHN0YW5kYXJkIGRhdGUgb2JqZWN0IHdpdGggdGhlIGdpdmVuIGRhdGUuXG4gICAqL1xuICBmdW5jdGlvbiBzdGFuZGFyZERhdGVPYmplY3QgKGRhdGUpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZGF5OiBkYXRlLmRhdGFzZXQuZGF5LFxuICAgICAgaHVtYW5kYXRlOiBkYXRlLmRhdGFzZXQuaHVtYW5kYXRlLFxuICAgICAgaW5kZXg6IGRhdGUuZGF0YXNldC5kYXlpbmRleCxcbiAgICAgIHRpbWVzOiBnZXRTZWxlY3RlZFRpbWVzKClcbiAgICB9O1xuICB9XG59XG5cbmV4cG9ydCB7IFN3aWZ0Q2FsIH07XG4iLCJpbXBvcnQgeyBsYW5ndWFnZXMgfSBmcm9tICcuL2xhbmd1YWdlcy5qcyc7XG5cbmxldCB0aW1lQ2hvb3Nlck1vZGFsLCBjYWxlbmRhciwgY29uZmlnLCBkeW5hbWljRGF0YTtcbmxldCBzZWxlY3Rpb24gPSBbXTtcblxuLyoqXG4gKiBDcmVhdGVzIGRpYWxvZyBmb3Igc2VsZWN0aW5nIHNwZWNpZmljIHRpbWVzXG4gKiBAZnVuY3Rpb24gY3JlYXRlVGltZUVsZW1lbnRzXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBjYWxlbmRhciAtIFRoZSBjYWxlbmRhciBlbGVtZW50XG4gKiBAcmV0dXJucyB7cHJvbWlzZX0gLSBFbXB0eSBwcm9taXNlLiBUaGUgYWN0dWFsIGRpdiBpcyBpbiB0aGlzIGNvZGUgb24gXCJ0aW1lQ2hvb3Nlck1vZGFsXCJcbiAqL1xuXG5mdW5jdGlvbiBnZW5lcmF0ZVRpbWVDaG9vc2VyTW9kYWwgKCkge1xuICBjb25zdCBwcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGlmICh0aW1lQ2hvb3Nlck1vZGFsKSB7XG4gICAgICByZXNvbHZlKHRpbWVDaG9vc2VyTW9kYWwpO1xuICAgIH1cblxuICAgIHRpbWVDaG9vc2VyTW9kYWwgPSBjcmVhdGVNb2RhbCgndGltZUNob29zZXJNb2RhbCcpO1xuICAgIGNhbGVuZGFyLmFwcGVuZENoaWxkKHRpbWVDaG9vc2VyTW9kYWwpO1xuXG4gICAgY29uc3QgdGltZUNvbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB0aW1lQ29udC5jbGFzc0xpc3QuYWRkKCd0aW1lQ29udCcpO1xuICAgIHRpbWVDaG9vc2VyTW9kYWwuYXBwZW5kQ2hpbGQodGltZUNvbnQpO1xuXG4gICAgY29uc3QgdGltZUNob29zZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB0aW1lQ2hvb3Nlci5jbGFzc0xpc3QuYWRkKCd0aW1lQ2hvb3NlcicpO1xuICAgIHRpbWVDb250LmFwcGVuZENoaWxkKHRpbWVDaG9vc2VyKTtcblxuICAgIC8vIG1ha2VCdXR0b24oZGVsZXRlRGl2LCAncmVtb3ZlVGltZScsICctJywgJ3JlbW92ZSBsYXN0IHRpbWUnLCByZW1vdmVUaW1lKTtcbiAgICAvLyBtYWtlQnV0dG9uKGRlbGV0ZURpdiwgJ2FkZFRpbWUnLCAnKycsICdhZGQgYSB0aW1lJywgJ2NsaWNrJywgdGltZVBpY2tlckVsZW1lbnRzKTtcbiAgICAvLyBtYWtlQnV0dG9uKGRlbGV0ZURpdiwgJ3JlbW92ZVRpbWUnLCAnLScsICdyZW1vdmUgbGFzdCB0aW1lJywgJ2NsaWNrJyk7XG4gICAgY29uc3QgY29udHJvbHNEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBjb250cm9sc0Rpdi5jbGFzc0xpc3QuYWRkKCdkZWxldGVEaXYnKTtcbiAgICB0aW1lQ2hvb3Nlci5hcHBlbmRDaGlsZChjb250cm9sc0Rpdik7XG5cbiAgICBmdW5jdGlvbiBjbG9zZUZuICgpIHtcbiAgICAgIHRpbWVDaG9vc2VyTW9kYWwuY2xvc2UoKTtcbiAgICB9XG4gICAgbWFrZUJ1dHRvbihjb250cm9sc0RpdiwgJ2RlbGV0ZUJ1dHRvbicsICd4JywgJ2Nsb3NlJywgJ2NsaWNrJywgY2xvc2VGbik7XG5cbiAgICBmdW5jdGlvbiBpbm5lckNvbXBvbmVudHMgKCkge1xuICAgICAgLy8gSWYgdGhlIGN1cnJlbnQgZWxlbWVudHMgYXJlbid0IGZpbGxlZDpcbiAgICAgIC8qXG4gICAgICBpZiAoY2FsZW5kYXIucXVlcnlTZWxlY3RvckFsbCgnLnRpbWVQaWNrZXJDb250YWluZXInKS5sZW5ndGggKiAyICE9PSB0aW1lcy52YWx1ZXMubGVuZ3RoKSB7XG4gICAgICAgIGlmIChzd2lmdG1vQWxlcnQpIHtcbiAgICAgICAgICBzd2lmdG1vQWxlcnQuc2V0Q29udGVudCgnRmlsbCBpbiB0aGUgY3VycmVudCB0aW1lIHZhbHVlcyBiZWZvcmUgYWRkaW5nIGFub3RoZXIuJykudG9nZ2xlKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYWxlcnQoJ0ZpbGwgaW4gdGhlIGN1cnJlbnQgdGltZSB2YWx1ZXMgYmVmb3JlIGFkZGluZyBhbm90aGVyLicpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgICovXG4gICAgICBjb25zdCB0aW1lUGlja2VyQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICB0aW1lUGlja2VyQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ3RpbWVQaWNrZXJDb250YWluZXInKTtcbiAgICAgIHRpbWVDaG9vc2VyLmFwcGVuZENoaWxkKHRpbWVQaWNrZXJDb250YWluZXIpO1xuICAgICAgY29uc3QgdGl0bGVEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIHRpdGxlRGl2LnRleHRDb250ZW50ID0gbGFuZ3VhZ2VzW2NvbmZpZy5sYW5ndWFnZV0udGltZVdpZGdldC5hZGRUaW1lO1xuICAgICAgdGl0bGVEaXYuY2xhc3NMaXN0LmFkZCgnZGVsZXRlRGl2Jyk7XG4gICAgICB0aW1lUGlja2VyQ29udGFpbmVyLmFwcGVuZENoaWxkKHRpdGxlRGl2KTtcbiAgICAgIG1ha2VEcm9wRG93bnMobGFuZ3VhZ2VzW2NvbmZpZy5sYW5ndWFnZV0udGltZVdpZGdldC5zdGFydCwgdGltZVBpY2tlckNvbnRhaW5lcik7XG4gICAgICBtYWtlRHJvcERvd25zKGxhbmd1YWdlc1tjb25maWcubGFuZ3VhZ2VdLnRpbWVXaWRnZXQuZW5kLCB0aW1lUGlja2VyQ29udGFpbmVyKTtcbiAgICAgIC8vIHRpY2tib3hlcyh0aW1lUGlja2VyQ29udGFpbmVyKTtcbiAgICB9XG4gICAgbWFrZUJ1dHRvbihjb250cm9sc0RpdiwgJ2RlbGV0ZUJ1dHRvbicsICcrJywgJ2FkZCB0aW1lJywgJ2NsaWNrJywgaW5uZXJDb21wb25lbnRzKTtcbiAgICBtYWtlQnV0dG9uKGNvbnRyb2xzRGl2LCAnZGVsZXRlQnV0dG9uJywgJy0nLCAncmVtb3ZlIHRpbWUnLCAnY2xpY2snLCByZW1vdmVUaW1lVmFsdWVzT25EYXRlKTtcbiAgICByZXNvbHZlKHRpbWVDaG9vc2VyTW9kYWwpO1xuICB9KTtcbiAgcmV0dXJuIHByb21pc2U7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZU1vZGFsIChjbGFzc05hbWUpIHtcbiAgY29uc3QgbW9kYWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaWFsb2cnKTtcbiAgbW9kYWwuY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpO1xuICByZXR1cm4gbW9kYWw7XG59XG5cbmZ1bmN0aW9uIG1ha2VCdXR0b24gKHBhcmVudCwgY2xhc3NOYW1lLCB0ZXh0Q29udGVudCwgaG92ZXJUZXh0LCBhY3Rpb24sIGZuKSB7XG4gIGNvbnN0IGJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICBidXR0b24uY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpO1xuICBidXR0b24udGV4dENvbnRlbnQgPSB0ZXh0Q29udGVudDtcbiAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoYWN0aW9uLCAoZSkgPT4ge1xuICAgIGZuKCk7XG4gIH0pO1xuICBwYXJlbnQuYXBwZW5kQ2hpbGQoYnV0dG9uKTtcbn1cblxuZnVuY3Rpb24gbWFrZURyb3BEb3ducyAoY29udGV4dFRleHQsIHRpbWVQaWNrZXJDb250YWluZXIpIHtcbiAgLy8gVGhlIHRpbWUgY29udGFpbmVyXG4gIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBjb250YWluZXIuY2xhc3NMaXN0LmFkZCgndGltZUNvbnRhaW5lcicpO1xuICBjb250YWluZXIuZGF0YXNldC5jb250ZXh0ID0gY29udGV4dFRleHQ7XG4gIHRpbWVQaWNrZXJDb250YWluZXIuYXBwZW5kQ2hpbGQoY29udGFpbmVyKTtcblxuICAvLyBUaGUgc3RvcmFnZSBvYmplY3RcbiAgLy8gc2VsZWN0aW9uLnB1c2goW10pO1xuXG4gIC8vIHRpbWVPYmogPSAgW1tdXVxuICAvLyBjb25zdCB0aW1lc09iaiA9IHNlbGVjdGlvbltzZWxlY3Rpb24ubGVuZ3RoIC0gMV07XG5cbiAgY29uc3QgdGltZUZvckNvbnRleHQgPSB7IFtjb250ZXh0VGV4dF06IHt9IH07XG5cbiAgLy8gdGltZXNPYmoucHVzaCh0aW1lRm9yQ29udGV4dCk7XG4gIHNlbGVjdGlvbi5wdXNoKHRpbWVGb3JDb250ZXh0KTtcblxuICAvLyBNYWtlIGxhYmVsXG4gIGNvbnN0IGxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICBsYWJlbC5jbGFzc0xpc3QuYWRkKCd0aW1lU2VsZWN0UCcpO1xuICBsYWJlbC50ZXh0Q29udGVudCA9IGAke2NvbnRleHRUZXh0fTpgO1xuICBjb250YWluZXIuYXBwZW5kQ2hpbGQobGFiZWwpO1xuXG4gIC8vIE1ha2UgaG91ciBzZWxlY3RvclxuICBjb25zdCB0aW1lU2VsZWN0b3JEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgdGltZVNlbGVjdG9yRGl2LmRhdGFzZXQuY29udGV4dCA9IGNvbnRleHRUZXh0O1xuICBjb250YWluZXIuYXBwZW5kQ2hpbGQodGltZVNlbGVjdG9yRGl2KTtcblxuICBtYWtlU2VsZWN0b3IoJ2hoJywgMjMsIHRpbWVTZWxlY3RvckRpdiwgY29udGV4dFRleHQsIHRpbWVQaWNrZXJDb250YWluZXIsIHRpbWVGb3JDb250ZXh0KTtcbiAgbWFrZVNlbGVjdG9yKCdtbScsIDU5LCB0aW1lU2VsZWN0b3JEaXYsIGNvbnRleHRUZXh0LCB0aW1lUGlja2VyQ29udGFpbmVyLCB0aW1lRm9yQ29udGV4dCk7XG59XG5cbmZ1bmN0aW9uIG1ha2VTZWxlY3RvciAodHlwZSwgbGltaXQsIHRpbWVTZWxlY3RvckRpdiwgY29udGV4dFRleHQsIHRpbWVQaWNrZXJDb250YWluZXIsIHRpbWVGb3JDb250ZXh0KSB7XG4gIGNvbnN0IGRyb3BEb3duID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2VsZWN0Jyk7XG4gIGRyb3BEb3duLmNsYXNzTGlzdC5hZGQodHlwZSwgJ3RpbWVTZWxlY3QnKTtcbiAgdGltZVNlbGVjdG9yRGl2LmFwcGVuZENoaWxkKGRyb3BEb3duKTtcblxuICBkcm9wRG93bi5kYXRhc2V0LnR5cGUgPSB0eXBlO1xuICBkcm9wRG93bi5kYXRhc2V0LmNvbnRleHQgPSBjb250ZXh0VGV4dDtcblxuICBjb25zdCBwbGFjZWhvbGRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuICBwbGFjZWhvbGRlci50ZXh0Q29udGVudCA9IHR5cGU7XG4gIHBsYWNlaG9sZGVyLnZhbHVlID0gJzAwJztcblxuICAvLyB7XCJTdGFydFwiOntcImhoXCI6XCIwMFwifX0se1wiU3RhcnRcIjp7XCJtbVwiOlwiMDBcIn19XG4gIHRpbWVGb3JDb250ZXh0W2NvbnRleHRUZXh0XVt0eXBlXSA9IHBsYWNlaG9sZGVyLnZhbHVlO1xuICAvLyB7W3R5cGVdOiBwbGFjZWhvbGRlci52YWx1ZX1cbiAgZHJvcERvd24uYXBwZW5kQ2hpbGQocGxhY2Vob2xkZXIpO1xuXG4gIGxldCBpID0gMDtcbiAgd2hpbGUgKGkgPD0gbGltaXQpIHtcbiAgICBjb25zdCBob3VyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XG4gICAgbGV0IHRleHQgPSBpLnRvU3RyaW5nKCk7XG4gICAgaWYgKHRleHQubGVuZ3RoID09PSAxKSB7XG4gICAgICB0ZXh0ID0gYDAke2l9YDtcbiAgICB9XG4gICAgaG91ci52YWx1ZSA9IHRleHQ7XG4gICAgaG91ci50ZXh0Q29udGVudCA9IHRleHQ7XG4gICAgZHJvcERvd24uYXBwZW5kQ2hpbGQoaG91cik7XG4gICAgaSsrO1xuICB9XG5cbiAgZHJvcERvd24uYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKHNlbGVjdGVkKSA9PiB7XG4gICAgdGltZUZvckNvbnRleHRbY29udGV4dFRleHRdW3R5cGVdID0gZHJvcERvd24udmFsdWU7XG4gICAgd3JpdGVUb0RhdGVEaXYoKTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHJlbW92ZVRpbWVWYWx1ZXNPbkRhdGUgKCkge1xuICBjb25zdCBkID0gZHluYW1pY0RhdGEuZGF0ZXNTZWxlY3RlZEFycmF5T2JqZWN0cztcbiAgY29uc3QgbGFzdENob2ljZSA9IGRbZC5sZW5ndGggLSAxXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsYXN0Q2hvaWNlLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgZGF0ZU9iaiA9IGxhc3RDaG9pY2VbaV07XG4gICAgY29uc3QgZGF5RGl2ID0gY2FsZW5kYXIucXVlcnlTZWxlY3RvcihgW2RhdGEtaHVtYW5kYXRlPScke2RhdGVPYmouaHVtYW5kYXRlfSddYCk7XG4gICAgZGF5RGl2LnJlbW92ZUNoaWxkKGRheURpdi5sYXN0Q2hpbGQpO1xuICAgIGRhdGVPYmoudGltZXMgPSBkYXRlT2JqLnRpbWVzLnNsaWNlKDAsIC0yKTtcbiAgfVxuICBzZWxlY3Rpb24gPSBzZWxlY3Rpb24uc2xpY2UoMCwgLTIpO1xuICBjb25zdCB0aW1lQ2hvb3NlciA9IGNhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoJy50aW1lQ2hvb3NlcicpO1xuICB0aW1lQ2hvb3Nlci5yZW1vdmVDaGlsZCh0aW1lQ2hvb3Nlci5sYXN0Q2hpbGQpO1xufVxuXG5mdW5jdGlvbiB3cml0ZVRvRGF0ZURpdiAoKSB7XG4gIGlmIChjb25maWcuZGlzcGxheVRpbWVTZWxlY3Rpb25PbkRhdGUpIHtcbiAgICBkeW5hbWljRGF0YS5kYXRlc1NlbGVjdGVkQXJyYXkuZm9yRWFjaCgoY2hpbGRBcnJheSkgPT4ge1xuICAgICAgY2hpbGRBcnJheS5mb3JFYWNoKChkYXlTZWxlY3RlZCkgPT4ge1xuICAgICAgICB3cml0ZShkYXlTZWxlY3RlZCk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIC8vIGNvbnRhaW5zIGEgdGltZSBkdXJhdGlvbiBjaG9pY2VcbiAgICBsZXQgY2FsZW5kYXJUaW1lUGFyZW50O1xuXG4gICAgZnVuY3Rpb24gd3JpdGUgKGRhdGUpIHtcbiAgICAgIGNvbnN0IGRheURpdiA9IGNhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLWh1bWFuZGF0ZT0nJHtkYXRlfSddYCk7XG4gICAgICB3aGlsZSAoZGF5RGl2LmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICAgICAgZGF5RGl2LnJlbW92ZUNoaWxkKGRheURpdi5sYXN0Q2hpbGQpO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBjcmVhdGVOZXdQYXJhICh0ZXh0KSB7XG4gICAgICAgIGNvbnN0IHRpbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgICAgIGNhbGVuZGFyVGltZVBhcmVudC5hcHBlbmRDaGlsZCh0aW1lKTtcbiAgICAgICAgdGltZS5jbGFzc0xpc3QuYWRkKCdjYWxlbmRhclRpbWUnKTtcbiAgICAgICAgdGltZS50ZXh0Q29udGVudCA9IHRleHQ7XG4gICAgICB9XG5cbiAgICAgIHNlbGVjdGlvbi5mb3JFYWNoKCh0aW1lVmFsdWUsIGkpID0+IHtcbiAgICAgICAgaWYgKGkgPT09IDAgfHwgaSAlIDIgPT09IDApIHtcbiAgICAgICAgICBjYWxlbmRhclRpbWVQYXJlbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICBjYWxlbmRhclRpbWVQYXJlbnQuY2xhc3NMaXN0LmFkZCgnY2FsZW5kYXJUaW1lUGFyZW50Jyk7XG4gICAgICAgICAgZGF5RGl2LmFwcGVuZENoaWxkKGNhbGVuZGFyVGltZVBhcmVudCk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBmaWVsZE5hbWUgPSBPYmplY3Qua2V5cyh0aW1lVmFsdWUpWzBdO1xuICAgICAgICBjcmVhdGVOZXdQYXJhKGAke2ZpZWxkTmFtZX06YCk7XG4gICAgICAgIGNyZWF0ZU5ld1BhcmEoYCR7dGltZVZhbHVlW2ZpZWxkTmFtZV0uaGh9OiR7dGltZVZhbHVlW2ZpZWxkTmFtZV0ubW19YCk7XG4gICAgICAgIFxuICAgICAgICAvKlxuICAgICAgICBpZiAoZGF5SW5Qb2ludC5jbGFzc0xpc3QuY29udGFpbnMoJ2ZpbGxlcicpID09PSBmYWxzZSkge1xuICAgICAgICAgIGRheUluUG9pbnQuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJyNmYzMnO1xuICAgICAgICAgIGlmIChpICUgMiA9PT0gMSkge1xuICAgICAgICAgICAgdGltZS5zdHlsZS5ib3JkZXJCb3R0b21TdHlsZSA9ICdzb2xpZCc7XG4gICAgICAgICAgICBkYXlJblBvaW50LmFwcGVuZENoaWxkKHRpbWUpO1xuICAgICAgICAgICAgdGV4dGludGVybmFsID0gJyc7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRheUluUG9pbnQuYXBwZW5kQ2hpbGQodGltZSk7XG4gICAgICAgICAgICB0ZXh0aW50ZXJuYWwgPSAnJztcbiAgICAgICAgICB9XG4gICAgICAgIH0qL1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy9nZW5lcmF0ZVRpbWVWYWx1ZXNPbkRhdGUodGltZVZhbHVlcyk7XG4gIH1cbn1cbmZ1bmN0aW9uIGRpc3BsYXlUaW1lQ2hvb3Nlck1vZGFsIChjYWwsIGNvbmYsIGRhdGEpIHtcbiAgY2FsZW5kYXIgPSBjYWw7XG4gIGNvbmZpZyA9IGNvbmY7XG4gIGR5bmFtaWNEYXRhID0gZGF0YTtcbiAgaWYgKHRpbWVDaG9vc2VyTW9kYWwpIHtcbiAgICB0aW1lQ2hvb3Nlck1vZGFsLnNob3coKTtcbiAgfSBlbHNlIHtcbiAgICBnZW5lcmF0ZVRpbWVDaG9vc2VyTW9kYWwoKS50aGVuKChuZXdNb2RhbCkgPT4ge1xuICAgICAgdGltZUNob29zZXJNb2RhbCA9IG5ld01vZGFsO1xuICAgICAgdGltZUNob29zZXJNb2RhbC5zaG93KCk7XG4gICAgfSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0U2VsZWN0ZWRUaW1lcyAoKSB7XG4gIHJldHVybiBzZWxlY3Rpb247XG59XG5cbmV4cG9ydCB7IGRpc3BsYXlUaW1lQ2hvb3Nlck1vZGFsLCBnZXRTZWxlY3RlZFRpbWVzIH07XG4iLCIvKiBMYW5ndWFnZSBkZWZhdWx0cyAqL1xuY29uc3QgZW5HYiA9IHtcbiAgZ2VuZXJhbFRpbWU6IHtcbiAgICBtb250aHM6IFsnSmFudWFyeScsICdGZWJydWFyeScsICdNYXJjaCcsICdBcHJpbCcsICdNYXknLCAnSnVuZScsICdKdWx5JywgJ0F1Z3VzdCcsICdTZXB0ZW1iZXInLCAnT2N0b2JlcicsICdOb3ZlbWJlcicsICdEZWNlbWJlciddLFxuICAgIGRheXNJbkZ1bGw6IFsnU3VuZGF5JywgJ01vbmRheScsICdUdWVzZGF5JywgJ1dlZG5lc2RheScsICdUaHVyc2RheScsICdGcmlkYXknLCAnU2F0dXJkYXknXSxcbiAgICBkYXlzVHJ1bmNhdGVkOiBbJ1N1bicsICdNb24nLCAnVHVlJywgJ1dlZCcsICdUaHUnLCAnRnJpJywgJ1NhdCddXG4gIH0sXG4gIGZvcm1hdERheVRleHQ6IHtcbiAgICB0ZXh0QmVmb3JlOiAnU2V0IHRoZXNlIHRpbWVzIGZvciBhbGwnLFxuICAgIHRleHRBZnRlcjogJydcbiAgfSxcbiAgdGltZVdpZGdldDoge1xuICAgIGFkZFRpbWU6ICdBZGQgdGltZTonLFxuICAgIHN0YXJ0OiAnU3RhcnQnLFxuICAgIGVuZDogJ0VuZCdcbiAgfVxufTtcblxuLyogTGFuZ3VhZ2UgZGVmYXVsdHMgKi9cbmNvbnN0IHB0UHQgPSB7XG4gIGdlbmVyYWxUaW1lOiB7XG4gICAgbW9udGhzOiBbJ0phbmVpcm8nLCAnRmV2ZXJlaXJvJywgJ01hcsOnbycsICdBYnJpbCcsICdNYWlvJywgJ0p1bmhvJywgJ0p1bGhvJywgJ0Fnb3N0bycsICdTZXRlbWJybycsICdPdXR1YnJvJywgJ05vdmVtYnJvJywgJ0RlemVtYnJvJ10sXG4gICAgZGF5c0luRnVsbDogWydEb21pbmdvJywgJ1NlZ3VuZGEtRmVpcmEnLCAnVGVyw6dhLUZlaXJhJywgJ1F1YXJ0YS1GZWlyYScsICdRdWludGEtRmVpcmEnLCAnU2V4dGEtRmVpcmEnLCAnU8OhYmFkbyddLFxuICAgIGRheXNUcnVuY2F0ZWQ6IFsnRG9tJywgJ1NlZycsICdUZXInLCAnUXVhJywgJ1F1aScsICdTZXgnLCAnU2FiJ11cbiAgfSxcbiAgZm9ybWF0RGF5VGV4dDoge1xuICAgIHRleHRCZWZvcmU6ICdBcHBsaXF1ZSBlc3RhcyBob3JhcyBhIHRvZG9zJyxcbiAgICB0ZXh0QWZ0ZXI6ICcnXG4gIH0sXG4gIHRpbWVXaWRnZXQ6IHtcbiAgICBhZGRUaW1lOiAnQWRpY2lvbmUgZHVyYcOnw6NvOicsXG4gICAgc3RhcnQ6ICdJbsOtY2lvJyxcbiAgICBlbmQ6ICdGaW0nXG4gIH1cblxufTtcblxuY29uc3QgbGFuZ3VhZ2VzID0geyBlbkdiLCBwdFB0IH07XG5cbmV4cG9ydCB7IGxhbmd1YWdlcyB9O1xuIiwiY29uc3QgY29sb3VycyA9IHtcbiAgbW9udGhDb2xvcjogJyNmYzMnLFxuICBtb250aEJhY2tnb3VuZEJvbG9yOiAnIzY3OTljYicsXG4gIGRheU5hbWVDb2xvcjogJyMwMDAnLFxuICBkYXlOYW1lQmFja2dyb3VuZENvbG9yOiAnI2NjYycsXG4gIGRheUNvbG9yOiAnIzAwMCcsXG4gIGRheUJhY2tncm91bmRDb2xvcjogJyNmZmYnLFxuICBtb250aEJvcmRlckNvbG9yOiAnI2YxNTkyNSdcbn07XG5cbmNvbnN0IHNlbGVjdGVkU3R5bGUgPSAoZGl2KSA9PiB7XG4gIGRpdi5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBjb2xvdXJzLm1vbnRoQ29sb3I7XG59O1xuXG5jb25zdCB1bnNlbGVjdGVkU3R5bGUgPSAoZGl2KSA9PiB7XG4gIGRpdi5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBjb2xvdXJzLmRheUJhY2tncm91bmRDb2xvcjtcbn07XG5cbmV4cG9ydCB7IHNlbGVjdGVkU3R5bGUsIHVuc2VsZWN0ZWRTdHlsZSwgY29sb3VycyB9O1xuIiwiJ3VzZSBzdHJpY3QnO1xuLy8gRm9yIG1vcmUgaW5mb3JtYXRpb24gYWJvdXQgYnJvd3NlciBmaWVsZCwgY2hlY2sgb3V0IHRoZSBicm93c2VyIGZpZWxkIGF0IGh0dHBzOi8vZ2l0aHViLmNvbS9zdWJzdGFjay9icm93c2VyaWZ5LWhhbmRib29rI2Jyb3dzZXItZmllbGQuXG5cbnZhciBzdHlsZUVsZW1lbnRzSW5zZXJ0ZWRBdFRvcCA9IFtdO1xuXG52YXIgaW5zZXJ0U3R5bGVFbGVtZW50ID0gZnVuY3Rpb24oc3R5bGVFbGVtZW50LCBvcHRpb25zKSB7XG4gICAgdmFyIGhlYWQgPSBkb2N1bWVudC5oZWFkIHx8IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF07XG4gICAgdmFyIGxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wID0gc3R5bGVFbGVtZW50c0luc2VydGVkQXRUb3Bbc3R5bGVFbGVtZW50c0luc2VydGVkQXRUb3AubGVuZ3RoIC0gMV07XG5cbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICBvcHRpb25zLmluc2VydEF0ID0gb3B0aW9ucy5pbnNlcnRBdCB8fCAnYm90dG9tJztcblxuICAgIGlmIChvcHRpb25zLmluc2VydEF0ID09PSAndG9wJykge1xuICAgICAgICBpZiAoIWxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wKSB7XG4gICAgICAgICAgICBoZWFkLmluc2VydEJlZm9yZShzdHlsZUVsZW1lbnQsIGhlYWQuZmlyc3RDaGlsZCk7XG4gICAgICAgIH0gZWxzZSBpZiAobGFzdFN0eWxlRWxlbWVudEluc2VydGVkQXRUb3AubmV4dFNpYmxpbmcpIHtcbiAgICAgICAgICAgIGhlYWQuaW5zZXJ0QmVmb3JlKHN0eWxlRWxlbWVudCwgbGFzdFN0eWxlRWxlbWVudEluc2VydGVkQXRUb3AubmV4dFNpYmxpbmcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaGVhZC5hcHBlbmRDaGlsZChzdHlsZUVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgICAgIHN0eWxlRWxlbWVudHNJbnNlcnRlZEF0VG9wLnB1c2goc3R5bGVFbGVtZW50KTtcbiAgICB9IGVsc2UgaWYgKG9wdGlvbnMuaW5zZXJ0QXQgPT09ICdib3R0b20nKSB7XG4gICAgICAgIGhlYWQuYXBwZW5kQ2hpbGQoc3R5bGVFbGVtZW50KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgdmFsdWUgZm9yIHBhcmFtZXRlciBcXCdpbnNlcnRBdFxcJy4gTXVzdCBiZSBcXCd0b3BcXCcgb3IgXFwnYm90dG9tXFwnLicpO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIC8vIENyZWF0ZSBhIDxsaW5rPiB0YWcgd2l0aCBvcHRpb25hbCBkYXRhIGF0dHJpYnV0ZXNcbiAgICBjcmVhdGVMaW5rOiBmdW5jdGlvbihocmVmLCBhdHRyaWJ1dGVzKSB7XG4gICAgICAgIHZhciBoZWFkID0gZG9jdW1lbnQuaGVhZCB8fCBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdO1xuICAgICAgICB2YXIgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpbmsnKTtcblxuICAgICAgICBsaW5rLmhyZWYgPSBocmVmO1xuICAgICAgICBsaW5rLnJlbCA9ICdzdHlsZXNoZWV0JztcblxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gYXR0cmlidXRlcykge1xuICAgICAgICAgICAgaWYgKCAhIGF0dHJpYnV0ZXMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHZhbHVlID0gYXR0cmlidXRlc1trZXldO1xuICAgICAgICAgICAgbGluay5zZXRBdHRyaWJ1dGUoJ2RhdGEtJyArIGtleSwgdmFsdWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaGVhZC5hcHBlbmRDaGlsZChsaW5rKTtcbiAgICB9LFxuICAgIC8vIENyZWF0ZSBhIDxzdHlsZT4gdGFnIHdpdGggb3B0aW9uYWwgZGF0YSBhdHRyaWJ1dGVzXG4gICAgY3JlYXRlU3R5bGU6IGZ1bmN0aW9uKGNzc1RleHQsIGF0dHJpYnV0ZXMsIGV4dHJhT3B0aW9ucykge1xuICAgICAgICBleHRyYU9wdGlvbnMgPSBleHRyYU9wdGlvbnMgfHwge307XG5cbiAgICAgICAgdmFyIHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgICAgICAgc3R5bGUudHlwZSA9ICd0ZXh0L2Nzcyc7XG5cbiAgICAgICAgZm9yICh2YXIga2V5IGluIGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICAgIGlmICggISBhdHRyaWJ1dGVzLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IGF0dHJpYnV0ZXNba2V5XTtcbiAgICAgICAgICAgIHN0eWxlLnNldEF0dHJpYnV0ZSgnZGF0YS0nICsga2V5LCB2YWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc3R5bGUuc2hlZXQpIHsgLy8gZm9yIGpzZG9tIGFuZCBJRTkrXG4gICAgICAgICAgICBzdHlsZS5pbm5lckhUTUwgPSBjc3NUZXh0O1xuICAgICAgICAgICAgc3R5bGUuc2hlZXQuY3NzVGV4dCA9IGNzc1RleHQ7XG4gICAgICAgICAgICBpbnNlcnRTdHlsZUVsZW1lbnQoc3R5bGUsIHsgaW5zZXJ0QXQ6IGV4dHJhT3B0aW9ucy5pbnNlcnRBdCB9KTtcbiAgICAgICAgfSBlbHNlIGlmIChzdHlsZS5zdHlsZVNoZWV0KSB7IC8vIGZvciBJRTggYW5kIGJlbG93XG4gICAgICAgICAgICBpbnNlcnRTdHlsZUVsZW1lbnQoc3R5bGUsIHsgaW5zZXJ0QXQ6IGV4dHJhT3B0aW9ucy5pbnNlcnRBdCB9KTtcbiAgICAgICAgICAgIHN0eWxlLnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzc1RleHQ7XG4gICAgICAgIH0gZWxzZSB7IC8vIGZvciBDaHJvbWUsIEZpcmVmb3gsIGFuZCBTYWZhcmlcbiAgICAgICAgICAgIHN0eWxlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzc1RleHQpKTtcbiAgICAgICAgICAgIGluc2VydFN0eWxlRWxlbWVudChzdHlsZSwgeyBpbnNlcnRBdDogZXh0cmFPcHRpb25zLmluc2VydEF0IH0pO1xuICAgICAgICB9XG4gICAgfVxufTtcbiJdfQ==
