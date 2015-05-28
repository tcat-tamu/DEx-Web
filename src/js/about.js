define(function (require) {

   var $ = require('jquery');
   var Freewall = require('freewall');
   var Promise = require('promise');

   var wall = new Freewall('#sponsorsWall');

   wall.reset({
      selector: '.sponsor',
      gutterX: 20,
      gutterY: 20,
      cellW: 'auto',
      cellH: 'auto',
      onResize: function () {
         wall.fitWidth();
      }
   });

   var imgLoadPromises = [];
   var IMG_LOAD_TIMEOUT = 10000;

   $('#sponsorsWall img').each(function () {
      var p = new Promise(function (resolve) {
         var img = $(this);
         img.one('load', function () {
            resolve(img);
         });
      }).timeout(IMG_LOAD_TIMEOUT).catch(Promise.TimeoutError, Promise.CancellationError, function () {
         return null;
      });

      imgLoadPromises.push(p);
   });

   Promise.all(imgLoadPromises).then(function () {
      wall.fitWidth();
   });

});
