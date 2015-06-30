define(function (require) {

   var Marionette = require('marionette');
   var nunjucks = require('nunjucks');
   var _ = require('underscore');


   var PlaywrightView = Marionette.ItemView.extend({
      template: _.partial(nunjucks.render, 'playwrights/playwright.html')
   });


   return PlaywrightView;

});
