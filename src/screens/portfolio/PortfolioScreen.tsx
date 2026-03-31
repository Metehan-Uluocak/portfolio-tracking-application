import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../../constants/theme';
import { AppCard } from '../../components/cards/AppCard';
import { AppScreen } from '../../components/common/AppScreen';
import { PortfolioState, usePortfolioStore, usePortfolioSummary } from '../../store/portfolioStore';

export function PortfolioScreen() {
  const hydrate = usePortfolioStore((state: PortfolioState) => state.hydrate);
  const isHydrated = usePortfolioStore((state: PortfolioState) => state.isHydrated);
  const summary = usePortfolioSummary();

  React.useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <AppScreen
      title="Portföyüm"
      subtitle="Portföy özeti ve toplam performans"
      scrollable
    >
      <View style={styles.container}>
      <AppCard
        title="Toplam Değer"
        value={`${summary.totalValue.toFixed(2)} TL`}
        subtitle={isHydrated ? 'Yerel kayıtlardan yüklendi' : 'Veri yükleniyor'}
      />
      <AppCard
        title="Toplam Kar/Zarar"
        value={`${summary.totalProfit.toFixed(2)} TL`}
        subtitle={`${summary.totalProfitPercent.toFixed(2)}%`}
      />
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>Portföy varlık listesi hafta 6'da bu karta eklenecek.</Text>
      </View>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
    padding: spacing.lg,
  },
  placeholder: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    padding: spacing.lg,
  },
  placeholderText: {
    ...typography.caption,
  },
});
