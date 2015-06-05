define(function (require) {

   var $ = require('jquery');
   var ResultsView = require('./search/views/results_view');
   var ResultTypes = require('./search/entities/extract_proxy');

   var ExtractProxyCollection = ResultTypes.ExtractProxyCollection;

   $('#advancedSearch').on('submit', function (evt) {
      evt.preventDefault();

      var query = $('input#keyword').val();

      $.ajax({
         method: 'GET',
         dataType: 'json',
         url: '/api/dex/extracts/search',
         data: {
            q: query
         },
         success: function (searchResponse) {
            var results = new ExtractProxyCollection(searchResponse.results);

            var resultsView = new ResultsView({
               collection: results
            });

            $('#main').html(resultsView.render().el);
         }
      });
   });
});
