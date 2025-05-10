---
sidebar_label: Go 基础知识
title: " "
---

让我们开始学习 Go 的基础知识。

## 第一个 Go 程序

```go
package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}
```

## 变量和数据类型

Go 中的基本数据类型包括：

- 整数 (int)
- 浮点数 (float64)
- 字符串 (string)
- 布尔值 (bool)

```go
// 变量声明
var age int = 25
var height float64 = 1.75
var name string = "Go"
var isStudent bool = true

// 简短声明
age := 25
height := 1.75
name := "Go"
isStudent := true
```

## 数组和切片

### 数组
```go
// 固定长度的数组
var numbers [5]int = [5]int{1, 2, 3, 4, 5}
```

### 切片
```go
// 动态长度的切片
numbers := []int{1, 2, 3, 4, 5}
```

## 映射（Map）

```go
// 创建映射
person := map[string]string{
    "name": "John",
    "city": "New York",
}

// 访问映射
fmt.Println(person["name"]) // 输出: John
```

## 条件语句

```go
age := 18

if age >= 18 {
    fmt.Println("成年人")
} else {
    fmt.Println("未成年人")
}
```

## 循环

Go 只有 for 循环，但可以模拟其他类型的循环：

```go
// 基本 for 循环
for i := 0; i < 5; i++ {
    fmt.Println(i)
}

// while 循环
count := 0
for count < 5 {
    fmt.Println(count)
    count++
}

// 无限循环
for {
    // 循环体
    break // 使用 break 退出循环
}
```

## 函数

```go
// 基本函数
func greet(name string) string {
    return "Hello, " + name + "!"
}

// 多返回值函数
func divide(a, b float64) (float64, error) {
    if b == 0 {
        return 0, fmt.Errorf("除数不能为零")
    }
    return a / b, nil
}
```

## 结构体

```go
type Person struct {
    Name string
    Age  int
}

// 创建结构体实例
person := Person{
    Name: "John",
    Age:  30,
}
```

## 下一步

这些是 Go 的基础知识。在接下来的章节中，我们将深入学习更多高级主题。 