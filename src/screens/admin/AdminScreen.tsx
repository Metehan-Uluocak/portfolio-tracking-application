import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppCard } from '../../components/cards/AppCard';
import { AppButton } from '../../components/common/AppButton';
import { AppScreen } from '../../components/common/AppScreen';
import { colors, spacing, typography } from '../../constants/theme';
import { UserRole } from '../../models/user';
import { useAllUsers, usePortfolioStore } from '../../store/portfolioStore';

const ROLE_OPTIONS: Array<{ value: UserRole; label: string }> = [
  { value: 'standard', label: 'Standart' },
  { value: 'premium', label: 'Premium' },
  { value: 'admin', label: 'Admin' },
];

export function AdminScreen() {
  const users = useAllUsers();
  const currentUser = usePortfolioStore((state) => state.currentUser);
  const updateUserRole = usePortfolioStore((state) => state.updateUserRole);

  return (
    <AppScreen title="Yönetim" subtitle="Kullanıcı rolleri ve premium yetkileri" scrollable>
      <View style={styles.container}>
        <AppCard title="Kullanıcı Listesi" subtitle={`${users.length} kullanıcı`}>
          <View style={styles.list}>
            {users.length === 0 ? (
              <Text style={styles.emptyText}>Kayıtlı kullanıcı bulunmuyor.</Text>
            ) : (
              users.map((user) => (
                <View key={user.id} style={styles.row}>
                  <View style={styles.headerRow}>
                    <Text style={styles.name}>{user.fullName}</Text>
                    <Text style={styles.role}>{user.role.toUpperCase()}</Text>
                  </View>
                  <Text style={styles.email}>{user.email}</Text>
                  {currentUser?.id === user.id ? (
                    <Text style={styles.selfHint}>Bu hesapla giriş yaptın.</Text>
                  ) : null}
                  <View style={styles.buttonRow}>
                    {ROLE_OPTIONS.map((roleOption) => (
                      <AppButton
                        key={`${user.id}-${roleOption.value}`}
                        label={roleOption.label}
                        variant={user.role === roleOption.value ? 'primary' : 'secondary'}
                        onPress={() => {
                          void updateUserRole(user.id, roleOption.value);
                        }}
                        style={styles.roleButton}
                      />
                    ))}
                  </View>
                </View>
              ))
            )}
          </View>
        </AppCard>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
    padding: spacing.lg,
  },
  list: {
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  row: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 10,
    borderWidth: 1,
    padding: spacing.sm,
  },
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  name: {
    ...typography.body,
    fontWeight: '700',
  },
  role: {
    ...typography.caption,
    color: colors.accent,
  },
  email: {
    ...typography.subtitle,
    marginTop: spacing.xs,
  },
  selfHint: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  roleButton: {
    minWidth: 96,
    paddingHorizontal: spacing.md,
  },
  emptyText: {
    ...typography.caption,
  },
});
