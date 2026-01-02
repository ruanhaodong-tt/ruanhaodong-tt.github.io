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
    if (sponsorBtn) {
        sponsorBtn.addEventListener('click', function() {
            const sponsorModal = document.getElementById('sponsorModal');
            if (sponsorModal) {
                sponsorModal.classList.add('active');
            }
        });
    }

    // 使用事件委托处理所有点击事件
    document.addEventListener('click', function(e) {
        const sponsorModal = document.getElementById('sponsorModal');
        if (!sponsorModal) return;

        // 点击关闭按钮
        if (e.target.classList.contains('close-modal') || e.target.closest('.close-modal')) {
            console.log('关闭按钮被点击');
            e.preventDefault();
            e.stopPropagation();
            sponsorModal.classList.remove('active');
            return;
        }

        // 点击遮罩层关闭
        if (e.target === sponsorModal) {
            console.log('遮罩层被点击');
            sponsorModal.classList.remove('active');
        }
    });

    // ESC键关闭模态框
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            console.log('ESC键被按下');
            const sponsorModal = document.getElementById('sponsorModal');
            if (sponsorModal && sponsorModal.classList.contains('active')) {
                sponsorModal.classList.remove('active');
            }
        }
    });
});