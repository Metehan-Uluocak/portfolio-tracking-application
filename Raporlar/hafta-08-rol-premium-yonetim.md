# Hafta 8 - Rol Yönetimi, Premium Özellikler ve Yönetim Paneli

## Tamamlananlar
- Yönetim paneli ekranı eklendi ve kullanıcı rolleri yönetilebilir hale getirildi.
- Admin kullanıcılar için ayrı bir yönetim sekmesi oluşturuldu.
- Premium özellik olarak watchlist için standart hesap limiti uygulandı.
- Premium rolü arayüzde görünür hale getirildi.

## Teknik Notlar
- Yönetim paneli sadece `admin` rolüne sahip kullanıcılar için sekme olarak görünür.
- Roller store üzerinden güncellenir ve AsyncStorage içinde kalıcı hale getirilir.
- Watchlist ekleme akışı standart kullanıcılar için 5 varlık ile sınırlandırılır.

## Güncellenen Dosyalar
- src/screens/admin/AdminScreen.tsx
- src/navigation/RootNavigator.tsx
- src/navigation/types.ts
- src/store/portfolioStore.ts
- src/screens/watchlist/WatchlistScreen.tsx

## Sonuç
Hafta 8 sonunda rol yönetimi tamamlandı, premium kısıtlar tanımlandı ve admin paneli kullanılabilir hale geldi.
