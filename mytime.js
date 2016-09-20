const tzAbbr = {
  'EST': -5, //the value is the hour offset from UTC
  'EDT': -4,
  'PST': -8,
  'PDT': -7,
}

const Months = [
  'Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec',
];

class MyTime {

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
      },
      format12: {
        hour: null,
        minutes: null,
        day: null,
        month: null,
        year: null,
        amOrPm: '',
      },
      date: null,
      tz: tz,
      format: 24,
    };
  }

  //initialize the local time
  init() {
    this.setLocalTime();
    return this;
  }

  setLocalTime() {
    // if (this.local.format === 24) {
    //   this.local.hour = handleTimeMath24(this.hour, this.local.tz);
    // } else if (this.local.format === 12) {
    //   let time = handleTimeMath12(this.hour, this.local.tz);
    //   this.local.hour = time.hour;
    //   this.local.amOrPm = time.amOrPm;
    // } else {
    //   return new Error('Invalid time format(Either 24 or 12 hour format)');
    // }
    //
    this.local.date = new Date(this.date.valueOf() + (tzAbbr[this.local.tz] * 3600000)); //3600000 ms in an hour
    this.local.format24.day = this.local.date.getDate();
    this.local.format24.month = this.local.date.getUTCMonth();
    this.local.format24.year = this.local.date.getUTCFullYear();
    this.local.format24.hour = this.local.date.getUTCHours();
    this.local.format24.minutes = this.local.date.getUTCMinutes();
  }

  setTZ(tz) {
    if (tzAbbr[tz] === undefined) {
      throw new Error('Call to setTZ has invalid argument');
    } else if (tz === this.local.tz) {
      return this;
    }

    this.local.tz = tz;
    this.setLocalHour();
    return this;
  }

  setFormat(format) {
    if (format === this.local.format) {
      return this;
    } else if (format !== 24 && format !== 12) {
      console.log(format !== 24);
      throw new Error('Call to setFormat has invalid argument');
    }

    this.local.format = format;
    this.setLocalHour();
    return this;
  }

  //returns the local time as a readable string
  now() {
    if (this.local.format === 24) {
      return `${this.local.hour}:${this.local.minutes} ${this.local.tz}`;
    }

    return `${this.local.hour}:${this.local.minutes} ${this.local.amOrPm} ${this.local.tz}`;
  }

  //returns the date as a string like Sept 12, 2016
  //a little more tricky than I thought to get the actual day because of everyone hitting 12am at diff times
  //will look into later!!!!!
  getDate() {
    let day;
    if (this.hour >= 0 && (this.local.hour < 24 && this.local.hour > this.hour))
    return `${Months[this.month]} ${this.day}, ${this.year}`;
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
