# TaiSoft Dijital Kartvizit PWA

Bu paket, yüklenen **TaiSoft logosunu değiştirmeden** `assets/logo.png` olarak kullanır. Android ve iPhone'da tarayıcıdan açılır; HTTPS üzerinde yayınlandığında ana ekrana uygulama olarak eklenebilir ve çevrimdışı önbellek desteği sunar.

## Temel özellikler

- Android / iPhone uyumlu responsive arayüz.
- PWA manifest + service worker.
- Kart bilgilerini cihazda `localStorage` ile saklama.
- Profil görseli **başlangıçta görünmez**.
- İstenirse **solda** görünecek şekilde JPG/PNG/WEBP profil resmi ekleme, önizleme ve kaldırma.
- Telefon, WhatsApp, e-posta, harita ve web bağlantıları.
- `.vcf` kişi kartı oluşturma.
- Web Share API desteği ve kopyalama yedeği.
- Kart bilgisini URL fragment (`#card=...`) içine alarak sunucu/veritabanı gerektirmeden paylaşım bağlantısı oluşturma.
- QR kod üretimi ve PNG kaydetme.
- Reklam/analitik/takip kodu yok.
- QR üretimi için bağımlılıksız, MIT lisanslı **QRCode.js** dosyası pakete yerel olarak dahil edilmiştir.
- Gerekli alanlar (**Ad Soyad, Ünvan, Birim / Açıklama, Telefon 1, Kurumsal e-posta**) kaydedildiğinde **Düzenle** düğmesi otomatik olarak pasif olur.
- QR ile açılan paylaşım görünümünde de **Düzenle** düğmesi pasiftir.

> **Profil resmi notu:** Yüklenen profil resmi güvenlik ve QR kapasitesi nedeniyle yalnızca düzenleme yapılan cihazın tarayıcısında saklanır; QR bağlantısına fotoğraf verisi eklenmez. Metin ve iletişim bilgileri QR ile paylaşılmaya devam eder.

## QR kodun telefonda çalışması için gerekli adım

QR kod başka telefonlarda açılacaksa uygulama klasörü internette erişilebilir **HTTPS** bir adreste yayınlanmalıdır. `file://` ile bilgisayarda açılan yerel dosyaya ait QR kod, başka telefondan erişilemez.

### Ücretsiz yöntem: GitHub Pages

1. GitHub'da yeni bir **Public** repository oluşturun (ör. `taisoft-kart`).
2. Bu ZIP içindeki dosyaları repository köküne yükleyin (`index.html` kökte olmalı).
3. Repository > **Settings > Pages** bölümüne girin.
4. **Deploy from a branch** seçin; `main` ve `/ (root)` değerlerini kullanın.
5. Oluşan `https://KULLANICI-ADI.github.io/taisoft-kart/` adresini açın.
6. Kartın sağ üstündeki **Düzenle** düğmesiyle bilgileri girin ve kaydedin.
7. **QR Oluştur** düğmesine basın. Oluşan QR, kart bilgilerini içeren paylaşım bağlantısını açar.
8. Android'de uygulama içindeki **yükle** düğmesini veya tarayıcıdaki “Uygulamayı yükle / Ana ekrana ekle” seçeneğini kullanın. iPhone'da Paylaş > **Ana Ekrana Ekle** seçeneğini kullanın.

> Not: GitHub Pages üzerindeki dosyalar herkese açık olur. Şifre, özel belge veya gizli veri yayımlamayın.

## Dosyalar

- `index.html` — ana uygulama
- `manifest.webmanifest` — PWA tanımı
- `sw.js` — çevrimdışı önbellek
- `assets/logo.png` — yüklenen orijinal logo dosyasının birebir kopyası
- `assets/app.css` — responsive tasarım
- `assets/app.js` — kart, paylaşım, VCF ve PWA işlevleri
- `assets/qrcode.min.js` — QRCode.js (MIT)
- `assets/icons/` — PWA ikonları
- `privacy.html` — kısa gizlilik notu

## Kullanılan ücretsiz / güvenilir teknik kaynaklar

- MDN Web Docs — PWA kurulabilirlik, manifest ve HTTPS gereklilikleri.
- GitHub Pages — ücretsiz statik site yayını ve otomatik HTTPS.
- QRCode.js — bağımlılıksız QR üretimi, MIT lisansı.

## Güvenlik ve mimari notları

- Uygulama için arka uç, veritabanı veya API anahtarı gerekmez.
- Profil paylaşımı URL'nin `#` fragment bölümünü kullanır; bu bölüm normal HTTP isteğinde sunucuya gönderilmez.
- GitHub Pages gibi herkese açık bir host üzerinde uygulama kaynak kodu ve varsayılan içerik herkese açıktır.
- Kartta yalnızca paylaşılması uygun iletişim bilgilerini kullanın.
