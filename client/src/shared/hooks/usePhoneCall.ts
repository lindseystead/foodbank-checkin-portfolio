/**
 * @fileoverview Hook for phone call functionality
 *
 * Encapsulates mobile detection, tel: link opening, and clipboard fallback
 * logic extracted from AssistanceButton.
 *
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 */

import { useCallback } from 'react';
import { useToast } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

export function usePhoneCall(phoneDigits: string, phoneDisplay: string) {
  const toast = useToast();
  const { t } = useTranslation();

  const handleCall = useCallback(() => {
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      );

    if (isMobile) {
      window.location.href = `tel:${phoneDigits}`;
      return;
    }

    // Desktop: try tel: link, fall back to clipboard
    try {
      window.location.href = `tel:${phoneDigits}`;
    } catch {
      if (navigator.clipboard) {
        navigator.clipboard
          .writeText(phoneDisplay)
          .then(() => {
            toast({
              title: t('assistance.phoneCopied', 'Phone number copied!'),
              description: t(
                'assistance.phoneCopiedDesc',
                `Copied ${phoneDisplay} to clipboard`,
              ),
              status: 'success',
              duration: 3000,
              isClosable: true,
              position: 'bottom',
            });
          })
          .catch(() => {
            toast({
              title: t('assistance.callUs', 'Please call us'),
              description: phoneDisplay,
              status: 'info',
              duration: 5000,
              isClosable: true,
              position: 'bottom',
            });
          });
      } else {
        toast({
          title: t('assistance.callUs', 'Please call us'),
          description: phoneDisplay,
          status: 'info',
          duration: 5000,
          isClosable: true,
          position: 'bottom',
        });
      }
    }
  }, [phoneDigits, phoneDisplay, toast, t]);

  return { handleCall };
}
