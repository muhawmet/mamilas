# MAMILAS — Test Raporu (2026-06-12)

Tüm testler gerçek tarayıcıda, canlı uygulama üzerinde çalıştırıldı (syntax/DOM-text
kontrolü değil, davranış doğrulaması). Otomatik paket: `07_TESTS/harness.html` —
mamilas.html'i iframe'de açar, 22 testi tek tıkla yeniden koşar.

## Sonuç özeti

| Paket | Sonuç |
|---|---|
| Semantic Beat Planner segmentasyon (8 senaryo, 10 doğrulama) | 10/10 PASS |
| Stale-state geçiş matrisi (7 yön × downstream + gate) | 7/7 PASS |
| Video↔Design state izolasyonu | PASS |
| Boş brief → gate ihracı bloklar | PASS |
| Manuel düzenleme kalıcılığı (Birleştir + kayıt + reload) | 3/3 PASS |
| **Harness toplamı** | **22 PASS / 0 FAIL** |

Harness dışında oturum içinde ayrıca doğrulananlar:

- Konsol hata denetimi: temiz (warn/error yok), masaüstü + mobil boot.
- Önizleme regresyonu: 6 referans ailesi (Pixar dimensional, One Piece adventure,
  Bleach pressure, Apple commercial, civic documentary, product macro) DOM-hash ile
  birbirinden farklı sahneler üretiyor; temsili SVG'ler `previews/` klasöründe.
- 5 zorunlu komple proje (Eğitim 3-sahne + Pixar/Shonen/Bleach ref'leri; hemen ardından
  Ultra Real; Product Hero logo kilidi; insan testimonial; Design modu): brief, sahne
  başına IMAGE + MOTION, SUNO cue, gate — hard failure yok, jenerik fallback prompt yok,
  eğitim kalıntısı yok. (32/32 doğrulama)
- Exact metin kilidi: "NOVA yazısı" → IMAGE prompt'unda `EXACT "NOVA"` + brief'te
  `exact="NOVA"`.
- Kasa A→B→A geçişi: tam state takası, çift yönde sızıntı yok.
- Eski persisted state (beat alanları olmayan şema): açılışta migre olur, render + gate
  PASS, sahne listesi yeniden bölünmez.
- Mobil parite: aynı state/gate/derleyici, mobil katman 375px'te aktif, masaüstünde pasif.
- Refresh/reset/save-load: manuel birleştirme reload sonrası korunur (bu turda bulunan
  ve kapatılan gerçek bug).

## Segmentasyon maliyet karşılaştırması (eski mekanik vs Semantic Beat Planner)

Klip motoru: Kling 3.0 i2v (5s/10s üretim süreleri). Parasal fiyat icat edilmedi;
karşılaştırma üretilen-saniye cinsindendir.

| Senaryo | Mekanik | Dengeli | Ekonomik |
|---|---|---|---|
| "Merhaba Aras. Bugün suyun üç halini öğreneceğiz." | 2 klip / 10 sn | 1 klip / 5 sn (%50) | 1 klip / 5 sn (%50) |
| Üç kısa cümle, aynı görsel olay | 3 klip / 15 sn | 1 klip / 5 sn (%67) | 1 klip / 5 sn (%67) |
| Uzun eğitim metni (su döngüsü, 13 cümle) | 14 klip / 70 sn | 12 klip / 60 sn (%14) | 10 klip / 50 sn (%29) |
| İki bağımsız olaylı tek cümle | 1 klip / 5 sn | 2 klip / 10 sn (güvenlik bölmesi, bilinçli +maliyet) | 2 klip / 10 sn |
| Ürün/logo riski (NOVA kılıf) | 2 klip / 10 sn | 2 klip / 10 sn (birleştirme reddedildi, geometri güvenliği) | 2 klip / 10 sn |

Editoryal gerekçe: tasarruf yalnız anlamı zayıflatmayan yerlerde alınır — selamlama ve
mikro parçalar birleşir, reveal ve bağımsız fiziksel olaylar ayrı kalır, logo/ürün
geometrisi riski birleştirmeyi bloklar. Kaynak kapsama tüm senaryolarda %100.

## Bilinen ve kanıtlanmış kalan riskler

1. **Türkçe sezgisel süre modeli yaklaşıktır** (kelime/2.35 + duraklama): gerçek VO
   kaydı sürelerinden ±%15 sapabilir. Planner alanları override edilebilir olduğundan
   pratik risk düşük; gerçek VO süresi girilirse plan elle düzeltilebilir.
2. **Özne-değişimi sınırı TitleCase sezgiseline dayanır**: küçük harfle yazılmış özel
   adlarda (örn. "defne not defterine...") iki-olay bölmesi tetiklenmeyebilir; bu
   durumda sahne tek beat kalır ve gate yalnız üst sınır aşılırsa uyarır.
3. **mobil.html eski yer imleri** artık yönlendirme dosyasıdır; çevrimdışı tek-dosya
   kullanım isteyen biri mamilas.html'i açmalıdır (KURULUM.md'de belirtildi).
4. **Harness ilk koşusu** iframe çift-reload zamanlamasına duyarlı olabilir; testin
   başında register sabitlenerek deterministikleştirildi, ardışık koşularda 22/22.
