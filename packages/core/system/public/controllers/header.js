'use strict';

angular.module('mean.system').controller('HeaderController', ['$scope', '$rootScope', 'Users', 'Menus', 'MeanUser', '$state',
  function($scope, $rootScope, Users, Menus, MeanUser, $state) {
    var vm = this;
    $scope.format= 'yyy-MM-dd';
    vm.menus = {};
    vm.hdrvars = {
      authenticated: MeanUser.loggedin,
      user: MeanUser.user,
      isLogin: MeanUser.loggedin,
      isWorkshop: MeanUser.isWorkshop,
      isAdmin: MeanUser.isAdmin
    };
    vm.hdrvars.user.date_of_birth = new Date(MeanUser.user.date_of_birth);

    // Default hard coded menu items for main menu
    var defaultMainMenu = [];

    // Query menus added by modules. Only returns menus that user is allowed to see.
    function queryMenu(name, defaultMenu) {

      Menus.query({
        name: name,
        defaultMenu: defaultMenu
      }, function(menu) {
        vm.menus[name] = menu;
      });
    }

    // Query server for menus and check permissions
    queryMenu('main', defaultMainMenu);
    queryMenu('account', []);


    $scope.isCollapsed = false;

    $rootScope.$on('loggedin', function() {
      queryMenu('main', defaultMainMenu);

      vm.hdrvars = {
        authenticated: MeanUser.loggedin,
        user: MeanUser.user,
        isAdmin: MeanUser.isAdmin
      };
    });

    vm.logout = function(){
      MeanUser.logout();
    };

    vm.myprofile = function() {
      $state.go('myprofile');
    }

    vm.updateUser = function() {
      var users = new Users(vm.hdrvars.user);
      users.$update();
      $state.go('home');
    }

    $rootScope.$on('logout', function() {
      vm.hdrvars = {
        authenticated: false,
        user: {},
        isWorkshop: false,
        isAdmin: false,
        isLogin: false
      };
      queryMenu('main', defaultMainMenu);
      $state.go('home');
    });

  }
]);
