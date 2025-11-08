/**
 * @fileoverview Client lookup component for Foodbank Check-In and Appointment System admin panel
 * 
 * This component provides client search and lookup functionality with
 * real-time filtering and navigation to client detail pages.
 * 
 * @author Lindsey D. Stead
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 * 
 * @see {@link ../ClientDetailPage.tsx} Client detail page
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Input,
  Text,
  Badge,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../lib/api';

export const ClientLookup: React.FC = () => {
  const [allClients, setAllClients] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredClients, setFilteredClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadClients = async () => {
      setLoading(true);
      try {
        const response = await api('/csv/all');
        if (response.ok) {
          const result = await response.json();
          const clients = result.data || [];
          setAllClients(clients);
          setFilteredClients(clients);
        } else {
          console.error('Failed to load clients, status:', response.status);
        }
      } catch (err) {
        console.error('Failed to load clients:', err);
      } finally {
        setLoading(false);
      }
    };
    loadClients();
  }, []);

  // Filter clients as user types
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredClients(allClients);
      return;
    }

    const search = searchTerm.toLowerCase().trim();
    
    const filtered = allClients.filter(client => {
      const id = String(client.clientId || '').toLowerCase();
      const firstName = String(client.firstName || '').toLowerCase();
      const lastName = String(client.lastName || '').toLowerCase();
      const phone = String(client.phoneNumber || '').toLowerCase();
      
      return id.includes(search) || 
             firstName.includes(search) || 
             lastName.includes(search) || 
             phone.includes(search);
    });

    setFilteredClients(filtered);
  }, [searchTerm, allClients]);


  const handleClientClick = (client: any) => {
    navigate(`/clients/${client.clientId}`);
  };


  return (
    <Box 
      bg="white" 
      p={{ base: 3, md: 4 }} 
      borderRadius="xl" 
      shadow="md" 
      border="1px solid"
      borderColor="gray.200"
      h="auto"
      display="flex"
      flexDirection="column"
      minH="0"
      overflow="hidden"
    >
      <VStack spacing={3} align="stretch" h="auto" minH="0">
        <VStack spacing={2} align="stretch">
          <Text fontSize="lg" fontWeight="bold" color="#25385D" textAlign="center">
            Find Client
          </Text>
          
          <Text fontSize="sm" color="gray.600" textAlign="center" lineHeight="1.5">
            All CSV clients with smart auto-filtering
          </Text>
          
          {allClients.length > 0 && (
            <Box 
              bg="green.50" 
              border="1px solid" 
              borderColor="green.200" 
              borderRadius="md" 
              p={2}
              textAlign="center"
            >
              <Text fontSize="sm" color="green.700" fontWeight="medium">
                ✓ {allClients.length} clients loaded • {filteredClients.length} showing
              </Text>
            </Box>
          )}
        </VStack>

        <VStack spacing={3} align="stretch" w="full">
          <Input
            placeholder="Type to filter clients by ID, name, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="md"
            w="full"
            bg="white"
            border="2px solid"
            borderColor="gray.300"
            borderRadius="lg"
            _placeholder={{
              color: "gray.500",
              fontSize: "md",
              fontWeight: "400"
            }}
            _focus={{
              borderColor: "blue.400",
              boxShadow: "0 0 0 1px #3182ce",
              bg: "white"
            }}
            _hover={{
              borderColor: "gray.400"
            }}
            fontSize="md"
            px={4}
            py={3}
          />

          {/* Client List */}
          {loading ? (
            <Box w="full" textAlign="center" py={8}>
              <Text fontSize="md" color="gray.600">Loading clients...</Text>
            </Box>
          ) : filteredClients.length > 0 ? (
            <Box 
              w="full" 
              maxH="400px" 
              overflowY="auto"
              css={{
                '&::-webkit-scrollbar': {
                  width: '12px',
                },
                '&::-webkit-scrollbar-track': {
                  background: '#f1f1f1',
                  borderRadius: '6px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: '#c1c1c1',
                  borderRadius: '6px',
                  '&:hover': {
                    background: '#a8a8a8',
                  },
                },
              }}
            >
              <Box 
                bg="blue.50" 
                border="1px solid" 
                borderColor="blue.200" 
                borderRadius="md" 
                p={2}
                mb={2}
                textAlign="center"
              >
                <Text fontSize="sm" fontWeight="bold" color="blue.700">
                  {searchTerm ? `Filtered Results (${filteredClients.length} found)` : `All Clients (${filteredClients.length} total)`}
                </Text>
              </Box>
              <VStack spacing={1.5} align="stretch" w="full">
                {filteredClients.map((client, index) => (
                  <Box
                    key={index}
                    p={2.5}
                    bg="white"
                    borderRadius="md"
                    border="1px solid"
                    borderColor="gray.200"
                    cursor="pointer"
                    _hover={{ 
                      bg: "blue.50", 
                      borderColor: "blue.300", 
                      transform: "translateY(-1px)",
                      boxShadow: "md"
                    }}
                    transition="all 0.2s"
                    onClick={() => handleClientClick(client)}
                    boxShadow="sm"
                  >
                    <HStack justify="space-between" align="center" spacing={3}>
                      <VStack align="start" spacing={1.5} flex="1">
                        <Text fontWeight="bold" fontSize="sm" color="gray.800">
                          {client.firstName} {client.lastName}
                        </Text>
                        <HStack spacing={3} wrap="wrap">
                          <HStack spacing={1}>
                            <Text fontSize="xs" color="gray.500" fontWeight="medium">
                              ID:
                            </Text>
                            <Text fontSize="xs" color="gray.700" fontFamily="mono" bg="gray.100" px={1.5} py={0.5} borderRadius="sm">
                              {client.clientId}
                            </Text>
                          </HStack>
                          <HStack spacing={1}>
                            <Text fontSize="xs" color="gray.500" fontWeight="medium">
                              Phone:
                            </Text>
                            <Text fontSize="xs" color="gray.700" fontFamily="mono" bg="gray.100" px={1.5} py={0.5} borderRadius="sm">
                              {client.phoneNumber}
                            </Text>
                          </HStack>
                        </HStack>
                      </VStack>
                      <Badge colorScheme="blue" variant="solid" fontSize="xs" px={2} py={0.5} borderRadius="sm">
                        View
                      </Badge>
                    </HStack>
                  </Box>
                ))}
              </VStack>
            </Box>
          ) : (
            <Box w="full" textAlign="center" py={8}>
              <Text fontSize="md" color="gray.600">
                {searchTerm ? `No clients found matching "${searchTerm}"` : 'No clients loaded'}
              </Text>
            </Box>
          )}

          {/* Footer */}
          <Box pt={4} borderTop="2px solid" borderColor="gray.200" bg="gray.50" borderRadius="md" p={3}>
            <HStack spacing={3} flexWrap="wrap" justify="center">
              <Badge colorScheme="blue" variant="subtle" fontSize="sm" px={3} py={1} borderRadius="md">
                Auto-filter as you type
              </Badge>
              <Badge colorScheme="green" variant="subtle" fontSize="sm" px={3} py={1} borderRadius="md">
                View client details
              </Badge>
              <Badge colorScheme="purple" variant="subtle" fontSize="sm" px={3} py={1} borderRadius="md">
                Print tickets
              </Badge>
            </HStack>
          </Box>
        </VStack>
      </VStack>
    </Box>
  );
};