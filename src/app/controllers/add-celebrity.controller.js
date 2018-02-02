function addCelebrityController( $scope, $routeParams, CelebritiesService ) {

    $scope.celebrities = CelebritiesService.getCelebrities();

    $scope.celebrity = {
        name: '',
        description: '',
        image: ''
    }

    $scope.add = function () {
        $scope.celebrity.id = $scope.celebrities.length;
        $scope.celebrity.urlName = CelebritiesService.toUrl( $scope.celebrity.name );

        console.log('celebrity to add ->', $scope.celebrity);

        CelebritiesService.add($scope.celebrity);
        console.log(CelebritiesService.getCelebrities())
    }
    
}

module.exports = addCelebrityController;