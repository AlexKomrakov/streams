var streamsApp = angular.module('dotaStreams', ['ngResource', 'ngSanitize', 'ngAnimate', 'ngRoute']);

streamsApp
    .config(Config)
    .filter('empty', Empty)
    .service('Twitch', Twitch)
    .service('GameSelector', GameSelector)
    .controller('streamList', streamList)
    .controller('routeController', routeController)
    .directive('stream', Stream);

function Config($interpolateProvider, $routeProvider, $locationProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
    $routeProvider
        .when('/:game', { controller: routeController, template: ' ' })
        .when('/', { controller: routeController, template: ' ' })
        .otherwise({ redirectTo: '/' });
}

function Empty() {
    return function(mixed_var) {
        return (typeof mixed_var === 'undefined')
            || mixed_var === ""
            || mixed_var === 0
            || mixed_var === "0"
            || mixed_var === null
            || mixed_var === false
            || mixed_var === [];
    }
}

function GameSelector($rootScope) {
    var GameSelector = this;
    var game = { id: "" };
    GameSelector.getGame     = function() { return game; };
    GameSelector.selectGame  = function(game_id) {
        game.id = game_id;
        $rootScope.$broadcast("changeGame");
    }
}

function Twitch($rootScope, $resource, GameSelector) {
    var Twitch = this;
    var data = { streams: [], games: [] };
    var game = GameSelector.getGame();
    var TwitchAPI = $resource('https://api.twitch.tv/kraken/streams', {}, {
        get: {method: 'JSONP', params: {callback: 'JSON_CALLBACK'}},
        games: {url: "https://api.twitch.tv/kraken/games/top", method: 'JSONP', params: {callback: 'JSON_CALLBACK'}}
    });
    $rootScope.$on('changeGame', function(){
        data.streams = [];
        Twitch.updateStreams();
    });
    this.updateStreams = function() {
        $rootScope.$broadcast('loadingStreams', true);
        TwitchAPI.get({game: game.id}).$promise.then(function (result) {
            if ('streams' in result && (typeof result.streams[0] != 'undefined'))  {
                angular.forEach(result.streams, function(value, key) {
                    if (data.streams[key] && data.streams[key]._id == value._id) {
                        data.streams[key].viewers = value.viewers;
                    } else {
                        data.streams[key] = value;
                    }
                });
            }
            $rootScope.$broadcast('loadingStreams', false);
        });
    };
    this.getStreams = function() { return data; };
    this.getGames = function() {
        TwitchAPI.games().$promise.then(function(response) {
            if ('top' in response) {
                angular.forEach(response.top, function(value, key) {
                    if (data.games[key] && data.games[key].game.name == value.game.name) {
                        data.games[key].viewers = value.viewers;
                    } else {
                        data.games[key] = value;
                    }
                });
            }
        });
        return data;
    };
}

function Stream() {
    return {
        restrict: 'E',
        templateUrl: 'video.tmp'
    }
}

function streamList($routeParams, $rootScope, Twitch, $scope, $interval, GameSelector) {
    $rootScope.$on('loadingStreams', function(event, status) {
        $scope.loadingStreams = status;
    });
    $scope.games = Twitch.getGames();
    $scope.activeGame = GameSelector.getGame();
    $scope.config = {
        stream: $routeParams.channel,
        startvolume: '50'
    };
    $scope.streamsContainer = Twitch.getStreams();
    $interval(function () {
        Twitch.updateStreams();
        Twitch.getGames();
    }, 60* 1000);
}

function routeController($scope, $routeParams, GameSelector) {
    $scope.$on('$routeChangeSuccess', function () {
        $scope.config.stream = $routeParams.channel;
        if (GameSelector.getGame().id != $routeParams.game) {
            GameSelector.selectGame($routeParams.game);
        }
    });
}