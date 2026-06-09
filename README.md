# Crypto - 浏览器端 AES 加解密工具

纯前端 AES 加密/解密工具，支持文本和文件两种模式。所有加解密均在浏览器本地完成，密钥不会上传到服务器。

## 功能

### 文本加解密
- 输入明文自动加密，粘贴密文自动解密（通过密钥前缀智能识别）
- 一键复制加密结果（同时复制纯文本和 HTML 格式）
- 支持中文输入法（composition 事件处理）
- 可自定义密钥（同时作为加密密码和密文识别前缀）

### 文件加解密
- 拖拽或点击上传任意文件，自动加密为 `.encrypted` 文件
- 上传 `.encrypted` 文件自动解密还原原始文件
- 加密数据包含原始文件名和 MIME 类型，解密后完整恢复

## 使用方法

```bash
# 安装依赖（需要 Bun）
bun install

# 启动开发服务器
bun dev

# 构建生产版本（输出到 docs/ 目录）
bun run build
```

## 技术栈

- **React 18** + **TypeScript**
- **Vite** 构建工具
- **MUI v6** 组件库（Snackbar、Drawer、Alert 等）
- **crypto-js** AES 加解密
- **styled-components** + **Less** 样式方案
- **Orbitron** + **Exo 2** 字体

## 部署

本项目通过 GitHub Pages 部署，访问地址：`https://st2eam.github.io/crypto/`

推送代码到 `main` 分支后，GitHub Actions 会自动构建并部署。

## License

MIT
