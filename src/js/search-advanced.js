define(function (require) {

   var Marionette = require('marionette');
   var _ = require('underscore');

   var LayoutView = require('./search/views/layout_view');
   var SearchController = require('./search/search_controller');
   var AdvancedFormView = require('./search/views/advanced_form_view');

   var ExtractRepository = require('./search/extract_repository');


   function initialize(el, config) {
      var repo = new ExtractRepository({
         apiEndpoint: config.apiEndpoint
      });

      var layout = new LayoutView({
         el: el
      });

      layout.render();

      var controller = new SearchController({
         layout: layout
      });


      var formView = new AdvancedFormView();

      formView.on('search', function (params) {
         repo.search(params)
            .then(function (results) {
               controller.showResults(results);
            })
            .catch(function (err) {
               console.error(err);
               layout.getRegion('results').show(new Marionette.ItemView({
                  className: 'alert alert-danger',
                  template: _.constant(err || 'An unknown error occurred.')
               }));
            });
      });

      formView.on('clear', function () {
         controller.clearResults();
      });

      layout.getRegion('form').show(formView);
   }


   return {
      initialize: initialize
   };

});
