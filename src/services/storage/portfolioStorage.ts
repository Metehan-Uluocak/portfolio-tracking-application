import AsyncStorage from '@react-native-async-storage/async-storage';
import { Asset } from '../../models/asset';

const PORTFOLIO_STORAGE_KEY = 'portfolio-assets-v1';

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
