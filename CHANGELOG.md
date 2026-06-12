# MAMILAS — Changelog

## 2026-06-12 (ikinci tur) — Ajan beyinleri v2 + Codex devir paketi

### DESIGN ajanı yeniden hizalandı (asıl iş)
- Kimlik değişti: "poster tasarımcısı" → **yayına hazır statik tasarım üreticisi**
  (videonun foto karşılığı). Photoshop/Figma adımı kaldırıldı; tipografi planı
  yalnız açık istek üzerine veya vektör kurumsal işlerde (kartvizit, etiket).
- Varsayılan ters çevrildi: Türkçe yazı artık **görselin İÇİNDE** üretilir (EXACT
  kilit, görsel başına ≤ ~12 kelime, tek H1); paragraf/iletişim/yasal metin
  **CAPTION bloğuna** yönlenir (Instagram'a hazır).
- **GLİF QA protokolü:** ş ğ ı İ ç ö ü her revizyon DIFF'inde İLK kontrol;
  latinize glif = otomatik ilk CHANGE satırı.
- **İş sınıfları eklendi:** ÜRÜN POSTU · KAMPANYA/İNDİRİM · BİLGİ CAROUSEL'İ
  (kapak kancası + kart başına tek fikir + CTA kartı, sabit iskelet) ·
  STORY/REELS · **ÖZEL GÜN** (bayrak geometrisi kutsal, Atatürk/gerçek kişi asla
  AI ile yeniden çizilmez, anma gününde ticari ton sıfır — belediye düzeyi resmî
  denetime dayanıklı) · KURUMSAL/BELEDİYE DUYURU · PRINT/OOH.
- **CLIENT KIT yasası:** çok-müşterili çalışma için marka renkleri (hex), font
  karakteri, logo/amblem kuralı, kişi/maskot politikası mutlak yasa; kit yoksa
  ajan türetir ve `KIT: derived` der. Ürün geometrisi/amblem asla yeniden çizilmez.
- Engine scout güçlendi: ilk kriter **Türkçe yazı sadakati**; (scouted/fallback)
  etiketi zorunlu.

### IDEA ve ortak ajan düzeltmeleri
- IDEA design modu iş-sınıfı farkındalığı kazandı (carousel kart mimarisi, özel
  gün tek-kare saygı kuralları, copy'nin in-image/caption yönlendirmesi).
- Tüm ajanlara **eksik-brief davranışı**: eksik kilit → tek satır eksik-alan
  talebi; asla uydurma.
- **GPT 8.000 karakter limiti çözüldü:** 01_IDEA_GPT (9.657→7.979) ve
  05_DESIGN_GPT (10.327→7.790) artık Custom GPT Instructions'a sığıyor; detay
  yasalar knowledge dosyalarına taşındı (knowledge yükleme artık zorunlu).

### Site onarımları
- Sahne kaynağı elle düzenlenince `sourceEnd/sourceLen/sourceHash` artık güncel
  kalıyor; `mergePair()` birleşen sahnenin `sourceEnd`'ini doğru taşıyor
  (coverage hesabını bozabilen iki veri bütünlüğü hatası).
- `ingestRaw`'a 60.000 karakter kaynak guard'ı (performans koruması).

### Codex devir paketi
- `08_CODEX_BRIEFS/`: üç oturumluk, kabul kriterli iş emirleri —
  SESSION_1 (DESIGN modunu yeni kontrata büyütme: client kit, jobClass, carousel,
  özel gün, caption yönlendirme), SESSION_2 (ingestRaw zinciri refactor'u, gate
  eksik-alan sözleşmeleri, harness'e brief-kontrat + sourceEnd testleri),
  SESSION_3 (kalıntı/ölü buton taraması, mobil doğrulama, doküman senkronu,
  release zip).

---

## 2026-06-12 (ilk tur)

Kısa ve dürüst: bu turda ne değişti, ne değişmedi.

## Yeni: Semantic Beat Planner

Mekanik "her cümle = bir klip, her klip = 5-6 sn" bölücüsü kaldırıldı. Yerine üç süreyi
ayrı hesaplayan anlamsal planlayıcı geldi:

- **VO süresi** (doğal Türkçe okuma), **görsel okuma süresi** (fikrin okunur olması için
  gereken süre) ve **üretilecek klip süresi** (Kling 3.0: 5s/10s — maliyeti belirleyen
  tek şey) artık ayrı alanlardır; klip süresi VO'ya eşitlenmez.
- MERGE_SCORE: anlam sürekliliği + aynı görsel olay + konuşmacı diyaloğu + kredi
  tasarrufu − süre/hareket/kimlik/logo riski. Selamlama tek başına klip olmaz, kısa
  reveal ayrı kalır, tek cümledeki iki bağımsız fiziksel olay anlamsal sınırdan bölünür,
  konuşmacı değişimi tek başına bölmez, logo/ürün riski varken birleştirme yapılmaz.
- Cümle ortasından kelime sayısıyla kesme tamamen kaldırıldı; bölme yalnız cümle/clause/
  özne-değişimi sınırlarında olur ve kaynak kapsama her zaman %100 kalır.
- Segmentasyon modları: **Ekonomik** (beat 3.5–11s, eşik düşük), **Dengeli** (3–9s,
  varsayılan), **Hassas** (2.5–7s), **Manuel** (otomatik birleştirme/bölme kapalı).
  Min/Hedef/Max alanları override'dır; boş bırakılırsa mod varsayılanı çalışır.
- Scene Editor'da yeni panel: tahmini klip sayısı, üretilecek toplam saniye,
  kullanılabilir kurgu saniyesi, mekanik bölmeye göre tasarruf ve gerekçeli öneriler
  (Birleştir / Böl / Ayrı Tut). Öneriler asla manuel düzenlenmiş sahnenin üstüne yazmaz.
- Ölçülen örnek (uzun eğitim metni): mekanik 14 klip / 70 üretilen-sn → Dengeli 12 klip /
  60 sn (%14 tasarruf) → Ekonomik 10 klip / 50 sn (%29 tasarruf). Kısa selamlama metni:
  2 klip / 10 sn → 1 klip / 5 sn (%50).

## Düzeltme: stale-state sınıfı

- Proje/yol/register değişiminde türetilmiş sahne alanları (visual, character, risk)
  artık otomatik rejenere edilir; ham kaynak metne asla dokunulmaz. Eğitim → Ultra Real
  geçişinde "tactile lesson table / Aras-Defne gözlemci" kalıntısı sahnelerde,
  brief'te, IMAGE/MOTION çıktılarında ve önizlemede yaşayamaz.
- Manuel yazılmış Visual Beat aynı register içinde korunur; register değişince uyumsuz
  alan yeniden üretilir (provenance: visualManual + visualReg).
- Production Gate'e yeni sözleşmeler eklendi: eski-register sahne alanı = hard fail,
  mikro sahne israfı + aşırı üretilen-saniye + beat üst sınırı aşımı uyarı/blok.
- Reload artık kayıtlı sahne planını yeniden bölmüyor (boot'taki koşulsuz
  finalizeSceneModel çağrısı yalnız eski-şema migrasyonuna indirildi); manuel
  birleştirme/bölme kalıcıdır.

## Tek kanonik responsive uygulama

- mamilas.html artık hem masaüstü hem mobil: mobil katman (alt navigasyon, üst chip'ler,
  önizleme FAB'ı) dar ekran/mobil cihazda otomatik etkinleşir.
- mobil.html bağımsız runtime olmaktan çıktı; mamilas.html'e yönlendiren küçük bir
  uyumluluk dosyası. index.html de doğrudan mamilas.html'i açar. Çift-dosya drift'i
  kalıcı olarak kapandı.

## Diğer

- Görünür sürüm kalıntıları temizlendi: kenar çubuğundaki "Prime Studio OS · v36"
  etiketi, brief başlığındaki "PRIME BRIEF v34/v35" (artık "MAMILAS PRODUCTION BRIEF"),
  "MAMILAS DESIGN BRIEF v38" (artık "MAMILAS DESIGN BRIEF"), ajan dosyalarının
  başlıklarındaki sürüm kod adları.
- Görünür metin kilidi güçlendi: "NOVA yazısı / NOVA logosu" kalıbı artık EXACT metin
  kilidi üretir (önceden yalnız tırnaklı veya "yazı: X" formatı yakalanıyordu).
- Premiere CSV ve kalite kontrolleri yeni beat modeline (klip süresi ≠ VO süresi)
  hizalandı.
- Otomatik test harness'i eklendi: `07_TESTS/harness.html` — 22 davranış testi
  (segmentasyon, geçiş matrisi, mod izolasyonu, gate, manuel kalıcılık) canlı çalışır.

## Değişmeyenler

- Beş-ajan mimarisi (IDEA/IMAGE/MOTION/SUNO/DESIGN), GPT talimat+knowledge ve Claude
  tek-dosya yapısı korunarak yalnız başlıklar temizlendi.
- VIDEO/DESIGN mod izolasyonu, Proje Kasası, kaynak güvenlik sınırı (SOURCE SECURITY
  BOUNDARY), Türkçe görünür-metin kilidi, FABLE adaptif önizleme motoru.
