define(function (require) {

   var _ = require('underscore');
   var RestClient = require('rest_client');

   var ExtractProxyCollection = require('./entities/extract_proxy').ExtractProxyCollection;

   function ExtractRepository(options) {
      var opts = _.defaults(options || {}, {});

      this.apiEndpoint = opts.apiEndpoint;

      if (!this.apiEndpoint) {
         throw new TypeError('no API endpoint provided');
      }
   }

   _.extend(ExtractRepository.prototype, {

      search: function (query, filters, page, resultsPerPage) {
         var opts = _.defaults(filters || {}, {
            shelfmark: '',
            playwright: '',
            play: '',
            character: ''
         });

         var queryParams = {
            q: query,
            shelfmark: opts.shelfmark,
            playwright: opts.playwright,
            play: opts.play,
            speaker: opts.character,
            page: page || 1,
            numResults: resultsPerPage || 20
         };

         var repo = this;

         return RestClient.get(this.apiEndpoint + '/search', queryParams).then(function (response) {
            return {
               currentPage: page,
               numPages: Math.ceil(response.numFound / response.numResultsPerPage),
               results: new ExtractProxyCollection(response.results),

               getPage: function (p) {
                  return repo.search(query, filters, p, response.numResultsPerPage);
               }
            };
         });
      }

   });

   return ExtractRepository;

});
