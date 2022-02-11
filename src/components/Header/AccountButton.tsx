import React, { useEffect, useMemo } from 'react';
import styled, { useTheme } from 'styled-components';
import Identicon from 'identicon.js';
import { useSavedConnector } from 'src/state/application/hooks';
import { useWeb3React } from '@web3-react/core';
import useWalletConnectors from 'src/hooks/useWalletConnectors';
import { Web3Provider } from '@ethersproject/providers';
import useTryConnect from 'src/hooks/useTryConnect';
import { useConfiguration } from 'src/contexts/ConfigProvider/ConfigProvider';
import useModal from 'src/hooks/useModal';
import AccountModal from './AccountModal';
import Spacer from '../Spacer';
import { useAllTransactions } from 'src/state/transactions/hooks';
import Loading from '../Loading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSatelliteDish } from '@fortawesome/pro-regular-svg-icons';

const AccountButton: React.FC = () => {
  const { account, activate, connector } = useWeb3React<Web3Provider>();
  const [onPresentAccountModal] = useModal(<AccountModal />);
  const { tryConnect } = useTryConnect();
  const savedConnector = useSavedConnector();
  const connectors = useWalletConnectors();
  const { isConnected } = useConfiguration();
  const allTransactions = useAllTransactions();
  const theme = useTheme();

  const hasPendingTransaction = useMemo(() => {
    const txs = Object.values(allTransactions);
    return txs.filter((tx) => !tx.receipt).length > 0;
  }, [allTransactions]);

  useEffect(() => {
    if (!account && savedConnector && connectors[savedConnector]) {
      activate(connectors[savedConnector], (error) => {
        console.warn('error', error);
      });
    }
  }, [account, savedConnector, connectors, activate]);

  useEffect(() => {
    if (connector) {
      const onChange = () => {
        window.location.reload();
      };
      connector.addListener('Web3ReactUpdate', onChange);

      return () => {
        connector.removeListener('Web3ReactUpdate', onChange);
      };
    }
  }, [connector]);

  const shortenAccount = useMemo(() => {
    if (account && account.length > 0) {
      return `${account.substring(0, 6)}...${account.substring(
        account.length - 4,
        account.length,
      )}`;
    }
  }, [account]);

  return (
    <StyledAccountButton active={isConnected}>
      {account ? (
        <button className="btn" onClick={onPresentAccountModal}>
          <AccountInfo>
            {hasPendingTransaction && (
              <>
                <Spacer size="sm" />
                <Loading size="18px" color={theme.color.primary.main} />
              </>
            )}
            <Spacer size="xs" />
            <AccountNumber>{shortenAccount}</AccountNumber>
          </AccountInfo>
        </button>
      ) : !isConnected ? (
        <button className="btn">
          {/* <FontAwesomeIcon icon={faSatelliteDish} style={{ marginRight: '5px' }} /> */}
          <span className="d-none d-lg-inline">Waiting for network</span>
        </button>
      ) : (
        <button className="btn" onClick={() => tryConnect()}>
          Connect
        </button>
      )}
    </StyledAccountButton>
  );
};

const StyledAccountButton = styled.div<{ active?: boolean }>`
  background-image: linear-gradient(93deg, rgb(136, 0, 236) 0%, rgb(252, 174, 60) 40%, rgb(249, 89, 66) 70%, rgb(125, 0, 180) 102%);
  background-position: -2px 0%;
  background-size: 220% 100%;
  transition: all 0.2s ease-in-out 0s;
`;

const AccountInfo = styled.span`
  display: flex;
  align-items: center;
  img {
    width: 24px;
    height: auto;
    border-radius: 100%;
  }
`;

const AccountNumber = styled.span`
  margin-right: 10px;
  @media (max-width: 1070px) {
    display: none;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

export default AccountButton;
