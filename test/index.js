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
