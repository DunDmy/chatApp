const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {isRealString} = require('./utils/validation');
const {generateMessage, generateLocationMessage} = require('./utils/message');
const {Users} = require('./utils/users.js');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
//create APP
const app = express();
//integrate express with http in order to use socket.io
const server = http.createServer(app);
const io = socketIO(server);
const users = new Users();


//register event.
//listen for connection
io.on('connection', (socket) => {
	console.log('New user connected');
	
	//listen to join the room
	socket.on('join', (params, callback)=> {
		if(!isRealString(params.name) || !isRealString(params.room)){
			return callback('Name and room are required.')
		}

		//creates a chat room
		socket.join(params.room);
		//socket.leave

		//remove user from previous room
		users.removeUser(socket.id);
		//add new user to the room
		users.addUser(socket.id, params.name, params.room);
		//send the new list of user to the webpage
		io.to(params.room).emit('updateUserList', users.getUserList(params.room));

		//event listener
		//custom event. send data to client
		socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
		
		//send to all, except you
		socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined.`));

		callback();
	})
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
		var user = users.removeUser(socket.id);

		if (user) {
			io.to(user.room).emit('updateUserList', users.getUserList(user.room));
			io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
		}
		console.log('User was disconnected');
	});
});

//load HTML page
app.use(express.static(publicPath));


server.listen(port, ()=> console.log(`PORT IS UP ${port}`));