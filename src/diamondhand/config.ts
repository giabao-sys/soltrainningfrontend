import { Deployments } from './deployments';

export type Configuration = {
  chainId: number;
  etherscanUrl: string;
  defaultProvider: string | string[];
  deployments: Deployments;
  externalTokens?: { [contractName: string]: [string, number] };
  config?: EthereumConfig;
  pollingInterval?: number;
  refreshInterval?: number;
  maxBalanceRefresh?: number;
  maxUnclaimedRefresh?: number;
  defaultSlippageTolerance?: number;
  gasLimitMultiplier?: number;
  backendUrl?: string;
  backendDisabled?: boolean;
  farms?: Farm[];
  vaults?: Vault[];
  abis: {
    SERC20?: any[];
    MasterChef?: any[];
    VaultSLP?: any[];
  };
  addresses: {
    SERC20?: string;
    MasterChef?: string;
    Multicall?: string;
    VaultSLP?: string;
  }
};

export type Market =
  | 'SushiSwap'
  | 'QuickSwap';

export type MarketSymbol = 'SUSHISWAP' | 'QUICKSWAP';

export type EthereumConfig = {
  testing: boolean;
  autoGasMultiplier: number;
  defaultConfirmations: number;
  defaultGas: string;
  defaultGasPrice: string;
  ethereumNodeTimeout: number;
};

export const defaultEthereumConfig = {
  testing: false,
  autoGasMultiplier: 1.5,
  defaultConfirmations: 1,
  defaultGas: '6000000',
  defaultGasPrice: '1000000000000',
  ethereumNodeTimeout: 10000,
};

export type FarmingPool = {
  id?: number;
  token0?: string;
  token1?: string;
  wantSymbol?: string;
  wantToken?: string;
  wantDecimals?: number;
  rewardToken: string;
  isLp: boolean;
  stable?: boolean;
  profitSharing?: boolean;
  coming?: boolean;
  inactive?: boolean;
  market?: Market;
  marketSymbol?: MarketSymbol;
  farmUrl?: string;
  partnerPoolAddress?: string;
  masterChef?: string;
};

export type Farm = {
  masterChef?: string;
  profitSharing?: boolean;
  pools: FarmingPool[];
  rewardTokenSymbol?: string;
  rewardTokenAddress?: string;
  rewardTokenDecimals?: number;
  mintingPool?: string;
  treasury?: string;
  deprecated?: boolean;
  fundAddress?: string;
  inactive?: boolean;
};

export type PoolConfig = {
  masterChefAddress: string;
  id?: number;
  token0?: string;
  token1?: string;
  rewardToken: string;
  wantSymbol?: string;
  wantDecimals?: number;
  addLiquidityUrl?: string;
  removeLiquidityUrl?: string;
  buyUrl?: string;
  isLp: boolean;
  stable?: boolean;
  profitSharing?: boolean;
  coming?: boolean;
  inactive?: boolean;
  market?: Market;
  marketSymbol?: MarketSymbol;
  farmUrl?: string;
  partnerPoolAddress?: string;
};

export type Vault = {
  token0: string;
  token1: string;
  poolId: number;
  market?: Market;
  marketSymbol?: MarketSymbol;
  rewardToken?: string,
  items: VaultItem[];
};

export type VaultItem = {
  owner: string;
  address: string;
};

