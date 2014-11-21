define([], function() {
    angular.module('oemBase', ['ui.router'])
        .provider('$routeHelper', function($stateProvider) {
            this.templateUrlForChild = 'templates/{0}/{1}.html';
            this.configChild = function(parent, children) {
                var self = this;
                _.each(children, function(i) {
                    i.state = parent + '.' + i.id;
                    $stateProvider.state(i.state, {
                        url: i.url || '/' + i.id,
                        templateUrl: i.templateUrl || self.templateUrlForChild.supplant([parent, i.id]),
                        controller: parent + _.classify(i.id) + 'Ctrl'
                    });
                });
            };
            this.$get = {};
        });
});