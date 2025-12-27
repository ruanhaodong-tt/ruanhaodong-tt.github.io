// 资源数据 - 可以轻松添加更多资源
const resources = [
    {
        id: 1,
        name: "示例文档",
        description: "这是一个示例文档，展示资源分享站的功能",
        size: "2.5 MB",
        format: "PDF",
        downloadUrl: "shared-files/example.pdf"
    },
    {
        id: 2,
        name: "示例图片",
        description: "示例图片资源，用于测试下载功能",
        size: "1.8 MB",
        format: "JPG",
        downloadUrl: "shared-files/example.jpg"
    },
    {
        id: 3,
        name: "示例音频",
        description: "示例音频文件，支持多种格式",
        size: "5.2 MB",
        format: "MP3",
        downloadUrl: "shared-files/example.mp3"
    },
    {
        id: 4,
        name: "示例视频",
        description: "示例视频文件，高清画质",
        size: "15.8 MB",
        format: "MP4",
        downloadUrl: "shared-files/example.mp4"
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