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

// Main Controller
angular.module('angularApp').controller('mainController', function ($scope, $rootScope, $sce, $stateParams, GitHub) {
  $scope.issue = {
    'url': $stateParams.name + '/' + $stateParams.repo + '/issues/' + $stateParams.number,
    'messages': []
  }
  // Init variables
  $scope.contributors = {
    'users': [],
    'avatars': [],
    'nbreOfWords': []
  }
  $scope.usersToFilter = []

  // Get Issue
  GitHub.GetIssue($scope.issue.url).then(resp => {
    $scope.hasError = false
    let issue = resp.data
    $scope.issue.title = issue.title
    $scope.issue.number = issue.number
    $scope.issue.messages.push(createMessageFromData(issue, false))

    $scope.contributors = updateContributorsList($scope.contributors, issue)
  }, err => {
    $scope.hasError = true
    console.log(err)
  })

  // Get Issue comments
  GitHub.GetIssueComments($scope.issue.url).then(resp => {
    $scope.hasError = false
    let comments = resp.data

    comments.forEach(comment => {
      $scope.issue.messages.push(createMessageFromData(comment, true))
      $scope.contributors = updateContributorsList($scope.contributors, comment)
    })
  }, err => {
    $scope.hasError = true
    console.log(err)
  })

  // Parse markdown to html balise
  $scope.html = function (text) {
    if (text) {
      var mark = marked(text)
      return $sce.trustAsHtml(mark)
    } else {
      return text
    }
  }

  // Hide/show message from a user
  $scope.filterMessage = function (userName) {
    if (_.includes($scope.usersToFilter, userName)) {
      _.pull($scope.usersToFilter, userName)
    } else {
      $scope.usersToFilter.push(userName)
    }
  }

  // Show all messages
  $scope.resetFilter = function () {
    $scope.usersToFilter = []
  }

  // used to adding class to users selected
  $scope.userSelected = function (userName) {
    return _.includes($scope.usersToFilter, userName)
  }
})

// GitHub Provider
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

// Filter
angular.module('angularApp').filter('inArray', function ($filter) {
  return function (list, arrayFilter, element) {
    if (arrayFilter) {
      return $filter('filter')(list, function (listItem) {
        return arrayFilter.indexOf(listItem[element]) === -1
      })
    }
  }
})

// Function to count the nbre of words in a string
function countWords (str) {
  return str.trim().split(/\s+/).length
}

function createMessageFromData (issueData, isComment) {
  return {
    'user': issueData.user.login,
    'userImage': issueData.user.avatar_url,
    'body': issueData.body,
    'date': issueData.created_at,
    'isComment': isComment
  }
}

function updateContributorsList (contributors, issue) {
  if (_.includes(contributors.users, issue.user.login)) {
    let index = _.indexOf(contributors.users, issue.user.login)
    contributors.nbreOfWords[index] += countWords(issue.body)
  } else {
    contributors.users.push(issue.user.login)
    contributors.avatars.push(issue.user.avatar_url)
    contributors.nbreOfWords.push(countWords(issue.body))
  }

  return contributors
}
