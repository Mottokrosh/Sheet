'use strict';

angular.module('sheetApp')
	.controller('SandboxCtrl', function ($scope, $http, user, $fileUploader) {
		$scope.thing = 'Stuff';
		$scope.user = user;

		// Creates an uploader
		var uploader = $scope.uploader = $fileUploader.create({
		    scope: $scope,
		    url: '/upload'
		});

		uploader.bind('afteraddingfile', function (event, item) {
		    console.info('After adding a file', item);
		});

		uploader.bind('afteraddingall', function (event, items) {
		    console.info('After adding all files', items);
		});

		uploader.bind('beforeupload', function (event, item) {
		    console.info('Before upload', item);
		});

		uploader.bind('progress', function (event, item, progress) {
		    console.info('Progress: ' + progress, item);
		});

		uploader.bind('success', function (event, xhr, item, response) {
		    console.info('Success', xhr, item, response);
		});

		uploader.bind('cancel', function (event, xhr, item) {
		    console.info('Cancel', xhr, item);
		});

		uploader.bind('error', function (event, xhr, item, response) {
		    console.info('Error', xhr, item, response);
		});

		uploader.bind('complete', function (event, xhr, item, response) {
		    console.info('Complete', xhr, item, response);
		});

		uploader.bind('progressall', function (event, progress) {
		    console.info('Total progress: ' + progress);
		});

		uploader.bind('completeall', function (event, items) {
		    console.info('Complete all', items);
		});

		/*$scope.onFileSelect = function ($file) {
			//$files: an array of files selected, each file has name, size, and type.
			//for (var i = 0; i < $files.length; i++) {
				//var $file = $files[i];
				$fileUploader.upload({
					url: '/upload',
					file: $file,
					progress: function (e) {}
				}).then(function (data, status, headers, config) {
					// file is uploaded successfully
					console.log(data);
				});
			//}
		}*/

	});
