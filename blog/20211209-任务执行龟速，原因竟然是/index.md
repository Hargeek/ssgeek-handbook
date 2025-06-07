---
slug: blog/ren-wu-zhi-xing-gui-su-yuan-yin-jing-ran-shi/
title: 任务执行龟速，原因竟然是......
tags: [k8s,kubernetes]
date: 2021-12-09
---
介绍在 k8s 环境中一次任务执行龟速的排查过程
<!--truncate-->

![20211209-01](./images/20211209-01.png)

## 1、问题背景

某天，业务同学反馈生产环境`k8s`集群中由核心服务创建的`Job`任务执行速度奇慢......

通过分析服务日志发现，该服务运行前期主要是执行请求数据交换服务，获取到`oss`对象存储的文件`url`后进行下载，下载完成后再执行其他任务

## 2、分析和复盘

“服务好好的，怎么用着用着就慢了呢？” 旁边的xx开始发起了灵魂拷问

由于此问题偏故障型，首先想到的当然是秉承着“有报错，看日志”的宗旨，去看各方服务的日志

通过排查日志，均无错误，但现象就是日志慢而且卡顿

于是先判断是不是服务之间的网络出问题了

简单思考了下，与网络因素相关，再加上排除法，最小化可能的相关原因有如下

- `pod`网卡
- 节点和`pod`网络检查
- 调度到不同节点的网卡对比
- 不同场景下网卡出入站带宽
- `dns`解析
- 节点资源综合对比
- `oss`服务端限流等策略核查
- 服务本身代码是否变更等等

对照可能原因开始一一排查，如下列举一些相关的具体排查方法，其余就不再赘述了

### 2.1 网络带宽测试

对于网络带宽的测试，可以选用`ethtool`、`iperf`等工具，可以很方便的帮我们查看网卡相关信息，测试网络出站入站的带宽，顺便加上抓包工具

```shell
# ethtool
Settings for eth0:
	Supported ports: [ ]
	Supported link modes:   Not reported
	Supported pause frame use: No
	Supports auto-negotiation: No
	Advertised link modes:  Not reported
	Advertised pause frame use: No
	Advertised auto-negotiation: No
	Speed: 10000Mb/s
	Duplex: Full
	Port: Twisted Pair
	PHYAD: 0
	Transceiver: internal
	Auto-negotiation: off
	MDI-X: Unknown
Cannot get wake-on-lan settings: Operation not permitted
	Link detected: yes

# iperf
Server listening on TCP port 5001
TCP window size: 12.0 MByte (default)
------------------------------------------------------------
[  4] local 10.244.155.34 port 5001 connected with 10.244.0.196 port 42148
[ ID] Interval       Transfer     Bandwidth
[  4] 0.0000-2.0000 sec  1.62 GBytes  6.97 Gbits/sec
[  4] 2.0000-4.0000 sec  1.15 GBytes  4.93 Gbits/sec
[  4] 4.0000-6.0000 sec  1.15 GBytes  4.93 Gbits/sec
[  4] 6.0000-8.0000 sec  1.14 GBytes  4.91 Gbits/sec
[  4] 8.0000-10.0000 sec  1.14 GBytes  4.91 Gbits/sec
[  4] 10.0000-12.0000 sec  1.14 GBytes  4.92 Gbits/sec
[  4] 12.0000-14.0000 sec  1.14 GBytes  4.89 Gbits/sec
[  4] 14.0000-16.0000 sec  1.14 GBytes  4.90 Gbits/sec
[  4] 16.0000-18.0000 sec  1.14 GBytes  4.88 Gbits/sec
[  4] 18.0000-20.0000 sec  1.14 GBytes  4.88 Gbits/sec
[  4] 20.0000-22.0000 sec  1.14 GBytes  4.89 Gbits/sec
[  4] 22.0000-24.0000 sec  1.14 GBytes  4.89 Gbits/sec
[  4] 24.0000-26.0000 sec  1.13 GBytes  4.87 Gbits/sec
[  4] 26.0000-28.0000 sec  1.14 GBytes  4.88 Gbits/sec
[  4] 28.0000-30.0000 sec  1.14 GBytes  4.91 Gbits/sec
[  4] 30.0000-32.0000 sec  1.14 GBytes  4.88 Gbits/sec
[  4] 32.0000-34.0000 sec  1.14 GBytes  4.89 Gbits/sec
[  4] 34.0000-36.0000 sec  1.14 GBytes  4.91 Gbits/sec
[  4] 36.0000-38.0000 sec  1.14 GBytes  4.88 Gbits/sec
[  4] 38.0000-40.0000 sec  1.14 GBytes  4.91 Gbits/sec
[  4] 40.0000-42.0000 sec  1.14 GBytes  4.90 Gbits/sec
[  4] 42.0000-44.0000 sec  1.14 GBytes  4.90 Gbits/sec
[  4] 44.0000-46.0000 sec  1.14 GBytes  4.90 Gbits/sec
[  4] 46.0000-48.0000 sec  1.14 GBytes  4.90 Gbits/sec
[  4] 48.0000-50.0000 sec  1.15 GBytes  4.93 Gbits/sec
[  4] 50.0000-52.0000 sec  1.14 GBytes  4.91 Gbits/sec
[  4] 52.0000-54.0000 sec  1.14 GBytes  4.92 Gbits/sec
[  4] 54.0000-56.0000 sec  1.14 GBytes  4.90 Gbits/sec
[  4] 56.0000-58.0000 sec  1.14 GBytes  4.88 Gbits/sec
[  4] 58.0000-60.0000 sec  1.14 GBytes  4.89 Gbits/sec
[  4] 60.0000-60.0201 sec  13.6 MBytes  5.69 Gbits/sec
[  4] 0.0000-60.0201 sec  34.7 GBytes  4.97 Gbits/sec
```

结果：无果

### 2.2 dns解析测试

对于`dns`解析的测试，利用`dig`、`nslookup`工具分别选取了公网域名，内网域名，集群内域名分别测试进行对比，例如

```shell
www.baidu.com
data.ssgeek.com
data-download.default.svc.cluster.local
```

结果：无果

### 2.3 业务代码排查

针对于此业务，排查了其发布的版本，在出故障时并未发布新版本

服务是`python`语言写的，于是结合`sdk`对代码进行分析，将`oss`下载相关逻辑拆分出来，写成`python`脚本，单独调用`sdk`获得下载地址，然后进行下载流程，分别计算每一步骤执行的时间

结果：无果

### 2.4 多方对比法

#### 2.4.1 基础镜像

由于有同类以`deployment`形式部署的对应服务，但在`deployment`的`pod`中下载没有任何问题

代码一样，开始怀疑是否因`job`任务使用的镜像与正常的镜像底层有关系

分别检查了对应的`Dockerfile`，发现`base`镜像及版本都不一样

于是将其变为同样的`base`镜像再次对比，任务执行时间还是有很大区别

结果：无果

#### 2.4.2 下载外网文件

排除了镜像问题，继续排除`oss`服务端的问题，于是分别通过`shell`让两边的`pod`去公网下载同样的大文件以及同样的小文件分别进行对比

结果：无果

到这里已经近乎`mb`了

这里也省略其他对比的一些措施

### 2.5 直接下载测试

通过上面的一些`sao`操作，发现都没有明显效果，这对问题的排查增加了一定难度

于是乎，能不能抛开代码业务逻辑不谈，先一次性拿到所有需要下载文件的地址，然后手动通过原始的`shell`脚本去批量执行下载任务进行对比呢？当然

这里举例，用`shell`下载文件的脚本如下

```shell
#/bin/bash

j=1
for i in `cat 1.txt`
do
    echo $j
    curl -s -o $j.jpg $i
    let j=j+1
done
# 1.txt为文件的url列表
```

## 3、问题定位

通过上面最后一次通过`shell`脚本下载文件测试时发现：

在测试脚本刚开始启动时，程序会停顿几分钟，然后再开始执行下载任务，这意味着`bash`程序启动慢

换做`job`，`job`运行的`pod`执行的是一次性任务，因此和脚本执行是一样的，只是`k8s`层提供了这个脚本执行的载体，即`pod`

我们可以用一个简单的命令组合，检查当前`bash`的执行时间，发现相比正常情况下要慢很多

```shell
# time bash -c exit

real        0m0.004s
user        0m0.000s
sys         0m0.000s
```

## 4、问题分析

通过进一步检查程序启动慢的资料发现，程序在启动之前往往会加载系统的环境变量

由于`pod`执行的是一次性任务，因此这种`job`的执行时间就包含了

- 加载环境变量的时间
- 程序执行时间（包含网络请求、`io`读写、计算等）

而普通的`pod`，在正常运行第一次启动时就已经加载了环境变量，所以当`pod`再次去执行某些任务时，已经不需要这一步骤了 ~

这样一来，当环境变量过多时，程序启动就会变慢

通过`env`命令，可以打印出`pod`内所有的环境变量

默认情况下`k8s`会为每个`pod`都注入除了自定义的环境变量以外的，这个`pod`所在命名空间下所有的公共环境变量

到这里，事情开始出现了转机，于是默默兴奋了一把

于是计算了一下环境变量个数，竟然高达`35000+`个环境变量，进一步排查发现，几乎`99%`的环境变量都是一个大量任务的相关服务的环境变量，这个服务会以`deployment`、`service`的命名不同，来创建很多个定义一样，命名不同的副本服务，进一步在集群中检查，此类服务的数量达`4500`多个

在谷歌`Google Kubernetes Engine (GKE)`中建议

每个命名空间的`Service`数不应超过`5000`。如超过此值，`Service`环境变量的数量会超出`shell`限制，导致`Pod`在启动时变慢甚至崩溃。在`Kubernetes 1.13`版本后，可以通过将`PodSpec`中的`enableServiceLinks`设置为`false`来停止填充这些变量

这个值在阿里云`Alibaba Cloud Container Service for Kubernetes (ACK)`的默认建议是`1000`个

即想要禁止注入无关环境变量的注入，从`Kubernetes 1.13`版本开始，可以声明`enableServiceLinks: false`

更巧的是，默认创建的`pod`，这个`enableServiceLinks`选项是不可见（隐式）的，即使`-o yaml`也不会输出，但是默认值又给了`true`，这就让人很难察觉了

源码部分参考

`pkg/apis/core/v1/defaults.go`

```go
if obj.Spec.EnableServiceLinks == nil {
	enableServiceLinks := v1.DefaultEnableServiceLinks
	obj.Spec.EnableServiceLinks = &enableServiceLinks
}
```
`k8s.io/api/core/v1/types.go`

```go
const (
	// The default value for enableServiceLinks attribute.
	DefaultEnableServiceLinks = true
)
```

## 5、问题解决

最终通过在`job`的定义中添加了这个参数的默认值，新创建的`pod`的就仅剩不到`30`个环境变量

修改创建`job`的相关代码`job_scheduler.go`

```go
var (
    ...
	jobTaskK8sEnableServiceLinks = false
)
...
targetJob.Spec.Template.Spec.EnableServiceLinks = &jobTaskK8sEnableServiceLinks
...
```

再次部署新的服务并在相同场景下测试，下载速度恢复如常，问题得以解决~

## 6、小结

小结一下，本文记录复盘的是一次`k8s`集群相关的生产故障

随着服务增多，集群的庞大，一些未知问题就必然会出现（而如果集群规模较小，也就基本不会遇到了）

对于一开始未知原因、诡异、没有思路的问题或者`bug`，往往利用穷举法列出所有可能的原因，然后采取最小化复现、差异化对比等等，基本能解决大部分这类问题

参考
>- https://github.com/kubernetes/kubernetes/issues/92226
>- https://cloud.google.com/kubernetes-engine/docs/best-practices/scalability
>- https://mozillazg.com/2020/06/kubernetes-k8s-too-many-service-environment-variables-cause-pod-container-start-bash-too-slow.html
