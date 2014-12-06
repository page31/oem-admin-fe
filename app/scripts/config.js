require.config({
    baseUrl: '/scripts',
    paths: {
        'bower': '../bower_components',
        'fineuploader': 'vendor/fineuploader.patch',
        'highcharts': '../bower_components/highcharts.com/js/highcharts.src',
        'highcharts_nodata': '../bower_components/highcharts.com/js/modules/no-data-to-display.src',
        'ZeroClipboard': '../bower_components/zeroclipboard/dist/ZeroClipboard',
        'angular-wizard': '../bower_components/angular-wizard/dist/angular-wizard'
    },
    shim: {
        'highcharts': {
            'exports': 'Highcharts'
        },
        'highcharts_nodata': {
            'deps': ['highcharts'],
            'exports': 'highcharts_nodata'
        },
        'ZeroClipboard': {
            'exports': '_ZeroClipboard'
        },
        'angular-wizard': {
            'exports': '_angular_wizard'
        }
    }
});