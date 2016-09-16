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
  }

  getRelativeTimeHM() {
    return `${handleTimeMath(this.hours, tzAbbr[this.tz])}:${this.minutes}`;
  }

  getTimeHM() {
    return `${this.hours}:${this.minutes}`;
  }

}

//adds the timezone offset to the current UTC hours and returns the new time
function handleTimeMath(currentUTCHours, tzOffset) {
  if ((currentUTCHours + tzOffset) > 0) {
    return currentUTCHours + tzOffset;
  } else if ((currentUTCHours + tzOffset) < 0) {
    let offset = currentUTCHours + tzOffset;
    return 24 + offset;
  }
}

const time = new MyTime('EDT');
console.log(time.getTimeHM());
console.log(time.getRelativeTimeHM());
