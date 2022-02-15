import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import Page from '../../components/Page';
import Spacer from 'src/components/Spacer';
import Select from 'react-select';
import VaultItem from './components/VaultItem';
import { useConfiguration } from 'src/contexts/ConfigProvider/ConfigProvider';
import { flatten } from 'lodash';

const Vaults: React.FC = () => {
  const [expanded, setExpanded] = useState(-1);
  const config = useConfiguration();
  const toggle = (index: number) => {
    if (expanded !== -1 && expanded === index) {
      setExpanded(-1);
    } else {
      setExpanded(index);
    }
  };

  const vaultInfo = useMemo(() => {
    if (!config?.vaults) {
      return;
    }
    return config?.vaults[0]
  }, [config?.vaults]);

  return (
    <Page>
      <StyledBody>
        <div> Vault</div>
        <StyledFarmGrid>
          <StyledFarmGridHeader>
            <StyledFarmGridHeaderCell>Asset</StyledFarmGridHeaderCell>
            <StyledFarmGridHeaderCell>Rewards</StyledFarmGridHeaderCell>
            <StyledFarmGridHeaderCell>Deposited</StyledFarmGridHeaderCell>
          </StyledFarmGridHeader>
          <StyledFarmGridBody>
            {vaultInfo && <VaultItem
              index={0}
              expanded={expanded === 0}
              toggle={toggle}
              vaultInfo={vaultInfo}
            />}
          </StyledFarmGridBody>
        </StyledFarmGrid>
        <Spacer size="lg" />
      </StyledBody>
    </Page>
  );
};

const StyledFarmGrid = styled.div``;

const StyledFarmGridHeader = styled.div`
  display: grid;
  grid-template-columns: 5fr 5fr 3fr 4fr 3fr 1fr;
  grid-gap: 10px;
  @media (max-width: 768px) {
    display: none;
  }
`;

const StyledFarmGridHeaderCell = styled.div`
  padding: 0px 10px;
  margin-bottom: 5px;
  font-weight: 500;
  font-size: 14px;
  color: #86beff;
  display: flex;
  align-items: center;
`;

const StyledFarmGridBody = styled.div`
  display: grid;
  grid-template-columns: repeat(1 1fr);
  grid-gap: 20px;
`;

export const StyledDropdowns = styled.div`
  margin-left: auto;
  display: flex;
  @media (max-width: 768px) {
    align-items: center;
    margin-left: 0;
  }
`;
export const StyledDropdownItem = styled.div`
  display: flex;
  align-items: center;
  margin-left: 20px;
`;

export const StyledHeaderSelect = styled(Select)`
  min-width: 155px;
  margin-left: 10px;
  .header-select__control {
    background-color: transparent;
    border-color: #3b3c48;
    padding: 0px 0px;
    border-radius: 6px;
    :hover {
      border-color: #717179;
    }
  }
  .header-select__control--is-focused {
    border-color: #717179;
    outline: none;
    box-shadow: none;
  }
  .header-select__single-value {
    color: ${({ theme }) => theme.color.secondary};
    font-size: 15px;
    font-weight: 500;
    border-color: #3b3c48;
  }
  .header-select__menu {
    margin-top: 0;
    color: ${({ theme }) => theme.color.secondary};
    font-size: 14px;
    font-weight: normal;
    background-color: ${({ theme }) => theme.color.bg};
  }
  .header-select__indicator-separator {
    display: none;
  }
  .header-select__option--is-selected {
    background-color: transparent;
    color: ${({ theme }) => theme.color.secondary};
  }
  .header-select__option--is-focused {
    background-color: ${({ theme }) => theme.color.primary.main};
    color: ${({ theme }) => theme.color.white};
  }
  @media (max-width: 768px) {
    min-width: 120px;
  }
`;

export const StyledHeader = styled.div`
  width: 100%;
  @media (max-width: 768px) {
    flex-wrap: wrap;
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const StyleFilters = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 30px;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const StyledSwitch = styled.div`
  display: flex;
  align-items: center;
  border: solid 1px #383e4b;
  border-radius: 6px;
  overflow: hidden;
  background-color: #0b0c17;
  padding: 3px;
  @media (max-width: 768px) {
    margin-bottom: 20px;
  }
`;

export const StyledSwitchItem = styled.button<{ highlight?: boolean }>`
  border-radius: 4px;
  appearance: none;
  background-color: ${({ highlight }) => (!highlight ? 'transparent' : '#1a1d2f')};
  border: none;
  color: ${({ highlight, theme }) =>
    highlight ? theme.color.primary.main : theme.color.secondary};
  text-transform: uppercase;
  font-weight: 500;
  width: 100px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: ease-in-out 150ms;
  font-size: 12px;
  text-decoration: none;
  pointer-events: ${({ highlight }) => (highlight ? 'none' : 'auto')};
  &:hover {
    color: #f8ae4d;
  }
`;

export const StyledStakeTvl = styled.div`
  display: flex;
  align-items: flex-end;
  margin-bottom: 20px;
  .info {
    margin-left: 20px;
  }
  @media (max-width: 768px) {
    flex: 1;
    margin-right: 0;
  }
`;

export const StyledStakeTvlTitle = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
  text-transform: capitalize;
  margin-right: 10px;
  text-transform: uppercase;
`;

export const StyledStakeTvlValue = styled.div`
  font-size: 33px;
  font-weight: 500;
  color: #00dc2d;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
`;

export const StyledBody = styled.div``;

export default Vaults;
