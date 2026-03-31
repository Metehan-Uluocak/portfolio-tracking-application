import React from 'react';
import { Text } from 'react-native';
import { typography } from '../../constants/theme';
import { AppScreen } from '../../components/common/AppScreen';

export function WatchlistScreen() {
  return (
    <AppScreen title="Watchlist" subtitle="Takip ettiğin varlıkların hızlı görünümü">
      <Text style={styles.subtitle}>Takip edilen varliklar burada listelenecek.</Text>
    </AppScreen>
  );
}

const styles = {
  subtitle: {
    ...typography.subtitle,
  },
};
