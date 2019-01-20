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

	socket.on('disconnect', () => {
		console.log('User was disconnected');
	})
});

//load HTML page
app.use(express.static(publicPath));


server.listen(3000, ()=> console.log(`ERVER IS UP ${port}`));