function listCelebrityController( $scope, CelebritiesService ) {

    $scope.celebrityList = CelebritiesService.getCelebrities();

    $scope.selectOptions = [
        { name: 'Name', value: 'name' },
        { name: 'Age', value: 'age' }
    ]

    $scope.remove = function(id) {
        CelebritiesService.delete(id);
        $scope.celebrityList = CelebritiesService.getCelebrities();
    }

    $scope.title = 'All celebrities'

    var reg = /^\d{4,5}-\d{4}$/;
}

module.exports = listCelebrityController;