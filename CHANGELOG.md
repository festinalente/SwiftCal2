2023-10-19 Tomás Metcalfe <tomas@appyou.pro>

* calendarGenerator.js (preloadDates): Added a function that allows an array of preloaded dates to be added to the calendar (e.g. for availability on certain dates, of a certain bookable service). This function will in theory mean "end user" functionality doesn't have to be added, as it's implicit. 

* CHANGELOG.md: Added a change log. 

2023-10-25 Tomás Metcalfe <tomas@appyou.pro>

* fixed bug where when times chosen for multiple selections weren't displayed.
* corrected accidental text overflow on time text in date div. 
* remove console.logs
* values are deleted from div on deselect
* allow different times for different selections
* added ability to add ranges of length 1

2026-02-03 Tomás Metcalfe <tomas@appyou.pro>

* fixed bug in preselected date display (demo). 

2026-02-04 Tomás Metcalfe <tomas@appyou.pro>

* Improved event emission, debouncing events and returning a plain object with dates instead of a reference to the proxied data.
* Bubble boundary bug. 