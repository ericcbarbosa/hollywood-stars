function addCelebrityController( $scope, $routeParams, CelebritiesService ) {

    $scope.celebrities = CelebritiesService.get();

    $scope.updateCelebrities = function () {
        $scope.celebrities = CelebritiesService.get();
    }

    $scope.celebrity = {
        name: '',
        description: '',
        image: ''
    }

    $scope.messages = [];
    $scope.hasError = false;

    $scope.validate = function () {
        $scope.messages = [];

        if ($scope.celebrity.name.length < 3) {
            $scope.messages.push( 'Invalid name' );
        }

        if ($scope.celebrity.description.length < 3) {
            $scope.messages.push( 'Invalid description' );
        }

        if ($scope.celebrity.image.length < 3) {
            $scope.messages.push( 'Invalid image path' );
        }

        return $scope.messages;
    },

    $scope.add = function () {

        var messages = $scope.validate();

        if ( messages.length == 0 ) {
            $scope.updateCelebrities();

            $scope.celebrity.id = $scope.celebrities ? $scope.celebrities.length + 1 : 1;
            $scope.celebrity.urlName = CelebritiesService.toUrl( $scope.celebrity.name );

            CelebritiesService.add( $scope.celebrity );

            $scope.hasError = false;

            $scope.messages = [];
            $scope.messages.push( $scope.celebrity.name + ' adicionada com sucesso!' );

            $scope.resetForm();

        } else {
            $scope.hasError = true;
        }
    }

    $scope.resetForm = function () {
        $scope.celebrity = {
            id: 0,
            name: '',
            urlName: '',
            description: '',
            image: ''
        }
    }

    $scope.resetMessage = function () {
        $scope.messages = [];
    }

    $scope.printMessage = function (text) {
        $scope.resetMessage();

        $scope.feedback.message = text;
        $scope.feedback.icon    = 'check';
    }

}

module.exports = addCelebrityController;