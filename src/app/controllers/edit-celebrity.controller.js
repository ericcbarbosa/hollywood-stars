function editCelebrityController( $scope, $routeParams, CelebritiesService ) {

    $scope.title = 'Edit Celebrity'
    $scope.celebrity = CelebritiesService.search( $routeParams.id );

    $scope.update = function () {

        var newCelebrity = $scope.celebrity;
        console.log(newCelebrity)

        CelebritiesService.edit( newCelebrity );
    }

}

module.exports = editCelebrityController;