"use strict";
angular.module("mainApp", ['ui.router', 'ngMaterial', 'ngMessages', 'ngAnimate', 'ngAria'])
  .config(function($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('landingpage', {
        url: '/landing',
        templateUrl: '../app/views/landing.html',
        controller: 'homeCtrl'
      })
      .state('nav.documents', {
        url: '/userdocuments',
        templateUrl: '../app/views/document.html',
        controller: 'docCtrl'
      })
      .state('nav', {
        url: '/nav',
        templateUrl: '../app/views/navbar.html',
        controller: 'homeCtrl'
      })
      .state('signup', {
        url: '/signup',
        templateUrl: '../app/views/signUp.html',
        controller: 'homeCtrl'
      })
      .state('nav.editDocument', {
        url: '/document/:id',
        templateUrl: '../app/views/editDocument.html',
        controller: 'docCtrl'
      })
      .state('nav.docDetails', {
        url: '/more-doc-details/:id',
        templateUrl: '../app/views/documentDetails.html',
        controller: 'docCtrl'
      })
      .state('nav.createdocument', {
        url: '/documents',
        templateUrl: '../app/views/newDocument.html',
        controller: 'docCtrl'
      })
      .state('nav.userprofile', {
        url: '/user',
        templateUrl: '../app/views/userprofile.html',
        controller: 'userCtrl'
      });
    //go to landing if it is an invalid url
    $urlRouterProvider.otherwise('/landing');

  });
