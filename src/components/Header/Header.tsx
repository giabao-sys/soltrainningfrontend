import React from 'react';
import styled from 'styled-components';
import Spacer from '../Spacer';
import AccountButton from './AccountButton';
import { NavLink } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <StyledHeader>
      <Spacer size="xs" />
      <AccountButton />
    </StyledHeader>
  );
};

const StyledHeader = styled.div`
  width: 100%;
  display: flex;
  flex: 1;
  align-items: center;
`;

export default Header;
