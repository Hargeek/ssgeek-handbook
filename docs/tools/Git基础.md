---
title: Git 基础
slug: git-basic
---

Git 是一个分布式版本控制系统，用于跟踪文件的变化，协调多人协作开发。

## 安装 Git

### Windows
1. 访问 [Git 官网](https://git-scm.com/download/win)
2. 下载安装包并运行

### macOS
```bash
brew install git
```

### Linux
```bash
# Ubuntu/Debian
sudo apt-get install git

# CentOS/RHEL
sudo yum install git
```

## 基本配置

```bash
# 设置用户名和邮箱
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# 查看配置
git config --list
```

## 基本命令

### 创建仓库
```bash
# 初始化新仓库
git init

# 克隆远程仓库
git clone <repository-url>
```

### 基本操作
```bash
# 查看状态
git status

# 添加文件到暂存区
git add <file>
git add .  # 添加所有文件

# 提交更改
git commit -m "提交说明"

# 查看提交历史
git log
```

### 分支操作
```bash
# 创建分支
git branch <branch-name>

# 切换分支
git checkout <branch-name>

# 创建并切换分支
git checkout -b <branch-name>

# 合并分支
git merge <branch-name>
```

### 远程操作
```bash
# 添加远程仓库
git remote add origin <repository-url>

# 推送到远程
git push origin <branch-name>

# 拉取更新
git pull origin <branch-name>
```

## 常用工作流

### 功能开发
1. 创建功能分支
```bash
git checkout -b feature/new-feature
```

2. 开发并提交
```bash
git add .
git commit -m "添加新功能"
```

3. 合并到主分支
```bash
git checkout main
git merge feature/new-feature
```

### 修复 Bug
1. 创建修复分支
```bash
git checkout -b hotfix/bug-fix
```

2. 修复并提交
```bash
git add .
git commit -m "修复 bug"
```

3. 合并到主分支
```bash
git checkout main
git merge hotfix/bug-fix
```

## 最佳实践

1. 经常提交代码
2. 写清晰的提交信息
3. 使用分支进行开发
4. 定期同步远程仓库
5. 保持主分支稳定

## 下一步

让我们继续学习 [Docker 基础](docker) 吧！ 