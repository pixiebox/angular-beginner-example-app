ShopApp.controller('CartCtrl', ['$scope', '$rootScope', '$filter', '$location', /*'$cartData'*/'$shoppinglist', '$cartFactories', /*'$savedData'*/'$savelist',/*'cartlistData'*/'shoppinglistData', 'savedlistData',
	function($scope, $rootScope, $filter, $location, /*$cartData*/$shoppinglist, $cartFactories, /*$savedData*/$savelist, /*cartlistData*/shoppinglistData, savedlistData) {
		var shoppingStorage
		  , savedStorage
		  , qtyTimeout;

		$scope.linkAfrekenen = '#/afrekenen';
		$scope.items = /*cartlistData*/shoppinglistData.data;

		shoppingStorage = {'items' : $scope.items};
		pixieLib.localStorage.set('shoppingcart', shoppingStorage, '2 hours');

		$scope.subTotal = function () {
			var subTotal = 0;

			for (var i = 0; i < shoppingStorage.items.length; i++) {
				subTotal += (shoppingStorage.items[i].price - 0);
			}

			return subTotal.toFixed(2);
		};

		$scope.updateQty = function () {
			//shopBox.naarcart(true);
			//$cartFactories.addToCart(); todo
		};

		$scope.saved = savedlistData.data;
		savedStorage = {'items' : $scope.saved};

		$scope.saveForLater = function () {
			var item 				= angular.element(window.event.currentTarget).parent().parent().parent().parent()
			  , itemData 		= item.data('item')
			  , shoppingKey = item.index();

			//item.hide('slow');

			if (!pixieLib.getKeyByValue(savedStorage.items, itemData.id, 'id')) {
				savedStorage.items.push(shoppingStorage.items[shoppingKey]);
				pixieLib.localStorage.set('savedStorage', savedStorage);

				shopBox.bewaarWinkelItem(window.event, true);
			}
			
			shoppingStorage.items.splice(shoppingKey, 1);
			$scope.items.splice(shoppingKey, 1);

			pixieLib.localStorage.set('shoppingStorage', shoppingStorage);
		};

		$scope.cartItem = function () {
			var item			= angular.element(window.event.currentTarget).parent().parent().parent().parent()
			  , itemData	= item.data('item')
			  , saveKey 	= item.index() - 1;

			//item.hide('slow');

			if (!pixieLib.getKeyByValue(shoppingStorage.items, itemData.id, 'id')) {
				shoppingStorage.items.push(savedStorage.items[saveKey]);
				pixieLib.localStorage.set('shoppingStorage', shoppingStorage);
			}

			savedStorage.items.splice(saveKey, 1);
			pixieLib.localStorage.set('savedStorage', savedStorage);

			//shopBox.naarcart(window.event, true);
			$cartFactories.addToCart();
		};
	}
]);