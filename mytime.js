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
