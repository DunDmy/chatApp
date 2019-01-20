//init request with server
var socket = io();

socket.on('connect', function () {
	console.log('Connected to server');

	//custom event. send data to server
	socket.emit('createMessage', {
		from: 'jen@example.com',
		text: 'hello'
	})
})

socket.on('disconnect', function () {
	console.log('Disconnected from server');
})

//custom event
socket.on('newMessage', function (message) {
	console.log('New message', message);
})