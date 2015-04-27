angular.module('starter.websql', [])

// Learn More: http://html5doctor.com/introducing-web-sql-databases/
.controller('WebCtrl', function($scope, Phrases) {

	$scope.shouldShowDelete = false;
	// Get phrases from services.js Phrases Factory
	$scope.phrases = Phrases.all();

	$scope.ctrlData = {
      selectedPhrase : {"name" : "palaver"}, // <-- this is the default item
      newPhrase : {"name" : ""}
    };

	//The DB itself has been created on the window using our createDB.js 
	//Note: Setting up the database should probably be handled just on start in the services.js in .run

	$scope.dbNullHandler = function(value){
		console.log("Null Hander: " + value);
	}
	$scope.dbSuccessHandler = function(value){
		console.log("Success Hander: " + value);
	}
	$scope.dbErrorHandler = function(value){
		console.log("Error Hander: " + value);
	}
    //Add data to WebSQL 
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

    //Remove data to WebSQL 
    $scope.removeData = function(index, exampleID) {
    	$scope.storedData.splice(index, 1);
    	db.transaction(function(transaction) {
			transaction.executeSql('DELETE FROM Example WHERE example_id = ?',[exampleID]);
        });
    }

    $scope.showDelete = function() {
    	$scope.shouldShowDelete = !$scope.shouldShowDelete;
    }

	$scope.$on('$ionicView.enter', function() {
  		db.transaction(
  			function(transaction) {
	            transaction.executeSql("SELECT * FROM Example ORDER BY created_on", [],
				    function(transaction, results) {
				    	$scope.storedData = [];
						for (var i = 0; i < results.rows.length; i++) {
                          var row = results.rows.item(i);
                          $scope.storedData.push(row);
                          if (i == results.rows.length - 1){
                            console.log("WebSQL Data: " + JSON.stringify($scope.storedData));
                          }
                        }
					}
				)    
			}
		);
	}); 

});