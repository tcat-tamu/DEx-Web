define(function (require) {

   var Marionette = require('marionette');
   var _ = require('underscore');

   var ManuscriptView = require('./views/manuscript_view');
   var ManuscriptListView = require('./views/manuscript_list_view');


   var ManuscriptController = Marionette.Controller.extend({

      initialize: function (options) {
         var opts = _.defaults(_.clone(options) || {}, {

         });

         if (!opts.repo) {
            throw new TypeError('no manuscript repository provided');
         }

         if (!opts.region) {
            throw new TypeError('no region provided');
         }

         if (!opts.channel) {
            throw new TypeError('no channel provided');
         }

         this.mergeOptions(opts, ['repo', 'region', 'channel']);
      },

      listManuscripts: function () {
         var _this = this;
         this.repo.getAll().then(function (manuscripts) {
            var view = new ManuscriptListView({
               collection: manuscripts
            });

            view.on('childview:click', function (itemView, model) {
               _this.channel.trigger('show:manuscript', model.id);
            });

            _this.region.show(view);
         });
      },

      browseByManuscript: function (id) {
         var _this = this;
         this.channel.trigger('search:manuscript', id);
         this.repo.get(id).then(function (manuscript) {
            var view = new ManuscriptView({
               model: manuscript
            });

            _this.region.show(view);
         });
      }

   });


   var ManuscriptRouter = Marionette.AppRouter.extend({

      appRoutes: {
         '': 'listManuscripts',
         'mss/:id': 'browseByManuscript'
      }

   });


   return {
      initialize: function (options) {
         var opts = _.defaults(_.clone(options) || {}, {

         });

         if (!opts.channel) {
            throw new TypeError('no channel provided');
         }

         var controller = new ManuscriptController({
            repo: opts.repo,
            region: opts.region,
            channel: opts.channel
         });

         var router = new ManuscriptRouter({
            controller: controller
         });

         opts.channel.on('show:manuscript', function (id) {
            controller.browseByManuscript(id);
            router.navigate('mss/' + id);
         });

         return router;
      }
   };

});
