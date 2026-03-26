import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '../../constants/theme';
import { AppCard } from '../../components/cards/AppCard';
import { PortfolioState, usePortfolioStore, usePortfolioSummary } from '../../store/portfolioStore';

export function PortfolioScreen() {
  const hydrate = usePortfolioStore((state: PortfolioState) => state.hydrate);
  const isHydrated = usePortfolioStore((state: PortfolioState) => state.isHydrated);
  const summary = usePortfolioSummary();

  React.useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Portfoyum</Text>
      <AppCard
        title="Toplam Deger"
        value={`${summary.totalValue.toFixed(2)} TL`}
        subtitle={isHydrated ? 'Yerel kayitlardan yuklendi' : 'Veri yukleniyor'}
      />
      <AppCard
        title="Toplam Kar/Zarar"
        value={`${summary.totalProfit.toFixed(2)} TL`}
        subtitle={`${summary.totalProfitPercent.toFixed(2)}%`}
      />
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>Portfoy varlik listesi hafta 6'da bu karta eklenecek.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
    padding: spacing.lg,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: '700',
  },
  placeholder: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    padding: spacing.lg,
  },
  placeholderText: {
    color: colors.textSecondary,
  },
});
