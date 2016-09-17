//lets start with some easy common ones
const tzAbbr = {
  'EST': -5, //the value is the hour offset from UTC
  'EDT': -4,
  'PST': -8,
  'PDT': -7,
}

class MyTime {

  constructor(tz = null) {
    this.date = new Date();
    this.day = this.date.getUTCDate();
    this.year = this.date.getUTCFullYear();
    this.month = this.date.getUTCMonth() + 1;
    this.hours = this.date.getUTCHours();
    this.minutes = this.date.getUTCMinutes();
    this.tz = tz;
    this.format = 24;
    this.local = {} //creating seperate time object for local time
  }

  getRelativeTimeHM() {
    return `${handleTimeMath24(this.hours, tzAbbr[this.tz])}:${this.minutes}`;
  }

  getTimeHM() {
    return `${this.hours}:${this.minutes}`;
  }

}

//adds the timezone offset to the current UTC hours and returns the new time
//uses 24 hour format
function handleTimeMath24(currentUTCHours, tzOffset) {
  if ((currentUTCHours + tzOffset) > 0) {
    return currentUTCHours + tzOffset;
  } else if ((currentUTCHours + tzOffset) < 0) {
    let offset = currentUTCHours + tzOffset;
    return 24 + offset;
  }
}

//adds the timezone offset to the current UTC hours and returns the new time
//uses 12 hour format
function handleTimeMath12(myTimeObj, tzOffset) {
  let localHour = handleTimeMath24(myTimeObj.hours, tzAbbr[myTimeObj.tz])
  console.log(localHour);
  if (localHour >= 0 && localHour < 12) {
    if (localHour === 0) {
      return `12:${myTimeObj.minutes} AM`;
    } else {
        return `${localHour}:${myTimeObj.minutes} AM`;
    }
  } else {
    let hour = Math.abs(localHour - 12);
    if (hour === 0) {
        return `12:${myTimeObj.minutes} PM`;
    } else {
      return `${hour}:${myTimeObj.minutes} PM`;
    }
  }

}

const time = new MyTime('EDT');
console.log(handleTimeMath12(time));
