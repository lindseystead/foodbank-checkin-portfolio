/**
 * @fileoverview Dashboard header component
 * 
 * Standardized header section for dashboard pages with title, description,
 * date display, and action buttons.
 * 
 * @version 1.0.0
 * @since 2025-01-20
 */

import React from 'react';
import { Box, VStack, Heading, Text, Flex, Button } from '@chakra-ui/react';
import { FiRefreshCw } from 'react-icons/fi';
import { useTenantTime } from '../../../utils/useTenantTime';

interface DashboardHeaderProps {
  title: string;
  description: string;
  lastUpdated: Date;
  onRefresh?: () => void;
  isLoading?: boolean;
  showDateBadge?: boolean;
}

/**
 * Dashboard header component
 * 
 * Features:
 * - Responsive typography
 * - Date badge display
 * - Refresh button
 * - Consistent spacing
 */
const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  description,
  lastUpdated,
  onRefresh,
  isLoading = false,
  showDateBadge = true,
}) => {
  const { tz } = useTenantTime();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      timeZone: tz,
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatLastUpdated = (date: Date) =>
    date.toLocaleTimeString('en-US', { timeZone: tz });

  return (
    <Box mb={{ base: 4, md: 5 }}>
      <VStack spacing={{ base: 3, md: 4 }} align="stretch">
        {/* Title and Description */}
        <VStack align="center" spacing={{ base: 1, sm: 2, md: 3 }}>
          <Heading
            size={{ base: "md", sm: "lg", md: "xl" }}
            color="admin.primary"
            fontWeight="bold"
            textAlign="center"
            lineHeight="shorter"
            px={{ base: 2, sm: 0 }}
            textOverflow="ellipsis"
            whiteSpace="normal"
            wordBreak="break-word"
          >
            {title}
          </Heading>
          <VStack spacing={1}>
            <Text
              color="gray.600"
              fontSize={{ base: "sm", sm: "md" }}
              textAlign="center"
              mx="auto"
              px={{ base: 2, sm: 0 }}
              textOverflow="ellipsis"
              whiteSpace="normal"
              wordBreak="break-word"
            >
              {description}
            </Text>
            <Text
              fontSize={{ base: "xs", sm: "sm" }}
              color="gray.500"
              textAlign="center"
              px={{ base: 2, sm: 0 }}
              textOverflow="ellipsis"
              whiteSpace="nowrap"
            >
              Last updated: {formatLastUpdated(lastUpdated)}
            </Text>
          </VStack>
        </VStack>

        {/* Controls Row */}
        <Flex
          direction={{ base: "column", sm: "row" }}
          justify="space-between"
          align={{ base: "stretch", sm: "center" }}
          gap={{ base: 3, md: 4 }}
          flexWrap="wrap"
        >
          {/* Date Badge */}
          {showDateBadge && (
            <Box
              bg="admin.primary"
              px={{ base: 3, sm: 4 }}
              py={{ base: 2, sm: 2.5 }}
              borderRadius="lg"
              flexShrink={1}
              w={{ base: "full", sm: "auto" }}
              maxW={{ base: "100%", sm: "calc(100% - 150px)", md: "none" }}
              minW={0}
              textAlign="center"
            >
              <Text
                fontSize={{ base: "xs", sm: "sm", md: "md" }}
                fontWeight="bold"
                color="white"
                whiteSpace="nowrap"
                lineHeight="tight"
                textOverflow="ellipsis"
              >
                {formatDate(new Date())}
              </Text>
            </Box>
          )}

          {/* Refresh Button */}
          {onRefresh && (
            <Button
              size={{ base: "sm", sm: "md" }}
              variant="outline"
              leftIcon={<FiRefreshCw />}
              onClick={onRefresh}
              isLoading={isLoading}
              colorScheme="blue"
              flexShrink={0}
              w={{ base: "full", sm: "auto" }}
              minW={{ base: "auto", sm: "fit-content" }}
            >
              Refresh Data
            </Button>
          )}
        </Flex>
      </VStack>
    </Box>
  );
};

export default DashboardHeader;

