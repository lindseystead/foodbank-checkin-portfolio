/**
 * @fileoverview Finish button component for Foodbank Check-In and Appointment System client application
 * 
 * This component provides a finish/completion button for finalizing
 * the check-in process. It handles the completion action and
 * navigation to the confirmation page.
 * 
 * @author Lindsey D. Stead
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 * 
 * @see {@link ../PrimaryButton.tsx} Primary button component
 */

import React from 'react';
import { Button, ButtonProps } from '@chakra-ui/react';

interface FinishButtonProps extends ButtonProps {
  children?: React.ReactNode;
}

const FinishButton: React.FC<FinishButtonProps> = ({ children = 'Done', width, height, ...props }) => {
  // IMPORTANT: Override variant defaults to ensure props take precedence
  // If width is provided, set minW to match to prevent variant minW from overriding
  const minW = width ? (typeof width === 'object' ? width : { base: width, md: width }) : undefined;
  
  return (
    <Button
      variant="primary"
      width={width}
      height={height}
      minW={minW}
      {...props}
    >
      {children}
    </Button>
  );
};

export default FinishButton; 