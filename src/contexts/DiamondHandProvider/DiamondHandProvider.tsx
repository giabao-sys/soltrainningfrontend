import { useWeb3React } from '@web3-react/core';
import React, { createContext, useEffect, useMemo, useState } from 'react';
import { usePageTitle } from 'src/hooks/usePageTitle';
import DiamondHand from '../../diamondhand';
import { useConfiguration } from '../ConfigProvider/ConfigProvider';
import { useEthProvider } from '../ConnectionProvider';

export interface DiamondHandContext {
  diamondHand?: DiamondHand;
}

export const Context = createContext<DiamondHandContext>({
  diamondHand: null,
});

export const DiamondHandProvider: React.FC = ({ children }) => {
  const { account, library } = useWeb3React();
  const [pageTitle] = useState(
    'Simple erc20',
  );
  const config = useConfiguration();
  const ethProvider = useEthProvider();
  usePageTitle(pageTitle);
  const [, setLastUpdate] = useState(0); // force update state since unlock wallet don't trigger state changed

  const diamondHand = useMemo(() => {
    if (!ethProvider || !config.abis) {
      return null;
    }

    return new DiamondHand(config, ethProvider);
  }, [config, ethProvider]);

  useEffect(() => {
    if (!diamondHand) {
      return;
    }
    if (account) {
      diamondHand.unlockWallet(library, account);
    } else if (!account) {
      diamondHand.lock();
    }
    setLastUpdate(Date.now());
  }, [library, account, diamondHand]);

  return <Context.Provider value={{ diamondHand }}>{children}</Context.Provider>;
};
