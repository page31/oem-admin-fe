(function() { angular.module('oemApp.templates', []).run(['$templateCache',function($templateCache) {  'use strict';

  $templateCache.put('templates/404.html',
    "<!DOCTYPE html>\n" +
    "<html>\n" +
    "    <head>\n" +
    "        <title>访问页面不存在 - 豌豆荚开发者中心</title>\n" +
    "        <meta charset=\"utf-8\">\n" +
    "        <link type=\"text/css\" rel=\"stylesheet\" href=\"http://s.wdjimg.com/style/css/base/reset.css\" />\n" +
    "    </head>\n" +
    "    <body>\n" +
    "        <style>\n" +
    "            .w{width:400px;margin:50px auto;font-size: 12px;color:#999;font-family: Arial,Microsoft Yahei;}\n" +
    "            .l{float: left;margin-right: 50px;}\n" +
    "            .t{line-height: 1.5;padding-top: 12px;overflow: hidden;}\n" +
    "            h3{font-size: 16px;}\n" +
    "            .f{border: 1px solid #ddd;background: #f7f7f7;width: 300px;margin:50px 0;text-align: center;\n" +
    "                padding: 20px;}\n" +
    "            .f a{\n" +
    "                color: inherit;\n" +
    "            }\n" +
    "        </style>\n" +
    "        <div class=\"w\">\n" +
    "            <a href=\"/\" class=\"l\"><img src=\"http://s.wdjimg.com/style/images/www/icons/logo.png\" width=\"100\" /></a>\n" +
    "            <div class=\"t\">\n" +
    "                <h3>404 Not Found</h3>\n" +
    "                <p>对不起，您访问的页面不存在</p>\n" +
    "            </div>\n" +
    "            <div class=\"f\">\n" +
    "                <p><a href=\"http://open.wandoujia.com\">回到开发者中心首页</a></p>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </body>\n" +
    "</html>"
  );


  $templateCache.put('templates/_base/modal.html',
    "<div class=\"modal-header\">\n" +
    "    <button type=\"button\" class=\"close\" ng-click=\"$close()\"\n" +
    "        data-dismiss=\"modal\" aria-hidden=\"true\">×</button>\n" +
    "    <h3 class=\"modal-title\">{{modalTitle}}</h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "    <formly-form fields=\"formFields\" key=\"{{formName}}\"></formly-form>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "    <button class=\"btn\" data-dismiss=\"modal\" ng-click=\"$close()\">\n" +
    "        取消\n" +
    "    </button>\n" +
    "    <button class=\"btn btn-primary\"\n" +
    "        formly-submit=\"{{formName}}\" ng-click=\"submit()\">\n" +
    "        提交\n" +
    "    </button>\n" +
    "</div>"
  );


  $templateCache.put('templates/_base/module_menu.html',
    "<div class=\"pmt-nav oem-top-nav\">\n" +
    "    <ul class=\"main-nav\">\n" +
    "        <!-- ui-sref-active=\"active\" -->\n" +
    "        <!-- ng-class=\"{ active: $state.includes('report.detail') }\" -->\n" +
    "        <!-- Todo: use repeat to abstract -->\n" +
    "        <li>\n" +
    "            <a class=\"nav-item\"\n" +
    "               ui-sref-active=\"active\" ui-sref=\"appVertical\" >管理应用</a>\n" +
    "        </li>\n" +
    "        <li>\n" +
    "            <a class=\"nav-item\" ng-class=\"{ active: $state.includes('data') }\" ui-sref=\"data.index\">查看数据</a>\n" +
    "        </li>\n" +
    "        <li>\n" +
    "            <a class=\"nav-item\" ui-sref-active=\"active\" ui-sref=\"system\">管理系统</a>\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "</div>"
  );


  $templateCache.put('templates/_base/topbar.html',
    "<div class=\"pmt-container\">\n" +
    "    <h1 class=\"logo\">\n" +
    "        <a class=\"logo-text\" href=\"/\">豌豆荚</a>\n" +
    "        <span>For Partners Only</span>\n" +
    "    </h1>\n" +
    "    <div account accountdata=\"$root.account\"></div>\n" +
    "    <div pmt-include=\"templates/_base/module_menu.html\"></div>\n" +
    "</div>"
  );


  $templateCache.put('templates/_tpls/data-table.html',
    "<table class=\"pmt-standard-table\">\n" +
    "    <tr>\n" +
    "        <td ng-repeat=\"i in headList\">{{i}}</td>\n" +
    "    </tr>\n" +
    "    <tr ng-repeat=\"row in dataList track by $index\">\n" +
    "        <td ng-repeat=\"i in row track by $index\">{{i}}</td>\n" +
    "        <td ng-if=\"dataList.editable || dataList.deletable\">\n" +
    "            <!-- Add if check -->\n" +
    "            <a ng-click=\"$root.onEdit(dataList.type, row)\">\n" +
    "                <i class=\"icon-edit\"></i>\n" +
    "            </a>\n" +
    "            <a ng-click=\"onDel(dataList.type, row)\">\n" +
    "                <i class=\"icon-trash\"></i>\n" +
    "            </a>\n" +
    "        </td>\n" +
    "    </tr>\n" +
    "</table>"
  );


  $templateCache.put('templates/_tpls/formly-field.html',
    "<div class=\"control-group pmt-form-row\">\n" +
    "    <label class=\"pmt-form-label\" for=\"{{options.key}}\">\n" +
    "        {{options.label|capitalize}} {{options.required ? '*' : ''}}\n" +
    "    </label>\n" +
    "    <div class=\"pmt-form-controls\" ng-switch on=\"options.type\">\n" +
    "        <input ng-switch-default class=\"pmt-form-width-large\"\n" +
    "            placeholder=\"{{options.placeholder||options.label}}\"\n" +
    "            id=\"{{options.key}}\" name=\"{{options.key}}\"\n" +
    "            type=\"{{options.type || 'text'}}\">\n" +
    "        <select ng-switch-when=\"select\" name=\"{{options.key}}\">\n" +
    "            <option value=\"\" ng-if=\"options.nullText\">-- {{options.nullText}} --</option>\n" +
    "        </select>\n" +
    "        <textarea ng-switch-when=\"textarea\" name=\"{{options.key}}\"\n" +
    "            placeholder=\"{{options.placeholder||options.label}}\"></textarea>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('templates/_tpls/formly-form.html',
    "<div-form class=\"formly pmt-form pmt-form-stacked\" novalidate name=\"<name>\">\n" +
    "    <formly-field\n" +
    "        ng-repeat=\"field in fields\"\n" +
    "        options=\"field\"\n" +
    "        class=\"formly-field\">\n" +
    "    </formly-field>\n" +
    "</div-form>"
  );


  $templateCache.put('templates/_tpls/router-item.html',
    "<li>\n" +
    "    <a class=\"nav-item\" ui-sref-active=\"active\">\n" +
    "        {{item.name}}\n" +
    "    </a>\n" +
    "</li>"
  );


  $templateCache.put('templates/app_vertical/config-app.html',
    "<div ng-controller=\"configAppCtrl\">\n" +
    "    <p>您可以用定制版的应用替换掉豌豆荚的默认安装包</p>\n" +
    "    <p><button pmt-upload-button pmt-file-upload-field open-package-upload\n" +
    "        endpoint=\"open.oemPkg\" class=\"w-btn pmt-upload-btn\"\n" +
    "        uploader=\"{success: oemPkgSuccessHandler, notify: oemPkgNotifyHandler, add: oemPkgAddHandler}\">上传应用</button>\n" +
    "        <span>{{channelPkgUploadStatus}}</span>\n" +
    "        <span class=\"w-text-warning\">{{$root.vm.oemPkgWarning}}</span>\n" +
    "        &nbsp;&nbsp;您上传过的应用：\n" +
    "        <!-- <button class=\"w-btn w-btn-primary pmt-helper-float-right\"\n" +
    "            ng-click=\"saveBdConfigHandler()\">保存配置</button> -->\n" +
    "    </p>\n" +
    "    <table class=\"pmt-standard-table\">\n" +
    "        <tr>\n" +
    "            <th>名称</th>\n" +
    "            <th>包名</th>\n" +
    "            <th>版本</th>\n" +
    "            <th>操作</th>\n" +
    "        </tr>\n" +
    "        <tr ng-repeat=\"apk in currentConfig.oemApks\">\n" +
    "            <td>{{apk.title}}</td>\n" +
    "            <td>{{apk.packageName}}</td>\n" +
    "            <td>{{apk.versionName}}</td>\n" +
    "            <td><a ng-href=\"{{apk.downloadUrl}}\" target=\"_blank\">下载</a>&nbsp;&nbsp;<a ng-click=\"deleteApk(apk)\">删除</a></td>\n" +
    "        </tr>\n" +
    "    </table>\n" +
    "</div>"
  );


  $templateCache.put('templates/app_vertical/config-banner.html',
    "<div ng-controller=\"configBannerCtrl\" ng-init=\"mode='index'\">\n" +
    "    <div ng-show=\"mode=='index'\" class=\"config-page\">\n" +
    "        <header>\n" +
    "            <p class=\"header-title\">您已经上传的 Banner 和位置信息如下</p>\n" +
    "            <div class=\"header-actions\">\n" +
    "                <!-- banner adder, reorder btn -->\n" +
    "                <a class=\"w-btn\" ng-click=\"addBannerHandler()\">添加新 banner</a>&nbsp;&nbsp;\n" +
    "                <a class=\"w-btn\" ng-click=\"mode = 'position'\">调整 banner 顺序</a>\n" +
    "            </div>\n" +
    "        </header>\n" +
    "        <div pmt-include=\"templates/app_vertical/partials/banner-table.html\"></div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div ng-show=\"mode=='position'\" class=\"config-page\">\n" +
    "        <header>\n" +
    "            <div class=\"header-title pmt-form pmt-form-controls\">\n" +
    "                选择您要调整的 Banner 区域\n" +
    "                <select ng-model=\"currentBannerPosition\"\n" +
    "                    ng-options=\"val.name as val.alias for val in positionChoices\"></select>\n" +
    "            </div>\n" +
    "            <div class=\"header-actions\">\n" +
    "                <a class=\"w-btn w-btn-primary\" ng-click=\"updatePosition()\">更新</a>&nbsp;&nbsp;\n" +
    "                <a class=\"w-btn\" ng-click=\"mode = 'index'\">取消</a>\n" +
    "            </div>\n" +
    "        </header>\n" +
    "        <div pmt-include=\"templates/app_vertical/partials/banner-table.html\"></div>\n" +
    "    </div>\n" +
    "\n" +
    "    <!-- adder form or adder mode page -->\n" +
    "    <div ng-show=\"mode=='edit'\">\n" +
    "        <div pmt-include=\"templates/app_vertical/partials/banner-form.html\"></div>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('templates/app_vertical/config-general.html',
    "<div ng-controller=\"configGeneralCtrl\">\n" +
    "    <div style=\"margin-bottom: 10px;\">\n" +
    "        <p ng-bind-html=\"currentConfigType.description\" style=\"margin: 0;display:inline-block;\"></p> &nbsp;&nbsp;\n" +
    "        <span class=\"pmt-btn-dropdown\" dropdown ng-if=\"currentConfigType.key == 'recommends'\">\n" +
    "            <button class=\"btn-dropdown w-btn\">\n" +
    "                {{currentRecommend.name}}\n" +
    "                <span class=\"caret\"></span>\n" +
    "                <ul class=\"dropdown-menu\">\n" +
    "                    <li ng-repeat=\"i in recommendsCandidates\" ng-click=\"switchRecommendHandler(i)\">\n" +
    "                        <a>{{i.name}}</a>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "            </button>\n" +
    "        </span>\n" +
    "    </div>\n" +
    "    <button class=\"w-btn w-btn-primary pmt-helper-float-right\"\n" +
    "        ng-click=\"saveBdConfigHandler()\">保存配置</button>\n" +
    "    <form class=\"pmt-form\">\n" +
    "        <div class=\"pmt-form-row big-textarea-row\">\n" +
    "            <div class=\"pmt-form-controls\">\n" +
    "                <textarea  text-area-elastic ng-model=\"currentConfigTextarea\" required>\n" +
    "                </textarea>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </form>\n" +
    "</div>"
  );


  $templateCache.put('templates/app_vertical/config-index.html',
    "<div  ng-controller=\"configIndexCtrl\">\n" +
    "    <p>目前已经配置的渠道如下所示：</p>\n" +
    "    <table class=\"pmt-standard-table\">\n" +
    "        <tr>\n" +
    "            <th>渠道名称</th>\n" +
    "        </tr>\n" +
    "        <tr ng-repeat=\"item in currentConfig.sources track by $index\">\n" +
    "            <td>{{item}}</td>\n" +
    "        </tr>\n" +
    "    </table>\n" +
    "\n" +
    "    <button class=\"w-btn\" ng-click=\"isShowNewForm=true\">新增渠道</button>\n" +
    "\n" +
    "    <form class=\"pmt-form pmt-form-horizontal\" action=\"\" ng-show=\"isShowNewForm\">\n" +
    "        <hr><p>备注：请填写渠道名称及 ID（其中渠道名称应可读性良好，方便查询；渠道 ID 为豌豆荚的分包 Source 信息）</p>\n" +
    "        <label for=\"\">渠道名称：&nbsp;&nbsp;<input type=\"text\" ng-model=\"configChannel.name\"></label>&nbsp;&nbsp;\n" +
    "        <label for=\"\">渠道ID：&nbsp;&nbsp;<input type=\"text\" ng-model=\"configChannel.id\"></label>\n" +
    "        &nbsp;&nbsp;<button class=\"w-btn w-btn-primary\" ng-click=\"addConfigHandler()\">保存</button>\n" +
    "        &nbsp;&nbsp;<button class=\"w-btn\" ng-click=\"isShowNewForm=false\">取消</button>\n" +
    "    </form>\n" +
    "</div>"
  );


  $templateCache.put('templates/app_vertical/index.html',
    "<!-- Todo: move configCtrl link to route -->\n" +
    "<!-- Remove: extra wrapper div -->\n" +
    "<div ng-controller=\"configCtrl\">\n" +
    "    <ul class=\"pmt-sidebar-nav\">\n" +
    "\n" +
    "        <!-- Todo: refact to directive globally used -->\n" +
    "        <li class=\"pmt-sidebar-nav-header\">\n" +
    "            <span class=\"pmt-btn-dropdown\" dropdown ng-if=\"configData.length > 1\">\n" +
    "                <button class=\"btn-dropdown w-btn\">\n" +
    "                    {{currentConfig.alias}}\n" +
    "                    <span class=\"caret\"></span>\n" +
    "                    <ul class=\"dropdown-menu\">\n" +
    "                        <li ng-repeat=\"i in configData\" ng-click=\"switchCurrentConfig(i)\">\n" +
    "                            <a>{{i.alias}}</a>\n" +
    "                        </li>\n" +
    "                    </ul>\n" +
    "                </button>\n" +
    "            </span>\n" +
    "            <span class=\"sidebar-nav-header-style\" ng-if=\"configData.length == 1\">\n" +
    "                {{currentConfig.alias}}\n" +
    "            </span>\n" +
    "        </li>\n" +
    "        <li ng-repeat=\"item in subNavList\">\n" +
    "            <a class=\"nav-item\" ui-sref=\"appVertical({alias: currentConfig.alias,type: item.key})\"\n" +
    "            ui-sref-active=\"active\">{{item.name}}</a>\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "    <div style=\"width: 640px;float: right;\"\n" +
    "        ng-switch on=\"currentConfigType.key\">\n" +
    "        <div ng-switch-when=\"channel\">\n" +
    "            <div ng-include=\"'templates/app_vertical/config-index.html'\"></div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div ng-switch-when=\"banner\">\n" +
    "            <div ng-include=\"'templates/app_vertical/config-banner.html'\"></div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div ng-switch-when=\"app\">\n" +
    "            <div ng-include=\"'templates/app_vertical/config-app.html'\"></div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div ng-switch-default>\n" +
    "            <div ng-include=\"'templates/app_vertical/config-general.html'\"></div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('templates/app_vertical/partials/banner-form.html',
    "<div class=\"popup-container popup-container-medium\">\n" +
    "    <p class=\"popup-title\">添加新 Banner</p>\n" +
    "    <div class=\"popup-content\">\n" +
    "        <form class=\"pmt-form pmt-form-stacked\" name=\"bannerForm\" id=\"bannerForm\"\n" +
    "            novalidate validate-submit=\"addBanner()\" ng-init=\"bannerInfo={}\">\n" +
    "\n" +
    "            <div inputfield labeltext=\"所在区域：\" labelfor=\"position\">\n" +
    "                <select name=\"position\" ng-model=\"bannerInfo.position\" id=\"position\"\n" +
    "                    required ng-options=\"i.type as i.alias for i in positionChoices\">\n" +
    "                    <option value=\"\">请选择</option>\n" +
    "                </select>\n" +
    "                <!-- <input class=\"pmt-form-width-large\" type=\"position\"\n" +
    "                    name=\"position\" ng-model=\"bannerInfo.position\" id=\"position\"\n" +
    "                    required ng-minlength=\"2\"> -->\n" +
    "                <div message for=\"position\"></div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div inputfield labeltext=\"对应类型：\" labelfor=\"type\">\n" +
    "                <select name=\"type\" ng-model=\"bannerInfo.type\" id=\"type\"\n" +
    "                    required ng-options=\"i.type as i.alias for i in typeChoices\">\n" +
    "                    <option value=\"\">请选择</option>\n" +
    "                </select>\n" +
    "\n" +
    "                <!-- <input class=\"pmt-form-width-large\" type=\"type\"\n" +
    "                    name=\"type\" ng-model=\"bannerInfo.type\" id=\"type\"\n" +
    "                    required ng-minlength=\"2\"> -->\n" +
    "                <div message for=\"type\"></div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div inputfield labeltext=\"对应链接：\" labelfor=\"url\">\n" +
    "                <input class=\"pmt-form-width-large\" type=\"url\" http-prefix\n" +
    "                    name=\"url\" ng-model=\"bannerInfo.url\" id=\"url\"\n" +
    "                    required ng-minlength=\"2\">\n" +
    "                <div message for=\"url\"></div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div inputfield labeltext=\"专题 Alias：\" labelfor=\"alias\">\n" +
    "                <input class=\"pmt-form-width-large\" type=\"text\"\n" +
    "                    name=\"alias\" ng-model=\"bannerInfo.alias\" id=\"alias\" ng-minlength=\"2\">\n" +
    "                <div message for=\"alias\"></div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div inputfield labeltext=\"应用 Banner 包名：\" labelfor=\"packageName\">\n" +
    "                <input class=\"pmt-form-width-large\" type=\"text\"\n" +
    "                    name=\"packageName\" ng-model=\"bannerInfo.packageName\" id=\"packageName\"\n" +
    "                    required ng-minlength=\"2\">\n" +
    "                <div message for=\"packageName\"></div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div inputfield labeltext=\"是否为当前活动页：\" labelfor=\"itemStatus\">\n" +
    "                <select name=\"itemStatus\" id=\"itemStatus\"\n" +
    "                    ng-model=\"bannerInfo.itemStatus\" required>\n" +
    "                    <option value=\"\">请选择</option>\n" +
    "                    <option value=\"1\">是</option>\n" +
    "                    <option value=\"0\">否</option>\n" +
    "                </select>\n" +
    "                <div message for=\"itemStatus\"></div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div inputfield labeltext=\"对应标题：\" labelfor=\"title\">\n" +
    "                <input class=\"pmt-form-width-large\" type=\"text\"\n" +
    "                    name=\"title\" ng-model=\"bannerInfo.title\" id=\"title\"\n" +
    "                    required ng-minlength=\"2\">\n" +
    "                <div message for=\"title\"></div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div inputfield labeltext=\"上传 banner\" labelfor=\"banner\">\n" +
    "                <img ng-src=\"{{bannerInfo.banner}}\" ng-if=\"editMode\"\n" +
    "                    style=\"max-height: 100px;margin-bottom: 20px;\"><br>\n" +
    "                <input class=\"pmt-form-width-large\" type=\"file\" required\n" +
    "                    file-model=\"bannerInfo.banner\" name=\"banner\" id=\"banner\">\n" +
    "                <div message for=\"banner\"></div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"pmt-form-row\">\n" +
    "                <button class=\"w-btn w-btn-grand w-btn-primary\" type=\"submit\">保存配置</button>\n" +
    "                <a class=\"w-btn w-btn-grand\" ng-click=\"mode = 'index'\">取消</a>\n" +
    "            </div>\n" +
    "        </form>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('templates/app_vertical/partials/banner-table.html',
    "<table class=\"pmt-standard-table\">\n" +
    "    <tr>\n" +
    "        <th>ID</th>\n" +
    "        <th>所在区域</th>\n" +
    "        <th>标题</th>\n" +
    "        <th>目标链接</th>\n" +
    "        <th>当前是否活动</th>\n" +
    "        <th>banner</th>\n" +
    "        <th>操作</th>\n" +
    "    </tr>\n" +
    "    <tr ng-repeat=\"banner in bannerList track by $index\"\n" +
    "        id=\"drag-banner-{{$index}}\" draggable droppable drop=\"dragPosition\">\n" +
    "        <td>{{banner.id}}</td>\n" +
    "        <td>{{positionAliasDict[banner.position]}}</td>\n" +
    "        <td>{{banner.title}}</td>\n" +
    "        <td><a ng-href=\"{{banner.url}}\">{{banner.url}}</a></td>\n" +
    "        <td>{{banner.itemStatus?'是':'否'}}</td>\n" +
    "        <td><img ng-src=\"{{banner.banner}}\"></td>\n" +
    "        <td ng-show=\"mode=='index'\">\n" +
    "            <a ng-click=\"editBannerHandler(banner)\"><i class=\"icon-edit\"></i></a>\n" +
    "            &nbsp;&nbsp;<a ng-click=\"delBanner(banner)\"><i class=\"icon-trash\"></i></a>\n" +
    "        </td>\n" +
    "        <td ng-show=\"mode=='position'\">\n" +
    "            <a><i class=\"icon-move\"></i></a>\n" +
    "        </td>\n" +
    "    </tr>\n" +
    "</table>\n"
  );


  $templateCache.put('templates/data/index.html',
    "<!-- Todo: use layout master for app_vertical and data module -->\n" +
    "<!-- Todo: move configCtrl link to route -->\n" +
    "<!-- Remove: extra wrapper div -->\n" +
    "<div ng-controller=\"configCtrl\">\n" +
    "    <ul class=\"pmt-sidebar-nav\">\n" +
    "\n" +
    "        <!-- Todo: refact to directive globally used -->\n" +
    "        <li class=\"pmt-sidebar-nav-header\">\n" +
    "            <span class=\"pmt-btn-dropdown\" dropdown ng-if=\"configData.length > 1\">\n" +
    "                <button class=\"btn-dropdown w-btn\">\n" +
    "                    {{currentConfig.alias}}\n" +
    "                    <span class=\"caret\"></span>\n" +
    "                    <ul class=\"dropdown-menu\">\n" +
    "                        <li ng-repeat=\"i in configData\" ng-click=\"switchCurrentConfig(i)\">\n" +
    "                            <a>{{i.alias}}</a>\n" +
    "                        </li>\n" +
    "                    </ul>\n" +
    "                </button>\n" +
    "            </span>\n" +
    "            <span class=\"sidebar-nav-header-style\" ng-if=\"configData.length == 1\">\n" +
    "                {{currentConfig.alias}}\n" +
    "            </span>\n" +
    "        </li>\n" +
    "        <li>\n" +
    "            <a ui-sref=\"data.index\" class=\"item\" ui-sref-active=\"active\">\n" +
    "                查看数据\n" +
    "            </a>\n" +
    "        </li>\n" +
    "        <li>\n" +
    "            <a ui-sref=\"data.appDownload\" class=\"item\" ui-sref-active=\"active\">\n" +
    "                应用下载数据\n" +
    "            </a>\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "    <div style=\"width: 640px;float: right;\">\n" +
    "        <div ui-view></div>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('templates/data/report.html',
    "<div>查看配置&nbsp;&nbsp;\n" +
    "    <span class=\"pmt-btn-dropdown\" dropdown>\n" +
    "        <button class=\"btn-dropdown w-btn\">\n" +
    "            {{currentReport.tokenId}}\n" +
    "            <span class=\"caret\"></span>\n" +
    "            <ul class=\"dropdown-menu\">\n" +
    "                <li ng-repeat=\"i in reportData track by $index\">\n" +
    "                    <a ng-href=\"/open-api/report/{{i.tokenId}}\">{{i.tokenId}}</a>\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "        </button>\n" +
    "    </span>\n" +
    "    <!-- <button class=\"w-btn w-btn-primary pmt-helper-float-right\" ng-click=\"isShowExportData = true\">导出数据</button> -->\n" +
    "    <form class=\"pmt-form\" name=\"dateRangeForm\" style=\"display: inline-block;margin-left: 15px;\">\n" +
    "        <span>统计日期：</span>\n" +
    "        <input type=\"text\" pmt-date-picker ng-model=\"startDate\" id=\"startDate\" name=\"startDate\" picker=\"{format: 'Y-m-d', onShow: $root.dateRangeStart}\">\n" +
    "        <span>&nbsp;至&nbsp;</span>\n" +
    "        <input type=\"text\" pmt-date-picker ng-model=\"endDate\" id=\"endDate\" name=\"endDate\" picker=\"{format: 'Y-m-d', maxDate: 0}\">\n" +
    "        <button class=\"w-btn\" ng-click=\"dataQueryHandler()\">查询</button>\n" +
    "    </form>\n" +
    "    <button class=\"w-btn\" ng-click=\"exportCSV()\"> 导出 CSV </button>\n" +
    "</div>\n" +
    "<table class=\"pmt-standard-table\">\n" +
    "    <tr>\n" +
    "        <th>日期</th>\n" +
    "        <th>请求量</th>\n" +
    "        <th>下载量</th>\n" +
    "        <th>收入</th>\n" +
    "        <th>分成</th>\n" +
    "        <th>DAU</th>\n" +
    "        <th>DLU</th>\n" +
    "        <th>MAU</th>\n" +
    "        <th>启动次数</th>\n" +
    "    </tr>\n" +
    "    <tr ng-repeat=\"i in currentReport.data\">\n" +
    "        <td>{{i.date}}</td>\n" +
    "        <td>{{i.requestsCount}}</td>\n" +
    "        <td>{{i.downloadCount}}</td>\n" +
    "        <td>{{i.profit}}</td>\n" +
    "        <td>{{i.share}}</td>\n" +
    "        <td>{{i.dayActiveUsers}}</td>\n" +
    "        <td>{{i.dayLaunchUsers}}</td>\n" +
    "        <td>{{i.monthActiveUsers}}</td>\n" +
    "        <td>{{i.launchCount}}</td>\n" +
    "    </tr>\n" +
    "</table>\n" +
    "<hr>\n" +
    "<!-- Todo: add appDonwload Report P title -->\n" +
    "<table class=\"pmt-standard-table\">\n" +
    "    <tr>\n" +
    "        <th>日期</th>\n" +
    "        <th>包名</th>\n" +
    "        <th>下载量</th>\n" +
    "    </tr>\n" +
    "    <tr ng-repeat=\"i in currentAppDownloadReport.data\">\n" +
    "        <td>{{i.date}}</td>\n" +
    "        <td>{{i.packageName}}</td>\n" +
    "        <td>{{i.downloadCount}}</td>\n" +
    "    </tr>\n" +
    "</table>"
  );


  $templateCache.put('templates/data/usage.html',
    "<div ng-repeat=\"quota in quotas\">\n" +
    "    <h3>ID: {{quota.tokenId}} 使用统计</h3>\n" +
    "    <table class=\"pmt-standard-table\">\n" +
    "        <tr>\n" +
    "            <th>资源</th><th>总量</th><th>目前使用</th><th>距离下次重置</th>\n" +
    "            <!-- <th>分布</th> -->\n" +
    "        </tr>\n" +
    "        <tr ng-repeat=\"i in quota.resources\">\n" +
    "            <td>{{i.name}}</td>\n" +
    "            <td>{{i.totalCount}}</td>\n" +
    "            <td>{{i.usedCount}}</td>\n" +
    "            <td>{{i.nextReset}}</td>\n" +
    "            <!-- <td>{{i.apiStatus}}</td> -->\n" +
    "        </tr>\n" +
    "    </table>\n" +
    "</div>"
  );


  $templateCache.put('templates/gateway.html',
    ""
  );


  $templateCache.put('templates/system/account.html',
    "<div>\n" +
    "    <h2>管理账户权限</h2>\n" +
    "    <p class=\"text-mute\">管理运营账户的权限</p>\n" +
    "    <div>\n" +
    "        <h3>已有账户列表</h3>\n" +
    "        <button class=\"w-btn\" ng-click=\"$root.onSet('auth', null, this)\">添加新账户</button>\n" +
    "\n" +
    "        <table class=\"pmt-standard-table\">\n" +
    "            <tr>\n" +
    "                <td ng-repeat=\"i in ['账户', '账户角色', '所属 OEM/API', '操作']\">{{i}}</td>\n" +
    "            </tr>\n" +
    "            <tr ng-repeat=\"item in authList\">\n" +
    "                <td>{{item.email}}</td>\n" +
    "                <td>{{item.group.name}}</td>\n" +
    "                <td>\n" +
    "                    {{item.authorizedOem|joinArr:'configName:,'}}\n" +
    "                </td>\n" +
    "                <td>\n" +
    "                    <a ng-click=\"$root.onSet('auth', item)\">\n" +
    "                        <i class=\"icon-edit\"></i>\n" +
    "                    </a>\n" +
    "                    <a ng-click=\"$root.onDel('auth', item, this)\">\n" +
    "                        <i class=\"icon-trash\"></i>\n" +
    "                    </a>\n" +
    "                </td>\n" +
    "            </tr>\n" +
    "        </table>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('templates/system/column.html',
    "<div>\n" +
    "    <h2>管理 OEM 栏目</h2>\n" +
    "    <p class=\"text-mute\">特定 OEM 想要单独开设新的栏目，在这里管理这些新增栏目</p>\n" +
    "\n" +
    "    <div>\n" +
    "        <h3>已有 OEM 栏目列表</h3>\n" +
    "        <button class=\"w-btn\"\n" +
    "            ng-click=\"$root.onSet('column', null, this)\">\n" +
    "            添加新栏目\n" +
    "        </button>\n" +
    "    </div>\n" +
    "\n" +
    "    <table class=\"pmt-standard-table\">\n" +
    "        <tr>\n" +
    "            <td ng-repeat=\"i in ['OEM', ' 栏目名称', '操作']\">{{i}}</td>\n" +
    "        </tr>\n" +
    "        <tr ng-repeat=\"item in columnList\">\n" +
    "            <td>{{item.configAlias}}</td>\n" +
    "            <td>{{item.columnsName}}</td>\n" +
    "            <td>\n" +
    "                <a ng-click=\"$root.onSet('column', item)\">\n" +
    "                    <i class=\"icon-edit\"></i>\n" +
    "                </a>\n" +
    "                <a ng-click=\"$root.onDel('column', item, this)\">\n" +
    "                    <i class=\"icon-trash\"></i>\n" +
    "                </a>\n" +
    "            </td>\n" +
    "        </tr>\n" +
    "    </table>\n" +
    "</div>"
  );


  $templateCache.put('templates/system/index.html',
    "<ul class=\"pmt-sidebar-nav\">\n" +
    "    <li s data=\"item\" ng-repeat=\"item in menuList\"></li>\n" +
    "</ul>\n" +
    "<div class=\"pmt-content-wrapper\">\n" +
    "    <div ui-view></div>\n" +
    "</div>\n" +
    "<div ng-include=\"'templates/system/partials.html'\"></div>"
  );


  $templateCache.put('templates/system/log.html',
    "<div>\n" +
    "    <h2>查看日志</h2>\n" +
    "    <p class=\"text-mute\">查看各账户的写操作日志</p>\n" +
    "\n" +
    "    <!-- daterange with trigger btn -->\n" +
    "    <p>\n" +
    "        <span id=\"reportrange\">\n" +
    "            <i class=\"fa fa-calendar fa-lg\"></i>\n" +
    "            <span></span>\n" +
    "            <b class=\"caret\"></b>\n" +
    "        </span>\n" +
    "\n" +
    "        <button class=\"w-btn\" ng-click=\"fetchLog()\">查询</button>\n" +
    "    </p>\n" +
    "    <div s-table row-list=\"tableData\"\n" +
    "        head-list=\"['时间', '账户', '日志内容']\">\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('templates/system/partials.html',
    "<script type=\"text/ng-template\" id=\"system/channel-list-snippet.html\">\n" +
    "<div class=\"pmt-form-controls\">\n" +
    "    <button class=\"w-btn\" ng-click=\"$root.onAdd('channel', null, this)\"> 添加 OEM 渠道</button>\n" +
    "    <table class=\"pmt-standard-table\">\n" +
    "        <tr>\n" +
    "            <td ng-repeat=\"i in ['渠道名称', '渠道 User Source', '操作']\">{{i}}</td>\n" +
    "        </tr>\n" +
    "        <tr ng-repeat=\"item in formlyData.bdSourceDetails\">\n" +
    "            <td>{{item.sourceName}}</td>\n" +
    "            <td>{{item.sourceAlias}}</td>\n" +
    "            <td>\n" +
    "                <a ng-click=\"$root.onEdit('channel', item, this)\">\n" +
    "                    <i class=\"icon-edit\"></i>\n" +
    "                </a>\n" +
    "                <a ng-click=\"$root.onDel('channel', item, this)\">\n" +
    "                    <i class=\"icon-trash\"></i>\n" +
    "                </a>\n" +
    "            </td>\n" +
    "        </tr>\n" +
    "    </table>\n" +
    "</div>\n" +
    "</script>\n" +
    "\n" +
    "<script type=\"text/ng-template\" id=\"system/api-partner-interfaces-snippet.html\">\n" +
    "<div class=\"pmt-form-controls\">\n" +
    "    <div class=\"pmt-form-checkbox\" ng-repeat=\"(pKey, pVal) in $root.tokenMeta.candidatePrivileges\">\n" +
    "        <label>\n" +
    "            <input type=\"checkbox\" ng-model=\"formlyData.privileges[pKey]\">\n" +
    "            {{pVal}}\n" +
    "        </label>\n" +
    "    </div>\n" +
    "</div>\n" +
    "</script>\n" +
    "\n" +
    "<script type=\"text/ng-template\" id=\"auth/available-partner-list-snippet.html\">\n" +
    "<div class=\"pmt-form-controls\">\n" +
    "    <label><input type=\"checkbox\" ng-model=\"formlyData.isSelectAllOems\">全选</label>\n" +
    "    <div class=\"pmt-checkbox-options\">\n" +
    "        <label ng-repeat=\"oem in formlyData.authorizedOem\">\n" +
    "            <input type=\"checkbox\" ng-model=\"oem.selected\">\n" +
    "            {{oem.configName}}\n" +
    "        </label>\n" +
    "    </div>\n" +
    "</div>\n" +
    "</script>\n" +
    "\n" +
    "<script type=\"text/ng-template\" id=\"auth/available-authorizeditem-list-snippet.html\">\n" +
    "<div class=\"pmt-form-controls\">\n" +
    "    <div class=\"pmt-checkbox-options\">\n" +
    "        <label ng-repeat=\"(pKey, pVal) in formlyData.authorizedItems.authorizedLevel1\"\n" +
    "            style=\"display: block\">\n" +
    "            <input type=\"checkbox\" ng-click=\"selectAuthorizedLevel1(pKey, pVal)\"\n" +
    "                ng-checked=\"pVal.selected\">\n" +
    "            {{pVal.name}}\n" +
    "            <div ng-if=\"formlyData.authorizedItems.authorizedLevel2[pKey]\"\n" +
    "                style=\"margin-left: 30px;\">\n" +
    "                <label ng-repeat=\"_pVal in formlyData.authorizedItems.authorizedLevel2[pKey]\">\n" +
    "                    <input type=\"checkbox\" ng-checked=\"_pVal.selected\"\n" +
    "                        ng-click=\"selectAuthorizedLevel2(_pVal, pVal, formlyData.authorizedItems.authorizedLevel2[pKey])\">\n" +
    "                    {{_pVal.name}}\n" +
    "                </label>\n" +
    "            </div>\n" +
    "        </label>\n" +
    "    </div>\n" +
    "</div>\n" +
    "</script>\n"
  );


  $templateCache.put('templates/system/partner.html',
    "<div>\n" +
    "    <h2>管理 OEM / API</h2>\n" +
    "    <tabset>\n" +
    "        <tab heading=\"OEM 合作方\">\n" +
    "            <button class=\"w-btn\" ng-click=\"$root.onAdd('oemPartner')\"> 添加 OEM 合作方</button>\n" +
    "            <table class=\"pmt-standard-table\">\n" +
    "                <tr>\n" +
    "                    <td ng-repeat=\"i in ['合作方名称', '合作方 ID', '渠道数量', '操作']\">{{i}}</td>\n" +
    "                </tr>\n" +
    "                <tr ng-repeat=\"item in oemPartnerList\">\n" +
    "                    <td>{{item.bdConfigDetail.configName}}</td>\n" +
    "                    <td>{{item.bdConfigDetail.configAlias}}</td>\n" +
    "                    <td>{{item.bdSourceDetails.length}}</td>\n" +
    "                    <td>\n" +
    "                        <a ng-click=\"$root.onEdit('oemPartner', item)\">\n" +
    "                            <i class=\"icon-edit\"></i>\n" +
    "                        </a>\n" +
    "                        <a ng-click=\"$root.onDel('oemPartner', item, this)\">\n" +
    "                            <i class=\"icon-trash\"></i>\n" +
    "                        </a>\n" +
    "                    </td>\n" +
    "                </tr>\n" +
    "            </table>\n" +
    "        </tab>\n" +
    "        <tab heading=\"API 合作方\">\n" +
    "            <button class=\"w-btn\" ng-click=\"$root.onAdd('apiPartner')\"> 添加 API 合作方</button>\n" +
    "            <table class=\"pmt-standard-table\">\n" +
    "                <tr>\n" +
    "                    <td ng-repeat=\"i in ['合作方名称', '合作方 ID', '接口访问次数限制', '操作']\">{{i}}</td>\n" +
    "                </tr>\n" +
    "                <tr ng-repeat=\"item in apiPartnerList\">\n" +
    "                    <td>{{item.alias}}</td>\n" +
    "                    <td>{{item.id}}</td>\n" +
    "                    <td>{{$root.tokenMeta.candidateTokenType[item.type]}}</td>\n" +
    "                    <td>\n" +
    "                        <a ng-click=\"$root.onEdit('apiPartner', item)\">\n" +
    "                            <i class=\"icon-edit\"></i>\n" +
    "                        </a>\n" +
    "                        <a ng-click=\"$root.onDel('apiPartner', item, this)\">\n" +
    "                            <i class=\"icon-trash\"></i>\n" +
    "                        </a>\n" +
    "                    </td>\n" +
    "                </tr>\n" +
    "            </table>\n" +
    "        </tab>\n" +
    "    </tabset>\n" +
    "</div>"
  );


  $templateCache.put('templates/system/status.html',
    "<div>\n" +
    "    <h2>监控 API 状态</h2>\n" +
    "    <p class=\"text-mute\">监控 API 合作方使用的 API 状态</p>\n" +
    "\n" +
    "    <div>\n" +
    "        <h3>设置提醒发送邮箱</h3>\n" +
    "        <p class=\"text-mute\">当 API 请求超出授权权限标准时间向该邮箱发送邮件</p>\n" +
    "        <div class=\"input-row\">\n" +
    "            <input type=\"text\" placeholder=\"请输入邮箱\">\n" +
    "            <button>保存</button>\n" +
    "        </div>\n" +
    "\n" +
    "        <h3>设置合作方 API 运行状态</h3>\n" +
    "        <!--  dropdown menu for partner -->\n" +
    "        <select ng-model=\"currentConfigAlias\" ng-options=\"i.configAlias as i.configName for i in $root.authMeta.authorizedOem\"></select>\n" +
    "        <div s-table row-list=\"tableData\"\n" +
    "            head-list=\"['接口名称', '限额总量', '目前已使用', '距离下次重置']\">\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>"
  );
}]);})();