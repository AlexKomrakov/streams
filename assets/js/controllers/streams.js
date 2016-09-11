'use strict';

/**
 * @ngdoc function
 * @name streamsApp.controller:StreamsCtrl
 * @description
 * # StreamsCtrl
 * Controller of the streamsApp
 */
angular.module('streamsApp')
    .controller('StreamsCtrl', function ($routeParams, $rootScope, $sce, $scope, $interval, twitch, gameSelector) {
        $scope.$storage = {
            favorite_streams: []
        };
        $rootScope.$on('loadingStreams', function (event, status) {
            $scope.loadingStreams = status;
        });
        $scope.games = twitch.getGames();
        $scope.activeGame = gameSelector.getGame();
        $scope.config = {
            stream: $routeParams.channel,
            startvolume: '50'
        };
        $scope.trustSrc = function (src) {
            return $sce.trustAsResourceUrl(src);
        };
        $scope.streamsContainer = twitch.getStreams();
        $interval(function () {
            twitch.updateStreams();
            twitch.getGames();
        }, 60 * 1000);

        $scope.favorite = function (stream) {
            if ($scope.$storage.favorite_streams.indexOf(stream.channel.name) == -1) {
                return stream.viewers;
            } else {
                return 1000000 + stream.viewers;
            }
        };
        $scope.like = function (game) {
            var index = $scope.$storage.favorite_streams.indexOf(game);
            if (index == -1) {
                $scope.$storage.favorite_streams.push(game);
            } else {
                $scope.$storage.favorite_streams.splice(index, 1);
            }
        };
    });
