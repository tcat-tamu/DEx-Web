define(function (require) {

   var RestClient = require('rest_client');
   var _ = require('underscore');

   var Types = require('./entities/manuscript');

   var Manuscript = Types.Manuscript;
   var ManuscriptCollection = Types.ManuscriptCollection;

   function ManuscriptRepository(options) {
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

   _.extend(ManuscriptRepository.prototype, {

      getAll: function () {
         var _this = this;
         return this.searchRepo.getManuscripts()
            .then(function (facetItems) {
               var models = facetItems.map(function (facetItem) {
                  return {
                     id: facetItem.id,
                     title: facetItem.get('label'),
                     downloadUrl: _this.getTeiDownloadHref(facetItem.id)
                  };
               });

               return new ManuscriptCollection(models);
            });
      },

      get: function (id) {
         var downloadUrl = this.getTeiDownloadHref(id);

         return RestClient.get(this.apiEndpoint + '/' + id).then(function (response) {
            var manuscriptAttrs = _.extend(response, {
               downloadUrl: downloadUrl
            });
            return new Manuscript(manuscriptAttrs, { parse: true });
         });
      },

      getTeiDownloadHref: function (id) {
         return this.apiEndpoint + '/' + id + '/tei';
      }

   });

   return ManuscriptRepository;

});
