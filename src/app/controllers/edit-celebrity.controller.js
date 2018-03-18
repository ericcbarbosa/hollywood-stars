function editCelebrityController( $scope, $window, $routeParams, CelebritiesService ) {

    $scope.title = 'Edit Celebrity'
    $scope.celebrity = CelebritiesService.search( $routeParams.id );


    $scope.form = {
        hasError: false,
        disableSave: true,

        validate: function () {
            $scope.feedback.messages = [];
    
            if ($scope.celebrity.name.length < 3) {
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

        handleChange: function () {
            $scope.form.disableSave = $scope.form.validate().length > 0 ? true : false;
        },

        update: function () {

            var newCelebrity = $scope.celebrity;
    
            var messages = $scope.form.validate();
    
            if ( messages.length == 0 ) {
    
                CelebritiesService.edit( newCelebrity );
    
                $scope.form.hasError = false;
    
                $scope.feedback.messagesClass();
                $scope.feedback.messages = [];
                $scope.feedback.messages.push( $scope.celebrity.name.artistic + ' updated successfully!' );
    
            } else {
    
                $scope.form.hasError = true;
                $scope.feedback.messagesClass();
    
            }
        }
    };

    $scope.feedback = {
        messages: [],
        messagesModifier: '',
        messagesClass: function () {
            $scope.feedback.messagesModifier =  $scope.form.hasError ? 'error' : 'success';
        }
    };
}

module.exports = editCelebrityController;