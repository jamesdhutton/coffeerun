define(["knockout", "jquery", "jquery-validation", "text!./home.html"], function(ko, $, jqv, homeTemplate) {

  function HomeViewModel(params) {

    this.availableTimes = [
        { timeText: "5 minutes", time: 5 },
        { timeText: "10 minutes", time: 10 },
        { timeText: "15 minutes", time: 15 }
    ];

    this.leavingTime = ko.observable({timeText: "5 minutes", time: 5 });
    this.maxcups = ko.observable(6);
    this.owner = ko.observable('');

  }

  HomeViewModel.prototype.createRun = function(formElement) {
    
    if (!$(formElement).valid())
      return;

  	var self = this;

		$.ajax({
		    type: "POST",
		    url: "/api/coffeerun",
		    data: JSON.stringify({owner: self.owner(), leavingTime: self.leavingTime().time, maxcups: self.maxcups() }),
		    contentType: "application/json; charset=utf-8",
		    dataType: "json",
		    success: function(newRun)  { window.location.href = '/#new-run/' + newRun.id; },
		    failure: function(errMsg) {
		        alert(errMsg);
		    }
		});

  };

  // This runs when the component is torn down. Put here any logic necessary to clean up,
  // for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
  HomeViewModel.prototype.dispose = function() { };
  
  return { viewModel: HomeViewModel, template: homeTemplate };


});
