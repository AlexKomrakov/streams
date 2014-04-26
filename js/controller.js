var streamsApp = angular.module('dotaStreams', ['ngResource', 'ngSanitize']);
 
streamsApp.factory('Streams', ['$resource', '$sce', function($resource, $sce) {
//	var firstChannel = rest().get();
	function rest () {
		return $resource('https://api.twitch.tv/kraken/streams', {}, {
			get: {method:'JSONP', params: {game:'Dota 2', callback: 'JSON_CALLBACK'}}
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
	$scope.firstlist = Streams.rest().get();
	$scope.list = Streams.rest().get();
  	$interval(function () {
  		$scope.list = Streams.rest().get();
  	}, 30000);
  	$scope.changeStream = function (channelName) {
  		console.log(channelName);
  		//$scope.activeStream = channelName;
  	};
  	//$scope.activeStream = Streams.show();
}]);

streamsApp.directive('match', function() {
  return {
    require: 'ngModel',
    scope: { par:'=match' },
    link: function(scope, elm, attrs, ctrl) {
      scope.$watch('par', function(newValue) {
    	if (newValue == ctrl.$viewValue) {
    		ctrl.$setValidity('pass_match', true);
    	} else {
    		ctrl.$setValidity('pass_match', false);
    	}
      });
      ctrl.$parsers.unshift(function(viewValue) { 
    	if (scope.par == ctrl.$viewValue) {
    		ctrl.$setValidity('pass_match', true);
    		return viewValue;
    	} else {
    		ctrl.$setValidity('pass_match', false);
    		return viewValue;
    	}
	  });
    }
  };
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

