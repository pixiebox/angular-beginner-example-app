ShopApp.controller(
	'AfrekenenCtrl'
  , ['$scope', '$rootScope', '$http', '$filter', '$sharedFactories', /*'$addressData'*/'$addresslist', 'addresslistData', 'History', '$location'
  , function($scope, $rootScope, $http, $filter, $sharedFactories, /*$addressData*/$addresslist, addresslistData, History, $location) {
		$scope.subTotal = function () {
			var subTotal = 0;

			shoppingStorage = pixieBox.localStorage.get('shoppingcart');

			if (shoppingStorage) {
				for (var i = 0; i < shoppingStorage.items.length; i++) {
					subTotal += (shoppingStorage.items[i].prijs - 0);
				}
			}

			return subTotal//.toFixed(2);
		};

		$scope.payment;
		$scope.shipping;
		var shippingPrices = [];

		$('[name="verzendwijze"]').each(function () {
			var el = $(this)
			  , price = el.data('price')
			  , value = el.val();

			shippingPrices[value] = price;
		});

		$scope.total = 0;
		$scope.$watch('shipping', function (value) {
			$scope.total = (shippingPrices[value] || 0) + $scope.subTotal();
		});
		$scope.adressen = addresslistData.data.data_set;

		$scope.frmSubmit = function () {
			window.event.preventDefault();
		};

		$scope.payment = function () {
			//window.event.preventDefault();

			var form 			= $('.afrekenenForm')
			  , elBetaalwijze 	= $('select[name="betaalwijze"]', form)
			  , betaalwijze 	= elBetaalwijze.val();

			if (betaalwijze !== '') {
				var isValidData = $('.toevoegenAdres').is(':visible')
						? pixieBox.validate(form, true)
						: pixieBox.validate(form)
				  , afleveradres = $('input[name="afleveradres"]', form).val()
				  , toevoeging
				  , url = '/shop/cart/afleveradres'
				      + '?modus=' + (afleveradres === '0' ? 'unset' : 'set')
					  + (afleveradres !== '0' ? ('&id=' + afleveradres) : '')
				  , serversideValidate;

				if (isValidData) {
					/*if (typeof isValidData === 'object') {
						toevoeging = $('input[name="toevoeging"]', form).val();
						isValidData['toevoeging'] = toevoeging;
						isValidData = JSON.stringify(isValidData);
						serversideValidate = adresToevoegen(isValidData);
						
					}*/

					if (/*serversideValidate || */isValidData/* === true*/) {
						$.ajax({
							async     : false
						  , dataType  : 'html'
						  , url       : '/shop/afrekenen/' + betaalwijze
						}).done(function (r) {
							r = JSON.parse(r);

							$('.stap2').show();
							$('#betaalFrm').html(r.betaalForm);
						});

						/*$.ajax({
							async: false
						  , url: url
						});*/
					}
				} else {
					elBetaalwijze.val('');
					$scope.paymentmethod = '';
				}
			} else {
				alert('Kies een betaalwijze.');
			}
		};
	}
]);