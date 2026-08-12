/**
 * @fileoverview Header block for confirmation page.
 */

import React from 'react';
import PageHeader from '../../../shared/components/ui/PageHeader';

const ConfirmationHeader: React.FC = () => {
  return (
    <PageHeader
      title="Check-in Complete!"
      subTitle="Your check-in is complete and your next appointment has been scheduled. Please contact us if you need to reschedule."
      logoSize="sm"
      mb={4}
    />
  );
};

export default ConfirmationHeader;
