
var app = angular.module('bbtf', ['ionic']); 
/**
 * The Subjects factory handles saving and loading subjects
 * from local storage, and also lets us save and load the
 * last active subjects index.
 */
 
 app.config(['$httpProvider', function($httpProvider) {
 	$httpProvider.defaults.useXDomain = true;
 	delete $httpProvider.defaults.headers.common['X-Requested-With'];
  }
]);


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



app.controller('BbtfCtrl', function($scope, $timeout, $ionicModal, Subjects, $ionicSideMenuDelegate, $ionicPopup, $http, $log) {
 
	// Filter zum Sortieren nach Name oder Bienchen 
	$scope.orderByMe = function(x) {
	        $scope.myOrderBy = x;
	    };
		
		
	// Called to upload Data
  $scope.uploadData = function() {
	  $scope.url = localStorage.url;
	  if (!$scope.url) {
	  	$scope.url = "localhost";
		localStorage.url = $scope.url;
	  }
	  var restsrv = "http://" + $scope.url + "/bbtf/rest/uploaddata.php";
	  alert(restsrv);
	  $http({
	    method: 'POST',
	    url: restsrv,
	    data: {subjects: $scope.subjects},	    
	    headers: {
	        'Content-Type': 'application/x-www-form-urlencoded'
	    }
	})
	.success(function(data) {
	    console.log(data);
	});

	
 } /* uploadData() */
 
 

$scope.doContactPickerTest = function() {
  	alert("Halloa");
	 // $scope.pupil.name = "Joe Due";	
	 $scope.pupil.name = "Joe";	
  	
  }
	// An alert dialog
   $scope.showAlert = function() {
     var alertPopup = $ionicPopup.alert({
       title: 'Klasse hat Schüler!',
       template: 'Klasse kann nur gelöscht werden, wenn sie keine Schüler hat.'
     });
     alertPopup.then(function(res) {
       console.log('Thank you for not eating my delicious ice cream cone');
     });
   };
   
  
  $scope.deleteSubject = function(subject) {  

     
	// Sicherheitshalber nur löschen, wenn keine Schüler mehr vorhanden sind
	if($scope.subjects[$scope.subjects.indexOf(subject)].pupils.length != 0) {
		console.log('Soll subject löschen');		
		$scope.showAlert();
	}
	else {
		$scope.subjects.splice($scope.subjects.indexOf(subject), 1);

		// Inefficient, but save all the subjects
		Subjects.save($scope.subjects);
	}
	};
  
  $scope.editSubject = function(subject) {				
		$scope.subjects[$scope.subjects.indexOf(subject)].title = prompt(subject.title);		
				
		// Inefficient, but save all the subjects
		Subjects.save($scope.subjects);
		
  };

  $scope.edit = function(pupil) {				
		
		$scope.activeSubject.pupils[$scope.activeSubject.pupils.indexOf(pupil)].name=prompt(pupil.name);
				
		// Inefficient, but save all the subjects
		Subjects.save($scope.subjects);
		
  };
  
  $scope.delete = function(pupil) {  	
  	$scope.activeSubject.pupils.splice($scope.activeSubject.pupils.indexOf(pupil), 1);  	

  	// Inefficient, but save all the subjects
    Subjects.save($scope.subjects);

  };

// erstelle ein ratings
  $scope.createRating = function(pupil) {
	  var d = new Date();
	  var now = d.getTime();	 
	  
	 if(!$scope.activeSubject || !pupil) {
      return;
    }	
	// Bienchen-Anzahl anpassen
	$scope.activeSubject.pupils[$scope.activeSubject.pupils.indexOf(pupil)].bienchen = $scope.activeSubject.pupils[$scope.activeSubject.pupils.indexOf(pupil)].bienchen + 1;
	// Füge Rating in die Liset ein
	$scope.activeSubject.pupils[$scope.activeSubject.pupils.indexOf(pupil)].ratings.push({
		datum: now
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

  // Fake für WebentwicklungHole Kontakt aus Adressbuch
  $scope.doContactPickerFake = function() {  	
  		var p = {name: "Faki Fake"};
	 	$scope.createPupil(p);  		
  	
  }
  
 
  
  // erstelle ein Teufelchen
  $scope.createTeufelchen = function(pupil, index) {
	  var d = new Date();
	 var now = d.getTime();
	  
	 if(!$scope.activeSubject || !pupil) {
      return;
    }

	// Reduziere die Bienchen
	$scope.activeSubject.pupils[$scope.activeSubject.pupils.indexOf(pupil)].bienchen = $scope.activeSubject.pupils[$scope.activeSubject.pupils.indexOf(pupil)].bienchen - 1;
    $scope.activeSubject.pupils[$scope.activeSubject.pupils.indexOf(pupil)].teufelchen.push({	
		datum: now
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
  };


  // Load or initialize subjects
  $scope.subjects = Subjects.all();

  // Grab the last active, or the first subject
  $scope.activeSubject = $scope.subjects[Subjects.getLastActiveIndex()];

  
  // Called to change the configuration
  $scope.changeUploadDest = function() {
	  var text = "Server: " + $scope.url;
	  $scope.url = prompt(text);
	  localStorage.url = $scope.url ;
	  
  }
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
	  bienchen : 0, 
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