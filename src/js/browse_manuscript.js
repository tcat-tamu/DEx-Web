define(function(require) {
   var Backbone = require('backbone');
   var Radio = require('backbone.radio');
   var _ = require('underscore');

   var ManuscriptRepository = require('./manuscripts/manuscript_repository');
   var ManuscriptApp = require('./manuscripts/manuscripts_app');
   var ExtractRepository = require('./search/extract_repository');
   var SearchController = require('./search/search_controller');
   var LayoutView = require('./search/views/layout_view');

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
                  manuscript: [manuscript.get('title')]
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
