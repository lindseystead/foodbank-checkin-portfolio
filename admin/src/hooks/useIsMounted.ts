/**
 * @fileoverview Hook that returns a ref tracking whether the component is
 * still mounted. Automatically sets the ref to `false` on cleanup, preventing
 * state updates after unmount (React "no-op" warnings / race conditions).
 *
 * @license Proprietary
 */

import { useRef, useEffect } from 'react';

/**
 * Returns a ref whose `.current` is `true` while the component is mounted
 * and `false` after unmount. Use to guard async `setState` calls.
 */
export function useIsMounted(): React.MutableRefObject<boolean> {
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  return isMounted;
}
