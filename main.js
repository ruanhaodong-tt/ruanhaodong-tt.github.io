// 主页脚本

// DOM 加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 隐藏加载遮罩，显示内容
    const loadingOverlay = document.getElementById('loadingOverlay');
    const mainContent = document.getElementById('mainContent');

    if (loadingOverlay && mainContent) {
        setTimeout(function() {
            loadingOverlay.classList.add('hidden');
            mainContent.style.opacity = '1';
            mainContent.style.transition = 'opacity 0.5s ease';
        }, 500);
    }

    // 赞助按钮点击事件
    const sponsorBtn = document.getElementById('sponsorBtn');
    const sponsorModal = document.getElementById('sponsorModal');
    const closeModal = document.getElementById('closeModal');

    if (sponsorBtn) {
        sponsorBtn.addEventListener('click', function() {
            sponsorModal.classList.add('active');
        });
    }

    if (closeModal) {
        closeModal.addEventListener('click', function() {
            sponsorModal.classList.remove('active');
        });
    }

    // 点击遮罩层关闭
    if (sponsorModal) {
        sponsorModal.addEventListener('click', function(e) {
            if (e.target === sponsorModal) {
                sponsorModal.classList.remove('active');
            }
        });
    }
});