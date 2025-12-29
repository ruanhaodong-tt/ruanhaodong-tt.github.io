// GitHub API 配置
// Token 已使用 Base64 编码进行简单加密
const GITHUB_CONFIG = {
    owner: 'ruanhaodong-tt',  // 你的 GitHub 用户名
    repo: 'ruanhaodong-tt.github.io',  // 仓库名
    path: 'download-counts.json',  // 文件路径
    token: localStorage.getItem('github_token') || atob('Z2l0aHViX3BhdF8xMUJLQUdRRkEwb3RYTUlOWlY0cGRfU2czRU5NSGFXZExiVEJWQTd6SjlyaEVQeVFuY0FqZFRpN2cyU3gxNHBKQkdQUUJDTlo4NVhpU2FJ')  // Base64 编码的 Token
};

// 解码 Token 的函数
function decodeToken(encoded) {
    try {
        return atob(encoded);
    } catch (error) {
        console.error('Token 解码失败:', error);
        return '';
    }
}

// 设置 Token 的函数（在浏览器控制台调用）
function setGitHubToken(token) {
    localStorage.setItem('github_token', token);
    GITHUB_CONFIG.token = token;
    console.log('GitHub Token 已设置');
}

// 资源数据 - shared-files 文件夹中的文件列表
// Resource data - files in shared-files folder
// Auto-generated on 2025-12-29 18:24:13
const resources = [
    {
        name: "mt管理器.apk",
        description: "mt管理器",
        size: "26.27 MB",
        sizeBytes: 27550837,
        format: "APK",
        uploadDate: "2025-12-27",
        downloadUrl: "shared-files/mt管理器.apk",
        downloadCount: 0
    },
    {
        name: "破解软件.apk",
        description: "破解软件",
        size: "6.36 MB",
        sizeBytes: 6665678,
        format: "APK",
        uploadDate: "2025-12-27",
        downloadUrl: "shared-files/破解软件.apk",
        downloadCount: 0
    }
];

// 从 GitHub API 加载下载次数（跨设备同步）
async function loadDownloadCounts() {
    if (!GITHUB_CONFIG.token) {
        console.log('未配置 GitHub Token，尝试从本地文件加载');
        loadDownloadCountsFromLocal();
        return;
    }

    try {
        const url = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${GITHUB_CONFIG.path}`;
        const response = await fetch(url, {
            headers: {
                'Authorization': `token ${GITHUB_CONFIG.token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            const counts = JSON.parse(atob(data.content));
            
            // 更新本地缓存
            localStorage.setItem('downloadCounts', JSON.stringify(counts));
            localStorage.setItem('downloadCountsTimestamp', Date.now());
            
            // 更新资源数据
            resources.forEach(resource => {
                if (counts[resource.name] !== undefined) {
                    resource.downloadCount = counts[resource.name];
                }
            });
            renderResources(resources);
            console.log('从 GitHub API 加载下载次数成功');
        } else {
            throw new Error('API 请求失败');
        }
    } catch (error) {
        console.log('从 GitHub API 加载失败，使用本地文件:', error.message);
        loadDownloadCountsFromLocal();
    }
}

// 从本地 JSON 文件加载下载次数（备用方案）
function loadDownloadCountsFromLocal() {
    fetch('download-counts.json?t=' + Date.now())  // 添加时间戳防止缓存
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('无法加载下载次数');
        })
        .then(counts => {
            resources.forEach(resource => {
                if (counts[resource.name] !== undefined) {
                    resource.downloadCount = counts[resource.name];
                }
            });
            renderResources(resources);
        })
        .catch(err => {
            console.log('使用初始下载次数:', err.message);
            renderResources(resources);
        });
}

// 通过 GitHub API 更新下载次数（跨设备同步）
async function updateDownloadCountViaAPI(resourceName, retryCount = 0) {
    if (!GITHUB_CONFIG.token) {
        console.log('未配置 GitHub Token，无法自动更新下载次数');
        return;
    }

    try {
        // 1. 获取当前文件的 SHA（使用 no-cache 确保获取最新版本）
        const url = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${GITHUB_CONFIG.path}?t=${Date.now()}`;
        const response = await fetch(url, {
            headers: {
                'Authorization': `token ${GITHUB_CONFIG.token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (!response.ok) {
            throw new Error('获取文件失败');
        }

        const data = await response.json();
        const sha = data.sha;
        const currentCounts = JSON.parse(atob(data.content));

        // 2. 更新下载次数（确保不存在则初始化为 0）
        if (currentCounts[resourceName] === undefined) {
            currentCounts[resourceName] = 0;
        }
        currentCounts[resourceName]++;
        
        // 3. 更新资源数据
        const resource = resources.find(r => r.name === resourceName);
        if (resource) {
            resource.downloadCount = currentCounts[resourceName];
            renderResources(resources);
        }

        // 4. 提交更新到 GitHub
        const updatedContent = btoa(unescape(encodeURIComponent(JSON.stringify(currentCounts, null, 2))));
        const updateUrl = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${GITHUB_CONFIG.path}`;
        
        const updateResponse = await fetch(updateUrl, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${GITHUB_CONFIG.token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/vnd.github.v3+json'
            },
            body: JSON.stringify({
                message: `Update download count for ${resourceName}`,
                content: updatedContent,
                sha: sha,
                branch: 'master'
            })
        });

        if (!updateResponse.ok) {
            const errorData = await updateResponse.json();
            
            // 如果是 409 冲突错误，重试
            if (updateResponse.status === 409 && retryCount < 5) {
                console.log(`文件冲突，第 ${retryCount + 1} 次重试...`);
                await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
                return updateDownloadCountViaAPI(resourceName, retryCount + 1);
            }
            
            throw new Error(`更新文件失败: ${errorData.message}`);
        }

        // 5. 更新本地缓存
        localStorage.setItem('downloadCounts', JSON.stringify(currentCounts));
        localStorage.setItem('downloadCountsTimestamp', Date.now());
        
        console.log('下载次数更新成功并已同步到 GitHub');
    } catch (error) {
        console.error('更新下载次数失败:', error.message);
    }
}

// 增加下载次数
function incrementDownloadCount(resourceName) {
    const resource = resources.find(r => r.name === resourceName);
    if (resource) {
        resource.downloadCount++;
        renderResources(resources);
        
        // 尝试通过 GitHub API 更新
        if (GITHUB_CONFIG.token) {
            updateDownloadCountViaAPI(resourceName);
        } else {
            console.log('未配置 GitHub Token，下载次数仅在本地更新');
        }
    }
}

// 定期刷新下载次数（每 30 秒）
function startDownloadCountRefresh() {
    setInterval(() => {
        if (GITHUB_CONFIG.token) {
            loadDownloadCounts();
        }
    }, 30000);  // 30 秒刷新一次
}
        renderResources(resources);
        
        // 尝试通过 GitHub API 更新
        if (GITHUB_CONFIG.token) {
            updateDownloadCountViaAPI(resourceName);
        } else {
            console.log('未配置 GitHub Token，下载次数仅在本地更新');
        }
    }
}

// DOM 加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 先渲染资源列表
    renderResources(resources);
    // 再加载下载次数
    loadDownloadCounts();
    initSearch();
    initFilter();
    initThemeToggle();
    initSorting();
    initBatchOperations();
    initPreviewModal();
    startDownloadCountRefresh();  // 启动定期刷新下载次数
});

// 备用复制方法
function fallbackCopyText(text, button) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showCopySuccess(button);
    } catch (err) {
        alert('复制失败，请手动复制链接');
    }
    
    document.body.removeChild(textArea);
}

// 显示复制成功提示
function showCopySuccess(button) {
    const originalText = button.textContent;
    button.textContent = '✓';
    button.style.background = 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)';
    
    setTimeout(function() {
        button.textContent = originalText;
        button.style.background = '';
    }, 2000);
}

// 预览模态框功能
function initPreviewModal() {
    const modal = document.getElementById('previewModal');
    const closeBtn = document.getElementById('closePreview');
    
    closeBtn.addEventListener('click', function() {
        modal.classList.remove('active');
    });
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
}

function showPreview(url, name) {
    const modal = document.getElementById('previewModal');
    const previewBody = document.getElementById('previewBody');
    const previewTitle = document.getElementById('previewTitle');
    
    previewTitle.textContent = name;
    
    const fileExt = name.split('.').pop().toUpperCase();
    
    if (['JPG', 'PNG', 'GIF', 'JPEG', 'WEBP'].includes(fileExt)) {
        previewBody.innerHTML = `<img src="${url}" alt="${name}" style="max-width: 100%; max-height: 500px; border-radius: 8px;" />`;
    } else if (fileExt === 'PDF') {
        previewBody.innerHTML = `<embed src="${url}" type="application/pdf" style="width: 100%; height: 500px; border-radius: 8px;" />`;
    } else if (fileExt === 'TXT') {
        // 尝试加载文本文件
        previewBody.innerHTML = '<div style="text-align: center; padding: 20px;">正在加载...</div>';
        fetch(url)
            .then(response => response.text())
            .then(text => {
                previewBody.innerHTML = `<pre style="white-space: pre-wrap; word-wrap: break-word; max-height: 500px; overflow-y: auto; padding: 15px; background: rgba(0,0,0,0.05); border-radius: 8px;">${escapeHtml(text)}</pre>`;
            })
            .catch(err => {
                previewBody.innerHTML = '<div style="text-align: center; padding: 20px;">无法预览此文件</div>';
            });
    } else {
        previewBody.innerHTML = '<div style="text-align: center; padding: 20px;">此文件类型不支持预览</div>';
    }
    
    modal.classList.add('active');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 批量操作功能
function initBatchOperations() {
    const selectAllCheckbox = document.getElementById('selectAllCheckbox');
    const selectAllBtn = document.getElementById('selectAllBtn');
    const deleteSelectedBtn = document.getElementById('deleteSelectedBtn');

    // 全选/取消全选（复选框）
    selectAllCheckbox.addEventListener('change', function() {
        const checkboxes = document.querySelectorAll('.resource-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = this.checked;
        });
        updateDeleteButton();
    });

    // 全选按钮
    selectAllBtn.addEventListener('click', function() {
        const checkboxes = document.querySelectorAll('.resource-checkbox');
        const allChecked = Array.from(checkboxes).every(cb => cb.checked);
        checkboxes.forEach(checkbox => {
            checkbox.checked = !allChecked;
        });
        selectAllCheckbox.checked = !allChecked;
        updateDeleteButton();
    });

    // 监听单个复选框变化
    document.addEventListener('change', function(e) {
        if (e.target.classList.contains('resource-checkbox')) {
            updateDeleteButton();
        }
    });

    // 删除选中按钮
    deleteSelectedBtn.addEventListener('click', function() {
        const selectedCheckboxes = document.querySelectorAll('.resource-checkbox:checked');
        const selectedNames = Array.from(selectedCheckboxes).map(cb => cb.dataset.name);

        if (selectedNames.length === 0) {
            alert('请先选择要删除的资源');
            return;
        }

        if (confirm(`确定要删除选中的 ${selectedNames.length} 个资源吗？\n\n${selectedNames.join('\n')}`)) {
            // 从资源数组中删除选中的资源
            const indexToDelete = [];
            resources.forEach((resource, index) => {
                if (selectedNames.includes(resource.name)) {
                    indexToDelete.push(index);
                }
            });

            // 从后往前删除，避免索引变化
            indexToDelete.reverse().forEach(index => {
                resources.splice(index, 1);
            });

            // 重新渲染
            applyFiltersAndSort(resources);

            // 重置全选复选框
            selectAllCheckbox.checked = false;
            updateDeleteButton();

            alert('删除成功！');
        }
    });
}

// 更新删除按钮显示状态
function updateDeleteButton() {
    const selectedCount = document.querySelectorAll('.resource-checkbox:checked').length;
    const deleteSelectedBtn = document.getElementById('deleteSelectedBtn');

    if (selectedCount > 0) {
        deleteSelectedBtn.style.display = 'inline-block';
        deleteSelectedBtn.textContent = `删除选中 (${selectedCount})`;
    } else {
        deleteSelectedBtn.style.display = 'none';
    }
}

// 排序功能
function initSorting() {
    const sortableHeaders = document.querySelectorAll('.sortable');
    let currentSort = { column: null, direction: 'asc' };

    sortableHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const sortType = this.dataset.sort;
            
            // 切换排序方向
            if (currentSort.column === sortType) {
                currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
            } else {
                currentSort.column = sortType;
                currentSort.direction = 'asc';
            }

            // 更新排序图标
            document.querySelectorAll('.sort-icon').forEach(icon => {
                icon.textContent = '↕';
            });
            this.querySelector('.sort-icon').textContent = currentSort.direction === 'asc' ? '↑' : '↓';

            // 执行排序
            let sortedResources = [...resources];
            
            if (sortType === 'size') {
                sortedResources.sort((a, b) => {
                    return currentSort.direction === 'asc' 
                        ? a.sizeBytes - b.sizeBytes 
                        : b.sizeBytes - a.sizeBytes;
                });
            } else if (sortType === 'date') {
                sortedResources.sort((a, b) => {
                    const dateA = new Date(a.uploadDate);
                    const dateB = new Date(b.uploadDate);
                    return currentSort.direction === 'asc' 
                        ? dateA - dateB 
                        : dateB - dateA;
                });
            }

            // 应用当前的搜索和筛选
            applyFiltersAndSort(sortedResources);
        });
    });
}

// 应用搜索、筛选和排序
function applyFiltersAndSort(baseResources) {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const selectedFormat = document.getElementById('formatFilter').value;

    let filteredResources = baseResources;

    // 应用搜索
    if (searchTerm) {
        filteredResources = filteredResources.filter(resource =>
            resource.name.toLowerCase().includes(searchTerm) ||
            resource.description.toLowerCase().includes(searchTerm)
        );
    }

    // 应用筛选
    if (selectedFormat !== 'all') {
        filteredResources = filteredResources.filter(resource => resource.format === selectedFormat);
    }

    renderResources(filteredResources);
}

// 搜索功能
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', function(e) {
        applyFiltersAndSort(resources);
    });
}

// 筛选功能
function initFilter() {
    const formatFilter = document.getElementById('formatFilter');
    formatFilter.addEventListener('change', function(e) {
        applyFiltersAndSort(resources);
    });
}

// 深色模式切换
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('.theme-icon');
    
    // 检查本地存储中的主题设置
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeIcon.textContent = '☀️';
    }
    
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        
        // 保存主题设置
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        
        // 更新图标
        themeIcon.textContent = isDarkMode ? '☀️' : '🌙';
    });
}

// 渲染资源列表
function renderResources(resources) {
    const resourcesContainer = document.getElementById('resources');
    const resourceCount = document.getElementById('resourceCount');

    // 清空容器
    resourcesContainer.innerHTML = '';

    // 更新资源数量统计
    resourceCount.textContent = `(${resources.length})`;

    // 如果没有资源，显示空状态
    if (resources.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td colspan="9" class="empty-state">暂无文件</td>
        `;
        resourcesContainer.appendChild(tr);
        return;
    }

    // 遍历资源并创建HTML
    resources.forEach(resource => {
        const resourceElement = createResourceElement(resource);
        resourcesContainer.appendChild(resourceElement);
    });
}

// 创建单个资源元素
function createResourceElement(resource) {
    const tr = document.createElement('tr');
    const icon = getFileIcon(resource.format);
    
    // 判断是否可以预览
    const canPreview = ['JPG', 'PNG', 'GIF', 'TXT', 'PDF'].includes(resource.format);
    const previewBtn = canPreview ? `<button class="preview-btn" data-url="${resource.downloadUrl}" data-name="${resource.name}" title="预览">👁️</button>` : '';
    
    tr.innerHTML = `
        <td class="checkbox-column" data-label="选择">
            <input type="checkbox" class="resource-checkbox" data-name="${resource.name}" />
        </td>
        <td class="icon-column" data-label="图标">${icon}</td>
        <td data-label="文件名">${resource.name}</td>
        <td data-label="描述">${resource.description}</td>
        <td data-label="大小">${resource.size}</td>
        <td data-label="格式">${resource.format}</td>
        <td data-label="上传时间">${resource.uploadDate}</td>
        <td data-label="下载次数">${resource.downloadCount}</td>
        <td data-label="操作">
            <a href="${resource.downloadUrl}" class="download-btn" download onclick="incrementDownloadCount('${resource.name}')">下载</a>
            ${previewBtn}
            <button class="copy-link-btn" data-url="${resource.downloadUrl}" title="复制链接">📋</button>
        </td>
    `;

    // 为复制按钮添加点击事件
    const copyBtn = tr.querySelector('.copy-link-btn');
    copyBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        const url = this.dataset.url;
        const fullUrl = window.location.origin + '/' + url;
        
        // 使用 Clipboard API 复制
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(fullUrl).then(function() {
                showCopySuccess(copyBtn);
            }).catch(function() {
                // 如果 Clipboard API 失败，使用备用方法
                fallbackCopyText(fullUrl, copyBtn);
            });
        } else {
            // 使用备用方法
            fallbackCopyText(fullUrl, copyBtn);
        }
    });

    // 为预览按钮添加点击事件
    const previewBtnEl = tr.querySelector('.preview-btn');
    if (previewBtnEl) {
        previewBtnEl.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            showPreview(this.dataset.url, this.dataset.name);
        });
    }

    return tr;
}

// 根据文件格式获取图标
function getFileIcon(format) {
    const icons = {
        'APK': '📱',
        'ZIP': '📦',
        'PDF': '📄',
        'EXE': '⚙️',
        'RAR': '📦',
        '7Z': '📦',
        'DOC': '📝',
        'DOCX': '📝',
        'XLS': '📊',
        'XLSX': '📊',
        'PPT': '📽️',
        'PPTX': '📽️',
        'JPG': '🖼️',
        'PNG': '🖼️',
        'GIF': '🖼️',
        'MP3': '🎵',
        'MP4': '🎬',
        'TXT': '📃'
    };
    return icons[format] || '📁';
}