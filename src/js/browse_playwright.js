define(function(require) {

   var Backbone = require('backbone');
   var Radio = require('backbone.radio');

   var PlaywrightRepository = require('./playwrights/playwright_repository');
   var PlaywrightApp = require('./playwrights/playwrights_app');
   var SearchApp = require('./search/search_app');
   var ExtractRepository = require('./search/extract_repository');
   var LayoutView = require('./search/views/layout_view');

   function initialize(el, config) {
      var extractRepo = new ExtractRepository({
         apiEndpoint: config.apiEndpoint + '/extracts'
      });

      var mssRepo = new PlaywrightRepository({
         apiEndpoint: config.apiEndpoint + '/pws',
         searchRepo: extractRepo
      });

      var layout = new LayoutView({
         el: el
      });

      layout.render();

      var channel = Radio.channel('dex');

      PlaywrightApp.initialize({
         repo: mssRepo,
         region: layout.getRegion('content'),
         channel: channel
      });

      SearchApp.initialize({
         repo: extractRepo,
         resultsRegion: layout.getRegion('results'),
         paginationRegion: layout.getRegion('pagination'),
         facetsRegion: layout.getRegion('facets'),
         channel: channel
      });

      Backbone.history.start();
   }


   return {
      initialize: initialize
   };

});
