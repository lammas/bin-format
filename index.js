'use strict';

var Reader = require('./src/reader');
var Writer = require('./src/writer');

function isClassType(f) {
	if (typeof(f) != 'function')
		return false;
	return /^class\s/.test(Function.prototype.toString.call(f));
}

class Format {
	constructor() {
		this.steps = [];

		var scope = this;
		function addReadFunction(fnName) {
			scope[fnName] = function(name, construct) {
				scope.steps.push({ type: 'data', get: fnName, name: name, construct: construct });
				return scope;
			};
		}

		var names = Object.getOwnPropertyNames(Reader.prototype);
		for (var i = 0; i < names.length; i++) {
			var member = names[i];
			if (member == 'constructor')
				continue;
			addReadFunction(member);
		}
	}

	nest(name, format, construct) {
		this.steps.push({ type: 'nest', name: name, format: format, construct: construct });
		return this;
	}

	parse(buffer, reader) {
		if (!reader)
			reader = new Reader(buffer);

		var result = {};

		for (var i = 0; i < this.steps.length; i++) {
			var step = this.steps[i];
			if (step.type == 'data') {
				var f = reader[step.get];
				var value = f.apply(reader);
				if (step.construct) {
					value = isClassType(step.construct) ? new step.construct(value) : step.construct(value);
				}
				result[step.name] = value;
				continue;
			}

			if (step.type == 'nest') {
				var value = step.format.parse(buffer, reader);
				if (step.construct) {
					value = isClassType(step.construct) ? new step.construct(value) : step.construct(value);
				}
				result[step.name] = value;
				continue;
			}
		}

		return result;
	}

	write(data, writer) {
		if (!writer)
			writer = new Writer();

		for (var i = 0; i < this.steps.length; i++) {
			var step = this.steps[i];

			if (step.type == 'data') {
				var f = writer[step.get];
				var value = data[step.name];
				if (typeof(value) == 'object' && 'serialize' in value) {
					value = value.serialize();
				}
				f.apply(writer, [value]);
				continue;
			}

			if (step.type == 'nest') {
				var value = data[step.name];
				step.format.write(value, writer);
				continue;
			}
		}

		return writer.buffer;
	}
}

module.exports = Format;
