### Youtube kanalı : https://www.youtube.com/playlist?list=PLkXIMkNI7FNIBJTVnU3I7J29IB7vrsSgG

# portfolio-tracking-application
BLM4538 - IOS II dersi için geliştirilen Mobil Yatırım Portföy Takip Uygulaması.

## Proje Amacı
Kullanıcıların hisse, ETF, altın ve benzeri yatırım varlıklarını tek bir mobil uygulama üzerinden takip etmesini sağlamak.
Uygulama; varlık ekleme, alım-satım kaydı tutma, güncel fiyat çekme, toplam portföy değeri hesaplama, performans analizi ve rol bazlı özellikler sunacaktır.

## 10 Adımlı Geliştirme Planı
1. Gereksinim analizi, kapsam netleştirme ve teknik yön belirleme
2. React Native proje kurulumu ve temel klasör yapısının oluşturulması
3. Navigasyon, tema yapısı ve ortak UI temelinin hazırlanması
4. Veri modeli, yerel veri saklama ve kimlik doğrulama altyapısının tasarlanması
5. Finans API araştırması ve fiyat çekme servis katmanının eklenmesi
6. Portföy varlığı ekleme, listeleme ve işlem kaydı ekranlarının geliştirilmesi
7. Portföy hesaplama, kar-zarar mantığı ve özet ekranının tamamlanması
8. Grafikler, zaman aralığı filtreleri ve analiz ekranının eklenmesi
9. Watchlist, roller, premium özellikler ve yönetim akışlarının tamamlanması
10. Test, hata düzeltme, son düzenlemeler ve teslim hazırlığı

## Bugün Tamamlanan Adım
Hafta 2, Hafta 3 ve Hafta 4 kapsamı birlikte tamamlandı.

Bu kapsamda:
- Hafta 2: Kullanıcı sistemi (kayıt/giriş), oturum ve yerel saklama akışı eklendi.
- Hafta 3: Gerçek finans API entegrasyonu (Yahoo Finance + CoinGecko fallback) eklendi.
- Hafta 4: Varlık ekleme, portföy oluşturma ve işlem kaydı ekran akışı tamamlandı.

Hafta 2 kullanıcı sistemi notu için: [Raporlar/hafta-02-kurulum.md](Raporlar/hafta-02-kurulum.md)
Hafta 3 finans API notu için: [Raporlar/hafta-03-ui-navigasyon.md](Raporlar/hafta-03-ui-navigasyon.md)
Hafta 4 varlık ekleme notu için: [Raporlar/hafta-04-varlik-ekleme.md](Raporlar/hafta-04-varlik-ekleme.md)

## Yerel Kurulum ve Çalıştırma
1. Node.js LTS kur (önerilen: 20.x)
2. Proje dizininde bağımlılıkları yükle:
	- `npm install`
3. Geliştirme sunucusunu başlat:
	- `npm run start`
4. Cihazda test:
	- `npm run android` veya `npm run ios`


