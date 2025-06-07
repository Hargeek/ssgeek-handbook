---
slug: blog/golang-yu-san-lie-suan-fa/
title: Golang与散列算法
tags: [Golang]
date: 2021-12-17
---
<!--truncate-->

![golang](/img/golang.png)

散列是信息的提炼，通常其长度要比信息小得多，且为一个固定长度。加密性强的散列一定是不可逆的，这就意味着通过散列结果，无法推出任何部分的原始信息。任何输入信息的变化，哪怕仅一位，都将导致散列结果的明显变化，这称之为雪崩效应。散列还应该是防冲突的，即找不出具有相同散列结果的两条信息。具有这些特性的散列结果就可以用于验证信息是否被修改。常用于保证数据完整性

单向散列函数一般用于产生消息摘要，密钥加密等，常见的有
+ MD5(Message Digest Algorithm 5)：是`RSA`数据安全公司开发的一种单向散列算法
+ SHA(Secure Hash Algorithm)：可以对任意长度的数据运算生成一个`160`位的数值

## 1、哈希函数的基本特征

哈希函数不是加密算法，其特征为单向性和唯一性

具体如下

- 输入可以是任意长度
- 输出是固定长度
- 根据输入很容易计算出输出
- 根据输出很难计算出输入（几乎不可能）
- 两个不同的输入几乎不可能得到相同的输出

## 2、SHA-1

> https://golang.google.cn/pkg/crypto/sha1/

在`1993`年，安全散列算法（SHA）由美国国家标准和技术协会(NIST)提出，并作为联邦信息处理标准（FIPS PUB 180）公布；`1995`年又发布了一个修订版`FIPS PUB 180-1`，通常称之为`SHA-1`。`SHA-1`是基于`MD4`算法的，并且它的设计在很大程度上是模仿`MD4`的。现在已成为公认的最安全的散列算法之一，并被广泛使用

`SHA-1`是一种数据加密算法，该算法的思想是接收一段明文，然后以一种不可逆的方式将它转换成一段（通常更小）密文，也可以简单的理解为取一串输入码（称为预映射或信息），并把它们转化为长度较短、位数固定的输出序列即散列值（也称为信息摘要或信息认证代码）的过程
该算法输入报文的最大长度不超过`264`位，产生的输出是一个`160`位的报文摘要。输入是按`512`位的分组进行处理的。`SHA-1`是不可逆的、防冲突，并具有良好的雪崩效应

`sha1`是`SHA`家族的五个算法之一(其它四个是`SHA-224`、`SHA-256`、`SHA-384`，和`SHA-512`)

`SHA（Secure Hash Algorithm）`安全散列算法，是一系列密码散列函数，有多个不同安全等级的版本：`SHA-1，SHA-224，SHA-256，SHA-384，SHA-512`

防伪装，防窜扰，保证信息的合法性和完整性

算法流程：
- 填充，使得数据长度对`512`求余的结果为`448`

- 在信息摘要后面附加`64bit`，表示原始信息摘要的长度

- 初始化`h0`到`h4`，每个`h`都是`32`位

- `h0`到`h4`历经`80`轮复杂的变换

- 把`h0`到`h4`拼接起来，构成`160`位，返回

常用函数
- New：创建Hash对象用于计算字节/字符`sha1`值
- Sum：计算字节切片`sha1`值

```go
package main

import (
	"crypto/sha1"
	"fmt"
)

func main() {
	data := []byte("This page intentionally left blank.")
	fmt.Printf("%x\n", sha1.Sum(data))
}
```

`sha256`、`sha512`同理

使用示例

```go
package main

import (
	"crypto/sha1"
	"fmt"
	"io"
)
// sha1散列算法
func sha1Hash(msg string) (hashData []byte) {
	h := sha1.New()
	io.WriteString(h, msg)
	hashData = h.Sum(nil)
	return
}

func main() {
	msg := "This is the message to hash!"
	// sha1
	sha1Data := sha1Hash(msg)
	fmt.Printf("SHA1: %x\n", sha1Data)
}
```

## 3、MD5

>https://golang.google.cn/pkg/crypto/md5/

`MD5`即`Message-Digest Algorithm 5`（信息-摘要算法5），用于确保信息传输完整一致。是计算机广泛使用的杂凑算法之一（又译摘要算法、哈希算法），主流编程语言普遍已有`MD5`实现。将数据（如汉字）运算为另一固定长度值，是杂凑算法的基础原理，`MD5`的前身有`MD2`、`MD3`和`MD4`

- 算法流程跟`SHA-1`大体相似

- `MD5`的输出是`128`位，比`SHA-1`短了`32`位

- `MD5`相对易受密码分析的攻击，运算速度比`SHA-1`快

常用函数
- New：创建`Hash`对象用于计算字节/字符`md5`值

- Sum：计算字节切片`md5`值

```go
import (
	"crypto/md5"
	"fmt"
)

func main() {
    // 最基础的使用方式: Sum 返回数据的MD5校验和
	fmt.Printf("%x\n", md5.Sum([]byte("测试数据")))
}
```

### 3.1 基本使用-直接计算

```go
package main

import (
	"crypto/md5"
	"encoding/hex"
	"fmt"
)

func main() {
	// 结果是byte类型的数组
	bytes := md5.Sum([]byte("i am geek"))
	// 转换为32位小写
	fmt.Printf("%x\n", bytes)  // 397f77c74db1e25084653531a8046f21
	// 转换为字符串
	x := fmt.Sprintf("%x\n", bytes)
	fmt.Println(x)  // 397f77c74db1e25084653531a8046f21
	fmt.Println(hex.EncodeToString(bytes[:]))  // 397f77c74db1e25084653531a8046f21
}
```

### 3.2 大量数据-散列计算

```go
package main

import (
	"crypto/md5"
	"fmt"
)

func main() {
	// 较大时，分开批量计算
	m := md5.New()
	m.Write([]byte("i am"))
	m.Write([]byte(" geek"))
	fmt.Printf("%x\n", m.Sum(nil))  // 397f77c74db1e25084653531a8046f21
}
```

## 4、SHA-1与MD5的比较

因为二者均由`MD4`导出，`SHA-1`和`MD5`彼此很相似。相应的，他们的强度和其他特性也是相似，但还有以下几点不同：

+ 对强行供给的安全性：最显著和最重要的区别是`SHA-1`摘要比`MD5`摘要长`32`位。使用强行技术，产生任何一个报文使其摘要等于给定报摘要的难度对`MD5`是`2128`数量级的操作，而对`SHA-1`则是`2160`数量级的操作。这样，`SHA-1`对强行攻击有更大的强度。
+ 对密码分析的安全性：由于`MD5`的设计，易受密码分析的攻击，`SHA-1`显得不易受这样的攻击。
+ 速度：在相同的硬件上，`SHA-1`的运行速度比`MD5`慢

## 5、Hmac

> https://golang.google.cn/pkg/crypto/hmac/

`Hmac`算法也是一种哈希算法，它可以利用`MD5`或`SHA1`等哈希算法。不同的是，`Hmac`还需要一个密钥, 只要密钥发生了变化，那么同样的输入数据也会得到不同的签名，因此，可以把`Hmac`理解为用随机数“增强”的哈希算法

常用函数
- New：创建`Hash`对象用于计算字节/字符`hmac`值
- Equal：比较`hmac`值是否相等

`Hs256`实现

```go
package main

import (
	"crypto/hmac"
	"crypto/sha256"
	"fmt"
	"io"
)

func main()  {
	key := []byte("1234567890abcdefg")
	// 创建hmac hash对象
	hash := hmac.New(sha256.New, key)
	// 写入字符串计算散列
	io.WriteString(hash, "hi,geek")
	// 计算hmac散列
	fmt.Printf("%x\n", hash.Sum(nil))  // 89fda53d5e71e8c87adb15f8bf11c2c931af019a5c040321e243b82a3bb45ee5

	hash2 := hmac.New(sha256.New, key)
	hash2.Write([]byte("hi,geek"))

	fmt.Println(hmac.Equal(hash2.Sum(nil), hash.Sum(nil)))  // true
}
```

使用示例

```go
package main

import (
	"crypto/hmac"
	"fmt"
	"io"
)

// 使用sha1的Hmac散列算法
func hmacHash(msg string, key string) (hashData []byte) {
	k := []byte(key)
	mac := hmac.New(sha1.New, k)
	io.WriteString(mac, msg)
	hashData = mac.Sum(nil)
	return
}

func main() {
	msg := "This is the message to hash!"
	// hmac
	hmacData := hmacHash(msg, "The key string!")
	fmt.Printf("HMAC: %x\n", hmacData)
}
```

## 6、哈希函数的应用

- 用户密码的存储

- 文件上传/下载完整性校验

- mysql大字段的快速对比

- 数字签名（区块链，比特币）

示例代码

```go
package main

import (
	"crypto/md5"
	"crypto/sha1"
	"encoding/hex"
	"fmt"
)

func Sha1(data string) string {
	sha1 := sha1.New()
	sha1.Write([]byte(data))
	return hex.EncodeToString(sha1.Sum(nil))
}

func Md5(data string) string {
	md5 := md5.New()
	md5.Write([]byte(data))
	return hex.EncodeToString(md5.Sum(nil))
}

func main() {
	data := "abcdefg"
	fmt.Printf("SHA-1: %s\n", Sha1(data))
	fmt.Printf("MD5: %s\n", Md5(data))
}
```

一个实际的例子，用户名密码校验

密码校验则是一个很常见的问题, 当我们设计用户中心时，是一个必不可少的功能, 为了安全，我们都不会保存用户的明文密码, 最好的方式就是保存为`Hash`, 这样即使是数据泄露了，也不会导致用户的明文密码泄露(`hash`的过程是不可逆的)

示例需求如下

- 能校验密码

+ 用户可以修改密码
+ 修改密码时，禁止使用最近已经使用过的密码


```go
// NewHashedPassword 生产hash后的密码对象
func NewHashedPassword(password string) (*Password, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 10)
	if err != nil {
		return nil, err
	}

	return &Password{
		Password: string(bytes),
		CreateAt: ftime.Now().Timestamp(),
		UpdateAt: ftime.Now().Timestamp(),
	}, nil
}

type Password struct {
	// hash过后的密码
	Password string
	// 密码创建时间
	CreateAt int64
	// 密码更新时间
	UpdateAt int64
	// 密码需要被重置
	NeedReset bool
	// 需要重置的原因
	ResetReason string
	// 历史密码
	History []string
	// 是否过期
	IsExpired bool
}

// Update 更新密码
func (p *Password) Update(new *Password, maxHistory uint, needReset bool) {
	p.rotaryHistory(maxHistory)
	p.Password = new.Password
	p.NeedReset = needReset
	p.UpdateAt = ftime.Now().Timestamp()
	if !needReset {
		p.ResetReason = ""
	}
}

// IsHistory 检测是否是历史密码
func (p *Password) IsHistory(password string) bool {
	for _, pass := range p.History {
		err := bcrypt.CompareHashAndPassword([]byte(pass), []byte(password))
		if err == nil {
			return true
		}
	}

	return false
}

// HistoryCount 保存了几个历史密码
func (p *Password) HistoryCount() int {
	return len(p.History)
}

func (p *Password) rotaryHistory(maxHistory uint) {
	if uint(p.HistoryCount()) < maxHistory {
		p.History = append(p.History, p.Password)
	} else {
		remainHistry := p.History[:maxHistory]
		p.History = []string{p.Password}
		p.History = append(p.History, remainHistry...)
	}
}

// CheckPassword 判断password 是否正确
func (p *Password) CheckPassword(password string) error {
	err := bcrypt.CompareHashAndPassword([]byte(p.Password), []byte(password))
	if err != nil {
		return exception.NewUnauthorized("user or password not connrect")
	}
	return nil
}
```
