define(function (require) {

   var RestClient = require('rest_client');
   var _ = require('underscore');

   var Types = require('./entities/playwright');

   var Playwright = Types.Playwright;
   var PlaywrightCollection = Types.PlaywrightCollection;

   function PlaywrightRepository(options) {
       var opts = _.defaults(_.clone(options) || {}, {

       });

       if (!opts.apiEndpoint) {
          throw new TypeError('no API endpoint provided');
       }

       if (!opts.searchRepo) {
          throw new TypeError('no search repository provided');
       }

       _.extend(this, _.pick(opts, 'apiEndpoint', 'searchRepo'));
   }

   _.extend(PlaywrightRepository.prototype, {

      getAll: function () {
         return this.searchRepo.getPlaywrights()
            .then(function (facetItems) {
               var models = facetItems.map(function (facetItem) {
                  return {
                     id: facetItem.id,
                     names: [facetItem.get('label')]
                  };
               });

               return new PlaywrightCollection(models);
            });
      },

      get: function (id) {
         return RestClient.get(this.apiEndpoint + '/' + id).then(function (response) {
            return new Playwright(response, { parse: true });
         });
      }

   });

   return PlaywrightRepository;

});
