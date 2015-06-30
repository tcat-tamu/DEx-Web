define(function (require) {

   var Backbone = require('backbone');


   var Character = Backbone.Model.extend({

      defaults: {
         name: '',
         plays: []
      }

   });


   return Character;

});
