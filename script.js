// 资源数据 - shared-files 文件夹中的文件列表
const resources = [
    {
        name: "ehviewer.apk",
        description: "EhViewer 应用",
        size: "未知大小",
        format: "APK",
        downloadUrl: "shared-files/ehviewer.apk"
    },
    {
        name: "mt管理器.apk",
        description: "MT管理器应用",
        size: "未知大小",
        format: "APK",
        downloadUrl: "shared-files/mt管理器.apk"
    },
    {
        name: "破解软件.apk",
        description: "破解软件应用",
        size: "未知大小",
        format: "APK",
        downloadUrl: "shared-files/破解软件.apk"
    }
];

// DOM 加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    renderResources();
});

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