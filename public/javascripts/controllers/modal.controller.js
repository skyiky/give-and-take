angular.module('app')
.controller('modalController', ['$scope', '$rootScope','$uibModal', '$uibModalInstance', '$http', 'user', 'post',
	function($scope, $rootScope, $uibModal, $uibModalInstance, $http, user, post) {
		$scope.didUserSubmit = false;
		$scope.showLoginError = false;
		$scope.showPostingError = false;
		$scope.showSignUpError = false;
		$scope.loginError = "";
		$scope.postingError = "";
		$scope.signupError = "";
		$scope.username = "";
		$scope.password = "";
		$scope.location = "";
		$scope.email = "";
		$scope.firstname = "";
		$scope.surname = "";
		$scope.gender = "";
		$scope.address = "";
		$scope.city = "";
		$scope.country = "";
		$scope.postalCode = "";
		$scope.password = "";
		$scope.passwordConfirm = "";
		$scope.title = "";
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

		if ($scope.post) {
			$scope.title = $scope.post.title;
			$scope.description = $scope.post.serviceContent;
			var categoryTypes = [];

			if ($scope.post.serviceType && $scope.post.serviceType.length > 0) {
				$scope.post.serviceType.forEach(function(category) {
					categoryTypes.push(category.value);
				});

				$scope.types.forEach(function(type) {
					if (categoryTypes.includes(type.value)) {
						type.ticked = true;
					}
				});
			}

			$scope.location = $scope.post.location;
		}

		$scope.close = function() {
			$uibModalInstance.close();
		};

		$scope.signup = function() {
			$scope.didUserSubmit = true;
			$scope.showSignUpError = false;
			$scope.signupError = "";

			if ($scope.password !== $scope.passwordConfirm) {
				$scope.didUserSubmit = false;
				$scope.showSignUpError = true;
				$scope.signupError = "Passwords do not match. Please try again."
				return;
			}

			var request = {
				username : $scope.username,
				email: $scope.email,
				name: $scope.firstname + ' ' + $scope.surname,
				gender: $scope.gender,
				address: $scope.address,
				city: $scope.city,
				country: $scope.country,
				postalCode: $scope.postalCode,
				password: $scope.password
			};

			$http.post('auth/signup', request).success(function (data) {
				if (data.state === 'success') {
					$scope.didUserSubmit = false;
					$scope.showSignUpError = false;
					$scope.signupError = '';
					$uibModalInstance.close(data.user);
				} else {
					$scope.didUserSubmit = false;
					$scope.showSignUpError = true;
					$scope.signupError = data.error;
				}
			}, function(err) {
				$scope.didUserSubmit = false;
				$scope.showSignUpError = true;
				$scope.signupError = "An error occured, please try again."
			})
		}

		$scope.update = function() {
			$scope.didUserSubmit = true;
			$scope.showPostingError = false;
			$scope.postingError = "";

			var request = {
				username: $scope.post.username,
				id: $scope.post.id,
				serviceType: $scope.selectedTypes,
				serviceContent: $scope.description,
				title: $scope.title
			};

			var geocoder = new google.maps.Geocoder();
			geocoder.geocode({ 'address': $scope.location}, function(results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					request.location = {
						lat: results[0].geometry.location.lat(),
						lng: results[0].geometry.location.lng()
					};

					$http.post('/post/update', request).success(function (data) {
						if (data.state === 'fail') {
							$scope.didUserSubmit = false;
							$scope.showPostingError = true;
							$scope.postingError = "An unknown error occured";
						} else if (data.state === 'success') {
							$scope.didUserSubmit = false;
							$scope.showPostingError = false;
							$scope.postingError = "";
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
			});
		}
		
		$scope.delete = function() {
			var request = {
				username: $scope.post.username,
				id: $scope.post.id
			};
			console.log(request);
			$http.delete('post/delete', request).success(function (data) {
				if (data.state === 'fail') {
					$scope.didUserSubmit = false;
					$scope.showPostingError = true;
					$scope.postingError = "An unknown error occured";
				} else if (data.state === 'success') {
					$scope.didUserSubmit = false;
					$scope.showPostingError = false;
					$scope.postingError = "";
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
				title: $scope.title
			};

			var geocoder = new google.maps.Geocoder();
			geocoder.geocode({ 'address': $scope.location}, function(results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					request.location = {
						lat: results[0].geometry.location.lat(),
						lng: results[0].geometry.location.lng()
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
							request.username = $scope.user.username;
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
			});
		}
	}]);