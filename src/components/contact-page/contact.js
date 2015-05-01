define(['knockout', 'text!./contact.html'], function(ko, templateMarkup) {

  function ContactPage(params) {


  	
    this.message = ko.observable('Hello there! ' + params);
    this.clickcount = 0;
  }

  ContactPage.prototype.doSomething = function() {
  	this.clickcount++;
    this.message('I have been cicked ' + this.clickcount + ' times.');
  };

  // This runs when the component is torn down. Put here any logic necessary to clean up,
  // for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
  ContactPage.prototype.dispose = function() { };
  
  return { viewModel: ContactPage, template: templateMarkup };

});
