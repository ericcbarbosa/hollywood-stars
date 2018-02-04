function celebrityController( $scope, $routeParams, CelebritiesService ) {

    $scope.celebrityList    = CelebritiesService.get();
    $scope.celebrityUrlName = $routeParams.name;
    $scope.celebrityId      = $routeParams.id;
    $scope.celebrityName    = CelebritiesService.toCapitalize( $scope.celebrityUrlName );

    $scope.celebrityList.map( function( celebrity ) {
        if ( celebrity.id == $scope.celebrityId ) {
            $scope.celebrity = celebrity;
        }
    });
}

module.exports = celebrityController;