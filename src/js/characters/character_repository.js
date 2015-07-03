define(function (require) {

   var RestClient = require('rest_client');
   var _ = require('underscore');

   var Types = require('./entities/character');

   var Character = Types.Character;
   var CharacterCollection = Types.CharacterCollection;

   function CharacterRepository(options) {
      var opts = _.defaults(_.clone(options) || {}, {

      });

      if (!opts.apiEndpoint) {
         throw new TypeError('no API endpoint provided');
      }

      if (!opts.searchRepo) {
         throw new TypeError('no search repo provided');
      }

      _.extend(this, _.pick(opts, 'apiEndpoint', 'searchRepo'));
   }

   _.extend(CharacterRepository.prototype, {

      getAll: function () {
         return this.searchRepo.getCharacters()
            .then(function (facetItems) {
               var models = facetItems.map(function (facetItem) {
                  return {
                     id: facetItem.id,
                     name: facetItem.get('label')
                  };
               });

               return new CharacterCollection(models);
            });
      },

      get: function (id) {
         return RestClient.get(this.apiEndpoint + '/' + id).then(function (response) {
            return new Character(response, {
               parse: true
            });
         });
      }

   });

   return CharacterRepository;

});
