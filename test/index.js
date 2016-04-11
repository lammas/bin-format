'use strict';

var test = require('tape');
var Format = require('../index');

test('Simple', function(t) {
	const buf = new Buffer('ab', 'hex');
	var fmt = new Format().uint8('test');
	var object = fmt.parse(buf);
	var output = fmt.write(object);

	t.equals(object.test, 0xab, 'Parsing OK');
	t.equals(output.length, 1, 'Output: length OK');
	t.deepEquals(output, buf, 'Output: value OK');
	t.end();
});

test('All read/write methods', function(t) {
	const object = {
		uint8_test: 42,
		uint16BE_test: 1001,
		uint16LE_test: 1001,
		uint32BE_test: 500000,
		uint32LE_test: 500000,

		int8_test: -42,
		int16BE_test: -1001,
		int16LE_test: -1001,
		int32BE_test: -500000,
		int32LE_test: -500000,

		floatBE_test: 0.123456,
		floatLE_test: 0.123456,

		doubleBE_test: 0.1234567891,
		doubleLE_test: 0.1234567891,

		buffer_test: new Buffer('deadbeef', 'hex'),
	};

	var fmt = new Format()
		.uint8('uint8_test')
		.uint16BE('uint16BE_test')
		.uint16LE('uint16LE_test')
		.uint32BE('uint32BE_test')
		.uint32LE('uint32LE_test')

		.int8('int8_test')
		.int16BE('int16BE_test')
		.int16LE('int16LE_test')
		.int32BE('int32BE_test')
		.int32LE('int32LE_test')

		.floatBE('floatBE_test')
		.floatLE('floatLE_test')
		.doubleBE('doubleBE_test')
		.doubleLE('doubleLE_test')
		.buffer('buffer_test', 4)
		;

	var output = fmt.write(object);
	var parsed = fmt.parse(output);

	// fixes float inaccuracy for more convenient testing
	parsed.floatBE_test = Math.round(parsed.floatBE_test * 1000000) / 1000000;
	parsed.floatLE_test = Math.round(parsed.floatLE_test * 1000000) / 1000000;

	t.deepEquals(object, parsed, 'Serialization OK');
	t.end();
});


test('Nested', function(t) {
	const buf = new Buffer('0102a1a2', 'hex');
	var fmt = new Format()
		.uint8('a')
		.uint8('b')
		.nest('sub', new Format().uint8('suba').uint8('subb'));
	var object = fmt.parse(buf);
	var output = fmt.write(object);

	t.equals(object.a, 1, 'Parsing OK');
	t.equals(object.b, 2, 'Parsing OK');
	t.deepEquals(object.sub, { suba: 0xa1, subb: 0xa2 }, 'Parsing nested OK');
	t.equals(output.length, buf.length, 'Output: length OK');
	t.deepEquals(output, buf, 'Output: value OK');
	t.end();
});


test('Class', function(t) {
	class A {
		constructor(data) {
			this.value = data;
		}

		serialize() {
			return this.value;
		}
	}

	const buf = new Buffer('0102', 'hex');
	var fmt = new Format()
		.uint8('a', A)
		.uint8('b');
	var object = fmt.parse(buf);
	var output = fmt.write(object);

	t.equals(object.a.value, 1, 'Parsing OK');
	t.equals(object.b, 2, 'Parsing OK');
	t.equals(output.length, buf.length, 'Output: length OK');
	t.deepEquals(output, buf, 'Output: value OK');
	t.end();
});
