import React from 'react';

import MATICLogo from 'src/assets/img/tokens/MATIC.png';
import SERC20Logo from 'src/assets/img/tokens/ADA.png';
import USDCLogo from 'src/assets/img/tokens/USDC.png';
import SUSHISWAPLogo from '../../assets/img/SUSHISWAP.png';
import QUICKSWAPLogo from '../../assets/img/QUICKSWAP_LOGO.png';
import NoLogo from 'src/assets/img/no-logo.png';
import styled from 'styled-components';

const logosBySymbol: { [title: string]: string } = {
  MATIC: MATICLogo,
  SERC20: SERC20Logo,
  USDC: USDCLogo,
  SUSHISWAP: SUSHISWAPLogo,
  QUICKSWAP: QUICKSWAPLogo,
  NOLOGO: NoLogo,
};

type TokenSymbolProps = {
  symbol: string;
  size?: number;
  noBorder?: boolean;
};

const TokenSymbol: React.FC<TokenSymbolProps> = ({ symbol, size = 64, noBorder = false }) => {
  return (
    <StyleImage
      src={logosBySymbol[symbol] ? logosBySymbol[symbol] : logosBySymbol['NOLOGO']}
      alt={`${symbol} Logo`}
      height={size}
      noBorder={noBorder}
    />
  );
};

export default TokenSymbol;

const StyleImage = styled.img<{ noBorder?: boolean }>``;
