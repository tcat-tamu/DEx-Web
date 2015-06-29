define(function(require) {
   var $ = require('jquery');
   var _ = require('underscore');
   var product = require('cartesian-product');

   $(function () {
      var SORT_CLASSES = _.map(product(['alpha', 'count'], ['asc', 'desc']), function (xs) { return 'sort-' + xs.join('-'); });

      var $groups = $('.facet-group');

      _.each(SORT_CLASSES, function (className) {
         $groups.find('.icon-' + className).on('click', function (evt) {
            evt.preventDefault();
            evt.stopPropagation();

            $(this).parents('.facet-group')
               .removeClass(SORT_CLASSES.join(' '))
               .addClass(className);
         });
      });
   });


   var Backbone = require('backbone');
   var Radio = require('backbone.radio');
   var LayoutView = require('./search/views/layout_view');
   var ManuscriptRepository = require('./manuscripts/manuscript_repository');
   var ExtractRepository = require('./search/extract_repository');
   var ManuscriptApp = require('./manuscripts/manuscripts_app');
   var SearchController = require('./search/search_controller');

   function initialize(el, config) {
      var mssRepo = new ManuscriptRepository({
         apiEndpoint: config.apiEndpoint + '/mss'
      });

      var extractRepo = new ExtractRepository({
         apiEndpoint: config.apiEndpoint + '/extracts'
      });

      var layout = new LayoutView({
         el: el
      });

      layout.render();

      var channel = Radio.channel('dex');

      ManuscriptApp.initialize({
         repo: mssRepo,
         layout: layout,
         channel: channel
      });

      var searchController = new SearchController({
         layout: layout
      });

      channel.on('show:manuscript', function (manuscript) {
         extractRepo.search({
               facets: {
                  manuscript: [ manuscript.get('title') ]
               }
            })
            .then(function (results) {
               searchController.showResults(results, {
                  hideFacets: ['manuscript']
               });
            });
      });

      Backbone.history.start();
   }


   return {
      initialize: initialize
   };

});
