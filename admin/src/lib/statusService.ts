/**
 * @fileoverview Shared status fetchers with caching and request deduplication
 *
 * This module centralizes status polling to prevent duplicate requests
 * across multiple components and reduce rate limiting in production.
 */

import { api } from './api';

type StatusDayResponse = {
  success: boolean;
  data?: {
    today: string;
    csvDate?: string;
    data: {
      present: boolean;
      count: number;
      expiresAt?: string;
    };
  };
  dataVersion?: string | number;
  error?: string;
};

type Link2FeedStatusResponse = {
  success: boolean;
  data?: {
    configured?: boolean;
  };
  error?: string;
};

const STATUS_DAY_TTL_MS = 15000;
const LINK2FEED_TTL_MS = 30000;

const statusDayCache: {
  timestamp: number;
  data: StatusDayResponse | null;
  inFlight: Promise<StatusDayResponse> | null;
} = {
  timestamp: 0,
  data: null,
  inFlight: null,
};

const link2FeedCache: {
  timestamp: number;
  data: Link2FeedStatusResponse | null;
  inFlight: Promise<Link2FeedStatusResponse> | null;
} = {
  timestamp: 0,
  data: null,
  inFlight: null,
};

export const invalidateStatusDayCache = (): void => {
  statusDayCache.timestamp = 0;
  statusDayCache.data = null;
};

export const fetchStatusDay = async (
  { force = false }: { force?: boolean } = {}
): Promise<StatusDayResponse> => {
  const now = Date.now();

  if (!force && statusDayCache.data && now - statusDayCache.timestamp < STATUS_DAY_TTL_MS) {
    return statusDayCache.data;
  }

  if (!force && statusDayCache.inFlight) {
    return statusDayCache.inFlight;
  }

  statusDayCache.inFlight = (async () => {
    const response = await api('/admin/t/status/day');
    if (response.status === 429) {
      if (statusDayCache.data) {
        return statusDayCache.data;
      }
      throw new Error('RATE_LIMITED');
    }

    const result = (await response.json()) as StatusDayResponse;
    statusDayCache.data = result;
    statusDayCache.timestamp = Date.now();
    return result;
  })().finally(() => {
    statusDayCache.inFlight = null;
  });

  return statusDayCache.inFlight;
};

export const fetchLink2FeedStatus = async (
  { force = false }: { force?: boolean } = {}
): Promise<Link2FeedStatusResponse> => {
  const now = Date.now();

  if (!force && link2FeedCache.data && now - link2FeedCache.timestamp < LINK2FEED_TTL_MS) {
    return link2FeedCache.data;
  }

  if (!force && link2FeedCache.inFlight) {
    return link2FeedCache.inFlight;
  }

  link2FeedCache.inFlight = (async () => {
    const response = await api('/admin/t/link2feed/status');
    if (response.status === 429) {
      if (link2FeedCache.data) {
        return link2FeedCache.data;
      }
      throw new Error('RATE_LIMITED');
    }

    if (!response.ok) {
      const fallback: Link2FeedStatusResponse = {
        success: false,
        data: { configured: false },
      };
      link2FeedCache.data = fallback;
      link2FeedCache.timestamp = Date.now();
      return fallback;
    }

    const result = (await response.json()) as Link2FeedStatusResponse;
    link2FeedCache.data = result;
    link2FeedCache.timestamp = Date.now();
    return result;
  })().finally(() => {
    link2FeedCache.inFlight = null;
  });

  return link2FeedCache.inFlight;
};
