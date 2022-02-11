import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { getDefaultConfiguration } from '../../config';
import { Configuration } from '../../diamondhand/config';
import { useConnection } from '../ConnectionProvider';

type ConfigurationContext = Configuration & {
  isNetworkRecognized: boolean;
  isConnected: boolean;
};

const Context = createContext<ConfigurationContext>({} as ConfigurationContext);

export const ConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [value, setValue] = useState<ConfigurationContext>({
    chainId: undefined,
  } as ConfigurationContext);
  const connection = useConnection();

  useEffect(() => {
    let chainId;
    if (chainId) {
      if (typeof window.ethereum?.chainId === 'string') {
        chainId = parseInt(window.ethereum.chainId, 16);
      } else {
        chainId = window.ethereum.chainId;
      }
    }
    if (connection.connected) {
      const networkConfig = getDefaultConfiguration();
      if (!networkConfig) {
        setValue({
          isNetworkRecognized: false,
          isConnected: true,
          chainId: connection.chainId,
        } as ConfigurationContext);

        return;
      }

      if (networkConfig.chainId && networkConfig.chainId !== value?.chainId) {
        setValue({
          ...networkConfig,
          isNetworkRecognized: true,
          isConnected: true,
        });
        return;
      }
    } else {
      setValue({
        isNetworkRecognized: false,
        isConnected: false,
      } as ConfigurationContext);
    }
  }, [connection, value?.chainId]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useConfiguration = (): ConfigurationContext => {
  return useContext(Context);
};
