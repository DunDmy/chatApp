//init request with server
var socket = io();

socket.on('connect', function () {
	console.log('Connected to server');
})

socket.on('disconnect', function () {
	console.log('Disconnected from server');
})


socket.on('newLocationMessage', function (message) {
	var li = jQuery('<li></li>');
	var a = jQuery('<a target="_blank">My current location</a>');
	var formattedTime = moment(message.createdAt).format('h:mm a');

	li.text(`${message.from} ${formattedTime}: `);
	a.attr('href', message.url);
	li.append(a);

	jQuery('#messages').append(li);
})

//custom event
socket.on('newMessage', function (message) {
	var formattedTime = moment(message.createdAt).format('h:mm a');
	console.log('New message', message);
	var li = jQuery('<li></li>');
	li.text(`${message.from} ${formattedTime}: ${message.text}`);

	jQuery('#messages').append(li);
})

//grab info from the form and send it
jQuery('#message-form').on('submit', function(e) {
	e.preventDefault();

	var messageTextbox = jQuery('[name=message]');
	socket.emit('createMessage', {
		from:'User',
		text: messageTextbox.val()
	}, function() {
		//clear the value after it has been sent
		messageTextbox.val('');
	})
})

var locationButton = jQuery('#send-location');
jQuery('#send-location').on('click', function() {
	if(!navigator.geolocation){
		return alert('Geolocation not supported by your browser');
	}

	//disable Send Location after sent
	locationButton.attr('disabled', 'disabled').text('Sending...');

	navigator.geolocation.getCurrentPosition(function (position) {
		//enable Send Location 
		locationButton.removeAttr('disabled').text('Send Location');
		console.log(position);
		socket.emit('createLocationMessage', {
			latitude: position.coords.latitude,
			longitude: position.coords.longitude
		})
	}, function () {
		alert('Unable to fetch location.');
		//enable Send Location 
		locationButton.removeAttr('disabled').text('Send Location');
	})
});