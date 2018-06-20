function celebrityController( $scope, $routeParams, CelebritiesService, $window ) {

    console.log('parseInt( $routeParams.id ): ', CelebritiesService.search( parseInt( $routeParams.id )) );
    $scope.celebrity = CelebritiesService.search( parseInt( $routeParams.id ) );

    $scope.showMessage = false;
    $scope.message = $scope.celebrity.name + ' removed successfully';

    $scope.remove = function (id) {
        CelebritiesService.delete(id);
        $scope.showMessage = true;

        setTimeout(function() {
            $window.location.href = '/';
        }, 3000);
    }
}

module.exports = celebrityController;