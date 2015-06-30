define(function(require) {
   var Backbone = require('backbone');
   var Radio = require('backbone.radio');

   var CharacterRepository = require('./characters/character_repository');
   var CharacterApp = require('./characters/characters_app');
   var ExtractRepository = require('./search/extract_repository');
   var SearchController = require('./search/search_controller');
   var LayoutView = require('./search/views/layout_view');

   function initialize(el, config) {
      var charRepo = new CharacterRepository({
         apiEndpoint: config.apiEndpoint + '/chars'
      });

      var extractRepo = new ExtractRepository({
         apiEndpoint: config.apiEndpoint + '/extracts'
      });

      var layout = new LayoutView({
         el: el
      });

      layout.render();

      var channel = Radio.channel('dex');

      CharacterApp.initialize({
         repo: charRepo,
         layout: layout,
         channel: channel
      });

      var searchController = new SearchController({
         layout: layout
      });

      channel.on('show:character', function (character) {
         extractRepo.search({
               facets: {
                  character: [character.get('name')]
               }
            })
            .then(function (results) {
               searchController.showResults(results, {
                  hideFacets: ['character']
               });
            });
      });

      Backbone.history.start();
   }


   return {
      initialize: initialize
   };

});
