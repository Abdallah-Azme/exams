"use client";

import { Quote } from "lucide-react";
import { motion } from "motion/react";

import {
  fadeUp,
  staggerItem,
  staggerParent,
  viewportOnce,
} from "@/src/modules/ikhtibar/animation";
import { useIkhtibarLocale } from "@/src/modules/ikhtibar/i18n/ikhtibar-locale-context";
import { useIkhtibarMotion } from "@/src/modules/ikhtibar/use-ikhtibar-motion";

const testimonialDefs = [
  { seed: "mohamed", nameKey: "t1Name", roleKey: "t1Role", textKey: "t1Text" },
  { seed: "sara", nameKey: "t2Name", roleKey: "t2Role", textKey: "t2Text" },
  { seed: "khaled", nameKey: "t3Name", roleKey: "t3Role", textKey: "t3Text" },
] as const;

function Stars({ label }: { label: string }) {
  return (
    <div className="flex gap-0.5" aria-label={label}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className="text-[#FFD700]" aria-hidden>
          ★
        </span>
      ))}
    </div>
  );
}

export function IkhtibarTestimonials() {
  const { mt, reduce } = useIkhtibarMotion();
  const { t } = useIkhtibarLocale();

  return (
    <motion.section
      id="testimonials"
      className="bg-[#F7F9FC] py-16 md:py-20"
      aria-labelledby="testimonials-heading"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={viewportOnce}
      transition={mt({ duration: 0.45 })}
    >
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <motion.h2
          id="testimonials-heading"
          className="text-center text-[26px] font-extrabold text-[#0047AB] md:text-[30px]"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          {t("testimonialsTitle")}
        </motion.h2>

        <motion.ul
          className="mt-12 grid gap-6 md:grid-cols-3 md:gap-8"
          variants={staggerParent}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          {testimonialDefs.map((card, cardIndex) => {
            const name = t(card.nameKey);
            return (
              <motion.li
                key={card.seed}
                variants={staggerItem}
                className="relative overflow-hidden rounded-[16px] bg-white p-6 shadow-[0_8px_30px_rgba(0,51,128,0.08)] ring-1 ring-black/[0.03]"
                whileHover={
                  reduce
                    ? undefined
                    : {
                        y: -6,
                        boxShadow: "0 20px 50px rgba(0,55,128,0.12)",
                        transition: { type: "spring", stiffness: 360, damping: 22 },
                      }
                }
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.6, rotate: -12 }}
                  whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                  viewport={viewportOnce}
                  transition={mt({
                    delay: 0.08 + cardIndex * 0.06,
                    type: "spring",
                    stiffness: 260,
                    damping: 18,
                  })}
                  className="pointer-events-none absolute start-4 top-4"
                >
                  <Quote
                    className="size-8 text-[#0047AB]/15"
                    strokeWidth={1.25}
                    aria-hidden
                  />
                </motion.div>
                <div className="relative flex flex-col items-center text-center">
                  <motion.div
                    className="size-16 shrink-0 overflow-hidden rounded-full border-2 border-[#0047AB]/20 bg-[#E8EEF5] bg-cover bg-center shadow-inner"
                    style={{
                      backgroundImage: `url(https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(card.seed)})`,
                    }}
                    role="img"
                    aria-label={t("testimonialsAvatar", { name })}
                    initial={{ opacity: 0, scale: 0.85 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={viewportOnce}
                    transition={mt({ type: "spring", stiffness: 320, damping: 20, delay: 0.05 })}
                  />
                  <p className="mt-4 text-[16px] font-bold text-[#003380]">{name}</p>
                  <p className="mt-1 text-[13px] text-[#4A4A4A]/85">{t(card.roleKey)}</p>
                  <div className="mt-3">
                    <Stars label={t("testimonialsStars")} />
                  </div>
                  <p className="mt-4 text-[14px] leading-[1.75] text-[#4A4A4A]">{t(card.textKey)}</p>
                </div>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </motion.section>
  );
}
