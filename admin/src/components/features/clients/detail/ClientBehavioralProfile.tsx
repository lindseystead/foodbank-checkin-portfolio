/**
 * @fileoverview Behavioral profile card for the Client Detail page.
 *
 * Reads from `GET /api/admin/t/clients/:id/profile` (returns from
 * `clientsStore.getClientProfile`). Surfaces the longitudinal behavioral
 * data that lives in the persistent `clients` + `client_visits` tables —
 * stuff that survives the 24h purge of `records`.
 *
 * Includes a volunteer-tag editor (preset chips + remove) so the staff
 * can attach lightweight observations without burdening clients with
 * surveys.
 */

import React, { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Grid,
  GridItem,
  HStack,
  VStack,
  Text,
  Tag,
  TagCloseButton,
  TagLabel,
  Wrap,
  WrapItem,
  Skeleton,
  Tooltip,
  useToast,
  Badge,
} from '@chakra-ui/react';
import { FiPlus } from 'react-icons/fi';
import { api } from '../../../../lib/api';
import { logger } from '../../../../utils/logger';
import { useTenantTime } from '../../../../utils/useTenantTime';

interface BehavioralProfile {
  id: string;
  externalClientId: string;
  totalVisits: number;
  totalNoShows: number;
  visitsLast30Days: number;
  visitsLast90Days: number;
  noShowRate: number;
  avgWaitMinutes: number | null;
  languagesUsed: string[];
  firstSeenAt: string;
  lastSeenAt: string;
  recentVisits: Array<{
    id: string;
    appointmentAt: string | null;
    checkedInAt: string | null;
    status: string;
    waitMinutes: number | null;
  }>;
  tags: Array<{ slug: string; label: string; createdAt: string; note: string | null }>;
}

interface Props {
  /** The persistent clients.id (UUID), NOT the external_client_id from CSV. */
  clientUuid?: string;
}

/** Preset volunteer tag library — shown as suggestions for quick add. */
const PRESET_TAGS: Array<{ slug: string; label: string; emoji: string; color: string }> = [
  { slug: 'no_fridge',     label: 'No fridge',           emoji: '🥶', color: 'cyan' },
  { slug: 'no_freezer',    label: 'No freezer',          emoji: '❄️', color: 'blue' },
  { slug: 'on_foot',       label: 'Arrives on foot',     emoji: '🚶', color: 'gray' },
  { slug: 'has_infant',    label: 'Has infant',          emoji: '👶', color: 'pink' },
  { slug: 'has_senior',    label: 'Has senior in home',  emoji: '👴', color: 'orange' },
  { slug: 'health_issue',  label: 'Health issue noted',  emoji: '🩺', color: 'red' },
  { slug: 'in_crisis',     label: 'In crisis — flag',    emoji: '🆘', color: 'red' },
  { slug: 'language_help', label: 'Language assistance', emoji: '🗣️', color: 'purple' },
  { slug: 'transport_help', label: 'Needs transport help', emoji: '🚐', color: 'teal' },
];

const ClientBehavioralProfile: React.FC<Props> = ({ clientUuid }) => {
  const [profile, setProfile] = useState<BehavioralProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingTag, setPendingTag] = useState<string | null>(null);
  const toast = useToast();
  const { formatDate } = useTenantTime();

  const load = useCallback(async () => {
    if (!clientUuid) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api(`/admin/t/clients/${clientUuid}/profile`);
      if (!res.ok) {
        if (res.status === 404) {
          setProfile(null);
          setError(null);
        } else {
          throw new Error(`HTTP ${res.status}`);
        }
        return;
      }
      const json = await res.json();
      setProfile(json.data);
    } catch (err) {
      logger.error('Failed to load behavioral profile', err);
      setError('Could not load behavioral profile');
    } finally {
      setLoading(false);
    }
  }, [clientUuid]);

  useEffect(() => {
    load();
  }, [load]);

  const addTag = async (slug: string, label: string) => {
    if (!clientUuid) return;
    setPendingTag(slug);
    try {
      const res = await api(`/admin/t/clients/${clientUuid}/tags`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tagSlug: slug, tagLabel: label }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      toast({ title: `Tagged: ${label}`, status: 'success', duration: 2000 });
      await load();
    } catch (err) {
      logger.error('Failed to add tag', err);
      toast({ title: 'Failed to add tag', status: 'error' });
    } finally {
      setPendingTag(null);
    }
  };

  const removeTag = async (slug: string) => {
    if (!clientUuid) return;
    try {
      const res = await api(`/admin/t/clients/${clientUuid}/tags/${slug}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await load();
    } catch (err) {
      logger.error('Failed to remove tag', err);
      toast({ title: 'Failed to remove tag', status: 'error' });
    }
  };

  if (!clientUuid) {
    return (
      <Box bg="white" border="1px solid" borderColor="gray.200" borderRadius="xl" p={4}>
        <Text fontSize="sm" color="gray.500">
          Behavioral profile not available — this client hasn't been recorded in the persistent layer yet.
        </Text>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box bg="white" border="1px solid" borderColor="gray.200" borderRadius="xl" p={4}>
        <Skeleton height="160px" />
      </Box>
    );
  }

  if (error || !profile) {
    return (
      <Box bg="white" border="1px solid" borderColor="orange.200" borderRadius="xl" p={4}>
        <Text fontSize="sm" color="orange.700">
          {error || 'No behavioral data yet for this client.'}
        </Text>
      </Box>
    );
  }

  const noShowPct = Math.round(profile.noShowRate * 100);
  const tagSlugs = new Set(profile.tags.map((t) => t.slug));

  return (
    <Box bg="white" border="1px solid" borderColor="gray.200" borderRadius="xl" p={5}>
      <HStack justify="space-between" mb={4} flexWrap="wrap" gap={2}>
        <VStack align="start" spacing={0}>
          <Text fontSize="md" fontWeight="700" color="admin.primary">
            Behavioral Profile
          </Text>
          <Text fontSize="xs" color="gray.500">
            Survives across CSV uploads · keyed by client ID {profile.externalClientId}
          </Text>
        </VStack>
      </HStack>

      {/* Metric tiles */}
      <Grid templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }} gap={3} mb={5}>
        <Tile label="Total visits" value={profile.totalVisits.toString()} />
        <Tile label="Last 30 days" value={profile.visitsLast30Days.toString()} />
        <Tile label="Last 90 days" value={profile.visitsLast90Days.toString()} />
        <Tile
          label="No-show rate"
          value={profile.totalVisits + profile.totalNoShows >= 5 ? `${noShowPct}%` : '<5'}
          tone={noShowPct >= 30 ? 'warn' : 'normal'}
        />
        <Tile
          label="Avg wait time"
          value={profile.avgWaitMinutes !== null ? `${profile.avgWaitMinutes} min` : '—'}
        />
        <Tile label="First seen" value={formatDate(profile.firstSeenAt)} />
        <Tile label="Last seen" value={formatDate(profile.lastSeenAt)} />
        <Tile label="Languages used" value={profile.languagesUsed.length ? profile.languagesUsed.join(', ').toUpperCase() : '—'} />
      </Grid>

      {/* Volunteer tags */}
      <VStack align="stretch" spacing={2} mb={4}>
        <HStack justify="space-between">
          <Text fontSize="xs" color="gray.500" fontWeight="600" textTransform="uppercase" letterSpacing="0.05em">
            Volunteer observations
          </Text>
          <Text fontSize="2xs" color="gray.400">Click a chip to toggle</Text>
        </HStack>

        {profile.tags.length > 0 && (
          <Wrap spacing={2}>
            {profile.tags.map((t) => {
              const preset = PRESET_TAGS.find((p) => p.slug === t.slug);
              return (
                <WrapItem key={t.slug}>
                  <Tag size="md" colorScheme={preset?.color ?? 'gray'} borderRadius="full">
                    <TagLabel>
                      {preset?.emoji} {t.label}
                    </TagLabel>
                    <TagCloseButton onClick={() => removeTag(t.slug)} />
                  </Tag>
                </WrapItem>
              );
            })}
          </Wrap>
        )}

        <Wrap spacing={2} pt={2}>
          {PRESET_TAGS.filter((p) => !tagSlugs.has(p.slug)).map((p) => (
            <WrapItem key={p.slug}>
              <Tooltip label="Add observation" hasArrow>
                <Button
                  size="xs"
                  variant="outline"
                  borderRadius="full"
                  borderColor="gray.300"
                  color="gray.600"
                  fontWeight="500"
                  leftIcon={<FiPlus />}
                  isLoading={pendingTag === p.slug}
                  onClick={() => addTag(p.slug, p.label)}
                  _hover={{ borderColor: 'admin.primary', color: 'admin.primary', bg: 'gray.50' }}
                >
                  {p.emoji} {p.label}
                </Button>
              </Tooltip>
            </WrapItem>
          ))}
        </Wrap>
      </VStack>

      {/* Recent visit timeline */}
      {profile.recentVisits.length > 0 && (
        <Box>
          <Text fontSize="xs" color="gray.500" fontWeight="600" textTransform="uppercase" letterSpacing="0.05em" mb={2}>
            Recent visits
          </Text>
          <VStack align="stretch" spacing={1}>
            {profile.recentVisits.slice(0, 6).map((v) => (
              <HStack
                key={v.id}
                py={2}
                px={3}
                bg="gray.50"
                borderRadius="md"
                fontSize="sm"
                justify="space-between"
              >
                <Text color="gray.700" flex="1" minW={0} noOfLines={1}>
                  {v.appointmentAt ? formatDate(v.appointmentAt) : 'Walk-in'}
                </Text>
                <HStack spacing={2} flexShrink={0}>
                  {v.waitMinutes !== null && (
                    <Text fontSize="xs" color="gray.500">{v.waitMinutes}m wait</Text>
                  )}
                  <Badge colorScheme={statusColor(v.status)} fontSize="2xs" borderRadius="full">
                    {v.status}
                  </Badge>
                </HStack>
              </HStack>
            ))}
          </VStack>
        </Box>
      )}
    </Box>
  );
};

const Tile: React.FC<{ label: string; value: string; tone?: 'normal' | 'warn' }> = ({ label, value, tone = 'normal' }) => (
  <GridItem>
    <Box bg="gray.50" border="1px solid" borderColor="gray.100" borderRadius="lg" p={3}>
      <Text fontSize="2xs" color="gray.500" fontWeight="600" textTransform="uppercase" letterSpacing="0.05em">
        {label}
      </Text>
      <Text fontSize="lg" fontWeight="700" color={tone === 'warn' ? 'accent.coral.300' : 'admin.primary'} mt={1} noOfLines={1}>
        {value}
      </Text>
    </Box>
  </GridItem>
);

const statusColor = (s: string): string => {
  switch (s) {
    case 'collected':
    case 'checked_in':
      return 'green';
    case 'no_show':
      return 'red';
    case 'cancelled':
    case 'rescheduled':
      return 'gray';
    default:
      return 'gray';
  }
};

export default ClientBehavioralProfile;
