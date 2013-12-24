'use strict';

angular.module('sheetApp')
	.controller('DialogCtrl', function ($scope, $modalInstance, items, item, mode) {
		$scope.item = item;
		$scope.mode = mode;
		$scope.deleteText = 'Delete';

		$scope.remove = function () {
			if ($scope.deleteText === 'Delete') {
				$scope.deleteText = 'Confirm?';
			} else {
				var index = items.indexOf(item);
				items.splice(index, 1);
				$modalInstance.close();
			}
		};

		// Spell Related

		$scope.prepare = function () {
			$scope.item.prepared++;
		};

		$scope.cast = function () {
			if ($scope.item.cast < $scope.item.prepared) {
				$scope.item.cast++;
			}
		};

		$scope.clearCounts = function () {
			$scope.item.prepared = 0;
			$scope.item.cast = 0;
		};
	});
