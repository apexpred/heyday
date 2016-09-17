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
    this.hour = this.date.getUTCHours();
    this.minutes = this.date.getUTCMinutes()
    //creating seperate time object for local time
    this.local = {
      hour: null,
      minutes: this.minutes,
      tz: tz,
      format: 12,
      amOrPm: '',
    };
  }

  //initialize the local time
  init() {
    this.setLocalHour();
    return this;
  }

  getRelativeTimeHM() {
    return `${handleTimeMath24(this.hour, tzAbbr[this.tz])}:${this.minutes}`;
  }

  getTimeHM() {
    return `${this.hour}:${this.minutes}`;
  }

  setLocalHour() {
    if (this.local.format === 24) {
      this.local.hour = handleTimeMath24(this.hour, this.local.tz);
    } else if (this.local.format === 12) {
      let time = handleTimeMath12(this.hour, this.local.tz);
      this.local.hour = time.hour;
      this.local.amOrPm = time.amOrPm;
    } else {
      return new Error('Invalid time format(Either 24 or 12 hour format)');
    }
  }

}

//adds the timezone offset to the current UTC hours and returns the new time
//uses 24 hour format
function handleTimeMath24(currentUTCHour, tz) {
  if ((currentUTCHour + tzAbbr[tz]) > 0) {
    return currentUTCHour + tzAbbr[tz];
  } else if ((currentUTCHour + tzAbbr[tz]) < 0) {
    let offset = currentUTCHour + tzAbbr[tz];
    return 24 + offset;
  }
}

//adds the timezone offset to the current UTC hours and returns the new time
//uses 12 hour format
function handleTimeMath12(currentUTCHour, tz) {
  let localHour = handleTimeMath24(currentUTCHour, tz)
  if (localHour >= 0 && localHour < 12) {
    if (localHour === 0) {
      return {hour: 12, amOrPm: 'AM'};
    } else {
        return {hour: localHour, amOrPm: 'AM'};
    }
  } else {
    localHour = Math.abs(localHour - 12);
    if (localHour === 0) {
        return {hour: 12, amOrPm: 'PM'};
    } else {
      return {hour: localHour, amOrPm: 'PM'};
    }
  }

}

const time = new MyTime('EDT');
//console.log(time);
time.init();
console.log(time);
