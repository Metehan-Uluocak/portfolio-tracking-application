import { create } from 'zustand';
import { mockAssets } from '../constants/mockData';
import { Asset } from '../models/asset';
import { calculatePortfolioTotals } from '../utils/portfolioMath';
import { loadAssetsFromStorage, saveAssetsToStorage } from '../services/storage/portfolioStorage';

export type PortfolioState = {
  assets: Asset[];
  isHydrated: boolean;
  hydrate: () => Promise<void>;
  addAsset: (asset: Asset) => Promise<void>;
  replaceAssets: (assets: Asset[]) => Promise<void>;
};

export const usePortfolioStore = create<PortfolioState>((set, get) => ({
  assets: mockAssets,
  isHydrated: false,
  hydrate: async () => {
    const localAssets = await loadAssetsFromStorage();
    if (localAssets.length > 0) {
      set({ assets: localAssets, isHydrated: true });
      return;
    }

    set({ isHydrated: true });
    await saveAssetsToStorage(get().assets);
  },
  addAsset: async (asset) => {
    const nextAssets = [...get().assets, asset];
    set({ assets: nextAssets });
    await saveAssetsToStorage(nextAssets);
  },
  replaceAssets: async (assets) => {
    set({ assets });
    await saveAssetsToStorage(assets);
  },
}));

export function usePortfolioSummary() {
  const assets = usePortfolioStore((state) => state.assets);
  return calculatePortfolioTotals(assets);
}
