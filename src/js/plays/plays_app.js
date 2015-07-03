define(function (require) {

   var Marionette = require('marionette');
   var _ = require('underscore');

   var PlayView = require('./views/play_view');
   var PlayListView = require('./views/play_list_view');


   var PlayController = Marionette.Controller.extend({

      initialize: function (options) {
         var opts = _.defaults(_.clone(options) || {}, {

         });

         if (!opts.repo) {
            throw new TypeError('no play repository provided');
         }

         if (!opts.region) {
            throw new TypeError('no region provided');
         }

         if (!opts.channel) {
            throw new TypeError('no channel provided');
         }

         this.mergeOptions(opts, ['repo', 'region', 'channel']);
      },

      listPlays: function () {
         var _this = this;
         this.repo.getAll().then(function (plays) {
            var view = new PlayListView({
               collection: plays
            });

            view.on('childview:click', function (itemView, model) {
               _this.channel.trigger('show:play', model.id);
            });

            _this.region.show(view);
         });
      },

      browseByPlay: function (id) {
         var _this = this;
         this.channel.trigger('search:play', id);
         this.repo.get(id).then(function (play) {
            var view = new PlayView({
               model: play
            });

            _this.region.show(view);
         });
      }

   });


   var PlayRouter = Marionette.AppRouter.extend({

      appRoutes: {
         '': 'listPlays',
         'plays/:id': 'browseByPlay'
      }

   });


   return {
      initialize: function (options) {
         var opts = _.defaults(_.clone(options) || {}, {

         });

         if (!opts.channel) {
            throw new TypeError('no channel provided');
         }

         var controller = new PlayController({
            repo: opts.repo,
            region: opts.region,
            channel: opts.channel
         });

         var router = new PlayRouter({
            controller: controller
         });

         opts.channel.on('show:play', function (id) {
            controller.browseByPlay(id);
            router.navigate('plays/' + id);
         });

         return router;
      }
   };

});
