define(function (require) {

   var Marionette = require('marionette');
   var _ = require('underscore');

   var PlaywrightView = require('./views/playwright_view');
   var PlaywrightListView = require('./views/playwright_list_view');


   var PlaywrightController = Marionette.Controller.extend({

      initialize: function (options) {
         var opts = _.defaults(_.clone(options) || {}, {

         });

         if (!opts.repo) {
            throw new TypeError('no playwright repository provided');
         }

         if (!opts.region) {
            throw new TypeError('no region provided');
         }

         if (!opts.channel) {
            throw new TypeError('no channel provided');
         }

         this.mergeOptions(opts, ['repo', 'region', 'channel']);
      },

      listPlaywrights: function () {
         var _this = this;
         this.repo.getAll().then(function (playwrights) {
            var view = new PlaywrightListView({
               collection: playwrights
            });

            view.on('childview:click', function (itemView, model) {
               _this.channel.trigger('show:playwright', model.id);
            });

            _this.region.show(view);
         });
      },

      browseByPlaywright: function (id) {
         var _this = this;
         this.channel.trigger('search:playwright', id);
         this.repo.get(id).then(function (playwright) {

            _this.region.show(new PlaywrightView({
               model: playwright
            }));
         });
      }

   });


   var PlaywrightRouter = Marionette.AppRouter.extend({

      appRoutes: {
         '': 'listPlaywrights',
         'pws/:id': 'browseByPlaywright'
      }

   });


   return {
      initialize: function (options) {
         var opts = _.defaults(_.clone(options) || {}, {

         });

         if (!opts.channel) {
            throw new TypeError('no channel provided');
         }

         var controller = new PlaywrightController({
            repo: opts.repo,
            region: opts.region,
            channel: opts.channel
         });

         var router = new PlaywrightRouter({
            controller: controller
         });

         opts.channel.on('show:playwright', function (id) {
            controller.browseByPlaywright(id);
            router.navigate('pws/' + id);
         });

         return router;
      }
   };

});
