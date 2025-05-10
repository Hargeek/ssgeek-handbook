---
sidebar_position: 3
---

# Python 基础知识

让我们开始学习 Python 的基础知识。

## 第一个 Python 程序

```python
print("Hello, World!")
```

## 变量和数据类型

Python 中的基本数据类型包括：

- 整数 (int)
- 浮点数 (float)
- 字符串 (str)
- 布尔值 (bool)

```python
# 整数
age = 25

# 浮点数
height = 1.75

# 字符串
name = "Python"

# 布尔值
is_student = True
```

## 列表和字典

### 列表
```python
fruits = ["apple", "banana", "orange"]
print(fruits[0])  # 输出: apple
```

### 字典
```python
person = {
    "name": "John",
    "age": 30,
    "city": "New York"
}
print(person["name"])  # 输出: John
```

## 条件语句

```python
age = 18

if age >= 18:
    print("成年人")
else:
    print("未成年人")
```

## 循环

### for 循环
```python
for i in range(5):
    print(i)
```

### while 循环
```python
count = 0
while count < 5:
    print(count)
    count += 1
```

## 函数

```python
def greet(name):
    return f"Hello, {name}!"

message = greet("Python")
print(message)  # 输出: Hello, Python!
```

## 下一步

这些是 Python 的基础知识。在接下来的章节中，我们将深入学习更多高级主题。 