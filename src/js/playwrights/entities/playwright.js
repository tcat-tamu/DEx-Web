define(function (require) {

   var Backbone = require('backbone');


   var Playwright = Backbone.Model.extend({

      defaults: {
         names: []
      },

      getName: function () {
         var names = this.get('names');
         return names.length === 0 ? 'unknown name' : names[0];
      }

   });


   return Playwright;

});
