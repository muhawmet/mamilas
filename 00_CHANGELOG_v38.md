# MAMILAS PRIME v38 MYTHOS — Changelog (2026-06-12)

> Not: v38 iki paralel oturumda geliştirildi ve bu sürümde SENTEZLENDİ.
> Oturum A (PR #4): motor kâşifi, yazısız-varsayılan tipografi planı, kurumsal set,
> pitch katmanı (SATIŞ/İTİRAZ), işlenmiş örnek üçlüleri, test arşivi.
> Oturum B (bu branch): konsept/dramaturji motorları, format fiziği + DIFF revizyon
> protokolü, IMAGE/MOTION/SUNO derinlik pası ve sitenin VIDEO/DESIGN modu.
> Aşağıdaki içerik birleşik son durumdur.

## Yeni: DESIGN hattı (tam grafik stüdyo)

- **DESIGN ajanı** (`02_GPT_AGENTS/05_DESIGN_GPT.md`, `03_CLAUDE_AGENTS/05_DESIGN_CLAUDE.md`,
  `04_AGENT_KNOWLEDGE/05_DESIGN_KNOWLEDGE.md`): afiş, sosyal medya, kapak, thumbnail,
  billboard, etkinlik görseli. Format fiziği (billboard 3sn/100m, CLP backlit, story UI
  bölgeleri, thumbnail 168px) + kurumsal set (kartvizit spec-sheet, rollup, sunum kapağı,
  etiket), tipografi yasası (tek-H1, Türkçe diakritik yasası, **yazısız-varsayılan +
  TİPOGRAFİ PLANI** — görsel-içi yazı sadece açık istek + yazı-yetenekli motorla ≤3 kelime),
  **MOTOR KÂŞİFİ** (işe göre motor seçimi, scouted/fallback etiketi zorunlu), okuma sırası
  mühendisliği, kompozisyon sistemleri + 4 sessiz test (3-metre/gri-ton/ters-çevir/başlığı-
  kapat), kampanya DNA kilidi, **revizyon protokolü**: üretilen görseli yapıştır →
  kilit-kilit DIFF → KEEP/CHANGE → tek tam revize prompt. Üç giriş modu: pipeline /
  brief-only / freelance (5 satırlık mini brief).
- **Site: üstten 🎬 VIDEO | 🎨 DESIGN mod butonu** (mamilas.html + mobil.html).
  DESIGN modu: Copy → Format → Stil → Export akışı; [copy#] kimlikli copy lock; çoklu
  format seti; mevcut Visual World / Ref DNA / Palet kataloglarını yeniden kullanır;
  MAMILAS DESIGN BRIEF v38 + IDEA/DESIGN handoff exportları.
  State tamamen izole: `mamilas_design_v1` + `mamilas_mode_v1` anahtarları — video
  projesi (`mamilas_reference_engine`), kasa ve reset-undo bayt-bayt aynı kalır.
  Pipeline: SITE → IDEA (konsept) → DESIGN (uygulama) → Nano Banana 2.

## IDEA: dahi rewrite

- **Metafor merdiveni** tanımlandı (rung 1-4); rung 4 ev, rung 3 taban.
- **Concept engine**: 7 adlandırılmış üretim tekniği (sonuç-fizikselleştirme, kavramsal
  harmanlama, ölçek transferi, özne ters çevirme, malzeme ironisi, negatif-alan anlatımı,
  ritüel yakalama) + 3 kill-test (ajans / emsal / ters test). 3 rota = 3 farklı teknik.
- **Character engine**: WANT/NEED/çelişki/alışkanlık zorunlu dörtlüsü; davranış mikro-seçimi
  > poz; casting testi; alışkanlık-ders çarpışması = karakterin value shift'i.
  Aras+Defne oranı korunur, üstüne mikro-seçim yasası gelir.
- **Dramaturji**: value shift, setup/payoff, but/therefore zinciri, sahne silme testi,
  tempo (en sessiz an en büyük reveal'den hemen önce), alt-metin.
- **Design kanalı**: DESIGN BRIEF gelince çıktı tek-kare mimarisine döner (okuma sırası,
  copy yerleşimi, mesafe/başparmak davranışı, kampanya DNA'sı).
- **Hikâye teknikleri** (isimli): soğuk açılış, sonuç-önce, üçleme kuralı, dürüst
  yanıltma→açığa çıkarma, bitişiklik anlamı (Kuleshov); bölüm duygu eğrisi önce adlanır;
  PLANT→PAYOFF çifti dossier'de iki uçtan işaretli (bölüm başına en az bir).
- **İşlenmiş örnek üçlüleri**: EDU/STYLIZED/REAL için kötü→iyi→DAHİ kalibrasyonu.
- **Pitch katmanı**: her rota SATIŞ (müşteriye tek cümle, jargonsuz) + İTİRAZ (muhtemel
  itiraz + tek satır cevap) ile kapanır.
- **Karakter**: want/need/flaw/çelişki/alışkanlık beşlisi; baskı altında SEÇİM yasası;
  marka karakteri formülü (siluet + imza jest + bozulmaz kural); Aras dokunarak test eder,
  Defne iki kez ölçer — preset kilitleri içinde davranış imzaları.

## IMAGE / MOTION / SUNO mythos pası

- IMAGE: ışık dramaturjisi (gizleyen/soran/onaylayan ışık), kompozisyon psikolojisi
  (göz çekim kuvvetleri; motion seed ikinci durakta), statik kare "eternal present" yasası.
- MOTION: mikro-zamanlama (ağırlık zamanı yazar; settle karakteri bir cümledir),
  duygusal kamera grameri (hız = duygu temposu).
- SUNO: motif mimarisi (tekrar değil evrim), sessizlik dramaturjisi (reveal öncesi
  mühendislenmiş sessizlik, STRUCTURE'da açıkça yazılır).
- CORE LAWS v38 tüm knowledge dosyalarında: [copy#] kaynak bütünlüğü + DESIGN stage
  ownership; sürüm başlıkları hizalı (v37'deki split-brain hatası yok).

## Değişmeyenler

- VIDEO hattının çalışması ve Final Brief çıktısı (regresyon ölçütü: bayt-aynı).
- `05_GLOBAL_BRAIN/*` (hesap seviyesi), index.html, motorlar (Nano Banana 2 / Kling 3.0 /
  Suno v5.5).
