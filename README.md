# 新闻管理系统

​										基于react,antd,echarts构建

## 使用

1.  安装 node.js
2.  打开终端，使用 npm i 导入依赖包
3.  使用json-server启动src/assets/db.json
4.  使用npm start启动程序

## 功能

#### 1.登录页面

-   用户需要输入正确的用户名和密码才能进入系统

#### 2.首页

-   首页中展示一些图表和用户信息

#### 3.用户管理

-   对用户状态和信息进行增删改查

-   不同的角色等级拥有不同的权限

#### 4.权限管理

-   对用户权限进行增删改查

#### 5.新闻管理

-   按步骤撰写新闻，选择存入草稿箱或提交审核

#### 6.审核管理

-   管理员可以审核当前地区的新闻，选择通过或驳回
-   可以查看自己新闻的审核状态

#### 7.发布管理

-   可以发布已通过审核的新闻
-   可以下线已发布的新闻
-   可以删除已下线的新闻
