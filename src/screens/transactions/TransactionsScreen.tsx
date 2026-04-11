import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../../constants/theme';
import { AppCard } from '../../components/cards/AppCard';
import { AppScreen } from '../../components/common/AppScreen';
import { useUserTransactions } from '../../store/portfolioStore';

export function TransactionsScreen() {
  const transactions = useUserTransactions();

  return (
    <AppScreen title="İşlem Kayıtları" subtitle="Tüm alım-satım hareketleri tek listede">
      <AppCard title="İşlem Geçmişi" subtitle={`${transactions.length} kayıt`}>
        <View style={styles.list}>
          {transactions.length === 0 ? (
            <Text style={styles.emptyText}>Henüz işlem kaydı yok.</Text>
          ) : (
            transactions.map((transaction) => (
              <View key={transaction.id} style={styles.row}>
                <Text style={styles.symbol}>{transaction.symbol}</Text>
                <Text style={styles.subtitle}>
                  {transaction.type.toUpperCase()} • {transaction.quantity} adet • {transaction.unitPrice.toFixed(2)}
                </Text>
              </View>
            ))
          )}
        </View>
      </AppCard>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
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
  symbol: {
    ...typography.body,
    fontWeight: '700',
  },
  subtitle: {
    ...typography.subtitle,
  },
  emptyText: {
    ...typography.caption,
  },
});
