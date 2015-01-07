OEM-ADMIN-FE
======

Firstly, More Authentication and Permission Control for Admin.

### Todo

- 更新样式
- 引入 validator
- 加入buzy btn 为提交操作
- log json 格式化
- log 页面加分页
- 加上 global buzy loading
- data 中的 highcharts
- banner 的图片预览

### 重构 app-vertical 根据新的 BACKEND API Combination:

configData - 全部 OEM 的配置信息
currentConfig - 当前 OEM 的配置信息
currentConfigType - 如 channel, app, recommends, forbiddenApps
subNavList - 所有菜单项
recommendsCandidates - 推荐位信息

辅助函数： switchCurrentConfig

/api/apps/bdconfigs - 查看现有的

/api/apps
    authorizedItems
    authorizedLevel2
    authorizedOem



/api/apps/bdcolumns
/api/apps/banner/position
    positionBeanList - 应用首页，游戏首页
    typeBeanList - 应用，专区，设计奖，链接

