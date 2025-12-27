# GitHub Actions 配置指南

## 工作原理

使用 GitHub Actions + Issues API 实现安全的下载次数统计：

1. **前端**: 用户下载文件时，创建评论到 Issue #1 记录下载
2. **GitHub Actions**: 每6小时自动运行，统计 Issue 评论中的下载记录
3. **自动更新**: 将统计结果更新到 `download-counts.json` 文件

## 配置步骤

### 步骤 1: 创建 Issue

1. 访问你的仓库：https://github.com/ruanhaodong-tt/ruanhaodong-tt.github.io
2. 点击 **Issues** 标签
3. 点击 **New issue**
4. 标题填写: `下载统计记录`
5. 内容填写: `此 Issue 用于记录所有文件下载统计`
6. 点击 **Submit new issue**
7. 记下 Issue 编号（通常是 #1）

### 步骤 2: 更新配置

打开 `script.js` 文件，找到 `GITHUB_CONFIG` 对象：

```javascript
const GITHUB_CONFIG = {
    owner: 'ruanhaodong-tt',  // 你的 GitHub 用户名
    repo: 'ruanhaodong-tt.github.io',  // 仓库名
    path: 'download-counts.json',  // 文件路径
    issueNumber: 1  // Issue 编号，确认是正确的编号
};
```

确保 `issueNumber` 与你创建的 Issue 编号一致。

### 步骤 3: 启用 GitHub Actions

1. 访问仓库的 **Actions** 标签
2. 点击 **I understand my workflows, go ahead and enable them**（如果需要）
3. 找到工作流 **Update Download Counts**
4. 点击 **Run workflow** 手动运行一次测试

### 步骤 4: 提交更改

```bash
cd C:\Users\Administrator\Desktop\github\zyfx
git add .
git commit -m "配置 GitHub Actions 自动统计下载次数"
git push origin main:master
```

## 工作流程

### 用户下载时
```
用户点击下载 → 前端记录到 Issue #1 → 本地显示下载次数+1
```

### GitHub Actions 运行时（每6小时）
```
触发 Actions → 读取 Issue 评论 → 统计下载次数 → 更新 JSON 文件 → 提交到仓库
```

## 手动触发 GitHub Actions

如果需要立即更新下载次数：

1. 访问仓库的 **Actions** 标签
2. 找到 **Update Download Counts** 工作流
3. 点击右侧的 **Run workflow**
4. 选择分支（master）
5. 点击 **Run workflow** 按钮

## 查看下载记录

### 查看 Issue 评论
1. 访问 Issue #1
2. 查看所有下载记录评论

### 查看 JSON 文件
1. 访问 `download-counts.json` 文件
2. 查看最新的下载次数统计

## 优势

✅ **安全**: 不需要暴露 GitHub Token
✅ **免费**: 完全使用 GitHub 免费功能
✅ **自动**: 每6小时自动更新
✅ **可追溯**: 所有下载记录保存在 Issue 中
✅ **无需后端**: 纯前端实现

## 注意事项

1. **Issue 编号**: 确保 `issueNumber` 配置正确
2. **运行频率**: 默认每6小时运行一次，可修改 `.github/workflows/update-download-counts.yml` 中的 cron 表达式
3. **评论清理**: Issue 评论会不断增长，建议定期清理旧评论
4. **API 限制**: GitHub API 有速率限制，但 Actions 使用 GITHUB_TOKEN 不受限制

## 修改运行频率

编辑 `.github/workflows/update-download-counts.yml`:

```yaml
schedule:
  - cron: '0 */6 * * *'  # 每6小时
```

常用 cron 表达式：
- `0 */1 * * *` - 每小时
- `0 */6 * * *` - 每6小时
- `0 */12 * * *` - 每12小时
- `0 0 * * *` - 每天

## 故障排除

### 问题 1: Actions 运行失败
- 检查 Issue 是否存在
- 确认 Issue 编号是否正确
- 查看 Actions 日志获取详细错误

### 问题 2: 下载次数未更新
- 等待下一次 Actions 运行（最多6小时）
- 手动触发 Actions
- 检查 Issue 中是否有下载记录

### 问题 3: JSON 文件未更新
- 检查 Actions 是否成功运行
- 查看 Actions 日志
- 确认仓库有写入权限

## 监控和日志

### 查看 Actions 日志
1. 访问仓库的 **Actions** 标签
2. 点击具体的工作流运行
3. 查看每个步骤的详细日志

### 查看下载趋势
通过查看 Issue 的评论时间线，可以了解下载趋势。