define(['knockout', 'text!./new-run.html'], function(ko, templateMarkup) {

  function NewRun(route) {

  	this.runaddress = ko.observable(document.location.origin + '/#/contact-page/' + route.id);


  }

  // This runs when the component is torn down. Put here any logic necessary to clean up,
  // for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
  NewRun.prototype.dispose = function() { };
  
  return { viewModel: NewRun, template: templateMarkup };

});
