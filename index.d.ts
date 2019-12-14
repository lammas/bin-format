declare module 'bin-format' {
	export class Format {
		constructor();
		buffer(name: string, length: any, constructor?: any): Format;
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

		length(): Format;

		parse(buffer: any, reader?: any): any;
		write(data: any, options?: any): any;
	}
}
