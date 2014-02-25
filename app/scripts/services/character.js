'use strict';

angular.module('sheetApp')
	.factory('Character', function ($resource) {

		function CharacterResourceFactory() {

			var resource = $resource('/api/v1/characters/:id',
				{ id: '@_id' }, { update: { method: 'PUT' } }
			);

			resource.getById = function (id, cb, errorcb) {
				return resource.get({ id: id }, cb, errorcb);
			};

			resource.prototype.update = function (cb, errorcb) {
				return resource.update({ id: this._id }, angular.extend({}, this, { _id: undefined }), cb, errorcb);
			};

			resource.prototype.saveOrUpdate = function (savecb, updatecb, errorSavecb, errorUpdatecb) {
				if (this._id) {
					return this.update(updatecb, errorUpdatecb);
				} else {
					return this.$save(savecb, errorSavecb);
				}
			};

			resource.prototype.remove = function (cb, errorcb) {
				return resource.remove({ id: this._id }, cb, errorcb);
			};

			resource.prototype['delete'] = function (cb, errorcb) {
				return this.remove(cb, errorcb);
			};

			if (resource._id) {
				resource.resourceUrl = '/api/v1/characters/' + resource._id; // not working
			}

			return resource;
		}

		return new CharacterResourceFactory();
	});
