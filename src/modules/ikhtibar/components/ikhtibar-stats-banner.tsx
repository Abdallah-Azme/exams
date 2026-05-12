"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { GraduationCap, Headphones, ListChecks, Trophy } from "lucide-react";
import { animate, motion, useInView } from "motion/react";

import {
  easeOut,
  staggerItem,
  staggerParent,
  viewportOnce,
} from "@/src/modules/ikhtibar/animation";
import { useIkhtibarLocale } from "@/src/modules/ikhtibar/i18n/ikhtibar-locale-context";
import { useIkhtibarMotion } from "@/src/modules/ikhtibar/use-ikhtibar-motion";

const statDefs = [
  { icon: GraduationCap, value: "+5000", labelKey: "statStudents" as const },
  { icon: ListChecks, value: "+2500", labelKey: "statTests" as const },
  { icon: Trophy, value: "+300", labelKey: "statCourses" as const },
  { icon: Headphones, value: "24/7", labelKey: "statSupport" as const },
] as const;

type Parsed =
  | { kind: "plus"; target: number }
  | { kind: "slash"; target: number; suffix: string }
  | { kind: "literal"; text: string };

function parseStatValue(value: string): Parsed {
  const plus = /^\+(\d+)$/.exec(value);
  if (plus) return { kind: "plus", target: Number(plus[1]) };
  const slash = /^(\d+)(\/\d+)$/.exec(value);
  if (slash) return { kind: "slash", target: Number(slash[1]), suffix: slash[2]! };
  return { kind: "literal", text: value };
}

function durationForTarget(target: number): number {
  return Math.min(8, Math.max(3, 2.35 + target / 400));
}

function AnimatedStatValue({
  value,
  reduce,
  animationDelay,
}: {
  value: string;
  reduce: boolean | null;
  animationDelay: number;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.45 });
  const parsed = useMemo(() => parseStatValue(value), [value]);
  const [n, setN] = useState(1);
  const ran = useRef(false);

  useEffect(() => {
    if (!isInView || ran.current) return;
    if (parsed.kind === "literal") return;
    ran.current = true;

    const target = parsed.target;

    if (reduce) {
      setN(target);
      return;
    }

    setN(1);
    const controls = animate(1, target, {
      duration: durationForTarget(target),
      ease: easeOut,
      delay: animationDelay,
      onUpdate: (latest) => setN(Math.round(latest)),
    });
    return () => controls.stop();
  }, [isInView, parsed, reduce, animationDelay]);

  if (parsed.kind === "literal") {
    return (
      <p
        ref={ref}
        className="text-[26px] font-extrabold tracking-tight md:text-[32px] tabular-nums"
      >
        {parsed.text}
      </p>
    );
  }

  const text =
    !isInView || reduce
      ? value
      : parsed.kind === "plus"
        ? `+${n}`
        : `${n}${parsed.suffix}`;

  return (
    <p
      ref={ref}
      className="text-[26px] font-extrabold tracking-tight md:text-[32px] tabular-nums"
      aria-live={isInView ? "polite" : undefined}
    >
      {text}
    </p>
  );
}

export function IkhtibarStatsBanner() {
  const { mt, reduce } = useIkhtibarMotion();
  const { t } = useIkhtibarLocale();

  return (
    <motion.section
      className="px-4 pb-16 pt-4 sm:px-6 md:pb-20 lg:px-8"
      aria-label={t("statsSection")}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={viewportOnce}
      transition={mt({ duration: 0.4 })}
    >
      <div className="mx-auto max-w-[1200px]">
        <motion.div
          className="overflow-hidden rounded-[16px] shadow-[0_12px_40px_rgba(0,51,128,0.25)]"
          initial={{ opacity: 0, y: 28, scale: 0.985 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={viewportOnce}
          transition={mt(
            reduce
              ? { duration: 0.01 }
              : { duration: 0.68, ease: easeOut },
          )}
        >
          <motion.div
            className="grid grid-cols-2 gap-4 bg-[#003380] px-5 py-8 md:grid-cols-4 md:gap-6 md:px-10 md:py-10"
            variants={staggerParent}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            {statDefs.map(({ icon: Icon, value, labelKey }, index) => (
              <motion.div
                key={labelKey}
                variants={staggerItem}
                className="flex flex-col items-center justify-center gap-3 text-center text-white"
                whileHover={reduce ? undefined : { scale: 1.04 }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
              >
                <motion.span
                  initial={{ rotate: reduce ? 0 : -10, opacity: 0.85 }}
                  whileInView={{ rotate: 0, opacity: 1 }}
                  viewport={viewportOnce}
                  transition={mt({ type: "spring", stiffness: 280, damping: 16 })}
                  className="inline-flex"
                >
                  <Icon className="size-9 stroke-[1.35] text-white/95 md:size-10" aria-hidden />
                </motion.span>
                <AnimatedStatValue
                  value={value}
                  reduce={reduce}
                  animationDelay={index * 0.22}
                />
                <p className="text-[13px] font-medium text-white/85 md:text-[14px]">
                  {t(labelKey)}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}
