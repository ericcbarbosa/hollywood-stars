function dateDirective () {
    return {
        require: 'ngModel',
        restrict: 'A',
        link: link
    };
}

function link(scope, element, attrs, ctrl) {

    var _formatDate = function (input) {

        // replace everything that's not a num for ""
        input = input.replace(/[^0-9]+/g, "");

        if(input.length > 2) {
            input = input.substring(0,2) + "/" + input.substring(2);
        }

        if(input.length > 5) {
            input = input.substring(0,5) + "/" + input.substring(5,9);
        }

        return input;
    }
    
    element.bind("keyup", function () {
        ctrl.$setViewValue(_formatDate(ctrl.$viewValue));
        ctrl.$render();
    });
}

module.exports = dateDirective;