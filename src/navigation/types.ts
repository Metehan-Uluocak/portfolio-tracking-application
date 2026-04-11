export type MainTabParamList = {
  Portfolio: undefined;
  Transactions: undefined;
  Analytics: undefined;
  Watchlist: undefined;
  Logout: undefined;
};

export type RootStackParamList = {
  Login: undefined;
  MainTabs: undefined;
  AssetDetail: { assetId: string };
};
