define(function(require) {

   var Backbone = require('backbone');
   var Marionette = require('marionette');
   var Radio = require('backbone.radio');

   var BibliographyApp = require('./bibliography/bibliography_app');
   var PlaysRepository = require('./plays/play_repository');

   function initialize(el, config) {
      var repo = new PlaysRepository({
         apiEndpoint: config.apiEndpoint + '/plays'
      });

      var region = new Marionette.Region({
         el: el
      });

      var channel = Radio.channel('dex');

      BibliographyApp.initialize({
         repo: repo,
         region: region,
         channel: channel
      });

      Backbone.history.start();
   }


   return {
      initialize: initialize
   };

});
