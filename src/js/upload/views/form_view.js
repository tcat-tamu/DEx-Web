define(function (require) {

   var Marionette = require('marionette');
   var nunjucks = require('nunjucks');
   var _ = require('underscore');


   var UploadFormView = Marionette.ItemView.extend({
      tagName: 'form',
      template: _.partial(nunjucks.render, 'upload/form.html'),

      ui: {
         dropTarget: '> .drop-target',
         fallbackForm: '> .upload-form',
         fileInput: 'input[name=upload]'
      },

      events: {
         submit: function (evt) {
            evt.preventDefault();
            this.trigger('upload', this.ui.fileInput.prop('files'));
         },

         'dragover @ui.dropTarget': function (evt) {
            evt.preventDefault();
            evt.stopPropagation();
            this.ui.dropTarget.addClass('hover');
         },

         'dragend @ui.dropTarget': function (evt) {
            evt.preventDefault();
            evt.stopPropagation();
            this.ui.dropTarget.removeClass('hover');
         },

         'drop @ui.dropTarget': function (evt) {
            evt.preventDefault();
            evt.stopPropagation();
            this.ui.dropTarget.removeClass('hover');
            this.trigger('upload', evt.originalEvent.dataTransfer.files);
         }
      },

      onShow: function () {
         if (!('draggable' in document.createElement('span'))) {
            this.ui.dropTarget.hide();
            this.ui.fallbackForm.show();
         }
      }
   });


   return UploadFormView;

});
