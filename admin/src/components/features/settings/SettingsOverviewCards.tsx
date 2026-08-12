/**
 * @fileoverview Top overview cards for Settings page
 */

import React from 'react';
import {
  Card,
  CardBody,
  Grid,
  GridItem,
  HStack,
  Icon,
  Stat,
  StatArrow,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
} from '@chakra-ui/react';
import { FiCheckCircle, FiClock, FiDatabase } from 'react-icons/fi';
import { surfaceCardProps } from './settingsStyles';

const SettingsOverviewCards: React.FC = () => {
  return (
    <Grid
      templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }}
      gap={{ base: 4, sm: 4, md: 5 }}
      w="full"
      maxW="100%"
      minW="0"
    >
      <GridItem w="full" maxW="100%" minW="0">
        <Card {...surfaceCardProps} w="full" maxW="100%" minW="0" h="full">
          <CardBody p={{ base: 4, sm: 5 }}>
            <Stat>
              <StatLabel color="gray.600" fontSize={{ base: 'xs', sm: 'sm' }} fontWeight="500" mb={2}>
                System Status
              </StatLabel>
              <StatNumber color="admin.primary" fontSize={{ base: 'lg', sm: 'xl', md: '2xl' }} mb={1}>
                <HStack spacing={2} align="center" flexWrap="wrap">
                  <Icon as={FiCheckCircle} color="green.500" boxSize={{ base: 4, sm: 5 }} />
                  <Text>Operational</Text>
                </HStack>
              </StatNumber>
              <StatHelpText color="green.600" fontSize={{ base: '2xs', sm: 'xs' }} mt={1}>
                <StatArrow type="increase" />
                All systems running normally
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </GridItem>

      <GridItem w="full" maxW="100%" minW="0">
        <Card {...surfaceCardProps} w="full" maxW="100%" minW="0" h="full">
          <CardBody p={{ base: 4, sm: 5 }}>
            <Stat>
              <StatLabel color="gray.600" fontSize={{ base: 'xs', sm: 'sm' }} fontWeight="500" mb={2}>
                Data Source
              </StatLabel>
              <StatNumber color="admin.primary" fontSize={{ base: 'lg', sm: 'xl', md: '2xl' }} mb={1}>
                <HStack spacing={2} align="center" flexWrap="wrap">
                  <Icon as={FiDatabase} color="blue.500" boxSize={{ base: 4, sm: 5 }} />
                  <Text fontSize={{ base: 'sm', sm: 'md' }}>CSV Primary</Text>
                </HStack>
              </StatNumber>
              <StatHelpText color="blue.600" fontSize={{ base: '2xs', sm: 'xs' }} mt={1}>
                CSV import with optional API enhancement
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </GridItem>

      <GridItem w="full" maxW="100%" minW="0" colSpan={{ base: 1, sm: 2, md: 1 }}>
        <Card {...surfaceCardProps} w="full" maxW="100%" minW="0" h="full">
          <CardBody p={{ base: 4, sm: 5 }}>
            <Stat>
              <StatLabel color="gray.600" fontSize={{ base: 'xs', sm: 'sm' }} fontWeight="500" mb={2}>
                Last Configuration Update
              </StatLabel>
              <StatNumber color="admin.primary" fontSize={{ base: 'lg', sm: 'xl', md: '2xl' }} mb={1}>
                <HStack spacing={2} align="center" flexWrap="wrap">
                  <Icon as={FiClock} color="orange.500" boxSize={{ base: 4, sm: 5 }} />
                  <Text fontSize={{ base: 'sm', sm: 'md' }}>Today</Text>
                </HStack>
              </StatNumber>
              <StatHelpText color="orange.600" fontSize={{ base: '2xs', sm: 'xs' }} mt={1}>
                Configuration is current and up to date
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </GridItem>
    </Grid>
  );
};

export default SettingsOverviewCards;
