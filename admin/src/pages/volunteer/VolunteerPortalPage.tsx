/**
 * @fileoverview Volunteer self-service portal.
 * Tabs: My Shifts, Open Shifts (sign up), My Hours, Availability.
 */

import React, { useState } from 'react';
import {
  Box, VStack, HStack, Text, Heading, Button, Badge, Spinner, Center,
  Tabs, TabList, TabPanels, Tab, TabPanel, Table, Thead, Tbody, Tr, Th, Td,
  useToast, Stat, StatLabel, StatNumber, SimpleGrid, FormControl, FormLabel,
  Select, Input,
} from '@chakra-ui/react';
import { useMyVolunteer } from '../../hooks/useMyVolunteer';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const VolunteerPortalPage: React.FC = () => {
  const {
    profile, myShifts, openShifts, hours, totalHours, availability,
    isLoading, noProfile, error, signUp, addAvailability,
  } = useMyVolunteer();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [day, setDay] = useState('0');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [savingAvail, setSavingAvail] = useState(false);
  const toast = useToast();

  if (isLoading) {
    return <Center py={16}><Spinner size="xl" color="admin.primary" thickness="4px" /></Center>;
  }

  if (noProfile) {
    return (
      <Center py={16}>
        <VStack spacing={3} maxW="md" textAlign="center">
          <Heading size="md">No volunteer profile yet</Heading>
          <Text color="gray.600">
            Your account isn't linked to a volunteer record for this organization.
            Please contact your volunteer coordinator.
          </Text>
        </VStack>
      </Center>
    );
  }

  const handleSignUp = async (shiftId: string) => {
    setBusyId(shiftId);
    const res = await signUp(shiftId);
    setBusyId(null);
    toast({
      title: res.ok ? (res.onWaitlist ? 'Added to waitlist' : 'Signed up!') : 'Signup failed',
      description: res.ok ? undefined : res.error,
      status: res.ok ? 'success' : 'error',
      duration: 4000, isClosable: true,
    });
  };

  const handleAddAvailability = async () => {
    if (!start || !end) {
      toast({ title: 'Start and end time are required', status: 'warning', duration: 3000, isClosable: true });
      return;
    }
    setSavingAvail(true);
    const res = await addAvailability(Number(day), start, end);
    setSavingAvail(false);
    if (res.ok) {
      toast({ title: 'Availability saved', status: 'success', duration: 3000, isClosable: true });
      setStart(''); setEnd('');
    } else {
      toast({ title: 'Failed to save', description: res.error, status: 'error', duration: 4000, isClosable: true });
    }
  };

  return (
    <VStack spacing={6} align="stretch">
      <Box>
        <Heading size="md" color="admin.primary">
          Welcome{profile ? `, ${profile.first_name}` : ''}
        </Heading>
        {profile && (
          <HStack mt={1} spacing={2}>
            <Text fontSize="sm" color="gray.500">{profile.email}</Text>
            <Badge colorScheme={profile.status === 'approved' ? 'green' : 'orange'}>{profile.status}</Badge>
          </HStack>
        )}
      </Box>

      {error && <Text color="red.500" fontSize="sm">{error}</Text>}

      <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={4}>
        <Stat bg="white" p={4} borderRadius="md" border="1px solid" borderColor="gray.200">
          <StatLabel>Upcoming shifts</StatLabel>
          <StatNumber>{myShifts.filter((s) => s.status === 'assigned' || s.status === 'checked_in').length}</StatNumber>
        </Stat>
        <Stat bg="white" p={4} borderRadius="md" border="1px solid" borderColor="gray.200">
          <StatLabel>Total hours</StatLabel>
          <StatNumber>{totalHours}</StatNumber>
        </Stat>
        <Stat bg="white" p={4} borderRadius="md" border="1px solid" borderColor="gray.200">
          <StatLabel>Open shifts</StatLabel>
          <StatNumber>{openShifts.length}</StatNumber>
        </Stat>
      </SimpleGrid>

      <Tabs colorScheme="blue" variant="enclosed" isLazy>
        <TabList>
          <Tab>My Shifts</Tab>
          <Tab>Open Shifts</Tab>
          <Tab>My Hours</Tab>
          <Tab>Availability</Tab>
        </TabList>
        <TabPanels>
          {/* My Shifts */}
          <TabPanel px={0}>
            <ShiftTable
              empty="You have no shift sign-ups yet."
              rows={myShifts.map((a) => ({
                key: a.id,
                position: a.volunteer_shifts?.position || '—',
                date: a.volunteer_shifts?.shift_date || '—',
                time: a.volunteer_shifts ? `${a.volunteer_shifts.start_time}–${a.volunteer_shifts.end_time}` : '—',
                location: a.volunteer_shifts?.location || '—',
                status: a.status,
              }))}
            />
          </TabPanel>

          {/* Open Shifts */}
          <TabPanel px={0}>
            <Box w="full" overflowX="auto" border="1px solid" borderColor="gray.200" borderRadius="md">
              <Table variant="simple" size="sm">
                <Thead bg="gray.50">
                  <Tr><Th>Position</Th><Th>Date</Th><Th>Time</Th><Th>Location</Th><Th textAlign="right">Action</Th></Tr>
                </Thead>
                <Tbody>
                  {openShifts.length === 0 && (
                    <Tr><Td colSpan={5}><Text py={6} textAlign="center" color="gray.500">No open shifts right now</Text></Td></Tr>
                  )}
                  {openShifts.map((s) => (
                    <Tr key={s.id} _hover={{ bg: 'gray.50' }}>
                      <Td fontWeight="500">{s.position}</Td>
                      <Td>{s.shift_date}</Td>
                      <Td>{s.start_time}–{s.end_time}</Td>
                      <Td>{s.location || '—'}</Td>
                      <Td textAlign="right">
                        <Button size="xs" colorScheme="green" isLoading={busyId === s.id} onClick={() => handleSignUp(s.id)}>
                          Sign up
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </TabPanel>

          {/* My Hours */}
          <TabPanel px={0}>
            <Box w="full" overflowX="auto" border="1px solid" borderColor="gray.200" borderRadius="md">
              <Table variant="simple" size="sm">
                <Thead bg="gray.50">
                  <Tr><Th>Date</Th><Th isNumeric>Hours</Th><Th>Notes</Th></Tr>
                </Thead>
                <Tbody>
                  {hours.length === 0 && (
                    <Tr><Td colSpan={3}><Text py={6} textAlign="center" color="gray.500">No hours logged yet</Text></Td></Tr>
                  )}
                  {hours.map((h) => (
                    <Tr key={h.id} _hover={{ bg: 'gray.50' }}>
                      <Td>{h.dateWorked}</Td>
                      <Td isNumeric>{h.hoursWorked}</Td>
                      <Td>{h.notes || '—'}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </TabPanel>

          {/* Availability */}
          <TabPanel px={0}>
            <VStack spacing={4} align="stretch">
              <Box bg="white" p={4} borderRadius="md" border="1px solid" borderColor="gray.200">
                <Text fontWeight="600" mb={3} fontSize="sm">Add availability window</Text>
                <SimpleGrid columns={{ base: 1, md: 4 }} spacing={3} alignItems="end">
                  <FormControl>
                    <FormLabel fontSize="sm">Day</FormLabel>
                    <Select value={day} onChange={(e) => setDay(e.target.value)} size="sm">
                      {DAYS.map((d, i) => <option key={d} value={i}>{d}</option>)}
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="sm">Start</FormLabel>
                    <Input type="time" size="sm" value={start} onChange={(e) => setStart(e.target.value)} />
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="sm">End</FormLabel>
                    <Input type="time" size="sm" value={end} onChange={(e) => setEnd(e.target.value)} />
                  </FormControl>
                  <Button colorScheme="blue" size="sm" onClick={handleAddAvailability} isLoading={savingAvail}>
                    Add
                  </Button>
                </SimpleGrid>
              </Box>

              <Box w="full" overflowX="auto" border="1px solid" borderColor="gray.200" borderRadius="md">
                <Table variant="simple" size="sm">
                  <Thead bg="gray.50"><Tr><Th>Day</Th><Th>Start</Th><Th>End</Th></Tr></Thead>
                  <Tbody>
                    {availability.length === 0 && (
                      <Tr><Td colSpan={3}><Text py={6} textAlign="center" color="gray.500">No availability set</Text></Td></Tr>
                    )}
                    {availability.map((a) => (
                      <Tr key={a.id} _hover={{ bg: 'gray.50' }}>
                        <Td>{DAYS[a.dayOfWeek] ?? a.dayOfWeek}</Td>
                        <Td>{a.startTime}</Td>
                        <Td>{a.endTime}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </VStack>
  );
};

interface ShiftRow {
  key: string; position: string; date: string; time: string; location: string; status: string;
}

const ShiftTable: React.FC<{ rows: ShiftRow[]; empty: string }> = ({ rows, empty }) => (
  <Box w="full" overflowX="auto" border="1px solid" borderColor="gray.200" borderRadius="md">
    <Table variant="simple" size="sm">
      <Thead bg="gray.50">
        <Tr><Th>Position</Th><Th>Date</Th><Th>Time</Th><Th>Location</Th><Th>Status</Th></Tr>
      </Thead>
      <Tbody>
        {rows.length === 0 && (
          <Tr><Td colSpan={5}><Text py={6} textAlign="center" color="gray.500">{empty}</Text></Td></Tr>
        )}
        {rows.map((r) => (
          <Tr key={r.key} _hover={{ bg: 'gray.50' }}>
            <Td fontWeight="500">{r.position}</Td>
            <Td>{r.date}</Td>
            <Td>{r.time}</Td>
            <Td>{r.location}</Td>
            <Td><Badge colorScheme={r.status === 'assigned' || r.status === 'checked_in' ? 'green' : 'gray'}>{r.status}</Badge></Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  </Box>
);

export default VolunteerPortalPage;
