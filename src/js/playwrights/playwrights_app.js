define(function (require) {

   var Marionette = require('marionette');
   var _ = require('underscore');

   var PlaywrightView = require('./views/playwright_view');


   var PlaywrightController = Marionette.Controller.extend({

      initialize: function (options) {
         var opts = _.defaults(_.clone(options) || {}, {

         });

         if (!opts.repo) {
            throw new TypeError('no playwright repository provided');
         }

         if (!opts.layout) {
            throw new TypeError('no layout provided');
         }

         if (!opts.channel) {
            throw new TypeError('no channel provided');
         }

         this.mergeOptions(opts, ['repo', 'layout', 'channel']);
      },

      browseByPlaywright: function (id) {
         var _this = this;
         this.repo.get(id).then(function (playwright) {
            // HACK: what should be a 'handler' is doing the triggering.
            _this.channel.trigger('show:playwright', playwright);

            _this.layout.getRegion('content').show(new PlaywrightView({
               model: playwright
            }));
         });
      }

   });


   var PlaywrightRouter = Marionette.AppRouter.extend({

      appRoutes: {
         'pws/:id': 'browseByPlaywright'
      }

   });


   return {
      initialize: function (options) {
         var opts = _.defaults(_.clone(options) || {}, {

         });

         var router = new PlaywrightRouter({
            controller: new PlaywrightController({
               repo: opts.repo,
               layout: opts.layout,
               channel: opts.channel
            })
         });

         return router;
      }
   };

});
