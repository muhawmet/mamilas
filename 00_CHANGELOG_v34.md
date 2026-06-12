# MAMILAS PRIME v34 — CHANGELOG (2026-06-10)

## v34.5.1 — İÇ-DURUM TUTARLILIĞI (3. cerrahî fix, 2026-06-10)
- Bağımsız doğrulama (DOM-shim + Node runtime harness): H1–H8 fix'lerinin hepsi landed, çıktıda **gerçek clay sızıntısı sıfır** (tüm "clay" geçişleri negatif/avoid kurallarında). Decoder guard doğru (su döngüsü→EDU, çorba→FOOD).
- Tek kozmetik kalıntı giderildi: eski katman `ensureV32State`/`syncLegacy` yalnız 8-girişli world haritası kullanıyordu; v34'ün tam `VIS2WORLD` (21 giriş) haritasıyla eşitlendi. Artık legacy `S.world` her dünyada doğru (watercolor→paper, low_poly→wood, chalk→notebook, pixar→clay...). Çıktıyı etkilemiyordu (aktif `renderLock()` `VIS()` okur) ama iç durum artık tutarlı.

## KRİTİK ONARIMLAR (cerrahî, 2 satır)
- `ensureV32State` ve `syncLegacy` her stylized path'te `S.world='clay'` yazıyordu → Arcane/Spider-Verse briefleri PIXAR CLAY render lock alıyordu. Düzeltildi: EDU'da teachingMaterial, diğer stylized'da visualWorld→dünya haritası.

## PRIME v34 KATMANI (append-only, ~700 satır)
- **3 kayıtlı kavram motoru** — EDU (36+ müfredat kalıbı + su döngüsü 5 aşama), STYLIZED (12 Arcane/Spider-Verse grameri girişi), REAL (path-ailesi başına banka: PRODUCT/FOOD/CIVIC/EVENT/TESTIMONIAL/FASHION/TOURISM/AUTO/TECH/ARCH/SOCIAL/HEALTH/HISTORY, ~50 giriş). Kayıtlar arası sızıntı imkânsız.
- **Puanlı eşleştirme** — en çok anahtar vuran kavram kazanır; dedupe ikinci sıradaki GERÇEK kavrama düşer, meta-metne değil.
- **Render Lock v2** — V32 visual shell+grain'den verbatim cümle; EDU'da malzeme; REAL'de path dünyası. Her image promptun ilk cümlesi.
- **Ref DNA → direktif** — doku çorbası yerine CAMERA/LIGHT/STAGING/MOTION direktifleri; doku promptta en fazla 1 cümle.
- **Suno 15 path tablosu** — her path'e enstrüman+BPM+mekân+arc.
- **PROJECT2VIS** — preset seçimi doğru görsel dünyaya iner (spiderverse→spiderverse_texture vb.).
- **Decoder müfredat bekçisi** — zayıf ticari kelime ders briefini real path'e kaçıramaz.
- **Yeni nav** — 5 faz: Brief → Reçete → Sahneler → Prompt Lab → Export; araçlar katlanır; mobil alt bar aynı akış.
- **Reçete sayfası** — tek ekranda Proje/Görsel Dünya/Malzeme/Ref Mix(3)/Palet + canlı render lock önizleme.
- **Prompt Lab (kendi rotası)** — sahne başına kopyala-yapıştır Image+Motion, Q skoru, kavram✓/fallback rozeti, 🎲 varyant (kamera+ışık döngüsü), toplu TXT export.

## TEST: 14/14 PASS
education, stylized_premium, spiderverse, ultra_real, product_hero, municipality(23 Nisan), testimonial, food, fashion, tourism, automotive, tech_medical, event(özel gün), history(10 Kasım) — lock ✓ kavram ✓ sızıntı ✓ Kling yasaklı kelime 0 ✓ suno path'e özel ✓. UI 22 rota render ✓, nav ✓, varyant ✓. node --check temiz.

## AJANLAR
8 talimat dosyası (GPT+Claude × Idea/Image/Motion/Suno) PRIME v34 grameriyle yeniden yazıldı: 3 kayıt sistemi, render lock verbatim kuralı, DNA direktif tüketimi, Kling kelime yasası, Suno path tablosu. Knowledge dosyaları korundu.

## v34.5 — REÇETE + DNA DERINLEŞTIRME (2026-06-10)
- **DNA çevirmen 2 kat derin**: +17 yeni direktif ailesi (komedi zamanlaması, noir, neon-impact, anı sıcaklığı, deco, melankoli, mecha ağırlığı, spor arena...). Ref adları da havuza dahil; ref sözleri görsel dünyaya ÖNCELİKLİ. Ölçüm: 173 ref'te benzersiz direktif seti 34 → **131** (en büyük kopya küme 63 → 14).
- **+6 REAL görsel dünya**: Gece Şehir (otomotiv), Klinik Beyaz (medikal), Karanlık Editorial Stüdyo (moda), Golden Hour Lokasyon (turizm), Sıcak İç Mekân (özel gün), Arşiv/Anma (10 Kasım). Presetler otomatik doğru dünyaya iner; render lock shell+grain'den verbatim.
- **Reçete yeniden**: yapışkan özet barı (proje·dünya·ref·palet·register) + katlanır render lock önizleme; 🔍 ref arama; seçili refler üstte pinli (dokun-kaldır); kategoriler aktif register'a göre sıralı, uyumsuzlar "Register dışı" altında soluk; 14+ ref'li kategoriler DNA ailesine göre alt gruplu (💡Işık/🎥Kamera/📐Kompozisyon/🎨Doku); görsel dünya ve palet çiplerinde renk noktaları; dünya seçince EN İYİ/KAÇIN bilgisi.
- Test: 14/14 PASS, UI 22 rota ✓, arama ✓, node --check temiz.
