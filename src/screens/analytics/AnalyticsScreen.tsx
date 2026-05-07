import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle, Path } from 'react-native-svg';
import { typography, colors, spacing } from '../../constants/theme';
import { AppScreen } from '../../components/common/AppScreen';
import { usePortfolioStore, usePortfolioSummary, useUserAssets } from '../../store/portfolioStore';
import { CurrencyCode } from '../../models/asset';

type ChartMode = 'bar' | 'pie';

type HoldingSummary = {
  key: string;
  symbol: string;
  name: string;
  totalValue: number;
  totalCost: number;
  percent: number;
};

const PIE_COLORS = ['#4FC3F7', '#7C4DFF', '#26A69A', '#FFB74D', '#EF5350', '#81C784'];
const PIE_RADIUS = 110;
const PIE_VIEWBOX = 220;
const PIE_CENTER = PIE_VIEWBOX / 2;
const PIE_OUTER_RADIUS = 92;
const PIE_INNER_RADIUS = 71;

function polarToCartesian(cx: number, cy: number, radius: number, angleInDegrees: number) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: cx + radius * Math.cos(angleInRadians),
    y: cy + radius * Math.sin(angleInRadians),
  };
}

function describeDonutSlice(cx: number, cy: number, innerRadius: number, outerRadius: number, startAngle: number, endAngle: number) {
  const outerStart = polarToCartesian(cx, cy, outerRadius, endAngle);
  const outerEnd = polarToCartesian(cx, cy, outerRadius, startAngle);
  const innerStart = polarToCartesian(cx, cy, innerRadius, startAngle);
  const innerEnd = polarToCartesian(cx, cy, innerRadius, endAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

  return [
    'M', outerStart.x, outerStart.y,
    'A', outerRadius, outerRadius, 0, largeArcFlag, 0, outerEnd.x, outerEnd.y,
    'L', innerStart.x, innerStart.y,
    'A', innerRadius, innerRadius, 0, largeArcFlag, 1, innerEnd.x, innerEnd.y,
    'Z',
  ].join(' ');
}

function convertForDisplay(amount: number, from: CurrencyCode, to: CurrencyCode, rate: number) {
  if (from === to) {
    return amount;
  }

  if (from === 'USD' && to === 'TRY') {
    return amount * rate;
  }

  return amount / rate;
}

export function AnalyticsScreen() {
  const displayCurrency = usePortfolioStore((state) => state.displayCurrency);
  const toggleDisplayCurrency = usePortfolioStore((state) => state.toggleDisplayCurrency);
  const summary = usePortfolioSummary();
  const assets = useUserAssets();
  const [chartMode, setChartMode] = React.useState<ChartMode>('bar');

  const breakdown = React.useMemo<HoldingSummary[]>(() => {
    const grouped = new Map<string, HoldingSummary>();

    for (const asset of assets) {
      const sourceCurrency = asset.quoteCurrency ?? 'TRY';
      const key = asset.symbol;
      const totalValue = convertForDisplay(asset.quantity * asset.currentPrice, sourceCurrency, displayCurrency, summary.usdTryRate);
      const totalCost = convertForDisplay(asset.quantity * asset.averageBuyPrice, sourceCurrency, displayCurrency, summary.usdTryRate);

      const current = grouped.get(key);
      if (current) {
        grouped.set(key, {
          ...current,
          totalValue: current.totalValue + totalValue,
          totalCost: current.totalCost + totalCost,
        });
        continue;
      }

      grouped.set(key, {
        key,
        symbol: asset.symbol,
        name: asset.name,
        totalValue,
        totalCost,
        percent: 0,
      });
    }

    const items = Array.from(grouped.values());
    const grandTotal = items.reduce((sum, item) => sum + item.totalValue, 0) || 1;

    return items
      .map((item) => ({
        ...item,
        percent: (item.totalValue / grandTotal) * 100,
      }))
      .sort((a, b) => b.totalValue - a.totalValue);
  }, [assets, displayCurrency, summary.usdTryRate]);

  const chartSlices = React.useMemo(() => {
    let startAngle = 0;

    return breakdown.map((item, index) => {
      const sweepAngle = (item.percent / 100) * 360;
      const slice = {
        key: item.key,
        color: PIE_COLORS[index % PIE_COLORS.length],
        startAngle,
        endAngle: startAngle + sweepAngle,
        item,
      };
      startAngle += sweepAngle;
      return slice;
    });
  }, [breakdown]);

  return (
    <AppScreen title="Analiz" subtitle="Performans ve kar-zarar metrikleri" scrollable>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.toolbar}>
          <Pressable style={styles.iconButton} onPress={() => setChartMode((mode) => (mode === 'bar' ? 'pie' : 'bar'))}>
            <Ionicons
              name={chartMode === 'bar' ? 'pie-chart-outline' : 'stats-chart-outline'}
              size={20}
              color={colors.textPrimary}
            />
          </Pressable>

          <Pressable style={styles.currencyButton} onPress={() => void toggleDisplayCurrency()}>
            <Ionicons name="cash-outline" size={18} color={colors.textPrimary} />
            <Text style={styles.currencyButtonText}>{displayCurrency}</Text>
          </Pressable>
        </View>

        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Toplam Değer</Text>
            <Text style={styles.metricValue}>
              {displayCurrency === 'TRY' ? '₺' : '$'}{summary.totalValue.toFixed(2)}
            </Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Toplam Kar/Zarar</Text>
            <Text style={[styles.metricValue, summary.totalProfit >= 0 ? styles.positive : styles.negative]}>
              {summary.totalProfit >= 0 ? '+' : '-'}{displayCurrency === 'TRY' ? '₺' : '$'}{Math.abs(summary.totalProfit).toFixed(2)}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Varlık Dağılımı</Text>
          {breakdown.length === 0 ? (
            <Text style={styles.empty}>Henüz varlık yok.</Text>
          ) : chartMode === 'pie' ? (
            <View style={styles.piePanel}>
              <View style={styles.donutCard}>
                <Svg width={PIE_VIEWBOX} height={PIE_VIEWBOX} viewBox={`0 0 ${PIE_VIEWBOX} ${PIE_VIEWBOX}`}>
                  <Circle cx={PIE_CENTER} cy={PIE_CENTER} r={PIE_OUTER_RADIUS} fill="#1A2340" />
                  {chartSlices.map((slice) => (
                    <Path
                      key={slice.key}
                      d={describeDonutSlice(PIE_CENTER, PIE_CENTER, PIE_INNER_RADIUS, PIE_OUTER_RADIUS, slice.startAngle, slice.endAngle)}
                      fill={slice.color}
                    />
                  ))}
                  <Circle cx={PIE_CENTER} cy={PIE_CENTER} r={PIE_INNER_RADIUS} fill={colors.surface} />
                </Svg>
                <View pointerEvents="none" style={styles.donutLabelOverlay}>
                  <Text style={styles.donutLabel}>Toplam Portföy</Text>
                  <Text style={styles.donutValue}>
                    {displayCurrency === 'TRY' ? '₺' : '$'}{summary.totalValue.toFixed(2)}
                  </Text>
                  <Text style={styles.donutCaption}>{breakdown.length} varlık</Text>
                </View>
              </View>

              <View style={styles.legendList}>
                {breakdown.map((item, index) => (
                  <View key={item.key} style={styles.legendRow}>
                    <View style={[styles.legendDot, { backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }]} />
                    <View style={styles.legendBody}>
                      <View style={styles.legendTopRow}>
                        <Text style={styles.symbol}>{item.symbol}</Text>
                        <Text style={styles.valueLabel}>
                          {displayCurrency === 'TRY' ? '₺' : '$'}{item.totalValue.toFixed(2)}
                        </Text>
                      </View>
                      <View style={styles.legendTrack}>
                        <View
                          style={[
                            styles.legendFill,
                            {
                              width: `${Math.max(1, Math.round(item.percent))}%`,
                              backgroundColor: PIE_COLORS[index % PIE_COLORS.length],
                            },
                          ]}
                        />
                      </View>
                      <Text style={styles.percentText}>{item.percent.toFixed(1)}%</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          ) : (
            <View style={styles.barChart}>
              {breakdown.map((item, index) => (
                <View key={item.key} style={styles.barRow}>
                  <View style={styles.barHeader}>
                    <View style={styles.labelRow}>
                      <View style={[styles.legendDot, { backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }]} />
                      <Text style={styles.symbol}>{item.symbol}</Text>
                    </View>
                    <Text style={styles.valueLabel}>
                      {displayCurrency === 'TRY' ? '₺' : '$'}{item.totalValue.toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.barBackground}>
                    <View
                      style={[
                        styles.barFill,
                        {
                          width: `${Math.max(1, Math.round(item.percent))}%`,
                          backgroundColor: PIE_COLORS[index % PIE_COLORS.length],
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.percentText}>{item.percent.toFixed(1)}%</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {breakdown.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Detay</Text>
            {breakdown.map((item, index) => (
              <View key={item.key} style={styles.detailRow}>
                <View style={[styles.legendDot, { backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }]} />
                <View style={styles.detailTextBlock}>
                  <Text style={styles.symbol}>{item.symbol}</Text>
                  <Text style={styles.valueLabel}>
                    {displayCurrency === 'TRY' ? '₺' : '$'}{item.totalValue.toFixed(2)} • {item.percent.toFixed(1)}%
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  currencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  currencyButtonText: {
    ...typography.body,
    fontWeight: '700',
  },
  metricsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  metricCard: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  metricLabel: {
    ...typography.caption,
  },
  metricValue: {
    ...typography.subtitle,
    fontWeight: '700',
    marginTop: 6,
  },
  positive: { color: colors.positive },
  negative: { color: colors.negative },
  section: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    ...typography.body,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  empty: {
    ...typography.caption,
  },
  barChart: {
    gap: spacing.md,
  },
  barRow: {
    gap: 8,
  },
  barHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  piePanel: {
    gap: spacing.md,
  },
  donutCard: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutLabelOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  donutValue: {
    ...typography.subtitle,
    fontWeight: '700',
    marginTop: 4,
  },
  donutCaption: {
    ...typography.caption,
    marginTop: 4,
    color: colors.textSecondary,
  },
  legendList: {
    gap: spacing.md,
  },
  legendRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-start',
  },
  legendBody: {
    flex: 1,
  },
  legendTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breakdownMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  symbol: {
    ...typography.body,
    fontWeight: '700',
  },
  valueLabel: {
    ...typography.caption,
  },
  legendTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: '#2A345D',
    overflow: 'hidden',
    marginTop: 8,
  },
  legendFill: {
    height: '100%',
    borderRadius: 999,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  barBackground: {
    height: 14,
    backgroundColor: colors.border,
    borderRadius: 7,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 7,
  },
  percentText: {
    ...typography.caption,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  detailTextBlock: {
    flex: 1,
  },
});
