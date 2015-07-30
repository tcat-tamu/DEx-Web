define(function(require) {

   var Backbone = require('backbone');
   var Radio = require('backbone.radio');

   var ManuscriptRepository = require('./manuscripts/manuscript_repository');
   var ManuscriptApp = require('./manuscripts/manuscripts_app');
   var SearchApp = require('./search/search_app');
   var ExtractRepository = require('./search/extract_repository');
   var LayoutView = require('./search/views/layout_view');

   function initialize(el, config) {
      var extractRepo = new ExtractRepository({
         apiEndpoint: config.apiEndpoint + '/extracts'
      });

      var mssRepo = new ManuscriptRepository({
         apiEndpoint: config.apiEndpoint + '/mss',
         searchRepo: extractRepo
      });

      var layout = new LayoutView({
         el: el
      });

      layout.render();

      var channel = Radio.channel('dex');

      ManuscriptApp.initialize({
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
