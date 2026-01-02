$ErrorActionPreference = "Stop"

$sharedFilesPath = "C:\Users\Administrator\Desktop\github\zyfx\shared-files"
$scriptJsPath = "C:\Users\Administrator\Desktop\github\zyfx\script.js"

if (-not (Test-Path $sharedFilesPath)) {
    Write-Host "Error: shared-files directory not found - $sharedFilesPath" -ForegroundColor Red
    exit 1
}

Write-Host "Scanning shared-files directory..." -ForegroundColor Cyan

$files = Get-ChildItem -Path $sharedFilesPath -File | Where-Object {
    $_.Name -notin @('.gitignore', 'README.md', '.DS_Store')
}

if ($files.Count -eq 0) {
    Write-Host "Warning: No files found" -ForegroundColor Yellow
    exit 0
}

Write-Host "`nFound $($files.Count) files:" -ForegroundColor Green

$resourcesArray = @()

foreach ($file in $files) {
    $fileSizeMB = [math]::Round($file.Length / 1MB, 2)
    $fileExtension = $file.Extension.ToUpper().Replace(".", "")
    $uploadDate = $file.LastWriteTime.ToString("yyyy-MM-dd")
    
    $resourcesArray += [PSCustomObject]@{
        Name = $file.Name
        Description = $file.BaseName
        Size = "$fileSizeMB MB"
        SizeBytes = $file.Length
        Format = $fileExtension
        UploadDate = $uploadDate
        DownloadUrl = "shared-files/$($file.Name)"
    }
    
    Write-Host "  - $($file.Name) ($fileSizeMB MB)" -ForegroundColor White
}

Write-Host "`nGenerating JavaScript resource array..." -ForegroundColor Yellow

$jsResources = "// Resource data - files in shared-files folder`n// Auto-generated on $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')`nconst resources = [`n"

foreach ($resource in $resourcesArray) {
    $jsResources += "    {`n"
    $jsResources += "        name: `"$($resource.Name)`",`n"
    $jsResources += "        description: `"$($resource.Description)`",`n"
    $jsResources += "        size: `"$($resource.Size)`",`n"
    $jsResources += "        sizeBytes: $($resource.SizeBytes),`n"
    $jsResources += "        format: `"$($resource.Format)`",`n"
    $jsResources += "        uploadDate: `"$($resource.UploadDate)`",`n"
    $jsResources += "        downloadUrl: `"$($resource.DownloadUrl)`"`n"
    $jsResources += "    },`n"
}

$jsResources = $jsResources.TrimEnd(",`n") + "`n];"

$scriptContent = Get-Content $scriptJsPath -Raw -Encoding UTF8

$pattern = 'const resources = \[(.*?)\];'
$newScriptContent = [regex]::Replace($scriptContent, $pattern, $jsResources, [System.Text.RegularExpressions.RegexOptions]::Singleline)

$newScriptContent | Out-File $scriptJsPath -Encoding UTF8 -NoNewline

Write-Host "script.js updated!" -ForegroundColor Green

Write-Host "`nScan complete!" -ForegroundColor Green
Write-Host "  - Files scanned: $($files.Count)" -ForegroundColor Cyan
Write-Host "  - Updated files: script.js" -ForegroundColor Cyan