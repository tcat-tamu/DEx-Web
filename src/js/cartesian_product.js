define(function (require) {

   var _ = require('underscore');

   /**
   * Computes the Cartesian product of any number of arrays
   *
   * @param  {array} args... Arrays for Cartesian product
   * @return {array}         Cartesian product of arguments
   */
   function cartesianProduct() {
      return _.reduce(arguments, function (a, b) {
         return _.flatten(_.map(a, function (x) {
            return _.map(b, function (y) {
               return x.concat([y]);
            });
         }), true);
      }, [[]]);
   }

   return cartesianProduct;

});
