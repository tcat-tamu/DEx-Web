define(function (require) {

   var Marionette = require('marionette');
   var nunjucks = require('nunjucks');
   var _ = require('underscore');


   var PaginatorView = Marionette.ItemView.extend({
      template: _.partial(nunjucks.render, 'pagination.html'),
      tagName: 'ul',
      className: 'pagination',

      events: {
         'click a.goto': function (evt) {
            evt.preventDefault();
            var targetPage = parseInt(evt.currentTarget.dataset.page);

            if (targetPage) {
               this.trigger('page', targetPage);
            }
         }
      },

      templateHelpers: function () {
         return {
            current: this.current,
            max: this.total,
            padding: this.padding
         };
      },

      initialize: function (options) {
         var opts = _.defaults(_.clone(options) || {}, {
            current: 1,
            padding: 4
         });

         if (!_.isNumber(opts.total)) {
            throw new TypeError('no total number of pages provided');
         }

         this.mergeOptions(opts, ['current', 'total', 'padding']);
      }

   });

   return PaginatorView;

});
