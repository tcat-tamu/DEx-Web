define(function (require) {

   var _ = require('underscore');
   var RestClient = require('rest_client');

   var ExtractProxyCollection = require('./entities/extract_proxy').ExtractProxyCollection;
   var FacetFieldCollection = require('./entities/facets').FacetFieldCollection;


   function ExtractRepository(options) {
      var opts = _.defaults(_.clone(options || {}), {});

      if (!opts.apiEndpoint) {
         throw new TypeError('no API endpoint provided');
      }

      _.extend(this, _.pick(opts, 'apiEndpoint'));
   }

   _.extend(ExtractRepository.prototype, {

      search: function (options) {
         var opts = _.defaults(options || {}, {
            shelfmark: '',
            playwright: '',
            play: '',
            character: '',
            facets: {},
            page: 1,
            resultsPerPage: 20,
         });

         opts.facets = _.defaults(opts.facets || {}, {
            manuscript: [],
            playwright: [],
            play: [],
            character: []
         });

         var queryParams = {
            a: query,
            ms: opts.shelfmark,
            'f.ms': opts.facets.manuscript,
            pw: opts.playwright,
            'f.pw': opts.facets.playwright,
            pl: opts.play,
            'f.pl': opts.facets.play,
            sp: opts.character,
            'f.sp': opts.facets.character,
            p: opts.page,
            n: opts.resultsPerPage
         };

         var repo = this;

         return RestClient.get(this.apiEndpoint + '/search', queryParams).then(function (response) {
            return {
               currentPage: opts.page,
               numPages: Math.ceil(response.numFound / response.numResultsPerPage),
               results: new ExtractProxyCollection(response.results),

               facets: new FacetFieldCollection(_.map(response.facets, function (items, field) {
                  return {
                     field: (field === 'speaker') ? 'character' : field,
                     items: items
                  };
               }), { parse: true }),

               getPage: function (p) {
                  return repo.search(_.extend({}, opts, { page: p }));
               },

               facet: function (facets) {
                  return repo.search(_.extend({}, opts, { page: 1, facets: facets }));
               }
            };
         });
      }

   });

   return ExtractRepository;

});
