define(function(require) {
   var $ = require('jquery');
   var _ = require('underscore');
   var product = require('cartesian-product');

   $(function () {
      var SORT_CLASSES = _.map(product(['alpha', 'count'], ['asc', 'desc']), function (xs) { return 'sort-' + xs.join('-'); });

      var $groups = $('.facet-group');

      _.each(SORT_CLASSES, function (className) {
         $groups.find('.icon-' + className).on('click', function (evt) {
            evt.preventDefault();
            evt.stopPropagation();

            $(this).parents('.facet-group')
               .removeClass(SORT_CLASSES.join(' '))
               .addClass(className);
         });
      });

   });
});
