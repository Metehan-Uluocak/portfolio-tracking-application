import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { colors, radius, spacing, typography } from '../../constants/theme';

type AppInputProps = TextInputProps & {
  label?: string;
  errorText?: string;
};

export function AppInput({ label, errorText, ...props }: AppInputProps) {
  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.wrapper, errorText ? styles.wrapperError : null]}>
        <TextInput
          placeholderTextColor={colors.textSecondary}
          style={styles.input}
          {...props}
        />
      </View>
      {errorText ? <Text style={styles.errorText}>{errorText}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  label: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  wrapper: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  wrapperError: {
    borderColor: colors.negative,
  },
  input: {
    color: colors.textPrimary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  errorText: {
    color: colors.negative,
    fontSize: 12,
  },
});
