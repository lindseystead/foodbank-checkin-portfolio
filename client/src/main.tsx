/**
 * @fileoverview Main entry point for Foodbank Check-In and Appointment System client application
 * 
 * This file initializes the React application with all necessary
 * providers including internationalization, theme, and routing.
 * It serves as the root entry point for the client application.
 * 
 * @author Lindsey D. Stead
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 * 
 * @see {@link ./App.tsx} Main application component
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './common/i18n'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
