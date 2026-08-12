/**
 * @fileoverview Extras form for client detail page
 */

import React from 'react';
import {
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import { ClientExtras } from './types';

interface ClientExtrasFormProps {
  formData: ClientExtras;
  saving: boolean;
  onChange: (field: keyof ClientExtras, value: any) => void;
  onSave: () => void;
}

const ClientExtrasForm: React.FC<ClientExtrasFormProps> = ({
  formData,
  saving,
  onChange,
  onSave,
}) => {
  return (
    <VStack spacing={4} align="stretch">
      <Heading size="md" color="admin.primary">
        Client Extras
      </Heading>

      <FormControl>
        <FormLabel>Appointment Location</FormLabel>
        <Input
          value={formData.nextApptLocation || ''}
          onChange={(e) => onChange('nextApptLocation', e.target.value)}
          placeholder="e.g., Main Office, Mobile Unit"
        />
      </FormControl>

      <FormControl>
        <FormLabel>Program</FormLabel>
        <Input
          value={formData.program || ''}
          onChange={(e) => onChange('program', e.target.value)}
          placeholder="e.g., Food Hamper, Emergency Support"
        />
      </FormControl>

      <FormControl>
        <FormLabel>Dietary Considerations</FormLabel>
        <Textarea
          value={formData.dietary || ''}
          onChange={(e) => onChange('dietary', e.target.value)}
          placeholder="Any dietary preferences or considerations"
          rows={3}
        />
      </FormControl>

      <FormControl>
        <FormLabel>Allergies</FormLabel>
        <Textarea
          value={formData.allergies || ''}
          onChange={(e) => onChange('allergies', e.target.value)}
          placeholder="List any food allergies or sensitivities"
          rows={3}
        />
      </FormControl>

      <FormControl>
        <FormLabel>Special Requests</FormLabel>
        <Textarea
          value={formData.requests || ''}
          onChange={(e) => onChange('requests', e.target.value)}
          placeholder="Any special requests or notes"
          rows={3}
        />
      </FormControl>

      <FormControl>
        <FormLabel>Unwanted Items</FormLabel>
        <Textarea
          value={formData.unwanted || ''}
          onChange={(e) => onChange('unwanted', e.target.value)}
          placeholder="Items the client does not want"
          rows={3}
        />
      </FormControl>

      <FormControl>
        <FormLabel>Email</FormLabel>
        <Input
          type="email"
          value={formData.email || ''}
          onChange={(e) => onChange('email', e.target.value)}
          placeholder="Client email address"
        />
      </FormControl>

      <HStack spacing={{ base: 2, sm: 3, md: 4 }} flexWrap="wrap" w="full" maxW="100%">
        <FormControl>
          <FormLabel>Adults</FormLabel>
          <NumberInput value={formData.adults || ''} onChange={(value) => onChange('adults', value)} min={0}>
            <NumberInputField placeholder="0" />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>

        <FormControl>
          <FormLabel>Seniors</FormLabel>
          <NumberInput value={formData.seniors || ''} onChange={(value) => onChange('seniors', value)} min={0}>
            <NumberInputField placeholder="0" />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>

        <FormControl>
          <FormLabel>Children</FormLabel>
          <NumberInput value={formData.children || ''} onChange={(value) => onChange('children', value)} min={0}>
            <NumberInputField placeholder="0" />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
      </HStack>

      <FormControl>
        <FormLabel>Children's Ages</FormLabel>
        <Input
          value={formData.childrensAges || ''}
          onChange={(e) => onChange('childrensAges', e.target.value)}
          placeholder="e.g., 5, 8, 12"
        />
      </FormControl>

      <FormControl>
        <FormLabel>Additional Information</FormLabel>
        <Textarea
          value={formData.additionalInfo || ''}
          onChange={(e) => onChange('additionalInfo', e.target.value)}
          placeholder="Any additional information about the client"
          rows={3}
        />
      </FormControl>

      <FormControl>
        <FormLabel>Items Provided</FormLabel>
        <Textarea
          value={formData.itemsProvided || ''}
          onChange={(e) => onChange('itemsProvided', e.target.value)}
          placeholder="Items provided to the client"
          rows={3}
        />
      </FormControl>

      <FormControl>
        <FormLabel>Notes</FormLabel>
        <Textarea
          value={formData.notes || ''}
          onChange={(e) => onChange('notes', e.target.value)}
          placeholder="Additional notes about the client"
          rows={3}
        />
      </FormControl>

      <FormControl>
        <Checkbox isChecked={formData.hasMobilityIssues || false} onChange={(e) => onChange('hasMobilityIssues', e.target.checked)}>
          Has Mobility Issues
        </Checkbox>
      </FormControl>

      <FormControl>
        <FormLabel htmlFor="diaper-size-select">Diaper Size</FormLabel>
        {/* eslint-disable-next-line jsx-a11y/select-has-associated-label */}
        <Select
          id="diaper-size-select"
          value={formData.diaperSize || ''}
          onChange={(e) => onChange('diaperSize', e.target.value)}
          placeholder="Select diaper size"
          aria-label="Diaper Size"
          title="Diaper Size"
        >
          <option value="Preemie">Preemie</option>
          <option value="Newborn">Newborn</option>
          <option value="Size 1">Size 1</option>
          <option value="Size 2">Size 2</option>
          <option value="Size 3">Size 3</option>
          <option value="Size 4">Size 4</option>
          <option value="Size 5">Size 5</option>
          <option value="Size 6">Size 6</option>
        </Select>
      </FormControl>

      <FormControl>
        <FormLabel htmlFor="notification-preference-select">Notification Preference</FormLabel>
        {/* eslint-disable-next-line jsx-a11y/select-has-associated-label */}
        <Select
          id="notification-preference-select"
          value={formData.notificationPreference || ''}
          onChange={(e) => onChange('notificationPreference', e.target.value)}
          placeholder="Select notification preference"
          aria-label="Notification Preference"
          title="Notification Preference"
        >
          <option value="Email">Email</option>
          <option value="SMS">SMS</option>
          <option value="Phone">Phone</option>
          <option value="None">None</option>
        </Select>
      </FormControl>

      <FormControl>
        <FormLabel>Phone Carrier</FormLabel>
        <Input
          value={formData.phoneCarrier || ''}
          onChange={(e) => onChange('phoneCarrier', e.target.value)}
          placeholder="e.g., Bell, Rogers, Telus"
        />
      </FormControl>

      <FormControl>
        <FormLabel htmlFor="client-type-select">Client Type</FormLabel>
        {/* eslint-disable-next-line jsx-a11y/select-has-associated-label */}
        <Select
          id="client-type-select"
          value={formData.clientType || ''}
          onChange={(e) => onChange('clientType', e.target.value)}
          placeholder="Select client type"
          aria-label="Client Type"
          title="Client Type"
        >
          <option value="New">New</option>
          <option value="Returning">Returning</option>
          <option value="Regular">Regular</option>
        </Select>
      </FormControl>

      <FormControl>
        <FormLabel>Provisions</FormLabel>
        <Textarea
          value={formData.provisions || ''}
          onChange={(e) => onChange('provisions', e.target.value)}
          placeholder="Provisions provided"
          rows={3}
        />
      </FormControl>

      <FormControl>
        <FormLabel>Quantity</FormLabel>
        <NumberInput value={formData.quantity || ''} onChange={(value) => onChange('quantity', value)} min={0}>
          <NumberInputField placeholder="0" />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </FormControl>

      <Button
        colorScheme="green"
        onClick={onSave}
        isLoading={saving}
        loadingText="Saving..."
        size="md"
        w={{ base: 'full', sm: 'auto' }}
        minW={{ base: 'auto', sm: '200px' }}
        mx="auto"
      >
        Save
      </Button>
    </VStack>
  );
};

export default ClientExtrasForm;
