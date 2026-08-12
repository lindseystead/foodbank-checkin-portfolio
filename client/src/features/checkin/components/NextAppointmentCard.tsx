/**
 * @fileoverview Next appointment highlight card.
 */

import React from 'react';
import { Badge, Box, Button, HStack, Icon, Text, VStack } from '@chakra-ui/react';
import { FiCalendar, FiCheckCircle, FiClock, FiEdit3 } from 'react-icons/fi';
import type { NextAppointment } from '../hooks/useNextAppointment';
import { palette } from '../../../shared/config/designTokens';

interface NextAppointmentCardProps {
  nextAppointment: NextAppointment | null;
  onReschedule: () => void;
}

const NextAppointmentCard: React.FC<NextAppointmentCardProps> = ({ nextAppointment, onReschedule }) => {
  return (
    <Box
      bg={`linear-gradient(135deg, ${palette.green} 0%, ${palette.greenDark} 100%)`}
      borderRadius="2xl"
      p={{ base: 6, md: 8 }}
      mb={8}
      border="2px solid"
      borderColor="accent.green.200"
      w="full"
      maxW={{ base: '100%', md: '700px' }}
      mx="auto"
      boxShadow="lg"
      position="relative"
      overflow="hidden"
      _before={{
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
        pointerEvents: 'none',
      }}
    >
      <VStack spacing={4} align="center" position="relative" zIndex={1}>
        <HStack spacing={2} align="center">
          <Icon as={FiCheckCircle} boxSize={6} color="white" />
          <Text fontSize="sm" fontWeight="600" color="white" textTransform="uppercase" letterSpacing="wide">
            Appointment Confirmed
          </Text>
        </HStack>

        <Box bg="white" borderRadius="xl" p={{ base: 4, md: 6 }} w="full" boxShadow="md">
          <VStack spacing={3} align="center">
            <HStack spacing={2} align="center" color="green.600">
              <Icon as={FiCalendar} boxSize={5} />
              <Text fontSize="xs" fontWeight="600" textTransform="uppercase" letterSpacing="wide">
                Your Next Appointment
              </Text>
            </HStack>

            <Text
              fontSize={{ base: 'xl', md: '2xl' }}
              fontWeight="700"
              color="gray.800"
              textAlign="center"
              lineHeight="1.2"
              px={2}
              wordBreak="break-word"
            >
              {nextAppointment ? nextAppointment.formattedDate : 'Loading appointment...'}
            </Text>

            <HStack spacing={2} align="center" color="green.600" mt={2}>
              <Icon as={FiClock} boxSize={4} />
              <Text fontSize={{ base: 'lg', md: 'xl' }} fontWeight="600" color="green.600" textAlign="center">
                {nextAppointment ? nextAppointment.time : ''}
              </Text>
            </HStack>

            <Badge
              colorScheme="green"
              variant="subtle"
              fontSize="xs"
              px={3}
              py={1}
              borderRadius="full"
              mt={2}
            >
              ✓ Auto-Scheduled
            </Badge>
          </VStack>
        </Box>

        <Text fontSize="sm" color="white" textAlign="center" px={2} opacity={0.95} maxW="500px">
          Your next appointment has been automatically scheduled. Please arrive on time for your visit.
        </Text>

        {/* Reschedule Button */}
        <Button
          leftIcon={<Icon as={FiEdit3} />}
          onClick={onReschedule}
          colorScheme="whiteAlpha"
          variant="outline"
          size="md"
          mt={2}
          w={{ base: '100%', sm: 'auto' }}
          minW={{ base: '100%', sm: '240px' }}
          borderColor="white"
          color="white"
          _hover={{ bg: 'whiteAlpha.200' }}
        >
          Reschedule Appointment
        </Button>
      </VStack>
    </Box>
  );
};

export default NextAppointmentCard;
