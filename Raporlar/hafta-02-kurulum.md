# Hafta 2 - Kullanıcı Sistemi ve Yerel Veri Altyapısı

## Tamamlananlar
- Kayıt ol ve giriş yap akışı eklendi.
- Kullanıcı oturumu (session user id) cihazda saklanır hale getirildi.
- Uygulama açılışında store hydrate edilip kullanıcı oturumu geri yüklenir hale getirildi.
- Login/Register ekranı gerçek store aksiyonlarına bağlandı.
- Çıkış (logout) akışı eklendi.

## Uygulanan Teknikler
- Zustand ile auth state yönetimi (`users`, `currentUser`, `login`, `register`, `logout`).
- AsyncStorage ile kullanıcı listesi ve aktif oturumun kalıcı saklanması.
- Root navigator içinde auth guard:
	- Oturum yoksa `Login`
	- Oturum varsa `MainTabs`

## Güncellenen Dosyalar
- `src/store/portfolioStore.ts`
- `src/services/storage/portfolioStorage.ts`
- `src/screens/auth/LoginScreen.tsx`
- `src/navigation/RootNavigator.tsx`
- `src/navigation/types.ts`
- `src/models/user.ts`

## Sonuç
Hafta 2 sonunda kullanıcı sistemi MVP seviyesinde çalışır hale geldi.
Kullanıcı uygulamaya giriş yapabilir, çıkış yapabilir ve uygulama yeniden açıldığında oturumunu korur.
