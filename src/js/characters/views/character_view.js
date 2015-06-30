define(function (require) {

   var Marionette = require('marionette');
   var nunjucks = require('nunjucks');
   var _ = require('underscore');


   var CharacterView = Marionette.ItemView.extend({
      template: _.partial(nunjucks.render, 'characters/character.html')
   });


   return CharacterView;

});
