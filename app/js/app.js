/* global angular */
'use strict'

angular.module('angularApp', ['ui.router'])

angular.module('angularApp').config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'view/home.html',
      controller: 'mainController'
    })

  $urlRouterProvider.otherwise('/')
})

angular.module('angularApp').controller('mainController', function ($scope, $rootScope) {
  $scope.issue = {
    'title': 'Ma super issue',
    'number': 42
  }
})
