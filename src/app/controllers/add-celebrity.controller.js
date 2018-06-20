function addCelebrityController( $scope, $routeParams, CelebritiesService ) {

    $scope.title = 'Add a new celebrity:';

    $scope.celebrities = CelebritiesService.getCelebrities();
    $scope.updateCelebrities = function () {
        $scope.celebrities = CelebritiesService.getCelebrities();
    }

    $scope.celebrity = {
        name: {
            birth: '',
            artistic: ''
        },
        image: '',
        birthdate: '',
        gender: '',
        height: '',
        occupation: '',
        description: '',
    }
    
    $scope.form = {
        hasError: false,
        disableSave: true,

        validate: function () {
            $scope.feedback.messages = [];
    
            if ($scope.celebrity.name.artistic.length < 3) {
                $scope.feedback.messages.push( 'Invalid name' );
            }
    
            if ($scope.celebrity.description.length < 3) {
                $scope.feedback.messages.push( 'Invalid description' );
            }
    
            if ($scope.celebrity.image.length < 3) {
                $scope.feedback.messages.push( 'Invalid image path' );
            }
    
            return $scope.feedback.messages;
        },

        handleBlur: function () {
            
        },

        handleChange: function () {
            $scope.form.disableSave = $scope.form.validate().length > 0 ? true : false;
        },

        add: function ($form) {

            if ( !$form.$invalid ) {
                $scope.updateCelebrities();
    
                $scope.celebrity.id      = $scope.celebrities ? $scope.celebrities.length + 1 : 1;
                $scope.celebrity.urlName = CelebritiesService.toUrl( $scope.celebrity.name.artistic );
    
                CelebritiesService.add( $scope.celebrity );

                $scope.form.reset();
                $scope.form.hasError = true;

                $scope.feedback.messagesClass();
                $scope.feedback.messages.push( $scope.celebrity.name.artistic + ' added successfully!' );
            } else {
                $scope.form.hasError = true;

                $scope.feedback.messagesClass();
                $scope.feedback.messages = [];
                $scope.feedback.messages.push( 'Complete the form to add a new celebrity' );
                console.log($form.artisticName);
            }
        },

        reset: function () {
            $scope.celebrity = {
                name: {
                    birth: '',
                    artistic: ''
                },
                image: '',
                birthdate: '',
                gender: '',
                height: '',
                occupation: '',
                description: '',
            }
        }
    }

    $scope.feedback = {
        messages: [],
        messagesModifier: '',
        messagesClass: function () {
            $scope.feedback.messagesModifier =  $scope.form.hasError ? 'danger' : 'success';
        },
    }

}

module.exports = addCelebrityController;