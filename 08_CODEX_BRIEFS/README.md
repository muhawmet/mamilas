# CODEX BRIEF'LERİ — Kullanım

Bu klasör, MAMILAS projesinin site/kod tarafındaki işleri Codex'e devretmek için
yazılmış üç oturumluk iş emri içerir. Her brief kendi başına yeterlidir: bağlam,
dokunulmaz kurallar, iş listesi, kabul kriterleri ve test komutu içinde vardır.

## Sıra

1. `SESSION_1_DESIGN_MODU.md` — DESIGN modunu yeni ajan kontratına büyütme
   (client kit, iş sınıfı, carousel, özel gün, caption yönlendirme).
2. `SESSION_2_FAILPROOF.md` — Final Brief + Scene Editor sağlamlaştırma ve
   harness'e kontrat testleri.
3. `SESSION_3_CILA.md` — DESIGN harness testleri, mobil kontrol, doküman ve
   son regresyon.

## Codex'e verme şekli

Her oturumda Codex'e şunları ver:
1. Projenin güncel zip'i (tamamı).
2. İlgili SESSION dosyasının TAM metni (kırpmadan yapıştır).
3. Tek cümle görev: "Bu brief'i uygula; brief'teki dokunulmazlara ve kabul
   kriterlerine harfiyen uy."

Oturum bitince Codex'ten değişen dosyaları al, harness'i tarayıcıda çalıştır
(07_TESTS/harness.html), hepsi yeşilse bir sonraki oturuma geç. Kırmızı varsa
aynı oturumda "şu test kırmızı: <isim> — düzelt" diye geri ver.

## Her oturum için ortak dokunulmazlar

- `02_GPT_AGENTS/`, `03_CLAUDE_AGENTS/`, `04_AGENT_KNOWLEDGE/`, `05_GLOBAL_BRAIN/`
  dosyalarına DOKUNMA (ajan beyinleri ayrı süreçte yönetiliyor).
- VIDEO state (`S`, localStorage `mamilas_reference_engine`) ile DESIGN state
  (`DS`, `mamilas_design_v1`) izolasyonu bozulamaz; ortak alan eklenmez.
- `S.rawVault` (ham kaynak) hiçbir kod yolundan yeniden yazılamaz.
- Kullanıcı arayüzüne görünür sürüm numarası (v34, v39...) eklenmez.
- Mevcut 22 harness testi yeşil kalır; davranış değiştiren her iş kendi testini ekler.
- mamilas.html tek dosyadır; framework/build sistemi eklenmez, dosya bölünmez.
- Her değişiklikten sonra söz dizimi kontrolü: aşağıdaki komut temiz çıkmalı.

```bash
python3 -c "
import re
html=open('mamilas.html',encoding='utf-8').read()
scripts=re.findall(r'<script>(.*?)</script>',html,re.S)
open('/tmp/m_all.js','w',encoding='utf-8').write('\n;\n'.join(scripts))
" && node --check /tmp/m_all.js && echo OK
```
