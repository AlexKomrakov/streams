'use strict';

/**
 * @ngdoc filter
 * @name streamsApp.filter:urlEncode
 * @function
 * @description
 * # urlEncode
 * Filter in the streamsApp.
 */
angular.module('streamsApp')
    .filter('urlEncode', function () {
        return function (url) {
            return encodeURIComponent(encodeURIComponent(url));
        };
    });
