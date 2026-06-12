# CODEX SESSION 2 — Final Brief + Scene Editor Failproof

## Bağlam (önce oku)

MAMILAS tek dosyalık yerel web uygulamasıdır: `mamilas.html` (~9.700 satır).
VIDEO modunda akış: kaynak metin → `ingestRaw()` (kayıpsız bölme) →
`finalizeSceneModel()` (anlamsal birleştirme/bölme, Semantic Beat Planner) →
sahne editörü → `buildBriefV32()` (PRODUCTION BRIEF) → `productionGate()` (kalite
kapısı). Test düzeneği `07_TESTS/harness.html`: uygulamayı gizli iframe'de açar,
iç fonksiyonları çağırır, 22 davranış testi koşar.

Bu oturumun amacı: brief üretim hattını "failproof" yapmak — eksik alanlar
sessizce boş brief üretmesin, kod karmaşası azalsın, ve brief'in ajan-kontrat
formatı OTOMATİK test altına alınsın.

İlgili kod bölgeleri (satırlar yaklaşık, grep ile doğrula):
- `ingestRaw()` ~553 (taban tanım) — ve onu saran 7 wrapper: ~1634, ~1917, ~2052,
  ~2332, ~2625, ~3400, ~7201. Her wrapper `var previousIngest = window.ingestRaw`
  kalıbıyla bir öncekini çağırır.
- `finalizeSceneModel()` ~3368; `mergePair()` ~2901; `beatMergeAt()` ~2989;
  `mamilasReplanScenes()` ~3385 (`S.beatKeep={}` burada kurulur).
- `productionGate()` ~7265; `stabilizeScenes()` ~7197; `explicitIds()` ~7114.
- `buildBriefV32()` ~5352; `designBrief()` ~9366 (SESSION_1'de genişletildi).
- Sahne kartı HTML'i `sceneHTML()` ~595 (textarea oninput zincirleri).

## Dokunulmazlar

README.md'deki ortak dokunulmazlar geçerli. Ek:
- `S.scenes` veri şeması değişmez (alan ekleyebilirsin, mevcut alanları
  yeniden adlandıramaz/silemezsin — eski kayıtlar migrate olmalı).
- Anlamsal planlayıcının davranışı (mergeScore eşikleri, mod sınırları)
  DEĞİŞMEZ — bu oturum sağlamlaştırma, ayar değil.

## İş listesi

### 1. ingestRaw zincirini tek pipeline'a refactor et
7 sarmalayıcıyı tek bir kanonik fonksiyona indir:
- Taban `ingestRaw()` içeriğini `ingestCore()` yap.
- Sarmalayıcıların eklediği işleri sırayla tespit et (her birinin diff'ini çıkar:
  hangi ek fonksiyonu çağırıyor) ve tek bir `window.ingestRaw = function(){...}`
  içinde belirgin adımlarla birleştir: `ingestCore() → <ara adımlar sırayla> →
  finalizeSceneModel() → save() → render()`.
- Sıra korunmalı: bugünkü çalışma sırası ne ise yeni tek fonksiyonda aynı sıra.
- Eski sarmalayıcı tanımlarını sil. Başka hiçbir davranış değişmesin.
- Bu refactor'un kanıtı: harness'in 22 testi yeşil + aşağıdaki yeni testler.

### 2. productionGate eksik-alan sözleşmeleri
`productionGate()` çıktısına (mevcut FAIL/WARN yapısını koruyarak) şu kontrolleri
ekle:
- HARD FAIL: kaynak var ama `S.scenes` boş; coverage < 100 (zaten varsa koru).
- WARN (blok değil): `S.client`, `S.objective`, `S.audience` boş; Production Path
  ile World preset'i arasında çözülmemiş conflict (mevcut `conflict()` fonksiyonu
  true dönerken export'a gidiliyorsa).
- Gate sonucu Final Brief sayfasında zaten gösteriliyor; yeni uyarılar aynı
  listede görünmeli.

### 3. beatKeep kalıcılığı
`S.beatKeep` şu an yalnız `mamilasReplanScenes()` içinde kuruluyor ve runtime'da
yaşıyor. Düzelt:
- `defaultState()`'e `beatKeep:{}` ekle; eski kayıtlar yüklenirken yoksa `{}` ata.
- `save()` zaten tüm S'i yazdığı için ek iş yok; sadece null-guard'ları
  (`S.beatKeep && ...`) sadeleştirebilirsin (artık hep var).

### 4. Uzun kaynak guard'ının UI geri bildirimi
`ingestRaw` girişinde 60.000 karakter guard'ı var (toast atıyor ve duruyor).
Bunu görünür yap: Ingest sayfasında textarea altına karakter sayacı ekle
(`<span>` canlı güncellenen, 50.000 üstünde sarı, 60.000 üstünde kırmızı +
"bölmen gerekir" notu).

### 5. Harness'e yeni testler (kritik iş)
`07_TESTS/harness.html` içine mevcut düzeni izleyerek (aynı `ok(name, cond,
detail)` kalıbı) şu testleri ekle:

A) BRIEF-KONTRAT testleri (video):
   Örnek bir proje kur (harness'teki mevcut eğitim senaryosunu kullan),
   `buildBriefV32()` çağır, çıktı string'inde şu başlıkların VARLIĞINI doğrula:
   `MAMILAS`, `SOURCE INTEGRITY`, `WORLD LOCK` veya `RENDER LOCK`, `REFERENCE
   DNA`, `PALETTE`, `SCENE` (dossier/matrix), `FAIL`. Ayrıca: her sahnenin
   `[text#NN]` kimliği brief'te geçiyor; brief'te `undefined` ve `[object Object]`
   geçmiyor.

B) BRIEF-KONTRAT testleri (design):
   DS mock'u doldur (client, headline, body, format seç, jobClass ayarla —
   SESSION_1 alanları), `designBrief()` çağır, doğrula: `MAMILAS DESIGN BRIEF`,
   `CLIENT KIT`, `JOB CLASS`, `COPY LOCK`, `IN-IMAGE`, `CAPTION`, `FORMAT SET`,
   `FAIL CONDITIONS` başlıkları var; `undefined` yok; headline metni brief'te
   karakter karakter mevcut.

C) sourceEnd regresyon testleri:
   - İki sahneyi `beatMergeAt(0)` ile birleştir; birleşen sahnenin
     `sourceEnd === eski b.sourceEnd` ve `sourceLen === source.length` doğrula.
   - Bir sahnenin `source` alanını programatik değiştir (textarea oninput'un
     yaptığı atamaların aynısını uygula) ve `sourceEnd === sourceStart +
     source.length` doğrula.

D) Eksik-alan gate testi:
   Client/objective boş bir projede `productionGate()` çıktısında ilgili WARN
   maddelerinin bulunduğunu doğrula; kaynak + sahneler tamken FAIL olmadığını
   doğrula.

E) Mod geçiş kalıcılık testi:
   Video'da sahne kur → DESIGN moduna geç → DS'e veri yaz → VIDEO'ya dön →
   sahneler ve beatManual bayrakları aynen duruyor; DS verisi de duruyor.

### 6. TEST_REPORT.md güncelle
`07_TESTS/TEST_REPORT.md`'ye yeni test sayısını ve kapsamını ekle; "harness
dışında elle doğrulananlar" listesinden artık otomatize olanları çıkar.

## Kabul kriterleri

1. Söz dizimi komutu (README) `OK`.
2. Harness: eski 22 + yeni testlerin TAMAMI yeşil. Yeni test sayısı ≥ 10.
3. `grep -c "previousIngest" mamilas.html` → 0 (zincir kalktı).
4. Davranış regresyonu yok: harness'teki segmentasyon/geçiş/manuel-kalıcılık
   testleri değişmeden geçiyor (test kodlarını yumuşatmak YASAK — testi değil
   kodu düzelt).
5. Kısa rapor: refactor'da birleştirilen 7 adımın listesi (hangisi ne yapıyordu),
   eklenen testlerin isim listesi.

## Teslim

Değişen dosyalar: `mamilas.html`, `07_TESTS/harness.html`, `07_TESTS/TEST_REPORT.md`.
