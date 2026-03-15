# Hafta 1 Analiz ve Planlama

## Bu Hafta Ne Yapıldı
Bu hafta kod yazmaya başlamadan önce projenin omurgası netleştirildi.
Amaç, bütün sistemi tek seferde kurmaya çalışmak yerine uygulamayı parçalara ayırıp kontrollü ilerlemek.

Bu kapsamda:
- Projenin çekirdek amacı netleştirildi.
- Özellikler temel modüllere ayrıldı.
- 10 adımlı geliştirme planı oluşturuldu.
- İlk sürüm ile ileri seviye özellikler ayrıldı.
- Uygulama için uygun teknik yön belirlendi.

## Proje Modülleri

### 1. Portföy Modülü
Kullanıcının sahip olduğu varlıkları eklemesi, güncellemesi ve izlemesi.

Her varlık için tutulacak temel alanlar:
- Varlık adı
- Sembol
- Varlık tipi
- Alım fiyatı
- Alım tarihi
- Miktar
- Güncel fiyat

### 2. Performans ve Analiz Modülü
- Toplam portföy değeri
- Toplam maliyet
- Toplam kar-zarar tutarı
- Toplam kar-zarar yüzdesi
- Zaman bazlı performans görünümü

### 3. Watchlist Modülü
- Satın alınmamış varlıkları takip etme
- Anlık fiyat değişimi izleme

### 4. Rol ve Yetki Modülü
- Normal kullanıcı
- Premium kullanıcı
- Admin

### 5. Premium Özellikler
- Custom varlık ekleme
- Fiyat alarmı
- CSV dışa aktarma

## MVP ve Sonraya Bırakılacaklar

### İlk sürümde mutlaka olmalı
- Portföye varlık ekleme
- Varlıkları listeleme
- Güncel fiyat gösterimi
- Toplam portföy hesaplama
- Kar-zarar hesaplama
- Basit analiz ekranı
- Watchlist temel akışı

### Daha sonra eklenebilir
- CSV export
- Fiyat alarmı
- Tam admin paneli
- Gelişmiş raporlama
- Daha kapsamlı filtreleme ve sıralama

## Önerilen Teknik Kararlar

### Neden Expo?
Bu proje bir ders projesi olduğu için ilk aşamada hızlı başlamak daha önemli.
Expo seçimi sayesinde:
- Kurulum süresi kısalır
- Cihazda test daha hızlı olur
- Temel React Native akışlarına odaklanılır

### Neden TypeScript?
- Veri modelleri daha güvenli kurulur
- Portföy, işlem ve kullanıcı tipleri daha net tanımlanır
- Proje büyüdükçe hata riski azalır

### Önerilen temel teknoloji listesi
- React Native
- Expo
- TypeScript
- Expo Router veya React Navigation
- AsyncStorage veya SQLite
- Zustand veya Context API

## Önerilen Veri Yapıları

### User
- id
- fullName
- email
- passwordHash veya auth provider bilgisi
- role
- createdAt

### Asset
- id
- userId
- name
- symbol
- type
- quantity
- averageBuyPrice
- buyDate
- currentPrice
- updatedAt

### Transaction
- id
- assetId
- type
- quantity
- unitPrice
- transactionDate

### WatchlistItem
- id
- userId
- symbol
- name
- addedAt

## 10 Adımlı Yol Haritası
1. Analiz, kapsam ve teknik yön
2. Proje kurulumu
3. Navigasyon ve UI temeli
4. Veri modeli ve auth altyapısı
5. Finans API entegrasyonu
6. Portföy CRUD ekranları
7. Hesaplama motoru ve özet ekranları
8. Grafikler ve analiz ekranı
9. Watchlist, roller ve premium özellikler
10. Test, hata düzeltme ve teslim hazırlığı

## Neden Bu Sırayla İlerliyoruz?
Bu sıra, önce iskeleti kurup sonra çekirdek işlevleri yerleştirmek için seçildi.
Böylece erken aşamada karmaşık özelliklere dağılmadan uygulamanın temel değeri çalışır hale gelir.

## Sonraki Adım
Bir sonraki adımda React Native projesinin iskeleti kurulabilir.
Bu aşamada hedef:
- Expo + TypeScript kurulumu
- Klasör yapısının oluşturulması
- Ekran klasörlerinin belirlenmesi
- Navigasyon temelinin hazırlanması

## Bu Haftanın Çıktısı
Kod tarafında henüz bilinçli olarak geliştirme yapılmadı.
Çünkü önce kapsam netleşmeden başlanan projeler genelde tekrar iş çıkartır.
Bu hafta oluşturulan plan, sonraki adımlarda hangi dosyanın neden ekleneceğini ve hangi özelliğin hangi aşamada yapılacağını netleştirir.