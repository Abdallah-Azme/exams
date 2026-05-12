"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";

import logoSrc from "../images/blue-star.png";
import { easeOut } from "@/src/modules/ikhtibar/animation";
import { useIkhtibarLocale } from "@/src/modules/ikhtibar/i18n/ikhtibar-locale-context";
import { useIkhtibarMotion } from "@/src/modules/ikhtibar/use-ikhtibar-motion";

const navItems = [
  { href: "#hero", labelKey: "navHome" as const, active: true },
  { href: "#", labelKey: "navFeatures" as const },
  { href: "#", labelKey: "navCourses" as const },
  { href: "#", labelKey: "navAbout" as const },
  { href: "#", labelKey: "navContact" as const },
];

export function IkhtibarHeader() {
  const { mt } = useIkhtibarMotion();
  const { t, locale, setLocale, ikhtibarHref } = useIkhtibarLocale();

  return (
    <motion.header
      className="sticky top-0 z-50 border-b border-[#E8EEF5] bg-white/95 backdrop-blur-sm"
      initial={{ opacity: 0, y: -18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={mt({ duration: 0.52, ease: easeOut })}
    >
      <div className="mx-auto flex h-[72px] max-w-[1200px] items-center justify-between gap-4 px-4 sm:gap-6 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={mt({ duration: 0.48, ease: easeOut, delay: 0.06 })}
        >
          <Link
            href={ikhtibarHref()}
            className="flex shrink-0 items-center"
            aria-label={t("brandAria")}
          >
            <motion.span
              className="inline-flex shrink-0"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
            >
              <Image
                src={logoSrc}
                alt=""
                width={240}
                height={72}
                className="h-9 w-auto max-w-[min(200px,70vw)] object-contain sm:h-10 sm:max-w-[240px]"
                sizes="240px"
                priority
                aria-hidden
              />
            </motion.span>
          </Link>
        </motion.div>

        <nav
          className="hidden items-center gap-6 md:flex lg:gap-8"
          aria-label={t("navMain")}
        >
          {navItems.map((item, i) => (
            <motion.span
              key={item.labelKey}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={mt({
                duration: 0.42,
                ease: easeOut,
                delay: 0.1 + i * 0.055,
              })}
              className="inline-flex"
            >
              <Link
                href={item.href.startsWith("#") ? ikhtibarHref(item.href) : item.href}
                className={`text-[15px] font-medium transition-colors hover:text-[#0047AB] ${
                  item.active
                    ? "relative text-[#0047AB] after:absolute after:start-0 after:top-full after:mt-1 after:h-0.5 after:w-full after:rounded-full after:bg-[#0047AB]"
                    : "text-[#4A4A4A]"
                }`}
              >
                {t(item.labelKey)}
              </Link>
            </motion.span>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <div
            className="flex items-center gap-1 rounded-[12px] border border-[#E0E8F0] bg-[#F7F9FC] p-0.5"
            role="group"
            aria-label={t("langSwitchLabel")}
          >
            {(["ar", "en"] as const).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setLocale(code)}
                className={`rounded-[10px] px-2.5 py-1.5 text-[12px] font-bold transition sm:px-3 sm:text-[13px] ${
                  locale === code
                    ? "bg-white text-[#0047AB] shadow-sm"
                    : "text-[#4A4A4A] hover:text-[#0047AB]"
                }`}
                aria-pressed={locale === code}
              >
                {code === "ar" ? t("langAr") : t("langEn")}
              </button>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={mt({ type: "spring", stiffness: 380, damping: 26, delay: 0.28 })}
          >
            <motion.span className="inline-flex" whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
              <Link
                href={ikhtibarHref("#cta")}
                className="rounded-[14px] bg-[#0047AB] px-3 py-2.5 text-[13px] font-bold text-white shadow-sm transition hover:bg-[#003d96] sm:px-5 sm:text-[14px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0047AB]"
              >
                {t("ctaHeader")}
              </Link>
            </motion.span>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
}
