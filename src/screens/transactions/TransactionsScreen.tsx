import React from 'react';
import { Text } from 'react-native';
import { typography } from '../../constants/theme';
import { AppScreen } from '../../components/common/AppScreen';

export function TransactionsScreen() {
  return (
    <AppScreen title="İşlem Kayıtları" subtitle="Tüm alım-satım hareketleri tek listede">
      <Text style={styles.subtitle}>Alım-satım gecmişi bu ekranda listelenecek.</Text>
    </AppScreen>
  );
}

const styles = {
  subtitle: {
    ...typography.subtitle,
  },
};
