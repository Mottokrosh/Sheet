'use strict';

angular.module('sheetApp')
	.controller('DialogCtrl', function ($scope, ngDialog) {
		$scope.items = $scope.dialog.items;
		$scope.item = $scope.dialog.item;
		$scope.mode = $scope.dialog.mode;
		//$scope.spellData = $scope.dialog.spellData || {};
		$scope.deleteText = 'Delete';

		// General

		$scope.remove = function () {
			if ($scope.deleteText === 'Delete') {
				$scope.deleteText = 'Confirm?';
			} else {
				var index = $scope.items.indexOf($scope.item);
				if (index > -1) {
					$scope.items.splice(index, 1);
				}
				ngDialog.close();
			}
		};

		$scope.confirmRemove = function () {
			var index = $scope.items.indexOf($scope.item);
			$scope.items.splice(index, 1);
			ngDialog.close();
		};

		$scope.close = function () {
			ngDialog.close();
		};

		$scope.dismiss = function () {
			var index = $scope.items.indexOf($scope.item);
			if (index > -1) {
				$scope.items.splice(index, 1);
			}
			ngDialog.close();
		};

		// Spell Related

		if ($scope.spellData) {
			$scope.$watch('item.name', function (newVal) {
				if ($scope.spellData[newVal]) {
					$scope.description = $scope.spellData[newVal].fulltext;
					$scope.item.school = $scope.spellData[newVal].school;
					$scope.item.subschool = $scope.spellData[newVal].subschool;
				}
			}, true);
		}

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

		$scope.toggleMark = function () {
			$scope.item.marked = !$scope.item.marked;
		};

		$scope.tPrepared = function () {
			return $scope.dialog.spellLike ? 'Per Day' : 'Prepared';
		};

		$scope.tCast = function () {
			return $scope.dialog.spellLike ? 'Used' : 'Cast';
		};

		$scope.toggleAtWill = function () {
			$scope.item.atWill = !$scope.item.atWill;
		};
	});
