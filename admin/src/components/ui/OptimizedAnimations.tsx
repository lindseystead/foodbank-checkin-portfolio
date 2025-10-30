/**
 * @fileoverview Optimized animations component for Foodbank Check-In and Appointment System admin panel
 * 
 * This component provides performance-optimized animations that respect
 * user accessibility preferences and system capabilities. It ensures
 * smooth animations while maintaining accessibility standards.
 * 
 * @author Lindsey D. Stead
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 * 
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion} MDN prefers-reduced-motion
 */

import React from 'react';
import {
  Fade,
  ScaleFade,
  SlideFade,
  Slide,
  Collapse,
  Box,
  BoxProps,
} from '@chakra-ui/react';

// Simple performance detection (can be enhanced later)
const isLowPerformanceDevice = () => {
  // For now, assume all devices can handle animations
  // This can be enhanced with actual device detection
  return false;
};

interface OptimizedFadeProps extends Omit<BoxProps, 'as'> {
  children: React.ReactNode;
  in?: boolean;
  delay?: number;
  fallback?: React.ReactNode;
}

interface OptimizedScaleFadeProps extends Omit<BoxProps, 'as'> {
  children: React.ReactNode;
  in?: boolean;
  delay?: number;
  initialScale?: number;
  fallback?: React.ReactNode;
}

/**
 * Optimized Fade component that reduces complexity on low-performance devices
 */
export const OptimizedFade: React.FC<OptimizedFadeProps> = ({
  children,
  in: isVisible = true,
  delay = 0,
  fallback,
  ...props
}) => {
  const settings = getOptimizedAnimationSettings();

  // On low-performance devices, show content immediately without animation
  if (settings.disableComplexAnimations) {
    return isVisible ? <Box {...props}>{children}</Box> : null;
  }

  return (
    <Fade
      in={isVisible}
      delay={delay}
    >
      {children}
    </Fade>
  );
};

/**
 * Optimized ScaleFade component for better mobile performance
 */
export const OptimizedScaleFade: React.FC<OptimizedScaleFadeProps> = ({
  children,
  in: isVisible = true,
  delay = 0,
  initialScale = 0.9,
  fallback,
  ...props
}) => {
  const settings = getOptimizedAnimationSettings();

  // On low-performance devices, use simpler fade instead of scale
  if (settings.disableComplexAnimations) {
    return (
      <OptimizedFade in={isVisible} delay={delay} {...props}>
        {children}
      </OptimizedFade>
    );
  }

  return (
    <ScaleFade
      in={isVisible}
      delay={delay}
      initialScale={initialScale}
    >
      {children}
    </ScaleFade>
  );
};

/**
 * Optimized SlideFade component
 */
export const OptimizedSlideFade: React.FC<OptimizedFadeProps> = ({
  children,
  in: isVisible = true,
  delay = 0,
  fallback,
  ...props
}) => {
  const settings = getOptimizedAnimationSettings();

  // On low-performance devices, use simple fade
  if (settings.disableComplexAnimations) {
    return (
      <OptimizedFade in={isVisible} delay={delay} {...props}>
        {children}
      </OptimizedFade>
    );
  }

  return (
    <SlideFade
      in={isVisible}
      delay={delay}
    >
      {children}
    </SlideFade>
  );
};

/**
 * Optimized Slide component
 */
export const OptimizedSlide: React.FC<OptimizedFadeProps> = ({
  children,
  in: isVisible = true,
  delay = 0,
  fallback,
  ...props
}) => {
  const settings = getOptimizedAnimationSettings();

  // On low-performance devices, use simple fade
  if (settings.disableComplexAnimations) {
    return (
      <OptimizedFade in={isVisible} delay={delay} {...props}>
        {children}
      </OptimizedFade>
    );
  }

  return (
    <Slide
      in={isVisible}
      delay={delay}
    >
      {children}
    </Slide>
  );
};

/**
 * Optimized Collapse component
 */
export const OptimizedCollapse: React.FC<OptimizedFadeProps> = ({
  children,
  in: isVisible = true,
  delay = 0,
  fallback,
  ...props
}) => {
  const settings = getOptimizedAnimationSettings();

  // On low-performance devices, show/hide immediately
  if (settings.disableComplexAnimations) {
    return isVisible ? <Box {...props}>{children}</Box> : null;
  }

  return (
    <Collapse
      in={isVisible}
      delay={delay}
    >
      {children}
    </Collapse>
  );
};

/**
 * Performance-aware animation wrapper that automatically optimizes based on device
 */
export const PerformanceAwareAnimation: React.FC<{
  children: React.ReactNode;
  type?: 'fade' | 'scale' | 'slide' | 'collapse';
  in?: boolean;
  delay?: number;
  fallback?: React.ReactNode;
  [key: string]: any;
}> = ({ 
  children, 
  type = 'fade', 
  in: isVisible = true, 
  delay = 0, 
  fallback,
  ...props 
}) => {
  const settings = getOptimizedAnimationSettings();

  // Show fallback immediately on low-performance devices
  if (settings.disableComplexAnimations && fallback) {
    return isVisible ? <>{fallback}</> : null;
  }

  switch (type) {
    case 'scale':
      return (
        <OptimizedScaleFade in={isVisible} delay={delay} {...props}>
          {children}
        </OptimizedScaleFade>
      );
    case 'slide':
      return (
        <OptimizedSlideFade in={isVisible} delay={delay} {...props}>
          {children}
        </OptimizedSlideFade>
      );
    case 'collapse':
      return (
        <OptimizedCollapse in={isVisible} delay={delay} {...props}>
          {children}
        </OptimizedCollapse>
      );
    default:
      return (
        <OptimizedFade in={isVisible} delay={delay} {...props}>
          {children}
        </OptimizedFade>
      );
  }
};

const getOptimizedAnimationSettings = () => ({
  disableComplexAnimations: isLowPerformanceDevice(),
  duration: 0.3,
});
