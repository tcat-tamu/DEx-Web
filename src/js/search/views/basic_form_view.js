define(function (require) {

   var Marionette = require('marionette');
   var nunjucks = require('nunjucks');
   var _ = require('underscore');


   var AdvancedFormView = Marionette.ItemView.extend({
      tagName: 'form',
      template: _.partial(nunjucks.render, 'search/basic_form.html'),

      ui: {
         query: 'input[name=search]',

         resetButton: 'button[type=reset]'
      },

      events: {
         submit: function (evt) {
            evt.preventDefault();
            this.trigger('search', this.getQuery());
         },

         'click @ui.resetButton': function () {
            this.trigger('clear');
         }
      },

      getQuery: function () {
         return this.ui.query.val();
      }
   });


   return AdvancedFormView;

});
