define([], function() {
    var systemApp = angular.module('systemApp.baseCtrl', ['pmtBase']);
    systemApp.controller('systemCtrl', function($scope, formlyHelper, apiHelper) {
        // extract to i18n
        $scope.menuList = systemMenuList;

        var BeforeTransformerMap = {
            channel: function(res, meta) {
                res.configAlias = meta.raw.bdConfigDetail.configAlias;
            },
            apiPartner: function(res) {},
            auth: function(res) {
                /* trans authorizedOem */
            }
        };
        var DelHandlerMap = {};

        $scope.FORMMAP = {};
        $scope.BeforeTransformerMap = BeforeTransformerMap;
        $scope.DelHandlerMap = DelHandlerMap;

        var FORMMAP = $scope.FORMMAP;

        apiHelper('fetchAuthMeta', {
            busy: 'global'
        }).then(function(r) {
            // process hook for auth meta
            _.each(r.authorizedItems.authorizedLevel2, function(val, key) {
                r.authorizedItems.authorizedLevel1[key].children = val;
            });
            $scope.$root.authMeta = r;
        });

        // Todo: 为什么 child 访问不到？！
        $scope.$root.onSet = function(type, item, meta) {
            BeforeTransformerMap[type] && BeforeTransformerMap[type](item, meta);
            formlyHelper.openModal(FORMMAP[type], item);
        };
        $scope.$root.onEdit = $scope.$root.onSet;
        $scope.$root.onAdd = function(type) {
            formlyHelper.openModal(FORMMAP[type]);
        };
        $scope.$root.onDel = function(type, item, scope) {
            if (window.confirm('您确定要删除该资源吗？')) {
                FORMMAP[type].del && FORMMAP[type].del(item, scope);
            }
        };
    });
});