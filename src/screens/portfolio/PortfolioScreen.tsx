import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../../constants/theme';
import { AppCard } from '../../components/cards/AppCard';
import { AppButton } from '../../components/common/AppButton';
import { AppScreen } from '../../components/common/AppScreen';
import { AppInput } from '../../components/forms/AppInput';
import { fetchLatestPrice } from '../../services/api/priceService';
import { usePortfolioStore, usePortfolioSummary, useUserAssets } from '../../store/portfolioStore';
import { AssetType, CurrencyCode } from '../../models/asset';

const ASSET_TYPES: AssetType[] = ['stock', 'etf', 'gold', 'crypto', 'other'];

export function PortfolioScreen() {
  const isHydrated = usePortfolioStore((state) => state.isHydrated);
  const currentUser = usePortfolioStore((state) => state.currentUser);
  const addAsset = usePortfolioStore((state) => state.addAsset);
  const removeAsset = usePortfolioStore((state) => state.removeAsset);
  const displayCurrency = usePortfolioStore((state) => state.displayCurrency);
  const toggleDisplayCurrency = usePortfolioStore((state) => state.toggleDisplayCurrency);
  const userAssets = useUserAssets();
  const summary = usePortfolioSummary();
  const currencySymbol = displayCurrency === 'TRY' ? '₺' : '$';
  const isProfitPositive = summary.totalProfit >= 0;
  const totalValueLabel = `${currencySymbol}${summary.totalValue.toFixed(2)}`;
  const profitLabel = `${isProfitPositive ? '+' : '-'}${currencySymbol}${Math.abs(summary.totalProfit).toFixed(2)}`;
  const profitSubtitle = `${isProfitPositive ? 'Karda' : 'Zararda'} • ${summary.totalProfitPercent.toFixed(2)}%`;

  const [name, setName] = React.useState('');
  const [symbol, setSymbol] = React.useState('');
  const [type, setType] = React.useState<AssetType>('stock');
  const [quoteCurrency, setQuoteCurrency] = React.useState<CurrencyCode>('TRY');
  const [quantity, setQuantity] = React.useState('');
  const [buyPrice, setBuyPrice] = React.useState('');
  const [formError, setFormError] = React.useState<string | undefined>();
  const [isSaving, setIsSaving] = React.useState(false);

  const handleCreateAsset = async () => {
    setFormError(undefined);
    if (!currentUser) {
      setFormError('Önce giriş yapmalısın.');
      return;
    }

    const normalizedSymbol = symbol.trim().toUpperCase();
    const normalizedName = name.trim();
    const parsedQuantity = Number(quantity);
    const parsedBuyPrice = Number(buyPrice);

    if (!normalizedName || !normalizedSymbol || !Number.isFinite(parsedQuantity) || !Number.isFinite(parsedBuyPrice)) {
      setFormError('Tüm alanları doğru biçimde doldur.');
      return;
    }

    if (parsedQuantity <= 0 || parsedBuyPrice <= 0) {
      setFormError('Adet ve alış fiyatı 0’dan büyük olmalı.');
      return;
    }

    setIsSaving(true);
    try {
      const latestPrice = await fetchLatestPrice(normalizedSymbol, type);
      const now = new Date().toISOString();
      const normalizedCurrentPrice =
        latestPrice.currency === quoteCurrency
          ? latestPrice.price
          : quoteCurrency === 'TRY'
            ? latestPrice.price * summary.usdTryRate
            : latestPrice.price / summary.usdTryRate;

      await addAsset({
        id: `asset-${Date.now()}`,
        userId: currentUser.id,
        name: normalizedName,
        symbol: normalizedSymbol,
        type,
        quoteCurrency,
        quantity: parsedQuantity,
        averageBuyPrice: parsedBuyPrice,
        currentPrice: normalizedCurrentPrice,
        buyDate: now,
        updatedAt: now,
      });

      setName('');
      setSymbol('');
      setQuantity('');
      setBuyPrice('');
      setFormError(undefined);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Varlık eklenirken hata oluştu.';
      setFormError(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AppScreen
      title="Portföyüm"
      subtitle="Varlık ekle, portföyünü oluştur ve fiyatları API ile güncelle"
      scrollable
    >
      <View style={styles.container}>
        <AppCard
          title="Toplam Değer"
          titleRight={
            <Pressable onPress={() => void toggleDisplayCurrency()}>
              <Text style={styles.currencyToggle}>{currencySymbol}</Text>
            </Pressable>
          }
          value={totalValueLabel}
          subtitle={isHydrated ? 'Yerel kayıtlardan yüklendi' : 'Veri yükleniyor'}
        />
        <AppCard
          title="Toplam Kar/Zarar"
          titleRight={
            <Pressable onPress={() => void toggleDisplayCurrency()}>
              <Text style={styles.currencyToggle}>{currencySymbol}</Text>
            </Pressable>
          }
          value={profitLabel}
          valueStyle={isProfitPositive ? styles.profitPositive : styles.profitNegative}
          subtitle={profitSubtitle}
        />

        <AppCard title="Yeni Varlık Ekle">
          <View style={styles.form}>
            <AppInput label="Varlık Adı" placeholder="Türk Hava Yolları" value={name} onChangeText={setName} />
            <AppInput
              label="Sembol"
              placeholder="THYAO"
              autoCapitalize="characters"
              value={symbol}
              onChangeText={setSymbol}
            />
            <View style={styles.typeRow}>
              {ASSET_TYPES.map((assetType) => (
                <AppButton
                  key={assetType}
                  label={assetType.toUpperCase()}
                  variant={assetType === type ? 'primary' : 'secondary'}
                  onPress={() => setType(assetType)}
                  style={styles.typeButton}
                />
              ))}
            </View>
            <View style={styles.typeRow}>
              {(['TRY', 'USD'] as CurrencyCode[]).map((currency) => (
                <AppButton
                  key={currency}
                  label={currency === 'TRY' ? '₺ TL' : '$ USD'}
                  variant={currency === quoteCurrency ? 'primary' : 'secondary'}
                  onPress={() => setQuoteCurrency(currency)}
                  style={styles.typeButton}
                />
              ))}
            </View>
            <AppInput
              label="Adet"
              placeholder="10"
              keyboardType="decimal-pad"
              value={quantity}
              onChangeText={setQuantity}
            />
            <AppInput
              label="Ortalama Alış Fiyatı"
              placeholder="250"
              keyboardType="decimal-pad"
              value={buyPrice}
              onChangeText={setBuyPrice}
              errorText={formError}
            />
            <AppButton label="Varlığı Ekle" loading={isSaving} onPress={handleCreateAsset} />
          </View>
        </AppCard>

        <AppCard title="Portföy Varlıkları" subtitle={`${userAssets.length} varlık`}>
          <View style={styles.assetList}>
            {userAssets.length === 0 ? (
              <Text style={styles.placeholderText}>Henüz varlık eklenmedi.</Text>
            ) : (
              userAssets.map((asset) => (
                <View key={asset.id} style={styles.assetRow}>
                  <View style={styles.assetHeader}>
                    <Text style={styles.assetSymbol}>{asset.symbol}</Text>
                    <AppButton
                      label="Sil"
                      variant="ghost"
                      onPress={() => {
                        void removeAsset(asset.id);
                      }}
                    />
                  </View>
                  <Text style={styles.assetMeta}>
                    {asset.quantity} adet • {asset.quoteCurrency === 'TRY' ? '₺' : '$'}{asset.currentPrice.toFixed(2)}
                  </Text>
                </View>
              ))
            )}
          </View>
        </AppCard>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
    padding: spacing.lg,
  },
  form: {
    gap: spacing.sm,
  },
  typeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  typeButton: {
    minWidth: 74,
    paddingHorizontal: spacing.md,
  },
  assetList: {
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  assetRow: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 10,
    borderWidth: 1,
    padding: spacing.sm,
  },
  assetHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  assetSymbol: {
    ...typography.body,
    fontWeight: '700',
  },
  assetMeta: {
    ...typography.caption,
  },
  currencyToggle: {
    ...typography.subtitle,
    color: colors.accent,
    fontWeight: '700',
  },
  profitPositive: {
    color: colors.positive,
  },
  profitNegative: {
    color: colors.negative,
  },
  placeholderText: {
    ...typography.caption,
  },
});
