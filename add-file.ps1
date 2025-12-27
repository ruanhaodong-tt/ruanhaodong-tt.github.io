# 添加分享文件脚本
# 使用方法：.\add-file.ps1 -FilePath "文件路径" [-Description "文件描述"]

param(
    [Parameter(Mandatory=$true)]
    [string]$FilePath,
    [Parameter(Mandatory=$false)]
    [string]$Description = ""
)

# 检查文件是否存在
if (-not (Test-Path $FilePath)) {
    Write-Host "错误：文件不存在 - $FilePath" -ForegroundColor Red
    exit 1
}

# 获取文件信息
$fileInfo = Get-Item $FilePath
$fileName = $fileInfo.Name
$fileExtension = $fileInfo.Extension.ToUpper().Replace(".", "")
$fileSizeMB = [math]::Round($fileInfo.Length / 1MB, 2)
$uploadDate = Get-Date -Format "yyyy-MM-dd"

# 如果没有提供描述，使用文件名作为默认描述
if ([string]::IsNullOrEmpty($Description)) {
    $Description = $fileInfo.BaseName
}

# 目标路径
$targetPath = "C:\Users\Administrator\shared-files\$fileName"
$projectPath = "C:\Users\Administrator\Desktop\github\zyfx"
$scriptJsPath = "$projectPath\script.js"

# 检查目标文件是否已存在
if (Test-Path $targetPath) {
    $overwrite = Read-Host "文件已存在，是否覆盖？(Y/N)"
    if ($overwrite -ne "Y" -and $overwrite -ne "y") {
        Write-Host "操作已取消" -ForegroundColor Yellow
        exit 0
    }
}

# 复制文件到 shared-files 文件夹
Copy-Item -Path $FilePath -Destination $targetPath -Force

Write-Host "文件已成功添加到共享文件夹！" -ForegroundColor Green
Write-Host "文件名: $fileName" -ForegroundColor Cyan
Write-Host "文件大小: $fileSizeMB MB" -ForegroundColor Cyan
Write-Host "目标路径: $targetPath" -ForegroundColor Cyan

# 更新 script.js 文件
Write-Host "`n正在更新 script.js 文件..." -ForegroundColor Yellow

# 读取 script.js 文件
$scriptContent = Get-Content $scriptJsPath -Raw -Encoding UTF8

# 生成新的资源对象
$newResource = @"
    {
        name: "$fileName",
        description: "$Description",
        size: "$fileSizeMB MB",
        sizeBytes: $($fileInfo.Length),
        format: "$fileExtension",
        uploadDate: "$uploadDate",
        downloadUrl: "shared-files/$fileName"
    },"@

# 查找 resources 数组的结束位置
$pattern = 'const resources = \[(.*?)\];'
$match = [regex]::Match($scriptContent, $pattern, [System.Text.RegularExpressions.RegexOptions]::Singleline)

if ($match.Success) {
    $arrayContent = $match.Groups[1].Value
    
    # 检查是否为空数组
    if ($arrayContent.Trim() -eq '') {
        # 空数组，直接添加新资源
        $newArrayContent = "`n    $newResource`n"
    } else {
        # 非空数组，在末尾添加新资源
        $newArrayContent = $arrayContent + "`n    $newResource"
    }
    
    # 替换数组内容
    $newScriptContent = $scriptContent -replace $pattern, "const resources = [$newArrayContent];"
    
    # 写回文件
    $newScriptContent | Out-File $scriptJsPath -Encoding UTF8 -NoNewline
    
    Write-Host "script.js 文件已更新！" -ForegroundColor Green
} else {
    Write-Host "警告：无法自动更新 script.js 文件，请手动添加资源信息" -ForegroundColor Yellow
    Write-Host "请在 script.js 的 resources 数组中添加以下内容：" -ForegroundColor Cyan
    Write-Host $newResource -ForegroundColor White
}

# 询问是否提交到 git
$commit = Read-Host "`n是否立即提交到 git？(Y/N)"
if ($commit -eq "Y" -or $commit -eq "y") {
    Set-Location $projectPath
    
    # 添加文件
    git add "shared-files\$fileName"
    git add "script.js"
    
    # 提交
    git commit -m "添加共享文件: $fileName"
    Write-Host "文件已提交到 git" -ForegroundColor Green

    $push = Read-Host "是否立即推送到 GitHub？(Y/N)"
    if ($push -eq "Y" -or $push -eq "y") {
        git push origin main:master
        Write-Host "文件已推送到 GitHub" -ForegroundColor Green
    }
}

Write-Host "`n完成！" -ForegroundColor Green