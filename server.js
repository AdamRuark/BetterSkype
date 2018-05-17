// var express = require('express');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server)
var path = require('path');
var port = process.env.PORT || 5001;

var msglog = [];

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, '/index.html'))
});

app.use('/static/:file', function (req, res) {
	res.sendFile(path.join(__dirname, req.params.file))
});

io.on('connection', function(socket) {
	// console.log("client connected");

	socket.on('new-user', function () {
		socket.emit('join-room', msglog);
	});

	socket.on('send', function(msg){
		while(msglog.length >= 100) {
			console.log("here");
			msglog.shift();
		}
		msglog.push(msg);
		// console.log(msglog);
		socket.broadcast.emit('receive', msg);
	});

});



server.listen(port, function () {
	console.log("Started on port: " + port + "\n")
});