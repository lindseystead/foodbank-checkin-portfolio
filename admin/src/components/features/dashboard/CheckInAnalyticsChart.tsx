/**
 * @fileoverview Analytics dashboard for the admin panel.
 *
 * Visual layout:
 *   ┌── live status pill ──────────────────────────────┐
 *   │ KPI cards (sparklines + delta)                   │
 *   │ Hour heatmap strip                                │
 *   │ Check-ins per hour (icon grid)  | Status donut    │
 *   │                                  | Live activity  │
 *
 * No bar/area/line chart — replaced by a humanised icon grid.
 *
 * @version 3.0.0
 * @license Proprietary
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Grid,
  GridItem,
  Center,
  Skeleton,
  useDisclosure,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { api } from '../../../lib/api';
import { fetchStatusDay } from '../../../lib/statusService';
import { logger } from '../../../utils/logger';
import { usePolling } from '../../../hooks/usePolling';
import KpiCard from './charts/KpiCard';
import StatusDonut, { StatusKey } from './charts/StatusDonut';
import SlotDrilldownModal, { DrilldownAppointment } from './charts/SlotDrilldownModal';
import HourHeatmapStrip from './charts/HourHeatmapStrip';
import LiveActivityFeed from './charts/LiveActivityFeed';
import HourCardsGrid, { HourBucket } from './charts/HourCardsGrid';
import { useTenantTime } from '../../../utils/useTenantTime';

const COLORS = {
  completed: 'accent.green.300',
  pending: 'brand.500',
  noShow: 'accent.coral.300',
  primary: 'admin.primary',
};

const MotionBox = motion(Box);

interface DashboardStats {
  totalCheckIns: number;
  completed: number;
  pending: number;
  noShow: number;
  peakLabel: string;
  peakCount: number;
}

const formatSlot = (hour: number, minute: number) => {
  const h12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  const ampm = hour < 12 ? 'AM' : 'PM';
  return `${h12}:${minute.toString().padStart(2, '0')} ${ampm}`;
};

const toAppointmentDate = (a: any): Date | null => {
  const tryParse = (s?: string) => {
    if (!s) return null;
    const d = new Date(s);
    return isNaN(d.getTime()) ? null : d;
  };
  return (
    tryParse(a.appointmentTime) ||
    tryParse(a.pickUpISO) ||
    (a.pickUpDate && /^\d{2}:\d{2}$/.test(a.pickUpTime || '')
      ? tryParse(`${a.pickUpDate}T${a.pickUpTime}:00`)
      : null)
  );
};

/** Extract calendar parts of an instant *in the tenant timezone*. */
const tzParts = (d: Date, tz: string) => {
  const p = new Intl.DateTimeFormat('en-CA', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(d);
  const get = (t: string) => parseInt(p.find((x) => x.type === t)?.value || '0', 10);
  // Intl can emit hour "24" at midnight; normalise to 0.
  const hour = get('hour') % 24;
  return { year: get('year'), month: get('month'), day: get('day'), hour, minute: get('minute') };
};

const isToday = (d: Date, tz: string) => {
  const a = tzParts(d, tz);
  const b = tzParts(new Date(), tz);
  return a.year === b.year && a.month === b.month && a.day === b.day;
};

const classifyStatus = (status?: string): StatusKey | null => {
  if (status === 'Collected' || status === 'Shipped') return 'completed';
  if (status === 'Pending' || status === 'Rescheduled') return 'pending';
  if (status === 'Not Collected' || status === 'Cancelled') return 'noShow';
  return null;
};

const CheckInAnalyticsChart: React.FC = () => {
  const { formatTime, tz } = useTenantTime();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [csvStatus, setCsvStatus] = useState<{ loading: boolean; hasData: boolean; count: number; error: string | null }>({
    loading: true,
    hasData: false,
    count: 0,
    error: null,
  });

  const [statusFilters, setStatusFilters] = useState<Record<StatusKey, boolean>>({
    completed: true,
    pending: true,
    noShow: true,
  });

  const drilldown = useDisclosure();
  const [selectedSlot, setSelectedSlot] = useState<{ label: string; appointments: DrilldownAppointment[] } | null>(null);

  // ── Data fetch ───────────────────────────────────────

  const fetchCsvStatus = async () => {
    try {
      const result = await fetchStatusDay();
      if (!isMountedRef.current) return;
      if (result.success) {
        const lastVersion = localStorage.getItem('dataVersion');
        if (result.dataVersion && result.dataVersion.toString() !== lastVersion) {
          localStorage.setItem('dataVersion', result.dataVersion.toString());
          window.dispatchEvent(new CustomEvent('dataVersionChanged', { detail: { dataVersion: result.dataVersion } }));
        }
        setCsvStatus({
          loading: false,
          hasData: result.data?.data?.present || false,
          count: result.data?.data?.count || 0,
          error: null,
        });
      } else {
        setCsvStatus({ loading: false, hasData: false, count: 0, error: result.error || 'Failed to fetch status' });
      }
    } catch (err: any) {
      if (err?.message === 'API_NOT_CONFIGURED' || err?.message === 'RATE_LIMITED') {
        logger.debug(err.message);
      } else if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
        // backend offline — fail silently
      } else {
        logger.error('CSV status fetch error:', err);
      }
      if (isMountedRef.current) {
        setCsvStatus({ loading: false, hasData: false, count: 0, error: null });
      }
    }
  };

  const fetchAnalytics = async (initial: boolean = false) => {
    try {
      if (initial && isMountedRef.current) setIsLoading(true);
      const response = await api('/admin/t/checkin/appointments');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      if (!isMountedRef.current) return;

      if (data.success && Array.isArray(data.data)) {
        const todayAppointments = data.data.filter((a: any) => {
          const d = toAppointmentDate(a);
          return d ? isToday(d, tz) : false;
        });
        setAppointments((prev) => {
          if (
            prev.length === todayAppointments.length &&
            prev.every((p, i) => p.status === todayAppointments[i].status)
          ) {
            return prev;
          }
          return todayAppointments;
        });
        setLastUpdate(new Date());
      } else if (isMountedRef.current) {
        setAppointments((prev) => (prev.length === 0 ? prev : []));
        setLastUpdate(new Date());
      }
    } catch (error: any) {
      if (error?.message === 'API_NOT_CONFIGURED') {
        logger.debug('API not configured');
      } else if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        logger.debug('Backend unreachable, will retry');
      } else {
        logger.error('Analytics fetch error:', error);
      }
    } finally {
      if (initial && isMountedRef.current) setIsLoading(false);
    }
  };

  const fetchAll = useCallback(async () => {
    await Promise.all([fetchCsvStatus(), fetchAnalytics(false)]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { isMountedRef } = usePolling({
    fetchFn: fetchAll,
    intervalMs: 30_000,
    initialDelayMs: 30_000,
  });

  useEffect(() => {
    fetchCsvStatus();
    fetchAnalytics(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Derived data ─────────────────────────────────────

  const hourBuckets: HourBucket[] = useMemo(() => {
    const map = new Map<number, HourBucket>();
    for (let h = 8; h <= 20; h++) map.set(h, { hour: h, appointments: [] });
    appointments.forEach((a, idx) => {
      const d = toAppointmentDate(a);
      if (!d) return;
      const { hour: h, minute } = tzParts(d, tz);
      if (!map.has(h)) return;
      const status = classifyStatus(a.status);
      if (!status) return;
      const name =
        a.clientName ||
        [a.firstName, a.lastName].filter(Boolean).join(' ') ||
        a.lastName ||
        'Anonymous';
      map.get(h)!.appointments.push({
        id: `${a.id || a.clientId || idx}-${d.getTime()}`,
        name,
        status,
        minute,
      });
    });
    return Array.from(map.values());
  }, [appointments, tz]);

  const hourTotals = useMemo(() =>
    hourBuckets.map(({ hour, appointments: appts }) => ({
      hour,
      total: appts.length,
      completed: appts.filter((a) => a.status === 'completed').length,
    }))
  , [hourBuckets]);

  // KPI sparklines: cumulative counts per hour bucket
  const sparklines = useMemo(() => {
    const completed: number[] = [];
    const pending: number[] = [];
    const noShow: number[] = [];
    const total: number[] = [];
    let cC = 0, cP = 0, cN = 0, cT = 0;
    hourBuckets.forEach(({ appointments: appts }) => {
      cC += appts.filter((a) => a.status === 'completed').length;
      cP += appts.filter((a) => a.status === 'pending').length;
      cN += appts.filter((a) => a.status === 'noShow').length;
      cT += appts.length;
      completed.push(cC); pending.push(cP); noShow.push(cN); total.push(cT);
    });
    return { completed, pending, noShow, total };
  }, [hourBuckets]);

  const stats: DashboardStats = useMemo(() => {
    const totals = appointments.reduce(
      (acc, a) => {
        const s = classifyStatus(a.status);
        if (s === 'completed') acc.completed += 1;
        if (s === 'pending') acc.pending += 1;
        if (s === 'noShow') acc.noShow += 1;
        return acc;
      },
      { completed: 0, pending: 0, noShow: 0 }
    );
    const peak = hourTotals.reduce((best, h) => (h.total > best.total ? h : best), { hour: 0, total: 0, completed: 0 });
    const peakLabel = peak.total > 0 ? `${peak.hour === 0 ? 12 : peak.hour > 12 ? peak.hour - 12 : peak.hour} ${peak.hour < 12 ? 'AM' : 'PM'}` : '—';
    return {
      totalCheckIns: appointments.length,
      ...totals,
      peakLabel,
      peakCount: peak.total ?? 0,
    };
  }, [appointments, hourTotals]);

  const completionPct = stats.totalCheckIns > 0 ? Math.round((stats.completed / stats.totalCheckIns) * 100) : 0;
  const noShowPct = stats.totalCheckIns > 0 ? Math.round((stats.noShow / stats.totalCheckIns) * 100) : 0;
  const hasNoData = stats.totalCheckIns === 0;
  const currentHour = tzParts(new Date(), tz).hour;

  // Live activity feed: most-recent-first, capped to 12
  const feedItems = useMemo(() =>
    appointments
      .map((a, idx) => {
        const d = toAppointmentDate(a);
        if (!d) return null;
        const name =
          a.clientName || [a.firstName, a.lastName].filter(Boolean).join(' ') || a.lastName || 'Anonymous';
        return {
          id: `${a.clientId || a.id || idx}-${d.getTime()}`,
          name,
          status: a.status,
          time: d,
        };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null)
      .sort((a, b) => b.time.getTime() - a.time.getTime())
      .slice(0, 12)
  , [appointments]);

  // ── Handlers ─────────────────────────────────────────

  const toggleStatus = (key: StatusKey) => {
    setStatusFilters((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      if (!next.completed && !next.pending && !next.noShow) {
        return { completed: true, pending: true, noShow: true };
      }
      return next;
    });
  };

  const handleAppointmentClick = (id: string) => {
    const found = appointments.find((a, idx) => {
      const d = toAppointmentDate(a);
      return `${a.id || a.clientId || idx}-${d?.getTime()}` === id;
    });
    if (!found) return;
    const d = toAppointmentDate(found);
    if (!d) return;
    const dParts = tzParts(d, tz);
    const label = formatSlot(dParts.hour, dParts.minute);
    // Show all appointments scheduled in the same hour for context
    const slotApts = appointments.filter((a) => {
      const ad = toAppointmentDate(a);
      return ad ? tzParts(ad, tz).hour === dParts.hour : false;
    });
    setSelectedSlot({ label, appointments: slotApts });
    drilldown.onOpen();
  };

  // ── Render ───────────────────────────────────────────

  if (isLoading) {
    return (
      <VStack spacing={4} align="stretch" w="full" p={4}>
        <Skeleton height="48px" borderRadius="xl" />
        <Grid templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }} gap={4}>
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} height="128px" borderRadius="xl" />
          ))}
        </Grid>
        <Skeleton height="80px" borderRadius="xl" />
        <Skeleton height="320px" borderRadius="xl" />
      </VStack>
    );
  }

  const noDataPanel = (msg: string, hint: string) => (
    <Center bg="white" borderRadius="xl" border="1px solid" borderColor="gray.200" boxShadow="sm" h="100%" minH="280px" p={6}>
      <VStack spacing={3}>
        <Text fontSize="lg" color="gray.500" fontWeight="medium">📊 {msg}</Text>
        <Text fontSize="sm" color="gray.400" textAlign="center" maxW="320px">{hint}</Text>
      </VStack>
    </Center>
  );

  return (
    <Box w="full" position="relative">
      <VStack spacing={4} align="stretch" w="full">
        {/* Live status pill */}
        <HStack
          justify="space-between"
          align="center"
          flexWrap="wrap"
          gap={2}
          bg="white"
          px={{ base: 3, sm: 4 }}
          py={2}
          borderRadius="xl"
          border="1px solid"
          borderColor="gray.200"
          boxShadow="sm"
        >
          <HStack spacing={3}>
            <Box position="relative" w="10px" h="10px">
              <Box
                position="absolute"
                inset={0}
                borderRadius="full"
                bg="green.500"
                animation="pulse 2s infinite"
                sx={{
                  '@keyframes pulse': {
                    '0%, 100%': { opacity: 1, transform: 'scale(1)' },
                    '50%': { opacity: 0.6, transform: 'scale(1.3)' },
                  },
                }}
              />
            </Box>
            <Text fontSize="sm" fontWeight="700" color={COLORS.primary}>
              Live Operations
            </Text>
            <Badge colorScheme="green" fontSize="2xs" borderRadius="full" px={2}>
              LIVE
            </Badge>
          </HStack>
          <Text fontSize="xs" color="gray.500" fontWeight="500">
            Updated {formatTime(lastUpdate)}
          </Text>
        </HStack>

        {/* KPI cards */}
        <MotionBox
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          <Grid
            templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }}
            gap={{ base: 3, sm: 4 }}
            alignItems="stretch"
            w="full"
          >
            <KpiCard
              icon="📅"
              label="Total Today"
              value={stats.totalCheckIns}
              subtitle={`Peak ${stats.peakLabel}`}
              delta={stats.peakCount > 0 ? `${stats.peakCount} at peak` : undefined}
              color={COLORS.primary}
              hasNoData={hasNoData}
              spark={sparklines.total}
            />
            <KpiCard
              icon="✅"
              label="Completed"
              value={stats.completed}
              subtitle="Collected / Shipped"
              delta={stats.totalCheckIns > 0 ? `${completionPct}% rate` : undefined}
              color={COLORS.completed}
              hasNoData={hasNoData}
              spark={sparklines.completed}
              active={statusFilters.completed && (!statusFilters.pending || !statusFilters.noShow)}
              onClick={() => toggleStatus('completed')}
            />
            <KpiCard
              icon="⏳"
              label="Pending"
              value={stats.pending}
              subtitle="Awaiting pickup"
              color={COLORS.pending}
              hasNoData={hasNoData}
              spark={sparklines.pending}
              sparkType="bar"
              active={statusFilters.pending && (!statusFilters.completed || !statusFilters.noShow)}
              onClick={() => toggleStatus('pending')}
            />
            <KpiCard
              icon="❌"
              label="No Show"
              value={stats.noShow}
              subtitle="Missed / Cancelled"
              delta={stats.totalCheckIns > 0 ? `${noShowPct}% miss rate` : undefined}
              color={COLORS.noShow}
              hasNoData={hasNoData}
              spark={sparklines.noShow}
              sparkType="bar"
              active={statusFilters.noShow && (!statusFilters.completed || !statusFilters.pending)}
              onClick={() => toggleStatus('noShow')}
            />
          </Grid>
        </MotionBox>

        {/* Hour-density heatmap */}
        {!hasNoData && <HourHeatmapStrip hourTotals={hourTotals} currentHour={currentHour} />}

        {/* Main grid: hour-cards + donut + activity feed */}
        <Grid templateColumns={{ base: '1fr', lg: '3fr 1fr' }} gap={4} alignItems="stretch">
          <GridItem>
            {!csvStatus.hasData && hasNoData
              ? noDataPanel(
                  'No CSV Data Available',
                  "Upload a CSV with today's pickup date to see appointments.",
                )
              : hasNoData
              ? noDataPanel(
                  'No Appointment Data',
                  'No appointments found in the uploaded CSV data for today.',
                )
              : (
                <HourCardsGrid
                  hours={hourBuckets}
                  currentHour={currentHour}
                  onClickAppointment={handleAppointmentClick}
                />
              )}
          </GridItem>

          <GridItem>
            <VStack spacing={4} align="stretch" h="full">
              <StatusDonut
                completed={stats.completed}
                pending={stats.pending}
                noShow={stats.noShow}
                activeFilters={statusFilters}
                onToggle={toggleStatus}
              />
              <Box flex="1" minH="240px">
                <LiveActivityFeed items={feedItems} />
              </Box>
            </VStack>
          </GridItem>
        </Grid>
      </VStack>

      <SlotDrilldownModal
        isOpen={drilldown.isOpen}
        onClose={drilldown.onClose}
        slotLabel={selectedSlot?.label || ''}
        appointments={selectedSlot?.appointments || []}
      />
    </Box>
  );
};

export default CheckInAnalyticsChart;
