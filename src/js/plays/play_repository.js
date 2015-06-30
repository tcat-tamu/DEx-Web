define(function (require) {

   var RestClient = require('rest_client');
   var _ = require('underscore');

   var Play = require('./entities/play');

   function PlayRepository(options) {
       var opts = _.extend(_.defaults(options || {}), {

       });

       if (!opts.apiEndpoint) {
          throw new TypeError('no API endpoint provided');
       }

       _.extend(this, _.pick(opts, 'apiEndpoint'));
   }

   _.extend(PlayRepository.prototype, {
      get: function (id) {
         return RestClient.get(this.apiEndpoint + '/' + id).then(function (response) {
            return new Play(response, { parse: true });
         });
      }
   });

   return PlayRepository;

});
