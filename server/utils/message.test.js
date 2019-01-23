var expect = require('expect.js');
var {generateMessage, generateLocationMessage} = require('./message');
describe('generateMessage', () => {
	it('should generate correct message object', () => {
		var from = 'Jen';
		var text = 'Same message';
		var message = generateMessage(from, text);

		expect(message.createdAt).to.be.a('number');
		// expect(message).to.contain({
		// 	from,
		// 	text,
		// 	createdAt:message.createdAt
		// })

	})
})

describe('generateLocationMessage', () => {
	it('should generate correct location object', () => {
		var from = 'Deb';
		var latitude = 15;
		var longitude = 19;
		var url = 'https://www.google.com/maps?=15,19';
		var message = generateLocationMessage(from, latitude, longitude);
		expect(message.createdAt).to.be.a('number');
		// expect(message).to.contain({
		// 	from,
		// 	text,
		// 	createdAt:message.createdAt
		// })

	})
})

