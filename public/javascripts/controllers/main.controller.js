angular.module('app')
.controller('mainController', ['$scope', '$rootScope', '$http', '$window', '$uibModal',
	function($scope, $rootScope, $http, $window, $uibModal) {
		$scope.user = null;
		$scope.isLoggedIn = false;
		$scope.markers = {};
		$scope.coords = {};
		$scope.posts = [];
		$scope.completeSetPosts = [];
		$scope.search = "";
		$scope.users = [];
		$scope.userPosts = [];
		$scope.elsePosts = [];
		$scope.messages = [];
		$scope.foodFilter = true;
		$scope.shelterFilter = true;
		$scope.clothesFilter = true;
		$scope.miscFilter = true;

		function initPage() {
			var mapOptions = {
				zoom: 14,
				center: new google.maps.LatLng(49.2807513, -123.1152712),
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				disableDefaultUI: true,
				zoomControl: true,
				styles: [
				{
					"featureType": "landscape.natural",
					"elementType": "geometry.fill",
					"stylers": [
					{
						"visibility": "on"
					},
					{
						"color": "#e0efef"
					}
					]
				},
				{
					"featureType": "poi",
					"elementType": "geometry.fill",
					"stylers": [
					{
						"visibility": "on"
					},
					{
						"hue": "#1900ff"
					},
					{
						"color": "#c0e8e8"
					}
					]
				},
				{
					"featureType": "road",
					"elementType": "geometry",
					"stylers": [
					{
						"lightness": 100
					},
					{
						"visibility": "simplified"
					}
					]
				},
				{
					"featureType": "road",
					"elementType": "labels",
					"stylers": [
					{
						"visibility": "off"
					}
					]
				},
				{
					"featureType": "transit.line",
					"elementType": "geometry",
					"stylers": [
					{
						"visibility": "on"
					},
					{
						"lightness": 700
					}
					]
				},
				{
					"featureType": "water",
					"elementType": "all",
					"stylers": [
					{
						"color": "#7dcdcd"
					}
					]
				}
				]
			};


			$scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(function (position) {
					var initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
					$scope.coords.lat = initialLocation.lat();
					$scope.coords.lng = initialLocation.lng();
					$scope.map.setCenter(initialLocation);

					$scope.userMarker = new google.maps.Marker({
						position: initialLocation,
						map: $scope.map,
						icon: 'http://www.robotwoods.com/dev/misc/bluecircle.png'
					});
				});
			}

			var username = $window.sessionStorage.getItem("user");

			$http.get('/auth/user/' + username).success(function(data) {
				if (data.state === 'success') {
					$scope.user = data.user;
					$scope.isLoggedIn = true;
				}

				$http.get('/post/all').success(function(data) {
					if (data.state === 'success') {
						Object.keys(data.data).forEach(function(username) {
							Object.keys(data.data[username]).forEach(function(id) {
								var post = data.data[username][id];
								post.username = username;
								post.id = parseInt(id);

								$scope.posts.push(post);
								
								if ($scope.user && post.username.toLowerCase() == $scope.user.username.toLowerCase()) {
									$scope.userPosts.push(post);
								} else {
									$scope.elsePosts.push(post);
								}
							});
						});

						console.log($scope.posts);
						console.log($scope.userPosts);

						$scope.completeSetPosts = $scope.posts;
						$scope.loadMarkers();
					}

					$http.get('/auth/users').success(function(data) {
						if (data.state === 'success') {
							$scope.users = data.users;
						}

						if ($scope.user) {
							$http.get('/message/' + $scope.user.username).success(function(data) {
								if (data.state === 'success') {
									$scope.messages = data.messages;
								}
							});
						}
					});
				});
			}, function (err) {
				// fail silently
				console.log(err);
			});
		}

		$scope.clearMarkers = function() {
			Object.keys($scope.markers).forEach(function(key) {
				$scope.markers[key].setMap(null);
			});
		};

		$scope.loadMarkers = function() {
			$scope.clearMarkers();

			var categories = [];

			if ($scope.foodFilter) {
				categories.push(0);
			}

			if ($scope.shelterFilter) {
				categories.push(1);
			}

			if ($scope.clothesFilter) {
				categories.push(2);
			}

			if ($scope.miscFilter) {
				categories.push(3);
			}

			$scope.posts = [];
			$scope.userPosts = [];
			$scope.elsePosts = [];


			$scope.completeSetPosts.forEach(function(post) {
				post.serviceType.forEach(function(type) {
					if (categories.includes(type.value)) {
						$scope.posts.push(post);
					}
				});
			});

			for (var i = 0; i < $scope.posts.length; i++) {
				var post = $scope.posts[i];

				if ($scope.user && post.username.toLowerCase() == $scope.user.username.toLowerCase()) {
					$scope.userPosts.push(post);
				} else {
					$scope.elsePosts.push(post);
				}
				addMarker($scope.posts[i]);
			}
		}

		$scope.toggleFoodFilter = function() {
			$scope.foodFilter = !$scope.foodFilter;
			$scope.loadMarkers();
		}

		$scope.toggleShelterFilter = function() {
			$scope.shelterFilter = !$scope.shelterFilter;
			$scope.loadMarkers();
		}

		$scope.toggleClothesFilter = function() {
			$scope.clothesFilter = !$scope.clothesFilter;
			$scope.loadMarkers();
		}

		$scope.toggleMiscFilter = function() {
			$scope.miscFilter = !$scope.miscFilter;
			$scope.loadMarkers();
		}

		function addMarker(post) {
			var fillColor = null;
			var strokeColor = null;
			var radius = post.serviceType.length * 0.8 * 500;

			if (post.serviceType.length > 1) {
				fillColor = '#FFFF66';
				strokeColor = '#FFCC66';
			} else {
				var serviceType = post.serviceType[0];

				if (serviceType.value === 0) { // food
					fillColor = '#FF9900';
					strokeColor = 'FF6633';
				} else if (serviceType.value === 1) { // housing
					fillColor = '#00CC66';
					strokeColor = '#339933';
				} else if (serviceType.value === 2) { // clothing
					fillColor = '#3399FF';
					strokeColor = '#0066FF'
				} else { // miscellaneous
					fillColor = '#CC99FF';
					strokeColor = '#9966FF'
				}
			}

			$scope.markers[post.id] = new google.maps.Circle({
				map: $scope.map,
				center: new google.maps.LatLng(post.location.lat, post.location.lng),
				strokeColor: strokeColor,
				strokeOpacity: 0.8,
				strokeWeight: 2,
				fillColor: fillColor,
				fillOpacity: 0.5,
				radius: radius
			});

			google.maps.event.addListener($scope.markers[post.id], 'click', function () {
				$uibModal.open({
					templateUrl: 'post.template.html',
					controller: 'modalController',
					resolve: {
						user: function() {
							return $scope.user;
						},
						post: function() {
							post.email = $scope.users[post.username].email;
							return post;
						},
						messages: function() {
							return null;
						},
						message: function() {
							return null;
						}
					}
				});
			});
		}

		$scope.$watch("search", function(newValue, oldValue) {
			if (newValue !== oldValue) {
				$scope.posts = $scope.searchCriteriaMatch($scope.completeSetPosts);
				$scope.loadMarkers();
			}
		});

		$scope.searchCriteriaMatch = function (items) {
			if (!$scope.search || $scope.search.length < 1) {
				return items;
			}

			$scope.search = $scope.search.toLowerCase();

			items = items.filter(i => i.title.toLowerCase().includes($scope.search) ||
				i.serviceContent.toLowerCase().includes($scope.search));

			return items;
		};

		$scope.openSignInModal = function() {
			var signInModalInstance = $uibModal.open({
				templateUrl: 'signin.template.html',
				controller: 'modalController',
				resolve: {
					user: function() {
						return $scope.user;
					},
					post: function() {
						return null;
					},
					messages: function() {
						return null;
					},
					message: function() {
						return null;
					}
				}
			});

			signInModalInstance.result.then(function(user) {
				if (user) {
					$scope.user = user;
					$scope.isLoggedIn = true;
					$window.sessionStorage.setItem("user", user.username);
					$scope.clearMarkers();
					initPage();
				}
			});
		}

		$scope.openMessageModal = function() {
			var messageModalInstance = $uibModal.open({
				templateUrl: 'message.template.html',
				controller: 'modalController',
				resolve: {
					user: function() {
						return $scope.user;
					},
					post: function() {
						return null;
					},
					messages: function() {
						return $scope.messages;
					},
					message: function() {
						return null;
					}
				}
			})
		}

		$scope.openSignUpModal = function() {
			var signUpModalInstance = $uibModal.open({
				templateUrl: 'signup.template.html',
				controller: 'modalController',
				resolve: {
					user: function() {
						return $scope.user;
					},
					post: function() {
						return null;
					},
					messages: function() {
						return null;
					},
					message: function() {
						return null;
					}
				}
			});

			signUpModalInstance.result.then(function(user) {
				if (user) {
					$scope.user = user;
					$scope.isLoggedIn = true;
					$window.sessionStorage.setItem("user", user.username);
					$scope.clearMarkers();
					initPage();
				}
			});
		}

		$scope.openAddPostingModal = function() {
			var addPostingModalInstance = $uibModal.open({
				templateUrl: 'post.add.template.html',
				controller: 'modalController',
				resolve: {
					user: function() {
						return $scope.user;
					},
					post: function() {
						return null;
					},
					messages: function() {
						return null;
					},
					message: function() {
						return null;
					}

				}
			});

			addPostingModalInstance.result.then(function(posting) {
				if (posting) {
					addMarker(posting);
					$scope.posts.push(posting);
					$scope.usersPosts.push(posting);
					$scope.completeSetPosts.push(posting);
				}
			});
		}

		$scope.openDeletePostingModal = function($event, post) {
			$event.stopPropagation();
			var deletePostingModalInstance = $uibModal.open({
				templateUrl: 'post.delete.template.html',
				controller: 'modalController',
				resolve: {
					user: function() {
						return $scope.user;
					},
					post: function() {
						return post;
					},
					messages: function() {
						return null;
					},
					message: function() {
						return null;
					}
				}
			});

			deletePostingModalInstance.result.then(function(posting) {
				var postIndex = $scope.completeSetPosts.findIndex(p => p.id === posting.id);

				delete $scope.completeSetPosts[postIndex];

				$scope.loadMarkers();
			});
		}

		$scope.openEditPostingModal = function($event, post) {
			$event.stopPropagation();
			if (post.location.lat && post.location.lng) {
				$http.get('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + post.location.lat + ',' + post.location.lng + '&sensor=false').success(function(data) {
					var postalCode = "";

					if (!data) {
					//fail silently
					return;
				}

				data.results.forEach(function(address) {
					address.address_components.forEach(function(component) {
						if (component.types.includes("postal_code") && postalCode.length < 1) {
							postalCode = component.long_name.trim();
						}
					});
				});

				post.location = postalCode;

				var editPostingModalInstance = $uibModal.open({
					templateUrl: 'post.edit.template.html',
					controller: 'modalController',
					resolve: {
						user: function() {
							return $scope.user;
						},
						post: function() {
							return post;
						},
						messages: function() {
							return null;
						},
						message: function() {
							return null;
						}
					}
				});

				editPostingModalInstance.result.then(function(posting) {
					if (posting) {
						var postIndex = $scope.posts.findIndex(p => p.id === posting.id);
						var userPostIndex = $scope.userPosts.findIndex(p => p.id === posting.id);

						$scope.posts[postIndex] = posting;
						$scope.userPosts[userPostIndex] = posting;
					}
				});
			});
			} else {
				var editPostingModalInstance = $uibModal.open({
					templateUrl: 'post.edit.template.html',
					controller: 'modalController',
					resolve: {
						user: function() {
							return $scope.user;
						},
						post: function() {
							return post;
						},
						messages: function() {
							return null;
						},
						message: function() {
							return null;
						}
					}
				});

				editPostingModalInstance.result.then(function(posting) {
					if (posting) {
						addMarker(posting);
					}
				});
			}
		}

		$scope.openModal = function(post) {
			console.log('asdf');
			$uibModal.open({
				templateUrl: 'post.template.html',
				controller: 'modalController',
				resolve: {
					user: function() {
						return $scope.user;
					},
					post: function() {
						return post;
					},
					messages: function() {
						return null;
					},
					message: function() {
						return null;
					}
				}
			})
		}

		$scope.logout = function() {
			$window.sessionStorage.clear();
			$scope.user = null;
			$scope.isLoggedIn = false;
		}

		initPage();
	}]);
