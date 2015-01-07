OEM-ADMIN-FE
======

Firstly, More Authentication and Permission Control for Admin.

### Todo
- token list pagintion~(插入unshift)
- edit 修改 OEM edit 隐藏  渠道 User Source
- 报错的 z-index
- 「接口访问频率权限」下拉框不修改时，提交报错(, 初始值)
- 初始值 的oem
- banner 联动 with type
- banner 图片尺寸检测
- account 的下拉~ (和左 padding)
- data 中的 highcharts
- 页面加分页，看totalCount来确定

- 更新样式
- 引入 validator
- 加入buzy btn 为提交操作
- log json 格式化

- banner 的图片预览
- 加上账户登录(权限控制限制)

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

