/**
 * @fileoverview Live appointment queue — the actionable view that ops staff need.
 *
 * Three sections (collapsible):
 *  1. ⚠️  Late — pending appointments past their scheduled time
 *  2. ⏭️  Up Next — next pending appointments coming up
 *  3. ✅  Recently completed (collapsed by default)
 *
 * Each row: avatar · name · scheduled time · wait indicator · status pill · click-to-detail.
 */

import React, { useMemo, useState } from 'react';
import {
  Box,
  HStack,
  VStack,
  Text,
  Avatar,
  Badge,
  Icon,
  Collapse,
  Divider,
} from '@chakra-ui/react';
import { palette } from '../../../../config/designTokens';
import {
  FiAlertTriangle,
  FiClock,
  FiCheckCircle,
  FiChevronDown,
  FiChevronRight,
} from 'react-icons/fi';

export interface QueueAppointment {
  id: string;
  name: string;
  status: 'completed' | 'pending' | 'noShow';
  hour: number;
  minute: number;
  rawStatus?: string;
  phone?: string;
}

interface Props {
  appointments: QueueAppointment[];
  onClickAppointment?: (id: string) => void;
}

const initialsFrom = (name: string): string =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || '')
    .join('') || '?';

const fmtHour = (h: number, m: number) => {
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  const ampm = h < 12 ? 'AM' : 'PM';
  return `${h12}:${m.toString().padStart(2, '0')} ${ampm}`;
};

const minutesFromNow = (h: number, m: number, now: Date) => {
  const target = new Date(now);
  target.setHours(h, m, 0, 0);
  return Math.round((target.getTime() - now.getTime()) / 60000);
};

/** Color-coded urgency: green (>15m), amber (≤15m), coral (overdue) */
const urgencyColor = (delta: number): { color: string; label: string } => {
  if (delta < -30) return { color: palette.coral, label: `${Math.abs(delta)}m late` };
  if (delta < 0) return { color: palette.amber, label: `${Math.abs(delta)}m past` };
  if (delta < 15) return { color: palette.amber, label: `in ${delta}m` };
  return { color: palette.green, label: `in ${delta}m` };
};

interface RowProps {
  appt: QueueAppointment;
  now: Date;
  onClick?: () => void;
}

const QueueRow: React.FC<RowProps> = ({ appt, now, onClick }) => {
  const delta = minutesFromNow(appt.hour, appt.minute, now);
  const urgency = urgencyColor(delta);
  const isLate = delta < 0 && appt.status === 'pending';
  const isCompleted = appt.status === 'completed';
  const showUrgency = !isCompleted && appt.status !== 'noShow';

  return (
    <HStack
      as={onClick ? 'button' : 'div'}
      onClick={onClick}
      spacing={3}
      px={3}
      py={2.5}
      borderRadius="lg"
      border="1px solid"
      borderColor="gray.100"
      bg="white"
      w="full"
      textAlign="left"
      cursor={onClick ? 'pointer' : 'default'}
      _hover={onClick ? { borderColor: 'gray.300', boxShadow: 'sm' } : undefined}
      transition="all 0.15s"
    >
      <Avatar
        size="sm"
        name={appt.name}
        bg={isLate ? 'accent.coral.300' : isCompleted ? 'accent.green.300' : 'admin.primary'}
        color="white"
        getInitials={() => initialsFrom(appt.name)}
      />
      <VStack align="start" spacing={0} flex={1} minW={0}>
        <Text fontSize="sm" fontWeight="600" color="admin.primary" noOfLines={1}>
          {appt.name}
        </Text>
        <HStack spacing={2} fontSize="xs" color="gray.500">
          <Text>{fmtHour(appt.hour, appt.minute)}</Text>
          {appt.phone && (
            <>
              <Text color="gray.300">·</Text>
              <Text noOfLines={1}>{appt.phone}</Text>
            </>
          )}
        </HStack>
      </VStack>
      {showUrgency && (
        <Badge
          bg={urgency.color}
          color="white"
          borderRadius="full"
          px={2}
          py={0.5}
          fontSize="2xs"
          fontWeight="700"
          textTransform="none"
        >
          {urgency.label}
        </Badge>
      )}
      {appt.rawStatus && isCompleted && (
        <Badge colorScheme="green" borderRadius="full" px={2} fontSize="2xs">
          {appt.rawStatus}
        </Badge>
      )}
      {appt.rawStatus && appt.status === 'noShow' && (
        <Badge colorScheme="red" borderRadius="full" px={2} fontSize="2xs">
          {appt.rawStatus}
        </Badge>
      )}
    </HStack>
  );
};

interface SectionProps {
  title: string;
  count: number;
  icon: React.ComponentType;
  color: string;
  isOpen: boolean;
  onToggle: () => void;
  emptyText: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({
  title,
  count,
  icon,
  color,
  isOpen,
  onToggle,
  emptyText,
  children,
}) => (
  <Box>
    <HStack
      as="button"
      onClick={onToggle}
      spacing={2}
      w="full"
      px={2}
      py={2}
      _hover={{ bg: 'gray.50' }}
      borderRadius="md"
    >
      <Icon as={isOpen ? FiChevronDown : FiChevronRight} color="gray.400" boxSize={3.5} />
      <Icon as={icon as any} color={color} boxSize={4} />
      <Text fontSize="sm" fontWeight="700" color="admin.primary">
        {title}
      </Text>
      <Box
        bg={color}
        color="white"
        fontSize="2xs"
        fontWeight="700"
        px={2}
        py={0.5}
        borderRadius="full"
        minW="22px"
        textAlign="center"
      >
        {count}
      </Box>
    </HStack>
    <Collapse in={isOpen} animateOpacity>
      <VStack spacing={2} align="stretch" mt={2} mb={3} pl={1}>
        {count === 0 ? (
          <Text fontSize="xs" color="gray.400" px={3} py={2}>
            {emptyText}
          </Text>
        ) : (
          children
        )}
      </VStack>
    </Collapse>
  </Box>
);

const AppointmentQueue: React.FC<Props> = ({ appointments, onClickAppointment }) => {
  const [openLate, setOpenLate] = useState(true);
  const [openUpNext, setOpenUpNext] = useState(true);
  const [openCompleted, setOpenCompleted] = useState(false);
  const [openNoShow, setOpenNoShow] = useState(false);

  const now = new Date();

  const { late, upNext, completed, noShow } = useMemo(() => {
    const late: QueueAppointment[] = [];
    const upNext: QueueAppointment[] = [];
    const completed: QueueAppointment[] = [];
    const noShow: QueueAppointment[] = [];
    appointments.forEach((a) => {
      if (a.status === 'completed') completed.push(a);
      else if (a.status === 'noShow') noShow.push(a);
      else {
        const delta = minutesFromNow(a.hour, a.minute, now);
        if (delta < 0) late.push(a);
        else upNext.push(a);
      }
    });
    upNext.sort((a, b) => minutesFromNow(a.hour, a.minute, now) - minutesFromNow(b.hour, b.minute, now));
    late.sort((a, b) => minutesFromNow(a.hour, a.minute, now) - minutesFromNow(b.hour, b.minute, now));
    completed.sort((a, b) => (b.hour - a.hour) * 60 + (b.minute - a.minute));
    return { late, upNext, completed, noShow };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointments]);

  return (
    <Box bg="white" p={4} borderRadius="xl" border="1px solid" borderColor="gray.200" boxShadow="sm">
      <VStack align="stretch" spacing={1}>
        <HStack justify="space-between" mb={2}>
          <Text fontSize="md" fontWeight="700" color="admin.primary">
            Live Queue
          </Text>
          <Text fontSize="xs" color="gray.500">
            Click any row for details
          </Text>
        </HStack>

        <Section
          title="Late"
          count={late.length}
          icon={FiAlertTriangle}
          color="accent.coral.300"
          isOpen={openLate}
          onToggle={() => setOpenLate((v) => !v)}
          emptyText="No appointments are running late."
        >
          {late.slice(0, 8).map((a) => (
            <QueueRow key={a.id} appt={a} now={now} onClick={() => onClickAppointment?.(a.id)} />
          ))}
          {late.length > 8 && (
            <Text fontSize="xs" color="gray.500" px={3}>
              + {late.length - 8} more
            </Text>
          )}
        </Section>

        <Divider />

        <Section
          title="Up Next"
          count={upNext.length}
          icon={FiClock}
          color="brand.500"
          isOpen={openUpNext}
          onToggle={() => setOpenUpNext((v) => !v)}
          emptyText="Nothing scheduled in the next few hours."
        >
          {upNext.slice(0, 6).map((a) => (
            <QueueRow key={a.id} appt={a} now={now} onClick={() => onClickAppointment?.(a.id)} />
          ))}
          {upNext.length > 6 && (
            <Text fontSize="xs" color="gray.500" px={3}>
              + {upNext.length - 6} more upcoming
            </Text>
          )}
        </Section>

        <Divider />

        <Section
          title="Completed today"
          count={completed.length}
          icon={FiCheckCircle}
          color="accent.green.300"
          isOpen={openCompleted}
          onToggle={() => setOpenCompleted((v) => !v)}
          emptyText="No completed check-ins yet today."
        >
          {completed.slice(0, 10).map((a) => (
            <QueueRow key={a.id} appt={a} now={now} onClick={() => onClickAppointment?.(a.id)} />
          ))}
          {completed.length > 10 && (
            <Text fontSize="xs" color="gray.500" px={3}>
              + {completed.length - 10} more
            </Text>
          )}
        </Section>

        {noShow.length > 0 && (
          <>
            <Divider />
            <Section
              title="No-shows / cancelled"
              count={noShow.length}
              icon={FiAlertTriangle}
              color="gray.400"
              isOpen={openNoShow}
              onToggle={() => setOpenNoShow((v) => !v)}
              emptyText="No no-shows."
            >
              {noShow.map((a) => (
                <QueueRow key={a.id} appt={a} now={now} onClick={() => onClickAppointment?.(a.id)} />
              ))}
            </Section>
          </>
        )}
      </VStack>
    </Box>
  );
};

export default AppointmentQueue;
