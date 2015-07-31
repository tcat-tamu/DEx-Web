define(function (require) {

   var Backbone = require('backbone');


   var Edition = Backbone.Model.extend({

      defaults: function () {
         return {
            title: '',
            editors: [],
            link: ''
         };
      }

   });


   var EditionCollection = Backbone.Collection.extend({
      model: Edition
   });


   var Play = Backbone.Model.extend({

      defaults: function () {
         return {
            title: '',
            playwrights: [],
            editions: new EditionCollection()
         };
      },

      parse: function () {
         var attrs = Backbone.Model.prototype.parse.apply(this, arguments);

         if (attrs.editions) {
            attrs.editions = new EditionCollection(attrs.editions, { parse: true });
         }

         return attrs;
      },

      toJSON: function () {
         var json = Backbone.Model.prototype.toJSON.apply(this, arguments);

         if (json.editions) {
            json.editions = json.editions.toJSON();
         }

         return json;
      }

   });

   var PlayCollection = Backbone.Collection.extend({
      model: Play,
      comparator: 'title'
   });


   var Bibliography = Backbone.Model.extend({

      defaults: function () {
         return {
            plays: new PlayCollection()
         };
      },

      parse: function () {
         var attrs = Backbone.Model.prototype.parse.apply(this, arguments);

         if (attrs.plays) {
            attrs.plays = new PlayCollection(attrs.plays, { parse: true });
         }

         return attrs;
      },

      toJSON: function () {
         var json = Backbone.Model.prototype.toJSON.apply(this, arguments);

         if (json.plays) {
            json.plays = json.plays.toJSON();
         }

         return json;
      }

   });


   return {
      Bibliography: Bibliography,
      Edition: Edition,
      EditionCollection: EditionCollection,
      Play: Play,
      PlayCollection: PlayCollection
   };

});
