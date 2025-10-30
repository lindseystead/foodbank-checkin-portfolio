/**
 * @fileoverview Quick actions component for Foodbank Check-In and Appointment System admin panel
 * 
 * This component provides quick access buttons for common admin tasks
 * including data management, system operations, and frequently
 * used functions for efficient workflow management.
 * 
 * @author Lindsey D. Stead
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 * 
 * @see {@link ../DashboardPage.tsx} Dashboard page
 */

import React, { useMemo, useCallback } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Icon,
  usePrefersReducedMotion,
  Badge,
  Tooltip,
} from '@chakra-ui/react';
import {
  FiUpload,
  FiLink,
} from 'react-icons/fi';

// Enhanced TypeScript interfaces
interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  variant: 'primary' | 'secondary' | 'success' | 'warning' | 'info';
  onClick: () => void;
  permission?: string;
  badge?: string;
  disabled?: boolean;
  tooltip?: string;
}

interface QuickActionsProps {
  onAction: (actionId: string) => void;
  className?: string;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onAction, className }) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  
  // Responsive breakpoint values

  // Memoized quick actions - only keeping working features
  const quickActions: QuickAction[] = useMemo(() => [
    {
      id: 'upload-csv',
      title: 'Upload Client Data',
      description: 'Import today\'s appointments from Link2Feed',
      icon: FiUpload,
      variant: 'primary',
      onClick: () => onAction('upload-csv'),
      permission: 'manage_csv',
      badge: 'New',
    },
    {
      id: 'link2feed-config',
      title: 'API Settings',
      description: 'Connect to Link2Feed system',
      icon: FiLink,
      variant: 'info',
      onClick: () => onAction('link2feed-config'),
      permission: 'manage_integrations',
      badge: 'API',
    },
  ], [onAction]);

  // Memoized keyboard navigation handler
  const handleKeyDown = useCallback((event: React.KeyboardEvent, actionId: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onAction(actionId);
    }
  }, [onAction]);


  return (
    <Box
      bg="white"
      borderRadius="2xl"
      boxShadow="0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      p={{ base: 4, md: 6 }}
      w="full"
      maxW="100%"
      overflow="hidden"
      role="region"
      aria-label="Quick Actions"
      className={className}
      h="full"
      display="flex"
      flexDirection="column"
      minH="0"
    >
      <VStack spacing={{ base: 4, md: 5 }} align="stretch" w="full" h="full" minH="0">
        <HStack justify="space-between" align="center" w="full" flexShrink={0}>
          <Text fontSize="lg" fontWeight="700" color="admin.primary" letterSpacing="-0.025em">
            Quick Actions
          </Text>
          <Badge 
            bg="cofb.blue" 
            color="white" 
            fontSize="xs" 
            fontWeight="600"
            px={3}
            py={1}
            borderRadius="full"
          >
            {quickActions.length} Actions
          </Badge>
        </HStack>
        
        <VStack spacing={{ base: 2.5, md: 3 }} align="stretch" w="full" role="menu" flex="1" minH="0" overflow="visible">
          {quickActions.map((action) => {
            const ActionIcon = action.icon;
            
            return (
              <Tooltip
                key={action.id}
                label={action.tooltip || action.description}
                placement="top"
                isDisabled={!action.tooltip}
                hasArrow
                bg="gray.800"
                color="white"
                fontSize="sm"
                maxW="200px"
                borderRadius="lg"
                px={3}
                py={2}
              >
                <Button
                  variant="ghost"
                  onClick={action.onClick}
                  onKeyDown={(e) => handleKeyDown(e, action.id)}
                  h="auto"
                  minH={{ base: "65px", sm: "70px", md: "80px" }}
                  p={{ base: 2.5, sm: 3, md: 4 }}
                  textAlign="left"
                  justifyContent="flex-start"
                  w="full"
                  maxW="100%"
                  overflow="hidden"
                  whiteSpace="normal"
                  role="menuitem"
                  aria-label={`${action.title} - ${action.description}`}
                  tabIndex={0}
                  minW="40px"
                  size="sm"
                  disabled={action.disabled}
                  opacity={action.disabled ? 0.6 : 1}
                  cursor={action.disabled ? 'not-allowed' : 'pointer'}
                  bg="transparent"
                  borderRadius="xl"
                  border="1px solid"
                  borderColor="gray.100"
                  transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                  _hover={{
                    bg: "linear-gradient(135deg, #E6F3F5, #C2E1E6)",
                    color: "cofb.blue",
                    borderColor: "cofb.blue",
                    transform: prefersReducedMotion ? 'none' : 'translateY(-3px)',
                    boxShadow: '0 12px 30px -5px rgba(43, 123, 140, 0.3), 0 8px 15px -5px rgba(140, 171, 109, 0.2)',
                    '& .icon-container': {
                      transform: 'scale(1.1)',
                      boxShadow: '0 6px 20px rgba(43, 123, 140, 0.4)'
                    }
                  }}
                  _focus={{
                    boxShadow: '0 0 0 3px rgba(43, 123, 140, 0.3)',
                    outline: 'none',
                    transform: prefersReducedMotion ? 'none' : 'scale(1.02)',
                  }}
                  _active={{
                    transform: prefersReducedMotion ? 'none' : 'translateY(0)',
                    boxShadow: '0 4px 15px -5px rgba(43, 123, 140, 0.3)',
                  }}
                >
                  <HStack spacing={{ base: 2, sm: 3, md: 4 }} align="start" w="full" maxW="100%">
                    <Box
                      className="icon-container"
                      p={{ base: 2, sm: 2.5, md: 3 }}
                      borderRadius="xl"
                      bg="linear-gradient(135deg, #2B7B8C, #1E5A6B)"
                      color="white"
                      flexShrink={0}
                      boxShadow="0 4px 12px rgba(43, 123, 140, 0.3)"
                      position="relative"
                      transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                      _before={{
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        borderRadius: 'xl',
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
                        pointerEvents: 'none'
                      }}
                    >
                      <Icon
                        as={ActionIcon}
                        boxSize={{ base: 4, sm: 5, md: 6 }}
                        color="white"
                        aria-hidden="true"
                        filter="drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2))"
                      />
                    </Box>
                    <VStack align="start" spacing={{ base: 1, sm: 1.5, md: 2 }} flex={1} minW={0} w="full" overflow="hidden">
                      <HStack justify="space-between" align="flex-start" w="full" spacing={2}>
                        <Text 
                          fontSize={{ base: "xs", sm: "sm", md: "md" }} 
                          fontWeight="700" 
                          lineHeight="1.3"
                          wordBreak="break-word"
                          overflowWrap="break-word"
                          w="full"
                          textAlign="left"
                          color="admin.primary"
                          noOfLines={2}
                          flex={1}
                          minW={0}
                          letterSpacing="-0.01em"
                        >
                          {action.title}
                        </Text>
                        {action.badge && (
                          <Badge
                            bg={action.badge === 'New' ? 'cofb.green' : 'cofb.blue'}
                            color="white"
                            variant="solid"
                            fontSize="xs"
                            fontWeight="600"
                            flexShrink={0}
                            whiteSpace="nowrap"
                            px={2}
                            py={1}
                            borderRadius="md"
                          >
                            {action.badge}
                          </Badge>
                        )}
                      </HStack>
                      <Text 
                        fontSize={{ base: "2xs", sm: "xs", md: "sm" }} 
                        color="gray.700" 
                        lineHeight="1.4"
                        wordBreak="break-word"
                        overflowWrap="break-word"
                        w="full"
                        textAlign="left"
                        noOfLines={{ base: 3, sm: 2 }}
                        overflow="hidden"
                        fontWeight="500"
                      >
                        {action.description}
                      </Text>
                    </VStack>
                  </HStack>
                </Button>
              </Tooltip>
            );
          })}
        </VStack>
        
      </VStack>
    </Box>
  );
};

export default QuickActions;
