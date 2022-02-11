import React, { useCallback } from 'react';
import styled from 'styled-components';
import Modal, { ModalBody, ModalCloseButton, ModalHeader, ModalTitle } from '../Modal';
import MetamaskLogo from '../../assets/img/metamask.png';
import TrustWalletLogo from '../../assets/img/TrustWallet.svg';
import MathWalletLogo from '../../assets/img/MathWallet.svg';
import safeWalletLogo from '../../assets/img/SafeWallet.svg';
import binanceLogo from '../../assets/img/BinanceChain.svg';
import TokenPocketLogo from '../../assets/img/TokenPocker.svg';
import WalletConnectLogo from '../../assets/img/wallet_connect.png';
import { useWeb3React } from '@web3-react/core';
import { useAddPopup, useSetConnectedAccount } from 'src/state/application/hooks';
import useWalletConnectors from '../../hooks/useWalletConnectors';
import { ConnectorNames } from 'src/state/application/reducer';

export interface SelectWalletModalProps {
  onDismiss?: () => void;
}

interface Wallet {
  connector: ConnectorNames;
  name: string;
  image: string;
}

const SelectWalletModal: React.FC<SelectWalletModalProps> = ({ onDismiss }) => {
  const { activate, connector, account } = useWeb3React();
  const connectors = useWalletConnectors();
  const saveAccount = useSetConnectedAccount();
  const addPopup = useAddPopup();
  const wallets = [
    {
      connector: ConnectorNames.Injected,
      name: 'MetaMask',
      image: MetamaskLogo,
    },
    {
      connector: ConnectorNames.WalletConnect,
      name: 'Wallet Connect',
      image: WalletConnectLogo,
    },
    {
      connector: ConnectorNames.Injected,
      name: 'TrustWallet',
      image: TrustWalletLogo,
    },
    {
      connector: ConnectorNames.Injected,
      name: 'MathWallet',
      image: MathWalletLogo,
    },
    {
      connector: ConnectorNames.Injected,
      name: 'TokenPocket',
      image: TokenPocketLogo,
    },
    {
      connector: ConnectorNames.Injected,
      name: 'SafePal Wallet',
      image: safeWalletLogo,
    },
  ] as Wallet[];
  const onConnectPress = useCallback(
    (connectionId: ConnectorNames) => {
      activate(connectors[connectionId], (error) => {
        addPopup({
          error: {
            title: 'Connect wallet error',
            message: error?.message,
          },
        });
        return;
      });
      saveAccount(account, connectionId);
      onDismiss();
    },
    [account, activate, addPopup, connectors, onDismiss, saveAccount],
  );
  return (
    <Modal size="sm" padding="0">
      <ModalHeader>
        <ModalTitle>Connect to a Wallet</ModalTitle>
        <ModalCloseButton onClick={onDismiss}>
          <i className="far fa-times"></i>
        </ModalCloseButton>
      </ModalHeader>
      <ModalBody>
        <List>
          {wallets.map((wallet) => (
            <Item
              key={wallet.name}
              onClick={() => {
                if (connector !== connectors[wallet.connector]) {
                  onConnectPress(wallet.connector);
                }
              }}
            >
              <WalletName>{wallet.name}</WalletName>
              <WalletLogo
                src={wallet.image}
                alt={`${wallet.name} Logo`}
                width={32}
                height={32}
              />
            </Item>
          ))}
        </List>
      </ModalBody>
    </Modal>
  );
};

const List = styled.ul`
  overflow: hidden;
  list-style-type: none;
  padding: 0px;
  margin: 0px;
`;

const Item = styled.li<{ isActive?: boolean }>`
  display: flex;
  align-items: center;
  cursor: pointer;
  margin: 10px 0px;
  padding: 15px 16px;
  border: 2px solid ${({ theme }) => theme.color.grey[300]};
  :hover {
    border: 2px solid ${({ theme }) => theme.color.primary.main};
  }
`;

const WalletName = styled.span`
  font-size: 1.1rem;
  font-weight: 500;
  color: ${({ theme }) => theme.color.primary.main};
`;

const WalletLogo = styled.img`
  margin-left: auto;
  border-radius: 24px;
`;

export default SelectWalletModal;
