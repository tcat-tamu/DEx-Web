define(function (require) {

   var Marionette = require('marionette');
   var nunjucks = require('nunjucks');
   var _ = require('underscore');
   // var product = require('cartesian-product');


   var FacetView = Marionette.LayoutView.extend({
      template: _.partial(nunjucks.render, 'search/facet_group.html'),
      tagName: 'section',
      className: 'facet-group sort-count-desc',

      templateHelpers: function () {
         return {
            title: this.title
         };
      },

      initialize: function (options) {
         var opts = _.defaults(options || {}, {
            title: ''
         });

         this.mergeOptions(opts, ['title']);
      }
   });


   // var SORT_CLASSES = _.map(product(['alpha', 'count'], ['asc', 'desc']), function (xs) {
   //    return 'sort-' + xs.join('-');
   // });

   var FacetsView = Marionette.CollectionView.extend({
      childView: FacetView,
      className: 'facet-controls',

      events: {
         'click .icon-sort': function (evt) {
            evt.preventDefault();
            evt.stopPropagation();

            // $(this).parents('.facet-group')
            //    .removeClass(SORT_CLASSES.join(' '))
            //    .addClass(className);
         }
      }
   });

   return FacetsView;

});
