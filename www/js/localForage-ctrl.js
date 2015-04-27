angular.module('starter.localforage', [])

// Learn More: https://github.com/mozilla/localForage
// localforage.js added to index.html
// Angular Service & Directive available at: https://github.com/ocombe/angular-localForage
// angular-localForage.js added to index.html
// Benefit: callbacks, promises, store objects, store blobs, store typed arrays, set configs for driver type | name | version | description
.controller('ForageCtrl', function($scope, Phrases) {

	$scope.shouldShowDelete = false;
	// Get phrases from services.js Phrases Factory
	$scope.phrases = Phrases.all();

	$scope.ctrlData = {
      selectedPhrase : {"name" : "palaver"}, // <-- this is the default item
      newPhrase : {"name" : ""}
    };

    //Add data to localForage 
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

    //Remove data to localForage 
    $scope.removeData = function(index) {
    	$scope.storedData.splice(index, 1);
    	localforage.setItem('storedDataForage', $scope.storedData);
    }

    $scope.showDelete = function() {
    	$scope.shouldShowDelete = !$scope.shouldShowDelete;
    }

	$scope.$on('$ionicView.enter', function() {
		localforage.getItem('storedDataForage', function(err, value){
			if (err){
				$scope.storedData = [];
			} else if (value == null){
				localforage.setItem('storedDataForage', []);
				$scope.storedData = [];
			} else {
				$scope.storedData = value;
			}
		})

		//Count Times Visited
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
	}); 

});