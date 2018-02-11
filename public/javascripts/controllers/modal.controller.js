angular.module('app')
.controller('modalController', ['$scope', '$rootScope','$uibModal', '$uibModalInstance', '$http', 'user', 'post',
	function($scope, $rootScope, $uibModal, $uibModalInstance, $http, user, post) {
		$scope.didUserSubmit = false;
		$scope.showLoginError = false;
		$scope.showPostingError = false;
		$scope.loginError = "";
		$scope.postingError = "";
		$scope.username = "";
		$scope.password = "";
		$scope.location = "";
		$scope.description = "";
		$scope.selectedTypes = [];
		$scope.user = user;
		$scope.post = post;
		$scope.types = [
		{
			name: 'Food',
			value: 0,
			ticked: false
		},
		{
			name: 'Shelter',
			value: 1,
			ticked: false
		},
		{
			name: 'Clothes',
			value: 2,
			ticked: false
		},
		{
			name: 'Miscellaneous',
			value: 3,
			ticked: false
		}];

		$scope.close = function() {
			$uibModalInstance.close();
		};

		$scope.signin = function() {
			$scope.didUserSubmit = true;
			$scope.showLoginError = false;
			$scope.loginError = "";

			var request = {
				username: $scope.username,
				password: $scope.password
			};

			$http.post('auth/login', request).success(function (data) {
				if (data.state === 'fail') {
					$scope.didUserSubmit = false;
					$scope.showLoginError = true;
					$scope.loginError = 'Username or password is incorrect please try again.';
				} else if (data.state === 'success') {
					$scope.didUserSubmit = false;
					$scope.showLoginError = false;
					$scope.loginError = '';
					$uibModalInstance.close(data.user);
				} else {
					$scope.didUserSubmit = false;
					$scope.showLoginError = true;
					$scope.loginError = 'An error occured, please try again.';
				}
			}, function(err) {
				$scope.didUserSubmit = false;
				$scope.showLoginError = true;
				$scope.loginError = 'An error occured, please try again.';
			});
		};

		$scope.submit = function() {
			$scope.didUserSubmit = true;
			$scope.showPostingError = false;
			$scope.postingError = "";

			var request = {
				username: $scope.user.username,
				serviceType: $scope.selectedTypes,
				serviceContent: $scope.description,
				location: $scope.location
			};

			$http.post('/post/add', request).success(function (data) {
				if (data.state === 'fail') {
					$scope.didUserSubmit = false;
					$scope.showPostingError = true;
					$scope.postingError = "An unknown error occured";
				} else if (data.state === 'success') {
					$scope.didUserSubmit = false;
					$scope.showPostingError = false;
					$scope.postingError = "";
					request.id = data.id;
					$uibModalInstance.close(request);
				} else {
					$scope.didUserSubmit = false;
					$scope.showPostingError = true;
					$scope.postingError = "An unknown error occured";
				}
			}, function(err) {
				$scope.didUserSubmit = false;
				$scope.showPostingError = true;
				$scope.postingError = "An unknown error occured";
			});
		}
	}]);