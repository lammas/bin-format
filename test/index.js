'use strict';

var test = require('tape');
var Format = require('../index');

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

test('Simple', function(t) {
	const buf = new Buffer('ab', 'hex');
	var fmt = new Format().uint8('test');
	var object = fmt.parse(buf);
	var output = fmt.write(object);

	t.equals(object.test, 0xab, 'Parsing OK');
	t.deepEquals(output, buf, 'Output value OK');
	t.end();
});

test('List', function(t) {
	const buf = new Buffer('baadf00dff01ff02ff03ff04', 'hex');

	var fmt = new Format()
		.buffer('header', 4)
		.list('list', 4, new Format()
			.uint8('hdr')
			.uint8('val'));

	t.equals(fmt.length(), 4 + 4 * 2, 'Length prediction OK');

	var object = fmt.parse(buf);
	var output = fmt.write(object);

	t.deepEquals(object.header, new Buffer('baadf00d', 'hex'), 'Header OK');
	t.deepEquals(object.list, [
		{ hdr: 255, val: 1 },
		{ hdr: 255, val: 2 },
		{ hdr: 255, val: 3 },
		{ hdr: 255, val: 4 }
	], 'Parsed list OK');
	t.deepEquals(output, buf, 'Output value OK');
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
	t.deepEquals(output, buf, 'Output value OK');
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
	t.deepEquals(output, buf, 'Output value OK');
	t.end();
});

test('Read until EOF', function(t) {
	const buf = new Buffer('000102030405060708090a0b0c0d0e0f', 'hex');
	var fmt = new Format()
		.uint8('this_is_zero')
		.buffer('one_to_eff', 'eof');

	var object = fmt.parse(buf);
	var output = fmt.write(object);

	t.equals(object.this_is_zero, 0x00, 'Parsing OK');
	t.deepEquals(object.one_to_eff, buf.slice(1), 'Parsing OK');
	t.deepEquals(output, buf, 'Output value OK');
	t.end();
});

test('Variable length structures', function(t) {
	const buf = new Buffer('dade05fa01fa02fb03ff04fb05', 'hex');
	var fmt = new Format()
		.uint16BE('header')
		.uint8('count')
		.custom('values', function(state) {
			return new Format()
				.list('list', state.count, new Format()
					.uint8('type')
					.uint8('value')
				);
		});

	var object = fmt.parse(buf);
	var output = fmt.write(object);

	t.equals(object.header, 0xdade, 'Header OK');
	t.equals(object.count, 5, 'Count OK');
	t.deepEquals(object.values, {
		list: [
			{ type: 250, value: 1 },
			{ type: 250, value: 2 },
			{ type: 251, value: 3 },
			{ type: 255, value: 4 },
			{ type: 251, value: 5 }
		]
	}, 'Object OK');
	t.deepEquals(output, buf, 'Output value OK');
	t.end();
});

test('Instances of same format', function(t) {
	var Item = new Format()
		.uint8('ff')
		.uint8('value');

	var fmt = new Format()
		.nest('item_0', Item)
		.nest('item_1', Item)
		.nest('item_2', Item)
		.nest('item_3', Item);

	const buf = new Buffer('ff01ff02ff03ff04', 'hex');
	var object = fmt.parse(buf);
	var output = fmt.write(object);

	t.deepEquals(object, {
		item_0: { ff: 255, value: 1 },
		item_1: { ff: 255, value: 2 },
		item_2: { ff: 255, value: 3 },
		item_3: { ff: 255, value: 4 }
	}, 'Object OK');
	t.deepEquals(output, buf, 'Output value OK');
	t.end();
});
