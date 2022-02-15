import { useEffect, useState } from 'react';
import { BigNumber } from '@ethersproject/bignumber';
import { useWeb3React } from '@web3-react/core';
import useDiamondHand from './useDiamondHand';

const useMyVaultDeposited = () => {
  const dh = useDiamondHand();
  const [amount, setAmount] = useState<BigNumber>();
  const { account } = useWeb3React();

  useEffect(() => {
    let mounted = true;
    if (!dh || !account) {
      return;
    }
    dh.VAULTSLP.getUserDeposited().then((amount) => {
      if (!mounted) {
        return;
      }
      setAmount(amount);
    });
    return () => {
      mounted = false;
    };
  }, [dh, account]);

  return amount;
};

export default useMyVaultDeposited;
