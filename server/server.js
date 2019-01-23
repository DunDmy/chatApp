const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
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
	socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
	
	//send to all, except you
	socket.broadcast.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
	//custom event
	socket.on('createMessage', (message, callback) => {
		console.log('createMessage', message);
		//sends to all
		io.emit('newMessage', generateMessage(message.from, message.text));
		callback();
	});

	socket.on('createLocationMessage', (coords) => {
		//io.emit('newMessage', generateMessage('Admin', `${coords.latitude} ${coords.longitude}`))
		io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude))
	})

	socket.on('disconnect', () => {
		console.log('User was disconnected');
	});
});

//load HTML page
app.use(express.static(publicPath));


server.listen(port, ()=> console.log(`PORT IS UP ${port}`));