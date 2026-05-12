"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  ListChecks,
  Trophy,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import heroPortrait from "../images/dr-tarek.jpeg";
import { easeOut, staggerItem, staggerParent, viewportOnce } from "@/src/modules/ikhtibar/animation";
import { useIkhtibarLocale } from "@/src/modules/ikhtibar/i18n/ikhtibar-locale-context";
import { useIkhtibarMotion } from "@/src/modules/ikhtibar/use-ikhtibar-motion";

const featureDefs = [
  { Icon: ListChecks, key: "heroFeat1" as const },
  { Icon: GraduationCap, key: "heroFeat2" as const },
  { Icon: BarChart3, key: "heroFeat3" as const },
  { Icon: Trophy, key: "heroFeat4" as const },
] as const;

const slideKeys = [
  { title: "heroS1Title" as const, sub: "heroS1Sub" as const },
  { title: "heroS2Title" as const, sub: "heroS2Sub" as const },
  { title: "heroS3Title" as const, sub: "heroS3Sub" as const },
  { title: "heroS4Title" as const, sub: "heroS4Sub" as const },
] as const;

function HeroDecor() {
  const reduce = useReducedMotion();

  const items = [
    { Icon: ListChecks, className: "absolute end-[12%] top-[18%]", delay: 0.35, period: 5.2, iconClass: "size-16" },
    { Icon: BarChart3, className: "absolute end-[38%] top-[42%]", delay: 0.5, period: 5.8, iconClass: "size-14" },
    { Icon: GraduationCap, className: "absolute end-[22%] bottom-[28%]", delay: 0.62, period: 6.2, iconClass: "size-20" },
    { Icon: Trophy, className: "absolute start-[8%] top-[52%]", delay: 0.45, period: 5.5, iconClass: "size-12" },
  ] as const;

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.12]"
      aria-hidden
    >
      {items.map(({ Icon, className, delay, period, iconClass }) => (
        <motion.div
          key={className}
          className={className}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={
            reduce
              ? { opacity: 1, scale: 1 }
              : { opacity: 1, scale: 1, y: [0, -5, 0] }
          }
          transition={
            reduce
              ? { duration: 0.01, delay }
              : {
                  opacity: { duration: 0.75, ease: easeOut, delay },
                  scale: { duration: 0.75, ease: easeOut, delay },
                  y: { duration: period, repeat: Infinity, ease: "easeInOut", delay: delay + 0.2 },
                }
          }
        >
          <Icon className={`${iconClass} text-white`} />
        </motion.div>
      ))}
    </div>
  );
}

export function IkhtibarHero() {
  const [index, setIndex] = useState(0);
  const { t, dir } = useIkhtibarLocale();
  const { mt } = useIkhtibarMotion();
  const reduce = useReducedMotion();

  const slide = slideKeys[index]!;
  const title = t(slide.title);
  const subtitle = t(slide.sub);

  const photoEnterX = dir === "rtl" ? 48 : -48;
  const copyEnterX = dir === "rtl" ? -36 : 36;

  const PrevIcon = dir === "rtl" ? ChevronRight : ChevronLeft;
  const NextIcon = dir === "rtl" ? ChevronLeft : ChevronRight;

  return (
    <motion.section
      id="hero"
      className="relative overflow-hidden bg-white pb-10 pt-6 md:pb-14 md:pt-8"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={viewportOnce}
      transition={mt({ duration: 0.4 })}
    >
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <motion.div
          className="relative flex min-h-[420px] flex-col overflow-hidden rounded-[16px] bg-white shadow-[0_4px_40px_rgba(0,55,128,0.08)] lg:min-h-[480px] lg:flex-row"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={mt({ duration: 0.65, ease: easeOut })}
        >
          <motion.div
            className="relative flex min-h-[280px] flex-1 items-stretch bg-[#0047AB] lg:min-h-0 lg:max-w-[46%]"
            initial={{ opacity: 0, x: photoEnterX }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewportOnce}
            transition={mt({ duration: 0.72, ease: easeOut })}
          >
            <HeroDecor />
            <div className="relative flex flex-1 flex-col items-center justify-end p-6 pt-10 lg:p-8 lg:pt-12">
              <motion.div
                className="relative mb-4 h-[min(72vw,340px)] w-full max-w-[300px] sm:h-[min(65vw,380px)] sm:max-w-[340px] lg:mb-0 lg:h-[min(420px,48vh)] lg:max-w-none lg:flex-1 lg:min-h-[360px]"
                initial={{ opacity: 0, scale: 1.04 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={viewportOnce}
                transition={mt(
                  reduce
                    ? { duration: 0.01, delay: 0.06 }
                    : { type: "spring", stiffness: 280, damping: 28, delay: 0.06 },
                )}
              >
                <Image
                  src={heroPortrait}
                  alt={t("heroTeacherAlt")}
                  fill
                  className="object-cover object-[center_12%]"
                  sizes="(max-width: 1024px) 90vw, 420px"
                  priority
                />
                <motion.div
                  className="absolute bottom-3 start-3 z-20 w-[calc(100%-1.5rem)] max-w-[280px] rounded-[14px] bg-[#003380] px-4 py-3 text-center text-white shadow-lg sm:bottom-4 sm:start-4 lg:bottom-5 lg:start-5 lg:text-start"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={viewportOnce}
                  transition={mt(
                    reduce
                      ? { duration: 0.01, delay: 0.2 }
                      : { type: "spring", stiffness: 340, damping: 24, delay: 0.28 },
                  )}
                >
                  <p className="text-[15px] font-bold">{t("heroTeacherName")}</p>
                  {/* <p className="mt-0.5 text-[13px] font-medium text-white/90">
                    {t("heroTeacherTitle")}
                  </p>
                  <p className="mt-1 text-[12px] text-white/75">{t("heroTeacherBio")}</p> */}
                </motion.div>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            className="relative flex flex-1 flex-col justify-center bg-white px-5 py-8 sm:px-8 lg:py-10 lg:ps-12 lg:pe-10"
            initial={{ opacity: 0, x: copyEnterX }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewportOnce}
            transition={mt({ duration: 0.72, ease: easeOut, delay: 0.06 })}
          >
            <motion.button
              type="button"
              onClick={() =>
                setIndex((i) => (i - 1 + slideKeys.length) % slideKeys.length)
              }
              className="absolute start-3 top-1/2 z-20 hidden size-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#E0E8F0] bg-white text-[#0047AB] shadow-sm transition hover:bg-[#F5F8FC] md:flex"
              aria-label={t("heroPrev")}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              transition={{ type: "spring", stiffness: 500, damping: 22 }}
            >
              <PrevIcon className="size-5" />
            </motion.button>
            <motion.button
              type="button"
              onClick={() => setIndex((i) => (i + 1) % slideKeys.length)}
              className="absolute end-3 top-1/2 z-20 hidden size-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#E0E8F0] bg-white text-[#0047AB] shadow-sm transition hover:bg-[#F5F8FC] md:flex"
              aria-label={t("heroNext")}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              transition={{ type: "spring", stiffness: 500, damping: 22 }}
            >
              <NextIcon className="size-5" />
            </motion.button>

            <div className="min-h-[8.5rem] sm:min-h-[9rem]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={`${index}-${title}`}
                  initial={{ opacity: 0, y: reduce ? 0 : 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: reduce ? 0 : -10 }}
                  transition={mt({ duration: 0.42, ease: easeOut })}
                >
                  <h1 className="text-balance text-[28px] font-extrabold leading-[1.25] text-[#003380] sm:text-[32px] lg:text-[36px]">
                    {title}
                  </h1>
                  <p className="mt-4 max-w-[520px] text-[15px] leading-relaxed text-[#4A4A4A] sm:text-[16px]">
                    {subtitle}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <motion.ul
              className="mt-8 grid grid-cols-2 gap-4 sm:flex sm:flex-wrap sm:justify-between sm:gap-6"
              variants={staggerParent}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
            >
              {featureDefs.map(({ Icon, key }) => (
                <motion.li
                  key={key}
                  variants={staggerItem}
                  className="flex flex-col items-center gap-2 text-center sm:min-w-[100px]"
                  whileHover={reduce ? undefined : { y: -3 }}
                  transition={{ type: "spring", stiffness: 420, damping: 22 }}
                >
                  <span className="flex size-12 items-center justify-center rounded-full border border-[#0047AB]/20 bg-[#0047AB]/[0.06] text-[#0047AB]">
                    <Icon className="size-6 stroke-[1.75]" aria-hidden />
                  </span>
                  <span className="text-[13px] font-semibold text-[#003380]">{t(key)}</span>
                </motion.li>
              ))}
            </motion.ul>

            <motion.div
              className="mt-10 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={mt({ duration: 0.5, delay: 0.1, ease: easeOut })}
            >
              <motion.span className="inline-flex" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  id="cta"
                  href="#"
                  className="inline-flex h-[52px] items-center justify-center gap-2 rounded-[14px] bg-[#0047AB] px-8 text-[16px] font-bold text-white shadow-md transition hover:bg-[#003d96] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0047AB]"
                >
                  <span>{t("heroCta")}</span>
                  {reduce ? (
                    dir === "rtl" ? (
                      <ArrowLeft className="size-5 shrink-0" aria-hidden />
                    ) : (
                      <ArrowRight className="size-5 shrink-0" aria-hidden />
                    )
                  ) : dir === "rtl" ? (
                    <motion.span
                      className="inline-flex"
                      animate={{ x: [0, -4, 0] }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <ArrowLeft className="size-5 shrink-0" aria-hidden />
                    </motion.span>
                  ) : (
                    <motion.span
                      className="inline-flex"
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <ArrowRight className="size-5 shrink-0" aria-hidden />
                    </motion.span>
                  )}
                </Link>
              </motion.span>
            </motion.div>

            <motion.div
              className="mt-8 flex justify-center gap-2 md:mt-10"
              role="tablist"
              aria-label={t("heroDots")}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={viewportOnce}
              transition={mt({ delay: 0.2, duration: 0.38 })}
            >
              {slideKeys.map((_, i) => (
                <motion.button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  onClick={() => setIndex(i)}
                  className={`size-2.5 rounded-full transition-colors ${
                    i === index
                      ? "bg-[#0047AB]"
                      : "bg-[#0047AB]/25 hover:bg-[#0047AB]/45"
                  }`}
                  aria-label={t("heroDotLabel", { n: i + 1 })}
                  animate={{ scale: i === index ? 1.15 : 1 }}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 500, damping: 26 }}
                />
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}
