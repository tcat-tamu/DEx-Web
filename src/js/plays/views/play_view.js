define(function (require) {

   var Marionette = require('marionette');
   var nunjucks = require('nunjucks');
   var _ = require('underscore');


   var PlayView = Marionette.ItemView.extend({
      template: _.partial(nunjucks.render, 'plays/play.html')
   });


   return PlayView;

});
