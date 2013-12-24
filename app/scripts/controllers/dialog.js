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
	});
