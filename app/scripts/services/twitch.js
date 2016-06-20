'use strict';

/**
 * @ngdoc service
 * @name streamsApp.twitch
 * @description
 * # twitch
 * Service in the streamsApp.
 */
angular.module('streamsApp')
    .service('twitch', function ($rootScope, $resource, gameSelector) {
        var Twitch = this;
        var data = {streams: [], games: []};
        var game = gameSelector.getGame();
        Twitch.Api = $resource('https://api.twitch.tv/kraken/streams', {}, {
            get: {method: 'JSONP', params: {callback: 'JSON_CALLBACK'}},
            games: {url: "https://api.twitch.tv/kraken/games/top", method: 'JSONP', params: {callback: 'JSON_CALLBACK'}}
        });
        $rootScope.$on('changeGame', function () {
            data.streams = [];
            Twitch.updateStreams();
        });
        Twitch.updateStreams = function () {
            $rootScope.$broadcast('loadingStreams', true);
            Twitch.Api.get({game: game.id, limit: 30}).$promise.then(function (result) {
                if ('streams' in result && (typeof result.streams[0] != 'undefined')) {
                    angular.forEach(result.streams, function (value, key) {
                        if (data.streams[key] && data.streams[key]._id == value._id) {
                            angular.extend(data.streams[key], value);
                        } else {
                            data.streams[key] = value;
                        }
                    });
                }
                $rootScope.$broadcast('loadingStreams', false);
            });
        };
        Twitch.getStreams = function () {
            return data;
        };
        Twitch.getGames = function () {
            Twitch.Api.games({limit: 10}).$promise.then(function (response) {
                if ('top' in response) {
                    response.top = response.top.splice(0, 10);
                    angular.forEach(response.top, function (value, key) {
                        if (data.games[key] && data.games[key].game.name == value.game.name) {
                            angular.extend(data.games[key], value);
                        } else {
                            data.games[key] = value;
                        }
                    });
                }
            });
            return data;
        };
    });
