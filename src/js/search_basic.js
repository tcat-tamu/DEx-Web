define(function (require) {

   var Backbone = require('backbone');
   var Radio = require('backbone.radio');

   var SearchApp = require('./search/search_app');
   var ExtractRepository = require('./search/extract_repository');
   var LayoutView = require('./search/views/layout_view');
   var BasicFormView = require('./search/views/basic_form_view');


   function initialize(el, config) {
      var repo = new ExtractRepository({
         apiEndpoint: config.apiEndpoint + '/extracts'
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
         repo: repo,
         resultsRegion: layout.getRegion('results'),
         paginationTopRegion: layout.getRegion('paginationTop'),
         paginationBottomRegion: layout.getRegion('paginationBottom'),
         facetsRegion: layout.getRegion('facets'),
         channel: channel
      });


      var formView = new BasicFormView();

      formView.on('search', function (query) {
         channel.trigger('search:basic', query);
      });

      formView.on('clear', function () {
         channel.trigger('search:clear');
      });

      layout.getRegion('form').show(formView);

      // populate form with default "query-all"
      channel.trigger('search:basic', '');


      Backbone.history.start();
   }

   return {
      initialize: initialize
   };

});
