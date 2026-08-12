/**
 * @fileoverview Shared navigation configuration for desktop Sidebar
 * and mobile drawer. Single source of truth — change here, both update.
 */

import {
  FiHome,
  FiUserCheck,
  FiUsers,
  FiHelpCircle,
  FiUpload,
  FiSettings,
  FiUser,
  FiBarChart2,
  FiHeart,
} from 'react-icons/fi';
import type { IconType } from 'react-icons';

export interface NavItem {
  label: string;
  path: string;
  icon: IconType;
  description: string;
}

export const PRIMARY_NAV: NavItem[] = [
  { label: 'Dashboard',     path: '/dashboard',     icon: FiHome,       description: 'Daily operations overview' },
  { label: 'Check-ins',     path: '/check-ins',     icon: FiUserCheck,  description: "Today's appointments" },
  { label: 'Clients',       path: '/clients',       icon: FiUsers,      description: 'Lookup + manage clients' },
  { label: 'Help Requests', path: '/help-requests', icon: FiHelpCircle, description: 'Client assistance inbox' },
  { label: 'Volunteers',    path: '/volunteers',    icon: FiHeart,      description: 'Roster + shift scheduling' },
  { label: 'Reports',       path: '/reports',       icon: FiBarChart2,  description: 'Utilization metrics + HungerCount export' },
  { label: 'CSV Upload',    path: '/csv-upload',    icon: FiUpload,     description: 'Import Link2Feed CSVs' },
];

export const SECONDARY_NAV: NavItem[] = [
  { label: 'Settings', path: '/settings', icon: FiSettings, description: 'Tenant + integrations' },
  { label: 'Profile',  path: '/profile',  icon: FiUser,     description: 'Account preferences' },
];

/** True if the given pathname should mark the nav item active. */
export const isNavActive = (currentPath: string, itemPath: string): boolean => {
  if (itemPath === '/dashboard') {
    return currentPath === '/' || currentPath === '/dashboard';
  }
  return currentPath === itemPath || currentPath.startsWith(itemPath + '/');
};
