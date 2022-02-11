import React, { useCallback, useMemo, useRef, useState } from 'react';
import Number from '../../../components/Number';
import { BigNumber } from '@ethersproject/bignumber';
import styled from 'styled-components';
import TokenSliderInput from './TokenSliderInput';
import Spacer from 'src/components/Spacer';
import { PoolConfig } from 'src/diamondhand/config';
import useHandleTransactionReceipt from 'src/hooks/useHandleTransactionReceipt';
import useDiamondHand from 'src/hooks/useDiamondHand';
import useMyDeposited from 'src/hooks/useMyDeposited';

interface UnstakeLPComponentProps {
  poolConfig: PoolConfig;
}

const UnstakeLPComponent: React.FC<UnstakeLPComponentProps> = ({ poolConfig }) => {
  const { token0, token1 } = poolConfig;
  const [amount, setAmount] = useState(BigNumber.from(0));
  const refInput = useRef(null);
  const handleTransactionReceipt = useHandleTransactionReceipt();
  const diamondHand = useDiamondHand();
  const deposited = useMyDeposited(BigNumber.from(poolConfig.id));

  const withdraw = useCallback(async () => {
    const tx = await handleTransactionReceipt(
      diamondHand?.MASTERCHEF.withdraw(BigNumber.from(poolConfig.id), amount),
      `withdraw ${amount}`,
    );

    if (tx && tx.response) {
      await tx.response.wait();
      tx.hideModal();
    }
  }, [diamondHand?.MASTERCHEF, handleTransactionReceipt, amount]);

  const withdrawAll = useCallback(async () => {
    const tx = await handleTransactionReceipt(
      diamondHand?.MASTERCHEF.withdrawAll(BigNumber.from(poolConfig.id)),
      `withdraw ${amount}`,
    );

    if (tx && tx.response) {
      await tx.response.wait();
      tx.hideModal();
    }
  }, [diamondHand?.MASTERCHEF, handleTransactionReceipt]);

  return (
    <StyledContainer>
      <Balance>
        Deposited:&nbsp;
        <span className="balance-click">
          <Number value={deposited} decimals={18} precision={6} />
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
        onChange={setAmount}
        token0={token0}
        token1={token1}
        hideMax
      />
      <StyledFooter>
        <ButtonUnstake onClick={withdraw}>Withdraw</ButtonUnstake>
        <Spacer size="md" />
        <ButtonUnstake onClick={withdrawAll}>Withdraw all</ButtonUnstake>
      </StyledFooter>
    </StyledContainer>
  );
};

export default UnstakeLPComponent;

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

const ButtonUnstake = styled.button<{ error?: boolean }>`
  appearance: none;
  color: #0091ff;
  background: transparent;
  border: 1px solid #254da7;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  padding: 10px 22px;
  cursor: pointer;
  transition: ease-in-out 100ms;
  &:not(:disabled):hover {
    background: #0091ff;
    color: #ffffff;
  }
  &:disabled {
    cursor: auto;
    color: ${({ error, theme }) => (error ? theme.color.grey[300] : theme.color.grey[400])};
    background-color: rgb(64, 68, 79);
    box-shadow: none;
    border: 1px solid transparent;
    outline: none;
    opacity: 1;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 12px 0px;
    width: 100%;
  }
`;
