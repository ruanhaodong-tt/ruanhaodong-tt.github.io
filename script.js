// DOM 加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    loadResources();
});

// 加载资源列表
function loadResources() {
    fetch('shared-files/')
        .then(response => response.text())
        .then(text => {
            const files = parseFileList(text);
            renderResources(files);
        })
        .catch(error => {
            console.error('加载文件列表失败:', error);
            renderResources([]);
        });
}

// 解析文件列表
function parseFileList(text) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');
    const links = doc.querySelectorAll('a[href]');

    const files = [];
    links.forEach(link => {
        const href = link.getAttribute('href');
        // 排除父目录和目录本身
        if (href && href !== '../' && !href.endsWith('/')) {
            const filename = decodeURIComponent(href.split('/').pop());
            const extension = filename.split('.').pop().toUpperCase();
            const size = link.nextElementSibling ? link.nextElementSibling.textContent.trim() : '未知大小';

            files.push({
                name: filename,
                description: filename,
                size: size,
                format: extension,
                downloadUrl: `shared-files/${href}`
            });
        }
    });

    return files;
}

// 渲染资源列表
function renderResources(resources) {
    const resourcesContainer = document.getElementById('resources');

    // 清空容器
    resourcesContainer.innerHTML = '';

    // 如果没有资源，显示空状态
    if (resources.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td colspan="5" class="empty-state">暂无文件</td>
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
    tr.innerHTML = `
        <td>${resource.name}</td>
        <td>${resource.description}</td>
        <td>${resource.size}</td>
        <td>${resource.format}</td>
        <td><a href="${resource.downloadUrl}" class="download-btn" download>下载</a></td>
    `;

    return tr;
}