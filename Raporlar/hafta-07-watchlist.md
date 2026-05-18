# Hafta 7 - Watchlist ve UX İyileştirmeleri

## Tamamlananlar
- Watchlist modeli, saklama katmanı ve store akışı eklendi.
- Watchlist ekranına varlık ekleme formu eklendi.
- Watchlist listesi, fiyat bilgisi ve yenileme aksiyonu eklendi.
- Para birimi gösterimi için hızlı geçiş butonu eklendi.

## Teknik Notlar
- Watchlist verileri AsyncStorage içinde tutulur.
- Fiyat yenileme, mevcut watchlist elemanları üzerinden API çağrısı ile çalışır.
- Fiyat alınamayan varlıklar yine de watchliste eklenebilir.

## Güncellenen Dosyalar
- src/models/watchlistItem.ts
- src/services/storage/portfolioStorage.ts
- src/store/portfolioStore.ts
- src/screens/watchlist/WatchlistScreen.tsx

## Sonuç
Hafta 7 sonunda kullanıcı, watchlist oluşturup fiyatlarını yenileyebilir ve temel UX iyileştirmeleriyle uygulamayı daha rahat kullanır.
