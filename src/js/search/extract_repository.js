define(function (require) {

   var _ = require('underscore');
   var RestClient = require('rest_client');

   var ExtractProxyCollection = require('./entities/extract_proxy').ExtractProxyCollection;
   var FacetFieldCollection = require('./entities/facets').FacetFieldCollection;


   function ExtractRepository(options) {
      var opts = _.defaults(_.clone(options) || {}, {});

      if (!opts.apiEndpoint) {
         throw new TypeError('no API endpoint provided');
      }

      _.extend(this, _.pick(opts, 'apiEndpoint'));
   }

   _.extend(ExtractRepository.prototype, {

      getAll: function (field) {
         return this.search({
               resultsPerPage: 0,
               numFacets: -1
            })
            .then(function (response) {
               var facetField = response.facets.findWhere({
                  field: field
               });

               if (!facetField) {
                  return null;
               }

               return facetField.get('items');
            });
      },

      getCharacters: function () {
         return this.getAll('character');
      },

      getManuscripts: function () {
         return this.getAll('manuscript');
      },

      getPlays: function () {
         return this.getAll('play');
      },

      getPlaywrights: function () {
         return this.getAll('playwright');
      },

      search: function (options) {
         options = options || '';

         // basic query alternate usage
         if (_.isString(options)) {
            options = {
               basic: true,
               query: options
            };
         }

         var opts = _.defaults(_.clone(options) || {}, {
            query: '',
            shelfmark: '',
            playwright: '',
            play: '',
            character: '',
            facets: null, // defaults set later
            numFacets: 10,
            page: 1,
            resultsPerPage: 20,
            basic: false
         });

         opts.facets = _.defaults(_.clone(opts.facets) || {}, {
            manuscript: [],
            playwright: [],
            play: [],
            character: []
         });

         var queryParams = {
            ms: opts.shelfmark,
            'f.ms': opts.facets.manuscript,
            pw: opts.playwright,
            'f.pw': opts.facets.playwright,
            pl: opts.play,
            'f.pl': opts.facets.play,
            sp: opts.character,
            'f.sp': opts.facets.character,
            p: opts.page,
            n: opts.resultsPerPage,
            'f.n': opts.numFacets
         };

         if (opts.basic) {
            queryParams.q = opts.query;
         } else {
            queryParams.a = opts.query;
         }

         var repo = this;

         return RestClient.get(this.apiEndpoint + '/search', queryParams)
                          .then(function (response) {
                              // TODO turn this into a method call/object intantiation
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
                                    return repo.search(_.extend(_.clone(opts), { page: p }));
                                 },

                                 facet: function (facets) {
                                    return repo.search(_.extend(_.clone(opts), { page: 1, facets: facets }));
                                 },

                                 setPageSize: function(sz) {
                                    return repo.search(_.extend(_.clone(opts), { page: 1, resultsPerPage: sz }));

                                 }
                              };
                            }).catch(function (err) {
                              throw new Error('Unable to fetch results from server: ' + err.error);
                            });
      }

   });

   return ExtractRepository;

});
