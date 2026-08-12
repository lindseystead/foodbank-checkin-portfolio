/**
 * @fileoverview PrintTicketButton — single reusable button for printing a
 * check-in ticket. Encapsulates the icon, tooltip, sizing, color, and the
 * call to the centralized `printTicket` utility.
 *
 * Replaces 4+ inline implementations across the admin panel:
 *   • dashboard/RecentCheckInsList row action
 *   • checkins/CheckInsList row action
 *   • checkins/CheckInDetailModal footer
 *   • clients/detail/ClientDetailHeader header
 *
 * Two variants:
 *   - `icon`  → IconButton, used in dense table rows
 *   - `full`  → Button with leftIcon + label, used in headers/modals
 */

import React from 'react';
import { Button, IconButton, Tooltip, ButtonProps, IconButtonProps } from '@chakra-ui/react';
import { FiPrinter } from 'react-icons/fi';
import { printTicket, PRINT_TICKET_TOOLTIP, PRINT_TICKET_ICON_SIZE } from '../../utils/printTicket';

interface CommonProps {
  checkInId?: string;
  /** Optional override; defaults to opening the ticket in a new window. */
  onClick?: () => void;
}

interface IconVariantProps extends CommonProps, Omit<IconButtonProps, 'aria-label' | 'icon' | 'onClick'> {
  variant?: 'icon';
  label?: string;
}

interface FullVariantProps extends CommonProps, Omit<ButtonProps, 'leftIcon' | 'onClick'> {
  variant: 'full';
  label?: string;
}

type Props = IconVariantProps | FullVariantProps;

const PrintTicketButton: React.FC<Props> = (props) => {
  const { checkInId, onClick, variant = 'icon', label = 'Print Ticket', ...rest } = props as any;

  const handleClick = () => {
    if (onClick) return onClick();
    if (checkInId) printTicket(checkInId);
  };

  if (variant === 'full') {
    return (
      <Tooltip label={PRINT_TICKET_TOOLTIP} placement="bottom" hasArrow>
        <Button
          leftIcon={<FiPrinter />}
          colorScheme="blue"
          onClick={handleClick}
          isDisabled={!checkInId && !onClick}
          {...rest}
        >
          {label}
        </Button>
      </Tooltip>
    );
  }

  return (
    <Tooltip label={PRINT_TICKET_TOOLTIP} placement="top" hasArrow>
      <IconButton
        aria-label={label}
        icon={<FiPrinter size={PRINT_TICKET_ICON_SIZE} />}
        size="sm"
        variant="ghost"
        color="gray.500"
        _hover={{ color: 'blue.500', bg: 'blue.50' }}
        onClick={handleClick}
        isDisabled={!checkInId && !onClick}
        {...rest}
      />
    </Tooltip>
  );
};

export default PrintTicketButton;
