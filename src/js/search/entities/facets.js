define(function (require) {

   var Backbone = require('backbone');


   var FacetItem = Backbone.Model.extend({
      defaults: {
         label: '',
         count: 0
      }
   });

   var FacetItemCollection = Backbone.Collection.extend({ model: FacetItem });

   var FacetField = Backbone.Model.extend({
      defaults: function () {
         return {
            label: '',
            items: new FacetItemCollection()
         };
      },

      parse: function (json) {
         if (json.items) {
            json.items = new FacetItemCollection(json.items, { parse: true });
         }

         return json;
      },

      toJSON: function () {
         var json = Backbone.Model.prototype.toJSON.apply(this, arguments);

         json.items = json.items.toJSON();

         return json;
      }
   });


   return {
      FacetItem: FacetItem,
      FacetItemCollection: FacetItemCollection,
      FacetField: FacetField,
      FacetFieldCollection: Backbone.Collection.extend({ model: FacetField })
   };

});
