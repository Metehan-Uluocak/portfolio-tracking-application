# Hafta 5 - Portföy Hesaplama ve Kar / Zarar Algoritması

## Tamamlananlar
- Portföy için toplam değer, toplam maliyet, toplam kar / zarar ve kar / zarar yüzdesi hesaplama sistemi oluşturuldu.
- Hesaplama mantığı tek bir utility katmanında toplandı.
- Türk Lirası ve ABD Doları arasında dönüşüm yapılabilen yapı eklendi.
- Portföy özeti, oturum açmış kullanıcıya özel varlıklar üzerinden hesaplanır hale getirildi.
- Portföy ekranındaki özet kartları hesaplama motoruna bağlandı.

## Uygulanan Teknik Yapı
- `calculateAssetValue` ile tekil varlık değeri hesaplanıyor.
- `calculateAssetCost` ile tekil varlığın toplam maliyeti hesaplanıyor.
- `calculatePortfolioTotals` ile toplam değer, maliyet, kar / zarar ve yüzde üretiliyor.
- `calculatePortfolioTotalsInCurrency` ile varlıklar hedef para birimine çevrilerek özet hesaplanıyor.

## Güncellenen Dosyalar
- `src/utils/portfolioMath.ts`
- `src/store/portfolioStore.ts`

## Sonuç
Hafta 5 sonunda portföyün finansal özeti gerçek bir hesaplama motoru üzerinden çalışır hale geldi.
Bu yapı, sonraki haftalarda analiz ekranı ve grafikler için gerekli temel metriği hazırlar.