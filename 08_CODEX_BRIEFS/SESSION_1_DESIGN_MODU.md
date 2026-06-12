# CODEX SESSION 1 — DESIGN Modunu Yeni Ajan Kontratına Büyütme

## Bağlam (önce oku)

MAMILAS, tek dosyalık bir yerel web uygulamasıdır: `mamilas.html` (~9.700 satır,
HTML+CSS+JS, Türkçe arayüz). İki modu vardır:
- 🎬 VIDEO modu: kaynak metinden sahne planı ve PRODUCTION BRIEF üretir (state: `S`,
  localStorage `mamilas_reference_engine`).
- 🎨 DESIGN modu: statik tasarım (Instagram postu, afiş, billboard...) için DESIGN
  BRIEF üretir (state: `DS`, localStorage `mamilas_design_v1`; mod bayrağı
  `mamilas_mode_v1`).

Brief'ler "reçete"dir: kullanıcı bunları dış AI ajanlarına (IDEA ve DESIGN)
yapıştırır; ajanlar reçeteyi yorumlamadan uygular. Bu oturumda DESIGN modunun
ürettiği reçeteyi, ajanların YENİ kontratıyla birebir hizalayacaksın. Ajan
kontratının özeti (ajan dosyalarını DEĞİŞTİRME, sadece referans):

- DESIGN ajanı artık "yayına hazır" üretir: Türkçe yazı görselin İÇİNDE (EXACT
  kilit), uzun metin Instagram caption'ında. Photoshop adımı yok.
- Ajan, brief'te şu bölümleri bekler: CLIENT KIT, JOB CLASS, COPY LOCK (in-image /
  caption yönlendirmeli), FORMAT SET, CAROUSEL planı (varsa), ÖZEL GÜN bilgisi
  (varsa), GLYPH QA kuralı, REVISION PROTOCOL.
- İş sınıfları (JOB CLASS): `URUN_POSTU`, `KAMPANYA_INDIRIM`, `BILGI_CAROUSEL`,
  `STORY_REELS`, `OZEL_GUN`, `KURUMSAL_DUYURU`, `PRINT_OOH`.

İlgili kod bölgeleri (satır numaraları yaklaşıktır, grep ile doğrula):
- `dDefault()` ~9276: DS alanları. Mevcut: client, brand, campaign, audience,
  copy{headline,sub,body,cta,contact,legal}, logoLock, brandColors, mustKeep,
  formats[], visualWorld, refMix[], palette, notes, revisionRound.
- `DESIGN_FORMATS` ~9282: 12 format tanımı (id, ratio, px, kategori, not).
- `designBrief()` ~9366: DESIGN BRIEF metnini üreten fonksiyon.
- `designPacket(kind)` ~9418: 'idea' ve 'design' ajan paket sarmalayıcıları.
- Design akış sayfaları: `pageDDash`, `pageDSource`, `pageDFormat`, `pageDStyle`,
  `pageDFinal` (DFLOW: ddash → dsource → dformat → dstyle → dfinal).

## Dokunulmazlar

README.md'deki ortak dokunulmazlar aynen geçerli. Ek olarak bu oturumda:
- VIDEO moduna ait hiçbir fonksiyona ve `S` state'ine dokunma.
- Mevcut DS alanlarını YENİDEN ADLANDIRMA (eski kayıtlı state'ler bozulmasın);
  yeni alanlar ekle ve eski kayıtlar için varsayılan değerle migrate et
  (DS yüklenirken eksik alanları `dDefault()` değerleriyle doldur).

## İş listesi

### 1. CLIENT KIT alanları
DS'e ekle: `kitFont` (string, font karakteri — ör. "kurumsal geometrik sans"),
`kitPersonPolicy` (string, kişi/maskot politikası — ör. "başkan fotoğrafı sadece
resmî arşivden"). Mevcut `logoLock`, `brandColors`, `mustKeep` ile birlikte bunlar
artık "CLIENT KIT" bloğudur.
- `pageDStyle` (veya `pageDSource`, hangisi mantıklıysa — kit kimliktir, stil
  sayfası uygundur) içine "Müşteri Kiti" kutusu: Marka Renkleri (#hex), Font
  Karakteri, Logo Kilidi, Kişi/Maskot Politikası, Korunacaklar (mustKeep).
- `designBrief()` çıktısında `== COPY LOCK ==` bölümünden ÖNCE yeni bölüm:

```
== CLIENT KIT ==
Brand colors: <brandColors veya '- (KIT: derived — agent will propose)'>
Font character: <kitFont veya '-'>
Logo/emblem rule: <logoLock veya '-'> — frozen geometry, never redrawn, stretched, recolored or duplicated.
Person/mascot policy: <kitPersonPolicy veya '-'>
Must keep: <mustKeep veya '-'>
Kit law: when fields are set they are absolute; light and type adapt to them, never the reverse.
```

- Eski `Logo lock:` ve `Brand colors:` satırlarını COPY LOCK bölümünden kaldır
  (CLIENT KIT'e taşındılar; bilgi iki yerde yaşamasın).

### 2. JOB CLASS seçici
DS'e ekle: `jobClass` (string, varsayılan `''`). `pageDFormat` üstüne bir seçici
koy (7 seçenek + boş): Ürün Postu / Kampanya–İndirim / Bilgi Carousel'i /
Story–Reels / Özel Gün / Kurumsal Duyuru / Print–OOH.
- Seçim, format önerisini DEĞİŞTİRMEZ (kullanıcı format setini yine kendisi
  seçer) ama brief'e yazılır:

```
== JOB CLASS ==
<sınıf adı + bir satır sınıf yasası>
```

Sınıf yasaları (brief'e aynen, Türkçe):
- URUN_POSTU: "Ürün geometrisi kilitli; tek fayda başlığı (≤6 kelime); 110px küçük resimde okunur kanca."
- KAMPANYA_INDIRIM: "Fiyat/yüzde H1'dir; hiyerarşi teklif → ürün → marka → koşul satırı; koşul satırı asla düşmez."
- BILGI_CAROUSEL: "Tek kampanya: kapak kancası + iç kartlarda kart başına tek fikir + CTA kapanış kartı; iskelet sabit."
- STORY_REELS: "Mesaj orta bantta; üst ~250px / alt ~340px arayüz bölgesidir."
- OZEL_GUN: "Müze ciddiyeti: bayrak geometrisi kutsal, Atatürk/gerçek kişi asla AI ile yeniden çizilmez, anma gününde ticari ton sıfır."
- KURUMSAL_DUYURU: "Sakin grid; bilgi hiyerarşisi NE → NE ZAMAN → NEREDE/NASIL; amblem ve protokol sırası donmuş."
- PRINT_OOH: "Mesafe katmanları format fiziğine göre; brief'in format notları varsayılanı ezer."

### 3. ÖZEL GÜN alanları
DS'e ekle: `specialDay` (string — gün adı, ör. "29 Ekim Cumhuriyet Bayramı"),
`institutionType` (string — ör. "belediye"). `jobClass === 'OZEL_GUN'` iken
`pageDFormat`'ta (seçicinin hemen altında) iki input görünür. Brief'te JOB CLASS
bölümüne iki satır eklenir: `Special day: <gün>` ve `Institution: <kurum>`.
Gün adı `10 Kasım` veya `anma` içeriyorsa brief'e ek satır:
`Memorial register: archive light, restrained palette, ZERO commercial message.`

### 4. CAROUSEL desteği
DS'e ekle: `carouselCards` (number, varsayılan 0 = kapalı), `cardCopy` (object,
`{1:'',2:'',...}` kart başına metin). `jobClass === 'BILGI_CAROUSEL'` iken
`pageDSource`'ta kart sayısı seçici (3–10) ve kart başına birer textarea görünür
(kart 1 etiketi "Kapak — kanca", son kart "CTA/Kapanış", aradakiler "Kart N —
tek fikir").
- Copy ID üretimi: mevcut `dCopyIds()` düzenine ek olarak kart metinleri
  `[copy#cardN]` kimliğiyle sıralanır.
- Brief'te FORMAT SET'ten sonra yeni bölüm (yalnız carousel aktifken):

```
== CAROUSEL PLAN ==
Cards: <N> (4:5, one block per card expected from DESIGN agent)
[copy#card1] COVER (hook only, no body): "<metin>"
[copy#card2] CARD 2 (one idea): "<metin>"
...
[copy#cardN] FINAL (CTA/brand): "<metin>"
Card law: one campaign — skeleton, type levels and accent constant; dominant varies; every inner card ends with forward pull.
```

### 5. COPY yönlendirme (in-image / caption)
`designBrief()` COPY LOCK bölümünde her copy satırına yönlendirme etiketi ekle.
Kural (otomatik): `headline`, `cta` ve `sub` → `IN-IMAGE`; `body`, `contact`,
`legal` → `CAPTION`. Satır formatı:

```
[copy#01] headline (IN-IMAGE): "..."
[copy#04] body (CAPTION): "..."
```

COPY LOCK bölüm sonuna bir satır:
`Routing law: IN-IMAGE copy renders inside the artwork as EXACT frozen geometry (≤ ~12 words total per format); CAPTION copy ships as ready-to-paste Instagram caption text.`

### 6. Engine satırını kontrata hizala
- `designBrief()` içindeki `Pipeline:` satırını şu hale getir:
  `Pipeline: IDEA agent (key-visual concept) → DESIGN agent (engine scout + publish-ready prompts + caption)`
  (Nano Banana 2'yi sabit motor olarak yazma — motoru ajan seçer.)
- `designPacket('design')` metnindeki "format-true Nano Banana 2 prompts"
  ifadesini "engine-scouted, publish-ready prompts (in-image Turkish copy EXACT,
  long copy routed to caption)" ile değiştir; "TYPO SPEC lines for post-typography
  copy" ifadesini kaldır (tipografi planı artık yalnız istek üzerine).

### 7. GLYPH QA — FAIL CONDITIONS güçlendirme
`== FAIL CONDITIONS ==` listesine iki madde ekle:
- `- In-image Turkish word with any latinized glyph (ş→s, ğ→g, ı→i, İ→I, ç→c, ö→o, ü→u) = failed render, automatic first CHANGE line`
- `- Paragraph or contact/legal copy forced into the render instead of the caption`

### 8. dDone / hazırlık göstergesi
`pageDDash`'taki adım-tamamlık mantığı (`dDone`) yeni alanları da saysın:
dsource artık carousel aktifken kart metinleri dolu mu diye bakar; dstyle kit
alanlarından en az birini veya visualWorld'ü ister (mevcut davranışı bozmadan
genişlet).

## Kabul kriterleri

1. Söz dizimi komutu (README) `OK` döner.
2. `07_TESTS/harness.html` — mevcut 22 test yeşil (özellikle "Video ↔ Design mod
   izolasyonu" testi).
3. Manuel senaryo A (Codex kendi çalıştırıp brief çıktısını rapora yapıştırır —
   tarayıcı yoksa designBrief() fonksiyonunu node'da DS mock'uyla çağırarak):
   jobClass=KAMPANYA_INDIRIM, brandColors="#E63946, #1D3557", kitFont="sıcak
   humanist", headline="ERKEN KAYIT BAŞLADI", body uzun bir paragraf →
   brief çıktısında: CLIENT KIT bölümü dolu, JOB CLASS satırı kampanya yasasıyla,
   headline `IN-IMAGE`, body `CAPTION` etiketli, FAIL CONDITIONS'ta glif maddesi.
4. Manuel senaryo B: jobClass=BILGI_CAROUSEL, 5 kart → CAROUSEL PLAN bölümünde
   [copy#card1..card5], kapak "hook only" etiketli, kart yasası satırı mevcut.
5. Manuel senaryo C: jobClass=OZEL_GUN, specialDay="10 Kasım" → Memorial register
   satırı brief'te.
6. Eski kayıt migrasyonu: localStorage'da yeni alanları olmayan eski bir
   `mamilas_design_v1` değeri ile sayfa açılınca hata yok, alanlar varsayılanla
   dolu (DS yükleme yerinde doldurma kodu).
7. VIDEO modu davranışı değişmedi (brief üretimi, sahne editörü aynı).

## Teslim

Değişen tek dosya `mamilas.html` olmalı (başka dosyaya gerek yok). Kısa bir
değişiklik özeti + kabul senaryolarının çıktılarını rapor et.
