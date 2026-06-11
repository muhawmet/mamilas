# MAMILAST — Temizlik Turu (2026-06-11)

v36 FINAL PROOF (PASS) kopyası üzerinde mühendislik-hijyeni turu. Hedef: 7.5/10'daki
kod borcunu kapatmak. Tüm adımlar git checkpoint'li; her adımda 262-anahtarlı
golden-master karşılaştırması + tam test takımı koşuldu.

## Golden-master disiplini

`05_TESTS_AND_REPORTS/golden_dump.js`: 262 deterministik parmak izi (205 ref'in FABLE
sahneleri × 2 palet, 3 brief'in decoder+brief+7 ajan paketi zinciri, 19 sayfa HTML'i,
arama otoritesi, veri alanı bütünlüğü). Davranış-nötr adımlarda "GOLDEN MATCH 262/262"
şartı; kasıtlı değişimlerde diff listesi tek tek doğrulanıp baseline bilinçli yenilendi.

## Silinen ölü kod (golden 262/262 ile kanıtlı davranış-nötr)

1. Ölü `window.pageRecipe` kopyası (71 satır) — canlı "Adaptif Reçete" tanımı kaldı.
2. Rotasız `pageRelease` adası (+ `releaseChecklist`, `releaseText`, 12 satır).
3. 9 ölü window fonksiyonu, `Function.toString()` birebir-kaynak tekniğiyle:
   clearRefSearch, clearSeriesLock, saveSeriesLock, copyDnaMix, mamilasHealSceneNotes,
   mamilasAgentBrief, runMamilasSimulation, primeRefQ, refDnaAffects.
4. 24 tek-satır ölü lokal yardımcı (_field, _refPaths, activeSafe, lerp, fTrain, v32NavBtn...).
   Atlanan: `_gold` (2 tanım, belirsiz — bilinçli bırakıldı). `fableSceneIds` test API'si olarak korundu.

## Sessiz hata yutma bitti

`window.mamiPageError(route,e)`: console.error + görünür Türkçe hata kutusu + "Panele dön".
- recipe/lab rotaları: eskiden hata = beyaz ekran → şimdi hata kutusu.
- reference rotası: eskiden hata = sessizce ESKİ sayfa sürümü render edilirdi (bug gizlenirdi)
  → şimdi hata kutusu. Canlıda kasıtlı patlatma ile doğrulandı.

## Görünür tutarlılık

- Kenar çubuğu etiketi kaynakta gerçek `v36` (çalışma zamanı v34→v35 string-replace
  yaması söküldü; "CINEMA COMMAND" replace'i zaten hiçbir şeyle eşleşmiyordu).
- Başlık şeması tek sisteme indi: ana akış **FAZ 1-5**, reçete detay ekranları
  **REÇETE 1/6–6/6**, araç sayfaları **ARAÇ**, panel **PANEL** (eski: STEP 01-15 +
  ADIM 1-3 + numarasız ADIM/MOOD + "MAMILAS mamilas" karması; iki ayrı STEP 13 vardı).
- `categoryAudit` artık var olmayan eski paket/brief string'lerini değil canlı işaretleri
  kontrol ediyor (RENDER LOCK / SCENE DOSSIER / TURKISH VISIBLE-TEXT LOCK; Path is
  supreme / MAMILAS PROOF DIRECTOR) — Final Brief ve Agent skorları sessizce 78/80'e
  düşmüyor.

## Yeni özellik: 🗄️ Proje Kasası

Dashboard'da 20 slotluk çoklu proje kaydet/yükle/sil. Aktif S durumu adıyla kasaya
alınır (safe-storage; yazılamazsa görünür uyarı), tek tıkla geri yüklenir (onaylı),
müşteriler arası geçiş için. Canlıda uçtan uca doğrulandı: kaydet → durumu boz →
yükle → birebir geri geldi → sil.

## Test

- Yeni: `mamilast_cleanup_test.js` (ölü kod geri dirilmesin, sesli hata yolu, FAZ/REÇETE/ARAÇ
  şeması canlı renderMain üzerinden, v36 etiketi, categoryAudit canlı işaretler, kasa API+döngü).
- Güncellenen beklentiler (kasıtlı davranış değişimi): `v35_runtime_test.js` — içerik-ailesi
  alt grupları (v36 FINAL PROOF'tan) ve "Prime Studio OS · v36" etiketi.
- Sonuç: **7/7 test yeşil** (v35_runtime, v35_static, v35_regression, v36_preview,
  v36_brief_validation, v36_final_proof, mamilast_cleanup) + golden 262/262.

## Bilinçli dokunulmayanlar

- Çok katmanlı override mimarisi düzleştirilmedi (davranış riski >> kazanç); bunun yerine
  hata yolları sesli hale getirildi ve ölü katmanlar silindi.
- İngilizce sayfa başlıkları (mevcut sözleşme: teknik metin İngilizce kalabilir).
- `_gold` çifti ve IIFE-içi çok satırlı küçük ölüler (düşük kazanç, parser riski).
