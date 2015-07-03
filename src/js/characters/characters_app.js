define(function (require) {

   var Marionette = require('marionette');
   var _ = require('underscore');

   var CharacterView = require('./views/character_view');
   var CharacterListView = require('./views/character_list_view');


   var CharacterController = Marionette.Controller.extend({

      initialize: function (options) {
         var opts = _.defaults(_.clone(options) || {}, {

         });

         if (!opts.repo) {
            throw new TypeError('no character repository provided');
         }

         if (!opts.region) {
            throw new TypeError('no region provided');
         }

         if (!opts.channel) {
            throw new TypeError('no channel provided');
         }

         this.mergeOptions(opts, ['repo', 'region', 'channel']);
      },

      listCharacters: function () {
         var _this = this;
         this.repo.getAll().then(function (characters) {
            var view = new CharacterListView({
               collection: characters
            });

            view.on('childview:click', function (itemView, model) {
               _this.channel.trigger('show:character', model.id);
            });

            _this.region.show(view);
         });
      },

      browseByCharacter: function (id) {
         var _this = this;
         this.channel.trigger('search:character', id);
         this.repo.get(id).then(function (character) {
            var view = new CharacterView({
               model: character
            });

            _this.region.show(view);
         });
      }

   });


   var CharacterRouter = Marionette.AppRouter.extend({

      appRoutes: {
         '': 'listCharacters',
         'chars/:id': 'browseByCharacter'
      }

   });


   return {
      initialize: function (options) {
         var opts = _.defaults(_.clone(options) || {}, {

         });

         if (!opts.channel) {
            throw new TypeError('no channel provided');
         }

         var controller = new CharacterController({
            repo: opts.repo,
            region: opts.region,
            channel: opts.channel
         });

         var router = new CharacterRouter({
            controller: controller
         });


         opts.channel.on('show:character', function (id) {
            controller.browseByCharacter(id);
            router.navigate('chars/' + id);
         });

         return router;
      }
   };

});
