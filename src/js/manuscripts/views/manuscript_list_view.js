define(function (require) {

   var Marionette = require('marionette');
   var nunjucks = require('nunjucks');
   var _ = require('underscore');


   var ManuscriptItemView = Marionette.ItemView.extend({
      tagName: 'li',
      template: _.partial(nunjucks.render, 'manuscripts/list_item.html'),

      events: {
         click: function (evt) {
            evt.preventDefault();
            this.trigger('click', this.model);
         }
      }
   });


   var ManuscriptListView = Marionette.CollectionView.extend({
      tagName: 'ul',
      childView: ManuscriptItemView
   });


   return ManuscriptListView;

});
