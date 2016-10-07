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
});
