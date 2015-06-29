define(function (require) {

   var Marionette = require('marionette');
   var nunjucks = require('nunjucks');
   var _ = require('underscore');


   var ResultLayoutView = Marionette.LayoutView.extend({
      template: _.partial(nunjucks.render, 'search/layout.html'),

      ui: {
         formRegion: '> .row > .col-md-4 > .form',
         facetsRegion: '> .row > .col-md-4 > .facets',
         contentRegion: '> .row > .col-md-8 > .meta-content',
         paginationRegion: '> .row > .col-md-8 > .toolbar > .pagination',
         resultsRegion: '> .row > .col-md-8 > .result-list',

         normButton: '> .row > .col-md-8 > .toolbar button.show-normalized',
         origButton: '> .row > .col-md-8 > .toolbar button.show-original'
      },

      regions: {
         form: '@ui.formRegion',
         facets: '@ui.facetsRegion',
         content: '@ui.contentRegion',
         pagination: '@ui.paginationRegion',
         results: '@ui.resultsRegion'
      },

      events: {
         'click @ui.normButton': function () {
            this.ui.normButton.addClass('active');
            this.ui.origButton.removeClass('active');
            this.ui.resultsRegion
               .addClass('show-normalized')
               .removeClass('show-original');
         },

         'click @ui.origButton': function () {
            this.ui.origButton.addClass('active');
            this.ui.normButton.removeClass('active');
            this.ui.resultsRegion
               .addClass('show-original')
               .removeClass('show-normalized');
         }
      }
   });

   return ResultLayoutView;

});
