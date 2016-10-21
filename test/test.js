const mocha = require('mocha');
const assert = require('chai').assert;
const HeyDay = require('../heyday.js');

describe('HeyDay', function () {
  describe('#heyday constructor', function () {
    it('"new HeyDay()" should return an object', function () {
      assert.isObject(new HeyDay());
    });

    it('"new HeyDay(\'EDT\')" should set the timezone to EDT', function () {
      let t = new HeyDay('EDT');
      assert.equal(t.local.tz, 'EDT');
    });

    it('"new HeyDay(\'EDT\').init()" should initialize the local object', function () {
        let t = new HeyDay('EDT').init();
        assert.isNotNull(t.local.date);
        assert.isNotNull(t.local.format24.hour);
        assert.isNotNull(t.local.format24.minutes);
        assert.isNotNull(t.local.format12.hour);
        assert.isNotNull(t.local.format12.amOrPm);
      });

      it('"new HeyDay().init()" should not init the local object because its trying' +
        ' to init with out setting timezone first', function() {
          let t = new HeyDay().init()
          assert.isNull(t.local.date);
          assert.isNull(t.local.format24.hour);
          assert.isNull(t.local.format24.minutes);
          assert.isNull(t.local.format12.hour);
          assert.equal(t.local.format12.amOrPm, '');
      });
  })

  describe('#heyday methods', function () {
    it('"setTZ" sets a current timezone in the local object', function () {
      let t = new HeyDay();

      assert.isNull(t.local.tz);
      t.setTZ('EDT');
      assert.equal(t.local.tz, 'EDT');
      t.setTZ('HST');
      assert.equal(t.local.tz, 'HST');
    });

    it('"setTZ" throws an error if passed an invalid or non supported timezone', function () {
      let t = new HeyDay();
      assert.throws(t.setTZ.bind(t, 'PDD'), 'Call to setTZ has invalid argument');
      assert.throws(t.setTZ.bind(t, 12), 'Call to setTZ has invalid argument');
      assert.throws(t.setTZ.bind(t), 'Call to setTZ has invalid argument');
    });

    it('"now" returns the current time in h:m format with timezone abbreviation', function () {
      let t = new HeyDay('EDT').init();
      let hour = t.local.format24.hour;
      let min = t.local.format24.minutes >= 10 ? t.local.format24.minutes : '0' + t.local.format24.minutes;
      let tz = t.local.tz;

      assert.isString(t.now());
      assert.equal(t.now(), `${hour}:${min} ${tz}`);
    });

    it('"getDate" returns the current date, e.g Sept 12, 2016', function () {
      let t = new HeyDay('EDT').init();
      let day = t.local.format24.day;
      let month = t.local.format24.month;
      let year = t.local.format24.year;
      const Months = [
        'Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec',
      ];

      assert.isString(t.getDate());
      assert.equal(t.getDate(), `${Months[month]} ${day}, ${year}`);
    });

    it('"setFormat" sets either 12 or 24 hour format in the local object', function () {
      let t = new HeyDay('EDT').init();

      assert.isNumber(t.local.format);
      assert.equal(t.local.format, 24);
      t.setFormat(12);
      assert.isNumber(t.local.format);
      assert.equal(t.local.format, 12);
    });

    it('"getTimeApart" returns amount of time two HeyDay objects are apart from each other relative to tz',
      function () {
        let t1 = new HeyDay('EDT').init();
        let t2 = new HeyDay('PDT').init();
        let timeApart = t1.getTimeApart(t2);

        assert.isNumber(timeApart);
        assert.equal(timeApart, 3);
      });

    it('"getTimeApart" returns human readable string if second argument is set to true', function () {
      let t1 = new HeyDay('EDT').init();
      let t2 = new HeyDay('HST').init();
      let timeApart = t1.getTimeApart(t2, true);

      assert.isString(timeApart);
      assert.equal(timeApart, 'You are 6 hour(s) ahead');

      t1.setTZ('MDT');
      assert.equal(t1.getTimeApart(t2, true), 'You are 4 hour(s) ahead');
      assert.equal(t2.getTimeApart(t1, true), 'You are 4 hour(s) behind');
    });

    it('"getTimeApart" throws an error when passed anything other than HeyDay object on first argument',
      function () {
        let t1 = new HeyDay('AKST').init();
        assert.throws(t1.getTimeApart.bind(t1, {}), 'First argument must be a HeyDay Object');
      });

  });

}); //end describe('HeyDay')
