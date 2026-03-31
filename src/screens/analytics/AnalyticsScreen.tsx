import React from 'react';
import { Text } from 'react-native';
import { typography } from '../../constants/theme';
import { AppScreen } from '../../components/common/AppScreen';

export function AnalyticsScreen() {
  return (
    <AppScreen title="Analiz" subtitle="Performans ve kar-zarar metrikleri">
      <Text style={styles.subtitle}>Kar-zarar ve performans grafigi bu ekranda yer alacak.</Text>
    </AppScreen>
  );
}

const styles = {
  subtitle: {
    ...typography.subtitle,
  },
};
