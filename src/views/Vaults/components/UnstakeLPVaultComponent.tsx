import React, { useCallback, useRef, useState } from 'react';
import Number from '../../../components/Number';
import { BigNumber } from '@ethersproject/bignumber';
import styled from 'styled-components';
import Spacer from 'src/components/Spacer';
import { Vault } from 'src/diamondhand/config';
import useHandleTransactionReceipt from 'src/hooks/useHandleTransactionReceipt';
import useDiamondHand from 'src/hooks/useDiamondHand';
import TokenSliderInput from 'src/views/Farms/components/TokenSliderInput';
import useMyVaultDeposited from 'src/hooks/useMyVaultDeposited';

interface UnstakeLPVaultComponentProps {
  vaultInfo: Vault;
}

const UnstakeLPVaultComponent: React.FC<UnstakeLPVaultComponentProps> = ({ vaultInfo }) => {
  const { token0, token1 } = vaultInfo;
  const [amount, setAmount] = useState(BigNumber.from(0));
  const refInput = useRef(null);
  const handleTransactionReceipt = useHandleTransactionReceipt();
  const diamondHand = useDiamondHand();
  const deposited = useMyVaultDeposited();

  const withdraw = useCallback(async () => {
    const tx = await handleTransactionReceipt(
      diamondHand?.VAULTSLP.withdraw(amount),
      `withdraw from farm ${amount}`,
    );

    if (tx && tx.response) {
      await tx.response.wait();
      tx.hideModal();
    }
  }, [diamondHand?.VAULTSLP, handleTransactionReceipt, amount]);

  const withdrawAll = useCallback(async () => {
    const tx = await handleTransactionReceipt(
      diamondHand?.VAULTSLP.withdrawAll(),
      `withdraw all from farm`,
    );

    if (tx && tx.response) {
      await tx.response.wait();
      tx.hideModal();
    }
  }, [diamondHand?.VAULTSLP, handleTransactionReceipt]);

  return (
    <StyledContainer>
      <Balance>
        Deposited:&nbsp;
        <span className="balance-click">
          <Number value={deposited} decimals={18} precision={16} />
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

export default UnstakeLPVaultComponent;

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
