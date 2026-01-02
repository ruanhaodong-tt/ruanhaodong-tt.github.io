# 共享文件目录

这个文件夹用于存放网站分享的文件。

## 如何添加新文件

1. 将要分享的文件放入此文件夹
2. 在 `script.js` 文件中的 `resources` 数组中添加对应的资源信息

## 示例配置

```javascript
{
    id: 5,
    name: "你的文件名",
    description: "文件描述信息",
    size: "文件大小",
    format: "文件格式",
    downloadUrl: "shared-files/你的文件名.扩展名"
}
```

## 注意事项

- 确保文件名与配置中的 `downloadUrl` 路径一致
- 建议使用英文文件名，避免特殊字符
- 大文件建议压缩后上传