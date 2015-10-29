"use strict";
angular.module("mainApp", ['ui.router', 'ngMaterial', 'ngMessages', 'ngAnimate', 'ngAria'])
  .config(function($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('landingpage', {
        url: '/landing',
        templateUrl: '../app/views/landing.html',
        controller: 'homeCtrl'
      })
      .state('documents', {
        url: '/userdocuments',
        templateUrl: '../app/views/document.html',
        controller: 'docCtrl'
      })
      .state('signup', {
        url: '/signup',
        templateUrl: '../app/views/signUp.html',
        controller: 'homeCtrl'
      })
      .state('editDocument', {
        url: '/document/:id',
        templateUrl: '../app/views/editDocument.html',
        controller: 'docCtrl'
      })
      // .state('moredetails', {
      //   url: '/document/:id',
      //   templateUrl: '../app/views/documentDetails.html',
      //   controller: 'docCtrl'
      // })
      .state('createdocument', {
        url: '/documents',
        templateUrl: '../app/views/newDocument.html',
        controller: 'docCtrl'
      })
      .state('userprofile', {
        url: '/user/:id',
        templateUrl: '../app/views/userprofile.html',
        controller: 'userCtrl'
      });

    // $urlRouterProvider.otherwise('/landing');

  });
