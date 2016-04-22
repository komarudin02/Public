'use strict';

angular.module('mean.admin').controller('UsersController', ['$scope', 'Global', 'MeanUser', 'Menus', '$rootScope', '$http', 'Users', 'Circles',
    function($scope, Global, MeanUser, Menus, $rootScope, $http, Users, Circles) {
        $scope.global = Global;
        $scope.user = {};
        $scope.MeanUser = MeanUser;

        Circles.mine(function(acl) {

            var circles = ($scope.MeanUser.isAdmin) ? acl.allowed : ["car owner"];

            $scope.userSchema = [{
                title: ($scope.MeanUser.isWorkshop) ? 'Fullname' : 'Name',
                schemaKey: 'name',
                type: 'text',
                workshop: true,
                inTable: true
            }, {
                title: 'Email',
                schemaKey: 'email',
                type: 'email',
                workshop: true,
                inTable: true
            }, {
                title: 'Username',
                schemaKey: 'username',
                type: 'text',
                workshop: true,
                inTable: true
            }, {
                title: 'Roles',
                schemaKey: 'roles',
                type: 'select',
                workshop: true,
                options: circles,
                inTable: true
            }, {
                title: 'Password',
                schemaKey: 'password',
                type: 'password',
                workshop: true,
                inTable: false
            }, {
                title: 'Repeat password',
                schemaKey: 'confirmPassword',
                type: 'password',
                workshop: true,
                inTable: false
            }, {
                title: 'Date of birth',
                schemaKey: 'date_of_birth',
                type: 'text',
                workshop: false,
                inTable: true
            }, {
                title: 'Address',
                schemaKey: 'address',
                type: 'text',
                workshop: false,
                inTable: true
            }, {
                title: 'Gender',
                schemaKey: 'gender',
                type: 'radio',
                checked:true,
                value:0,
                workshop: false,
                label: "Male",
                inTable: true
            }, {
                title: '',
                schemaKey: 'gender',
                type: 'radio',
                checked:false,
                value:1,
                workshop: false,
                label: "Female",
                inTable: false
            }];
        });

        $scope.init = function() {
            if($scope.MeanUser.isAdmin){
                Users.query({}, function(users) {
                    $scope.users = users;
                });
            }
            else{
                 Users.query({_parentid: $scope.MeanUser.user._id}, function(users) {
                    $scope.users = users;
                });
            }
            
        };

        $scope.add = function(valid) {
            if (!valid) return;
            if (!$scope.users) $scope.users = [];

            var user = new Users({
                email: $scope.user.email,
                name: $scope.user.name,
                username: $scope.user.username,
                password: $scope.user.password,
                confirmPassword: $scope.user.confirmPassword,
                roles: $scope.user.roles,
                gender: ($scope.user.gender) ? $scope.user.gender : 0,
                address: $scope.user.address,
                _parentid: ($scope.MeanUser.isWorkshop) ? $scope.MeanUser.user._id : '',
                date_of_birth: $scope.user.date_of_birth
            });

            user.$save(function(data, headers) {
                $scope.user = {};
                $scope.users.push(user);
                $scope.userError = null;
            }, function(data, headers) {console.log(data);
                $scope.userError = data.data;
            });
        };

        $scope.remove = function(user) {
            for (var i in $scope.users) {
                if ($scope.users[i] === user) {
                    $scope.users.splice(i, 1);
                }
            }

            user.$remove();
        };

        $scope.update = function(user, userField) {
            if (userField && userField === 'roles' && user.tmpRoles.indexOf('admin') !== -1 && user.roles.indexOf('admin') === -1) {
                if (confirm('Are you sure you want to remove "admin" role?')) {
                    user.$update();
                } else {
                    user.roles = user.tmpRoles;
                }
            } else
                user.$update();
        };

        $scope.beforeSelect = function(userField, user) {
            if (userField === 'roles') {
                user.tmpRoles = user.roles;
            }
        };
    }
]);
