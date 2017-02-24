/* global angular, marked, _ */
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

angular.module('angularApp').controller('mainController', function ($scope, $rootScope, $sce, GitHub) {
  $scope.issue = {
    'url': 'nodejs/node/issues/6867',
    'messages': []
  }
  $scope.contributors = {}
  $scope.usersToFilter = []

  GitHub.GetIssue($scope.issue.url).then(resp => {
    let issue = resp.data
    let message = {
      'user': issue.user.login,
      'userImage': issue.user.avatar_url,
      'body': issue.body,
      'date': issue.created_at,
      'isComment': false
    }

    $scope.issue.title = issue.title
    $scope.issue.number = issue.number
    $scope.issue.messages.push(message)

    $scope.contributors[issue.user.login] = {
      'name': issue.user.login,
      'avatar': issue.user.avatar_url
    }
  }, err => {
    console.log(err)
  })

  GitHub.GetIssueComments($scope.issue.url).then(resp => {
    let comments = resp.data

    $scope.issue.comments = []
    comments.forEach(comment => {
      let issueComment = {
        'user': comment.user.login,
        'userImage': comment.user.avatar_url,
        'body': comment.body,
        'date': comment.created_at,
        'isComment': true
      }
      $scope.issue.messages.push(issueComment)

      $scope.contributors[comment.user.login] = {
        'name': comment.user.login,
        'avatar': comment.user.avatar_url
      }
    })
  }, err => {
    console.log(err)
  })

  $scope.html = function (text) {
    if (text) {
      var mark = marked(text)
      return $sce.trustAsHtml(mark)
    } else {
      return text
    }
  }

  $scope.filterMessage = function (userName) {
    if (_.includes($scope.usersToFilter, userName)) {
      _.pull($scope.usersToFilter, userName)
    } else {
      $scope.usersToFilter.push(userName)
    }
  }

  $scope.resetFilter = function () {
    $scope.usersToFilter = []
  }

  $scope.userSelected = function (userName) {
    return _.includes($scope.usersToFilter, userName)
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

angular.module('angularApp').filter('inArray', function ($filter) {
  return function (list, arrayFilter, element) {
    if (arrayFilter) {
      return $filter('filter')(list, function (listItem) {
        return arrayFilter.indexOf(listItem[element]) === -1
      })
    }
  }
})
