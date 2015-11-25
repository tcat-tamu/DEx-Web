define(function(require) {

   var Backbone = require('backbone');
   var Radio = require('backbone.radio');

   var CharacterRepository = require('./characters/character_repository');
   var CharacterApp = require('./characters/characters_app');
   var SearchApp = require('./search/search_app');
   var ExtractRepository = require('./search/extract_repository');
   var LayoutView = require('./search/views/layout_view');

   function initialize(el, config) {
      var extractRepo = new ExtractRepository({
         apiEndpoint: config.apiEndpoint + '/extracts'
      });

      var charRepo = new CharacterRepository({
         apiEndpoint: config.apiEndpoint + '/chars',
         searchRepo: extractRepo
      });

      var layout = new LayoutView({
         el: el
      });

      var channel = Radio.channel('dex');

      layout.on('setPageSize', function(data) {
        channel.trigger('setPageSize', data);
      });

      layout.render();

      SearchApp.initialize({
         repo: extractRepo,
         resultsRegion: layout.getRegion('results'),
         paginationTopRegion: layout.getRegion('paginationTop'),
         paginationBottomRegion: layout.getRegion('paginationBottom'),
         facetsRegion: layout.getRegion('facets'),
         channel: channel
      });

      CharacterApp.initialize({
         repo: charRepo,
         region: layout.getRegion('content'),
         channel: channel
      });

      Backbone.history.start();
   }


   return {
      initialize: initialize
   };

});
