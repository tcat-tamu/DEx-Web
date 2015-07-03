define(function (require) {

   var Marionette = require('marionette');
   var nunjucks = require('nunjucks');
   var _ = require('underscore');


   var PlaywrightItemView = Marionette.ItemView.extend({
      tagName: 'li',
      template: _.partial(nunjucks.render, 'playwrights/list_item.html'),

      templateHelpers: function () {
         return {
            name: this.model.getName()
         };
      },

      events: {
         click: function (evt) {
            evt.preventDefault();
            this.trigger('click', this.model);
         }
      }
   });


   var PlaywrightListView = Marionette.CollectionView.extend({
      tagName: 'ul',
      childView: PlaywrightItemView
   });


   return PlaywrightListView;

});
