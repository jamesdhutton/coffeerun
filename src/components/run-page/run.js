define(['knockout', 'text!./run.html', 'socket'], function(ko, templateMarkup, io) {

  function Order(owner, order) {
    this.owner = ko.observable(owner);
    this.order = ko.observable(order);
  }


  function RunPage(route) {

    var self = this;

    this.id = route.id;
    this.owner = ko.observable('');
    this.expirydatetime = new Date();
    this.expiry = ko.observable(0);
    this.maxcups = ko.observable(0);
    this.orders = ko.observableArray([]);
    this.expirytext = ko.computed(function () {
        return Math.floor(self.expiry() / 60) + ':' + (self.expiry() % 60);
      });

    this.newOrderOwner = ko.observable('');
    this.newOrderCoffee = ko.observable('');

    this.expired = ko.computed( function () {
      return self.expiry() <= 0;
    });

    this.socket = io.connect('/', {multiplex: false});
    this.socket.emit('subscribe', this.id);
    this.socket.on('order', function(data) {

      var newOrder = new Order(data.owner, data.order);
      self.orders.push (newOrder);
      
    });

    $.getJSON("/api/coffeerun/" + this.id, function(coffeerun) {

      self.owner(coffeerun.owner);
      self.expirydatetime.setTime (new Date().getTime() + coffeerun.expiry * 1000);
      self.maxcups(coffeerun.maxcups);
      self.orders(coffeerun.orders);
      self.timer = setInterval (function() {
          self.expiry(  Math.floor((self.expirydatetime.getTime() - new Date().getTime()) / 1000)    );
          if (self.expired())
            self.clearTimer();
        }, 1000 );

    }); 

  }

  RunPage.prototype.dispose = function() { 
    this.clearTimer();
    this.socket.disconnect();
  }; 


  RunPage.prototype.clearTimer = function() {
    if (this.timer != null) {
          clearInterval(this.timer);
          this.timer = null;
    }
  }

  RunPage.prototype.addOrder = function() {

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

  return { viewModel: RunPage, template: templateMarkup };

});
