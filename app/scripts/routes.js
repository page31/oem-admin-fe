define(function() {
    return {
        /*'master': {
            url: '/',
            abstract: true,
            views: {
                'noticeBar': {
                    templateUrl: 'tem'
                }
            }
        },*/
        'system': {
            url: '/system',
            templateUrl: 'templates/system/index.html',
            controller: 'systemCtrl'
        }
    };
});