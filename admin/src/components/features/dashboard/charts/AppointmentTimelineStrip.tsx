/**
 * @fileoverview Horizontal timeline strip for the day's appointments.
 * Each appointment is a dot positioned by time; color = status.
 * Click a dot → trigger drilldown.
 */

import React, { useMemo } from 'react';
import { Box, HStack, Text, Tooltip } from '@chakra-ui/react';
import { useTenantTime } from '../../../../utils/useTenantTime';
import { chartColors } from '../../../../config/designTokens';

export interface TimelineAppointment {
  id: string;
  hour: number;
  minute: number;
  name: string;
  status: 'completed' | 'pending' | 'noShow';
}

interface Props {
  appointments: TimelineAppointment[];
  startHour?: number;
  endHour?: number;
  onClick?: (id: string) => void;
}

const COLORS: Record<TimelineAppointment['status'], string> = {
  completed: chartColors.completed,
  pending: chartColors.pending,
  noShow: chartColors.noShow,
};

const formatHour = (h: number) => {
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  const ampm = h < 12 ? 'AM' : 'PM';
  return `${h12}${ampm}`;
};

const AppointmentTimelineStrip: React.FC<Props> = ({
  appointments,
  startHour = 8,
  endHour = 20,
  onClick,
}) => {
  const { tz } = useTenantTime();
  const totalMinutes = (endHour - startHour) * 60;

  const positionPct = (h: number, m: number) => {
    const minsFromStart = (h - startHour) * 60 + m;
    return Math.max(0, Math.min(100, (minsFromStart / totalMinutes) * 100));
  };

  const nowPct = useMemo(() => {
    // Position the NOW marker by tenant-local hour/minute, not the browser's.
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: tz,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).formatToParts(new Date());
    const read = (t: string) => parseInt(parts.find((p) => p.type === t)?.value || '0', 10);
    const h = read('hour') % 24;
    const m = read('minute');
    if (h < startHour || h > endHour) return null;
    return positionPct(h, m);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startHour, endHour, tz]);

  const tickHours: number[] = [];
  for (let h = startHour; h <= endHour; h += 2) tickHours.push(h);

  return (
    <Box bg="white" px={4} py={4} borderRadius="xl" border="1px solid" borderColor="gray.200" boxShadow="sm">
      <HStack justify="space-between" mb={3}>
        <Text fontSize="xs" color="gray.500" fontWeight="600" textTransform="uppercase" letterSpacing="0.05em">
          Today's appointments
        </Text>
        <Text fontSize="xs" color="gray.400">
          {appointments.length} scheduled · {appointments.filter((a) => a.status === 'completed').length} done
        </Text>
      </HStack>

      <Box position="relative" h="44px" mx={2}>
        {/* Track */}
        <Box position="absolute" top="50%" left={0} right={0} h="2px" bg="gray.100" transform="translateY(-50%)" />

        {/* Hour ticks */}
        {tickHours.map((h) => {
          const pct = positionPct(h, 0);
          return (
            <Box
              key={h}
              position="absolute"
              top="50%"
              left={`${pct}%`}
              transform="translate(-50%, -50%)"
              w="1px"
              h="10px"
              bg="gray.200"
            />
          );
        })}

        {/* NOW marker */}
        {nowPct !== null && (
          <Box
            position="absolute"
            top="-4px"
            bottom="-4px"
            left={`${nowPct}%`}
            transform="translateX(-50%)"
            w="2px"
            bg="accent.coral.300"
            zIndex={2}
          >
            <Box position="absolute" top="-6px" left="-3px" w="8px" h="8px" borderRadius="full" bg="accent.coral.300" />
            <Text
              position="absolute"
              top="-22px"
              left="50%"
              transform="translateX(-50%)"
              fontSize="2xs"
              fontWeight="700"
              color="accent.coral.300"
              letterSpacing="0.05em"
            >
              NOW
            </Text>
          </Box>
        )}

        {/* Appointment dots */}
        {appointments.map((a) => {
          const pct = positionPct(a.hour, a.minute);
          const color = COLORS[a.status];
          return (
            <Tooltip
              key={a.id}
              label={`${formatHour(a.hour)}:${a.minute.toString().padStart(2, '0')} · ${a.name}`}
              hasArrow
              placement="top"
              fontSize="xs"
            >
              <Box
                position="absolute"
                top="50%"
                left={`${pct}%`}
                transform="translate(-50%, -50%)"
                w="10px"
                h="10px"
                borderRadius="full"
                bg={color}
                border="2px solid white"
                boxShadow="0 0 0 1px rgba(0,0,0,0.08)"
                cursor={onClick ? 'pointer' : 'default'}
                transition="transform 0.15s"
                _hover={{ transform: 'translate(-50%, -50%) scale(1.4)' }}
                onClick={() => onClick?.(a.id)}
                zIndex={1}
              />
            </Tooltip>
          );
        })}
      </Box>

      {/* Hour labels */}
      <HStack mt={2} mx={2} position="relative" h="14px">
        {tickHours.map((h) => {
          const pct = positionPct(h, 0);
          return (
            <Text
              key={h}
              position="absolute"
              left={`${pct}%`}
              transform="translateX(-50%)"
              fontSize="2xs"
              color="gray.400"
              fontWeight="500"
            >
              {formatHour(h)}
            </Text>
          );
        })}
      </HStack>
    </Box>
  );
};

export default AppointmentTimelineStrip;
