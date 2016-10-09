
var app = angular.module('bbtf', ['ionic']); 
/**
 * The Subjects factory handles saving and loading subjects
 * from local storage, and also lets us save and load the
 * last active subjects index.
 */
app.factory('Subjects', function() {
  return {
    all: function() {
      var subjectString = window.localStorage['subjects'];
      if(subjectString) {
        return angular.fromJson(subjectString);
      }
      return [];
    },
    save: function(subjects) {
      window.localStorage['subjects'] = angular.toJson(subjects);
    },
    newSubject: function(subjectTitle) {
      // Add a new subject
      return {
        title: subjectTitle,
        pupils: []
      };
    },
    getLastActiveIndex: function() {
      return parseInt(window.localStorage['lastActiveSubject']) || 0;
    },
    setLastActiveIndex: function(index) {
      window.localStorage['lastActiveSubject'] = index;
    }
  }
})



app.controller('BbtfCtrl', function($scope, $timeout, $ionicModal, Subjects, $ionicSideMenuDelegate) {
 
 

$scope.doContactPickerTest = function() {
  	alert("Halloa");
	 // $scope.pupil.name = "Joe Due";	
	 $scope.pupil.name = "Joe";	
  	
  }

$scope.edit = function(pupil) {
    alert('Edit Item: ' + pupil.name);
  };
  $scope.delete = function(pupil) {  	
  	$scope.activeSubject.pupils.splice($scope.activeSubject.pupils.indexOf(pupil), 1);  	

  	// Inefficient, but save all the subjects
    Subjects.save($scope.subjects);

  };

// erstelle ein ratings
  $scope.createRating = function(pupil, index) {
	  
	 if(!$scope.activeSubject || !pupil) {
      return;
    }
	$scope.activeSubject.pupils[index].ratings.push({
		datum: "2016-01-31"
	});
	
	 // Inefficient, but save all the subjects
    Subjects.save($scope.subjects);

   
  }

  // Hole Kontakt aus Adressbuch
  $scope.doContactPicker = function() {
  	navigator.contacts.pickContact(function(contact){  		
  		var p = {name: contact.displayName};
	 	$scope.createPupil(p);  		
  	}, function(err) {
  		navigator.notification.alert(err, null, "Failure");
  	});
  }
  
  
  
  // erstelle ein Teufelcehn
  $scope.createTeufelchen = function(pupil, index) {
	  
	 if(!$scope.activeSubject || !pupil) {
      return;
    }
	$scope.activeSubject.pupils[index].teufelchen.push({
		datum: "2016-01-31"
	});
	
	 // Inefficient, but save all the subjects
    Subjects.save($scope.subjects);

   
  }


  // A utility function for creating a new subject
  // with the given subjectTitle
  var createSubject = function(subjectTitle) {
    var newSubject = Subjects.newSubject(subjectTitle);
    $scope.subjects.push(newSubject);
		
    $scope.selectSubject(newSubject, $scope.subjects.length-1);
  }


  // Load or initialize subjects
  $scope.subjects = Subjects.all();

  // Grab the last active, or the first subject
  $scope.activeSubject = $scope.subjects[Subjects.getLastActiveIndex()];

  // Called to create a new subject
  $scope.newSubject = function() {
    var subjectTitle = prompt('Klassenbezeichnung');
    if(subjectTitle) {
      createSubject(subjectTitle);
    }
  };

  // Called to select the given subject
  $scope.selectSubject = function(subject, index) {
    $scope.activeSubject = subject;
    Subjects.setLastActiveIndex(index);
    $ionicSideMenuDelegate.toggleLeft(false);
  };
  
  // Pupil geklickt, Rating hinzufügen
  $scope.addRating = function(pupil, index) {
	  
  };
  
  

  // Create our modal
  $ionicModal.fromTemplateUrl('new-pupil.html', function(modal) {
    $scope.pupilModal = modal;
  }, {
    scope: $scope
  });

  $scope.createPupil = function(pupil) {
    if(!$scope.activeSubject || !pupil) {
      return;
    }
    $scope.activeSubject.pupils.push({
      name: pupil.name, 
	  ratings: [],
	  teufelchen: []
    });
    $scope.pupilModal.hide();

    // Inefficient, but save all the subjects
    Subjects.save($scope.subjects);

    pupil.name = "";
  };

  $scope.newPupil = function() {
    $scope.pupilModal.show();
  };

  $scope.closeNewPupil = function() {
    $scope.pupilModal.hide();
  }
  
  $scope.doContactPickerTest = function() {
  	alert("Hallo1");
	 //$scope.pupil.name = "Joe Due";	
	 var p = {name:"John Doe"};
	 $scope.createPupil(p);
	 
	 
  	
  }

  $scope.toggleSubjects = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };


  // Try to create the first subject, make sure to defer
  // this by using $timeout so everything is initialized
  // properly
  $timeout(function() {
    if($scope.subjects.length == 0) {
      while(true) {
        var subjectTitle = prompt('Die erste Klassenbezeichnung:');
        if(subjectTitle) {
          createSubject(subjectTitle);
          break;
        }
      }
    }
  }, 1000);

})
