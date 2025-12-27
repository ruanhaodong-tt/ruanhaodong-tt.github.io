// 资源数据 - 可以轻松添加更多资源
const resources = [
    {
        id: 1,
        name: "示例文档",
        description: "这是一个示例文档，展示资源分享站的功能",
        size: "2.5 MB",
        format: "PDF",
        downloadUrl: "#"
    },
    {
        id: 2,
        name: "示例图片",
        description: "示例图片资源，用于测试下载功能",
        size: "1.8 MB",
        format: "JPG",
        downloadUrl: "#"
    },
    {
        id: 3,
        name: "示例音频",
        description: "示例音频文件，支持多种格式",
        size: "5.2 MB",
        format: "MP3",
        downloadUrl: "#"
    },
    {
        id: 4,
        name: "示例视频",
        description: "示例视频文件，高清画质",
        size: "15.8 MB",
        format: "MP4",
        downloadUrl: "#"
    }
];

// DOM 加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    renderResources();
});

// 渲染资源列表
function renderResources() {
    const resourcesContainer = document.getElementById('resources');
    
    // 清空容器
    resourcesContainer.innerHTML = '';
    
    // 遍历资源并创建HTML
    resources.forEach(resource => {
        const resourceElement = createResourceElement(resource);
        resourcesContainer.appendChild(resourceElement);
    });
}

// 创建单个资源元素
function createResourceElement(resource) {
    const div = document.createElement('div');
    div.className = 'resource-item';
    div.innerHTML = `
        <h3>${resource.name}</h3>
        <p>${resource.description}</p>
        <div class="resource-meta">
            <span>大小: ${resource.size}</span>
            <span>格式: ${resource.format}</span>
        </div>
        <a href="${resource.downloadUrl}" class="download-btn" download>${resource.name}下载</a>
    `;
    
    // 添加点击事件处理（如果需要）
    const downloadBtn = div.querySelector('.download-btn');
    downloadBtn.addEventListener('click', function(e) {
        if (resource.downloadUrl === '#') {
            e.preventDefault();
            alert('此为示例资源，下载功能尚未实现。请在实际使用时替换为真实的下载链接。');
        }
    });
    
    return div;
}

// 添加新资源的函数（供未来扩展使用）
function addResource(resource) {
    // 生成新ID
    const newId = resources.length > 0 ? Math.max(...resources.map(r => r.id)) + 1 : 1;
    resource.id = newId;
    
    // 添加到资源数组
    resources.push(resource);
    
    // 重新渲染列表
    renderResources();
}

// 示例：如何使用addResource函数添加新资源
/*
const newResource = {
    name: "新资源",
    description: "这是一个新添加的资源",
    size: "3.0 MB",
    format: "ZIP",
    downloadUrl: "path/to/new/resource.zip"
};
addResource(newResource);
*/