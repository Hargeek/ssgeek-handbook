---
title: Markdown 语法指南
slug: markdown-guide
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

本文档通过左右对比的方式展示 Markdown 语法和实际效果。

## 基础语法

### 标题

<Tabs>
  <TabItem value="md" label="Markdown 语法">
    ```markdown
    # 一级标题
    ## 二级标题
    ### 三级标题
    #### 四级标题
    ##### 五级标题
    ###### 六级标题
    ```
  </TabItem>
  <TabItem value="preview" label="效果预览">
    # 一级标题
    ## 二级标题
    ### 三级标题
    #### 四级标题
    ##### 五级标题
    ###### 六级标题
  </TabItem>
</Tabs>

### 强调

<Tabs>
  <TabItem value="md" label="Markdown 语法">
    ```markdown
    *斜体文本*
    _斜体文本_

    **粗体文本**
    __粗体文本__

    ***粗斜体文本***
    ___粗斜体文本___

    ~~删除线文本~~
    ```
  </TabItem>
  <TabItem value="preview" label="效果预览">
    *斜体文本*
    _斜体文本_

    **粗体文本**
    __粗体文本__

    ***粗斜体文本***
    ___粗斜体文本___

    ~~删除线文本~~
  </TabItem>
</Tabs>

### 列表

<Tabs>
  <TabItem value="md" label="Markdown 语法">
    ```markdown
    - 项目 1
    - 项目 2
      - 子项目 2.1
      - 子项目 2.2
    - 项目 3

    1. 第一步
    2. 第二步
       1. 子步骤 2.1
       2. 子步骤 2.2
    3. 第三步

    - [x] 已完成任务
    - [ ] 未完成任务
    - [ ] 另一个未完成任务
    ```
  </TabItem>
  <TabItem value="preview" label="效果预览">
    - 项目 1
    - 项目 2
      - 子项目 2.1
      - 子项目 2.2
    - 项目 3

    1. 第一步
    2. 第二步
       1. 子步骤 2.1
       2. 子步骤 2.2
    3. 第三步

    - [x] 已完成任务
    - [ ] 未完成任务
    - [ ] 另一个未完成任务
  </TabItem>
</Tabs>

### 链接和图片

<Tabs>
  <TabItem value="md" label="Markdown 语法">
    ```markdown
    [链接文本](https://www.example.com)
    [带标题的链接](https://www.example.com "链接标题")

    ![替代文本](https://via.placeholder.com/150)
    ![带标题的图片](https://via.placeholder.com/150 "图片标题")
    ```
  </TabItem>
  <TabItem value="preview" label="效果预览">
    [链接文本](https://www.example.com)
    [带标题的链接](https://www.example.com "链接标题")

    ![替代文本](https://via.placeholder.com/150)
    ![带标题的图片](https://via.placeholder.com/150 "图片标题")
  </TabItem>
</Tabs>

### 引用

<Tabs>
  <TabItem value="md" label="Markdown 语法">
    ```markdown
    > 这是一段引用文本
    > 
    > 这是引用的第二段
    > > 这是嵌套引用
    ```
  </TabItem>
  <TabItem value="preview" label="效果预览">
    > 这是一段引用文本
    > 
    > 这是引用的第二段
    > > 这是嵌套引用
  </TabItem>
</Tabs>

### 代码

<Tabs>
  <TabItem value="md" label="Markdown 语法">
    使用 `code` 标记行内代码

    使用三个反引号创建代码块：
    ```markdown
    ~~~javascript
    const greeting = "Hello, World!";
    console.log(greeting);
    ~~~
    ```
  </TabItem>
  <TabItem value="preview" label="效果预览">
    使用 `code` 标记行内代码

    使用三个反引号创建代码块：

    ```javascript
    const greeting = "Hello, World!";
    console.log(greeting);
    // highlight-start
    console.log("This line is highlighted.");
    // highlight-end
    ```
  </TabItem>
</Tabs>

### 表格

<Tabs>
  <TabItem value="md" label="Markdown 语法">
    ```markdown
    | 表头 1 | 表头 2 | 表头 3 |
    |--------|--------|--------|
    | 单元格 1 | 单元格 2 | 单元格 3 |
    | 单元格 4 | 单元格 5 | 单元格 6 |
    ```
  </TabItem>
  <TabItem value="preview" label="效果预览">
    | 表头 1 | 表头 2 | 表头 3 |
    |--------|--------|--------|
    | 单元格 1 | 单元格 2 | 单元格 3 |
    | 单元格 4 | 单元格 5 | 单元格 6 |
  </TabItem>
</Tabs>

### Mermaid

<Tabs>
  <TabItem value="md" label="Markdown 语法">
    ```markdown
    graph TD;
        A-->B;
        A-->C;
        B-->D;
        C-->D;
    ```
  </TabItem>
  <TabItem value="preview" label="效果预览">
    ```mermaid
    graph TD;
        A-->B;
        A-->C;
        B-->D;
        C-->D;
    ```
  </TabItem>
</Tabs>

### 文章摘要

<Tabs>
  <TabItem value="md" label="Markdown 语法">
    ```markdown
    这是文章摘要
    <!--truncate-->
    这是文章正文
    ```
  </TabItem>
  <TabItem value="preview" label="效果预览">
    这是文章摘要
    <!--truncate-->
    这是文章正文
  </TabItem>
</Tabs>

### 提示框

<Tabs>
  <TabItem value="md" label="Markdown 语法">
    ```markdown
    :::note[备注]
    这是一个备注框
    :::

    :::tip 提示
    这是一个提示框
    :::

    :::info 信息
    这是一个信息框
    :::

    :::caution 警告
    这是一个警告框
    :::

    :::danger 危险
    这是一个危险框
    :::
    ```
  </TabItem>
  <TabItem value="preview" label="效果预览">
    :::note 备注
    这是一个备注框
    :::

    :::tip 提示
    这是一个提示框
    :::

    :::info 信息
    这是一个信息框
    :::

    :::caution 警告
    这是一个警告框
    :::

    :::danger 危险
    这是一个危险框
    :::
  </TabItem>
</Tabs>

## 最佳实践

1. 使用适当的标题层级
2. 保持列表格式一致
3. 为图片添加有意义的替代文本
4. 使用代码块时指定语言
5. 合理使用提示框和标签页
6. 保持文档结构清晰

## 注意事项

- Markdown 文件需要以 `.md` 或 `.mdx` 结尾
- 文件开头需要包含 frontmatter（使用 `---` 包裹）
- 图片建议使用相对路径
- 代码块建议指定语言以获得语法高亮
- 表格建议使用对齐语法
