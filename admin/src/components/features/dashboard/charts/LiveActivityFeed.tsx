/**
 * @fileoverview Live activity feed: the most recent appointments with relative timestamps.
 */

import React, { useEffect, useState } from 'react';
import { Box, VStack, HStack, Text, Badge, Avatar } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTenantTime } from '../../../../utils/useTenantTime';

const MotionBox = motion(Box);

interface FeedItem {
  id: string;
  name: string;
  status?: string;
  time: Date;
}

interface LiveActivityFeedProps {
  items: FeedItem[];
  maxItems?: number;
}

const statusColor = (s?: string): string => {
  switch (s) {
    case 'Collected':
    case 'Shipped':
      return 'green';
    case 'Pending':
    case 'Rescheduled':
      return 'teal';
    case 'Not Collected':
    case 'Cancelled':
      return 'red';
    default:
      return 'gray';
  }
};

const relativeTime = (d: Date, now: Date, tz: string): string => {
  const diffMs = now.getTime() - d.getTime();
  const minutes = Math.round(diffMs / 60000);
  if (minutes < -60)
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: tz });
  if (minutes < -1) return `in ${-minutes}m`;
  if (minutes <= 0) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return d.toLocaleDateString('en-US', { timeZone: tz });
};

const initials = (name: string): string =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || '')
    .join('') || '?';

const LiveActivityFeed: React.FC<LiveActivityFeedProps> = ({ items, maxItems = 6 }) => {
  const { tz } = useTenantTime();
  // Re-tick every 30s so relative times stay fresh.
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
  }, []);

  const sliced = items.slice(0, maxItems);

  return (
    <Box bg="white" p={4} borderRadius="xl" border="1px solid" borderColor="gray.200" boxShadow="sm" h="full">
      <VStack align="stretch" spacing={3} h="full">
        <HStack justify="space-between">
          <Text fontSize="sm" fontWeight="700" color="admin.primary">
            Recent Activity
          </Text>
          <HStack spacing={1.5}>
            <Box
              w="6px"
              h="6px"
              borderRadius="full"
              bg="green.500"
              animation="lf-pulse 2s infinite"
              sx={{
                '@keyframes lf-pulse': {
                  '0%, 100%': { opacity: 1 },
                  '50%': { opacity: 0.4 },
                },
              }}
            />
            <Text fontSize="2xs" color="green.600" fontWeight="700" letterSpacing="0.05em">
              LIVE
            </Text>
          </HStack>
        </HStack>

        <VStack align="stretch" spacing={2} flex="1" overflow="hidden">
          {sliced.length === 0 ? (
            <Text fontSize="xs" color="gray.400" textAlign="center" py={4}>
              No recent appointments yet today.
            </Text>
          ) : (
            <AnimatePresence initial={false}>
              {sliced.map((item) => (
                <MotionBox
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <HStack
                    spacing={3}
                    p={2}
                    borderRadius="md"
                    _hover={{ bg: 'gray.50' }}
                    transition="background 0.15s"
                  >
                    <Avatar size="xs" name={item.name} bg="admin.primary" color="white" getInitials={() => initials(item.name)} />
                    <VStack align="start" spacing={0} flex="1" minW="0">
                      <Text fontSize="sm" fontWeight="500" color="admin.primary" noOfLines={1}>
                        {item.name}
                      </Text>
                      <Text fontSize="2xs" color="gray.500">
                        {relativeTime(item.time, now, tz)}
                      </Text>
                    </VStack>
                    {item.status && (
                      <Badge colorScheme={statusColor(item.status)} fontSize="2xs" borderRadius="full" px={2} flexShrink={0}>
                        {item.status}
                      </Badge>
                    )}
                  </HStack>
                </MotionBox>
              ))}
            </AnimatePresence>
          )}
        </VStack>
      </VStack>
    </Box>
  );
};

export default LiveActivityFeed;
