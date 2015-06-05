define(function (require) {

   var Marionette = require('marionette');
   var nunjucks = require('nunjucks');
   var _ = require('underscore');

   var ResultView = Marionette.ItemView.extend({
      template: _.partial(nunjucks.render, 'search/extract_result.html'),
      className: 'extract'
   });

   var ResultsView = Marionette.CompositeView.extend({
      childView: ResultView,
      childViewContainer: '> .extract-list',
      template: _.partial(nunjucks.render, 'search/extract_result_list.html'),
      events: {
         'click button.show-normalized': function () {
            this.$('button.show-normalized').addClass('active');
            this.$('button.show-original').removeClass('active');
            this.$('> .extract-list')
               .addClass('show-normalized')
               .removeClass('show-original');
         },

         'click button.show-original': function () {
            this.$('button.show-original').addClass('active');
            this.$('button.show-normalized').removeClass('active');
            this.$('.extract-list')
               .addClass('show-original')
               .removeClass('show-normalized');
         }
      }
   });

   return ResultsView;

});
