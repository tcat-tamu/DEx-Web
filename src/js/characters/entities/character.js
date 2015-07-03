define(function (require) {

   var Backbone = require('backbone');


   var Character = Backbone.Model.extend({

      defaults: {
         name: '',
         plays: []
      }

   });


   var CharacterCollection = Backbone.Collection.extend({
      model: Character,
      comparator: 'name'
   });


   return {
      Character: Character,
      CharacterCollection: CharacterCollection
   };

});
