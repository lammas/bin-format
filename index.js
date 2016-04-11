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
		function addStepFunction(fnName) {
			if (fnName in scope)
				return;
			scope[fnName] = function(name, construct) {
				scope.steps.push({ type: 'data', fn: fnName, name: name, construct: construct });
				return scope;
			};
		}

		var names = Object.getOwnPropertyNames(Reader.prototype);
		for (var i = 0; i < names.length; i++) {
			var member = names[i];
			if (member == 'constructor')
				continue;
			addStepFunction(member);
		}
	}

	buffer(name, length, construct) {
		this.steps.push({ type: 'data', fn: 'buffer', name: name, length: length, construct: construct });
		return this;
	}

	nest(name, format, construct) {
		this.steps.push({ type: 'nest', name: name, format: format, construct: construct });
		return this;
	}

	list(name, count, format) {
		this.steps.push({ type: 'list', name: name,  count: count, format: format });
		return this;
	}

	custom(name, callback) {
		this.steps.push({ type: 'custom', name: name, callback: callback });
		return this;
	}

	parse(buffer, reader) {
		if (!reader)
			reader = new Reader(buffer);

		var result = {};

		for (var i = 0; i < this.steps.length; i++) {
			var step = this.steps[i];
			if (step.type == 'data') {
				var f = reader[step.fn];

				var value;
				if (step.fn == 'buffer')
					value = f.apply(reader, [step.length]);
				else
					value = f.apply(reader);

				if (step.construct) {
					value = isClassType(step.construct) ? new step.construct(value) : step.construct(value);
				}
				result[step.name] = value;
			}

			if (step.type == 'list') {
				var list = [];
				for (var i = 0; i < step.count; i++) {
					list.push(step.format.parse(buffer, reader));
				}
				result[step.name] = list;
			}

			if (step.type == 'nest') {
				var value = step.format.parse(buffer, reader);
				if (step.construct) {
					value = isClassType(step.construct) ? new step.construct(value) : step.construct(value);
				}
				result[step.name] = value;
			}

			if (step.type == 'custom') {
				var fmt = step.callback(result);
				if (!(fmt instanceof Format))
					throw new Error('Error: .custom() callback must return an instance of Format');
				result[step.name] = fmt.parse(buffer, reader);
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
				var f = writer[step.fn];
				var value = data[step.name];
				if (typeof(value) == 'object' && 'serialize' in value) {
					value = value.serialize();
				}
				f.apply(writer, [value]);
			}

			if (step.type == 'list') {
				var list = data[step.name];
				for (var i = 0; i < list.length; i++) {
					var value = list[i];
					step.format.write(value, writer);
				}
			}

			if (step.type == 'nest') {
				var value = data[step.name];
				if (typeof(value) == 'object' && 'serialize' in value) {
					value = value.serialize();
				}
				step.format.write(value, writer);
			}

			if (step.type == 'custom') {
				var fmt = step.callback(data);
				if (!(fmt instanceof Format))
					throw new Error('Error: .custom() callback must return an instance of Format');
				fmt.write(data[step.name], writer);
			}
		}

		return writer.output;
	}
}

module.exports = Format;
