define(function (require) {

   var Backbone = require('backbone');
   var Radio = require('backbone.radio');

   var SearchApp = require('./search/search_app');
   var ExtractRepository = require('./search/extract_repository');
   var LayoutView = require('./search/views/layout_view');
   var AdvancedFormView = require('./search/views/advanced_form_view');


   function initialize(el, config) {
      var repo = new ExtractRepository({
         apiEndpoint: config.apiEndpoint + '/extracts'
      });

      var layout = new LayoutView({
         el: el
      });

      layout.render();

      var channel = Radio.channel('dex');

      SearchApp.initialize({
         repo: repo,
         resultsRegion: layout.getRegion('results'),
         paginationRegion: layout.getRegion('pagination'),
         facetsRegion: layout.getRegion('facets'),
         channel: channel
      });


      var formView = new AdvancedFormView();

      formView.on('search', function (params) {
         channel.trigger('search:advanced', params);
      });

      formView.on('clear', function () {
         channel.trigger('search:clear');
      });

      layout.getRegion('form').show(formView);


      Backbone.history.start();
   }


   return {
      initialize: initialize
   };

});
