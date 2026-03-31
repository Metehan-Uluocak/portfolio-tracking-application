import React from 'react';
import { StyleSheet, View } from 'react-native';
import { spacing } from '../../constants/theme';
import { AppButton } from '../../components/common/AppButton';
import { AppScreen } from '../../components/common/AppScreen';
import { AppInput } from '../../components/forms/AppInput';

export function LoginScreen() {
  return (
    <AppScreen title="Giris" subtitle="Hafta 4'te kimlik dogrulama servisine baglanacak">
      <View style={styles.form}>
        <AppInput label="E-posta" placeholder="ornek@mail.com" keyboardType="email-address" />
        <AppInput label="Sifre" placeholder="******" secureTextEntry />
        <AppButton label="Devam Et" />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: spacing.md,
    paddingTop: spacing.sm,
  },
});
