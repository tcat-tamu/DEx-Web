define(function (require) {

   var Marionette = require('marionette');
   var _ = require('underscore');

   var BibliographyView = require('./views/bibliography_view');


   var BibliographyController = Marionette.Controller.extend({

      initialize: function (options) {
         var opts = _.defaults(_.clone(options) || {}, {});

         if (!opts.region) {
            throw new TypeError('no region provided');
         }

         if (!opts.repo) {
            throw new TypeError('no repository provided');
         }

         this.mergeOptions(opts, ['region', 'repo']);
      },

      showBibliography: function () {
         var _this = this;
         this.repo.getBibliography().then(function (bibliography) {
            var view = new BibliographyView({
               model: bibliography
            });

            _this.region.show(view);
         });
      }

   });


   var BibliographyRouter = Marionette.AppRouter.extend({

      appRoutes: {
         '': 'showBibliography'
      }

   });

   return {
      initialize: function (options) {
         var opts = _.defaults(_.clone(options) || {}, {});

         var controller = new BibliographyController({
            repo: opts.repo,
            region: opts.region
         });

         var router = new BibliographyRouter({
            controller: controller
         });

         if (!opts.channel) {
            throw new TypeError('no channel provided');
         }

         opts.channel.on('show:bibliography', function () {
            controller.showBibliography();
            router.navigate('');
         });

         return router;
      }
   };

});
