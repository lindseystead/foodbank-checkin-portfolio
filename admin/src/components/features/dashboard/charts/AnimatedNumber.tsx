/**
 * @fileoverview Smoothly animates a number from its previous value to a new one.
 * Uses framer-motion's motion values for a 60fps tick without re-rendering React.
 */

import React, { useEffect, useRef } from 'react';
import { animate, useMotionValue } from 'framer-motion';

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  className?: string;
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ value, duration = 0.8, className }) => {
  const motionValue = useMotionValue(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        if (ref.current) {
          ref.current.textContent = Math.round(latest).toString();
        }
      },
    });
    return controls.stop;
  }, [value, duration, motionValue]);

  return <span ref={ref} className={className}>0</span>;
};

export default AnimatedNumber;
