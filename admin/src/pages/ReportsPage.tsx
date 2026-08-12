/**
 * @fileoverview Admin Reports page — reads from the materialized
 * `metrics_daily` rollup (via /api/admin/t/reports/metrics).
 *
 * Three preset windows + custom date range.
 * Each metric card shows value, definition, methodology, and (where
 * applicable) sample size. HungerCount-compatible metrics are flagged.
 *
 * "Generate HungerCount CSV" downloads /reports/hungercount.
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  HStack,
  VStack,
  Text,
  Grid,
  Tag,
  Tooltip,
  Skeleton,
  useToast,
  Icon,
} from '@chakra-ui/react';
import { FiDownload, FiInfo, FiRefreshCw } from 'react-icons/fi';
import { api } from '../lib/api';
import { logger } from '../utils/logger';
import { useTenantTime } from '../utils/useTenantTime';

type Period = 'today' | 'week' | 'month' | 'fy';

interface MetricResult {
  slug: string;
  displayName: string;
  description: string;
  isRate: boolean;
  privacyFloor: number | null;
  hungercountCompatible: boolean;
  value: number | null;
  valueMasked?: string;
  denominator: number;
  sampleSize: number;
  daysWithData: number;
  series: Array<{ date: string; value: number | null }>;
}

const PERIODS: Array<{ id: Period; label: string }> = [
  { id: 'today', label: 'Today' },
  { id: 'week',  label: 'Last 7d' },
  { id: 'month', label: 'This month' },
  { id: 'fy',    label: 'Fiscal year' },
];

const formatValue = (m: MetricResult): string => {
  if (m.valueMasked) return m.valueMasked;
  if (m.value === null || m.value === undefined) return '—';
  if (m.isRate) return `${(m.value * 100).toFixed(1)}%`;
  if (m.slug === 'avg_wait_minutes') return `${m.value.toFixed(0)} min`;
  return Math.round(m.value).toLocaleString();
};

const ReportsPage: React.FC = () => {
  const [period, setPeriod] = useState<Period>('month');
  const [metrics, setMetrics] = useState<MetricResult[]>([]);
  const [range, setRange] = useState<{ from: string; to: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const toast = useToast();
  const { tz } = useTenantTime();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api(`/admin/t/reports/metrics?period=${period}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setMetrics(json.data?.metrics ?? []);
      setRange({ from: json.data?.from, to: json.data?.to });
    } catch (err) {
      logger.error('Failed to load reports', err);
      toast({ title: 'Failed to load reports', status: 'error' });
    } finally {
      setLoading(false);
    }
  }, [period, toast]);

  useEffect(() => {
    load();
  }, [load]);

  const handleRefreshRollup = async () => {
    setRefreshing(true);
    try {
      const today = new Date().toLocaleDateString('en-CA', { timeZone: tz });
      const res = await api('/admin/t/reports/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: today }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      toast({ title: 'Rollup refreshed', status: 'success' });
      await load();
    } catch (err) {
      logger.error('Refresh failed', err);
      toast({ title: 'Refresh failed', status: 'error' });
    } finally {
      setRefreshing(false);
    }
  };

  const handleHungerCountExport = async () => {
    try {
      const res = await api(`/admin/t/reports/hungercount?period=${period}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `hungercount_${range?.from}_to_${range?.to}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      logger.error('Export failed', err);
      toast({ title: 'Export failed', status: 'error' });
    }
  };

  const grouped = useMemo(() => {
    const headlineSlugs = ['total_visits', 'unique_clients_served', 'people_served_total', 'children_served_total'];
    const operationsSlugs = ['no_show_rate', 'avg_wait_minutes', 'mobility_help_rate', 'new_clients_count'];
    return {
      headline: metrics.filter((m) => headlineSlugs.includes(m.slug)),
      operations: metrics.filter((m) => operationsSlugs.includes(m.slug)),
    };
  }, [metrics]);

  return (
    <VStack spacing={5} align="stretch" w="full" minW={0}>
      {/* Toolbar */}
      <HStack justify="space-between" align="center" flexWrap="wrap" gap={3}>
        <ButtonGroup size="sm" isAttached variant="outline">
          {PERIODS.map((p) => (
            <Button
              key={p.id}
              onClick={() => setPeriod(p.id)}
              bg={period === p.id ? 'admin.primary' : 'white'}
              color={period === p.id ? 'white' : 'gray.700'}
              borderColor="gray.300"
              _hover={{ bg: period === p.id ? 'admin.primary' : 'gray.50' }}
              fontWeight="600"
            >
              {p.label}
            </Button>
          ))}
        </ButtonGroup>

        <HStack spacing={2}>
          <Text fontSize="xs" color="gray.500">
            {range ? `${range.from} → ${range.to}` : ''}
          </Text>
          <Tooltip label="Re-run today's rollup against the source views" hasArrow>
            <Button
              size="sm"
              variant="outline"
              leftIcon={<FiRefreshCw />}
              onClick={handleRefreshRollup}
              isLoading={refreshing}
              borderColor="gray.300"
              color="gray.700"
            >
              Refresh
            </Button>
          </Tooltip>
          <Button
            size="sm"
            leftIcon={<FiDownload />}
            onClick={handleHungerCountExport}
            bg="admin.primary"
            color="white"
            _hover={{ bg: 'admin.primaryHover' }}
          >
            HungerCount CSV
          </Button>
        </HStack>
      </HStack>

      {/* Headline section */}
      <Section title="Headline numbers" subtitle="The metrics every funder asks for">
        {loading ? (
          <CardGrid>{[0, 1, 2, 3].map((i) => <Skeleton key={i} height="120px" borderRadius="xl" />)}</CardGrid>
        ) : (
          <CardGrid>
            {grouped.headline.map((m) => <MetricCard key={m.slug} metric={m} />)}
          </CardGrid>
        )}
      </Section>

      {/* Operations section */}
      <Section title="Operations" subtitle="Capacity, wait time, accessibility">
        {loading ? (
          <CardGrid>{[0, 1, 2, 3].map((i) => <Skeleton key={i} height="120px" borderRadius="xl" />)}</CardGrid>
        ) : (
          <CardGrid>
            {grouped.operations.map((m) => <MetricCard key={m.slug} metric={m} />)}
          </CardGrid>
        )}
      </Section>

      {/* Methodology footer */}
      <Box bg="white" border="1px solid" borderColor="gray.200" borderRadius="xl" p={4}>
        <HStack spacing={2} mb={1}>
          <Icon as={FiInfo} color="gray.500" />
          <Text fontSize="sm" fontWeight="700" color="admin.primary">
            How these numbers are computed
          </Text>
        </HStack>
        <Text fontSize="xs" color="gray.600" lineHeight="1.6">
          Every metric on this page is computed from the immutable <code>client_visits</code> log via a
          versioned SQL view. Definitions, exclusions, and edge cases are documented in
          {' '}<code>docs/metrics-dictionary.md</code>. Rate metrics with a denominator under 5 are masked
          (<code>&lt;5</code>) to prevent single-client re-identification. Test tenants are excluded.
          The HungerCount CSV export uses the same source data with column names matching the
          national survey.
        </Text>
      </Box>
    </VStack>
  );
};

// ── Subcomponents ──────────────────────────────────────────────────

const Section: React.FC<{ title: string; subtitle?: string; children: React.ReactNode }> = ({ title, subtitle, children }) => (
  <Box>
    <Box mb={3}>
      <Text fontSize="md" fontWeight="700" color="admin.primary">{title}</Text>
      {subtitle && <Text fontSize="xs" color="gray.500">{subtitle}</Text>}
    </Box>
    {children}
  </Box>
);

const CardGrid: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Grid templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)', xl: 'repeat(4, 1fr)' }} gap={3}>
    {children}
  </Grid>
);

const MetricCard: React.FC<{ metric: MetricResult }> = ({ metric }) => {
  const lowSample = metric.isRate && metric.denominator < 5 && metric.denominator > 0;
  const noData = metric.value === null && !metric.valueMasked;

  return (
    <Box
      bg="white"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="xl"
      p={4}
      boxShadow="sm"
      position="relative"
      transition="border-color 0.15s, box-shadow 0.15s"
      _hover={{ borderColor: 'gray.300', boxShadow: 'md' }}
    >
      <HStack justify="space-between" align="start" mb={1}>
        <Text fontSize="2xs" color="gray.500" fontWeight="600" textTransform="uppercase" letterSpacing="0.05em" noOfLines={1}>
          {metric.displayName}
        </Text>
        {metric.hungercountCompatible && (
          <Tooltip label="Compatible with HungerCount national reporting" hasArrow>
            <Tag size="sm" colorScheme="green" borderRadius="full" fontSize="2xs">HC</Tag>
          </Tooltip>
        )}
      </HStack>

      <Text fontSize="3xl" fontWeight="bold" color={noData ? 'gray.400' : 'admin.primary'} lineHeight="1.1" mt={1}>
        {formatValue(metric)}
      </Text>

      <Text fontSize="2xs" color="gray.500" mt={2} noOfLines={2}>
        {metric.description}
      </Text>

      {(metric.denominator > 0 || metric.sampleSize > 0) && (
        <HStack mt={2} spacing={2}>
          {metric.denominator > 0 && (
            <Tag size="sm" variant="subtle" fontSize="2xs">
              n={metric.denominator}
            </Tag>
          )}
          {metric.sampleSize > 0 && metric.slug !== 'people_served_total' && (
            <Tag size="sm" variant="subtle" fontSize="2xs">
              sample {metric.sampleSize}
            </Tag>
          )}
          {lowSample && (
            <Tooltip label="Low sample — interpret with caution" hasArrow>
              <Tag size="sm" colorScheme="orange" fontSize="2xs">low n</Tag>
            </Tooltip>
          )}
        </HStack>
      )}
    </Box>
  );
};

export default ReportsPage;
