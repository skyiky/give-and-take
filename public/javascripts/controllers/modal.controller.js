angular.module('app')
.controller('modalController', ['$scope', '$rootScope','$uibModal', '$uibModalInstance', '$http',
	function($scope, $rootScope, $uibModal, $uibModalInstance, $http) {
		$scope.didUserSubmit = false;
		$scope.showLoginError = false;
		$scope.showSuccess = false;
		$scope.loginError = "";
		$scope.username = "";
		$scope.password = "";

		$scope.close = function() {
			$uibModalInstance.close();
		};

		$scope.signin = function() {
			$scope.didUserSubmit = true;
			$scope.showLoginError = false;
			$scope.showSuccess = false;
			$scope.loginError = "";

			var request = {
				username: $scope.username,
				password: $scope.password
			};

			$http.post('auth/login', request).success(function (data) {
				if (data.state === 'fail') {
					$scope.didUserSubmit = false;
					$scope.showLoginError = true;
					$scope.showSuccess = false;
					$scope.loginError = 'Username or password is incorrect please try again.';
				} else if (data.state === 'success') {
					$scope.didUserSubmit = false;
					$scope.showLoginError = false;
					$scope.loginError = '';
					$rootScope.user = data.user;
					$uibModalInstance.close();
				} else {
					$scope.didUserSubmit = false;
					$scope.showLoginError = true;
					$scope.showSuccess = false;
					$scope.loginError = 'An error occured, please try again.';
				}
			}, function(err) {
				$scope.didUserSubmit = false;
				$scope.showLoginError = true;
				$scope.showSuccess = false;
				$scope.loginError = 'An error occured, please try again.';
			});
		};
	}]);