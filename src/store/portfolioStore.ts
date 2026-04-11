import { create } from 'zustand';
import { Asset, CurrencyCode } from '../models/asset';
import { Transaction } from '../models/transaction';
import { PersistedUser, User } from '../models/user';
import { fetchUsdTryRate } from '../services/api/priceService';
import {
  clearSessionUserId,
  loadAssetsFromStorage,
  loadSessionUserId,
  loadTransactionsFromStorage,
  loadUsersFromStorage,
  saveAssetsToStorage,
  saveSessionUserId,
  saveTransactionsToStorage,
  saveUsersToStorage,
} from '../services/storage/portfolioStorage';

type AuthResult = {
  ok: boolean;
  message?: string;
};

export type PortfolioState = {
  users: PersistedUser[];
  currentUser: User | null;
  assets: Asset[];
  transactions: Transaction[];
  displayCurrency: CurrencyCode;
  usdTryRate: number;
  isHydrated: boolean;
  hydrate: () => Promise<void>;
  toggleDisplayCurrency: () => Promise<void>;
  refreshUsdTryRate: () => Promise<void>;
  register: (fullName: string, email: string, password: string) => Promise<AuthResult>;
  login: (email: string, password: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
  addAsset: (asset: Asset) => Promise<void>;
  removeAsset: (assetId: string) => Promise<void>;
  replaceAssets: (assets: Asset[]) => Promise<void>;
};

function convertCurrency(amount: number, from: CurrencyCode, to: CurrencyCode, usdTryRate: number): number {
  if (from === to) {
    return amount;
  }

  if (from === 'USD' && to === 'TRY') {
    return amount * usdTryRate;
  }

  return amount / usdTryRate;
}

function normalizeAssetCurrency(asset: Asset): CurrencyCode {
  return asset.quoteCurrency ?? 'TRY';
}

function toPublicUser(user: PersistedUser): User {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
}

export const usePortfolioStore = create<PortfolioState>((set, get) => ({
  users: [],
  currentUser: null,
  assets: [],
  transactions: [],
  displayCurrency: 'TRY',
  usdTryRate: 38,
  isHydrated: false,
  hydrate: async () => {
    const [localAssets, localUsers, localTransactions, sessionUserId] = await Promise.all([
      loadAssetsFromStorage(),
      loadUsersFromStorage(),
      loadTransactionsFromStorage(),
      loadSessionUserId(),
    ]);

    const currentUserRecord = sessionUserId
      ? localUsers.find((user) => user.id === sessionUserId) ?? null
      : null;
    const normalizedAssets = localAssets.map((asset) => ({
      ...asset,
      quoteCurrency: normalizeAssetCurrency(asset),
    }));

    set({
      assets: normalizedAssets,
      users: localUsers,
      transactions: localTransactions,
      currentUser: currentUserRecord ? toPublicUser(currentUserRecord) : null,
      isHydrated: true,
    });

    try {
      const rate = await fetchUsdTryRate();
      set({ usdTryRate: rate });
    } catch {
      // Keep the last known fallback rate if external API is unavailable.
    }
  },
  toggleDisplayCurrency: async () => {
    set((state) => ({ displayCurrency: state.displayCurrency === 'TRY' ? 'USD' : 'TRY' }));
  },
  refreshUsdTryRate: async () => {
    try {
      const rate = await fetchUsdTryRate();
      set({ usdTryRate: rate });
    } catch {
      // Keep existing rate when refresh fails.
    }
  },
  register: async (fullName, email, password) => {
    const normalizedName = fullName.trim();
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();

    if (!normalizedName || !normalizedEmail || !normalizedPassword) {
      return { ok: false, message: 'Lütfen tüm alanları doldurun.' };
    }

    const users = get().users;
    const exists = users.some((user) => user.email.toLowerCase() === normalizedEmail);
    if (exists) {
      return { ok: false, message: 'Bu e-posta zaten kayıtlı.' };
    }

    const newUser: PersistedUser = {
      id: `user-${Date.now()}`,
      fullName: normalizedName,
      email: normalizedEmail,
      password: normalizedPassword,
      role: 'standard',
      createdAt: new Date().toISOString(),
    };

    const nextUsers = [...users, newUser];
    set({ users: nextUsers, currentUser: toPublicUser(newUser) });
    await Promise.all([saveUsersToStorage(nextUsers), saveSessionUserId(newUser.id)]);

    return { ok: true };
  },
  login: async (email, password) => {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();

    if (!normalizedEmail || !normalizedPassword) {
      return { ok: false, message: 'E-posta ve şifre zorunludur.' };
    }

    const user = get().users.find(
      (candidate) =>
        candidate.email.toLowerCase() === normalizedEmail &&
        candidate.password === normalizedPassword,
    );

    if (!user) {
      return { ok: false, message: 'E-posta veya şifre hatalı.' };
    }

    set({ currentUser: toPublicUser(user) });
    await saveSessionUserId(user.id);
    return { ok: true };
  },
  logout: async () => {
    set({ currentUser: null });
    await clearSessionUserId();
  },
  addAsset: async (asset) => {
    const currentUser = get().currentUser;
    if (!currentUser) {
      return;
    }

    const nextAssets = [...get().assets, asset];
    const buyTransaction: Transaction = {
      id: `txn-${Date.now()}`,
      userId: currentUser.id,
      assetId: asset.id,
      symbol: asset.symbol,
      type: 'buy',
      quantity: asset.quantity,
      unitPrice: asset.averageBuyPrice,
      transactionDate: asset.buyDate,
    };
    const nextTransactions = [...get().transactions, buyTransaction];

    set({ assets: nextAssets, transactions: nextTransactions });
    await Promise.all([saveAssetsToStorage(nextAssets), saveTransactionsToStorage(nextTransactions)]);
  },
  removeAsset: async (assetId) => {
    const nextAssets = get().assets.filter((asset) => asset.id !== assetId);
    const nextTransactions = get().transactions.filter((transaction) => transaction.assetId !== assetId);

    set({ assets: nextAssets, transactions: nextTransactions });
    await Promise.all([saveAssetsToStorage(nextAssets), saveTransactionsToStorage(nextTransactions)]);
  },
  replaceAssets: async (assets) => {
    set({ assets });
    await saveAssetsToStorage(assets);
  },
}));

export function useUserAssets() {
  const assets = usePortfolioStore((state) => state.assets);
  const currentUser = usePortfolioStore((state) => state.currentUser);

  if (!currentUser) {
    return [];
  }

  return assets.filter((asset) => asset.userId === currentUser.id);
}

export function useUserTransactions() {
  const transactions = usePortfolioStore((state) => state.transactions);
  const currentUser = usePortfolioStore((state) => state.currentUser);

  if (!currentUser) {
    return [];
  }

  return transactions
    .filter((transaction) => transaction.userId === currentUser.id)
    .sort((a, b) => b.transactionDate.localeCompare(a.transactionDate));
}

export function usePortfolioSummary() {
  const assets = useUserAssets();
  const displayCurrency = usePortfolioStore((state) => state.displayCurrency);
  const usdTryRate = usePortfolioStore((state) => state.usdTryRate);

  const totalValue = assets.reduce(
    (sum, asset) =>
      sum +
      convertCurrency(
        asset.quantity * asset.currentPrice,
        normalizeAssetCurrency(asset),
        displayCurrency,
        usdTryRate,
      ),
    0,
  );

  const totalCost = assets.reduce(
    (sum, asset) =>
      sum +
      convertCurrency(
        asset.quantity * asset.averageBuyPrice,
        normalizeAssetCurrency(asset),
        displayCurrency,
        usdTryRate,
      ),
    0,
  );

  const totalProfit = totalValue - totalCost;
  const totalProfitPercent = totalCost > 0 ? (totalProfit / totalCost) * 100 : 0;

  return {
    totalValue,
    totalCost,
    totalProfit,
    totalProfitPercent,
    currency: displayCurrency,
    usdTryRate,
  };
}
