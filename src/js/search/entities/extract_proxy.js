define(function (require) {

   var Backbone = require('backbone');


   var Reference = Backbone.Model.extend({
      defaults: {
         title: ''
      }
   });


   var ReferenceCollection = Backbone.Collection.extend({
      model: Reference
   });


   /**
    * Represents some basic information about an extract as returned in a list of search results.
    */
   var ExtractProxyModel = Backbone.Model.extend({

      defaults: function () {
         return {
            manuscript: new Reference(),
            author: '',
            sourceId: null,
            sourceLineRef: null,
            normalized: '',
            original: '',
            speakers: new ReferenceCollection(),
            playwrights: new ReferenceCollection()
         };
      },

      /**
       * Resolve the proxy into an extract object.
       *
       * @return {Promise} resolves to the extract object
       */
      getExtract: function () {
         if (!this._repo) {
            throw new Error('no repository specified');
         }

         return this._repo.get(this.id);
      },

      /**
       * Sets the repository from which this model was constructed
       *
       * @param {ExtractRepository} repo
       */
      setRepo: function (repo) {
         this._repo = repo;
      }
   });


   return {
      ExtractProxy: ExtractProxyModel,
      ExtractProxyCollection: Backbone.Collection.extend({ model: ExtractProxyModel })
   };

});
