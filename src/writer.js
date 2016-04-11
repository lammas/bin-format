'use strict';

function append(source, buffer) {
	if (!source)
		return buffer;
	return Buffer.concat([source, buffer]);
}

class Writer {
	constructor() {
		this.output = null;
	}

	uint8(value) {
		var buffer = new Buffer(1);
		buffer.writeUInt8(value, 0);
		this.output = append(this.output, buffer);
	}

	uint16BE(value) {
		var buffer = new Buffer(2);
		buffer.writeUInt16BE(value, 0);
		this.output = append(this.output, buffer);
	}

	uint16LE(value) {
		var buffer = new Buffer(2);
		buffer.writeUInt16LE(value, 0);
		this.output = append(this.output, buffer);
	}

	uint32BE(value) {
		var buffer = new Buffer(4);
		buffer.writeUInt32BE(value, 0);
		this.output = append(this.output, buffer);
	}

	uint32LE(value) {
		var buffer = new Buffer(4);
		buffer.writeUInt32LE(value, 0);
		this.output = append(this.output, buffer);
	}

	int8(value) {
		var buffer = new Buffer(1);
		buffer.writeInt8(value, 0);
		this.output = append(this.output, buffer);
	}

	int16BE(value) {
		var buffer = new Buffer(2);
		buffer.writeInt16BE(value, 0);
		this.output = append(this.output, buffer);
	}

	int16LE(value) {
		var buffer = new Buffer(2);
		buffer.writeInt16LE(value, 0);
		this.output = append(this.output, buffer);
	}

	int32BE(value) {
		var buffer = new Buffer(4);
		buffer.writeInt32BE(value, 0);
		this.output = append(this.output, buffer);
	}

	int32LE(value) {
		var buffer = new Buffer(4);
		buffer.writeInt32LE(value, 0);
		this.output = append(this.output, buffer);
	}

	floatBE(value) {
		var buffer = new Buffer(4);
		buffer.writeFloatBE(value, 0);
		this.output = append(this.output, buffer);
	}

	floatLE(value) {
		var buffer = new Buffer(4);
		buffer.writeFloatLE(value, 0);
		this.output = append(this.output, buffer);
	}

	doubleBE(value) {
		var buffer = new Buffer(8);
		buffer.writeDoubleBE(value, 0);
		this.output = append(this.output, buffer);
	}

	doubleLE(value) {
		var buffer = new Buffer(8);
		buffer.writeDoubleLE(value, 0);
		this.output = append(this.output, buffer);
	}

	buffer(value) {
		this.output = append(this.output, value);
	}

}

module.exports = Writer;
