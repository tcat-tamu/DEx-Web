define(function (require) {

   var RestClient = require('rest_client');
   var _ = require('underscore');

   var Types = require('./entities/play');

   var Bibliography = Types.Bibliography;
   var Play = Types.Play;
   var PlayCollection = Types.PlayCollection;

   function PlayRepository(options) {
       var opts = _.defaults(_.clone(options) || {}, {

       });

       if (!opts.apiEndpoint) {
          throw new TypeError('no API endpoint provided');
       }

       _.extend(this, _.pick(opts, 'apiEndpoint', 'searchRepo'));
   }

   _.extend(PlayRepository.prototype, {

      getAll: function () {
         if (!this.searchRepo) {
            throw new TypeError('no search repository provided');
         }

         return this.searchRepo.getPlays()
            .then(function (facetItems) {
               var models = facetItems.map(function (facetItem) {
                  return {
                     id: facetItem.id,
                     title: facetItem.get('label')
                  };
               });

               return new PlayCollection(models);
            });
      },

      get: function (id) {
         return RestClient.get(this.apiEndpoint + '/' + id).then(function (response) {
            return new Play(response, { parse: true });
         });
      },

      getBibliography: function () {
         return RestClient.get(this.apiEndpoint).then(function (response) {
            return new Bibliography({ plays: response }, { parse: true });
         });
      }

   });

   return PlayRepository;

});
