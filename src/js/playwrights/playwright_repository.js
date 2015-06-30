define(function (require) {

   var RestClient = require('rest_client');
   var _ = require('underscore');

   var Playwright = require('./entities/playwright');

   function PlaywrightRepository(options) {
       var opts = _.extend(_.defaults(options || {}), {

       });

       if (!opts.apiEndpoint) {
          throw new TypeError('no API endpoint provided');
       }

       _.extend(this, _.pick(opts, 'apiEndpoint'));
   }

   _.extend(PlaywrightRepository.prototype, {
      get: function (id) {
         return RestClient.get(this.apiEndpoint + '/' + id).then(function (response) {
            return new Playwright(response, { parse: true });
         });
      }
   });

   return PlaywrightRepository;

});
