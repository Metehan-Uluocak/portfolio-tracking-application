import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { spacing } from '../../constants/theme';
import { AppButton } from '../../components/common/AppButton';
import { AppScreen } from '../../components/common/AppScreen';
import { AppInput } from '../../components/forms/AppInput';
import { usePortfolioStore } from '../../store/portfolioStore';

export function LoginScreen() {
  const login = usePortfolioStore((state) => state.login);
  const register = usePortfolioStore((state) => state.register);

  const [isRegisterMode, setIsRegisterMode] = React.useState(false);
  const [fullName, setFullName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [errorText, setErrorText] = React.useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async () => {
    setErrorText(undefined);
    setIsSubmitting(true);

    try {
      const result = isRegisterMode
        ? await register(fullName, email, password)
        : await login(email, password);

      if (!result.ok) {
        setErrorText(result.message ?? 'İşlem başarısız.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppScreen
      title={isRegisterMode ? 'Kayıt Ol' : 'Giriş'}
      scrollable
    >
      <View style={styles.form}>
        {isRegisterMode ? (
          <AppInput
            label="Ad Soyad"
            placeholder="Ad Soyad"
            value={fullName}
            onChangeText={setFullName}
          />
        ) : null}
        <AppInput
          label="E-posta"
          placeholder="ornek@mail.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <AppInput
          label="Şifre"
          placeholder="******"
          secureTextEntry
          autoCapitalize="none"
          value={password}
          onChangeText={setPassword}
          errorText={errorText}
        />
        <AppButton
          label={isRegisterMode ? 'Kayıt Ol' : 'Giriş Yap'}
          loading={isSubmitting}
          onPress={handleSubmit}
        />
        <AppButton
          label={isRegisterMode ? 'Zaten hesabın var mı? Giriş yap' : 'Hesabın yok mu? Kayıt ol'}
          variant="ghost"
          onPress={() => {
            setErrorText(undefined);
            setIsRegisterMode((value) => !value);
          }}
        />
        {!isRegisterMode ? <Text style={styles.hint}>Demo için önce kayıt oluşturman yeterli.</Text> : null}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: spacing.md,
    paddingTop: spacing.sm,
  },
  hint: {
    opacity: 0.8,
  },
});
