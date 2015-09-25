ShopApp.controller('authCtrl', function ($scope, $rootScope, $routeParams, $location, $http, Data, toaster) {
	$scope.pop = function(){
		toaster.pop('success','login',"/assets/services/partials/login.html", 0, 'template');
	};
	//initially set those objects to null to avoid undefined error
	$scope.login = {};
	$scope.signup = {};
	$scope.doLogin = function (customer) {
		Data.post('login', {
			customer: customer
		}).then(function (results) {
			Data.toast(results);

			if (results.status == "success") {
				$location.path('cart');
			} else {
				alert('Login fail.');
			}
		});
	};
	$scope.signup = {email:'',password:'',name:'',phone:'',address:''};
	$scope.signUp = function (customer) {
		Data.post('register', {
			customer: customer
		}).then(function (results) {
			Data.toast(results);
			if (results.status == "success") {
				$location.path('dashboard');
			}
		});
	};
	$scope.logout = function () {
		Data.get('logout').then(function (results) {
			Data.toast(results);
			$location.path('login');
		});
	}
});