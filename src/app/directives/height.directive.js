function heightDirective () {

    return {
        require: 'ngModel',
        restrict: 'A',
        link: link
    };
}

function link(scope, element, attrs, ctrl) {
    
    var _formatHeight = function (height) {

        // Removes everything that's not a number or a comma
        height = height.replace(/[^0-9]+/g, "");
        
        if ( height.length > 1 ) {
            height = height.substring(0, 1) + ',' + height.substring(1,3);
        }

        return height;
    }

    element.bind("keyup", function () {
        // console.log(_formatHeight(ctrl.$viewValue));
        ctrl.$setViewValue(_formatHeight(ctrl.$viewValue));
        ctrl.$render();
    });
}

module.exports = heightDirective;