'use strict';

/**
 * @ngdoc filter
 * @name streamsApp.filter:empty
 * @function
 * @description
 * # empty
 * Filter in the streamsApp.
 */
angular.module('streamsApp')
    .filter('empty', function () {
        return function (mixed_var) {
            return (typeof mixed_var === 'undefined')
                || mixed_var === ""
                || mixed_var === 0
                || mixed_var === "0"
                || mixed_var === null
                || mixed_var === false
                || mixed_var === [];
        };
    });
