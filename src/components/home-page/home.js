define(["knockout", "text!./home.html", "socket"], function(ko, homeTemplate, io) {


	function Order(owner, order) {
		this.owner = ko.observable(owner);
		this.order = ko.observable(order);
	}


	function HomeViewModel(route) {

		this.id = route.id;
		this.owner = ko.observable('');
		this.expiry = ko.observable(120);
		this.maxcups = ko.observable(0);
		this.orders = ko.observableArray([]);

		this.newOrderOwner = ko.observable('');
		this.newOrderCoffee = ko.observable('');

		var self = this;

		$.getJSON("/api/coffeerun/" + this.id, function(coffeerun) {

			/*

		    var mappedRuns = $.map(allData, function(item) { return new CoffeeRun(item) });
		        self.message('There are ' +  mappedRuns.length + ' runs in the result');

			*/

			self.owner(coffeerun.owner);
			self.expiry(coffeerun.expiry);
			self.maxcups(coffeerun.maxcups);
			self.orders(coffeerun.orders);

		}); 

		this.socket = io.connect('/');
		this.socket.emit('subscribe', this.id);
		this.socket.on('order', function(data) {

			var newOrder = new Order(data.owner, data.order);
			self.orders.push (newOrder);
			
		});



		this.timer = setInterval (function () {self.expiry(  self.expiry()-1   )}, 1000 );

	}

	HomeViewModel.prototype.dispose = function() { 
		clearInterval(this.timer);
		this.socket.disconnect();
	}; 


	HomeViewModel.prototype.addOrder = function() {

		var self = this;
		var newOrder = new Order(this.newOrderOwner(), this.newOrderCoffee());
		
		$.ajax({
		    type: "POST",
		    url: "/api/order/" + self.id,
		    data: JSON.stringify({owner: newOrder.owner(), order: newOrder.order()}),
		    contentType: "application/json; charset=utf-8",
		    dataType: "json",
		    success: function(data){ },
		    failure: function(errMsg) {
		        alert(errMsg);
		    }
		});


	}

	return { viewModel: HomeViewModel, template: homeTemplate };

});
