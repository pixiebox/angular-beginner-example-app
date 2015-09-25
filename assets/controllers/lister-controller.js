ShopApp.controller(
	'ListerCtrl'
  , ['$scope', '$rootScope', '$http', '$filter', '$timeout', '$sharedFactories', /*'$shopData'*/'$articlelist', '$cartFactories', /*'shoppinglistData'*/'articlelistData', 'History', '$routeParams', '$location'
  , function($scope, $rootScope, $http, $filter, $timeout, $sharedFactories, /*$shopData*/$articlelist, $cartFactories, /*shoppinglistData*/articlelistData, History, $routeParams, $location) {
		var direction
		  , reOffset
		  , orderProp = order = 'Categorie'
		  //, infinite = $('[infinite-scroll]').length
		  , pageInUrl = window.location.href.match(/page=(\d+)/)
		  , itemmax = 3
		  , renderedcount = 0;

		$rootScope.skipOnPageload = false;

		/*$scope.$on('$includeContentLoaded', function(event) {
			renderedcount++;
			if (renderedcount == itemmax) shopBox.init();
		});*/

		$scope.cartWidgetPath = '/partials/cart-widget.html';

		if (pageInUrl != null
		&& pageInUrl.length == 2) {
			$rootScope.skipOnPageload = true;
			$scope.startPage = pageInUrl[1] - 0;
			$scope.currentPage = $scope.startPage;
			reOffset = $scope.currentPage - 1;
		} else {
			pageInUrl = [];
			$scope.currentPage = 1;
			$scope.startPage = 1;
		}

		$scope.linkCart 		= '#/cart';

		$scope.itemsfiltered 		= $scope.categories = [];
		$scope.itemsPerPage 		= $scope.itemsPerPage || 9;
		$scope.limit 						= $scope.itemsPerPage;
		$scope.beginSyncDataset = 0;
		$scope.endSyncDataset		= Math.ceil(1000 / $scope.itemsPerPage); // refresh clientside-JSON at around 1000 items
		$scope.pagemarkerLeap 	= $scope.endSyncDataset;
		$scope.relayoutAtItems 	= 250 - (250 % $scope.itemsPerPage); // around 250 
		$scope.resyncdata 			= false;

		$scope.filterCategory = function() {
			var indexToRemove
			  , requestData;

			if (angular.element(this)[0].category
			&& ($scope.categories.indexOf(angular.element(this)[0].filter.value) == -1)) {
				$scope.categories.push(angular.element(this)[0].filter.value);
			} else {
				indexToRemove = $scope.categories.indexOf(angular.element(this)[0].filter.value);

				if (indexToRemove != -1) {
					$scope.categories.splice(indexToRemove, 1);
				}
			}

			if ($scope.resyncdata) {
				$scope.currentPage = 1;
				requestData = /*$shopData*/$articlelist.promise({filter : JSON.stringify($scope.categories)});
				requestData.then(function (data) {
					$scope.items = data.data.data_set;
					$scope.pageCount = function () {
						return data.data.total_pages;
					};
				});
				//console.log($scope.items);
			} else {
				$scope.queryFilter = function(item) {
					return $scope.categories.length ? _.contains($scope.categories, item.categorie) : true;
				};
			}
		};

		if ($scope.searchbar) {
			$scope.filterPath = '/partials/filter-angular.html';

			$sharedFactories.fetchJSON('GET', '/services/filter-testdata.json'/*'/shop/api/filter'*/, {},
				function( data ) {
					$scope.sortOptions = data.sort;
					$scope.categorieen = data.categorieen;
				}
			);
		}

		$scope.items = /*shoppinglistData*/articlelistData.data.data_set;
		$scope.pageCount = function() {
			return /*shoppinglistData*/articlelistData.data.total_pages;
		};

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

			for(var i = 0; i < num; i++) {
				range.push(i + 1);
			}
			return range;
		};
		
		$scope.toggleSortBy = function () {
			var filterBlock = angular.element(document.querySelector('.search-container .sortby'));

			filterBlock.toggleClass('open');
		};
		
		$scope.sortBy = function (column) {
			if ($scope.items.length) {
				var direction = orderProp == column ? 'asc' : 'desc';

				if (!$scope.resyncdata) {
					orderProp = order == column
						 ? -column
						 : column;
					$scope.items = $filter('orderBy')($scope.items, orderProp);
				} else {
					var requestData = /*$shopData*/$articlelist.promise({
						page 		: $scope.currentPage
					  , sort 		: column.toLowerCase()
					  , direction	: direction
					});
					requestData.then(function(data) {
						$scope.items = data.data.data_set;
					});

				}
				angular.element(window.event.currentTarget).addClass(direction).removeClass((orderProp == column ? 'asc' : 'desc'));
				order = column;
			}
		};

		$scope.url = ($routeParams.hasOwnProperty('category')
			? '/' + $routeParams.category
			: '');
		
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

			if (angular.element(window.event.currentTarget).hasClass('disabled')) return;/* preventDefault()*/;
			if ($scope.currentPage < $scope.pageCount()) {
			  $scope.currentPage++;
			//	$scope.currentPage = n;

			/*if (infinite) {
				reOffset = n - 1;
				$scope.startPage = $scope.currentPage;
			}*/

//				window.event.preventDefault();
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

				requestData = /*$shopData*/$articlelist.promise(dataParams);
				requestData.then(function(data) {
					$scope.items = data.data.data_set;
				});

				$scope.beginSyncDataset = n - (n % $scope.pagemarkerLeap);
				$scope.endSyncDataset = $scope.beginSyncDataset + $scope.pagemarkerLeap;

				reOffset = 0;
			}

			$scope.currentPage = n;

			/*if (infinite) {
				reOffset = n - 1;
				$scope.startPage = $scope.currentPage;
			}*/

			window.event.preventDefault();
			$location.search('page', n);
		};

		$scope.busy = false;

		/*$scope.loadMore = function () {
			if (!$scope.items.length
			|| $rootScope.skipOnPageload
			|| ($scope.scrollDirection == 'down' && $scope.currentPage == $scope.pageCount())
			|| ($scope.scrollDirection == 'up' && $scope.currentPage == 1)
			|| $scope.busy)
				return;

			var getNextDataset
			  , getPrevDataset
			  , itemOffset
			  , itemToOffset
			  , offsetTop
			  , params
			  , requestData;

			$scope.busy = true;

			if ($scope.scrollDirection == 'up') {
				$scope.currentPage--;
				$('ng-busy').removeClass('busy-bottom').addClass('busy-top');
			} else if ($scope.scrollDirection == 'down') {
				$scope.currentPage++;
				$('ng-busy').removeClass('busy-top').addClass('busy-bottom');
			}

			getNextDataset = $scope.currentPage > $scope.endSyncDataset;
			getPrevDataset = $scope.currentPage < $scope.beginSyncDataset;

			if (getNextDataset || getPrevDataset) {
				params = {};
				params.page = getNextDataset
					? $scope.currentPage
					: $scope.beginSyncDataset - $scope.pagemarkerLeap;

				if ($scope.order) {
					params.sort = $scope.order;
					params.order = 'desc';
				}

				requestData = \/*$shopData*\/$articlelist.promise(params);
				requestData.then(function(data) {
					reOffset = 0;
					$scope.items = data.data.data_set; 
					$scope.offset = 0;
					$scope.startPage = $scope.currentPage;

					if (getNextDataset) {
						$scope.endSyncDataset += $scope.pagemarkerLeap;
					} else if (getPrevDataset) {
						$scope.beginSyncDataset -= $scope.pagemarkerLeap;
					}

					disable_scroll();

					$scope.$on('itemsReady', function(event, index) {
						offsetTop;

						if ($scope.scrollDirection == 'down') {
							offsetTop = $('[infinite-scroll]').offset().top + 1;
						} else {
							itemOffset = $('[infinite-scroll] .ng-scope').last().offset().top;

							offsetTop = itemOffset - 
								($(document).height() - itemOffset)
								+ $('[infinite-scroll]').offset().top - 1;
						}

						enable_scroll();
						$(window).scrollTop(offsetTop);
						$scope.busy = false;
					});
				});
			} else {
				offsetTop = 0;

				if ($scope.limit < $scope.relayoutAtItems) {
					if ($scope.scrollDirection == 'up') {
						if ($scope.currentPage < $scope.startPage) {
							reOffset = $scope.currentPage - 1;
							$scope.offset = reOffset * $scope.itemsPerPage;
						}

						$scope.limit += $scope.itemsPerPage;
						if ($scope.startPage > 1) $scope.startPage--;

						disable_scroll();

						$scope.$on('itemsReady', function(event, index) {
							offsetTop = $('[infinite-scroll] > .ng-scope').eq($scope.itemsPerPage - 1).offset().top - 11;
							enable_scroll();
							$(window).scrollTop(offsetTop);
							$scope.busy = false;
						}, 100);
					}

					if ($scope.scrollDirection == 'down') {
						$scope.limit += $scope.itemsPerPage;
						$scope.busy = false;
					}
				} else {
					if ($scope.scrollDirection == 'down') {
						offsetTop = $('[infinite-scroll]').offset().top + 1;
						reOffset = $scope.currentPage - 1;

						$scope.offset = reOffset*$scope.itemsPerPage;
						$scope.limit = $scope.itemsPerPage;
						
						disable_scroll();

						$scope.$on('itemsReady', function(event, index) {
							enable_scroll();
							$(window).scrollTop(offsetTop);
							$scope.busy = false;
						}, 100);
					} else if (reOffset && $scope.scrollDirection == 'up') {
						reOffset = $scope.currentPage - 1;

						$scope.offset = reOffset * $scope.itemsPerPage;
						$scope.limit = $scope.itemsPerPage;

						disable_scroll();

						$scope.$on('itemsReady', function(event, index) {
							itemToOffset = $('[infinite-scroll] .ng-scope').eq($scope.itemsPerPage - 1).offset().top;

							offsetTop = itemToOffset - 
								($(document).height() - itemToOffset)
								+ $('[infinite-scroll]').offset().top - 1;

							enable_scroll();

							$(window).scrollTop(offsetTop);

							$scope.busy = false;
						}, 100);
					}
				}
			}
		};*/

		$scope.getOffset = function() {
			return $scope.currentPage - 1 % $scope.pagemarkerLeap;
		};

	/*	$scope.lineInView = function(index, inview, inviewpart, event) {
			var dataPage = event.inViewTarget.getAttribute('data-page') - 0;

			if (!$rootScope.skipOnPageload
			&& dataPage >= $scope.startPage
			&& dataPage <= ($scope.limit / $scope.itemsPerPage) + $scope.startPage) {
				if ($scope.scrollDirection === 'up'
				&& inviewpart === 'top'
				&& $('[data-page="' + (dataPage - 1) + '"]').length
				&& dataPage > 1) {
					$scope.currentPage = dataPage - 1;
				} else if ($scope.scrollDirection === 'down'
				&& inviewpart === 'bottom'
				&& $('[data-page="' + (dataPage + 1) + '"]').length){
					$scope.currentPage = dataPage;
				}
			}
			return false;
		};*/

		$scope.searchquery = {};
		$scope.filterText = '';

		var tempFilterText = '',
			filterTextTimeout;

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

					requestData = /*$shopData*/$articlelist.promise(params);
					requestData.then(function (data) {
						$scope.items = data.data.data_set;

						if (val) {
							$scope.pageCount = function() {
								return Math.ceil( $scope.itemsfiltered.length / $scope.itemsPerPage );
							};
						} else {
							$scope.pageCount = function() {
								return /*shoppinglistData*/articlelistData.data.total_pages;
							};
						}
						$scope.currentPage = 1;
						reOffset = 0;
					});
				}, 350);
			} else {
				if (filterTextTimeout) $timeout.cancel(filterTextTimeout);

				tempFilterText = val;
				filterTextTimeout = $timeout(function() {
					$scope.filterText = tempFilterText;
					if (val) {
						$scope.pageCount = function() {
							return Math.ceil( $scope.itemsfiltered.length / $scope.itemsPerPage );
						};
						$scope.currentPage = 1;
						reOffset = 0;
					} else {
						$scope.pageCount = function() {
							return /*shoppinglistData*/articlelistData.data.total_pages;
						};
					}
				}, 350); // delay 350 ms
			}
		});
	/*	
		$scope.followPagenumber = function (index) {
			return $scope.startPage + Math.ceil((index + 1) / $scope.itemsPerPage) - 1;
		};
	*/	
		$scope.wishlist = function () {
			if ($rootScope.authenticated) {
				shopBox.naarWenslijst();
			} else {
				$location.path('login');
				$location.search('page', null)
			}
		};
		
		$scope.cart = function () {
			//shopBox.naarcart(true);
			var data = $cartFactories.addToCart();
			// todo http://stackoverflow.com/questions/9293423/can-one-controller-call-another naarcart overzetten naar cart service
		};

		//$scope.$on('$includeContentLoaded', shopBox.init);
		//$scope.$on('$routeChangeSuccess', shopBox.init);
		//$scope.$on('$viewContentLoaded', shopBox.init);
	}
]);