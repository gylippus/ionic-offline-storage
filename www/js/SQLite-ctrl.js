angular.module('starter.sqlite', [])

// To add the SQLite Plugin:
// cordova plugin add https://github.com/brodysoft/Cordova-SQLitePlugin.git
// Learn More: http://ngcordova.com/docs/plugins/sqlite/
.controller('SQLCtrl', function($scope, $cordovaSQLite , Phrases) {

	//Checking for webView for SQLite compataility, only available on native
	$scope.webView = ionic.Platform.isWebView();

	$scope.shouldShowDelete = false;
	// Get phrases from services.js Phrases Factory
	$scope.phrases = Phrases.all();

	$scope.ctrlData = {
      selectedPhrase : {"name" : "palaver"}, // <-- this is the default item
      newPhrase : {"name" : ""}
    };

    //Add data to SQLite 
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
    	$scope.ctrlData.newPhrase.name = '';
    }

    //Remove data from SQLite 
    $scope.removeData = function(index, exampleId){
    	$scope.storedData.splice(index, 1);
    	var query = "DELETE FROM sqltable WHERE id = ?";
	    $cordovaSQLite.execute(sqlDB, query, [exampleId]);
    }

    $scope.showDelete = function() {
    	$scope.shouldShowDelete = !$scope.shouldShowDelete;
    }

	$scope.$on('$ionicView.beforeEnter', function() {
		$scope.storedData = [];
		if ($scope.webView){
			var query = "SELECT id, name FROM sqltable";
			//Honestly prefer to have this CREATE in app.js but it was not working befor presentation
      		$cordovaSQLite.execute(sqlDB, "CREATE TABLE IF NOT EXISTS sqltable (id INTEGER NOT NULL PRIMARY KEY, name text)");
	        $cordovaSQLite.execute(sqlDB, query).then(function(res) {
	        	for (var i = 0; i < res.rows.length; i++) {
                  var row = res.rows.item(i);
                  $scope.storedData.push(row);
                  if (i == res.rows.length - 1){
                    console.log("WebSQL Data: " + JSON.stringify($scope.storedData));
                  }
                }
	        }, function (err) {
	            console.error(err);
	        });
		} else {
			$scope.storedData = [];
		}
	}); 

});


