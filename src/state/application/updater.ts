import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateBlockNumber } from './actions';
import { useEthProvider } from '../../contexts/ConnectionProvider';
import useDebounce from 'src/hooks/useDebounce';

export default function Updater(): null {
  const provider = useEthProvider();
  const dispatch = useDispatch();
  const [state, setState] = useState<{
    chainId: number | undefined;
    blockNumber: number | null;
  }>({
    chainId: provider?.network.chainId,
    blockNumber: null,
  });

  const blockNumberCallback = useCallback(
    (blockNumber: number) => {
      const chainId = provider?.network.chainId;
      setState((state) => {
        if (typeof state.blockNumber !== 'number') return { chainId, blockNumber };
        return { chainId, blockNumber: Math.max(blockNumber, state.blockNumber) };
      });
    },
    [provider, setState],
  );

  // attach/detach listeners
  useEffect(() => {
    if (!provider) {
      return undefined;
    }

    provider.on('block', blockNumberCallback);
    return () => {
      provider.removeListener('block', blockNumberCallback);
    };
  }, [blockNumberCallback, provider]);

  const debouncedState = useDebounce(state, 100);

  useEffect(() => {
    if (!debouncedState.chainId || !debouncedState.blockNumber) return;
    dispatch(
      updateBlockNumber({
        chainId: debouncedState.chainId,
        blockNumber: debouncedState.blockNumber,
      }),
    );
  }, [dispatch, debouncedState.blockNumber, debouncedState.chainId]);

  return null;
}
