define(function(require) {
   var Backbone = require('backbone');
   var Radio = require('backbone.radio');

   var PlaywrightRepository = require('./playwrights/playwright_repository');
   var PlaywrightApp = require('./playwrights/playwrights_app');
   var ExtractRepository = require('./search/extract_repository');
   var SearchController = require('./search/search_controller');
   var LayoutView = require('./search/views/layout_view');

   function initialize(el, config) {
      var mssRepo = new PlaywrightRepository({
         apiEndpoint: config.apiEndpoint + '/pws'
      });

      var extractRepo = new ExtractRepository({
         apiEndpoint: config.apiEndpoint + '/extracts'
      });

      var layout = new LayoutView({
         el: el
      });

      layout.render();

      var channel = Radio.channel('dex');

      PlaywrightApp.initialize({
         repo: mssRepo,
         layout: layout,
         channel: channel
      });

      var searchController = new SearchController({
         layout: layout
      });

      channel.on('show:playwright', function (playwright) {
         extractRepo.search({
               facets: {
                  playwright: [playwright.getName()]
               }
            })
            .then(function (results) {
               searchController.showResults(results, {
                  hideFacets: ['playwright']
               });
            });
      });

      Backbone.history.start();
   }


   return {
      initialize: initialize
   };

});
