---
sidebar_position: 3
---

# Docker 基础

Docker 是一个开源的容器化平台，用于开发、部署和运行应用程序。

## 安装 Docker

### Windows
1. 访问 [Docker Desktop](https://www.docker.com/products/docker-desktop)
2. 下载并安装 Docker Desktop

### macOS
```bash
brew install --cask docker
```

### Linux
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io

# CentOS/RHEL
sudo yum install docker-ce docker-ce-cli containerd.io
```

## 基本概念

- 镜像（Image）：应用程序的模板
- 容器（Container）：运行中的镜像实例
- 仓库（Registry）：存储镜像的地方
- Dockerfile：构建镜像的配置文件

## 基本命令

### 镜像操作
```bash
# 拉取镜像
docker pull <image-name>

# 列出镜像
docker images

# 删除镜像
docker rmi <image-id>
```

### 容器操作
```bash
# 运行容器
docker run <image-name>

# 列出容器
docker ps
docker ps -a  # 包括已停止的容器

# 停止容器
docker stop <container-id>

# 删除容器
docker rm <container-id>
```

## Dockerfile 示例

```dockerfile
# 使用 Python 基础镜像
FROM python:3.9

# 设置工作目录
WORKDIR /app

# 复制依赖文件
COPY requirements.txt .

# 安装依赖
RUN pip install -r requirements.txt

# 复制应用代码
COPY . .

# 暴露端口
EXPOSE 5000

# 启动命令
CMD ["python", "app.py"]
```

## 构建和运行

```bash
# 构建镜像
docker build -t my-app .

# 运行容器
docker run -p 5000:5000 my-app
```

## Docker Compose

Docker Compose 用于定义和运行多容器应用。

### docker-compose.yml 示例

```yaml
version: '3'
services:
  web:
    build: .
    ports:
      - "5000:5000"
    depends_on:
      - db
  db:
    image: postgres:13
    environment:
      POSTGRES_PASSWORD: example
```

### 使用 Docker Compose

```bash
# 启动服务
docker-compose up

# 停止服务
docker-compose down
```

## 最佳实践

1. 使用官方基础镜像
2. 优化镜像大小
3. 使用多阶段构建
4. 合理使用缓存
5. 注意安全性

## 下一步

这些是 Docker 的基础知识。在接下来的章节中，我们将学习更多高级主题。 