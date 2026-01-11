/**
 * 资源分享站 - 主要功能模块
 * 包含资源管理、搜索筛选、上传下载等核心功能
 */

// 工具函数模块
const Utils = {
    // 防抖函数
    debounce(func, wait) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                func.apply(context, args);
            }, wait);
        };
    },

    // 节流函数
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // 等待背景加载完成
    waitForBackgroundLoad() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        const mainContent = document.getElementById('mainContent');
        
        if (!loadingOverlay || !mainContent) {
            return;
        }
        
        // 创建一个图片对象来预加载背景
        const bgImage = new Image();
        bgImage.src = 'https://img.8845.top/acg';
        
        bgImage.onload = function() {
            // 背景加载完成，隐藏遮罩，显示内容
            setTimeout(function() {
                loadingOverlay.classList.add('hidden');
                mainContent.style.opacity = '1';
                mainContent.style.transition = 'opacity 0.5s ease';
            }, 500);
        };
        
        bgImage.onerror = function() {
            // 背景加载失败，仍然显示内容
            setTimeout(function() {
                loadingOverlay.classList.add('hidden');
                mainContent.style.opacity = '1';
                mainContent.style.transition = 'opacity 0.5s ease';
            }, 500);
        };
        
        // 设置超时，即使背景加载失败也显示内容（最多等待3秒）
        setTimeout(function() {
            if (!loadingOverlay.classList.contains('hidden')) {
                loadingOverlay.classList.add('hidden');
                mainContent.style.opacity = '1';
                mainContent.style.transition = 'opacity 0.5s ease';
            }
        }, 3000);
    },

    // 备用复制方法
    fallbackCopyText(text, button) {
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
            this.showCopySuccess(button);
        } catch (err) {
            alert('复制失败，请手动复制链接');
        }
        
        document.body.removeChild(textArea);
    },

    // 显示复制成功提示
    showCopySuccess(button) {
        const originalText = button.textContent;
        button.textContent = '✓';
        button.style.background = 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)';
        
        setTimeout(function() {
            button.textContent = '复制下载链接';
            button.style.background = '';
        }, 2000);
    },

    // 根据分类代码获取显示文本
    getCategoryText(category) {
        const categories = {
            'software': '软件',
            'document': '文档',
            'media': '媒体',
            'other': '其他'
        };
        return categories[category] || '未分类';
    },

    // 根据文件格式获取图标
    getFileIcon(format) {
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
};

// 资源数据模块
const ResourceData = {
    // 资源列表
    items: [
        {
            name: "ehviewer.apk",
            description: "ehviewer",
            size: "22.17 MB",
            sizeBytes: 23251511,
            format: "APK",
            category: "software",
            uploadDate: "2025-12-29",
            downloadUrl: "shared-files/ehviewer.apk"
        },
        {
            name: "mt管理器.apk",
            description: "mt管理器",
            size: "26.27 MB",
            sizeBytes: 27550837,
            format: "APK",
            category: "software",
            uploadDate: "2025-12-27",
            downloadUrl: "shared-files/mt管理器.apk"
        },
        {
            name: "破解软件.apk",
            description: "破解软件",
            size: "6.36 MB",
            sizeBytes: 6665678,
            format: "APK",
            category: "software",
            uploadDate: "2025-12-27",
            downloadUrl: "shared-files/破解软件.apk"
        }
    ],

    // 获取所有资源
    getAll() {
        return this.items;
    },

    // 根据名称删除资源
    deleteByName(name) {
        const index = this.items.findIndex(item => item.name === name);
        if (index > -1) {
            this.items.splice(index, 1);
            return true;
        }
        return false;
    },

    // 添加新资源
    add(resource) {
        this.items.push(resource);
        return true;
    }
};

// 资源渲染模块
const ResourceRenderer = {
    // 渲染资源列表
    render(resources) {
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
                <td colspan="8" class="empty-state">暂无文件</td>
            `;
            resourcesContainer.appendChild(tr);
            return;
        }

        // 遍历资源并创建HTML
        resources.forEach(resource => {
            const resourceElement = this.createResourceElement(resource);
            resourcesContainer.appendChild(resourceElement);
        });
    },

    // 创建单个资源元素
    createResourceElement(resource) {
        const tr = document.createElement('tr');
        
        // 判断是否可以预览
        const canPreview = ['JPG', 'PNG', 'GIF', 'TXT', 'PDF'].includes(resource.format);
        const previewBtn = canPreview ? `<button class="preview-btn" data-url="${resource.downloadUrl}" data-name="${resource.name}" title="预览">预览</button>` : '';
        
        // 获取分类显示文本
        const categoryText = Utils.getCategoryText(resource.category);
        
        tr.innerHTML = `
            <td class="checkbox-column" data-label="选择">
                <input type="checkbox" class="resource-checkbox" data-name="${resource.name}" />
            </td>
            <td data-label="文件名">${resource.name}</td>
            <td data-label="大小">${resource.size}</td>
            <td data-label="格式">${resource.format}</td>
            <td data-label="分类">${categoryText}</td>
            <td data-label="上传时间">${resource.uploadDate}</td>
            <td data-label="操作">
                <a href="${resource.downloadUrl}" class="download-btn" download>下载</a>
                ${previewBtn}
                <button class="copy-link-btn" data-url="${resource.downloadUrl}" title="复制链接">复制下载链接</button>
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
                    Utils.showCopySuccess(copyBtn);
                }).catch(function() {
                    // 如果 Clipboard API 失败，使用备用方法
                    Utils.fallbackCopyText(fullUrl, copyBtn);
                });
            } else {
                // 使用备用方法
                Utils.fallbackCopyText(fullUrl, copyBtn);
            }
        });

        // 为预览按钮添加点击事件
        const previewBtnEl = tr.querySelector('.preview-btn');
        if (previewBtnEl) {
            previewBtnEl.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                PreviewModal.show(this.dataset.url, this.dataset.name);
            });
        }

        return tr;
    }
};

// 预览模态框模块
const PreviewModal = {
    // 初始化预览模态框
    init() {
        const modal = document.getElementById('previewModal');
        const closeBtn = document.getElementById('closePreview');
        
        if (!modal || !closeBtn) {
            console.log('预览模态框元素不存在，跳过初始化');
            return;
        }
        
        closeBtn.addEventListener('click', function() {
            modal.classList.remove('active');
        });
        
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    },

    // 显示预览
    show(url, name) {
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
                    previewBody.innerHTML = `<pre style="white-space: pre-wrap; word-wrap: break-word; max-height: 500px; overflow-y: auto; padding: 15px; background: rgba(0,0,0,0.05); border-radius: 8px;">${this.escapeHtml(text)}</pre>`;
                })
                .catch(err => {
                    previewBody.innerHTML = '<div style="text-align: center; padding: 20px;">无法预览此文件</div>';
                });
        } else {
            previewBody.innerHTML = '<div style="text-align: center; padding: 20px;">此文件类型不支持预览</div>';
        }
        
        modal.classList.add('active');
    },

    // 转义HTML字符
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};

// 搜索筛选模块
const SearchFilter = {
    // 初始化搜索功能
    initSearch() {
        const searchInput = document.getElementById('searchInput');
        // 使用防抖函数优化搜索输入
        const debouncedSearch = Utils.debounce(function(e) {
            this.applyFiltersAndSort();
        }.bind(this), 300);
        
        searchInput.addEventListener('input', debouncedSearch);
    },

    // 初始化筛选功能
    initFilter() {
        const formatFilter = document.getElementById('formatFilter');
        const categoryFilter = document.getElementById('categoryFilter');
        
        formatFilter.addEventListener('change', function(e) {
            this.applyFiltersAndSort();
        }.bind(this));
        
        if (categoryFilter) {
            categoryFilter.addEventListener('change', function(e) {
                this.applyFiltersAndSort();
            }.bind(this));
        }
    },

    // 应用搜索、筛选和排序
    applyFiltersAndSort() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const selectedFormat = document.getElementById('formatFilter').value;
        const selectedCategory = document.getElementById('categoryFilter') ? document.getElementById('categoryFilter').value : 'all';

        let filteredResources = ResourceData.getAll();

        // 应用搜索
        if (searchTerm) {
            filteredResources = filteredResources.filter(resource =>
                resource.name.toLowerCase().includes(searchTerm) ||
                resource.description.toLowerCase().includes(searchTerm)
            );
        }

        // 应用格式筛选
        if (selectedFormat !== 'all') {
            filteredResources = filteredResources.filter(resource => resource.format === selectedFormat);
        }

        // 应用分类筛选
        if (selectedCategory !== 'all') {
            filteredResources = filteredResources.filter(resource => resource.category === selectedCategory);
        }

        ResourceRenderer.render(filteredResources);
    }
};

// 排序模块
const SortManager = {
    // 初始化排序功能
    init() {
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

                // 执行排序
                let sortedResources = [...ResourceData.getAll()];
                
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
                SearchFilter.applyFiltersAndSort();
            });
        });
    }
};

// 批量操作模块
const BatchOperations = {
    // 初始化批量操作功能
    init() {
        const selectAllCheckbox = document.getElementById('selectAllCheckbox');
        const selectAllBtn = document.getElementById('selectAllBtn');
        const deleteSelectedBtn = document.getElementById('deleteSelectedBtn');

        // 全选/取消全选（复选框）
        selectAllCheckbox.addEventListener('change', function() {
            const checkboxes = document.querySelectorAll('.resource-checkbox');
            checkboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
            this.updateDeleteButton();
        }.bind(this));

        // 全选按钮
        selectAllBtn.addEventListener('click', function() {
            const checkboxes = document.querySelectorAll('.resource-checkbox');
            const allChecked = Array.from(checkboxes).every(cb => cb.checked);
            checkboxes.forEach(checkbox => {
                checkbox.checked = !allChecked;
            });
            document.getElementById('selectAllCheckbox').checked = !allChecked;
            this.updateDeleteButton();
        }.bind(this));

        // 监听单个复选框变化
        document.addEventListener('change', function(e) {
            if (e.target.classList.contains('resource-checkbox')) {
                this.updateDeleteButton();
            }
        }.bind(this));

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
                selectedNames.forEach(name => {
                    ResourceData.deleteByName(name);
                });

                // 重新渲染
                SearchFilter.applyFiltersAndSort();

                // 重置全选复选框
                document.getElementById('selectAllCheckbox').checked = false;
                this.updateDeleteButton();

                alert('删除成功！');
            }
        }.bind(this));
    },

    // 更新删除按钮显示状态
    updateDeleteButton() {
        const selectedCount = document.querySelectorAll('.resource-checkbox:checked').length;
        const deleteSelectedBtn = document.getElementById('deleteSelectedBtn');

        if (selectedCount > 0) {
            deleteSelectedBtn.style.display = 'inline-block';
            deleteSelectedBtn.textContent = `删除选中 (${selectedCount})`;
        } else {
            deleteSelectedBtn.style.display = 'none';
        }
    }
};

// 上传功能模块
const UploadManager = {
    // 初始化上传模态框
    init() {
        const uploadBtn = document.getElementById('uploadBtn');
        const uploadModal = document.getElementById('uploadModal');
        const closeModal = uploadModal ? uploadModal.querySelector('.close-modal') : null;
        const uploadArea = uploadModal ? uploadModal.querySelector('.upload-area') : null;
        const fileInput = uploadModal ? uploadModal.querySelector('#fileInput') : null;

        if (!uploadBtn || !uploadModal || !closeModal || !uploadArea || !fileInput) {
            return;
        }

        // 打开上传模态框
        uploadBtn.addEventListener('click', function() {
            uploadModal.classList.add('active');
        });

        // 关闭上传模态框
        closeModal.addEventListener('click', function() {
            uploadModal.classList.remove('active');
            this.resetUploadArea();
        }.bind(this));

        // 点击模态框外部关闭
        uploadModal.addEventListener('click', function(e) {
            if (e.target === uploadModal) {
                uploadModal.classList.remove('active');
                this.resetUploadArea();
            }
        }.bind(this));

        // 点击上传区域触发文件选择
        uploadArea.addEventListener('click', function() {
            fileInput.click();
        });

        // 处理文件选择
        fileInput.addEventListener('change', function(e) {
            if (e.target.files.length > 0) {
                this.handleFiles(e.target.files);
            }
        }.bind(this));

        // 实现拖拽上传
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, this.preventDefaults, false);
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            uploadArea.addEventListener(eventName, this.highlight, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, this.unhighlight, false);
        });

        // 处理拖拽文件
        uploadArea.addEventListener('drop', function(e) {
            const dt = e.dataTransfer;
            const files = dt.files;
            if (files.length > 0) {
                this.handleFiles(files);
            }
        }.bind(this));
    },

    // 阻止默认行为
    preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    },

    // 高亮上传区域
    highlight() {
        const uploadArea = document.getElementById('uploadArea');
        if (uploadArea) {
            uploadArea.style.borderColor = '#27ae60';
            uploadArea.style.backgroundColor = 'rgba(46, 204, 113, 0.1)';
        }
    },

    // 取消高亮
    unhighlight() {
        const uploadArea = document.getElementById('uploadArea');
        if (uploadArea) {
            uploadArea.style.borderColor = '';
            uploadArea.style.backgroundColor = '';
        }
    },

    // 处理文件上传
    handleFiles(files) {
        const uploadProgress = document.getElementById('uploadProgress');
        const progressFill = uploadProgress ? uploadProgress.querySelector('.progress-fill') : null;
        const progressText = uploadProgress ? uploadProgress.querySelector('.progress-text') : null;

        if (!uploadProgress || !progressFill || !progressText) {
            return;
        }

        // 显示进度条
        document.getElementById('uploadArea').style.display = 'none';
        uploadProgress.style.display = 'block';

        // 模拟上传进度
        let progress = 0;
        const interval = setInterval(() => {
            progress += 5;
            if (progress > 100) {
                clearInterval(interval);
                setTimeout(() => {
                    // 上传完成，关闭模态框并显示成功消息
                    document.getElementById('uploadModal').classList.remove('active');
                    this.resetUploadArea();
                    alert('文件上传成功！');
                }, 500);
                return;
            }
            progressFill.style.width = `${progress}%`;
            progressText.textContent = `上传中... ${progress}%`;
        }, 200);
    },

    // 重置上传区域
    resetUploadArea() {
        const uploadArea = document.getElementById('uploadArea');
        const uploadProgress = document.getElementById('uploadProgress');
        const fileInput = document.getElementById('fileInput');

        if (uploadArea) {
            uploadArea.style.display = 'block';
        }
        if (uploadProgress) {
            uploadProgress.style.display = 'none';
            const progressFill = uploadProgress.querySelector('.progress-fill');
            const progressText = uploadProgress.querySelector('.progress-text');
            if (progressFill) progressFill.style.width = '0%';
            if (progressText) progressText.textContent = '上传中... 0%';
        }
        if (fileInput) {
            fileInput.value = '';
        }
    }
};

// 主应用初始化
document.addEventListener('DOMContentLoaded', function() {
    // 等待背景加载完成
    Utils.waitForBackgroundLoad();
    
    // 初始化各个模块
    ResourceRenderer.render(ResourceData.getAll());
    SearchFilter.initSearch();
    SearchFilter.initFilter();
    SortManager.init();
    BatchOperations.init();
    PreviewModal.init();
    UploadManager.init();
});