define(function (require) {

   var $ = require('jquery');
   var LayoutView = require('./search/views/layout_view');
   var ResultsView = require('./search/views/results_view');
   var PaginatorView = require('./search/views/paginator_view');
   // var ResultTypes = require('./search/entities/extract_proxy');

   var ExtractRepository = require('./search/extract_repository');


   var repo = new ExtractRepository({
      apiEndpoint: '/api/dex/extracts'
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

      layout.getRegion('results').show(resultsView);
      layout.getRegion('pagination').show(paginatorView);

   }

   $('#advancedSearch').on('submit', function (evt) {
      evt.preventDefault();

      var query = $('input#keyword').val();

      repo.search(query, {
         shelfmark: $('input#shelfmark').val(),
         playwright: $('input#playwright').val(),
         play: $('input#play').val(),
         character: $('input#character').val()
      }).then(showResults);
   });
});
