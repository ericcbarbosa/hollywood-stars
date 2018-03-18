function feedbackMessagesController ($scope, $element, $attrs) {
    // this.$onInit = function() {
    //     console.log(this)
    // }
}

var feedbackMessagesComponent = {
    templateUrl: '/assets/views/components/feedback-messages.template.html',
    controller: feedbackMessagesController,
    bindings: {
        modifier: '<',
        messages: '<'
    }
};

module.exports = feedbackMessagesComponent;