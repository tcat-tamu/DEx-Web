define(function (require) {

   var Marionette = require('marionette');
   var nunjucks = require('nunjucks');
   var _ = require('underscore');


   var BibliographyView = Marionette.ItemView.extend({
      template: function (ctx) {
         return _.partial(nunjucks.render, 'bibliography/bibliography.html')(ctx);
      },

      className: 'bibliography'
   });

   return BibliographyView;

});
