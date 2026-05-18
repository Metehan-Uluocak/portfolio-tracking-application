import { create } from 'zustand';
import { Asset, CurrencyCode } from '../models/asset';
import { Transaction } from '../models/transaction';
import { PersistedUser, User, UserRole } from '../models/user';
import { WatchlistItem } from '../models/watchlistItem';
import { fetchLatestPrice, fetchUsdTryRate } from '../services/api/priceService';
import { calculatePortfolioTotalsInCurrency } from '../utils/portfolioMath';
import {
  clearSessionUserId,
  loadAssetsFromStorage,
  loadSessionUserId,
  loadTransactionsFromStorage,
  loadUsersFromStorage,
  loadWatchlistFromStorage,
  saveAssetsToStorage,
  saveSessionUserId,
  saveTransactionsToStorage,
  saveUsersToStorage,
  saveWatchlistToStorage,
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
  watchlist: WatchlistItem[];
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
  addWatchlistItem: (item: Omit<WatchlistItem, 'id' | 'userId' | 'addedAt'>) => Promise<AuthResult>;
  removeWatchlistItem: (itemId: string) => Promise<void>;
  refreshWatchlistPrices: () => Promise<void>;
  updateUserRole: (userId: string, role: UserRole) => Promise<void>;
};

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
  watchlist: [],
  displayCurrency: 'TRY',
  usdTryRate: 38,
  isHydrated: false,
  hydrate: async () => {
    const [localAssets, localUsers, localTransactions, localWatchlist, sessionUserId] = await Promise.all([
      loadAssetsFromStorage(),
      loadUsersFromStorage(),
      loadTransactionsFromStorage(),
      loadWatchlistFromStorage(),
      loadSessionUserId(),
    ]);

    const adminEmail = 'admin@gmail.com';
    const hasAdmin = localUsers.some((user) => user.email.toLowerCase() === adminEmail);
    const adminSeed: PersistedUser = {
      id: 'user-admin-seed',
      fullName: 'Admin',
      email: adminEmail,
      password: 'admin',
      role: 'admin',
      createdAt: new Date().toISOString(),
    };
    const baseUsers: PersistedUser[] = hasAdmin ? localUsers : [...localUsers, adminSeed];
    const normalizedUsers: PersistedUser[] = baseUsers.map((user) =>
      user.email.toLowerCase() === adminEmail ? { ...user, role: 'admin' as UserRole } : user,
    );
    const seededTestUsers: PersistedUser[] = [
      {
        id: 'user-test-01',
        fullName: 'Test Kullanici 1',
        email: 'test1@demo.local',
        password: '123456',
        role: 'standard' as UserRole,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'user-test-02',
        fullName: 'Test Kullanici 2',
        email: 'test2@demo.local',
        password: '123456',
        role: 'premium' as UserRole,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'user-test-03',
        fullName: 'Test Kullanici 3',
        email: 'test3@demo.local',
        password: '123456',
        role: 'standard' as UserRole,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'user-test-04',
        fullName: 'Test Kullanici 4',
        email: 'test4@demo.local',
        password: '123456',
        role: 'premium' as UserRole,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'user-test-05',
        fullName: 'Test Kullanici 5',
        email: 'test5@demo.local',
        password: '123456',
        role: 'standard' as UserRole,
        createdAt: new Date().toISOString(),
      },
    ];
    const hasSeededTests = normalizedUsers.some((user) => user.id.startsWith('user-test-'));
    const seededUsers = hasSeededTests ? normalizedUsers : [...normalizedUsers, ...seededTestUsers];

    const currentUserRecord = sessionUserId
      ? seededUsers.find((user) => user.id === sessionUserId) ?? null
      : null;
    const normalizedAssets = localAssets.map((asset) => ({
      ...asset,
      quoteCurrency: asset.quoteCurrency ?? 'TRY',
    }));

    if (!hasAdmin || !hasSeededTests || normalizedUsers !== localUsers) {
      await saveUsersToStorage(seededUsers);
    }

    set({
      assets: normalizedAssets,
      users: seededUsers,
      transactions: localTransactions,
      watchlist: localWatchlist,
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
  addWatchlistItem: async (item) => {
    const currentUser = get().currentUser;
    if (!currentUser) {
      return { ok: false, message: 'Önce giriş yapmalısın.' };
    }

    const normalizedSymbol = item.symbol.trim().toUpperCase();
    const normalizedName = item.name.trim();
    if (!normalizedSymbol || !normalizedName) {
      return { ok: false, message: 'Sembol ve isim zorunludur.' };
    }

    const watchlist = get().watchlist;
    const userWatchlistCount = watchlist.filter((entry) => entry.userId === currentUser.id).length;
    if (currentUser.role === 'standard' && userWatchlistCount >= 5) {
      return { ok: false, message: 'Standart hesapta en fazla 5 varlık izlenebilir.' };
    }
    const exists = watchlist.some(
      (entry) => entry.userId === currentUser.id && entry.symbol.toUpperCase() === normalizedSymbol,
    );
    if (exists) {
      return { ok: false, message: 'Bu varlık zaten watchlistte.' };
    }

    let lastPrice: number | undefined;
    let lastPriceCurrency: CurrencyCode | undefined;
    try {
      const latest = await fetchLatestPrice(normalizedSymbol, item.type);
      lastPrice = latest.price;
      lastPriceCurrency = latest.currency;
    } catch {
      // Allow adding to watchlist even if price fetch fails.
    }

    const now = new Date().toISOString();
    const nextItem: WatchlistItem = {
      id: `watch-${Date.now()}`,
      userId: currentUser.id,
      symbol: normalizedSymbol,
      name: normalizedName,
      type: item.type,
      lastPrice,
      lastPriceCurrency,
      updatedAt: lastPrice ? now : undefined,
      addedAt: now,
    };

    const nextWatchlist = [...watchlist, nextItem];
    set({ watchlist: nextWatchlist });
    await saveWatchlistToStorage(nextWatchlist);
    return { ok: true };
  },
  removeWatchlistItem: async (itemId) => {
    const nextWatchlist = get().watchlist.filter((item) => item.id !== itemId);
    set({ watchlist: nextWatchlist });
    await saveWatchlistToStorage(nextWatchlist);
  },
  refreshWatchlistPrices: async () => {
    const watchlist = get().watchlist;
    if (watchlist.length === 0) {
      return;
    }

    const updates = await Promise.all(
      watchlist.map(async (item) => {
        try {
          const latest = await fetchLatestPrice(item.symbol, item.type);
          return {
            ...item,
            lastPrice: latest.price,
            lastPriceCurrency: latest.currency,
            updatedAt: new Date().toISOString(),
          };
        } catch {
          return item;
        }
      }),
    );

    set({ watchlist: updates });
    await saveWatchlistToStorage(updates);
  },
  updateUserRole: async (userId, role) => {
    const users = get().users;
    const nextUsers = users.map((user) => (user.id === userId ? { ...user, role } : user));
    const currentUser = get().currentUser;
    const nextCurrentUser = currentUser && currentUser.id === userId ? { ...currentUser, role } : currentUser;

    set({ users: nextUsers, currentUser: nextCurrentUser ?? null });
    await saveUsersToStorage(nextUsers);
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

export function useUserWatchlist() {
  const watchlist = usePortfolioStore((state) => state.watchlist);
  const currentUser = usePortfolioStore((state) => state.currentUser);

  if (!currentUser) {
    return [];
  }

  return watchlist
    .filter((item) => item.userId === currentUser.id)
    .sort((a, b) => b.addedAt.localeCompare(a.addedAt));
}

export function useAllUsers() {
  return usePortfolioStore((state) => state.users);
}

export function usePortfolioSummary() {
  const assets = useUserAssets();
  const displayCurrency = usePortfolioStore((state) => state.displayCurrency);
  const usdTryRate = usePortfolioStore((state) => state.usdTryRate);

  return calculatePortfolioTotalsInCurrency(assets, displayCurrency, usdTryRate);
}
