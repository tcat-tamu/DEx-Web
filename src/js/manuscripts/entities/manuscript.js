define(function (require) {

   var Backbone = require('backbone');


   var Manuscript = Backbone.Model.extend({

      defaults: {
         title: '',
         author: '',
         downloadUrl: null
      }

   });

   var ManuscriptCollection = Backbone.Collection.extend({
      model: Manuscript,
      comparator: 'title'
   });


   return {
      Manuscript: Manuscript,
      ManuscriptCollection: ManuscriptCollection
   };

});
