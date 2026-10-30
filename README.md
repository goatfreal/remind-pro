# ⚡ RemindPro (Anımsatıcılar'dan Daha İyisi)

Apple'ın yerel Anımsatıcılar uygulamasının eksiklerini tamamlayan, modern, akıllı ve hızlı görev yönetim uygulaması. Mac bilgisayara ihtiyaç duymadan doğrudan Windows üzerinden geliştirilebilir ve iPhone'a yüklenebilir.

---

## 🌟 Öne Çıkan Özellikler

1. **🧠 Doğal Dil Algılama (NLP Engine):**
   - *"Yarın 15:30'da proje toplantısı #iş !acil"* yazdığınızda gün, saat, öncelik ve etiket otomatik ayıklanır.
   - Hızlı zaman ekleme kısayolları (*+ Bugün 18:00*, *+ Yarın 09:00*, *+ 30 dk sonra*).
2. **🎯 Eisenhower Matrisi (4 Bölmeli Öncelik Panosu):**
   - **Hemen Yap** (Acil & Önemli)
   - **Planla** (Önemli & Acil Değil)
   - **Hızlı Bitir** (Acil & Önemsiz)
   - **Ele / Ertele** (Ne Acil Ne Önemli)
3. **⏰ Akıllı Erteleme (Smart Snooze):**
   - Tek tıkla +15 dakika, +1 saat, Bu akşam (20:00), Yarın sabah (09:00) veya Hafta sonu.
4. **🔥 Seri (Streak) ve Üretkenlik Takibi:**
   - Günlük tamamlanan görevlere göre kesintisiz gün serisi ve başarı sayacı.
5. **🎨 Modern iOS Dark Glassmorphism:**
   - Apple standartlarında karanlık mod, zarif renk kodlamaları ve akıcı dokunmatik etkileşim.
6. **💾 Çevrimdışı Kalıcı Depolama:**
   - AsyncStorage ile internete gerek kalmadan tüm verileriniz telefonunuzda güvende kalır.

---

## 🚀 1. Yöntem: iPhone'da Anında Çalıştırma (En Kolay)

Hiç `.ipa` derleme beklemeden uygulamanızı **hemen telefonunuzda** kullanabilirsiniz:

1. iPhone'unuzdan App Store'u açın ve ücretsiz **Expo Go** uygulamasını indirin.
2. Bilgisayarınızda proje dizininde şu komutu çalıştırın:
   ```bash
   npx expo start
   ```
3. Terminalde beliren **QR kodu** iPhone'unuzun kamerasıyla okutun.
4. Uygulama anında telefonunuzda açılır!

---

## 📦 2. Yöntem: Mac Olmadan `.ipa` Dosyası Almak (GitHub Actions)

Projenin içinde hazır bir **GitHub Actions workflow** (`.github/workflows/build-ios.yml`) bulunmaktadır:

1. GitHub'da yeni bir repository oluşturun (Örn: `remind-pro`).
2. Bilgisayarınızdaki projeyi bu depoya gönderin:
   ```bash
   git branch -M main
   git remote add origin https://github.com/<KULLANICI_ADINIZ>/remind-pro.git
   git push -u origin main
   ```
3. GitHub reponuzda **Actions** sekmesine gidin.
4. GitHub'ın Mac sunucuları projeyi otomatik olarak derleyecek ve işlem bittiğinde **Artifacts** bölümünden `RemindPro-iOS-IPA` dosyasını (`.ipa`) indirebilirsiniz!

---

## 📲 3. Adım: `.ipa`'yı iPhone'a Yükleme (Sideloadly)

İndirdiğiniz `.ipa` dosyasını Windows bilgisayarınızdan iPhone'unuza yüklemek için:

1. Bilgisayarınıza [Sideloadly](https://sideloadly.io/) (ücretsiz) programını indirin.
2. iPhone'unuzu USB kablosuyla bilgisayara bağlayın.
3. Sideloadly programını açın:
   - İndirdiğiniz `.ipa` dosyasını Sideloadly penceresine sürükleyip bırakın.
   - Apple ID (e-posta adresinizi) girin.
   - **Start** butonuna basın.
4. 1-2 dakika içinde RemindPro uygulamanız iPhone'unuzun ana ekranına kurulacaktır!
5. Telefonunuzda **Ayarlar > Genel > VPN ve Aygıt Yönetimi** kısmından sertifikanıza bir defaya mahsus "Güven" deyin. Artık uygulamanız hazır!
