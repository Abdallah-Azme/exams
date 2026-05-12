import type { Transition, Variants } from "motion/react";

/** Editorial ease — smooth deceleration */
export const easeOut: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const duration = {
  base: 0.55,
  snappy: 0.4,
} as const;

export function reducedMotionTransition(
  reduce: boolean | null,
  t: Transition = {},
): Transition {
  if (reduce) {
    return { duration: 0.01, ease: "linear" as const };
  }
  return t;
}

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.base, ease: easeOut },
  },
};

export const staggerParent: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.085,
      delayChildren: 0.06,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.snappy, ease: easeOut },
  },
};

export const viewportOnce = {
  once: true,
  margin: "-10% 0px -6% 0px",
  amount: 0.22,
} as const;
