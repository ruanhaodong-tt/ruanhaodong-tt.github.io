# 资源分享站

这是一个基于GitHub Pages的资源分享站，用于分享各种类型的文件资源。

## 项目介绍

该资源分享站是一个静态网站，使用HTML、CSS和JavaScript开发，通过GitHub Pages免费托管。网站提供了一个简洁美观的界面，用于展示和分享各种资源文件。

## 功能特性

- 📁 支持多种类型的资源文件展示
- 🎨 响应式设计，适配不同设备屏幕
- ⬇️ 提供资源下载功能
- 📱 移动端友好的界面
- 🔍 简单直观的资源分类展示

## 技术栈

- **HTML5** - 页面结构
- **CSS3** - 样式设计
- **JavaScript** - 交互功能
- **GitHub Pages** - 网站托管

## 如何使用

### 查看网站

直接访问 GitHub Pages 网址：https://ruanhaodong-tt.github.io

### 本地开发

1. 克隆仓库
   ```bash
   git clone https://github.com/ruanhaodong-tt/ruanhaodong-tt.github.io.git
   cd ruanhaodong-tt.github.io
   ```

2. 在浏览器中打开 `index.html` 文件即可查看网站

## 项目结构

```
.
├── index.html          # 主页
├── style.css           # 样式文件
├── script.js           # JavaScript文件
└── README.md           # 项目说明文档
```

## 自定义配置

### 添加新资源

在 `script.js` 文件中，找到 `resources` 数组，添加新的资源对象即可：

```javascript
const resources = [
    {
        id: 1,
        name: "资源名称",
        description: "资源描述",
        size: "文件大小",
        format: "文件格式",
        downloadUrl: "下载链接"
    },
    // 添加更多资源...
];
```

### 修改样式

可以在 `style.css` 文件中修改网站的样式，包括颜色、字体、布局等。

## 部署说明

该网站通过 GitHub Pages 自动部署，只需将更改推送到 `main` 分支，GitHub Pages 会自动更新网站内容。

## 许可证

MIT License

## 作者

阮浩东
