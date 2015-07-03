define(function (require) {

   var Marionette = require('marionette');
   var nunjucks = require('nunjucks');
   var _ = require('underscore');


   var CharacterItemView = Marionette.ItemView.extend({
      tagName: 'li',
      template: _.partial(nunjucks.render, 'characters/list_item.html'),

      events: {
         click: function (evt) {
            evt.preventDefault();
            this.trigger('click', this.model);
         }
      }
   });


   var CharacterListView = Marionette.CollectionView.extend({
      tagName: 'ul',
      childView: CharacterItemView
   });


   return CharacterListView;

});
