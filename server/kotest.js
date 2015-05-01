var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);


function coffeeorder(owner, order) {

	this.owner = owner;
	this.order = order;

}

function coffeerun(owner, expiry, maxcups) {

	this.owner = owner;
	this.expiry = expiry;
	this.maxcups = maxcups;
	this.orders = new Array();
	this.subscribers = [];
}

var coffeeruns = [];

var newrun = new coffeerun ("James", 120, 6);
coffeeruns[123] = newrun;

app.use(express.static('../src'));
app.use(bodyParser.json());


app.get('/api/coffeerun/:id', function (req, res) {
  
    var run = coffeeruns[req.params.id];

	if (run != undefined) {
		// Return the coffee run but exclude the subscribers property, which is private
		res.end(JSON.stringify(run, function (key,value) {if (key == 'subscribers') return undefined; return value;}
			));
	} else {
		res.end('NOT FOUND :(');
	}

});

app.post('/api/coffeerun/:id', function (req, res) {

	console.log ('NEW ORDER: ' + req.body.owner );

	var run = coffeeruns[req.params.id];
	var newOrder = req.body;
	run.orders.push(newOrder);
	res.writeHead(200, {'Content-Type': 'application/json'});
	res.end('{}');

	console.log ('Sending event to %d subscribers', run.subscribers.length);

	for (var i = 0; i < run.subscribers.length; i++) {
		run.subscribers[i].emit('order', newOrder);
	}

});

io.on('connection', function (socket) {

	socket.on('subscribe', function(runid) {
		console.log('Subscription to run %s', runid);
		var run = coffeeruns[runid];
		run.subscribers.push(this);
	});

    console.log('NEW CONNECTION');

});



server.listen(80, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('kotest is listening at http://%s:%s', host, port);

});