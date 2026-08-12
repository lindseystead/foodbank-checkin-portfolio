/**
 * @fileoverview Status overview for CSV upload page
 */

import React from 'react';
import {
  Box,
  Button,
  Grid,
  GridItem,
  Icon,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import {
  FiCalendar,
  FiClock,
  FiDatabase,
  FiDownload,
  FiRefreshCw,
  FiTrash2,
  FiUpload,
} from 'react-icons/fi';

interface DayStatus {
  today: string;
  data: {
    present: boolean;
    count: number;
    expiresAt?: string;
  };
}

interface CSVStatusOverviewProps {
  status: DayStatus | null;
  loading: boolean;
  error: string | null;
  getStatusColor: () => 'green' | 'red';
  getStatusText: () => string;
  formatExpiryTime: (expiresAt: string) => string;
  onRefresh: () => void;
  onClearAllData: () => void;
}

const surfaceCardProps = {
  bg: 'white',
  borderRadius: 'xl',
  boxShadow: 'sm',
  border: '1px solid',
  borderColor: 'gray.200',
} as const;

const CSVStatusOverview: React.FC<CSVStatusOverviewProps> = ({
  status,
  loading,
  error,
  getStatusColor,
  getStatusText,
  formatExpiryTime,
  onRefresh,
  onClearAllData,
}) => {
  return (
    <>
      <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={{ base: 3, sm: 3, md: 4 }} w="full" maxW="100%">
        <GridItem>
          <Box
            {...surfaceCardProps}
            borderRadius="2xl"
            p={6}
            textAlign="center"
            h="full"
            position="relative"
            _before={{
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'brand.500',
              borderRadius: '2xl 2xl 0 0',
            }}
          >
            <VStack spacing={4} h="full" justify="center">
              <Box bg="cofb.blue" color="white" borderRadius="xl" p={4} display="inline-flex">
                <Icon as={FiCalendar} color="brand.500" boxSize={6} />
              </Box>
              <VStack spacing={2}>
                <Text fontSize="sm" color="brand.500" fontWeight="600" textTransform="uppercase" letterSpacing="wide">
                  Today's Date
                </Text>
                <Text fontSize="xl" fontWeight="bold" color="admin.primary">
                  {status?.today || 'Loading...'}
                </Text>
              </VStack>
            </VStack>
          </Box>
        </GridItem>

        <GridItem>
          <Box
            {...surfaceCardProps}
            borderRadius="2xl"
            p={6}
            textAlign="center"
            h="full"
            position="relative"
            _before={{
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: getStatusColor() === 'green' ? 'accent.green.300' : 'accent.coral.300',
              borderRadius: '2xl 2xl 0 0',
            }}
          >
            <VStack spacing={4} h="full" justify="center">
              <Box
                bg={getStatusColor() === 'green' ? 'cofb.green' : 'cofb.coral'}
                color="white"
                borderRadius="xl"
                p={4}
                display="inline-flex"
              >
                <Icon
                  as={FiDatabase}
                  color={getStatusColor() === 'green' ? 'accent.green.300' : 'accent.coral.300'}
                  boxSize={6}
                />
              </Box>
              <VStack spacing={2}>
                <Text
                  fontSize="sm"
                  color={getStatusColor() === 'green' ? 'accent.green.300' : 'accent.coral.300'}
                  fontWeight="600"
                  textTransform="uppercase"
                  letterSpacing="wide"
                >
                  Data Status
                </Text>
                <Text fontSize="xl" fontWeight="bold" color="admin.primary">
                  {getStatusText()}
                </Text>
              </VStack>
            </VStack>
          </Box>
        </GridItem>
      </Grid>

      <Grid templateColumns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap={{ base: 3, sm: 3, md: 4 }} w="full" maxW="100%">
        <GridItem>
          <Box {...surfaceCardProps} borderRadius="lg" p={5} textAlign="center" h="full">
            <VStack spacing={3} h="full" justify="center">
              <Box bg="blue.100" borderRadius="full" p={3} display="inline-flex">
                <Icon as={FiDatabase} color="brand.500" boxSize={5} />
              </Box>
              <VStack spacing={1}>
                <Text fontSize="xs" color="brand.500" fontWeight="600" textTransform="uppercase" letterSpacing="wide">
                  Client Appointments Loaded
                </Text>
                {loading ? (
                  <Spinner size="md" color="admin.primary" />
                ) : error ? (
                  <Text color="accent.coral.300" fontSize="sm">
                    Error
                  </Text>
                ) : (
                  <Text fontSize="2xl" fontWeight="bold" color="admin.primary">
                    {status?.data.count || 0}
                  </Text>
                )}
                {status?.data.present && status.data.expiresAt && (
                  <Text color="accent.orange.300" fontSize="xs">
                    <Icon as={FiClock} mr={1} />
                    Expires in {formatExpiryTime(status.data.expiresAt)}
                  </Text>
                )}
              </VStack>
            </VStack>
          </Box>
        </GridItem>

        <GridItem>
          <Box {...surfaceCardProps} borderRadius="lg" p={5} textAlign="center" h="full">
            <VStack spacing={3} h="full" justify="center">
              <Box bg="green.100" borderRadius="full" p={3} display="inline-flex">
                <Icon as={FiUpload} color="accent.green.300" boxSize={5} />
              </Box>
              <VStack spacing={1}>
                <Text fontSize="xs" color="accent.green.300" fontWeight="600" textTransform="uppercase" letterSpacing="wide">
                  System Status
                </Text>
                <Text fontSize="lg" fontWeight="bold" color="admin.primary">
                  Ready
                </Text>
                <Text fontSize="xs" color="gray.500">
                  Ready to accept uploads
                </Text>
              </VStack>
            </VStack>
          </Box>
        </GridItem>

        <GridItem>
          <Box {...surfaceCardProps} borderRadius="lg" p={5} h="full">
            <VStack spacing={3} h="full" justify="center">
              <Box bg="blue.100" borderRadius="full" p={3} display="inline-flex">
                <Icon as={FiRefreshCw} color="brand.500" boxSize={5} />
              </Box>
              <VStack spacing={2} w="full">
                <Button
                  size="sm"
                  colorScheme="blue"
                  leftIcon={<FiRefreshCw />}
                  onClick={onRefresh}
                  isLoading={loading}
                  w="full"
                  borderRadius="md"
                >
                  Refresh Status
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  colorScheme="gray"
                  leftIcon={<FiDownload />}
                  w="full"
                  borderRadius="md"
                  isDisabled
                >
                  Download Template
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  colorScheme="red"
                  leftIcon={<FiTrash2 />}
                  onClick={onClearAllData}
                  w="full"
                  borderRadius="md"
                >
                  Clear All Data
                </Button>
              </VStack>
            </VStack>
          </Box>
        </GridItem>
      </Grid>
    </>
  );
};

export default CSVStatusOverview;
