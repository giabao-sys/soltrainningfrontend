import { useCallback } from 'react';
import { NetworkStatus } from '../contexts/ConnectionProvider/ConnectionProvider';
import { useConnection } from '../contexts/ConnectionProvider';
import SelectWalletModal from 'src/components/SelectWalletModal';
import useModal from './useModal';

const useTryConnect = (): {
  tryConnect: () => void;
  networkStatus: NetworkStatus;
} => {
  const { networkStatus } = useConnection();
  const [showModal] = useModal(<SelectWalletModal />);
  const tryConnect = useCallback(async () => {
    if (networkStatus === NetworkStatus.READY) {
      showModal();
    }
  }, [networkStatus, showModal]);

  return {
    networkStatus,
    tryConnect,
  };
};

export default useTryConnect;
