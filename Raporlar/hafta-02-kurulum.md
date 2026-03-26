# Hafta 2 Kurulum ve Proje İskeleti

## Bu Hafta Ne Yapıldı
Bu hafta hedef, analizden uygulamaya geçiş için teknik temeli kurmaktı.
Kod tarafında sürdürülebilir ilerleyebilmek için kurulum adımları, klasör yapısı ve geliştirme düzeni netleştirildi ve fiziksel olarak projeye eklendi.

Bu kapsamda:
- Expo + TypeScript tabanlı proje dosyalari eklendi.
- Uygulama klasor mimarisi fiziksel olarak olusturuldu.
- Ekran, bilesen, servis ve model katmanlari dosya bazinda ayrildi.
- Temel navigasyon (tab + stack) calisir sekilde baglandi.
- Zustand store, AsyncStorage servisi ve mock hesaplama akisi eklendi.

## Tamamlanan Dosyalar (Ozet)

### Kök Proje Dosyalari
- `package.json`
- `app.json`
- `babel.config.js`
- `tsconfig.json`
- `App.tsx`

### Navigasyon ve Ekranlar
- `src/navigation/RootNavigator.tsx`
- `src/navigation/types.ts`
- `src/screens/portfolio/PortfolioScreen.tsx`
- `src/screens/transactions/TransactionsScreen.tsx`
- `src/screens/analytics/AnalyticsScreen.tsx`
- `src/screens/watchlist/WatchlistScreen.tsx`

### Ortak Bilesenler
- `src/components/cards/AppCard.tsx`
- `src/components/common/AppButton.tsx`
- `src/components/forms/AppInput.tsx`

### Veri Katmanlari
- `src/models/asset.ts`
- `src/models/transaction.ts`
- `src/models/user.ts`
- `src/models/watchlistItem.ts`
- `src/store/portfolioStore.ts`
- `src/services/storage/portfolioStorage.ts`
- `src/services/api/priceService.ts`
- `src/utils/portfolioMath.ts`
- `src/constants/theme.ts`
- `src/constants/mockData.ts`

## Kurulum Kararları

### Hedef Teknoloji Yığını
- React Native
- Expo
- TypeScript
- React Navigation
- Zustand
- AsyncStorage

### Neden Bu Seçim?
- Expo: Kurulum ve test sürecini hızlandırır.
- TypeScript: Veri modellerinde tip güvenliği sağlar.
- React Navigation: Çok ekranlı akışlar için standart çözümdür.
- Zustand: Küçük ve orta ölçekli state yönetiminde hızlıdır.
- AsyncStorage: MVP için yeterli yerel saklama katmanıdır.

## Dosya Sorumlulukları
- screens: Sayfa seviyesindeki ekranlar
- components: Yeniden kullanılabilir UI parçaları
- services/api: Finans verisi sağlayıcı katmanı
- services/storage: Yerel kayıt işlemleri
- models: Varlık, işlem, kullanıcı tipleri
- store: Uygulama durumu ve state aksiyonları
- navigation: Tab ve stack akışları


## Bu Haftanın Çıktısı
Bu hafta ürünün teknik omurgası tasarlandı.
Böylece sonraki haftalarda geliştirilecek her ekran ve özellik, dağınık olmadan aynı mimari düzen içinde ilerleyebilecek.
