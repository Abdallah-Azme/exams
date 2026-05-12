"use client";

import Link from "next/link";
import { Star, Youtube, Facebook, Instagram } from "lucide-react";
import { motion } from "motion/react";

import {
  easeOut,
  staggerItem,
  staggerParent,
  viewportOnce,
} from "@/src/modules/ikhtibar/animation";
import type { IkhtibarMessageKey } from "@/src/modules/ikhtibar/i18n/ikhtibar-dictionaries";
import { useIkhtibarLocale } from "@/src/modules/ikhtibar/i18n/ikhtibar-locale-context";
import { useIkhtibarMotion } from "@/src/modules/ikhtibar/use-ikhtibar-motion";

function XIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const socialDefs = [
  { href: "#", labelKey: "socialYoutube" as const, Icon: Youtube },
  { href: "#", labelKey: "socialFacebook" as const, Icon: Facebook },
  { href: "#", labelKey: "socialInstagram" as const, Icon: Instagram },
  { href: "#", labelKey: "socialX" as const, Icon: XIcon },
] as const;

export function IkhtibarFooter() {
  const { mt, reduce } = useIkhtibarMotion();
  const { t, ikhtibarHref, dir } = useIkhtibarLocale();

  const footerColumns: {
    titleKey: IkhtibarMessageKey;
    links: { href: string; labelKey: IkhtibarMessageKey }[];
  }[] = [
    {
      titleKey: "footerPlatform",
      links: [
        { href: ikhtibarHref("#hero"), labelKey: "navHome" },
        { href: "#", labelKey: "navFeatures" },
        { href: "#", labelKey: "navCourses" },
      ],
    },
    {
      titleKey: "footerSupport",
      links: [
        { href: "#", labelKey: "navContact" },
        { href: "#", labelKey: "footerFaq" },
        { href: "#", labelKey: "footerPrivacy" },
      ],
    },
  ];

  return (
    <motion.footer
      className="border-t border-white/10 bg-[#002a66] text-white"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={viewportOnce}
      transition={mt({ duration: 0.5, ease: easeOut })}
    >
      <div className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6 lg:px-8">
        <motion.div
          className="grid gap-10 md:grid-cols-12 md:gap-8"
          variants={staggerParent}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <motion.div variants={staggerItem} className="md:col-span-4">
            <Link href={ikhtibarHref()} className="inline-flex items-center gap-2 text-white">
              <Star className="size-7 fill-white stroke-white" strokeWidth={1.5} aria-hidden />
              <span className="text-xl font-extrabold">{t("brandName")}</span>
            </Link>
            <p className="mt-4 max-w-sm text-[14px] leading-relaxed text-white/75">{t("footerBlurb")}</p>
            <motion.div
              className="mt-6 flex items-center gap-3"
              variants={staggerParent}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
            >
              {socialDefs.map(({ href, labelKey, Icon }) => (
                <motion.span key={labelKey} variants={staggerItem} className="inline-flex">
                  <motion.a
                    href={href}
                    className="flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                    aria-label={t(labelKey)}
                    whileHover={reduce ? undefined : { y: -3, scale: 1.06, backgroundColor: "rgba(255,255,255,0.22)" }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 420, damping: 20 }}
                  >
                    <Icon className="size-5" />
                  </motion.a>
                </motion.span>
              ))}
            </motion.div>
          </motion.div>

          {footerColumns.map((col) => (
            <motion.div key={col.titleKey} variants={staggerItem} className="md:col-span-2">
              <p className="text-[15px] font-bold text-white">{t(col.titleKey)}</p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.labelKey}>
                    <Link
                      href={l.href}
                      className="text-[14px] text-white/75 transition hover:text-white"
                    >
                      {t(l.labelKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          <motion.div variants={staggerItem} className="md:col-span-4">
            <p className="text-[15px] font-bold text-white">{t("footerNewsletter")}</p>
            <p className="mt-3 text-[14px] text-white/75">{t("footerNewsletterHint")}</p>
            <form className="mt-4 flex flex-col gap-2 sm:flex-row" action="#" method="get">
              <motion.input
                type="email"
                dir="ltr"
                placeholder={t("emailPlaceholder")}
                className="h-11 flex-1 rounded-[12px] border border-white/15 bg-white/10 px-4 text-[14px] text-white placeholder:text-white/45 focus:border-white/40 focus:outline-none"
                initial={{ opacity: 0, x: dir === "rtl" ? 12 : -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={viewportOnce}
                transition={mt({ duration: 0.45, delay: 0.08, ease: easeOut })}
              />
              <motion.button
                type="button"
                className="h-11 shrink-0 rounded-[12px] bg-[#0047AB] px-5 text-[14px] font-bold text-white transition hover:bg-[#0056c8]"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 450, damping: 22 }}
              >
                {t("footerSubscribe")}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-[13px] text-white/55 md:flex-row"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={viewportOnce}
          transition={mt({ delay: 0.15, duration: 0.45 })}
        >
          <p>{t("footerCopyright", { year: new Date().getFullYear() })}</p>
          <p className="text-white/45">{t("footerTagline")}</p>
        </motion.div>
      </div>
    </motion.footer>
  );
}
