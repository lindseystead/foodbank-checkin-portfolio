/**
 * @fileoverview Volunteer roster — list, approve, and reject volunteers.
 * Coordinator/director view. Approving provisions a login account + invite.
 */

import React, { useMemo, useState } from 'react';
import {
  Box, VStack, HStack, Stack, Text, Button, Badge, Spinner, Center, Input,
  Table, Thead, Tbody, Tr, Th, Td, useToast, useDisclosure,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter,
  ModalCloseButton, Textarea,
} from '@chakra-ui/react';
import { FiRefreshCw } from 'react-icons/fi';
import { useVolunteers, Volunteer } from '../../../hooks/useVolunteerAdmin';

const STATUS_COLORS: Record<string, string> = {
  pending: 'orange',
  approved: 'green',
  inactive: 'gray',
  suspended: 'red',
  rejected: 'red',
};

export const VolunteerRoster: React.FC = () => {
  const { volunteers, isLoading, error, refresh, approve, reject } = useVolunteers();
  const [search, setSearch] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [rejectTarget, setRejectTarget] = useState<Volunteer | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const creds = useDisclosure();
  const [credInfo, setCredInfo] = useState<{ name: string; email: string; password: string } | null>(null);
  const toast = useToast();

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return volunteers;
    return volunteers.filter((v) =>
      `${v.first_name} ${v.last_name} ${v.email}`.toLowerCase().includes(q),
    );
  }, [volunteers, search]);

  const handleApprove = async (v: Volunteer) => {
    setBusyId(v.id);
    const res = await approve(v.id);
    setBusyId(null);
    if (res.ok && res.tempPassword && res.loginEmail) {
      // Show the one-time credentials for the coordinator to hand over.
      setCredInfo({ name: `${v.first_name} ${v.last_name}`, email: res.loginEmail, password: res.tempPassword });
      creds.onOpen();
      return;
    }
    toast({
      title: res.ok ? 'Volunteer approved' : 'Approval failed',
      description: res.ok ? `${v.first_name} ${v.last_name} was approved.` : res.error,
      status: res.ok ? 'success' : 'error',
      duration: 5000,
      isClosable: true,
    });
  };

  const copyCreds = () => {
    if (!credInfo) return;
    navigator.clipboard?.writeText(`Login: ${credInfo.email}\nTemporary password: ${credInfo.password}`);
    toast({ title: 'Copied', status: 'success', duration: 2000, isClosable: true });
  };

  const openReject = (v: Volunteer) => {
    setRejectTarget(v);
    setRejectReason('');
    onOpen();
  };

  const confirmReject = async () => {
    if (!rejectTarget) return;
    if (!rejectReason.trim()) {
      toast({ title: 'A reason is required', status: 'warning', duration: 3000, isClosable: true });
      return;
    }
    setBusyId(rejectTarget.id);
    const res = await reject(rejectTarget.id, rejectReason.trim());
    setBusyId(null);
    onClose();
    toast({
      title: res.ok ? 'Volunteer rejected' : 'Rejection failed',
      description: res.ok ? undefined : res.error,
      status: res.ok ? 'success' : 'error',
      duration: 5000,
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
      <Stack
        direction={{ base: 'column', sm: 'row' }}
        justify="space-between"
        align={{ base: 'stretch', sm: 'center' }}
        flexWrap="wrap"
        gap={2}
      >
        <Input
          placeholder="Search volunteers…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          maxW={{ base: '100%', sm: '320px' }}
          size={{ base: 'md', sm: 'sm' }}
        />
        <HStack justify="space-between">
          <Text fontSize="sm" color="gray.500">{filtered.length} volunteers</Text>
          <Button size={{ base: 'md', sm: 'sm' }} variant="outline" leftIcon={<FiRefreshCw />} onClick={refresh}>
            Refresh
          </Button>
        </HStack>
      </Stack>

      {error && <Text color="red.500" fontSize="sm">{error}</Text>}

      <Box w="full" overflowX="auto" border="1px solid" borderColor="gray.200" borderRadius="md">
        <Table variant="simple" size="sm">
          <Thead bg="gray.50">
            <Tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Phone</Th>
              <Th>Status</Th>
              <Th textAlign="right">Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filtered.length === 0 && (
              <Tr><Td colSpan={5}><Text py={6} textAlign="center" color="gray.500">No volunteers found</Text></Td></Tr>
            )}
            {filtered.map((v) => (
              <Tr key={v.id} _hover={{ bg: 'gray.50' }}>
                <Td fontWeight="500">{v.first_name} {v.last_name}</Td>
                <Td>{v.email}</Td>
                <Td>{v.phone || '—'}</Td>
                <Td><Badge colorScheme={STATUS_COLORS[v.status] || 'gray'}>{v.status}</Badge></Td>
                <Td textAlign="right">
                  {v.status === 'pending' ? (
                    <HStack justify="flex-end" spacing={2}>
                      <Button
                        size="xs" colorScheme="green"
                        isLoading={busyId === v.id}
                        onClick={() => handleApprove(v)}
                      >
                        Approve
                      </Button>
                      <Button
                        size="xs" variant="outline" colorScheme="red"
                        isDisabled={busyId === v.id}
                        onClick={() => openReject(v)}
                      >
                        Reject
                      </Button>
                    </HStack>
                  ) : (
                    <Text fontSize="xs" color="gray.400">—</Text>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Reject volunteer</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontSize="sm" color="gray.600" mb={3}>
              {rejectTarget && `Rejecting ${rejectTarget.first_name} ${rejectTarget.last_name}.`} Please provide a reason (sent to the volunteer).
            </Text>
            <Textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Reason for rejection"
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>Cancel</Button>
            <Button colorScheme="red" onClick={confirmReject} isLoading={busyId === rejectTarget?.id}>
              Reject
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* One-time login credentials to hand to the newly-approved volunteer */}
      <Modal isOpen={creds.isOpen} onClose={creds.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Volunteer approved ✓</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontSize="sm" color="gray.600" mb={3}>
              {credInfo?.name} can now log in. Share these one-time credentials —
              they won't be shown again. Ask them to change the password after first login.
            </Text>
            <Box bg="gray.50" border="1px solid" borderColor="gray.200" borderRadius="md" p={3} fontSize="sm">
              <HStack justify="space-between"><Text color="gray.500">Login email</Text><Text fontWeight="600">{credInfo?.email}</Text></HStack>
              <HStack justify="space-between" mt={1}><Text color="gray.500">Temp password</Text><Text fontWeight="600" fontFamily="mono">{credInfo?.password}</Text></HStack>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={copyCreds}>Copy</Button>
            <Button colorScheme="blue" onClick={creds.onClose}>Done</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

export default VolunteerRoster;
