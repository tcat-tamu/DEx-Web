define(function (require) {

   var Marionette = require('marionette');
   var nunjucks = require('nunjucks');
   var _ = require('underscore');

   var ResultView = Marionette.ItemView.extend({
      template: _.partial(nunjucks.render, 'search/extract_result.html'),
      className: 'extract'
   });

   var NoResultsView = Marionette.ItemView.extend({
      template: _.constant('No Results Found'),
      className: 'alert alert-info'
   });

   var ResultsView = Marionette.CollectionView.extend({
      childView: ResultView,
      emptyView: NoResultsView
   });

   return ResultsView;

});
