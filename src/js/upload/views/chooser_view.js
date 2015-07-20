define(function (require) {

   var Marionette = require('marionette');
   var nunjucks = require('nunjucks');
   var _ = require('underscore');


   var UploadFormView = Marionette.ItemView.extend({
      template: _.partial(nunjucks.render, 'upload/chooser.html'),

      ui: {
         manuscriptUpload: 'a.btn.manuscript',
         peopleAndPlaysUpload: 'a.btn.peopleandplays'
      },

      events: {
         'click @ui.manuscriptUpload': function (evt) {
            evt.preventDefault();
            evt.stopPropagation();
            this.channel.trigger('upload:manuscript');
         },

         'click @ui.peopleAndPlaysUpload': function (evt) {
            evt.preventDefault();
            evt.stopPropagation();
            this.channel.trigger('upload:peopleandplays');
         }
      },

      initialize: function (options) {
         var opts = _.defaults(_.clone(options) || {}, {});

         if (!opts.channel) {
            throw new TypeError('no channel provided');
         }

         this.mergeOptions(opts, ['channel']);
      }
   });


   return UploadFormView;

});
