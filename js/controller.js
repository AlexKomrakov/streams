var streamsApp = angular.module('dotaStreams', ['ngResource', 'ngSanitize', 'ngAnimate']);

streamsApp.factory('Streams', ['$resource', '$sce', function($resource, $sce) {
//	var firstChannel = rest().get();
	function rest () {
		return $resource('https://api.twitch.tv/kraken/streams', {}, {
            get: {method: 'JSONP', params: {callback: 'JSON_CALLBACK', game: 'Dota 2'}}
        });
	}
	function show (channelName) {
		if (!channelName)
			channelName = 'starladder1';
		return $sce.trustAsHtml('<object type="application/x-shockwave-flash" height="670" width="1140" id="live_embed_player_flash" data="http://www.twitch.tv/widgets/live_embed_player.swf?channel='+channelName+'" bgcolor="#000000"><param name="allowFullScreen" value="true" /><param name="allowScriptAccess" value="always" /><param name="allowNetworking" value="all" /><param name="movie" value="http://www.twitch.tv/widgets/live_embed_player.swf" /><param name="flashvars" value="hostname=www.twitch.tv&channel='+channelName+'&auto_play=true&start_volume=25" /></object>');
	}
	return {
		show: show,
		rest: rest
	};
}]);

streamsApp.controller('streamList',['Streams', '$scope', '$interval', function(Streams, $scope, $interval) {
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


// streamsApp.directive('match', function() {
//   return {
//     require: 'ngModel',
//     link: function(scope, elm, attrs, ctrl) {
//       scope.$watch(attrs.match, function(newValue, oldValue) {
//       	scope.match_newValue = newValue;
//     	console.log(scope.match_newValue);		
//     	console.log(scope.match_value);
//     	console.log("----");
    	
//     	if (scope.match_newValue == scope.match_value) {
//     		ctrl.$setValidity('pass_match', true);
//     	} else {
//     		ctrl.$setValidity('pass_match', false);
//     	}
//       });
//       ctrl.$parsers.unshift(function(viewValue) {     	
//        	scope.match_value = viewValue;
//     	console.log(scope.match_newValue);		
//     	console.log(scope.match_value);
//     	console.log("----");

//     	if (scope.match_newValue == scope.match_value) {
//     		ctrl.$setValidity('pass_match', true);
//     	} else {
//     		ctrl.$setValidity('pass_match', false);
//     	}
//       });
//     }
//   };
// });







// streamsApp.directive('match', function() {
//   return {
//     require: 'ngModel',
//     link: function(scope, elm, attrs, ctrl) {
//       ctrl.$parsers.unshift(function(viewValue) {
//         if (INTEGER_REGEXP.test(viewValue)) {
//           // it is valid
//           ctrl.$setValidity('integer', true);
//           return viewValue;
//         } else {
//           // it is invalid, return undefined (no model update)
//           ctrl.$setValidity('integer', false);
//           return undefined;
//         }
//       });
//     }
//   };
// });

