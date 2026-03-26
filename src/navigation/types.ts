export type MainTabParamList = {
  Portfolio: undefined;
  Transactions: undefined;
  Analytics: undefined;
  Watchlist: undefined;
};

export type RootStackParamList = {
  MainTabs: undefined;
  AssetDetail: { assetId: string };
};
