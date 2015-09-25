ShopApp.controller('DetailCtrl', ['$scope', 'shoppinglistData', '$routeParams',
	function ($scope, shoppinglistData, $routeParams) {
		var items = shoppinglistData.data.data_set;

		$scope.item = _.filter(items, function (item) {
			return item.id == $routeParams['id'];
		})[0];
	}
]);