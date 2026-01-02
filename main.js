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

    // 获取元素
    const sponsorBtn = document.getElementById('sponsorBtn');
    const sponsorModal = document.getElementById('sponsorModal');

    // 赞助按钮点击事件
    if (sponsorBtn) {
        sponsorBtn.addEventListener('click', function() {
            sponsorModal.classList.add('active');
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

    // 关闭按钮点击事件
    const closeModal = document.getElementById('closeModal');
    if (closeModal) {
        closeModal.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (sponsorModal) {
                sponsorModal.classList.remove('active');
            }
        });
    }

    // ESC键关闭模态框
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && sponsorModal && sponsorModal.classList.contains('active')) {
            sponsorModal.classList.remove('active');
        }
    });
});