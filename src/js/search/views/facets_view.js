define(function (require) {

   var Marionette = require('marionette');
   var nunjucks = require('nunjucks');
   var _ = require('underscore');
   // var product = require('cartesian-product');


   var FacetItemView = Marionette.ItemView.extend({
      template: _.partial(nunjucks.render, 'search/facet_item.html'),
      tagName: 'li',
      className: 'checkbox',

      templateHelpers: function () {
         return _.pick(this, 'title', 'field');
      },

      events: {
         'click :checkbox': function (evt) {
            this.model.set('selected', evt.target.checked);
         }
      },

      initialize: function (options) {
         var opts = _.defaults(_.clone(options || {}), {
            title: ''
         });

         if (!opts.field) {
            throw new TypeError('no parent field name specified');
         }

         this.mergeOptions(opts, ['field', 'title']);
      }
   });


   var FacetItemsView = Marionette.CollectionView.extend({
      childView: FacetItemView,
      tagName: 'ul',

      childViewOptions: function () {
         return _.pick(this, 'field', 'title');
      },

      initialize: function (options) {
         var opts = _.defaults(_.clone(options || {}), {
            title: ''
         });

         if (!opts.field) {
            throw new TypeError('no parent field specified');
         }

         this.mergeOptions(opts, ['field', 'title']);
      }
   });


   var FacetView = Marionette.LayoutView.extend({
      template: _.partial(nunjucks.render, 'search/facet_group.html'),
      tagName: 'section',
      className: 'facet-group sort-count-desc',

      templateHelpers: function () {
         return {
            title: this.title
         };
      },

      regions: {
         items: '> .facet-items'
      },

      initialize: function (options) {
         var opts = _.defaults(options || {}, {
            title: ''
         });

         this.mergeOptions(opts, ['title']);
      },

      onShow: function () {
         this.getRegion('items').show(new FacetItemsView({
            title: this.title,
            field: this.model.get('field'),
            collection: this.model.get('items')
         }));
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
