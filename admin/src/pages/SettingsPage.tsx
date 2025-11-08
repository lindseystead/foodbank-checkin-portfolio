/**
 * @fileoverview Settings page for Foodbank Check-In and Appointment System admin panel
 * 
 * This page provides system configuration options, user preferences,
 * and administrative settings for customizing the food bank system
 * behavior and appearance.
 * 
 * @author Lindsey D. Stead
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 * 
 * @see {@link ../components/features/dashboard/Link2FeedStatus.tsx} Link2Feed status
 */

import {
  Box,
  VStack,
  Text,
  Card,
  CardBody,
  HStack,
  Heading,
  Grid,
  GridItem,
  Badge,
  Icon,
  Divider,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Button,
} from '@chakra-ui/react';
import { 
  FiLink, 
  FiSettings, 
  FiShield, 
  FiDatabase, 
  FiClock,
  FiCheckCircle,
  FiAlertTriangle,
  FiInfo,
  FiExternalLink
} from 'react-icons/fi';
import Link2FeedStatus from '../components/features/dashboard/Link2FeedStatus';

const SettingsPage: React.FC = () => {

  return (
    <VStack spacing={8} align="stretch">
        {/* Header */}
        <Box textAlign="center">
          <Heading size="xl" color="admin.primary" mb={2} fontWeight="700" letterSpacing="-0.025em">
            Settings
          </Heading>
          <Text color="gray.600" fontSize="lg" maxW="600px" mx="auto" fontWeight="500">
            Configure integrations, security, and system preferences
          </Text>
        </Box>

        {/* Quick Stats */}
        <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6}>
          <GridItem>
            <Card bg="white" border="1px solid" borderColor="gray.200" borderRadius="lg" boxShadow="sm">
              <CardBody p={6}>
                <Stat>
                  <StatLabel color="gray.600" fontSize="sm" fontWeight="medium">
                    System Status
                  </StatLabel>
                  <StatNumber color="#25385D" fontSize="2xl">
                    <HStack spacing={2} align="center">
                      <Icon as={FiCheckCircle} color="green.500" />
                      <Text>Operational</Text>
                    </HStack>
                  </StatNumber>
                  <StatHelpText color="green.600" fontSize="xs">
                    <StatArrow type="increase" />
                    System running normally
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </GridItem>

          <GridItem>
            <Card bg="white" border="1px solid" borderColor="gray.200" borderRadius="lg" boxShadow="sm">
              <CardBody p={6}>
                <Stat>
                  <StatLabel color="gray.600" fontSize="sm" fontWeight="medium">
                    Data Source
                  </StatLabel>
                  <StatNumber color="#25385D" fontSize="2xl">
                    <HStack spacing={2} align="center">
                      <Icon as={FiDatabase} color="blue.500" />
                      <Text>CSV Primary</Text>
                    </HStack>
                  </StatNumber>
                  <StatHelpText color="blue.600" fontSize="xs">
                    CSV with optional API enhancement
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </GridItem>

          <GridItem>
            <Card bg="white" border="1px solid" borderColor="gray.200" borderRadius="lg" boxShadow="sm">
              <CardBody p={6}>
                <Stat>
                  <StatLabel color="gray.600" fontSize="sm" fontWeight="medium">
                    Last Updated
                  </StatLabel>
                  <StatNumber color="#25385D" fontSize="2xl">
                    <HStack spacing={2} align="center">
                      <Icon as={FiClock} color="orange.500" />
                      <Text>Today</Text>
                    </HStack>
                  </StatNumber>
                  <StatHelpText color="orange.600" fontSize="xs">
                    Configuration current
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>

        {/* Main Settings Sections */}
        <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={8}>
          {/* Primary Settings */}
          <GridItem>
            <VStack spacing={6} align="stretch">
              {/* Link2Feed Integration */}
              <Card bg="white" border="1px solid" borderColor="gray.200" borderRadius="lg" boxShadow="md">
                <CardBody p={6}>
                  <VStack spacing={6} align="stretch">
                    <HStack justify="space-between" align="center">
                      <HStack spacing={3}>
                        <Box
                          p={2}
                          bg="blue.100"
                          borderRadius="full"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Icon as={FiLink} color="#25385D" boxSize={5} />
                        </Box>
                        <VStack spacing={0} align="start">
                          <Heading size="md" color="#25385D">
                            Link2Feed Integration
                          </Heading>
                          <Text color="gray.500" fontSize="sm">
                            Optional real-time integration for enhanced data processing
                          </Text>
                        </VStack>
                      </HStack>
                      <Badge colorScheme="gray" variant="subtle" px={3} py={1} borderRadius="full">
                        Optional
                      </Badge>
                    </HStack>

                    <Divider />

                    <Link2FeedStatus />
                  </VStack>
                </CardBody>
              </Card>

              {/* System Configuration */}
              <Card bg="white" border="1px solid" borderColor="gray.200" borderRadius="lg" boxShadow="md">
                <CardBody p={6}>
                  <VStack spacing={4} align="stretch">
                    <HStack spacing={3}>
                      <Box
                        p={2}
                        bg="blue.100"
                        borderRadius="full"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Icon as={FiSettings} color="#25385D" boxSize={5} />
                      </Box>
                      <VStack spacing={0} align="start">
                        <Heading size="md" color="#25385D">
                          System Configuration
                        </Heading>
                        <Text color="gray.500" fontSize="sm">
                          General system settings and preferences
                        </Text>
                      </VStack>
                    </HStack>

                    <Box bg="gray.50" p={4} borderRadius="md" border="1px solid" borderColor="gray.200">
                      <VStack spacing={3} align="start">
                        <HStack spacing={2}>
                          <Icon as={FiInfo} color="blue.500" boxSize={4} />
                          <Text fontSize="sm" fontWeight="medium" color="gray.700">
                            Configuration Options
                          </Text>
                        </HStack>
                        <Text fontSize="sm" color="gray.600">
                          System configuration options will be available in a future update. 
                          Currently, all settings are managed through the Link2Feed integration above.
                        </Text>
                      </VStack>
                    </Box>
                  </VStack>
                </CardBody>
              </Card>
            </VStack>
          </GridItem>

          {/* Secondary Settings */}
          <GridItem>
            <VStack spacing={6} align="stretch">
              {/* Security Settings */}
              <Card bg="white" border="1px solid" borderColor="gray.200" borderRadius="lg" boxShadow="md">
                <CardBody p={6}>
                  <VStack spacing={4} align="stretch">
                    <HStack spacing={3}>
                      <Box
                        p={2}
                        bg="green.100"
                        borderRadius="full"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Icon as={FiShield} color="#25385D" boxSize={5} />
                      </Box>
                      <VStack spacing={0} align="start">
                        <Heading size="md" color="#25385D">
                          Security
                        </Heading>
                        <Text color="gray.500" fontSize="sm">
                          Authentication and access control
                        </Text>
                      </VStack>
                    </HStack>

                    <Box bg="green.50" p={4} borderRadius="md" border="1px solid" borderColor="green.200">
                      <VStack spacing={2} align="start">
                        <HStack spacing={2}>
                          <Icon as={FiCheckCircle} color="green.500" boxSize={4} />
                          <Text fontSize="sm" fontWeight="medium" color="green.700">
                            Security Status
                          </Text>
                        </HStack>
                        <Text fontSize="sm" color="green.600">
                          All security measures are active and up to date.
                        </Text>
                      </VStack>
                    </Box>
                  </VStack>
                </CardBody>
              </Card>

              {/* Help & Support */}
              <Card bg="white" border="1px solid" borderColor="gray.200" borderRadius="lg" boxShadow="md">
                <CardBody p={6}>
                  <VStack spacing={4} align="stretch">
                    <Heading size="md" color="#25385D">
                      Help & Support
                    </Heading>
                    
                    <VStack spacing={3} align="stretch">
                      <Box p={3} bg="blue.50" borderRadius="md" border="1px solid" borderColor="blue.200" textAlign="center">
                        <Text fontSize="sm" color="blue.700" fontWeight="medium" mb={1}>
                          Technical Support
                        </Text>
                        <Text fontSize="xs" color="blue.600" mb={2}>
                          For technical support, bug reports, questions, or concerns:
                        </Text>
                        <HStack spacing={2} justify="center">
                          <Button
                            as="a"
                            href="mailto:lindsey@lifesavertech.ca?subject=Technical Support Request&body=Please describe your issue or question:"
                            size="xs"
                            colorScheme="blue"
                            variant="outline"
                            rightIcon={<FiExternalLink />}
                          >
                            Contact Lindsey Stead
                          </Button>
                        </HStack>
                        <Text fontSize="xs" color="blue.600" mt={2}>
                          lindsey@lifesavertech.ca
                        </Text>
                      </Box>

                      <Box p={3} bg="blue.50" borderRadius="md" border="1px solid" borderColor="blue.200" textAlign="center">
                        <Text fontSize="sm" color="blue.700" fontWeight="medium" mb={1}>
                          Link2Feed Support
                        </Text>
                        <Text fontSize="xs" color="blue.600" mb={2}>
                          Get help with Link2Feed integration and API configuration.
                        </Text>
                        <HStack spacing={2} justify="center">
                          <Button
                            as="a"
                            href="https://www.link2feed.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            size="xs"
                            colorScheme="blue"
                            variant="outline"
                            rightIcon={<FiExternalLink />}
                          >
                            Support Center
                          </Button>
                          <Button
                            as="a"
                            href="mailto:support@link2feed.com"
                            size="xs"
                            colorScheme="blue"
                            variant="outline"
                            rightIcon={<FiExternalLink />}
                          >
                            Email Support
                          </Button>
                        </HStack>
                      </Box>

                      <Box p={3} bg="green.50" borderRadius="md" border="1px solid" borderColor="green.200" textAlign="center">
                        <Text fontSize="sm" color="green.700" fontWeight="medium" mb={1}>
                          System Administrator
                        </Text>
                        <Text fontSize="xs" color="green.600">
                          Contact your system administrator for technical issues or configuration changes.
                        </Text>
                      </Box>

                      <Box p={3} bg="orange.50" borderRadius="md" border="1px solid" borderColor="orange.200" textAlign="center">
                        <HStack spacing={2} justify="center">
                          <Icon as={FiAlertTriangle} color="orange.500" boxSize={4} />
                          <Text fontSize="sm" color="orange.700" fontWeight="medium">
                            Important
                          </Text>
                        </HStack>
                        <Text fontSize="xs" color="orange.600" mt={1}>
                          Changes to integration settings may affect data processing.
                        </Text>
                      </Box>
                    </VStack>
                  </VStack>
                </CardBody>
              </Card>
            </VStack>
          </GridItem>
        </Grid>
      </VStack>
  );
};

export default SettingsPage;
