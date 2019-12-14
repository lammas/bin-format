export default class Format {
	constructor();
	buffer(name: string, length: any, constructor?: any): Format;
	text(name: string, length: any, encoding?: string, constructor?: any): Format;

	nest(name: string, format: Format, constructor?: any): Format;
	list(name: string, count: number, format: Format): Format;
	custom(name: string, callback: Function): Format;

	uint8(name: string, constructor?: any): Format;
	uint16BE(name: string, constructor?: any): Format;
	uint16LE(name: string, constructor?: any): Format;
	uint32BE(name: string, constructor?: any): Format;
	uint32LE(name: string, constructor?: any): Format;
	int8(name: string, constructor?: any): Format;
	int16BE(name: string, constructor?: any): Format;
	int16LE(name: string, constructor?: any): Format;
	int32BE(name: string, constructor?: any): Format;
	int32LE(name: string, constructor?: any): Format;
	floatBE(name: string, constructor?: any): Format;
	floatLE(name: string, constructor?: any): Format;
	doubleBE(name: string, constructor?: any): Format;
	doubleLE(name: string, constructor?: any): Format;

	uint8array(name: string, length: number, constructor?: any): Format;
	uint16BEarray(name: string, length: number, constructor?: any): Format;
	uint16LEarray(name: string, length: number, constructor?: any): Format;
	uint32BEarray(name: string, length: number, constructor?: any): Format;
	uint32LEarray(name: string, length: number, constructor?: any): Format;
	int8array(name: string, length: number, constructor?: any): Format;
	int16BEarray(name: string, length: number, constructor?: any): Format;
	int16LEarray(name: string, length: number, constructor?: any): Format;
	int32BEarray(name: string, length: number, constructor?: any): Format;
	int32LEarray(name: string, length: number, constructor?: any): Format;
	floatBEarray(name: string, length: number, constructor?: any): Format;
	floatLEarray(name: string, length: number, constructor?: any): Format;
	doubleBEarray(name: string, length: number, constructor?: any): Format;
	doubleLEarray(name: string, length: number, constructor?: any): Format;

	length(): Format;

	parse(buffer: any, reader?: any): any;
	write(data: any, options?: any): any;
}
