import React from 'react';
import styled from 'styled-components';
import Spacer from '../Spacer';
import AccountButton from './AccountButton';
import imgLogo from '../../assets/img/logo.png';
import { NavLink } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <StyledHeader>
      <StyledLeftHeader>
        <LogoLink to="/">
          <Logo src={imgLogo} />
        </LogoLink>
        <StyledNavLink activeClassName="active" to='/Farms'> Farms</StyledNavLink>
        <StyledNavLink activeClassName="active" to='/Vault'> My vault</StyledNavLink>
      </StyledLeftHeader>
      <Spacer size="xs" />
      <AccountButton />
    </StyledHeader>
  );
};
const StyledLeftHeader = styled.div`
  display: flex;
  flex: 1;
`;

const LogoLink = styled(NavLink)`
  text-decoration: none;
  @media (max-width: 768px) {
    align-items: center;
    display: flex;
  }
`;

const Logo = styled.img`
  align-self: flex-start;
  height: 50px;
  @media (max-width: 768px) {
    height: 33px;
    align-items: center;
  }
`;

const StyledHeader = styled.div`
  width: 100%;
  display: flex;
  flex: 1;
  align-items: center;
  border-bottom: 1px solid;
  padding-bottom: 20px;
`;
const StyledNavLink = styled(NavLink)`
  font-size: 16px;
  appearance: none;
  font-family: ${(p) => p.theme.font.heading};
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 24px;
  cursor: pointer;
  transition: ease-in-out 100ms;
  text-decoration: none;
  &:hover {
    color: #ffffff;
  }
  &.active {
    color: #ffffff;
  }
`;
export default Header;
