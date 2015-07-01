define(function (require) {

   var RestClient = require('rest_client');
   var _ = require('underscore');

   var Manuscript = require('./entities/manuscript');

   function ManuscriptRepository(options) {
       var opts = _.defaults(_.clone(options) || {}, {

       });

       if (!opts.apiEndpoint) {
          throw new TypeError('no API endpoint provided');
       }

       _.extend(this, _.pick(opts, 'apiEndpoint'));
   }

   _.extend(ManuscriptRepository.prototype, {
      get: function (id) {
         return RestClient.get(this.apiEndpoint + '/' + id).then(function (response) {
            return new Manuscript(response, { parse: true });
         });
      }
   });

   return ManuscriptRepository;

});
