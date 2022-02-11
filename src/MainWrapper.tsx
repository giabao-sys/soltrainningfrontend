import { useMemo } from 'react';
import { useLocation } from 'react-router';
import styled from 'styled-components';
import bgMain from './assets/img/bg.jpg';

const MainWrapper: React.FC = ({ children }) => {
  const location = useLocation();

  const bg = useMemo(() => {
    if (!location) {
      return bgMain;
    }
    return bgMain;
  }, [location]);

  return (
    <StyledMainContent bg={bg}>
      <StyledMain>{children}</StyledMain>
    </StyledMainContent>
  );
};

const StyledMainContent = styled.div<{ bg: string }>`
  min-height: 100vh;
  background-image: url(${(props) => props.bg});
  background-repeat: no-repeat;
  background-position: top center;
  background-size: cover;
  background-attachment: fixed;
  position: relative;
  display: flex;
  flex-direction: column;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    margin-left: 0;
  }
`;

const StyledMain = styled.div`
  flex: 1;
`;

const StyledAuthorView = styled.a`
  padding: 0;
  display: flex;
  font-size: 14px;
  color: ${({ theme }) => theme.color.primary.main};
  justify-content: center;
  text-decoration: none;
  align-items: center;
`;

export default MainWrapper;
