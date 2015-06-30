define(function (require) {

   var Backbone = require('backbone');


   var Playwright = Backbone.Model.extend({

      defaults: {
         names: [],
      }

   });


   return Playwright;

});
