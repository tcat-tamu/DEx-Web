define(function (require) {

   var Marionette = require('marionette');
   var _ = require('underscore');

   var PlayView = require('./views/play_view');


   var PlayController = Marionette.Controller.extend({

      initialize: function (options) {
         var opts = _.defaults(_.clone(options || {}), {

         });

         if (!opts.repo) {
            throw new TypeError('no play repository provided');
         }

         if (!opts.layout) {
            throw new TypeError('no layout provided');
         }

         if (!opts.channel) {
            throw new TypeError('no channel provided');
         }

         this.mergeOptions(opts, ['repo', 'layout', 'channel']);
      },

      browseByPlay: function (id) {
         var _this = this;
         this.repo.get(id).then(function (play) {
            // HACK: what should be a 'handler' is doing the triggering.
            _this.channel.trigger('show:play', play);

            var view = new PlayView({
               model: play
            });

            _this.layout.getRegion('content').show(view);
         });
      }

   });


   var PlayRouter = Marionette.AppRouter.extend({

      appRoutes: {
         'plays/:id': 'browseByPlay'
      }

   });


   return {
      initialize: function (options) {
         var opts = _.defaults(_.clone(options || {}), {

         });

         var router = new PlayRouter({
            controller: new PlayController({
               repo: opts.repo,
               layout: opts.layout,
               channel: opts.channel
            })
         });

         return router;
      }
   };

});
