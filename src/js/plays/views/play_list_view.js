define(function (require) {

   var Marionette = require('marionette');
   var nunjucks = require('nunjucks');
   var _ = require('underscore');


   var PlayItemView = Marionette.ItemView.extend({
      tagName: 'li',
      template: _.partial(nunjucks.render, 'plays/list_item.html'),

      events: {
         click: function (evt) {
            evt.preventDefault();
            this.trigger('click', this.model);
         }
      }
   });


   var PlayListView = Marionette.CollectionView.extend({
      tagName: 'ul',
      childView: PlayItemView
   });


   return PlayListView;

});
