/* global angular, marked, _ */
'use strict'

angular.module('angularApp', ['ui.router', 'chart.js'])

angular.module('angularApp').config(function ($stateProvider, $urlRouterProvider, GitHubProvider) {
  $stateProvider
    .state('home', {
      url: '/:name/:repo/issue/:number',
      templateUrl: 'view/home.html',
      controller: 'mainController'
    })

  $urlRouterProvider.otherwise('/nodejs/node/issue/6867')

  GitHubProvider.setGitHubURL('https://api.github.com/repos/')
})

angular.module('angularApp').controller('mainController', function ($scope, $rootScope, $sce, $stateParams, GitHub) {
  $scope.issue = {
    'url': $stateParams.name + '/' + $stateParams.repo + '/issues/' + $stateParams.number,
    'messages': []
  }
  $scope.contributors = {
    'users': [],
    'avatars': [],
    'nbreOfWords': []
  }
  $scope.usersToFilter = []

  GitHub.GetIssue($scope.issue.url).then(resp => {
    $scope.hasError = false
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

    if (_.includes($scope.contributors.users, issue.user.login)) {
      let index = _.indexOf($scope.contributors.users, issue.user.login)
      $scope.contributors.nbreOfWords[index] += countWords(issue.body)
    } else {
      $scope.contributors.users.push(issue.user.login)
      $scope.contributors.avatars.push(issue.user.avatar_url)
      $scope.contributors.nbreOfWords.push(countWords(issue.body))
    }

    $scope.contributors.user
  }, err => {
    $scope.hasError = true
    console.log(err)
  })

  GitHub.GetIssueComments($scope.issue.url).then(resp => {
    $scope.hasError = false
    let comments = resp.data

    comments.forEach(comment => {
      let issueComment = {
        'user': comment.user.login,
        'userImage': comment.user.avatar_url,
        'body': comment.body,
        'date': comment.created_at,
        'isComment': true
      }
      $scope.issue.messages.push(issueComment)

      if (_.includes($scope.contributors.users, comment.user.login)) {
        let index = _.indexOf($scope.contributors.users, comment.user.login)
        $scope.contributors.nbreOfWords[index] += countWords(comment.body)
      } else {
        $scope.contributors.users.push(comment.user.login)
        $scope.contributors.avatars.push(comment.user.avatar_url)
        $scope.contributors.nbreOfWords.push(countWords(comment.body))
      }
    })
  }, err => {
    $scope.hasError = true
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

function countWords (str) {
  return str.trim().split(/\s+/).length
}
