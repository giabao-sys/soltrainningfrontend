import { useCallback, useEffect, useState } from 'react';
import { BigNumber } from '@ethersproject/bignumber';
import { useWeb3React } from '@web3-react/core';
import useDiamondHand from './useDiamondHand';
import { JsonRpcProvider } from '@ethersproject/providers';
import { useConfiguration } from 'src/contexts/ConfigProvider/ConfigProvider';
import { useEthProvider } from 'src/contexts/ConnectionProvider';
import { flatten } from 'src/utils/objects';

const useMyReward = (poolId: BigNumber) => {
  const dh = useDiamondHand();
  const [amount, setAmount] = useState<BigNumber>();
  const { account } = useWeb3React();

  useEffect(() => {
    let mounted = true;
    if (!dh || !poolId || !account) {
      return;
    }
    dh.MASTERCHEF.getPendingReward(poolId, account).then((reward) => {
      if (!mounted) {
        return;
      }
      setAmount(reward);
    });
    return () => {
      mounted = false;
    };
  }, [dh, poolId, account]);

  return amount;
};

export default useMyReward;
