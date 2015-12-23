'use strict';

/**
 * @ngdoc directive
 * @name streamsApp.directive:stream
 * @description
 * # stream
 */
angular.module('streamsApp')
    .directive('stream', function () {
        return {
            restrict: 'E',
            templateUrl: 'stream.tmp'
        };
    });
