/* global factories */

angular.module('sharedFactoryApp', []).factory('$sharedFactories', ['$http', '$rootScope', '$q', function($http, $rootScope, $q) {
	var myData = null;

	return {
		resetScope : function ($scope) {
			$scope.endmarkerSyncDataset = $scope.pagemarkerLeap;
			$scope.currentPage = 1;
			reOffset = 0;
			$scope.limit = $scope.itemsPerPage;
		},
	
		fetchJSON : function (method, requestUrl, params, callback) {
			$http({method: 'GET', url: requestUrl, params : params}).success(callback);
		},
	};
}]).factory('History', function($rootScope) {
	// note dit is meer voor ajaxrequests
	// resource https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Manipulating_the_browser_history/Example
	// resource https://github.com/giabao/mdn-ajax-nav-example
	var StateQueue = []
	  , StatePointer = 0
	  , State = undefined;

	window.onpopstate = function(e){
		// called when back button is pressed
		State = StateQueue.pop();
		State = (State)?State:{};
		StatePointer = (StatePointer)?StatePointer-1:0;
		$rootScope.$broadcast('historyStateChanged', State);

		window.onpopstate = window.onpopstate;
		
	}
	return {
		replaceState : function(data, title, url) {
			// replace current state
			var State = this.state();
			State = {state : data};
			window.history.replaceState(State,title,url);
			StateQueue[StatePointer] = State;
			$rootScope.$broadcast('historyStateChanged', this.state());
		},
		pushState : function(data, title, url){
			// push state and increase pointer
			var State = this.state();
			State = {state : data};
			window.history.pushState(State,title,url);
			StateQueue.push(State);
			$rootScope.$broadcast('historyStateChanged', this.state());
			StatePointer ++;
		},
		fakePush : function(data, title, url) {
			// call this when you do location.url(url)
			StateQueue.push((StateQueue.length - 1 >= 0)?StateQueue[StateQueue.length -1]:{});
			StatePointer ++;
			$rootScope.$broadcast('historyStateChanged', this.state());
		},
		state : function() {
			// get current state
			return (StateQueue[StatePointer])?StateQueue[StatePointer]:{};
		},
		popState : function(data) {
			// TODO manually popState
		},
		back : function(data) {
			// TODO needed for iphone support since iphone doesnt have a back button
		}
	}
});