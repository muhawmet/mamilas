# MAMILAS PRIME v36 — Changelog

Date: 2026-06-10
Status: FABLE 5 implementation cycle (reference-specific adaptive preview + library expansion)

## FABLE 5 (2026-06-10, ikinci tur — davranış değişikliği)

Kullanıcı talebi: önizleme üretilecek videonun demosu olsun — One Piece'e tıklayınca
Luffy + aslan başlı yelkenli gelsin; palet değişince sahne aynı kalsın, renkler değişsin;
"BU TAMAM" ile final brief + ajan paketi tek tık.

### Eklendi (hepsi `01_SITE/mamilas.html` sonuna tek FABLE5 IIFE katmanı; mevcut kod değişmedi)

- **Sahne motoru:** `FABLE_SCENES` registry (171 özel sahne) + parametrik aile sahneleri
  (cinedna_*/setup_*/Story DNA/belgesel/ürün...) → 205/205 ref kapsanır, eski motif
  önizlemesine düşen ref yok. `window.refPreviewSVG` override; orijinal fonksiyon fallback
  olarak korunur.
- **Palet adaptivitesi:** sahneler sabit renk içermez; tüm renkler aktif paletin 4 renginden
  türetilir (luminance-sıralı bg/mid/hi + en satüre accent + 12 türev). Sahne kimliği
  `S.reference`'tan, renk `S.palette`'ten — iki eksen bağımsız (test kanıtlı).
- **Tanınabilir stilize figürler SADECE panel içi SVG demosunda** (hasır şapka + yelek,
  turuncu dikenli saç + satır...). Brief/agent/export zinciri değişmedi; preview test
  ajan paketinde `<svg>`/demo sızıntısı olmadığını assert eder.
- **UI:** sağ panel önizleme 96→188px; altında şerit (ref adı + anchor + aktif palet TR);
  refMix rozetleri + önizlemeye tık = sahne döngüsü (`S.fableView`, S.reference'a dokunmaz);
  palet çiplerinde canlı 4'lü swatch + hover = geçici recolor (mouseout geri);
  **"✓ BU TAMAM — BRİEF'İ HAZIRLA"** butonu → route=final + 6 ajan çipi (kopyala) + brief indir.
- **33 yeni referans** (172→205; Game 48→54): anime 12 (MHA, HxH, Vinland, Mob Psycho,
  Berserk, Monster, JoJo, One Punch, Violet, Haikyuu, Vagabond, Abyss), film auteur 8
  (Nolan, Spielberg, Wong Kar-wai, Villeneuve, Malick, Hitchcock, Del Toro, Tarantino),
  marka 7 (IKEA, THY, Red Bull, Chanel, Lego, Mercedes, Spotify), oyun 6 (Sekiro, Witcher,
  Skyrim, Mario, Sonic, Street Fighter). Hepsi IP-safe ad/avoid + curated bestPaths/
  bestPalettes + v35AmacRef kurallarıyla birebir amac. Guarded push — mevcut ref'lerin
  hiçbir alanına dokunulmadı (regression-test kanıtlı).

### Test değişiklikleri (bilinçli)

- `v35_runtime_test.js`: ref sayısı 172→205, Game 48→54 (yalnız bu iki assert).
- `v35_regression_test.js`: refs karşılaştırması prefix-eşitliğe çevrildi — orijinal 172
  ref'in kanonik alanları snapshot'la byte-eşdeğer kalmalı; yeni ref'ler yalnız sona eklenir.
- **Yeni `v36_preview_test.js`:** sahne kapsaması, palet-eksen bağımsızlığı (3 palet,
  iskelet eşitliği), sahnelerde sabit hex yasağı, TAMAM/cycle/hover akışları, export
  izolasyonu. Sonuç: 0 failure.

### Doğrulama (hepsi yeşil)

runtime 0 hata · static 12/12 · regression 0 hata (prefix) · preview 0 hata ·
brief validation 0 flag · `node --check` OK · tarayıcı QA: One Piece sahnesi 3 palette
kompozisyon-sabit/renk-değişken ekran görüntüleri + TAMAM tıklama akışı + konsol 0 hata.

## FABLE 5.1 (2026-06-10, üçüncü tur — bug fix + ajan/knowledge bağlama)

- **Önizleme override bug fix:** sahne döngüsünden kalan `S.fableView` ve DOM yenilenince
  mouseleave kaçırıp yapışan `S.fablePalHover`, yeni seçimleri eziyordu. Kural: her tam
  render hover'ı temizler; `setRef/setProject/setPath/setRefFocus` görünüm state'ini
  sıfırlar; `primeToggleRef/toggleRefDNA` tıklanan ref'i render'dan ÖNCE `fableView`'a
  yazar (tıklanan ref'in sahnesi anında görünür). Üç senaryo canlı tarayıcıda doğrulandı.
- **KNOWLEDGE BINDING:** 8 ajan dosyasının hiçbiri KNOWLEDGE dosyasını kural olarak
  bağlamıyordu. Hepsine kompakt bağlama bloğu eklendi (GPT: `## KNOWLEDGE BINDING`,
  Claude: `<knowledge_binding>`): knowledge = bağlayıcı yasa; çatışma sırası
  user override > Final Brief kilitleri > KNOWLEDGE > prompt stili; ihlalde hangi kilidin
  engellediği tek satırla söylenir. Tüm dosyalar ≤8000B (en büyüğü 4272B), static test 0 hata.
- Denetim notu: ajan + knowledge içerik kalitesi yüksek (register ayrımı, otorite sırası,
  semantik kontaminasyon yasağı, Türkçe görünür-yazı kilidi); brief üretimi (buildBrief /
  agentPacket) yapısal olarak sağlam — içerik değişikliği gerekmedi.
- Final: runtime/preview/regression 0 hata, brief 0 flag; site `9874b3b4…`,
  zip `c445b86e…`.

---

## Önceki tur: production-validation (davranış değişikliği yok)

## Summary

v36 opened a production-validation cycle from a fresh working copy cloned byte-identical
from v35. The v35 application (`01_SITE/mamilas.html`) is unchanged — still
`18b0414c073fd05da2d2e17b2890a35e9dc27689f278cc74710f69da9aa0dfc5`.

## Added (test/report artifacts only)

- `05_TESTS_AND_REPORTS/v36_brief_validation.js` — brief-driven validation harness:
  runs 14 realistic Turkish customer briefs (education, real-commercial, product,
  institutional, stylized + 3 keyword-collision edge probes) through the live decoder and
  adaptive recommender; reports decoded path, register, recommendation strip, and the
  selected/effective/suppressed ref partition.
- `05_TESTS_AND_REPORTS/v36_brief_validation_results.json` — captured results.
- `05_TESTS_AND_REPORTS/V36_PRODUCTION_VALIDATION.md` — full report.

## Findings

- v35 baseline fully re-verified (runtime, static, regression, checksums, ZIP, hashes).
- 11/11 expected-path briefs decoded correctly; 100% source coverage on all 14.
- Keyword-collision briefs resolve via the weighted "Codex final decoder" (score ≥ 4) by
  subject weight, not naive last-match — confirmed good behavior.
- No genuinely misclassified Reference DNA. The skincare-grammar→automotive recommendation
  is intentional (`bestPaths` includes `AUTOMOTIVE_MOBILITY`), not a defect.
- Two recommendation-quality candidates recorded for a future tuning pass (clinical-white
  primary for generic tech brand films; warm-interior primary for outdoor civic events).
  Both are override-able and were NOT promoted — no regression-test-backed defect.

## Not changed (per safe-continuation rules)

- No edit to v35 source, canonical state, ref `cat/use/dna/avoid/bestPaths`, or
  visible-text contract.
- `/Users/Muhammet/Desktop/files` and `source_snapshot/files` untouched.

## Next, if promoting any candidate to a real v36 behavioral change

1. Confirm the candidate is a real user-hesitation point with an actual brief.
2. Implement in `v36/01_SITE/mamilas.html` only.
3. Add a regression test + extend `v36_brief_validation.js`.
4. Re-run runtime/static/regression/brief harnesses, refresh `SHA256SUMS.txt`, rebuild ZIP.
5. Add an audit entry here.

---

# FINAL PROOF — 2026-06-11 (FABLE 5 kapanış denetimi)

Acımasız canlı denetim (port 8736, temiz localStorage) + 3 zor Türkçe brief + ajan/knowledge
taraması yapıldı. Bulgular ve davranış değişiklikleri:

## Bulgular

- **[KRİTİK] Concept-engine kelime sınırı yoktu** — `EDU_BANK` regex'leri alt-dize eşliyordu:
  "İlkokul" → `kök` → fotosentez yaprak konsepti; "MatiK/matematik/otomatik" → `atık` →
  geri dönüşüm konsepti; "birlikte" → `birlik` → basamak-değeri konsepti. En yaygın Türkçe
  eğitim kelimeleri yanlış-alan CONCEPT üretiyordu.
- **[CİDDİ] Ref araması üç parçaya bölünmüştü** — synonym motoru (`searchIntent`) eski bir
  hayalet UI'ya (`data-ref-card` + `#codexRefSearch`) bağlıydı; canlı Reference sayfası düz
  `indexOf` kullanıyor, `id` aramıyordu ("onepiece"/"luffy" → 0 sonuç). Placeholder'lar
  çalışmayan örnek öneriyordu ("altın saat", "anamorfik", "ürün" → 0 sonuç). Reçete araması
  `onchange`-only idi (yazarken tepkisiz).
- **[CİDDİ] İki rakip kategori taksonomisi** — Reference sayfası içerik aileleri (Anime & Manga,
  Oyun...), Reçete §4 alt-grupları DNA-etki torbaları (💡 Işık, 🧬 Genel Gramer) gösteriyordu;
  41 anime ref'inin 23'ü "Işık" altındaydı. One Piece'e ulaşmak kapalı details + anlamsız
  torba taraması gerektiriyordu.
- **[CİDDİ] "Tümü" sekmesi 205 kartı düz listeliyordu** (koddaki yorum gruplama vaat ediyordu).
- **[CİDDİ] Mood akıştan kopuktu** — yalnız gizli Araçlar menüsünde; Reçete'de bağlantı yoktu.
- **[CİDDİ-hafif] Zayıf brief sessizce tahmine gidiyordu** ("uçan araba" → AUTOMOTIVE, uyarısız).
- [KOZMETİK, dokunulmadı] İki `pageRecipe` tanımı (satır ~7893 ölü), STEP/ADIM/FAZ numara
  karması, `categoryAudit`'in eski paket string'lerini araması, sidebar "v34" yazısı.

## Düzeltmeler (hepsi UI/mantık katmanı; ref `cat/use/dna/avoid/bestPaths` alanlarına dokunulmadı)

1. `EDU_BANK`: `\bk[oö]k`, `\btohum`, `\bat[iı]k`, `\bbirlik\b`, `\brakam`, `\bonluk`,
   `\bkesir`, `\bpayda(?![sş])` sınırları eklendi; meşru eşleşmeler korunarak doğrulandı.
2. Tek arama otoritesi: `window.refSearchMatch` (id + synonym + token) expose edildi;
   `searchIntent`'e Türkçe anahtarlar eklendi (altın saat, ürün, belgesel, makro, oyun,
   ışık, gerçek, anamorfik). Reference + Reçete filtreleri buna bağlandı.
3. `refSearchLive` canlı arama gerçek UI'ya bağlandı (`data-ref-card`/`data-ref-hay`
   her iki sayfada); eşleşen kapalı `<details>` otomatik açılır, boş aile grupları gizlenir,
   sayaç (`#codexRefShown`) canlı güncellenir; input'lar `oninput` ile odak kaybetmeden çalışır.
4. Reference "Tümü" görünümü 8 içerik ailesiyle gruplanır; Reçete §4 alt-grupları da aynı
   Türkçe içerik ailelerini kullanır (`window.refContentFamTR`) — DNA-etki rozeti kartta kalır.
5. Reçete'ye "6 · Mood & Yönetmen Kolları" bölümü eklendi (mevcut mood rotasına bağlanır).
6. Decoder zayıf brief'te (≲80 karakter / <12 kelime) görünür Türkçe uyarı ekler:
   "UYARI: brief çok zayıf — ... aşağıdaki kurulum tahmindir."

## Test

- Yeni regresyon testi: `05_TESTS_AND_REPORTS/v36_final_proof_test.js` (boundary vakaları,
  arama otoritesi, sayfa markup'ları, zayıf-brief uyarısı, dokunulmazlar — 205 ref, alan bütünlüğü).
- `v35_runtime_test.js` satır 237 güncellendi: büyük ref grupları artık İÇERİK ailesi
  alt-grubu bekler (kasıtlı davranış değişikliği).
- 6/6 test yeşil: v35_runtime, v35_static, v35_regression (205 ref / 27 visual / 18 material),
  v36_preview (171 özel sahne, palet-bağımsızlık), v36_brief_validation, v36_final_proof.
- Canlı doğrulama: "luffy"/"onepiece"/"altın saat"/"ürün" her iki aramada sonuç döndürür;
  One Piece'e Anime sekmesi veya tek aramayla ≤2 adımda ulaşılır; console temiz.

## Karar

**FINAL PROOF: PASS** — v36 kapanmıştır.
