define(function (require) {

   var Marionette = require('marionette');
   var _ = require('underscore');

   var RestClient = require('rest_client');

   var UploadFormView = require('./views/form_view');

   /**
    * Returns the base name of a file without the extension
    *
    * @param  {string} filename
    * @return {string}
    */
   function basename(filename) {
      var ix = filename.lastIndexOf('.');
      return filename.substring(0, ix < 0 ? filename.length : ix);
   }


   var UploadController = Marionette.Controller.extend({

      initialize: function (options) {
         var opts = _.defaults(_.clone(options) || {}, {});

         if (!opts.region) {
            throw new TypeError('no region provided');
         }

         if (!opts.apiEndpoint) {
            throw new TypeError('no upload API endpoint provided');
         }

         this.mergeOptions(opts, ['region', 'apiEndpoint']);
      },

      showUploadForm: function () {
         var formView = new UploadFormView();

         formView.on('upload', function (files) {
            this.uploadFiles(files);
         }, this);

         this.region.show(formView);
      },

      uploadFiles: function (files) {
         var formData = new FormData();

         for (var i = 0; i < files.length; i++) {
            var file = files[i];

            var manuscriptId = prompt('Enter manuscript ID:', basename(file.name));

            if (!_.isNull(manuscriptId)) {
               file.name = manuscriptId;
               formData.append('file', file);
            }
         }

         // code for previewing image uploads
         //
         // var acceptedTypes = {
         //    'image/png': true,
         //    'image/jpeg': true,
         //    'image/gif': true
         // };
         //
         // var holder = document.getElementById('holder');
         //
         // function previewfile(file) {
         //    if (acceptedTypes[file.type] === true) {
         //       var reader = new FileReader();
         //
         //       reader.onload = function(event) {
         //          var image = new Image();
         //          image.src = event.target.result;
         //          image.width = 250; // a fake resize
         //          holder.appendChild(image);
         //       };
         //
         //       reader.readAsDataURL(file);
         //    } else {
         //       holder.innerHTML += 'Uploaded ' + file.name + ' ' + (file.size ? (file.size / 1024 | 0) + 'K' : '');
         //    }
         // }


         // TODO: keep upload progress indicator
         // var progress = { setValue: _.bind(console.log, console) };

         RestClient.upload(this.apiEndpoint, formData, {
            // uploadProgress: function (evt) {
            //    if (evt.lengthComputable) {
            //       progress.setValue(evt.loaded / evt.total);
            //    }
            // }
         })
         // .then(function () {
         //    progress.setValue(1);
         // })
         ;
      }
   });


   var UploadRouter = Marionette.AppRouter.extend({
      appRoutes: {
         'upload': 'showUploadForm'
      }
   });


   return {
      initialize: function (options) {
         var opts = _.defaults(_.clone(options) || {}, {});

         if (!opts.channel) {
            throw new TypeError('no channel provided');
         }


         var controller = new UploadController({
            region: opts.region,
            apiEndpoint: opts.apiEndpoint
         });

         var router = new UploadRouter({
            controller: controller
         });


         opts.channel.on('show:upload', function () {
            controller.showUploadForm();
            router.navigate('upload');
         });

         return router;
      }
   };

});
