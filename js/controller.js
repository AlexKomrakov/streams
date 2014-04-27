var streamsApp = angular.module('dotaStreams', ['ngResource', 'ngSanitize', 'ngAnimate']);

streamsApp.factory('Streams', ['$resource', '$sce', function ($resource, $sce) {
    function rest() {
        return $resource('https://api.twitch.tv/kraken/streams', {}, {
            get: {method: 'JSONP', params: {callback: 'JSON_CALLBACK', game: 'Dota 2'}}
        });
    }

    return {
        rest: rest
    };
}]);

streamsApp.controller('streamList', ['Streams', '$scope', '$interval', function (Streams, $scope, $interval) {
    $scope.config = {
        stream: '',
        startvolume: '50'
    }
    $scope.list = Streams.rest().get({}, function (data) {
        $scope.config.stream = data.streams[0];
    });

    $interval(function () {
        console.log('updating');
        Streams.rest().get({}, function (data) {
            console.log('success');
            $scope.list = data;
        });
    }, 60000);
}]);

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