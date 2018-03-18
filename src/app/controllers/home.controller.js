'use strict';

function homeController( $scope, CelebritiesService ) {
    $scope.title = 'Recently added celebrities:';

    $scope.celebrityList = CelebritiesService.get();
}

module.exports = homeController;