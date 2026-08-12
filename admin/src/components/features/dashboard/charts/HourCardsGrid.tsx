/**
 * @fileoverview "Check-ins per hour" — one shopping-bag icon per
 * scheduled appointment in that hour, color-coded by status. No bars,
 * no axes; the hour's volume is conveyed visually by the cluster of icons.
 *
 * Foodbank-themed: each bag = one client picking up groceries.
 */

import React from 'react';
import { Box, HStack, VStack, Text, Tooltip, Wrap, WrapItem, SimpleGrid } from '@chakra-ui/react';
import { FiShoppingBag } from 'react-icons/fi';
import { chartColors } from '../../../../config/designTokens';

export interface HourBucketAppointment {
  id: string;
  name: string;
  status: 'completed' | 'pending' | 'noShow';
  minute: number;
}

export interface HourBucket {
  hour: number;
  appointments: HourBucketAppointment[];
}

interface Props {
  hours: HourBucket[];
  currentHour?: number;
  onClickAppointment?: (id: string) => void;
}

const COLORS: Record<HourBucketAppointment['status'], string> = {
  completed: chartColors.completed,
  pending: chartColors.pending,
  noShow: chartColors.noShow,
};

const LABEL: Record<HourBucketAppointment['status'], string> = {
  completed: 'Completed',
  pending: 'Pending',
  noShow: 'No-show',
};

const fmtHour = (h: number) => {
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  const ampm = h < 12 ? 'AM' : 'PM';
  return `${h12} ${ampm}`;
};

const fmtTime = (h: number, m: number) => {
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  const ampm = h < 12 ? 'AM' : 'PM';
  return `${h12}:${m.toString().padStart(2, '0')} ${ampm}`;
};

const HourCardsGrid: React.FC<Props> = ({ hours, currentHour, onClickAppointment }) => {
  const total = hours.reduce((acc, h) => acc + h.appointments.length, 0);

  return (
    <Box bg="white" p={{ base: 4, md: 5 }} borderRadius="xl" border="1px solid" borderColor="gray.200" boxShadow="sm">
      <HStack justify="space-between" align="center" mb={4} flexWrap="wrap" gap={2}>
        <VStack align="start" spacing={0}>
          <Text fontSize="md" fontWeight="700" color="admin.primary">
            Check-ins per hour
          </Text>
          <Text fontSize="xs" color="gray.500">
            Each <Box as={FiShoppingBag} display="inline-block" mb="-2px" /> = one client.
            Click for details.
          </Text>
        </VStack>
        <HStack spacing={3} flexWrap="wrap">
          {(['completed', 'pending', 'noShow'] as const).map((s) => (
            <HStack key={s} spacing={1.5}>
              <Box as={FiShoppingBag} color={COLORS[s]} boxSize="14px" />
              <Text fontSize="2xs" color="gray.600" fontWeight="600">
                {LABEL[s]}
              </Text>
            </HStack>
          ))}
          <Text fontSize="xs" color="gray.400" pl={2}>
            {total} total
          </Text>
        </HStack>
      </HStack>

      <SimpleGrid
        columns={{ base: 1, sm: 3, md: 4, lg: 6, xl: 7 }}
        spacing={{ base: 2, md: 3 }}
      >
        {hours.map(({ hour, appointments }) => {
          const isNow = hour === currentHour;
          const isEmpty = appointments.length === 0;

          // Sort by minute so icons appear in time order
          const sorted = [...appointments].sort((a, b) => a.minute - b.minute);
          const completed = sorted.filter((a) => a.status === 'completed').length;
          const total = sorted.length;
          const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

          return (
            <Box
              key={hour}
              p={3}
              borderRadius="xl"
              border="1px solid"
              borderColor={isNow ? 'accent.coral.300' : 'gray.200'}
              bg={isEmpty ? 'gray.50' : 'white'}
              position="relative"
              minH="120px"
              transition="all 0.15s"
              boxShadow={isNow ? '0 0 0 3px var(--chakra-colors-accent-coral-200)' : 'none'}
            >
              {isNow && (
                <Box
                  position="absolute"
                  top="-9px"
                  right={2}
                  bg="accent.coral.300"
                  color="white"
                  px={1.5}
                  py={0.5}
                  borderRadius="full"
                  fontSize="2xs"
                  fontWeight="700"
                  letterSpacing="0.05em"
                >
                  NOW
                </Box>
              )}

              {/* Header row: hour + total + completion % */}
              <HStack justify="space-between" align="baseline" mb={2}>
                <Text
                  fontSize="xs"
                  color={isNow ? 'accent.coral.300' : 'gray.500'}
                  fontWeight={isNow ? '700' : '600'}
                  textTransform="uppercase"
                  letterSpacing="0.05em"
                >
                  {fmtHour(hour)}
                </Text>
                {!isEmpty && (
                  <Text fontSize="2xs" color="gray.400" fontWeight="600">
                    {pct}%
                  </Text>
                )}
              </HStack>

              {/* Bag-icon cluster — one per appointment */}
              {isEmpty ? (
                <VStack spacing={1} h="60px" justify="center">
                  <Box as={FiShoppingBag} color="gray.300" boxSize="20px" />
                  <Text fontSize="2xs" color="gray.400">
                    No visits
                  </Text>
                </VStack>
              ) : (
                <Wrap spacing={1.5} mb={2}>
                  {sorted.map((appt) => (
                    <WrapItem key={appt.id}>
                      <Tooltip
                        label={`${fmtTime(hour, appt.minute)} · ${appt.name} · ${LABEL[appt.status]}`}
                        hasArrow
                        placement="top"
                        fontSize="xs"
                      >
                        <Box
                          as={onClickAppointment ? 'button' : 'div'}
                          onClick={onClickAppointment ? () => onClickAppointment(appt.id) : undefined}
                          cursor={onClickAppointment ? 'pointer' : 'default'}
                          color={COLORS[appt.status]}
                          transition="transform 0.12s, opacity 0.12s"
                          _hover={onClickAppointment ? { transform: 'scale(1.25)' } : undefined}
                          opacity={appt.status === 'noShow' ? 0.6 : 1}
                          aria-label={`${LABEL[appt.status]} – ${appt.name} at ${fmtTime(hour, appt.minute)}`}
                        >
                          <Box as={FiShoppingBag} boxSize="18px" />
                        </Box>
                      </Tooltip>
                    </WrapItem>
                  ))}
                </Wrap>
              )}

              {!isEmpty && (
                <Text fontSize="xs" color="gray.500" mt="auto">
                  {total} {total === 1 ? 'visit' : 'visits'}
                </Text>
              )}
            </Box>
          );
        })}
      </SimpleGrid>
    </Box>
  );
};

export default HourCardsGrid;
