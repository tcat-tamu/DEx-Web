define(function (require) {

   var Marionette = require('marionette');
   var _ = require('underscore');

   var LayoutView = require('./search/views/layout_view');
   var BasicFormView = require('./search/views/basic_form_view');
   var SearchController = require('./search/search_controller');
   var ExtractRepository = require('./search/extract_repository');


   function initialize(el, config) {
      var repo = new ExtractRepository({
         apiEndpoint: config.apiEndpoint + '/extracts'
      });

      var layout = new LayoutView({
         el: el
      });

      layout.render();


      function handleError(err) {
         console.error(err);
         layout.getRegion('results').show(new Marionette.ItemView({
            className: 'alert alert-danger',
            template: _.constant(err || 'An unknown error occurred.')
         }));
      }

      var controller = new SearchController({
         layout: layout
      });


      var formView = new BasicFormView();

      formView.on('search', function (query) {
         repo.search(query)
            .then(function (results) {
               controller.showResults(results);
            })
            .catch(handleError);
      });

      formView.on('clear', function () {
         controller.clearResults();
      });

      layout.getRegion('form').show(formView);

      // populate form with default "query-all"
      repo.search()
         .then(function (results) {
            controller.showResults(results);
         })
         .catch(handleError);
   }


   return {
      initialize: initialize
   };

});
