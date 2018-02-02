function celebrityController( $scope, $routeParams, CelebritiesService ) {

    $scope.toCapitalize = function(string) {
        var slices = string.split('-');
        var capitalizedSlices = [];

        slices.forEach( function(word) {
            capitalizedSlices.push( word.charAt(0).toUpperCase() + word.slice(1) );
        });

        return capitalizedSlices.join(' ');
    }

    $scope.celebrityList = CelebritiesService;
    $scope.celebrityName = $scope.toCapitalize( $routeParams.name );

    $scope.celebrityList.map(function(celebrity) {
        if ( celebrity.name == $scope.celebrityName ) {
            $scope.celebrity = celebrity;
        }
    });
}

module.exports = celebrityController;