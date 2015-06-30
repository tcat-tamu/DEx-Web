define(function (require) {

   var RestClient = require('rest_client');
   var _ = require('underscore');

   var Character = require('./entities/character');

   function CharacterRepository(options) {
       var opts = _.extend(_.defaults(options || {}), {

       });

       if (!opts.apiEndpoint) {
          throw new TypeError('no API endpoint provided');
       }

       _.extend(this, _.pick(opts, 'apiEndpoint'));
   }

   _.extend(CharacterRepository.prototype, {
      get: function (id) {
         return RestClient.get(this.apiEndpoint + '/' + id).then(function (response) {
            return new Character(response, { parse: true });
         });
      }
   });

   return CharacterRepository;

});
