define(function (require) {

   var Marionette = require('marionette');
   var nunjucks = require('nunjucks');
   var _ = require('underscore');


   var AdvancedFormView = Marionette.ItemView.extend({
      tagName: 'form',
      template: _.partial(nunjucks.render, 'search/advanced_form.html'),

      ui: {
         shelfmark: 'input[name=shelfmark]',
         playwright: 'input[name=playwright]',
         play: 'input[name=play]',
         character: 'input[name=character]',
         query: 'input[name=keyword]',

         resetButton: 'button[type=reset]'
      },

      events: {
         submit: function (evt) {
            evt.preventDefault();
            this.trigger('search', this.getSearchParams());
         },

         'click @ui.resetButton': function () {
            this.trigger('clear');
         }
      },

      getSearchParams: function () {
         return {
            shelfmark: this.ui.shelfmark.val(),
            playwright: this.ui.playwright.val(),
            play: this.ui.play.val(),
            character: this.ui.character.val(),
            query: this.ui.query.val()
         };
      }
   });


   return AdvancedFormView;

});
