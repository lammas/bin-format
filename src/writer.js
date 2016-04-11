'use strict';

function append(source, buffer) {
	if (!source)
		return buffer;
	return Buffer.concat([source, buffer]);
}

class Writer {
	constructor() {
		this.buffer = null;
	}

	uint8(value) {
		var buffer = new Buffer(1);
		buffer.writeUInt8(value, 0);
		this.buffer = append(this.buffer, buffer);
	}

	uint16BE() {
		var buffer = new Buffer(2);
		buffer.writeUInt16BE(value, 0);
		this.buffer = append(this.buffer, buffer);
	}

	uint16LE() {
		var buffer = new Buffer(2);
		buffer.writeUInt16LE(value, 0);
		this.buffer = append(this.buffer, buffer);
	}

	uint32BE() {
		var buffer = new Buffer(4);
		buffer.writeUInt32BE(value, 0);
		this.buffer = append(this.buffer, buffer);
	}

	uint32LE() {
		var buffer = new Buffer(4);
		buffer.writeUInt32LE(value, 0);
		this.buffer = append(this.buffer, buffer);
	}

	int8(value) {
		var buffer = new Buffer(1);
		buffer.writeUInt8(value, 0);
		this.buffer = append(this.buffer, buffer);
	}

	int16BE() {
		var buffer = new Buffer(2);
		buffer.writeUInt16BE(value, 0);
		this.buffer = append(this.buffer, buffer);
	}

	int16LE() {
		var buffer = new Buffer(2);
		buffer.writeUInt16LE(value, 0);
		this.buffer = append(this.buffer, buffer);
	}

	int32BE() {
		var buffer = new Buffer(4);
		buffer.writeUInt32BE(value, 0);
		this.buffer = append(this.buffer, buffer);
	}

	int32LE() {
		var buffer = new Buffer(4);
		buffer.writeUInt32LE(value, 0);
		this.buffer = append(this.buffer, buffer);
	}

	floatBE() {
		var buffer = new Buffer(4);
		buffer.writeFloatBE(value, 0);
		this.buffer = append(this.buffer, buffer);
	}

	floatLE() {
		var buffer = new Buffer(4);
		buffer.writeFloatLE(value, 0);
		this.buffer = append(this.buffer, buffer);
	}

	doubleBE() {
		var buffer = new Buffer(8);
		buffer.writeDoubleBE(value, 0);
		this.buffer = append(this.buffer, buffer);
	}

	doubleLE() {
		var buffer = new Buffer(8);
		buffer.writeDoubleLE(value, 0);
		this.buffer = append(this.buffer, buffer);
	}

}

module.exports = Writer;
