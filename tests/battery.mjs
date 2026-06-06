// Fixed, deterministic test battery. These inputs are serialized into a single
// blob and hashed (golden), and drive the ingest/decode coverage. Keep them
// STABLE — changing a brief, mode, or order changes the golden hash on purpose.

export const ROLES = ['idea', 'master', 'image', 'motion', 'proof', 'suno', 'client'];
export const SPLIT_MODES = ['auto', 'labels', 'speaker', 'paragraph', 'line'];
export const ADAPT = [true, false];
export const REPAIR_TYPES = ['AI video gibi', 'plastik', 'gerçek değil', 'source kaybı', 'drone gibi uçmuyor'];

// Representative briefs: one per major keyword group + special split formats.
export const BRIEFS = [
  {
    name: 'edu',
    raw:
      'Aras ve Defne 3. sınıf matematik dersinde sıvı ölçmeyi öğreniyor. ' +
      'Öğretmen ölçü kaplarını masaya diziyor. Çocuklar deney yaparak ölçmeyi keşfediyor. ' +
      'Ders sonunda ölçme birimlerini birlikte tekrar ediyorlar.',
  },
  {
    name: 'product',
    raw:
      'Yeni telefon kılıfı ürün tanıtımı. Ambalaj açılışı ve logo reveal. ' +
      'E-ticaret için temiz hero çekim ve paket detayları.',
  },
  {
    name: 'municipality_labels',
    raw:
      '[text#0001] Belediye başkanı 23 Nisan etkinliğinde vatandaşlara sesleniyor.\n' +
      '[text#0002] Çocuklar bayram coşkusuyla meydanda gösteri yapıyor.\n' +
      '[text#0003] Kamu hizmetleri tanıtımıyla program kapanıyor.',
  },
  {
    name: 'testimonial_speaker',
    raw:
      'DEFNE: Bu kliniğe geldiğimde çok endişeliydim, hasta olarak yalnız hissetmiştim.\n' +
      'ARAS: Doktorlar her adımı sabırla anlattı.\n' +
      'VO: Gerçek hasta deneyimi, gerçek insanlar.',
  },
  {
    name: 'food',
    raw:
      'Burger makro çekimi. Sos akışı ve sıcak buhar yükseliyor. ' +
      'Ardından kahve ve tatlı sunumu, yemek detayları öne çıkıyor.',
  },
  {
    name: 'fashion',
    raw:
      'Moda koleksiyonu editorial çekim. Kumaş dokusu ve tekstil detayları. ' +
      'Mankenler defile ışığında yürüyor.',
  },
  {
    name: 'doc_long',
    raw:
      'Belgesel gerçek mekanda doğal ışıkla çekiliyor. ' +
      'Sabahın ilk ışıkları dağ köyüne vuruyor ve hava soğuk. ' +
      'Yaşlı bir usta elleriyle bakırı dövüyor, kıvılcımlar saçılıyor. ' +
      'Komşular sokakta toplanıp sohbet ediyor, çocuklar koşuşturuyor. ' +
      'Akşam olduğunda lambalar yanıyor ve köy yavaşça sessizleşiyor. ' +
      'Anlatıcı geçmişle bugünü birbirine bağlayan bir cümleyle kapatıyor.',
  },
  {
    name: 'generic',
    raw: 'Marka bilinirliğini artırmak için genel bir tanıtım filmi istiyoruz.',
  },
];
