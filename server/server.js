const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
//create APP
const app = express();
//integrate express with http in order to use socket.io
const server = http.createServer(app);
const io = socketIO(server);

//register event.
//listen for connection
io.on('connection', (socket) => {
	console.log('New user connected');
	//event listener
	//custom event. send data to client
	socket.emit('newMessage', {
		from: 'mike@example.com',
		text: 'Hello',
		createdAt: 321323
	});

	socket.emit('newMessage', {
		from:'Admin',
		text: 'Welcom to the chat app',
		createdAt: new Date().getTime()
	});

	socket.broadcast.emit('newMessage', {
		from: 'Admin',
		text: 'New user joined',
		createdAt: new Date().getTime()
	})
	//custom event
	socket.on('createMessage', (message) => {
		console.log('createMessage', message);
		//sends to all
		io.emit('newMessage', {
			form:message.from,
			text: message.text,
			createdAt: new Date().getTime()
		})

		// socket.broadcast.emit('newMessage', {
		// 	from: message.from,
		// 	text: message.text,
		// 	createdAt: new Date().getTime()
		// })
	})
	socket.on('disconnect', () => {
		console.log('User was disconnected');
	})
});

//load HTML page
app.use(express.static(publicPath));


server.listen(port, ()=> console.log(`PORT IS UP ${port}`));