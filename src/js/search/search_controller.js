define(function (require) {

   var Marionette = require('marionette');
   var _ = require('underscore');

   var ResultsView = require('./views/results_view');
   var PaginatorView = require('./views/paginator_view');
   var FacetsView = require('./views/facets_view');
   var FacetFieldCollection = require('./entities/facets').FacetFieldCollection;


   var SearchController = Marionette.Controller.extend({

      initialize: function (options) {
         var opts = _.defaults(_.clone(options) || {}, {});

         if (!opts.resultsRegion) {
            throw new TypeError('no results region provided');
         }

         if (!opts.paginationTopRegion) {
            throw new TypeError('no top pagination region provided');
         }

         if (!opts.paginationBottomRegion) {
            throw new TypeError('no bottom pagination region provided');
         }

         if (!opts.facetsRegion) {
            throw new TypeError('no facets region provided');
         }

         if (!opts.repo) {
            throw new TypeError('no repository provided');
         }

         if (!opts.channel) {
            throw new TypeError('no channel provided');
         }

         this.mergeOptions(options, ['resultsRegion', 'paginationTopRegion', 'paginationBottomRegion', 'facetsRegion', 'repo', 'channel']);
      },

      basicSearch: function (query) {
         var _this = this;
         this.repo.search(query)
            .then(function (results) {
               _this.showResults(results);
            })
            .catch(function (err) {
               _this.handleError(err);
            });
      },

      advancedSearch: function (params) {
         var _this = this;
         this.repo.search(params)
            .then(function (results) {
               _this.showResults(results);
            })
            .catch(function (err) {
               _this.handleError(err);
            });
      },

      displayPagination: function(region, searchResponse, options) {
        var paginatorView = new PaginatorView({
           current: searchResponse.currentPage,
           total: searchResponse.numPages,
           padding: 3
        });

        this.listenTo(paginatorView, 'page', function (page) {
           var _this = this;
           searchResponse.getPage(page).then(function (newSearchResponse) {
              _this.showResults(newSearchResponse, options);
           });
        });

        region.show(paginatorView);
      },

      showResults: function (searchResponse, options) {
         var opts = _.defaults(_.clone(options) || {}, {
            hideFacets: []
         });

         var resultsView = new ResultsView({
            collection: searchResponse.results
         });

         this.resultsRegion.show(resultsView);

         this.displayPagination(this.paginationTopRegion, searchResponse, options);
         this.displayPagination(this.paginationBottomRegion, searchResponse, options);

         var filteredFacets = searchResponse.facets.filter(function (facetField) {
            return !_.contains(opts.hideFacets, facetField.get('field'));
         });

         var facetsView = new FacetsView({
            collection: new FacetFieldCollection(filteredFacets)
         });

         this.listenTo(searchResponse.facets, 'change:items:selected', function () {
            var _this = this;

            searchResponse.facet(searchResponse.facets.getSelected()).then(function (newSearchResponse) {
               _this.showResults(newSearchResponse, options);
            });
         });

         this.listenToOnce(this.channel, 'setPageSize', function(data) {
           var _this = this;

           searchResponse.setPageSize(data.pageSize).then(function(newSearchResponse) {
             _this.showResults(newSearchResponse, options);
           });
         });

         this.facetsRegion.show(facetsView);
      },

      handleError: function (err) {
         this.resultsRegion.show(new Marionette.ItemView({
            className: 'alert alert-danger',
            template: _.constant(err || 'An unknown error occurred.')
         }));
      },

      clearResults: function () {
         this.resultsRegion.empty();
         this.facetsRegion.empty();
         this.paginationRegion.empty();
      },

      browseBy: function (field, id) {
         var facets = {};
         facets[field] = [id];

         var _this = this;
         this.repo.search({
            facets: facets
         })
         .then(function (results) {
            _this.showResults(results, {
               hideFacets: [field]
            });
         })
         .catch(function (err) {
            _this.handleError(err);
         });
      }

   });

   return SearchController;
});
