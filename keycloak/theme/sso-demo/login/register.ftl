<#import "template.ftl" as layout>
<@layout.registrationLayout displayMessage=true; section>
    <#if section = "header">
        Pendaftaran Akun SSO
    <#elseif section = "form">
        <#assign showStep2 = messagesPerField.existsError('email','username','password','password-confirm')>
        <form id="kc-register-form" class="${properties.kcFormClass!}" action="${url.registrationAction}" method="post">
            
            <!-- STEP 1: Data Kependudukan -->
            <div id="step1" style="display: ${showStep2?string('none', 'block')};">
                <h3 style="text-align: center; margin-bottom: 20px; color: #1e293b;">Langkah 1: Data Diri</h3>
                
                <div class="${properties.kcFormGroupClass!}">
                    <label for="user.attributes.nik" class="${properties.kcLabelClass!}">Nomor Induk Kependudukan (NIK)</label>
                    <input type="text" id="user.attributes.nik" class="${properties.kcInputClass!}" name="user.attributes.nik" value="${(register.formData['user.attributes.nik']!'')}" required />
                </div>

                <div class="${properties.kcFormGroupClass!}">
                    <label for="firstName" class="${properties.kcLabelClass!}">Nama Lengkap</label>
                    <input type="text" id="firstName" class="${properties.kcInputClass!}" name="firstName" value="${(register.formData.firstName!'')}" required />
                </div>

                <div class="${properties.kcFormGroupClass!}">
                    <label for="user.attributes.tanggalLahir" class="${properties.kcLabelClass!}">Tanggal Lahir</label>
                    <input type="date" id="user.attributes.tanggalLahir" class="${properties.kcInputClass!}" name="user.attributes.tanggalLahir" value="${(register.formData['user.attributes.tanggalLahir']!'')}" required />
                </div>

                <div class="${properties.kcFormGroupClass!}" style="margin-top: 30px;">
                    <button type="button" class="${properties.kcButtonClass!} ${properties.kcButtonPrimaryClass!} ${properties.kcButtonBlockClass!}" onclick="nextStep()">Lanjut ke Step 2</button>
                </div>
                
                <div id="kc-form-options" style="margin-top: 20px; text-align: center;">
                    <span>Sudah punya akun? <a href="${url.loginUrl}">Login di sini</a></span>
                </div>
            </div>

            <!-- STEP 2: Data Akun SSO -->
            <div id="step2" style="display: ${showStep2?string('block', 'none')};">
                <h3 style="text-align: center; margin-bottom: 20px; color: #1e293b;">Langkah 2: Data Akun</h3>
                
                <input type="hidden" id="lastName" name="lastName" value="-" />

                <div class="${properties.kcFormGroupClass!}">
                    <label for="email" class="${properties.kcLabelClass!}">Alamat Email</label>
                    <input type="email" id="email" class="${properties.kcInputClass!}" name="email" value="${(register.formData.email!'')}" required />
                    <#if messagesPerField.existsError('email')>
                        <span style="color: red; font-size: 12px; margin-top: 4px; display: block;">${messagesPerField.get('email')}</span>
                    </#if>
                </div>

                <div class="${properties.kcFormGroupClass!}">
                    <label for="username" class="${properties.kcLabelClass!}">Username (Untuk Login)</label>
                    <input type="text" id="username" class="${properties.kcInputClass!}" name="username" value="${(register.formData.username!'')}" required />
                    <#if messagesPerField.existsError('username')>
                        <span style="color: red; font-size: 12px; margin-top: 4px; display: block;">${messagesPerField.get('username')}</span>
                    </#if>
                </div>

                <div class="${properties.kcFormGroupClass!}">
                    <label for="password" class="${properties.kcLabelClass!}">Kata Sandi</label>
                    <input type="password" id="password" class="${properties.kcInputClass!}" name="password" required autocomplete="new-password" />
                    <#if messagesPerField.existsError('password')>
                        <span style="color: red; font-size: 12px; margin-top: 4px; display: block;">${messagesPerField.get('password')}</span>
                    </#if>
                </div>

                <div class="${properties.kcFormGroupClass!}">
                    <label for="password-confirm" class="${properties.kcLabelClass!}">Konfirmasi Kata Sandi</label>
                    <input type="password" id="password-confirm" class="${properties.kcInputClass!}" name="password-confirm" required />
                    <#if messagesPerField.existsError('password-confirm')>
                        <span style="color: red; font-size: 12px; margin-top: 4px; display: block;">${messagesPerField.get('password-confirm')}</span>
                    </#if>
                </div>

                <div class="${properties.kcFormGroupClass!}" style="margin-top: 30px; display: flex; gap: 10px;">
                    <button type="button" class="${properties.kcButtonClass!} ${properties.kcButtonDefaultClass!}" style="flex: 1; background: transparent; border: 1px solid #cbd5e1; color: #0f172a;" onclick="prevStep()">Kembali</button>
                    <input class="${properties.kcButtonClass!} ${properties.kcButtonPrimaryClass!}" style="flex: 2;" type="submit" value="Daftarkan Akun SSO" />
                </div>
            </div>
            
        </form>

        <script>
            function nextStep() {
                var nik = document.getElementById('user.attributes.nik').value;
                var nama = document.getElementById('firstName').value;
                var tgl = document.getElementById('user.attributes.tanggalLahir').value;
                
                if(!nik || !nama || !tgl) {
                    alert("Mohon lengkapi NIK, Nama Lengkap, dan Tanggal Lahir terlebih dahulu.");
                    return;
                }
                
                document.getElementById('step1').style.display = 'none';
                document.getElementById('step2').style.display = 'block';
            }
            
            function prevStep() {
                document.getElementById('step2').style.display = 'none';
                document.getElementById('step1').style.display = 'block';
            }
        </script>
    </#if>
</@layout.registrationLayout>
