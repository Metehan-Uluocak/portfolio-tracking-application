import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../../constants/theme';
import { AppCard } from '../../components/cards/AppCard';
import { AppButton } from '../../components/common/AppButton';
import { AppScreen } from '../../components/common/AppScreen';
import { AppInput } from '../../components/forms/AppInput';
import { AssetType, CurrencyCode } from '../../models/asset';
import { usePortfolioStore, useUserWatchlist } from '../../store/portfolioStore';

const ASSET_TYPES: AssetType[] = ['stock', 'etf', 'gold', 'crypto', 'other'];

function convertCurrency(amount: number, from: CurrencyCode, to: CurrencyCode, usdTryRate: number): number {
  if (from === to) {
    return amount;
  }

  if (from === 'USD' && to === 'TRY') {
    return amount * usdTryRate;
  }

  return amount / usdTryRate;
}

export function WatchlistScreen() {
  const displayCurrency = usePortfolioStore((state) => state.displayCurrency);
  const toggleDisplayCurrency = usePortfolioStore((state) => state.toggleDisplayCurrency);
  const usdTryRate = usePortfolioStore((state) => state.usdTryRate);
  const currentUser = usePortfolioStore((state) => state.currentUser);
  const addWatchlistItem = usePortfolioStore((state) => state.addWatchlistItem);
  const removeWatchlistItem = usePortfolioStore((state) => state.removeWatchlistItem);
  const refreshWatchlistPrices = usePortfolioStore((state) => state.refreshWatchlistPrices);
  const watchlist = useUserWatchlist();

  const [name, setName] = React.useState('');
  const [symbol, setSymbol] = React.useState('');
  const [type, setType] = React.useState<AssetType>('stock');
  const [errorText, setErrorText] = React.useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleAdd = async () => {
    setErrorText(undefined);
    setIsSubmitting(true);

    try {
      const result = await addWatchlistItem({ name, symbol, type });
      if (!result.ok) {
        setErrorText(result.message ?? 'Watchlist ekleme başarısız.');
        return;
      }

      setName('');
      setSymbol('');
      setType('stock');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshWatchlistPrices();
    } finally {
      setIsRefreshing(false);
    }
  };

  const currencySymbol = displayCurrency === 'TRY' ? '₺' : '$';
  const roleLabel = currentUser?.role === 'admin' ? 'Admin' : currentUser?.role === 'premium' ? 'Premium' : 'Standart';
  const watchlistLimit = currentUser?.role === 'standard' ? 5 : null;

  return (
    <AppScreen title="Watchlist" subtitle="Takip ettiğin varlıkları listele ve fiyatlarını yenile" scrollable>
      <View style={styles.container}>
        <AppCard
          title="Yeni Watchlist"
          subtitle={`Rol: ${roleLabel}`}
          titleRight={
            <Pressable onPress={() => void toggleDisplayCurrency()}>
              <Text style={styles.currencyToggle}>{currencySymbol}</Text>
            </Pressable>
          }
        >
          <View style={styles.form}>
            <AppInput label="Varlık Adı" placeholder="Apple" value={name} onChangeText={setName} />
            <AppInput
              label="Sembol"
              placeholder="AAPL"
              autoCapitalize="characters"
              value={symbol}
              onChangeText={setSymbol}
              errorText={errorText}
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
            {watchlistLimit ? (
              <Text style={styles.limitHint}>Standart hesapta en fazla {watchlistLimit} varlık izlenebilir.</Text>
            ) : null}
            <AppButton label="Watchliste Ekle" loading={isSubmitting} onPress={handleAdd} />
          </View>
        </AppCard>

        <AppCard
          title="Takip Listesi"
          subtitle={`${watchlist.length} varlık`}
          titleRight={
            <AppButton
              label={isRefreshing ? 'Güncelleniyor' : 'Fiyatları Yenile'}
              variant="ghost"
              onPress={handleRefresh}
            />
          }
        >
          <View style={styles.list}>
            {watchlist.length === 0 ? (
              <Text style={styles.emptyText}>Henüz watchlistte varlık yok.</Text>
            ) : (
              watchlist.map((item) => {
                const hasPrice = typeof item.lastPrice === 'number' && item.lastPriceCurrency;
                const priceValue = hasPrice
                  ? convertCurrency(item.lastPrice as number, item.lastPriceCurrency as CurrencyCode, displayCurrency, usdTryRate)
                  : null;

                return (
                  <View key={item.id} style={styles.row}>
                    <View style={styles.rowHeader}>
                      <Text style={styles.symbol}>{item.symbol}</Text>
                      <AppButton
                        label="Sil"
                        variant="ghost"
                        onPress={() => {
                          void removeWatchlistItem(item.id);
                        }}
                      />
                    </View>
                    <Text style={styles.name}>{item.name} • {item.type.toUpperCase()}</Text>
                    <Text style={styles.price}>
                      {priceValue !== null
                        ? `${currencySymbol}${priceValue.toFixed(2)}${item.updatedAt ? ` • ${new Date(item.updatedAt).toLocaleDateString('tr-TR')}` : ''}`
                        : 'Fiyat yok'}
                    </Text>
                  </View>
                );
              })
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
  currencyToggle: {
    ...typography.subtitle,
    color: colors.accent,
    fontWeight: '700',
  },
  list: {
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  row: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 10,
    borderWidth: 1,
    padding: spacing.sm,
  },
  rowHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  symbol: {
    ...typography.body,
    fontWeight: '700',
  },
  name: {
    ...typography.subtitle,
    marginTop: spacing.xs,
  },
  limitHint: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  price: {
    ...typography.caption,
    marginTop: spacing.xs,
  },
  emptyText: {
    ...typography.caption,
  },
});
