import React from 'react';
import styled from 'styled-components';
import Container from '../Container';


export interface ModalProps {
  onDismiss?: () => void;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  padding?: string;
  background?: string;
}

const Modal: React.FC<ModalProps> = ({ children, size, padding, background }) => {
  return (
    <Container size={size || 'sm'}>
      <StyledModal>{children}</StyledModal>
    </Container>
  );
};

const StyledModal = styled.div`
  position: relative;
`;

export default Modal;
