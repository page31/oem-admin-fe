define({
    name: 'configGeneralCtrl',
    inject: ['$scope', '$state', '$configData', '$helper', 'dataService'],
    watch: {
        'currentConfig': function(val) {
            if (val) this.refresh();
        }
    },
    init: function() {
        // 渠道BDConfigBean的数据（放在run里面），然后预存如到ng-model中 -》 加入简单的validate
        /*
                BDConfigBean - [{
                    alias: 'lenovo',
                    appEssential, gameEssentail, gameTopApps, indexTopApps - 推荐位 每个空格切一行
                    categoryTopApps - 分类排序自定义
                    forbiddenApps - 黑名单
                    oemApks
                    oemSpecial
                    searchTopApps - 搜索自定义
                    sources: ['三星xx']
                }]
             */
    },
    saveBdConfigHandler: function() {
        var $scope = this.$;
        this.dataService.saveConfigData($scope.currentConfig, $scope.currentConfigTextareaKey, $scope.currentConfigTextarea);
    },
    refresh: function() {
        var $routeParams = this.$state.params,
            $scope = this.$scope,
            $helper = this.$helper;

        if ($routeParams.type !== 'recommends') {
            $scope.currentConfigTextarea = $helper.getConfigTextarea($scope.currentConfig, $routeParams.type);
            $scope.currentConfigTextareaKey = $routeParams.type;
        } else {
            // Render recommendsCandidates Dropdown, and switch handler
            $scope.recommendsCandidates = this.$configData.recommendsCandidates;
            $scope.switchRecommendHandler = function(i) {
                $scope.currentRecommend = i;
            };
            $scope.currentRecommend = $scope.recommendsCandidates[0];
            $scope.$watch('currentRecommend', function(val) {
                if (val) {
                    $scope.currentConfigTextarea = $helper.getConfigTextarea($scope.currentConfig, val.key);
                    $scope.currentConfigTextareaKey = val.key;
                }
            });
        }
    }
});