var streamsApp = angular.module('dotaStreams', ['ngResource', 'ngSanitize', 'ngAnimate', 'ngRoute']);

streamsApp
    .config(Config)
    .filter('empty', Empty)
    .service('Twitch', Twitch)
    .service('SteamApi', SteamApi)
    .service('GameSelector', GameSelector)
    .controller('streamList', streamList)
    .directive('stream', Stream);

function Config($interpolateProvider, $routeProvider, $locationProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
    $routeProvider
        .when('/:game', {
                controller: streamList,
                templateUrl: 'template.html'
            })
        .when('/', {
                controller: streamList,
                templateUrl: 'template.html'
            })
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
    var gameList     = [ "Counter-Strike: Global Offensive", "Dota 2" ];
    var game         = { id: "" };
    GameSelector.getGameList = function() { return gameList; };
    GameSelector.getGame     = function() { return game; };
    GameSelector.selectGame  = function(game_id) {
        if (gameList.indexOf(game_id) == -1) {
            game_id = gameList[0];
        }
        game.id = game_id;
        $rootScope.$broadcast("changeGame");
    }
}

function Twitch($rootScope, $resource, GameSelector) {
    var Twitch = this;
    var data = { streams: [] };
    var game = GameSelector.getGame();
    var TwitchAPI = $resource('https://api.twitch.tv/kraken/streams', {}, {
        get: {method: 'JSONP', params: {callback: 'JSON_CALLBACK'}}
    });
    $rootScope.$on('changeGame', function(){ Twitch.updateStreams(); });
    this.updateStreams = function() {
        TwitchAPI.get({game: game.id}).$promise.then(function (result) {
            if ('streams' in result && (typeof result.streams[0] != 'undefined')) data.streams = result.streams;
        });
    };
    this.getStreams = function() {
        Twitch.updateStreams();
        return data;
    };
}

function SteamApi($resource) {
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
}

function Stream() {
    return {
        restrict: 'E',
        scope: { config: '=config' },
        template: '<object type="application/x-shockwave-flash" height="670" width="1140" id="live_embed_player_flash" data="http://www.twitch.tv/widgets/live_embed_player.swf?channel={{config.stream.channel.name}}" bgcolor="#000000"><param name="allowFullScreen" value="true"/><param name="allowScriptAccess" value="always" /><param name="allowNetworking" value="all" /><param name="movie" value="http://www.twitch.tv/widgets/live_embed_player.swf" /><param name="flashvars" value="hostname=www.twitch.tv&channel={{config.stream.channel.name}}&auto_play=true&start_volume={{startvolume}}"/></object>'
    }
}

function streamList(Twitch, SteamApi, $scope, $interval, GameSelector, $routeParams) {
    GameSelector.selectGame($routeParams.game);
    $scope.games = GameSelector.getGameList();
    $scope.activeGame = GameSelector.getGame();
    $scope.config = {
        stream: '',
        startvolume: '50'
    };
    $scope.streamsContainer = Twitch.getStreams();
    $scope.gamesContainer = SteamApi.getGames();
    $interval(function () { Twitch.updateStreams(); SteamApi.updateGames(); }, 60 * 1000);
}