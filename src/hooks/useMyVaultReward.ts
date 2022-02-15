import { useEffect, useState } from 'react';
import { BigNumber } from '@ethersproject/bignumber';
import { useWeb3React } from '@web3-react/core';
import useDiamondHand from './useDiamondHand';

const useMyVaultReward = () => {
  const dh = useDiamondHand();
  const [amount, setAmount] = useState<BigNumber>();
  const { account } = useWeb3React();

  useEffect(() => {
    let mounted = true;
    if (!dh || !account || !dh.VAULTSLP) {
      return;
    }
    dh.VAULTSLP.getPendingReward().then((reward) => {
      if (!mounted) {
        return;
      }
      setAmount(reward);
    });
    return () => {
      mounted = false;
    };
  }, [dh, account, dh.VAULTSLP]);

  return amount;
};

export default useMyVaultReward;
