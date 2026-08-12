/**
 * @fileoverview Resource allocation utilities
 *
 * Calculates milk, egg, and snack pack allocations based on household size.
 * Mirrors the backend logic in backend/src/utils/ticketHelpers.ts.
 *
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 */

/**
 * Calculate milk allocation based on household size.
 * Policy: <=2 → 1, <=4 → 2, <=6 → 3, >6 → 4.
 */
export function calculateMilkJugs(householdSize: number): number {
  if (householdSize <= 2) return 1;
  if (householdSize <= 4) return 2;
  if (householdSize <= 6) return 3;
  return 4;
}

/**
 * Calculate egg allocation based on household size.
 * Policy: <=3 → 1, <=6 → 2, >6 → 3.
 */
export function calculateEggDozens(householdSize: number): number {
  if (householdSize <= 3) return 1;
  if (householdSize <= 6) return 2;
  return 3;
}

/**
 * Calculate snack pack allocation based on household size.
 * Policy: <=2 → 1, <=4 → 2, <=6 → 3, >6 → 4.
 */
export function calculateSnackPacks(householdSize: number): number {
  if (householdSize <= 2) return 1;
  if (householdSize <= 4) return 2;
  if (householdSize <= 6) return 3;
  return 4;
}
