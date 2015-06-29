define(function (require) {

   var Marionette = require('marionette');
   var nunjucks = require('nunjucks');
   var _ = require('underscore');


   var ManuscriptView = Marionette.ItemView.extend({
      template: _.partial(nunjucks.render, 'manuscripts/manuscript.html')
   });


   return ManuscriptView;

});
