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

         if (!opts.layout) {
            throw new TypeError('no layout provided');
         }

         this.mergeOptions(options, ['layout']);
      },

      showResults: function (searchResponse, options) {
         var opts = _.defaults(_.clone(options) || {}, {
            hideFacets: []
         });

         var resultsView = new ResultsView({
            collection: searchResponse.results
         });

         this.layout.getRegion('results').show(resultsView);


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

         this.layout.getRegion('pagination').show(paginatorView);

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

         this.layout.getRegion('facets').show(facetsView);
      },

      clearResults: function () {
         this.layout.getRegion('results').empty();
         this.layout.getRegion('facets').empty();
         this.layout.getRegion('pagination').empty();
      }
   });

   return SearchController;
});
