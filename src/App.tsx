import React from 'react';
import { Route, BrowserRouter as Router, Switch, Redirect } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import Popups from './components/Popups';
import Updaters from './state/Updaters';
import theme from './theme';
import store from './state';
import { Provider } from 'react-redux';
import ModalsProvider from './contexts/Modals';
import ConnectionProvider from './contexts/ConnectionProvider';
import { ConfigProvider } from './contexts/ConfigProvider/ConfigProvider';
import { DynamicWalletProvider } from './contexts/DynamicWalletProvider/DynamicWalletProvider';
import DiamondHandProvider from './contexts/DiamondHandProvider';

import Header from './components/Header';
import LoadingModal from './components/Loading/LoadingModal';
import { GlobalStyle } from './GlobalStyle';
import MainWrapper from './MainWrapper';
import { withPreload } from './hooks/usePreload';
import Farms from './views/Farms';
import { AccountBalanceProvider } from './contexts/AccountBalanceProvider/AccountBalanceProvider';
import Vaults from './views/Vaults';

const App: React.FC = () => {
  return (
    <Providers>
      <StyledSite>
        <Router>
          <MainWrapper>
            <StyledHeaderContainer>
              <Header />
            </StyledHeaderContainer>
            <StyledBodyContainer>
              <Switch>
              <Route path="/Farms" exact>
                <Farms />
              </Route>
              <Route path="/Vault" exact>
                <Vaults />
              </Route>
              <Redirect to="/Farms" />
            </Switch>
            </StyledBodyContainer>
          </MainWrapper>
        </Router>
      </StyledSite>
    </Providers>
  );
};

const StyledSite = styled.div``;

const StyledHeaderContainer = styled.div`
  width: 100%;
  /* padding: 30px 44px; */
  margin-bottom: 20px;
  padding: 20px 8px 0 8px;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 20px 24px 0 24px;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding: 30px 44px;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 20px 16px 0 16px;
  }
`;
const StyledBodyContainer = styled.div`
  margin: 0 15%;
`;
const Providers: React.FC = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <ConnectionProvider>
        <ConfigProvider>
          <DynamicWalletProvider>
            <Provider store={store}>
              <Updaters />
              <DiamondHandProvider>
                <AccountBalanceProvider>
                  <ModalsProvider>
                    <>
                      <LoadingModal />
                      <Popups />
                      {children}
                    </>
                  </ModalsProvider>
                </AccountBalanceProvider>
              </DiamondHandProvider>
            </Provider>
          </DynamicWalletProvider>
        </ConfigProvider>
      </ConnectionProvider>
    </ThemeProvider>
  );
};

export default withPreload(App, 10 ** 3);
