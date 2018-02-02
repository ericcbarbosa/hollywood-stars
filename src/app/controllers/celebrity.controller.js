function celebrityController( $scope, $routeParams, CelebritiesService ) {

    $scope.celebrityList = CelebritiesService.getCelebrities();
    $scope.celebrityName = CelebritiesService.toCapitalize( $routeParams.name );

    $scope.celebrityList.map( function( celebrity ) {
        if ( celebrity.name == $scope.celebrityName ) {
            $scope.celebrity = celebrity;
        }
    });
}

module.exports = celebrityController;