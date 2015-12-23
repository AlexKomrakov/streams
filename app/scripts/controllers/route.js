'use strict';

/**
 * @ngdoc function
 * @name streamsApp.controller:RouteCtrl
 * @description
 * # RouteCtrl
 * Controller of the streamsApp
 */
angular.module('streamsApp')
    .controller('RouteCtrl', function ($scope, $routeParams, gameSelector) {
        $scope.$on('$routeChangeSuccess', function () {
            $scope.config.stream = $routeParams.channel;
            $routeParams.game = $routeParams.game ? decodeURIComponent($routeParams.game) : '';
            if (gameSelector.getGame().id != $routeParams.game) {
                gameSelector.selectGame($routeParams.game);
            }
        });
    });
