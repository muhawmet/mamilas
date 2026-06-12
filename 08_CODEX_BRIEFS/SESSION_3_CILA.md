# CODEX SESSION 3 — Cila, Mobil Kontrol ve Son Regresyon

## Bağlam (önce oku)

MAMILAS tek dosyalık yerel web uygulamasıdır: `mamilas.html`. SESSION_1 DESIGN
modunu yeni ajan kontratına büyüttü; SESSION_2 brief hattını failproof yaptı ve
harness'i genişletti. Bu son oturum: kalan pürüzler, mobil katman doğrulaması,
doküman senkronu ve tam regresyon.

## Dokunulmazlar

README.md'deki ortak dokunulmazlar aynen geçerli.

## İş listesi

### 1. Görünür kalıntı taraması
- `mamilas.html` içinde kullanıcıya GÖRÜNEN metinlerde sürüm kalıntısı tara:
  `v3[0-9]`, `PRIME`, eski ajan adları (MASTER/PROOF/CLIENT bir buton veya
  başlıkta görünüyorsa). Kod içi fonksiyon adları (`buildBriefV32` gibi) SERBEST —
  sadece UI string'leri temizlenir.
- Ölü buton/onclick taraması: `onclick="..."` içinde çağrılan her fonksiyonun
  tanımlı olduğunu otomatik kontrol et (script'leri çıkar, fonksiyon adlarını
  topla, tanımlılarla karşılaştır) ve bulunanları düzelt veya butonu kaldır.

### 2. Mobil katman kontrolü
Dar ekranda (≤720px) otomatik açılan mobil katman (alt navigasyon, üst chip'ler,
önizleme FAB'ı) iki modda da çalışmalı:
- DESIGN modunda alt navigasyonun DESIGN rotalarını (ddash/dsource/dformat/
  dstyle/dfinal) gösterdiğini ve SESSION_1'in yeni alanlarının (jobClass seçici,
  carousel kartları, kit alanları) mobilde taşmadan kullanılabildiğini doğrula;
  CSS düzeltmesi gerekiyorsa yap (yatay scroll çıkmasın, input'lar ekrana sığsın).
- Headless test imkânın varsa (Playwright/Puppeteer) 390×844 viewport'ta iki
  modu da aç, konsol hatası olmadığını rapora yaz; yoksa CSS denetimini statik
  yap ve manuel kontrol listesi bırak.

### 3. Harness'i DESIGN moduna genişlet
SESSION_2'nin design brief testlerine ek olarak:
- Carousel senaryosu: 5 kartlı BILGI_CAROUSEL kur → `designBrief()` çıktısında
  5 `[copy#card]` kimliği, kapak/CTA etiketleri ve kart yasası satırı.
- ÖZEL GÜN senaryosu: specialDay="10 Kasım" → Memorial register satırı var VE
  brief'te `İNDİRİM`/`KAMPANYA` kelimeleri yok (ticari ton sızmamış).
- Kit migrasyonu: eski şemalı (yeni alansız) bir DS JSON'unu localStorage'a yaz,
  reload simüle et (DS yükleme yolunu çağır), hata yok + alanlar varsayılanlı.

### 4. Doküman senkronu
- `CHANGELOG.md`'ye bu üç Codex oturumunun özetini ekle (tarih + madde madde;
  sürüm kod adı YAZMA).
- `KURULUM.md` ve `00_INSTALL.md`'de DESIGN akışı anlatımının SESSION_1 sonrası
  gerçeğe uyduğunu kontrol et (jobClass, client kit, carousel'den kısaca söz et).
- `06_USAGE_GUIDE.md`'ye dokunma (ajan tarafı ayrı süreçte yönetiliyor) — yalnız
  bariz yanlışlık görürsen tek satır not düş, değiştirme.

### 5. Tam regresyon + paket
- Söz dizimi komutu (README) `OK`.
- Harness'in TÜM testleri (22 + SESSION_2 + bu oturum) yeşil; toplam sayıyı
  rapora yaz.
- Şu uçtan uca senaryoyu çalıştır ve brief çıktılarını rapora ekle:
  1) VIDEO: kısa eğitim metni gir → Dengeli mod → brief üret → gate PASS.
  2) DESIGN: KAMPANYA_INDIRIM + kit dolu → brief üret → kontrat başlıkları tam.
- Proje kökünde dağıtım zip'i üret: `Mamilas_release.zip` (tüm dosyalar,
  `__MACOSX`/`.DS_Store` hariç).

## Kabul kriterleri

1. Harness tamamı yeşil; sayı raporda.
2. UI'da sürüm kalıntısı yok: script-dışı görünür metinlerde `v3[0-9]` araması
   sıfır sonuç.
3. Tanımsız onclick fonksiyonu sıfır.
4. 390px genişlikte iki modda yatay taşma yok (rapor: kontrol yöntemi + sonuç).
5. `Mamilas_release.zip` üretildi, içinde 08_CODEX_BRIEFS dahil tüm klasörler var.

## Teslim

Değişen dosyalar + `Mamilas_release.zip` + kısa rapor (test sayısı, senaryo
çıktıları, mobil kontrol sonucu).
