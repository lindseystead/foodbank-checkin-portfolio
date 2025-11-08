/**
 * @fileoverview Error Boundary component for admin panel
 * 
 * This component catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of crashing the entire app.
 * 
 * @author Lindsey D. Stead
 * @version 1.0.0
 * @since 2025-01-20
 * @license Proprietary - see LICENSE file for details
 */

import { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Button, Heading, Text, VStack } from '@chakra-ui/react';
import { logger } from '../utils/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary component that catches errors in child components
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to our logging service
    logger.error('Error Boundary caught an error:', error, errorInfo);
    
    // Update state with error details
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = (): void => {
    // Reset error state and try again
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <Box
          minH="100vh"
          display="flex"
          alignItems="center"
          justifyContent="center"
          bg="gray.50"
          p={4}
        >
          <VStack spacing={4} maxW="600px" textAlign="center">
            <Heading size="lg" color="red.500">
              Something went wrong
            </Heading>
            <Text color="gray.600">
              We're sorry, but something unexpected happened in the admin panel. 
              Please try refreshing the page or contact support if the problem persists.
            </Text>
            {import.meta.env.DEV && this.state.error && (
              <Box
                mt={4}
                p={4}
                bg="red.50"
                borderRadius="md"
                textAlign="left"
                maxW="100%"
                overflow="auto"
              >
                <Text fontSize="sm" fontWeight="bold" mb={2}>
                  Error Details (Development Only):
                </Text>
                <Text fontSize="xs" fontFamily="mono" color="red.700">
                  {this.state.error.toString()}
                </Text>
                {this.state.errorInfo && (
                  <Text fontSize="xs" fontFamily="mono" color="red.700" mt={2}>
                    {this.state.errorInfo.componentStack}
                  </Text>
                )}
              </Box>
            )}
            <Button
              colorScheme="blue"
              onClick={this.handleReset}
              mt={4}
            >
              Try Again
            </Button>
            <Button
              variant="ghost"
              onClick={() => window.location.reload()}
              size="sm"
            >
              Refresh Page
            </Button>
          </VStack>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

