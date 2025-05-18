---
sidebar_label: Go 安装指南
title: Go 安装指南
---

本文将指导您在不同操作系统上安装 Go。

## Windows 安装

1. 访问 [Go 官网](https://golang.org/dl/)
2. 下载最新版本的 Windows 安装包
3. 运行安装程序，按照提示完成安装
4. 安装程序会自动将 Go 添加到系统环境变量

## macOS 安装

### 使用 Homebrew 安装

```bash
brew install go
```

### 使用官方安装包

1. 访问 [Go 官网](https://golang.org/dl/)
2. 下载 macOS 安装包
3. 运行安装程序

## Linux 安装

### Ubuntu/Debian
```bash
sudo apt update
sudo apt install golang-go
```

### CentOS/RHEL
```bash
sudo yum install golang
```

## 验证安装

安装完成后，打开终端并输入：

```bash
go version
```

如果显示 Go 版本号，说明安装成功。

## 配置 GOPATH

Go 使用 GOPATH 环境变量来指定工作空间的位置。建议在用户主目录下创建 Go 工作空间：

```bash
mkdir -p ~/go/{bin,src,pkg}
```

然后设置 GOPATH 环境变量：

```bash
# 对于 bash
echo 'export GOPATH=$HOME/go' >> ~/.bashrc
echo 'export PATH=$PATH:$GOPATH/bin' >> ~/.bashrc

# 对于 zsh
echo 'export GOPATH=$HOME/go' >> ~/.zshrc
echo 'export PATH=$PATH:$GOPATH/bin' >> ~/.zshrc
``` 