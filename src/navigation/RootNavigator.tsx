import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../constants/theme';
import { AnalyticsScreen } from '../screens/analytics/AnalyticsScreen';
import { PortfolioScreen } from '../screens/portfolio/PortfolioScreen';
import { TransactionsScreen } from '../screens/transactions/TransactionsScreen';
import { WatchlistScreen } from '../screens/watchlist/WatchlistScreen';
import { MainTabParamList, RootStackParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.textPrimary,
        headerShadowVisible: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 68,
          paddingTop: spacing.sm,
          paddingBottom: spacing.xs,
        },
        tabBarItemStyle: {
          paddingVertical: spacing.xs,
        },
        tabBarIconStyle: {
          marginTop: 2,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarIcon: ({ color, size, focused }) => {
          if (route.name === 'Portfolio') {
            return <Ionicons name={focused ? 'pie-chart' : 'pie-chart-outline'} size={size} color={color} />;
          }

          if (route.name === 'Transactions') {
            return <Ionicons name={focused ? 'swap-horizontal' : 'swap-horizontal-outline'} size={size} color={color} />;
          }

          if (route.name === 'Analytics') {
            return <Ionicons name={focused ? 'bar-chart' : 'bar-chart-outline'} size={size} color={color} />;
          }

          return <Ionicons name={focused ? 'eye' : 'eye-outline'} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Portfolio" component={PortfolioScreen} options={{ title: 'Portföy' }} />
      <Tab.Screen name="Transactions" component={TransactionsScreen} options={{ title: 'İşlemler' }} />
      <Tab.Screen name="Analytics" component={AnalyticsScreen} options={{ title: 'Analiz' }} />
      <Tab.Screen name="Watchlist" component={WatchlistScreen} options={{ title: 'Watchlist' }} />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.textPrimary,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
