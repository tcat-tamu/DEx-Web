define(function (require) {

   var Marionette = require('marionette');
   var _ = require('underscore');

   var ManuscriptView = require('./views/manuscript_view');


   var ManuscriptController = Marionette.Controller.extend({

      initialize: function (options) {
         var opts = _.defaults(_.clone(options) || {}, {

         });

         if (!opts.repo) {
            throw new TypeError('no manuscript repository provided');
         }

         if (!opts.layout) {
            throw new TypeError('no layout provided');
         }

         if (!opts.channel) {
            throw new TypeError('no channel provided');
         }

         this.mergeOptions(opts, ['repo', 'layout', 'channel']);
      },

      browseByManuscript: function (id) {
         var _this = this;
         this.repo.get(id).then(function (manuscript) {
            // HACK: what should be a 'handler' is doing the triggering.
            _this.channel.trigger('show:manuscript', manuscript);

            var view = new ManuscriptView({
               model: manuscript
            });

            _this.layout.getRegion('content').show(view);
         });
      }

   });


   var ManuscriptRouter = Marionette.AppRouter.extend({

      appRoutes: {
         'mss/:id': 'browseByManuscript'
      }

   });


   return {
      initialize: function (options) {
         var opts = _.defaults(_.clone(options) || {}, {

         });

         var router = new ManuscriptRouter({
            controller: new ManuscriptController({
               repo: opts.repo,
               layout: opts.layout,
               channel: opts.channel
            })
         });

         return router;
      }
   };

});
