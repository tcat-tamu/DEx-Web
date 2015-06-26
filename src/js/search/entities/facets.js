define(function (require) {

   var Backbone = require('backbone');
   var _ = require('underscore');


   var FacetItem = Backbone.Model.extend({
      defaults: {
         label: '',
         count: 0,
         selected: false
      }
   });

   var FacetItemCollection = Backbone.Collection.extend({ model: FacetItem });

   var FacetField = Backbone.Model.extend({
      defaults: function () {
         return {
            field: '',
            label: '',
            items: new FacetItemCollection()
         };
      },

      initialize: function (attrs) {
         if (!attrs.field) {
            throw new TypeError('no [field] attribute provided');
         }

         this.listenTo(this.get('items'), 'change:selected', function (item) {
            this.trigger('change:items:selected', this, item);
         });
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
      },

      getSelected: function () {
         return this.get('items').where({ selected: true });
      }
   });

   var FacetFieldCollection = Backbone.Collection.extend({
      model: FacetField,

      getSelected: function () {
         var selected = {};
         this.each(function (field) {
            selected[field.get('field')] = _.chain(field.getSelected())
               .invoke('toJSON')
               .pluck('label')
               .value();
         });
         return selected;
      }
   });


   return {
      FacetItem: FacetItem,
      FacetItemCollection: FacetItemCollection,
      FacetField: FacetField,
      FacetFieldCollection: FacetFieldCollection
   };

});
