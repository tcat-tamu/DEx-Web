define(function (require) {

   var Marionette = require('marionette');
   var nunjucks = require('nunjucks');
   var _ = require('underscore');


   var ResultLayoutView = Marionette.LayoutView.extend({
      template: _.partial(nunjucks.render, 'search/extract_result_list.html'),

      regions: {
         pagination: '> .toolbar > .pagination',
         results: '> .extract-list'
      },

      events: {
         'click button.show-normalized': function () {
            this.$('> .toolbar button.show-normalized').addClass('active');
            this.$('> .toolbar button.show-original').removeClass('active');
            this.$('> .extract-list')
               .addClass('show-normalized')
               .removeClass('show-original');
         },

         'click button.show-original': function () {
            this.$('button.show-original').addClass('active');
            this.$('button.show-normalized').removeClass('active');
            this.$('> .extract-list')
               .addClass('show-original')
               .removeClass('show-normalized');
         }
      }
   });

   return ResultLayoutView;

});
