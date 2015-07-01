define(function (require) {

   var Backbone = require('backbone');
   var Marionette = require('marionette');
   var Radio = require('backbone.radio');

   var UploadApp = require('./upload/upload_app');


   function initialize(el, config) {
      var region = new Marionette.Region({ el: el });

      var channel = Radio.channel('dex');

      UploadApp.initialize({
         region: region,
         channel: channel,
         apiEndpoint: config.apiEndpoint + '/upload'
      });

      Backbone.history.start();
   }


   return {
      initialize: initialize
   };

});
