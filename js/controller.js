var streamsApp = angular.module('dotaStreams', ['ngResource', 'ngSanitize', 'ngAnimate']);

streamsApp.config(function($httpProvider) {
    //Enable cross domain calls
    $httpProvider.defaults.useXDomain = true;

    //Remove the header used to identify ajax call  that would prevent CORS from working
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
});

streamsApp.filter('empty', function() {
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
);

streamsApp.service('Twitch', function ($resource) {
    var TwitchAPI = $resource('https://api.twitch.tv/kraken/streams', {}, {
        get: {method: 'JSONP', params: {callback: 'JSON_CALLBACK', game: 'Dota 2'}}
    });
    var data = { streams: [] };
    this.updateStreams = function() {
        TwitchAPI.get().$promise.then(function (result) {
            if ('streams' in result && (typeof result.streams[0] != 'undefined')) data.streams = result.streams;
        });
    };
    this.getStreams = function() {
        this.updateStreams();
        return data;
    };
});

streamsApp.service('SteamApi', function ($resource){
    var SteamApi = $resource('/live.php');
    var data = { games: [] };
    this.updateGames = function() {
        SteamApi.get().$promise.then(function(response){
            if ('result' in response) data.games = response.result.games;
        })
    };
    this.getGames = function() {
        this.updateGames();
        return data;
    };
});

streamsApp.controller('streamList', function (Twitch, SteamApi, $scope, $interval) {
    $scope.config = {
        stream: '',
        startvolume: '50'
    };
    $scope.streamsContainer = Twitch.getStreams();
    $scope.gamesContainer = SteamApi.getGames();
    $interval(function () { Twitch.updateStreams(); SteamApi.updateGames(); }, 5 * 1000);
});

streamsApp.directive('stream', function () {
    return {
        templateUrl: "video.tmp",
        restrict: 'E',
        scope: { config: '=config' }
    }
});