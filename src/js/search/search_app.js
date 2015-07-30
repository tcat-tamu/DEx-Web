define(function (require) {

   var Marionette = require('marionette');
   var _ = require('underscore');

   var SearchController = require('./search_controller');


   var SearchRouter = Marionette.AppRouter.extend({
      appRoutes: {}
   });


   return {
      initialize: function (options) {
         var opts = _.defaults(_.clone(options) || {}, {});

         if (!opts.channel) {
            throw new TypeError('no channel provided');
         }

         var controller = new SearchController({
            resultsRegion: opts.resultsRegion,
            paginationRegion: opts.paginationRegion,
            facetsRegion: opts.facetsRegion,
            repo: options.repo
         });

         var router = new SearchRouter({
            controller: controller
         });



         opts.channel.on('search:basic', function (query) {
            controller.basicSearch(query);
         });

         opts.channel.on('search:advanced', function (params) {
            controller.advancedSearch(params);
         });


         opts.channel.on('search:clear', function () {
            controller.clearResults();
         });


         opts.channel.on('search:character', function (id) {
            controller.browseBy('character', id);
         });

         opts.channel.on('search:manuscript', function (id) {
            controller.browseBy('manuscript', id);
         });

         opts.channel.on('search:play', function (id) {
            controller.browseBy('play', id);
         });

         opts.channel.on('search:playwright', function (id) {
            controller.browseBy('playwright', id);
         });

         return router;

      }
   };

});
