function capitalizeDirective () {
    return {
        require: 'ngModel',
        restrict: 'A',
        link: link
    };
}

function link(scope, element, attrs, ctrl) {
    
    var _capitalize = function (text) {
        var wordsArray = text.split(' ');

        var capitalizedWords = wordsArray.map(function (word) {

            if (/(da|de)/.test(word)) return word;

            return word.charAt(0).toUpperCase() + word.substring(1).toLowerCase();
        });
        
        return capitalizedWords.join(' ');
    }
    
    element.bind("blur", function () {

        var checkMinLength = (ctrl.$viewValue.length >= attrs.ngMinlength) ? true : false;
        var checkMaxLength = (ctrl.$viewValue.length <= attrs.ngMaxlength) ? true : false;

        if ( checkMinLength && checkMaxLength ) {
            ctrl.$setViewValue(_capitalize(ctrl.$viewValue));
            ctrl.$render();
        }
    });
}

module.exports = capitalizeDirective;