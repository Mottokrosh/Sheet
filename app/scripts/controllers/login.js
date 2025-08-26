'use strict';

angular.module('sheetApp')
	.controller('LoginCtrl', function ($scope, user, googleIdentityClient) {
		$scope.user = user;
		googleIdentityClient.renderLoginButton(document.getElementById('google-branded-button'), {
			type: 'standard',
			size: 'large',
			theme: 'filled_black',
			text: 'sign_in_with',
			shape: 'rectangular',
			logo_alignment: 'left',
			width: '400'
		});
	});
