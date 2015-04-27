angular.module('starter.localstorage', [])

// Learn More: http://diveintohtml5.info/storage.html
.controller('LocalCtrl', function($scope, Phrases) {

	$scope.shouldShowDelete = false;
	// Get phrases from services.js Phrases Factory
	$scope.phrases = Phrases.all();

	$scope.ctrlData = {
      selectedPhrase : {"name" : "palaver"}, // <-- this is the default item
      newPhrase : {"name" : ""}
    };

    //Add data to localStorage 
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

    //Add data from localStorage 
    $scope.removeData = function(index) {
    	$scope.storedData.splice(index, 1);
    	localStorage.setItem('storedData', JSON.stringify($scope.storedData));
    }

    $scope.showDelete = function() {
    	$scope.shouldShowDelete = !$scope.shouldShowDelete;
    }

	$scope.$on('$ionicView.enter', function() {
		$scope.storedData = JSON.parse(localStorage.getItem('storedData')) || [];

		//Count timesVisited
		$scope.timesVisited = localStorage.getItem('timesVisited') || 0;
		$scope.timesVisited++;
		localStorage.setItem('timesVisited', $scope.timesVisited);
	}); 

});
