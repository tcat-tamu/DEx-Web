define(function (require) {

   var Marionette = require('marionette');
   var _ = require('underscore');

   var RestClient = require('rest_client');

   var UploadChooserView = require('./views/chooser_view');
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

         if (!opts.channel) {
            throw new TypeError('no channel provided');
         }

         if (!opts.region) {
            throw new TypeError('no region provided');
         }

         if (!opts.apiEndpoint) {
            throw new TypeError('no upload API endpoint provided');
         }

         this.mergeOptions(opts, ['channel', 'region', 'apiEndpoint']);
      },

      showUploadChooser: function () {
         var chooserView = new UploadChooserView({
            channel: this.channel
         });

         this.region.show(chooserView);
      },

      showManuscriptUploadForm: function () {
         var formView = new UploadFormView({
            title: 'Upload Manuscripts'
         });

         formView.on('upload', function (files) {
            _.each(files, function (file) {
               var manuscriptId = prompt('Enter manuscript ID for [' + file.name + '] or cancel to prevent upload:', basename(file.name));

               if (!_.isNull(manuscriptId)) {
                  var formData = new FormData();
                  formData.append('id', manuscriptId);
                  formData.append('file', file);
                  RestClient.upload(this.apiEndpoint + '/manuscript', formData)
                     .then(function () {
                        alert('successfully uploaded file [' + file.name + ']');
                     })
                     .catch(function (err) {
                        alert('unable to upload file [' + file.name + ']: ' + err);
                     });
               }
            }, this);
         }, this);

         this.region.show(formView);
      },

      showPeopleAndPlaysUploadForm: function () {
         var formView = new UploadFormView({
            title: 'Upload People and Plays'
         });

         formView.on('upload', function (files) {
            _.each(files, function (file) {
               var formData = new FormData();
               formData.append('file', file);
               RestClient.upload(this.apiEndpoint + '/peopleandplays', formData)
                  .then(function () {
                     alert('successfully uploaded file [' + file.name + ']');
                  })
                  .catch(function (err) {
                     alert('unable to upload file [' + file.name + ']: ' + err);
                  });
            }, this);
         }, this);

         this.region.show(formView);
      }

      /*
      uploadFiles: function (files) {
         var formData = new FormData();

         _.each(files, function (file) {
            var manuscriptId = prompt('Enter manuscript ID for [' + file.name + '] or cancel to prevent upload:', basename(file.name));

            if (!_.isNull(manuscriptId)) {
               file.name = manuscriptId;
               formData.append('file', file);
            }
         });

         // code for previewing image uploads

         var acceptedTypes = {
            'image/png': true,
            'image/jpeg': true,
            'image/gif': true
         };

         var holder = document.getElementById('holder');

         function previewfile(file) {
            if (acceptedTypes[file.type] === true) {
               var reader = new FileReader();

               reader.onload = function(event) {
                  var image = new Image();
                  image.src = event.target.result;
                  image.width = 250; // a fake resize
                  holder.appendChild(image);
               };

               reader.readAsDataURL(file);
            } else {
               holder.innerHTML += 'Uploaded ' + file.name + ' ' + (file.size ? (file.size / 1024 | 0) + 'K' : '');
            }
         }


         // TODO: keep upload progress indicator
         var progress = { setValue: _.bind(console.log, console) };

         RestClient.upload(this.apiEndpoint, formData, {
               uploadProgress: function (evt) {
                  if (evt.lengthComputable) {
                     progress.setValue(evt.loaded / evt.total);
                  }
               }
            })
            .then(function () {
               progress.setValue(1);
            });
      }
      */
   });


   var UploadRouter = Marionette.AppRouter.extend({
      appRoutes: {
         '': 'showUploadChooser',
         'manuscript': 'showManuscriptUploadForm',
         'peopleandplays': 'showPeopleAndPlaysUploadForm'
      }
   });


   return {
      initialize: function (options) {
         var opts = _.defaults(_.clone(options) || {}, {});

         if (!opts.channel) {
            throw new TypeError('no channel provided');
         }


         var controller = new UploadController({
            channel: opts.channel,
            region: opts.region,
            apiEndpoint: opts.apiEndpoint
         });

         var router = new UploadRouter({
            controller: controller
         });


         opts.channel.on('upload:manuscript', function () {
            controller.showManuscriptUploadForm();
            router.navigate('manuscript');
         });

         opts.channel.on('upload:peopleandplays', function () {
            controller.showPeopleAndPlaysUploadForm();
            router.navigate('peopleandplays');
         });

         return router;
      }
   };

});
