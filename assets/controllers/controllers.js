ShopApp.controller(
		'ListerCtrl'
	, [
			'$scope'
		, '$rootScope'
		, '$http'
		, '$filter'
		, '$timeout'
		, '$articlelist'
		, '$cartFactories'
		, '$location'
		, '$sharedFactories'
		, 'articlelistData'
		, 'History'
		, function($scope, $rootScope, $http, $filter, $timeout, $articlelist, $cartFactories, $location, $sharedFactories, articlelistData, History) {
				var direction
					, reOffset
					, orderProp = order = 'Category'
					, pageInUrl = window.location.href.match(/page=(\d+)/)
					, itemmax = 3
					, renderedcount = 0
					, pagecountFiltered = function() {
							return Math.ceil( $scope.itemsfiltered.length / $scope.itemsPerPage );
						}
					, pagecountListData = function() {
							return articlelistData.data.total_pages;
						};

				$scope.cartWidgetPath = '/partials/cart-widget.html';

				if (pageInUrl != null
				&& pageInUrl.length == 2){ // make sure the url is not ?page=
					$scope.startPage = pageInUrl[1] - 0;
					$scope.currentPage = $scope.startPage;
					reOffset = $scope.currentPage - 1;
				} else {
					pageInUrl = [];
					$scope.currentPage = 1;
					$scope.startPage = 1;
				}

				$scope.itemsfiltered = $scope.selected_cats = [];
				$scope.itemsPerPage = $scope.itemsPerPage || 9;
				$scope.limit = $scope.itemsPerPage;
				$scope.beginSyncDataset = 0;
				/**
				 * $scope.endSyncDataset - refresh clientside-JSON at around 1000 items
				 * 1. it could be any other number than 1000 items but keep performance in mind
				 * 2. when the number of items exceeds 1000, the search + filter + order functions
				 *    are asking for new data each time: $scope.resyncdata is true.
				 *    Otherwise it manipulates the data on client-side only: $scope.resyncdata is false.
				 */
				$scope.endSyncDataset = $scope.pagemarkerLeap = Math.ceil(1000 / $scope.itemsPerPage);
				$scope.resyncdata = $scope.filterCollapsed =$scope.navCollapsed = true;

				$scope.filterCategory = function() {
					var catIndexToRemove
						, requestData;

					if (this.category
					&& ($scope.selected_cats.indexOf(this.filter.value) == -1)) {
						$scope.selected_cats.push(this.filter.value);
					} else {
						catIndexToRemove = $scope.selected_cats.indexOf(this.filter.value);

						if (catIndexToRemove != -1) {
							$scope.selected_cats.splice(catIndexToRemove, 1);
						}
					}

					if ($scope.resyncdata) {
						$scope.currentPage = 1;
						requestData = $articlelist.promise({filter : JSON.stringify($scope.selected_cats)});
						requestData.then(function (data) {
							$scope.list_items = data.data.data_set;
							$scope.pageCount = function () {
								return data.data.total_pages;
							};
						});
					} else {
						$scope.queryFilter = function(item) {
							return $scope.selected_cats.length
								? _.contains($scope.selected_cats, item.category)
								: true;
						};

						if ($scope.selected_cats.length) {
							$scope.pageCount = pagecountFiltered;
							$scope.currentPage = 1;
							reOffset = 0;
						} else {
							$scope.pageCount = pagecountListData;
						}
					}
				};

				if ($scope.searchbar) {
					$scope.filterPath = '/partials/filter-angular.html';

					$sharedFactories.fetchJSON('GET', '/assets/services/data/filter-testdata.json'/*'/shop/api/filter'*/, {},
						function( data ) {
							$scope.sort_options = data.sort;
							$scope.categories = data.categories;
						}
					);
				}

				$scope.list_items = articlelistData.data.data_set;
				$scope.pageCount = pagecountListData;

				$scope.resyncdata = $scope.pageCount() > $scope.endSyncDataset;

				$scope.range = function () {
					var rangeSize = 9
						, ret = []
						, start
						, pageSpan;

					if ( $scope.currentPage < rangeSize ) {
						pageSpan = 0;
						start = 1;
					} else {
						pageSpan = Math.ceil(rangeSize / 2);
						start = $scope.currentPage - pageSpan;
					}

					if ($scope.pageCount() < rangeSize) {
						rangeSize = $scope.pageCount();
					}

					if ( start > $scope.pageCount() - rangeSize ) {
						start = $scope.pageCount() - rangeSize + 1;
					}

					for (var i = start; i < start + rangeSize; i++) {
						ret.push(i);
					}
					
					return ret;
				};

				$scope.getQty = function( num ) {
					var range = [];

					for (var i = 0; i < num; i++) {
						range.push(i + 1);
					}
					return range;
				};

				$scope.sortBy = function (column) {
					if ($scope.list_items.length) {
						var direction = orderProp == column ? 'asc' : 'desc';

						if (!$scope.resyncdata) {
							orderProp = order == column
								? -column
								: column;
							$scope.list_items = $filter('orderBy')($scope.list_items, orderProp);
						} else {
							var requestData = $articlelist.promise({
									direction	: direction
								, page 			: $scope.currentPage
								, sort 			: column.toLowerCase()
							});

							requestData.then(function(data) {
								$scope.list_items = data.data.data_set;
							});
						}

						angular.element(window.event.currentTarget)
							.addClass(direction)
							.removeClass((orderProp == column ? 'asc' : 'desc'));

						order = column;
					}
				};

				$scope.prevPage = function() {
					window.event.preventDefault();

					if (angular.element(window.event.currentTarget).hasClass('disabled')) return;
					if ($scope.currentPage > 0) {
						$scope.currentPage--;
					}
				};

				$scope.prevPageDisabled = function() {
					return $scope.currentPage === 1 ? "disabled" : "";
				};

				$scope.nextPage = function() {
					window.event.preventDefault();

					if (angular.element(window.event.currentTarget).hasClass('disabled')) return;

					if ($scope.currentPage < $scope.pageCount()) {
						$scope.currentPage++;

						$location.search('page', $scope.currentPage);
					}
				};
				$scope.nextPageDisabled = function() {
					return $scope.currentPage === $scope.pageCount() ? "disabled" : "";
				};

				$scope.setPage = function(n) {
					var getNextDataset = n > $scope.endSyncDataset
						, getPrevDataset = n < $scope.beginSyncDataset
						, dataParams
						, requestData;

					if (getNextDataset || getPrevDataset) {
						dataParams = $routeParams;
						dataParams.page = n;

						requestData = $articlelist.promise(dataParams);
						requestData.then(function(data) {
							$scope.list_items = data.data.data_set;
						});

						$scope.beginSyncDataset = n - (n % $scope.pagemarkerLeap);
						$scope.endSyncDataset = $scope.beginSyncDataset + $scope.pagemarkerLeap;

						reOffset = 0;
					}

					$scope.currentPage = n;

					window.event.preventDefault();
					$location.search('page', n);
				};

				$scope.getOffset = function() {
					return $scope.currentPage - 1 % $scope.pagemarkerLeap;
				};

				$scope.searchquery = {};
				$scope.filterText = '';

				var tempFilterText = ''
					, filterTextTimeout
					, paginator_reset = function () {
							$scope.currentPage = 1;
							reOffset = 0;
							$location.search('page', null);
						};

				$scope.$watch('searchquery.keyword', function (val) {
					if ($scope.resyncdata) {
						if (filterTextTimeout) $timeout.cancel(filterTextTimeout);

						var params = {}
							, requestData;

						tempFilterText = val;
						filterTextTimeout = $timeout(function() {
							if (val) {
								params.filter = JSON.stringify([tempFilterText]);
							} else {
								params.page = 1;
							}

							requestData = $articlelist.promise(params);
							requestData.then(function (data) {
								$scope.list_items = data.data.data_set;

								$scope.pageCount = val
									?	pagecountFiltered
									: pagecountListData;

								paginator_reset();
							});
						}, 350);
					} else {
						if (filterTextTimeout) $timeout.cancel(filterTextTimeout);

						tempFilterText = val;
						filterTextTimeout = $timeout(function() {
							$scope.filterText = tempFilterText;

							if (val) {
								$scope.pageCount = pagecountFiltered;

								paginator_reset();
							} else {
								$scope.pageCount = pagecountListData;
							}
						}, 350); // delay 350 ms
					}
				});

				$scope.cart = function (index) {
					var qty = document.querySelectorAll('.articles .item')[index].querySelector('.inp-qty').value;

					$cartFactories.addToCart(index).success(function (data) {
						if (!data.stock) { // data.stock = 0
							alert('Not in stock.');
						} else if (qty > data.stock) {
							var addRemaining;

							addRemaining = confirm (data.stock + ' items remaining in stock. Do you want to add ' + data.stock + ' to your cart?')
							data.qty = data.stock;

							if (addRemaining) {
								/*$http.post('/shop/cart/add', {
									id : itemData.id,
									qty: data.stock
								});*/
								$cartFactories.updateQty(data.id, data.stock);
							} else {
								return;
							}
						}

						if (data.action == 'update') {
							$scope.$broadcast('broadcastUpdateCartWidget', data);
						} else if (data.action == 'new') {
							$scope.$broadcast('broadcastAddCartWidget', data);
						}
					});
				};
			}
		]
).controller(
		'CartWidgetCtrl'
	, [
				'$scope'
			, '$rootScope'
			, '$cartFactories'
			, '$shoppinglist'
			, function($scope, $rootScope, $cartFactories, $shoppinglist) {
					var elCart = angular.element(document.querySelector('.cart-widget'))
						, widget_items;

					$shoppinglist.promise().success(function(data){
						widget_items = data;
						$scope.widget_items = widget_items;
					});

					$scope.removeItem = function removeItem(event, index){
						var id = event.currentTarget.getAttribute('data-id');

						$cartFactories.removeItem(id)/*.success(*/;
							widget_items.splice(index, 1);
						//});
					};

					$scope.$on('broadcastAddCartWidget', function(event, data){
						$scope.widget_items.push(data);
					});

					$scope.$on('broadcastUpdateCartWidget', function(event, data){
						var key = pixieLib.getKeyByValue(widget_items, data.id, 'id');
						widget_items[key].qty = data.qty;
					});
					
				}
		]
).controller(
		'DetailCtrl'
	, [
			'$scope'
		, 'articlelistData'
		, '$reviews'
		, '$routeParams'
		,	function ($scope, shoppinglistData, $reviews, $routeParams) {
				var items = shoppinglistData.data.data_set
					, reviewed;

				$scope.item = _.filter(items, function (item) {
					return item.id == $routeParams['id'];
				})[0];
				$scope.reviews = {};
				$scope.review = 0;
				$reviews.promise().success(function(data){
					$scope.reviews = data;
				});
				$scope.sendReview = function sendReview(value){
					if ($routeParams['id'] in $scope.reviews) {
						 console.log('already reviewed by client');
						 return;
					}

					$reviews.review($routeParams['id'], value);
				};
			}
		]
).controller(
		'CartCtrl'
	, [
			'$scope'
		, '$rootScope'
		, '$filter'
		, '$location'
		, '$shoppinglist'
		, '$cartFactories'
		, '$savelist'
		, 'shoppinglistData'
		, 'savedlistData'
		, function($scope, $rootScope, $filter, $location, $shoppinglist, $cartFactories, $savelist, shoppinglistData, savedlistData) {
				$scope.cart_items = shoppinglistData.data;

				$scope.subTotal = function () {
					var subTotal = 0;

					for (var i = 0; i < shoppinglistData.data.length; i++) {
						subTotal += (shoppinglistData.data[i].price - 0);
					}

					return subTotal.toFixed(2);
				};

				$scope.updateQty = function () {
					$cartFactories.updateQty();
				};

				$scope.saved_items = savedlistData.data;

				$scope.saveForLater = function (index) {
					var item 			= angular.element(document.querySelectorAll('.cart-item')).eq(index)
						, itemData 	= JSON.parse(item.attr('data-item'))
						, key				= pixieLib.getKeyByValue(shoppinglistData.data, itemData.id, 'id');

					$cartFactories.saveForLater();//.success(function(){
						if (!pixieLib.getKeyByValue(savedlistData.data, itemData.id, 'id')) {
							$cartFactories.saveForLater(itemData.id);
							savedlistData.data.push(itemData);
						}

						shoppinglistData.data.splice(index, 1);
					//});
				};

				$scope.moveToCart = function moveToCart(index) {
					var item			= angular.element(document.querySelectorAll('.saved-for-later')).eq(index)
						, itemData	= JSON.parse(item.attr('data-item'));

					$cartFactories.addToCart(index).success(function(){
						$cartFactories.removeSavedItem(itemData.id);
						savedlistData.data.splice(index, 1);
						$scope.cart_items.push(itemData);
					});
				};

				$scope.removeItem = function removeItem(event, index){
					var id = event.currentTarget.getAttribute('data-id');

					$cartFactories.removeItem(id)/*.success(*/;
						shoppinglistData.data.splice(index, 1);
					//});
				};

				$scope.removeSavedItem = function removeSavedItem(event, index){
					var id = event.currentTarget.getAttribute('data-id');

					$cartFactories.removeSavedItem(id)/*.success(*/;
						savedlistData.data.splice(index, 1);
					//});
				};
			}
		]
);