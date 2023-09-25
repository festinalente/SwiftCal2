const assert = require('assert');

  describe('timeValueInMill', () => {
    it('should return the correct time value in milliseconds', () => {
      assert.strictEqual(timeValueInMill('12:30'), 45000000);
      assert.strictEqual(timeValueInMill('01:15'), 4500000);
      assert.strictEqual(timeValueInMill('06:45'), 24300000);
    });

    it('should handle leading zeros in the time input', () => {
      assert.strictEqual(timeValueInMill('08:05'), 29100000);
      assert.strictEqual(timeValueInMill('09:00'), 32400000);
    });

    it('should handle time inputs with single digit hours and minutes', () => {
      assert.strictEqual(timeValueInMill('1:30'), 5400000);
      assert.strictEqual(timeValueInMill('9:5'), 32700000);
    });
  });
