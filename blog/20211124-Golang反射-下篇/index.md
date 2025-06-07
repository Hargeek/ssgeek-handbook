---
slug: blog/golang-fan-she-xia-pian/
title: Golang反射-下篇
tags: [Golang]
date: 2021-11-24
---
<!--truncate-->

![golang](/img/golang.png)

本文是[Golang反射-上篇](https://www.ssgeek.com/blog/golang-fan-she-shang-pian/)的续篇内容，主要介绍反射实际的一些使用

## 1、判断类型interface.Type

利用类型断言来判断数据类型的用法如下

```go
package main

import "fmt"

func main()  {
	var s interface{} = "abc"
	switch s.(type) {
	case string:
		fmt.Println("s.type=string")
	case int:
		fmt.Println("s.type=int")
	case bool:
		fmt.Println("s.type=bool")
	default:
		fmt.Println("未知的类型")
	}
}
```

上述类型判断的问题
- 类型判断会写很多，代码很长
- 类型还会增删，不灵活

如果使用反射获取变量内部的信息
- reflect包提供ValueOf和TypeOf
- reflect.ValueOf：获取输入接口中数据的值，如果为空返回0
- reflect.TypeOf：获取输入接口中值的类型，如果为空返回nil
- TypeOf能传入所有类型，是因为所有的类型都实现了空接口

```go
package main

import (
	"fmt"
	"reflect"
)

func main()  {
	var s interface{} = "abc"
	//TypeOf会返回目标的对象
	reflectType:=reflect.TypeOf(s)
	reflectValue:=reflect.ValueOf(s)
	fmt.Printf("[typeof:%v]\n", reflectType)  // string
	fmt.Printf("[valueof:%v]\n", reflectValue)  // abc
}
```

## 2、自定义struct的反射

自定义struct的相关操作

- 对于成员变量
  - 先获取interface的reflect.Type，然后遍历NumField
  - 再通过reflect.Type的Field获取字段名及类型
  - 最后通过Field的interface获取对应的value

- 对于方法
  - 先获取interface的reflect.Type，然后遍历NumMethod
  - 再通过reflect.Type的t.Method获取真实的方法名
  - 最后通过Name和Type获取方法的类型和值

注意点

- 用于对未知类型进行遍历探测其Field，抽象成一个函数
- go语言里面struct成员变量小写，在反射的时候直接panic()
- 结构体方法名小写是不会panic的，反射值也不会被查看到
- 指针方法是不能被反射查看到的

```go
package main

import (
	"fmt"
	"reflect"
)

type Person struct {
	Name string
	Age  int
}

type Student struct {
	Person     // 匿名结构体嵌套
	StudentId  int
	SchoolName string
	Graduated  bool
	Hobbies    []string
	//panic: reflect.Value.Interface: cannot return value obtained from unexported field or method
	//hobbies    []string
	Label      map[string]string
}

func (s *Student) GoHome() {
	fmt.Printf("回家了,sid:%d\n", s.StudentId)
}

//func (s Student) GoHome() {
//	fmt.Printf("回家了,sid:%d\n", s.StudentId)
//}

func (s Student) GotoSchool() {
	fmt.Printf("上学了,sid:%d\n", s.StudentId)
}

func (s *Student) graduated() {
	fmt.Printf("毕业了,sid:%d\n", s.StudentId)
}

//func (s Student) Ggraduated() {
//	fmt.Printf("毕业了,sid:%d\n", s.StudentId)
//}

func reflectProbeStruct(s interface{}) {
	// 获取目标对象
	t := reflect.TypeOf(s)
	fmt.Printf("对象的类型名称 %s\n", t.Name())
	// 获取目标对象的值类型
	v := reflect.ValueOf(s)
	// 遍历获取成员变量
	for i := 0; i < t.NumField(); i++ {
		// Field 代表对象的字段名
		key := t.Field(i)
		value := v.Field(i).Interface()
		// 字段
		if key.Anonymous {
			fmt.Printf("匿名字段 第 %d 个字段，字段名 %s, 字段类型 %v, 字段的值 %v\n", i+1, key.Name, key.Type, value)
		} else {
			fmt.Printf("命名字段 第 %d 个字段，字段名 %s, 字段类型 %v, 字段的值 %v\n", i+1, key.Name, key.Type, value)
		}
	}
	// 打印方法
	for i := 0; i < t.NumMethod(); i++ {
		m := t.Method(i)
		fmt.Printf("第 %d 个方法，方法名 %s, 方法类型 %v\n", i+1, m.Name, m.Type)
	}
}

func main() {
	s := Student{
		Person: Person{
			"geek",
			24,
		},
		StudentId:  123,
		SchoolName: "Beijing University",
		Graduated:  true,
		Hobbies:    []string{"唱", "跳", "Rap"},
		//hobbies:    []string{"唱", "跳", "Rap"},
		Label:      map[string]string{"k1": "v1", "k2": "v2"},
	}
	p := Person{
		Name: "张三",
		Age:  100,
	}
	reflectProbeStruct(s)
	reflectProbeStruct(p)
	/*
	对象的类型名称 Student
	匿名字段 第 1 个字段，字段名 Person, 字段类型 main.Person, 字段的值 {geek 24}
	命名字段 第 2 个字段，字段名 StudentId, 字段类型 int, 字段的值 123
	命名字段 第 3 个字段，字段名 SchoolName, 字段类型 string, 字段的值 Beijing University
	命名字段 第 4 个字段，字段名 Graduated, 字段类型 bool, 字段的值 true
	命名字段 第 5 个字段，字段名 Hobbies, 字段类型 []string, 字段的值 [唱 跳 Rap]
	命名字段 第 6 个字段，字段名 Label, 字段类型 map[string]string, 字段的值 map[k1:v1 k2:v2]
	第 1 个方法，方法名 GotoSchool, 方法类型 func(main.Student)
	对象的类型名称 Person
	命名字段 第 1 个字段，字段名 Name, 字段类型 string, 字段的值 张三
	命名字段 第 2 个字段，字段名 Age, 字段类型 int, 字段的值 100
	 */
}
```

## 3、结构体标签和反射
- json的标签解析出json
- yaml的标签解析出yaml
- xorm、gorm的标签标识数据库db字段
- 自定义标签
- 原理是t.Field.Tag.Lookup("标签名")

示例

```go
package main

import (
	"encoding/json"
	"fmt"
	"gopkg.in/yaml.v2"
	"io/ioutil"
)

type Person struct {
	Name string `json:"name" yaml:"yaml_name"`
	Age  int    `json:"age" yaml:"yaml_age"`
	City string `json:"city" yaml:"yaml_city"`
	//City string `json:"-" yaml:"yaml_city"` // 忽略json:"-"
}

// json解析
func jsonWork() {
	// 对象Marshal成字符串
	p := Person{
		Name: "geek",
		Age:  24,
		City: "Beijing",
	}
	data, err := json.Marshal(p)
	if err != nil {
		fmt.Printf("json.marshal.err: %v\n", err)
	}
	fmt.Printf("person.marshal.res: %v\n", string(data))

	// 从字符串解析成结构体
	p2str := `{
	"name": "张三",
	"age": 38,
	"city": "山东"
	}`
	var p2 Person
	err = json.Unmarshal([]byte(p2str), &p2)
	if err != nil {
		fmt.Printf("json.unmarshal.err: %v\n", err)
		return
	}
	fmt.Printf("person.unmarshal.res: %v\n", p2)
}

// yaml解析
func yamlWork() {
	filename := "a.yaml"
	content, err := ioutil.ReadFile(filename)
	if err != nil {
		fmt.Printf("ioutil.ReadFile.err: %v\n", err)
		return
	}
	p := &Person{}
	//err = yaml.Unmarshal([]byte(content), p)
	err = yaml.UnmarshalStrict([]byte(content), p)  // 解析严格，考虑多余字段，忽略字段等
	if err != nil {
		fmt.Printf("yaml.UnmarshalStrict.err: %v\n", err)
		return
	}
	fmt.Printf("yaml.UnmarshalStrict.res: %v\n", p)
}

func main() {
	jsonWork()
	/*
		person.marshal.res: {"name":"geek","age":24,"city":"Beijing"}
		person.unmarshal.res: {张三 38 山东}
	*/
	yamlWork()
	/*
		yaml.UnmarshalStrict.res: &{李四 18 Shanghai}
	 */
}
```

解析的yaml内容
```yaml
yaml_name: 李四
yaml_age: 18
yaml_city: Shanghai
```

- 自定义标签格式解析

```go
package main

import (
	"fmt"
	"reflect"
)

type Person struct {
	Name string `aa:"name"`
	Age  int    `aa:"age"`
	City string `aa:"city"`
}

// CustomParse 自定义解析
func CustomParse(s interface{}) {
	// TypeOf type类型
	r:=reflect.TypeOf(s)
	value := reflect.ValueOf(s)
	for i:=0;i<r.NumField();i++{
		field:=r.Field(i)
		key:=field.Name
		if tag, ok:=field.Tag.Lookup("aa");ok{
			if tag == "-"{
				continue
			}
			fmt.Printf("找到了aa标签, key: %v, value: %v, tag: %s\n", key, value.Field(i), tag)
		}
	}
}

func main() {
	p := Person{
		Name: "geek",
		Age:  24,
		City: "Beijing",
	}
	CustomParse(p)
	/*
	找到了aa标签, key: Name, value: geek, tag: name
	找到了aa标签, key: Age, value: 24, tag: age
	找到了aa标签, key: City, value: Beijing, tag: city
	 */
}
```

## 4、反射调用函数

```go
valueFunc := reflect.ValueOf(Add) //函数也是一种数据类型
typeFunc := reflect.TypeOf(Add)
argNum := typeFunc.NumIn()            //函数输入参数的个数
args := make([]reflect.Value, argNum) //准备函数的输入参数
for i := 0; i < argNum; i++ {
	if typeFunc.In(i).Kind() == reflect.Int {
		args[i] = reflect.ValueOf(3) //给每一个参数都赋3
	}
}
sumValue := valueFunc.Call(args) //返回[]reflect.Value，因为go语言的函数返回可能是一个列表
if typeFunc.Out(0).Kind() == reflect.Int {
	sum := sumValue[0].Interface().(int) //从Value转为原始数据类型
	fmt.Printf("sum=%d\n", sum)
}
```

## 5、反射调用方法

示例

```go
user := User{
	Id:     7,
	Name:   "杰克逊",
	Weight: 65.5,
	Height: 1.68,
}
valueUser := reflect.ValueOf(&user)              //必须传指针，因为BMI()在定义的时候它是指针的方法
bmiMethod := valueUser.MethodByName("BMI")       //MethodByName()通过Name返回类的成员变量
resultValue := bmiMethod.Call([]reflect.Value{}) //无参数时传一个空的切片
result := resultValue[0].Interface().(float32)
fmt.Printf("bmi=%.2f\n", result)

//Think()在定义的时候用的不是指针，valueUser可以用指针也可以不用指针
thinkMethod := valueUser.MethodByName("Think")
thinkMethod.Call([]reflect.Value{})

valueUser2 := reflect.ValueOf(user)
thinkMethod = valueUser2.MethodByName("Think")
thinkMethod.Call([]reflect.Value{})
```

过程
- 首先通过reflect.ValueOf(p1) 获取得到反射类型对象
- reflect.ValueOf(p1).MethodByName需 要传入准确的方法名称（名称不对会panic: reflect: call of reflect.Value.Call on zero Value），MethodByName代表注册
- []reflect.Value 这是最终需要调用方法的参数，无参数传空切片
- call调用

```go
package main

import (
	"fmt"
	"reflect"
)

type Person struct {
	Name   string
	Age    int
	Gender string
}

func (p Person) ReflectCallFuncWithArgs(name string, age int) {
	fmt.Printf("调用的是带参数的方法, args.name: %s, args.age: %d, p.name: %s, p.age: %d\n",
		name,
		age,
		p.Name,
		p.Age,
	)
}

func (p Person) ReflectCallFuncWithNoArgs() {
	fmt.Printf("调用的是不带参数的方法\n")
}

func main() {
	p1 := Person{
		Name:   "geek",
		Age:    24,
		Gender: "男",
	}
	// 1.首先通过reflect.ValueOf(p1)获取得到反射值类型
	getValue := reflect.ValueOf(p1)
	// 2.带参数的方法调用
	methodValue1 := getValue.MethodByName("ReflectCallFuncWithArgs")
	// 参数是reflect.Value的切片
	args1 := []reflect.Value{reflect.ValueOf("张三"), reflect.ValueOf(30)}
	methodValue1.Call(args1)
	// 3.不带参数的方法调用
	methodValue2 := getValue.MethodByName("ReflectCallFuncWithNoArgs")
	// 参数是reflect.Value的切片
	args2 := make([]reflect.Value, 0)
	methodValue2.Call(args2)
	/*
	调用的是带参数的方法, args.name: 张三, args.age: 30, p.name: geek, p.age: 24
	调用的是不带参数的方法
	 */
}
```

## 6、反射创建值

### 6.1 反射创建struct

```go
t := reflect.TypeOf(User{})
value := reflect.New(t) //根据reflect.Type创建一个对象，得到该对象的指针，再根据指针提到reflect.Value
value.Elem().FieldByName("Id").SetInt(10)
value.Elem().FieldByName("Name").SetString("宋江")
value.Elem().FieldByName("Weight").SetFloat(78.)
value.Elem().FieldByName("Height").SetFloat(168.4)
user := value.Interface().(*User) //把反射类型转成go原始数据类型
fmt.Printf("id=%d name=%s weight=%.1f height=%.1f\n", user.Id, user.Name, user.Weight, user.Height)
```

### 6.2 反射创建slice

```go
var slice []User
sliceType := reflect.TypeOf(slice)
sliceValue := reflect.MakeSlice(sliceType, 1, 3) //reflect.MakeMap、reflect.MakeSlice、reflect.MakeChan、reflect.MakeFunc
sliceValue.Index(0).Set(reflect.ValueOf(User{
	Id:     8,
	Name:   "李达",
	Weight: 80,
	Height: 180,
}))
users := sliceValue.Interface().([]User)
fmt.Printf("1st user name %s\n", users[0].Name)
```

### 6.3 反射创建map

```go
var userMap map[int]*User
mapType := reflect.TypeOf(userMap)
// mapValue:=reflect.MakeMap(mapType)
mapValue := reflect.MakeMapWithSize(mapType, 10) //reflect.MakeMap、reflect.MakeSlice、reflect.MakeChan、reflect.MakeFunc

user := &common.User{
	Id:     7,
	Name:   "杰克逊",
	Weight: 65.5,
	Height: 1.68,
}
key := reflect.ValueOf(user.Id)
mapValue.SetMapIndex(key, reflect.ValueOf(user))                    //SetMapIndex 往map里添加一个key-value对
mapValue.MapIndex(key).Elem().FieldByName("Name").SetString("令狐一刀") //MapIndex 根据Key取出对应的map
userMap = mapValue.Interface().(map[int]*User)
fmt.Printf("user name %s %s\n", userMap[7].Name, user.Name)
```

## 7、反射修改值

反射修改值要求必须是指针类型

修改值的操作：pointer.Elem().Setxxx()

```go
package main

import (
	"fmt"
	"reflect"
)

func main() {
	var num float64 = 3.14
	fmt.Printf("原始值 %f\n", num)
	// 通过reflect.ValueOf获取num中的value，必须是指针才可以修改值
	//pointer := reflect.ValueOf(num)  // 直接传值会panic
	pointer := reflect.ValueOf(&num)
	newValue := pointer.Elem()
	// 赋新的值
	newValue.SetFloat(5.66)
	fmt.Printf("新的值 %f\n", num)
}
```

### 7.1 反射修改struct

```go
user := User{
	Id:     7,
	Name:   "杰克逊",
	Weight: 65.5,
	Height: 1.68,
}
valueUser := reflect.ValueOf(&user)
// valueS.Elem().SetInt(8)//会panic
valueUser.Elem().FieldByName("Weight").SetFloat(68.0) //FieldByName()通过Name返回类的成员变量。不能在指针Value上调用FieldByName
addrValue := valueUser.Elem().FieldByName("addr")
if addrValue.CanSet() {
	addrValue.SetString("北京")
} else {
	fmt.Println("addr是未导出成员，不可Set") //以小写字母开头的成员相当于是私有成员
}
```

### 7.2 反射修改slice

下面示例，间接的实现了append功能

```go
users := make([]*User, 1, 5) //len=1，cap=5

sliceValue := reflect.ValueOf(&users) //准备通过Value修改users，所以传users的地址
if sliceValue.Elem().Len() > 0 {      //取得slice的长度
	sliceValue.Elem().Index(0).Elem().FieldByName("Name").SetString("哈哈哈")
	// u0 := users[0]
	fmt.Printf("1st user name change to %s\n", users[0].Name)
}

sliceValue.Elem().SetCap(3) //新的cap必须位于原始的len到cap之间
sliceValue.Elem().SetLen(2)
//调用reflect.Value的Set()函数修改其底层指向的原始数据
sliceValue.Elem().Index(1).Set(reflect.ValueOf(&User{
	Id:     8,
	Name:   "geek",
	Weight: 80,
	Height: 180,
}))
fmt.Printf("2nd user name %s\n", users[1].Name)
```

### 7.3 反射修改map

```go
u1 := &User{
	Id:     7,
	Name:   "杰克逊",
	Weight: 65.5,
	Height: 1.68,
}
u2 := &User{
	Id:     8,
	Name:   "杰克逊",
	Weight: 65.5,
	Height: 1.68,
}
userMap := make(map[int]*User, 5)
userMap[u1.Id] = u1

mapValue := reflect.ValueOf(&userMap)                                                         //准备通过Value修改userMap，所以传userMap的地址
mapValue.Elem().SetMapIndex(reflect.ValueOf(u2.Id), reflect.ValueOf(u2))                      //SetMapIndex 往map里添加一个key-value对
mapValue.Elem().MapIndex(reflect.ValueOf(u1.Id)).Elem().FieldByName("Name").SetString("令狐一刀") //MapIndex 根据Key取出对应的map
for k, user := range userMap {
	fmt.Printf("key %d name %s\n", k, user.Name)
}
```