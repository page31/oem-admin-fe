define({
    name: 'configBannerCtrl',
    inject: ['$http', '$scope'],
    init: function() {
        var $http = this.$http,
            $scope = this.$;
        $scope.isAjaxing = false;

        $scope.isShowBannerForm = false;

        $http.get('/api/apps/v1/oem/config/banner/position').then(function(resp) {
            $scope.positionChoices = resp.data;
            $scope.positionAliasDict = _.object(_.zip(_.pluck(resp.data, 'name'), _.pluck(resp.data, 'alias')));
            $scope.positionTypeDict = _.object(_.zip(_.pluck(resp.data, 'name'), _.pluck(resp.data, 'type')));
        });

        $http.get('/api/apps/v1/oem/config/banner/type').then(function(resp) {
            $scope.typeChoices = resp.data;
        });
    },
    delBanner: function(i) {
        var $http = this.$http,
            $scope = this.$;
        if (window.confirm('您确定删除吗?')) {
            $http.delete('/api/apps/v1/oem/config/banner/delete', {
                params: {
                    bannerId: i.id,
                    configAlias: $scope.currentConfig.alias
                }
            }).then(function() {
                console.log('ok');
                // TODO: remove from list
                $scope.bannerList.splice($scope.bannerList.indexOf(i), 1);
                $scope.allBanners.splice($scope.allBanners.indexOf(i), 1);
            });
        }
    },
    editBannerHandler: function(i) {
        // prefill $scope.bannerInfo
        var $scope = this.$;
        _.clone(i);
        $scope.bannerInfo = i;
        $scope.bannerInfo.position = $scope.positionTypeDict[$scope.bannerInfo.position];
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
        }
        $('#bannerForm #banner').val('');
        delete $scope.bannerInfo.banner;
        fd.append('bannerInfo', JSON.stringify($scope.bannerInfo));
        fd.append('configAlias', $scope.currentConfig.alias);
        var apiUrl = '/api/apps/v1/oem/config/banner/add';
        if ($scope.editMode) {
            apiUrl = '/api/apps/v1/oem/config/banner/edit';
        }
        // bannerSourcePosition
        $scope.isAjaxing = true;
        this.$http.post(apiUrl, fd, {
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
            self.$.fetchBannerAll($scope.currentConfig.alias);
        });
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
        this.$http.post('/api/apps/v1/oem/config/banner/adjust', {
            idList: idList,
            position: $scope.currentBannerPosition,
            configAlias: $scope.currentConfig.alias
        }).then(function() {
            $scope.mode = 'index';
            self.$.fetchBannerAll($scope.currentConfig.alias);
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
            if (val === 'index') {
                $scope.bannerList = $scope.allBanners;
            }
            if (val === 'position') {
                $scope.currentBannerPosition = $scope.positionChoices[0].name;
                $scope.filterBannerPostion($scope.currentBannerPosition);
            }
        },
        'currentConfig.alias': function(val) {
            if (!val) return;
            this.$.fetchBannerAll(val);
        }
    },
    filterBannerPostion: function(val) {
        var $scope = this.$scope;

        $scope.bannerList = [];
        this.$http.get('/api/apps/v1/oem/config/banner/adjust', {
            params: {
                position: $scope.currentBannerPosition,
                configAlias: $scope.currentConfig.alias
            },
            busy: 'global'
        }).then(function(resp) {
            $scope.bannerList = resp.data;
        });
    },
    fetchBannerAll: function(val) {
        var $scope = this.$scope;
        $scope.bannerList = null;
        this.$http.get('/api/apps/v1/oem/config/banner/all', {
            busy: 'global',
            params: {
                configAlias: val
            }
        }).then(function(resp) {
            $scope.bannerList = resp.data;
            $scope.allBanners = resp.data;
        });
    }
});
