import { Farm, Market } from "./diamondhand/config";

export const Tokens: { [key: string]: string } = {
  IRON: '0xD86b5923F3AD7b585eD81B448170ae026c65ae9a',
  TITAN: '0xaAa5B9e6c589642f98a1cDA99B9D024B8407285A',
  MATIC: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
  USDC: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
  ETH: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
};

export const createAddLiquidityLink = (marketName: Market, token0: string, token1: string) => {
  switch (marketName) {
    case 'QuickSwap':
      return `https://quickswap.exchange/#/add/${Tokens[token0?.toUpperCase()] || ''}/${
        Tokens[token1?.toUpperCase()] || ''
      }`;
    case 'SushiSwap':
      return `https://app.sushi.com/add/${Tokens[token0?.toUpperCase()] || ''}/${
        Tokens[token1?.toUpperCase()] || ''
      }`;
  }
};

export const createRemoveLiquidityLink = (
  marketName: Market,
  token0: string,
  token1: string,
) => {
  switch (marketName) {
    case 'QuickSwap':
      return `https://quickswap.exchange/#/remove/${Tokens[token0?.toUpperCase()] || ''}/${
        Tokens[token1?.toUpperCase()] || ''
      }`;
    case 'SushiSwap':
      return `https://app.sushi.com/remove/${Tokens[token0?.toUpperCase()] || ''}/${
        Tokens[token1?.toUpperCase()] || ''
      }`;
  }
};

export const buyTokenLinks: { [key: string]: string } = {
  TITAN:
    'https://quickswap.exchange/#/swap?outputCurrency=0xaAa5B9e6c589642f98a1cDA99B9D024B8407285A',
};

/* ROLE CONFIG PARTNER POOL
  - Set farm url if pool in quickswap, dfyn...
  - Set pool id if partner use Iron Finance pool, not set if the opposite */

export const AllFarms: Farm[] = [
  {
    rewardTokenSymbol: 'SERC20',
    rewardTokenDecimals: 6,
    rewardTokenAddress: '0xcB6F356Fb0B7bb57daa6aC96B40C667455Bf35A2',
    profitSharing: true,
    pools: [
      {
        id: 0,
        token0: 'SERC20',
        token1: 'MATIC',
        rewardToken: 'SERC20',
        isLp: true,
        stable: false,
        profitSharing: false,
        market: 'SushiSwap',
        marketSymbol: 'SUSHISWAP',
        partnerPoolAddress: '0x0fd2594cce912b28206576f512453726e9bdfe2f',
        wantSymbol: "SERC20/MATIC"
      },
      {
        id: 1,
        token0: 'SERC20',
        token1: 'USDC',
        rewardToken: 'SERC20',
        isLp: true,
        stable: false,
        profitSharing: false,
        market: 'SushiSwap',
        marketSymbol: 'SUSHISWAP',
        partnerPoolAddress: '0x431c541f69a5d4b5bc9469dd84a31ca26988fd85',
        wantSymbol: "SERC20/USDC"
      },
    ],
  },
];
