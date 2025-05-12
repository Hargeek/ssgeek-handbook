---
slug: blog/gradle-da-bao-gong-ju-ru-men
title: Gradle打包工具入门
tags: [CICD,DevOps,Gradle]
date: 2022-03-25
---

介绍Gradle打包工具入门
<!--truncate-->

![20220325-01](./images/20220325-01.png)

## 1、Gradle介绍

`Gradle`是一种自动化构建语言，是一种`DSL`。目前是`Android`的默认构建工具，是一个编程框架

`Gradle`是一个基于`Apache Ant`和`Apache Maven`概念的项目自动化构建开源工具。它使用一种基于`Groovy`的特定领域语言(DSL)来声明项目设置，也增加了基于`Kotlin`语言的`kotlin-based DSL`，抛弃了基于`XML`的各种繁琐配置



特点：

- 支持局部构建和增量构建
- 对多工程的构建支持很出色，工程依赖是`gradle`的第一公民
- 是第一个构建集成工具，与`ant`、`maven`、`ivy`有良好的相容相关性
- `gradle`的整体设计是以作为一种语言为导向的，而非成为一个严格死板的框架
- 支持多方式依赖管理：包括从`maven`远程仓库、`nexus`私服、`ivy`仓库以及本地文件系统的`jars`或者`dirs`
- 轻松迁移：`gradle`适用于任何结构的工程，你可以在同一个开发平台平行构建原工程和`gradle`工程。通常要求写相关测试，以保证开发的插件的相似性，这种迁移可以减少破坏性，尽可能的可靠。这也是重构的最佳实践

## 2、Gradle配置分析

### 2.1 根目录配置

在代码编译时最先找到这个文件

```gradle title="settings.gradle"
apply from: 'allconfig.gradle'
include: 'app'  // 包含的工程模块
if ( buildType==1 ){
    include ':mylibrary2'
} else if ( buildType==2 ){
    include ':mylibrary'
}
//在这里写一个脚本，让编译速度更快
rootProject.name = 'gradledemo'  // 工程名
```

build文件

```gradle title="build.gradle"
// 根目录的构建脚本
buildscript {
    // 指定了仓库
    repositories {
        maven {  // 加速地址要放在最上面，从上往下找
            url 'http://maven.aliyun.com/nexus/content/groups/public/'
        }
        google()
        jcenter()
    }
    dependencies {  // 配置插件
        // gradle 插件版本
        classpath "com.android.tools.build:gradle:4.0.1"
    }
}

allprojects {
    // 项目本身需要的依赖，配置所有的Module公共依赖
    repositories {
        maven {
            url 'http://maven.aliyun.com/nexus/content/groups/public/'
        }
        google()
        jcenter()
    }
}

// 任务
task Clean(type: Delete) {
    delete rootProject.buildDir // 清理每次编译生成的文件
}
```

### 2.2 应用目录配置

build文件

```gradle title="build.gradle"
// 配置当前Module的属性
// 如果声明的是com.android.library  表示是一个依赖库
// 如果声明的是com.android.plugin   表示是一个插件
// 如果声明的是com.android.application   表示是一个app
apply plugin: 'com.android.application'
// 类似引入包一样，引入外部的gradle配置文件
apply from: 'config.gradle'

android {
    compileSdkVersion 30
    buildToolsVersion "30.0.2"

    defaultConfig {
        applicationId "com.mn.gradledemo"
        minSdkVersion 16
        targetSdkVersion 30
        versionCode 1
        versionName "1.0"
        testInstrumentationRunner "androidx.test.runner.AndridJunitRunner"
    }

    dependencies {
        implementation fileTree(dir: "libs", include: ["*.jar"])
        implementation 'androidx.appcompat:appcompat:1.2.0'
        implementation 'androidx.constraintlayout:constraintlayout:2.0.4'
        testImplementation 'junit:junit:4.12'
        androidtestInstrumentation 'androidx.test.ext:junit:1.1.2'
        androidtestInstrumentation 'androidx.test.espresso:espresso-core:3.3.0'
    }
}

// 只要声明了一个任务，不用调用就会执行
task stringText{
    // 使用def声明关键字
    def str1 = "shuanyinhao";
    def str2 = 'danyinhan';
    println("${str1}---${str2}")
}
```

配置文件

```gradle title="config.gradle"
// ext就表示额外的属性声明
ext{
    server = "prod"
    dataSource = "0"
}
```

## 3、Gradle基础语法

### 3.1 常规语法

```gradle
// list
task list{
    def list=[1,2,3,4,5,6]
    def weekList = ['one','two','three']
    println(list[0])
    println(weekList[0])
    for(int i in 1..10){
        println i
    }
    // 这里的it就表示每一个元素, it是一个关键字，表示它自己
    weekList.each {
        println it
    }
}

// map
task map{
    def map:['name':'jack','age':19]
    println map['name']
    map.each {
        println "key:${it.key},value:${it.value}"
    }
    println(methodA(2,3)) // 5
}

// 在gradle语法当中，定义一个方法
// 如果在没有return的情况下，函数默认会返回最后一行非空的值
def methodA(int a,int b){
    a+b
}

// 怎样定义一个对象
task javaBeanTask{
    Student student = new Student()
    student.name = "Lily"
    student.age = 19
    println student.name + "---${student.age}"
    println student.getName() + "---${student.getAge()}"
}

class Student{
    String name
    int age

    String getName(){
        return name
    }

    void setName(String name){
        this.name = name
    }

    int getAge(){
        return age
    }

    void setAge(int age){
        this.age = age
    }
}
```

### 3.2 闭包和it关键字

`Groovy`中的闭包是一个开放，匿名的代码块，可以接受参数，返回值并赋值给变量

闭包，是一个代码块，或可以理解成一个匿名函数，在外部方法调用时，可以将其作为方法的实参传递给方法的形参，并在方法内部回调此匿名函数，且回调此匿名函数时可以传递实参给到匿名函数的内部去接收，并执行此匿名函数

同时，此代码块或匿名函数也可以赋值给一个变量，使其具有自执行的能力，且最后一行的执行语句作为匿名函数的返回

```gradle
// 闭包，自定义闭包
def mEach(closure){
    for(int i in 1..5){
        closure(i)
    }
}

def mEachWithParams(closure){
    def map = ['name':'groovy','age':10]
    map.each{
        closure(it.key,it.value)
    }
}

// 调用闭包
task closureTask{
    // 回调一个参数的时候，it就是指这个参数，就能用it，多个就不行了
    mEach({
        println it
        // a->println a
    })
    mEachWithParams{
        m,n—>println "${m} is ${n}"
    }
}
```

## 4、环境区分

主要目的是不需要修改代码就能区分测试环境和生产环境

例如有这样的代码目录（不同环境的配置文件）

```shell
app/src/main/filters/debug/config.properties
app/src/main/filters/release/config.properties
```

通过读取文件流实现按不同环境区分

```gradle title="build.gradle"
// 配置当前Module的属性
// 如果声明的是com.android.library  表示是一个依赖库
// 如果声明的是com.android.plugin   表示是一个插件
// 如果声明的是com.android.application   表示是一个app
apply plugin: 'com.android.application'
// 类似引入包一样，引入外部的gradle配置文件
apply from: 'config.gradle'

android {
...

    // 构建类型
    buildTypes{
        // 测试环境
        debug{
            // 参数: 声明的类型、名字、属性值
            buildConfigField 'String','SERVER2',getServer2('debug')
        }
        release{
            buildConfigField 'String','SERVER2',getServer2('release')
        }
    }
}

// 读取文件流,str代表debug还是release
def getServer2(String str){
    def SERVER2
    Properties properties = new Properties();
    // 相对路径
    def proFile = file("src/main/filters/"+str+"/config.properties")
    if(proFile.canRead()){
        properties.load(new FileInputStream(proFile))
        if(properties!=null){
            SERVER2 = properties['SERVER2']
        }
    }
    return SERVER2
}
```

## 5、多渠道打包

多渠道打包常用于安卓`app`，例如统计不同渠道的数据（投放到多个应用市场）

### 5.1 核心逻辑

主要核心实现如下

```gradle
apply plugin: 'com.android.application'
apply from: 'config.gradle'

android {
    compileSdkVersion 30
    buildToolsVersion "30.0.2"

    defaultConfig {
        applicationId "com.mn.gradledemo"
        minSdkVersion 16
        targetSdkVersion 30
        versionCode 1
        versionName "1.0"
        testInstrumentationRunner "androidx.test.runner.AndridJunitRunner"
        // 多渠道打包
        flavorDimensions "versionCode"
    }
...

    // 构建类型
    buildTypes{
        // 测试环境
        debug{
            // 参数: 声明的类型、名字、属性值
            buildConfigField 'String','SERVER2',getServer2('debug')
            android.applicationVariants.all{
                variant ->
                    variant.outputs.all{
                        def fileName = "${getCurrentTime()}_V{defaultConfig.versionName}_debug.apk"
                        outputFileName = fileName
                    }
            }
        }
        release{
            buildConfigField 'String','SERVER2',getServer2('release')
        }
    }

    // 多渠道打包
    productFlavors{
        xiaomi{
            buildConfigField 'String','PLATE_FORM',"\"xiaomi\""
            manifestPlaceholders = [UMENG_CHANNEL_VALUE: "xiaomi"]
        }
        yinyongbao{
            buildConfigField 'String','PLATE_FORM',"\"yingyongbao\""
            manifestPlaceholders = [UMENG_CHANNEL_VALUE: "yingyongbao"]
        }
    }
}

static def getCurrentTime(){
    return new Date().format("yyyy-MM-dd",timeZone.getTimeZone("UTC"))
}
```

### 5.2 一键化配置多渠道打包

```gradle
    // 一键化多渠道打包
    productFlavors{
        xiaomi{}
        yingyongbao{}
    }
    productFlavors.all{
        flavor ->
            flavor.manifestPlaceholders = [UMENG_CHANNEL_VALUE: name]
            buildConfigField 'String','PLATE_FORM',"\"${name}\""
    }
```

## 6、gradle打包加速

和`maven`打包一样，`gradle`会在编译时的用户家目录，例如`/root/.gradle`目录下生成一个缓存目录，除此之外，在应用的目录下也会生成一个`build`目录，这个目录下也有相应的`build cache`

可以在全局配置`gradle`，使其拉取插件时走国内的源

配置文件为`/root/.gradle/init.gradle`，内容如下

```gradle
allprojects {
    repositories {
        mavenLocal()
		maven { name "Aliyun" ; url "https://maven.aliyun.com/repository/public" }
		maven { name "Bstek" ; url "http://nexus.bsdn.org/content/groups/public/" }
    }

	buildscript { 
		repositories { 
			maven { name "Aliyun" ; url 'https://maven.aliyun.com/repository/public' }
			maven { name "Bstek" ; url 'http://nexus.bsdn.org/content/groups/public/' }
			maven { name "M2" ; url 'https://plugins.gradle.org/m2/' }
		}
	}
}
```

