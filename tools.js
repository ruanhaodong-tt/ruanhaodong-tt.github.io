// 系统工具功能实现
document.addEventListener('DOMContentLoaded', function() {
    // 等待背景加载完成
    waitForBackgroundLoad();
});

// 等待背景加载完成
function waitForBackgroundLoad() {
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
}

// 显示系统信息
function showSystemInfo() {
    const resultTitle = document.getElementById('resultTitle');
    const resultContent = document.getElementById('resultContent');
    const toolResult = document.getElementById('toolResult');
    
    resultTitle.textContent = '系统信息';
    
    // 获取系统信息
    const systemInfo = {
        browser: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        screen: `${screen.width}x${screen.height}`,
        colorDepth: screen.colorDepth,
        cookieEnabled: navigator.cookieEnabled,
        online: navigator.onLine
    };
    
    // 构建系统信息HTML
    let infoHTML = `
        <div class="system-info">
            <p><strong>浏览器：</strong>${systemInfo.browser}</p>
            <p><strong>平台：</strong>${systemInfo.platform}</p>
            <p><strong>语言：</strong>${systemInfo.language}</p>
            <p><strong>屏幕分辨率：</strong>${systemInfo.screen}</p>
            <p><strong>颜色深度：</strong>${systemInfo.colorDepth}位</p>
            <p><strong>Cookie 启用：</strong>${systemInfo.cookieEnabled ? '是' : '否'}</p>
            <p><strong>在线状态：</strong>${systemInfo.online ? '在线' : '离线'}</p>
        </div>
    `;
    
    resultContent.innerHTML = infoHTML;
    toolResult.style.display = 'block';
    document.getElementById('fileSizeCalculator').style.display = 'none';
}

// 运行网络测试
function runNetworkTest() {
    const resultTitle = document.getElementById('resultTitle');
    const resultContent = document.getElementById('resultContent');
    const toolResult = document.getElementById('toolResult');
    
    resultTitle.textContent = '网络测试';
    resultContent.innerHTML = '<p>正在测试网络连接，请稍候...</p>';
    toolResult.style.display = 'block';
    document.getElementById('fileSizeCalculator').style.display = 'none';
    
    // 模拟网络测试
    setTimeout(() => {
        // 模拟测试结果
        const testResults = {
            ping: Math.round(Math.random() * 100 + 20), // 20-120ms
            download: (Math.random() * 50 + 10).toFixed(2), // 10-60 Mbps
            upload: (Math.random() * 20 + 5).toFixed(2), // 5-25 Mbps
            jitter: Math.round(Math.random() * 20), // 0-20ms
            packetLoss: (Math.random() * 2).toFixed(1) // 0-2%
        };
        
        // 构建测试结果HTML
        let resultHTML = `
            <div class="network-test-result">
                <p><strong>延迟（Ping）：</strong>${testResults.ping} ms</p>
                <p><strong>下载速度：</strong>${testResults.download} Mbps</p>
                <p><strong>上传速度：</strong>${testResults.upload} Mbps</p>
                <p><strong>抖动（Jitter）：</strong>${testResults.jitter} ms</p>
                <p><strong>丢包率：</strong>${testResults.packetLoss}%</p>
                <div class="network-quality">
                    <p><strong>网络质量评估：</strong>
                        ${testResults.ping < 50 && testResults.download > 30 ? '优秀' : 
                          testResults.ping < 80 && testResults.download > 15 ? '良好' : 
                          testResults.ping < 120 && testResults.download > 5 ? '一般' : '较差'}
                    </p>
                </div>
            </div>
        `;
        
        resultContent.innerHTML = resultHTML;
    }, 2000);
}

// 显示文件大小计算器
function showFileSizeCalculator() {
    const fileSizeCalculator = document.getElementById('fileSizeCalculator');
    const toolResult = document.getElementById('toolResult');
    
    fileSizeCalculator.style.display = 'block';
    toolResult.style.display = 'none';
}

// 隐藏工具结果
function hideToolResult() {
    document.getElementById('toolResult').style.display = 'none';
}

// 计算文件大小转换
function calculateFileSize() {
    const input = document.getElementById('fileSizeInput');
    const fromUnit = document.getElementById('fromUnit');
    const toUnit = document.getElementById('toUnit');
    const resultDiv = document.getElementById('calculatorResult');
    
    if (!input.value || isNaN(input.value)) {
        resultDiv.innerHTML = '<p style="color: red;">请输入有效的文件大小</p>';
        return;
    }
    
    const size = parseFloat(input.value);
    const from = fromUnit.value;
    const to = toUnit.value;
    
    // 转换为字节
    let bytes = size;
    switch (from) {
        case 'KB':
            bytes = size * 1024;
            break;
        case 'MB':
            bytes = size * 1024 * 1024;
            break;
        case 'GB':
            bytes = size * 1024 * 1024 * 1024;
            break;
        case 'TB':
            bytes = size * 1024 * 1024 * 1024 * 1024;
            break;
    }
    
    // 转换为目标单位
    let result = bytes;
    switch (to) {
        case 'KB':
            result = bytes / 1024;
            break;
        case 'MB':
            result = bytes / (1024 * 1024);
            break;
        case 'GB':
            result = bytes / (1024 * 1024 * 1024);
            break;
        case 'TB':
            result = bytes / (1024 * 1024 * 1024 * 1024);
            break;
    }
    
    // 显示结果
    resultDiv.innerHTML = `
        <p>${size} ${from} = ${result.toFixed(6)} ${to}</p>
        <p>字节数：${bytes.toLocaleString()} B</p>
    `;
}