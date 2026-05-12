"use client";

import type { Transition } from "motion/react";
import { useReducedMotion } from "motion/react";

import { reducedMotionTransition } from "./animation";

export function useIkhtibarMotion() {
  const reduce = useReducedMotion();
  return {
    reduce,
    mt: (t: Transition = {}) => reducedMotionTransition(reduce, t),
  };
}
