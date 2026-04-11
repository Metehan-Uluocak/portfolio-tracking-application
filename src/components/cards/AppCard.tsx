import React, { PropsWithChildren } from 'react';
import { StyleProp, StyleSheet, Text, TextStyle, View } from 'react-native';
import { colors, spacing } from '../../constants/theme';

type AppCardProps = PropsWithChildren<{
  title: string;
  titleRight?: React.ReactNode;
  value?: string;
  valueStyle?: StyleProp<TextStyle>;
  subtitle?: string;
}>;

export function AppCard({ title, titleRight, value, valueStyle, subtitle, children }: AppCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>{title}</Text>
        {titleRight}
      </View>
      {value ? <Text style={[styles.value, valueStyle]}>{value}</Text> : null}
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    gap: spacing.xs,
    padding: spacing.lg,
  },
  title: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  titleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  value: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '700',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 13,
  },
});
