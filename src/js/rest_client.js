define(function (require) {

    var $ = require('jquery'),
        _ = require('underscore'),
        Promise = require('promise');


    function send(options) {
        var opts = _.defaults(_.clone(options) || {}, {
            method: 'get',
            contentType: 'application/json; charset=UTF-8',
            dataType: 'json'
        });

        if (!opts.url) {
            throw new TypeError('no URL given');
        }

        return new Promise(function (resolve, reject) {
            var jqOpts = {
                type: opts.method,
                url: opts.url,
                data: opts.data,
                dataType: opts.dataType,
                success: function (data) {
                    resolve(data);
                },
                error: function (jqxhr, textStatus, httpError) {
                    reject({
                        jqxhr: jqxhr,
                        status: textStatus,
                        error: httpError
                    });
                }
            };

            if (opts.method.toLowerCase() !== 'get' && !_.isUndefined(jqOpts.data)) {
                jqOpts.contentType = opts.contentType;
                jqOpts.data = JSON.stringify(jqOpts.data);
            }

            $.ajax(jqOpts);
        });
    }


    function doGet() {
        if (arguments.length === 1 && _.isObject(arguments[0])) {
            var options = arguments[0];
            options.method = 'get';
            return send(options);
        } else if (arguments.length === 2 && _.isString(arguments[0]) && _.isObject(arguments[1])) {
            return doGet({
                url: arguments[0],
                data: arguments[1]
            });
        } else if (arguments.length === 1 && _.isString(arguments[0])) {
            return doGet({
                url: arguments[0]
            });
        }

        throw new TypeError('invalid parameters to doGet');
    }


    function doPost() {
        if (arguments.length === 1 && _.isObject(arguments[0])) {
            var options = arguments[0];
            options.method = 'post';
            return send(options);
        } else if (arguments.length === 2 && _.isString(arguments[0]) && _.isObject(arguments[1])) {
            return doPost({
                url: arguments[0],
                data: arguments[1]
            });
        } else if (arguments.length === 1 && _.isString(arguments[0])) {
            return doPost({
                url: arguments[0]
            });
        }

        throw new TypeError('invalid parameters to doPost');
    }


    function doPut() {
        if (arguments.length === 1 && _.isObject(arguments[0])) {
            var options = arguments[0];
            options.method = 'put';
            return send(options);
        } else if (arguments.length === 2 && _.isString(arguments[0]) && _.isObject(arguments[1])) {
            return doPut({
                url: arguments[0],
                data: arguments[1]
            });
        } else if (arguments.length === 1 && _.isString(arguments[0])) {
            return doPut({
                url: arguments[0]
            });
        }

        throw new TypeError('invalid parameters to doPut');
    }


    function doDelete() {
        if (arguments.length === 1 && _.isObject(arguments[0])) {
            var options = arguments[0];
            options.method = 'delete';
            return send(options);
        } else if (arguments.length === 2 && _.isString(arguments[0]) && _.isObject(arguments[1])) {
            return doDelete({
                url: arguments[0],
                data: arguments[1]
            });
        } else if (arguments.length === 1 && _.isString(arguments[0])) {
            return doDelete({
                url: arguments[0]
            });
        }

        throw new TypeError('invalid parameters to doDelete');
    }


    function doUpload(url, formData, options) {
      var opts = _.defaults(_.clone(options) || {}, {

      });

      return new Promise(function (resolve, reject) {
         var xhr = new XMLHttpRequest();
         xhr.open('POST', url);

         xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
               if (xhr.status >= 200 && xhr.status < 400) {
                  resolve(xhr.response);
               } else {
                  reject(xhr.status);
               }
            }
         };

         if (xhr.upload && _.isFunction(opts.uploadProgress)) {
            xhr.upload.onprogress = opts.uploadProgress;
         }

         if (_.isFunction(opts.downloadProgress)) {
            xhr.onprogress = opts.downloadProgress;
         }

         xhr.onerror = function () {
            reject(xhr);
         };

         xhr.send(formData);
      });
   }


    var api = {
        send: send,
        get: doGet,
        post: doPost,
        put: doPut,
        delete: doDelete,
        upload: doUpload
    };

    return api;

});
