/**
 * @fileoverview Login page for Foodbank Check-In and Appointment System admin panel
 * 
 * This page provides secure authentication for admin users using
 * Supabase authentication. It handles user login, error handling,
 * and redirects authenticated users to the dashboard.
 * 
 * @author Lindsey D. Stead
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 * 
 * @see {@link ../contexts/AuthContext.tsx} Authentication context
 */

import { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  Input,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  useToast,
  InputGroup,
  InputRightElement,
  IconButton,
  Container,
  Flex,
  Checkbox,
  HStack,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon, LockIcon, AtSignIcon } from '@chakra-ui/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { validateEmail, sanitizeInput } from '../../lib/supabase';
import Logo from '../../components/ui/Logo';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const { signIn, isAuthenticated, isLoading, resetPassword } = useAuth();

  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // Email validation
    if (!credentials.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(credentials.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation - only check if not empty (don't validate format for login)
    if (!credentials.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Sanitize inputs
      const sanitizedEmail = sanitizeInput(credentials.email);
      
      // Attempt sign in
      const result = await signIn(sanitizedEmail, credentials.password);
      
      if (result.success) {
        // Welcome message is handled by AuthContext
        // Navigation will be handled by the useEffect above
      } else {
        toast({
          title: 'Login Failed',
          description: result.error || 'Please check your credentials and try again.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: 'Login Error',
        description: 'An unexpected error occurred. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: 'email' | 'password', value: string) => {
    setCredentials(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const handleForgotPassword = async () => {
    // Check if email is entered and valid
    if (!credentials.email.trim()) {
      toast({
        title: 'Email Required',
        description: 'Please enter your email address to reset your password.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (!validateEmail(credentials.email)) {
      toast({
        title: 'Invalid Email',
        description: 'Please enter a valid email address.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      const result = await resetPassword(credentials.email);
      
      if (result.success) {
        toast({
          title: 'Password Reset Email Sent',
          description: 'Check your email for password reset instructions. The link will be valid for 1 hour.',
          status: 'success',
          duration: 7000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Reset Failed',
          description: result.error || 'Unable to send password reset email. Please try again.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error: any) {
      console.error('Password reset error:', error);
      toast({
        title: 'Reset Error',
        description: 'An unexpected error occurred. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Show loading state if auth is initializing
  if (isLoading) {
    return (
      <Box 
        minH="100vh"
        bg="#f7fafd"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <VStack spacing={4}>
          <Logo size="lg" />
          <Text color="gray.600">Initializing...</Text>
        </VStack>
      </Box>
    );
  }

  return (
    <Box 
      minH="100vh"
      bg="#f7fafd"
      position="relative"
      width="100%"
      overflowX="hidden"
    >
      <Flex
        minH="100vh"
        maxH="100vh"
        alignItems="center"
        justifyContent="center"
        width="100%"
        overflow="hidden"
        p={0}
      >
        <Container
          maxW="container.xl" 
          h="auto"
          display="flex"
          alignItems="center"
          py={0}
        >
          <Box 
            position="relative"
            textAlign="center"
            bg="white"
            borderRadius="xl"
            boxShadow="md"
            p={{ base: 2, sm: 3, md: 4 }}
            w="full"
            minH={{ base: "auto", md: "auto" }}
            maxH={{ base: "auto", md: "auto" }}
            display="flex"
            flexDirection="column"
            justifyContent="flex-start"
            overflowY="visible"
          >
            <VStack spacing={4} align="stretch" w="full" h="full" justify="space-between">
                {/* Top Section - Logo and Header */}
                <VStack spacing={3} pt={4}>
                  {/* Logo */}
                  <Logo size="lg" />

                  {/* Header */}
                  <VStack spacing={2} textAlign="center">
                    <Heading 
                      size="xl"
                      color="#25385D"
                      fontWeight="bold"
                      lineHeight="shorter"
                      letterSpacing="tight"
                      fontFamily="'Inter', sans-serif"
                    >
                      Admin Login
                    </Heading>
                    
                    <Text 
                      color="gray.600" 
                      fontSize="md"
                      lineHeight="tall"
                      fontWeight="normal"
                      letterSpacing="wide"
                      opacity={0.9}
                    >
                      Sign in to access the admin dashboard
                    </Text>
                  </VStack>
                </VStack>

                {/* Middle Section - Login Form */}
                <Box as="form" onSubmit={handleSubmit} w="full" maxW="400px" mx="auto">
                    <VStack spacing={3}>
                      {/* Email Field */}
                      <FormControl isInvalid={!!errors.email}>
                        <FormLabel color="gray.700" fontWeight="500" fontSize="md">
                          Email Address
                        </FormLabel>
                        <InputGroup>
                          <Input
                            type="email"
                            value={credentials.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            placeholder="Enter your email address"
                            size="lg"
                            bg="white"
                            borderColor="gray.300"
                            h="48px"
                            fontSize="md"
                            autoComplete="email"
                            _hover={{
                              borderColor: 'gray.400',
                            }}
                            _focus={{
                              borderColor: 'brand.500',
                              boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
                            }}
                          />
                          <InputRightElement h="full">
                            <AtSignIcon color="gray.400" boxSize={4} />
                          </InputRightElement>
                        </InputGroup>
                        <FormErrorMessage>{errors.email}</FormErrorMessage>
                      </FormControl>

                      {/* Password Field */}
                      <FormControl isInvalid={!!errors.password}>
                        <FormLabel color="gray.700" fontWeight="500" fontSize="md">
                          Password
                        </FormLabel>
                        <InputGroup>
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            value={credentials.password}
                            onChange={(e) => handleInputChange('password', e.target.value)}
                            placeholder="Enter your password"
                            size="lg"
                            bg="white"
                            borderColor="gray.300"
                            h="48px"
                            fontSize="md"
                            autoComplete="current-password"
                            _hover={{
                              borderColor: 'gray.400',
                            }}
                            _focus={{
                              borderColor: 'brand.500',
                              boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
                            }}
                          />
                          <InputRightElement h="full">
                            <IconButton
                              aria-label={showPassword ? 'Hide password' : 'Show password'}
                              icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                              onClick={() => setShowPassword(!showPassword)}
                              variant="ghost"
                              color="gray.400"
                              _hover={{ color: 'gray.600' }}
                              size="sm"
                              h="full"
                            />
                          </InputRightElement>
                        </InputGroup>
                        <FormErrorMessage>{errors.password}</FormErrorMessage>
                      </FormControl>

                      {/* Remember Me & Forgot Password Row */}
                      <Flex justify="space-between" align="center" w="full" pt={1}>
                        <HStack spacing={2}>
                          <Checkbox 
                            colorScheme="blue" 
                            size="md"
                            isChecked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            _focus={{
                              boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.5)',
                              outline: 'none',
                            }}
                          >
                            <Text fontSize="sm" color="gray.600">
                              Remember me
                            </Text>
                          </Checkbox>
                        </HStack>
                        <Button
                          variant="link"
                          color="blue.600"
                          fontSize="sm"
                          fontWeight="500"
                          onClick={handleForgotPassword}
                          _hover={{ color: 'blue.700', textDecoration: 'underline' }}
                          _focus={{
                            boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.5)',
                            outline: 'none',
                          }}
                        >
                          Forgot password?
                        </Button>
                      </Flex>

                      {/* Submit Button */}
                      <Button
                        type="submit"
                        w="full"
                        variant="primary"
                        isLoading={isSubmitting}
                        loadingText="Signing In..."
                        leftIcon={<LockIcon />}
                        mt={1}
                        h="48px"
                        fontSize="md"
                        fontWeight="500"
                        _focus={{
                          boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.5)',
                          outline: 'none',
                        }}
                        transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
                      >
                        Sign In
                      </Button>
                    </VStack>
                  </Box>

                {/* Bottom Section - Footer */}
                <VStack spacing={3} pb={4}>
                  {/* Footer */}
                  <Box textAlign="center">
                    <Text fontSize="xs" color="gray.500">
                      Foodbank Check-In and Appointment System © 2025
                    </Text>
                  </Box>
                </VStack>
              </VStack>
          </Box>
        </Container>
      </Flex>
    </Box>
  );
};

export default LoginPage;
