import React, { useCallback, useMemo, useRef, useState } from 'react';
import Number from '../../../components/Number';
import { BigNumber } from '@ethersproject/bignumber';
import styled from 'styled-components';
import TokenSliderInput from './TokenSliderInput';
import { PoolConfig } from 'src/diamondhand/config';
import useDiamondHand from 'src/hooks/useDiamondHand';
import useApprove, { ApprovalState } from 'src/hooks/useApprove';
import { useConfiguration } from 'src/contexts/ConfigProvider/ConfigProvider';
import ERC20 from 'src/diamondhand/ERC20';
import { useEthProvider } from 'src/contexts/ConnectionProvider';
import { providers } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import { JsonRpcProvider, Web3Provider } from '@ethersproject/providers';
import useTryConnect from 'src/hooks/useTryConnect';
import useHandleTransactionReceipt from 'src/hooks/useHandleTransactionReceipt';
import { useTokenBalance } from 'src/contexts/AccountBalanceProvider/AccountBalanceProvider';

interface StakeLPComponentProps {
  poolConfig: PoolConfig;
}

enum ButtonStatus {
  notConnected = 1,
  insufficient = 2,
  requireApproval = 3,
  approvalPending = 4,
  paused = 15,
  ready = 20,
}

const StakeLPComponent: React.FC<StakeLPComponentProps> = ({ poolConfig }) => {
  const { token0, token1 } = poolConfig;
  const [amount, setAmount] = useState(BigNumber.from(0));
  
  const refInput = useRef(null);
  const diamondHand = useDiamondHand();
  const { tryConnect } = useTryConnect();
  const config = useConfiguration();
  const { account } = useWeb3React<JsonRpcProvider>();
  const handleTransactionReceipt = useHandleTransactionReceipt();
  const SLP = diamondHand?.SLP(poolConfig.id);
  const [approvalLPState, approveLP] = useApprove(
    SLP,
    config.addresses.MasterChef,
  );
  const balance = useTokenBalance(SLP);
  const status = useMemo(() => {
    if (diamondHand && !diamondHand.isUnlocked) {
      return ButtonStatus.notConnected;
    }

    if (approvalLPState !== ApprovalState.APPROVED) {
      return ButtonStatus.requireApproval;
    }

    return ButtonStatus.ready;
  }, [approvalLPState, diamondHand, balance]);

  const deposit = useCallback(async () => {
    var x = await diamondHand?.MASTERCHEF.deposit(BigNumber.from(poolConfig.id), amount);
    const tx = await handleTransactionReceipt(
      diamondHand?.MASTERCHEF.getUserDeposited(BigNumber.from(poolConfig.id), account),
      `Deposit ${amount}`,
    );

    if (tx && tx.response) {
      await tx.response.wait();
      tx.hideModal();
    }
  }, [diamondHand?.MASTERCHEF, handleTransactionReceipt, amount]);

  const onClickDeposit = useCallback(async () => {
    switch (status) {
      case ButtonStatus.notConnected:
        tryConnect();
        break;
      case ButtonStatus.requireApproval:
        await approveLP();
        break;
      case ButtonStatus.ready:
        deposit();
        break;
    }
  }, [approveLP, deposit, tryConnect, status]);

  const buttonText = useMemo(() => {
    switch (status) {
      case ButtonStatus.notConnected:
        return 'Connect';

      case ButtonStatus.requireApproval:
        return 'Approve';

      default:
        return 'Deposit';
    }
  }, [status]);

  const setA = (amount: BigNumber) => {
    setAmount(amount)
  }
  return (
    <StyledContainer>
      <Balance>
        Balance:&nbsp;
        <span className="balance-click">
          <Number value={balance} decimals={18} precision={6} />
        </span>
        &nbsp; {token0}
        {token1 ? '/' + token1 : ''}
      </Balance>
      <TokenSliderInput
        ref={refInput}
        hasError={false}
        token={'IRON'}
        decimals={18}
        precision={18}
        onChange={setA}
        token0={token0}
        token1={token1}
        hideMax
      />
      <StyledFooter>
        <Button onClick={onClickDeposit}>{buttonText}</Button>
      </StyledFooter>
    </StyledContainer>
  );
};

export default StakeLPComponent;

const StyledContainer = styled.div``;

const Balance = styled.div`
  margin-bottom: 5px;
  font-size: 14px;
  font-weight: normal;
  color: #91908f;
  .balance-click {
    cursor: pointer;
    display: inline-block;
    color: #fea430;
    font-weight: 500;
  }
  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const StyledFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 55px;
  a {
    margin-right: auto;
    font-size: 14px;
    font-weight: 500;
    color: #fea430;
    cursor: pointer;
    :hover {
      text-decoration: underline;
    }
  }
  i {
    margin-left: 8px;
  }
`;

const Button = styled.button<{
  error?: boolean;
  isLoading?: boolean;
}>`
  padding: 10px 22px;
  text-align: center;
  border-radius: 6px;
  outline: none;
  border: 1px solid transparent;
  text-decoration: none;
  display: flex;
  justify-content: center;
  flex-wrap: nowrap;
  align-items: center;
  cursor: pointer;
  position: relative;
  z-index: 1;
  background-color: #0091ff;
  color: ${({ isLoading, theme }) =>
    isLoading ? 'rgb(109, 168, 255, 0.7)' : theme.color.white};
  font-size: 16px;
  font-weight: 600;
  pointer-events: ${({ isLoading }) => (isLoading ? 'none' : 'auto')};
  transition: ease-in-out 150ms;
  &:hover {
    background-color: #006eff;
  }
  &:disabled {
    background-color: ${({ error, theme }) =>
      error ? theme.color.red[300] : 'rgb(64, 68, 79)'};
    color: ${({ error, theme }) => (error ? theme.color.grey[300] : theme.color.grey[400])};
    box-shadow: none;
    border: 1px solid transparent;
    outline: none;
    opacity: 1;
    cursor: auto;
  }
  .loader {
    margin-right: 5px;
    height: 20px;
  }
`;
