# 添加分享文件脚本
# 使用方法：.\add-file.ps1 -FilePath "文件路径"

param(
    [Parameter(Mandatory=$true)]
    [string]$FilePath
)

# 检查文件是否存在
if (-not (Test-Path $FilePath)) {
    Write-Host "错误：文件不存在 - $FilePath" -ForegroundColor Red
    exit 1
}

# 获取文件信息
$fileInfo = Get-Item $FilePath
$fileName = $fileInfo.Name
$targetPath = "C:\Users\Administrator\shared-files\$fileName"

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
Write-Host "文件大小: $([math]::Round($fileInfo.Length / 1MB, 2)) MB" -ForegroundColor Cyan
Write-Host "目标路径: $targetPath" -ForegroundColor Cyan

# 询问是否提交到 git
$commit = Read-Host "是否立即提交到 git？(Y/N)"
if ($commit -eq "Y" -or $commit -eq "y") {
    Set-Location "C:\Users\Administrator"
    git add "shared-files\$fileName"
    git commit -m "添加共享文件: $fileName"
    Write-Host "文件已提交到 git" -ForegroundColor Green

    $push = Read-Host "是否立即推送到 GitHub？(Y/N)"
    if ($push -eq "Y" -or $push -eq "y") {
        git push origin main:master
        Write-Host "文件已推送到 GitHub" -ForegroundColor Green
    }
}

Write-Host "完成！" -ForegroundColor Green