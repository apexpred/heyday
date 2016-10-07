//currently only working with US timezones
const tzAbbr = {
  'EST': -5, //the value is the hour offset from UTC
  'EDT': -4,
  'PST': -8,
  'PDT': -7,
  'CST': -6,
  'CDT': -5,
  'MST': -7,
  'MDT': -6,
  'HST': -10,
  'AKST': -9,
  'AKDT': -8,
}

const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const Months = [
  'Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec',
];

class HeyDay {

  constructor(tz = null) {
    this.date = new Date();
    this.day = this.date.getUTCDate();
    this.year = this.date.getUTCFullYear();
    this.month = this.date.getUTCMonth();
    this.hour = this.date.getUTCHours();
    this.minutes = this.date.getUTCMinutes();
    //creating seperate time object for local time
    this.local = {
      format24: {
        hour: null,
        minutes: null,
        day: null,
        month: null,
        year: null,
        weekDay: null,
      },
      format12: {
        hour: null,
        amOrPm: '',
      },
      date: null,
      tz: tz,
      format: 24,
    };
  }

  //initialize the local time
  init() {
    if (this.local.tz === null) {
      return this
    }
    this.setLocalTime();
    return this;
  }

  setLocalTime() {
    this.local.date = new Date(this.date.valueOf() + (tzAbbr[this.local.tz] * 3600000)); //3600000 ms in an hour
    this.local.format24.day = this.local.date.getDate();
    this.local.format24.month = this.local.date.getUTCMonth();
    this.local.format24.year = this.local.date.getUTCFullYear();
    this.local.format24.hour = this.local.date.getUTCHours();
    this.local.format24.minutes = this.local.date.getUTCMinutes();
    this.local.format24.weekDay = weekdays[this.local.date.getUTCDay()];

    const format12 = handleTimeMath12(this.local.format24.hour, this.local.tz);
    this.local.format12.hour = format12.hour;
    this.local.format12.amOrPm = format12.amOrPm;
  }

  setTZ(tz) {
    if (tzAbbr[tz] === undefined) {
      throw new Error('Call to setTZ has invalid argument');
    } else if (tz === this.local.tz) {
      return this;
    }

    this.local.tz = tz;
    this.setLocalTime();
    return this;
  }

  setFormat(format) {
    if (format === this.local.format) {
      return this;
    } else if (format !== 24 && format !== 12) {
      throw new Error('Call to setFormat has invalid argument');
    }

    this.local.format = format;
    return this;
  }

  //returns the local time as a readable string
  now() {
    if (this.local.format === 24) {
      if (this.local.format24.minutes < 10) {
        return `${this.local.format24.hour}:0${this.local.format24.minutes} ${this.local.tz}`;
      }

      return `${this.local.format24.hour}:${this.local.format24.minutes} ${this.local.tz}`;
    }

    if (this.local.format24.minutes < 10) {
      return `${this.local.format12.hour}:0${this.local.format24.minutes} ${this.local.format12.amOrPm} ${this.local.tz}`;
    }
    return `${this.local.format12.hour}:${this.local.format24.minutes} ${this.local.format12.amOrPm} ${this.local.tz}`;
  }

  //returns the date as a string like Sept 12, 2016
  getDate() {
    return `${Months[this.local.format24.month]} ${this.local.format24.day}, ${this.local.format24.year}`;
  }

}

//converts to 12 hour format
function handleTimeMath12(currentUTCHour, tz) {
  if (currentUTCHour >= 0 && currentUTCHour < 12) {
    if (currentUTCHour === 0) {
      return {hour: 12, amOrPm: 'AM'};
    } else {
        return {hour: currentUTCHour, amOrPm: 'AM'};
    }
  } else {
    currentUTCHour = Math.abs(currentUTCHour - 12);
    if (currentUTCHour === 0) {
        return {hour: 12, amOrPm: 'PM'};
    } else {
      return {hour: currentUTCHour, amOrPm: 'PM'};
    }
  }

}

module.exports = HeyDay;
