ShopApp.controller(
	'minicart'
  , ['$scope', '$rootScope'
  , function($scope, $rootScope) {
			//$scope.childOnLoad = function () {
				var shoppingStorage;

				var elCart = angular.element(document.querySelector('.minicart'));
				//var elWishlist = $('.miniwishlist');
				shoppingStorage = pixieLib.localStorage.get('shoppingcart');

				if (shoppingStorage !== null ) {
					angular.element(elCart[0].querySelector('.btn-view-cart')).removeClass('hidden');
					angular.element(elCart[0].querySelector('.msg-cart-empty')).addClass('hidden');
					angular.element(elCart[0].querySelector('.cart-qty')).html(shoppingStorage.items.length);

					var template = document.getElementById('shoppingitem');
					for (var i = 0; i < shoppingStorage.items.length; i++) {
						var template = _.template( angular.element(template).html(), shoppingStorage.items[i]);
						elCart.find('ul').append(template);
					}
				}
			//}
	}
]);