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

         if (!opts.paginationRegion) {
            throw new TypeError('no pagination region provided');
         }

         if (!opts.facetsRegion) {
            throw new TypeError('no facets region provided');
         }

         if (!opts.repo) {
            throw new TypeError('no repository provided');
         }

         this.mergeOptions(options, ['resultsRegion', 'paginationRegion', 'facetsRegion', 'repo']);
      },

      showResults: function (searchResponse, options) {
         var opts = _.defaults(_.clone(options) || {}, {
            hideFacets: []
         });

         var resultsView = new ResultsView({
            collection: searchResponse.results
         });

         this.resultsRegion.show(resultsView);


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

         this.paginationRegion.show(paginatorView);

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

         this.facetsRegion.show(facetsView);
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
         });
      }

   });

   return SearchController;
});
