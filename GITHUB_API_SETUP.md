# GitHub API 配置指南

## 步骤 1: 创建 GitHub Personal Access Token

1. 登录 GitHub
2. 点击右上角头像 → Settings
3. 左侧菜单找到 "Developer settings"
4. 点击 "Personal access tokens" → "Tokens (classic)"
5. 点击 "Generate new token" → "Generate new token (classic)"

## 步骤 2: 配置 Token 权限

1. **Note**: 输入描述，例如 "资源分享站下载统计"
2. **Expiration**: 选择过期时间（建议选择 "No expiration" 或较长时间）
3. **勾选权限**:
   - ✅ `repo` (完整仓库访问权限)
   - ✅ `workflow` (如果需要)
4. 点击 "Generate token"

## 步骤 3: 复制 Token

⚠️ **重要**: Token 只显示一次，请立即复制保存！

## 步骤 4: 配置到 script.js

打开 `script.js` 文件，找到 `GITHUB_CONFIG` 对象：

```javascript
const GITHUB_CONFIG = {
    owner: 'ruanhaodong-tt',  // 你的 GitHub 用户名
    repo: 'ruanhaodong-tt.github.io',  // 仓库名
    path: 'download-counts.json',  // 文件路径
    token: 'YOUR_GITHUB_TOKEN_HERE'  // 在这里粘贴你的 Token
};
```

将复制的 Token 粘贴到 `token` 字段中。

## 步骤 5: 提交更改

```bash
git add script.js
git commit -m "配置 GitHub API Token"
git push origin main:master
```

## 安全注意事项

⚠️ **重要警告**:

1. **不要将 Token 提交到公开仓库**
   - Token 会暴露给所有访问网站的人
   - 任何人都可以使用你的 Token 操作仓库
   - 建议使用后端代理或环境变量

2. **更好的方案**:
   - 使用 GitHub Actions 自动更新
   - 使用后端服务器代理 API 请求
   - 使用第三方统计服务（如 Google Analytics）

3. **如果必须使用 Token**:
   - 使用最小权限原则（只给必要的权限）
   - 定期更换 Token
   - 设置 Token 过期时间
   - 监控 API 使用情况

## 测试配置

配置完成后：

1. 刷新网站页面
2. 点击任意文件的下载按钮
3. 检查浏览器控制台（F12）是否有错误
4. 查看仓库的 download-counts.json 文件是否自动更新

## 故障排除

### 问题 1: Token 无效
- 检查 Token 是否正确复制
- 确认 Token 是否过期
- 确认 Token 有正确的权限

### 问题 2: API 请求失败
- 检查网络连接
- 确认仓库名和用户名正确
- 查看浏览器控制台错误信息

### 问题 3: 文件未更新
- 检查 GitHub API 速率限制
- 确认 Token 有写入权限
- 查看仓库的提交历史

## 替代方案

如果担心 Token 安全问题，可以考虑：

1. **GitHub Actions**: 使用 GitHub Actions 自动更新
2. **第三方统计**: 使用 Google Analytics、百度统计等
3. **后端服务**: 使用 Firebase、Supabas 等后端服务
4. **手动更新**: 定期手动编辑 download-counts.json 文件