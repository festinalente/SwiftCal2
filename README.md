[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/tomasMetcalfe/swiftcal2)
# SwiftCal2
SwiftCal2 is a calendar, date picker and time picker for real world locations, i.e. times are context dependent (e.g. the location of a shop) rather than universal (e.g. via a timestamp). It allows multiple ranges and times to be selected and preselected.

<!--
```
<custom-element-demo>
  <template>
    <script defer src="https://cdn.jsdelivr.net/gh/festinalente/SwiftCal2/clientSideJS/calendar.js"></script>
  </template>
</custom-element-demo>
```
-->
```html
<h3>Webcomponents calendar with three months</h3>
<swift-cal data-number-of-months-to-display='3'></swift-cal>
<h3>A calendar render from js</h3>
<div class='eg'></div>
<script>
  new calendar.SwiftCal();
  cal.generateCalendar({ 
    parentDiv: '.eg', 
    numberOfMonthsToDisplay: 3,
    displayTimeChooserModal: false
  });
</script>
```
## A few more examples can be found here: 
https://codepen.io/tomasMetcalfe/pen/PoXRQKJ

## Some docs and explanations are her: 
https://festinalente.github.io/SwiftCal2/

## Contribute
To contibute simply git clone the repo, then on your machine run npm install, then cd (change directory) into the folder with SwiftCal2 and run grunt watch and start hacking away. The quickest way to then see changes is to copy examples.html in the root to another html file, and open that file in a browser. 
### Contributions wanted: 
Languages come to mind... I have added English (enGb) and Portuguese (ptPt), others are welcome. See
"languages.js in the folder "proBundlingJS"



