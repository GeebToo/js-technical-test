/* global angular */
'use strict'

angular.module('angularApp', ['ui.router'])

angular.module('angularApp').config(function ($stateProvider, $urlRouterProvider, GitHubProvider) {
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'view/home.html',
      controller: 'mainController'
    })

  $urlRouterProvider.otherwise('/')

  GitHubProvider.setGitHubURL('https://api.github.com/repos/')
})

angular.module('angularApp').controller('mainController', function ($scope, $rootScope) {
  $scope.issue = {
    'title': 'Ma super issue',
    'number': 42
  }
})

angular.module('angularApp').provider('GitHub', function () {
  let _this = this
  let GITHUB_URL = ''

  _this.setGitHubURL = function (url) {
    GITHUB_URL = url
  }

  _this.$get = ['$http', function ($http) {
    return {
      GetIssue: GetIssue,
      GetIssueComments: GetIssueComments
    }

    function GetIssue (issueURL) {
      return $http.get(GITHUB_URL + issueURL)
    }

    function GetIssueComments (issueURL) {
      return $http.get(GITHUB_URL + issueURL + '/comments')
    }
  }]
})
