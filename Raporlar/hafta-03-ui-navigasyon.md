# Hafta 3 - Navigasyon, Tema ve Ortak UI Temeli

## Tamamlananlar
- React Navigation stack + bottom tab yapısı kuruldu.
- Merkezi tema yapısı genişletildi:
  - renk tokenları
  - spacing tokenları
  - radius tokenları
  - typography tokenları
  - navigation theme nesnesi
- Ortak UI bileşen temeli tamamlandı:
  - AppScreen
  - AppButton (primary/secondary/ghost, disabled/loading)
  - AppInput (label + error text)
  - AppCard
- Ekranlar ortak AppScreen kabuğuna geçirildi:
  - Portfolio
  - Transactions
  - Analytics
  - Watchlist
  - Login

## Teknik Notlar
- NavigationContainer tema ile çalışır hale getirildi.
- Stack ve Tab screenOptions, tema tokenlarından beslenecek şekilde standartlaştırıldı.
- Safe area ve ekran başlık/alt başlık düzeni tek bir bileşende toplandı.

## Sonraki Adım (Hafta 4)
- Veri modeli, local storage ve kimlik doğrulama akışının domain seviyesinde tamamlanması.
