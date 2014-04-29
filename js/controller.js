var streamsApp = angular.module('dotaStreams', ['ngResource', 'ngSanitize', 'ngAnimate']);

streamsApp.service('Twitch', function ($resource) {
    var streams = [];
    this.getStreams = function () {
        return streams;
    }
    this.updatestreams = function () {
        var query = $resource('https://api.twitch.tv/kraken/streams', {}, {
            get: {method: 'JSONP', params: {callback: 'JSON_CALLBACK', game: 'Dota 2'}}
        });
        query.get().$promise.then(function (result) {
            streams.length = 0;
            //console.log(result);
            for (var i = 0; i < result.streams.length; i++) {
                streams.push(result.streams[i]);
            }
        });
    }

});

streamsApp.controller('streamList', function (Twitch, $scope, $interval) {
    $scope.config = {
        stream: '',
        startvolume: '50'
    };
    Twitch.updatestreams();
    $scope.list = Twitch.getStreams();
    //Twitch.updatestreams();
    $interval(function () {
        Twitch.updatestreams();
        //console.log($scope.list);
    }, 5 * 1000);
});

streamsApp.controller('games', function (Twitch, $scope) {

});

streamsApp.directive('stream', function () {
    //var startVolume = 25;  //Убрать или нет???
    return {
        restrict: 'E',
        scope: {
            config: '=config'
        },
        template: '<object type="application/x-shockwave-flash" height="670" width="1140" id="live_embed_player_flash" data="http://www.twitch.tv/widgets/live_embed_player.swf?channel={{config.stream.channel.name}}" bgcolor="#000000"><param name="allowFullScreen" value="true" /><param name="allowScriptAccess" value="always" /><param name="allowNetworking" value="all" /><param name="movie" value="http://www.twitch.tv/widgets/live_embed_player.swf" /><param name="flashvars" value="hostname=www.twitch.tv&channel={{config.stream.channel.name}}&auto_play=true&start_volume={{startvolume}}" /></object>'
    }
});