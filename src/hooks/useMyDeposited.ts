import { useEffect, useState } from 'react';
import { BigNumber } from '@ethersproject/bignumber';
import { useWeb3React } from '@web3-react/core';
import useDiamondHand from './useDiamondHand';

const useMyDeposited = (poolId: BigNumber) => {
  const dh = useDiamondHand();
  const [amount, setAmount] = useState<BigNumber>();
  const { account } = useWeb3React();

  useEffect(() => {
    let mounted = true;
    if (!dh || !poolId || !account) {
      return;
    }
    dh.MASTERCHEF.getUserDeposited(poolId, account).then((info) => {
      if (!mounted) {
        return;
      }
      setAmount(info.amount);
    });
    return () => {
      mounted = false;
    };
  }, [dh, poolId, account]);

  return amount;
};

export default useMyDeposited;
