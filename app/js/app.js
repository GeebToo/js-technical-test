/* global angular, marked */
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

  GitHub.GetIssue($scope.issue.url).then(resp => {
    let issue = resp.data
    let message = {
      'user': issue.user.login,
      'userImage': issue.user.avatar_url,
      'body': issue.body,
      'isComment': false
    }

    $scope.issue.title = issue.title
    $scope.issue.number = issue.number
    $scope.issue.messages.push(message)
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
        'isComment': true
      }
      $scope.issue.messages.push(issueComment)
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
