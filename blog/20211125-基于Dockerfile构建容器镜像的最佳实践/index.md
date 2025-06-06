---
slug: blog/ji-yu-dockerfile-gou-jian-rong-qi-jing-xiang-de-zui-jia-shi-jian/
title: 基于Dockerfile构建容器镜像的最佳实践
tags: [docker]
date: 2021-11-25
---
<!--truncate-->
![20211125-01](./images/20211125-01.png)

## 1、背景概述

容器镜像是容器化落地转型的第一步，总结几点需要做镜像优化的原因

随着应用容器化部署的大规模迁移以及版本迭代的加快，优化基础设施之`docker`镜像主要有以下目的

- 缩短部署时的镜像下载时间

- 提升安全性，减少可供攻击的目标

- 减少故障恢复时间

- 节省存储开销

## 2、为什么镜像会这么大

这里简要分析了几个典型的`Repo`，总结了现有`Docker`镜像较大的几个原因

### 2.1 基础镜像过大

举例：仓库`A`，制作出来的镜像大小`9.67GB`

用到的基础镜像： 镜像大小`8.72GB`

逆向分析了一下，为啥基础镜像还这么大？结果就不用多说了0.0

### 2.2 基础镜像过大，而且找不到了

举例：仓库`B`，制作出来的镜像大小`22.7GB`

用到的基础镜像： **404 not found**，没错，找不到了0.0

### 2.3 .git目录（非必要目录）

这个问题更多内容可以参考我之前的文章 [Git目录为什么这么大](https://www.ssgeek.com/post/git-mu-lu-wei-shi-me-zhe-me-da/)

举例：仓库`C`，代码大小`795MB`

其中`.git`目录大小`225MB` ，`dockerfile`中的指令如下（全部添加到了镜像中）

```dockerfile
ADD . /app/startapp/
```

其中还包含了`d`目录大小约`300MB`，是否需要使用不得而知，但目测不需要使用，仅为测试数据

```shell
d
├── [ 503]  test_421.json
├── [ 483]  test_havalB9.json
...
├── [ 484]  test_144.json
├── [ 104]  .gitmodules
├── [ 122]  .idea
├── [   0]  __init__.py
├── [ 11M]  164103.zip
├── [108M]  test_180753.csv
├── [ 68M]  test_180753.txt
...
└── [ 335]  README.md
```

以上其实都不需要提交到镜像中制作成镜像

### 2.4 Dockerfile本身有其他问题

这个原因不言而喻，不是专业的人写的`Dockerfile`可能都有一定的优化空间，只是暂时没关注这些细节而已

例如，放任各路`repo`研发自行写`Dockerfile`，没有一定的标准，前期可能无所谓，到后期问题就慢慢浮现了

正所谓《能用就行》~

## 3、Dockerfile如何优化

### 3.1 从哪里入手

优化`docker`镜像应该从镜像分层概念入手

#### 3.1.1 举个栗子

一个实际的例子

nginx:alpine镜像 23.2MB

```shell
# docker history nginx:alpine
IMAGE          CREATED       CREATED BY                                      SIZE      COMMENT
b46db85084b8   9 days ago    /bin/sh -c #(nop)  CMD ["nginx" "-g" "daemon…   0B        
<missing>      9 days ago    /bin/sh -c #(nop)  STOPSIGNAL SIGQUIT           0B        
<missing>      9 days ago    /bin/sh -c #(nop)  EXPOSE 80                    0B        
<missing>      9 days ago    /bin/sh -c #(nop)  ENTRYPOINT ["/docker-entr…   0B        
<missing>      9 days ago    /bin/sh -c #(nop) COPY file:09a214a3e07c919a…   4.61kB    
<missing>      9 days ago    /bin/sh -c #(nop) COPY file:0fd5fca330dcd6a7…   1.04kB    
<missing>      9 days ago    /bin/sh -c #(nop) COPY file:0b866ff3fc1ef5b0…   1.96kB    
<missing>      9 days ago    /bin/sh -c #(nop) COPY file:65504f71f5855ca0…   1.2kB     
<missing>      9 days ago    /bin/sh -c set -x     && addgroup -g 101 -S …   17.6MB    
<missing>      9 days ago    /bin/sh -c #(nop)  ENV PKG_RELEASE=1            0B        
<missing>      9 days ago    /bin/sh -c #(nop)  ENV NJS_VERSION=0.7.0        0B        
<missing>      9 days ago    /bin/sh -c #(nop)  ENV NGINX_VERSION=1.21.4     0B        
<missing>      9 days ago    /bin/sh -c #(nop)  LABEL maintainer=NGINX Do…   0B        
<missing>      10 days ago   /bin/sh -c #(nop)  CMD ["/bin/sh"]              0B        
<missing>      10 days ago   /bin/sh -c #(nop) ADD file:762c899ec0505d1a3…   5.61MB
```

python:alpine镜像 45.5MB

```shell
# docker history python:alpine
IMAGE          CREATED       CREATED BY                                      SIZE      COMMENT
382a63bb2f25   10 days ago   /bin/sh -c #(nop)  CMD ["python3"]              0B        
<missing>      10 days ago   /bin/sh -c set -ex;   wget -O get-pip.py "$P…   8.31MB    
<missing>      10 days ago   /bin/sh -c #(nop)  ENV PYTHON_GET_PIP_SHA256…   0B        
<missing>      10 days ago   /bin/sh -c #(nop)  ENV PYTHON_GET_PIP_URL=ht…   0B        
<missing>      10 days ago   /bin/sh -c #(nop)  ENV PYTHON_SETUPTOOLS_VER…   0B        
<missing>      10 days ago   /bin/sh -c #(nop)  ENV PYTHON_PIP_VERSION=21…   0B        
<missing>      10 days ago   /bin/sh -c cd /usr/local/bin  && ln -s idle3…   32B       
<missing>      10 days ago   /bin/sh -c set -ex  && apk add --no-cache --…   29.8MB    
<missing>      10 days ago   /bin/sh -c #(nop)  ENV PYTHON_VERSION=3.10.0    0B        
<missing>      10 days ago   /bin/sh -c #(nop)  ENV GPG_KEY=A035C8C19219B…   0B        
<missing>      10 days ago   /bin/sh -c set -eux;  apk add --no-cache   c…   1.82MB    
<missing>      10 days ago   /bin/sh -c #(nop)  ENV LANG=C.UTF-8             0B        
<missing>      10 days ago   /bin/sh -c #(nop)  ENV PATH=/usr/local/bin:/…   0B        
<missing>      10 days ago   /bin/sh -c #(nop)  CMD ["/bin/sh"]              0B        
<missing>      10 days ago   /bin/sh -c #(nop) ADD file:762c899ec0505d1a3…   5.61MB
```

实际存储

```json
# docker inspect nginx:alpine| jq '.[0]|{GraphDriver}'             
{
  "GraphDriver": {
    "Data": {
      "LowerDir": "/data/docker-overlay2/overlay2/3d.../diff:/data/docker-overlay2/overlay2/ae.../diff:/data/docker-overlay2/overlay2/ea.../diff:/data/docker-overlay2/overlay2/29.../diff:/data/docker-overlay2/overlay2/5e.../diff",
      "MergedDir": "/data/docker-overlay2/overlay2/b7.../merged",
      "UpperDir": "/data/docker-overlay2/overlay2/b7.../diff",
      "WorkDir": "/data/docker-overlay2/overlay2/b7.../work"
    },
    "Name": "overlay2"
  }
}
```

分层概念的描述

镜像解决了应用运行及环境的打包问题，实际应用中应用都是基于同一个`rootfs`来打包和迭代的，但并不是每个`rootfs`都会多份，实际上`docker`利用了存储驱动`AUFS`，`devicemapper`，`overlay`，`overlay2`的存储技术实现了分层

例如上面查看一个`docker`镜像会发现这些层

- LowerDir：镜像层

- MergedDir：整合了lower层和upper读写层显示出来的视图

- UpperDir：读写层

- WorkDir：中间层，对Upper层的写入，先写入WorkDir，再移入UpperDir

#### 3.1.2 Copy on write

当`Docker`第一次启动一个容器时，初始的读写层是空的，当文件系统发生变化时，这些变化都会应用到这一层之上。比如，如果想修改一个文件，这个文件首先会从该读写层下面的只读层复制到该读写层。由此，该文件的只读版本依然存在于只读层，只是被读写层的该文件副本所隐藏，该机制则被称之为**写时复制**

#### 3.1.3 UnionFS

把多个目录(也叫分支)内容联合挂载到同一个目录下，而目录的物理位置是分开的

一个直观的效果，第一次拉取一个`nginx:1.15`版本镜像，再次拉取`nginx:1.16`镜像，速度要快很多

### 3.2 方案

了解了镜像大小的主要构成之后，就很容易知道从哪些方向入手减少镜像大小了

#### 3.2.1 减少镜像层数

镜像层数的增加，对`Dockerfile`来说主要在于`RUN`指令出现的次数，因此，合并`RUN`指令可以大大减少镜像层数

举个栗子：

合并前，三层

```dockerfile
RUN apk add tzdata
RUN cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
RUN echo "Asia/Shanghai" > /etc/timezone
```

合并后，一层

```dockerfile
RUN apk add tzdata \
    && cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
    && echo "Asia/Shanghai" > /etc/timezone
```

#### 3.2.2 减少每层镜像大小

##### 3.2.2.1 选用更小的基础镜像

- scratch：空镜像，又叫镜像之父！任何镜像都需要有一个基础镜像，那么问题来了，就好比是先有鸡还是先有蛋的问题，基础镜像的“祖宗”是什么呢？能不能在构建时不以任何镜像为基础呢？答案是肯定的，可以选用`scratch`，具体就不展开了，可以参考：[baseimages](https://docs.docker.com/develop/develop-images/baseimages/)，使用`scratch`镜像的例子`pause`
- busybox：对比`scratch`，多了常用的`linux`工具等
- alpine：多了包管理工具`apk`等

##### 3.3.2.2 多阶段构建

多阶段构建非常适用于编译性语言，简单来说就是允许一个`Dockerfile`中出现多条`FROM`指令，只有最后一条`FROM`指令中指定的基础镜像作为本次构建镜像的基础镜像，其它的阶段都可以认为是只为中间步骤

`FROM … AS …`和`COPY --from`组合使用

例如`java`镜像，镜像大小`812MB`

```dockerfile
FROM centos AS jdk
COPY jdk-8u231-linux-x64.tar.gz /usr/local/src
RUN cd /usr/local/src && \
    tar -xzvf jdk-8u231-linux-x64.tar.gz -C /usr/local
```

使用多阶段构建，镜像大小`618MB`

```dockerfile
FROM centos AS jdk
COPY jdk-8u231-linux-x64.tar.gz /usr/local/src
RUN cd /usr/local/src && \
    tar -xzvf jdk-8u231-linux-x64.tar.gz -C /usr/local

FROM centos
COPY --from=jdk /usr/local/jdk1.8.0_231 /usr/local
```

##### 3.3.2.3 忽略文件

构建上下文`build context`，“上下文” 意为和现在这个工作相关的周围环境

`docker build`时当前的工作目录，不管构建时有没有用到当前目录下的某些文件及目录，默认情况下这个上下文中的文件及目录都会作为构建上下文内容发送给`Docker Daemon`

当`docker build`开始执行时，控制台会输出`Sending build context to Docker daemon xxxMB`，这就表示将当前工作目录下的文件及目录都作为了构建上下文

前面提到可以在`RUN`指令中添加`--no-cache`不使用缓存，同样也可以在执行`docker build`命令时添加该指令以在镜像构建时不使用缓存

构建上下文中，使用`.dockerignore` 文件在构建时就可以避免将本地模块以及调试日志被拷贝进入到`Docker`镜像中，这和`git`版本控制的`.gitignore`很类似

##### 3.3.2.4 远程下载

使用远程下载代替`ADD`可以减少镜像大小

```dockerfile
RUN curl -s http://192.168.1.1/repository/tools/jdk-8u241-linux-x64.tar.gz | tar -xC /opt/
```

##### 3.3.2.5 拆分COPY

例如一个`COPY`指令的目录下`A`有`4`个子目录`AA/BB/CC/DD`被`COPY`，但常变化的只有一个BB

这个时候拆分`COPY`会更快

```dockerfile
COPY A/AA /app/A/AA
COPY A/BB /app/A/BB
COPY A/CC /app/A/CC
COPY A/DD /app/A/DD
```

##### 3.3.2.6 构建时挂载

构建时挂载（[扩展功能](https://docs.docker.com/engine/reference/commandline/dockerd/#description)）

配置

- 修改docker启动参数，添加`--experimental`
- dockerfile头部添加`# syntax=docker/dockerfile:1.1.1-experimental`

使用

- 挂载本地golang缓存

```dockerfile
# syntax = docker/dockerfile:experimental
FROM golang
...
RUN --mount=type=cache,target=/root/.cache/go-build go build ...
```

- 挂载cache目录

```dockerfile
# syntax = docker/dockerfile:experimental
FROM ubuntu
RUN rm -f /etc/apt/apt.conf.d/docker-clean; echo 'Binary::apt::APT::Keep-Downloaded-Packages "true";' > /etc/apt/apt.conf.d/keep-cache
RUN --mount=type=cache,target=/var/cache/apt --mount=type=cache,target=/var/lib/apt \
  apt update && apt install -y gcc
```

- 挂载某些凭据

```dockerfile
# syntax = docker/dockerfile:experimental
FROM python:3
RUN pip install awscli
RUN --mount=type=secret,id=aws,target=/root/.aws/credentials aws s3 cp s3://... ...
```

等等

##### 3.3.2.7 构建后清理

- 删除压缩包
- 清理安装缓存
  - --no-cache
  - rm -rf /var/lib/apt/lists/*
  - rm -rf /var/cache/yum/*

##### 3.3.2.8 镜像压缩

`export`和`import`组合进行压缩镜像（压缩效果不是很明显）

这种方法不好的就是会丢失一部分镜像信息

```shell
# docker run -d --name nginx nginx:alpine
# docker export nginx |docker import - nginx:alpine2
sha256:dd6a3cf822ac3c3ad3e7f7b31675cd8cd99a6f80e360996e04da6fc2f3b98cb5
# docker history nginx:alpine
IMAGE          CREATED       CREATED BY                                      SIZE      COMMENT
b46db85084b8   10 days ago   /bin/sh -c #(nop)  CMD ["nginx" "-g" "daemon…   0B        
<missing>      10 days ago   /bin/sh -c #(nop)  STOPSIGNAL SIGQUIT           0B        
<missing>      10 days ago   /bin/sh -c #(nop)  EXPOSE 80                    0B        
<missing>      10 days ago   /bin/sh -c #(nop)  ENTRYPOINT ["/docker-entr…   0B        
<missing>      10 days ago   /bin/sh -c #(nop) COPY file:09a214a3e07c919a…   4.61kB    
<missing>      10 days ago   /bin/sh -c #(nop) COPY file:0fd5fca330dcd6a7…   1.04kB    
<missing>      10 days ago   /bin/sh -c #(nop) COPY file:0b866ff3fc1ef5b0…   1.96kB    
<missing>      10 days ago   /bin/sh -c #(nop) COPY file:65504f71f5855ca0…   1.2kB     
<missing>      10 days ago   /bin/sh -c set -x     && addgroup -g 101 -S …   17.6MB    
<missing>      10 days ago   /bin/sh -c #(nop)  ENV PKG_RELEASE=1            0B        
<missing>      10 days ago   /bin/sh -c #(nop)  ENV NJS_VERSION=0.7.0        0B        
<missing>      10 days ago   /bin/sh -c #(nop)  ENV NGINX_VERSION=1.21.4     0B        
<missing>      10 days ago   /bin/sh -c #(nop)  LABEL maintainer=NGINX Do…   0B        
<missing>      10 days ago   /bin/sh -c #(nop)  CMD ["/bin/sh"]              0B        
<missing>      10 days ago   /bin/sh -c #(nop) ADD file:762c899ec0505d1a3…   5.61MB    
# docker history nginx:alpine2
IMAGE          CREATED          CREATED BY   SIZE      COMMENT
dd6a3cf822ac   40 seconds ago                23MB      Imported from -
# docker images|grep nginx
nginx                                                                                                               alpine2                     dd6a3cf822ac   54 seconds ago   23MB
nginx                                                                                                               alpine                      b46db85084b8   10 days ago      23.2MB
```



### 3.3 样例

#### 3.3.1 go 样例

样例一

`kubeadm`安装的`k8s`集群，`kube-apiserver`镜像的`Dockerfile`是利用`bazel`编译工具编译的

```dockerfile
bazel build ...
LABEL maintainers=Kubernetes Authors
LABEL description=go based runner for distroless scenarios
WORKDIR /
COPY /workspace/go-runner . # buildkit
ENTRYPOINT ["/go-runner"]
COPY file:2e904ea733ba0ded2a99947847de31414a19d83f8495dd8c1fbed3c70bf67a22 in /usr/local/bin/kube-apiserver
```

代码目录28M（包含.git目录20.5M）

镜像大小122MB

样例二

开源编排引擎`Cadence`的`Dockerfile`

```dockerfile
ARG TARGET=server

# Can be used in case a proxy is necessary
ARG GOPROXY

# Build tcheck binary
FROM golang:1.17-alpine3.13 AS tcheck

WORKDIR /go/src/github.com/uber/tcheck

COPY go.* ./
RUN go build -mod=readonly -o /go/bin/tcheck github.com/uber/tcheck

# Build Cadence binaries
FROM golang:1.17-alpine3.13 AS builder

ARG RELEASE_VERSION

RUN apk add --update --no-cache ca-certificates make git curl mercurial unzip

WORKDIR /cadence

# Making sure that dependency is not touched
ENV GOFLAGS="-mod=readonly"

# Copy go mod dependencies and build cache
COPY go.* ./
RUN go mod download

COPY . .
RUN rm -fr .bin .build

ENV CADENCE_RELEASE_VERSION=$RELEASE_VERSION

# bypass codegen, use committed files.  must be run separately, before building things.
RUN make .fake-codegen
RUN CGO_ENABLED=0 make copyright cadence-cassandra-tool cadence-sql-tool cadence cadence-server cadence-bench cadence-canary


# Download dockerize
FROM alpine:3.11 AS dockerize

RUN apk add --no-cache openssl

ENV DOCKERIZE_VERSION v0.6.1
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && echo "**** fix for host id mapping error ****" \
    && chown root:root /usr/local/bin/dockerize


# Alpine base image
FROM alpine:3.11 AS alpine

RUN apk add --update --no-cache ca-certificates tzdata bash curl

# set up nsswitch.conf for Go's "netgo" implementation
# https://github.com/gliderlabs/docker-alpine/issues/367#issuecomment-424546457
RUN test ! -e /etc/nsswitch.conf && echo 'hosts: files dns' > /etc/nsswitch.conf

SHELL ["/bin/bash", "-c"]


# Cadence server
FROM alpine AS cadence-server

ENV CADENCE_HOME /etc/cadence
RUN mkdir -p /etc/cadence

COPY --from=tcheck /go/bin/tcheck /usr/local/bin
COPY --from=dockerize /usr/local/bin/dockerize /usr/local/bin
COPY --from=builder /cadence/cadence-cassandra-tool /usr/local/bin
COPY --from=builder /cadence/cadence-sql-tool /usr/local/bin
COPY --from=builder /cadence/cadence /usr/local/bin
COPY --from=builder /cadence/cadence-server /usr/local/bin
COPY --from=builder /cadence/schema /etc/cadence/schema

COPY docker/entrypoint.sh /docker-entrypoint.sh
COPY config/dynamicconfig /etc/cadence/config/dynamicconfig
COPY config/credentials /etc/cadence/config/credentials
COPY docker/config_template.yaml /etc/cadence/config
COPY docker/start-cadence.sh /start-cadence.sh

WORKDIR /etc/cadence

ENV SERVICES="history,matching,frontend,worker"

EXPOSE 7933 7934 7935 7939
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD /start-cadence.sh


# All-in-one Cadence server
FROM cadence-server AS cadence-auto-setup

RUN apk add --update --no-cache ca-certificates py-pip mysql-client
RUN pip install cqlsh

COPY docker/start.sh /start.sh

CMD /start.sh


# Cadence CLI
FROM alpine AS cadence-cli

COPY --from=tcheck /go/bin/tcheck /usr/local/bin
COPY --from=builder /cadence/cadence /usr/local/bin

ENTRYPOINT ["cadence"]

# Cadence Canary
FROM alpine AS cadence-canary

COPY --from=builder /cadence/cadence-canary /usr/local/bin
COPY --from=builder /cadence/cadence /usr/local/bin

CMD ["/usr/local/bin/cadence-canary", "--root", "/etc/cadence-canary", "start"]

# Cadence Bench
FROM alpine AS cadence-bench

COPY --from=builder /cadence/cadence-bench /usr/local/bin
COPY --from=builder /cadence/cadence /usr/local/bin

CMD ["/usr/local/bin/cadence-bench", "--root", "/etc/cadence-bench", "start"]

# Final image
FROM cadence-${TARGET}
```

代码目录85.4M（包含.git目录57.7M）

镜像大小135.69MB

#### 3.3.2 py 样例

```dockerfile
FROM python:3.4

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        postgresql-client \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app
COPY requirements.txt ./
RUN pip install -r requirements.txt
COPY . .

EXPOSE 8000
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
```

代码目录275M（包含.git目录222M）

镜像大小436MB

## 4、除了这些优化还可以做什么

### 4.1 设置字符集

在`Dockerfile`中设置通用的字符集

```dockerfile
# Set lang
ENV LANG "en_US.UTF-8"
```

### 4.2 时区校正

这个问题更多内容可以参考我之前的文章 [k8s环境下处理容器时间问题的多种姿势](https://www.ssgeek.com/post/k8s-huan-jing-xia-chu-li-rong-qi-shi-jian-wen-ti-de-duo-chong-zi-shi/)

在`Dockerfile`中设置通用的时区

```dockerfile
# Set timezone
RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
		 && echo "Asia/Shanghai" > /etc/timezone
```

### 4.3 进程管理

`docker`容器运行时，默认会以`Dockerfile`中的`ENTRYPOINT`或`CMD`作为`PID`为`1`的主进程，这个进程存在的目的，通俗来说需要做的就是将容器"夯住"，一旦这个进程不存在了，那么容器就会退出

除此之外，这个主进程还有一个重要的作用就是管理“僵尸进程”

一个比较官方的定义，“僵尸进程”是指完成执行（通过`exit`系统调用，或运行时发生致命错误或收到终止信号所致），但在操作系统的进程表中仍然存在其进程控制块，处于"终止状态"的进程。

清理“僵尸进程”的思路主要有

- 将父进程中对`SIGCHLD`信号的处理函数设为`SIG_IGN`（忽略信号）；
- `fork`两次并杀死一级子进程，令二级子进程成为孤儿进程而被`init`所“收养”、清理

目前可以实现的开源方案

- Tini
  `tini`容器`init`是一个最小化的`init`系统，运行在容器内部，用于启动一个子进程，并等待进程退出时清理僵尸和执行信号转发

  优点

  - `tini`可以避免应用程序生成僵尸进程

  - `tini`可以处理`Docker`进程中运行的程序的信号，通过`Tini`， `SIGTERM` 可以终止进程，不需要你明确安装一个信号处理器

  示例

```dockerfile
# Add Tini
ENV TINI_VERSION v0.19.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
RUN chmod +x /tini
ENTRYPOINT ["/tini", "--"]

# Run your program under Tini
CMD ["/your/program", "-and", "-its", "arguments"]
# or docker run your-image /your/program ...
```

- dumb-init

  `dumb-init`会向子进程的进程组发送其收到的信号。例如 bash 接收到信号之后，不会向子进程发送信号

  `dumb-init`也可以通过设置环境变量`DUMB_INIT_SETSID=0`来控制只向它的直接子进程发送信号

  另外`dumb-init`也会接管失去父进程的进程，确保其能正常退出

  示例

```dockerfile
FROM alpine:3.11.5
RUN sed -i "s/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g" /etc/apk/repositories \
    && apk add --no-cache dumb-init

# Runs "/usr/bin/dumb-init -- /my/script --with --args"
ENTRYPOINT ["dumb-init", "--"]

# or if you use --rewrite or other cli flags
# ENTRYPOINT ["dumb-init", "--rewrite", "2:3", "--"]

CMD ["/my/script", "--with", "--args"]
```

### 4.4 降权启动

很多情况下，容器中的进程需要降权启动以保证安全性，这就和我们在`vm`上运行一个`nginx`服务一样，最好通过特定的降权用户去运行

举例，`tomcat`镜像

```dockerfile
...
USER tomcat
WORKDIR /usr/local/tomcat
EXPOSE 8080
ENTRYPOINT ["catalina.sh","run"]
```

如果在某些情况下需要使用`sudo`权限，在`docker`官方避免安装或使用`sudo`，`sudo`因为它具有不可预测的`TTY`和可能导致问题的信号转发行为。如果必须，例如将守护进程初始化为 `root`但将其作为非运行`root`，推荐使用`gosu`

例如，[Postgres 官方镜像](https://hub.docker.com/_/postgres/) 使用以下脚本作为其`ENTRYPOINT`

```shell
#!/bin/bash
set -e

if [ "$1" = 'postgres' ]; then
    chown -R postgres "$PGDATA"

    if [ -z "$(ls -A "$PGDATA")" ]; then
        gosu postgres initdb
    fi

    exec gosu postgres "$@"
fi

exec "$@"
```

### 4.5 底层库依赖

很多时候，服务依赖一些底层库的支持，这里以基于`alpine`基础镜像构建`java`镜像举个栗子

`alpine`为了精简本身并没有安装太多的常用软件，所以如果要使用`jdk/jre`的话就需要`glibc`，而`glibc`需要先得到`ca-certificates`证书服务（安装`glibc`前置依赖）才能安装

用`alpine`跑了`jdk8`的镜像结果发现`jdk`无法执行。究其原因，`java`是基于`GUN Standard C library(glibc)`，`alpine`是基于`MUSL libc(mini libc)`，所以`alpine`需要安装`glibc`的库

## 5、小结

本文简要分析了`Dockerfile`为什么这么大的几个主要原因，并且根据生产经验罗列了一些优化镜像大小的措施以及其他方面常用的处理办法，很多技巧性的内容，比较杂乱，就不一一提及了

参考
>- https://github.com/docker-library/official-images#init
>- https://wiki.alpinelinux.org/wiki/Running_glibc_programs