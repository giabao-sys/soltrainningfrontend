import React, { useMemo } from 'react';
import { useCallback } from 'react';
import TokenSymbol from 'src/components/TokenSymbol';
import styled from 'styled-components';
import TokenSymbolMini from '../../../components/TokenSymbol/TokenSymbolMini';
import { useBlockNumber } from 'src/state/application/hooks';
import { formatSecs } from 'src/utils/formatTime';
import StakeLPComponent from './StakeLPComponent';
import UnstakeLPComponent from './UnstakeLPComponent';
import Spacer from 'src/components/Spacer';
import { BigNumber } from '@ethersproject/bignumber';
import { PoolConfig } from 'src/diamondhand/config';
import useMyReward from 'src/hooks/useMyReward';
import Number from 'src/components/Number';
import useDiamondHand from 'src/hooks/useDiamondHand';
import useHandleTransactionReceipt from 'src/hooks/useHandleTransactionReceipt';
import useMyDeposited from 'src/hooks/useMyDeposited';

export type FarmItemProps = {
  index: number;
  poolConfig: PoolConfig;
  expanded: boolean;
  toggle: (index: number) => void;
};

const FarmItem: React.FC<FarmItemProps> = ({
  index,
  poolConfig,
  expanded,
  toggle,
}) => {
  const {
    token0,
    token1,
    profitSharing,
    isLp,
    rewardToken,
    coming,
    inactive,
    market,
    marketSymbol,
    farmUrl,
  } = poolConfig;

  const blockNumber = useBlockNumber();
  const startFarmingBlock = 15285556;
  const eta = useMemo(() => {
    if (!blockNumber) return;
    const now = Date.now();
    const delta = startFarmingBlock - blockNumber;
    if (delta < 0) {
      return;
    }
    return Math.floor(now / 1000 + delta * 2.1);
  }, [blockNumber, startFarmingBlock]);

  const expandRow = useCallback(() => {
    if (farmUrl) {
      window.open(farmUrl, '_blank');
      return;
    }
    if (!expanded) {
      toggle(index);
    }
  }, [farmUrl, expanded, toggle, index]);

  const toggleRow = useCallback(
    ($event) => {
      if (farmUrl) return;
      toggle(index);
      $event.preventDefault();
      $event.stopPropagation();
    },
    [farmUrl, toggle, index],
  );

  const reward = useMyReward(BigNumber.from(poolConfig.id));
  const deposited = useMyDeposited(BigNumber.from(poolConfig.id));
  const handleTransactionReceipt = useHandleTransactionReceipt();
  const dh = useDiamondHand();
  const claim = useCallback(async () => {
    const tx = await handleTransactionReceipt(
      dh?.MASTERCHEF.deposit(BigNumber.from(poolConfig.id), BigNumber.from(0)),
      `claim`,
    );

    if (tx && tx.response) {
      await tx.response.wait();
      tx.hideModal();
    }
  }, [dh?.MASTERCHEF, handleTransactionReceipt, poolConfig.id]);
  return (
    <StyledContainer
      isSticky={coming && profitSharing && !isLp}
      isExpand={expanded}
      onClick={expandRow}
    >
      <StyledHeader>
        <StyledHeaderCell>
          <StyledHeaderIcon>
            <StyledHeaderIconWrapper marginRight={token1 ? '-10px' : ''}>
              <TokenSymbolMini symbol={token0} />
            </StyledHeaderIconWrapper>
            {token1 && (
              <StyledHeaderIconWrapper>
                <TokenSymbolMini symbol={token1} />
              </StyledHeaderIconWrapper>
            )}
          </StyledHeaderIcon>
          <StyledHeaderStatus>
            <StyledHeaderTitle>
              {token0}
              {token1 ? '/' + token1 : ''}
            </StyledHeaderTitle>
            <StyledHeaderSubTitle>
              {market && (
                <div className="logo">
                  <TokenSymbol symbol={marketSymbol} size={22} />
                </div>
              )}
              {!market ? `Earn ${rewardToken}` : market}
            </StyledHeaderSubTitle>
          </StyledHeaderStatus>
        </StyledHeaderCell>
        <StyledHeaderCell paddingLeft={3}>
          <StyledHeaderIconWrapper>
            <TokenSymbolMini symbol={rewardToken} />
          </StyledHeaderIconWrapper>
          <StyledHeaderStatus>
            <StyledHeaderTitle>{rewardToken}</StyledHeaderTitle>
            <StyledHeaderSubTitle>
              {(
                <>
                  100.000 {rewardToken} per day
                </>
              )}
            </StyledHeaderSubTitle>
          </StyledHeaderStatus>
        </StyledHeaderCell>
        <StyledHeaderCell paddingLeft={10} hiddenXs={true}>
          <StyledHeaderDataValue highlight={true}>
          <Number value={deposited} decimals={18} precision={6} />
          </StyledHeaderDataValue>
        </StyledHeaderCell>
      </StyledHeader>
      {expanded && !farmUrl ? (
        <StyledContent>
          <StyledInnerContent>
            {coming && eta ? (
              <StyledCountdown>
                Current block: <span>{blockNumber}</span>.<br />
                Farming reward will emit from block <span>{startFarmingBlock}</span>.
                Estimated time <span>{formatSecs(eta)}</span>.
              </StyledCountdown>
            ) : null}
            {inactive && (
              <StyleInactive>
                This pool is currently inactive. Please unstake and withdraw your funds.
              </StyleInactive>
            )}
            <StyledControl>
              <StyledControlItem className="balance">
                <StakeLPComponent poolConfig={poolConfig} />
              </StyledControlItem>
              <StyledControlItem className="deposited">
                <UnstakeLPComponent poolConfig={poolConfig} />
              </StyledControlItem>
            </StyledControl>
          </StyledInnerContent>
          <StyledClaimContainer>
            <div className="right">
              <StylePendingRewards>
                Rewards:
                <span className="amount">
                  <Number value={reward} decimals={12} precision={16} />
                </span>
                <span className="symbol">&nbsp;{rewardToken}</span>
                <Spacer size="sm" />
                <Button onClick={claim}>Claim</Button>
              </StylePendingRewards>
            </div>
          </StyledClaimContainer>
        </StyledContent>
      ) : null}
    </StyledContainer>
  );
};


const StyledHeaderCell = styled.div<{ paddingLeft?: number; hiddenXs?: boolean }>`
  display: flex;
  align-items: center;
  padding-left: ${({ paddingLeft }) => (paddingLeft ? paddingLeft + 'px' : '')};
  @media (max-width: 768px) {
    display: ${({ hiddenXs }) => (hiddenXs ? 'none' : 'flex')};
  }
`;

const StyledControl = styled.div`
  display: flex;
  padding-bottom: 25px;
  @media (max-width: 768px) {
    flex-wrap: wrap;
    flex-direction: column;
    align-items: flex-start;
  }
`;

const StyledInnerContent = styled.div`
  padding: 0 40px;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 0;
  }
`;

const StyledControlItem = styled.div`
  flex: 1;
  width: 100%;
  .group-button {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 62px;
  }
  :not(:first-child) {
    margin-left: 23px;
  }
  :not(:last-child) {
    margin-right: 23px;
  }
  @media (max-width: 768px) {
    :not(:first-child) {
      margin-left: 0px;
      margin-top: 40px;
    }
    :not(:last-child) {
      margin-right: 0px;
    }
  }
`;

const StyledCountdown = styled.div`
  font-size: 14px;
  margin-bottom: 20px;
  span {
    font-weight: 400;
    color: #fea430;
  }
  @media (max-width: 768px) {
    margin-top: 20px;
  }
`;

const StyleInactive = styled.div`
  font-size: 14px;
  margin-bottom: 20px;
  font-weight: 400;
  color: #d33535;
  @media (max-width: 768px) {
    margin-top: 20px;
  }
`;

const StyledClaimContainer = styled.div`
  display: flex;
  align-items: center;
  font-size: 15px;
  font-weight: 500;
  color: #ffffff;
  border-top: 1px dashed #292441;
  padding: 10px 10px 5px;
  .left {
  }
  .right {
    margin-left: auto;
    display: flex;
    align-items: center;
  }
  .amount {
    font-weight: 500;
    color: #00dc2d;
    margin-left: 5px;
  }
  .symbol {
    font-weight: 500;
    color: #91908f;
  }
  .claim {
    margin-left: 10px;
    background: transparent;
    border: none;
    cursor: pointer;
    font-size: 15px;
    font-weight: 600;
    color: #ff9f00;
    :disabled {
      color: #91908f;
      cursor: not-allowed;
    }
    &:not(:disabled):hover {
      text-decoration: underline;
    }
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    .left {
      display: flex;
      align-items: center;
      a {
        white-space: nowrap;
      }
    }
    .right {
      margin: auto;
      flex-direction: column;
    }
  }
`;

const StyledContainer = styled.div<{ isExpand?: boolean; isSticky?: boolean }>`
  width: 100%;
  padding: 10px 10px;
  border-radius: 8px;
  background-image: linear-gradient(to right, rgb(34 59 231 / 9%), rgb(52 67 249 / 15%));
  cursor: ${({ isExpand }) => (isExpand ? 'auto' : 'pointer')};
  border: 2px solid #3292ff38;
  position: relative;
  :hover {
    border: 2px solid ${({ isExpand }) => (isExpand ? '#3292ff38' : '#3292ffc7')};
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 15px 10px;
  }
`;
const StyledContent = styled.div`
  margin-top: 15px;
  padding-top: 25px;
  border-top: 1px dashed #292441;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding-top: 25px;
  }
`;

const StyledHeader = styled.div`
  display: grid;
  grid-template-columns: 5fr 5fr 3fr 4fr 3fr 1fr;
  grid-gap: 10px;
  text-decoration: none;
  flex: 1;
  > .indicator-icon {
    margin-left: auto;
    position: absolute;
    top: -14px;
    img + img {
      margin-left: 8px;
    }
  }
  .earn-info {
    display: flex;
    flex: 1;
  }
  .group-icon {
    display: flex;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 10fr 10fr 1fr;
    .earn-info {
      flex-direction: column;
      justify-content: center;
      img {
        width: 30px !important;
        height: 30px !important;
      }
    }
  }
`;

const StyledHeaderStatus = styled.div`
  margin-left: 10px;
  flex: 1;
  white-space: no-wrap;
`;

const StyledHeaderIcon = styled.div`
  padding: 5px 0;
  display: flex;
  align-items: center;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 5px 0;
  }
`;

const StylePendingRewards = styled.div`
  display: flex;
  align-items: center;
`;

const StyledHeaderIconWrapper = styled.div<{ marginRight?: string }>`
  display: flex;
  align-items: center;
  margin-right: ${({ marginRight }) => marginRight || '0'};
`;

const StyledHeaderTitle = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 13px;
  }
`;

const StyledHeaderSubTitle = styled.div`
  display: flex;
  align-items: center;
  margin-top: 3px;
  font-size: 13px;
  color: #b2b4b6;
  .logo {
    margin-right: 5px;
    height: 20px;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 10px;
    .logo {
      margin-right: 5px;
      height: 14px;
      img {
        height: 14px !important;
        width: auto !important;
      }
    }
  }
`;

const StyledHeaderDataValue = styled.div<{ highlight?: boolean }>`
  font-size: 14px;
  font-weight: 600;
  color: ${({ highlight }) => (highlight ? '#00dc2d' : '#ffffff')};
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin: 0px 0px 0px 10px;
    font-size: 11px;
  }
  .line {
    display: flex;
    align-items: center;
    font-size: 12px;
    margin-bottom: 3px;
    font-weight: 500;
    .field {
      color: #a2a2a2;
      margin-right: 10px;
    }
  }
`;

const Button = styled.button`
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
  background-color: #db9119;
  color: ${({ theme }) => theme.color.white};
  font-size: 16px;
  font-weight: 600;
  transition: ease-in-out 150ms;
  padding: 10px 22px;
  &:hover {
    background-color: #ff9f00;
  }
  &:disabled {
    background-color: rgb(64, 68, 79);
    color: ${({ theme }) => theme.color.grey[400]};
    cursor: auto;
    box-shadow: none;
    border: 1px solid transparent;
    outline: none;
    opacity: 1;
  }
  .loader {
    margin-right: 5px;
    height: 20px;
  }
`;

export default FarmItem;
