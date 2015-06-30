define(function (require) {

   var Backbone = require('backbone');


   var Play = Backbone.Model.extend({

      defaults: {
         title: '',
         playwrights: [],
         editions: []
      }

   });


   return Play;

});
