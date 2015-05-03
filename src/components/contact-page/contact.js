define(['knockout', 'text!./contact.html', 'socket'], function(ko, templateMarkup, io) {

  function Order(owner, order) {
    this.owner = ko.observable(owner);
    this.order = ko.observable(order);
  }


  function ContactPage(route) {

    this.id = route.id;
    this.owner = ko.observable('');
    this.expiry = ko.observable(0);
    this.maxcups = ko.observable(0);
    this.orders = ko.observableArray([]);

    this.newOrderOwner = ko.observable('');
    this.newOrderCoffee = ko.observable('');

    var self = this;

    this.socket = io.connect('/', {multiplex: false});
    this.socket.emit('subscribe', this.id);
    this.socket.on('order', function(data) {

      var newOrder = new Order(data.owner, data.order);
      self.orders.push (newOrder);
      
    });

    $.getJSON("/api/coffeerun/" + this.id, function(coffeerun) {

      self.owner(coffeerun.owner);
      self.expiry(coffeerun.expiry);
      self.maxcups(coffeerun.maxcups);
      self.orders(coffeerun.orders);
      self.timer = setInterval (function () {self.expiry(  self.expiry()-1   )}, 1000 );

    }); 

  }

  ContactPage.prototype.dispose = function() { 
    clearInterval(this.timer);
    this.socket.disconnect();
  }; 


  ContactPage.prototype.addOrder = function() {

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

  return { viewModel: ContactPage, template: templateMarkup };

});
