//init request with server
var socket = io();

//move main srcoll bar when message is added
function scrollToBottom () {
	//Selectors
	var messages = jQuery('#messages');
	var newMessage = messages.children('li:last-child');
	//Heights
	var clientHeight = messages.prop('clientHeight');
	var scrollTop = messages.prop('scrollTop');
	var scrollHeight = messages.prop('scrollHeight');
	var newMessageHeight = newMessage.innerHeight();
	var lastMessageHeight = newMessage.prev().innerHeight();

	if(clientHeight + scrollTop + newMessageHeight + 
		lastMessageHeight >= scrollHeight){
		messages.scrollTop(scrollHeight);
	}
}

//create a room
socket.on('connect', function () {
	console.log('Connected to server');
	var param = jQuery.deparam(window.location.search);

	socket.emit('join', param, function (err) {
		if(err){
			alert(err);
			window.location.href = '/';
		}else{
			console.log('no error');
		}
	})
})

socket.on('disconnect', function () {
	console.log('Disconnected from server');
})

socket.on('updateUserList', function (users) {
	var ol = jQuery('<ul></ul>');

	users.forEach(function (user) {
		ol.append(jQuery('<li></li>').text(user))
	});

	jQuery('#users').html(ol);
	console.log('Users List', users);
})


socket.on('newLocationMessage', function (message) {
	
	var formattedTime = moment(message.createdAt).format('h:mm a');
	var template = jQuery('#location-message-template').html();
	var html = Mustache.render(template, {
		from: message.from,
		url: message.url,
		createdAt: formattedTime
	})
	jQuery('#messages').append(html);
	scrollToBottom();
	// var li = jQuery('<li></li>');
	// var a = jQuery('<a target="_blank">My current location</a>');
	// li.text(`${message.from} ${formattedTime}: `);
	// a.attr('href', message.url);
	// li.append(a);
	// jQuery('#messages').append(li);
})

//custom event
socket.on('newMessage', function (message) {
	var formattedTime = moment(message.createdAt).format('h:mm a');
	var template = jQuery('#message-template').html();
	var html = Mustache.render(template, {
		text: message.text,
		from: message.from,
		createdAt: formattedTime});
	jQuery('#messages').append(html);
	scrollToBottom();
	// console.log('New message', message);
	// var li = jQuery('<li></li>');
	// li.text(`${message.from} ${formattedTime}: ${message.text}`);
	// jQuery('#messages').append(li);
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