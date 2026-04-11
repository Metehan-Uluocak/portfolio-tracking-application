# Hafta 4 - Varlık Ekleme ve Portföy Oluşturma

## Tamamlananlar
- Portföy ekranına gerçek varlık ekleme formu eklendi.
- Form alanları:
  - varlık adı
  - sembol
  - varlık tipi
  - adet
  - ortalama alış fiyatı
- Varlık ekleme sırasında fiyat API'sinden güncel fiyat çekilip kaydedilir hale getirildi.
- Eklenen varlıklar kullanıcıya özel olacak şekilde saklanır hale getirildi.
- Varlık ekleme ile birlikte otomatik `buy` işlem kaydı oluşturulmaya başlandı.
- İşlem kayıtları ekranı gerçek transaction verisini listeler hale getirildi.

## Teknik Notlar
- Store içinde kullanıcıya göre filtrelenmiş:
  - `useUserAssets`
  - `useUserTransactions`
  hookları eklendi.
- `Transaction` modeline `userId` ve `symbol` alanları eklendi.
- Portföy toplamları artık oturumdaki kullanıcı varlıkları üzerinden hesaplanır.

## Güncellenen Dosyalar
- `src/screens/portfolio/PortfolioScreen.tsx`
- `src/screens/transactions/TransactionsScreen.tsx`
- `src/store/portfolioStore.ts`
- `src/models/transaction.ts`

## Sonuç
Hafta 4 sonunda kullanıcı, uygulama içinde varlık ekleyerek kendi portföyünü oluşturabilir hale geldi.
Eklenen varlıklar kalıcı olarak saklanır ve işlem geçmişine otomatik yansır.
