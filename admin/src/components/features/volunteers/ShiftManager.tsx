/**
 * @fileoverview Shift management — list, create, and cancel volunteer shifts.
 * Coordinator/director view.
 */

import React, { useState } from 'react';
import {
  Box, VStack, HStack, Stack, Text, Button, Badge, Spinner, Center,
  Table, Thead, Tbody, Tr, Th, Td, useToast, useDisclosure,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter,
  ModalCloseButton, FormControl, FormLabel, Input, SimpleGrid,
} from '@chakra-ui/react';
import { FiRefreshCw, FiPlus } from 'react-icons/fi';
import { useShifts, NewShiftInput, Shift } from '../../../hooks/useVolunteerAdmin';

const STATUS_COLORS: Record<string, string> = {
  open: 'green',
  full: 'orange',
  cancelled: 'red',
  completed: 'gray',
};

const emptyForm: NewShiftInput = {
  position: '',
  location: '',
  shiftDate: '',
  startTime: '',
  endTime: '',
  capacity: 1,
};

export const ShiftManager: React.FC = () => {
  const { shifts, isLoading, error, refresh, createShift, cancelShift } = useShifts();
  const [form, setForm] = useState<NewShiftInput>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const handleCreate = async () => {
    if (!form.position || !form.shiftDate || !form.startTime || !form.endTime || !form.capacity) {
      toast({ title: 'All fields except location are required', status: 'warning', duration: 3000, isClosable: true });
      return;
    }
    setSaving(true);
    const res = await createShift({ ...form, capacity: Number(form.capacity) });
    setSaving(false);
    if (res.ok) {
      toast({ title: 'Shift created', status: 'success', duration: 4000, isClosable: true });
      setForm(emptyForm);
      onClose();
    } else {
      toast({ title: 'Failed to create shift', description: res.error, status: 'error', duration: 5000, isClosable: true });
    }
  };

  const handleCancel = async (s: Shift) => {
    setBusyId(s.id);
    const res = await cancelShift(s.id);
    setBusyId(null);
    toast({
      title: res.ok ? 'Shift cancelled' : 'Failed to cancel shift',
      description: res.ok ? undefined : res.error,
      status: res.ok ? 'success' : 'error',
      duration: 4000,
      isClosable: true,
    });
  };

  if (isLoading) {
    return (
      <Center py={12}>
        <Spinner size="lg" color="admin.primary" thickness="4px" />
      </Center>
    );
  }

  return (
    <VStack spacing={4} align="stretch" w="full">
      <HStack justify="space-between" flexWrap="wrap" gap={2}>
        <Text fontSize="sm" color="gray.500">{shifts.length} shifts</Text>
        <Stack direction={{ base: 'column', sm: 'row' }} spacing={2} w={{ base: 'full', sm: 'auto' }}>
          <Button size={{ base: 'md', sm: 'sm' }} variant="outline" leftIcon={<FiRefreshCw />} onClick={refresh} w={{ base: 'full', sm: 'auto' }}>Refresh</Button>
          <Button size={{ base: 'md', sm: 'sm' }} colorScheme="blue" leftIcon={<FiPlus />} onClick={onOpen} w={{ base: 'full', sm: 'auto' }}>New shift</Button>
        </Stack>
      </HStack>

      {error && <Text color="red.500" fontSize="sm">{error}</Text>}

      <Box w="full" overflowX="auto" border="1px solid" borderColor="gray.200" borderRadius="md">
        <Table variant="simple" size="sm">
          <Thead bg="gray.50">
            <Tr>
              <Th>Position</Th>
              <Th>Date</Th>
              <Th>Time</Th>
              <Th>Location</Th>
              <Th isNumeric>Filled</Th>
              <Th>Status</Th>
              <Th textAlign="right">Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {shifts.length === 0 && (
              <Tr><Td colSpan={7}><Text py={6} textAlign="center" color="gray.500">No shifts yet</Text></Td></Tr>
            )}
            {shifts.map((s) => (
              <Tr key={s.id} _hover={{ bg: 'gray.50' }}>
                <Td fontWeight="500">{s.position}</Td>
                <Td>{s.shift_date}</Td>
                <Td>{s.start_time}–{s.end_time}</Td>
                <Td>{s.location || '—'}</Td>
                <Td isNumeric>{s.assigned_count ?? 0}/{s.capacity}</Td>
                <Td><Badge colorScheme={STATUS_COLORS[s.status] || 'gray'}>{s.status}</Badge></Td>
                <Td textAlign="right">
                  {s.status !== 'cancelled' && s.status !== 'completed' ? (
                    <Button
                      size="xs" variant="outline" colorScheme="red"
                      isLoading={busyId === s.id}
                      onClick={() => handleCancel(s)}
                    >
                      Cancel
                    </Button>
                  ) : (
                    <Text fontSize="xs" color="gray.400">—</Text>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>New shift</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <FormControl isRequired>
                <FormLabel fontSize="sm">Position</FormLabel>
                <Input value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} placeholder="e.g. Sorter, Greeter" />
              </FormControl>
              <FormControl>
                <FormLabel fontSize="sm">Location</FormLabel>
                <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Optional" />
              </FormControl>
              <FormControl isRequired>
                <FormLabel fontSize="sm">Date</FormLabel>
                <Input type="date" value={form.shiftDate} onChange={(e) => setForm({ ...form, shiftDate: e.target.value })} />
              </FormControl>
              <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
                <FormControl isRequired>
                  <FormLabel fontSize="sm">Start</FormLabel>
                  <Input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel fontSize="sm">End</FormLabel>
                  <Input type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} />
                </FormControl>
              </SimpleGrid>
              <FormControl isRequired>
                <FormLabel fontSize="sm">Capacity</FormLabel>
                <Input type="number" min={1} value={form.capacity} onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })} />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>Cancel</Button>
            <Button colorScheme="blue" onClick={handleCreate} isLoading={saving}>Create shift</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

export default ShiftManager;
