define(function (require) {

   var Marionette = require('marionette');
   var _ = require('underscore');

   var CharacterView = require('./views/character_view');


   var CharacterController = Marionette.Controller.extend({

      initialize: function (options) {
         var opts = _.defaults(_.clone(options || {}), {

         });

         if (!opts.repo) {
            throw new TypeError('no character repository provided');
         }

         if (!opts.layout) {
            throw new TypeError('no layout provided');
         }

         if (!opts.channel) {
            throw new TypeError('no channel provided');
         }

         this.mergeOptions(opts, ['repo', 'layout', 'channel']);
      },

      browseByCharacter: function (id) {
         var _this = this;
         this.repo.get(id).then(function (character) {
            // HACK: what should be a 'handler' is doing the triggering.
            _this.channel.trigger('show:character', character);

            var view = new CharacterView({
               model: character
            });

            _this.layout.getRegion('content').show(view);
         });
      }

   });


   var CharacterRouter = Marionette.AppRouter.extend({

      appRoutes: {
         'chars/:id': 'browseByCharacter'
      }

   });


   return {
      initialize: function (options) {
         var opts = _.defaults(_.clone(options || {}), {

         });

         var router = new CharacterRouter({
            controller: new CharacterController({
               repo: opts.repo,
               layout: opts.layout,
               channel: opts.channel
            })
         });

         return router;
      }
   };

});
