// 主页专用脚本 - 简化版

// DOM 加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
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