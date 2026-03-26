import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '../../constants/theme';

export function TransactionsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Islem Kayitlari</Text>
      <Text style={styles.subtitle}>Alim-satim gecmisi bu ekranda listelenecek.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 16,
  },
});
