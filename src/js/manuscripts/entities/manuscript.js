define(function (require) {

   var Backbone = require('backbone');


   var Manuscript = Backbone.Model.extend({

      defaults: {
         title: '',
         author: ''
      }

   });


   return Manuscript;

});
