define(function(require) {

   var Backbone = require('backbone');
   var Radio = require('backbone.radio');

   var PlayRepository = require('./plays/play_repository');
   var PlayApp = require('./plays/plays_app');
   var SearchApp = require('./search/search_app');
   var ExtractRepository = require('./search/extract_repository');
   var LayoutView = require('./search/views/layout_view');

   function initialize(el, config) {
      var extractRepo = new ExtractRepository({
         apiEndpoint: config.apiEndpoint + '/extracts'
      });

      var playsRepo = new PlayRepository({
         apiEndpoint: config.apiEndpoint + '/plays',
         searchRepo: extractRepo
      });

      var layout = new LayoutView({
         el: el
      });

      layout.render();

      var channel = Radio.channel('dex');

      PlayApp.initialize({
         repo: playsRepo,
         region: layout.getRegion('content'),
         channel: channel
      });

      SearchApp.initialize({
         repo: extractRepo,
         resultsRegion: layout.getRegion('results'),
         paginationTopRegion: layout.getRegion('paginationTop'),
         paginationBottomRegion: layout.getRegion('paginationBottom'),
         facetsRegion: layout.getRegion('facets'),
         channel: channel
      });

      Backbone.history.start();
   }


   return {
      initialize: initialize
   };

});
