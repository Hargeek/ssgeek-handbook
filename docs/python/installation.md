---
sidebar_position: 2
---

# Python 安装指南

本文将指导您在不同操作系统上安装 Python。

## Windows 安装

1. 访问 [Python 官网](https://www.python.org/downloads/)
2. 下载最新版本的 Python 安装包
3. 运行安装程序，确保勾选 "Add Python to PATH"
4. 完成安装

## macOS 安装

### 使用 Homebrew 安装

```bash
brew install python
```

### 使用官方安装包

1. 访问 [Python 官网](https://www.python.org/downloads/)
2. 下载 macOS 安装包
3. 运行安装程序

## Linux 安装

大多数 Linux 发行版已预装 Python。如果没有，可以使用包管理器安装：

### Ubuntu/Debian
```bash
sudo apt update
sudo apt install python3
```

### CentOS/RHEL
```bash
sudo yum install python3
```

## 验证安装

安装完成后，打开终端并输入：

```bash
python --version
# 或
python3 --version
```

如果显示 Python 版本号，说明安装成功。

## 下一步

现在您已经安装好了 Python，让我们开始学习 [Python 基础知识](basics) 吧！ 