/**
 * Link2Feed integration status and configuration component.
 *
 * Talks to the tenant-scoped backend API endpoints:
 *   GET  /api/admin/t/link2feed/status          — current connection state
 *   POST /api/admin/t/link2feed/configure       — save credentials (persisted to DB)
 *   POST /api/admin/t/link2feed/test-connection  — verify credentials
 *   POST /api/admin/t/link2feed/sync            — pull today's appointments
 *   POST /api/admin/t/link2feed/clear-config    — remove credentials
 *
 * Falls back to localStorage when the backend is unreachable so the UI
 * still renders in CSV-only / offline mode.
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Flex,
  Text,
  Button,
  Badge,
  Card,
  CardBody,
  Icon,
  Heading,
  Input,
  FormControl,
  FormLabel,
  FormHelperText,
  Select,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useToast,
} from '@chakra-ui/react';
import {
  FiCheckCircle,
  FiXCircle,
  FiShield,
  FiGlobe,
  FiKey,
  FiClock,
  FiSettings,
  FiPlay,
  FiTrash2,
  FiRefreshCw,
} from 'react-icons/fi';
import { api } from '../../../lib/api';
import { useTenantTime } from '../../../utils/useTenantTime';

interface Link2FeedConfig {
  apiKey: string;
  secretKey: string;
  baseUrl: string;
  environment: 'test' | 'staging' | 'live';
  organizationId?: string;
}

const Link2FeedStatus: React.FC = () => {
  const { formatTime } = useTenantTime();
  const [isLoading, setIsLoading] = useState(true);
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [config, setConfig] = useState<Link2FeedConfig>({
    apiKey: '',
    secretKey: '',
    baseUrl: '',
    environment: 'test',
    organizationId: '',
  });
  const [status, setStatus] = useState({
    configured: false,
    connected: false,
    hasApiKey: false,
    hasSecretKey: false,
    baseUrl: '',
    environment: 'unknown',
    lastSyncTime: null as string | null,
    lastSyncCount: 0,
    lastSyncError: null as string | null,
    missing: [] as string[],
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Load status from backend on mount, fall back to localStorage
  useEffect(() => {
    const loadStatus = async () => {
      try {
        const response = await api('/admin/t/link2feed/status');
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            setStatus({
              configured: result.data.configured,
              connected: result.data.connected,
              hasApiKey: result.data.configured,
              hasSecretKey: result.data.configured,
              baseUrl: result.data.baseUrl || '',
              environment: result.data.environment || 'unknown',
              lastSyncTime: result.data.lastSyncTime || null,
              lastSyncCount: result.data.lastSyncCount || 0,
              lastSyncError: result.data.lastSyncError || null,
              missing: result.data.configured ? [] : ['API Key', 'Secret Key', 'Base URL'],
            });
            setIsLoading(false);
            return;
          }
        }
      } catch {
        // Backend unreachable — fall back to localStorage
      }

      // Fallback: load non-sensitive config from localStorage for display only.
      // localStorage never contains secrets — it only caches baseUrl/environment/orgId.
      // We cannot know if the backend is actually configured, so show as disconnected.
      try {
        const savedConfig = localStorage.getItem('link2feed_config');
        if (savedConfig) {
          const parsed = JSON.parse(savedConfig);
          setConfig(prev => ({
            ...prev,
            baseUrl: parsed.baseUrl || '',
            environment: parsed.environment || 'test',
            organizationId: parsed.organizationId || '',
          }));
          setStatus(prev => ({
            ...prev,
            configured: false,
            hasApiKey: false,
            hasSecretKey: false,
            baseUrl: parsed.baseUrl || '',
            environment: parsed.environment || 'unknown',
            missing: ['API Key', 'Secret Key', 'Base URL'],
          }));
        } else {
          setStatus(prev => ({
            ...prev,
            configured: false,
            hasApiKey: false,
            hasSecretKey: false,
            baseUrl: '',
            environment: 'unknown',
            missing: ['API Key', 'Secret Key', 'Base URL'],
          }));
        }
      } catch {
        // ignore
      } finally {
        setIsLoading(false);
      }
    };

    loadStatus();
  }, []);

  // Environment → Base URL presets (per Link2Feed documentation)
  const ENV_URL_MAP: Record<string, string> = {
    test: 'https://test.link2feed.com',
    staging: 'https://staging.link2feed.com',
    live: 'https://portal.link2feed.com',
  };

  const handleConfigChange = (field: keyof Link2FeedConfig, value: string) => {
    setConfig(prev => {
      const next = { ...prev, [field]: value };
      // Auto-populate Base URL when environment changes (only if URL is empty or matches a preset)
      if (field === 'environment' && (
        !prev.baseUrl || Object.values(ENV_URL_MAP).includes(prev.baseUrl)
      )) {
        next.baseUrl = ENV_URL_MAP[value] || prev.baseUrl;
      }
      return next;
    });
  };

  const handleSaveConfig = async () => {
    setIsConfiguring(true);
    try {
      if (!config.apiKey || !config.secretKey || !config.baseUrl) {
        toast({
          title: 'Configuration Incomplete',
          description: 'Please fill in all required fields: API Key, Secret Key, and Base URL are required.',
          status: 'error',
          duration: 7000,
          isClosable: true,
        });
        return;
      }

      // Save to backend
      const response = await api('/admin/t/link2feed/configure', {
        method: 'POST',
        body: JSON.stringify({
          apiKey: config.apiKey,
          secretKey: config.secretKey,
          baseUrl: config.baseUrl,
          organizationId: config.organizationId,
        }),
      });

      const result = await response.json();

      // Cache non-sensitive config in localStorage (never store secretKey)
      localStorage.setItem('link2feed_config', JSON.stringify({
        baseUrl: config.baseUrl,
        environment: config.environment,
        organizationId: config.organizationId,
      }));

      setStatus(prev => ({
        ...prev,
        configured: true,
        connected: result.data?.connected || false,
        hasApiKey: true,
        hasSecretKey: true,
        baseUrl: config.baseUrl,
        environment: config.environment,
        missing: [],
      }));

      toast({
        title: result.data?.connected ? 'Configuration Saved & Verified' : 'Configuration Saved',
        description: result.message || 'Link2Feed API configuration has been saved.',
        status: result.data?.connected ? 'success' : 'warning',
        duration: 4000,
        isClosable: true,
      });

      onClose();
    } catch {
      toast({
        title: 'Configuration Error',
        description: 'Unable to save the Link2Feed configuration. Please check your input and try again.',
        status: 'error',
        duration: 7000,
        isClosable: true,
      });
    } finally {
      setIsConfiguring(false);
    }
  };

  const handleTestConnection = async () => {
    try {
      toast({
        title: 'Testing Connection',
        description: 'Verifying Link2Feed API connection with provided credentials...',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });

      const response = await api('/admin/t/link2feed/test-connection', { method: 'POST' });
      const result = await response.json();

      if (result.data?.connected) {
        setStatus(prev => ({ ...prev, connected: true }));
        toast({
          title: 'Connection Successful',
          description: 'Link2Feed API connection test passed.',
          status: 'success',
          duration: 4000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Connection Failed',
          description: result.data?.error || 'Unable to connect to Link2Feed API.',
          status: 'error',
          duration: 7000,
          isClosable: true,
        });
      }
    } catch {
      toast({
        title: 'Connection Failed',
        description: 'Unable to reach the backend. Please verify the API is running.',
        status: 'error',
        duration: 7000,
        isClosable: true,
      });
    }
  };

  const handleSync = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    try {
      const response = await api('/admin/t/link2feed/sync', { method: 'POST' });
      const result = await response.json();

      if (response.status === 429) {
        toast({
          title: 'Please Wait',
          description: result.error || 'Sync requests are rate limited. Please wait a few seconds.',
          status: 'warning',
          duration: 5000,
          isClosable: true,
        });
      } else if (result.success) {
        setStatus(prev => ({
          ...prev,
          connected: true,
          lastSyncTime: new Date().toISOString(),
          lastSyncCount: result.data?.added || 0,
        }));
        toast({
          title: 'Sync Complete',
          description: result.message || `Pulled ${result.data?.added || 0} appointment(s) from Link2Feed.`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Sync Failed',
          description: result.message || 'Failed to sync appointments.',
          status: 'error',
          duration: 7000,
          isClosable: true,
        });
      }
    } catch {
      toast({
        title: 'Sync Failed',
        description: 'Unable to reach the backend.',
        status: 'error',
        duration: 7000,
        isClosable: true,
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleClearConfig = async () => {
    // Clear backend credentials first, then localStorage
    try {
      await api('/admin/t/link2feed/clear-config', { method: 'POST' });
    } catch {
      // Backend may be unreachable — still clear local state
    }

    localStorage.removeItem('link2feed_config');
    setConfig({
      apiKey: '',
      secretKey: '',
      baseUrl: '',
      environment: 'test',
      organizationId: '',
    });
    setStatus({
      configured: false,
      connected: false,
      hasApiKey: false,
      hasSecretKey: false,
      baseUrl: '',
      environment: 'unknown',
      lastSyncTime: null,
      lastSyncCount: 0,
      lastSyncError: null,
      missing: ['API Key', 'Secret Key', 'Base URL'],
    });
    toast({
      title: 'Configuration Cleared',
      description: 'Link2Feed API credentials have been removed from the server',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  const getStatusBadge = () => {
    if (isLoading) return <Badge colorScheme="gray">Loading...</Badge>;
    if (status.connected) return <Badge colorScheme="green">Connected</Badge>;
    if (status.configured) return <Badge colorScheme="yellow">Configured</Badge>;
    return <Badge colorScheme="red">Disconnected</Badge>;
  };

  const getStatusIcon = () => {
    if (isLoading) return FiClock;
    if (status.connected) return FiCheckCircle;
    return FiXCircle;
  };

  const successColor = 'green.500';
  const errorColor = 'red.500';
  const accentColor = 'blue.500';

  if (isLoading) {
    return (
      <Card bg="white" borderColor="gray.200" borderWidth="1px" borderRadius="lg">
        <CardBody>
          <HStack justify="center" spacing={3}>
            <Icon as={FiClock} color={accentColor} />
            <Text>Loading Link2Feed status...</Text>
          </HStack>
        </CardBody>
      </Card>
    );
  }

  return (
    <>
      <Card bg="white" borderColor="gray.200" borderWidth="1px" borderRadius="lg" w="full" maxW="100%" minW="0">
        <CardBody p={{ base: 4, sm: 5 }} w="full" maxW="100%" minW="0">
          <VStack spacing={{ base: 4, sm: 5 }} align="stretch" w="full">
            {/* Status Header */}
            <Flex
              direction={{ base: "column", sm: "row" }}
              justify="space-between"
              align={{ base: "start", sm: "center" }}
              gap={{ base: 3, sm: 4 }}
              w="full"
              flexWrap="wrap"
            >
              <HStack spacing={3} minW="0" flex={1}>
                <Icon
                  as={getStatusIcon()}
                  boxSize={{ base: 5, sm: 6 }}
                  color={status.configured ? successColor : errorColor}
                  flexShrink={0}
                />
                <Heading
                  size={{ base: "sm", sm: "md" }}
                  color="gray.800"
                  lineHeight="1.3"
                >
                  API Connection Status
                </Heading>
              </HStack>
              <Box flexShrink={0}>
                {getStatusBadge()}
              </Box>
            </Flex>

            {/* Status Description */}
            <Text
              fontSize={{ base: "xs", sm: "sm" }}
              color="gray.600"
              lineHeight="1.6"
            >
              {status.configured
                ? status.connected
                  ? 'Your system is connected to the Link2Feed API. Use "Sync Now" to pull today\'s appointments, or continue using CSV uploads alongside the API.'
                  : 'Link2Feed API credentials are configured. Test the connection or sync appointments to verify everything is working.'
                : 'The system is currently operating in CSV-only mode. To enable real-time data synchronization, configure your Link2Feed API credentials below.'
              }
            </Text>

            {/* Success Alert */}
            {status.connected && (
              <Alert status="success" borderRadius="md">
                <AlertIcon />
                <Box w="full" minW="0">
                  <AlertTitle fontSize={{ base: "xs", sm: "sm" }}>API Connected</AlertTitle>
                  <AlertDescription fontSize={{ base: "2xs", sm: "xs" }} mt={1}>
                    Environment: <strong>{status.environment}</strong>
                    {status.baseUrl && <> | URL: <strong>{status.baseUrl}</strong></>}
                    {status.lastSyncTime && <> | Last sync: <strong>{formatTime(status.lastSyncTime)}</strong> ({status.lastSyncCount} added)</>}
                  </AlertDescription>
                </Box>
              </Alert>
            )}

            {/* Sync error alert */}
            {status.configured && status.lastSyncError && (
              <Alert status="warning" borderRadius="md">
                <AlertIcon />
                <Box w="full" minW="0">
                  <AlertTitle fontSize={{ base: "xs", sm: "sm" }}>Last Sync Error</AlertTitle>
                  <AlertDescription fontSize={{ base: "2xs", sm: "xs" }} mt={1}>
                    {status.lastSyncError}
                  </AlertDescription>
                </Box>
              </Alert>
            )}

            {/* Info Alert */}
            {status.missing.length > 0 && (
              <Alert status="info" borderRadius="md">
                <AlertIcon />
                <Box w="full" minW="0">
                  <AlertTitle fontSize={{ base: "xs", sm: "sm" }}>CSV-Only Mode Active</AlertTitle>
                  <AlertDescription fontSize={{ base: "2xs", sm: "xs" }} mt={1}>
                    The system is running in CSV-only mode and functioning normally. Link2Feed API integration is available
                    and ready to activate once API credentials are configured.
                  </AlertDescription>
                </Box>
              </Alert>
            )}

            {/* Action Buttons */}
            <Flex
              direction={{ base: "column", sm: "row" }}
              justify="center"
              align="stretch"
              gap={{ base: 3, sm: 3 }}
              w="full"
              flexWrap="wrap"
            >
              <Button
                leftIcon={<FiSettings />}
                colorScheme="blue"
                onClick={onOpen}
                size={{ base: "sm", sm: "md" }}
                w={{ base: "full", sm: "auto" }}
                minW={{ base: "auto", sm: "200px" }}
              >
                {status.configured ? 'Update Configuration' : 'Configure API'}
              </Button>

              {status.configured && (
                <>
                  <Button
                    leftIcon={<FiPlay />}
                    colorScheme="green"
                    variant="outline"
                    onClick={handleTestConnection}
                    size={{ base: "sm", sm: "md" }}
                    w={{ base: "full", sm: "auto" }}
                    minW={{ base: "auto", sm: "150px" }}
                  >
                    Test Connection
                  </Button>
                  <Button
                    leftIcon={<FiRefreshCw />}
                    colorScheme="teal"
                    variant="outline"
                    onClick={handleSync}
                    isLoading={isSyncing}
                    loadingText="Syncing..."
                    size={{ base: "sm", sm: "md" }}
                    w={{ base: "full", sm: "auto" }}
                    minW={{ base: "auto", sm: "140px" }}
                  >
                    Sync Now
                  </Button>
                  <Button
                    leftIcon={<FiTrash2 />}
                    colorScheme="red"
                    variant="outline"
                    onClick={handleClearConfig}
                    size={{ base: "sm", sm: "md" }}
                    w={{ base: "full", sm: "auto" }}
                    minW={{ base: "auto", sm: "140px" }}
                  >
                    Clear Config
                  </Button>
                </>
              )}
            </Flex>

            {/* Requirements Box */}
            <Box bg="gray.50" p={{ base: 4, sm: 5 }} borderRadius="md" border="1px solid" borderColor="gray.200">
              <VStack align="start" spacing={3} w="full">
                <Heading size={{ base: "xs", sm: "sm" }} color="gray.700" lineHeight="1.3">
                  Required API Credentials
                </Heading>
                <VStack align="start" spacing={2} w="full">
                  <HStack spacing={2} align="start" w="full">
                    <Icon as={FiKey} color={accentColor} boxSize={{ base: 4, sm: 5 }} flexShrink={0} mt={0.5} />
                    <Box flex={1} minW="0">
                      <Text fontSize={{ base: "xs", sm: "sm" }} color="gray.800" fontWeight="600" mb={0.5}>
                        API Key
                      </Text>
                      <Text fontSize={{ base: "2xs", sm: "xs" }} color="gray.600" lineHeight="1.5">
                        A unique identifier provided by Link2Feed that authenticates your organization's API requests.
                      </Text>
                    </Box>
                  </HStack>
                  <HStack spacing={2} align="start" w="full">
                    <Icon as={FiShield} color={accentColor} boxSize={{ base: 4, sm: 5 }} flexShrink={0} mt={0.5} />
                    <Box flex={1} minW="0">
                      <Text fontSize={{ base: "xs", sm: "sm" }} color="gray.800" fontWeight="600" mb={0.5}>
                        Secret Key
                      </Text>
                      <Text fontSize={{ base: "2xs", sm: "xs" }} color="gray.600" lineHeight="1.5">
                        Used for HMAC-SHA256 request signing to ensure secure API communication. This key is never transmitted and remains secure.
                      </Text>
                    </Box>
                  </HStack>
                  <HStack spacing={2} align="start" w="full">
                    <Icon as={FiGlobe} color={accentColor} boxSize={{ base: 4, sm: 5 }} flexShrink={0} mt={0.5} />
                    <Box flex={1} minW="0">
                      <Text fontSize={{ base: "xs", sm: "sm" }} color="gray.800" fontWeight="600" mb={0.5}>
                        Base URL
                      </Text>
                      <Text fontSize={{ base: "2xs", sm: "xs" }} color="gray.600" lineHeight="1.5">
                        The environment-specific API endpoint URL (test, staging, or live/production environment).
                      </Text>
                    </Box>
                  </HStack>
                </VStack>
              </VStack>
            </Box>

            {/* Note */}
            <Box>
              <Text fontSize={{ base: "xs", sm: "sm" }} color="gray.600" lineHeight="1.6">
                <strong>Note:</strong> Link2Feed API integration is completely optional. The system functions fully using CSV exports
                from Link2Feed or any compatible appointment management system. API integration provides real-time synchronization
                and enhanced features, but is not required for basic operations.
              </Text>
            </Box>
          </VStack>
        </CardBody>
      </Card>

      {/* Configuration Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Configure Link2Feed Integration</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Environment</FormLabel>
                <Select
                  value={config.environment}
                  onChange={(e) => handleConfigChange('environment', e.target.value)}
                >
                  <option value="test">Test</option>
                  <option value="staging">Staging</option>
                  <option value="live">Live</option>
                </Select>
                <FormHelperText>Choose your Link2Feed environment</FormHelperText>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>API Base URL</FormLabel>
                <Input
                  value={config.baseUrl}
                  onChange={(e) => handleConfigChange('baseUrl', e.target.value)}
                  placeholder="https://portal.link2feed.com"
                />
                <FormHelperText>Your Link2Feed API endpoint URL</FormHelperText>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>API Key</FormLabel>
                <Input
                  value={config.apiKey}
                  onChange={(e) => handleConfigChange('apiKey', e.target.value)}
                  placeholder="Enter your Link2Feed API key"
                />
                <FormHelperText>Your unique organization identifier</FormHelperText>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Secret Key</FormLabel>
                <Input
                  value={config.secretKey}
                  onChange={(e) => handleConfigChange('secretKey', e.target.value)}
                  placeholder="Enter your Link2Feed secret key"
                  type="password"
                />
                <FormHelperText>Used for HMAC request signing (never transmitted)</FormHelperText>
              </FormControl>

              <FormControl>
                <FormLabel>Agency / Organization ID</FormLabel>
                <Input
                  value={config.organizationId}
                  onChange={(e) => handleConfigChange('organizationId', e.target.value)}
                  placeholder="Enter your agency ID"
                />
                <FormHelperText>Your Link2Feed agency ID (required for syncing appointments)</FormHelperText>
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Flex
              direction={{ base: "column", sm: "row" }}
              justify="center"
              align="stretch"
              gap={{ base: 3, sm: 3 }}
              w="full"
              maxW="100%"
            >
              <Button
                variant="ghost"
                onClick={onClose}
                size={{ base: "md", sm: "md" }}
                w={{ base: "full", sm: "auto" }}
                minW={{ base: "auto", sm: "120px" }}
                order={{ base: 2, sm: 1 }}
              >
                Cancel
              </Button>
              <Button
                colorScheme="blue"
                onClick={handleSaveConfig}
                isLoading={isConfiguring}
                loadingText="Saving..."
                size={{ base: "md", sm: "md" }}
                w={{ base: "full", sm: "auto" }}
                minW={{ base: "auto", sm: "180px" }}
                order={{ base: 1, sm: 2 }}
                fontWeight="600"
              >
                Save Configuration
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Link2FeedStatus;
