'use strict';

class Reader {
	constructor(buffer) {
		this.buffer = buffer;
		this.position = 0;
	}

	uint8() {
		return this.buffer.readUInt8(this.position++);
	}

	uint16BE() {
		var value = this.buffer.readUInt16BE(this.position);
		this.position += 2;
		return value;
	}

	uint16LE() {
		var value = this.buffer.readUInt16LE(this.position);
		this.position += 2;
		return value;
	}

	uint32BE() {
		var value = this.buffer.readUInt32BE(this.position);
		this.position += 4;
		return value;
	}

	uint32LE() {
		var value = this.buffer.readUInt32LE(this.position);
		this.position += 4;
		return value;
	}

	int8() {
		return this.buffer.readInt8(this.position++);
	}

	int16BE() {
		var value = this.buffer.readInt16BE(this.position);
		this.position += 2;
		return value;
	}

	int16LE() {
		var value = this.buffer.readInt16LE(this.position);
		this.position += 2;
		return value;
	}

	int32BE() {
		var value = this.buffer.readInt32BE(this.position);
		this.position += 4;
		return value;
	}

	int32LE() {
		var value = this.buffer.readInt32LE(this.position);
		this.position += 4;
		return value;
	}

	doubleBE() {
		var value = this.buffer.readDoubleBE(this.position);
		this.position += 8;
		return value;
	}

	doubleLE() {
		var value = this.buffer.readDoubleLE(this.position);
		this.position += 8;
		return value;
	}

	floatBE() {
		var value = this.buffer.readFloatBE(this.position);
		this.position += 4;
		return value;
	}

	floatLE() {
		var value = this.buffer.readFloatLE(this.position);
		this.position += 4;
		return value;
	}
}

module.exports = Reader;
