/**
 * @fileoverview Body text component for Foodbank Check-In and Appointment System client application
 * 
 * This component provides consistent body text styling with proper
 * typography, responsive design, and accessibility features for
 * all text content in the client application.
 * 
 * @author Lindsey D. Stead
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 * 
 * @see {@link ../theme/typography.ts} Typography configuration
 */

import React from 'react';
import { Text, TextProps } from '@chakra-ui/react';
import { textStyles } from '../../theme/typography';

interface BodyTextProps extends TextProps {
  children: React.ReactNode;
  centered?: boolean;
}

const BodyText: React.FC<BodyTextProps> = ({ 
  children, 
  centered = false,
  ...props 
}) => {
  return (
    <Text
      maxW={centered ? "600px" : undefined}
      mx={centered ? "auto" : undefined}
      whiteSpace="pre-line"
      px={centered ? { base: 1, sm: 2 } : undefined}
      sx={{
        '& br': {
          marginBottom: '0.5em'
        }
      }}
      {...textStyles.body}
      {...props}
    >
      {children}
    </Text>
  );
};

export default BodyText; 