var streamsApp = angular.module('dotaStreams', ['ngResource', 'ngSanitize', 'ngAnimate']);

streamsApp
    .config(Config)
    .filter('empty', Empty)
    .service('Twitch', Twitch)
    .service('SteamApi', SteamApi)
    .service('GameSelector', GameSelector)
    .controller('streamList', streamList)
    .directive('stream', Stream);

function Config($httpProvider, $interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');

    //Enable cross domain calls
    $httpProvider.defaults.useXDomain = true;

    //Remove the header used to identify ajax call  that would prevent CORS from working
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
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
    var game         = { id: "Dota 2" };
    GameSelector.getGameList = function() { return gameList; };
    GameSelector.getGame     = function() { return game; };
    GameSelector.selectGame  = function(game_id) {
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
        template: '<object type="application/x-shockwave-flash" height="670" width="1140" id="live_embed_player_flash" data="http://www.twitch.tv/widgets/live_embed_player.swf?channel={{config.stream.channel.name}}" bgcolor="#000000"><param name="allowFullScreen" value="true" /><param name="allowScriptAccess" value="always" /><param name="allowNetworking" value="all" /><param name="movie" value="http://www.twitch.tv/widgets/live_embed_player.swf" /><param name="flashvars" value="hostname=www.twitch.tv&channel={{config.stream.channel.name}}&auto_play=true&start_volume={{startvolume}}" /></object>'
    }
}

function streamList(Twitch, SteamApi, $scope, $interval, GameSelector) {
    $scope.games = GameSelector.getGameList();
    $scope.changeGame = GameSelector.selectGame;
    $scope.config = {
        stream: '',
        startvolume: '50'
    };
    $scope.streamsContainer = Twitch.getStreams();
    $scope.gamesContainer = SteamApi.getGames();
    $interval(function () { Twitch.updateStreams(); SteamApi.updateGames(); }, 60 * 1000);
}