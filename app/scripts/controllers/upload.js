angular.module('sheetApp')
    .controller('UploadCtrl', function ($scope, user, Character, $location) {
        'use strict';
        $scope.user = user;
        $scope.showSizeError = false;
        $scope.showTypeError = false;
        $scope.showError = false;
        $scope.data = null;

        $scope.uploadFile = function () {
            $scope.showSizeError = false;
            $scope.showTypeError = false;
            $scope.showError = false;
            const file = document.getElementById('file-select').files[0];
            const reader = new FileReader();
            checkForErrors(file)
            if (!$scope.showSizeError && !$scope.showTypeError) {
                reader.onloadend = function (e) {
                    $scope.data = e.target.result;
                    const data = JSON.parse(e.target.result);
                    setFields(data);
                }
                reader.on
            }
            reader.readAsBinaryString(file);
        }
        
        function checkForErrors(file) {
            const maxFileSize = 35000;
            if (file.type !== 'application/json') {
                $scope.showTypeError = true;
            }
            if (file.size > maxFileSize) {
                $scope.showSizeError = true;
            }
        }

        function setFields(data) {
            const c = new Character();
            c.user = $scope.user;
            c.spells = data.spells;
            c.name = data.name;
            c.alignment = data.alignment;
            c.abilities = data.abilities;
            c.race = data.race;
            c.level = data.level;
            c.size = data.size;
            c.gender = data.gender;
            c.age = data.age;
            c.height = data.height;
            c.weight = data.weight;
            c.hair = data.hair;
            c.eyes = data.hair;
            c.skills = data.skills;
            c.specialAbilities = data.specialAbilities;
            c.traits = data.traits;
            c.saves = data.saves;
            c.melee = data.melee;
            c.feats = data.feats;
            c.hp = data.hp;
            c.damageReduction = data.damageReduction;
            c.money = data.money;
            c.spellsSpeciality = data.spellsSpeciality;
            c.spellLikes = data.spellLikes;
            c.languages = data.languages;
            c.initiative = data.initiative;
            c.speed = data.speed;
            c.notes = data.notes;
            c.ranged = data.ranged;
            c.gear = data.gear;
            c.ac = data.ac;
            c.cmd = data.cmd;
            c.cmb = data.cmb;
            c.bab = data.bab;
            c.comments = data.comments;
            c.resistances = data.resistances;

            c.saveOrUpdate(success, error)
        }
        function success(data) {
           $location.path('/sheet/' + data._id)
        }

        function error(data) {
            $scope.showError = true;
        }
    });