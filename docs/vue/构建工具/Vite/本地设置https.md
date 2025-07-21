---
title: 本地设置https
slug: /vue/build-tools/vite/local-https-setting
sidebar_position: 1
---

有时候需要本地开发时使用https，例如后端服务使用https，前端如果仅使用http，这时会因后端设置的跨域策略(CORS)而无法正常访问后端服务

## 自签名证书

参考[Vite官方文档](https://vite.dev/config/server-options#server-https), 使用[@vitejs/plugin-basic-ssl](https://github.com/vitejs/vite-plugin-basic-ssl)插件生成自签名证书

安装插件

```bash
npm install @vitejs/plugin-basic-ssl
```

配置

```ts title="vite.config.ts"
import basicSsl from '@vitejs/plugin-basic-ssl'

export default defineConfig({
  ...
  plugins: [
    mode: 'development',
    server: {
      port: 3000,
      host: 'web-local.example.com',
      open: true,
      fs: {
        strict: true,
      },
      https: true,
    },
    basicSsl({
        name: 'web-local',
        domains: ['web-local.example.com'],
        certDir: './.certs',
      }),
  ],
})
```

按照上述配置，项目启动后会自动生成自签名证书到`.certs`目录下，并使用`https`协议自动打开浏览器

## 配置证书受信

mac环境下执行

```bash
# 先转换证书格式
openssl x509 -in .certs/_cert.pem -outform PEM -out .certs/_pem.pem
# 导入到系统证书
sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain ./.certs/_pem.pem
```

## 其他方案

- [x] [vite-plugin-mkcert](https://www.npmjs.com/package/vite-plugin-mkcert)
- [x] [mkcert](https://github.com/FiloSottile/mkcert)
