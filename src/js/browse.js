define(function(require) {
   var $ = require('jquery');
   var _ = require('underscore');

   /**
    * Computes the Cartesian product of any number of arrays
    *
    * @param  {array} args... Arrays for Cartesian product
    * @return {array}         Cartesian product of arguments
    */
   function product() {
      return _.reduce(arguments, function (a, b) {
         return _.flatten(_.map(a, function (x) {
            return _.map(b, function (y) {
               return x.concat([y]);
            });
         }), true);
      }, [[]]);
   }


   $(function () {
      var $btnShowOriginal = $('button#showOriginal');
      var $btnShowNormalized = $('button#showNormalized');
      var $extractList = $('#extractList');

      $btnShowNormalized.on('click', function () {
         $btnShowNormalized.addClass('active');
         $btnShowOriginal.removeClass('active');
         $extractList
            .removeClass('show-original')
            .addClass('show-normalized');
      });

      $btnShowOriginal.on('click', function () {
         $btnShowOriginal.addClass('active');
         $btnShowNormalized.removeClass('active');
         $extractList
            .removeClass('show-normalized')
            .addClass('show-original');
      });


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
