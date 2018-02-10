angular.module('app')
.controller('modalController', ['$scope', '$rootScope','$uibModal', '$uibModalInstance', '$http',
	function($scope, $rootScope, $uibModal, $uibModalInstance, $http) {
		$scope.didUserSubmit = false;
		$scope.showErrors = false;
		$scope.showSuccess = false;
		$scope.error = "";


		$scope.close = function() {
			$uibModalInstance.close();
		};

		$scope.submit = function() {
		};
	}]);