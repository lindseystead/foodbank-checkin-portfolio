/**
 * @fileoverview Page layout component for Foodbank Check-In and Appointment System client application
 * 
 * This component provides the main layout structure for all client
 * pages, including consistent spacing, responsive design, and
 * accessibility features for the food bank check-in system.
 * 
 * @author Lindsey D. Stead
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 * 
 * @see {@link ../PageTitle.tsx} Page title component
 */

import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Container,
  Button,
  Tooltip,
  Flex,
} from '@chakra-ui/react';
import { FiArrowLeft } from 'react-icons/fi';

interface PageLayoutProps {
  children: React.ReactNode;
  showBackButton?: boolean;
  isScrollable?: boolean;
}

const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  showBackButton = true,
  isScrollable = false,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const contentBoxRef = useRef<HTMLDivElement>(null);

  // Ensure proper scroll position on mount
  useEffect(() => {
    window.scrollTo(0, 0);
    if (contentBoxRef.current) {
      contentBoxRef.current.scrollTop = 0;
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        if (showBackButton) {
          navigate(-1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, showBackButton]);

  return (
    <Box
      minH="100vh"
      bg="gray.50"
      position="relative"
      width="100%"
      overflowX="hidden"
    >
      {/* Skip to main content link */}
      <Box
        as="a"
        href="#main-content"
        position="absolute"
        top="-40px"
        left="50%"
        transform="translateX(-50%)"
        bg="brand.500"
        color="white"
        px={4}
        py={2}
        borderRadius="md"
        _focus={{
          top: 0,
          zIndex: 10,
        }}
      >
        {t('accessibility.skipToMain')}
      </Box>

      <Flex
        minH="100vh"
        alignItems={{ base: "flex-start", md: "center" }}
        justifyContent="center"
        width="100%"
        p={0}
      >
        <Container
          maxW={{ base: "100%", md: "container.xl" }} 
          h="100%"
          display="flex"
          alignItems={{ base: "flex-start", md: "center" }}
          py={0}
          px={{ base: 1, md: 4 }}
        >
          <Box 
            ref={contentBoxRef}
            position="relative"
            textAlign="center"
            bg="white"
            borderRadius={{ base: "lg", md: "xl" }}
            boxShadow="md"
            p={{ base: 2, sm: 3, md: 6 }}
            w="full"
            minH={{ base: "100vh", md: "90vh" }}
            display="flex"
            flexDirection="column"
            justifyContent="flex-start"
            overflowY={isScrollable ? "auto" : "auto"}
            css={isScrollable ? {
              '&::-webkit-scrollbar': {
                width: '4px',
              },
              '&::-webkit-scrollbar-track': {
                width: '6px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: 'rgba(0, 0, 0, 0.2)',
                borderRadius: '24px',
              },
            } : undefined}
          >
            {showBackButton && (
              <Box 
                position="absolute" 
                top={{ base: 3, md: 3 }} 
                left={{ base: 0, md: 1 }} 
                zIndex={5}
              >
                <Tooltip label={`${t('navigation.back')} (Ctrl/Cmd + B)`} placement="right">
                  <Button
                    aria-label={t('navigation.back')}
                    onClick={() => navigate(-1)}
                    variant="ghost"
                    size={{ base: "sm", md: "md" }}
                    bg="white"
                    _hover={{
                      bg: "gray.50",
                      transform: 'translateY(-2px)',
                      boxShadow: 'md'
                    }}
                    leftIcon={<FiArrowLeft />}
                    height={{ base: "32px", md: "40px" }}
                    minW={{ base: "70px", md: "100px" }}
                    display="flex"
                    alignItems="center"
                    justifyContent="flex-start"
                    gap={1}
                    fontSize={{ base: "xs", md: "sm" }}
                    fontWeight="medium"
                    color="gray.700"
                    transition="all 0.2s"
                    borderRadius="lg"
                  >
                    {t('common.back')}
                  </Button>
                </Tooltip>
              </Box>
            )}
            {children}
          </Box>
        </Container>
      </Flex>
    </Box>
  );
};

export default PageLayout; 