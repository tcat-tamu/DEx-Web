define(function (require) {

   var Backbone = require('backbone');


   var Play = Backbone.Model.extend({

      defaults: {
         title: '',
         playwrights: [],
         editions: []
      }

   });


   var PlayCollection = Backbone.Collection.extend({
      model: Play,
      comparator: 'title'
   });


   return {
      Play: Play,
      PlayCollection: PlayCollection
   };

});
