Intro


- Benefit of creating applications is that we have the ability to store data for that particular user in the browser. 
- Benefit of native application is that we can user this data when offline and still provide value to the user

We will discuss:
-localStorage
-localForage
-WebSQL
-SQLite

We will not discuss:
-IndexDB (unless with localForgage)
-CouchDB (Store your data with JSON documents)
-File API

------------------------------------------------------------------------

localStorage


Great for super simple implementation and browser compatablility.

Simple to use and very reliable.

Great for numbers and strings, not so great for complex data including arrays and objects without the use of JSON.parse and JSON.stringify

	ADD DATA
	-Add function addData
	-Very simple validation to use select or input
	-Push to $scope array for storedData
	-setItem to save in localStorage
	-clear input

    $scope.addData = function() {
    	var phraseToAdd = '';
    	if ($scope.ctrlData.newPhrase.name !== ""){
			phraseToAdd = $scope.ctrlData.newPhrase.name;
    	} else {
    		phraseToAdd = $scope.ctrlData.selectedPhrase.name;
    	}
    	$scope.storedData.push(phraseToAdd);
    	localStorage.setItem('storedData', JSON.stringify($scope.storedData));
    	$scope.ctrlData.newPhrase.name = '';
    }

    REMOVE DATA
    -slice from $scope array for storedData
    -setItem to save in localStorage

    $scope.removeData = function(index) {
    	$scope.storedData.splice(index, 1);
    	localStorage.setItem('storedData', JSON.stringify($scope.storedData));
    }

    COUNT VISITS
    -getItem for timesVisited or set to 0
    -increment timesVisited
    -setItem for timesVisited

	$scope.timesVisited = localStorage.getItem('timesVisited') || 0;
	$scope.timesVisited++;
	localStorage.setItem('timesVisited', $scope.timesVisited);


-----------------------------------------------------------------------

localForage


Made by Mozilla

"localForage is a fast and simple storage library for JavaScript. localForage improves the offline experience of your web app by using asynchronous storage (IndexedDB or WebSQL) with a simple, localStorage-like API"

Picks best available storage options for the browser

Similar to localStorage except it adds:
- callbacks, promises, store objects, store blobs, store typed arrays
- set configs for driver type | name | version | description

Great for complex data including arrays and objects without the use of JSON.parse and JSON.stringify

	ADD DATA
	-Add function addData
	-Very simple validation to use select or input
	-Push to $scope array for storedData
	-setItem to save in localforage (mention the lack of JSON.stringify)
	-use promise to console.log result
	-clear input

    $scope.addData = function() {
    	var phraseToAdd = '';
    	if ($scope.ctrlData.newPhrase.name !== ""){
			phraseToAdd = $scope.ctrlData.newPhrase.name;
    	} else {
    		phraseToAdd = $scope.ctrlData.selectedPhrase.name;
    	}
    	$scope.storedData.push(phraseToAdd);
    	localforage.setItem('storedDataForage', $scope.storedData).then(function(value) {
		    console.log(phraseToAdd + ' was added!');
		}, function(error) {
		    console.error(error);
		});
    	$scope.ctrlData.newPhrase.name = '';
    }

    REMOVE DATA
    -slice from $scope array for storedData
    -setItem to save in localStorage (mention the lack of JSON.stringify)

    $scope.removeData = function(index) {
    	$scope.storedData.splice(index, 1);
    	localforage.setItem('storedDataForage', $scope.storedData);
    }

    COUNT VISITS
    -getItem for timesVisited with success and failure callbacks
    -check for result and if null use setItem to set data to 1
    -if result, increment and update with result, could use some validation here
    -console.log any error messages
    
	$scope.timesVisited = localforage.getItem('timesVisitedForage', function(err, value){
		if (err){
			console.log('getItem error: ' + error)
		} else if (value == null){
			localforage.setItem('timesVisitedForage', 1);
		} else {
			value++;
			localforage.setItem('timesVisitedForage', value);				
		}
	})

-----------------------------------------------------------------------

WebSQL


Web SQL Database is a web page API for storing data in databases that can be queried using a variant of SQL.[1] The API is supported by Google Chrome,[2] Opera,[3] Safari[3] and the Android Browser.

Supposed to be replaced by IndexDB, but truthfully that is not ready yet for some browsers, Raymond Camden [http://www.raymondcamden.com/]

Great for SQL style database that can be queried and sorted easily. Structured data.

	***** DB SETUP *****
	done in our createDB.js

	ADD DATA
	-Add function addData
	-Very simple validation to use select or input
	-INSERT db transaction
	-Push to data $scope array for storedData
	-need $scope.$apply() for example
	-clear input

    $scope.addData = function() {
    	var phraseToAdd = '';
    	if ($scope.ctrlData.newPhrase.name !== ""){
			phraseToAdd = $scope.ctrlData.newPhrase.name;
    	} else {
    		phraseToAdd = $scope.ctrlData.selectedPhrase.name;
    	}
		db.transaction(function(transaction) {
	        transaction.executeSql('INSERT INTO Example(created_on, type) VALUES ((datetime("now","localtime")),?)',[phraseToAdd],
	        	function(transaction, result){
	        		$scope.storedData.push({"example_id":result.insertId,"type":phraseToAdd});
	        		//This example needs $scope.$apply(), didn't have time to find out why :(
	        		$scope.$apply();
	        	}
	        );
	    });
    	$scope.ctrlData.newPhrase.name = '';
    }

    REMOVE DATA
    -slice from $scope array using index which was passed from ng-click
    -DELETE SQL transaction

    $scope.removeData = function(index, exampleID) {
    	$scope.storedData.splice(index, 1);
    	db.transaction(function(transaction) {
			transaction.executeSql('DELETE FROM Example WHERE example_id = ?',[exampleID]);
        });
    }

-----------------------------------------------------------------------

SQLite Plugin

Native interface to sqlite in a Cordova/PhoneGap plugin for Android, iOS, Windows Universal (8.1), Amazon Fire-OS, and WP(7/8) with API similar to HTML5/Web SQL API.

Actively Maintained, make sure you read the github Status, Announcements, Highlights, and known issues
- This plugin will not work before the callback for the "deviceready" event has been fired, as 
- The new location option is used to select the database subdirectory location (iOS only) for how info is show in iCloud and iTunes
- Possible to pre-populate data
- Workaround for newer Android version causing db lock issue is available. Takes a few extra options in Open DB usage:
var db = window.sqlitePlugin.openDatabase({name: "my.db", androidDatabaseImplementation: 2, androidLockWorkaround: 1});

ng-cordova plugin available: http://ngcordova.com/docs/plugins/sqlite/
Great resources for ng-cordova SQLite plugin:
- https://blog.nraboy.com/2014/11/use-sqlite-instead-local-storage-ionic-framework/
- https://gist.github.com/borissondagh/29d1ed19d0df6051c56f

USAGE FOR PLUGIN INSTALL IN IONIC PROJECT:

ionic platform add ios //if necessary
cordova plugin add https://github.com/brodysoft/Cordova-SQLitePlugin.git
bower install ngCordova //if using ng-cordova
- Include ng-cordova.js or ng-cordova.min.js in your index.html file before cordova.js and after your AngularJS / Ionic file (since ngCordova depends on AngularJS). Also need to add 'ngCordova' module to app.js
ionic run ios


	OPENING A DB
	-If using ng-Cordova, you must wrap immediate plugin calls with deviceready or $ionicPlatform.ready
	- sqlDB was created as a variable in app.js To use the ngCordova functions we need to include $cordovaSQLite in the .run() method. Created a new database called liteDB.db and a fresh table called sqlite_table.

	var sqlDB = null;
	sqlDB = $cordovaSQLite.openDB("liteDB.db");

	$cordovaSQLite.execute(sqlDB, "CREATE TABLE IF NOT EXISTS sqltable (id INTEGER NOT NULL PRIMARY KEY, name text)");

	ADD DATA
	-Add function addData
	-Very simple validation to use select or input
	-create query with INSERT
	-execute query
	-Push to data $scope array for storedData
	-clear input

    $scope.addData = function(){
    	var phraseToAdd = '';
    	if ($scope.ctrlData.newPhrase.name !== ""){
			phraseToAdd = $scope.ctrlData.newPhrase.name;
    	} else {
    		phraseToAdd = $scope.ctrlData.selectedPhrase.name;
    	}
    	var query = "INSERT INTO sqltable (name) VALUES (?)";
	    $cordovaSQLite.execute(sqlDB, query, [phraseToAdd]).then(function(res) {
	      $scope.storedData.push({"id":res.insertId, "name":phraseToAdd});
	    }, function (err) {
	      console.error(err);
	    });
    }

    REMOVE DATA
    -slice from $scope array using index which was passed from ng-click
	-create query with DELETE
	-execute query

    $scope.removeData = function(index, exampleId){
    	$scope.storedData.splice(index, 1);
    	var query = "DELETE FROM sqltable WHERE id = ?";
	    $cordovaSQLite.execute(sqlDB, query, [exampleId]);
    }




























