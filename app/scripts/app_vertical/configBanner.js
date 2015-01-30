define({
    name: 'configBannerCtrl',
    inject: ['apiHelper', '$scope'],
    init: function() {
        var apiHelper = this.apiHelper,
            $scope = this.$;
        $scope.isAjaxing = false;
        $scope.$parent.currentConfigType = 'banner';

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
        $scope.bannerPreviewUrl = '';
        $scope.bannerInfo.bannerPosition = $scope.findBeforeMapBanner($scope.bannerInfo.bannerPosition);
        if (!$scope.bannerInfo.startTime) {
            $scope.bannerInfo.startTime = null
        }
        if (!$scope.bannerInfo.endTime) {
            $scope.bannerInfo.endTime = null
        }
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
        var bannerInfo = $scope.bannerInfo;
        bannerInfo.itemStatus = 1; // always active status
        if ($scope.isAjaxing) return;
        if (!bannerInfo.banner) return;
        if ($scope.isBannerSizeError) return;
        if (bannerInfo.startTime && bannerInfo.endTime) {
            if (bannerInfo.startTime > bannerInfo.endTime) {
                window.alert('开始时间不能大于结束时间');
                return;
            }
        }
        if (!bannerInfo.startTime) {
            bannerInfo.startTime = 0;
        }
        if (!bannerInfo.endTime) {
            bannerInfo.endTime = 0;
        }
        var fd = new FormData();
        if (!_.isString(bannerInfo.banner)) {
            // quick fix banner file input
            fd.append('bannerFile', bannerInfo.banner);
        }
        $('#bannerForm #banner').val('');
        delete bannerInfo.banner;
        var _tmpBannerInfo = _.clone(bannerInfo);
        _tmpBannerInfo.bannerPosition = $scope.tabMapping[_tmpBannerInfo.bannerPosition];
        fd.append('bannerInfo', JSON.stringify(_tmpBannerInfo));
        fd.append('configAlias', $scope.currentConfig.alias);
        fd.append('tabAlias', bannerInfo.bannerPosition);
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
        }, function() {
            $scope.isAjaxing = false;
        });

        // Todo: watch type to toggle input
    },
    addBannerHandler: function() {
        // reset form state
        this.$scope.editMode = false;
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
                bannerPosition: $scope.tabMapping[$scope.currentBannerPosition],
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
        },
        'bannerInfo.banner': function(val) {
            if (!val) return;
            var $scope = this.$scope;
            $scope.bannerPreviewUrl = '';
            $scope.isBannerSizeError = false;
            if (!_.isString(val)) {
                previewImg(val, $scope);
            }

            function previewImg(file, $scope) {
                $scope.isBannerSizeError = false;
                var fileReader = new FileReader();

                fileReader.onloadend = function() {
                    var img = new Image();
                    img.onload = function() {
                        if (img.width === 740 && img.height === 200) return;
                        $scope.isBannerSizeError = true;
                        $scope.$apply();
                    };
                    img.src = fileReader.result;
                    $scope.bannerPreviewUrl = fileReader.result;
                    $scope.$apply();
                };

                fileReader.readAsDataURL(file);
            }
        }
    },
    filterBannerPostion: function(val) {
        if (!val) return;
        var $scope = this.$scope;

        this.apiHelper('fetchAdjustBanner', {
            params: {
                bannerPosition: $scope.tabMapping[val],
                tabAlias: val,
                configAlias: $scope.currentConfig.alias
            }
        }).then(function(data) {
            $scope.bannerList = data;
        });
    }
});