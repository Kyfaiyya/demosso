document.addEventListener("DOMContentLoaded", function() {
    if (document.querySelector('.sso-left-panel')) return;

    var leftPanel = document.createElement("div");
    leftPanel.className = "sso-left-panel";
    leftPanel.innerHTML = `
        <div class="sso-left-content">
            <h1 style="font-size: 3rem; font-weight: 800; margin-bottom: 20px; line-height: 1.2;">Portal Layanan Terintegrasi</h1>
            <p style="font-size: 1.25rem; line-height: 1.6; opacity: 0.9; max-width: 500px;">
                Satu akun untuk seluruh akses layanan publik Pemerintah. Cepat, Aman, dan Tersentralisasi.
            </p>
        </div>
    `;
    
    document.body.insertBefore(leftPanel, document.body.firstChild);
});
