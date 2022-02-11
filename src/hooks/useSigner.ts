import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { useMemo } from 'react';
import { useConfiguration } from 'src/contexts/ConfigProvider/ConfigProvider';
import { useEthProvider } from 'src/contexts/ConnectionProvider';

export const useSigner = () => {
  const config = useConfiguration();
  const { library, account } = useWeb3React<Web3Provider>();
  const defaultProvider = useEthProvider();

  return useMemo(() => {
    return library && account ? library.getSigner(account) : defaultProvider;
  }, [config, library, account]);
};
