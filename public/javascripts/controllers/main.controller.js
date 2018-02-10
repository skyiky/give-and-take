angular.module('app')
.controller('mainController', ['$scope', '$rootScope', '$http', '$window', '$uibModal',
	function($scope, $rootScope, $http, $window, $uibModal) {
		$scope.user = null;
		$scope.isLoggedIn = false;
		$scope.markers = {};
		$scope.coords = {};
		$scope.posts = [];
		$scope.search = "";
		
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
					console.log(position);
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

			// get user details
			// load markers

/*			$http.get('/user').success(function(data) {
				$scope.user = data;

				if (Object.keys($scope.user).length > 0) {
					$scope.isLoggedIn = true;
					$scope.imageUrl = 'http://graph.facebook.com/' + $scope.user.data.facebook.id + '/picture?type=square';
				}

				$http.get('/posts').success(function(data) {
					$scope.posts = data.posts
					$scope.loadMarkers();
					$scope.notifsPosts = data.notifsPosts;
				}, function(err) {
					console.log(err);
				});
			}, function(err) {
				console.log(err);
			});*/
		}

		$scope.clearMarkers = function() {
			Object.keys($scope.markers).forEach(function(key) {
				$scope.markers[key].setMap(null);
			});
		};

		$scope.loadMarkers = function() {
			$scope.clearMarkers();

			for (var i = 0; i < $scope.posts.length; i++) {
				addMarker($scope.posts[i]);
			}
		}

		function addMarker(post) {
			$scope.markers[post.id] = new google.maps.Marker({
				map: $scope.map,
				position: new google.maps.LatLng(restaurant.coordinates.latitude, restaurant.coordinates.longitude),
			});

			google.maps.event.addListener($scope.markers[post.id], 'click', function () {
				$uibModal.open({
					templateUrl: 'post.template.html',
					controller: 'modalController',
				});
			});
		}

		$scope.openSignInModal = function() {
			$uibModal.open({
				templateUrl: 'signin.template.html',
				controller: 'modalController'
			})
		}

		$scope.openModal = function() {
			$uibModal.open({
				templateUrl: 'post.template.html',
				controller: 'modalController',
			})
		}

		initPage();
	}]);