 # Hafta 6 - Portföy Analiz Ekranı ve Grafik Gösterimleri

## Tamamlananlar
- Analiz ekranı oluşturuldu ve portföyün özet metrikleri gösteriliyor (Toplam değer, Toplam kar/zarar).
- Basit görsel dağılım (bar grafiğe benzeyen yatay doluluk çubukları) eklendi; her varlığın portföy içindeki yüzdesi gösteriliyor.
- Döviz dönüşümü dikkate alınarak görüntüleme para birimine uygun değer hesaplaması sağlandı.

## Teknik Notlar
- Yeni analiz ekranı `src/screens/analytics/AnalyticsScreen.tsx` dosyasında implement edildi.
- Grafik bağımlılığı eklemeden, sadece yerel React Native `View` ile basit dağılım çubukları çizildi. Daha gelişmiş grafikler için `react-native-svg` veya `victory-native` önerilir.

## Sonuç
Hafta 6 sonunda kullanıcı portföyünün dağılımını ve temel performans metriklerini görebiliyor. Daha detaylı zaman serisi grafikleri (sparkline, fiyat grafikleri) sonraki adımda eklenebilir.
