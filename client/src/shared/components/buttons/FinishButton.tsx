/**
 * @fileoverview Finish CTA — sizing/color come from Button variant="primary".
 */

import React from 'react';
import { Button, ButtonProps } from '@chakra-ui/react';

interface FinishButtonProps extends ButtonProps {
  children?: React.ReactNode;
}

const FinishButton: React.FC<FinishButtonProps> = ({ children = 'Done', ...props }) => {
  return (
    <Button variant="primary" {...props}>
      {children}
    </Button>
  );
};

export default FinishButton;
