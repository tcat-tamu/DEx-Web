define(function (require) {

   var Marionette = require('marionette');
   var $ = require('jquery');

   var LayoutView = require('./search/views/layout_view');
   var ResultsView = require('./search/views/results_view');
   var PaginatorView = require('./search/views/paginator_view');
   var FacetsView = require('./search/views/facets_view');
   // var ResultTypes = require('./search/entities/extract_proxy');

   var ExtractRepository = require('./search/extract_repository');


   var repo = new ExtractRepository({
      apiEndpoint: '/api/dex/extracts'
   });

   var facetRegion = new Marionette.Region({
      el: '#facets'
   });

   var layout = new LayoutView({
      el: '#main'
   });

   layout.render();

   function showResults(searchResponse) {
      var resultsView = new ResultsView({
         collection: searchResponse.results
      });

      var paginatorView = new PaginatorView({
         current: searchResponse.currentPage,
         total: searchResponse.numPages,
         padding: 3
      });

      paginatorView.on('page', function (page) {
         searchResponse.getPage(page).then(showResults);
      });

      searchResponse.facets.on('change:items:selected', function () {
         searchResponse.facet(searchResponse.facets.getSelected()).then(showResults);
      });

      layout.getRegion('results').show(resultsView);
      layout.getRegion('pagination').show(paginatorView);


      var facetsView = new FacetsView({
         collection: searchResponse.facets
      });

      facetRegion.show(facetsView);
   }

   $('#basicSearch').on('submit', function (evt) {
      evt.preventDefault();

      repo.search($('input#search').val()).then(showResults);
   });

   // populate form with default "query-all"
   repo.search().then(showResults);
});
