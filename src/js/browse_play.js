define(function(require) {
   var Backbone = require('backbone');
   var Radio = require('backbone.radio');

   var PlayRepository = require('./plays/play_repository');
   var PlayApp = require('./plays/plays_app');
   var ExtractRepository = require('./search/extract_repository');
   var SearchController = require('./search/search_controller');
   var LayoutView = require('./search/views/layout_view');

   function initialize(el, config) {
      var playsRepo = new PlayRepository({
         apiEndpoint: config.apiEndpoint + '/plays'
      });

      var extractRepo = new ExtractRepository({
         apiEndpoint: config.apiEndpoint + '/extracts'
      });

      var layout = new LayoutView({
         el: el
      });

      layout.render();

      var channel = Radio.channel('dex');

      PlayApp.initialize({
         repo: playsRepo,
         layout: layout,
         channel: channel
      });

      var searchController = new SearchController({
         layout: layout
      });

      channel.on('show:play', function (play) {
         extractRepo.search({
               facets: {
                  play: [play.get('title')]
               }
            })
            .then(function (results) {
               searchController.showResults(results, {
                  hideFacets: ['play']
               });
            });
      });

      Backbone.history.start();
   }


   return {
      initialize: initialize
   };

});
