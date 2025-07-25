---
title: 发布npm包
slug: /web/package-manage/release-npm-package
sidebar_position: 1
---

npm是nodejs的包管理工具，可以用来管理nodejs的包。npm包的官方库是[npmjs.com](https://www.npmjs.com/)

自己实现的npm包，可以发布到npmjs.com官方库，也可以发布到私有库

## 发布npm包到官方库

### 注册npm账号

访问[npmjs.com](https://www.npmjs.com/)，点击右上角的`Sign up`，注册npm账号，注册后登录

### 创建npm包

本地开发创建一个npm包，例如`my-package`，流程如下

新建目录并初始化

```bash
~ mkdir my-package && cd my-package
~ npm init
```

按提示输入包名、版本、描述、入口文件、测试命令、git地址、关键词、作者、许可证等信息，会生成一个package.json文件

```json title="package.json"
{
  "name": "@ssgeek/a-table-query-header",
  "version": "0.0.1",
  "description": "@dangojs/a-query-header（支持本地化）版本",
  "main": "dist/index.cjs.js",
  "module": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": [
    "dist"
  ],
  "scripts": {
    "build": "vite build",
    "dev": "vite",
    "preview": "vite preview",
    "clean": "rm -rf dist"
  },
  "repository": {
    "type": "git",
    "url": "git+ssh://git@github.com/Hargeek/a-table-query-header.git"
  },
  "keywords": [
    "vue",
    "arco-design",
    "table",
    "query",
    "header"
  ],
  "author": "SSgeek",
  "license": "ISC",
  "bugs": {
    "url": "https://github.com/Hargeek/a-table-query-header/issues"
  },
  "homepage": "https://github.com/Hargeek/a-table-query-header#readme",
  "devDependencies": {
    "@arco-design/web-vue": "^2.57.0",
    "@vitejs/plugin-vue": "^6.0.0",
    "vite": "^7.0.6",
    "vite-plugin-dts": "^4.5.4",
    "vue": "^3.5.18"
  },
  "peerDependencies": {
    "@arco-design/web-vue": "^2.0.0",
    "vue": "^3.0.0"
  },
  "publishConfig": {
    "access": "public"
  }
}
```

注意几点：

- 上述过程中，你也可以不填写git地址也不将包的源码发布到仓库，那么最终发布到npmjs.com的包，将不会在npmjs.com上显示git地址，用户也就无法找到包的源码，很多包都是这样发布的（其实很坑，开源了包又不想让别人找到源码）
- 包名需要以`@`开头，这是为了限制包名不能与已有的包名冲突，例如`@vue/vue`、`@vue/vue-router`、`@vue/vuex`等，给包一个唯一的命名空间，一般是自己的用户名或组织名，例如`@ssgeek/my-package`，但是一旦设置了以`@`开头的包名，将会认为你这个包是私有包，需要增加`publishConfig`配置，将`access`设置为`public`，才能发布到npmjs.com

### 编写代码

编写包的代码，使用`vite`构建工具，使用`vue`框架，使用`arco-design`组件库, 使用`dts`生成类型文件(这里是用的vite-plugin-dts插件)

当然除了vite，也可以使用其他构建工具，例如webpack、rollup等

```bash
~ npm install @arco-design/web-vue @vitejs/plugin-vue vite vite-plugin-dts vue
```

包的代码结构一般如下

```bash
~ tree -L 1 . -a
.
├── .gitignore
├── node_modules
├── package-lock.json
├── package.json
├── README.md
├── src
│   ├── index.ts # 入口文件
│   └── xxx # 包的具体实现
└── vite.config.ts # 构建配置
```

入口文件是为了用户使用这个包的时候，通过`import`语句引入包的代码，例如

```ts
import { QueryHeader } from 'my-package'
```

文件内容

```ts
import QueryHeader from './QueryHeader.vue';
export default QueryHeader;
```

包的具体实现不在这里展开，这里只介绍如何发布npm包

### 发布npm包

```bash
~ npm config set registry https://registry.npmjs.org
~ npm login # 输入npm账号进行登录
~ npm run build # 构建包
~ npm publish # 发布包
```

发布成功后，可以登录[npmjs.com](https://www.npmjs.com/)，查看自己发布的包
