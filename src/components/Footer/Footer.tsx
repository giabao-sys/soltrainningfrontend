import React from 'react';
import styled from 'styled-components';
import Container from '../Container';
import Spacer from '../Spacer';
import Nav from './components/Nav';

const Footer: React.FC = () => (
  <StyledFooter>
    <Container size="lg">
      <StyledFooterInner>
        <StyledFooterLeft>
          IRON Finance
          <Spacer size="sm" />
          {/* <FontAwesomeIcon icon={faDigging} style={{ color: theme.color.primary.main }} /> */}
          <Spacer size="sm" />
          2021
        </StyledFooterLeft>
        <StyledFooterRight>
          <Nav />
        </StyledFooterRight>
      </StyledFooterInner>
    </Container>
  </StyledFooter>
);

const StyledFooter = styled.footer`
  margin-top: 20px;
  font-size: 0.9rem;
  border-top: solid 1px #97979722;
  color: ${(props) => props.theme.color.secondary};
`;

const StyledFooterInner = styled.div`
  align-items: center;
  display: flex;
  height: 60px;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    justify-content: center;
  }
`;

const StyledFooterLeft = styled.div`
  display: flex;
  align-items: center;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    justify-content: center;
  }
`;

const StyledFooterRight = styled.div`
  margin-left: auto;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

export default Footer;
