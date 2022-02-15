import React, { useCallback, useMemo, useRef, useState } from 'react';
import Number from '../../../components/Number';
import { BigNumber } from '@ethersproject/bignumber';
import styled from 'styled-components';
import useDiamondHand from 'src/hooks/useDiamondHand';
import useApprove, { ApprovalState } from 'src/hooks/useApprove';
import useTryConnect from 'src/hooks/useTryConnect';
import useHandleTransactionReceipt from 'src/hooks/useHandleTransactionReceipt';
import { useTokenBalance } from 'src/contexts/AccountBalanceProvider/AccountBalanceProvider';
import TokenSliderInput from 'src/views/Farms/components/TokenSliderInput';
import { Vault } from 'src/diamondhand/config';

interface StakeLPVaultComponentProps {
  vaultInfo: Vault;
}

enum ButtonStatus {
  notConnected = 1,
  insufficient = 2,
  requireApproval = 3,
  approvalPending = 4,
  paused = 15,
  ready = 20,
}

const StakeLPVaultComponent: React.FC<StakeLPVaultComponentProps> = ({ vaultInfo }) => {
  const { token0, token1, poolId } = vaultInfo;
  const [amount, setAmount] = useState(BigNumber.from(0));
  
  const refInput = useRef(null);
  const diamondHand = useDiamondHand();
  const { tryConnect } = useTryConnect();
  const handleTransactionReceipt = useHandleTransactionReceipt();
  const SLP = diamondHand?.SLP(poolId);
  const [approvalLPState, approveLP] = useApprove(
    SLP,
    diamondHand?.VAULTSLP?.address,
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
  }, [approvalLPState, diamondHand]);

  const deposit = useCallback(async () => {
    const tx = await handleTransactionReceipt(
      diamondHand?.VAULTSLP.deposit(amount),
      `Deposit to vault ${amount}`,
    );

    if (tx && tx.response) {
      await tx.response.wait();
      tx.hideModal();
    }
  }, [diamondHand?.VAULTSLP, handleTransactionReceipt, amount]);

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
          {balance && <Number value={balance} decimals={18} precision={6} />}
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

export default StakeLPVaultComponent;

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
