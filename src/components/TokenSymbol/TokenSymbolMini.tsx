import React from 'react';

import MATICLogo from 'src/assets/img/tokens/MATIC.png';
import ETHLogo from 'src/assets/img/tokens/ETH.png';
import SERC20Logo from 'src/assets/img/tokens/ADA.png';
import USDCLogo from 'src/assets/img/tokens/USDC.png';
import NoLogo from 'src/assets/img/no-logo.png';
import styled from 'styled-components';

const logosBySymbol: { [title: string]: string } = {
  MATIC: MATICLogo,
  ETH: ETHLogo,
  SERC20: SERC20Logo,
  USDC: USDCLogo,
  NOLOGO: NoLogo,
};

type TokenSymbolProps = {
  symbol: string;
};

const TokenSymbolMini: React.FC<TokenSymbolProps> = ({ symbol }) => {
  return (
    <StyledBankIconWrapper>
      <img
        src={logosBySymbol[symbol] ? logosBySymbol[symbol] : NoLogo}
        alt={`${symbol} Logo`}
      />
    </StyledBankIconWrapper>
  );
};

const StyledBankIconWrapper = styled.div`
  background-color: transparent;
  border-radius: 100%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 0;
  img {
    height: 100%;
    width: auto;
  }
`;

export default TokenSymbolMini;
