# Hafta 3 - Finans API Araştırması ve Entegrasyonu

## Tamamlananlar
- `priceService` rastgele değer döndüren yapıdan çıkarılıp gerçek API çağrılarına geçirildi.
- Birincil kaynak olarak Yahoo Finance entegrasyonu eklendi.
- Kripto varlıklar için CoinGecko fallback mekanizması eklendi.
- Servis, sembol ve varlık tipine göre uygun ticker adaylarını deneyen yapıya geçirildi.

## Teknik Notlar
- Yahoo endpoint: `query1.finance.yahoo.com/v8/finance/chart/...`
- Kripto fallback: `api.coingecko.com/api/v3/simple/price`
- Dönen veri artık yalnızca `price` değil, aynı zamanda:
  - `source`
  - `fetchedAt`
  bilgisini de taşır.

## Güncellenen Dosya
- `src/services/api/priceService.ts`

## Sonuç
Hafta 3 sonunda uygulama, internetten gerçek fiyat verisi çekebilir hale geldi.
Bu yapı, Hafta 4'te varlık ekleme sırasında anlık fiyatla portföy oluşturma akışının temelini sağladı.
