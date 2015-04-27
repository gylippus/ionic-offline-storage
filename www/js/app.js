// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var sqlDB = null;
angular.module('starter', ['ionic', 'starter.localstorage', 'starter.localforage', 'starter.websql', 'starter.sqlite', 'starter.services','ngCordova'])

.run(function($ionicPlatform, $cordovaSQLite) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }

    // Set configurations for localforgage DB
    localforage.config({
      driver      : localforage.WEBSQL, // Force WebSQL; same as using setDriver()
      name        : 'forageExample',
      version     : 1.0,
      size        : 4980736, // Size of database, in bytes. WebSQL-only for now.
      storeName   : 'keyvaluepairs', // Should be alphanumeric, with underscores.
      description : 'forcing WebSQL because of IndexDB issues in Safari'
    });

    // Open the SQLite DB, but only possible on device
    if (ionic.Platform.isWebView()){
      sqlDB = $cordovaSQLite.openDB("liteDB.db");
    }

  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html"
  })

  // Each tab has its own nav history stack:

  .state('tab.local', {
    url: '/local',
    views: {
      'tab-local': {
        templateUrl: 'templates/tab-local.html',
        controller: 'LocalCtrl'
      }
    }
  })

  .state('tab.forage', {
    url: '/forage',
    views: {
      'tab-forage': {
        templateUrl: 'templates/tab-forage.html',
        controller: 'ForageCtrl'
      }
    }
  })

  .state('tab.web', {
    url: '/web',
    views: {
      'tab-web': {
        templateUrl: 'templates/tab-web.html',
        controller: 'WebCtrl'
      }
    }
  })

  .state('tab.sql', {
    url: '/sql',
    views: {
      'tab-sql': {
        templateUrl: 'templates/tab-sql.html',
        controller: 'SQLCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/local');

});
