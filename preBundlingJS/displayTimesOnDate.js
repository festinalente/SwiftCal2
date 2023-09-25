
function generateTimeValuesOnDate (standardDateObject) {
  const inOrder = [];
  const meta = [];
  standardDateObject.times.forEach((time, i) => {
    console.log(Object.values(time));
    inOrder.push(time);
  });

  function timeValueInMill (time) {
    var br = time.split(':');
    return parseInt(br[0]) * 60 * 60 * 1000 + parseInt(br[1]) * 60 * 1000;
  }
  

  var textinternal = '';
  if (dayInPoint.children) {
    for (i = dayInPoint.children.length - 1; i >= 0; i--) {
      dayInPoint.children[i].remove();
    }
  }
  if (timeValues && timeValues.length > 0) {
    var ordered = sortTimes(timeValues);
    var index = datesSelectedArray.indexOf(dayInPoint.id);
    //Deep clone to remove original reference and create unique values:
    datesSelectedArrayObjects[index].times = JSON.parse(JSON.stringify(timeValues));
    //add time values to calendar
    ordered.forEach(function(e, i) {
      textinternal += e + ' ';
      var time = document.createElement('p');
      time.classList.add('calendarTime');
      time.style.marginBottom = '0px';
      time.textContent = textinternal;
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
      }
    });
  } else {
    return;
  }
}


function removeTimeValuesOnDate (dayInPoint) {
  if (!dayInPoint) {
    dayInPoint = document.getElementById(datesSelectedArrayObjects[datesSelectedArrayObjects.length - 1].day);
  } else {
    dayInPoint = document.getElementById(dayInPoint);
  }
  for (i = dayInPoint.children.length; i >= 0; i--) {
    if (dayInPoint.children[i]) {
      dayInPoint.children[i].remove();
    }
  }
}

function sortTimes (val) {
  const sorted = [];
  return enumerate(val);

  function sortNumber (a, b) {
    return a - b;
  }
  function enumerate (values) {
    const numericalEquivalent = [];
    for (let i = 0; i < values.length; i++) {
      numericalEquivalent.push(timeValueInMill(values[i]));
      if (i === values.length - 1) {
        return sort(values, numericalEquivalent);
      }
    }
  }

  function sort (values, numericalEquivalent) {
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

function timeValueInMill (time) {
  var br = time.split(':');
  return parseInt(br[0]) * 60 * 60 * 1000 + parseInt(br[1]) * 60 * 1000;
}

export { generateTimeValuesOnDate, removeTimeValuesOnDate };
