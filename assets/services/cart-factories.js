angular.module('cartFactoryApp', []).factory('$cartFactories', ['$http', '$rootScope', '$q', function($http, $rootScope, $q) {
	return {
			addToCart	: function addToCart (index) {
				var item 						= document.querySelectorAll('.item')[index]
					, itemData				= JSON.parse(item.getAttribute('data-item'));

				/*$http.post('/shop/cart/add', {
					id : itemData.id,
					qty: item.querySelector('.inp-qty').value
				}).success(function (data) {*/
				return $http({ // todo getjson
						'Content-type': 'application/json',
						'method'			: 'GET',
						'url'					: '/assets/services/data/cartitem-testdata.json'
				});
			}
		, removeItem: function removeItem(id){
				/*return $http.post('/shop/cart/delete', {
					id : id
				});*/
			}
		, removeSavedItem: function removeSavedItem(id){
				/*return $http.post('/shop/cart/deletesaved', {
					id : id
				});*/
			}
		, saveForLater: function saveForLater(id){
				/*return $http.post('/shop/cart/save', {
					id : id
				});*/
			}
		, updateQty: function updateQty(id, qty){
				/*$http.post('/shop/cart/update', {
						id 	: id
					, qty : qty
				});*/
			}
	};
}]);