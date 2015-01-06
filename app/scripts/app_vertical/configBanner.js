define({
    name: 'configBannerCtrl',
    inject: ['apiHelper', '$scope'],
    init: function() {
        var apiHelper = this.apiHelper,
            $scope = this.$;
        $scope.isAjaxing = false;

        $scope.isShowBannerForm = false;

        apiHelper('fetchBannerConfig').then(function(resp) {
            $scope.typeChoices = resp.typeBeanList;
        });

        $scope.findBeforeMapBanner = function(target) {
            var _ret = '';
            _.each($scope.tabMapping, function(v, k) {
                if (v === target) {
                    _ret = k;
                }
            });
            return _ret;
        };
    },
    delBannerHandler: function(i) {
        var apiHelper = this.apiHelper,
            $scope = this.$;
        if (window.confirm('您确定删除吗?')) {
            apiHelper('delBanner', {
                bannerId: i.id,
                configAlias: $scope.currentConfig.alias,
                tabAlias: $scope.findBeforeMapBanner(i.bannerPosition)
            }, function() {
                // TODO: remove from list
                var list = $scope.currentConfig.banners;
                list.splice(list.indexOf(i), 1);
            });
        }
    },
    editBannerHandler: function(i) {
        // prefill $scope.bannerInfo
        var $scope = this.$;
        $scope.bannerInfo = _.clone(i);
        $scope.bannerInfo.bannerPosition = $scope.findBeforeMapBanner($scope.bannerInfo.bannerPosition);
        $scope.mode = 'edit';
        // reset form state
        $scope.bannerForm.$setPristine(true);
        $scope.editMode = true;
        // $scope.isShowBannerForm = true;
    },
    addBanner: function() {
        // handle the multipart file
        var $scope = this.$;
        var self = this;
        if ($scope.isAjaxing) return;
        if (!$scope.bannerInfo.banner) return;
        var fd = new FormData();
        if (!_.isString($scope.bannerInfo.banner)) {
            // quick fix banner file input
            fd.append('bannerFile', $scope.bannerInfo.banner);
            previewImg($scope.bannerInfo.banner);
        }
        $('#bannerForm #banner').val('');
        delete $scope.bannerInfo.banner;
        var _tmpBannerInfo = _.clone($scope.bannerInfo);
        _tmpBannerInfo.bannerPosition = $scope.tabMapping[_tmpBannerInfo.bannerPosition];
        fd.append('bannerInfo', JSON.stringify(_tmpBannerInfo));
        fd.append('configAlias', $scope.currentConfig.alias);
        fd.append('tabAlias', $scope.bannerInfo.bannerPosition);
        // bannerSourcePosition
        $scope.isAjaxing = true;
        this.apiHelper('setBanner', fd, {
            transformRequest: angular.identity,
            headers: {
                'Content-Type': undefined
            }
        }).then(function(resp) {
            console.log(resp);
            // to index
            $scope.mode = 'index';
            $scope.editMode = false;
            $scope.isAjaxing = false;
            $scope.currentConfig.banners = resp;
            // self.$.fetchBannerAll($scope.currentConfig.alias);
        });

        // Todo: watch type to toggle input

        // Todo: add preview
        function previewImg() {

        }
    },
    addBannerHandler: function() {
        // reset form state
        this.$scope.bannerInfo = {};
        this.$scope.bannerForm.$setPristine(true);
        this.$scope.mode = 'edit';
    },
    dragPosition: function(src, dest) {
        var $scope = this.$;
        src = src.replace('drag-banner-', '');
        dest = dest.replace('drag-banner-', '');
        $scope.bannerList.splice(dest, 0, $scope.bannerList.splice(src, 1)[0]);
    },
    updatePosition: function() {
        // position 是 name（不是 type, alias）
        var $scope = this.$;
        var self = this;
        var idList = _.map($scope.bannerList, function(item) {
            return item.id;
        }).join(',');
        this.apiHelper('adjustBanner', {
            data: {
                idList: idList,
                bannerPosition: $scope.findBeforeMapBanner($scope.currentBannerPosition),
                tabAlias: $scope.currentBannerPosition,
                configAlias: $scope.currentConfig.alias
            }
        }).then(function() {
            $scope.mode = 'index';
            // self.$.fetchBannerAll($scope.currentConfig.alias);
        });
    },
    watch: {
        'currentBannerPosition': function(val) {
            if (!val) return;
            var $scope = this.$scope;
            $scope.filterBannerPostion(val);
        },
        'mode': function(val) {
            if (!val) return;
            var $scope = this.$scope;
            if (!$scope.currentConfig) return;
            // 哭了应该用 resolve 作为声明数据依赖的手段
            if (val === 'index') {
                $scope.bannerList = $scope.currentConfig.banners;
            }
            if (val === 'position') {
                $scope.currentBannerPosition = $scope.authorizedBean.authorizedLevel2.banner[0].alias;
                $scope.filterBannerPostion($scope.currentBannerPosition);
            }
        },
        'currentConfig.alias': function(val) {
            if (!val) return;
            // this.$.fetchBannerAll(val);
            val = this.$scope.mode;
            var $scope = this.$scope;
            if (val === 'index') {
                $scope.bannerList = $scope.currentConfig.banners;
            }
            if (val === 'position') {
                $scope.currentBannerPosition = $scope.authorizedBean.authorizedLevel2.banner[0].alias;
                $scope.filterBannerPostion($scope.currentBannerPosition);
            }
        }
    },
    filterBannerPostion: function(val) {
        var $scope = this.$scope;

        // local filter
        var mapPosition = $scope.tabMapping[val];
        $scope.bannerList = _.filter($scope.currentConfig.banners, function(i) {
            return i.bannerPosition === mapPosition;
        });
    }
});