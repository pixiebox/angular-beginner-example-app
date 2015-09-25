var ShopApp = angular.module('ShopApp',[
	//'ngAnimate'
		'ListerAppFilters'
	, 'sharedFactoryApp'
	, 'cartFactoryApp'
	, 'articles'
	, 'customerData'
	, 'ngRoute'
//, 'itemsReady'
	, 'bindHtmlDirective'
	, 'ui.bootstrap' // @link http://angular-ui.github.io/bootstrap/
]).config(['$routeProvider', '$httpProvider', '$locationProvider', function($routeProvider, $httpProvider, $locationProvider) {
	$httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
	$locationProvider.hashPrefix('!');

	// @link http://jonsamwell.com/url-route-authorization-and-security-in-angular/
	$routeProvider
		.when('/list',
			{
				templateUrl : 'partials/list.html',
				controller 	: 'ListerCtrl',
				reloadOnSearch : false,
				resolve : {
					articlelistData : function($articlelist) {
						/*
						sharedFactoryAppData will also be injectable in your controller,
						if you don't want this you could create a new promise with the $q service
						*/
						return $articlelist.promise();
					}
				}
			}
		)
		.when('/detail/:id', //:id?
			{
				templateUrl	: 'partials/detail.html',
				controller	: 'DetailCtrl',
				css 		: ['/assets/min/star-rating.min.css'],
				resolve 	: {
					articlelistData : function($articlelist){
						/*
						sharedFactoryAppData will also be injectable in your controller,
						if you don't want this you could create a new promise with the $q service
						*/
						return $articlelist.promise();
					}
				}
			}
		).when('/cart',
			{
				templateUrl 	: 'partials/cart.html',
				controller 		: 'CartCtrl',
				reloadOnSearch 	: false,
				resolve 		: {
					shoppinglistData : function ($shoppinglist) {
						/*
						sharedFactoryAppData will also be injectable in your controller,
						if you don't want this you could create a new promise with the $q service
						*/
						return $shoppinglist.promise();
					}
				  , savedlistData : function ($savelist) {
						return $savelist.promise();
				    }
				}
			}
		)
		.otherwise({ redirectTo : '/list' });
}]);