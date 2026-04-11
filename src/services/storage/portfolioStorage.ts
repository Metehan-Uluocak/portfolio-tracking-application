import AsyncStorage from '@react-native-async-storage/async-storage';
import { Asset } from '../../models/asset';
import { Transaction } from '../../models/transaction';
import { PersistedUser } from '../../models/user';

const PORTFOLIO_STORAGE_KEY = 'portfolio-assets-v1';
const USERS_STORAGE_KEY = 'portfolio-users-v1';
const SESSION_USER_ID_STORAGE_KEY = 'portfolio-session-user-id-v1';
const TRANSACTIONS_STORAGE_KEY = 'portfolio-transactions-v1';

export async function saveAssetsToStorage(assets: Asset[]): Promise<void> {
  await AsyncStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(assets));
}

export async function loadAssetsFromStorage(): Promise<Asset[]> {
  const raw = await AsyncStorage.getItem(PORTFOLIO_STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as Asset[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function saveUsersToStorage(users: PersistedUser[]): Promise<void> {
  await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

export async function loadUsersFromStorage(): Promise<PersistedUser[]> {
  const raw = await AsyncStorage.getItem(USERS_STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as PersistedUser[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function saveSessionUserId(userId: string): Promise<void> {
  await AsyncStorage.setItem(SESSION_USER_ID_STORAGE_KEY, userId);
}

export async function loadSessionUserId(): Promise<string | null> {
  return AsyncStorage.getItem(SESSION_USER_ID_STORAGE_KEY);
}

export async function clearSessionUserId(): Promise<void> {
  await AsyncStorage.removeItem(SESSION_USER_ID_STORAGE_KEY);
}

export async function saveTransactionsToStorage(transactions: Transaction[]): Promise<void> {
  await AsyncStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(transactions));
}

export async function loadTransactionsFromStorage(): Promise<Transaction[]> {
  const raw = await AsyncStorage.getItem(TRANSACTIONS_STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as Transaction[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
