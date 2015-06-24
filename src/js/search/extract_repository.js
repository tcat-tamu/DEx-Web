define(function (require) {

   var _ = require('underscore');
   var RestClient = require('rest_client');

   var ExtractProxyCollection = require('./entities/extract_proxy').ExtractProxyCollection;
   var FacetFieldCollection = require('./entities/facets').FacetFieldCollection;


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
            a: query,
            ms: opts.shelfmark,
            pw: opts.playwright,
            pl: opts.play,
            sp: opts.character,
            p: page || 1,
            n: resultsPerPage || 20
         };

         var repo = this;

         return RestClient.get(this.apiEndpoint + '/search', queryParams).then(function (response) {
            return {
               currentPage: page,
               numPages: Math.ceil(response.numFound / response.numResultsPerPage),
               results: new ExtractProxyCollection(response.results),

               facets: new FacetFieldCollection(_.map(response.facets, function (items, field) {
                  return {
                     field: field,
                     items: items
                  };
               }), { parse: true }),

               getPage: function (p) {
                  return repo.search(query, filters, p, response.numResultsPerPage);
               }
            };
         });
      }

   });

   return ExtractRepository;

});
