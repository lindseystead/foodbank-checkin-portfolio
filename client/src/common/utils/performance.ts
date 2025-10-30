/**
 * @fileoverview Performance optimization utilities for client-side animations
 * 
 * This module provides performance-optimized animation settings that respect
 * user accessibility preferences and system capabilities. It ensures smooth
 * animations while maintaining accessibility standards.
 * 
 * @author Lindsey D. Stead
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 * 
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion} MDN prefers-reduced-motion
 */

export const getOptimizedAnimationSettings = () => {
  return {
    duration: 300,
    easing: 'ease-in-out',
    reduceMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    disableComplexAnimations: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  };
};
